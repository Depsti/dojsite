import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('Fallassistent hält Entwurf über Schritte und speichert erst am Ende',async()=>{
 let nodes={},html='',calls=[],opened;
 const record={id:'person1',type:'people',title:'Vorhandene Person'};
 const context=vm.createContext({crypto:{randomUUID:()=>'wizard-request-123456'},TextEncoder,URL,editor(){},applyDetailAccess(){},esc:v=>String(v??''),roleOptions:()=>'<option>Sonstige</option>',state:{user:{id:'lead'},users:[{id:'lead',name:'Leitung'}],records:[record]},records:t=>t==='people'?[record]:[],canModule:()=>true,modules:{},document:{querySelectorAll:()=>[]},$:s=>nodes[s]||null,modal(title,body){
  html=body;nodes={'#modal':{close(){}},'#wizard-error':{textContent:''}};
  for(const match of body.matchAll(/id="([^"]+)"/g))nodes['#'+match[1]]={value:'',files:[],textContent:''};
  const elements={};
  for(const m of body.matchAll(/<(input|textarea|select)\b([^>]*)name="([^"]+)"([^>]*)>([\s\S]*?)(?:<\/textarea>|<\/select>|(?=<))/g)){
   const attrs=m[2]+m[4];let value=attrs.match(/value="([^"]*)"/)?.[1]||'';
   if(m[1]==='textarea')value=m[5];
   if(m[1]==='select'){const options=[...m[5].matchAll(/<option([^>]*)>([^<]*)<\/option>/g)];const o=options.find(o=>o[1].includes('selected'))||options[0];value=o?.[1].match(/value="([^"]*)"/)?.[1]??o?.[2]??'';}
   elements[m[3]]={value,checked:attrs.includes('checked'),type:attrs.includes('checkbox')?'checkbox':'text'};
  }
  const form=nodes['#case-wizard-form'];form.elements=elements;form.querySelector=()=>({disabled:false});
 },FormData:class{constructor(form){this.entries=Object.entries(form.elements).filter(([,el])=>el.type!=='checkbox').map(([key,el])=>[key,el.value]);}*[Symbol.iterator](){yield* this.entries;}},api:async(p,m,b)=>{calls.push({p,m,b:structuredClone(b)});return {id:'case1'};},refresh:async()=>{},detail:id=>opened=id,toast(){}});
 vm.runInContext(readFileSync(new URL('../public/case-wizard.js',import.meta.url),'utf8'),context);
 vm.runInContext("editor('cases')",context);
 const next=async()=>{const form=nodes['#case-wizard-form'];await form.onsubmit({preventDefault(){},target:form});assert.equal(nodes['#wizard-error'].textContent,'');};
 nodes['#case-wizard-form'].elements.title.value='Staat gegen Test';
 await next();assert.match(html,/Schritt 2 von 4/);assert.equal(calls.length,0);
 nodes['#wizard-existing'].value='person1';await nodes['#wizard-back'].onclick();
 assert.equal(nodes['#case-wizard-form'].elements.title.value,'Staat gegen Test');
 await next();assert.match(html,/Vorhandene Person/);await next();assert.equal(calls.length,0);
 nodes['#case-wizard-form'].elements.newTitle.value='Kameraaufnahme';await next();assert.equal(calls.length,0);
 nodes['#case-wizard-form'].elements.newTitle.value='Anklageschrift';nodes['#case-wizard-form'].elements.newDescription.value='Dokumenttext';await next();
 assert.equal(calls.length,1);assert.equal(calls[0].p,'cases/bundle');assert.equal(calls[0].b.case.title,'Staat gegen Test');assert.equal(calls[0].b.people[0].personId,'person1');assert.equal(calls[0].b.evidence[0].title,'Kameraaufnahme');assert.equal(calls[0].b.documents[0].description,'Dokumenttext');assert.equal(opened,'case1');
});
