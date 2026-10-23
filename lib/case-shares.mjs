import {randomBytes,createHash} from 'node:crypto';
import {visible,canManage} from './access.mjs';
import {linksForCase} from './participants.mjs';
import {disclosureHTML} from './disclosure.mjs';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
const digest=value=>createHash('sha256').update(value).digest('hex');
const now=()=>new Date().toISOString();
function managedCase(db,user,id){const r=db.records.find(r=>r.id===id&&r.type==='cases'&&visible(r,user,db));if(!r)fail('Fallakte nicht gefunden.',404);if(!canManage(r,user,db))fail('Nur Aktenführung oder berechtigte Leitung darf öffentliche Einsichtslinks verwalten.',403);return r;}
export function canShareCase(record,user,db){return record?.type==='cases'&&canManage(record,user,db);}
export function prepareDisclosurePreview(db,user,record,input,model){
 const sections=new Set(input.sections),omit=new Set(input.omitIds),sources=[record.id,...db.records.filter(r=>r.caseId===record.id&&sections.has(r.type)&&!omit.has(r.id)&&visible(r,user,db)).map(r=>r.id)];
 if(sections.has('people'))sources.push(...linksForCase(record,db).map(p=>db.records.find(r=>r.id===p.personId&&visible(r,user,db))?.id).filter(Boolean));
 const preview={id:randomBytes(12).toString('hex'),caseId:record.id,userId:user.id,createdAt:now(),expiresAt:new Date(Date.now()+30*60000).toISOString(),mode:input.mode||'redacted',model:structuredClone(model),sources:[...new Set(sources)]};
 db.disclosurePreviews=(db.disclosurePreviews||[]).filter(p=>Date.parse(p.expiresAt)>Date.now());const mine=db.disclosurePreviews.filter(p=>p.userId===user.id);if(mine.length>=10){const oldest=mine.sort((a,b)=>a.createdAt.localeCompare(b.createdAt))[0];db.disclosurePreviews=db.disclosurePreviews.filter(p=>p!==oldest);}db.disclosurePreviews.push(preview);return {previewId:preview.id,previewExpiresAt:preview.expiresAt,canShare:canShareCase(record,user,db)};
}
function live(row,db){if(row.revokedAt||!row.model||row.expiresAt&&Date.parse(row.expiresAt)<=Date.now())return false;const creator=db.users.find(u=>u.id===row.createdBy&&u.active!==false),r=db.records.find(r=>r.id===row.caseId&&r.type==='cases');return !!creator&&!!r&&canShareCase(r,creator,db);}
function metadata(row,db){return {id:row.id,label:row.label,mode:row.mode,createdAt:row.createdAt,createdBy:row.createdBy,expiresAt:row.expiresAt||null,revokedAt:row.revokedAt||null,status:row.revokedAt?'Widerrufen':row.expiresAt&&Date.parse(row.expiresAt)<=Date.now()?'Abgelaufen':live(row,db)?'Aktiv':'Gesperrt'};}
export function caseShares(db,user,id){managedCase(db,user,id);return {shares:(db.caseShares||[]).filter(s=>s.caseId===id).slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(s=>metadata(s,db))};}
export function createCaseShare(db,user,id,input){
 managedCase(db,user,id);if(input.reviewed!==true)fail('Bitte die Vorschau vollständig prüfen und bestätigen.');
 if(typeof input.previewId!=='string'||typeof input.requestId!=='string'||!/^[a-zA-Z0-9-]{8,100}$/.test(input.requestId))fail('Ungültige Freigabekennung.');
 const days=Number(input.days);if(![0,1,7,30].includes(days)||input.days==null||input.days==='')fail('Bitte eine gültige Laufzeit wählen.');
 if(typeof(input.label||'')!=='string'||(input.label||'').length>200)fail('Bezeichnung zu lang.');
 db.caseShares??=[];if(db.caseShares.some(s=>s.createdBy===user.id&&s.requestId===input.requestId))fail('Dieser Link wurde bereits erstellt. Er wird aus Sicherheitsgründen nur einmal angezeigt. Bei Verlust bitte einen neuen Link erstellen.',409);
 const p=db.disclosurePreviews?.find(p=>p.id===input.previewId&&p.userId===user.id&&p.caseId===id&&Date.parse(p.expiresAt)>Date.now());if(!p)fail('Die Vorschau ist abgelaufen oder nicht verfügbar. Bitte erneut erzeugen.',409);
 if(p.sources.some(source=>!db.records.some(r=>r.id===source&&visible(r,user,db))))fail('Ein freizugebender Eintrag ist nicht mehr zugänglich. Bitte eine neue Vorschau erzeugen.',409);
 if(db.caseShares.filter(s=>s.caseId===id&&live(s,db)).length>=20)fail('Maximal 20 aktive Einsichtslinks pro Akte. Bitte alte Links widerrufen.');
 for(const s of db.caseShares)if(s.expiresAt&&Date.parse(s.expiresAt)<=Date.now())delete s.model;
 const token=randomBytes(32).toString('hex'),row={id:randomBytes(12).toString('hex'),caseId:id,tokenHash:digest(token),requestId:input.requestId,createdBy:user.id,createdAt:now(),label:(input.label||'Akteneinsicht').trim()||'Akteneinsicht',mode:p.mode,expiresAt:days?new Date(Date.now()+days*86400000).toISOString():null,revokedAt:null,model:structuredClone(p.model)};db.caseShares.push(row);return {...metadata(row,db),path:'/einsicht/'+token};
}
export function revokeCaseShare(db,user,id,shareId){managedCase(db,user,id);const row=db.caseShares?.find(s=>s.id===shareId&&s.caseId===id);if(!row)fail('Einsichtslink nicht gefunden.',404);if(!row.revokedAt){row.revokedAt=now();row.revokedBy=user.id;delete row.model;}return metadata(row,db);}
export function shareSnapshotHTML(db,user,id,shareId){managedCase(db,user,id);const row=db.caseShares?.find(s=>s.id===shareId&&s.caseId===id);if(!row?.model)fail('Die freigegebene Fassung ist nicht mehr verfügbar.',404);return {html:disclosureHTML(row.model)};}
export function publicCaseShare(db,token){if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))return null;const row=db.caseShares?.find(s=>s.tokenHash===digest(token));if(!row||!live(row,db))return null;const expires=row.expiresAt?new Date(row.expiresAt).toLocaleString('de-DE',{timeZone:'Europe/Berlin'}):'Widerruf';return disclosureHTML({...row.model,notice:row.model.notice+'\nSchreibgeschützte Akteneinsicht · Freigegebener Stand vom '+new Date(row.createdAt).toLocaleString('de-DE',{timeZone:'Europe/Berlin'})+' · Gültig bis '+expires+'.'}).replace('<head>','<head><meta name="robots" content="noindex,nofollow,noarchive,nosnippet">');}
export function unavailableShareHTML(){return disclosureHTML({title:'Einsicht nicht verfügbar',reference:'',createdAt:now(),notice:'Dieser Einsichtslink ist ungültig, abgelaufen oder widerrufen.',sections:[]});}
