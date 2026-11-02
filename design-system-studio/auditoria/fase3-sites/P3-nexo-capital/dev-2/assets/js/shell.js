/* ==========================================================================
   Shell: sidebar integral / rail / drawer, header com abas, menus, busca,
   notificações, período, foco preso, trava de rolagem, comportamento do header.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui, $ = ui.$, $$ = ui.$$, esc = NX.fmt.esc;
  var shell = (NX.shell = {});

  var mqMobile = w.matchMedia('(max-width: 767.98px)');
  var mqTablet = w.matchMedia('(min-width: 768px) and (max-width: 1023.98px)');
  var mqDesktop = w.matchMedia('(min-width: 1024px)');

  var cfg = { onLogout: function () {}, getPeriod: function () { return 'p30'; }, setPeriod: function () {}, onUnit: function () {} };
  var route = null;
  var unit = 0;
  var unread = NX.notifications.length;

  var drawerOpen = false, overlayOpen = false, releaseTrap = null, trigger = null;

  /* ---------- Persistência do estado dos grupos ---------- */
  var COL_KEY = 'nx.nav.collapsed';
  function loadCollapsed() {
    try { return JSON.parse(ui.store.get('localStorage', COL_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveCollapsed(o) { ui.store.set('localStorage', COL_KEY, JSON.stringify(o)); }

  /* ---------- Construção da navegação (fonte única: NX.nav) ---------- */
  function itemHTML(it, variant) {
    var tip = variant === 'sidebar';
    var sub = '';
    if (it.children) {
      sub = '<ul class="nav-sub" aria-label="' + esc(it.label) + ': visões">' + it.children.map(function (c) {
        return '<li><a class="nav-item" href="#/' + c.route + '" data-key="' + it.id + '/' + c.id + '" aria-label="' + esc(c.label) + '"' + (tip ? ' data-tip="' + esc(c.label) + '"' : '') + '>' +
          NX.icon(c.icon, 18) + '<span class="nav-item__label">' + esc(c.label) + '</span></a></li>';
      }).join('') + '</ul>';
    }
    return '<li><a class="nav-item" href="#/' + it.route + '" data-key="' + it.id + '" aria-label="' + esc(it.label) + '"' + (tip ? ' data-tip="' + esc(it.label) + '"' : '') + '>' +
      NX.icon(it.icon, 20) + '<span class="nav-item__label">' + esc(it.label) + '</span></a>' + sub + '</li>';
  }

  function buildNav(container, variant) {
    var collapsed = variant === 'sidebar' ? loadCollapsed() : {};
    var html = '';
    NX.nav.forEach(function (g) {
      var id = variant + '-' + g.id, col = !!collapsed[g.id];
      var title = variant === 'sidebar'
        ? '<button type="button" class="nav-group__toggle" aria-expanded="' + (!col) + '" aria-controls="' + id + '-l"><span>' + esc(g.title) + '</span>' + NX.icon('chevron-down', 14) + '</button>'
        : '<span class="nav-group__label">' + esc(g.title) + '</span>';
      html += '<div class="nav-group' + (col ? ' is-collapsed' : '') + '" data-group="' + g.id + '">' +
        '<h2 class="nav-group__title" id="' + id + '-t">' + title + '</h2>' +
        '<ul class="nav-list" id="' + id + '-l" aria-labelledby="' + id + '-t">' +
        g.items.map(function (it) { return itemHTML(it, variant); }).join('') + '</ul></div>';
    });
    if (variant === 'drawer') {
      html += '<div class="nav-sep" role="separator"></div><ul class="nav-list" aria-label="Configurações e ajuda">' +
        NX.navSecondary.map(function (it) { return itemHTML(it, variant); }).join('') + '</ul>';
    }
    container.innerHTML = html;
  }

  function buildHeaderNav() {
    var tabs = $('#tabs ul');
    tabs.innerHTML = NX.panelViews.map(function (v) {
      return '<li><a class="tab" href="#/' + v.route + '" data-view="' + v.id + '">' + esc(v.label) + '</a></li>';
    }).join('');
  }

  /* ---------- Estado ativo ---------- */
  function syncActive() {
    if (!route) return;
    var key = route.childId ? route.itemId + '/' + route.childId : route.itemId;
    var parentVal = mqDesktop.matches ? 'page' : 'true';
    $$('.nav-item[data-key]').forEach(function (a) {
      var k = a.getAttribute('data-key');
      a.removeAttribute('aria-current');
      if (k === key) a.setAttribute('aria-current', 'page');
      else if (route.childId && k === route.itemId) a.setAttribute('aria-current', parentVal);
    });
    $$('.tab').forEach(function (a) {
      if (route.kind === 'dashboard' && a.getAttribute('data-view') === route.viewId) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function renderCrumbs() {
    var ol = $('#crumbs ol');
    ol.innerHTML = route.crumbs.map(function (c, i) {
      var last = i === route.crumbs.length - 1;
      return '<li><span' + (last ? ' aria-current="page"' : '') + '>' + esc(c) + '</span></li>';
    }).join('');
  }

  /* ---------- Ações do dashboard (período + exportar) ---------- */
  function placeActions() {
    var grp = $('#view-actions'), slot = $('#slot-page-actions'), hdr = $('#header-actions');
    if (mqMobile.matches && slot) { if (grp.parentElement !== slot) slot.appendChild(grp); }
    else if (grp.parentElement !== hdr) hdr.insertBefore(grp, hdr.firstChild);
  }
  shell.beforeRender = function () {
    var grp = $('#view-actions'), hdr = $('#header-actions');
    if (grp.parentElement !== hdr) hdr.insertBefore(grp, hdr.firstChild);
  };
  shell.setRoute = function (r) {
    route = r;
    $('#screen-app').setAttribute('data-module', r.module === 'painel' ? 'painel' : 'other');
    $('#header-title').textContent = r.title;
    $('#view-actions').hidden = r.kind !== 'dashboard';
    renderCrumbs();
    syncActive();
    placeActions();
    $('#period-label').textContent = NX.periodById(cfg.getPeriod()).label;
    if (drawerOpen) closeDrawer(true);
    if (overlayOpen) closeOverlay(true);
    var h = $('#app-header'); h.classList.remove('is-hidden');
  };
  shell.updatePeriodLabel = function () {
    var p = NX.periodById(cfg.getPeriod());
    $('#period-label').textContent = p.label;
    $('#btn-period').setAttribute('aria-label', 'Período: ' + p.label + '. Alterar período');
  };

  /* ---------- Drawer (celular) ---------- */
  function openDrawer(from) {
    if (drawerOpen) return;
    drawerOpen = true;
    trigger = from || $('#btn-menu');
    $('#drawer-root').classList.add('is-open');
    ui.setInert([$('#app-main'), $('#skip-link')], true);
    ui.lockScroll();
    $('#btn-menu').setAttribute('aria-expanded', 'true');
    releaseTrap = ui.trapFocus($('#drawer'));
    $('#drawer-close').focus({ preventScroll: true });
  }
  function closeDrawer(restore) {
    if (!drawerOpen) return;
    drawerOpen = false;
    $('#drawer-root').classList.remove('is-open');
    ui.setInert([$('#app-main'), $('#skip-link')], false);
    ui.unlockScroll();
    $('#btn-menu').setAttribute('aria-expanded', 'false');
    if (releaseTrap) { releaseTrap(); releaseTrap = null; }
    if (restore && trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  }

  /* ---------- Sidebar expandida em sobreposição (tablet) ---------- */
  function openOverlay(from) {
    if (overlayOpen) return;
    overlayOpen = true;
    trigger = from || $('#btn-menu');
    var sb = $('#sidebar');
    sb.classList.add('is-expanded');
    $('#sidebar-scrim').classList.add('is-open');
    ui.setInert([$('#app-main'), $('#skip-link')], true);
    ui.lockScroll();
    $('#btn-menu').setAttribute('aria-expanded', 'true');
    $('#btn-menu').setAttribute('aria-label', 'Fechar menu');
    releaseTrap = ui.trapFocus(sb);
    var first = $('.nav-item[aria-current="page"]', sb) || ui.focusables(sb)[0];
    if (first) first.focus({ preventScroll: true });
  }
  function closeOverlay(restore) {
    if (!overlayOpen) return;
    overlayOpen = false;
    $('#sidebar').classList.remove('is-expanded');
    $('#sidebar-scrim').classList.remove('is-open');
    ui.setInert([$('#app-main'), $('#skip-link')], false);
    ui.unlockScroll();
    $('#btn-menu').setAttribute('aria-expanded', 'false');
    $('#btn-menu').setAttribute('aria-label', 'Abrir menu');
    if (releaseTrap) { releaseTrap(); releaseTrap = null; }
    if (restore && trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    syncActive();
  }

  /* ---------- Menus ---------- */
  function toggleMenu(btn, build) {
    if (btn.getAttribute('aria-expanded') === 'true') { ui.closePopover(true); return; }
    build();
  }

  function go(path) { w.location.hash = '#/' + path; }

  function profileItems(prefs) {
    return [
      { label: 'Meu perfil', icon: 'user', onSelect: function () { go('perfil'); } },
      { label: prefs ? 'Preferências' : 'Configurações', icon: 'settings', onSelect: function () { go('configuracoes'); } }
    ].concat(prefs ? [] : [{ label: 'Ajuda', icon: 'circle-help', onSelect: function () { go('ajuda'); } }]);
  }

  function menuWorkspace() {
    var btn = $('#ws-btn');
    toggleMenu(btn, function () {
      var rail = mqTablet.matches && !$('#sidebar').classList.contains('is-expanded');
      var items = NX.units.map(function (u, i) {
        return { label: u, radio: true, checked: i === unit, onSelect: function () { setUnit(i); } };
      });
      items.push({ sep: true });
      items.push({ label: 'Criar espaço', icon: 'plus', radio: false, onSelect: function () { ui.toast('Criar espaço não faz parte da demonstração.', 'info'); } });
      ui.openMenu(btn, items, { placement: rail ? 'right-start' : 'bottom-start', label: 'Unidades da empresa' });
    });
  }
  function setUnit(i) {
    unit = i;
    $('#ws-unit').textContent = NX.units[i];
    $('#ws-btn').setAttribute('aria-label', 'Nexo Capital, unidade ' + NX.units[i].replace('·', '') + '. Trocar de unidade');
    ui.toast('Unidade alterada: ' + NX.units[i] + '.', 'check');
    cfg.onUnit();
  }

  function menuAvatar() {
    var btn = $('#btn-avatar');
    toggleMenu(btn, function () {
      ui.openMenu(btn, [{ head: { name: NX.user.name, sub: NX.user.email } }]
        .concat(profileItems(false), [{ sep: true }, { label: 'Sair', icon: 'log-out', onSelect: cfg.onLogout }]),
        { placement: 'bottom-end', label: 'Menu do perfil' });
    });
  }

  function menuSidebarMore() {
    var btn = $('#sidebar-more');
    toggleMenu(btn, function () {
      ui.openMenu(btn, profileItems(true).concat([{ sep: true }, { label: 'Sair', icon: 'log-out', onSelect: cfg.onLogout }]),
        { placement: 'top-start', label: 'Menu do perfil' });
    });
  }

  function menuPeriod() {
    var btn = $('#btn-period');
    toggleMenu(btn, function () {
      var cur = cfg.getPeriod();
      ui.openMenu(btn, NX.periods.map(function (p) {
        return { label: p.label, checked: p.id === cur, onSelect: function () { if (p.id !== cur) cfg.setPeriod(p.id); } };
      }), { radio: true, placement: 'bottom-end', label: 'Período' });
    });
  }

  function panelNotifications() {
    var btn = $('#btn-notif');
    toggleMenu(btn, function () {
      var box = d.createElement('div');
      box.className = 'notif';
      box.tabIndex = -1;
      function render() {
        var list = unread ? NX.notifications : [];
        box.innerHTML =
          '<div class="notif__head"><h2 class="notif__title">Notificações</h2>' +
          (unread ? '<button type="button" class="btn btn--ghost" data-read>Marcar como lidas</button>' : '') + '</div>' +
          (list.length ? '<ul>' + list.map(function (n) {
            return '<li class="notif__item">' + NX.icon(n.icon, 16, 'tone-' + n.tone) +
              '<div class="notif__body"><p class="notif__name">' + esc(n.title) + '</p><p class="notif__text">' + esc(n.text) + '</p></div>' +
              '<span class="notif__time">' + esc(n.time) + '</span></li>';
          }).join('') + '</ul>' :
            '<div class="state">' + NX.icon('inbox', 24) + '<p class="state__title">Você está em dia</p><p class="state__text">Não há notificações novas.</p></div>');
      }
      render();
      var pop = ui.openPopover({ anchor: btn, content: box, role: 'dialog', label: 'Notificações', placement: 'bottom-end', width: 'min(360px, calc(100vw - 16px))' });
      box.addEventListener('click', function (e) {
        if (e.target.closest('[data-read]')) {
          unread = 0; render(); updateBell();
          ui.announce('Todas as notificações foram marcadas como lidas.');
          pop.reposition();
          box.focus({ preventScroll: true });
        }
      });
      var f = box.querySelector('button'); (f || box).focus({ preventScroll: true });
    });
  }
  function updateBell() {
    var b = $('#btn-notif');
    b.setAttribute('aria-label', unread ? 'Notificações, ' + unread + (unread === 1 ? ' não lida' : ' não lidas') : 'Notificações, nenhuma não lida');
    $('#notif-dot').hidden = !unread;
  }

  function panelSearch() {
    var btn = $('#btn-search');
    toggleMenu(btn, function () {
      var dests = [];
      NX.nav.forEach(function (g) {
        g.items.forEach(function (it) {
          if (it.children) it.children.forEach(function (c) { dests.push({ label: it.label + ' › ' + c.label, icon: c.icon, route: c.route }); });
          else dests.push({ label: g.title + ' › ' + it.label, icon: it.icon, route: it.route });
        });
      });
      NX.navSecondary.forEach(function (it) { dests.push({ label: it.label, icon: it.icon, route: it.route }); });
      var box = d.createElement('div');
      box.className = 'gsearch';
      box.innerHTML = '<div class="gsearch__field"><label class="sr-only" for="gs-q">Buscar páginas</label>' +
        '<div class="search-field">' + NX.icon('search', 16) + '<input class="input" id="gs-q" type="search" placeholder="Buscar páginas…" autocomplete="off"></div></div>' +
        '<div class="menu" id="gs-list" role="listbox" aria-label="Resultados"></div>';
      var q = $('#gs-q', box), list = $('#gs-list', box);
      function render() {
        var t = q.value.trim().toLowerCase();
        var res = dests.filter(function (x) { return !t || x.label.toLowerCase().indexOf(t) >= 0; });
        list.innerHTML = res.length ? res.map(function (x) {
          return '<a class="menu-item" role="option" href="#/' + x.route + '">' + NX.icon(x.icon, 16) + '<span>' + esc(x.label) + '</span></a>';
        }).join('') : '<p class="state__text gsearch__none">Nenhuma página encontrada.</p>';
      }
      render();
      var pop = ui.openPopover({ anchor: btn, content: box, role: 'dialog', label: 'Buscar', placement: 'bottom-end', width: 'min(360px, calc(100vw - 16px))' });
      q.addEventListener('input', function () { render(); pop.reposition(); });
      box.addEventListener('keydown', function (e) {
        var links = $$('a.menu-item', list), i = links.indexOf(d.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (links[i + 1] || links[0]) && (links[i + 1] || links[0]).focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) q.focus(); else links[i - 1].focus(); }
        else if (e.key === 'Enter' && d.activeElement === q && links[0]) { e.preventDefault(); links[0].click(); }
      });
      box.addEventListener('click', function (e) { if (e.target.closest('a.menu-item')) ui.closePopover(false); });
      q.focus({ preventScroll: true });
    });
  }

  /* ---------- Comportamento do header ---------- */
  function initScroll() {
    var h = $('#app-header'), last = w.scrollY, ticking = false;
    function upd() {
      ticking = false;
      var y = w.scrollY;
      h.classList.toggle('is-scrolled', y > 8);
      if (mqMobile.matches && !drawerOpen) {
        if (y > last + 6 && y > 80) h.classList.add('is-hidden');
        else if (y < last - 6 || y <= 80) h.classList.remove('is-hidden');
      } else h.classList.remove('is-hidden');
      last = y;
    }
    w.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    h.addEventListener('focusin', function () { h.classList.remove('is-hidden'); });
  }

  /* ---------- Inicialização ---------- */
  shell.init = function (options) {
    cfg = Object.assign(cfg, options);
    buildNav($('#sidebar-nav'), 'sidebar');
    buildNav($('#drawer-nav'), 'drawer');
    buildHeaderNav();
    ui.hydrateIcons($('#screen-app'));
    updateBell();
    shell.updatePeriodLabel();

    /* menu hambúrguer: drawer no celular, sidebar em sobreposição no tablet */
    $('#btn-menu').addEventListener('click', function () {
      if (mqMobile.matches) openDrawer(this);
      else if (mqTablet.matches) { if (overlayOpen) closeOverlay(true); else openOverlay(this); }
    });
    $('#drawer-close').addEventListener('click', function () { closeDrawer(true); });
    $('#drawer-scrim').addEventListener('click', function () { closeDrawer(true); });
    $('#sidebar-scrim').addEventListener('click', function () { closeOverlay(true); });
    $('#drawer-logout').addEventListener('click', function () { closeDrawer(false); cfg.onLogout(); });
    $('#drawer-nav').addEventListener('click', function (e) {
      if (e.target.closest('a.nav-item')) { var a = e.target.closest('a.nav-item'); setTimeout(function () { closeDrawer(true); ui.announce('Página: ' + (a.getAttribute('aria-label') || a.textContent.trim())); }, 0); }
    });
    $('#sidebar-nav').addEventListener('click', function (e) {
      var tg = e.target.closest('.nav-group__toggle');
      if (tg) {
        var g = tg.closest('.nav-group'), col = !g.classList.contains('is-collapsed');
        g.classList.toggle('is-collapsed', col);
        tg.setAttribute('aria-expanded', col ? 'false' : 'true');
        var st = loadCollapsed(); st[g.getAttribute('data-group')] = col; saveCollapsed(st);
        return;
      }
      if (e.target.closest('a.nav-item') && overlayOpen) { setTimeout(function () { closeOverlay(true); }, 0); }
    });
    $('#sidebar-settings').addEventListener('click', function () { if (overlayOpen) setTimeout(function () { closeOverlay(true); }, 0); });

    $('#ws-btn').addEventListener('click', menuWorkspace);
    $('#btn-avatar').addEventListener('click', menuAvatar);
    $('#sidebar-more').addEventListener('click', menuSidebarMore);
    $('#btn-period').addEventListener('click', menuPeriod);
    $('#btn-notif').addEventListener('click', panelNotifications);
    $('#btn-search').addEventListener('click', panelSearch);
    $('#btn-export').addEventListener('click', function () {
      if (NX.dashboard.current) NX.dashboard.current.exportCSV();
    });

    d.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || ui.isPopoverOpen()) return;
      if (drawerOpen) { e.preventDefault(); closeDrawer(true); }
      else if (overlayOpen) { e.preventDefault(); closeOverlay(true); }
    });

    function onMq() {
      if (!mqMobile.matches && drawerOpen) closeDrawer(false);
      if (!mqTablet.matches && overlayOpen) closeOverlay(false);
      ui.closePopover(false);
      $('#btn-menu').setAttribute('aria-controls', mqMobile.matches ? 'drawer' : 'sidebar');
      placeActions();
      syncActive();
      $('#app-header').classList.remove('is-hidden');
    }
    [mqMobile, mqTablet, mqDesktop].forEach(function (m) {
      if (m.addEventListener) m.addEventListener('change', onMq); else m.addListener(onMq);
    });
    onMq();
    initScroll();
  };

  shell.isOverlayOpen = function () { return drawerOpen || overlayOpen; };
})(window, document);
