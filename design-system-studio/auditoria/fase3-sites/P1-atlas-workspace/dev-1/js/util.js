/* Utilitários compartilhados: escape, storage seguro, formatação,
   foco, popovers/menus/bottom sheets, tooltips, toasts e modais. */
(function () {
  var A = window.Atlas = window.Atlas || {};

  var u = A.u = {};

  u.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  /** Normaliza para busca: sem acentos e sem diferenciar maiúsculas. */
  u.norm = function (s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };
  u.qs = function (sel, root) { return (root || document).querySelector(sel); };
  u.qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  u.uid = function (p) { return (p || 'id') + '-' + Math.random().toString(36).slice(2, 9); };
  u.initials = function (name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    var first = parts[0][0] || '';
    var last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  };
  u.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  };
  u.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  u.reducedMotion = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ---------- Storage: sempre em try/catch (modo privado, bloqueios) ---------- */
  u.store = {
    get: function (key, fallback, session) {
      try {
        var raw = (session ? sessionStorage : localStorage).getItem('atlas.' + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value, session) {
      try { (session ? sessionStorage : localStorage).setItem('atlas.' + key, JSON.stringify(value)); } catch (e) { /* ignora */ }
    },
    del: function (key) {
      try { localStorage.removeItem('atlas.' + key); } catch (e) { /* ignora */ }
      try { sessionStorage.removeItem('atlas.' + key); } catch (e) { /* ignora */ }
    }
  };

  /* ---------- Formatação pt-BR ---------- */
  var nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  u.money = function (n) { return brl.format(n); };
  u.num = function (n) { return nf0.format(n); };
  u.dec1 = function (n) { return nf1.format(n); };
  u.milBRL = function (n) { return 'R$ ' + nf1.format(n / 1000) + ' mil'; };
  u.pct = function (n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + nf1.format(Math.abs(n)) + '%'; };
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  u.MESES = MESES; u.MESES_LONGOS = MESES_LONGOS; u.DIAS = DIAS;
  u.parseDate = function (iso) { var p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  u.isoDate = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  u.dateBR = function (iso) { var d = u.parseDate(iso); return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); };
  u.dateShort = function (iso) { var d = u.parseDate(iso); return d.getDate() + ' ' + MESES[d.getMonth()]; };
  u.dateLong = function (d) { return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES_LONGOS[d.getMonth()] + ' de ' + d.getFullYear(); };

  /* ---------- Breakpoints ---------- */
  u.mode = function () {
    var w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  };
  u.isMobile = function () { return u.mode() === 'mobile'; };

  /* ---------- Foco ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  u.focusables = function (root) {
    return u.qsa(FOCUSABLE, root).filter(function (el) {
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  };
  /** Prende o foco dentro de "root" (drawers, sheets, overlays). Retorna função para soltar. */
  u.trapFocus = function (root) {
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var f = u.focusables(root);
      if (!f.length) { e.preventDefault(); root.focus(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('keydown', onKey, true); };
  };

  var lockCount = 0;
  u.lockScroll = function (on) {
    lockCount = Math.max(0, lockCount + (on ? 1 : -1));
    document.body.classList.toggle('is-locked', lockCount > 0);
  };

  /** Navegação por setas em menus (role="menu"). */
  u.menuKeys = function (menu) {
    menu.addEventListener('keydown', function (e) {
      var items = u.qsa('[role="menuitem"]', menu);
      if (!items.length) return;
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    });
  };

  /* ---------- Popover / menu / bottom sheet ---------- */
  var pop = A.pop = { cur: null };

  /**
   * Abre um painel flutuante ancorado em "trigger".
   * opts: { html, title, placement: 'bottom-end'|'bottom-start'|'top-start'|'top-end'|'right-start',
   *         role: 'menu'|'dialog', width, sheet (bool: vira bottom sheet no celular), onMount(panel, close) }
   */
  pop.open = function (trigger, opts) {
    if (pop.cur && pop.cur.trigger === trigger) { pop.close(true); return; }
    pop.close(false);
    opts = opts || {};
    var portal = document.getElementById('portal');
    var asSheet = opts.sheet !== false && u.isMobile();
    var panel = document.createElement('div');
    var id = u.uid('pop');
    panel.id = id;
    panel.tabIndex = -1;
    var scrim = null, release = null;

    if (asSheet) {
      scrim = document.createElement('div');
      scrim.className = 'scrim';
      portal.appendChild(scrim);
      panel.className = 'sheet';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      var hid = id + '-t';
      panel.setAttribute('aria-labelledby', hid);
      panel.innerHTML = '<div class="sheet__head"><h2 id="' + hid + '">' + u.esc(opts.title || '') + '</h2>' +
        '<button type="button" class="icon-btn" data-close aria-label="Fechar">' + A.icon('x', 22) + '</button></div>' +
        '<div class="sheet__body">' + opts.html + '</div>';
      portal.appendChild(panel);
      release = u.trapFocus(panel);
      u.lockScroll(true);
      scrim.addEventListener('click', function () { pop.close(true); });
    } else {
      panel.className = 'popover' + (opts.cls ? ' ' + opts.cls : '');
      if (opts.width) panel.style.width = opts.width + 'px';
      if (opts.role === 'dialog') {
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', opts.title || '');
      }
      panel.innerHTML = opts.html;
      portal.appendChild(panel);
      position(panel, trigger, opts.placement || 'bottom-end');
    }

    trigger.setAttribute('aria-expanded', 'true');
    if (!trigger.getAttribute('aria-controls')) trigger.setAttribute('aria-controls', id);

    function onDoc(e) {
      if (panel.contains(e.target) || trigger.contains(e.target)) return;
      if (scrim && e.target === scrim) return;
      pop.close(false);
    }
    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); pop.close(true); } }
    function onReflow() { if (!asSheet && pop.cur) position(panel, trigger, opts.placement || 'bottom-end'); }

    document.addEventListener('pointerdown', onDoc, true);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);

    panel.addEventListener('click', function (e) {
      var c = e.target.closest('[data-close]');
      if (c) { pop.close(true); return; }
      var item = e.target.closest('a[href], [data-autoclose]');
      if (item) pop.close(false);
    });

    var menu = panel.querySelector('[role="menu"]');
    if (menu) u.menuKeys(menu);

    pop.cur = {
      trigger: trigger, panel: panel, scrim: scrim,
      cleanup: function () {
        document.removeEventListener('pointerdown', onDoc, true);
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('resize', onReflow);
        window.removeEventListener('scroll', onReflow, true);
        if (release) release();
        if (asSheet) u.lockScroll(false);
      }
    };

    if (opts.onMount) opts.onMount(panel, function () { pop.close(true); });

    // foco inicial: primeiro item do menu ou o próprio painel
    var first = panel.querySelector('[role="menuitem"]') || panel.querySelector('[data-autofocus]');
    (first || panel).focus({ preventScroll: true });
    return panel;
  };

  pop.close = function (returnFocus) {
    var c = pop.cur;
    if (!c) return;
    pop.cur = null;
    c.cleanup();
    c.trigger.setAttribute('aria-expanded', 'false');
    if (c.panel.parentNode) c.panel.parentNode.removeChild(c.panel);
    if (c.scrim && c.scrim.parentNode) c.scrim.parentNode.removeChild(c.scrim);
    if (returnFocus && document.contains(c.trigger)) c.trigger.focus({ preventScroll: true });
  };

  function position(panel, trigger, placement) {
    var m = 8;
    var r = trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    panel.style.maxHeight = '';
    var pw = Math.min(panel.offsetWidth, vw - 2 * m);
    var ph = panel.offsetHeight;
    var top, left;
    var side = placement.split('-')[0];
    var align = placement.split('-')[1] || 'start';
    if (side === 'right') {
      left = r.right + m;
      top = align === 'end' ? r.bottom - ph : r.top;
      if (left + pw > vw - m) left = Math.max(m, r.left - pw - m);
    } else {
      left = align === 'end' ? r.right - pw : r.left;
      var below = vh - r.bottom - m;
      var above = r.top - m;
      var wantTop = side === 'top';
      if (wantTop && above < ph && below > above) wantTop = false;
      if (!wantTop && below < ph && above > below) wantTop = true;
      if (wantTop) {
        top = Math.max(m, r.top - ph - 6);
        panel.style.maxHeight = (r.top - 6 - m) + 'px';
      } else {
        top = r.bottom + 6;
        panel.style.maxHeight = (vh - top - m) + 'px';
      }
    }
    left = Math.max(m, Math.min(left, vw - pw - m));
    if (side === 'right') {
      top = Math.max(m, Math.min(top, vh - ph - m));
    }
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }
  pop.position = position;

  /* ---------- Tooltip único (posição fixa, sempre dentro da viewport) ---------- */
  var tip = null;
  A.tip = {
    show: function (anchor, text, side) {
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'tooltip';
        tip.id = 'atlas-tooltip';
        tip.setAttribute('role', 'tooltip');
        document.body.appendChild(tip);
      }
      tip.textContent = text;
      tip.hidden = false;
      var r = anchor.getBoundingClientRect();
      var vw = document.documentElement.clientWidth, vh = window.innerHeight;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left, top;
      if (side === 'right') { left = r.right + 10; top = r.top + r.height / 2 - th / 2; }
      else { left = r.left + r.width / 2 - tw / 2; top = r.top - th - 8; if (top < 8) top = r.bottom + 8; }
      left = Math.max(8, Math.min(left, vw - tw - 8));
      top = Math.max(8, Math.min(top, vh - th - 8));
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    },
    showAt: function (x, y, text) {
      this.show({ getBoundingClientRect: function () { return { left: x, right: x, top: y, bottom: y, width: 0, height: 0 }; } }, text, 'top');
    },
    hide: function () { if (tip) tip.hidden = true; }
  };

  /* ---------- Toasts ---------- */
  A.toast = function (text, action) {
    var box = document.getElementById('toasts');
    if (!box) return;
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<p>' + u.esc(text) + '</p>' + (action ? '<button type="button">' + u.esc(action.label) + '</button>' : '');
    box.appendChild(t);
    var timer = setTimeout(remove, action ? 7000 : 4000);
    function remove() { clearTimeout(timer); if (t.parentNode) t.parentNode.removeChild(t); }
    if (action) t.querySelector('button').addEventListener('click', function () { action.run(); remove(); });
  };

  /* ---------- Modal (dialog nativo) ---------- */
  A.modal = function (opts) {
    var d = document.createElement('dialog');
    var hid = u.uid('dlg');
    d.className = 'modal';
    d.setAttribute('aria-labelledby', hid);
    d.innerHTML = '<div class="modal__head"><h2 id="' + hid + '">' + u.esc(opts.title) + '</h2>' +
      '<button type="button" class="icon-btn" data-close aria-label="Fechar">' + A.icon('x', 20) + '</button></div>' +
      '<div class="modal__body">' + opts.body + '</div>' +
      (opts.foot ? '<div class="modal__foot">' + opts.foot + '</div>' : '');
    var opener = document.activeElement;
    document.getElementById('portal').appendChild(d);
    function close() { if (d.open) d.close(); }
    d.addEventListener('close', function () {
      if (d.parentNode) d.parentNode.removeChild(d);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
      if (opts.onClose) opts.onClose();
    });
    d.addEventListener('click', function (e) {
      if (e.target === d) { close(); return; } // clique no backdrop
      if (e.target.closest('[data-close]')) close();
    });
    d.showModal();
    var af = d.querySelector('[data-autofocus]');
    if (af) af.focus();
    if (opts.onMount) opts.onMount(d, close);
    return { el: d, close: close };
  };

  /* ---------- Validação ---------- */
  u.validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); };

  /** Hash não criptográfico — só para a demonstração não guardar a senha em texto puro. */
  u.demoHash = function (s) {
    var h = 5381; s = String(s);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  };
})();
