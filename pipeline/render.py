# -*- coding: utf-8 -*-
"""
Render + Textextraktion für ein Fach.

Für jede PDF-Seite:
  - Textlayer extrahieren (kann bei Scans/Bild-Folien leer sein -> deshalb zusätzlich Bild)
  - Seite als PNG rendern (Standard ~180 DPI), damit Vision-Agenten JEDES Detail sehen
    (Schaubilder, Tabellen, Beschriftungen), auch wenn kein Textlayer existiert.

Ausgabe:
  build/<slug>/pages/p0001.png ...
  build/<slug>/text/p0001.txt ...
  build/<slug>/manifest.json   (Liste aller Seiten mit Quelle, Bild-/Textpfad, Textlänge)

Aufruf:
  python pipeline/render.py "<absoluter Pfad zum Fach-Ordner>" <slug> [zoom]
"""
import sys, os, json, re, unicodedata
import fitz  # pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "build")


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "fach"


def render_subject(subject_dir, slug, zoom=2.5):
    out = os.path.join(BUILD, slug)
    pdir = os.path.join(out, "pages")
    tdir = os.path.join(out, "text")
    os.makedirs(pdir, exist_ok=True)
    os.makedirs(tdir, exist_ok=True)

    # REKURSIV alle PDFs (auch in thematischen Unterordnern) sammeln, stabil sortiert
    pdfs = []
    for r, dirs, files in os.walk(subject_dir):
        for f in files:
            if f.lower().endswith(".pdf"):
                full = os.path.join(r, f)
                rel = os.path.relpath(full, subject_dir).replace("\\", "/")
                pdfs.append((rel, full))
    pdfs.sort(key=lambda x: x[0].lower())
    manifest = {"slug": slug, "subject_dir": subject_dir, "pages": []}
    gidx = 0
    mat = fitz.Matrix(zoom, zoom)
    for pdf, path in pdfs:
        try:
            doc = fitz.open(path)
        except Exception as e:
            print(f"  !! Fehler beim Öffnen {pdf}: {e}")
            continue
        npages = doc.page_count
        for i in range(npages):
            gidx += 1
            page = doc.load_page(i)
            txt = page.get_text("text").strip()
            name = f"p{gidx:04d}"
            # Bild rendern
            pix = page.get_pixmap(matrix=mat, alpha=False)
            img_path = os.path.join(pdir, name + ".png")
            pix.save(img_path)
            # Text speichern
            txt_path = os.path.join(tdir, name + ".txt")
            with open(txt_path, "w", encoding="utf-8") as fh:
                fh.write(txt)
            manifest["pages"].append({
                "gidx": gidx,
                "source_pdf": pdf,
                "source_page": i + 1,
                "img": os.path.relpath(img_path, ROOT).replace("\\", "/"),
                "txt": os.path.relpath(txt_path, ROOT).replace("\\", "/"),
                "text_len": len(txt),
            })
        doc.close()
        print(f"  {pdf}: {npages} Seiten")

    with open(os.path.join(out, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)
    print(f"OK {slug}: {gidx} Seiten gerendert -> {out}")
    return manifest


if __name__ == "__main__":
    subject_dir = sys.argv[1]
    slug = sys.argv[2] if len(sys.argv) > 2 else slugify(os.path.basename(subject_dir))
    zoom = float(sys.argv[3]) if len(sys.argv) > 3 else 2.5
    render_subject(subject_dir, slug, zoom)
