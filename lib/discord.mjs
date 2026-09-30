import {createHash,timingSafeEqual,randomBytes} from 'node:crypto';
import {personRoles,visibleParticipants} from './participants.mjs';
import {canManage} from './access.mjs';
const error=(message,status=400)=>Object.assign(Error(message),{status});
export function authorizeImport(header,secret){
  if(!secret||secret.length<32)throw error('Discord-Import ist nicht eingerichtet.',503);
  const actual=String(header||'').replace(/^Bearer /,'');
  if(!timingSafeEqual(createHash('sha256').update(actual).digest(),createHash('sha256').update(secret).digest()))throw error('Ungültiger Import-Schlüssel.',401);
}
function text(value,max,label){if(typeof value!=='string'||!value.trim()||value.length>max)throw error(`${label} ist erforderlich (max. ${max} Zeichen).`);return value.trim();}
export function importCase(input,db,env=process.env){
  const externalId=text(input.externalId,200,'Externe Fall-ID');
  const source=String(env.DOJ_DISCORD_SOURCE||'discord');
  const existing=db.records.find(r=>r.type==='cases'&&r.importSource===source&&r.externalId===externalId);
  if(existing)return {record:existing,created:false};
  const creator=db.users.find(u=>u.id===env.DOJ_DISCORD_IMPORT_USER_ID&&u.role==='Leitung'&&u.active!==false);
  if(!creator)throw error('Für den Import muss eine aktive Leitung als Importverantwortlicher konfiguriert sein.',503);
  const title=text(input.title,300,'Falltitel');
  if(input.description!==undefined&&(typeof input.description!=='string'||input.description.length>20000))throw error('Ungültiger Sachverhalt.');
  if(input.confidential!==undefined&&typeof input.confidential!=='boolean')throw error('Ungültige Vertraulichkeit.');
  if(input.priority!==undefined&&!['Normal','Hoch','Dringend'].includes(input.priority))throw error('Ungültige Priorität.');
  const owner=input.ownerId||'';if(owner&&!db.users.some(u=>u.id===owner&&u.active!==false))throw error('Unbekannte zuständige Person.');
  const people=input.people||[];if(!Array.isArray(people)||people.length>100)throw error('Maximal 100 Personen erlaubt.');
  const now=new Date().toISOString(),id=()=>randomBytes(12).toString('hex'),newPeople=[],participants=[],seen=new Set();
  for(const item of people){
    if(!item||typeof item!=='object'||!personRoles.includes(item.role))throw error('Ungültige Personenrolle.');
    let person;if(item.personId){person=db.records.find(r=>r.type==='people'&&r.id===item.personId);if(!person)throw error('Personen-ID nicht gefunden.');}
    else{const name=text(item.name,300,'Personenname');const description=item.description??'';if(typeof description!=='string'||description.length>5000)throw error('Ungültige Personenbeschreibung.');person={id:id(),type:'people',title:name,description,status:'Offen',createdBy:creator.id,owner:creator.id,confidential:true,comments:[],createdAt:now,updatedAt:now};newPeople.push(person);}
    if(seen.has(person.id))throw error('Doppelte Personen-ID.');seen.add(person.id);
    const note=item.note??'';if(typeof note!=='string'||note.length>2000)throw error('Ungültiger Beteiligungsvermerk.');
    participants.push({personId:person.id,role:item.role,note});
  }
  const record={id:id(),type:'cases',title,description:input.description||'',status:'Offen',priority:input.priority||'Normal',confidential:input.confidential!==false,owner,createdBy:creator.id,createdAt:now,updatedAt:now,comments:[],participants,access:{},importSource:source,externalId,reference:`DOJ-${new Date().getFullYear()}-${String(db.records.filter(x=>x.type==='cases').length+1).padStart(4,'0')}`};
  // Imported profiles are scoped to the originating case by default.
  for(const p of newPeople)p.caseId=record.id;
  db.records.push(...newPeople,record);
  return {record,created:true,creator};
}
export function canSendCase(record,user,db,env=process.env){return record.type==='cases'&&canManage(record,user,db)&&(!record.confidential||env.DISCORD_ALLOW_CONFIDENTIAL==='1');}
export function buildCaseMessage(record,user,db){
  const people=visibleParticipants(record,user,db).map(p=>`${p.role}: ${db.records.find(r=>r.id===p.personId)?.title}`).join('\n');
  const trim=(s,max)=>String(s||'—').slice(0,max);
  return {username:'DOJ · Staatsanwaltschaft',allowed_mentions:{parse:[]},embeds:[{title:trim(`${record.reference} · ${record.title}`,256),description:trim(record.description,2400),color:0x163650,fields:[{name:'Status',value:trim(record.status,100),inline:true},{name:'Priorität',value:trim(record.priority||'Normal',100),inline:true},{name:'Federführung',value:trim(db.users.find(u=>u.id===record.owner)?.name||'Nicht zugewiesen',100),inline:true},{name:'Beteiligte Personen',value:trim(people||'Keine zugänglichen Personen zugeordnet.',1000)}],footer:{text:'Internes DOJ RP-Portal'},timestamp:new Date().toISOString()}]};
}
export async function sendCaseToDiscord(record,user,db,{env=process.env,fetcher=fetch}={}){
  if(!canManage(record,user,db))throw error('Nur Aktenführung und Leitung dürfen Fälle nach Discord senden.',403);
  if(record.confidential&&env.DISCORD_ALLOW_CONFIDENTIAL!=='1')throw error('Der Versand vertraulicher Fälle ist in der Serverkonfiguration gesperrt.',403);
  if(!env.DISCORD_CASE_WEBHOOK_URL)throw error('Discord-Webhook ist noch nicht eingerichtet.',503);
  let url;try{url=new URL(env.DISCORD_CASE_WEBHOOK_URL);}catch{throw error('Ungültige Discord-Webhook-Konfiguration.',503);}
  if(url.protocol!=='https:'||!['discord.com','canary.discord.com','ptb.discord.com'].includes(url.hostname)||!/^\/api\/(?:v\d+\/)?webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(url.pathname)||url.username||url.password||url.port)throw error('Ungültige Discord-Webhook-Konfiguration.',503);
  url.searchParams.set('wait','true');
  let response;try{response=await fetcher(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(buildCaseMessage(record,user,db)),redirect:'error',signal:AbortSignal.timeout(15000)});}catch{throw error('Discord ist nicht erreichbar. Bitte vor erneutem Senden den Kanal prüfen.',502);}
  if(!response.ok)throw error(response.status===429?'Discord begrenzt aktuell Nachrichten. Bitte später erneut versuchen.':`Discord-Versand fehlgeschlagen (HTTP ${response.status}).`,502);
  const message=await response.json();if(!message.id)throw error('Discord hat keine Nachrichten-ID bestätigt.',502);
  return {messageId:message.id,channelId:message.channel_id,sentAt:new Date().toISOString()};
}
