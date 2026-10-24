import {visible} from './access.mjs';
import {linksForCase} from './participants.mjs';
export function documentQuality(db,user,id){
 const r=db.records.find(r=>r.id===id);if(!r||!visible(r,user,db))throw Object.assign(Error('Eintrag nicht zugänglich.'),{status:404});
 const issues=[],add=(code,message,field='description',section='overview')=>issues.push({code,message,recordId:r.id,field,section});
 const text=r.description||'';if(!text.trim())add('empty','Sachverhalt / Dokumenttext fehlt.');
 const placeholders=[...new Set(text.match(/\{\{[^}\n]{1,100}\}\}|\[(?:Name|Datum|Ort|Aktenzeichen|Unterschrift|einfügen|ausfüllen)[^\]\n]{0,80}\]|\bTODO\b/gi)||[])];
 if(placeholders.length)add('placeholder','Offene Platzhalter: '+placeholders.slice(0,10).join(', '));
 const parent=r.type==='cases'?r:db.records.find(c=>c.id===r.caseId&&visible(c,user,db));
 const ids=r.attachmentIds||r.requestData?.attachmentIds||[];
 for(const aid of ids){const a=db.records.find(a=>a.id===aid);if(!a||!visible(a,user,db)||parent&&a.caseId!==parent.id)add('attachment','Eine ausgewählte Anlage fehlt oder ist für dich nicht zugänglich.','attachmentIds','documents');}
 if(parent){const attachments=db.records.filter(a=>a.caseId===parent.id&&['evidence','documents'].includes(a.type)&&a.id!==r.id&&visible(a,user,db));for(const a of attachments)if(r.type==='requests'&&a.title.length>=5&&text.toLocaleLowerCase('de').includes(a.title.toLocaleLowerCase('de'))&&!ids.includes(a.id))add('mentioned-attachment','Im Text genannte Anlage ist nicht ausgewählt: '+a.title,'attachmentIds','documents');
 const names=linksForCase(parent,db).map(p=>db.records.find(x=>x.id===p.personId&&visible(x,user,db))?.title).filter(Boolean);for(const match of text.matchAll(/^(?:Beschuldigte(?: Person)?|Betroffene(?: Person)?(?: \/ Stelle)?|Antrag gegen)\s*:\s*([^\n]+)/gim)){const name=match[1].trim();if(names.length&&name&&!/^[\[{]/.test(name)&&!name.split(/[,;]/).every(part=>names.some(n=>n.trim().toLocaleLowerCase('de')===part.trim().toLocaleLowerCase('de'))))add('person','Personenangabe mit den Beteiligten der Akte abgleichen: '+name,'description','people');}}
 if(r.type==='cases')for(const child of db.records.filter(c=>c.caseId===id&&['documents','requests'].includes(c.type)&&visible(c,user,db)))issues.push(...documentQuality(db,user,child.id).issues);
 return {recordId:id,issues,checkedAt:new Date().toISOString(),notice:'Formale Hinweise zur manuellen Prüfung. Verweise auf weitere Personen oder Akten können beabsichtigt sein.'};
}
