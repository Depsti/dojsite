# DOJ Desktop – Implementierung und Betrieb

Der Desktop ist die neue Standardoberfläche des Hauptprogramms. Die separate Design-Demo in Downloads ist dafür nicht erforderlich.

## Bedienung

- Apps über Desktop-Symbole oder das Startmenü öffnen. Die App-Suche filtert die zugänglichen Bereiche.
- Bereichsübersichten werden einmal geöffnet. Erneutes Öffnen bringt das vorhandene Fenster nach vorne.
- Einzelne Akten und Einträge öffnen eigene Fenster. Verschiedene Akten lassen sich parallel bearbeiten; dieselbe Akte wird nicht mehrfach geöffnet.
- Fenster an der Titelleiste verschieben. Doppelklick maximiert und stellt die vorherige Größe wieder her.
- Minimieren, Maximieren und Schließen über die Titelleiste. Minimierte Fenster bleiben in der Taskleiste.
- Über die Ecke unten rechts lässt sich die Größe ändern. Bei Tastaturfokus auf dieser Ecke ändern die Pfeiltasten die Größe; mit Umschalt in größeren Schritten.
- Auf Smartphones nimmt eine App den Arbeitsbereich ein. Die Taskleiste dient dem Wechsel. Desktop-Fensterpositionen werden beim Wechsel der Bildschirmgröße erhalten.
- „Klassisch“ öffnet die bisherige Oberfläche. Über „Zum Desktop wechseln“ geht es zurück. Die klassische Ansicht lässt sich auch direkt über `/?view=classic` öffnen.

## Ansichten und Fensterverwaltung

`public/desktop.js` stellt die Desktop-Oberfläche und die Fensterverwaltung bereit, `public/desktop.css` die Darstellung. Beide werden nach den vorhandenen Portalmodulen geladen.

Jede App läuft in einer eigenen gleichursprünglichen Ansicht (`?workspace=app&app=cases`). Einzelne Akten ergänzen `record=<ID>`. Dadurch besitzen die bisherigen Fachmodule pro Fenster einen eigenen DOM, Dialog, Suchfilter und Formularzustand. Die bestehenden Personenverknüpfungen, der Fallassistent, DOCX-Import, Anträge, Rollenverwaltung und Dokumentexporte verwenden weiterhin ihre vorhandene Fachlogik.

Fenster kommunizieren ausschließlich mit registrierten Ansichten desselben Ursprungs. Die Nachrichten prüfen Ursprung, Absenderfenster und Protokollkennung. Es gibt keine eingebetteten Fremdseiten. Die Sicherheitsheader erlauben Einbettung ausschließlich durch denselben Ursprung (`SAMEORIGIN`, `frame-ancestors 'self'`).

## Entwürfe und parallele Änderungen

- Änderungen in Formularen markieren das Fenster als ungespeichert. Beim Schließen, Abmelden oder Wechsel zur klassischen Ansicht wird vor dem Verwerfen gefragt. Beim Neuladen oder Verlassen der Website greift die Browserwarnung.
- Ein Speichervorgang aktualisiert die anderen offenen Ansichten. Enthält eine Ansicht einen ungespeicherten Entwurf, wird dieser erhalten und ein Hinweis auf neuere Daten angezeigt.
- Änderungen an bestehenden Einträgen senden den geladenen Änderungsstand als `expectedUpdatedAt`. Der Server lehnt veraltete Änderungen mit HTTP 409 ab. Das Formular bleibt erhalten.
- Fensterpositionen und Größen werden lokal je Benutzer und Fenster gespeichert. Entwurfstexte, Passwörter und Akteninhalte werden dafür nicht im Browser gespeichert.
- Nach Änderungen und regelmäßig nach 60 Sekunden werden Sitzung und Rechte geprüft. Entzogene Leserechte schließen die betroffenen Fenster. Geänderte Bearbeitungsrechte sperren einen offenen Entwurf bis zum Neuladen. Serverseitige Prüfungen bleiben für jeden Speichervorgang maßgeblich.

## Umstellung

Die Umsetzung benötigt keine neue Datenbankstruktur. Änderungen einschließlich `package.json`, `package-lock.json`, der neuen Desktop-Dateien und der geänderten Serverdatei gemeinsam deployen. Nur Frontend-Dateien hochzuladen reicht nicht, weil der Server die Desktop-Dateien bereitstellt und die eigenen App-Ansichten zulassen muss.

Lokal nach dem Aktualisieren der Abhängigkeiten mit `npm.cmd ci` und `npm.cmd start` starten. Für ein Railway-Deployment gilt weiterhin der bisherige GitHub-/Deployment-Ablauf. Anschließend die Seite neu laden. Ein bereits geöffneter alter Browser-Tab verwendet bis zum Neuladen die bisherige Oberfläche.

## Prüfung

- `npm.cmd test`: bestehende Fachtests einschließlich API-Konfliktschutz und Sicherheitsheadern.
- `npm.cmd run test:desktop`: reproduzierbare Browserprüfung mit Playwright und lokal installiertem Google Chrome. Für einen anderen installierten Browserkanal kann `DOJ_TEST_BROWSER_CHANNEL` gesetzt werden.

Die Browserprüfung nutzt einen lokalen Testserver mit Beispieldaten und greift nicht auf den produktiven Supabase-Bestand oder Discord zu. Sie prüft parallele Akten, getrennte Formulare, Schutz ungespeicherter Änderungen, Aktualisierung zwischen Fenstern, Fenstersteuerung, alle Apps, Word-Vorschau und Download, Rechte von Master/Leitung/Student, Sitzungsende und die Mobilansicht. Vorschaubilder liegen lokal unter `artifacts/organization-qa/`.