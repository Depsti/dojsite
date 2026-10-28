# Textbausteine und gemeinsame Aufgabenlisten

## Eilverfahren: Mitarbeiterauswahl

Begleitpersonen werden über eine durchsuchbare Mehrfachauswahl aus dem Mitarbeiterregister ausgewählt. Die Auswahl wird serverseitig geprüft und gewährt den Begleitpersonen keinen zusätzlichen Zugriff. Vorhandene Freitextangaben bleiben als historische Angaben sichtbar. Bereits hinterlegte, inzwischen inaktive Mitarbeiter bleiben erhalten; sie können nicht neu hinzugefügt werden.

## Textbausteine

Die App **Textbausteine** enthält 48 Standardbausteine in acht Kategorien: Aktenführung, Beweismittel, Eilverfahren, Anträge, Verhandlungen & Termine, Kommunikation, Übergabe & Zusammenarbeit, Abschluss & Qualität. Suche und Kategoriefilter helfen beim Finden; ein aufklappbarer Abschnitt zeigt den Inhalt.

Standardbausteine stehen allen Mitarbeitern zur Verfügung und bleiben unverändert. **Als eigenen Baustein übernehmen** erstellt eine unabhängig bearbeitbare persönliche Kopie. Eigene Bausteine bleiben privat. **Text kopieren** kopiert den Rohtext einschließlich Platzhaltern.

In Akten-, Dokument-, Antragsformularen und Eilverfahren lassen sich die Bausteine am Cursor einfügen. {{name}}, {{datum}}, {{aktenzeichen}} und {{falltitel}} werden soweit im Formular bekannt ersetzt. Angaben in eckigen Klammern sind manuell zu ergänzen und vor Verwendung zu prüfen.

## Gemeinsame To-dos

Beim Anlegen oder Bearbeiten eines gemeinsamen To-dos kann unter **Einzelne Aufgaben** eine Liste mit einer Aufgabe je Zeile eingetragen werden. Für jede Aufgabe erscheint für jeden zugewiesenen Mitarbeiter ein eigener Haken. Nur der angemeldete Mitarbeiter kann seinen eigenen Haken ändern. Auch die Leitung und der Master können nicht für andere bestätigen.

Der Fortschritt zählt alle erforderlichen Bestätigungen. Ein gemeinsames To-do ist erst erledigt, wenn alle Zuständigen jede Unteraufgabe bestätigt haben. Beim Entfernen eines eigenen Hakens wird es wieder geöffnet. Ohne Unteraufgaben gibt es wie bisher einen persönlichen Haken für die gesamte Aufgabe. Private To-dos funktionieren unverändert.

Ein geänderter Aufgabentext oder eine neue Aufgabe beginnt ohne Haken. Unveränderte Aufgaben behalten die Haken der weiterhin zugewiesenen Personen. Neue Zuständige müssen selbst bestätigen. Fremde Bestätigungen aus einer Formulareingabe werden nie übernommen.

Dieselben Aufgaben und Bestätigungen erscheinen in der To-do-App, im Termin-Arbeitsraum und im Ticket-Arbeitsraum. Sammelaktionen zum Erledigen bestätigen ausschließlich die eigenen Anteile.

## Bereitstellung

Kein zusätzliches SQL, keine neuen Railway-Variablen und keine Bot-Änderungen erforderlich. Die Website muss mit dem neuen Stand deployed werden. Die zusätzlichen Listen und Mitarbeiter-IDs werden im bestehenden Portalzustand gespeichert. Standardbausteine stammen aus lib/textblocks.mjs; persönliche Kopien bleiben in den vorhandenen persönlichen Arbeitsmitteln.
