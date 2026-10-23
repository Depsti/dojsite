import {randomBytes} from 'node:crypto';
import {visible,canComment} from './access.mjs';
import {privileged} from './accounts.mjs';
import {rankFor} from './ranks.mjs';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
const validId=value=>typeof value==='string'&&/^[a-f0-9]{24}$/.test(value);
export function chatCase(caseId,user,db,write=false){const record=db.records.find(r=>r.id===caseId&&r.type==='cases');if(!record||!visible(record,user,db))fail('Fallakte nicht gefunden.',404);if(write&&(record.status==='Archiviert'||!canComment(record,user,db)))fail('Für diesen Fallchat besteht nur Lesezugriff.',403);return record;}
export function validateChatInput(input,user,db){
 if(typeof input.text!=='string'||input.text.length>5000)fail('Nachrichten dürfen maximal 5.000 Zeichen enthalten.');
 if(!Array.isArray(input.references)||input.references.length>10)fail('Maximal zehn Verweise pro Nachricht.');
 const refs=[...new Set(input.references)];for(const id of refs){if(!validId(id)||!db.records.some(r=>r.id===id&&visible(r,user,db)))fail('Ein Verweis ist nicht zugänglich.',403);}
 if(!input.text.trim()&&!refs.length)fail('Bitte eine Nachricht oder einen Verweis eingeben.');
 if(input.replyTo!=null&&!validId(input.replyTo))fail('Ungültige Antwort.');
 if(typeof input.nonce!=='string'||!/^[a-zA-Z0-9-]{8,100}$/.test(input.nonce))fail('Ungültige Nachrichtenkennung.');
 return {text:input.text.trim(),refs,reply:input.replyTo||null,nonce:input.nonce};
}
export function chatAuthor(id,db){const user=db.users.find(u=>u.id===id);return {id,name:user?.name||'Ehemaliger Mitarbeiter',rank:rankFor(user)};}
export function presentMessage(row,user,db,reactions=[],replies=[]){
 const parent=replies.find(r=>r.id===row.reply_to&&r.case_id===row.case_id);
 return {id:row.id,seq:String(row.seq),author:chatAuthor(row.author_id,db),text:row.deleted_at?'Nachricht gelöscht.':row.body,createdAt:row.created_at,updatedAt:row.updated_at,edited:!row.deleted_at&&!!row.edit_history?.length,deleted:!!row.deleted_at,
  reply:parent?{id:parent.id,author:chatAuthor(parent.author_id,db),text:parent.deleted_at?'Nachricht gelöscht.':parent.body.slice(0,280)}:null,
  references:row.deleted_at?[]:(row.reference_ids||[]).map(id=>{const r=db.records.find(r=>r.id===id);return r&&visible(r,user,db)?{available:true,id:r.id,type:r.type,title:r.title,reference:r.reference||''}:{available:false};}),
  reactions:Object.fromEntries(['check','cross'].map(kind=>{const list=reactions.filter(r=>r.message_id===row.id&&r.kind===kind);return [kind,{count:list.length,mine:list.some(r=>r.user_id===user.id),users:list.map(r=>chatAuthor(r.user_id,db))}];})),
  canEdit:!row.deleted_at&&row.author_id===user.id,canDelete:!row.deleted_at&&(row.author_id===user.id||privileged(user))};
}
export async function handleChat({path,method,query,user,db,store,body}){
 if(path==='/api/chat/summary'&&method==='GET'){
  const cases=db.records.filter(r=>r.type==='cases'&&visible(r,user,db));const counts=await store.unread(user.id,cases.map(r=>r.id));
  const unread=new Map(counts.map(c=>[c.case_id,Number(c.unread)]));
  return {cases:cases.filter(r=>query.get('all')==='1'||unread.has(r.id)).map(r=>({id:r.id,title:r.title,reference:r.reference||'',archived:r.status==='Archiviert',unread:unread.get(r.id)||0}))};
 }
 const match=path.match(/^\/api\/cases\/([a-f0-9]{24})\/chat(?:\/(read|messages\/([a-f0-9]{24})(?:\/(reaction))?))?$/);if(!match)return null;
 const caseId=match[1],record=chatCase(caseId,user,db);const writable=record.status!=='Archiviert'&&canComment(record,user,db);
 if(method==='GET'&&!match[2]){
  const before=query.get('before');if(before&&!/^\d{1,16}$/.test(before))fail('Ungültiger Verlauf.');
  const known=(query.get('known')||'').split(',').filter(Boolean);if(known.length>200||known.some(id=>!validId(id)))fail('Ungültiger Nachrichtenabruf.');
  const data=await store.list(caseId,before,known),rows=[...new Map([...data.rows,...data.extra].map(r=>[r.id,r])).values()].sort((a,b)=>Number(a.seq)-Number(b.seq));
  const replyIds=[...new Set(rows.map(r=>r.reply_to).filter(Boolean))],parents=await store.byIds(caseId,replyIds),reactions=await store.reactions(rows.map(r=>r.id));
  return {messages:rows.map(r=>presentMessage(r,user,db,reactions,parents)),hasMore:data.hasMore,before:data.rows.length?String(data.rows[data.rows.length-1].seq):null,canWrite:writable};
 }
 if(method==='POST'&&match[2]==='read'){const input=await body();const seq=Number(input.seq);if(!Number.isSafeInteger(seq)||seq<0)fail('Ungültiger Lesestand.');await store.markRead(caseId,user.id,seq);return {ok:true};}
 chatCase(caseId,user,db,true);
 if(method==='POST'&&!match[2]){
  const input=validateChatInput(await body(),user,db);
  const row=await store.send({p_id:randomBytes(12).toString('hex'),p_case:caseId,p_author:user.id,p_body:input.text,p_refs:input.refs,p_reply:input.reply,p_nonce:input.nonce});return {id:row.id};
 }
 const message=match[3]&&await store.get(caseId,match[3]);if(!message)fail('Nachricht nicht gefunden.',404);
 if(message.deleted_at)fail('Die Nachricht wurde gelöscht.',409);
 if(method==='PUT'&&match[4]==='reaction'){const input=await body();if(![null,'check','cross'].includes(input.kind))fail('Ungültige Reaktion.');await store.react(message.id,user.id,input.kind);return {ok:true};}
 if((method==='PATCH'||method==='DELETE')&&!match[4]){
  if(message.author_id!==user.id&&(method!=='DELETE'||!privileged(user)))fail('Du darfst diese Nachricht nicht ändern.',403);
  const input=await body();if(input.updatedAt!==message.updated_at)fail('Die Nachricht wurde inzwischen geändert.',409);
  const now=new Date().toISOString();const history=[...(message.edit_history||[]),{body:message.body,at:message.updated_at,changedBy:user.id,action:method==='DELETE'?'delete':'edit'}];
  if(method==='PATCH'){if(typeof input.text!=='string'||!input.text.trim()||input.text.length>5000)fail('Bitte 1 bis 5.000 Zeichen eingeben.');await store.update(caseId,message.id,message.updated_at,{body:input.text.trim(),updated_at:now,edit_history:history});}
  else await store.update(caseId,message.id,message.updated_at,{body:'',reference_ids:[],deleted_at:now,deleted_by:user.id,updated_at:now,edit_history:history});return {ok:true};
 }
 fail('Chat-Funktion nicht gefunden.',404);
}