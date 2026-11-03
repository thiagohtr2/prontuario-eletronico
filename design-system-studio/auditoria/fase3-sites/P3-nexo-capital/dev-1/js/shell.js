/* =========================================================
   Shell: sidebar (integral / trilho / sobreposição), header do painel,
   drawer do celular, menus (unidade, perfil, período), busca e notificações.
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const { $, $$, esc, icon } = N;

  const TABS = [
    { id: 'visao-geral', label: 'Visão geral' },
    { id: 'aquisicao', label: 'Aquisição' },
    { id: 'retencao', label: 'Retenção' },
    { id: 'receita', label: 'Receita' }
  ];
  const NAV = [
    { id: 'gestao', title: 'Gestão', items: [
      { id: 'painel', label: 'Painel', icon: 'layoutDashboard', href: '#/painel/visao-geral', children: TABS },
      { id: 'contratos', label: 'Contratos', icon: 'fileText', href: '#/contratos' },
      { id: 'fornecedores', label: 'Fornecedores', icon: 'truck', href: '#/fornecedores' },
      { id: 'compras', label: 'Compras', icon: 'shoppingCart', href: '#/compras' }
    ] },
    { id: 'pessoas', title: 'Pessoas', items: [
      { id: 'colaboradores', label: 'Colaboradores', icon: 'users', href: '#/colaboradores' },
      { id: 'folha', label: 'Folha', icon: 'wallet', href: '#/folha' }
    ] },
    { id: 'administracao', title: 'Administração', items: [
      { id: 'auditoria', label: 'Auditoria', icon: 'shieldCheck', href: '#/auditoria' },
      { id: 'permissoes', label: 'Permissões', icon: 'keyRound', href: '#/permissoes' }
    ] }
  ];
  const ACCOUNT = {
    perfil: { label: 'Meu perfil', icon: 'user', href: '#/perfil' },
    configuracoes: { label: 'Configurações', icon: 'settings', href: '#/configuracoes' },
    ajuda: { label: 'Ajuda', icon: 'help', href: '#/ajuda' }
  };
  N.TABS = TABS;
  N.NAV = NAV;
  N.ACCOUNT = ACCOUNT;
  N.pageInfo = function (page) {
    for (const g of NAV) for (const it of g.items) if (it.id === page) return { group: g.title, label: it.label, icon: it.icon };
    if (ACCOUNT[page]) return { group: 'Conta', label: ACCOUNT[page].label, icon: ACCOUNT[page].icon };
    return null;
  };

  const mqRail = matchMedia('(min-width: 768px) and (max-width: 1023px)');
  const mqMobile = matchMedia('(max-width: 767px)');
  const Shell = {};
  let inited = false;
  let sidebarOverlay;
  let drawerOverlay;
  let notifications = N.NOTIFICATIONS.map((n) => Object.assign({}, n));
  const groupKey = 'nexo.sidebar.groups';
  const rememberGroups = () => N.store.get('nexo.prefs.rememberGroups', true);

  /* ---------- Navegação (sidebar e drawer usam a mesma fonte) ---------- */
  function navHTML(mode) {
    const saved = rememberGroups() ? N.store.get(groupKey, {}) : {};
    return NAV.map((g) => {
      const collapsed = mode === 'sb' && saved[g.id] === false;
      const titleId = mode + '-gt-' + g.id;
      const listId = mode + '-gl-' + g.id;
      const title = mode === 'sb'
        ? '<h2 class="nav-group-title"><button type="button" class="nav-group-btn" id="' + titleId + '" data-group="' + g.id + '" aria-expanded="' + !collapsed + '" aria-controls="' + listId + '"><span>' + esc(g.title) + '</span>' + icon('chevronDown', { size: 16 }) + '</button></h2>'
        : '<h2 class="nav-group-title"><span class="nav-group-label" id="' + titleId + '">' + esc(g.title) + '</span></h2>';
      return '<div class="nav-group' + (collapsed ? ' is-collapsed' : '') + '" data-group-wrap="' + g.id + '">' + title +
        '<ul class="nav-list" id="' + listId + '" aria-labelledby="' + titleId + '">' +
        g.items.map((it) => '<li><a class="nav-item' + (it.children ? ' has-sub' : '') + '" href="' + it.href + '" data-nav="' + it.id + '"' + (mode === 'sb' ? ' data-tooltip="' + esc(it.label) + '"' : '') + '>' +
          icon(it.icon) + '<span class="nav-label">' + esc(it.label) + '</span></a>' +
          (it.children ? '<ul class="nav-sub" aria-label="Visões do ' + esc(it.label) + '">' + it.children.map((c) => '<li><a class="nav-subitem" href="#/painel/' + c.id + '" data-nav-tab="' + c.id + '">' + esc(c.label) + '</a></li>').join('') + '</ul>' : '') +
          '</li>').join('') +
        '</ul></div>';
    }).join('');
  }

  function unitBtnInner() {
    const u = N.unitById(N.state.unit);
    return N.brandMark() + '<span class="unit-text"><span class="brand-name">Nexo Capital</span><span class="unit-name" data-unit-name>' + esc(u.name) + '</span></span>' + icon('chevronsUpDown', { size: 16 });
  }

  function buildSidebar() {
    const sb = $('#sidebar');
    sb.innerHTML =
      '<div class="sb-top">' +
        '<button type="button" class="icon-btn sb-rail-toggle" id="btn-rail" aria-label="Expandir menu" aria-controls="sidebar" aria-expanded="false" data-tooltip="Expandir menu">' + icon('menu') + '</button>' +
        '<button type="button" class="unit-btn" id="unit-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Unidade: ' + esc(N.unitById(N.state.unit).name) + '. Trocar unidade">' + unitBtnInner() + '</button>' +
        '<button type="button" class="icon-btn sb-close" id="btn-rail-close" aria-label="Recolher menu">' + icon('x') + '</button>' +
      '</div>' +
      '<nav class="sb-nav" aria-label="Menu lateral">' + navHTML('sb') + '</nav>' +
      '<div class="sb-footer">' +
        '<button type="button" class="profile-btn" id="sb-profile" aria-haspopup="menu" aria-expanded="false" aria-label="Perfil de ' + esc(N.USER.name) + ', ' + esc(N.USER.role) + '. Abrir menu" data-tooltip="' + esc(N.USER.name) + '">' +
          '<span class="avatar" aria-hidden="true">' + esc(N.USER.initials) + '</span>' +
          '<span class="profile-text"><span class="profile-name">' + esc(N.USER.name) + '</span><span class="profile-role">' + esc(N.USER.role) + '</span></span>' + icon('ellipsis') +
        '</button>' +
        '<a class="icon-btn sb-settings" href="#/configuracoes" aria-label="Configurações" data-tooltip="Configurações">' + icon('settings') + '</a>' +
      '</div>';
  }

  function buildHeader() {
    $('#app-header').innerHTML =
      '<button type="button" class="hdr-icon hdr-menu" id="btn-drawer" aria-label="Abrir menu" aria-controls="drawer" aria-expanded="false" aria-haspopup="dialog">' + icon('menu') + '</button>' +
      '<a class="brand hdr-brand" href="#/painel/visao-geral" aria-label="Nexo Capital — Painel">' + N.brandMark() + '<span class="brand-name">Nexo Capital</span></a>' +
      '<nav class="hdr-tabs" aria-label="Principal"><ul>' + TABS.map((t) => '<li><a class="hdr-tab" href="#/painel/' + t.id + '" data-tab="' + t.id + '">' + esc(t.label) + '</a></li>').join('') + '</ul></nav>' +
      '<nav class="hdr-crumbs" aria-label="Trilha de navegação" hidden><ol data-crumbs></ol></nav>' +
      '<div class="hdr-actions">' +
        '<button type="button" class="hdr-btn hdr-search" id="btn-search" aria-label="Buscar" aria-haspopup="dialog" aria-expanded="false" aria-keyshortcuts="/" data-tooltip="Buscar (/)" data-tooltip-mq="(max-width: 1439px)">' + icon('search') + '<span class="hdr-search-label" aria-hidden="true">Buscar…</span><kbd aria-hidden="true">/</kbd></button>' +
        '<button type="button" class="hdr-btn hdr-period" data-period-trigger aria-haspopup="menu" aria-expanded="false"><span class="sr-only">Período: </span><span data-period-label></span>' + icon('chevronDown', { size: 16 }) + '</button>' +
        '<button type="button" class="btn btn--primary hdr-export" data-action="export" data-tooltip="Exportar" data-tooltip-mq="(max-width: 1279px)">' + icon('download', { size: 16 }) + '<span class="hdr-export-label">Exportar</span></button>' +
        '<button type="button" class="hdr-icon hdr-bell" id="btn-notif" aria-haspopup="dialog" aria-expanded="false" data-tooltip="Notificações">' + icon('bell') + '<span class="hdr-badge" aria-hidden="true"></span></button>' +
        '<button type="button" class="hdr-avatar" id="btn-profile" aria-haspopup="menu" aria-expanded="false" aria-label="Menu do perfil de ' + esc(N.USER.name) + '"><span class="avatar" aria-hidden="true">' + esc(N.USER.initials) + '</span></button>' +
      '</div>';
    updateBell();
  }

  function buildDrawer() {
    $('#drawer').innerHTML =
      '<div class="drawer-head">' +
        '<span class="avatar avatar--lg" aria-hidden="true">' + esc(N.USER.initials) + '</span>' +
        '<div class="drawer-user"><p class="drawer-name">' + esc(N.USER.name) + '</p><p class="drawer-role">' + esc(N.USER.role) + '</p></div>' +
        '<button type="button" class="icon-btn drawer-close" id="btn-drawer-close" aria-label="Fechar menu">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="drawer-body">' +
        '<button type="button" class="unit-btn" id="unit-btn-drawer" aria-haspopup="menu" aria-expanded="false" aria-label="Unidade: ' + esc(N.unitById(N.state.unit).name) + '. Trocar unidade">' + unitBtnInner() + '</button>' +
        '<nav aria-label="Menu lateral">' + navHTML('dr') + '</nav>' +
      '</div>' +
      '<div class="drawer-foot"><ul class="nav-list">' +
        '<li><a class="nav-item" href="#/configuracoes" data-nav="configuracoes">' + icon('settings') + '<span class="nav-label">Configurações</span></a></li>' +
        '<li><a class="nav-item" href="#/ajuda" data-nav="ajuda">' + icon('help') + '<span class="nav-label">Ajuda</span></a></li>' +
        '<li><button type="button" class="nav-item nav-item--danger" data-logout>' + icon('logOut') + '<span class="nav-label">Sair</span></button></li>' +
      '</ul></div>';
  }

  /* ---------- Menus ---------- */
  function openUnitMenu(trigger) {
    N.menu(trigger, {
      label: 'Trocar unidade',
      align: 'start',
      width: Math.max(240, trigger.offsetWidth) + 'px',
      items: N.UNITS.map((u) => ({
        label: u.name,
        checked: u.id === N.state.unit,
        onSelect: () => {
          if (u.id === N.state.unit) return;
          N.setState({ unit: u.id });
          N.toast('Unidade alterada para ' + u.name + '.');
        }
      })).concat([{ sep: true }, { label: 'Criar unidade', icon: 'plus', onSelect: openCreateUnit }])
    });
  }

  function openCreateUnit() {
    const dlg = N.dialog({
      title: 'Criar unidade',
      form: true,
      body: '<div class="form-summary" id="unit-summary" role="alert" tabindex="-1" hidden></div>' +
        '<div class="field"><label class="field-label" for="unit-new-name">Nome da unidade</label>' +
        '<input class="input" id="unit-new-name" name="name" type="text" autocomplete="off" placeholder="Ex.: Filial — Recife" autofocus>' +
        '<p class="field-error" id="unit-new-name-error" hidden></p></div>',
      actions: [{ label: 'Cancelar' }, { label: 'Criar unidade', variant: 'btn--primary', submit: true }],
      onSubmit: (d, close) => {
        const input = d.querySelector('#unit-new-name');
        const err = d.querySelector('#unit-new-name-error');
        const v = input.value.trim();
        const msg = !v ? 'Informe o nome da unidade.' : (N.UNITS.some((u) => u.name.toLowerCase() === v.toLowerCase()) ? 'Já existe uma unidade com esse nome.' : '');
        if (msg) {
          input.setAttribute('aria-invalid', 'true');
          input.setAttribute('aria-describedby', err.id);
          err.innerHTML = icon('alert', { size: 16 }) + '<span>' + esc(msg) + '</span>';
          err.hidden = false;
          input.focus();
          return;
        }
        const id = 'u' + Date.now();
        N.UNITS.push({ id, name: v, factor: 0.3 });
        close();
        N.setState({ unit: id });
        N.toast('Unidade “' + v + '” criada e selecionada.');
      }
    });
    return dlg;
  }

  function openProfileMenu(trigger) {
    N.menu(trigger, {
      label: 'Conta de ' + N.USER.name,
      align: 'end',
      header: '<div class="menu-header" role="presentation"><p class="menu-header-name">' + esc(N.USER.name) + '</p><p class="menu-header-mail">' + esc(N.USER.email) + '</p></div>',
      items: [
        { label: 'Meu perfil', icon: 'user', onSelect: () => go('#/perfil') },
        { label: 'Configurações', icon: 'settings', onSelect: () => go('#/configuracoes') },
        { label: 'Ajuda', icon: 'help', kbd: '?', onSelect: () => go('#/ajuda') },
        { sep: true },
        { label: 'Sair', icon: 'logOut', danger: true, onSelect: N.logout }
      ]
    });
  }

  function openSidebarProfileMenu(trigger, viaUp) {
    // abre para cima, dentro da altura da janela
    N.menu(trigger, {
      label: 'Conta de ' + N.USER.name,
      placement: 'top',
      align: 'start',
      focusLast: viaUp,
      items: [
        { label: 'Meu perfil', icon: 'user', onSelect: () => go('#/perfil') },
        { label: 'Preferências', icon: 'settings', onSelect: () => go('#/configuracoes') },
        { sep: true },
        { label: 'Sair', icon: 'logOut', danger: true, onSelect: N.logout }
      ]
    });
  }

  Shell.openPeriodMenu = function (trigger) {
    if (trigger.getAttribute('aria-disabled') === 'true') {
      N.toast('O filtro de período não se aplica a esta página.');
      return;
    }
    N.menu(trigger, {
      label: 'Período',
      align: 'end',
      items: N.PERIODS.map((p) => ({
        label: p.label,
        checked: p.id === N.state.period,
        onSelect: () => { if (p.id !== N.state.period) N.setState({ period: p.id }); }
      }))
    });
  };

  function go(hash) {
    if (location.hash === hash) N.Pages.focusTitle(); else location.hash = hash;
  }

  /* ---------- Busca ---------- */
  function searchIndex() {
    const list = [];
    NAV.forEach((g) => g.items.forEach((it) => {
      list.push({ kind: 'Página', label: it.label, sub: g.title, icon: it.icon, href: it.href });
      (it.children || []).forEach((c) => list.push({ kind: 'Painel', label: c.label, sub: 'Painel', icon: 'layoutDashboard', href: '#/painel/' + c.id }));
    }));
    Object.values(ACCOUNT).forEach((a) => list.push({ kind: 'Conta', label: a.label, sub: 'Conta', icon: a.icon, href: a.href }));
    N.CLIENTS.forEach((c) => list.push({ kind: 'Cliente', label: c, sub: 'Pedidos recentes', icon: 'building', client: c }));
    return list;
  }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function openSearch(trigger) {
    if (!trigger || !trigger.getClientRects().length) return;
    const pop = N.html(
      '<div class="popover search-pop" role="dialog" aria-label="Buscar">' +
        '<div class="search-field">' + icon('search', { size: 16 }) +
          '<label class="sr-only" for="search-input">Buscar páginas e clientes</label>' +
          '<input id="search-input" class="input input--cp" type="search" role="combobox" aria-expanded="true" aria-controls="search-results" aria-autocomplete="list" placeholder="Buscar páginas e clientes" autocomplete="off">' +
          '<kbd aria-hidden="true">Esc</kbd></div>' +
        '<ul id="search-results" class="search-results" role="listbox" aria-label="Resultados da busca"></ul>' +
        '<p class="sr-only" aria-live="polite" data-search-live></p>' +
      '</div>');
    const ctl = N.openPopover(trigger, pop, { align: 'end' });
    if (!ctl) return;
    const input = pop.querySelector('input');
    const ul = pop.querySelector('ul');
    const live = pop.querySelector('[data-search-live]');
    const idx = searchIndex();
    let results = [];
    let active = -1;
    function render() {
      const q = norm(input.value.trim());
      results = (q ? idx.filter((x) => norm(x.label).includes(q) || norm(x.sub).includes(q)) : idx.filter((x) => x.kind !== 'Cliente')).slice(0, 8);
      active = results.length ? 0 : -1;
      ul.innerHTML = results.length
        ? results.map((r, i) => '<li role="option" id="sr-' + i + '" aria-selected="' + (i === active) + '" data-i="' + i + '">' + icon(r.icon) + '<span class="sr-text">' + esc(r.label) + '</span><span class="sr-kind">' + esc(r.kind) + '</span></li>').join('')
        : '<li class="search-empty" role="presentation">Nenhum resultado para “' + esc(input.value.trim()) + '”.</li>';
      input.setAttribute('aria-activedescendant', active >= 0 ? 'sr-0' : '');
      live.textContent = results.length ? results.length + ' resultado(s)' : 'Nenhum resultado';
      ctl.reposition();
    }
    function setActive(i) {
      if (!results.length) return;
      active = (i + results.length) % results.length;
      ul.querySelectorAll('[role="option"]').forEach((li, j) => li.setAttribute('aria-selected', String(j === active)));
      input.setAttribute('aria-activedescendant', 'sr-' + active);
      const el = ul.querySelector('#sr-' + active);
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
    function choose(i) {
      const r = results[i];
      if (!r) return;
      ctl.close(false);
      if (r.client) { N.Pages.setPendingQuery(r.client); go('#/painel/visao-geral'); if (location.hash === '#/painel/visao-geral') N.Pages.applyPendingQuery(); }
      else go(r.href);
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
      else if (e.key === 'Tab') { ctl.close(true); }
    });
    ul.addEventListener('click', (e) => { const li = e.target.closest('[role="option"]'); if (li) choose(+li.dataset.i); });
    render();
    input.focus({ preventScroll: true });
  }

  /* ---------- Notificações ---------- */
  function updateBell() {
    const n = notifications.filter((x) => x.unread).length;
    const bell = $('#btn-notif');
    if (!bell) return;
    bell.setAttribute('aria-label', n ? 'Notificações, ' + n + ' não lidas' : 'Notificações');
    const b = bell.querySelector('.hdr-badge');
    b.textContent = n;
    b.hidden = n === 0;
  }
  function openNotifications(trigger) {
    const pop = N.html(
      '<div class="popover notif-pop" role="dialog" aria-labelledby="notif-title" tabindex="-1">' +
        '<div class="pop-head"><h2 class="pop-title" id="notif-title">Notificações</h2>' +
        '<button type="button" class="btn btn--ghost" data-mark-read>Marcar todas como lidas</button></div>' +
        '<ul class="notif-list">' + notifications.map((n) =>
          '<li class="notif' + (n.unread ? ' is-unread' : '') + '"><span class="notif-dot" aria-hidden="true"></span><div><p class="notif-title">' + (n.unread ? '<span class="sr-only">Não lida: </span>' : '') + esc(n.title) + '</p><p class="notif-meta">' + esc(n.meta) + '</p></div></li>').join('') +
        '</ul></div>');
    const ctl = N.openPopover(trigger, pop, { align: 'end' });
    if (!ctl) return;
    const mark = pop.querySelector('[data-mark-read]');
    mark.disabled = !notifications.some((x) => x.unread);
    mark.addEventListener('click', () => {
      notifications.forEach((x) => { x.unread = false; });
      pop.querySelectorAll('.notif').forEach((li) => li.classList.remove('is-unread'));
      pop.querySelectorAll('.notif .sr-only').forEach((s) => s.remove());
      mark.disabled = true;
      updateBell();
      N.toast('Todas as notificações foram marcadas como lidas.');
      pop.focus();
    });
    pop.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = N.focusables(pop);
      if (!f.length || (!e.shiftKey && document.activeElement === f[f.length - 1]) || (e.shiftKey && (document.activeElement === f[0] || document.activeElement === pop))) ctl.close(true);
    });
    pop.focus({ preventScroll: true });
  }

  /* ---------- Sidebar: acordeão, trilho e sobreposição ---------- */
  function bindSidebar() {
    const sb = $('#sidebar');
    sb.addEventListener('click', (e) => {
      const gb = e.target.closest('.nav-group-btn');
      if (gb) {
        const wrap = gb.closest('.nav-group');
        const collapsed = wrap.classList.toggle('is-collapsed');
        gb.setAttribute('aria-expanded', String(!collapsed));
        if (rememberGroups()) {
          const saved = N.store.get(groupKey, {});
          saved[gb.dataset.group] = !collapsed;
          N.store.set(groupKey, saved);
        }
        return;
      }
      if (e.target.closest('a.nav-item, a.nav-subitem, a.sb-settings') && sidebarOverlay.isOpen) sidebarOverlay.close({ focus: false });
    });
    sidebarOverlay = N.overlay({
      panel: sb,
      scrim: $('#scrim'),
      openClass: 'is-expanded',
      inert: () => [$('.app-main')],
      initialFocus: () => $('#btn-rail-close'),
      onOpen: () => { $('#btn-rail').setAttribute('aria-expanded', 'true'); sb.setAttribute('role', 'dialog'); sb.setAttribute('aria-modal', 'true'); sb.setAttribute('aria-label', 'Menu lateral'); },
      onClose: () => { $('#btn-rail').setAttribute('aria-expanded', 'false'); sb.removeAttribute('role'); sb.removeAttribute('aria-modal'); sb.removeAttribute('aria-label'); }
    });
    $('#btn-rail').addEventListener('click', (e) => { N.hideTooltip && N.hideTooltip(); sidebarOverlay.open(e.currentTarget); });
    $('#btn-rail-close').addEventListener('click', () => sidebarOverlay.close());
    N.bindMenuTrigger($('#unit-btn'), () => openUnitMenu($('#unit-btn')));
    N.bindMenuTrigger($('#sb-profile'), (up) => openSidebarProfileMenu($('#sb-profile'), up));
  }

  function bindDrawer() {
    const drawer = $('#drawer');
    drawerOverlay = N.overlay({
      panel: drawer,
      scrim: $('#scrim'),
      inert: () => [$('.app-main'), $('#sidebar')],
      initialFocus: () => $('#btn-drawer-close')
    });
    $('#btn-drawer').addEventListener('click', (e) => drawerOverlay.open(e.currentTarget));
    $('#btn-drawer-close').addEventListener('click', () => drawerOverlay.close());
    drawer.addEventListener('click', (e) => {
      // tocar em um destino navega e fecha o drawer
      if (e.target.closest('a.nav-item, a.nav-subitem')) drawerOverlay.close({ focus: false });
      if (e.target.closest('[data-logout]')) { drawerOverlay.close({ focus: false }); N.logout(); }
    });
    N.bindMenuTrigger($('#unit-btn-drawer'), () => openUnitMenu($('#unit-btn-drawer')));
  }

  function bindHeader() {
    N.bindMenuTrigger($('#btn-profile'), () => openProfileMenu($('#btn-profile')));
    $('#btn-search').addEventListener('click', (e) => openSearch(e.currentTarget));
    $('#btn-notif').addEventListener('click', (e) => openNotifications(e.currentTarget));
    const header = $('#app-header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function bindGlobal() {
    // seletores de período e exportação (header e cabeçalho da página no celular)
    document.addEventListener('click', (e) => {
      const p = e.target.closest('[data-period-trigger]');
      if (p) { Shell.openPeriodMenu(p); return; }
      const ex = e.target.closest('[data-action="export"]');
      if (ex) { if (ex.getAttribute('aria-disabled') === 'true') N.toast('Não há dados para exportar nesta página.'); else N.Pages.exportCurrent(); return; }
      const rf = e.target.closest('[data-action="refresh"]');
      if (rf) N.Pages.refresh();
    });
    document.addEventListener('keydown', (e) => {
      const p = e.target.closest && e.target.closest('[data-period-trigger]');
      if (p && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); Shell.openPeriodMenu(p); }
    });
    // atalhos de teclado (visíveis na busca, no botão Atualizar e na página Ajuda)
    document.addEventListener('keydown', (e) => {
      if (document.body.dataset.view !== 'app' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
      if (N.hasPopover() || drawerOverlay.isOpen || sidebarOverlay.isOpen) return;
      if (e.key === '/') { const b = $('#btn-search'); if (b.getClientRects().length) { e.preventDefault(); openSearch(b); } }
      else if (e.key === 'r' || e.key === 'R') { if (N.Pages.canRefresh()) { e.preventDefault(); N.Pages.refresh(); } }
      else if (e.key === '?') { e.preventDefault(); go('#/ajuda'); }
    });
    // ao mudar de faixa de largura, fecha sobreposições abertas
    const reset = () => {
      if (!mqRail.matches && sidebarOverlay.isOpen) sidebarOverlay.close({ focus: false });
      if (!mqMobile.matches && drawerOverlay.isOpen) drawerOverlay.close({ focus: false });
      N.closePopover(false);
    };
    mqRail.addEventListener('change', reset);
    mqMobile.addEventListener('change', reset);
    // tooltips: na sidebar só no modo trilho
    N.initTooltips((el) => !el.closest('.sidebar') || (mqRail.matches && !$('#sidebar').classList.contains('is-expanded')));
    // estado global
    document.addEventListener('nexo:state', (e) => {
      if ('unit' in e.detail) {
        const u = N.unitById(N.state.unit);
        $$('[data-unit-name]').forEach((el) => { el.textContent = u.name; });
        ['#unit-btn', '#unit-btn-drawer'].forEach((s) => $(s).setAttribute('aria-label', 'Unidade: ' + u.name + '. Trocar unidade'));
      }
      Shell.syncPeriod();
    });
  }

  Shell.syncPeriod = function () {
    const p = N.periodById(N.state.period);
    $$('[data-period-label]').forEach((el) => { el.textContent = p.label; });
  };

  Shell.init = function () {
    if (inited) return;
    inited = true;
    buildSidebar();
    buildHeader();
    buildDrawer();
    bindSidebar();
    bindDrawer();
    bindHeader();
    bindGlobal();
    Shell.syncPeriod();
    $('.skip-link').addEventListener('click', (e) => { e.preventDefault(); const m = $('#main'); m.focus(); m.scrollIntoView(); });
  };

  /** Atualiza item ativo, abas/breadcrumb e disponibilidade de período/exportação. */
  Shell.update = function (route, caps) {
    if (sidebarOverlay && sidebarOverlay.isOpen) sidebarOverlay.close({ focus: false });
    if (drawerOverlay && drawerOverlay.isOpen) drawerOverlay.close({ focus: false });
    N.closePopover(false);
    $$('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === route.page;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('[data-nav-tab], [data-tab]').forEach((a) => {
      const on = route.page === 'painel' && (a.dataset.navTab || a.dataset.tab) === route.tab;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const isPainel = route.page === 'painel';
    $('.hdr-tabs').hidden = !isPainel;
    $('.hdr-crumbs').hidden = isPainel;
    if (!isPainel) {
      const info = N.pageInfo(route.page);
      $('[data-crumbs]').innerHTML = '<li>' + esc(info.group) + '</li><li><span aria-current="page">' + esc(info.label) + '</span></li>';
    }
    $$('[data-period-trigger]').forEach((b) => {
      if (caps.period) { b.removeAttribute('aria-disabled'); b.removeAttribute('title'); }
      else { b.setAttribute('aria-disabled', 'true'); b.setAttribute('title', 'O período não se aplica a esta página'); }
    });
    $$('[data-action="export"]').forEach((b) => {
      if (caps.export) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
    });
    Shell.syncPeriod();
  };

  N.Shell = Shell;
})();
