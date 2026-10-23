/* Erinnerungen laufen ausschließlich im geöffneten Hauptfenster. */
if(parent===window){
 let reminders=null,reminderUser=null,polling=false,events=[],snoozed=new Map(),collapsed=false;
 function clearReminders(){reminders?.remove();reminders=null;events=[];snoozed.clear();reminderUser=null;collapsed=false;}
 function paintReminders(){
  if(!reminders)return;const now=Date.now(),soon=dojOrganizerTime.upcoming(events,now,3).filter(e=>(snoozed.get(e.id+'|'+e.startAt)||0)<=now);reminders.hidden=soon.length===0;
  reminders.innerHTML='<header><strong>Bevorstehende Termine</strong><small>Nächste 3 Stunden</small><button type="button" data-reminder-collapse aria-expanded="'+!collapsed+'" aria-label="Terminhinweise '+(collapsed?'ausklappen':'einklappen')+'">'+(collapsed?'⌄':'−')+'</button></header>'+(collapsed?'':soon.slice(0,5).map(e=>{const minutes=Math.ceil((Date.parse(e.startAt)-now)/60000);return '<article><div><strong>'+esc(e.title)+'</strong><small>'+esc(minutes<=0?'Läuft gerade':minutes<60?'In '+minutes+' Min.':'In '+Math.floor(minutes/60)+' Std. '+minutes%60+' Min.')+' · '+esc(new Date(e.startAt).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}))+'</small>'+(e.description?'<p class="reminder-description">'+esc(e.description.slice(0,140))+'</p>':'')+'</div><div><button type="button" data-reminder-open="'+e.id+'">Öffnen</button><button type="button" data-reminder-snooze="'+e.id+'" aria-label="'+esc(e.title)+' für 15 Minuten ausblenden">15 Min.</button></div></article>';}).join('')+(soon.length>5?'<p>Weitere '+(soon.length-5)+' Termine im Kalender.</p>':''));
  reminders.querySelector('[data-reminder-collapse]').onclick=()=>{collapsed=!collapsed;paintReminders();};
  reminders.querySelectorAll('[data-reminder-open]').forEach(button=>button.onclick=()=>{const item=events.find(e=>e.id===button.dataset.reminderOpen);if(item.source==='hearing'){detail(item.recordId);return;}if(document.querySelector('.doj-os'))window.dispatchEvent(new CustomEvent('doj-open-calendar-event',{detail:{id:item.id}}));else{nav('calendar');setTimeout(()=>window.openOrganizerEvent?.(item.id),0);}});
  reminders.querySelectorAll('[data-reminder-snooze]').forEach(button=>button.onclick=()=>{const item=events.find(e=>e.id===button.dataset.reminderSnooze);snoozed.set(item.id+'|'+item.startAt,Date.now()+15*60000);paintReminders();});
 }
 async function pollReminders(){
  if(polling||!state?.user||document.hidden)return;
  if(!state.user.permissions?.modules?.hearings?.read){events=[];paintReminders();return;}
  const requestedUser=state.user.id;polling=true;
  try{const result=await api('organizer/reminders');if(state?.user?.id!==requestedUser)return;events=result.events;paintReminders();}catch(error){if(error.status===401||error.status===403){events=[];paintReminders();}}finally{polling=false;}
 }
 function ensureReminders(){if(!state?.user){clearReminders();return;}if(reminderUser!==state.user.id)clearReminders();if(reminders)return;reminderUser=state.user.id;reminders=document.createElement('aside');reminders.className='organizer-reminders';reminders.setAttribute('aria-label','Terminerinnerungen');reminders.setAttribute('aria-live','polite');reminders.hidden=true;document.body.append(reminders);pollReminders();}
 new MutationObserver(ensureReminders).observe(document.getElementById('app'),{childList:true,subtree:true});
 setInterval(()=>{ensureReminders();paintReminders();pollReminders();},60000);
 window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.protocol==='doj-desktop-v1'&&event.data.type==='changed')pollReminders();});
 window.addEventListener('focus',pollReminders);document.addEventListener('visibilitychange',()=>{if(!document.hidden)pollReminders();});
}
