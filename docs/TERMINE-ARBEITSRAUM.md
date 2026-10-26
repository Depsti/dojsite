# Kalender und Termin-Arbeitsräume

## Die neun Erweiterungen

1. **Aktenverknüpfung:** Im Kalender eine zugängliche Fallakte suchen oder in der Akte „Termin aus Akte planen“ wählen. Das Fallteam kann als Teilnehmerauswahl übernommen werden. Die Akte zeigt ihre zugehörigen Kalendertermine. Weitere Akten können im Arbeitsraum verknüpft werden.
2. **Überschneidungsprüfung:** Beginn, Ende und Teilnehmer werden während der Planung geprüft. Direkt aufeinanderfolgende Termine sind erlaubt. Abgesagte Termine und abgelehnte Teilnahmen blockieren keine Zeit. Beim Speichern wird nochmals geprüft; Überschneidungen verlangen eine ausdrückliche Bestätigung. Bei verborgenen Terminen werden keine Titel oder IDs ausgegeben. Vorhandene Verhandlungen ohne gespeichertes Ende werden für die Prüfung mit einer Stunde Dauer berücksichtigt.
3. **Einladungen:** Eingeladene können zusagen, vorläufig zusagen oder mit Bemerkung absagen. Die Rückmeldungen stehen im Arbeitsraum. Bei einer Änderung von Beginn oder Ende werden Antworten erneut angefragt. Frühere Zeiten und Antworten bleiben für die Terminverwaltung im Verlauf einsehbar. Einladung, Änderungen, Absage und Rückmeldungen erzeugen persönliche Glockenhinweise.
4. **Persönliche Ansichten:** Monat, Woche, Tag und die nächsten sieben Tage; dazu Filter „Meine Termine“, „Mein Fallteam“ und alle sichtbaren Termine. Zeiten werden in der Browser-Zeitzone angezeigt und serverseitig als UTC gespeichert.
5. **Verschieben:** Berechtigte können eine Terminkarte auf einen Kalendertag ziehen oder „Verschieben“ verwenden. Eine Vorschau zeigt bisherige und neue Zeit sowie Konflikte. Die Dauer bleibt erhalten; erst eine zweite Bestätigung speichert die Änderung.
6. **Vorbereitung:** Die Tagesordnung enthält abhakbare Punkte, Texte und sichtbare Urheberschaft. Akten, vorhandene Dokumente und Beweismittel lassen sich daneben verknüpfen. Der Raum ist bereits vor dem Termin verfügbar.
7. **Erinnerungen:** Im Kalender „Erinnerungen einstellen“ wählen. Abstände von einem Tag bis zum Beginn können kombiniert werden; eine leere Auswahl deaktiviert Hinweise. Die Einstellung ist persönlich gespeichert. Hinweise können 15 Minuten oder bis zum Beginn zurückgestellt werden. Beim Wechsel in eine weitere ausgewählte Erinnerungsstufe wird die vorhandene Tonsteuerung berücksichtigt. Erinnerungen benötigen ein geöffnetes Portal; es gibt keinen Hintergrundversand.
8. **Nachbereitung:** Ergebnisse als gemeinsame Blöcke festhalten, Aufgaben erstellen und einen Folgetermin mit übernommener Teilnehmer-/Aktenauswahl planen. Beim Abschluss wählt die Terminverwaltung ausdrücklich die Protokollblöcke und eine bearbeitbare verknüpfte Zielakte. Nur diese Blöcke werden als Aktenvermerk übernommen. Chat, persönliche Notizen und Dateien werden nicht automatisch übernommen.
9. **Gemeinsamer Arbeitsraum:** Kalendertermine öffnen ein eigenes Desktopfenster. Bereiche: Übersicht/Einladungen, Tagesordnung, gemeinsame Notizen, persönliche Notizen, To-dos, Unterlagen/Akten, Terminchat und Ergebnisse/Abschluss. Der Raum aktualisiert seinen Stand bei geöffnetem Portal alle drei Sekunden. Aktive oder ungespeicherte Eingaben werden beim Nachladen erhalten. Gemeinsame Notiztexte werden automatisch gespeichert; Versionsprüfungen verhindern stilles Überschreiben.

## Ein Datensatz, mehrere Ansichten

