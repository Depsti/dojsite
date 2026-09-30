import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const file=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.env');
// Environment variables supplied by a hosting provider take precedence.
if(existsSync(file))for(const line of readFileSync(file,'utf8').split(/\r?\n/)){
  const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if(!match||process.env[match[1]]!==undefined)continue;
  let value=match[2];
  if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);
  process.env[match[1]]=value;
}
