function casePrintHTML(record){
 const text=v=>esc(v||'—');
 const stamp=v=>v?new Date(v).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'}):'—';
 const parent=record.caseId&&state.records.find(r=>r.type==='cases'&&r.id===record.caseId);
 const children=state.records.filter(r=>r.caseId===record.id&&r.type!=='people');
 let section=0;
 const block=(title,body)=>`<section class="report-section"><h2><span>${String(++section).padStart(2,'0')}</span> ${esc(title)}</h2>${body}</section>`;
 const prose=v=>`<div class="report-text">${text(v)}</div>`;
 const meta=(label,value)=>`<div><dt>${esc(label)}</dt><dd>${text(value)}</dd></div>`;
 let content=block(['documents','requests','knowledge'].includes(record.type)?'Dokumentinhalt':'Sachverhalt / Beschreibung',prose(record.description));
 if(record.type==='cases'){
  const people=(record.participants||[]).flatMap(p=>{const person=state.records.find(r=>r.type==='people'&&r.id===p.personId);return person?[{...p,person}]:[];});
  content+=block('Beteiligte Personen',people.length?`<table><thead><tr><th>Person</th><th>Rolle im Verfahren</th><th>Fallbezogener Vermerk</th></tr></thead><tbody>${people.map(p=>`<tr><td>${text(p.person.title)}</td><td>${text(p.role)}</td><td class="multiline">${text(p.note)}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">Keine sichtbaren Personen zugeordnet.</p>');
  for(const type of ['evidence','documents','requests']){
   const entries=children.filter(r=>r.type===type);
   content+=block(modules[type][0],entries.length?entries.map((r,i)=>`<article class="report-entry"><h3>${i+1}. ${text(r.title)}</h3><p class="entry-meta">${text(r.status)} · Zuständig: ${text(userName(r.owner))}${r.confidential?' · Vertraulich':''}</p>${prose(r.description)}${r.url&&/^https?:\/\//i.test(r.url)?`<p class="source">Quelle: ${text(r.url)}</p>`:''}${r.attachmentName?`<p class="source">Anhang: ${text(r.attachmentName)} (separate Datei)</p>`:''}</article>`).join(''):'<p class="muted">Keine sichtbaren Einträge zugeordnet.</p>');
  }
  const other=children.filter(r=>!['evidence','documents','requests'].includes(r.type));
  if(other.length)content+=block('Weitere zugeordnete Einträge',other.map(r=>`<article class="report-entry"><h3>${text(modules[r.type]?.[0])} · ${text(r.title)}</h3>${prose(r.description)}</article>`).join(''));
 }else{
  if(record.personRole)content+=block('Beteiligung',prose(record.personRole));
  if(record.type==='laws')content+=block('Strafrahmen',`<p>Geldstrafe: ${text(money(record.fine))} · Haft: ${Number(record.months||0)} HE</p>`);
  if(record.url&&/^https?:\/\//i.test(record.url))content+=block('Quelle',prose(record.url));
  if(record.attachmentName)content+=block('Anlage',`<p>${text(record.attachmentName)} (separate Datei; nicht in diesem PDF enthalten)</p>`);
 }
 if(record.comments?.length)content+=block('Aktenvermerke / interne Kommentare',record.comments.map(c=>`<article class="report-entry"><h3>${text(c.user)} <span class="comment-date">${esc(stamp(c.at))}</span></h3>${prose(c.text)}</article>`).join(''));
 const reference=record.reference||parent?.reference||modules[record.type]?.[0]||'Akte';
 return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${esc(reference)} – ${esc(record.title)}</title><link rel="stylesheet" href="${esc(new URL('/case-print.css',location.href).href)}"></head><body><main class="report"><header class="report-header"><div class="authority"><img src="${esc(new URL('/favicon.svg',location.href).href)}" alt=""><div><strong>DEPARTMENT OF JUSTICE</strong><span>Office of the District Attorney</span><small>${text(state.settings.serverName)} · Internes RP-Justizportal</small></div></div><div class="classification">${record.confidential?'VERTRAULICH':'INTERN'}</div></header><div class="report-cover"><p class="document-type">${text(modules[record.type]?.[0])} · ${text(reference)}</p><h1>${text(record.title)}</h1><dl class="report-meta">${meta('Aktenzeichen',reference)}${meta('Status',record.status)}${meta('Federführung',userName(record.owner))}${meta('Aktenführung',userName(record.createdBy))}${meta('Priorität',record.priority||'Normal')}${meta('Termin / Frist',record.date?stamp(record.date):'Kein Termin')}${meta('Erstellt',stamp(record.createdAt))}${meta('Letzte Änderung',stamp(record.updatedAt))}${parent?meta('Zugehörige Fallakte',parent.title):''}</dl></div>${content}<footer class="report-end">Auszug erstellt am ${esc(stamp(new Date().toISOString()))} durch ${text(state.user.name)}.<br>Der Auszug enthält ausschließlich für die exportierende Person sichtbare Einträge. Anhänge werden separat bereitgestellt.<br>Rollenspiel-Dokument · Keine amtliche Urkunde.</footer></main></body></html>`;
}
function printCaseRecord(record){
 document.getElementById('case-print-frame')?.remove();
 const frame=document.createElement('iframe');frame.id='case-print-frame';frame.title='Druckansicht der Akte';frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;left:-10000px;top:0;width:210mm;height:297mm;border:0;';
 frame.onload=async()=>{try{await frame.contentDocument.fonts.ready;frame.contentWindow.onafterprint=()=>frame.remove();frame.contentWindow.focus();frame.contentWindow.print();}catch{frame.remove();toast('Druckansicht konnte nicht geöffnet werden. Bitte erneut versuchen.');}};
 frame.srcdoc=casePrintHTML(record);document.body.append(frame);
}
const originalPrintDetail=applyDetailAccess;
applyDetailAccess=function(record){originalPrintDetail(record);const button=$('#print-record');if(button)button.onclick=()=>printCaseRecord(record);};
