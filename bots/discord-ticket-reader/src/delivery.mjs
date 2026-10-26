export function backoff(attempt,random=Math.random){return Math.min(300000,1000*2**Math.min(8,attempt))+Math.round(random()*1000);}
export class Delivery {
 constructor(queue,cfg,{fetcher=fetch,log=()=>{}}={}){this.queue=queue;this.cfg=cfg;this.fetcher=fetcher;this.log=log;this.running=false;this.lastError=null;}
 async tick(){if(this.running)return;this.running=true;try{for(let i=0;i<30;i++){const row=this.queue.next();if(!row)break;let response;try{response=await this.fetcher(this.cfg.endpoint,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+this.cfg.secret,'Content-Type':'application/json'},body:JSON.stringify(row.payload),signal:AbortSignal.timeout(20000)});}catch{this.lastError='Netzwerk';this.queue.failure(row.id,{delay:backoff(row.attempts)});this.log('Portal nicht erreichbar; Übertragung bleibt gespeichert.',{channelId:row.channel_id});continue;}
  // Treat only an acknowledged portal response as delivered; redirects never receive the secret.
  const result=await response.json().catch(()=>null);if(response.ok&&(row.payload.displayVersion!==1||result?.displayVersion===1)&&typeof result?.id==='string'&&/^[a-f0-9]{24}$/.test(result.id)){this.queue.success(row.id);this.lastError=null;continue;}
  const missingDisplay=row.payload.displayVersion===1&&response.ok&&result?.displayVersion!==1;const status=response.status,permanent=[400,405,413,422].includes(status);this.lastError=missingDisplay?'WebApp-Anzeigeversion fehlt':'HTTP '+status;let delay=backoff(row.attempts);const retry=Number(response.headers.get('retry-after'));if(Number.isFinite(retry)&&retry>0)delay=Math.min(3600000,Math.max(delay,retry*1000));
  this.queue.failure(row.id,{status,permanent,delay});this.log(missingDisplay?'Neue Anzeigeversion wartet auf das WebApp-Update.':permanent?'Ereignis blockiert; nach Korrektur queue:retry ausführen.':'Portal lehnt Übertragung ab; erneuter Versuch folgt.',{status,channelId:row.channel_id});
 }}finally{this.running=false;}}
}
