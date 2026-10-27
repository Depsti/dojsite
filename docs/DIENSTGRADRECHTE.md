# Dienstgrade und vererbte Berechtigungen

Chief of Staff steht in der Dienstgradliste ueber Attorney General und besitzt ebenfalls Leitungsbefugnisse. Der geschuetzte Masterstatus bleibt separat.

## Bedienung

Unter **Personal → Dienstgradrechte** verwalten Chief of Staff, Attorney General, Deputy Attorney General und Master die zentralen Rechteprofile. Fuer jeden Dienstgrad gibt es Lese-, Anlege- und Bearbeitungsrechte je Bereich sowie Sonderrechte fuer Freigaben, Zuteilungen, Kalender, Tickets, Protokoll und Portaleinstellungen.

Neue Mitarbeiter erhalten nur noch einen Dienstgrad. Eine zweite Rollenauswahl existiert nicht mehr. Die Standardprofile geben den drei obersten Dienstgraden Leitungsrechte, den regulaeren Staatsanwalts-Dienstgraden die bisherigen Staatsanwaltsrechte und Public Prosecutor Trainee zunaechst die bisherigen Referendarrechte. **Student** ist ein eigener Dienstgrad, damit das bisherige Einreichungsverfahren erhalten bleibt.

In einer Personalakte gibt es fuer jedes Recht drei Einstellungen:

- **Dienstgrad: Erlaubt/Verweigert**: den aktuellen Profilwert erben, auch nach spaeteren Profil-Aenderungen.
- **Persoenlich erlauben**: ausdrueckliche Ausnahme fuer diese Person.
- **Persoenlich verweigern**: ausdruecklicher Entzug fuer diese Person.

**Alle Ausnahmen entfernen** stellt die vollstaendige Vererbung her, sobald gespeichert wird. Bei einem Dienstgradwechsel bleiben persoenliche Ausnahmen erhalten; alle anderen Rechte stammen sofort aus dem neuen Dienstgrad. Anlegen und Bearbeiten setzen immer das Leserecht des Bereichs voraus. Fallfreigaben und weitere fachliche Zugriffsschranken gelten zusaetzlich.

Profil-Aenderungen gelten serverseitig bei der naechsten Anfrage und erfordern keine neue Anmeldung. Bereits offene Fenster erhalten ueber die bestehenden Aktualisierungs- und Rechtepruefungen den neuen Stand; eine noch sichtbare Schaltflaeche kann eine verweigerte Serverberechtigung nicht umgehen. Betroffene Mitarbeiter bekommen einen persoenlichen Berechtigungshinweis, wenn sich ihre effektiven Rechte aendern.

## Feste Schutzregeln

- Die Personal- und Profilverwaltung folgt ausschliesslich Chief of Staff/Attorney General/Deputy Attorney General sowie dem geschuetzten Masterstatus. Ein frei vergebenes Sonderrecht wie Portaleinstellungen macht niemanden zur Behoerdenleitung.
- Chief of Staff, AG und Deputy duerfen regulaere Mitarbeiter einschliesslich anderer Leitungsdienstgrade verwalten. Der Master kann alle Accounts verwalten. Ausschliesslich der Master verwaltet einen Master-Account und setzt fremde Passwoerter direkt; die Behoerdenleitung stellt fuer andere regulaere Accounts bei Bedarf Einmalpasswoerter aus.
- Master ist ein geschuetzter Systemzugang mit Vollzugriff, kein auswaehlbarer Dienstgrad und keine frei vergebbare Rolle. Sein Passwort und seine ID bleiben bei der Umstellung unveraendert. Ueber die Personal-API kann kein weiterer Master erzeugt werden; mindestens ein aktiver Master bleibt erhalten.
- Gesetzesinhalte bleiben ausschliesslich vom Master aenderbar, unabhaengig von Profilen und persoenlichen Ausnahmen.
- Studenten behalten den bisherigen Vorlagemodus: neue Eintraege werden der Behoerdenleitung vorgelegt; bestehende fachliche Eintraege bleiben schreibgeschuetzt. Private persoenliche Arbeitsmittel behalten ihre eigenen Regeln.
- Vertraulichkeit, Fallzugriff, private Notizen und private Chats behalten ihre bisherigen Grenzen. Die Profile schaffen keinen Zugriff auf fremde Privatnachrichten.

## Bestehende Accounts und Deployment

Die Website stellt alte Accounts beim naechsten Start automatisch auf die neue Struktur um. Es werden keine Accounts geloescht, keine Passwoerter neu gesetzt und keine Arbeitsdaten geloescht.

- Bisherige Master werden als geschuetzte Master uebernommen.
- Ein bereits hinterlegter gueltiger Dienstgrad bleibt erhalten und bestimmt kuenftig die Befugnisse. Ein bisher nur dekorativ zugewiesener AG-/Deputy-Dienstgrad erhaelt damit tatsaechlich Leitungsbefugnisse; ein anderer Dienstgrad ist keine Leitung mehr.
- Fehlende Dienstgrade werden zugeordnet: Leitung → Deputy Attorney General, Staatsanwalt → District Attorney, Referendar → Public Prosecutor Trainee. Bisherige Studenten erhalten den neuen Dienstgrad Student, auch wenn zuvor ein anderer dekorativer Dienstgrad hinterlegt war.
- Alte individuelle Werte, die vom bisherigen Rollenstandard abweichen, bleiben als persoenliche Ausnahmen erhalten. Werte identisch zum alten Standard werden zu vererbten Rechten, damit Profile spaeter wirklich greifen.
- Die alte Benutzer-Eigenschaft role wird bei der Umstellung entfernt. Der Masterstatus liegt in isMaster; effektive Rechte werden aus rankProfiles plus persoenlichen Ausnahmen berechnet. Die Schemakennung im Portalbestand ist accountSchemaVersion: 2.

**Vor dem Deployment eine aktuelle Sicherung des Portalbestands erstellen.** Nach dem gemeinsamen Deployment aller Website-Dateien die Dienstgrade und Ausnahmen unter Personal kurz pruefen. Alte und neue Website-Versionen sollten nicht gleichzeitig betrieben werden: die alte Version versteht die neue Accountstruktur nicht. Ein Rollback auf eine alte Version erfordert die passende Sicherung des alten Bestands.

Keine neue Supabase-Tabelle, kein SQL-Skript und keine neuen Railway-Variablen sind erforderlich. Die Profile werden im bestehenden JSONB-Portalbestand gespeichert. Der Discord-Lesebot muss fuer dieses Update nicht neu deployt werden. Die Umstellung wurde nur lokal mit erfundenen Daten getestet; kein produktiver Datenbestand wurde hier veraendert.

## Pruefung

**npm.cmd test** umfasst die Dienstgrad-, Migrations- und HTTP-Berechtigungstests. **npm.cmd run test:rank-ui** prueft die echte Oberflaeche gegen einen isolierten HTTP-Server: Anlegen ohne Rollenauswahl, persoenliche Ausnahmen, Dienstgradwechsel, Rueckkehr zur Vererbung, Profilverwaltung, Rechteentzug und mobile Darstellung. Die weiteren Desktop-, Chat- und Ticketpruefungen decken die betroffenen Arbeitsbereiche ab.
