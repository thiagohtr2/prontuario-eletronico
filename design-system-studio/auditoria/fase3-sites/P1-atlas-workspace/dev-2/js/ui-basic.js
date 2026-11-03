/* Componentes Swiss Minimal (parte 1): cabeçalho de página, seções, estados, cards, KPIs, sparkline, gráfico de barras. */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, $$, esc, icon, fmt } = A;
  A.ui = A.ui || {};
  const U = A.ui;

  const pad2 = (n) => String(n).padStart(2, '0');

  // ---------------------------------------------------------------- estrutura de página
  U.pageHead = ({ overline, title, lede = '', actions = '' }) => `
    <header class="page-head">
      <p class="overline"><span class="sq" aria-hidden="true"></span>${esc(overline)}</p>
      <div class="page-head__row">
        <div class="page-head__text">
          <h1 class="page-title" id="page-title" tabindex="-1">${esc(title)}</h1>
          ${lede ? `<p class="page-lede">${esc(lede)}</p>` : ''}
        </div>
        ${actions ? `<div class="page-actions">${actions}</div>` : ''}
      </div>
    </header>`;

  /** Bloco com régua de 1 px e sobretítulo numerado. */
  U.section = ({ n, label, title, id, extra = '', body = '' }) => {
    const hid = id || A.uid('sec');
    return `
      <section class="sec" aria-labelledby="${hid}-h">
        <div class="sec__head">
          <p class="overline"><span class="sq" aria-hidden="true"></span>${pad2(n)} — ${esc(label)}</p>
          ${extra}
        </div>
        <h2 class="sec__title" id="${hid}-h">${esc(title)}</h2>
        ${body}
      </section>`;
  };

  // ---------------------------------------------------------------- estados (carregando, vazio, erro)
  U.stateBox = ({ kind, title, text = '', retry = false }) => `
    <div class="state-box state-box--${kind}" ${kind === 'error' ? 'role="alert"' : 'role="status"'}>
      ${icon(kind === 'error' ? 'triangle-alert' : 'inbox', { size: 28 })}
      <p class="state-box__title">${esc(title)}</p>
      ${text ? `<p class="state-box__text">${esc(text)}</p>` : ''}
      ${retry ? `<button type="button" class="btn btn--secondary btn--sm" data-retry>${icon('refresh-cw', { size: 16 })}<span>Tentar novamente</span></button>` : ''}
    </div>`;

  U.skelCards = (n = 3) => `
    <div class="card-grid" aria-busy="true" aria-label="Carregando">
      ${Array.from({ length: n }, () => `
        <div class="sw-card sw-card--skel" aria-hidden="true">
          <div class="sw-card__media skel"></div>
          <div class="sw-card__body"><span class="skel skel--line" style="width:30%"></span><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line" style="width:80%"></span></div>
          <div class="sw-card__foot"><span class="skel skel--line" style="width:25%"></span><span class="skel skel--btn"></span></div>
        </div>`).join('')}
    </div>`;

  /** Seletor de estado da demonstração (dados / carregando / vazio / erro). */
  U.stateSwitch = (current) => `
    <div class="state-switch" role="group" aria-label="Simular estado da lista">
      <span class="state-switch__label">Estado da demonstração</span>
      ${[['data', 'Dados'], ['loading', 'Carregando'], ['empty', 'Vazio'], ['error', 'Erro']]
        .map(([v, l]) => `<button type="button" class="seg-btn" data-state="${v}" aria-pressed="${v === current}">${l}</button>`).join('')}
    </div>`;

  /** Liga o seletor: onChange(state). Retorna função para sincronizar o rótulo ativo. */
  U.bindStateSwitch = (root, onChange) => {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.state-switch [data-state]');
      if (!b) return;
      $$('.state-switch [data-state]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      onChange(b.dataset.state);
    });
  };

  U.syncStateSwitch = (root, s) => {
    $$('.state-switch [data-state]', root).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.state === s)));
  };

  // ---------------------------------------------------------------- cards
  /**
   * c: { icon,label,title,text,meta,action }, opts: { n, href, id }
   * O cartão inteiro é clicável por link estendido (::after) — sem botões aninhados.
   */
  U.cardHTML = (c, opts = {}) => {
    const tag = opts.href ? `a href="${esc(opts.href)}"` : `button type="button" data-card="${esc(opts.id || '')}"`;
    const end = opts.href ? 'a' : 'button';
    return `
      <article class="sw-card">
        <div class="sw-card__media" aria-hidden="true">${icon(c.icon, { size: 56 })}</div>
        <div class="sw-card__body">
          <p class="sw-label"><span class="sq" aria-hidden="true"></span>${pad2(opts.n || 1)} — ${esc(c.label)}</p>
          <h3 class="sw-card__title">${esc(c.title)}</h3>
          <p class="sw-card__text">${esc(c.text)}</p>
        </div>
        <div class="sw-card__foot">
          <span class="sw-card__meta">${esc(c.meta)}</span>
          <${tag} class="btn btn--primary btn--sm stretched">${esc(c.action)}<span class="sr-only">: ${esc(c.title)}</span></${end}>
        </div>
      </article>`;
  };

  U.cardDetail = (c, trigger) => {
    const body = `
      <div class="sw-card__media sw-card__media--dlg" aria-hidden="true">${icon(c.icon, { size: 56 })}</div>
      <p class="sw-label"><span class="sq" aria-hidden="true"></span>${esc(c.label)} · ${esc(c.meta)}</p>
      <p class="dlg-text">${esc(c.text)}</p>
      <p class="dlg-text dlg-text--muted">${esc(c.detail)}</p>`;
    const foot = document.createElement('div');
    foot.className = 'dialog__actions';
    foot.innerHTML = `<button type="button" class="btn btn--secondary" data-close>Fechar</button>`;
    U.openDialog({ title: c.title, body, footer: foot, returnFocus: trigger });
  };

  // ---------------------------------------------------------------- KPI + sparkline
  const MONTHS = ['dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov'];
  const valText = (unit, v, dec) => unit.replace('{v}', dec ? fmt.num(v, dec) : Number.isInteger(v) ? fmt.int(v) : fmt.num(v, 1));
  U.valText = valText;

  U.kpiHTML = (k, compare, idx) => {
    const tone = k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat';
    const arrow = tone === 'up' ? 'arrow-up-right' : tone === 'down' ? 'arrow-down-right' : 'minus';
    const word = tone === 'up' ? 'aumento de' : tone === 'down' ? 'queda de' : 'sem variação,';
    const href = `#/relatorios?kpi=${k.id}`;
    return `
      <article class="kpi" data-kpi="${k.id}">
        <div class="kpi__top">
          <h3 class="sw-label kpi__label"><span class="sq" aria-hidden="true"></span>${pad2(idx + 1)} — <a class="stretched" href="${href}">${esc(k.label)}<span class="sr-only">: abrir relatório detalhado</span></a></h3>
          ${icon(k.icon, { cls: 'kpi__icon' })}
        </div>
        <p class="kpi__value">${esc(k.value)}</p>
        <p class="kpi__delta is-${tone}">
          ${icon(arrow, { size: 16 })}<strong>${fmt.pct(k.delta)}</strong><span class="sr-only"> (${word} ${fmt.num(Math.abs(k.delta), 1)}%)</span>
          <span class="kpi__cmp">${esc(compare)}</span>
        </p>
        <div class="spark" data-href="${href}"></div>
      </article>`;
  };

  /** Desenha o sparkline e liga o tooltip com os valores. */
  U.mountSpark = (host, k) => {
    const vals = k.series, n = vals.length;
    const min = Math.min(...vals), max = Math.max(...vals);
    const span = max - min || 1;
    const Y = (v) => 3 + (1 - (v - min) / span) * 26;
    const pts = vals.map((v, i) => `${(i / (n - 1)) * 100},${Y(v)}`).join(' ');
    const lab = (i) => (k.labels === 'mês' ? MONTHS[i % 12] : `sem. ${i + 1}`);
    host.innerHTML = `
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label="Tendência de ${esc(k.label)}: de ${esc(valText(k.unit, vals[0], k.dec))} a ${esc(valText(k.unit, vals[n - 1], k.dec))} em ${n} pontos">
        <line class="spark__base" x1="0" y1="31.5" x2="100" y2="31.5"/>
        <polyline class="spark__line" points="${pts}"/>
      </svg>
      <span class="spark__dot spark__dot--end" style="left:100%;top:${(Y(vals[n - 1]) / 32) * 100}%"></span>
      <span class="spark__dot spark__dot--hover" hidden></span>
      <span class="spark__tip" hidden></span>`;
    const dot = $('.spark__dot--hover', host), tip = $('.spark__tip', host);
    const show = (clientX) => {
      const r = host.getBoundingClientRect();
      const i = Math.max(0, Math.min(n - 1, Math.round(((clientX - r.left) / r.width) * (n - 1))));
      dot.hidden = false; tip.hidden = false;
      dot.style.left = (i / (n - 1)) * 100 + '%';
      dot.style.top = (Y(vals[i]) / 32) * 100 + '%';
      tip.textContent = `${lab(i)}: ${valText(k.unit, vals[i], k.dec)}`;
      const tw = tip.offsetWidth;
      const px = (i / (n - 1)) * r.width;
      tip.style.left = Math.max(0, Math.min(px - tw / 2, r.width - tw)) + 'px';
    };
    host.addEventListener('pointermove', (e) => show(e.clientX));
    host.addEventListener('pointerleave', () => { dot.hidden = true; tip.hidden = true; });
    host.addEventListener('click', () => { location.hash = host.dataset.href; });
  };

  U.skelKpi = (i) => `
    <article class="kpi kpi--skel" aria-busy="true" aria-label="Carregando indicador ${i + 1}">
      <span class="skel skel--line" style="width:55%"></span><span class="skel skel--value"></span><span class="skel skel--line" style="width:70%"></span><span class="skel skel--spark"></span>
    </article>`;

  // ---------------------------------------------------------------- gráfico de barras (SVG responsivo)
  function niceStep(maxV, ticks) {
    const raw = maxV / ticks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / mag;
    const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return nice * mag;
  }

  /** data: { labels, values, unit, title }. Retorna função de limpeza. */
  U.mountBarChart = (host, data) => {
    const id = A.uid('chart');
    const { labels, values, unit } = data;
    const n = values.length;
    const first = values[0], last = values[n - 1];
    host.innerHTML = `
      <div class="chart" id="${id}">
        <div class="chart__plot" tabindex="0" role="group" aria-roledescription="gráfico de barras"
          aria-label="${esc(data.title)} em ${esc(unit)}: ${n} valores, de ${fmt.num(first, 1)} a ${fmt.num(last, 1)}. Use as setas para percorrer as barras.">
          <svg class="chart__svg" aria-hidden="true"></svg>
          <div class="chart__tip" hidden></div>
        </div>
        <p class="sr-only" aria-live="polite" id="${id}-live"></p>
        <table class="sr-only"><caption>${esc(data.title)} (${esc(unit)})</caption><thead><tr><th scope="col">Período</th><th scope="col">Valor</th></tr></thead>
          <tbody>${labels.map((l, i) => `<tr><td>${esc(l)}</td><td>${fmt.num(values[i], 1)}</td></tr>`).join('')}</tbody></table>
      </div>`;
    const plot = $('.chart__plot', host), svg = $('.chart__svg', host), tip = $('.chart__tip', host), live = $('#' + id + '-live', host);
    let active = -1, geo = null;

    function draw() {
      const w = Math.max(240, plot.clientWidth);
      const mobile = w < 480;
      const h = mobile ? 220 : 280;
      const m = { l: mobile ? 36 : 44, r: 8, t: 20, b: 28 };
      const pw = w - m.l - m.r, ph = h - m.t - m.b;
      const step = niceStep(Math.max(...values), 4);
      const top = step * 4;
      const dec = step % 1 ? 1 : 0;
      const band = pw / n, bw = Math.min(band * 0.58, 40);
      const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(pw / 56))));
      let g = '';
      for (let t = 0; t <= 4; t++) {
        const y = m.t + ph - (t / 4) * ph;
        g += `<line class="chart__grid${t === 0 ? ' chart__grid--base' : ''}" x1="${m.l}" x2="${w - m.r}" y1="${y}" y2="${y}"/>`;
        g += `<text class="chart__ytick" x="${m.l - 8}" y="${y + 4}" text-anchor="end">${fmt.num(step * t, dec)}</text>`;
      }
      geo = values.map((v, i) => {
        const bh = (v / top) * ph;
        const x = m.l + band * i + (band - bw) / 2;
        return { x, y: m.t + ph - bh, w: bw, h: bh, cx: x + bw / 2 };
      });
      geo.forEach((b, i) => {
        g += `<rect class="chart__bar" data-i="${i}" x="${b.x}" y="${b.y}" width="${b.w}" height="${Math.max(b.h, 0)}"/>`;
        if (i % every === 0 || i === n - 1 && (n - 1) % every === 0) g += `<text class="chart__xtick" x="${b.cx}" y="${h - 8}" text-anchor="middle">${esc(labels[i])}</text>`;
      });
      g += `<rect class="chart__mark" width="6" height="6" hidden/>`;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);
      svg.innerHTML = g;
      if (active >= 0) highlight(active, false);
    }

    function highlight(i, announce = true) {
      active = i;
      $$('.chart__bar', svg).forEach((b, k) => b.classList.toggle('is-active', k === i));
      const b = geo[i];
      const mark = $('.chart__mark', svg);
      mark.removeAttribute('hidden');
      mark.setAttribute('x', b.cx - 3);
      mark.setAttribute('y', b.y - 10);
      const txt = `${labels[i]}: ${fmt.num(values[i], 1)} ${unit}`;
      tip.hidden = false;
      tip.textContent = txt;
      const tw = tip.offsetWidth;
      tip.style.left = Math.max(0, Math.min(b.cx - tw / 2, plot.clientWidth - tw)) + 'px';
      tip.style.top = Math.max(0, b.y - 40) + 'px';
      if (announce) live.textContent = txt;
    }
    function clear() {
      active = -1;
      $$('.chart__bar', svg).forEach((b) => b.classList.remove('is-active'));
      $('.chart__mark', svg)?.setAttribute('hidden', '');
      tip.hidden = true;
    }

    plot.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      const x = e.clientX - r.left;
      let best = -1, bd = 1e9;
      geo.forEach((b, i) => { const d = Math.abs(b.cx - x); if (d < bd) { bd = d; best = i; } });
      if (best >= 0 && bd < (geo[1] ? Math.abs(geo[1].cx - geo[0].cx) : 60)) highlight(best, false); else clear();
    });
    plot.addEventListener('pointerleave', () => { if (document.activeElement !== plot) clear(); });
    plot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); highlight(Math.min(n - 1, active + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); highlight(Math.max(0, active < 0 ? 0 : active - 1)); }
      else if (e.key === 'Home') { e.preventDefault(); highlight(0); }
      else if (e.key === 'End') { e.preventDefault(); highlight(n - 1); }
      else if (e.key === 'Escape') clear();
    });
    plot.addEventListener('blur', clear);

    draw();
    const ro = new ResizeObserver(A.debounce(draw, 60));
    ro.observe(plot);
    return () => ro.disconnect();
  };
})();
