import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('Bereichswechsel zeigt die jeweiligen Einträge und setzt Filter zurück',()=>{
 const app={innerHTML:''},notifications={textContent:'',style:{}};
 const context=vm.createContext({location:{hash:''},window:{addEventListener(){}},document:{querySelector:s=>s==='#app'?app:notifications},setTimeout:()=>0,clearTimeout(){}});
 const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8').replace(/^if\(document\.readyState[^\n]*$/m,'');
 vm.runInContext(source,context);
 vm.runInContext(readFileSync(new URL('../public/permissions.js',import.meta.url),'utf8'),context);
 vm.runInContext(`bind=()=>{};state={user:{name:'Test Leitung',role:'Leitung',permissions:{modules:Object.fromEntries(['people','evidence','documents','requests'].map(k=>[k,{read:true}]))}},users:[],settings:{serverName:'Test'},records:['people','evidence','documents','requests'].map(type=>({id:type,type,title:'Testeintrag '+type,status:'Offen'}))};`,context);
 for(const key of ['people','evidence','documents','requests']){
  vm.runInContext(`query='alter Filter';filter='Archiviert';nav('${key}');`,context);
  assert.equal(context.location.hash,key);
  assert.match(app.innerHTML,new RegExp('Testeintrag '+key));
  for(const other of ['people','evidence','documents','requests'].filter(k=>k!==key))assert.ok(!app.innerHTML.includes('Testeintrag '+other));
 }
 vm.runInContext("state.user.permissions.modules.people.read=false;nav('people');",context);
 assert.equal(context.location.hash,'requests');
 assert.match(notifications.textContent,/kein Leserecht/);
});

test('Ausgeblendete Navigation bleibt auch bei display:flex unsichtbar',()=>{
 assert.match(readFileSync(new URL('../public/doj-theme.css',import.meta.url),'utf8'),/\[hidden\]\s*\{display:none!important\}/);
});
