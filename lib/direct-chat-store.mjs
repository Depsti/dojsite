export function createDirectChatStore(request){
 const call=async(...args)=>{try{return await request(...args);}catch(error){if(/HTTP 404/.test(error.message))throw Object.assign(Error('Privatchats sind noch nicht eingerichtet. Bitte die Supabase-Migration 20261023154039_private_chat.sql ausführen.'),{status:503});throw error;}};
 const eq=v=>encodeURIComponent(String(v)),map=r=>({...r,author_id:r.sender_id,case_id:r.thread_key});
 const many=async(...args)=>(await call(...args)).map(map);
 const pair=(a,b)=>[a,b].sort().join(':');
 return {
  latest:async(user,peer)=>(await call('doj_direct_messages',`?recipient_id=eq.${eq(user)}&sender_id=eq.${eq(peer)}&deleted_at=is.null&select=seq,created_at&order=seq.desc&limit=1`))[0],
  summary:user=>call('rpc/doj_direct_summary','','POST',{p_user:user}),
  thread:(user,peer)=>{const key=pair(user,peer),filter='?thread_key=eq.'+eq(key);return {
   list:async(_,before,known=[])=>{const rows=await many('doj_direct_messages',filter+'&order=seq.desc&limit=51'+(before?'&seq=lt.'+eq(before):'')),extra=known.length?await many('doj_direct_messages',filter+'&id=in.('+known.join(',')+')'):[];return {rows:rows.slice(0,50),extra,hasMore:rows.length>50};},
   byIds:(_,ids)=>ids.length?many('doj_direct_messages',filter+'&id=in.('+ids.join(',')+')'):Promise.resolve([]),
   get:async(_,id)=>(await many('doj_direct_messages',filter+'&id=eq.'+eq(id)+'&limit=1'))[0],
   reactions:ids=>ids.length?call('doj_direct_reactions','?message_id=in.('+ids.join(',')+')'):Promise.resolve([]),
   send:async input=>map((await call('rpc/doj_direct_send','','POST',input))[0]),
   update:async(_,id,stamp,input)=>{const rows=await many('doj_direct_messages',filter+'&id=eq.'+eq(id)+'&updated_at=eq.'+eq(stamp),'PATCH',input);if(!rows.length)throw Object.assign(Error('Die Nachricht wurde inzwischen geändert. Bitte erneut laden.'),{status:409});return rows[0];},
   react:(id,userId,kind)=>kind?call('doj_direct_reactions','?on_conflict=message_id,user_id','POST',{message_id:id,user_id:userId,kind,updated_at:new Date().toISOString()},'resolution=merge-duplicates,return=minimal'):call('doj_direct_reactions','?message_id=eq.'+eq(id)+'&user_id=eq.'+eq(userId),'DELETE',undefined,'return=minimal'),
   markRead:seq=>call('rpc/doj_direct_mark_read','','POST',{p_user:user,p_peer:peer,p_seq:seq},'return=minimal')
  };}
 };
}
