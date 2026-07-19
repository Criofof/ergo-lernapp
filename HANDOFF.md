# HANDOFF — Fertigstellung der Lern-App durch einen Agenten-Schwarm (z. B. Kimi K3)

Dieses Dokument ist **self-contained**: Es beschreibt vollständig, was noch zu tun ist und
wie es getan wird, ohne Kontext aus der bisherigen Sitzung. Alles läuft **lokal auf diesem
Rechner** (Windows) mit Python 3.12 + `pymupdf`. Kein spezielles Harness nötig — jeder
Agenten-Schwarm mit **Datei-Lesen/-Schreiben, Bild-Verständnis (Vision) und Shell** kann es ausführen.

---

## 1. Ziel & Kontext

Interaktive, offline lauffähige Lern-Web-App zur Vorbereitung auf die **staatliche Prüfung
Ergotherapie 2026**. Inhalte werden aus dem Kursmaterial (PDFs) generiert und exakt an der
offiziellen **Eingrenzung** (Datei `Examen.docx`) ausgerichtet.

**Prüfungstermine (Priorität = Reihenfolge):**
1. **FG 3** — Behandlungsverfahren — **Mo 03.08.2026**
2. **FG 2** — Gesetze/Psychologie/Pädagogik — **Mi 05.08.2026**
3. **FG 1** — Krankheitslehre (AKL/SKL) — **Fr 07.08.2026**
(Mündlich & Handwerk erst Ende September — hier NICHT im Scope.)

Die App liegt in `app/`, läuft per Doppelklick auf `app/index.html` (offline, `file://`).

---

## 2. Voraussetzungen

