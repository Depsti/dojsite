import test from 'node:test';import assert from 'node:assert/strict';
import {chatCase,validateChatInput,presentMessage,handleChat} from '../lib/case-chat.mjs';
import {ranks,validateRank} from '../lib/ranks.mjs';
const id=n=>n.repeat(24),lead={id:id('a'),name:'Leitung',role:'Leitung',rank:'attorney_general'},lawyer={id:id('b'),name:'Anwalt',role:'Staatsanwalt',rank:'district_attorney'},student={id:id('c'),name:'Student',role:'Student'};
function fixture(){return {users:[lead,lawyer,student],records:[{id:id('1'),type:'cases',title:'Fall A',owner:lawyer.id,createdBy:lead.id},{id:id('2'),type:'cases',title:'GEHEIMER TITEL',confidential:true,createdBy:lead.id}]};}
test('Fallchat folgt Fallrechten: Studenten lesen, Archiv ist schreibgeschützt',()=>{const db=fixture();assert.equal(chatCase(id('1'),student,db).id,id('1'));assert.throws(()=>chatCase(id('1'),student,db,true),e=>e.status===403);assert.throws(()=>chatCase(id('2'),lawyer,db),e=>e.status===404);db.records[0].status='Archiviert';assert.throws(()=>chatCase(id('1'),lead,db,true),e=>e.status===403);});
test('Dienstgrade sind validiert; Studenten bleiben im Vorlagemodus',()=>{assert.equal(ranks.length,8);assert.equal(validateRank('district_attorney'),'district_attorney');assert.equal(validateRank(''),null);assert.throws(()=>validateRank('Master'),/Dienstgrad/);assert.throws(()=>validateRank({color:'red'}),/Dienstgrad/);const db=fixture();assert.throws(()=>chatCase(id('1'),{...student,rank:'attorney_general'},db,true),e=>e.status===403);});
test('Verweise werden bei Erstellung und beim Abruf nach aktuellen Rechten geprüft',()=>{const db=fixture();assert.throws(()=>validateChatInput({text:'Text',references:[id('2')],nonce:'nonce-1234'},lawyer,db),e=>e.status===403);const row={id:id('3'),case_id:id('1'),seq:1,author_id:lawyer.id,body:'Text',reference_ids:[id('2')],edit_history:[]};const shown=presentMessage(row,lawyer,db);assert.deepEqual(shown.references,[{available:false}]);assert.ok(!JSON.stringify(shown).includes('GEHEIMER TITEL'));assert.equal(shown.author.rank.id,'district_attorney');assert.equal(presentMessage({...row,deleted_at:'now'},lead,db).text,'Nachricht gelöscht.');});
test('Reaktionen, Antworten und Moderation bleiben an den sichtbaren Fall gebunden',async()=>{
 const db=fixture(),message={id:id('3'),case_id:id('1'),seq:1,author_id:lawyer.id,body:'Test',reference_ids:[],updated_at:'stamp',edit_history:[]};let reaction;
 const store={get:async()=>message,react:async(...args)=>reaction=args,update:async()=>{}};
 const call=(user,method,suffix,input)=>handleChat({path:'/api/cases/'+id('1')+'/chat/messages/'+id('3')+suffix,method,query:new URLSearchParams(),user,db,store,body:async()=>input});
 await call(lawyer,'PUT','/reaction',{kind:'check'});assert.deepEqual(reaction,[message.id,lawyer.id,'check']);await call(lawyer,'PUT','/reaction',{kind:null});assert.equal(reaction[2],null);
 await assert.rejects(call(student,'PUT','/reaction',{kind:'cross'}),e=>e.status===403);await assert.rejects(call(lead,'PATCH','',{text:'Fremd',updatedAt:'stamp'}),e=>e.status===403);await call(lead,'DELETE','',{updatedAt:'stamp'});
});
test('Chatübersicht zeigt auf Wunsch alle zugänglichen Fälle, auch ohne Nachrichten',async()=>{
 const db=fixture();db.records.push({id:id('4'),type:'cases',title:'Leerer Fall',status:'Archiviert'});
 let requested;const store={unread:async(user,ids)=>{requested=ids;return [{case_id:id('1'),unread:2},{case_id:id('2'),unread:99}];}};
 const call=query=>handleChat({path:'/api/chat/summary',method:'GET',query:new URLSearchParams(query),user:student,db,store});
 const all=await call('all=1');assert.deepEqual(requested,[id('1'),id('4')]);assert.equal(all.cases.length,2);assert.equal(all.cases.find(r=>r.id===id('4')).unread,0);assert.equal(all.cases.find(r=>r.id===id('4')).archived,true);assert.ok(!JSON.stringify(all).includes('GEHEIMER TITEL'));assert.equal((await call('')).cases.length,1);
});
