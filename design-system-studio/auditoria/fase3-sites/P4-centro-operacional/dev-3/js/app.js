/* Centro Operacional: lógica da tela principal (One Screen).
   Depende de data.js (dados fictícios) e ui.js (formatação e componentes visuais). */
(function () {
  'use strict';

  var D = window.CentroData;
  var U = window.CentroUI;

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  var app = $('#app');
  var MQ_ONE_SCREEN = window.matchMedia('(min-width: 768px) and (min-height: 640px), (max-width: 767.98px) and (min-height: 560px)');
  var MQ_REDUZIR = window.matchMedia('(prefers-reduced-motion: reduce)');

  var LIMITE_ALERTAS = 60;
  var INTERVALO_ALERTAS_MS = 9000;
  var ULTIMO_SEQ_INICIAL = 23; // D.fetchAlertas() gera os ids a0..a23

  var estado = {
    kpis: [],
    pedidos: [],
    alertas: [],
    seq: ULTIMO_SEQ_INICIAL,
    alertasCarregados: false,
    visao: 'indicadores',
    ordenacao: { chave: 'data', dir: 'desc' },
    filtro: { q: '', status: '' },
    selecionados: {},
    pausado: false,
    online: navigator.onLine,
    atualizadoEm: null
  };

  // Regiões
  var kpiGrid = $('[data-kpi-grid]');
  var kpiState = $('[data-kpi-state]');
  var tableEl = $('.table');
  var tbody = $('[data-rows]');
  var tableState = $('[data-table-state]');
  var summaryEl = $('[data-summary]');
  var selCount = $('[data-sel-count]');
  var selAll = $('#sel-all');
  var busca = $('#busca');
  var filtroStatus = $('#filtro-status');
  var alertList = $('[data-alert-list]');
  var alertState = $('[data-alert-state]');
  var alertCount = $('[data-alert-count]');
  var alertSummary = $('[data-alert-summary]');
  var dlg = $('#detalhe');
  var gatilhoDialogo = null;

  /* ---------- Rolagem interna: indicação de conteúdo adicional ---------- */
  function atualizarMais(el) {
    var wrap = el && el.parentElement;
    if (!wrap || !wrap.classList.contains('scroll-wrap')) { return; }
    var resta = el.scrollHeight - el.scrollTop - el.clientHeight;
    wrap.classList.toggle('has-more', resta > 4);
  }
  function atualizarTodosMais() { $$('[data-scroll]').forEach(atualizarMais); }

  /* ---------- Diálogo (detalhes e relatório) ---------- */
  function abrirDialogo(titulo, linhas, gatilho) {
    gatilhoDialogo = gatilho || document.activeElement;
    $('#detalhe-titulo').textContent = titulo;
    $('[data-dialog-body]').innerHTML = linhas.map(function (l) {
      return '<div class="dl-row"><dt>' + U.esc(l[0]) + '</dt><dd>' + U.esc(l[1]) + '</dd></div>';
    }).join('');
    if (typeof dlg.showModal === 'function') { dlg.showModal(); } else { dlg.setAttribute('open', ''); }
  }

  function abrirRelatorioKpi(k, gatilho) {
    var linhas = [
      ['Indicador', k.rotulo],
      ['Valor atual', k.valor],
      ['Variação', U.formatarVariacao(k.variacao) + ' ' + k.comparativo],
      ['Período', '20/10 a 02/11/2026 (14 dias)']
    ];
    for (var i = k.serie.length - 1; i >= 0; i--) {
      linhas.push([U.diaMes(i), U.formatarValor(k.serie[i], k.formato)]);
    }
    abrirDialogo('Relatório: ' + k.rotulo, linhas, gatilho);
  }

  dlg.addEventListener('close', function () {
    if (gatilhoDialogo && gatilhoDialogo.isConnected) { gatilhoDialogo.focus(); }
    gatilhoDialogo = null;
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
  $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });

  /* ---------- Indicadores ---------- */
  function carregarKpis() {
    U.ocultarMensagem(kpiState);
    kpiGrid.innerHTML = U.skeletonKpis(4);
    kpiGrid.setAttribute('aria-busy', 'true');
    return D.fetchKpis().then(function (lista) {
      estado.kpis = lista;
      kpiGrid.setAttribute('aria-busy', 'false');
      if (!lista.length) {
        kpiGrid.innerHTML = '';
        U.mostrarMensagem(kpiState, 'Nenhum indicador disponível no momento.');
        return;
      }
      kpiGrid.innerHTML = lista.map(U.kpiHtml).join('');
      $$('[data-kpi]', kpiGrid).forEach(function (el, i) {
        U.ligarSpark(el.querySelector('.spark'), lista[i]);
      });
    }).catch(function () {
      kpiGrid.setAttribute('aria-busy', 'false');
      kpiGrid.innerHTML = '';
      U.mostrarMensagem(kpiState, 'Não foi possível carregar os indicadores.', {
        tipo: 'erro', acao: 'Tentar novamente', aoAcionar: carregarKpis
      });
    });
  }

  kpiGrid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-relatorio]');
    if (!b) { return; }
    var k = estado.kpis.filter(function (x) { return x.id === b.getAttribute('data-relatorio'); })[0];
    if (k) { abrirRelatorioKpi(k, b); }
  });

  /* ---------- Dados operacionais (tabela) ---------- */
  function pedidosVisiveis() {
    var q = estado.filtro.q.trim().toLowerCase();
    var st = estado.filtro.status;
    var chave = estado.ordenacao.chave;
    var f = estado.ordenacao.dir === 'asc' ? 1 : -1;
    return estado.pedidos
      .filter(function (p) {
        return (!q || p.cliente.toLowerCase().indexOf(q) !== -1) && (!st || p.status === st);
      })
      .sort(function (a, b) {
        var va = a[chave];
        var vb = b[chave];
        if (typeof va === 'number') { return (va - vb) * f; }
        return String(va).localeCompare(String(vb), 'pt-BR') * f;
      });
  }

  function linhaHtml(p) {
    var sel = !!estado.selecionados[p.id];
    var st = U.STATUS[p.status];
    return '<tr data-id="' + U.esc(p.id) + '"' + (sel ? ' class="is-selected"' : '') + '>' +
      '<td class="col-check"><label class="hit"><input type="checkbox" class="linha-check" data-id="' + U.esc(p.id) + '"' +
        (sel ? ' checked' : '') + ' aria-label="Selecionar pedido ' + U.esc(p.id) + ', ' + U.esc(p.cliente) + '"></label></td>' +
      '<th scope="row" class="cell-cliente">' + U.esc(p.cliente) + ' <span class="cell-id">#' + U.esc(p.id) + '</span></th>' +
      '<td><span class="badge tone-' + st.tom + '">' + U.icon(st.icone) + '<span>' + st.rotulo + '</span></span></td>' +
      '<td class="num">' + U.formatarBRL(p.valor) + '</td>' +
      '<td>' + U.formatarData(p.data) + '</td>' +
      '<td class="col-actions"><button type="button" class="btn" data-detalhe="' + U.esc(p.id) +
        '" aria-label="Ver detalhes do pedido ' + U.esc(p.id) + '">Detalhes</button></td>' +
      '</tr>';
  }

  function atualizarOrdenacao() {
    $$('th[data-sort]', tableEl).forEach(function (th) {
      var chave = th.getAttribute('data-sort');
      var ativo = estado.ordenacao.chave === chave;
      th.setAttribute('aria-sort', ativo ? (estado.ordenacao.dir === 'asc' ? 'ascending' : 'descending') : 'none');
      var ind = th.querySelector('.sort-ind');
      if (ind) { ind.textContent = ativo ? (estado.ordenacao.dir === 'asc' ? '↑' : '↓') : ''; }
    });
  }

  function atualizarSelecao(visiveis) {
    var n = visiveis.filter(function (p) { return estado.selecionados[p.id]; }).length;
    selAll.checked = visiveis.length > 0 && n === visiveis.length;
    selAll.indeterminate = n > 0 && n < visiveis.length;
    var total = Object.keys(estado.selecionados).filter(function (id) { return estado.selecionados[id]; }).length;
    selCount.textContent = total ? (total + (total === 1 ? ' pedido selecionado' : ' pedidos selecionados')) : '';
  }

  function renderizarPedidos() {
    var lista = pedidosVisiveis();
    tbody.innerHTML = lista.map(linhaHtml).join('');
    atualizarOrdenacao();
    atualizarSelecao(lista);
    if (!estado.pedidos.length) {
      U.mostrarMensagem(tableState, 'Nenhum pedido recente no momento.');
    } else if (!lista.length) {
      U.mostrarMensagem(tableState, 'Nenhum pedido corresponde aos filtros.', {
        acao: 'Limpar filtros', aoAcionar: limparFiltros
      });
    } else {
      U.ocultarMensagem(tableState);
    }
    summaryEl.innerHTML = '<span class="summary-label">Total de pedidos recentes</span>' +
      '<span class="summary-value">' + estado.pedidos.length + (estado.pedidos.length === 1 ? ' pedido' : ' pedidos') + ' · ' +
      U.formatarBRL(estado.pedidos.reduce(function (s, p) { return s + p.valor; }, 0)) + '</span>';
    atualizarTodosMais();
  }

  function carregarPedidos() {
    U.ocultarMensagem(tableState);
    tbody.innerHTML = U.skeletonLinhas(4);
    tableEl.setAttribute('aria-busy', 'true');
    return D.fetchPedidos().then(function (lista) {
      estado.pedidos = lista;
      tableEl.setAttribute('aria-busy', 'false');
      renderizarPedidos();
    }).catch(function () {
      tableEl.setAttribute('aria-busy', 'false');
      tbody.innerHTML = '';
      U.mostrarMensagem(tableState, 'Não foi possível carregar os pedidos.', {
        tipo: 'erro', acao: 'Tentar novamente', aoAcionar: carregarPedidos
      });
    });
  }

  function limparFiltros() {
    busca.value = '';
    filtroStatus.value = '';
    estado.filtro = { q: '', status: '' };
    renderizarPedidos();
  }

  tbody.addEventListener('change', function (e) {
    var cb = e.target.closest('.linha-check');
    if (!cb) { return; }
    var id = cb.getAttribute('data-id');
    estado.selecionados[id] = cb.checked;
    cb.closest('tr').classList.toggle('is-selected', cb.checked);
    atualizarSelecao(pedidosVisiveis());
  });

  tbody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-detalhe]');
    if (!b) { return; }
    var id = b.getAttribute('data-detalhe');
    var p = estado.pedidos.filter(function (x) { return x.id === id; })[0];
    if (!p) { return; }
    abrirDialogo('Pedido #' + p.id, [
      ['Cliente', p.cliente],
      ['Status', U.STATUS[p.status].rotulo],
      ['Valor', U.formatarBRL(p.valor)],
      ['Data', U.formatarData(p.data)]
    ], b);
  });

  selAll.addEventListener('change', function () {
    var visiveis = pedidosVisiveis();
    visiveis.forEach(function (p) { estado.selecionados[p.id] = selAll.checked; });
    renderizarPedidos();
  });

  $('thead', tableEl).addEventListener('click', function (e) {
    var b = e.target.closest('.th-btn');
    if (!b) { return; }
    var chave = b.closest('th').getAttribute('data-sort');
    if (estado.ordenacao.chave === chave) {
      estado.ordenacao.dir = estado.ordenacao.dir === 'asc' ? 'desc' : 'asc';
    } else {
      estado.ordenacao = { chave: chave, dir: 'asc' };
    }
    renderizarPedidos();
  });

  busca.addEventListener('input', function () {
    estado.filtro.q = busca.value;
    renderizarPedidos();
  });
  filtroStatus.addEventListener('change', function () {
    estado.filtro.status = filtroStatus.value;
    renderizarPedidos();
  });

  /* ---------- Alertas (lista cronológica com severidade) ---------- */
  function alertaHtml(a, novo) {
    var sev = U.SEVERIDADE[a.sev];
    return '<li class="alert' + (novo ? ' is-new' : '') + '" data-id="' + a.id + '">' +
      '<span class="sev tone-' + sev.tom + '">' + U.icon(sev.icone) + '<span>' + sev.rotulo + '</span></span>' +
      '<div class="alert-body"><p class="alert-msg">' + U.esc(a.msg) + '</p>' +
      '<time class="alert-time" datetime="' + a.at.toISOString() + '">' + U.formatarHora(a.at) + '</time></div></li>';
  }

  function atualizarContadorAlertas() {
    var criticos = estado.alertas.filter(function (a) { return a.sev === 'critico'; }).length;
    var atencao = estado.alertas.filter(function (a) { return a.sev === 'atencao'; }).length;
    alertCount.textContent = String(estado.alertas.length);
    alertSummary.textContent = criticos + (criticos === 1 ? ' crítico' : ' críticos') + ' · ' + atencao + ' em atenção';
  }

  function carregarAlertas() {
    U.mostrarMensagem(alertState, 'Carregando alertas…');
    alertList.innerHTML = '';
    return D.fetchAlertas().then(function (lista) {
      estado.alertas = lista;
      estado.seq = ULTIMO_SEQ_INICIAL;
      estado.alertasCarregados = true;
      if (!lista.length) {
        alertList.innerHTML = '';
        U.mostrarMensagem(alertState, 'Nenhum alerta no momento. Novos alertas aparecem aqui.');
      } else {
        U.ocultarMensagem(alertState);
        alertList.innerHTML = lista.map(function (a) { return alertaHtml(a, false); }).join('');
      }
      atualizarContadorAlertas();
      atualizarMais(alertList);
    }).catch(function () {
      alertList.innerHTML = '';
      U.mostrarMensagem(alertState, 'Não foi possível carregar os alertas.', {
        tipo: 'erro', acao: 'Tentar novamente', aoAcionar: carregarAlertas
      });
    });
  }

  // Novo alerta entra no topo com destaque discreto (a classe is-new some sozinha)
  function novoAlerta() {
    estado.seq += 1;
    var a = D.criarAlerta(estado.seq, new Date());
    estado.alertas.unshift(a);
    if (estado.alertas.length > LIMITE_ALERTAS) { estado.alertas.length = LIMITE_ALERTAS; }
    U.ocultarMensagem(alertState);
    alertList.insertAdjacentHTML('afterbegin', alertaHtml(a, true));
    while (alertList.children.length > LIMITE_ALERTAS) { alertList.removeChild(alertList.lastElementChild); }
    atualizarContadorAlertas();
    atualizarMais(alertList);
    estado.atualizadoEm = new Date();
    atualizarStatus();
    window.setTimeout(function () {
      var el = alertList.querySelector('[data-id="' + a.id + '"]');
      if (el) { el.classList.remove('is-new'); }
    }, 400);
  }

  /* ---------- Barra de status, relógio e conexão ---------- */
  function atualizarStatus() {
    $$('[data-conn]').forEach(function (el) { el.classList.toggle('is-off', !estado.online); });
    $$('[data-conn-label]').forEach(function (el) { el.textContent = estado.online ? 'Conectado' : 'Sem conexão'; });
    $$('[data-last-update]').forEach(function (el) {
      el.textContent = estado.atualizadoEm ? U.formatarHora(estado.atualizadoEm) : '--:--:--';
    });
  }

  function tictac() {
    var t = U.formatarHora(new Date());
    $$('[data-clock]').forEach(function (el) { el.textContent = t; });
  }

  window.addEventListener('online', function () { estado.online = true; atualizarStatus(); });
  window.addEventListener('offline', function () { estado.online = false; atualizarStatus(); });

  /* ---------- Pausa, atualização manual e carregamento geral ---------- */
  function alternarPausa() {
    estado.pausado = !estado.pausado;
    var b = $('[data-action="pause"]');
    b.setAttribute('aria-pressed', String(estado.pausado));
    b.querySelector('[data-icon]').innerHTML = U.icon(estado.pausado ? 'play' : 'pause');
    $('[data-paused-wrap]').hidden = !estado.pausado;
  }

  function atualizarTudo() {
    return Promise.all([carregarKpis(), carregarPedidos(), carregarAlertas()]).then(function () {
      estado.atualizadoEm = new Date();
      atualizarStatus();
    });
  }

  /* ---------- Visões: abas do desktop (Grade | Alertas) e do celular (Indicadores | Dados | Alertas) ---------- */
  function definirVisao(v, opcoes) {
    estado.visao = v;
    app.setAttribute('data-view', v);
    $$('[role="tab"]').forEach(function (b) {
      var views = (b.getAttribute('data-views') || '').split(' ');
      var ativo = views.indexOf(v) !== -1;
      b.setAttribute('aria-selected', String(ativo));
      if (ativo) { b.setAttribute('aria-current', 'page'); } else { b.removeAttribute('aria-current'); }
      b.tabIndex = ativo ? 0 : -1;
    });
    // Modo empilhado (página rola): a aba leva até a seção correspondente
    if (opcoes && opcoes.rolar && !MQ_ONE_SCREEN.matches) {
      var alvo = v === 'alertas' ? $('.sec-alertas') : $('.sec-' + v);
      if (alvo) { alvo.scrollIntoView({ block: 'start', behavior: MQ_REDUZIR.matches ? 'auto' : 'smooth' }); }
    }
  }

  $$('[role="tablist"]').forEach(function (lista) {
    lista.addEventListener('click', function (e) {
      var b = e.target.closest('[role="tab"]');
      if (b) { definirVisao(b.getAttribute('data-go'), { rolar: true }); }
    });
    // Setas ←/→ trocam de aba; Home/End vão à primeira/última
    lista.addEventListener('keydown', function (e) {
      var abas = $$('[role="tab"]', lista);
      var i = abas.indexOf(document.activeElement);
      if (i < 0) { return; }
      var n = null;
      if (e.key === 'ArrowRight') { n = (i + 1) % abas.length; }
      else if (e.key === 'ArrowLeft') { n = (i - 1 + abas.length) % abas.length; }
      else if (e.key === 'Home') { n = 0; }
      else if (e.key === 'End') { n = abas.length - 1; }
      if (n === null) { return; }
      e.preventDefault();
      abas[n].focus();
      abas[n].click();
    });
  });

  /* ---------- Inicialização ---------- */
  function iniciar() {
    U.hydrateIcons();
    definirVisao('indicadores', { rolar: false });

    $('[data-action="refresh"]').addEventListener('click', atualizarTudo);
    $('[data-action="pause"]').addEventListener('click', alternarPausa);

    $$('[data-scroll]').forEach(function (el) {
      el.addEventListener('scroll', function () { atualizarMais(el); }, { passive: true });
    });
    window.addEventListener('resize', atualizarTodosMais);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(atualizarTodosMais);
      $$('[data-scroll]').forEach(function (el) { ro.observe(el); });
    }

    tictac();
    window.setInterval(tictac, 1000);
    atualizarStatus();

    atualizarTudo();

    window.setInterval(function () {
      if (estado.pausado || !estado.online || !estado.alertasCarregados) { return; }
      novoAlerta();
    }, INTERVALO_ALERTAS_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
