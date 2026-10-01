import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({});
vm.runInContext(readFileSync(new URL('../public/docx-import.js',import.meta.url),'utf8'),context);
test('DOCX-Import erkennt Titel und Vertraulichkeit und behält den kompletten Text',()=>{
 const result=context.caseImportFromParagraphs([{text:'DEPARTMENT OF JUSTICE'},{text:'Staat gegen Test',centered:true},{text:'Vertrauliches Schriftstück'},{text:'Sachverhalt'},{text:'Beschreibung des Falls'}],'Fall.docx');
 assert.equal(result.title,'Staat gegen Test');assert.equal(result.confidential,true);assert.match(result.description,/Beschreibung des Falls/);
 assert.equal(context.caseImportFromParagraphs([{text:'Beliebiger Text'}],'Meine_Akte.docx').title,'Meine Akte');
 assert.throws(()=>context.caseImportFromParagraphs([],'leer.docx'),/keinen lesbaren Text/);
});
test('DOCX-Import lehnt falsche Dateitypen und übergroße Dateien ab',async()=>{
 await assert.rejects(context.readCaseDocx({name:'x.doc',size:10}),/DOCX-Datei auswählen/);
 await assert.rejects(context.readCaseDocx({name:'x.docx',size:6*1024*1024}),/maximal 5 MB/);
});