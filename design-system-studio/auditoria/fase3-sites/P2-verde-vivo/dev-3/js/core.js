/* Núcleo: utilidades, camadas (drawers/dialogs com foco preso e Esc), roteamento por hash e toast. */
(function () {
  'use strict';
  var VV = window.VV;

  VV.$ = function (s, r) { return (r || document).querySelector(s); };
  VV.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  VV.money = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  VV.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  VV.icon = function (name, cls) {
    return '<svg class="ico ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  };
  VV.norm = function (s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };
  VV.reducedMotion = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  VV.isMobile = function () { return window.matchMedia('(max-width: 767px)').matches; };
  VV.visible = function (el) { return !!el && el.getClientRects().length > 0; };
  VV.artProduct = function (p, w, h) {
    return VV.art(p.id, { w: w, h: h, tone: p.tom, leaves: p.arte === 'folha' });
  };

  /* ---------- Camadas: drawers e dialogs ---------- */
  var stack = [];
  var overlay = VV.$('#overlay');

  VV.focusable = function (root) {
    return VV.$$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])', root).filter(function (el) {
      return !el.disabled && el.getAttribute('aria-disabled') !== 'true' && el.getClientRects().length > 0;
    });
  };

  VV.open = function (layer, opts) {
    opts = opts || {};
    if (stack.indexOf(layer) !== -1) return;
    layer._trigger = opts.trigger || document.activeElement;
    stack.push(layer);
    layer.classList.add('is-open');
    overlay.classList.add('is-on');
    document.documentElement.classList.add('lock');
    var target = opts.focus ? VV.$(opts.focus, layer) : null;
    (target || VV.focusable(layer)[0] || layer).focus({ preventScroll: true });
  };

  VV.close = function (layer, opts) {
    var i = stack.indexOf(layer);
    if (i === -1) return;
    stack.splice(i, 1);
    layer.classList.remove('is-open');
    if (!stack.length) {
      overlay.classList.remove('is-on');
      document.documentElement.classList.remove('lock');
    }
    var back = layer._trigger;
    layer._trigger = null;
    if (!(opts && opts.noFocus) && back && document.contains(back) && VV.visible(back)) {
      back.focus({ preventScroll: true });
    }
  };

  VV.topLayer = function () { return stack[stack.length - 1]; };

  overlay.addEventListener('click', function () {
    var top = VV.topLayer();
    if (top) VV.close(top);
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-close]');
    if (!b) return;
    var layer = b.closest('.drawer, .dialog');
    if (layer) VV.close(layer);
  });

  document.addEventListener('keydown', function (e) {
    var top = VV.topLayer();
    if (!top) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      VV.close(top);
      return;
    }
    if (e.key === 'Tab') {
      var f = VV.focusable(top);
      if (!f.length) { e.preventDefault(); top.focus(); return; }
      var first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (e.shiftKey && (a === first || !top.contains(a) || a === top)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (a === last || !top.contains(a))) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* ---------- Roteamento por hash: #/ (landing) e #/catalogo?params ---------- */
  VV.routes = [];
  VV.onRoute = function (fn) { VV.routes.push(fn); };

  VV.parseHash = function () {
    var h = location.hash || '#/';
    if (h.indexOf('#/') !== 0) return null;
    var raw = h.slice(2);
    var q = raw.indexOf('?');
    var path = q === -1 ? raw : raw.slice(0, q);
    var params = {};
    if (q !== -1) {
      new URLSearchParams(raw.slice(q + 1)).forEach(function (v, k) { params[k] = v; });
    }
    return { path: path, params: params };
  };

  VV.route = function () {
    var r = VV.parseHash();
    if (!r) return; // âncora dentro da página atual: o navegador rola sozinho
    var view = r.path === 'catalogo' ? 'catalogo' : 'landing';
    var target = VV.$('[data-view="' + view + '"]');
    var current = VV.$('[data-view]:not([hidden])');
    if (current !== target) {
      if (current) current.hidden = true;
      target.hidden = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    document.title = view === 'catalogo' ? 'Verde Vivo | Catálogo de plantas' : 'Folha Viva | Plantas para casa';
    VV.routes.forEach(function (fn) { fn(view, r.params); });
  };
  window.addEventListener('hashchange', VV.route);

  /* ---------- Toast ---------- */
  var toastEl = VV.$('#toast');
  var toastTimer = null;
  VV.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2800);
  };

  /* Links de demonstração (sem página real): avisam em vez de navegar */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-demo], [data-demo-item]');
    if (!a) return;
    e.preventDefault();
    VV.toast('Demonstração: esta área não está disponível.');
  });
})();
