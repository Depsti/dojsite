const iso=t=>new Date(t).toISOString();
const clip=(v,n)=>{const s=String(v||'');return s.length>n?s.slice(0,n-12)+' [gekürzt]':s;};
export const greater=(a,b)=>BigInt(a||0)>BigInt(b||0);
export function sourceFor(channel,cfg){
 if(!channel||channel.guildId!==cfg.guildId)return null;
 const thread=channel.isThread?.()===true;
 if(!thread&&![0,5].includes(channel.type))return null;
 const candidates=thread?[channel.parentId,channel.parent?.parentId]:[channel.parentId];
 const parentId=candidates.find(id=>cfg.parents.has(id)&&cfg.closedParents.has(id))||candidates.find(id=>cfg.parents.has(id));if(!parentId)return null;
 return {guildId:cfg.guildId,guildName:clip(channel.guild?.name||'',100),channelId:channel.id,parentId,title:clip(channel.name,200),sourceState:channel.archived||cfg.closedParents.has(parentId)?'closed':'active'};
}
export function ticketEvent(source,at=Date.now()){return {type:'ticket.upsert',...source,changedAt:iso(at)};}
export function messageEvent(message,guildId){
 if(!message.author||!message.createdTimestamp)throw Error('Nachricht muss vollständig geladen sein.');
 return {type:'message.upsert',guildId,channelId:message.channelId,messageId:message.id,author:{id:message.author.id,name:clip(message.member?.displayName||message.author.globalName||message.author.username||'Discord-Nutzer',100),bot:message.author.bot===true},content:clip(message.content,10000),createdAt:iso(message.createdTimestamp),changedAt:iso(message.editedTimestamp||message.createdTimestamp),replyTo:message.reference?.messageId||null,attachments:[...message.attachments.values()].slice(0,10).map(f=>({name:clip(f.name||'Anhang',200),url:f.url,size:Number(f.size)||0})),embeds:(message.embeds||[]).slice(0,10).map(e=>({title:clip(e.title||e.author?.name||'',300),description:clip([e.description,...(e.fields||[]).map(f=>f.name+':\n'+f.value),e.footer?.text].filter(Boolean).join('\n\n'),6000)}))};
}
export function deleteEvent(guildId,channelId,messageId,at=Date.now()){return {type:'message.delete',guildId,channelId,messageId,changedAt:iso(at)};}
export const heartbeat=(source,at=Date.now())=>({type:'heartbeat',guildId:source.guildId,channelId:source.channelId,changedAt:iso(at)});
