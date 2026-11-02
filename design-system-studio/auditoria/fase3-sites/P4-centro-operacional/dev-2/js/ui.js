/* ==========================================================================
   Componentes de interface reutilizáveis: ícones, menu/bottom sheet, diálogo,
   avisos, dicas de rolagem e lista de abas acessível.
   ========================================================================== */
(function () {
  'use strict';
  const CO = (window.CO = window.CO || {});
  const esc = CO.fmt.esc;

  const isMobile = () => window.matchMedia('(max-width: 767.98px)').matches;
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ícones (sprite Lucide em index.html) ---------- */
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }

  /* ---------- Avisos (toasts) ---------- */
  const toastIcons = { success: 'circle-check', warning: 'triangle-alert', error: 'octagon-alert', info: 'info' };
  function toast(message, tone, ms) {
    tone = tone || 'info';
    const host = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast toast--' + tone;
    el.innerHTML = icon(toastIcons[tone]) + '<span>' + esc(message) + '</span>';
    host.appendChild(el);
    while (host.children.length > 3) host.removeChild(host.firstChild);
    setTimeout(() => el.remove(), ms || 4200);
  }

  /* ---------- Menu (dropdown; vira bottom sheet no celular) ---------- */
  let openMenu = null;

  function closeMenu(restoreFocus) {
    if (!openMenu) return;
    const { menu, backdrop, trigger, cleanup } = openMenu;
    openMenu = null;
    cleanup();
    menu.remove();
    backdrop.remove();
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus !== false && document.contains(trigger)) trigger.focus();
  }

  function placeMenu(menu, trigger) {
    const margin = 8;
    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    menu.style.left = '0px';
    menu.style.top = '0px';
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    let left = r.right - mw; // alinha à direita do gatilho
    if (left < margin) left = Math.min(r.left, vw - mw - margin);
    left = Math.max(margin, Math.min(left, vw - mw - margin));
    let top = r.bottom + 4;
    if (top + mh > vh - margin) {
      const above = r.top - mh - 4; // reposiciona para cima quando não cabe embaixo
      top = above >= margin ? above : Math.max(margin, vh - mh - margin);
    }
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
  }

  /* items: [{label, icon, checked, disabled, onSelect}] */
  function menu(trigger, items, opts) {
    opts = opts || {};
    closeMenu(false);
    const sheet = isMobile();
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop' + (sheet ? ' menu-backdrop--sheet' : '');
    const el = document.createElement('div');
    el.className = 'menu' + (sheet ? ' menu--sheet' : '');
    el.setAttribute('role', 'menu');
    el.setAttribute('aria-label', opts.label || 'Menu');
    if (opts.title) {
      const t = document.createElement('div');
      t.className = 'menu-title';
      t.textContent = opts.title;
      t.setAttribute('role', 'presentation');
      el.appendChild(t);
    }
    const radio = items.some((i) => 'checked' in i);
    items.forEach((it) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'menu-item';
      b.setAttribute('role', radio ? 'menuitemradio' : 'menuitem');
      if (radio) b.setAttribute('aria-checked', it.checked ? 'true' : 'false');
      if (it.disabled) b.setAttribute('aria-disabled', 'true');
      b.tabIndex = -1;
      b.innerHTML = (it.icon ? icon(it.icon) : '') + '<span>' + esc(it.label) + '</span>' + (it.checked ? icon('check', 'menu-check') : '');
      b.addEventListener('click', () => {
        if (it.disabled) return;
        closeMenu(true);
        if (it.onSelect) it.onSelect();
      });
      el.appendChild(b);
    });
    document.body.append(backdrop, el);
    trigger.setAttribute('aria-expanded', 'true');
    if (!sheet) placeMenu(el, trigger);

    const btns = () => Array.from(el.querySelectorAll('.menu-item'));
    const focusAt = (i) => { const l = btns(); l[(i + l.length) % l.length].focus(); };
    el.addEventListener('keydown', (e) => {
      const l = btns();
      const i = l.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
      else if (e.key === 'Home') { e.preventDefault(); focusAt(0); }
      else if (e.key === 'End') { e.preventDefault(); focusAt(l.length - 1); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenu(true); }
      else if (e.key === 'Tab') { e.preventDefault(); closeMenu(true); }
    });
    backdrop.addEventListener('pointerdown', (e) => { e.preventDefault(); closeMenu(true); });
    const onResize = () => closeMenu(true);
    window.addEventListener('resize', onResize);
    openMenu = { menu: el, backdrop, trigger, cleanup: () => window.removeEventListener('resize', onResize) };

    const checked = el.querySelector('[aria-checked="true"]');
    (checked || btns().find((b) => b.getAttribute('aria-disabled') !== 'true') || btns()[0]).focus();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openMenu) closeMenu(true); });

  /* ---------- Diálogo modal (<dialog>): foco preso, Esc, retorno de foco ---------- */
  const dlg = () => document.getElementById('dialog');
  let opener = null;

  function dialogOpen(opts) {
    const d = dlg();
    opener = document.activeElement;
    document.getElementById('dialog-title').textContent = opts.title;
    const body = document.getElementById('dialog-body');
    body.innerHTML = '';
    if (typeof opts.body === 'string') body.innerHTML = opts.body; else body.appendChild(opts.body);
    const foot = document.getElementById('dialog-foot');
    foot.innerHTML = '';
    (opts.footer || []).forEach((b) => foot.appendChild(b));
    d.showModal();
    body.scrollTop = 0;
    if (opts.onOpen) opts.onOpen(d);
  }
  function dialogClose() { const d = dlg(); if (d.open) d.close(); }
  function initDialog() {
    const d = dlg();
    document.getElementById('dialog-close').addEventListener('click', dialogClose);
    d.addEventListener('click', (e) => { if (e.target === d) dialogClose(); }); // toque/clique fora
    d.addEventListener('close', () => {
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
    });
  }

  function button(label, cls, iconName, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + cls;
    b.innerHTML = (iconName ? icon(iconName) : '') + '<span>' + esc(label) + '</span>';
    b.addEventListener('click', onClick);
    return b;
  }

  /* ---------- Dica visual de rolagem + região focável quando há overflow ---------- */
  const scrollers = [];
  function initScroll(wrapper) {
    const body = wrapper.querySelector('.scroll-body');
    if (!body) return;
    const label = body.getAttribute('data-label') || 'Conteúdo';
    function update() {
      const vOver = body.scrollHeight - body.clientHeight > 1;
      const hOver = body.scrollWidth - body.clientWidth > 1;
      const over = vOver || hOver;
      wrapper.toggleAttribute('data-more-top', body.scrollTop > 1);
      wrapper.toggleAttribute('data-more-bottom', vOver && body.scrollTop + body.clientHeight < body.scrollHeight - 1);
      if (over) {
        if (body.getAttribute('tabindex') !== '0') {
          body.setAttribute('tabindex', '0');
          body.setAttribute('role', 'region');
          body.setAttribute('aria-label', label + ' (rolável)');
        }
      } else if (body.hasAttribute('role')) {
        body.removeAttribute('tabindex');
        body.removeAttribute('role');
        body.removeAttribute('aria-label');
      }
    }
    body.addEventListener('scroll', update, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(body);
    new MutationObserver(update).observe(body, { childList: true, subtree: true, characterData: true });
    scrollers.push(update);
    update();
  }
  window.addEventListener('resize', () => scrollers.forEach((f) => f()));

  /* ---------- Lista de abas (roving tabindex; setas trocam de aba) ---------- */
  function tablist(list, onSelect) {
    const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
    function select(id, focus) {
      tabs.forEach((t) => {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on) { t.setAttribute('aria-current', 'page'); if (focus) t.focus(); }
        else t.removeAttribute('aria-current');
      });
      onSelect(id);
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t.dataset.tab, false));
      t.addEventListener('keydown', (e) => {
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        let to = null;
        if (e.key === 'ArrowRight' || (vertical && e.key === 'ArrowDown')) to = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || (vertical && e.key === 'ArrowUp')) to = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = tabs.length - 1;
        if (to === null) return;
        e.preventDefault();
        select(tabs[to].dataset.tab, true);
      });
    });
    return { select, tabs };
  }

  CO.ui = { icon, toast, menu, closeMenu, dialogOpen, dialogClose, initDialog, button, initScroll, tablist, isMobile, reduceMotion };
})();
