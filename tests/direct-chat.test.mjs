import test from 'node:test';import assert from 'node:assert/strict';import {directPeer,handleDirectChat} from '../lib/direct-chat.mjs';
const id=letter=>letter.repeat(24),master={id:id('a'),name:'Master',role:'Master'},alice={id:id('b'),name:'Alice',role:'Staatsanwalt'},bob={id:id('c'),name:'Bob',role:'Staatsanwalt'},student={id:id('d'),name:'Student',role:'Student'};
const fixture=()=>({users:[master,alice,bob,student],records:[]});
test('Privatchats erlauben direkte Kommunikation aller aktiven Mitarbeiter ohne Fallfreigabe',()=>{
 const db=fixture();assert.equal(directPeer(alice.id,student,db,true).id,alice.id);assert.throws(()=>directPeer(student.id,student,db),e=>e.status===404);assert.throws(()=>directPeer(id('f'),alice,db),e=>e.status===404);
 db.users.find(u=>u.id===bob.id).active=false;assert.equal(directPeer(bob.id,alice,db).active,false);assert.throws(()=>directPeer(bob.id,alice,db,true),e=>e.status===403);
});
test('Private Übersicht bindet Lesestände an den angemeldeten Nutzer und zeigt keine Nachrichteninhalte',async()=>{
 const db=fixture();db.users.push({id:id('e'),name:'Gesperrt',role:'Student',active:false});let actor;
 const store={summary:async user=>{actor=user;return [{peer_id:bob.id,unread:2,latest_at:'2026-10-23T10:00:00Z'}];}};
 const result=await handleDirectChat({path:'/api/chat/private',method:'GET',query:new URLSearchParams(),user:alice,db,store});assert.equal(actor,alice.id);assert.equal(result.contacts.find(c=>c.id===bob.id).unread,2);assert.ok(!result.contacts.some(c=>c.id===alice.id||c.id===id('e')));assert.ok(!JSON.stringify(result).includes('body'));
});
test('Auch Master dürfen fremde Privatnachrichten weder bearbeiten noch moderieren',async()=>{
 const db=fixture(),row={id:id('f'),seq:1,case_id:[master.id,bob.id].sort().join(':'),author_id:bob.id,body:'Privat',reference_ids:[],created_at:'2026-10-23T10:00:00Z',updated_at:'2026-10-23T10:00:00Z',edit_history:[]};
 const thread={list:async()=>({rows:[row],extra:[],hasMore:false}),byIds:async()=>[],reactions:async()=>[],get:async()=>row};const store={thread:(user,peer)=>{assert.equal(user,master.id);assert.equal(peer,bob.id);return thread;}};
 const call=(method,suffix='')=>handleDirectChat({path:'/api/chat/private/'+bob.id+suffix,method,query:new URLSearchParams(),user:master,db,store,body:async()=>({updatedAt:row.updated_at,text:'Manipuliert'})});
 assert.equal((await call('GET')).messages[0].canDelete,false);await assert.rejects(call('DELETE','/messages/'+row.id),e=>e.status===403);await assert.rejects(call('PATCH','/messages/'+row.id),e=>e.status===403);
});
