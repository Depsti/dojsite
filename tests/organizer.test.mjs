import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {mutateOrganizer,organizerSnapshot,organizerEvents} from '../lib/organizer.mjs';
const time=createRequire(import.meta.url)('../public/organizer-time.js');
const master={id:'master',role:'Master'},lawyer={id:'lawyer',role:'Staatsanwalt'},other={id:'other',role:'Staatsanwalt'},student={id:'student',role:'Student'};
const fixture=()=>({users:[master,lawyer,other,student],records:[]});let counter=0;
const input=(extra={})=>({requestId:'organizer-test-'+String(++counter).padStart(4,'0'),title:'Aufgabe',description:'Inhalt',...extra});
const create=(kind,body,user,db)=>mutateOrganizer(kind,'POST',null,input(body),user,db).item;
test('Persönliche Notizen und private Aufgaben sind auch vor Master und Leitung geschützt',()=>{
 const db=fixture(),note=create('notes',{section:'Ideen',pinned:true,archived:false},lawyer,db),todo=create('todos',{scope:'private',dueAt:'',assignees:[]},lawyer,db);
 assert.equal(organizerSnapshot(lawyer,db).notes.length,1);assert.equal(organizerSnapshot(master,db).notes.length,0);assert.equal(organizerSnapshot(master,db).todos.length,0);assert.equal(organizerSnapshot(other,db).notes.length,0);
 assert.throws(()=>mutateOrganizer('notes','PATCH',note.id,{expectedUpdatedAt:note.updatedAt,title:'Ausspähen'},master,db),e=>e.status===404);
 assert.throws(()=>mutateOrganizer('todos','DELETE',todo.id,{expectedUpdatedAt:todo.updatedAt},other,db),e=>e.status===404);
});
test('Studenten dürfen ihre persönlichen Arbeitsmittel bearbeiten, aber keine gemeinsamen Einträge ändern',()=>{
 const db=fixture(),note=create('notes',{section:'Studium',pinned:false,archived:false},student,db);
 const edited=mutateOrganizer('notes','PATCH',note.id,{title:'Neue Notiz',description:'Geändert',section:'Studium',pinned:false,archived:false,expectedUpdatedAt:note.updatedAt},student,db).item;assert.equal(edited.title,'Neue Notiz');
 assert.throws(()=>create('todos',{scope:'shared',assignees:[student.id],dueAt:''},student,db),e=>e.status===403);
 assert.equal(create('todos',{scope:'private',assignees:[],dueAt:''},student,db).scope,'private');
});
test('Mehrere Zuständige benötigen Zuteilungsrechte und erhalten einen eigenen Erledigungsstand',()=>{
 const db=fixture();assert.throws(()=>create('todos',{scope:'shared',assignees:[other.id],dueAt:''},lawyer,db),e=>e.status===403);
 let task=create('todos',{scope:'shared',assignees:[lawyer.id,other.id],dueAt:''},master,db);
 assert.equal(organizerSnapshot(student,db).todos.length,0);assert.equal(organizerSnapshot(lawyer,db).todos.length,1);
 task=mutateOrganizer('todos','PATCH',task.id,{action:'complete',done:true,expectedUpdatedAt:task.updatedAt},lawyer,db).item;assert.deepEqual(task.completedBy,[lawyer.id]);assert.equal(task.completedAt,'');
 task=mutateOrganizer('todos','PATCH',task.id,{action:'complete',done:true,expectedUpdatedAt:task.updatedAt},other,db).item;assert.ok(task.completedAt);const createdAt=task.createdAt;
 task=mutateOrganizer('todos','PATCH',task.id,{action:'complete',done:false,expectedUpdatedAt:task.updatedAt},lawyer,db).item;assert.equal(task.completedAt,'');assert.equal(task.createdAt,createdAt);
});
test('Kalender-Verwaltungsrecht ist unabhängig und verknüpfte Fälle bleiben geschützt',()=>{
 const db=fixture(),startAt=new Date(Date.now()+3600000).toISOString(),endAt=new Date(Date.now()+7200000).toISOString();const values={allowConflicts:true,startAt,endAt,allTeam:true,attendees:[],location:'DOJ',status:'Geplant',caseId:''};
 assert.throws(()=>create('events',values,lawyer,db),e=>e.status===403);
 const calendarUser={...lawyer,permissions:{calendarManage:true}};assert.ok(create('events',values,calendarUser,db).id);
 assert.throws(()=>create('events',{...values,endAt:startAt},master,db),/Ende|Terminende/);
 db.records.push({id:'secret',type:'cases',title:'Geheim',confidential:true,createdBy:master.id});create('events',{...values,caseId:'secret'},master,db);assert.equal(organizerEvents(other,db).length,1);
 const invitation=create('events',{...values,allTeam:false,attendees:[lawyer.id]},master,db);assert.ok(organizerEvents(lawyer,db).some(e=>e.id===invitation.id));assert.ok(!organizerEvents(other,db).some(e=>e.id===invitation.id));
});
test('Notizen haben Wiederholschutz und Versionsprüfung verhindert verlorene Änderungen',()=>{
 const db=fixture(),body=input({section:'Allgemein',pinned:false,archived:false}),first=mutateOrganizer('notes','POST',null,body,lawyer,db).item;
 assert.equal(mutateOrganizer('notes','POST',null,body,lawyer,db).changed,false);assert.equal(db.organizer.notes.length,1);
 assert.throws(()=>mutateOrganizer('notes','POST',null,{...body,title:'Anders'},lawyer,db),e=>e.status===409);
 mutateOrganizer('notes','PATCH',first.id,{...body,title:'Überarbeitet',expectedUpdatedAt:first.updatedAt},lawyer,db);
 assert.throws(()=>mutateOrganizer('notes','PATCH',first.id,{...body,expectedUpdatedAt:first.updatedAt},lawyer,db),e=>e.status===409);
});
test('Erinnerungen beachten Zeitfenster, laufende und abgesagte Termine; Erledigungsdauer bleibt eingefroren',()=>{
 const now=Date.parse('2026-10-23T10:00:00Z'),event=(id,start,end,status='Geplant')=>({id,startAt:start,endAt:end,status});
 const events=[event('soon','2026-10-23T12:00:00Z','2026-10-23T13:00:00Z'),event('late','2026-10-23T14:00:00Z','2026-10-23T15:00:00Z'),event('running','2026-10-23T09:30:00Z','2026-10-23T10:30:00Z'),event('cancelled','2026-10-23T11:00:00Z','2026-10-23T12:00:00Z','Abgesagt')];
 assert.deepEqual(time.upcoming(events,now).map(e=>e.id),['running','soon']);assert.equal(time.age('2026-10-23T08:00:00Z','',now),'2 Std. 0 Min.');assert.equal(time.age('2026-10-23T08:00:00Z','2026-10-23T09:00:00Z',now),'1 Std. 0 Min.');
});

