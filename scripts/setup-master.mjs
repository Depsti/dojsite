import {isMaster} from '../lib/ranks.mjs';
import {initializeRankAccess} from '../lib/rank-permissions.mjs';
import '../lib/env.mjs';
import {createStore} from '../lib/store.mjs';
import {issueTemporaryPassword} from '../lib/accounts.mjs';
import {randomBytes} from 'node:crypto';
const name=process.argv[2]||'Master';const store=createStore();const db=await store.load();initializeRankAccess(db);
const master=db.users.find(u=>isMaster(u));
if(master){if(master.name===name&&master.active!==false){console.log('Master-Zugang ist bereits eingerichtet.');process.exit(0);}throw Error('Ein Master existiert bereits. Keine Änderung vorgenommen.');}
let user=db.users.find(u=>u.name.toLowerCase()===name.toLowerCase());let temporaryPassword;
if(user){if(user.active===false)throw Error('Der bestehende Zugang muss aktiv sein.');user.isMaster=true;delete user.role;delete user.permissions;}else{user={id:randomBytes(12).toString('hex'),name,isMaster:true,rank:null,active:true};temporaryPassword=issueTemporaryPassword(user);db.users.push(user);}
db.audit.unshift({id:randomBytes(12).toString('hex'),at:new Date().toISOString(),user:'Serveradministration',action:'Master eingerichtet',record:name});await store.save(db);
console.log('Master-Zugang eingerichtet: '+name);if(temporaryPassword)console.log('Einmalpasswort (nur jetzt sichtbar, 24 Stunden gültig): '+temporaryPassword);else console.log('Das bestehende Passwort bleibt gültig.');
