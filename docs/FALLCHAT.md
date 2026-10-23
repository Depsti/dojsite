# Fallchat einrichten und verwenden

Die Änderung befindet sich im Hauptprojekt C:\Users\lsqde\Documents\GitHub\dojsite. Die produktive Supabase-Datenbank wurde nicht verändert und es wurde noch kein Deployment ausgelöst.

## 1. Supabase

1. Im Dashboard das bestehende Projekt **dojsite** öffnen.
2. **SQL Editor → New query** öffnen.
3. Den gesamten Inhalt von [20261023_case_chat.sql](../supabase/migrations/20261023_case_chat.sql) einfügen und mit **Run** ausführen.
4. Erfolgreiche Ausführung abwarten. Danach existieren die Tabellen **doj_case_messages**, **doj_case_chat_reads** und **doj_case_reactions** sowie die Funktionen **doj_chat_send**, **doj_chat_mark_read** und **doj_chat_unread**.

Die Migration ist wiederholbar und verändert keine vorhandenen Fallakten. Der Schema-Cache wird am Ende automatisch neu geladen. RLS ist für alle drei Tabellen eingeschaltet. Browser-Rollen erhalten keinen direkten Zugriff; ausschließlich der Server nutzt die service_role-Berechtigungen. Keine öffentlichen RLS-Regeln ergänzen.

Supabase Realtime und Supabase Auth müssen für diese Umsetzung nicht aktiviert werden. Nachrichten werden in eigenen Tabellen gespeichert; Dienstgrade verbleiben bei den Mitarbeiterprofilen im bestehenden Portalbestand.

## 2. Railway

Alle geänderten und neuen Dateien zusammen in das GitHub-Repository übernehmen, einschließlich package.json, package-lock.json und der neuen Dateien unter lib/ und public/. Anschließend den verbundenen Railway-Service neu deployen. Startbefehl bleibt **npm start**.

Es sind keine zusätzlichen Railway-Variablen erforderlich. Weiterhin benötigt werden:

- **SUPABASE_URL**: URL des bestehenden Projekts dojsite.
- **SUPABASE_SECRET_KEY**: serverseitiger Secret-Key beziehungsweise bestehender service_role-Key dieses Projekts.

Diese Schlüssel ausschließlich in den Service-Variablen halten. Bei Shared Variables prüfen, dass sie tatsächlich im DOJ-Service referenziert sind. Es sind kein zusätzlicher Service, Volume, Discord-Webhook oder WebSocket-Setup für den Chat erforderlich.

Empfohlene Reihenfolge: zuerst SQL ausführen, danach den vollständigen Stand deployen und den Browser neu laden. Ohne Migration bleibt das restliche Portal nutzbar; der Fallchat meldet die fehlende Einrichtung.

## 3. Bedienung und Rechte

- Eine Fallakte öffnen und auf **Fallchat** wechseln. **Akte** führt zurück zu den Fachdaten; ein ungesendeter Chatentwurf bleibt beim Wechsel erhalten.
- Personen mit Fallzugriff lesen den Chat. Schreiben und Reaktionen setzen das vorhandene Kommentarrecht voraus. Studenten lesen nur; archivierte Fälle sind ebenfalls nur lesbar.
- Antworten beziehen sich auf eine Nachricht. **Verweis hinzufügen** sucht zugängliche Datensätze, darunter Akten, Personen, Dokumente, Beweismittel und Anträge. Ein Klick öffnet den verknüpften Eintrag; im Desktop in einem eigenen Fenster.
- Berechtigungen werden bei jedem Abruf und jeder Aktion auf dem Server geprüft. Verliert ein Nutzer den Zugriff auf einen verknüpften Datensatz, werden dessen Titel und Kennung nicht mehr angezeigt. Frei eingegebener Nachrichtentext wird nicht automatisch redigiert.
- Pro Nachricht und Nutzer gibt es entweder ✅ oder ❌. Erneutes Anklicken entfernt die eigene Reaktion; die andere Auswahl wechselt sie. Anzahl und Namen sind sichtbar. Reaktionen ersetzen keine formelle Freigabe.
- Eigene Nachrichten lassen sich bearbeiten oder löschen. Master und Leitung können andere Nachrichten löschen. Ein Löschhinweis bleibt bestehen; die Bearbeitungshistorie wird serverseitig gespeichert und nicht im normalen Chat ausgeliefert.
- Die Sprechblase in der Taskleiste zeigt ungelesene Nachrichten und öffnet die jeweilige Fallakte direkt im Chat. Der aktive Chat aktualisiert sich alle drei Sekunden, die Übersicht alle zehn Sekunden. Lesestände werden nur bei fokussiertem Chat aktualisiert.
- Maximal 5.000 Zeichen und zehn Verweise pro Nachricht; maximal fünf neue Nachrichten pro Nutzer innerhalb von zehn Sekunden. Fehlgeschlagene Sendeversuche behalten ihren Entwurf; Wiederholungen derselben Sendung werden nicht doppelt gespeichert.
- Chatentwürfe gelten als ungespeicherte Änderungen und lösen beim Schließen eines Desktopfensters eine Rückfrage aus. Sie werden nicht dauerhaft gespeichert.
- Chatnachrichten sind vom Aktenbestand getrennt und erscheinen nicht automatisch in PDF- oder DOCX-Exporten.

## 4. Dienstgrade

Berechtigte Mitarbeiter wählen unter **Personal → Mitarbeiter → Befugnisse** einen Dienstgrad; auch bei neuen Zugängen ist die Auswahl vorhanden. Die bisherigen Dienstrollen und Bereichsrechte bestimmen weiterhin den Zugriff. Ein Dienstgrad allein erteilt keine zusätzlichen Rechte.

Unterstützt werden Attorney General, Deputy Attorney General, Supervising District Attorney, Senior District Attorney, District Attorney, Assistant District Attorney und Public Prosecutor Trainee. Der Name erhält im Chat die zugehörige Farbe und der Dienstgrad wird daneben angezeigt. Änderungen gelten auch für die Darstellung vorhandener Nachrichten.

## 5. Prüfung nach Deployment

1. Mit Master oder Leitung einen Dienstgrad vergeben.
2. Eine nicht archivierte Akte öffnen, eine Nachricht mit Dokumentverweis senden und mit einem zweiten berechtigten Zugang lesen.
3. Antworten und beide Reaktionen testen; ungelesene Anzeige kontrollieren.
4. Mit einem Studentenzugang prüfen, dass der Chat nur lesbar ist.
5. Bei einem Fehler im Fallchat die Railway-Logs und die erfolgreiche SQL-Ausführung im richtigen Supabase-Projekt prüfen.

Lokale Prüfungen: **npm.cmd test**, **npm.cmd run test:desktop**, **npm.cmd run test:chat**. Die Browserprüfungen benötigen einen installierten Chrome-Browser. Der Chat-Test verwendet den echten DOJ-Server mit einer lokalen PostgreSQL-Engine und simuliert lediglich den Transport zur Datenbank. Er greift nicht auf Produktivdaten zu. PGlite und Playwright sind nur Entwicklungsabhängigkeiten.
