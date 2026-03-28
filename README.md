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

## API-Key ergänzen (GitHub Pages kompatibel)

Für statisches Hosting (z. B. GitHub Pages) kann der Gemini-Key direkt in der UI im Feld **"Gemini API Key"** hinterlegt werden.
Der Key wird nur lokal im Browser (`localStorage`) gespeichert.

> Wichtig: Ein API-Key im Browser ist immer ein Sicherheitsrisiko, weil Client-Code öffentlich ist.
> Für Produktion wird ein Server/Proxy empfohlen, der den Schlüssel geheim hält.

## GitHub Pages Hinweise

- Die PWA-`start_url` und Service-Worker-Cachepfade sind auf relative Pfade gestellt, damit Projektseiten unter `https://<user>.github.io/<repo>/` korrekt funktionieren.
- Offline-Shell und lokale Datenhaltung (`localStorage`) funktionieren auf GitHub Pages.
- Echte Push-Reminder und sicherer KI-Zugriff benötigen zusätzliche Backend-/Push-Infrastruktur.
