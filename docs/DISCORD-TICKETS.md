# Discord-Tickets: WebApp und Bot-Anbindung

Die WebApp ist vorbereitet. Es wurde kein Bot installiert, kein Discord-Server verändert und kein Produktiv-SQL ausgeführt.

## Bereitstellung

1. In Supabase den SQL Editor öffnen und **supabase/discord-tickets.sql** vollständig ausführen. Das Skript ist wiederholbar und löscht keine vorhandenen Nachrichten. Es legt die Nachrichtentabelle, einen Index und die Importfunktion an. `NOTIFY pgrst` lädt den REST-Schemacache neu.
2. Die geänderten und neuen Projektdateien gemeinsam deployen. Es sind keine neuen npm-Abhängigkeiten nötig.
3. In Railway beim WebApp-Service setzen:
   - `DOJ_DISCORD_TICKET_SECRET`: eigener zufälliger Schlüssel mit mindestens 32 Zeichen. Nicht den bisherigen Fallimport-Schlüssel verwenden.
   - `DOJ_DISCORD_TICKET_GUILD_ID`: ID des erlaubten Discord-Servers.
   - `DOJ_DISCORD_TICKET_PARENT_IDS`: erlaubte Ticket-Kategorie-IDs, durch Kommas getrennt. Bei Threads die entsprechenden Elternkanal-IDs verwenden.
4. Nach Variablenänderungen deployen. Solange kein Bot Ereignisse sendet, bleibt die Ticketübersicht leer. Es werden keine Demo-Tickets in die Produktivdaten eingefügt.
5. Den Lesebot später als eigenen dauerhaft laufenden Service einrichten. Er benötigt die Portal-URL, den Ticket-Import-Schlüssel und seine Discord-Zugangsdaten. **Keine Supabase-Schlüssel an den Bot weitergeben.**

Die neue Tabelle hat RLS aktiviert; `anon`, `authenticated` und `PUBLIC` erhalten weder Tabellenzugriff noch Funktionsrechte. Nur der vorhandene serverseitige `service_role`-Zugang darf die Daten über die REST-API lesen/schreiben. Die WebApp nutzt weiterhin ihre eigene Anmeldung und prüft die Mitarbeiterrechte im Node-Server. Keine öffentlichen RLS-Lesepolicies ergänzen.

## Bedienung

Die Desktop-App **Discord-Tickets** zeigt alle aktuell zugänglichen Tickets und bietet Filter nach Suchtext, Status, eigenen Tickets, unzugewiesenen Tickets und neuen Nachrichten.

Neue Tickets sind zunächst nur für Master, Leitung und Mitarbeiter mit **Tickets verwalten** sichtbar. Über **Verwalten** werden Zuständige mit Ticket-Bearbeitungsrecht und weitere Leser hinzugefügt. Alternativ kann die Verwaltung ein unzugewiesenes Ticket zur Selbstübernahme freigeben: Übernahmeberechtigte sehen dann Titel, Status und Priorität, aber noch keinen Verlauf. Mit der Übernahme erhalten sie Zugriff. Die Freigabe macht den Titel bewusst für diese Mitarbeiter sichtbar.

Der Arbeitsraum enthält:

- **Discord-Verlauf:** schreibgeschützte Nachrichten, Absender, Zeiten, Antwort-IDs, Text aus Embeds und Links zu Discord-Anhängen sowie Originalnachrichten. Keine Discord-Antwortfunktion.
- **Bearbeitung:** Zuständige, Priorität, Anfragender und interner Status. Status: Neu, In Prüfung, In Bearbeitung, Warten auf Rückmeldung, Erledigt, Archiviert.
- **Gemeinsame Notizen:** explizites Speichern mit Urheber und Versionsprüfung. Bei Konflikten bleibt die Eingabe erhalten; die Änderung wird nicht still überschrieben.
- **Meine Notizen:** echte private Notizen im eigenen Notizblock, auch für Studenten. Sie bleiben nach Entzug des Ticketzugriffs persönlich zugänglich.
- **To-dos:** echte private oder gemeinsame Aufgaben, optional mit Frist und individuellem Erledigungsstand. Gemeinsame Aufgaben unterliegen zusätzlich den bestehenden Aufgaben- und Zuteilungsrechten sowie dem Ticketzugriff.
- **Unterlagen & Akten:** bestehende zugängliche Einträge verknüpfen, Dokumente/Beweismittel/Anträge im normalen System erstellen und interne Dateien hochladen. Dokumente aus dem Ticket tragen ihre Herkunft und erscheinen im normalen Dokumentbereich. Das studentische Prüfverfahren gilt unverändert.
- **Interne Abstimmung:** eigenständiger Chat für die Mitarbeiter. Keine dieser Nachrichten wird nach Discord übertragen.

