# Supabase (einziger Speicher)

Das Portal speichert **alles** in Supabase: Datenbestand, Anmeldesitzungen und Anmeldesperren. Es gibt keinen lokalen Speicher und keinen `data/`-Ordner mehr. Jeder Server und jeder Nutzer sieht denselben Stand, Anmeldungen überleben Neustarts, mehrere Instanzen sind möglich.

## Einrichtung
1. Supabase > SQL Editor: `supabase/schema.sql` ausführen (legt `doj_sessions` und `doj_login_attempts` neu an, bestehende Daten bleiben).
2. `.env.example` nach `.env` kopieren und `SUPABASE_SECRET_KEY` eintragen. Auf dem Host dieselben Variablen setzen.
3. `npm run db:check` – prüft die Verbindung und alle drei Tabellen.
4. Alte Daten übernehmen: `npm run db:import` (liest `data/database.json`) oder `node scripts/import-supabase.mjs pfad/zur/database.json`. Bricht ab, wenn Supabase schon Daten enthält.
5. `npm start`.

## Sicherheit
RLS ist aktiv, Browser-Rollen haben keinerlei Rechte. Nur der Server nutzt den Secret-Key. Sitzungs-Cookies werden nur als SHA-256-Hash gespeichert. Abgelaufene Sitzungen werden stündlich gelöscht.

## Gleichzeitige Änderungen
Jede Anfrage lädt den aktuellen Stand. Speichern zwei Personen gleichzeitig, wird die zweite Änderung abgelehnt („bitte erneut versuchen“) statt die erste zu überschreiben.

## Hinweis
Dateianhänge liegen weiterhin im Datenbestand (max. 5 MB je Datei). Bei vielen großen Anhängen wäre Supabase Storage der nächste Schritt.
