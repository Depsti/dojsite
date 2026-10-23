# Strafmaßkatalog und Strafrechner

Quelle: https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit

Ausgelesener Stand: 23.10.2026. Es wurden die tatsächlichen Datenzeilen aller 13 Fachblätter ausgewertet. Die Anzahlen auf dem Übersichtsblatt sind teilweise veraltet. Enthalten sind 166 Zeilen: 155 Strafpositionen, sieben Beteiligungs-/Verfahrensregeln und vier Haftgrenzen. Die Google-Tabelle wurde ausschließlich gelesen.

## Bedienung

Die App **Strafmaßrechner** öffnen. Mit Suche und Bereichsauswahl passende Tatbestände finden und anhaken. Ausgewählte Positionen bleiben bei einem Such- oder Bereichswechsel in der Rechnung. Unter jeder gewählten Position stehen die Beschreibung, Maßnahmen und ein Link zur exakten Quellenzeile.

- Feste Werte werden unmittelbar addiert, ungefähre BGB-Haftwerte mit einem entsprechenden Hinweis berechnet.
- Variable, außergewöhnliche oder nicht bezifferte Beträge müssen ausdrücklich eingegeben werden. Solange Angaben fehlen oder ungültig sind, heißt das Ergebnis **Vorläufige Teilsumme**; offene Werte werden nicht als feststehende Nullstrafe dargestellt.
- Ordnungshaft verlangt eine Eingabe zwischen 10 und 30 HE.
- Die Entscheidungsinstanz begrenzt die Gesamthaft: Exekutive 40 HE, Richter 50 HE, DOJ-Leitung 60 HE, Präsident 80 HE. Eine optionale weitere Grenze kann diese Werte nur verringern. Die Auswahl einer Instanz verleiht keine zusätzlichen Systemrechte oder Entscheidungsbefugnisse.
- Beihilfe mindert nur die zugehörige Position um 20 %. Eine weitere Milderung wirkt anschließend auf Geldstrafe und Haft aller gewählten Positionen. Geldstrafen werden durch eine Haftgrenze nicht vermindert. Die Summe wird vor der Haftbegrenzung dokumentiert.
- Anstiftung und Mittäterschaft übernehmen das Strafmaß der gewählten Haupttat. Versuch verändert die Ausgangsstrafe nicht automatisch; freiwilligen Abbruch gesondert beurteilen. Vortäuschen wird anhand der jeweiligen Haupttat angesetzt. Kollektivstrafe bleibt an die individuelle Feststellung und erforderliche Zustimmung gebunden. Diese Regeln werden nicht zusätzlich als eigene Strafe aufaddiert.
- Angriff auf Pressevertreter erlaubt Grundfall 15 HE oder schweren Fall 25 HE. Beim schweren Widerstand sind die zusätzlich genannten 5 HE bereits in den 15 HE enthalten und werden nicht doppelt addiert.
- Abgelaufene Hauptuntersuchung bietet für Monat 1/2/3 jeweils 150.000/300.000/450.000 $. Ab Monat 4 ist der Führerscheinentzug vermerkt; weil die Quelle keinen Geldbetrag dafür beziffert, verlangt die Rechnung dann eine bewusste manuelle Festlegung.
- Nebenfolgen wie Einziehung, Berufsverbot, Sicherungsverwahrung und lebenslange Haft werden angezeigt. Sie werden weder automatisch angeordnet noch in Hafteinheiten umgerechnet. So bleibt auch der Hinweis auf die Zuständigkeit des Chief of Justice und die schriftliche Begründung bei außergewöhnlichen Fällen sichtbar.

Eigene bezifferte Gesetzbucheinträge stehen zusätzlich unter **Eigene Strafrahmen**. Bereits angelegte Gesetzestexte oder manuelle Strafwerte werden durch diesen Katalog nicht überschrieben. Bei mehreren Tatbestandsvarianten muss der Bearbeiter prüfen, ob sie dieselbe Handlung oder mehrere selbstständige Taten betreffen; die Auswahl selbst ist keine Prüfung von Tatmehrheit oder Ausschlussverhältnissen.

## Dateien und Aktualisierung

- `lib/penalty-source-20261023.json`: unveränderte ausgelesene Zellwerte samt Blattnamen und Abrufstand.
- `scripts/build-penalty-catalog.mjs`: erzeugt den bereinigten Katalog mit Quellenzeilen.
- `public/penalty-catalog.js`: ausgelieferter Katalog.
- `public/sentencing.js`: Berechnungslogik.
- `public/penalty-calculator.js` und `.css`: Oberfläche.

Nach einer bewusst vorgenommenen Aktualisierung der Quelldaten den Katalog mit `npm.cmd run catalog:build` neu erzeugen und die Tests ausführen. Es besteht keine automatische Live-Synchronisation zur Tabelle. Der Generator soll bei künftigen Tabellenänderungen auch auf neue textliche Sonderregeln geprüft werden.

## Deployment und Prüfung

Alle Änderungen gemeinsam auf GitHub übernehmen und den Railway-Service neu deployen. Keine neue Supabase-Migration, Datenbanktabelle, Umgebungsvariable oder Laufzeitabhängigkeit erforderlich. Die bestehende Anmeldung und das Leserecht für den Bereich Gesetzbuch bestimmen weiterhin den Zugriff auf die Rechner-App.

Prüfungen: `npm.cmd test`, `npm.cmd run test:desktop`, `npm.cmd run test:chat`. Die Strafmaßtests vergleichen jede Katalogposition mit den gesicherten Quellenwerten. Im Desktop-Browser werden Suche, Summenbildung, Haftgrenzen, Beihilfe, Ordnungshaft und Hauptuntersuchungsstaffeln überprüft.
