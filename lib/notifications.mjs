import {meetingChatSummary} from './meeting-room.mjs';
import {roomVisible} from './calendar.mjs';
import {createHash,randomBytes} from 'node:crypto';
import {visible,allowed} from './access.mjs';
import {organizerVisible} from './organizer.mjs';

const assigned=r=>[...new Set([r.owner,...(r.assignedProsecutors||[])].filter(Boolean))];
const watch=r=>[...new Set([r.createdBy,...assigned(r)].filter(Boolean))];
const opaque=value=>createHash('sha256').update(value).digest('hex').slice(0,24);
// Only fields needed for changes; file attachments and private note bodies are never copied.
export function notificationSnapshot(db){return structuredClone({records:(db.records||[]).map(r=>({id:r.id,type:r.type,owner:r.owner,assignedProsecutors:r.assignedProsecutors,createdBy:r.createdBy,access:r.access,reviewStatus:r.reviewStatus,submission:r.submission,courtDecision:r.courtDecision,nextStep:r.nextStep,comments:r.comments?.map(c=>({id:c.id}))})),organizer:{todos:db.organizer?.todos||[],events:(db.organizer?.events||[]).map(({room,...e})=>e)},users:(db.users||[]).map(u=>({id:u.id,role:u.role,rank:u.rank,permissions:u.permissions,requiresPasswordChange:u.requiresPasswordChange}))});}
export function collectNotifications(before,db,actorId){
 const now=new Date().toISOString(),events=db.notifications||[];
 function emit(users,message,target){for(const userId of new Set(users.filter(Boolean))){if(userId===actorId||!db.users.some(u=>u.id===userId&&u.active!==false))continue;events.push({id:randomBytes(12).toString('hex'),userId,actorId,at:now,message,target,readAt:null});}}
 const oldRecords=new Map(before.records.map(r=>[r.id,r]));
 for(const r of db.records){const old=oldRecords.get(r.id),target={type:'record',id:r.id};
  const additions=assigned(r).filter(id=>!assigned(old||{}).includes(id));
  if(additions.length)emit(additions,r.type==='cases'?'Du wurdest einer Fallakte zugeteilt.':r.type==='hearings'?'Du wurdest einer Verhandlung zugeteilt.':'Dir wurde ein Eintrag zugewiesen.',target);
  const grants=Object.keys(r.access||{}).filter(id=>!old?.access?.[id]&&!additions.includes(id));if(grants.length)emit(grants,'Du hast Zugriff auf einen Eintrag erhalten.',target);
  if(!old)continue;
  if(r.nextStep&&JSON.stringify(r.nextStep)!==JSON.stringify(old.nextStep))emit([r.nextStep.assigneeId,...watch(r)],'Nächster Schritt einer Fallakte wurde geändert.',{...target,focus:'next-step'});
  if(r.courtDecision?.at&&r.courtDecision.at!==old.courtDecision?.at)emit(watch(r),'Entscheidung zu deinem Antrag: '+r.courtDecision.status+'.',target);
  if(r.reviewStatus!==old.reviewStatus&&r.reviewStatus)emit(watch(r),'Prüfstatus geändert: '+r.reviewStatus+'.',target);
  if(r.submission?.status!==old.submission?.status&&r.submission?.status)emit([r.createdBy],'Deine Vorlage wurde '+r.submission.status.toLocaleLowerCase('de')+'.',target);
  if((r.comments?.length||0)>(old.comments?.length||0))emit(watch(r),'Neuer Kommentar zu deinem Eintrag.',target);
 }
 for(const kind of ['todos','events']){const olds=new Map((before.organizer[kind]||[]).map(i=>[i.id,i]));
  for(const item of db.organizer?.[kind]||[]){if(kind==='todos'&&item.scope!=='shared')continue;const old=olds.get(item.id),members=kind==='todos'?item.assignees||[]:item.attendees||[],previous=kind==='todos'?old?.assignees||[]:old?.attendees||[],target={type:kind,id:item.id};
   emit(members.filter(id=>!previous.includes(id)),kind==='todos'?'Dir wurde eine gemeinsame Aufgabe zugewiesen.':'Du wurdest zu einem Termin eingeladen.',target);
   if(old&&kind==='todos'&&item.completedAt&&!old.completedAt)emit([item.createdBy,...members],'Eine gemeinsame Aufgabe wurde abgeschlossen.',target);
   if(old&&kind==='events')for(const [id,reply] of Object.entries(item.invitations||{})){if(reply.at!==old.invitations?.[id]?.at&&reply.response!=='Ausstehend'&&id!==item.createdBy)emit([item.createdBy],(db.users.find(u=>u.id===id)?.name||'Teilnehmer')+' hat geantwortet: '+reply.response+'.',target);}
   if(old&&kind==='events'&&['startAt','endAt','status','location','title','description'].some(k=>item[k]!==old[k]))emit([item.createdBy,...members],'Ein Termin wurde geändert'+(item.status==='Abgesagt'?' oder abgesagt':'')+'.',target);
  }
 }
 const oldUsers=new Map(before.users.map(u=>[u.id,u]));for(const u of db.users){const old=oldUsers.get(u.id);if(!old)continue;
  if(['role','rank','permissions'].some(k=>JSON.stringify(old[k])!==JSON.stringify(u[k])))emit([u.id],'Deine Dienstrolle oder Berechtigungen wurden geändert.',{type:'account',id:u.id});
  if(u.requiresPasswordChange&&!old.requiresPasswordChange)emit([u.id],'Für deinen Zugang wurde ein Passwortwechsel angefordert.',{type:'account',id:u.id});
 }
 // Keep at most 200 personal events per user, independent of other employees' activity.
 const counts=new Map();db.notifications=events.reverse().filter(e=>{const count=(counts.get(e.userId)||0)+1;counts.set(e.userId,count);return count<=200;}).reverse();
}
export function personalNotifications(db,user){return (db.notifications||[]).filter(e=>e.userId===user.id).flatMap(e=>{
 const t=e.target;let title='Dein Zugang';
 if(t.type==='record'){const r=db.records.find(r=>r.id===t.id);if(!r||!visible(r,user,db))return [];title=[r.reference,r.title].filter(Boolean).join(' · ');}
 else if(['todos','events'].includes(t.type)){const item=db.organizer?.[t.type]?.find(i=>i.id===t.id);if(!item||!organizerVisible(t.type,item,user,db))return [];title=item.title;}
 else if(t.type==='event-chat'){const e=db.organizer?.events.find(e=>e.id===t.id);if(!e||!roomVisible(e,user,db))return [];title=e.title;}
 else if(t.type!=='account'||t.id!==user.id)return [];
 return [{id:e.id,at:e.at,message:e.message,title,target:{...t,...(t.type==='record'?(()=>{const record=db.records.find(r=>r.id===t.id),parent=record.type==='cases'?record:db.records.find(r=>r.id===record.caseId&&visible(r,user,db));return {caseId:parent?.id||'',caseTitle:parent?.title||'',focus:t.focus||(e.message.includes('Kommentar')?'comments':/Prüfstatus|Vorlage|Entscheidung/.test(e.message)?'review':'details')};})():{})},read:!!e.readAt}];
});}
export async function notificationFeed(db,user,store){
 const items=personalNotifications(db,user),receipts=db.notificationReceipts?.[user.id]||[],read=new Set(receipts.map(r=>r.id)),warnings=[];
 for(const e of meetingChatSummary(db,user).events.filter(e=>e.unread)){const id=opaque('event:'+e.id+':'+e.latestSeq);items.push({id,at:e.latestAt,message:e.unread+' ungelesene Nachricht(en) im Terminchat.',title:e.title,target:{type:'event-chat',id:e.id},read:read.has(id)});}
 const results=await Promise.allSettled([
  (async()=>{const cases=db.records.filter(r=>r.type==='cases'&&visible(r,user,db));if(!allowed(user,'cases'))return [];const byId=new Map(cases.map(r=>[r.id,r]));const unread=await store.chat.unread(user.id,cases.map(r=>r.id));return (await Promise.all(unread.filter(r=>Number(r.unread)>0).slice(0,50).map(async r=>{const record=byId.get(r.case_id);if(!record)return null;const latest=await store.chat.latest(record.id,user.id);if(!latest)return null;return {id:opaque('case:'+record.id+':'+latest.seq),at:latest.created_at,message:r.unread+' ungelesene Nachricht(en) im Fallchat.',title:[record.reference,record.title].filter(Boolean).join(' · '),target:{type:'case-chat',id:record.id}};}))).filter(Boolean);})(),
  (async()=>{const rows=await store.directChat.summary(user.id);return (await Promise.all(rows.filter(r=>Number(r.unread)>0).slice(0,50).map(async r=>{const peer=db.users.find(u=>u.id===r.peer_id);if(!peer)return null;const latest=await store.directChat.latest(user.id,peer.id);if(!latest)return null;return {id:opaque('private:'+peer.id+':'+latest.seq),at:latest.created_at,message:r.unread+' ungelesene private Nachricht(en).',title:peer.name,target:{type:'private-chat',id:peer.id}};}))).filter(Boolean);})()
 ]);
 for(const result of results){if(result.status==='fulfilled')items.push(...result.value.map(i=>({...i,read:read.has(i.id)})));else warnings.push('Nachrichtenhinweise konnten nicht vollständig geladen werden.');}
 items.sort((a,b)=>String(b.at).localeCompare(String(a.at))||a.id.localeCompare(b.id));return {items:items.slice(0,300),unread:items.filter(i=>!i.read).length,warning:warnings[0]||''};
}
export function markNotificationsRead(db,user,ids,feed){
 if(!Array.isArray(ids)||ids.length>300||ids.some(id=>typeof id!=='string'||!/^[a-f0-9]{24}$/.test(id)))throw Object.assign(Error('Ungültige Benachrichtigungen.'),{status:400});
 const permitted=new Set(feed.items.map(i=>i.id));if(ids.some(id=>!permitted.has(id)))throw Object.assign(Error('Benachrichtigung ist nicht mehr verfügbar. Bitte neu laden.'),{status:409});
 const selected=new Set(ids),now=new Date().toISOString();for(const e of db.notifications||[])if(e.userId===user.id&&selected.has(e.id))e.readAt=now;
 db.notificationReceipts??={};const receipts=db.notificationReceipts[user.id]||[];db.notificationReceipts[user.id]=[...receipts.filter(r=>!selected.has(r.id)),...ids.map(id=>({id,at:now}))].slice(-500);
}
