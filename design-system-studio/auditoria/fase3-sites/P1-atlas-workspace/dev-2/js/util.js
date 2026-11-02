/* Utilitários gerais. Namespace global: window.Atlas (scripts clássicos, funciona em file://). */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});

  A.$ = (sel, root = document) => root.querySelector(sel);
  A.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  A.esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Normaliza para busca sem diferenciar maiúsculas e acentos. */
  A.norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  /** Armazenamento tolerante a falhas (modo privado, bloqueio de cookies, file://). */
  function makeStore(kind) {
    const mem = {};
    return {
      get(key, fallback) {
        try {
          const raw = window[kind].getItem(key);
          return raw == null ? fallback : JSON.parse(raw);
        } catch (e) {
          return key in mem ? mem[key] : fallback;
        }
      },
      set(key, value) {
        mem[key] = value;
        try { window[kind].setItem(key, JSON.stringify(value)); } catch (e) { /* ignora */ }
      },
      remove(key) {
        delete mem[key];
        try { window[kind].removeItem(key); } catch (e) { /* ignora */ }
      },
    };
  }
  A.store = makeStore('localStorage');
  A.session = makeStore('sessionStorage');

  let uidN = 0;
  A.uid = (p = 'id') => p + '-' + ++uidN;
  A.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  A.mq = (q) => window.matchMedia(q);
  A.reducedMotion = () => A.mq('(prefers-reduced-motion: reduce)').matches;
  A.isMobile = () => A.mq('(max-width: 767px)').matches;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  A.focusables = (root) =>
    A.$$(FOCUSABLE, root).filter((el) => !el.closest('[hidden]') && el.getClientRects().length > 0);

  /** Mantém o Tab dentro de um contêiner (drawers, sheets, diálogos). */
  A.trapTab = (container, e) => {
    if (e.key !== 'Tab') return;
    const list = A.focusables(container);
    if (!list.length) { e.preventDefault(); container.focus(); return; }
    const first = list[0], last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !container.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !container.contains(active))) { e.preventDefault(); first.focus(); }
  };

  /** Trava a rolagem do corpo (contador, para overlays empilhados). */
  let locks = 0;
  A.lockScroll = () => {
    if (locks++ === 0) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      if (sbw > 0) document.documentElement.style.paddingRight = sbw + 'px';
    }
  };
  A.unlockScroll = () => {
    if (locks > 0 && --locks === 0) {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    }
  };

  /** Anuncia mensagens a leitores de tela. */
  A.announce = (msg) => {
    const el = document.getElementById('announcer');
    if (!el) return;
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 30);
  };

  /** Rola até o topo respeitando prefers-reduced-motion. */
  A.scrollTop = () => window.scrollTo({ top: 0, behavior: A.reducedMotion() ? 'auto' : 'smooth' });

  // ---------- formatação pt-BR ----------
  A.fmt = {
    int: (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n),
    num: (n, d = 1) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n),
    brl: (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n),
    pct: (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.abs(n)) + '%',
    date: (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; },
  };

  A.initials = (name) =>
    String(name || '?').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

  /** Debounce simples. */
  A.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /** Hash SHA-256 (demonstração; autenticação real exige backend). */
  A.hash = async (text) => {
    try {
      if (window.crypto && crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) { /* cai no fallback */ }
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return 'fb' + (h >>> 0).toString(16);
  };
})();
