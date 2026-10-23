# Persönliche Benachrichtigungen

Oben rechts befindet sich die Glocke mit der Anzahl ungelesener Hinweise. Sie ist im Desktop und in der klassischen Ansicht vorhanden, nicht in jedem einzelnen App-Fenster. Ein Klick öffnet den Verlauf; ein weiterer Klick auf einen Hinweis öffnet den zugehörigen Eintrag, Termin, die Aufgabe oder den Chat.

Erfasst werden ab Installation:
- Neue Zuweisungen zu Akten, Verhandlungen und anderen zuständigen Einträgen sowie ausdrücklich vergebene Aktenzugriffe.
- Interne Prüfentscheidungen, gerichtliche Antragsentscheidungen und Entscheidungen über eigene studentische Vorlagen.
- Neue Kommentare zu selbst erstellten oder zugewiesenen Einträgen.
- Zuweisungen und Abschluss gemeinsamer To-dos; persönliche Terminteilnahmen sowie Terminänderungen und Absagen.
- Änderungen der eigenen Dienstrolle oder Berechtigungen.
- Ungelesene private Nachrichten und Nachrichten in zugänglichen Fallchats, jeweils nach Gespräch zusammengefasst, ohne Nachrichteninhalte im Hinweis.

Die Ansicht aktualisiert sich alle zehn Sekunden, beim Wechsel zurück ins Fenster und bei Änderungen aus App-Fenstern. Die Glocke ist keine Browser-Push-Benachrichtigung bei geschlossener Website. Private Nachrichten und Fallchat-Hinweise werden nur angezeigt, solange im jeweiligen Gespräch ungelesene Nachrichten vorhanden sind. Bereits bestehende Zuweisungen und alte Entscheidungen werden beim Einspielen nicht rückwirkend als neue Hinweise erzeugt.

Hinweise lassen sich einzeln oder gemeinsam als gelesen markieren. Dieser Lesestatus bleibt über Anmeldungen und Geräte hinweg erhalten. Das Lesen eines Hinweises markiert die Nachrichten im Chat nicht automatisch als gelesen; deren Lesestand wird weiterhin durch das Öffnen des Gesprächs gepflegt. Eine weitere eingehende Nachricht erzeugt wieder einen ungelesenen Hinweis. Eigene und gelöschte Nachrichten lösen keine neuen Glockenhinweise aus.

## Speicherung und Berechtigungen

Persönliche Ereignisse und Lesebestätigungen werden in der bestehenden JSONB-Nutzlast von `doj_portal_state` unter `notifications` und `notificationReceipts` gespeichert, zusammen mit der auslösenden Änderung und derselben Versionsprüfung. Aufbewahrung: maximal 200 Ereignisse und 500 Lesebestätigungen pro Person. Nachrichten bleiben in ihren bestehenden Chat-Tabellen. Pro Abruf werden maximal 50 ungelesene Fallchats und 50 private Gespräche zusammengefasst.

`GET /api/notifications` liefert ausschließlich die Hinweise des angemeldeten Mitarbeiters. Titel und Zugriffsrechte werden bei jedem Abruf neu aufgelöst; nach Entzug von Rechten erscheinen die betreffenden Einträge nicht mehr. Auch Master erhalten keinen Zugriff auf fremde private Hinweise oder Gespräche. `POST /api/notifications/read` akzeptiert nur eine Liste sichtbarer Hinweis-IDs der eigenen Sitzung. Die API verwendet keine vom Browser übergebene Benutzer-ID.

Wenn der Chat vorübergehend nicht erreichbar oder noch nicht eingerichtet ist, bleiben die anderen Hinweise verfügbar; die Ansicht zeigt die unvollständige Nachrichtenübersicht an.

## Supabase und Railway

Keine neue SQL-Migration, keine zusätzlichen Railway-Variablen und keine neuen Pakete nötig. Die vorhandene Speicherung über `SUPABASE_URL` und `SUPABASE_SECRET_KEY` wird weiterverwendet. Für Chat-Hinweise müssen die bereits vorhandenen Fallchat- und Privatchat-Migrationen eingerichtet sein (siehe `CHAT.md`). Den gesamten aktualisierten Projektstand deployen, einschließlich `lib/notifications.mjs` und der neuen Dateien in `public/`.

Prüfung: `npm test`, `npm run test:desktop`, `npm run test:chat`. Der letzte Test prüft die Glocke mit lokalem PostgreSQL, echtem DOJ-HTTP-Server und Browser einschließlich Zuweisung, fremder Lesezugriffe, dauerhaftem Lesestatus, Direktverknüpfungen und Mobilansicht.
