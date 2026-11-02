/* Conecta — casca do app: header, navegação desktop, dock, drawer, stories */
(function (C) {
  'use strict';
  var $ = C.$, $$ = C.$$, esc = C.esc, icon = C.icon, avatar = C.avatar;

  /* Destinos. Os mesmos destinos existem no desktop e no celular:
     Feed = Início; Explorar/Salvos no desktop ficam no menu "Mais"; Grupos/Eventos/Mensagens no drawer. */
  var NAV_MAIN = [
    { key: 'feed', label: 'Feed', icon: 'home', href: '#/feed', prio: 4 },
    { key: 'grupos', label: 'Grupos', icon: 'users', href: '#/grupos', prio: 2 },
    { key: 'eventos', label: 'Eventos', icon: 'calendar', href: '#/eventos', prio: 1 },
    { key: 'mensagens', label: 'Mensagens', icon: 'message-circle', href: '#/mensagens', prio: 3, badge: true }
  ];
  var NAV_MORE = [
    { key: 'explorar', label: 'Explorar', icon: 'compass', href: '#/explorar' },
    { key: 'salvos', label: 'Salvos', icon: 'bookmark', href: '#/salvos' }
  ];
  var DOCK = [
    { key: 'feed', label: 'Início', icon: 'home', href: '#/feed' },
    { key: 'explorar', label: 'Explorar', icon: 'compass', href: '#/explorar' },
    { key: 'salvos', label: 'Salvos', icon: 'bookmark', href: '#/salvos' },
    { key: 'perfil', label: 'Perfil', icon: 'user', href: '#/perfil' }
  ];

  var header, drawerEl, moreMenu, popNotif, popProfile, initialized = false;
  var activeKey = '';

  function unread() { return C.state.conversations.reduce(function (n, c) { return n + c.unread; }, 0); }
  function unreadNotifs() { return C.state.notifications.filter(function (n) { return n.unread; }).length; }

  /* ---------------- construção ---------------- */
  function buildNav() {
    var list = $('#main-nav-list');
    var html = NAV_MAIN.map(function (it) {
      return '<li class="main-nav__item" data-key="' + it.key + '" data-prio="' + it.prio + '"><a class="main-nav__link" href="' + it.href + '">' + icon(it.icon) + '<span>' + it.label + '</span>' +
        (it.badge ? '<span class="badge" data-badge="messages" hidden></span>' : '') + '</a></li>';
    }).join('');
    html += '<li class="main-nav__item pop-wrap" id="nav-more">' +
      '<button type="button" class="main-nav__link" id="btn-more" aria-haspopup="menu" aria-expanded="false" aria-controls="pop-more"><span>Mais</span>' + icon('chevron-down', 'icon--sm') + '</button>' +
      '<ul class="popover popover--menu main-nav__more-menu" id="pop-more" role="menu" aria-label="Mais destinos" hidden>' +
      NAV_MORE.map(function (it) { return '<li role="none"><a class="menu-item" role="menuitem" href="' + it.href + '" data-key="' + it.key + '">' + icon(it.icon) + '<span>' + it.label + '</span></a></li>'; }).join('') +
      '</ul></li>';
    list.innerHTML = html;
    moreMenu = C.ui.popover({ trigger: $('#btn-more'), panel: $('#pop-more'), menu: true, hover: true, wrap: $('#nav-more') });
  }

  function buildDock() {
    $('#dock-list').innerHTML = DOCK.map(function (it) {
      return '<li style="flex:1 1 0;min-width:0;display:flex"><a class="dock__item" href="' + it.href + '" data-key="' + it.key + '">' + icon(it.icon, 'icon--lg') + '<span class="dock__label">' + it.label + '</span></a></li>';
    }).join('');
    $('#dock-list').style.listStyle = 'none';
  }

  function buildPanel() {
    var all = NAV_MAIN.concat(NAV_MORE);
    $('#menu-panel-list').innerHTML = all.map(function (it) {
      return '<li><a class="menu-item" href="' + it.href + '" data-key="' + it.key + '">' + icon(it.icon) + '<span>' + it.label + '</span>' +
        (it.badge ? '<span class="badge" data-badge="messages" hidden style="margin-left:auto"></span>' : '') + '</a></li>';
    }).join('');
  }

  function buildDrawer() {
    var u = C.state.user, me = C.state.people.me;
    var body = $('#drawer-body');
    body.innerHTML =
      '<a class="drawer__account" href="#/perfil" data-key="perfil-link" style="text-decoration:none;color:inherit">' + avatar(me, 44) +
      '<div><strong>' + esc(u.name) + '</strong><span>' + esc(u.email) + '</span></div></a>' +
      '<div class="drawer__section" role="group" aria-labelledby="dr-s1"><p class="drawer__section-title" id="dr-s1">Comunidade</p><ul>' +
      item('grupos', 'users', 'Grupos') + item('eventos', 'calendar', 'Eventos') + item('mensagens', 'message-circle', 'Mensagens', true) + item('notificacoes', 'bell', 'Notificações', 'notif') +
      '</ul></div>' +
      '<div class="drawer__section" role="group" aria-labelledby="dr-s2"><p class="drawer__section-title" id="dr-s2">Conta e preferências</p><ul>' +
      item('perfil', 'user', 'Meu perfil') + item('configuracoes', 'settings', 'Configurações') + item('ajuda', 'help', 'Ajuda') +
      '</ul></div>';
    function item(key, ic, label, badge) {
      return '<li><a class="drawer__item" href="#/' + key + '" data-key="' + key + '"><span class="icon-circle" aria-hidden="true">' + icon(ic) + '</span><span class="drawer-btn-label">' + label + '</span>' +
        (badge === true ? '<span class="badge" data-badge="messages" hidden></span>' : badge === 'notif' ? '<span class="badge" data-badge="notifs" hidden></span>' : '') + '</a></li>';
    }
  }

  function buildProfileMenu() {
    var u = C.state.user, me = C.state.people.me;
    $('#btn-avatar').innerHTML = avatar(me, 32);
    $('#pop-profile').innerHTML =
      '<li role="presentation" class="menu-user"><strong>' + esc(u.name) + '</strong><span>' + esc(u.email) + '</span></li>' +
      pItem('#/perfil', 'user', 'Meu perfil') + pItem('#/configuracoes', 'settings', 'Configurações') + pItem('#/ajuda', 'help', 'Ajuda') +
      '<li role="none"><button type="button" class="menu-item" role="menuitem" id="menu-logout">' + icon('log-out') + '<span>Sair</span></button></li>';
    function pItem(href, ic, label) { return '<li role="none"><a class="menu-item" role="menuitem" href="' + href + '">' + icon(ic) + '<span>' + label + '</span></a></li>'; }
    $('#pop-profile').style.listStyle = 'none';
    $('#pop-profile').style.margin = '0';
    $('#menu-logout').addEventListener('click', function () { C.app.logout(); });
  }

  /* ---------------- notificações ---------------- */
  function notifHTML(n) {
    return '<a class="notif ' + (n.unread ? '' : 'is-read') + '" href="' + n.href + '" data-notif="' + n.id + '">' +
      '<span class="icon-circle" aria-hidden="true">' + icon(n.icon) + '</span>' +
      '<span class="notif__body"><span class="notif__text">' + esc(n.text) + '</span><br><span class="notif__time">' + esc(n.time) + (n.unread ? ' · não lida' : '') + '</span></span>' +
      '<span class="notif__dot" aria-hidden="true"></span></a>';
  }
  function renderNotifs() {
    var list = $('#notif-list');
    var items = C.state.notifications.slice(0, 5);
    list.innerHTML = items.length ? items.map(notifHTML).join('') : '<p style="padding:24px 16px;color:var(--text-muted);text-align:center">Nenhuma notificação por enquanto.</p>';
    updateBadges();
  }
  function updateBadges() {
    var m = unread(), n = unreadNotifs();
    $$('[data-badge="messages"]').forEach(function (b) { b.textContent = m; b.hidden = m === 0; if (m) b.setAttribute('aria-label', m + (m === 1 ? ' mensagem não lida' : ' mensagens não lidas')); });
    $$('[data-badge="notifs"]').forEach(function (b) { b.textContent = n; b.hidden = n === 0; });
    var bb = $('#bell-badge');
    bb.textContent = n; bb.hidden = n === 0;
    $('#btn-bell').setAttribute('aria-label', n ? 'Notificações, ' + n + (n === 1 ? ' não lida' : ' não lidas') : 'Notificações');
  }

  /* ---------------- stories ---------------- */
  function renderStories() {
    var list = $('#stories');
    list.innerHTML = C.data.stories.map(function (s, i) {
      var p = C.state.people[s.person];
      var own = s.person === 'me';
      var seen = C.state.seenStories.has(s.person);
      return '<li><button type="button" class="story ' + (own ? 'is-own ' : '') + (seen ? 'is-seen' : '') + '" data-story="' + s.person + '" aria-label="' + (own ? 'Seu story' : 'Story de ' + esc(p.name)) + (seen ? ', visto' : ', novo') + '">' +
        '<span class="story__ring">' + avatar(p, 50) + (own ? '<span class="story__plus" aria-hidden="true">' + icon('plus') + '</span>' : '') + '</span>' +
        '<span class="story__name">' + (own ? 'Seu story' : esc(p.name.split(' ')[0])) + '</span></button></li>';
    }).join('');
  }

  var viewer = null;
  function openStory(personId, trigger) {
    var data = C.data.stories.filter(function (s) { return s.person === personId; })[0];
    if (!data) return;
    var p = C.state.people[personId];
    var idx = 0, paused = false;
    var ctrl = C.ui.modal({
      title: 'Story de ' + p.name,
      className: 'dialog--story',
      trigger: trigger,
      body: '',
      initialFocus: '.story-close',
      onClose: function () { viewer = null; C.state.seenStories.add(personId); renderStories(); }
    });
    var body = ctrl.root.querySelector('.dialog__body');
    body.style.padding = '0'; body.style.flex = '1'; body.style.display = 'flex'; body.style.overflow = 'hidden';
    ctrl.root.querySelector('.dialog__panel').setAttribute('aria-label', 'Story de ' + p.name);
    ctrl.root.querySelector('.dialog__panel').removeAttribute('aria-labelledby');
    ctrl.root.querySelector('.dialog__header').insertAdjacentHTML('afterend', '');

    function render() {
      var s = data.slides[idx];
      body.innerHTML =
        '<div class="story-view ' + (paused ? 'is-paused' : '') + '">' +
        '<div class="story-view__art">' + C.art(s.scene, s.scheme, 'Ilustração do story: ' + s.caption) + '</div>' +
        '<button type="button" class="story-view__nav story-view__nav--prev" aria-label="Story anterior"></button>' +
        '<button type="button" class="story-view__nav story-view__nav--next" aria-label="Próximo story"></button>' +
        '<div class="story-view__top"><div class="story-bars" aria-hidden="true">' + data.slides.map(function (_, i) { return '<span class="' + (i < idx ? 'is-done' : i === idx ? 'is-current' : '') + '"></span>'; }).join('') + '</div>' +
        '<div class="story-view__who">' + avatar(p, 36) + '<div><strong>' + esc(personId === 'me' ? 'Seu story' : p.name) + '</strong><small>há ' + (idx + 2) + ' h · ' + (idx + 1) + ' de ' + data.slides.length + '</small></div>' +
        '<button type="button" class="icon-btn story-pause" aria-label="' + (paused ? 'Retomar' : 'Pausar') + ' story" aria-pressed="' + paused + '">' + icon(paused ? 'play' : 'pause') + '</button>' +
        '<button type="button" class="icon-btn story-close" aria-label="Fechar story">' + icon('x') + '</button></div></div>' +
        '<p class="story-view__caption" aria-live="polite">' + esc(s.caption) + '</p></div>';
      var bar = body.querySelector('.story-bars .is-current');
      if (bar) bar.addEventListener('animationend', next);
      body.querySelector('.story-view__nav--prev').addEventListener('click', prev);
      body.querySelector('.story-view__nav--next').addEventListener('click', next);
      body.querySelector('.story-close').addEventListener('click', function () { ctrl.close(); });
      body.querySelector('.story-pause').addEventListener('click', function () {
        paused = !paused;
        var v = body.querySelector('.story-view'); v.classList.toggle('is-paused', paused);
        var b = body.querySelector('.story-pause'); b.setAttribute('aria-pressed', paused); b.setAttribute('aria-label', (paused ? 'Retomar' : 'Pausar') + ' story'); b.innerHTML = icon(paused ? 'play' : 'pause');
      });
    }
    function next() { if (idx < data.slides.length - 1) { idx++; render(); body.querySelector('.story-view__nav--next').focus({ preventScroll: true }); } else ctrl.close(); }
    function prev() { if (idx > 0) { idx--; render(); body.querySelector('.story-view__nav--prev').focus({ preventScroll: true }); } else render(); }
    ctrl.root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft') prev();
    });
    render();
    body.querySelector('.story-close').focus({ preventScroll: true });
    viewer = ctrl;
  }

  /* ---------------- drawer ---------------- */
  function openDrawer() {
    var btn = $('#btn-drawer');
    btn.setAttribute('aria-expanded', 'true');
    C.ui.open(drawerEl, {
      trigger: btn,
      initialFocus: '#drawer-close',
      onClose: function () { btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------------- painel do botão Menu (768–1023) ---------------- */
  var panelOpen = false;
  function setPanel(on, returnFocus) {
    var wrap = $('#menu-panel-wrap'), btn = $('#btn-panel');
    if (on === panelOpen) return;
    panelOpen = on;
    wrap.hidden = !on;
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.innerHTML = icon(on ? 'x' : 'menu') + '<span>' + (on ? 'Fechar' : 'Menu') + '</span>';
    if (on) C.ui.lock(); else C.ui.unlock();
    if (!on && returnFocus) btn.focus({ preventScroll: true });
  }

  /* ---------------- nav com "Mais": links excedentes migram para o menu ---------------- */
  function fitNav() {
    var nav = $('#main-nav');
    if (!nav || getComputedStyle(nav).display === 'none') return;
    var items = $$('#main-nav-list > li[data-key]');
    var more = $('#pop-more');
    // restaura
    items.forEach(function (li) { li.hidden = false; });
    $$('[data-overflow]', more).forEach(function (el) { el.remove(); });
    var order = items.slice().sort(function (a, b) { return a.dataset.prio - b.dataset.prio; });
    var list = $('#main-nav-list');
    var guard = 0;
    while (list.scrollWidth > nav.clientWidth + 1 && order.length > 1 && guard++ < 6) {
      var li = order.shift();
      li.hidden = true;
      var a = li.querySelector('a');
      more.insertAdjacentHTML('afterbegin', '<li role="none" data-overflow><a class="menu-item" role="menuitem" href="' + a.getAttribute('href') + '" data-key="' + li.dataset.key + '">' + a.innerHTML + '</a></li>');
    }
    setActive(activeKey);
  }

  /* ---------------- estado ativo ---------------- */
  function setActive(key) {
    activeKey = key;
    function mark(el, on) { if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); }
    $$('#main-nav-list > li[data-key] > a').forEach(function (a) { mark(a, a.parentElement.dataset.key === key); });
    var moreKeys = NAV_MORE.map(function (i) { return i.key; });
    var moreActive = false;
    $$('#pop-more [data-key]').forEach(function (a) {
      var on = a.dataset.key === key;
      mark(a, on);
      if (on) moreActive = true;
    });
    $('#btn-more').classList.toggle('is-active', moreActive);
    $$('#dock-list a').forEach(function (a) { mark(a, a.dataset.key === key); });
    $$('#menu-panel-list a').forEach(function (a) { mark(a, a.dataset.key === key); });
    $$('#drawer-body .drawer__item').forEach(function (a) { mark(a, a.dataset.key === key); });
  }

  /* ---------------- rolagem: sombra e esconder/mostrar header ---------------- */
  var lastY = 0, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (C.mqMobile.matches && !C.mqLandscapeShort.matches) {
      var dy = y - lastY;
      if (y > 80 && dy > 6 && !header.contains(document.activeElement)) header.classList.add('is-hidden');
      else if (dy < -6 || y <= 80) header.classList.remove('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    lastY = y;
  }

  /* ---------------- init ---------------- */
  function init() {
    if (initialized) { refreshUser(); return; }
    initialized = true;
    header = $('#site-header');
    drawerEl = $('#drawer');
    buildNav(); buildDock(); buildPanel();
    refreshUser();
    renderStories(); renderNotifs();

    popNotif = C.ui.popover({ trigger: $('#btn-bell'), panel: $('#pop-notif'), onOpen: function () { renderNotifs(); } });
    popProfile = C.ui.popover({ trigger: $('#btn-avatar'), panel: $('#pop-profile'), menu: true });

    $('#notif-list').addEventListener('click', function (e) {
      var a = e.target.closest('[data-notif]');
      if (!a) return;
      var n = C.state.notifications.filter(function (x) { return x.id === a.dataset.notif; })[0];
      if (n) n.unread = false;
      popNotif.close();
      updateBadges();
    });
    $('#btn-read-all').addEventListener('click', function () {
      C.state.notifications.forEach(function (n) { n.unread = false; });
      renderNotifs();
      C.ui.toast('Todas as notificações foram marcadas como lidas.');
    });
    $('#link-all-notifs').addEventListener('click', function () { popNotif.close(); });

    $('#btn-drawer').addEventListener('click', openDrawer);
    $('#drawer-logout').addEventListener('click', function () { C.ui.close(drawerEl); C.app.logout(); });
    drawerEl.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#/"]')) C.ui.close(drawerEl);
    });

    $('#btn-panel').addEventListener('click', function () { setPanel(!panelOpen); });
    $('#menu-panel-wrap').addEventListener('click', function (e) {
      if (e.target.closest('[data-dismiss-panel]') || e.target.closest('a[href^="#/"]')) setPanel(false, !e.target.closest('a'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panelOpen && !C.ui.isDialogOpen()) { e.preventDefault(); setPanel(false, true); }
    });
    window.addEventListener('resize', function () { if (panelOpen && window.innerWidth >= 1024 || panelOpen && window.innerWidth < 768) setPanel(false); });

    // dock e nav fecham popovers ao navegar
    $('#main-nav').addEventListener('click', function (e) { if (e.target.closest('a')) C.ui.closePopovers(); });

    // busca
    var q = $('#q');
    $('#header-search').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = q.value.trim();
      location.hash = '#/explorar' + (v ? '?q=' + encodeURIComponent(v) : '');
    });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; q.blur(); } });
    $('#btn-search-m').addEventListener('click', function () {
      location.hash = '#/explorar?focus=1';
    });

    // stories
    $('#stories').addEventListener('click', function (e) {
      var b = e.target.closest('[data-story]');
      if (b) openStory(b.dataset.story, b);
    });

    // rolagem
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    C.mqMobile.addEventListener('change', onScroll);

    // redimensionamento: reavalia o que cabe no menu principal
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitNav, 80); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    fitNav();
    document.body.classList.add('has-dock');
  }

  function refreshUser() {
    buildDrawer();
    buildProfileMenu();
    updateBadges();
  }

  C.shell = {
    init: init, setActive: setActive, fitNav: fitNav, renderStories: renderStories, updateBadges: updateBadges, renderNotifs: renderNotifs,
    openStory: openStory, closeAll: function () { C.ui.closePopovers(); setPanel(false); }, refreshUser: refreshUser, resetScroll: function () { lastY = 0; if (header) header.classList.remove('is-hidden'); }
  };
})(window.Conecta);
