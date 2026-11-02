/* ==========================================================================
   Dados fictícios e utilitários de formatação (sem backend).
   Tudo fica em window.CO — scripts clássicos, funcionam em file://.
   ========================================================================== */
(function () {
  'use strict';
  const CO = (window.CO = window.CO || {});

  /* ---------- Formatação pt-BR ---------- */
  const nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const pad = (n) => String(n).padStart(2, '0');

  CO.fmt = {
    int: (n) => nf0.format(n),
    dec1: (n) => nf1.format(n),
    brl: (n) => brl.format(n),
    brlCompact: (n) => (n >= 1000 ? 'R$ ' + nf1.format(n / 1000) + ' mil' : brl.format(n)),
    pct: (n) => nf1.format(n) + '%',
    delta: (n) => (Math.abs(n) < 0.05 ? '0,0%' : (n > 0 ? '+' : '−') + nf1.format(Math.abs(n)) + '%'),
    mmss: (s) => pad(Math.floor(s / 60)) + ':' + pad(Math.round(s % 60)),
    minSec: (s) => Math.floor(s / 60) + ' min ' + pad(Math.round(s % 60)) + ' s',
    time: (d) => pad(d.getHours()) + ':' + pad(d.getMinutes()),
    timeS: (d) => pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()),
    date: (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(),
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  };

  const rnd = (a, b) => a + Math.random() * (b - a);
  const rint = (a, b) => Math.round(rnd(a, b));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  CO.math = { rnd, rint, clamp };

  /* ---------- Indicadores (componente "Indicadores") ---------- */
  const now = new Date();
  const back = (i, step) => new Date(now.getTime() - i * step);
  const liveLabels = (n) => Array.from({ length: n }, (_, i) => CO.fmt.timeS(back(n - 1 - i, 5000)));

  CO.kpis = [
    {
      id: 'receita', label: 'Receita mensal', icon: 'wallet', kind: 'receita',
      value: 48.2, delta: 12.4, cmp: 'vs. mês anterior', live: false, good: 'up',
      series: [36.8, 39.4, 38.1, 41.2, 40.6, 42.3, 43.9, 41.8, 44.6, 45.2, 42.9, 48.2],
      labels: ['Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26', 'Jun/26', 'Jul/26', 'Ago/26', 'Set/26', 'Out/26', 'Nov/26'],
      axis: 'Mês',
    },
    {
      id: 'sla', label: 'SLA cumprido', icon: 'gauge', kind: 'pct',
      value: 96.8, base: 96.8 / (1 - 0.012), cmp: 'vs. semana anterior', live: true, good: 'up',
      series: [97.9, 97.6, 97.8, 97.2, 97.4, 97.1, 97.3, 96.9, 97.0, 96.7, 96.9, 96.8],
      labels: liveLabels(12), axis: 'Leitura',
    },
    {
      id: 'concluidos', label: 'Pedidos concluídos hoje', icon: 'package-check', kind: 'int',
      value: 312, base: 312 / 1.081, cmp: 'vs. ontem', live: true, good: 'up',
      series: [268, 273, 277, 281, 285, 289, 293, 297, 301, 305, 309, 312],
      labels: liveLabels(12), axis: 'Leitura',
    },
    {
      id: 'espera', label: 'Tempo médio de espera', icon: 'clock', kind: 'sec',
      value: 272, base: 272, cmp: 'vs. hora anterior', live: true, good: 'down',
      series: [268, 275, 271, 279, 274, 270, 276, 273, 269, 274, 271, 272],
      labels: liveLabels(12), axis: 'Leitura',
    },
  ];

  CO.kpiFormat = function (k, v) {
    switch (k.kind) {
      case 'receita': return 'R$ ' + CO.fmt.dec1(v) + ' mil';
      case 'pct': return CO.fmt.pct(v);
      case 'int': return CO.fmt.int(v);
      case 'sec': return CO.fmt.minSec(v);
      default: return String(v);
    }
  };
  CO.kpiDelta = function (k) {
    return k.base ? ((k.value - k.base) / k.base) * 100 : k.delta;
  };

  /* ---------- Blocos de status: filas, SLA, equipes ---------- */
  CO.queues = [
    { id: 'geral', name: 'Atendimento geral', waiting: 14, wait: 192, limit: 300 },
    { id: 'suporte', name: 'Suporte técnico', waiting: 23, wait: 276, limit: 300 },
    { id: 'financeiro', name: 'Financeiro', waiting: 6, wait: 85, limit: 240 },
    { id: 'logistica', name: 'Logística', waiting: 11, wait: 140, limit: 300 },
  ];
  CO.sla = [
    { name: 'Prioridade crítica', value: 95.6, meta: 95 },
    { name: 'Prioridade alta', value: 96.8, meta: 95 },
    { name: 'Prioridade normal', value: 98.4, meta: 90 },
  ];
  CO.teams = [
    { name: 'Equipe Norte', online: 8, total: 10 },
    { name: 'Equipe Sul', online: 6, total: 9 },
    { name: 'Equipe Leste', online: 3, total: 8 },
  ];

  /* Níveis de status: ícone + texto + cor semântica */
  CO.levels = {
    ok: { label: 'Normal', tone: 'success', icon: 'circle-check', rank: 0 },
    warn: { label: 'Atenção', tone: 'warning', icon: 'triangle-alert', rank: 1 },
    crit: { label: 'Crítico', tone: 'error', icon: 'octagon-alert', rank: 2 },
  };
  CO.levelQueue = (q) => { const r = q.wait / q.limit; return r >= 1 ? 'crit' : r >= 0.8 ? 'warn' : 'ok'; };
  CO.levelSla = (s) => (s.value >= s.meta ? 'ok' : s.value >= s.meta - 3 ? 'warn' : 'crit');
  CO.levelTeam = (t) => { const r = t.online / t.total; return r >= 0.7 ? 'ok' : r >= 0.5 ? 'warn' : 'crit'; };
  CO.worst = (levels) => levels.reduce((a, b) => (CO.levels[b].rank > CO.levels[a].rank ? b : a), 'ok');

  /* ---------- Alertas ---------- */
  CO.severities = {
    critical: { label: 'Crítico', icon: 'octagon-alert' },
    warning: { label: 'Atenção', icon: 'triangle-alert' },
    info: { label: 'Info', icon: 'info' },
  };
  let alertSeq = 0;
  const mk = (sev, title, desc, minAgo) => ({ id: ++alertSeq, sev, title, desc, at: new Date(now.getTime() - minAgo * 60000) });
  CO.alerts = [
    mk('critical', 'Equipe Leste abaixo do mínimo', '3 de 8 agentes online · mínimo 5', 1),
    mk('warning', 'Fila “Suporte técnico” próxima do limite', 'Espera 04:36 · limite 05:00', 3),
    mk('info', 'Integração de pedidos reconectada', 'Fila de sincronização zerada', 6),
    mk('warning', 'SLA da prioridade crítica na meta mínima', '95,6% · meta 95,0%', 9),
    mk('critical', 'Falha ao confirmar 2 pedidos', 'Códigos PD-1036 e PD-1037 · nova tentativa em 60 s', 14),
    mk('info', 'Troca de turno concluída', 'Equipe Sul assumiu a operação', 21),
    mk('warning', 'Pico de chamadas previsto', 'Estimativa de +30% entre 14h e 15h', 27),
    mk('info', 'Backup diário concluído', 'Duração 12 min · sem erros', 38),
    mk('critical', 'Transportadora Lima sem retorno', 'Pedido PD-1039 atrasado há 2 dias', 52),
    mk('info', 'Relatório semanal gerado', 'Disponível em Relatório', 63),
    mk('warning', 'Fila “Logística” com crescimento', '11 aguardando · tendência de alta', 77),
    mk('info', 'Atualização do painel aplicada', 'Versão 2.4.1', 95),
    mk('warning', 'Latência acima do normal na API de pagamentos', 'Média 820 ms · normal 300 ms', 118),
    mk('info', 'Novo agente adicionado à Equipe Norte', 'Total de 10 agentes', 140),
  ];

  /* Modelos para alertas gerados em tempo real */
  CO.nextAlert = function () {
    const q = CO.queues[rint(0, CO.queues.length - 1)];
    const t = CO.teams[rint(0, CO.teams.length - 1)];
    const s = CO.sla[rint(0, CO.sla.length - 1)];
    const pool = [
      ['critical', 'Fila “' + q.name + '” acima do limite', 'Espera ' + CO.fmt.mmss(q.limit + rint(10, 90)) + ' · limite ' + CO.fmt.mmss(q.limit)],
      ['warning', 'Fila “' + q.name + '” em crescimento', q.waiting + ' aguardando · espera ' + CO.fmt.mmss(q.wait)],
      ['warning', 'SLA da ' + s.name.toLowerCase() + ' oscilando', CO.fmt.dec1(s.value) + '% · meta ' + CO.fmt.dec1(s.meta) + '%'],
      ['critical', t.name + ' com poucos agentes', t.online + ' de ' + t.total + ' online'],
      ['info', t.name + ': agente voltou da pausa', (t.online + 1) + ' de ' + t.total + ' online'],
      ['info', 'Sincronização de pedidos concluída', rint(40, 220) + ' registros atualizados'],
      ['info', 'Novo pedido de alto valor recebido', 'PD-' + rint(1043, 1099) + ' · ' + CO.fmt.brl(rnd(8000, 26000))],
      ['warning', 'Tentativas de pagamento recusadas', rint(3, 9) + ' recusas na última hora'],
    ];
    const [sev, title, desc] = pool[rint(0, pool.length - 1)];
    return { id: ++alertSeq, sev, title, desc, at: new Date() };
  };

  /* ---------- Pedidos recentes (componente "Dados operacionais") ---------- */
  CO.statuses = {
    paid: { label: 'Pago', tone: 'success', icon: 'circle-check' },
    pending: { label: 'Pendente', tone: 'warning', icon: 'clock' },
    late: { label: 'Atrasado', tone: 'error', icon: 'octagon-alert' },
    review: { label: 'Em análise', tone: 'info', icon: 'info' },
    cancelled: { label: 'Cancelado', tone: 'neutral', icon: 'ban' },
  };
  const at = (daysAgo, h, m) => { const d = new Date(now); d.setDate(d.getDate() - daysAgo); d.setHours(h, m, 0, 0); return d; };
  CO.orders = [
    { id: 'PD-1042', cliente: 'Mercado Boa Vista', status: 'paid', valor: 1840.5, data: at(0, 9, 12) },
    { id: 'PD-1041', cliente: 'Clínica Santa Aurora', status: 'pending', valor: 3260.0, data: at(0, 8, 47) },
    { id: 'PD-1039', cliente: 'Transportadora Lima & Filhos', status: 'late', valor: 12480.9, data: at(2, 16, 30) },
    { id: 'PD-1038', cliente: 'Oficina Rota 66', status: 'review', valor: 745.0, data: at(3, 11, 5) },
  ];
})();
