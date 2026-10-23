import {randomBytes} from 'node:crypto';
import {chatAuthor,validateChatInput,presentMessage} from './case-chat.mjs';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
export function directPeer(id,user,db,write=false){
 if(user.active===false)fail('Zugang gesperrt.',403);
 const peer=db.users.find(u=>u.id===id&&u.id!==user.id);if(!peer)fail('Mitarbeiter nicht gefunden.',404);
 if(write&&peer.active===false)fail('Dieser Mitarbeiter ist gesperrt. Der Privatchat ist nur lesbar.',403);return peer;
}
export async function handleDirectChat({path,method,query,user,db,store,body}){
 if(path==='/api/chat/private'&&method==='GET'){
  const counts=await store.summary(user.id),byPeer=new Map(counts.map(row=>[row.peer_id,row]));
  return {contacts:db.users.filter(u=>u.id!==user.id&&(u.active!==false||byPeer.has(u.id))).map(peer=>({id:peer.id,...chatAuthor(peer.id,db),active:peer.active!==false,unread:Number(byPeer.get(peer.id)?.unread||0),latestAt:byPeer.get(peer.id)?.latest_at||null}))};
 }
 const match=path.match(/^\/api\/chat\/private\/([a-f0-9]{24})(?:\/(read|messages\/([a-f0-9]{24})(?:\/(reaction))?))?$/);if(!match)return null;
 const peer=directPeer(match[1],user,db),thread=store.thread(user.id,peer.id),threadKey=[user.id,peer.id].sort().join(':'),writable=peer.active!==false;
 if(method==='GET'&&!match[2]){
  const before=query.get('before');if(before&&!/^\d{1,16}$/.test(before))fail('Ungültiger Verlauf.');
  const known=(query.get('known')||'').split(',').filter(Boolean);if(known.length>200||known.some(id=>!/^[a-f0-9]{24}$/.test(id)))fail('Ungültiger Nachrichtenabruf.');
  const data=await thread.list(threadKey,before,known),rows=[...new Map([...data.rows,...data.extra].map(r=>[r.id,r])).values()].sort((a,b)=>Number(a.seq)-Number(b.seq));
  const parents=await thread.byIds(threadKey,[...new Set(rows.map(r=>r.reply_to).filter(Boolean))]),reactions=await thread.reactions(rows.map(r=>r.id));
  return {messages:rows.map(row=>({...presentMessage(row,user,db,reactions,parents),canDelete:!row.deleted_at&&row.author_id===user.id})),canWrite:writable,hasMore:data.hasMore,before:data.rows.length?String(data.rows[data.rows.length-1].seq):null};
 }
 if(method==='POST'&&match[2]==='read'){const input=await body(),seq=Number(input.seq);if(!Number.isSafeInteger(seq)||seq<0)fail('Ungültiger Lesestand.');await thread.markRead(seq);return {ok:true};}
 directPeer(peer.id,user,db,true);
 if(method==='POST'&&!match[2]){const input=validateChatInput(await body(),user,db);const row=await thread.send({p_id:randomBytes(12).toString('hex'),p_sender:user.id,p_recipient:peer.id,p_body:input.text,p_refs:input.refs,p_reply:input.reply,p_nonce:input.nonce});return {id:row.id};}
 const row=match[3]&&await thread.get(threadKey,match[3]);if(!row)fail('Nachricht nicht gefunden.',404);if(row.deleted_at)fail('Die Nachricht wurde gelöscht.',409);
 if(method==='PUT'&&match[4]==='reaction'){const input=await body();if(![null,'check','cross'].includes(input.kind))fail('Ungültige Reaktion.');await thread.react(row.id,user.id,input.kind);return {ok:true};}
 if((method==='PATCH'||method==='DELETE')&&!match[4]){
  if(row.author_id!==user.id)fail('Du darfst nur deine eigenen Privatnachrichten ändern.',403);
  const input=await body();if(input.updatedAt!==row.updated_at)fail('Die Nachricht wurde inzwischen geändert.',409);
  const now=new Date(Math.max(Date.now(),Date.parse(row.updated_at)+1)).toISOString(),history=[...(row.edit_history||[]),{body:row.body,at:row.updated_at,changedBy:user.id,action:method==='DELETE'?'delete':'edit'}];
  if(method==='PATCH'){if(typeof input.text!=='string'||!input.text.trim()||input.text.length>5000)fail('Bitte 1 bis 5.000 Zeichen eingeben.');await thread.update(threadKey,row.id,row.updated_at,{body:input.text.trim(),updated_at:now,edit_history:history});}
  else await thread.update(threadKey,row.id,row.updated_at,{body:'',reference_ids:[],deleted_at:now,deleted_by:user.id,updated_at:now,edit_history:history});return {ok:true};
 }
 fail('Chat-Funktion nicht gefunden.',404);
}
