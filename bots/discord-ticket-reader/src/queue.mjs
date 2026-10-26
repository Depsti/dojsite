import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
export class Queue {
 constructor(dir,{maxQueue=50000}={}){
  mkdirSync(dir,{recursive:true});this.db=new DatabaseSync(path.join(dir,'ticket-reader.sqlite'));this.maxQueue=maxQueue;this.depth=0;
  this.db.exec(`pragma journal_mode=WAL;pragma synchronous=FULL;pragma busy_timeout=5000;
   create table if not exists channels(id text primary key,source text not null,cursor text not null default '0',scan_before text,scan_max text,scan_base text,ready integer not null default 0,available integer not null default 1,last_sync integer not null default 0,clock integer not null default 0);
   create table if not exists outbox(id integer primary key autoincrement,channel_id text not null,payload text not null,fingerprint text not null unique,priority integer not null,sort_at text not null,attempts integer not null default 0,next_at integer not null default 0,blocked integer not null default 0,last_status integer);
   create index if not exists outbox_channel_order on outbox(channel_id,priority,sort_at,id);
   create table if not exists seen_messages(channel_id text not null,message_id text not null,version text not null,deleted integer not null default 0,primary key(channel_id,message_id));
   create table if not exists settings(key text primary key,value text not null);`);
  this.tx(()=>{if(!this.db.prepare('pragma table_info(seen_messages)').all().some(c=>c.name==='fingerprint'))this.db.exec("alter table seen_messages add column fingerprint text not null default ''");if(!this.db.prepare("select 1 from settings where key='display_schema'").get()){this.db.exec("update channels set cursor='0',scan_before=null,scan_max=null,scan_base=null,ready=0");this.db.prepare("insert into settings(key,value) values('display_schema','1')").run();}});
 }
 tx(fn){if(this.depth)return fn();this.db.exec('begin immediate');this.depth++;try{const v=fn();this.db.exec('commit');return v;}catch(e){this.db.exec('rollback');throw e;}finally{this.depth--;}}
 channel(id){const row=this.db.prepare('select * from channels where id=?').get(id);return row?{...row,source:JSON.parse(row.source)}:null;}
 channels(){return this.db.prepare('select id from channels order by id').all().map(r=>this.channel(r.id));}
 capture(event){return this.tx(()=>{
  const cid=event.channelId,seen=event.messageId&&this.db.prepare('select * from seen_messages where channel_id=? and message_id=?').get(cid,event.messageId);
  if(seen&&(seen.deleted||event.type==='message.upsert'&&seen.version>event.changedAt))return false;
  const payload=JSON.stringify(event),fingerprint=createHash('sha256').update(payload).digest('hex');
  if(seen&&event.type==='message.upsert'&&seen.version===event.changedAt&&seen.fingerprint===fingerprint)return false;
  if(this.db.prepare('select 1 from outbox where fingerprint=?').get(fingerprint))return false;
  if(event.type==='heartbeat')this.db.prepare("delete from outbox where channel_id=? and priority=3").run(cid);
  if(Number(this.db.prepare('select count(*) n from outbox').get().n)>=this.maxQueue)throw Error('Warteschlange voll: BOT_MAX_QUEUE erhöhen oder Importfehler beheben.');
  this.db.prepare('insert into outbox(channel_id,payload,fingerprint,priority,sort_at) values(?,?,?,?,?)').run(cid,payload,fingerprint,{'ticket.upsert':0,'message.delete':1,'message.upsert':2,heartbeat:3}[event.type],event.createdAt||event.changedAt);
  if(event.messageId)this.db.prepare('insert into seen_messages(channel_id,message_id,version,deleted,fingerprint) values(?,?,?,?,?) on conflict(channel_id,message_id) do update set version=excluded.version,deleted=excluded.deleted,fingerprint=excluded.fingerprint').run(cid,event.messageId,event.changedAt,event.type==='message.delete'?1:0,fingerprint);
  return true;
 });}
 source(source,{force=false,at=Date.now()}={}){return this.tx(()=>{
  const old=this.channel(source.channelId),clock=Math.max(at,(old?.clock||0)+1),changed=!old||JSON.stringify(old.source)!==JSON.stringify(source);
  if(!old)this.db.prepare('insert into channels(id,source,clock) values(?,?,?)').run(source.channelId,JSON.stringify(source),clock);
  else this.db.prepare('update channels set source=?,clock=?,available=? where id=?').run(JSON.stringify(source),clock,source.sourceState==='unavailable'?0:1,source.channelId);
  if(force||changed){this.db.prepare('delete from outbox where channel_id=? and priority=0').run(source.channelId);this.capture({type:'ticket.upsert',...source,changedAt:new Date(clock).toISOString()});}return this.channel(source.channelId);
 });}
 begin(id){const c=this.channel(id);if(c.scan_base===null)this.db.prepare('update channels set ready=0,scan_base=cursor,scan_before=null,scan_max=null where id=?').run(id);return this.channel(id);}
 page(id,events,before,max){this.tx(()=>{for(const e of events)this.capture(e);this.db.prepare('update channels set scan_before=?,scan_max=coalesce(scan_max,?) where id=?').run(before,max,id);});}
 finish(id,max,at=Date.now()){this.db.prepare('update channels set ready=1,cursor=?,scan_before=null,scan_max=null,scan_base=null,last_sync=? where id=?').run(max||this.channel(id).cursor,at,id);}
 next(at=Date.now()){
  const row=this.db.prepare(`with heads as(select o.*,row_number() over(partition by channel_id order by o.priority,o.sort_at,o.id) rn from outbox o join channels c on c.id=o.channel_id where c.ready=1 or o.priority=0) select * from heads where rn=1 and blocked=0 and next_at<=? order by priority,id limit 1`).get(at);
  return row?{...row,payload:JSON.parse(row.payload)}:null;
 }
 success(id,at=Date.now()){this.tx(()=>{this.db.prepare('delete from outbox where id=?').run(id);this.db.prepare("insert into settings(key,value) values('last_success',?) on conflict(key) do update set value=excluded.value").run(String(at));});}
 failure(id,{status=0,delay=1000,permanent=false}={}){this.db.prepare('update outbox set attempts=attempts+1,next_at=?,blocked=?,last_status=? where id=?').run(Date.now()+delay,permanent?1:0,status,id);}
 retry(){this.db.prepare('update outbox set blocked=0,next_at=0,attempts=0').run();}
 stats(){const r=this.db.prepare('select count(*) pending,coalesce(sum(blocked),0) blocked,min(sort_at) oldest from outbox').get();return {...r,channels:this.channels().length,initializing:this.db.prepare('select count(*) n from channels where ready=0 and available=1').get().n,lastSuccess:Number(this.db.prepare("select value from settings where key='last_success'").get()?.value||0)};}
 close(){this.db.close();}
}
