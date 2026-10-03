import {allowed,special,visible,canEdit,canManage} from './access.mjs';
import {randomBytes} from 'node:crypto';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
export function eligibleForClaim(user,record,db){
 if(!['cases','hearings'].includes(record.type)||!allowed(user,'tasks')||!['Master','Leitung','Staatsanwalt'].includes(user.role)||!special(user,'selfAssign')||!allowed(user,record.type)||!allowed(user,record.type,'edit'))return false;
 return record.type!=='hearings'||!record.caseId||allowed(user,'cases','edit')&&allowed(user,'cases')&&db.records.some(r=>r.id===record.caseId&&r.type==='cases');
}
export function assignmentOffers(user,db){return db.records.filter(r=>['cases','hearings'].includes(r.type)&&r.openForClaim&&r.status!=='Archiviert'&&eligibleForClaim(user,r,db)).map(r=>({id:r.id,type:r.type,title:r.title,reference:r.reference||'',date:r.date||''}));}
export function assignRecord(record,input,user,db){
 if(!['cases','hearings'].includes(record.type)||!special(user,'assignments')||!canEdit(record,user,db))fail('Für diese Zuteilung fehlt die Berechtigung.',403);
 if(!Array.isArray(input.assignedProsecutors)||input.assignedProsecutors.length>30||typeof input.openForClaim!=='boolean')fail('Ungültige Zuteilung.');
 const ids=[...new Set(input.assignedProsecutors)];
 for(const id of ids){const target=db.users.find(u=>u.id===id&&u.active!==false);if(!target||!['Leitung','Staatsanwalt'].includes(target.role)||!allowed(target,record.type)||!allowed(target,record.type,'edit')||(record.caseId&&(!allowed(target,'cases')||!allowed(target,'cases','edit'))))fail('Eine ausgewählte Person hat nicht die erforderlichen Bereichsrechte.');}
 // Preserve manually granted case rights; assignment rights are computed from the lists.
 if(record.type==='hearings')record.autoPlanned=false;record.assignedProsecutors=ids;record.owner=ids[0]||'';record.openForClaim=input.openForClaim;record.updatedAt=new Date().toISOString();
}
export function claimRecord(record,user,db){
 if(!record.openForClaim||record.status==='Archiviert')fail('Dieser Eintrag steht nicht mehr zur Übernahme bereit.',409);
 if(!eligibleForClaim(user,record,db))fail('Du darfst diesen Eintrag nicht übernehmen.',403);
 if(record.type==='hearings')record.autoPlanned=false;record.assignedProsecutors=[...new Set([...(record.assignedProsecutors||[]),user.id])];record.owner=record.owner||user.id;record.openForClaim=false;record.updatedAt=new Date().toISOString();
}
export function syncPlannedHearing(record,db){
 if(record.type!=='cases'||record.submission&&record.submission.status!=='Übernommen')return;
 const hearings=db.records.filter(r=>r.type==='hearings'&&r.caseId===record.id);
 if(record.hearingExpected&&!hearings.some(r=>r.status!=='Archiviert'))db.records.push({id:randomBytes(12).toString('hex'),type:'hearings',caseId:record.id,title:'Verhandlung · '+record.title,description:'',status:'Offen',owner:'',assignedProsecutors:[],autoPlanned:true,createdBy:record.createdBy,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),comments:[],date:''});
 if(!record.hearingExpected)db.records=db.records.filter(r=>!(r.type==='hearings'&&r.caseId===record.id&&r.autoPlanned&&!r.date&&!r.description&&!r.comments?.length));
}
export function reviewRecord(record,input,user,db){
 if(!['knowledge','requests','documents'].includes(record.type)||!canEdit(record,user,db))fail('Für dieses Freigabeverfahren fehlt der Bearbeitungszugriff.',403);
 const current=record.reviewStatus||(['Freigegeben','In Prüfung'].includes(record.status)?record.status:'Entwurf'),next=input.status;
 const transition={Entwurf:['In Prüfung'],'In Prüfung':['Freigegeben','Zurückgegeben',...(record.type==='requests'?['Abgelehnt']:[])],Zurückgegeben:['In Prüfung'],Freigegeben:[]};
 if(!transition[current]?.includes(next))fail('Ungültiger Wechsel im Freigabeverfahren.');
 const decision=['Freigegeben','Zurückgegeben','Abgelehnt'].includes(next);
 if(decision&&!special(user,'approve'))fail('Nur Personen mit Entscheidungsrecht dürfen die Prüfung abschließen.',403);
 if(typeof(input.reason??'')!=='string'||(input.reason||'').length>5000)fail('Ungültige Begründung.');
 if(decision&&!input.reason?.trim())fail('Bitte eine Begründung zur Entscheidung angeben.');
 record.reviewStatus=next;record.status=next==='Zurückgegeben'?'In Bearbeitung':next;
 record.reviewHistory=[...(record.reviewHistory||[]),{from:current,to:next,reason:input.reason?.trim()||'',user:user.name,userId:user.id,at:new Date().toISOString()}];record.updatedAt=new Date().toISOString();
}
