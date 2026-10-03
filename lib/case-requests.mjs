import {visible,canEdit,special} from './access.mjs';
export function validateCaseRequest(input,user,db){
 if(!input||!['Haftbefehl','Durchsuchung','Sonstiger Antrag'].includes(input.kind))throw Error('Ungültige Antragsart.');
 const parent=db.records.find(r=>r.id===input.caseId&&r.type==='cases');
 if(!parent||!visible(parent,user,db))throw Object.assign(Error('Fallakte nicht zugänglich.'),{status:403});
 if(user.role!=='Student'&&!canEdit(parent,user,db))throw Object.assign(Error('Für Anträge ist Fall-Bearbeitungszugriff erforderlich.'),{status:403});
 if(!Array.isArray(input.attachmentIds)||input.attachmentIds.length>100)throw Error('Ungültige Anlagen.');
 const ids=[...new Set(input.attachmentIds)];
 for(const id of ids){const r=db.records.find(r=>r.id===id);if(!r||r.caseId!==parent.id||!['evidence','documents'].includes(r.type)||!visible(r,user,db))throw Object.assign(Error('Eine Anlage ist nicht zugänglich oder gehört nicht zu dieser Akte.'),{status:403});}
 return {kind:input.kind,attachmentIds:ids};
}
export function decideCourtRequest(record,input,user,db){
 if(record.type!=='requests'||!record.requestData||!canEdit(record,user,db)||!special(user,'approve'))throw Object.assign(Error('Für gerichtliche Entscheidungen fehlt das Entscheidungsrecht.'),{status:403});
 if(record.reviewStatus!=='Freigegeben')throw Error('Zuerst muss die interne Prüfung abgeschlossen sein.');
 if(!['Genehmigt','Teilweise genehmigt','Abgelehnt'].includes(input.status)||typeof input.reason!=='string'||!input.reason.trim()||input.reason.length>5000||typeof input.judge!=='string'||!input.judge.trim()||input.judge.length>200||typeof(input.conditions??'')!=='string'||(input.conditions||'').length>5000)throw Error('Entscheidung, Richter und Begründung erforderlich.');
 const decision={status:input.status,reason:input.reason.trim(),judge:input.judge.trim(),conditions:input.conditions||'',recordedBy:user.name,at:new Date().toISOString()};
 record.courtDecision=decision;record.courtHistory=[...(record.courtHistory||[]),decision];record.updatedAt=decision.at;
}