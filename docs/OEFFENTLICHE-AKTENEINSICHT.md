# Öffentliche Einsichtslinks

Eine freigegebene Akte kann jetzt als Link ohne Anmeldung geöffnet werden. Der Empfänger sieht eine eigenständige, schreibgeschützte Dokumentseite – keine Desktop-Oberfläche, keine weiteren Akten und keine Chats. Der Link erstellt keine Sitzung und erteilt keinerlei Portalrechte.

## Bedienung

1. Fallakte öffnen → **Einsicht für Dritte**.
2. **Geschwärzt** oder **Ungeschwärzt** wählen und ausdrücklich freizugebende Abschnitte auswählen. Beteiligte Personen sind separat anwählbar; interne Kommentare, Chats, Dateianhänge und Arbeitsbereiche bleiben ausgeschlossen.
3. Bei einer geschwärzten Fassung zusätzliche Begriffe eingeben und bei Bedarf einzelne Einträge auslassen.
4. Vorschau erzeugen und vollständig prüfen. Dann **Ich habe die Einsichtsfassung vollständig geprüft** bestätigen.
5. Interne Bezeichnung und Gültigkeit wählen: 24 Stunden, 7 Tage (Standard), 30 Tage oder bis Widerruf.
6. **Einsichtslink erstellen** und den angezeigten Link kopieren. Er wird nur einmal angezeigt. Bei Verlust kann ein neuer Link erstellt und der alte widerrufen werden.

Der Link kann anschließend z. B. in Discord weitergegeben werden. Jeder, der ihn besitzt, kann die gewählte Fassung lesen. Es findet keine Empfänger-Identitätsprüfung statt. Bereits gelesene, kopierte oder gespeicherte Inhalte lassen sich durch einen späteren Widerruf nicht zurückholen.

Unter **Geteilte Einsichtslinks** stehen Bezeichnung, Modus, Erstellzeitpunkt, Laufzeit und Status. **Fassung ansehen** zeigt die tatsächlich freigegebene Kopie. **Link widerrufen** beendet weitere Abrufe sofort. Nur Aktenführung beziehungsweise berechtigte Leitung darf Links erstellen, auflisten und widerrufen; reine Lese- oder zugewiesene Bearbeitungsrechte reichen dafür nicht.

## Freigegebener Stand

Die öffentliche Fassung ist eine feste Kopie der serverseitig erzeugten und geprüften Vorschau. Spätere Aktenänderungen werden nicht automatisch übernommen. Für einen neuen Stand ist eine neue Vorschau und ein neuer Link nötig. Vorschauen sind für die Link-Erstellung 30 Minuten gültig und an Ersteller und Akte gebunden. Der Server akzeptiert keinen vom Browser zusammengestellten Dokumentinhalt für die öffentliche Freigabe.

Geschwärzte Fassungen werden bereits vor Erzeugung der Vorschau bereinigt. Ungeschwärzte Fassungen enthalten die ausdrücklich gewählten Abschnitte ohne Namensschwärzung. Der Modus steht in Vorschau und öffentlicher Dokumentüberschrift. Auch eine ungeschwärzte Fassung enthält keine versteckten Felder oder ungewählten Portalbereiche.

## Technischer Schutz

- Öffentliche Route: `GET /einsicht/<zufälliger Token>`, außerdem `HEAD`. Andere Methoden sind gesperrt.
- Pro Link ein zufälliges Geheimnis mit 256 Bit; in der Datenbank liegt nur dessen SHA-256-Hash.
- Keine Anmeldung und kein Session-Cookie bei einem öffentlichen Abruf. Interne APIs verlangen weiterhin eine normale Anmeldung.
- Nur die freigegebene Kopie wird ausgeliefert; keine öffentlichen Rohdaten- oder Verwaltungsendpunkte.
- `no-store`, `no-referrer`, Suchmaschinen-Ausschluss und eine restriktive Content Security Policy ohne Skripte, Formulare oder Einbettung in fremde Seiten.
- Ablauf und Widerruf werden bei jedem Abruf geprüft. Der Zugriff endet außerdem, wenn die Akte gelöscht wird, der Ersteller deaktiviert ist oder seine Aktenverwaltungsrechte verliert.
- Höchstens 20 aktive Links pro Akte. Beim Widerruf wird die gespeicherte Dokumentkopie entfernt; Verwaltungsmetadaten bleiben für die Nachvollziehbarkeit erhalten.

Die Daten werden in der vorhandenen JSONB-Nutzlast unter `disclosurePreviews` und `caseShares` gespeichert. Die allgemeinen Zustands-APIs liefern weder geheime Links noch Dokumentkopien oder Token-Hashes aus. Link-Erstellung und Widerruf werden intern protokolliert; anonyme Abrufe erzeugen keine neue Portalsitzung.

## Supabase und Railway

Den vollständigen aktualisierten Projektstand deployen. Keine zusätzliche SQL-Migration, keine neuen Umgebungsvariablen und kein weiteres Paket nötig. Die bestehenden Supabase-Verbindungsdaten bleiben unverändert.

Links für Dritte auf der produktiven Website erzeugen: Die Oberfläche verwendet deren tatsächliche Domain. Ein unter `localhost` erzeugter Link ist nur lokal nutzbar. Die Railway-Website muss über ihre öffentliche HTTPS-Domain erreichbar sein.

Prüfung: `npm test`, `npm run test:desktop`, `npm run test:chat`. Der Browser-Test verwendet auch einen Gastkontext ohne Cookies und prüft beide Fassungen, gesperrte interne APIs, unveränderte Kopien, Widerruf und Sicherheitsheader.
