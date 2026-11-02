/* Páginas da demonstração: início (landing), catálogo, produto,
   favoritos, sacola e página não encontrada. Inclui os drawers de
   filtros e do minicarrinho. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var ui = VV.ui, icon = VV.icon, esc = VV.ui.esc;
  var pages = (VV.pages = {});
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }

  /* ---------- Card de produto do catálogo (Soft Pill) ---------- */
  VV.cardHTML = function (p) {
    var tag = VV.tagOf(p), inst = VV.installments(p.preco), fav = VV.store.isFav(p.id);
    return '<article class="pcard">' +
      '<div class="pcard__media">' + VV.art.card(p) + '</div>' +
      '<div class="pcard__body">' +
        '<span class="tag ' + tag.cls + '">' + icon('leaf') + esc(tag.label) + '</span>' +
        '<h3 class="pcard__title"><a class="pcard__link" href="#/produto/' + p.id + '">' + esc(p.nome) + '</a></h3>' +
        '<p class="pcard__text">' + esc(p.resumo) + '</p>' +
        '<div class="pcard__foot"><p class="pcard__meta"><span class="price">' + VV.fmt(p.preco) +
          (p.precoDe ? '<s><span class="sr-only">Preço anterior: </span>' + VV.fmt(p.precoDe) + '</s>' : '') + '</span>' +
          '<span class="inst">' + (inst.n > 1 ? 'ou ' + inst.n + 'x de ' + VV.fmt(inst.valor) + ' sem juros' : 'à vista no Pix ou cartão') + '</span></p>' +
          '<span class="sp-btn sp-btn--primary pcard__cta" aria-hidden="true">Ver produto</span></div>' +
      '</div>' +
      '<button class="icon-circle pcard__fav" type="button" data-fav="' + p.id + '" aria-pressed="' + fav + '" aria-label="Favoritar ' + esc(p.nome) + '">' + icon('heart') + '</button>' +
      '</article>';
  };
  function gridHTML(list) {
    return '<ul class="pgrid">' + list.map(function (p) { return '<li>' + VV.cardHTML(p) + '</li>'; }).join('') + '</ul>';
  }
  function skeletonHTML(n) {
    var c = '<li><div class="pcard pcard--skeleton" aria-hidden="true"><div class="pcard__media"></div><div class="pcard__body">' +
      '<span class="sk" style="width:84px;height:22px"></span><span class="sk" style="width:62%;height:18px"></span>' +
      '<span class="sk" style="width:100%;height:12px"></span><span class="sk" style="width:90%;height:12px"></span>' +
      '<div class="pcard__foot"><span class="sk" style="width:90px;height:20px"></span><span class="sk" style="width:116px;height:42px"></span></div></div></div></li>';
    var s = '';
    for (var i = 0; i < n; i++) s += c;
    return '<ul class="pgrid">' + s + '</ul><p class="sr-only" role="status">Carregando produtos…</p>';
  }
  function stateHTML(o) {
    return '<div class="state" role="' + (o.error ? 'alert' : 'status') + '"><span class="icon-circle' + (o.error ? ' icon-circle--error' : '') + '" style="width:56px;height:56px">' + icon(o.icon, 'icon--24') + '</span>' +
      '<h2 class="state__title">' + esc(o.title) + '</h2><p class="state__text">' + esc(o.text) + '</p>' +
      (o.actions ? '<div class="state__actions">' + o.actions + '</div>' : '') + '</div>';
  }

  /* Favoritar (delegação global) */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    var id = b.getAttribute('data-fav'), p = VV.findProduct(id);
    var on = VV.store.toggleFav(id);
    $$('[data-fav="' + id + '"]').forEach(function (x) { x.setAttribute('aria-pressed', String(on)); });
    ui.toast(on ? p.nome + ' foi para os favoritos' : p.nome + ' saiu dos favoritos', 'heart');
    if (VV.route && VV.route.name === 'favoritos' && !on) pages.favoritos.refresh(true);
  });

  /* =====================================================================
     INÍCIO — landing "Folha Viva" adaptada à Verde Vivo
     ===================================================================== */
  function countWhere(fn) { return VV.PRODUCTS.filter(fn).length; }
  pages.landing = {
    title: 'Verde Vivo — plantas que transformam cantos em jardins',
    render: function () {
      var nLuz = countWhere(function (p) { return p.cat === 'plantas' && p.luz && (p.luz.indexOf('sombra') > -1 || p.luz.indexOf('meia-sombra') > -1); });
      var nRega = countWhere(function (p) { return p.cat === 'plantas' && p.rega === 'pouca'; });
      var nPet = countWhere(function (p) { return p.cat === 'plantas' && p.pet; });
      var cards = [
        { k: plural(nLuz, 'planta', 'plantas'), t: 'Pouca luz', d: 'Zamioculca, jiboia e espada-de-são-jorge vivem bem longe da janela, em corredores e escritórios.', href: '#/catalogo?cat=plantas&luz=sombra,meia-sombra', art: ['zz', 'ceramica', 'Ilustração: zamioculca em vaso de cerâmica clara'] },
        { k: plural(nRega, 'planta', 'plantas'), t: 'Pouca rega', d: 'Suculentas e cactos que perdoam quem esquece o regador por uma ou duas semanas.', href: '#/catalogo?cat=plantas&rega=pouca', art: ['cactus', 'terracota', 'Ilustração: cacto mandacaru em vaso de terracota'] },
        { k: plural(nPet, 'planta', 'plantas'), t: 'Casa com pets', d: 'Espécies atóxicas para cães e gatos, como pilea, maranta, calathea e palmeira-areca.', href: '#/catalogo?cat=plantas&extra=pet', art: ['pilea', 'terracota', 'Ilustração: pilea em vaso de terracota'] }
      ];
      return '<div class="landing">' +
        '<section class="hero container" aria-labelledby="hero-title"><div class="grid12">' +
          '<div class="hero__head"><p class="eyebrow hero__eyebrow">Viveiro e ateliê de plantas</p>' +
          '<h1 class="hero__title" id="hero-title" tabindex="-1">Plantas que <em>transformam</em> cantos em jardins</h1></div>' +
          '<div class="hero__text"><p>Cultivamos cada espécie no nosso viveiro e enviamos com vaso, substrato certo e um guia de cuidados. Você escolhe pela luz da sua casa; a gente cuida do resto.</p>' +
          '<a class="link-arrow hero__cta" href="#/catalogo?cat=plantas">Escolher minha planta ' + icon('arrow-right') + '</a></div>' +
          '<div class="hero__tall reveal">' + VV.art.heroTall() + '</div>' +
          '<div class="hero__small reveal">' + VV.art.heroLeaves() + '</div>' +
        '</div></section>' +

        '<section class="stagger container" aria-labelledby="col-title"><div class="grid12">' +
          '<div class="stagger__head"><h2 id="col-title">Para cada canto, uma planta certa</h2><p>Comece pela rotina e pela luz da sua casa. Cada coleção abre o catálogo já filtrado.</p></div>' +
          '<ul class="stagger__list">' + cards.map(function (c) {
            return '<li><article class="ccard"><div class="ccard__media reveal">' + VV.art.square(c.art[0], c.art[1], c.art[2]) + '</div>' +
              '<p class="ccard__k">' + c.k + '</p><h3 class="ccard__title">' + c.t + '</h3><p class="ccard__text">' + c.d + '</p>' +
              '<a class="link-arrow" href="' + c.href + '">Ver coleção<span class="sr-only"> ' + c.t + '</span> ' + icon('arrow-right', 'icon--18') + '</a></article></li>';
          }).join('') + '</ul>' +
        '</div></section>' +

        '<section class="l-section container" aria-label="Citação">' +
          '<figure class="quote"><blockquote><p>“Uma planta não decora a casa: ela muda o ritmo de quem mora nela. Regar vira pausa; uma folha nova vira notícia.”</p></blockquote>' +
          '<figcaption>— <strong>Helena Prado</strong>, paisagista do Ateliê Verde Vivo</figcaption></figure>' +
        '</section>' +

        '<section class="bleed l-section l-section--flush" aria-labelledby="bleed-title">' +
          '<div class="bleed__text"><p class="eyebrow">Do viveiro para a sua casa</p><h2 id="bleed-title">Plantas que saem do viveiro na semana do envio</h2>' +
          '<p>Nada fica parado em depósito. Cada pedido é separado no viveiro, aclimatado à meia-sombra e embalado em caixa com encaixes de papelão reciclado.</p>' +
          '<ul class="bleed__list">' +
            '<li><span class="icon-circle icon-circle--sm">' + icon('droplet') + '</span><span>Rega e adubação feitas antes de embalar.</span></li>' +
            '<li><span class="icon-circle icon-circle--sm">' + icon('refresh') + '</span><span>Troca garantida em 7 dias se a planta chegar danificada.</span></li>' +
            '<li><span class="icon-circle icon-circle--sm">' + icon('sprout') + '</span><span>Guia de cuidados impresso e suporte do ateliê por mensagem.</span></li>' +
          '</ul><p><a class="link-underline" href="#/catalogo?cat=cuidados">Ver itens de cuidado</a></p></div>' +
          '<div class="bleed__media reveal">' + VV.art.scene() + '</div>' +
        '</section>' +

        '<section class="container l-section l-section--flush" aria-labelledby="final-title"><div class="final">' +
          '<h2 id="final-title">Ainda em dúvida? Comece por uma planta fácil.</h2>' +
          '<p>Separamos espécies que aguentam esquecimento, pouca luz e mudança de endereço. Todas chegam com guia de cuidados.</p>' +
          '<div class="final__actions"><a class="btn btn--primary" href="#/catalogo?cat=plantas&amp;extra=facil">Ver plantas fáceis de cuidar</a>' +
          '<a class="link-underline" href="#/catalogo">Ver todo o catálogo</a></div>' +
        '</div></section>' +
      '</div>';
    },
    mount: function () {
      /* Fade de 300 ms ao entrar na tela (IntersectionObserver) */
      if ('IntersectionObserver' in window && !ui.reducedMotion()) {
        document.documentElement.classList.add('js-reveal');
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
        }, { rootMargin: '0px 0px -40px 0px' });
        $$('.reveal').forEach(function (el) { io.observe(el); });
        pages.landing._io = io;
      }
      /* Parallax leve na imagem alta (desativado com prefers-reduced-motion) */
      var tall = $('.hero__tall');
      VV.shell.onScrollFrame = function (y) {
        if (!tall || ui.reducedMotion() || ui.isMobile()) return;
        tall.style.setProperty('--parallax', Math.round(Math.min(y, 600) * -0.05) + 'px');
      };
    },
    unmount: function () {
      VV.shell.onScrollFrame = null;
      if (pages.landing._io) pages.landing._io.disconnect();
    }
  };

  /* =====================================================================
     CATÁLOGO
     ===================================================================== */
  function readState(params) {
    var st = { cat: params.get('cat') || 'todas', q: (params.get('q') || '').trim(), sort: params.get('sort') || 'relevancia', f: {}, simular: params.get('simular') };
    if (!VV.CATS[st.cat]) st.cat = 'todas';
    VV.FILTERS.forEach(function (g) {
      var v = params.get(g.key);
      var vals = v ? v.split(',').filter(function (x) { return g.options.some(function (o) { return o.v === x; }); }) : [];
      if (vals.length) st.f[g.key] = vals;
    });
    return st;
  }
  function buildHash(st) {
    var p = [];
    if (st.cat && st.cat !== 'todas') p.push('cat=' + st.cat);
    if (st.q) p.push('q=' + encodeURIComponent(st.q));
    VV.FILTERS.forEach(function (g) { if (st.f[g.key] && st.f[g.key].length) p.push(g.key + '=' + st.f[g.key].join(',')); });
    if (st.sort && st.sort !== 'relevancia') p.push('sort=' + st.sort);
    return '#/catalogo' + (p.length ? '?' + p.join('&') : '');
  }
  function filterProducts(st, ignoreFilters) {
    var base = st.q ? VV.searchProducts(st.q) : VV.PRODUCTS.slice();
    var list = base.filter(function (p) {
      if (!VV.matchCat(p, st.cat)) return false;
      if (ignoreFilters) return true;
      return VV.FILTERS.every(function (g) { var v = st.f[g.key]; return !v || !v.length || g.test(p, v); });
    });
    var s = st.sort;
    if (s === 'menor-preco') list.sort(function (a, b) { return a.preco - b.preco; });
    else if (s === 'maior-preco') list.sort(function (a, b) { return b.preco - a.preco; });
    else if (s === 'nome') list.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });
    else if (s === 'novidades') list.sort(function (a, b) { return (b.novo ? 1 : 0) - (a.novo ? 1 : 0) || a.ordem - b.ordem; });
    else if (!st.q) list.sort(function (a, b) { return a.ordem - b.ordem; });
    return list;
  }
  function filterCount(st) { return Object.keys(st.f).reduce(function (n, k) { return n + st.f[k].length; }, 0); }
  function optLabel(key, v) {
    var g = VV.FILTERS.filter(function (x) { return x.key === key; })[0];
    var o = g && g.options.filter(function (x) { return x.v === v; })[0];
    return o ? o.l : v;
  }

  var loadToken = 0;
  pages.catalogo = {
    title: function (route) { var st = readState(route.params); return (st.q ? 'Busca: ' + st.q : VV.CATS[st.cat].title) + ' — Verde Vivo'; },
    render: function () {
      return '<div class="container page catalog">' +
        '<nav class="breadcrumb" aria-label="Trilha de navegação"><ol id="crumbs"></ol></nav>' +
        '<header class="catalog__head"><h1 id="cat-title" tabindex="-1"></h1><p id="cat-desc"></p></header>' +
        '<div class="catalog__toolbar">' +
          '<button class="sp-btn sp-btn--tonal" id="open-filters" type="button" aria-haspopup="dialog" aria-controls="filters-drawer">' + icon('sliders', 'icon--18') + 'Filtrar<span class="sp-btn__count" id="filter-count" hidden></span></button>' +
          '<p class="catalog__count" id="cat-count" aria-live="polite"></p>' +
          '<div class="sort"><label for="sort">Ordenar</label><span class="sp-select-wrap"><select id="sort" class="sp-select">' +
            VV.SORTS.map(function (s) { return '<option value="' + s.v + '">' + s.l + '</option>'; }).join('') +
          '</select>' + icon('chevron-down') + '</span></div>' +
        '</div>' +
        '<div class="active-filters" id="active-filters"></div>' +
        '<div id="results" aria-live="off"></div>' +
      '</div>';
    },
    mount: function (route) {
      $('#open-filters').addEventListener('click', function () { filtersDrawer.openWith(readState(VV.route.params), this); });
      $('#sort').addEventListener('change', function () {
        var st = readState(VV.route.params); st.sort = this.value; location.hash = buildHash(st);
      });
      $('#active-filters').addEventListener('click', function (e) {
        var b = e.target.closest('[data-remove]');
        if (!b) return;
        var st = readState(VV.route.params), r = b.getAttribute('data-remove');
        if (r === 'all') { st.f = {}; st.q = ''; }
        else if (r === 'q') st.q = '';
        else {
          var kv = r.split(':');
          st.f[kv[0]] = (st.f[kv[0]] || []).filter(function (v) { return v !== kv[1]; });
        }
        location.hash = buildHash(st);
        setTimeout(function () { var f = $('#active-filters [data-remove]') || $('#open-filters'); if (f) f.focus(); }, 0);
      });
      $('#results').addEventListener('click', function (e) {
        if (e.target.closest('[data-clear-filters]')) { var st = readState(VV.route.params); st.f = {}; st.q = ''; location.hash = buildHash(st); }
        if (e.target.closest('[data-retry]')) { location.hash = buildHash(readState(VV.route.params)); }
      });
      pages.catalogo.update(route, true);
    },
    update: function (route, first) {
      var st = readState(route.params);
      var c = VV.CATS[st.cat];
      // Título, descrição e trilha
      $('#cat-title').textContent = st.q ? 'Resultados para “' + st.q + '”' + (st.cat !== 'todas' ? ' em ' + c.title : '') : c.title;
      $('#cat-desc').textContent = st.q ? 'Buscamos pelo nome popular, nome científico e categoria.' : c.desc;
      var crumbs = '<li><a href="#/">Início</a></li>';
      if (st.cat === 'todas' && !st.q) crumbs += '<li><span aria-current="page">Catálogo</span></li>';
      else {
        crumbs += '<li><a href="#/catalogo">Catálogo</a></li>';
        if (c.parent) crumbs += '<li><a href="#/catalogo?cat=' + c.parent + '">' + esc(VV.CATS[c.parent].title) + '</a></li>';
        if (st.cat !== 'todas') crumbs += st.q ? '<li><a href="#/catalogo?cat=' + st.cat + '">' + esc(c.title) + '</a></li>' : '<li><span aria-current="page">' + esc(c.title) + '</span></li>';
        if (st.q) crumbs += '<li><span aria-current="page">Busca</span></li>';
      }
      $('#crumbs').innerHTML = crumbs;
      $('#sort').value = st.sort;
      var n = filterCount(st), fc = $('#filter-count');
      fc.textContent = n; fc.hidden = n === 0;
      $('#open-filters').setAttribute('aria-label', n ? 'Filtrar, ' + plural(n, 'filtro ativo', 'filtros ativos') : 'Filtrar');
      // Filtros ativos removíveis
      var chips = '';
      if (st.q) chips += '<button class="chip chip--removable sp-focus" type="button" data-remove="q" aria-label="Remover busca ' + esc(st.q) + '">Busca: ' + esc(st.q) + icon('x') + '</button>';
      VV.FILTERS.forEach(function (g) {
        (st.f[g.key] || []).forEach(function (v) {
          var l = optLabel(g.key, v);
          chips += '<button class="chip chip--removable" type="button" data-remove="' + g.key + ':' + v + '" aria-label="Remover filtro ' + esc(l) + '">' + esc(l) + icon('x') + '</button>';
        });
      });
      if (chips && (n + (st.q ? 1 : 0)) > 1) chips += '<button class="link-underline" type="button" data-remove="all">Limpar tudo</button>';
      $('#active-filters').innerHTML = chips;

      // Carregamento simulado → grade, vazio ou erro
      var list = filterProducts(st);
      var token = ++loadToken, results = $('#results');
      results.setAttribute('aria-busy', 'true');
      results.innerHTML = skeletonHTML(Math.min(6, Math.max(3, list.length || 3)));
      $('#cat-count').innerHTML = 'Carregando…';
      setTimeout(function () {
        if (token !== loadToken || !document.contains(results)) return;
        results.setAttribute('aria-busy', 'false');
        if (st.simular === 'erro') {
          $('#cat-count').innerHTML = '';
          results.innerHTML = stateHTML({ error: true, icon: 'alert', title: 'Não foi possível carregar o catálogo', text: 'A conexão com o viveiro falhou (erro simulado). Seus filtros foram mantidos.', actions: '<button class="sp-btn sp-btn--primary" type="button" data-retry>' + icon('refresh', 'icon--18') + 'Tentar novamente</button>' });
          return;
        }
        $('#cat-count').innerHTML = '<strong>' + list.length + '</strong> ' + (list.length === 1 ? 'produto' : 'produtos');
        if (!list.length) {
          results.innerHTML = stateHTML({ icon: 'search', title: 'Nenhuma planta encontrada', text: 'Nenhum produto combina com ' + (st.q ? 'a busca e os filtros escolhidos. Tente remover um filtro ou buscar por outro nome.' : 'os filtros escolhidos. Tente remover um deles.'),
            actions: '<button class="sp-btn sp-btn--primary" type="button" data-clear-filters>' + (st.q ? 'Limpar filtros e busca' : 'Limpar filtros') + '</button><a class="sp-btn sp-btn--tonal" href="#/catalogo">Ver todo o catálogo</a>' });
        } else {
          results.innerHTML = '<h2 class="sr-only">Produtos</h2>' + gridHTML(list);
        }
      }, first ? 450 : 320);
    }
  };

  /* ---------- Drawer de filtros ---------- */
  var filtersDrawer = {
    init: function () {
      var root = $('#filters-drawer');
      root.innerHTML = '<div class="drawer__scrim" data-close></div>' +
        '<section class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="filters-title">' +
          '<div class="drawer__handle" aria-hidden="true"></div>' +
          '<header class="drawer__head"><h2 class="drawer__title" id="filters-title">Filtros</h2><button class="icon-circle" type="button" data-close aria-label="Fechar filtros">' + icon('x') + '</button></header>' +
          '<div class="drawer__body">' + VV.FILTERS.map(function (g) {
            return '<section class="fgroup" aria-labelledby="fg-' + g.key + '"><h3 class="fgroup__title" id="fg-' + g.key + '"><span class="icon-circle icon-circle--sm">' + icon(g.icon) + '</span>' + g.label + '</h3>' +
              '<div class="chips" role="group" aria-labelledby="fg-' + g.key + '">' + g.options.map(function (o) {
                return '<button class="chip" type="button" aria-pressed="false" data-k="' + g.key + '" data-v="' + o.v + '">' + icon('check', 'chip__check') + o.l + '</button>';
              }).join('') + '</div></section>';
          }).join('') + '</div>' +
          '<footer class="drawer__foot"><p class="drawer__summary" id="filters-summary" aria-live="polite"></p>' +
            '<div class="drawer__foot-row"><button class="sp-btn sp-btn--neutral" type="button" id="filters-clear">Limpar</button><button class="sp-btn sp-btn--primary" type="button" id="filters-apply">Aplicar filtros</button></div></footer>' +
        '</section>';
      this.drawer = ui.Drawer(root);
      var self = this;
      root.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip[data-k]');
        if (chip) {
          var k = chip.getAttribute('data-k'), v = chip.getAttribute('data-v');
          var arr = self.draft.f[k] || [];
          self.draft.f[k] = arr.indexOf(v) > -1 ? arr.filter(function (x) { return x !== v; }) : arr.concat(v);
          self.sync();
        }
        if (e.target.closest('#filters-clear')) { self.draft.f = {}; self.sync(); }
        if (e.target.closest('#filters-apply')) {
          var hash = buildHash(self.draft);
          self.drawer.close({ noFocus: true });
          location.hash = hash;
          setTimeout(function () { var b = $('#open-filters'); if (b) b.focus({ preventScroll: true }); }, 0);
        }
      });
    },
    openWith: function (st, trigger) {
      this.draft = JSON.parse(JSON.stringify(st));
      this.sync();
      this.drawer.open(trigger);
    },
    sync: function () {
      var d = this.draft;
      $$('#filters-drawer .chip[data-k]').forEach(function (c) {
        var on = (d.f[c.getAttribute('data-k')] || []).indexOf(c.getAttribute('data-v')) > -1;
        c.setAttribute('aria-pressed', String(on));
      });
      var n = filterProducts(d).length;
      var clearBtn = $('#filters-clear');
      var any = filterCount(d) > 0;
      clearBtn.disabled = !any;
      clearBtn.setAttribute('aria-disabled', String(!any));
      $('#filters-summary').innerHTML = '<strong>' + plural(n, 'produto', 'produtos') + '</strong> com estes filtros' + (d.cat !== 'todas' ? ' em ' + esc(VV.CATS[d.cat].title) : '') + '.';
    }
  };

  /* =====================================================================
     PRODUTO
     ===================================================================== */
  pages.produto = {
    title: function (route) { var p = VV.findProduct(route.segs[1]); return (p ? p.nome : 'Produto') + ' — Verde Vivo'; },
    render: function (route) {
      var p = VV.findProduct(route.segs[1]);
      if (!p) return pages.notfound.render();
      var tag = VV.tagOf(p), inst = VV.installments(p.preco), off = p.estoque === 0;
      var c = VV.CATS[p.tipo || p.cat], top = VV.CATS[p.cat];
      var specs = '';
      if (p.luz) specs += spec('sun', 'Luz', p.luz.map(function (l) { return VV.LABELS.luz[l]; }).join(', '));
      if (p.rega) specs += spec('droplet', 'Rega', VV.LABELS.rega[p.rega]);
      if (p.porte) specs += spec('ruler', 'Porte', VV.LABELS.porte[p.porte]);
      if (typeof p.pet === 'boolean') specs += spec('paw', 'Pets', p.pet ? 'Segura para cães e gatos' : 'Tóxica se ingerida');
      if (!specs) specs += spec('truck', 'Envio', 'Embalagem reforçada') + spec('sparkle', 'Origem', 'Produção nacional');
      var related = VV.PRODUCTS.filter(function (x) { return x.id !== p.id && (x.tipo && x.tipo === p.tipo || x.cat === p.cat); }).slice(0, 3);
      return '<div class="container page">' +
        '<nav class="breadcrumb" aria-label="Trilha de navegação"><ol><li><a href="#/">Início</a></li><li><a href="#/catalogo?cat=' + p.cat + '">' + esc(top.title) + '</a></li>' +
          (p.tipo ? '<li><a href="#/catalogo?cat=' + p.tipo + '">' + esc(c.title) + '</a></li>' : '') + '<li><span aria-current="page">' + esc(p.nome) + '</span></li></ol></nav>' +
        '<div class="product">' +
          '<div class="product__media">' + VV.art.product(p) + '</div>' +
          '<div class="product__info">' +
            '<span class="tag ' + tag.cls + '">' + icon('leaf') + esc(tag.label) + '</span>' +
            '<h1 class="product__title" tabindex="-1">' + esc(p.nome) + '</h1>' +
            (p.sci ? '<p class="product__sci">' + esc(p.sci) + '</p>' : '') +
            '<div class="product__price"><span class="price">' + VV.fmt(p.preco) + (p.precoDe ? '<s><span class="sr-only">Preço anterior: </span>' + VV.fmt(p.precoDe) + '</s>' : '') + '</span>' +
              '<span class="inst">' + (inst.n > 1 ? 'ou ' + inst.n + 'x de ' + VV.fmt(inst.valor) + ' sem juros' : 'à vista no Pix ou cartão') + '</span></div>' +
            '<p class="product__desc">' + esc(p.desc) + '</p>' +
            '<ul class="specs">' + specs + '</ul>' +
            (off ? '<div class="msg msg--warning">' + icon('alert') + '<span>Produto esgotado no momento. Favorite para encontrar fácil quando voltar ao estoque.</span></div>' : '') +
            '<div class="buy">' +
              '<div class="qty" role="group" aria-label="Quantidade"><button type="button" data-qty="-1" aria-label="Diminuir quantidade"' + (off ? ' disabled' : ' disabled') + '>' + icon('minus', 'icon--18') + '</button>' +
              '<output id="qty" aria-live="polite">1</output><button type="button" data-qty="1" aria-label="Aumentar quantidade"' + (off ? ' disabled' : '') + '>' + icon('plus', 'icon--18') + '</button></div>' +
              '<button class="btn btn--primary" type="button" id="add-to-bag"' + (off ? ' aria-disabled="true"' : '') + '>' + icon('bag', 'icon--18') + (off ? 'Indisponível no momento' : 'Adicionar à sacola') + '</button>' +
              '<button class="icon-btn fav-toggle" type="button" data-fav="' + p.id + '" aria-pressed="' + VV.store.isFav(p.id) + '" aria-label="Favoritar ' + esc(p.nome) + '">' + icon('heart', 'icon--24') + '</button>' +
            '</div>' +
            '<p class="ship-note">' + icon('truck') + '<span>Frete grátis acima de ' + VV.fmt(VV.FREE_SHIPPING) + ' · entrega para <span data-addr>' + esc(VV.store.state.address.cidade + ' · ' + VV.store.state.address.cep) + '</span></span></p>' +
          '</div>' +
        '</div>' +
        (related.length ? '<section class="related" aria-labelledby="rel-title"><div class="related__head"><h2 id="rel-title">Combina com esta escolha</h2><a class="link-underline" href="#/catalogo?cat=' + (p.tipo || p.cat) + '">Ver mais em ' + esc(c.title) + '</a></div>' + gridHTML(related) + '</section>' : '') +
      '</div>';
      function spec(ic, k, v) {
        return '<li><span class="icon-circle icon-circle--sm">' + icon(ic) + '</span><span><span class="k">' + k + '</span><br><span class="v">' + esc(v) + '</span></span></li>';
      }
    },
    mount: function (route) {
      var p = VV.findProduct(route.segs[1]);
      if (!p) return;
      var qty = 1, out = $('#qty');
      $$('[data-qty]').forEach(function (b) {
        b.addEventListener('click', function () {
          qty = Math.max(1, Math.min(p.estoque, qty + (+b.getAttribute('data-qty'))));
          out.textContent = qty;
          $('[data-qty="-1"]').disabled = qty <= 1;
          $('[data-qty="1"]').disabled = qty >= p.estoque;
        });
      });
      $('#add-to-bag').addEventListener('click', function () {
        if (this.getAttribute('aria-disabled') === 'true') return;
        VV.store.addToCart(p.id, qty);
        cartDrawer.open(this, p, qty);
      });
    }
  };

  /* ---------- Minicarrinho (drawer lateral) ---------- */
  var cartDrawer = {
    init: function () {
      var root = $('#cart-drawer');
      root.innerHTML = '<div class="drawer__scrim" data-close></div>' +
        '<section class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
          '<header class="drawer__head"><h2 class="drawer__title" id="cart-title">Sua sacola</h2><button class="icon-circle" type="button" data-close aria-label="Fechar sacola">' + icon('x') + '</button></header>' +
          '<div class="drawer__body" id="cart-body"></div><footer class="drawer__foot" id="cart-foot"></footer></section>';
      this.drawer = ui.Drawer(root);
      var self = this;
      root.addEventListener('click', function (e) {
        var rm = e.target.closest('[data-rm]');
        if (rm) { VV.store.removeFromCart(rm.getAttribute('data-rm')); self.renderBody(null); var c = $('#cart-drawer [data-close]'); if (c) c.focus(); }
        if (e.target.closest('a[href]')) self.drawer.close({ noFocus: true });
        if (e.target.closest('[data-checkout]')) ui.demo('Finalizar compra');
      });
    },
    open: function (trigger, added, qty) {
      this.renderBody(added ? { p: added, qty: qty } : null);
      this.drawer.open(trigger);
    },
    renderBody: function (added) {
      var items = VV.store.cartItems(), t = VV.store.cartTotals();
      var body = '';
      if (added) body += '<div class="msg msg--success" role="status" style="margin-bottom:16px">' + icon('check') + '<span><strong>' + esc(added.p.nome) + '</strong> (' + added.qty + ') foi adicionado à sacola.</span></div>';
      if (!items.length) {
        $('#cart-body').innerHTML = stateHTML({ icon: 'bag', title: 'Sua sacola está vazia', text: 'Escolha uma planta no catálogo para começar.', actions: '<a class="sp-btn sp-btn--primary" href="#/catalogo?cat=plantas">Ver plantas</a>' });
        $('#cart-foot').innerHTML = '';
        return;
      }
      body += '<ul class="cart-list">' + items.map(function (x) {
        return '<li class="cart-item"><span class="cart-item__thumb">' + VV.art.thumb(x.p) + '</span>' +
          '<span><a class="cart-item__name" href="#/produto/' + x.p.id + '">' + esc(x.p.nome) + '</a><br><span class="cart-item__sub">' + x.qty + ' × ' + VV.fmt(x.p.preco) + '</span></span>' +
          '<button class="icon-btn" type="button" data-rm="' + x.p.id + '" aria-label="Remover ' + esc(x.p.nome) + '">' + icon('trash', 'icon--18') + '</button></li>';
      }).join('') + '</ul>';
      $('#cart-body').innerHTML = body;
      $('#cart-foot').innerHTML = '<div class="cart-sum"><div class="cart-sum__row"><span>Subtotal</span><span>' + VV.fmt(t.sub) + '</span></div>' +
        '<p class="drawer__summary">' + (t.falta > 0 ? 'Faltam <strong>' + VV.fmt(t.falta) + '</strong> para o frete grátis.' : '<strong>Frete grátis</strong> garantido neste pedido.') + '</p></div>' +
        '<div class="drawer__foot-row"><a class="sp-btn sp-btn--tonal" href="#/sacola">Ver sacola</a><button class="sp-btn sp-btn--primary" type="button" data-checkout>Finalizar compra</button></div>';
    }
  };

  /* =====================================================================
     FAVORITOS
     ===================================================================== */
  pages.favoritos = {
    title: 'Favoritos — Verde Vivo',
    render: function () {
      return '<div class="container page"><nav class="breadcrumb" aria-label="Trilha de navegação"><ol><li><a href="#/">Início</a></li><li><span aria-current="page">Favoritos</span></li></ol></nav>' +
        '<header class="catalog__head"><h1 tabindex="-1">Favoritos</h1><p id="fav-desc"></p></header><div id="fav-results"></div></div>';
    },
    mount: function () { pages.favoritos.refresh(false); },
    refresh: function (focusSafe) {
      var list = VV.store.state.favs.map(VV.findProduct).filter(Boolean);
      $('#fav-desc').textContent = list.length ? plural(list.length, 'produto salvo', 'produtos salvos') + ' neste navegador.' : 'Toque no coração de um produto para guardá-lo aqui.';
      $('#fav-results').innerHTML = list.length ? '<h2 class="sr-only">Produtos favoritos</h2>' + gridHTML(list) : stateHTML({ icon: 'heart', title: 'Nenhum favorito ainda', text: 'Salve as plantas que você quer comparar ou comprar depois.', actions: '<a class="sp-btn sp-btn--primary" href="#/catalogo?cat=plantas">Explorar plantas</a>' });
      if (focusSafe) { var h = $('#conteudo h1'); if (h) h.focus({ preventScroll: true }); }
    }
  };

  /* =====================================================================
     SACOLA
     ===================================================================== */
  pages.sacola = {
    title: 'Sacola — Verde Vivo',
    render: function () {
      return '<div class="container page"><nav class="breadcrumb" aria-label="Trilha de navegação"><ol><li><a href="#/">Início</a></li><li><span aria-current="page">Sacola</span></li></ol></nav>' +
        '<header class="catalog__head"><h1 tabindex="-1">Sacola</h1></header><div id="bag"></div></div>';
    },
    mount: function () {
      var root = $('#bag');
      pages.sacola.refresh();
      root.addEventListener('click', function (e) {
        var q = e.target.closest('[data-setqty]');
        if (q) {
          var id = q.getAttribute('data-id'), item = VV.store.state.cart.filter(function (i) { return i.id === id; })[0];
          if (item) VV.store.setQty(id, item.qty + (+q.getAttribute('data-setqty')));
          pages.sacola.refresh();
          var again = $('[data-id="' + id + '"][data-setqty="' + q.getAttribute('data-setqty') + '"]');
          if (again && !again.disabled) again.focus(); else { var o = $('#bag-qty-' + id); if (o) o.parentNode.querySelector('button:not([disabled])').focus(); }
        }
        var rm = e.target.closest('[data-rm]');
        if (rm) {
          var p = VV.findProduct(rm.getAttribute('data-rm'));
          VV.store.removeFromCart(p.id);
          pages.sacola.refresh();
          ui.toast(p.nome + ' removido da sacola', 'trash');
          var h = $('#conteudo h1'); if (h) h.focus({ preventScroll: true });
        }
        if (e.target.closest('[data-checkout]')) ui.demo('Finalizar compra');
      });
    },
    refresh: function () {
      var items = VV.store.cartItems(), t = VV.store.cartTotals(), root = $('#bag');
      if (!items.length) {
        root.innerHTML = stateHTML({ icon: 'bag', title: 'Sua sacola está vazia', text: 'Que tal começar por uma planta fácil de cuidar?', actions: '<a class="sp-btn sp-btn--primary" href="#/catalogo?cat=plantas&amp;extra=facil">Ver plantas fáceis</a><a class="sp-btn sp-btn--tonal" href="#/catalogo">Ver catálogo</a>' });
        return;
      }
      var pct = Math.min(100, Math.round(t.sub / VV.FREE_SHIPPING * 100));
      var inst = VV.installments(t.total);
      root.innerHTML = '<div class="bag"><ul class="bag__list" aria-label="Itens da sacola">' + items.map(function (x) {
        return '<li class="bag-item"><span class="bag-item__thumb">' + VV.art.thumb(x.p) + '</span>' +
          '<div class="bag-item__info"><a class="cart-item__name" href="#/produto/' + x.p.id + '">' + esc(x.p.nome) + '</a>' +
            '<span class="cart-item__sub">' + VV.fmt(x.p.preco) + ' cada' + (x.p.sci ? ' · ' + esc(x.p.sci) : '') + '</span>' +
            '<div class="bag-item__actions"><div class="qty qty--sm" role="group" aria-label="Quantidade de ' + esc(x.p.nome) + '">' +
              '<button type="button" data-setqty="-1" data-id="' + x.p.id + '" aria-label="Diminuir"' + (x.qty <= 1 ? ' disabled' : '') + '>' + icon('minus', 'icon--16') + '</button>' +
              '<output id="bag-qty-' + x.p.id + '">' + x.qty + '</output>' +
              '<button type="button" data-setqty="1" data-id="' + x.p.id + '" aria-label="Aumentar"' + (x.qty >= x.p.estoque ? ' disabled' : '') + '>' + icon('plus', 'icon--16') + '</button></div>' +
            '<button class="link-btn" type="button" data-rm="' + x.p.id + '">' + icon('trash', 'icon--16') + 'Remover</button></div></div>' +
          '<span class="bag-item__total">' + VV.fmt(x.p.preco * x.qty) + '</span></li>';
      }).join('') + '</ul>' +
        '<aside class="bag__summary" aria-labelledby="sum-title"><h2 id="sum-title">Resumo</h2>' +
          '<div class="cart-sum"><div class="cart-sum__row"><span>Subtotal (' + plural(VV.store.cartCount(), 'item', 'itens') + ')</span><span>' + VV.fmt(t.sub) + '</span></div>' +
          '<div class="cart-sum__row"><span>Frete para ' + esc(VV.store.state.address.cep) + '</span><span>' + (t.frete ? VV.fmt(t.frete) : 'Grátis') + '</span></div>' +
          '<div class="cart-sum__row cart-sum__row--total"><span>Total</span><span>' + VV.fmt(t.total) + '</span></div>' +
          '<span class="inst">ou ' + inst.n + 'x de ' + VV.fmt(inst.valor) + ' sem juros</span></div>' +
          '<div><div class="progress" role="progressbar" aria-label="Progresso para frete grátis" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + pct + '%"></span></div>' +
          '<p class="drawer__summary" style="margin-top:8px">' + (t.falta > 0 ? 'Faltam <strong>' + VV.fmt(t.falta) + '</strong> para o frete grátis.' : 'Você ganhou <strong>frete grátis</strong>.') + '</p></div>' +
          '<button class="btn btn--primary btn--block" type="button" data-checkout>Finalizar compra</button>' +
          '<a class="link-underline" href="#/catalogo">Continuar comprando</a>' +
        '</aside></div>';
    }
  };

  /* ---------- 404 ---------- */
  pages.notfound = {
    title: 'Página não encontrada — Verde Vivo',
    render: function () {
      return '<div class="container"><div class="notfound"><p class="eyebrow">Erro 404</p><h1 tabindex="-1">Esta página não brotou</h1>' +
        '<p class="lead">O endereço pode ter mudado ou o produto saiu do catálogo.</p>' +
        '<div class="final__actions"><a class="btn btn--primary" href="#/catalogo">Ver catálogo</a><a class="link-underline" href="#/">Voltar ao início</a></div></div></div>';
    }
  };

  pages.initOverlays = function () {
    filtersDrawer.init();
    cartDrawer.init();
  };
})();
