// Gemeinsamer, versionierter Grundbestand; persönliche Kopien bleiben getrennt.
export const standardTextblocks=[
  {
    "id": "standard-1-1",
    "category": "Aktenführung",
    "title": "Sachverhalt strukturieren",
    "content": "SACHVERHALT\nAm [Datum] gegen [Uhrzeit] ereignete sich in [Ort] folgender Vorgang:\n[Geschehensablauf in zeitlicher Reihenfolge]\n\nBETEILIGTE\n[Personen und jeweilige Beteiligung]\n\nQUELLEN\n[Dokumente, Aussagen und sonstige Erkenntnisse]",
    "standard": true
  },
  {
    "id": "standard-1-2",
    "category": "Aktenführung",
    "title": "Aktenvermerk",
    "content": "AKTENVERMERK\nAktenzeichen: {{aktenzeichen}}\nDatum: {{datum}}\nBearbeitung: {{name}}\n\nAnlass: [Anlass]\nFeststellungen: [Tatsachen und Quellen]\nOffene Fragen: [Fragen]\nNächster Schritt: [Maßnahme und Zuständigkeit]",
    "standard": true
  },
  {
    "id": "standard-1-3",
    "category": "Aktenführung",
    "title": "Chronologie",
    "content": "CHRONOLOGIE\n[Datum / Uhrzeit] – [Ereignis] – Quelle: [Fundstelle]\n[Datum / Uhrzeit] – [Ereignis] – Quelle: [Fundstelle]\n\nUngeklärte zeitliche Zusammenhänge:\n[Offene Punkte]",
    "standard": true
  },
  {
    "id": "standard-1-4",
    "category": "Aktenführung",
    "title": "Ermittlungsstand",
    "content": "ERMITTLUNGSSTAND\nGesicherte Erkenntnisse: [Feststellungen mit Quellen]\nAbweichende Darstellungen: [Darstellungen mit Quellen]\nNoch ausstehend: [Unterlagen / Maßnahmen]\nWeiteres Vorgehen: [Schritte]",
    "standard": true
  },
  {
    "id": "standard-1-5",
    "category": "Aktenführung",
    "title": "Telefon- oder Gesprächsvermerk",
    "content": "GESPRÄCHSVERMERK\nDatum / Uhrzeit: [Zeitpunkt]\nTeilnehmer: [Namen und Funktion]\nAnlass: [Anlass]\nWesentliche Angaben: [Inhalt]\nVereinbarungen: [Schritte und Termine]\nErfasst durch: {{name}}",
    "standard": true
  },
  {
    "id": "standard-1-6",
    "category": "Aktenführung",
    "title": "Offene Punkte",
    "content": "OFFENE PUNKTE\n• [Punkt 1] – Zuständig: [Name] – Frist: [optional]\n• [Punkt 2] – Zuständig: [Name] – Frist: [optional]\n\nBenötigte Rückmeldung:\n[Konkrete Frage]",
    "standard": true
  },
  {
    "id": "standard-2-1",
    "category": "Beweismittel",
    "title": "Beweismittel dokumentieren",
    "content": "BEWEISMITTEL\nBezeichnung: [Bezeichnung]\nQuelle / Herkunft: [Quelle]\nGesichert am / durch: [Zeitpunkt und Person]\nFundstelle / Link: [Verknüpfung]\nBezug zum Sachverhalt: [Bezug]\nHinweise zur Vollständigkeit: [Hinweise]",
    "standard": true
  },
  {
    "id": "standard-2-2",
    "category": "Beweismittel",
    "title": "Video- oder Audioauswertung",
    "content": "AUSWERTUNGSVERMERK\nAufnahme: [Bezeichnung / Link]\nAusgewerteter Abschnitt: [Zeitmarken]\nWahrnehmbare Vorgänge: [Beobachtungen]\nNicht sicher feststellbar: [Grenzen der Aufnahme]\nBezug zur Akte: {{aktenzeichen}}",
    "standard": true
  },
  {
    "id": "standard-2-3",
    "category": "Beweismittel",
    "title": "Aussage zusammenfassen",
    "content": "AUSSAGEZUSAMMENFASSUNG\nAuskunftsperson: [Name]\nAufgenommen am / durch: [Zeitpunkt und Person]\nWesentliche Angaben: [Angaben]\nEigene Wahrnehmung / Angaben Dritter: [Abgrenzung]\nOffene Rückfragen: [Fragen]",
    "standard": true
  },
  {
    "id": "standard-2-4",
    "category": "Beweismittel",
    "title": "Widersprüche erfassen",
    "content": "ABWEICHENDE ANGABEN\nStreitpunkt: [Punkt]\nDarstellung A mit Quelle: [Angabe]\nDarstellung B mit Quelle: [Angabe]\nVorhandene objektive Anhaltspunkte: [Anhaltspunkte]\nErforderliche Klärung: [Schritt]",
    "standard": true
  },
  {
    "id": "standard-2-5",
    "category": "Beweismittel",
    "title": "Unterlagen nachfordern",
    "content": "Zur weiteren Bearbeitung des Vorgangs {{aktenzeichen}} werden folgende Unterlagen benötigt:\n• [Unterlage]\n• [Unterlage]\n\nBitte übermitteln Sie diese unter Angabe des Aktenzeichens. Falls Unterlagen nicht vorliegen, bitten wir um eine kurze Rückmeldung.",
    "standard": true
  },
  {
    "id": "standard-2-6",
    "category": "Beweismittel",
    "title": "Beweislage prüfen",
    "content": "PRÜFUNG DER BEWEISLAGE\nZu prüfende Feststellung: [Feststellung]\nDafür sprechende Erkenntnisse: [Quellen]\nDagegen sprechende Erkenntnisse: [Quellen]\nNoch offene Fragen: [Fragen]\nVorläufige Bewertung: [Begründete Bewertung]",
    "standard": true
  },
  {
    "id": "standard-3-1",
    "category": "Eilverfahren",
    "title": "Eilverfahrensablauf",
    "content": "ABLAUF DES EILVERFAHRENS\nAnlass: [Anlass]\nOrt: [Ort]\nBeginn: [Uhrzeit]\nWesentliche Schritte: [Ablauf]\nEnde: [Uhrzeit]\nErgebnis: [Ergebnis]",
    "standard": true
  },
  {
    "id": "standard-3-2",
    "category": "Eilverfahren",
    "title": "Beweissicherung im Eilverfahren",
    "content": "BEWEISSICHERUNG\nKanal / Fundstelle: [Link]\nGesicherte Inhalte: [Auflistung]\nZeitpunkt der Sicherung: [Datum / Uhrzeit]\nSichernde Person: [Name]\nHinweise zur Vollständigkeit: [Hinweise]",
    "standard": true
  },
  {
    "id": "standard-3-3",
    "category": "Eilverfahren",
    "title": "Teilnahme dokumentieren",
    "content": "TEILNAHME\nBearbeitender Staatsanwalt: {{name}}\nWeitere Mitarbeiter: [Auswahl im Mitarbeiterregister]\nWeitere anwesende Personen und Funktion: [Angaben]\nBesondere Vorkommnisse: [Angaben]",
    "standard": true
  },
  {
    "id": "standard-3-4",
    "category": "Eilverfahren",
    "title": "Strafmaß begründen",
    "content": "STRAFMASSBEGRÜNDUNG\nZugrunde gelegte Feststellungen: [Feststellungen]\nBerücksichtigte Tatbestände: [Tatbestände]\nMildernde Umstände: [Umstände]\nErschwerende Umstände: [Umstände]\nGeldstrafe: [Betrag]\nHafteinheiten: [HE]\nBegründung der Gesamtbemessung: [Begründung]",
    "standard": true
  },
  {
    "id": "standard-3-5",
    "category": "Eilverfahren",
    "title": "Unterbrechung festhalten",
    "content": "UNTERBRECHUNG\nBeginn / Ende: [Uhrzeiten]\nGrund: [Grund]\nWährenddessen vorgenommene Schritte: [Schritte]\nFortsetzung durch: [Name]",
    "standard": true
  },
  {
    "id": "standard-3-6",
    "category": "Eilverfahren",
    "title": "Eilverfahren abschließen",
    "content": "ABSCHLUSSVERMERK\nErgebnis: [Ergebnis]\nFestgehaltenes Strafmaß: [Betrag / Hafteinheiten]\nBeweissicherung hinterlegt: [Fundstelle]\nVerbleibende Folgeschritte: [Schritte oder keine]\nProtokoll geprüft durch: {{name}} am {{datum}}",
    "standard": true
  },
  {
    "id": "standard-4-1",
    "category": "Anträge",
    "title": "Allgemeiner Antrag",
    "content": "ANTRAG\nZum Verfahren {{aktenzeichen}} – {{falltitel}}\n\nBEANTRAGTE ENTSCHEIDUNG\n[Konkrete Entscheidung]\n\nSACHVERHALT\n[Relevante Tatsachen]\n\nBEGRÜNDUNG\n[Begründung und einschlägige Grundlagen prüfen]\n\nANLAGEN\n[Auflistung]",
    "standard": true
  },
  {
    "id": "standard-4-2",
    "category": "Anträge",
    "title": "Anlagenverzeichnis",
    "content": "ANLAGENVERZEICHNIS\nAnlage 1: [Bezeichnung, Datum, Fundstelle]\nAnlage 2: [Bezeichnung, Datum, Fundstelle]\nAnlage 3: [Bezeichnung, Datum, Fundstelle]",
    "standard": true
  },
  {
    "id": "standard-4-3",
    "category": "Anträge",
    "title": "Ergänzende Begründung",
    "content": "ERGÄNZENDE BEGRÜNDUNG\nBezug: [Antrag / Datum]\nNeu hinzugekommene Erkenntnisse: [Erkenntnisse]\nAuswirkungen auf den Antrag: [Auswirkungen]\nAufrechterhaltene / geänderte Antragspunkte: [Punkte]",
    "standard": true
  },
  {
    "id": "standard-4-4",
    "category": "Anträge",
    "title": "Prüfbitte an Leitung",
    "content": "VORLAGE ZUR PRÜFUNG\nAktenzeichen: {{aktenzeichen}}\nPrüfgegenstand: [Gegenstand]\nEntscheidungsbedarf: [Konkrete Frage]\nVorschlag der Bearbeitung: [Vorschlag mit Begründung]\nBeigefügte Unterlagen: [Unterlagen]",
    "standard": true
  },
  {
    "id": "standard-4-5",
    "category": "Anträge",
    "title": "Antrag zurücknehmen",
    "content": "RÜCKNAHME EINES ANTRAGS\nBezug: [Antrag / Datum / Aktenzeichen]\nZurückgenommener Umfang: [Umfang]\nBegründung: [Begründung]\nWeitere aufrechterhaltene Punkte: [Punkte oder keine]",
    "standard": true
  },
  {
    "id": "standard-4-6",
    "category": "Anträge",
    "title": "Rückfrage zum Antrag",
    "content": "Zum Antrag vom [Datum] im Verfahren {{aktenzeichen}} bitten wir um Klärung folgender Punkte:\n• [Frage]\n• [Frage]\n\nDie Antwort soll sich auf folgende Unterlagen beziehen: [Unterlagen].",
    "standard": true
  },
  {
    "id": "standard-5-1",
    "category": "Verhandlungen & Termine",
    "title": "Termin vorbereiten",
    "content": "TERMINVORBEREITUNG\nTermin / Ort: [Angaben]\nVerknüpfte Akte: {{aktenzeichen}}\nZiel: [Ziel]\nTeilnehmer: [Namen und Funktionen]\nBenötigte Unterlagen: [Unterlagen]\nOffene Aufgaben: [Aufgaben]",
    "standard": true
  },
  {
    "id": "standard-5-2",
    "category": "Verhandlungen & Termine",
    "title": "Tagesordnung",
    "content": "TAGESORDNUNG\n1. Begrüßung und Feststellung der Teilnehmer\n2. Darstellung des aktuellen Sachstands\n3. Erörterung der offenen Fragen\n4. Festhalten der Ergebnisse\n5. Vereinbarung der nächsten Schritte und Zuständigkeiten",
    "standard": true
  },
  {
    "id": "standard-5-3",
    "category": "Verhandlungen & Termine",
    "title": "Sitzungsnotizen",
    "content": "SITZUNGSNOTIZEN\nDatum / Uhrzeit: [Angaben]\nTeilnehmer: [Angaben]\nBesprochene Punkte: [Punkte]\nWesentliche Erklärungen: [Erklärungen mit Zuordnung]\nErgebnisse: [Ergebnisse]\nNächste Schritte: [Aufgaben und Zuständige]",
    "standard": true
  },
  {
    "id": "standard-5-4",
    "category": "Verhandlungen & Termine",
    "title": "Fragenkatalog",
    "content": "FRAGENKATALOG\nThema: [Thema]\n• Welche eigenen Wahrnehmungen wurden gemacht?\n• Wann und wo wurden diese gemacht?\n• Welche weiteren Personen waren anwesend?\n• Welche Unterlagen oder Aufnahmen stehen zur Verfügung?\n• Welche Punkte sind unklar oder beruhen auf Angaben Dritter?",
    "standard": true
  },
  {
    "id": "standard-5-5",
    "category": "Verhandlungen & Termine",
    "title": "Termin nachbereiten",
    "content": "TERMINNACHBEREITUNG\nTermin: [Datum / Bezeichnung]\nErgebnisse: [Ergebnisse]\nZu aktualisierende Aktenbestandteile: [Bestandteile]\nVereinbarte Aufgaben: [Aufgaben mit Zuständigkeit]\nFolgetermin / Frist: [Optional]",
    "standard": true
  },
  {
    "id": "standard-5-6",
    "category": "Verhandlungen & Termine",
    "title": "Terminanfrage",
    "content": "Für den Vorgang {{aktenzeichen}} bitten wir um Abstimmung eines Termins.\nZweck: [Zweck]\nVorgesehene Teilnehmer: [Teilnehmer]\nVorgeschlagene Zeitfenster: [Zeitfenster]\nBenötigte Vorbereitung: [Unterlagen / Vorbereitung]",
    "standard": true
  },
  {
    "id": "standard-6-1",
    "category": "Kommunikation",
    "title": "Eingang bestätigen",
    "content": "Der Eingang Ihrer Unterlagen zum Vorgang {{aktenzeichen}} wird bestätigt. Die Unterlagen werden geprüft. Bitte geben Sie bei weiteren Mitteilungen das Aktenzeichen an.",
    "standard": true
  },
  {
    "id": "standard-6-2",
    "category": "Kommunikation",
    "title": "Sachstand mitteilen",
    "content": "SACHSTANDSMITTEILUNG\nVorgang: {{aktenzeichen}}\nAktueller Bearbeitungsstand: [Stand]\nNoch erforderliche Schritte: [Schritte]\nWeiteres Vorgehen: [Vorgehen]",
    "standard": true
  },
  {
    "id": "standard-6-3",
    "category": "Kommunikation",
    "title": "Rückmeldung erbitten",
    "content": "Zum Vorgang {{aktenzeichen}} benötigen wir eine Rückmeldung zu folgendem Punkt:\n[Konkrete Frage]\n\nBenötigte Angaben / Unterlagen: [Angaben]\nGewünschter Rückmeldetermin: [Optional]",
    "standard": true
  },
  {
    "id": "standard-6-4",
    "category": "Kommunikation",
    "title": "Zuständigkeit klären",
    "content": "ZUSTÄNDIGKEITSKLÄRUNG\nVorgang: {{aktenzeichen}}\nZu klärende Aufgabe: [Aufgabe]\nBisherige Bearbeitung: [Name / Bereich]\nVorgeschlagene Zuständigkeit: [Name / Bereich]\nErbetene Entscheidung: [Entscheidung]",
    "standard": true
  },
  {
    "id": "standard-6-5",
    "category": "Kommunikation",
    "title": "Nachreichung zuordnen",
    "content": "NACHREICHUNG\nBezug: {{aktenzeichen}}\nEingegangen am: [Datum]\nAbsender: [Name]\nInhalt: [Kurzbeschreibung]\nZuordnung innerhalb der Akte: [Abschnitt]\nErforderliche Folgebearbeitung: [Schritt]",
    "standard": true
  },
  {
    "id": "standard-6-6",
    "category": "Kommunikation",
    "title": "Erinnerung",
    "content": "Zum Vorgang {{aktenzeichen}} erinnern wir an die noch ausstehende Rückmeldung vom [Datum].\nOffener Punkt: [Punkt]\nBitte teilen Sie mit, ob und wann die benötigten Angaben zur Verfügung stehen.",
    "standard": true
  },
  {
    "id": "standard-7-1",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Aktenübergabe",
    "content": "AKTENÜBERGABE\nAktenzeichen: {{aktenzeichen}}\nBisherige Bearbeitung: {{name}}\nÜbernahme durch: [Name]\nSachstand: [Stand]\nOffene Aufgaben / Fristen: [Aufgaben]\nWichtige Fundstellen: [Links]\nNächster empfohlener Schritt: [Schritt]",
    "standard": true
  },
  {
    "id": "standard-7-2",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Aufgabe zuweisen",
    "content": "ARBEITSAUFTRAG\nZiel: [Erwartetes Ergebnis]\nAufgaben:\n• [Aufgabe 1]\n• [Aufgabe 2]\nZuständige: [Mitarbeiter]\nBenötigte Unterlagen: [Links]\nAbstimmung bei Rückfragen: [Ansprechpartner]",
    "standard": true
  },
  {
    "id": "standard-7-3",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Bearbeitungsblocker",
    "content": "BEARBEITUNGSHINDERNIS\nBetroffener Vorgang: {{aktenzeichen}}\nHindernis: [Beschreibung]\nAuswirkung: [Auswirkung]\nBenötigte Unterstützung: [Konkrete Bitte]\nMögliche Zwischenmaßnahmen: [Maßnahmen]",
    "standard": true
  },
  {
    "id": "standard-7-4",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Gemeinsames Ergebnis",
    "content": "GEMEINSAMES ARBEITSERGEBNIS\nBeteiligte: [Namen]\nGeprüfte Punkte: [Punkte]\nÜbereinstimmende Feststellungen: [Feststellungen]\nAbweichende Bewertungen: [Bewertungen]\nVereinbartes Vorgehen: [Vorgehen]",
    "standard": true
  },
  {
    "id": "standard-7-5",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Vertretung vorbereiten",
    "content": "VERTRETUNGSVERMERK\nZeitraum: [Zeitraum]\nVertretung: [Name]\nPriorisierte Vorgänge: [Vorgänge]\nAnstehende Termine: [Termine]\nOffene Rückmeldungen: [Rückmeldungen]\nWichtige Hinweise: [Hinweise]",
    "standard": true
  },
  {
    "id": "standard-7-6",
    "category": "Übergabe & Zusammenarbeit",
    "title": "Aufgabenergebnis festhalten",
    "content": "AUFGABENERGEBNIS\nAufgabe: [Bezeichnung]\nDurchgeführt durch: {{name}}\nDatum: {{datum}}\nErgebnis / Fundstelle: [Ergebnis]\nNoch verbleibende Punkte: [Punkte oder keine]",
    "standard": true
  },
  {
    "id": "standard-8-1",
    "category": "Abschluss & Qualität",
    "title": "Abschluss prüfen",
    "content": "ABSCHLUSSPRÜFUNG\n• Sachverhalt und Quellen nachvollziehbar dokumentiert? [Prüfergebnis]\n• Beteiligte und Unterlagen richtig zugeordnet? [Prüfergebnis]\n• Offene Anträge und Aufgaben bearbeitet? [Prüfergebnis]\n• Ergebnis und Folgeschritte festgehalten? [Prüfergebnis]\nPrüfvermerk: [Vermerk]",
    "standard": true
  },
  {
    "id": "standard-8-2",
    "category": "Abschluss & Qualität",
    "title": "Entscheidung dokumentieren",
    "content": "ENTSCHEIDUNGSVERMERK\nGegenstand: [Gegenstand]\nEntscheidung: [Entscheidung]\nTragende Gründe: [Gründe]\nZugrunde gelegte Unterlagen: [Unterlagen]\nWeitere Maßnahmen: [Maßnahmen]\nEntscheidung durch / am: [Name / Datum]",
    "standard": true
  },
  {
    "id": "standard-8-3",
    "category": "Abschluss & Qualität",
    "title": "Korrekturvermerk",
    "content": "KORREKTURVERMERK\nBetroffener Eintrag / Fundstelle: [Fundstelle]\nBisherige Angabe: [Angabe]\nBerichtigte Angabe: [Angabe]\nGrund und Quelle der Berichtigung: [Grund / Quelle]\nErfasst durch: {{name}} am {{datum}}",
    "standard": true
  },
  {
    "id": "standard-8-4",
    "category": "Abschluss & Qualität",
    "title": "Archivierungsvermerk",
    "content": "ARCHIVIERUNGSVERMERK\nAktenzeichen: {{aktenzeichen}}\nAbschlussgrund: [Grund]\nAbschließender Stand: [Stand]\nVerbleibende Folgeschritte: [Schritte oder keine]\nGeprüft durch: {{name}} am {{datum}}",
    "standard": true
  },
  {
    "id": "standard-8-5",
    "category": "Abschluss & Qualität",
    "title": "Weitergabe prüfen",
    "content": "PRÜFUNG DER WEITERGABE\nEmpfänger / Zweck: [Angaben]\nFreigegebener Umfang: [Umfang]\nAusgenommene Inhalte: [Inhalte]\nErforderliche Schwärzungen: [Angaben]\nGeprüfte Fassung / Datum: [Fassung / Datum]",
    "standard": true
  },
  {
    "id": "standard-8-6",
    "category": "Abschluss & Qualität",
    "title": "Kurzüberblick",
    "content": "KURZÜBERBLICK\nVorgang: {{aktenzeichen}} – {{falltitel}}\nKern des Sachverhalts: [Kurzfassung]\nAktueller Stand: [Stand]\nEntscheidende Unterlagen: [Fundstellen]\nNächster Schritt: [Schritt]\nBearbeitung: {{name}} · {{datum}}",
    "standard": true
  }
];
