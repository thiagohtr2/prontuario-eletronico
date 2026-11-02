/* Telas de conteúdo: painel analítico (KPIs, gráfico, atividades, tabela) e páginas de lista.
   Cada bloco mostra estado de carregamento antes de receber os dados fictícios. */
(function (ns) {
  'use strict';
  var h = ns.h, svg = ns.svg;
  var DELAY = 350;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var period = '30';
  var renderId = 0;
  var attempted = {};
  var charts = [];
  var uidN = 0;

  var ROW_COLS = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'valor', label: 'Valor', type: 'money', align: 'right' },
    { key: 'data', label: 'Data', type: 'date' }
  ];

  // Séries de volume e receita escalam com o período; taxas não.
  var SCALED = { 'Vendas por mês': true, 'Novos clientes por mês': true, 'Receita e despesa por mês': true };

  function uid(p) { uidN += 1; return p + '-' + uidN; }

  function periodFactor() {
    return ns.PERIODS.filter(function (p) { return p.value === period; })[0].factor;
  }

  function svgNode(tag, attrs, text) {
    var el = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, String(attrs[k])); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function pageHead(title, desc, actions) {
    return h('div', { class: 'page-head' },
      h('div', { class: 'page-head-text' },
        h('h1', { class: 'page-title', text: title }),
        desc ? h('p', { class: 'page-desc', text: desc }) : null),
      h('div', { class: 'page-actions' }, actions || null));
  }

  function exportBtn() {
    return h('button', { class: 'btn btn-secondary', type: 'button', onclick: function () { ns.toast('Exportação simulada (demonstração).'); } },
      svg('download'), h('span', { text: 'Exportar' }));
  }

  // Bloco com skeleton; o conteúdo entra depois de DELAY, se a renderização ainda for a atual.
  function slot(cls) {
    return h('div', { class: 'slot ' + cls, 'aria-busy': 'true' },
      h('span', { class: 'sr-only', text: 'Carregando…' }),
      h('div', { class: 'skeleton-card', 'aria-hidden': 'true' },
        h('div', { class: 'skeleton sk-title' }),
        h('div', { class: 'skeleton sk-line' }),
        h('div', { class: 'skeleton sk-line sk-short' }),
        h('div', { class: 'skeleton sk-line' })));
  }

  function fill(s, build, token) {
    window.setTimeout(function () {
      if (token !== renderId || !s.isConnected) return;
      s.replaceChildren(build());
      s.removeAttribute('aria-busy');
    }, DELAY);
  }

  function errorState(onRetry) {
    return h('section', { class: 'card state-card state-error', role: 'alert' },
      h('div', { class: 'state-head' }, svg('alert'), h('p', { text: 'Não foi possível carregar os dados.' })),
      h('button', { class: 'btn btn-secondary', type: 'button', onclick: onRetry }, svg('refresh'), h('span', { text: 'Tentar novamente' })));
  }

  function kpiCard(k, f) {
    var v = k.scale ? k.value * f : k.value;
    var d = k.delta;
    return h('article', { class: 'card kpi' },
      h('p', { class: 'kpi-label', text: k.label }),
      h('p', { class: 'kpi-value', text: ns.fmtValue(v, k.fmt) }),
      h('p', { class: 'kpi-delta', text: (d >= 0 ? '+' : '−') + ns.fmtValue(Math.abs(d), 'pct') + ' vs. período anterior' }));
  }

  // Escala "bonita" para o eixo Y com 4 divisões.
  function niceMax(max) {
    if (max <= 0) return 4;
    var raw = max / 4;
    var p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var steps = [1, 2, 2.5, 5, 10];
    var step = 10 * p;
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] * p >= raw) { step = steps[i] * p; break; }
    }
    return step * 4;
  }

  function chartCard(c, f) {
    var fmt = /Vendas|Receita|MRR/.test(c.title) ? 'brl' : 'int';
    var scaled = !!SCALED[c.title];
    var unit = c.unit;
    var on = c.series.map(function () { return true; });
    var data = c.series.map(function (s) {
      return s.values.map(function (v) { return scaled ? v * f : v; });
    });
    var titleId = uid('chart-title');
    var entry = { el: null, draw: null, lastW: 0 };

    function fmtVal(v) { return ns.fmtValue(unit === 'mil' ? v * 1000 : v, fmt); }
    function axisText(v) { return ns.fmtCompact(unit === 'mil' ? v * 1000 : v); }

    var plot = h('div', { class: 'chart-plot' });
    var empty = h('p', { class: 'chart-empty', hidden: true, text: 'Selecione ao menos uma série para exibir o gráfico.' });
    entry.el = plot;

    function draw() {
      var act = [];
      on.forEach(function (x, i) { if (x) act.push(i); });
      plot.hidden = act.length === 0;
      empty.hidden = act.length > 0;
      if (!act.length) { plot.replaceChildren(); return; }

      var w = Math.max(240, plot.clientWidth || 600);
      entry.lastW = plot.clientWidth;
      var narrow = w < 480;
      var H = Math.max(200, Math.min(300, Math.round(w * 0.42)));
      var padL = narrow ? 44 : 56, padR = 8, padT = 12, padB = 28;
      var iw = w - padL - padR, ih = H - padT - padB;
      var max = 0;
      act.forEach(function (i) { data[i].forEach(function (v) { if (v > max) max = v; }); });
      var top = niceMax(max);
      function yOf(v) { return padT + ih - (v / top) * ih; }

      var svgRoot = svgNode('svg', {
        width: w, height: H, viewBox: '0 0 ' + w + ' ' + H, class: 'chart-svg', role: 'img',
        'aria-label': c.title + '. Gráfico de barras com ' + act.length + ' série(s): ' + act.map(function (i) { return c.series[i].name; }).join(', ') + '.'
      });

      for (var k = 0; k <= 4; k++) {
        var val = top * k / 4;
        var gy = yOf(val);
        svgRoot.appendChild(svgNode('line', { x1: padL, x2: w - padR, y1: gy, y2: gy, class: 'grid-line' }));
        svgRoot.appendChild(svgNode('text', { x: padL - 8, y: gy + 4, 'text-anchor': 'end', class: 'axis-label' }, axisText(val)));
      }

      var tip = h('div', { class: 'chart-tip', hidden: true, role: 'presentation' });
      var n = c.labels.length, gw = iw / n, bars = act.length;
      var bw = Math.min(28, (gw * 0.7) / bars), start = (gw - bw * bars) / 2;

      c.labels.forEach(function (lab, j) {
        var gx = padL + j * gw;
        var g = svgNode('g', {
          class: 'bar-group', tabindex: '0', role: 'img',
          'aria-label': lab + ': ' + act.map(function (i) { return c.series[i].name + ' ' + fmtVal(data[i][j]); }).join(', ')
        });
        g.appendChild(svgNode('rect', { x: gx, y: padT, width: gw, height: ih, class: 'hit' }));
        var topY = padT + ih;
        act.forEach(function (i, idx) {
          var v = data[i][j];
          var bh = (v / top) * ih;
          topY = Math.min(topY, yOf(v));
          g.appendChild(svgNode('rect', { x: gx + start + idx * bw, y: yOf(v), width: Math.max(2, bw - 2), height: Math.max(0, bh), class: 'bar bar-' + i }));
        });
        function show() {
          var nodes = [h('strong', { text: lab })].concat(act.map(function (i) {
            return h('span', { class: 'tip-row' },
              h('span', { class: 'swatch swatch-' + i, 'aria-hidden': 'true' }),
              h('span', { text: c.series[i].name + ': ' + fmtVal(data[i][j]) }));
          }));
          tip.replaceChildren.apply(tip, nodes);
          tip.hidden = false;
          var cx = Math.min(Math.max(gx + gw / 2, 70), w - 70);
          tip.style.left = cx + 'px';
          tip.style.top = Math.max(4, topY - 8) + 'px';
        }
        function hide() { tip.hidden = true; }
        g.addEventListener('mouseenter', show);
        g.addEventListener('mouseleave', hide);
        g.addEventListener('focus', show);
        g.addEventListener('blur', hide);
        g.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { if (tip.hidden) show(); else hide(); } });
        svgRoot.appendChild(g);
        if (!narrow || j % 2 === 0) {
          svgRoot.appendChild(svgNode('text', { x: gx + gw / 2, y: H - 8, 'text-anchor': 'middle', class: 'axis-label' }, lab));
        }
      });
      svgRoot.appendChild(svgNode('line', { x1: padL, x2: w - padR, y1: yOf(0), y2: yOf(0), class: 'axis-line' }));
      plot.replaceChildren(svgRoot, tip);
    }
    entry.draw = draw;
    charts.push(entry);

    var legend = h('div', { class: 'legend', role: 'group', 'aria-label': 'Séries do gráfico (clique para ligar ou desligar)' },
      c.series.map(function (s, i) {
        var b = h('button', { class: 'legend-btn', type: 'button', 'aria-pressed': 'true' },
          h('span', { class: 'swatch swatch-' + i, 'aria-hidden': 'true' }),
          h('span', { text: s.name }));
        b.addEventListener('click', function () {
          on[i] = !on[i];
          b.setAttribute('aria-pressed', on[i] ? 'true' : 'false');
          draw();
        });
        return b;
      }));

    var srTable = h('table', { class: 'sr-only' },
      h('caption', { text: c.title }),
      h('thead', null, h('tr', null, h('th', { scope: 'col', text: 'Mês' }), c.series.map(function (s) { return h('th', { scope: 'col', text: s.name }); }))),
      h('tbody', null, c.labels.map(function (lab, j) {
        return h('tr', null, h('th', { scope: 'row', text: lab }), c.series.map(function (s, i) { return h('td', { text: fmtVal(data[i][j]) }); }));
      })));

    window.setTimeout(draw, 0);
    return h('section', { class: 'card chart-card', 'aria-labelledby': titleId },
      h('div', { class: 'card-head' }, h('h2', { class: 'card-title', id: titleId, text: c.title })),
      plot, empty, legend, srTable);
  }

  function activityCard(days) {
    var items = ns.ACTIVITIES.filter(function (a) { return ns.daysAgo(a.data) <= days; });
    var id = uid('atv');
    return h('section', { class: 'card activity-card', 'aria-labelledby': id },
      h('div', { class: 'card-head' }, h('h2', { class: 'card-title', id: id, text: 'Atividades recentes' })),
      items.length
        ? h('ul', { class: 'activity-list' }, items.map(function (a) {
          return h('li', { class: 'activity-item' },
            h('div', { class: 'activity-main' },
              h('p', { class: 'activity-title', text: a.texto }),
              h('p', { class: 'activity-detail', text: a.detalhe })),
            h('time', { class: 'activity-time', datetime: a.data, text: ns.fmtDate(a.data) }));
        }))
        : h('p', { class: 'empty-note', text: 'Nenhuma atividade no período selecionado.' }));
  }

  function cell(c, r, nameKey) {
    var v = r[c.key];
    var content;
    if (c.type === 'status') content = h('span', { class: 'badge badge-' + (ns.STATUS_TONE[v] || 'neutral'), text: v });
    else if (c.type === 'money') content = ns.fmtValue(v, 'brl');
    else if (c.type === 'int') content = ns.fmtValue(v, 'int');
    else if (c.type === 'date') content = ns.fmtDate(v);
    else content = String(v);
    var cls = [c.align === 'right' ? 'num' : '', c.key === nameKey ? 'cell-name' : ''].join(' ').trim();
    return h('td', { class: cls || null, 'data-label': c.label }, content);
  }

  // Tabela de dados: seleção com checkbox, ordenação (aria-sort), filtro, vazio e cartões no celular.
  function tableCard(title, cols, rows, emptyMessage) {
    var nameKey = cols[0].key;
    var st = { sort: null, dir: 1, q: '', sel: {} };
    var titleId = uid('tbl');
    var searchId = uid('q');
    var search = h('input', { class: 'input input-sm', id: searchId, type: 'search', placeholder: 'Filtrar', autocomplete: 'off' });
    var master = h('input', { class: 'check', type: 'checkbox', 'aria-label': 'Selecionar todos os registros visíveis' });
    var thSorts = {};
    var tbody = h('tbody');
    var count = h('p', { class: 'table-count', 'aria-live': 'polite' });

    function visible() {
      var q = st.q.trim().toLowerCase();
      var list = rows.filter(function (r) {
        return !q || (String(r[nameKey]) + ' ' + r.status).toLowerCase().indexOf(q) !== -1;
      });
      if (st.sort) {
        list = list.slice().sort(function (a, b) {
          var x = a[st.sort], y = b[st.sort];
          var res = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR');
          return res * st.dir;
        });
      }
      return list;
    }

    function summary() {
      var list = visible();
      var nSel = list.filter(function (r) { return st.sel[String(rows.indexOf(r))]; }).length;
      var total = Object.keys(st.sel).filter(function (k) { return st.sel[k]; }).length;
      master.checked = list.length > 0 && nSel === list.length;
      master.indeterminate = nSel > 0 && nSel < list.length;
      count.textContent = list.length + (list.length === 1 ? ' registro' : ' registros') +
        (total ? ' · ' + total + ' selecionado(s)' : '');
    }

    function actionBtn(name) {
      var btn = h('button', { class: 'icon-btn row-action', type: 'button', 'aria-label': 'Ações para ' + name, 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, svg('more'));
      btn.addEventListener('click', function () {
        ns.openMenu({
          trigger: btn, align: 'end', placement: 'down', label: 'Ações de ' + name,
          items: [
            { label: 'Ver detalhes', icon: 'file', onSelect: function () { ns.toast('Detalhes de ' + name + ' (demonstração).'); } },
            { label: 'Copiar identificador', icon: 'check', onSelect: function () { ns.toast('Identificador copiado (demonstração).'); } },
            { label: 'Exportar linha', icon: 'download', onSelect: function () { ns.toast('Exportação simulada (demonstração).'); } }
          ]
        });
      });
      return btn;
    }

    function rowEl(r) {
      var id = String(rows.indexOf(r));
      var name = String(r[nameKey]);
      var cb = h('input', { class: 'check', type: 'checkbox', 'aria-label': 'Selecionar ' + name });
      cb.checked = !!st.sel[id];
      var tr = h('tr', { class: st.sel[id] ? 'is-selected' : null },
        h('td', { class: 'col-check', 'data-label': 'Selecionar' }, cb),
        cols.map(function (c) { return cell(c, r, nameKey); }),
        h('td', { class: 'col-actions' }, actionBtn(name)));
      cb.addEventListener('change', function () {
        st.sel[id] = cb.checked;
        tr.classList.toggle('is-selected', cb.checked);
        summary();
      });
      return tr;
    }

    function renderBody() {
      var list = visible();
      tbody.replaceChildren();
      if (!list.length) {
        var msg = rows.length
          ? 'Nenhum resultado para “' + st.q.trim() + '”.'
          : (emptyMessage || 'Nenhum registro encontrado.');
        tbody.appendChild(h('tr', { class: 'row-empty' },
          h('td', { colspan: cols.length + 2 }, h('div', { class: 'state-empty' }, h('p', { text: msg })))));
      } else {
        list.forEach(function (r) { tbody.appendChild(rowEl(r)); });
      }
      summary();
    }

    var thead = h('thead', null, h('tr', null,
      h('th', { scope: 'col', class: 'col-check' }, master),
      cols.map(function (c) {
        var btn = h('button', { class: 'th-sort', type: 'button' }, h('span', { text: c.label }), svg('sort', 'sort-ico'));
        var th = h('th', { scope: 'col', class: c.align === 'right' ? 'num' : null, 'aria-sort': 'none' }, btn);
        btn.addEventListener('click', function () {
          if (st.sort === c.key) st.dir = -st.dir; else { st.sort = c.key; st.dir = 1; }
          Object.keys(thSorts).forEach(function (k) {
            thSorts[k].setAttribute('aria-sort', k === st.sort ? (st.dir === 1 ? 'ascending' : 'descending') : 'none');
          });
          renderBody();
        });
        thSorts[c.key] = th;
        return th;
      }),
      h('th', { scope: 'col', class: 'col-actions' }, h('span', { class: 'sr-only', text: 'Ações' }))));

    master.addEventListener('change', function () {
      visible().forEach(function (r) { st.sel[String(rows.indexOf(r))] = master.checked; });
      renderBody();
    });
    search.addEventListener('input', function () { st.q = search.value; renderBody(); });

    renderBody();
    return h('section', { class: 'card table-card', 'aria-labelledby': titleId },
      h('div', { class: 'card-head table-head' },
        h('h2', { class: 'card-title', id: titleId, text: title }),
        h('div', { class: 'table-tools' },
          h('label', { class: 'sr-only', for: searchId, text: 'Filtrar registros' }),
          search)),
      h('div', { class: 'table-scroll' },
        h('table', { class: 'data-table' }, h('caption', { class: 'sr-only', text: title }), thead, tbody)),
      h('div', { class: 'table-foot' }, count));
  }

  function renderDashboard(container, section) {
    var d = ns.DASHBOARDS[section];
    var token = ++renderId;
    var f = periodFactor();
    var days = Number(period);

    var sel = h('select', { class: 'select', id: 'periodo', 'aria-label': 'Período do painel' },
      ns.PERIODS.map(function (p) { return h('option', { value: p.value, text: p.label }); }));
    sel.value = period;
    sel.addEventListener('change', function () {
      period = sel.value;
      renderDashboard(container, section);
      var again = container.querySelector('#periodo');
      if (again) again.focus();
    });

    var kpiGrid = h('div', { class: 'kpi-grid' }, d.kpis.map(function (k) {
      var s = slot('slot-kpi');
      fill(s, function () { return kpiCard(k, f); }, token);
      return s;
    }));
    var chartSlot = slot('dash-chart');
    fill(chartSlot, function () { return chartCard(d.chart, f); }, token);
    var actSlot = slot('dash-activity');
    fill(actSlot, function () { return activityCard(days); }, token);
    var tblSlot = slot('dash-table');
    fill(tblSlot, function () {
      return tableCard(d.tableTitle, ROW_COLS, ns.ORDERS.filter(function (o) { return ns.daysAgo(o.data) <= days; }));
    }, token);

    container.replaceChildren(
      pageHead(d.title, 'Indicadores e movimentação do período selecionado.', [sel, exportBtn()]),
      kpiGrid,
      h('div', { class: 'dash-row' }, chartSlot, actSlot),
      tblSlot);
  }

  function loadPageTable(s, id, token) {
    var p = ns.PAGES[id];
    fill(s, function () {
      if (p.failFirst && !attempted[id]) {
        attempted[id] = true;
        return errorState(function () {
          var skeleton = slot('page-table');
          s.replaceChildren.apply(s, Array.prototype.slice.call(skeleton.childNodes));
          s.setAttribute('aria-busy', 'true');
          loadPageTable(s, id, token);
        });
      }
      return tableCard(p.tableTitle, p.columns, p.rows, p.emptyMessage);
    }, token);
  }

  function renderPage(container, id) {
    var p = ns.PAGES[id];
    var token = ++renderId;
    var s = slot('page-table');
    container.replaceChildren(
      pageHead(p.title, null, [
        exportBtn(),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { ns.toast('Cadastro de novos registros indisponível na demonstração.'); } },
          h('span', { text: 'Novo registro' }))
      ]),
      s);
    loadPageTable(s, id, token);
  }

  function render(container, r) {
    if (r.kind === 'dashboard') renderDashboard(container, r.section);
    else renderPage(container, r.id);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      charts = charts.filter(function (c) { return c.el.isConnected; });
      charts.forEach(function (c) { if (c.el.clientWidth !== c.lastW) c.draw(); });
    }, 120);
  });

  ns.views = { render: render };
})(window.NEXO = window.NEXO || {});
