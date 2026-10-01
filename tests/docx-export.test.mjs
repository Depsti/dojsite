import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {exportDocx} from '../lib/docx-export.mjs';
test('DOCX enthält Signatur, Seitennummern und nur zugängliche Fallinhalte',async()=>{
 const user={id:'u',name:'Alex & Miller',role:'Staatsanwalt',active:true};
 const record={id:'c',type:'cases',title:'Staat gegen Beispiel',reference:'DOJ-42',status:'In Bearbeitung',description:'Sachverhalt mit <Text>',createdBy:'other',participants:[{personId:'p',role:'Zeuge',note:'Aussage aufgenommen'}]};
 const db={users:[user],settings:{serverName:'San Andreas'},records:[record,{id:'p',type:'people',title:'Taylor Brooks'},{id:'e',type:'evidence',caseId:'c',title:'Sichtbarer Beleg',description:'Belegbeschreibung'},{id:'secret',type:'documents',caseId:'c',title:'VERBORGENE_INFORMATION',confidential:true,createdBy:'other'}]};
 const buffer=await exportDocx(record,user,db);
 assert.equal(buffer.subarray(0,2).toString(),'PK');
 const zip=await JSZip.loadAsync(buffer);
 const xml=await zip.file('word/document.xml').async('string');
 assert.match(xml,/Alex &amp; Miller/);assert.match(xml,/Segoe Script/);assert.match(xml,/DOJ-Stempel/);assert.ok(Object.keys(zip.files).some(path=>path.startsWith('word/media/')&&path.endsWith('.png')));assert.match(xml,/Taylor Brooks/);assert.match(xml,/Sichtbarer Beleg/);assert.match(xml,/Sachverhalt mit &lt;Text&gt;/);assert.doesNotMatch(xml,/VERBORGENE_INFORMATION/);
 const footer=await zip.file('word/footer1.xml').async('string');assert.doesNotMatch(xml+footer,/Rollenspiel|RP-Dokument|State RP|Fiktion/i);assert.match(footer,/NUMPAGES/);assert.match(footer,/PAGE/);
 await assert.rejects(exportDocx({...record,confidential:true},user,db),e=>e.status===404);
});
test('DOCX kennzeichnet vorgelegte Studentendokumente ohne Freigabe',async()=>{
 const user={id:'s',name:'Student Beispiel',role:'Student'};
 const record={id:'d',type:'documents',title:'Entwurf',createdBy:'s',submission:{status:'Vorgelegt'}};
 const zip=await JSZip.loadAsync(await exportDocx(record,user,{users:[user],records:[record],settings:{serverName:'RP'}}));
 assert.match(await zip.file('word/document.xml').async('string'),/keine Freigabe durch diesen Export/);
});