Die Aktion **Neue Fallakte vorbereiten** öffnet nach bewusster Eingabe des Sachverhalts den bestehenden Aktenassistenten. Es erfolgt keine automatische vollständige Übernahme des Chats. Die fertig erstellte Fallakte anschließend unter „Vorhandenen Eintrag verknüpfen“ zuordnen. Eine Ticketzuweisung erteilt keine Fallrechte; verknüpfte Akten werden pro Mitarbeiter gefiltert.

Der geöffnete Arbeitsraum lädt alle fünf Sekunden nach. Aktive oder ungespeicherte Ticketformulare bleiben dabei erhalten. Die Glocke zeigt neue Discord-Nachrichten, interne Nachrichten und Zuweisungen. Discord- und interner Lesestand sind getrennt. Archivierte Tickets sind bei gemeinsamen Arbeitsdaten schreibgeschützt; die Ticketverwaltung kann sie wieder öffnen. Der Discord-Quellstatus ist unabhängig vom internen Bearbeitungsstatus.

Ticketunterlagen: maximal 5 MB pro Datei und 50 Dateien je Ticket. Gemeinsame Notizen: 300 je Ticket. Interner Chat: 2000 Nachrichten je Ticket, maximal fünf neue Nachrichten pro zehn Sekunden je Mitarbeiter. Die Übersicht unterstützt bis zu 5000 Tickets. Ältere Discord-Nachrichten sind seitenweise abrufbar (50 je Seite); aktuell geladene Nachrichten werden beim Nachladen zusätzlich auf Änderungen geprüft, bis zu 200 IDs je Abruf.

## Schnittstelle für den späteren Lesebot

Alle Ereignisse gehen als JSON per **POST** an:

`https://DEINE-PORTAL-URL/api/integrations/discord/tickets`

Header:

```http
Authorization: Bearer DEIN_TICKET_IMPORT_SCHLUESSEL
Content-Type: application/json
```

Dies ist eine geschützte Import-API des Portals, keine Discord-Kanal-Webhook-URL. Der Schlüssel berechtigt ausschließlich zum Import, nicht zur Mitarbeiteranmeldung oder zum Bearbeiten interner Status, Zuweisungen, Notizen und Dokumente. Der Import ruft keine Discord-API auf.

### 1. Ticket anlegen / Quelldaten aktualisieren

```json
{
  "type": "ticket.upsert",
  "guildId": "111111111111111111",
  "channelId": "333333333333333333",
  "parentId": "222222222222222222",
  "title": "Ticket-0042 · Bürgeranfrage",
  "requester": {"id": "444444444444444444", "name": "Max Beispiel"},
  "sourceState": "active",
  "changedAt": "2026-10-26T10:00:00Z"
}
```

`sourceState`: `active`, `closed` oder `unavailable`. `requester` ist optional; kann der bestehende Ticketbot den Ersteller nicht eindeutig erkennen lassen, weglassen. Der Lesebot muss keinen Zugriff auf den Code oder die Konfiguration des vorhandenen Ticketbots haben. Der Kanal selbst besitzt keine universelle Ticket-Ersteller-Eigenschaft; keine Namen aus Kanalnamen erraten.

Server- und Kanal-ID bilden die stabile Ticketidentität. Wiederholte Imports legen kein zweites Ticket an. Spätere Quelländerungen überschreiben weder interne Zuständigkeiten noch Status, Notizen oder Dateien. Veraltete Quelländerungen werden ignoriert. Ein extern geschlossenes Ticket wird intern nicht automatisch auf Erledigt gesetzt.

### 2. Vollständige Nachricht neu anlegen / aktualisieren

```json
{
  "type": "message.upsert",
  "guildId": "111111111111111111",
  "channelId": "333333333333333333",
  "messageId": "555555555555555555",
  "author": {"id": "444444444444444444", "name": "Max Beispiel", "bot": false},
  "content": "Ich möchte Unterlagen einreichen.",
  "createdAt": "2026-10-26T10:01:00Z",
  "changedAt": "2026-10-26T10:01:00Z",
  "replyTo": null,
  "attachments": [{"name": "Unterlagen.pdf", "url": "https://cdn.discordapp.com/attachments/BEISPIEL", "size": 12345}],
  "embeds": [{"title": "Hinweis", "description": "Zusätzlicher Inhalt"}]
}
```

Zuerst muss `ticket.upsert` erfolgreich sein. Bei Änderungen immer die vollständige Nachricht liefern; partielle Discord-Update-Ereignisse muss der Bot vor dem Import vervollständigen. `changedAt` ist bei der Anlage der Erstellungszeitpunkt, bei einer Änderung die aktuelle Quellversion. Gleich alte oder ältere Upserts überschreiben keine neuere Fassung. Ein Wiederholversuch desselben Ereignisses ist sicher. Alle Zeitangaben benötigen UTC oder einen expliziten Zeitzonenoffset; mehr als fünf Minuten zukünftige Quellzeiten werden abgelehnt.

