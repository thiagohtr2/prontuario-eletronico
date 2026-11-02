/* Dados fictícios da demonstração (sem backend). Horários são relativos ao
   momento em que a página abre, para a tela parecer "ao vivo". */
(function () {
  'use strict';
  var CO = (window.CO = window.CO || {});
  var MIN = 60000;

  /* Indicadores: 12 pontos por série; o último é o valor atual e o penúltimo
     é a base do comparativo. Variação = (atual − anterior) / anterior. */
  var kpis = [
    {
      id: 'receita',
      label: 'Receita mensal', // propriedades aprovadas no Studio
      icon: 'wallet',
      format: 'brlMil',
      period: 'month',
      periodLabel: 'últimos 12 meses',
      comparativo: 'vs. mês anterior',
      values: [31.2, 33.0, 32.4, 35.8, 36.1, 38.9, 37.5, 40.2, 41.0, 39.6, 42.9, 48.2] // +12,4%
    },
    {
      id: 'pedidos',
      label: 'Pedidos hoje',
      icon: 'package',
      format: 'int',
      period: 'day',
      periodLabel: 'últimos 12 dias',
      comparativo: 'vs. ontem',
      values: [1020, 1105, 980, 1150, 1210, 1090, 1175, 1230, 1160, 1205, 1188, 1284] // +8,1%
    },
    {
      id: 'entregas',
      label: 'Entregas no prazo',
      icon: 'truck',
      format: 'pct',
      period: 'week',
      periodLabel: 'últimas 12 semanas',
      comparativo: 'vs. semana anterior',
      values: [93.1, 94.0, 92.5, 93.8, 94.6, 95.0, 94.2, 93.7, 94.9, 95.3, 93.8, 91.3] // −2,7%
    },
    {
      id: 'ticket',
      label: 'Ticket médio',
      icon: 'receipt',
      format: 'brl',
      period: 'month',
      periodLabel: 'últimos 12 meses',
      comparativo: 'vs. mês anterior',
      values: [35.1, 35.8, 36.2, 36.0, 36.9, 37.1, 36.8, 37.3, 37.6, 37.2, 37.54, 37.54] // 0,0%
    }
  ];

  /* Blocos de status: filas, SLA e equipes (4 áreas cada) */
  function status() {
    return {
      filas: [
        { name: 'Atendimento', waiting: 12, maxWait: 4 },
        { name: 'Expedição', waiting: 38, maxWait: 18 },
        { name: 'Suporte técnico', waiting: 64, maxWait: 41 },
        { name: 'Financeiro', waiting: 5, maxWait: 2 }
      ],
      sla: [
        { name: 'Atendimento', value: 97.2, target: 95 },
        { name: 'Expedição', value: 89.4, target: 92 },
        { name: 'Suporte técnico', value: 78.5, target: 90 },
        { name: 'Financeiro', value: 99.1, target: 98 }
      ],
      equipes: [
        { name: 'Atendimento', online: 18, total: 20 },
        { name: 'Expedição', online: 11, total: 14 },
        { name: 'Suporte técnico', online: 6, total: 12 },
        { name: 'Financeiro', online: 4, total: 4 }
      ]
    };
  }

  /* Pedidos recentes: 4 linhas de exemplo (propriedade aprovada) */
  function orders() {
    var now = Date.now();
    return [
      { id: '4825', cliente: 'Mercado Aurora', status: 'separacao', valor: 1240.9, data: new Date(now - 18 * MIN), itens: 14, canal: 'Aplicativo' },
      { id: '4824', cliente: 'Farmácia Bom Pastor', status: 'pendente', valor: 386.0, data: new Date(now - 32 * MIN), itens: 6, canal: 'Site' },
      { id: '4823', cliente: 'Padaria Trigo Fino', status: 'concluido', valor: 92.5, data: new Date(now - 49 * MIN), itens: 3, canal: 'Telefone' },
      { id: '4821', cliente: 'Loja Vértice', status: 'atrasado', valor: 2115.3, data: new Date(now - 160 * MIN), itens: 22, canal: 'Site' }
    ];
  }

  var seq = 0;
  function alertId() {
    seq += 1;
    return 'a' + seq;
  }

  /* Alertas iniciais (lista cronológica, mais recente primeiro) */
  function seedAlerts() {
    var now = Date.now();
    var list = [
      [2, 'critical', 'Fila Suporte técnico acima do limite', '64 aguardando · espera máx. 41 min', 'Filas'],
      [6, 'warning', 'SLA de Expedição abaixo da meta', '89,4% no turno · meta 92%', 'SLA'],
      [11, 'critical', 'Equipe de Suporte técnico desfalcada', '6 de 12 agentes online', 'Equipes'],
      [15, 'info', 'Troca de turno às 19:00', 'Equipe da noite: 14 agentes escalados', 'Equipes'],
      [23, 'critical', 'Pedido de Loja Vértice atrasado', '#4821 · previsão de entrega excedida em 2 h', 'Pedidos'],
      [31, 'warning', 'Pico de pedidos acima do previsto', '+18% em relação à média do horário', 'Pedidos'],
      [44, 'success', 'Integração de pagamentos restabelecida', 'Instabilidade durou 7 min', 'Sistemas'],
      [52, 'warning', 'Fila de Expedição em atenção', '38 aguardando · espera máx. 18 min', 'Filas'],
      [65, 'info', 'Relatório do turno da manhã disponível', 'Enviado para a supervisão', 'Relatórios'],
      [80, 'success', 'SLA de Atendimento recuperado', '97,2% no turno · meta 95%', 'SLA']
    ];
    return list.map(function (a) {
      return { id: alertId(), time: new Date(now - a[0] * MIN), sev: a[1], title: a[2], detail: a[3], source: a[4] };
    });
  }

  /* Modelos de alertas gerados em tempo real (não contradizem os blocos de status) */
  var alertPool = [
    { sev: 'critical', title: 'Pedido de {cliente} atrasado', detail: '#{num} · previsão de entrega excedida em {n} min', source: 'Pedidos' },
    { sev: 'warning', title: 'Pico de pedidos acima do previsto', detail: '+{p}% em relação à média do horário', source: 'Pedidos' },
    { sev: 'info', title: 'Rota de entrega replanejada', detail: 'Região {regiao} · {n} entregas afetadas', source: 'Logística' },
    { sev: 'warning', title: 'Estoque baixo de embalagens', detail: 'Tamanho {tam} · {n} unidades restantes', source: 'Estoque' },
    { sev: 'success', title: 'Pedido de {cliente} entregue', detail: '#{num} · dentro do prazo', source: 'Pedidos' },
    { sev: 'critical', title: 'Instabilidade na integração de pagamentos', detail: '{p}% das transações com falha nos últimos 5 min', source: 'Sistemas' },
    { sev: 'info', title: 'Relatório horário disponível', detail: 'Consolidado das {hh}h', source: 'Relatórios' }
  ];
  var fill = {
    cliente: ['Empório Central', 'Atacado Horizonte', 'Drogaria Vida', 'Mercadinho Sol', 'Café Ponto Doce', 'Hortifruti Verde'],
    regiao: ['Norte', 'Sul', 'Centro', 'Leste', 'Oeste'],
    tam: ['P', 'M', 'G']
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomAlert() {
    var t = pick(alertPool);
    var vars = {
      cliente: pick(fill.cliente),
      regiao: pick(fill.regiao),
      tam: pick(fill.tam),
      num: String(4826 + Math.floor(Math.random() * 60)),
      n: String(5 + Math.floor(Math.random() * 40)),
      p: String(4 + Math.floor(Math.random() * 20)),
      hh: String(new Date().getHours()).padStart(2, '0')
    };
    function sub(s) {
      return s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; });
    }
    return { id: alertId(), time: new Date(), sev: t.sev, title: sub(t.title), detail: sub(t.detail), source: t.source };
  }

  CO.data = {
    kpis: kpis,
    status: status,
    orders: orders,
    seedAlerts: seedAlerts,
    randomAlert: randomAlert,
    alertId: alertId
  };
})();
