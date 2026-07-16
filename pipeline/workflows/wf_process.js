export const meta = {
  name: 'et-process-group',
  description: 'Verarbeitet eine Ergotherapie-Faechergruppe: Vision-Batch-Notizen + Synthese je Fach',
  phases: [
    { title: 'Notizen', detail: 'Vision-Agenten erfassen Seiten (Sonnet)' },
    { title: 'Synthese', detail: 'Lerneinheit je Fach (Opus)' },
  ],
}

// args = Inhalt von build/plan_<group>.json (kann als Objekt ODER als JSON-String ankommen)
let plan = args
if (typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) { log('args-String nicht parsebar: ' + e) } }
if (plan && typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) {} }
if (!plan || !plan.units) { log('FEHLER: kein Plan in args (typeof=' + typeof args + ')'); return { error: 'no plan' } }

const ROOT = plan.root
const BATCH = plan.batch || 12
function pad4(n) { n = String(n); return '0000'.slice(n.length) + n }
function batchesFor(unit) {
  const out = []
  for (let start = 1; start <= unit.n_pages; start += BATCH) {
    const pages = []
    const end = Math.min(start + BATCH - 1, unit.n_pages)
    for (let g = start; g <= end; g++)
      pages.push({ gidx: g, img: `${ROOT}/build/${unit.render_unit}/pages/p${pad4(g)}.png` })
    out.push({ id: pad4(Math.floor((start - 1) / BATCH) + 1).slice(2), pages })
  }
  return out
}

function notesPrompt(unit, batch) {
  const eingr = unit.eingrenzung.join('\n')
  const pages = batch.pages.map(p =>
    `- gidx ${p.gidx} | BILD: ${p.img}  (Textlayer: gleicher Pfad, /pages/->/text/, .png->.txt)`).join('\n')
  return `Du bist sorgfaeltiger Fachlektor fuer die staatliche Ergotherapie-Pruefung. Erfasse die zugewiesenen Kursseiten VOLLSTAENDIG und pruefungsfokussiert. Kein Detail darf verloren gehen.

SCHRITT 1 — Lies die Eingrenzung(en) (offiziell pruefungsrelevante Themen). Es koennen ein oder zwei Dateien sein (das Fach teilt sich ggf. Material mit einem Nachbarfach):
${eingr.split('\n').map(e => 'Read: ' + e).join('\n')}

SCHRITT 2 — Verarbeite diese ${batch.pages.length} Seiten. Fuer JEDE Seite: nutze das Read-Tool auf die PNG-Bilddatei (das BILD ist die Hauptquelle — Schaubilder, Tabellen, Beschriftungen!), und lies zusaetzlich die zugehoerige Textdatei (gleicher Pfad, aber /pages/pXXXX.png -> /text/pXXXX.txt). Das Bild hat Vorrang bei fragmentiertem Text.
${pages}

SCHRITT 3 — Schreibe die Ergebnisse als valides JSON nach:
${unit.notes_dir}/batch${batch.id}.json

JSON-Format (exakt):
{"batch":"${batch.id}","pages":[{"gidx":<int>,"source":"Kurzquelle","slide_title":"Ueberschrift der Seite","type":"inhalt|gliederung|titel|deko|quelle","notes_md":"AUSFUEHRLICHE pruefungsfokussierte Notizen (Markdown). Erfasse JEDEN fachlichen Inhalt. Transkribiere Text in Schaubildern/Tabellen WORTWOERTLICH. Beschreibe Aufbau/Beschriftungen/Pfeile exakt.","figures":[{"caption":"Kurztitel","shows":"was die Grafik zeigt","importance":"high|mid|low","extract":true}],"eingrenzung_hits":[<Nummern der getroffenen Eingrenzungspunkte, ints>],"key_facts":["atomare pruefungsrelevante Einzelfakten"]}]}

WICHTIG: exhaustiv, deutsch, Fachbegriffe korrekt. "extract":true nur bei fachlich wichtigen Schaubildern/Tabellen (nicht Deko/Titel). eingrenzung_hits ernst nehmen. Am Ende nur kurze Bestaetigung zurueckgeben; die Daten stehen in der JSON-Datei.`
}

