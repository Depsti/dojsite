function formatRequestText(value,start,end,kind){
 if(kind==='paragraph')return {value:value.slice(0,start)+'\n\n'+value.slice(end),start:start+2,end:start+2};
 const from=value.lastIndexOf('\n',Math.max(0,start-1))+1;
 const boundary=value.indexOf('\n',Math.max(start,end-1));
 const to=boundary<0?value.length:boundary;
 let number=0;
 const replacement=value.slice(from,to).split('\n').map(line=>{
  if(!line.trim())return from===to?(kind==='numbered'?'1. ':'• '):line;
  const text=line.replace(/^\s*(?:[•*-]|\d+[.)])\s+/,'');
  return kind==='numbered'?`${++number}. ${text}`:`• ${text}`;
 }).join('\n');
 return {value:value.slice(0,from)+replacement+value.slice(to),start:from,end:from+replacement.length};
}
function addRequestFormatting(form){
 for(const textarea of form.querySelectorAll('textarea')){
  if(textarea.dataset.formatting)continue;textarea.dataset.formatting='true';
  const toolbar=document.createElement('div');toolbar.className='request-formatting';toolbar.setAttribute('role','group');toolbar.setAttribute('aria-label','Text formatieren');
  for(const [kind,label] of [['bullets','• Aufzählung'],['numbered','1. Nummerierung'],['paragraph','Absatz']]){
   const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',label);
   button.onmousedown=e=>e.preventDefault();button.onclick=()=>{const result=formatRequestText(textarea.value,textarea.selectionStart,textarea.selectionEnd,kind);if(result.value.length>textarea.maxLength&&textarea.maxLength>0){toast('Die maximale Textlänge ist erreicht.');return;}textarea.value=result.value;textarea.focus();textarea.setSelectionRange(result.start,result.end);textarea.dispatchEvent(new Event('input',{bubbles:true}));};toolbar.append(button);
  }
  textarea.before(toolbar);
 }
}
function caseRequestForm(parent){
 const people=(parent.participants||[]).map(link=>state.records.find(r=>r.id===link.personId)).filter(Boolean);
 const attachments=state.records.filter(r=>r.caseId===parent.id&&['evidence','documents'].includes(r.type));
 const field=(label,name,value='',required=true)=>`<label class="field"><span class="request-field-heading">${label}</span><textarea name="${name}" rows="3" maxlength="10000" ${required?'required':''}>${esc(value)}</textarea></label>`;
 modal('Antrag aus Fallakte stellen',`<form id="case-request-form"><p><strong>${esc(parent.reference)} · ${esc(parent.title)}</strong></p><label class="field">Antragsart<select name="kind"><option>Haftbefehl</option><option>Durchsuchung</option><option>Sonstiger Antrag</option></select></label><label class="field">Betreff<input name="title" required maxlength="300" value="Antrag auf Erlass eines Haftbefehls"></label><label class="field">Betroffene Person / Stelle<input name="target" required maxlength="1000" value="${esc(people.map(p=>p.title).join(', '))}"></label>${field('I. Beantragte Maßnahme','measure')}${field('II. Sachverhalt / Tatverdacht','facts',parent.description||'')}${field('III. Begründung / Haftgründe','reason')}${field('IV. Verhältnismäßigkeit','proportionality')}${field('V. Durchführung / Zuständigkeit','execution','',false)}<fieldset><legend>Anlagen aus der Fallakte</legend>${attachments.map(r=>`<label class="check"><input type="checkbox" name="attachmentId" value="${r.id}">${esc(r.title)}</label>`).join('')||'<p>Keine Anlagen vorhanden.</p>'}</fieldset><label class="check"><input type="checkbox" name="confidential" ${parent.confidential?'checked':''}>Vertraulich</label><p class="subtitle">Der Antrag wird als Entwurf gespeichert und anschließend zur internen Prüfung vorgelegt.</p><p class="form-error" role="alert"></p><div class="actions"><button type="button" data-close>Abbrechen</button><button class="primary">Antrag erstellen</button></div></form>`);
 const form=$('#case-request-form');addRequestFormatting(form);form.elements.kind.onchange=()=>{form.elements.title.value={Haftbefehl:'Antrag auf Erlass eines Haftbefehls',Durchsuchung:'Antrag auf Erlass eines Durchsuchungsbeschlusses','Sonstiger Antrag':'Sonstiger Antrag'}[form.elements.kind.value];};
 form.onsubmit=async e=>{e.preventDefault();const button=form.querySelector('.primary');button.disabled=true;try{
  const f=form.elements,ids=[...form.querySelectorAll('[name="attachmentId"]:checked')].map(x=>x.value);
  const text=['An das zuständige Gericht – Richterschaft –','Antragsteller: Department of Justice – Staatsanwaltschaft',state.user.name+' · '+state.user.role,'Aktenzeichen: '+parent.reference,'Datum: '+new Date().toLocaleDateString('de-DE'),'Betroffene Person / Stelle: '+f.target.value,'I. ANTRAG\n'+f.measure.value,'II. SACHVERHALT / TATVERDACHT\n'+f.facts.value,'III. BEGRÜNDUNG\n'+f.reason.value,'IV. VERHÄLTNISMÄSSIGKEIT\n'+f.proportionality.value,'V. DURCHFÜHRUNG\n'+(f.execution.value||'Noch festzulegen.'),'VI. ANLAGEN\n'+(ids.map(id=>attachments.find(r=>r.id===id).title).join('\n')||'Keine Anlagen ausgewählt.')].join('\n\n');
  const r=await api('records','POST',{type:'requests',caseId:parent.id,title:f.title.value,description:text,owner:state.user.id,confidential:f.confidential.checked,requestData:{kind:f.kind.value,attachmentIds:ids}});await refresh();detail(r.id);toast('Antrag als Entwurf erstellt.');
 }catch(err){form.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
function courtRequestDialog(record){
 modal('Gerichtliche Entscheidung erfassen',`<form id="court-request-form"><label class="field">Entscheidung<select name="status"><option>Genehmigt</option><option>Teilweise genehmigt</option><option>Abgelehnt</option></select></label><label class="field">Richter/in<input name="judge" required maxlength="200"></label><label class="field">Begründung<textarea name="reason" required maxlength="5000"></textarea></label><label class="field">Auflagen / Einschränkungen<textarea name="conditions" maxlength="5000"></textarea></label><p class="subtitle">Hier wird eine bereits getroffene gerichtliche Entscheidung dokumentiert.</p><p class="form-error"></p><button class="primary">Entscheidung speichern</button></form>`);
 const form=$('#court-request-form');form.onsubmit=async e=>{e.preventDefault();const b=form.querySelector('.primary');b.disabled=true;try{await api('records/'+record.id+'/court','POST',Object.fromEntries(new FormData(form)));await refresh();detail(record.id);}catch(err){form.querySelector('.form-error').textContent=err.message;b.disabled=false;}};
}
const caseRequestsDetail=applyDetailAccess;
applyDetailAccess=function(record){caseRequestsDetail(record);
 if(record.type==='cases'){
  const section=document.createElement('section');section.className='case-person-section';const items=state.records.filter(r=>r.type==='requests'&&r.caseId===record.id);
  section.innerHTML=`<h2>Anträge</h2>${items.map(r=>`<p><button data-case-request="${r.id}">${esc(r.title)}</button> · ${esc(r.courtDecision?.status||reviewState(r))}</p>`).join('')||'<p>Noch keine Anträge gestellt.</p>'}${canModule('requests','create')&&(record.capabilities?.edit||state.user.role==='Student')?'<button id="new-case-request">Antrag stellen</button>':''}`;
  $('#modal .prose').after(section);section.querySelectorAll('[data-case-request]').forEach(b=>b.onclick=()=>detail(b.dataset.caseRequest));if($('#new-case-request'))$('#new-case-request').onclick=()=>caseRequestForm(record);
 }
 if(record.type==='requests'&&record.requestData){
  const prose=$('#modal .prose');if(prose){prose.classList.add('request-document-body');prose.innerHTML=documentSectionHTML(record.description);}
  if(record.reviewStatus==='Abgelehnt')$('#edit-record')?.remove();
  if(record.capabilities?.edit&&state.user.permissions.approve&&record.reviewStatus==='Freigegeben'){const b=document.createElement('button');b.textContent='Gerichtliche Entscheidung erfassen';b.onclick=()=>courtRequestDialog(record);$('#modal .actions').append(b);}
  if(record.courtHistory?.length){const section=document.createElement('section');section.innerHTML='<h3>Gerichtliche Entscheidungen</h3>'+record.courtHistory.map(d=>`<p><strong>${esc(d.status)}</strong> · Richter/in: ${esc(d.judge)}</p><p>${esc(d.reason)}</p><p>Auflagen: ${esc(d.conditions||'Keine')}</p><small>Erfasst von ${esc(d.recordedBy)} · ${esc(new Date(d.at).toLocaleString('de-DE'))}</small>`).join('');$('#modal .prose').after(section);}
 }
};
const requestFormattedEditor=editor;
editor=function(type,existing){requestFormattedEditor(type,existing);if(type==='requests'&&$('#record-form'))addRequestFormatting($('#record-form'));};