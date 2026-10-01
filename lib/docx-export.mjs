import {readFileSync} from 'node:fs';
import {Document,Packer,Paragraph,TextRun,ImageRun,HeadingLevel,Header,Footer,PageNumber,Table,TableRow,TableCell,WidthType} from 'docx';
import {visible} from './access.mjs';
import {visibleParticipants} from './participants.mjs';
const labels={cases:'Fallakte',people:'Personenakte',evidence:'Beweismittel',documents:'Dokument',requests:'Antrag',hearings:'Verhandlung',tasks:'Aufgabe',knowledge:'Freigabeverfahren',laws:'Gesetzbuch',characters:'Charakter'};
export async function exportDocx(record,user,db){
 if(!visible(record,user,db))throw Object.assign(Error('Eintrag nicht gefunden.'),{status:404});
 const name=id=>db.users.find(u=>u.id===id)?.name||'Nicht zugewiesen';
 const stamp=value=>value?new Date(value).toLocaleString('de-DE',{timeZone:'Europe/Berlin',dateStyle:'medium',timeStyle:'short'}):'—';
 const p=(text,opts={})=>new Paragraph({children:[new TextRun(String(text||'—'))],...opts});
 const heading=text=>p(text,{heading:HeadingLevel.HEADING_2,keepNext:true,spacing:{before:260,after:140}});
 const prose=value=>String(value||'Keine Beschreibung hinterlegt.').split(/\r?\n/).map(line=>p(line||' ',{spacing:{after:110},widowControl:true}));
 const parent=record.caseId&&db.records.find(r=>r.id===record.caseId&&visible(r,user,db));
 const rows=[['Aktenzeichen',record.reference||parent?.reference||'—'],['Status',record.status],['Federführung',name(record.owner)],['Aktenführung',name(record.createdBy)],['Priorität',record.priority||'Normal'],['Termin / Frist',stamp(record.date)],['Erstellt',stamp(record.createdAt)],['Letzte Änderung',stamp(record.updatedAt)]];
 const children=[p(labels[record.type]||'Aktenauszug',{heading:HeadingLevel.HEADING_2}),p(record.title,{heading:HeadingLevel.TITLE}),p(record.confidential?'VERTRAULICH':'INTERN',{spacing:{after:220}}),new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:rows.map(([key,value])=>new TableRow({children:[new TableCell({children:[p(key)]}),new TableCell({children:[p(value)]})]}))}),heading('Sachverhalt / Dokumentinhalt'),...prose(record.description)];
 if(record.type==='cases'){
  children.push(heading('Beteiligte Personen'));
  const people=visibleParticipants(record,user,db);
  if(!people.length)children.push(p('Keine sichtbaren Personen zugeordnet.'));
  for(const link of people){const person=db.records.find(r=>r.id===link.personId);children.push(p(person.title+' · '+link.role,{keepNext:true}),...prose(link.note||'Kein fallbezogener Vermerk.'));}
  for(const type of ['evidence','documents','requests','hearings','tasks']){
   const linked=db.records.filter(r=>r.type===type&&r.caseId===record.id&&visible(r,user,db));if(!linked.length)continue;
   children.push(heading({evidence:'Beweismittel',documents:'Dokumente',requests:'Anträge',hearings:'Verhandlungen',tasks:'Aufgaben'}[type]));
   for(const r of linked){children.push(p(r.title,{heading:HeadingLevel.HEADING_3,keepNext:true}),p(r.status+' · '+name(r.owner)),...prose(r.description));if(r.url)children.push(p('Quelle: '+r.url));if(r.attachmentName)children.push(p('Anhang: '+r.attachmentName+' (separate Datei)'));}
  }
 }else{if(record.url)children.push(heading('Quelle'),p(record.url));if(record.attachmentName)children.push(p('Anhang: '+record.attachmentName+' (separate Datei)'));}
 if(record.comments?.length){children.push(heading('Aktenvermerke'));for(const c of record.comments)children.push(p(c.user+' · '+stamp(c.at),{keepNext:true}),...prose(c.text));}
 const pending=record.submission&&record.submission.status!=='Übernommen'||['Entwurf','In Prüfung','Zurückgegeben','Vorgelegt'].includes(record.reviewStatus||record.status);
 if(pending)children.push(p('Entwurf / vorgelegt – keine Freigabe durch diesen Export.', {spacing:{before:300}}));
 children.push(new Paragraph({children:[new TextRun({text:user.name,font:'Segoe Script',italics:true,size:38,color:'173651'}),new TextRun('    '),new ImageRun({type:'png',data:readFileSync(new URL('../public/doj-stamp.png',import.meta.url)),transformation:{width:95,height:92},altText:{title:'DOJ-Stempel',description:'Department of Justice – State RP'}})],spacing:{before:220,after:120},keepNext:true}),p(user.name+' · '+user.role,{keepNext:true}),p('Ausgefertigt am '+stamp(new Date().toISOString())),p('Automatisch aus dem Namen erzeugte Unterschrift · RP-Dokument',{spacing:{after:160}}));
 return Packer.toBuffer(new Document({creator:user.name,title:record.title,styles:{default:{document:{run:{font:'Calibri',size:22,color:'20364B'},paragraph:{spacing:{after:130}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1100,right:1000,bottom:1100,left:1000}}},headers:{default:new Header({children:[new Paragraph({children:[new TextRun({text:'DEPARTMENT OF JUSTICE',bold:true,color:'173651',size:25})]}),p(db.settings.serverName+' · Office of the District Attorney')]})},footers:{default:new Footer({children:[new Paragraph({children:[new TextRun('DOJ · RP-Dokument     Seite '),new TextRun({children:[PageNumber.CURRENT]}),new TextRun(' / '),new TextRun({children:[PageNumber.TOTAL_PAGES]})]})]})},children}]}));
}
