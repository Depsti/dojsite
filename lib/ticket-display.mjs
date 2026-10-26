import {ticketVisible} from './ticket-access.mjs';
const fail=message=>{throw Object.assign(Error(message),{status:400});};
const name=(value,max=100)=>{if(typeof value!=='string'||!value.trim()||value.length>max)fail('Ungültiger Discord-Anzeigename.');return value.trim();};
export function displayMetadata(input){
 if(input.displayVersion!==undefined&&input.displayVersion!==1)fail('Unbekannte Discord-Anzeigeversion.');
 const author=input.author;if(!author||typeof author!=='object')fail('Discord-Absender fehlt.');
 const clean={};if(author.username!==undefined)clean.username=name(author.username);if(author.displayName!==undefined)clean.displayName=name(author.displayName);
 const mentions=input.mentions||[];if(!Array.isArray(mentions)||mentions.length>200)fail('Ungültige Discord-Erwähnungen.');const seen=new Set();return {author:clean,mentions:mentions.map(m=>{if(!m||!['user','role','channel'].includes(m.type)||typeof m.id!=='string'||!/^\d{15,22}$/.test(m.id))fail('Ungültige Discord-Erwähnung.');const key=m.type+':'+m.id;if(seen.has(key))fail('Doppelte Discord-Erwähnung.');seen.add(key);return {type:m.type,id:m.id,name:name(m.name)};}),...(input.displayVersion===1?{displayVersion:1}:{})};
}

export function projectTicketMessages(db,user,ticket,rows){return rows.map(m=>({...m,mentions:m.deleted_at?[]:(Array.isArray(m.mentions)?m.mentions:[]).filter(ref=>ref.type!=='channel'||ref.id===ticket.channelId||ticketVisible(db.discordTickets?.find(t=>t.guildId===ticket.guildId&&t.channelId===ref.id),user))}));}