function synthPrompt(sub) {
  return `Du bist Didaktik-Experte und Ergotherapie-Fachdozent. Erstelle aus vorbereiteten Seiten-Notizen eine pruefungsfertige, interaktive Lerneinheit fuer das Fach "${sub.fach}" (${sub.gruppe.toUpperCase()}) und schreibe sie als JavaScript-Datei.

QUELLEN (alle lesen):
- Eingrenzung (offiziell pruefungsrelevant): Read ${sub.eingrenzung}
- Alle Seiten-Notizen im Ordner: ${sub.notes_dir}  (Dateien batch*.json — liste sie und lies ALLE). Hinweis: Der Ordner kann Notizen enthalten, die auch ein Nachbarfach betreffen; nimm nur, was zu DEINER Eingrenzung/diesem Fach passt.

REGELN:
- Inhaltlich AUSSCHLIESSLICH auf Basis der Notizen (echtes Kursmaterial). Nichts dazuerfinden; keine erfundenen Zahlen/Fakten. Du darfst didaktisch strukturieren/ausformulieren.
- Deutsch, klare Sprache, Fachbegriffe korrekt.
- Fuer JEDEN Eingrenzungspunkt ein Topic (sinnvolle Lernreihenfolge). Ergaenzungsstoff (nicht in Eingrenzung) kommt in "extra".

GRAFIKEN: Wenn eine Seite in den Notizen ein wichtiges Schaubild/Tabelle hat (figures.extract=true oder importance high/mid), binde es ein via "figures":[{"src":"assets/${sub.slug}/g<GIDX>.png","caption":"..."}] — <GIDX> ist die gidx der Seite aus den Notizen. Nur wirklich lehrreiche Grafiken.

AUSGABE — schreibe exakt diese Datei: ${sub.content_out}
FORMAT (gueltiges JavaScript):
window.LERNDATEN = window.LERNDATEN || {};
window.LERNDATEN["${sub.slug}"] = {
  slug: "${sub.slug}", fach: "${sub.fach}", gruppe: "${sub.gruppe}",
  intro: "1-2 Saetze Markdown (worum geht es, Anzahl Themen, Pruefungsfokus).",
  topics: [ { id:"kurz-slug", title:"...", eingrenzung:"Originaltext des Punkts", prio:"high",
    body:"Ausfuehrlicher Lerntext (Markdown: ##/### Ueberschriften, Listen, **fett**, Tabellen | a | b |).",
    facts:["must-know Kernfakten, je 1 Satz"],
    figures:[{src:"assets/${sub.slug}/gXX.png",caption:"..."}],
    flashcards:[{q:"...",a:"..."}],
    quiz:[{q:"...",options:["A","B","C","D"],answer:0,explain:"warum richtig/typische Falle"}] } ],
  extra: [ {title:"...", body:"Markdown"} ]
};

INHALT: Pro Topic mind. 4-7 Karteikarten und 2-4 Quizfragen (plausible Distraktoren; answer = 0-basierter Index). "facts" = must-know. Achte auf gueltiges JS (Strings sauber escapen). Am Ende kurze Zusammenfassung: Anzahl Topics, Karteikarten, Quizfragen, eingebundene Grafiken.`
}

log(`Plan ${plan.group}: ${plan.units.length} units, ${plan.subjects.length} Faecher`)

await parallel(plan.units.map(unit => async () => {
  // 1) Notizen: alle Batches dieser Unit parallel
  const batches = batchesFor(unit)
  await parallel(batches.map(b => () =>
    agent(notesPrompt(unit, b), {
      phase: 'Notizen', label: `notes:${unit.render_unit}:${b.id}`,
      agentType: 'general-purpose', model: 'sonnet', effort: 'medium',
    })
  ))
  log(`Notizen fertig: ${unit.render_unit} (${batches.length} Batches)`)
  // 2) Synthese optional (nur wenn plan.do_synth) — sonst themen-basiert separat
  if (plan.do_synth) {
    const subs = plan.subjects.filter(s => s.render_unit === unit.render_unit)
    await parallel(subs.map(s => () =>
      agent(synthPrompt(s), { phase: 'Synthese', label: `synth:${s.slug}`, agentType: 'general-purpose', effort: 'high' })
    ))
    log(`Synthese fertig: ${subs.map(s => s.slug).join(', ')}`)
  }
}))

return { group: plan.group, units: plan.units.length, subjects: plan.subjects.map(s => s.slug) }
