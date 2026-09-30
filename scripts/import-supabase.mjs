import '../lib/env.mjs';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {createStore} from '../lib/store.mjs';
// Einmalige Übernahme einer alten data/database.json nach Supabase.
const file=path.resolve(process.argv[2]||path.join(process.env.DOJ_DATA_DIR||'data','database.json'));
const source=JSON.parse(readFileSync(file,'utf8'));
if(!Array.isArray(source.users)||!Array.isArray(source.records)||!Array.isArray(source.audit)||!source.settings)throw Error('Ungültige Datendatei.');
const store=createStore();
const remote=await store.load();
if(remote.users.length||remote.records.length||remote.audit.length)throw Error('Abbruch: Supabase enthält bereits Portal-Daten. Es wird nichts überschrieben.');
await store.save(source);
if(!isDeepStrictEqual(await store.load(),source))throw Error('Import konnte nicht bestätigt werden.');
console.log(`Import abgeschlossen: ${source.users.length} Zugänge, ${source.records.length} Einträge. Die Datei kann jetzt gesichert und gelöscht werden.`);
