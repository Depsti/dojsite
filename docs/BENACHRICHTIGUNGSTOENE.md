# Benachrichtigungstöne

In der Glockenansicht unter **Benachrichtigungstöne** lassen sich Chatnachrichten und allgemeine Hinweise getrennt ein- oder ausschalten. Die Lautstärke ist einstellbar; beide Töne können über die Testknöpfe angehört werden. Standard: beide eingeschaltet, 40 Prozent.

Die Einstellungen gelten persönlich pro Mitarbeiter und Browser und werden in Local Storage gespeichert. Weitere Tabs desselben Browserprofils übernehmen Änderungen. Auf anderen Geräten werden die Toneinstellungen separat gewählt.

## Verhalten

- Ein kurzer Zweiklang für neue private Nachrichten und Fallchatnachrichten; ein einzelner Ton für neue persönliche Glockenhinweise.
- Alte Hinweise beim ersten Laden, eigene Nachrichten, Bearbeitungen und nachgeladene ältere Nachrichten lösen keinen Ton aus.
- Eine Chatnachricht, die zugleich in der Glocke erscheint, erzeugt nur einen Ton. Schnell aufeinanderfolgende Hinweise werden gebündelt.
- Die Tonausgabe wird zentral im Hauptfenster gesteuert. App-Fenster geben neue Chatereignisse weiter und erzeugen keine eigenen Töne.
- Mehrere offene Portal-Tabs koordinieren die Ausgabe über Web Locks und lokale Ereignisquittungen. Ohne verfügbaren Browserspeicher ist die Deduplizierung auf den einzelnen Tab beschränkt.
- Die Glocke aktualisiert auch bei einem geöffneten Hintergrundtab. Browser können Hintergrundtimer verzögern oder inaktive Seiten anhalten. Bei geschlossenem Portal werden keine Töne ausgegeben.
- Browser benötigen in der Regel eine Nutzerinteraktion für Audio. Ein Klick im Portal oder auf einen Probeton aktiviert die Ausgabe. Es werden keine Mikrofonrechte benötigt.

## Betrieb und Prüfung

Keine zusätzlichen Railway-Variablen, Audiodateien, externen Audiodienste oder Datenbankänderungen erforderlich. Die Töne werden lokal mit Web Audio erzeugt.

`npm.cmd test` prüft die Ereigniserkennung. `npm.cmd run test:sounds` prüft im Browser die tatsächlichen Audio-Knoten, Stummschaltung, Einstellungen und die Ausgabe über mehrere Tabs. Die bestehenden Desktop- und Server-Browsertests bleiben unter `test:desktop` und `test:chat` verfügbar.

Technik: `public/notification-sounds.js`, mit Einbindung in `public/index.html`, `public/notifications.js`, `public/case-chat.js` und `public/notifications.css` sowie der statischen Freigabe in `lib/http-server.mjs`.
