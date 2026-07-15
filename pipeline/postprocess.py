# -*- coding: utf-8 -*-
"""Nachbearbeitung nach dem Workflow, je Fächergruppe:
 1) Aus jeder content/<slug>.js die referenzierten Grafik-Pfade (assets/<slug>/gNN.png)
    lesen und die passende Seite sauber aus der Quell-PDF nach assets/<slug>/gNN.png rendern.
 2) app/index.html: <script>-Tags für alle vorhandenen content/*.js ergänzen.
Aufruf: python postprocess.py fg3
"""
import sys, os, re, json, glob
import fitz
import config as C

FIG_ZOOM = 1.7  # kompaktere Assets als die Verarbeitungs-Renders (2.5)


def manifest_for(render_unit):
    p = os.path.join(C.ROOT, "build", render_unit, "manifest.json")
    return json.load(open(p, encoding="utf-8")) if os.path.isfile(p) else None


def extract_figs_for_subject(sub):
    content = os.path.join(C.ROOT, "content", sub["slug"] + ".js")
    if not os.path.isfile(content):
        print(f"  !! content fehlt: {sub['slug']}"); return 0
    txt = open(content, encoding="utf-8").read()
    gidxs = sorted(set(int(m) for m in re.findall(rf'assets/{re.escape(sub["slug"])}/g(\d+)\.png', txt)))
    if not gidxs:
        return 0
    man = manifest_for(sub["render_unit"])
    if not man:
        print(f"  !! Manifest fehlt: {sub['render_unit']}"); return 0
    by_gidx = {p["gidx"]: p for p in man["pages"]}
    subject_dir = man["subject_dir"]
    outdir = os.path.join(C.ROOT, "assets", sub["slug"])
    os.makedirs(outdir, exist_ok=True)
    mat = fitz.Matrix(FIG_ZOOM, FIG_ZOOM)
    n = 0
    for g in gidxs:
        pg = by_gidx.get(g)
        if not pg:
            continue
        src_pdf = os.path.join(subject_dir, pg["source_pdf"])
        try:
            doc = fitz.open(src_pdf)
            page = doc.load_page(pg["source_page"] - 1)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            pix.save(os.path.join(outdir, f"g{g}.png"))
            doc.close(); n += 1
        except Exception as e:
            print(f"    Fehler g{g} ({src_pdf}): {e}")
    print(f"  {sub['slug']}: {n} Grafiken -> assets/{sub['slug']}/")
    return n


def update_index():
    idx = os.path.join(C.ROOT, "app", "index.html")
    html = open(idx, encoding="utf-8").read()
    slugs = sorted(os.path.basename(f)[:-3] for f in glob.glob(os.path.join(C.ROOT, "content", "*.js"))
                   if not os.path.basename(f).startswith("_"))
    tags = "\n".join(f'  <script src="../content/{s}.js"></script>' for s in slugs)
    block = re.sub(
        r'(<!-- Lerninhalte.*?-->\n).*?(\n\s*<!-- Bibliothek)',
        lambda m: m.group(1) + tags + m.group(2),
        html, flags=re.S)
    open(idx, "w", encoding="utf-8").write(block)
    print(f"index.html: {len(slugs)} content-Dateien eingebunden ({', '.join(slugs)})")


def main(group):
    subs = C.subjects_for(group)
    print(f"=== Nachbearbeitung {group} ===")
    total = 0
    for s in subs:
        total += extract_figs_for_subject(s)
    update_index()
    print(f"FERTIG {group}: {total} Grafiken extrahiert.")


if __name__ == "__main__":
    main(sys.argv[1])
