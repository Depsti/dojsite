import {messageEvent} from './model.mjs';
const clip=v=>String(v||'').slice(0,100);
// Only individual members referenced by readable messages are fetched. No member list or extra privileged intent.
export class DisplayResolver {
 constructor({guildId,getMember,getRole=()=>null,getChannel=()=>null,clock=Date.now,ttl=600000,max=2000}){Object.assign(this,{guildId,getMember,getRole,getChannel,clock,ttl,max});this.members=new Map();}
 async member(id){const old=this.members.get(id);if(old&&old.expires>this.clock())return old.value;const promise=Promise.resolve().then(()=>this.getMember(id)).catch(()=>null);const entry={expires:this.clock()+this.ttl,value:promise};this.members.set(id,entry);while(this.members.size>this.max)this.members.delete(this.members.keys().next().value);return promise;}
 async prepare(message){const event=messageEvent(message,this.guildId);if(message.guildId!==this.guildId)throw Error('Discord-Server nicht freigegeben.');const author=await this.member(message.author.id);const displayName=clip(author?.displayName||message.member?.displayName||event.author.name);event.author={...event.author,name:displayName,displayName,username:clip(message.author.username||'Discord-Nutzer')};
  const text=[message.content,...(message.embeds||[]).flatMap(e=>[e.title,e.description,...(e.fields||[]).flatMap(f=>[f.name,f.value]),e.footer?.text])].filter(Boolean).join('\n'),refs=new Map();
  for(const match of text.matchAll(/<@!?([0-9]{15,22})>|<@&([0-9]{15,22})>|<#([0-9]{15,22})>/g)){const type=match[1]?'user':match[2]?'role':'channel',id=match[1]||match[2]||match[3];if(refs.size<200)refs.set(type+':'+id,{type,id});}
  const mentions=[];for(const ref of refs.values()){let name;if(ref.type==='user'){const user=message.mentions?.users?.get(ref.id),cached=ref.id===message.author.id?author:null;const member=cached||user&&await this.member(ref.id);name=member?.displayName||user?.globalName||user?.username;}else if(ref.type==='role')name=this.getRole(ref.id)?.name;else name=this.getChannel(ref.id)?.name;if(name)mentions.push({...ref,name:clip(name)});}
  event.mentions=mentions;event.displayVersion=1;return event;
 }
}
