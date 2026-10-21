import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('./retro-laws.json',import.meta.url),'utf8'));
export function addMissingRetroLaws(db){
 const existing=new Set(db.records.map(r=>r.id));let added=0;
 for(const law of catalog){if(existing.has(law.id))continue;const now=new Date().toISOString();db.records.push({...law,comments:[],owner:'',createdBy:'',createdAt:now,updatedAt:now});added++;}
 return added;
}
export const retroLawCount=catalog.length;