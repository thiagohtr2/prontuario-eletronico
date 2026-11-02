/* ==========================================================================
   Catálogo: filtros, ordenação, grade de cards, painel de filtros (drawer),
   detalhe do produto e estados de carregamento / vazio / erro.
   O estado dos filtros vive na URL (#/catalogo?cat=...&luz=...).
   ========================================================================== */
(function () {
  'use strict';
  var VV = window.VV;
  var $ = VV.$, $$ = VV.$$, icon = VV.icon, esc = VV.esc;

  var root = $('#view-catalog');
  var MAX_PRICE = 250;
  var DEFAULTS = { cat: 'todas', q: '', luz: [], porte: [], cuid: [], pet: false, stock: false, fav: false, max: MAX_PRICE, sort: 'relevancia', estado: '' };

  function clone(s) { return JSON.parse(JSON.stringify(s)); }

  VV.parseCatalogQuery = function (qs) {
    var s = clone(DEFAULTS), p = new URLSearchParams(qs || '');
    var cat = p.get('cat');
    if (cat && VV.categories.some(function (c) { return c.id === cat; })) s.cat = cat;
    s.q = (p.get('q') || '').slice(0, 60);
    ['luz', 'porte', 'cuid'].forEach(function (k) {
      var allowed = k === 'luz' ? VV.LUZ : k === 'porte' ? VV.PORTE : VV.CUID;
      s[k] = (p.get(k) || '').split(',').filter(function (v) { return v in allowed; });
    });
    s.pet = p.get('pet') === '1';
    s.stock = p.get('estoque') === '1';
    s.fav = p.get('fav') === '1';
    var mx = parseInt(p.get('max'), 10);
    if (mx >= 10 && mx < MAX_PRICE) s.max = mx;
    var sort = p.get('sort');
    if (VV.SORTS.some(function (o) { return o.id === sort; })) s.sort = sort;
    var est = p.get('estado');
    if (est === 'carregando' || est === 'vazio' || est === 'erro') s.estado = est;
    return s;
  };
  function serialize(s) {
    var p = [];
    if (s.cat !== 'todas') p.push('cat=' + s.cat);
    if (s.q) p.push('q=' + encodeURIComponent(s.q));
    if (s.luz.length) p.push('luz=' + s.luz.join(','));
    if (s.porte.length) p.push('porte=' + s.porte.join(','));
    if (s.cuid.length) p.push('cuid=' + s.cuid.join(','));
    if (s.pet) p.push('pet=1');
    if (s.stock) p.push('estoque=1');
    if (s.fav) p.push('fav=1');
    if (s.max < MAX_PRICE) p.push('max=' + s.max);
    if (s.sort !== 'relevancia') p.push('sort=' + s.sort);
    if (s.estado) p.push('estado=' + s.estado);
    return '#/catalogo' + (p.length ? '?' + p.join('&') : '');
  }
  VV.catalogHash = serialize;

  function filter(s) {
    var list = VV.products.filter(function (p) {
      if (s.cat !== 'todas' && p.cat !== s.cat) return false;
      if (s.q && !VV.matchQuery(p, s.q)) return false;
      if (s.luz.length && s.luz.indexOf(p.luz) < 0) return false;
      if (s.porte.length && s.porte.indexOf(p.porte) < 0) return false;
      if (s.cuid.length && s.cuid.indexOf(p.cuid) < 0) return false;
      if (s.pet && p.pet !== true) return false;
      if (s.stock && p.stock <= 0) return false;
      if (s.fav && !VV.favs.has(p.id)) return false;
      if (p.price > s.max) return false;
      return true;
    });
    var by = {
      'preco-asc': function (a, b) { return a.price - b.price; },
      'preco-desc': function (a, b) { return b.price - a.price; },
      nome: function (a, b) { return a.name.localeCompare(b.name, 'pt-BR'); },
      novidades: function (a, b) { return (b.tag === 'Novo') - (a.tag === 'Novo') || b.n - a.n; }
    }[s.sort];
    if (by) list.sort(by);
    return list;
  }

  function activeFilterCount(s) {
    return (s.cat !== 'todas' ? 1 : 0) + s.luz.length + s.porte.length + s.cuid.length + (s.pet ? 1 : 0) + (s.stock ? 1 : 0) + (s.fav ? 1 : 0) + (s.max < MAX_PRICE ? 1 : 0);
  }

  /* ---------- Card de produto ---------- */
  function cardHTML(p) {
    var out = p.stock <= 0, last = p.stock > 0 && p.stock <= 3;
    var tag = out ? 'Esgotado' : last ? 'Últimas unidades' : p.tag;
    var tagCls = out ? ' is-off' : last ? ' is-warn' : '';
    var fav = VV.favs.has(p.id);
    return '<li><article class="pcard' + (out ? ' is-out' : '') + '" data-id="' + p.id + '">' +
      '<div class="pcard__media">' + VV.art.product(p, 'main') + VV.art.product(p, 'detail').replace('class="art"', 'class="art art--detail"') +
      '<button type="button" class="icon-btn pcard__fav" data-fav="' + p.id + '" aria-pressed="' + fav + '" aria-label="Favoritar ' + esc(p.name) + '">' + icon('heart') + '</button>' +
      (out
        ? '<button type="button" class="btn btn--pill pcard__quick" aria-disabled="true">Indisponível no momento</button>'
        : '<button type="button" class="btn btn--secondary btn--pill pcard__quick" data-add="' + p.id + '" aria-label="Adicionar ' + esc(p.name) + ' à sacola">' + icon('shopping-bag') + '<span class="pcard__quick-txt">Adicionar à sacola</span></button>') +
      '</div>' +
      '<div class="pcard__body"><span class="pcard__label' + tagCls + '">' + esc(tag) + '</span>' +
      '<h3 class="pcard__title">' + esc(p.name) + '</h3><p class="pcard__sci">' + esc(p.sci) + '</p>' +
      '<p class="pcard__text">' + esc(p.desc) + '</p></div>' +
      '<div class="pcard__foot"><div class="pcard__meta"><strong class="pcard__price">' + VV.money(p.price) + '</strong><span class="pcard__inst">10x de ' + VV.money(p.price / 10) + '</span></div>' +
      '<a class="btn btn--primary btn--pill pcard__cta" href="#/produto/' + p.id + '" data-open-product="' + p.id + '" aria-label="Ver produto: ' + esc(p.name) + '">Ver produto</a></div>' +
      '</article></li>';
  }

  function skeletonHTML(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<li class="sk-card" aria-hidden="true"><div class="skeleton" style="aspect-ratio:16/9"></div><div class="sk-card__body"><div class="skeleton" style="width:30%"></div><div class="skeleton" style="width:70%;height:20px"></div><div class="skeleton" style="width:100%"></div><div class="skeleton" style="width:80%"></div></div></li>';
    return s;
  }

  /* ---------- Estrutura da página (montada uma vez) ---------- */
  var built = false, state = clone(DEFAULTS), loadTimer = null, firstRender = true;
  function build() {
    if (built) return;
    built = true;
    root.innerHTML =
      '<section class="catalog container" aria-labelledby="catalog-title">' +
      '<header class="catalog__head"><p class="eyebrow" id="catalog-eyebrow">Catálogo</p><h1 id="catalog-title" tabindex="-1">Plantas</h1><p id="catalog-sub"></p></header>' +
      '<div class="catalog__toolbar">' +
      '<button type="button" class="btn btn--tonal btn--pill" id="open-filters" aria-haspopup="dialog">' + icon('sliders-horizontal') + '<span>Filtros</span><span class="count" id="filters-count" hidden>0</span></button>' +
      '<p class="catalog__count" id="catalog-count" role="status" aria-live="polite"></p>' +
      '<label class="select"><span class="select__prefix visually-hidden">Ordenar por</span><select id="sort-select" aria-label="Ordenar por">' +
      VV.SORTS.map(function (o) { return '<option value="' + o.id + '">' + esc(o.label) + '</option>'; }).join('') + '</select>' + icon('chevron-down') + '</label>' +
      '</div>' +
      '<ul class="catalog__chips" id="catalog-chips" aria-label="Filtros ativos"></ul>' +
      '<div id="catalog-results" aria-live="off"></div>' +
      '<p class="catalog__demo" id="catalog-demo">Demonstração dos estados da lista: ' +
      '<button type="button" data-estado="carregando">carregando</button>, <button type="button" data-estado="vazio">vazio</button>, <button type="button" data-estado="erro">erro</button>' +
      ' · <button type="button" data-estado="">voltar ao normal</button></p>' +
      '</section>';

    $('#sort-select', root).addEventListener('change', function () {
      var s = clone(state); s.sort = this.value; location.hash = serialize(s);
    });
    $('#open-filters', root).addEventListener('click', function () { openFilters(this); });
    root.addEventListener('click', onClick);
  }

  function chipsFor(s) {
    var c = [];
    function chip(label, key, val) { c.push({ label: label, key: key, val: val }); }
    if (s.cat !== 'todas') chip(VV.catById(s.cat).label, 'cat');
    if (s.q) chip('Busca: “' + s.q + '”', 'q');
    s.luz.forEach(function (v) { chip(VV.LUZ[v], 'luz', v); });
    s.porte.forEach(function (v) { chip('Porte ' + VV.PORTE[v].toLowerCase(), 'porte', v); });
    s.cuid.forEach(function (v) { chip('Cuidado ' + VV.CUID[v].toLowerCase(), 'cuid', v); });
    if (s.pet) chip('Pet friendly', 'pet');
    if (s.stock) chip('Em estoque', 'stock');
    if (s.fav) chip('Favoritos', 'fav');
    if (s.max < MAX_PRICE) chip('Até ' + VV.money(s.max).replace(',00', ''), 'max');
    return c;
  }

  function onClick(e) {
    var t = e.target;
    var fav = t.closest('[data-fav]');
    if (fav) {
      var id = fav.getAttribute('data-fav'), on = VV.favs.toggle(id);
      fav.setAttribute('aria-pressed', on);
      VV.toast(on ? 'Adicionada aos favoritos.' : 'Removida dos favoritos.', { type: 'success' });
      if (state.fav && !on) { var rf = $('[data-fav]', root); (rf || $('#catalog-title', root)).focus(); }
      return;
    }
    var add = t.closest('[data-add]');
    if (add) {
      if (VV.cart.add(add.getAttribute('data-add'), 1)) { VV.openCart(add); }
      return;
    }
    var op = t.closest('[data-open-product]');
    if (op) { e.preventDefault(); VV.openProduct(op.getAttribute('data-open-product'), op); return; }
    var rm = t.closest('[data-remove-chip]');
    if (rm) {
      var s = clone(state), k = rm.getAttribute('data-key'), v = rm.getAttribute('data-val');
      if (k === 'cat') s.cat = 'todas';
      else if (k === 'q') { s.q = ''; VV.search.setValue(''); }
      else if (k === 'max') s.max = MAX_PRICE;
      else if (k === 'pet' || k === 'stock' || k === 'fav') s[k] = false;
      else s[k] = s[k].filter(function (x) { return x !== v; });
      location.hash = serialize(s);
      return;
    }
    var st = t.closest('[data-estado]');
    if (st) {
      var s2 = clone(state); s2.estado = st.getAttribute('data-estado'); location.hash = serialize(s2);
      return;
    }
    if (t.closest('[data-clear-all]')) { var s3 = clone(DEFAULTS); s3.sort = state.sort; VV.search.setValue(''); location.hash = serialize(s3); return; }
    if (t.closest('[data-retry]')) { var s4 = clone(state); s4.estado = ''; location.hash = serialize(s4); }
  }

  /* ---------- Renderização ---------- */
  function render(opts) {
    opts = opts || {};
    build();
    var s = state, cat = VV.catById(s.cat);
    var title = s.q ? 'Resultados da busca' : s.fav ? 'Seus favoritos' : cat.title;
    $('#catalog-title', root).textContent = title;
    $('#catalog-eyebrow', root).textContent = s.cat === 'vasos' || s.cat === 'kits' ? 'Catálogo' : 'Catálogo de plantas';
    $('#catalog-sub', root).textContent = s.q ? 'Mostrando o que combina com “' + s.q + '”.' : s.fav ? 'As plantas que você marcou com o coração.' : cat.sub;
    $('#sort-select', root).value = s.sort;

    var n = activeFilterCount(s), fc = $('#filters-count', root);
    fc.hidden = n === 0; fc.textContent = n;
    $('#open-filters', root).setAttribute('aria-label', n ? 'Filtros, ' + n + (n === 1 ? ' ativo' : ' ativos') : 'Filtros');

    var chips = chipsFor(s);
    $('#catalog-chips', root).innerHTML = chips.map(function (c) {
      return '<li><button type="button" class="chip chip--remove" data-remove-chip data-key="' + c.key + '"' + (c.val ? ' data-val="' + c.val + '"' : '') + ' aria-label="Remover filtro: ' + esc(c.label) + '">' + esc(c.label) + icon('x') + '</button></li>';
    }).join('');

    var res = $('#catalog-results', root), count = $('#catalog-count', root);
    clearTimeout(loadTimer);
    var showLoading = s.estado === 'carregando' || (!opts.instant && !VV.reducedMotion());
    if (s.estado === 'carregando') {
      res.setAttribute('aria-busy', 'true');
      res.innerHTML = '<ul class="grid" aria-label="Carregando produtos">' + skeletonHTML(6) + '</ul>';
      count.textContent = 'Carregando produtos…';
      return;
    }
    if (s.estado === 'erro') {
      res.removeAttribute('aria-busy');
      count.textContent = '';
      res.innerHTML = '<div class="state state--error" role="alert"><div class="state__icon">' + icon('circle-alert', 'icon--lg') + '</div><h2>Não foi possível carregar o catálogo</h2><p>Tivemos um problema de conexão com a vitrine. Suas plantas continuam aqui: tente novamente em instantes.</p><button type="button" class="btn btn--primary btn--pill" data-retry>' + icon('history') + 'Tentar novamente</button></div>';
      return;
    }
    function show() {
      var list = s.estado === 'vazio' ? [] : filter(s);
      res.removeAttribute('aria-busy');
      count.innerHTML = '<strong>' + list.length + '</strong> ' + (list.length === 1 ? 'produto' : 'produtos');
      if (!list.length) {
        res.innerHTML = '<div class="state"><div class="state__icon">' + icon('search', 'icon--lg') + '</div><h2>Nenhuma planta por aqui</h2><p>' +
          (s.fav ? 'Você ainda não favoritou nenhum produto. Toque no coração de um card para guardar.' : 'Nenhum produto combina com esses filtros. Remova algum filtro ou veja o catálogo completo.') +
          '</p><button type="button" class="btn btn--primary btn--pill" data-clear-all>Limpar filtros</button></div>';
        return;
      }
      res.innerHTML = '<ul class="grid" aria-label="Produtos">' + list.map(cardHTML).join('') + '</ul>';
      if (opts.keepFocus) { var f = $('[data-fav]', res); f && f.focus(); }
    }
    if (showLoading && !opts.instant) {
      res.setAttribute('aria-busy', 'true');
      res.innerHTML = '<ul class="grid" aria-label="Carregando produtos">' + skeletonHTML(firstRender ? 6 : 3) + '</ul>';
      count.textContent = 'Atualizando…';
      loadTimer = setTimeout(show, firstRender ? 550 : 320);
    } else {
      show();
    }
    firstRender = false;
  }

  VV.catalog = {
    show: function (qs, opts) {
      var prev = state;
      state = VV.parseCatalogQuery(qs);
      var changedCat = prev.cat !== state.cat;
      VV.search.setValue(state.q);
      VV.nav.set({ view: 'catalog', cat: state.cat });
      render(opts);
      return { changedCat: changedCat };
    },
    state: function () { return clone(state); },
    refresh: function () { if (!root.hidden) render({ instant: true }); }
  };

  /* ---------- Painel de filtros (drawer Soft Pill) ---------- */
  var fOv = $('#ov-filters'), fBody = $('#flt-body'), draft = null;
  function chipBtn(group, val, label, pressed) {
    return '<button type="button" class="chip" data-g="' + group + '" data-v="' + val + '" aria-pressed="' + !!pressed + '">' + esc(label) + '</button>';
  }
  function renderFilters() {
    var d = draft;
    function grp(title, name, map, multi) {
      return '<fieldset class="fgroup"><legend>' + title + '</legend><div class="chips">' + Object.keys(map).map(function (k) { return chipBtn(name, k, map[k], d[name].indexOf(k) > -1); }).join('') + '</div></fieldset>';
    }
    fBody.innerHTML =
      '<fieldset class="fgroup"><legend>Categoria</legend><div class="chips">' + VV.categories.map(function (c) { return chipBtn('cat', c.id, c.label, d.cat === c.id); }).join('') + '</div></fieldset>' +
      grp('Luz', 'luz', VV.LUZ) + grp('Porte', 'porte', VV.PORTE) + grp('Nível de cuidado', 'cuid', VV.CUID) +
      '<fieldset class="fgroup"><legend>Mais opções</legend><div class="chips">' +
      chipBtn('flag', 'pet', 'Pet friendly', d.pet) + chipBtn('flag', 'stock', 'Somente em estoque', d.stock) + chipBtn('flag', 'fav', 'Favoritos', d.fav) + '</div></fieldset>' +
      '<div class="fgroup frange"><label for="flt-max" class="fgroup__label" style="font-weight:650">Preço máximo</label>' +
      '<output id="flt-max-out" for="flt-max">' + (d.max >= MAX_PRICE ? 'Qualquer preço' : 'Até ' + VV.money(d.max).replace(',00', '')) + '</output>' +
      '<input id="flt-max" type="range" min="10" max="' + MAX_PRICE + '" step="10" value="' + d.max + '"><div class="frange__scale"><span>R$ 10</span><span>R$ ' + MAX_PRICE + '+</span></div></div>';
  }
  function openFilters(trigger) {
    draft = clone(state);
    renderFilters();
    VV.overlay.open(fOv, trigger);
  }
  fBody.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    var g = b.getAttribute('data-g'), v = b.getAttribute('data-v');
    if (g === 'cat') draft.cat = v;
    else if (g === 'flag') draft[v] = !draft[v];
    else { var i = draft[g].indexOf(v); if (i > -1) draft[g].splice(i, 1); else draft[g].push(v); }
    var y = fBody.scrollTop;
    renderFilters();
    fBody.scrollTop = y;
    var again = fBody.querySelector('.chip[data-g="' + g + '"][data-v="' + v + '"]');
    again && again.focus();
  });
  fBody.addEventListener('input', function (e) {
    if (e.target.id !== 'flt-max') return;
    draft.max = +e.target.value;
    $('#flt-max-out', fBody).textContent = draft.max >= MAX_PRICE ? 'Qualquer preço' : 'Até ' + VV.money(draft.max).replace(',00', '');
  });
  $('#flt-clear').addEventListener('click', function () {
    var keep = { q: draft.q, sort: draft.sort };
    draft = clone(DEFAULTS); draft.q = keep.q; draft.sort = keep.sort;
    renderFilters();
    var first = $('.chip', fBody); first && first.focus();
  });
  $('#flt-apply').addEventListener('click', function () {
    VV.overlay.close(fOv);
    var h = serialize(draft);
    if (location.hash === h) VV.catalog.show(h.split('?')[1] || '');
    else location.hash = h;
  });
  VV.sheetDrag(fOv);

  /* ---------- Detalhe do produto ---------- */
  var pOv = $('#ov-product'), pBody = $('#pm-body'), pState = { id: null, qty: 1 };
  function renderProduct() {
    var p = VV.productById(pState.id), out = p.stock <= 0, max = Math.min(p.stock, 10);
    var fav = VV.favs.has(p.id);
    function spec(ic, label, val) { return '<div class="pm__spec"><span class="icon-circle">' + icon(ic, 'icon--sm') + '</span><span><small>' + label + '</small><strong>' + esc(val) + '</strong></span></div>'; }
    var specs = '';
    if (p.luz) specs += spec('sun', 'Luz', VV.LUZ[p.luz]);
    if (p.rega) specs += spec('droplets', 'Rega', p.rega);
    if (p.porte) specs += spec('ruler', 'Porte', VV.PORTE[p.porte]);
    if (p.cuid) specs += spec('badge-check', 'Cuidado', VV.CUID[p.cuid]);
    if (p.pet !== null) specs += spec('paw-print', 'Pets', p.pet ? 'Seguro para pets' : 'Tóxica se ingerida');
    specs += spec('package', 'Envio', p.cat === 'vasos' ? 'Embalagem protegida' : 'Caixa com adaptação');
    pBody.innerHTML = '<div class="pm"><div class="pm__media"><div class="art-frame">' + VV.art.product(p, VV.isMobile() ? 'main' : 'tall') + '</div></div>' +
      '<div class="pm__info"><span class="pcard__label' + (out ? ' is-off' : p.stock <= 3 ? ' is-warn' : '') + '" style="justify-self:start">' + esc(out ? 'Esgotado' : p.stock <= 3 ? 'Últimas unidades' : p.tag) + '</span>' +
      '<h2 id="pm-title">' + esc(p.name) + '</h2><p class="pm__sci">' + esc(p.sci) + '</p>' +
      '<p>' + esc(p.desc) + '</p><div class="pm__specs">' + specs + '</div>' +
      '<div class="pm__price"><strong>' + VV.money(p.price) + '</strong><small>ou 10x de ' + VV.money(p.price / 10) + ' sem juros</small></div>' +
      '<div class="pm__buy">' +
      (out ? '' : '<div class="stepper" role="group" aria-label="Quantidade"><button type="button" data-pm-dec aria-label="Diminuir quantidade"' + (pState.qty <= 1 ? ' aria-disabled="true"' : '') + '>' + icon('minus') + '</button><output aria-live="polite">' + pState.qty + '</output><button type="button" data-pm-inc aria-label="Aumentar quantidade"' + (pState.qty >= max ? ' aria-disabled="true"' : '') + '>' + icon('plus') + '</button></div>') +
      (out ? '<button type="button" class="btn btn--pill" aria-disabled="true">Esgotado</button>' : '<button type="button" class="btn btn--primary btn--pill" data-pm-add>' + icon('shopping-bag') + 'Adicionar à sacola</button>') +
      '</div>' +
      '<button type="button" class="chip" data-pm-fav aria-pressed="' + fav + '">' + icon('heart', 'icon--sm') + (fav ? 'Nos favoritos' : 'Favoritar') + '</button>' +
      '</div></div>';
  }
  VV.openProduct = function (id, trigger) {
    if (!VV.productById(id)) return;
    pState = { id: id, qty: 1 };
    renderProduct();
    VV.overlay.open(pOv, trigger);
  };
  pOv.addEventListener('overlay:close', function () {
    if (/^#\/produto\//.test(location.hash)) history.replaceState(null, '', '#/catalogo');
  });
  pBody.addEventListener('click', function (e) {
    var p = VV.productById(pState.id), max = Math.min(p.stock, 10), focusSel = null;
    if (e.target.closest('[data-pm-inc]')) { if (pState.qty < max) pState.qty++; focusSel = '[data-pm-inc]'; }
    else if (e.target.closest('[data-pm-dec]')) { if (pState.qty > 1) pState.qty--; focusSel = '[data-pm-dec]'; }
    else if (e.target.closest('[data-pm-fav]')) {
      var on = VV.favs.toggle(p.id);
      VV.toast(on ? 'Adicionada aos favoritos.' : 'Removida dos favoritos.', { type: 'success' });
      focusSel = '[data-pm-fav]';
      $$('[data-fav="' + p.id + '"]', root).forEach(function (b) { b.setAttribute('aria-pressed', on); });
    } else if (e.target.closest('[data-pm-add]')) {
      if (VV.cart.add(p.id, pState.qty)) {
        var trig = pOv._trigger;
        VV.overlay.close(pOv);
        VV.openCart(trig);
      }
      return;
    } else return;
    renderProduct();
    var f = focusSel && $(focusSel, pBody);
    f && f.focus();
  });
  VV.sheetDrag(pOv);

  VV.on('favs', function () { if (!root.hidden && state.fav) render({ instant: true }); });
})();
