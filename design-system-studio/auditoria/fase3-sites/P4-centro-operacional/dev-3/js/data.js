/* Dados fictícios e simulação de carregamento (sem backend).
   Modos de teste pela URL:
     ?estado=carregando  respostas demoram 6 s (skeletons visíveis)
     ?estado=vazio       listas e tabela chegam vazias
     ?estado=erro        a primeira chamada de cada fonte falha; "Tentar novamente" funciona
   Expõe window.CentroData (script clássico: funciona com file://). */
(function () {
  'use strict';

  var MODO = new URLSearchParams(window.location.search).get('estado') || '';
  var chamadas = {};

  // Simula uma chamada assíncrona. produtor() gera os dados a cada chamada.
  function simular(chave, produtor) {
    chamadas[chave] = (chamadas[chave] || 0) + 1;
    var primeira = chamadas[chave] === 1;
    var atraso = MODO === 'carregando' ? 6000 : 450;
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        if (MODO === 'erro' && primeira) {
          reject(new Error('Falha simulada na fonte ' + chave));
          return;
        }
        resolve(MODO === 'vazio' ? [] : produtor());
      }, atraso);
    });
  }

  // formato: 'mil' (R$ mil), 'int' (inteiro), 'pct' (percentual com uma casa)
  var KPIS = [
    {
      id: 'receita', rotulo: 'Receita mensal', valor: 'R$ 48,2 mil', formato: 'mil',
      variacao: 12.4, comparativo: 'vs. mês anterior', icone: 'wallet',
      serie: [38.1, 39.4, 40.0, 41.2, 40.8, 42.3, 43.0, 42.1, 44.6, 45.1, 44.0, 46.3, 47.2, 48.2]
    },
    {
      id: 'atendimentos', rotulo: 'Atendimentos concluídos', valor: '128', formato: 'int',
      variacao: 6.3, comparativo: 'vs. ontem', icone: 'check',
      serie: [96, 104, 99, 112, 108, 115, 111, 118, 109, 121, 117, 124, 120, 128]
    },
    {
      id: 'sla', rotulo: 'SLA cumprido', valor: '94,2%', formato: 'pct',
      variacao: -1.9, comparativo: 'vs. semana anterior', icone: 'timer',
      serie: [95.8, 96.1, 95.4, 96.0, 95.2, 95.9, 95.1, 94.7, 95.3, 95.0, 94.4, 94.8, 93.9, 94.2]
    },
    {
      id: 'equipes', rotulo: 'Equipes ativas', valor: '9 de 12', formato: 'int',
      variacao: 0, comparativo: 'vs. ontem', icone: 'users',
      serie: [8, 9, 9, 8, 9, 10, 9, 9, 8, 9, 9, 9, 9, 9]
    }
  ];

  // Pedidos de exemplo (4 linhas, conforme a especificação)
  var PEDIDOS = [
    { id: '1042', cliente: 'Loja Alfa Comércio', status: 'concluido', valor: 1248.9, data: '2026-11-02' },
    { id: '1041', cliente: 'Transportes Rio Verde', status: 'andamento', valor: 3590, data: '2026-11-01' },
    { id: '1039', cliente: 'Padaria Bela Vista', status: 'pendente', valor: 412.5, data: '2026-10-31' },
    { id: '1036', cliente: 'Clínica Vida Plena', status: 'cancelado', valor: 87, data: '2026-10-30' }
  ];

  // Modelos de alerta: severidade crítico | atencao | info | normal
  var MODELOS = [
    { sev: 'critico', msg: 'Fila de atendimento acima de 50 itens' },
    { sev: 'atencao', msg: 'SLA em risco no pedido #1038' },
    { sev: 'info', msg: 'Equipe Logística entrou em turno' },
    { sev: 'normal', msg: 'Integração de faturamento restabelecida' },
    { sev: 'atencao', msg: 'Latência alta no serviço de pagamentos' },
    { sev: 'info', msg: 'Relatório diário gerado' },
    { sev: 'critico', msg: 'Equipe Campo 2 sem resposta há 5 min' },
    { sev: 'normal', msg: 'Pedido #1040 concluído dentro do SLA' },
    { sev: 'atencao', msg: 'Fila de devoluções com 14 itens' },
    { sev: 'normal', msg: 'Backup noturno concluído' }
  ];

  // Cria um alerta. seq define o modelo; quando define o horário.
  function criarAlerta(seq, quando) {
    var modelo = MODELOS[seq % MODELOS.length];
    return { id: 'a' + seq, sev: modelo.sev, msg: modelo.msg, at: new Date(quando.getTime()) };
  }

  // Alertas iniciais: 24 itens, do mais recente ao mais antigo, espaçados em 3 min
  function alertasIniciais() {
    var agora = Date.now();
    var lista = [];
    for (var i = 0; i < 24; i++) {
      lista.push(criarAlerta(23 - i, new Date(agora - i * 3 * 60000)));
    }
    return lista;
  }

  window.CentroData = {
    modo: MODO,
    fetchKpis: function () {
      return simular('kpis', function () { return JSON.parse(JSON.stringify(KPIS)); });
    },
    fetchPedidos: function () {
      return simular('pedidos', function () { return JSON.parse(JSON.stringify(PEDIDOS)); });
    },
    fetchAlertas: function () {
      return simular('alertas', alertasIniciais);
    },
    criarAlerta: criarAlerta
  };
})();
