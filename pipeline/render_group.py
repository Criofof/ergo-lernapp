# -*- coding: utf-8 -*-
"""Rendert alle render_units einer Fächergruppe (Seiten-PNG + Textlayer + Manifest)
und schreibt die Eingrenzung. Aufruf: python render_group.py fg3 [zoom]"""
import sys, os, json
import config as C
from render import render_subject
import eingrenzung

def main(grp, zoom=2.5):
    units = C.render_units_for(grp)
    print(f"=== {grp}: {len(units)} render_units ===")
    total = 0
    for ru, folder in units.items():
        if not os.path.isdir(folder):
            print(f"  !! Ordner fehlt: {folder}"); continue
        m = render_subject(folder, ru, zoom)
        total += len(m["pages"])
    print(f"--- Eingrenzung {grp} ---")
    eingrenzung.write_for(C.subjects_for(grp))
    print(f"FERTIG {grp}: {total} Seiten gerendert.")

if __name__ == "__main__":
    grp = sys.argv[1]
    zoom = float(sys.argv[2]) if len(sys.argv) > 2 else 2.5
    main(grp, zoom)