Erlaubte Anhanghosts sind ausschließlich `cdn.discordapp.com` und `media.discordapp.net` über HTTPS. Es werden keine externen HTML-Inhalte oder Skripte dargestellt und keine URLs serverseitig abgerufen. Discord-Anhänge werden zunächst als externe Links eingebunden, nicht dauerhaft heruntergeladen. Diese URLs können ablaufen; wichtige Unterlagen bewusst als internes Dokument/Beweismittel hochladen. Falls der Bot URLs neu abruft, kann er eine neue vollständige Nachrichtenversion mit aktualisierten Anhängen senden. Beliebige Embed-HTML-Inhalte werden nicht übernommen; unterstützt sind Titel und Beschreibung.

### 3. Nachricht auf Discord gelöscht

```json
{
  "type": "message.delete",
  "guildId": "111111111111111111",
  "channelId": "333333333333333333",
  "messageId": "555555555555555555",
  "changedAt": "2026-10-26T10:05:00Z"
}
```

Der Inhalt, Absender und die Anhänge werden entfernt; eine Löschmarkierung bleibt erhalten. Auch eine Löschung vor dem zugehörigen Nachrichtenimport legt eine Markierung an. Verspätete Upserts können gelöschte Inhalte nicht wiederherstellen. Bei Discord-Sammellöschungen ein Ereignis je Nachrichten-ID senden.

### 4. Verbindungsstand / letzter erfolgreicher Abgleich

```json
{
  "type": "heartbeat",
  "guildId": "111111111111111111",
  "channelId": "333333333333333333",
  "changedAt": "2026-10-26T10:06:00Z"
}
```

Nach erfolgreichem Abgleich spätestens etwa jede Minute je aktivem Ticket senden. Der Arbeitsraum zeigt nach zwei Minuten ohne erfolgreichen Abgleich einen Hinweis. Das ist eine Anzeige des letzten Imports, kein Beweis, dass alle Discord-Nachrichten vollständig erfasst wurden.

### Antworten und Wiederholungen

Erfolg: HTTP 200, beispielsweise `{"id":"interne-24-stellige-id","imported":true}`. Auf die interne ID darf sich der Bot nicht verlassen; er sendet weiterhin Discord-Server-/Kanal-/Nachrichten-IDs.

- 400: Eingabe korrigieren.
- 401: falscher Import-Schlüssel.
- 403: Server/Kategorie nicht freigegeben.
- 404: Ticket vor der Nachricht importieren.
- 409 oder 503: Ereignis unverändert mit begrenztem exponentiellem Backoff wiederholen; nachfolgende Ereignisse desselben Kanals geordnet abarbeiten.
- 413: Ereignis zu groß (höchstens 512 KB); Textgrenzen und Anzahl der Anhänge beachten.

Der spätere Bot sollte eine dauerhafte Ausgangswarteschlange nutzen, Wiederverbindungen beherrschen, vorhandene freigegebene Tickets beim Start nachholen und noch verfügbare Nachrichten seit dem letzten erfolgreichen Abgleich nachladen. Während eines Ausfalls gelöschte Nachrichten lassen sich über Discord nicht zuverlässig nachträglich rekonstruieren. Geschlossene oder unzugängliche Quellen explizit melden; interne Arbeitsdaten nicht löschen. Ticketkanäle, die in andere Kategorien verschoben werden, dürfen nur dann weiter importiert werden, wenn auch die neue Kategorie freigegeben ist.

## Speicherung

Ticket-Metadaten, Rechte und interne Arbeitsdaten: `doj_portal_state.payload.discordTickets`. Normale Dokumente/Beweise: `records` mit `ticketId`. Private Notizen und Aufgaben: `organizer.notes` bzw. `organizer.todos` mit `ticketId`. Der fortlaufende externe Nachrichtenbestand liegt separat in `public.doj_ticket_messages` und wird nicht in den Portal-Gesamtbestand kopiert.

Nachrichtenspeicherung und Portalrevision sind zwei getrennte Schreibvorgänge. Die Importfunktion ist wiederholbar; bei einem Konflikt nach erfolgreicher Nachrichtenspeicherung muss der Bot das Ereignis erneut senden, damit auch der Metadatenstand aktualisiert wird.

## Prüfung

- `npm.cmd test`: Fachlogik, Rechte, Wiederholschutz und SQL einschließlich deaktiviertem Zugriff für öffentliche Rollen.
- `npm.cmd run test:tickets`: echter HTTP-Server, lokale PostgreSQL-Testdatenbank und zwei Browsernutzer; Import, Live-Verlauf, Zuweisung, private Notizen, echte To-dos/Dokumente, Dateidownload, interner Chat, Löschungen und Rechteentzug.
- `npm.cmd run test:desktop` und `npm.cmd run test:ui`: bestehende Desktop- und Oberflächenfunktionen.

Es werden keine Produktivdaten für diese Tests verwendet. Screenshots liegen unter `artifacts/chat-qa/discord-ticket*.png`.
