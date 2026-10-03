import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const ctx=vm.createContext({applyDetailAccess(){},editor(){}});
vm.runInContext(readFileSync(new URL('../public/case-requests.js',import.meta.url),'utf8'),ctx);
test('Antrag: markierte Zeilen als Liste formatieren und Absatz an Cursor einfügen',()=>{
 const value='Vorwort\nErster Punkt\nZweiter Punkt\nSchluss';
 const result=ctx.formatRequestText(value,8,32,'bullets');assert.equal(result.value,'Vorwort\n• Erster Punkt\n• Zweiter Punkt\nSchluss');
 const numbered=ctx.formatRequestText(result.value,8,36,'numbered');assert.match(numbered.value,/1\. Erster Punkt\n2\. Zweiter Punkt/);
 assert.equal(ctx.formatRequestText('AB',1,1,'paragraph').value,'A\n\nB');
 assert.equal(ctx.formatRequestText('',0,0,'bullets').value,'• ');
});