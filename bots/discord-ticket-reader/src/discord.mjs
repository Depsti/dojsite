import {Client,Events,GatewayIntentBits,Partials,PermissionFlagsBits,ChannelType} from 'discord.js';
export function discordAdapter(cfg,log){
 const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent],partials:[Partials.Message,Partials.Channel]});
 // This integration only permits GET requests to Discord's REST API. Gateway login/heartbeats remain necessary.
 for(const name of ['request','queueRequest']){const original=client.rest[name].bind(client.rest);client.rest[name]=options=>{if(String(options.method||'GET').toUpperCase()!=='GET')throw Error('Discord-Schreibzugriff ist im Lesebot gesperrt.');return original(options);};}
 const adapter={client,ready:()=>client.isReady(),
  canRead:ch=>!!ch.permissionsFor(client.user)?.has([PermissionFlagsBits.ViewChannel,PermissionFlagsBits.ReadMessageHistory]),
  channel:async id=>{const guild=await client.guilds.fetch(cfg.guildId);return guild.channels.fetch(id,{force:true});},
  message:(channel,id)=>channel.messages.fetch({message:id,force:true,cache:false}),
  history:(channel,before)=>channel.messages.fetch({limit:100,...(before?{before}:{}),cache:false}),
  discover:async()=>{
   const guild=await client.guilds.fetch(cfg.guildId),channels=await guild.channels.fetch(),result=new Map([...channels.values()].filter(Boolean).map(ch=>[ch.id,ch]));
   const active=await guild.channels.fetchActiveThreads();for(const ch of active.threads.values())result.set(ch.id,ch);
   for(const parent of channels.values()){
    if(!parent?.threads||!cfg.parents.has(parent.id)&&!cfg.parents.has(parent.parentId)||!adapter.canRead(parent))continue;
    for(const type of parent.type===ChannelType.GuildForum||parent.type===ChannelType.GuildMedia?['public']:['public','private']){
     let before=null;while(true){let page;try{page=await parent.threads.fetchArchived({type,fetchAll:false,limit:100,...(before?{before}:{})});}catch(e){if([50001,50013,10003].includes(Number(e?.code))){log('Archivierte Threads sind für den Lesebot teilweise nicht zugänglich.',{channelId:parent.id,code:Number(e.code)});break;}throw e;}
      for(const ch of page.threads.values())result.set(ch.id,ch);if(!page.hasMore||!page.threads.size)break;
      const ordered=[...page.threads.values()].sort((a,b)=>(a.archiveTimestamp||0)-(b.archiveTimestamp||0));const next=type==='private'?[...page.threads.keys()].reduce((a,b)=>BigInt(a)<BigInt(b)?a:b):new Date(ordered[0].archiveTimestamp).toISOString();if(next===before)break;before=next;
     }
    }
   }
   return [...result.values()];
  }
 };
 return {adapter,client,Events};
}
