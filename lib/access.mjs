export const modules=['cases','people','evidence','documents','requests','laws','hearings','agreements','tasks','knowledge','characters'];
export const roles=['Leitung','Staatsanwalt','Referendar'];
export const extras=['approve','settings','audit'];
export function defaults(role){
  const leader=role==='Leitung', lawyer=role==='Staatsanwalt';
  return {modules:Object.fromEntries(modules.map(key=>[key,{read:true,create:leader||(lawyer&&key!=='laws')||key==='tasks',edit:leader||(lawyer&&key!=='laws')||key==='tasks'}])),approve:leader,settings:leader,audit:leader};
}
export function permissions(user){
  const result=defaults(user.role);
  if(user.role==='Leitung')return result;
  for(const key of modules)Object.assign(result.modules[key],user.permissions?.modules?.[key]);
  for(const key of extras)if(typeof user.permissions?.[key]==='boolean')result[key]=user.permissions[key];
  return result;
}
export const allowed=(user,module,action='read')=>user.active!==false&&!!permissions(user).modules[module]?.[action];
export const special=(user,key)=>user.active!==false&&!!permissions(user)[key];
export function validatePermissions(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Ungültige Rechtekonfiguration.');
  const result={modules:{}};
  for(const key of Object.keys(value))if(!['modules',...extras].includes(key))throw Error('Unbekanntes Recht.');
  for(const [key,flags] of Object.entries(value.modules||{})){
    if(!modules.includes(key)||!flags||typeof flags!=='object')throw Error('Unbekannter Bereich.');
    result.modules[key]={};
    for(const [flag,v] of Object.entries(flags)){if(!['read','create','edit'].includes(flag)||typeof v!=='boolean')throw Error('Ungültiges Bereichsrecht.');result.modules[key][flag]=v;}
  }
  for(const key of extras)if(key in value){if(typeof value[key]!=='boolean')throw Error('Ungültiges Sonderrecht.');result[key]=value[key];}
  return result;
}
export function caseLevel(record,user){
  if(!record||record.type!=='cases'||!allowed(user,'cases'))return 'none';
  if(user.role==='Leitung'||record.createdBy===user.id)return 'manage';
  if(record.owner===user.id)return 'edit';
  return record.access?.[user.id]||(!record.confidential?'read':'none');
}
function parentOf(record,db){return db.records.find(r=>r.id===record.caseId&&r.type==='cases');}
export function visible(record,user,db){
  if(!allowed(user,record.type))return false;
  if(record.type==='cases')return caseLevel(record,user)!=='none';
  if(record.caseId&&caseLevel(parentOf(record,db),user)==='none')return false;
  return user.role==='Leitung'||!record.confidential||record.createdBy===user.id||record.owner===user.id||caseLevel(parentOf(record,db),user)==='manage';
}
export function canManage(record,user,db){
  if(!visible(record,user,db)||!allowed(user,record.type,'edit'))return false;
  if(user.role==='Leitung')return true;
  if(record.type==='cases')return record.createdBy===user.id;
  return record.caseId?caseLevel(parentOf(record,db),user)==='manage':record.createdBy===user.id;
}
export function canEdit(record,user,db){
  if(!visible(record,user,db)||!allowed(user,record.type,'edit'))return false;
  if(user.role==='Leitung')return true;
  const level=record.type==='cases'?caseLevel(record,user):record.caseId?caseLevel(parentOf(record,db),user):null;
  return level?['edit','manage'].includes(level):true;
}
export function canComment(record,user,db){
  if(!visible(record,user,db))return false;
  if(user.role==='Leitung')return true;
  const level=record.type==='cases'?caseLevel(record,user):record.caseId?caseLevel(parentOf(record,db),user):null;
  return level?['comment','edit','manage'].includes(level):allowed(user,record.type,'edit');
}
export function publicRecord(record,user,db){
  const {access,...result}=record;
  result.capabilities={edit:canEdit(record,user,db),comment:canComment(record,user,db),manage:canManage(record,user,db)};
  if(result.capabilities.manage&&record.type==='cases')result.access=access||{};
  return result;
}
