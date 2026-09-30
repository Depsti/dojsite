import '../lib/env.mjs';
import {createStore} from '../lib/store.mjs';
const store=createStore();
const state=await store.load();
await store.getSession('verbindungstest');
await store.getAttempts('verbindungstest');
console.log(`Supabase erreichbar: ${state.users.length} Zugänge, ${state.records.length} Einträge. Sitzungs- und Anmeldetabellen vorhanden.`);
