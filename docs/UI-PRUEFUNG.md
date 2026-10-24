# UI-Prüfung vom 24.10.2026

Die Oberfläche wurde lokal mit einem Headless-Chrome-Browser und Testdaten geprüft. Produktionsdaten wurden nicht verändert.

## Behobene Fehler

- Lange Aktenzeichen, Titel und Dateinamen konnten Dialoge horizontal verbreitern und die Schließen-Schaltfläche aus dem sichtbaren Bereich schieben. Inhalte brechen jetzt um; die Kopfzeile bleibt begrenzt und bedienbar.
- Die feste Aktennavigation konnte nach einem Umbruch ihr Sprungziel überdecken. Ihre tatsächliche Höhe wird jetzt gemessen und für den Abstand zum Ziel verwendet. Auf schmalen Ansichten stehen die sechs Bereiche in zwei Reihen.
- Direkte Verweise auf einen Aktenbereich wurden anschließend von der allgemeinen Fokusfunktion zurück zur Metadatenzeile gescrollt. Bereichssprünge behalten jetzt ihr Ziel.
- Der aktive Bereich folgte manuellem Scrollen nicht. Die Markierung wird jetzt anhand des sichtbaren Inhalts aktualisiert. Überblick führt an den Anfang der Akte.
- Enter auf einer Markierungs-Checkbox löste den Öffnen-Handler der Tabellenzeile aus. Zeilen reagieren jetzt nur auf ihren eigenen Tastaturfokus; Checkboxen bleiben separat bedienbar. Markierungen haben außerdem eindeutige Namen.
- Auf niedrigen Bildschirmen konnten ausgeklappte Toneinstellungen die Benachrichtigungsliste auf null Höhe zusammendrücken. Das Panel wird dort scrollbar; Schließen bleibt sichtbar und Aktualisierungen erhalten die Leseposition.

## Wiederholbare Prüfung

npm.cmd run test:ui prüft Desktop und klassische Ansicht, lange Inhalte, Tastaturauswahl, Bereichssprünge, manuelles Scrollen, die mobile Abschlussprüfung und das Benachrichtigungspanel. Aktenansichten werden bei 320, 390, 768 und 1440 Pixel Breite in Hell und Dunkel geprüft; kurze Ansichten zusätzlich bei 390 × 568 und 844 × 390 Pixel.

Screenshots liegen unter artifacts/organization-qa/ui-*.png. Die Prüfung meldet verbleibende Befunde und JavaScript-Fehler und schlägt bei einem Befund fehl.

Zusätzlich bestehen die vorhandenen Prüfungen npm.cmd test, npm.cmd run test:desktop, npm.cmd run test:workflow, npm.cmd run test:chat und npm.cmd run test:sounds.

Es sind keine Datenbankmigrationen oder neuen Umgebungsvariablen erforderlich. Für den Livebetrieb müssen die lokalen Änderungen regulär veröffentlicht werden.
