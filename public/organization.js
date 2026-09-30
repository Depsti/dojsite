entryLabels.hearings={create:'Verhandlung planen',save:'Verhandlung speichern',title:'Bezeichnung der Verhandlung',description:'Gegenstand / Protokoll'};
entryLabels.tasks={create:'Aufgabe erstellen',save:'Aufgabe speichern',title:'Aufgabentitel',description:'Auftrag / Hinweise'};
const organizationListing=listing;
listing=function(){
 if(route==='knowledge')return reviewPage();
 const base=organizationListing();
 if(route==='hearings')return base+deadlinePage();
 if(route==='tasks')return base+assignmentPage();
 return base;
};
function deadlinePage(){
 const entries=state.records.filter(r=>['hearings','tasks','requests','cases'].includes(r.type)&&r.date&&!['Archiviert','Abgeschlossen','Abgelehnt'].includes(r.status)).sort((a,b)=>a.date.localeCompare(b.date));
 return `<section class="panel"><div class="panel-head"><h2>Fristenübersicht</h2><span class="subtitle">Nur Einträge mit optional gesetztem Termin</span></div>${entries.length?`<div class="panel-body">${entries.map(r=>`<div class="organization-row"><div><strong>${esc(r.title)}</strong><small>${esc(modules[r.type][0])} · ${esc(new Date(r.date).toLocaleString('de-DE'))}${new Date(r.date)<new Date()?' · Überfällig':''}</small></div><button data-org-open="${r.id}">Öffnen</button></div>`).join('')}</div>`:empty('Keine Fristen gesetzt','Undatierte Verhandlungen werden weiterhin als „Termin offen“ geführt.')}</section>`;
}
function assignmentPage(){
 const manage=state.user.permissions.assignments;
 const entries=state.records.filter(r=>['cases','hearings'].includes(r.type)&&r.status!=='Archiviert'&&(manage&&r.capabilities?.edit||r.owner===state.user.id||r.assignedProsecutors?.includes(state.user.id)));
 const offers=state.assignmentOffers||[];
 return `<section class="panel"><div class="panel-head"><h2>Akten & Verhandlungszuteilung</h2></div><div class="panel-body">${entries.map(r=>`<div class="organization-row"><div><strong>${esc(r.reference||modules[r.type][0])} · ${esc(r.title)}</strong><small>${esc((r.assignedProsecutors?.length?r.assignedProsecutors.map(userName):[userName(r.owner)]).join(', '))}${r.openForClaim?' · Zur Selbstübernahme freigegeben':''}</small></div><div><button data-org-open="${r.id}">Öffnen</button>${manage&&r.capabilities?.edit?`<button data-assignment="${r.id}">Zuteilung verwalten</button>`:''}</div></div>`).join('')||'<p class="subtitle">Keine für dich verwaltbaren oder zugewiesenen Einträge.</p>'}</div></section><section class="panel"><div class="panel-head"><h2>Zur Selbstübernahme freigegeben</h2></div><div class="panel-body">${offers.map(r=>`<div class="organization-row"><div><strong>${esc(r.reference||modules[r.type][0])} · ${esc(r.title)}</strong><small>${r.date?esc(new Date(r.date).toLocaleString('de-DE')):'Termin offen'}</small></div><button data-claim="${r.id}">Selbst übernehmen</button></div>`).join('')||'<p class="subtitle">Keine verfügbaren Einträge. Die Anzeige berücksichtigt deine Rolle und Bereichsrechte.</p>'}</div></section>`;
}
const reviewState=r=>r.reviewStatus||(['In Prüfung','Freigegeben'].includes(r.status)?r.status:'Entwurf');
function reviewPage(){
 const items=state.records.filter(r=>['knowledge','requests','documents'].includes(r.type)&&r.status!=='Archiviert'&&(!query||[r.title,r.description].join(' ').toLowerCase().includes(query.toLowerCase())));
 return heading('Freigabeverfahren','Entwurf → Prüfung → Freigegeben oder Zurückgegeben.',canModule('knowledge','create')?'<button class="primary" data-new="knowledge">+ Entwurf erstellen</button>':'')+`<div class="toolbar"><input id="search" type="search" placeholder="Entwürfe und Entscheidungen suchen …" value="${esc(query)}" aria-label="Freigabeverfahren durchsuchen"></div><section class="panel"><div class="panel-head"><h2>${items.length} Verfahren</h2></div><div class="panel-body">${items.map(r=>`<div class="organization-row"><div><strong>${esc(r.title)}</strong><small>${esc(modules[r.type][0])} · ${esc(userName(r.owner))}</small>${badge(reviewState(r))}</div><button data-org-open="${r.id}">Verfahren öffnen</button></div>`).join('')||'<p class="subtitle">Noch keine sichtbaren Entwürfe vorhanden.</p>'}</div></section>`;
}
function assignmentDialog(id){
 const r=state.records.find(x=>x.id===id);if(!r)return;
 const selected=r.assignedProsecutors||[r.owner].filter(Boolean);
 const candidates=state.users.filter(u=>u.active!==false&&['Leitung','Staatsanwalt'].includes(u.role)&&u.permissions?.modules?.[r.type]?.read&&u.permissions?.modules?.[r.type]?.edit&&(!r.caseId||u.permissions?.modules?.cases?.read&&u.permissions?.modules?.cases?.edit));
 modal('Zuteilung verwalten',`<h2>${esc(r.title)}</h2><form id="assignment-form"><p>Staatsanwälte auswählen:</p>${candidates.map(u=>`<label class="check"><input type="checkbox" name="prosecutor" value="${u.id}" ${selected.includes(u.id)?'checked':''}>${esc(u.name)}</label>`).join('')||'<p class="subtitle">Keine Personen mit den erforderlichen Bereichsrechten.</p>'}<label class="check"><input type="checkbox" name="openForClaim" ${r.openForClaim?'checked':''}>Zur Selbstübernahme freischalten</label><div class="notice">Die Freischaltung zeigt berechtigten Staatsanwälten den Titel in der Aufgabenübersicht. Nach Übernahme erhalten sie Bearbeitungszugriff. Eine Übernahme schließt die Freischaltung.</div><p class="form-error"></p><div class="actions"><button type="button" data-close>Abbrechen</button><button class="primary">Zuteilung speichern</button></div></form>`);
 $('#assignment-form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('.primary');button.disabled=true;try{await api('records/'+id+'/assignment','PUT',{assignedProsecutors:[...e.target.querySelectorAll('[name="prosecutor"]:checked')].map(el=>el.value),openForClaim:e.target.elements.openForClaim.checked});$('#modal').close();await refresh();toast('Zuteilung gespeichert.');}catch(err){e.target.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
function reviewDialog(r,status){
 modal(status,`<h2>${esc(r.title)}</h2><form id="review-form"><label class="field">${status==='In Prüfung'?'Hinweis für die Prüfung (optional)':'Begründung der Entscheidung'}<textarea name="reason" rows="4" maxlength="5000" ${status==='In Prüfung'?'':'required'}></textarea></label><p class="form-error"></p><div class="actions"><button type="button" data-close>Abbrechen</button><button class="primary">${status==='In Prüfung'?'Zur Prüfung einreichen':'Entscheidung speichern'}</button></div></form>`);
 $('#review-form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('.primary');button.disabled=true;try{await api('records/'+r.id+'/review','POST',{status,reason:e.target.elements.reason.value});await refresh();detail(r.id);toast('Verfahrensstatus aktualisiert.');}catch(err){e.target.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
const organizationAccessUI=applyAccessUI;
applyAccessUI=function(){organizationAccessUI();document.querySelectorAll('[data-org-open]').forEach(b=>b.onclick=()=>detail(b.dataset.orgOpen));document.querySelectorAll('[data-assignment]').forEach(b=>b.onclick=()=>assignmentDialog(b.dataset.assignment));document.querySelectorAll('[data-claim]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const r=await api('records/'+b.dataset.claim+'/claim','POST',{});await refresh();detail(r.id);toast('Eintrag übernommen.');}catch(err){toast(err.message);await refresh();}});};
const organizationDetail=applyDetailAccess;
applyDetailAccess=function(r){
 organizationDetail(r);
 const actions=$('#modal .actions');
 if(['cases','hearings'].includes(r.type)&&state.user.permissions.assignments&&r.capabilities?.edit){const b=document.createElement('button');b.textContent='Zuteilung verwalten';b.onclick=()=>assignmentDialog(r.id);actions.append(b);}
 if(r.type==='cases'){const info=document.createElement('p');info.className='subtitle';info.textContent=r.hearingExpected?'Verhandlung voraussichtlich erforderlich':'Keine Verhandlung vorgemerkt';$('#modal .detail-meta').after(info);}
 if(['knowledge','documents','requests'].includes(r.type)){
  const current=reviewState(r),section=document.createElement('section');section.className='case-person-section';
  section.innerHTML=`<div class="panel-head"><h2>Freigabeverfahren</h2>${badge(current)}</div><div class="panel-body">${(r.reviewHistory||[]).map(h=>`<div class="comment"><strong>${esc(h.to)} · ${esc(h.user)}</strong><small>${esc(new Date(h.at).toLocaleString('de-DE'))}</small><p>${esc(h.reason||'Ohne Vermerk')}</p></div>`).join('')||'<p class="subtitle">Noch keine Verfahrensschritte dokumentiert.</p>'}${r.capabilities?.edit?(['Entwurf','Zurückgegeben'].includes(current)?'<button data-review-state="In Prüfung">Zur Prüfung einreichen</button>':current==='In Prüfung'&&state.user.permissions.approve?'<button data-review-state="Freigegeben">Freigeben</button><button data-review-state="Zurückgegeben">Zurückgeben</button>':''):''}</div>`;
  $('#modal .prose').after(section);section.querySelectorAll('[data-review-state]').forEach(b=>b.onclick=()=>reviewDialog(r,b.dataset.reviewState));
  if(['In Prüfung','Freigegeben'].includes(current))$('#edit-record')?.remove();
 }
};
const organizationEditor=editor;
editor=function(type,existing){
 if(type==='knowledge'){entryLabels.knowledge={create:'Entwurf erstellen',save:'Entwurf speichern',title:'Betreff des Freigabeverfahrens',description:'Inhalt / Begründung'};}organizationEditor(type,existing);const form=$('#record-form');if(!form)return;
 if(type==='cases'){
  const label=document.createElement('label');label.className='check';label.innerHTML=`<input type="checkbox" name="hearingExpected" ${existing?.hearingExpected?'checked':''}>Verhandlung voraussichtlich erforderlich`;
  form.querySelector('.actions').before(label);
 }
 if(['knowledge','documents','requests'].includes(type))form.elements.status.disabled=true;
 if(['cases','hearings'].includes(type)&&!state.user.permissions.assignments){for(const option of [...form.elements.owner.options])if(option.value!==state.user.id&&option.value!==(existing?.owner||''))option.remove();}
 const submit=form.onsubmit;
 form.onsubmit=async e=>{if(type==='cases'){
  // The normal editor serializes text fields; normalize the additional checkbox before saving.
  const box=form.elements.hearingExpected;const input=document.createElement('input');input.type='hidden';input.name='hearingExpected';input.value=box.checked?'true':'false';box.name='';form.append(input);try{await submit(e);}finally{input.remove();box.name='hearingExpected';}
 }else await submit(e);};
};
