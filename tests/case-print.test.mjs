import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('PDF-Aktenlayout enthält sichtbare Falldaten ohne Bedienoberfläche oder Anhänge',()=>{
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const record={id:'case',type:'cases',reference:'DOJ-2026-0001',title:'Staat gegen <Test>',description:'Sachverhalt\nZweite Zeile\n\nII. SACHVERHALT\nText zum Abschnitt',status:'Offen',participants:[{personId:'visible',role:'Zeuge',note:'Vermerk'},{personId:'hidden',role:'Zeuge'}],comments:[{user:'Leitung',at:'2026-09-30',text:'Aktenvermerk'}]};
 const context=vm.createContext({esc,URL,location:{href:'http://localhost:3000/'},modules:{cases:['Fallakten'],people:['Personen'],evidence:['Beweismittel'],documents:['Dokumente'],requests:['Anträge & Freigaben']},userName:()=> 'Leitung',applyDetailAccess(){},state:{settings:{serverName:'Test DOJ'},user:{name:'Exporteur'},records:[record,{id:'visible',type:'people',title:'Sichtbare Person'},{id:'other',type:'cases',title:'Fremde Akte'},{id:'proof',type:'evidence',caseId:'case',title:'Kameraaufnahme',description:'Beweistext',attachmentName:'Beweis.png',attachment:'data:image/png;base64,PRIVATE'},{id:'doc',type:'documents',caseId:'case',title:'Anklageschrift',description:'Dokumenttext'},{id:'secret',type:'documents',caseId:'other',title:'Nicht exportieren'}]}});
 vm.runInContext(readFileSync(new URL('../public/case-print.js',import.meta.url),'utf8'),context);context.record=record;
 const html=vm.runInContext('casePrintHTML(record)',context);
 for(const text of ['DEPARTMENT OF JUSTICE','DOJ-2026-0001','Staat gegen &lt;Test&gt;','Sichtbare Person','Beweistext','Dokumenttext','Aktenvermerk','Beweis.png','signature-name','document-section-heading','II. SACHVERHALT','Exporteur','Automatisch aus dem Namen erzeugte Unterschrift'])assert.ok(html.includes(text),text);
 for(const text of ['Nicht exportieren','PRIVATE','data:image','<button','<form','Zugehörige Fallakte'])assert.ok(!html.includes(text),text);
 assert.doesNotMatch(html,/Rollenspiel|RP-Dokument|RP-Justizportal|Fiktion|Keine amtliche Urkunde/i);
 assert.match(html,/case-print\.css/);
 const css=readFileSync(new URL('../public/case-print.css',import.meta.url),'utf8');assert.match(css,/size:A4/);assert.match(css,/counter\(page\)/);assert.match(css,/table-header-group/);
});