- Läuft auf **diesem Rechner** (Zugriff auf die Kurs-PDFs unter
  `..\Examen - Relevante Fächer (sehr wichtig)\` und den Ordner `build\` mit den gerenderten Seiten).
- `python -m pip install pymupdf python-docx` (bereits installiert).
- Die **Seiten-PNGs** (`build/<unit>/pages/`) sind NICHT im Git (5 GB). Sie sind lokal vorhanden.
  Falls sie fehlen (frischer Clone), neu rendern: `python pipeline/render_group.py <group> 2.5`.
- Die **Notizen/Fragmente** (`build/<unit>/notes|points|frag`) SIND im Git versioniert — die
  teure Vision-Arbeit von FG 3 ist damit gesichert.

---

## 3. Architektur (5 Schritte je Fächergruppe)

```
PDFs --render--> build/<unit>/pages/*.png + text/*.txt        (pymupdf; schon erledigt für FG1-3)
   |
   v  [SCHRITT A: NOTIZEN — Vision-Agenten, 1 Agent je 12-Seiten-Batch]
build/<unit>/notes/batchNN.json     (Seiten wörtlich erfasst, auf Eingrenzung gemappt)
   |
   v  python pipeline/synthplan.py <group>     (gruppiert Notizen nach Eingrenzungspunkt)
build/<unit>/points/<slug>/point_NN.md + extra_NN.md
   |
   v  [SCHRITT B: THEMEN-SYNTHESE — 1 Agent je point_NN.md / extra_NN.md]
build/<unit>/frag/<slug>/topic_NN.json + extra_NN.json
   |
   v  python pipeline/assemble.py <group>       (baut content/<slug>.js)
   v  python pipeline/postprocess.py <group>    (extrahiert Grafiken, aktualisiert index.html)
content/<slug>.js + assets/<slug>/*.png  ->  App zeigt das Fach
```

**Zwei Agenten-Typen** (beide brauchen nur Datei-Lesen/-Schreiben; A zusätzlich Vision):
- **A) Notizen-Agent** (Vision): liest Seiten-PNGs, schreibt `notes/batchNN.json`.
- **B) Themen-Agent** (Text): liest ein `point_NN.md`, schreibt `frag/topic_NN.json`.

Alles dazwischen ist deterministisches Python (kein Modell).

---

## 4. Aktuellen Reststand abfragen (immer zuerst!)

```
python pipeline/remaining.py            # Übersicht FG3/FG2/FG1
python pipeline/remaining.py fg2 --json # maschinenlesbar: missing_batches / missing_points / missing_extras
```

Stand bei Übergabe:
- **FG 3**: mofu ✅, neurophysio ✅, psychosomatik ✅. **Offen:** neuropsycho (13 Themen +1 Extra),
  psychosoziale (15 +7), at (15 +4). Notizen für FG3 sind fertig → **nur Schritt B + assemble**.
- **FG 2**: Notizen weitgehend offen (paed-psych 97/110, behindertenpaedagogik 17, berufskunde 25 Batches)
  → **Schritt A, dann synthplan, dann B, dann assemble**.
- **FG 1**: Notizen komplett offen (316 Batches über 10 Fächer) → voller Durchlauf.

**Der Schwarm bearbeitet immer NUR das, was `remaining.py` als offen meldet** (idempotent —
schon vorhandene, valide Fragmente werden nicht neu erzeugt). So kostet ein Abbruch nie Doppelarbeit.

---

## 5. Empfohlene Reihenfolge (nach Prüfungsdatum)

1. **FG 3 fertigstellen** (klein, höchste Zeitnot): Schritt B für neuropsycho/psychosoziale/at → assemble fg3 → commit.
2. **FG 2**: Schritt A (Notizen) → `synthplan.py fg2` → Schritt B → assemble/postprocess fg2 → commit.
3. **FG 1**: Schritt A → `synthplan.py fg1` → Schritt B → assemble/postprocess fg1 → commit.

Innerhalb einer Gruppe: erst ALLE Notizen einer render_unit fertig, dann `synthplan.py`
(gruppiert), dann die Themen-Agenten. Nach jedem Fach/Gruppe committen (siehe §9).

---

## 6. SCHRITT A — Notizen-Agent (Vision)  [nur wo Notizen fehlen: FG2, FG1]

**Batchgröße = 12 Seiten.** Batch `NN` deckt die Seiten `(NN-1)*12+1 .. NN*12` ab.
Die Seiten liegen als `build/<unit>/pages/pXXXX.png` (4-stellig, global fortlaufend je unit).
Die zu bearbeitenden `NN` liefert `remaining.py <group> --json` → `render_units[unit].missing_batches`.

**Eingabe je Agent:** die 12 PNG-Dateien des Batches + die Eingrenzungsdatei(en)
`build/<unit>/eingrenzung_<slug>.md` (bei kombinierten Fächern mehrere — siehe §10).
**Ausgabe:** `build/<unit>/notes/batchNN.json`

**PROMPT (wörtlich, Platzhalter in <>):**
```
Du bist sorgfältiger Fachlektor für die staatliche Ergotherapie-Prüfung. Erfasse die zugewiesenen
Kursseiten VOLLSTÄNDIG und prüfungsfokussiert. Kein Detail darf verloren gehen.

SCHRITT 1 — Lies die Eingrenzung(en) (offiziell prüfungsrelevante Themen):
Read: <absoluter Pfad build/<unit>/eingrenzung_<slug>.md>   (ggf. mehrere)

SCHRITT 2 — Verarbeite diese <=12 Seiten. Für JEDE Seite: nutze Vision auf die PNG-Bilddatei
(das BILD ist die Hauptquelle — Schaubilder, Tabellen, Beschriftungen!), und lies zusätzlich die
Textdatei (gleicher Pfad, /pages/pXXXX.png -> /text/pXXXX.txt). Das Bild hat Vorrang bei
fragmentiertem Text.
<Liste: gidx NN | BILD: <pfad pXXXX.png>>

SCHRITT 3 — Schreibe valides JSON nach: build/<unit>/notes/batchNN.json
Format:
{"batch":"NN","pages":[{"gidx":<int>,"source":"Kurzquelle","slide_title":"Überschrift",
"type":"inhalt|gliederung|titel|deko|quelle",
"notes_md":"AUSFÜHRLICHE prüfungsfokussierte Notizen (Markdown). Erfasse JEDEN fachlichen Inhalt.
Transkribiere Text in Schaubildern/Tabellen WORTWÖRTLICH. Beschreibe Aufbau/Beschriftungen/Pfeile exakt.",
"figures":[{"caption":"Kurztitel","shows":"was die Grafik zeigt","importance":"high|mid|low","extract":true}],
"eingrenzung_hits":[<Nummern der getroffenen Eingrenzungspunkte, ints>],
"key_facts":["atomare prüfungsrelevante Einzelfakten"]}]}

WICHTIG: exhaustiv, deutsch, Fachbegriffe korrekt. "extract":true nur bei fachlich wichtigen
Schaubildern/Tabellen (nicht Deko/Titel). eingrenzung_hits ernst nehmen. Gültiges JSON
(Zeilenumbrüche in Strings als \n, keine rohen Steuerzeichen).
```

Empfehlung: günstiges Vision-Modell, mittlere Denk-Tiefe. Nebenläufigkeit nach Belieben (Schwarm).

---

## 7. Zwischenschritt (Python, kein Modell)

Sobald ALLE Notizen einer Gruppe vorliegen:
```
python pipeline/synthplan.py <group>
```
Das gruppiert die Seitennotizen nach Eingrenzungspunkt und schreibt je Fach:
`build/<unit>/points/<slug>/point_NN.md` (ein Punkt + alle relevanten Seiten) und
`extra_NN.md` (Ergänzungsstoff). Danach kennt `remaining.py` die offenen Themen.

---

## 8. SCHRITT B — Themen-Agent (Text)  [FG3 jetzt; FG2/FG1 nach Notizen]

**Ein Agent je `point_NN.md`.** Die offenen `NN` liefert
`remaining.py <group> --json` → `subjects[i].missing_points` (und `missing_extras`).

**Eingabe:** `build/<unit>/points/<slug>/point_NN.md`
**Ausgabe:** `build/<unit>/frag/<slug>/topic_NN.json`  (GENAU EIN Objekt)

**PROMPT Themen (wörtlich):**
```
Du bist Didaktik-Experte und Ergotherapie-Fachdozent. Erstelle EIN prüfungsfertiges Lernthema
für das Fach "<FACH>" (<GRUPPE>).

QUELLE: Read build/<unit>/points/<slug>/point_NN.md
Die erste Zeile lautet "# Eingrenzungspunkt N: <THEMA>" — das ist das genaue Prüfungsthema.
Danach folgen die zusammengetragenen Kursnotizen zu genau diesem Thema, inkl. FIGUR-Markierungen
(gidx = Seitennummer wichtiger Schaubilder).

REGELN:
- Inhaltlich AUSSCHLIESSLICH auf Basis dieser Notizen (echtes Kursmaterial). Nichts dazuerfinden
  (keine erfundenen Zahlen/Fakten). Didaktisch strukturieren/ausformulieren ist erlaubt. Bei dünnen
  Notizen fachlich korrekt auf Kursniveau formulieren, ohne Fakten zu erfinden.
- Deutsch, klar, Fachbegriffe korrekt. Wichtige Tabellen/Schaubild-Inhalte präzise wiedergeben.
- GRAFIKEN: Wenn die Notizen eine FIGUR (gidx=NN) mit klarem Lernwert enthalten, binde sie ein via
  figures:[{src:"assets/<slug>/g<NN>.png","caption":"..."}]. Nur wirklich lehrreiche.

AUSGABE — valides JSON nach: build/<unit>/frag/<slug>/topic_NN.json  (genau ein Objekt):
{"id":"kurz-slug","title":"prägnanter Titel","eingrenzung":"<THEMA-Text aus Zeile 1 ohne Nummer>",
"prio":"high",
"body":"Ausführlicher Lerntext (Markdown: ## / ### Überschriften, Listen, **fett**, Tabellen | a | b |).",
"facts":["must-know Kernfakten, je 1 Satz"],
"figures":[{"src":"assets/<slug>/gNN.png","caption":"..."}],
"flashcards":[{"q":"...","a":"..."}],
"quiz":[{"q":"...","options":["A","B","C","D"],"answer":0,"explain":"warum richtig / typische Falle"}]}

MENGE: mind. 4-7 Karteikarten und 2-4 Quizfragen (plausible Distraktoren; answer = 0-basierter Index).
Gültiges JSON (Strings sauber escapen, Zeilenumbrüche als \n — KEINE rohen Steuerzeichen!).
```

**PROMPT Extra (wörtlich), je `extra_NN.md` → `frag/<slug>/extra_NN.json` (ARRAY):**
```
Du bist Ergotherapie-Fachdozent. Aus diesen Kursnotizen (Ergänzungsstoff, NICHT in der offiziellen
Eingrenzung) für "<FACH>" mache 1-3 kompakte Zusatz-Lernabschnitte.
QUELLE: Read build/<unit>/points/<slug>/extra_NN.md
Schreibe valides JSON (ARRAY) nach: build/<unit>/frag/<slug>/extra_NN.json
FORMAT: [{"title":"...","body":"Markdown (kompakt, das Wichtigste)"}]
Nur auf Basis der Notizen; deutsch.
```

Empfehlung: günstiges Text-Modell, höhere Denk-Tiefe bei Themen. Voll parallelisierbar (Schwarm).

**Häufigster Fehler:** rohe Zeilenumbrüche/Steuerzeichen in JSON-Strings → Datei ungültig.
`assemble.py` überspringt defekte Fragmente und meldet sie; solche Punkte einfach neu erzeugen
(`remaining.py` listet sie wieder als offen).

---

## 9. Fertigstellen & Verifizieren (Python + Commit)

Pro Gruppe, wenn die Fragmente stehen:
```
python pipeline/assemble.py <group>        # -> content/<slug>.js (überspringt Fächer ohne Themen)
python pipeline/postprocess.py <group>     # -> assets/<slug>/*.png + index.html aktualisiert
git add -A && git commit -m "<group>: <fach> fertig"
```
**Verifikation:** `app/index.html` im Browser öffnen → Fach auswählen → Lernpfad, Karteikarten,
Quiz durchklicken. `content/<slug>.js` ist per `json.dumps` gebaut, also immer valides JS.

---

## 10. Fallstricke / Besonderheiten

- **Kombinierte Fächer:** `paed-psych` (Pädagogik+Psychologie) und `ortho-rheuma`
  (Orthopädie+Rheumatologie) teilen sich EINEN render_unit/Notizen-Satz, haben aber eine gemeinsame
  Eingrenzung mit fortlaufender Nummerierung. `config.py`/`synthplan.py` behandeln das bereits korrekt.
- **Windows-Konsole (cp1252):** keine Sonderzeichen in `print()` (nutze ASCII), sonst UnicodeEncodeError.
- **`build/*/pages` und `text` sind gitignored** (groß/regenerierbar). Notizen/points/frag sind versioniert.
- **Idempotenz:** Immer `remaining.py` als Wahrheit nehmen; nur Offenes bearbeiten.
- **Ein defekter FG3-Notiz-Batch** (`psychosoziale/batch??`) ist unkritisch (98% Abdeckung); optional neu erzeugen.

---

## 11. Referenz-Skripte im Repo

- `pipeline/config.py` — Fächer, Ordner, Eingrenzungs-Überschriften, kombinierte Fächer.
- `pipeline/render.py`, `render_group.py` — PDF→PNG+Text (rekursiv über Unterordner).
- `pipeline/eingrenzung.py` — schneidet Prüfungsthemen je Fach aus `Examen.docx`.
- `pipeline/group_by_point.py`, `synthplan.py` — Notizen nach Punkt gruppieren.
- `pipeline/assemble.py`, `postprocess.py` — Fach bauen, Grafiken, index.html.
- `pipeline/remaining.py` — **Reststand/Worklist** (Startpunkt für den Schwarm).
- `pipeline/workflows/wf_notes.js`, `wf_synth.js` — Referenz-Orchestrierung (Claude-Harness;
  die reinen PROMPTS daraus stehen oben in §6/§8 und sind harness-unabhängig verwendbar).

Viel Erfolg — die Zielgerade ist FG 3 (fast fertig), dann FG 2, dann FG 1.
```
