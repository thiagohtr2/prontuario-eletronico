/* ==========================================================================
   Dados fictícios e formatadores. Tudo é gerado no front-end (sem backend).
   Data de referência fixa da demonstração: 02/11/2026 (data do PROMPT.md).
   ========================================================================== */
(function (w) {
  'use strict';
  var NX = (w.NX = w.NX || {});

  var REF = new Date(2026, 10, 2, 12, 0, 0);

  /* ---------- Formatadores (pt-BR) ---------- */
  var nfBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var nfInt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var nfDec1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var dfDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  NX.fmt = {
    brl: function (v) { return nfBRL.format(v); },
    int: function (v) { return nfInt.format(v); },
    mil: function (v) { return nfInt.format(v); },
    milBRL: function (v) { return 'R$ ' + nfInt.format(v) + ' mil'; },
    pct: function (v) { return nfDec1.format(v) + '%'; },
    signedPct: function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + nfDec1.format(Math.abs(v)) + '%'; },
    date: function (iso) {
      var p = iso.split('-');
      return dfDate.format(new Date(+p[0], +p[1] - 1, +p[2]));
    },
    esc: function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  };

  /* ---------- PRNG determinístico ---------- */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = hash(seed);
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Usuário, unidades, notificações ---------- */
  NX.user = {
    name: 'Ana Souza',
    email: 'ana.souza@nexocapital.com.br',
    role: 'Analista financeira',
    initials: 'AS',
    password: 'Nexo@2026'
  };

  NX.units = ['Matriz · São Paulo', 'Filial · Rio de Janeiro', 'Filial · Belo Horizonte'];

  NX.notifications = [
    { icon: 'triangle-alert', tone: 'warning', title: 'Cobrança em atraso', text: 'Padaria Sol Nascente: 5 dias sem pagamento.', time: 'há 20 min' },
    { icon: 'circle-check', tone: 'success', title: 'Pagamento conciliado', text: 'Orbital Tech Ltda. · R$ 18.400,00.', time: 'há 2 h' },
    { icon: 'info', tone: 'info', title: 'Fechamento de novembro', text: 'O fechamento contábil abre na sexta-feira.', time: 'ontem' }
  ];

  /* ---------- Navegação (fonte única para sidebar, drawer, abas e busca) ---------- */
  var PAINEL_VIEWS = [
    { id: 'visao-geral', label: 'Visão geral', icon: 'chart-column', route: 'painel/visao-geral' },
    { id: 'aquisicao', label: 'Aquisição', icon: 'user-plus', route: 'painel/aquisicao' },
    { id: 'retencao', label: 'Retenção', icon: 'repeat', route: 'painel/retencao' },
    { id: 'receita', label: 'Receita', icon: 'banknote', route: 'painel/receita' }
  ];

  NX.nav = [
    {
      id: 'gestao', title: 'Gestão',
      items: [
        { id: 'painel', label: 'Painel', icon: 'layout-dashboard', route: 'painel/visao-geral', module: 'painel', children: PAINEL_VIEWS },
        { id: 'contratos', label: 'Contratos', icon: 'file-text', route: 'contratos' },
        { id: 'fornecedores', label: 'Fornecedores', icon: 'truck', route: 'fornecedores' },
        { id: 'compras', label: 'Compras', icon: 'shopping-cart', route: 'compras' }
      ]
    },
    {
      id: 'pessoas', title: 'Pessoas',
      items: [
        { id: 'colaboradores', label: 'Colaboradores', icon: 'users', route: 'colaboradores' },
        { id: 'folha', label: 'Folha', icon: 'receipt', route: 'folha' }
      ]
    },
    {
      id: 'administracao', title: 'Administração',
      items: [
        { id: 'auditoria', label: 'Auditoria', icon: 'file-search', route: 'auditoria' },
        { id: 'permissoes', label: 'Permissões', icon: 'key-round', route: 'permissoes' }
      ]
    }
  ];

  NX.navSecondary = [
    { id: 'configuracoes', label: 'Configurações', icon: 'settings', route: 'configuracoes' },
    { id: 'ajuda', label: 'Ajuda', icon: 'circle-help', route: 'ajuda' }
  ];

  NX.panelViews = PAINEL_VIEWS;

  /** Resolve uma rota (ex.: "painel/receita") em { title, crumbs[], module, viewId }. */
  NX.resolveRoute = function (path) {
    var i, j, k, g, it, ch;
    for (i = 0; i < NX.nav.length; i++) {
      g = NX.nav[i];
      for (j = 0; j < g.items.length; j++) {
        it = g.items[j];
        if (it.children) {
          for (k = 0; k < it.children.length; k++) {
            ch = it.children[k];
            if (ch.route === path) {
              return { kind: 'dashboard', module: 'painel', viewId: ch.id, itemId: it.id, childId: ch.id, title: ch.label, crumbs: [it.label, ch.label] };
            }
          }
        }
        if (it.route === path) {
          return { kind: it.children ? 'dashboard' : 'placeholder', module: it.children ? 'painel' : 'other', viewId: it.children ? it.children[0].id : null, itemId: it.id, title: it.label, crumbs: [g.title, it.label], icon: it.icon };
        }
      }
    }
    var extra = {
      configuracoes: 'Configurações', ajuda: 'Ajuda', perfil: 'Meu perfil'
    };
    if (extra[path]) {
      return { kind: 'placeholder', module: 'other', itemId: path, title: extra[path], crumbs: [extra[path]], icon: path === 'ajuda' ? 'circle-help' : path === 'perfil' ? 'user' : 'settings' };
    }
    return null;
  };

  /* ---------- Períodos ---------- */
  NX.periods = [
    /* months = janela do gráfico mensal: max(6, meses que cruzam o período) */
    { id: 'p30', label: 'Últimos 30 dias', days: 30, months: 6, factor: 1 },
    { id: 'p90', label: 'Últimos 90 dias', days: 90, months: 6, factor: 2.9 },
    { id: 'p6m', label: 'Últimos 6 meses', days: 183, months: 7, factor: 5.8 },
    { id: 'p12m', label: 'Últimos 12 meses', days: 365, months: 12, factor: 11.6 }
  ];
  NX.periodById = function (id) {
    for (var i = 0; i < NX.periods.length; i++) if (NX.periods[i].id === id) return NX.periods[i];
    return NX.periods[0];
  };

  /* ---------- Meses (dez/2025 … nov/2026) ---------- */
  NX.months = [
    ['dez', 'Dezembro de 2025'], ['jan', 'Janeiro de 2026'], ['fev', 'Fevereiro de 2026'],
    ['mar', 'Março de 2026'], ['abr', 'Abril de 2026'], ['mai', 'Maio de 2026'],
    ['jun', 'Junho de 2026'], ['jul', 'Julho de 2026'], ['ago', 'Agosto de 2026'],
    ['set', 'Setembro de 2026'], ['out', 'Outubro de 2026'], ['nov', 'Novembro de 2026']
  ];

  /* ---------- Status ---------- */
  NX.status = {
    pago: { label: 'Pago', tone: 'success' },
    pendente: { label: 'Pendente', tone: 'warning' },
    atrasado: { label: 'Atrasado', tone: 'error' },
    analise: { label: 'Em análise', tone: 'info' }
  };

  /* ---------- Conteúdo das 4 visões do Painel ---------- */
  var CUSTOMERS = [
    'Orbital Tech Ltda.', 'Grupo Marlin S.A.', 'Padaria Sol Nascente', 'Cooperativa Vale Verde',
    'Studio Aurora Design', 'Metalúrgica Brasil', 'Lume Energia', 'Vértice Logística',
    'Clínica Bem Viver', 'Agro Campos do Sul', 'Fênix Educação', 'Rota 66 Transportes'
  ];
  var PAY = ['Boleto', 'Pix', 'Transferência', 'Cartão corporativo'];

  NX.views = {
    'visao-geral': {
      label: 'Visão geral',
      sub: 'Resumo financeiro consolidado da unidade.',
      kpis: [
        { label: 'Receita líquida', type: 'brl', base: 1284560, flow: true, delta: 8.4, upGood: true },
        { label: 'Despesas operacionais', type: 'brl', base: 742310, flow: true, delta: -2.1, upGood: false },
        { label: 'Saldo em caixa', type: 'brl', base: 3918240, flow: false, delta: 5.2, upGood: true }
      ],
      chart: {
        title: 'Vendas por mês', s1: 'Vendas', s2: 'Meta',
        d1: [412, 438, 401, 455, 472, 468, 490, 512, 498, 531, 556, 584],
        d2: [420, 420, 430, 440, 450, 460, 470, 480, 500, 510, 520, 540]
      },
      activities: [
        ['circle-check', 'success', 'Pagamento recebido', 'Orbital Tech Ltda. · R$ 18.400,00', 0, 12],
        ['receipt', 'info', 'Fatura emitida', 'Grupo Marlin S.A. · FAT-2291', 0, 190],
        ['triangle-alert', 'warning', 'Cobrança em atraso', 'Padaria Sol Nascente · 5 dias', 1],
        ['banknote', 'success', 'Transferência confirmada', 'Cooperativa Vale Verde · R$ 52.900,00', 2],
        ['circle-x', 'error', 'Pedido cancelado', 'Studio Aurora Design · PED-4807', 4],
        ['file-text', 'info', 'Contrato renovado', 'Metalúrgica Brasil · 12 meses', 9],
        ['circle-check', 'success', 'Pagamento recebido', 'Lume Energia · R$ 7.350,00', 21],
        ['triangle-alert', 'warning', 'Limite de crédito próximo', 'Vértice Logística · 92% utilizado', 44],
        ['circle-check', 'success', 'Meta trimestral atingida', 'Equipe comercial · 3º trimestre', 120]
      ],
      table: { title: 'Pedidos recentes', prefix: 'PED-', seed: 4800 }
    },
    aquisicao: {
      label: 'Aquisição',
      sub: 'Novos clientes e contratos captados.',
      kpis: [
        { label: 'Novos clientes', type: 'int', base: 148, flow: true, delta: 12.6, upGood: true },
        { label: 'Custo por aquisição', type: 'brl', base: 312.4, flow: false, delta: -4.3, upGood: false },
        { label: 'Taxa de conversão', type: 'pct', base: 3.8, flow: false, delta: 0.6, upGood: true }
      ],
      chart: {
        title: 'Novos contratos por mês', s1: 'Contratos', s2: 'Meta',
        d1: [210, 188, 176, 224, 240, 255, 231, 268, 279, 291, 305, 322],
        d2: [200, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300]
      },
      activities: [
        ['user-plus', 'success', 'Novo cliente', 'Fênix Educação · plano Corporate', 0, 45],
        ['file-text', 'info', 'Proposta enviada', 'Agro Campos do Sul · R$ 86.000,00', 1],
        ['handshake', 'success', 'Contrato assinado', 'Rota 66 Transportes · 24 meses', 3],
        ['clock', 'warning', 'Proposta expira em 2 dias', 'Clínica Bem Viver', 5],
        ['circle-x', 'error', 'Proposta recusada', 'Lume Energia · preço', 12],
        ['user-plus', 'success', 'Novo cliente', 'Studio Aurora Design · plano Essencial', 26],
        ['handshake', 'success', 'Contrato assinado', 'Vértice Logística · 12 meses', 63],
        ['file-text', 'info', 'Proposta enviada', 'Grupo Marlin S.A. · R$ 142.000,00', 98]
      ],
      table: { title: 'Novos contratos', prefix: 'CTR-', seed: 1100 }
    },
    retencao: {
      label: 'Retenção',
      sub: 'Renovações, cancelamentos e saúde da base.',
      kpis: [
        { label: 'Taxa de retenção', type: 'pct', base: 94.2, flow: false, delta: 1.1, upGood: true },
        { label: 'Cancelamentos (churn)', type: 'pct', base: 1.8, flow: false, delta: -0.4, upGood: false },
        { label: 'Contratos renovados', type: 'int', base: 87, flow: true, delta: 6.8, upGood: true }
      ],
      chart: {
        title: 'Renovações por mês', s1: 'Renovações', s2: 'Previstas',
        d1: [64, 71, 58, 69, 77, 82, 79, 88, 84, 91, 96, 102],
        d2: [70, 70, 66, 72, 75, 80, 82, 85, 88, 90, 94, 98]
      },
      activities: [
        ['repeat', 'success', 'Contrato renovado', 'Metalúrgica Brasil · 12 meses', 0, 80],
        ['triangle-alert', 'warning', 'Risco de cancelamento', 'Padaria Sol Nascente · uso em queda', 2],
        ['circle-x', 'error', 'Cancelamento solicitado', 'Rota 66 Transportes', 6],
        ['repeat', 'success', 'Contrato renovado', 'Clínica Bem Viver · 24 meses', 14],
        ['clock', 'info', 'Renovação em 15 dias', 'Orbital Tech Ltda.', 20],
        ['repeat', 'success', 'Contrato renovado', 'Lume Energia · 12 meses', 52],
        ['circle-x', 'error', 'Cancelamento concluído', 'Fênix Educação', 130]
      ],
      table: { title: 'Renovações recentes', prefix: 'REN-', seed: 2300 }
    },
    receita: {
      label: 'Receita',
      sub: 'Faturamento, recorrência e inadimplência.',
      kpis: [
        { label: 'Receita recorrente (MRR)', type: 'brl', base: 962300, flow: false, delta: 4.9, upGood: true },
        { label: 'Ticket médio', type: 'brl', base: 8670, flow: false, delta: 2.3, upGood: true },
        { label: 'Inadimplência', type: 'pct', base: 2.7, flow: false, delta: 0.3, upGood: false }
      ],
      chart: {
        title: 'Receita por mês', s1: 'Receita', s2: 'Orçado',
        d1: [880, 912, 876, 931, 958, 944, 977, 1004, 993, 1042, 1086, 1128],
        d2: [900, 900, 910, 925, 940, 955, 970, 985, 1000, 1020, 1050, 1090]
      },
      activities: [
        ['banknote', 'success', 'Receita reconhecida', 'Contratos de novembro · R$ 962.300,00', 0, 300],
        ['receipt', 'info', 'Faturas emitidas em lote', '212 faturas · ciclo 02/11', 0, 600],
        ['triangle-alert', 'warning', 'Inadimplência acima da meta', '2,7% · limite 2,5%', 3],
        ['circle-check', 'success', 'Conciliação concluída', 'Banco Atlântico · 1.204 lançamentos', 7],
        ['circle-x', 'error', 'Estorno processado', 'Studio Aurora Design · R$ 1.980,00', 18],
        ['banknote', 'success', 'Receita reconhecida', 'Contratos de outubro · R$ 917.400,00', 33],
        ['triangle-alert', 'warning', 'Revisão de tarifas', 'Comitê financeiro', 75]
      ],
      table: { title: 'Faturas recentes', prefix: 'FAT-', seed: 2200 }
    }
  };

  /* ---------- Geradores determinísticos por visão × período ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDaysAgo(d) {
    var x = new Date(REF.getTime() - d * 86400000);
    return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
  }

  NX.kpisFor = function (viewId, periodId) {
    var v = NX.views[viewId], p = NX.periodById(periodId);
    return v.kpis.map(function (k, i) {
      var r = rng(viewId + periodId + i);
      var wiggle = 0.94 + r() * 0.12;
      var val = k.base * (k.flow ? p.factor : 1) * (k.flow ? 1 : wiggle);
      if (k.type === 'int') val = Math.round(val);
      if (k.type === 'pct') val = Math.round(val * 10) / 10;
      var d = Math.round((k.delta + (r() - 0.5) * 3) * 10) / 10;
      if (d === 0) d = 0.1;
      var up = d > 0;
      var good = up === k.upGood;
      return {
        label: k.label,
        text: k.type === 'brl' ? NX.fmt.brl(val) : k.type === 'int' ? NX.fmt.int(val) : NX.fmt.pct(val),
        delta: NX.fmt.signedPct(d),
        up: up,
        good: good
      };
    });
  };

  NX.chartFor = function (viewId, periodId) {
    var c = NX.views[viewId].chart, p = NX.periodById(periodId);
    var n = p.months, start = 12 - n;
    return {
      title: c.title,
      unit: 'R$ mil',
      series: [
        { id: 's1', name: c.s1, values: c.d1.slice(start) },
        { id: 's2', name: c.s2, values: c.d2.slice(start) }
      ],
      cats: NX.months.slice(start).map(function (m) { return { short: m[0], long: m[1] }; })
    };
  };

  function agoLabel(days, mins) {
    if (days === 0) {
      if (mins < 60) return 'há ' + mins + ' min';
      return 'há ' + Math.round(mins / 60) + ' h';
    }
    if (days === 1) return 'ontem';
    if (days < 14) return 'há ' + days + ' dias';
    if (days < 60) return 'há ' + Math.round(days / 7) + ' sem';
    return 'há ' + Math.round(days / 30) + ' meses';
  }

  NX.activitiesFor = function (viewId, periodId) {
    var p = NX.periodById(periodId);
    var all = NX.views[viewId].activities.filter(function (a) { return a[4] <= p.days; });
    return {
      total: all.length,
      items: all.slice(0, 5).map(function (a) {
        return { icon: a[0], tone: a[1], title: a[2], meta: a[3], time: agoLabel(a[4], a[5] || 0) };
      })
    };
  };

  NX.tableFor = function (viewId, periodId) {
    var t = NX.views[viewId].table, p = NX.periodById(periodId);
    var r = rng('tbl' + viewId + periodId);
    var order = ['pago', 'pendente', 'atrasado', 'analise'];
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    var pool = CUSTOMERS.slice();
    var rows = [];
    var span = Math.max(3, Math.round(p.days * 0.7));
    var offs = [0, 1, 2, 3].map(function () { return Math.floor(r() * span); }).sort(function (a, b) { return a - b; });
    offs[0] = Math.min(offs[0], 2);
    for (var k = 0; k < 4; k++) {
      var idx = Math.floor(r() * pool.length);
      var name = pool.splice(idx, 1)[0];
      var value = Math.round((1800 + r() * 56000) / 10) * 10 + Math.round(r() * 99) / 100;
      rows.push({
        id: t.prefix + (t.seed + Math.floor(r() * 900) + k * 7),
        cliente: name,
        status: order[k],
        valor: value,
        data: isoDaysAgo(offs[k]),
        forma: PAY[Math.floor(r() * PAY.length)]
      });
    }
    return { title: t.title, rows: rows };
  };
})(window);
