/* Lern-App — Offline SPA (file://), Hash-Routing, Fortschritt in localStorage. */
(function () {
  const S = window.LERNSTRUKTUR;
  const D = window.LERNDATEN || {};
  const md = window.mdToHtml;
  const app = document.getElementById("app");

  /* ---------- Icons (inline SVG, offline) ---------- */
  const I = {
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 0-3 3v0a3 3 0 0 0-2 5.2A3 3 0 0 0 9 17a3 3 0 0 0 6 0 3 3 0 0 0 2-5.8A3 3 0 0 0 15 6a3 3 0 0 0-3-3Z"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v10"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8Z"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>'
  };

  /* ---------- Theme ---------- */
  function getTheme() {
    const saved = localStorage.getItem("et:theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("et:theme", t); } catch (e) {}
  }
  function toggleTheme() { applyTheme(getTheme() === "dark" ? "light" : "dark"); renderTop(); }
  applyTheme(getTheme());

  /* ---------- Persistenz ---------- */
  const store = {
    get(k, def) { try { const v = JSON.parse(localStorage.getItem("et:" + k)); return v === null ? def : v; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem("et:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function progress(slug) { return store.get("progress:" + slug, { done: {} }); }
  function setTopicDone(slug, tid, val) {
    const p = progress(slug); if (val) p.done[tid] = 1; else delete p.done[tid]; store.set("progress:" + slug, p);
  }
  function fachStats(slug) {
    const d = D[slug]; if (!d) return { total: 0, done: 0, pct: 0 };
    const p = progress(slug); const total = d.topics.length;
    const done = d.topics.filter(t => p.done[t.id]).length;
    return { total, done, pct: total ? Math.round(100 * done / total) : 0 };
  }

  /* ---------- Helfer ---------- */
  function daysUntil(dateStr) {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((new Date(dateStr + "T00:00:00") - now) / 86400000);
  }
  function fmtDate(s) { return new Date(s).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function toast(msg) {
    let t = document.querySelector(".toast"); if (!t) { t = el('<div class="toast"></div>'); document.body.appendChild(t); }
    t.textContent = msg; requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1700);
  }
  function ring(pct, size) {
    size = size || 52; const sw = size <= 56 ? 5 : (size <= 80 ? 6 : 9);
    const r = (size - sw) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    const cls = pct >= 100 ? "ring done" : (pct === 0 ? "ring zero" : "ring");
    return `<div class="${cls}" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}"><circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${sw}"/>
      <circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${sw}"
        stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
      <div class="pct">${pct === 100 ? I.check : pct + "%"}</div></div>`;
  }
  function nextExam() {
    return S.gruppen.map(g => ({ g, d: daysUntil(g.datum) })).filter(x => x.d >= 0).sort((a, b) => a.d - b.d)[0];
  }
  function fachAvailableCount(g) { return g.faecher.filter(f => D[f.slug]).length; }

  /* ---------- Kopfzeile ---------- */
  function renderTop() {
    const nx = nextExam();
    const cd = nx ? `<div class="cd-chip">${I.clock}<span>${esc(nx.g.name.split("—")[0].trim())} · <b>${fmtDate(nx.g.datum)}</b> · <span class="n">${nx.d}</span> Tage</span></div>` : "";
    const dark = getTheme() === "dark";
    document.getElementById("top").innerHTML =
      `<div class="topbar-inner">
        <div class="brand" onclick="location.hash='#/'">
          <div class="logo">${I.logo}</div>
          <div class="t">Examen Ergotherapie 2026<small>Interaktiver Lernpfad</small></div>
        </div><div class="spacer"></div>${cd}
        <button class="theme-toggle" id="themeToggle" title="${dark ? "Hellmodus" : "Dunkelmodus"}" aria-label="Farbmodus wechseln">${dark ? I.sun : I.moon}</button>
      </div>`;
    document.getElementById("themeToggle").onclick = toggleTheme;
  }

  /* ---------- Start ---------- */
  function viewHome() {
    const nx = nextExam();
    let h = "";
    if (nx) {
      const exams = S.gruppen.filter(g => daysUntil(g.datum) >= 0).slice(0, 5).map(g =>
        `<div class="exam"><b>${esc(g.name.split("—")[0].replace("Fächergruppe", "FG").trim())}</b>${fmtDate(g.datum)} · ${daysUntil(g.datum)} T</div>`).join("");
      h += `<div class="hero">
        <div class="eyebrow">Nächste Prüfung</div>
        <h2>${esc(nx.g.name)}</h2>
        <div class="meta">${esc(nx.g.pruefung)} · ${fmtDate(nx.g.datum)}</div>
        <div class="big"><span class="num">${nx.d}</span><span class="lbl">Tage verbleiben</span></div>
        <div class="exams">${exams}</div>
      </div>`;
    }
    h += `<h1 class="page" style="margin-top:26px">Dein Lernpfad</h1>
      <p class="sub">Wähle ein Fach. Die Themen folgen exakt der offiziellen Eingrenzung — mit
      <span style="color:var(--accent);font-weight:600">Prüfungsfokus</span> markierte Punkte sind besonders wichtig.</p>`;
    S.gruppen.forEach(g => {
      const d = daysUntil(g.datum), soon = d >= 0 && d <= 25;
      const avail = fachAvailableCount(g), pillCls = soon ? "soon" : (g.pruefung === "schriftlich" ? "written" : "");
      h += `<div class="group"><div class="group-head">
        <h2>${esc(g.name)}</h2><div class="line"></div>
        <span class="pill ${pillCls}">${esc(g.pruefung)} · ${fmtDate(g.datum)}${d >= 0 ? " · " + d + " T" : ""}</span></div>
        <div class="grid cols-2">`;
      g.faecher.forEach(f => {
        const ok = !!D[f.slug]; const st = ok ? fachStats(f.slug) : null;
        h += `<div class="card fach-card ${ok ? "" : "disabled"}" ${ok ? `onclick="location.hash='#/fach/${f.slug}'"` : ""}>
          ${ok ? ring(st.pct, 52) : '<div class="ring zero" style="width:52px;height:52px"><svg width="52" height="52"><circle class="track" cx="26" cy="26" r="23.5" fill="none" stroke-width="5"/></svg></div>'}
          <div class="body"><div class="name">${esc(f.name)}</div>
            <div class="mini">${ok ? `${st.done}/${st.total} Themen gelernt` + (st.pct === 100 ? ` <span class="badge-done">${I.check}fertig</span>` : "") : "<span>Inhalte folgen</span>"}</div>
          </div></div>`;
      });
      h += `</div></div>`;
    });
    app.innerHTML = h; markEnter();
  }

  function viewFach(slug) {
    const d = D[slug]; if (!d) return viewHome();
    const p = progress(slug), st = fachStats(slug);
    const nCards = d.topics.reduce((a, t) => a + (t.flashcards ? t.flashcards.length : 0), 0);
    const nQuiz = d.topics.reduce((a, t) => a + (t.quiz ? t.quiz.length : 0), 0);
    let h = `<div class="crumb"><a href="#/">Übersicht</a><span class="sep">›</span>${esc(d.fach)}</div>
      <div class="fach-hero">${ring(st.pct, 70)}<div><h1 class="page" style="margin:0">${esc(d.fach)}</h1>
      <div class="stat-row"><span><b>${st.total}</b> Themen</span><span><b>${nCards}</b> Karteikarten</span><span><b>${nQuiz}</b> Quizfragen</span></div></div></div>`;
    if (d.intro) h += `<div class="lesson" style="padding:18px 22px;margin-top:14px">${md(d.intro)}</div>`;
    h += `<div class="actions">
        <button class="btn primary" onclick="location.hash='#/cards/${slug}'">${I.cards} Karteikarten lernen</button>
        <button class="btn" onclick="location.hash='#/quiz/${slug}'">${I.quiz} Quiz / Selbsttest</button></div>`;
    h += `<div class="section-label">${I.list} Themen (Eingrenzung)</div><div class="path">`;
    d.topics.forEach((t, i) => {
      const done = !!p.done[t.id];
      h += `<div class="topic ${done ? "done" : ""} ${t.prio === "high" ? "prio-high" : ""}" onclick="location.hash='#/lesson/${slug}/${t.id}'">
        <div class="idx">${done ? I.check : (i + 1)}</div>
        <div class="tt"><div class="h">${esc(t.title)}</div>${t.eingrenzung ? `<div class="e">${esc(t.eingrenzung)}</div>` : ""}</div>
        ${t.prio === "high" ? '<span class="tag">Fokus</span>' : ""}</div>`;
    });
    h += `</div>`;
    if (d.extra && d.extra.length) {
      h += `<div class="section-label">${I.plus} Weiteres Wissen</div><div class="path">`;
      d.extra.forEach((e, i) => {
        h += `<div class="topic" onclick="location.hash='#/lesson/${slug}/extra-${i}'">
          <div class="idx">${I.plus}</div><div class="tt"><div class="h">${esc(e.title)}</div></div></div>`;
      });
      h += `</div>`;
    }
    app.innerHTML = h; markEnter();
  }

  function viewLesson(slug, tid) {
    const d = D[slug]; if (!d) return viewHome();
    let t, isExtra = false, idx = -1;
    if (tid.indexOf("extra-") === 0) { isExtra = true; t = d.extra[+tid.slice(6)]; }
    else { idx = d.topics.findIndex(x => x.id === tid); t = d.topics[idx]; }
    if (!t) return viewFach(slug);
    const done = !isExtra && !!progress(slug).done[t.id];
    let h = `<div class="crumb"><a href="#/">Übersicht</a><span class="sep">›</span><a href="#/fach/${slug}">${esc(d.fach)}</a><span class="sep">›</span>${esc(t.title)}</div>`;
    h += `<div class="lesson"><h1>${esc(t.title)}</h1>`;
    if (t.eingrenzung) h += `<div class="eingrenzung-box">${I.target}<div><b>Eingrenzung:</b> ${esc(t.eingrenzung)}</div></div>`;
    h += md(t.body || "");
    if (t.facts && t.facts.length)
      h += `<div class="facts"><div class="h">${I.bolt} Prüfungswissen kompakt</div><ul>${t.facts.map(f => `<li>${md(f).replace(/^<p>|<\/p>$/g, "")}</li>`).join("")}</ul></div>`;
    if (t.figures && t.figures.length)
      t.figures.forEach(f => { h += `<figure class="fig"><img src="../${f.src}" alt="${esc(f.caption)}" onclick="ETapp.zoom(this.src)"><figcaption>${esc(f.caption)}</figcaption></figure>`; });
    h += `</div><div class="lesson-nav">`;
    if (!isExtra) h += `<button class="btn ${done ? "" : "primary"}" onclick="ETapp.toggleDone('${slug}','${t.id}')">${done ? I.check + " Gelernt (rückgängig)" : I.check + " Als gelernt markieren"}</button>`;
    if (!isExtra && idx >= 0 && idx < d.topics.length - 1)
      h += `<button class="btn" onclick="location.hash='#/lesson/${slug}/${d.topics[idx + 1].id}'">Nächstes Thema ${I.arrow}</button>`;
    h += `<button class="btn ghost" onclick="location.hash='#/fach/${slug}'">Zur Themenliste</button></div>`;
    app.innerHTML = h; markEnter(); window.scrollTo(0, 0);
  }

  /* ---------- Karteikarten (Leitner) ---------- */
  function collectCards(slug) {
    const d = D[slug], cards = [];
    d.topics.forEach(t => (t.flashcards || []).forEach((c, i) => cards.push({ key: t.id + ":" + i, q: c.q, a: c.a, topic: t.title })));
    return cards;
  }
  function leitner(slug) { return store.get("leitner:" + slug, {}); }
  function dueCards(slug) {
    const all = collectCards(slug), L = leitner(slug), now = Date.now();
    const due = all.filter(c => { const s = L[c.key]; return !s || !s.due || s.due <= now; });
    return due.length ? due : all;
  }
  function gradeCard(slug, key, ok) {
    const L = leitner(slug), s = L[key] || { box: 0 }, iv = [0, 1, 2, 4, 8, 16];
    s.box = ok ? Math.min(s.box + 1, iv.length - 1) : 0;
    s.due = Date.now() + iv[s.box] * 86400000; L[key] = s; store.set("leitner:" + slug, L);
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
      app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a><span class="sep">›</span>Karteikarten</div>
        <div class="result">${ring(100, 130)}<h2>Runde geschafft!</h2><p>${cardQueue.length} Karten wiederholt.</p>
        <div class="actions" style="justify-content:center"><button class="btn primary" onclick="ETapp.cards('${curSlug}')">Nochmal</button>
        <button class="btn" onclick="location.hash='#/fach/${curSlug}'">Zurück</button></div></div>`; markEnter(); return;
    }
    const c = cardQueue[cardPos];
    app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a><span class="sep">›</span>Karteikarten</div>
      <div class="study-top"><span>Karte ${cardPos + 1} / ${cardQueue.length}</span><span>${esc(c.topic)}</span></div>
      <div class="study-bar bar"><span style="width:${Math.round(100 * cardPos / cardQueue.length)}%"></span></div>
      <div class="flash-stage">
        <div class="flashcard"><div class="fc-inner" id="fc" onclick="ETapp.flip()">
          <div class="fc-face"><span class="lbl">Frage</span><div class="q">${esc(c.q)}</div><div class="hint">Klick zum Umdrehen</div></div>
          <div class="fc-face fc-back"><span class="lbl">Antwort</span><div class="a">${md(c.a)}</div></div>
        </div></div>
        <div class="grade" id="grade" style="display:none">
          <button class="btn again" onclick="ETapp.grade(false)">Nochmal</button>
          <button class="btn good" onclick="ETapp.grade(true)">${I.check} Gewusst</button>
        </div></div>`; markEnter();
  }
  function flipCard() { const fc = document.getElementById("fc"); fc.classList.toggle("flipped"); if (fc.classList.contains("flipped")) document.getElementById("grade").style.display = "flex"; }
  function gradeCurrent(ok) { const c = cardQueue[cardPos]; gradeCard(curSlug, c.key, ok); cardPos++; renderCard(); }

  /* ---------- Quiz ---------- */
  function collectQuiz(slug) {
    const d = D[slug], qs = [];
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
      app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a><span class="sep">›</span>Quiz</div>
        <div class="result">${ring(pct, 130)}<h2>${qscore} / ${quiz.length} richtig</h2><p>Selbsttest abgeschlossen.</p>
        <div class="actions" style="justify-content:center"><button class="btn primary" onclick="ETapp.quiz('${curSlug}')">Nochmal</button>
        <button class="btn" onclick="location.hash='#/fach/${curSlug}'">Zurück</button></div></div>`; markEnter(); return;
    }
    const q = quiz[qpos]; qanswered = false;
    const dots = quiz.map((_, i) => `<i class="${i < qpos ? "ok" : (i === qpos ? "on" : "")}"></i>`).join("");
    const letters = ["A", "B", "C", "D", "E", "F"];
    app.innerHTML = `<div class="crumb"><a href="#/fach/${curSlug}">${esc(d.fach)}</a><span class="sep">›</span>Quiz</div>
      <div class="progress-dots">${dots}</div>
      <div class="quiz-q"><div class="qtopic">${esc(q.topic)}</div>
        <div class="qh">Frage ${qpos + 1}: ${esc(q.q)}</div>
        <div id="opts">${q.options.map((o, i) => `<button class="opt" onclick="ETapp.answer(${i})"><span class="mk">${letters[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
        <div id="explain"></div></div>`; markEnter();
  }
  function answerQuiz(i) {
    if (qanswered) return; qanswered = true;
    const q = quiz[qpos], opts = document.querySelectorAll("#opts .opt");
    opts.forEach((o, idx) => { o.classList.add("reveal"); if (idx === q.answer) o.classList.add("correct"); if (idx === i && i !== q.answer) o.classList.add("wrong"); });
    if (i === q.answer) qscore++;
    document.getElementById("explain").innerHTML =
      `<div class="explain"><b>${i === q.answer ? "✓ Richtig." : "✗ Leider falsch."}</b> ${md(q.explain || "").replace(/^<p>|<\/p>$/g, "")}</div>
       <div class="actions"><button class="btn primary" onclick="ETapp.nextQuiz()">${qpos + 1 < quiz.length ? "Weiter " + I.arrow : "Ergebnis"}</button></div>`;
  }
  function nextQuiz() { qpos++; renderQuiz(); }

  /* ---------- Lightbox & Anim ---------- */
  function zoom(src) { let lb = document.querySelector(".lightbox"); if (!lb) { lb = el('<div class="lightbox" onclick="this.classList.remove(\'open\')"><img></div>'); document.body.appendChild(lb); } lb.querySelector("img").src = src; lb.classList.add("open"); }
  function markEnter() { app.classList.remove("view-enter"); void app.offsetWidth; app.classList.add("view-enter"); }

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
    toggleDone(slug, tid) { const p = progress(slug); setTopicDone(slug, tid, !p.done[tid]); toast(p.done[tid] ? "Als gelernt markiert ✓" : "Markierung entfernt"); viewLesson(slug, tid); },
    flip: flipCard, grade: gradeCurrent, cards: viewCards,
    answer: answerQuiz, nextQuiz: nextQuiz, quiz: viewQuiz, zoom: zoom
  };
  window.addEventListener("hashchange", route);
  route();
})();
