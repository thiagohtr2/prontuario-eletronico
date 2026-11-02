/* Shell do app: sidebar integral (desktop/tablet), header com trilha,
   busca, notificações e perfil; topbar + bottom navigation no celular. */
(function () {
  var A = window.Atlas;
  var u = A.u;
  var D = A.data;
  var S = A.shell = {};

  var NAV = S.NAV = [
    { id: 'geral', title: 'Geral', items: [
      { id: 'inicio', label: 'Início', icon: 'house' },
      { id: 'painel', label: 'Painel', icon: 'dashboard' },
      { id: 'projetos', label: 'Projetos', icon: 'folder', count: function () { return D.projects.length; } },
      { id: 'tarefas', label: 'Tarefas', icon: 'checkSquare' },
      { id: 'calendario', label: 'Calendário', icon: 'calendar' }
    ] },
    { id: 'equipe', title: 'Equipe', items: [
      { id: 'pessoas', label: 'Pessoas', icon: 'users' },
      { id: 'mensagens', label: 'Mensagens', icon: 'message', unread: function () { return D.unreadMessages(); } },
      { id: 'relatorios', label: 'Relatórios', icon: 'chart' }
    ] },
    { id: 'conta', title: 'Conta', items: [
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
      { id: 'ajuda', label: 'Ajuda', icon: 'help' }
    ] }
  ];
  NAV.forEach(function (g) { g.items.forEach(function (it) { it.href = '#/' + it.id; }); });

  // 4 destinos da bottom navigation (celular)
  var TABS = S.TABS = [
    { id: 'inicio', label: 'Início', icon: 'house' },
    { id: 'painel', label: 'Painel', icon: 'dashboard' },
    { id: 'projetos', label: 'Projetos', icon: 'folder' },
    { id: 'mais', label: 'Mais', icon: 'grid' }
  ];
  S.tabOf = function (pageId) { return ['inicio', 'painel', 'projetos'].indexOf(pageId) >= 0 ? pageId : 'mais'; };

  var els = {};
  var st = {
    collapsed: !!u.store.get('sidebarCollapsed', false),
    groups: u.store.get('navGroups', {}),
    overlay: false,
    mode: u.mode(),
    tabRoute: {},       // última rota de cada destino (pilha por destino)
    scroll: {},         // posição de rolagem por rota
    restore: false,
    lastY: 0,
    route: null
  };
  var releaseOverlay = null, overlayOpener = null;

  function user() { return A.session.get() || { name: 'Convidado', email: '', role: '' }; }

  /* ---------- Templates ---------- */
  function navItemHTML(it) {
    var count = it.count ? it.count() : null;
    var unread = it.unread ? it.unread() : 0;
    return '<li><a class="nav-item" href="' + it.href + '" data-nav="' + it.id + '" aria-label="' + u.esc(ariaFor(it)) + '">' +
      A.icon(it.icon, 20) +
      '<span class="nav-item__label" aria-hidden="true">' + u.esc(it.label) + '</span>' +
      (count != null ? '<span class="nav-item__count" data-count="' + it.id + '" aria-hidden="true">' + count + '</span>' : '') +
      (it.unread ? '<span class="nav-item__badge" data-unread="' + it.id + '" aria-hidden="true"' + (unread ? '' : ' hidden') + '>' + unread + '</span>' : '') +
      '</a></li>';
  }
  function ariaFor(it) {
    var count = it.count ? it.count() : null;
    var unread = it.unread ? it.unread() : 0;
    return it.label + (count != null ? ' (' + count + ')' : '') + (unread ? ' (' + unread + ' não lidas)' : '');
  }
  function groupHTML(g) {
    var closed = st.groups[g.id] === false;
    return '<div class="nav-group' + (closed ? ' is-closed' : '') + '" data-group="' + g.id + '" role="group" aria-labelledby="ng-' + g.id + '">' +
      '<h2 class="nav-group__title"><button type="button" class="nav-group__btn" id="ng-' + g.id + '" aria-expanded="' + !closed + '" aria-controls="ng-' + g.id + '-list">' +
      '<span>' + g.title + '</span>' + A.icon('chevronDown', 16) + '</button></h2>' +
      '<ul class="nav-group__list" id="ng-' + g.id + '-list">' + g.items.map(navItemHTML).join('') + '</ul></div>';
  }

  function template() {
    var us = user();
    var ini = u.initials(us.name);
    return '<div class="shell" data-mode="desktop">' +
      '<div class="sidebar-slot">' +
        '<aside class="sidebar" id="sidebar" aria-label="Barra lateral">' +
          '<div class="sidebar__top">' +
            '<a class="sidebar__brand" href="#/inicio" aria-label="Atlas Workspace — ir para o início"><span class="logo-mark" aria-hidden="true">' + A.icon('atlas', 18) + '</span><span class="brand-name">Atlas Workspace</span></a>' +
            '<button type="button" class="icon-btn sidebar__toggle" data-sidebar-toggle aria-controls="sidebar" aria-expanded="true" aria-label="Recolher menu">' + A.icon('panelClose', 20) + '</button>' +
          '</div>' +
          '<div class="sidebar__rail-toggle"><button type="button" class="icon-btn" data-sidebar-toggle aria-controls="sidebar" aria-expanded="false" aria-label="Expandir menu" data-tip="Expandir menu">' + A.icon('menu', 20) + '</button></div>' +
          '<nav class="sidebar__nav" aria-label="Menu lateral">' + NAV.map(groupHTML).join('') + '</nav>' +
          '<div class="sidebar__footer">' +
            '<div class="profile">' +
              '<button type="button" class="profile__avatar-btn" data-side-menu aria-haspopup="menu" aria-expanded="false" aria-label="Menu do perfil" data-tip="' + u.esc(us.name) + '"><span class="avatar" data-initials>' + u.esc(ini) + '</span></button>' +
              '<span class="avatar" data-initials aria-hidden="true">' + u.esc(ini) + '</span>' +
              '<div class="profile__info"><strong data-user-name>' + u.esc(us.name) + '</strong><span data-user-role>' + u.esc(us.role) + '</span></div>' +
              '<a class="icon-btn" href="#/configuracoes" aria-label="Configurações">' + A.icon('settings', 18) + '</a>' +
              '<button type="button" class="icon-btn" data-side-menu aria-haspopup="menu" aria-expanded="false" aria-label="Mais opções do perfil">' + A.icon('more', 18) + '</button>' +
            '</div>' +
          '</div>' +
        '</aside>' +
      '</div>' +
      '<div class="main-col">' +
        '<header class="topbar" data-topbar>' +
          '<a class="topbar__logo" href="#/inicio" aria-label="Atlas Workspace — ir para o início"><span class="logo-mark" aria-hidden="true">' + A.icon('atlas', 18) + '</span></a>' +
          '<p class="topbar__title" data-topbar-title></p>' +
          '<nav class="crumbs" aria-label="Trilha de navegação"><ol data-crumbs></ol></nav>' +
          '<div class="topbar__actions">' +
            '<div class="search" role="search" data-search>' +
              '<label class="sr-only" for="global-search">Buscar páginas, projetos, pessoas e tarefas</label>' +
              '<span class="search__icon">' + A.icon('search', 18) + '</span>' +
              '<input class="search__input" id="global-search" type="search" placeholder="Buscar…" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">' +
              '<div class="popover search__results" id="search-results" role="listbox" aria-label="Resultados da busca" hidden></div>' +
            '</div>' +
            '<button type="button" class="icon-btn" data-notif aria-haspopup="dialog" aria-expanded="false" aria-label="Notificações">' + A.icon('bell', 20) + '<span class="count-badge" data-notif-count hidden></span></button>' +
            '<button type="button" class="avatar-btn" data-user-menu aria-haspopup="menu" aria-expanded="false" aria-label="Menu do perfil"><span class="avatar" data-initials>' + u.esc(ini) + '</span><span class="count-badge" data-avatar-count hidden></span></button>' +
          '</div>' +
        '</header>' +
        '<main class="content" id="main" tabindex="-1"></main>' +
      '</div>' +
      '<nav class="bottom-nav" aria-label="Navegação principal"><ul>' +
        TABS.map(function (t) {
          return '<li><a class="bn-item" href="#/' + t.id + '" data-tab="' + t.id + '"><span class="bn-item__pill">' + A.icon(t.icon, 24) + '</span><span class="bn-item__label">' + t.label + '</span></a></li>';
        }).join('') +
      '</ul></nav>' +
      '<div class="scrim sidebar-scrim" data-sidebar-scrim hidden></div>' +
    '</div>';
  }

  /* ---------- Montagem ---------- */
  S.mount = function (root) {
    root.innerHTML = template();
    els.shell = root.querySelector('.shell');
    els.sidebar = root.querySelector('#sidebar');
    els.scrim = root.querySelector('[data-sidebar-scrim]');
    els.topbar = root.querySelector('[data-topbar]');
    els.title = root.querySelector('[data-topbar-title]');
    els.crumbs = root.querySelector('[data-crumbs]');
    els.content = root.querySelector('#main');
    els.search = root.querySelector('#global-search');
    els.results = root.querySelector('#search-results');
    bind();
    applyMode();
    S.refreshBadges();
  };
  S.mounted = function () { return !!(els.shell && document.contains(els.shell)); };
  S.content = function () { return els.content; };
  S.unmount = function () { closeOverlay(false); els = {}; };

  /* ---------- Modo (desktop / tablet / celular) e trilho ---------- */
  function applyMode() {
    var m = u.mode();
    if (m !== st.mode) { closeOverlay(false); A.pop.close(false); A.tip.hide(); }
    st.mode = m;
    if (!els.shell) return;
    els.shell.dataset.mode = m;
    var rail = (m === 'desktop' && st.collapsed) || (m === 'tablet' && !st.overlay);
    els.shell.dataset.rail = String(rail);
    var topToggle = els.sidebar.querySelector('.sidebar__toggle');
    if (m === 'tablet') {
      topToggle.setAttribute('aria-label', 'Recolher menu');
      topToggle.innerHTML = A.icon('x', 20);
    } else {
      topToggle.setAttribute('aria-label', 'Recolher menu');
      topToggle.innerHTML = A.icon('panelClose', 20);
    }
    u.qsa('[data-sidebar-toggle]', els.sidebar).forEach(function (b) { b.setAttribute('aria-expanded', String(!rail)); });
    if (!rail) A.tip.hide();
  }
  window.addEventListener('resize', u.debounce(applyMode, 60));

  function toggleSidebar(trigger) {
    if (st.mode === 'tablet') {
      if (st.overlay) closeOverlay(true); else openOverlay(trigger);
      return;
    }
    st.collapsed = !st.collapsed;
    u.store.set('sidebarCollapsed', st.collapsed);
    applyMode();
    // mantém o foco no botão equivalente visível
    var target = st.collapsed ? els.sidebar.querySelector('.sidebar__rail-toggle button') : els.sidebar.querySelector('.sidebar__toggle');
    if (target) target.focus({ preventScroll: true });
  }
  S.setCollapsed = function (v) { st.collapsed = !!v; u.store.set('sidebarCollapsed', st.collapsed); applyMode(); };
  S.isCollapsed = function () { return st.collapsed; };

  function openOverlay(trigger) {
    overlayOpener = trigger || document.activeElement;
    st.overlay = true;
    els.sidebar.classList.add('is-overlay');
    els.scrim.hidden = false;
    applyMode();
    releaseOverlay = u.trapFocus(els.sidebar);
    u.lockScroll(true);
    var cur = els.sidebar.querySelector('.nav-item[aria-current="page"]') || els.sidebar.querySelector('.sidebar__toggle');
    cur.focus({ preventScroll: true });
  }
  function closeOverlay(returnFocus) {
    if (!st.overlay) return;
    st.overlay = false;
    if (els.sidebar) els.sidebar.classList.remove('is-overlay');
    if (els.scrim) els.scrim.hidden = true;
    if (releaseOverlay) releaseOverlay();
    releaseOverlay = null;
    u.lockScroll(false);
    applyMode();
    if (returnFocus) {
      var t = els.sidebar && els.sidebar.querySelector('.sidebar__rail-toggle button');
      (t || overlayOpener) && (t || overlayOpener).focus({ preventScroll: true });
    }
  }

  /* ---------- Eventos ---------- */
  function bind() {
    els.shell.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-sidebar-toggle]'))) { toggleSidebar(t); return; }
      if ((t = e.target.closest('.nav-group__btn'))) { toggleGroup(t); return; }
      if ((t = e.target.closest('[data-side-menu]'))) { sideMenu(t); return; }
      if ((t = e.target.closest('[data-user-menu]'))) { userMenu(t); return; }
      if ((t = e.target.closest('[data-notif]'))) { notifPanel(t); return; }
      if ((t = e.target.closest('.bn-item'))) { e.preventDefault(); switchTab(t.dataset.tab); return; }
      if (e.target.closest('.nav-item') && st.overlay) closeOverlay(false);
    });
    els.scrim.addEventListener('click', function () { closeOverlay(true); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && st.overlay && !A.pop.cur) { closeOverlay(true); }
    });

    // tooltips do trilho (hover e foco), sempre à direita e dentro da viewport
    function tipOn(e) {
      var a = e.target.closest('.nav-item, [data-tip]');
      if (!a || !els.sidebar.contains(a) || els.shell.dataset.rail !== 'true') return;
      var text = a.getAttribute('data-tip') || a.getAttribute('aria-label');
      A.tip.show(a, text, 'right');
    }
    function tipOff(e) {
      var a = e.target.closest('.nav-item, [data-tip]');
      if (a) A.tip.hide();
    }
    els.sidebar.addEventListener('mouseover', tipOn);
    els.sidebar.addEventListener('focusin', tipOn);
    els.sidebar.addEventListener('mouseout', tipOff);
    els.sidebar.addEventListener('focusout', tipOff);
    els.sidebar.querySelector('.sidebar__nav').addEventListener('scroll', function () { A.tip.hide(); });

    bindSearch();

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function toggleGroup(btn) {
    var g = btn.closest('.nav-group');
    var closed = g.classList.toggle('is-closed');
    btn.setAttribute('aria-expanded', String(!closed));
    st.groups[g.dataset.group] = !closed;
    u.store.set('navGroups', st.groups);
  }

  function onScroll() {
    if (!els.topbar) return;
    var y = window.scrollY;
    els.topbar.classList.toggle('is-scrolled', y > 8);
    if (st.mode === 'mobile' && !A.pop.cur) {
      if (y > st.lastY + 6 && y > 64) els.topbar.classList.add('is-hidden');
      else if (y < st.lastY - 6 || y < 64) els.topbar.classList.remove('is-hidden');
    } else {
      els.topbar.classList.remove('is-hidden');
    }
    st.lastY = y;
  }

  /* ---------- Menus ---------- */
  function logoutItem() {
    return '<hr class="menu__sep" role="separator"><button type="button" role="menuitem" class="menu__item menu__item--danger" data-logout>' + A.icon('logOut', 18) + 'Sair</button>';
  }
  function bindLogout(panel) {
    var b = panel.querySelector('[data-logout]');
    if (b) b.addEventListener('click', function () { A.pop.close(false); S.logout(); });
  }
  S.logout = function () {
    A.session.end();
    location.hash = '#/entrar';
    setTimeout(function () { A.toast('Você saiu da sua conta.'); }, 200);
  };

  function userMenu(trigger) {
    var us = user();
    var unread = D.unreadNotifications();
    A.pop.open(trigger, {
      title: 'Perfil',
      placement: 'bottom-end',
      html: '<div class="menu" role="menu" aria-label="Perfil">' +
        '<div class="menu__head" role="none"><strong>' + u.esc(us.name) + '</strong><span>' + u.esc(us.email) + '</span></div>' +
        '<a role="menuitem" class="menu__item" href="#/perfil">' + A.icon('user', 18) + 'Meu perfil</a>' +
        '<a role="menuitem" class="menu__item" href="#/configuracoes">' + A.icon('settings', 18) + 'Configurações</a>' +
        '<a role="menuitem" class="menu__item" href="#/ajuda">' + A.icon('help', 18) + 'Ajuda</a>' +
        (st.mode === 'mobile' ? '<a role="menuitem" class="menu__item" href="#/notificacoes">' + A.icon('bell', 18) + 'Notificações' + (unread ? ' (' + unread + ' não lidas)' : '') + '</a>' : '') +
        logoutItem() + '</div>',
      onMount: bindLogout
    });
  }

  function sideMenu(trigger) {
    A.tip.hide();
    A.pop.open(trigger, {
      title: 'Perfil',
      placement: els.shell.dataset.rail === 'true' ? 'right-end' : 'top-end',
      html: '<div class="menu" role="menu" aria-label="Opções do perfil">' +
        '<a role="menuitem" class="menu__item" href="#/perfil">' + A.icon('user', 18) + 'Meu perfil</a>' +
        '<a role="menuitem" class="menu__item" href="#/configuracoes?secao=preferencias">' + A.icon('sliders', 18) + 'Preferências</a>' +
        logoutItem() + '</div>',
      onMount: bindLogout
    });
  }

  /* ---------- Notificações ---------- */
  S.notifListHTML = function (list) {
    return '<ul class="notif__list" role="list">' + list.map(function (n) {
      return '<li><a class="notif__item' + (n.unread ? ' is-unread' : '') + '" href="' + n.href + '" data-notif-id="' + n.id + '">' +
        '<span class="notif__icon" aria-hidden="true">' + A.icon(n.icon, 16) + '</span>' +
        '<span class="notif__body"><span class="notif__text">' + u.esc(n.text) + '</span><span class="notif__time">' + u.esc(n.when) + '</span></span>' +
        '<span class="notif__dot">' + (n.unread ? '<span class="sr-only">Não lida</span>' : '') + '</span></a></li>';
    }).join('') + '</ul>';
  };
  function notifPanel(trigger) {
    function html() {
      return '<div class="notif">' +
        '<div class="notif__head"><h2>Notificações</h2><button type="button" class="link-btn" data-mark-all data-autofocus>Marcar todas como lidas</button></div>' +
        S.notifListHTML(D.notifications.slice(0, 5)) +
        '<a class="notif__all" href="#/notificacoes">Ver todas</a></div>';
    }
    A.pop.open(trigger, {
      title: 'Notificações',
      role: 'dialog',
      placement: 'bottom-end',
      width: 320,
      html: html(),
      onMount: function (panel) {
        panel.addEventListener('click', function (e) {
          var m = e.target.closest('[data-mark-all]');
          if (m) {
            D.notifications.forEach(function (n) { n.unread = false; });
            u.qsa('.notif__item', panel).forEach(function (a) { a.classList.remove('is-unread'); a.querySelector('.notif__dot').innerHTML = ''; });
            S.refreshBadges();
            A.toast('Todas as notificações foram marcadas como lidas.');
            return;
          }
          var it = e.target.closest('[data-notif-id]');
          if (it) S.markNotif(it.dataset.notifId);
        });
      }
    });
  }
  S.markNotif = function (id) {
    D.notifications.forEach(function (n) { if (n.id === id) n.unread = false; });
    S.refreshBadges();
  };

  /* ---------- Busca (combobox) ---------- */
  function searchIndex() {
    var out = [];
    NAV.forEach(function (g) { g.items.forEach(function (it) { out.push({ type: 'Páginas', label: it.label, sub: g.title, href: it.href, icon: it.icon }); }); });
    out.push({ type: 'Páginas', label: 'Notificações', sub: 'Conta', href: '#/notificacoes', icon: 'bell' });
    out.push({ type: 'Páginas', label: 'Meu perfil', sub: 'Conta', href: '#/perfil', icon: 'user' });
    D.projects.forEach(function (p) { out.push({ type: 'Projetos', label: p.name, sub: D.STATUS[p.status], href: '#/projetos/' + p.id, icon: p.icon }); });
    D.people.forEach(function (p) { out.push({ type: 'Pessoas', label: p.name, sub: p.role, href: '#/pessoas?q=' + encodeURIComponent(p.name), icon: 'user' }); });
    D.tasks.forEach(function (t) { var p = D.project(t.project); out.push({ type: 'Tarefas', label: t.title, sub: p ? p.name : '', href: '#/tarefas?q=' + encodeURIComponent(t.title), icon: 'checkSquare' }); });
    return out;
  }
  /** Busca sem diferenciar maiúsculas e acentos. */
  A.search = function (q) {
    var n = u.norm(q);
    if (!n) return [];
    return searchIndex().filter(function (x) { return u.norm(x.label + ' ' + (x.sub || '')).indexOf(n) >= 0; }).slice(0, 14);
  };
  A.searchResultsHTML = function (q, results, idPrefix) {
    if (!results.length) return '<p class="search__empty" role="status">Nada encontrado para “' + u.esc(q) + '”.</p>';
    var html = '', last = '';
    results.forEach(function (r, i) {
      if (r.type !== last) { html += '<div class="search__group" role="presentation">' + r.type + '</div>'; last = r.type; }
      html += '<a class="search__opt" role="option" id="' + idPrefix + i + '" href="' + r.href + '" aria-selected="false" tabindex="-1">' + A.icon(r.icon, 18) +
        '<span>' + u.esc(r.label) + (r.sub ? '<small>' + u.esc(r.sub) + '</small>' : '') + '</span></a>';
    });
    return html;
  };

  function bindSearch() {
    var input = els.search, box = els.results, active = -1, opts = [];
    function close() { box.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; }
    function run() {
      var q = input.value;
      if (!u.norm(q)) { close(); return; }
      box.innerHTML = A.searchResultsHTML(q, A.search(q), 'sr-opt-');
      box.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      opts = u.qsa('.search__opt', box);
      active = -1;
    }
    function setActive(i) {
      opts.forEach(function (o) { o.classList.remove('is-active'); o.setAttribute('aria-selected', 'false'); });
      active = i;
      if (i >= 0 && opts[i]) {
        opts[i].classList.add('is-active');
        opts[i].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', opts[i].id);
        opts[i].scrollIntoView({ block: 'nearest' });
      }
    }
    input.addEventListener('input', run);
    input.addEventListener('focus', function () { if (input.value) run(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (box.hidden) run(); if (opts.length) setActive((active + 1) % opts.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (opts.length) setActive((active - 1 + opts.length) % opts.length); }
      else if (e.key === 'Enter') { if (active >= 0 && opts[active]) { e.preventDefault(); location.hash = opts[active].getAttribute('href'); input.value = ''; close(); } }
      else if (e.key === 'Escape') { if (!box.hidden) { e.preventDefault(); close(); } else { input.value = ''; } }
    });
    box.addEventListener('mousedown', function (e) { e.preventDefault(); }); // não perde o foco antes do clique
    box.addEventListener('click', function (e) {
      var o = e.target.closest('.search__opt');
      if (o) { input.value = ''; close(); }
    });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
  }

  /* ---------- Bottom navigation: pilha e rolagem por destino ---------- */
  function switchTab(tab) {
    var cur = st.route ? S.tabOf(st.route.page) : null;
    if (cur === tab) {
      // tocar no destino ativo: rola para o topo; já no topo, volta à raiz do destino
      if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: u.reducedMotion() ? 'auto' : 'smooth' });
      else if (location.hash !== '#/' + tab) location.hash = '#/' + tab;
      return;
    }
    var target = st.tabRoute[tab] || '#/' + tab;
    st.restore = true;
    if (location.hash === target) A.router.render(); else location.hash = target;
  }

  /** Chamado pelo roteador antes de trocar de rota. */
  S.saveScroll = function (hash) { if (hash) st.scroll[hash] = window.scrollY; };
  /** Depois de renderizar: restaura a rolagem ao voltar para um destino, ou vai ao topo. */
  S.afterRender = function (hash) {
    var y = st.restore ? (st.scroll[hash] || 0) : 0;
    st.restore = false;
    window.scrollTo(0, y);
    if (els.topbar) els.topbar.classList.remove('is-hidden');
    onScroll();
  };

  /* ---------- Atualização por rota ---------- */
  S.update = function (route) {
    st.route = route;
    closeOverlay(false);
    A.pop.close(false);
    A.tip.hide();
    // sidebar
    u.qsa('.nav-item', els.sidebar).forEach(function (a) {
      if (a.dataset.nav === route.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    // bottom nav
    var tab = S.tabOf(route.page);
    st.tabRoute[tab] = location.hash || '#/' + tab;
    u.qsa('.bn-item', els.shell).forEach(function (a) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    // trilha
    var crumbs = route.crumbs || [{ label: route.title }];
    els.crumbs.innerHTML = crumbs.map(function (c, i) {
      var last = i === crumbs.length - 1;
      return '<li>' + (last ? '<span aria-current="page">' + u.esc(c.label) + '</span>' : '<a href="' + c.href + '">' + u.esc(c.label) + '</a>') + '</li>';
    }).join('');
    els.title.textContent = route.title;
    S.refreshBadges();
  };

  /** Link único "‹ Nível anterior" (celular). */
  S.backLink = function (crumbs) {
    if (!crumbs || crumbs.length < 2) return '';
    var prev = crumbs[crumbs.length - 2];
    return '<nav class="crumb-back" aria-label="Trilha de navegação (nível anterior)"><a href="' + prev.href + '">' + A.icon('chevronLeft', 20) + u.esc(prev.label) + '</a></nav>';
  };

  S.refreshBadges = function () {
    if (!els.shell) return;
    NAV.forEach(function (g) {
      g.items.forEach(function (it) {
        var a = els.sidebar.querySelector('[data-nav="' + it.id + '"]');
        if (!a) return;
        a.setAttribute('aria-label', ariaFor(it));
        var c = a.querySelector('[data-count]');
        if (c) c.textContent = it.count();
        var b = a.querySelector('[data-unread]');
        if (b) { var n = it.unread(); b.textContent = n; b.hidden = !n; }
      });
    });
    var nn = D.unreadNotifications();
    var nb = els.shell.querySelector('[data-notif-count]');
    nb.textContent = nn; nb.hidden = !nn;
    els.shell.querySelector('[data-notif]').setAttribute('aria-label', nn ? 'Notificações, ' + nn + ' não lidas' : 'Notificações');
    var ab = els.shell.querySelector('[data-avatar-count]');
    ab.textContent = nn; ab.hidden = !nn;
    els.shell.querySelector('[data-user-menu]').setAttribute('aria-label', 'Menu do perfil' + (nn && st.mode === 'mobile' ? ', ' + nn + ' notificações não lidas' : ''));
  };

  S.refreshUser = function () {
    if (!els.shell) return;
    var us = user();
    u.qsa('[data-initials]', els.shell).forEach(function (e) { e.textContent = u.initials(us.name); });
    var n = els.shell.querySelector('[data-user-name]'); if (n) n.textContent = us.name;
    var r = els.shell.querySelector('[data-user-role]'); if (r) r.textContent = us.role;
    var ab = els.shell.querySelector('.profile__avatar-btn'); if (ab) ab.setAttribute('data-tip', us.name);
  };
})();
