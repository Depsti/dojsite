# Arbeitsplatz und Aktenwerkzeuge

## Was umgesetzt ist

| Planung | Bedienung |
| --- | --- |
| Haftobergrenze 40 HE | Strafmaßrechner: Standard und Zurücksetzen sind 40 HE. Eine höhere Grenze muss über das Zahlenfeld oder bewusst über eine höhere Vorlage eingestellt werden. |
| Letzte fünf Akten | Auf der Übersicht; der Verlauf bleibt pro Mitarbeiter gespeichert. |
| Meine Arbeit | Eigene Vorgänge, offene persönliche/gemeinsame To-dos und nächste zugängliche Termine. |
| Entwurfssicherung | Aktenassistent, Eintragsformular und Anträge sichern sich nach einer Sekunde Eingabepause unter „Meine Entwürfe“. |
| Strafberechnungen zur Akte | Im Rechner Fallakte wählen, Variante benennen und speichern. Der Server berechnet erneut und übernimmt keine vom Browser behaupteten Ergebnisse. |
| Anträge vorausfüllen | Personen, Aktenzeichen, Sachverhalt und vorhandene Anlagen werden aus der Akte übernommen; Anlagen bleiben abwählbar. |
| Globale Suche | Eigene Desktop-App; Strg+K öffnet die Suche. Durchsucht zugängliche Titel, Aktenzeichen und Beschreibungstexte, keine binären Anhänge. |
| Textbausteine | Persönliche Kategorien und Bearbeitung; Einfügen am Cursor in Formularen mit Textfeldern. Platzhalter: `{{name}}`, `{{datum}}`, `{{aktenzeichen}}`, `{{falltitel}}`. |
| Discord-Verknüpfungen | Nachrichtenlink im ersten Akten-Schritt und beim Bearbeiten; in Fall- und Privatchats über „Discord-Link“ oder Einfügen in den Nachrichtentext. |
| Digitale Verfahrensführung | In der Akte „Verfahrensführung & Prüfung“: fehlende Personen, Beweise, Terminplanung, offene Matrixfragen, zurückgegebene Anträge und unvollständige Berechnungen. |
| Verhandlungsmodus | Tatvorwürfe, Beweis-/Dokumentverweise, übernommenes Strafmaß, gemeinsame Protokolle und getrennte persönliche Notizen. |
| Zeitleiste | Manuelle Sachereignisse und dokumentierte Verfahrensschritte; Verweise auf beteiligte Personen und Akteneinträge. |
| Beweismatrix | Je Tatvorwurf: zu belegende Tatsachen, belastende und entlastende Beweismittel, offene Fragen; Bearbeiten und Entfernen. |
| Prüfung vor Einreichung | Beim Einreichen verknüpfter Dokumente/Anträge werden die Prüfhinweise angezeigt. Bei offenen Hinweisen muss deren Sichtung ausdrücklich bestätigt werden. |
| Gesetzesstand zur Tatzeit | Gesetzesfassungen ansehen; in der Akte einen erfassten Gesetzesstand mit Tatzeitpunkt hinterlegen. Nur Master ändern Gesetze. |
| Strafmaß-Szenarien | Mehrere Varianten vergleichen, im Rechner erneut öffnen und eine vollständige Variante mit Begründung übernehmen. |
| Aktenübergabe | Verlinkte Übersicht über Sachverhalt, Beteiligte, nächste Schritte, Antragsentscheidungen, Termine, Aufgaben und letzte Änderungen; als Text kopierbar. |
| Einsicht für Dritte | Abschnitte auswählen, Einträge auslassen, zusätzliche Begriffe entfernen, bereinigte Vorschau vollständig prüfen; danach DOCX herunterladen oder über den Browser als PDF drucken. |

## Entwürfe und persönliche Daten

Entwürfe, Textbausteine und Verlauf gehören ausschließlich zum angemeldeten Mitarbeiter. Auch Master erhalten über die API keine fremden persönlichen Inhalte. Entwürfe werden über die bestehende Datenbank gespeichert und sind damit geräteübergreifend verfügbar. Nach erfolgreicher Speicherung wird der zugehörige Entwurf entfernt. Alle Schritte eines Aktenassistenten verwenden eine gemeinsame Kennung.

Entwürfe bestehender Datensätze werden nach Rechteentzug nicht mehr ausgeliefert. Bei einem zwischenzeitlich geänderten Eintrag ist vor dem Öffnen zum manuellen Vergleichen eine Bestätigung erforderlich. Ein Entwurf überschreibt nie automatisch einen bestehenden Datensatz.

