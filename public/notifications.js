/* The bell exists only in the main workspace, never once per app window. */
(()=>{if(parent!==window)return;
 let panel=null,owner=null,items=[],unread=0,opened=false,busy=false,warning='',error='',loading=false;
 const bellIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
 function button(){return document.querySelector('[data-os=notifications],[data-notification-bell]');}
 function badge(){const b=button();if(!b)return;const label='Benachrichtigungen'+(unread?', '+unread+' ungelesen':'');if(b.getAttribute('aria-label')!==label)b.setAttribute('aria-label',label);b.setAttribute('aria-expanded',String(opened));b.setAttribute('aria-controls','doj-notifications');const count=b.querySelector('.notification-count');if(count&&count.textContent!==(unread?String(unread):''))count.textContent=unread?String(unread):'';b.classList.toggle('has-unread',unread>0);}
 function groups(){return window.dojNotificationGroups?.group(items,state?.records||[])||items.map(i=>({title:i.title,items:[i]}));}
 function paint(){if(!panel)return;panel.hidden=!opened;badge();if(!opened)return;
  panel.innerHTML='<header><div><strong>Benachrichtigungen</strong><small>'+unread+' ungelesen</small></div><button type="button" data-notification-close aria-label="Benachrichtigungen schließen">✕</button></header><div data-notification-sounds></div><div class="notification-toolbar"><button type="button" data-notification-all '+(!items.some(i=>!i.read)?'disabled':'')+'>Alle als gelesen markieren</button><button type="button" data-notification-refresh aria-label="Benachrichtigungen aktualisieren">↻</button></div>'+(error?'<p role="alert">'+esc(error)+'</p>':'')+(warning?'<p class="notification-warning">'+esc(warning)+'</p>':'')+'<div class="notification-list">'+(items.length?groups().map((g,index)=>'<section class="notification-group"><header><strong>'+esc(g.title)+'</strong><span>'+g.items.filter(i=>!i.read).length+' neu · '+g.items.length+' Hinweise</span><button type="button" data-notification-group-read="'+index+'" '+(g.items.some(i=>!i.read)?'':'disabled')+'>Gruppe gelesen</button></header>'+g.items.map(i=>'<article class="notification-item '+(!i.read?'unread':'')+'"><button type="button" data-notification-open="'+i.id+'"><span class="notification-symbol" aria-hidden="true">'+({'private-chat':'✉','case-chat':'✉',record:'▤',events:'◷',todos:'☑',account:'⚙'}[i.target.type]||'•')+'</span><span><strong>'+esc(i.message)+'</strong><span>'+esc(i.title)+'</span><time datetime="'+esc(i.at)+'">'+esc(new Date(i.at).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))+'</time></span></button>'+(!i.read?'<button type="button" class="notification-read" data-notification-read="'+i.id+'" aria-label="Als gelesen markieren">✓</button>':'')+'</article>').join('')+'</section>').join(''):'<p class="notification-empty">'+(loading?'Hinweise werden geladen …':'Noch keine Benachrichtigungen.')+'</p>')+'</div>';
  window.dojNotificationSounds?.mount(panel.querySelector('[data-notification-sounds]'));
  panel.querySelector('[data-notification-close]').onclick=()=>close(true);panel.querySelector('[data-notification-refresh]').onclick=poll;
  panel.querySelector('[data-notification-all]').onclick=()=>mark(items.filter(i=>!i.read).map(i=>i.id));
  panel.querySelectorAll('[data-notification-group-read]').forEach(b=>b.onclick=()=>mark(groups()[Number(b.dataset.notificationGroupRead)].items.filter(i=>!i.read).map(i=>i.id)));
  panel.querySelectorAll('[data-notification-read]').forEach(b=>b.onclick=()=>mark([b.dataset.notificationRead]));
  panel.querySelectorAll('[data-notification-open]').forEach(b=>b.onclick=()=>openItem(b.dataset.notificationOpen));
 }
 function close(focus=false){opened=false;paint();if(focus)button()?.focus();}
 async function mark(ids){if(!ids.length)return true;const user=owner;try{await api('notifications/read','POST',{ids});if(owner!==user)return false;for(const i of items)if(ids.includes(i.id))i.read=true;unread=Math.max(0,unread-ids.length);error='';paint();return true;}catch(e){if(owner===user){error=e.message;paint();}return false;}}
 async function openItem(id){const user=owner;try{const fresh=await api('notifications');if(owner!==user)return;items=fresh.items;unread=fresh.unread;const item=items.find(i=>i.id===id);if(!item){error='Der Hinweis ist nicht mehr verfügbar.';paint();return;}if(!item.read&&!await mark([id]))return;close();const t=item.target;
   if(t.type==='private-chat'||t.type==='case-chat')window.dispatchEvent(new CustomEvent('doj-open-dock-chat',{detail:{id:t.id,kind:t.type==='private-chat'?'private':'cases'}}));
   else if(document.querySelector('.doj-os'))window.dispatchEvent(new CustomEvent('doj-open-notification-target',{detail:t}));
   else if(t.type==='record'){const freshState=await api('state');if(owner!==user)return;state=freshState;detail(t.id);window.dojFocusNotificationTarget?.(t);}
   else if(t.type==='events'){nav('calendar');await window.openOrganizerEvent?.(t.id);}
   else if(t.type==='todos'){nav('todos');await window.openOrganizerTodo?.(t.id);}
   else if(t.type==='account')window.dojShowOwnAccess?.();else toast(item.message);
  }catch(e){error=e.message;paint();}}
 async function poll(){if(busy||!state?.user)return;const user=owner;busy=true;loading=true;try{const result=await api('notifications');if(owner!==user||state?.user?.id!==user)return;window.dojNotificationSounds?.ingestFeed(user,result.items);items=result.items;unread=result.unread;warning=result.warning;error='';}catch(e){if(owner===user){error=e.message;if([401,403].includes(e.status)){items=[];unread=0;}}}finally{busy=false;loading=false;paint();}}
 window.toggleNotifications=()=>{ensure();if(!panel)return;opened=!opened;paint();if(opened){poll();panel.querySelector('[data-notification-close]')?.focus();}};
 function ensure(){if(!state?.user){panel?.remove();panel=null;owner=null;items=[];unread=0;opened=false;return;}if(owner!==state.user.id){panel?.remove();panel=null;owner=state.user.id;items=[];unread=0;opened=false;}
  if(!panel){panel=document.createElement('aside');panel.id='doj-notifications';panel.className='notification-panel';panel.setAttribute('aria-label','Benachrichtigungen');panel.hidden=true;document.body.append(panel);poll();}
  let b=button();if(!b){const account=document.querySelector('.topbar .account');if(account){b=document.createElement('button');b.type='button';b.dataset.notificationBell='';account.prepend(b);}}
  if(b&&!b.querySelector('.notification-count')){b.innerHTML=bellIcon+'<span class="notification-count"></span>';b.classList.add('notification-bell');}if(b)b.onclick=window.toggleNotifications;badge();
 }
 new MutationObserver(ensure).observe(document.getElementById('app'),{childList:true,subtree:true});
 setInterval(()=>{ensure();poll();},10000);
 document.addEventListener('click',e=>{if(opened&&!e.target.closest('#doj-notifications,[data-os=notifications],[data-notification-bell]'))close();});
 document.addEventListener('keydown',e=>{if(opened&&e.key==='Escape'){e.preventDefault();close(true);}});
 window.addEventListener('focus',poll);document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});window.addEventListener('doj-chat-summary-refresh',poll);
 window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.protocol==='doj-desktop-v1'&&['changed','chat-update'].includes(e.data.type))poll();});
})();
