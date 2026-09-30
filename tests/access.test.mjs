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
 assert.equal(permissions({...lead,permissions:{approve:false}}).approve,true);
 assert.throws(()=>validatePermissions({modules:{invalid:{read:true}}}));
 assert.throws(()=>validatePermissions({modules:{cases:{read:'false'}}}));
 assert.throws(()=>validatePermissions({superadmin:true}));
});
