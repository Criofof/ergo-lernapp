# -*- coding: utf-8 -*-
"""Führt die Punkt-Gruppierung für alle Fächer einer Gruppe aus und schreibt
einen Synthese-Plan (build/synthplan_<group>.json) für den Themen-Workflow.
Aufruf: python synthplan.py fg3
"""
import os, sys, json
import config as C
import group_by_point as G
from plan import NAMES


def build(group):
    root = C.ROOT.replace("\\", "/")
    subs = C.subjects_for(group)
    plan = {"group": group, "root": root, "subjects": []}
    for s in subs:
        eingr = os.path.join(C.ROOT, "build", s["render_unit"], f"eingrenzung_{s['slug']}.md")
        if not os.path.isfile(eingr):
            print(f"  !! eingrenzung fehlt: {s['slug']}"); continue
        info = G.run(s)
        pts = G.load_points(eingr)
        pdir = f"{root}/build/{s['render_unit']}/points/{s['slug']}"
        points = [{"n": n, "text": pts[n], "file": f"{pdir}/point_{n:02d}.md"} for n in sorted(pts)]
        extra = [f"{pdir}/extra_{k:02d}.md" for k in range(1, info["n_extra_chunks"] + 1)]
        plan["subjects"].append({
            "slug": s["slug"], "render_unit": s["render_unit"], "gruppe": s["gruppe"],
            "fach": NAMES.get(s["slug"], s["slug"]),
            "frag_dir": f"{root}/build/{s['render_unit']}/frag/{s['slug']}",
            "content_out": f"{root}/content/{s['slug']}.js",
            "points": points, "extra_files": extra,
        })
    out = os.path.join(C.ROOT, "build", f"synthplan_{group}.json")
    json.dump(plan, open(out, "w", encoding="utf-8"), ensure_ascii=False)
    ntopics = sum(len(x["points"]) for x in plan["subjects"])
    nextra = sum(len(x["extra_files"]) for x in plan["subjects"])
    print(f"Synthplan {group}: {len(plan['subjects'])} Fächer, {ntopics} Themen-Agenten, {nextra} Extra-Agenten -> {out}")
    return out


if __name__ == "__main__":
    build(sys.argv[1])
