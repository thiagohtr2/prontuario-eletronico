/* Centro Operacional — aplicação (demonstração sem backend). */
(function () {
  'use strict';
  var CO = window.CO;
  var icon = CO.icon, fmt = CO.fmt, esc = CO.esc, D = CO.data;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- Vocabulário de status ---------- */
  var LEVEL = {
    normal: { label: 'Normal', tone: 'success', icon: 'circle-check', rank: 0 },
    atencao: { label: 'Atenção', tone: 'warning', icon: 'triangle-alert', rank: 1 },
    critico: { label: 'Crítico', tone: 'error', icon: 'octagon-alert', rank: 2 }
  };
  var SEV = {
    critical: { label: 'Crítico', plural: 'Críticos', tone: 'error', icon: 'octagon-alert' },
    warning: { label: 'Atenção', plural: 'Atenção', tone: 'warning', icon: 'triangle-alert' },
    info: { label: 'Informativo', plural: 'Informativos', tone: 'info', icon: 'info' },
    success: { label: 'Resolvido', plural: 'Resolvidos', tone: 'success', icon: 'circle-check' }
  };
  var ORDER_STATUS = {
    atrasado: { label: 'Atrasado', tone: 'error', icon: 'octagon-alert', rank: 0 },
    pendente: { label: 'Pendente', tone: 'warning', icon: 'clock', rank: 1 },
    separacao: { label: 'Em separação', tone: 'info', icon: 'package', rank: 2 },
    concluido: { label: 'Concluído', tone: 'success', icon: 'circle-check', rank: 3 },
    cancelado: { label: 'Cancelado', tone: 'neutral', icon: 'ban', rank: 4 }
  };
  var GROUPS = {
    filas: {
      level: function (it) { return it.maxWait > 30 ? 'critico' : it.maxWait > 10 ? 'atencao' : 'normal'; },
      metric: function (it) { return fmt.int(it.waiting) + ' aguardando · máx. ' + it.maxWait + ' min'; },
      meta: function (items) { return fmt.int(sum(items, 'waiting')) + ' aguardando'; },
      noun: 'Fila'
    },
    sla: {
      level: function (it) { return it.value >= it.target ? 'normal' : it.value >= it.target - 5 ? 'atencao' : 'critico'; },
      metric: function (it) { return fmt.n1(it.value) + '% · meta ' + it.target + '%'; },
      meta: function (items) { return 'média ' + fmt.n1(sum(items, 'value') / items.length) + '%'; },
      noun: 'SLA de'
    },
    equipes: {
      level: function (it) { var r = it.online / it.total; return r >= 0.85 ? 'normal' : r >= 0.6 ? 'atencao' : 'critico'; },
      metric: function (it) { return it.online + ' de ' + it.total + ' online'; },
      meta: function (items) { return sum(items, 'online') + ' de ' + sum(items, 'total') + ' online'; },
      noun: 'Equipe'
    }
  };
  var SORT_DEFAULT_DIR = { cliente: 'asc', status: 'asc', valor: 'desc', data: 'desc' };
  var SORT_LABEL = { cliente: 'Cliente', status: 'Status', valor: 'Valor', data: 'Data' };

  function sum(items, k) { return items.reduce(function (a, it) { return a + it[k]; }, 0); }

  /* ---------- Estado ---------- */
  var baseStatus = D.status();
  var state = {
    mode: 'full',
    view: 'painel',      // desktop compactado: painel | alertas
    mtab: 'indicadores', // celular: indicadores | operacao | pedidos | alertas
    online: true,
    reconnecting: false,
    refreshing: false,
    kpiLoading: false,
    statusState: 'loading',
    ordersState: 'loading',
    alertsState: 'loading',
    emptied: false,
    kpis: D.kpis,
    status: D.status(),
    orders: D.orders(),
    alerts: D.seedAlerts(),
    selected: new Set(),
    sort: { key: 'data', dir: 'desc' },
    query: '',
    lastUpdate: null,
    unseen: 0,
    tip: {} // índice do ponto destacado por indicador
  };

  var els = {};

  /* ---------- Modos de layout (espelham as media queries do CSS) ---------- */
  var MQ = {
    mobile: matchMedia('(max-width: 47.999em)'),
    stacked: matchMedia('(min-width: 48em) and (max-height: 39.999em)'),
    compact: matchMedia('(min-width: 48em) and (max-width: 79.999em)'),
    landscape: matchMedia('(orientation: landscape)')
  };

  function getMode() {
    if (MQ.mobile.matches) return 'mobile';
    if (MQ.stacked.matches) return 'stacked';
    if (MQ.compact.matches) return 'compact';
    return 'full';
  }

  function setPanelRole(el, labelledby, hidden) {
    el.setAttribute('role', 'tabpanel');
    el.setAttribute('aria-labelledby', labelledby);
    el.hidden = hidden;
  }

  function clearPanelRole(el) {
    el.hidden = false;
    if (el.dataset.labelledby) el.setAttribute('aria-labelledby', el.dataset.labelledby);
    else el.removeAttribute('aria-labelledby');
    el.removeAttribute('role');
  }

  function applyMode() {
    var prev = state.mode;
    var mode = getMode();
    state.mode = mode;
    els.app.dataset.mode = mode;
    var sections = { indicadores: els.secKpis, operacao: els.secOp, pedidos: els.secOrders };
    [els.content, els.panel, els.secKpis, els.secOp, els.secOrders].forEach(clearPanelRole);

    if (mode === 'compact') {
      setPanelRole(els.content, 'vt-painel', state.view !== 'painel');
      setPanelRole(els.panel, 'vt-alertas', state.view !== 'alertas');
    } else if (mode === 'mobile') {
      Object.keys(sections).forEach(function (k) {
        setPanelRole(sections[k], 'mt-' + k, state.mtab !== k);
      });
      els.content.hidden = state.mtab === 'alertas';
      setPanelRole(els.panel, 'mt-alertas', state.mtab !== 'alertas');
      els.mobileTabs.setAttribute('aria-orientation', MQ.landscape.matches ? 'vertical' : 'horizontal');
    }
    syncTabs();
    if (state.mode !== prev) CO.menu.close(false);
    if (isAlertsVisible()) clearUnseen();
    requestAnimationFrame(CO.fades.refresh);
  }

  function syncTabs() {
    $$('[role="tab"]', els.viewTabs).forEach(function (t) {
      var on = t.dataset.tab === state.view;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    $$('[role="tab"]', els.mobileTabs).forEach(function (t) {
      var on = t.dataset.tab === state.mtab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
  }

  function isAlertsVisible() {
    if (state.mode === 'compact') return state.view === 'alertas';
    if (state.mode === 'mobile') return state.mtab === 'alertas';
    return true;
  }

  function selectView(v) {
    state.view = v;
    applyMode();
  }

  function selectMtab(t) {
    state.mtab = t;
    applyMode();
    var tab = $('#mt-' + t);
    if (tab && tab.scrollIntoView) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    /* No modo que rola (altura < 560 px), mantém o início do painel visível */
    var tabsTop = els.mobileTabs.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > tabsTop) window.scrollTo(0, tabsTop);
  }

  /* ---------- Indicadores ---------- */
  function kpiCalc(k) {
    var n = k.values.length, last = k.values[n - 1], prev = k.values[n - 2];
    var pct = Math.round(((last - prev) / prev) * 1000) / 10;
    var trend = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
    return { last: last, pct: pct, trend: trend };
  }

  var TREND = {
    up: { icon: 'arrow-up-right', sr: 'Alta de' },
    down: { icon: 'arrow-down-right', sr: 'Queda de' },
    flat: { icon: 'arrow-right', sr: 'Estável:' }
  };

  function sparkPath(vals) {
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), r = max - min || 1;
    return vals.map(function (v, i) {
      var x = (i / (vals.length - 1)) * 100;
      var y = 3 + (1 - (v - min) / r) * 26;
      return (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2);
    }).join(' ');
  }

  function sparkYPct(vals, i) {
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), r = max - min || 1;
    return ((3 + (1 - (vals[i] - min) / r) * 26) / 32) * 100;
  }

  function deltaHTML(k, c) {
    var t = TREND[c.trend];
    return '<span class="kpi__delta">' +
      '<span class="kpi__delta-val trend-' + c.trend + '">' + icon(t.icon) +
      '<span class="sr-only">' + t.sr + ' </span>' + fmt.signedPct(c.pct) + '</span>' +
      '<span class="kpi__cmp">' + esc(k.comparativo) + '</span></span>';
  }

  function kpiCard(k) {
    var c = kpiCalc(k);
    var loading = state.kpiLoading;
    var labels = CO.periodLabels(k.period, k.values.length);
    var body = loading
      ? '<span class="skel skel--value"></span><span class="skel" style="width:75%"></span><span class="skel skel--spark"></span>'
      : '<span class="kpi__value">' + fmt.value(k.format, c.last) + '</span>' + deltaHTML(k, c) +
        '<span class="kpi__spark">' +
          '<svg viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label="Tendência dos ' + esc(k.periodLabel) +
          ': de ' + fmt.value(k.format, k.values[0]) + ' (' + labels[0] + ') a ' + fmt.value(k.format, c.last) + ' (' + labels[labels.length - 1] + ')">' +
          '<path d="' + sparkPath(k.values) + '"/></svg>' +
          '<span class="kpi__guide" hidden></span><span class="kpi__dot" hidden></span>' +
        '</span>';
    return '<button type="button" class="kpi' + (loading ? ' is-loading' : '') + '" data-kpi="' + k.id + '" aria-haspopup="dialog"' +
      (loading ? ' aria-busy="true"' : '') + '>' +
      '<span class="kpi__top"><span class="kpi__label">' + esc(k.label) + '</span>' + icon(k.icon) + '</span>' +
      body +
      '<span class="kpi__tip" aria-hidden="true" hidden></span>' +
      '<span class="sr-only">. Abrir relatório detalhado</span>' +
      '</button>';
  }

  function renderKpis() {
    els.kpisHl.innerHTML = kpiCard(state.kpis[0]);
    els.kpisBlocks.innerHTML = state.kpis.slice(1).map(kpiCard).join('');
  }

  function kpiById(id) {
    return state.kpis.filter(function (k) { return k.id === id; })[0];
  }

  function showTip(card, idx) {
    var k = kpiById(card.dataset.kpi);
    var spark = $('.kpi__spark', card);
    if (!k || !spark || card.classList.contains('is-loading')) return;
    var n = k.values.length;
    idx = Math.max(0, Math.min(n - 1, idx));
    state.tip[k.id] = idx;
    var xPct = (idx / (n - 1)) * 100;
    var guide = $('.kpi__guide', card), dot = $('.kpi__dot', card), tip = $('.kpi__tip', card);
    guide.hidden = false;
    dot.hidden = false;
    guide.style.left = xPct + '%';
    dot.style.left = xPct + '%';
    dot.style.top = sparkYPct(k.values, idx) + '%';
    var labels = CO.periodLabels(k.period, n);
    tip.textContent = labels[idx] + ' · ' + fmt.value(k.format, k.values[idx]);
    tip.hidden = false;
    var x = spark.offsetLeft + (xPct / 100) * spark.clientWidth;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.max(4, Math.min(card.clientWidth - w - 4, x - w / 2));
    tip.style.left = left + 'px';
    tip.style.top = Math.max(2, spark.offsetTop - h - 6) + 'px';
  }

  function hideTip(card) {
    ['.kpi__guide', '.kpi__dot', '.kpi__tip'].forEach(function (s) {
      var e = $(s, card);
      if (e) e.hidden = true;
    });
    delete state.tip[card.dataset.kpi];
  }

  function bindKpis() {
    els.kpis.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.kpi');
      if (!card) return;
      var spark = e.target.closest('.kpi__spark');
      if (!spark) { hideTip(card); return; }
      var k = kpiById(card.dataset.kpi);
      var r = spark.getBoundingClientRect();
      var ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      showTip(card, Math.round(ratio * (k.values.length - 1)));
    });
    els.kpis.addEventListener('pointerout', function (e) {
      var card = e.target.closest('.kpi');
      if (card && !card.contains(e.relatedTarget)) hideTip(card);
    });
    /* Teclado: ←/→ percorrem os pontos do mini gráfico; Enter abre o relatório */
    els.kpis.addEventListener('keydown', function (e) {
      var card = e.target.closest('.kpi');
      if (!card) return;
      var k = kpiById(card.dataset.kpi);
      var cur = state.tip[k.id];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        var start = cur === undefined ? k.values.length - 1 : cur + (e.key === 'ArrowLeft' ? -1 : 1);
        showTip(card, start);
      } else if (e.key === 'Escape' && cur !== undefined) {
        hideTip(card);
      }
    });
    els.kpis.addEventListener('focusout', function (e) {
      var card = e.target.closest('.kpi');
      if (card) hideTip(card);
    });
    els.kpis.addEventListener('click', function (e) {
      var card = e.target.closest('.kpi');
      if (!card || card.classList.contains('is-loading')) return;
      openReport(kpiById(card.dataset.kpi));
    });
  }

  function openReport(k) {
    var c = kpiCalc(k);
    var n = k.values.length;
    var labels = CO.periodLabels(k.period, n);
    var min = Math.min.apply(null, k.values), max = Math.max.apply(null, k.values);
    var avg = sum(k.values.map(function (v) { return { v: v }; }), 'v') / n;
    var lo = min - (max - min) * 0.1, hi = max + (max - min) * 0.1;
    if (hi === lo) { hi += 1; lo -= 1; }
    var W = 600, H = 200;
    var d = k.values.map(function (v, i) {
      return (i ? 'L' : 'M') + ((i / (n - 1)) * W).toFixed(1) + ' ' + (H - ((v - lo) / (hi - lo)) * H).toFixed(1);
    }).join(' ');
    var major = [0, 4, 8, n - 1];
    var xLabels = labels.map(function (l, i) {
      return '<span class="' + (major.indexOf(i) >= 0 ? '' : 'x-minor') + '" style="left:' + ((i / (n - 1)) * 100).toFixed(2) + '%">' + esc(l) + '</span>';
    }).join('');
    var rows = k.values.map(function (v, i) {
      var varHTML = '—';
      if (i > 0) {
        var p = Math.round(((v - k.values[i - 1]) / k.values[i - 1]) * 1000) / 10;
        var tr = p > 0 ? 'up' : p < 0 ? 'down' : 'flat';
        varHTML = '<span class="trend-' + tr + '">' + fmt.signedPct(p) + '</span>';
      }
      return '<tr><th scope="row">' + esc(labels[i]) + '</th><td class="num">' + fmt.value(k.format, v) + '</td><td class="num">' + varHTML + '</td></tr>';
    }).reverse().join('');

    var body =
      '<div class="report">' +
        '<div class="report__summary">' +
          '<div><p class="report__value">' + fmt.value(k.format, c.last) + '</p>' + deltaHTML(k, c) + '</div>' +
          '<dl class="report__stats">' +
            '<div><dt>Mínimo</dt><dd>' + fmt.value(k.format, min) + '</dd></div>' +
            '<div><dt>Máximo</dt><dd>' + fmt.value(k.format, max) + '</dd></div>' +
            '<div><dt>Média</dt><dd>' + fmt.value(k.format, avg) + '</dd></div>' +
          '</dl>' +
        '</div>' +
        '<figure class="chart" aria-label="Gráfico de ' + esc(k.label) + ' nos ' + esc(k.periodLabel) + '">' +
          '<div class="chart__plot">' +
            '<div class="chart__y" aria-hidden="true"><span>' + fmt.value(k.format, hi) + '</span><span>' + fmt.value(k.format, (hi + lo) / 2) + '</span><span>' + fmt.value(k.format, lo) + '</span></div>' +
            '<div class="chart__area"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
              '<line class="chart__grid" x1="0" x2="' + W + '" y1="0" y2="0"/><line class="chart__grid" x1="0" x2="' + W + '" y1="' + H / 2 + '" y2="' + H / 2 + '"/>' +
              '<path class="chart__line" d="' + d + '"/></svg></div>' +
            '<span></span><div class="chart__x" aria-hidden="true">' + xLabels + '</div>' +
          '</div>' +
        '</figure>' +
        '<div class="table-scroll report__table scroll-x"><table class="data-table">' +
          '<caption class="sr-only">Valores de ' + esc(k.label) + ', do mais recente ao mais antigo</caption>' +
          '<thead><tr><th scope="col">Período</th><th scope="col" class="num">Valor</th><th scope="col" class="num">Variação</th></tr></thead>' +
          '<tbody>' + rows + '</tbody></table></div>' +
      '</div>';

    CO.dialog.open({
      title: k.label,
      subtitle: 'Relatório detalhado · ' + k.periodLabel,
      body: body,
      actions: [{ label: 'Fechar', variant: 'secondary' }],
      fallbackFocus: function () { return $('.kpi[data-kpi="' + k.id + '"]'); }
    });
  }

  /* ---------- Blocos de status ---------- */
  function badge(tone, iconName, label, extraClass) {
    return '<span class="badge badge--' + tone + (extraClass ? ' ' + extraClass : '') + '">' + icon(iconName) + esc(label) + '</span>';
  }

  function levelOf(group, it) { return GROUPS[group].level(it); }

  function renderStatus() {
    var st = state.statusState;
    $$('.status-card', els.statusGrid).forEach(function (card) {
      card.hidden = st === 'error';
    });
    var errEl = $('.state', els.statusGrid);
    if (errEl) errEl.remove();

    if (st === 'error') {
      els.statusGrid.insertAdjacentHTML('beforeend',
        '<div class="state state--error" role="alert">' + icon('wifi-off') +
        '<p class="state__title">Não foi possível atualizar filas, SLA e equipes.</p>' +
        '<p>Verifique a conexão e tente novamente.</p>' +
        '<button type="button" class="btn btn--secondary btn--cp" data-action="retry">' + icon('refresh-cw') + 'Tentar novamente</button></div>');
      els.overall.innerHTML = '<span class="overall__label">Situação geral</span>' + badge('neutral', 'wifi-off', 'Indisponível');
      return;
    }

    var counts = { normal: 0, atencao: 0, critico: 0 };
    Object.keys(GROUPS).forEach(function (g) {
      var card = $('.status-card[data-group="' + g + '"]', els.statusGrid);
      var list = $('[data-list]', card), meta = $('[data-meta]', card);
      var items = state.status[g];
      if (st === 'loading') {
        list.setAttribute('aria-busy', 'true');
        meta.textContent = '';
        list.innerHTML = [1, 2, 3, 4].map(function () {
          return '<li class="status-row" aria-hidden="true"><span class="status-row__main" style="flex:1"><span class="skel" style="width:55%"></span><span class="skel" style="width:75%;margin-top:6px"></span></span><span class="skel" style="width:5rem;height:1.25rem"></span></li>';
        }).join('') + '<li class="sr-only">Carregando…</li>';
        return;
      }
      list.removeAttribute('aria-busy');
      if (!items.length) {
        meta.textContent = '';
        list.innerHTML = '<li class="state">' + icon('inbox') + '<span class="state__title">Sem dados no momento</span><span>As informações aparecem aqui assim que forem recebidas.</span></li>';
        return;
      }
      meta.textContent = GROUPS[g].meta(items);
      list.innerHTML = items.map(function (it) {
        var lv = levelOf(g, it);
        counts[lv] += 1;
        var L = LEVEL[lv];
        return '<li class="status-row"><span class="status-row__main"><span class="status-row__name">' + esc(it.name) + '</span>' +
          '<span class="status-row__metric">' + GROUPS[g].metric(it) + '</span></span>' + badge(L.tone, L.icon, L.label) + '</li>';
      }).join('');
    });

    if (st === 'loading') {
      els.overall.innerHTML = '<span class="overall__label">Situação geral</span><span class="overall__counts">Atualizando…</span>';
      return;
    }
    var total = counts.normal + counts.atencao + counts.critico;
    if (!total) {
      els.overall.innerHTML = '<span class="overall__label">Situação geral</span>' + badge('neutral', 'inbox', 'Sem dados');
      return;
    }
    var worst = counts.critico ? 'critico' : counts.atencao ? 'atencao' : 'normal';
    var W = LEVEL[worst];
    els.overall.innerHTML = '<span class="overall__label">Situação geral</span>' + badge(W.tone, W.icon, W.label) +
      '<span class="overall__counts">' + [
        fmt.plural(counts.critico, 'crítico', 'críticos'),
        fmt.int(counts.atencao) + ' em atenção',
        fmt.plural(counts.normal, 'normal', 'normais')
      ].join(' · ') + '</span>';
  }

  /* ---------- Dados operacionais (tabela) ---------- */
  function visibleOrders() {
    var q = CO.norm(state.query.trim());
    var list = state.orders.filter(function (o) { return !q || CO.norm(o.cliente).indexOf(q) >= 0; });
    var k = state.sort.key, dir = state.sort.dir === 'asc' ? 1 : -1;
    list.sort(function (a, b) {
      var va, vb;
      if (k === 'cliente') return a.cliente.localeCompare(b.cliente, 'pt-BR') * dir;
      if (k === 'status') { va = ORDER_STATUS[a.status].rank; vb = ORDER_STATUS[b.status].rank; }
      else if (k === 'valor') { va = a.valor; vb = b.valor; }
      else { va = a.data.getTime(); vb = b.data.getTime(); }
      return (va - vb) * dir || (b.data - a.data);
    });
    return list;
  }

  function orderBadge(o) {
    var s = ORDER_STATUS[o.status];
    return badge(s.tone, s.icon, s.label);
  }

  function rowHTML(o) {
    var sel = state.selected.has(o.id);
    var name = esc(o.cliente);
    return '<tr data-id="' + o.id + '"' + (sel ? ' class="is-selected"' : '') + '>' +
      '<td class="col-check"><label class="check"><input type="checkbox" data-select="' + o.id + '"' + (sel ? ' checked' : '') +
        ' aria-label="Selecionar pedido de ' + name + '"></label></td>' +
      '<th scope="row">' + name + '</th>' +
      '<td>' + orderBadge(o) + '</td>' +
      '<td class="num">' + fmt.brl(o.valor) + '</td>' +
      '<td class="col-date"><time datetime="' + o.data.toISOString() + '">' + fmt.dateTime(o.data) + '</time></td>' +
      '<td class="col-actions"><button type="button" class="icon-btn" data-row-menu="' + o.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Ações do pedido de ' + name + '">' + icon('ellipsis') + '</button></td>' +
      '</tr>';
  }

  function cardHTML(o) {
    var sel = state.selected.has(o.id);
    var name = esc(o.cliente);
    return '<li class="order-card' + (sel ? ' is-selected' : '') + '" data-id="' + o.id + '">' +
      '<div class="order-card__head">' +
        '<label class="check"><input type="checkbox" data-select="' + o.id + '"' + (sel ? ' checked' : '') + ' aria-label="Selecionar pedido de ' + name + '"></label>' +
        '<h3 class="order-card__title">' + name + '</h3>' +
        '<button type="button" class="icon-btn" data-row-menu="' + o.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Ações do pedido de ' + name + '">' + icon('ellipsis') + '</button>' +
      '</div>' +
      '<dl class="order-card__fields">' +
        '<div><dt>Status</dt><dd>' + orderBadge(o) + '</dd></div>' +
        '<div><dt>Valor</dt><dd>' + fmt.brl(o.valor) + '</dd></div>' +
        '<div><dt>Data</dt><dd><time datetime="' + o.data.toISOString() + '">' + fmt.dateTime(o.data) + '</time></dd></div>' +
      '</dl></li>';
  }

  function renderOrders() {
    var st = state.ordersState;
    var stateEl = els.ordersState;
    stateEl.hidden = true;
    stateEl.className = 'state';
    stateEl.removeAttribute('role');
    els.tableScroll.hidden = false;
    els.orderCards.hidden = false;
    els.ordersBody.removeAttribute('aria-busy');

    /* Resumo (destaque no celular) */
    if (st === 'ready') {
      var total = sum(state.orders, 'valor');
      var late = state.orders.filter(function (o) { return o.status === 'atrasado'; }).length;
      els.ordersSummary.innerHTML = fmt.plural(state.orders.length, 'pedido', 'pedidos') + ' · <strong>' + fmt.brl(total) + '</strong>' +
        (late ? ' · ' + fmt.plural(late, 'atrasado', 'atrasados') : '');
    } else {
      els.ordersSummary.textContent = st === 'loading' ? 'Carregando…' : 'Dados indisponíveis';
    }

    if (st === 'loading') {
      els.ordersBody.setAttribute('aria-busy', 'true');
      els.tbody.innerHTML = [1, 2, 3, 4].map(function () {
        return '<tr aria-hidden="true"><td class="col-check"><span class="skel" style="width:1rem;height:1rem"></span></td>' +
          '<td><span class="skel" style="width:70%"></span></td><td><span class="skel" style="width:5.5rem;height:1.25rem"></span></td>' +
          '<td class="num"><span class="skel" style="width:4.5rem;margin-left:auto"></span></td><td><span class="skel" style="width:5rem"></span></td><td></td></tr>';
      }).join('') + '<tr class="sr-only"><td colspan="6">Carregando pedidos…</td></tr>';
      els.orderCards.innerHTML = [1, 2, 3].map(function () {
        return '<li class="order-card is-skel" aria-hidden="true"><span class="skel" style="width:60%"></span><span class="skel" style="width:85%"></span><span class="skel" style="width:40%"></span></li>';
      }).join('');
      updateSelectionUI([]);
      updateSortUI();
      CO.fades.refresh();
      return;
    }

    if (st === 'error') {
      els.tableScroll.hidden = true;
      els.orderCards.hidden = true;
      stateEl.hidden = false;
      stateEl.className = 'state state--error';
      stateEl.setAttribute('role', 'alert');
      stateEl.innerHTML = icon('wifi-off') + '<p class="state__title">Não foi possível carregar os pedidos.</p>' +
        '<p>Verifique a conexão e tente novamente.</p>' +
        '<button type="button" class="btn btn--secondary btn--cp" data-action="retry">' + icon('refresh-cw') + 'Tentar novamente</button>';
      updateSelectionUI([]);
      CO.fades.refresh();
      return;
    }

    var list = visibleOrders();
    if (!list.length) {
      els.tableScroll.hidden = true;
      els.orderCards.hidden = true;
      stateEl.hidden = false;
      stateEl.className = 'state state--empty';
      if (state.query.trim()) {
        stateEl.innerHTML = icon('search') + '<p class="state__title">Nenhum pedido encontrado para “' + esc(state.query.trim()) + '”.</p>' +
          '<p>Confira a grafia ou busque por outro cliente.</p>' +
          '<button type="button" class="btn btn--secondary btn--cp" data-action="clear-search">' + icon('x') + 'Limpar busca</button>';
      } else {
        stateEl.innerHTML = icon('inbox') + '<p class="state__title">Nenhum pedido recente.</p>' +
          '<p>Novos pedidos aparecem aqui automaticamente.</p>' +
          '<button type="button" class="btn btn--secondary btn--cp" data-action="restore">' + icon('rotate-ccw') + 'Restaurar dados de exemplo</button>';
      }
      updateSelectionUI([]);
      updateSortUI();
      CO.fades.refresh();
      return;
    }

    els.tbody.innerHTML = list.map(rowHTML).join('');
    els.orderCards.innerHTML = list.map(cardHTML).join('');
    updateSelectionUI(list);
    updateSortUI();
    CO.fades.refresh();
  }

  function updateSelectionUI(list) {
    var ids = list.map(function (o) { return o.id; });
    var selVisible = ids.filter(function (id) { return state.selected.has(id); }).length;
    [els.selectAll, els.selectAllM].forEach(function (cb) {
      cb.disabled = ids.length === 0;
      cb.checked = ids.length > 0 && selVisible === ids.length;
      cb.indeterminate = selVisible > 0 && selVisible < ids.length;
    });
    $$('[data-select]', els.ordersBody).forEach(function (cb) {
      var on = state.selected.has(cb.dataset.select);
      cb.checked = on;
      var row = cb.closest('tr, .order-card');
      if (row) row.classList.toggle('is-selected', on);
    });
    var n = state.selected.size;
    var completable = Array.from(state.selected).filter(function (id) {
      var o = orderById(id);
      return o && o.status !== 'concluido' && o.status !== 'cancelado';
    }).length;
    els.selectionCount.textContent = n ? fmt.plural(n, 'selecionado', 'selecionados') : '';
    els.bulkLabel.textContent = 'Concluir selecionados' + (completable ? ' (' + completable + ')' : '');
    var disabled = !completable || state.ordersState !== 'ready';
    els.bulk.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    els.bulk.title = disabled ? 'Selecione pedidos pendentes, em separação ou atrasados' : '';
  }

  function updateSortUI() {
    $$('thead th[data-col]', els.table).forEach(function (th) {
      var key = th.dataset.col;
      var on = state.sort.key === key;
      if (on) th.setAttribute('aria-sort', state.sort.dir === 'asc' ? 'ascending' : 'descending');
      else th.removeAttribute('aria-sort');
      var holder = $('[data-sort-icon]', th);
      holder.innerHTML = icon(on ? (state.sort.dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down');
    });
    els.sortSelect.value = state.sort.key + ':' + state.sort.dir;
    if (els.sortSelect.selectedIndex < 0) els.sortSelect.selectedIndex = 0;
  }

  function orderById(id) {
    return state.orders.filter(function (o) { return o.id === id; })[0];
  }

  function focusRowMenu(id) {
    var btns = $$('[data-row-menu="' + id + '"]', els.ordersBody).filter(function (b) { return b.offsetParent !== null; });
    if (btns[0]) btns[0].focus();
  }

  function completeOrders(ids, focusId) {
    var done = 0;
    ids.forEach(function (id) {
      var o = orderById(id);
      if (o && o.status !== 'concluido' && o.status !== 'cancelado') { o.status = 'concluido'; done += 1; }
      state.selected.delete(id);
    });
    renderOrders();
    if (focusId) focusRowMenu(focusId);
    CO.announce(done ? fmt.plural(done, 'pedido marcado', 'pedidos marcados') + ' como concluído' + (done === 1 ? '' : 's') + '.' : 'Nenhum pedido alterado.');
  }

  function cancelOrder(o) {
    o.status = 'cancelado';
    state.selected.delete(o.id);
    renderOrders();
    focusRowMenu(o.id);
    CO.announce('Pedido de ' + o.cliente + ' cancelado.');
  }

  function openOrder(o) {
    var canComplete = o.status !== 'concluido' && o.status !== 'cancelado';
    var actions = [{ label: 'Fechar', variant: 'secondary' }];
    if (canComplete) actions.push({ label: 'Marcar como concluído', variant: 'primary', onClick: function () { completeOrders([o.id]); } });
    CO.dialog.open({
      title: 'Pedido #' + o.id,
      subtitle: o.cliente,
      size: 'sm',
      body: '<dl class="details">' +
        '<div><dt>Cliente</dt><dd>' + esc(o.cliente) + '</dd></div>' +
        '<div><dt>Status</dt><dd>' + orderBadge(o) + '</dd></div>' +
        '<div><dt>Valor</dt><dd>' + fmt.brl(o.valor) + '</dd></div>' +
        '<div><dt>Data</dt><dd>' + fmt.dateTimeLong(o.data) + '</dd></div>' +
        '<div><dt>Itens</dt><dd>' + o.itens + '</dd></div>' +
        '<div><dt>Canal</dt><dd>' + esc(o.canal) + '</dd></div>' +
        '</dl>',
      actions: actions,
      fallbackFocus: function () {
        return $$('[data-row-menu="' + o.id + '"]', els.ordersBody).filter(function (b) { return b.offsetParent !== null; })[0];
      }
    });
  }

  function confirmCancel(o) {
    CO.dialog.open({
      title: 'Cancelar pedido?',
      subtitle: 'Pedido #' + o.id + ' · ' + o.cliente,
      size: 'sm',
      body: '<p>O pedido de <strong>' + esc(o.cliente) + '</strong> (' + fmt.brl(o.valor) + ') será marcado como cancelado. Esta é uma demonstração: nenhum dado real é alterado.</p>',
      actions: [
        { label: 'Voltar', variant: 'secondary' },
        { label: 'Cancelar pedido', variant: 'danger', onClick: function () { cancelOrder(o); } }
      ],
      fallbackFocus: function () {
        return $$('[data-row-menu="' + o.id + '"]', els.ordersBody).filter(function (b) { return b.offsetParent !== null; })[0];
      }
    });
  }

  function rowMenuEntries(o) {
    var closed = o.status === 'concluido' || o.status === 'cancelado';
    return [
      { label: 'Ver detalhes', icon: 'eye', onSelect: function () { openOrder(o); } },
      { label: 'Marcar como concluído', icon: 'circle-check', disabled: closed, onSelect: function () { completeOrders([o.id], o.id); } },
      { separator: true },
      { label: 'Cancelar pedido', icon: 'ban', danger: true, disabled: closed, onSelect: function () { confirmCancel(o); } }
    ];
  }

  function bindOrders() {
    els.ordersBody.addEventListener('change', function (e) {
      var cb = e.target.closest('[data-select]');
      if (!cb) return;
      if (cb.checked) state.selected.add(cb.dataset.select);
      else state.selected.delete(cb.dataset.select);
      updateSelectionUI(visibleOrders());
    });
    function toggleAll(e) {
      var list = visibleOrders();
      list.forEach(function (o) {
        if (e.target.checked) state.selected.add(o.id);
        else state.selected.delete(o.id);
      });
      updateSelectionUI(list);
    }
    els.selectAll.addEventListener('change', toggleAll);
    els.selectAllM.addEventListener('change', toggleAll);

    els.ordersBody.addEventListener('click', function (e) {
      var mb = e.target.closest('[data-row-menu]');
      if (mb) {
        var o = orderById(mb.dataset.rowMenu);
        if (o) CO.menu.open(mb, rowMenuEntries(o), { label: 'Ações do pedido de ' + o.cliente });
      }
    });
    els.ordersBody.addEventListener('keydown', function (e) {
      var mb = e.target.closest('[data-row-menu]');
      if (mb && e.key === 'ArrowDown') {
        e.preventDefault();
        var o = orderById(mb.dataset.rowMenu);
        if (o) CO.menu.open(mb, rowMenuEntries(o), { label: 'Ações do pedido de ' + o.cliente });
      }
    });

    els.table.querySelector('thead').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sort]');
      if (!b) return;
      var key = b.dataset.sort;
      if (state.sort.key === key) state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
      else state.sort = { key: key, dir: SORT_DEFAULT_DIR[key] };
      renderOrders();
      var nb = $('[data-sort="' + key + '"]', els.table);
      if (nb) nb.focus();
      CO.announce('Ordenado por ' + SORT_LABEL[key] + ', ' + (state.sort.dir === 'asc' ? 'crescente' : 'decrescente') + '.');
    });
    els.sortSelect.addEventListener('change', function () {
      var p = els.sortSelect.value.split(':');
      state.sort = { key: p[0], dir: p[1] };
      renderOrders();
    });

    els.search.addEventListener('input', function () {
      state.query = els.search.value;
      var ids = visibleOrders().map(function (o) { return o.id; });
      state.selected.forEach(function (id) { if (ids.indexOf(id) < 0) state.selected.delete(id); });
      renderOrders();
    });
    els.search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && els.search.value) {
        e.preventDefault();
        els.search.value = '';
        state.query = '';
        renderOrders();
      }
    });

    els.bulk.addEventListener('click', function () {
      if (els.bulk.getAttribute('aria-disabled') === 'true') return;
      completeOrders(Array.from(state.selected));
    });
  }

  /* ---------- Alertas ---------- */
  function alertHTML(a, enter) {
    var s = SEV[a.sev];
    return '<li class="alert' + (enter ? ' alert--enter' : '') + '" data-id="' + a.id + '">' +
      '<div class="alert__top">' + badge(s.tone, s.icon, s.label) +
        '<span class="alert__time"><time datetime="' + a.time.toISOString() + '">' + fmt.hm(a.time) + '</time> · <span data-rel="' + a.time.getTime() + '">' + fmt.relative(a.time) + '</span></span>' +
      '</div>' +
      '<p class="alert__title">' + esc(a.title) + '</p>' +
      '<p class="alert__detail">' + esc(a.detail) + ' · ' + esc(a.source) + '</p>' +
      '</li>';
  }

  function renderAlertSummary() {
    var c = { critical: 0, warning: 0, info: 0, success: 0 };
    state.alerts.forEach(function (a) { c[a.sev] += 1; });
    els.sevSummary.innerHTML = Object.keys(SEV).map(function (k) {
      var s = SEV[k];
      return '<li class="sev sev--' + k + '">' + icon(s.icon) + '<span class="sev__num">' + fmt.int(c[k]) + '</span><span class="sev__label">' + s.plural + '</span></li>';
    }).join('');
    var label = state.alertsState === 'loading' ? '–' : String(state.alerts.length);
    $$('[data-alert-count]').forEach(function (el) { el.textContent = label; });
  }

  function renderAlertNotice() {
    if (state.online || state.reconnecting) {
      els.alertsNotice.innerHTML = '';
      return;
    }
    els.alertsNotice.innerHTML = '<div class="notice" role="alert">' + icon('wifi-off') +
      '<p><strong>Sem conexão.</strong> Novos alertas não chegam até a conexão voltar.</p>' +
      '<button type="button" class="btn btn--secondary btn--cp" data-action="reconnect">Reconectar</button></div>';
  }

  function renderAlerts() {
    els.alertList.setAttribute('aria-live', 'off');
    renderAlertSummary();
    renderAlertNotice();
    if (state.alertsState === 'loading') {
      els.alertList.innerHTML = '';
      els.alertsState.innerHTML = [1, 2, 3].map(function () {
        return '<div class="alert-skel" aria-hidden="true"><span class="skel" style="width:5rem;height:1.25rem"></span><span class="skel" style="width:85%"></span><span class="skel" style="width:60%"></span></div>';
      }).join('') + '<p class="sr-only">Carregando alertas…</p>';
    } else if (!state.alerts.length) {
      els.alertList.innerHTML = '';
      els.alertsState.innerHTML = '<div class="state">' + icon('bell') + '<p class="state__title">Nenhum alerta no momento.</p><p>Novos alertas aparecem aqui automaticamente, no topo da lista.</p></div>';
    } else {
      els.alertsState.innerHTML = '';
      els.alertList.innerHTML = state.alerts.map(function (a) { return alertHTML(a, false); }).join('');
    }
    hideNewPill();
    CO.fades.refresh();
    setTimeout(function () { els.alertList.setAttribute('aria-live', 'polite'); }, 300);
  }

  function pushAlert(a) {
    if (state.alertsState !== 'ready') return;
    state.alerts.unshift(a);
    var scroller = els.alertsBody;
    var prevTop = scroller.scrollTop;
    var scrolled = prevTop > 4 && scroller.scrollHeight > scroller.clientHeight;
    if (!state.alerts[1]) els.alertsState.innerHTML = '';
    els.alertList.insertAdjacentHTML('afterbegin', alertHTML(a, true));
    if (scrolled) {
      /* Sem "pular" o layout: mantém visível o que o usuário estava lendo */
      var li = els.alertList.firstElementChild;
      scroller.scrollTop = prevTop + li.offsetHeight;
      state.unseen += 1;
      showNewPill();
    }
    renderAlertSummary();
    if (!isAlertsVisible()) {
      state.unseen += scrolled ? 0 : 1;
      CO.announce('Novo alerta, ' + SEV[a.sev].label + ': ' + a.title);
    }
    CO.fades.refresh();
  }

  function showNewPill() {
    if (!state.unseen || !isAlertsVisible()) return;
    els.newPillLabel.textContent = state.unseen === 1 ? '1 novo alerta' : state.unseen + ' novos alertas';
    els.newPill.hidden = false;
  }

  function hideNewPill() {
    els.newPill.hidden = true;
  }

  function clearUnseen() {
    if (els.alertsBody.scrollTop <= 4) {
      state.unseen = 0;
      hideNewPill();
    } else {
      showNewPill();
    }
  }

  function updateRelativeTimes() {
    $$('[data-rel]', els.alertList).forEach(function (el) {
      el.textContent = fmt.relative(new Date(Number(el.dataset.rel)));
    });
  }

  /* ---------- Barra de status / conexão ---------- */
  function connInfo() {
    if (state.reconnecting) return { key: 'reconnecting', icon: 'wifi', label: 'Reconectando…' };
    if (state.online) return { key: 'online', icon: 'wifi', label: 'Conectado' };
    return { key: 'offline', icon: 'wifi-off', label: 'Sem conexão' };
  }

  function renderStatusbar() {
    var c = connInfo();
    var upd = state.lastUpdate ? fmt.hms(state.lastUpdate) : '—';
    els.sbConn.dataset.conn = c.key;
    els.sbConn.innerHTML = icon(c.icon, { className: 'conn-icon' }) + '<span>Conexão: <strong>' + c.label + '</strong></span>';
    els.sbUpdated.textContent = upd;
    if (state.lastUpdate) els.sbUpdated.setAttribute('datetime', state.lastUpdate.toISOString());
    els.brandMeta.dataset.conn = c.key;
    els.brandMeta.innerHTML = icon(c.icon, { className: 'conn-icon' }) + '<span>' + c.label + '</span><span aria-hidden="true">·</span><span>Atualizado ' +
      (state.lastUpdate ? fmt.hm(state.lastUpdate) : '—') + '</span>';
  }

  function tickClock() {
    els.sbClock.textContent = fmt.hms(new Date());
  }

  /* ---------- Atualização (carregando → pronto | erro) ---------- */
  function refresh(opts) {
    opts = opts || {};
    if (state.refreshing) return;
    state.refreshing = true;
    els.refreshBtn.setAttribute('aria-disabled', 'true');
    els.refreshLabel.textContent = 'Atualizando…';
    state.kpiLoading = true;
    state.statusState = 'loading';
    state.ordersState = 'loading';
    if (opts.initial) state.alertsState = 'loading';
    renderAll();
    setTimeout(function () {
      state.refreshing = false;
      state.kpiLoading = false;
      els.refreshBtn.setAttribute('aria-disabled', 'false');
      els.refreshLabel.textContent = 'Atualizar';
      if (!state.online) {
        state.statusState = 'error';
        state.ordersState = 'error';
        if (opts.initial) state.alertsState = 'ready';
        renderAll();
        CO.announce('Falha ao atualizar: sem conexão.');
        return;
      }
      state.statusState = 'ready';
      state.ordersState = 'ready';
      state.alertsState = 'ready';
      state.lastUpdate = new Date();
      renderAll();
      if (!opts.initial) CO.announce('Dados atualizados às ' + fmt.hm(state.lastUpdate) + '.');
    }, opts.initial ? 700 : 900);
  }

  function renderAll() {
    renderKpis();
    renderStatus();
    renderOrders();
    if (state.alertsState === 'loading' || !els.alertList.children.length || state.forceAlerts) {
      state.forceAlerts = false;
      renderAlerts();
    } else {
      renderAlertSummary();
      renderAlertNotice();
    }
    renderStatusbar();
  }

  /* ---------- Simulação em tempo real ---------- */
  function drift() {
    var prev = {};
    Object.keys(GROUPS).forEach(function (g) {
      prev[g] = state.status[g].map(function (it) { return levelOf(g, it); });
    });
    state.status.filas.forEach(function (it, i) {
      var b = baseStatus.filas[i];
      it.waiting = Math.max(0, Math.round(it.waiting + (b.waiting - it.waiting) * 0.15 + (Math.random() * 6 - 3)));
      it.maxWait = Math.max(1, Math.round(it.maxWait + (b.maxWait - it.maxWait) * 0.15 + (Math.random() * 4 - 2)));
    });
    state.status.sla.forEach(function (it, i) {
      var b = baseStatus.sla[i];
      it.value = Math.min(100, Math.max(60, Math.round((it.value + (b.value - it.value) * 0.15 + (Math.random() * 0.8 - 0.4)) * 10) / 10));
    });
    state.status.equipes.forEach(function (it, i) {
      var b = baseStatus.equipes[i];
      if (Math.random() < 0.15) {
        var dir = it.online < b.online ? 1 : it.online > b.online ? -1 : Math.random() < 0.5 ? -1 : 1;
        it.online = Math.min(it.total, Math.max(0, it.online + dir));
      }
    });
    /* Mudanças de nível geram alertas */
    Object.keys(GROUPS).forEach(function (g) {
      state.status[g].forEach(function (it, i) {
        var now = levelOf(g, it), before = prev[g][i];
        if (now === before) return;
        var worse = LEVEL[now].rank > LEVEL[before].rank;
        var sev = worse ? (now === 'critico' ? 'critical' : 'warning') : 'success';
        var subject = GROUPS[g].noun + ' ' + it.name;
        var title = worse
          ? subject + (now === 'critico' ? ' em nível crítico' : ' em atenção')
          : subject + (now === 'normal' ? ' normalizado' : ' saiu do nível crítico');
        if (g === 'filas' || g === 'equipes') title = title.replace('normalizado', 'normalizada');
        pushAlert({ id: D.alertId(), time: new Date(), sev: sev, title: title, detail: GROUPS[g].metric(it), source: g === 'sla' ? 'SLA' : g === 'filas' ? 'Filas' : 'Equipes' });
      });
    });
  }

  function realtimeTick() {
    if (document.hidden || !state.online || state.reconnecting || state.statusState !== 'ready') return;
    if (!state.emptied) drift();
    state.lastUpdate = new Date();
    renderStatus();
    renderStatusbar();
  }

  function scheduleRandomAlert() {
    setTimeout(function () {
      if (!document.hidden && state.online && !state.reconnecting && state.alertsState === 'ready') pushAlert(D.randomAlert());
      scheduleRandomAlert();
    }, 25000 + Math.random() * 20000);
  }

  function setOnline(on) {
    if (on) {
      state.reconnecting = true;
      renderStatusbar();
      renderAlertNotice();
      CO.announce('Reconectando…');
      setTimeout(function () {
        state.reconnecting = false;
        state.online = true;
        renderStatusbar();
        renderAlertNotice();
        CO.announce('Conexão restabelecida.');
        state.refreshing = false;
        refresh();
      }, 1000);
    } else {
      state.online = false;
      state.reconnecting = false;
      renderStatusbar();
      renderAlertNotice();
      CO.announce('Conexão perdida.');
      refresh();
    }
  }

  function setEmpty(empty) {
    state.emptied = empty;
    state.selected.clear();
    if (empty) {
      state.orders = [];
      state.alerts = [];
      state.status = { filas: [], sla: [], equipes: [] };
    } else {
      state.orders = D.orders();
      state.alerts = D.seedAlerts();
      state.status = D.status();
      state.query = '';
      els.search.value = '';
    }
    state.forceAlerts = true;
    renderAll();
    CO.announce(empty ? 'Dados esvaziados para demonstrar o estado vazio.' : 'Dados de exemplo restaurados.');
  }

  function simEntries() {
    return [
      { label: 'Gerar novo alerta', icon: 'bell', disabled: !state.online || state.alertsState !== 'ready', onSelect: function () { pushAlert(D.randomAlert()); } },
      state.online
        ? { label: 'Simular falha de conexão', icon: 'wifi-off', onSelect: function () { setOnline(false); } }
        : { label: 'Restabelecer conexão', icon: 'wifi', onSelect: function () { setOnline(true); } },
      state.emptied
        ? { label: 'Restaurar dados de exemplo', icon: 'rotate-ccw', onSelect: function () { setEmpty(false); } }
        : { label: 'Esvaziar dados (estado vazio)', icon: 'inbox', onSelect: function () { setEmpty(true); } }
    ];
  }

  /* ---------- Ações delegadas e atalhos ---------- */
  function onAction(e) {
    var b = e.target.closest('[data-action]');
    if (!b) return;
    var a = b.dataset.action;
    if (a === 'retry') refresh();
    else if (a === 'reconnect') setOnline(true);
    else if (a === 'restore') setEmpty(false);
    else if (a === 'clear-search') {
      els.search.value = '';
      state.query = '';
      renderOrders();
      els.search.focus();
    }
  }

  function focusSearch() {
    if (state.mode === 'mobile' && state.mtab !== 'pedidos') selectMtab('pedidos');
    if (state.mode === 'compact' && state.view !== 'painel') selectView('painel');
    els.search.focus();
  }

  function onShortcut(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    if (CO.dialog.isOpen() || CO.menu.isOpen()) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      if (els.refreshBtn.getAttribute('aria-disabled') !== 'true') refresh();
    } else if (e.key === '/') {
      e.preventDefault();
      focusSearch();
    }
  }

  /* ---------- Inicialização ---------- */
  function init() {
    $$('[data-icon]').forEach(function (el) {
      el.outerHTML = icon(el.dataset.icon, { size: Number(el.dataset.size) || 16, className: el.className });
    });
    els = {
      app: $('#app'),
      content: $('#content'),
      panel: $('#panel'),
      main: $('#main'),
      viewTabs: $('#view-tabs'),
      mobileTabs: $('#mobile-tabs'),
      secKpis: $('#sec-indicadores'),
      secOp: $('#sec-operacao'),
      secOrders: $('#sec-pedidos'),
      kpis: $('#kpis'),
      kpisHl: $('#kpis-hl'),
      kpisBlocks: $('#kpis-blocks'),
      overall: $('#overall'),
      statusGrid: $('#status-grid'),
      ordersSummary: $('#orders-summary'),
      ordersBody: $('#orders-body'),
      ordersState: $('#orders-state'),
      tableScroll: $('#table-scroll'),
      table: $('#orders-table'),
      tbody: $('#orders-tbody'),
      orderCards: $('#order-cards'),
      selectAll: $('#select-all'),
      selectAllM: $('#select-all-m'),
      selectionCount: $('#selection-count'),
      bulk: $('#bulk-complete'),
      bulkLabel: $('#bulk-label'),
      search: $('#order-search'),
      sortSelect: $('#order-sort'),
      sevSummary: $('#sev-summary'),
      alertsBody: $('#alerts-body'),
      alertList: $('#alert-list'),
      alertsState: $('#alerts-state'),
      alertsNotice: $('#alerts-notice'),
      newPill: $('#new-pill'),
      newPillLabel: $('#new-pill-label'),
      sbConn: $('#sb-conn'),
      sbUpdated: $('#sb-updated'),
      sbClock: $('#sb-clock'),
      brandMeta: $('#brand-meta'),
      refreshBtn: $('#refresh-btn'),
      refreshLabel: $('#refresh-label'),
      simBtn: $('#sim-btn')
    };

    CO.tabs(els.viewTabs, selectView);
    CO.tabs(els.mobileTabs, selectMtab);
    CO.menu.bindTrigger(els.simBtn, simEntries, { label: 'Simular eventos (demonstração)' });
    els.refreshBtn.addEventListener('click', function () {
      if (els.refreshBtn.getAttribute('aria-disabled') !== 'true') refresh();
    });
    els.newPill.addEventListener('click', function () {
      els.alertsBody.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      state.unseen = 0;
      hideNewPill();
      var first = els.alertList.firstElementChild;
      if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
    });
    els.alertsBody.addEventListener('scroll', function () {
      if (els.alertsBody.scrollTop <= 4 && state.unseen) { state.unseen = 0; hideNewPill(); }
    }, { passive: true });

    bindKpis();
    bindOrders();
    document.addEventListener('click', onAction);
    document.addEventListener('keydown', onShortcut);
    Object.keys(MQ).forEach(function (k) {
      var m = MQ[k];
      if (m.addEventListener) m.addEventListener('change', applyMode);
      else m.addListener(applyMode);
    });

    applyMode();
    tickClock();
    setInterval(tickClock, 1000);
    setInterval(realtimeTick, 10000);
    setInterval(updateRelativeTimes, 30000);
    scheduleRandomAlert();
    refresh({ initial: true });

    /* Ganchos para testes automatizados */
    CO.debug = { state: state, pushAlert: pushAlert, refresh: refresh, setOnline: setOnline, setEmpty: setEmpty, drift: drift };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
