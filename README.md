# Examensvorbereitung Ergotherapie – Interaktive Lern-App

Aufbereitetes, prüfungsfokussiertes Lernmaterial für die staatliche Prüfung Ergotherapie 2026,
generiert aus dem Kursmaterial und ausgerichtet am Leitfaden `Examen.docx` (Eingrenzung der
prüfungsrelevanten Themen).

## Prüfungstermine (schriftlich)
- **FG 3** – Behandlungsverfahren: Mo 03.08.2026
- **FG 2** – Gesetze / Psychologie / Pädagogik: Mi 05.08.2026
- **FG 1** – Krankheitslehre (AKL/SKL): Fr 07.08.2026
- Mündlich (GET, MedSoz, BAP): 23.–29.09.2026 · Handwerk (TM): 17./21.09.2026

## Benutzung
`app/index.html` im Browser öffnen (Doppelklick). Läuft komplett offline, kein Server nötig.
Fortschritt wird lokal im Browser gespeichert.

## Struktur
- `app/`      – die Web-App (HTML/CSS/JS, offline lauffähig)
- `content/`  – aufbereitetes Lernmaterial pro Fach (als JS geladen, kein fetch nötig)
- `assets/`   – im Lernstoff eingebundene Original-Schaubilder/Grafiken
- `pipeline/` – Python-Skripte zur Aufbereitung der PDFs (pymupdf)
- `build/`    – Zwischenprodukte (Seitenrenders, Roh-Notizen) · nicht im Git

## Aufbereitungs-Pipeline
1. `pipeline/render.py` – PDF-Seiten als PNG rendern + Textlayer extrahieren
2. Vision-Agenten erstellen prüfungsfokussierte Seitennotizen (gemappt auf die Eingrenzung)
3. Synthese-Agent je Fach → prüfungsfertige Lerneinheit + Karteikarten + Quiz
4. Export nach `content/<fach>.js`
