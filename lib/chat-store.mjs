export function createChatStore(request){
 const call=async(...args)=>{try{return await request(...args);}catch(error){if(/HTTP 404/.test(error.message))throw Object.assign(Error('Der Fallchat ist noch nicht eingerichtet. Bitte die Supabase-Migration 20261023_case_chat.sql ausführen.'),{status:503});throw error;}};
 const eq=v=>encodeURIComponent(String(v));const ids=values=>values.join(',');
 return {
  list:async(caseId,before,known=[])=>{
   const recent=await call('doj_case_messages',`?case_id=eq.${eq(caseId)}&order=seq.desc&limit=51${before?'&seq=lt.'+eq(before):''}`);
   const extra=known.length?await call('doj_case_messages',`?case_id=eq.${eq(caseId)}&id=in.(${ids(known)})`):[];
   return {rows:recent.slice(0,50),extra,hasMore:recent.length>50};
  },
  byIds:(caseId,values)=>values.length?call('doj_case_messages',`?case_id=eq.${eq(caseId)}&id=in.(${ids(values)})`):Promise.resolve([]),
  get:async(caseId,id)=>(await call('doj_case_messages',`?case_id=eq.${eq(caseId)}&id=eq.${eq(id)}&limit=1`))[0],
  reactions:values=>values.length?call('doj_case_reactions',`?message_id=in.(${ids(values)})`):Promise.resolve([]),
  send:async data=>(await call('rpc/doj_chat_send','','POST',data))[0],
  update:async(caseId,id,stamp,data)=>{const rows=await call('doj_case_messages',`?case_id=eq.${eq(caseId)}&id=eq.${eq(id)}&updated_at=eq.${eq(stamp)}`,'PATCH',data);if(!rows.length)throw Object.assign(Error('Die Nachricht wurde inzwischen geändert. Bitte erneut laden.'),{status:409});return rows[0];},
  react:(id,userId,kind)=>kind?call('doj_case_reactions','?on_conflict=message_id,user_id','POST',{message_id:id,user_id:userId,kind,updated_at:new Date().toISOString()},'resolution=merge-duplicates,return=minimal'):call('doj_case_reactions',`?message_id=eq.${eq(id)}&user_id=eq.${eq(userId)}`,'DELETE',undefined,'return=minimal'),
  markRead:(caseId,userId,seq)=>call('rpc/doj_chat_mark_read','','POST',{p_case:caseId,p_user:userId,p_seq:seq},'return=minimal'),
  unread:(userId,cases)=>cases.length?call('rpc/doj_chat_unread','','POST',{p_user:userId,p_cases:cases}):Promise.resolve([])
 };
}