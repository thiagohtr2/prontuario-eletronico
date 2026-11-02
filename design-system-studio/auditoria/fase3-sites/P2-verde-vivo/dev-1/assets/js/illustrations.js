/* Ilustrações botânicas vetoriais (placeholders), geradas em SVG.
   Todas as cores vêm de classes CSS ligadas aos tokens (pages.css).
   Cada planta é desenhada numa caixa local de 200 × 240, com o vaso na base. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  function r(n) { return Math.round(n * 10) / 10; }
  function qpt(p0, c, p1, t) {
    var u = 1 - t;
    return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
  }
  function qang(p0, c, p1, t) {
    var u = 1 - t;
    var dx = 2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
    var dy = 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  function q(p0, c, p1) { return 'M' + r(p0[0]) + ' ' + r(p0[1]) + 'Q' + r(c[0]) + ' ' + r(c[1]) + ' ' + r(p1[0]) + ' ' + r(p1[1]); }

  /* Formatos de folha: base em (0,0), ponta em (0,-len) */
  function leafD(len, w, shape) {
    var h = w / 2;
    switch (shape) {
      case 'heart':
        return 'M0 0C' + r(h * 1.5) + ' ' + r(len * 0.14) + ' ' + r(h * 1.3) + ' ' + r(-len * 0.8) + ' 0 ' + r(-len) +
          'C' + r(-h * 1.3) + ' ' + r(-len * 0.8) + ' ' + r(-h * 1.5) + ' ' + r(len * 0.14) + ' 0 0Z';
      case 'fiddle':
        return 'M0 0C' + r(h * 0.5) + ' ' + r(-len * 0.1) + ' ' + r(h * 1.35) + ' ' + r(-len * 0.5) + ' ' + r(h * 0.85) + ' ' + r(-len * 0.9) +
          'C' + r(h * 0.5) + ' ' + r(-len * 1.04) + ' ' + r(-h * 0.5) + ' ' + r(-len * 1.04) + ' ' + r(-h * 0.85) + ' ' + r(-len * 0.9) +
          'C' + r(-h * 1.35) + ' ' + r(-len * 0.5) + ' ' + r(-h * 0.5) + ' ' + r(-len * 0.1) + ' 0 0Z';
      case 'oval':
        return 'M0 0C' + r(h * 1.33) + ' ' + r(-len * 0.04) + ' ' + r(h * 1.33) + ' ' + r(-len * 0.96) + ' 0 ' + r(-len) +
          'C' + r(-h * 1.33) + ' ' + r(-len * 0.96) + ' ' + r(-h * 1.33) + ' ' + r(-len * 0.04) + ' 0 0Z';
      case 'blade':
        return 'M' + r(-h) + ' 0C' + r(-h) + ' ' + r(-len * 0.55) + ' ' + r(-h * 0.45) + ' ' + r(-len * 0.88) + ' 0 ' + r(-len) +
          'C' + r(h * 0.45) + ' ' + r(-len * 0.88) + ' ' + r(h) + ' ' + r(-len * 0.55) + ' ' + r(h) + ' 0Z';
      default: // lanceolada
        return 'M0 0C' + r(h * 1.25) + ' ' + r(-len * 0.22) + ' ' + r(h * 1.1) + ' ' + r(-len * 0.72) + ' 0 ' + r(-len) +
          'C' + r(-h * 1.1) + ' ' + r(-len * 0.72) + ' ' + r(-h * 1.25) + ' ' + r(-len * 0.22) + ' 0 0Z';
    }
  }
  function leaf(x, y, len, w, rot, cls, o) {
    o = o || {};
    var s = '<g transform="translate(' + r(x) + ' ' + r(y) + ') rotate(' + r(rot) + ')"><path class="vv-' + cls + '" d="' + leafD(len, w, o.shape) + '"/>';
    if (o.rib !== false) s += '<path class="vv-rib" d="M0 ' + r(-len * 0.06) + 'L0 ' + r(-len * 0.86) + '"/>';
    if (o.extra) s += o.extra(len, w);
    return s + '</g>';
  }
  function slits(len, w) {
    var s = '';
    [0.3, 0.5, 0.7].forEach(function (k) {
      var y = -len * k;
      s += '<path class="vv-slit" d="M' + r(w * 0.08) + ' ' + r(y) + 'L' + r(w * 0.46) + ' ' + r(y - len * 0.1) + '"/>';
      s += '<path class="vv-slit" d="M' + r(-w * 0.08) + ' ' + r(y) + 'L' + r(-w * 0.46) + ' ' + r(y - len * 0.1) + '"/>';
    });
    return s;
  }
  function stripes(cls) {
    return function (len, w) {
      var s = '';
      for (var k = 0.14; k < 0.86; k += 0.12) {
        s += '<path class="' + cls + '" d="M' + r(w * 0.05) + ' ' + r(-len * k) + 'Q' + r(w * 0.22) + ' ' + r(-len * k - len * 0.02) + ' ' + r(w * 0.38) + ' ' + r(-len * (k + 0.07)) + '"/>';
        s += '<path class="' + cls + '" d="M' + r(-w * 0.05) + ' ' + r(-len * k) + 'Q' + r(-w * 0.22) + ' ' + r(-len * k - len * 0.02) + ' ' + r(-w * 0.38) + ' ' + r(-len * (k + 0.07)) + '"/>';
      }
      return s;
    };
  }
  function flower(x, y, s) {
    var g = '<g transform="translate(' + r(x) + ' ' + r(y) + ')">';
    for (var i = 0; i < 5; i++) {
      g += '<ellipse class="vv-fl" cx="0" cy="' + r(-s * 0.55) + '" rx="' + r(s * 0.4) + '" ry="' + r(s * 0.55) + '" transform="rotate(' + (i * 72) + ')"/>';
    }
    return g + '<circle class="vv-fa" r="' + r(s * 0.24) + '"/></g>';
  }
  function place(content, x, y, s, by) {
    // reposiciona um desenho centrado em (100, by) para (x, y) com escala s
    return '<g transform="translate(' + r(x - 100 * s) + ' ' + r(y - by * s) + ') scale(' + s + ')">' + content + '</g>';
  }

  /* ---------- Vasos ---------- */
  var POTS = {
    terracota: function () { return { by: 172, svg: '<path class="vv-pot" d="M62 180H138L130 233Q129 240 122 240H78Q71 240 70 233Z"/><rect class="vv-pot-d" x="55" y="166" width="90" height="17" rx="4"/>' }; },
    ceramica: function () { return { by: 172, svg: '<path class="vv-pot-l" d="M58 168H142L135 232Q134 240 126 240H74Q66 240 65 232Z"/><path class="vv-band" d="M61 190H139"/>' }; },
    cilindro: function () { return { by: 172, svg: '<rect class="vv-pot-k" x="62" y="166" width="76" height="74" rx="10"/><rect class="vv-pot-k2" x="62" y="166" width="76" height="9" rx="4"/>' }; },
    cesto: function () { return { by: 170, svg: '<path class="vv-pot-b" d="M54 164H146L138 232Q137 240 129 240H71Q63 240 62 232Z"/><path class="vv-weave" d="M57 180H143M58 196H142M60 212H140M61 228H139"/>' }; },
    tigela: function () { return { by: 186, svg: '<path class="vv-pot" d="M46 186H154C154 220 132 240 100 240C68 240 46 220 46 186Z"/><rect class="vv-pot-d" x="42" y="180" width="116" height="12" rx="6"/>' }; },
    suspenso: function () { return { by: 104, svg: '<path class="vv-rope" d="M100 2L54 100M100 2L146 100M100 2L100 100"/><path class="vv-pot" d="M52 104H148C148 136 128 154 100 154C72 154 52 136 52 104Z"/><rect class="vv-pot-d" x="48" y="98" width="104" height="12" rx="6"/>' }; }
  };

  /* ---------- Plantas ---------- */
  var P = {};
  P.monstera = function (by) {
    var s = '';
    [[-62, -72, -60, 58, 66, 'l2'], [60, -80, 58, 60, 68, 'l2'], [-30, -128, -22, 66, 74, 'l1'], [30, -134, 22, 66, 74, 'l1'], [0, -98, -2, 62, 70, 'l2']].forEach(function (a) {
      var ex = 100 + a[0] * 0.4, ey = by + a[1] * 0.55;
      s += '<path class="vv-st" d="' + q([100, by], [100 + a[0] * 0.08, by + a[1] * 0.3], [ex, ey]) + '"/>';
      s += leaf(ex, ey, a[3], a[4], a[2], a[5], { shape: 'heart', extra: slits });
    });
    return { back: s };
  };
  P.snake = function (by) {
    var s = '';
    [[-30, 92, 20, -24, 'l1'], [32, 86, 20, 26, 'l1'], [-18, 122, 24, -12, 'l2'], [20, 110, 22, 13, 'l2'], [-4, 154, 27, -2, 'l1'], [10, 138, 25, 6, 'l1']].forEach(function (a) {
      s += leaf(100 + a[0], by + 6, a[1], a[2], a[3], a[4], { shape: 'blade', rib: false, extra: function (len, w) {
        var t = '';
        for (var k = 0.16; k < 0.86; k += 0.15) t += '<path class="vv-band-l" d="M' + r(-w * 0.3) + ' ' + r(-len * k) + 'Q0 ' + r(-len * k - 5) + ' ' + r(w * 0.3) + ' ' + r(-len * k) + '"/>';
        return t;
      } });
    });
    return { back: s };
  };
  P.zz = function (by) {
    var s = '';
    [[-58, -100], [-28, -130], [4, -140], [36, -126], [62, -96]].forEach(function (d) {
      var p0 = [100, by], p1 = [100 + d[0], by + d[1]], c = [100 + d[0] * 0.15, by + d[1] * 0.6];
      s += '<path class="vv-st" d="' + q(p0, c, p1) + '"/>';
      for (var t = 0.34; t <= 1.001; t += 0.11) {
        var pt = qpt(p0, c, p1, t), a = qang(p0, c, p1, t) + 90, sz = 13 + t * 8;
        if (t > 0.97) s += leaf(pt[0], pt[1], sz + 4, sz * 0.8, a, 'l1', { shape: 'oval', rib: false });
        else {
          s += leaf(pt[0], pt[1], sz, sz * 0.72, a - 58, 'l1', { shape: 'oval', rib: false });
          s += leaf(pt[0], pt[1], sz, sz * 0.72, a + 58, 'l1', { shape: 'oval', rib: false });
        }
      }
    });
    return { back: s };
  };
  P.pothos = function (by) {
    var back = '', front = '';
    [[-28, -34], [0, -6], [28, 32], [-50, -64], [50, 62]].forEach(function (a, i) {
      back += leaf(100 + a[0] * 0.5, by - 2, 30, 28, a[1], i % 2 ? 'l2' : 'l1', { shape: 'heart' });
    });
    [[[66, by], [36, by + 46], [34, by + 126]], [[84, by + 2], [66, by + 64], [74, by + 134]], [[116, by + 2], [136, by + 60], [126, by + 128]], [[134, by], [168, by + 38], [168, by + 112]]].forEach(function (v, vi) {
      front += '<path class="vv-st vv-st-thin" d="' + q(v[0], v[1], v[2]) + '"/>';
      var k = 0;
      for (var t = 0.16; t <= 1.001; t += 0.16) {
        var pt = qpt(v[0], v[1], v[2], t), a = qang(v[0], v[1], v[2], t) + 90;
        var side = (k++ % 2) ? 1 : -1;
        front += leaf(pt[0], pt[1], 19 - t * 3, 17 - t * 3, a + side * 72, (k + vi) % 2 ? 'l2' : 'l3', { shape: 'heart' });
      }
    });
    return { back: back, front: front };
  };
  P.rosette = function (by) {
    var s = '', cx = 100, cy = by + 6;
    [[11, 66, 44, 'l3', -100, 100], [9, 52, 38, 'l2', -78, 78], [7, 38, 31, 'l1', -56, 56], [3, 22, 22, 'l1', -24, 24]].forEach(function (ring) {
      for (var i = 0; i < ring[0]; i++) {
        var a = ring[4] + (ring[5] - ring[4]) * i / (ring[0] - 1);
        s += leaf(cx, cy, ring[1], ring[2], a, ring[3], { rib: false });
      }
    });
    return { back: s };
  };
  P.aloe = function (by) {
    var s = '';
    [[-64, 78, 17, 'l3'], [-40, 98, 19, 'l2'], [-16, 110, 20, 'l2'], [6, 114, 20, 'l1'], [28, 104, 19, 'l2'], [50, 90, 18, 'l3'], [70, 72, 16, 'l2']].forEach(function (a) {
      s += leaf(100 + a[0] * 0.28, by + 6, a[1], a[2], a[0] * 0.9, a[3], { shape: 'blade', rib: false, extra: function (len, w) {
        var t = '';
        for (var k = 0.25; k < 0.8; k += 0.14) t += '<circle class="vv-dot-l" cx="' + r(w * 0.12) + '" cy="' + r(-len * k) + '" r="1.7"/>';
        return t;
      } });
    });
    return { back: s };
  };
  P.cactus = function (by) {
    return { back:
      '<rect class="vv-l2" x="58" y="' + (by - 98) + '" width="18" height="54" rx="9"/><rect class="vv-l2" x="62" y="' + (by - 58) + '" width="30" height="16" rx="8"/>' +
      '<rect class="vv-l1" x="124" y="' + (by - 112) + '" width="18" height="48" rx="9"/><rect class="vv-l1" x="108" y="' + (by - 78) + '" width="30" height="16" rx="8"/>' +
      '<rect class="vv-l2" x="85" y="' + (by - 132) + '" width="30" height="136" rx="15"/>' +
      '<path class="vv-rib" d="M93 ' + (by - 118) + 'V' + by + 'M100 ' + (by - 126) + 'V' + by + 'M107 ' + (by - 118) + 'V' + by + '"/>' +
      '<circle class="vv-fa" cx="100" cy="' + (by - 134) + '" r="7"/>' };
  };
  P.fern = function (by) {
    var s = '';
    var fr = [[[60, by - 70], [16, by + 40]], [[78, by - 84], [36, by - 56]], [[100, by - 96], [98, by - 92]], [[122, by - 84], [164, by - 56]], [[140, by - 70], [184, by + 40]],
      [[66, by - 26], [28, by + 112]], [[134, by - 26], [172, by + 112]], [[88, by - 34], [70, by + 126]], [[112, by - 34], [132, by + 128]]];
    fr.forEach(function (f, fi) {
      var p0 = [100, by], c = f[0], p1 = f[1];
      s += '<path class="vv-st vv-st-thin" d="' + q(p0, c, p1) + '"/>';
      for (var t = 0.12; t <= 0.97; t += 0.075) {
        var pt = qpt(p0, c, p1, t), a = qang(p0, c, p1, t) + 90, sz = 14 * (1 - t * 0.55);
        var cls = fi % 2 ? 'l2' : 'l3';
        s += leaf(pt[0], pt[1], sz, sz * 0.5, a - 64, cls, { rib: false });
        s += leaf(pt[0], pt[1], sz, sz * 0.5, a + 64, cls, { rib: false });
      }
    });
    return { front: s };
  };
  P.palm = function (by) {
    var s = '';
    [[[66, 34], [14, 72]], [[86, 12], [54, 16]], [[110, 4], [142, 22]], [[132, 30], [188, 72]], [[78, 84], [22, 128]], [[124, 84], [180, 126]]].forEach(function (f, fi) {
      var p0 = [100, by], c = f[0], p1 = f[1];
      s += '<path class="vv-st vv-st-thin" d="' + q(p0, c, p1) + '"/>';
      for (var t = 0.22; t <= 0.98; t += 0.055) {
        var pt = qpt(p0, c, p1, t), a = qang(p0, c, p1, t) + 90, len = 26 * (1 - t * 0.45);
        var cls = fi % 2 ? 'l1' : 'l2';
        s += leaf(pt[0], pt[1], len, 6, a - 48, cls, { rib: false });
        s += leaf(pt[0], pt[1], len, 6, a + 48, cls, { rib: false });
      }
    });
    return { back: s };
  };
  P.orchid = function (by) {
    var s = '';
    var p0 = [104, by], c = [92, by - 160], p1 = [156, by - 128];
    s += '<path class="vv-st vv-st-thin" d="' + q(p0, c, p1) + '"/>';
    [0.6, 0.72, 0.84, 0.96].forEach(function (t, i) {
      var pt = qpt(p0, c, p1, t);
      s += flower(pt[0], pt[1] + 6, 15 - i);
    });
    s += leaf(100, by + 4, 54, 40, -74, 'l1', { shape: 'oval' }) + leaf(100, by + 4, 58, 42, 72, 'l2', { shape: 'oval' }) + leaf(100, by + 4, 46, 34, -28, 'l2', { shape: 'oval' });
    return { back: s };
  };
  P.anthurium = function (by) {
    var s = '';
    [[-56, -64, -48, 'l2'], [52, -72, 44, 'l2'], [-14, -120, -10, 'l1'], [22, -110, 18, 'l1'], [-66, -30, -78, 'l1'], [66, -34, 76, 'l1']].forEach(function (a) {
      var ex = 100 + a[0] * 0.45, ey = by + a[1] * 0.5;
      s += '<path class="vv-st" d="' + q([100, by], [100 + a[0] * 0.1, by + a[1] * 0.3], [ex, ey]) + '"/>';
      s += leaf(ex, ey, 50, 46, a[2], a[3], { shape: 'heart' });
    });
    [[-36, -118, -16], [42, -124, 20]].forEach(function (a) {
      var ex = 100 + a[0], ey = by + a[1];
      s += '<path class="vv-st vv-st-thin" d="' + q([100, by], [100 + a[0] * 0.2, by + a[1] * 0.6], [ex, ey]) + '"/>';
      s += '<g transform="translate(' + ex + ' ' + ey + ') rotate(' + a[2] + ')"><path class="vv-fa" d="' + leafD(32, 32, 'heart') + '"/><path class="vv-spadix" d="M0 -6Q5 -18 3 -30"/></g>';
    });
    return { back: s };
  };
  P.peace = function (by) {
    var s = '';
    [[-62, -40], [-34, -18], [-8, -4], [16, 10], [40, 26], [64, 46]].forEach(function (a, i) {
      s += leaf(100 + a[0] * 0.12, by + 6, 80 - Math.abs(a[1]) * 0.4, 30, a[0] * 0.9, i % 2 ? 'l1' : 'l2', {});
    });
    [[-28, -118, -12], [26, -110, 14], [2, -132, 0]].forEach(function (a) {
      var ex = 100 + a[0], ey = by + a[1];
      s += '<path class="vv-st vv-st-thin" d="' + q([100, by], [100 + a[0] * 0.3, by + a[1] * 0.5], [ex, ey]) + '"/>';
      s += '<g transform="translate(' + ex + ' ' + ey + ') rotate(' + a[2] + ')"><path class="vv-fl" d="' + leafD(38, 24) + '"/><path class="vv-spadix" d="M0 -6L0 -22"/></g>';
    });
    return { back: s };
  };
  P.ficus = function (by) {
    var s = '<path class="vv-trunk" d="M100 ' + by + 'C98 ' + (by - 50) + ' 104 ' + (by - 96) + ' 100 ' + (by - 128) + '"/>';
    for (var i = 0; i < 7; i++) {
      var y = by - 46 - i * 13, side = i % 2 ? 1 : -1;
      s += leaf(100 + side * 2, y, 46 - i * 1.5, 42 - i * 1.5, side * (62 - i * 6), i % 2 ? 'l1' : 'l2', { shape: 'fiddle' });
    }
    s += leaf(100, by - 128, 38, 34, 0, 'l2', { shape: 'fiddle' });
    return { back: s };
  };
  P.pearls = function (by) {
    var s = '';
    [[62, -10, 118], [76, -18, 132], [90, 6, 104], [108, -6, 138], [122, 14, 122], [138, 20, 110]].forEach(function (d, di) {
      var p0 = [d[0], by + 4], p1 = [d[0] + d[1], by + d[2]], c = [d[0] + (d[0] < 100 ? -24 : 24), by + d[2] * 0.4];
      s += '<path class="vv-st vv-st-thin" d="' + q(p0, c, p1) + '"/>';
      for (var t = 0.08; t <= 1.001; t += 0.07) {
        var pt = qpt(p0, c, p1, t);
        s += '<circle class="vv-' + ((di + Math.round(t * 20)) % 3 === 0 ? 'l2' : 'l3') + '" cx="' + r(pt[0]) + '" cy="' + r(pt[1]) + '" r="4.6"/>';
      }
    });
    for (var k = 0; k < 9; k++) s += '<circle class="vv-l3" cx="' + (64 + k * 9) + '" cy="' + (by - 4 - (k % 2) * 5) + '" r="5"/>';
    return { front: s };
  };
  function calatheaLike(by, veinCls) {
    var s = '';
    [[-60, -60, -52, 'l2'], [58, -66, 48, 'l2'], [-18, -110, -14, 'l1'], [24, -112, 16, 'l1'], [0, -76, 0, 'l2'], [-70, -24, -80, 'l1'], [70, -26, 80, 'l1']].forEach(function (a) {
      var ex = 100 + a[0] * 0.42, ey = by + a[1] * 0.5;
      s += '<path class="vv-st" d="' + q([100, by], [100 + a[0] * 0.1, by + a[1] * 0.3], [ex, ey]) + '"/>';
      s += leaf(ex, ey, 62, 48, a[2], a[3], { shape: 'oval', extra: stripes(veinCls) });
    });
    return { back: s };
  }
  P.calathea = function (by) { return calatheaLike(by, 'vv-stripe'); };
  P.maranta = function (by) { return calatheaLike(by, 'vv-vein-a'); };
  P.pilea = function (by) {
    var s = '';
    [[-62, -58], [-42, -96], [-14, -120], [16, -124], [42, -100], [64, -62], [-74, -20], [74, -24], [0, -84], [-28, -66], [30, -70]].forEach(function (d, i) {
      var ex = 100 + d[0], ey = by + d[1];
      s += '<path class="vv-st vv-st-thin" d="' + q([100, by], [100 + d[0] * 0.2, by + d[1] * 0.7], [ex, ey]) + '"/>';
      s += '<circle class="vv-' + (i % 3 ? 'l2' : 'l1') + '" cx="' + ex + '" cy="' + ey + '" r="' + (13 + (i % 3) * 2) + '"/><circle class="vv-rib" cx="' + ex + '" cy="' + ey + '" r="1.6"/>';
    });
    return { back: s };
  };
  P.peperomia = function (by) {
    var s = '';
    [[-74, 44], [-50, 56], [-26, 62], [0, 66], [26, 62], [50, 56], [74, 44], [-36, 44], [36, 44], [0, 46]].forEach(function (a, i) {
      var ex = 100 + a[0] * 0.25, ey = by - (i > 6 ? 40 : 4);
      s += leaf(ex, ey, a[1], a[1] * 0.8, a[0], i % 2 ? 'l1' : 'l2', { shape: 'oval' });
    });
    return { back: s };
  };
  P.begonia = function (by) {
    var s = '<path class="vv-st" d="M92 ' + by + 'V' + (by - 104) + 'M108 ' + by + 'V' + (by - 84) + 'M100 ' + by + 'V' + (by - 118) + '"/>';
    var dots = function (len, w) {
      var t = '';
      for (var k = 0; k < 7; k++) t += '<circle class="vv-dot-w" cx="' + r((k % 2 ? 1 : -1) * w * 0.18) + '" cy="' + r(-len * (0.15 + k * 0.1)) + '" r="2.2"/>';
      return t;
    };
    [[92, -50, -70], [92, -84, -62], [108, -40, 70], [108, -78, 64], [100, -104, -38], [100, -118, 32], [92, -100, -80]].forEach(function (a, i) {
      s += leaf(a[0], by + a[1], 56, 24, a[2], i % 2 ? 'l2' : 'l1', { rib: false, extra: dots });
    });
    return { back: s };
  };

  /* ---------- Objetos (sem vaso padrão) ---------- */
  var OBJ = {};
  OBJ.potonly = function () {
    return '<path class="vv-pot" d="M54 122H146L135 226Q134 234 126 234H74Q66 234 65 226Z"/><rect class="vv-pot-d" x="46" y="104" width="108" height="22" rx="5"/><rect class="vv-pot-d" x="56" y="230" width="88" height="10" rx="5"/>';
  };
  OBJ.basket = function () {
    return '<path class="vv-rope" d="M58 112C38 112 38 140 56 140M142 112C162 112 162 140 144 140" style="stroke-width:4"/><path class="vv-pot-b" d="M44 104H156L144 228Q143 238 133 238H67Q57 238 56 228Z"/><path class="vv-weave" d="M47 124H153M49 146H151M51 168H149M53 190H147M55 212H145"/>';
  };
  OBJ.selfwater = function () {
    var pl = P.pilea(106).back;
    return place(pl, 100, 106, 0.7, 106) + '<rect class="vv-pot-l" x="56" y="100" width="88" height="138" rx="12"/><rect class="vv-water" x="70" y="170" width="14" height="52" rx="7"/><rect class="vv-l3" x="70" y="196" width="14" height="26" rx="7"/>';
  };
  OBJ.stand = function () {
    var pp = POTS.terracota(), pl = P.pilea(pp.by).back;
    return '<path class="vv-wood" d="M66 150L50 238M134 150L150 238M60 204H140"/><rect class="vv-wood-f" x="56" y="140" width="88" height="12" rx="6"/>' + place(pl + pp.svg, 100, 146, 0.62, 240);
  };
  OBJ.bag = function () {
    return '<path class="vv-pot-l" d="M58 72H142L150 230Q150 238 142 238H58Q50 238 50 230Z"/><path class="vv-pot-d" d="M58 72L64 58H136L142 72Z"/><rect class="vv-label" x="68" y="118" width="64" height="76" rx="8"/>' +
      leaf(100, 182, 42, 26, 18, 'l2', {}) + leaf(98, 184, 30, 18, -30, 'l1', {});
  };
  OBJ.bottle = function () {
    return '<rect class="vv-pot-d" x="88" y="62" width="24" height="30" rx="5"/><rect class="vv-pot-k" x="72" y="88" width="56" height="150" rx="16"/><rect class="vv-label" x="80" y="140" width="40" height="60" rx="6"/>' +
      leaf(100, 190, 36, 22, 10, 'l2', {});
  };
  OBJ.can = function () {
    return '<path class="vv-wood" d="M76 140C40 140 42 200 78 204" style="stroke-width:6"/><path class="vv-wood" d="M136 162L182 108" style="stroke-width:8"/>' +
      '<rect class="vv-pot-d" x="174" y="94" width="18" height="24" rx="4" transform="rotate(-42 183 106)"/><path class="vv-wood" d="M86 132C86 102 126 102 126 132" style="stroke-width:6"/>' +
      '<path class="vv-wood-f" d="M70 130H142L136 232Q135 238 129 238H83Q77 238 76 232Z"/><path class="vv-pot-d" d="M70 130H142L141 142H71Z"/>';
  };
  OBJ.tools = function () {
    return '<g transform="rotate(-18 100 140)"><rect class="vv-wood-f" x="64" y="150" width="16" height="82" rx="8"/><path class="vv-metal" d="M72 152C52 140 50 94 72 60C94 94 92 140 72 152Z"/></g>' +
      '<g transform="rotate(16 120 140)"><rect class="vv-wood-f" x="118" y="150" width="16" height="82" rx="8"/><path class="vv-metal" d="M112 152V96a4 4 0 0 1 8 0v40h4V90a4 4 0 0 1 8 0v46h4V96a4 4 0 0 1 8 0v56Z"/></g>';
  };
  OBJ.terrarium = function () {
    var ros = P.rosette(186).back, fern = P.fern(104).front;
    return '<path class="vv-glass" d="M36 128L100 58L164 128V234H36Z"/>' +
      '<rect class="vv-pot" x="38" y="212" width="124" height="20"/><rect class="vv-soil" x="38" y="200" width="124" height="13"/>' +
      place(ros, 78, 204, 0.42, 192) + place(fern, 128, 202, 0.36, 104) +
      '<circle class="vv-pot-l" cx="104" cy="204" r="6"/><circle class="vv-pot-l" cx="148" cy="206" r="4"/>' +
      '<path class="vv-ink-s" d="M100 58V46M36 128H164"/>';
  };
  OBJ.kokedama = function () {
    var top = P.pothos(132).back;
    return '<path class="vv-rope" d="M100 4V126" style="stroke-width:2"/>' + top +
      '<circle class="vv-l1" cx="100" cy="176" r="54"/><path class="vv-rope" d="M48 166Q100 190 152 166M54 200Q100 220 146 200M100 122V230" style="stroke-width:2.4"/>' +
      '<circle class="vv-l2" cx="80" cy="150" r="5"/><circle class="vv-l2" cx="126" cy="186" r="6"/><circle class="vv-l2" cx="84" cy="208" r="4"/>';
  };
  OBJ.tray = function () {
    var ros = P.rosette(186).back, cac = P.cactus(172).back;
    return place(cac, 152, 208, 0.55, 176) + place(ros, 52, 212, 0.62, 192) + place(ros, 104, 216, 0.72, 192) +
      '<rect class="vv-wood-f" x="18" y="204" width="164" height="30" rx="8"/><path class="vv-pot-d" d="M18 214H182V222H18Z" opacity=".35"/>';
  };

  function art(kind, pot) {
    if (OBJ[kind]) return OBJ[kind]();
    var pp = (POTS[pot] || POTS.terracota)();
    var pl = (P[kind] || P.pilea)(pp.by);
    return (pl.back || '') + pp.svg + (pl.front || '');
  }

  function svg(content, o) {
    o = o || {};
    return '<svg class="vv-art' + (o.cls ? ' ' + o.cls : '') + '" viewBox="' + (o.vb || '0 0 320 180') + '" preserveAspectRatio="' + (o.par || 'xMidYMid meet') + '"' +
      (o.label ? ' role="img" aria-label="' + o.label + '"' : ' aria-hidden="true" focusable="false"') + '>' +
      '<rect class="vv-bg" x="-2000" y="-2000" width="5000" height="5000"/>' + content + '</svg>';
  }

  function altFor(p) {
    if (!p.art) return '';
    var potName = { terracota: 'vaso de terracota', ceramica: 'vaso de cerâmica clara', cilindro: 'vaso cilíndrico escuro', cesto: 'cesto de fibra', tigela: 'tigela de cerâmica', suspenso: 'vaso suspenso' }[p.art.pot];
    return 'Ilustração: ' + p.nome + (potName ? ' em ' + potName : '');
  }

  VV.art = {
    raw: art,
    card: function (p) { return svg('<g transform="translate(90 6) scale(0.7)">' + art(p.art.kind, p.art.pot) + '</g>', { vb: '0 0 320 180', label: altFor(p) }); },
    product: function (p) { return svg('<g transform="translate(90 18) scale(1.1)">' + art(p.art.kind, p.art.pot) + '</g>', { vb: '0 0 400 300', label: altFor(p) }); },
    thumb: function (p) { return svg('<g transform="translate(28 10) scale(0.92)">' + art(p.art.kind, p.art.pot) + '</g>', { vb: '0 0 240 240' }); },
    square: function (kind, pot, label) { return svg('<g transform="translate(60 24) scale(0.85)">' + art(kind, pot) + '</g>', { vb: '0 0 290 230', label: label, par: 'xMidYMid slice' }); },
    heroTall: function () {
      return svg('<g transform="translate(6 92) scale(1.44)">' + art('monstera', 'ceramica') + '</g>', { vb: '0 0 300 440', par: 'xMidYMax slice', label: 'Ilustração: costela-de-adão em vaso de cerâmica clara' });
    },
    heroLeaves: function () {
      var c = leaf(70, 250, 210, 170, -34, 'l2', { shape: 'heart', extra: slits }) +
        leaf(250, 260, 240, 170, 24, 'l3', { shape: 'oval', extra: stripes('vv-stripe') }) +
        leaf(360, 240, 160, 120, 52, 'l2', {}) +
        leaf(170, 270, 150, 100, 4, 'l1', { shape: 'heart' });
      return svg(c, { vb: '0 0 400 220', par: 'xMidYMid slice', label: 'Ilustração: folhas de costela-de-adão e calathea' });
    },
    scene: function () {
      var c = '<rect class="vv-shelf" x="-2000" y="384" width="5000" height="400"/>';
      [['palm', 'cesto', 110, 1.5], ['monstera', 'terracota', 330, 1.18], ['snake', 'cilindro', 520, 1.05], ['calathea', 'ceramica', 680, 0.95], ['ficus', 'cesto', 860, 1.32], ['pilea', 'terracota', 1010, 0.75]].forEach(function (a) {
        c += place(art(a[0], a[1]), a[2], 384, a[3], 240);
      });
      c += place(art('pothos', 'suspenso'), 430, 0, 1.05, 0);
      return svg(c, { vb: '0 0 1100 440', par: 'xMinYMax slice', label: 'Ilustração: estante do viveiro com palmeira, costela-de-adão, espada-de-são-jorge, calathea, figueira-lira e jiboia suspensa' });
    }
  };
})();
