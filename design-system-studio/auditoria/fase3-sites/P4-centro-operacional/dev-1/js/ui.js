/* Utilitários de interface reutilizáveis: formatação pt-BR, anúncios para
   leitores de tela, indicação de rolagem interna, menus, modal e abas. */
(function () {
  'use strict';
  var CO = (window.CO = window.CO || {});

  /* ---------- Formatação ---------- */
  var nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nfi = new Intl.NumberFormat('pt-BR');
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function p2(n) { return String(n).padStart(2, '0'); }

  var fmt = {
    n1: function (v) { return nf1.format(v); },
    int: function (v) { return nfi.format(v); },
    brl: function (v) { return brl.format(v); },
    value: function (format, v) {
      if (format === 'brlMil') return 'R$ ' + nf1.format(v) + ' mil';
      if (format === 'int') return nfi.format(v);
      if (format === 'pct') return nf1.format(v) + '%';
      return brl.format(v);
    },
    signedPct: function (p) {
      var s = p > 0 ? '+' : p < 0 ? '−' : '';
      return s + nf1.format(Math.abs(p)) + '%';
    },
    hms: function (d) { return p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds()); },
    hm: function (d) { return p2(d.getHours()) + ':' + p2(d.getMinutes()); },
    dayMonth: function (d) { return p2(d.getDate()) + '/' + p2(d.getMonth() + 1); },
    dateTime: function (d) { return fmt.dayMonth(d) + ', ' + fmt.hm(d); },
    dateTimeLong: function (d) { return fmt.dayMonth(d) + '/' + d.getFullYear() + ' às ' + fmt.hm(d); },
    relative: function (d) {
      var m = Math.floor((Date.now() - d.getTime()) / 60000);
      if (m < 1) return 'agora';
      if (m < 60) return 'há ' + m + ' min';
      var h = Math.floor(m / 60), r = m % 60;
      return r ? 'há ' + h + ' h ' + r + ' min' : 'há ' + h + ' h';
    },
    plural: function (n, one, many) { return nfi.format(n) + ' ' + (n === 1 ? one : many); }
  };
  CO.fmt = fmt;

  CO.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  CO.norm = function (s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  };

  /* Rótulos dos pontos das séries (relativos à data atual) */
  CO.periodLabels = function (period, n) {
    var out = [], d = new Date(), i, x;
    if (period === 'month') {
      for (i = n; i >= 1; i--) {
        x = new Date(d.getFullYear(), d.getMonth() - i, 1);
        out.push(MONTHS[x.getMonth()] + '/' + String(x.getFullYear()).slice(2));
      }
    } else if (period === 'day') {
      for (i = n - 1; i >= 0; i--) {
        x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
        out.push(i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : fmt.dayMonth(x));
      }
    } else {
      var monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
      for (i = n - 1; i >= 0; i--) {
        x = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7 * i);
        out.push(i === 0 ? 'Esta semana' : 'Sem. ' + fmt.dayMonth(x));
      }
    }
    return out;
  };

  /* ---------- Anúncios para leitores de tela ---------- */
  var announceTimer;
  CO.announce = function (msg) {
    var el = document.getElementById('sr-status');
    if (!el) return;
    el.textContent = '';
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function () { el.textContent = msg; }, 60);
  };

  /* ---------- Indicação visual de rolagem interna (fade na borda) ---------- */
  var FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  CO.fades = (function () {
    var known = new Set();
    var ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(function (entries) { entries.forEach(function (e) { update(e.target); }); })
      : null;

    function update(el) {
      if (!el.isConnected) return;
      var y = el.classList.contains('scroll-y');
      var canScroll, start, end;
      if (y) {
        canScroll = el.scrollHeight - el.clientHeight > 1;
        start = canScroll && el.scrollTop > 1;
        end = canScroll && el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        el.classList.toggle('fade-top', start);
        el.classList.toggle('fade-bottom', end);
      } else {
        canScroll = el.scrollWidth - el.clientWidth > 1;
        start = canScroll && el.scrollLeft > 1;
        end = canScroll && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
        el.classList.toggle('fade-left', start);
        el.classList.toggle('fade-right', end);
      }
      /* Área rolável sem nada focável precisa ser alcançável pelo teclado */
      if (canScroll && !el.querySelector(FOCUSABLE)) {
        if (!el.hasAttribute('tabindex')) {
          el.setAttribute('tabindex', '0');
          el.dataset.autoTab = '1';
        }
      } else if (el.dataset.autoTab) {
        el.removeAttribute('tabindex');
        delete el.dataset.autoTab;
      }
    }

    function register(el) {
      if (known.has(el)) return;
      known.add(el);
      el.addEventListener('scroll', function () { update(el); }, { passive: true });
      if (ro) ro.observe(el);
    }

    function refresh() {
      document.querySelectorAll('.scroll-y, .scroll-x').forEach(register);
      known.forEach(function (el) {
        if (!el.isConnected) { known.delete(el); if (ro) ro.unobserve(el); return; }
        update(el);
      });
    }

    window.addEventListener('resize', function () { requestAnimationFrame(refresh); });
    return { refresh: refresh, update: update };
  })();

  /* ---------- Menu suspenso (dropdown) ----------
     Abre por clique/toque e por teclado (Enter/Espaço/↓), navega com ↑/↓/Home/End,
     fecha com Esc, Tab e clique fora; reposiciona para não sair da viewport. */
  CO.menu = (function () {
    var current = null;
    var seq = 0;

    function items() {
      return current ? Array.prototype.slice.call(current.el.querySelectorAll('[role="menuitem"]')) : [];
    }

    function focusAt(i) {
      var list = items();
      if (!list.length) return;
      var n = (i + list.length) % list.length;
      list[n].focus();
    }

    function position() {
      if (!current) return;
      var m = current.el, t = current.trigger;
      var r = t.getBoundingClientRect();
      var vw = document.documentElement.clientWidth, vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) { close(false); return; }
      m.style.maxHeight = '';
      var mw = m.offsetWidth, mh = m.offsetHeight, gap = 4, edge = 8;
      var left = r.right - mw; // alinhado à direita do gatilho
      if (left < edge) left = r.left;
      left = Math.max(edge, Math.min(left, vw - mw - edge));
      var top = r.bottom + gap;
      if (top + mh > vh - edge) {
        if (r.top - gap - mh >= edge) top = r.top - gap - mh; // abre para cima
        else {
          top = Math.max(edge, vh - mh - edge);
          if (mh > vh - 2 * edge) { top = edge; m.style.maxHeight = (vh - 2 * edge) + 'px'; }
        }
      }
      m.style.left = Math.round(left) + 'px';
      m.style.top = Math.round(top) + 'px';
    }

    function onDocPointer(e) {
      if (!current) return;
      if (current.el.contains(e.target) || current.trigger.contains(e.target)) return;
      close(false);
    }

    function onKey(e) {
      if (!current) return;
      var list = items();
      var i = list.indexOf(document.activeElement);
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); focusAt(i + 1); break;
        case 'ArrowUp': e.preventDefault(); focusAt(i < 0 ? -1 : i - 1); break;
        case 'Home': e.preventDefault(); focusAt(0); break;
        case 'End': e.preventDefault(); focusAt(-1); break;
        case 'Escape': e.preventDefault(); e.stopPropagation(); close(true); break;
        case 'Tab': e.preventDefault(); close(true); break;
        default: break;
      }
    }

    function onScroll(e) {
      if (current && !current.el.contains(e.target)) position();
    }

    function onResize() { close(false); }

    function open(trigger, entries, opts) {
      opts = opts || {};
      if (current && current.trigger === trigger) { close(true); return; }
      close(false);
      var el = document.createElement('div');
      seq += 1;
      el.id = 'menu-' + seq;
      el.className = 'menu';
      el.setAttribute('role', 'menu');
      if (trigger.id) el.setAttribute('aria-labelledby', trigger.id);
      else if (opts.label) el.setAttribute('aria-label', opts.label);
      entries.forEach(function (it) {
        if (it.separator) {
          var s = document.createElement('div');
          s.className = 'menu__sep';
          s.setAttribute('role', 'separator');
          el.appendChild(s);
          return;
        }
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'menu__item' + (it.danger ? ' menu__item--danger' : '');
        b.setAttribute('role', 'menuitem');
        b.tabIndex = -1;
        b.innerHTML = (it.icon ? CO.icon(it.icon) : '') + '<span>' + CO.esc(it.label) + '</span>';
        if (it.disabled) b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', function () {
          if (it.disabled) return;
          close(true);
          if (it.onSelect) it.onSelect();
        });
        el.appendChild(b);
      });
      document.body.appendChild(el);
      current = { el: el, trigger: trigger };
      trigger.setAttribute('aria-expanded', 'true');
      trigger.setAttribute('aria-controls', el.id);
      position();
      var first = items().findIndex(function (b) { return b.getAttribute('aria-disabled') !== 'true'; });
      focusAt(first < 0 ? 0 : first);
      el.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', onDocPointer, true);
      document.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', onResize);
    }

    function close(returnFocus) {
      if (!current) return;
      var c = current;
      current = null;
      c.trigger.setAttribute('aria-expanded', 'false');
      c.trigger.removeAttribute('aria-controls');
      c.el.remove();
      document.removeEventListener('pointerdown', onDocPointer, true);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      if (returnFocus && c.trigger.isConnected) c.trigger.focus();
    }

    /* ↓ no gatilho também abre o menu */
    function bindTrigger(trigger, getEntries, opts) {
      trigger.addEventListener('click', function () { open(trigger, getEntries(), opts); });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' && trigger.getAttribute('aria-expanded') !== 'true') {
          e.preventDefault();
          open(trigger, getEntries(), opts);
        }
      });
    }

    return { open: open, close: close, bindTrigger: bindTrigger, isOpen: function () { return !!current; } };
  })();

  /* ---------- Modal (<dialog>) ----------
     showModal() torna o resto da página inerte (foco preso); fecha com Esc,
     clique no fundo ou botão visível; devolve o foco ao gatilho. */
  CO.dialog = (function () {
    var dlg, titleEl, subEl, bodyEl, footEl, opener = null, fallback = null;

    function init() {
      dlg = document.getElementById('dialog');
      titleEl = document.getElementById('dialog-title');
      subEl = document.getElementById('dialog-sub');
      bodyEl = document.getElementById('dialog-body');
      footEl = document.getElementById('dialog-foot');
      dlg.querySelector('.dialog__close').addEventListener('click', close);
      dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
      dlg.addEventListener('close', restoreFocus);
    }

    function restoreFocus() {
      var target = opener && opener.isConnected ? opener : fallback ? fallback() : null;
      opener = null;
      fallback = null;
      if (target && typeof target.focus === 'function') target.focus();
    }

    function open(o) {
      if (!dlg) init();
      if (dlg.open) dlg.close();
      opener = document.activeElement;
      fallback = o.fallbackFocus || null;
      titleEl.textContent = o.title;
      subEl.textContent = o.subtitle || '';
      subEl.hidden = !o.subtitle;
      bodyEl.innerHTML = o.body;
      dlg.dataset.size = o.size || 'md';
      footEl.innerHTML = '';
      (o.actions || []).forEach(function (a) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn--' + (a.variant || 'secondary');
        b.textContent = a.label;
        b.addEventListener('click', function () {
          if (a.onClick) a.onClick();
          if (a.close !== false) close();
        });
        footEl.appendChild(b);
      });
      dlg.showModal();
      bodyEl.scrollTop = 0;
      titleEl.focus();
      CO.fades.refresh();
    }

    function close() {
      if (dlg && dlg.open) dlg.close();
    }

    return { open: open, close: close, isOpen: function () { return !!(dlg && dlg.open); } };
  })();

  /* ---------- Abas (role="tablist", setas trocam de aba) ---------- */
  CO.tabs = function (list, onSelect) {
    list.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t && list.contains(t)) onSelect(t.dataset.tab, t);
    });
    list.addEventListener('keydown', function (e) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      tabs[n].focus();
      onSelect(tabs[n].dataset.tab, tabs[n]);
    });
  };
})();
