import {createServer} from 'node:http';
import {config} from './config.mjs';
import {Queue} from './queue.mjs';
import {Delivery} from './delivery.mjs';
import {Reader} from './reader.mjs';
import {discordAdapter} from './discord.mjs';
// No tokens, message contents, author names, attachment URLs or raw exception objects in logs.
const log=(message,details={})=>console.log(JSON.stringify({at:new Date().toISOString(),message,...details}));
let cfg;try{cfg=config();}catch(e){console.error(e.message);process.exit(1);}
const queue=new Queue(cfg.dataDir,{maxQueue:cfg.maxQueue}),delivery=new Delivery(queue,cfg,{log});
const {adapter,client,Events}=discordAdapter(cfg,log),reader=new Reader(adapter,queue,cfg,{log});
let stopping=false,deliveryTask=Promise.resolve(),sweepTask=Promise.resolve();const timers=[];
function fail(e){if(stopping)return;log(String(e?.message).startsWith('Warteschlange voll:')?'Warteschlange voll. Import prüfen oder BOT_MAX_QUEUE erhöhen.':'Bot-Vorgang fehlgeschlagen; Details und Zugangsdaten werden nicht protokolliert.',{code:Number(e?.code)||0});}
const run=fn=>(...args)=>{if(!stopping)Promise.resolve().then(()=>fn(...args)).catch(fail);};
const sweep=()=>{if(stopping||!client.isReady())return;sweepTask=reader.sweep().catch(fail);};
client.on(Events.MessageCreate,run(m=>reader.message(m)));
client.on(Events.MessageUpdate,run((_,m)=>reader.message(m,{refresh:true})));
client.on(Events.MessageDelete,run(m=>reader.deleted(m)));
client.on(Events.MessageBulkDelete,run(messages=>{for(const m of messages.values())reader.deleted(m);}));
for(const event of [Events.ChannelCreate,Events.ChannelUpdate,Events.ThreadCreate,Events.ThreadUpdate])client.on(event,run((first,next)=>reader.changed(next?.id?next:first)));
for(const event of [Events.ChannelDelete,Events.ThreadDelete])client.on(event,run(ch=>{if(ch.guildId===cfg.guildId)reader.unavailable(ch.id);}));
client.on(Events.Error,fail);client.on(Events.Warn,()=>log('Discord-Verbindung meldet eine Warnung.'));
client.on(Events.ShardDisconnect,(event)=>{log('Discord-Verbindung unterbrochen.',{code:event.code});if([4004,4013,4014].includes(event.code))shutdown(1);});
client.on(Events.ShardResume,()=>{log('Discord-Verbindung wiederhergestellt.');sweep();});
client.once(Events.ClientReady,()=>{log('Lesebot verbunden. Erstabgleich startet.');sweep();});
const server=createServer((req,res)=>{if(req.url!=='/health'){res.writeHead(404);return res.end();}res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.writeHead(!stopping&&client.isReady()?200:503);res.end(JSON.stringify({gatewayReady:client.isReady(),queue:queue.stats(),portalError:delivery.lastError}));});
server.listen(cfg.port,'0.0.0.0');
timers.push(setInterval(()=>{if(!delivery.running&&!stopping)deliveryTask=delivery.tick().catch(fail);},500));
timers.push(setInterval(sweep,cfg.resyncMs));timers.push(setInterval(run(()=>reader.heartbeats()),cfg.heartbeatMs));
async function shutdown(code=0){if(stopping)return;stopping=true;log('Lesebot beendet sich; Warteschlange bleibt gespeichert.');for(const timer of timers)clearInterval(timer);reader.stop();client.destroy();server.close();const deadline=setTimeout(()=>process.exit(code),25000);try{await Promise.race([Promise.allSettled([deliveryTask,sweepTask,...reader.scans.values()]),new Promise(resolve=>setTimeout(resolve,22000))]);queue.close();}finally{clearTimeout(deadline);process.exit(code);}}
process.on('SIGTERM',()=>shutdown());process.on('SIGINT',()=>shutdown());
process.on('uncaughtException',e=>{fail(e);shutdown(1);});process.on('unhandledRejection',e=>{fail(e);shutdown(1);});
client.login(cfg.token).catch(e=>{fail(e);shutdown(1);});
