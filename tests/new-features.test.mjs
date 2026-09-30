import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {authorizeImport,importCase,buildCaseMessage,sendCaseToDiscord} from '../lib/discord.mjs';

test('Discord: Import-Authentifizierung, Validierung und Duplikatschutz',()=>{
 const env={DOJ_DISCORD_IMPORT_USER_ID:'lead'},db={users:[{id:'lead',role:'Leitung',active:true}],records:[]};
 assert.throws(()=>authorizeImport('',undefined),/nicht eingerichtet/);
 assert.throws(()=>authorizeImport('Bearer falsch','a'.repeat(32)),/Ungültiger/);
 authorizeImport('Bearer '+'a'.repeat(32),'a'.repeat(32));
 assert.throws(()=>importCase({externalId:'1',title:'Fall',people:[{name:'Person',role:'Ungültig'}]},db,env));
 assert.equal(db.records.length,0);
 const first=importCase({externalId:'1',title:'Importierter Fall',people:[{name:'Alex',role:'Zeuge'}]},db,env);
 assert.equal(first.created,true);assert.equal(first.record.confidential,true);assert.equal(first.record.status,'Offen');
 assert.equal(importCase({externalId:'1',title:'Nochmal'},db,env).created,false);assert.equal(db.records.length,2);
});

test('Discord: Versand sperrt vertrauliche Fälle, fremde Hosts und Erwähnungen',async()=>{
 const user={id:'lead',role:'Leitung'},record={id:'c',type:'cases',createdBy:'lead',title:'@everyone Fall',reference:'DOJ-1',description:'@here',confidential:true},db={users:[user],records:[record]};
 await assert.rejects(()=>sendCaseToDiscord(record,user,db,{env:{}}),/vertraulicher/);
 await assert.rejects(()=>sendCaseToDiscord({...record,confidential:false},user,db,{env:{DISCORD_CASE_WEBHOOK_URL:'https://example.com/api/webhooks/1/x'}}),/Ungültige/);
 assert.deepEqual(buildCaseMessage(record,user,db).allowed_mentions,{parse:[]});
 let called=0;
 const sent=await sendCaseToDiscord(record,user,db,{env:{DISCORD_ALLOW_CONFIDENTIAL:'1',DISCORD_CASE_WEBHOOK_URL:'https://discord.com/api/webhooks/123456/fake-token'},fetcher:async(url,o)=>{called++;assert.equal(url.searchParams.get('wait'),'true');assert.equal(o.redirect,'error');return Response.json({id:'message',channel_id:'channel'});}});
 assert.equal(called,1);assert.equal(sent.messageId,'message');
});

