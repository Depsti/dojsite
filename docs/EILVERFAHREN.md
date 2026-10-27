# Eilverfahrens-Protokolle

Im Desktop oder Startmenü die App **Eilverfahren** öffnen und **Protokoll anlegen** wählen.

- Pflichtfelder: Discord-Channellink zur Beweissicherung, Beginn, Geldstrafe und Hafteinheiten (jeweils auch 0).
- Optional: Begleitpersonen, CopNet-Aktenzeichen, Notizen. Ein Ende ist erst beim Abschluss erforderlich.
- **Entwurf speichern** ermöglicht spätere Änderungen. **Verbindlich abschließen** speichert das Protokoll mit Endzeit und sperrt weitere Änderungen.
- Der Titel wird beim ersten Speichern automatisch vergeben, z. B. **Az. EV-GL-20261026-153045**. Kürzel aus dem Erstellernamen; Datum und Uhrzeit in Europe/Berlin. Gleichzeitige Vergaben erhalten bei Bedarf einen Suffix. Das Az. bleibt bei Änderungen erhalten.
- Beginn und Ende im Formular verwenden die lokale Browser-Zeitzone; die Leseansicht zeigt Europe/Berlin. Auch Verfahren über Mitternacht sind möglich.

## Zugriff

Mitarbeiter sehen ausschließlich ihre eigenen Protokolle. Chief of Staff, Attorney General, Deputy Attorney General und Master sehen alle, sofern das Bereichsleserecht besteht. Die Leitung liest fremde Protokolle; nur Ersteller und Master dürfen offene Protokolle bearbeiten. Abgeschlossene Protokolle sind auch für den Master unveränderbar. Die Nennung einer Begleitperson erteilt keinen Zugriff.

Unter **Personal → Dienstgradrechte** gibt es den Bereich **Eilverfahren** mit Lesen, Anlegen und Bearbeiten. Für das Anlegen werden alle drei Rechte benötigt. Standards: Staatsanwälte und Leitung dürfen anlegen/bearbeiten; Trainees und Studenten nicht. Persönliche Ausnahmen gelten wie in anderen Bereichen; Studenten bleiben ohne Bearbeitungsrechte.

## Bereitstellung

Die Daten liegen als Einträge vom Typ expedited im bestehenden JSONB-Portalzustand. **Keine neue SQL-Migration, keine Railway-Variablen und keine Bot-Änderungen erforderlich.** Änderungen im Hauptrepository committen/pushen und das Website-Deployment aktualisieren. Es werden keine Discord-Nachrichten geschrieben oder geladen; der Beweissicherungslink öffnet den hinterlegten Kanal.

## Prüfung

npm test enthält die Fach- und HTTP-Zugriffstests. npm run test:expedited-ui prüft Anlegen, Entwurf, Abschluss, Mobilansicht und Desktop-Fenster mit isolierten Testdaten. Screenshots liegen unter artifacts/expedited-qa (nicht für den Betrieb nötig).
