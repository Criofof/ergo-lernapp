# -*- coding: utf-8 -*-
"""Schneidet aus Examen.docx die Eingrenzung je Fach und schreibt
build/<render_unit>/eingrenzung_<slug>.md   (nummerierte Liste)."""
import os, sys, docx
import config as C


def extract_blocks():
    d = docx.Document(C.DOCX)
    paras = [p.text.strip() for p in d.paragraphs]
    # Region der Eingrenzungen: ab erstem "...Eingrenzung:" bis "Mündliche Fächer"
    start = next((i for i, t in enumerate(paras) if t.endswith("Eingrenzung:")), 0)
    end = next((i for i, t in enumerate(paras) if i > start and t.startswith("Mündliche Fächer")), len(paras))
    region = list(range(start, end))
    # Position jeder Überschrift finden
    pos = {}
    for h in C.EINGRENZUNG_ORDER:
        for i in region:
            if paras[i] == h:
                pos[h] = i
                break
    ordered = sorted(pos.items(), key=lambda kv: kv[1])  # [(heading, idx), ...]
    blocks = {}
    for k, (h, idx) in enumerate(ordered):
        nxt = ordered[k + 1][1] if k + 1 < len(ordered) else end
        lines = []
        for i in range(idx + 1, nxt):
            t = paras[i]
            if not t or set(t) <= set("_ "):  # Trennlinien / leer
                continue
            if t.endswith("Eingrenzung:") or t.startswith("Fächergruppe"):
                continue
            lines.append(t)
        blocks[h] = lines
    return blocks


def write_for(subjects):
    blocks = extract_blocks()
    out = []
    for s in subjects:
        lines = blocks.get(s["heading"])
        if not lines:
            print(f"  !! keine Eingrenzung gefunden für {s['slug']} ({s['heading']})")
            continue
        d = os.path.join(C.ROOT, "build", s["render_unit"])
        os.makedirs(d, exist_ok=True)
        p = os.path.join(d, f"eingrenzung_{s['slug']}.md")
        with open(p, "w", encoding="utf-8") as fh:
            fh.write(f"# Eingrenzung prüfungsrelevanter Themen — {s['heading'].rstrip(':')}\n\n")
            fh.write("Aus dem offiziellen Leitfaden (Examen.docx). Höchste Priorität:\n\n")
            for i, ln in enumerate(lines, 1):
                fh.write(f"{i}. {ln}\n")
        out.append((s["slug"], len(lines)))
        print(f"  {s['slug']}: {len(lines)} Eingrenzungspunkte -> {os.path.relpath(p, C.ROOT)}")
    return out


if __name__ == "__main__":
    grp = sys.argv[1] if len(sys.argv) > 1 else None
    subs = C.subjects_for(grp) if grp else C.SUBJECTS
    write_for(subs)
