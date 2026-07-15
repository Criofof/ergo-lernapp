/* Struktur aller Fächergruppen, Fächer und Termine.
   'slug' verweist auf die Lerndaten in window.LERNDATEN[slug] (content/<slug>.js).
   'available' wird true, sobald Inhalte vorhanden sind. */
window.LERNSTRUKTUR = {
  titel: "Examen Ergotherapie 2026",
  gruppen: [
    {
      id: "fg3",
      name: "Fächergruppe 3 — Behandlungsverfahren",
      pruefung: "schriftlich",
      datum: "2026-08-03",
      faecher: [
        { slug: "mofu", name: "Motorisch-funktionelle BV (Mofu)" },
        { slug: "at", name: "Arbeitstherapeutische BV (AT)" },
        { slug: "neurophysio", name: "Neurophysiologische BV" },
        { slug: "neuropsycho", name: "Neuropsychologische BV" },
        { slug: "psychosoziale", name: "Psychosoziale BV" }
      ]
    },
    {
      id: "fg2",
      name: "Fächergruppe 2 — Gesetze, Psychologie, Pädagogik",
      pruefung: "schriftlich",
      datum: "2026-08-05",
      faecher: [
        { slug: "berufskunde", name: "Berufs-, Gesetzes- und Staatsbürgerkunde" },
        { slug: "paed-psych", name: "Pädagogik & Psychologie" },
        { slug: "behindertenpaedagogik", name: "Behindertenpädagogik" }
      ]
    },
    {
      id: "fg1",
      name: "Fächergruppe 1 — Krankheitslehre (AKL / SKL)",
      pruefung: "schriftlich",
      datum: "2026-08-07",
      faecher: [
        { slug: "akl", name: "Allgemeine Krankheitslehre (AKL)" },
        { slug: "skl-paediatrie", name: "SKL Pädiatrie / Neuropädiatrie" },
        { slug: "skl-psychiatrie", name: "SKL Psychiatrie / Gerontopsychiatrie" },
        { slug: "skl-kjp", name: "SKL Kinder- und Jugendpsychiatrie" },
        { slug: "psychosomatik", name: "SKL Psychosomatik" },
        { slug: "ortho-rheuma", name: "SKL Orthopädie & Rheumatologie" },
        { slug: "skl-chirurgie", name: "SKL Chirurgie / Traumatologie" },
        { slug: "skl-neurologie", name: "SKL Neurologie" },
        { slug: "skl-onkologie", name: "SKL Onkologie" },
        { slug: "skl-innere", name: "SKL Innere Medizin / Geriatrie" },
        { slug: "arbeitsmedizin", name: "Grundlagen Arbeitsmedizin" }
      ]
    },
    {
      id: "muendlich",
      name: "Mündliche Fächer",
      pruefung: "mündlich",
      datum: "2026-09-23",
      faecher: [
        { slug: "get", name: "Grundlagen der Ergotherapie (GET)" },
        { slug: "medsoz", name: "Medizinsoziologie & Gerontologie" },
        { slug: "bap", name: "Biologie, Anatomie und Physiologie (BAP)" }
      ]
    },
    {
      id: "handwerk",
      name: "Praktische Prüfung — Handwerk",
      pruefung: "praktisch",
      datum: "2026-09-17",
      faecher: [
        { slug: "tm", name: "Therapeutische Mittel (TM)" }
      ]
    }
  ]
};
