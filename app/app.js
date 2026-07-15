/* Lern-App — Offline SPA (file://), Hash-Routing, Fortschritt in localStorage. */
(function () {
  const S = window.LERNSTRUKTUR;
  const D = window.LERNDATEN || {};
  const md = window.mdToHtml;
  const app = document.getElementById("app");

  /* ---------- Persistenz ---------- */
  const store = {
    get(k, def) { try { return JSON.parse(localStorage.getItem("et:" + k)) ?? def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem("et:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function progress(slug) { return store.get("progress:" + slug, { done: {} }); }
  function setTopicDone(slug, tid, val) {
    const p = progress(slug); if (val) p.done[tid] = 1; else delete p.done[tid]; store.set("progress:" + slug, p);
  }
  function fachStats(slug) {
    const d = D[slug]; if (!d) return { total: 0, done: 0 };
    const p = progress(slug); const total = d.topics.length;
    const done = d.topics.filter(t => p.done[t.id]).length; return { total, done };
  }

  /* ---------- Helfer ---------- */
  function daysUntil(dateStr) {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const d = new Date(dateStr + "T00:00:00");
    return Math.round((d - now) / 86400000);
  }
  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function toast(msg) {
    let t = document.querySelector(".toast"); if (!t) { t = el('<div class="toast"></div>'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1600);
  }
  function nextExam() {
    const upcoming = S.gruppen.map(g => ({ g, d: daysUntil(g.datum) })).filter(x => x.d >= 0).sort((a, b) => a.d - b.d)[0];
    return upcoming;
  }

  /* ---------- Kopfzeile ---------- */
  function renderTop() {
    const nx = nextExam();
    const cd = nx ? `<div class="countdown">Nächste Prüfung<br><b>${nx.g.name.split("—")[0].trim()}</b> · in <b>${nx.d} Tagen</b></div>` : "";
    document.getElementById("top").innerHTML =
      `<div class="topbar-inner">
        <div class="brand" onclick="location.hash='#/'">
          <span class="dot"></span><div>Examen Ergotherapie 2026<small>Interaktiver Lernpfad</small></div>
        </div><div class="spacer"></div>${cd}
      </div>`;
  }

  /* ---------- Views ---------- */
  function viewHome() {
    let h = `<div class="crumb">Übersicht</div><h1 class="page">Dein Lernpfad</h1>
      <p class="sub">Wähle ein Fach. Themen sind an der offiziellen Eingrenzung ausgerichtet — <span style="color:var(--red)">rot markierte</span> Punkte sind besonders prüfungsrelevant.</p>`;
    S.gruppen.forEach(g => {
      const d = daysUntil(g.datum);
      const soon = d >= 0 && d <= 25;
      const pillClass = g.pruefung === "schriftlich" ? "written" : "";
      h += `<div class="group-head"><h2>${esc(g.name)}</h2>
        <span class="pill ${soon ? "soon" : pillClass}">${esc(g.pruefung)} · ${new Date(g.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}${d >= 0 ? " · in " + d + " T" : ""}</span></div>`;
      h += `<div class="grid cols-2">`;
      g.faecher.forEach(f => {
        const avail = !!D[f.slug];
        const st = avail ? fachStats(f.slug) : null;
        const pct = st && st.total ? Math.round(100 * st.done / st.total) : 0;
        h += `<div class="card ${avail ? "link" : "disabled"}" ${avail ? `onclick="location.hash='#/fach/${f.slug}'"` : ""}>
          <div class="fach-title"><span class="name">${esc(f.name)}</span>
            ${avail ? (pct === 100 ? '<span class="badge-done">✓ fertig</span>' : "") : '<span class="mini">in Arbeit</span>'}</div>
          ${avail ? `<div class="mini">${st.total} Themen</div>
            <div class="bar"><span style="width:${pct}%"></span></div>
            <div class="progress-row"><span>${st.done}/${st.total} gelernt</span><span>${pct}%</span></div>`
            : `<div class="mini">Inhalte folgen</div>`}
        </div>`;
      });
      h += `</div>`;
    });
    app.innerHTML = h;
  }

  function viewFach(slug) {
    const d = D[slug]; if (!d) return viewHome();
    const p = progress(slug); const st = fachStats(slug);
    const pct = st.total ? Math.round(100 * st.done / st.total) : 0;
    const nCards = d.topics.reduce((a, t) => a + (t.flashcards ? t.flashcards.length : 0), 0);
    const nQuiz = d.topics.reduce((a, t) => a + (t.quiz ? t.quiz.length : 0), 0);
    let h = `<div class="crumb"><a href="#/">Übersicht</a> › ${esc(d.fach)}</div>
      <h1 class="page">${esc(d.fach)}</h1>
      <div class="bar" style="max-width:420px"><span style="width:${pct}%"></span></div>
      <div class="progress-row" style="max-width:420px"><span>${st.done}/${st.total} Themen gelernt</span><span>${pct}%</span></div>
      <div class="actions">
        <button class="btn primary" onclick="location.hash='#/cards/${slug}'">🗂 Karteikarten lernen (${nCards})</button>
        <button class="btn" onclick="location.hash='#/quiz/${slug}'">✎ Quiz / Selbsttest (${nQuiz})</button>
      </div>`;
    if (d.intro) h += `<div class="lesson" style="margin-top:14px">${md(d.intro)}</div>`;
    h += `<h2 style="font-size:18px;margin:22px 0 12px">Themen (Eingrenzung)</h2>`;
    d.topics.forEach((t, i) => {
      const done = !!p.done[t.id];
      h += `<div class="topic ${done ? "done" : ""} ${t.prio === "high" ? "prio-high" : ""}" onclick="location.hash='#/lesson/${slug}/${t.id}'">
        <div class="idx">${done ? "✓" : (i + 1)}</div>
        <div class="tt"><div class="h">${esc(t.title)}</div>${t.eingrenzung ? `<div class="e">${esc(t.eingrenzung)}</div>` : ""}</div>
        ${t.prio === "high" ? '<span class="tag">Prüfungsfokus</span>' : ""}
      </div>`;
    });
    if (d.extra && d.extra.length) {
      h += `<h2 style="font-size:18px;margin:26px 0 12px">Weiteres Wissen</h2>`;
      d.extra.forEach((e, i) => {
        h += `<div class="topic" onclick="location.hash='#/lesson/${slug}/extra-${i}'">
          <div class="idx">＋</div><div class="tt"><div class="h">${esc(e.title)}</div></div></div>`;
      });
    }
    app.innerHTML = h;
  }

  function viewLesson(slug, tid) {
    const d = D[slug]; if (!d) return viewHome();
    let t, isExtra = false, idx = -1;
    if (tid.startsWith("extra-")) { isExtra = true; t = d.extra[+tid.slice(6)]; }
    else { idx = d.topics.findIndex(x => x.id === tid); t = d.topics[idx]; }
    if (!t) return viewFach(slug);
    const p = progress(slug); const done = !isExtra && !!p.done[t.id];
    let h = `<div class="crumb"><a href="#/">Übersicht</a> › <a href="#/fach/${slug}">${esc(d.fach)}</a> › ${esc(t.title)}</div>`;
    h += `<div class="lesson">`;
    h += `<h1 style="font-size:23px;margin:0 0 .3em">${esc(t.title)}</h1>`;
    if (t.eingrenzung) h += `<blockquote><b>Eingrenzung:</b> ${esc(t.eingrenzung)}</blockquote>`;
    h += md(t.body || "");
    if (t.facts && t.facts.length) {
      h += `<div class="facts"><div class="h">Prüfungswissen kompakt</div><ul>${t.facts.map(f => `<li>${md(f).replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ul></div>`;
    }
    if (t.figures && t.figures.length) {
      t.figures.forEach(f => {
        h += `<figure class="fig"><img src="../${f.src}" alt="${esc(f.caption)}" onclick="ETapp.zoom(this.src)"><figcaption>${esc(f.caption)}</figcaption></figure>`;
      });
    }
    h += `</div>`;
    // Navigation
    h += `<div class="actions">`;
    if (!isExtra) h += `<button class="btn ${done ? "" : "primary"}" onclick="ETapp.toggleDone('${slug}','${t.id}')">${done ? "✓ Als gelernt markiert (rückgängig)" : "Als gelernt markieren"}</button>`;
    if (!isExtra && idx >= 0 && idx < d.topics.length - 1)
      h += `<button class="btn" onclick="location.hash='#/lesson/${slug}/${d.topics[idx + 1].id}'">Nächstes Thema →</button>`;
    h += `<button class="btn ghost" onclick="location.hash='#/fach/${slug}'">Zur Themenliste</button></div>`;
    app.innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* ---------- Karteikarten (Leitner, spaced repetition) ---------- */
  function collectCards(slug) {
    const d = D[slug]; const cards = [];
    d.topics.forEach(t => (t.flashcards || []).forEach((c, i) => cards.push({ key: t.id + ":" + i, q: c.q, a: c.a, topic: t.title })));
    return cards;
  }
  function leitner(slug) { return store.get("leitner:" + slug, {}); }
  function dueCards(slug) {
    const all = collectCards(slug); const L = leitner(slug); const now = Date.now();
    const due = all.filter(c => { const s = L[c.key]; return !s || !s.due || s.due <= now; });
    return (due.length ? due : all);
  }
  function gradeCard(slug, key, ok) {
    const L = leitner(slug); const s = L[key] || { box: 0 };
    const intervals = [0, 1, 2, 4, 8, 16]; // Tage
    s.box = ok ? Math.min(s.box + 1, intervals.length - 1) : 0;
    s.due = Date.now() + intervals[s.box] * 86400000;
    L[key] = s; store.set("leitner:" + slug, L);
  }
  let cardQueue = [], cardPos = 0, curSlug = null;
  function viewCards(slug) {
    curSlug = slug; cardQueue = dueCards(slug); cardPos = 0;
    if (!cardQueue.length) { app.innerHTML = `<div class="empty">Keine Karteikarten vorhanden.</div>`; return; }
    renderCard();
  }
  function renderCard() {
    const d = D[curSlug];
    if (cardPos >= cardQueue.length) {
      app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a> › Karteikarten</div>
        <div class="result-big"><div class="score">✓</div><p>Runde geschafft — ${cardQueue.length} Karten wiederholt.</p>
        <div class="actions" style="justify-content:center"><button class="btn primary" onclick="ETapp.cards('${curSlug}')">Nochmal</button>
        <button class="btn" onclick="location.hash='#/fach/${curSlug}'">Zurück</button></div></div>`;
      return;
    }
    const c = cardQueue[cardPos];
    app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a> › Karteikarten</div>
      <div class="progress-row" style="max-width:640px;margin:0 auto"><span>Karte ${cardPos + 1} / ${cardQueue.length}</span><span>${esc(c.topic)}</span></div>
      <div class="flash-stage">
        <div class="flashcard"><div class="fc-inner" id="fc" onclick="ETapp.flip()">
          <div class="fc-face"><span class="lbl">Frage</span><div class="q">${esc(c.q)}</div><div class="mini" style="margin-top:16px">Klick zum Umdrehen</div></div>
          <div class="fc-face fc-back"><span class="lbl">Antwort</span><div class="a">${md(c.a)}</div></div>
        </div></div>
        <div class="grade" id="grade" style="display:none">
          <button class="btn again" onclick="ETapp.grade(false)">Nochmal</button>
          <button class="btn good" onclick="ETapp.grade(true)">Gewusst ✓</button>
        </div>
      </div>`;
  }
  function flipCard() { const fc = document.getElementById("fc"); fc.classList.toggle("flipped"); if (fc.classList.contains("flipped")) document.getElementById("grade").style.display = "flex"; }
  function gradeCurrent(ok) { const c = cardQueue[cardPos]; gradeCard(curSlug, c.key, ok); cardPos++; renderCard(); }

  /* ---------- Quiz ---------- */
  function collectQuiz(slug) {
    const d = D[slug]; const qs = [];
    d.topics.forEach(t => (t.quiz || []).forEach(q => qs.push(Object.assign({ topic: t.title }, q))));
    return qs;
  }
  let quiz = [], qpos = 0, qscore = 0, qanswered = false;
  function viewQuiz(slug) {
    curSlug = slug; quiz = collectQuiz(slug); qpos = 0; qscore = 0; qanswered = false;
    if (!quiz.length) { app.innerHTML = `<div class="empty">Kein Quiz vorhanden.</div>`; return; }
    renderQuiz();
  }
  function renderQuiz() {
    const d = D[curSlug];
    if (qpos >= quiz.length) {
      const pct = Math.round(100 * qscore / quiz.length);
      app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a> › Quiz</div>
        <div class="result-big"><div class="score">${qscore}/${quiz.length}</div><p>${pct}% richtig</p>
        <div class="actions" style="justify-content:center"><button class="btn primary" onclick="ETapp.quiz('${curSlug}')">Nochmal</button>
        <button class="btn" onclick="location.hash='#/fach/${curSlug}'">Zurück</button></div></div>`;
      return;
    }
    const q = quiz[qpos]; qanswered = false;
    let dots = quiz.map((_, i) => `<i class="${i < qpos ? "ok" : (i === qpos ? "on" : "")}"></i>`).join("");
    app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a> › Quiz</div>
      <div class="progress-dots">${dots}</div>
      <div class="quiz-q"><div class="mini" style="margin-bottom:6px">${esc(q.topic)}</div>
        <div class="qh">Frage ${qpos + 1}: ${esc(q.q)}</div>
        <div id="opts">${q.options.map((o, i) => `<button class="opt" onclick="ETapp.answer(${i})">${esc(o)}</button>`).join("")}</div>
        <div id="explain"></div>
      </div>`;
  }
  function answerQuiz(i) {
    if (qanswered) return; qanswered = true;
    const q = quiz[qpos]; const opts = document.querySelectorAll("#opts .opt");
    opts.forEach((o, idx) => {
      o.classList.add("reveal");
      if (idx === q.answer) o.classList.add("correct");
      if (idx === i && i !== q.answer) o.classList.add("wrong");
    });
    if (i === q.answer) qscore++;
    const ex = document.getElementById("explain");
    ex.innerHTML = `<div class="explain">${i === q.answer ? "✓ Richtig. " : "✗ "}${md(q.explain || "")}</div>
      <div class="actions"><button class="btn primary" onclick="ETapp.nextQuiz()">${qpos + 1 < quiz.length ? "Weiter →" : "Ergebnis"}</button></div>`;
  }
  function nextQuiz() { qpos++; renderQuiz(); }

  /* ---------- Lightbox ---------- */
  function zoom(src) { let lb = document.querySelector(".lightbox"); if (!lb) { lb = el('<div class="lightbox" onclick="this.classList.remove(\'open\')"><img></div>'); document.body.appendChild(lb); } lb.querySelector("img").src = src; lb.classList.add("open"); }

  /* ---------- Router ---------- */
  function route() {
    renderTop();
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    if (!parts.length) return viewHome();
    if (parts[0] === "fach") return viewFach(parts[1]);
    if (parts[0] === "lesson") return viewLesson(parts[1], parts.slice(2).join("/"));
    if (parts[0] === "cards") return viewCards(parts[1]);
    if (parts[0] === "quiz") return viewQuiz(parts[1]);
    viewHome();
  }
  window.ETapp = {
    toggleDone(slug, tid) { const p = progress(slug); setTopicDone(slug, tid, !p.done[tid]); toast(p.done[tid] ? "Als gelernt markiert" : "Markierung entfernt"); viewLesson(slug, tid); },
    flip: flipCard, grade: gradeCurrent, cards: viewCards,
    answer: answerQuiz, nextQuiz: nextQuiz, quiz: viewQuiz, zoom: zoom
  };
  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  route();
})();
