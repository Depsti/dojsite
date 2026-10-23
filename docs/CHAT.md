# Chatbereich: Fallchats und Privatchats

Die Chatbox unten rechts besitzt zwei Kategorien: **Fallchats** und **Privatchats**. Der eingeklappte Chatknopf zählt ungelesene Nachrichten aus beiden Bereichen.

## Fallchats

Hier bleiben alle zugänglichen Fallakten aufgelistet. Bisherige Nachrichten, Antworten, Reaktionen, geschützte Verweise und Fallrechte bleiben erhalten. Studenten sowie archivierte Fälle besitzen weiterhin nur die bisherigen Leserechte im Fallchat. Einrichtung des ursprünglichen Fallchats: [FALLCHAT.md](FALLCHAT.md).

## Privatchats

Im Tab **Privatchats** können alle anderen aktiven Mitarbeiter nach Name oder Dienstgrad gesucht und einzeln angeschrieben werden. Die Unterhaltung kann ohne vorhandene Nachricht geöffnet werden. Es gibt eine gemeinsame Unterhaltung je Mitarbeiterpaar; auch Studenten können persönlich schreiben. Ein Fallzugriff ist dafür nicht erforderlich.

Private Nachrichten sind nur für die beiden Beteiligten abrufbar. Master und Leitung erhalten im Portal keinen Sonderzugriff auf fremde Unterhaltungen und können keine fremden Privatnachrichten moderieren. Antworten und Reaktionen funktionieren ebenso wie in Fallchats. Eigene Nachrichten lassen sich bearbeiten oder mit einem Löschhinweis entfernen.

Akten- und Dokumentverweise können auch privat gesendet werden. Beim Empfänger werden Titel und Kennung nur angezeigt, wenn er auf den verknüpften Datensatz zugreifen darf. Frei geschriebener Nachrichtentext wird nicht automatisch redigiert. Privatnachrichten werden nicht in Fallakten, allgemeine Änderungsprotokolle oder Dokumentexporte aufgenommen.

Wird ein Mitarbeiter gesperrt, bleibt die bisherige Unterhaltung lesbar, es können aber keine weiteren Nachrichten oder Änderungen in dieser Unterhaltung gesendet werden. Gesperrte Konten ohne bisherige Unterhaltung erscheinen nicht als neue Kontakte.

## Neue Nachrichten und Bedienung

- Ungelesene Chats werden mit goldenem Rand, hervorgehobenem Namen und einem **neu**-Zähler markiert und zuerst aufgelistet.
- Die Kategorien zeigen ihre eigenen Ungelesen-Zähler. Der Chatknopf wird bei neuen Nachrichten ebenfalls hervorgehoben.
- Erst beim Abruf einer geöffneten, fokussierten Unterhaltung wird der Lesestand fortgeschrieben. Der bloße Wechsel in den Privat-Tab markiert keine Nachrichten als gelesen.
- Nachrichten im aktiven Chat werden alle drei Sekunden, die Übersicht alle zehn Sekunden aktualisiert. Nach Lesen, Senden oder Reagieren wird die Übersicht zusätzlich aktualisiert.
- Entwürfe bleiben beim Einklappen, beim Wechsel der Kategorie und beim Wechsel zwischen Unterhaltungen erhalten. Beim Verlassen schützt die bestehende Rückfrage vor dem Verlust ungesendeter Texte. Ein Neuladen speichert Entwürfe nicht dauerhaft.
- Es gelten maximal 5.000 Zeichen und zehn Verweise pro Nachricht. Private Sendungen sind auf fünf neue Nachrichten je Nutzer in zehn Sekunden begrenzt; wiederholtes Senden derselben Anfrage erzeugt kein Duplikat.

## Einmalig in Supabase ausführen

Diese Erweiterung **benötigt eine zusätzliche SQL-Migration**. Sie wurde nur lokal getestet, nicht auf der produktiven Datenbank ausgeführt.

1. Das bestehende Supabase-Projekt **dojsite** öffnen.
2. **SQL Editor → New query** wählen.
3. Den gesamten Inhalt von [20261023154039_private_chat.sql](../supabase/migrations/20261023154039_private_chat.sql) einfügen und **Run** ausführen.
4. Die erfolgreiche Ausführung abwarten. Anschließend existieren die Tabellen **doj_direct_messages**, **doj_direct_reads** und **doj_direct_reactions** sowie die Funktionen **doj_direct_send**, **doj_direct_mark_read** und **doj_direct_summary**.

Die Migration ist wiederholbar und verändert keine bestehenden Fallchat-Nachrichten oder Portalakten. RLS ist aktiviert; öffentliche Browser-Rollen erhalten keinen direkten Tabellen- oder Funktionszugriff. Der bestehende DOJ-Server prüft die Anmeldung und bindet jede Anfrage an das angemeldete Mitarbeiterpaar. Die bestehenden serverseitigen Supabase-Zugangsdaten werden weiterverwendet. Supabase Auth und Realtime müssen für diese Umsetzung nicht zusätzlich aktiviert werden.

Wenn die Migration fehlt, meldet der Privatbereich die fehlende Einrichtung. Die Fallchat-Kategorie kann weiterhin verwendet werden.

## Railway und GitHub

Nach der SQL-Ausführung alle geänderten und neuen Dateien gemeinsam übernehmen und den Railway-Service neu deployen. Es gibt keine neue Umgebungsvariable und keine zusätzliche Laufzeitabhängigkeit. Startbefehl und die vorhandenen **SUPABASE_URL** / **SUPABASE_SECRET_KEY** bleiben bestehen.

Wichtige Dateien:

- `lib/direct-chat.mjs` und `lib/direct-chat-store.mjs`: private API und Datenzugriff.
- `public/case-chat.js` und `.css`: gemeinsamer Chatbereich, Kategorien und Hervorhebungen.
- `supabase/migrations/20261023154039_private_chat.sql`: private Tabellen, Lesestände, Indizes, Berechtigungen und Funktionen.
- `lib/http-server.mjs` und `lib/store.mjs`: Einbindung in den vorhandenen Server.

## Prüfung

`npm.cmd test` prüft die Rechte sowie beide SQL-Schemas mit einer lokalen PostgreSQL-Engine. `npm.cmd run test:chat` testet den vollständigen Server und mehrere Browsersitzungen, darunter ungelesene Privatchats, Antworten, Reaktionen, geschützte Verweise, Entwürfe, gesperrte Empfänger, Mobilansicht und den fehlenden Zugriff eines dritten Master-Zugangs. `npm.cmd run test:desktop` prüft die übrige Desktop-Oberfläche.

Es wurden keine Produktivdaten verändert und kein Deployment ausgelöst.
