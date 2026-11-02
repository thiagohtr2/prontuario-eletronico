/* Roteador por hash (funciona aberto direto do disco, via file://). */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var main = document.getElementById('conteudo');
  var current = null;

  function parse() {
    var h = location.hash || '#/';
    if (h.indexOf('#/') !== 0) return null; // âncoras internas (ex.: #conteudo) não mudam de rota
    var parts = h.slice(1).split('?');
    var path = parts[0], segs = path.split('/').filter(Boolean);
    var name = 'notfound';
    if (!segs.length) name = 'landing';
    else if (segs[0] === 'catalogo' && segs.length === 1) name = 'catalogo';
    else if (segs[0] === 'produto' && segs.length === 2) name = VV.findProduct(segs[1]) ? 'produto' : 'notfound';
    else if (segs[0] === 'favoritos' && segs.length === 1) name = 'favoritos';
    else if (segs[0] === 'sacola' && segs.length === 1) name = 'sacola';
    return { name: name, path: path, segs: segs, params: new URLSearchParams(parts[1] || ''), hash: h };
  }

  function navigate(initial) {
    var route = parse();
    if (!route) return;
    var page = VV.pages[route.name];
    var prev = current;
    VV.route = route;
    VV.shell.setActive(route);
    document.title = typeof page.title === 'function' ? page.title(route) : page.title;

    // Dentro do catálogo, só atualiza resultados (não rola nem recria a página)
    if (prev && prev.name === 'catalogo' && route.name === 'catalogo') {
      current = route;
      VV.pages.catalogo.update(route);
      var head = document.querySelector('.catalog__toolbar');
      if (head) {
        var top = head.getBoundingClientRect().top + window.scrollY - 200;
        if (window.scrollY > top + 40) window.scrollTo({ top: Math.max(0, top), behavior: VV.ui.reducedMotion() ? 'auto' : 'smooth' });
      }
      return;
    }

    if (prev && VV.pages[prev.name] && VV.pages[prev.name].unmount) VV.pages[prev.name].unmount();
    current = route;
    main.innerHTML = page.render(route);
    if (page.mount) page.mount(route);
    if (!initial) {
      window.scrollTo(0, 0);
      var h1 = main.querySelector('h1');
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  // Link "Pular para o conteúdo" sem alterar a rota
  document.querySelector('.skip-link').addEventListener('click', function (e) {
    e.preventDefault();
    var h1 = main.querySelector('h1') || main;
    h1.focus();
  });

  // Rotas que já estão abertas: re-render ao clicar de novo no mesmo link
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === location.hash && !e.defaultPrevented && !a.hasAttribute('data-demo')) {
      window.scrollTo({ top: 0, behavior: VV.ui.reducedMotion() ? 'auto' : 'smooth' });
    }
  });

  VV.shell.init();
  VV.pages.initOverlays();
  VV.store.on('cart', function () { if (VV.route && VV.route.name === 'sacola' && document.getElementById('bag')) VV.pages.sacola.refresh(); });
  window.addEventListener('hashchange', function () { navigate(false); });
  navigate(true);
})();
