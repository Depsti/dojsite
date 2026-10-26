/* Render untrusted Discord text as escaped text, safe links and inert mention badges. No HTML/Markdown execution. */
(function(root){
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const snow=value=>typeof value==='string'&&/^\d{15,22}$/.test(value);
 function safeUrl(value){try{if(typeof value!=='string'||/[\u0000-\u0020\u007f]/.test(value))return null;const u=new URL(value.toLowerCase().startsWith('www.')?'https://'+value:value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
 // Formatting is applied only to escaped text; markup cannot introduce attributes or URLs.
 const plain=value=>escape(value).replace(/\*\*([^*\n]+)\*\*|__([^_\n]+)__|~~([^~\n]+)~~/g,(_,bold,under,strike)=>strike!==undefined?'<s>'+strike+'</s>':'<strong>'+(bold??under)+'</strong>');
 const link=(href,label,cls='')=>'<a'+(cls?' class="'+cls+'"':'')+' href="'+escape(href)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>';
 function render(value,mentions=[],options={}){
  const text=String(value??''),known=new Map((Array.isArray(mentions)?mentions:[]).filter(m=>m&&snow(m.id)&&['user','role','channel'].includes(m.type)&&typeof m.name==='string').map(m=>[m.type+':'+m.id,m]));
  const pattern=/`[^`\n]{1,1000}`|\[([^\]\n]{1,300})\]\((https?:\/\/[^\s<>"'()]+)\)|(?:https?:\/\/|www\.)[^\s<>"'`]+|<@!?\d{15,22}>|<@&\d{15,22}>|<#\d{15,22}>|@(?:everyone|here)\b/gi;
  let out='',last=0;for(const match of text.matchAll(pattern)){out+=plain(text.slice(last,match.index));last=match.index+match[0].length;const token=match[0];
   if(token.startsWith('`')&&token.endsWith('`')){out+='<code>'+escape(token.slice(1,-1))+'</code>';continue;}
   if(match[1]!==undefined){const href=safeUrl(match[2]);out+=href?link(href,match[1]):escape(token);continue;}
   const ref=token.match(/^<(?:@(!?)(\d{15,22})|@&(\d{15,22})|#(\d{15,22}))>$/);
   if(ref){const type=ref[2]?'user':ref[3]?'role':'channel',id=ref[2]||ref[3]||ref[4],entry=known.get(type+':'+id),prefix=type==='channel'?'#':'@',label=prefix+(entry?.name||(type==='user'?'Nutzer':type==='role'?'Rolle':'Kanal')+' · …'+id.slice(-6));
    const href=type==='user'?'https://discord.com/users/'+id:type==='channel'&&snow(options.guildId)?'https://discord.com/channels/'+options.guildId+'/'+id:null;
    out+=href&&entry?link(href,label,'discord-mention discord-mention-'+type):'<span class="discord-mention'+(!entry?' discord-mention-unresolved':'')+'" title="'+escape('Discord-'+type+' '+id+' · kein Ping')+'">'+escape(label)+'</span>';continue;}
   if(token==='@everyone'||token==='@here'){out+='<span class="discord-mention" title="Erwähnung aus Discord · kein Ping">'+escape(token)+'</span>';continue;}
   let url=token,tail='';while(/[.,!;:]$/.test(url)||/[)\]}]$/.test(url)&&((url.match(/[)\]}]/g)||[]).length>(url.match(/[(\[{]/g)||[]).length)){tail=url.at(-1)+tail;url=url.slice(0,-1);}const href=safeUrl(url);out+=(href?link(href,url):escape(url))+escape(tail);
  }return out+plain(text.slice(last));
 }
 const api={render,safeUrl};root.dojDiscordText=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
