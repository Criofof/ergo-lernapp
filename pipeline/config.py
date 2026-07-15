# -*- coding: utf-8 -*-
"""Zentrale Konfiguration für die Skalierung (FG 1-3, später Mündlich/Handwerk).

- RELEVANT_BASE: Wurzel der prüfungsrelevanten Fächer
- DOCX: Leitfaden mit der Eingrenzung
- EINGRENZUNG_ORDER: ALLE Eingrenzungs-Überschriften in DOKUMENT-Reihenfolge
  (nötig, um die Blöcke sauber zu schneiden)
- SUBJECTS: je Fach: slug, Ordner (relativ zu RELEVANT_BASE), Eingrenzungs-Überschrift,
  gruppe. 'render_unit' = build-Ordner der gerenderten Seiten; mehrere Fächer können
  sich EINEN render_unit teilen (kombinierte Kursordner wie Päd+Psych, Ortho+Rheuma).
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RELEVANT_BASE = os.path.join(os.path.dirname(ROOT), "Examen - Relevante Fächer (sehr wichtig)")
DOCX = os.path.join(RELEVANT_BASE, "Examen - Termine und Übersicht", "Examen.docx")

# Eingrenzungs-Überschriften exakt (mit Doppelpunkt) in Reihenfolge des Dokuments.
EINGRENZUNG_ORDER = [
    # FG 1
    "SKL - Psychiatrie:", "SKL - Kinder- und Jugendpsychiatrie:", "SKL - Psychosomatik:",
    "SKL - Pädiatrie:", "Arbeitsmedizin:", "Allgemeine Krankheitslehre (AKL):",
    "SKL - Innere Medizin und Geriatrie:", "SKL - Neurologie:", "SKL - Onkologie:",
    "SKL - Orthopädie:", "SKL - Chirurgie:", "SKL - Rheumatologie:",
    # FG 2
    "Psychologie:", "Pädagogik:", "Behindertenpädagogik:", "Berufskunde:",
    # FG 3
    "Motorisch-funktionelle BV (Mofu):", "Neurophysiologische BV:", "Neuropsychologische BV:",
    "Psychosoziale BV:", "Arbeitstherapeutische BV (AT):",
]

def _f(group, folder): return os.path.join(RELEVANT_BASE, group, folder)

FG1 = "Examen - Fächergruppe 1"
FG2 = "Examen - Fächergruppe 2"
FG3 = "Examen - Fächergruppe 3"

SUBJECTS = [
  # ---- FG 3 (Prüfung 03.08.) ----
  dict(slug="mofu", gruppe="fg3", render_unit="mofu",
       folder=_f(FG3, "Fach = Motorisch-Funktionelle Behandlungsverfahren (Mofu)"),
       heading="Motorisch-funktionelle BV (Mofu):"),
  dict(slug="neurophysio", gruppe="fg3", render_unit="neurophysio",
       folder=_f(FG3, "Fach = Neurophysiologische Behandlungsverfahren"),
       heading="Neurophysiologische BV:"),
  dict(slug="neuropsycho", gruppe="fg3", render_unit="neuropsycho",
       folder=_f(FG3, "Fach = Neuropsychologische Behandlungsverfahren"),
       heading="Neuropsychologische BV:"),
  dict(slug="psychosoziale", gruppe="fg3", render_unit="psychosoziale",
       folder=_f(FG3, "Fach = Psychosoziale Behandlungsverfahren"),
       heading="Psychosoziale BV:"),
  dict(slug="at", gruppe="fg3", render_unit="at",
       folder=_f(FG3, "Fach = Arbeitstherapeutische Behandlungsverfahren (AT)"),
       heading="Arbeitstherapeutische BV (AT):"),
  # ---- FG 2 (Prüfung 05.08.) ----  (Päd+Psych: ein Kursordner -> ein kombiniertes Fach)
  dict(slug="paed-psych", gruppe="fg2", render_unit="paed-psych",
       folder=_f(FG2, "Fach = Pädagogik und Psychologie"),
       headings=["Psychologie:", "Pädagogik:"]),
  dict(slug="behindertenpaedagogik", gruppe="fg2", render_unit="behindertenpaedagogik",
       folder=_f(FG2, "Fach = Behindertenpädagogik"),
       heading="Behindertenpädagogik:"),
  dict(slug="berufskunde", gruppe="fg2", render_unit="berufskunde",
       folder=_f(FG2, "Fach = Berufs-,Gesetzes- und Staatsbürgerkunde"),
       heading="Berufskunde:"),
  # ---- FG 1 (Prüfung 07.08.) ----  (Ortho+Rheuma teilen einen Kursordner)
  dict(slug="akl", gruppe="fg1", render_unit="akl",
       folder=_f(FG1, "Fach = Allgemeine Krankheitslehre (AKL)"),
       heading="Allgemeine Krankheitslehre (AKL):"),
  dict(slug="skl-paediatrie", gruppe="fg1", render_unit="skl-paediatrie",
       folder=_f(FG1, "Fach = SKL Pädiatrie"),
       heading="SKL - Pädiatrie:"),
  dict(slug="skl-psychiatrie", gruppe="fg1", render_unit="skl-psychiatrie",
       folder=_f(FG1, "Fach = SKL Psychiatrie und Gerontopsychiatrie"),
       heading="SKL - Psychiatrie:"),
  dict(slug="skl-kjp", gruppe="fg1", render_unit="skl-kjp",
       folder=_f(FG1, "Fach = SKL Kinder- und Jugendpsychiatrie (KJP)"),
       heading="SKL - Kinder- und Jugendpsychiatrie:"),
  dict(slug="ortho-rheuma", gruppe="fg1", render_unit="ortho-rheuma",
       folder=_f(FG1, "Fach = SKL Orthopädie und Rheumatologie"),
       headings=["SKL - Orthopädie:", "SKL - Rheumatologie:"]),
  dict(slug="skl-chirurgie", gruppe="fg1", render_unit="skl-chirurgie",
       folder=_f(FG1, "Fach = SKL Chirurgie"),
       heading="SKL - Chirurgie:"),
  dict(slug="skl-neurologie", gruppe="fg1", render_unit="skl-neurologie",
       folder=_f(FG1, "Fach = SKL Neurologie"),
       heading="SKL - Neurologie:"),
  dict(slug="skl-onkologie", gruppe="fg1", render_unit="skl-onkologie",
       folder=_f(FG1, "Fach = SKL Onkologie"),
       heading="SKL - Onkologie:"),
  dict(slug="skl-innere", gruppe="fg1", render_unit="skl-innere",
       folder=_f(FG1, "Fach = SKL Innere Medizin"),
       heading="SKL - Innere Medizin und Geriatrie:"),
  dict(slug="arbeitsmedizin", gruppe="fg1", render_unit="arbeitsmedizin",
       folder=_f(FG1, "Grundlagen der Arbeitsmedizin"),
       heading="Arbeitsmedizin:"),
  # psychosomatik ist bereits fertig (Pilot)
]

def subjects_for(gruppe):
    return [s for s in SUBJECTS if s["gruppe"] == gruppe]

def render_units_for(gruppe):
    seen = {}
    for s in subjects_for(gruppe):
        seen.setdefault(s["render_unit"], s["folder"])
    return seen  # {render_unit: folder}
