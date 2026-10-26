/* Eilverfahrens-Protokolle: Zugriff wird zusätzlich auf dem Server geprüft. */
(()=>{
 modules.expedited=['Eilverfahren','◴'];
 const recordsForPage=()=>state.records.filter(r=>r.type==='expedited').sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const canCreate=()=>canModule('expedited','create')&&canModule('expedited','edit');
 const stamp=value=>value?new Date(value).toLocaleString('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium',timeStyle:'short'})+' Uhr':'Noch offen';
 const local=value=>{if(!value)return '';const d=new Date(value);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);};
 const previousPage=page;
 page=function(){
  if(route!=='expedited')return previousPage();
  const rows=recordsForPage().filter(r=>(!filter||r.status===filter)&&(!query||[r.title,r.authorName,r.description].join(' ').toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de'))));
  return heading('Eilverfahren',isLeadershipAccount(state.user)?'Alle Eilverfahrens-Protokolle der Staatsanwaltschaft.':'Deine persönlichen Eilverfahrens-Protokolle.',canCreate()?'<button class="primary" data-expedited-new>+ Protokoll anlegen</button>':'')+
  '<div class="expedited-toolbar"><label class="field">Protokoll suchen<input id="expedited-search" type="search" value="'+esc(query)+'" placeholder="Az., CopNet-Zeichen, Notizen …"></label><label class="field">Status<select id="expedited-filter"><option value="">Alle Status</option>'+['In Bearbeitung','Abgeschlossen'].map(v=>'<option '+(filter===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label></div>'+
  '<div class="cards expedited-list">'+(rows.map(r=>'<article class="card"><div class="expedited-card-top">'+badge(r.status)+'<small>'+esc(stamp(r.createdAt))+'</small></div><h2>'+esc(r.reference)+'</h2><p>'+esc(r.authorName||userName(r.createdBy))+'</p><p>Beginn: '+esc(stamp(r.expeditedData.startedAt))+'</p><p>'+money(r.expeditedData.fine)+' · '+r.expeditedData.custodyUnits+' HE</p><button data-expedited-open="'+r.id+'">Protokoll öffnen</button></article>').join('')||'<section class="panel"><p>'+((query||filter)?'Keine passenden Protokolle gefunden.':'Noch keine Eilverfahren vorhanden.')+'</p></section>')+'</div>';
 };
 function view(r){
  const d=r.expeditedData;
  modal('Eilverfahrens-Protokoll','<section class="expedited-detail"><p class="eyebrow">DEPARTMENT OF JUSTICE · EILVERFAHREN</p><h1>'+esc(r.reference)+'</h1><p>'+badge(r.status)+' · '+esc(r.authorName||userName(r.createdBy))+'</p><dl><div><dt>Beweissicherung</dt><dd><a href="'+esc(d.evidenceChannelUrl)+'" target="_blank" rel="noopener noreferrer">Discord-Kanal öffnen ↗</a></dd></div><div><dt>Begleitpersonen</dt><dd>'+esc(d.companions||'Keine angegeben')+'</dd></div><div><dt>CopNet-Aktenzeichen</dt><dd>'+esc(d.copnetReference||'Nicht angegeben')+'</dd></div><div><dt>Beginn</dt><dd>'+esc(stamp(d.startedAt))+'</dd></div><div><dt>Ende</dt><dd>'+esc(stamp(d.endedAt))+'</dd></div><div><dt>Geldstrafe / Haft</dt><dd>'+money(d.fine)+' · '+d.custodyUnits+' HE</dd></div></dl><h2>Notizen</h2><div class="prose">'+esc(d.notes||'Keine Notizen hinterlegt.')+'</div>'+(r.completedAt?'<p class="subtitle">Abgeschlossen am '+esc(stamp(r.completedAt))+'. Das Protokoll ist schreibgeschützt.</p>':'')+'<div class="actions">'+(r.capabilities.edit?'<button class="primary" data-expedited-edit>Bearbeiten / abschließen</button>':'')+'<button type="button" data-close>Schließen</button></div></section>');
  $('#modal').scrollTop=0;$('#modal [data-expedited-edit]')?.addEventListener('click',()=>edit(r));
 }
 function edit(r){
  const d=r?.expeditedData||{startedAt:new Date().toISOString(),fine:0,custodyUnits:0},requestId=crypto.randomUUID();
  const input=(name,label,type='text',attrs='')=>'<label class="field">'+label+'<input name="'+name+'" type="'+type+'" '+attrs+' value="'+esc(type==='datetime-local'?local(d[name]):d[name]??'')+'"></label>';
  modal(r?'Protokoll bearbeiten':'Eilverfahren anlegen','<form id="expedited-form"><p class="subtitle">'+(r?esc(r.reference):'Das Aktenzeichen wird beim ersten Speichern aus deinem Namenskürzel, Datum und Uhrzeit automatisch vergeben.')+'</p><div class="form-grid">'+
   '<label class="field full">Beweissicherung · Discord-Channellink<input type="url" name="evidenceChannelUrl" required maxlength="500" placeholder="https://discord.com/channels/Server-ID/Kanal-ID" value="'+esc(d.evidenceChannelUrl||'')+'"></label>'+
   input('companions','Mit wem warst du dort? (optional)','text','maxlength="1000"')+input('copnetReference','CopNet-Aktenzeichen (optional)','text','maxlength="150"')+
   input('startedAt','Beginn','datetime-local','required')+input('endedAt','Ende · beim Abschluss erforderlich','datetime-local')+
   input('fine','Geldstrafe','number','required min="0" max="1000000000" step="0.01"')+input('custodyUnits','Hafteinheiten (HE)','number','required min="0" max="1000000000" step="1"')+
   '<label class="field full">Notizen<textarea name="notes" rows="8" maxlength="30000">'+esc(d.notes||'')+'</textarea></label></div><p class="subtitle">Ein Entwurf bleibt bearbeitbar. Mit „Verbindlich abschließen“ wird das Protokoll schreibgeschützt. Begleitpersonen erhalten keinen Zugriff.</p><p class="expedited-error" role="alert"></p><div class="actions expedited-form-actions"><button type="button" data-close>Abbrechen</button><button type="submit" value="draft">Entwurf speichern</button><button class="primary" type="submit" value="finish">Verbindlich abschließen</button></div></form>');
  $('#modal').scrollTop=0;
  const form=$('#expedited-form');form.dataset.module='expedited';form.dataset.recordId=r?.id||'';
  form.onsubmit=async e=>{
   e.preventDefault();const finish=e.submitter?.value==='finish',end=form.elements.endedAt;
   if(finish&&!end.value){end.setCustomValidity('Zum Abschließen bitte die Endzeit angeben.');end.reportValidity();return;}end.setCustomValidity('');
   const input=Object.fromEntries(new FormData(form));for(const k of ['startedAt','endedAt'])input[k]=input[k]?new Date(input[k]).toISOString():'';for(const k of ['fine','custodyUnits'])input[k]=Number(input[k]);input.finish=finish;
   if(r)input.expectedUpdatedAt=r.updatedAt;else input.requestId=requestId;
   const buttons=[...form.querySelectorAll('button[type="submit"]')];buttons.forEach(b=>b.disabled=true);form.querySelector('[role="alert"]').textContent='';
   try{const saved=await api('expedited'+(r?'/'+r.id:''),r?'PUT':'POST',input);$('#modal').close();await refresh();view(saved);toast(finish?'Eilverfahren abgeschlossen.':'Entwurf gespeichert.');}
   catch(err){form.querySelector('[role="alert"]').textContent=err.message;buttons.forEach(b=>b.disabled=false);}
  };
  form.elements.endedAt.oninput=()=>form.elements.endedAt.setCustomValidity('');
 }
 const previousBind=bind;
 bind=function(){previousBind();document.querySelector('[data-expedited-new]')?.addEventListener('click',()=>edit());document.querySelectorAll('[data-expedited-open]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.expeditedOpen)));
  const search=$('#expedited-search');if(search)search.oninput=e=>{const pos=e.target.selectionStart;query=e.target.value;render();$('#expedited-search').focus();$('#expedited-search').setSelectionRange(pos,pos);};const select=$('#expedited-filter');if(select)select.onchange=e=>{filter=e.target.value;render();};
 };
 const previousDetail=detail;detail=function(id){const r=state?.records.find(r=>r.id===id);if(r?.type==='expedited')return view(r);return previousDetail(id);};
})();
