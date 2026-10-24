/* External shortcut: CopNet keeps its own login and does not receive portal data. */
(()=>{
 const url='https://retro-roleplay.ch/copnet/';
 modules.copnet=['CopNet','↗'];
 const previousPage=page;
 page=function(){if(route!=='copnet')return previousPage();return heading('CopNet','Dein direkter Zugang zum CopNet von Retro.')+
 '<section class="panel copnet-launcher"><div class="copnet-card"><div class="copnet-mark" aria-hidden="true">CN</div><div><p class="eyebrow">EXTERNER ARBEITSPLATZ</p><h2>CopNet öffnen</h2><p>Wechsle zu CopNet, während deine Akten und Fenster im DOJ geöffnet bleiben.</p><p class="copnet-target">retro-roleplay.ch/copnet/</p><div class="actions copnet-actions"><a class="button primary" data-copnet-tab href="'+url+'" target="_blank" rel="noopener noreferrer">In neuem Tab öffnen ↗</a><button type="button" data-copnet-window>Separates Browserfenster</button></div><p class="subtitle">CopNet verwendet seine eigene Anmeldung und seine eigenen Zugriffsrechte.</p></div></div><div class="copnet-note"><strong>CopNet bleibt ein separates System.</strong><p>Die CopNet-Seite erlaubt derzeit keine Anzeige innerhalb anderer Websites. Du kannst sie über die Schaltflächen direkt aufrufen.</p><p data-copnet-status role="status"></p></div></section>';};
 const previousBind=bind;
 bind=function(){previousBind();document.querySelector('[data-copnet-window]')?.addEventListener('click',()=>{
  window.open(url,'_blank','popup=yes,width=1280,height=900,resizable=yes,scrollbars=yes,noopener,noreferrer');
  // With noopener, a successful window.open may also return null; do not report a false failure.
  const status=document.querySelector('[data-copnet-status]');if(status)status.textContent='Öffnung angefordert. Falls dein Browser das Fenster blockiert, nutze „In neuem Tab öffnen“.';
 });};
})();
