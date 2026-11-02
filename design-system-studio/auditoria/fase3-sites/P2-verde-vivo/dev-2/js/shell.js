/* ==========================================================================
   Cabeçalho, navegação desktop/mobile, mega menu, popovers, sacola e rodapé
   ========================================================================== */
(function () {
  'use strict';
  var VV = window.VV;
  var $ = VV.$, $$ = VV.$$, icon = VV.icon;

  var header = $('#site-header');

  /* ---------------------------------------------------------------
     Navegação (linha 2 no computador / faixa de pílulas no celular)
     --------------------------------------------------------------- */
  var cats = VV.categories.filter(function (c) { return c.id !== 'todas'; });
  var navList = $('#nav-list');
  var extraCats = cats.filter(function (c) { return c.id !== 'vasos'; }); // vasos já é item principal

  function li(html, cls) { return '<li' + (cls ? ' class="' + cls + '"' : '') + '>' + html + '</li>'; }
  navList.innerHTML =
    li('<button type="button" class="nav-link" id="btn-mega" aria-expanded="false" aria-controls="mega">Departamentos' + icon('chevron-down') + '</button>') +
    li('<a class="nav-link" href="#/catalogo" data-nav="plantas">Plantas</a>') +
    li('<a class="nav-link" href="#/catalogo?cat=vasos" data-nav="vasos">Vasos</a>') +
    li('<a class="nav-link" href="#/cuidados" data-nav="cuidados">Cuidados</a>') +
    li('<a class="nav-link" href="#/atelie" data-nav="atelie">Ateliê</a>') +
    li('<span class="nav-sep" aria-hidden="true"></span>', 'nav-extra') +
    extraCats.map(function (c) {
      return li('<a class="nav-link" href="#/catalogo?cat=' + c.id + '" data-nav="' + c.id + '">' + VV.esc(c.label) + '</a>', 'nav-extra');
    }).join('') +
    li('<button type="button" class="nav-link" id="btn-more" aria-expanded="false" aria-controls="more-menu">Mais categorias' + icon('chevron-down') + '</button>', 'nav-more');

  var moreMenu = $('#more-menu');
  moreMenu.className = 'popover popover--more';
  moreMenu.setAttribute('aria-label', 'Mais categorias');
  moreMenu.innerHTML = '<ul class="menu-list">' + extraCats.map(function (c) {
    return '<li><a class="menu-item" href="#/catalogo?cat=' + c.id + '">' + VV.esc(c.label) + '</a></li>';
  }).join('') + '</ul>';
  var moreApi = VV.popover($('#btn-more'), moreMenu, { align: 'left' });
  moreMenu.addEventListener('click', function (e) { if (e.target.closest('a')) moreApi.close(); });

  $('#pills').innerHTML = VV.categories.map(function (c) {
    return '<li><a class="pill" href="#/catalogo' + (c.id === 'todas' ? '' : '?cat=' + c.id) + '" data-pill="' + c.id + '">' + icon(c.icon) + '<span>' + VV.esc(c.label) + '</span></a></li>';
  }).join('');

  /* Faixa horizontal rolável: indicação de continuidade */
  var scroller = $('#nav-scroll');
  function updateMore() {
    var more = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft > 4;
    scroller.classList.toggle('has-more', more);
  }
  scroller.addEventListener('scroll', updateMore, { passive: true });
  window.addEventListener('resize', updateMore);
  setTimeout(updateMore, 50);

  /* ---------------------------------------------------------------
     Mega menu (hover com atraso de 150 ms, clique e teclado; Esc fecha)
     --------------------------------------------------------------- */
  var mega = $('#mega'), megaBtn = $('#btn-mega'), nav = $('#hdr-nav');
  var kit = VV.productById('p21');
  function ml(href, label) { return '<li><a class="mega__link" href="' + href + '">' + label + '</a></li>'; }
  mega.innerHTML =
    '<div><h3>Plantas</h3><ul>' + ml('#/catalogo', 'Todas as plantas') + ml('#/catalogo?cat=folhagens', 'Folhagens') + ml('#/catalogo?cat=suculentas', 'Suculentas e cactos') + ml('#/catalogo?cat=floriferas', 'Floríferas') + ml('#/catalogo?cat=ervas', 'Ervas e temperos') + '</ul></div>' +
    '<div><h3>Por cuidado</h3><ul>' + ml('#/catalogo?luz=sol', 'Sol pleno') + ml('#/catalogo?luz=difusa', 'Luz difusa') + ml('#/catalogo?luz=sombra', 'Sombra') + ml('#/catalogo?pet=1', 'Pet friendly') + ml('#/catalogo?cuid=facil', 'Fácil cuidado') + '</ul></div>' +
    '<div><h3>Vasos e kits</h3><ul>' + ml('#/catalogo?cat=vasos', 'Vasos e cachepôs') + ml('#/catalogo?cat=kits', 'Kits do ateliê') + ml('#/catalogo?sort=novidades', 'Novidades') + ml('#/catalogo?sort=preco-asc', 'Menor preço') + '</ul></div>' +
    '<a class="mega__feature" href="#/produto/p21" data-open-product="p21">' +
    '<div class="art-frame">' + VV.art.product(kit, 'main') + '</div>' +
    '<strong>' + VV.esc(kit.name) + '</strong><p>Jiboia, vaso e substrato prontos para presentear.</p>' +
    '<span class="link-arrow" style="min-height:32px">Ver kit ' + icon('arrow-right') + '</span></a>';

  var megaOpen = false, megaTimer = null;
  function placeMega() {
    var nr = nav.getBoundingClientRect(), br = megaBtn.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var w = Math.min(760, vw - 16);
    var left = br.left - nr.left;
    left = Math.max(8 - nr.left, Math.min(left, vw - 8 - w - nr.left));
    mega.style.left = left + 'px';
  }
  function openMega(focusFirst) {
    clearTimeout(megaTimer);
    if (megaOpen) return;
    VV.popoverCloseAll();
    megaOpen = true;
    mega.hidden = false;
    megaBtn.setAttribute('aria-expanded', 'true');
    placeMega();
    if (focusFirst) { var f = $('a', mega); f && f.focus(); }
  }
  function closeMega(returnFocus) {
    clearTimeout(megaTimer);
    if (!megaOpen) return;
    megaOpen = false;
    mega.hidden = true;
    megaBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) megaBtn.focus();
  }
  function schedule(open) {
    clearTimeout(megaTimer);
    megaTimer = setTimeout(function () { open ? openMega(false) : closeMega(); }, 150);
  }
  megaBtn.addEventListener('click', function () { megaOpen ? closeMega() : openMega(true); });
  megaBtn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); openMega(true); }
  });
  [megaBtn, mega].forEach(function (el) {
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') schedule(true); });
    el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') schedule(false); });
  });
  mega.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeMega(true); } });
  mega.addEventListener('click', function (e) { if (e.target.closest('a')) closeMega(); });
  document.addEventListener('pointerdown', function (e) {
    if (megaOpen && !mega.contains(e.target) && !megaBtn.contains(e.target)) closeMega();
  });
  mega.addEventListener('focusout', function (e) {
    if (megaOpen && e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) closeMega();
  });
  window.addEventListener('resize', function () { megaOpen && placeMega(); });

  /* ---------------------------------------------------------------
     Rolagem: sombra após 8 px; linha 2 / faixa recolhem ao descer e voltam ao subir
     --------------------------------------------------------------- */
  var lastY = window.scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, dy = y - lastY;
    header.classList.toggle('is-scrolled', y > 8);
    var short = window.matchMedia('(max-height: 520px)').matches;
    var focusInside = $('#hdr-nav', header).contains(document.activeElement) || $('#hdr-strip', header).contains(document.activeElement);
    if (y <= 8) {
      header.classList.remove('is-collapsed');
    } else if (dy > 6 && y > 96 && !megaOpen && !focusInside) {
      header.classList.add('is-collapsed');
      closeMega();
    } else if (dy < -6 && !short) {
      header.classList.remove('is-collapsed');
    }
    if (Math.abs(dy) > 6) lastY = y;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  // Foco em itens recolhidos reabre a linha (teclado)
  header.addEventListener('focusin', function (e) {
    if (header.classList.contains('is-collapsed') && e.target.closest('.hdr-nav, .hdr-strip')) header.classList.remove('is-collapsed');
  });

  /* ---------------------------------------------------------------
     Faixa de anúncio
     --------------------------------------------------------------- */
  var announce = $('#announce');
  if (VV.session.get('announce-off') === '1') announce.classList.add('is-gone');
  $('#announce-close').addEventListener('click', function () {
    announce.classList.add('is-gone');
    VV.session.set('announce-off', '1');
    var m = $('#main'); m && m.focus({ preventScroll: true });
  });

  /* ---------------------------------------------------------------
     Estado ativo (desktop, pílulas, menu inferior)
     --------------------------------------------------------------- */
  var navLinks = $$('[data-nav]'), pills = $$('[data-pill]'), dockItems = $$('[data-dock]');
  VV.nav = {
    state: { view: 'home', cat: 'todas', section: null },
    set: function (s) {
      for (var k in s) this.state[k] = s[k];
      var st = this.state, active;
      if (st.view === 'catalog') active = st.cat === 'todas' ? 'plantas' : st.cat;
      else active = st.section || null;
      navLinks.forEach(function (a) {
        if (a.getAttribute('data-nav') === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      pills.forEach(function (a) {
        var on = st.view === 'catalog' && a.getAttribute('data-pill') === st.cat;
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      var dockActive = st.view === 'catalog' ? 'plantas' : (st.section || 'home');
      dockItems.forEach(function (a) {
        if (a.getAttribute('data-dock') === dockActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      var cta = $('#hdr-cta');
      if (cta) cta.hidden = st.view === 'catalog';
      $('#brand').toggleAttribute('aria-current', false);
      if (st.view === 'home' && !st.section) $('#brand').setAttribute('aria-current', 'page'); else $('#brand').removeAttribute('aria-current');
    }
  };

  /* ---------------------------------------------------------------
     Ações: favoritos, conta, endereço, sacola
     --------------------------------------------------------------- */
  function updateCounts() {
    var n = VV.cart.count(), cc = $('#cart-count'), cb = $('#btn-cart');
    cc.hidden = n === 0;
    cc.textContent = n > 99 ? '99+' : n;
    cb.setAttribute('aria-label', n ? 'Sacola, ' + n + (n === 1 ? ' item' : ' itens') : 'Sacola, vazia');
    var f = VV.favs.count(), fc = $('#fav-count'), fb = $('#btn-fav');
    fc.hidden = f === 0;
    fc.textContent = f;
    fb.setAttribute('aria-label', f ? 'Favoritos, ' + f + (f === 1 ? ' item' : ' itens') : 'Favoritos');
  }
  VV.on('cart', updateCounts);
  VV.on('favs', updateCounts);
  updateCounts();

  var accountApi = VV.popover($('#btn-account'), $('#pop-account'), { align: 'right' });
  $('#pop-account').addEventListener('click', function (e) {
    var b = e.target.closest('[data-demo]');
    if (!b) return;
    accountApi.close(true);
    VV.toast('“' + b.getAttribute('data-demo') + '” é só uma demonstração: não existe área restrita.', { type: 'info' });
  });

  /* Endereço de entrega (CEP) com validação, carregamento, erro e sucesso */
  var addrBtn = $('#btn-addr'), addrForm = $('#addr-form'), addrIn = $('#addr-cep'), addrMsg = $('#addr-msg');
  var addrApi = VV.popover(addrBtn, $('#pop-addr'), { align: 'right' });
  function renderCep() {
    var c = VV.cep.get();
    $('#addr-label').textContent = c ? c.cep : 'Informe o CEP';
    addrBtn.setAttribute('aria-label', c ? 'Entregar em ' + c.cep + '. Alterar CEP' : 'Informar CEP de entrega');
  }
  renderCep();
  if (VV.cep.get()) addrIn.value = VV.cep.get().cep;
  addrIn.addEventListener('input', function () {
    var d = addrIn.value.replace(/\D/g, '').slice(0, 8);
    addrIn.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    addrIn.removeAttribute('aria-invalid');
    addrMsg.hidden = true;
  });
  addrForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = addrIn.value.replace(/\D/g, '');
    var btn = $('#addr-submit');
    if (d.length !== 8) {
      addrIn.setAttribute('aria-invalid', 'true');
      addrMsg.className = 'msg msg--error';
      addrMsg.textContent = 'CEP inválido. Digite os 8 números, por exemplo 30140-071.';
      addrMsg.hidden = false;
      addrIn.focus();
      return;
    }
    btn.setAttribute('aria-disabled', 'true');
    btn.innerHTML = icon('loader-circle', 'icon--spin') + ' Calculando…';
    setTimeout(function () {
      btn.removeAttribute('aria-disabled');
      btn.textContent = 'Atualizar';
      var days = 2 + (parseInt(d.charAt(0), 10) % 5);
      var cep = d.slice(0, 5) + '-' + d.slice(5);
      VV.cep.set({ cep: cep, days: days });
      renderCep();
      addrMsg.className = 'msg msg--success';
      addrMsg.textContent = 'Entregamos em ' + cep + ' em ' + days + ' a ' + (days + 2) + ' dias úteis.';
      addrMsg.hidden = false;
    }, 700);
  });

  /* Sacola / minicarrinho */
  var cartOv = $('#ov-cart'), cartBody = $('#cart-body'), cartFoot = $('#cart-foot');
  function renderCart() {
    var lines = VV.cart.lines();
    if (!lines.length) {
      cartBody.innerHTML = '<div class="state"><div class="state__icon">' + icon('shopping-bag', 'icon--lg') + '</div><h3>Sua sacola está vazia</h3><p>Escolha uma planta no catálogo e ela aparece aqui.</p></div>';
      cartFoot.innerHTML = '<a class="btn btn--primary btn--pill btn--block" href="#/catalogo" data-close>Ver plantas</a>';
      return;
    }
    cartBody.innerHTML = lines.map(function (l) {
      var p = VV.productById(l.id);
      return '<div class="cart-line" data-id="' + p.id + '"><div class="cart-line__img art-frame">' + VV.art.product(p, 'main') + '</div>' +
        '<div class="cart-line__info"><strong>' + VV.esc(p.name) + '</strong><small>' + VV.esc(VV.money(p.price)) + ' cada</small>' +
        '<div class="cart-line__row"><div class="stepper stepper--sm" role="group" aria-label="Quantidade de ' + VV.esc(p.name) + '">' +
        '<button type="button" data-dec aria-label="Diminuir quantidade">' + icon('minus', 'icon--sm') + '</button><output aria-live="polite">' + l.qty + '</output>' +
        '<button type="button" data-inc aria-label="Aumentar quantidade"' + (l.qty >= Math.min(p.stock, 10) ? ' aria-disabled="true"' : '') + '>' + icon('plus', 'icon--sm') + '</button></div></div></div>' +
        '<div style="display:grid;justify-items:end;gap:4px"><span class="cart-line__price">' + VV.esc(VV.money(p.price * l.qty)) + '</span>' +
        '<button type="button" class="icon-btn" data-remove aria-label="Remover ' + VV.esc(p.name) + ' da sacola">' + icon('trash-2') + '</button></div></div>';
    }).join('');
    var sub = VV.cart.subtotal(), missing = VV.FREE_SHIPPING - sub, pct = Math.min(100, Math.round(sub / VV.FREE_SHIPPING * 100));
    cartFoot.innerHTML =
      '<div class="ship"><span>' + (missing > 0 ? 'Faltam <strong>' + VV.money(missing) + '</strong> para o frete grátis' : '<strong>Frete grátis</strong> garantido nesta compra') + '</span>' +
      '<div class="ship__bar" role="presentation"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="cart-total"><span>Subtotal</span><span>' + VV.money(sub) + '</span></div>' +
      '<button type="button" class="btn btn--primary btn--pill btn--block" id="cart-checkout">Finalizar compra</button>' +
      '<button type="button" class="btn btn--tonal btn--pill btn--block" data-close>Continuar comprando</button>';
  }
  VV.on('cart', function () { if (VV.overlay.isOpen(cartOv) || !cartOv.hidden) renderCart(); });
  VV.openCart = function (trigger) { renderCart(); VV.overlay.open(cartOv, trigger || $('#btn-cart')); };
  $('#btn-cart').addEventListener('click', function () { VV.openCart(this); });
  cartBody.addEventListener('click', function (e) {
    var row = e.target.closest('.cart-line');
    if (!row) return;
    var id = row.getAttribute('data-id'), q = VV.cart.qty(id);
    if (e.target.closest('[data-inc]')) { if (!e.target.closest('[aria-disabled="true"]')) VV.cart.set(id, q + 1); }
    else if (e.target.closest('[data-dec]')) VV.cart.set(id, q - 1);
    else if (e.target.closest('[data-remove]')) { VV.cart.remove(id); VV.toast('Item removido da sacola.'); }
    // devolve o foco ao controle equivalente após re-render
    var again = $('.cart-line[data-id="' + id + '"] ' + (e.target.closest('[data-inc]') ? '[data-inc]' : e.target.closest('[data-dec]') ? '[data-dec]' : ''), cartBody);
    if (again && !e.target.closest('[data-remove]')) again.focus();
    else if (e.target.closest('[data-remove]')) { var nx = $('[data-remove]', cartBody) || $('[data-close]', cartOv.querySelector('.overlay__head')); nx && nx.focus(); }
  });
  cartFoot.addEventListener('click', function (e) {
    if (e.target.closest('#cart-checkout')) VV.toast('Demonstração: o checkout não está disponível nesta versão.', { type: 'info', ms: 4200 });
    var a = e.target.closest('a[data-close]');
    if (a) VV.overlay.close(cartOv);
  });
  VV.sheetDrag(cartOv);

  /* ---------------------------------------------------------------
     Rodapé: newsletter com validação e estados
     --------------------------------------------------------------- */
  var news = $('#news-form'), nIn = $('#news-email'), nMsg = $('#news-msg'), nBtn = $('#news-submit');
  news.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = nIn.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      nIn.setAttribute('aria-invalid', 'true');
      nMsg.className = 'msg msg--error';
      nMsg.textContent = v ? 'Esse e-mail não parece válido. Confira e tente de novo.' : 'Digite seu e-mail para assinar.';
      nMsg.hidden = false;
      nIn.focus();
      return;
    }
    nIn.removeAttribute('aria-invalid');
    nBtn.setAttribute('aria-disabled', 'true');
    nBtn.innerHTML = icon('loader-circle', 'icon--spin') + ' Enviando…';
    nMsg.hidden = true;
    setTimeout(function () {
      nBtn.removeAttribute('aria-disabled');
      nBtn.textContent = 'Assinar';
      nMsg.className = 'msg msg--success';
      nMsg.textContent = 'Pronto! Enviamos uma confirmação para ' + v + '.';
      nMsg.hidden = false;
      nIn.value = '';
    }, 800);
  });
  nIn.addEventListener('input', function () { nIn.removeAttribute('aria-invalid'); nMsg.hidden = true; });
  news.addEventListener('click', function (e) { if (nBtn.getAttribute('aria-disabled') === 'true' && e.target.closest('#news-submit')) e.preventDefault(); });

  /* Campo focado dentro de rodapé/formulários: mantém visível com o teclado virtual */
  document.addEventListener('focusin', function (e) {
    if (VV.isMobile() && e.target.matches('input, select, textarea') && !e.target.closest('.search')) {
      setTimeout(function () { e.target.scrollIntoView({ block: 'center', behavior: VV.reducedMotion() ? 'auto' : 'smooth' }); }, 300);
    }
  });

  /* Link "pular para o conteúdo" (não conflita com o roteador por hash) */
  $('[data-skip]').addEventListener('click', function (e) {
    e.preventDefault();
    $('#main').focus();
  });
})();
