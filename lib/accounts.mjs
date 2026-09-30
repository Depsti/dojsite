import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
export const privileged=user=>['Master','Leitung'].includes(user.role);
export const student=user=>user.role==='Student';
export const canManageUser=(actor,target)=>actor.role==='Master'?true:actor.role==='Leitung'&&!['Master','Leitung'].includes(target.role);
export function validPassword(value){return typeof value==='string'&&value.length>=8&&value.length<=256;}
export function passwordMatches(user,value){if(typeof value!=='string'||value.length>256)return false;const candidate=scryptSync(value,user.salt,64);const stored=Buffer.from(user.hash,'hex');return stored.length===candidate.length&&timingSafeEqual(stored,candidate);}
export function setPassword(user,value){user.salt=randomBytes(12).toString('hex');user.hash=scryptSync(value,user.salt,64).toString('hex');}
export function issueTemporaryPassword(user){const value=randomBytes(12).toString('base64url');setPassword(user,value);user.requiresPasswordChange=true;user.temporaryPasswordExpiresAt=Date.now()+24*3600000;delete user.temporaryPasswordUsedAt;return value;}
export function temporaryLoginAllowed(user){return !user.requiresPasswordChange||!user.temporaryPasswordUsedAt&&user.temporaryPasswordExpiresAt>Date.now();}
export function markSubmission(records,user,rootId){if(!student(user))return;for(const record of records){record.submission={status:'Vorgelegt',submittedBy:user.id,submittedAt:new Date().toISOString(),groupId:rootId||record.id,originalStatus:record.status||'Offen'};record.status='Vorgelegt';}}
export function decideSubmission(root,input,user,db){
 if(!privileged(user))throw Object.assign(Error('Nur die Leitung oder der Master darf Einreichungen übernehmen.'),{status:403});
 if(root.submission?.status!=='Vorgelegt')throw Error('Diese Einreichung wartet nicht auf eine Entscheidung.');
 if(!['Übernommen','Zurückgegeben'].includes(input.status)||typeof(input.reason??'')!=='string'||(input.reason||'').length>5000)throw Error('Ungültige Entscheidung.');
 if(input.status==='Zurückgegeben'&&!input.reason?.trim())throw Error('Bitte die Rückgabe begründen.');
 const records=db.records.filter(r=>r.submission?.groupId===root.submission.groupId&&r.submission.status==='Vorgelegt');
 for(const record of records){record.submission={...record.submission,status:input.status,reason:input.reason?.trim()||'',decidedBy:user.id,decidedByName:user.name,decidedAt:new Date().toISOString()};record.status=input.status==='Übernommen'?record.submission.originalStatus:'Zurückgegeben';record.updatedAt=new Date().toISOString();}
 return records;
}
