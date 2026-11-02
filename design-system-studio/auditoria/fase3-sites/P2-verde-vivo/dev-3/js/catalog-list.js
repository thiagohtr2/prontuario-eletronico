/* Catálogo: estado dos filtros, busca, grade de cards, estados (carregando, vazio, erro),
   faixa de categorias do celular, blocos de categoria, ampliação (lightbox) e produto. */
(function () {
  'use strict';
  var VV = window.VV;

  var S = { cat: 'todas', q: '', luz: '', porte: '', cuidado: '', preco: '', ord: 'relevancia', erro: false };
  VV.S = S;
  var DEFAULTS = { cat: 'todas', luz: '', porte: '', cuidado: '', preco: '' };
  var loading = false, failed = false, loadSeq = 0;

  var grid = VV.$('#grid');
  var gridState = VV.$('#grid-state');
  var results = VV.$('#results');
  var stripEl = VV.$('#m-cats');
  var tilesEl = VV.$('#cat-tiles');
  var sortEl = VV.$('#sort');
  var filterCount = VV.$('#filter-count');
  var openFilters = VV.$('#open-filters');
  var filterDrawer = VV.$('#filter-drawer');
  var filterForm = VV.$('#filter-form');
  var draft = {};

  VV.cats = function () { return VV.categories.filter(function (c) { return c.key !== 'todas'; }); };
  VV.countCat = function (key) {
    return key === 'todas' ? VV.products.length : VV.products.filter(function (p) { return p.cat === key; }).length;
  };

  VV.matchesQuery = function (p, q) {
    if (!q) return true;
    var hay = VV.norm([p.nome, p.descricao, VV.catName(p.cat), p.luz ? VV.labels.luz[p.luz] : '', VV.labels.cuidado[p.cuidado] || ''].join(' '));
    return VV.norm(q).split(/\s+/).every(function (t) { return t === '' || hay.indexOf(t) !== -1; });
  };

  VV.filtrar = function () {
    var sorters = {
      relevancia: function (a, b) { return b.vendas - a.vendas; },
      menor: function (a, b) { return a.preco - b.preco; },
      maior: function (a, b) { return b.preco - a.preco; },
      nome: function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); }
    };
    var list = VV.products.filter(function (p) {
      if (S.cat !== 'todas' && p.cat !== S.cat) return false;
      if (S.luz && p.luz !== S.luz) return false;
      if (S.porte && p.porte !== S.porte) return false;
      if (S.cuidado && p.cuidado !== S.cuidado) return false;
      if (S.preco === 'ate60' && p.preco > 60) return false;
      if (S.preco === 'de60a120' && (p.preco < 60 || p.preco > 120)) return false;
      if (S.preco === 'acima120' && p.preco <= 120) return false;
      return VV.matchesQuery(p, S.q);
    });
    return list.sort(sorters[S.ord] || sorters.relevancia);
  };

  function activeCount() {
    var n = 0;
    ['cat', 'luz', 'porte', 'cuidado', 'preco'].forEach(function (k) { if (S[k] !== DEFAULTS[k]) n++; });
    return n;
  }

  /* ---------- Faixa de categorias (celular) ---------- */
  function buildStrip() {
    stripEl.innerHTML = VV.categories.map(function (c) {
      return '<button class="pill" type="button" data-cat="' + c.key + '">' + VV.icon(c.icone) +
        '<span>' + VV.esc(c.nome) + '</span></button>';
    }).join('');
  }
  function syncStrip() {
    VV.$$('.pill', stripEl).forEach(function (b) {
      if (b.getAttribute('data-cat') === S.cat) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  /* ---------- Blocos de categoria (ampliação ao clicar) ---------- */
  function buildTiles() {
    tilesEl.innerHTML = VV.cats().map(function (c, i) {
      var n = VV.countCat(c.key);
      return '<button class="cat-tile" type="button" data-lightbox="' + c.key + '" aria-label="Ampliar ' + VV.esc(c.nome) + ', ' + n + ' plantas">' +
        VV.art(c.key, { w: 320, h: 400, tone: (i % 3) + 1 }) +
        '<span class="cat-tile-info"><span class="cat-tile-name">' + VV.esc(c.nome) + '</span>' +
        '<span class="cat-tile-count">' + n + ' plantas</span></span></button>';
    }).join('');
  }

  var lbList = VV.cats(), lbIndex = 0, lbTrigger = null;
  VV.openLightbox = function (key, trigger) {
    lbIndex = Math.max(0, lbList.findIndex(function (c) { return c.key === key; }));
    lbTrigger = trigger;
    renderLightbox();
    VV.open(VV.$('#lightbox'), { trigger: trigger });
  };
  function renderLightbox() {
    var c = lbList[lbIndex];
    VV.$('#lb-title').textContent = c.nome;
    VV.$('#lb-media').innerHTML = VV.art(c.key, { w: 900, h: 675, tone: (lbIndex % 3) + 1, leaves: true });
    var lbCount = VV.$('#lb-count');
    lbCount.setAttribute('aria-live', 'polite');
    lbCount.textContent = (lbIndex + 1) + ' de ' + lbList.length + ' · ' + VV.countCat(c.key) + ' plantas';
    VV.$('#lb-go').setAttribute('data-key', c.key);
  }
  function lbStep(d) {
    lbIndex = (lbIndex + d + lbList.length) % lbList.length;
    renderLightbox();
  }
  VV.$('#lb-prev').addEventListener('click', function () { lbStep(-1); });
  VV.$('#lb-next').addEventListener('click', function () { lbStep(1); });
  VV.$('#lb-go').addEventListener('click', function (e) {
    var key = e.currentTarget.getAttribute('data-key');
    VV.close(VV.$('#lightbox'), { noFocus: true });
    VV.setCat(key);
    var v = VV.$('#vitrine');
    v.scrollIntoView({ behavior: VV.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- Produto (diálogo) ---------- */
  VV.openProduct = function (id, trigger) {
    var p = VV.products.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    VV.$('#pd-cat').textContent = VV.catName(p.cat);
    VV.$('#product-title').textContent = p.nome;
    VV.$('#pd-media').innerHTML = VV.artProduct(p, 480, 360);
    VV.$('#pd-price').textContent = VV.money(p.preco);
    VV.$('#pd-desc').textContent = p.descricao;
    VV.$('#pd-specs').innerHTML = [
      ['Luz', p.luz ? VV.labels.luz[p.luz] : 'Não se aplica'],
      ['Porte', VV.labels.porte[p.porte]],
      ['Cuidado', VV.labels.cuidado[p.cuidado]],
      ['Rega', p.rega]
    ].map(function (kv) { return '<dt>' + kv[0] + '</dt><dd>' + VV.esc(kv[1]) + '</dd>'; }).join('');
    var add = VV.$('#pd-add');
    add.setAttribute('data-id', p.id);
    VV.open(VV.$('#product-dialog'), { trigger: trigger });
  };

  /* ---------- Grade e estados ---------- */
  function card(p) {
    var tag = p.novo ? '<span class="tag">Novo</span>' : '';
    return '<li><article class="card">' +
      '<div class="card-media">' + VV.artProduct(p, 320, 180) + tag + '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-title"><a class="card-link" href="#produto-' + p.id + '" data-produto="' + p.id + '">' + VV.esc(p.nome) + '</a></h3>' +
        '<p class="card-text">' + VV.esc(p.descricao) + '</p>' +
        '<p class="card-price"><strong>' + VV.money(p.preco) + '</strong></p>' +
      '</div>' +
      '<div class="card-foot">' +
        '<span class="card-meta"><span class="meta-ico">' + VV.icon('leaf') + '</span>' + VV.esc(p.rega) + '</span>' +
        '<span class="btn btn-primary card-action" aria-hidden="true">Ver produto</span>' +
      '</div>' +
    '</article></li>';
  }

  var skeleton = (function () {
    var one = '<li aria-hidden="true"><div class="card is-skeleton"><div class="card-media"></div>' +
      '<div class="card-body"><div class="sk-line" style="width:70%"></div><div class="sk-line" style="width:92%"></div>' +
      '<div class="sk-line" style="width:40%"></div></div>' +
      '<div class="card-foot"><div class="sk-line" style="width:45%"></div></div></div></li>';
    return new Array(7).join(one);
  })();

  function plural(n) { return n + (n === 1 ? ' planta' : ' plantas'); }

  function renderGrid() {
    var total = VV.products.length;
    if (loading) {
      grid.innerHTML = skeleton;
      gridState.hidden = true;
      results.textContent = 'Carregando plantas…';
      return;
    }
    if (failed) {
      grid.innerHTML = '';
      gridState.hidden = false;
      gridState.className = 'grid-state is-error';
      gridState.innerHTML = '<h3>Não foi possível carregar as plantas</h3>' +
        '<p>Verifique sua conexão e tente de novo.</p>' +
        '<button class="btn btn-primary" type="button" data-retry>Tentar de novo</button>';
      results.textContent = '';
      return;
    }
    var list = VV.filtrar();
    if (!list.length) {
      grid.innerHTML = '';
      gridState.hidden = false;
      gridState.className = 'grid-state';
      gridState.innerHTML = '<h3>Nenhuma planta encontrada</h3>' +
        '<p>Tente outro termo de busca ou remova alguns filtros.</p>' +
        '<button class="btn btn-soft" type="button" data-reset>Limpar filtros</button>';
    } else {
      gridState.hidden = true;
      gridState.innerHTML = '';
      grid.innerHTML = list.map(card).join('');
    }
    results.textContent = list.length === total ? plural(total) : list.length + ' de ' + plural(total);
    var n = activeCount();
    filterCount.textContent = n;
    filterCount.hidden = n === 0;
  }

  function load() {
    var seq = ++loadSeq;
    loading = true;
    grid.setAttribute('aria-busy', 'true');
    renderGrid();
    setTimeout(function () {
      if (seq !== loadSeq) return;
      loading = false;
      failed = !!S.erro;
      grid.setAttribute('aria-busy', 'false');
      renderGrid();
    }, VV.reducedMotion() ? 120 : 450);
  }

  function syncAll() {
    syncStrip();
    renderGrid();
    if (VV.syncNav) VV.syncNav();
  }

  /* ---------- Ações de filtro (usadas pela busca, categorias e drawer) ---------- */
  VV.setCat = function (key) {
    S.cat = key;
    syncAll();
  };
  VV.setQuery = function (q, source) {
    var startsSearch = !!q.trim() && !S.q.trim();
    S.q = q;
    // Ao iniciar uma busca, ela passa a ser global: volta para "Todas" e limpa os filtros de facetas.
    if (startsSearch) {
      S.cat = DEFAULTS.cat; S.luz = ''; S.porte = ''; S.cuidado = ''; S.preco = '';
      syncStrip();
      if (VV.syncNav) VV.syncNav();
    }
    VV.syncInputs(source);
    renderGrid();
  };
  VV.syncInputs = function (source) {
    ['#q-d', '#q-m'].forEach(function (sel) {
      var el = VV.$(sel);
      if (el && el !== source) el.value = S.q;
    });
  };
  VV.resetFilters = function () {
    S.cat = DEFAULTS.cat; S.luz = ''; S.porte = ''; S.cuidado = ''; S.preco = ''; S.q = '';
    VV.syncInputs();
    syncAll();
  };

  /* ---------- Painel de filtros (drawer) ---------- */
  var FILTER_GROUPS = [
    { name: 'cat', options: [['todas', 'Todas']].concat(VV.cats().map(function (c) { return [c.key, c.nome]; })) },
    { name: 'luz', options: [['', 'Qualquer'], ['sombra', 'Sombra'], ['meia', 'Meia-sombra'], ['sol', 'Sol pleno']] },
    { name: 'porte', options: [['', 'Qualquer'], ['pequeno', 'Pequeno'], ['medio', 'Médio'], ['grande', 'Grande']] },
    { name: 'cuidado', options: [['', 'Qualquer'], ['facil', 'Fácil'], ['moderado', 'Moderado']] },
    { name: 'preco', options: [['', 'Qualquer'], ['ate60', 'Até R$ 60'], ['de60a120', 'R$ 60 a R$ 120'], ['acima120', 'Acima de R$ 120']] }
  ];

  function renderChips() {
    FILTER_GROUPS.forEach(function (g) {
      VV.$('#f-' + g.name).innerHTML = g.options.map(function (o) {
        return '<label class="chip"><input type="radio" name="' + g.name + '" value="' + o[0] + '"' +
          (o[0] === draft[g.name] ? ' checked' : '') + '>' + VV.icon('check') + '<span>' + VV.esc(o[1]) + '</span></label>';
      }).join('');
    });
    syncChips();
  }
  function syncChips() {
    VV.$$('.chip', filterForm).forEach(function (chip) {
      var input = chip.querySelector('input');
      chip.classList.toggle('is-on', input.checked);
    });
  }
  function openFilterDrawer(trigger) {
    draft = { cat: S.cat, luz: S.luz, porte: S.porte, cuidado: S.cuidado, preco: S.preco };
    renderChips();
    VV.open(filterDrawer, { trigger: trigger });
  }

  filterForm.addEventListener('change', function (e) {
    if (e.target.matches('input[type="radio"]')) {
      draft[e.target.name] = e.target.value;
      syncChips();
    }
  });
  VV.$('#f-apply').addEventListener('click', function () {
    S.cat = draft.cat; S.luz = draft.luz; S.porte = draft.porte; S.cuidado = draft.cuidado; S.preco = draft.preco;
    VV.close(filterDrawer);
    syncAll();
  });
  VV.$('#f-clear').addEventListener('click', function () {
    draft = { cat: DEFAULTS.cat, luz: '', porte: '', cuidado: '', preco: '' };
    renderChips();
  });
  openFilters.addEventListener('click', function (e) { openFilterDrawer(e.currentTarget); });

  /* ---------- Eventos de lista ---------- */
  stripEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (!b) return;
    VV.setCat(b.getAttribute('data-cat')); // filtra sem mover a faixa
  });
  tilesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lightbox]');
    if (b) VV.openLightbox(b.getAttribute('data-lightbox'), b);
  });
  grid.addEventListener('click', function (e) {
    var a = e.target.closest('[data-produto]');
    if (!a) return;
    e.preventDefault();
    VV.openProduct(a.getAttribute('data-produto'), a);
  });
  gridState.addEventListener('click', function (e) {
    if (e.target.closest('[data-retry]')) { S.erro = false; load(); }
    if (e.target.closest('[data-reset]')) { VV.resetFilters(); load(); }
  });
  sortEl.addEventListener('change', function () {
    S.ord = sortEl.value;
    renderGrid();
  });

  /* ---------- Arte das seções fixas (placeholders vetoriais) ---------- */
  function fillArt() {
    VV.$('#campaign-bg').innerHTML = VV.art('campanha', { w: 1440, h: 620, tone: 1, leaves: true, base: 0.4 });
    var imgs = VV.$$('.origem-img');
    imgs[0].innerHTML = VV.art('mudas', { w: 480, h: 320, tone: 2, leaves: true });
    imgs[1].innerHTML = VV.art('regador', { w: 480, h: 320, tone: 3, leaves: false });
  }

  /* ---------- Inicialização e rota ---------- */
  buildStrip();
  buildTiles();
  fillArt();
  sortEl.innerHTML = Object.keys(VV.labels.ord).map(function (k) {
    return '<option value="' + k + '">' + VV.labels.ord[k] + '</option>';
  }).join('');
  sortEl.value = S.ord;

  VV.onRoute(function (view, params) {
    if (view !== 'catalogo') return;
    S.cat = params.cat && VV.categories.some(function (c) { return c.key === params.cat; }) ? params.cat : DEFAULTS.cat;
    S.luz = params.luz && VV.labels.luz[params.luz] ? params.luz : '';
    S.porte = params.porte && VV.labels.porte[params.porte] ? params.porte : '';
    S.cuidado = params.cuidado && VV.labels.cuidado[params.cuidado] ? params.cuidado : '';
    S.preco = params.preco && VV.labels.preco[params.preco] ? params.preco : '';
    S.q = params.q || '';
    S.ord = params.ord && VV.labels.ord[params.ord] ? params.ord : 'relevancia';
    S.erro = params.erro === '1';
    sortEl.value = S.ord;
    VV.syncInputs();
    syncStrip();
    if (VV.syncNav) VV.syncNav();
    load();
  });
})();
