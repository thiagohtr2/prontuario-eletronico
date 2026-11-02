/* Dados fictícios da demonstração (sem backend).
   "Hoje" da demonstração é fixo em 02/11/2026, data da especificação. */
(function () {
  var A = window.Atlas = window.Atlas || {};
  var u = A.u;

  var TODAY = new Date(2026, 10, 2);

  // gerador pseudoaleatório determinístico (mulberry32)
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var people = [
    { id: 'p1', name: 'Marina Costa', role: 'Gerente de produto', team: 'Produto', email: 'marina@atlas.app', status: 'Ativo' },
    { id: 'p2', name: 'Rafael Lima', role: 'Desenvolvedor front-end', team: 'Engenharia', email: 'rafael.lima@atlas.app', status: 'Ativo' },
    { id: 'p3', name: 'Juliana Alves', role: 'Designer de produto', team: 'Design', email: 'juliana.alves@atlas.app', status: 'Ativo' },
    { id: 'p4', name: 'Pedro Santos', role: 'Desenvolvedor back-end', team: 'Engenharia', email: 'pedro.santos@atlas.app', status: 'Ausente' },
    { id: 'p5', name: 'Camila Rocha', role: 'Analista de dados', team: 'Dados', email: 'camila.rocha@atlas.app', status: 'Ativo' },
    { id: 'p6', name: 'Lucas Ferreira', role: 'Gerente de contas', team: 'Comercial', email: 'lucas.ferreira@atlas.app', status: 'Ativo' },
    { id: 'p7', name: 'Beatriz Souza', role: 'Redatora', team: 'Marketing', email: 'beatriz.souza@atlas.app', status: 'Ativo' },
    { id: 'p8', name: 'Thiago Martins', role: 'Analista de qualidade', team: 'Engenharia', email: 'thiago.martins@atlas.app', status: 'Ausente' },
    { id: 'p9', name: 'Fernanda Dias', role: 'Sucesso do cliente', team: 'Atendimento', email: 'fernanda.dias@atlas.app', status: 'Ativo' },
    { id: 'p10', name: 'André Ribeiro', role: 'Diretor de operações', team: 'Operações', email: 'andre.ribeiro@atlas.app', status: 'Convidado' }
  ];

  var STATUS = {
    novo: 'Novo',
    andamento: 'Em andamento',
    pausado: 'Pausado',
    concluido: 'Concluído'
  };

  function items(names, seed) {
    var r = rng(seed);
    var st = ['Publicado', 'Em revisão', 'Rascunho'];
    return names.map(function (n, i) {
      var day = 30 - Math.floor(r() * 20);
      return {
        id: u.norm(n).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: n,
        status: st[Math.floor(r() * 3)],
        updated: '2026-10-' + String(Math.min(day, 31)).padStart(2, '0'),
        sections: ['Cabeçalho', 'Conteúdo principal', 'Chamada para ação', 'Rodapé'].map(function (s, j) { return { name: s, done: r() > 0.45 || j === 0 }; }),
        comments: i === 0 ? [
          { who: 'p3', text: 'Subi a nova versão do layout com o bloco de depoimentos.', when: 'há 2 h' },
          { who: 'p2', text: 'Ajustei o espaçamento no celular; falta revisar o rodapé.', when: 'há 40 min' }
        ] : []
      };
    });
  }

  var projects = [
    { id: 'site-institucional', name: 'Site institucional', status: 'andamento', icon: 'globe', desc: 'Redesenho do site da empresa com novo gerenciador de conteúdo, páginas de produto e blog.', owner: 'p3', due: '2026-11-28', progress: 64, team: ['p3', 'p2', 'p7', 'p1'],
      items: items(['Página inicial', 'Sobre nós', 'Produtos', 'Blog', 'Contato'], 11) },
    { id: 'viagem-lisboa', name: 'Viagem a Lisboa', status: 'novo', icon: 'plane', desc: '7 dias com roteiro guiado, hospedagem e passeios inclusos.', owner: 'p6', due: '2026-12-12', progress: 8, team: ['p6', 'p7', 'p9'],
      items: items(['Roteiro dia a dia', 'Página de reserva', 'Material de divulgação'], 12) },
    { id: 'app-mobile', name: 'App mobile 2.0', status: 'andamento', icon: 'smartphone', desc: 'Nova versão do aplicativo com modo offline, notificações e login por biometria.', owner: 'p2', due: '2027-01-20', progress: 41, team: ['p2', 'p4', 'p3', 'p8'],
      items: items(['Tela de login', 'Painel do usuário', 'Notificações', 'Modo offline'], 13) },
    { id: 'portal-cliente', name: 'Portal do cliente', status: 'andamento', icon: 'users', desc: 'Área logada para clientes acompanharem pedidos, faturas e chamados de suporte.', owner: 'p4', due: '2026-12-05', progress: 72, team: ['p4', 'p2', 'p9'],
      items: items(['Pedidos', 'Faturas', 'Chamados'], 14) },
    { id: 'campanha-verao', name: 'Campanha de verão', status: 'novo', icon: 'megaphone', desc: 'Campanha integrada para redes sociais, e-mail e mídia paga na temporada de verão.', owner: 'p7', due: '2026-12-01', progress: 15, team: ['p7', 'p6', 'p3'],
      items: items(['Peças para redes sociais', 'Sequência de e-mails', 'Página da campanha'], 15) },
    { id: 'integracao-erp', name: 'Integração ERP', status: 'pausado', icon: 'plug', desc: 'Sincronização de estoque, pedidos e notas fiscais com o sistema de gestão.', owner: 'p4', due: '2027-02-15', progress: 33, team: ['p4', 'p5'],
      items: items(['Mapeamento de dados', 'API de pedidos', 'Rotina de estoque'], 16) },
    { id: 'design-system', name: 'Design system', status: 'andamento', icon: 'layers', desc: 'Biblioteca de componentes, tokens e documentação compartilhada entre produtos.', owner: 'p3', due: '2026-12-18', progress: 58, team: ['p3', 'p2'],
      items: items(['Tokens de cor', 'Componentes de formulário', 'Documentação'], 17) },
    { id: 'onboarding', name: 'Onboarding de clientes', status: 'concluido', icon: 'rocket', desc: 'Fluxo guiado de primeiros passos com checklist, vídeos curtos e e-mails de boas-vindas.', owner: 'p9', due: '2026-10-15', progress: 100, team: ['p9', 'p7', 'p1'],
      items: items(['Checklist inicial', 'Vídeos curtos', 'E-mails de boas-vindas'], 18) },
    { id: 'relatorio-anual', name: 'Relatório anual 2026', status: 'novo', icon: 'fileText', desc: 'Consolidação de resultados do ano com indicadores, depoimentos e metas para 2027.', owner: 'p5', due: '2027-01-31', progress: 5, team: ['p5', 'p1', 'p7'],
      items: items(['Indicadores', 'Depoimentos', 'Metas 2027'], 19) },
    { id: 'loja-online', name: 'Loja online', status: 'andamento', icon: 'cart', desc: 'Catálogo com checkout simplificado, cupons de desconto e cálculo de frete.', owner: 'p2', due: '2027-03-10', progress: 27, team: ['p2', 'p4', 'p6'],
      items: items(['Catálogo', 'Checkout', 'Cupons'], 20) },
    { id: 'central-ajuda', name: 'Central de ajuda', status: 'concluido', icon: 'lifeBuoy', desc: 'Base de conhecimento com artigos pesquisáveis e formulário de contato integrado.', owner: 'p9', due: '2026-09-30', progress: 100, team: ['p9', 'p7'],
      items: items(['Artigos', 'Busca', 'Formulário de contato'], 21) },
    { id: 'pesquisa-ux', name: 'Pesquisa com usuários', status: 'pausado', icon: 'message', desc: 'Entrevistas e testes de usabilidade para priorizar o roadmap do próximo semestre.', owner: 'p3', due: '2026-11-20', progress: 46, team: ['p3', 'p5', 'p1'],
      items: items(['Roteiro de entrevistas', 'Testes de usabilidade', 'Síntese'], 22) }
  ];

  var tasks = [
    { id: 't1', title: 'Revisar layout da página inicial', project: 'site-institucional', due: '2026-11-02', done: false, priority: 'Alta', who: 'p1' },
    { id: 't2', title: 'Aprovar roteiro da viagem a Lisboa', project: 'viagem-lisboa', due: '2026-11-02', done: false, priority: 'Média', who: 'p1' },
    { id: 't3', title: 'Enviar briefing da campanha de verão', project: 'campanha-verao', due: '2026-11-02', done: true, priority: 'Média', who: 'p1' },
    { id: 't4', title: 'Validar fluxo de login por biometria', project: 'app-mobile', due: '2026-11-03', done: false, priority: 'Alta', who: 'p8' },
    { id: 't5', title: 'Definir métricas do relatório anual', project: 'relatorio-anual', due: '2026-11-04', done: false, priority: 'Baixa', who: 'p5' },
    { id: 't6', title: 'Publicar artigo sobre faturas', project: 'portal-cliente', due: '2026-11-05', done: false, priority: 'Média', who: 'p7' },
    { id: 't7', title: 'Atualizar tokens de cor', project: 'design-system', due: '2026-11-06', done: true, priority: 'Baixa', who: 'p3' },
    { id: 't8', title: 'Testar cálculo de frete', project: 'loja-online', due: '2026-11-09', done: false, priority: 'Alta', who: 'p4' },
    { id: 't9', title: 'Agendar entrevistas com clientes', project: 'pesquisa-ux', due: '2026-11-10', done: false, priority: 'Média', who: 'p3' },
    { id: 't10', title: 'Revisar textos da página Sobre nós', project: 'site-institucional', due: '2026-10-30', done: true, priority: 'Baixa', who: 'p7' }
  ];

  var events = [
    { id: 'e1', title: 'Daily de produto', date: '2026-11-02', start: '09:30', end: '09:45', project: 'site-institucional', where: 'Sala virtual' },
    { id: 'e2', title: 'Revisão do site institucional', date: '2026-11-02', start: '14:00', end: '15:00', project: 'site-institucional', where: 'Sala Atlântico' },
    { id: 'e3', title: 'Planejamento da campanha', date: '2026-11-03', start: '10:00', end: '11:30', project: 'campanha-verao', where: 'Sala virtual' },
    { id: 'e4', title: 'Teste de usabilidade', date: '2026-11-05', start: '15:00', end: '16:00', project: 'pesquisa-ux', where: 'Laboratório' },
    { id: 'e5', title: 'Reunião com fornecedor de turismo', date: '2026-11-06', start: '11:00', end: '12:00', project: 'viagem-lisboa', where: 'Sala virtual' },
    { id: 'e6', title: 'Sprint review', date: '2026-11-10', start: '16:00', end: '17:00', project: 'app-mobile', where: 'Auditório' },
    { id: 'e7', title: 'Entrega do portal do cliente', date: '2026-11-13', start: '18:00', end: '18:30', project: 'portal-cliente', where: '—' },
    { id: 'e8', title: 'Workshop de design system', date: '2026-11-17', start: '09:00', end: '12:00', project: 'design-system', where: 'Sala Atlântico' },
    { id: 'e9', title: 'Retrospectiva mensal', date: '2026-11-24', start: '15:00', end: '16:00', project: 'onboarding', where: 'Sala virtual' },
    { id: 'e10', title: 'Prazo: site institucional', date: '2026-11-28', start: '18:00', end: '18:30', project: 'site-institucional', where: '—' },
    { id: 'e11', title: 'Kickoff do relatório anual', date: '2026-10-28', start: '10:00', end: '11:00', project: 'relatorio-anual', where: 'Sala virtual' },
    { id: 'e12', title: 'Apresentação de resultados', date: '2026-12-03', start: '14:00', end: '15:30', project: 'relatorio-anual', where: 'Auditório' }
  ];

  var conversations = [
    { id: 'c1', with: 'p3', unread: true, messages: [
      { from: 'me', text: 'Oi, Juliana! Conseguiu fechar a página inicial?', time: '09:12' },
      { from: 'p3', text: 'Quase! Subi uma versão nova com os depoimentos. Consegue revisar hoje?', time: '09:40' }
    ] },
    { id: 'c2', with: 'p6', unread: true, messages: [
      { from: 'p6', text: 'O fornecedor confirmou os hotéis da viagem a Lisboa.', time: '08:55' },
      { from: 'p6', text: 'Te mando o roteiro atualizado até o almoço.', time: '08:56' }
    ] },
    { id: 'c3', with: 'p2', unread: true, messages: [
      { from: 'p2', text: 'Publiquei a correção do menu no celular. Pode testar no seu aparelho?', time: 'Ontem' }
    ] },
    { id: 'c4', with: 'p5', unread: false, messages: [
      { from: 'p5', text: 'Os números de outubro já estão no painel.', time: 'Ontem' },
      { from: 'me', text: 'Perfeito, obrigada!', time: 'Ontem' }
    ] },
    { id: 'c5', with: 'p9', unread: false, messages: [
      { from: 'me', text: 'Como foi o retorno dos clientes sobre o onboarding?', time: 'Sex' },
      { from: 'p9', text: 'Muito positivo. A taxa de ativação subiu 18%.', time: 'Sex' }
    ] },
    { id: 'c6', with: 'p7', unread: false, messages: [
      { from: 'p7', text: 'Enviei os textos da campanha para revisão.', time: 'Qui' }
    ] }
  ];

  var notifications = [
    { id: 'n1', text: 'Juliana Alves comentou em “Página inicial”.', when: 'há 12 min', unread: true, href: '#/projetos/site-institucional/pagina-inicial', icon: 'message' },
    { id: 'n2', text: 'Lucas Ferreira atribuiu a você “Aprovar roteiro da viagem a Lisboa”.', when: 'há 1 h', unread: true, href: '#/tarefas', icon: 'checkSquare' },
    { id: 'n3', text: 'O projeto “Portal do cliente” chegou a 72% de progresso.', when: 'há 3 h', unread: true, href: '#/projetos/portal-cliente', icon: 'trendingUp' },
    { id: 'n4', text: 'Novo pedido de Padaria Pão Dourado: R$ 1.280,00.', when: 'Ontem', unread: false, href: '#/painel', icon: 'cart' },
    { id: 'n5', text: 'Camila Rocha publicou o relatório de outubro.', when: 'Ontem', unread: false, href: '#/relatorios/receita', icon: 'chart' },
    { id: 'n6', text: 'André Ribeiro aceitou o convite para o workspace.', when: 'Sex', unread: false, href: '#/pessoas', icon: 'userPlus' }
  ];

  var orders = [
    { id: 'o1', client: 'Padaria Pão Dourado', status: 'Pago', value: 1280.00, date: '2026-11-01' },
    { id: 'o2', client: 'Studio Vértice', status: 'Pendente', value: 3450.90, date: '2026-10-31' },
    { id: 'o3', client: 'Clínica Bem Viver', status: 'Pago', value: 890.50, date: '2026-10-30' },
    { id: 'o4', client: 'Mercado Central', status: 'Cancelado', value: 2120.00, date: '2026-10-28' }
  ];

  /* ---------- Séries do painel por período ---------- */
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function series(n, seed, total, trend) {
    var r = rng(seed), raw = [];
    for (var i = 0; i < n; i++) raw.push((0.7 + r() * 0.6) * (1 + (trend || 0) * i / n));
    var sum = raw.reduce(function (a, b) { return a + b; }, 0);
    return raw.map(function (v) { return Math.round(v / sum * total); });
  }
  var DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  function labelsDays(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) {
      var d = addDays(TODAY, -i);
      out.push({ short: n <= 7 ? DOW[d.getDay()] : String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'), long: u.dateLong(d) });
    }
    return out;
  }
  function labelsWeeks(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) {
      var d = addDays(TODAY, -i * 7 - 6);
      out.push({ short: String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'), long: 'Semana de ' + d.getDate() + ' de ' + u.MESES_LONGOS[d.getMonth()] });
    }
    return out;
  }
  function labelsMonths(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) {
      var d = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1);
      var m = u.MESES[d.getMonth()];
      out.push({ short: m.charAt(0).toUpperCase() + m.slice(1), long: u.MESES_LONGOS[d.getMonth()] + ' de ' + d.getFullYear() });
    }
    return out;
  }
  function spark(n, seed, trend) {
    var r = rng(seed), out = [], v = 50;
    for (var i = 0; i < n; i++) { v += (r() - 0.5) * 12 + trend; out.push(Math.max(5, Math.round(v))); }
    return out;
  }

  var periods = {
    '7d': { label: '7 dias', compare: 'vs. 7 dias anteriores', revenueLabel: 'Receita semanal', unit: 'dia', revenue: 11340, labels: labelsDays(7), seed: 7 },
    '30d': { label: '30 dias', compare: 'vs. mês anterior', revenueLabel: 'Receita mensal', unit: 'dia', revenue: 48200, labels: labelsDays(30), seed: 30 },
    '90d': { label: '90 dias', compare: 'vs. trimestre anterior', revenueLabel: 'Receita trimestral', unit: 'semana', revenue: 139600, labels: labelsWeeks(13), seed: 90 },
    '12m': { label: '12 meses', compare: 'vs. ano anterior', revenueLabel: 'Receita anual', unit: 'mês', revenue: 512400, labels: labelsMonths(12), seed: 12 }
  };
  var kpiDeltas = {
    '7d': { revenue: 4.8, tasks: -6.1, tasksVal: 46, projects: 0, projectsVal: 12 },
    '30d': { revenue: 12.4, tasks: -3.2, tasksVal: 184, projects: 0, projectsVal: 12 },
    '90d': { revenue: 8.1, tasks: 2.7, tasksVal: 542, projects: 0, projectsVal: 12 },
    '12m': { revenue: 21.3, tasks: 9.8, tasksVal: 2104, projects: 20, projectsVal: 12 }
  };

  var activityPool = [
    { who: 'p3', text: 'publicou uma nova versão de “Página inicial”', project: 'Site institucional' },
    { who: 'p6', text: 'adicionou o roteiro de 7 dias', project: 'Viagem a Lisboa' },
    { who: 'p2', text: 'concluiu “Corrigir menu no celular”', project: 'App mobile 2.0' },
    { who: 'p5', text: 'atualizou os indicadores de outubro', project: 'Relatório anual 2026' },
    { who: 'p9', text: 'respondeu 12 chamados', project: 'Portal do cliente' },
    { who: 'p7', text: 'enviou textos para revisão', project: 'Campanha de verão' },
    { who: 'p4', text: 'pausou a sincronização de estoque', project: 'Integração ERP' },
    { who: 'p8', text: 'abriu 3 relatórios de erro', project: 'App mobile 2.0' },
    { who: 'p1', text: 'criou o projeto', project: 'Viagem a Lisboa' },
    { who: 'p10', text: 'entrou no workspace', project: 'Equipe' }
  ];
  var activityTimes = {
    '7d': ['há 12 min', 'há 1 h', 'há 3 h', 'Ontem', 'Sáb'],
    '30d': ['há 12 min', 'Ontem', 'há 4 dias', 'há 9 dias', 'há 3 semanas'],
    '90d': ['Ontem', 'há 2 semanas', 'há 1 mês', 'há 6 semanas', 'há 2 meses'],
    '12m': ['Ontem', 'há 1 mês', 'há 3 meses', 'há 6 meses', 'há 10 meses']
  };
  var activityOffset = { '7d': 0, '30d': 2, '90d': 4, '12m': 5 };

  function dashboard(periodKey) {
    var p = periods[periodKey];
    var d = kpiDeltas[periodKey];
    var bars = series(p.labels.length, p.seed, p.revenue, 0.4);
    var acts = [];
    for (var i = 0; i < 5; i++) {
      var a = activityPool[(activityOffset[periodKey] + i) % activityPool.length];
      acts.push({ who: a.who, text: a.text, project: a.project, when: activityTimes[periodKey][i] });
    }
    return {
      period: p,
      kpis: [
        { id: 'receita', label: p.revenueLabel, value: u.milBRL(p.revenue), delta: d.revenue, compare: p.compare, icon: 'wallet', spark: resample(bars, 12), sparkFmt: 'money' },
        { id: 'tarefas', label: 'Tarefas concluídas', value: u.num(d.tasksVal), delta: d.tasks, compare: p.compare, icon: 'circleCheck', spark: spark(12, p.seed + 3, d.tasks > 0 ? 1.2 : -1.2), sparkFmt: 'num' },
        { id: 'projetos', label: 'Projetos ativos', value: u.num(d.projectsVal), delta: d.projects, compare: p.compare, icon: 'folder', spark: spark(12, p.seed + 9, d.projects ? 1.5 : 0), sparkFmt: 'num' }
      ],
      bars: bars.map(function (v, i) { return { label: p.labels[i].short, long: p.labels[i].long, value: v }; }),
      activities: acts
    };
  }
  function resample(arr, n) {
    if (arr.length <= n) return arr.slice();
    var out = [], step = arr.length / n;
    for (var i = 0; i < n; i++) {
      var s = 0, c = 0;
      for (var j = Math.floor(i * step); j < Math.floor((i + 1) * step); j++) { s += arr[j]; c++; }
      out.push(c ? Math.round(s / c) : 0);
    }
    return out;
  }

  /* ---------- Relatórios (12 meses) ---------- */
  var months = labelsMonths(12);
  var reports = [
    { id: 'receita', title: 'Receita mensal', desc: 'Receita faturada por mês, já descontados cancelamentos e reembolsos.', unit: 'money', icon: 'wallet', values: series(12, 101, 512400, 0.5) },
    { id: 'tarefas', title: 'Tarefas concluídas', desc: 'Quantidade de tarefas marcadas como concluídas em todos os projetos.', unit: 'num', icon: 'circleCheck', values: series(12, 102, 2104, 0.3) },
    { id: 'projetos', title: 'Projetos ativos', desc: 'Projetos com status “Novo” ou “Em andamento” ao fim de cada mês.', unit: 'num', icon: 'folder', values: [8, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 12] },
    { id: 'clientes', title: 'Novos clientes', desc: 'Contas criadas no período que fizeram ao menos um pedido.', unit: 'num', icon: 'userPlus', values: series(12, 104, 412, 0.6) }
  ];
  reports.forEach(function (r) { r.labels = months; });

  A.data = {
    TODAY: TODAY,
    STATUS: STATUS,
    people: people,
    projects: projects,
    tasks: tasks,
    events: events,
    conversations: conversations,
    notifications: notifications,
    orders: orders,
    periods: periods,
    dashboard: dashboard,
    reports: reports,
    person: function (id) { return people.filter(function (p) { return p.id === id; })[0]; },
    project: function (id) { return projects.filter(function (p) { return p.id === id; })[0]; },
    unreadMessages: function () { return conversations.filter(function (c) { return c.unread; }).length; },
    unreadNotifications: function () { return notifications.filter(function (n) { return n.unread; }).length; },
    // conta de demonstração
    demoAccount: { name: 'Marina Costa', email: 'marina@atlas.app', password: 'atlas1234', role: 'Gerente de produto' }
  };
})();
