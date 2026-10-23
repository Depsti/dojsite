import format from '../public/reference-format.js';
import {randomBytes} from 'node:crypto';
import {allowed} from './access.mjs';
export {format as referenceFormat};
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
export function nextReferenceNumber(db,year){
 let highest=Number(db.referenceCounters?.[year]||0);
 for(const item of db.referenceIssues||[])if(item.year===year)highest=Math.max(highest,item.number);
 // Bestehende Nummern dieses Formats werden beim ersten Einsatz mit berücksichtigt.
 for(const record of db.records||[]){const m=String(record.reference||'').match(/^(?:Az\.\s*)?(\d+) [A-Za-z]+(?:-[A-Za-z0-9]+)? \d{4}\/(\d{2})-[A-Z]+$/);if(m&&2000+Number(m[2])===year)highest=Math.max(highest,Number(m[1]));}
 if(!Number.isSafeInteger(highest)||highest<0||highest>=Number.MAX_SAFE_INTEGER)fail('Der Nummernkreis ist ungültig oder ausgeschöpft.');
 return highest+1;
}
export function issueReference(db,input,user,{caseId=''}={}){
 if(!allowed(user,'cases')||!allowed(user,'cases','create'))fail('Für die Vergabe fehlt das Recht, Fallakten anzulegen.',403);
 const config=format.normalize(input),requestId=input.requestId;
 if(typeof requestId!=='string'||!/^[A-Za-z0-9-]{16,100}$/.test(requestId))fail('Ungültige Vergabekennung.');
 const existing=(db.referenceIssues||[]).find(r=>r.createdBy===user.id&&r.requestId===requestId);
 if(existing){if(['court','procedure','date','year','initials'].some(k=>existing[k]!==config[k])||existing.caseId!==caseId)fail('Diese Vergabekennung wurde bereits für andere Angaben verwendet.',409);return {entry:existing,created:false};}
 const number=nextReferenceNumber(db,config.year),entry={id:randomBytes(12).toString('hex'),...config,number,reference:format.format(number,config),requestId,createdBy:user.id,createdAt:new Date().toISOString(),caseId};
 db.referenceCounters??={};db.referenceCounters[config.year]=number;db.referenceIssues??=[];db.referenceIssues.push(entry);
 return {entry,created:true};
}
