/* ==========================================================================
   Gráfico de barras agrupadas em SVG puro (sem bibliotecas).
   Compact Pro: grade discreta, séries 1 = primary / 2 = destaque, legenda
   clicável abaixo, tooltip (hover/toque/teclado), tabela alternativa oculta.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui;
  var esc = NX.fmt.esc;

  function niceScale(max, maxTicks) {
    if (!(max > 0)) max = 1;
    var cands = [1, 2, 2.5, 5, 10];
    var mag = Math.pow(10, Math.floor(Math.log10(max / maxTicks)));
    for (var e = 0; e < 4; e++) {
      for (var i = 0; i < cands.length; i++) {
        var step = cands[i] * mag * Math.pow(10, e);
        if (Math.ceil(max / step) <= maxTicks) {
          var top = Math.ceil(max / step) * step;
          var ticks = [];
          for (var v = 0; v <= top + 1e-9; v += step) ticks.push(v);
          return { top: top, ticks: ticks };
        }
      }
    }
    return { top: max, ticks: [0, max] };
  }

  function barPath(x, y, wd, h, r) {
    r = Math.min(r, wd / 2, h);
    if (h <= 0) return '';
    return 'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
      'H' + (x + wd - r) + 'Q' + (x + wd) + ',' + y + ' ' + (x + wd) + ',' + (y + r) + 'V' + (y + h) + 'Z';
  }

  /**
   * data: { title, unit, series:[{id,name,values[]}], cats:[{short,long}] }
   */
  NX.chart = {
    create: function (container, data) {
      var hidden = {};
      var active = -1;
      var geom = null;
      var uid = 'ch' + Math.random().toString(36).slice(2, 7);

      container.innerHTML =
        '<figure class="chart">' +
        '<div class="chart__plot" tabindex="0" role="group"><svg aria-hidden="true" focusable="false"></svg>' +
        '<div class="chart-tip" role="presentation" hidden></div></div>' +
        '<div class="legend" role="group" aria-label="Séries do gráfico (ative ou desative)"></div>' +
        '<p class="sr-only" id="' + uid + '-live" aria-live="polite"></p>' +
        '<table class="sr-only"></table>' +
        '</figure>';

      var plot = container.querySelector('.chart__plot');
      var svg = plot.querySelector('svg');
      var tip = plot.querySelector('.chart-tip');
      var legend = container.querySelector('.legend');
      var live = container.querySelector('#' + uid + '-live');
      var table = container.querySelector('table');

      function visible() { return data.series.filter(function (s) { return !hidden[s.id]; }); }

      function summary() {
        var parts = data.series.map(function (s) {
          var max = Math.max.apply(null, s.values), i = s.values.indexOf(max);
          return s.name + ': máximo de ' + NX.fmt.milBRL(max) + ' em ' + data.cats[i].long;
        });
        return 'Gráfico de barras agrupadas, ' + data.title + ', em ' + data.unit + ', de ' +
          data.cats[0].long + ' a ' + data.cats[data.cats.length - 1].long + '. ' + parts.join('; ') +
          '. Use as setas para percorrer os meses.';
      }

      function buildLegend() {
        legend.innerHTML = '';
        data.series.forEach(function (s, i) {
          var b = d.createElement('button');
          b.type = 'button';
          b.className = 'legend__item';
          b.setAttribute('aria-pressed', hidden[s.id] ? 'false' : 'true');
          b.innerHTML = '<span class="swatch swatch--' + (i + 1) + '"></span><span>' + esc(s.name) + '</span>';
          b.addEventListener('click', function () {
            var vis = visible();
            if (!hidden[s.id] && vis.length === 1) {
              ui.announce('Pelo menos uma série precisa ficar visível.');
              return;
            }
            hidden[s.id] = !hidden[s.id];
            b.setAttribute('aria-pressed', hidden[s.id] ? 'false' : 'true');
            ui.announce(s.name + (hidden[s.id] ? ' oculta' : ' visível') + ' no gráfico.');
            draw();
            updateLegendState();
          });
          legend.appendChild(b);
        });
        updateLegendState();
      }

      function updateLegendState() {
        var vis = visible();
        Array.prototype.forEach.call(legend.children, function (b, i) {
          var s = data.series[i];
          var last = !hidden[s.id] && vis.length === 1;
          if (last) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled');
        });
      }

      function buildTable() {
        var h = '<caption>' + esc(data.title) + ' (' + esc(data.unit) + ')</caption><thead><tr><th scope="col">Mês</th>';
        data.series.forEach(function (s) { h += '<th scope="col">' + esc(s.name) + '</th>'; });
        h += '</tr></thead><tbody>';
        data.cats.forEach(function (c, i) {
          h += '<tr><th scope="row">' + esc(c.long) + '</th>';
          data.series.forEach(function (s) { h += '<td>' + NX.fmt.milBRL(s.values[i]) + '</td>'; });
          h += '</tr>';
        });
        table.innerHTML = h + '</tbody>';
      }

      function draw() {
        var W = Math.max(240, Math.floor(plot.clientWidth));
        var small = W < 480;
        var H = small ? 224 : 288;
        var vis = visible();
        var max = 0;
        vis.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
        var sc = niceScale(max, small ? 4 : 5);
        var labelChars = String(NX.fmt.mil(sc.top)).length;
        var left = 12 + labelChars * 7;
        var right = 6, top = 10, bottom = 28;
        var pw = W - left - right, ph = H - top - bottom;
        var n = data.cats.length, gw = pw / n;
        var step = Math.max(1, Math.ceil(40 / gw));
        var k = vis.length;
        var usable = gw * 0.72;
        var bw = Math.max(3, Math.min(28, Math.floor((usable - (k - 1) * 3) / k)));
        var groupW = k * bw + (k - 1) * 3;

        geom = { W: W, H: H, left: left, top: top, pw: pw, ph: ph, gw: gw, n: n };

        var s = '';
        sc.ticks.forEach(function (t) {
          var y = Math.round(top + ph - (t / sc.top) * ph) + 0.5;
          if (t > 0) s += '<line class="grid-line" x1="' + left + '" x2="' + (W - right) + '" y1="' + y + '" y2="' + y + '"/>';
          s += '<text x="' + (left - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + NX.fmt.mil(t) + '</text>';
        });
        for (var i = 0; i < n; i++) {
          s += '<rect class="band" data-i="' + i + '" x="' + (left + i * gw) + '" y="' + top + '" width="' + gw + '" height="' + ph + '"/>';
        }
        for (i = 0; i < n; i++) {
          var gx = left + i * gw + (gw - groupW) / 2;
          var idx = 0;
          data.series.forEach(function (ser, si) {
            if (hidden[ser.id]) return;
            var h = (ser.values[i] / sc.top) * ph;
            var x = Math.round(gx + idx * (bw + 3));
            s += '<path class="bar-s' + (si + 1) + '" d="' + barPath(x, top + ph - h, bw, h, 2) + '"/>';
            idx++;
          });
        }
        var baseY = top + ph + 0.5;
        s += '<line class="axis-line" x1="' + left + '" x2="' + (W - right) + '" y1="' + baseY + '" y2="' + baseY + '"/>';
        for (i = 0; i < n; i++) {
          if ((n - 1 - i) % step !== 0) continue;
          s += '<text class="x-label" data-i="' + i + '" x="' + (left + (i + 0.5) * gw) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(data.cats[i].short) + '</text>';
        }
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('width', W);
        svg.setAttribute('height', H);
        svg.innerHTML = s;
        if (active >= 0) showTip(active, false);
      }

      function tipHTML(i) {
        var h = '<div class="chart-tip__title">' + esc(data.cats[i].long) + '</div>';
        data.series.forEach(function (ser, si) {
          if (hidden[ser.id]) return;
          h += '<div class="chart-tip__row"><span class="swatch swatch--' + (si + 1) + '"></span><span>' + esc(ser.name) +
            '</span><b>' + NX.fmt.milBRL(ser.values[i]) + '</b></div>';
        });
        return h;
      }

      function tipText(i) {
        var t = data.cats[i].long;
        data.series.forEach(function (ser) {
          if (!hidden[ser.id]) t += ', ' + ser.name + ' ' + NX.fmt.milBRL(ser.values[i]);
        });
        return t;
      }

      function showTip(i, announce) {
        if (i < 0 || i >= geom.n) return hideTip();
        active = i;
        tip.hidden = false;
        tip.innerHTML = tipHTML(i);
        var tw = tip.offsetWidth, th = tip.offsetHeight;
        var cx = geom.left + (i + 0.5) * geom.gw;
        var x = cx + 14;
        if (x + tw > geom.W) x = cx - tw - 14;
        x = Math.max(0, Math.min(x, geom.W - tw));
        var y = Math.max(0, Math.min(geom.top + 6, geom.H - th));
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        Array.prototype.forEach.call(svg.querySelectorAll('.band, .x-label'), function (el) {
          el.classList.toggle('is-on', +el.getAttribute('data-i') === i);
        });
        if (announce) live.textContent = tipText(i);
      }

      function hideTip() {
        active = -1;
        tip.hidden = true;
        Array.prototype.forEach.call(svg.querySelectorAll('.is-on'), function (el) { el.classList.remove('is-on'); });
      }

      function idxFromEvent(e) {
        var r = plot.getBoundingClientRect();
        var x = e.clientX - r.left;
        if (x < geom.left || x > geom.left + geom.pw) return -1;
        return Math.min(geom.n - 1, Math.max(0, Math.floor((x - geom.left) / geom.gw)));
      }

      plot.setAttribute('aria-label', summary());
      plot.addEventListener('pointermove', function (e) {
        var i = idxFromEvent(e);
        if (i < 0) hideTip(); else if (i !== active) showTip(i, false);
      });
      plot.addEventListener('pointerdown', function (e) {
        var i = idxFromEvent(e);
        if (i < 0 || i === active && e.pointerType !== 'mouse') hideTip(); else showTip(i, false);
      });
      plot.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'mouse' && d.activeElement !== plot) hideTip();
      });
      plot.addEventListener('keydown', function (e) {
        var i = active < 0 ? geom.n - 1 : active;
        if (e.key === 'ArrowRight') i = Math.min(geom.n - 1, active < 0 ? 0 : i + 1);
        else if (e.key === 'ArrowLeft') i = Math.max(0, active < 0 ? geom.n - 1 : i - 1);
        else if (e.key === 'Home') i = 0;
        else if (e.key === 'End') i = geom.n - 1;
        else if (e.key === 'Escape') { hideTip(); return; }
        else return;
        e.preventDefault();
        showTip(i, true);
      });
      plot.addEventListener('focus', function () {
        if (active < 0 && plot.matches(':focus-visible')) showTip(geom.n - 1, true);
      });
      plot.addEventListener('blur', function () { hideTip(); });
      d.addEventListener('pointerdown', onDocDown, true);
      function onDocDown(e) { if (!container.isConnected) { d.removeEventListener('pointerdown', onDocDown, true); return; } if (!plot.contains(e.target)) hideTip(); }

      var ro = null, raf = 0, lastW = 0;
      if (w.ResizeObserver) {
        ro = new ResizeObserver(function () {
          if (Math.floor(plot.clientWidth) === lastW) return;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function () { lastW = Math.floor(plot.clientWidth); draw(); });
        });
        ro.observe(plot);
      }

      buildLegend();
      buildTable();
      draw();
      lastW = Math.floor(plot.clientWidth);

      return {
        destroy: function () {
          if (ro) ro.disconnect();
          d.removeEventListener('pointerdown', onDocDown, true);
        }
      };
    }
  };
})(window, document);
