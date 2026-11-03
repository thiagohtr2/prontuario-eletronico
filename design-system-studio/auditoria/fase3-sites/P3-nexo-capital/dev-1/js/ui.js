/* =========================================================
   Utilitários de interface reutilizáveis:
   formatação, armazenamento, menus/popovers, sobreposições com
   foco preso, tooltip, toast, diálogos e exportação CSV.
   ========================================================= */
(function () {
  'use strict';
  const N = (window.Nexo = window.Nexo || {});
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  N.$ = $; N.$$ = $$; N.esc = esc;
  N.html = function (str) { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstElementChild; };
  let uid = 0;
  N.uid = (p) => (p || 'id') + '-' + (++uid);

  /* ---------- Armazenamento (sempre protegido; a página funciona sem ele) ---------- */
  N.store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
  };
  let memSession = null;
  N.session = {
    get() { try { const v = sessionStorage.getItem('nexo.session'); return v ? JSON.parse(v) : memSession; } catch (e) { return memSession; } },
    set(v) { memSession = v; try { if (v) sessionStorage.setItem('nexo.session', JSON.stringify(v)); else sessionStorage.removeItem('nexo.session'); } catch (e) { /* memória */ } }
  };

  /* ---------- Formatação pt-BR ---------- */
  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const BRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const NUM = new Intl.NumberFormat('pt-BR');
  const DEC1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const DEC01 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  const pad = (n) => String(n).padStart(2, '0');
  N.fmt = {
    money: (v) => BRL.format(v),
    money0: (v) => BRL0.format(v),
    num: (v) => NUM.format(v),
    dec1: (v) => DEC1.format(v),
    pct: (v) => DEC1.format(v * 100) + '%',
    compactMoney(v) {
      const a = Math.abs(v);
      if (a >= 1e6) return 'R$ ' + DEC01.format(v / 1e6) + ' mi';
      if (a >= 1e3) return 'R$ ' + NUM.format(Math.round(v / 1e3)) + ' mil';
      return BRL0.format(v);
    },
    date: (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(),
    datetime: (d) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()),
    rel(d) {
      const diff = (N.TODAY - d) / 3600000;
      if (diff < 1) return 'agora há pouco';
      if (diff < 24) return 'há ' + Math.floor(diff) + ' h';
      if (diff < 48) return 'ontem';
      if (diff < 24 * 7) return 'há ' + Math.floor(diff / 24) + ' dias';
      return N.fmt.date(d);
    }
  };

  /* ---------- Popovers e menus ---------- */
  let current = null;
  N.hasPopover = () => !!current;
  N.closePopover = (focusTrigger) => { if (current) current.close(!!focusTrigger); };

  /** Posiciona um elemento flutuante junto ao gatilho, sempre dentro da viewport. */
  N.place = function (pop, anchor, opts) {
    const o = opts || {};
    const m = 8;
    const gap = o.gap == null ? 4 : o.gap;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const r = anchor.getBoundingClientRect();
    pop.style.left = '0px';
    pop.style.top = '0px';
    pop.style.maxHeight = '';
    const pw = Math.min(pop.offsetWidth, vw - 2 * m);
    let align = o.align || 'auto';
    if (align === 'auto') align = r.left + r.width / 2 > vw / 2 ? 'end' : 'start';
    let left = align === 'end' ? r.right - pw : r.left;
    left = Math.max(m, Math.min(left, vw - pw - m));
    const below = vh - r.bottom - gap - m;
    const above = r.top - gap - m;
    const ph = pop.offsetHeight;
    const up = o.placement === 'top' ? !(above < ph && below > above) : (below < ph && above > below);
    const avail = Math.max(120, up ? above : below);
    pop.style.maxHeight = avail + 'px';
    const h = Math.min(ph, avail);
    const top = up ? r.top - gap - h : r.bottom + gap;
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(Math.max(m, top)) + 'px';
  };

  /** Abre um elemento flutuante (menu ou painel) ancorado a um gatilho. */
  N.openPopover = function (trigger, pop, opts) {
    const o = opts || {};
    if (current && current.trigger === trigger) { current.close(false); return null; }
    if (current) current.close(false);
    document.body.appendChild(pop);
    trigger.setAttribute('aria-expanded', 'true');
    const reposition = () => N.place(pop, trigger, o);
    reposition();
    const onDown = (e) => { if (!pop.contains(e.target) && !trigger.contains(e.target)) ctl.close(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ctl.close(true); }
    };
    const onResize = () => ctl.close(false);
    const onScroll = (e) => { if (!pop.contains(e.target)) reposition(); };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    const ctl = {
      el: pop,
      trigger,
      reposition,
      close(focusTrigger) {
        if (current !== ctl) return;
        current = null;
        document.removeEventListener('pointerdown', onDown, true);
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onScroll, true);
        pop.remove();
        trigger.setAttribute('aria-expanded', 'false');
        if (o.onClose) o.onClose();
        if (focusTrigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
      }
    };
    current = ctl;
    return ctl;
  };

  /**
   * Menu de ações (role="menu"). items: {label, icon, onSelect, checked, disabled, danger, kbd} | {sep:true}
   * Abre por clique/toque, Enter/Espaço/Seta; navega com setas, Home/End; fecha com Esc, Tab e clique fora.
   */
  N.menu = function (trigger, opts) {
    const o = opts || {};
    const pop = document.createElement('div');
    pop.className = 'menu';
    pop.setAttribute('role', 'menu');
    pop.setAttribute('aria-label', o.label || 'Menu');
    pop.tabIndex = -1;
    if (o.width) pop.style.width = o.width;
    pop.innerHTML = (o.header || '') + o.items.map((it, i) => {
      if (it.sep) return '<div class="menu-sep" role="separator"></div>';
      const radio = it.checked !== undefined;
      return '<button type="button" class="menu-item' + (it.danger ? ' menu-item--danger' : '') + '" role="' + (radio ? 'menuitemradio' : 'menuitem') + '"' +
        (radio ? ' aria-checked="' + !!it.checked + '"' : '') + (it.disabled ? ' aria-disabled="true"' : '') + ' data-i="' + i + '" tabindex="-1">' +
        (it.icon ? N.icon(it.icon, { size: 16 }) : '') + '<span class="menu-label">' + esc(it.label) + '</span>' +
        (radio ? N.icon('check', { size: 16, cls: 'menu-check' }) : '') + (it.kbd ? '<kbd>' + esc(it.kbd) + '</kbd>' : '') + '</button>';
    }).join('');
    const ctl = N.openPopover(trigger, pop, { placement: o.placement, align: o.align, onClose: o.onClose });
    if (!ctl) return null;
    const btns = $$('.menu-item', pop);
    const focusAt = (i) => { const b = btns[(i + btns.length) % btns.length]; if (b) b.focus({ preventScroll: true }); };
    pop.addEventListener('keydown', (e) => {
      const i = btns.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(btns.length - 1); }
      else if (e.key === 'Tab') { ctl.close(true); }
    });
    pop.addEventListener('click', (e) => {
      const b = e.target.closest('.menu-item');
      if (!b || b.getAttribute('aria-disabled') === 'true') return;
      const it = o.items[+b.dataset.i];
      ctl.close(true);
      if (it.onSelect) it.onSelect();
    });
    const checkedIdx = btns.findIndex((b) => b.getAttribute('aria-checked') === 'true');
    focusAt(o.focusLast ? btns.length - 1 : (checkedIdx >= 0 ? checkedIdx : 0));
    return ctl;
  };

  /** Liga um gatilho a um menu (clique, Enter/Espaço nativos e Seta para baixo/cima). */
  N.bindMenuTrigger = function (trigger, open) {
    trigger.addEventListener('click', () => open(false));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!current || current.trigger !== trigger) open(e.key === 'ArrowUp'); }
    });
  };

  /* ---------- Sobreposição modal (drawer e sidebar expandida) ---------- */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  N.focusables = (root) => $$(FOCUSABLE, root).filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');

  N.overlay = function (cfg) {
    let open = false;
    let trigger = null;
    function onKey(e) {
      if (!open) return;
      if (e.key === 'Escape') {
        if (N.hasPopover() || document.querySelector('dialog[open]')) return;
        e.preventDefault();
        api.close();
      } else if (e.key === 'Tab') {
        const f = N.focusables(cfg.panel);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (!cfg.panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    const api = {
      get isOpen() { return open; },
      open(t) {
        if (open) return;
        open = true;
        trigger = t || document.activeElement;
        cfg.panel.classList.add(cfg.openClass || 'is-open');
        cfg.scrim.classList.add('is-open');
        cfg.scrim.onclick = () => api.close();
        document.body.classList.add('scroll-locked');
        cfg.inert().forEach((el) => { el.inert = true; el.setAttribute('aria-hidden', 'true'); });
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        cfg.panel.removeAttribute('aria-hidden');
        document.addEventListener('keydown', onKey);
        const f = cfg.initialFocus && cfg.initialFocus();
        if (f) f.focus({ preventScroll: true });
        if (cfg.onOpen) cfg.onOpen();
      },
      close(opts) {
        if (!open) return;
        const o = opts || {};
        open = false;
        cfg.panel.classList.remove(cfg.openClass || 'is-open');
        cfg.scrim.classList.remove('is-open');
        cfg.scrim.onclick = null;
        document.body.classList.remove('scroll-locked');
        cfg.inert().forEach((el) => { el.inert = false; el.removeAttribute('aria-hidden'); });
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', onKey);
        N.closePopover(false);
        if (o.focus !== false && trigger && document.contains(trigger)) {
          const t = trigger;
          // o gatilho pode só voltar a ficar visível depois que a classe é removida
          requestAnimationFrame(() => t.focus({ preventScroll: true }));
        }
        if (cfg.onClose) cfg.onClose();
      }
    };
    return api;
  };

  /* ---------- Tooltip (hover e foco; Esc fecha) ---------- */
  N.initTooltips = function (isAllowed) {
    const tip = $('#tooltip');
    let owner = null;
    function show(el) {
      if (!el || !el.dataset.tooltip) return;
      if (el.dataset.tooltipMq && !matchMedia(el.dataset.tooltipMq).matches) return;
      if (isAllowed && !isAllowed(el)) return;
      owner = el;
      tip.textContent = el.dataset.tooltip;
      tip.hidden = false;
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      let left;
      let top;
      if (el.closest('.sidebar')) {
        left = r.right + 8;
        if (left + tw > vw - 8) left = r.left - tw - 8;
        top = r.top + r.height / 2 - th / 2;
      } else {
        left = r.left + r.width / 2 - tw / 2;
        top = r.bottom + 6;
        if (top + th > vh - 8) top = r.top - th - 6;
      }
      tip.style.left = Math.round(Math.max(8, Math.min(left, vw - tw - 8))) + 'px';
      tip.style.top = Math.round(Math.max(8, Math.min(top, vh - th - 8))) + 'px';
    }
    function hide() { owner = null; tip.hidden = true; }
    document.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tooltip]'); if (el && el !== owner) show(el); else if (!el && owner) hide(); });
    document.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tooltip]'); if (el) show(el); else hide(); });
    document.addEventListener('focusout', hide);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    document.addEventListener('pointerdown', hide, true);
    window.addEventListener('scroll', hide, true);
    N.hideTooltip = hide;
  };

  /* ---------- Toast (role="status") ---------- */
  N.toast = function (msg, opts) {
    const o = opts || {};
    const region = $('#toast-region');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<span class="toast-msg">' + esc(msg) + '</span>' + (o.action ? '<button type="button" class="toast-action">' + esc(o.action.label) + '</button>' : '');
    region.appendChild(t);
    let timer = setTimeout(remove, o.timeout || (o.action ? 7000 : 4000));
    function remove() { clearTimeout(timer); t.remove(); }
    if (o.action) t.querySelector('.toast-action').addEventListener('click', () => { remove(); o.action.onClick(); });
    while (region.children.length > 3) region.firstElementChild.remove();
    return remove;
  };

  /* ---------- Diálogo modal (dialog nativo: foco preso e Esc) ---------- */
  N.dialog = function (o) {
    const id = N.uid('dlg');
    const d = document.createElement('dialog');
    d.className = 'dlg';
    d.setAttribute('aria-labelledby', id + '-t');
    const foot = (o.actions || []).map((a, i) => '<button type="' + (a.submit ? 'submit' : 'button') + '" class="btn ' + (a.variant || 'btn--outline') + '" data-a="' + i + '">' + esc(a.label) + '</button>').join('');
    const inner = '<div class="dlg-head"><h2 class="dlg-title" id="' + id + '-t">' + esc(o.title) + '</h2>' +
      '<button type="button" class="icon-btn" data-close aria-label="Fechar">' + N.icon('x') + '</button></div>' +
      '<div class="dlg-body">' + o.body + '</div>' + (foot ? '<div class="dlg-foot">' + foot + '</div>' : '');
    d.innerHTML = o.form ? '<form class="dlg-form" novalidate>' + inner + '</form>' : inner;
    const opener = document.activeElement;
    document.body.appendChild(d);
    document.body.classList.add('scroll-locked');
    d.showModal();
    const close = () => d.close();
    d.addEventListener('close', () => {
      d.remove();
      if (!document.querySelector('.drawer.is-open, .sidebar.is-expanded')) document.body.classList.remove('scroll-locked');
      if (o.onClose) o.onClose();
      if (opener && document.contains(opener) && opener.focus) opener.focus({ preventScroll: true });
    });
    d.addEventListener('click', (e) => {
      if (e.target === d) close();
      if (e.target.closest('[data-close]')) close();
      const b = e.target.closest('[data-a]');
      if (b && b.type !== 'submit') { const a = o.actions[+b.dataset.a]; if (a.onClick) a.onClick(d, close); else close(); }
    });
    if (o.form) d.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); if (o.onSubmit) o.onSubmit(d, close); });
    const first = d.querySelector('[autofocus]') || d.querySelector('.dlg-body input, .dlg-body select, .dlg-body button') || d.querySelector('[data-close]');
    if (first) first.focus();
    return { el: d, close };
  };

  /* ---------- Exportação CSV (funciona via file://) ---------- */
  N.downloadCSV = function (filename, rows) {
    const csv = '﻿' + rows.map((r) => r.map((v) => {
      const s = String(v == null ? '' : v);
      return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  N.csvMoney = (v) => v.toFixed(2).replace('.', ',');

  /* ---------- Rolar o campo focado para a área visível (teclado virtual) ---------- */
  N.keepFocusedVisible = function (root) {
    if (!matchMedia('(pointer: coarse)').matches) return;
    root.addEventListener('focusin', (e) => {
      if (!e.target.matches('input, select, textarea')) return;
      setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300);
    });
  };
})();
