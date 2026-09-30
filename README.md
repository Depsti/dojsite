# DOJ – Internes RP-Portal

## Starten

1. Node.js ab Version 20 installieren, falls noch nicht vorhanden, und Supabase gemäß `docs/SUPABASE.md` konfigurieren.
2. `start.cmd` doppelt anklicken (alternativ `npm start`).
3. http://localhost:3000 im Browser öffnen.
4. Beim ersten Aufruf einen Leitungszugang mit mindestens 12 Passwortzeichen erstellen.

Das Serverfenster muss geöffnet bleiben. Keine Installation zusätzlicher Pakete erforderlich. Die eigentliche Website liegt in `public/index.html`, `public/styles.css` und `public/app.js`. Die `index.html` im Hauptordner enthält den Einstieg zum lokalen Portal.

## Enthalten

- Dashboard mit aktuellen Akten, Aufgaben, Freigaben und Terminen
- Fallakten mit automatischen Aktenzeichen, Zuständigkeit und Vertraulichkeit
- Personen in mehreren Verfahren mit fallbezogener Rolle und Vermerken, Beweise mit Datei-Anhang (max. 5 MB) und Quellenlinks
- Dokumente, Anträge, Vergleiche, Kommentare und PDF-Ausgabe über den Browserdruck
- Anklage-, Haftbefehls- und Einstellungsvorlagen; eigene Vorlagen im Wissensbereich
- Editierbares RP-Gesetzbuch und Strafmaßrechner mit Milderung und Haftobergrenze
- Termine, Aufgaben, Wissensbereich, Charakterverzeichnis und Archiv
- Mitarbeiterzugänge, Leitungsfreigaben, Änderungsprotokoll und Einstellungen
- Suche und Statusfilter; responsive Darstellung
- Fallversand nach Discord und geschützter Bot-Import mit Duplikatschutz; Einrichtung in [docs/PERSONEN-DISCORD.md](docs/PERSONEN-DISCORD.md)

Neue Einträge werden über „Eintrag erstellen“ angelegt. Ein Klick auf einen Eintrag öffnet die Details. Über „Bearbeiten“ können Status, Frist und Zuordnung geändert werden. Zum Archivieren den Status „Archiviert“ wählen, zur Wiederaufnahme einen anderen Status. Dokumente lassen sich über „Als PDF drucken“ als PDF speichern.

## Zugriffsmodell

Die erste Person erhält die Rolle Leitung. Unter Mitarbeiter kann die Leitung Zugänge, Dienstrollen, Bereichsrechte und Sonderrechte verwalten. Fallersteller und Leitung verwalten unter Fallzugriffe das Fallteam; Federführung und freigegebene Mitarbeiter können im Rahmen ihrer Bereichsrechte bearbeiten. Verknüpfte Einträge erfordern ebenfalls den Fallzugriff; zusätzliche Vertraulichkeit bleibt bestehen. Personenverknüpfungen werden nur für zugängliche Personen und Fälle angezeigt. Charaktere sind Verzeichniseinträge, keine getrennten Anmeldesitzungen.

## Datenspeicherung

Die Speicherung erfolgt ausschließlich in Supabase. Einrichtung und Datenübernahme stehen in [docs/SUPABASE.md](docs/SUPABASE.md). Die Vorlage `.env.example` enthält keine Zugangsdaten. `.env` und alte lokale Daten werden durch Git ignoriert.

Der Bestand einschließlich Anhängen liegt als JSONB in `doj_portal_state`; gemeinsame Sitzungen und Anmeldesperren liegen in eigenen Supabase-Tabellen. Passwörter werden mit Salt und scrypt gehasht, Sitzungs-Cookies nur als Hash gespeichert. Sitzungen laufen nach acht Stunden ab und überleben Serverneustarts. Revisionsprüfungen verhindern verlorene Änderungen zwischen Instanzen. Für größere Bestände sind separate Fach-Tabellen und Dateispeicher der nächste Ausbauschritt.

## Noch nicht angebunden

Discord OAuth, automatischer Rollenabgleich und automatische Gameserver-Übernahme sind nicht implementiert. Der Fallversand erfolgt ausdrücklich per Aktion in der Akte; der Gegenweg über den geschützten API-Endpunkt erfordert einen Discord-Bot oder eine Automation. Erinnerungen werden im Portal angezeigt, es gibt keinen Hintergrundversand. Das Regelwerk des RP-Servers wird durch die Leitung eingetragen.

## Hosting

Standardmäßig ist das Portal ausschließlich auf diesem Computer erreichbar (`127.0.0.1:3000`). Für Teamzugriff sind ein eigener Host, HTTPS-Reverse-Proxy und Betriebskonfiguration erforderlich. `HOST`, `PORT`, `DOJ_DATA_DIR` und `DOJ_SECURE_COOKIE=1` lassen sich als Umgebungsvariablen konfigurieren. Vor einem Netzwerkbetrieb den ersten Leitungszugang lokal einrichten. Es wurde nichts öffentlich veröffentlicht.

## Prüfung

`npm test` führt die aktuellen Speicher-, Rechte- und API-Tests für Personenverknüpfungen und Discord aus. Supabase und Discord werden im Test simuliert; Produktionsdaten werden nicht verändert und keine Nachrichten versendet. Der alte lokale Portaltest wird nicht ausgeführt. `npm run db:check` prüft die tatsächliche konfigurierte Supabase-Verbindung lesend.
