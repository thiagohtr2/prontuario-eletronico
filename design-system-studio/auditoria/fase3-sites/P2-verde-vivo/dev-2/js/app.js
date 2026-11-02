/* ==========================================================================
   Roteador por hash (funciona aberto direto do disco, file://)
     #/                  landing
     #/cuidados          landing, rola até "Cuidados"
     #/atelie            landing, rola até "Ateliê"
     #/catalogo?...      catálogo (filtros na query)
     #/produto/p1        catálogo + detalhe do produto
   ========================================================================== */
(function () {
  'use strict';
  var VV = window.VV;
  var $ = VV.$;

  var views = { home: $('#view-home'), catalog: $('#view-catalog') };
  var current = null, first = true;
  var TITLE_HOME = 'Verde Vivo — Plantas para viver melhor';

  function parse() {
    var h = location.hash;
    if (!h || h === '#' || h === '#/') return { view: 'home' };
    if (h.indexOf('#/') !== 0) return null; // âncora alheia ao roteador (ex.: #main)
    var path = h.slice(2), qs = '', qi = path.indexOf('?');
    if (qi > -1) { qs = path.slice(qi + 1); path = path.slice(0, qi); }
    path = path.replace(/\/+$/, '');
    if (path === 'cuidados' || path === 'atelie') return { view: 'home', section: path };
    if (path === 'catalogo') return { view: 'catalog', qs: qs };
    var m = path.match(/^produto\/(p\d+)$/);
    if (m) return { view: 'catalog', qs: '', product: m[1] };
    return { view: 'home' };
  }

  function route() {
    var r = parse();
    if (!r) return;
    var changed = current !== r.view;
    VV.popoverCloseAll && VV.popoverCloseAll();
    VV.search && VV.search.close();
    views.home.hidden = r.view !== 'home';
    views.catalog.hidden = r.view !== 'catalog';
    var focusEl = null;

    if (r.view === 'home') {
      VV.nav.set({ view: 'home', section: r.section || null });
      document.title = r.section === 'cuidados' ? 'Cuidados — Verde Vivo' : r.section === 'atelie' ? 'Ateliê — Verde Vivo' : TITLE_HOME;
      if (r.section) {
        var el = document.getElementById(r.section);
        VV.spyPause = Date.now() + 1000;
        el.scrollIntoView({ behavior: VV.reducedMotion() || changed ? 'auto' : 'smooth', block: 'start' });
        focusEl = el.querySelector('h2');
      } else {
        window.scrollTo(0, 0);
        focusEl = $('#hero-title');
      }
    } else {
      var res = VV.catalog.show(r.qs, { instant: !changed && first });
      document.title = $('#catalog-title').textContent + ' — Verde Vivo';
      if (changed || res.changedCat) window.scrollTo(0, 0);
      focusEl = $('#catalog-title');
      if (r.product) VV.openProduct(r.product, $('#brand'));
    }
    current = r.view;
    if (!first && focusEl && !r.product && (changed || r.section)) {
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    }
    first = false;
    VV.landingUpdate && VV.landingUpdate();
  }

  window.addEventListener('hashchange', route);

  // Clicar no link da rota atual repete a navegação (ex.: rolar de novo até a seção)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#/"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.getAttribute('href') === location.hash || (a.getAttribute('href') === '#/' && !location.hash)) {
      e.preventDefault();
      route();
    }
  });

  route();
})();
