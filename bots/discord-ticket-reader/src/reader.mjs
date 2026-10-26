import {sourceFor,messageEvent,deleteEvent,heartbeat,greater} from './model.mjs';
const denied=e=>[10003,50001,50013].includes(Number(e?.code));
export class Reader {
 constructor(adapter,queue,cfg,{log=()=>{}}={}){Object.assign(this,{adapter,queue,cfg,log});this.scans=new Map();this.stopped=false;this.sweeping=false;}
 source(channel,force=false){const s=sourceFor(channel,this.cfg);if(!s)return null;this.queue.source(s,{force});return s;}
 unavailable(id){const c=this.queue.channel(id);if(!c)return;this.queue.source({...c.source,sourceState:'unavailable'},{force:c.available===1});}
 async changed(channel){if(this.stopped)return;const s=this.source(channel);if(!s){if(this.queue.channel(channel.id))this.unavailable(channel.id);return;}if(!this.adapter.canRead(channel)){this.unavailable(channel.id);return;}return this.sync(channel);}
 async message(message,{refresh=false}={}){if(this.stopped||message.guildId!==this.cfg.guildId)return;const channel=message.channel||await this.adapter.channel(message.channelId);const s=this.source(channel);if(!s||!this.adapter.canRead(channel))return;
  try{if(message.partial||refresh)message=await this.adapter.message(channel,message.id);this.queue.capture(this.adapter.prepare?await this.adapter.prepare(message):messageEvent(message,this.cfg.guildId));}catch(e){if(Number(e?.code)===10008)this.queue.capture(deleteEvent(this.cfg.guildId,channel.id,message.id));else throw e;}
  // New channels enter backfill before queued live messages are released.
  if(!this.queue.channel(channel.id)?.ready&&!this.scans.has(channel.id))this.sync(channel).catch(e=>this.log('Nachrichtenabgleich fehlgeschlagen.',{channelId:channel.id,code:Number(e?.code)||0}));
 }
 deleted(message){if(this.stopped)return;const cid=message.channelId||message.channel?.id;if(!cid||!this.queue.channel(cid))return;const channel=message.channel;if(channel&& !sourceFor(channel,this.cfg))return;this.queue.capture(deleteEvent(this.cfg.guildId,cid,message.id));}
 sync(channel){if(this.scans.has(channel.id))return this.scans.get(channel.id);const task=this.backfill(channel).finally(()=>this.scans.delete(channel.id));this.scans.set(channel.id,task);return task;}
 async backfill(channel){
  if(this.stopped)return;const source=this.source(channel,true);if(!source||!this.adapter.canRead(channel)){if(source)this.unavailable(channel.id);return;}
  let c=this.queue.begin(channel.id);try{while(!this.stopped){
   const page=await this.adapter.history(channel,c.scan_before),rows=[...page.values()].sort((a,b)=>greater(a.id,b.id)?1:-1);
   if(this.stopped)return;if(!rows.length){this.queue.finish(channel.id,c.scan_max||c.cursor);return;}
   const min=rows[0].id,max=rows.at(-1).id;
   if(c.scan_before&&!greater(c.scan_before,min))throw Error('Discord-Seitencursor schreitet nicht voran.');
   // The newest page is also refreshed below the cursor to catch recent offline edits.
   const events=[];for(const m of rows.filter(m=>!c.scan_before||greater(m.id,c.scan_base)))events.push(this.adapter.prepare?await this.adapter.prepare(m):messageEvent(m,this.cfg.guildId));
   this.queue.page(channel.id,events,min,max);c=this.queue.channel(channel.id);
   if(!greater(min,c.scan_base)||rows.length<100){this.queue.finish(channel.id,c.scan_max||c.cursor);this.log('Ticketabgleich abgeschlossen.',{channelId:channel.id});return;}
  }}catch(e){if(denied(e)){this.unavailable(channel.id);return;}throw e;}
 }
 async sweep(){if(this.sweeping||this.stopped)return;this.sweeping=true;try{
  const channels=await this.adapter.discover(this.cfg),seen=new Set();for(const channel of channels){if(this.stopped)return;const source=sourceFor(channel,this.cfg);if(!source)continue;seen.add(channel.id);try{await this.changed(channel);}catch(e){this.log('Ticketabgleich wird später wiederholt.',{channelId:channel.id,code:Number(e?.code)||0});if(String(e?.message).startsWith('Warteschlange voll:'))throw e;}}
  for(const c of this.queue.channels()){if(this.stopped)return;if(seen.has(c.id))continue;try{const channel=await this.adapter.channel(c.id);if(!channel||!sourceFor(channel,this.cfg)||!this.adapter.canRead(channel))this.unavailable(c.id);else await this.changed(channel);}catch(e){if(denied(e))this.unavailable(c.id);else this.log('Bekanntes Ticket konnte nicht geprüft werden.',{channelId:c.id,code:Number(e?.code)||0});}}
 }finally{this.sweeping=false;}}
 heartbeats(at=Date.now()){if(this.stopped||!this.adapter.ready())return;for(const c of this.queue.channels())if(c.available&&c.ready)this.queue.capture(heartbeat(c.source,at));}
 stop(){this.stopped=true;}
}
