/* =========================================================
   Dados fictícios da demonstração (gerados de forma determinística)
   Nada aqui representa pessoas ou empresas reais.
   ========================================================= */
(function () {
  'use strict';
  const N = (window.Nexo = window.Nexo || {});
  const DAY = 86400000;
  // Data de referência fixa (data da especificação), para que os números sejam sempre os mesmos.
  const TODAY = new Date(2026, 10, 2, 18, 0, 0);
  N.TODAY = TODAY;
  N.DAY = DAY;

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let a = hash(String(seed));
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  function weighted(r, obj) {
    const e = Object.entries(obj);
    const tot = e.reduce((s, x) => s + x[1], 0);
    let x = r() * tot;
    for (const [k, w] of e) { x -= w; if (x < 0) return k; }
    return e[e.length - 1][0];
  }
  const cents = (v) => Math.round(v * 100) / 100;
  const daysAgo = (n, r) => {
    const d = new Date(TODAY.getTime() - n * DAY);
    d.setHours(8 + Math.floor(r() * 10), Math.floor(r() * 60), 0, 0);
    if (d > TODAY) d.setTime(TODAY.getTime() - Math.floor(r() * 6 + 1) * 3600000);
    return d;
  };
  N.rng = rng;

  /* ---------- Conta, unidades e períodos ---------- */
  N.USER = {
    name: 'Ana Ribeiro',
    initials: 'AR',
    role: 'Controller financeira',
    email: 'ana.ribeiro@nexocapital.com.br',
    profile: 'Financeiro — Administradora'
  };
  N.DEMO_LOGIN = { email: 'ana.ribeiro@nexocapital.com.br', password: 'Nexo@2026' };

  N.UNITS = [
    { id: 'sp', name: 'Matriz — São Paulo', factor: 1 },
    { id: 'rj', name: 'Filial — Rio de Janeiro', factor: 0.64 },
    { id: 'cwb', name: 'Filial — Curitiba', factor: 0.42 }
  ];
  N.unitById = (id) => N.UNITS.find((u) => u.id === id) || N.UNITS[0];

  N.PERIODS = [
    { id: '7d', label: 'Últimos 7 dias', days: 7 },
    { id: '30d', label: 'Últimos 30 dias', days: 30 },
    { id: '90d', label: 'Últimos 90 dias', days: 90 },
    { id: '12m', label: 'Últimos 12 meses', days: 365 }
  ];
  N.periodById = (id) => N.PERIODS.find((p) => p.id === id) || N.PERIODS[1];
  /** Intervalo do período (inclui hoje) e o intervalo anterior de mesmo tamanho. */
  N.periodRange = function (id) {
    const p = N.periodById(id);
    const startToday = new Date(TODAY); startToday.setHours(0, 0, 0, 0);
    const start = new Date(startToday.getTime() - (p.days - 1) * DAY);
    const prevStart = new Date(start.getTime() - p.days * DAY);
    return { id: p.id, label: p.label, days: p.days, start, end: TODAY, prevStart, prevEnd: start };
  };
  /** Últimos n meses fechados (o mês corrente, ainda parcial, fica de fora). */
  N.lastMonths = function (n) {
    const out = [];
    for (let i = n; i >= 1; i--) {
      const s = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1);
      out.push({ start: s, end: new Date(s.getFullYear(), s.getMonth() + 1, 1), y: s.getFullYear(), m: s.getMonth() });
    }
    return out;
  };
  N.MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  /* ---------- Listas de nomes fictícios ---------- */
  const CLIENTS = [
    'Construtora Alvorada', 'Grupo Litoral Logística', 'Farmácias Bem Viver', 'Agro Cerrado S.A.',
    'Metalúrgica Paraná', 'Clínica São Lucas', 'Editora Horizonte', 'TecnoSul Sistemas',
    'Rede Mercado Bom', 'Transportes Rota 116', 'Hotel Atlântico', 'Laticínios Serra Azul',
    'Escola Novo Saber', 'Vinícola Vale Alto', 'Moinho Central', 'Óticas Visão Clara',
    'Cooperativa Campo Forte', 'Estúdio Arquitetura Linha', 'Padaria Trigo de Ouro', 'Auto Peças Ipiranga'
  ];
  const SUPPLIERS = [
    'Papelaria Ponto Certo', 'Limpeza Brilho Total', 'DataNuvem Hospedagem', 'Seguradora Amparo',
    'Consultoria Tributa+', 'Energia Verde Comercializadora', 'Telecom Conecta', 'Gráfica Impressa Já',
    'Mobiliário Ergon', 'Segurança Vigilar', 'Café Serra Mineira', 'Locadora Frota Sul',
    'Auditores Associados Prisma', 'Software Contábil Ábaco', 'Manutenção Predial Alicerce', 'Viagens Rumo Certo',
    'Treinamentos Saber Corporativo', 'Correios Expressos Lince'
  ];
  const PEOPLE = [
    'Ana Ribeiro', 'Bruno Carvalho', 'Camila Duarte', 'Diego Fontes', 'Eduarda Lima', 'Felipe Moraes',
    'Gabriela Nunes', 'Henrique Prado', 'Isabela Rocha', 'João Teixeira', 'Larissa Vieira', 'Marcos Azevedo',
    'Natália Barros', 'Otávio Campos', 'Patrícia Dias', 'Rafael Gomes', 'Sofia Martins', 'Thiago Pereira',
    'Vanessa Souza', 'William Costa', 'Yasmin Freitas', 'Lucas Andrade'
  ];
  N.CLIENTS = CLIENTS;
  const emailOf = (name) => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '.') + '@nexocapital.com.br';

  /* ---------- Mapas de status (rótulo + tom semântico) ---------- */
  N.STATUS = {
    pedido: { pago: { label: 'Pago', tone: 'success' }, pendente: { label: 'Pendente', tone: 'warning' }, atrasado: { label: 'Atrasado', tone: 'error' }, analise: { label: 'Em análise', tone: 'info' } },
    negocio: { convertido: { label: 'Convertido', tone: 'success' }, negociacao: { label: 'Em negociação', tone: 'info' }, qualificado: { label: 'Lead qualificado', tone: 'neutral' }, perdido: { label: 'Perdido', tone: 'error' } },
    renovacao: { renovado: { label: 'Renovado', tone: 'success' }, negociacao: { label: 'Em negociação', tone: 'info' }, risco: { label: 'Em risco', tone: 'warning' }, cancelado: { label: 'Cancelado', tone: 'error' } },
    fatura: { paga: { label: 'Paga', tone: 'success' }, aberta: { label: 'Em aberto', tone: 'warning' }, vencida: { label: 'Vencida', tone: 'error' }, contestada: { label: 'Contestada', tone: 'info' } },
    contrato: { vigente: { label: 'Vigente', tone: 'success' }, avencer: { label: 'A vencer', tone: 'warning' }, revisao: { label: 'Em revisão', tone: 'info' }, encerrado: { label: 'Encerrado', tone: 'neutral' } },
    fornecedor: { ativo: { label: 'Ativo', tone: 'success' }, homologacao: { label: 'Em homologação', tone: 'info' }, bloqueado: { label: 'Bloqueado', tone: 'error' }, inativo: { label: 'Inativo', tone: 'neutral' } },
    compra: { aprovada: { label: 'Aprovada', tone: 'success' }, aguardando: { label: 'Aguardando aprovação', tone: 'warning' }, recebida: { label: 'Recebida', tone: 'info' }, recusada: { label: 'Recusada', tone: 'error' } },
    colaborador: { ativo: { label: 'Ativo', tone: 'success' }, ferias: { label: 'Férias', tone: 'info' }, afastado: { label: 'Afastado', tone: 'warning' }, desligado: { label: 'Desligado', tone: 'neutral' } },
    folha: { paga: { label: 'Paga', tone: 'success' }, processamento: { label: 'Em processamento', tone: 'info' }, pendente: { label: 'Pendente', tone: 'warning' } },
    auditoria: { sucesso: { label: 'Sucesso', tone: 'success' }, alerta: { label: 'Alerta', tone: 'warning' }, falha: { label: 'Falha', tone: 'error' } },
    permissao: { ativo: { label: 'Ativo', tone: 'success' }, pendente: { label: 'Pendente', tone: 'warning' }, revogado: { label: 'Revogado', tone: 'neutral' } }
  };

  /* ---------- Registros do painel (2 anos, para comparar com o período anterior) ---------- */
  const KINDS = {
    pedidos: { prefix: 'PED-', perDay: 1.3, min: 1800, max: 68000, recent: { pago: 40, pendente: 32, atrasado: 10, analise: 18 }, old: { pago: 86, pendente: 3, atrasado: 9, analise: 2 } },
    negocios: { prefix: 'NEG-', perDay: 0.55, min: 8000, max: 160000, recent: { convertido: 36, negociacao: 25, qualificado: 15, perdido: 24 }, old: { convertido: 58, negociacao: 2, qualificado: 2, perdido: 38 } },
    renovacoes: { prefix: 'REN-', perDay: 0.45, min: 12000, max: 210000, recent: { renovado: 50, negociacao: 22, risco: 18, cancelado: 10 }, old: { renovado: 84, negociacao: 1, risco: 1, cancelado: 14 } },
    faturas: { prefix: 'FAT-', perDay: 1.1, min: 2400, max: 72000, recent: { paga: 50, aberta: 40, vencida: 4, contestada: 6 }, old: { paga: 90, aberta: 1, vencida: 7, contestada: 2 } }
  };
  const cache = new Map();

  N.records = function (kind, unitId) {
    const key = kind + '|' + unitId;
    if (cache.has(key)) return cache.get(key);
    const k = KINDS[kind];
    const unit = N.unitById(unitId);
    const r = rng(key);
    const total = Math.round(k.perDay * 730 * unit.factor);
    const list = [];
    for (let i = 0; i < total; i++) {
      const off = Math.floor(r() * 730);
      const date = daysAgo(off, r);
      const season = 1 + 0.22 * Math.sin((date.getMonth() + 1) * 0.85);
      const trend = 1 + 0.35 * (1 - off / 730);
      const valor = cents((k.min + (k.max - k.min) * Math.pow(r(), 1.8)) * season * trend);
      const status = weighted(r, off <= 21 ? k.recent : k.old);
      list.push({ cliente: pick(r, CLIENTS), status, valor, data: date, canal: r() < 0.56 ? 'organico' : 'pago' });
    }
    list.sort((a, b) => b.data - a.data);
    const n = list.length;
    list.forEach((x, i) => { x.id = k.prefix + (10000 + n - i); });
    cache.set(key, list);
    return list;
  };
  N.nextId = function (kind, unitId) {
    const list = N.records(kind, unitId);
    const max = list.reduce((m, x) => Math.max(m, parseInt(x.id.replace(/\D/g, ''), 10) || 0), 0);
    return KINDS[kind].prefix + (max + 1);
  };

  /* ---------- Registros das páginas do menu lateral ---------- */
  const OBJETOS = ['Licença de software ERP', 'Serviços de limpeza', 'Consultoria tributária', 'Locação de equipamentos', 'Auditoria externa', 'Manutenção predial', 'Seguro patrimonial', 'Link de dados dedicado', 'Vigilância patrimonial', 'Treinamento de equipes'];
  const CATEGORIAS = ['Tecnologia', 'Serviços gerais', 'Consultoria', 'Facilities', 'Seguros', 'Logística', 'Material de escritório'];
  const AREAS = ['Controladoria', 'Tesouraria', 'Contas a pagar', 'Contas a receber', 'Fiscal', 'Compras', 'Recursos humanos', 'Tecnologia'];
  const PERFIS = ['Administrador', 'Financeiro', 'Compras', 'Recursos humanos', 'Auditor', 'Somente leitura'];
  const EVENTOS = [
    ['Login bem-sucedido', 'sucesso'], ['Tentativa de login falhou', 'falha'], ['Permissão alterada', 'alerta'],
    ['Exportação de relatório', 'sucesso'], ['Aprovação de pagamento', 'sucesso'], ['Alteração de dados bancários', 'alerta'],
    ['Sessão encerrada', 'sucesso'], ['Acesso negado a recurso', 'falha']
  ];
  const pageCache = new Map();
  const pad = (n, l) => String(n).padStart(l || 2, '0');

  N.pageRows = function (page, unitId) {
    const key = page + '|' + unitId;
    if (pageCache.has(key)) return pageCache.get(key);
    const unit = N.unitById(unitId);
    const r = rng('page|' + key);
    const f = unit.factor;
    let rows = [];
    if (page === 'contratos') {
      const n = Math.round(26 * f) + 8;
      for (let i = 0; i < n; i++) {
        rows.push({ id: 'CT-2026-' + pad(i + 1, 3), objeto: pick(r, OBJETOS), fornecedor: pick(r, SUPPLIERS), status: weighted(r, { vigente: 55, avencer: 15, revisao: 12, encerrado: 18 }), valor: cents(15000 + 480000 * Math.pow(r(), 2)), data: daysAgo(Math.floor(r() * 400), r) });
      }
    } else if (page === 'fornecedores') {
      SUPPLIERS.slice(0, Math.max(10, Math.round(SUPPLIERS.length * (0.6 + 0.4 * f)))).forEach((nome, i) => {
        rows.push({ id: 'FOR-' + (101 + i), nome, categoria: pick(r, CATEGORIAS), status: weighted(r, { ativo: 62, homologacao: 14, bloqueado: 8, inativo: 16 }), valor: cents((20000 + 900000 * Math.pow(r(), 2.2)) * f), data: daysAgo(90 + Math.floor(r() * 1600), r) });
      });
    } else if (page === 'compras') {
      const n = Math.round(44 * f) + 10;
      for (let i = 0; i < n; i++) {
        const off = Math.floor(r() * 200);
        rows.push({ id: 'PO-' + (4100 + i), fornecedor: pick(r, SUPPLIERS), status: off < 12 ? weighted(r, { aguardando: 50, aprovada: 35, recusada: 15 }) : weighted(r, { recebida: 62, aprovada: 22, recusada: 16 }), valor: cents(800 + 120000 * Math.pow(r(), 2.2)), data: daysAgo(off, r) });
      }
    } else if (page === 'colaboradores') {
      PEOPLE.slice(0, Math.max(12, Math.round(PEOPLE.length * (0.55 + 0.45 * f)))).forEach((nome, i) => {
        rows.push({ id: 'COL-' + pad(i + 1, 4), nome, area: pick(r, AREAS), status: weighted(r, { ativo: 74, ferias: 12, afastado: 6, desligado: 8 }), valor: cents(4200 + 26000 * Math.pow(r(), 1.6)), data: daysAgo(60 + Math.floor(r() * 3000), r) });
      });
    } else if (page === 'folha') {
      const months = N.lastMonths(12);
      months.push({ y: TODAY.getFullYear(), m: TODAY.getMonth() });
      const base = Math.round(180 * f);
      months.forEach((mo, i) => {
        const last = i === months.length - 1;
        const qtd = base + Math.floor(r() * 8);
        const pay = new Date(mo.y, mo.m + 1, 0, 10, 0, 0); // último dia do mês
        rows.push({ id: 'FP-' + mo.y + '-' + pad(mo.m + 1), competencia: N.MONTHS[mo.m] + '/' + mo.y, qtd, status: last ? 'processamento' : 'paga', valor: cents(qtd * 7400 * (1 + 0.008 * i) * (0.97 + r() * 0.06)), data: pay });
      });
      rows.reverse();
    } else if (page === 'auditoria') {
      for (let i = 0; i < 64; i++) {
        const ev = pick(r, EVENTOS);
        const who = pick(r, PEOPLE);
        rows.push({ id: 'EV-' + (88000 + i), evento: ev[0], usuario: who, email: emailOf(who), status: ev[1], ip: '10.20.' + Math.floor(r() * 40) + '.' + Math.floor(r() * 250 + 2), data: daysAgo(Math.floor(r() * 120), r) });
      }
    } else if (page === 'permissoes') {
      PEOPLE.slice(0, 16).forEach((nome, i) => {
        rows.push({ id: 'USR-' + (2001 + i), nome, email: emailOf(nome), perfil: i === 0 ? 'Administrador' : pick(r, PERFIS), status: i === 0 ? 'ativo' : weighted(r, { ativo: 72, pendente: 14, revogado: 14 }), data: daysAgo(Math.floor(r() * 90), r) });
      });
    }
    if (page !== 'folha') rows.sort((a, b) => b.data - a.data);
    pageCache.set(key, rows);
    return rows;
  };

  /* ---------- Notificações ---------- */
  N.NOTIFICATIONS = [
    { title: 'Fatura FAT-11982 venceu hoje', meta: 'Hotel Atlântico · há 1 h', unread: true },
    { title: 'Compra PO-4105 aguarda sua aprovação', meta: 'DataNuvem Hospedagem · há 3 h', unread: true },
    { title: 'Conciliação bancária de outubro concluída', meta: 'Tesouraria · ontem', unread: true },
    { title: 'Folha de outubro paga', meta: 'Recursos humanos · 31/10/2026', unread: false }
  ];
})();
