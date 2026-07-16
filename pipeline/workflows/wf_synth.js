export const meta = {
  name: 'et-synth-topics',
  description: 'Themen-basierte Synthese: je Pruefungsthema ein Agent -> Fragment-JSON',
  phases: [{ title: 'Themen', detail: 'Lerneinheit je Eingrenzungspunkt' }],
}

let plan = args
if (typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) {} }
if (plan && typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) {} }
if (!plan || !plan.subjects) { log('FEHLER: kein Synthplan (typeof=' + typeof args + ')'); return { error: 'no plan' } }

function pad2(n) { n = String(n); return n.length < 2 ? '0' + n : n }

function topicPrompt(sub, n) {
  const file = `${sub.points_dir}/point_${pad2(n)}.md`
  const out = `${sub.frag_dir}/topic_${pad2(n)}.json`
  return `Du bist Didaktik-Experte und Ergotherapie-Fachdozent. Erstelle EIN pruefungsfertiges Lernthema fuer das Fach "${sub.fach}" (${sub.gruppe.toUpperCase()}).

QUELLE: Read ${file}
Die erste Zeile der Datei lautet "# Eingrenzungspunkt ${n}: <THEMA>" — das ist das genaue Pruefungsthema. Danach folgen die zusammengetragenen Kursnotizen (Seiten) zu genau diesem Thema, inkl. FIGUR-Markierungen (gidx = Seitennummer wichtiger Schaubilder).

REGELN:
- Inhaltlich AUSSCHLIESSLICH auf Basis dieser Notizen (echtes Kursmaterial). Nichts dazuerfinden (keine erfundenen Zahlen/Fakten). Didaktisch strukturieren/ausformulieren ist erlaubt. Falls die Notizen zu diesem Punkt duenn sind, formuliere fachlich korrekt auf Kursniveau, ohne Fakten zu erfinden.
- Deutsch, klar, Fachbegriffe korrekt. Wichtige Tabellen/Schaubild-Inhalte praezise wiedergeben.
- GRAFIKEN: Wenn die Notizen eine FIGUR (gidx=NN) mit klarem Lernwert enthalten, binde sie ein via figures:[{src:"assets/${sub.slug}/g<NN>.png",caption:"..."}]. Nur wirklich lehrreiche.

AUSGABE — schreibe valides JSON nach: ${out}
FORMAT (genau ein Objekt):
{"id":"kurz-slug","title":"praegnanter Titel","eingrenzung":"<THEMA-Text aus der ersten Zeile der Quelldatei, ohne die Nummer>","prio":"high",
 "body":"Ausfuehrlicher Lerntext (Markdown: ## / ### Ueberschriften, Listen, **fett**, Tabellen | a | b |).",
 "facts":["must-know Kernfakten, je 1 Satz"],
 "figures":[{"src":"assets/${sub.slug}/gNN.png","caption":"..."}],
 "flashcards":[{"q":"...","a":"..."}],
 "quiz":[{"q":"...","options":["A","B","C","D"],"answer":0,"explain":"warum richtig / typische Falle"}]}

MENGE: mind. 4-7 Karteikarten und 2-4 Quizfragen (plausible Distraktoren; answer=0-basierter Index). Achte auf gueltiges JSON (Strings sauber escapen, Zeilenumbrueche als \\n). Am Ende nur kurze Bestaetigung.`
}

function extraPrompt(sub, k) {
  const file = `${sub.points_dir}/extra_${pad2(k)}.md`
  const out = `${sub.frag_dir}/extra_${pad2(k)}.json`
  return `Du bist Ergotherapie-Fachdozent. Aus den folgenden Kursnotizen (Ergaenzungsstoff, NICHT in der offiziellen Eingrenzung) fuer "${sub.fach}" sollst du 1-3 kompakte Zusatz-Lernabschnitte machen.
QUELLE: Read ${file}
Schreibe valides JSON (ARRAY) nach: ${out}
FORMAT: [{"title":"...","body":"Markdown (kompakt, das Wichtigste)"}]
Nur auf Basis der Notizen; deutsch. Am Ende kurze Bestaetigung.`
}

log(`Synthplan ${plan.group}: ${plan.subjects.length} Faecher, ${plan.subjects.reduce((a, s) => a + s.point_ns.length, 0)} Themen`)

await parallel(plan.subjects.flatMap(sub => {
  const jobs = sub.point_ns.map(n => () =>
    agent(topicPrompt(sub, n), {
      phase: 'Themen', label: `${sub.slug}:P${n}`,
      agentType: 'general-purpose', model: 'sonnet', effort: 'high',
    }))
  const ex = []
  for (let k = 1; k <= (sub.n_extra || 0); k++) {
    ex.push(() => agent(extraPrompt(sub, k), {
      phase: 'Themen', label: `${sub.slug}:extra${k}`,
      agentType: 'general-purpose', model: 'sonnet', effort: 'medium',
    }))
  }
  return jobs.concat(ex)
}))

return { group: plan.group, subjects: plan.subjects.map(s => s.slug) }
