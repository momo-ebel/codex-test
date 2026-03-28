# Felix Grüner Daumen

Eine moderne, iPhone-optimierte Web App für Pflanzenidentifikation, Problemerkennung und Pflegedokumentation.

## Funktionen

- **KI-Analyse mit Fallback:** Bildanalyse mit vorbereitetem Gemini-Client und lokalem Fallback (API-Key aktuell absichtlich leer).
- **Konfidenz-UX:** Ergebnis mit Hoch/Mittel/Niedrig-Konfidenz inkl. Follow-up-Fragen bei unsicheren Analysen.
- **Bildqualitäts-Checks:** Warnungen bei dunklen, überbelichteten oder kontrastarmen Bildern.
- **Behandlungsbibliothek:** Symptom-spezifische Schritte inkl. Sicherheits- und Eskalationshinweisen.
- **Erweiterte Pflanzenprofile:** Standort, Lichtziel, Topfgröße, Bewässerungsintervall, Zeitstempel und Verlaufseinträge.
- **Pflegeplan & Erinnerungen:** Fällige Aufgaben (Gießen, Schädlingscheck, Drehen) aus Pflegezielen + Verlauf abgeleitet.
- **Trendmetriken:** Vitalitäts- und Dokumentationsmetriken pro Pflanze.
- **PWA-Basics:** App-Manifest, Service Worker und Offline-Shell.

## Lokal starten

Da es sich um eine statische Web App handelt, reicht ein einfacher lokaler Webserver:

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

## API-Key ergänzen

Der Gemini-Key ist derzeit bewusst leer gelassen. Zum Aktivieren die Konstante `GEMINI_API_KEY` in `game.js` setzen.
