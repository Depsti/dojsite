import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,permissions,visible,canEdit,canComment,canManage,validatePermissions} from '../lib/access.mjs';
const creator={id:'a',role:'Staatsanwalt'},reader={id:'b',role:'Staatsanwalt'},lead={id:'l',role:'Leitung'};
const caseRecord={id:'c',type:'cases',createdBy:'a',confidential:true,access:{b:'read'}};
test('Fallrechte: Standard, Vererbung und zusätzliche Vertraulichkeit',()=>{
 const evidence={id:'e',type:'evidence',caseId:'c',createdBy:'a'},db={records:[caseRecord,evidence]};
 assert.equal(visible(evidence,reader,db),true);assert.equal(canEdit(evidence,reader,db),false);
 assert.equal(canManage(caseRecord,creator,db),true);assert.equal(canManage(caseRecord,reader,db),false);
 assert.equal(canComment(caseRecord,reader,db),false);
 assert.equal(visible({...evidence,confidential:true},reader,db),false);
 assert.equal(visible({...evidence,caseId:'missing'},reader,db),false);
 assert.equal(visible({...evidence,confidential:true},lead,db),true);
 assert.equal(visible(evidence,{...reader,active:false},db),false);
 assert.equal(canEdit(caseRecord,{...creator,permissions:{modules:{cases:{edit:false}}}},db),false);
});
test('Rollenstandards und validierte individuelle Rechte',()=>{
 assert.equal(defaults('Referendar').modules.cases.create,false);
 assert.equal(defaults('Staatsanwalt').modules.laws.edit,false);
 assert.equal(permissions({...lead,permissions:{approve:false}}).approve,false);
 assert.throws(()=>validatePermissions({modules:{invalid:{read:true}}}));
 assert.throws(()=>validatePermissions({modules:{cases:{read:'false'}}}));
 assert.throws(()=>validatePermissions({superadmin:true}));assert.equal(permissions({...lead,role:'Master',permissions:{approve:false}}).approve,true);
});

test('Gesetzbuch bleibt für alle außer Master schreibgeschützt, auch bei individuellen Freigaben',()=>{
 const law={id:'law',type:'laws',title:'Gesetz',createdBy:'l',owner:'l'},db={records:[law]};
 for(const role of ['Leitung','Staatsanwalt','Referendar','Student']){const user={id:'l',role,permissions:{modules:{laws:{read:true,create:true,edit:true}}}};assert.equal(defaults(role).modules.laws.create,false);assert.equal(permissions(user).modules.laws.create,false);assert.equal(permissions(user).modules.laws.edit,false);assert.equal(visible(law,user,db),true);assert.equal(canEdit(law,user,db),false);assert.equal(canManage(law,user,db),false);assert.equal(canComment(law,user,db),false);}
 const master={id:'m',role:'Master'};assert.equal(permissions(master).modules.laws.create,true);assert.equal(canEdit(law,master,db),true);
});
