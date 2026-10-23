import {randomBytes,createHash} from 'node:crypto';
import {allowed,special,visible} from './access.mjs';
import {privileged,student} from './accounts.mjs';
const fail=(text,status=400)=>{throw Object.assign(Error(text),{status});};
const state=db=>db.organizer||{notes:[],todos:[],events:[]};
const canCalendar=user=>allowed(user,'hearings');
const manageCalendar=user=>canCalendar(user)&&special(user,'calendarManage')&&!student(user);
const sharedWrite=user=>allowed(user,'tasks')&&allowed(user,'tasks','edit')&&!student(user);
function caseVisible(item,user,db){return !item.caseId||db.records.some(r=>r.type==='cases'&&r.id===item.caseId&&visible(r,user,db));}
export function organizerVisible(kind,item,user,db){
 if(user.active===false)return false;
 if(kind==='notes'||kind==='todos'&&item.scope==='private')return item.createdBy===user.id;
 if(kind==='todos')return allowed(user,'tasks')&&(item.createdBy===user.id||item.assignees.includes(user.id)||privileged(user));
 return canCalendar(user)&&caseVisible(item,user,db)&&(item.allTeam||item.createdBy===user.id||item.attendees.includes(user.id)||privileged(user));
}
function capabilities(kind,item,user){
 if(kind==='notes'||kind==='todos'&&item.scope==='private')return {edit:item.createdBy===user.id,remove:item.createdBy===user.id,complete:item.createdBy===user.id};
 if(kind==='events')return {edit:manageCalendar(user),remove:manageCalendar(user)};
 const edit=sharedWrite(user)&&(item.createdBy===user.id||privileged(user));return {edit,remove:edit,complete:sharedWrite(user)&&(edit||item.assignees.includes(user.id)),completeAll:edit};
}
function present(kind,item,user){const {requestId,requestFingerprint,...data}=item;return {...data,capabilities:capabilities(kind,item,user)};}
export function organizerEvents(user,db){
 const events=state(db).events.filter(e=>organizerVisible('events',e,user,db)).map(e=>({...present('events',e,user),source:'calendar'}));
 if(canCalendar(user))for(const r of db.records)if(r.type==='hearings'&&r.date&&!['Archiviert','Abgeschlossen','Abgelehnt','Vorgelegt'].includes(r.status)&&visible(r,user,db))events.push({id:'hearing-'+r.id,recordId:r.id,title:r.title,description:r.description||'',startAt:r.date,endAt:'',status:'Geplant',source:'hearing',capabilities:{edit:false,remove:false}});
 return events;
}
export function organizerSnapshot(user,db){const data=state(db);return {notes:data.notes.filter(n=>organizerVisible('notes',n,user,db)).map(n=>present('notes',n,user)),todos:data.todos.filter(t=>organizerVisible('todos',t,user,db)).map(t=>present('todos',t,user)),events:organizerEvents(user,db),canManageCalendar:manageCalendar(user),canCreateShared:sharedWrite(user)&&allowed(user,'tasks','create'),canAssign:special(user,'assignments')};}
function text(input,key,max,required=false){if(typeof input[key]!=='string'||input[key].length>max||required&&!input[key].trim())fail('Ungültiges Feld: '+key);return input[key].trim();}
function timestamp(value,key,optional=false){if(optional&&(value===''||value==null))return '';if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value)||!Number.isFinite(Date.parse(value)))fail('Ungültiger Zeitpunkt: '+key);return new Date(value).toISOString();}
function people(value,db){if(!Array.isArray(value)||value.length>50||value.some(id=>typeof id!=='string'||!db.users.some(u=>u.id===id&&u.active!==false)))fail('Ungültige Teilnehmerauswahl.');return [...new Set(value)];}
function payload(kind,input,user,db,existing){
 const common={title:text(input,'title',200,true),description:text(input,'description',20000)};
 if(kind==='notes'){if(typeof input.pinned!=='boolean'||typeof input.archived!=='boolean')fail('Ungültige Notizeinstellung.');return {...common,section:text(input,'section',80,true),pinned:input.pinned,archived:input.archived};}
 if(kind==='todos'){
  const scope=existing?.scope||input.scope;if(!['private','shared'].includes(scope))fail('Ungültige Aufgabenart.');if(existing&&input.scope!==scope)fail('Die Sichtbarkeit einer Aufgabe kann nachträglich nicht geändert werden.');
  if(scope==='shared'&&(!sharedWrite(user)||!existing&&!allowed(user,'tasks','create')))fail('Für gemeinsame Aufgaben fehlen die Aufgabenrechte.',403);
  const assignees=scope==='private'?[user.id]:people(input.assignees,db);if(!assignees.length)fail('Mindestens eine zuständige Person auswählen.');
  if(scope==='shared'){
   if(assignees.some(id=>!allowed(db.users.find(u=>u.id===id),'tasks')))fail('Eine zuständige Person besitzt kein Aufgaben-Leserecht.');
   const previous=existing?.assignees||[];if(assignees.some(id=>id!==user.id&&!previous.includes(id))&&!special(user,'assignments'))fail('Zum Zuweisen weiterer Personen fehlt das Zuteilungsrecht.',403);
  }
  return {...common,scope,assignees,dueAt:timestamp(input.dueAt,'Fälligkeit',true),completedBy:(existing?.completedBy||[]).filter(id=>assignees.includes(id))};
 }
 if(!manageCalendar(user))fail('Zum Anlegen oder Bearbeiten von Terminen fehlt das Recht „Kalender verwalten“.',403);
 const startAt=timestamp(input.startAt,'Beginn'),endAt=timestamp(input.endAt,'Ende');if(Date.parse(endAt)<=Date.parse(startAt))fail('Das Terminende muss nach dem Beginn liegen.');
 if(typeof input.allTeam!=='boolean'||!['Geplant','Abgesagt','Abgeschlossen'].includes(input.status))fail('Ungültige Termineinstellung.');
 const attendees=people(input.attendees,db);if(!input.allTeam&&!attendees.length)fail('Mindestens eine eingeladene Person auswählen.');
 const caseId=input.caseId||'';if(typeof caseId!=='string'||!caseVisible({caseId},user,db))fail('Die verknüpfte Fallakte ist nicht zugänglich.',403);
 return {...common,startAt,endAt,allTeam:input.allTeam,attendees,status:input.status,location:text(input,'location',300),caseId};
}
function setCompletion(item){const done=item.assignees.every(id=>item.completedBy.includes(id));item.completedAt=done?(item.completedAt||new Date().toISOString()):'';}
export function mutateOrganizer(kind,method,id,input,user,db){
 if(user.active===false)fail('Zugang gesperrt.',403);
 if(!['POST','PATCH','DELETE'].includes(method))fail('Methode nicht unterstützt.',405);
 if(!['notes','todos','events'].includes(kind))fail('Bereich nicht gefunden.',404);
 const data=state(db),items=data[kind],existing=id&&items.find(e=>e.id===id);
 if(id&&(!existing||!organizerVisible(kind,existing,user,db)))fail('Eintrag nicht gefunden.',404);
 if(existing){if(typeof input.expectedUpdatedAt!=='string'||input.expectedUpdatedAt!==existing.updatedAt)fail('Dieser Eintrag wurde inzwischen geändert. Bitte neu laden.',409);}
 if(method==='POST'&&!id){
  if(typeof input.requestId!=='string'||!/^[A-Za-z0-9-]{16,100}$/.test(input.requestId))fail('Ungültige Entwurfskennung.');
  const fields=payload(kind,input,user,db),requestFingerprint=createHash('sha256').update(JSON.stringify(fields)).digest('hex');
  const previous=items.find(e=>e.createdBy===user.id&&e.requestId===input.requestId);if(previous){if(!organizerVisible(kind,previous,user,db))fail('Eintrag nicht gefunden.',404);if(previous.requestFingerprint!==requestFingerprint)fail('Dieser Sendeversuch wurde bereits mit anderem Inhalt gespeichert. Bitte neu laden.',409);return {item:present(kind,previous,user),changed:false};}
  const now=new Date().toISOString();const item={...fields,id:randomBytes(12).toString('hex'),createdBy:user.id,updatedBy:user.id,createdAt:now,updatedAt:now,requestId:input.requestId,requestFingerprint};if(kind==='todos')setCompletion(item);db.organizer??={notes:[],todos:[],events:[]};db.organizer[kind].push(item);return {item:present(kind,item,user),changed:true};
 }
 if(!existing)fail('Eintrag nicht gefunden.',404);
 const cap=capabilities(kind,existing,user);
 if(method==='DELETE'){if(!cap.remove)fail('Du darfst diesen Eintrag nicht löschen.',403);db.organizer[kind]=items.filter(e=>e.id!==id);return {item:{ok:true},changed:true};}
 if(method!=='PATCH')fail('Funktion nicht gefunden.',404);
 if(kind==='todos'&&input.action==='complete'){
  if(!cap.complete)fail('Du darfst diese Aufgabe nicht abschließen.',403);if('all' in input&&typeof input.all!=='boolean')fail('Ungültige Erledigungsauswahl.');if(typeof input.done!=='boolean')fail('Ungültiger Erledigungsstand.');
  if(input.all){if(!cap.completeAll)fail('Nur die Aufgabenverwaltung darf alle Teile abschließen.',403);existing.completedBy=input.done?[...existing.assignees]:[];}
  else existing.completedBy=input.done?[...new Set([...existing.completedBy,user.id])].filter(id=>existing.assignees.includes(id)):existing.completedBy.filter(id=>id!==user.id);
  setCompletion(existing);
 }else{if(!cap.edit)fail('Du darfst diesen Eintrag nicht bearbeiten.',403);Object.assign(existing,payload(kind,input,user,db,existing));if(kind==='todos')setCompletion(existing);}
 existing.updatedBy=user.id;existing.updatedAt=new Date(Math.max(Date.now(),Date.parse(existing.updatedAt)+1)).toISOString();return {item:present(kind,existing,user),changed:true};
}
