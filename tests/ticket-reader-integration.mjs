// Vollständige lokale Prüfung: echter DOJ-HTTP-Server, PostgreSQL und Browser. Keine Produktivdaten.
import assert from 'node:assert/strict';import {readFileSync,mkdirSync} from 'node:fs';import {once} from 'node:events';import {PGlite} from '@electric-sql/pglite';import {Queue} from '../bots/discord-ticket-reader/src/queue.mjs';import {Reader} from '../bots/discord-ticket-reader/src/reader.mjs';import {Delivery} from '../bots/discord-ticket-reader/src/delivery.mjs';import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import path from 'node:path';
const pg=new PGlite(),realFetch=globalThis.fetch;let server,browser,queue,dir;
const tables=new Set(['doj_portal_state','doj_sessions','doj_login_attempts','doj_case_messages','doj_case_chat_reads','doj_case_reactions','doj_direct_messages','doj_direct_reads','doj_direct_reactions','doj_ticket_messages']);
function quote(name){if(!/^[a-z_]+$/.test(name))throw Error('Ungültiger Testbezeichner');return '"'+name+'"';}
try{
 await pg.exec('create role anon;create role authenticated;create role service_role bypassrls;');await pg.exec(readFileSync('supabase/schema.sql','utf8'));await pg.exec(readFileSync('supabase/migrations/20261023_case_chat.sql','utf8'));await pg.exec(readFileSync('supabase/migrations/20261023154039_private_chat.sql','utf8'));
 process.env.DOJ_DISCORD_TICKET_SECRET='ticket-test-secret-abcdefghijklmnopqrstuvwxyz';process.env.DOJ_DISCORD_TICKET_GUILD_ID='111111111111111111';process.env.DOJ_DISCORD_TICKET_PARENT_IDS='222222222222222222';
 await pg.exec(readFileSync('supabase/discord-tickets.sql','utf8'));process.env.SUPABASE_URL='https://chat-test.supabase.co';process.env.SUPABASE_SECRET_KEY='sb_secret_chat_test';process.env.PORT='0';process.env.HOST='127.0.0.1';
 globalThis.fetch=async(input,options={})=>{
  const url=new URL(input);if(url.hostname!=='chat-test.supabase.co')return realFetch(input,options);
  try{
   assert.equal(options.headers.apikey,process.env.SUPABASE_SECRET_KEY);const parts=url.pathname.split('/').filter(Boolean),name=parts.at(-1),values=[];
   const param=(value,key)=>{values.push(['payload','reference_ids','edit_history','p_refs','p_event'].includes(key)?JSON.stringify(value):value);return '$'+values.length;};
   if(parts.includes('rpc')){assert.ok(['doj_chat_send','doj_chat_mark_read','doj_chat_unread','doj_direct_send','doj_direct_mark_read','doj_direct_summary','doj_ticket_ingest'].includes(name));const args=JSON.parse(options.body);const result=await pg.query('select * from public.'+quote(name)+'('+Object.entries(args).map(([k,v])=>quote(k)+'=>'+param(v,k)).join(',')+')',values);return Response.json(result.rows);}
   assert.ok(tables.has(name));const where=[];for(const [key,filter] of url.searchParams){if(['select','on_conflict','order','limit'].includes(key))continue;const dot=filter.indexOf('.'),op=filter.slice(0,dot),v=filter.slice(dot+1);if(op==='is'&&v==='null')where.push(quote(key)+' is null');else if(op==='in')where.push(quote(key)+'=any('+param(v.slice(1,-1).split(','))+'::text[])');else where.push(quote(key)+({eq:'=',neq:'<>',lt:'<',gt:'>'}[op]||'=')+param(v,key));}
   const condition=where.length?' where '+where.join(' and '):'';let sql;
   if(!options.method||options.method==='GET'){const selected=url.searchParams.get('select');sql='select '+(selected?selected.split(',').map(quote).join(','):'*')+' from public.'+quote(name)+condition;const order=url.searchParams.get('order');if(order){const [key,dir]=order.split('.');sql+=' order by '+quote(key)+(dir==='desc'?' desc':' asc');}const limit=url.searchParams.get('limit');if(limit)sql+=' limit '+Math.min(1000,Number(limit));}
   else if(options.method==='POST'){const data=JSON.parse(options.body),keys=Object.keys(data);sql='insert into public.'+quote(name)+'('+keys.map(quote).join(',')+') values('+keys.map(k=>param(data[k],k)).join(',')+')';const conflict=url.searchParams.get('on_conflict');if(conflict)sql+=' on conflict('+conflict.split(',').map(quote).join(',')+') do update set '+keys.map(k=>quote(k)+'=excluded.'+quote(k)).join(',');sql+=' returning *';}
   else if(options.method==='PATCH'){const data=JSON.parse(options.body);sql='update public.'+quote(name)+' set '+Object.entries(data).map(([k,v])=>quote(k)+'='+param(v,k)).join(',')+condition+' returning *';}
   else sql='delete from public.'+quote(name)+condition+' returning *';
   const result=await pg.query(sql,values);return (options.headers.Prefer||'').includes('return=minimal')?new Response(null,{status:204}):Response.json(result.rows);
  }catch(error){return Response.json({message:error.message},{status:error.code==='23505'?409:400});}
 };
 ({server}=await import('../lib/http-server.mjs'));if(!server.listening)await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;
 const request=async(path,method='GET',body,cookie='')=>{const response=await realFetch(base+'/api/'+path,{signal:AbortSignal.timeout(20000),method,headers:{Cookie:cookie,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};};
 await request('setup','POST',{name:'Master',password:'MasterTest123!'});const master=(await request('login','POST',{name:'Master',password:'MasterTest123!'})).cookie;
 const masterUser=(await request('state','GET',undefined,master)).data.user;await request('users/'+masterUser.id,'PUT',{rank:'attorney_general'},master);
 dir=mkdtempSync(path.join(tmpdir(),'doj-reader-http-'));queue=new Queue(dir);
 const guildId=process.env.DOJ_DISCORD_TICKET_GUILD_ID,parentId='222222222222222222',channelId='333333333333333333';
 const cfg={guildId,parents:new Set([parentId]),closedParents:new Set(),secret:process.env.DOJ_DISCORD_TICKET_SECRET,endpoint:base+'/api/integrations/discord/tickets'};
 const channel={id:channelId,guildId,parentId,name:'Bot-Integrationstest',type:0,isThread:()=>false};
 const first={id:'555555555555555555',guildId,channelId,channel,createdTimestamp:Date.now()-60000,content:'Über den Lesebot importiert',author:{id:'444444444444444444',username:'Beispiel'},attachments:new Map(),embeds:[]};const second={...first,id:'555555555555555556',createdTimestamp:first.createdTimestamp+1000,content:'Zweite Nachricht'};
 const reader=new Reader({ready:()=>true,canRead:()=>true,history:async()=>new Map([[second.id,second],[first.id,first]])},queue,cfg),delivery=new Delivery(queue,cfg,{fetcher:realFetch});
 await reader.sync(channel);await delivery.tick();assert.equal(queue.stats().pending,0);
 const ticket=(await request('tickets','GET',undefined,master)).data.tickets[0];assert.equal(ticket.title,channel.name);let messages=(await request('tickets/'+ticket.id+'/messages','GET',undefined,master)).data.messages;assert.deepEqual(messages.map(m=>m.body),[first.content,second.content]);
 // A versioned edit is acknowledged by the same real import route.
 await reader.message({...first,content:'Überarbeitete Nachricht',editedTimestamp:Date.now()});await delivery.tick();messages=(await request('tickets/'+ticket.id+'/messages','GET',undefined,master)).data.messages;assert.equal(messages.find(m=>m.message_id===first.id).body,'Überarbeitete Nachricht');
 reader.deleted(first);await delivery.tick();messages=(await request('tickets/'+ticket.id+'/messages','GET',undefined,master)).data.messages;assert.equal(messages.find(m=>m.message_id===first.id).body,'');assert.ok(messages.find(m=>m.message_id===first.id).deleted_at);
 reader.heartbeats();await delivery.tick();assert.equal(queue.stats().pending,0);
 const stored=await pg.query('select count(*) from public.doj_ticket_messages');assert.equal(stored.rows[0].count,2);assert.equal((await request('tickets/'+ticket.id,'GET',undefined,master)).data.ticket.sourceState,'active');
 console.log('Lesebot -> echter HTTP-Server -> PostgreSQL geprüft: Erstimport, Reihenfolge, Bearbeitung, Löschung und Heartbeat. Keine Discord- oder Produktivverbindung.');
}finally{if(queue)queue.close();if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}globalThis.fetch=realFetch;await pg.close();if(dir){const target=path.resolve(dir);if(path.dirname(target)!==path.resolve(tmpdir())||!path.basename(target).startsWith('doj-reader-http-'))throw Error('Unsicherer Testpfad');rmSync(target,{recursive:true,force:true});}}
