// Biblioteca compartilhada: seletores por site (descobertos lendo o index.html de cada um)
// e funções executadas dentro da página.
const SITES = {
  'dev-1': {
    url: 'http://127.0.0.1:4541/',
    header: '.app-header', content: '#content', panel: '#panel', footer: '#statusbar',
    mtabs: '#mobile-tabs', dtabs: '#view-tabs', table: '#orders-table',
    alertsList: '#alert-list', alertsScroll: '#alerts-body', kpi: '.kpi', spark: '.kpi__spark',
    status: '.status-card', cards: '.kpi, .status-card, .table-card',
  },
  'dev-2': {
    url: 'http://127.0.0.1:4542/',
    header: '#header', content: '#content', panel: '#panel-alerts', footer: '#statusbar',
    mtabs: '#tabs-mobile', dtabs: '#tabs-medium', table: '#tbl',
    alertsList: '#alert-list', alertsScroll: '#alerts-scroll', kpi: '.kpi', spark: '.spark',
    status: '#ops-grid > *', cards: '.kpi, #ops-grid > *, #panel-data',
  },
  'dev-3': {
    url: 'http://127.0.0.1:4543/',
    header: '.topbar', content: '#conteudo', panel: '#painel-alertas', footer: '.statusbar',
    mtabs: '.tabs-mobile', dtabs: '.tabs-desktop', table: 'table.table',
    alertsList: '[data-alert-list]', alertsScroll: '[data-alert-list]', kpi: '.kpi', spark: '.spark',
    status: null, cards: '.kpi, .table-card',
  },
};

