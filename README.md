# Felix Grüner Daumen

Eine moderne, iPhone-optimierte Web App für Pflanzenidentifikation, Problemerkennung und Pflegedokumentation.

## Funktionen

- **Fotoanalyse:** Pflanze per Bild hochladen und eine simulierte Soforteinschätzung zu Art, Gesundheitszustand und Hilfestellung erhalten.
- **Pflegeempfehlungen:** Konkrete nächste Schritte für häufige Probleme wie gelbe Blätter, Trockenstress oder Flecken.
- **Eigene Pflanzen:** Lieblingspflanzen lokal im Browser speichern.
- **Verlauf mit Fotos:** Für jede Pflanze können neue Updates mit Notizen und Fotos ergänzt werden, um die Entwicklung über die Zeit sichtbar zu machen.
- **Mobile Fokus:** Layout, Abstände und Interaktionen sind auf iPhone-Bildschirme optimiert.

## Lokal starten

Da es sich um eine statische Web App handelt, reicht ein einfacher lokaler Webserver:

```bash
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.
