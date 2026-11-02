/* Conecta — utilitários compartilhados (escopo global window.Conecta) */
window.Conecta = window.Conecta || {};
(function (C) {
  'use strict';

  C.$ = function (sel, root) { return (root || document).querySelector(sel); };
  C.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /** Escapa texto para uso seguro em innerHTML. */
  C.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** Ícone do sprite (lucide, contorno). */
  C.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  };

  C.initials = function (name) {
    var parts = String(name || '?').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  };

  C.avatar = function (person, size, extraCls) {
    var s = size ? ' style="--size:' + size + 'px"' : '';
    return '<span class="avatar avatar--t' + (person.tone || 1) + ' ' + (extraCls || '') + '"' + s + ' aria-hidden="true">' + C.esc(C.initials(person.name)) + '</span>';
  };

  C.delay = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  C.reducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  C.mqMobile = window.matchMedia('(max-width: 767px)');
  C.mqLandscapeShort = window.matchMedia('(max-width: 767px) and (orientation: landscape) and (max-height: 500px)');

  C.FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  C.focusables = function (root) {
    return C.$$(C.FOCUSABLE, root).filter(function (el) {
      return !el.closest('[hidden]') && !el.closest('[inert]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
    });
  };

  C.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : many); };
})(window.Conecta);
