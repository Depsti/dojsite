# DOJ Discord Ticket Reader

Eigenständiger Lesebot für die vorbereitete Ticket-Schnittstelle der WebApp. Der bisherige Ticketbot wird nicht verändert. Dieser Service liest Discord-Daten und sendet sie ausschließlich an die WebApp. Discord-REST-Schreibmethoden sind zusätzlich im Code gesperrt.

Der Bot ist implementiert und lokal getestet. Zugangsdaten und Bereitstellung werden in Railway verwaltet. Für bestehende Installationen vor diesem Anzeige-Update einmal supabase/discord-ticket-display.sql ausführen und Website sowie Bot aktualisieren. Es werden keine weiteren Tabellen benötigt.

## 1. Discord-Anwendung erstellen

1. [Discord Developer Portal](https://discord.com/developers/applications) öffnen, **New Application** wählen und beispielsweise `DOJ Ticket Reader` nennen.
2. Unter **Bot** den Bot-Token erstellen bzw. zurücksetzen. Den Token nur in Railway als `DISCORD_BOT_TOKEN` hinterlegen. Er ist weder Client Secret noch Application ID und gehört nicht in GitHub oder Chatnachrichten.
3. Unter **Privileged Gateway Intents** den **Message Content Intent** aktivieren. Server Members und Presence Intent werden nicht benötigt. Bei einer verifizierungspflichtigen Anwendung gelten zusätzlich die Discord-Freigaben.
4. Den Bot als Server-/Guild-Installation hinzufügen. Je nach Portalansicht unter **Installation** oder **OAuth2 / URL Generator** den Bot-Scope verwenden.
5. Nur diese Bot-Rechte auswählen: **View Channels / Kanäle ansehen** und **Read Message History / Nachrichtenverlauf anzeigen**. Keine Administrator-, Sende-, Lösch-, Reaktions- oder Verwaltungsrechte vergeben. Der zugehörige Berechtigungswert ist `66560`.
6. In den vorgesehenen Ticketkategorien bzw. Kanälen die Leserechte für die Bot-Rolle sicherstellen. Nicht synchronisierte Ticketkanäle benötigen gegebenenfalls eigene Freigaben. Private Threads sind nur sichtbar, wenn Discord dem Bot bereits Zugriff gewährt; er tritt selbst keinen Threads bei.
7. Im Discord-Client unter **Erweitert** den Entwicklermodus aktivieren. Per Rechtsklick die Server-ID und die IDs der Ticketkategorien kopieren. Bei Thread-Tickets können auch die Elternkanal-IDs verwendet werden.

Bots können trotz eines Kategorie-Rechts durch abweichende Berechtigungen in einzelnen Ticketkanälen ausgeschlossen sein. Das ist kein Grund, Administratorrechte zu vergeben; stattdessen die konkreten Leserechte korrigieren. Der Bot importiert programmatisch nur die konfigurierten Server-/Eltern-IDs.

## 2. WebApp-Konfiguration

Beim bestehenden WebApp-Service müssen die bereits dokumentierten Variablen gesetzt sein:

```text
DOJ_DISCORD_TICKET_SECRET=<eigener zufälliger Schlüssel, mindestens 32 Zeichen>
DOJ_DISCORD_TICKET_GUILD_ID=<Discord-Server-ID>
DOJ_DISCORD_TICKET_PARENT_IDS=<Kategorie-ID>,<weitere erlaubte Kategorie-ID>
```

Diese drei Werte müssen beim Bot und der WebApp übereinstimmen. Der Schlüssel ist getrennt vom Discord-Bot-Token und vom bisherigen Fallimport-Schlüssel. Einen neuen Ticket-Schlüssel bei Bedarf lokal erzeugen mit:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Die erzeugte Ausgabe ausschließlich in den Variablen beider Railway-Services speichern. Für den Bot keine Supabase-Schlüssel setzen.

## 3. Eigenen Railway-Service anlegen

Im vorhandenen Railway-Projekt einen **zweiten Service** aus demselben GitHub-Repository erstellen und `doj-ticket-reader` nennen. Zuvor die neuen Projektdateien regulär committen und pushen. Keine Start- oder Root-Einstellungen am bestehenden WebApp-Service überschreiben.

| Einstellung | Wert |
| --- | --- |
| Repository | Dasselbe Repository wie die WebApp |
| Root Directory | `/bots/discord-ticket-reader` |
| Railway Config File | `/bots/discord-ticket-reader/railway.json` |
| Build | Dockerfile aus dem Bot-Verzeichnis |
| Start Command | `node src/main.mjs` |
| Healthcheck Path | `/health` |
| Instanzen | `1` |
| Serverless / Sleep | Aus |
| Volume Mount Path | `/data` |
| Öffentliche Domain | Nicht erforderlich |

Die Config-Datei ist relativ zur Repository-Wurzel angegeben, nicht relativ zur Root Directory. Das mitgelieferte Dockerfile verwendet Node.js 24 und installiert ausschließlich die Abhängigkeiten dieses Bot-Pakets. Das WebApp-Paket bleibt unabhängig.

Ein **Railway-Volume an diesen Bot-Service anhängen**, Mount-Pfad `/data`. Ohne das Volume würde die lokale SQLite-Warteschlange bei einem Deploy verloren gehen. Das Volume wird erst zur Laufzeit benötigt. Nicht mehrere Bot-Instanzen mit derselben Warteschlange starten.

Folgende Variablen beim **Bot-Service** setzen:

```text
DISCORD_BOT_TOKEN=<Token aus dem Discord Developer Portal>
DOJ_PORTAL_URL=https://<öffentliche Domain eurer WebApp>
DOJ_DISCORD_TICKET_SECRET=<derselbe Ticket-Schlüssel wie bei der WebApp>
DOJ_DISCORD_TICKET_GUILD_ID=<dieselbe Server-ID>
DOJ_DISCORD_TICKET_PARENT_IDS=<dieselben erlaubten Eltern-IDs>
BOT_DATA_DIR=/data
```

`DOJ_PORTAL_URL` enthält nur den Ursprung der WebApp, beispielsweise `https://dojsite-production.up.railway.app`, **nicht** `/api/...`, einen Discord-Webhook oder eine Supabase-URL. Der Bot ergänzt den Importpfad selbst. Weiterleitungen werden nicht verfolgt; deshalb die endgültige HTTPS-Domain verwenden.

`PORT` wird von Railway vorgegeben; dort nicht aus der lokalen Beispieldatei übernehmen. Der Healthcheck enthält lediglich Verbindungsstatus und Warteschlangenstatistik, keine Nachrichten, Namen, IDs oder Schlüssel. Eine erfolgreiche Healthcheck-Antwort bestätigt die Gateway-Verbindung, nicht die vollständige Importbereitschaft des Portals. `portalError` und die Warteschlange zusätzlich beachten.

Anschließend deployen. Erwartete Meldungen in den Logs:

- `Lesebot verbunden. Erstabgleich startet.`
- `Ticketabgleich abgeschlossen.`

In der WebApp sieht die Ticketverwaltung neue Tickets und kann sie Mitarbeitern zuweisen. Die erste Übernahme größerer Verläufe kann aufgrund der Discord-Abfragelimits dauern. Nachrichten werden während des vollständigen Erstabgleichs gesammelt und danach chronologisch zur Übertragung freigegeben; Metadaten können bereits vorher erscheinen.

## 4. Optionale Einstellungen

| Variable | Standard | Bedeutung |
| --- | --- | --- |
| `DOJ_DISCORD_TICKET_CLOSED_PARENT_IDS` | leer | Teilmenge der erlaubten Eltern-IDs, deren Tickets extern geschlossen sind |
| `BOT_RESYNC_SECONDS` | `300` | Periodischer Abgleich; mindestens 60 Sekunden |
| `BOT_HEARTBEAT_SECONDS` | `60` | Import-Verbindungsstand; 30 bis 90 Sekunden |
| `BOT_MAX_QUEUE` | `50000` | Maximale Zahl wartender Ereignisse |

Geschlossene Kategorien müssen zusätzlich in `DOJ_DISCORD_TICKET_PARENT_IDS` auf **beiden Services** erlaubt sein. Archivierte Threads gelten automatisch als extern geschlossen. Normale Texttickets werden nur über die konfigurierte Kategorie geschlossen erkannt; es gibt keine allgemeine Discord-Eigenschaft „Ticket geschlossen“. Namen oder Inhalte von Nachrichten des fremden Ticketbots werden nicht als verlässlicher Abschlussstatus interpretiert.

Wenn ein Kanal gelöscht, unzugänglich oder in eine nicht freigegebene Kategorie verschoben wird, meldet der Bot die bekannte Quelle als `unavailable`. Interne Aufgaben, Notizen und Status bleiben erhalten. Ein extern geschlossenes Ticket wird intern nicht automatisch erledigt.

## 5. Betrieb und Fehlerbehandlung

- Warteschlange, bereits erkannte Nachrichtenversionen und Abgleichstände liegen im Volume in `ticket-reader.sqlite` einschließlich SQLite-WAL-Dateien. Aktuelle Nachrichteninhalte können in der Warteschlange enthalten sein; das Volume gehört nur diesem Service.
- Vorhandene zugängliche Texttickets, aktive Threads und lesbare archivierte Threads werden beim Start und periodisch erkannt. Bei privaten archivierten Threads werden ausschließlich bereits zugängliche/beigetretene Threads abgefragt; keine automatischen Beitritte und keine Verwaltungsrechte.
- Erstabgleiche paginieren durch den gesamten verfügbaren Verlauf. Nach einem Abbruch wird an der gespeicherten Seite fortgesetzt. Bei sehr großen Einzelverläufen muss `BOT_MAX_QUEUE` ggf. erhöht werden. Bei einem vollen Puffer werden weder Seite noch Cursor fälschlich als gespeichert bestätigt.
- Neuere Nachrichten werden fortlaufend übernommen. Die erste Seite des periodischen Abgleichs wird zusätzlich auf neuere Fassungen geprüft. Sehr alte Bearbeitungen während eines vollständigen Offline-Zeitraums können außerhalb dieses Fensters liegen.
- Verfügbare neue Nachrichten werden nach Verbindungsabbrüchen nachgeladen. Zwischenzeitlich gelöschte Inhalte lassen sich über Discord nicht zuverlässig rekonstruieren. Löschereignisse und Sammellöschungen, die der Bot empfängt, werden als Tombstones weitergegeben; spätere alte Imports stellen sie nicht wieder her.
- Netzwerkfehler und temporäre Portalfehler werden mit ansteigenden Wartezeiten wiederholt. Ein fehlgeschlagener Kanal blockiert die anderen Kanäle nicht. Authentifizierungsfehler werden nach Korrektur der Variablen erneut versucht. HTTP 400/405/413/422 blockiert das betroffene Ereignis zur Prüfung, statt Daten still zu verwerfen.
- Heartbeats stehen hinter den Nachrichten des jeweiligen Kanals. Dadurch wird ein blockierter Nachrichtenimport nicht durch ständig neue Heartbeats verdeckt.
- Logs enthalten keine Tokens, Nachrichteninhalte, Namen oder Anhangadressen. Angezeigt werden technische Statuscodes und betroffene Kanal-IDs.
- Discord-Anhänge bleiben externe Links; wichtige Dateien gezielt in der WebApp sichern. Der Bot lädt keine Anhangdateien herunter.
- Neustarts behalten die Warteschlange, wenn das Railway-Volume korrekt gemountet ist. Bei einem Deploy mit Volume kann eine kurze Unterbrechung auftreten; verfügbare Ereignisse werden anschließend abgeglichen.

Warteschlangenstatus über eine Railway-Service-Konsole abfragen:

```sh
node src/queue-admin.mjs status
```

Nach Behebung eines dauerhaft blockierten Ereignisses erneut freigeben:

```sh
node src/queue-admin.mjs retry
```

Das Retry-Kommando löscht keine Nachrichten. Stimmen Quell- oder Schlüsselkonfigurationen nicht, müssen zuerst die Railway-Variablen und gegebenenfalls die zulässigen Kategorien korrigiert werden. Bei einem Softwarefehler an einem bereits gespeicherten ungültigen Ereignis muss auch dieses Ereignis gezielt geprüft werden; unbegrenztes Retry allein repariert keine falschen Nutzdaten.

Typische Ursachen:

| Meldung/Code | Prüfung |
| --- | --- |
| Discord `4014` | Message Content Intent im Developer Portal aktivieren/freigeben |
| Discord `4004` | Bot-Token prüfen |
| Discord `50001` / `50013` | Konkrete Sichtbarkeit und Nachrichten-Leserechte prüfen |
| Portal `401` | Ticket-Schlüssel in beiden Services muss übereinstimmen |
| Portal `403` | Server-/Eltern-IDs auf beiden Services prüfen |
| Portal `503` | WebApp erreichbar, aktueller Code deployt und Ticket-SQL ausgeführt? |
| Warteschlange voll | Importfehler lösen bzw. `BOT_MAX_QUEUE` bei umfangreichem Erstimport erhöhen |

## Lokal testen

Node.js **24.17 oder neuer** verwenden. Das Bot-Paket nutzt das eingebaute `node:sqlite` und eine festgelegte discord.js-Version mit Lockdatei. In PowerShell:

```powershell
cd C:\Users\lsqde\Documents\GitHub\dojsite\bots\discord-ticket-reader
npm.cmd ci --ignore-scripts
npm.cmd test
```

Für einen lokalen Live-Start `.env.example` nach `.env` kopieren, Werte eintragen und `BOT_DATA_DIR=./data` verwenden. Dann `npm.cmd start`. Nur einen aktiven Leser je Queue/Service betreiben; für den lokalen Test den Produktivbot ggf. stoppen oder eine separate Testkategorie verwenden.

Vom Repository-Hauptverzeichnis zusätzlich:

```powershell
node tests/ticket-reader-integration.mjs
```

Dieser Integrationstest verbindet die echte Bot-Warteschlange und Übertragungslogik mit dem echten WebApp-HTTP-Server und einer lokalen PostgreSQL-Testdatenbank. Er benutzt keine Discord-Anmeldung und keine Produktivdaten.

Geprüft: Konfiguration, Scopes, Nachrichtenmapping, dauerhafte Speicherung/Neustart, Retry, Löschschutz, Queue-Limits/Rollback, paginierter Erstabgleich, Wiederaufnahme, Rechteverlust, Heartbeats sowie die Sperre aller Discord-REST-Schreibmethoden. Ein echter Discord-/Railway-Betriebstest erfolgt erst nach Hinterlegung der Zugangsdaten und Serverrechte.

## Dokumentationsgrundlagen

- [Discord Gateway und Message Content Intent](https://github.com/discord/discord-api-docs/blob/main/developers/events/gateway.mdx)
- [discord.js](https://discord.js.org/docs/packages/discord.js/main)
- [Railway: Monorepos und Root Directory](https://docs.railway.com/deployments/monorepo)
- [Railway: persistente Volumes](https://docs.railway.com/volumes)

## Anzeigeversion 1

Servername, Absender-Spitznamen, Nutzer-/Rollen-/Kanal-Erwähnungen und sichere Hyperlinks werden mit dem neuen WebApp-Stand unterstützt. Vor dem Deploy das SQL-Update supabase/discord-ticket-display.sql ausführen. Es sind keine neuen Variablen oder Gateway-Intents nötig. Der Bot liest einmal alle vorhandenen zugänglichen Verläufe erneut, um alte Anzeigen anzureichern; vorhandene Nachrichten und Warteschlangen bleiben erhalten. Einzelne Mitgliedernamen werden gezielt und lesend abgefragt und zehn Minuten gecacht. Nicht mehr auflösbare Namen werden durch bekannte globale Namen ersetzt. Profile/Links öffnen Discord; es werden keine Pings gesendet. Siehe docs/DISCORD-TICKETS.md im Repository.
