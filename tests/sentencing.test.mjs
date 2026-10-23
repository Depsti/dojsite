import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url),catalog=require('../public/penalty-catalog.js'),{compute}=require('../public/sentencing.js');
const entries=catalog.entries;
const find=(book,name)=>entries.find(e=>e.book===book&&e.name===name);
const pick=(book,name,extra={})=>({id:find(book,name).id,...extra});
test('Strafmaßkatalog übernimmt jede Tabellenzeile mit Quelle und unveränderten Rohwerten',()=>{
 const source=JSON.parse(readFileSync(new URL('../lib/penalty-source-20261023.json',import.meta.url),'utf8'));
 assert.equal(entries.length,166);assert.equal(new Set(entries.map(e=>e.id)).size,166);assert.equal(entries.filter(e=>e.kind==='offense').length,155);assert.equal(entries.filter(e=>e.kind==='rule').length,7);
 for(const sheet of source.sheets)for(const [index,row] of sheet.values.slice(1).entries()){
  const entry=entries.find(e=>e.sheet===sheet.sheet&&e.sourceRow===index+2);assert.ok(entry);assert.equal(entry.name,row[2].trim());assert.equal(entry.fine.raw,String(row[4]).trim());assert.equal(entry.months.raw,String(row[5]).trim());assert.ok(entry.url.includes('range=A'+(index+2)+':G'+(index+2)));
 }
 assert.deepEqual(entries.filter(e=>e.kind==='cap').map(e=>e.months.value),[40,50,60,80]);
});
test('Summen und Haftgrenzen: Geld bleibt ungekürzt, Berechnung wird vor Begrenzung dokumentiert',()=>{
 const selection=[pick('StGB','Raub'),pick('StGB','Mord')];const capped=compute(entries,selection,{cap:40});assert.equal(capped.fine,75000);assert.equal(capped.rawMonths,45);assert.equal(capped.months,40);assert.equal(capped.capApplied,true);assert.equal(compute(entries,selection,{cap:50}).months,45);assert.ok(capped.notes.some(n=>n.includes('Lebenslange Haft')));
});
test('Beihilfe wirkt nur auf die gewählte Position, weitere Milderung wirkt danach',()=>{
 const result=compute(entries,[pick('StGB','Raub',{role:'accessory'})],{reduction:25,cap:40});assert.equal(result.fine,15000);assert.equal(result.months,9);assert.equal(result.complete,true);
 const attempted=compute(entries,[pick('StGB','Raub',{role:'instigator',attempt:true})]);assert.equal(attempted.months,15);assert.ok(attempted.notes.some(n=>n.includes('Versuch')));
});
test('Variable und außergewöhnliche Strafen bleiben offen statt als Nullstrafe zu gelten',()=>{
 const missing=compute(entries,[pick('StGB','Offene Rechnungen')]);assert.equal(missing.complete,false);assert.equal(missing.lines[0].fine,null);assert.equal(missing.lines[0].months,null);
 const manual=compute(entries,[pick('StGB','Offene Rechnungen',{fine:50000,months:18})]);assert.equal(manual.complete,true);assert.equal(manual.months,18);
 assert.equal(compute(entries,[pick('BeamtG','Amtsmissbrauch (besonders schwer)')]).complete,false);
 assert.equal(compute(entries,[pick('StPO','Vermögensabschöpfung',{fine:100})]).months,0);
});
test('Ordnungshaft respektiert ihren Strafrahmen; ungefähre BGB-Werte bleiben gekennzeichnet',()=>{
 assert.equal(compute(entries,[pick('StPO','Ordnungshaft',{months:31})]).complete,false);assert.equal(compute(entries,[pick('StPO','Ordnungshaft',{months:9})]).complete,false);assert.equal(compute(entries,[pick('StPO','Ordnungshaft',{months:25})]).months,25);
 const approximate=compute(entries,[pick('BGB','Anfechtung')]);assert.equal(approximate.months,5);assert.ok(approximate.notes.some(n=>n.includes('Richtwert')));
});
test('Besondere Fälle und Hauptuntersuchung werden ohne doppelten Haftzuschlag berechnet',()=>{
 const press=pick('StGB','Angriff auf Pressevertreter',{variant:'severe'});assert.equal(compute(entries,[press]).months,25);
 const resistance=compute(entries,[pick('StGB','Widerstand (schwerer Fall)')]);assert.equal(resistance.months,15);assert.ok(resistance.notes.some(n=>n.includes('bereits')));
 for(const n of [1,2,3])assert.equal(compute(entries,[pick('StVO','Abgelaufene Hauptuntersuchung',{inspectionStage:n})]).fine,n*150000);
 assert.equal(compute(entries,[pick('StVO','Abgelaufene Hauptuntersuchung',{inspectionStage:4})]).complete,false);
 const fourth=compute(entries,[pick('StVO','Abgelaufene Hauptuntersuchung',{inspectionStage:4,fine:600000})]);assert.equal(fourth.fine,600000);assert.ok(fourth.notes.some(n=>n.includes('Führerscheinentzug')));
});
test('Ungültige Eingaben und Regelzeilen sind keine gültigen Strafpositionen',()=>{
 assert.equal(compute(entries,[{id:find('StPO','Gesamtstrafenbildung').id}]).complete,false);
 assert.equal(compute(entries,[pick('StGB','Raub')],{reduction:101}).complete,false);assert.equal(compute(entries,[pick('StGB','Raub')],{cap:-1}).complete,false);
 assert.equal(compute(entries,[pick('StGB','Raub')],{cap:10.2}).months,10);
});
