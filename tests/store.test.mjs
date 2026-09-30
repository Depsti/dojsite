import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore,emptyState} from '../lib/store.mjs';
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test'};
function fake(){const t={doj_portal_state:[],doj_sessions:[],doj_login_attempts:[]};
 return async(url,o)=>{const u=new URL(url),table=u.pathname.split('/').pop(),q=Object.fromEntries([...u.searchParams].filter(([k])=>!['select','on_conflict'].includes(k)).map(([k,v])=>[k,v.replace(/^eq\./,'')]));
  assert.equal(o.headers.apikey,env.SUPABASE_SECRET_KEY);assert.ok(!('Authorization' in o.headers));
  const match=r=>Object.entries(q).every(([k,v])=>v.startsWith('lt.')?r[k]<v.slice(3):String(r[k])===v);
  if(o.method==='GET')return Response.json(t[table].filter(match));
  if(o.method==='DELETE'){t[table]=t[table].filter(r=>!match(r));return new Response(null,{status:204});}
  const b=JSON.parse(o.body);
  if(o.method==='POST'){if(table==='doj_login_attempts')t[table]=t[table].filter(r=>r.key!==b.key);else if(table==='doj_portal_state'&&t[table].length)return Response.json({},{status:409});t[table].push(b);return Response.json([b],{status:201});}
  const rows=t[table].filter(match);rows.forEach(r=>Object.assign(r,b));return Response.json(rows);};}
test('Bestand wird geteilt und Konflikte erkannt',async()=>{const f=fake(),a=createStore({env,fetcher:f}),b=createStore({env,fetcher:f});
 assert.deepEqual(await a.load(),emptyState());await b.load();await a.save({...emptyState(),users:[{id:'1'}]});await assert.rejects(()=>b.save(emptyState()),/gleichzeitig/);
 assert.equal((await b.load()).users.length,1);});
test('Sitzungen gelten instanzübergreifend',async()=>{const f=fake(),a=createStore({env,fetcher:f}),b=createStore({env,fetcher:f});
 await a.createSession('tok','u1',Date.now()+60000);assert.equal((await b.getSession('tok')).userId,'u1');
 await b.deleteUserSessions('u1');assert.equal(await a.getSession('tok'),null);
 await a.createSession('old','u2',Date.now()-1);assert.equal(await b.getSession('old'),null);});
test('Anmeldeversuche',async()=>{const s=createStore({env,fetcher:fake()});await s.setAttempts('ip',3,Date.now()+1000);assert.equal((await s.getAttempts('ip')).count,3);await s.clearAttempts('ip');assert.equal(await s.getAttempts('ip'),null);});
test('Fehler und Konfiguration',async()=>{await assert.rejects(()=>createStore({env,fetcher:async()=>Response.json({},{status:403})}).load(),/HTTP 403/);
 assert.throws(()=>createStore({env:{}}),/fehlen/);assert.throws(()=>createStore({env:{...env,SUPABASE_URL:'http://x.co'}}),/HTTPS/);});
