import {createHash} from 'node:crypto';

export const emptyState = () => ({users:[],records:[],audit:[],settings:{serverName:'San Andreas',discordClientId:'',discordGuildId:''}});

// Alle Daten (Bestand, Sitzungen, Anmeldeversuche) liegen ausschließlich in Supabase.
// Kein lokaler Speicher, kein Rückfall auf Dateien. Nur der Node-Server nutzt dieses Modul – niemals in public/ importieren.
export function createStore({env=process.env, fetcher=fetch}={}) {
  const url=env.SUPABASE_URL, key=env.SUPABASE_SECRET_KEY;
  if(!url||!key) throw Error('SUPABASE_URL und SUPABASE_SECRET_KEY fehlen. Siehe .env.example.');
  if(new URL(url).protocol!=='https:') throw Error('Supabase benötigt eine HTTPS-Projekt-URL.');
  const base=new URL('/rest/v1/',url).href;
  const tokenHash=t=>createHash('sha256').update(String(t)).digest('hex');
  let revision=null;

  async function request(table,suffix='',method='GET',data,prefer='return=representation'){
    let response;
    try { response=await fetcher(base+table+suffix,{method,headers:{apikey:key,...(key.startsWith('sb_')?{}:{Authorization:`Bearer ${key}`}),'Content-Type':'application/json',Prefer:prefer},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)}); }
    catch {throw Object.assign(Error('Supabase ist nicht erreichbar. Bitte später erneut versuchen.'),{status:503});}
    if(!response.ok){const conflict=response.status===409;throw Object.assign(Error(conflict?'Der Datenbestand wurde gleichzeitig geändert. Bitte erneut versuchen.':`Supabase-Anfrage fehlgeschlagen (HTTP ${response.status}). Konfiguration und Schema prüfen.`),{status:conflict?409:503});}
    const text=await response.text();return text?JSON.parse(text):[];
  }

  return {mode:'supabase',
    // Bestand: wird bei jeder Anfrage frisch geladen, damit alle Nutzer und Instanzen denselben Stand sehen.
    async load(){const rows=await request('doj_portal_state','?id=eq.1&select=revision,payload');if(rows.length){revision=rows[0].revision;return rows[0].payload;}revision=null;return emptyState();},
    async save(data){
      const next=revision===null?1:revision+1;
      const rows=await request('doj_portal_state',revision===null?'':`?id=eq.1&revision=eq.${revision}`,revision===null?'POST':'PATCH',{id:1,revision:next,payload:data,updated_at:new Date().toISOString()});
      if(rows.length!==1)throw Object.assign(Error('Der Datenbestand wurde gleichzeitig geändert. Bitte erneut versuchen.'),{status:409});
      revision=next;
    },
    // Sitzungen: nur der SHA-256-Hash des Cookies wird gespeichert.
    async createSession(token,userId,expires){await request('doj_sessions','','POST',{token_hash:tokenHash(token),user_id:userId,expires_at:new Date(expires).toISOString()},'return=minimal');},
    async getSession(token){if(!token)return null;const rows=await request('doj_sessions',`?token_hash=eq.${tokenHash(token)}&select=user_id,expires_at`);if(!rows.length)return null;const expires=Date.parse(rows[0].expires_at);if(expires<=Date.now()){await this.deleteSession(token);return null;}return {userId:rows[0].user_id,expires};},
    async deleteSession(token){if(token)await request('doj_sessions',`?token_hash=eq.${tokenHash(token)}`,'DELETE',undefined,'return=minimal');},
    async deleteUserSessions(userId){await request('doj_sessions',`?user_id=eq.${encodeURIComponent(userId)}`,'DELETE',undefined,'return=minimal');},
    async purgeSessions(){await request('doj_sessions',`?expires_at=lt.${encodeURIComponent(new Date().toISOString())}`,'DELETE',undefined,'return=minimal');},
    // Anmeldeversuche (Sperre nach 10 Fehlversuchen) – gilt serverübergreifend.
    async getAttempts(k){const rows=await request('doj_login_attempts',`?key=eq.${encodeURIComponent(k)}&select=count,until`);return rows.length?{count:rows[0].count,until:Date.parse(rows[0].until)}:null;},
    async setAttempts(k,count,until){await request('doj_login_attempts','?on_conflict=key','POST',{key:k,count,until:new Date(until).toISOString()},'resolution=merge-duplicates,return=minimal');},
    async clearAttempts(k){await request('doj_login_attempts',`?key=eq.${encodeURIComponent(k)}`,'DELETE',undefined,'return=minimal');}
  };
}