- Im Raum erstellte To-dos sind die normalen privaten oder gemeinsamen To-dos. Zuständige, optionale Frist und Erledigungsstand gelten in beiden Ansichten. Andere Personen können nur mit dem bestehenden Zuteilungsrecht hinzugefügt werden.
- Persönliche Terminnotizen liegen im eigenen Notizblock in einem Bereich zum Termin. Master und Leitung können fremde persönliche Notizen nicht lesen.
- Dokumente und Beweismittel sind normale Einträge in ihren jeweiligen Bereichen und tragen die Terminherkunft. Ihre bestehenden Bearbeitungs-, Akten- und Freigaberechte gelten weiterhin.
- Bei einer Datei wird bewusst zwischen Terminunterlage, Dokument und Beweismittel unterschieden. Terminunterlagen bleiben im Raum; Dokumente und Beweismittel erscheinen zusätzlich im normalen Bereich. Dateien sind auf 5 MB begrenzt, Terminunterlagen auf 50 Dateien pro Raum.
- Der Terminchat ist im Raum und in der allgemeinen Chatbox unter „Terminchats“ derselbe Chat. Antworten, Haken-/Kreuzreaktionen, Discord-Links und Verweise auf zugängliche Akten/Dokumente sind verfügbar. Lesestände gelten gemeinsam; neue Nachrichten werden hervorgehoben und in der Glocke angezeigt.
- Herkunftsverweise führen aus Notizen, To-dos und Dokumenten zurück zum Termin.

## Rechte und Datenschutz

Der Kalender benötigt das Leserecht für Verhandlungen. Anlegen, Bearbeiten, Verschieben und Abschließen benötigen „Kalender verwalten“. Teamweite Sichtbarkeit des Kalendereintrags ist von Einladungen getrennt: Der Arbeitsraum ist für Ersteller, eingeladene Teilnehmer sowie berechtigte Leitung zugänglich. Ein Teamtermin lädt nicht stillschweigend alle Mitarbeiter ein.

Eine Einladung erteilt keine Fallrechte. Bei einer primären Aktenverknüpfung müssen Teilnehmer bereits den erforderlichen Zugriff besitzen. Weitere verknüpfte Akten und Unterlagen werden beim Abruf nach den eigenen aktuellen Rechten gefiltert. Personen ohne Zugriff bekommen darüber keine Inhalte. Datensätze, die aus einem Raum stammen, berücksichtigen zusätzlich den Raumzugriff.

Studenten bleiben bei gemeinsamen Raumdaten lesend; eigene private Notizen und private To-dos bleiben möglich. Bestehende Rechte und das Prüfverfahren für normale Dokumente werden nicht umgangen. Geschlossene oder abgesagte Räume bleiben lesbar; der Chat nimmt dort keine neuen Nachrichten an. Termine mit gemeinsamen Arbeitsdaten werden nicht physisch gelöscht, sondern abgesagt oder abgeschlossen.

## Speicherung und Betrieb

Die Erweiterung nutzt den vorhandenen geschützten Supabase-JSONB-Bestand in doj_portal_state. Kalenderdaten liegen in organizer.events; gemeinsame Raumdaten und Terminchats am jeweiligen Termin unter room. Persönliche Notizen und To-dos bleiben in organizer.notes bzw. organizer.todos. Normale Dokumente/Beweise liegen weiterhin in records. eventId verbindet die Einträge, ohne sie zu kopieren. Persönliche Erinnerungsabstände liegen unter calendarPreferences.

Der Browser greift ausschließlich über den vorhandenen Railway-Server zu. Es werden keine Supabase-Schlüssel im Client verwendet. Alle Zugriffe und Versionen werden dort geprüft; die vorhandene Bestandsrevision schützt auch mehrere Serverinstanzen. Notiz- und Upload-Sendeversuche besitzen Wiederholschutz, Terminchats zusätzlich Nachrichtenkennungen und ein Limit von fünf Nachrichten in zehn Sekunden. Pro Termin sind maximal 2000 Chatnachrichten sowie 300 Blöcke je gemeinsamem Bereich vorgesehen.

**Supabase:** Keine SQL-Migration, neue Tabelle, Realtime-Freigabe oder Storage-Konfiguration erforderlich. Bestehende Termine werden ohne Datenübernahme unterstützt.

**Railway:** Keine neue Umgebungsvariable oder Abhängigkeit erforderlich. Alle geänderten Dateien einschließlich der neuen lib/calendar.mjs, lib/meeting-room.mjs, public/meeting-room.js und public/meeting-room.css gemeinsam regulär committen, pushen und deployen. Diese Veröffentlichung wurde nicht automatisch ausgeführt.

## Prüfung

- npm.cmd test: Fachlogik, Rechte, Privatsphäre, Konflikte, Einladungen, Versionen, Wiederholschutz und bestehende Funktionen.
- npm.cmd run test:meetings: kompletter Browserablauf gegen den echten HTTP-Server und eine lokale PostgreSQL-Testdatenbank, einschließlich gespeicherter JSONB-Daten, zwei Mitarbeitern, Drag-and-drop, normaler To-do-/Dokumentansicht und Terminabschluss.
- Weitere Regressionen: test:desktop, test:workflow, test:chat, test:sounds und test:ui.

Die Tests verändern keine Produktivdaten. Screenshots liegen in artifacts/chat-qa/termin-arbeitsraum*.png.

Private Notizen und private To-dos bleiben ausschließlich beim Ersteller sichtbar und bearbeitbar, auch wenn die Einladung später entfernt wird. Sie allein verhindern das Löschen eines Termins nicht.
