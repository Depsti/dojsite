# Master, Einmalpasswörter und Studenten

## Master-Zugang „Master“ einrichten

Bei einem leeren Portal ist der erste eingerichtete Zugang automatisch Master. Für ein bestehendes Portal nach dem Deployment einmal in einer Serverumgebung mit denselben Supabase-Umgebungsvariablen ausführen:

```powershell
npm run master:setup -- Master
```

Ein bestehender aktiver Zugang namens Master wird durch diesen ausschließlich serverseitigen Administrationsbefehl hochgestuft; sein Passwort bleibt erhalten. Falls der Name noch nicht existiert, wird ein neuer Master mit einem einmalig ausgegebenen Einmalpasswort erstellt. Ein bereits vorhandener anderer Master verhindert die Einrichtung. Der Master kann alle Leitungen und Mitarbeiter verwalten. Leitungen können reguläre Mitarbeiter verwalten, aber keine anderen Leitungen und keinen Master. Der Master kann nicht über die Personalverwaltung gesperrt oder herabgestuft werden.

Die Einrichtung wurde nicht in der produktiven Datenbank ausgeführt: Im lokalen Projekt liegt keine .env vor. Das Skript muss mit der Serverkonfiguration ausgeführt werden. Keine Supabase-Schlüssel im Browser hinterlegen.

## Einmalpasswörter

Neue Mitarbeiter erhalten ein serverseitig zufällig erzeugtes Einmalpasswort, das nach der Anlage einmal angezeigt wird. Es ist 24 Stunden gültig und wird beim ersten erfolgreichen Login eingelöst. Bis zum Setzen eines eigenen Passworts bleiben die Systemdaten gesperrt. Das neue Passwort benötigt mindestens 8 und maximal 256 Zeichen. Passwörter werden ausschließlich gehasht gespeichert.

Verliert ein Mitarbeiter nach dem Einlösen seine eingeschränkte Sitzung, kann die zuständige Leitung bzw. der Master ein neues Einmalpasswort ausstellen. Zurücksetzen beendet vorhandene Sitzungen. Der Master stellt auch neue Einmalpasswörter für Leitungen aus. Alle Mitarbeiter können ihr eigenes Passwort über „Passwort ändern“ ändern; dafür ist das bisherige Passwort erforderlich.

## Studenten

Studenten haben standardmäßig Lese- und Anlegerechte. Vertrauliche Akten behalten ihre Zugriffsregeln. Schreibzugriff auf bestehende Einträge, Kommentare, Selbstübernahme und Entscheidungsrechte bleiben gesperrt, auch wenn eine individuelle Rechtekonfiguration dies versehentlich erlauben würde.

Neue Studenteneinträge erhalten „Vorgelegt“ und sind zunächst nur für Ersteller, Leitung und Master sichtbar. Unter Freigabeverfahren → Studenteneinreichungen entscheidet die Leitung über Übernahme oder begründete Rückgabe. Bei einer eingereichten Fallakte werden ihre gemeinsam neu angelegten Personen, Beweismittel und Dokumente zusammen übernommen. Erst nach Übernahme erscheint eine vorgemerkte Verhandlung im regulären Bestand.

Zurückgegebene Einträge bleiben als Verlauf erhalten; Studenten dürfen sie entsprechend ihrer Rolle nicht bearbeiten und können stattdessen einen korrigierten neuen Eintrag vorlegen. Übernommene Dokumente und Anträge können anschließend das normale Freigabeverfahren durchlaufen.

Keine Datenbankmigration erforderlich. Das Update muss inklusive lib/accounts.mjs und public/accounts.js deployt werden.
