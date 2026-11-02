/* ==========================================================================
   Verde Vivo — utilitários, estado (carrinho/favoritos), overlays, popovers, toasts
   ========================================================================== */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  /* ---------- helpers ---------- */
  VV.$ = function (sel, root) { return (root || document).querySelector(sel); };
  VV.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  VV.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  VV.icon = function (name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  };
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  VV.money = function (n) { return brl.format(n).replace(/ /g, ' '); };
  VV.debounce = function (fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms);
    };
  };
  VV.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  VV.isMobile = function () { return window.matchMedia('(max-width: 767px)').matches; };
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  VV.focusables = function (root) {
    return VV.$$(FOCUSABLE, root).filter(function (el) {
      return !el.hidden && !el.closest('[hidden]') && !el.closest('[inert]') && el.getClientRects().length > 0 && el.getAttribute('aria-disabled') !== 'true';
    });
  };

  /* ---------- pub/sub ---------- */
  var handlers = {};
  VV.on = function (ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); };
  VV.emit = function (ev, data) { (handlers[ev] || []).forEach(function (fn) { fn(data); }); };

  /* ---------- armazenamento (localStorage com fallback em memória) ---------- */
  var mem = {};
  function read(key, fallback) {
    try {
      var v = window.localStorage.getItem('vv:' + key);
      if (v != null) return JSON.parse(v);
    } catch (e) { /* bloqueado: segue em memória */ }
    return key in mem ? mem[key] : fallback;
  }
  function write(key, val) {
    mem[key] = val;
    try { window.localStorage.setItem('vv:' + key, JSON.stringify(val)); } catch (e) { /* ignora */ }
  }
  function sread(key) { try { return window.sessionStorage.getItem('vv:' + key); } catch (e) { return mem['s:' + key] || null; } }
  function swrite(key, v) { mem['s:' + key] = v; try { window.sessionStorage.setItem('vv:' + key, v); } catch (e) { /* ignora */ } }
  VV.session = { get: sread, set: swrite };

  var cart = read('cart', []).filter(function (l) { return VV.productById(l.id); });
  var favs = read('favs', []).filter(function (id) { return VV.productById(id); });
  var recents = read('recents', ['Samambaia', 'Pet friendly']);
  var cep = read('cep', null);

  VV.cart = {
    lines: function () { return cart.slice(); },
    count: function () { return cart.reduce(function (s, l) { return s + l.qty; }, 0); },
    subtotal: function () {
      return cart.reduce(function (s, l) { var p = VV.productById(l.id); return s + p.price * l.qty; }, 0);
    },
    qty: function (id) { var l = cart.filter(function (x) { return x.id === id; })[0]; return l ? l.qty : 0; },
    add: function (id, n) {
      var p = VV.productById(id);
      if (!p || p.stock <= 0) return false;
      var l = cart.filter(function (x) { return x.id === id; })[0];
      var max = Math.min(p.stock, 10);
      if (l) { l.qty = Math.min(max, l.qty + (n || 1)); } else { cart.push({ id: id, qty: Math.min(max, n || 1) }); }
      write('cart', cart); VV.emit('cart', { added: id });
      return true;
    },
    set: function (id, qty) {
      var p = VV.productById(id), max = p ? Math.min(p.stock, 10) : 10;
      cart = cart.map(function (l) { return l.id === id ? { id: id, qty: Math.max(0, Math.min(max, qty)) } : l; })
        .filter(function (l) { return l.qty > 0; });
      write('cart', cart); VV.emit('cart', {});
    },
    remove: function (id) { cart = cart.filter(function (l) { return l.id !== id; }); write('cart', cart); VV.emit('cart', {}); },
    clear: function () { cart = []; write('cart', cart); VV.emit('cart', {}); }
  };
  VV.FREE_SHIPPING = 199;

  VV.favs = {
    has: function (id) { return favs.indexOf(id) > -1; },
    all: function () { return favs.slice(); },
    count: function () { return favs.length; },
    toggle: function (id) {
      var i = favs.indexOf(id);
      if (i > -1) favs.splice(i, 1); else favs.push(id);
      write('favs', favs); VV.emit('favs', { id: id, on: i === -1 });
      return i === -1;
    }
  };

  VV.recents = {
    all: function () { return recents.slice(); },
    add: function (t) {
      t = String(t || '').trim();
      if (!t) return;
      recents = [t].concat(recents.filter(function (r) { return VV.norm(r) !== VV.norm(t); })).slice(0, 5);
      write('recents', recents);
    },
    clear: function () { recents = []; write('recents', recents); }
  };
  VV.cep = {
    get: function () { return cep; },
    set: function (v) { cep = v; write('cep', v); VV.emit('cep', v); }
  };

  /* ---------- toasts ---------- */
  VV.toast = function (msg, opts) {
    opts = opts || {};
    var host = VV.$('#toasts');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (opts.type || 'info');
    el.innerHTML = VV.icon(opts.type === 'success' ? 'check' : opts.type === 'error' ? 'circle-alert' : 'info') +
      '<span>' + VV.esc(msg) + '</span>';
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    setTimeout(function () {
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 260);
    }, opts.ms || 3200);
  };

  /* ---------- overlays modais (drawer, bottom sheet, modal) ---------- */
  var stack = [];
  function setInert(on) {
    VV.$$('[data-app-root]').forEach(function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  VV.overlay = {
    isOpen: function (el) { return stack.indexOf(el) > -1; },
    any: function () { return stack.length > 0; },
    open: function (el, trigger) {
      if (stack.indexOf(el) > -1) return;
      VV.popoverCloseAll && VV.popoverCloseAll();
      el._trigger = trigger || document.activeElement;
      el.hidden = false;
      stack.push(el);
      document.documentElement.classList.add('no-scroll');
      setInert(true);
      void el.offsetWidth;
      el.classList.add('is-open');
      var panel = VV.$('[data-panel]', el) || el;
      var first = VV.$('[data-autofocus]', el) || VV.focusables(panel)[0] || panel;
      if (first === panel) panel.setAttribute('tabindex', '-1');
      first.focus({ preventScroll: true });
      el.dispatchEvent(new CustomEvent('overlay:open'));
    },
    close: function (el) {
      var i = stack.indexOf(el);
      if (i < 0) return;
      stack.splice(i, 1);
      el.classList.remove('is-open');
      var panel = VV.$('[data-panel]', el);
      if (panel) panel.style.transform = '';
      var done = function () { if (!el.classList.contains('is-open')) el.hidden = true; };
      setTimeout(done, VV.reducedMotion() ? 0 : 260);
      if (!stack.length) {
        document.documentElement.classList.remove('no-scroll');
        setInert(false);
      }
      var t = el._trigger;
      if (t && document.body.contains(t) && t.getClientRects().length) t.focus({ preventScroll: true });
      else { var m = VV.$('#main'); m && m.focus({ preventScroll: true }); }
      el.dispatchEvent(new CustomEvent('overlay:close'));
    }
  };
  document.addEventListener('keydown', function (e) {
    if (!stack.length) return;
    var top = stack[stack.length - 1];
    if (e.key === 'Escape') {
      e.preventDefault();
      VV.overlay.close(top);
    } else if (e.key === 'Tab') {
      var items = VV.focusables(VV.$('[data-panel]', top) || top);
      if (!items.length) { e.preventDefault(); return; }
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !top.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !top.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-close]');
    if (!c) return;
    var ov = c.closest('.overlay');
    if (ov && stack.indexOf(ov) > -1) VV.overlay.close(ov);
  });

  /* Arraste da alça do bottom sheet (celular) */
  VV.sheetDrag = function (overlay) {
    var handle = VV.$('[data-handle]', overlay), panel = VV.$('[data-panel]', overlay);
    if (!handle || !panel) return;
    var startY = null, dy = 0;
    handle.addEventListener('pointerdown', function (e) {
      startY = e.clientY; dy = 0;
      panel.style.transition = 'none';
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', function (e) {
      if (startY == null) return;
      dy = Math.max(0, e.clientY - startY);
      panel.style.transform = 'translateY(' + dy + 'px)';
    });
    function end() {
      if (startY == null) return;
      panel.style.transition = '';
      startY = null;
      if (dy > 90) VV.overlay.close(overlay); else panel.style.transform = '';
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };

  /* ---------- popovers posicionados dentro da viewport ---------- */
  var pops = [];
  VV.popoverCloseAll = function (except) {
    pops.forEach(function (p) { if (p !== except && p.isOpen()) p.close(); });
  };
  VV.popover = function (trigger, panel, opts) {
    opts = opts || {};
    var openState = false;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panel.id);
    function position() {
      var r = trigger.getBoundingClientRect(), vw = document.documentElement.clientWidth;
      var pw = Math.min(panel.offsetWidth, vw - 16);
      var alignRight = opts.align ? opts.align === 'right' : (r.left + r.width / 2 > vw / 2);
      var left = alignRight ? r.right - pw : r.left;
      left = Math.max(8, Math.min(left, vw - pw - 8));
      panel.style.left = left + 'px';
      panel.style.top = r.bottom + 8 + 'px';
      panel.style.maxHeight = 'calc(100dvh - ' + (r.bottom + 16) + 'px)';
    }
    var api = {
      isOpen: function () { return openState; },
      open: function (focusFirst) {
        VV.popoverCloseAll(api);
        panel.hidden = false;
        openState = true;
        trigger.setAttribute('aria-expanded', 'true');
        position();
        if (opts.onOpen) opts.onOpen();
        if (focusFirst !== false) {
          var f = VV.$('[data-autofocus]', panel) || VV.focusables(panel)[0];
          f && f.focus({ preventScroll: true });
        }
      },
      close: function (returnFocus) {
        if (!openState) return;
        panel.hidden = true;
        openState = false;
        trigger.setAttribute('aria-expanded', 'false');
        if (returnFocus) trigger.focus({ preventScroll: true });
      },
      toggle: function () { openState ? api.close() : api.open(); },
      position: position
    };
    pops.push(api);
    trigger.addEventListener('click', function () { api.toggle(); });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); api.close(true); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (openState && !panel.contains(e.target) && !trigger.contains(e.target)) api.close();
    });
    window.addEventListener('resize', function () { openState && position(); });
    window.addEventListener('scroll', function () { openState && position(); }, { passive: true });
    return api;
  };
})();