Grenzen: maximal 100 Entwürfe und 100 Textbausteine pro Person; maximal 250.000 Zeichen pro Entwurfsnutzlast. Dateianhänge werden aus der automatischen Sicherung herausgenommen und müssen nach einer Wiederherstellung erneut ausgewählt werden. Bei fehlgeschlagener Sicherung erscheint ein Hinweis im Formular; nicht gespeicherte letzte Eingaben sind dann nicht wiederherstellbar.

## Einsichtsfassung und Schwärzung

Der Server erstellt ein neues, auf ausdrücklich gewählte Abschnitte begrenztes Datenmodell. HTML und DOCX entstehen ausschließlich daraus. Originaldateien werden nicht mit einem Rechteck überdeckt. Kommentare, Chats, Dateien, Dateimetadaten, interne Arbeitsbereiche und Personenakten werden nicht übernommen.

Namen zugeordneter Personen und Mitarbeiter sowie zusätzliche wörtliche Begriffe werden durch `[GESCHWÄRZT]` ersetzt. Das ersetzt keine Prüfung des Kontextes: Adressen, indirekte Identifizierbarkeit, nicht als Personen erfasste Namen und andere sensible Angaben müssen gegebenenfalls zusätzlich entfernt werden. Die Oberfläche verlangt eine Sichtprüfung vor Download/Druck. Das Original bleibt unverändert.

## Gesetzeshistorie

Beim ersten Start wird für bestehende Gesetze der zu diesem Zeitpunkt bekannte Stand erfasst. Frühere Fassungen oder Gültigkeitszeiträume sind nicht belegt und werden nicht erfunden. Ein Tatzeitpunkt vor der ersten erfassten Fassung kann deshalb nicht automatisch zugeordnet werden.

Ab dann bleiben Änderungen mit Gültigkeitsbeginn, Änderungsgrund und Bearbeiter erhalten. Master können beim Bearbeiten einen Gültigkeitsbeginn innerhalb des bereits erfassten Zeitraums angeben; zukünftige oder hinter dem letzten Stand zurückliegende Versionen werden abgelehnt. Akten erhalten eine Kopie der ausgewählten belegten Fassung und behalten sie bei weiteren Änderungen. Aktuelle Leserechte werden beim Abruf historischer Verweise weiterhin geprüft.

## Technischer Betrieb

Die neuen Daten liegen innerhalb der bestehenden JSONB-Nutzlast von `doj_portal_state`:
- `workbench[userId]`: persönliche Entwürfe, Textbausteine und Aktenverlauf.
- `records[].workflow`: Zeitleiste, Matrix, Protokolle, Strafmaßvarianten, Übernahme und Gesetzesverweise.
- `lawHistory[lawId]`: erfasste Gesetzesfassungen.

Gemeinsame Aktenänderungen verlangen die aktuelle `updatedAt`-Version. Persönliche Entwürfe/Textbausteine besitzen eigene Versionsstände. Die bestehende globale Datenbank-Versionsprüfung bleibt zusätzlich aktiv. Private Hintergrundspeicherungen lösen keinen Neuladezyklus anderer Fenster aus. Rohe interne Workflow-Daten werden nicht über den allgemeinen `/api/state`-Endpunkt ausgeliefert.

Neue Endpunkte: `/api/workbench`, `/api/workbench/{recent,drafts,blocks}`, `/api/cases/:id/workbench`, `/api/cases/:id/workbench/{timeline,charges,protocol,scenarios,lawPins,handover,disclosure}`, `/api/laws/:id/history`.

Bereitstellung: den gesamten aktualisierten Projektstand auf Railway deployen. Keine neue SQL-Migration, keine neuen Umgebungsvariablen und keine zusätzlichen Pakete erforderlich. Der vorhandene Supabase-Zugang des Servers bleibt unverändert. Vorhandene Fallchat-/Privatchat-Migrationen bleiben Voraussetzung für Chats. Beim ersten Start wird die Gesetzeshistorie initialisiert.

Validierung: `npm test`, `npm run test:desktop`, `npm run test:chat`. Der Integrationstest nutzt lokale PostgreSQL-Tabellen und den echten HTTP-Server; keine Produktionsdaten. Beim Einsichtsexport werden auch die entpackten DOCX-XML-Dateien auf entfernte Geheimtexte geprüft.
## Ergänzung: Einsichtslink ohne Anmeldung

Unter „Einsicht für Dritte“ lassen sich geschwärzte oder ungeschwärzte Fassungen nach Prüfung auch per Link freigeben. Der Link zeigt eine feste Kopie und ist zeitlich begrenzbar oder widerrufbar. Details zu Bedienung, Berechtigungen und Veröffentlichung stehen in [OEFFENTLICHE-AKTENEINSICHT.md](OEFFENTLICHE-AKTENEINSICHT.md).
