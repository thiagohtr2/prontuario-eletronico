/* Dados fictícios da demonstração Nexo Capital. Sem backend: tudo fica no front-end. */
(function (ns) {
  'use strict';

  // "Hoje" fixo da demonstração (02/11/2026), usado para filtrar por período.
  ns.TODAY = Date.UTC(2026, 10, 2);

  // Credenciais da demonstração (login e SSO simulados).
  ns.DEMO = { email: 'demo@nexo.example', password: 'Demo@2026' };

  ns.USER = {
    name: 'Camila Ribeiro',
    role: 'Gerente de Controladoria',
    email: 'camila.ribeiro@nexo.example',
    initials: 'CR'
  };

  ns.UNITS = ['Matriz · São Paulo', 'Filial · Rio de Janeiro', 'Filial · Belo Horizonte'];

  ns.PERIODS = [
    { value: '7', label: 'Últimos 7 dias', factor: 0.25 },
    { value: '30', label: 'Últimos 30 dias', factor: 1 },
    { value: '90', label: 'Últimos 90 dias', factor: 2.8 }
  ];

  // Destinos de navegação (sidebar desktop e drawer mobile).
  ns.NAV = [
    {
      group: 'Gestão',
      items: [
        { id: 'painel', label: 'Painel', icon: 'dashboard', href: '#/app/painel/visao-geral' },
        { id: 'contratos', label: 'Contratos', icon: 'file', href: '#/app/contratos' },
        { id: 'fornecedores', label: 'Fornecedores', icon: 'truck', href: '#/app/fornecedores' },
        { id: 'compras', label: 'Compras', icon: 'cart', href: '#/app/compras' }
      ]
    },
    {
      group: 'Pessoas',
      items: [
        { id: 'colaboradores', label: 'Colaboradores', icon: 'users', href: '#/app/colaboradores' },
        { id: 'folha', label: 'Folha', icon: 'wallet', href: '#/app/folha' }
      ]
    },
    {
      group: 'Administração',
      items: [
        { id: 'auditoria', label: 'Auditoria', icon: 'shield', href: '#/app/auditoria' },
        { id: 'permissoes', label: 'Permissões', icon: 'key', href: '#/app/permissoes' }
      ]
    }
  ];

  // Abas do Painel Analítico (header desktop; no mobile ficam no drawer).
  ns.SECTIONS = [
    { id: 'visao-geral', label: 'Visão geral' },
    { id: 'aquisicao', label: 'Aquisição' },
    { id: 'retencao', label: 'Retenção' },
    { id: 'receita', label: 'Receita' }
  ];

  ns.STATUS_TONE = {
    'Aprovado': 'success',
    'Ativo': 'success',
    'Pendente': 'warning',
    'Em análise': 'info',
    'Recusado': 'error',
    'Vencido': 'error',
    'Rascunho': 'neutral'
  };

  // Linhas usadas pela tabela "Pedidos recentes" (compartilhadas entre as abas).
  ns.ORDERS = [
    { cliente: 'Construtora Alvorada Ltda', status: 'Aprovado', valor: 84250, data: '2026-10-31' },
    { cliente: 'Grupo Meridiano S.A.', status: 'Em análise', valor: 126900, data: '2026-10-30' },
    { cliente: 'Farmácias Vitália', status: 'Pendente', valor: 23480, data: '2026-10-27' },
    { cliente: 'Transportes Aurora', status: 'Aprovado', valor: 57600, data: '2026-10-21' },
    { cliente: 'Clínica Santa Helena', status: 'Recusado', valor: 18300, data: '2026-09-14' },
    { cliente: 'Indústrias Boreal', status: 'Aprovado', valor: 402750, data: '2026-08-06' }
  ];

  ns.ACTIVITIES = [
    { texto: 'Contrato #2841 assinado', detalhe: 'Atlas Logística', data: '2026-11-02' },
    { texto: 'Pagamento recebido', detalhe: 'Grupo Meridiano S.A. · R$ 126.900,00', data: '2026-10-31' },
    { texto: 'Fatura vencida', detalhe: 'Farmácias Vitália', data: '2026-10-28' },
    { texto: 'Novo fornecedor cadastrado', detalhe: 'Papelaria Central', data: '2026-10-24' },
    { texto: 'Reajuste aprovado', detalhe: 'Contrato de locação · Bloco B', data: '2026-10-12' },
    { texto: 'Auditoria concluída', detalhe: 'Controles de pagamento', data: '2026-09-29' }
  ];

  var months = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];

  // Painéis analíticos. Valores de moeda em reais; gráficos em milhares.
  ns.DASHBOARDS = {
    'visao-geral': {
      title: 'Visão geral',
      kpis: [
        { label: 'Receita líquida', value: 4820000, fmt: 'brl', scale: true, delta: 6.4 },
        { label: 'Clientes ativos', value: 12480, fmt: 'int', scale: false, delta: 2.1 },
        { label: 'Ticket médio', value: 386.2, fmt: 'brl', scale: false, delta: -1.3 }
      ],
      chart: {
        title: 'Vendas por mês',
        labels: months,
        unit: 'mil',
        series: [
          { name: '2026', values: [412, 438, 396, 471, 503, 528] },
          { name: '2025', values: [360, 381, 372, 402, 418, 430] }
        ]
      },
      tableTitle: 'Pedidos recentes'
    },
    aquisicao: {
      title: 'Aquisição',
      kpis: [
        { label: 'Novos clientes', value: 1236, fmt: 'int', scale: true, delta: 8.9 },
        { label: 'Custo por aquisição', value: 142.5, fmt: 'brl', scale: false, delta: -4.2 },
        { label: 'Taxa de conversão', value: 3.8, fmt: 'pct', scale: false, delta: 0.6 }
      ],
      chart: {
        title: 'Novos clientes por mês',
        labels: months,
        unit: '',
        series: [
          { name: 'Orgânico', values: [188, 205, 214, 231, 248, 262] },
          { name: 'Pago', values: [121, 134, 127, 149, 160, 171] }
        ]
      },
      tableTitle: 'Leads recentes'
    },
    retencao: {
      title: 'Retenção',
      kpis: [
        { label: 'Taxa de retenção', value: 91.4, fmt: 'pct', scale: false, delta: 0.8 },
        { label: 'Churn mensal', value: 2.1, fmt: 'pct', scale: false, delta: -0.3 },
        { label: 'Clientes recorrentes', value: 8902, fmt: 'int', scale: false, delta: 1.7 }
      ],
      chart: {
        title: 'Clientes retidos por mês',
        labels: months,
        unit: 'mil',
        series: [
          { name: 'Retidos', values: [8.1, 8.3, 8.4, 8.6, 8.8, 8.9] },
          { name: 'Cancelados', values: [0.31, 0.29, 0.34, 0.27, 0.25, 0.22] }
        ]
      },
      tableTitle: 'Cancelamentos recentes'
    },
    receita: {
      title: 'Receita',
      kpis: [
        { label: 'MRR', value: 1120000, fmt: 'brl', scale: true, delta: 3.2 },
        { label: 'Inadimplência', value: 1.6, fmt: 'pct', scale: false, delta: -0.2 },
        { label: 'Receita por cliente', value: 89.7, fmt: 'brl', scale: false, delta: 0.9 }
      ],
      chart: {
        title: 'Receita e despesa por mês',
        labels: months,
        unit: 'mil',
        series: [
          { name: 'Receita', values: [1040, 1062, 1048, 1091, 1103, 1120] },
          { name: 'Despesa', values: [702, 715, 698, 731, 740, 752] }
        ]
      },
      tableTitle: 'Lançamentos recentes'
    }
  };

  function std(first, last, valueLabel, valueType) {
    return [
      { key: 'nome', label: first },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'valor', label: valueLabel || 'Valor', type: valueType || 'money', align: 'right' },
      { key: 'data', label: last, type: 'date' }
    ];
  }

  // Páginas de lista. failFirst simula erro na primeira carga; rows vazio mostra estado vazio.
  ns.PAGES = {
    contratos: {
      title: 'Contratos',
      tableTitle: 'Contratos vigentes',
      columns: std('Contrato', 'Vencimento'),
      rows: [
        { nome: 'CT-2841 · Atlas Logística', status: 'Ativo', valor: 960000, data: '2027-03-31' },
        { nome: 'CT-2790 · Locação Bloco B', status: 'Ativo', valor: 288000, data: '2027-01-15' },
        { nome: 'CT-2755 · Seguros Vértice', status: 'Vencido', valor: 74500, data: '2026-10-20' },
        { nome: 'CT-2802 · Limpeza Predial', status: 'Pendente', valor: 132000, data: '2026-12-01' }
      ]
    },
    fornecedores: {
      title: 'Fornecedores',
      tableTitle: 'Fornecedores cadastrados',
      columns: std('Fornecedor', 'Último pedido'),
      rows: [],
      emptyMessage: 'Nenhum fornecedor cadastrado ainda.'
    },
    compras: {
      title: 'Compras',
      tableTitle: 'Pedidos de compra',
      columns: std('Pedido', 'Data'),
      rows: [
        { nome: 'PC-5520 · Papelaria Central', status: 'Aprovado', valor: 4380, data: '2026-10-29' },
        { nome: 'PC-5518 · Equipamentos TI', status: 'Em análise', valor: 39900, data: '2026-10-26' },
        { nome: 'PC-5511 · Manutenção Predial', status: 'Rascunho', valor: 9750, data: '2026-10-18' },
        { nome: 'PC-5504 · Frota Corporativa', status: 'Recusado', valor: 61200, data: '2026-10-02' }
      ]
    },
    colaboradores: {
      title: 'Colaboradores',
      tableTitle: 'Colaboradores ativos',
      columns: std('Colaborador', 'Admissão', 'Salário'),
      rows: [
        { nome: 'Lucas Andrade · Analista', status: 'Ativo', valor: 6850, data: '2023-02-13' },
        { nome: 'Beatriz Moura · Contadora', status: 'Ativo', valor: 11200, data: '2019-08-05' },
        { nome: 'Rafael Tavares · Tesouraria', status: 'Pendente', valor: 8400, data: '2026-10-19' }
      ]
    },
    folha: {
      title: 'Folha',
      tableTitle: 'Fechamentos de folha',
      columns: std('Competência', 'Pagamento', 'Total'),
      rows: [
        { nome: 'Outubro/2026', status: 'Pendente', valor: 1842300, data: '2026-11-05' },
        { nome: 'Setembro/2026', status: 'Aprovado', valor: 1816950, data: '2026-10-05' },
        { nome: 'Agosto/2026', status: 'Aprovado', valor: 1809400, data: '2026-09-05' }
      ]
    },
    auditoria: {
      title: 'Auditoria',
      tableTitle: 'Eventos de auditoria',
      columns: std('Evento', 'Data', 'Ocorrências', 'int'),
      failFirst: true,
      rows: [
        { nome: 'Alteração de permissão', status: 'Aprovado', valor: 3, data: '2026-11-01' },
        { nome: 'Exportação de relatório', status: 'Em análise', valor: 12, data: '2026-10-29' },
        { nome: 'Login fora do horário', status: 'Pendente', valor: 2, data: '2026-10-22' },
        { nome: 'Pagamento manual', status: 'Aprovado', valor: 1, data: '2026-10-14' }
      ]
    },
    permissoes: {
      title: 'Permissões',
      tableTitle: 'Perfis de acesso',
      columns: std('Perfil', 'Atualizado', 'Usuários', 'int'),
      rows: [
        { nome: 'Controladoria · leitura e escrita', status: 'Ativo', valor: 14, data: '2026-10-30' },
        { nome: 'Financeiro · aprovação', status: 'Ativo', valor: 9, data: '2026-10-12' },
        { nome: 'Auditoria externa · somente leitura', status: 'Vencido', valor: 3, data: '2026-06-30' }
      ]
    }
  };
})(window.NEXO = window.NEXO || {});
