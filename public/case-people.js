const casePersonRoles=['Beschuldigter','Zeuge','Geschädigter','Verteidiger','Sonstige'];
const roleOptions=value=>casePersonRoles.map(role=>`<option ${role===value?'selected':''}>${role}</option>`).join('');
const originalDetailAccess=applyDetailAccess;
applyDetailAccess=function(r){
 originalDetailAccess(r);
 if(r.type==='cases'){
   const section=document.createElement('section');section.className='case-person-section';
   section.innerHTML=`<div class="panel-head"><h2>Beteiligte Personen</h2>${r.capabilities.edit&&canModule('people')?'<button id="link-case-people">Personen verknüpfen</button>':''}</div><div class="panel-body">${r.participants?.length?r.participants.map(link=>{const person=state.records.find(p=>p.id===link.personId);return `<div class="case-person-entry"><div><strong>${esc(person?.title||'Person')}</strong>${badge(link.role)}${link.note?`<p>${esc(link.note)}</p>`:''}</div><button data-show-person="${link.personId}">Personenakte</button></div>`;}).join(''):'<p class="subtitle">Keine für dich sichtbaren Personen zugeordnet.</p>'}</div>`;
   $('#modal .prose').after(section);
   section.querySelectorAll('[data-show-person]').forEach(b=>b.onclick=()=>detail(b.dataset.showPerson));
   if($('#link-case-people'))$('#link-case-people').onclick=()=>editParticipants(r);
   const actions=$('#modal .actions');
   if(r.capabilities.sendDiscord){const button=document.createElement('button');button.textContent='Nach Discord senden';button.onclick=()=>confirmDiscord(r);actions.prepend(button);}
   if(r.discord?.sentAt){const note=document.createElement('p');note.className='subtitle';note.textContent='Zuletzt nach Discord gesendet: '+new Date(r.discord.sentAt).toLocaleString('de-DE');actions.after(note);}
 }
 if(r.type==='people'){
   const section=document.createElement('section');section.className='case-person-section';
   section.innerHTML=`<div class="panel-head"><h2>Zugehörige Verfahren</h2>${canModule('cases','edit')&&state.records.some(c=>c.type==='cases'&&c.capabilities.edit)?'<button id="link-person-case">Fall zuordnen</button>':''}</div><div class="panel-body">${r.relatedCases?.length?r.relatedCases.map(link=>`<div class="case-person-entry"><div><strong>${esc(link.reference)} · ${esc(link.title)}</strong>${badge(link.role)}${link.note?`<p>${esc(link.note)}</p>`:''}</div><button data-show-case="${link.caseId}">Fallakte</button></div>`).join(''):'<p class="subtitle">Keine für dich sichtbaren Verfahren zugeordnet.</p>'}</div>`;
   $('#modal .prose').after(section);
   section.querySelectorAll('[data-show-case]').forEach(b=>b.onclick=()=>detail(b.dataset.showCase));
   if($('#link-person-case'))$('#link-person-case').onclick=()=>linkPersonToCase(r);
 }
};
function editParticipants(record,initial=record.participants||[]){
 let selected=initial.map(x=>({...x}));
 modal('Personen im Verfahren',`<div class="dossier-title"><span class="eyebrow">${esc(record.reference)}</span><h1>${esc(record.title)}</h1></div><p class="subtitle">Eine Person kann in mehreren Fällen mit unterschiedlichen Rollen geführt werden.</p><div class="toolbar person-picker"><input type="search" id="person-search" placeholder="Personen nach Namen suchen …" aria-label="Personen suchen"><select id="person-picker" aria-label="Vorhandene Person auswählen"></select><button id="add-person-link">Hinzufügen</button>${canModule('people','create')?'<button id="create-case-person">Neue Person erfassen</button>':''}</div><form id="participants-form"><div id="participant-rows"></div><p class="form-error" role="alert"></p><div class="actions"><button type="button" id="cancel-participants">Abbrechen</button><button class="primary">Zuordnungen speichern</button></div></form>`);
 function picker(){const query=$('#person-search').value.toLowerCase(),items=state.records.filter(p=>p.type==='people'&&p.status!=='Archiviert'&&!selected.some(x=>x.personId===p.id)&&p.title.toLowerCase().includes(query));$('#person-picker').innerHTML='<option value="">Person auswählen</option>'+items.map(p=>`<option value="${p.id}">${esc(p.title)}</option>`).join('');}
 function draw(){
   $('#participant-rows').innerHTML=selected.map((link,i)=>{const p=state.records.find(x=>x.id===link.personId);return `<div class="participant-edit-row"><div class="participant-row-head"><strong>${esc(p?.title||'Person')}</strong><button type="button" data-remove-link="${i}">Zuordnung entfernen</button></div><div class="form-grid"><label class="field">Rolle im Verfahren<select data-link-role="${i}">${roleOptions(link.role)}</select></label><label class="field">Fallbezogener Vermerk<input data-link-note="${i}" maxlength="2000" value="${esc(link.note)}" placeholder="z. B. Zeuge am Tatort"></label></div></div>`;}).join('')||'<div class="empty">Noch keine Personen ausgewählt.</div>';
   document.querySelectorAll('[data-remove-link]').forEach(b=>b.onclick=()=>{selected.splice(Number(b.dataset.removeLink),1);draw();picker();});
   document.querySelectorAll('[data-link-role]').forEach(el=>el.onchange=()=>selected[Number(el.dataset.linkRole)].role=el.value);
   document.querySelectorAll('[data-link-note]').forEach(el=>el.oninput=()=>selected[Number(el.dataset.linkNote)].note=el.value);
 }
 picker();draw();$('#person-search').oninput=picker;
 $('#add-person-link').onclick=()=>{const personId=$('#person-picker').value;if(!personId)return;selected.push({personId,role:'Sonstige',note:''});draw();picker();};
 if($('#create-case-person'))$('#create-case-person').onclick=()=>createCasePerson(record,selected);
 $('#cancel-participants').onclick=()=>detail(record.id);
 $('#participants-form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('.primary');button.disabled=true;try{await api('records/'+record.id+'/participants','PUT',{participants:selected});await refresh();detail(record.id);toast('Personen mit dem Fall verknüpft.');}catch(err){e.target.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
function createCasePerson(record,selected){
 modal('Person erfassen',`<form id="new-case-person"><label class="field">Name<input name="title" required maxlength="300"></label><label class="field">Personenbeschreibung<textarea name="description" rows="3" maxlength="5000"></textarea></label><label class="field">Rolle in diesem Fall<select name="role">${roleOptions('Sonstige')}</select></label><label class="check"><input type="checkbox" name="confidential">Personenakte zusätzlich vertraulich führen</label><p class="subtitle">Die Person wird gespeichert. Die Fallzuordnung wird erst beim Speichern der Zuordnungen übernommen.</p><p class="form-error" role="alert"></p><div class="actions"><button type="button" id="cancel-new-person">Zurück</button><button class="primary">Person erfassen</button></div></form>`);
 $('#cancel-new-person').onclick=()=>editParticipants(record,selected);
 $('#new-case-person').onsubmit=async e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(e.target)),button=e.target.querySelector('.primary');button.disabled=true;try{const p=await api('records','POST',{type:'people',title:fields.title,description:fields.description,confidential:e.target.elements.confidential.checked,owner:state.user.id});await refresh();editParticipants(state.records.find(r=>r.id===record.id),[...selected,{personId:p.id,role:fields.role,note:''}]);}catch(err){e.target.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
function linkPersonToCase(person){
 const cases=state.records.filter(r=>r.type==='cases'&&r.capabilities.edit);
 modal('Person einem Fall zuordnen',`<form id="person-case-form"><h2>${esc(person.title)}</h2><label class="field">Fallakte<select name="caseId" required>${cases.map(c=>`<option value="${c.id}">${esc(c.reference+' · '+c.title)}</option>`).join('')}</select></label><label class="field">Rolle in diesem Verfahren<select name="role">${roleOptions('Sonstige')}</select></label><label class="field">Fallbezogener Vermerk<input name="note" maxlength="2000"></label><p class="form-error" role="alert"></p><div class="actions"><button type="button" id="cancel-person-case">Abbrechen</button><button class="primary">Verknüpfen</button></div></form>`);
 $('#cancel-person-case').onclick=()=>detail(person.id);
 $('#person-case-form').onsubmit=async e=>{e.preventDefault();const b=Object.fromEntries(new FormData(e.target)),c=cases.find(x=>x.id===b.caseId),button=e.target.querySelector('.primary');button.disabled=true;try{await api('records/'+c.id+'/participants','PUT',{participants:[...(c.participants||[]).filter(x=>x.personId!==person.id),{personId:person.id,role:b.role,note:b.note}]});await refresh();detail(person.id);toast('Fallzuordnung gespeichert.');}catch(err){e.target.querySelector('.form-error').textContent=err.message;button.disabled=false;}};
}
function confirmDiscord(record){
 modal('Fall nach Discord senden',`<h2>${esc(record.reference)} · ${esc(record.title)}</h2><p>Aktenzeichen, Titel, Sachverhalt, Status, Priorität, Federführung und die für dich sichtbaren beteiligten Personen werden in den konfigurierten Discord-Kanal gesendet.</p>${record.confidential?'<div class="notice">Diese Fallakte ist vertraulich. Stelle sicher, dass der Discord-Kanal nur für das vorgesehene Fallteam zugänglich ist.</div>':''}<p class="form-error" role="alert"></p><div class="actions"><button id="cancel-discord">Abbrechen</button><button class="primary" id="send-discord">Nach Discord senden</button></div>`);
 $('#cancel-discord').onclick=()=>detail(record.id);
 $('#send-discord').onclick=async()=>{const b=$('#send-discord');b.disabled=true;try{await api('records/'+record.id+'/discord','POST',{});await refresh();detail(record.id);toast('Fall in Discord veröffentlicht.');}catch(err){$('#modal .form-error').textContent=err.message;b.disabled=false;}};
}
const originalAccessUI=applyAccessUI;
applyAccessUI=function(){originalAccessUI();if(route==='settings'){
 const info=state.integrations?.discord||{},panel=document.createElement('section');panel.className='panel';
 panel.innerHTML=`<div class="panel-head"><h2>Discord-Fallübertragung</h2></div><div class="panel-body"><p>Versand in einen Kanal: ${badge(info.outboundConfigured?'Eingerichtet':'Nicht konfiguriert')}</p><p>Import vom Bot: ${badge(info.inboundConfigured?'Eingerichtet':'Nicht konfiguriert')}</p><p class="subtitle">Die Webhook-URL und der Import-Schlüssel werden ausschließlich in der Serverkonfiguration hinterlegt. Fälle werden über die Aktion in der Fallakte gesendet.</p>${state.user.role==='Leitung'?`<p class="subtitle">Deine Mitarbeiter-ID für den Importverantwortlichen: <code>${esc(state.user.id)}</code></p>`:''}</div>`;
 $('.content').append(panel);
}};
