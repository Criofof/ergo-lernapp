export const meta = {
  name: 'et-notes-group',
  description: 'Nur Notizen: Vision-Agenten erfassen alle Seiten einer Faechergruppe (Sonnet)',
  phases: [{ title: 'Notizen', detail: 'Vision-Agenten erfassen Seiten (Sonnet)' }],
}

let plan = args
if (typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) {} }
if (plan && typeof plan === 'string') { try { plan = JSON.parse(plan) } catch (e) {} }
if (!plan || !plan.units) { log('FEHLER: kein Plan (typeof=' + typeof args + ')'); return { error: 'no plan' } }

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
    const id = pad4(Math.floor((start - 1) / BATCH) + 1).slice(2)
    if (unit.batch_ids && unit.batch_ids.indexOf(id) === -1) continue  // nur fehlende
    out.push({ id, pages })
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

log(`Notizen ${plan.group}: ${plan.units.length} units, ${plan.units.reduce((a, u) => a + Math.ceil(u.n_pages / BATCH), 0)} Batches`)

await parallel(plan.units.flatMap(unit =>
  batchesFor(unit).map(b => () =>
    agent(notesPrompt(unit, b), {
      phase: 'Notizen', label: `notes:${unit.render_unit}:${b.id}`,
      agentType: 'general-purpose', model: 'sonnet', effort: 'medium',
    })
  )
))

return { group: plan.group, units: plan.units.map(u => u.render_unit) }
