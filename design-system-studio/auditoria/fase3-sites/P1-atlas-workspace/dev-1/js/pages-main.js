/* Páginas: Início, Painel (dashboard), Projetos, Projeto, Página/Entrega, Tarefas. */
(function () {
  var A = window.Atlas;
  var u = A.u;
  var D = A.data;
  var ui = A.ui;
  var P = A.pages = A.pages || {};
  A.state = A.state || { period: '30d' };

  function me() { return A.session.get() || { name: 'Convidado' }; }
  function firstName() { return String(me().name).split(' ')[0]; }

  /* ---------- Tarefas: utilitários compartilhados ---------- */
  function dueLabel(iso, done) {
    var d = u.parseDate(iso), t = D.TODAY;
    var diff = Math.round((d - t) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    if (diff < 0 && !done) return 'Atrasada · ' + u.dateShort(iso);
    return u.dateShort(iso);
  }
  P.taskItem = function (t, opts) {
    opts = opts || {};
    var p = D.project(t.project);
    return '<li class="task' + (t.done ? ' is-done' : '') + '" data-task="' + t.id + '">' +
      '<label class="check-hit"><input type="checkbox" class="sw-checkbox" data-task-toggle="' + t.id + '"' + (t.done ? ' checked' : '') + ' aria-label="Concluída: ' + u.esc(t.title) + '"></label>' +
      '<div class="task__body"><p class="task__title">' + u.esc(t.title) + '</p>' +
      '<p class="task__meta">' + (p && !opts.hideProject ? '<a href="#/projetos/' + p.id + '">' + u.esc(p.name) + '</a> · ' : '') + '<span class="' + (/Atrasada/.test(dueLabel(t.due, t.done)) ? 'is-late' : '') + '">' + dueLabel(t.due, t.done) + '</span></p></div>' +
      '<div class="task__side">' + ui.statusBadge(t.priority) +
      (opts.deletable ? '<button type="button" class="sw-btn sw-btn--ghost sw-btn--icon" data-task-delete="' + t.id + '" aria-label="Excluir tarefa: ' + u.esc(t.title) + '">' + A.icon('trash', 18) + '</button>' : '') +
      '</div></li>';
  };
  /** Liga marcar/desmarcar e excluir tarefas dentro de "root". */
  P.bindTasks = function (root, onChange) {
    root.addEventListener('change', function (e) {
      var cb = e.target.closest('[data-task-toggle]');
      if (!cb) return;
      var t = D.tasks.filter(function (x) { return x.id === cb.dataset.taskToggle; })[0];
      if (!t) return;
      t.done = cb.checked;
      var li = cb.closest('.task');
      if (li) li.classList.toggle('is-done', t.done);
      A.toast(t.done ? 'Tarefa concluída.' : 'Tarefa reaberta.', { label: 'Desfazer', run: function () { t.done = !t.done; if (onChange) onChange(); else { cb.checked = t.done; if (li) li.classList.toggle('is-done', t.done); } } });
      if (onChange) setTimeout(onChange, 0);
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-task-delete]');
      if (!b) return;
      var idx = -1;
      D.tasks.forEach(function (x, i) { if (x.id === b.dataset.taskDelete) idx = i; });
      if (idx < 0) return;
      var removed = D.tasks.splice(idx, 1)[0];
      if (onChange) onChange();
      A.toast('Tarefa excluída.', { label: 'Desfazer', run: function () { D.tasks.splice(idx, 0, removed); if (onChange) onChange(); } });
    });
  };

  /* =========================================================
     Início
     ========================================================= */
  P.inicio = function () {
    var h = new Date().getHours();
    var greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    var today = u.isoDate(D.TODAY);
    function todayTasks() { return D.tasks.filter(function (t) { return t.due <= today && (!t.done || t.due === today); }); }
    var events = D.events.filter(function (e) { return e.date >= today; }).sort(function (a, b) { return (a.date + a.start).localeCompare(b.date + b.start); }).slice(0, 4);
    var recent = ['site-institucional', 'viagem-lisboa', 'app-mobile'].map(D.project).filter(Boolean);
    var open = todayTasks().filter(function (t) { return !t.done; }).length;
    var evToday = D.events.filter(function (e) { return e.date === today; }).length;

    return {
      title: 'Início', nav: 'inicio',
      html: '<div class="page">' +
        ui.pageHead({
          overline: u.dateLong(D.TODAY),
          title: greet + ', ' + firstName(),
          desc: 'Você tem <strong data-open-count>' + open + '</strong> ' + (open === 1 ? 'tarefa' : 'tarefas') + ' para hoje e ' + evToday + ' ' + (evToday === 1 ? 'evento' : 'eventos') + ' na agenda.',
          actions: '<a class="sw-btn sw-btn--secondary" href="#/tarefas">' + A.icon('checkSquare', 18) + 'Tarefas</a><a class="sw-btn sw-btn--primary" href="#/projetos?novo=1">' + A.icon('plus', 18) + 'Novo projeto</a>'
        }) +
        '<div class="home-grid">' +
          '<section class="section" aria-labelledby="h-hoje">' + ui.sectionHead('01', 'Para hoje', '<a class="section-link" href="#/tarefas">Ver todas' + A.icon('arrowRight', 16) + '</a>', 'h-hoje') +
            '<div class="sw-panel"><div class="sw-panel__body" data-today></div></div></section>' +
          '<section class="section" aria-labelledby="h-agenda">' + ui.sectionHead('02', 'Agenda', '<a class="section-link" href="#/calendario">Calendário' + A.icon('arrowRight', 16) + '</a>', 'h-agenda') +
            '<div class="sw-panel"><div class="sw-panel__body"><ol class="agenda-list" role="list">' + events.map(function (e) {
              var d = u.parseDate(e.date);
              return '<li><span class="agenda-list__date"><strong>' + d.getDate() + '</strong>' + u.MESES[d.getMonth()] + '</span><span><span class="agenda-list__title">' + u.esc(e.title) + '</span><span class="agenda-list__meta">' + e.start + '–' + e.end + ' · ' + u.esc(e.where) + '</span></span></li>';
            }).join('') + '</ol></div></div></section>' +
        '</div>' +
        '<section class="section" aria-labelledby="h-recentes">' + ui.sectionHead('03', 'Projetos recentes', '<a class="section-link" href="#/projetos">Todos os projetos' + A.icon('arrowRight', 16) + '</a>', 'h-recentes') +
          '<div class="sw-cards">' + recent.map(function (p) { return ui.projectCard(p, D.projects.indexOf(p)); }).join('') + '</div></section>' +
      '</div>',
      mount: function (root) {
        var box = root.querySelector('[data-today]');
        function draw() {
          var list = todayTasks();
          box.innerHTML = list.length ? '<ul class="task-list" role="list">' + list.map(function (t) { return P.taskItem(t); }).join('') + '</ul>'
            : ui.state('empty', { title: 'Nada para hoje.', text: 'Aproveite para planejar a semana.' });
          var oc = root.querySelector('[data-open-count]');
          if (oc) oc.textContent = list.filter(function (t) { return !t.done; }).length;
        }
        draw();
        P.bindTasks(box, draw);
      }
    };
  };

  /* =========================================================
     Painel — Dashboard "Visão geral"
     ========================================================= */
  P.painel = function (ctx) {
    var periodItems = Object.keys(D.periods).map(function (k) { return { value: k, label: D.periods[k].label }; });
    return {
      title: 'Painel', nav: 'painel',
      crumbs: [{ label: 'Painel' }],
      html: '<div class="page">' +
        ui.pageHead({
          overline: '01 — Painel',
          title: 'Visão geral',
          desc: 'Indicadores do workspace no período selecionado.',
          actions: '<div class="dash-actions">' + ui.filter('Período', periodItems, A.state.period, 'data-period') +
            '<button type="button" class="sw-btn sw-btn--secondary" data-export>' + A.icon('download', 18) + 'Exportar CSV</button></div>'
        }) +
        '<section class="section" aria-labelledby="h-kpis">' + ui.sectionHead('01', 'Indicadores', '<span class="muted" data-period-label></span>', 'h-kpis') + '<div data-block="kpis" aria-live="polite"></div></section>' +
        '<div class="dash-grid">' +
          '<section class="section" aria-labelledby="h-chart">' + ui.sectionHead('02', 'Receita', '', 'h-chart') +
            '<div class="sw-panel"><div class="sw-panel__head"><p class="sw-panel__title" data-chart-title></p>' +
            '<button type="button" class="sw-btn sw-btn--ghost" data-chart-table aria-pressed="false">' + A.icon('table', 18) + '<span>Ver tabela</span></button></div>' +
            '<div class="sw-panel__body" data-block="chart"></div></div></section>' +
          '<section class="section" aria-labelledby="h-act">' + ui.sectionHead('03', 'Atividades', '', 'h-act') +
            '<div class="sw-panel"><div class="sw-panel__body" data-block="activities"></div><div class="sw-panel__foot"><a class="section-link" href="#/notificacoes">Ver todas as notificações' + A.icon('arrowRight', 16) + '</a></div></div></section>' +
        '</div>' +
        '<section class="section" aria-labelledby="h-orders">' + ui.sectionHead('04', 'Pedidos recentes', '', 'h-orders') + '<div data-block="orders"></div></section>' +
      '</div>',
      mount: function (root) {
        var showTable = false;
        var data;
        var blocks = {
          kpis: root.querySelector('[data-block="kpis"]'),
          chart: root.querySelector('[data-block="chart"]'),
          activities: root.querySelector('[data-block="activities"]')
        };
        var token = 0;

        function skeleton(name) {
          var b = blocks[name];
          b.setAttribute('aria-busy', 'true');
          if (name === 'kpis') {
            b.innerHTML = '<div class="sw-kpis">' + [0, 1, 2].map(function () {
              return '<div class="sw-kpi" aria-hidden="true"><span class="skel skel--line" style="width:45%"></span><span class="skel skel--title" style="height:34px;width:70%"></span><span class="skel skel--line" style="width:60%"></span><span class="skel" style="height:44px;margin-top:8px"></span></div>';
            }).join('') + '</div><span class="sr-only">Carregando indicadores…</span>';
          } else if (name === 'chart') {
            b.innerHTML = '<div class="skel" style="height:268px" aria-hidden="true"></div><span class="sr-only">Carregando gráfico…</span>';
          } else {
            b.innerHTML = ui.skeletonLines(6);
          }
        }
        function drawKpis() {
          blocks.kpis.removeAttribute('aria-busy');
          var labels = sparkLabels(data.period.labels, 12);
          blocks.kpis.innerHTML = '<div class="sw-kpis">' + data.kpis.map(function (k) { return ui.kpi(k, '#/relatorios/' + k.id); }).join('') + '</div>';
          u.qsa('[data-kpi]', blocks.kpis).forEach(function (card, i) {
            var k = data.kpis[i];
            ui.sparkline(card.querySelector('[data-spark]'), k.spark, labels, k.sparkFmt, '#/relatorios/' + k.id);
          });
        }
        function drawChart() {
          blocks.chart.removeAttribute('aria-busy');
          var unit = data.period.unit;
          root.querySelector('[data-chart-title]').textContent = 'Receita por ' + unit + ' · ' + data.period.label;
          if (showTable) {
            blocks.chart.innerHTML = ui.dataTableSimple('Receita por ' + unit + ' nos últimos ' + data.period.label, data.bars, 'money', unit.charAt(0).toUpperCase() + unit.slice(1));
          } else {
            var maxBar = data.bars.reduce(function (a, b) { return b.value > a.value ? b : a; });
            ui.barChart(blocks.chart, {
              bars: data.bars,
              fmt: 'money',
              series: 'Receita (R$)',
              label: 'Gráfico de barras: receita por ' + unit + ' nos últimos ' + data.period.label + '. Total ' + u.money(data.period.revenue) + '. Maior valor: ' + u.money(maxBar.value) + ' em ' + maxBar.long + '.'
            });
          }
        }
        function drawActivities() {
          blocks.activities.removeAttribute('aria-busy');
          blocks.activities.innerHTML = '<ol class="sw-activity" role="list">' + data.activities.map(function (a) {
            var p = D.person(a.who);
            return '<li>' + ui.sqAvatar(p.name) + '<p><strong>' + u.esc(p.name) + '</strong> ' + u.esc(a.text) + '<span class="meta">' + u.esc(a.project) + ' · ' + u.esc(a.when) + '</span></p></li>';
          }).join('') + '</ol>';
        }
        function load(first) {
          var my = ++token;
          data = D.dashboard(A.state.period);
          root.querySelector('[data-period-label]').textContent = 'Últimos ' + data.period.label;
          var forced = ui.demoState(ctx);
          ['kpis', 'chart', 'activities'].forEach(skeleton);
          if (forced === 'carregando') return;
          var delays = first ? { kpis: 350, chart: 550, activities: 450 } : { kpis: 500, chart: 850, activities: 650 };
          setTimeout(function () { if (my === token) drawKpis(); }, delays.kpis);
          setTimeout(function () { if (my === token) drawChart(); }, delays.chart);
          setTimeout(function () { if (my === token) drawActivities(); }, delays.activities);
        }
        load(true);

        ui.bindFilter(root.querySelector('.dash-actions'), 'data-period', function (v) {
          A.state.period = v;
          load(false);
        });
        root.querySelector('[data-chart-table]').addEventListener('click', function (e) {
          showTable = !showTable;
          var b = e.currentTarget;
          b.setAttribute('aria-pressed', String(showTable));
          b.innerHTML = A.icon(showTable ? 'chart' : 'table', 18) + '<span>' + (showTable ? 'Ver gráfico' : 'Ver tabela') + '</span>';
          if (!blocks.chart.hasAttribute('aria-busy')) drawChart();
        });
        root.querySelector('[data-export]').addEventListener('click', function () {
          var rows = [['Período', 'Receita (R$)']].concat(data.bars.map(function (b) { return [b.long, String(b.value).replace('.', ',')]; }));
          var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\n');
          try {
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'atlas-visao-geral-' + A.state.period + '.csv';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
            A.toast('Arquivo CSV gerado: ' + a.download);
          } catch (err) { A.toast('Não foi possível gerar o arquivo.'); }
        });

        // tabela "Pedidos recentes"
        P.ordersTable(root.querySelector('[data-block="orders"]'), ctx);
      }
    };
  };
  function sparkLabels(labels, n) {
    if (labels.length <= n) return labels.map(function (l) { return l.long; });
    var step = labels.length / n, out = [];
    for (var i = 0; i < n; i++) {
      var a = labels[Math.floor(i * step)], b = labels[Math.min(labels.length - 1, Math.floor((i + 1) * step) - 1)];
      out.push(a === b ? a.short : a.short + '–' + b.short);
    }
    return out;
  }

  P.ordersTable = function (el, ctx) {
    var forced = { carregando: 'loading', vazio: 'empty', erro: 'error' }[ui.demoState(ctx)];
    return ui.dataTable(el, {
      caption: 'Pedidos recentes',
      itemName: ['pedido', 'pedidos'],
      rows: function () { return D.orders; },
      rowLabel: function (r) { return 'pedido de ' + r.client; },
      selectable: true,
      demoStates: true,
      forceState: forced,
      search: { placeholder: 'Buscar por cliente', keys: ['client'] },
      sort: { key: 'date', dir: 'descending' },
      empty: { title: 'Nenhum pedido no período.', text: 'Quando novos pedidos chegarem, eles aparecem aqui.' },
      columns: [
        { key: 'client', label: 'Cliente', sortable: true, strong: true, wide: false },
        { key: 'status', label: 'Status', sortable: true, render: function (r) { return ui.statusBadge(r.status); } },
        { key: 'value', label: 'Valor', sortable: true, num: true, render: function (r) { return u.money(r.value); } },
        { key: 'date', label: 'Data', sortable: true, num: true, render: function (r) { return '<time datetime="' + r.date + '">' + u.dateBR(r.date) + '</time>'; } }
      ],
      actions: function () {
        return [
          { label: 'Ver detalhes', icon: 'external', run: function (r) { orderModal(r); } },
          { label: 'Marcar como pago', icon: 'check', run: function (r, api) { r.status = 'Pago'; api.render(); A.toast('Pedido de ' + r.client + ' marcado como pago.'); } },
          { label: 'Excluir', icon: 'trash', danger: true, run: function (r, api) { removeOrders([r.id], api); } }
        ];
      },
      bulk: [
        { label: 'Marcar como pago', icon: 'check', run: function (ids, api) { D.orders.forEach(function (o) { if (ids.indexOf(o.id) >= 0) o.status = 'Pago'; }); api.clearSelection(); A.toast(ids.length + (ids.length === 1 ? ' pedido marcado' : ' pedidos marcados') + ' como pago.'); } },
        { label: 'Excluir', icon: 'trash', run: function (ids, api) { removeOrders(ids, api); } }
      ]
    });
  };
  function removeOrders(ids, api) {
    var backup = D.orders.slice();
    for (var i = D.orders.length - 1; i >= 0; i--) if (ids.indexOf(D.orders[i].id) >= 0) D.orders.splice(i, 1);
    api.clearSelection();
    A.toast(ids.length === 1 ? 'Pedido excluído.' : ids.length + ' pedidos excluídos.', { label: 'Desfazer', run: function () { D.orders.length = 0; backup.forEach(function (o) { D.orders.push(o); }); api.render(); } });
  }
  function orderModal(r) {
    A.modal({
      title: 'Pedido de ' + r.client,
      body: '<dl class="sw-dl">' +
        '<div><dt>Cliente</dt><dd>' + u.esc(r.client) + '</dd></div>' +
        '<div><dt>Status</dt><dd>' + ui.statusBadge(r.status) + '</dd></div>' +
        '<div><dt>Valor</dt><dd class="tabular">' + u.money(r.value) + '</dd></div>' +
        '<div><dt>Data</dt><dd>' + u.dateBR(r.date) + '</dd></div>' +
        '<div><dt>Código</dt><dd>#' + r.id.toUpperCase() + '-2026</dd></div></dl>',
      foot: '<button type="button" class="sw-btn sw-btn--primary" data-close data-autofocus>Fechar</button>'
    });
  }

  /* =========================================================
     Projetos
     ========================================================= */
  P.projetos = function (ctx) {
    var filter = 'todos';
    var q = ctx.query.q ? ctx.query.q : '';
    function counts() {
      var c = { todos: D.projects.length, andamento: 0, novo: 0, pausado: 0, concluido: 0 };
      D.projects.forEach(function (p) { c[p.status]++; });
      return c;
    }
    function filterItems() {
      var c = counts();
      return [
        { value: 'todos', label: 'Todos', count: c.todos },
        { value: 'andamento', label: 'Em andamento', count: c.andamento },
        { value: 'novo', label: 'Novos', count: c.novo },
        { value: 'pausado', label: 'Pausados', count: c.pausado },
        { value: 'concluido', label: 'Concluídos', count: c.concluido }
      ];
    }
    return {
      title: 'Projetos', nav: 'projetos',
      crumbs: [{ label: 'Projetos' }],
      html: '<div class="page">' +
        ui.pageHead({
          overline: 'Geral',
          title: 'Projetos',
          desc: '<span data-proj-total>' + D.projects.length + '</span> projetos no workspace. Clique em um card para ver páginas, tarefas e equipe.',
          actions: '<button type="button" class="sw-btn sw-btn--primary" data-new-project>' + A.icon('plus', 18) + 'Novo projeto</button>'
        }) +
        '<section class="section" aria-labelledby="h-proj">' +
          '<h2 class="sr-only" id="h-proj">Lista de projetos</h2>' +
          '<div class="list-tools"><div data-filter-box>' + ui.filter('Filtrar por status', filterItems(), filter) + '</div>' +
          '<div class="sw-search">' + A.icon('search', 18) + '<label class="sr-only" for="proj-q">Buscar projetos</label><input class="sw-input" id="proj-q" type="search" placeholder="Buscar projetos" value="' + u.esc(q) + '" autocomplete="off"></div></div>' +
          '<p class="sr-only" role="status" data-proj-status></p>' +
          '<div data-grid></div>' +
        '</section>' +
      '</div>',
      mount: function (root) {
        var grid = root.querySelector('[data-grid]');
        var status = root.querySelector('[data-proj-status]');
        var forced = ui.demoState(ctx);
        function draw() {
          if (forced === 'erro') {
            grid.innerHTML = ui.state('error', { title: 'Não foi possível carregar os projetos.', text: 'Verifique sua conexão e tente novamente.', action: 'Tentar novamente', box: true });
            return;
          }
          var nq = u.norm(q);
          var list = forced === 'vazio' ? [] : D.projects.filter(function (p) {
            return (filter === 'todos' || p.status === filter) && (!nq || u.norm(p.name + ' ' + p.desc).indexOf(nq) >= 0);
          });
          if (!list.length) {
            grid.innerHTML = ui.state('empty', (filter !== 'todos' || q)
              ? { title: 'Nenhum projeto encontrado.', text: 'Tente outro termo de busca ou outro filtro.', action: 'Limpar filtros', box: true }
              : { title: 'Nenhum projeto ainda.', text: 'Crie o primeiro projeto para organizar o trabalho da equipe.', box: true });
            status.textContent = 'Nenhum projeto encontrado.';
            return;
          }
          grid.innerHTML = '<div class="sw-cards">' + list.map(function (p) { return ui.projectCard(p, D.projects.indexOf(p)); }).join('') + '</div>';
          status.textContent = list.length + (list.length === 1 ? ' projeto' : ' projetos') + '.';
        }
        grid.innerHTML = ui.skeletonCards(3);
        if (forced !== 'carregando') setTimeout(draw, 450);

        ui.bindFilter(root.querySelector('[data-filter-box]'), 'data-filter', function (v) { filter = v; draw(); });
        root.querySelector('#proj-q').addEventListener('input', function (e) { q = e.target.value; draw(); });
        grid.addEventListener('click', function (e) {
          if (!e.target.closest('[data-state-action]')) return;
          if (forced === 'erro') { forced = null; grid.innerHTML = ui.skeletonCards(3); setTimeout(draw, 600); return; }
          filter = 'todos'; q = '';
          root.querySelector('#proj-q').value = '';
          root.querySelector('[data-filter-box]').innerHTML = ui.filter('Filtrar por status', filterItems(), filter);
          draw();
        });
        function openNew(trigger) {
          P.newProjectModal(function (p) {
            root.querySelector('[data-filter-box]').innerHTML = ui.filter('Filtrar por status', filterItems(), filter);
            root.querySelector('[data-proj-total]').textContent = D.projects.length;
            draw();
            A.shell.refreshBadges();
            A.toast('Projeto “' + p.name + '” criado.');
          });
        }
        root.querySelector('[data-new-project]').addEventListener('click', function (e) { openNew(e.currentTarget); });
        if (ctx.query.novo) {
          setTimeout(function () { openNew(); }, 50);
          history.replaceState(null, '', '#/projetos');
        }
      }
    };
  };

  P.newProjectModal = function (onCreate) {
    var today = u.isoDate(D.TODAY);
    A.modal({
      title: 'Novo projeto',
      body: '<form class="sw-form" novalidate id="np-form">' +
        '<div data-summary role="alert"></div>' +
        '<div class="sw-field"><label class="sw-label" for="np-name">Nome do projeto</label><input class="sw-input" id="np-name" name="name" required aria-describedby="np-name-msg" data-autofocus><p class="field__msg" id="np-name-msg" data-msg-for="name"></p></div>' +
        '<div class="sw-field"><label class="sw-label" for="np-desc">Descrição <span class="opt">(opcional)</span></label><textarea class="sw-textarea" id="np-desc" name="desc" rows="3"></textarea></div>' +
        '<div class="sw-form-grid">' +
          '<div class="sw-field"><label class="sw-label" for="np-status">Status</label>' + ui.select({ id: 'np-status', name: 'status', options: [{ value: 'novo', label: 'Novo' }, { value: 'andamento', label: 'Em andamento' }, { value: 'pausado', label: 'Pausado' }], value: 'novo' }) + '</div>' +
          '<div class="sw-field"><label class="sw-label" for="np-due">Prazo</label><input class="sw-input" id="np-due" name="due" type="date" min="' + today + '" required aria-describedby="np-due-msg"><p class="field__msg" id="np-due-msg" data-msg-for="due"></p></div>' +
        '</div></form>',
      foot: '<button type="button" class="sw-btn sw-btn--secondary" data-close>Cancelar</button><button type="submit" form="np-form" class="sw-btn sw-btn--primary">Criar projeto</button>',
      onMount: function (dlg, close) {
        var form = dlg.querySelector('form');
        var btn = dlg.querySelector('[type="submit"]');
        A.forms.bind(form, {
          name: { label: 'Nome do projeto', validate: function (v) { v = v.trim(); if (!v) return 'Dê um nome ao projeto.'; if (v.length < 3) return 'Use pelo menos 3 caracteres.'; return ''; } },
          due: { label: 'Prazo', validate: function (v) { if (!v) return 'Escolha uma data de prazo.'; if (v < today) return 'O prazo não pode estar no passado.'; return ''; } }
        }, {
          summary: form.querySelector('[data-summary]'),
          onSubmit: function (f) {
            A.forms.busy(f, btn, true, 'Criando…');
            u.wait(700).then(function () {
              var name = f.elements.name.value.trim();
              var id = u.norm(name).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 5);
              var p = { id: id, name: name, status: f.elements.status.value, icon: 'folder', desc: f.elements.desc.value.trim() || 'Projeto recém-criado. Adicione uma descrição para a equipe.', owner: 'p1', due: f.elements.due.value, progress: 0, team: ['p1'], items: [] };
              D.projects.unshift(p);
              close();
              onCreate(p);
            });
          }
        });
      }
    });
  };

  /* =========================================================
     Projeto (detalhe)
     ========================================================= */
  P.projeto = function (ctx) {
    var p = D.project(ctx.parts[1]);
    if (!p) return P.notFound('Projeto não encontrado', 'O projeto pode ter sido removido ou o endereço está incorreto.', '#/projetos', 'Voltar para projetos', 'projetos');
    var kind = p.id === 'site-institucional' ? ['Página', 'Páginas'] : ['Entrega', 'Entregas'];
    var crumbs = [{ label: 'Projetos', href: '#/projetos' }, { label: p.name }];
    var owner = D.person(p.owner);
    return {
      title: p.name, nav: 'projetos', crumbs: crumbs,
      html: '<div class="page">' + A.shell.backLink(crumbs) +
        ui.pageHead({ overline: 'Projeto · ' + D.STATUS[p.status], title: p.name, desc: u.esc(p.desc),
          actions: '<a class="sw-btn sw-btn--secondary" href="#/mensagens">' + A.icon('message', 18) + 'Conversar</a>' }) +
        '<section class="section" aria-labelledby="h-res">' + ui.sectionHead('01', 'Resumo', '', 'h-res') +
          '<dl class="meta-grid">' +
            '<div><dt>Status</dt><dd>' + ui.statusBadge(D.STATUS[p.status]) + '</dd></div>' +
            '<div><dt>Responsável</dt><dd>' + u.esc(owner ? owner.name : '—') + '</dd></div>' +
            '<div><dt>Prazo</dt><dd>' + u.dateBR(p.due) + '</dd></div>' +
            '<div><dt>Progresso</dt><dd><div class="sw-progress"><div class="sw-progress__label"><span>Concluído</span><span class="tabular">' + p.progress + '%</span></div><div class="sw-progress__bar" role="progressbar" aria-valuenow="' + p.progress + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso do projeto"><span style="width:' + p.progress + '%"></span></div></div></dd></div>' +
          '</dl></section>' +
        '<section class="section" aria-labelledby="h-items">' + ui.sectionHead('02', kind[1], '', 'h-items') +
          (p.items.length ? '<ul class="row-list" role="list">' + p.items.map(function (it, i) {
            return '<li><a class="row-link" href="#/projetos/' + p.id + '/' + it.id + '"><span class="row-link__num">' + String(i + 1).padStart(2, '0') + '</span><span class="row-link__main"><span class="row-link__title">' + u.esc(it.name) + '</span><span class="row-link__meta">Atualizada em ' + u.dateBR(it.updated) + '</span></span>' + ui.statusBadge(it.status) + A.icon('chevronRight', 18) + '</a></li>';
          }).join('') + '</ul>' : ui.state('empty', { title: 'Nenhuma ' + kind[0].toLowerCase() + ' ainda.', text: 'Adicione a primeira ' + kind[0].toLowerCase() + ' deste projeto.', box: true })) +
        '</section>' +
        '<div class="two-col">' +
          '<section class="section" aria-labelledby="h-ptasks">' + ui.sectionHead('03', 'Tarefas', '<a class="section-link" href="#/tarefas">Todas' + A.icon('arrowRight', 16) + '</a>', 'h-ptasks') + '<div class="sw-panel"><div class="sw-panel__body" data-ptasks></div></div></section>' +
          '<section class="section" aria-labelledby="h-team">' + ui.sectionHead('04', 'Equipe', '', 'h-team') +
            '<div class="sw-panel"><div class="sw-panel__body"><ul class="people-list" role="list">' + p.team.map(function (id) {
              var x = D.person(id);
              return '<li>' + ui.sqAvatar(x.name) + '<span><strong>' + u.esc(x.name) + '</strong><small>' + u.esc(x.role) + '</small></span></li>';
            }).join('') + '</ul></div></div></section>' +
        '</div>' +
      '</div>',
      mount: function (root) {
        var box = root.querySelector('[data-ptasks]');
        function draw() {
          var list = D.tasks.filter(function (t) { return t.project === p.id; });
          box.innerHTML = list.length ? '<ul class="task-list" role="list">' + list.map(function (t) { return P.taskItem(t, { hideProject: true }); }).join('') + '</ul>'
            : ui.state('empty', { title: 'Sem tarefas neste projeto.', text: 'Crie tarefas na página Tarefas.' });
        }
        draw();
        P.bindTasks(box, draw);
      }
    };
  };

  /* =========================================================
     Página / entrega de um projeto (3º nível da trilha)
     ========================================================= */
  P.item = function (ctx) {
    var p = D.project(ctx.parts[1]);
    var it = p && p.items.filter(function (x) { return x.id === ctx.parts[2]; })[0];
    if (!it) return P.notFound('Página não encontrada', 'Esta página não existe neste projeto.', p ? '#/projetos/' + p.id : '#/projetos', 'Voltar para o projeto', 'projetos');
    var kind = p.id === 'site-institucional' ? 'Página' : 'Entrega';
    var crumbs = [{ label: 'Projetos', href: '#/projetos' }, { label: p.name, href: '#/projetos/' + p.id }, { label: it.name }];
    return {
      title: it.name, nav: 'projetos', crumbs: crumbs,
      html: '<div class="page">' + A.shell.backLink(crumbs) +
        ui.pageHead({ overline: kind + ' · ' + p.name, title: it.name, desc: 'Última atualização em ' + u.dateBR(it.updated) + '. Status atual: ' + it.status + '.',
          actions: '<div class="sw-field"><label class="sw-label" for="it-status">Status</label>' + ui.select({ id: 'it-status', options: ['Rascunho', 'Em revisão', 'Publicado'], value: it.status }) + '</div>' }) +
        '<div class="two-col">' +
          '<section class="section" aria-labelledby="h-sec">' + ui.sectionHead('01', 'Seções', '<span class="muted tabular" data-sec-count></span>', 'h-sec') +
            '<div class="sw-panel"><div class="sw-panel__body"><ul class="check-list" role="list">' + it.sections.map(function (s, i) {
              return '<li><label class="sw-check sw-check--center"><input type="checkbox" class="sw-checkbox" data-sec="' + i + '"' + (s.done ? ' checked' : '') + '> <span>' + u.esc(s.name) + '</span></label></li>';
            }).join('') + '</ul></div></div></section>' +
          '<section class="section" aria-labelledby="h-com">' + ui.sectionHead('02', 'Comentários', '', 'h-com') +
            '<div class="sw-panel"><div class="sw-panel__body"><ol class="sw-activity" role="list" data-comments></ol>' +
            '<form class="sw-form comment-form" novalidate><div data-summary role="alert"></div>' +
              '<div class="sw-field"><label class="sw-label" for="cm-text">Novo comentário</label><textarea class="sw-textarea" id="cm-text" name="text" rows="3" required aria-describedby="cm-text-msg" placeholder="Escreva um comentário para a equipe"></textarea><p class="field__msg" id="cm-text-msg" data-msg-for="text"></p></div>' +
              '<div class="sw-form-foot"><button type="submit" class="sw-btn sw-btn--primary">' + A.icon('send', 18) + 'Comentar</button></div>' +
            '</form></div></div></section>' +
        '</div>' +
      '</div>',
      mount: function (root) {
        var list = root.querySelector('[data-comments]');
        function drawComments() {
          list.innerHTML = it.comments.length ? it.comments.map(function (c) {
            var who = c.who === 'me' ? me().name : D.person(c.who).name;
            return '<li>' + ui.sqAvatar(who) + '<p><strong>' + u.esc(who) + '</strong> ' + u.esc(c.text) + '<span class="meta">' + u.esc(c.when) + '</span></p></li>';
          }).join('') : '<li class="empty-li">' + ui.state('empty', { title: 'Nenhum comentário ainda.', text: 'Comece a conversa abaixo.' }) + '</li>';
        }
        function secCount() {
          var d = it.sections.filter(function (s) { return s.done; }).length;
          root.querySelector('[data-sec-count]').textContent = d + ' de ' + it.sections.length + ' prontas';
        }
        drawComments(); secCount();
        root.querySelector('.check-list').addEventListener('change', function (e) {
          var cb = e.target.closest('[data-sec]'); if (!cb) return;
          it.sections[+cb.dataset.sec].done = cb.checked; secCount();
        });
        root.querySelector('#it-status').addEventListener('change', function (e) {
          it.status = e.target.value;
          A.toast('Status alterado para “' + it.status + '”.');
        });
        var form = root.querySelector('.comment-form');
        var btn = form.querySelector('[type="submit"]');
        A.forms.bind(form, { text: { label: 'Comentário', validate: function (v) { return v.trim() ? '' : 'Escreva algo antes de enviar.'; } } }, {
          summary: form.querySelector('[data-summary]'),
          onSubmit: function (f) {
            A.forms.busy(f, btn, true, 'Enviando…');
            u.wait(600).then(function () {
              it.comments.push({ who: 'me', text: f.elements.text.value.trim(), when: 'agora' });
              f.elements.text.value = '';
              A.forms.busy(f, btn, false);
              drawComments();
              A.toast('Comentário publicado.');
            });
          }
        });
      }
    };
  };

  /* =========================================================
     Tarefas
     ========================================================= */
  P.tarefas = function (ctx) {
    var filter = 'abertas';
    var q = ctx.query.q ? ctx.query.q : '';
    if (q) filter = 'todas';
    var today = u.isoDate(D.TODAY);
    function items() {
      var open = D.tasks.filter(function (t) { return !t.done; }).length;
      return [
        { value: 'abertas', label: 'Abertas', count: open },
        { value: 'concluidas', label: 'Concluídas', count: D.tasks.length - open },
        { value: 'todas', label: 'Todas', count: D.tasks.length }
      ];
    }
    return {
      title: 'Tarefas', nav: 'tarefas', crumbs: [{ label: 'Tarefas' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Geral', title: 'Tarefas', desc: 'Acompanhe o que precisa ser feito em todos os projetos.' }) +
        '<section class="section" aria-labelledby="h-new">' + ui.sectionHead('01', 'Nova tarefa', '', 'h-new') +
          '<form class="sw-form task-form" novalidate><div data-summary role="alert"></div>' +
            '<div class="task-form__grid">' +
              '<div class="sw-field task-form__title"><label class="sw-label" for="nt-title">Título</label><input class="sw-input" id="nt-title" name="title" required aria-describedby="nt-title-msg" placeholder="O que precisa ser feito?"><p class="field__msg" id="nt-title-msg" data-msg-for="title"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="nt-project">Projeto</label>' + ui.select({ id: 'nt-project', name: 'project', options: D.projects.map(function (p) { return { value: p.id, label: p.name }; }), value: 'site-institucional' }) + '</div>' +
              '<div class="sw-field"><label class="sw-label" for="nt-due">Prazo</label><input class="sw-input" id="nt-due" name="due" type="date" value="' + today + '" required aria-describedby="nt-due-msg"><p class="field__msg" id="nt-due-msg" data-msg-for="due"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="nt-pri">Prioridade</label>' + ui.select({ id: 'nt-pri', name: 'priority', options: ['Alta', 'Média', 'Baixa'], value: 'Média' }) + '</div>' +
              '<div class="task-form__submit"><button type="submit" class="sw-btn sw-btn--primary sw-btn--block">' + A.icon('plus', 18) + 'Adicionar</button></div>' +
            '</div></form></section>' +
        '<section class="section" aria-labelledby="h-list">' + ui.sectionHead('02', 'Lista', '', 'h-list') +
          '<div class="list-tools"><div data-filter-box>' + ui.filter('Filtrar tarefas', items(), filter) + '</div>' +
          '<div class="sw-search">' + A.icon('search', 18) + '<label class="sr-only" for="task-q">Buscar tarefas</label><input class="sw-input" id="task-q" type="search" placeholder="Buscar tarefas" value="' + u.esc(q) + '" autocomplete="off"></div></div>' +
          '<div class="sw-panel"><div class="sw-panel__body" data-list></div></div>' +
        '</section>' +
      '</div>',
      mount: function (root) {
        var box = root.querySelector('[data-list]');
        var forced = ui.demoState(ctx);
        function refreshFilter() { root.querySelector('[data-filter-box]').innerHTML = ui.filter('Filtrar tarefas', items(), filter); }
        function draw() {
          refreshFilter();
          if (forced === 'erro') { box.innerHTML = ui.state('error', { title: 'Não foi possível carregar as tarefas.', text: 'Tente novamente em instantes.', action: 'Tentar novamente' }); return; }
          var nq = u.norm(q);
          var list = forced === 'vazio' ? [] : D.tasks.filter(function (t) {
            return (filter === 'todas' || (filter === 'abertas' ? !t.done : t.done)) && (!nq || u.norm(t.title).indexOf(nq) >= 0);
          }).sort(function (a, b) { return a.due.localeCompare(b.due); });
          box.innerHTML = list.length ? '<ul class="task-list" role="list">' + list.map(function (t) { return P.taskItem(t, { deletable: true }); }).join('') + '</ul>'
            : ui.state('empty', q ? { title: 'Nenhuma tarefa encontrada para “' + q + '”.', action: 'Limpar busca' }
              : filter === 'abertas' ? { title: 'Tudo em dia!', text: 'Nenhuma tarefa aberta. Que tal planejar a próxima?' }
              : { title: 'Nenhuma tarefa aqui.', text: 'As tarefas concluídas aparecem nesta lista.' });
        }
        box.innerHTML = ui.skeletonLines(5);
        if (forced !== 'carregando') setTimeout(draw, 400);
        ui.bindFilter(root.querySelector('[data-filter-box]'), 'data-filter', function (v) { filter = v; draw(); });
        root.querySelector('#task-q').addEventListener('input', function (e) { q = e.target.value; draw(); });
        box.addEventListener('click', function (e) {
          if (!e.target.closest('[data-state-action]')) return;
          if (forced === 'erro') { forced = null; box.innerHTML = ui.skeletonLines(5); setTimeout(draw, 600); return; }
          q = ''; root.querySelector('#task-q').value = ''; draw();
        });
        P.bindTasks(box, draw);

        var form = root.querySelector('.task-form');
        var btn = form.querySelector('[type="submit"]');
        A.forms.bind(form, {
          title: { label: 'Título', validate: function (v) { return v.trim() ? (v.trim().length < 3 ? 'Use pelo menos 3 caracteres.' : '') : 'Descreva a tarefa.'; } },
          due: { label: 'Prazo', validate: function (v) { return v ? '' : 'Escolha um prazo.'; } }
        }, {
          summary: form.querySelector('[data-summary]'),
          onSubmit: function (f) {
            A.forms.busy(f, btn, true, 'Adicionando…');
            u.wait(500).then(function () {
              D.tasks.push({ id: 't' + Date.now(), title: f.elements.title.value.trim(), project: f.elements.project.value, due: f.elements.due.value, done: false, priority: f.elements.priority.value, who: 'p1' });
              f.elements.title.value = '';
              A.forms.busy(f, btn, false);
              filter = 'abertas'; forced = null;
              draw();
              A.toast('Tarefa adicionada.');
              f.elements.title.focus();
            });
          }
        });
      }
    };
  };

  /* ---------- Não encontrado ---------- */
  P.notFound = function (title, text, href, label, nav) {
    return {
      title: title, nav: nav || '', crumbs: [{ label: title }],
      html: '<div class="page">' + ui.pageHead({ overline: 'Erro 404', title: title, desc: u.esc(text) }) +
        '<div><a class="sw-btn sw-btn--primary" href="' + href + '">' + A.icon('arrowLeft', 18) + u.esc(label) + '</a></div></div>'
    };
  };
})();