test('Mehrtägige Termine stehen an jedem betroffenen Kalendertag',()=>{const event={startAt:'2026-10-23T10:00:00',endAt:'2026-10-25T00:00:00'};assert.equal(time.onDay(event,'2026-10-23'),true);assert.equal(time.onDay(event,'2026-10-24'),true);assert.equal(time.onDay(event,'2026-10-25'),false);});


test('Gemeinsame Checklisten erfordern jede persönliche Bestätigung; auch Master kann niemanden abhaken',()=>{
 const db=fixture();let t=create('todos',{scope:'shared',assignees:[lawyer.id,other.id],dueAt:'',checklist:[{id:'one',title:'Unterlagen prüfen',completedBy:[other.id]},{id:'two',title:'Rückmeldung'}]},master,db);
 assert.deepEqual(t.checklist[0].completedBy,[]);assert.equal(t.capabilities.completeAll,false);assert.throws(()=>mutateOrganizer('todos','PATCH',t.id,{action:'complete',all:true,done:true,expectedUpdatedAt:t.updatedAt},master,db),e=>e.status===403);
 const mark=(user,itemId,done=true)=>{t=mutateOrganizer('todos','PATCH',t.id,{action:'complete',itemId,done,expectedUpdatedAt:t.updatedAt},user,db).item;};
 mark(lawyer,'one');assert.equal(t.completedAt,'');mark(other,'one');assert.equal(t.completedAt,'');mark(lawyer,'two');assert.deepEqual(t.completedBy,[lawyer.id]);assert.equal(t.completedAt,'');mark(other,'two');assert.ok(t.completedAt);mark(lawyer,'one',false);assert.equal(t.completedAt,'');assert.deepEqual(t.checklist[0].completedBy,[other.id]);assert.throws(()=>mark(student,'two'),e=>[403,404].includes(e.status));
});
test('Checklisten prüfen IDs, behalten Haken nur für unveränderte Aufgaben und Zuständige',()=>{
 const db=fixture();let t=create('todos',{scope:'shared',assignees:[lawyer.id,other.id],dueAt:'',checklist:[{id:'one',title:'Prüfen'}]},master,db);
 t=mutateOrganizer('todos','PATCH',t.id,{action:'complete',itemId:'one',done:true,expectedUpdatedAt:t.updatedAt},lawyer,db).item;
 t=mutateOrganizer('todos','PATCH',t.id,{...t,title:'Neuer Titel',description:'',dueAt:'',expectedUpdatedAt:t.updatedAt},master,db).item;assert.deepEqual(t.checklist[0].completedBy,[lawyer.id]);
 t=mutateOrganizer('todos','PATCH',t.id,{...t,checklist:[{id:'one',title:'Inhalt geändert',completedBy:[lawyer.id,other.id]}],expectedUpdatedAt:t.updatedAt},master,db).item;assert.deepEqual(t.checklist[0].completedBy,[]);assert.equal(t.completedAt,'');
 assert.throws(()=>create('todos',{scope:'shared',assignees:[master.id],dueAt:'',checklist:[{id:'same',title:'A'},{id:'same',title:'B'}]},master,db),/Aufgabenliste/);
});
test('Gemeinsame To-dos ohne Unteraufgaben haben weiterhin eigene Haken ohne Verwaltungs-Override',()=>{const db=fixture();let t=create('todos',{scope:'shared',assignees:[master.id,lawyer.id],dueAt:''},master,db);assert.throws(()=>mutateOrganizer('todos','PATCH',t.id,{action:'complete',all:true,done:true,expectedUpdatedAt:t.updatedAt},master,db),e=>e.status===403);t=mutateOrganizer('todos','PATCH',t.id,{action:'complete',done:true,expectedUpdatedAt:t.updatedAt},master,db).item;assert.equal(t.completedAt,'');assert.deepEqual(t.completedBy,[master.id]);});
