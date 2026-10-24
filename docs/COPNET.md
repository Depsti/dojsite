# CopNet-Verknüpfung

Ziel: https://retro-roleplay.ch/copnet/

CopNet steht allen angemeldeten Mitarbeitern als App auf dem Desktop, im Startmenü und in der klassischen Navigation zur Verfügung. Die App nutzt die vorhandene Fensterverwaltung: verschieben, minimieren, maximieren und über die Taskleiste wieder öffnen. Im Desktop-Bearbeitungsmodus kann das Symbol frei platziert oder einem eigenen Ordner zugeordnet werden.

## CopNet öffnen

- **In neuem Tab öffnen** öffnet CopNet neben dem DOJ-Portal.
- **Separates Browserfenster** fordert ein eigenes Browserfenster an. Der Browser kann diese Öffnung blockieren oder als Tab darstellen; der normale Link bleibt verfügbar.

Der DOJ-Arbeitsplatz wird beim Wechsel nicht ersetzt. CopNet besitzt weiterhin eine eigene Anmeldung und eigene Zugriffsrechte. Es werden keine DOJ-Akten, Zugangsdaten oder Sitzungstoken an CopNet übergeben.

## Warum keine eingebettete CopNet-Seite?

Am 24.10.2026 wurden die öffentlichen Antwort-Header der Zielseite und ihrer Weiterleitung nach /portal?dest=copnet geprüft. Beide setzen X-Frame-Options: DENY und eine Content-Security-Policy mit frame-ancestors 'self'. Damit verbietet CopNet die Einbettung auf einer anderen Domain.

Das interne DOJ-Fenster ist daher aktuell ein CopNet-Starter. Die eigentliche CopNet-Oberfläche öffnet separat. Es gibt keinen Proxy, der den Schutz entfernt.

Für eine tatsächliche Anzeige im DOJ-Fenster müsste der CopNet-Betreiber die konkrete HTTPS-Adresse des DOJ-Portals in frame-ancestors zulassen und die widersprechende DENY-Regel auf den betroffenen CopNet- und Anmeldeseiten anpassen. Änderungen allein im DOJ-Projekt können diese Freigabe nicht herstellen.

## Dateien und Betrieb

Die Zieladresse steht in public/copnet.js. public/copnet.css enthält die Darstellung. Die App ist in public/desktop-layout-model.js für die persönliche Desktop-Anordnung registriert. public/index.html und lib/http-server.mjs laden bzw. liefern die neuen Dateien aus.

Keine neue Datenbankmigration oder Railway-Variable ist nötig. Für die Veröffentlichung müssen die Änderungen regulär gepusht und deployed werden.

Geprüft: npm.cmd test, npm.cmd run test:desktop und npm.cmd run test:ui. Die Browserprüfungen kontrollieren Desktop und klassische Navigation, ein einzelnes wiederverwendetes App-Fenster, die feste Zieladresse, sichere neue Browserkontexte, Popup-Fallback und die mobile Darstellung.
