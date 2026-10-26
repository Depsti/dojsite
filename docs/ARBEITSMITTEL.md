# Persönliche Arbeitsmittel, Kalender und To-do-Listen

## Mein Notizblock

Die Desktop-App **Mein Notizblock** bietet persönliche Notizen mit Titel, Text und frei benennbarem Bereich, beispielsweise „Verhandlungen“, „Ideen“ oder „Allgemein“. Bereichsschaltflächen und Suche helfen beim Wiederfinden. Wichtige Notizen können angeheftet, ältere Notizen archiviert werden. Das Archiv besitzt einen eigenen Anzeigefilter. Jede Notiz zeigt ihren letzten Änderungszeitpunkt.

Notizen sind ausschließlich für ihren Ersteller abrufbar und bearbeitbar. Auch Master und Leitung erhalten im Portal keinen Zugriff auf fremde persönliche Notizen. Persönliche Inhalte werden nicht in das allgemeine Änderungsprotokoll, die Aktenübersicht oder Dokumentexporte übernommen. Änderungen werden ausdrücklich mit **Speichern** gespeichert. Ungespeicherte Formulare werden durch den vorhandenen Entwurfsschutz der Desktopfenster geschützt.

## To-do-Listen

Die neue App **To-do-Listen** ergänzt den bisherigen Bereich **Aufgaben**. Die bisherigen Akten-/Verhandlungszuteilungen bleiben erhalten.

- **Privat:** nur für den Ersteller sichtbar und bearbeitbar, einschließlich persönlicher Aufgaben von Studenten.
- **Gemeinsam:** mehrere zuständige Mitarbeiter auswählen. Sichtbar für Ersteller, Zuständige sowie Master und Leitung mit Aufgaben-Leserecht.
- Gemeinsame Aufgaben verlangen Lese-, Anlege- und Bearbeitungsrecht im bestehenden Aufgabenbereich. Zum erstmaligen Hinzufügen weiterer Personen wird außerdem **Zuteilungen verwalten** benötigt.
- Titel, Beschreibung und optionaler Fälligkeitszeitpunkt werden gespeichert. Einträge zeigen die ursprüngliche Erstellungszeit und die seitdem verstrichene Zeit. Die Zeitangabe aktualisiert sich minütlich.
- Jeder Zuständige mit Aufgaben-Bearbeitungsrecht kann **Meinen Teil erledigen** wählen. Der gesamte Eintrag gilt erst als erledigt, wenn alle Zuständigen fertig sind. Ersteller und berechtigte Leitung können zusätzlich alle Teile abschließen oder wieder öffnen.
- Studenten können ihnen zugewiesene gemeinsame Aufgaben lesen, aber wegen ihrer bestehenden Rolle keine gemeinsamen Aufgaben bearbeiten oder abschließen. Eigene private Aufgaben bleiben bearbeitbar.
- Erledigte Einträge liegen hinter **Erledigte anzeigen**. Ihre Dauer endet am Erledigungszeitpunkt. Beim Wiederöffnen wird die Dauer erneut seit der ursprünglichen Erstellung berechnet.
- Fremde private Aufgaben bleiben auch für Master und Leitung verborgen. Die Sichtbarkeit einer vorhandenen Aufgabe kann nicht von privat auf gemeinsam oder umgekehrt geändert werden; dafür einen neuen Eintrag erstellen.

## Terminkalender und Rechte

Die App **Terminkalender** zeigt einen Monatskalender mit Tagesauswahl und Terminliste. Vorhandene sichtbare Verhandlungen mit gesetztem Termin erscheinen zusätzlich und öffnen ihre bisherige Verhandlungsansicht. Verhandlungen ohne Termin erscheinen weiterhin in der bisherigen Verhandlungsplanung.

Neue Kalendereinträge unterstützen Titel, Bemerkung, Beginn, Ende, Ort, Status, Teilnehmer und eine optionale Fallverknüpfung. Mehrtägige Termine werden an allen betroffenen Tagen angezeigt. Abgesagte Termine bleiben in der Terminliste erkennbar, erzeugen aber keine Erinnerungen.

