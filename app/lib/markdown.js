/* Minimaler, abhängigkeitsfreier Markdown->HTML Renderer (offline, file://).
   Unterstützt: Überschriften, **fett**, *kursiv*, `code`, Listen (- / 1.),
   Tabellen (| a | b |), > Zitat, --- Trennlinie, Absätze. */
(function () {
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(s) {
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  }
  function renderTable(rows) {
    // rows: array of "| a | b |" strings; 2nd row is separator
    const cells = (r) =>
      r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
    let head = cells(rows[0]);
    let body = rows.slice(2).map(cells);
    let h = "<table><thead><tr>" +
      head.map((c) => "<th>" + inline(c) + "</th>").join("") +
      "</tr></thead><tbody>";
    body.forEach((r) => {
      h += "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>";
    });
    return h + "</tbody></table>";
  }
  function render(md) {
    if (!md) return "";
    const lines = md.replace(/\r/g, "").split("\n");
    let out = [];
    let i = 0;
    while (i < lines.length) {
      let line = lines[i];
      if (/^\s*$/.test(line)) { i++; continue; }
      // Tabelle
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s:\-|]+\|\s*$/.test(lines[i + 1])) {
        let tbl = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { tbl.push(lines[i]); i++; }
        out.push(renderTable(tbl));
        continue;
      }
      // Trennlinie
      if (/^\s*---+\s*$/.test(line)) { out.push("<hr>"); i++; continue; }
      // Überschrift
      let hm = line.match(/^(#{1,4})\s+(.*)$/);
      if (hm) { let n = hm[1].length; out.push("<h" + n + ">" + inline(hm[2]) + "</h" + n + ">"); i++; continue; }
      // Zitat
      if (/^\s*>\s?/.test(line)) {
        let q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, "")); i++; }
        out.push("<blockquote>" + inline(q.join(" ")) + "</blockquote>");
        continue;
      }
      // ungeordnete Liste
      if (/^\s*[-*]\s+/.test(line)) {
        let items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          items.push("<li>" + inline(lines[i].replace(/^\s*[-*]\s+/, "")) + "</li>"); i++;
        }
        out.push("<ul>" + items.join("") + "</ul>");
        continue;
      }
      // geordnete Liste
      if (/^\s*\d+[.)]\s+/.test(line)) {
        let items = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          items.push("<li>" + inline(lines[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>"); i++;
        }
        out.push("<ol>" + items.join("") + "</ol>");
        continue;
      }
      // Absatz (bis Leerzeile)
      let para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) &&
             !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) &&
             !/^(#{1,4})\s+/.test(lines[i]) && !/^\s*>\s?/.test(lines[i]) &&
             !/^\s*\|.*\|\s*$/.test(lines[i]) && !/^\s*---+\s*$/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return out.join("\n");
  }
  window.mdToHtml = render;
})();
