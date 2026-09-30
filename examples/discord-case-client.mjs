// Integrate into your existing bot after checking its channel/role permissions.
// Bot environment: DOJ_PORTAL_URL and DOJ_DISCORD_IMPORT_SECRET.
export async function importDiscordCase(payload,env=process.env){
  if(!env.DOJ_PORTAL_URL||!env.DOJ_DISCORD_IMPORT_SECRET)throw Error('Portal-URL oder Import-Schlüssel fehlen.');
  const url=new URL('/api/integrations/discord/cases',env.DOJ_PORTAL_URL);
  if(url.protocol!=='https:'||url.username||url.password)throw Error('Eine HTTPS-Portal-URL ist erforderlich.');
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.DOJ_DISCORD_IMPORT_SECRET}`},body:JSON.stringify(payload),redirect:'error',signal:AbortSignal.timeout(20000)});
  const result=await response.json();if(!response.ok)throw Error(result.error||`Portal-Import fehlgeschlagen (HTTP ${response.status}).`);
  return result;
}

// Example in your existing Discord bot:
// const result = await importDiscordCase({
//   externalId: message.id,
//   title: 'Staat gegen Miller',
//   description: message.content,
//   confidential: true,
//   people: [{ name: 'Alex Miller', role: 'Beschuldigter' }]
// });
