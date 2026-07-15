# -*- coding: utf-8 -*-
"""Baut aus den Themen-Fragmenten (build/<ru>/frag/<slug>/topic_*.json, extra_*.json)
die fertige content/<slug>.js. Robust: defekte Fragmente werden gemeldet & übersprungen.
Aufruf: python assemble.py fg3
"""
import os, sys, re, json, glob
import config as C
from plan import NAMES


def assemble_subject(sub):
    slug, ru = sub["slug"], sub["render_unit"]
    fdir = os.path.join(C.ROOT, "build", ru, "frag", slug)
    topics, bad = [], []
    for f in sorted(glob.glob(os.path.join(fdir, "topic_*.json")),
                    key=lambda p: int(re.search(r"topic_(\d+)", p).group(1))):
        try:
            t = json.load(open(f, encoding="utf-8"))
            if isinstance(t, dict) and t.get("title") and t.get("body"):
                t.setdefault("prio", "high")
                topics.append(t)
            else:
                bad.append(os.path.basename(f))
        except Exception as e:
            bad.append(os.path.basename(f) + f" ({e})")
    extra = []
    for f in sorted(glob.glob(os.path.join(fdir, "extra_*.json"))):
        try:
            arr = json.load(open(f, encoding="utf-8"))
            if isinstance(arr, list):
                extra.extend(x for x in arr if isinstance(x, dict) and x.get("title") and x.get("body"))
            elif isinstance(arr, dict) and arr.get("title"):
                extra.append(arr)
        except Exception as e:
            bad.append(os.path.basename(f) + f" ({e})")
    if not topics:
        print(f"  !! {slug}: KEINE gültigen Themen ({len(bad)} defekt) — übersprungen")
        return None
    ncards = sum(len(t.get("flashcards", [])) for t in topics)
    nquiz = sum(len(t.get("quiz", [])) for t in topics)
    data = {
        "slug": slug, "fach": sub["fach"], "gruppe": sub["gruppe"],
        "intro": f"Diese Lerneinheit deckt **{len(topics)} prüfungsrelevante Themen** von {sub['fach']} ab "
                 f"(gemäß offizieller Eingrenzung), mit {ncards} Karteikarten und {nquiz} Quizfragen.",
        "topics": topics, "extra": extra,
    }
    out = os.path.join(C.ROOT, "content", slug + ".js")
    js = ("window.LERNDATEN = window.LERNDATEN || {};\n"
          f'window.LERNDATEN[{json.dumps(slug)}] = ' + json.dumps(data, ensure_ascii=False) + ";\n")
    open(out, "w", encoding="utf-8").write(js)
    msg = f"  {slug}: {len(topics)} Themen, {ncards} Karten, {nquiz} Quiz, {len(extra)} Extra"
    if bad:
        msg += f"  [defekt: {len(bad)} -> {', '.join(bad[:6])}]"
    print(msg)
    return {"slug": slug, "topics": len(topics), "bad": bad}


def main(group):
    print(f"=== Assemble {group} ===")
    res = []
    for s in C.subjects_for(group):
        r = assemble_subject(s)
        if r:
            res.append(r)
    print(f"FERTIG {group}: {len(res)} Fächer gebaut.")
    return res


if __name__ == "__main__":
    main(sys.argv[1])
