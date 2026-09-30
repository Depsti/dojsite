import test from 'node:test';
import assert from 'node:assert/strict';
import {assignRecord,claimRecord,assignmentOffers,syncPlannedHearing,reviewRecord} from '../lib/organization.mjs';
import {visible,canEdit,permissions} from '../lib/access.mjs';
const lead={id:'lead',name:'Leitung',role:'Leitung',active:true};
const lawyer={id:'lawyer',name:'Staatsanwalt',role:'Staatsanwalt',active:true};
const setup=()=>({users:[lead,lawyer],records:[{id:'case',type:'cases',title:'Verfahren',createdBy:lead.id,owner:lead.id,confidential:true,status:'Offen',comments:[]}]});

test('Verhandlungsplanung: optionaler Termin, keine Duplikate, bestehende Verhandlungen bleiben',()=>{
 const db=setup(),r=db.records[0];r.hearingExpected=true;syncPlannedHearing(r,db);assert.equal(db.records.length,2);assert.equal(db.records[1].date,'');syncPlannedHearing(r,db);assert.equal(db.records.length,2);
 r.hearingExpected=false;syncPlannedHearing(r,db);assert.equal(db.records.length,1);
 r.hearingExpected=true;syncPlannedHearing(r,db);db.records[1].date='2026-10-01T12:00';r.hearingExpected=false;syncPlannedHearing(r,db);assert.equal(db.records.length,2);
});

test('Selbstübernahme gewährt Fallzugriff, schließt Angebot und respektiert Rechte',()=>{
 const db=setup(),r=db.records[0];assert.equal(visible(r,lawyer,db),false);
 assignRecord(r,{assignedProsecutors:[],openForClaim:true},lead,db);
 const offers=assignmentOffers(lawyer,db);assert.equal(offers.length,1);assert.equal(offers[0].description,undefined);assert.equal(visible(r,lawyer,db),false);
 claimRecord(r,lawyer,db);assert.equal(visible(r,lawyer,db),true);assert.equal(canEdit(r,lawyer,db),true);assert.equal(r.openForClaim,false);assert.throws(()=>claimRecord(r,lawyer,db),/nicht mehr/);
 assignRecord(r,{assignedProsecutors:[],openForClaim:true},lead,db);assert.equal(visible(r,lawyer,db),false);
 const blocked={...lawyer,permissions:{selfAssign:false}};assert.equal(assignmentOffers(blocked,db).length,0);assert.throws(()=>claimRecord(r,blocked,db),/nicht übernehmen/);
 assert.throws(()=>assignRecord(r,{assignedProsecutors:[lawyer.id],openForClaim:false},lawyer,db),/Berechtigung/);
});

test('Verhandlungszuteilung gewährt zugehörigen Fallzugriff und bleibt bei Planänderung erhalten',()=>{
 const db=setup(),r=db.records[0];r.hearingExpected=true;syncPlannedHearing(r,db);const hearing=db.records[1];
 assignRecord(hearing,{assignedProsecutors:[lawyer.id],openForClaim:false},lead,db);assert.equal(canEdit(r,lawyer,db),true);assert.equal(canEdit(hearing,lawyer,db),true);
 r.hearingExpected=false;syncPlannedHearing(r,db);assert.equal(db.records.length,2);
 const blocked={...lawyer,id:'blocked',permissions:{modules:{hearings:{edit:false}}}};db.users.push(blocked);
 assert.throws(()=>assignRecord(hearing,{assignedProsecutors:[blocked.id],openForClaim:false},lead,db),/Bereichsrechte/);
});

test('Freigabeverfahren erzwingt Übergänge, Entscheidungsrecht und Begründung',()=>{
 const db=setup();const r={id:'doc',type:'documents',title:'Entwurf',createdBy:lead.id,status:'Offen',reviewStatus:'Entwurf'};db.records.push(r);
 reviewRecord(r,{status:'In Prüfung'},lawyer,db);assert.equal(r.reviewStatus,'In Prüfung');
 assert.throws(()=>reviewRecord(r,{status:'Freigegeben',reason:'Geprüft'},lawyer,db),/Entscheidungsrecht/);
 assert.throws(()=>reviewRecord(r,{status:'Zurückgegeben'},lead,db),/Begründung/);
 reviewRecord(r,{status:'Zurückgegeben',reason:'Nachweise ergänzen'},lead,db);assert.equal(r.reviewHistory.length,2);
 reviewRecord(r,{status:'In Prüfung'},lawyer,db);reviewRecord(r,{status:'Freigegeben',reason:'Vollständig geprüft'},lead,db);assert.equal(r.reviewStatus,'Freigegeben');assert.equal(r.reviewHistory.length,4);
 assert.throws(()=>reviewRecord(r,{status:'In Prüfung'},lead,db),/Ungültiger/);
 assert.equal(permissions(lawyer).assignments,false);assert.equal(permissions(lawyer).selfAssign,true);
});
