import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=JSON.parse(readFileSync(new URL('../lib/penalty-source-20261023.json',import.meta.url),'utf8'));
const gids={StGB:1332526295,StPO:164645356,BGB:746083315,BeamtenG:1449244973,AggG:556506849,MilG:1517169779,PolG:154613940,WaffG:1589969303,BtMG:1472414944,StVO:570493125,LuVO:1630573631,GewG:1592414706,LDG:1676843563};
function amount(raw){const text=String(raw??'').trim();if(/^[\d]+$/.test(text))return {kind:'fixed',value:Number(text),raw:text};if(text==='—')return {kind:'none',value:0,raw:text};const approx=text.match(/^≈\s*(\d+)$/);if(approx)return {kind:'approx',value:Number(approx[1]),raw:text};const range=text.match(/^(\d+)\s*[-–]\s*(\d+)$/);if(range)return {kind:'range',min:Number(range[1]),max:Number(range[2]),raw:text};return {kind:'manual',raw:text||'Nicht angegeben'};}
const entries=[];
for(const sheet of source.sheets)sheet.values.slice(1).forEach((row,index)=>{
 if(!row[0])return;
 const [book,paragraph,name,description,fine,months,measure='']=row.map(x=>String(x??'').trim());
 const rule=/^(Anstiftung|Mittäterschaft|Beihilfe|Versuch|Kollektivstrafe|Gesamtstrafenbildung|Vortäuschen einer Straftat)$/.test(name);
 const cap=book==='StPO'&&name.startsWith('Haftgrenze');
 const entry={id:createHash('sha256').update([book,paragraph,name].join('|')).digest('hex').slice(0,24),book,sheet:sheet.sheet,paragraph,name,description,fine:amount(fine),months:amount(months),measure,kind:cap?'cap':rule?'rule':'offense',sourceRow:index+2,url:source.sourceUrl+'#gid='+gids[sheet.sheet]+'&range=A'+(index+2)+':G'+(index+2)};
 if(book==='StGB'&&paragraph==='§ 62')entry.variants=[{id:'standard',label:'Grundfall',months:15},{id:'severe',label:'Schwerer Fall',months:25}];
 if(book==='StVO'&&paragraph==='§ 26')entry.inspection=true;
 entries.push(entry);
});
const catalog={version:'2026-10-23',url:source.sourceUrl,entries};
writeFileSync(new URL('../public/penalty-catalog.js',import.meta.url),'/* Stand der verknüpften Strafmaßtabelle; erzeugt mit scripts/build-penalty-catalog.mjs. */\n(function(root){const catalog='+JSON.stringify(catalog,null,2)+';root.dojPenaltyCatalog=catalog;if(typeof module!=="undefined")module.exports=catalog;})(globalThis);\n');
console.log(entries.length+' Einträge aus '+source.sheets.length+' Bereichen übernommen.');
