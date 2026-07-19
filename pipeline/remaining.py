# -*- coding: utf-8 -*-
"""Reststand-Report: was ist je Fächergruppe noch zu tun?
Zählt Render-Seiten, fehlende Notiz-Batches (12 Seiten/Batch) und – falls Notizen
vollständig – fehlende Themen-/Extra-Fragmente. Rein lokal, kein API.

Aufruf:  python remaining.py            # alle Gruppen
         python remaining.py fg2        # eine Gruppe
         python remaining.py fg2 --json # Maschinenlesbar (für den Schwarm)
"""
import os, sys, json, glob, re, math
import config as C

ROOT = C.ROOT


def valid_json(p):
    try:
        json.load(open(p, encoding="utf-8")); return True
    except Exception:
        return False


def unit_notes_state(ru):
    pages = len(glob.glob(os.path.join(ROOT, "build", ru, "pages", "*.png")))
    nb = math.ceil(pages / 12) if pages else 0
    have, bad = [], []
    for b in range(1, nb + 1):
        p = os.path.join(ROOT, "build", ru, "notes", f"batch{b:02d}.json")
        if os.path.isfile(p):
            (have if valid_json(p) else bad).append(f"{b:02d}")
    missing = [f"{b:02d}" for b in range(1, nb + 1)
               if f"{b:02d}" not in have]  # fehlend ODER defekt
    return {"pages": pages, "n_batches": nb, "have": len(have),
            "missing_batches": missing}


def subject_topic_state(s):
    slug, ru = s["slug"], s["render_unit"]
    pdir = os.path.join(ROOT, "build", ru, "points", slug)
    fdir = os.path.join(ROOT, "build", ru, "frag", slug)
    pts = sorted(int(re.search(r"point_(\d+)", f).group(1)) for f in glob.glob(os.path.join(pdir, "point_*.md")))
    exs = sorted(int(re.search(r"extra_(\d+)", f).group(1)) for f in glob.glob(os.path.join(pdir, "extra_*.md")))
    done_p = {int(re.search(r"topic_(\d+)", f).group(1)) for f in glob.glob(os.path.join(fdir, "topic_*.json")) if valid_json(f)}
    done_e = {int(re.search(r"extra_(\d+)", f).group(1)) for f in glob.glob(os.path.join(fdir, "extra_*.json")) if valid_json(f)}
    grouped = bool(pts)  # points/ existiert erst nach group_by_point (= Notizen fertig)
    return {
        "grouped": grouped,
        "missing_points": [n for n in pts if n not in done_p] if grouped else None,
        "missing_extras": [k for k in exs if k not in done_e] if grouped else None,
        "n_points": len(pts), "n_extra": len(exs),
    }


def group_report(group):
    rep = {"group": group, "render_units": {}, "subjects": []}
    for ru, folder in C.render_units_for(group).items():
        rep["render_units"][ru] = unit_notes_state(ru)
    for s in C.subjects_for(group):
        st = subject_topic_state(s)
        st["slug"] = s["slug"]; st["render_unit"] = s["render_unit"]
        content = os.path.join(ROOT, "content", s["slug"] + ".js")
        st["content_built"] = os.path.isfile(content)
        rep["subjects"].append(st)
    return rep


def print_report(rep):
    print(f"\n=== {rep['group'].upper()} ===")
    print("Render/Notizen je Einheit:")
    for ru, u in rep["render_units"].items():
        miss = u["missing_batches"]
        flag = "[OK] komplett" if not miss and u["n_batches"] else (f"{len(miss)} Batches offen/defekt" if u["n_batches"] else "NICHT gerendert")
        print(f"  {ru:24s} {u['pages']:4d} S. / {u['n_batches']:3d} Batches  -> {flag}")
    print("Themen je Fach:")
    for s in rep["subjects"]:
        if not s["grouped"]:
            print(f"  {s['slug']:24s} Notizen unvollständig -> erst Notizen + group_by_point")
        else:
            mp, me = s["missing_points"], s["missing_extras"]
            done = (s["n_points"] - len(mp))
            state = "[OK] fertig" if not mp and not me else f"{len(mp)} Themen + {len(me)} Extra offen"
            print(f"  {s['slug']:24s} {done}/{s['n_points']} Themen, content={'ja' if s['content_built'] else 'nein'}  -> {state}")


if __name__ == "__main__":
    groups = [a for a in sys.argv[1:] if not a.startswith("--")]
    as_json = "--json" in sys.argv
    if not groups:
        groups = ["fg3", "fg2", "fg1"]
    reps = [group_report(g) for g in groups]
    if as_json:
        print(json.dumps(reps, ensure_ascii=False, indent=1))
    else:
        for r in reps:
            print_report(r)
