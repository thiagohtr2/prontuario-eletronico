/* Camadas flutuantes: popover (menus), diálogo/bottom sheet, tooltip e toast. */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, esc, icon } = { $: A.$, esc: A.esc, icon: A.icon };

  // ------------------------------------------------------------------
  // Posicionamento: sempre dentro da viewport (largura máx. 100vw − 16 px)
  // ------------------------------------------------------------------
  function place(anchor, el, { align = 'end', offset = 8, prefer = 'down', side = false } = {}) {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    el.style.maxWidth = vw - 16 + 'px';
    el.style.maxHeight = vh - 16 + 'px';
    const r = anchor.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left, top;
    if (side) {
      left = r.right + offset;
      top = r.top + r.height / 2 - h / 2;
      if (left + w > vw - 8) left = r.left - offset - w;
    } else {
      left = align === 'end' ? r.right - w : r.left;
      const below = vh - r.bottom - offset - 8;
      const above = r.top - offset - 8;
      const up = prefer === 'up' ? !(h > above && below > above) : h > below && above > below;
      top = up ? r.top - h - offset : r.bottom + offset;
    }
    left = Math.max(8, Math.min(left, vw - w - 8));
    top = Math.max(8, Math.min(top, vh - h - 8));
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  // ------------------------------------------------------------------
  // Popover
  // ------------------------------------------------------------------
  let currentPop = null;

  function closePopover(restoreFocus = false) {
    if (currentPop) currentPop.close(restoreFocus);
  }

  /**
   * Abre um popover ancorado em `anchor`.
   * opts: { align:'end'|'start', prefer:'down'|'up', width, kind:'menu'|'panel', label }
   */
  function openPopover(anchor, el, opts = {}) {
    closePopover();
    const { kind = 'menu', width, label } = opts;
    el.classList.add('popover');
    el.style.position = 'fixed';
    if (width) el.style.width = `min(${width}px, calc(100vw - 16px))`;
    if (kind === 'menu') el.setAttribute('role', 'menu');
    else el.setAttribute('role', 'dialog');
    if (label) el.setAttribute('aria-label', label);
    el.tabIndex = -1;
    document.body.appendChild(el);
    place(anchor, el, opts);
    anchor.setAttribute('aria-expanded', 'true');

    const items = () => A.$$('[role="menuitem"]:not([disabled])', el);
    const onDown = (e) => { if (!el.contains(e.target) && !anchor.contains(e.target)) close(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(true); return; }
      if (kind === 'menu') {
        const list = items();
        const i = list.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0])?.focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); (list[i - 1] || list[list.length - 1])?.focus(); }
        else if (e.key === 'Home') { e.preventDefault(); list[0]?.focus(); }
        else if (e.key === 'End') { e.preventDefault(); list[list.length - 1]?.focus(); }
        else if (e.key === 'Tab') { close(true); }
      }
    };
    const onFocusOut = (e) => {
      const to = e.relatedTarget;
      if (kind === 'panel' && to && !el.contains(to) && !anchor.contains(to)) close(false);
    };
    const reposition = () => place(anchor, el, opts);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
    el.addEventListener('focusout', onFocusOut);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);

    function close(restoreFocus) {
      if (!currentPop || currentPop.el !== el) return;
      currentPop = null;
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
      el.remove();
      anchor.setAttribute('aria-expanded', 'false');
      if (restoreFocus && document.contains(anchor)) anchor.focus();
      if (opts.onClose) opts.onClose();
    }
    currentPop = { el, anchor, close };

    // foco: primeiro item do menu / o próprio painel
    requestAnimationFrame(() => {
      if (kind === 'menu') items()[0]?.focus();
      else (A.focusables(el)[0] || el).focus();
      reposition();
    });
    return { el, close };
  }

  /** Monta um menu a partir de itens [{label, icon, href, onClick, danger, sep}] */
  function menuHTML(items) {
    return items
      .map((it, i) => {
        if (it.sep) return '<div class="menu__sep" role="separator"></div>';
        if (it.header) return `<div class="menu__header">${it.header}</div>`;
        const inner = `${it.icon ? icon(it.icon) : ''}<span>${esc(it.label)}</span>`;
        return it.href
          ? `<a class="menu__item" role="menuitem" data-i="${i}" href="${esc(it.href)}">${inner}</a>`
          : `<button type="button" class="menu__item${it.danger ? ' is-danger' : ''}" role="menuitem" data-i="${i}">${inner}</button>`;
      })
      .join('');
  }

  function openMenu(anchor, items, opts = {}) {
    const el = document.createElement('div');
    el.className = 'menu';
    el.innerHTML = menuHTML(items);
    const pop = openPopover(anchor, el, { kind: 'menu', ...opts });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const it = items[+b.dataset.i];
      pop.close(true);
      if (it.onClick) it.onClick();
    });
    return pop;
  }

  // ------------------------------------------------------------------
  // Diálogo / bottom sheet (no celular vira bottom sheet por CSS)
  // ------------------------------------------------------------------
  const dialogStack = [];

  /**
   * opts: { title, body (string|Node), footer (string|Node), returnFocus, className, onClose, hideTitle }
   * Retorna { el, body, close }
   */
  function openDialog(opts) {
    closePopover();
    const id = A.uid('dlg');
    const wrap = document.createElement('div');
    wrap.className = 'overlay';
    wrap.innerHTML = `
      <div class="overlay__scrim" data-close></div>
      <section class="dialog ${opts.className || ''}" role="dialog" aria-modal="true" aria-labelledby="${id}-t" tabindex="-1">
        <header class="dialog__head">
          <h2 class="dialog__title" id="${id}-t">${esc(opts.title)}</h2>
          <button type="button" class="icon-btn" data-close aria-label="Fechar">${icon('x')}</button>
        </header>
        <div class="dialog__body"></div>
        ${opts.footer ? '<footer class="dialog__foot"></footer>' : ''}
      </section>`;
    const dlg = $('.dialog', wrap);
    const body = $('.dialog__body', wrap);
    if (opts.body instanceof Node) body.appendChild(opts.body); else body.innerHTML = opts.body || '';
    const foot = $('.dialog__foot', wrap);
    if (foot) { if (opts.footer instanceof Node) foot.appendChild(opts.footer); else foot.innerHTML = opts.footer; }

    const returnTo = opts.returnFocus || document.activeElement;
    const root = document.getElementById('root');
    document.body.appendChild(wrap);
    A.lockScroll();
    if (root) root.inert = true;
    dialogStack.forEach((d) => { d.wrap.inert = true; });

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      else A.trapTab(dlg, e);
    };
    wrap.addEventListener('keydown', onKey);
    wrap.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });

    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      const i = dialogStack.findIndex((d) => d.wrap === wrap);
      if (i >= 0) dialogStack.splice(i, 1);
      wrap.remove();
      A.unlockScroll();
      const top = dialogStack[dialogStack.length - 1];
      if (top) top.wrap.inert = false; else if (root) root.inert = false;
      if (returnTo && document.contains(returnTo)) returnTo.focus();
      if (opts.onClose) opts.onClose();
    }
    dialogStack.push({ wrap, close });
    requestAnimationFrame(() => {
      const first = opts.initialFocus ? $(opts.initialFocus, dlg) : null;
      (first || $('.dialog__head .icon-btn', dlg) || dlg).focus();
    });
    return { el: dlg, body, close };
  }

  // ------------------------------------------------------------------
  // Tooltip (para a sidebar em modo trilho, ícones etc.)
  // ------------------------------------------------------------------
  let tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement('div');
    tipEl.className = 'tooltip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.hidden = true;
    document.body.appendChild(tipEl);
    return tipEl;
  }
  function hideTip() { if (tipEl) tipEl.hidden = true; }

  /** Delegação: mostra tooltip para `selector` dentro de `root` quando enabled() é verdadeiro. */
  function attachTooltips(root, selector, enabled) {
    const show = (e) => {
      const t = e.target.closest ? e.target.closest(selector) : null;
      if (!t || !enabled()) return;
      const tip = ensureTip();
      tip.textContent = t.dataset.tip;
      tip.hidden = false;
      tip.style.position = 'fixed';
      place(t, tip, { side: true, offset: 10 });
    };
    root.addEventListener('pointerover', show);
    root.addEventListener('focusin', show);
    root.addEventListener('pointerout', hideTip);
    root.addEventListener('focusout', hideTip);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideTip(); });
    root.addEventListener('scroll', hideTip, true);
  }

  // ------------------------------------------------------------------
  // Toast (região live)
  // ------------------------------------------------------------------
  function toast(msg, ms = 4200) {
    const box = document.getElementById('toasts');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  A.ui = A.ui || {};
  Object.assign(A.ui, { place, openPopover, closePopover, openMenu, openDialog, attachTooltips, hideTip, toast });
})();
