# Arbeitsabläufe im Portal

## Persönlicher Arbeitsstart

Die App **Übersicht** öffnet den persönlichen Arbeitsstart: eigene offene Vorgänge, nächste Schritte der eigenen Fallakten, heutige Termine, offene To-dos, ungelesene persönliche Zuweisungen und Änderungen, zuletzt geöffnete Akten und gespeicherte Entwürfe. Über die Einträge gelangt man direkt zur Akte, zum Termin oder zum To-do. **Aktualisieren** lädt den aktuellen Stand.

## Nächster Schritt je Fallakte

In jeder Fallakte steht eine Karte **Nächster Schritt**. Ohne eigenen Eintrag erscheint ein Vorschlag anhand der vorhandenen Aktenangaben. **Nächsten Schritt öffnen** führt zum passenden Arbeitsbereich. Mit Fall-Bearbeitungsrecht lässt sich ein eigener Schritt mit zuständiger Person und optionaler Frist festlegen. Die Person muss bereits Fall-Bearbeitungszugriff haben; diese Auswahl erteilt keine Rechte. **Schritt erledigt** entfernt den eigenen Schritt und zeigt wieder einen Vorschlag aus dem Aktenstand.

## Anträge aus ausgewählten Inhalten

**Auswahl → Antrag** öffnet eine Auswahl von Personen, Beweismitteln, Dokumenten und Tatvorwürfen der Fallakte. Ein im Aktenfenster markierter Text kann als Auszug übernommen werden. Der vollständige Sachverhalt ist separat auswählbar. Danach erscheint das bestehende, bearbeitbare Antragsformular mit den ausgewählten Personen, Texten und Anlagen. Es wird nichts automatisch eingereicht oder genehmigt. Die Auswahl ist auf 10.000 Zeichen begrenzt; bei Überschreitung muss die Auswahl verkleinert werden.

## Übergabe-Assistent

Mit Zuteilungsrecht und Fall-Bearbeitungsrecht steht **Übergabe-Assistent** zur Verfügung:

1. Offene Punkte und den nächsten Schritt prüfen; zugehörige Aufgaben und Verhandlungen bei Bedarf markieren.
2. Berechtigten Empfänger und Übergabebemerkung angeben; die Übergabe ausdrücklich bestätigen.

Die Zuständigkeiten der Fallakte und der markierten Vorgänge werden ersetzt. Zusätzliche manuelle Fallfreigaben bleiben bestehen. Nicht ausgewählte Vorgänge werden nicht mit übertragen. Vertrauliche Unterlagen behalten ihre bestehenden Sichtbarkeitsregeln. Übergaben werden protokolliert.

## Sammelaktionen

In **Fallakten**, **Verhandlungen**, **Aufgaben**, **Dokumenten**, **Beweismitteln** und **To-do-Listen** gibt es **Sammelaktionen**. Je nach Bereich sind möglich:

- Zuständige ersetzen: Akten, Verhandlungen, Aufgaben und bearbeitbare gemeinsame To-dos.
- Archivieren: verwaltbare Akten, Verhandlungen und Aufgaben.
- Einer Fallakte zuordnen: verwaltbare Beweismittel und bearbeitbare Dokumententwürfe.
- Meinen Teil erledigen: private oder gemeinsame To-dos, für die das Erledigungsrecht besteht.

Maximal 50 Einträge können gemeinsam geändert werden. Jede Auswahl wird serverseitig auf aktuelle Version, Sichtbarkeit und Berechtigung geprüft. Schlägt eine Prüfung fehl, wird die gesamte Auswahl abgelehnt. Private To-dos lassen sich nicht anderen Personen zuweisen. Dokumente in oder nach der Freigabe werden nicht umgehängt.

## Rückgängig

Die **neuen Schritt-, Übergabe- und Sammelaktionen** erhalten einen Rückgängig-Hinweis. Zusätzlich stehen die letzten maximal 20 Aktionen im persönlichen Arbeitsstart. Eine Aktion kann innerhalb von zehn Minuten einmal zurückgenommen werden.

Die Wiederherstellung prüft alle betroffenen Einträge gemeinsam. Neuere Änderungen, abgelaufene Fristen oder entzogene Rechte verhindern das Rückgängigmachen. Andere Personen können die Aktion nicht zurücknehmen. Diese Funktion stellt keine gelöschten Einträge wieder her und widerruft keine bereits versendeten Discord-Nachrichten, Exporte oder veröffentlichten Links.

## Gebündelte Benachrichtigungen und Direktnavigation

Die Glocke gruppiert Hinweise einer Fallakte inklusive ihrer Unterlagen und Fallchats. Private Unterhaltungen bilden eigene Gruppen. Die Anzahl ungelesener Hinweise bleibt sichtbar; eine Gruppe kann gemeinsam als gelesen markiert werden. Jeder einzelne Hinweis behält sein eigenes Ziel.

Beim Öffnen wird die aktuelle Berechtigung erneut geprüft. Kommentare führen zum Kommentarbereich, Freigabeentscheidungen zum Verfahrensbereich, nächste Schritte zur entsprechenden Aktenkarte, Aufgaben und Termine zum jeweiligen Eintrag und Nachrichten direkt zum Chat. Der Zielbereich wird kurz hervorgehoben. Hinweise zum eigenen Zugang öffnen eine Übersicht der eigenen aktuellen Rechte.

## Betrieb und Tests

Die Daten liegen im bestehenden Portalbestand. Für diese Erweiterung sind keine SQL-Migration und keine neuen Railway-Variablen nötig. Nach dem normalen Commit/Push und Deploy stehen die Änderungen bereit; diese Schritte wurden nicht automatisch ausgeführt.

Neue Kern-Dateien: `lib/workflow.mjs`, `public/workflow.js`, `public/workflow.css`, `public/notification-groups.js`. Die Integration nutzt die vorhandenen Antrags-, Zuteilungs-, Benachrichtigungs- und Desktop-Schnittstellen.

Prüfung: `npm.cmd test`, `npm.cmd run test:workflow`, `npm.cmd run test:desktop`, `npm.cmd run test:chat`, `npm.cmd run test:sounds`.
