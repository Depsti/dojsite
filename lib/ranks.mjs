export const ranks=[
 {id:'attorney_general',name:'Attorney General',color:'#bc6fff'},
 {id:'deputy_attorney_general',name:'Deputy Attorney General',color:'#bc6fff'},
 {id:'supervising_district_attorney',name:'Supervising District Attorney',color:'#39b99c'},
 {id:'senior_district_attorney',name:'Senior District Attorney',color:'#6da8e0'},
 {id:'district_attorney',name:'District Attorney',color:'#8ab7df'},
 {id:'assistant_district_attorney',name:'Assistant District Attorney',color:'#a1c7e9'},
 {id:'public_prosecutor_trainee',name:'Public Prosecutor Trainee',color:'#bdd2e9'}
];
export function validateRank(value){if(value===null||value==='')return null;if(typeof value!=='string'||!ranks.some(r=>r.id===value))throw Error('Ungültiger Dienstgrad.');return value;}
export const rankFor=user=>ranks.find(r=>r.id===user?.rank)||null;