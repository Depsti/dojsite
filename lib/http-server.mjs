import './env.mjs';
import {assignRecord,claimRecord,assignmentOffers,syncPlannedHearing,reviewRecord} from './organization.mjs';
import {prepareCaseBundle} from './case-bundle.mjs';
import http from 'node:http';
import {readFileSync} from 'node:fs';
import {createStore} from './store.mjs';
import {modules,roles,defaults,permissions,validatePermissions,allowed,special,visible,canEdit,canComment,canManage,publicRecord} from './access.mjs';
import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {linksForCase,validateParticipants,visibleParticipants,relatedCases} from './participants.mjs';
import {authorizeImport,importCase,canSendCase,sendCaseToDiscord} from './discord.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const store=createStore();
let db=await store.load();
const save=()=>store.save(db);
setInterval(()=>store.purgeSessions().catch(()=>{}),3600000).unref();
const id=()=>randomBytes(12).toString('hex'),hash=(p,s)=>scryptSync(p,s,64).toString('hex');
const clean=u=>({id:u.id,name:u.name,role:u.role,active:u.active!==false,permissions:permissions(u)});
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
const requireRight=(condition,message='Für diese Aktion fehlt die Berechtigung.')=>{if(!condition)fail(message,403);};
function addUser(name,password,role){const salt=id(),u={id:id(),name,role,active:true,salt,hash:hash(password,salt)};db.users.push(u);return u;}
function log(u,action,record,recordId){db.audit.unshift({id:id(),at:new Date().toISOString(),user:u.name,userId:u.id,action,record,recordId});db.audit=db.audit.slice(0,3000);}
function serialize(record,user){
 const result=publicRecord(record,user,db);
 if(record.type==='cases'){
   result.participants=visibleParticipants(record,user,db);
   result.capabilities.sendDiscord=!!process.env.DISCORD_CASE_WEBHOOK_URL&&canSendCase(record,user,db);
 }
 if(record.type==='people')result.relatedCases=relatedCases(record,user,db);
 return result;
}
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
async function body(req,limit=8*1024*1024){let b='';for await(const c of req){b+=c;if(Buffer.byteLength(b)>limit)fail('Anfrage zu groß.',413);}const v=b?JSON.parse(b):{};if(!v||typeof v!=='object'||Array.isArray(v))fail('Ungültige Eingabe.');return v;}
function fields(b){
 const out={};
 for(const k of ['title','description','status','priority','owner','date','caseId','url','personRole','content','attachment','attachmentName'])if(k in b){if(typeof b[k]!=='string')fail('Ungültiges Textfeld.');out[k]=b[k];}
 if('hearingExpected' in b){if(typeof b.hearingExpected!=='boolean')fail('Ungültige Verhandlungsplanung.');out.hearingExpected=b.hearingExpected;}
 if('confidential' in b){if(typeof b.confidential!=='boolean')fail('Ungültige Vertraulichkeit.');out.confidential=b.confidential;}
 if(out.owner&&!db.users.some(u=>u.id===out.owner&&u.active!==false))fail('Zuständige Person ist nicht aktiv.');
 if(out.status&&!['Offen','In Bearbeitung','In Prüfung','Freigegeben','Abgelehnt','Abgeschlossen','Archiviert'].includes(out.status))fail('Ungültiger Status.');
 if(out.attachment&&!/^data:[a-zA-Z0-9.+/;-]*;base64,[A-Za-z0-9+/=]*$/.test(out.attachment))fail('Ungültiger Dateianhang.');
 for(const k of ['fine','months'])if(k in b){if(!Number.isFinite(Number(b[k]))||Number(b[k])<0)fail('Ungültiger Strafrahmen.');out[k]=Number(b[k]);}
 return out;
}
function checkParent(caseId,user,manage=false){if(!caseId)return;const p=db.records.find(r=>r.id===caseId&&r.type==='cases');requireRight(p&&(manage?canManage(p,user,db):canEdit(p,user,db)),'Du darfst dieser Fallakte keine Einträge zuordnen.');}
async function handle(req,res){
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
 try{
 const p=new URL(req.url,'http://localhost').pathname;
 if(!p.startsWith('/api/')){const files={'/':'index.html','/app.js':'app.js','/permissions.js':'permissions.js','/case-people.js':'case-people.js','/case-wizard.js':'case-wizard.js','/case-print.js':'case-print.js','/case-print.css':'case-print.css','/organization.js':'organization.js','/styles.css':'styles.css','/doj-theme.css':'doj-theme.css','/favicon.svg':'favicon.svg'};if(!files[p])return send(res,404,{error:'Nicht gefunden'});res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(files[p])]);return res.end(readFileSync(path.join(root,'public',files[p])));}
 if(!['GET','HEAD'].includes(req.method)&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)fail('Ungültiger Ursprung.',403);
 if(p==='/api/integrations/discord/cases'&&req.method==='POST'){
   authorizeImport(req.headers.authorization,process.env.DOJ_DISCORD_IMPORT_SECRET);
   const payload=await body(req,1024*1024);db=await store.load();
   const result=importCase(payload,db);
   if(result.created){log(result.creator,'Aus Discord importiert',result.record.title,result.record.id);await save();}
   return send(res,result.created?201:200,{id:result.record.id,reference:result.record.reference,created:result.created});
 }
 db=await store.load();
 const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('doj_session='))?.slice(12),session=await store.getSession(token),user=session?db.users.find(u=>u.id===session.userId&&u.active!==false):null;
 if(p==='/api/session')return send(res,200,{user:user?clean(user):null,setup:!db.users.length});
 if(p==='/api/setup'&&req.method==='POST'){const b=await body(req);if(db.users.length)fail('Bereits eingerichtet.',409);if(typeof b.name!=='string'||!b.name.trim()||typeof b.password!=='string'||b.password.length<12)fail('Name und Passwort mit mindestens 12 Zeichen erforderlich.');addUser(b.name.trim(),b.password,'Leitung');await save();return send(res,201,{ok:true});}
 if(p==='/api/login'&&req.method==='POST'){
 const key=req.socket.remoteAddress,now=Date.now(),a=await store.getAttempts(key);if(a&&a.count>=10&&a.until>now)fail('Zu viele Versuche. Bitte in 15 Minuten erneut versuchen.',429);
 const b=await body(req),u=db.users.find(u=>u.name.toLowerCase()===String(b.name).toLowerCase());
 if(!u||u.active===false||typeof b.password!=='string'||!timingSafeEqual(Buffer.from(u.hash,'hex'),Buffer.from(hash(b.password,u.salt),'hex'))){await store.setAttempts(key,a&&a.until>now?a.count+1:1,now+900000);fail('Name oder Passwort ist falsch oder der Zugang ist gesperrt.',401);}
 log(u,'Angemeldet','Portal');await save();await store.clearAttempts(key);const t=randomBytes(32).toString('hex');await store.createSession(t,u.id,now+8*3600000);res.setHeader('Set-Cookie',`doj_session=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.DOJ_SECURE_COOKIE==='1'?'; Secure':''}`);return send(res,200,{user:clean(u)});}
 if(!user)fail('Bitte anmelden.',401);
 if(p==='/api/logout'&&req.method==='POST'){await store.deleteSession(token);res.setHeader('Set-Cookie','doj_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(res,200,{ok:true});}
 if(p==='/api/state'){
 const records=db.records.filter(r=>visible(r,user,db));
 const audit=db.audit.filter(a=>a.recordId?records.some(r=>r.id===a.recordId)&&(special(user,'audit')||a.userId===user.id):special(user,'audit')||a.userId===user.id||a.user===user.name);
 return send(res,200,{user:clean(user),users:db.users.map(u=>user.role==='Leitung'?clean(u):{id:u.id,name:u.name,role:u.role,active:u.active!==false}),records:records.map(r=>serialize(r,user)),audit,settings:db.settings,assignmentOffers:assignmentOffers(user,db),roleDefaults:Object.fromEntries(roles.map(r=>[r,defaults(r)])),integrations:{discord:{outboundConfigured:!!process.env.DISCORD_CASE_WEBHOOK_URL,inboundConfigured:!!process.env.DOJ_DISCORD_IMPORT_USER_ID&&(process.env.DOJ_DISCORD_IMPORT_SECRET||'').length>=32,allowConfidential:process.env.DISCORD_ALLOW_CONFIDENTIAL==='1'}}});}
 if(p==='/api/users'&&req.method==='POST'){
 requireRight(user.role==='Leitung','Nur die Leitung kann Zugänge erstellen.');const b=await body(req);if(typeof b.name!=='string'||!b.name.trim()||typeof b.password!=='string'||b.password.length<12||!roles.includes(b.role))fail('Name, Rolle und Passwort (mindestens 12 Zeichen) erforderlich.');if(db.users.some(u=>u.name.toLowerCase()===b.name.trim().toLowerCase()))fail('Name bereits vergeben.',409);const custom=b.permissions?validatePermissions(b.permissions):undefined;const u=addUser(b.name.trim(),b.password,b.role);if(custom)u.permissions=custom;log(user,'Zugang angelegt',u.name);await save();return send(res,201,clean(u));}
 const userMatch=p.match(/^\/api\/users\/([a-f0-9]+)$/);
 if(userMatch&&req.method==='PUT'){
 requireRight(user.role==='Leitung','Nur die Leitung kann Mitarbeiterrechte ändern.');const target=db.users.find(u=>u.id===userMatch[1]);if(!target)fail('Mitarbeiter nicht gefunden.',404);const b=await body(req),next={...target};
 if('role' in b){if(!roles.includes(b.role))fail('Ungültige Rolle.');next.role=b.role;if(b.role!==target.role)delete next.permissions;}
 if('active' in b){if(typeof b.active!=='boolean')fail('Ungültiger Zugangsstatus.');next.active=b.active;}
 if('permissions' in b)next.permissions=validatePermissions(b.permissions);
 if(!db.users.some(u=>{const x=u.id===next.id?next:u;return x.role==='Leitung'&&x.active!==false;}))fail('Mindestens eine aktive Leitung muss erhalten bleiben.',409);
 Object.assign(target,next);if(!next.permissions)delete target.permissions;
 log(user,'Mitarbeiterrechte geändert',`${target.name} · ${target.role} · ${target.active===false?'Gesperrt':'Aktiv'}`);await save();if(target.active===false)await store.deleteUserSessions(target.id);return send(res,200,clean(target));}
 if(p==='/api/settings'&&req.method==='PUT'){requireRight(special(user,'settings'));const b=await body(req);db.settings={...db.settings,serverName:String(b.serverName||'San Andreas').slice(0,100),discordClientId:String(b.discordClientId||''),discordGuildId:String(b.discordGuildId||'')};log(user,'Einstellungen geändert','Portal');await save();return send(res,200,{ok:true});}
 if(p==='/api/cases/bundle'&&req.method==='POST'){
  const input=await body(req);
  if(input.requestId!==undefined&&(typeof input.requestId!=='string'||!/^[a-zA-Z0-9-]{16,100}$/.test(input.requestId)))fail('Ungültige Entwurfskennung.');
  const existing=input.requestId&&db.records.find(r=>r.type==='cases'&&r.createdBy===user.id&&r.bundleRequestId===input.requestId);
  if(existing){requireRight(visible(existing,user,db));return send(res,200,serialize(existing,user));}
  const plan=prepareCaseBundle(input,user,db,fields);
  if(input.requestId)plan.record.bundleRequestId=input.requestId;
  db.records=db.records.map(r=>plan.relinked.find(x=>x.id===r.id)||r);
  db.records.push(...plan.created);syncPlannedHearing(plan.record,db);
  for(const r of plan.created)log(user,'Erstellt',r.title,r.id);
  for(const r of plan.relinked)log(user,'Fall zugeordnet',r.title,r.id);
  await save();return send(res,201,serialize(plan.record,user));
 }
 if(p==='/api/records'&&req.method==='POST'){
 const b=await body(req);if(!modules.includes(b.type)||!String(b.title||'').trim())fail('Titel und gültiger Bereich erforderlich.');requireRight(allowed(user,b.type)&&allowed(user,b.type,'create'));
 if(['Freigegeben','Abgelehnt'].includes(b.status))requireRight(special(user,'approve'),'Freigaben erfordern das Entscheidungsrecht.');
 if(['cases','hearings'].includes(b.type)&&b.owner&&b.owner!==user.id)requireRight(special(user,'assignments'),'Für die Zuteilung an andere Personen fehlt das Zuteilungsrecht.');
 if(b.type==='cases'&&b.caseId)fail('Fallakten können nicht untergeordnet werden.');checkParent(b.caseId,user);
 const r={...fields(b),type:b.type,id:id(),createdBy:user.id,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),comments:[],status:b.status||'Offen'};if(r.type==='cases')r.reference=`DOJ-${new Date().getFullYear()}-${String(db.records.filter(x=>x.type==='cases').length+1).padStart(4,'0')}`;
 if(['knowledge','requests','documents'].includes(r.type)){r.reviewStatus='Entwurf';r.status='Offen';}db.records.push(r);syncPlannedHearing(r,db);log(user,'Erstellt',r.title,r.id);await save();return send(res,201,serialize(r,user));}
 const match=p.match(/^\/api\/records\/([a-f0-9]+)(?:\/(comments|access|participants|discord|assignment|claim|review))?$/);
 if(match){
 const r=db.records.find(x=>x.id===match[1]);
 if(req.method==='POST'&&match[2]==='claim'){
  if(!r)fail('Eintrag nicht gefunden.',404);claimRecord(r,user,db);log(user,'Selbst übernommen',r.title,r.id);await save();return send(res,200,serialize(r,user));
 }
 if(!r||!visible(r,user,db))fail('Eintrag nicht gefunden.',404);
 if(req.method==='PUT'&&match[2]==='assignment'){assignRecord(r,await body(req),user,db);log(user,'Zuteilung geändert',r.title,r.id);await save();return send(res,200,serialize(r,user));}
 if(req.method==='POST'&&match[2]==='review'){reviewRecord(r,await body(req),user,db);log(user,'Freigabeverfahren: '+r.reviewStatus,r.title,r.id);await save();return send(res,200,serialize(r,user));}
 if(req.method==='PUT'&&match[2]==='participants'){
   requireRight(r.type==='cases'&&canEdit(r,user,db),'Für die Personenzuordnung wird Fall-Bearbeitungsrecht benötigt.');
   const b=await body(req),selected=validateParticipants(b.participants,user,db);
   const hidden=linksForCase(r,db).filter(link=>{const person=db.records.find(p=>p.type==='people'&&p.id===link.personId);return person&&!visible(person,user,db);});
   r.participants=[...hidden,...selected];
   r.excludedLegacyPeople=db.records.filter(p=>p.type==='people'&&p.caseId===r.id&&!r.participants.some(x=>x.personId===p.id)).map(p=>p.id);
   r.updatedAt=new Date().toISOString();log(user,'Beteiligte Personen geändert',r.title,r.id);await save();return send(res,200,serialize(r,user));
 }
 if(req.method==='POST'&&match[2]==='discord'){
   requireRight(r.type==='cases'&&canManage(r,user,db),'Nur Aktenführung und Leitung dürfen Fälle nach Discord senden.');
   const sent=await sendCaseToDiscord(r,user,db);r.discord=sent;log(user,'Nach Discord gesendet',r.title,r.id);
   try{await save();}catch{fail('Discord hat die Nachricht erhalten, aber die Bestätigung konnte nicht gespeichert werden. Bitte nicht erneut senden.',502);}
   return send(res,200,{ok:true,...sent});
 }
 if(req.method==='PUT'&&match[2]==='access'){
 requireRight(r.type==='cases'&&canManage(r,user,db),'Nur Fallersteller und Leitung dürfen Fallzugriffe verwalten.');const b=await body(req);if(typeof b.confidential!=='boolean'||!b.access||typeof b.access!=='object'||Array.isArray(b.access))fail('Ungültige Fallrechte.');
 const access={};for(const [person,level] of Object.entries(b.access)){if(!db.users.some(u=>u.id===person)||!['read','comment','edit'].includes(level))fail('Ungültige Person oder Zugriffsstufe.');access[person]=level;}
 const owner=b.owner??r.owner??'';if(typeof owner!=='string'||(owner&&!db.users.some(u=>u.id===owner&&u.active!==false)))fail('Ungültige Zuständigkeit.');Object.assign(r,{access,confidential:b.confidential,owner,updatedAt:new Date().toISOString()});log(user,'Fallzugriffe geändert',r.title,r.id);await save();return send(res,200,serialize(r,user));}
 if(req.method==='POST'&&match[2]==='comments'){requireRight(canComment(r,user,db),'Du hast für diesen Eintrag nur Leserechte.');const b=await body(req);if(typeof b.text!=='string'||!b.text.trim())fail('Kommentar ist leer.');r.comments.push({id:id(),user:user.name,text:b.text.slice(0,5000),at:new Date().toISOString()});log(user,'Kommentiert',r.title,r.id);await save();return send(res,200,serialize(r,user));}
 if(req.method==='PUT'&&!match[2]){
 requireRight(canEdit(r,user,db),'Du darfst diesen Eintrag nicht bearbeiten.');const b=await body(req);
 if(b.status!==r.status&&['Freigegeben','Abgelehnt'].includes(b.status))requireRight(special(user,'approve'),'Freigaben erfordern das Entscheidungsrecht.');if(!String(b.title||'').trim())fail('Titel erforderlich.');
 if(['cases','hearings'].includes(r.type)&&'owner' in b&&b.owner!==(r.owner||''))requireRight(special(user,'assignments'),'Für die Änderung der Zuteilung fehlt das Zuteilungsrecht.');
 if(('owner' in b&&b.owner!==(r.owner||''))||('confidential' in b&&b.confidential!==!!r.confidential)||('caseId' in b&&b.caseId!==(r.caseId||'')))requireRight(canManage(r,user,db),'Nur die Aktenverwaltung darf Zugriff und Zuordnung ändern.');
 if(b.caseId!==(r.caseId||'')&&'caseId' in b){if(r.type==='cases'&&b.caseId)fail('Fallakten können nicht untergeordnet werden.');checkParent(b.caseId,user,true);}
 if(['knowledge','requests','documents'].includes(r.type)&&['In Prüfung','Freigegeben'].includes(r.reviewStatus||r.status))fail('Während oder nach der Prüfung kann der Inhalt nicht geändert werden.');
 if(['knowledge','requests','documents'].includes(r.type)&&b.status!==undefined&&b.status!==r.status)fail('Bitte den Status über das Freigabeverfahren ändern.');
 if(['knowledge','requests','documents'].includes(r.type)&&(b.title!==r.title||b.description!==undefined&&b.description!==r.description)){r.reviewHistory=[...(r.reviewHistory||[]),{from:r.reviewStatus||'Entwurf',to:r.reviewStatus||'Entwurf',reason:'Inhalt überarbeitet',user:user.name,userId:user.id,at:new Date().toISOString(),previous:{title:r.title,description:r.description||''}}];}
 Object.assign(r,fields(b),{updatedAt:new Date().toISOString()});if(r.type==='hearings')r.autoPlanned=false;syncPlannedHearing(r,db);log(user,'Bearbeitet',r.title,r.id);await save();return send(res,200,serialize(r,user));}
 }
 return send(res,404,{error:'Funktion nicht gefunden.'});
 }catch(e){res.removeHeader('Set-Cookie');send(res,e.status||400,{error:e instanceof SyntaxError?'Ungültige Eingabe.':e.message});}
}
let queue=Promise.resolve();
const server=http.createServer((req,res)=>{queue=queue.then(()=>handle(req,res)).catch(()=>{if(!res.writableEnded)send(res,500,{error:'Interner Serverfehler.'});});});
server.requestTimeout=30000;
server.listen(Number(process.env.PORT||3000),process.env.HOST||'127.0.0.1',()=>console.log(`DOJ-Portal: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3000}`));
export {server};
