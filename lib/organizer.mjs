import {ticketVisible,ticketWriter} from './ticket-access.mjs';
import {eventVisible,roomVisible,eventMembers,calendarPreferences,calendarConflicts,checkConflicts,invitationFields} from './calendar.mjs';
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
 if(kind==='todos'&&item.ticketId&&!ticketVisible(db.discordTickets?.find(t=>t.id===item.ticketId),user))return false;
 if(kind==='todos'&&item.eventId&&!db.organizer?.events.some(e=>e.id===item.eventId&&roomVisible(e,user,db)))return false;
 if(kind==='todos')return allowed(user,'tasks')&&(item.createdBy===user.id||item.assignees.includes(user.id)||privileged(user));
 return eventVisible(item,user,db);
}
function capabilities(kind,item,user){
 if(kind==='notes'||kind==='todos'&&item.scope==='private')return {edit:item.createdBy===user.id,remove:item.createdBy===user.id,complete:item.createdBy===user.id};
 if(kind==='events')return {edit:manageCalendar(user),remove:manageCalendar(user)};
 const edit=sharedWrite(user)&&(item.createdBy===user.id||privileged(user));return {edit,remove:edit,complete:sharedWrite(user)&&(edit||item.assignees.includes(user.id)),completeAll:edit};
}
function present(kind,item,user,db){const {requestId,requestFingerprint,room,invitations,invitationHistory,...data}=item;const origin=item.eventId&&db?.organizer?.events.find(e=>e.id===item.eventId&&eventVisible(e,user,db));const ticket=item.ticketId&&db?.discordTickets?.find(t=>t.id===item.ticketId&&ticketVisible(t,user));return {...data,...(ticket?{ticketOrigin:{id:ticket.id,title:ticket.title}}:{}),...(origin?{origin:{id:origin.id,title:origin.title}}:{}),...(kind==='events'?{myInvitation:invitations?.[user.id]||{response:eventMembers(item).includes(user.id)?'Ausstehend':'Nicht eingeladen'},invitations:roomVisible(item,user,db)?invitations||{}:{},scheduleVersion:item.scheduleVersion||item.updatedAt}:{}),capabilities:{...capabilities(kind,item,user),...(kind==='todos'&&item.ticketId&&item.scope==='shared'&&!ticketWriter(ticket,user)?{edit:false,remove:false,complete:false,completeAll:false}:{}),...(kind==='events'?{room:roomVisible(item,user,db),respond:eventMembers(item).includes(user.id)&&item.status==='Geplant'}:{})}};}
export function organizerEvents(user,db){
 const events=state(db).events.filter(e=>organizerVisible('events',e,user,db)).map(e=>({...present('events',e,user,db),source:'calendar'}));
 if(canCalendar(user))for(const r of db.records)if(r.type==='hearings'&&r.date&&!['Archiviert','Abgeschlossen','Abgelehnt','Vorgelegt'].includes(r.status)&&visible(r,user,db))events.push({id:'hearing-'+r.id,recordId:r.id,title:r.title,description:r.description||'',startAt:r.date,endAt:'',status:'Geplant',source:'hearing',caseId:r.caseId||'',owner:r.owner||'',attendees:r.assignedProsecutors||[],capabilities:{edit:false,remove:false}});
 return events;
}
export function organizerSnapshot(user,db){const data=state(db);return {notes:data.notes.filter(n=>organizerVisible('notes',n,user,db)).map(n=>present('notes',n,user,db)),todos:data.todos.filter(t=>organizerVisible('todos',t,user,db)).map(t=>present('todos',t,user,db)),events:organizerEvents(user,db),preferences:calendarPreferences(db,user),canManageCalendar:manageCalendar(user),canCreateShared:sharedWrite(user)&&allowed(user,'tasks','create'),canAssign:special(user,'assignments')};}
function text(input,key,max,required=false){if(typeof input[key]!=='string'||input[key].length>max||required&&!input[key].trim())fail('Ungültiges Feld: '+key);return input[key].trim();}
function timestamp(value,key,optional=false){if(optional&&(value===''||value==null))return '';if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(value)||!Number.isFinite(Date.parse(value)))fail('Ungültiger Zeitpunkt: '+key);return new Date(value).toISOString();}
function people(value,db){if(!Array.isArray(value)||value.length>50||value.some(id=>typeof id!=='string'||!db.users.some(u=>u.id===id&&u.active!==false)))fail('Ungültige Teilnehmerauswahl.');return [...new Set(value)];}
function payload(kind,input,user,db,existing){
 const eventId=existing?.eventId||input.eventId||'';const ownPrivate=existing?.createdBy===user.id&&(kind==='notes'||kind==='todos'&&existing.scope==='private');if(eventId&&!ownPrivate&&!db.organizer?.events.some(e=>e.id===eventId&&roomVisible(e,user,db)))fail('Termin-Arbeitsraum nicht zugänglich.',403);const ticketId=existing?.ticketId||input.ticketId||'';if(ticketId&&!ownPrivate&&!ticketVisible(db.discordTickets?.find(t=>t.id===ticketId),user))fail('Ticket nicht zugänglich.',403);const common={...(ticketId?{ticketId}:{}),title:text(input,'title',200,true),description:text(input,'description',20000),...(eventId?{eventId}:{})};
 if(kind==='notes'){if(typeof input.pinned!=='boolean'||typeof input.archived!=='boolean')fail('Ungültige Notizeinstellung.');return {...common,section:text(input,'section',80,true),pinned:input.pinned,archived:input.archived};}
 if(kind==='todos'){
  const scope=existing?.scope||input.scope;if(!['private','shared'].includes(scope))fail('Ungültige Aufgabenart.');if(existing&&input.scope!==scope)fail('Die Sichtbarkeit einer Aufgabe kann nachträglich nicht geändert werden.');
  if(scope==='shared'&&ticketId&&!ticketWriter(db.discordTickets?.find(t=>t.id===ticketId),user))fail('Ticket-Bearbeitungsrecht fehlt.',403);if(scope==='shared'&&(!sharedWrite(user)||!existing&&!allowed(user,'tasks','create')))fail('Für gemeinsame Aufgaben fehlen die Aufgabenrechte.',403);
  const assignees=scope==='private'?[user.id]:people(input.assignees,db);if(eventId&&scope==='shared'&&assignees.some(id=>!roomVisible(db.organizer.events.find(e=>e.id===eventId),db.users.find(u=>u.id===id),db)))fail('Zuständige müssen Zugriff auf den Termin-Arbeitsraum besitzen.');if(ticketId&&scope==='shared'&&assignees.some(id=>!ticketWriter(db.discordTickets?.find(t=>t.id===ticketId),db.users.find(u=>u.id===id))))fail('Zuständige benötigen Ticket-Bearbeitungsrecht.');if(!assignees.length)fail('Mindestens eine zuständige Person auswählen.');
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
 if(attendees.some(id=>{const p=db.users.find(u=>u.id===id);return !allowed(p,'hearings')||caseId&&!caseVisible({caseId},p,db);}))fail('Eingeladene Personen benötigen Kalender-Leserecht und Zugriff auf die zugehörige Fallakte.');
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
  const previous=items.find(e=>e.createdBy===user.id&&e.requestId===input.requestId);if(previous){if(!organizerVisible(kind,previous,user,db))fail('Eintrag nicht gefunden.',404);if(previous.requestFingerprint!==requestFingerprint)fail('Dieser Sendeversuch wurde bereits mit anderem Inhalt gespeichert. Bitte neu laden.',409);return {item:present(kind,previous,user,db),changed:false};}
  if(kind==='events')checkConflicts(db,user,{...fields,createdBy:user.id},'',input);const now=new Date().toISOString();const item={...fields,id:randomBytes(12).toString('hex'),createdBy:user.id,updatedBy:user.id,createdAt:now,updatedAt:now,requestId:input.requestId,requestFingerprint};if(kind==='todos')setCompletion(item);if(kind==='events')Object.assign(item,invitationFields(fields,null,user));db.organizer??={notes:[],todos:[],events:[]};db.organizer[kind].push(item);return {item:present(kind,item,user,db),changed:true};
 }
 if(!existing)fail('Eintrag nicht gefunden.',404);
 const cap=capabilities(kind,existing,user);if(kind==='todos'&&existing.scope==='shared'&&existing.ticketId&&!ticketWriter(db.discordTickets?.find(t=>t.id===existing.ticketId),user))fail('Ticket-Bearbeitungsrecht fehlt.',403);
 if(method==='DELETE'){if(!cap.remove)fail('Du darfst diesen Eintrag nicht löschen.',403);if(kind==='events'&&(existing.room||db.records.some(r=>r.eventId===id)||data.todos.some(t=>t.eventId===id&&t.scope==='shared')))fail('Dieser Termin besitzt verknüpfte Arbeitsdaten. Bitte absagen oder abschließen, damit sie erhalten bleiben.',409);db.organizer[kind]=items.filter(e=>e.id!==id);return {item:{ok:true},changed:true};}
 if(method!=='PATCH')fail('Funktion nicht gefunden.',404);
 if(kind==='todos'&&input.action==='complete'){
  if(!cap.complete)fail('Du darfst diese Aufgabe nicht abschließen.',403);if('all' in input&&typeof input.all!=='boolean')fail('Ungültige Erledigungsauswahl.');if(typeof input.done!=='boolean')fail('Ungültiger Erledigungsstand.');
  if(input.all){if(!cap.completeAll)fail('Nur die Aufgabenverwaltung darf alle Teile abschließen.',403);existing.completedBy=input.done?[...existing.assignees]:[];}
  else existing.completedBy=input.done?[...new Set([...existing.completedBy,user.id])].filter(id=>existing.assignees.includes(id)):existing.completedBy.filter(id=>id!==user.id);
  setCompletion(existing);
 }else{if(!cap.edit)fail('Du darfst diesen Eintrag nicht bearbeiten.',403);const fields=payload(kind,input,user,db,existing);if(kind==='events'){checkConflicts(db,user,{...fields,createdBy:existing.createdBy},existing.id,input);Object.assign(fields,invitationFields(fields,existing,user));}Object.assign(existing,fields);if(kind==='todos')setCompletion(existing);}
 existing.updatedBy=user.id;existing.updatedAt=new Date(Math.max(Date.now(),Date.parse(existing.updatedAt)+1)).toISOString();return {item:present(kind,existing,user,db),changed:true};
}

export function previewCalendarEvent(db,user,input){const existing=input.id&&db.organizer?.events.find(e=>e.id===input.id);if(input.id&&(!existing||!organizerVisible('events',existing,user,db)))fail('Termin nicht zugänglich.',404);const fields=payload('events',input,user,db,existing);return {conflicts:calendarConflicts(db,user,{...fields,createdBy:existing?.createdBy||user.id},existing?.id)};}
