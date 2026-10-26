export function createTicketStore(request){
 const call=async(...args)=>{try{return await request(...args);}catch(e){if(/HTTP (404|400)/.test(e.message))throw Object.assign(Error('Ticket-Nachrichten sind noch nicht eingerichtet. Bitte supabase/discord-tickets.sql ausführen und das API-Schema neu laden.'),{status:503});throw e;}};
 const eq=encodeURIComponent;
 return {
  ingest:async event=>{const rows=await call('rpc/doj_ticket_ingest','','POST',{p_event:event});return rows.length?rows:call('doj_ticket_messages','?guild_id=eq.'+eq(event.guildId)+'&channel_id=eq.'+eq(event.channelId)+'&message_id=eq.'+eq(event.messageId)+'&limit=1');},
  list:async(t,before,known=[])=>{const rows=await call('doj_ticket_messages','?guild_id=eq.'+eq(t.guildId)+'&channel_id=eq.'+eq(t.channelId)+'&order=seq.desc&limit=51'+(before?'&seq=lt.'+eq(before):''));const extra=known.length?await call('doj_ticket_messages','?guild_id=eq.'+eq(t.guildId)+'&channel_id=eq.'+eq(t.channelId)+'&message_id=in.('+known.join(',')+')&limit=200'):[];return {extra,messages:rows.slice(0,50).reverse(),hasMore:rows.length>50,before:rows[Math.min(49,rows.length-1)]?.seq||null};}
 };
}
