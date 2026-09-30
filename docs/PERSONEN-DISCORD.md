# Update: Personen und Discord

## Personen mit Fällen verknüpfen

- In einer Fallakte unter **Beteiligte Personen → Personen verknüpfen** vorhandene Personen suchen oder neu erfassen.
- Pro Verfahren eine Rolle und einen Vermerk vergeben: Beschuldigter, Zeuge, Geschädigter, Verteidiger oder Sonstige.
- Eine Person kann mehreren Fällen zugeordnet werden. Ihre Rolle wird je Fall gespeichert.
- In der Personenakte zeigt **Zugehörige Verfahren** die zugänglichen Fälle. **Fall zuordnen** fügt eine weitere Verbindung hinzu.
- Zuordnungen entfernen löscht weder die Person noch den Fall.
- Die bisherigen Zuordnungen über `caseId` werden weiterhin angezeigt. Kein manueller Datenumbau erforderlich.

Nur Personen mit Bearbeitungsrecht auf die Fallakte dürfen die Beteiligten ändern. Es können nur zugängliche Personen ausgewählt werden. Vertrauliche Fälle werden in der Personenakte nicht an Unberechtigte verraten. Zusätzliche Personen-Vertraulichkeit bleibt bestehen. Persönliche Leserechte für den Bereich Personen sind ebenfalls erforderlich.

Neue Personen werden durch das Erfassen bereits gespeichert. Die Verbindung zum Fall wird erst mit **Zuordnungen speichern** übernommen. Duplikate werden nicht anhand des Namens zusammengeführt; unterschiedliche Charaktere können gleich heißen.

## Fall aus dem Portal nach Discord senden

1. Im gewünschten Discord-Textkanal unter **Kanal bearbeiten → Integrationen → Webhooks** einen Webhook erstellen und seine URL kopieren.
2. Die URL beim Hosting-Anbieter oder in der lokalen `.env` unter `DISCORD_CASE_WEBHOOK_URL` hinterlegen. Sie ist geheim und gehört nicht nach GitHub.
3. Den Server neu starten. Fallersteller und Leitung erhalten in ihrer Fallakte die Aktion **Nach Discord senden**.
4. Der Dialog zeigt, welche Angaben gesendet werden. Erst der Klick auf **Nach Discord senden** löst die Übertragung aus.

Übertragen werden Aktenzeichen, Titel, Sachverhalt (gekürzt), Status, Priorität, Federführung und die zugänglichen beteiligten Personen. Dateien, interne Kommentare und fallbezogene Personenvermerke werden nicht übertragen. Erwähnungen wie `@everyone` lösen keine Benachrichtigungen aus. Der Server protokolliert den Versand und speichert die zuletzt bestätigte Nachrichten-ID.

Mit `DISCORD_ALLOW_CONFIDENTIAL=0` bleibt der Versand vertraulicher Fälle gesperrt. Nur für einen passend geschützten Discord-Kanal bewusst auf `1` setzen. Ein zweiter Versand erstellt eine weitere Nachricht; vorhandene Nachrichten werden nicht bearbeitet. Bei einem Verbindungsabbruch den Kanal vor erneutem Senden prüfen.

Der Webhook muss zu einem normalen Textkanal gehören. Forumkanäle und Thread-Konfiguration sind in dieser Version nicht unterstützt.

## Fall von einem Discord-Bot ins Portal importieren

Ein normaler Kanal-Webhook schreibt Nachrichten **nach Discord**. Für den Gegenweg sendet dein Bot oder eine Automation einen HTTPS-POST an:

```text
https://DEIN-PORTAL/api/integrations/discord/cases
Authorization: Bearer DEIN-IMPORT-SCHLUESSEL
Content-Type: application/json
```

Servervariablen:

```dotenv
DOJ_DISCORD_IMPORT_SECRET=<zufaelliger eigener Schluessel mit mindestens 32 Zeichen>
DOJ_DISCORD_IMPORT_USER_ID=<ID einer aktiven Leitung>
DOJ_DISCORD_SOURCE=discord
```

