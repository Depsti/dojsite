import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCaseRequest,decideCourtRequest} from '../lib/case-requests.mjs';
import {reviewRecord} from '../lib/organization.mjs';
const lead={id:'l',name:'Leitung',role:'Leitung'},lawyer={id:'s',name:'Staatsanwalt',role:'Staatsanwalt'};
const setup=()=>({users:[lead,lawyer],records:[{id:'c',type:'cases',title:'Fall',createdBy:'l',owner:'s'},{id:'e',type:'evidence',caseId:'c',title:'Beweis'},{id:'hidden',type:'documents',caseId:'c',confidential:true,createdBy:'l'}]});
test('Fallanträge validieren Anlagen, Sichtbarkeit und Antragsart',()=>{
 const db=setup();assert.deepEqual(validateCaseRequest({kind:'Durchsuchung',caseId:'c',attachmentIds:['e','e']},lawyer,db),{kind:'Durchsuchung',attachmentIds:['e']});
 assert.throws(()=>validateCaseRequest({kind:'Durchsuchung',caseId:'c',attachmentIds:['hidden']},lawyer,db),/nicht zugänglich/);
 assert.throws(()=>validateCaseRequest({kind:'Unbekannt',caseId:'c',attachmentIds:[]},lead,db),/Antragsart/);
});
test('Interne Freigabe und gerichtliche Entscheidung sind getrennt und erfordern Rechte',()=>{
 const db=setup(),r={id:'r',type:'requests',caseId:'c',createdBy:'s',requestData:{kind:'Haftbefehl'},reviewStatus:'Entwurf'};db.records.push(r);
 const decision={status:'Teilweise genehmigt',judge:'Richter Beispiel',reason:'Begründet',conditions:'Nur Objekt A'};
 assert.throws(()=>decideCourtRequest(r,decision,lead,db),/interne Prüfung/);
 reviewRecord(r,{status:'In Prüfung'},lawyer,db);reviewRecord(r,{status:'Freigegeben',reason:'Geprüft'},lead,db);
 assert.throws(()=>decideCourtRequest(r,decision,lawyer,db),/Entscheidungsrecht/);
 decideCourtRequest(r,decision,lead,db);assert.equal(r.reviewStatus,'Freigegeben');assert.equal(r.courtDecision.status,'Teilweise genehmigt');assert.equal(r.courtHistory.length,1);
});
test('Anträge können intern mit Begründung abgelehnt werden',()=>{
 const db=setup(),r={type:'requests',createdBy:'l',reviewStatus:'In Prüfung'};db.records.push(r);
 assert.throws(()=>reviewRecord(r,{status:'Abgelehnt'},lead,db),/Begründung/);
 reviewRecord(r,{status:'Abgelehnt',reason:'Nicht ausreichend'},lead,db);assert.equal(r.status,'Abgelehnt');
});