Der Kalender benötigt das bestehende Leserecht für **Verhandlungen**. Unter **Personal → Befugnisse** gibt es zusätzlich das Sonderrecht **Kalender verwalten**. Standardmäßig besitzen Master und Leitung dieses Recht; anderen Mitarbeitern kann es ausdrücklich erteilt werden. Es erlaubt, zugängliche Kalendereinträge anzulegen, zu bearbeiten, abzusagen und zu löschen. Studenten bleiben bei gemeinsamen Kalendereinträgen ohne Schreibrecht.

Termine können für das gesamte Team oder nur für ausgewählte Personen sichtbar sein. Ersteller und berechtigte Leitung sehen diese Einträge ebenfalls. Bei Fallverknüpfungen bleibt der Zugriff auf die betreffende Fallakte zusätzlich erforderlich. Uhren und Eingabefelder verwenden die Zeitzone des Browsers; neue Termine werden als Zeitpunkte mit Zeitzone gespeichert.

## Erinnerungen

Oben rechts im Hauptfenster erscheinen sichtbare geplante Termine, die innerhalb der nächsten **drei Stunden** beginnen, sowie aktuell laufende Termine. Die Hinweise werden minütlich aktualisiert und erscheinen nach Terminänderungen aus Desktopfenstern zusätzlich zeitnah.

**Öffnen** führt zum Termin beziehungsweise zur Verhandlung. **15 Min.** blendet den jeweiligen Termin vorübergehend aus. Über die Schaltfläche im Hinweis-Kopf lässt sich die gesamte Box einklappen. Bis zu fünf Termine werden gleichzeitig aufgeführt; weitere bleiben im Kalender auffindbar. Die Chatbox unten rechts bleibt davon unabhängig.

Erinnerungen benötigen ein geöffnetes Portal. Es gibt keine Push-Benachrichtigung bei geschlossenem Browser, keinen E-Mail-Versand und keinen zusätzlichen Hintergrunddienst.

## Speicherung und Deployment

Die Arbeitsmittel werden serverseitig im bestehenden Supabase-Portalbestand unter `organizer` gespeichert. Private Listen werden bei jedem Zugriff auf dem Server nach Nutzer gefiltert; der allgemeine `/api/state` enthält diese Daten nicht. Änderungen verlangen die zuletzt geladene Revision des jeweiligen Eintrags. Gleichzeitige Bearbeitungen führen zu einem Konflikthinweis, statt einen neueren Stand zu überschreiben. Wiederholte Sendeversuche sind gegen doppelte Einträge geschützt.

Alle neuen Dateien und die geänderten Server-/Oberflächendateien gemeinsam auf GitHub übernehmen und den Railway-Service neu deployen. **Keine zusätzliche Supabase-Migration, Railway-Variable oder Laufzeitabhängigkeit ist nötig.** Produktivdaten wurden bei der Implementierung nicht verändert und es wurde kein Deployment ausgelöst.

Wichtige Dateien: `lib/organizer.mjs`, `public/organizer.js`, `public/organizer-time.js`, `public/organizer-reminders.js`, `public/organizer.css`. Die neue Berechtigung ist in `lib/access.mjs` und `public/permissions.js` eingebunden.

Prüfungen: `npm.cmd test`, `npm.cmd run test:desktop`, `npm.cmd run test:chat`. Der vollständige lokale Browserlauf prüft auch die tatsächliche Speicherung, Privatsphäre, einzelne Erledigungen, Kalenderrecht, Terminerinnerung und Mobilansicht. Er greift nicht auf Produktivdaten zu.

## Erweiterte Termine und Arbeitsräume

Der Kalender bietet inzwischen Tages-/Wochenansichten, Konfliktprüfung, Einladungen, Verschieben und persönliche Erinnerungsabstände. Kalendertermine öffnen ihren eigenen Arbeitsraum mit verknüpften To-dos, Unterlagen, Notizen und Chat. Bedienung, Rechte und Betrieb: [TERMINE-ARBEITSRAUM.md](TERMINE-ARBEITSRAUM.md).
