/* =========================================================
   Páginas: Painel (4 visões), páginas de tabela do menu lateral,
   Meu perfil, Configurações e Ajuda.
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const { esc, icon, fmt } = N;

  const sum = (rows, f) => rows.reduce((s, x) => s + (f ? f(x) : x.valor), 0);
  const count = (rows, st) => rows.reduce((n, x) => n + (x.status === st ? 1 : 0), 0);
  const sumSt = (rows, st) => sum(rows.filter((x) => x.status === st));
  const ratio = (a, b) => (b ? a / b : 0);

  /* ---------- Configuração das quatro visões do Painel ---------- */
  const TAB_CFG = {
    'visao-geral': {
      title: 'Visão geral', kind: 'pedidos', statusKey: 'pedido', noun: 'pedidos', payStatus: 'pago', payLabel: 'Marcar como pago',
      kpis: [
        { label: 'Receita líquida', type: 'money', good: 'up', calc: (rows) => sum(rows) * 0.9 },
        { label: 'Despesas operacionais', type: 'money', good: 'down', calc: (rows, seed, k) => k[0] * (0.58 + 0.08 * N.rng(seed)()) },
        { label: 'Resultado líquido', type: 'money', good: 'up', calc: (rows, seed, k) => k[0] - k[1] }
      ],
      chart: { title: 'Vendas por mês', type: 'money', names: ['Vendas', 'Meta'], series: [(rows) => sum(rows), 'meta'] },
      act: { pago: ['Pagamento recebido', 'arrowDownLeft', 'in'], pendente: ['Pedido aguardando pagamento', 'clock', ''], atrasado: ['Cobrança em atraso', 'alert', 'alert'], analise: ['Pedido em análise de crédito', 'fileText', ''] },
      table: { title: 'Pedidos recentes', primary: 'Novo pedido', empty: 'Nenhum pedido no período' }
    },
    aquisicao: {
      title: 'Aquisição', kind: 'negocios', statusKey: 'negocio', noun: 'negócios',
      kpis: [
        { label: 'Novos negócios', type: 'count', good: 'up', calc: (rows) => rows.length },
        { label: 'Taxa de conversão', type: 'pct', good: 'up', calc: (rows) => ratio(count(rows, 'convertido'), count(rows, 'convertido') + count(rows, 'perdido')) },
        { label: 'Valor em pipeline', type: 'money', good: 'up', calc: (rows) => sum(rows) }
      ],
      chart: { title: 'Novos clientes por mês', type: 'count', names: ['Orgânico', 'Pago'], series: [(rows) => rows.filter((x) => x.status === 'convertido' && x.canal === 'organico').length, (rows) => rows.filter((x) => x.status === 'convertido' && x.canal === 'pago').length] },
      act: { convertido: ['Novo cliente convertido', 'userPlus', 'in'], negociacao: ['Proposta em negociação', 'fileText', ''], qualificado: ['Lead qualificado', 'user', ''], perdido: ['Negócio perdido', 'alert', 'alert'] },
      table: { title: 'Novos negócios', empty: 'Nenhum negócio no período' }
    },
    retencao: {
      title: 'Retenção', kind: 'renovacoes', statusKey: 'renovacao', noun: 'renovações',
      kpis: [
        { label: 'Contratos no ciclo de renovação', type: 'count', good: 'up', calc: (rows) => rows.length },
        { label: 'Taxa de renovação', type: 'pct', good: 'up', calc: (rows) => ratio(count(rows, 'renovado'), count(rows, 'renovado') + count(rows, 'cancelado')) },
        { label: 'Receita recorrente envolvida', type: 'money', good: 'up', calc: (rows) => sum(rows) }
      ],
      chart: { title: 'Renovações por mês', type: 'count', names: ['Renovados', 'Cancelados'], series: [(rows) => count(rows, 'renovado'), (rows) => count(rows, 'cancelado')] },
      act: { renovado: ['Contrato renovado', 'circleCheck', 'in'], negociacao: ['Renovação em negociação', 'fileText', ''], risco: ['Conta em risco de cancelamento', 'alert', 'alert'], cancelado: ['Contrato cancelado', 'x', 'alert'] },
      table: { title: 'Renovações', empty: 'Nenhuma renovação no período' }
    },
    receita: {
      title: 'Receita', kind: 'faturas', statusKey: 'fatura', noun: 'faturas', payStatus: 'paga', payLabel: 'Marcar como paga',
      kpis: [
        { label: 'Receita faturada', type: 'money', good: 'up', calc: (rows) => sum(rows) },
        { label: 'Ticket médio', type: 'money', good: 'up', calc: (rows) => ratio(sum(rows), rows.length) },
        { label: 'Inadimplência', type: 'pct', good: 'down', calc: (rows) => ratio(sumSt(rows, 'vencida'), sum(rows)) }
      ],
      chart: { title: 'Receita por mês', type: 'money', names: ['Faturado', 'Recebido'], series: [(rows) => sum(rows), (rows) => sumSt(rows, 'paga')] },
      act: { paga: ['Fatura paga', 'arrowDownLeft', 'in'], aberta: ['Fatura emitida', 'fileText', ''], vencida: ['Fatura vencida', 'alert', 'alert'], contestada: ['Fatura contestada pelo cliente', 'help', ''] },
      table: { title: 'Faturas recentes', empty: 'Nenhuma fatura no período' }
    }
  };

  /* ---------- Páginas de tabela do menu lateral ---------- */
  const TABLE_PAGES = {
    contratos: {
      desc: 'Contratos firmados com fornecedores, por data de assinatura.', statusKey: 'contrato', noun: 'contratos', period: true, actions: ['details', 'delete'],
      columns: [{ key: 'id', label: 'Contrato', type: 'text', sub: 'objeto' }, { key: 'fornecedor', label: 'Fornecedor', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'valor', label: 'Valor', type: 'money' }, { key: 'data', label: 'Assinatura', type: 'date' }],
      search: ['id', 'objeto', 'fornecedor'], searchLabel: 'Filtrar contratos', empty: 'Nenhum contrato assinado no período'
    },
    fornecedores: {
      desc: 'Cadastro de fornecedores e volume comprado.', statusKey: 'fornecedor', noun: 'fornecedores', period: false, actions: ['details', 'block'],
      columns: [{ key: 'nome', label: 'Fornecedor', type: 'text', sub: 'id' }, { key: 'categoria', label: 'Categoria', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'valor', label: 'Total comprado', type: 'money' }, { key: 'data', label: 'Cadastro', type: 'date' }],
      search: ['nome', 'categoria', 'id'], searchLabel: 'Filtrar fornecedores', empty: 'Nenhum fornecedor cadastrado'
    },
    compras: {
      desc: 'Pedidos de compra e aprovações pendentes.', statusKey: 'compra', noun: 'pedidos de compra', period: true, actions: ['details', 'approve', 'delete'],
      columns: [{ key: 'id', label: 'Pedido', type: 'text' }, { key: 'fornecedor', label: 'Fornecedor', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'valor', label: 'Valor', type: 'money' }, { key: 'data', label: 'Data', type: 'date' }],
      search: ['id', 'fornecedor'], searchLabel: 'Filtrar compras', empty: 'Nenhuma compra no período'
    },
    colaboradores: {
      desc: 'Quadro de colaboradores da unidade.', statusKey: 'colaborador', noun: 'colaboradores', period: false, actions: ['details'],
      columns: [{ key: 'nome', label: 'Nome', type: 'text', sub: 'id' }, { key: 'area', label: 'Área', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'valor', label: 'Salário base', type: 'money' }, { key: 'data', label: 'Admissão', type: 'date' }],
      search: ['nome', 'area'], searchLabel: 'Filtrar colaboradores', empty: 'Nenhum colaborador cadastrado'
    },
    folha: {
      desc: 'Folhas de pagamento por competência.', statusKey: 'folha', noun: 'folhas', period: true, actions: ['details'],
      columns: [{ key: 'competencia', label: 'Competência', type: 'text' }, { key: 'qtd', label: 'Colaboradores', type: 'number' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'valor', label: 'Valor líquido', type: 'money' }, { key: 'data', label: 'Pagamento', type: 'date' }],
      search: ['competencia'], searchLabel: 'Filtrar competência', empty: 'Nenhuma folha no período'
    },
    auditoria: {
      desc: 'Trilha de eventos de segurança e operações sensíveis.', statusKey: 'auditoria', noun: 'eventos', period: true, actions: ['details'],
      columns: [{ key: 'evento', label: 'Evento', type: 'text', sub: 'id' }, { key: 'usuario', label: 'Usuário', type: 'text', sub: 'email' }, { key: 'status', label: 'Resultado', type: 'status' }, { key: 'ip', label: 'Endereço IP', type: 'text' }, { key: 'data', label: 'Data e hora', type: 'datetime' }],
      search: ['evento', 'usuario', 'ip'], searchLabel: 'Filtrar eventos', empty: 'Nenhum evento no período'
    },
    permissoes: {
      desc: 'Usuários com acesso à plataforma e seus perfis.', statusKey: 'permissao', noun: 'usuários', period: false, actions: ['details', 'revoke'],
      columns: [{ key: 'nome', label: 'Usuário', type: 'text', sub: 'email' }, { key: 'perfil', label: 'Perfil', type: 'text' }, { key: 'status', label: 'Status', type: 'status' }, { key: 'data', label: 'Último acesso', type: 'datetime' }],
      search: ['nome', 'email', 'perfil'], searchLabel: 'Filtrar usuários', empty: 'Nenhum usuário cadastrado'
    }
  };

  const Pages = {};
  let current = null;
  let pendingQuery = null;
  N.TABLE_PAGES = TABLE_PAGES;

  /* ---------- Partes comuns ---------- */
  function periodText(withPeriod) {
    const u = N.unitById(N.state.unit);
    if (!withPeriod) return 'Todos os registros · ' + u.name;
    const pr = N.periodRange(N.state.period);
    return pr.label + ' · ' + fmt.date(pr.start) + ' a ' + fmt.date(pr.end) + ' · ' + u.name;
  }
  function pageHead(title, sub, caps) {
    return '<div class="page-head"><div class="page-titles"><h1 class="page-title" tabindex="-1">' + esc(title) + '</h1><p class="page-sub" data-page-sub>' + esc(sub) + '</p></div>' +
      (caps.refresh || caps.export ? '<div class="page-actions">' +
        (caps.period ? '<button type="button" class="btn btn--outline only-mobile period-btn" data-period-trigger aria-haspopup="menu" aria-expanded="false">' + icon('calendar', { size: 16 }) + '<span class="sr-only">Período: </span><span data-period-label></span>' + icon('chevronDown', { size: 16 }) + '</button>' : '') +
        (caps.export ? '<button type="button" class="btn btn--primary only-mobile" data-action="export">' + icon('download', { size: 16 }) + '<span>Exportar</span></button>' : '') +
        (caps.refresh ? '<button type="button" class="btn btn--outline" data-action="refresh" aria-keyshortcuts="r">' + icon('refresh', { size: 16 }) + '<span>Atualizar</span><kbd class="hide-mobile" aria-hidden="true">R</kbd></button>' : '') +
      '</div>' : '') + '</div>';
  }
  const isDemo = (s, retry) => (retry ? 'normal' : N.state.demo) === s;
  const delay = () => 350 + Math.random() * 650;

  function formatValue(type, v) {
    if (type === 'money') return fmt.money0(v);
    if (type === 'pct') return fmt.pct(v);
    return fmt.num(Math.round(v));
  }

  function rowsToCSV(columns, rows, statusMap) {
    const head = ['Código'].concat(columns.filter((c) => c.key !== 'id').map((c) => c.label));
    const lines = rows.map((r) => [r.id].concat(columns.filter((c) => c.key !== 'id').map((c) => {
      const v = r[c.key];
      if (c.type === 'status') return (statusMap[v] || { label: v }).label;
      if (c.type === 'money') return N.csvMoney(v);
      if (c.type === 'date') return fmt.date(v);
      if (c.type === 'datetime') return fmt.datetime(v);
      return v;
    })));
    return [head].concat(lines);
  }

  function detailsDialog(title, columns, row, statusMap) {
    const extra = row.canal ? '<dt>Canal</dt><dd>' + (row.canal === 'organico' ? 'Orgânico' : 'Pago') + '</dd>' : '';
    N.dialog({
      title,
      body: '<dl class="dl-grid"><dt>Código</dt><dd>' + esc(row.id) + '</dd>' +
        columns.filter((c) => c.key !== 'id').map((c) => {
          const v = row[c.key];
          let out;
          if (c.type === 'status') out = '<span class="badge badge--' + (statusMap[v] || {}).tone + '">' + esc((statusMap[v] || { label: v }).label) + '</span>';
          else if (c.type === 'money') out = esc(fmt.money(v));
          else if (c.type === 'number') out = esc(fmt.num(v));
          else if (c.type === 'date') out = esc(fmt.date(v));
          else if (c.type === 'datetime') out = esc(fmt.datetime(v));
          else out = esc(v) + (c.sub && row[c.sub] && c.sub !== 'id' ? '<br><span class="muted">' + esc(row[c.sub]) + '</span>' : '');
          return '<dt>' + esc(c.label) + '</dt><dd>' + out + '</dd>';
        }).join('') + extra + '</dl>',
      actions: [{ label: 'Fechar', variant: 'btn--primary' }]
    });
  }

  /* =========================================================
     Painel (dashboard financeiro)
     ========================================================= */
  function dashboardPage(main, tab) {
    const cfg = TAB_CFG[tab];
    const caps = { period: true, export: true, refresh: true };
    const columns = [
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'valor', label: 'Valor', type: 'money' },
      { key: 'data', label: 'Data', type: 'date' }
    ];
    const statusMap = N.STATUS[cfg.statusKey];
    main.innerHTML =
      '<div class="page">' +
        pageHead(cfg.title, periodText(true), caps) +
        '<section class="kpis" aria-label="Indicadores" data-block="kpis"></section>' +
        '<div class="dash-main">' +
          '<section class="card chart-card" aria-labelledby="chart-title">' +
            '<div class="card-head"><div><h2 class="card-title" id="chart-title">' + esc(cfg.chart.title) + '</h2><p class="card-sub" data-chart-sub></p></div></div>' +
            '<div class="chart-body"></div>' +
          '</section>' +
          '<section class="card activity-card" aria-labelledby="act-title">' +
            '<div class="card-head"><div><h2 class="card-title" id="act-title">Atividades recentes</h2><p class="card-sub" data-act-sub></p></div></div>' +
            '<div data-block="activity"></div>' +
          '</section>' +
        '</div>' +
        '<div data-block="table"></div>' +
      '</div>';
    const kpiEl = main.querySelector('[data-block="kpis"]');
    const actEl = main.querySelector('[data-block="activity"]');
    const chart = new N.BarChart(main.querySelector('.chart-body'), { id: 'chart-' + tab, title: cfg.chart.title });

    const bulk = [{ label: 'Exportar seleção', run: (rows) => exportRows(rows, 'selecao') }];
    if (cfg.payStatus) bulk.unshift({ label: cfg.payLabel, run: (rows) => markPaid(rows) });
    const rowActions = [{ label: 'Ver detalhes', icon: 'file', run: (r) => detailsDialog('Detalhes · ' + r.id, columns, r, statusMap) }];
    if (cfg.payStatus) rowActions.push({ label: cfg.payLabel, icon: 'circleCheck', disabled: (r) => r.status === cfg.payStatus, run: (r) => markPaid([r]) });
    rowActions.push({ sep: true }, { label: 'Excluir', icon: 'trash', danger: true, run: (r) => removeRecord(r) });

    const table = new N.DataTable(main.querySelector('[data-block="table"]'), {
      id: 'tbl-' + tab,
      title: cfg.table.title,
      caption: 'Colunas ordenáveis; use as caixas de seleção para ações em lote.',
      noun: cfg.noun,
      countSuffix: 'no período',
      columns,
      statusMap,
      pageSize: 4,
      searchKeys: ['cliente', 'id'],
      searchLabel: 'Filtrar por cliente',
      emptyTitle: cfg.table.empty,
      emptyText: 'Altere o período no seletor para ver outros registros.',
      primary: cfg.table.primary ? { label: cfg.table.primary, onClick: openNewOrder } : null,
      bulk,
      rowActions,
      onRetry: () => loadBlock('table', true)
    });

    let token = 0;
    function data() {
      const pr = N.periodRange(N.state.period);
      const all = N.records(cfg.kind, N.state.unit);
      return {
        pr,
        all,
        cur: all.filter((x) => x.data >= pr.start && x.data <= pr.end),
        prev: all.filter((x) => x.data >= pr.prevStart && x.data < pr.prevEnd)
      };
    }

    function renderKpis(state) {
      const head = '';
      kpiEl.setAttribute('aria-busy', String(state === 'loading'));
      if (state === 'loading') {
        kpiEl.innerHTML = head + cfg.kpis.map((k) => '<article class="card kpi"><h2 class="kpi-label">' + esc(k.label) + '</h2><span class="skel skel--lg skel--w60" aria-hidden="true"></span><span class="skel skel--w40" aria-hidden="true"></span><span class="sr-only">Carregando…</span></article>').join('');
        return;
      }
      if (state === 'error') {
        kpiEl.innerHTML = head + '<article class="card kpi" style="grid-column: 1 / -1"><div class="state state--error" role="alert">' + icon('alert') + '<p class="state-title">Não foi possível carregar os indicadores.</p><button type="button" class="btn btn--outline" data-retry-kpi>' + icon('refresh', { size: 16 }) + 'Tentar novamente</button></div></article>';
        kpiEl.querySelector('[data-retry-kpi]').addEventListener('click', () => loadBlock('kpis', true));
        return;
      }
      if (state === 'empty') {
        kpiEl.innerHTML = head + cfg.kpis.map((k) => '<article class="card kpi"><h2 class="kpi-label">' + esc(k.label) + '</h2><p class="kpi-value">—</p><p class="kpi-foot">Sem movimentação no período</p></article>').join('');
        return;
      }
      const d = data();
      const seedBase = cfg.kind + '|' + N.state.unit + '|' + N.state.period;
      const cur = [];
      const prev = [];
      cfg.kpis.forEach((k, i) => {
        cur.push(k.calc(d.cur, seedBase + '|c|' + i, cur));
        prev.push(k.calc(d.prev, seedBase + '|p|' + i, prev));
      });
      kpiEl.innerHTML = head + cfg.kpis.map((k, i) => {
        const c = cur[i];
        const p = prev[i];
        let deltaHtml;
        if (k.type === 'pct') {
          const diff = (c - p) * 100;
          deltaHtml = deltaSpan(diff, k.good, (diff > 0 ? '+' : diff < 0 ? '−' : '') + fmt.dec1(Math.abs(diff)) + ' p.p.');
        } else if (p) {
          const rel = (c - p) / Math.abs(p) * 100;
          deltaHtml = deltaSpan(rel, k.good, (rel > 0 ? '+' : rel < 0 ? '−' : '') + fmt.dec1(Math.abs(rel)) + '%');
        } else {
          deltaHtml = '<span class="delta">—</span>';
        }
        return '<article class="card kpi"><h2 class="kpi-label">' + esc(k.label) + '</h2><p class="kpi-value">' + esc(formatValue(k.type, c)) + '</p>' +
          '<p class="kpi-foot">' + deltaHtml + '<span>vs. período anterior (' + esc(formatValue(k.type, p)) + ')</span></p></article>';
      }).join('');
    }
    function deltaSpan(v, good, text) {
      if (!v) return '<span class="delta">' + text + '</span>';
      const up = v > 0;
      const ok = good === 'up' ? up : !up;
      return '<span class="delta ' + (ok ? 'is-good' : 'is-bad') + '">' + icon(up ? 'trendingUp' : 'trendingDown', { size: 14 }) +
        '<span class="sr-only">' + (up ? 'Aumento de ' : 'Queda de ') + '</span>' + esc(text) + '</span>';
    }

    function renderChart(state) {
      const sub = main.querySelector('[data-chart-sub]');
      if (state !== 'ready') { sub.textContent = 'Últimos 12 meses fechados'; chart.setState(state, { onRetry: () => loadBlock('chart', true) }); return; }
      const d = data();
      const months = N.lastMonths(12);
      const buckets = months.map((mo) => d.all.filter((x) => x.data >= mo.start && x.data < mo.end));
      const s1 = buckets.map(cfg.chart.series[0]);
      let s2;
      if (cfg.chart.series[1] === 'meta') {
        const avg = s1.reduce((a, b) => a + b, 0) / s1.length;
        s2 = months.map((_, i) => Math.round((avg * (0.9 + 0.018 * i)) / 5000) * 5000);
      } else s2 = buckets.map(cfg.chart.series[1]);
      const highlight = months.map((mo) => mo.end > d.pr.start && mo.start <= d.pr.end);
      sub.textContent = 'Últimos 12 meses fechados · destaque: ' + d.pr.label.toLowerCase();
      const money = cfg.chart.type === 'money';
      chart.setData({
        categories: months.map((mo) => N.MONTHS[mo.m] + '/' + String(mo.y).slice(2)),
        series: [{ name: cfg.chart.names[0], values: s1 }, { name: cfg.chart.names[1], values: s2 }],
        highlight,
        highlightLabel: 'Meses do período selecionado',
        format: money ? fmt.money0 : (v) => fmt.num(v),
        axisFormat: money ? fmt.compactMoney : (v) => fmt.num(v)
      });
    }

    function renderActivity(state) {
      const sub = main.querySelector('[data-act-sub]');
      const card = actEl.closest('.card');
      card.setAttribute('aria-busy', String(state === 'loading'));
      if (state === 'loading') {
        sub.textContent = 'Carregando…';
        actEl.innerHTML = '<div class="activity-list" aria-hidden="true">' + Array.from({ length: 5 }, () => '<div class="activity-skel"><span class="skel"></span><div><span class="skel skel--w80"></span><span class="skel skel--w40"></span></div></div>').join('') + '</div>';
        return;
      }
      if (state === 'error') {
        sub.textContent = '';
        actEl.innerHTML = '<div class="state state--error" role="alert">' + icon('alert') + '<p class="state-title">Não foi possível carregar as atividades.</p><button type="button" class="btn btn--outline" data-retry-act>' + icon('refresh', { size: 16 }) + 'Tentar novamente</button></div>';
        actEl.querySelector('[data-retry-act]').addEventListener('click', () => loadBlock('activity', true));
        return;
      }
      const d = data();
      const items = state === 'empty' ? [] : d.cur.slice(0, 6);
      sub.textContent = (state === 'empty' ? 0 : d.cur.length) + ' movimentações no período';
      if (!items.length) {
        actEl.innerHTML = '<div class="state">' + icon('inbox') + '<p class="state-title">Nenhuma atividade no período</p><p class="state-text">As movimentações aparecerão aqui assim que forem registradas.</p></div>';
        return;
      }
      actEl.innerHTML = '<ul class="activity-list">' + items.map((r) => {
        const a = cfg.act[r.status];
        const inbound = a[2] === 'in' && !!cfg.payStatus;
        return '<li class="activity"><span class="activity-ic ' + (a[2] ? 'is-' + a[2] : '') + '">' + icon(a[1], { size: 16 }) + '</span>' +
          '<div class="activity-main"><p class="activity-title">' + esc(a[0]) + '</p><p class="activity-meta">' + esc(r.cliente) + ' · <time datetime="' + r.data.toISOString() + '">' + esc(fmt.rel(r.data)) + '</time></p></div>' +
          '<span class="activity-amount' + (inbound ? ' is-in' : '') + '">' + (inbound ? '+' : '') + esc(fmt.money(r.valor)) + '</span></li>';
      }).join('') + '</ul>';
    }

    function renderTable(state) {
      if (state === 'loading' || state === 'error') { table.setState(state); return; }
      table.setRows(state === 'empty' ? [] : data().cur.slice());
      if (pendingQuery && tab === 'visao-geral') { table.setQuery(pendingQuery); pendingQuery = null; }
    }

    const renderers = { kpis: renderKpis, chart: renderChart, activity: renderActivity, table: renderTable };
    function loadBlock(block, retry) {
      const tk = token;
      renderers[block]('loading');
      setTimeout(() => {
        if (tk !== token || current !== api) return;
        if (isDemo('loading', retry)) return;
        if (isDemo('error', retry)) { renderers[block]('error'); return; }
        renderers[block](isDemo('empty', retry) ? 'empty' : 'ready');
      }, delay());
    }
    function load() {
      token++;
      main.querySelector('[data-page-sub]').textContent = periodText(true);
      ['kpis', 'chart', 'activity', 'table'].forEach((b) => loadBlock(b, false));
    }

    /* ações */
    function markPaid(rows) {
      const n = rows.filter((r) => r.status !== cfg.payStatus).length;
      rows.forEach((r) => { r.status = cfg.payStatus; });
      table.selected.clear();
      table.render();
      N.toast(n === 1 ? '1 registro atualizado para “' + statusMap[cfg.payStatus].label + '”.' : n + ' registros atualizados para “' + statusMap[cfg.payStatus].label + '”.');
    }
    function removeRecord(r) {
      const src = N.records(cfg.kind, N.state.unit);
      const si = src.indexOf(r);
      if (si >= 0) src.splice(si, 1);
      const res = table.removeRow(r.id);
      N.toast(r.id + ' excluído.', {
        action: {
          label: 'Desfazer',
          onClick: () => {
            if (si >= 0) src.splice(si, 0, r);
            if (res) { table.rows.splice(res.idx, 0, r); table.render(); }
            N.toast('Exclusão desfeita.');
          }
        }
      });
    }
    function exportRows(rows, suffix) {
      N.downloadCSV('nexo-' + tab + '-' + (suffix || N.state.period) + '.csv', rowsToCSV([{ key: 'id', label: 'Código' }].concat(columns), rows, statusMap));
      N.toast(rows.length + ' registro(s) exportado(s) em CSV.');
    }
    function openNewOrder() {
      const today = N.TODAY.toISOString().slice(0, 10);
      const dlg = N.dialog({
        title: 'Novo pedido',
        form: true,
        body:
          '<div class="form-summary" id="np-summary" role="alert" tabindex="-1" hidden></div>' +
          '<div class="field"><label class="field-label" for="np-cliente">Cliente</label><input class="input" id="np-cliente" list="np-clientes" autocomplete="off" autofocus><datalist id="np-clientes">' + N.CLIENTS.map((c) => '<option value="' + esc(c) + '">').join('') + '</datalist><p class="field-error" id="np-cliente-error" hidden></p></div>' +
          '<div class="field"><label class="field-label" for="np-valor">Valor (R$)</label><input class="input" id="np-valor" inputmode="decimal" autocomplete="off" placeholder="0,00"><p class="field-error" id="np-valor-error" hidden></p></div>' +
          '<div class="field"><label class="field-label" for="np-status">Status</label><select class="select" id="np-status"><option value="pendente">Pendente</option><option value="pago">Pago</option><option value="analise">Em análise</option></select></div>' +
          '<div class="field"><label class="field-label" for="np-data">Data</label><input class="input" id="np-data" type="date" value="' + today + '" max="' + today + '"><p class="field-error" id="np-data-error" hidden></p></div>',
        actions: [{ label: 'Cancelar' }, { label: 'Criar pedido', variant: 'btn--primary', submit: true }],
        onSubmit: (d, close) => {
          const f = (id) => d.querySelector('#' + id);
          const parseValor = (s) => { let t = s.replace(/[R$\s]/g, ''); if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.'); return t ? Number(t) : NaN; };
          const checks = [
            ['np-cliente', f('np-cliente').value.trim() ? '' : 'Informe o cliente.'],
            ['np-valor', !f('np-valor').value.trim() ? 'Informe o valor do pedido.' : (!(parseValor(f('np-valor').value) > 0) ? 'Digite um valor maior que zero, como 1.250,00.' : '')],
            ['np-data', !f('np-data').value ? 'Informe a data do pedido.' : (f('np-data').value > today ? 'A data não pode ser futura.' : '')]
          ];
          checks.forEach(([id, msg]) => {
            const input = f(id);
            const err = f(id + '-error');
            if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id); err.innerHTML = icon('alert', { size: 16 }) + '<span>' + esc(msg) + '</span>'; err.hidden = false; }
            else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); err.hidden = true; }
          });
          const errs = checks.filter((c) => c[1]);
          const summary = f('np-summary');
          if (errs.length) {
            summary.innerHTML = icon('alert') + '<div><p><strong>Corrija ' + (errs.length === 1 ? '1 campo' : errs.length + ' campos') + ' para continuar:</strong></p><ul>' + errs.map((e) => '<li>' + esc(e[1]) + '</li>').join('') + '</ul></div>';
            summary.hidden = false;
            f(errs[0][0]).focus();
            return;
          }
          const [y, m, dd] = f('np-data').value.split('-').map(Number);
          const rec = { id: N.nextId('pedidos', N.state.unit), cliente: f('np-cliente').value.trim(), status: f('np-status').value, valor: Math.round(parseValor(f('np-valor').value) * 100) / 100, data: new Date(y, m - 1, dd, Math.min(17, N.TODAY.getHours()), 0, 0), canal: 'organico' };
          const src = N.records('pedidos', N.state.unit);
          src.push(rec);
          src.sort((a, b) => b.data - a.data);
          close();
          const pr = N.periodRange(N.state.period);
          if (table.state === 'ready') table.setRows(data().cur.slice());
          N.toast('Pedido ' + rec.id + ' criado' + (rec.data < pr.start ? ' (fora do período selecionado).' : '.'));
        }
      });
      return dlg;
    }

    const api = {
      caps,
      reload: load,
      refresh: () => { load(); N.toast('Dados atualizados.'); },
      exportCurrent: () => {
        const d = data();
        exportRows(d.cur);
      },
      applyQuery: (q) => { if (tab === 'visao-geral' && table.state === 'ready') { table.setQuery(q); pendingQuery = null; } },
      destroy: () => { token++; chart.destroy(); }
    };
    current = api;
    load();
    return api;
  }

  /* =========================================================
     Páginas de tabela (Contratos, Fornecedores, …)
     ========================================================= */
  function tablePage(main, page) {
    const cfg = TABLE_PAGES[page];
    const info = N.pageInfo(page);
    const caps = { period: cfg.period, export: true, refresh: true };
    const statusMap = N.STATUS[cfg.statusKey];
    main.innerHTML = '<div class="page">' + pageHead(info.label, periodText(cfg.period), caps) + '<p class="page-sub" style="margin-top:-8px">' + esc(cfg.desc) + '</p><div data-block="table"></div></div>';
    const actions = {
      details: { label: 'Ver detalhes', icon: 'file', run: (r) => detailsDialog(info.label + ' · ' + (r.nome || r.evento || r.competencia || r.id), cfg.columns, r, statusMap) },
      delete: { label: 'Excluir', icon: 'trash', danger: true, run: (r) => removeRow(r) },
      block: { label: 'Bloquear fornecedor', icon: 'lock', danger: true, disabled: (r) => r.status === 'bloqueado', run: (r) => setStatus(r, 'bloqueado') },
      approve: { label: 'Aprovar compra', icon: 'circleCheck', disabled: (r) => r.status !== 'aguardando', run: (r) => setStatus(r, 'aprovada') },
      revoke: { label: 'Revogar acesso', icon: 'lock', danger: true, disabled: (r) => r.status === 'revogado' || r.email === N.USER.email, run: (r) => setStatus(r, 'revogado') }
    };
    const rowActions = [];
    cfg.actions.forEach((a, i) => {
      if (actions[a].danger && i > 0) rowActions.push({ sep: true });
      rowActions.push(actions[a]);
    });
    const table = new N.DataTable(main.querySelector('[data-block="table"]'), {
      id: 'tbl-' + page,
      title: info.label,
      caption: 'Colunas ordenáveis; use as caixas de seleção para ações em lote.',
      noun: cfg.noun,
      countSuffix: cfg.period ? 'no período' : '',
      columns: cfg.columns,
      statusMap,
      pageSize: 10,
      searchKeys: cfg.search,
      searchLabel: cfg.searchLabel,
      emptyTitle: cfg.empty,
      emptyText: cfg.period ? 'Altere o período no seletor para ver outros registros.' : 'Os registros aparecerão aqui quando forem cadastrados.',
      defaultSort: { key: 'data', dir: 'desc' },
      bulk: [{ label: 'Exportar seleção', run: (rows) => exportRows(rows, 'selecao') }],
      rowActions,
      onRetry: () => load(true)
    });
    let token = 0;
    function rows() {
      const all = N.pageRows(page, N.state.unit);
      if (!cfg.period) return all.slice();
      const pr = N.periodRange(N.state.period);
      return all.filter((r) => r.data >= pr.start);
    }
    function load(retry) {
      const tk = ++token;
      main.querySelector('[data-page-sub]').textContent = periodText(cfg.period);
      table.setState('loading');
      setTimeout(() => {
        if (tk !== token || current !== api) return;
        if (isDemo('loading', retry)) return;
        if (isDemo('error', retry)) { table.setState('error'); return; }
        table.setRows(isDemo('empty', retry) ? [] : rows());
      }, delay());
    }
    function setStatus(r, st) {
      r.status = st;
      table.render();
      N.toast((r.nome || r.id) + ': status alterado para “' + statusMap[st].label + '”.');
    }
    function removeRow(r) {
      const src = N.pageRows(page, N.state.unit);
      const si = src.indexOf(r);
      if (si >= 0) src.splice(si, 1);
      const res = table.removeRow(r.id);
      N.toast(r.id + ' excluído.', { action: { label: 'Desfazer', onClick: () => { if (si >= 0) src.splice(si, 0, r); if (res) { table.rows.splice(res.idx, 0, r); table.render(); } N.toast('Exclusão desfeita.'); } } });
    }
    function exportRows(list, suffix) {
      N.downloadCSV('nexo-' + page + '-' + (suffix || (cfg.period ? N.state.period : 'todos')) + '.csv', rowsToCSV(cfg.columns, list, statusMap));
      N.toast(list.length + ' registro(s) exportado(s) em CSV.');
    }
    const api = {
      caps,
      reload: () => load(false),
      refresh: () => { load(false); N.toast('Dados atualizados.'); },
      exportCurrent: () => exportRows(table.state === 'ready' ? table.rows : rows()),
      destroy: () => { token++; }
    };
    current = api;
    load(false);
    return api;
  }

  /* =========================================================
     Conta: Meu perfil, Configurações, Ajuda
     ========================================================= */
  function profilePage(main) {
    const s = N.session.get() || {};
    const u = N.USER;
    main.innerHTML = '<div class="page">' + pageHead('Meu perfil', 'Dados da sua conta corporativa', {}) +
      '<section class="card panel" aria-labelledby="pf-name"><div class="profile-card"><span class="avatar avatar--xl" aria-hidden="true">' + esc(u.initials) + '</span><div><h2 id="pf-name">' + esc(u.name) + '</h2><p class="muted">' + esc(u.role) + '</p></div></div></section>' +
      '<section class="card panel" aria-labelledby="pf-data"><h2 id="pf-data">Informações</h2><dl class="dl-grid">' +
        '<dt>E-mail corporativo</dt><dd>' + esc(u.email) + '</dd>' +
        '<dt>Perfil de acesso</dt><dd>' + esc(u.profile) + '</dd>' +
        '<dt>Unidade atual</dt><dd data-unit-name>' + esc(N.unitById(N.state.unit).name) + '</dd>' +
        '<dt>Forma de entrada</dt><dd>' + (s.method === 'sso' ? 'SSO da empresa' : 'E-mail e senha') + '</dd>' +
        '<dt>Sessão iniciada</dt><dd>' + (s.at ? esc(fmt.datetime(new Date(s.at))) : '—') + '</dd>' +
      '</dl></section></div>';
    current = { caps: {}, destroy() {} };
    return current;
  }

  function settingsPage(main) {
    main.innerHTML = '<div class="page">' + pageHead('Configurações', 'Preferências da conta e opções da demonstração', {}) +
      '<div class="settings-grid">' +
        '<section class="card panel" aria-labelledby="pref-title" id="preferencias"><h2 id="pref-title">Preferências</h2>' +
          '<div class="field"><label class="field-label" for="pref-period">Período padrão dos painéis</label><select class="select" id="pref-period">' +
            N.PERIODS.map((p) => '<option value="' + p.id + '"' + (p.id === N.state.period ? ' selected' : '') + '>' + esc(p.label) + '</option>').join('') +
          '</select><p class="field-hint" id="pref-period-hint">Aplicado agora e ao entrar novamente.</p></div>' +
          '<div class="field"><label class="check"><input type="checkbox" id="pref-groups"' + (N.store.get('nexo.prefs.rememberGroups', true) ? ' checked' : '') + '><span>Lembrar grupos recolhidos do menu lateral</span></label></div>' +
        '</section>' +
        '<section class="card panel" aria-labelledby="demo-title"><h2 id="demo-title">Demonstração</h2>' +
          '<p class="panel-text">Simule o estado dos blocos de dados do painel e das tabelas para conferir os estados de carregamento, vazio e erro.</p>' +
          '<fieldset class="radio-group" style="margin-top:12px"><legend>Estado dos dados</legend>' +
            [['normal', 'Normal (dados de exemplo)'], ['loading', 'Carregando'], ['empty', 'Vazio'], ['error', 'Erro']].map(([v, l]) =>
              '<label class="check"><input type="radio" name="demo-state" value="' + v + '"' + (N.state.demo === v ? ' checked' : '') + '><span>' + l + '</span></label>').join('') +
          '</fieldset>' +
        '</section>' +
      '</div></div>';
    main.querySelector('#pref-period').addEventListener('change', (e) => {
      N.store.set('nexo.prefs.period', e.target.value);
      N.setState({ period: e.target.value });
      N.toast('Período padrão salvo: ' + N.periodById(e.target.value).label + '.');
    });
    main.querySelector('#pref-groups').addEventListener('change', (e) => {
      N.store.set('nexo.prefs.rememberGroups', e.target.checked);
      if (!e.target.checked) N.store.set('nexo.sidebar.groups', {});
      N.toast(e.target.checked ? 'O menu lateral vai lembrar os grupos recolhidos.' : 'O menu lateral não vai mais lembrar os grupos recolhidos.');
    });
    main.querySelectorAll('[name="demo-state"]').forEach((r) => r.addEventListener('change', (e) => {
      N.setState({ demo: e.target.value });
      N.toast('Estado da demonstração: ' + e.target.nextElementSibling.textContent + '.');
    }));
    current = { caps: {}, destroy() {} };
    return current;
  }

  function helpPage(main) {
    main.innerHTML = '<div class="page">' + pageHead('Ajuda', 'Atalhos, suporte e perguntas frequentes', {}) +
      '<div class="settings-grid">' +
        '<section class="card panel" aria-labelledby="kb-title"><h2 id="kb-title">Atalhos de teclado</h2><table class="kbd-table"><tbody>' +
          '<tr><th scope="row"><kbd>/</kbd></th><td>Abrir a busca (computador)</td></tr>' +
          '<tr><th scope="row"><kbd>R</kbd></th><td>Atualizar os dados da página</td></tr>' +
          '<tr><th scope="row"><kbd>?</kbd></th><td>Abrir esta página de ajuda</td></tr>' +
          '<tr><th scope="row"><kbd>Esc</kbd></th><td>Fechar menus, painéis e diálogos</td></tr>' +
          '<tr><th scope="row"><kbd>←</kbd> <kbd>→</kbd></th><td>Percorrer os meses de um gráfico focado</td></tr>' +
        '</tbody></table></section>' +
        '<section class="card panel" aria-labelledby="sup-title"><h2 id="sup-title">Suporte de TI</h2>' +
          '<p class="panel-text">Atendimento em dias úteis, das 8h às 20h.</p>' +
          '<p><a href="mailto:suporte.ti@nexocapital.com.br">suporte.ti@nexocapital.com.br</a></p>' +
          '<p class="panel-text">Ramal interno 4400.</p>' +
        '</section>' +
      '</div>' +
      '<section class="card panel faq" aria-labelledby="faq-title"><h2 id="faq-title">Perguntas frequentes</h2>' +
        '<details><summary>Como troco a unidade exibida?</summary><p>Use o seletor de unidade no topo do menu lateral (no celular, dentro do menu). Todos os blocos são recarregados com os dados da unidade escolhida.</p></details>' +
        '<details><summary>O que o seletor de período altera?</summary><p>Indicadores, atividades e tabelas passam a considerar o período escolhido; no gráfico mensal, os meses do período ficam destacados.</p></details>' +
        '<details><summary>Esta plataforma está conectada a dados reais?</summary><p>Não. Esta é uma demonstração de interface com dados fictícios gerados no próprio navegador.</p></details>' +
      '</section></div>';
    current = { caps: {}, destroy() {} };
    return current;
  }

  /* ---------- API ---------- */
  Pages.caps = function (route) {
    if (route.page === 'painel') return { period: true, export: true, refresh: true };
    if (TABLE_PAGES[route.page]) return { period: TABLE_PAGES[route.page].period, export: true, refresh: true };
    return { period: false, export: false, refresh: false };
  };
  Pages.exists = (page) => page === 'painel' || !!TABLE_PAGES[page] || ['perfil', 'configuracoes', 'ajuda'].includes(page);
  Pages.render = function (route, main) {
    if (current && current.destroy) current.destroy();
    current = null;
    if (route.page === 'painel') dashboardPage(main, route.tab);
    else if (TABLE_PAGES[route.page]) tablePage(main, route.page);
    else if (route.page === 'perfil') profilePage(main);
    else if (route.page === 'configuracoes') settingsPage(main);
    else helpPage(main);
    const info = route.page === 'painel' ? { label: TAB_CFG[route.tab].title } : N.pageInfo(route.page);
    document.title = info.label + (route.page === 'painel' ? ' · Painel' : '') + ' · Nexo Capital';
    return Pages.caps(route);
  };
  Pages.focusTitle = function () {
    const h = document.querySelector('#main .page-title');
    if (h) h.focus({ preventScroll: true });
  };
  Pages.refresh = () => { if (current && current.refresh) current.refresh(); };
  Pages.canRefresh = () => !!(current && current.refresh);
  Pages.exportCurrent = () => { if (current && current.exportCurrent) current.exportCurrent(); };
  Pages.setPendingQuery = (q) => { pendingQuery = q; };
  Pages.applyPendingQuery = () => { if (pendingQuery && current && current.applyQuery) current.applyQuery(pendingQuery); };

  document.addEventListener('nexo:state', () => { if (current && current.reload) current.reload(); });

  N.Pages = Pages;
})();
