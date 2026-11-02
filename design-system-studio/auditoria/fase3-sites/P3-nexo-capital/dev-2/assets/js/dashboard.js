/* ==========================================================================
   Dashboard financeiro: cabeçalho da página, 3 KPIs, gráfico (2/3) +
   atividades (1/3) e tabela. O filtro de período atualiza todos os blocos,
   cada um com seu próprio estado de carregando / erro / vazio.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui, esc = NX.fmt.esc;

  var DELAYS = { kpis: 420, chart: 680, act: 540, table: 820 };

  function stateBlock(kind, icon, title, text, retry) {
    return '<div class="state' + (kind === 'error' ? ' state--error' : '') + '">' + NX.icon(icon, 24) +
      '<p class="state__title">' + esc(title) + '</p><p class="state__text">' + esc(text) + '</p>' +
      (retry ? '<button type="button" class="btn btn--outline" data-retry>' + NX.icon('refresh-cw', 16) + '<span>Tentar novamente</span></button>' : '') +
      '</div>';
  }

  NX.dashboard = {
    current: null,

    /**
     * Renderiza uma visão do Painel dentro de `container`.
     * ctx: { getPeriod(): id, estado: 'erro'|'vazio'|'carregando'|null }
     */
    render: function (container, viewId, ctx) {
      var view = NX.views[viewId];
      var destroyed = false;
      var token = 0;
      var forceError = {};
      var chartInst = null;
      var ids = { kpis: 'k', chart: 'c', act: 'a', table: 't' };

      container.innerHTML =
        '<div class="page-head"><div class="page-head__text">' +
        '<h1 id="page-title" tabindex="-1">' + esc(view.label) + '</h1>' +
        '<p class="page-head__sub">' + esc(view.sub) + '</p></div>' +
        '<div class="page-head__actions" id="slot-page-actions"></div></div>' +
        '<div class="dash">' +
        '<section class="kpis" aria-label="Indicadores do período" id="blk-kpis"></section>' +
        '<div class="dash-row">' +
        '<section class="cp-card" id="blk-chart" aria-labelledby="chart-title"></section>' +
        '<section class="cp-card" id="blk-act" aria-labelledby="act-title"></section>' +
        '</div>' +
        '<div id="blk-table"></div>' +
        '</div>';

      var $kpis = container.querySelector('#blk-kpis');
      var $chart = container.querySelector('#blk-chart');
      var $act = container.querySelector('#blk-act');
      var tableApi = NX.table.create(container.querySelector('#blk-table'));

      function period() { return NX.periodById(ctx.getPeriod()); }

      /* ----- KPIs ----- */
      function kpiLoading() {
        var h = '';
        for (var i = 0; i < 3; i++) {
          h += '<article class="cp-card kpi" aria-busy="true"><span class="skeleton" style="height:12px;width:45%"></span>' +
            '<span class="skeleton" style="height:26px;width:70%;margin-top:12px"></span>' +
            '<span class="skeleton" style="height:12px;width:55%;margin-top:14px"></span></article>';
        }
        $kpis.innerHTML = h;
      }
      function kpiReady() {
        var list = NX.kpisFor(viewId, period().id);
        var empty = ctx.estado === 'vazio';
        $kpis.innerHTML = list.map(function (k, i) {
          var dir = k.up ? 'trending-up' : 'trending-down';
          var delta = empty ? '' :
            '<p class="kpi__delta kpi__delta--' + (k.good ? 'good' : 'bad') + '"><strong>' + NX.icon(dir, 14) + k.delta +
            '</strong><span>vs. período anterior' + '<span class="sr-only">, ' + (k.good ? 'favorável' : 'desfavorável') + '</span></span></p>';
          return '<article class="cp-card kpi" aria-labelledby="kpi-' + i + '"><h2 class="kpi__label" id="kpi-' + i + '">' + esc(k.label) + '</h2>' +
            '<p class="kpi__value">' + (empty ? '—' : esc(k.text)) + '</p>' + (empty ? '<p class="kpi__delta">Sem dados no período</p>' : delta) + '</article>';
        }).join('');
      }
      function kpiError() {
        $kpis.innerHTML = '<article class="cp-card" style="grid-column:1/-1">' +
          stateBlock('error', 'triangle-alert', 'Não foi possível carregar os indicadores', 'Tente novamente em instantes.', true) + '</article>';
      }

      /* ----- Gráfico ----- */
      function chartHead(title, sub) {
        return '<div class="cp-card__head"><div><h2 class="cp-card__title" id="chart-title">' + esc(title) + '</h2>' +
          '<p class="cp-card__sub">' + esc(sub) + '</p></div></div>';
      }
      function chartLoading() {
        if (chartInst) { chartInst.destroy(); chartInst = null; }
        var hs = [46, 62, 54, 70, 66, 80, 74, 90, 84, 96, 88, 100], bars = '';
        hs.forEach(function (h) { bars += '<span class="skeleton" style="height:' + h + '%"></span>'; });
        $chart.setAttribute('aria-busy', 'true');
        $chart.innerHTML = chartHead(view.chart.title, 'Carregando…') + '<div class="skel-chart" role="status" aria-label="Carregando gráfico">' + bars + '</div>';
      }
      function chartReady() {
        $chart.removeAttribute('aria-busy');
        if (chartInst) { chartInst.destroy(); chartInst = null; }
        if (ctx.estado === 'vazio') {
          $chart.innerHTML = chartHead(view.chart.title, 'Valores em R$ mil · ' + period().label) +
            stateBlock('empty', 'chart-column', 'Sem dados no período', 'Não há movimentações para exibir no gráfico.');
          return;
        }
        var data = NX.chartFor(viewId, period().id);
        $chart.innerHTML = chartHead(data.title, 'Valores em R$ mil · ' + period().label) + '<div class="chart-host"></div>';
        chartInst = NX.chart.create($chart.querySelector('.chart-host'), data);
      }
      function chartError() {
        if (chartInst) { chartInst.destroy(); chartInst = null; }
        $chart.removeAttribute('aria-busy');
        $chart.innerHTML = chartHead(view.chart.title, 'Falha ao carregar') +
          stateBlock('error', 'triangle-alert', 'Não foi possível carregar o gráfico', 'Verifique sua conexão e tente novamente.', true);
      }

      /* ----- Atividades ----- */
      function actHead(sub) {
        return '<div class="cp-card__head"><div><h2 class="cp-card__title" id="act-title">Atividades recentes</h2>' +
          '<p class="cp-card__sub">' + esc(sub) + '</p></div></div>';
      }
      function actLoading() {
        $act.setAttribute('aria-busy', 'true');
        var h = '';
        for (var i = 0; i < 5; i++) {
          h += '<li style="display:grid;grid-template-columns:16px 1fr 40px;gap:12px;padding:12px 0"><span class="skeleton" style="height:16px"></span><span class="skeleton" style="height:28px"></span><span class="skeleton" style="height:12px"></span></li>';
        }
        $act.innerHTML = actHead('Carregando…') + '<ul role="status" aria-label="Carregando atividades">' + h + '</ul>';
      }
      function actReady() {
        $act.removeAttribute('aria-busy');
        var r = ctx.estado === 'vazio' ? { total: 0, items: [] } : NX.activitiesFor(viewId, period().id);
        if (!r.items.length) {
          $act.innerHTML = actHead(period().label) + stateBlock('empty', 'inbox', 'Nenhuma atividade', 'Não houve atividades neste período.');
          return;
        }
        $act.innerHTML = actHead(r.total + (r.total === 1 ? ' evento' : ' eventos') + ' · ' + period().label) +
          '<ul class="activity">' + r.items.map(function (a) {
            return '<li>' + NX.icon(a.icon, 16, 'tone-' + a.tone) + '<div class="activity__body"><p class="activity__title">' + esc(a.title) +
              '</p><p class="activity__meta">' + esc(a.meta) + '</p></div><span class="activity__time">' + esc(a.time) + '</span></li>';
          }).join('') + '</ul>';
      }
      function actError() {
        $act.removeAttribute('aria-busy');
        $act.innerHTML = actHead('Falha ao carregar') + stateBlock('error', 'triangle-alert', 'Não foi possível carregar as atividades', 'Tente novamente em instantes.', true);
      }

      /* ----- Orquestração por bloco ----- */
      var blocks = {
        kpis: { loading: kpiLoading, ready: kpiReady, error: kpiError },
        chart: { loading: chartLoading, ready: chartReady, error: chartError },
        act: { loading: actLoading, ready: actReady, error: actError },
        table: {
          loading: function () { tableApi.setState('loading'); },
          ready: function () {
            var rows = ctx.estado === 'vazio' ? { title: NX.tableFor(viewId, period().id).title, rows: [] } : NX.tableFor(viewId, period().id);
            tableApi.setData(rows, period().label);
          },
          error: function () {
            tableApi.setState('error', { onRetry: function () { retry('table'); }, periodLabel: period().label });
          }
        }
      };

      function loadBlock(name, myToken, delay) {
        blocks[name].loading();
        if (ctx.estado === 'carregando') return;
        setTimeout(function () {
          if (destroyed || myToken !== token) return;
          if (ctx.estado === 'erro' && forceError[name] !== false) { forceError[name] = true; blocks[name].error(); }
          else blocks[name].ready();
          done(name);
        }, delay);
      }
      var pending = 0, announceDone = false;
      function done() {
        pending--;
        if (pending <= 0 && announceDone) { ui.announce('Painel atualizado: ' + period().label + '.'); announceDone = false; }
      }

      function retry(name) {
        forceError[name] = false;
        var t = token;
        pending++;
        loadBlock(name, t, 500);
      }

      function refresh(announce) {
        token++;
        var t = token;
        announceDone = !!announce;
        pending = 4;
        Object.keys(blocks).forEach(function (n) { loadBlock(n, t, DELAYS[n]); });
      }

      container.addEventListener('click', function (e) {
        var b = e.target.closest('[data-retry]');
        if (!b) return;
        var host = b.closest('#blk-kpis, #blk-chart, #blk-act');
        if (host) retry(host.id.replace('blk-', ''));
      });

      var api = {
        refresh: refresh,
        destroy: function () {
          destroyed = true;
          if (chartInst) chartInst.destroy();
          if (NX.dashboard.current === api) NX.dashboard.current = null;
        },
        /** Exporta o conteúdo atual da tabela como CSV (separador ';', com BOM para o Excel). */
        exportCSV: function () {
          var rows = tableApi.getRows();
          var p = period();
          if (!rows.length) { ui.toast('Não há dados para exportar neste período.', 'circle-alert'); return; }
          var lines = [['ID', 'Cliente', 'Status', 'Valor (R$)', 'Data', 'Forma de pagamento']];
          rows.forEach(function (r) {
            lines.push([r.id, r.cliente, NX.status[r.status].label, r.valor.toFixed(2).replace('.', ','), NX.fmt.date(r.data), r.forma]);
          });
          var csv = '﻿' + lines.map(function (l) {
            return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';');
          }).join('\r\n');
          var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
          var url = URL.createObjectURL(blob);
          var a = d.createElement('a');
          a.href = url;
          a.download = viewId + '-' + p.id + '.csv';
          d.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
          ui.toast('Exportação concluída: ' + a.download, 'download');
        }
      };
      NX.dashboard.current = api;
      refresh(false);
      return api;
    },

    /** Telas de módulos fora do escopo da demonstração: estado vazio simples e honesto. */
    renderPlaceholder: function (container, route) {
      container.innerHTML =
        '<div class="page-head"><div class="page-head__text"><h1 id="page-title" tabindex="-1">' + esc(route.title) + '</h1>' +
        '<p class="page-head__sub">' + esc(route.crumbs.join(' · ')) + '</p></div></div>' +
        '<section class="cp-card dash" style="font-size:var(--fs-13)">' +
        '<div class="state">' + NX.icon(route.icon || 'layout-dashboard', 24) +
        '<p class="state__title">Tela fora do escopo desta demonstração</p>' +
        '<p class="state__text">O PROMPT.md aprova o dashboard financeiro, as tabelas de dados e os gráficos. Esta seção existe na navegação, mas não tem conteúdo especificado.</p>' +
        '<a class="btn btn--primary" href="#/painel/visao-geral">' + NX.icon('layout-dashboard', 16) + '<span>Ir para o Painel</span></a></div></section>';
    }
  };
})(window, document);
