# Aktenzeichengenerator

## Format und Kürzel

Beispiel: **Az. 02 StA-Ds 2310/26-GL**.

Bestandteile: laufende Nummer, Gerichts-/Behördenzeichen, optionale Verfahrensart mit Bindestrich, Datum TTMM, Jahr JJ und Namenskürzel. Das Präfix **Az.** kann für Anzeige und Kopieren ein- oder ausgeschaltet werden; das gespeicherte Aktenzeichen bleibt dabei gleich.

Verfügbare Gerichts-/Behördenzeichen: **AG, LG, OLG, BGH, FamG, ArbG, LAG, SG, FG, GewG, VG, DG, PK und StA**. Die Beschreibungen entsprechen der vorgegebenen Abbildung. **Ds** ist als Vorschlag für Strafsache – Einzelrichter, 1. Instanz hinterlegt; weitere Verfahrenskürzel können frei eingegeben werden. Ein leeres Verfahrensfeld erzeugt keinen zusätzlichen Bindestrich.

Datum und Jahr werden mit echten Kalenderregeln einschließlich Schaltjahren geprüft. Zweistellige Jahre entsprechen 2000–2099. Namenskürzel werden aus dem ersten und letzten Namensbestandteil vorgeschlagen und können angepasst werden. Die ausgewählte Person für das Namenskürzel ändert weder Anmeldung noch Berechtigungen; im Protokoll bleibt der tatsächlich handelnde Nutzer gespeichert.

## Bedienung

Im Desktop oder Startmenü die App **Aktenzeichen** öffnen. Alle Angaben prüfen und **Aktenzeichen verbindlich vergeben** drücken. Erst dann wird eine Nummer verbraucht. Die Vorschau ist unverbindlich und kann bei gleichzeitiger Vergabe durch andere Mitarbeiter von der endgültigen Nummer abweichen. Das bestätigte Zeichen steht separat unter **Vergebenes Aktenzeichen** und lässt sich kopieren.

Optional eine bestehende Fallakte zuweisen. Dafür wird das Verwaltungsrecht für diese Akte benötigt. Das bisherige Aktenzeichen bleibt in `referenceHistory` gespeichert und die Änderung wird protokolliert. Bestehende Akten werden nicht automatisch umnummeriert.

Bei **neuen Fallakten** stehen dieselben Eingabefelder im ersten Schritt des Fallassistenten. Der Assistent vergibt das Aktenzeichen erst beim abschließenden Speichern gemeinsam mit der gesamten Akte. Ein abgebrochener Entwurf oder ein ungültiger Personen-/Beweismittelschritt verbraucht keine Nummer. Der bisherige Discord-Import und ältere direkte API-Clients behalten ihr bisheriges Format, solange sie den neuen Generator nicht nutzen.

## Nummernkreis und Rechte

- Laufende Nummern starten bei 01, laufen nach 99 mit 100 weiter und gelten **gemeinsam pro Jahr für alle Gerichts-/Behördenzeichen**.
- Das nächste Jahr besitzt einen eigenen Nummernkreis. Eine andere Datums- oder Kürzelauswahl setzt den Nummernkreis nicht zurück.
- Eine verbindlich vergebene Nummer bleibt verbraucht, auch ohne Fallzuordnung und nach einer späteren Änderung des Aktenzeichens.
- Wiederholungen derselben Anfrage sind mit einer Vergabekennung gegen doppelte Vergabe geschützt. Nach einem nicht eindeutig beantworteten Sendeversuch denselben Entwurf erneut senden.
- Die Speicherung nutzt die bestehende Revisionsprüfung des Portalbestands. Bei konkurrierenden Serverinstanzen wird nur eine Vergabe bestätigt; die andere Anfrage erhält einen Konflikthinweis und muss erneut versucht werden.
- Der Generator setzt Lese- und Anlegerecht für Fallakten voraus. Die Zuweisung zu bestehenden Fällen verlangt zusätzlich das Verwaltungsrecht des jeweiligen Falls.

## Speicherung und Deployment

Nummernkreis und Vergaberegister liegen als `referenceCounters` und `referenceIssues` im bestehenden Supabase-Portalbestand. Sie werden serverseitig gespeichert und im normalen `/api/state` nicht vollständig ausgeliefert. Neue SQL-Tabellen, Supabase-Migrationen und Railway-Variablen sind nicht erforderlich.

Alle Änderungen gemeinsam übernehmen und den Railway-Service neu deployen. Es wurden keine produktiven Daten verändert und kein Deployment ausgeführt.

Wichtige Dateien: `public/reference-format.js`, `public/reference-generator.js`, `public/reference-generator.css`, `lib/references.mjs` sowie die Integration in `public/case-wizard.js` und `lib/http-server.mjs`.

Prüfung: `npm.cmd test`, `npm.cmd run test:desktop`, `npm.cmd run test:chat`. Geprüft werden Format, Kalenderregeln, Jahreswechsel, Wiederholungen, parallele Speicherung und die Fallaktenerstellung.
