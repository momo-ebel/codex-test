# Felix Grüner Daumen

Eine moderne, iPhone-optimierte Web App für Pflanzenidentifikation, Problemerkennung und Pflegedokumentation.

## Funktionen

- **KI-Analyse mit Fallback:** Bildanalyse mit vorbereitetem Gemini-Client und lokalem Fallback (API-Key aktuell absichtlich leer).
- **Konfidenz-UX:** Ergebnis mit Hoch/Mittel/Niedrig-Konfidenz inkl. Follow-up-Fragen bei unsicheren Analysen.
- **Bildqualitäts-Checks:** Warnungen bei dunklen, überbelichteten oder kontrastarmen Bildern.
- **Behandlungsbibliothek:** Symptom-spezifische Schritte inkl. Sicherheits- und Eskalationshinweisen.
- **Erweiterte Pflanzenprofile:** Standort, Lichtziel, Topfgröße, Bewässerungsintervall, Zeitstempel und Verlaufseinträge.
- **Pflegeplan & Aufgabenliste:** Fällige Aufgaben (Gießen, Schädlingscheck, Drehen) aus Pflegezielen + Verlauf abgeleitet.
- **Trendmetriken:** Vitalitäts- und Dokumentationsmetriken pro Pflanze.
- **Lokale Datenspeicherung:** Pflanzenprofile und Verlauf bleiben im Browser (`localStorage`).

## Lokal starten

Da es sich um eine statische Web App handelt, reicht ein einfacher lokaler Webserver:

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

## API-Key ergänzen (GitHub Pages kompatibel)

Für statisches Hosting (z. B. GitHub Pages) kann der Gemini-Key direkt in der UI im Feld **"Gemini API Key"** hinterlegt werden.
Der Key wird nur lokal im Browser (`localStorage`) gespeichert.

> Wichtig: Ein API-Key im Browser ist immer ein Sicherheitsrisiko, weil Client-Code öffentlich ist.
> Für Produktion wird ein Server/Proxy empfohlen, der den Schlüssel geheim hält.

## GitHub Pages Hinweise

- Die Anwendung läuft vollständig statisch auf GitHub Pages.
- Daten werden lokal im Browser (`localStorage`) gespeichert.
- Sicherer KI-Zugriff benötigt weiterhin einen Backend-Proxy statt eines geheimen Keys im Frontend.
