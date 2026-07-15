# -*- coding: utf-8 -*-
"""Erzeugt einen Verarbeitungs-Plan (JSON) für eine Fächergruppe, den der
Workflow als `args` bekommt (Workflow-Skripte haben keinen Datei-Zugriff).

Struktur:
{
 "group":"fg3",
 "units":[ {render_unit, notes_dir, eingrenzung:[pfade...], batches:[{id, pages:[{gidx,img,src}]}]} ],
 "subjects":[ {slug, render_unit, gruppe, fach, eingrenzung, notes_dir, content_out} ]
}
Aufruf: python plan.py fg3 [batch=12]
"""
import sys, os, json
import config as C

NAMES = {
  "mofu": "Motorisch-funktionelle BV (Mofu)", "at": "Arbeitstherapeutische BV (AT)",
  "neurophysio": "Neurophysiologische BV", "neuropsycho": "Neuropsychologische BV",
  "psychosoziale": "Psychosoziale BV",
  "psychologie": "Psychologie", "paedagogik": "Pädagogik",
  "behindertenpaedagogik": "Behindertenpädagogik", "berufskunde": "Berufs-, Gesetzes- und Staatsbürgerkunde",
  "akl": "Allgemeine Krankheitslehre (AKL)", "skl-paediatrie": "SKL Pädiatrie / Neuropädiatrie",
  "skl-psychiatrie": "SKL Psychiatrie / Gerontopsychiatrie", "skl-kjp": "SKL Kinder- und Jugendpsychiatrie",
  "skl-orthopaedie": "SKL Orthopädie", "skl-rheumatologie": "SKL Rheumatologie",
  "skl-chirurgie": "SKL Chirurgie / Traumatologie", "skl-neurologie": "SKL Neurologie",
  "skl-onkologie": "SKL Onkologie", "skl-innere": "SKL Innere Medizin / Geriatrie",
  "arbeitsmedizin": "Grundlagen Arbeitsmedizin",
}


def build(group, batch=12):
    """Kompaktes Plan-Format: der Workflow baut Bildpfade selbst aus
    root + render_unit + n_pages (Muster build/<ru>/pages/pXXXX.png)."""
    subs = C.subjects_for(group)
    units = {}
    for s in subs:
        units.setdefault(s["render_unit"], [])
        units[s["render_unit"]].append(s)
    root = C.ROOT.replace("\\", "/")
    plan = {"group": group, "root": root, "batch": batch, "units": [], "subjects": []}
    for ru, ss in units.items():
        man_path = os.path.join(C.ROOT, "build", ru, "manifest.json")
        if not os.path.isfile(man_path):
            print(f"  !! Manifest fehlt für {ru} — erst rendern!"); continue
        man = json.load(open(man_path, encoding="utf-8"))
        eingr = [f"{root}/build/{ru}/eingrenzung_{s['slug']}.md" for s in ss]
        plan["units"].append({
            "render_unit": ru,
            "notes_dir": f"{root}/build/{ru}/notes",
            "eingrenzung": eingr,
            "n_pages": len(man["pages"]),
        })
    for s in subs:
        plan["subjects"].append({
            "slug": s["slug"], "render_unit": s["render_unit"], "gruppe": s["gruppe"],
            "fach": NAMES.get(s["slug"], s["slug"]),
            "eingrenzung": (C.ROOT + f"/build/{s['render_unit']}/eingrenzung_{s['slug']}.md").replace("\\", "/"),
            "notes_dir": (C.ROOT + f"/build/{s['render_unit']}/notes").replace("\\", "/"),
            "content_out": (C.ROOT + f"/content/{s['slug']}.js").replace("\\", "/"),
        })
    out = os.path.join(C.ROOT, "build", f"plan_{group}.json")
    json.dump(plan, open(out, "w", encoding="utf-8"), ensure_ascii=False)
    import math
    nb = sum(math.ceil(u["n_pages"] / batch) for u in plan["units"])
    print(f"Plan {group}: {len(plan['units'])} units, {len(plan['subjects'])} Fächer, ~{nb} Batches, {sum(u['n_pages'] for u in plan['units'])} Seiten -> {out}")
    return out


if __name__ == "__main__":
    g = sys.argv[1]
    b = int(sys.argv[2]) if len(sys.argv) > 2 else 12
    build(g, b)