Die Mitarbeiter-ID ist für die Leitung in **Einstellungen → Discord-Fallübertragung** sichtbar. Der Import-Schlüssel ist ein eigener Schlüssel und darf nicht mit dem Supabase-Secret-Key identisch sein. Er wird ausschließlich zwischen Portal und Bot verwendet. Ohne die Konfiguration ist der Import deaktiviert. Auf dem Bot die zulässigen Kanäle und Dienstrollen prüfen, bevor Daten weitergegeben werden.

Beispiel-Payload:

```json
{
  "externalId": "discord-message-123456789",
  "title": "Staat gegen Miller",
  "description": "Sachverhalt aus dem RP-Verfahren",
  "priority": "Normal",
  "confidential": true,
  "people": [
    {"name": "Alex Miller", "role": "Beschuldigter", "description": "RP-Charakter"},
    {"personId": "BESTEHENDE-PERSONEN-ID", "role": "Zeuge", "note": "Zeuge am Tatort"}
  ]
}
```

`externalId` und `title` sind Pflichtfelder. Für bestehende Personen ihre Portal-ID verwenden; für neue Personen `name` angeben. `ownerId` kann optional eine aktive interne Mitarbeiter-ID enthalten. Eine Discord-Nutzer-ID ersetzt keine Portal-Mitarbeiter-ID.

Importierte Fälle starten im Status **Offen** und sind standardmäßig vertraulich. Neue importierte Personen sind zusätzlich vertraulich und an den importierten Fall gebunden. Der konfigurierte Leitungszugang übernimmt die Aktenführung. Der Import vergibt keine individuellen Mitarbeiterrechte und genehmigt keine Anträge.

Wiederholungen mit derselben Kombination aus `DOJ_DISCORD_SOURCE` und `externalId` liefern die bestehende Fall-ID zurück, statt eine zweite Akte anzulegen. Bestehende Fälle werden dabei nicht überschrieben. Der Bot muss dieselbe ID bei Wiederholungen beibehalten.

Antwort beim Erstellen: HTTP 201 mit `id`, `reference` und `created: true`. Bei einem bereits bekannten Fall: HTTP 200 mit `created: false`. HTTP 401: falscher Schlüssel; HTTP 400: ungültiger Inhalt; HTTP 409: Schreibkonflikt, mit derselben externen ID erneut versuchen.

Eine kleine Funktion für deinen vorhandenen Bot liegt unter `examples/discord-case-client.mjs`. Sie ist kein vollständig eingerichteter Discord-Bot. Eine Beispiel-Anfrage für PowerShell liegt unter `examples/import-case.ps1`.

## Installation des Update-Pakets

1. ZIP in einen separaten Ordner entpacken.
2. In PowerShell im entpackten Ordner `./apply-doj-update.ps1 -RepoPath "C:\Pfad\zum\DOJ-Portal"` ausführen. Das Script sichert die zu ersetzenden Dateien in einem Backup-Ordner.
3. Neue Variablen aus `.env.example` in `.env` oder im Hosting ergänzen. Das Script ersetzt die vorhandene `.env` nicht.
4. Den Server neu starten beziehungsweise den geänderten Code deployen.

Personen-Verknüpfungen und Importinformationen werden im bestehenden JSONB-Bestand gespeichert. Dieses Update benötigt keine zusätzliche Supabase-Schemaänderung, sofern `doj_portal_state`, `doj_sessions` und `doj_login_attempts` bereits eingerichtet sind.

## Prüfung

`npm test` führt Speicher-, Rechte- und die neuen API-Tests aus. Sie verwenden simuliertes Supabase und simuliertes Discord, ohne echte Nachrichten zu senden oder Produktionsdaten zu ändern. Der veraltete lokale Portaltest wird nicht ausgeführt.

Offizielle Referenz: [Discord Webhook Resource](https://docs.discord.com/developers/resources/webhook#execute-webhook).
