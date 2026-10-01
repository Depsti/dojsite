// DOCX wird lokal gelesen. Nur geprüfter Klartext wird an die bestehende Fallanlage übergeben.
function caseImportFromParagraphs(paragraphs,filename){
 const lines=paragraphs.map(p=>p.text.trim()).filter(Boolean);
 if(!lines.length)throw Error('Die DOCX-Datei enthält keinen lesbaren Text.');
 const text=lines.join('\n\n');if(text.length>200000)throw Error('Der Dokumenttext ist zu lang (max. 200.000 Zeichen).');
 const ignored=/^(Department of Justice|Office of the District Attorney|Aktenzeichen\s*:|Az\.|Internes Schriftstück|Vertrauliches Schriftstück|Fallakte[n]?\b|Status\s*:|Federführung\s*:|Aktenführung\s*:|Priorität\s*:|Termin\s*\/|Erstellt\s*:|Letzte Änderung\s*:)/i;
 const explicit=lines.find(x=>/^Titel\s*:/i.test(x));
 const centered=paragraphs.find(p=>p.centered&&p.text.trim()&&!ignored.test(p.text.trim())&&/^(Staat gegen|Verfahren|Ermittlung|Anklage)/i.test(p.text.trim()));
 const title=(explicit?.replace(/^Titel\s*:\s*/i,'')||centered?.text.trim()||filename.replace(/\.docx$/i,'').replace(/[_-]+/g,' ')).slice(0,300);
 return {title,description:text,confidential:lines.some(x=>/^(VERTRAULICH|Vertrauliches Schriftstück)$/i.test(x))};
}
async function readCaseDocx(file){
 if(!file||!/\.docx$/i.test(file.name))throw Error('Bitte eine DOCX-Datei auswählen.');
 if(file.size>5*1024*1024)throw Error('Die DOCX-Datei darf maximal 5 MB groß sein.');
 let zip;try{zip=await JSZip.loadAsync(await file.arrayBuffer());}catch{throw Error('Die Datei ist keine gültige DOCX-Datei oder ist passwortgeschützt.');}
 const entry=zip.file('word/document.xml');if(!entry)throw Error('In der DOCX-Datei fehlt der Dokumentinhalt.');
 if(entry._data?.uncompressedSize>2*1024*1024)throw Error('Der entpackte Dokumentinhalt ist zu groß.');
 const xml=await entry.async('string');if(xml.length>2*1024*1024)throw Error('Der Dokumentinhalt ist zu groß.');
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Nicht unterstützter Dokumentinhalt.');
 const doc=new DOMParser().parseFromString(xml,'application/xml');if(doc.querySelector('parsererror'))throw Error('Der Dokumentinhalt ist beschädigt.');
 const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
 const paragraphs=Array.from(doc.getElementsByTagNameNS(ns,'p')).map(p=>{
  const text=Array.from(p.getElementsByTagNameNS(ns,'t')).map(t=>t.textContent).join('');
  const align=p.getElementsByTagNameNS(ns,'jc')[0]?.getAttributeNS(ns,'val');
  return {text,centered:align==='center'};
 });
 return caseImportFromParagraphs(paragraphs,file.name);
}