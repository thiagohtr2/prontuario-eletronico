/* Shell da aplicação: sidebar integral (desktop/tablet), header de contexto,
   barra superior + Bottom Navigation (mobile), notificações, menu do perfil e busca. */
(function () {
  'use strict';

  var A = window.Atlas;
  var icon = A.icon;
  var esc = A.esc;

  A.state = { unread: 3 };

  var NAV = [
    { id: 'geral', title: 'Geral', items: [
      { path: '/app/inicio', label: 'Início', icon: 'home' },
      { path: '/app/painel', label: 'Painel', icon: 'layout' },
      { path: '/app/projetos', label: 'Projetos', icon: 'folder' },
      { path: '/app/tarefas', label: 'Tarefas', icon: 'check' },
      { path: '/app/calendario', label: 'Calendário', icon: 'calendar' }
    ] },
    { id: 'equipe', title: 'Equipe', items: [
      { path: '/app/equipe', label: 'Pessoas', icon: 'users' },
      { path: '/app/mensagens', label: 'Mensagens', icon: 'message' },
      { path: '/app/relatorios', label: 'Relatórios', icon: 'chart' }
    ] },
    { id: 'conta', title: 'Conta', items: [
      { path: '/app/configuracoes', label: 'Configurações', icon: 'settings' },
      { path: '/app/ajuda', label: 'Ajuda', icon: 'help' }
    ] }
  ];

  // Destinos da Bottom Navigation (mobile): 4 itens rotulados de largura igual
  var BOTTOM = [
    { path: '/app/inicio', label: 'Início', icon: 'home' },
    { path: '/app/projetos', label: 'Projetos', icon: 'folder' },
    { path: '/app/equipe', label: 'Equipe', icon: 'users' },
    { path: '/app/configuracoes', label: 'Ajustes', icon: 'settings' }
  ];

  // Em qual destino da barra inferior cada tela "pertence" (para manter um item ativo)
  var TAB_FOR = {
    '/app/painel': '/app/inicio',
    '/app/calendario': '/app/inicio',
    '/app/tarefas': '/app/projetos',
    '/app/relatorios': '/app/projetos',
    '/app/mensagens': '/app/equipe',
    '/app/ajuda': '/app/configuracoes'
  };

  var NOTIFS = [
    { title: 'Maria comentou em "Viagem a Lisboa"', time: 'há 12 min', unread: true, href: '#/app/projetos' },
    { title: 'Pedido #1042 foi pago', time: 'há 1 h', unread: true, href: '#/app/relatorios' },
    { title: 'Lucas concluiu 3 tarefas', time: 'ontem', unread: false, href: '#/app/tarefas' },
    { title: 'Novo membro entrou na equipe', time: 'ontem', unread: false, href: '#/app/equipe' }
  ];

  var COLLAPSE_KEY = 'atlas.sidebar.collapsed';
  var GROUPS_KEY = 'atlas.sidebar.groups';

  var overlayTrigger = null;
  var overlayRelease = null;
  var tipEl = null;

  function allItems() {
    var out = [];
    NAV.forEach(function (g) {
      g.items.forEach(function (it) {
        out.push({ path: it.path, label: it.label, icon: it.icon, group: g.title });
      });
    });
    return out;
  }

  function groupOf(path) {
    var found = null;
    NAV.forEach(function (g) {
      g.items.forEach(function (it) { if (it.path === path) found = g.title; });
    });
    return found || 'Atlas';
  }

  function isMd() {
    return window.matchMedia('(min-width: 768px) and (max-width: 1023.98px)').matches;
  }

  function isDesktop() {
    return window.matchMedia('(min-width: 768px)').matches;
  }

  /* ---------- HTML ---------- */
  function badgeAttr(path) {
    return ' data-badge="' + path + '"';
  }

  function navItem(it) {
    var badge = '';
    if (it.path === '/app/projetos') badge = '<span class="nav-badge"' + badgeAttr(it.path) + '>12</span>';
    if (it.path === '/app/mensagens') badge = '<span class="nav-badge"' + badgeAttr(it.path) + '>' + A.state.unread + '</span>';
    return '<li><a class="nav-item" href="#' + it.path + '">' +
      icon(it.icon, { size: 20 }) +
      '<span class="nav-label">' + esc(it.label) + '</span>' + badge + '</a></li>';
  }

  function navHtml() {
    return NAV.map(function (g) {
      return '<section class="nav-group" aria-labelledby="grp-' + g.id + '">' +
        '<h2 class="nav-group__title" id="grp-' + g.id + '">' +
          '<button type="button" class="nav-group__btn" data-action="toggle-group" aria-expanded="true" aria-controls="grp-' + g.id + '-list">' +
          esc(g.title) + icon('chevronDown', { size: 14 }) + '</button></h2>' +
        '<ul class="nav-list" id="grp-' + g.id + '-list">' + g.items.map(navItem).join('') + '</ul>' +
      '</section>';
    }).join('');
  }

  function bottomHtml(path) {
    var active = TAB_FOR[path] || path;
    return BOTTOM.map(function (t) {
      var on = t.path === active;
      return '<a class="bnav-item" href="#' + t.path + '" data-action="tab" data-path="' + t.path + '"' + (on ? ' aria-current="page"' : '') + '>' +
        '<span class="bnav-ico">' + icon(t.icon, { size: 24, filled: on }) + '</span>' +
        '<span class="bnav-label">' + esc(t.label) + '</span></a>';
    }).join('');
  }

  function shellHtml() {
    var s = A.session.get() || { name: 'Visitante', role: '' };
    var ini = A.initials(s.name);
    return '<div class="shell" id="shell" data-collapsed="false">' +
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar__top">' +
          '<a class="brand" href="#/app/inicio" aria-label="Atlas Workspace, ir para o início">' +
            '<span class="brand__mark">' + icon('logo', { size: 18 }) + '</span>' +
            '<span class="brand-name">Atlas Workspace</span></a>' +
          '<button type="button" class="icon-btn btn-collapse" data-action="toggle-collapse" aria-label="Recolher menu" aria-expanded="true" aria-controls="sidebar-nav">' + icon('collapse') + '</button>' +
          '<button type="button" class="icon-btn btn-close" data-action="close-overlay" aria-label="Fechar menu">' + icon('x') + '</button>' +
        '</div>' +
        '<nav class="sidebar__nav" id="sidebar-nav" aria-label="Menu lateral">' + navHtml() + '</nav>' +
        '<div class="sidebar__foot">' +
          '<button type="button" class="profile" data-action="open-sidebar-profile" aria-haspopup="dialog" aria-expanded="false" aria-label="Perfil de ' + esc(s.name) + ', menu da conta">' +
            '<span class="avatar" aria-hidden="true">' + esc(ini) + '</span>' +
            '<span class="profile__text"><span class="profile__name">' + esc(s.name) + '</span><span class="profile__role">' + esc(s.role || '') + '</span></span>' +
            '<span class="profile__more" aria-hidden="true">' + icon('more', { size: 18 }) + '</span>' +
          '</button>' +
        '</div>' +
      '</aside>' +
      '<div class="main">' +
        '<header class="header" id="header">' +
          '<button type="button" class="icon-btn header__menu" data-action="open-overlay" aria-label="Abrir menu" aria-expanded="false" aria-controls="sidebar">' + icon('menu') + '</button>' +
          '<nav class="crumbs" aria-label="Trilha de navegação"><ol id="crumbs"></ol></nav>' +
          '<div class="header__actions">' +
            '<form class="search" id="search-form" role="search">' +
              icon('search', { size: 16 }) +
              '<input class="input" id="global-search" type="search" placeholder="Buscar páginas" aria-label="Buscar páginas" autocomplete="off" enterkeyhint="search">' +
            '</form>' +
            bellButton() +
            '<button type="button" class="avatar-btn" data-action="open-user-menu" aria-haspopup="dialog" aria-expanded="false" aria-label="Menu do perfil de ' + esc(s.name) + '">' +
              '<span class="avatar" aria-hidden="true">' + esc(ini) + '</span></button>' +
          '</div>' +
        '</header>' +
        '<main id="page" class="content" tabindex="-1"></main>' +
      '</div>' +
      '<header class="m-topbar">' +
        '<p class="m-topbar__title" data-m-title></p>' +
        '<div class="header__actions">' + bellButton() + '</div>' +
      '</header>' +
      '<nav class="bottom-nav" id="bottom-nav" aria-label="Principal"></nav>' +
      '<div class="scrim" id="scrim" data-action="close-overlay" hidden></div>' +
    '</div>';
  }

  function bellButton() {
    return '<button type="button" class="icon-btn bell" data-action="open-notifications" aria-haspopup="dialog" aria-expanded="false" aria-label="Notificações">' +
      icon('bell') + '<span class="bell__count" data-bell-count></span></button>';
  }

  /* ---------- montagem ---------- */
  A.mountShell = function () {
    if (A.layout === 'app' && A.$('#shell')) return;
    var app = A.$('#app');
    app.innerHTML = shellHtml();
    A.layout = 'app';
    wireShell();
    applySidebar();
    applyGroups();
    refreshBadges();
  };

  function wireShell() {
    var sb = A.$('#sidebar');
    sb.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a.nav-item') && sb.classList.contains('is-overlay')) {
        closeOverlay(false);
      }
    });
    sb.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest('.nav-item') : null;
      if (t) showTip(t); else hideTip();
    });
    sb.addEventListener('mouseleave', hideTip);
    sb.addEventListener('focusin', function (e) {
      var t = e.target.closest ? e.target.closest('.nav-item') : null;
      if (t) showTip(t);
    });
    sb.addEventListener('focusout', hideTip);

    var form = A.$('#search-form');
    var input = A.$('#global-search');
    input.addEventListener('input', function () {
      var q = input.value.trim();
      if (!q) {
        if (A.isPopoverOpen(input)) A.closePopover(false);
        return;
      }
      var html = searchHtml(q);
      if (A.isPopoverOpen(input)) {
        A.updatePopover(html);
      } else {
        A.openPopover(input, {
          html: html,
          className: 'search-results',
          role: 'dialog',
          label: 'Resultados da busca',
          placement: 'bottom-start',
          keepFocus: true
        });
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = A.$('.popover .menu-item');
      if (first) {
        var path = first.getAttribute('href').replace(/^#/, '');
        A.closePopover(false);
        input.value = '';
        A.go(path);
      }
    });
  }

  function searchHtml(q) {
    var n = A.normalize(q);
    var items = allItems().filter(function (i) {
      return A.normalize(i.label).indexOf(n) !== -1 || A.normalize(i.group).indexOf(n) !== -1;
    });
    if (!items.length) {
      return '<p class="empty"><strong>Nada encontrado</strong>Tente outro termo.</p>';
    }
    return items.map(function (i) {
      return '<a class="menu-item" href="#' + i.path + '">' + icon(i.icon, { size: 18 }) +
        '<span>' + esc(i.label) + '</span><span class="menu-item__meta">' + esc(i.group) + '</span></a>';
    }).join('');
  }

  /* ---------- estado do shell ---------- */
  function badgeValue(path) {
    if (path === '/app/projetos') return '12';
    if (path === '/app/mensagens') return A.state.unread > 0 ? String(A.state.unread) : '';
    return '';
  }

  function refreshBadges() {
    A.$$('[data-badge]').forEach(function (el) {
      var n = badgeValue(el.getAttribute('data-badge'));
      el.hidden = !n;
      el.textContent = n;
    });
    var unreadNotifs = NOTIFS.filter(function (n) { return n.unread; }).length;
    A.$$('[data-bell-count]').forEach(function (el) {
      el.textContent = unreadNotifs ? String(unreadNotifs) : '';
      el.hidden = !unreadNotifs;
    });
    A.$$('.bell').forEach(function (el) {
      el.setAttribute('aria-label', unreadNotifs ? 'Notificações, ' + unreadNotifs + ' não lidas' : 'Notificações');
    });
    A.shell.refreshBadges = refreshBadges;
  }

  function applySidebar() {
    var sb = A.$('#sidebar');
    var shell = A.$('#shell');
    if (!sb || !shell) return;
    var md = isMd();
    var desktop = isDesktop();
    var collapsed = desktop && !md && A.store.get(COLLAPSE_KEY, false) === true;
    var overlay = sb.classList.contains('is-overlay');
    shell.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
    sb.classList.toggle('is-rail', !overlay && (md || collapsed));
    var btn = A.$('.btn-collapse');
    if (btn) {
      btn.hidden = md;
      btn.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.innerHTML = icon(collapsed ? 'expand' : 'collapse');
    }
  }

  function applyGroups() {
    var saved = A.store.get(GROUPS_KEY, {}) || {};
    A.$$('.nav-group__btn').forEach(function (btn) {
      var id = btn.getAttribute('aria-controls').replace(/-list$/, '');
      var open = saved[id] !== false;
      var list = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (list) list.hidden = !open;
    });
  }

  A.shell = {
    refreshBadges: refreshBadges,
    closeOverlay: function (restore) { closeOverlay(restore); },
    update: function (path, def) {
      var crumbs = A.$('#crumbs');
      if (crumbs) {
        crumbs.innerHTML = '<li>' + esc(groupOf(path)) + '</li><li aria-current="page">' + esc(def.title) + '</li>';
      }
      var mt = A.$('[data-m-title]');
      if (mt) mt.textContent = def.title;
      A.$$('.nav-item').forEach(function (a) {
        if (a.getAttribute('href') === '#' + path) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
      var bn = A.$('#bottom-nav');
      if (bn) bn.innerHTML = bottomHtml(path);
      refreshBadges();
    }
  };

  /* ---------- tooltips do trilho (ficam no body para não serem cortados) ---------- */
  function showTip(target) {
    var sb = A.$('#sidebar');
    if (!sb || !sb.classList.contains('is-rail')) return;
    var label = target.querySelector('.nav-label');
    if (!label) return;
    hideTip();
    tipEl = document.createElement('div');
    tipEl.className = 'tooltip';
    tipEl.setAttribute('role', 'tooltip');
    tipEl.textContent = label.textContent;
    document.body.appendChild(tipEl);
    var r = target.getBoundingClientRect();
    tipEl.style.left = (r.right + 10) + 'px';
    tipEl.style.top = (r.top + r.height / 2) + 'px';
    tipEl.style.transform = 'translateY(-50%)';
  }

  function hideTip() {
    if (tipEl) { tipEl.remove(); tipEl = null; }
  }

  /* ---------- sidebar em sobreposição (768–1023 px) ---------- */
  function openOverlay(trigger) {
    var sb = A.$('#sidebar');
    if (!sb) return;
    overlayTrigger = trigger || null;
    sb.classList.add('is-overlay');
    sb.classList.remove('is-rail');
    A.$('#scrim').hidden = false;
    var menuBtn = A.$('.header__menu');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    overlayRelease = A.trapFocus(sb, function () { closeOverlay(true); });
    A.focusFirst(sb);
  }

  function closeOverlay(restore) {
    var sb = A.$('#sidebar');
    if (!sb || !sb.classList.contains('is-overlay')) return;
    sb.classList.remove('is-overlay');
    A.$('#scrim').hidden = true;
    var menuBtn = A.$('.header__menu');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (overlayRelease) { overlayRelease(); overlayRelease = null; }
    applySidebar();
    if (restore !== false && overlayTrigger && document.body.contains(overlayTrigger)) {
      overlayTrigger.focus();
    }
    overlayTrigger = null;
  }

  /* ---------- menus e popovers ---------- */
  function menuLink(href, iconName, label) {
    return '<a class="menu-item" href="' + href + '">' + icon(iconName, { size: 18 }) + '<span>' + esc(label) + '</span></a>';
  }

  function profileMenuHtml() {
    var s = A.session.get() || {};
    return '<div class="popover__head"><strong>' + esc(s.name || '') + '</strong><span>' + esc(s.email || '') + '</span></div>' +
      menuLink('#/app/configuracoes', 'user', 'Meu perfil') +
      menuLink('#/app/configuracoes', 'settings', 'Preferências') +
      menuLink('#/app/ajuda', 'help', 'Ajuda') +
      '<div class="popover__foot"><button type="button" class="menu-item menu-item--danger" data-action="logout">' +
      icon('logout', { size: 18 }) + '<span>Sair</span></button></div>';
  }

  A.actions['toggle-collapse'] = function () {
    var collapsed = A.store.get(COLLAPSE_KEY, false) === true;
    A.store.set(COLLAPSE_KEY, !collapsed);
    applySidebar();
  };

  A.actions['open-overlay'] = function (el) { openOverlay(el); };
  A.actions['close-overlay'] = function () { closeOverlay(true); };

  A.actions['toggle-group'] = function (el) {
    var list = document.getElementById(el.getAttribute('aria-controls'));
    var open = el.getAttribute('aria-expanded') !== 'true';
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (list) list.hidden = !open;
    var saved = A.store.get(GROUPS_KEY, {}) || {};
    saved[el.getAttribute('aria-controls').replace(/-list$/, '')] = open;
    A.store.set(GROUPS_KEY, saved);
  };

  A.actions['tab'] = function (el, e) {
    var path = el.getAttribute('data-path');
    var current = A.currentPath();
    var activeTab = TAB_FOR[current] || current;
    if (activeTab === path) {
      // Tocar no destino ativo rola a tela daquele destino para o topo
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: A.prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  A.actions['open-notifications'] = function (el) {
    var unread = NOTIFS.filter(function (n) { return n.unread; }).length;
    var items = NOTIFS.map(function (n) {
      return '<a class="notif-item" href="' + n.href + '">' +
        '<span class="notif-item__dot' + (n.unread ? '' : ' is-read') + '" aria-hidden="true"></span>' +
        '<span>' + esc(n.title) + '<small>' + esc(n.time) + (n.unread ? ' · não lida' : '') + '</small></span></a>';
    }).join('');
    A.openPopover(el, {
      html: '<div class="popover__head"><strong>Notificações</strong><span>' + unread + ' não lidas</span></div>' +
        items + '<div class="popover__foot"><a class="menu-item" href="#/app/mensagens">Ver todas</a></div>',
      className: 'popover--notif',
      role: 'dialog',
      label: 'Notificações',
      placement: 'bottom-end'
    });
  };

  A.actions['open-user-menu'] = function (el) {
    A.openPopover(el, {
      html: profileMenuHtml(),
      className: 'popover--menu',
      role: 'dialog',
      label: 'Menu do perfil',
      placement: 'bottom-end',
      focusFirst: true
    });
  };

  A.actions['open-sidebar-profile'] = function (el) {
    A.openPopover(el, {
      html: profileMenuHtml(),
      className: 'popover--menu',
      role: 'dialog',
      label: 'Menu da conta',
      placement: 'top-start',
      focusFirst: true
    });
  };

  A.actions['logout'] = function () {
    A.closePopover(false);
    A.session.clear();
    A.go('/entrar');
  };

  /* ---------- eventos globais do shell ---------- */
  window.addEventListener('scroll', function () {
    var h = A.$('.header');
    if (h) h.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  window.addEventListener('resize', function () {
    var sb = A.$('#sidebar');
    if (sb && sb.classList.contains('is-overlay') && !isMd()) closeOverlay(false);
    applySidebar();
  });
})();