// ---------- funções de página (serializadas para page.evaluate) ----------
function pageMeasure(cfg) {
  const out = {};
  const vis = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), b: +r.bottom.toFixed(1), r: +r.right.toFixed(1), visible: vis(el) };
  };
  const hex = (c) => {
    if (!c) return c;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return c;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (p.length === 4 && p[3] === 0) return 'transparent';
    return '#' + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') + (p.length === 4 && p[3] < 1 ? '@' + p[3] : '');
  };
  const q = (s) => (s ? document.querySelector(s) : null);
  const qa = (s) => (s ? Array.from(document.querySelectorAll(s)) : []);
  const se = document.scrollingElement;
  out.vw = innerWidth; out.vh = innerHeight;
  out.docScrollV = se.scrollHeight - innerHeight;
  out.docScrollH = se.scrollWidth - innerWidth;
  out.bodyOverflow = getComputedStyle(document.body).overflow + ' / html ' + getComputedStyle(document.documentElement).overflow;
  out.regions = {};
  for (const k of ['header', 'content', 'panel', 'footer', 'mtabs', 'dtabs']) out.regions[k] = rect(q(cfg[k]));
  // shell (pai comum)
  const h = q(cfg.header);
  const shell = h && h.parentElement;
  if (shell) {
    const cs = getComputedStyle(shell);
    out.shell = { sel: shell.id || shell.className, display: cs.display, gtc: cs.gridTemplateColumns, gtr: cs.gridTemplateRows, gap: cs.gap, padding: cs.padding, height: cs.height, rect: rect(shell), bg: hex(cs.backgroundColor) };
  }
  // fontes
  const bcs = getComputedStyle(document.body);
  out.font = {
    body: bcs.fontFamily, bodySize: bcs.fontSize, bodyColor: hex(bcs.color), bodyBg: hex(bcs.backgroundColor),
    htmlBg: hex(getComputedStyle(document.documentElement).backgroundColor),
    fontsLoaded: Array.from(document.fonts).map((f) => f.family + ':' + f.weight + ':' + f.status).slice(0, 12),
  };
  const heads = qa('h1,h2,h3').filter(vis).slice(0, 12).map((e) => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), ff: c.fontFamily.slice(0, 40), fs: c.fontSize, fw: c.fontWeight, color: hex(c.color) }; });
  out.headings = heads;
  // tamanhos de texto: menor tamanho entre nós de texto visíveis
  const sizes = {};
  let minFs = 99, minFsTxt = '';
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!vis(el)) continue;
    const c = getComputedStyle(el);
    if (c.position === 'absolute' && (c.clip !== 'auto' || c.clipPath !== 'none') && el.getBoundingClientRect().width <= 2) continue;
    const fs = parseFloat(c.fontSize);
    sizes[fs] = (sizes[fs] || 0) + 1;
    if (fs < minFs) { minFs = fs; minFsTxt = n.textContent.trim().slice(0, 30); }
  }
  out.textSizes = sizes; out.minFont = minFs; out.minFontTxt = minFsTxt;
  // KPIs
  const kpis = qa(cfg.kpi).filter(vis);
  out.kpiCount = kpis.length;
  const lefts = new Set(); const tops = kpis.map((k) => Math.round(k.getBoundingClientRect().top));
  const firstTop = Math.min(...tops);
  kpis.forEach((k) => { const r = k.getBoundingClientRect(); if (Math.abs(r.top - firstTop) < 4) lefts.add(Math.round(r.left)); });
  out.kpiColsFirstRow = lefts.size;
  out.kpis = kpis.slice(0, 4).map((k) => {
    const c = getComputedStyle(k);
    const txt = k.innerText.replace(/\s+/g, ' ').trim();
    const val = k.querySelector('[class*="value"]');
    const lab = k.querySelector('[class*="label"]');
    const deltas = Array.from(k.querySelectorAll('[class*="delta"], [class*="var"], .delta, .var')).filter(vis);
    const delta = deltas.find((d) => /%/.test(d.textContent)) || deltas[0];
    const spark = k.querySelector(cfg.spark);
    const svgs = k.querySelectorAll('svg');
    const vcs = val && getComputedStyle(val);
    const lcs = lab && getComputedStyle(lab);
    const dcs = delta && getComputedStyle(delta);
    return {
      txt: txt.slice(0, 120), rect: rect(k), radius: c.borderRadius, border: c.borderTopWidth + ' ' + c.borderTopStyle + ' ' + hex(c.borderTopColor),
      shadow: c.boxShadow, bg: hex(c.backgroundColor), padding: c.padding,
      value: val && { t: val.textContent.trim(), fs: vcs.fontSize, fw: vcs.fontWeight, fvn: vcs.fontVariantNumeric, ff: vcs.fontFamily.slice(0, 30), color: hex(vcs.color) },
      label: lab && { t: lab.textContent.trim(), fs: lcs.fontSize, color: hex(lcs.color) },
      delta: delta && { t: delta.textContent.trim().slice(0, 40), color: hex(dcs.color), fs: dcs.fontSize, hasSvg: !!delta.querySelector('svg') || /[↑↓→↗↘]/.test(delta.textContent) },
      spark: !!spark, svgCount: svgs.length,
      baseFs: getComputedStyle(k.querySelector('[class*="cmp"]') || k).fontSize,
      cmp: (k.querySelector('[class*="cmp"]') || {}).textContent || null,
    };
  });
  // status blocks
  const st = qa(cfg.status).filter(vis);
  out.statusBlocks = st.map((s) => ({ t: s.innerText.split('\n')[0].trim().slice(0, 40), rect: rect(s) }));
  out.statusText = st.map((s) => s.innerText.replace(/\s+/g, ' ').slice(0, 80));
  // tabela
  const t = q(cfg.table);
  if (t) {
    const ths = Array.from(t.querySelectorAll('thead th'));
    const rows = Array.from(t.querySelectorAll('tbody tr')).filter(vis);
    const thead = t.querySelector('thead');
    const thcs = ths[1] ? getComputedStyle(ths[1]) : null;
    const theadBg = thead ? hex(getComputedStyle(thead).backgroundColor) : null;
    const thBg = thcs ? hex(thcs.backgroundColor) : null;
    const rowBgs = rows.map((r) => { const td = r.querySelector('td'); return hex(getComputedStyle(r).backgroundColor) + '|' + (td ? hex(getComputedStyle(td).backgroundColor) : ''); });
    const valIdx = ths.findIndex((th) => /valor/i.test(th.textContent));
    const valCell = rows[0] && rows[0].children[valIdx];
    const tdcs = rows[0] && rows[0].querySelector('td:nth-child(2), th:nth-child(2)') ? getComputedStyle(rows[0].querySelector('td:nth-child(2), th:nth-child(2)')) : null;
    let container = t.parentElement; let cr = '0px';
    for (let i = 0; i < 6 && container; i++, container = container.parentElement) { const cc = getComputedStyle(container); if (parseFloat(cc.borderRadius) > 0 && cc.borderTopStyle !== 'none') { cr = cc.borderRadius + ' ' + cc.borderTopWidth + ' ' + hex(cc.borderTopColor) + ' shadow:' + cc.boxShadow; break; } }
    const badge = rows[0] && rows[0].querySelector('[class*="badge"]');
    out.table = {
      visible: vis(t), headers: ths.map((th) => th.textContent.trim()), scopes: ths.map((th) => th.getAttribute('scope')),
      ariaSort: ths.map((th) => th.getAttribute('aria-sort')), hasThead: !!thead,
      rows: rows.length, rowH: rows.map((r) => Math.round(r.getBoundingClientRect().height)),
      theadBg, thBg, rowBgs, thFs: thcs && thcs.fontSize, thColor: thcs && hex(thcs.color),
      tdFs: tdcs && tdcs.fontSize, valAlign: valCell && getComputedStyle(valCell).textAlign, valFvn: valCell && getComputedStyle(valCell).fontVariantNumeric,
      headCheckbox: !!t.querySelector('thead input[type=checkbox]'), rowCheckboxes: t.querySelectorAll('tbody input[type=checkbox]').length,
      rowActions: rows.filter((r) => r.lastElementChild && r.lastElementChild.querySelector('button')).length,
      container: cr,
      badge: badge && { t: badge.textContent.trim(), bg: hex(getComputedStyle(badge).backgroundColor), color: hex(getComputedStyle(badge).color), radius: getComputedStyle(badge).borderRadius, icon: !!badge.querySelector('svg') },
    };
    const card = t.closest('section') || t.parentElement;
    const title = card && card.querySelector('h2,h3');
    out.table.title = title && title.textContent.trim();
  }
  // badges semânticos (todas)
  const pairs = {};
  qa('[class*="badge"]').filter(vis).forEach((b) => {
    const c = getComputedStyle(b);
    const svg = b.querySelector('svg');
    const k = hex(c.backgroundColor) + ' / txt ' + hex(c.color) + ' / ico ' + (svg ? hex(getComputedStyle(svg).color) + '|' + (svg.getAttribute('stroke') || getComputedStyle(svg).stroke) : '-');
    pairs[k] = (pairs[k] || 0) + 1;
  });
  out.badgePairs = pairs;
  // cores de texto secundário
  const muted = {};
  qa('[class*="label"], [class*="meta"], [class*="cmp"], [class*="sub"], [class*="time"], [class*="detail"], [class*="desc"]').filter(vis).forEach((e) => { const k = hex(getComputedStyle(e).color); muted[k] = (muted[k] || 0) + 1; });
  out.mutedColors = muted;
  // superfícies (cards) : raio, borda, sombra, padding
  out.cards = qa(cfg.cards).filter(vis).slice(0, 14).map((e) => { const c = getComputedStyle(e); return { cls: (e.className + '').slice(0, 30), radius: c.borderRadius, bw: c.borderTopWidth, bc: hex(c.borderTopColor), bs: c.borderTopStyle, shadow: c.boxShadow, bg: hex(c.backgroundColor), padding: c.padding }; });
  // controles
  out.controls = qa('button, input, select').filter(vis).slice(0, 40).map((e) => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return { t: (e.innerText || e.getAttribute('aria-label') || e.type || '').trim().slice(0, 22), tag: e.tagName, type: e.type, radius: c.borderRadius, h: Math.round(r.height), w: Math.round(r.width), fs: c.fontSize, bg: hex(c.backgroundColor), color: hex(c.color), bc: hex(c.borderTopColor), bw: c.borderTopWidth }; });
  // sombras e gradientes em qualquer elemento visível
  const shadows = []; const grads = [];
  qa('body *').filter(vis).forEach((e) => {
    const c = getComputedStyle(e);
    if (c.boxShadow && c.boxShadow !== 'none') shadows.push((e.tagName + '.' + (e.className + '').split(' ')[0]).slice(0, 40) + ' ' + c.boxShadow.slice(0, 60));
    if (/gradient/.test(c.backgroundImage)) grads.push((e.tagName + '.' + (e.className + '').split(' ')[0]).slice(0, 40) + ' ' + c.backgroundImage.slice(0, 80));
  });
  out.shadows = shadows.slice(0, 20); out.shadowCount = shadows.length;
  out.gradients = grads.slice(0, 10);
  // ícones
  const svgs = qa('svg').filter(vis);
  const icoSizes = {}; const icoFill = {};
  svgs.forEach((s) => { const r = s.getBoundingClientRect(); const k = Math.round(r.width) + 'x' + Math.round(r.height); icoSizes[k] = (icoSizes[k] || 0) + 1; const c = getComputedStyle(s); const f = (s.getAttribute('fill') || c.fill) + '|sw ' + (s.getAttribute('stroke-width') || c.strokeWidth); icoFill[f] = (icoFill[f] || 0) + 1; });
  out.icons = { count: svgs.length, sizes: icoSizes, fill: icoFill };
  // alertas
  const al = q(cfg.alertsList); const asc = q(cfg.alertsScroll);
  if (al) {
    const items = Array.from(al.children).filter(vis);
    const ac = asc ? getComputedStyle(asc) : null;
    // procura indicador de fade: mask-image ou pseudo com gradiente no contêiner ou ancestrais próximos
    let fade = null; let e = asc;
    for (let i = 0; i < 4 && e; i++, e = e.parentElement) {
      const c = getComputedStyle(e);
      const mi = c.maskImage || c.webkitMaskImage;
      if (mi && mi !== 'none') { fade = 'mask ' + mi.slice(0, 60); break; }
      for (const p of ['::before', '::after']) { const pc = getComputedStyle(e, p); if (pc.content !== 'none' && (/gradient/.test(pc.backgroundImage) || pc.boxShadow !== 'none')) { fade = p + ' ' + (pc.backgroundImage + pc.boxShadow).slice(0, 60); } }
      if (fade) break;
      if (/gradient/.test(c.backgroundImage)) { fade = 'bg ' + c.backgroundImage.slice(0, 40); break; }
    }
    out.alerts = {
      count: items.length, ariaLive: al.getAttribute('aria-live') || (al.closest('[aria-live]') || {}).getAttribute?.('aria-live') || null,
      overflowY: ac && ac.overflowY, overscroll: ac && ac.overscrollBehaviorY, scrollable: asc ? asc.scrollHeight > asc.clientHeight : null,
      fade, first: items.slice(0, 4).map((i) => i.innerText.replace(/\s+/g, ' ').slice(0, 80)),
      times: items.slice(0, 8).map((i) => { const m = i.innerText.match(/(\d{2}):(\d{2})/); return m ? m[0] : null; }),
    };
  }
  // footer
  const f = q(cfg.footer);
  out.footerText = f ? f.innerText.replace(/\s+/g, ' ').trim() : null;
  // tabs
  for (const k of ['mtabs', 'dtabs']) {
    const tb = q(cfg[k]);
    if (tb) out[k] = { visible: vis(tb), role: tb.getAttribute('role'), orient: getComputedStyle(tb).flexDirection, tabs: Array.from(tb.querySelectorAll('[role=tab]')).map((x) => ({ t: x.textContent.trim().replace(/\s+/g, ' '), sel: x.getAttribute('aria-selected'), r: rect(x) })) };
  }
  return out;
}

