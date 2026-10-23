/* Fallchat: eigener Nachrichtenbestand; keine Chat-Inhalte im Aktenexport. */
function chatDraftChanged(value){document.dispatchEvent(new CustomEvent('doj-chat-draft',{detail:!!value}));}
function chatSummaryChanged(){if(parent!==window)parent.postMessage({protocol:'doj-desktop-v1',type:'chat-update'},location.origin);else window.dispatchEvent(new Event('doj-chat-summary-refresh'));}
function chatPerson(person){const rank=person.rank;const color=rank&&/^#[a-f0-9]{6}$/i.test(rank.color)?rank.color:'#d3dce5';return `<strong class="chat-author" style="color:${color}">${esc(person.name)}</strong>${rank?`<span class="chat-rank">${esc(rank.name)}</span>`:''}`;}
function openCurrentCaseChat(){document.querySelector('[data-case-chat-tab]')?.click();}
function createCaseChat(record,host,options={}){
 const content=host.querySelector('.modal-content'),switcher=document.createElement('div');switcher.className='case-chat-switch';switcher.innerHTML=`<strong>${esc(record.reference||record.title)}</strong><div><button type="button" data-case-info aria-pressed="true">Akte</button><button type="button" data-case-chat-tab aria-pressed="false">Fallchat</button></div>`;
 content.prepend(switcher);const shell=document.createElement('section');shell.className='case-chat-shell';shell.hidden=true;
 shell.innerHTML='<header class="chat-heading"><h2>Interner Fallchat</h2><span>Nur für berechtigte Mitarbeiter · Aktualisierung alle 3 Sekunden</span></header><p class="chat-error" role="status"></p><button type="button" class="chat-older">Ältere Nachrichten laden</button><div class="chat-messages" aria-label="Nachrichtenverlauf"></div><p class="chat-readonly" hidden>Dieser Fallchat ist nur lesbar.</p><form class="chat-compose" data-case-chat-form><div class="chat-reply-draft" hidden></div><label class="field">Nachricht<textarea name="message" rows="3" maxlength="5000" placeholder="Nachricht an das Fallteam …"></textarea></label><div class="chat-reference-draft"></div><div class="chat-picker" hidden><label class="field">Verweis suchen<input type="search" placeholder="Titel oder Aktenzeichen …"></label><div class="chat-picker-results"></div></div><div class="actions"><button type="button" class="chat-add-reference">Verweis hinzufügen</button><button type="submit" class="primary">Senden</button></div><small>✅ und ❌ dienen der Abstimmung und ersetzen keine formelle Entscheidung.</small></form>';
 content.append(shell);const list=shell.querySelector('.chat-messages'),form=shell.querySelector('form'),text=form.elements.message,error=shell.querySelector('.chat-error'),picker=shell.querySelector('.chat-picker');
 let active=false,busy=false,sending=false,canWrite=false,refs=[],reply=null,nonce=crypto.randomUUID(),cursor=null,hasMore=false,lastRead='0',messages=new Map(),signature='',timer;
 const endpoint='cases/'+record.id+'/chat';
 const hasDraft=()=>!!text.value.trim()||refs.length>0||!!reply;
 const draft=()=>{if(options.onDraft)options.onDraft(hasDraft());else chatDraftChanged(hasDraft());};
 text.addEventListener('input',draft);
 function chooseRefs(){const target=shell.querySelector('.chat-reference-draft');target.replaceChildren();refs.forEach(id=>{const r=state.records.find(r=>r.id===id),b=document.createElement('button');b.type='button';b.textContent=(r?.title||'Verweis')+' ×';b.onclick=()=>{refs=refs.filter(x=>x!==id);chooseRefs();draft();};target.append(b);});}
 function searchRefs(){const q=picker.querySelector('input').value.toLocaleLowerCase('de'),target=picker.querySelector('.chat-picker-results');target.replaceChildren();state.records.filter(r=>!refs.includes(r.id)&&[r.title,r.reference,modules[r.type]?.[0]].join(' ').toLocaleLowerCase('de').includes(q)).slice(0,30).forEach(r=>{const b=document.createElement('button');b.type='button';b.textContent=(modules[r.type]?.[0]||'Eintrag')+' · '+(r.reference?r.reference+' · ':'')+r.title;b.onclick=()=>{if(refs.length>=10){error.textContent='Maximal zehn Verweise pro Nachricht.';return;}refs.push(r.id);chooseRefs();picker.hidden=true;draft();};target.append(b);});}
 picker.querySelector('input').oninput=searchRefs;shell.querySelector('.chat-add-reference').onclick=()=>{picker.hidden=!picker.hidden;if(!picker.hidden){searchRefs();picker.querySelector('input').focus();}};
 function replyTo(message){reply=message;const target=shell.querySelector('.chat-reply-draft');target.hidden=false;target.replaceChildren();const label=document.createElement('span');label.textContent='Antwort an '+message.author.name+': '+message.text.slice(0,120);const cancel=document.createElement('button');cancel.type='button';cancel.textContent='×';cancel.setAttribute('aria-label','Antwort abbrechen');cancel.onclick=()=>{reply=null;target.hidden=true;draft();};target.append(label,cancel);text.focus();draft();}
 const stamp=value=>new Date(value).toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'});
 async function action(fn){try{error.textContent='';await fn();await load();chatSummaryChanged();}catch(err){error.textContent=err.message;}}
 function render(){
  const items=[...messages.values()].sort((a,b)=>Number(a.seq)-Number(b.seq));const next=JSON.stringify(items)+canWrite;if(next===signature)return;signature=next;
  const nearBottom=list.scrollHeight-list.scrollTop-list.clientHeight<80,oldHeight=list.scrollHeight,oldTop=list.scrollTop;list.innerHTML=items.map(m=>`<article class="chat-message ${m.author.id===state.user.id?'chat-own':''}" data-message="${m.id}"><header><div>${chatPerson(m.author)}</div><time>${esc(stamp(m.createdAt))}${m.edited?' · bearbeitet':''}</time></header>${m.reply?`<blockquote>${esc(m.reply.author.name)}: ${esc(m.reply.text)}</blockquote>`:''}<div class="chat-text">${esc(m.text)}</div>${m.references.map(r=>r.available?`<button type="button" class="chat-record-link" data-chat-record="${r.id}">↗ ${esc(r.reference||modules[r.type]?.[0]||'Eintrag')} · ${esc(r.title)}</button>`:'<span class="chat-unavailable">Verknüpfter Eintrag nicht zugänglich</span>').join('')}${!m.deleted?`<footer class="chat-actions">${['check','cross'].map(kind=>`<button type="button" data-react="${kind}" class="${m.reactions[kind].mine?'reacted':''}" ${canWrite?'':'disabled'} title="${esc(m.reactions[kind].users.map(u=>u.name).join(', ')||'Noch keine Reaktion')}">${kind==='check'?'✅':'❌'} ${m.reactions[kind].count}</button>`).join('')}${canWrite?'<button type="button" data-reply>Antworten</button>':''}${canWrite&&m.canEdit?'<button type="button" data-edit-message>Bearbeiten</button>':''}${canWrite&&m.canDelete?'<button type="button" data-delete-message>Löschen</button>':''}</footer>`:''}</article>`).join('')||'<p class="chat-empty">Noch keine Nachrichten. Beginne die Abstimmung zum Fall.</p>';
  list.querySelectorAll('[data-chat-record]').forEach(b=>b.onclick=()=>detail(b.dataset.chatRecord));
  list.querySelectorAll('[data-message]').forEach(article=>{const message=messages.get(article.dataset.message);article.querySelectorAll('[data-react]').forEach(b=>b.onclick=()=>action(()=>api(endpoint+'/messages/'+message.id+'/reaction','PUT',{kind:message.reactions[b.dataset.react].mine?null:b.dataset.react})));
   article.querySelector('[data-reply]')?.addEventListener('click',()=>replyTo(message));
   article.querySelector('[data-edit-message]')?.addEventListener('click',()=>{const value=prompt('Nachricht bearbeiten (max. 5.000 Zeichen):',message.text);if(value!==null&&value!==message.text)action(()=>api(endpoint+'/messages/'+message.id,'PATCH',{text:value,updatedAt:message.updatedAt}));});
   article.querySelector('[data-delete-message]')?.addEventListener('click',()=>{if(confirm('Nachricht löschen? Ein Löschhinweis bleibt erhalten.'))action(()=>api(endpoint+'/messages/'+message.id,'DELETE',{updatedAt:message.updatedAt}));});
  });
  if(nearBottom)list.scrollTop=list.scrollHeight;else list.scrollTop=oldTop+Math.max(0,list.scrollHeight-oldHeight);
 }
 async function load(older=false){if(busy||!active||!shell.isConnected||document.hidden)return;busy=true;try{
  const known=[...messages.keys()].slice(-200),url=endpoint+(older&&cursor?'?before='+cursor:'?known='+known.join(',')),data=await api(url);
  canWrite=data.canWrite;for(const m of data.messages)messages.set(m.id,m);if(older||cursor===null){cursor=data.before;hasMore=data.hasMore;}
  shell.querySelector('.chat-older').hidden=!hasMore;form.hidden=!canWrite;shell.querySelector('.chat-readonly').hidden=canWrite;error.textContent='';render();
  const latest=Math.max(0,...[...messages.values()].map(m=>Number(m.seq)));
  if(active&&shell.isConnected&&document.hasFocus()&&latest>Number(lastRead)){await api(endpoint+'/read','POST',{seq:latest});lastRead=String(latest);chatSummaryChanged();}
 }catch(err){error.textContent=err.message;if(err.status===403||err.status===404){messages.clear();list.replaceChildren();form.hidden=true;clearInterval(timer);}}finally{busy=false;}}
 shell.querySelector('.chat-older').onclick=()=>load(true);
 form.onsubmit=async event=>{event.preventDefault();if(sending||!canWrite)return;sending=true;const button=form.querySelector('[type=submit]');button.disabled=true;try{
  await api(endpoint,'POST',{text:text.value,references:refs,replyTo:reply?.id||null,nonce});text.value='';refs=[];reply=null;nonce=crypto.randomUUID();shell.querySelector('.chat-reply-draft').hidden=true;picker.hidden=true;chooseRefs();draft();await load();chatSummaryChanged();
 }catch(err){error.textContent=err.message;}finally{sending=false;button.disabled=false;}};
 switcher.querySelector('[data-case-chat-tab]').onclick=()=>{active=true;content.classList.add('case-chat-active');shell.hidden=false;switcher.querySelector('[data-case-chat-tab]').setAttribute('aria-pressed','true');switcher.querySelector('[data-case-info]').setAttribute('aria-pressed','false');load();};
 switcher.querySelector('[data-case-info]').onclick=()=>{active=false;content.classList.remove('case-chat-active');shell.hidden=true;switcher.querySelector('[data-case-chat-tab]').setAttribute('aria-pressed','false');switcher.querySelector('[data-case-info]').setAttribute('aria-pressed','true');};
 timer=setInterval(()=>{if(!shell.isConnected){clearInterval(timer);return;}load();},3000);
 return {open:()=>switcher.querySelector('[data-case-chat-tab]').click(),pause:()=>{active=false;},hasDraft,destroy:()=>{active=false;clearInterval(timer);host.remove();}};
}
const chatDetailAccess=applyDetailAccess;
applyDetailAccess=function(record){chatDetailAccess(record);if(record.type==='cases')createCaseChat(record,document.getElementById('modal'));};
if(parent===window){
 let summaries=[],summaryBusy=false,userId=null,dock=null,expanded=false,selected=null,loadError='';
 const chats=new Map();
 const hasDrafts=()=>[...chats.values()].some(chat=>chat.controller.hasDraft());
 window.dojChatHasDrafts=hasDrafts;
 function destroyDock(){for(const chat of chats.values())chat.controller.destroy();chats.clear();dock?.remove();dock=null;summaries=[];selected=null;expanded=false;userId=null;}
 function showSelection(){
  if(!dock)return;
  const current=chats.get(selected);
  dock.querySelector('.chat-dock-overview').hidden=!!current;
  dock.querySelector('.chat-dock-conversations').hidden=!current;
  dock.querySelector('[data-chat-back]').hidden=!current;
  dock.querySelector('.chat-dock-title').textContent=current?current.title:'Fallchats';
  for(const [id,chat] of chats){chat.host.hidden=id!==selected;if(expanded&&id===selected)chat.controller.open();else chat.controller.pause();}
 }
 function renderChats(){
  if(!dock)return;
  const q=dock.querySelector('[data-chat-search]').value.trim().toLocaleLowerCase('de');
  const cases=summaries.filter(r=>(r.reference+' '+r.title).toLocaleLowerCase('de').includes(q)).sort((a,b)=>(b.unread>0)-(a.unread>0)||a.title.localeCompare(b.title,'de'));
  const list=dock.querySelector('.chat-dock-list');
  list.innerHTML=cases.map(r=>'<button type="button" class="chat-dock-case" data-chat-case="'+r.id+'"><span><small>'+esc(r.reference||'Fallakte')+(r.archived?' · Archiviert':'')+'</small><strong>'+esc(r.title)+'</strong></span>'+(r.unread?'<b class="chat-dock-badge">'+r.unread+'</b>':'<span class="chat-dock-read">Öffnen →</span>')+'</button>').join('')||'<p class="chat-dock-empty">'+(loadError?esc(loadError):q?'Keine passenden Fallchats.':'Keine zugänglichen Fallchats vorhanden.')+'</p>';
  const count=summaries.reduce((n,r)=>n+r.unread,0),toggle=dock.querySelector('[data-chat-toggle]');
  toggle.querySelector('span').textContent=count?'Fallchats · '+count+' ungelesen':'Fallchats';toggle.title=count+' ungelesene Chatnachrichten';
 }
 function setExpanded(value){expanded=value;dock.querySelector('.chat-dock-panel').hidden=!expanded;const button=dock.querySelector('[data-chat-toggle]');button.setAttribute('aria-expanded',String(expanded));showSelection();if(expanded)pollChatSummary();}
 function openDockChat(record){
  selected=record.id;
  if(!chats.has(record.id)){
   const host=document.createElement('div');host.className='chat-dock-conversation';host.innerHTML='<div class="modal-content"></div>';dock.querySelector('.chat-dock-conversations').append(host);
   const controller=createCaseChat(record,host,{onDraft:()=>renderChats()});chats.set(record.id,{host,controller,title:record.title});
  }
  showSelection();
 }
 async function pollChatSummary(){
  if(summaryBusy||!state?.user||document.hidden)return;
  summaryBusy=true;const requestedUser=state.user.id;
  try{
   const data=await api('chat/summary?all=1');if(state?.user?.id!==requestedUser)return;
   summaries=data.cases;loadError='';const ids=new Set(summaries.map(r=>r.id));
   for(const [id,chat] of chats)if(!ids.has(id)){chat.controller.destroy();chats.delete(id);if(selected===id)selected=null;}
   renderChats();showSelection();
  }catch(error){if(state?.user?.id===requestedUser){loadError=error.message;renderChats();}}
  finally{summaryBusy=false;}
 }
 function ensureChatDock(){
  if(!state?.user){destroyDock();return;}
  if(userId!==state.user.id)destroyDock();
  if(dock)return;userId=state.user.id;
  dock=document.createElement('aside');dock.className='chat-dock';dock.setAttribute('aria-label','Interne Fallchats');
  dock.innerHTML='<section class="chat-dock-panel" id="fallchat-dock-panel" aria-label="Fallchats" hidden><header class="chat-dock-header"><button type="button" data-chat-back aria-label="Zur Chatübersicht" hidden>←</button><strong class="chat-dock-title">Fallchats</strong><button type="button" data-chat-minimize aria-label="Chat einklappen">−</button></header><div class="chat-dock-overview"><label class="chat-dock-search">Fallchat suchen<input type="search" data-chat-search placeholder="Titel oder Aktenzeichen …"></label><div class="chat-dock-list"><p class="chat-dock-empty">Fallchats werden geladen …</p></div></div><div class="chat-dock-conversations" hidden></div></section><button type="button" class="chat-dock-toggle" data-chat-toggle aria-label="Fallchats öffnen" aria-expanded="false" aria-controls="fallchat-dock-panel">💬 <span>Fallchats</span><b aria-hidden="true">⌃</b></button>';
  document.body.append(dock);
  dock.querySelector('[data-chat-toggle]').onclick=()=>setExpanded(!expanded);
  dock.querySelector('[data-chat-minimize]').onclick=()=>{setExpanded(false);dock.querySelector('[data-chat-toggle]').focus();};
  dock.querySelector('[data-chat-back]').onclick=()=>{selected=null;showSelection();dock.querySelector('[data-chat-search]').focus();};
  dock.querySelector('[data-chat-search]').oninput=renderChats;
  dock.querySelector('.chat-dock-list').onclick=event=>{const button=event.target.closest('[data-chat-case]');if(button){const record=summaries.find(r=>r.id===button.dataset.chatCase);if(record)openDockChat(record);}};
  pollChatSummary();
 }
 new MutationObserver(ensureChatDock).observe(document.getElementById('app'),{childList:true,subtree:true});
 setInterval(()=>{ensureChatDock();pollChatSummary();},10000);window.addEventListener('doj-chat-summary-refresh',pollChatSummary);
 window.addEventListener('beforeunload',event=>{if(hasDrafts()){event.preventDefault();event.returnValue='';}});
 document.addEventListener('click',event=>{if(event.target.closest('[data-action="logout"]')&&hasDrafts()&&!confirm('Ungesendete Chatentwürfe verwerfen und abmelden?')){event.preventDefault();event.stopImmediatePropagation();}},true);
}
