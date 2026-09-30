# DOJ – Internes RP-Portal

## Starten

1. Node.js ab Version 20 installieren, falls noch nicht vorhanden.
2. `start.cmd` doppelt anklicken (alternativ `npm start`).
3. http://localhost:3000 im Browser öffnen.
4. Beim ersten Aufruf einen Leitungszugang mit mindestens 12 Passwortzeichen erstellen.

Das Serverfenster muss geöffnet bleiben. Keine Installation zusätzlicher Pakete erforderlich. Die eigentliche Website liegt in `public/index.html`, `public/styles.css` und `public/app.js`. Die `index.html` im Hauptordner enthält den Einstieg zum lokalen Portal.

## Enthalten

- Dashboard mit aktuellen Akten, Aufgaben, Freigaben und Terminen
- Fallakten mit automatischen Aktenzeichen, Zuständigkeit und Vertraulichkeit
- Personen, Beweise mit Datei-Anhang (max. 5 MB) und Quellenlinks
- Dokumente, Anträge, Vergleiche, Kommentare und PDF-Ausgabe über den Browserdruck
- Anklage-, Haftbefehls- und Einstellungsvorlagen; eigene Vorlagen im Wissensbereich
- Editierbares RP-Gesetzbuch und Strafmaßrechner mit Milderung und Haftobergrenze
- Termine, Aufgaben, Wissensbereich, Charakterverzeichnis und Archiv
- Mitarbeiterzugänge, Leitungsfreigaben, Änderungsprotokoll und Einstellungen
- Suche und Statusfilter; responsive Darstellung

Neue Einträge werden über „Eintrag erstellen“ angelegt. Ein Klick auf einen Eintrag öffnet die Details. Über „Bearbeiten“ können Status, Frist und Zuordnung geändert werden. Zum Archivieren den Status „Archiviert“ wählen, zur Wiederaufnahme einen anderen Status. Dokumente lassen sich über „Als PDF drucken“ als PDF speichern.

## Zugriffsmodell

Die erste Person erhält die Rolle Leitung und kann weitere Zugänge anlegen. Leitung pflegt Gesetze und Einstellungen und erteilt Freigaben. Staatsanwälte und Referendare können die übrigen sichtbaren Einträge bearbeiten. Vertrauliche Einträge sind nur für Ersteller, zuständige Person und Leitung sichtbar. Vertraulichkeit gilt pro Eintrag: verknüpfte Beweise und Dokumente müssen bei Bedarf ebenfalls als vertraulich markiert werden. Charaktere sind Verzeichniseinträge, keine getrennten Anmeldesitzungen.

## Datenspeicherung

Die Speicherung ist über `DOJ_STORAGE=local` oder `DOJ_STORAGE=supabase` wählbar. Standard bleibt lokal. Einrichtung, Datenübernahme und Grenzen stehen in [docs/SUPABASE.md](docs/SUPABASE.md). Die Vorlage `.env.example` enthält keine Zugangsdaten. `.env` und `data/` werden durch Git ignoriert.

Alle Daten einschließlich Anhängen liegen in `data/database.json`. Passwörter werden mit Salt und scrypt gehasht. Sitzungen laufen nach acht Stunden ab und werden bei einem Serverneustart beendet. Für Backups den Server stoppen und den gesamten `data`-Ordner kopieren. Diese Version ist für einen einzelnen Serverprozess ausgelegt; kein paralleler Betrieb mehrerer Instanzen auf derselben Datei.

## Noch nicht angebunden

Discord OAuth, automatischer Rollenabgleich, Discord-Benachrichtigungen und die Übernahme aus einem Gameserver sind nicht implementiert. Discord-IDs lassen sich vorbereitend speichern. Erinnerungen werden im Portal angezeigt, es gibt keinen Hintergrundversand. Das Portal enthält absichtlich keine erfundenen Gesetze oder echten Personendaten. Das Regelwerk des RP-Servers wird durch die Leitung eingetragen.

## Hosting

Standardmäßig ist das Portal ausschließlich auf diesem Computer erreichbar (`127.0.0.1:3000`). Für Teamzugriff sind ein eigener Host, HTTPS-Reverse-Proxy und Betriebskonfiguration erforderlich. `HOST`, `PORT`, `DOJ_DATA_DIR` und `DOJ_SECURE_COOKIE=1` lassen sich als Umgebungsvariablen konfigurieren. Vor einem Netzwerkbetrieb den ersten Leitungszugang lokal einrichten. Es wurde nichts öffentlich veröffentlicht.

## Prüfung

`npm test` prüft Einrichtung, Anmeldung, Zugriffsschutz, Akten, Kommentare, Rollen und Speicherung mit einem temporären Datenverzeichnis. Zusätzliche Tests simulieren Supabase-Antworten, Schreibkonflikte und Datenbankfehler. Ein tatsächlicher Supabase-Verbindungstest muss nach der Projektkonfiguration separat erfolgen.
