/* Componentes Swiss Minimal reutilizáveis: cabeçalhos de página, cards,
   KPIs com sparkline, gráfico de barras, tabela de dados e estados. */
(function () {
  var A = window.Atlas;
  var u = A.u;
  var D = A.data;
  var ui = A.ui = {};

  /* ---------- Estrutura de página ---------- */
  ui.pageHead = function (o) {
    return '<header class="page-head"><div class="page-head__text">' +
      (o.overline ? '<p class="overline">' + u.esc(o.overline) + '</p>' : '') +
      '<h1 class="page-title" tabindex="-1">' + u.esc(o.title) + '</h1>' +
      (o.desc ? '<p class="page-desc">' + o.desc + '</p>' : '') +
      '</div>' + (o.actions ? '<div class="page-actions">' + o.actions + '</div>' : '') + '</header>';
  };
  ui.sectionHead = function (num, title, right, id) {
    return '<div class="section-head"><h2 class="section-title"' + (id ? ' id="' + id + '"' : '') + '><span class="section-num">' + num + ' —</span><span>' + u.esc(title) + '</span></h2>' + (right || '') + '</div>';
  };

  ui.badge = function (text, tone) {
    return '<span class="sw-badge"><span class="sq sq--' + (tone || 'ink') + '" aria-hidden="true"></span>' + u.esc(text) + '</span>';
  };
  ui.statusTone = function (s) {
    return ({
      'Pago': 'success', 'Pendente': 'warning', 'Cancelado': 'error', 'Reembolsado': 'info',
      'Ativo': 'success', 'Ausente': 'warning', 'Convidado': 'info',
      'Novo': 'accent', 'Em andamento': 'ink', 'Pausado': 'warning', 'Concluído': 'success',
      'Publicado': 'success', 'Em revisão': 'warning', 'Rascunho': 'ink',
      'Alta': 'error', 'Média': 'warning', 'Baixa': 'ink'
    })[s] || 'ink';
  };
  ui.statusBadge = function (s) { return ui.badge(s, ui.statusTone(s)); };

  ui.sqAvatar = function (name, cls) {
    return '<span class="sw-avatar' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + u.esc(u.initials(name)) + '</span>';
  };

  ui.select = function (o) {
    return '<div class="sw-select-wrap"><select class="sw-select" id="' + o.id + '" name="' + (o.name || o.id) + '"' + (o.attrs || '') + '>' +
      o.options.map(function (op) {
        var v = typeof op === 'string' ? op : op.value, l = typeof op === 'string' ? op : op.label;
        return '<option value="' + u.esc(v) + '"' + (String(v) === String(o.value) ? ' selected' : '') + '>' + u.esc(l) + '</option>';
      }).join('') + '</select>' + A.icon('chevronDown', 18) + '</div>';
  };

  ui.filter = function (label, items, current, attr) {
    return '<div class="sw-filter" role="group" aria-label="' + u.esc(label) + '">' + items.map(function (it) {
      return '<button type="button" ' + (attr || 'data-filter') + '="' + it.value + '" aria-pressed="' + (it.value === current) + '">' + u.esc(it.label) +
        (it.count != null ? '<span class="count" aria-hidden="true">' + it.count + '</span><span class="sr-only"> (' + it.count + ')</span>' : '') + '</button>';
    }).join('') + '</div>';
  };
  /** Liga um grupo de filtros (aria-pressed) a um callback. */
  ui.bindFilter = function (root, attr, cb) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[' + attr + ']');
      if (!b || !root.contains(b)) return;
      u.qsa('[' + attr + ']', b.parentNode).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      cb(b.getAttribute(attr));
    });
  };

  /* ---------- Estados ---------- */
  ui.state = function (kind, o) {
    o = o || {};
    var icon = kind === 'error' ? 'alert' : kind === 'empty' ? 'inbox' : 'clock';
    return '<div class="sw-state sw-state--' + kind + (o.box ? ' sw-state--box' : '') + '"' + (kind === 'error' ? ' role="alert"' : ' role="status"') + '>' +
      A.icon(icon, 28) +
      '<p class="sw-state__title">' + u.esc(o.title) + '</p>' +
      (o.text ? '<p>' + u.esc(o.text) + '</p>' : '') +
      (o.action ? '<button type="button" class="sw-btn sw-btn--secondary" data-state-action>' + (kind === 'error' ? A.icon('refresh', 18) : '') + u.esc(o.action) + '</button>' : '') +
      '</div>';
  };
  ui.skeletonCards = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      s += '<div class="sw-card" aria-hidden="true"><div class="sw-card__media"></div><div class="sw-card__body"><span class="skel skel--line" style="width:30%"></span><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line" style="width:80%"></span></div><div class="sw-card__foot"><span class="skel skel--line" style="width:40%"></span></div></div>';
    }
    return '<div class="sw-cards" aria-busy="true"><span class="sr-only" role="status">Carregando…</span>' + s + '</div>';
  };
  ui.skeletonLines = function (n) {
    var s = '<div aria-busy="true" style="display:grid;gap:14px"><span class="sr-only" role="status">Carregando…</span>';
    for (var i = 0; i < n; i++) s += '<span class="skel skel--line" style="width:' + (60 + (i * 13) % 40) + '%"></span>';
    return s + '</div>';
  };

  /** Lê ?estado=carregando|vazio|erro (demonstração de estados). */
  ui.demoState = function (ctx) { return ctx && ctx.query && ctx.query.estado; };

  /* ---------- Card (Swiss) de projeto ---------- */
  ui.projectCard = function (p, i) {
    var status = D.STATUS[p.status];
    var open = D.tasks.filter(function (t) { return t.project === p.id && !t.done; }).length;
    return '<article class="sw-card">' +
      '<div class="sw-card__media" aria-hidden="true">' + A.icon(p.icon, 44) + '<span class="sw-card__num">' + String(i + 1).padStart(2, '0') + '</span></div>' +
      '<div class="sw-card__body">' +
        '<p class="sw-card__tag"><span class="sq sq--' + ui.statusTone(status) + '" aria-hidden="true"></span>' + status + '</p>' +
        '<h3 class="sw-card__title"><a class="sw-card__link" href="#/projetos/' + p.id + '">' + u.esc(p.name) + '</a></h3>' +
        '<p class="sw-card__text">' + u.esc(p.desc) + '</p>' +
      '</div>' +
      '<div class="sw-card__foot"><span class="sw-card__meta">Prazo ' + u.dateShort(p.due) + ' · ' + open + (open === 1 ? ' tarefa aberta' : ' tarefas abertas') + '</span>' +
      '<span class="sw-btn sw-btn--primary sw-card__action" aria-hidden="true">Ver detalhes</span></div>' +
    '</article>';
  };

  /* ---------- KPI + sparkline ---------- */
  ui.kpi = function (k, href) {
    var dir = k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat';
    var icon = dir === 'up' ? 'arrowUpRight' : dir === 'down' ? 'arrowDownRight' : 'minus';
    var word = dir === 'up' ? 'alta de' : dir === 'down' ? 'queda de' : 'sem variação,';
    return '<article class="sw-kpi" data-kpi="' + k.id + '">' +
      '<div class="sw-kpi__head"><a class="sw-kpi__label" href="' + href + '">' + u.esc(k.label) + '</a>' + A.icon(k.icon, 20) + '</div>' +
      '<p class="sw-kpi__value">' + u.esc(k.value) + '</p>' +
      '<p class="sw-kpi__delta"><strong class="is-' + dir + '">' + A.icon(icon, 16) + '<span class="sr-only">' + word + ' </span>' + u.pct(k.delta) + '</strong><span class="muted">' + u.esc(k.compare) + '</span></p>' +
      '<div class="spark" data-spark></div>' +
    '</article>';
  };

  ui.sparkline = function (el, values, labels, fmt, href) {
    var n = values.length;
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var range = max - min || 1;
    var W = 100, H = 40, pad = 3;
    function y(v) { return pad + (H - 2 * pad) * (1 - (v - min) / range); }
    var pts = values.map(function (v, i) { return (i / (n - 1) * W).toFixed(2) + ',' + y(v).toFixed(2); }).join(' ');
    function f(v) { return fmt === 'money' ? u.money(v) : u.num(v); }
    el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><line class="spark__base" x1="0" x2="100" y1="' + (H - 0.5) + '" y2="' + (H - 0.5) + '"/><polyline class="spark__line" points="' + pts + '"/></svg>' +
      '<span class="sr-only">Tendência: de ' + f(values[0]) + ' a ' + f(values[n - 1]) + '.</span>' +
      '<span class="spark__cursor" hidden></span><span class="spark__dot" hidden></span>';
    var cursor = el.querySelector('.spark__cursor'), dot = el.querySelector('.spark__dot');
    function at(clientX) {
      var r = el.getBoundingClientRect();
      var i = Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (n - 1));
      var x = i / (n - 1) * r.width;
      var yy = y(values[i]) / H * r.height;
      cursor.hidden = dot.hidden = false;
      cursor.style.left = x + 'px';
      dot.style.left = x + 'px';
      dot.style.top = yy + 'px';
      A.tip.showAt(r.left + x, r.top + yy - 6, (labels && labels[i] ? labels[i] + ': ' : '') + f(values[i]));
    }
    el.addEventListener('pointermove', function (e) { at(e.clientX); });
    el.addEventListener('pointerdown', function (e) { at(e.clientX); });
    el.addEventListener('pointerleave', function () { cursor.hidden = dot.hidden = true; A.tip.hide(); });
    if (href) el.addEventListener('click', function () { A.tip.hide(); location.hash = href; });
  };

  /* ---------- Gráfico de barras ---------- */
  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    var m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * p;
  }
  function axisFmt(v, fmt) {
    if (v >= 1000) return u.dec1(v / 1000).replace(/,0$/, '') + ' mil';
    return u.num(v);
  }

  ui.barChart = function (el, o) {
    var bars = o.bars;
    var rawMax = Math.max.apply(null, bars.map(function (b) { return b.value; })) || 1;
    var step = niceMax(rawMax / 4);
    var max = Math.ceil(rawMax / step) * step;
    var ticks = [];
    for (var tv = 0; tv <= max + step / 2; tv += step) ticks.push(tv / max);
    function f(v) { return o.fmt === 'money' ? u.money(v) : u.num(v); }
    var liveId = u.uid('live');
    el.innerHTML = '<div class="chart">' +
      '<div class="chart__frame">' +
        '<div class="chart__y" aria-hidden="true">' + ticks.map(function (t) { return '<span style="bottom:' + (t * 100) + '%">' + axisFmt(max * t, o.fmt) + '</span>'; }).join('') + '</div>' +
        '<div class="chart__plot" tabindex="0" role="img" aria-label="' + u.esc(o.label) + '. Use as setas para percorrer os valores.">' +
          ticks.slice(1).map(function (t) { return '<span class="chart__grid" style="bottom:' + (t * 100) + '%"></span>'; }).join('') +
          bars.map(function (b, i) { return '<div class="chart__bar" data-i="' + i + '"><span style="height:' + Math.max(0.5, b.value / max * 100) + '%"></span></div>'; }).join('') +
        '</div>' +
        '<div class="chart__x" aria-hidden="true">' + bars.map(function (b) { return '<span>' + u.esc(b.label) + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<p class="chart__legend"><span class="legend-item"><span class="sq sq--ink" aria-hidden="true"></span>' + u.esc(o.series) + '</span><span>' + u.esc(o.hint || 'Passe o mouse, toque ou use as setas para ver os valores.') + '</span></p>' +
      '<p class="sr-only" aria-live="polite" id="' + liveId + '"></p>' +
    '</div>';

    var plot = el.querySelector('.chart__plot');
    var barEls = u.qsa('.chart__bar', plot);
    var labels = u.qsa('.chart__x span', el);
    var live = el.querySelector('#' + liveId);
    var tip = null, active = -1;

    function thin() {
      var w = plot.clientWidth || 1;
      var maxLabels = Math.max(2, Math.floor(w / 46));
      var step = Math.ceil(bars.length / maxLabels);
      labels.forEach(function (s, i) {
        var show = (bars.length - 1 - i) % step === 0; // sempre mostra o último
        s.classList.toggle('is-hidden', !show);
      });
    }
    thin();
    if (window.ResizeObserver) { var ro = new ResizeObserver(thin); ro.observe(plot); }

    function show(i, announce) {
      if (i < 0 || i >= bars.length) return;
      active = i;
      plot.classList.add('is-hovering');
      barEls.forEach(function (b, j) { b.classList.toggle('is-active', j === i); });
      if (!tip) { tip = document.createElement('div'); tip.className = 'chart__tip'; plot.appendChild(tip); }
      tip.innerHTML = '<span>' + u.esc(bars[i].long || bars[i].label) + '</span><strong>' + f(bars[i].value) + '</strong>';
      var pr = plot.getBoundingClientRect(), br = barEls[i].getBoundingClientRect();
      var cx = br.left - pr.left + br.width / 2;
      var h = (bars[i].value / max) * plot.clientHeight;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = Math.max(0, Math.min(cx - tw / 2, plot.clientWidth - tw));
      var top = Math.max(-th - 4, plot.clientHeight - h - th - 8);
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
      if (announce) live.textContent = (bars[i].long || bars[i].label) + ': ' + f(bars[i].value);
    }
    function hide() {
      active = -1;
      plot.classList.remove('is-hovering');
      barEls.forEach(function (b) { b.classList.remove('is-active'); });
      if (tip) { tip.remove(); tip = null; }
    }
    function idxAt(clientX) {
      var r = plot.getBoundingClientRect();
      return Math.max(0, Math.min(bars.length - 1, Math.floor((clientX - r.left) / r.width * bars.length)));
    }
    plot.addEventListener('pointermove', function (e) { show(idxAt(e.clientX)); });
    plot.addEventListener('pointerdown', function (e) { show(idxAt(e.clientX)); });
    plot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    plot.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); show(active < 0 ? 0 : Math.min(bars.length - 1, active + 1), true); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); show(active < 0 ? bars.length - 1 : Math.max(0, active - 1), true); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      else if (e.key === 'End') { e.preventDefault(); show(bars.length - 1, true); }
      else if (e.key === 'Escape') { hide(); }
    });
    plot.addEventListener('blur', hide);
  };

  /** Tabela simples com os dados de um gráfico (alternativa acessível). */
  ui.dataTableSimple = function (caption, rows, fmt, colLabel) {
    return '<div class="sw-table-block"><div class="sw-table-wrap" role="region" aria-label="' + u.esc(caption) + '" tabindex="0"><table class="sw-table"><caption class="sr-only">' + u.esc(caption) + '</caption>' +
      '<thead><tr><th scope="col">' + u.esc(colLabel || 'Período') + '</th><th scope="col" class="num">Valor</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + u.esc(r.long || r.label) + '</td><td class="num">' + (fmt === 'money' ? u.money(r.value) : u.num(r.value)) + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>';
  };

  /* ---------- Tabela de dados (Swiss) ---------- */
  /**
   * cfg: { caption, columns:[{key,label,sortable,num,render(row),sortValue(row),wide}], rows(): [],
   *        selectable, actions(row)->[{label,icon,danger,run}], bulk:[{label,icon,run(ids)}],
   *        search:{placeholder,keys}, empty:{title,text}, demoStates, initialDelay, sort:{key,dir},
   *        itemName: ['pedido','pedidos'] }
   */
  ui.dataTable = function (el, cfg) {
    var st = {
      q: cfg.initialQuery || '',
      sort: cfg.sort || null,
      selected: {},
      mode: cfg.forceState || 'loading'
    };
    var tid = u.uid('tbl');
    var nm = cfg.itemName || ['item', 'itens'];
    var cols = cfg.columns;
    var colCount = cols.length + (cfg.selectable ? 1 : 0) + (cfg.actions ? 1 : 0);

    el.innerHTML = '<div class="sw-table-block">' +
      '<div class="sw-table-tools">' +
        (cfg.search ? '<div class="sw-search">' + A.icon('search', 18) + '<label class="sr-only" for="' + tid + '-q">' + u.esc(cfg.search.placeholder) + '</label><input class="sw-input" id="' + tid + '-q" type="search" placeholder="' + u.esc(cfg.search.placeholder) + '" value="' + u.esc(st.q) + '" autocomplete="off"></div>' : '<span></span>') +
        '<div class="sw-table-tools__right">' +
          (cfg.demoStates ? '<div class="sw-field"><label class="sw-label" for="' + tid + '-state">Simular estado <span class="opt">(demonstração)</span></label>' +
            ui.select({ id: tid + '-state', options: [{ value: 'ready', label: 'Com dados' }, { value: 'loading', label: 'Carregando' }, { value: 'empty', label: 'Vazio' }, { value: 'error', label: 'Erro' }], value: 'ready' }) + '</div>' : '') +
          '<button type="button" class="sw-btn sw-btn--secondary" data-reload>' + A.icon('refresh', 18) + 'Atualizar</button>' +
        '</div>' +
      '</div>' +
      '<div class="sw-table-card-tools">' +
        (cfg.selectable ? '<label class="sw-check sw-check--center"><input type="checkbox" class="sw-checkbox" data-select-all> Selecionar todos</label>' : '') +
        '<div class="sw-field"><label class="sw-label" for="' + tid + '-sort">Ordenar por</label>' +
          ui.select({ id: tid + '-sort', options: cols.filter(function (c) { return c.sortable; }).reduce(function (acc, c) {
            return acc.concat([{ value: c.key + ':ascending', label: c.label + (c.num ? ' (menor primeiro)' : ' (A–Z)') }, { value: c.key + ':descending', label: c.label + (c.num ? ' (maior primeiro)' : ' (Z–A)') }]);
          }, []), value: st.sort ? st.sort.key + ':' + st.sort.dir : '' }) + '</div>' +
      '</div>' +
      '<div class="sw-bulk" data-bulk hidden></div>' +
      '<p class="sr-only" role="status" data-table-status></p>' +
      '<div class="sw-table-wrap" role="region" aria-labelledby="' + tid + '-cap" tabindex="0">' +
        '<table class="sw-table" aria-describedby="' + tid + '-cap"><caption class="sr-only" id="' + tid + '-cap">' + u.esc(cfg.caption) + '</caption>' +
          '<thead><tr>' +
            (cfg.selectable ? '<th scope="col" class="col-check"><span class="check-hit"><input type="checkbox" class="sw-checkbox" data-select-all aria-label="Selecionar todas as linhas"></span></th>' : '') +
            cols.map(function (c) {
              var sorted = st.sort && st.sort.key === c.key;
              return '<th scope="col" class="' + (c.num ? 'num' : '') + '"' + (c.sortable ? ' aria-sort="' + (sorted ? st.sort.dir : 'none') + '"' : '') + ' data-col="' + c.key + '">' +
                (c.sortable ? '<button type="button" class="th-sort" data-sort="' + c.key + '">' + u.esc(c.label) + '<span data-sort-icon>' + A.icon(sorted ? (st.sort.dir === 'ascending' ? 'arrowUp' : 'arrowDown') : 'arrowUpDown', 14) + '</span></button>' : u.esc(c.label)) + '</th>';
            }).join('') +
            (cfg.actions ? '<th scope="col" class="col-actions"><span class="sr-only">Ações</span></th>' : '') +
          '</tr></thead><tbody></tbody></table></div>' +
    '</div>';

    var tbody = el.querySelector('tbody');
    var bulk = el.querySelector('[data-bulk]');
    var status = el.querySelector('[data-table-status]');
    var allBoxes = u.qsa('[data-select-all]', el);

    function visibleRows() {
      var rows = cfg.rows().slice();
      var q = u.norm(st.q);
      if (q && cfg.search) rows = rows.filter(function (r) { return cfg.search.keys.some(function (k) { return u.norm(r[k]).indexOf(q) >= 0; }); });
      if (st.sort) {
        var c = cols.filter(function (x) { return x.key === st.sort.key; })[0];
        var get = c.sortValue || function (r) { return r[c.key]; };
        rows.sort(function (a, b) {
          var va = get(a), vb = get(b);
          var r = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR');
          return st.sort.dir === 'ascending' ? r : -r;
        });
      }
      return rows;
    }

    function render() {
      if (st.mode === 'loading') {
        var sk = '';
        for (var i = 0; i < 4; i++) {
          sk += '<tr aria-hidden="true">' + (cfg.selectable ? '<td class="col-check"><span class="skel" style="width:18px;height:18px"></span></td>' : '') +
            cols.map(function (c, j) { return '<td' + (c.num ? ' class="num"' : '') + ' data-label="' + u.esc(c.label) + '"><span class="skel" style="display:inline-block;width:' + (40 + ((i + j) * 17) % 50) + '%"></span></td>'; }).join('') +
            (cfg.actions ? '<td class="col-actions"></td>' : '') + '</tr>';
        }
        tbody.innerHTML = sk;
        el.querySelector('table').setAttribute('aria-busy', 'true');
        status.textContent = 'Carregando ' + nm[1] + '…';
        syncSelection([]);
        return;
      }
      el.querySelector('table').removeAttribute('aria-busy');
      if (st.mode === 'error') {
        tbody.innerHTML = '<tr class="state-row"><td colspan="' + colCount + '">' + ui.state('error', { title: 'Não foi possível carregar os ' + nm[1] + '.', text: 'Verifique sua conexão e tente novamente. Nada do que você fez foi perdido.', action: 'Tentar novamente' }) + '</td></tr>';
        status.textContent = '';
        syncSelection([]);
        return;
      }
      var rows = st.mode === 'empty' ? [] : visibleRows();
      if (!rows.length) {
        var searching = st.q && st.mode !== 'empty';
        tbody.innerHTML = '<tr class="state-row"><td colspan="' + colCount + '">' + ui.state('empty', searching
          ? { title: 'Nenhum ' + nm[0] + ' encontrado para “' + st.q + '”.', text: 'Confira a grafia ou limpe a busca.', action: 'Limpar busca' }
          : (cfg.empty || { title: 'Nenhum ' + nm[0] + ' por aqui ainda.' })) + '</td></tr>';
        status.textContent = searching ? 'Nenhum resultado.' : '';
        syncSelection([]);
        return;
      }
      tbody.innerHTML = rows.map(function (r) {
        var sel = !!st.selected[r.id];
        var label = cfg.rowLabel ? cfg.rowLabel(r) : r.id;
        return '<tr data-id="' + r.id + '"' + (sel ? ' class="is-selected"' : '') + '>' +
          (cfg.selectable ? '<td class="col-check"><span class="check-hit"><input type="checkbox" class="sw-checkbox" data-select="' + r.id + '"' + (sel ? ' checked' : '') + ' aria-label="Selecionar ' + u.esc(label) + '"></span></td>' : '') +
          cols.map(function (c) {
            return '<td class="' + (c.num ? 'num ' : '') + (c.strong ? 'cell-strong ' : '') + (c.wide ? 'cell-wide' : '') + '" data-label="' + u.esc(c.label) + '">' + (c.render ? c.render(r) : u.esc(r[c.key])) + '</td>';
          }).join('') +
          (cfg.actions ? '<td class="col-actions"><button type="button" class="sw-btn sw-btn--ghost sw-btn--icon" data-row-menu="' + r.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Ações para ' + u.esc(label) + '">' + A.icon('more', 20) + '</button></td>' : '') +
        '</tr>';
      }).join('');
      status.textContent = rows.length + ' ' + (rows.length === 1 ? nm[0] : nm[1]) + (st.q ? ' encontrados' : '') + '.';
      syncSelection(rows);
    }

    function syncSelection(rows) {
      var ids = rows.map(function (r) { return r.id; });
      Object.keys(st.selected).forEach(function (id) { if (ids.indexOf(id) < 0) delete st.selected[id]; });
      var n = Object.keys(st.selected).length;
      allBoxes.forEach(function (b) {
        b.disabled = !rows.length;
        b.checked = rows.length > 0 && n === rows.length;
        b.indeterminate = n > 0 && n < rows.length;
      });
      if (!cfg.bulk || !n) { bulk.hidden = true; bulk.innerHTML = ''; return; }
      bulk.hidden = false;
      bulk.innerHTML = '<span>' + n + ' ' + (n === 1 ? 'selecionado' : 'selecionados') + '</span><div class="sw-bulk__actions">' +
        cfg.bulk.map(function (b, i) { return '<button type="button" class="sw-btn sw-btn--secondary" data-bulk-i="' + i + '">' + (b.icon ? A.icon(b.icon, 18) : '') + u.esc(b.label) + '</button>'; }).join('') +
        '<button type="button" class="sw-btn sw-btn--ghost" data-bulk-clear>Limpar seleção</button></div>';
    }

    function load(delay) {
      st.mode = 'loading';
      render();
      return u.wait(delay == null ? 600 : delay).then(function () {
        if (st.mode === 'loading') { st.mode = cfg.forceState && cfg.forceState !== 'loading' ? cfg.forceState : 'ready'; render(); }
      });
    }

    el.addEventListener('input', function (e) {
      if (e.target.matches('.sw-search input')) { st.q = e.target.value; if (st.mode === 'ready') render(); }
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.matches('[data-select-all]')) {
        var rows = visibleRows();
        st.selected = {};
        if (t.checked) rows.forEach(function (r) { st.selected[r.id] = true; });
        render();
      } else if (t.matches('[data-select]')) {
        if (t.checked) st.selected[t.dataset.select] = true; else delete st.selected[t.dataset.select];
        t.closest('tr').classList.toggle('is-selected', t.checked);
        syncSelection(visibleRows());
      } else if (t.id === tid + '-state') {
        cfg.forceState = t.value === 'ready' ? null : t.value;
        if (t.value === 'loading') { st.mode = 'loading'; render(); }
        else { st.mode = t.value; render(); }
      } else if (t.id === tid + '-sort') {
        var p = t.value.split(':');
        setSort(p[0], p[1]);
      }
    });
    el.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-sort]'))) {
        var key = t.dataset.sort;
        var dir = st.sort && st.sort.key === key && st.sort.dir === 'ascending' ? 'descending' : 'ascending';
        setSort(key, dir);
        el.querySelector('[data-sort="' + key + '"]').focus();
        return;
      }
      if (e.target.closest('[data-reload]')) {
        var sel = el.querySelector('#' + tid + '-state');
        if (sel) { sel.value = 'ready'; cfg.forceState = null; }
        load(700); return;
      }
      if (e.target.closest('[data-state-action]')) {
        if (st.mode === 'error') { var s2 = el.querySelector('#' + tid + '-state'); if (s2) { s2.value = 'ready'; cfg.forceState = null; } load(700); }
        else if (st.q) { st.q = ''; el.querySelector('.sw-search input').value = ''; render(); el.querySelector('.sw-search input').focus(); }
        else if (st.mode === 'empty') { var s3 = el.querySelector('#' + tid + '-state'); if (s3) { s3.value = 'ready'; cfg.forceState = null; } st.mode = 'ready'; render(); }
        return;
      }
      if ((t = e.target.closest('[data-bulk-i]'))) {
        cfg.bulk[+t.dataset.bulkI].run(Object.keys(st.selected), api);
        return;
      }
      if (e.target.closest('[data-bulk-clear]')) { st.selected = {}; render(); return; }
      if ((t = e.target.closest('[data-row-menu]'))) {
        var row = cfg.rows().filter(function (r) { return r.id === t.dataset.rowMenu; })[0];
        var acts = cfg.actions(row);
        A.pop.open(t, {
          title: cfg.rowLabel ? cfg.rowLabel(row) : 'Ações',
          placement: 'bottom-end',
          html: '<div class="menu" role="menu" aria-label="Ações">' + acts.map(function (a, i) {
            return (a.danger ? '<hr class="menu__sep" role="separator">' : '') + '<button type="button" role="menuitem" class="menu__item' + (a.danger ? ' menu__item--danger' : '') + '" data-act="' + i + '">' + A.icon(a.icon, 18) + u.esc(a.label) + '</button>';
          }).join('') + '</div>',
          onMount: function (panel) {
            panel.addEventListener('click', function (ev) {
              var b = ev.target.closest('[data-act]');
              if (!b) return;
              A.pop.close(true);
              acts[+b.dataset.act].run(row, api);
            });
          }
        });
      }
    });

    function setSort(key, dir) {
      st.sort = { key: key, dir: dir };
      u.qsa('th[data-col]', el).forEach(function (th) {
        var c = th.dataset.col;
        if (!th.hasAttribute('aria-sort')) return;
        var on = c === key;
        th.setAttribute('aria-sort', on ? dir : 'none');
        th.querySelector('[data-sort-icon]').innerHTML = A.icon(on ? (dir === 'ascending' ? 'arrowUp' : 'arrowDown') : 'arrowUpDown', 14);
      });
      var ss = el.querySelector('#' + tid + '-sort');
      if (ss) ss.value = key + ':' + dir;
      if (st.mode === 'ready') render();
    }

    var api = {
      render: render,
      load: load,
      clearSelection: function () { st.selected = {}; render(); },
      setMode: function (m) { st.mode = m; render(); }
    };
    if (cfg.forceState === 'error' || cfg.forceState === 'empty') {
      var sel0 = el.querySelector('#' + tid + '-state'); if (sel0) sel0.value = cfg.forceState;
    }
    if (cfg.forceState === 'loading') { var sl = el.querySelector('#' + tid + '-state'); if (sl) sl.value = 'loading'; render(); }
    else load(cfg.initialDelay);
    return api;
  };
})();
