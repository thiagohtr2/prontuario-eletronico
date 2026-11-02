/* Páginas do aplicativo (parte 1): Início, Painel, Projetos, Tarefas, Calendário. */
(function () {
  'use strict';

  var A = window.Atlas;
  var icon = A.icon;
  var esc = A.esc;

  /* ---------- auxiliares de estado de carregamento ---------- */
  A.skel = function (rows) {
    var out = '';
    for (var i = 0; i < (rows || 3); i++) {
      out += '<div class="sk-line" style="width:' + (55 + ((i * 23) % 40)) + '%;margin:14px 0"></div>';
    }
    return '<div class="skel" aria-hidden="true">' + out + '</div><p class="sr-only">Carregando…</p>';
  };

  A.loadInto = function (el, html, delay) {
    if (!el) return;
    el.setAttribute('aria-busy', 'true');
    window.setTimeout(function () {
      if (!el.isConnected) return;
      el.innerHTML = html;
      el.removeAttribute('aria-busy');
    }, delay == null ? 400 : delay);
  };

  function firstName(name) {
    return String(name || '').split(' ')[0] || '';
  }

  function greeting() {
    var h = new Date().getHours();
    return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  function pageHead(eyebrow, title, sub, actions) {
    return '<div class="page-head">' +
      '<div class="page-head__row"><div><p class="sw-eyebrow">' + esc(eyebrow) + '</p>' +
      '<h1 class="page-title">' + esc(title) + '</h1></div>' + (actions || '') + '</div>' +
      (sub ? '<p class="page-sub">' + esc(sub) + '</p>' : '') +
    '</div>';
  }

  /* ==========================================================================
     Início
     ========================================================================== */
  var TODAY_TASKS = [
    { id: 't1', title: 'Revisar proposta do Studio Varela', done: false },
    { id: 't2', title: 'Aprovar textos da campanha de outono', done: false },
    { id: 't3', title: 'Responder mensagens da equipe', done: true }
  ];

  A.register('/app/inicio', {
    kind: 'app',
    title: 'Início',
    render: function () {
      var s = A.session.get() || {};
      return '<section aria-labelledby="home-title">' +
        '<div class="page-head"><p class="sw-eyebrow">01 — Início</p>' +
        '<h1 id="home-title" class="page-title">' + esc(greeting()) + (firstName(s.name) ? ', ' + esc(firstName(s.name)) : '') + '</h1>' +
        '<p class="page-sub">Veja o que precisa da sua atenção hoje.</p></div>' +
        '<div class="grid-2">' +
          '<section class="panel" aria-labelledby="home-tasks"><h2 id="home-tasks" class="panel__title">Tarefas de hoje</h2>' +
            '<ul class="list" id="home-task-list">' + TODAY_TASKS.map(function (t) {
              return '<li><label class="check" style="min-height:40px"><input type="checkbox" data-task="' + t.id + '"' + (t.done ? ' checked' : '') + '>' +
                '<span>' + esc(t.title) + '</span></label></li>';
            }).join('') + '</ul>' +
            '<p style="margin-top:12px"><a href="#/app/tarefas">Ver todas as tarefas</a></p>' +
          '</section>' +
          '<section class="panel" aria-labelledby="home-events"><h2 id="home-events" class="panel__title">Próximos compromissos</h2>' +
            '<ul class="list">' +
              '<li><a class="list-row" href="#/app/calendario"><span class="list-row__main"><span class="list-row__title">Reunião de alinhamento</span><span class="list-row__meta">Hoje · 15:00 · Sala 2</span></span>' + icon('arrowRight', { size: 18 }) + '</a></li>' +
              '<li><a class="list-row" href="#/app/calendario"><span class="list-row__main"><span class="list-row__title">Entrega: aplicativo v2.0</span><span class="list-row__meta">Amanhã · 10:00</span></span>' + icon('arrowRight', { size: 18 }) + '</a></li>' +
            '</ul>' +
          '</section>' +
        '</div>' +
        '<section class="panel" aria-labelledby="home-projects"><h2 id="home-projects" class="panel__title">Projetos recentes</h2>' +
          '<ul class="list">' +
            '<li><a class="list-row" href="#/app/projetos"><span class="list-row__main"><span class="list-row__title">Site institucional</span><span class="list-row__meta">8 tarefas · 4 membros</span></span><span class="list-row__end">Em andamento</span></a></li>' +
            '<li><a class="list-row" href="#/app/projetos"><span class="list-row__main"><span class="list-row__title">Campanha de outono</span><span class="list-row__meta">5 tarefas · 2 membros</span></span><span class="list-row__end">Em revisão</span></a></li>' +
          '</ul>' +
        '</section>' +
      '</section>';
    },
    init: function (root) {
      root.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.getAttribute || !t.getAttribute('data-task')) return;
        var item = TODAY_TASKS.filter(function (x) { return x.id === t.getAttribute('data-task'); })[0];
        if (item) item.done = t.checked;
      });
    }
  });

  /* ==========================================================================
     Painel (Dashboard Swiss): KPIs + gráfico principal (2/3) + atividades (1/3)
     ========================================================================== */
  var SERIES = {
    '7': {
      bars: [1.4, 2.1, 1.6, 2.2, 1.9, 1.3, 2.3],
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      title: 'Receita por dia',
      unitName: 'dia',
      compare: 'vs. semana anterior',
      kpis: [{ v: 'R$ 12,8 mil', pct: 4.1 }, { v: '64', pct: 6.2 }, { v: '9', pct: 12.5 }]
    },
    '30': {
      bars: [10.8, 12.1, 11.4, 13.9],
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      title: 'Receita por semana',
      unitName: 'semana',
      compare: 'vs. mês anterior',
      kpis: [{ v: 'R$ 48,2 mil', pct: 12.4 }, { v: '286', pct: 5.9 }, { v: '34', pct: -2.1 }]
    },
    '90': {
      bars: [40.2, 45.6, 45.8],
      labels: ['Ago', 'Set', 'Out'],
      title: 'Receita por mês',
      unitName: 'mês',
      compare: 'vs. trimestre anterior',
      kpis: [{ v: 'R$ 131,6 mil', pct: -3.2 }, { v: '841', pct: -1.8 }, { v: '97', pct: 8.3 }]
    }
  };

  var KPI_LABELS = ['Receita mensal', 'Tarefas concluídas', 'Novos clientes'];
  var KPI_ICONS = ['wallet', 'check', 'users'];

  function fmtPct(v) {
    var s = Math.abs(v).toFixed(1).replace('.', ',') + '%';
    return (v > 0 ? '+' : v < 0 ? '-' : '') + s;
  }

  function fmtMil(v) {
    return 'R$ ' + v.toFixed(1).replace('.', ',') + ' mil';
  }

  function sparkData(seed, n) {
    var s = seed;
    var out = [];
    for (var i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(0.25 + (s / 233280) * 0.6 + i * 0.03);
    }
    return out;
  }

  function sparkSvg(values, idx) {
    var w = 200;
    var h = 48;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var span = max - min || 1;
    var pad = 6;
    var pts = values.map(function (v, i) {
      return {
        x: values.length > 1 ? pad + (i * (w - 2 * pad)) / (values.length - 1) : w / 2,
        y: h - 8 - ((v - min) / span) * (h - 16)
      };
    });
    var poly = pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    var squares = pts.map(function (p, i) {
      return '<rect x="' + (p.x - 3).toFixed(1) + '" y="' + (p.y - 3).toFixed(1) + '" width="6" height="6">' +
        '<title>Ponto ' + (i + 1) + ': ' + (values[i] * 100).toFixed(0) + '</title></rect>';
    }).join('');
    return '<svg class="kpi__spark" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Tendência do indicador ' + (idx + 1) + '" data-action="go-report" style="cursor:pointer">' +
      '<polyline points="' + poly + '"/>' + squares + '</svg>';
  }

  function kpisHtml(period) {
    var cfg = SERIES[period];
    return cfg.kpis.map(function (k, i) {
      var dir = k.pct > 0 ? 'up' : k.pct < 0 ? 'down' : 'flat';
      var arrow = dir === 'up' ? 'arrowUp' : dir === 'down' ? 'arrowDown' : 'arrowRight';
      return '<article class="kpi kpi--' + dir + '">' +
        '<a class="kpi__link" href="#/app/relatorios" aria-label="' + esc(KPI_LABELS[i] + ': ' + k.v + ', ver relatório') + '"></a>' +
        '<div class="kpi__top"><span class="sw-label">' + esc(KPI_LABELS[i]) + '</span>' + icon(KPI_ICONS[i], { size: 18 }) + '</div>' +
        '<p class="kpi__value">' + esc(k.v) + '</p>' +
        '<p class="kpi__var"><strong>' + icon(arrow, { size: 14 }) + ' ' + esc(fmtPct(k.pct)) + '</strong><span>' + esc(cfg.compare) + '</span></p>' +
        sparkSvg(sparkData(41 + i * 17 + Number(period), 8), i) +
      '</article>';
    }).join('');
  }

  function chartHtml(period) {
    var cfg = SERIES[period];
    var max = Math.max.apply(null, cfg.bars);
    var top = max * 1.15;
    var cols = cfg.bars.map(function (v, i) {
      var pct = Math.max(2, (v / top) * 100).toFixed(1);
      var label = cfg.labels[i] + ': ' + fmtMil(v);
      return '<div class="bar-col"><span class="bar-tip" aria-hidden="true">' + esc(fmtMil(v)) + '</span>' +
        '<button type="button" class="bar" style="--h:' + pct + '%" aria-label="' + esc(label) + '"></button></div>';
    }).join('');
    var labels = cfg.labels.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('');
    var rows = cfg.bars.map(function (v, i) {
      return '<tr><th scope="row">' + esc(cfg.labels[i]) + '</th><td>' + esc(fmtMil(v)) + '</td></tr>';
    }).join('');
    return '<div class="bar-axis"><span class="sw-label">R$ mil</span><span>Máx. ' + esc(fmtMil(max)) + '</span></div>' +
      '<div class="bars" role="group" aria-label="' + esc(cfg.title) + '">' + cols + '</div>' +
      '<div class="bar-labels" aria-hidden="true">' + labels + '</div>' +
      '<table class="sr-table"><caption>' + esc(cfg.title) + '</caption><thead><tr><th scope="col">Período</th><th scope="col">Receita</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  var ACTIVITY = [
    { text: 'Mariana Costa pagou o pedido #1038', time: 'há 12 min' },
    { text: 'Novo projeto criado: Campanha de outono', time: 'há 1 h' },
    { text: 'Lucas concluiu 3 tarefas em Site institucional', time: 'há 3 h' },
    { text: 'Studio Varela enviou o orçamento', time: 'ontem, 17:40' },
    { text: 'Equipe convidou 2 novos membros', time: 'ontem, 09:15' }
  ];

  function activityHtml() {
    return '<ul class="activity">' + ACTIVITY.map(function (a) {
      return '<li><span class="activity__mark" aria-hidden="true"></span><div>' + esc(a.text) +
        '<span class="activity__time">' + esc(a.time) + '</span></div></li>';
    }).join('') + '</ul>';
  }

  function setPeriodButtons(root, period) {
    A.$$('[data-period]', root).forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-period') === period ? 'true' : 'false');
    });
  }

  function fillBlocks(root, period, delay) {
    var cfg = SERIES[period];
    var kpis = root.querySelector('#kpis');
    var chart = root.querySelector('#chart');
    var chartTitle = root.querySelector('#chart-title');
    if (chartTitle) chartTitle.textContent = cfg.title;
    A.loadInto(kpis, kpisHtml(period), delay);
    A.loadInto(chart, chartHtml(period), delay);
  }

  A.register('/app/painel', {
    kind: 'app',
    title: 'Painel',
    render: function () {
      var loadingKpi = '<article class="kpi">' + A.skel(2) + '</article>';
      return '<section aria-labelledby="dash-title">' +
        '<div class="page-head sw">' +
          '<div class="page-head__row">' +
            '<div><p class="sw-eyebrow">01 — Painel</p><h1 id="dash-title" class="sw-title">Visão geral</h1></div>' +
            '<div class="period" role="group" aria-label="Período">' +
              '<button type="button" data-period="7" aria-pressed="false">7 dias</button>' +
              '<button type="button" data-period="30" aria-pressed="true">30 dias</button>' +
              '<button type="button" data-period="90" aria-pressed="false">90 dias</button>' +
            '</div>' +
          '</div>' +
          '<p class="page-sub">Receita, tarefas e clientes do período selecionado.</p>' +
        '</div>' +
        '<div class="sw-kpi-grid" id="kpis" aria-live="polite">' + loadingKpi + loadingKpi + loadingKpi + '</div>' +
        '<div class="dash-grid" style="margin-top:20px">' +
          '<section class="dash-block" aria-labelledby="chart-title">' +
            '<div class="dash-block__head"><div><p class="sw-eyebrow">02 — Receita</p>' +
            '<h2 id="chart-title" class="sw-title" style="font-size:18px">Receita por semana</h2></div></div>' +
            '<div class="dash-block__body is-loading" id="chart">' + A.skel(4) + '</div>' +
          '</section>' +
          '<section class="dash-block" aria-labelledby="act-title">' +
            '<div class="dash-block__head"><div><p class="sw-eyebrow">03 — Atividades</p>' +
            '<h2 id="act-title" class="sw-title" style="font-size:18px">Atividades recentes</h2></div></div>' +
            '<div class="dash-block__body" id="activity">' + A.skel(5) + '</div>' +
          '</section>' +
        '</div>' +
      '</section>';
    },
    init: function (root) {
      var period = '30';
      var group = root.querySelector('.period');
      fillBlocks(root, period, 450);
      A.loadInto(root.querySelector('#activity'), activityHtml(), 450);
      group.addEventListener('click', function (e) {
        var b = e.target.closest('[data-period]');
        if (!b) return;
        period = b.getAttribute('data-period');
        setPeriodButtons(root, period);
        fillBlocks(root, period, 350);
      });
    }
  });

  A.actions['go-report'] = function () { A.go('/app/relatorios'); };

  /* ==========================================================================
     Projetos (cards Swiss com link estendido e diálogo de detalhes)
     ========================================================================== */
  var PROJECTS = [
    { id: 'p1', num: '01', tag: 'Novo', title: 'Viagem a Lisboa', text: '7 dias com roteiro guiado, hospedagem e passeios inclusos.', meta: '12 tarefas · 3 membros', icon: 'plane' },
    { id: 'p2', num: '02', tag: 'Em andamento', title: 'Site institucional', text: 'Nova identidade, páginas de produto e blog para a versão 2026 do site.', meta: '8 tarefas · 4 membros', icon: 'layout' },
    { id: 'p3', num: '03', tag: 'Em revisão', title: 'Campanha de outono', text: 'Peças para redes sociais e e-mail marketing da nova coleção.', meta: '5 tarefas · 2 membros', icon: 'message' },
    { id: 'p4', num: '04', tag: 'Concluído', title: 'Aplicativo de agendamento', text: 'Versão 2.0 com pagamentos, lembretes e painel administrativo.', meta: '21 tarefas · 6 membros', icon: 'calendar' }
  ];

  function mediaSvg() {
    return '<svg class="sw-media-bg" viewBox="0 0 320 180" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="M0 45H320M0 90H320M0 135H320M80 0V180M160 0V180M240 0V180" fill="none" style="stroke: var(--border)"/>' +
      '</svg>';
  }

  function projectCard(p) {
    return '<article class="sw-card" aria-labelledby="proj-' + p.id + '">' +
      '<div class="sw-card__media">' + mediaSvg() +
        '<span class="media-ico">' + icon(p.icon, { size: 44 }) + '</span></div>' +
      '<div class="sw-card__body">' +
        '<p class="sw-card__num">' + esc(p.num) + ' —</p>' +
        '<span class="sw-card__tag">' + esc(p.tag) + '</span>' +
        '<h3 class="sw-card__title" id="proj-' + p.id + '"><a href="#/app/projetos" data-action="project" data-id="' + p.id + '">' + esc(p.title) + '</a></h3>' +
        '<p class="sw-card__text">' + esc(p.text) + '</p>' +
      '</div>' +
      '<div class="sw-card__foot">' +
        '<span class="sw-card__meta">' + esc(p.meta) + '</span>' +
        '<button type="button" class="btn btn--primary sw-btn sw-btn--sm" data-action="project" data-id="' + p.id + '" aria-describedby="proj-' + p.id + '">Ver detalhes</button>' +
      '</div>' +
    '</article>';
  }

  function openProjectDialog(p) {
    var old = document.getElementById('project-dialog');
    if (old) old.remove();
    var dlg = document.createElement('dialog');
    dlg.id = 'project-dialog';
    dlg.className = 'dialog';
    dlg.setAttribute('aria-labelledby', 'project-dialog-title');
    dlg.innerHTML = '<div class="dialog__head"><div><p class="sw-eyebrow">' + esc(p.tag) + '</p>' +
      '<h2 id="project-dialog-title" class="sw-title" style="font-size:24px">' + esc(p.title) + '</h2></div>' +
      '<button type="button" class="icon-btn" data-close aria-label="Fechar">' + icon('x') + '</button></div>' +
      '<div class="dialog__body"><p>' + esc(p.text) + '</p><p class="sw-label">' + esc(p.meta) + '</p>' +
      '<div class="dialog__actions"><button type="button" class="btn btn--outline" data-close>Fechar</button></div></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target === dlg) dlg.close();
    });
    dlg.addEventListener('close', function () { dlg.remove(); });
    dlg.showModal();
  }

  A.actions['project'] = function (el, e) {
    e.preventDefault();
    var id = el.getAttribute('data-id');
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (p) openProjectDialog(p);
  };

  A.actions['new-project'] = function () {
    A.toast('Criação de projetos não está disponível nesta demonstração.');
  };

  A.register('/app/projetos', {
    kind: 'app',
    title: 'Projetos',
    render: function () {
      return '<section aria-labelledby="proj-title">' +
        '<div class="page-head sw">' +
          '<div class="page-head__row"><div><p class="sw-eyebrow">01 — Projetos</p>' +
          '<h1 id="proj-title" class="sw-title">Projetos</h1></div>' +
          '<button type="button" class="btn btn--primary sw-btn" data-action="new-project">Novo projeto</button></div>' +
          '<p class="page-sub">Projetos ativos da sua equipe.</p>' +
        '</div>' +
        '<div class="sw-card-grid">' + PROJECTS.map(projectCard).join('') + '</div>' +
      '</section>';
    }
  });

  /* ==========================================================================
     Tarefas
     ========================================================================== */
  var TASKS = [
    { id: 'k1', title: 'Revisar proposta do Studio Varela', project: 'Campanha de outono', due: 'Hoje', done: false },
    { id: 'k2', title: 'Aprovar textos da campanha de outono', project: 'Campanha de outono', due: 'Hoje', done: false },
    { id: 'k3', title: 'Configurar domínio do novo site', project: 'Site institucional', due: 'Amanhã', done: false },
    { id: 'k4', title: 'Atualizar fotos das páginas de produto', project: 'Site institucional', due: '5 nov', done: false },
    { id: 'k5', title: 'Publicar versão 2.0 no app store', project: 'Aplicativo de agendamento', due: '28 out', done: true },
    { id: 'k6', title: 'Enviar relatório mensal ao cliente', project: 'Viagem a Lisboa', due: '30 out', done: true }
  ];
  var taskFilter = 'all';

  function taskCounts() {
    var done = TASKS.filter(function (t) { return t.done; }).length;
    return { done: done, pending: TASKS.length - done };
  }

  function taskListHtml() {
    var list = TASKS.filter(function (t) {
      if (taskFilter === 'pending') return !t.done;
      if (taskFilter === 'done') return t.done;
      return true;
    });
    if (!list.length) {
      var msg = taskFilter === 'pending' ? 'Tudo em dia. Nenhuma tarefa pendente.' : 'Nenhuma tarefa concluída ainda.';
      return '<div class="empty"><strong>' + esc(msg) + '</strong>' +
        '<button type="button" class="btn btn--outline" data-action="task-filter" data-filter="all">Ver todas as tarefas</button></div>';
    }
    return '<ul class="list">' + list.map(function (t) {
      return '<li><div class="list-row" style="padding-right:4px">' +
        '<label class="check" style="flex:1;min-height:44px;align-items:center;margin:0">' +
          '<input type="checkbox" data-task-id="' + t.id + '"' + (t.done ? ' checked' : '') + '>' +
          '<span class="list-row__main"><span class="list-row__title" style="' + (t.done ? 'text-decoration:line-through;color:var(--text-muted)' : '') + '">' + esc(t.title) + '</span>' +
          '<span class="list-row__meta">' + esc(t.project) + ' · Prazo: ' + esc(t.due) + '</span></span></label>' +
        '</div></li>';
    }).join('') + '</ul>';
  }

  function taskSummary() {
    var c = taskCounts();
    return c.pending + ' pendentes · ' + c.done + ' concluídas';
  }

  A.actions['task-filter'] = function (el) {
    taskFilter = el.getAttribute('data-filter');
    A.$$('[data-action="task-filter"]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-filter') === taskFilter ? 'true' : 'false');
    });
    var box = A.$('#task-list');
    if (box) box.innerHTML = taskListHtml();
  };

  A.register('/app/tarefas', {
    kind: 'app',
    title: 'Tarefas',
    render: function () {
      return '<section aria-labelledby="tasks-title">' +
        '<div class="page-head">' +
          '<p class="sw-eyebrow">01 — Tarefas</p>' +
          '<h1 id="tasks-title" class="page-title">Tarefas</h1>' +
          '<p class="page-sub" id="task-summary" aria-live="polite">&nbsp;</p>' +
        '</div>' +
        '<div class="toolbar" style="margin-bottom:16px" role="group" aria-label="Filtrar tarefas">' +
          '<button type="button" class="btn btn--outline" data-action="task-filter" data-filter="all" aria-pressed="true">Todas</button>' +
          '<button type="button" class="btn btn--outline" data-action="task-filter" data-filter="pending" aria-pressed="false">Pendentes</button>' +
          '<button type="button" class="btn btn--outline" data-action="task-filter" data-filter="done" aria-pressed="false">Concluídas</button>' +
        '</div>' +
        '<div class="panel" id="task-list">' + A.skel(4) + '</div>' +
      '</section>';
    },
    init: function (root) {
      taskFilter = 'all';
      var listEl = root.querySelector('#task-list');
      var summary = root.querySelector('#task-summary');
      A.loadInto(listEl, taskListHtml(), 350);
      if (summary) summary.textContent = taskSummary();
      listEl.addEventListener('change', function (e) {
        var t = e.target;
        var id = t.getAttribute && t.getAttribute('data-task-id');
        if (!id) return;
        TASKS.forEach(function (x) { if (x.id === id) x.done = t.checked; });
        if (summary) summary.textContent = taskSummary();
        A.announce(t.checked ? 'Tarefa concluída.' : 'Tarefa reaberta.');
        if (taskFilter !== 'all') listEl.innerHTML = taskListHtml();
      });
    }
  });

  /* ==========================================================================
     Calendário (modo lista/agenda, adequado ao celular)
     ========================================================================== */
  var AGENDA = [
    { day: 'Hoje · segunda, 2 de novembro', items: [
      { time: '09:30', title: 'Daily da equipe de produto', meta: 'Chamada de vídeo · 15 min', type: 'Reunião' },
      { time: '15:00', title: 'Reunião de alinhamento', meta: 'Sala 2 · Campanha de outono', type: 'Reunião' }
    ] },
    { day: 'Amanhã · terça, 3 de novembro', items: [
      { time: '10:00', title: 'Entrega: aplicativo v2.0', meta: 'Aplicativo de agendamento', type: 'Entrega' }
    ] },
    { day: 'Quinta, 5 de novembro', items: [
      { time: '14:00', title: 'Revisão das fotos do site', meta: 'Site institucional', type: 'Revisão' },
      { time: '16:30', title: 'Apresentação ao cliente', meta: 'Studio Varela', type: 'Reunião' }
    ] }
  ];

  A.register('/app/calendario', {
    kind: 'app',
    title: 'Calendário',
    render: function () {
      return '<section aria-labelledby="cal-title">' +
        '<div class="page-head">' +
          '<p class="sw-eyebrow">01 — Calendário</p>' +
          '<h1 id="cal-title" class="page-title">Calendário</h1>' +
          '<p class="page-sub">Compromissos e entregas da semana, em ordem cronológica.</p>' +
        '</div>' +
        '<div id="agenda">' + A.skel(4) + '</div>' +
      '</section>';
    },
    init: function (root) {
      var html = AGENDA.map(function (g) {
        return '<section class="panel" aria-labelledby="day-' + g.day.length + '-' + g.items.length + '">' +
          '<h2 class="panel__title" id="day-' + g.day.length + '-' + g.items.length + '">' + esc(g.day) + '</h2>' +
          '<ul class="list">' + g.items.map(function (it) {
            return '<li><div class="list-row"><span class="list-row__end" style="min-width:52px;color:var(--text)">' + esc(it.time) + '</span>' +
              '<span class="list-row__main"><span class="list-row__title">' + esc(it.title) + '</span>' +
              '<span class="list-row__meta">' + esc(it.meta) + '</span></span>' +
              '<span class="status-pill status-pill--neutral">' + esc(it.type) + '</span></div></li>';
          }).join('') + '</ul></section>';
      }).join('');
      A.loadInto(root.querySelector('#agenda'), html, 350);
    }
  });
})();
