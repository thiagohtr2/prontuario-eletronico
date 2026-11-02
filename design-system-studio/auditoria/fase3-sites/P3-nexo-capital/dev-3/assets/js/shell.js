/* Shell da aplicação e roteamento por hash.
   Desktop (>= 768 px): sidebar integral 252 px + cabeçalho 64 px.
   Tablet (768-1023 px): rail de 72 px que expande em sobreposição.
   Mobile (< 768 px): topbar 56 px + drawer pela esquerda. */
(function (ns) {
  'use strict';
  var h = ns.h, svg = ns.svg;
  var NAV_KEY = 'nexo-nav-groups';
  var mobileQ = window.matchMedia('(max-width: 767px)');
  var railQ = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

  var refs = {};
  var side = { open: false, trigger: null, release: null };

  function isMobile() { return mobileQ.matches; }

  function readGroups() {
    try { return JSON.parse(ns.safeLocalGet(NAV_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveGroup(name, open) {
    var all = readGroups();
    all[name] = open;
    ns.safeLocalSet(NAV_KEY, JSON.stringify(all));
  }

  function initials(name) {
    return name.split(' ').map(function (p) { return p.charAt(0); }).slice(0, 2).join('').toUpperCase();
  }

  function parseRoute(hash) {
    var m = hash.match(/^#\/app\/painel(?:\/([a-z-]+))?$/);
    if (m) {
      var sec = m[1] || 'visao-geral';
      return ns.DASHBOARDS[sec] ? { kind: 'dashboard', section: sec } : null;
    }
    m = hash.match(/^#\/app\/([a-z-]+)$/);
    if (m && ns.PAGES[m[1]]) return { kind: 'page', id: m[1] };
    return null;
  }

  function currentSection() {
    var r = parseRoute(window.location.hash || '');
    return r && r.kind === 'dashboard' ? r.section : 'visao-geral';
  }

  function profileMenu(trigger) {
    ns.openMenu({
      trigger: trigger, align: 'end', placement: 'down', label: 'Menu do perfil',
      header: h('div', { class: 'menu-head' },
        h('strong', { text: ns.USER.name }),
        h('span', { class: 'muted', text: ns.USER.email })),
      items: [
        { label: 'Meu perfil', icon: 'user', onSelect: function () { ns.toast('Perfil indisponível na demonstração.'); } },
        { label: 'Configurações', icon: 'settings', onSelect: function () { ns.toast('Configurações indisponíveis na demonstração.'); } },
        { label: 'Ajuda', icon: 'help', onSelect: function () { ns.toast('Central de ajuda indisponível na demonstração.'); } },
        { separator: true },
        { label: 'Sair', icon: 'logout', danger: true, onSelect: doLogout }
      ]
    });
  }

  function doLogout() {
    closeSidebar(false);
    ns.logout();
    window.location.hash = '#/login';
  }

  function avatarButton(cls) {
    var btn = h('button', {
      class: cls || 'avatar-btn', type: 'button',
      'aria-label': 'Menu do perfil: ' + ns.USER.name, 'aria-haspopup': 'menu', 'aria-expanded': 'false'
    }, h('span', { class: 'avatar avatar-sm', 'aria-hidden': 'true', text: ns.USER.initials }));
    btn.addEventListener('click', function () { profileMenu(btn); });
    return btn;
  }

  function navItem(item) {
    var a = h('a', { class: 'nav-item', href: item.href, 'data-nav': item.id },
      svg(item.icon),
      h('span', { class: 'nav-label', text: item.label }),
      h('span', { class: 'tip', 'aria-hidden': 'true', text: item.label }));
    a.addEventListener('click', function () { if (side.open) closeSidebar(true); });
    return a;
  }

  function navGroup(group, idx, saved) {
    var open = saved[group.group] !== false;
    var btnId = 'grp-btn-' + idx;
    var listId = 'grp-list-' + idx;
    var list = h('ul', { class: 'nav-list', id: listId, hidden: !open }, group.items.map(function (it) {
      return h('li', null, navItem(it));
    }));
    var btn = h('button', { class: 'nav-group-btn', type: 'button', id: btnId, 'aria-expanded': open ? 'true' : 'false', 'aria-controls': listId },
      h('span', { class: 'nav-group-name', text: group.group }),
      svg('chevronDown', 'nav-chev'));
    btn.addEventListener('click', function () {
      var now = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', now ? 'true' : 'false');
      list.hidden = !now;
      saveGroup(group.group, now);
    });
    return h('section', { class: 'nav-group', 'aria-labelledby': btnId },
      h('h2', { class: 'nav-group-title' }, btn), list);
  }

  function analyticsGroup() {
    return h('section', { class: 'nav-group only-mobile', 'aria-labelledby': 'grp-analitico' },
      h('h2', { class: 'nav-group-title' }, h('span', { class: 'nav-group-name', id: 'grp-analitico', text: 'Painel analítico' })),
      h('ul', { class: 'nav-list' }, ns.SECTIONS.map(function (s) {
        var a = h('a', { class: 'nav-item sec-link', href: '#/app/painel/' + s.id, 'data-section': s.id },
          h('span', { class: 'nav-label', text: s.label }));
        a.addEventListener('click', function () { if (side.open) closeSidebar(true); });
        return h('li', null, a);
      })));
  }

  function unitButton() {
    var label = ns.UNITS[0];
    var btn = h('button', { class: 'unit-btn', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
      h('span', { class: 'unit-name', text: label }), svg('chevronDown'));
    btn.addEventListener('click', function () {
      ns.openMenu({
        trigger: btn, align: 'start', placement: 'down', label: 'Unidades',
        items: ns.UNITS.map(function (u) {
          return { label: u, current: u === label, onSelect: function () {
            label = u;
            btn.querySelector('.unit-name').textContent = u;
            ns.toast('Unidade alterada para ' + u + '.');
          } };
        }).concat([
          { separator: true },
          { label: 'Criar unidade', icon: 'building', onSelect: function () { ns.toast('Criação de unidade indisponível na demonstração.'); } }
        ])
      });
    });
    return btn;
  }

  function buildShell(root) {
    var saved = readGroups();

    refs.nav = h('nav', { class: 'sb-nav', 'aria-label': 'Menu lateral' },
      ns.NAV.map(function (g, i) { return navGroup(g, i, saved); }),
      analyticsGroup());

    refs.railToggle = h('button', { class: 'rail-toggle only-md', type: 'button', 'aria-label': 'Expandir menu', 'aria-expanded': 'false', 'aria-controls': 'sidebar' }, svg('menu'));
    refs.railToggle.addEventListener('click', function () {
      if (side.open) closeSidebar(true); else openSidebar(refs.railToggle);
    });

    var profileBtn = h('button', { class: 'icon-btn profile-more', type: 'button', 'aria-label': 'Opções do perfil', 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, svg('more'));
    profileBtn.addEventListener('click', function () {
      ns.openMenu({
        trigger: profileBtn, align: 'start', placement: 'up', label: 'Opções do perfil',
        items: [
          { label: 'Meu perfil', icon: 'user', onSelect: function () { ns.toast('Perfil indisponível na demonstração.'); } },
          { label: 'Preferências', icon: 'settings', onSelect: function () { ns.toast('Preferências indisponíveis na demonstração.'); } },
          { separator: true },
          { label: 'Sair', icon: 'logout', danger: true, onSelect: doLogout }
        ]
      });
    });

    var settingsBtn = h('button', { class: 'nav-item sb-settings only-desktop', type: 'button' }, svg('settings'), h('span', { class: 'nav-label', text: 'Configurações' }));
    settingsBtn.addEventListener('click', function () { ns.toast('Configurações indisponíveis na demonstração.'); });

    var drawerClose = h('button', { class: 'icon-btn drawer-close only-mobile', type: 'button', 'aria-label': 'Fechar menu' }, svg('x'));
    drawerClose.addEventListener('click', function () { closeSidebar(true); });

    var mobileLinks = h('div', { class: 'sb-mobile-links only-mobile' },
      h('button', { class: 'nav-item', type: 'button', onclick: function () { ns.toast('Configurações indisponíveis na demonstração.'); } }, svg('settings'), h('span', { class: 'nav-label', text: 'Configurações' })),
      h('button', { class: 'nav-item', type: 'button', onclick: function () { ns.toast('Central de ajuda indisponível na demonstração.'); } }, svg('help'), h('span', { class: 'nav-label', text: 'Ajuda' })),
      h('button', { class: 'nav-item is-danger', type: 'button', onclick: doLogout }, svg('logout'), h('span', { class: 'nav-label', text: 'Sair' })));

    refs.sidebar = h('aside', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Navegação principal' },
      h('div', { class: 'drawer-head only-mobile' },
        h('span', { class: 'avatar', 'aria-hidden': 'true', text: ns.USER.initials }),
        h('div', { class: 'drawer-who' }, h('strong', { text: ns.USER.name }), h('span', { class: 'muted', text: ns.USER.role })),
        drawerClose),
      h('div', { class: 'sb-top only-desktop' },
        h('div', { class: 'brand' }, h('span', { class: 'logo-mark', 'aria-hidden': 'true', text: 'N' }), h('span', { class: 'brand-name', text: 'Nexo Capital' })),
        refs.railToggle),
      h('div', { class: 'sb-unit only-desktop' }, unitButton()),
      refs.nav,
      h('div', { class: 'sb-foot' },
        h('div', { class: 'profile only-desktop' },
          h('span', { class: 'avatar', 'aria-hidden': 'true', text: ns.USER.initials }),
          h('div', { class: 'profile-text' }, h('strong', { text: ns.USER.name }), h('span', { class: 'muted', text: ns.USER.role })),
          profileBtn),
        settingsBtn,
        mobileLinks));

    refs.scrim = h('div', { class: 'scrim', 'aria-hidden': 'true' });
    refs.scrim.addEventListener('click', function () { closeSidebar(true); });

    refs.tabs = h('nav', { class: 'tabs', 'aria-label': 'Principal' }, ns.SECTIONS.map(function (s) {
      return h('a', { class: 'tab', href: '#/app/painel/' + s.id, 'data-section': s.id, text: s.label });
    }));

    refs.sectionsBtn = h('button', { class: 'sections-btn', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
      svg('menu'), h('span', { text: 'Seções' }), svg('chevronDown'));
    refs.sectionsBtn.addEventListener('click', function () {
      var cur = currentSection();
      ns.openMenu({
        trigger: refs.sectionsBtn, align: 'start', placement: 'down', label: 'Seções do painel',
        items: ns.SECTIONS.map(function (s) {
          return { label: s.label, current: s.id === cur, onSelect: function () { window.location.hash = '#/app/painel/' + s.id; } };
        })
      });
    });

    var search = h('label', { class: 'search' },
      h('span', { class: 'sr-only', text: 'Buscar no sistema' }),
      svg('search', 'search-ico'),
      h('input', { class: 'search-input', type: 'search', placeholder: 'Buscar', autocomplete: 'off' }));

    var bell = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Notificações' }, svg('bell'));
    bell.addEventListener('click', function () { ns.toast('Nenhuma notificação nova.'); });

    refs.header = h('header', { class: 'app-header only-desktop' },
      refs.tabs,
      refs.sectionsBtn,
      h('div', { class: 'header-actions' }, search, bell, avatarButton('avatar-btn')));

    var menuBtn = h('button', { class: 'icon-btn topbar-menu', type: 'button', 'aria-label': 'Abrir menu', 'aria-expanded': 'false', 'aria-controls': 'sidebar' }, svg('menu'));
    menuBtn.addEventListener('click', function () { openSidebar(menuBtn); });
    refs.menuBtn = menuBtn;
    refs.topbarTitle = h('span', { class: 'topbar-title' });
    refs.topbar = h('header', { class: 'topbar only-mobile' },
      menuBtn,
      h('span', { class: 'logo-mark logo-sm', 'aria-hidden': 'true', text: 'N' }),
      refs.topbarTitle,
      avatarButton('avatar-btn topbar-avatar'));

    refs.content = h('main', { class: 'content', id: 'conteudo-app', tabindex: '-1' });
    refs.main = h('div', { class: 'main' }, refs.topbar, refs.header, refs.content);

    refs.shell = h('div', { class: 'app' },
      h('a', { class: 'skip-link', href: '#conteudo-app' }, 'Pular para o conteúdo'),
      refs.sidebar,
      refs.scrim,
      refs.main);

    root.replaceChildren(refs.shell);

    // Sombra suave após 8 px de rolagem (cabeçalho e topbar).
    function scrolled(y) {
      refs.header.classList.toggle('is-scrolled', y > 8);
      refs.topbar.classList.toggle('is-scrolled', y > 8);
    }
    refs.content.addEventListener('scroll', function () { scrolled(refs.content.scrollTop); });
    window.addEventListener('scroll', function () { scrolled(window.scrollY); }, { passive: true });
  }

  function openSidebar(trigger) {
    if (side.open) return;
    side.open = true;
    side.trigger = trigger;
    refs.sidebar.classList.add('is-open');
    refs.scrim.classList.add('is-on');
    trigger.setAttribute('aria-expanded', 'true');
    if (refs.railToggle) {
      refs.railToggle.setAttribute('aria-expanded', 'true');
      refs.railToggle.setAttribute('aria-label', 'Recolher menu');
    }
    refs.main.setAttribute('inert', '');
    refs.main.setAttribute('aria-hidden', 'true');
    if (isMobile()) document.body.classList.add('no-scroll');
    side.release = ns.trapFocus(refs.sidebar);
    var first = isMobile() ? refs.sidebar.querySelector('.drawer-close') : refs.sidebar.querySelector('.nav-item[href], .nav-group-btn');
    if (first) first.focus();
  }

  function closeSidebar(restoreFocus) {
    if (!side.open) return;
    side.open = false;
    refs.sidebar.classList.remove('is-open');
    refs.scrim.classList.remove('is-on');
    document.body.classList.remove('no-scroll');
    refs.main.removeAttribute('inert');
    refs.main.removeAttribute('aria-hidden');
    if (side.release) { side.release(); side.release = null; }
    var t = side.trigger;
    side.trigger = null;
    if (t) t.setAttribute('aria-expanded', 'false');
    if (refs.railToggle) {
      refs.railToggle.setAttribute('aria-expanded', 'false');
      refs.railToggle.setAttribute('aria-label', 'Expandir menu');
    }
    if (restoreFocus && t && t.isConnected) t.focus();
  }

  function applyRoute(r) {
    var activeNav = r.kind === 'dashboard' ? 'painel' : r.id;
    refs.nav.querySelectorAll('.nav-item[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === activeNav;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var sec = r.kind === 'dashboard' ? r.section : null;
    refs.header.querySelectorAll('.tab').forEach(function (a) {
      var on = a.getAttribute('data-section') === sec;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    refs.nav.querySelectorAll('.sec-link').forEach(function (a) {
      var on = a.getAttribute('data-section') === sec;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    refs.sectionsBtn.classList.toggle('is-active', !!sec);

    var title = r.kind === 'dashboard' ? ns.DASHBOARDS[r.section].title : ns.PAGES[r.id].title;
    refs.topbarTitle.textContent = title;
    document.title = title + ' · Nexo Capital';

    var changed = refs.lastRoute !== window.location.hash;
    refs.lastRoute = window.location.hash;
    ns.views.render(refs.content, r);
    if (changed && !refs.first) refs.content.focus({ preventScroll: true });
    refs.first = false;
    if (side.open && !isMobile() && !railQ.matches) closeSidebar(false);
  }

  function route() {
    var hash = window.location.hash || '#/login';
    var root = document.getElementById('app');

    if (hash.indexOf('#/app') === 0) {
      if (!ns.isLoggedIn()) { window.location.hash = '#/login'; return; }
      var r = parseRoute(hash);
      if (!r) { window.location.hash = '#/app/painel/visao-geral'; return; }
      if (!refs.shell || !root.contains(refs.shell)) {
        refs.first = true;
        buildShell(root);
      }
      document.body.classList.remove('is-auth');
      document.body.classList.add('is-app');
      applyRoute(r);
      return;
    }

    if (side.open) closeSidebar(false);
    refs.shell = null;
    document.body.classList.remove('is-app');
    document.body.classList.add('is-auth');
    window.scrollTo(0, 0);
    if (hash === '#/recuperar') ns.renderRecover(root);
    else ns.renderLogin(root);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && side.open) { e.preventDefault(); closeSidebar(true); }
  });
  [mobileQ, railQ].forEach(function (q) {
    q.addEventListener('change', function () {
      if (side.open && !isMobile() && !railQ.matches) closeSidebar(false);
    });
  });

  window.addEventListener('hashchange', route);
  ns.route = route;
  ns.currentSection = currentSection;
  route();
})(window.NEXO = window.NEXO || {});
