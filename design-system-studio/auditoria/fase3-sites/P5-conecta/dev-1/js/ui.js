/* Utilitários de interface reutilizáveis: camadas modais (foco preso + inert),
   popovers, toasts, modais e armazenamento seguro. */
(function () {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function visibleFocusables(root) {
    return $all(FOCUSABLE, root).filter(function (el) {
      if (el.closest('[hidden]') || el.closest('[inert]')) return false;
      var r = el.getBoundingClientRect();
      return r.width > 0 || r.height > 0;
    });
  }

  /* ---------- Armazenamento (sempre com try/catch) ---------- */
  var Store = {
    get: function (key, area) {
      try { var raw = (area || window.localStorage).getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    },
    set: function (key, value, area) {
      try { (area || window.localStorage).setItem(key, JSON.stringify(value)); } catch (e) { /* armazenamento indisponível */ }
    },
    remove: function (key, area) {
      try { (area || window.localStorage).removeItem(key); } catch (e) { /* ignore */ }
    },
    session: function () { try { return window.sessionStorage; } catch (e) { return null; } }
  };

  /* ---------- Camadas modais: foco preso, fundo inert, Esc, scroll travado ---------- */
  var Layers = {
    stack: [],
    inerted: [],

    open: function (el, opts) {
      opts = opts || {};
      var layer = {
        el: el,
        trigger: opts.trigger || document.activeElement,
        onClose: opts.onClose,
        lockScroll: opts.lockScroll !== false
      };
      this.stack.push(layer);
      this.applyInert();
      if (layer.lockScroll) document.body.classList.add('scroll-locked');
      var target = opts.initialFocus || visibleFocusables(el)[0] || el;
      try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
      return layer;
    },

    close: function (el, opts) {
      opts = opts || {};
      var idx = -1;
      for (var i = this.stack.length - 1; i >= 0; i--) { if (this.stack[i].el === el) { idx = i; break; } }
      if (idx === -1) return;
      var layer = this.stack.splice(idx, 1)[0];
      this.applyInert();
      if (!this.stack.some(function (l) { return l.lockScroll; })) document.body.classList.remove('scroll-locked');
      if (layer.onClose) layer.onClose();
      if (opts.returnFocus !== false && layer.trigger && document.contains(layer.trigger)) {
        try { layer.trigger.focus({ preventScroll: true }); } catch (e) { layer.trigger.focus(); }
      }
    },

    top: function () { return this.stack[this.stack.length - 1]; },

    applyInert: function () {
      this.inerted.forEach(function (n) { n.inert = false; n.removeAttribute('aria-hidden'); });
      this.inerted = [];
      var top = this.top();
      if (!top) return;
      var self = this;
      Array.prototype.forEach.call(document.body.children, function (child) {
        if (child === top.el || child.contains(top.el)) return;
        if (child.id === 'toast-region' || child.tagName === 'SCRIPT') return;
        if (child.inert) return;
        child.inert = true;
        child.setAttribute('aria-hidden', 'true');
        self.inerted.push(child);
      });
    },

    handleKey: function (e) {
      var top = this.top();
      if (!top) return false;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (top.el.__requestClose) top.el.__requestClose(); else this.close(top.el);
        return true;
      }
      if (e.key === 'Tab') {
        var items = visibleFocusables(top.el);
        if (!items.length) { e.preventDefault(); return true; }
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !top.el.contains(document.activeElement))) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !top.el.contains(document.activeElement))) {
          e.preventDefault(); first.focus();
        }
        return true;
      }
      return false;
    }
  };

  /* ---------- Popovers / menus suspensos (não modais) ---------- */
  var Popovers = {
    list: [],
    register: function (trigger, panel, opts) {
      opts = opts || {};
      var p = { trigger: trigger, panel: panel, hover: !!opts.hover, onOpen: opts.onOpen, timer: null };
      this.list.push(p);
      var self = this;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (p.panel.hidden) self.open(p); else self.close(p, true);
      });
      if (p.hover) {
        var wrap = opts.hoverRoot || trigger.parentElement;
        wrap.addEventListener('mouseenter', function (e) {
          if (e.pointerType === 'touch') return;
          clearTimeout(p.timer);
          if (p.panel.hidden && window.matchMedia('(hover: hover)').matches) self.open(p, { noFocus: true });
        });
        wrap.addEventListener('mouseleave', function () {
          clearTimeout(p.timer);
          p.timer = setTimeout(function () { if (!p.panel.contains(document.activeElement)) self.close(p, false); }, 180);
        });
      }
      panel.addEventListener('click', function (e) {
        if (e.target.closest('a[href], [data-close-popover]')) self.close(p, false);
      });
      return p;
    },
    open: function (p) {
      this.closeAll(p);
      p.panel.hidden = false;
      p.trigger.setAttribute('aria-expanded', 'true');
      if (p.onOpen) p.onOpen();
      this.position(p);
    },
    close: function (p, focusTrigger) {
      if (p.panel.hidden) return;
      p.panel.hidden = true;
      p.trigger.setAttribute('aria-expanded', 'false');
      p.panel.style.removeProperty('left');
      p.panel.style.removeProperty('right');
      p.panel.style.removeProperty('transform');
      if (focusTrigger) p.trigger.focus();
    },
    closeAll: function (except) {
      var self = this;
      this.list.forEach(function (p) { if (p !== except) self.close(p, false); });
    },
    openOne: function () { return this.list.filter(function (p) { return !p.panel.hidden; })[0]; },
    /* Reposiciona para caber na viewport (nunca causa overflow horizontal) */
    position: function (p) {
      var panel = p.panel;
      panel.style.removeProperty('left');
      panel.style.removeProperty('right');
      panel.style.removeProperty('transform');
      var r = panel.getBoundingClientRect();
      var vw = document.documentElement.clientWidth;
      var parentR = panel.offsetParent ? panel.offsetParent.getBoundingClientRect() : { left: 0 };
      if (r.right > vw - 8) {
        panel.style.transform = 'none';
        panel.style.right = 'auto';
        panel.style.left = (vw - 8 - r.width - parentR.left) + 'px';
      } else if (r.left < 8) {
        panel.style.transform = 'none';
        panel.style.right = 'auto';
        panel.style.left = (8 - parentR.left) + 'px';
      }
    }
  };

  document.addEventListener('click', function (e) {
    Popovers.list.forEach(function (p) {
      if (!p.panel.hidden && !p.panel.contains(e.target) && !p.trigger.contains(e.target)) Popovers.close(p, false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (Layers.handleKey(e)) return;
    if (e.key === 'Escape') {
      var p = Popovers.openOne();
      if (p) { e.preventDefault(); Popovers.close(p, true); }
    }
  });

  /* ---------- Toasts ---------- */
  function toast(message, iconName) {
    var region = document.getElementById('toast-region');
    if (!region) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = (iconName ? window.icon(iconName) : '') + '<span>' + esc(message) + '</span>';
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 3600);
  }

  /* ---------- Modal / bottom sheet ---------- */
  var modalCount = 0;
  function openModal(opts) {
    modalCount += 1;
    var id = 'modal-' + modalCount;
    var root = document.getElementById('modal-root');
    var wrap = document.createElement('div');
    wrap.className = 'modal' + (opts.className ? ' ' + opts.className : '');
    wrap.innerHTML =
      '<div class="modal-scrim" data-modal-close></div>' +
      '<div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="' + id + '-title" tabindex="-1">' +
        (opts.raw ? opts.raw(id) :
        '<div class="modal-header"><h2 id="' + id + '-title">' + esc(opts.title) + '</h2>' +
          '<button type="button" class="icon-btn" data-modal-close aria-label="Fechar">' + window.icon('x') + '</button></div>' +
        '<div class="modal-body">' + (opts.body || '') + '</div>' +
        (opts.footer ? '<div class="modal-footer">' + opts.footer + '</div>' : '')) +
      '</div>';
    root.appendChild(wrap);

    var closed = false;
    function close(returnFocus) {
      if (closed) return;
      closed = true;
      wrap.classList.remove('is-open');
      Layers.close(wrap, { returnFocus: returnFocus !== false });
      var done = function () { wrap.remove(); };
      if (reducedMotion()) done(); else setTimeout(done, 260);
      if (opts.onClose) opts.onClose();
    }
    wrap.__requestClose = function () { close(true); };
    wrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) close(true);
    });

    var api = { el: wrap, panel: wrap.querySelector('.modal-panel'), close: close, id: id };
    if (opts.onMount) opts.onMount(api);
    // força reflow para a animação de entrada
    void wrap.offsetWidth;
    wrap.classList.add('is-open');
    Layers.open(wrap, { trigger: opts.trigger, initialFocus: opts.initialFocus ? wrap.querySelector(opts.initialFocus) : null });
    return api;
  }

  /* ---------- Validação de campo (mensagem abaixo + aria) ---------- */
  function setFieldError(input, message) {
    var errId = input.id + '-error';
    var err = document.getElementById(errId);
    var hintIds = (input.getAttribute('data-describedby') || '').trim();
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', (errId + ' ' + hintIds).trim());
      if (err) {
        err.innerHTML = window.icon('alert', 16) + '<span>' + esc(message) + '</span>';
        err.hidden = false;
      }
    } else {
      input.removeAttribute('aria-invalid');
      if (hintIds) input.setAttribute('aria-describedby', hintIds); else input.removeAttribute('aria-describedby');
      if (err) { err.hidden = true; err.innerHTML = ''; }
    }
  }

  function renderSummary(box, items, title) {
    if (!items || !items.length) { box.hidden = true; box.innerHTML = ''; return; }
    var html = '<p class="error-summary-title">' + window.icon('alert') + '<span>' + esc(title || 'Revise os campos abaixo:') + '</span></p>';
    var linked = items.filter(function (i) { return i.id; });
    if (linked.length) {
      html += '<ul>' + linked.map(function (i) {
        return '<li><a href="#' + i.id + '" data-focus="' + i.id + '">' + esc(i.message) + '</a></li>';
      }).join('') + '</ul>';
    }
    box.innerHTML = html;
    box.hidden = false;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('.error-summary a[data-focus]');
    if (!a) return;
    e.preventDefault();
    var input = document.getElementById(a.getAttribute('data-focus'));
    if (input) { input.focus(); input.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' }); }
  });

  window.UI = {
    $: $, $all: $all, esc: esc,
    reducedMotion: reducedMotion,
    visibleFocusables: visibleFocusables,
    Store: Store, Layers: Layers, Popovers: Popovers,
    toast: toast, openModal: openModal,
    setFieldError: setFieldError, renderSummary: renderSummary
  };
})();
