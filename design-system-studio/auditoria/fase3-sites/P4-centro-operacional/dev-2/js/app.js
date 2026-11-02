/* ==========================================================================
   Centro Operacional — lógica da tela (render, tempo real simulado, interações)
   ========================================================================== */
(function () {
  'use strict';
  const CO = window.CO;
  const fmt = CO.fmt;
  const ui = CO.ui;
  const icon = ui.icon;
  const esc = fmt.esc;
  const { rnd, rint, clamp } = CO.math;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const state = {
    live: true,
    net: navigator.onLine !== false,
    sim: 'normal', // normal | loading | empty | error
    boot: true,
    filter: '',
    sort: { key: 'data', dir: 'desc' },
    selected: new Set(),
    alertFilter: 'all',
    lastUpdate: new Date(),
    reportKpi: CO.kpis[0].id,
    maxAlerts: 40,
  };
  const shell = $('#shell');

  /* ======================================================================
     Conexão / relógio / última atualização
     ====================================================================== */
  function connState() {
    if (!state.net || state.sim === 'error') return 'offline';
    return state.live ? 'online' : 'paused';
  }
  function renderConn() {
    const s = connState();
    const map = {
      online: ['wifi', 'Conectado'],
      paused: ['pause', 'Pausado'],
      offline: ['wifi-off', 'Sem conexão'],
    };
    const el = $('#conn');
    el.dataset.state = s;
    el.querySelector('use').setAttribute('href', '#i-' + map[s][0]);
    $('#conn-text').textContent = map[s][1];

    const live = $('#btn-live');
    live.querySelector('use').setAttribute('href', '#i-' + (state.live ? 'pause' : 'play'));
    live.querySelector('.btn-label').textContent = state.live ? 'Pausar' : 'Retomar';
    live.setAttribute('aria-label', state.live ? 'Pausar atualização em tempo real' : 'Retomar atualização em tempo real');
  }
  function renderClock() {
    const d = new Date();
    const c = $('#clock');
    c.textContent = fmt.timeS(d);
    c.setAttribute('datetime', d.toISOString());
    $('#sb-date').textContent = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
  }
  function renderLastUpdate() {
    const t = $('#last-update');
    t.textContent = fmt.timeS(state.lastUpdate);
    t.setAttribute('datetime', state.lastUpdate.toISOString());
  }

  /* ======================================================================
     Indicadores (KPIs)
     ====================================================================== */
  function trendOf(k) {
    const d = CO.kpiDelta(k);
    const flat = Math.abs(d) < 0.5;
    const up = d > 0;
    const tone = flat ? 'flat' : up === (k.good === 'up') ? 'good' : 'bad';
    return { d, tone, arrow: flat ? 'minus' : up ? 'arrow-up' : 'arrow-down', sr: flat ? 'estável: ' : up ? 'alta de ' : 'queda de ' };
  }
  function sparkPoints(values) {
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const span = max - min || 1;
    return values.map((v, i) => [(i / (values.length - 1)) * 100, 25 - ((v - min) / span) * 22]);
  }
  function kpiHTML(k) {
    return (
      '<button type="button" class="kpi" data-kpi="' + k.id + '" aria-haspopup="dialog">' +
      '<span class="kpi-head"><span class="kpi-label">' + esc(k.label) + '</span>' + icon(k.icon) + '</span>' +
      '<span class="kpi-value" data-f="value"></span>' +
      '<span class="kpi-delta"><span class="delta" data-f="delta"></span><span class="kpi-cmp">' + esc(k.cmp) + '</span></span>' +
      '<span class="spark" data-f="spark"><svg viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true" focusable="false"><polyline points=""/></svg>' +
      '<span class="spark-dot"></span><span class="spark-cursor"></span><span class="tip" role="tooltip" hidden></span></span>' +
      '<span class="sr-only" data-f="sr"></span>' +
      '</button>'
    );
  }
  function updateKpi(k) {
    const card = $('[data-kpi="' + k.id + '"]');
    if (!card) return;
    const t = trendOf(k);
    $('[data-f="value"]', card).textContent = CO.kpiFormat(k, k.value);
    const dl = $('[data-f="delta"]', card);
    dl.className = 'delta delta--' + t.tone;
    dl.innerHTML = icon(t.arrow) + '<span class="sr-only">' + t.sr + '</span><span>' + fmt.delta(t.d) + '</span>';
    const sp = $('[data-f="spark"]', card);
    sp.className = 'spark spark--' + t.tone;
    const pts = sparkPoints(k.series);
    $('polyline', sp).setAttribute('points', pts.map((p) => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' '));
    const last = pts[pts.length - 1];
    const dot = $('.spark-dot', sp);
    dot.style.left = last[0] + '%';
    dot.style.top = (last[1] / 28) * 100 + '%';
    const mn = Math.min.apply(null, k.series), mx = Math.max.apply(null, k.series);
    $('[data-f="sr"]', card).textContent =
      'Tendência: mínimo ' + CO.kpiFormat(k, mn) + ', máximo ' + CO.kpiFormat(k, mx) + '. Abre o relatório detalhado.';
    if (k._tip != null) showTip(card, k, k._tip);
  }
  function showTip(card, k, idx) {
    idx = clamp(idx, 0, k.series.length - 1);
    k._tip = idx;
    const sp = $('[data-f="spark"]', card);
    const tip = $('.tip', sp);
    const cur = $('.spark-cursor', sp);
    const p = sparkPoints(k.series)[idx];
    tip.hidden = false;
    tip.textContent = CO.kpiFormat(k, k.series[idx]) + ' · ' + k.labels[idx];
    const w = sp.clientWidth;
    const x = (p[0] / 100) * w;
    tip.style.left = clamp(x - tip.offsetWidth / 2, -8, Math.max(-8, w - tip.offsetWidth + 8)) + 'px';
    cur.style.left = p[0] + '%';
    cur.style.top = (p[1] / 28) * 100 + '%';
    cur.classList.add('on');
  }
  function hideTip(card, k) {
    k._tip = null;
    const sp = $('[data-f="spark"]', card);
    $('.tip', sp).hidden = true;
    $('.spark-cursor', sp).classList.remove('on');
  }
  function renderKpis() {
    const grid = $('#kpi-grid');
    grid.innerHTML = CO.kpis.map(kpiHTML).join('');
    CO.kpis.forEach(updateKpi);
    CO.kpis.forEach((k) => {
      const card = $('[data-kpi="' + k.id + '"]', grid);
      const sp = $('[data-f="spark"]', card);
      sp.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const r = sp.getBoundingClientRect();
        showTip(card, k, Math.round(((e.clientX - r.left) / r.width) * (k.series.length - 1)));
      });
      sp.addEventListener('pointerleave', () => { if (document.activeElement !== card) hideTip(card, k); });
      card.addEventListener('focus', () => { if (card.matches(':focus-visible')) showTip(card, k, k.series.length - 1); });
      card.addEventListener('blur', () => hideTip(card, k));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const cur = k._tip == null ? k.series.length - 1 : k._tip;
          showTip(card, k, cur + (e.key === 'ArrowRight' ? 1 : -1));
        }
      });
      card.addEventListener('click', () => openReport(k.id));
    });
  }
  function tickKpis() {
    CO.kpis.forEach((k) => {
      if (!k.live) return;
      if (k.id === 'sla') k.value = clamp(k.value + rnd(-0.18, 0.18), 93, 99.4);
      else if (k.id === 'concluidos') k.value += rint(0, 4);
      else if (k.id === 'espera') k.value = clamp(k.value + rint(-8, 8) + (k.base - k.value) * 0.05, 160, 460);
      k.series.push(k.value); k.series.shift();
      k.labels.push(fmt.timeS(new Date())); k.labels.shift();
      updateKpi(k);
    });
    if ($('#dialog').open && $('#rep-kpi')) renderReportBody(state.reportKpi);
  }

  /* ======================================================================
     Blocos de status: filas, SLA, equipes
     ====================================================================== */
  function badge(level) {
    const L = CO.levels[level];
    return '<span class="badge badge--' + L.tone + '">' + icon(L.icon) + L.label + '</span>';
  }
  function opsHTML() {
    const q = CO.queues, s = CO.sla, t = CO.teams;
    const qLv = q.map(CO.levelQueue), sLv = s.map(CO.levelSla), tLv = t.map(CO.levelTeam);
    const block = (id, ico, title, lv, rows) =>
      '<article class="stat-block" aria-labelledby="blk-' + id + '"><div class="stat-head"><h3 class="stat-title" id="blk-' + id + '">' + icon(ico) + title + '</h3>' +
      badge(CO.worst(lv)) + '</div><ul class="stat-list">' + rows + '</ul></article>';
    const filas = q.map((x, i) =>
      '<li class="stat-row"><span class="name">' + esc(x.name) + '</span><span class="detail">' + x.waiting + ' na fila · espera ' + fmt.mmss(x.wait) + '</span>' + badge(qLv[i]) + '</li>').join('');
    const sla = s.map((x, i) => {
      const tone = CO.levels[sLv[i]].tone;
      const w = clamp(((x.value - 80) / 20) * 100, 0, 100);
      const m = clamp(((x.meta - 80) / 20) * 100, 0, 100);
      return '<li class="stat-row"><span class="name">' + esc(x.name) + '</span>' +
        '<span class="detail detail--bar"><span class="bar bar--' + tone + '" role="meter" aria-valuemin="80" aria-valuemax="100" aria-valuenow="' + x.value.toFixed(1) + '" aria-label="SLA ' + esc(x.name.toLowerCase()) + '"><span style="width:' + w.toFixed(1) + '%"></span><i class="bar-meta" style="left:' + m.toFixed(1) + '%"></i></span><span class="bar-text">' + fmt.pct(x.value) + ' · meta ' + fmt.pct(x.meta) + '</span></span>' +
        badge(sLv[i]) + '</li>';
    }).join('');
    const eq = t.map((x, i) =>
      '<li class="stat-row"><span class="name">' + esc(x.name) + '</span><span class="detail">' + x.online + ' de ' + x.total + ' agentes online</span>' + badge(tLv[i]) + '</li>').join('');
    return block('filas', 'list-ordered', 'Filas', qLv, filas) + block('sla', 'gauge', 'SLA', sLv, sla) + block('equipes', 'users', 'Equipes', tLv, eq);
  }
  function renderOps() { $('#ops-grid').innerHTML = opsHTML(); }
  function tickOps() {
    CO.queues.forEach((q) => {
      q.base = q.base || q.wait;
      q.wait = clamp(Math.round(q.wait + rint(-14, 14) + (q.base - q.wait) * 0.12), 25, 420);
      q.waiting = clamp(q.waiting + rint(-2, 2), 0, 45);
    });
    CO.sla.forEach((s) => {
      s.base = s.base || s.value;
      s.value = clamp(s.value + rnd(-0.25, 0.25) + (s.base - s.value) * 0.1, 90, 99.5);
    });
    CO.teams.forEach((t) => {
      if (Math.random() < 0.25) t.online = clamp(t.online + (Math.random() < 0.5 ? -1 : 1), 0, t.total);
    });
    renderOps();
  }

  /* ======================================================================
     Pedidos recentes (tabela)
     ====================================================================== */
  const cmp = {
    cliente: (a, b) => a.cliente.localeCompare(b.cliente, 'pt-BR'),
    status: (a, b) => CO.statuses[a.status].label.localeCompare(CO.statuses[b.status].label, 'pt-BR'),
    valor: (a, b) => a.valor - b.valor,
    data: (a, b) => a.data - b.data,
  };
  function visibleOrders() {
    const q = state.filter.trim().toLowerCase();
    const rows = CO.orders.filter((o) => !q || o.cliente.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    const f = cmp[state.sort.key];
    rows.sort((a, b) => (state.sort.dir === 'asc' ? 1 : -1) * f(a, b));
    return rows;
  }
  function stateBlock(el, kind, opts) {
    el.hidden = false;
    el.className = 'state state--' + kind;
    el.removeAttribute('aria-busy');
    if (kind === 'loading') {
      el.setAttribute('role', 'status');
      el.setAttribute('aria-busy', 'true');
      el.innerHTML = '<span class="sr-only">' + esc(opts.title) + '</span>' +
        '<span class="skel"></span><span class="skel skel--s"></span><span class="skel"></span><span class="skel skel--s"></span>';
      return;
    }
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.innerHTML = icon(kind === 'error' ? 'circle-alert' : 'inbox') +
      '<p class="state-title">' + esc(opts.title) + '</p><p>' + esc(opts.text) + '</p>' +
      (opts.action ? '<button class="btn btn--secondary" type="button" data-action="' + opts.action[0] + '">' + esc(opts.action[1]) + '</button>' : '');
  }
  function rowHTML(o) {
    const S = CO.statuses[o.status];
    const sel = state.selected.has(o.id);
    const who = o.id + ' de ' + o.cliente;
    return (
      '<tr role="row" data-id="' + o.id + '"' + (sel ? ' data-selected' : '') + '>' +
      '<td role="cell" class="col-check"><label class="check"><input type="checkbox" data-row-check="' + o.id + '"' + (sel ? ' checked' : '') + ' aria-label="Selecionar pedido ' + esc(who) + '"></label></td>' +
      '<th scope="row" role="rowheader" class="cell-client" data-label="Cliente">' + esc(o.cliente) + '<span class="cell-id">' + o.id + '</span></th>' +
      '<td role="cell" data-label="Status"><span class="badge badge--' + S.tone + '">' + icon(S.icon) + S.label + '</span></td>' +
      '<td role="cell" class="num" data-label="Valor">' + fmt.brl(o.valor) + '</td>' +
      '<td role="cell" data-label="Data">' + fmt.date(o.data) + '</td>' +
      '<td role="cell" class="col-actions"><button class="btn btn--ghost btn--icon" type="button" data-act="' + o.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Ações do pedido ' + esc(who) + '">' + icon('ellipsis-vertical') + '</button></td>' +
      '</tr>'
    );
  }
  function renderTable(focusAct) {
    const tbl = $('#tbl');
    const st = $('#table-state');
    const mode = state.boot ? 'loading' : state.sim;
    let rows = [];
    if (mode === 'loading') {
      tbl.hidden = true;
      stateBlock(st, 'loading', { title: 'Carregando pedidos…' });
    } else if (mode === 'error') {
      tbl.hidden = true;
      stateBlock(st, 'error', { title: 'Não foi possível carregar os pedidos', text: 'Verifique a conexão e tente novamente.', action: ['retry', 'Tentar novamente'] });
    } else {
      rows = mode === 'empty' ? [] : visibleOrders();
      if (!rows.length) {
        tbl.hidden = true;
        if (mode !== 'empty' && state.filter.trim()) {
          stateBlock(st, 'empty', { title: 'Nenhum pedido encontrado', text: 'Nada corresponde a “' + state.filter.trim() + '”.', action: ['clear-filter', 'Limpar filtro'] });
        } else {
          stateBlock(st, 'empty', { title: 'Nenhum pedido no período', text: 'Novos pedidos aparecem aqui assim que forem registrados.' });
        }
      } else {
        st.hidden = true;
        tbl.hidden = false;
      }
    }
    $('#tbody').innerHTML = rows.map(rowHTML).join('');
    updateSortUI();
    updateSelectionUI(rows);
    renderSummary(mode === 'normal' ? rows : []);
    if (focusAct) { const b = $('[data-act="' + focusAct + '"]'); if (b) b.focus(); }
  }
  function renderSummary(rows) {
    const total = rows.reduce((s, o) => s + (o.status === 'cancelled' ? 0 : o.valor), 0);
    const open = rows.filter((o) => o.status !== 'paid' && o.status !== 'cancelled').length;
    const sel = state.selected.size;
    $('#data-sub').textContent = rows.length
      ? rows.length + (rows.length === 1 ? ' pedido' : ' pedidos') + ' · ' + fmt.brl(total) + (sel ? ' · ' + sel + (sel === 1 ? ' selecionado' : ' selecionados') : '')
      : 'Dados operacionais';
    $('#data-summary').setAttribute('role', 'group');
    $('#data-summary').innerHTML =
      '<div class="sum"><span class="sum-label">Pedidos recentes</span><span class="sum-value">' + rows.length + '</span></div>' +
      '<div class="sum"><span class="sum-label">Valor total</span><span class="sum-value">' + fmt.brlCompact(total) + '</span></div>' +
      '<div class="sum"><span class="sum-label">Em aberto</span><span class="sum-value">' + open + '</span></div>';
  }
  function updateSortUI() {
    $$('#tbl thead th[data-col]').forEach((th) => {
      const on = th.dataset.col === state.sort.key;
      th.setAttribute('aria-sort', on ? (state.sort.dir === 'asc' ? 'ascending' : 'descending') : 'none');
      th.querySelector('use').setAttribute('href', '#i-' + (on ? (state.sort.dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'));
    });
    const sel = $('#sort-m');
    const v = state.sort.key + ':' + state.sort.dir;
    if ($('option[value="' + v + '"]', sel)) sel.value = v;
  }
  function updateSelectionUI(rows) {
    rows = rows || (state.sim === 'normal' ? visibleOrders() : []);
    const n = rows.filter((o) => state.selected.has(o.id)).length;
    ['#chk-all', '#chk-all-m'].forEach((id) => {
      const c = $(id);
      c.checked = rows.length > 0 && n === rows.length;
      c.indeterminate = n > 0 && n < rows.length;
      c.disabled = rows.length === 0;
    });
    const total = state.selected.size;
    $('#btn-export-label').textContent = total ? 'Exportar seleção (' + total + ')' : 'Exportar CSV';
    $('#btn-export').setAttribute('aria-label', total ? 'Exportar ' + total + ' pedidos selecionados em CSV' : 'Exportar pedidos em CSV');
  }

  function download(name, text) {
    const blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const csvCell = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  function stamp() { const d = new Date(); return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
  function exportOrders() {
    let rows = visibleOrders();
    if (state.selected.size) rows = rows.filter((o) => state.selected.has(o.id));
    if (!rows.length || state.sim !== 'normal') { ui.toast('Não há pedidos para exportar.', 'warning'); return; }
    const head = ['Código', 'Cliente', 'Status', 'Valor', 'Data'].join(';');
    const body = rows.map((o) => [o.id, o.cliente, CO.statuses[o.status].label, o.valor.toFixed(2).replace('.', ','), fmt.date(o.data)].map(csvCell).join(';'));
    download('pedidos-' + stamp() + '.csv', [head].concat(body).join('\r\n'));
    ui.toast(rows.length + (rows.length === 1 ? ' pedido exportado' : ' pedidos exportados') + ' em CSV.', 'success');
  }

  function orderMenu(btn) {
    const o = CO.orders.find((x) => x.id === btn.dataset.act);
    ui.menu(btn, [
      { label: 'Ver detalhes', icon: 'eye', onSelect: () => openOrder(o) },
      { label: 'Marcar como pago', icon: 'circle-check', disabled: o.status === 'paid' || o.status === 'cancelled',
        onSelect: () => { o.status = 'paid'; renderTable(o.id); ui.toast('Pedido ' + o.id + ' marcado como pago.', 'success'); } },
      { label: 'Cancelar pedido', icon: 'ban', disabled: o.status === 'cancelled',
        onSelect: () => { o.status = 'cancelled'; renderTable(o.id); ui.toast('Pedido ' + o.id + ' cancelado.', 'warning'); } },
    ], { label: 'Ações do pedido ' + o.id, title: o.id + ' · ' + o.cliente });
  }
  function openOrder(o) {
    const S = CO.statuses[o.status];
    ui.dialogOpen({
      title: 'Pedido ' + o.id,
      body: '<dl class="dl"><dt>Cliente</dt><dd>' + esc(o.cliente) + '</dd><dt>Código</dt><dd>' + o.id + '</dd><dt>Status</dt><dd><span class="badge badge--' + S.tone + '">' + icon(S.icon) + S.label + '</span></dd><dt>Valor</dt><dd>' + fmt.brl(o.valor) + '</dd><dt>Data</dt><dd>' + fmt.date(o.data) + ' às ' + fmt.time(o.data) + '</dd></dl>',
      footer: [ui.button('Fechar', 'btn--primary', null, ui.dialogClose)],
    });
  }

  /* ======================================================================
     Alertas
     ====================================================================== */
  function alertHTML(a, isNew) {
    const S = CO.severities[a.sev];
    return (
      '<li class="alert alert--' + a.sev + (isNew ? ' is-new' : '') + '" data-id="' + a.id + '">' + icon(S.icon) +
      '<div><div class="alert-top"><span class="alert-sev">' + S.label + '</span><time class="alert-time" datetime="' + a.at.toISOString() + '">' + fmt.time(a.at) + '</time></div>' +
      '<p class="alert-title">' + esc(a.title) + '</p><p class="alert-desc">' + esc(a.desc) + '</p></div></li>'
    );
  }
  function alertCounts() {
    const c = { all: CO.alerts.length, critical: 0, warning: 0, info: 0 };
    CO.alerts.forEach((a) => c[a.sev]++);
    $$('[data-n]').forEach((el) => { el.textContent = c[el.dataset.n]; });
    $$('[data-alert-count]').forEach((el) => { el.textContent = c.all > 99 ? '99+' : c.all; });
  }
  function renderAlerts() {
    const list = $('#alert-list');
    const st = $('#alerts-state');
    const mode = state.boot ? 'loading' : state.sim;
    list.setAttribute('aria-live', 'off');
    alertCounts();
    $$('#alert-filters [data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === state.alertFilter)));
    const rows = CO.alerts.filter((a) => state.alertFilter === 'all' || a.sev === state.alertFilter);
    if (mode === 'loading') { list.hidden = true; stateBlock(st, 'loading', { title: 'Carregando alertas…' }); }
    else if (mode === 'error') { list.hidden = true; stateBlock(st, 'error', { title: 'Alertas indisponíveis', text: 'A conexão foi perdida. Os alertas voltam quando ela for restabelecida.', action: ['retry', 'Tentar novamente'] }); }
    else if (mode === 'empty' || !rows.length) {
      list.hidden = true;
      if (mode !== 'empty' && state.alertFilter !== 'all') stateBlock(st, 'empty', { title: 'Nenhum alerta nesta severidade', text: 'Tudo certo por aqui.', action: ['all-alerts', 'Ver todos os alertas'] });
      else stateBlock(st, 'empty', { title: 'Nenhum alerta ativo', text: 'Novos alertas aparecem aqui em tempo real.' });
    } else { st.hidden = true; list.hidden = false; }
    list.innerHTML = mode === 'normal' ? rows.map((a) => alertHTML(a, false)).join('') : '';
    requestAnimationFrame(() => list.setAttribute('aria-live', 'polite'));
  }
  function pushAlert(a) {
    CO.alerts.unshift(a);
    let removed = false;
    if (CO.alerts.length > state.maxAlerts) { CO.alerts.pop(); removed = true; }
    alertCounts();
    const list = $('#alert-list');
    if (list.hidden || state.sim !== 'normal') return;
    if (state.alertFilter !== 'all' && a.sev !== state.alertFilter) return;
    const sc = $('#alerts-scroll .scroll-body');
    const before = list.scrollHeight;
    list.insertAdjacentHTML('afterbegin', alertHTML(a, true));
    if (removed && list.lastElementChild) list.lastElementChild.remove();
    // sem "pular" o layout: quem está lendo mais abaixo continua na mesma posição
    if (sc.scrollTop > 0) sc.scrollTop += list.scrollHeight - before;
  }

  /* ======================================================================
     Tempo real simulado
     ====================================================================== */
  let alertIn = 3;
  function tick() {
    if (!state.live || connState() === 'offline' || state.boot || state.sim === 'loading') return;
    tickKpis();
    tickOps();
    state.lastUpdate = new Date();
    renderLastUpdate();
    if (--alertIn <= 0) { pushAlert(CO.nextAlert()); alertIn = rint(3, 5); }
  }
  function toggleLive() {
    state.live = !state.live;
    renderConn();
    ui.toast(state.live ? 'Atualização em tempo real retomada.' : 'Atualização em tempo real pausada.', state.live ? 'success' : 'info');
  }

  /* ======================================================================
     Estados simulados (carregando / vazio / erro)
     ====================================================================== */
  let simTimer = null;
  function setSim(mode, silent) {
    clearTimeout(simTimer);
    state.sim = mode;
    renderConn();
    renderTable();
    renderAlerts();
    if (mode === 'loading') simTimer = setTimeout(() => setSim('normal', true), 1800);
    if (!silent) {
      if (mode === 'error') ui.toast('Sem conexão com o servidor (simulado).', 'error');
      if (mode === 'empty') ui.toast('Exibindo o estado vazio (simulado).', 'info');
    }
  }
  function retry() {
    clearTimeout(simTimer);
    state.sim = 'loading';
    renderConn(); renderTable(); renderAlerts();
    simTimer = setTimeout(() => {
      state.sim = 'normal';
      renderConn(); renderTable(); renderAlerts();
      ui.toast('Conexão restabelecida.', 'success');
    }, 900);
  }
  function simMenu() {
    const item = (label, mode, ico) => ({ label, icon: ico, checked: state.sim === mode, onSelect: () => setSim(mode) });
    ui.menu($('#btn-sim'), [
      item('Normal', 'normal', 'circle-check'),
      item('Carregando', 'loading', 'loader'),
      item('Vazio', 'empty', 'inbox'),
      item('Erro de conexão', 'error', 'wifi-off'),
    ], { label: 'Simular estado da tela', title: 'Simular estado (tabela e alertas)' });
  }

  /* ======================================================================
     Relatório detalhado (diálogo)
     ====================================================================== */
  function axisFmt(k, v) {
    if (k.kind === 'receita' || k.kind === 'pct') return fmt.dec1(v);
    if (k.kind === 'sec') return fmt.mmss(v);
    return fmt.int(v);
  }
  function drawChart(host, k) {
    const W = Math.max(260, host.clientWidth);
    const H = 190;
    const m = { l: 46, r: 12, t: 12, b: 28 };
    const vals = k.series;
    let mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
    const pad = (mx - mn || 1) * 0.15;
    mn -= pad; mx += pad;
    const X = (i) => m.l + (i / (vals.length - 1)) * (W - m.l - m.r);
    const Y = (v) => m.t + (1 - (v - mn) / (mx - mn)) * (H - m.t - m.b);
    const NS = 'http://www.w3.org/2000/svg';
    let g = '';
    for (let i = 0; i < 3; i++) {
      const v = mn + ((mx - mn) * i) / 2;
      g += '<line class="axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/>' +
        '<text x="' + (m.l - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end">' + esc(axisFmt(k, v)) + '</text>';
    }
    const xs = [0, Math.floor((vals.length - 1) / 2), vals.length - 1];
    xs.forEach((i, j) => {
      g += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (j === 0 ? 'start' : j === 2 ? 'end' : 'middle') + '">' + esc(k.labels[i]) + '</text>';
    });
    const line = vals.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
    const dots = vals.map((v, i) => '<circle class="pt" cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="2.5"/>').join('');
    host.innerHTML = '<svg xmlns="' + NS + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' + g + '<polyline class="line" points="' + line + '"/>' + dots + '</svg>';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Gráfico de linha de ' + k.label + ': de ' + CO.kpiFormat(k, vals[0]) + ' a ' + CO.kpiFormat(k, vals[vals.length - 1]) + '. Os valores estão na tabela abaixo.');
  }
  function renderReportBody(id) {
    const k = CO.kpis.find((x) => x.id === id);
    state.reportKpi = id;
    const t = trendOf(k);
    $('#rep-main').innerHTML =
      '<div class="rep-top"><div><div class="rep-big">' + esc(CO.kpiFormat(k, k.value)) + '</div>' +
      '<div class="kpi-delta"><span class="delta delta--' + t.tone + '">' + icon(t.arrow) + '<span class="sr-only">' + t.sr + '</span><span>' + fmt.delta(t.d) + '</span></span><span class="kpi-cmp">' + esc(k.cmp) + '</span></div></div></div>' +
      '<div class="chart" id="rep-chart"></div>' +
      '<div class="rep-table-wrap" tabindex="0" role="region" aria-label="Valores do gráfico (rolável)"><table class="rep-table"><thead><tr><th scope="col">' + esc(k.axis) + '</th><th scope="col" class="num">Valor</th></tr></thead><tbody>' +
      k.series.map((v, i) => [CO.kpiFormat(k, v), k.labels[i]]).reverse().map((r) => '<tr><td>' + esc(r[1]) + '</td><td class="num">' + esc(r[0]) + '</td></tr>').join('') +
      '</tbody></table></div>';
    drawChart($('#rep-chart'), k);
  }
  function exportKpi() {
    const k = CO.kpis.find((x) => x.id === state.reportKpi);
    const head = [k.axis, k.label].join(';');
    const body = k.series.map((v, i) => [k.labels[i], String(Math.round(v * 100) / 100).replace('.', ',')].map(csvCell).join(';'));
    download('indicador-' + k.id + '-' + stamp() + '.csv', [head].concat(body).join('\r\n'));
    ui.toast('Indicador exportado em CSV.', 'success');
  }
  function openReport(id) {
    state.reportKpi = id || state.reportKpi;
    const body = document.createElement('div');
    body.style.display = 'grid';
    body.style.gap = 'var(--sp-4)';
    body.innerHTML =
      '<div class="field"><label class="field-label" for="rep-kpi">Indicador</label><select class="input input--select" id="rep-kpi">' +
      CO.kpis.map((k) => '<option value="' + k.id + '"' + (k.id === state.reportKpi ? ' selected' : '') + '>' + esc(k.label) + '</option>').join('') +
      '</select></div><div id="rep-main" style="display:grid;gap:var(--sp-4)"></div>';
    ui.dialogOpen({
      title: 'Relatório detalhado',
      body,
      footer: [ui.button('Fechar', 'btn--secondary', null, ui.dialogClose), ui.button('Exportar CSV', 'btn--primary', 'download', exportKpi)],
      onOpen: () => {
        renderReportBody(state.reportKpi);
        $('#rep-kpi').addEventListener('change', (e) => renderReportBody(e.target.value));
      },
    });
  }
  window.addEventListener('resize', () => {
    if ($('#dialog').open && $('#rep-chart')) drawChart($('#rep-chart'), CO.kpis.find((x) => x.id === state.reportKpi));
  });

  /* ======================================================================
     Modos de layout: papéis ARIA das abas conforme a largura
     ====================================================================== */
  const mqMobile = window.matchMedia('(max-width: 767.98px)');
  const mqMedium = window.matchMedia('(min-width: 768px) and (max-width: 1279.98px) and (min-height: 640px)');
  const mqLand = window.matchMedia('(orientation: landscape)');
  function setPanelRole(el, on, labelledby) {
    if (on) {
      if (!el.dataset.lb) el.dataset.lb = el.getAttribute('aria-labelledby') || '';
      el.setAttribute('role', 'tabpanel');
      el.setAttribute('aria-labelledby', labelledby);
    } else if (el.getAttribute('role') === 'tabpanel') {
      el.removeAttribute('role');
      if (el.dataset.lb) el.setAttribute('aria-labelledby', el.dataset.lb); else el.removeAttribute('aria-labelledby');
    }
  }
  function applyMode() {
    const mobile = mqMobile.matches, medium = mqMedium.matches;
    setPanelRole($('#panel-kpis'), mobile, 'tab-kpis');
    setPanelRole($('#panel-ops'), mobile, 'tab-ops');
    setPanelRole($('#panel-data'), mobile, 'tab-data');
    setPanelRole($('#panel-alerts'), mobile || medium, mobile ? 'tab-alerts' : 'mtab-alertas');
    setPanelRole($('#content'), medium, 'mtab-painel');
    $('#tabs-mobile').setAttribute('aria-orientation', mobile && mqLand.matches ? 'vertical' : 'horizontal');
  }

  /* ======================================================================
     Eventos
     ====================================================================== */
  function bind() {
    // Abas
    const mobileTabs = ui.tablist($('#tabs-mobile'), (id) => { shell.dataset.tabMobile = id; });
    const mediumTabs = ui.tablist($('#tabs-medium'), (id) => { shell.dataset.tabMedium = id; });
    void mobileTabs; void mediumTabs;

    // Cabeçalho
    $('#btn-live').addEventListener('click', toggleLive);
    $('#btn-report').addEventListener('click', () => openReport());

    // Tabela
    $('#filter-client').addEventListener('input', (e) => { state.filter = e.target.value; renderTable(); });
    $('#btn-export').addEventListener('click', exportOrders);
    $('#btn-sim').addEventListener('click', simMenu);
    $('#tbl thead').addEventListener('click', (e) => {
      const b = e.target.closest('[data-sort]');
      if (!b) return;
      const key = b.dataset.sort;
      if (state.sort.key === key) state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
      else state.sort = { key, dir: key === 'valor' || key === 'data' ? 'desc' : 'asc' };
      renderTable();
      const nb = $('#tbl thead [data-sort="' + key + '"]');
      if (nb) nb.focus();
    });
    $('#sort-m').addEventListener('change', (e) => {
      const [key, dir] = e.target.value.split(':');
      state.sort = { key, dir };
      renderTable();
    });
    const selectAll = (checked) => {
      visibleOrders().forEach((o) => (checked ? state.selected.add(o.id) : state.selected.delete(o.id)));
      renderTable();
    };
    $('#chk-all').addEventListener('change', (e) => selectAll(e.target.checked));
    $('#chk-all-m').addEventListener('change', (e) => selectAll(e.target.checked));
    $('#tbody').addEventListener('change', (e) => {
      const c = e.target.closest('[data-row-check]');
      if (!c) return;
      const id = c.dataset.rowCheck;
      if (c.checked) state.selected.add(id); else state.selected.delete(id);
      c.closest('tr').toggleAttribute('data-selected', c.checked);
      updateSelectionUI();
      renderSummary(visibleOrders());
    });
    $('#tbody').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (b) orderMenu(b);
    });
    $('#table-state').addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (!b) return;
      if (b.dataset.action === 'retry') retry();
      if (b.dataset.action === 'clear-filter') { state.filter = ''; $('#filter-client').value = ''; renderTable(); $('#filter-client').focus(); }
    });

    // Alertas
    $('#alert-filters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      state.alertFilter = b.dataset.filter;
      renderAlerts();
    });
    $('#alerts-state').addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (!b) return;
      if (b.dataset.action === 'retry') retry();
      if (b.dataset.action === 'all-alerts') { state.alertFilter = 'all'; renderAlerts(); }
    });

    // Atalhos de teclado (visíveis nos botões)
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], [role="menu"]')) return;
      if ($('#dialog').open) return;
      const k = e.key.toLowerCase();
      if (k === 'p') { e.preventDefault(); toggleLive(); }
      else if (k === 'r') { e.preventDefault(); openReport(); }
      else if (k === '/') {
        const f = $('#filter-client');
        if (f.offsetParent !== null) { e.preventDefault(); f.focus(); }
      }
    });

    // Rede / modos
    window.addEventListener('online', () => { state.net = true; renderConn(); ui.toast('Conexão restabelecida.', 'success'); });
    window.addEventListener('offline', () => { state.net = false; renderConn(); ui.toast('Sem conexão com a internet.', 'error'); });
    [mqMobile, mqMedium, mqLand].forEach((m) => (m.addEventListener ? m.addEventListener('change', applyMode) : m.addListener(applyMode)));
  }

  /* ======================================================================
     Inicialização
     ====================================================================== */
  function init() {
    ui.initDialog();
    renderKpis();
    renderOps();
    renderTable();
    renderAlerts();
    renderConn();
    renderClock();
    renderLastUpdate();
    $$('[data-scroll]').forEach(ui.initScroll);
    bind();
    applyMode();
    setInterval(renderClock, 1000);
    setInterval(tick, 5000);
    setTimeout(() => {
      state.boot = false;
      renderTable();
      renderAlerts();
    }, 700);
    window.__CO = { state, setSim, tick, pushAlert };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
