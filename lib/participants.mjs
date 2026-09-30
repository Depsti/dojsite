import {visible} from './access.mjs';
export const personRoles=['Beschuldigter','Zeuge','Geschädigter','Verteidiger','Sonstige'];
export function linksForCase(record,db){
  const links=[...(record.participants||[])];
  // Retain old single-case person links without rewriting historical records.
  for(const p of db.records)if(p.type==='people'&&p.caseId===record.id&&!record.excludedLegacyPeople?.includes(p.id)&&!links.some(x=>x.personId===p.id))links.push({personId:p.id,role:personRoles.includes(p.personRole)?p.personRole:'Sonstige',note:''});
  return links;
}
export function validateParticipants(input,user,db){
  if(!Array.isArray(input)||input.length>100)throw Error('Maximal 100 beteiligte Personen pro Fall.');
  const seen=new Set();
  return input.map(item=>{
    const p=db.records.find(r=>r.type==='people'&&r.id===item?.personId);
    if(!p||!visible(p,user,db))throw Error('Eine Person ist nicht vorhanden oder nicht zugänglich.');
    if(seen.has(p.id))throw Error('Eine Person darf nur einmal pro Fall zugeordnet werden.');seen.add(p.id);
    if(!personRoles.includes(item.role)||typeof(item.note??'')!=='string'||(item.note||'').length>2000)throw Error('Ungültige Beteiligung oder zu langer Vermerk.');
    return {personId:p.id,role:item.role,note:item.note||''};
  });
}
export function visibleParticipants(record,user,db){
  return linksForCase(record,db).filter(link=>{const p=db.records.find(r=>r.id===link.personId&&r.type==='people');return p&&visible(p,user,db);});
}
export function relatedCases(person,user,db){
  return db.records.filter(r=>r.type==='cases'&&visible(r,user,db)).flatMap(r=>{const link=linksForCase(r,db).find(x=>x.personId===person.id);return link?[{caseId:r.id,title:r.title,reference:r.reference,role:link.role,note:link.note}]:[];});
}
