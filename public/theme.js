/* Shared theme for the desktop and every app window. No document content is altered. */
(()=>{
 const key='doj-color-theme';let current='light';
 try{const saved=localStorage.getItem(key);if(['light','dark'].includes(saved))current=saved;}catch{}
 document.documentElement.dataset.theme=current;
 function paint(){const b=document.querySelector('[data-theme-toggle]');if(!b)return;const dark=current==='dark';b.innerHTML='<span aria-hidden="true">'+(dark?'☀':'☾')+'</span><span class="theme-toggle-label">'+(dark?'Hell':'Dunkel')+'</span>';b.setAttribute('aria-label',dark?'Hellmodus aktivieren':'Dunkelmodus aktivieren');b.setAttribute('title',dark?'Zum Hellmodus wechseln':'Zum Dunkelmodus wechseln');b.setAttribute('aria-pressed',String(dark));}
 function apply(theme){if(!['light','dark'].includes(theme))return;current=theme;document.documentElement.dataset.theme=theme;paint();for(const iframe of document.querySelectorAll('iframe.os-frame'))iframe.contentWindow?.postMessage({protocol:'doj-theme-v1',theme},location.origin);}
 function ensure(){if(parent!==window)return;const host=document.querySelector('.os-user,.topbar .account');if(!host||host.querySelector('[data-theme-toggle]'))return;const b=document.createElement('button');b.type='button';b.dataset.themeToggle='';b.className='theme-toggle';host.prepend(b);b.onclick=()=>{const next=current==='dark'?'light':'dark';try{localStorage.setItem(key,next);}catch{}apply(next);};paint();}
 window.addEventListener('storage',event=>{if(event.key===key)apply(event.newValue||'light');});
 window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===parent&&event.data?.protocol==='doj-theme-v1')apply(event.data.theme);});
 document.addEventListener('DOMContentLoaded',()=>{ensure();const app=document.getElementById('app');if(app)new MutationObserver(ensure).observe(app,{childList:true,subtree:true});},{once:true});
})();
