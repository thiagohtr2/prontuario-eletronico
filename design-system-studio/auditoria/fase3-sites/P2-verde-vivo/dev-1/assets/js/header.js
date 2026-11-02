/* Estrutura fixa do site: faixa de anúncio, header de duas linhas (desktop),
   header com busca + faixa de categorias + menu ☰ (celular), dock inferior,
   rodapé, tela de busca, drawers e região de toasts. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var ui = VV.ui, icon = VV.icon, esc = VV.ui.esc;
  var shell = (VV.shell = {});
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var USER = { nome: 'Marina Costa', email: 'marina.costa@exemplo.com', iniciais: 'MC' };

  function addrLabel() { var a = VV.store.state.address; return a.cidade + ' · ' + a.cep; }

  function addrForm(idp) {
    return '<form class="addr-form" id="' + idp + '-form" novalidate>' +
      '<div class="field"><label class="field__label" for="' + idp + '-cep">CEP de entrega</label>' +
      '<div class="addr-form__row"><input class="input" id="' + idp + '-cep" name="cep" inputmode="numeric" autocomplete="postal-code" placeholder="00000-000" maxlength="9" aria-describedby="' + idp + '-msg">' +
      '<button class="btn btn--primary" type="submit">Salvar</button></div>' +
      '<p class="field__msg" id="' + idp + '-msg" aria-live="polite">Usamos o CEP para calcular prazo e frete.</p></div></form>';
  }

  function megaHTML() {
    var cols = VV.MEGA.map(function (g, i) {
      return '<div><p class="mega__title" id="mega-t' + i + '">' + esc(g.title) + '</p><ul class="mega__list" aria-labelledby="mega-t' + i + '">' +
        g.links.map(function (l) { return '<li><a href="' + l.href + '">' + esc(l.label) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('');
    return cols + '<a class="mega__feature" href="#/catalogo?cat=folhagens&amp;extra=pet">' +
      '<span class="mega__feature-media">' + VV.art.square('calathea', 'ceramica') + '</span>' +
      '<span class="mega__feature-k">Destaque da estação</span>' +
      '<span class="mega__feature-t">Calatheas e marantas: folhas que parecem pintadas à mão</span>' +
      '<span class="mega__feature-l">Ver coleção ' + icon('arrow-right', 'icon--16') + '</span></a>';
  }

  shell.render = function () {
    /* ---------- Faixa de anúncio ---------- */
    var ann = $('#announce');
    ann.innerHTML = '<div class="announce__in"><p class="announce__text">Frete grátis acima de R$ 199 · Parcele em até 10x</p>' +
      '<a class="announce__link" href="#/catalogo?cat=plantas">Ver plantas</a>' +
      '<button class="announce__close" type="button" aria-label="Dispensar aviso">' + icon('x', 'icon--18') + '</button></div>';
    if (VV.store.state.announceClosed) ann.hidden = true;

    /* ---------- Header ---------- */
    var navLinks = VV.NAV.map(function (k, i) {
      return '<li' + (i === 3 ? ' class="nav-item--overflow"' : '') + '><a class="nav-link" href="#/catalogo?cat=' + k + '" data-nav="' + k + '">' + esc(VV.CATS[k].label) + '</a></li>';
    }).join('');

    $('#site-header').innerHTML =
      '<div class="hdr-main"><div class="hdr-main__in">' +
        '<a class="logo" href="#/" aria-label="Verde Vivo, página inicial"><span class="logo__mark">' + icon('leaf') + '</span><span class="logo__name">Verde Vivo</span></a>' +
        '<div class="hdr-search search" role="search">' +
          '<form class="search__form" action="#" novalidate><label class="sr-only" for="d-search">Buscar plantas</label>' +
          '<input id="d-search" class="search__input" type="search" placeholder="Buscar plantas…" enterkeyhint="search">' +
          '<button type="button" class="search__icon" aria-label="Buscar">' + icon('search') + '</button>' +
          '<kbd class="search__kbd" aria-hidden="true">' + (isMac ? '⌘K' : 'Ctrl K') + '</kbd></form>' +
          '<div class="search__panel" id="d-search-panel" hidden></div>' +
        '</div>' +
        '<div class="hdr-actions">' +
          '<div class="pop-wrap addr-wrap"><button class="addr-btn" type="button" aria-controls="addr-pop" aria-haspopup="true">' + icon('pin') +
            '<span class="addr-btn__txt"><span class="addr-btn__k">Entregar em</span><span class="addr-btn__v" data-addr>' + esc(addrLabel()) + '</span></span>' +
            '<span class="sr-only">Alterar endereço de entrega</span></button>' +
            '<div class="popover popover--left" id="addr-pop" hidden>' + addrForm('addr-d') + '</div></div>' +
          '<a class="icon-btn fav-btn" href="#/favoritos" data-fav-link>' + icon('heart') + '<span class="badge" data-fav-count hidden></span><span class="sr-only" data-fav-sr>Favoritos</span></a>' +
          '<div class="pop-wrap"><button class="icon-btn" type="button" aria-controls="profile-pop" aria-haspopup="true" aria-label="Menu do perfil"><span class="avatar" aria-hidden="true">' + USER.iniciais + '</span></button>' +
            '<div class="popover popover--right" id="profile-pop" hidden>' +
              '<div class="popover__head"><span class="popover__name">' + esc(USER.nome) + '</span><span class="popover__mail">' + esc(USER.email) + '</span></div>' +
              '<p class="popover__note">Perfil fictício da demonstração.</p><div class="menu-sep"></div>' +
              '<ul class="menu-list">' +
                '<li><button class="menu-item" type="button" data-demo="Meu perfil">' + icon('user') + 'Meu perfil</button></li>' +
                '<li><button class="menu-item" type="button" data-demo="Configurações">' + icon('settings') + 'Configurações</button></li>' +
                '<li><button class="menu-item" type="button" data-demo="Ajuda">' + icon('help') + 'Ajuda</button></li>' +
                '<li><button class="menu-item" type="button" data-demo="Sair">' + icon('logout') + 'Sair</button></li>' +
              '</ul></div></div>' +
          '<a class="icon-btn cart-btn" href="#/sacola" data-cart-link>' + icon('bag') + '<span class="badge" data-cart-count hidden></span><span class="sr-only" data-cart-sr>Sacola</span></a>' +
          '<button class="icon-btn menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="Abrir menu">' + icon('menu', 'icon--24') + '</button>' +
        '</div>' +
      '</div></div>' +
      '<div class="hdr-search-row"><button class="search-trigger" type="button" aria-haspopup="dialog" aria-controls="search-screen">' +
        '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span><span data-trigger-txt>Buscar plantas…</span></button></div>' +
      '<nav class="hdr-nav" aria-label="Principal"><div class="hdr-nav__in">' +
        '<div class="hdr-nav__scroller"><ul class="nav-list">' +
          '<li><button class="nav-link" type="button" id="dep-btn" aria-controls="mega" aria-haspopup="true">Departamentos ' + icon('chevron-down') + '</button></li>' +
          navLinks +
          '<li class="nav-more pop-wrap"><button class="nav-link" type="button" id="more-btn" aria-controls="more-pop" aria-haspopup="true">Mais ' + icon('chevron-down') + '</button>' +
            '<div class="popover popover--left" id="more-pop" hidden><ul class="menu-list"><li><a class="menu-item" href="#/catalogo?cat=atelie" data-nav="atelie">' + icon('scissors') + 'Ateliê</a></li></ul></div></li>' +
        '</ul></div>' +
        '<a class="link-arrow nav-cta" href="#/catalogo?cat=plantas">Escolher minha planta ' + icon('arrow-right', 'icon--18') + '</a>' +
        '<div class="mega" id="mega" hidden>' + megaHTML() + '</div>' +
      '</div></nav>' +
      '<nav class="cat-strip" aria-label="Categorias"><ul class="cat-strip__list">' +
        VV.STRIP.map(function (k) {
          var href = k === 'todas' ? '#/catalogo' : '#/catalogo?cat=' + k;
          return '<li><a class="cat-pill" href="' + href + '" data-strip="' + k + '">' + icon(VV.CATS[k].icon) + '<span>' + esc(VV.CATS[k].label) + '</span></a></li>';
        }).join('') +
      '</ul></nav>';

    /* ---------- Menu ☰ (celular) ---------- */
    var mmGroups = VV.MEGA.map(function (g, i) {
      return '<div><p class="mega__title" id="mm-t' + i + '">' + esc(g.title) + '</p><ul aria-labelledby="mm-t' + i + '">' +
        g.links.map(function (l) { return '<li><a href="' + l.href + '">' + esc(l.label) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('');
    $('#mobile-menu').innerHTML =
      '<div class="mmenu__scrim" data-close></div>' +
      '<div class="mmenu__panel" role="dialog" aria-label="Menu">' +
        '<nav class="mmenu__nav" aria-label="Principal"><ul>' +
          '<li><button class="mmenu__acc" type="button" aria-expanded="false" aria-controls="mm-dep">Departamentos ' + icon('chevron-down') + '</button>' +
            '<div class="mmenu__sub" id="mm-dep" hidden>' + mmGroups + '</div></li>' +
          VV.NAV.map(function (k) { return '<li><a class="mmenu__link" href="#/catalogo?cat=' + k + '" data-nav="' + k + '">' + esc(VV.CATS[k].label) + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<section class="mmenu__addr" aria-label="Endereço de entrega"><div class="mmenu__addr-row">' + icon('pin') +
          '<span class="mmenu__addr-txt"><span class="addr-btn__k">Entregar em</span><span class="addr-btn__v" data-addr>' + esc(addrLabel()) + '</span></span>' +
          '<button class="link-btn" type="button" aria-expanded="false" aria-controls="addr-m-form">Alterar</button></div>' +
          addrForm('addr-m').replace('<form ', '<form hidden ') + '</section>' +
      '</div>';

    /* ---------- Tela de busca (celular) ---------- */
    $('#search-screen').innerHTML =
      '<div class="sscreen__top"><button class="icon-circle" type="button" data-close aria-label="Fechar busca">' + icon('arrow-left') + '</button>' +
        '<div class="search" role="search"><form class="search__form" action="#" novalidate><label class="sr-only" for="m-search">Buscar plantas</label>' +
        '<input id="m-search" class="search__input" type="search" placeholder="Buscar plantas…" enterkeyhint="search">' +
        '<button type="button" class="search__icon" aria-label="Buscar">' + icon('search') + '</button></form></div></div>' +
      '<div class="sscreen__body"><div class="search__panel" id="m-search-panel"></div></div>';

    /* ---------- Dock ---------- */
    $('#dock').innerHTML = '<ul class="dock__list">' +
      [['inicio', '#/', 'home', 'Início'], ['catalogo', '#/catalogo', 'grid', 'Catálogo'], ['favoritos', '#/favoritos', 'heart', 'Favoritos'], ['sacola', '#/sacola', 'bag', 'Sacola']].map(function (d) {
        var badge = d[0] === 'favoritos' ? '<span class="badge" data-fav-count hidden></span>' : d[0] === 'sacola' ? '<span class="badge" data-cart-count hidden></span>' : '';
        return '<li><a class="dock__link" href="' + d[1] + '" data-dock="' + d[0] + '"><span class="dock__ico">' + icon(d[2]) + badge + '</span><span>' + d[3] + '</span></a></li>';
      }).join('') + '</ul>';

    /* ---------- Rodapé ---------- */
    $('#site-footer').innerHTML =
      '<div class="container footer__top">' +
        '<div class="footer__brand"><a class="logo" href="#/" aria-label="Verde Vivo, página inicial"><span class="logo__mark">' + icon('leaf') + '</span><span class="logo__name">Verde Vivo</span></a>' +
          '<p>Viveiro e ateliê de plantas em São Paulo. Loja fictícia criada para demonstração: marca, textos e preços não são reais.</p></div>' +
        '<div class="footer__col"><h2>Loja</h2><ul>' + VV.NAV.map(function (k) { return '<li><a href="#/catalogo?cat=' + k + '">' + esc(VV.CATS[k].label) + '</a></li>'; }).join('') + '</ul></div>' +
        '<div class="footer__col"><h2>Ajuda</h2><ul><li><a href="#/" data-demo="Entregas e frete">Entregas e frete</a></li><li><a href="#/" data-demo="Trocas e devoluções">Trocas e devoluções</a></li><li><a href="#/" data-demo="Guia de cuidados">Guia de cuidados</a></li><li><a href="#/" data-demo="Fale conosco">Fale conosco</a></li></ul></div>' +
        '<div class="footer__col"><h2>Verde Vivo</h2><ul><li><a href="#/" data-demo="Nosso viveiro">Nosso viveiro</a></li><li><a href="#/catalogo?cat=atelie">Oficinas do ateliê</a></li><li><a href="#/" data-demo="Trabalhe conosco">Trabalhe conosco</a></li></ul></div>' +
        '<div class="footer__news"><h2 id="news-title">Guia mensal de cuidados</h2><p>Um e-mail por mês com o que regar, podar e replantar na estação.</p>' +
          '<form class="news-form" id="news-form" novalidate aria-labelledby="news-title"><div class="field"><label class="field__label" for="news-email">Seu e-mail</label>' +
          '<div class="news-form__row"><input class="input" id="news-email" type="email" autocomplete="email" placeholder="voce@exemplo.com" aria-describedby="news-msg"><button class="btn btn--primary" type="submit">Assinar</button></div>' +
          '<p class="field__msg" id="news-msg" aria-live="polite">Sem spam. Para simular erro de envio, use erro@exemplo.com.</p></div></form></div>' +
      '</div>' +
      '<div class="container footer__bottom"><p>© 2026 Verde Vivo. Marca e conteúdo fictícios.</p><ul><li><a href="#/" data-demo="Privacidade">Privacidade</a></li><li><a href="#/" data-demo="Termos de uso">Termos de uso</a></li></ul></div>';
  };

  /* =====================================================================
     Comportamentos
     ===================================================================== */
  shell.init = function () {
    shell.render();
    var header = $('#site-header');

    /* Faixa de anúncio */
    $('.announce__close').addEventListener('click', function () {
      $('#announce').hidden = true;
      VV.store.closeAnnounce();
      $('.logo').focus();
    });

    /* Busca do desktop */
    shell.dSearch = VV.Combobox({ input: $('#d-search'), panel: $('#d-search-panel'), iconSlot: $('.hdr-search .search__icon'),
      onNavigate: function () { $('#d-search').blur(); } });
    $$('.search__form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); }); });

    /* Tela de busca do celular */
    var screen = $('#search-screen'), trigger = $('.search-trigger'), releaseScreen = null;
    shell.mSearch = VV.Combobox({ input: $('#m-search'), panel: $('#m-search-panel'), iconSlot: $('#search-screen .search__icon'), alwaysOpen: true,
      onNavigate: function () { closeScreen(false); },
      onEscape: function () { closeScreen(true); return true; } });
    function openScreen() {
      screen.hidden = false;
      VV.overlayOpen = (VV.overlayOpen || 0) + 1;
      ui.lockScroll();
      releaseScreen = ui.trapFocus([screen]);
      $('#m-search').focus();
      shell.mSearch.render();
    }
    function closeScreen(returnFocus) {
      if (screen.hidden) return;
      screen.hidden = true;
      VV.overlayOpen = Math.max(0, (VV.overlayOpen || 1) - 1);
      ui.unlockScroll();
      if (releaseScreen) releaseScreen();
      if (returnFocus) trigger.focus();
    }
    shell.openSearch = openScreen;
    trigger.addEventListener('click', openScreen);
    screen.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeScreen(true); });

    /* Atalho ⌘K / Ctrl+K */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (ui.isMobile()) openScreen(); else shell.dSearch.focus();
      }
    });

    /* Popovers: endereço, perfil, "Mais" */
    ui.Popover($('.addr-btn'), $('#addr-pop'));
    ui.Popover($('[aria-controls="profile-pop"]'), $('#profile-pop'));
    ui.Popover($('#more-btn'), $('#more-pop'));

    /* Mega menu: clique/teclado (foco no 1º link) + hover com atraso de 150 ms */
    var depBtn = $('#dep-btn'), mega = $('#mega'), navIn = $('.hdr-nav__in');
    var hoverTimer = null, leaveTimer = null, openedByHover = false;
    var megaPop = ui.Popover(depBtn, mega, { manualClick: true, fit: false, onOpen: positionMega, onClose: function () { openedByHover = false; } });
    function positionMega() {
      mega.style.left = '';
      mega.style.transform = '';
      var inR = navIn.getBoundingClientRect(), bR = depBtn.getBoundingClientRect();
      mega.style.left = Math.max(0, bR.left - inR.left) + 'px';
      ui.fitToViewport(mega);
    }
    depBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (megaPop.isOpen && openedByHover) { openedByHover = false; var f = ui.focusables(mega)[0]; if (f) f.focus(); return; }
      megaPop.toggle(true);
    });
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function hoverIn() {
      if (!canHover) return;
      clearTimeout(leaveTimer);
      if (megaPop.isOpen) return;
      hoverTimer = setTimeout(function () { megaPop.open(false); openedByHover = true; }, 150);
    }
    function hoverOut() {
      clearTimeout(hoverTimer);
      if (!openedByHover) return;
      leaveTimer = setTimeout(function () { if (openedByHover) megaPop.close(false); }, 200);
    }
    [depBtn, mega].forEach(function (el) {
      el.addEventListener('mouseenter', hoverIn);
      el.addEventListener('mouseleave', hoverOut);
    });
    mega.addEventListener('click', function (e) { if (e.target.closest('a')) megaPop.close(false); });
    $('#more-pop').addEventListener('click', function (e) { if (e.target.closest('a')) ui.closeAllPopovers(); });

    /* Faixa rolável da linha 2 (768–1023 px): indicação de continuidade */
    var scroller = $('.hdr-nav__scroller');
    function updateFade() {
      var max = scroller.scrollWidth - scroller.clientWidth;
      scroller.classList.toggle('fade-start', scroller.scrollLeft > 4);
      scroller.classList.toggle('fade-end', max > 4 && scroller.scrollLeft < max - 4);
    }
    scroller.addEventListener('scroll', updateFade, { passive: true });
    window.addEventListener('resize', updateFade);
    updateFade();

    /* Menu ☰ do celular */
    var mm = $('#mobile-menu'), toggle = $('.menu-toggle'), releaseMM = null;
    function openMM() {
      ui.closeAllPopovers();
      var bar = $('.hdr-main').getBoundingClientRect();
      mm.style.setProperty('--mm-top', Math.max(0, Math.round(bar.bottom)) + 'px');
      mm.hidden = false;
      void mm.offsetWidth;
      mm.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      toggle.innerHTML = icon('x', 'icon--24');
      VV.overlayOpen = (VV.overlayOpen || 0) + 1;
      ui.lockScroll();
      releaseMM = ui.trapFocus([$('.hdr-main'), mm]);
      var f = ui.focusables(mm)[0];
      if (f) f.focus();
      document.addEventListener('keydown', mmKey);
    }
    function closeMM(returnFocus) {
      if (mm.hidden) return;
      mm.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      toggle.innerHTML = icon('menu', 'icon--24');
      VV.overlayOpen = Math.max(0, (VV.overlayOpen || 1) - 1);
      ui.unlockScroll();
      if (releaseMM) releaseMM();
      document.removeEventListener('keydown', mmKey);
      setTimeout(function () { mm.hidden = true; }, ui.reducedMotion() ? 0 : 230);
      if (returnFocus) toggle.focus();
    }
    function mmKey(e) { if (e.key === 'Escape') { e.preventDefault(); closeMM(true); } }
    shell.closeMobileMenu = closeMM;
    toggle.addEventListener('click', function () { if (mm.hidden || !mm.classList.contains('is-open')) openMM(); else closeMM(true); });
    mm.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { closeMM(true); return; }
      if (e.target.closest('a[href]')) closeMM(false);
      var acc = e.target.closest('[aria-controls]');
      if (acc && (acc.classList.contains('mmenu__acc') || acc.classList.contains('link-btn'))) {
        var sub = document.getElementById(acc.getAttribute('aria-controls'));
        var open = acc.getAttribute('aria-expanded') !== 'true';
        acc.setAttribute('aria-expanded', String(open));
        sub.hidden = !open;
        if (open && sub.querySelector('input')) sub.querySelector('input').focus();
      }
    });
    window.addEventListener('resize', function () { if (!ui.isMobile()) { closeMM(false); closeScreen(false); } });

    /* Formulários de CEP (validação + estados) */
    $$('.addr-form').forEach(function (form) {
      var input = form.querySelector('input'), msg = form.querySelector('.field__msg');
      input.addEventListener('input', function () {
        var d = input.value.replace(/\D/g, '').slice(0, 8);
        input.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
        input.removeAttribute('aria-invalid');
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = input.value.replace(/\D/g, '');
        if (d.length !== 8) {
          input.setAttribute('aria-invalid', 'true');
          msg.className = 'field__msg field__msg--error';
          msg.textContent = 'Digite um CEP com 8 números, por exemplo 01310-100.';
          input.focus();
          return;
        }
        VV.store.setAddress(d);
        msg.className = 'field__msg field__msg--success';
        msg.textContent = 'Endereço atualizado: ' + addrLabel() + '.';
        input.value = '';
        ui.toast('Entrega para ' + addrLabel());
      });
    });
    VV.store.on('address', function () { $$('[data-addr]').forEach(function (el) { el.textContent = addrLabel(); }); });

    /* Ações de demonstração (perfil, links institucionais) */
    document.addEventListener('click', function (e) {
      var d = e.target.closest('[data-demo]');
      if (!d) return;
      e.preventDefault();
      ui.closeAllPopovers();
      ui.demo(d.getAttribute('data-demo'));
    });

    /* Newsletter: validação, carregando, erro e sucesso */
    var news = $('#news-form');
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#news-email'), msg = $('#news-msg'), btn = news.querySelector('button');
      var v = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        input.setAttribute('aria-invalid', 'true');
        msg.className = 'field__msg field__msg--error';
        msg.textContent = 'Informe um e-mail válido, como voce@exemplo.com.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      btn.setAttribute('aria-disabled', 'true'); btn.disabled = true;
      btn.innerHTML = icon('loader', 'icon--spin icon--18') + 'Enviando…';
      msg.className = 'field__msg'; msg.textContent = 'Enviando inscrição…';
      setTimeout(function () {
        btn.disabled = false; btn.removeAttribute('aria-disabled'); btn.textContent = 'Assinar';
        if (/^erro@/i.test(v)) {
          msg.className = 'field__msg field__msg--error';
          msg.textContent = 'Não conseguimos concluir a inscrição agora. Tente novamente em instantes.';
        } else {
          msg.className = 'field__msg field__msg--success';
          msg.textContent = 'Pronto! O próximo guia chega em ' + v + '.';
          input.value = '';
        }
      }, 900);
    });

    /* Contadores (sacola e favoritos) */
    function updateCounts() {
      var c = VV.store.cartCount(), f = VV.store.state.favs.length;
      $$('[data-cart-count]').forEach(function (b) { b.textContent = c > 99 ? '99+' : c; b.hidden = c === 0; });
      $$('[data-fav-count]').forEach(function (b) { b.textContent = f; b.hidden = f === 0; });
      $$('[data-cart-sr]').forEach(function (s) { s.textContent = 'Sacola, ' + c + (c === 1 ? ' item' : ' itens'); });
      $$('[data-fav-sr]').forEach(function (s) { s.textContent = 'Favoritos, ' + f + (f === 1 ? ' produto' : ' produtos'); });
    }
    VV.store.on('cart', updateCounts);
    VV.store.on('favs', updateCounts);
    updateCounts();

    /* Rolagem: sombra após 8 px; linha 2 / faixa recolhe ao descer e volta ao subir */
    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      if (VV.overlayOpen || ui.anyPopoverOpen() || header.contains(document.activeElement) && document.activeElement.matches('.search__input')) { lastY = y; return; }
      var dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      var collapse = dy > 0 && y > 160;
      header.classList.toggle('is-collapsed', collapse);
      document.body.classList.toggle('nav-hidden', collapse);
      lastY = y;
      if (shell.onScroll) shell.onScroll(y);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
      if (shell.onScrollFrame) shell.onScrollFrame(window.scrollY);
    }, { passive: true });
    header.addEventListener('focusin', function () {
      header.classList.remove('is-collapsed');
      document.body.classList.remove('nav-hidden');
    });
  };

  /* Estado ativo da navegação conforme a rota */
  shell.setActive = function (route) {
    var top = null, strip = null;
    if (route.name === 'catalogo') {
      var cat = route.params.get('cat') || 'todas';
      top = VV.topCat(cat);
      strip = VV.CATS[cat] ? cat : 'todas';
    }
    $$('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === top) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var more = $('#more-btn');
    if (more) more.classList.toggle('has-current', top === 'atelie');
    $$('[data-strip]').forEach(function (a) {
      if (a.getAttribute('data-strip') === strip) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    // Se a pílula ativa estiver totalmente fora da faixa (ex.: chegou por outro link),
    // posiciona a faixa sem animação. Ao tocar numa pílula visível, a faixa não se move.
    var list = $('.cat-strip__list'), act = $('.cat-pill[aria-current]');
    if (list && act && list.offsetWidth) {
      var lr = list.getBoundingClientRect(), ar = act.getBoundingClientRect();
      if (ar.right <= lr.left || ar.left >= lr.right) list.scrollLeft += ar.left - lr.left - 16;
    }
    var dock = { landing: 'inicio', catalogo: 'catalogo', produto: 'catalogo', favoritos: 'favoritos', sacola: 'sacola' }[route.name];
    $$('[data-dock]').forEach(function (a) {
      if (a.getAttribute('data-dock') === dock) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var q = route.name === 'catalogo' ? (route.params.get('q') || '') : '';
    if (document.activeElement !== $('#d-search')) shell.dSearch.setValue(q);
    shell.mSearch.setValue(q);
    var t = $('[data-trigger-txt]');
    t.textContent = q || 'Buscar plantas…';
    $('.search-trigger').classList.toggle('has-value', !!q);
    ui.closeAllPopovers();
  };
})();
