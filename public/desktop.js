/* Desktop-Adapter: Jede App nutzt eine eigene, gleichursprüngliche Ansicht.
   Fachlogik und serverseitige Rechte bleiben in den bestehenden Modulen. */
(() => {
 const params=new URLSearchParams(location.search);
 const protocol='doj-desktop-v1';
 const appRoute=params.get('app')||'dashboard',recordId=params.get('record');
 const isFrame=params.get('workspace')==='app'&&window.parent!==window;
 const original={render,refresh,nav,detail,login,api};
 const send=(type,data={})=>{if(isFrame)parent.postMessage({protocol,type,...data},location.origin);};
 const permitted=key=>{
  if(!state?.user||!modules[key]||!canRoute(key))return false;
  if(key==='settings')return !!state.user.permissions.settings;
  if(key==='audit')return !!state.user.permissions.audit;
  return true;
 };
 if(isFrame){
  let dirty=false,stale=false,initialized=false,pendingReload=false;
  let ownRevision=new Map(),closing=false;
  document.body.classList.add('workspace-app');if(recordId)document.body.classList.add('workspace-record');
  const remember=()=>{ownRevision=new Map((state?.records||[]).map(r=>[r.id,r.updatedAt]));};
  const setDirty=value=>{dirty=value;send('dirty',{dirty});};
  const notice=()=>{let el=document.getElementById('frame-refresh-notice');if(!stale){el?.remove();return;}if(el)return;el=document.createElement('div');el.id='frame-refresh-notice';el.className='frame-refresh-notice';el.setAttribute('role','status');el.innerHTML='Daten wurden in einem anderen Fenster geändert. Dein Entwurf bleibt erhalten. <button type="button">Neu laden</button>';el.querySelector('button').onclick=()=>{if(!dirty||confirm('Ungespeicherte Änderungen verwerfen und aktuelle Daten laden?')){setDirty(false);reload();}};document.body.append(el);};
  async function reload(){if(pendingReload)return;pendingReload=true;try{await original.refresh();remember();stale=false;notice();if(recordId){const r=state.records.find(r=>r.id===recordId);if(!r){setDirty(false);send('unavailable');return;}original.detail(recordId);}}catch(err){toast(err.message);}finally{pendingReload=false;}}
  document.addEventListener('input',e=>{if(e.target.closest('form'))setDirty(true);});
  document.addEventListener('change',e=>{if(e.target.closest('form'))setDirty(true);});
  document.addEventListener('pointerdown',()=>send('focus'),{capture:true});document.addEventListener('focusin',()=>send('focus'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]'))send('minimize');});
  api=async function(url,method='GET',data){
   const match=url.match(/^records\/([a-f0-9]+)(?:\/.*)?$/);
   if(method!=='GET'&&match&&ownRevision.has(match[1]))data={...data,expectedUpdatedAt:ownRevision.get(match[1])};
   try{const result=await original.api(url,method,data);if(!['GET','HEAD'].includes(method)){setDirty(false);stale=false;notice();if(result?.id&&result.updatedAt)ownRevision.set(result.id,result.updatedAt);send('changed');}return result;}catch(err){if(/gleichzeitig|anderes Fenster|aktualisiert/i.test(err.message)){stale=true;notice();}throw err;}
  };
  render=function(){original.render();document.body.classList.add('workspace-app');remember();
   if(!initialized&&state){initialized=true;
    if(!permitted(appRoute)){send('unavailable');return;}
    requestAnimationFrame(()=>{if(recordId){const record=state.records.find(r=>r.id===recordId);if(!record){send('unavailable');return;}send('title',{title:(record.reference?record.reference+' · ':'')+record.title});original.detail(recordId);}else if(params.get('action')==='password')passwordChange();send('ready');});
   }
  };
  refresh=async function(){await original.refresh();remember();};
  nav=function(key){if(permitted(key))send('open',{app:key});else toast('Für diesen Bereich fehlt das Leserecht.');};
  detail=function(id){if(recordId===id){original.detail(id);return;}const r=state.records.find(r=>r.id===id);if(r)send('record',{id,recordType:modules[r.type]?r.type:'archive',title:(r.reference?r.reference+' · ':'')+r.title});};
  login=function(){send('session-ended');};
  const dialog=document.getElementById('modal'),baseClose=dialog.close.bind(dialog);
  dialog.close=function(...args){if(dirty&&!closing&&!confirm('Ungespeicherte Änderungen verwerfen?'))return;const editing=!!dialog.querySelector('form:not(#comment-form)');setDirty(false);baseClose(...args);if(recordId&&!closing){if(editing)setTimeout(()=>original.detail(recordId),0);else send('close');}};
  dialog.addEventListener('cancel',e=>{e.preventDefault();dialog.close();});
  window.addEventListener('message',async e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.protocol!==protocol)return;const m=e.data;
   if(m.type==='check-close'){const allow=!dirty||confirm('Dieses Fenster enthält ungespeicherte Änderungen. Trotzdem schließen?');send('close-result',{token:m.token,allow});}
   if(m.type==='refresh'){if(dirty){stale=true;notice();}else await reload();}
   if(m.type==='validate'){try{const session=await original.api('session');if(!session.user){send('session-ended');return;}const fresh=await original.api('state');if(!fresh.user||!fresh.user.permissions){send('session-ended');return;}const visible=recordId?fresh.records.some(r=>r.id===recordId):true;const old=state;state=fresh;const allowed=permitted(appRoute);state=old;if(!visible||!allowed){setDirty(false);send('unavailable');return;}if(JSON.stringify(old.user.permissions)!==JSON.stringify(fresh.user.permissions)||old.user.role!==fresh.user.role){if(dirty){state.user=fresh.user;stale=true;notice();document.querySelectorAll('form input,form textarea,form select,form button:not([data-close])').forEach(el=>el.disabled=true);const banner=document.getElementById('frame-refresh-notice');if(banner)banner.firstChild.textContent='Deine Rechte wurden geändert. Der Entwurf bleibt sichtbar; bitte die aktuellen Daten laden. ';}else await reload();}}catch{send('session-ended');}}
  });
  route=appRoute;query='';filter='';return;
 }
 if(params.get('view')==='classic'){
  render=function(){original.render();if(!document.getElementById('switch-to-desktop')){const b=document.createElement('button');b.id='switch-to-desktop';b.className='quiet classic-desktop-switch';b.textContent='Zum Desktop wechseln';b.onclick=()=>{if(document.querySelector('form')&&!confirm('Offene Formulare verlassen und zum Desktop wechseln?'))return;location.href='/';};document.querySelector('.account')?.append(b);}};return;
 }
 let shell=null,highest=20,active=null,clockTimer,pollTimer,windowCounter=0;
 const windows=new Map(),closeChecks=new Map();
 const storageKey=()=>`doj-desktop-layout:${state.user.id}`;
 const geometry=()=>{try{return JSON.parse(localStorage.getItem(storageKey())||'{}');}catch{return {};}};
 const saveGeometry=win=>{if(win.maximized||matchMedia('(max-width:760px)').matches)return;const data=geometry();data[win.layoutKey]={x:win.el.offsetLeft,y:win.el.offsetTop,w:win.el.offsetWidth,h:win.el.offsetHeight};try{localStorage.setItem(storageKey(),JSON.stringify(data));}catch{}};
 const clamp=(x,y,w,h)=>{const area=document.querySelector('.os-workspace');const width=area.clientWidth,height=area.clientHeight;w=Math.min(Math.max(320,w),width);h=Math.min(Math.max(210,h),height);return {x:Math.max(0,Math.min(x,width-w)),y:Math.max(0,Math.min(y,height-39)),w,h};};
 const applyRect=(el,g)=>Object.assign(el.style,{left:g.x+'px',top:g.y+'px',width:g.w+'px',height:g.h+'px'});
 const appNames={requests:'Anträge',knowledge:'Freigabeverfahren',team:'Personal',audit:'Änderungsprotokoll',dashboard:'Übersicht'};
 const name=key=>appNames[key]||modules[key]?.[0]||key;
 const icon=key=>modules[key]?.[1]||'▤';
 function stop(){clearInterval(clockTimer);clearInterval(pollTimer);for(const win of windows.values())win.el.remove();windows.clear();active=null;shell=null;document.body.classList.remove('doj-desktop');}
 login=function(setup){stop();return original.login(setup);};
 function focus(win){if(!win||win.el.hidden)return;windows.forEach(w=>w.el.classList.remove('focused'));win.el.classList.add('focused');win.el.style.zIndex=++highest;active=win.key;tasks();}
 function nextFocus(){const candidates=[...windows.values()].filter(w=>!w.el.hidden).sort((a,b)=>Number(b.el.style.zIndex)-Number(a.el.style.zIndex));active=null;if(candidates[0])focus(candidates[0]);else tasks();}
 function minimize(win){win.el.hidden=true;win.el.classList.remove('focused');nextFocus();}
 function tasks(){if(!shell)return;const target=shell.querySelector('.os-running');target.replaceChildren();for(const win of windows.values()){const b=document.createElement('button');b.className='os-task'+(win.el.hidden?' minimized':'')+(active===win.key?' active':'');b.textContent=icon(win.app)+' '+win.title+(win.dirty?' •':'');b.setAttribute('aria-label',win.title+' – Fenster anzeigen');b.onclick=()=>{if(!win.el.hidden&&active===win.key)minimize(win);else{win.el.hidden=false;focus(win);}};target.append(b);}shell.querySelector('.os-empty').hidden=windows.size>0;}
 function sendWindow(win,type,data={}){win.frame.contentWindow?.postMessage({protocol,type,...data},location.origin);}
 function checkClose(win){return new Promise(resolve=>{if(!win.dirty){resolve(true);return;}const token=crypto.randomUUID();const timeout=setTimeout(()=>{closeChecks.delete(token);toast('Das Fenster antwortet noch nicht. Bitte erneut versuchen.');resolve(false);},12000);closeChecks.set(token,allow=>{clearTimeout(timeout);resolve(allow);});sendWindow(win,'check-close',{token});});}
 async function remove(win,force=false){if(!force&&!await checkClose(win))return false;saveGeometry(win);win.el.remove();windows.delete(win.key);nextFocus();return true;}
 async function allCanClose(){for(const win of windows.values())if(!await checkClose(win))return false;return true;}
 function max(win){if(!win.maximized){saveGeometry(win);win.previous={x:win.el.offsetLeft,y:win.el.offsetTop,w:win.el.offsetWidth,h:win.el.offsetHeight};win.maximized=true;win.el.classList.add('maximized');const area=shell.querySelector('.os-workspace');applyRect(win.el,{x:0,y:0,w:area.clientWidth,h:area.clientHeight});}else{win.maximized=false;win.el.classList.remove('maximized');applyRect(win.el,clamp(...[win.previous.x,win.previous.y,win.previous.w,win.previous.h]));}const b=win.el.querySelector('[data-window=max]');b.textContent=win.maximized?'❐':'□';b.setAttribute('aria-label',win.maximized?'Fenstergröße wiederherstellen':'Maximieren');focus(win);}
 function drag(win,handle,resizing=false){handle.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.os-controls')||win.maximized||matchMedia('(max-width:760px)').matches)return;e.preventDefault();focus(win);const start={x:e.clientX,y:e.clientY,left:win.el.offsetLeft,top:win.el.offsetTop,w:win.el.offsetWidth,h:win.el.offsetHeight};handle.setPointerCapture(e.pointerId);const shield=document.createElement('div');shield.className='os-drag-shield';shell.querySelector('.os-workspace').append(shield);shell.classList.add('os-dragging');const move=ev=>{const dx=ev.clientX-start.x,dy=ev.clientY-start.y;applyRect(win.el,resizing?clamp(start.left,start.top,start.w+dx,start.h+dy):clamp(start.left+dx,start.top+dy,start.w,start.h));};const done=()=>{shield.remove();shell?.classList.remove('os-dragging');handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',done);handle.removeEventListener('pointercancel',done);saveGeometry(win);};handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',done,{once:true});handle.addEventListener('pointercancel',done,{once:true});});}
 function openApp(app,record=null,action=null){if(!permitted(app)){toast('Für diese App fehlt das Leserecht.');return;}const r=record&&state.records.find(r=>r.id===record);if(record&&!r){toast('Der Eintrag ist nicht mehr zugänglich.');return;}const key=record?'record:'+record:action?'action:'+action:'app:'+app;if(windows.has(key)){const win=windows.get(key);win.el.hidden=false;focus(win);return;}
  const title=record?((r.reference?r.reference+' · ':'')+r.title):action==='password'?'Passwort ändern':name(app);
  const win={key,app,record,action,title,dirty:false,maximized:false,layoutKey:key};
  const el=document.createElement('section');win.el=el;el.className='os-window';el.dataset.windowKey=key;el.setAttribute('aria-label',title);
  el.innerHTML=`<header class="os-titlebar"><div class="os-title"><span>${esc(icon(app))}</span><span class="os-title-text">${esc(title)}</span><span class="os-dirty" hidden aria-label="Ungespeicherte Änderungen">•</span></div><div class="os-controls"><button type="button" data-window="min" aria-label="Minimieren">−</button><button type="button" data-window="max" aria-label="Maximieren">□</button><button type="button" data-window="close" aria-label="Schließen">×</button></div></header><div class="os-window-status" role="status"></div><iframe class="os-frame" title="${esc(title)}"></iframe><div class="os-frame-loading">${esc(name(app))} wird geöffnet …</div><button class="os-resize" type="button" aria-label="Fenstergröße mit Pfeiltasten ändern"></button>`;
  const area=shell.querySelector('.os-workspace');area.append(el);const defaults=geometry()[win.layoutKey]||{x:Math.min(125+windowCounter%6*27,area.clientWidth/3),y:55+windowCounter%5*25,w:record?900:1030,h:Math.min(740,area.clientHeight-65)};windowCounter++;applyRect(el,clamp(Number(defaults.x)||0,Number(defaults.y)||0,Number(defaults.w)||900,Number(defaults.h)||650));
  win.frame=el.querySelector('iframe');windows.set(key,win);const url=new URL('/',location.href);url.searchParams.set('workspace','app');url.searchParams.set('app',app);if(record)url.searchParams.set('record',record);if(action)url.searchParams.set('action',action);url.hash=app;win.frame.src=url.href;
  el.addEventListener('pointerdown',()=>focus(win));el.querySelector('[data-window=min]').onclick=()=>minimize(win);el.querySelector('[data-window=max]').onclick=()=>max(win);el.querySelector('[data-window=close]').onclick=()=>remove(win);const bar=el.querySelector('.os-titlebar');bar.ondblclick=e=>{if(!e.target.closest('button'))max(win);};drag(win,bar);drag(win,el.querySelector('.os-resize'),true);el.querySelector('.os-resize').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const delta=e.shiftKey?50:10;applyRect(el,clamp(el.offsetLeft,el.offsetTop,el.offsetWidth+({'ArrowLeft':-delta,'ArrowRight':delta}[e.key]||0),el.offsetHeight+({'ArrowUp':-delta,'ArrowDown':delta}[e.key]||0)));saveGeometry(win);};focus(win);
 }
 function appButtons(target,filterText=''){target.replaceChildren();Object.keys(modules).filter(permitted).filter(k=>name(k).toLocaleLowerCase('de').includes(filterText.toLocaleLowerCase('de'))).forEach(app=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<span class="os-app-icon">${esc(icon(app))}</span><span>${esc(name(app))}</span>`;b.dataset.desktopApp=app;b.onclick=()=>{openApp(app);shell.querySelector('.os-launcher').hidden=true;};target.append(b);});}
 function launcher(){const panel=shell.querySelector('.os-launcher');panel.hidden=!panel.hidden;if(!panel.hidden){const input=panel.querySelector('input');input.value='';appButtons(panel.querySelector('.os-app-grid'));input.focus();}}
 function updateHeader(){if(!shell)return;shell.querySelector('.os-user-name').textContent=state.user.name+' · '+state.user.role;const count=state.records.filter(r=>r.submission?.status==='Vorgelegt'||['requests','documents','knowledge'].includes(r.type)&&r.reviewStatus==='In Prüfung').length;shell.querySelector('.os-count').textContent=count||'';appButtons(shell.querySelector('.os-shortcuts'));shell.querySelectorAll('.os-shortcuts button').forEach(b=>b.className='os-shortcut');}
 function build(){document.body.classList.add('doj-desktop');$('#app').innerHTML=`<div class="doj-os"><header class="os-top"><div class="os-brand"><img src="/favicon.svg" alt="">DEPARTMENT OF JUSTICE</div><div class="os-user"><span class="os-user-name"></span><button data-os="notifications" aria-label="Freigaben und Benachrichtigungen">◷ <span class="os-count"></span></button><button data-os="password">Passwort</button><button data-os="classic">Klassisch</button><button data-os="logout">Abmelden</button></div></header><main class="os-workspace" aria-label="Desktop"><div class="os-caption">DOJ DESKTOP · DEIN ARBEITSPLATZ</div><div class="os-watermark" aria-hidden="true">⚖<small>JUSTITIA · LEX · INTEGRITAS</small></div><nav class="os-shortcuts" aria-label="Desktop-Apps"></nav><div class="os-empty"><div>Dein Arbeitsplatz.</div><p>Öffne eine App auf dem Desktop oder im Startmenü. Du kannst mehrere Akten nebeneinander bearbeiten.</p></div></main><section class="os-launcher" aria-label="Startmenü" hidden><h2>Dein Arbeitsplatz</h2><input type="search" placeholder="App suchen …" aria-label="Apps suchen"><div class="os-app-grid"></div><small>Fenster verschieben: Titelleiste ziehen · Maximieren: Titelleiste doppelklicken</small></section><footer class="os-taskbar"><button class="os-start" data-os="start">⚖ Start</button><button class="os-search-button" data-os="search">⌕ Apps suchen …</button><nav class="os-running" aria-label="Geöffnete Fenster"></nav><div class="os-clock"></div></footer></div>`;
  shell=document.querySelector('.doj-os');updateHeader();shell.querySelector('[data-os=start]').onclick=launcher;shell.querySelector('[data-os=search]').onclick=()=>{if(shell.querySelector('.os-launcher').hidden)launcher();else shell.querySelector('.os-launcher input').focus();};shell.querySelector('.os-launcher input').oninput=e=>appButtons(shell.querySelector('.os-app-grid'),e.target.value);shell.querySelector('[data-os=password]').onclick=()=>openApp('dashboard',null,'password');shell.querySelector('[data-os=notifications]').onclick=()=>openApp('knowledge');shell.querySelector('[data-os=classic]').onclick=async()=>{if(await allCanClose())location.href='/?view=classic';};shell.querySelector('[data-os=logout]').onclick=async()=>{if(!await allCanClose())return;try{await original.api('logout','POST');state=null;login();}catch(e){toast(e.message);}};
  shell.addEventListener('pointerdown',e=>{if(!e.target.closest('.os-launcher')&&!e.target.closest('[data-os=start],[data-os=search]'))shell.querySelector('.os-launcher').hidden=true;});
  const clock=()=>{if(!shell)return;const now=new Date();shell.querySelector('.os-clock').innerHTML=esc(now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}))+`<small>${esc(now.toLocaleDateString('de-DE'))}</small>`;};clock();clockTimer=setInterval(clock,30000);
  pollTimer=setInterval(()=>sync(true),60000);if(permitted(route))openApp(route);else openApp('dashboard');
 }
 async function sync(validate=false){try{const session=await original.api('session');if(!session.user){state=null;login();return;}if(session.user.requiresPasswordChange){stop();passwordChange(true);return;}const previousUser=state?.user;state=await original.api('state');if(previousUser&&(previousUser.role!==state.user.role||JSON.stringify(previousUser.permissions)!==JSON.stringify(state.user.permissions)))validate=true;if(!shell)build();else updateHeader();for(const win of [...windows.values()]){if(!permitted(win.app)||win.record&&!state.records.some(r=>r.id===win.record)){await remove(win,true);continue;}if(win.record){const r=state.records.find(r=>r.id===win.record);win.title=(r.reference?r.reference+' · ':'')+r.title;win.el.querySelector('.os-title-text').textContent=win.title;win.el.setAttribute('aria-label',win.title);win.frame.title=win.title;}if(validate)sendWindow(win,'validate');}tasks();}catch(e){toast(e.message);}}
 render=function(){if(!state)return;if(!shell)build();else updateHeader();};
 refresh=async()=>sync();
 nav=key=>openApp(key);
 detail=id=>{const record=state.records.find(r=>r.id===id);if(record)openApp(modules[record.type]?record.type:'archive',id);};
 window.addEventListener('message',async e=>{if(e.origin!==location.origin||e.data?.protocol!==protocol)return;const win=[...windows.values()].find(w=>w.frame.contentWindow===e.source);if(!win)return;const m=e.data;
  if(m.type==='focus'){if(active!==win.key)focus(win);}
  if(m.type==='ready'){win.el.querySelector('.os-frame-loading').hidden=true;}
  if(m.type==='dirty'){win.dirty=!!m.dirty;win.el.querySelector('.os-dirty').hidden=!win.dirty;tasks();}
  if(m.type==='title'&&typeof m.title==='string'){win.title=m.title.slice(0,350);win.el.querySelector('.os-title-text').textContent=win.title;tasks();}
  if(m.type==='open')openApp(m.app);
  if(m.type==='record'){if(!state.records.some(r=>r.id===m.id))await sync();openApp(m.recordType,m.id);}
  if(m.type==='close')remove(win);
  if(m.type==='minimize')minimize(win);
  if(m.type==='close-result')closeChecks.get(m.token)?.(!!m.allow),closeChecks.delete(m.token);
  if(m.type==='changed'){await sync();for(const other of windows.values())if(other!==win)sendWindow(other,'refresh');}
  if(m.type==='session-ended'){state=null;login();}
  if(m.type==='unavailable'){await remove(win,true);toast('Der Eintrag oder Bereich ist nicht mehr zugänglich.');}
 });
 window.addEventListener('resize',()=>{if(!shell||matchMedia('(max-width:760px)').matches)return;for(const win of windows.values()){if(win.maximized){const area=shell.querySelector('.os-workspace');applyRect(win.el,{x:0,y:0,w:area.clientWidth,h:area.clientHeight});}else applyRect(win.el,clamp(win.el.offsetLeft,win.el.offsetTop,win.el.offsetWidth,win.el.offsetHeight));}});
 window.addEventListener('beforeunload',e=>{if([...windows.values()].some(w=>w.dirty)){e.preventDefault();e.returnValue='';}});
 document.addEventListener('keydown',e=>{if(!shell)return;if(e.key==='Escape')shell.querySelector('.os-launcher').hidden=true;if(e.altKey&&e.key.toLowerCase()==='m'&&active){e.preventDefault();minimize(windows.get(active));}});
})();