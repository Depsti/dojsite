import path from 'node:path';
export function config(env=process.env){
 const required=name=>{const v=env[name]?.trim();if(!v)throw Error(name+' fehlt.');return v;};
 const ids=(name,optional=false)=>{const a=(optional?env[name]||'':required(name)).split(',').map(x=>x.trim()).filter(Boolean);if(a.some(x=>!/^\d{15,22}$/.test(x)))throw Error(name+': ungültige Discord-ID.');return new Set(a);};
 const integer=(key,fallback,min,max)=>{const n=Number(env[key]||fallback);if(!Number.isInteger(n)||n<min||n>max)throw Error(key+': ungültiger Zahlenwert.');return n;};
 const token=required('DISCORD_BOT_TOKEN'),secret=required('DOJ_DISCORD_TICKET_SECRET');if(token.length<20||secret.length<32)throw Error('Bot-Token bzw. Ticket-Schlüssel ist zu kurz.');
 let portal;try{portal=new URL(required('DOJ_PORTAL_URL'));}catch{throw Error('DOJ_PORTAL_URL muss eine vollständige URL sein.');}
 const local=['localhost','127.0.0.1','[::1]'].includes(portal.hostname);if(portal.protocol!=='https:'&&!(local&&portal.protocol==='http:')||portal.username||portal.password||portal.search||portal.hash||portal.pathname!=='/')throw Error('DOJ_PORTAL_URL: HTTPS-Portal-URL ohne Pfad oder Zugangsdaten verwenden.');
 const guildId=required('DOJ_DISCORD_TICKET_GUILD_ID');if(!/^\d{15,22}$/.test(guildId))throw Error('DOJ_DISCORD_TICKET_GUILD_ID ist ungültig.');
 const parents=ids('DOJ_DISCORD_TICKET_PARENT_IDS'),closedParents=ids('DOJ_DISCORD_TICKET_CLOSED_PARENT_IDS',true);if([...closedParents].some(id=>!parents.has(id)))throw Error('Geschlossene Kategorien müssen auch in den erlaubten Eltern-IDs stehen.');
 return {token,secret,portal:portal.origin,endpoint:new URL('/api/integrations/discord/tickets',portal).href,guildId,parents,closedParents,dataDir:path.resolve(env.BOT_DATA_DIR||env.RAILWAY_VOLUME_MOUNT_PATH||'./data'),resyncMs:integer('BOT_RESYNC_SECONDS',300,60,86400)*1000,heartbeatMs:integer('BOT_HEARTBEAT_SECONDS',60,30,90)*1000,maxQueue:integer('BOT_MAX_QUEUE',50000,100,1000000),port:integer('PORT',3001,0,65535)};
}
