/* ==========================================================================
   Utilidades de UI: ícones, anúncios, toast, tooltip, popover/menu com
   reposicionamento na viewport, foco preso, trava de rolagem, inert.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = (NX.ui = {});

  var $ = function (sel, root) { return (root || d).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); };
  ui.$ = $;
  ui.$$ = $$;

  /* ---------- Storage seguro (pode lançar em modo privado / file://) ---------- */
  ui.store = {
    get: function (area, key) {
      try { return w[area].getItem(key); } catch (e) { return null; }
    },
    set: function (area, key, val) {
      try { w[area].setItem(key, val); } catch (e) { /* ignorar */ }
    },
    remove: function (area, key) {
      try { w[area].removeItem(key); } catch (e) { /* ignorar */ }
    }
  };

  /* ---------- Ícones ---------- */
  ui.hydrateIcons = function (root) {
    $$('.js-icon[data-icon]', root).forEach(function (el) {
      if (el.dataset.done) return;
      el.innerHTML = NX.icon(el.dataset.icon, +el.dataset.size || 20);
      el.dataset.done = '1';
    });
  };

  /* ---------- Anúncio para leitores de tela ---------- */
  ui.announce = function (msg) {
    var live = $('#live');
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  };

  /* ---------- Toast ---------- */
  var toastEl = null, toastTimer = 0;
  ui.toast = function (msg, iconName) {
    if (toastEl) toastEl.remove();
    clearTimeout(toastTimer);
    toastEl = d.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.innerHTML = (iconName ? NX.icon(iconName, 16) : '') + '<span>' + NX.fmt.esc(msg) + '</span>';
    $('#overlay-root').appendChild(toastEl);
    toastTimer = setTimeout(function () { if (toastEl) { toastEl.remove(); toastEl = null; } }, 3400);
  };

  /* ---------- Foco ---------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  ui.focusables = function (container) {
    return $$(FOCUSABLE, container).filter(function (el) {
      return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    });
  };

  ui.trapFocus = function (container) {
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var f = ui.focusables(container);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1], a = d.activeElement;
      if (e.shiftKey && (a === first || !container.contains(a))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (a === last || !container.contains(a))) { e.preventDefault(); first.focus(); }
    }
    d.addEventListener('keydown', onKey, true);
    return function release() { d.removeEventListener('keydown', onKey, true); };
  };

  ui.setInert = function (els, on) {
    els.forEach(function (el) {
      if (!el) return;
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  };

  var lockCount = 0;
  ui.lockScroll = function () {
    lockCount++;
    d.documentElement.classList.add('is-scroll-locked');
  };
  ui.unlockScroll = function () {
    lockCount = Math.max(0, lockCount - 1);
    if (!lockCount) d.documentElement.classList.remove('is-scroll-locked');
  };

  ui.reducedMotion = function () {
    return w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /* ---------- Popover posicionado dentro da viewport ---------- */
  var cur = null; // { el, anchor, cleanup }

  function place(el, anchor, placement) {
    var vw = d.documentElement.clientWidth, vh = w.innerHeight;
    var r = anchor.getBoundingClientRect();
    el.style.maxWidth = vw - 16 + 'px';
    el.style.maxHeight = vh - 16 + 'px';
    var pw = el.offsetWidth, ph = el.offsetHeight;
    var gap = 6, x, y;
    var side = placement.split('-')[0], align = placement.split('-')[1] || 'start';

    if (side === 'right') {
      x = r.right + 8; y = r.top;
      if (x + pw > vw - 8) x = r.left - pw - 8;
    } else {
      x = align === 'end' ? r.right - pw : r.left;
      y = side === 'bottom' ? r.bottom + gap : r.top - ph - gap;
      if (side === 'bottom' && y + ph > vh - 8 && r.top - ph - gap >= 8) y = r.top - ph - gap;
      if (side === 'top' && y < 8 && r.bottom + ph + gap <= vh - 8) y = r.bottom + gap;
    }
    x = Math.max(8, Math.min(x, vw - pw - 8));
    y = Math.max(8, Math.min(y, vh - ph - 8));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  ui.closePopover = function (restoreFocus) {
    if (!cur) return;
    var c = cur;
    cur = null;
    c.cleanup();
    c.el.remove();
    c.anchor.setAttribute('aria-expanded', 'false');
    if (restoreFocus && c.anchor.isConnected) c.anchor.focus({ preventScroll: true });
    if (c.onClose) c.onClose();
  };

  ui.openPopover = function (opts) {
    ui.closePopover(false);
    var anchor = opts.anchor;
    var el = d.createElement('div');
    el.className = 'popover' + (opts.className ? ' ' + opts.className : '');
    el.setAttribute('data-pending', '');
    if (opts.role) el.setAttribute('role', opts.role);
    if (opts.label) el.setAttribute('aria-label', opts.label);
    if (typeof opts.content === 'string') el.innerHTML = opts.content;
    else el.appendChild(opts.content);
    if (opts.width) el.style.width = opts.width;
    $('#overlay-root').appendChild(el);
    anchor.setAttribute('aria-expanded', 'true');

    var placement = opts.placement || 'bottom-start';
    place(el, anchor, placement);
    el.removeAttribute('data-pending');

    function reposition() { place(el, anchor, placement); }
    function onDown(e) {
      if (el.contains(e.target) || anchor.contains(e.target)) return;
      ui.closePopover(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); ui.closePopover(true); }
    }
    function onFocusIn(e) {
      if (!el.contains(e.target) && !anchor.contains(e.target)) ui.closePopover(false);
    }
    w.addEventListener('resize', reposition);
    w.addEventListener('scroll', reposition, true);
    d.addEventListener('pointerdown', onDown, true);
    d.addEventListener('keydown', onKey, true);
    d.addEventListener('focusin', onFocusIn);

    cur = {
      el: el, anchor: anchor, onClose: opts.onClose,
      cleanup: function () {
        w.removeEventListener('resize', reposition);
        w.removeEventListener('scroll', reposition, true);
        d.removeEventListener('pointerdown', onDown, true);
        d.removeEventListener('keydown', onKey, true);
        d.removeEventListener('focusin', onFocusIn);
      }
    };
    return { el: el, close: ui.closePopover, reposition: reposition };
  };

  ui.isPopoverOpen = function () { return !!cur; };

  /* ---------- Menu (role=menu) ---------- */
  /*  items: [{ label, icon, onSelect, checked, danger, href }, { sep:true }, { head:{name, sub} }]  */
  ui.openMenu = function (anchor, items, opts) {
    opts = opts || {};
    var radio = !!opts.radio;
    var ul = d.createElement('div');
    ul.className = 'menu';
    ul.setAttribute('role', 'menu');
    if (opts.label) ul.setAttribute('aria-label', opts.label);

    items.forEach(function (it) {
      if (it.sep) {
        var s = d.createElement('div'); s.className = 'menu-sep'; s.setAttribute('role', 'separator'); ul.appendChild(s); return;
      }
      if (it.head) {
        var h = d.createElement('div'); h.className = 'menu-head';
        h.innerHTML = '<span class="menu-head__name"></span><span class="menu-head__sub"></span>';
        h.firstChild.textContent = it.head.name; h.lastChild.textContent = it.head.sub;
        ul.appendChild(h); return;
      }
      var isRadio = it.radio !== undefined ? it.radio : radio;
      var b = d.createElement('button');
      b.type = 'button';
      b.className = 'menu-item' + (it.danger ? ' menu-item--danger' : '');
      b.setAttribute('role', isRadio ? 'menuitemradio' : 'menuitem');
      if (isRadio) b.setAttribute('aria-checked', it.checked ? 'true' : 'false');
      b.tabIndex = -1;
      b.innerHTML = (it.icon ? NX.icon(it.icon, 16) : '') + '<span></span>' +
        (isRadio ? '<span class="menu-item__check">' + (it.checked ? NX.icon('check', 16) : '') + '</span>' : '');
      b.querySelector('span').textContent = it.label;
      b.addEventListener('click', function () {
        ui.closePopover(true);
        if (it.onSelect) it.onSelect();
      });
      ul.appendChild(b);
    });

    var pop = ui.openPopover({
      anchor: anchor, content: ul, placement: opts.placement || 'bottom-start',
      className: opts.className, width: opts.width, onClose: opts.onClose
    });

    var btns = $$('.menu-item', ul);
    function focusAt(i) {
      if (!btns.length) return;
      i = (i + btns.length) % btns.length;
      btns[i].focus({ preventScroll: true });
    }
    ul.addEventListener('keydown', function (e) {
      var i = btns.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i < 0 ? -1 : i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(btns.length - 1); }
      else if (e.key === 'Tab') { ui.closePopover(false); }
    });
    var checked = btns.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0];
    (checked || btns[0]).focus({ preventScroll: true });
    pop.reposition();
    return pop;
  };

  /* ---------- Tooltip (rail / ícones) ---------- */
  var tipEl = null;
  function hideTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  function showTip(target) {
    var text = target.getAttribute('data-tip');
    if (!text) return;
    var sb = target.closest('.sidebar');
    if (sb) {
      var rail = w.matchMedia('(min-width: 768px) and (max-width: 1023.98px)').matches;
      if (!rail || sb.classList.contains('is-expanded')) return;
    }
    hideTip();
    tipEl = d.createElement('div');
    tipEl.className = 'tooltip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.textContent = text;
    $('#overlay-root').appendChild(tipEl);
    var r = target.getBoundingClientRect(), vw = d.documentElement.clientWidth, vh = w.innerHeight;
    var tw = tipEl.offsetWidth, th = tipEl.offsetHeight, x, y;
    if (sb) { x = r.right + 8; y = r.top + (r.height - th) / 2; }
    else { x = r.left + (r.width - tw) / 2; y = r.bottom + 6; }
    x = Math.max(8, Math.min(x, vw - tw - 8));
    y = Math.max(8, Math.min(y, vh - th - 8));
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }
  ui.initTooltips = function () {
    d.addEventListener('pointerover', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t) showTip(t);
    });
    d.addEventListener('pointerout', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t) hideTip();
    });
    d.addEventListener('focusin', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t && t.matches(':focus-visible')) showTip(t);
    });
    d.addEventListener('focusout', hideTip);
    d.addEventListener('pointerdown', hideTip, true);
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); }, true);
    w.addEventListener('scroll', hideTip, true);
  };

  /* ---------- Campo focado visível com teclado virtual ---------- */
  ui.initKeyboardScroll = function () {
    d.addEventListener('focusin', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLElement) || !t.matches('input, select, textarea')) return;
      if (!w.matchMedia('(max-width: 767.98px)').matches) return;
      setTimeout(function () {
        if (d.activeElement === t) {
          t.scrollIntoView({ block: 'center', behavior: ui.reducedMotion() ? 'auto' : 'smooth' });
        }
      }, 280);
    });
    if (w.visualViewport) {
      w.visualViewport.addEventListener('resize', function () {
        var a = d.activeElement;
        if (a && a.matches && a.matches('input, select, textarea')) {
          a.scrollIntoView({ block: 'center' });
        }
      });
    }
  };

  /* ---------- Debounce ---------- */
  ui.debounce = function (fn, ms) {
    var t;
    return function () {
      var a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(c, a); }, ms);
    };
  };
})(window, document);
