import {readFileSync} from 'node:fs';
import {Document,Packer,Paragraph,TextRun,ImageRun,HeadingLevel,Header,Footer,PageNumber,Table,TableRow,TableCell,WidthType,AlignmentType,BorderStyle} from 'docx';
import {visible} from './access.mjs';
import {visibleParticipants} from './participants.mjs';
const labels={cases:'Fallakte',people:'Personenakte',evidence:'Beweismittel',documents:'Dokument',requests:'Antrag',hearings:'Verhandlung',tasks:'Aufgabe',knowledge:'Freigabeverfahren',laws:'Gesetzbuch',characters:'Charakter'};
export async function exportDocx(record,user,db){
 if(!visible(record,user,db))throw Object.assign(Error('Eintrag nicht gefunden.'),{status:404});
 const name=id=>db.users.find(u=>u.id===id)?.name||'Nicht zugewiesen';
 const stamp=value=>value?new Date(value).toLocaleString('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium',timeStyle:'short'}):'—';
 const p=(text,opts={})=>new Paragraph({children:[new TextRun(String(text||'—'))],...opts});
 const heading=text=>new Paragraph({children:[new TextRun({text:text.toUpperCase(),bold:true,font:'Georgia',size:24,color:'111111'})],keepNext:true,spacing:{before:300,after:140}});
 const prose=value=>String(value||'Keine Beschreibung hinterlegt.').split(/\r?\n/).flatMap(line=>{
  if(/^[IVXLCDM]+\.\s+\S/.test(line.trim()))return [new Paragraph({children:[],keepNext:true,spacing:{before:280,after:280,line:20},border:{bottom:{color:'8A8A8A',size:6,style:BorderStyle.SINGLE,space:0}}}),new Paragraph({children:[new TextRun({text:line.trim().toUpperCase(),bold:true,font:'Georgia',size:28,color:'111111'})],keepNext:true,spacing:{before:0,after:280}})];
  const bullet=line.match(/^\s*[•*-]\s+(.+)$/);
  if(bullet)return p(bullet[1],{bullet:{level:0},spacing:{after:80},widowControl:true});
  if(/^\s*\d+[.)]\s+/.test(line))return p(line,{indent:{left:360,hanging:360},spacing:{after:80},widowControl:true});
  return p(line||' ',{spacing:{after:line.trim()?110:180},widowControl:true});
 });
 const parent=record.caseId&&db.records.find(r=>r.id===record.caseId&&visible(r,user,db));
 const rows=[['Aktenzeichen',record.reference||parent?.reference||'—'],['Status',record.status],['Federführung',name(record.owner)],['Aktenführung',name(record.createdBy)],['Priorität',record.priority||'Normal'],['Termin / Frist',stamp(record.date)],['Erstellt',stamp(record.createdAt)],['Letzte Änderung',stamp(record.updatedAt)]];
 const children=[
  p(db.settings.serverName,{alignment:AlignmentType.CENTER,keepNext:true,spacing:{after:80}}),
  p('Aktenzeichen: '+(record.reference||parent?.reference||'—'),{alignment:AlignmentType.CENTER,keepNext:true,spacing:{after:420}}),
  new Paragraph({children:[new TextRun({text:labels[record.type]||'Aktenauszug',bold:true,size:32,font:'Georgia'})],alignment:AlignmentType.CENTER,keepNext:true,spacing:{after:160}}),
  p(record.title,{alignment:AlignmentType.CENTER,keepNext:true,spacing:{after:300}}),
  p(record.confidential?'Vertrauliches Schriftstück':'Internes Schriftstück',{alignment:AlignmentType.CENTER,spacing:{after:360}}),
  ...rows.filter(([key])=>key!=='Aktenzeichen').map(([key,value])=>new Paragraph({children:[new TextRun({text:key+': ',bold:true}),new TextRun(String(value||'—'))],spacing:{after:80},keepNext:true})),
  heading(record.type==='documents'||record.type==='requests'?'Dokumentinhalt':'Sachverhalt'),...prose(record.description)
 ];
 if(record.type==='cases'){
  children.push(heading('Beteiligte Personen'));
  const people=visibleParticipants(record,user,db);
  if(!people.length)children.push(p('Keine sichtbaren Personen zugeordnet.'));
  for(const link of people){const person=db.records.find(r=>r.id===link.personId);children.push(p(person.title+' · '+link.role,{keepNext:true}),...prose(link.note||'Kein fallbezogener Vermerk.'));}
  for(const type of ['evidence','documents','requests','hearings','tasks']){
   const linked=db.records.filter(r=>r.type===type&&r.caseId===record.id&&visible(r,user,db));if(!linked.length)continue;
   children.push(heading({evidence:'Beweismittel',documents:'Dokumente',requests:'Anträge',hearings:'Verhandlungen',tasks:'Aufgaben'}[type]));
   for(const r of linked){children.push(new Paragraph({children:[new TextRun({text:r.title,bold:true,color:'111111',font:'Georgia',size:24})],keepNext:true,spacing:{before:160,after:100}}),p(r.status+' · '+name(r.owner)),...prose(r.description));if(r.courtDecision)children.push(p('Gerichtliche Entscheidung: '+r.courtDecision.status+' · '+r.courtDecision.judge),...prose(r.courtDecision.reason),p('Auflagen: '+(r.courtDecision.conditions||'Keine')));if(r.url)children.push(p('Quelle: '+r.url));if(r.attachmentName)children.push(p('Anhang: '+r.attachmentName+' (separate Datei)'));}
  }
 }else{if(record.url)children.push(heading('Quelle'),p(record.url));if(record.attachmentName)children.push(p('Anhang: '+record.attachmentName+' (separate Datei)'));}
 const court=record.courtDecision;if(court)children.push(heading('Gerichtliche Entscheidung'),p(court.status+' · Richter/in: '+court.judge),...prose(court.reason),p('Auflagen: '+(court.conditions||'Keine')),p('Erfasst von '+court.recordedBy+' · '+stamp(court.at)));
 if(record.comments?.length){children.push(heading('Aktenvermerke'));for(const c of record.comments)children.push(p(c.user+' · '+stamp(c.at),{keepNext:true}),...prose(c.text));}
 const pending=record.submission&&record.submission.status!=='Übernommen'||['Entwurf','In Prüfung','Zurückgegeben','Vorgelegt'].includes(record.reviewStatus||record.status);
 if(pending)children.push(p('Entwurf / vorgelegt – keine Freigabe durch diesen Export.', {spacing:{before:300}}));
 children.push(new Paragraph({children:[new TextRun({text:user.name,font:'Segoe Script',italics:true,size:38,color:'173651'}),new TextRun('    '),new ImageRun({type:'png',data:readFileSync(new URL('../public/doj-stamp.png',import.meta.url)),transformation:{width:95,height:92},altText:{title:'DOJ-Stempel',description:'Department of Justice'}})],spacing:{before:220,after:120},keepNext:true}),p(user.name+' · '+user.role,{keepNext:true}),p('Ausgefertigt am '+stamp(new Date().toISOString())),p('Automatisch aus dem Namen erzeugte Unterschrift',{spacing:{after:160}}));
 return Packer.toBuffer(new Document({creator:user.name,title:record.title,styles:{default:{document:{run:{font:'Georgia',size:24,color:'111111'},paragraph:{spacing:{after:140,line:276}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1440,right:1440,bottom:1440,left:1440}}},headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'DEPARTMENT OF JUSTICE',bold:true,font:'Georgia',color:'073763',size:28})]}),p('Office of the District Attorney',{alignment:AlignmentType.CENTER})]})},footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:'Department of Justice · Seite ',size:14}),new TextRun({children:[PageNumber.CURRENT]}),new TextRun(' / '),new TextRun({children:[PageNumber.TOTAL_PAGES]})]})]})},children}]}));
}
