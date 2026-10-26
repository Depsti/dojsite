import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {Queue} from '../src/queue.mjs';
import {config} from '../src/config.mjs';
import {sourceFor,messageEvent,deleteEvent} from '../src/model.mjs';
import {Delivery,backoff} from '../src/delivery.mjs';
import {Reader} from '../src/reader.mjs';
import {discordAdapter} from '../src/discord.mjs';
const guildId='111111111111111111',parentId='222222222222222222',channelId='333333333333333333';
const cfg={guildId,parents:new Set([parentId]),closedParents:new Set(),endpoint:'https://portal.example/api/integrations/discord/tickets',secret:'s'.repeat(40)};
const source={guildId,channelId,parentId,title:'Ticket',sourceState:'active'};
const id=i=>(500000000000000000n+BigInt(i)).toString();
const channel={id:channelId,guildId,parentId,name:'Ticket',type:0,isThread:()=>false};
const message=i=>({id:id(i),guildId,channelId,channel,createdTimestamp:Date.UTC(2026,0,1)+i*1000,editedTimestamp:null,content:'Nachricht '+i,author:{id:'444444444444444444',username:'Mitarbeiter'},attachments:new Map(),embeds:[]});
const temp=()=>mkdtempSync(path.join(tmpdir(),'doj-reader-test-'));
const remove=dir=>{const root=path.resolve(tmpdir()),target=path.resolve(dir);if(path.dirname(target)!==root||!path.basename(target).startsWith('doj-reader-test-'))throw Error('Unsicherer Testpfad');rmSync(target,{recursive:true,force:true});};
const fixture=()=>{const dir=temp(),q=new Queue(dir);q.source(source);return {dir,q,close(){q.close();remove(dir);}};};
const ack={id:'a'.repeat(24)};
function drain(q){const out=[];while(true){const row=q.next();if(!row)break;out.push(row.payload);q.success(row.id);}return out;}
test('Konfiguration: keine Tokens in Fehlern, HTTPS und explizite Kategorien',()=>{
 const env={DISCORD_BOT_TOKEN:'fake-token-123456789012345',DOJ_DISCORD_TICKET_SECRET:'s'.repeat(40),DOJ_PORTAL_URL:'https://portal.example',DOJ_DISCORD_TICKET_GUILD_ID:guildId,DOJ_DISCORD_TICKET_PARENT_IDS:parentId};const c=config(env);assert.equal(c.endpoint,cfg.endpoint);assert.throws(()=>config({...env,DOJ_PORTAL_URL:'http://external.example'}),/HTTPS/);assert.throws(()=>config({...env,DOJ_PORTAL_URL:'https://name:secret@portal.example'}),/HTTPS/);assert.throws(()=>config({...env,DOJ_DISCORD_TICKET_CLOSED_PARENT_IDS:'555555555555555555'}),/Geschlossene/);assert.throws(()=>config({...env,DISCORD_BOT_TOKEN:''}),/DISCORD_BOT_TOKEN fehlt/);
});
test('Scope: Kategorien, Thread-Eltern, geschlossene Quellen und fremde Server',()=>{
 assert.equal(sourceFor(channel,cfg).parentId,parentId);assert.equal(sourceFor({...channel,guildId:'999999999999999999'},cfg),null);assert.equal(sourceFor({...channel,parentId:'999999999999999999'},cfg),null);assert.equal(sourceFor({...channel,type:2},cfg),null);assert.equal(sourceFor({...channel,type:11,parentId:'555555555555555555',parent:{parentId},isThread:()=>true,archived:true},cfg).sourceState,'closed');assert.equal(sourceFor(channel,{...cfg,closedParents:new Set([parentId])}).sourceState,'closed');
});
test('Nachrichtenmapping: vollständige Versionen, Embed-Felder und gelesene Anhänge',()=>{
 const m=message(1);m.embeds=[{title:'Anliegen',fields:[{name:'Frage',value:'Antwort'}],footer:{text:'Ticket-42'}}];m.attachments.set('a',{name:'Datei.pdf',url:'https://cdn.discordapp.com/attachments/test',size:40});m.editedTimestamp=m.createdTimestamp+1000;const e=messageEvent(m,guildId);assert.match(e.embeds[0].description,/Frage:\nAntwort/);assert.equal(e.attachments[0].name,'Datei.pdf');assert.equal(e.changedAt,new Date(m.editedTimestamp).toISOString());assert.throws(()=>messageEvent({...m,author:null},guildId),/vollständig/);
});
test('Durable Queue: Neustart, Wiederholschutz, Löschung und kein Wiederherstellen',()=>{
 const f=fixture();let q=f.q;try{const e=messageEvent(message(1),guildId);assert.equal(q.capture(e),true);assert.equal(q.capture(e),false);assert.equal(q.next().payload.type,'ticket.upsert');q.success(q.next().id);assert.equal(q.next(),null);q.finish(channelId,id(1));q.close();q=new Queue(f.dir);assert.equal(q.next().payload.messageId,id(1));q.capture(deleteEvent(guildId,channelId,id(1)));assert.equal(q.next().payload.type,'message.delete');assert.equal(q.capture({...e,changedAt:'2026-01-02T00:00:00.000Z'}),false);assert.equal(q.channel(channelId).cursor,id(1));}finally{q.close();remove(f.dir);}
});
test('Queue-Rollback bei Limit: Cursor und Dedup dürfen kein ungespeichertes Ereignis bestätigen',()=>{
 const f=fixture();try{f.q.maxQueue=2;f.q.begin(channelId);assert.throws(()=>f.q.page(channelId,[messageEvent(message(1),guildId),messageEvent(message(2),guildId)],id(1),id(2)),/Warteschlange voll/);assert.equal(f.q.stats().pending,1);assert.equal(f.q.channel(channelId).scan_before,null);f.q.maxQueue=10;assert.equal(f.q.capture(messageEvent(message(1),guildId)),true);}finally{f.close();}
});
test('Portal-Ausfälle: keine Quittierung, geordneter Retry, keine Redirects und keine Inhaltslogs',async()=>{
 const f=fixture(),logs=[];try{let count=0;const d=new Delivery(f.q,cfg,{log:(...args)=>logs.push(args),fetcher:async(url,options)=>{assert.equal(url,cfg.endpoint);assert.equal(options.redirect,'error');assert.equal(options.headers.Authorization,'Bearer '+cfg.secret);if(count++===0)throw Error('geheimer Inhalt');return Response.json(ack);}});await d.tick();assert.equal(f.q.stats().pending,1);assert.ok(!JSON.stringify(logs).includes('geheimer Inhalt'));f.q.retry();await d.tick();assert.equal(f.q.stats().pending,0);assert.ok(f.q.stats().lastSuccess>0);assert.ok(backoff(40,()=>0)<=300000);}finally{f.close();}
});
test('Dauerhafte Fehler blockieren nur betroffenen Kanal; neue Quelldaten ersetzen alte Metadaten',async()=>{
 const f=fixture();try{const second={...source,channelId:'666666666666666666'};f.q.source(second);const d=new Delivery(f.q,cfg,{fetcher:async(_,options)=>JSON.parse(options.body).channelId===channelId?Response.json({error:'Bad request'},{status:400}):Response.json(ack)});await d.tick();assert.equal(f.q.stats().blocked,1);assert.equal(f.q.stats().pending,1);f.q.source({...source,title:'Korrigiert'},{force:true});assert.equal(f.q.stats().blocked,0);assert.equal(f.q.next().payload.title,'Korrigiert');}finally{f.close();}
});
test('Erstabgleich paginiert, sortiert alte Nachrichten vor Live-Nachrichten und speichert Cursor',async()=>{
 const f=fixture();try{const all=Array.from({length:105},(_,i)=>message(i+1));const adapter={canRead:()=>true,ready:()=>true,history:async(_,before)=>new Map(all.filter(m=>!before||BigInt(m.id)<BigInt(before)).slice(-100).map(m=>[m.id,m])),message:async(_,i)=>all.find(m=>m.id===i)};const r=new Reader(adapter,f.q,cfg);await r.message(message(106));await r.sync(channel);assert.equal(f.q.channel(channelId).cursor,id(105));const events=drain(f.q).filter(e=>e.type==='message.upsert');assert.equal(events.length,106);assert.equal(events[0].messageId,id(1));assert.equal(events.at(-1).messageId,id(106));assert.equal(f.q.stats().pending,0);}finally{f.close();}
});
test('Abgebrochener Erstabgleich setzt nach Neustart an der gespeicherten Seite fort',async()=>{
 const dir=temp();let q=new Queue(dir);try{q.source(source);const all=Array.from({length:105},(_,i)=>message(i+1)),adapter={canRead:()=>true,history:async(_,before)=>{if(before)throw Error('Netzausfall');return new Map(all.slice(-100).map(m=>[m.id,m]));}};const r=new Reader(adapter,q,cfg);await assert.rejects(r.sync(channel),/Netzausfall/);assert.equal(q.channel(channelId).scan_before,id(6));assert.equal(q.channel(channelId).ready,0);q.close();q=new Queue(dir);const after=new Reader({...adapter,history:async(_,before)=>{assert.equal(before,id(6));return new Map(all.slice(0,5).map(m=>[m.id,m]));}},q,cfg);await after.sync(channel);assert.equal(q.channel(channelId).cursor,id(105));assert.equal(drain(q).filter(e=>e.type==='message.upsert').length,105);}finally{q.close();remove(dir);}
});
test('Partielle Updates werden gelesen; fehlende Nachrichten werden als gelöscht markiert',async()=>{
 const f=fixture();try{f.q.finish(channelId,id(1));const adapter={canRead:()=>true,ready:()=>true,message:async()=>{throw {code:10008};}};const r=new Reader(adapter,f.q,cfg);await r.message({...message(1),partial:true},{refresh:true});assert.equal(drain(f.q).filter(e=>e.type==='message.delete').length,1);}finally{f.close();}
});
test('Rechteverlust oder Verschieben nach außerhalb: nur unavailable, keine weiteren Nachrichten',async()=>{
 const f=fixture();try{f.q.finish(channelId,id(1));const moved={...channel,parentId:'999999999999999999'},r=new Reader({canRead:()=>true},f.q,cfg);await r.changed(moved);assert.equal(f.q.channel(channelId).source.sourceState,'unavailable');await r.message({...message(1),channel:moved});assert.equal(drain(f.q).filter(e=>e.type==='message.upsert').length,0);}finally{f.close();}
});
test('Heartbeat nur bei verbundener Quelle mit abgeschlossenem Erstabgleich',()=>{
 const f=fixture();try{let connected=false;const r=new Reader({ready:()=>connected},f.q,cfg);r.heartbeats();assert.equal(f.q.stats().pending,1);connected=true;r.heartbeats();assert.equal(f.q.stats().pending,1);f.q.finish(channelId,id(1));r.heartbeats();r.heartbeats();assert.equal(f.q.stats().pending,2);r.stop();r.heartbeats();assert.equal(f.q.stats().pending,2);}finally{f.close();}
});
test('Discord-Schutzschranke verbietet sämtliche REST-Schreibmethoden ohne Netzwerkzugriff',async()=>{
 const {client}=discordAdapter(cfg,()=>{});try{for(const name of ['request','queueRequest'])for(const method of ['POST','PUT','PATCH','DELETE'])assert.throws(()=>client.rest[name]({method,fullRoute:'/channels/'+channelId}),/Schreibzugriff/);}finally{await client.destroy();}
});
import {DisplayResolver} from '../src/presentation.mjs';
test('Server-Anzeigenamen und Erwähnungen werden gezielt aufgelöst und zwischengespeichert',async()=>{
 let requests=0;const target='777777777777777777',role='888888888888888888',ch='999999999999999999',resolver=new DisplayResolver({guildId,getMember:async id=>{requests++;return {displayName:id===target?'Richter Beispiel':'Dr. Stark'};},getRole:()=>({name:'Staatsanwaltschaft'}),getChannel:()=>({name:'besprechung'})});const m=message(1);m.mentions={users:new Map([[target,{username:'OldUsername'}]])};m.content='<@'+target+'> <@&'+role+'> <#'+ch+'>';const e=await resolver.prepare(m);assert.equal(e.author.displayName,'Dr. Stark');assert.equal(e.author.username,'Mitarbeiter');assert.equal(e.mentions[0].name,'Richter Beispiel');assert.equal(e.mentions[1].name,'Staatsanwaltschaft');assert.equal(e.mentions[2].name,'besprechung');assert.equal(e.displayVersion,1);await resolver.prepare(m);assert.equal(requests,2);assert.equal(sourceFor({...channel,guild:{name:'Retro City'}},cfg).guildName,'Retro City');
});
test('Nicht auflösbare Erwähnungen und entfernte Mitglieder verhindern den Import nicht',async()=>{
 const resolver=new DisplayResolver({guildId,getMember:async()=>{throw {code:10007};}}),m=message(1);m.content='<@777777777777777777>';const e=await resolver.prepare(m);assert.equal(e.author.name,'Mitarbeiter');assert.deepEqual(e.mentions,[]);await assert.rejects(resolver.prepare({...m,guildId:'999999999999999999'}),/nicht freigegeben/);
});
test('Display-Upgrade liest Altbestand einmal neu, bewahrt Queues und sendet gleich alte Metadaten nur bei Änderung',()=>{
 const f=fixture();let q=f.q;try{q.finish(channelId,id(20));const e=messageEvent(message(1),guildId);q.capture(e);drain(q);q.db.prepare("delete from settings where key='display_schema'").run();q.close();q=new Queue(f.dir);assert.equal(q.channel(channelId).cursor,'0');assert.equal(q.channel(channelId).ready,0);const refreshed={...e,displayVersion:1,mentions:[],author:{...e.author,name:'Dr. Stark'}};assert.equal(q.capture(refreshed),true);assert.equal(q.capture(refreshed),false);q.finish(channelId,id(20));q.close();q=new Queue(f.dir);assert.equal(q.channel(channelId).cursor,id(20));assert.equal(q.stats().pending,1);}finally{q.close();remove(f.dir);}
});
test('Neue Anzeige-Payloads werden von einer alten WebApp nicht fälschlich quittiert',async()=>{
 const f=fixture();try{f.q.finish(channelId,id(1));f.q.capture({...messageEvent(message(1),guildId),displayVersion:1,mentions:[]});const d=new Delivery(f.q,cfg,{fetcher:async()=>Response.json(ack)});await d.tick();assert.equal(f.q.stats().pending,1);f.q.retry();d.fetcher=async()=>Response.json({...ack,displayVersion:1});await d.tick();assert.equal(f.q.stats().pending,0);}finally{f.close();}
});
