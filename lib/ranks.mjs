export const ranks=[
 {id:'chief_of_staff',name:'Chief of Staff',color:'#d6ad60'},
 {id:'attorney_general',name:'Attorney General',color:'#bc6fff'},
 {id:'deputy_attorney_general',name:'Deputy Attorney General',color:'#bc6fff'},
 {id:'supervising_district_attorney',name:'Supervising District Attorney',color:'#39b99c'},
 {id:'senior_district_attorney',name:'Senior District Attorney',color:'#6da8e0'},
 {id:'district_attorney',name:'District Attorney',color:'#8ab7df'},
 {id:'assistant_district_attorney',name:'Assistant District Attorney',color:'#a1c7e9'},
 {id:'public_prosecutor_trainee',name:'Public Prosecutor Trainee',color:'#bdd2e9'},
 {id:'student',name:'Student',color:'#bdd2e9'}
];
export function validateRank(value){if(value===null||value==='')return null;if(typeof value!=='string'||!ranks.some(r=>r.id===value))throw Error('Ungültiger Dienstgrad.');return value;}
export const rankFor=user=>ranks.find(r=>r.id===user?.rank)||null;
// Legacy fields are read only while upgrading old stored accounts; new accounts use ranks.
export const isMaster=user=>user?.isMaster===true||user?.role==='Master';
export function accountRank(user){if(user?.role==='Student')return 'student';return ranks.some(r=>r.id===user?.rank)?user.rank:({Leitung:'deputy_attorney_general',Staatsanwalt:'district_attorney',Referendar:'public_prosecutor_trainee',Student:'student'}[user?.role]||null);}
export const leadershipRanks=['chief_of_staff','attorney_general','deputy_attorney_general'];
export const leadership=user=>isMaster(user)||leadershipRanks.includes(accountRank(user));
export const isStudent=user=>!isMaster(user)&&accountRank(user)==='student';
export const rankLabel=user=>isMaster(user)?'Master':ranks.find(r=>r.id===accountRank(user))?.name||'Kein Dienstgrad';
const contexts=new WeakMap();
export const bindRankContext=(user,db)=>{contexts.set(user,db);return user;};
export const rankContext=user=>contexts.get(user);
