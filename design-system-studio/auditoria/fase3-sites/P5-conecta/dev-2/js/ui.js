/* Conecta — comportamentos de interface reutilizáveis:
   diálogos/drawer (foco preso, inert, trava de rolagem), popovers/menus, toasts, bottom sheet. */
(function (C) {
  'use strict';
  var $ = C.$, esc = C.esc, icon = C.icon;

  /* ---------------- trava de rolagem do corpo ---------------- */
  var lockCount = 0;
  function lock() { if (lockCount++ === 0) document.documentElement.classList.add('is-locked'); }
  function unlock() { lockCount = Math.max(0, lockCount - 1); if (lockCount === 0) document.documentElement.classList.remove('is-locked'); }

  /* ---------------- conteúdo de fundo inerte ---------------- */
  var BG_IDS = ['shell', 'auth'];
  function setBackgroundInert(on) {
    BG_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }

  /* ---------------- pilha de diálogos ---------------- */
  var stack = [];

  function open(root, opts) {
    opts = opts || {};
    var entry = {
      root: root,
      trigger: opts.trigger || document.activeElement,
      onClose: opts.onClose,
      panel: root.querySelector('[role="dialog"]') || root
    };
    stack.push(entry);
    root.hidden = false;
    if (stack.length === 1) { lock(); setBackgroundInert(true); }
    if (!root.__wired) {
      root.__wired = true;
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-dismiss]')) close(root);
      });
    }
    // força o layout antes da transição de entrada
    void root.offsetWidth;
    root.classList.add('is-open');

    var target = null;
    if (opts.initialFocus) target = typeof opts.initialFocus === 'string' ? root.querySelector(opts.initialFocus) : opts.initialFocus;
    if (!target) target = C.focusables(entry.panel)[0];
    (target || entry.panel).focus({ preventScroll: true });
    return entry;
  }

  function close(root) {
    var i = stack.findIndex(function (e) { return e.root === root; });
    if (i < 0) return;
    var entry = stack.splice(i, 1)[0];
    root.classList.remove('is-open');
    var finish = function () { root.hidden = true; if (root.__removeOnClose) root.remove(); };
    if (C.reducedMotion()) finish(); else setTimeout(finish, 270);
    if (!stack.length) { unlock(); setBackgroundInert(false); }
    var t = entry.trigger;
    if (t && document.contains(t) && !t.closest('[hidden]')) t.focus({ preventScroll: true });
    else { var m = document.getElementById('main'); if (m && !m.closest('[hidden]')) m.focus({ preventScroll: true }); }
    if (entry.onClose) entry.onClose();
  }

  function top() { return stack[stack.length - 1]; }

  document.addEventListener('keydown', function (e) {
    var t = top();
    if (!t) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(t.root); return; }
    if (e.key === 'Tab') {
      var f = C.focusables(t.panel);
      if (!f.length) { e.preventDefault(); t.panel.focus(); return; }
      var first = f[0], last = f[f.length - 1], active = document.activeElement;
      if (e.shiftKey && (active === first || !t.panel.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !t.panel.contains(active))) { e.preventDefault(); first.focus(); }
    }
  }, true);

  /* ---------------- modal / bottom sheet ---------------- */
  var modalSeq = 0;
  function modal(o) {
    var id = 'dlg' + (++modalSeq);
    var root = document.createElement('div');
    root.className = 'dialog mm ' + (o.className || '');
    root.hidden = true;
    root.innerHTML =
      '<div class="dialog__scrim" data-dismiss></div>' +
      '<div class="dialog__panel" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title" tabindex="-1">' +
      '<div class="dialog__handle" aria-hidden="true"></div>' +
      '<header class="dialog__header"><h2 class="dialog__title" id="' + id + '-title">' + esc(o.title) + '</h2>' +
      '<button type="button" class="icon-btn" data-dismiss aria-label="Fechar">' + icon('x') + '</button></header>' +
      '<div class="dialog__body">' + o.body + '</div>' +
      (o.footer ? '<footer class="dialog__footer">' + o.footer + '</footer>' : '') +
      '</div>';
    document.body.appendChild(root);
    root.__removeOnClose = true;
    wireSheetDrag(root);
    open(root, { trigger: o.trigger || document.activeElement, initialFocus: o.initialFocus, onClose: o.onClose });
    return { root: root, close: function () { close(root); }, panel: root.querySelector('.dialog__panel') };
  }

  /** Arrastar a alça para baixo fecha o bottom sheet (celular). */
  function wireSheetDrag(root) {
    var handle = root.querySelector('.dialog__handle');
    var panel = root.querySelector('.dialog__panel');
    if (!handle) return;
    var startY = null, dy = 0;
    handle.addEventListener('pointerdown', function (e) { startY = e.clientY; dy = 0; handle.setPointerCapture(e.pointerId); panel.style.transition = 'none'; });
    handle.addEventListener('pointermove', function (e) {
      if (startY == null) return;
      dy = Math.max(0, e.clientY - startY);
      panel.style.transform = 'translateY(' + dy + 'px)';
    });
    function end() {
      if (startY == null) return;
      panel.style.transition = '';
      panel.style.transform = '';
      var shouldClose = dy > 80;
      startY = null; dy = 0;
      if (shouldClose) close(root);
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /* ---------------- toasts ---------------- */
  function toast(msg) {
    var host = document.getElementById('toasts');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  /* ---------------- popovers e menus ---------------- */
  var openPop = null;

  function fit(panel) {
    panel.style.translate = '';
    var vw = document.documentElement.clientWidth;
    var r = panel.getBoundingClientRect();
    var dx = 0;
    if (r.right > vw - 8) dx = vw - 8 - r.right;
    if (r.left + dx < 8) dx = 8 - r.left;
    if (dx) panel.style.translate = Math.round(dx) + 'px 0';
  }

  function popover(cfg) {
    var trigger = cfg.trigger, panel = cfg.panel, menu = cfg.menu;
    var wrap = cfg.wrap || trigger.parentElement;
    var hoverTimer = null;
    var api = {
      trigger: trigger, panel: panel,
      isOpen: function () { return !panel.hidden; },
      open: function (viaKeyboard) {
        if (openPop && openPop !== api) openPop.close();
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        openPop = api;
        fit(panel);
        if (cfg.onOpen) cfg.onOpen();
        if (menu && viaKeyboard) { var it = items()[0]; if (it) it.focus(); }
        else if (cfg.focusOnOpen) { var f = C.focusables(panel)[0]; if (f) f.focus(); }
      },
      close: function (returnFocus) {
        if (panel.hidden) return;
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (openPop === api) openPop = null;
        if (returnFocus) trigger.focus({ preventScroll: true });
        if (cfg.onClose) cfg.onClose();
      }
    };
    function items() { return C.$$('[role="menuitem"]', panel).filter(function (el) { return el.getClientRects().length > 0; }); }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (api.isOpen()) api.close(); else api.open(e.detail === 0);
    });
    trigger.addEventListener('keydown', function (e) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && menu) { e.preventDefault(); api.open(true); }
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); api.close(true); return; }
      if (menu) {
        var list = items(), i = list.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
        else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
        else if (e.key === 'Tab') { api.close(); }
      }
    });
    // fecha ao escolher um item
    panel.addEventListener('click', function (e) {
      if (e.target.closest('[role="menuitem"], [data-close-pop]')) api.close();
    });
    // abre em hover (somente mouse)
    if (cfg.hover) {
      wrap.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(hoverTimer);
        if (!api.isOpen()) api.open(false);
      });
      wrap.addEventListener('pointerleave', function (e) {
        if (e.pointerType !== 'mouse') return;
        hoverTimer = setTimeout(function () { api.close(); }, 160);
      });
    }
    return api;
  }

  document.addEventListener('pointerdown', function (e) {
    if (openPop && !openPop.panel.contains(e.target) && !openPop.trigger.contains(e.target)) openPop.close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openPop && !stack.length) { var p = openPop; p.close(true); }
  });
  document.addEventListener('focusin', function (e) {
    if (openPop && !openPop.panel.contains(e.target) && !openPop.trigger.contains(e.target) && !(openPop.panel.parentElement && openPop.panel.parentElement.contains(e.target))) openPop.close();
  });
  window.addEventListener('resize', function () { if (openPop) fit(openPop.panel); });
  function closePopovers() { if (openPop) openPop.close(); }

  C.ui = { open: open, close: close, modal: modal, toast: toast, popover: popover, closePopovers: closePopovers, lock: lock, unlock: unlock, fit: fit, isDialogOpen: function () { return stack.length > 0; } };
})(window.Conecta);
