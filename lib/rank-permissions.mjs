import {ranks,validateRank,isMaster,accountRank,bindRankContext,leadership,rankLabel} from './ranks.mjs';
import {defaults,rankPermissions,validatePermissions,modules,extras} from './access.mjs';
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
function differences(value,base){const result={modules:{}};for(const key of modules)for(const flag of ['read','create','edit'])if(typeof value?.modules?.[key]?.[flag]==='boolean'&&value.modules[key][flag]!==base.modules[key][flag])(result.modules[key]??={})[flag]=value.modules[key][flag];for(const key of extras)if(typeof value?.[key]==='boolean'&&value[key]!==base[key])result[key]=value[key];return result;}
export function initializeRankAccess(db){let changed=false;if(db.accountSchemaVersion>2)fail('Der Datenbestand benötigt eine neuere Portalversion.',503);db.rankProfiles??={};
 for(const user of db.users){
  if(Object.hasOwn(user,'role')){const legacy=user.role,old=defaults(legacy);user.isMaster=isMaster(user);user.rank=accountRank(user)||(!user.isMaster?'public_prosecutor_trainee':null);if(user.permissions)user.permissions=differences(user.permissions,old);delete user.role;changed=true;}
  bindRankContext(user,db);
 }
 if(db.accountSchemaVersion!==2){db.accountSchemaVersion=2;changed=true;}
 return changed;
}
export function profileSnapshot(db){return {profiles:ranks.map(rank=>({...rank,permissions:rankPermissions(rank.id,db),updatedAt:db.rankProfiles?.[rank.id]?.updatedAt||null}))};}
export function updateRankProfile(db,actor,id,input){
 if(actor.active===false||!leadership(actor))fail('Nur Chief of Staff, Attorney General, Deputy Attorney General und Master verwalten Dienstgradrechte.',403);
 validateRank(id);if(!id)fail('Dienstgrad erforderlich.');
 const previous=db.rankProfiles?.[id];if(input.expectedUpdatedAt!==(previous?.updatedAt||null))fail('Das Dienstgradprofil wurde inzwischen geändert. Bitte neu laden.',409);
 const value=validatePermissions(input.permissions);if(Object.keys(value.modules).length!==modules.length||modules.some(k=>['read','create','edit'].some(a=>typeof value.modules[k]?.[a]!=='boolean'))||extras.some(k=>typeof value[k]!=='boolean'))fail('Vollständiges Rechteprofil erforderlich.');
 db.rankProfiles??={};db.rankProfiles[id]={permissions:value,updatedAt:new Date(Math.max(Date.now(),Date.parse(previous?.updatedAt||0)+1||0)).toISOString(),updatedBy:actor.id};
 // Rebind also supports callers that operate on state directly, outside HTTP.
 for(const u of db.users)bindRankContext(u,db);
 return profileSnapshot(db).profiles.find(p=>p.id===id);
}
export function validateAccountRank(value,{master=false}={}){const rank=validateRank(value);if(!rank&&!master)fail('Bitte einen Dienstgrad auswählen.');return rank;}
export {rankLabel};
