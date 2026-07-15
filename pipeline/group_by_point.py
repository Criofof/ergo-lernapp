# -*- coding: utf-8 -*-
"""Gruppiert die Seitennotizen eines Fachs nach Eingrenzungspunkt.
Für jeden Punkt N wird build/<ru>/points/<slug>/point_NN.md geschrieben
(Punkttext + alle relevanten Seitennotizen + Fakten + Grafik-Kandidaten).
Seiten ohne Treffer (type=inhalt) landen in extra_XX.md (gestückelt).

So liest später JE Punkt EIN kleiner Synthese-Agent nur seinen Ausschnitt.
Aufruf: python group_by_point.py <slug>
"""
import os, sys, re, json, glob
import config as C


def load_points(eingr_path):
    pts = {}
    for line in open(eingr_path, encoding="utf-8"):
        m = re.match(r"^(\d+)\.\s+(.*)$", line.strip())
        if m:
            pts[int(m.group(1))] = m.group(2)
    return pts


def hit_ints(hits):
    out = set()
    for h in (hits or []):
        if isinstance(h, int):
            out.add(h)
        else:
            m = re.match(r"\s*(\d+)", str(h))
            if m:
                out.add(int(m.group(1)))
    return out


def page_block(p):
    s = [f"### Seite gidx {p.get('gidx')} — {p.get('slide_title','')} (Quelle: {p.get('source','?')})"]
    if p.get("notes_md"):
        s.append(p["notes_md"])
    if p.get("key_facts"):
        s.append("**Fakten:** " + " | ".join(p["key_facts"]))
    figs = [f"FIGUR gidx={p.get('gidx')}: {f.get('caption','')} ({f.get('importance','')})"
            for f in (p.get("figures") or []) if f.get("extract") or f.get("importance") in ("high", "mid")]
    if figs:
        s.append("\n".join(figs))
    return "\n".join(s)


def run(sub):
    slug, ru = sub["slug"], sub["render_unit"]
    eingr = os.path.join(C.ROOT, "build", ru, f"eingrenzung_{slug}.md")
    pts = load_points(eingr)
    notes = []
    for f in sorted(glob.glob(os.path.join(C.ROOT, "build", ru, "notes", "batch*.json"))):
        try:
            notes.append(json.load(open(f, encoding="utf-8")))
        except Exception as e:
            print(f"  !! defekt: {f}: {e}")
    pages = [p for d in notes for p in d.get("pages", [])]
    outdir = os.path.join(C.ROOT, "build", ru, "points", slug)
    os.makedirs(outdir, exist_ok=True)
    # alte Fragmente/Punkte säubern
    for old in glob.glob(os.path.join(outdir, "*.md")):
        os.remove(old)
    # nach Punkt gruppieren
    by_pt = {n: [] for n in pts}
    extra = []
    for p in pages:
        hs = hit_ints(p.get("eingrenzung_hits"))
        hs = {h for h in hs if h in pts}
        if hs:
            for h in hs:
                by_pt[h].append(p)
        elif p.get("type") == "inhalt":
            extra.append(p)
    counts = {}
    for n, text in pts.items():
        ps = sorted(by_pt[n], key=lambda x: x.get("gidx", 0))
        body = f"# Eingrenzungspunkt {n}: {text}\n\n"
        if ps:
            body += "\n\n".join(page_block(p) for p in ps)
        else:
            body += "_(Keine Seite direkt zu diesem Punkt markiert — nutze allgemeines Fachwissen aus den Nachbarseiten, halte dich aber an das Kursniveau.)_"
        open(os.path.join(outdir, f"point_{n:02d}.md"), "w", encoding="utf-8").write(body)
        counts[n] = len(ps)
    # Extra gestückelt (max ~18 Seiten je Datei)
    CH = 18
    nchunks = 0
    for i in range(0, len(extra), CH):
        nchunks += 1
        chunk = extra[i:i + CH]
        body = f"# Ergänzungsstoff (nicht in Eingrenzung) — Teil {nchunks}\n\n" + "\n\n".join(page_block(p) for p in chunk)
        open(os.path.join(outdir, f"extra_{nchunks:02d}.md"), "w", encoding="utf-8").write(body)
    print(f"  {slug}: {len(pts)} Punkte (Seiten/Punkt: {sum(counts.values())} Treffer), {len(extra)} Extra-Seiten in {nchunks} Teilen")
    return {"slug": slug, "n_points": len(pts), "n_extra_chunks": nchunks, "counts": counts}


if __name__ == "__main__":
    slug = sys.argv[1]
    sub = next(s for s in C.SUBJECTS if s["slug"] == slug)
    run(sub)
