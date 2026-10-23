/* Gemeinsame Kürzel, Validierung und Vorschau; die Nummer vergibt ausschließlich der Server. */
(function(root){
 const courts=[
 ['AG','District Court – allgemeine Zivil-/Strafsachen, 1. Instanz'],['LG','Regional Court – Berufungsinstanz, größere Zivilsachen'],['OLG','Court of Appeals – höhere Berufungsinstanz'],['BGH','Supreme Court – höchste Instanz'],['FamG','Family Court – Familiensachen'],['ArbG','Labor Court – Arbeitssachen, 1. Instanz'],['LAG','Regional Labor Court – Berufungsinstanz Arbeitssachen'],['SG','Social Court – Sozialsachen'],['FG','Tax Court – Steuersachen'],['GewG','Trade Court – Gewerbe- und Handelssachen'],['VG','Administrative Court – allgemeines Verwaltungsrecht'],['DG','Disciplinary Court – Beamtenvergehen, Disziplinarsachen'],['PK','Police Department – Ermittlungsakte (keine Gerichtsinstanz)'],['StA',"Public Prosecutor’s Office – Anklagebehörde (keine Gerichtsinstanz)"]
 ].map(([code,label])=>({code,label}));
 function initials(name){const parts=String(name||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(p=>p&&!/^(dr\.?|jur\.?|prof\.?|iur\.?)$/i.test(p)).map(p=>p.replace(/[^a-z]/gi,'')).filter(Boolean);return parts.length?(parts[0][0]+(parts.length>1?parts.at(-1)[0]:'')).toUpperCase():'';}
 function today(){const now=new Date();return {date:String(now.getDate()).padStart(2,'0')+String(now.getMonth()+1).padStart(2,'0'),year:String(now.getFullYear()).slice(-2)};}
 function normalize(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Ungültige Angaben zum Aktenzeichen.');
  const court=input.court,procedure=String(input.procedure??'').trim(),date=String(input.date??'').trim(),shortYear=String(input.year??'').trim(),code=String(input.initials??'').trim().toUpperCase();
  if(!courts.some(c=>c.code===court))throw Error('Ungültiges Gerichts- oder Behördenzeichen.');
  if(procedure&&!/^[A-Za-z][A-Za-z0-9]{0,11}$/.test(procedure))throw Error('Verfahrenskürzel: maximal zwölf Buchstaben oder Ziffern, beginnend mit einem Buchstaben.');
  if(!/^\d{2}$/.test(shortYear)&&!/^20\d{2}$/.test(shortYear))throw Error('Jahr bitte als JJ oder 20JJ eingeben.');
  const year=shortYear.length===2?2000+Number(shortYear):Number(shortYear),day=Number(date.slice(0,2)),month=Number(date.slice(2)),parsed=new Date(Date.UTC(year,month-1,day));
  if(!/^\d{4}$/.test(date)||parsed.getUTCFullYear()!==year||parsed.getUTCMonth()!==month-1||parsed.getUTCDate()!==day)throw Error('Datum bitte als gültiges TTMM für das gewählte Jahr eingeben.');
  if(!/^[A-Z]{1,6}$/.test(code))throw Error('Namenskürzel: ein bis sechs Buchstaben (A–Z).');
  return {court,procedure,date,year,initials:code};
 }
 function format(number,input,prefix=false){const v=normalize(input);if(!Number.isSafeInteger(number)||number<1)throw Error('Ungültige laufende Nummer.');return (prefix?'Az. ':'')+String(number).padStart(2,'0')+' '+v.court+(v.procedure?'-'+v.procedure:'')+' '+v.date+'/'+String(v.year).slice(-2)+'-'+v.initials;}
 const api={courts,initials,today,normalize,format};root.dojReferenceFormat=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
