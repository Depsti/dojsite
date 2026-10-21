import test from 'node:test';
import assert from 'node:assert/strict';
import {addMissingRetroLaws,retroLawCount} from '../lib/law-catalog.mjs';
test('Gesetzkatalog ist vollständig, wiederholbar und überschreibt keine Bearbeitungen',()=>{
 const db={records:[]};assert.equal(addMissingRetroLaws(db),284);assert.equal(retroLawCount,284);assert.equal(new Set(db.records.map(r=>r.id)).size,284);
 const changed=db.records[0];changed.description='Manuelle Ergänzung';assert.equal(addMissingRetroLaws(db),0);assert.equal(db.records[0].description,'Manuelle Ergänzung');
 assert.equal(new Set(db.records.map(r=>r.group)).size,16);
 const fishing=db.records.find(r=>r.title.includes('§82'));assert.match(fishing.description,/Anlage 1/);assert.match(fishing.description,/§ 6/);
 assert.ok(db.records.some(r=>r.group==='Schlussbestimmungen'&&r.title.includes('§3')));
 assert.ok(db.records.every(r=>r.penaltyUnspecified&&r.url.startsWith('https://sites.google.com/')));
});