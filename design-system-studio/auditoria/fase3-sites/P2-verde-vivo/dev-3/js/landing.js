/* Landing Folha Viva: ilustrações placeholder, menu do celular e inicialização das rotas. */
(function () {
  'use strict';
  var VV = window.VV;

  // Ilustrações placeholder (vetoriais), com texto alternativo nos elementos role="img"
  VV.$('.hero-arch').innerHTML = VV.art('hero-planta', { w: 300, h: 440, tone: 1, leaves: true });
  VV.$('.hero-small > div').innerHTML = VV.art('folhas-soltas', { w: 260, h: 220, tone: 3, leaves: true });
  VV.$('.bleed-img > div').innerHTML = VV.art('estante', { w: 900, h: 480, tone: 2, leaves: true });

  // Menu do celular (diálogo com foco preso; fecha ao escolher um item)
  var menu = VV.$('#landing-menu');
  var menuBtn = VV.$('#landing-menu-btn');
  menuBtn.addEventListener('click', function () {
    VV.open(menu, { trigger: menuBtn });
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) VV.close(menu, { noFocus: true });
  });

  // Inicializa a tela conforme o endereço atual (landing ou catálogo)
  VV.route();
})();
