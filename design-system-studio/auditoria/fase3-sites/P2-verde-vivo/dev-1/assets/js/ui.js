/* Utilitários de interface reutilizáveis: foco, trava de rolagem,
   popovers (disclosure), drawer/bottom sheet e toasts. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var ui = (VV.ui = {});

  ui.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  ui.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  ui.isMobile = function () { return window.matchMedia('(max-width: 767px)').matches; };

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  ui.focusables = function (root) {
    return Array.prototype.slice.call(root.querySelectorAll(FOCUSABLE)).filter(function (el) {
      return !el.closest('[hidden]') && (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
    });
  };

  /* Prende o foco dentro de um ou mais contêineres */
  ui.trapFocus = function (containers) {
    function handler(e) {
      if (e.key !== 'Tab') return;
      var list = [];
      containers.forEach(function (c) { if (c) list = list.concat(ui.focusables(c)); });
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      var idx = list.indexOf(document.activeElement);
      if (e.shiftKey && (idx <= 0)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (idx === list.length - 1 || idx === -1)) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', handler, true);
    return function release() { document.removeEventListener('keydown', handler, true); };
  };

  /* Trava a rolagem do corpo (contagem para sobreposições aninhadas) */
  var locks = 0;
  ui.lockScroll = function () {
    if (locks++ === 0) {
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', sbw + 'px');
      document.documentElement.classList.add('is-locked');
    }
  };
  ui.unlockScroll = function () {
    if (locks > 0 && --locks === 0) document.documentElement.classList.remove('is-locked');
  };

  /* Mantém um popover dentro da viewport (8 px de margem) */
  ui.fitToViewport = function (panel) {
    panel.style.transform = '';
    var rect = panel.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var dx = 0;
    if (rect.right > vw - 8) dx = (vw - 8) - rect.right;
    if (rect.left + dx < 8) dx = 8 - rect.left;
    if (dx) panel.style.transform = 'translateX(' + Math.round(dx) + 'px)';
  };

  /* ---------- Popover / disclosure ---------- */
  var openPopovers = [];
  ui.closeAllPopovers = function (except) {
    openPopovers.slice().forEach(function (p) { if (p !== except) p.close(false); });
  };
  ui.Popover = function (btn, panel, opts) {
    opts = opts || {};
    var api = { isOpen: false, btn: btn, panel: panel };
    function onDoc(e) {
      if (!panel.contains(e.target) && !btn.contains(e.target)) api.close(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); api.close(true); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var items = ui.focusables(panel);
        if (!items.length) return;
        var i = items.indexOf(document.activeElement);
        if (i === -1 && !panel.contains(document.activeElement)) return;
        e.preventDefault();
        var n = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[n].focus();
      }
    }
    api.open = function (focusFirst) {
      if (api.isOpen) return;
      ui.closeAllPopovers(api);
      panel.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      api.isOpen = true;
      openPopovers.push(api);
      if (opts.fit !== false) ui.fitToViewport(panel);
      document.addEventListener('pointerdown', onDoc, true);
      document.addEventListener('keydown', onKey);
      if (focusFirst) {
        var f = ui.focusables(panel)[0];
        if (f) f.focus();
      }
      if (opts.onOpen) opts.onOpen();
    };
    api.close = function (returnFocus) {
      if (!api.isOpen) return;
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      api.isOpen = false;
      openPopovers = openPopovers.filter(function (p) { return p !== api; });
      document.removeEventListener('pointerdown', onDoc, true);
      document.removeEventListener('keydown', onKey);
      if (returnFocus) btn.focus();
      if (opts.onClose) opts.onClose();
    };
    api.toggle = function (focusFirst) { if (api.isOpen) api.close(false); else api.open(focusFirst); };
    btn.setAttribute('aria-expanded', 'false');
    if (!opts.manualClick) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        api.toggle(e.detail === 0 || opts.focusOnClick !== false);
      });
    }
    return api;
  };
  ui.anyPopoverOpen = function () { return openPopovers.length > 0; };

  /* ---------- Drawer (lateral ou bottom sheet) ---------- */
  ui.Drawer = function (root, opts) {
    opts = opts || {};
    var panel = root.querySelector('.drawer__panel');
    var trigger = null, release = null, closeTimer = null;
    var api = { isOpen: false, root: root };

    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); api.close(); } }

    api.open = function (fromEl) {
      if (api.isOpen) return;
      clearTimeout(closeTimer);
      trigger = fromEl || document.activeElement;
      ui.closeAllPopovers();
      root.hidden = false;
      root.style.removeProperty('--drag');
      void root.offsetWidth; // força o reflow para animar
      root.classList.add('is-open');
      api.isOpen = true;
      VV.overlayOpen = (VV.overlayOpen || 0) + 1;
      ui.lockScroll();
      release = ui.trapFocus([panel]);
      document.addEventListener('keydown', onKey);
      var target = panel.querySelector('[data-autofocus]') || ui.focusables(panel)[0];
      if (target) setTimeout(function () { target.focus({ preventScroll: true }); }, 30);
      if (opts.onOpen) opts.onOpen();
    };
    api.close = function (opt) {
      if (!api.isOpen) return;
      root.classList.remove('is-open');
      api.isOpen = false;
      VV.overlayOpen = Math.max(0, (VV.overlayOpen || 1) - 1);
      ui.unlockScroll();
      if (release) release();
      document.removeEventListener('keydown', onKey);
      var dur = ui.reducedMotion() ? 0 : 240;
      closeTimer = setTimeout(function () { root.hidden = true; root.style.removeProperty('--drag'); }, dur);
      if (!(opt && opt.noFocus) && trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
      if (opts.onClose) opts.onClose();
    };
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) api.close();
    });

    /* Alça de arraste do bottom sheet */
    var startY = null, dy = 0;
    var dragZones = root.querySelectorAll('.drawer__handle, .drawer__head');
    Array.prototype.forEach.call(dragZones, function (zone) {
      zone.addEventListener('pointerdown', function (e) {
        if (!root.classList.contains('drawer--sheet') || !ui.isMobile()) return;
        if (e.target.closest('button')) return;
        startY = e.clientY; dy = 0;
        root.classList.add('is-dragging');
        zone.setPointerCapture(e.pointerId);
      });
      zone.addEventListener('pointermove', function (e) {
        if (startY == null) return;
        dy = Math.max(0, e.clientY - startY);
        root.style.setProperty('--drag', dy + 'px');
      });
      function end() {
        if (startY == null) return;
        startY = null;
        root.classList.remove('is-dragging');
        if (dy > 110) api.close();
        else root.style.removeProperty('--drag');
      }
      zone.addEventListener('pointerup', end);
      zone.addEventListener('pointercancel', end);
    });
    return api;
  };

  /* ---------- Toasts ---------- */
  ui.toast = function (msg, icon) {
    var region = document.getElementById('toasts');
    if (!region) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = VV.icon(icon || 'check') + '<span>' + ui.esc(msg) + '</span>';
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 3200);
  };

  ui.demo = function (what) {
    ui.toast((what ? what + ': ' : '') + 'fora do escopo desta demonstração.', 'alert');
  };
})();
