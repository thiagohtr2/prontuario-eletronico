/* ==========================================================================
   Verde Vivo — ilustrações botânicas vetoriais (geradas em SVG inline)
   Todas as cores vêm de classes CSS ligadas aos tokens (ver components.css, ".art").
   API: VV.art.product(produto, 'main'|'detail'), VV.art.hero(), VV.art.leaves(),
        VV.art.atelier(), VV.art.care('luz'|'agua'|'vaso'), VV.art.scene(opts)
   ========================================================================== */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  var f = function (n) { return Math.round(n * 10) / 10; };
  var rad = function (d) { return (d * Math.PI) / 180; };

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- formas básicas (origem na base da folha, apontando para cima) ---- */
  function leafD(L, W) {
    return 'M0 0C' + f(-W) + ' ' + f(-L * 0.3) + ' ' + f(-W) + ' ' + f(-L * 0.75) + ' 0 ' + f(-L) +
      'C' + f(W) + ' ' + f(-L * 0.75) + ' ' + f(W) + ' ' + f(-L * 0.3) + ' 0 0Z';
  }
  function heartD(L, W) {
    return 'M0 0C' + f(-W * 1.15) + ' ' + f(L * 0.08) + ' ' + f(-W * 1.25) + ' ' + f(-L * 0.7) + ' 0 ' + f(-L) +
      'C' + f(W * 1.25) + ' ' + f(-L * 0.7) + ' ' + f(W * 1.15) + ' ' + f(L * 0.08) + ' 0 0Z';
  }
  function fiddleD(L, W) {
    return 'M0 0C' + f(-W * 0.4) + ' ' + f(-L * 0.2) + ' ' + f(-W * 0.5) + ' ' + f(-L * 0.45) + ' ' + f(-W) + ' ' + f(-L * 0.7) +
      'C' + f(-W * 0.85) + ' ' + f(-L * 1.02) + ' ' + f(W * 0.85) + ' ' + f(-L * 1.02) + ' ' + f(W) + ' ' + f(-L * 0.7) +
      'C' + f(W * 0.5) + ' ' + f(-L * 0.45) + ' ' + f(W * 0.4) + ' ' + f(-L * 0.2) + ' 0 0Z';
  }
  var uid = 0;
  function leaf(x, y, L, W, rot, cls, opt) {
    opt = opt || {};
    var d = opt.shape === 'heart' ? heartD(L, W) : opt.shape === 'fiddle' ? fiddleD(L, W) : leafD(L, W);
    var s = '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(rot) + ')"><path class="' + cls + '" d="' + d + '"/>';
    if (opt.vein !== false) s += '<path class="vein" d="M0 -2L0 ' + f(-L * 0.86) + '"/>';
    if (opt.cuts) {
      var id = 'cp' + (++uid);
      s += '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath><g clip-path="url(#' + id + ')">';
      for (var j = 1; j <= 3; j++) {
        var yy = -L * (0.2 + 0.17 * j);
        s += '<path class="cut" d="M' + f(W * 1.4) + ' ' + f(yy + 8) + 'L' + f(W * 0.3) + ' ' + f(yy) + 'M' + f(-W * 1.4) + ' ' + f(yy + 8) + 'L' + f(-W * 0.3) + ' ' + f(yy) + '"/>';
      }
      s += '</g>';
    }
    return s + '</g>';
  }
  function bez(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    ];
  }
  function bezAngle(p0, p1, p2, p3, t) {
    var a = bez(p0, p1, p2, p3, Math.max(0, t - 0.01)), b = bez(p0, p1, p2, p3, Math.min(1, t + 0.01));
    return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  }

  /* ---- plantas (origem no centro do aro do vaso; crescem para cima = y negativo) ---- */
  var NOM = {
    monstera: 150, snake: 140, succulent: 44, fern: 112, orchid: 135, violet: 46, herb: 72, cactus: 62,
    pothos: 105, palm: 150, lyrata: 175, zz: 120, lily: 104, trailing: 48, anthurium: 110, haworthia: 40, sprig: 80, empty: 20
  };

  var PLANTS = {
    monstera: function (r) {
      var n = 7, out = '', leaves = [];
      for (var i = 0; i < n; i++) {
        var a = -64 + i * (128 / (n - 1)) + (r() - 0.5) * 8;
        var h = 62 + r() * 26 - Math.abs(a) * 0.1 + (i % 2 ? 10 : 0);
        var x = Math.sin(rad(a)) * h * 1.05, y = -Math.cos(rad(a)) * h - 4;
        leaves.push({ a: a, x: x, y: y, L: 46 + r() * 14, W: 19 + r() * 5, c: ['l1', 'l2', 'l4'][i % 3] });
      }
      leaves.sort(function (p, q) { return Math.abs(q.a) - Math.abs(p.a); });
      leaves.forEach(function (l) {
        out += '<path class="stem" stroke-width="2.6" d="M0 -2Q' + f(l.x * 0.1) + ' ' + f(l.y * 0.65) + ' ' + f(l.x) + ' ' + f(l.y) + '"/>';
      });
      leaves.forEach(function (l) {
        out += leaf(l.x, l.y, l.L, l.W, l.a * 0.85, l.c, { shape: 'heart', cuts: true });
      });
      return out;
    },
    snake: function (r) {
      var out = '', n = 8;
      for (var i = 0; i < n; i++) {
        var lean = (i - (n - 1) / 2) * 7 + (r() - 0.5) * 6;
        var h = 80 + r() * 55 - Math.abs(lean) * 0.8;
        var w = 7 + r() * 3;
        var x0 = (i - (n - 1) / 2) * 5;
        var cls = i % 2 ? 'l4' : 'l1';
        out += '<g transform="translate(' + f(x0) + ' 0)"><path class="' + cls + '" d="M' + f(-w) + ' 0C' + f(-w * 1.1) + ' ' + f(-h * 0.5) + ' ' + f(lean - w * 0.3) + ' ' + f(-h * 0.85) + ' ' + f(lean) + ' ' + f(-h) +
          'C' + f(lean + w * 0.3) + ' ' + f(-h * 0.85) + ' ' + f(w * 1.1) + ' ' + f(-h * 0.5) + ' ' + f(w) + ' 0Z"/>' +
          '<path class="edge" d="M' + f(-w * 0.9) + ' 0C' + f(-w * 1.05) + ' ' + f(-h * 0.5) + ' ' + f(lean - w * 0.3) + ' ' + f(-h * 0.85) + ' ' + f(lean) + ' ' + f(-h) + '"/>' +
          '<path class="band" d="M' + f(lean * 0.1) + ' -4L' + f(lean * 0.92) + ' ' + f(-h * 0.92) + '"/></g>';
      }
      return out;
    },
    succulent: function (r) {
      var out = '<g transform="translate(0 -10) scale(1 0.62)">', rings = [
        { n: 9, L: 30, W: 9.5, c: 'l3', tilt: 0, o: 4 },
        { n: 8, L: 25, W: 9, c: 'l2', tilt: 20, o: 3 },
        { n: 6, L: 19, W: 8, c: 'l5', tilt: 8, o: 2 },
        { n: 4, L: 12, W: 6, c: 'l3', tilt: 30, o: 1 }
      ];
      rings.forEach(function (ring) {
        for (var i = 0; i < ring.n; i++) {
          var a = (360 / ring.n) * i + ring.tilt;
          out += '<g transform="rotate(' + f(a) + ') translate(0 ' + (-ring.o) + ')"><path class="' + ring.c + '" d="' + leafD(ring.L, ring.W) + '"/></g>';
        }
      });
      return out + '</g>';
    },
    haworthia: function (r) {
      var out = '', n = 13;
      for (var i = 0; i < n; i++) {
        var a = -78 + i * (156 / (n - 1)) + (r() - 0.5) * 8;
        var L = 24 + r() * 8 - Math.abs(a) * 0.1;
        out += leaf(0, -4, L, 5.6, a, i % 2 ? 'l4' : 'l1', { vein: false }) +
          '<g transform="translate(0 -4) rotate(' + f(a) + ')"><path class="dots" d="M0 ' + f(-L * 0.35) + 'h.01M0 ' + f(-L * 0.55) + 'h.01M0 ' + f(-L * 0.75) + 'h.01"/></g>';
      }
      return out;
    },
    fern: function (r) {
      var out = '', n = 11;
      for (var i = 0; i < n; i++) {
        var ang = -78 + i * (156 / (n - 1)) + (r() - 0.5) * 8;
        var len = 62 + r() * 30 - Math.abs(ang) * 0.12;
        var ar = rad(ang);
        var p0 = [0, -2], p3 = [Math.sin(ar) * len * 1.05, -Math.cos(ar) * len * 0.92 - 2];
        var p1 = [Math.sin(ar * 0.3) * len * 0.45, -len * 0.55], p2 = [Math.sin(ar * 0.9) * len * 0.8, -Math.cos(ar * 0.5) * len * 0.82];
        var d = '', cnt = 13;
        for (var k = 1; k <= cnt; k++) {
          var t = 0.12 + (k / cnt) * 0.86;
          var pt = bez(p0, p1, p2, p3, t), an = bezAngle(p0, p1, p2, p3, t) * Math.PI / 180;
          var ll = (13 - t * 8) * (len / 90 + 0.3);
          [-1, 1].forEach(function (sd) {
            var nx = Math.cos(an + sd * 1.15) * ll, ny = Math.sin(an + sd * 1.15) * ll;
            d += 'M' + f(pt[0]) + ' ' + f(pt[1]) + 'l' + f(nx) + ' ' + f(ny);
          });
        }
        out += '<path class="stem" stroke-width="1.8" d="M0 -2C' + f(p1[0]) + ' ' + f(p1[1]) + ' ' + f(p2[0]) + ' ' + f(p2[1]) + ' ' + f(p3[0]) + ' ' + f(p3[1]) + '"/>' +
          '<path class="frond ' + (i % 2 ? 'fa' : 'fb') + '" d="' + d + '"/>';
      }
      return out;
    },
    zz: function (r) {
      var out = '', n = 7;
      for (var i = 0; i < n; i++) {
        var ang = -58 + i * (116 / (n - 1)) + (r() - 0.5) * 8;
        var len = 80 + r() * 30 - Math.abs(ang) * 0.25;
        var ar = rad(ang);
        var p0 = [0, -2], p3 = [Math.sin(ar) * len, -Math.cos(ar) * len];
        var p1 = [Math.sin(ar * 0.4) * len * 0.4, -len * 0.5], p2 = [Math.sin(ar * 0.8) * len * 0.7, -len * 0.8];
        var d = '', cnt = 8;
        for (var k = 1; k <= cnt; k++) {
          var t = 0.18 + (k / cnt) * 0.8;
          var pt = bez(p0, p1, p2, p3, t), an = bezAngle(p0, p1, p2, p3, t) * Math.PI / 180;
          var ll = 11 - t * 5;
          [-1, 1].forEach(function (sd) {
            d += 'M' + f(pt[0]) + ' ' + f(pt[1]) + 'l' + f(Math.cos(an + sd * 1.1) * ll) + ' ' + f(Math.sin(an + sd * 1.1) * ll);
          });
        }
        d += 'M' + f(p3[0]) + ' ' + f(p3[1]) + 'l' + f(Math.cos(Math.atan2(p3[1] - p2[1], p3[0] - p2[0])) * 7) + ' ' + f(Math.sin(Math.atan2(p3[1] - p2[1], p3[0] - p2[0])) * 7);
        out += '<path class="stem" stroke-width="2.4" d="M0 -2C' + f(p1[0]) + ' ' + f(p1[1]) + ' ' + f(p2[0]) + ' ' + f(p2[1]) + ' ' + f(p3[0]) + ' ' + f(p3[1]) + '"/>' +
          '<path class="blob ' + (i % 2 ? 'fa' : 'fb') + '" d="' + d + '"/>';
      }
      return out;
    },
    herb: function (r) {
      var out = '', i;
      for (i = 0; i < 9; i++) {
        var a0 = -50 + i * 12.5;
        out += '<path class="stem" stroke-width="1.6" d="M0 -2L' + f(Math.sin(rad(a0)) * 30) + ' ' + f(-Math.cos(rad(a0)) * 30 - 6) + '"/>';
      }
      var pts = [];
      for (i = 0; i < 64; i++) {
        var a = -88 + r() * 176, d = 8 + r() * 36;
        pts.push({ x: Math.sin(rad(a)) * d * 1.15, y: -Math.cos(rad(a)) * d * 0.95 - 6, a: a + (r() - 0.5) * 50, c: ['l1', 'l2', 'l3', 'l4'][i % 4] });
      }
      pts.sort(function (p, q) { return q.y - p.y; });
      pts.forEach(function (p) {
        out += '<g transform="translate(' + f(p.x) + ' ' + f(p.y) + ') rotate(' + f(p.a) + ')"><path class="' + p.c + '" d="' + leafD(13, 5.5) + '"/></g>';
      });
      return out;
    },
    sprig: function (r) {
      var out = '', n = 9;
      for (var i = 0; i < n; i++) {
        var a = -46 + i * (92 / (n - 1)) + (r() - 0.5) * 6;
        var len = 48 + r() * 26 - Math.abs(a) * 0.2;
        var ar = rad(a), ex = Math.sin(ar) * len, ey = -Math.cos(ar) * len;
        var d = '';
        for (var k = 1; k <= 12; k++) {
          var t = k / 13, px = ex * t, py = -2 + (ey + 2) * t;
          d += 'M' + f(px) + ' ' + f(py) + 'l' + f(7 * Math.cos(rad(a) - 1.0)) + ' ' + f(-7 * Math.sin(rad(a) - 1.0) - 4) +
            'M' + f(px) + ' ' + f(py) + 'l' + f(-7 * Math.cos(rad(a) + 1.0)) + ' ' + f(7 * Math.sin(rad(a) + 1.0) - 4);
        }
        out += '<path class="stem" stroke-width="1.6" d="M0 -2L' + f(ex) + ' ' + f(ey) + '"/><path class="needle ' + (i % 2 ? 'fa' : 'fb') + '" d="' + d + '"/>';
      }
      return out;
    },
    cactus: function (r) {
      var out = '<ellipse class="l2" cx="0" cy="-26" rx="25" ry="27"/>';
      [-17, -8, 0, 8, 17].forEach(function (rx) {
        out += '<path class="vein" d="M0 -53Q' + f(rx * 1.5) + ' -26 0 0" transform="scale(' + (Math.abs(rx) < 1 ? 1 : 1) + ')"/>';
      });
      var dots = '';
      for (var i = 0; i < 26; i++) {
        var a = r() * 6.28, d = r() * 0.85;
        dots += 'M' + f(Math.cos(a) * 22 * d) + ' ' + f(-26 + Math.sin(a) * 24 * d) + 'h.01';
      }
      out += '<path class="dots dots--cl" d="' + dots + '"/>';
      out += '<g transform="translate(0 -52)">' + [0, 72, 144, 216, 288].map(function (a) {
        return '<ellipse class="bloom" cx="0" cy="-6" rx="3.6" ry="7" transform="rotate(' + a + ')"/>';
      }).join('') + '<circle class="accent" r="3"/></g>';
      return out;
    },
    pothos: function (r) {
      var out = '', vines = [
        { d: [[-6, -4], [-40, -30], [-46, 10], [-38, 56]], n: 7 },
        { d: [[6, -4], [42, -26], [52, 14], [42, 58]], n: 7 },
        { d: [[-2, -4], [-26, -60], [-48, -40], [-60, -6]], n: 6 },
        { d: [[2, -4], [30, -64], [52, -44], [64, -10]], n: 6 },
        { d: [[0, -4], [-6, -48], [4, -70], [-2, -92]], n: 6 },
        { d: [[-4, -4], [-14, 30], [-24, 40], [-20, 70]], n: 6 }
      ];
      vines.forEach(function (v) {
        out += '<path class="stem" stroke-width="1.8" d="M' + v.d[0].join(' ') + 'C' + v.d[1].join(' ') + ' ' + v.d[2].join(' ') + ' ' + v.d[3].join(' ') + '"/>';
      });
      vines.forEach(function (v, vi) {
        for (var k = 1; k <= v.n; k++) {
          var t = k / v.n, pt = bez(v.d[0], v.d[1], v.d[2], v.d[3], t), an = bezAngle(v.d[0], v.d[1], v.d[2], v.d[3], t);
          var side = k % 2 ? 1 : -1;
          out += leaf(pt[0], pt[1], 17, 8.5, an + 90 + side * 52, ['l1', 'l2', 'l4', 'l3'][(k + vi) % 4], { shape: 'heart', vein: false });
        }
      });
      return out;
    },
    trailing: function (r) {
      var out = '', vines = [
        { d: [[-18, 0], [-34, 14], [-34, 40], [-28, 66]] },
        { d: [[-8, 0], [-14, 20], [-10, 44], [-14, 76]] },
        { d: [[6, 0], [14, 22], [18, 46], [12, 72]] },
        { d: [[16, 0], [34, 12], [40, 38], [34, 62]] },
        { d: [[0, -2], [-24, -26], [-44, -14], [-52, 12]] },
        { d: [[2, -2], [26, -28], [46, -16], [54, 10]] }
      ];
      vines.forEach(function (v) {
        out += '<path class="stem" stroke-width="1.6" d="M' + v.d[0].join(' ') + 'C' + v.d[1].join(' ') + ' ' + v.d[2].join(' ') + ' ' + v.d[3].join(' ') + '"/>';
        for (var k = 0; k <= 13; k++) {
          var t = k / 13, pt = bez(v.d[0], v.d[1], v.d[2], v.d[3], t);
          out += '<ellipse class="' + (k % 3 ? 'l3' : 'l2') + '" cx="' + f(pt[0] + (k % 2 ? 3 : -3)) + '" cy="' + f(pt[1]) + '" rx="5.4" ry="3.8" transform="rotate(' + (k % 2 ? 30 : -30) + ' ' + f(pt[0]) + ' ' + f(pt[1]) + ')"/>';
        }
      });
      return out;
    },
    palm: function (r) {
      var out = '', n = 6;
      for (var i = 0; i < n; i++) {
        var lean = -34 + i * (68 / (n - 1)) + (r() - 0.5) * 6;
        var h = 80 + r() * 36 - Math.abs(lean) * 0.5;
        var tx = Math.sin(rad(lean)) * h * 0.8, ty = -Math.cos(rad(lean)) * h;
        out += '<path class="stem" stroke-width="2.2" d="M' + f(lean * 0.05) + ' -2Q' + f(tx * 0.3) + ' ' + f(ty * 0.6) + ' ' + f(tx) + ' ' + f(ty) + '"/>';
        for (var j = 0; j < 7; j++) {
          out += leaf(tx, ty, 40 + r() * 8, 5.4, -66 + j * 22 + lean * 0.4, (i + j) % 2 ? 'l1' : 'l2', { vein: false });
        }
      }
      return out;
    },
    lyrata: function (r) {
      var out = '<path class="stem" stroke-width="4.5" d="M0 -2C3 -50 -3 -100 2 -148"/>';
      for (var i = 0; i < 7; i++) {
        var y = -52 - i * 14, side = i % 2 ? 1 : -1;
        out += leaf(side * 1, y, 52 - i * 2.2, 23 - i * 0.6, side * (58 - i * 3) + (r() - 0.5) * 8, i % 3 === 0 ? 'l4' : i % 3 === 1 ? 'l1' : 'l2', { shape: 'fiddle' });
      }
      out += leaf(2, -148, 34, 17, 6, 'l2', { shape: 'fiddle' });
      return out;
    },
    lily: function (r) {
      var out = '', n = 9;
      for (var i = 0; i < n; i++) {
        var a = -58 + i * (116 / (n - 1)) + (r() - 0.5) * 8;
        out += leaf(0, -3, 62 + r() * 24 - Math.abs(a) * 0.3, 11.5, a, i % 2 ? 'l1' : 'l4');
      }
      [[-12, 98, -8], [14, 86, 10]].forEach(function (fl) {
        out += '<path class="stem" stroke-width="2" d="M0 -3Q' + (fl[0] * 0.5) + ' ' + (-fl[1] * 0.6) + ' ' + fl[0] + ' ' + (-fl[1]) + '"/>' +
          '<g transform="translate(' + fl[0] + ' ' + (-fl[1]) + ') rotate(' + fl[2] + ')"><path class="white" d="' + leafD(30, 11) + '"/><path class="vein vein--dark" d="M0 -2L0 -22"/><ellipse class="accent" cx="0" cy="-14" rx="2.2" ry="9"/></g>';
      });
      return out;
    },
    orchid: function (r) {
      var out = leaf(-6, -3, 54, 15, -62, 'l1') + leaf(6, -3, 54, 15, 62, 'l4') + leaf(-2, -3, 58, 15, -22, 'l2') + leaf(2, -3, 58, 15, 24, 'l1');
      var p0 = [0, -6], p1 = [8, -76], p2 = [34, -126], p3 = [62, -128];
      out += '<path class="stem" stroke-width="2.4" d="M0 -6C8 -76 34 -126 62 -128"/>';
      [0.34, 0.5, 0.65, 0.8, 0.95].forEach(function (t, i) {
        var pt = bez(p0, p1, p2, p3, t), s = 15 - i * 1.7;
        out += '<g transform="translate(' + f(pt[0]) + ' ' + f(pt[1]) + ') rotate(' + (i * 14) + ')">' +
          [0, 72, 144, 216, 288].map(function (a) { return '<ellipse class="white petal" cx="0" cy="' + f(-s * 0.55) + '" rx="' + f(s * 0.56) + '" ry="' + f(s * 0.62) + '" transform="rotate(' + a + ')"/>'; }).join('') +
          '<circle class="bloom" r="' + f(s * 0.22) + '"/></g>';
      });
      return out;
    },
    violet: function (r) {
      var out = '', i;
      for (i = 0; i < 10; i++) {
        var a = i * 36 + 10;
        out += '<g transform="translate(0 -8) scale(1 0.62) rotate(' + a + ')"><circle class="' + (i % 2 ? 'l1' : 'l2') + '" cx="0" cy="-18" r="12"/></g>';
      }
      for (i = 0; i < 7; i++) {
        var x = -24 + i * 8, y = -26 - (i % 3) * 5;
        out += '<g transform="translate(' + x + ' ' + y + ')">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse class="bloom2" cx="0" cy="-3.6" rx="3.1" ry="3.9" transform="rotate(' + a + ')"/>'; }).join('') + '<circle class="accent" r="1.6"/></g>';
      }
      return out;
    },
    anthurium: function (r) {
      var out = '', i;
      for (i = 0; i < 5; i++) {
        var a = -48 + i * 24;
        var h = 38 + (i % 2) * 14;
        var x = Math.sin(rad(a)) * h, y = -Math.cos(rad(a)) * h - 6;
        out += '<path class="stem" stroke-width="2.2" d="M0 -2Q' + f(x * 0.1) + ' ' + f(y * 0.6) + ' ' + f(x) + ' ' + f(y) + '"/>' + leaf(x, y, 38, 17, a * 0.8, i % 2 ? 'l1' : 'l2', { shape: 'heart' });
      }
      [[-18, 82, -14], [20, 92, 12], [2, 70, 0]].forEach(function (fl) {
        out += '<path class="stem" stroke-width="2" d="M0 -4Q' + fl[0] * 0.4 + ' ' + (-fl[1] * 0.6) + ' ' + fl[0] + ' ' + (-fl[1]) + '"/>' +
          '<g transform="translate(' + fl[0] + ' ' + (-fl[1]) + ') rotate(' + fl[2] + ')"><path class="accent" d="' + heartD(26, 12) + '" transform="rotate(180) translate(0 26)"/><path class="spadix" d="M0 -2L1 -14"/></g>';
      });
      return out;
    },
    empty: function () { return ''; }
  };

  /* ---- vasos (origem no centro do aro; fundo em y = h) ---- */
  var POT_BODY = { terracotta: 'clay', clay: 'clay', ceramic: 'l3', white: 'white', stone: 'stone', dark: 'l4', basket: 'clay-l', glaze: 'l2' };
  var POT_RIM = { terracotta: 'clay-d', clay: 'clay-d', ceramic: 'l2', white: 'white', stone: 'stone', dark: 'l1', basket: 'clay', glaze: 'l4' };
  function pot(style, w, h) {
    var rimH = h * 0.22, top = w * 0.43, bot = w * 0.3;
    var body = POT_BODY[style] || 'clay', rim = POT_RIM[style] || 'clay-d';
    var s = '<ellipse class="ground" cx="0" cy="' + f(h) + '" rx="' + f(w * 0.6) + '" ry="5"/>';
    s += '<path class="' + body + '" d="M' + f(-top) + ' ' + f(rimH) + 'L' + f(-bot) + ' ' + f(h - 7) + 'Q' + f(-bot) + ' ' + f(h) + ' ' + f(-bot + 7) + ' ' + f(h) + 'L' + f(bot - 7) + ' ' + f(h) + 'Q' + f(bot) + ' ' + f(h) + ' ' + f(bot) + ' ' + f(h - 7) + 'L' + f(top) + ' ' + f(rimH) + 'Z"/>';
    if (style === 'basket') {
      var hatch = '';
      for (var i = -5; i <= 5; i++) hatch += 'M' + f(i * w * 0.1) + ' ' + f(rimH + 2) + 'l' + f(-i * 0.8 + 7) + ' ' + f(h - rimH - 8);
      for (var j = 1; j <= 4; j++) hatch += 'M' + f(-top + j) + ' ' + f(rimH + (h - rimH) * j / 5) + 'h' + f((top - j) * 2);
      s += '<path class="weave" d="' + hatch + '"/>';
    }
    s += '<rect class="' + rim + '" x="' + f(-w / 2) + '" y="0" width="' + f(w) + '" height="' + f(rimH) + '" rx="3"/>';
    s += '<path class="shine" d="M' + f(-top * 0.7) + ' ' + f(rimH + 3) + 'L' + f(-bot * 0.7) + ' ' + f(h - 10) + '"/>';
    s += '<ellipse class="soil" cx="0" cy="1" rx="' + f(w * 0.44) + '" ry="4.2"/>';
    return s;
  }

  function planter(it) {
    var kind = it.kind, r = rng(it.seed || 7);
    var potW = it.potW || 62, potH = it.potH || 44, H = it.H || NOM[kind] || 100;
    var s = H / (NOM[kind] || 100);
    var plant = PLANTS[kind] ? PLANTS[kind](r) : '';
    var back = '';
    return '<g transform="translate(' + f(it.x || 0) + ' ' + f(it.y || 0) + ')">' +
      '<g transform="translate(0 ' + f(-potH) + ')">' + back + pot(it.pot || 'terracotta', potW, potH) +
      (plant ? '<g transform="scale(' + f(s * 1000) / 1000 + ')">' + plant + '</g>' : '') + '</g></g>';
  }

  /* ---- cena (SVG completo) ---- */
  function scene(o) {
    var w = o.w || 320, h = o.h || 180, bg = o.bg || 1;
    var vb = o.vb || '0 0 ' + w + ' ' + h;
    var s = '<svg class="art" xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice" ' +
      (o.label ? 'role="img" aria-label="' + o.label.replace(/"/g, '&quot;') + '"' : 'aria-hidden="true" focusable="false"') +
      ' style="--art-cut:var(--art-bg-' + (o.arch ? 1 : bg) + ')">';
    s += '<rect class="bg' + bg + '" x="-200" y="-200" width="' + (w + 400) + '" height="' + (h + 400) + '"/>';
    if (o.arch) {
      var aw = o.arch.w, ax = o.arch.x, ay = o.arch.y, ab = o.arch.b;
      s += '<path class="bg1" d="M' + f(ax - aw / 2) + ' ' + f(ab) + 'V' + f(ay + aw / 2) + 'A' + f(aw / 2) + ' ' + f(aw / 2) + ' 0 0 1 ' + f(ax + aw / 2) + ' ' + f(ay + aw / 2) + 'V' + f(ab) + 'Z"/>';
    }
    if (o.extra) s += o.extra;
    (o.items || []).forEach(function (it) { s += planter(it); });
    if (o.front) s += o.front;
    return s + '</svg>';
  }

  /* ---- produtos ---- */
  function productScene(p, view) {
    var a = p.art, w = 320, h = 180, base = 158;
    var items = (a.items || [{ kind: a.kind, x: 0, pot: a.pot, potW: a.potW, potH: a.potH, H: a.H, seed: p.n }]).map(function (it, i) {
      var o = {}; for (var k in it) o[k] = it[k];
      o.x = 160 + (it.x || 0); o.y = base; o.seed = o.seed || p.n + i;
      return o;
    });
    var label = (view === 'detail' ? 'Detalhe: ' : '') + p.alt;
    var o = { w: w, h: h, bg: view === 'detail' ? ((a.bg % 4) + 1) : a.bg, items: items, label: view === 'detail' ? null : label };
    if (a.extra === 'trowel') {
      o.front = '<g transform="translate(236 ' + (base - 6) + ') rotate(-18)"><rect class="clay-d" x="-3" y="-34" width="6" height="30" rx="3"/><path class="stone" d="M-8 -4h16l-5 22h-6z"/></g>';
    }
    if (view === 'detail') {
      var main = items[0], H = a.H || NOM[a.kind] || 100, potH = a.potH || 44;
      var cy = base - potH - H * 0.58;
      if (a.items) cy = base - 70;
      var cw = 118, ch = cw * 9 / 16;
      o.vb = f(160 - cw / 2) + ' ' + f(cy - ch / 2) + ' ' + f(cw) + ' ' + f(ch);
    }
    return scene(o);
  }

  function hero() {
    var w = 360, h = 440;
    return scene({
      w: w, h: h, bg: 3,
      arch: { w: 250, x: 180, y: 28, b: 340 },
      label: 'Ilustração de uma costela-de-adão em vaso de barro diante de uma janela em arco',
      extra: '<rect class="bg2" x="-200" y="340" width="900" height="300"/><ellipse class="ground" cx="180" cy="342" rx="120" ry="7"/>',
      items: [{ kind: 'monstera', x: 180, y: 392, potW: 110, potH: 80, H: 258, pot: 'terracotta', seed: 11 }]
    });
  }
  function leaves() {
    var w = 240, h = 170, s = '';
    var ls = [[-44, 150, 118, 40, -38, 'l4'], [80, 170, 124, 44, 34, 'l1'], [120, 175, 140, 46, 8, 'l2'], [30, 172, 110, 38, -8, 'l3'], [190, 175, 112, 38, 52, 'l4'], [150, 160, 120, 40, -24, 'l1']];
    ls.forEach(function (l) { s += leaf(l[0] + 40, l[1], l[2], l[3], l[4], l[5], { shape: 'heart' }); });
    return scene({ w: w, h: h, bg: 2, label: 'Ilustração em close de grandes folhas verdes sobrepostas', extra: s });
  }
  function atelier() {
    var w = 800, h = 520;
    var extra = '<rect class="bg2" x="-200" y="-200" width="1200" height="900"/>' +
      '<path class="bg1" d="M470 330V150A100 100 0 0 1 670 150V330Z"/>' +
      '<path class="mullion" d="M570 50V330M470 190H670"/>' +
      '<rect class="clay-d" x="40" y="330" width="720" height="14" rx="3"/>' +
      '<rect class="shelf-shadow" x="40" y="344" width="720" height="10"/>' +
      '<rect class="clay-d" x="40" y="478" width="720" height="14" rx="3"/>' +
      '<rect class="bg3" x="-200" y="492" width="1200" height="200"/>';
    var items = [
      { kind: 'monstera', x: 130, y: 330, potW: 76, potH: 56, H: 210, pot: 'terracotta', seed: 3 },
      { kind: 'snake', x: 270, y: 330, potW: 68, potH: 62, H: 190, pot: 'white', seed: 5 },
      { kind: 'fern', x: 410, y: 330, potW: 70, potH: 52, H: 150, pot: 'ceramic', seed: 8 },
      { kind: 'pothos', x: 560, y: 330, potW: 66, potH: 54, H: 130, pot: 'basket', seed: 4 },
      { kind: 'palm', x: 700, y: 330, potW: 70, potH: 58, H: 200, pot: 'dark', seed: 9 },
      { kind: 'succulent', x: 120, y: 478, potW: 56, potH: 40, H: 44, pot: 'terracotta', seed: 2 },
      { kind: 'cactus', x: 220, y: 478, potW: 52, potH: 40, H: 60, pot: 'white', seed: 6 },
      { kind: 'haworthia', x: 320, y: 478, potW: 54, potH: 38, H: 40, pot: 'stone', seed: 12 },
      { kind: 'herb', x: 430, y: 478, potW: 60, potH: 44, H: 70, pot: 'terracotta', seed: 13 },
      { kind: 'trailing', x: 560, y: 478, potW: 56, potH: 44, H: 48, pot: 'ceramic', seed: 15 },
      { kind: 'violet', x: 680, y: 478, potW: 54, potH: 40, H: 46, pot: 'glaze', seed: 17 }
    ];
    var front = '<g transform="translate(748 470) rotate(14)"><rect class="clay-d" x="-3" y="-34" width="6" height="30" rx="3"/><path class="stone" d="M-8 -4h16l-5 22h-6z"/></g>';
    return scene({ w: w, h: h, bg: 2, vb: '0 0 800 520', label: 'Ilustração de uma estante do ateliê com vasos de monstera, espada-de-são-jorge, samambaia, jiboia, palmeira, suculentas e ervas sob uma janela em arco', extra: extra, items: items, front: front });
  }
  function care(kind) {
    var w = 240, h = 180, s = '', bg = 1, label = '';
    if (kind === 'luz') {
      bg = 2; label = 'Ilustração de um sol com raios sobre uma folha';
      var rays = '';
      for (var i = 0; i < 12; i++) rays += '<path class="ray" d="M120 54V32" transform="rotate(' + i * 30 + ' 120 90)"/>';
      s = rays + '<circle class="accent" cx="120" cy="90" r="30"/>' + leaf(120, 176, 56, 22, -18, 'l1') + leaf(120, 176, 46, 18, 34, 'l2');
    } else if (kind === 'agua') {
      bg = 3; label = 'Ilustração de gotas de água caindo sobre a terra';
      var drop = 'M0 -22C10 -8 14 0 14 8A14 14 0 0 1 -14 8C-14 0 -10 -8 0 -22Z';
      s = '<path class="l2" transform="translate(84 62)" d="' + drop + '"/><path class="l3" transform="translate(130 96) scale(1.25)" d="' + drop + '"/><path class="l5" transform="translate(172 58) scale(0.8)" d="' + drop + '"/>' +
        '<ellipse class="soil" cx="120" cy="164" rx="86" ry="14"/>' + leaf(120, 164, 34, 12, 0, 'l1');
    } else {
      bg = 1; label = 'Ilustração em corte de um vaso com drenagem, substrato e uma muda';
      s = '<path class="clay" d="M62 76H178L164 168H76Z"/><rect class="clay-d" x="54" y="64" width="132" height="16" rx="4"/>' +
        '<path class="soil" d="M68 96H172L166 140H74Z"/><path class="stone" d="M74 140H166L164 160H76Z"/>' +
        '<path class="stem" stroke-width="2.4" d="M120 96V56"/>' + leaf(120, 62, 28, 12, -30, 'l1') + leaf(120, 62, 30, 12, 34, 'l2');
    }
    return scene({ w: w, h: h, bg: bg, label: label, extra: s });
  }

  VV.art = {
    scene: scene,
    planter: planter,
    product: productScene,
    hero: hero,
    leaves: leaves,
    atelier: atelier,
    care: care
  };
})();
