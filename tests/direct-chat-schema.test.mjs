import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PGlite} from '@electric-sql/pglite';
test('Private SQL-Tabellen: getrennte Unterhaltungen, Lesestände, Wiederholschutz und gesperrter öffentlicher Zugriff',async()=>{
 const db=new PGlite();try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');const sql=readFileSync(new URL('../supabase/migrations/20261023154039_private_chat.sql',import.meta.url),'utf8');await db.exec(sql);await db.exec(sql);
  const a='a'.repeat(24),b='b'.repeat(24),c='c'.repeat(24);let index=0;
  const send=async(from,to,nonce,reply=null)=>(await db.query('select * from public.doj_direct_send($1,$2,$3,$4,$5::jsonb,$6,$7)',[(++index).toString(16).padStart(24,'0'),from,to,'Private Nachricht','[]',reply,nonce])).rows[0];
  const first=await send(a,b,'direct-first-123');assert.equal((await send(a,b,'direct-first-123')).id,first.id);const other=await send(a,c,'direct-other-123');const reply=await send(b,a,'direct-reply-123',first.id);assert.equal(reply.thread_key,first.thread_key);
  await assert.rejects(send(b,a,'direct-invalid-123',other.id),/DOJ_DIRECT_INVALID_REPLY/);
  const summary=async user=>(await db.query('select * from public.doj_direct_summary($1)',[user])).rows;
  assert.deepEqual((await summary(b)).map(r=>[r.peer_id,Number(r.unread)]),[[a,1]]);assert.equal((await summary('d'.repeat(24))).length,0);
  await db.query('select public.doj_direct_mark_read($1,$2,$3)',[b,a,99999]);assert.equal(Number((await summary(b))[0].unread),0);await send(a,b,'direct-new-123');await db.query('select public.doj_direct_mark_read($1,$2,$3)',[b,a,first.seq]);assert.equal(Number((await summary(b))[0].unread),1);
  await db.query('insert into public.doj_direct_reactions(message_id,user_id,kind) values($1,$2,$3) on conflict(message_id,user_id) do update set kind=excluded.kind',[first.id,b,'check']);await db.query('insert into public.doj_direct_reactions(message_id,user_id,kind) values($1,$2,$3) on conflict(message_id,user_id) do update set kind=excluded.kind',[first.id,b,'cross']);assert.equal((await db.query('select * from public.doj_direct_reactions')).rows.length,1);
  for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(db.query('select * from public.doj_direct_messages'),/permission denied/);await assert.rejects(db.query('select * from public.doj_direct_summary($1)',[b]),/permission denied/);await db.exec('reset role');}
  await db.exec('set role service_role');assert.ok((await send(c,a,'direct-service-123')).id);await db.exec('reset role');
  await send(a,b,'direct-rate-1');await send(a,b,'direct-rate-2');await assert.rejects(send(a,b,'direct-rate-final'),/DOJ_DIRECT_RATE_LIMIT/);assert.equal((await send(a,b,'direct-first-123')).id,first.id);
 }finally{await db.close();}
});