test('API: Personen mehrfach verknüpfen, Sichtbarkeit, Import und Discord-Versand',async()=>{
 const realFetch=globalThis.fetch,tables={doj_portal_state:[],doj_sessions:[],doj_login_attempts:[]},discordMessages=[];
 process.env.SUPABASE_URL='https://isolated-test.supabase.co';process.env.SUPABASE_SECRET_KEY='sb_secret_fake';process.env.HOST='127.0.0.1';process.env.PORT='0';
 process.env.DOJ_DISCORD_IMPORT_SECRET='a'.repeat(40);process.env.DISCORD_CASE_WEBHOOK_URL='https://discord.com/api/webhooks/123456/fake-token';process.env.DISCORD_ALLOW_CONFIDENTIAL='0';
 globalThis.fetch=async(url,o)=>{
   const parsed=new URL(url);
   if(parsed.hostname==='discord.com'){discordMessages.push(JSON.parse(o.body));return Response.json({id:'msg-'+discordMessages.length,channel_id:'123'});}
   assert.equal(parsed.hostname,'isolated-test.supabase.co','Test must never use live Supabase');
   const table=parsed.pathname.split('/').pop(),params=[...parsed.searchParams].filter(([k])=>!['select','on_conflict'].includes(k));
   const match=r=>params.every(([k,v])=>v.startsWith('lt.')?r[k]<v.slice(3):String(r[k])===v.slice(3));
   if(o.method==='GET')return Response.json(tables[table].filter(match));
   if(o.method==='DELETE'){tables[table]=tables[table].filter(r=>!match(r));return new Response(null,{status:204});}
   const body=JSON.parse(o.body);
   if(o.method==='POST'){if(table==='doj_login_attempts')tables[table]=tables[table].filter(r=>r.key!==body.key);if(table==='doj_portal_state'&&tables[table].length)return Response.json({}, {status:409});tables[table].push(body);return Response.json([body],{status:201});}
   const rows=tables[table].filter(match);rows.forEach(r=>Object.assign(r,body));return Response.json(rows);
 };
 let server;
 try{
   ({server}=await import('../lib/http-server.mjs'));if(!server.listening)await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}/api/`;
   let cookie='';
   async function req(p,method='GET',data,auth=cookie){const res=await realFetch(base+p,{method,headers:{'Content-Type':'application/json',Cookie:auth},body:data===undefined?undefined:JSON.stringify(data)});return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};}
   await req('setup','POST',{name:'Lead',password:'OnlyForTest123!'});cookie=(await req('login','POST',{name:'Lead',password:'OnlyForTest123!'})).cookie;
   const lead=(await req('state')).data.user;process.env.DOJ_DISCORD_IMPORT_USER_ID=lead.id;
   const staff=(await req('users','POST',{name:'Lawyer',role:'Staatsanwalt',password:'OnlyForTest456!'})).data;
   const staffCookie=(await req('login','POST',{name:'Lawyer',password:'OnlyForTest456!'})).cookie;
   const person=(await req('records','POST',{type:'people',title:'Alex Doe'})).data;
   const c1=(await req('records','POST',{type:'cases',title:'Erster Fall',confidential:false})).data;
   const c2=(await req('records','POST',{type:'cases',title:'Vertraulicher Fall',confidential:true})).data;
   const looseEvidence=(await req('records','POST',{type:'evidence',title:'Vorhandene Kameraaufnahme'})).data;
   const beforeBundle=(await req('state')).data.records.length;
   const bundle={requestId:'test-wizard-request-1234',case:{title:'Assistenten-Fall',confidential:true},people:[{personId:person.id,role:'Zeuge',note:'Vor Ort'},{title:'Neue Person',role:'Beschuldigter'}],evidence:[{recordId:looseEvidence.id},{title:'Neuer Beweis',description:'Fundort'}],documents:[{title:'Anklage',description:'Dokumenttext'}]};
   const completed=await req('cases/bundle','POST',bundle);
   assert.equal(completed.status,201);assert.equal(completed.data.participants.length,2);
   const afterBundle=(await req('state')).data.records;
   assert.equal(afterBundle.length,beforeBundle+4);
   const repeated=await req('cases/bundle','POST',bundle);assert.equal(repeated.status,200);assert.equal(repeated.data.id,completed.data.id);
   assert.equal((await req('state')).data.records.length,afterBundle.length);
   assert.equal(afterBundle.find(r=>r.id===looseEvidence.id).caseId,completed.data.id);
   assert.equal(afterBundle.filter(r=>r.caseId===completed.data.id&&r.type==='documents').length,1);
   assert.equal((await req(`records/${completed.data.id}/participants`,'PUT',{participants:[{personId:person.id,role:'Geschädigter',note:'Nachträglich geändert'}]})).status,200);
   const invalid=await req('cases/bundle','POST',{...bundle,requestId:'test-invalid-request-1234',evidence:[{recordId:looseEvidence.id}]});
   assert.equal(invalid.status,400);assert.equal((await req('state')).data.records.length,afterBundle.length);
   const restricted=(await req('users','POST',{name:'Ohne Dokumentrecht',role:'Staatsanwalt',password:'OnlyForTest789!',permissions:{modules:{documents:{create:false}}}})).data;
   const restrictedCookie=(await req('login','POST',{name:restricted.name,password:'OnlyForTest789!'})).cookie;
   assert.equal((await req('cases/bundle','POST',{case:{title:'Keine Teilakte'},people:[{title:'Nicht speichern',role:'Zeuge'}],documents:[{title:'Verboten'}]},restrictedCookie)).status,403);
   assert.equal((await req('state')).data.records.length,afterBundle.length);
   assert.equal((await req(`records/${c1.id}/participants`,'PUT',{participants:[{personId:person.id,role:'Zeuge',note:'Tatort'}]})).status,200);
   assert.equal((await req(`records/${c2.id}/participants`,'PUT',{participants:[{personId:person.id,role:'Beschuldigter',note:''}]})).status,200);
   const leadState=(await req('state')).data,staffState=(await req('state','GET',undefined,staffCookie)).data;
   assert.equal(leadState.records.find(r=>r.id===person.id).relatedCases.length,3);
   assert.equal(staffState.records.find(r=>r.id===person.id).relatedCases.length,1);
   assert.equal((await req(`records/${c1.id}/participants`,'PUT',{participants:[]},staffCookie)).status,403);
   assert.equal((await req(`records/${c1.id}/participants`,'PUT',{participants:[{personId:'missing',role:'Zeuge'}]})).status,400);
   assert.equal((await req(`records/${c1.id}/discord`,'POST',{})).status,200);assert.equal(discordMessages.length,1);
   assert.equal((await req(`records/${c2.id}/discord`,'POST',{})).status,403);assert.equal(discordMessages.length,1);
   assert.equal((await req(`records/${c1.id}/discord`,'POST',{},staffCookie)).status,403);
   const importUrl=base+'integrations/discord/cases';
   assert.equal((await realFetch(importUrl,{method:'POST',headers:{Authorization:'Bearer wrong','Content-Type':'application/json'},body:JSON.stringify({externalId:'wrong',title:'Invalid'})})).status,401);
   const payload={externalId:'discord-message-1',title:'Bot-Fall',people:[{personId:person.id,role:'Zeuge'}]},options={method:'POST',headers:{Authorization:'Bearer '+process.env.DOJ_DISCORD_IMPORT_SECRET,'Content-Type':'application/json'},body:JSON.stringify(payload)};
   const first=await realFetch(importUrl,options),firstData=await first.json();assert.equal(first.status,201);
   const second=await realFetch(importUrl,options),secondData=await second.json();assert.equal(second.status,200);assert.equal(secondData.id,firstData.id);
   assert.equal(tables.doj_portal_state[0].payload.records.filter(r=>r.externalId===payload.externalId).length,1);
   assert.equal((await req(`records/${c1.id}/participants`,'PUT',{participants:[]})).status,200);
   assert.equal((await req('state')).data.records.find(r=>r.id===c1.id).participants.length,0);

   const planned=(await req('records','POST',{type:'cases',title:'Fall mit Verhandlung',hearingExpected:true,confidential:true})).data;
   let orgState=(await req('state')).data;
   const pending=orgState.records.find(r=>r.type==='hearings'&&r.caseId===planned.id);assert.ok(pending);assert.equal(pending.date,'');
   assert.equal((await req('records/'+planned.id+'/assignment','PUT',{assignedProsecutors:[],openForClaim:true})).status,200);
   const offered=(await req('state','GET',undefined,staffCookie)).data;
   assert.ok(offered.assignmentOffers.some(r=>r.id===planned.id));assert.ok(!offered.records.some(r=>r.id===planned.id));
   const concurrent=await Promise.all([req('records/'+planned.id+'/claim','POST',{},staffCookie),req('records/'+planned.id+'/claim','POST',{},restrictedCookie)]);
   assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
   const winnerCookie=concurrent[0].status===200?staffCookie:restrictedCookie;
   const claimed=(await req('state','GET',undefined,winnerCookie)).data.records.find(r=>r.id===planned.id);assert.ok(claimed.capabilities.edit);
   assert.equal((await req('records/'+pending.id,'PUT',{title:pending.title,date:'2026-10-01T14:00'})).status,200);
   assert.equal((await req('records/'+planned.id,'PUT',{title:planned.title,hearingExpected:false})).status,200);
   assert.ok((await req('state')).data.records.some(r=>r.id===pending.id));
   const draft=(await req('records','POST',{type:'knowledge',title:'Freigabeentwurf'})).data;
   assert.equal((await req('records/'+draft.id+'/review','POST',{status:'In Prüfung',reason:'Bitte prüfen'},staffCookie)).status,200);
   assert.equal((await req('records/'+draft.id,'PUT',{title:'Unzulässige Änderung'})).status,400);
   assert.equal((await req('records/'+draft.id+'/review','POST',{status:'Freigegeben',reason:'Geprüft'},staffCookie)).status,403);
   assert.equal((await req('records/'+draft.id+'/review','POST',{status:'Zurückgegeben',reason:'Bitte ergänzen'})).status,200);
   assert.equal((await req('records/'+draft.id,'PUT',{title:'Überarbeiteter Entwurf'})).status,200);
   assert.equal((await req('records/'+draft.id+'/review','POST',{status:'In Prüfung'})).status,200);
   const approved=await req('records/'+draft.id+'/review','POST',{status:'Freigegeben',reason:'Vollständig'});assert.equal(approved.status,200);assert.equal(approved.data.reviewHistory.length,5);

 }finally{if(server)await new Promise(resolve=>server.close(resolve));globalThis.fetch=realFetch;}
});
