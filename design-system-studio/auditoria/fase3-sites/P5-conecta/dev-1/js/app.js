/* Conecta — aplicação (roteador por hash, header, drawer, dock, páginas e interações).
   Tudo com dados fictícios em memória + localStorage (demonstração sem backend). */
(function () {
  'use strict';

  const { $, $all, esc, Store, Layers, Popovers, toast, openModal, setFieldError, renderSummary } = UI;
  const D = window.DATA;

  const mqMobile = matchMedia('(max-width: 767.98px)');
  const mqDesktop = matchMedia('(min-width: 1024px)');
  const mqLandscape = matchMedia('(max-width: 767.98px) and (orientation: landscape) and (max-height: 500px)');
  const nf = new Intl.NumberFormat('pt-BR');
  const nfCompact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

  /* ======================================================================
     Estado
     ====================================================================== */
  const STATE_KEY = 'conecta-state-v1';
  const SESSION_KEY = 'conecta-session';

  function defaultState() {
    return {
      user: Object.assign({}, D.ME),
      saved: ['p2', 'p5'],
      liked: ['p3'],
      myPosts: [],
      comments: {},
      following: { u2: true, u3: true },
      groups: ['g1'],
      events: [],
      readNotifs: [],
      convRead: [],
      extraMessages: {},
      seenStories: [],
      settings: { emailNotif: true, pushNotif: true, privateProfile: false, simulateError: false }
    };
  }
  let state = Object.assign(defaultState(), Store.get(STATE_KEY) || {});
  function save() { Store.set(STATE_KEY, state); }

  let memorySession = false;
  function isLogged() {
    const s = Store.session();
    if (s) return !!Store.get(SESSION_KEY, s);
    return memorySession;
  }
  function setLogged(v) {
    memorySession = v;
    const s = Store.session();
    if (!s) return;
    if (v) Store.set(SESSION_KEY, true, s); else Store.remove(SESSION_KEY, s);
  }

  // ---- consultas ----
  function me() {
    return Object.assign({}, D.ME, state.user, { id: 'u1', tone: 'a' });
  }
  function user(id) {
    if (id === 'u1' || id === 'me') return me();
    return D.USERS.find((u) => u.id === id) || { id, name: 'Perfil removido', role: '', tone: 'a', stats: { posts: 0, followers: 0, following: 0 } };
  }
  function initials(name) {
    const parts = String(name || '?').trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  function firstName(name) { return String(name || '').split(/\s+/)[0]; }
  function allPosts() { return state.myPosts.concat(D.POSTS); }
  function postById(id) { return allPosts().find((p) => p.id === id); }
  function topic(id) { return D.TOPICS.find((t) => t.id === id) || D.TOPICS[0]; }
  function commentsFor(id) { return (D.COMMENTS[id] || []).concat(state.comments[id] || []); }
  function notifUnread() { return D.NOTIFICATIONS.filter((n) => n.unread && state.readNotifs.indexOf(n.id) === -1).length; }
  function convUnread(c) { return state.convRead.indexOf(c.id) === -1 ? c.unread : 0; }
  function msgUnread() { return D.CONVERSATIONS.reduce((s, c) => s + convUnread(c), 0); }
  function toggleIn(list, id) {
    const i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    return i === -1;
  }

  /* ======================================================================
     Componentes de marcação
     ====================================================================== */
  function avatar(u, size, extra) {
    return `<span class="avatar avatar-${size} tone-${u.tone || 'a'}${extra ? ' ' + extra : ''}" aria-hidden="true">${esc(initials(u.name))}</span>`;
  }

  function badgeHTML(n, label) {
    if (!n) return '';
    return `<span class="badge" aria-hidden="true">${n}</span><span class="sr-only">, ${n} ${label}</span>`;
  }

  /* Card de conteúdo do feed — Modern Material: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé */
  function postCard(p, opts) {
    opts = opts || {};
    const a = user(p.author);
    const h = opts.level || 2;
    const saved = state.saved.indexOf(p.id) !== -1;
    return `<article class="post-card" aria-labelledby="t-${p.id}">
      <div class="post-media tone-${p.tone}" aria-hidden="true"><span class="media-circle">${icon(p.icon, 28)}</span></div>
      ${saved ? `<span class="saved-flag">${icon('bookmark')}Salvo</span>` : ''}
      <div class="post-body">
        <span class="tag">${esc(p.tag)}</span>
        <h${h} class="post-title" id="t-${p.id}">${esc(p.title)}</h${h}>
        <p class="post-text">${esc(p.text)}</p>
        <div class="post-footer">
          <p class="post-meta">${avatar(a, 24)}<span><span class="post-author">${esc(a.name)}</span> · <time>${esc(p.time)}</time></span></p>
          <a class="btn-pill btn-primary post-action" href="#/post/${p.id}">Ver publicação<span class="sr-only">: ${esc(p.title)}</span></a>
        </div>
      </div>
    </article>`;
  }

  function skeletonCards(n) {
    let html = '';
    for (let i = 0; i < n; i++) {
      html += `<div class="skeleton-card" aria-hidden="true"><div class="skeleton-media"></div><div class="skeleton-body">
        <div class="skeleton skeleton-line w-30"></div><div class="skeleton skeleton-line lg w-70"></div>
        <div class="skeleton skeleton-line w-90"></div><div class="skeleton skeleton-line w-70"></div></div></div>`;
    }
    return html + '<span class="sr-only">Carregando…</span>';
  }
  function skeletonItems(n) {
    let html = '';
    for (let i = 0; i < n; i++) {
      html += `<div class="item-card" aria-hidden="true"><div class="skeleton" style="width:48px;height:48px;border-radius:8px"></div>
        <div class="item-main"><div class="skeleton skeleton-line lg w-70"></div><div class="skeleton skeleton-line w-30"></div><div class="skeleton skeleton-line w-90"></div></div></div>`;
    }
    return html + '<span class="sr-only">Carregando…</span>';
  }

  function emptyState(o) {
    return `<div class="state">
      <span class="state-ic">${icon(o.icon || 'inbox', 28)}</span>
      <h2>${esc(o.title)}</h2>
      ${o.text ? `<p>${esc(o.text)}</p>` : ''}
      ${o.action || ''}
    </div>`;
  }
  function errorState(key) {
    return `<div class="state state-error" role="alert">
      <span class="state-ic">${icon('wifi-off', 28)}</span>
      <h2>Não foi possível carregar</h2>
      <p>Verifique sua conexão e tente de novo. (Falha simulada — desative em Configurações › Demonstração.)</p>
      <button type="button" class="btn btn-primary" data-action="retry" data-key="${key}">${icon('refresh', 18)}Tentar novamente</button>
    </div>`;
  }

  /* ======================================================================
     Carregamento de listas (carregando → conteúdo | vazio | erro)
     ====================================================================== */
  let renderToken = 0;
  let loaded = {};
  let failedOnce = {};
  function later(ms, fn) {
    const t = renderToken;
    setTimeout(() => { if (t === renderToken) fn(); }, ms);
  }
  function loadList(key, el, render, skeleton, delay) {
    const fail = state.settings.simulateError && !failedOnce[key];
    if (loaded[key] && !fail) { el.innerHTML = render(); return; }
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = skeleton;
    later(delay || 650, () => {
      el.removeAttribute('aria-busy');
      if (fail) { failedOnce[key] = true; el.innerHTML = errorState(key); return; }
      loaded[key] = true;
      el.innerHTML = render();
    });
  }

  /* ======================================================================
     Navegação (header, painel do menu, drawer, dock)
     ====================================================================== */
  const NAV = [
    { key: 'feed', label: 'Feed', href: '#/feed', icon: 'house' },
    { key: 'grupos', label: 'Grupos', href: '#/grupos', icon: 'users' },
    { key: 'eventos', label: 'Eventos', href: '#/eventos', icon: 'calendar' },
    { key: 'mensagens', label: 'Mensagens', href: '#/mensagens', icon: 'message-circle' }
  ];
  let activeKey = 'feed';

  function buildHeaderNav() {
    const list = $('#main-nav-list');
    list.innerHTML = NAV.map((n) => `<li class="nav-item" data-key="${n.key}">
        <a class="nav-link" href="${n.href}" data-key="${n.key}">${icon(n.icon, 18)}<span>${n.label}</span><span class="nav-badge" data-badge="${n.key}"></span></a>
      </li>`).join('') +
      `<li class="nav-more" id="nav-more" hidden>
        <button type="button" class="nav-link nav-more-btn" id="nav-more-btn" aria-controls="nav-more-menu">${icon('ellipsis', 18)}<span>Mais</span>${icon('chevron-down', 16)}</button>
        <div class="popover popover-more" id="nav-more-menu" hidden>
          <ul class="menu-list">${NAV.map((n) => `<li data-key="${n.key}" hidden><a href="${n.href}" data-key="${n.key}">${icon(n.icon)}${n.label}<span class="nav-badge" data-badge="${n.key}"></span></a></li>`).join('')}</ul>
        </div>
      </li>`;
    Popovers.register($('#nav-more-btn'), $('#nav-more-menu'), { hover: true, hoverRoot: $('#nav-more') });

    $('#menu-panel-list').innerHTML = NAV.map((n) =>
      `<li><a href="${n.href}" data-key="${n.key}">${icon(n.icon)}<span>${n.label}</span><span class="nav-badge" data-badge="${n.key}"></span></a></li>`).join('');
  }

  function buildDrawer() {
    const u = me();
    const items = NAV.concat([{ key: 'notificacoes', label: 'Notificações', href: '#/notificacoes', icon: 'bell' }]);
    const secondary = [
      { key: 'configuracoes', label: 'Configurações', href: '#/configuracoes', icon: 'settings' },
      { key: 'ajuda', label: 'Ajuda', href: '#/ajuda', icon: 'help' }
    ];
    const link = (n) => `<li><a class="drawer-link" href="${n.href}" data-key="${n.key}"${n.key === activeKey ? ' aria-current="page"' : ''}>
      <span class="icon-circle">${icon(n.icon)}</span><span>${n.label}</span>${n.key === 'mensagens' ? badgeHTML(msgUnread(), 'não lidas') : ''}${n.key === 'notificacoes' ? badgeHTML(notifUnread(), 'não lidas') : ''}</a></li>`;
    $('#drawer-body').innerHTML = `
      <a class="drawer-user" href="#/perfil">${avatar(u, 48)}<span><strong>${esc(u.name)}</strong><small>${esc(u.email)}</small></span></a>
      <nav aria-label="Menu lateral">
        <p class="drawer-section-title" id="dsec-nav">Navegar</p>
        <ul class="drawer-list" aria-labelledby="dsec-nav">${items.map(link).join('')}</ul>
        <p class="drawer-section-title" id="dsec-conta">Conta e ajuda</p>
        <ul class="drawer-list" aria-labelledby="dsec-conta">${secondary.map(link).join('')}</ul>
      </nav>`;
  }

  function updateUserUI() {
    const u = me();
    const av = $('#header-avatar');
    av.textContent = initials(u.name);
    av.className = 'avatar avatar-32 tone-a';
    $('#pm-name').textContent = u.name;
    $('#pm-email').textContent = u.email;
    $('#profile-trigger').setAttribute('aria-label', 'Menu do perfil: ' + u.name);
  }

  function updateBadges() {
    const m = msgUnread();
    $all('[data-badge="mensagens"]').forEach((el) => { el.innerHTML = badgeHTML(m, 'não lidas'); });
    const n = notifUnread();
    const nb = $('#notif-badge');
    nb.textContent = n;
    nb.hidden = !n;
    $('#notif-trigger').setAttribute('aria-label', n ? `Notificações, ${n} não lidas` : 'Notificações');
  }

  function updateNav(key) {
    activeKey = key;
    $all('#main-nav-list a[data-key], #menu-panel-list a[data-key], #dock a[data-key], #profile-menu a[data-key]').forEach((a) => {
      if (a.getAttribute('data-key') === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    updateBadges();
    buildDrawer();
    fitNav();
  }

  /* "Mais": links excedentes (1024–1279 px ou fonte ampliada) vão para um menu suspenso */
  function fitNav() {
    const items = $all('#main-nav-list > .nav-item');
    const more = $('#nav-more');
    const moreItems = $all('#nav-more-menu li');
    if (!more) return;
    items.forEach((li) => { li.hidden = false; });
    moreItems.forEach((li) => { li.hidden = true; });
    more.hidden = true;
    $('#nav-more-btn').classList.remove('is-active');
    if (!mqDesktop.matches) return;
    const inner = $('#header-inner');
    const end = inner.querySelector('.header-end');
    const nav = $('#main-nav');
    const brand = inner.querySelector('.brand');
    const overflowing = () => {
      const n = nav.getBoundingClientRect();
      return inner.scrollWidth > inner.clientWidth + 1 ||
        n.right > end.getBoundingClientRect().left - 8 ||
        n.left < Math.max.apply(null, $all('.brand-mark, .brand-name', brand).map((x) => x.getBoundingClientRect().right)) + 8;
    };
    for (let i = items.length - 1; i > 0 && overflowing(); i--) {
      items[i].hidden = true;
      moreItems[i].hidden = false;
      more.hidden = false;
      if (items[i].getAttribute('data-key') === activeKey) $('#nav-more-btn').classList.add('is-active');
    }
  }

  // ---- Drawer lateral (celular) ----
  const drawer = $('#drawer');
  const drawerTrigger = $('#drawer-trigger');
  function openDrawer() {
    if (!drawer.hidden) return;
    Popovers.closeAll();
    drawer.hidden = false;
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    drawerTrigger.setAttribute('aria-expanded', 'true');
    Layers.open(drawer, { trigger: drawerTrigger, initialFocus: $('#drawer-close') });
  }
  function closeDrawer(returnFocus) {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    drawerTrigger.setAttribute('aria-expanded', 'false');
    Layers.close(drawer, { returnFocus: returnFocus !== false });
    setTimeout(() => { if (!drawer.classList.contains('is-open')) drawer.hidden = true; }, UI.reducedMotion() ? 0 : 260);
  }
  drawer.__requestClose = () => closeDrawer(true);
  drawerTrigger.addEventListener('click', openDrawer);
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-drawer-close]')) closeDrawer(true);
    else if (e.target.closest('a[href]')) closeDrawer(false);
  });

  // ---- Painel do menu (768–1023 px) ----
  const panel = $('#menu-panel');
  const panelTrigger = $('#panel-trigger');
  function openPanel() {
    Popovers.closeAll();
    panel.hidden = false;
    void panel.offsetWidth;
    panel.classList.add('is-open');
    panelTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-locked');
    const first = panel.querySelector('a[aria-current="page"]') || panel.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }
  function closePanel(focusTrigger) {
    if (panel.hidden) return;
    panel.classList.remove('is-open');
    panelTrigger.setAttribute('aria-expanded', 'false');
    if (!Layers.top()) document.body.classList.remove('scroll-locked');
    setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, UI.reducedMotion() ? 0 : 260);
    if (focusTrigger) panelTrigger.focus();
  }
  panelTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.hidden) openPanel(); else closePanel(true);
  });
  $('#panel-close').addEventListener('click', () => closePanel(true));
  panel.addEventListener('click', (e) => { if (e.target.closest('a[href]')) closePanel(false); });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !panelTrigger.contains(e.target)) closePanel(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden && !Layers.top()) { e.preventDefault(); closePanel(true); }
  });

  // ---- Popovers do header ----
  function renderNotifPopover() {
    const list = D.NOTIFICATIONS.slice(0, 5);
    $('#notif-pop-list').innerHTML = list.map(notifItem).join('');
  }
  function notifItem(n) {
    const u = user(n.user);
    const unread = n.unread && state.readNotifs.indexOf(n.id) === -1;
    return `<li class="notif-item${unread ? ' is-unread' : ''}">
      <a class="notif-link" href="${n.href}" data-notif="${n.id}">${avatar(u, 40)}
        <span class="notif-text"><span><strong>${esc(u.name)}</strong> ${esc(n.text)}</span><time>${esc(n.time)}</time>${unread ? '<span class="sr-only">Não lida</span>' : ''}</span>
      </a>${unread ? '<span class="unread-dot" aria-hidden="true"></span>' : ''}
    </li>`;
  }

  // ---- Header: sombra após 8 px; no celular esconde ao rolar para baixo ----
  const header = $('#site-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (mqMobile.matches && !mqLandscape.matches && !Popovers.openOne() && !header.contains(document.activeElement)) {
      if (y > lastY + 6 && y > 72) header.classList.add('is-hidden');
      else if (y < lastY - 6 || y <= 8) header.classList.remove('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    lastY = y;
  }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // ---- Busca do header: Enter envia; Esc limpa e tira o foco ----
  const searchInput = $('#header-search-input');
  $('#header-search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    location.hash = '#/explorar' + (q ? '?q=' + encodeURIComponent(q) : '');
    searchInput.blur();
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); searchInput.value = ''; searchInput.blur(); }
  });

  /* ======================================================================
     Páginas
     ====================================================================== */
  function pageHead(title, sub, extra, titleHTML) {
    return `<div class="page-head"><div><h1 tabindex="-1">${titleHTML || esc(title)}</h1>${sub ? `<p class="page-sub">${esc(sub)}</p>` : ''}</div>${extra || ''}</div>`;
  }

  function storiesHTML() {
    return `<ul class="stories" aria-label="Stories de quem você segue">${D.STORIES.map((s, i) => {
      const u = user(s.author);
      const seen = state.seenStories.indexOf(s.id) !== -1;
      return `<li><button type="button" class="story${seen ? ' is-seen' : ''}" data-action="story" data-index="${i}" aria-label="Story de ${esc(u.name)}, ${seen ? 'visto' : 'não visto'}">
        <span class="story-ring">${avatar(u, 56)}</span><span class="story-name" aria-hidden="true">${esc(firstName(u.name))}</span></button></li>`;
    }).join('')}</ul>`;
  }

  // ---------- Feed / Início ----------
  function viewFeed() {
    return {
      title: 'Feed', key: 'feed',
      html: `<div class="container page page-feed">
        <section class="stories-section" aria-label="Stories">${storiesHTML()}</section>
        ${pageHead('Feed', 'Publicações de perfis e grupos que você segue.', '', '<span class="label-desktop">Feed</span><span class="label-mobile">Início</span>')}
        <div class="card-grid" id="feed-list"></div>
      </div>`,
      after() {
        loadList('feed', $('#feed-list'), () => {
          const posts = allPosts().filter((p) => p.author !== 'u1' || p.isNew);
          return posts.length ? posts.map((p) => postCard(p)).join('') : emptyState({ title: 'Nada por aqui ainda', text: 'Siga perfis e grupos para ver publicações no seu feed.', action: '<a class="btn btn-primary" href="#/explorar">Explorar</a>' });
        }, skeletonCards(6));
      }
    };
  }

  // ---------- Explorar ----------
  let explore = { q: '', topic: 'todos' };
  function viewExplorar(parts, params) {
    explore = { q: params.get('q') || '', topic: params.get('tema') || 'todos' };
    searchInput.value = explore.q;
    return {
      title: 'Explorar', key: 'explorar',
      focus: params.get('busca') ? '#explore-q' : null,
      html: `<div class="container page">
        ${pageHead('Explorar', 'Descubra publicações, pessoas e temas da comunidade.')}
        <form class="search-big" id="explore-form" role="search" novalidate>
          <div class="field" style="flex:1">
            <label for="explore-q">Buscar publicações e pessoas</label>
            <div class="input-wrap">${icon('search')}<input class="input" id="explore-q" type="search" value="${esc(explore.q)}" placeholder="Ex.: café, viagem, Bruno" autocomplete="off" enterkeyhint="search"></div>
          </div>
          <button type="submit" class="btn btn-primary" style="align-self:flex-end;min-height:44px">Buscar</button>
        </form>
        <div class="chips" role="group" aria-label="Filtrar por tema">
          ${[{ id: 'todos', label: 'Todos' }].concat(D.TOPICS).map((t) => `<button type="button" class="chip" data-action="explore-topic" data-topic="${t.id}" aria-pressed="${explore.topic === t.id}">${esc(t.label)}</button>`).join('')}
        </div>
        <div id="explore-results" aria-live="polite"></div>
      </div>`,
      after() { renderExplore(true); }
    };
  }
  function renderExplore(initial) {
    const box = $('#explore-results');
    if (!box) return;
    const q = explore.q.trim().toLowerCase();
    const matchPosts = allPosts().filter((p) => {
      const a = user(p.author);
      const inTopic = explore.topic === 'todos' || p.topic === explore.topic;
      const inQuery = !q || (p.title + ' ' + p.text + ' ' + p.tag + ' ' + a.name).toLowerCase().indexOf(q) !== -1;
      return inTopic && inQuery;
    });
    const people = q ? D.USERS.filter((u) => (u.name + ' ' + u.role).toLowerCase().indexOf(q) !== -1) : D.USERS.filter((u) => !state.following[u.id]).slice(0, 4);
    const render = () => {
      let html = '';
      if (people.length) {
        html += `<section class="section" aria-labelledby="people-title"><h2 class="section-title" id="people-title">${q ? 'Pessoas' : 'Sugestões para seguir'}</h2>
          <div class="people-row">${people.map(personRow).join('')}</div></section>`;
      }
      html += `<section class="section" aria-labelledby="explore-posts-title"><h2 class="section-title" id="explore-posts-title">${q ? `Publicações para “${esc(explore.q)}”` : 'Em alta'}</h2>
        <div class="card-grid">${matchPosts.length ? matchPosts.map((p) => postCard(p, { level: 3 })).join('') :
          emptyState({ icon: 'search', title: 'Nenhum resultado', text: q ? `Não encontramos publicações para “${explore.q}”. Tente outra palavra ou outro tema.` : 'Nenhuma publicação neste tema por enquanto.', action: '<button type="button" class="btn btn-secondary" data-action="explore-clear">Limpar busca</button>' })}</div></section>`;
      return html;
    };
    if (initial) {
      loadList('explorar', box, render, `<div class="section"><div class="card-grid">${skeletonCards(3)}</div></div>`, 500);
    } else {
      box.setAttribute('aria-busy', 'true');
      box.innerHTML = `<div class="section"><div class="card-grid">${skeletonCards(3)}</div></div>`;
      later(350, () => { box.removeAttribute('aria-busy'); box.innerHTML = render(); });
    }
  }
  function syncExploreUrl() {
    const qs = new URLSearchParams();
    if (explore.q) qs.set('q', explore.q);
    if (explore.topic !== 'todos') qs.set('tema', explore.topic);
    const s = qs.toString();
    try { history.replaceState(null, '', '#/explorar' + (s ? '?' + s : '')); } catch (e) { /* ignore */ }
  }
  function personRow(u) {
    const f = !!state.following[u.id];
    return `<div class="person">${avatar(u, 40)}<div class="person-info"><a href="#/perfil/${u.id}">${esc(u.name)}</a><span>${esc(u.role)}</span></div>
      <button type="button" class="btn-pill ${f ? 'btn-tonal' : 'btn-primary'}" data-action="follow" data-user="${u.id}" aria-pressed="${f}">${f ? 'Seguindo' : 'Seguir'}<span class="sr-only"> ${esc(u.name)}</span></button></div>`;
  }

  // ---------- Salvos ----------
  function viewSalvos() {
    return {
      title: 'Salvos', key: 'salvos',
      html: `<div class="container page">${pageHead('Salvos', 'Publicações que você guardou para ver depois.')}<div class="card-grid" id="saved-list"></div></div>`,
      after() {
        loadList('salvos', $('#saved-list'), () => {
          const posts = allPosts().filter((p) => state.saved.indexOf(p.id) !== -1);
          return posts.length ? posts.map((p) => postCard(p)).join('') : emptyState({
            icon: 'bookmark', title: 'Nada salvo ainda',
            text: 'Abra uma publicação e toque em “Salvar” para guardá-la aqui.',
            action: '<a class="btn btn-primary" href="#/feed">Ir para o Início</a>'
          });
        }, skeletonCards(3));
      }
    };
  }

  // ---------- Perfil ----------
  let profileTab = 'publicacoes';
  function viewPerfil(parts) {
    const id = parts[0] || 'u1';
    const own = id === 'u1';
    const u = user(id);
    const following = !!state.following[id];
    const conv = D.CONVERSATIONS.find((c) => c.with === id);
    const stats = own ? (state.user.stats || D.ME.stats) : u.stats;
    const postsCount = own ? stats.posts + state.myPosts.length : stats.posts;
    const followers = stats.followers;
    profileTab = 'publicacoes';
    const tabs = [['publicacoes', 'Publicações'], ['midia', 'Mídia'], ['sobre', 'Sobre']];
    return {
      title: own ? 'Meu perfil' : u.name, key: own ? 'perfil' : '',
      html: `<div class="container page">
        <section class="profile tone-${u.tone}" aria-labelledby="profile-name">
          <div class="profile-cover" aria-hidden="true"></div>
          <div class="profile-head">
            <span class="avatar profile-avatar" aria-hidden="true">${esc(initials(u.name))}</span>
            <div class="profile-id"><h1 id="profile-name" tabindex="-1">${esc(u.name)}</h1><p class="profile-role">${esc(u.role || 'Membro do Conecta')}</p></div>
            <div class="profile-actions">
              ${own
                ? `<button type="button" class="btn-pill btn-primary" data-action="edit-profile">${icon('pencil', 18)}Editar perfil</button>
                   <button type="button" class="btn-pill btn-tonal" data-action="share">${icon('share', 18)}Compartilhar</button>`
                : `<button type="button" class="btn-pill ${following ? 'btn-tonal' : 'btn-primary'}" data-action="follow" data-user="${u.id}" aria-pressed="${following}">${following ? 'Seguindo' : 'Seguir'}</button>
                   <a class="btn-pill btn-tonal" href="#/mensagens${conv ? '/' + conv.id : ''}">${icon('message-circle', 18)}Mensagem</a>`}
            </div>
          </div>
          ${u.bio ? `<p class="profile-bio">${esc(u.bio)}</p>` : ''}
          <dl class="profile-stats">
            <div><dt>Publicações</dt><dd>${nf.format(postsCount)}</dd></div>
            <div><dt>Seguidores</dt><dd>${nfCompact.format(followers + (!own && following ? 1 : 0))}</dd></div>
            <div><dt>Seguindo</dt><dd>${nfCompact.format(stats.following)}</dd></div>
          </dl>
          <div class="profile-tabs" role="tablist" aria-label="Conteúdo do perfil">
            ${tabs.map(([k, l]) => `<button type="button" class="tab-pill" role="tab" id="ptab-${k}" aria-controls="profile-panel" aria-selected="${k === profileTab}" tabindex="${k === profileTab ? 0 : -1}" data-action="profile-tab" data-tab="${k}">${l}</button>`).join('')}
          </div>
        </section>
        <div class="profile-panel" id="profile-panel" role="tabpanel" aria-labelledby="ptab-${profileTab}" tabindex="0" data-user="${u.id}"></div>
      </div>`,
      after() { renderProfilePanel(u.id); }
    };
  }
  function renderProfilePanel(id) {
    const box = $('#profile-panel');
    if (!box) return;
    const u = user(id);
    box.setAttribute('aria-labelledby', 'ptab-' + profileTab);
    const posts = allPosts().filter((p) => p.author === id);
    if (profileTab === 'publicacoes') {
      box.innerHTML = posts.length
        ? `<h2 class="sr-only">Publicações</h2><div class="card-grid">${posts.map((p) => postCard(p, { level: 3 })).join('')}</div>`
        : emptyState({ icon: 'image', title: 'Nenhuma publicação ainda', text: id === 'u1' ? 'Use “+ Novo” para compartilhar algo com a comunidade.' : `${firstName(u.name)} ainda não publicou nada.` });
    } else if (profileTab === 'midia') {
      const tiles = [];
      const source = posts.length ? posts : [{ icon: 'image', tone: u.tone, title: 'Mídia' }];
      for (let i = 0; i < 6; i++) { const p = source[i % source.length]; tiles.push(p); }
      box.innerHTML = `<h2 class="sr-only">Mídia</h2><ul class="media-grid">${tiles.map((p, i) =>
        `<li class="media-tile tone-${p.tone}" aria-label="Imagem ${i + 1}: ${esc(p.title)}">${icon(p.icon, 28)}</li>`).join('')}</ul>`;
    } else {
      box.innerHTML = `<h2 class="sr-only">Sobre</h2><ul class="about-list">
        <li><span class="icon-circle">${icon('briefcase')}</span><span>${esc(u.role || 'Membro do Conecta')}</span></li>
        <li><span class="icon-circle">${icon('map-pin')}</span><span>${esc(u.location || 'Brasil')}</span></li>
        ${u.site ? `<li><span class="icon-circle">${icon('link')}</span><span style="overflow-wrap:anywhere">${esc(u.site)}</span></li>` : ''}
        <li><span class="icon-circle">${icon('calendar')}</span><span>No Conecta desde março de 2023</span></li>
      </ul>`;
    }
  }

  function openEditProfile(trigger) {
    const u = me();
    openModal({
      title: 'Editar perfil', className: 'modal-mm', trigger, initialFocus: '#ep-name',
      body: `<form id="ep-form" class="modal-form" novalidate>
        <div class="error-summary" id="ep-summary" role="alert" tabindex="-1" hidden></div>
        <div class="field"><label for="ep-name">Nome</label><input class="input input-filled" id="ep-name" autocomplete="name" value="${esc(u.name)}"><p class="field-error" id="ep-name-error" hidden></p></div>
        <div class="field"><label for="ep-role">Cargo</label><input class="input input-filled" id="ep-role" autocomplete="organization-title" value="${esc(u.role)}"></div>
        <div class="field"><label for="ep-location">Localização</label><input class="input input-filled" id="ep-location" autocomplete="address-level2" value="${esc(u.location)}"></div>
        <div class="field"><label for="ep-bio">Bio</label><textarea class="input input-filled" id="ep-bio" rows="3" maxlength="200" data-describedby="ep-bio-hint" aria-describedby="ep-bio-hint">${esc(u.bio)}</textarea><p class="field-hint" id="ep-bio-hint">Até 200 caracteres.</p></div>
      </form>`,
      footer: `<button type="button" class="btn-pill btn-tonal" data-modal-close>Cancelar</button><button type="submit" form="ep-form" class="btn-pill btn-primary">Salvar</button>`,
      onMount(api) {
        const form = api.el.querySelector('#ep-form');
        const name = api.el.querySelector('#ep-name');
        name.addEventListener('blur', () => { if (name.value.trim() || name.getAttribute('aria-invalid')) setFieldError(name, name.value.trim() ? '' : 'Informe seu nome.'); });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const msg = name.value.trim() ? '' : 'Informe seu nome.';
          setFieldError(name, msg);
          renderSummary(api.el.querySelector('#ep-summary'), msg ? [{ id: 'ep-name', message: msg }] : [], 'Revise o campo abaixo:');
          if (msg) { api.el.querySelector('#ep-summary').focus(); return; }
          state.user.name = name.value.trim();
          state.user.role = api.el.querySelector('#ep-role').value.trim();
          state.user.location = api.el.querySelector('#ep-location').value.trim();
          state.user.bio = api.el.querySelector('#ep-bio').value.trim();
          save();
          api.close(false);
          updateUserUI();
          router();
          toast('Perfil atualizado.', 'check');
        });
      }
    });
  }

  // ---------- Grupos ----------
  let groupFilter = 'todos';
  function viewGrupos() {
    return {
      title: 'Grupos', key: 'grupos',
      html: `<div class="container page">${pageHead('Grupos', 'Comunidades por interesse para conversar e combinar encontros.')}
        <div class="chips" role="group" aria-label="Filtrar grupos" style="margin-bottom:24px">
          <button type="button" class="chip" data-action="group-filter" data-filter="todos" aria-pressed="${groupFilter === 'todos'}">Todos</button>
          <button type="button" class="chip" data-action="group-filter" data-filter="meus" aria-pressed="${groupFilter === 'meus'}">Meus grupos</button>
        </div>
        <div class="list-grid" id="group-list"></div></div>`,
      after() { loadList('grupos', $('#group-list'), renderGroups, skeletonItems(4)); }
    };
  }
  function renderGroups() {
    const list = D.GROUPS.filter((g) => groupFilter === 'todos' || state.groups.indexOf(g.id) !== -1);
    if (!list.length) return emptyState({ icon: 'users', title: 'Você ainda não participa de grupos', text: 'Escolha um grupo em “Todos” e toque em “Participar”.' });
    return list.map((g) => {
      const joined = state.groups.indexOf(g.id) !== -1;
      return `<article class="item-card"><span class="item-ic tone-${g.tone}" aria-hidden="true">${icon(g.icon, 24)}</span>
        <div class="item-main"><h2>${esc(g.name)}</h2>
          <p class="item-meta"><span>${icon('users')}${nf.format(g.members + (joined ? 1 : 0))} membros</span></p>
          <p class="item-desc">${esc(g.desc)}</p>
          <div class="item-actions"><button type="button" class="btn ${joined ? 'btn-secondary' : 'btn-primary'}" data-action="join-group" data-id="${g.id}" aria-pressed="${joined}">${joined ? icon('check', 18) + 'Participando' : 'Participar'}<span class="sr-only"> de ${esc(g.name)}</span></button></div>
        </div></article>`;
    }).join('');
  }

  // ---------- Eventos ----------
  let eventFilter = 'proximos';
  function viewEventos() {
    return {
      title: 'Eventos', key: 'eventos',
      html: `<div class="container page">${pageHead('Eventos', 'Encontros da comunidade em novembro.')}
        <div class="chips" role="group" aria-label="Filtrar eventos" style="margin-bottom:24px">
          <button type="button" class="chip" data-action="event-filter" data-filter="proximos" aria-pressed="${eventFilter === 'proximos'}">Próximos</button>
          <button type="button" class="chip" data-action="event-filter" data-filter="confirmados" aria-pressed="${eventFilter === 'confirmados'}">Confirmados</button>
        </div>
        <div class="list-grid" id="event-list"></div></div>`,
      after() { loadList('eventos', $('#event-list'), renderEvents, skeletonItems(4)); }
    };
  }
  function renderEvents() {
    const list = D.EVENTS.filter((ev) => eventFilter === 'proximos' || state.events.indexOf(ev.id) !== -1);
    if (!list.length) return emptyState({ icon: 'calendar', title: 'Nenhuma presença confirmada', text: 'Volte para “Próximos” e toque em “Confirmar presença” nos eventos que lhe interessam.' });
    return list.map((ev) => {
      const going = state.events.indexOf(ev.id) !== -1;
      return `<article class="item-card"><div class="date-block" aria-hidden="true"><strong>${ev.day}</strong><span>${ev.month}</span></div>
        <div class="item-main"><h2>${esc(ev.title)}</h2>
          <p class="item-meta"><span>${icon('calendar')}${ev.day} de novembro, ${ev.weekday}</span><span>${icon('clock')}${esc(ev.time)}</span></p>
          <p class="item-meta"><span>${icon('map-pin')}${esc(ev.place)}</span><span>${icon('users')}${ev.going + (going ? 1 : 0)} confirmados</span></p>
          <div class="item-actions"><button type="button" class="btn ${going ? 'btn-secondary' : 'btn-primary'}" data-action="going-event" data-id="${ev.id}" aria-pressed="${going}">${going ? icon('check', 18) + 'Presença confirmada' : 'Confirmar presença'}<span class="sr-only"> em ${esc(ev.title)}</span></button></div>
        </div></article>`;
    }).join('');
  }

  // ---------- Mensagens ----------
  function convMessages(c) { return c.messages.concat(state.extraMessages[c.id] || []); }
  function viewMensagens(parts) {
    const id = parts[0];
    const c = id ? D.CONVERSATIONS.find((x) => x.id === id) : null;
    if (c && state.convRead.indexOf(c.id) === -1) { state.convRead.push(c.id); save(); }
    const twoPane = mqDesktop.matches;
    const listHTML = `<div class="conv-list"><ul>${D.CONVERSATIONS.map((x) => {
      const u = user(x.with);
      const msgs = convMessages(x);
      const last = msgs[msgs.length - 1];
      const unread = convUnread(x);
      return `<li class="conv-item${unread ? ' is-unread' : ''}"><a class="conv-link" href="#/mensagens/${x.id}"${c && c.id === x.id ? ' aria-current="page"' : ''}>${avatar(u, 48)}
        <span class="conv-text"><strong>${esc(u.name)}</strong><span>${last.from === 'me' ? 'Você: ' : ''}${esc(last.text)}</span></span>
        <span class="conv-side"><span>${esc(last.time)}</span>${unread ? badgeHTML(unread, 'não lidas') : ''}</span></a></li>`;
    }).join('')}</ul></div>`;
    const chatHTML = c ? chatBox(c, !twoPane) : `<div class="chat"><div class="chat-empty"><div>${icon('message-circle', 32, '')}<p style="margin-top:8px">Selecione uma conversa para ler as mensagens.</p></div></div></div>`;
    let body;
    if (twoPane) body = `<div class="messages-layout">${listHTML}${chatHTML}</div>`;
    else body = c ? chatHTML : listHTML;
    return {
      title: c ? 'Conversa com ' + user(c.with).name : 'Mensagens', key: 'mensagens',
      focus: c && !twoPane ? '.chat-head h2' : null,
      html: `<div class="container page">${c && !twoPane ? '' : pageHead('Mensagens', 'Conversas com quem você segue.')}${body}</div>`,
      after() { const log = $('.chat-log'); if (log) log.scrollTop = log.scrollHeight; updateBadges(); buildDrawer(); }
    };
  }
  function chatBox(c, withBack) {
    const u = user(c.with);
    return `<section class="chat" aria-labelledby="chat-title">
      <div class="chat-head">${withBack ? `<a class="icon-btn" href="#/mensagens" aria-label="Voltar para conversas">${icon('arrow-left')}</a>` : ''}
        ${avatar(u, 40)}<div style="min-width:0"><h2 id="chat-title" tabindex="-1">${esc(u.name)}</h2><span class="chat-sub">${esc(u.role)}</span></div></div>
      <div class="chat-log" id="chat-log" role="log" aria-label="Mensagens com ${esc(u.name)}">${convMessages(c).map(bubble).join('')}</div>
      <div class="typing" id="typing" aria-live="polite"></div>
      <form class="chat-form" id="chat-form" data-conv="${c.id}" novalidate>
        <div class="field"><label for="chat-input" class="sr-only">Escreva uma mensagem para ${esc(u.name)}</label>
          <input class="input" id="chat-input" autocomplete="off" placeholder="Escreva uma mensagem…" enterkeyhint="send"></div>
        <button type="submit" class="btn btn-primary" style="min-height:44px">${icon('send', 18)}<span>Enviar</span></button>
      </form></section>`;
  }
  function bubble(m) {
    return `<p class="bubble${m.from === 'me' ? ' me' : ''}"><span class="sr-only">${m.from === 'me' ? 'Você' : esc(user(m.from).name)}: </span>${esc(m.text)}<time>${esc(m.time)}</time></p>`;
  }

  // ---------- Notificações ----------
  function viewNotificacoes() {
    return {
      title: 'Notificações', key: 'notificacoes',
      html: `<div class="container page page-narrow">${pageHead('Notificações', 'Curtidas, menções, convites e lembretes.', '<button type="button" class="btn btn-secondary" data-action="read-all">' + icon('check', 18) + 'Marcar todas como lidas</button>')}
        <div class="conv-list"><ul id="notif-page-list">${D.NOTIFICATIONS.map(notifItem).join('')}</ul></div></div>`
    };
  }

  // ---------- Configurações ----------
  function sw(key, title, text) {
    const on = !!state.settings[key];
    return `<div class="switch-row"><div class="switch-text" id="sw-${key}-label"><strong>${esc(title)}</strong><span>${esc(text)}</span></div>
      <button type="button" class="switch" role="switch" aria-checked="${on}" aria-labelledby="sw-${key}-label" data-action="setting" data-setting="${key}"></button></div>`;
  }
  function viewConfig() {
    const u = me();
    return {
      title: 'Configurações', key: 'configuracoes',
      html: `<div class="container page page-narrow">${pageHead('Configurações', 'Conta, notificações e privacidade.')}
        <section class="settings-card" aria-labelledby="set-conta"><h2 id="set-conta">Conta</h2>
          <div class="switch-row"><div class="switch-text"><strong>${esc(u.name)}</strong><span style="overflow-wrap:anywhere">${esc(u.email)}</span></div>
          <button type="button" class="btn btn-secondary" data-action="edit-profile">${icon('pencil', 18)}Editar perfil</button></div>
        </section>
        <section class="settings-card" aria-labelledby="set-notif"><h2 id="set-notif">Notificações</h2>
          ${sw('emailNotif', 'Resumo por e-mail', 'Um e-mail por semana com o que você perdeu.')}
          ${sw('pushNotif', 'Notificações no aparelho', 'Curtidas, comentários e mensagens.')}
        </section>
        <section class="settings-card" aria-labelledby="set-priv"><h2 id="set-priv">Privacidade</h2>
          ${sw('privateProfile', 'Perfil privado', 'Só quem você aprovar vê suas publicações.')}
        </section>
        <section class="settings-card" aria-labelledby="set-demo"><h2 id="set-demo">Demonstração</h2>
          ${sw('simulateError', 'Simular falha de conexão', 'A próxima carga de cada lista falha uma vez, para ver o estado de erro.')}
          <div class="settings-actions"><button type="button" class="btn btn-secondary" data-action="reset-demo">${icon('refresh', 18)}Restaurar dados da demonstração</button></div>
        </section></div>`
    };
  }

  // ---------- Ajuda ----------
  function viewAjuda() {
    return {
      title: 'Ajuda', key: 'ajuda',
      html: `<div class="container page page-narrow">${pageHead('Ajuda', 'Perguntas frequentes sobre o Conecta.')}
        <div class="faq">${D.FAQ.map((f) => `<details><summary>${esc(f.q)}${icon('chevron-down')}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
        <p class="notice notice-info" style="margin-top:24px">${icon('info')}<span>Não encontrou o que procurava? Escreva para <a href="mailto:ajuda@conecta.app">ajuda@conecta.app</a>.</span></p>
      </div>`
    };
  }

  // ---------- Detalhe da publicação ----------
  function viewPost(parts) {
    const p = postById(parts[0]);
    if (!p) return viewNotFound();
    const a = user(p.author);
    const liked = state.liked.indexOf(p.id) !== -1;
    const saved = state.saved.indexOf(p.id) !== -1;
    const comments = commentsFor(p.id);
    return {
      title: p.title, key: 'feed',
      html: `<div class="container page page-narrow">
        <button type="button" class="link-btn back-link" data-action="back">${icon('arrow-left', 18)}Voltar</button>
        <article class="post-detail" aria-labelledby="post-title">
          <div class="post-media tone-${p.tone}" aria-hidden="true"><span class="media-circle">${icon(p.icon, 28)}</span></div>
          <div class="post-body">
            <span class="tag">${esc(p.tag)}</span>
            <h1 id="post-title" tabindex="-1">${esc(p.title)}</h1>
            <div class="author-row">${avatar(a, 40)}<div style="min-width:0"><a href="#/perfil/${a.id}">${esc(a.name)}</a><div class="muted">${esc(a.role || '')} · <time>${esc(p.time)}</time></div></div></div>
            <p class="post-full">${esc(p.full || p.text)}</p>
            <div class="post-actions">
              <button type="button" class="btn-pill btn-neutral" data-action="like" data-id="${p.id}" aria-pressed="${liked}">${icon('heart', 18)}<span>Curtir</span><span class="like-count">${p.likes + (liked ? 1 : 0)}</span><span class="sr-only"> curtidas</span></button>
              <button type="button" class="btn-pill btn-neutral" data-action="save" data-id="${p.id}" aria-pressed="${saved}">${icon('bookmark', 18)}<span class="save-label">${saved ? 'Salvo' : 'Salvar'}</span></button>
              <button type="button" class="btn-pill btn-neutral" data-action="share">${icon('share', 18)}<span>Compartilhar</span></button>
            </div>
          </div>
        </article>
        <section class="comments" aria-labelledby="comments-title">
          <h2 class="section-title" id="comments-title">Comentários (${comments.length})</h2>
          <ul class="comment-list" id="comment-list">${comments.length ? comments.map(commentHTML).join('') : '<li class="field-hint">Seja a primeira pessoa a comentar.</li>'}</ul>
          <form class="comment-form" id="comment-form" data-id="${p.id}" novalidate>
            <div class="field"><label for="comment-input">Escreva um comentário</label>
              <textarea class="input" id="comment-input" rows="3" maxlength="300"></textarea>
              <p class="field-error" id="comment-input-error" hidden></p></div>
            <button type="submit" class="btn btn-primary">${icon('send', 18)}Comentar</button>
          </form>
        </section>
      </div>`
    };
  }
  function commentHTML(c) {
    const u = user(c.author);
    return `<li class="comment">${avatar(u, 32)}<div class="comment-body"><strong>${esc(u.name)}</strong><time>${esc(c.time)}</time><p>${esc(c.text)}</p></div></li>`;
  }

  function viewNotFound() {
    return {
      title: 'Página não encontrada', key: '',
      html: `<div class="container page">${pageHead('Página não encontrada', 'O endereço pode estar errado ou a página foi removida.')}
        ${emptyState({ icon: 'compass', title: 'Nada por aqui', action: '<a class="btn btn-primary" href="#/feed">Voltar para o Feed</a>' })}</div>`
    };
  }

  /* ======================================================================
     Stories (visualizador)
     ====================================================================== */
  function openStory(index, trigger) {
    let idx = index;
    openModal({
      className: 'modal-story', trigger,
      raw: (id) => `<div class="story-progress" aria-hidden="true"></div>
        <div class="story-head"><span class="story-av"></span><div class="who"><h2 id="${id}-title"></h2><time></time></div>
          <button type="button" class="icon-btn" data-modal-close aria-label="Fechar story">${icon('x')}</button></div>
        <div class="story-content" aria-live="polite"></div>
        <button type="button" class="story-nav story-prev" aria-label="Story anterior">${icon('chevron-left')}</button>
        <button type="button" class="story-nav story-next" aria-label="Próximo story">${icon('chevron-right')}</button>`,
      onMount(api) {
        const panelEl = api.panel;
        function render() {
          const s = D.STORIES[idx];
          const u = user(s.author);
          panelEl.className = 'modal-panel tone-' + s.tone;
          panelEl.querySelector('.story-progress').innerHTML = D.STORIES.map((_, i) => `<span class="${i <= idx ? 'is-done' : ''}"></span>`).join('');
          panelEl.querySelector('.story-av').outerHTML = `<span class="story-av">${avatar(u, 40)}</span>`;
          panelEl.querySelector('h2').textContent = u.name;
          panelEl.querySelector('time').textContent = s.time + ' · ' + (idx + 1) + ' de ' + D.STORIES.length;
          panelEl.querySelector('.story-content').innerHTML = `<span class="media-circle">${icon(s.icon, 32)}</span><p>${esc(s.text)}</p>`;
          panelEl.querySelector('.story-prev').disabled = idx === 0;
          panelEl.querySelector('.story-next').disabled = idx === D.STORIES.length - 1;
          if (state.seenStories.indexOf(s.id) === -1) { state.seenStories.push(s.id); save(); }
        }
        function go(d) {
          const n = idx + d;
          if (n < 0 || n >= D.STORIES.length) return;
          idx = n;
          render();
          const btn = panelEl.querySelector(d > 0 ? '.story-next' : '.story-prev');
          if (btn.disabled) panelEl.querySelector(d > 0 ? '.story-prev' : '.story-next').focus();
        }
        panelEl.querySelector('.story-prev').addEventListener('click', () => go(-1));
        panelEl.querySelector('.story-next').addEventListener('click', () => go(1));
        api.el.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        });
        render();
      },
      onClose() {
        $all('.story[data-index]').forEach((b) => {
          const s = D.STORIES[+b.getAttribute('data-index')];
          const seen = state.seenStories.indexOf(s.id) !== -1;
          b.classList.toggle('is-seen', seen);
          b.setAttribute('aria-label', `Story de ${user(s.author).name}, ${seen ? 'visto' : 'não visto'}`);
        });
      }
    });
  }

  /* ======================================================================
     Nova publicação ("+ Novo")
     ====================================================================== */
  function openCompose(trigger) {
    openModal({
      title: 'Nova publicação', trigger, initialFocus: '#compose-title',
      body: `<form id="compose-form" class="modal-form" novalidate>
        <div class="error-summary" id="compose-summary" role="alert" tabindex="-1" hidden></div>
        <div class="field"><label for="compose-title">Título</label><input class="input" id="compose-title" maxlength="80" autocomplete="off"><p class="field-error" id="compose-title-error" hidden></p></div>
        <div class="field"><label for="compose-topic">Tema</label><div class="select-wrap"><select class="input" id="compose-topic">${D.TOPICS.map((t) => `<option value="${t.id}">${esc(t.label)}</option>`).join('')}</select>${icon('chevron-down', 18)}</div></div>
        <div class="field"><label for="compose-text">Texto</label><textarea class="input" id="compose-text" rows="4" maxlength="500" data-describedby="compose-text-hint" aria-describedby="compose-text-hint"></textarea>
          <p class="field-hint" id="compose-text-hint">Até 500 caracteres.</p><p class="field-error" id="compose-text-error" hidden></p></div>
      </form>`,
      footer: `<button type="button" class="btn btn-secondary" data-modal-close>Cancelar</button><button type="submit" form="compose-form" class="btn btn-primary" id="compose-submit">Publicar</button>`,
      onMount(api) {
        const form = api.el.querySelector('#compose-form');
        const title = api.el.querySelector('#compose-title');
        const text = api.el.querySelector('#compose-text');
        const rules = {
          'compose-title': (v) => (!v.trim() ? 'Dê um título à publicação.' : v.trim().length < 3 ? 'Use pelo menos 3 caracteres no título.' : ''),
          'compose-text': (v) => (!v.trim() ? 'Escreva o texto da publicação.' : '')
        };
        [title, text].forEach((el) => {
          el.addEventListener('blur', () => { if (el.value || el.getAttribute('aria-invalid')) setFieldError(el, rules[el.id](el.value)); });
          el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) setFieldError(el, rules[el.id](el.value)); });
        });
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const errors = [];
          [title, text].forEach((el) => { const m = rules[el.id](el.value); setFieldError(el, m); if (m) errors.push({ id: el.id, message: m }); });
          const summary = api.el.querySelector('#compose-summary');
          renderSummary(summary, errors, errors.length > 1 ? `Revise os ${errors.length} campos abaixo:` : 'Revise o campo abaixo:');
          if (errors.length) { summary.focus(); return; }
          const btn = api.el.querySelector('#compose-submit');
          btn.disabled = true; btn.textContent = 'Publicando…';
          setTimeout(() => {
            const t = topic(api.el.querySelector('#compose-topic').value);
            state.myPosts.unshift({
              id: 'n' + Date.now(), author: 'u1', topic: t.id, icon: t.icon, tone: t.tone, tag: 'Novo', time: 'agora', likes: 0,
              title: title.value.trim(), text: text.value.trim(), full: text.value.trim(), isNew: true
            });
            save();
            api.close(false);
            if (current.name === 'feed') router(); else location.hash = '#/feed';
            toast('Publicação criada.', 'check');
          }, 600);
        });
      }
    });
  }

  /* ======================================================================
     Ações delegadas
     ====================================================================== */
  document.addEventListener('click', (e) => {
    const notifLink = e.target.closest('[data-notif]');
    if (notifLink) {
      const id = notifLink.getAttribute('data-notif');
      if (state.readNotifs.indexOf(id) === -1) { state.readNotifs.push(id); save(); updateBadges(); }
    }
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.getAttribute('data-action');
    const id = el.getAttribute('data-id');
    switch (action) {
      case 'compose': openCompose(el); break;
      case 'logout': logout(); break;
      case 'read-all':
        state.readNotifs = D.NOTIFICATIONS.map((n) => n.id); save(); updateBadges(); renderNotifPopover();
        if ($('#notif-page-list')) $('#notif-page-list').innerHTML = D.NOTIFICATIONS.map(notifItem).join('');
        buildDrawer();
        toast('Todas as notificações foram marcadas como lidas.', 'check');
        break;
      case 'story': openStory(+el.getAttribute('data-index'), el); break;
      case 'retry': router(); break;
      case 'back':
        if (navDepth > 1) history.back(); else location.hash = '#/feed';
        break;
      case 'like': {
        const on = toggleIn(state.liked, id); save();
        el.setAttribute('aria-pressed', String(on));
        el.querySelector('.like-count').textContent = postById(id).likes + (on ? 1 : 0);
        break;
      }
      case 'save': {
        const on = toggleIn(state.saved, id); save();
        el.setAttribute('aria-pressed', String(on));
        el.querySelector('.save-label').textContent = on ? 'Salvo' : 'Salvar';
        toast(on ? 'Publicação salva em Salvos.' : 'Publicação removida de Salvos.', on ? 'bookmark' : 'check');
        break;
      }
      case 'share': {
        const done = () => toast('Link copiado.', 'link');
        const fail = () => toast('Copie o endereço na barra do navegador.', 'info');
        try { navigator.clipboard.writeText(location.href).then(done, fail); } catch (err) { fail(); }
        break;
      }
      case 'follow': {
        const uid = el.getAttribute('data-user');
        state.following[uid] = !state.following[uid]; save();
        const f = state.following[uid];
        if (current.name === 'perfil') { router(); $('[data-action="follow"]') && $('[data-action="follow"]').focus(); }
        else {
          el.setAttribute('aria-pressed', String(f));
          el.className = 'btn-pill ' + (f ? 'btn-tonal' : 'btn-primary');
          el.innerHTML = (f ? 'Seguindo' : 'Seguir') + `<span class="sr-only"> ${esc(user(uid).name)}</span>`;
        }
        toast(f ? `Você agora segue ${user(uid).name}.` : `Você deixou de seguir ${user(uid).name}.`, 'check');
        break;
      }
      case 'join-group': {
        const on = toggleIn(state.groups, id); save();
        $('#group-list').innerHTML = renderGroups();
        const again = $(`[data-action="join-group"][data-id="${id}"]`);
        if (again) again.focus(); else $('[data-action="group-filter"][aria-pressed="true"]').focus();
        toast(on ? 'Você entrou no grupo.' : 'Você saiu do grupo.', 'check');
        break;
      }
      case 'going-event': {
        const on = toggleIn(state.events, id); save();
        $('#event-list').innerHTML = renderEvents();
        const again = $(`[data-action="going-event"][data-id="${id}"]`);
        if (again) again.focus(); else $('[data-action="event-filter"][aria-pressed="true"]').focus();
        toast(on ? 'Presença confirmada.' : 'Presença cancelada.', 'check');
        break;
      }
      case 'group-filter':
        groupFilter = el.getAttribute('data-filter');
        $all('[data-action="group-filter"]').forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
        $('#group-list').innerHTML = renderGroups();
        break;
      case 'event-filter':
        eventFilter = el.getAttribute('data-filter');
        $all('[data-action="event-filter"]').forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
        $('#event-list').innerHTML = renderEvents();
        break;
      case 'explore-topic':
        explore.topic = el.getAttribute('data-topic');
        $all('[data-action="explore-topic"]').forEach((b) => b.setAttribute('aria-pressed', String(b === el)));
        syncExploreUrl(); renderExplore(false);
        break;
      case 'explore-clear':
        explore = { q: '', topic: 'todos' };
        $('#explore-q').value = ''; searchInput.value = '';
        $all('[data-action="explore-topic"]').forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute('data-topic') === 'todos')));
        syncExploreUrl(); renderExplore(false); $('#explore-q').focus();
        break;
      case 'profile-tab':
        selectProfileTab(el);
        break;
      case 'edit-profile': openEditProfile(el); break;
      case 'setting': {
        const key = el.getAttribute('data-setting');
        state.settings[key] = !state.settings[key]; save();
        el.setAttribute('aria-checked', String(state.settings[key]));
        if (key === 'simulateError') { loaded = {}; failedOnce = {}; }
        toast(state.settings[key] ? 'Ativado.' : 'Desativado.', 'check');
        break;
      }
      case 'reset-demo':
        state = defaultState(); save(); loaded = {}; failedOnce = {};
        updateUserUI(); router();
        toast('Dados da demonstração restaurados.', 'check');
        break;
      default: break;
    }
  });

  function selectProfileTab(btn) {
    profileTab = btn.getAttribute('data-tab');
    $all('.tab-pill').forEach((t) => {
      const on = t === btn;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    renderProfilePanel($('#profile-panel').getAttribute('data-user'));
  }
  document.addEventListener('keydown', (e) => {
    const tab = e.target.closest && e.target.closest('.tab-pill');
    if (!tab || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) === -1) return;
    e.preventDefault();
    const tabs = $all('.tab-pill');
    let i = tabs.indexOf(tab);
    if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') i = 0;
    else i = tabs.length - 1;
    tabs[i].focus();
    selectProfileTab(tabs[i]);
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.id === 'explore-form') {
      e.preventDefault();
      explore.q = $('#explore-q').value.trim();
      searchInput.value = explore.q;
      syncExploreUrl(); renderExplore(false);
    } else if (form.id === 'comment-form') {
      e.preventDefault();
      const input = $('#comment-input');
      const msg = input.value.trim() ? '' : 'Escreva um comentário antes de enviar.';
      setFieldError(input, msg);
      if (msg) { input.focus(); return; }
      const pid = form.getAttribute('data-id');
      (state.comments[pid] = state.comments[pid] || []).push({ author: 'u1', text: input.value.trim(), time: 'agora' });
      save();
      const list = commentsFor(pid);
      $('#comment-list').innerHTML = list.map(commentHTML).join('');
      $('#comments-title').textContent = `Comentários (${list.length})`;
      input.value = '';
      toast('Comentário publicado.', 'check');
    } else if (form.id === 'chat-form') {
      e.preventDefault();
      const input = $('#chat-input');
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      const cid = form.getAttribute('data-conv');
      const c = D.CONVERSATIONS.find((x) => x.id === cid);
      const now = new Date();
      const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      (state.extraMessages[cid] = state.extraMessages[cid] || []).push({ from: 'me', text, time });
      save();
      input.value = '';
      const log = $('#chat-log');
      log.innerHTML = convMessages(c).map(bubble).join('');
      log.scrollTop = log.scrollHeight;
      const typing = $('#typing');
      typing.textContent = firstName(user(c.with).name) + ' está digitando…';
      later(1400, () => {
        const replies = ['Combinado!', 'Boa ideia, vamos sim.', 'Haha, verdade!', 'Te respondo já já.'];
        state.extraMessages[cid].push({ from: c.with, text: replies[state.extraMessages[cid].length % replies.length], time });
        save();
        typing.textContent = '';
        log.innerHTML = convMessages(c).map(bubble).join('');
        log.scrollTop = log.scrollHeight;
      });
    }
  });

  /* ======================================================================
     Roteador
     ====================================================================== */
  const routes = {
    feed: viewFeed, explorar: viewExplorar, salvos: viewSalvos, perfil: viewPerfil,
    grupos: viewGrupos, eventos: viewEventos, mensagens: viewMensagens,
    notificacoes: viewNotificacoes, configuracoes: viewConfig, ajuda: viewAjuda, post: viewPost
  };
  let current = { name: '' };
  let navDepth = 0;
  let firstAppRender = true;
  const main = $('#main');

  function parseHash() {
    let h = location.hash.replace(/^#/, '');
    if (h.charAt(0) !== '/') h = '/' + h;
    const qi = h.indexOf('?');
    const path = qi === -1 ? h : h.slice(0, qi);
    const qs = qi === -1 ? '' : h.slice(qi + 1);
    return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(qs) };
  }

  function showLogin() {
    $('#app').hidden = true;
    Login.show();
  }
  function showApp() {
    Login.hide();
    $('#app').hidden = false;
  }

  function router() {
    if (!isLogged()) { showLogin(); return; }
    const { parts, params } = parseHash();
    if (!parts.length || parts[0] === 'entrar') {
      try { history.replaceState(null, '', location.pathname + '#/feed'); } catch (e) { location.hash = '#/feed'; return; }
      return router();
    }
    showApp();
    renderToken += 1;
    closeDrawer(false);
    closePanel(false);
    Popovers.closeAll();
    header.classList.remove('is-hidden');

    const name = parts[0];
    const view = (routes[name] || viewNotFound)(parts.slice(1), params);
    current = { name, parts, params };
    main.innerHTML = view.html;
    document.title = view.title + ' · Conecta';
    updateNav(view.key);
    if (view.after) view.after();
    window.scrollTo(0, 0);

    const target = view.focus ? $(view.focus) : main.querySelector('h1');
    if (target) {
      if (!target.hasAttribute('tabindex') && !target.matches('input, button, a')) target.tabIndex = -1;
      if (!firstAppRender || view.focus) target.focus({ preventScroll: true });
    }
    firstAppRender = false;
  }

  window.addEventListener('hashchange', () => { navDepth += 1; router(); });

  /* ======================================================================
     Login / logout
     ====================================================================== */
  function onLoginSuccess(info) {
    if (info) {
      state.user.name = info.name || state.user.name;
      state.user.email = info.email || state.user.email;
      if (info.isNew) { state.user.role = 'Membro do Conecta'; state.user.bio = ''; }
    } else {
      state.user.email = D.ME.email;
      if (!state.user.name) state.user.name = D.ME.name;
    }
    save();
    setLogged(true);
    loaded = {};
    firstAppRender = true;
    updateUserUI();
    let target = location.hash && location.hash !== '#' && location.hash !== '#/' ? location.hash : '#/feed';
    try { history.replaceState(null, '', location.pathname + target); } catch (e) { location.hash = target; }
    router();
    const h = main.querySelector('h1');
    if (h) h.focus({ preventScroll: true });
    toast(info && info.isNew ? `Conta criada. Boas-vindas, ${firstName(info.name)}!` : `Olá, ${firstName(me().name)}!`, 'check');
  }

  function logout() {
    closeDrawer(false);
    Popovers.closeAll();
    setLogged(false);
    Login.reset();
    try { history.replaceState(null, '', location.pathname); } catch (e) { location.hash = ''; }
    main.innerHTML = '';
    showLogin();
    const h = $('#login-title');
    if (h) h.focus();
    toast('Você saiu da conta.', 'log-out');
  }

  /* ======================================================================
     Inicialização
     ====================================================================== */
  function init() {
    hydrateIcons(document);
    buildHeaderNav();
    updateUserUI();
    Popovers.register($('#notif-trigger'), $('#notif-popover'), { onOpen: renderNotifPopover });
    Popovers.register($('#profile-trigger'), $('#profile-menu'));
    Login.init(onLoginSuccess);

    let resizeRaf = 0;
    let settleTimer = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(fitNav, 220); // depois da transição de largura da busca
      resizeRaf = requestAnimationFrame(() => {
        fitNav();
        const open = Popovers.openOne();
        if (open) Popovers.position(open);
      });
    });
    mqMobile.addEventListener('change', () => { if (!mqMobile.matches) closeDrawer(false); });
    mqDesktop.addEventListener('change', () => {
      if (mqDesktop.matches) closePanel(false);
      if (current.name === 'mensagens' && isLogged()) router();
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);

    router();
  }

  init();
})();
