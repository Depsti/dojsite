/* Berechnungslogik für feste, variable und abgeleitete Strafrahmen. */
(function(root){
 const roles={principal:{label:'Täterschaft',factor:1},instigator:{label:'Anstiftung (§ 7 StGB)',factor:1},joint:{label:'Mittäterschaft (§ 8 StGB)',factor:1},accessory:{label:'Beihilfe (§ 8 StGB): −20 %',factor:0.8},collective:{label:'Kollektivstrafe (§ 33 StPO)',factor:1},simulated:{label:'Vortäuschen (§ 72 StGB): wie Haupttat',factor:1}};
 function readAmount(spec,input,label,issues){
  if(spec.kind==='fixed'||spec.kind==='none'||spec.kind==='approx')return spec.value;
  if(input===undefined||input===null||String(input).trim()===''){issues.push(label+': Betrag noch festlegen ('+spec.raw+').');return null;}
  const value=Number(input);if(!Number.isFinite(value)||value<0){issues.push(label+': ungültiger Wert.');return null;}
  if(spec.kind==='range'&&(value<spec.min||value>spec.max)){issues.push(label+': Wert muss zwischen '+spec.min+' und '+spec.max+' liegen.');return null;}
  return value;
 }
 function compute(entries,selections,options={}){
  const issues=[],notes=[],lines=[];let fine=0,months=0;
  const reduction=Number(options.reduction??0),cap=options.cap===''||options.cap==null?null:Number(options.cap);
  if(!Number.isFinite(reduction)||reduction<0||reduction>100)issues.push('Milderung muss zwischen 0 und 100 % liegen.');
  if(cap!==null&&(!Number.isFinite(cap)||cap<0))issues.push('Ungültige Haftobergrenze.');
  const validReduction=Number.isFinite(reduction)&&reduction>=0&&reduction<=100?reduction:0;
  for(const selection of selections){
   const entry=entries.find(e=>e.id===selection.id);if(!entry||entry.kind!=='offense'){issues.push('Unbekannter Tatbestand.');continue;}
   const rowIssues=[];let fineSpec=entry.fine,monthsSpec=entry.months;
   if(entry.inspection){const stage=Number(selection.inspectionStage);if([1,2,3].includes(stage))fineSpec={kind:'fixed',value:stage*150000,raw:String(stage*150000)};else if(stage===4){fineSpec={kind:'manual',raw:'Ab dem 4. Monat ist kein Betrag beziffert'};notes.push(entry.name+': Ab dem 4. Monat Führerscheinentzug.');}else rowIssues.push(entry.name+': Monat der abgelaufenen Hauptuntersuchung auswählen.');}
   if(entry.variants){const variant=entry.variants.find(v=>v.id===(selection.variant||'standard'));if(!variant)rowIssues.push(entry.name+': ungültige Fallvariante.');else monthsSpec={kind:'fixed',value:variant.months,raw:String(variant.months)};}
   const f=readAmount(fineSpec,selection.fine,entry.name+' – Geldstrafe',rowIssues),m=readAmount(monthsSpec,selection.months,entry.name+' – Haft',rowIssues);
   const role=roles[selection.role||'principal'];if(!role)rowIssues.push(entry.name+': ungültige Beteiligung.');
   if(selection.attempt)notes.push(entry.name+': Versuch wird wie die vollendete Tat bewertet. Freiwilligen Abbruch gesondert beurteilen.');
   if(selection.role==='collective')notes.push(entry.name+': Beteiligung individuell feststellen; Zustimmung DOJ oder ranghöchster Beamter erforderlich.');
   if(entry.fine.kind==='approx'||entry.months.kind==='approx')notes.push(entry.name+': Enthält einen ungefähren Richtwert (≈).');
   if(/lebenslang/i.test(entry.measure))notes.push(entry.name+': '+entry.measure+'. Keine automatische Umrechnung in HE oder automatische Anordnung.');
   if(entry.book==='StGB'&&entry.paragraph==='§ 24'&&entry.name.includes('schwerer'))notes.push('Schwerer Widerstand: 15 HE enthalten den Zuschlag von 5 HE gegenüber dem Grundfall bereits.');
   const factor=(role?.factor??1)*(1-validReduction/100),resolved=rowIssues.length===0;
   const line={entry,complete:resolved,fine:f===null?null:f*factor,months:m===null?null:m*factor,issues:rowIssues};lines.push(line);issues.push(...rowIssues);
   // Eine unvollständige Position wird nicht als straflos gerechnet: Ergebnis wird ausdrücklich vorläufig.
   if(f!==null)fine+=f*factor;if(m!==null)months+=m*factor;
  }
  const rawMonths=months,validCap=cap!==null&&Number.isFinite(cap)&&cap>=0;
  if(validCap)months=Math.min(months,cap);
  // Haft niemals über die gewählte Grenze aufrunden.
  const roundedMonths=validCap?Math.min(Math.round(months),cap):Math.round(months);
  return {fine:Math.round(fine),months:roundedMonths,rawMonths,capApplied:validCap&&rawMonths>cap,count:selections.length,complete:issues.length===0,issues,notes:[...new Set(notes)],lines};
 }
 const engine={roles,compute};root.dojSentencing=engine;if(typeof module!=='undefined')module.exports=engine;
})(globalThis);
