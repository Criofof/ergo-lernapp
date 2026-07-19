# -*- coding: utf-8 -*-
"""Flache, maschinenlesbare Worklist für den Agenten-Schwarm.
Jeder Eintrag = GENAU EIN Agent-Job (idempotent; nur offene Arbeit).

  {"type":"notes", group, unit, batch, out, pngs:[...], eingrenzung:[...]}
  {"type":"topic", group, slug, unit, n, in, out}
  {"type":"extra", group, slug, unit, k, in, out}

Aufruf:  python worklist.py            > worklist.json   (alle Gruppen)
         python worklist.py fg3 fg2    > worklist.json   (Auswahl)
Pfade sind relativ zum Repo-Wurzelordner (Lernapp/).
"""
import os, sys, glob, json, math
import config as C
import remaining as R

ROOT = C.ROOT


def rel(p):
    return os.path.relpath(p, ROOT).replace("\\", "/")


def eingrenzung_files(unit):
    return sorted(rel(p) for p in glob.glob(os.path.join(ROOT, "build", unit, "eingrenzung_*.md")))


def notes_jobs(group):
    jobs = []
    for ru, folder in C.render_units_for(group).items():
        st = R.unit_notes_state(ru)
        eingr = eingrenzung_files(ru)
        for bid in st["missing_batches"]:
            b = int(bid)
            gidxs = range((b - 1) * 12 + 1, min(b * 12, st["pages"]) + 1)
            pngs = [f"build/{ru}/pages/p{g:04d}.png" for g in gidxs]
            jobs.append({"type": "notes", "group": group, "unit": ru, "batch": bid,
                         "out": f"build/{ru}/notes/batch{bid}.json",
                         "pngs": pngs, "eingrenzung": eingr})
    return jobs


def synth_jobs(group):
    jobs = []
    for s in C.subjects_for(group):
        st = R.subject_topic_state(s)
        if not st["grouped"]:
            continue  # erst Notizen + synthplan.py
        slug, ru = s["slug"], s["render_unit"]
        base = f"build/{ru}"
        for n in (st["missing_points"] or []):
            jobs.append({"type": "topic", "group": group, "slug": slug, "unit": ru, "n": n,
                         "in": f"{base}/points/{slug}/point_{n:02d}.md",
                         "out": f"{base}/frag/{slug}/topic_{n:02d}.json"})
        for k in (st["missing_extras"] or []):
            jobs.append({"type": "extra", "group": group, "slug": slug, "unit": ru, "k": k,
                         "in": f"{base}/points/{slug}/extra_{k:02d}.md",
                         "out": f"{base}/frag/{slug}/extra_{k:02d}.json"})
    return jobs


def build(groups):
    jobs = []
    for g in groups:
        jobs += notes_jobs(g)
        jobs += synth_jobs(g)
    return jobs


if __name__ == "__main__":
    groups = [a for a in sys.argv[1:] if not a.startswith("--")] or ["fg3", "fg2", "fg1"]
    jobs = build(groups)
    n = sum(1 for j in jobs if j["type"] == "notes")
    t = sum(1 for j in jobs if j["type"] in ("topic", "extra"))
    sys.stderr.write(f"Worklist: {len(jobs)} Jobs offen ({n} Notizen, {t} Themen/Extra) fuer {groups}\n")
    print(json.dumps(jobs, ensure_ascii=False, indent=1))
