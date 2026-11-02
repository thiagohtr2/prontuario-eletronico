/* ==========================================================================
   Verde Vivo — dados fictícios (nenhum backend)
   ========================================================================== */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  /* Rótulos das pílulas da faixa mobile têm no máximo 10 caracteres (regra 320-359 px) */
  VV.categories = [
    { id: 'todas', label: 'Todas', icon: 'leaf', title: 'Todas as plantas', sub: 'Plantas, vasos e kits selecionados no ateliê.' },
    { id: 'folhagens', label: 'Folhagens', icon: 'sprout', title: 'Folhagens', sub: 'Verde farto para sala, quarto e escritório.' },
    { id: 'suculentas', label: 'Suculentas', icon: 'sun', title: 'Suculentas e cactos', sub: 'Pequenas, resistentes e fáceis de cuidar.' },
    { id: 'floriferas', label: 'Floríferas', icon: 'flower-2', title: 'Floríferas', sub: 'Flores que duram semanas dentro de casa.' },
    { id: 'ervas', label: 'Ervas', icon: 'clover', title: 'Ervas e temperos', sub: 'Para cozinhar com folhas colhidas na hora.' },
    { id: 'vasos', label: 'Vasos', icon: 'plant-pot', title: 'Vasos e cachepôs', sub: 'Barro, cerâmica e fibras naturais.' },
    { id: 'kits', label: 'Kits', icon: 'gift', title: 'Kits do ateliê', sub: 'Planta, vaso e substrato prontos para presentear.' }
  ];

  VV.LUZ = { sol: 'Sol pleno', difusa: 'Luz difusa', sombra: 'Sombra' };
  VV.PORTE = { p: 'Pequeno', m: 'Médio', g: 'Grande' };
  VV.CUID = { facil: 'Fácil', moderado: 'Moderado', exigente: 'Exigente' };

  var P = function (n, o) { o.n = n; o.id = 'p' + n; return o; };

  VV.products = [
    P(1, { name: 'Costela-de-adão', sci: 'Monstera deliciosa', cat: 'folhagens', price: 129.9, tag: 'Mais vendida', luz: 'difusa', porte: 'g', cuid: 'facil', pet: false, stock: 12, rega: 'A cada 7 dias',
      desc: 'Folhas grandes e recortadas que enchem a sala. Porte grande, luz difusa e rega semanal.',
      alt: 'Ilustração de uma costela-de-adão em vaso de barro', art: { kind: 'monstera', pot: 'terracotta', potW: 66, potH: 46, H: 112, bg: 1 } }),
    P(2, { name: 'Zamioculca', sci: 'Zamioculcas zamiifolia', cat: 'folhagens', price: 89.9, tag: 'Fácil cuidado', luz: 'sombra', porte: 'm', cuid: 'facil', pet: false, stock: 8, rega: 'A cada 15 dias',
      desc: 'Folhas brilhantes e muito resistente. Porte médio, aceita pouca luz e rega quinzenal.',
      alt: 'Ilustração de uma zamioculca em vaso branco', art: { kind: 'zz', pot: 'white', potW: 62, potH: 46, H: 110, bg: 3 } }),
    P(3, { name: 'Espada-de-são-jorge', sci: 'Dracaena trifasciata', cat: 'folhagens', price: 69.9, tag: 'Fácil cuidado', luz: 'difusa', porte: 'm', cuid: 'facil', pet: false, stock: 15, rega: 'A cada 15 dias',
      desc: 'Lâminas verticais e elegantes, ótima para quem viaja. Porte médio e rega quinzenal.',
      alt: 'Ilustração de uma espada-de-são-jorge em vaso escuro', art: { kind: 'snake', pot: 'dark', potW: 60, potH: 48, H: 112, bg: 2 } }),
    P(4, { name: 'Samambaia-americana', sci: 'Nephrolepis exaltata', cat: 'folhagens', price: 54.9, tag: 'Pet friendly', luz: 'difusa', porte: 'm', cuid: 'moderado', pet: true, stock: 9, rega: 'A cada 3 dias',
      desc: 'Folhagem macia e caída, segura para pets. Porte médio, gosta de umidade e rega frequente.',
      alt: 'Ilustração de uma samambaia em cachepô de fibra natural', art: { kind: 'fern', pot: 'basket', potW: 64, potH: 46, H: 100, bg: 4 } }),
    P(5, { name: 'Jiboia', sci: 'Epipremnum aureum', cat: 'folhagens', price: 44.9, tag: 'Novo', luz: 'difusa', porte: 'p', cuid: 'facil', pet: false, stock: 20, rega: 'A cada 7 dias',
      desc: 'Ramos que escorrem pela estante em poucos meses. Porte pequeno, luz difusa e rega semanal.',
      alt: 'Ilustração de uma jiboia com ramos caídos em vaso de cerâmica', art: { kind: 'pothos', pot: 'ceramic', potW: 58, potH: 42, H: 92, bg: 3 } }),
    P(6, { name: 'Fícus-lira', sci: 'Ficus lyrata', cat: 'folhagens', price: 219.9, tag: 'Esgotado', luz: 'difusa', porte: 'g', cuid: 'exigente', pet: false, stock: 0, rega: 'A cada 7 dias',
      desc: 'Folhas em forma de violino e muito presença. Porte grande, luz forte filtrada e rega semanal.',
      alt: 'Ilustração de um fícus-lira em vaso de barro', art: { kind: 'lyrata', pot: 'terracotta', potW: 68, potH: 46, H: 118, bg: 2 } }),
    P(7, { name: 'Palmeira-ráfia', sci: 'Rhapis excelsa', cat: 'folhagens', price: 189.9, tag: 'Pet friendly', luz: 'difusa', porte: 'g', cuid: 'facil', pet: true, stock: 4, rega: 'A cada 7 dias',
      desc: 'Palmeira elegante para cantos amplos, segura para pets. Porte grande e rega semanal.',
      alt: 'Ilustração de uma palmeira-ráfia em vaso escuro', art: { kind: 'palm', pot: 'dark', potW: 68, potH: 50, H: 112, bg: 1 } }),
    P(8, { name: 'Echeveria', sci: 'Echeveria elegans', cat: 'suculentas', price: 29.9, tag: 'Novo', luz: 'sol', porte: 'p', cuid: 'facil', pet: true, stock: 30, rega: 'A cada 15 dias',
      desc: 'Rosetas azuladas que pedem sol. Porte pequeno, segura para pets e rega quinzenal.',
      alt: 'Ilustração de uma echeveria em vaso de barro pequeno', art: { kind: 'succulent', pot: 'terracotta', potW: 58, potH: 40, H: 58, bg: 2 } }),
    P(9, { name: 'Haworthia', sci: 'Haworthiopsis attenuata', cat: 'suculentas', price: 34.9, tag: 'Pet friendly', luz: 'difusa', porte: 'p', cuid: 'facil', pet: true, stock: 18, rega: 'A cada 15 dias',
      desc: 'Pequenas folhas listradas que toleram luz suave. Porte pequeno, segura para pets, rega quinzenal.',
      alt: 'Ilustração de uma haworthia em vaso de pedra', art: { kind: 'haworthia', pot: 'stone', potW: 58, potH: 42, H: 52, bg: 4 } }),
    P(10, { name: 'Cacto-bola', sci: 'Mammillaria elongata', cat: 'suculentas', price: 24.9, tag: 'Fácil cuidado', luz: 'sol', porte: 'p', cuid: 'facil', pet: false, stock: 25, rega: 'A cada 20 dias',
      desc: 'Redondo, florido na primavera e muito resistente. Porte pequeno, sol pleno e rega espaçada.',
      alt: 'Ilustração de um cacto redondo com flor em vaso branco', art: { kind: 'cactus', pot: 'white', potW: 56, potH: 40, H: 70, bg: 1 } }),
    P(11, { name: 'Rabo-de-burro', sci: 'Sedum morganianum', cat: 'suculentas', price: 59.9, tag: 'Mais vendida', luz: 'sol', porte: 'm', cuid: 'moderado', pet: true, stock: 6, rega: 'A cada 10 dias',
      desc: 'Ramos carnudos que pendem do vaso. Porte médio, segura para pets, sol e rega moderada.',
      alt: 'Ilustração de um rabo-de-burro com ramos caídos em vaso de cerâmica', art: { kind: 'trailing', pot: 'ceramic', potW: 58, potH: 44, H: 62, bg: 3 } }),
    P(12, { name: 'Orquídea Phalaenopsis', sci: 'Phalaenopsis hybrid', cat: 'floriferas', price: 119.9, tag: 'Novo', luz: 'difusa', porte: 'm', cuid: 'moderado', pet: true, stock: 7, rega: 'A cada 7 dias',
      desc: 'Hastes com flores brancas que duram meses. Porte médio, luz difusa e rega semanal.',
      alt: 'Ilustração de uma orquídea branca em vaso branco', art: { kind: 'orchid', pot: 'white', potW: 54, potH: 42, H: 114, bg: 2 } }),
    P(13, { name: 'Violeta-africana', sci: 'Streptocarpus ionanthus', cat: 'floriferas', price: 39.9, tag: 'Pet friendly', luz: 'difusa', porte: 'p', cuid: 'moderado', pet: true, stock: 14, rega: 'A cada 5 dias',
      desc: 'Flores pequenas o ano todo. Porte pequeno, segura para pets, luz difusa e rega por baixo.',
      alt: 'Ilustração de uma violeta-africana em vaso esmaltado', art: { kind: 'violet', pot: 'glaze', potW: 56, potH: 40, H: 64, bg: 4 } }),
    P(14, { name: 'Antúrio', sci: 'Anthurium andraeanum', cat: 'floriferas', price: 79.9, tag: 'Últimas unidades', luz: 'difusa', porte: 'm', cuid: 'moderado', pet: false, stock: 2, rega: 'A cada 5 dias',
      desc: 'Brácteas brilhantes e folhas em coração. Porte médio, luz difusa e substrato sempre úmido.',
      alt: 'Ilustração de um antúrio com flores em vaso de barro', art: { kind: 'anthurium', pot: 'terracotta', potW: 58, potH: 42, H: 98, bg: 3 } }),
    P(15, { name: 'Lírio-da-paz', sci: 'Spathiphyllum wallisii', cat: 'floriferas', price: 64.9, tag: 'Fácil cuidado', luz: 'sombra', porte: 'm', cuid: 'facil', pet: false, stock: 11, rega: 'A cada 5 dias',
      desc: 'Flores brancas mesmo com pouca luz. Porte médio, avisa quando precisa de água: as folhas caem.',
      alt: 'Ilustração de um lírio-da-paz com flores brancas em vaso de cerâmica', art: { kind: 'lily', pot: 'ceramic', potW: 60, potH: 44, H: 98, bg: 1 } }),
    P(16, { name: 'Manjericão', sci: 'Ocimum basilicum', cat: 'ervas', price: 19.9, tag: 'Novo', luz: 'sol', porte: 'p', cuid: 'moderado', pet: true, stock: 40, rega: 'A cada 2 dias',
      desc: 'Folhas perfumadas para massas e saladas. Porte pequeno, segura para pets, sol e rega frequente.',
      alt: 'Ilustração de um vaso de manjericão', art: { kind: 'herb', pot: 'terracotta', potW: 58, potH: 42, H: 72, bg: 2 } }),
    P(17, { name: 'Alecrim', sci: 'Salvia rosmarinus', cat: 'ervas', price: 24.9, tag: 'Pet friendly', luz: 'sol', porte: 'p', cuid: 'moderado', pet: true, stock: 22, rega: 'A cada 5 dias',
      desc: 'Arbusto aromático para assados e chás. Porte pequeno, segura para pets, sol pleno e pouca água.',
      alt: 'Ilustração de um vaso de alecrim', art: { kind: 'sprig', pot: 'terracotta', potW: 58, potH: 42, H: 80, bg: 4 } }),
    P(18, { name: 'Vaso de barro 20 cm', sci: 'Barro cru artesanal', cat: 'vasos', price: 49.9, tag: 'Mais vendida', luz: null, porte: 'm', cuid: null, pet: null, stock: 50, rega: null,
      desc: 'Barro cru que respira e regula a umidade. Cabe plantas de porte médio e vem com prato.',
      alt: 'Ilustração de um vaso de barro vazio', art: { kind: 'empty', pot: 'terracotta', potW: 104, potH: 92, H: 20, bg: 2 } }),
    P(19, { name: 'Vaso de cerâmica esmaltada', sci: 'Esmalte verde-floresta', cat: 'vasos', price: 89.9, tag: 'Novo', luz: null, porte: 'g', cuid: null, pet: null, stock: 10, rega: null,
      desc: 'Esmalte brilhante feito à mão, com furo de drenagem. Porte grande, ideal para folhagens.',
      alt: 'Ilustração de um vaso de cerâmica esmaltada verde vazio', art: { kind: 'empty', pot: 'glaze', potW: 112, potH: 96, H: 20, bg: 3 } }),
    P(20, { name: 'Cachepô de fibra natural', sci: 'Fibra trançada', cat: 'vasos', price: 59.9, tag: 'Pet friendly', luz: null, porte: 'm', cuid: null, pet: null, stock: 16, rega: null,
      desc: 'Trançado leve que esconde o vaso de plástico. Porte médio e forro impermeável removível.',
      alt: 'Ilustração de um cachepô de fibra trançada vazio', art: { kind: 'empty', pot: 'basket', potW: 108, potH: 90, H: 20, bg: 4 } }),
    P(21, { name: 'Kit Primeira Planta', sci: 'Jiboia, vaso, substrato e pá', cat: 'kits', price: 119.9, tag: 'Novo', luz: 'difusa', porte: 'p', cuid: 'facil', pet: false, stock: 9, rega: 'A cada 7 dias',
      desc: 'Jiboia, vaso de barro, substrato e pá de mão num só pacote. Guia de rega impresso incluso.',
      alt: 'Ilustração de uma jiboia em vaso de barro ao lado de uma pá de mão', art: { kind: 'pothos', pot: 'terracotta', potW: 58, potH: 42, H: 92, bg: 1, extra: 'trowel' } }),
    P(22, { name: 'Kit 3 suculentas', sci: 'Três mudas em vasos de barro', cat: 'kits', price: 79.9, tag: 'Pet friendly', luz: 'sol', porte: 'p', cuid: 'facil', pet: true, stock: 13, rega: 'A cada 15 dias',
      desc: 'Echeveria, haworthia e cacto em vasos de barro pequenos. Porte pequeno, perfeito para presente.',
      alt: 'Ilustração de três suculentas em vasos de barro pequenos', art: { items: [
        { kind: 'succulent', pot: 'terracotta', potW: 50, potH: 36, H: 52, x: -66 },
        { kind: 'haworthia', pot: 'white', potW: 50, potH: 36, H: 46, x: 0 },
        { kind: 'cactus', pot: 'terracotta', potW: 50, potH: 36, H: 62, x: 66 }], bg: 4 } })
  ];

  VV.productById = function (id) {
    for (var i = 0; i < VV.products.length; i++) if (VV.products[i].id === id) return VV.products[i];
    return null;
  };
  VV.catById = function (id) {
    for (var i = 0; i < VV.categories.length; i++) if (VV.categories[i].id === id) return VV.categories[i];
    return VV.categories[0];
  };

  /* Normaliza para busca: minúsculas e sem acentos */
  VV.norm = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };

  VV.SORTS = [
    { id: 'relevancia', label: 'Mais relevantes' },
    { id: 'preco-asc', label: 'Menor preço' },
    { id: 'preco-desc', label: 'Maior preço' },
    { id: 'nome', label: 'Nome (A a Z)' },
    { id: 'novidades', label: 'Novidades' }
  ];

  VV.popularTerms = ['Pet friendly', 'Luz difusa', 'Suculentas', 'Vasos de barro', 'Fácil cuidado'];
})();
