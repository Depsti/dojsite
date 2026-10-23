/* Stand der verknüpften Strafmaßtabelle; erzeugt mit scripts/build-penalty-catalog.mjs. */
(function(root){const catalog={
  "version": "2026-10-23",
  "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit",
  "entries": [
    {
      "id": "f8bac2571b46dba38a38b54f",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 7",
      "name": "Anstiftung",
      "description": "Vorsätzliches Verleiten einer anderen Person zur Straftat; Bestrafung wie Täter",
      "fine": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "months": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "measure": "Gleichstellung mit Täter",
      "kind": "rule",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A2:G2"
    },
    {
      "id": "dbf544b79df4744c88a4f62f",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 8",
      "name": "Mittäterschaft",
      "description": "Gemeinschaftliche Begehung einer Straftat mit Tatplan und Beitrag jedes Beteiligten; jeder Mittäter haftet für die gesamte Tat",
      "fine": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "months": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "measure": "Gleichstellung mit Haupttäter; volle Strafe ohne Abzug",
      "kind": "rule",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A3:G3"
    },
    {
      "id": "93be8d02e32f296c3533fa71",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 8",
      "name": "Beihilfe",
      "description": "Vorsätzliche Unterstützung bei einer rechtswidrigen Tat (Fahrzeuge, Waffen, Infos, Flucht, Absicherung); Strafminderung –20 % gegenüber Täter",
      "fine": {
        "kind": "manual",
        "raw": "wie Haupttat –20 %"
      },
      "months": {
        "kind": "manual",
        "raw": "wie Haupttat –20 %"
      },
      "measure": "Milderung gegenüber Täter (20 %)",
      "kind": "rule",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A4:G4"
    },
    {
      "id": "e754982cf6d08bbd75abc37c",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 9",
      "name": "Versuch",
      "description": "Unmittelbares Ansetzen zur Tat ohne Vollendung; freiwilliger Abbruch strafmildernd; äußere Umstände (Festnahme, Gegenwehr) heben Strafbarkeit nicht auf",
      "fine": {
        "kind": "manual",
        "raw": "wie vollendete Tat"
      },
      "months": {
        "kind": "manual",
        "raw": "wie vollendete Tat"
      },
      "measure": "Freiwilliger Abbruch strafmildernd",
      "kind": "rule",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A5:G5"
    },
    {
      "id": "e2274e460de01fc9cc6af266",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 13",
      "name": "Raub",
      "description": "Wegnahme einer Sache durch Gewalt oder Drohung; bewaffneter Raub / Staatseigentum = besonders schwerer Fall",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Sicherungsverwahrung möglich",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A6:G6"
    },
    {
      "id": "fa77dde7efce16b7af95f22c",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 14",
      "name": "Geiselnahme",
      "description": "Freiheitsberaubung zur Nötigung Dritter",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Sicherungsverwahrung",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A7:G7"
    },
    {
      "id": "f3dc5d96ffc8234d41440304",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 15",
      "name": "Betrug",
      "description": "Erlangung eines Vermögensvorteils durch Täuschung oder Verschweigen wesentlicher Tatsachen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Ersatzpflicht, Einziehung",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A8:G8"
    },
    {
      "id": "45e1e1d89535f8247f7f20b7",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 16",
      "name": "Beweismittelfälschung",
      "description": "Manipulation, Fälschung, Veränderung oder Löschung von Beweismitteln (Akten, Fotos, Videos, digitale Daten)",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A9:G9"
    },
    {
      "id": "f32be29a0e30c5aa503afa9b",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 17",
      "name": "Korruption",
      "description": "Missbrauch anvertrauter Macht zum eigenen Vorteil oder zum Vorteil Dritter im Staatsdienst",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Suspendierung, Amtsverlust; ggf. Berufsverbot",
      "kind": "offense",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A10:G10"
    },
    {
      "id": "a5e8460261bc6f68798cf182",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 18",
      "name": "Bestechung",
      "description": "Anbieten, Versprechen oder Gewähren von Geld / Vorteilen an Amtsträger zur Beeinflussung der Amtsführung",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Einziehung",
      "kind": "offense",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A11:G11"
    },
    {
      "id": "03a57f08f2dc80b825bf3543",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 19",
      "name": "Körperverletzung (leicht)",
      "description": "Körperliche Misshandlung oder Gesundheitsschädigung ohne schwere Merkmale",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Schmerzensgeld",
      "kind": "offense",
      "sourceRow": 12,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A12:G12"
    },
    {
      "id": "852588e08506902c8fbf2434",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 19",
      "name": "Körperverletzung (schwer)",
      "description": "Körperverletzung mit Waffe, hinterlistig oder mit Lebensgefahr; Schusswaffeneinsatz kann als Totschlagsversuch gewertet werden",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Bewährung möglich",
      "kind": "offense",
      "sourceRow": 13,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A13:G13"
    },
    {
      "id": "191f9d8599db81591f48763b",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 20",
      "name": "Totschlag",
      "description": "Vorsätzliche Tötung ohne besondere Mordmerkmale; Versuch strafbar",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 14,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A14:G14"
    },
    {
      "id": "87db76d2752b8a39285b4d79",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 21",
      "name": "Mord",
      "description": "Vorsätzliche Tötung mit Heimtücke, Grausamkeit, Habgier oder zur Tatverdeckung; nur durch Gericht verurteilbar",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Lebenslange Haft",
      "kind": "offense",
      "sourceRow": 15,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A15:G15"
    },
    {
      "id": "103df46562a9d682dd842015",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 22",
      "name": "Strafvereitelung im Amt",
      "description": "Amtsträger verhindert absichtlich Strafverfolgung (Beweise zurückhalten, Ermittlungen manipulieren, Meldung unterlassen)",
      "fine": {
        "kind": "fixed",
        "value": 35000,
        "raw": "35000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Amtsverlust, Disziplinarverfahren",
      "kind": "offense",
      "sourceRow": 16,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A16:G16"
    },
    {
      "id": "78a2dee749b1e5bbd0adcea4",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 23",
      "name": "Hehlerei",
      "description": "Ankaufen, Verkaufen, Lagern oder Weitergeben gestohlener / illegal erlangter Gegenstände",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 17,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A17:G17"
    },
    {
      "id": "52ab1dbfc51bc53024288b7c",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 24",
      "name": "Widerstand gegen Vollstreckungsbeamte",
      "description": "Widerstand, Gewalt, Drohung oder aktive Flucht bei rechtmäßiger Diensthandlung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 18,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A18:G18"
    },
    {
      "id": "0c5769a77eed71d385221b46",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 24",
      "name": "Widerstand (schwerer Fall)",
      "description": "Widerstand gegen Vollstreckungsbeamte mit Verletzungsfolge",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft; Verletzung des Beamten = +5 HE",
      "kind": "offense",
      "sourceRow": 19,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A19:G19"
    },
    {
      "id": "f474738b516983edc594f220",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 25",
      "name": "Gefangenenbefreiung",
      "description": "Befreiung eines Gefangenen, Ermöglichen oder Unterstützen der Flucht (inkl. Fahrzeuge, Waffen, Infos)",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 20,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A20:G20"
    },
    {
      "id": "fd2b0832c890679712daaaa8",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 26",
      "name": "Amtsanmaßung",
      "description": "Ausgeben als Beamter, Amtsträger oder staatliche Stelle ohne Berechtigung (falsche Ausweise, Uniformen, Abzeichen)",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Disziplinarverfahren",
      "kind": "offense",
      "sourceRow": 21,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A21:G21"
    },
    {
      "id": "e5ec48fad4a15e89762d5a2d",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 27",
      "name": "Geldwäsche",
      "description": "Einführen, Verschleiern oder Umwandeln illegaler Vermögenswerte in den legalen Wirtschaftskreislauf",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 22,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A22:G22"
    },
    {
      "id": "9a79b1739803002c5fdf2227",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 28",
      "name": "Verkehr mit illegalen Geldmitteln",
      "description": "Besitz, Handel, Transport oder Weitergabe illegaler Geldmittel",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 23,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A23:G23"
    },
    {
      "id": "c93825fcbce731e699361167",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 29",
      "name": "Schweigepflicht und Datenschutz",
      "description": "Unbefugte Weitergabe interner, privater oder dienstlich erlangter Informationen; schwere Fälle: Berufsverbot",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Disziplinarmaßnahme, ggf. Berufsverbot",
      "kind": "offense",
      "sourceRow": 24,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A24:G24"
    },
    {
      "id": "11dc074f7c6324a7cc21847f",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 30",
      "name": "Nötigung",
      "description": "Zwang zu Handlung, Duldung oder Unterlassung durch Gewalt, Drohung oder erheblichen Druck",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 25,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A25:G25"
    },
    {
      "id": "235b5a3278f2bf679f1082c9",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 31",
      "name": "Freiheitsberaubung",
      "description": "Einsperren, Festhalten, Fesseln oder anderweitiges Verhindern der freien Bewegung einer Person",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Schadensersatz",
      "kind": "offense",
      "sourceRow": 26,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A26:G26"
    },
    {
      "id": "3ce84526b4aca79c769965ef",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 32",
      "name": "Störung von Behördenarbeit",
      "description": "Erhebliche Behinderung staatlicher Behörden (Einsätze, Ermittlungen, Kontrollen, Absperrungen, Funkverkehr)",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Haft bei Wiederholung",
      "kind": "offense",
      "sourceRow": 27,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A27:G27"
    },
    {
      "id": "383147ba0a6c30c6d16fe78e",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 35",
      "name": "Schwerer Diebstahl",
      "description": "Diebstahl aus Fahrzeugen, Gebäuden, Tresoren, staatlichen Einrichtungen oder gemeinschaftlich",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Rückgabe, Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 28,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A28:G28"
    },
    {
      "id": "279e5b0afd925dd84ccda79e",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 36",
      "name": "Selbstjustiz",
      "description": "Eigenmächtige Vergeltung oder Bestrafung einer Person ohne gesetzliche Grundlage",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 29,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A29:G29"
    },
    {
      "id": "8dc868f3638c42a8b19c5208",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 37",
      "name": "Meineid",
      "description": "Vorsätzlich falsche Aussage oder Eid vor Gericht oder zuständiger Behörde",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Einziehung der Aussage",
      "kind": "offense",
      "sourceRow": 30,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A30:G30"
    },
    {
      "id": "1dac292f87e92d96bceebf9e",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 38",
      "name": "Amtsmissbrauch",
      "description": "Missbrauch von Befugnissen als Amtsträger zur rechtswidrigen Nötigung einer Person",
      "fine": {
        "kind": "fixed",
        "value": 35000,
        "raw": "35000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Disziplinarverfahren, Suspendierung",
      "kind": "offense",
      "sourceRow": 31,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A31:G31"
    },
    {
      "id": "91a54ad437311dfe53e8a88a",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 39",
      "name": "Kriminelle Vereinigungen",
      "description": "Bildung, Unterstützung oder Mitgliedschaft in kriminellen Vereinigungen",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Organisationsauflösung",
      "kind": "offense",
      "sourceRow": 32,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A32:G32"
    },
    {
      "id": "f27c568a0575510aedebfc2a",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 40",
      "name": "Terroristische Vereinigungen",
      "description": "Bildung, Unterstützung oder Mitgliedschaft in terroristischen Vereinigungen",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Haft, Aberkennung von Ämtern",
      "kind": "offense",
      "sourceRow": 33,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A33:G33"
    },
    {
      "id": "6366fd2e024e4183bf908f7c",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 41",
      "name": "Falschaussage",
      "description": "Bewusstes Falschaussagen gegenüber Gericht, DOJ oder Strafverfolgungsbehörden; Verschweigen wesentlicher Tatsachen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 34,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A34:G34"
    },
    {
      "id": "4af910e718e9f6f8f5013f3e",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 42",
      "name": "Angriff auf staatliche Einrichtungen",
      "description": "Planung, Vorbereitung, Unterstützung oder Durchführung eines Angriffs auf Regierungsgebäude, Polizei, Militär, Krankenhäuser, Gerichte",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Sicherungsverwahrung",
      "kind": "offense",
      "sourceRow": 35,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A35:G35"
    },
    {
      "id": "1bd778f61624ea2d26f6ae58",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 43",
      "name": "Sachbeschädigung",
      "description": "Beschädigung, Zerstörung oder unbefugte Veränderung fremden Eigentums",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Ersatzpflicht",
      "kind": "offense",
      "sourceRow": 36,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A36:G36"
    },
    {
      "id": "4a252200efd59a695ef6921b",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 44",
      "name": "Aufenthalt an illegalen Orten",
      "description": "Aufenthalt in Bereichen, an denen illegale Substanzen / Gegenstände gesammelt, verarbeitet, gehandelt oder transportiert werden",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Platzverweis, Haft bei Wiederholung",
      "kind": "offense",
      "sourceRow": 37,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A37:G37"
    },
    {
      "id": "94faf51a85386cc398ff8961",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 45",
      "name": "Sexuelle Nötigung und Belästigung",
      "description": "Sexuelle Handlungen gegen erkennbaren Willen oder sexuell belästigende Äußerungen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft, Annäherungsverbot (DOJ)",
      "kind": "offense",
      "sourceRow": 38,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A38:G38"
    },
    {
      "id": "35a2202900322f23a5ef5c22",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 46",
      "name": "Nachstellung",
      "description": "Wiederholtes Nachstellen, Kontaktieren, Bedrohen oder Verfolgen einer Person (Stalking)",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Annäherungsverbot",
      "kind": "offense",
      "sourceRow": 39,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A39:G39"
    },
    {
      "id": "fed77a4af078994529dca3a2",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 47",
      "name": "Offene Rechnungen",
      "description": "Erhebliche offene Forderungen; DOJ-Fahndung möglich; Kopfgeldjäger-Einsatz zulässig",
      "fine": {
        "kind": "manual",
        "raw": "Variabel"
      },
      "months": {
        "kind": "manual",
        "raw": "Variabel"
      },
      "measure": "Fahndung, richterliche Entscheidung",
      "kind": "offense",
      "sourceRow": 40,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A40:G40"
    },
    {
      "id": "87a99f7b55a016ae9fcf8f5a",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 48",
      "name": "Erpressung",
      "description": "Zwang zu Handlung, Duldung oder Unterlassung durch Gewalt/Drohung zur eigenen Bereicherung",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Schadensersatz, Haft",
      "kind": "offense",
      "sourceRow": 41,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A41:G41"
    },
    {
      "id": "ae4114b2840e20f990e13829",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 49",
      "name": "Verleumdung / Üble Nachrede",
      "description": "Verleumdung: bewusstes Verbreiten falscher Tatsachen; Üble Nachrede: Verbreiten rufschädigender unbewiesener Tatsachen",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Schadensersatz; nur DOJ / Gericht zuständig",
      "kind": "offense",
      "sourceRow": 42,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A42:G42"
    },
    {
      "id": "dc37fb159e47fd4a24fc367d",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 50",
      "name": "Unterschlagung",
      "description": "Behalten, Verwenden oder Nichtherausgeben fremden Eigentums ohne Rechtsgrundlage (inkl. Bitcoin, Fahrzeuge, digitale Assets)",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Ersatzpflicht, Haft",
      "kind": "offense",
      "sourceRow": 43,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A43:G43"
    },
    {
      "id": "9803960603b810660aecae96",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 51",
      "name": "Verbreitung von Aufnahmen von Straftaten",
      "description": "Unbefugtes Verbreiten von Bild-/Videoaufnahmen von Straftaten oder verletzter / hilfloser / getöteter Personen",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Medienlöschung, Haft",
      "kind": "offense",
      "sourceRow": 44,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A44:G44"
    },
    {
      "id": "8660bb56f5bb659fd489535c",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 52",
      "name": "Amtsputsch",
      "description": "Versuch, einen rechtmäßig eingesetzten Amtsträger zu entfernen, Befugnisse einzuschränken oder staatliche Strukturen zu übernehmen ohne Rechtsgrundlage; Versuch strafbar",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Haft, Aberkennung aller Ämter",
      "kind": "offense",
      "sourceRow": 45,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A45:G45"
    },
    {
      "id": "f214667a63f7bda19e603473",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 53",
      "name": "Hochverrat",
      "description": "Destabilisierung oder Beseitigung staatlicher Ordnung / Institutionen durch Gewalt, Drohung, geheime Absprachen oder Einflussnahme; Planung bereits strafbar",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Haft, dauerhaftes Berufsverbot",
      "kind": "offense",
      "sourceRow": 46,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A46:G46"
    },
    {
      "id": "a38d2a28fd84b3182ff18d13",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 54",
      "name": "Illegaler Aufenthalt",
      "description": "Aufenthalt im Staat Retro trotz gesetzlicher oder behördlicher Untersagung; gilt auch für Mitglieder staatsfeindlicher Organisationen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Ausweisung, Haft",
      "kind": "offense",
      "sourceRow": 47,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A47:G47"
    },
    {
      "id": "a14fbe5ee0decf9b6796717b",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 55",
      "name": "Falschberichterstattung",
      "description": "Wissentliches Veröffentlichen, Verändern oder Verbreiten falscher Tatsachen zur Irreführung der Öffentlichkeit oder Schädigung von Personen / Institutionen",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Disziplinarmaßnahme, Haft; Satire ausgenommen",
      "kind": "offense",
      "sourceRow": 48,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A48:G48"
    },
    {
      "id": "b174bae0422d54b39afb8a3a",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 56",
      "name": "Verletzung der Privatsphäre (Presse)",
      "description": "Unbefugte Bild- oder Tonaufnahmen in privaten Räumen (Wohnungen, Hotels, Büros, Vereinsräume) ohne Zustimmung",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Löschung der Daten",
      "kind": "offense",
      "sourceRow": 49,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A49:G49"
    },
    {
      "id": "bd15e991cec1718f9a0dcec2",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 57",
      "name": "Diffamierung und Hetze",
      "description": "Beleidigung, Verächtlichmachung, Verleumdung oder Aufruf zu Hass und Feindseligkeit gegen Personen, Gruppen oder Institutionen durch Medien",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Schadensersatz, Haft",
      "kind": "offense",
      "sourceRow": 50,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A50:G50"
    },
    {
      "id": "34868b3fc2fd14cb5ac102f0",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 58",
      "name": "Behinderung von Ermittlungen durch Pressearbeit",
      "description": "Veröffentlichungen, die laufende Ermittlungen, Gerichtsverfahren oder behördliche Maßnahmen behindern (vertrauliche Ergebnisse, Vorverurteilungen)",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Mediensperre",
      "kind": "offense",
      "sourceRow": 51,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A51:G51"
    },
    {
      "id": "62c608d6745038480da8e716",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 59",
      "name": "Missbrauch der Pressefreiheit",
      "description": "Missbrauch der Pressefreiheit zur Verdeckung von Straftaten, Unterstützung von Tätern oder Erzwingen von Zugang zu geschützten Bereichen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Entzug der Presseakkreditierung",
      "kind": "offense",
      "sourceRow": 52,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A52:G52"
    },
    {
      "id": "be210438d7d555b0bcd75fe5",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 60",
      "name": "Behinderung der Pressearbeit",
      "description": "Behinderung von Pressevertretern bei rechtmäßiger Ausübung ihrer Tätigkeit",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 53,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A53:G53"
    },
    {
      "id": "b7221855c4cbadbc4e19327a",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 61",
      "name": "Bedrohung von Pressevertretern",
      "description": "Bedrohung, Einschüchterung oder Druckausübung gegen Pressevertreter wegen ihrer Tätigkeit",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Unterlassung",
      "kind": "offense",
      "sourceRow": 54,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A54:G54"
    },
    {
      "id": "09efcf4ac2366cc374c3924b",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 62",
      "name": "Angriff auf Pressevertreter",
      "description": "Körperlicher Angriff auf Pressevertreter während oder wegen ihrer Tätigkeit; schwerer Fall bei Waffen oder mehreren Tätern",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft; schwerer Fall: 25 HE",
      "kind": "offense",
      "sourceRow": 55,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A55:G55",
      "variants": [
        {
          "id": "standard",
          "label": "Grundfall",
          "months": 15
        },
        {
          "id": "severe",
          "label": "Schwerer Fall",
          "months": 25
        }
      ]
    },
    {
      "id": "98df167467b346e90e728063",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 63",
      "name": "Ausbruch aus dem Staatsgefängnis",
      "description": "Verlassen des Gefängnisses, eines Haftbereichs oder Transports ohne Erlaubnis; Beihilfe ebenfalls strafbar; Wiederergreifung kann Einzelhaft / Isolationshaft zur Folge haben",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft, ggf. Einzelhaft / Isolationshaft",
      "kind": "offense",
      "sourceRow": 56,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A56:G56"
    },
    {
      "id": "6d9bdc26b4f4c897ec194811",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 64",
      "name": "Haus- und Wohnungseinbruch",
      "description": "Unbefugtes Betreten oder Aufenthalten in Gebäude / Wohnung / Grundstück; kein tatsächlicher Diebstahl erforderlich; Einbruchswerkzeug = erschwerender Umstand",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Einziehung aufgefundener Güter ohne Eigentumsnachweis",
      "kind": "offense",
      "sourceRow": 57,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A57:G57"
    },
    {
      "id": "806eeb5b09fe905960eba702",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 65",
      "name": "Vermummungsverbot",
      "description": "Verbergen oder Verdecken der Identität durch Masken, Helme oder ähnliche Mittel im öffentlichen Raum ohne triftigen Grund (bei Versammlungen, Kontrollen, polizeilichen Maßnahmen)",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Platzverweis, Haft",
      "kind": "offense",
      "sourceRow": 58,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A58:G58"
    },
    {
      "id": "0ef646b4ba7e7aa251804a81",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 66",
      "name": "Sperrzone",
      "description": "Unbefugtes betreten einer ausgerufenen Sperrzone",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Platzverweis",
      "kind": "offense",
      "sourceRow": 59,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A59:G59"
    },
    {
      "id": "e072182eb877f9be6bdfdcf7",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 67",
      "name": "Missachtung Polizeilicher Anweisung",
      "description": "Nichbefolgen rechtmäiger Anweisung von Amtsträgern",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 60,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A60:G60"
    },
    {
      "id": "a88f53f7daa2feac54aa2fd9",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 68",
      "name": "Unterlassene Hilfeleistung",
      "description": "Nichtleisten von erforderlicher Hilfe",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Platzverweis",
      "kind": "offense",
      "sourceRow": 61,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A61:G61"
    },
    {
      "id": "5998a5f2e438ae202f818b39",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 69",
      "name": "Beleidigung und üble Nachrede",
      "description": "Verbale ausdrücke und rufschädigende Aussagen",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 62,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A62:G62"
    },
    {
      "id": "78f85da8f349851395fdbc3d",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 70",
      "name": "Bedrohung",
      "description": "Bewusstes erzeugen von Angst oder Druck",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 63,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A63:G63"
    },
    {
      "id": "736f95aad6d2ab9ab37342e6",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 71",
      "name": "Besitz illegaler Gegenstände",
      "description": "Besitz, lagern, transportieren oder weitergabe",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 64,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A64:G64"
    },
    {
      "id": "18aba420473767d946f3ec1d",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 72",
      "name": "Vortäuschen einer Straftat",
      "description": "Das selbe wie bei einer begangenen Straftat",
      "fine": {
        "kind": "manual",
        "raw": "/"
      },
      "months": {
        "kind": "manual",
        "raw": "/"
      },
      "measure": "",
      "kind": "rule",
      "sourceRow": 65,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A65:G65"
    },
    {
      "id": "8355f0e8c9c28b6384b9dde4",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 73",
      "name": "Sittenwidriges Verhalten in der Öffentlichkeit",
      "description": "Gegen das allgemeine Anstands- und Moralempfinden",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 66,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A66:G66"
    },
    {
      "id": "235b8e7f8f7b99b1ba5e9d16",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 74",
      "name": "Gefangenenmeuterei",
      "description": "Unruhe stiften im Staatsgefängnis",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 67,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A67:G67"
    },
    {
      "id": "318bf765126e570c2d2c2004",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 78",
      "name": "Einschüchterung von Zeugen",
      "description": "Das bewusste bedrohen und einschüchtern von Zeugen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 68,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A68:G68"
    },
    {
      "id": "fe79a3d8d4ceab408ce1a7ba",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 79",
      "name": "Gefährdung staatlicher Einsätze",
      "description": "Das bewusste provozieren und gefährden staatlicher Einsätze",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 69,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A69:G69"
    },
    {
      "id": "b5d928098f09fa607b9dfb8e",
      "book": "StGB",
      "sheet": "StGB",
      "paragraph": "§ 80",
      "name": "Behinderung verdeckter Ermittlungen",
      "description": "Das bewusste provozieren und gefährden verdeckter Ermittlungen",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Bußgeld",
      "kind": "offense",
      "sourceRow": 70,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1332526295&range=A70:G70"
    },
    {
      "id": "5bb0fcc5dfe50d55d4f70a11",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 26",
      "name": "Kontaktverbot",
      "description": "Gerichtliches Verbot des Kontakts, der Annäherung oder des Betretens von Orten des Opfers; Verstoß ist strafbar",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Nebenentscheidung, Schutzmaßnahme",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A2:G2"
    },
    {
      "id": "a3e51087c85fdb2beee5aa15",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 29",
      "name": "Berufsverbot",
      "description": "Temporäres oder dauerhaftes Verbot der Berufsausübung bei Missbrauch des Berufs; Überprüfung alle 2 Wochen bei Dauerverbot",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Nebenentscheidung",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A3:G3"
    },
    {
      "id": "b59e3ab48139a6d125be1c1a",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 31",
      "name": "Vermögensabschöpfung",
      "description": "Abschöpfung unrechtmäßig erlangter Gewinne oder Ersatz von Umweltschäden",
      "fine": {
        "kind": "manual",
        "raw": "Variabel"
      },
      "months": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "measure": "Zusätzliche Geldstrafe",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A4:G4"
    },
    {
      "id": "16685bcb0356920c271a15b7",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 33",
      "name": "Kollektivstrafe",
      "description": "Bei gemeinschaftlichen Straftaten gemeinsame Bewertung möglich; Beteiligung individuell festzustellen; Zustimmung DOJ oder ranghöchster Beamter erforderlich",
      "fine": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "months": {
        "kind": "manual",
        "raw": "wie Haupttat"
      },
      "measure": "Individuelle Feststellung der Beteiligung",
      "kind": "rule",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A5:G5"
    },
    {
      "id": "302a4acd8a5efc17ae43b823",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 34",
      "name": "Gesamtstrafenbildung",
      "description": "Mehrere Taten werden zusammen bewertet und dokumentiert",
      "fine": {
        "kind": "manual",
        "raw": "kumulativ"
      },
      "months": {
        "kind": "manual",
        "raw": "kumulativ"
      },
      "measure": "Dokumentationspflicht",
      "kind": "rule",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A6:G6"
    },
    {
      "id": "54ac9c5545c1327621c3a178",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 35",
      "name": "Ordnungsgeld",
      "description": "Ordnungsmittel bei Missachtung, Störung oder Nichterscheinen vor Gericht; Warnung vorab erforderlich",
      "fine": {
        "kind": "fixed",
        "value": 100000,
        "raw": "100000"
      },
      "months": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "measure": "Gerichtliche Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A7:G7"
    },
    {
      "id": "ed83ddcd73548bab8f92f600",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 35",
      "name": "Ordnungshaft",
      "description": "Schwerwiegende Störung der Gerichtshoheit",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "range",
        "min": 10,
        "max": 30,
        "raw": "10 – 30"
      },
      "measure": "Gerichtliche Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A8:G8"
    },
    {
      "id": "4c469ceab2ddf972a6d5fd35",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 36",
      "name": "Haftgrenze – Exekutive",
      "description": "Maximale Haftzeit durch Exekutive",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Verwaltungsregel; Überschreitung unzulässig",
      "kind": "cap",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A9:G9"
    },
    {
      "id": "2ba1b96ea0c455db6e0100aa",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 36",
      "name": "Haftgrenze – Richter",
      "description": "Maximale Haftzeit durch Richter bei Gerichtsverfahren",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "fixed",
        "value": 50,
        "raw": "50"
      },
      "measure": "Gerichtsentscheidung",
      "kind": "cap",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A10:G10"
    },
    {
      "id": "ec5fc88f7a21ea34d3772286",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 36",
      "name": "Haftgrenze – DOJ Leitung",
      "description": "Maximale Haftzeit durch DOJ Leitung",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "fixed",
        "value": 60,
        "raw": "60"
      },
      "measure": "DOJ-Entscheidung",
      "kind": "cap",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A11:G11"
    },
    {
      "id": "8d6eecab94f8c29b288f3efc",
      "book": "StPO",
      "sheet": "StPO",
      "paragraph": "§ 36",
      "name": "Haftgrenze – Präsident",
      "description": "Maximale Haftzeit durch Präsidenten",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "fixed",
        "value": 80,
        "raw": "80"
      },
      "measure": "Präsidialentscheidung",
      "kind": "cap",
      "sourceRow": 12,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=164645356&range=A12:G12"
    },
    {
      "id": "076d240e35728560e144d914",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 7",
      "name": "Anfechtung",
      "description": "Nichtiger Vertrag durch Irrtum, Täuschung oder falsche Übermittlung; erfolgreiche Anfechtung = Nichtigkeit ab Beginn",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "approx",
        "value": 5,
        "raw": "≈ 5"
      },
      "measure": "Rückabwicklung, Schadensersatz",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A2:G2"
    },
    {
      "id": "07662eb2e4a6cda29d076092",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 8",
      "name": "Schadensersatz",
      "description": "Vorsätzliche oder fahrlässige Schadensverursachung; Wiederherstellung des ursprünglichen Zustands",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 0,
        "raw": "0"
      },
      "measure": "Zivilrechtliche Ersatzpflicht",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A3:G3"
    },
    {
      "id": "24734039502ab96d893685e9",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 12",
      "name": "Ehe – Falschangaben",
      "description": "Täuschung über Identität oder Ehefähigkeit bei Eheschließung vor dem DOJ",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "approx",
        "value": 10,
        "raw": "≈ 10"
      },
      "measure": "Nichtigkeit, Disziplinarfolge",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A4:G4"
    },
    {
      "id": "1401193b17dd92a9405fa072",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 14",
      "name": "Namensrecht – Verstoß",
      "description": "Namensänderung ohne triftigen Grund oder ohne DOJ-Genehmigung",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "approx",
        "value": 5,
        "raw": "≈ 5"
      },
      "measure": "Rücknahme, Verwaltungsstrafe",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A5:G5"
    },
    {
      "id": "599591a0a660b71453f63544",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 16",
      "name": "Testament – Fälschung",
      "description": "Gefälschtes oder manipuliertes Testament (unechte / verfälschte Urkunde)",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "approx",
        "value": 15,
        "raw": "≈ 15"
      },
      "measure": "Nichtigkeit, Haft",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A6:G6"
    },
    {
      "id": "8604680014aeadc60c3f3c66",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 17",
      "name": "Todesfall – Pflichtverletzung",
      "description": "Weigerung, Autopsie durchzuführen / Bericht vorzulegen; vorzeitige Leichenfreigabe vor Abschluss aller Untersuchungen",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 50,
        "raw": "50"
      },
      "measure": "Amtspflichtverletzung, Dienstvergehen",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A7:G7"
    },
    {
      "id": "d5f74c68a63fb14757572609",
      "book": "BGB",
      "sheet": "BGB",
      "paragraph": "§ 19",
      "name": "Bestattung – Fristverstoß",
      "description": "Beerdigung vor Fristablauf oder ohne DOJ-Genehmigung (Feuer-/Seebestattung)",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "approx",
        "value": 5,
        "raw": "≈ 5"
      },
      "measure": "Verwarnung, Disziplinarfolge",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=746083315&range=A8:G8"
    },
    {
      "id": "cfabd3f96a4af917fa4abd96",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 7",
      "name": "Pflichtverletzung Verschwiegenheit",
      "description": "Unbefugte Weitergabe dienstlicher Informationen, Akten, Ermittlungen oder interner Vorgänge; gilt auch nach Ausscheiden",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Entlassung, Haft, Berufsverbot",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A2:G2"
    },
    {
      "id": "048f79e2c98b0c0b07a70f78",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 10",
      "name": "Disziplinarverstoß",
      "description": "Fehlverhalten, Pflichtverletzungen oder dienstschädigendes Verhalten eines Beamten",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Mündliche/schriftliche Verwarnung, Suspendierung, Degradierung, Entlassung",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A3:G3"
    },
    {
      "id": "f1f7f2fe7bca38e3d15d210c",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 14",
      "name": "Korruption im Staatsdienst",
      "description": "Annahme von Geld, Geschenken oder Vorteilen, die die Amtsführung beeinflussen; Bestechung, Bestechlichkeit, Vorteilsnahme",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Entlassung, Haft, dauerhaftes Berufsverbot",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A4:G4"
    },
    {
      "id": "0b4b920e2fe7edf11165d023",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 15",
      "name": "Verletzung der Verschwiegenheitspflicht",
      "description": "Weitergabe dienstlicher Informationen, Akten, Einsatzdaten an unbefugte Personen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Entlassung, Berufsverbot, Haft",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A5:G5"
    },
    {
      "id": "2e0a3b4b3f16bda9bab2f7ba",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 16",
      "name": "Hochverrat (Beamter)",
      "description": "Weitergabe vertraulicher Staatsinformationen, geheimer Akten, Einsatzinfos oder Unterstützung krimineller / feindlicher Gruppen",
      "fine": {
        "kind": "fixed",
        "value": 50000,
        "raw": "50000"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Besonders schwere Strafe, Entlassung, dauerhaftes Berufsverbot",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A6:G6"
    },
    {
      "id": "0629fc93461b3e76d6711031",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 18",
      "name": "Amtsmissbrauch (besonders schwer)",
      "description": "Schwere Korruption, Hochverrat, schwerer Amtsmissbrauch, Straftaten gegen das Leben oder Gefährdung der Staatssicherheit durch Beamte",
      "fine": {
        "kind": "manual",
        "raw": "außergewöhnlich"
      },
      "months": {
        "kind": "manual",
        "raw": "außergewöhnlich"
      },
      "measure": "Lebenslange Haft nur durch Chief of Justice; schriftliche Begründung Pflicht",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A7:G7"
    },
    {
      "id": "3b94cfbfad180f2b6a919fef",
      "book": "BeamtG",
      "sheet": "BeamtenG",
      "paragraph": "§ 19",
      "name": "Berufsverbot",
      "description": "Schweres Fehlverhalten durch Beamten, das das Vertrauen des Staates missbraucht",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "measure": "Zeitlich oder dauerhaft; DOJ / State Administration zuständig",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1449244973&range=A8:G8"
    },
    {
      "id": "833d20646cd08691fc8c8dc5",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 4",
      "name": "Unerlaubter Datenzugriff",
      "description": "Zugriff auf Daten, Akten oder Beweismittel ohne schriftlichen Antrag und DOJ-Aufsicht",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Disziplinarmaßnahme, Haft",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A2:G2"
    },
    {
      "id": "9409d55de1cf350c1bf11e65",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 5",
      "name": "Unbefugte Operation",
      "description": "Operation, Durchsuchung oder Festnahme ohne Genehmigung des DOJ oder Richters (außer Gefahr im Verzug ohne Nachmeldung)",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Suspendierung, Haft",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A3:G3"
    },
    {
      "id": "de04c57be67a9e97e326f340",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 6",
      "name": "Eigenständige Überwachung",
      "description": "Überwachung von Telekommunikation, Finanzbewegungen oder Standortdaten ohne DOJ-Genehmigung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Disziplinarverfahren, Haft",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A4:G4"
    },
    {
      "id": "65493b36e953d7750a3a6dec",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 9",
      "name": "Eigenmächtige Übernahme von Ermittlungen",
      "description": "Übernahme von Ermittlungen ohne Abstimmung mit dem DOJ",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Rückgabe an zuständige Behörde, Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A5:G5"
    },
    {
      "id": "adb3a75b33dba88e4f293d0b",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 12",
      "name": "Verletzung Geheimhaltung",
      "description": "Unbefugte Weitergabe von Agency-Ermittlungsinformationen",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Disziplinarmaßnahme, Haft",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A6:G6"
    },
    {
      "id": "c4b06bf38ef050c45926c471",
      "book": "AggG",
      "sheet": "AggG",
      "paragraph": "§ 13",
      "name": "Verdeckte Operation ohne Genehmigung",
      "description": "Verdeckte Operation ohne Genehmigung von DOJ und State Administration",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Suspendierung, Haft",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=556506849&range=A7:G7"
    },
    {
      "id": "b36673490b608d79dd5ab2f7",
      "book": "MilG",
      "sheet": "MilG",
      "paragraph": "§ 2",
      "name": "Unbefugte Aktivierung",
      "description": "Einsatz der U.S. Army ohne Bestätigung durch Präsident oder Governor innerhalb von 12 Stunden; Einsatz ist unverzüglich zu beenden",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Haft, Deaktivierung des Einsatzes",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1517169779&range=A2:G2"
    },
    {
      "id": "4ba09acd4d085023f2118c2f",
      "book": "MilG",
      "sheet": "MilG",
      "paragraph": "§ 3",
      "name": "Unbefugter Einsatz",
      "description": "Aktivierung oder Einsatz ohne Anweisung / Genehmigung des Governors oder Präsidenten",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Haft, Amtsverlust",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1517169779&range=A3:G3"
    },
    {
      "id": "07f9d9c368c22ab4c3d243b8",
      "book": "MilG",
      "sheet": "MilG",
      "paragraph": "§ 4",
      "name": "Eingriff in zivile Angelegenheiten",
      "description": "Militärische Einflussnahme auf zivile Ermittlungen oder Polizeiaktionen ohne Anweisung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Disziplinarverfahren",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1517169779&range=A4:G4"
    },
    {
      "id": "cefb6738804f00bb4d713d17",
      "book": "MilG",
      "sheet": "MilG",
      "paragraph": "§ 8",
      "name": "Verletzung militärisches Disziplinarrecht",
      "description": "Befehlsverweigerung, Missbrauch von Ausrüstung, eigenmächtiges Handeln, Gefährdung der öffentlichen Sicherheit",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Disziplinarmaßnahme intern; schwere Fälle: DOJ-Meldung",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1517169779&range=A5:G5"
    },
    {
      "id": "0dd33b89f9e1e38c052ef0da",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 2",
      "name": "Unverhältnismäßige Polizeimaßnahme",
      "description": "Maßnahme nicht legitim, ungeeignet, nicht erforderlich oder unangemessen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Disziplinarverfahren, Suspendierung",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A2:G2"
    },
    {
      "id": "2f61a7a077dfe1a4f9c7b4fd",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 3",
      "name": "Maßnahmen gegen Unbeteiligte",
      "description": "Eingriff gegen unbeteiligte Person ohne unmittelbare Gefahr oder zwingende Notwendigkeit",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Dienstaufsicht",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A3:G3"
    },
    {
      "id": "6c790b33f8446227494c9f02",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 6",
      "name": "Unzulässige Personenkontrolle",
      "description": "Identitätsfeststellung ohne Tatverdacht, gefährdeten Ort oder Gefahrenabwehrgrund",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, interne Prüfung",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A4:G4"
    },
    {
      "id": "f78e2a7cb89f37da45e8d74e",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 7",
      "name": "Unzulässige Fahrzeugkontrolle",
      "description": "Fahrzeugkontrolle ohne Verkehrsverstoß, Tatverdacht oder allgemeine Kontrollbefugnis",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A5:G5"
    },
    {
      "id": "3ef303aa7d8acd06d47ffc40",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 8",
      "name": "Unrechtmäßige Festnahme",
      "description": "Freiheitsentzug ohne frische Tat, Fluchtgefahr oder ungeklärte Identität",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Haft, Suspendierung",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A6:G6"
    },
    {
      "id": "08eab2505786c99245085348",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 9",
      "name": "Missbrauch von Einsatzmitteln",
      "description": "Unverhältnismäßiger Einsatz von Schusswaffe, Taser oder Schlagstock ohne erhebliche Gefahr für Leib / Leben",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Disziplinarverfahren, Amtsverlust",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A7:G7"
    },
    {
      "id": "2d26c106b6d7d57bfee60ff5",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 10",
      "name": "Razzia ohne Genehmigung",
      "description": "Durchführung ohne konkreten Tatverdacht / DOJ-Genehmigung und ohne nachträgliche Einholung der Genehmigung",
      "fine": {
        "kind": "fixed",
        "value": 35000,
        "raw": "35000"
      },
      "months": {
        "kind": "fixed",
        "value": 35,
        "raw": "35"
      },
      "measure": "Haft, Suspendierung",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A8:G8"
    },
    {
      "id": "bcd3100c6acdb42df9ebf398",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 11",
      "name": "Unrechtmäßige Beugehaft",
      "description": "Beugehaft ohne Meldung an DOJ oder ohne DOJ-Bestätigung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A9:G9"
    },
    {
      "id": "9a8e103e80362e8d68baa0bf",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 12",
      "name": "Missbräuchlicher Platzverweis",
      "description": "Platzverweis oder Aufenthaltsverbot ohne hinreichenden Grund oder ohne vorherige Ankündigung",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Dienstaufsicht",
      "kind": "offense",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A10:G10"
    },
    {
      "id": "f4445116a6f5c4400ed77d73",
      "book": "PolG",
      "sheet": "PolG",
      "paragraph": "§ 13",
      "name": "Verbotene Waffenführung im Dienst",
      "description": "Führen nicht staatlich genehmigter / nicht im Behörden-Waffenladen erhältlicher Waffen im regulären Dienst",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Einziehung der Waffe",
      "kind": "offense",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=154613940&range=A11:G11"
    },
    {
      "id": "bc476dc07a0136ecb3f8d8f2",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 3",
      "name": "Besitz / Führen ohne Waffenlizenz",
      "description": "Besitz, Erwerb oder Führen einer Waffe ohne gültige Waffenlizenz",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Einziehung der Waffe",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A2:G2"
    },
    {
      "id": "79dbf977b7441148b2bd1e01",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 4",
      "name": "Offenes Waffentragen",
      "description": "Sichtbares Tragen einer Waffe im öffentlichen Raum ohne Berechtigung (außer staatliche Behörden)",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A3:G3"
    },
    {
      "id": "3cb12c48e2184d5db69d02f5",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 5",
      "name": "Waffe illegaler Herkunft",
      "description": "Besitz einer Waffe nicht nachvollziehbarer oder illegaler Herkunft",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A4:G4"
    },
    {
      "id": "b99eadc68264c56458548113",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 6",
      "name": "Entzug der Waffenlizenz",
      "description": "Gefährdung der öffentlichen Sicherheit, wiederholte Verstöße oder Zweifel an der Zuverlässigkeit",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "measure": "Lizenzentzug, Verwaltungsmaßnahme",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A5:G5"
    },
    {
      "id": "fbfa27abc5f1b36d5a4cd6b9",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 7",
      "name": "Unerlaubter Waffenhandel",
      "description": "Verkauf, Weitergabe oder Überlassen von Waffen an nicht berechtigte Personen ohne Genehmigung",
      "fine": {
        "kind": "fixed",
        "value": 35000,
        "raw": "35000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft, Entzug der Gewerbeerlaubnis",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A6:G6"
    },
    {
      "id": "a5feb0196fb66a337d0c99ef",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 8 Lic.1",
      "name": "Unerlaubter Besitz – Lizenzstufe 1",
      "description": "Führen von SNS-Pistole oder Baseballschläger ohne Basislizenz (erhältlich bei autorisiertem Waffenhändler)",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Verwarnung, Einziehung",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A7:G7"
    },
    {
      "id": "e41c05dfd6863288cd3a3f9a",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 8 Lic.2",
      "name": "Unerlaubter Besitz – Lizenzstufe 2",
      "description": "Führen von Messer oder WM 29 Pistole ohne DOJ-Lizenz Stufe 2",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A8:G8"
    },
    {
      "id": "4774fd92c767dca142bba68d",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 8 Lic.3",
      "name": "Unerlaubter Besitz – Lizenzstufe 3",
      "description": "Führen von Beil, Marksman Pistole oder Perico Pistole ohne DOJ-Lizenz Stufe 3",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Einziehung, Haft",
      "kind": "offense",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A9:G9"
    },
    {
      "id": "9386e410178290d3a49cba9f",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 9",
      "name": "Munition ohne Waffenschein",
      "description": "Mitführen oder Besitzen von Munition ohne gültige Waffenlizenz; Munition muss zur Lizenzstufe passen",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Einziehung, Verwarnung",
      "kind": "offense",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A10:G10"
    },
    {
      "id": "8c70d6f25345e7e2f6e042ec",
      "book": "WaffG",
      "sheet": "WaffG",
      "paragraph": "§ 10",
      "name": "Pflichtverstoß im Waffenumgang",
      "description": "Leichtfertige Nutzung, unbeaufsichtigte Zugänglichkeit, Missbrauch oder Nichtmeldung eines Waffenverlustes",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Verwarnung, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1589969303&range=A11:G11"
    },
    {
      "id": "2fe327bc99507c71f17967d5",
      "book": "BtMG",
      "sheet": "BtMG",
      "paragraph": "§ 1",
      "name": "Besitz / Konsum illegaler Substanzen",
      "description": "Besitz, Konsum, Herstellung, Verarbeitung, Handel, Weitergabe oder Transport von Cannabis, Kokain, Speed, LSD, Pilzen, Giftfröschen, Säure oder Toxin",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Einziehung",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1472414944&range=A2:G2"
    },
    {
      "id": "1d4ba967a552cacc2c80762d",
      "book": "BtMG",
      "sheet": "BtMG",
      "paragraph": "§ 2",
      "name": "Überschreitung Eigenbedarfsmenge Cannabis",
      "description": "Besitz von mehr als 400 g Cannabisblüten oder mehr als 20 fertigen Joints; Weitergabe auch innerhalb der Menge verboten",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Vernichtung, Verwarnung oder Haft",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1472414944&range=A3:G3"
    },
    {
      "id": "72edf5db48ad1de9d2d7b4ca",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 2",
      "name": "Straßenbenutzung – Verstoß",
      "description": "Befahren von Gehwegen, Fußgängerzonen oder verkehrsfreien Bereichen",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Verwarnung, Haft bei Gefährdung",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A2:G2"
    },
    {
      "id": "5cbb24acba58278ef3c1a3a1",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 3",
      "name": "Geschwindigkeit innerorts",
      "description": "Überschreitung der Höchstgeschwindigkeit von 100 km/h innerhalb geschlossener Ortschaften",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Fahrerlaubnisentzug",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A3:G3"
    },
    {
      "id": "73d03691dcbc8d250cc870a2",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 3",
      "name": "Geschwindigkeit außerorts",
      "description": "Überschreitung der Höchstgeschwindigkeit von 180 km/h außerhalb geschlossener Ortschaften",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Fahrerlaubnisentzug, Haft",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A4:G4"
    },
    {
      "id": "4a55651269b822c4f377db66",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 3",
      "name": "Highway – Gefährdung durch Geschwindigkeit",
      "description": "Gefährdung anderer Verkehrsteilnehmer auf dem Highway (keine generelle Begrenzung, aber Gefährdungsverbot)",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Fahrerlaubnisentzug, Haft",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A5:G5"
    },
    {
      "id": "bf465e976ec6e9fab63ed4eb",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 5",
      "name": "Verbotenes Überholen",
      "description": "Überholen in unübersichtlichen Bereichen, in der Nähe von Fußgängern oder bei nicht ausreichend Platz",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Fahrverbot, Verwarnung",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A6:G6"
    },
    {
      "id": "adeda00f6027dcb62cd8f5bf",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 7",
      "name": "Sonderrechte – Fehlgebrauch",
      "description": "Nutzung von Sonder- und Wegerechten außerhalb dienstlicher Aufgaben durch Einsatzfahrzeuge",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A7:G7"
    },
    {
      "id": "78aa798d9ce7bc90dd59fccd",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 8",
      "name": "Unzulässiges Halten / Parken",
      "description": "Halten oder Parken auf Hydranten, Feuerwehrzufahrten, Behindertenparkplätzen, Einfahrten oder behindernd am Bordstein",
      "fine": {
        "kind": "fixed",
        "value": 5000,
        "raw": "5000"
      },
      "months": {
        "kind": "fixed",
        "value": 0,
        "raw": "0"
      },
      "measure": "Verwarnung, Abschleppung",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A8:G8"
    },
    {
      "id": "e616e2914df86b691691ca04",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 9",
      "name": "Fahrerflucht / fehlende Hilfeleistung",
      "description": "Nichtanhalten nach Unfall, Nichtverständigen der Exekutive / des Medical Department",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Fahrerlaubnisentzug",
      "kind": "offense",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A9:G9"
    },
    {
      "id": "13773320a384a1d9cc1296ac",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 10",
      "name": "Fahren ohne Fahrerlaubnis",
      "description": "Führen eines Fahrzeugs ohne gültige Fahrerlaubnis",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 0,
        "raw": "0"
      },
      "measure": "Abschleppung",
      "kind": "offense",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A10:G10"
    },
    {
      "id": "503a0967851a714309391b48",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 11",
      "name": "Personentransport im Kofferraum",
      "description": "Transport von Personen im Kofferraum oder Überschreitung der zulässigen Personenzahl",
      "fine": {
        "kind": "fixed",
        "value": 5000,
        "raw": "5000"
      },
      "months": {
        "kind": "fixed",
        "value": 5,
        "raw": "5"
      },
      "measure": "Verwarnung",
      "kind": "offense",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A11:G11"
    },
    {
      "id": "58fc754d2cef0de2852a6e01",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 14",
      "name": "Fahren unter Einfluss",
      "description": "Führen eines Fahrzeugs unter Alkohol (≥ 0,5 ‰) oder Drogen",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Führerscheinentzug, Haft",
      "kind": "offense",
      "sourceRow": 12,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A12:G12"
    },
    {
      "id": "ba86eab74b9aee368e102978",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 15",
      "name": "Falschfahren",
      "description": "Fahren entgegen der Fahrtrichtung ohne unverzügliche Korrektur",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Haft bei Gefährdung",
      "kind": "offense",
      "sourceRow": 13,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A13:G13"
    },
    {
      "id": "4495141022165cafbde3ae2b",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 16",
      "name": "Gefährlicher Eingriff in den Straßenverkehr",
      "description": "Beeinträchtigung der Verkehrssicherheit durch Hindernisse, Beschädigungen oder absichtliche Gefährdungen",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Ersatzpflicht",
      "kind": "offense",
      "sourceRow": 14,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A14:G14"
    },
    {
      "id": "650dce7b5117cf0edf25b286",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 17",
      "name": "Gefährliches Fahren",
      "description": "Gefährdung anderer Verkehrsteilnehmer durch das eigene Fahrverhalten",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Fahrverbot",
      "kind": "offense",
      "sourceRow": 15,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A15:G15"
    },
    {
      "id": "e6f32ce72470afc4a1f11e92",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 20",
      "name": "Verkehrsuntaugliches Fahrzeug",
      "description": "Betrieb eines Fahrzeugs mit erheblichen Mängeln",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 0,
        "raw": "0"
      },
      "measure": "Verwarnung, Abschleppung",
      "kind": "offense",
      "sourceRow": 16,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A16:G16"
    },
    {
      "id": "46d5378a196a589cbda4012f",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 21",
      "name": "Illegale Kraftfahrzeugrennen",
      "description": "Teilnahme, Organisation oder Unterstützung nicht genehmigter Straßenrennen",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Führerscheinentzug, Abschleppung",
      "kind": "offense",
      "sourceRow": 17,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A17:G17"
    },
    {
      "id": "5611cb1f7f1bbe9bf5343d61",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 22",
      "name": "Illegales Tuning",
      "description": "Einbau, Besitz, Erwerb, Handel oder Nutzung von Tuningchips, Flammenchips, Unterbodenbeleuchtung, farbigen Scheinwerfern oder Nitro-Systemen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Stilllegung, Rückbau des Tunings",
      "kind": "offense",
      "sourceRow": 18,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A18:G18"
    },
    {
      "id": "ecb78600d3be31c1ee9fcaf0",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 23",
      "name": "Missachtung Grenzkontrolle",
      "description": "Missachtung oder Verweigerung polizeilicher Grenzkontrollen; Verweigerung der Kontrolle von Person, Fahrzeug oder Ladung",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Sicherheitsprüfung",
      "kind": "offense",
      "sourceRow": 19,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A19:G19"
    },
    {
      "id": "e1b9083debb04bd14c480dc8",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 24",
      "name": "Widerstand bei Verkehrskontrolle",
      "description": "Widerstand, Falschangaben oder Flucht bei Verkehrskontrolle; Verweigerung gilt als Entziehung polizeilicher Maßnahmen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft",
      "kind": "offense",
      "sourceRow": 20,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A20:G20"
    },
    {
      "id": "06f6792376745fe504e75211",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 25",
      "name": "Unzulässiges PIT-Manöver gegen Zweiräder",
      "description": "Gewaltsames Stoppen von Zweirädern ohne unmittelbare Gefahr und ohne Freigabe / Dokumentation",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Suspendierung, Disziplinarmaßnahme",
      "kind": "offense",
      "sourceRow": 21,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A21:G21"
    },
    {
      "id": "b1141bcd65fff5bf908656a8",
      "book": "StVO",
      "sheet": "StVO",
      "paragraph": "§ 26",
      "name": "Abgelaufene Hauptuntersuchung",
      "description": "Abgelaufene Hauptuntersuchung 1 Monat: 150.000 2 Monat 300.000 3 Monat 450.000",
      "fine": {
        "kind": "range",
        "min": 150000,
        "max": 450000,
        "raw": "150000 - 450000"
      },
      "months": {
        "kind": "fixed",
        "value": 0,
        "raw": "0"
      },
      "measure": "Ab dem 4 Monat Führerschein Entzug",
      "kind": "offense",
      "sourceRow": 22,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=570493125&range=A22:G22",
      "inspection": true
    },
    {
      "id": "4d106e23aa6fa705bd9ebb80",
      "book": "LuVO",
      "sheet": "LuVO",
      "paragraph": "§ 1",
      "name": "Fliegen ohne Pilotenschein",
      "description": "Führen eines Flugzeugs oder Helikopters ohne gültige Fluglizenz",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Flugverbot, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1630573631&range=A2:G2"
    },
    {
      "id": "ceacffc3a2e790d6f064d4a5",
      "book": "LuVO",
      "sheet": "LuVO",
      "paragraph": "§ 2",
      "name": "Verstoß gegen Flugverbotszone",
      "description": "Fliegen, Landen oder Fallschirmspringen in verbotenen Lufträumen (Stadtgebiet Los Santos, Staatsgefängnis, Militärbasis)",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft, Fluglizenzentzug",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1630573631&range=A3:G3"
    },
    {
      "id": "35253e32114acc798442b87e",
      "book": "LuVO",
      "sheet": "LuVO",
      "paragraph": "§ 3",
      "name": "Unterschreiten der Mindestflughöhe",
      "description": "Fliegen zu nah an Personen, Gebäuden oder Verkehr; Mindesthöhe nicht eingehalten",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Flugverbot bei Wiederholung",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1630573631&range=A4:G4"
    },
    {
      "id": "4460e4374284ab321d8aa231",
      "book": "LuVO",
      "sheet": "LuVO",
      "paragraph": "§ 4",
      "name": "Unerlaubtes Starten oder Landen",
      "description": "Start oder Landung außerhalb zugelassener / registrierter Flächen oder ohne Genehmigung für staatliche Landeplätze",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Haft, Abschleppung des Fluggeräts",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1630573631&range=A5:G5"
    },
    {
      "id": "5f4c1973f4ea76ae60d05e08",
      "book": "GewG",
      "sheet": "GewG",
      "paragraph": "§ 1",
      "name": "Fehlende Gewerbeanmeldung",
      "description": "Aufnahme einer gewinnorientierten Tätigkeit ohne vollständige Prüfung und Genehmigung des DOJ",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Betriebsschließung, Haft",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1592414706&range=A2:G2"
    },
    {
      "id": "9084dcbe1feb4c9cd757ccdb",
      "book": "GewG",
      "sheet": "GewG",
      "paragraph": "§ 2",
      "name": "Betrieb ohne Sonderlizenz",
      "description": "Tätigkeit in genehmigungspflichtiger Branche (Bewachung, Personenbeförderung, Gastronomie mit Alkohol, Waffenhandel, Glücksspiel) ohne ausdrückliche DOJ-Genehmigung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Lizenzentzug, Betriebsschließung",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1592414706&range=A3:G3"
    },
    {
      "id": "bc0f99389b1189daea006db4",
      "book": "GewG",
      "sheet": "GewG",
      "paragraph": "§ 3",
      "name": "Verletzung unternehmerischer Pflichten",
      "description": "Fehlende oder unordentliche Buchführung, Intransparenz gegenüber Behörden, illegale Nutzung des Unternehmens",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 15,
        "raw": "15"
      },
      "measure": "Verwarnung, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1592414706&range=A4:G4"
    },
    {
      "id": "b3c4f057012f7ec5b21eac08",
      "book": "GewG",
      "sheet": "GewG",
      "paragraph": "§ 4",
      "name": "Nichtmeldung Geschäftsführerwechsel",
      "description": "Änderung der Geschäftsführung ohne unverzügliche Mitteilung an das DOJ",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Bußgeldbescheid",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1592414706&range=A5:G5"
    },
    {
      "id": "d20300ad192a5249d6117535",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 2",
      "name": "Unbefugte Nutzung Titel 'Anwalt'",
      "description": "Führen des Anwaltstitels ohne bestandene Prüfung beim DOJ und gültige Lizenz",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Haft, Lizenzverweigerung",
      "kind": "offense",
      "sourceRow": 2,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A2:G2"
    },
    {
      "id": "574e805b7e52f336ec612494",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 3",
      "name": "Unbefugte Nutzung Titel 'Staatsanwalt'",
      "description": "Auftreten oder Handeln als Staatsanwalt ohne offizielle Ernennung durch das DOJ",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, dauerhaftes Berufsverbot",
      "kind": "offense",
      "sourceRow": 3,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A3:G3"
    },
    {
      "id": "269f5d6d9582c0b88aa968b5",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 4",
      "name": "Tätigkeit ohne Anwaltslizenz",
      "description": "Ausübung anwaltlicher Tätigkeit (Beratung, Vertretung, Anträge) ohne gültige Zulassung",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Lizenzentzug, Haft",
      "kind": "offense",
      "sourceRow": 4,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A4:G4"
    },
    {
      "id": "3d89fa695248fb8df22ab128",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 5",
      "name": "Verletzung anwaltlicher Verschwiegenheit",
      "description": "Weitergabe anvertrauter Mandanteninformationen",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 5,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A5:G5"
    },
    {
      "id": "0896d9a6c77cb2f1618074f4",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 7",
      "name": "Verstoß gegen Gerichtsordnung",
      "description": "Respektloses Auftreten vor Gericht oder Nichtbefolgung richterlicher Anweisungen",
      "fine": {
        "kind": "fixed",
        "value": 10000,
        "raw": "10000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Verwarnung, Ordnungsgeld",
      "kind": "offense",
      "sourceRow": 6,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A6:G6"
    },
    {
      "id": "fd154db702f417f8191aaaf3",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 7",
      "name": "Pflichtverletzung gegenüber Mandanten",
      "description": "Fehlende Sorgfalt, Falschangaben oder Interessenkonflikt zum Nachteil des Mandanten",
      "fine": {
        "kind": "fixed",
        "value": 15000,
        "raw": "15000"
      },
      "months": {
        "kind": "fixed",
        "value": 10,
        "raw": "10"
      },
      "measure": "Disziplinarverfahren, Schadensersatz",
      "kind": "offense",
      "sourceRow": 7,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A7:G7"
    },
    {
      "id": "03c7b21bc6ef96ae52720d70",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 7",
      "name": "Entzug der Anwaltslizenz",
      "description": "Straftaten, Pflichtverletzungen oder Missbrauch der anwaltlichen Tätigkeit",
      "fine": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "months": {
        "kind": "none",
        "value": 0,
        "raw": "—"
      },
      "measure": "Lizenzentzug durch DOJ",
      "kind": "offense",
      "sourceRow": 8,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A8:G8"
    },
    {
      "id": "624bec48cd08a388f10a5d58",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 35",
      "name": "Schwerwiegender ethischer Verstoß",
      "description": "Korruption, Bestechung, Täuschung oder Amtsmissbrauch im juristischen Dienst",
      "fine": {
        "kind": "fixed",
        "value": 40000,
        "raw": "40000"
      },
      "months": {
        "kind": "fixed",
        "value": 40,
        "raw": "40"
      },
      "measure": "Haft, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 9,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A9:G9"
    },
    {
      "id": "58223a2c5e425c95382debec",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 37",
      "name": "Verletzung des Zeugenschutzes",
      "description": "Offenlegung oder Gefährdung geschützter Zeugen oder Informanten",
      "fine": {
        "kind": "fixed",
        "value": 30000,
        "raw": "30000"
      },
      "months": {
        "kind": "fixed",
        "value": 30,
        "raw": "30"
      },
      "measure": "Haft, Berufsverbot",
      "kind": "offense",
      "sourceRow": 10,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A10:G10"
    },
    {
      "id": "72ed2fdc7d4f0062278e93ed",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 40",
      "name": "Verletzung anwaltlicher Vertraulichkeit",
      "description": "Offenlegung geschützter Kommunikation zwischen Anwalt und Mandant",
      "fine": {
        "kind": "fixed",
        "value": 25000,
        "raw": "25000"
      },
      "months": {
        "kind": "fixed",
        "value": 25,
        "raw": "25"
      },
      "measure": "Haft, Lizenzentzug",
      "kind": "offense",
      "sourceRow": 11,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A11:G11"
    },
    {
      "id": "98676d1209a8c33ff03d1874",
      "book": "LDG",
      "sheet": "LDG",
      "paragraph": "§ 43",
      "name": "Diskriminierung durch Anwälte",
      "description": "Ungleichbehandlung oder Benachteiligung aus diskriminierenden Gründen",
      "fine": {
        "kind": "fixed",
        "value": 20000,
        "raw": "20000"
      },
      "months": {
        "kind": "fixed",
        "value": 20,
        "raw": "20"
      },
      "measure": "Disziplinarverfahren, Haft bei Wiederholung",
      "kind": "offense",
      "sourceRow": 12,
      "url": "https://docs.google.com/spreadsheets/d/1R7Sy5ZPJNcM8PQa3mNCK7QblE5K1f2Ea8wWdvJCM3GE/edit#gid=1676843563&range=A12:G12"
    }
  ]
};root.dojPenaltyCatalog=catalog;if(typeof module!=="undefined")module.exports=catalog;})(globalThis);
