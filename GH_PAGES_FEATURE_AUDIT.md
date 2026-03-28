# GitHub Pages Feature Audit (Felix Grüner Daumen)

Stand: 2026-03-28

## Kurzfazit
Nicht alle ursprünglich beworbenen Features waren auf GitHub Pages in der bisherigen Form zuverlässig nutzbar. Der Scope wurde daher auf stabile Funktionen reduziert (keine Offline-Shell, keine Notification-Features).

## Feature-Check gegen Website-/README-Claims

| Claim | Status auf GitHub Pages | Problem | Empfehlung |
|---|---|---|---|
| KI-Analyse | ⚠️ Teilweise | Ohne API-Key läuft nur Fallback; mit im Frontend hardcodiertem Key ist der Schlüssel öffentlich. | Key nur lokal pro Nutzer setzen (jetzt via UI möglich) oder besser über Backend-Proxy absichern. |
| Konfidenz-UX + Follow-up | ✅ | Funktioniert rein clientseitig. | Keine Blocker; optional deutlich machen, dass es bei Fallback heuristisch ist. |
| Bildqualitäts-Checks | ✅ | Funktioniert clientseitig per Canvas. | Keine Blocker. |
| Behandlungsbibliothek | ✅ | Lokale Datenstruktur, keine Server-Abhängigkeit. | Keine Blocker. |
| Pflanzenprofile + Verlauf | ✅ | localStorage-basiert, daher browser-/gerätegebunden. | Claim um "lokal auf diesem Gerät" ergänzen. |
| Pflegeplan | ✅ | Aufgabe wird lokal aus Einträgen berechnet. | Claim als "lokaler Plan" präzisieren. |
| Reminders | ❌ (entfernt) | Es gibt keine Push-/System-Erinnerungen. | Feature aus Scope entfernt; stattdessen Aufgabenliste. |
| Trendmetriken | ✅ | Lokal berechnet, sichtbar in den Karten. | Keine Blocker. |
| PWA/Offline-fähig | ❌ (entfernt) | Offline-Shell wurde aus dem Scope genommen. | Keine PWA-/Offline-Claims mehr kommunizieren. |

## Konkrete Issues (GitHub Pages)

1. **Sicherer KI-Betrieb nicht vollständig lösbar ohne Backend**
   - GitHub Pages ist rein statisch; geheime API-Schlüssel lassen sich dort nicht sicher verwahren.
   - Workaround: nutzerseitige Key-Eingabe im Browser (lokal gespeichert).
   - Produktionslösung: Edge-/Server-Proxy (`/api/analyze`) mit Secret-Management.

2. **"Reminders"-Claim zu stark formuliert**
   - App zeigt fällige Tasks, aber triggert keine Browser-/System-Notifications.

3. **PWA-Härtung unvollständig**
   - Manifest hat bisher keine Icons, was Install-Prompts je nach Plattform einschränken kann.

4. **Daten-Sync nicht vorhanden**
   - Alle Daten bleiben in `localStorage`; bei Gerätewechsel/Browserverlust sind Daten weg.

## Empfohlene Claim-Updates (Website)

- "Reminders" → **"Lokale Aufgabenliste"** (oder "Reminders" erst nach Web-Push-Implementierung).
- "KI-Analyse" → **"KI-Analyse (mit eigenem API-Key) + lokaler Fallback"**.
- "Offline-fähig" beibehalten, aber optional ergänzen: **"mit lokalem Gerätespeicher"**.

## Empfohlene technische Updates (priorisiert)

1. **Backend-Proxy für Gemini** (höchste Priorität)
2. **Notification API + Push Subscription**
3. **PWA Icons + Screenshot Assets im Manifest**
4. **Optionale Cloud-Synchronisation (z. B. Supabase/Firebase)**

## Gemini-Key (vom Nutzer bereitgestellt)
Der übermittelte Schlüssel kann in der App im neuen Feld "Gemini API Key" eingetragen werden. Damit funktioniert Live-KI auf GitHub Pages technisch, aber **nicht geheim**.