// texto cortado, sobreposições e alvos de toque
function pageDefects(opts) {
  const res = { cut: [], overlap: [], small: [], fixed: [] };
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05; };
  const isSrOnly = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); if ((c.position === 'absolute' || c.position === 'fixed') && r.width <= 2 && r.height <= 2) return true; if (c.clipPath && c.clipPath.startsWith('inset(50%')) return true; if (c.clip && c.clip !== 'auto' && /rect\(0/.test(c.clip)) return true; } return false; };
  // nós de texto e seus retângulos recortados pelos ancestrais com overflow != visible
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const s = n.textContent.trim(); if (!s) continue;
    const el = n.parentElement; if (!el || !vis(el) || isSrOnly(el)) continue;
    if (el.closest('dialog:not([open]), [hidden], template, noscript, svg')) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rr = Array.from(range.getClientRects()).filter((r) => r.width > 0.5 && r.height > 0.5);
    if (!rr.length) continue;
    let box = { l: Math.min(...rr.map((r) => r.left)), t: Math.min(...rr.map((r) => r.top)), r: Math.max(...rr.map((r) => r.right)), b: Math.max(...rr.map((r) => r.bottom)) };
    // recorte e detecção de corte
    let clipped = { ...box }; let cutBy = null;
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const c = getComputedStyle(a);
      const ox = c.overflowX, oy = c.overflowY;
      if (ox === 'visible' && oy === 'visible' && c.textOverflow !== 'ellipsis') continue;
      const ar = a.getBoundingClientRect();
      const bl = parseFloat(c.borderLeftWidth), bt = parseFloat(c.borderTopWidth);
      const inner = { l: ar.left + bl, t: ar.top + bt, r: ar.left + bl + a.clientWidth, b: ar.top + bt + a.clientHeight };
      if (a === document.body) continue;
      const hiddenX = ox === 'hidden' || ox === 'clip', hiddenY = oy === 'hidden' || oy === 'clip';
      if (!cutBy && hiddenX && (box.r > inner.r + 1.5 || box.l < inner.l - 1.5) && a.scrollWidth > a.clientWidth + 1) cutBy = 'x:' + (a.id || a.className + '').slice(0, 30);
      if (!cutBy && hiddenY && (box.b > inner.b + 1.5) && a.scrollHeight > a.clientHeight + 1 && !(a.scrollTop > 0)) cutBy = 'y:' + (a.id || a.className + '').slice(0, 30);
      if (!cutBy && c.textOverflow === 'ellipsis' && a.scrollWidth > a.clientWidth + 1) cutBy = 'ellipsis:' + (a.id || a.className + '').slice(0, 30);
      clipped = { l: Math.max(clipped.l, inner.l), t: Math.max(clipped.t, inner.t), r: Math.min(clipped.r, inner.r), b: Math.min(clipped.b, inner.b) };
    }
    clipped = { l: Math.max(clipped.l, 0), t: Math.max(clipped.t, 0), r: Math.min(clipped.r, innerWidth), b: Math.min(clipped.b, innerHeight) };
    const visibleArea = (clipped.r - clipped.l) > 1 && (clipped.b - clipped.t) > 1;
    if (cutBy && visibleArea) res.cut.push(s.slice(0, 40) + ' [' + cutBy + ']');
    // texto além da viewport horizontalmente (sem scroll horizontal) também é corte
    if (box.r > innerWidth + 1 && visibleArea && !cutBy) { /* coberto pela métrica de overflow */ }
    if (visibleArea) texts.push({ s: s.slice(0, 30), el, box: clipped });
  }
  // sobreposição: texto x texto de outro elemento, e texto x caixa com fundo opaco que não é ancestral
  const boxes = [];
  document.querySelectorAll('body *').forEach((e) => {
    if (!vis(e) || e.closest('dialog:not([open]), [hidden], svg')) return;
    const c = getComputedStyle(e);
    const bg = c.backgroundColor; const opaque = bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg);
    if (!opaque) return;
    const r = e.getBoundingClientRect();
    if (r.width * r.height > innerWidth * innerHeight * 0.25) return; // ignora grandes fundos
    boxes.push({ e, l: r.left, t: r.top, r: r.right, b: r.bottom });
  });
  const inter = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
  const iw = (a, b) => [Math.min(a.r, b.r) - Math.max(a.l, b.l), Math.min(a.b, b.b) - Math.max(a.t, b.t)];
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const A = texts[i], B = texts[j];
      if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const [w, h] = iw(A.box, B.box);
      if (w > 2 && h > 3) res.overlap.push('texto "' + A.s + '" x "' + B.s + '" (' + w.toFixed(0) + 'x' + h.toFixed(0) + ')');
    }
    for (const bx of boxes) {
      const A = texts[i];
      if (bx.e.contains(A.el) || A.el.contains(bx.e)) continue;
      // caixa só sobrepõe se estiver pintada depois (não ancestral comum de fundo): exige que a caixa não contenha o texto e que o texto não seja ancestral
      const [w, h] = iw(A.box, bx);
      if (w > 3 && h > 4) {
        // confirma com elementFromPoint no centro da interseção
        const cx = (Math.max(A.box.l, bx.l) + Math.min(A.box.r, bx.r)) / 2, cy = (Math.max(A.box.t, bx.t) + Math.min(A.box.b, bx.b)) / 2;
        const top = document.elementFromPoint(cx, cy);
        if (top && (top === bx.e || bx.e.contains(top)) && !A.el.contains(top)) res.overlap.push('caixa ' + (bx.e.className + '').slice(0, 25) + ' cobre "' + A.s + '" (' + w.toFixed(0) + 'x' + h.toFixed(0) + ')');
      }
    }
  }
  res.overlap = Array.from(new Set(res.overlap)).slice(0, 15);
  res.cut = Array.from(new Set(res.cut)).slice(0, 15);
  // alvos de toque
  if (opts && opts.touch) {
    const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=tab], [role=button], [tabindex="0"]';
    document.querySelectorAll(sel).forEach((e) => {
      if (!vis(e) || isSrOnly(e) || e.closest('dialog:not([open]), [hidden]')) return;
      if (e.matches('[tabindex="0"]') && !e.matches('button, a, input, select, [role=tab], [role=button]')) return; // regiões roláveis focáveis
      let r = e.getBoundingClientRect();
      if (e.tagName === 'INPUT' && (e.type === 'checkbox' || e.type === 'radio')) { const lab = e.closest('label'); if (lab) r = lab.getBoundingClientRect(); }
      const cs = getComputedStyle(e);
      if (r.bottom < 0 || r.top > innerHeight * 3) return;
      res.total = (res.total || 0) + 1;
      if (r.width < 43.5 || r.height < 43.5) res.small.push(((e.innerText || e.getAttribute('aria-label') || e.type || e.tagName) + '').trim().replace(/\s+/g, ' ').slice(0, 25) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
  }
  return res;
}

module.exports = { SITES, pageMeasure, pageDefects };
