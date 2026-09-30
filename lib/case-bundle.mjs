import {allowed,visible,canManage,special} from './access.mjs';
import {validateParticipants,personRoles} from './participants.mjs';
import {randomBytes} from 'node:crypto';
const uid=()=>randomBytes(12).toString('hex');
const deny=message=>{throw Object.assign(Error(message),{status:403});};
export function prepareCaseBundle(input,user,db,fields){
 if(!allowed(user,'cases')||!allowed(user,'cases','create'))deny('Du darfst keine Fallakten erstellen.');
 const base=fields(input.case||{});
 if(!base.title?.trim()||base.title.length>300)throw Error('Titel der Fallakte erforderlich (max. 300 Zeichen).');
 if(base.caseId)throw Error('Eine Fallakte kann nicht untergeordnet werden.');
 if(base.owner&&base.owner!==user.id&&!special(user,'assignments'))deny('Für die Zuteilung an andere Personen fehlt das Zuteilungsrecht.');
 const now=new Date().toISOString();
 const make=(type,value)=>{
  const data=fields(value);
  if(!data.title?.trim()||data.title.length>300)throw Error('Alle neuen Einträge benötigen einen Titel (max. 300 Zeichen).');
  if(['Freigegeben','Abgelehnt'].includes(data.status)&&!special(user,'approve'))deny('Freigaben erfordern das Entscheidungsrecht.');
  return {...data,id:uid(),type,createdBy:user.id,createdAt:now,updatedAt:now,comments:[],...(['documents','requests','knowledge'].includes(type)?{reviewStatus:'Entwurf'}:{}),status:['documents','requests','knowledge'].includes(type)?'Offen':data.status||'Offen',owner:data.owner||user.id};
 };
 const record=make('cases',base);
 record.reference=`DOJ-${new Date().getFullYear()}-${String(db.records.filter(r=>r.type==='cases').length+1).padStart(4,'0')}`;
 const created=[record],relinked=[];
 const list=value=>{if(!Array.isArray(value)||value.length>100)throw Error('Maximal 100 Einträge pro Schritt.');return value;};
 const people=list(input.people||[]);
 record.participants=validateParticipants(people.filter(p=>p.personId),user,db);
 for(const p of people.filter(p=>!p.personId)){
  if(!allowed(user,'people')||!allowed(user,'people','create'))deny('Du darfst keine Personen erfassen.');
  if(!personRoles.includes(p.role)||typeof(p.note||'')!=='string'||(p.note||'').length>2000)throw Error('Ungültige Personenrolle oder Vermerk.');
  const person=make('people',{...p,personRole:p.role,caseId:record.id});created.push(person);
  record.participants.push({personId:person.id,role:p.role,note:p.note||''});
 }
 for(const type of ['evidence','documents']){
  const seen=new Set();
  for(const value of list(input[type]||[])){
   if(value.recordId){
    const existing=db.records.find(r=>r.id===value.recordId&&r.type===type);
    if(!existing||!visible(existing,user,db)||!canManage(existing,user,db))deny('Du darfst diesen Eintrag nicht zuordnen.');
    if(existing.caseId)throw Error('Dieser Eintrag gehört bereits zu einer Fallakte.');
    if(seen.has(existing.id))throw Error('Ein Eintrag darf nur einmal zugeordnet werden.');seen.add(existing.id);
    relinked.push({...existing,caseId:record.id,updatedAt:now});
   }else{
    if(!allowed(user,type)||!allowed(user,type,'create'))deny('Für neue Einträge fehlt das Bereichsrecht.');
    created.push(make(type,{...value,caseId:record.id}));
   }
  }
 }
 return {record,created,relinked};
}
