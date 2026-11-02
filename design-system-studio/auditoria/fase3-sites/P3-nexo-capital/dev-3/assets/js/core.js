/* Núcleo: helpers de DOM, ícones, formatação, menus, foco preso e avisos. */
(function (ns) {
  'use strict';

  // Cria elementos: h('button', {class:'x', onclick: fn, 'aria-label': '…'}, 'texto', nó, [filhos])
  function h(tag, attrs) {
    var el = document.createElement(tag);
    var a = attrs || {};
    Object.keys(a).forEach(function (k) {
      var v = a[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) child.forEach(function (c) { append(el, c); });
    else if (child.nodeType) el.appendChild(child);
    else el.appendChild(document.createTextNode(String(child)));
  }

  function svg(name, cls) {
    var wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wrap.setAttribute('viewBox', '0 0 24 24');
    wrap.setAttribute('fill', 'none');
    wrap.setAttribute('stroke', 'currentColor');
    wrap.setAttribute('stroke-width', '1.75');
    wrap.setAttribute('stroke-linecap', 'round');
    wrap.setAttribute('stroke-linejoin', 'round');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('focusable', 'false');
    wrap.setAttribute('class', 'ico ' + (cls || ''));
    wrap.innerHTML = ICONS[name] || '';
    return wrap;
  }

  var ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L22 7H6"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M17.9 17.9A10.7 10.7 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 4.2-5.1M9.9 5.2A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    building: '<path d="M3 21h18M5 21V5l7-2v18M12 21V9h7v12M8 8h1M8 12h1M8 16h1M15 13h1M15 17h1"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
    sort: '<path d="M7 9l5-5 5 5M7 15l5 5 5-5"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>'
  };

  // Formatação pt-BR.
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
  var intf = new Intl.NumberFormat('pt-BR');
  var pct = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var compact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

  function fmtValue(value, fmt) {
    if (fmt === 'brl') return brl.format(value);
    if (fmt === 'brl2') return brl2.format(value);
    if (fmt === 'int') return intf.format(value);
    if (fmt === 'pct') return pct.format(value / 100);
    return String(value);
  }

  function fmtCompact(value) { return compact.format(value); }

  function fmtDate(iso) {
    var p = iso.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  // Dias entre a data ISO e "hoje" da demonstração.
  function daysAgo(iso) {
    var p = iso.split('-').map(Number);
    return Math.round((ns.TODAY - Date.UTC(p[0], p[1] - 1, p[2])) / 86400000);
  }

  // Foco preso dentro de um contêiner. Devolve função para soltar.
  function trapFocus(container) {
    function focusables() {
      return Array.prototype.slice.call(container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
    }
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var list = focusables();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        e.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return function release() { document.removeEventListener('keydown', onKey, true); };
  }

  // Menu suspenso (perfil, unidade, linha da tabela). Fecha com Esc e clique fora; devolve o foco.
  var openMenuRef = null;
  function closeMenu(returnFocus) {
    if (!openMenuRef) return;
    var m = openMenuRef;
    openMenuRef = null;
    document.removeEventListener('pointerdown', m.outside, true);
    document.removeEventListener('keydown', m.key, true);
    m.el.remove();
    m.trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus !== false && m.trigger.isConnected) m.trigger.focus();
  }

  function openMenu(opts) {
    if (openMenuRef && openMenuRef.trigger === opts.trigger) { closeMenu(); return; }
    closeMenu(false);
    var trigger = opts.trigger;
    var items = opts.items || [];
    var list = h('div', { class: 'menu', role: 'menu', 'aria-label': opts.label || 'Menu' },
      opts.header || null,
      items.map(function (it) {
        if (it.separator) return h('div', { class: 'menu-sep', role: 'separator' });
        return h('button', {
          class: 'menu-item' + (it.danger ? ' is-danger' : '') + (it.current ? ' is-current' : ''),
          role: 'menuitem', type: 'button', tabindex: '-1',
          onclick: function () { closeMenu(); if (it.onSelect) it.onSelect(); }
        }, it.icon ? svg(it.icon) : null, h('span', { text: it.label }), it.current ? svg('check', 'menu-check') : null);
      })
    );
    document.body.appendChild(list);
    trigger.setAttribute('aria-expanded', 'true');
    position(list, trigger, opts.align || 'end', opts.placement || 'down');

    var entry = {
      el: list, trigger: trigger,
      outside: function (e) {
        if (!list.contains(e.target) && !trigger.contains(e.target)) closeMenu(false);
      },
      key: function (e) {
        if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
        var buttons = Array.prototype.slice.call(list.querySelectorAll('.menu-item'));
        var idx = buttons.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); buttons[(idx + 1) % buttons.length].focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); buttons[(idx - 1 + buttons.length) % buttons.length].focus(); }
        if (e.key === 'Home') { e.preventDefault(); buttons[0].focus(); }
        if (e.key === 'End') { e.preventDefault(); buttons[buttons.length - 1].focus(); }
        if (e.key === 'Tab') { closeMenu(false); }
      }
    };
    openMenuRef = entry;
    document.addEventListener('pointerdown', entry.outside, true);
    document.addEventListener('keydown', entry.key, true);
    var first = list.querySelector('.menu-item');
    if (first && opts.focusFirst !== false) first.focus();
    return { close: closeMenu };
  }

  // Posiciona o menu dentro da viewport; abre para cima quando não cabe embaixo.
  function position(list, trigger, align, placement) {
    var r = trigger.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var mh = list.offsetHeight;
    var mw = list.offsetWidth;
    var top = r.bottom + 4;
    if (placement === 'up' || (top + mh > vh - 8 && r.top - mh - 4 > 8)) {
      top = r.top - mh - 4;
    }
    var left = align === 'start' ? r.left : r.right - mw;
    left = Math.max(8, Math.min(left, vw - mw - 8));
    list.style.top = Math.max(8, top) + 'px';
    list.style.left = left + 'px';
  }

  // Aviso não modal para ações simuladas.
  function toast(message) {
    var region = document.getElementById('live');
    if (!region) return;
    region.textContent = '';
    setTimeout(function () { region.textContent = message; }, 30);
  }

  function safeGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* armazenamento indisponível */ }
  }
  function safeLocalGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeLocalSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* armazenamento indisponível */ }
  }

  ns.h = h;
  ns.svg = svg;
  ns.fmtValue = fmtValue;
  ns.fmtCompact = fmtCompact;
  ns.fmtDate = fmtDate;
  ns.daysAgo = daysAgo;
  ns.trapFocus = trapFocus;
  ns.openMenu = openMenu;
  ns.closeMenu = closeMenu;
  ns.toast = toast;
  ns.safeGet = safeGet;
  ns.safeSet = safeSet;
  ns.safeLocalGet = safeLocalGet;
  ns.safeLocalSet = safeLocalSet;
})(window.NEXO = window.NEXO || {});
