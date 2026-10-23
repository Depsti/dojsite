import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceFormat as format,issueReference,nextReferenceNumber} from '../lib/references.mjs';
const user={id:'master',name:'Dr. jur. George Laforge',role:'Master'},input={court:'StA',procedure:'Ds',date:'2310',year:'26',initials:'GL',requestId:'reference-test-0001'};
test('Aktenzeichen enthält alle vorgegebenen Gerichtszeichen und das gewünschte Format',()=>{
 assert.deepEqual(format.courts.map(c=>c.code),['AG','LG','OLG','BGH','FamG','ArbG','LAG','SG','FG','GewG','VG','DG','PK','StA']);
 assert.equal(format.format(2,input,true),'Az. 02 StA-Ds 2310/26-GL');assert.equal(format.format(100,{...input,procedure:''}),'100 StA 2310/26-GL');assert.equal(format.initials(user.name),'GL');assert.equal(format.initials('Jörg Müller'),'JM');
});
test('Aktenzeichen prüft Kalenderdatum, Jahr, Kürzel und Verfahren',()=>{
 assert.throws(()=>format.normalize({...input,date:'3102'}),/Datum/);assert.throws(()=>format.normalize({...input,date:'2902'}),/Datum/);assert.equal(format.normalize({...input,date:'2902',year:'24'}).year,2024);
 for(const value of [{court:'XYZ'},{year:'126'},{initials:'<b>'},{procedure:'Ds--Fake'}])assert.throws(()=>format.normalize({...input,...value}));
});
test('Nummernkreis gilt pro Jahr gemeinsam für alle Behörden und wird nicht wiederverwendet',()=>{
 const db={records:[]};const a=issueReference(db,input,user);assert.equal(a.entry.number,1);
 assert.equal(issueReference(db,{...input,court:'AG',requestId:'reference-test-0002'},user).entry.number,2);
 assert.equal(issueReference(db,{...input,year:'27',requestId:'reference-test-0003'},user).entry.number,1);
 db.referenceIssues=[];assert.equal(nextReferenceNumber(db,2026),3);
 const imported={records:[{reference:'Az. 11 StA-Ds 2310/26-GL'}]};assert.equal(nextReferenceNumber(imported,2026),12);
});
test('Wiederholung derselben Vergabe liefert dasselbe Zeichen; geänderte Angaben sind ein Konflikt',()=>{
 const db={records:[]};const a=issueReference(db,input,user,{caseId:'c1'});const b=issueReference(db,input,user,{caseId:'c1'});assert.equal(b.created,false);assert.equal(a.entry.reference,b.entry.reference);assert.equal(db.referenceIssues.length,1);
 assert.throws(()=>issueReference(db,{...input,court:'AG'},user,{caseId:'c1'}),e=>e.status===409);assert.throws(()=>issueReference(db,input,user,{caseId:'c2'}),e=>e.status===409);
 assert.throws(()=>issueReference(db,input,{...user,role:'Referendar',permissions:{modules:{cases:{create:false}}}}),e=>e.status===403);
});
