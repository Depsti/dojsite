# Persönlicher Desktop

Jeder angemeldete Mitarbeiter kann die eigene Desktop-Anordnung bearbeiten. Die Änderung erteilt keine App- oder Datenrechte und verändert nicht den Desktop anderer Mitarbeiter.

## Bedienung

1. Auf dem Desktop oder im Startmenü **Desktop bearbeiten** wählen. Geöffnete App-Fenster bleiben erhalten und werden während der Bearbeitung ausgeblendet.
2. Apps und Ordner auf ein beliebiges Feld des sichtbaren Rasters ziehen. Belegte Felder tauschen ihre Symbole. Alternativ ein Symbol und danach ein freies Rasterfeld anklicken oder über **Spalte / Zeile → Position setzen** platzieren. Die Pfeile und **Alt + Pfeiltaste** verschieben Desktop-Symbole um ein Feld. Innerhalb eines Ordners bleibt die Reihenfolge-Liste erhalten.
3. Über **+ Ordner** einen benannten Ordner anlegen. Apps auf das Ordnersymbol ziehen oder über **Verschieben nach** zuordnen. Ein Klick auf einen Ordner zeigt dessen Apps.
4. Apps innerhalb eines Ordners ebenfalls umsortieren. Um sie herauszunehmen, als Ziel **Desktop** wählen.
5. Ordner lassen sich umbenennen oder auflösen. Beim Auflösen werden alle enthaltenen Apps wieder auf dem Desktop angezeigt.
6. **Speichern** übernimmt die Anordnung. **Abbrechen** stellt den zuletzt gespeicherten Stand wieder her.

Ordner enthalten Apps, keine weiteren Ordner. Namen dürfen 1–60 Zeichen lang sein; maximal 30 Ordner pro Person. Leere Ordner bleiben bestehen. Die Startmenü-Liste enthält weiterhin alle zugänglichen Apps. Verwaltungseinstellungen bleiben beim berechtigungsabhängigen Zahnrad.

## Speicherung und Betrieb

- Speicherung über die angemeldete Sitzung unter `desktopLayouts[user.id]` im vorhandenen Supabase-Portalbestand (`doj_portal_state.payload`).
- `GET /api/desktop-layout` und `PUT /api/desktop-layout` geben bzw. ändern ausschließlich die eigene Anordnung. Eine mitgesendete Mitarbeiter-ID wird ignoriert.
- Parallele Änderungen werden durch `expectedUpdatedAt` geprüft. Bei einem Konflikt bleibt der lokale Entwurf erhalten und der gespeicherte Stand kann ausdrücklich neu geladen werden.
- Bei Ladefehlern bleibt der Standarddesktop bedienbar. Bearbeiten wird erst nach erfolgreichem Laden freigegeben, um bestehende Anordnungen nicht versehentlich zu überschreiben.
- Neue oder neu freigegebene Apps erscheinen automatisch auf dem Desktop. Entzogene Rechte blenden die jeweilige App auch in Ordnern aus.
- Keine SQL-Migration und keine zusätzlichen Railway-Variablen erforderlich. Die geänderten Dateien müssen regulär mit der Anwendung bereitgestellt werden.

## Dateien

`public/desktop-layout.js` (Bedienung), `public/desktop-layout.css` (Darstellung), `public/desktop-layout-model.js` (gemeinsame Validierung und Anordnung), `lib/desktop-layout.mjs` (persönliche Speicherung); eingebunden über `public/index.html`, `public/desktop.js` und `lib/http-server.mjs`.

## Freie Rasterpositionen

Positionen bleiben auch nach Speichern und Neuladen erhalten. Die Rasterlinien sind nur im Bearbeitungsmodus sichtbar. Die Bearbeitungsleiste kann am Titel **⠿ Desktop bearbeiten** verschoben werden, um darunterliegende Felder zu erreichen.

Bisherige Anordnungen werden automatisch weiterverwendet; eine Datenbankmigration ist nicht nötig. Auf kleineren Bildschirmen werden außerhalb liegende Symbole vorübergehend auf erreichbare Felder verteilt. Beim normalen Betrachten verändert dies den gespeicherten Desktop nicht; beim Zurückwechseln auf den größeren Bildschirm erscheinen die ursprünglichen Positionen wieder. Erst **Speichern** im Bearbeitungsmodus übernimmt die aktuell angezeigte Anordnung. Auf sehr kleinen Bildschirmen bleibt der Bereich bei Platzmangel scrollbar, damit kein Symbol verschwindet.
