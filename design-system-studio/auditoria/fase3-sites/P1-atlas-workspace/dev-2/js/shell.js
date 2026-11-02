/* Shell da aplicação.
   Desktop (>=768): sidebar integral + header de 64 px (>=1280: 252 px · 1024-1279: 220 px · 768-1023: trilho de 72 px com sobreposição).
   Celular (<768): topbar + Bottom Navigation de 4 destinos (o 4º, "Mais", abre uma folha com o restante). */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, $$, esc, icon, norm } = A;
  const D = A.data;

  // ---------------- estado vivo compartilhado (notificações e mensagens lidas) ----------------
  const live = (A.live = {
    notifs: D.notifications.map((o) => ({ ...o })),
    messages: D.messages.map((o) => ({ ...o })),
    subs: [],
    unreadNotifs() { return live.notifs.filter((n) => n.unread).length; },
    unreadMessages() { return live.messages.filter((m) => m.unread).length; },
    on(fn) { live.subs.push(fn); return () => { live.subs = live.subs.filter((f) => f !== fn); }; },
    emit() { live.subs.slice().forEach((f) => f()); },
  });

  const S = { el: null, collapsed: A.store.get('atlas.sidebar.collapsed', false), overlay: false, route: null, lastY: 0, tabState: {} };

  const badgeFor = (it) => (it.id === 'mensagens' ? live.unreadMessages() : it.id === 'projetos' ? D.projects.length : it.badge || 0);
  const badgeLabel = (it) => {
    const n = badgeFor(it);
    if (!n) return it.label;
    return it.id === 'mensagens' ? `${it.label}, ${n} ${n === 1 ? 'não lida' : 'não lidas'}` : `${it.label}, ${n}`;
  };

  // ---------------- marcação ----------------
  function navItemHTML(it) {
    const n = badgeFor(it);
    return `
      <li>
        <a class="nav-item" href="#/${it.id}" data-route="${it.id}" data-tip="${esc(it.label)}" aria-label="${esc(badgeLabel(it))}">
          ${icon(it.icon)}
          <span class="nav-item__label">${esc(it.label)}</span>
          ${n ? `<span class="nav-badge" data-badge="${it.id}" aria-hidden="true">${n}</span>` : ''}
        </a>
      </li>`;
  }

  function groupsHTML() {
    const closed = A.store.get('atlas.nav.groups', {});
    return D.nav
      .map((g, gi) => {
        const isClosed = !!closed[g.group];
        return `
        <div class="nav-group ${isClosed ? 'is-collapsed' : ''}" data-group="${esc(g.group)}">
          <button type="button" class="nav-group__title" id="ng-${gi}" aria-expanded="${!isClosed}" aria-controls="ngl-${gi}">
            <span>${esc(g.group)}</span>${icon('chevron-down', { size: 16 })}
          </button>
          <ul id="ngl-${gi}" aria-labelledby="ng-${gi}">${g.items.map(navItemHTML).join('')}</ul>
        </div>`;
      })
      .join('');
  }

  function bottomNavHTML() {
    const tabs = D.bottomTabs.map((id) => D.navById(id));
    const item = (it) => `
      <li><a class="bn-item" href="#/${it.id}" data-route="${it.id}" data-tab="${it.id}">
        <span class="bn-ico">${icon(it.icon, { size: 24 })}</span><span class="bn-label">${esc(it.label)}</span></a></li>`;
    return `
      <ul>
        ${tabs.map(item).join('')}
        <li><button type="button" class="bn-item" id="bn-more" aria-haspopup="dialog" aria-expanded="false">
          <span class="bn-ico">${icon('layout-grid', { size: 24 })}</span><span class="bn-label">Mais</span></button></li>
      </ul>`;
  }

  function mount(root) {
    if (S.el) return;
    const u = A.auth.user() || D.demoUser;
    root.innerHTML = `
      <div class="app" id="app" data-rail="false" data-overlay="closed">
        <div class="sidebar-slot">
          <aside class="sidebar" id="sidebar">
            <div class="sidebar__top">
              <a class="brand brand--sm" href="#/painel" aria-label="${esc(D.brand.name)} — ir para o Painel">
                <span class="brand__mark" aria-hidden="true">${D.brand.mark}</span><span class="brand__name label">${esc(D.brand.name)}</span>
              </a>
              <button type="button" class="icon-btn" id="sb-toggle" aria-label="Recolher menu" aria-expanded="true" aria-controls="sidebar" data-tip="Expandir menu">${icon('panel-left-close')}</button>
            </div>
            <nav class="sidebar__nav" aria-label="Menu lateral" id="sb-nav">${groupsHTML()}</nav>
            <div class="sidebar__foot">
              <div class="profile">
                <span class="avatar" aria-hidden="true">${esc(A.initials(u.name))}</span>
                <span class="profile__text label"><span class="profile__name">${esc(u.name)}</span><span class="profile__role">${esc(u.role || 'Membro da equipe')}</span></span>
              </div>
              <a class="icon-btn" href="#/configuracoes" aria-label="Configurações" data-tip="Configurações" id="sb-settings">${icon('settings')}</a>
              <button type="button" class="icon-btn" id="sb-more" aria-label="Menu do perfil" aria-haspopup="menu" aria-expanded="false" data-tip="Menu do perfil">${icon('ellipsis')}</button>
            </div>
          </aside>
        </div>
        <div class="sb-scrim" id="sb-scrim" hidden></div>

        <div class="main-col" id="main-col">
          <header class="app-header" id="app-header">
            <div class="app-header__lead">
              <a class="topbar-back" id="tb-back" href="#/projetos" hidden>${icon('chevron-left')}<span></span></a>
              <p class="topbar-title" id="tb-title"></p>
              <nav class="crumbs" aria-label="Trilha de navegação"><ol id="crumbs"></ol></nav>
            </div>
            <div class="app-header__actions">
              <div class="search-slot" id="hdr-search"></div>
              <button type="button" class="icon-btn bell" id="bell" aria-haspopup="dialog" aria-expanded="false">${icon('bell')}<span class="bell__count" id="bell-count" aria-hidden="true"></span></button>
              <button type="button" class="avatar-btn" id="avatar-btn" aria-label="Menu do perfil" aria-haspopup="menu" aria-expanded="false">${esc(A.initials(u.name))}</button>
            </div>
          </header>
          <main class="page swiss" id="main" tabindex="-1"><div id="page-host"></div></main>
        </div>

        <nav class="bottom-nav" id="bottom-nav" aria-label="Navegação principal">${bottomNavHTML()}</nav>
      </div>`;
    S.el = $('#app', root);
    bind();
    A.search.create($('#hdr-search', root), { placeholder: 'Buscar…' });
    layout();
    refreshCounts();
  }

  function unmount() {
    S.el = null;
    S.route = null;
    A.ui.hideTip();
    document.documentElement.style.overflow = '';
  }

  // ---------------- layout responsivo ----------------
  const mqDesk = A.mq('(min-width: 1024px)');
  const mqTab = A.mq('(min-width: 768px)');

  function layout() {
    if (!S.el) return;
    const desk = mqDesk.matches, tab = mqTab.matches;
    if (!tab && S.overlay) closeOverlay(false);
    if (desk && S.overlay) closeOverlay(false);
    const rail = desk ? S.collapsed : tab;
    S.el.dataset.rail = String(rail);
    syncToggle();
  }

  function syncToggle() {
    const b = $('#sb-toggle');
    if (!b) return;
    const desk = mqDesk.matches;
    const expanded = S.overlay || (desk && !S.collapsed);
    b.setAttribute('aria-label', expanded ? 'Recolher menu' : 'Expandir menu');
    b.setAttribute('aria-expanded', String(expanded));
    b.dataset.tip = expanded ? 'Recolher menu' : 'Expandir menu';
    b.innerHTML = icon(expanded ? 'panel-left-close' : 'panel-left-open');
  }

  function openOverlay() {
    if (S.overlay) return;
    S.overlay = true;
    S.el.dataset.overlay = 'open';
    $('#sb-scrim').hidden = false;
    $('#main-col').inert = true;
    $('#bottom-nav').inert = true;
    A.lockScroll();
    A.ui.hideTip();
    syncToggle();
    $('#sb-toggle').focus();
  }
  function closeOverlay(restoreFocus = true) {
    if (!S.overlay) return;
    S.overlay = false;
    S.el.dataset.overlay = 'closed';
    $('#sb-scrim').hidden = true;
    $('#main-col').inert = false;
    $('#bottom-nav').inert = false;
    A.unlockScroll();
    A.ui.hideTip();
    syncToggle();
    if (restoreFocus) $('#sb-toggle').focus();
  }

  // ---------------- eventos ----------------
  function bind() {
    const app = S.el;
    bindGlobals();

    // alternar sidebar
    $('#sb-toggle').addEventListener('click', () => {
      if (mqDesk.matches) {
        S.collapsed = !S.collapsed;
        A.store.set('atlas.sidebar.collapsed', S.collapsed);
        layout();
        A.ui.hideTip();
      } else if (S.overlay) closeOverlay(); else openOverlay();
    });
    $('#sb-scrim').addEventListener('click', () => closeOverlay());
    $('#sidebar').addEventListener('keydown', (e) => {
      if (!S.overlay) return;
      if (e.key === 'Escape') { e.stopPropagation(); closeOverlay(); }
      else A.trapTab($('#sidebar'), e);
    });
    // escolher um item fecha a sobreposição
    $('#sb-nav').addEventListener('click', (e) => {
      if (e.target.closest('a.nav-item') && S.overlay) closeOverlay(false);
    });

    // grupos recolhíveis (accordion), com estado lembrado
    $('#sb-nav').addEventListener('click', (e) => {
      const t = e.target.closest('.nav-group__title');
      if (!t) return;
      const g = t.closest('.nav-group');
      const collapsed = g.classList.toggle('is-collapsed');
      t.setAttribute('aria-expanded', String(!collapsed));
      const st = A.store.get('atlas.nav.groups', {});
      st[g.dataset.group] = collapsed;
      A.store.set('atlas.nav.groups', st);
    });

    // tooltips quando a sidebar está em trilho
    A.ui.attachTooltips($('#sidebar'), '[data-tip]', () => app.dataset.rail === 'true' && !S.overlay);

    // perfil na sidebar (abre para cima)
    $('#sb-more').addEventListener('click', (e) => {
      const rail = app.dataset.rail === 'true' && !S.overlay;
      A.ui.openMenu(e.currentTarget, [
        { label: 'Meu perfil', icon: 'user', href: '#/configuracoes' },
        { label: 'Preferências', icon: 'settings', href: '#/configuracoes' },
        { sep: true },
        { label: 'Sair', icon: 'log-out', danger: true, onClick: signOut },
      ], { prefer: 'up', align: rail ? 'start' : 'end', label: 'Menu do perfil' });
    });

    // avatar no header
    $('#avatar-btn').addEventListener('click', (e) => {
      const u = A.auth.user() || D.demoUser;
      A.ui.openMenu(e.currentTarget, [
        { header: `<span class="menu__name">${esc(u.name)}</span><span class="menu__mail">${esc(u.email)}</span>` },
        { sep: true },
        { label: 'Meu perfil', icon: 'user', href: '#/configuracoes' },
        { label: 'Configurações', icon: 'settings', href: '#/configuracoes' },
        { label: 'Ajuda', icon: 'circle-help', href: '#/ajuda' },
        { sep: true },
        { label: 'Sair', icon: 'log-out', danger: true, onClick: signOut },
      ], { align: 'end', label: 'Menu do perfil' });
    });

    // notificações: popover no desktop, bottom sheet no celular
    $('#bell').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.getAttribute('aria-expanded') === 'true' && !A.isMobile()) { A.ui.closePopover(true); return; }
      const panel = buildNotifs();
      if (A.isMobile()) {
        btn.setAttribute('aria-expanded', 'true');
        A.ui.openDialog({ title: 'Notificações', body: panel, returnFocus: btn, className: 'dialog--sheet', onClose: () => btn.setAttribute('aria-expanded', 'false') });
      } else {
        A.ui.openPopover(btn, panel, { kind: 'panel', width: 320, align: 'end', label: 'Notificações' });
      }
    });

    // bottom navigation
    $('#bottom-nav').addEventListener('click', (e) => {
      const a = e.target.closest('a[data-tab]');
      if (!a) return;
      const id = a.dataset.tab;
      const top = S.route && S.route.top;
      if (top === id) {
        e.preventDefault();
        if (S.route.path !== '/' + id) location.hash = '#/' + id; // pilha: volta à raiz do destino
        else A.scrollTop();
      } else if (S.tabState[id] && S.tabState[id] !== '/' + id) {
        e.preventDefault();
        location.hash = '#' + S.tabState[id]; // restaura a pilha do destino
      }
    });
    $('#bn-more').addEventListener('click', openMore);

  }

  // listeners de janela/documento: registrados uma única vez, mesmo se o shell for remontado
  function bindGlobals() {
    if (S.globals) return;
    S.globals = true;
    mqDesk.addEventListener('change', layout);
    mqTab.addEventListener('change', layout);
    A.mq('(max-width: 767px)').addEventListener('change', () => A.ui.closePopover());
    live.on(refreshCounts);
    panelLinkClose();
    // sombra do header após 8 px de rolagem + esconder/mostrar na rolagem (celular)
    window.addEventListener('scroll', () => {
      const hdr = $('#app-header');
      if (!S.el || !hdr) return;
      const y = window.scrollY;
      hdr.classList.toggle('is-scrolled', y > 8);
      if (A.isMobile()) {
        if (y > S.lastY + 6 && y > 80) hdr.classList.add('is-hidden');
        else if (y < S.lastY - 6 || y <= 80) hdr.classList.remove('is-hidden');
      } else hdr.classList.remove('is-hidden');
      S.lastY = y;
    }, { passive: true });
  }

  function panelLinkClose() {
    // links dentro do popover de notificações fecham o painel
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('.notifs__all');
      if (a) { A.ui.closePopover(); const dlg = a.closest('.overlay'); if (dlg) dlg.querySelector('[data-close]').click(); }
    });
  }

  function signOut() {
    A.auth.signOut();
    A.session.set('atlas.flash', 'Você saiu da conta.');
    location.hash = '#/login';
  }

  // ---------------- notificações ----------------
  function buildNotifs() {
    const wrap = document.createElement('div');
    wrap.className = 'notifs';
    const render = () => {
      const unread = live.unreadNotifs();
      wrap.innerHTML = `
        <div class="notifs__head"><h2 class="notifs__title">Notificações</h2><span class="notifs__sub">${unread ? `${unread} não lida${unread > 1 ? 's' : ''}` : 'Tudo em dia'}</span></div>
        <ul class="notifs__list">
          ${live.notifs.map((n) => `
            <li><button type="button" class="notif ${n.unread ? 'is-unread' : ''}" data-id="${n.id}">
              <span class="notif__mark" aria-hidden="true"></span>
              <span class="notif__body"><span class="notif__text">${n.unread ? '<span class="sr-only">Não lida: </span>' : ''}${esc(n.text)}</span><span class="notif__time">${esc(n.time)}</span></span>
            </button></li>`).join('')}
        </ul>
        <a class="notifs__all" href="#/mensagens">Ver todas</a>`;
    };
    render();
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('.notif');
      if (!b) return;
      const n = live.notifs.find((x) => x.id === b.dataset.id);
      if (n && n.unread) {
        n.unread = false;
        live.emit();
        render();
        const again = wrap.querySelector(`[data-id="${n.id}"]`);
        if (again) again.focus();
      }
    });
    return wrap;
  }

  function refreshCounts() {
    if (!S.el) return;
    const n = live.unreadNotifs();
    const c = $('#bell-count');
    c.textContent = n ? String(n) : '';
    c.hidden = !n;
    $('#bell').setAttribute('aria-label', n ? `Notificações, ${n} não lida${n > 1 ? 's' : ''}` : 'Notificações');
    D.navFlat().forEach((it) => {
      const el = $(`.nav-item[data-route="${it.id}"]`);
      if (!el) return;
      const count = badgeFor(it);
      let b = $('.nav-badge', el);
      if (count && !b) { b = document.createElement('span'); b.className = 'nav-badge'; b.dataset.badge = it.id; b.setAttribute('aria-hidden', 'true'); el.appendChild(b); }
      if (b) { if (count) b.textContent = String(count); else b.remove(); }
      el.setAttribute('aria-label', badgeLabel(it));
    });
  }

  // ---------------- folha "Mais" (celular) ----------------
  function openMore() {
    const btn = $('#bn-more');
    const u = A.auth.user() || D.demoUser;
    const wrap = document.createElement('div');
    wrap.className = 'more';
    const groups = D.nav
      .map((g) => ({ group: g.group, items: g.items.filter((i) => !D.bottomTabs.includes(i.id)) }))
      .filter((g) => g.items.length);
    wrap.innerHTML = `
      <div class="more__profile"><span class="avatar avatar--lg" aria-hidden="true">${esc(A.initials(u.name))}</span>
        <span><span class="profile__name">${esc(u.name)}</span><span class="profile__role">${esc(u.email)}</span></span></div>
      <div class="more__search" id="more-search"></div>
      <div id="more-menu">
        ${groups.map((g, i) => `
          <div class="more__group"><p class="more__title" id="mg-${i}">${esc(g.group)}</p>
          <ul aria-labelledby="mg-${i}">${g.items.map((it) => {
            const n = badgeFor(it);
            return `<li><a class="more__item" href="#/${it.id}" data-route="${it.id}" ${S.route && S.route.top === it.id ? 'aria-current="page"' : ''}>${icon(it.icon)}<span>${esc(it.label)}</span>${n && it.id !== 'projetos' ? `<span class="nav-badge" aria-label="${n} não lidas">${n}</span>` : ''}</a></li>`;
          }).join('')}</ul></div>`).join('')}
        <button type="button" class="btn btn--secondary btn--block" id="more-logout">${icon('log-out')}<span>Sair</span></button>
      </div>`;
    btn.setAttribute('aria-expanded', 'true');
    const dlg = A.ui.openDialog({ title: 'Mais', body: wrap, returnFocus: btn, className: 'dialog--sheet dialog--more', onClose: () => btn.setAttribute('aria-expanded', 'false') });
    A.search.create($('#more-search', wrap), { inline: true, placeholder: 'Buscar…', hideTarget: $('#more-menu', wrap), onPick: () => dlg.close() });
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('a.more__item')) dlg.close();
      if (e.target.closest('#more-logout')) { dlg.close(); signOut(); }
    });
  }

  // ---------------- atualização por rota ----------------
  function update(route) {
    if (!S.el) return;
    S.route = route;
    // item ativo
    $$('[data-route]', S.el).forEach((el) => {
      if (el.classList.contains('more__item')) return;
      const on = el.dataset.route === route.top;
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
    const more = $('#bn-more');
    const inMore = !D.bottomTabs.includes(route.top);
    more.classList.toggle('is-current', inMore);
    if (inMore) more.setAttribute('aria-current', 'true'); else more.removeAttribute('aria-current');
    if (D.bottomTabs.includes(route.top)) S.tabState[route.top] = route.path;

    // breadcrumbs (desktop) e topbar (celular)
    const crumbs = route.crumbs;
    $('#crumbs').innerHTML = crumbs
      .map((c, i) => (i === crumbs.length - 1
        ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
        : `<li><a href="${esc(c.href)}">${esc(c.label)}</a></li>`))
      .join('');
    const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;
    const back = $('#tb-back');
    back.hidden = !parent;
    if (parent) { back.href = parent.href; back.querySelector('span').textContent = parent.label; back.setAttribute('aria-label', `Voltar para ${parent.label}`); }
    const title = $('#tb-title');
    title.hidden = !!parent;
    title.textContent = route.title;
    $('#app-header').classList.remove('is-hidden');
    A.ui.closePopover();
  }

  A.shell = { mount, unmount, update, host: () => $('#page-host'), get mounted() { return !!S.el; }, refreshCounts };
})();
