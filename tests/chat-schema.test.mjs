import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PGlite} from '@electric-sql/pglite';
test('Chat-Migration: Rechte, Speicherung, Retry-Schutz, Reaktionen und monotone Lesestände',async()=>{
 const db=new PGlite();try{
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');
 const sql=readFileSync(new URL('../supabase/migrations/20261023_case_chat.sql',import.meta.url),'utf8');await db.exec(sql);await db.exec(sql);
 const caseId='1'.repeat(24),author='2'.repeat(24),reader='3'.repeat(24);
 const send=async(id,nonce,body='Hallo',reply=null)=>(await db.query('select * from public.doj_chat_send($1,$2,$3,$4,$5::jsonb,$6,$7)',[id,caseId,author,body,'[]',reply,nonce])).rows[0];
 const first=await send('a'.repeat(24),'nonce-12345');assert.equal(first.body,'Hallo');const retry=await send('b'.repeat(24),'nonce-12345');assert.equal(retry.id,first.id);
 const second=await send('b'.repeat(24),'nonce-23456','Antwort',first.id);assert.equal(second.reply_to,first.id);
 await assert.rejects(send('c'.repeat(24),'nonce-invalid','Antwort','f'.repeat(24)),/DOJ_CHAT_INVALID_REPLY/);
 const counts=await db.query('select * from public.doj_chat_unread($1,$2::text[])',[reader,[caseId]]);assert.equal(Number(counts.rows[0].unread),2);
 await db.query('select public.doj_chat_mark_read($1,$2,$3)',[caseId,reader,second.seq]);await db.query('select public.doj_chat_mark_read($1,$2,$3)',[caseId,reader,first.seq]);assert.equal((await db.query('select * from public.doj_chat_unread($1,$2::text[])',[reader,[caseId]])).rows.length,0);
 await db.query('insert into public.doj_case_reactions(message_id,user_id,kind) values($1,$2,$3) on conflict(message_id,user_id) do update set kind=excluded.kind',[first.id,reader,'check']);await db.query('insert into public.doj_case_reactions(message_id,user_id,kind) values($1,$2,$3) on conflict(message_id,user_id) do update set kind=excluded.kind',[first.id,reader,'cross']);assert.equal((await db.query('select * from public.doj_case_reactions')).rows.length,1);
 for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(db.query('select * from public.doj_case_messages'),/permission denied/);await assert.rejects(db.query('select public.doj_chat_unread($1,$2::text[])',[reader,[caseId]]),/permission denied/);await db.exec('reset role');}
 await db.exec('set role service_role');assert.equal((await db.query('select * from public.doj_case_messages')).rows.length,2);await db.exec('reset role');
 for(const [i,id] of ['c','d','e'].entries())await send(id.repeat(24),'nonce-rate-'+i);
 await assert.rejects(send('f'.repeat(24),'nonce-rate-final'),/DOJ_CHAT_RATE_LIMIT/);
 }finally{await db.close();}
});