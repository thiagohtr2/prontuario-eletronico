/* Interface do catálogo: topbar e mega menu, categorias extras, busca (combobox), conta,
   sacola (minicarrinho), dock do celular, rolagem (sombra, recolher faixas), aviso e newsletter. */
(function () {
  'use strict';
  var VV = window.VV;
  var S = VV.S;
  var $ = VV.$, $$ = VV.$$;

  var topbar = $('#topbar');
  var topNav = $('#topbar-nav');
  var catRow = $('#cat-row');
  var mega = $('#mega-panel');
  var moreBtn = $('#more-btn');
  var moreList = $('#more-list');
  var mTop = $('#m-top');
  var cartDrawer = $('#cart-drawer');
  var cartList = $('#cart-list');
  var cartEmpty = $('#cart-empty');
  var cartTotal = $('#cart-total');
  var checkoutBtn = $('#checkout');
  var checkoutMsg = $('#checkout-msg');
  var accPop = $('#account-pop');
  var accBtns = [$('#account-btn-d'), $('#account-btn-m')];
  var accTrigger = null;
  var cart = [];
  var recents = [];

  /* ---------- Navegação de categorias (desktop) ---------- */
  catRow.innerHTML = VV.categories.map(function (c, i) {
    var extra = i >= 4 ? ' is-extra' : '';
    return '<li class="cat-item' + extra + '"><button class="cat-trigger" type="button" data-cat="' + c.key + '"' +
      (c.grupos.length ? ' aria-expanded="false" aria-controls="mega-panel"' : '') + '>' + VV.esc(c.nome) + '</button></li>';
  }).join('');
  moreList.innerHTML = VV.categories.slice(4).map(function (c) {
    return '<li><button type="button" data-cat="' + c.key + '">' + VV.esc(c.nome) + '</button></li>';
  }).join('');

  function hrefFor(f) {
    var parts = [];
    ['cat', 'luz', 'porte', 'cuidado', 'preco'].forEach(function (k) { if (f[k]) parts.push(k + '=' + encodeURIComponent(f[k])); });
    return '#/catalogo' + (parts.length ? '?' + parts.join('&') : '');
  }
  function linkFiltro(label, f, cls) {
    return '<a class="' + (cls || '') + '" href="' + hrefFor(f) + '" data-filtro="' + encodeURIComponent(JSON.stringify(f)) + '">' + VV.esc(label) + '</a>';
  }
  function megaHTML(cat) {
    var cols = cat.grupos.map(function (g) {
      return '<div><h3 class="mega-title">' + VV.esc(g.titulo) + '</h3><ul class="mega-list">' +
        g.links.map(function (l) { return '<li>' + linkFiltro(l[0], l[1]) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    var d = cat.destaque;
    var card = d ? '<aside class="mega-card"><h3>' + VV.esc(d.titulo) + '</h3><p>' + VV.esc(d.texto) + '</p>' +
      linkFiltro(d.cta, d.filtro, 'btn btn-primary') + '</aside>' : '';
    return '<div class="mega-inner">' + cols + card + '</div>';
  }

  var megaKey = null, megaVia = null, megaTrigger = null, hoverTimer = null;
  function openMega(key, trigger, via) {
    var cat = VV.categories.filter(function (c) { return c.key === key; })[0];
    if (!cat || !cat.grupos.length) return;
    if (megaKey === key && !mega.hidden) {
      if (via === 'click' && megaVia === 'hover') { megaVia = 'click'; focusFirst(); }
      else if (via === 'click') closeMega(true);
      return;
    }
    megaKey = key; megaVia = via; megaTrigger = trigger;
    mega.innerHTML = megaHTML(cat);
    mega.hidden = false;
    $$('.cat-trigger[data-cat]', catRow).forEach(function (b) {
      if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', b === trigger ? 'true' : 'false');
    });
    if (via !== 'hover') focusFirst();
  }
  function focusFirst() {
    var a = mega.querySelector('a');
    if (a) a.focus({ preventScroll: true });
  }
  function closeMega(restore) {
    if (mega.hidden) return;
    var hadFocus = mega.contains(document.activeElement);
    mega.hidden = true;
    megaKey = null; megaVia = null;
    $$('.cat-trigger[aria-expanded]', catRow).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if ((restore || hadFocus) && megaTrigger && VV.visible(megaTrigger)) megaTrigger.focus({ preventScroll: true });
    megaTrigger = null;
  }

  catRow.addEventListener('pointerover', function (e) {
    if (e.pointerType !== 'mouse') return;
    var b = e.target.closest('.cat-trigger[aria-expanded]');
    if (!b) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(function () { openMega(b.getAttribute('data-cat'), b, 'hover'); }, 150);
  });
  topbar.addEventListener('pointerleave', function () {
    clearTimeout(hoverTimer);
    if (megaVia === 'hover') closeMega(false);
  });
  topbar.addEventListener('focusout', function (e) {
    if (e.relatedTarget && !topbar.contains(e.relatedTarget) && !mega.hidden) closeMega(false);
  });

  function setCatFromButton(key) {
    VV.setCat(key);
  }
  catRow.addEventListener('click', function (e) {
    var b = e.target.closest('.cat-trigger[data-cat]');
    if (!b) return;
    var key = b.getAttribute('data-cat');
    if (b.hasAttribute('aria-expanded')) openMega(key, b, 'click');
    else { closeMega(false); setCatFromButton(key); }
  });
  mega.addEventListener('click', function (e) {
    var a = e.target.closest('[data-filtro]');
    if (!a) return;
    e.preventDefault();
    var f = JSON.parse(decodeURIComponent(a.getAttribute('data-filtro')));
    applyFilter(f);
    closeMega(false);
  });

  function applyFilter(f) {
    S.luz = f.luz || ''; S.porte = f.porte || ''; S.cuidado = f.cuidado || ''; S.preco = f.preco || '';
    S.q = '';
    VV.syncInputs();
    VV.setCat(f.cat || 'todas');
    $('#vitrine').scrollIntoView({ behavior: VV.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  /* Mais categorias (1024–1279 px) */
  moreBtn.addEventListener('click', function () {
    var open = moreList.hidden;
    moreList.hidden = !open;
    moreBtn.setAttribute('aria-expanded', String(open));
    if (open) { var f = moreList.querySelector('button'); if (f) f.focus(); }
  });
  moreList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (!b) return;
    closeMore(false);
    VV.setCat(b.getAttribute('data-cat'));
  });
  function closeMore(restore) {
    if (moreList.hidden) return;
    var had = moreList.contains(document.activeElement);
    moreList.hidden = true;
    moreBtn.setAttribute('aria-expanded', 'false');
    if (restore || had) moreBtn.focus();
  }

  /* Indicar largura de overflow da faixa (768–1023 px) */
  function checkOverflow() {
    var w = window.innerWidth;
    topNav.classList.toggle('is-overflowing', w >= 768 && w < 1024 && topNav.scrollWidth > topNav.clientWidth + 4);
  }

  /* ---------- Busca: combobox com sugestões, setas, Enter, Esc ---------- */
  var POPULAR = ['Monstera', 'Suculentas para sol', 'Vasos de terracota'];
  function addRecent(t) {
    t = t.trim();
    if (!t) return;
    recents = [t].concat(recents.filter(function (x) { return x !== t; })).slice(0, 4);
  }

  function buildSuggestions(q) {
    var nq = VV.norm(q);
    var groups = [];
    if (!nq) {
      if (recents.length) {
        groups.push({ title: 'Recentes', items: recents.map(function (t) { return { type: 'term', label: t, icon: 'search' }; }) });
      }
      groups.push({ title: 'Sugestões', items: POPULAR.map(function (t) { return { type: 'term', label: t, icon: 'search' }; }) });
    } else {
      var items = [{ type: 'term', label: 'Buscar por “' + q.trim() + '”', value: q.trim(), icon: 'search' }];
      VV.categories.forEach(function (c) {
        if (c.key !== 'todas' && VV.norm(c.nome).indexOf(nq) !== -1) items.push({ type: 'cat', key: c.key, label: c.nome, icon: c.icone, meta: 'Categoria' });
      });
      VV.products.filter(function (p) { return VV.matchesQuery(p, q); }).slice(0, 5).forEach(function (p) {
        items.push({ type: 'prod', id: p.id, label: p.nome, icon: 'leaf', meta: VV.money(p.preco) });
      });
      groups.push({ title: 'Sugestões', items: items });
    }
    return groups;
  }

  function setupSearch(form) {
    var input = form.querySelector('input');
    var box = form.querySelector('.suggest');
    var isDesktop = form.getAttribute('data-search') === 'desktop';
    var items = [], active = -1, open = false, timer = null;

    function render() {
      var groups = buildSuggestions(input.value);
      items = [];
      var html = '';
      groups.forEach(function (g) {
        html += '<div class="suggest-title" aria-hidden="true">' + VV.esc(g.title) + '</div>';
        g.items.forEach(function (it) {
          var idx = items.length;
          items.push(it);
          html += '<div class="suggest-item" role="option" id="' + input.id + '-opt-' + idx + '" aria-selected="false" data-idx="' + idx + '">' +
            VV.icon(it.icon) + '<span>' + VV.esc(it.label) + '</span>' + (it.meta ? '<small>' + VV.esc(it.meta) + '</small>' : '') + '</div>';
        });
      });
      box.innerHTML = html || '<p class="suggest-empty">Nenhuma sugestão</p>';
      active = -1;
      input.removeAttribute('aria-activedescendant');
    }
    function show() {
      render();
      open = true;
      box.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }
    function close() {
      if (!open) return;
      open = false;
      box.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }
    function move(d) {
      if (!items.length) return;
      active = (active + d + items.length) % items.length;
      $$('.suggest-item', box).forEach(function (el, i) {
        el.setAttribute('aria-selected', i === active ? 'true' : 'false');
        if (i === active) el.scrollIntoView({ block: 'nearest' });
      });
      input.setAttribute('aria-activedescendant', input.id + '-opt-' + active);
    }
    function choose(it) {
      if (!it) return;
      close();
      if (it.type === 'prod') {
        VV.openProduct(it.id, input);
        return;
      }
      if (it.type === 'cat') {
        VV.setQuery('', input);
        VV.setCat(it.key);
      } else {
        var term = it.value || it.label;
        input.value = term;
        VV.setQuery(term, input);
        addRecent(term);
      }
      $('#vitrine').scrollIntoView({ behavior: VV.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    function submit() {
      var v = input.value;
      close();
      VV.setQuery(v, input);
      addRecent(v);
      if (v.trim()) $('#vitrine').scrollIntoView({ behavior: VV.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }

    input.addEventListener('focus', function () { show(); });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var v = input.value;
      if (!open) show(); else render();
      timer = setTimeout(function () { VV.setQuery(v, input); }, 250);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) show();
        move(e.key === 'ArrowDown' ? 1 : -1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (open && active >= 0) choose(items[active]);
        else submit();
      } else if (e.key === 'Escape') {
        if (open) { e.preventDefault(); close(); }
        else if (input.value) { input.value = ''; VV.setQuery('', input); }
      } else if (e.key === 'Tab') {
        close();
      }
    });
    box.addEventListener('mousedown', function (e) { e.preventDefault(); });
    box.addEventListener('click', function (e) {
      var el = e.target.closest('.suggest-item');
      if (el) choose(items[Number(el.getAttribute('data-idx'))]);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    form.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !form.contains(e.relatedTarget)) close();
    });
    form._closeSuggest = close;
    form._isOpen = function () { return open; };
    if (isDesktop) form._desk = true;
  }
  var searchForms = $$('form[data-search]');
  searchForms.forEach(setupSearch);

  // Atalho ⌘K / Ctrl+K (desktop)
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K') && !VV.isMobile()) {
      var v = VV.topLayer();
      if (v) return;
      e.preventDefault();
      var inp = $('#q-d');
      inp.focus();
      inp.select();
    }
  });

  // Botão Buscar do dock: vai ao topo e foca o campo do header móvel
  $('#dock-search').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'instant' });
    var inp = $('#q-m');
    inp.focus({ preventScroll: true });
  });

  /* ---------- Conta (sem login: popover de demonstração) ---------- */
  function positionAcc() {
    var r = accTrigger.getBoundingClientRect();
    var w = accPop.offsetWidth;
    var left = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8));
    accPop.style.left = left + 'px';
    accPop.style.top = (r.bottom + 8) + 'px';
  }
  function openAcc(btn) {
    accTrigger = btn;
    accPop.hidden = false;
    positionAcc();
    accBtns.forEach(function (b) { b.setAttribute('aria-expanded', b === btn ? 'true' : 'false'); });
    var first = accPop.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }
  function closeAcc(restore) {
    if (accPop.hidden) return;
    var had = accPop.contains(document.activeElement);
    accPop.hidden = true;
    accBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if ((restore || had) && accTrigger && VV.visible(accTrigger)) accTrigger.focus();
    accTrigger = null;
  }
  accBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!accPop.hidden && accTrigger === b) closeAcc(true);
      else openAcc(b);
    });
  });

  /* ---------- Sacola ---------- */
  function findProduct(id) {
    return VV.products.filter(function (p) { return p.id === id; })[0];
  }
  function cartCount() {
    return cart.reduce(function (n, i) { return n + i.qty; }, 0);
  }
  function cartSum() {
    return cart.reduce(function (n, i) { return n + findProduct(i.id).preco * i.qty; }, 0);
  }
  function renderCart(focusSel) {
    var n = cartCount();
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      if (el.classList.contains('badge')) el.setAttribute('data-zero', n === 0 ? 'true' : 'false');
    });
    $$('[data-cart-open]').forEach(function (b) {
      b.setAttribute('aria-label', (b.closest('.m-top, .dock') ? 'Sacola' : 'Sacola') + ', ' + n + (n === 1 ? ' item' : ' itens'));
    });
    cartList.innerHTML = cart.map(function (i) {
      var p = findProduct(i.id);
      return '<li class="cart-item" data-id="' + p.id + '">' +
        '<div class="ci-media">' + VV.artProduct(p, 144, 144) + '</div>' +
        '<div style="min-width:0">' +
          '<p class="ci-name">' + VV.esc(p.nome) + '</p>' +
          '<p class="ci-price">' + VV.money(p.preco) + '</p>' +
          '<div class="ci-row">' +
            '<div class="qty">' +
              '<button type="button" data-step="-1" aria-label="Diminuir quantidade de ' + VV.esc(p.nome) + '">' + VV.icon('minus') + '</button>' +
              '<span aria-live="polite">' + i.qty + '</span>' +
              '<button type="button" data-step="1" aria-label="Aumentar quantidade de ' + VV.esc(p.nome) + '">' + VV.icon('plus') + '</button>' +
            '</div>' +
            '<button class="ci-remove" type="button" data-remove>Remover</button>' +
          '</div>' +
        '</div></li>';
    }).join('');
    cartEmpty.hidden = cart.length > 0;
    cartTotal.textContent = VV.money(cartSum());
    checkoutBtn.disabled = cart.length === 0;
    if (focusSel) {
      var el = cartList.querySelector(focusSel);
      if (el) el.focus({ preventScroll: true });
    }
  }
  VV.addToCart = function (id, qty) {
    var it = cart.filter(function (i) { return i.id === id; })[0];
    if (it) it.qty += qty || 1;
    else cart.push({ id: id, qty: qty || 1 });
    renderCart();
  };
  function openCart(trigger) {
    var t = trigger || $$('[data-cart-open]').filter(VV.visible)[0];
    VV.open(cartDrawer, { trigger: t });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cart-open]');
    if (b) openCart(b);
  });
  cartList.addEventListener('click', function (e) {
    var li = e.target.closest('.cart-item');
    if (!li) return;
    var id = li.getAttribute('data-id');
    var item = cart.filter(function (i) { return i.id === id; })[0];
    var step = e.target.closest('[data-step]');
    if (step && item) {
      item.qty = Math.max(1, item.qty + Number(step.getAttribute('data-step')));
      renderCart('[data-id="' + id + '"] [data-step="' + step.getAttribute('data-step') + '"]');
    }
    if (e.target.closest('[data-remove]')) {
      cart = cart.filter(function (i) { return i.id !== id; });
      renderCart();
      if (!cart.length) cartDrawer.focus({ preventScroll: true });
      else $$('[data-remove]', cartList)[0].focus({ preventScroll: true });
    }
  });
  checkoutBtn.addEventListener('click', function () {
    checkoutMsg.textContent = 'Demonstração: o checkout não está disponível neste site.';
  });
  // Produto: "Adicionar à sacola" fecha o diálogo e abre o minicarrinho
  $('#pd-add').addEventListener('click', function (e) {
    var id = e.currentTarget.getAttribute('data-id');
    VV.addToCart(id, 1);
    VV.close($('#product-dialog'), { noFocus: true });
    VV.toast('Adicionado à sacola: ' + findProduct(id).nome);
    openCart();
  });
  renderCart();

  /* ---------- Aviso de frete (desktop) ---------- */
  $('#announce-close').addEventListener('click', function () {
    $('#announce').hidden = true;
  });

  /* ---------- Newsletter ---------- */
  var news = $('#news-form');
  var newsInput = $('#news-email');
  var newsErr = $('#news-erro');
  var newsOk = $('#news-ok');
  news.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = newsInput.value.trim();
    newsOk.hidden = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      newsErr.textContent = 'Informe um e-mail válido, como nome@exemplo.com.';
      newsErr.hidden = false;
      newsInput.setAttribute('aria-invalid', 'true');
      newsInput.focus();
      return;
    }
    newsErr.hidden = true;
    newsInput.removeAttribute('aria-invalid');
    newsOk.textContent = 'Pronto! Demonstração: nenhum e-mail foi enviado.';
    newsOk.hidden = false;
    newsInput.value = '';
  });

  /* ---------- Rolagem: sombra no header, recolher a linha 2 e a faixa de categorias ---------- */
  var lastY = 0, ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    var down = y > lastY;
    topbar.classList.toggle('is-scrolled', y > 8);
    mTop.classList.toggle('is-scrolled', y > 8);
    if (Math.abs(y - lastY) > 4) {
      if (down && y > 120) topbar.classList.add('is-collapsed');
      else if (!down) topbar.classList.remove('is-collapsed');
      document.documentElement.classList.toggle('strip-collapsed', down && y > 120 && VV.isMobile());
      if (!accPop.hidden) closeAcc(false);
      lastY = y;
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', checkOverflow);
  checkOverflow();

  /* ---------- Fechar com Esc e clique fora (popovers) ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (VV.topLayer()) return;
    for (var i = 0; i < searchForms.length; i++) {
      if (searchForms[i]._isOpen && searchForms[i]._isOpen()) { searchForms[i]._closeSuggest(); return; }
    }
    if (!mega.hidden) { e.preventDefault(); closeMega(true); return; }
    if (!moreList.hidden) { e.preventDefault(); closeMore(true); return; }
    if (!accPop.hidden) { e.preventDefault(); closeAcc(true); }
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!mega.hidden && !topbar.contains(t)) closeMega(false);
    if (!moreList.hidden && !$('#more-wrap').contains(t)) closeMore(false);
    if (!accPop.hidden && !accPop.contains(t) && !accBtns.some(function (b) { return b.contains(t); })) closeAcc(false);
    searchForms.forEach(function (f) { if (!f.contains(t) && f._closeSuggest) f._closeSuggest(); });
  });

  /* ---------- Estado de navegação (categoria atual, item do dock) ---------- */
  VV.syncNav = function () {
    $$('.cat-trigger[data-cat]', catRow).forEach(function (b) {
      if (b.getAttribute('data-cat') === S.cat) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    var dockCat = $('#dock [data-dock="catalogo"]');
    if (dockCat) dockCat.setAttribute('aria-current', 'page');
    $$('#dock [data-cart-open]').forEach(function (b) { b.removeAttribute('aria-current'); });
  };

  /* Dock "Catálogo" dentro do catálogo: volta a mostrar tudo */
  $('#dock [data-dock="catalogo"]').addEventListener('click', function (e) {
    if (!$('#view-catalogo').hidden) {
      e.preventDefault();
      VV.resetFilters();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });
  var sendTop = function () { window.scrollTo({ top: 0, behavior: 'instant' }); };
  $$('[data-dock="landing"]').forEach(function (a) { a.addEventListener('click', sendTop); });

  /* Ao trocar de tamanho, fecha o que for só de desktop */
  window.matchMedia('(min-width: 768px)').addEventListener('change', function () {
    closeMega(false);
    closeAcc(false);
  });

  /* Itens que mudam com a rota (categoria atual) já são tratados em catalog-list (VV.syncNav). */
  VV.onRoute(function (view) {
    if (view !== 'catalogo') { closeMega(false); closeAcc(false); }
  });
})();
