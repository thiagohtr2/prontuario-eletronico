/* =========================================================
   Gráfico de barras agrupadas (SVG puro) — família Compact Pro
   Série 1 na primária, série 2 no destaque; grade em borda a 50%;
   tooltip no hover/toque/teclado; legenda clicável liga/desliga séries;
   tabela alternativa para leitores de tela.
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const esc = N.esc;
  let measureCtx = null;
  function textWidth(s) {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = '12px ' + getComputedStyle(document.body).fontFamily;
    return measureCtx.measureText(s).width;
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const f = raw / p;
    const n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * p;
  }
  function ticksFor(max, count) {
    if (!(max > 0)) return [0, 1];
    const step = niceStep(max / count);
    const top = Math.ceil(max / step) * step;
    const out = [];
    for (let v = 0; v <= top + step / 1000; v += step) out.push(Math.round(v * 1000) / 1000);
    return out;
  }

  class BarChart {
    constructor(mount, opts) {
      this.o = opts;
      this.id = opts.id;
      this.state = 'loading';
      this.data = null;
      this.active = -1;
      this.mount = mount;
      mount.innerHTML =
        '<div class="chart-area"></div>' +
        '<div class="chart-legend" role="group" aria-label="Séries do gráfico"></div>' +
        '<p class="sr-only" aria-live="polite" data-live></p>' +
        '<div class="sr-only" data-table></div>';
      this.area = mount.querySelector('.chart-area');
      this.legend = mount.querySelector('.chart-legend');
      this.live = mount.querySelector('[data-live]');
      this.tableHost = mount.querySelector('[data-table]');
      this.legend.addEventListener('click', (e) => {
        const b = e.target.closest('[data-series]');
        if (!b || !this.data) return;
        const s = this.data.series[+b.dataset.series];
        s.visible = !s.visible;
        b.setAttribute('aria-pressed', String(s.visible));
        this.draw();
      });
      this.ro = new ResizeObserver(() => { if (this.state === 'ready') { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(() => this.draw()); } });
      this.ro.observe(this.area);
      this.setState('loading');
    }

    setState(state, info) {
      this.state = state;
      this.mount.closest('.card').setAttribute('aria-busy', String(state === 'loading'));
      if (state === 'loading') {
        this.area.innerHTML = '<div class="chart-skel" aria-hidden="true">' + [46, 62, 38, 70, 55, 80, 66, 50].map((h) => '<span style="height:' + h + '%"></span>').join('') + '</div><span class="sr-only">Carregando gráfico…</span>';
        this.legend.innerHTML = '';
        this.tableHost.innerHTML = '';
      } else if (state === 'empty') {
        this.area.innerHTML = '<div class="state">' + N.icon('inbox') + '<p class="state-title">Sem dados para o período</p><p class="state-text">Não há movimentação registrada para exibir no gráfico.</p></div>';
        this.legend.innerHTML = '';
        this.tableHost.innerHTML = '';
      } else if (state === 'error') {
        this.area.innerHTML = '<div class="state state--error" role="alert">' + N.icon('alert') + '<p class="state-title">Não foi possível carregar o gráfico.</p><p class="state-text">Tente novamente em instantes.</p><button type="button" class="btn btn--outline" data-retry>' + N.icon('refresh', { size: 16 }) + 'Tentar novamente</button></div>';
        this.area.querySelector('[data-retry]').addEventListener('click', () => info && info.onRetry && info.onRetry());
        this.legend.innerHTML = '';
        this.tableHost.innerHTML = '';
      }
    }

    /** data: {categories:[], series:[{name, values}], highlight:[bool], format(v), axisFormat(v), highlightLabel} */
    setData(data) {
      const prev = this.data;
      data.series.forEach((s, i) => { s.visible = prev && prev.series[i] && prev.series[i].name === s.name ? prev.series[i].visible : true; });
      this.data = data;
      this.state = 'ready';
      this.mount.closest('.card').setAttribute('aria-busy', 'false');
      this.area.innerHTML =
        '<div class="chart" tabindex="0" role="group" aria-roledescription="gráfico de barras" aria-describedby="' + this.id + '-help"></div>' +
        '<p class="sr-only" id="' + this.id + '-help">Use as setas para a esquerda e para a direita para percorrer os meses.</p>';
      this.box = this.area.querySelector('.chart');
      this.box.setAttribute('aria-label', this.summary());
      this.bindPointer();
      this.legend.innerHTML = data.series.map((s, i) =>
        '<button type="button" class="legend-item" data-series="' + i + '" aria-pressed="' + s.visible + '"><span class="swatch s' + i + '" aria-hidden="true"></span><span class="legend-name">' + esc(s.name) + '</span></button>'
      ).join('') + (data.highlight.some((h) => h) && !data.highlight.every((h) => h)
        ? '<span class="legend-note"><span class="swatch swatch--band" aria-hidden="true"></span>' + esc(data.highlightLabel || 'Período selecionado') + '</span>' : '');
      this.tableHost.innerHTML = '<table><caption>' + esc(this.o.title) + ' — dados do gráfico</caption><thead><tr><th scope="col">Mês</th>' +
        data.series.map((s) => '<th scope="col">' + esc(s.name) + '</th>').join('') + '</tr></thead><tbody>' +
        data.categories.map((c, i) => '<tr><th scope="row">' + esc(c) + '</th>' + data.series.map((s) => '<td>' + esc(data.format(s.values[i])) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table>';
      this.active = -1;
      this.draw();
    }

    summary() {
      const d = this.data;
      const parts = d.series.map((s) => {
        let mi = 0;
        s.values.forEach((v, i) => { if (v > s.values[mi]) mi = i; });
        const total = s.values.reduce((a, b) => a + b, 0);
        return s.name + ': total ' + d.format(total) + ', maior valor em ' + d.categories[mi] + ' (' + d.format(s.values[mi]) + ')';
      });
      return this.o.title + ', ' + d.categories[0] + ' a ' + d.categories[d.categories.length - 1] + '. ' + parts.join('; ') + '.';
    }

    draw() {
      if (this.state !== 'ready' || !this.box) return;
      const d = this.data;
      const w = Math.floor(this.box.clientWidth);
      if (!w) return;
      const narrow = w < 480;
      const H = narrow ? 220 : 260;
      const vis = d.series.map((s, i) => ({ s, i })).filter((x) => x.s.visible);
      const max = Math.max(0, ...vis.flatMap((x) => x.s.values));
      const ticks = ticksFor(max, narrow ? 3 : 4);
      const top = ticks[ticks.length - 1];
      const labels = ticks.map(d.axisFormat);
      const lw = Math.max(...labels.map(textWidth));
      const m = { l: Math.ceil(lw) + 10, r: 4, t: 10, b: 26 };
      const pw = Math.max(10, w - m.l - m.r);
      const ph = H - m.t - m.b;
      const n = d.categories.length;
      const band = pw / n;
      const maxLabel = Math.max(...d.categories.map(textWidth));
      const step = Math.max(1, Math.ceil((maxLabel + 10) / band));
      const y = (v) => m.t + ph - (top ? (v / top) * ph : 0);
      const k = Math.max(1, vis.length);
      const groupW = band * 0.68;
      const bw = Math.min(26, groupW / k);
      const gx = (i) => m.l + band * i + (band - bw * k) / 2;
      let svg = '<svg width="' + w + '" height="' + H + '" viewBox="0 0 ' + w + ' ' + H + '" aria-hidden="true" focusable="false">';
      // faixa do período selecionado
      d.highlight.forEach((h, i) => {
        if (h && !d.highlight.every((x) => x)) svg += '<rect class="band" x="' + (m.l + band * i) + '" y="' + m.t + '" width="' + band + '" height="' + ph + '"/>';
      });
      // grade + eixo Y
      ticks.forEach((t, i) => {
        const yy = Math.round(y(t)) + 0.5;
        svg += '<line class="' + (i === 0 ? 'baseline' : 'grid') + '" x1="' + m.l + '" x2="' + (w - m.r) + '" y1="' + yy + '" y2="' + yy + '"/>';
        svg += '<text x="' + (m.l - 8) + '" y="' + yy + '" text-anchor="end" dominant-baseline="middle">' + esc(labels[i]) + '</text>';
      });
      // coluna ativa
      if (this.active >= 0) svg += '<rect class="hover-col" x="' + (m.l + band * this.active) + '" y="' + m.t + '" width="' + band + '" height="' + ph + '"/>';
      // barras
      for (let i = 0; i < n; i++) {
        vis.forEach((x, j) => {
          const v = x.s.values[i];
          const yy = y(v);
          const hh = Math.max(0, m.t + ph - yy);
          svg += '<rect class="bar s' + x.i + '" x="' + (gx(i) + j * bw).toFixed(2) + '" y="' + yy.toFixed(2) + '" width="' + Math.max(1, bw - 1).toFixed(2) + '" height="' + hh.toFixed(2) + '"/>';
        });
      }
      // eixo X (menos rótulos quando estreito; sempre inclui o último mês)
      for (let i = 0; i < n; i++) {
        const show = (n - 1 - i) % step === 0;
        if (!show) continue;
        svg += '<text x="' + (m.l + band * i + band / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(d.categories[i]) + '</text>';
      }
      // áreas de interação
      for (let i = 0; i < n; i++) svg += '<rect class="hit" data-i="' + i + '" x="' + (m.l + band * i) + '" y="' + m.t + '" width="' + band + '" height="' + ph + '"/>';
      if (!vis.length) svg += '<text x="' + (m.l + pw / 2) + '" y="' + (m.t + ph / 2) + '" text-anchor="middle">Nenhuma série selecionada</text>';
      svg += '</svg>';
      const tipOpen = this.active >= 0;
      this.box.innerHTML = svg + '<div class="chart-tip"' + (tipOpen ? '' : ' hidden') + '></div>';
      this.geom = { m, band, w };
      if (tipOpen) this.renderTip();
    }

    renderTip() {
      const tip = this.box.querySelector('.chart-tip');
      const d = this.data;
      const i = this.active;
      tip.innerHTML = '<p class="tip-title">' + esc(d.categories[i]) + (d.highlight[i] && !d.highlight.every((h) => h) ? ' · período selecionado' : '') + '</p>' +
        d.series.filter((s) => s.visible).map((s) => '<p class="tip-row"><span class="swatch s' + d.series.indexOf(s) + '" aria-hidden="true"></span>' + esc(s.name) + '<strong>' + esc(d.format(s.values[i])) + '</strong></p>').join('');
      tip.hidden = false;
      const g = this.geom;
      const tw = tip.offsetWidth;
      const cx = g.m.l + g.band * i + g.band / 2;
      let left = cx + 12;
      if (left + tw > g.w) left = cx - tw - 12;
      tip.style.left = Math.max(0, Math.min(left, g.w - tw)) + 'px';
      tip.style.top = '4px';
    }

    setActive(i, announce) {
      const n = this.data.categories.length;
      this.active = i < 0 ? -1 : Math.max(0, Math.min(n - 1, i));
      this.draw();
      if (announce && this.active >= 0) {
        const d = this.data;
        this.live.textContent = d.categories[this.active] + ': ' + d.series.filter((s) => s.visible).map((s) => s.name + ' ' + d.format(s.values[this.active])).join(', ');
      }
    }

    bindPointer() {
      const box = this.box;
      const idxAt = (e) => {
        const g = this.geom;
        if (!g) return -1;
        const r = box.getBoundingClientRect();
        const x = e.clientX - r.left - g.m.l;
        const i = Math.floor(x / g.band);
        return i >= 0 && i < this.data.categories.length ? i : -1;
      };
      box.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { const i = idxAt(e); if (i !== this.active) this.setActive(i); } });
      box.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') this.setActive(-1); });
      box.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { const i = idxAt(e); this.setActive(i === this.active ? -1 : i); } });
      box.addEventListener('keydown', (e) => {
        const n = this.data.categories.length;
        let i = this.active;
        if (e.key === 'ArrowRight') i = i < 0 ? 0 : i + 1;
        else if (e.key === 'ArrowLeft') i = i < 0 ? n - 1 : i - 1;
        else if (e.key === 'Home') i = 0;
        else if (e.key === 'End') i = n - 1;
        else if (e.key === 'Escape') { if (this.active >= 0) { e.stopPropagation(); this.setActive(-1); } return; }
        else return;
        e.preventDefault();
        this.setActive(i, true);
      });
      box.addEventListener('blur', () => this.setActive(-1));
      document.addEventListener('pointerdown', (e) => { if (this.active >= 0 && !box.contains(e.target)) this.setActive(-1); });
    }

    destroy() { this.ro.disconnect(); }
  }

  N.BarChart = BarChart;
})();
