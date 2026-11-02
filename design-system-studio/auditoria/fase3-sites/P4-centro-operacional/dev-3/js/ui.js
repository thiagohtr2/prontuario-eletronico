/* Utilitários de interface: ícones (contorno, estilo Lucide), formatação pt-BR,
   mensagens de estado (carregando/vazio/erro) e cartão de indicador com sparkline. */
(function () {
  'use strict';

  var ICONES = {
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    timer: '<path d="M10 2h4"/><path d="M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    up: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
    down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    flat: '<path d="M5 12h14"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    play: '<path d="M6 4l14 8-14 8z"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    xcircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
  };

  function icon(nome, classe) {
    return '<svg class="icon' + (classe ? ' ' + classe : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONES[nome] || '') + '</svg>';
  }

  function hydrateIcons(raiz) {
    (raiz || document).querySelectorAll('[data-icon]').forEach(function (el) {
      el.innerHTML = icon(el.getAttribute('data-icon'));
    });
  }

  // Formatação pt-BR
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var decimal1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var inteiro = new Intl.NumberFormat('pt-BR');
  var horaFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  function formatarValor(v, formato) {
    if (formato === 'mil') { return 'R$ ' + decimal1.format(v) + ' mil'; }
    if (formato === 'pct') { return decimal1.format(v) + '%'; }
    return inteiro.format(v);
  }
  function formatarVariacao(v) {
    var sinal = v > 0 ? '+' : v < 0 ? '−' : '';
    return sinal + decimal1.format(Math.abs(v)) + '%';
  }
  function formatarBRL(v) { return brl.format(v); }
  function formatarData(iso) { var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function formatarHora(d) { return horaFmt.format(d); }
  // Dia i (0 = 20/10) da série de 14 dias que termina em 02/11/2026
  function diaMes(i) {
    var d = new Date(2026, 9, 20 + i);
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
  }

  function esc(texto) {
    return String(texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var SEVERIDADE = {
    critico: { rotulo: 'Crítico', tom: 'error', icone: 'xcircle' },
    atencao: { rotulo: 'Atenção', tom: 'warning', icone: 'alert' },
    info: { rotulo: 'Informação', tom: 'info', icone: 'info' },
    normal: { rotulo: 'Normal', tom: 'success', icone: 'check' }
  };

  var STATUS = {
    concluido: { rotulo: 'Concluído', tom: 'success', icone: 'check' },
    andamento: { rotulo: 'Em andamento', tom: 'info', icone: 'clock' },
    pendente: { rotulo: 'Pendente', tom: 'warning', icone: 'alert' },
    cancelado: { rotulo: 'Cancelado', tom: 'error', icone: 'xcircle' }
  };

  // Mensagem de estado dentro de uma caixa (.state). opcoes: { tipo, acao, aoAcionar }
  function mostrarMensagem(caixa, texto, opcoes) {
    var erro = !!(opcoes && opcoes.tipo === 'erro');
    caixa.innerHTML = '';
    caixa.setAttribute('role', erro ? 'alert' : 'status');
    var p = document.createElement('p');
    p.className = 'state-text';
    p.textContent = texto;
    caixa.appendChild(p);
    if (opcoes && opcoes.acao) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.textContent = opcoes.acao;
      b.addEventListener('click', opcoes.aoAcionar);
      caixa.appendChild(b);
    }
    caixa.hidden = false;
  }

  function ocultarMensagem(caixa) {
    caixa.hidden = true;
    caixa.innerHTML = '';
  }

  function skeletonKpis(n) {
    var html = '';
    for (var i = 0; i < n; i++) { html += '<div class="kpi is-skel" aria-hidden="true"></div>'; }
    return html;
  }

  function skeletonLinhas(n) {
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<tr class="skel-row" aria-hidden="true"><td></td><td><span class="skel-bar"></span></td><td><span class="skel-bar short"></span></td><td></td><td><span class="skel-bar short"></span></td><td></td></tr>';
    }
    return html;
  }

  // Sparkline em SVG (linha neutra, sem decoração)
  var LARGURA = 200;
  var ALTURA = 36;

  function sparkHtml(k) {
    var s = k.serie;
    var min = Math.min.apply(null, s);
    var max = Math.max.apply(null, s);
    var faixa = (max - min) || 1;
    var pontos = s.map(function (v, i) {
      var x = (i / (s.length - 1)) * LARGURA;
      var y = ALTURA - 3 - ((v - min) / faixa) * (ALTURA - 6);
      return x.toFixed(2) + ',' + y.toFixed(2);
    }).join(' ');
    var resumo = 'Tendência dos últimos 14 dias: de ' + formatarValor(s[0], k.formato) +
      ' para ' + formatarValor(s[s.length - 1], k.formato) + '. Setas para ver dia a dia.';
    return '<div class="spark" role="img" tabindex="0" aria-label="' + esc(resumo) + '" data-spark="' + esc(k.id) + '">' +
      '<svg viewBox="0 0 ' + LARGURA + ' ' + ALTURA + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<polyline points="' + pontos + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      '</svg><span class="spark-tip" hidden></span></div>';
  }

  // Tooltip com valores: ponteiro, foco e setas ←/→
  function ligarSpark(el, k) {
    var s = k.serie;
    var n = s.length;
    var idx = n - 1;
    var tip = el.querySelector('.spark-tip');

    function mostrar(i) {
      idx = i;
      var pct = (i / (n - 1)) * 100;
      tip.textContent = diaMes(i) + ': ' + formatarValor(s[i], k.formato);
      tip.style.left = Math.min(Math.max(pct, 14), 86) + '%';
      tip.hidden = false;
    }
    function esconder() { tip.hidden = true; }

    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var f = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      mostrar(Math.round(f * (n - 1)));
    });
    el.addEventListener('pointerleave', esconder);
    el.addEventListener('focus', function () { mostrar(idx); });
    el.addEventListener('blur', esconder);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        var d = e.key === 'ArrowLeft' ? -1 : 1;
        mostrar(Math.min(Math.max(idx + d, 0), n - 1));
      }
    });
  }

  // Cartão de indicador (família Compact Pro)
  function kpiHtml(k) {
    var tom = k.variacao > 0 ? 'var-up' : k.variacao < 0 ? 'var-down' : 'var-flat';
    var seta = k.variacao > 0 ? 'up' : k.variacao < 0 ? 'down' : 'flat';
    var sentido = k.variacao > 0 ? 'alta' : k.variacao < 0 ? 'queda' : 'sem variação';
    return '<article class="kpi" data-kpi="' + esc(k.id) + '">' +
      '<div class="kpi-head"><h3 class="kpi-label">' + esc(k.rotulo) + '</h3>' + icon(k.icone) + '</div>' +
      '<p class="kpi-value">' + esc(k.valor) + '</p>' +
      '<p class="kpi-var"><span class="var ' + tom + '">' + icon(seta) +
      '<span>' + formatarVariacao(k.variacao) + '</span><span class="sr-only"> (' + sentido + ')</span></span>' +
      '<span>' + esc(k.comparativo) + '</span></p>' +
      sparkHtml(k) +
      '<button type="button" class="btn btn-link" data-relatorio="' + esc(k.id) + '">Ver relatório</button>' +
      '</article>';
  }

  window.CentroUI = {
    icon: icon,
    hydrateIcons: hydrateIcons,
    formatarValor: formatarValor,
    formatarVariacao: formatarVariacao,
    formatarBRL: formatarBRL,
    formatarData: formatarData,
    formatarHora: formatarHora,
    diaMes: diaMes,
    esc: esc,
    SEVERIDADE: SEVERIDADE,
    STATUS: STATUS,
    mostrarMensagem: mostrarMensagem,
    ocultarMensagem: ocultarMensagem,
    skeletonKpis: skeletonKpis,
    skeletonLinhas: skeletonLinhas,
    kpiHtml: kpiHtml,
    ligarSpark: ligarSpark
  };
})();
