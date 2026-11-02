/* Dados fictícios da demonstração (nenhum backend). */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});

  const D = (A.data = {});

  D.brand = { name: 'Atlas Workspace', short: 'Atlas', mark: 'A' };

  D.demoUser = { name: 'Marina Alves', email: 'demo@atlas.com', role: 'Gerente de produto', password: 'Atlas@2026' };

  /** Navegação (sidebar e menu móvel): mesmos destinos nas duas versões. */
  D.nav = [
    { group: 'Geral', items: [
      { id: 'inicio', label: 'Início', icon: 'home' },
      { id: 'painel', label: 'Painel', icon: 'layout-dashboard' },
      { id: 'projetos', label: 'Projetos', icon: 'folder', badge: 12 },
      { id: 'tarefas', label: 'Tarefas', icon: 'circle-check' },
      { id: 'calendario', label: 'Calendário', icon: 'calendar' },
    ] },
    { group: 'Equipe', items: [
      { id: 'pessoas', label: 'Pessoas', icon: 'users' },
      { id: 'mensagens', label: 'Mensagens', icon: 'message-square', badge: 3, unreadBadge: true },
      { id: 'relatorios', label: 'Relatórios', icon: 'chart-column' },
    ] },
    { group: 'Conta', items: [
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
      { id: 'ajuda', label: 'Ajuda', icon: 'circle-help' },
    ] },
  ];

  /** Destinos da bottom navigation (4). O quarto abre a folha "Mais" com o restante. */
  D.bottomTabs = ['painel', 'projetos', 'tarefas'];

  D.navFlat = () => D.nav.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
  D.navById = (id) => D.navFlat().find((i) => i.id === id);

  // ---------------- Projetos ----------------
  const projNames = [
    ['site-institucional', 'Site institucional', 'Novo site da marca com páginas de roteiros, blog e contato.', 'Em andamento', 72, '31/10/2026'],
    ['app-reservas', 'App de reservas', 'Aplicativo para reservar pacotes e acompanhar viagens.', 'Em andamento', 48, '30/10/2026'],
    ['portal-cliente', 'Portal do cliente', 'Área logada com documentos, vouchers e histórico de pedidos.', 'Em revisão', 90, '29/10/2026'],
    ['campanha-verao', 'Campanha de verão', 'Peças, e-mails e páginas de destino para a temporada.', 'Em andamento', 35, '28/10/2026'],
    ['programa-fidelidade', 'Programa de fidelidade', 'Pontos, níveis e benefícios para clientes recorrentes.', 'Planejado', 10, '27/10/2026'],
    ['migracao-dados', 'Migração de dados', 'Importação do legado de clientes e pedidos para a nova base.', 'Em andamento', 64, '27/10/2026'],
    ['catalogo-roteiros', 'Catálogo de roteiros', 'Cadastro único de roteiros com preços e disponibilidade.', 'Concluído', 100, '24/10/2026'],
    ['blog-corporativo', 'Blog corporativo', 'Editorial mensal com guias de destino e dicas de viagem.', 'Em andamento', 55, '23/10/2026'],
    ['pagamentos', 'Integração de pagamentos', 'Pix, cartão e parcelamento no checkout.', 'Em revisão', 82, '22/10/2026'],
    ['painel-financeiro', 'Painel financeiro', 'Conciliação diária e relatórios de receita.', 'Planejado', 5, '20/10/2026'],
    ['central-ajuda', 'Central de ajuda', 'Perguntas frequentes e canal de atendimento.', 'Concluído', 100, '18/10/2026'],
    ['pesquisa-satisfacao', 'Pesquisa de satisfação', 'NPS automático após cada viagem concluída.', 'Em andamento', 41, '15/10/2026'],
  ];
  D.projects = projNames.map(([id, name, text, status, progress, updated], i) => ({
    id, name, text, status, progress, updated,
    owner: ['Marina Alves', 'Caio Ribeiro', 'Letícia Prado', 'Bruno Tavares'][i % 4],
    pages: [
      { id: 'pagina-inicial', name: 'Página inicial', status: 'Publicada', updated: '31/10/2026' },
      { id: 'roteiros', name: 'Roteiros', status: 'Em revisão', updated: '29/10/2026' },
      { id: 'contato', name: 'Contato', status: 'Rascunho', updated: '26/10/2026' },
    ],
  }));
  D.projectById = (id) => D.projects.find((p) => p.id === id);

  // ---------------- Cards (Início) ----------------
  D.cards = [
    { id: 'lisboa', icon: 'plane', label: 'Novo', title: 'Viagem a Lisboa', text: '7 dias com roteiro guiado, hospedagem e passeios inclusos.', meta: '7 dias', action: 'Ver detalhes', detail: 'Saídas de São Paulo e Rio de Janeiro. Inclui hotel 4 estrelas no centro histórico, traslados, visita guiada a Alfama e Belém e um dia livre para passeio a Sintra.' },
    { id: 'gramado', icon: 'mountain', label: 'Popular', title: 'Serra Gaúcha', text: '4 dias entre Gramado e Canela com café colonial e trem turístico.', meta: '4 dias', action: 'Ver detalhes', detail: 'Hospedagem com café da manhã, passeio de trem turístico, Vale dos Vinhedos e tempo livre para compras em Gramado.' },
    { id: 'salvador', icon: 'sun', label: 'Verão', title: 'Fim de semana em Salvador', text: 'Pelourinho, Praia do Forte e uma tarde de barco na Baía de Todos os Santos.', meta: '3 dias', action: 'Ver detalhes', detail: 'Voo direto, pousada no Rio Vermelho, passeio de barco e jantar com música ao vivo no Pelourinho.' },
    { id: 'porto', icon: 'map-pin', label: 'Novo', title: 'Porto e Vale do Douro', text: 'Cruzeiro pelo Douro, degustação em quintas e hospedagem na Ribeira.', meta: '6 dias', action: 'Ver detalhes', detail: 'Cruzeiro de um dia, duas degustações em quintas, visita às caves de Vila Nova de Gaia e traslados privativos.' },
    { id: 'patagonia', icon: 'compass', label: 'Aventura', title: 'Patagônia chilena', text: 'Torres del Paine com guias locais, refúgios e trilhas para todos os níveis.', meta: '8 dias', action: 'Ver detalhes', detail: 'Trilha W em grupo reduzido, refúgios com pensão completa, equipamentos de apoio e seguro viagem incluso.' },
    { id: 'fernando', icon: 'ship', label: 'Mar', title: 'Fernando de Noronha', text: 'Pousada com vista para o mar, mergulho de batismo e passeio de barco.', meta: '5 dias', action: 'Ver detalhes', detail: 'Taxa de preservação inclusa, buggy para toda a estadia, mergulho de batismo e passeio ao pôr do sol no Mirante do Boldró.' },
  ];

  // ---------------- Pedidos (tabela spec) ----------------
  D.orders = [
    { id: 'p1', cliente: 'Helena Duarte', status: { label: 'Pago', tone: 'success' }, valor: 4820, data: '2026-10-31' },
    { id: 'p2', cliente: 'Construtora Almeida', status: { label: 'Pendente', tone: 'warning' }, valor: 12350, data: '2026-10-30' },
    { id: 'p3', cliente: 'Rafael Moura', status: { label: 'Cancelado', tone: 'error' }, valor: 1290.5, data: '2026-10-29' },
    { id: 'p4', cliente: 'Studio Lume', status: { label: 'Em análise', tone: 'info' }, valor: 7640, data: '2026-10-28' },
  ];

  D.tasks = [
    { id: 't1', tarefa: 'Revisar textos da página inicial', status: { label: 'Em andamento', tone: 'info' }, prazo: '2026-11-04', horas: 6 },
    { id: 't2', tarefa: 'Enviar proposta ao cliente Almeida', status: { label: 'Atrasada', tone: 'error' }, prazo: '2026-10-30', horas: 3 },
    { id: 't3', tarefa: 'Conciliar pagamentos de outubro', status: { label: 'A fazer', tone: 'neutral' }, prazo: '2026-11-06', horas: 8 },
    { id: 't4', tarefa: 'Publicar roteiro "Porto e Vale do Douro"', status: { label: 'Em andamento', tone: 'info' }, prazo: '2026-11-05', horas: 5 },
    { id: 't5', tarefa: 'Atualizar tabela de preços da Serra Gaúcha', status: { label: 'Concluída', tone: 'success' }, prazo: '2026-10-28', horas: 4 },
    { id: 't6', tarefa: 'Configurar e-mail de pós-venda', status: { label: 'A fazer', tone: 'neutral' }, prazo: '2026-11-10', horas: 2 },
    { id: 't7', tarefa: 'Testar fluxo de pagamento por Pix', status: { label: 'Concluída', tone: 'success' }, prazo: '2026-10-27', horas: 7 },
  ];

  D.people = [
    { id: 'u1', nome: 'Marina Alves', status: { label: 'Ativa', tone: 'success' }, funcao: 'Gerente de produto', projetos: 5 },
    { id: 'u2', nome: 'Caio Ribeiro', status: { label: 'Ativo', tone: 'success' }, funcao: 'Desenvolvedor front-end', projetos: 4 },
    { id: 'u3', nome: 'Letícia Prado', status: { label: 'Em férias', tone: 'warning' }, funcao: 'Designer', projetos: 3 },
    { id: 'u4', nome: 'Bruno Tavares', status: { label: 'Ativo', tone: 'success' }, funcao: 'Analista financeiro', projetos: 2 },
    { id: 'u5', nome: 'Aline Furtado', status: { label: 'Ativa', tone: 'success' }, funcao: 'Atendimento', projetos: 3 },
    { id: 'u6', nome: 'Diego Sampaio', status: { label: 'Convidado', tone: 'info' }, funcao: 'Consultor externo', projetos: 1 },
  ];

  D.messages = [
    { id: 'm1', from: 'Letícia Prado', subject: 'Versão final do layout da home', time: '09:42', unread: true },
    { id: 'm2', from: 'Caio Ribeiro', subject: 'Revisão do checkout concluída', time: '08:15', unread: true },
    { id: 'm3', from: 'Aline Furtado', subject: 'Cliente Almeida pediu nova data de saída', time: 'Ontem', unread: true },
    { id: 'm4', from: 'Bruno Tavares', subject: 'Fechamento financeiro de outubro', time: 'Ontem', unread: false },
    { id: 'm5', from: 'Diego Sampaio', subject: 'Contrato de consultoria assinado', time: 'Seg', unread: false },
    { id: 'm6', from: 'Equipe Atlas', subject: 'Novidades da versão de novembro', time: 'Seg', unread: false },
  ];

  D.notifications = [
    { id: 'n1', text: 'Letícia Prado comentou em "Página inicial"', time: 'há 12 min', unread: true },
    { id: 'n2', text: 'O pedido de Helena Duarte foi pago', time: 'há 1 h', unread: true },
    { id: 'n3', text: 'Tarefa "Enviar proposta ao cliente Almeida" está atrasada', time: 'há 3 h', unread: true },
    { id: 'n4', text: 'Caio Ribeiro concluiu a revisão do checkout', time: 'ontem', unread: true },
    { id: 'n5', text: 'Novo membro convidado: Diego Sampaio', time: 'ontem', unread: false },
  ];

  D.events = [
    { date: '2026-11-02', items: [{ time: '10:00', title: 'Reunião semanal de produto', where: 'Sala Mapa' }, { time: '15:30', title: 'Revisão do layout da home', where: 'Videochamada' }] },
    { date: '2026-11-03', items: [{ time: '09:00', title: 'Alinhamento com atendimento', where: 'Videochamada' }] },
    { date: '2026-11-05', items: [{ time: '11:00', title: 'Publicação do roteiro Porto e Douro', where: 'Online' }, { time: '16:00', title: 'Planejamento da campanha de verão', where: 'Sala Bússola' }] },
    { date: '2026-11-09', items: [{ time: '14:00', title: 'Fechamento financeiro do mês', where: 'Sala Mapa' }] },
    { date: '2026-11-12', items: [{ time: '10:30', title: 'Demonstração do app de reservas', where: 'Auditório' }] },
  ];

  D.faq = [
    ['Como convido uma pessoa para o workspace?', 'Em Pessoas, escolha "Convidar" e informe o e-mail. O convite expira em 7 dias.'],
    ['Posso exportar os pedidos?', 'Sim. Na tabela de pedidos, use "Exportar CSV" para baixar as linhas exibidas.'],
    ['Como altero o período do painel?', 'No Painel, use o filtro de período no topo. Todos os blocos são atualizados.'],
    ['Esqueci minha senha. E agora?', 'Na tela de entrada, escolha "Esqueci minha senha" e siga o link enviado ao seu e-mail.'],
  ];

  // ---------------- Dashboard por período ----------------
  D.periods = [
    { id: '30d', label: '30 dias' },
    { id: '90d', label: '90 dias' },
    { id: '12m', label: '12 meses' },
  ];

  D.dash = {
    '30d': {
      compare: 'vs. mês anterior',
      kpis: [
        { id: 'receita', label: 'Receita mensal', icon: 'wallet', value: 'R$ 48,2 mil', delta: 12.4, series: [31.2, 33.0, 32.1, 35.4, 37.8, 36.9, 40.2, 41.5, 43.1, 44.0, 46.3, 48.2], unit: 'R$ {v} mil', labels: 'mês' },
        { id: 'clientes', label: 'Novos clientes', icon: 'users', value: '1.284', delta: -2.1, series: [132, 128, 140, 135, 138, 129, 124, 131, 126, 122, 127, 123], unit: '{v} clientes', labels: 'mês' },
        { id: 'ticket', label: 'Ticket médio', icon: 'chart-column', value: 'R$ 312', delta: 0, series: [310, 312, 311, 313, 312, 311, 312, 313, 312, 312, 311, 312], unit: 'R$ {v}', labels: 'mês' },
      ],
      chart: { title: 'Receita por período', unit: 'R$ mil', labels: ['03/10', '06/10', '09/10', '12/10', '15/10', '18/10', '21/10', '24/10', '27/10', '30/10'], values: [3.1, 4.2, 3.8, 5.6, 4.9, 6.3, 5.8, 7.1, 6.4, 8.2] },
      activities: [
        ['Letícia Prado comentou na página inicial', 'há 12 min', true],
        ['Pedido de Helena Duarte foi pago', 'há 1 h', true],
        ['Caio Ribeiro concluiu a revisão do checkout', 'há 3 h', false],
        ['Nova proposta enviada a Studio Lume', 'ontem', false],
        ['Roteiro "Porto e Vale do Douro" publicado', 'ontem', false],
      ],
    },
    '90d': {
      compare: 'vs. trimestre anterior',
      kpis: [
        { id: 'receita', label: 'Receita mensal', icon: 'wallet', value: 'R$ 44,7 mil', delta: 6.8, series: [36.4, 37.0, 38.5, 39.1, 40.2, 41.0, 41.9, 42.6, 43.0, 43.8, 44.2, 44.7], unit: 'R$ {v} mil', labels: 'semana' },
        { id: 'clientes', label: 'Novos clientes', icon: 'users', value: '3.702', delta: 4.3, series: [118, 121, 119, 125, 128, 131, 130, 133, 137, 140, 142, 146], unit: '{v} clientes', labels: 'semana' },
        { id: 'ticket', label: 'Ticket médio', icon: 'chart-column', value: 'R$ 298', delta: -1.2, series: [305, 303, 304, 301, 302, 300, 299, 300, 298, 299, 297, 298], unit: 'R$ {v}', labels: 'semana' },
      ],
      chart: { title: 'Receita por período', unit: 'R$ mil', labels: ['04/08', '11/08', '18/08', '25/08', '01/09', '08/09', '15/09', '22/09', '29/09', '06/10', '13/10', '20/10'], values: [9.1, 10.4, 9.8, 11.2, 12.0, 11.5, 12.9, 13.4, 12.7, 14.1, 13.8, 15.2] },
      activities: [
        ['Programa de fidelidade entrou em planejamento', 'há 2 dias', true],
        ['Contrato com Diego Sampaio assinado', 'há 5 dias', false],
        ['Catálogo de roteiros concluído', 'há 9 dias', false],
        ['Central de ajuda publicada', 'há 2 semanas', false],
        ['Campanha de outono encerrada', 'há 3 semanas', false],
      ],
    },
    '12m': {
      compare: 'vs. ano anterior',
      kpis: [
        { id: 'receita', label: 'Receita mensal', icon: 'wallet', value: 'R$ 39,1 mil', delta: 18.3, series: [22.0, 24.1, 25.3, 27.9, 29.4, 31.0, 33.2, 34.8, 36.5, 37.9, 38.4, 39.1], unit: 'R$ {v} mil', labels: 'mês' },
        { id: 'clientes', label: 'Novos clientes', icon: 'users', value: '14.906', delta: 9.7, series: [980, 1020, 1090, 1130, 1160, 1210, 1230, 1260, 1240, 1270, 1290, 1284], unit: '{v} clientes', labels: 'mês' },
        { id: 'ticket', label: 'Ticket médio', icon: 'chart-column', value: 'R$ 287', delta: 0, series: [281, 283, 284, 286, 285, 287, 288, 286, 287, 288, 287, 287], unit: 'R$ {v}', labels: 'mês' },
      ],
      chart: { title: 'Receita por período', unit: 'R$ mil', labels: ['dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov'], values: [22.0, 24.1, 25.3, 27.9, 29.4, 31.0, 33.2, 34.8, 36.5, 41.9, 44.2, 48.2] },
      activities: [
        ['Novo site institucional entrou em desenvolvimento', 'há 3 meses', true],
        ['Equipe cresceu de 4 para 6 pessoas', 'há 5 meses', false],
        ['Migração de dados iniciada', 'há 6 meses', false],
        ['Integração de pagamentos aprovada', 'há 8 meses', false],
        ['Atlas Workspace implantado', 'há 11 meses', false],
      ],
    },
  };
})();
