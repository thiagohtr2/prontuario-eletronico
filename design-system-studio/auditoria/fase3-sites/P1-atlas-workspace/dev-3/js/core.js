/* Núcleo: utilitários, armazenamento, sessão de demonstração, roteador por hash,
   popovers, armadilha de foco e validação de formulários. Sem dependências. */
(function () {
  'use strict';

  var A = (window.Atlas = window.Atlas || {});
  var icon = A.icon;

  /* ---------- utilitários ---------- */
  A.$ = function (sel, root) { return (root || document).querySelector(sel); };
  A.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  A.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  A.normalize = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };

  A.initials = function (name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  };

  A.prefersReducedMotion = function () {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  };

  /* ---------- armazenamento por visitante (try/catch em tudo) ---------- */
  A.store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* indisponível */ }
    }
  };

  /* ---------- sessão de demonstração (sem backend) ---------- */
  var SESSION_KEY = 'atlas.session';
  var memorySession = null;

  A.session = {
    get: function () {
      if (memorySession) return memorySession;
      try {
        var raw = window.sessionStorage.getItem(SESSION_KEY) || window.localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    },
    set: function (data, remember) {
      memorySession = data;
      var raw = JSON.stringify(data);
      try {
        if (remember) {
          window.localStorage.setItem(SESSION_KEY, raw);
          window.sessionStorage.removeItem(SESSION_KEY);
        } else {
          window.sessionStorage.setItem(SESSION_KEY, raw);
          window.localStorage.removeItem(SESSION_KEY);
        }
      } catch (e) { /* mantém apenas em memória */ }
    },
    clear: function () {
      memorySession = null;
      try {
        window.sessionStorage.removeItem(SESSION_KEY);
        window.localStorage.removeItem(SESSION_KEY);
      } catch (e) { /* ignora */ }
    }
  };

  /* ---------- live region e toast ---------- */
  A.announce = function (msg) {
    var live = A.$('#live');
    if (!live) return;
    live.textContent = '';
    window.setTimeout(function () { live.textContent = msg; }, 30);
  };

  A.toast = function (msg) {
    var old = A.$('.toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    A.announce(msg);
    window.setTimeout(function () { if (el.parentNode) el.remove(); }, 3200);
  };

  /* ---------- foco ---------- */
  function focusables(root) {
    return A.$$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null || el.getClientRects().length > 0; });
  }

  /* Prende o Tab dentro de um contêiner; devolve função para soltar a armadilha */
  A.trapFocus = function (container, onEscape) {
    function handler(e) {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      var items = focusables(container);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;
      if (!container.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handler, true);
    return function release() { document.removeEventListener('keydown', handler, true); };
  };

  A.focusFirst = function (root) {
    var items = focusables(root);
    if (items.length) items[0].focus({ preventScroll: true });
  };

  /* ---------- popovers (fixos na viewport; não são cortados por contêineres) ---------- */
  var openPop = null;
  var openedAt = 0;

  function positionPopover(el, trigger, placement) {
    var r = trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var gap = 8;
    var parts = placement.split('-');
    var side = parts[0];
    var align = parts[1] || 'center';
    var top;
    var left;

    if (side === 'top') {
      top = r.top - h - gap;
      if (top < 8) top = r.bottom + gap;
    } else {
      top = r.bottom + gap;
      if (top + h > vh - 8 && r.top - h - gap >= 8) top = r.top - h - gap;
    }

    if (align === 'end') left = r.right - w;
    else if (align === 'start') left = r.left;
    else left = r.left + r.width / 2 - w / 2;

    left = Math.max(8, Math.min(left, vw - w - 8));
    top = Math.max(8, Math.min(top, vh - h - 8));
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  A.closePopover = function (restoreFocus) {
    if (!openPop) return;
    var pop = openPop;
    openPop = null;
    pop.el.remove();
    if (pop.trigger) pop.trigger.setAttribute('aria-expanded', 'false');
    if (pop.onClose) pop.onClose();
    if (restoreFocus !== false && pop.trigger && document.body.contains(pop.trigger)) {
      pop.trigger.focus({ preventScroll: true });
    }
  };

  A.isPopoverOpen = function (trigger) {
    return !!(openPop && (!trigger || openPop.trigger === trigger));
  };

  /* opts: { html | node, role, label, placement, className, focusFirst, onClose } */
  A.openPopover = function (trigger, opts) {
    if (openPop && openPop.trigger === trigger) {
      A.closePopover(true);
      return null;
    }
    A.closePopover(false);
    var el = document.createElement('div');
    el.className = 'popover ' + (opts.className || '');
    el.setAttribute('role', opts.role || 'dialog');
    el.tabIndex = -1;
    if (opts.label) el.setAttribute('aria-label', opts.label);
    if (opts.node) el.appendChild(opts.node);
    else el.innerHTML = opts.html || '';
    document.body.appendChild(el);
    positionPopover(el, trigger, opts.placement || 'bottom-end');
    trigger.setAttribute('aria-expanded', 'true');
    openPop = { el: el, trigger: trigger, onClose: opts.onClose || null, placement: opts.placement || 'bottom-end' };
    openedAt = Date.now();
    if (opts.keepFocus) return el;
    if (opts.focusFirst) A.focusFirst(el);
    else el.focus({ preventScroll: true });
    return el;
  };

  A.updatePopover = function (html) {
    if (!openPop) return;
    openPop.el.innerHTML = html;
    positionPopover(openPop.el, openPop.trigger, openPop.placement || 'bottom-end');
  };

  A.repositionPopover = function () {
    if (!openPop) return;
    positionPopover(openPop.el, openPop.trigger, openPop.placement || 'bottom-end');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openPop) {
      e.preventDefault();
      A.closePopover(true);
    }
  });

  document.addEventListener('click', function (e) {
    if (!openPop) return;
    var t = e.target;
    if (openPop.el.contains(t) || openPop.trigger.contains(t)) return;
    A.closePopover(false);
  });

  window.addEventListener('scroll', function () {
    if (openPop && Date.now() - openedAt > 200) A.closePopover(false);
  }, { passive: true });

  window.addEventListener('resize', function () { A.repositionPopover(); });

  /* ---------- formulários: validação ao sair do campo, no envio e em tempo real após o 1º envio ---------- */
  A.form = {
    setError: function (el, msg) {
      var err = document.getElementById(el.id + '-error');
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) {
        err.textContent = msg || '';
        err.hidden = !msg;
      }
      var ids = [el.id + '-hint', el.id + '-error'].filter(function (id) { return !!document.getElementById(id); });
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    },

    showErrors: function (box, errors, title) {
      box.innerHTML =
        '<div>' + icon('alert', { size: 18 }) + '</div>' +
        '<div><p><strong>' + A.esc(title || 'Revise os campos destacados:') + '</strong></p><ul>' +
        errors.map(function (e) {
          return '<li><button type="button" class="alert__link" data-action="focus-field" data-target="' + A.esc(e.id) + '">' + A.esc(e.msg) + '</button></li>';
        }).join('') +
        '</ul></div>';
      box.hidden = false;
    },

    showMessage: function (box, msg, kind) {
      box.className = 'alert alert--' + (kind || 'error');
      box.innerHTML = '<div>' + icon(kind === 'success' ? 'check2' : 'alert', { size: 18 }) + '</div><div><p>' + A.esc(msg) + '</p></div>';
      box.hidden = false;
    },

    hide: function (box) {
      if (box) { box.hidden = true; box.innerHTML = ''; }
    },

    /* opts: { rules: {id: fn(el, form) -> msg}, summary: id, onSubmit(values, form, api) } */
    bind: function (form, opts) {
      var rules = opts.rules;
      var ids = Object.keys(rules);
      var submitted = false;
      var busy = false;
      var summary = opts.summary ? document.getElementById(opts.summary) : null;
      var submitBtn = form.querySelector('[type="submit"]');
      var submitLabel = submitBtn ? submitBtn.innerHTML : '';

      function fieldEl(id) { return document.getElementById(id); }

      function check(id) {
        var el = fieldEl(id);
        if (!el) return '';
        var msg = rules[id](el, form) || '';
        A.form.setError(el, msg);
        return msg;
      }

      function values() {
        var out = {};
        ids.forEach(function (id) {
          var el = fieldEl(id);
          if (!el) return;
          out[id] = el.type === 'checkbox' ? el.checked : el.value;
        });
        return out;
      }

      var api = {
        busy: function (on, label) {
          busy = on;
          if (!submitBtn) return;
          if (on) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
            submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + A.esc(label || 'Enviando…') + '</span>';
          } else {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.innerHTML = submitLabel;
          }
        },
        check: check,
        values: values,
        reset: function () {
          submitted = false;
          ids.forEach(function (id) { var el = fieldEl(id); if (el) A.form.setError(el, ''); });
          A.form.hide(summary);
        },
        summary: summary
      };

      form.addEventListener('focusout', function (e) {
        var t = e.target;
        if (!t.id || !rules[t.id] || t.type === 'checkbox') return;
        if (busy) return;
        check(t.id);
      });

      form.addEventListener('change', function (e) {
        var t = e.target;
        if (!t.id || !rules[t.id]) return;
        if (t.type === 'checkbox' || t.tagName === 'SELECT') check(t.id);
      });

      form.addEventListener('input', function (e) {
        if (!submitted) return;
        var t = e.target;
        if (!t.id || !rules[t.id]) return;
        ids.forEach(check);
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (busy) return;
        submitted = true;
        var errors = [];
        ids.forEach(function (id) {
          var m = check(id);
          if (m) errors.push({ id: id, msg: m });
        });
        if (errors.length) {
          if (summary) {
            A.form.showErrors(summary, errors);
            summary.className = 'alert alert--error';
          }
          var first = fieldEl(errors[0].id);
          if (first) first.focus();
          return;
        }
        A.form.hide(summary);
        opts.onSubmit(values(), form, api);
      });

      return api;
    }
  };

  /* ---------- roteador por hash (funciona em file:// e em servidor estático) ---------- */
  A.routes = {};
  A.layout = null;
  var scrollMemo = {};
  var lastAppPath = null;

  A.register = function (path, def) { A.routes[path] = def; };

  A.currentPath = function () {
    var h = String(window.location.hash || '').replace(/^#/, '');
    var p = h.split('?')[0];
    if (!p) p = '/entrar';
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p;
  };

  A.go = function (path) {
    var target = '#' + path;
    if (window.location.hash === target) {
      route();
    } else {
      window.location.hash = path;
    }
  };

  function focusHeading(root) {
    var h = root && root.querySelector('h1');
    if (!h) return;
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }

  function route() {
    var path = A.currentPath();
    if (path === '/' || !window.location.hash) {
      A.go('/entrar');
      return;
    }
    var def = A.routes[path];
    if (!def) {
      mountAuth({
        title: 'Página não encontrada',
        render: function () {
          return '<main class="auth"><section class="auth__card"><h1 class="auth__title">Página não encontrada</h1>' +
            '<p class="auth__sub">O endereço não existe nesta demonstração.</p>' +
            '<a class="btn btn--primary btn--block" href="#/entrar">Ir para entrar</a></section></main>';
        }
      });
      return;
    }

    if (def.kind === 'app') {
      if (!A.session.get()) {
        A.go('/entrar');
        return;
      }
      if (lastAppPath && lastAppPath !== path) scrollMemo[lastAppPath] = window.scrollY;
      A.closePopover(false);
      if (A.shell && A.shell.closeOverlay) A.shell.closeOverlay(false);
      A.mountShell();
      A.renderAppPage(path, def, true);
      lastAppPath = path;
    } else {
      if (lastAppPath) { scrollMemo[lastAppPath] = window.scrollY; lastAppPath = null; }
      A.closePopover(false);
      mountAuth(def);
    }
  }

  function mountAuth(def) {
    var app = A.$('#app');
    if (A.layout !== 'auth') {
      app.innerHTML = '';
      A.layout = 'auth';
    }
    app.innerHTML = def.render();
    document.title = (def.title ? def.title + ' · ' : '') + 'Atlas Workspace';
    if (def.init) def.init(app);
    focusHeading(app);
    window.scrollTo(0, 0);
  }

  A.renderAppPage = function (path, def, fromRoute) {
    var page = A.$('#page');
    page.innerHTML = def.render();
    document.title = def.title + ' · Atlas Workspace';
    if (def.init) def.init(page);
    if (A.shell && A.shell.update) A.shell.update(path, def);
    var y = scrollMemo[path] || 0;
    window.scrollTo(0, y);
    if (fromRoute) focusHeading(page);
  };

  A.refresh = function () {
    var path = A.currentPath();
    var def = A.routes[path];
    if (def && def.kind === 'app' && A.layout === 'app') A.renderAppPage(path, def, false);
  };

  /* ---------- ações delegadas por data-action ---------- */
  A.actions = {};

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) return;
    var fn = A.actions[el.getAttribute('data-action')];
    if (fn) fn(el, e);
  });

  A.actions['focus-field'] = function (el) {
    var t = document.getElementById(el.getAttribute('data-target'));
    if (t) t.focus();
  };

  A.actions['toggle-password'] = function (el) {
    var wrap = el.closest('.input-wrap');
    var input = wrap && wrap.querySelector('input');
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    el.setAttribute('aria-pressed', show ? 'true' : 'false');
    el.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    el.innerHTML = icon(show ? 'eyeOff' : 'eye', { size: 20 });
  };

  A.boot = function () {
    window.addEventListener('hashchange', route);
    route();
  };
})();
