import {randomBytes,createHash} from 'node:crypto';
import {allowed,visible} from './access.mjs';
import {isMaster} from './ranks.mjs';
import format from '../public/reference-format.js';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
const keys=['evidenceChannelUrl','companionIds','copnetReference','startedAt','endedAt','notes','fine','custodyUnits'];
function normalize(input,finish,db,record){
 if(!input||typeof input!=='object'||Array.isArray(input))fail('Ungültiges Protokoll.');
 for(const key of Object.keys(input))if(![...keys,'requestId','expectedUpdatedAt','finish'].includes(key))fail('Unbekanntes Protokollfeld: '+key);
 if(input.finish!==undefined&&typeof input.finish!=='boolean')fail('Ungültiger Abschluss.');
 const text=(key,max)=>{const v=input[key]??'';if(typeof v!=='string'||v.length>max)fail('Ungültige Angabe: '+key);return v.trim();};
 let url;try{url=new URL(text('evidenceChannelUrl',500));}catch{fail('Bitte einen Discord-Channellink zur Beweissicherung angeben.');}
 if(url.protocol!=='https:'||!['discord.com','www.discord.com','canary.discord.com','ptb.discord.com','discordapp.com'].includes(url.hostname)||url.port||url.username||url.password||url.search||url.hash||!/^\/channels\/\d{15,22}\/\d{15,22}\/?$/.test(url.pathname))fail('Beweissicherung benötigt einen Discord-Channellink (https://discord.com/channels/Server-ID/Kanal-ID).');
 const timestamp=(key,required)=>{const v=text(key,40);if(!v&&!required)return null;if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)||(!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,19)!==v.slice(0,19)))fail('Bitte eine gültige '+(key==='startedAt'?'Beginnzeit':'Endzeit')+' angeben.');return new Date(v).toISOString();};
 const startedAt=timestamp('startedAt',true),endedAt=timestamp('endedAt',finish);
 if(endedAt&&endedAt<startedAt)fail('Das Ende darf nicht vor dem Beginn liegen.');
 const number=(key,integer)=>{const v=input[key]??0;if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1000000000||(integer?!Number.isSafeInteger(v):Math.abs(v*100-Math.round(v*100))>0.00001))fail(integer?'Hafteinheiten müssen eine nichtnegative ganze Zahl sein.':'Geldstrafe muss ein positiver Betrag mit höchstens zwei Nachkommastellen oder 0 sein.');return v;};
 const selected=input.companionIds??record?.expeditedData?.companionIds??[];
 if(!Array.isArray(selected)||selected.length>50||selected.some(id=>typeof id!=='string'||!db.users.some(u=>u.id===id&&(u.active!==false||record?.expeditedData?.companionIds?.includes(id)))))fail('Bitte gültige Mitarbeiter als Begleitpersonen auswählen.');
 const companionIds=[...new Set(selected)].sort(),companionNames=companionIds.map(id=>({id,name:db.users.find(u=>u.id===id).name}));
 return {companionIds,companionNames,...(record?.expeditedData?.companions?{companions:record.expeditedData.companions}:{}),evidenceChannelUrl:'https://discord.com'+url.pathname.replace(/\/$/,''),copnetReference:text('copnetReference',150),startedAt,endedAt,notes:text('notes',30000),fine:number('fine',false),custodyUnits:number('custodyUnits',true)};
}
function reference(db,user,now){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
 const base='Az. EV-'+(format.initials(user.name)||'MA')+'-'+parts.year+parts.month+parts.day+'-'+parts.hour+parts.minute+parts.second;
 let result=base,n=1;while(db.records.some(r=>r.reference===result))result=base+'-'+String(++n).padStart(2,'0');return result;
}
function summary(data){return ['Beweissicherung: '+data.evidenceChannelUrl,'Begleitpersonen: '+([...(data.companionNames||[]).map(p=>p.name),data.companions].filter(Boolean).join(', ')||'—'),'CopNet-Aktenzeichen: '+(data.copnetReference||'—'),'Beginn: '+data.startedAt,'Ende: '+(data.endedAt||'offen'),'Geldstrafe: '+data.fine,'Hafteinheiten: '+data.custodyUnits,'',data.notes].join('\n');}
export function saveExpedited(db,user,input,record=null,now=new Date()){
 if(record){if(record.type!=='expedited'||!visible(record,user,db))fail('Protokoll nicht gefunden.',404);if(!allowed(user,'expedited','edit')||record.createdBy!==user.id&&!isMaster(user))fail('Nur eigene Protokolle dürfen bearbeitet werden.',403);if(record.completedAt)fail('Abgeschlossene Protokolle können nicht geändert werden.',409);if(input?.expectedUpdatedAt!==record.updatedAt)fail('Das Protokoll wurde inzwischen geändert. Bitte neu öffnen; dein Entwurf bleibt erhalten.',409);}
 else if(!allowed(user,'expedited','create')||!allowed(user,'expedited','edit'))fail('Keine Berechtigung zum Anlegen von Eilverfahren.',403);
 const data=normalize(input,input.finish===true,db,record),fingerprint=createHash('sha256').update(JSON.stringify({data,finish:!!input.finish})).digest('hex');
 if(!record){if(typeof input.requestId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(input.requestId))fail('Ungültige Anfragekennung.');const previous=db.records.find(r=>r.type==='expedited'&&r.createdBy===user.id&&r.creationRequestId===input.requestId);if(previous){if(previous.creationFingerprint!==fingerprint)fail('Diese Anfrage wurde bereits mit anderen Angaben gespeichert.',409);return {record:previous,created:false,replayed:true};}}
 const at=now.toISOString();
 if(!record){const az=reference(db,user,now);record={id:randomBytes(12).toString('hex'),type:'expedited',title:az,reference:az,createdBy:user.id,authorName:user.name,createdAt:at,comments:[],creationRequestId:input.requestId,creationFingerprint:fingerprint};db.records.push(record);}
 record.expeditedData=data;record.description=summary(data);record.status=input.finish?'Abgeschlossen':'In Bearbeitung';record.updatedAt=record.updatedAt&&at<=record.updatedAt?new Date(Date.parse(record.updatedAt)+1).toISOString():at;if(input.finish)record.completedAt=at;
 return {record,created:!input.expectedUpdatedAt,replayed:false};
}
