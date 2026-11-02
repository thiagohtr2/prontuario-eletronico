/* Dados fictícios da demonstração Verde Vivo (sem backend).
   Preços em reais. Ilustrações são SVG geradas a partir de uma chave, com cores vindas dos tokens CSS. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  VV.categories = [
    { key: 'todas', nome: 'Todas', icone: 'grid', grupos: [] },
    {
      key: 'interior', nome: 'Interior', icone: 'leaf',
      destaque: { titulo: 'Plantas para casa', texto: 'Escolhas que vivem bem com pouca luz e pouca rotina.', cta: 'Ver interior', filtro: { cat: 'interior' } },
      grupos: [
        { titulo: 'Por luz', links: [['Sombra', { cat: 'interior', luz: 'sombra' }], ['Meia-sombra', { cat: 'interior', luz: 'meia' }], ['Sol pleno', { cat: 'interior', luz: 'sol' }]] },
        { titulo: 'Por porte', links: [['Pequenas', { cat: 'interior', porte: 'pequeno' }], ['Médias', { cat: 'interior', porte: 'medio' }], ['Grandes', { cat: 'interior', porte: 'grande' }]] },
        { titulo: 'Para começar', links: [['Fáceis de cuidar', { cat: 'interior', cuidado: 'facil' }], ['Cuidado moderado', { cat: 'interior', cuidado: 'moderado' }]] }
      ]
    },
    {
      key: 'exterior', nome: 'Exterior', icone: 'sun',
      destaque: { titulo: 'Jardim e varanda', texto: 'Ervas e plantas que pedem sol e espaço ao ar livre.', cta: 'Ver exterior', filtro: { cat: 'exterior' } },
      grupos: [
        { titulo: 'Por luz', links: [['Meia-sombra', { cat: 'exterior', luz: 'meia' }], ['Sol pleno', { cat: 'exterior', luz: 'sol' }]] },
        { titulo: 'Por uso', links: [['Ervas aromáticas', { cat: 'exterior' }], ['Floração', { cat: 'exterior', cuidado: 'moderado' }]] }
      ]
    },
    {
      key: 'suculentas', nome: 'Suculentas', icone: 'droplet',
      destaque: { titulo: 'Rega espaçada', texto: 'Suculentas e cactos para quem viaja ou esquece de regar.', cta: 'Ver suculentas', filtro: { cat: 'suculentas' } },
      grupos: [
        { titulo: 'Tamanho', links: [['Miniaturas', { cat: 'suculentas', porte: 'pequeno' }], ['Médias', { cat: 'suculentas', porte: 'medio' }]] },
        { titulo: 'Por luz', links: [['Sol pleno', { cat: 'suculentas', luz: 'sol' }], ['Meia-sombra', { cat: 'suculentas', luz: 'meia' }]] }
      ]
    },
    {
      key: 'vasos', nome: 'Vasos', icone: 'pot',
      destaque: { titulo: 'Vasos e cachepôs', texto: 'Cerâmica e terracota com drenagem e prato.', cta: 'Ver vasos', filtro: { cat: 'vasos' } },
      grupos: [
        { titulo: 'Tamanho', links: [['Pequenos', { cat: 'vasos', porte: 'pequeno' }], ['Médios', { cat: 'vasos', porte: 'medio' }], ['Grandes', { cat: 'vasos', porte: 'grande' }]] },
        { titulo: 'Material', links: [['Cerâmica', { cat: 'vasos' }], ['Terracota', { cat: 'vasos' }]] }
      ]
    },
    {
      key: 'cuidados', nome: 'Cuidados', icone: 'droplet',
      destaque: { titulo: 'Para a sua planta', texto: 'Terra, adubo e tudo o que ajuda a planta a crescer.', cta: 'Ver cuidados', filtro: { cat: 'cuidados' } },
      grupos: [
        { titulo: 'Nutrição', links: [['Adubos', { cat: 'cuidados' }], ['Substratos', { cat: 'cuidados' }]] }
      ]
    },
    {
      key: 'acessorios', nome: 'Acessórios', icone: 'tool',
      destaque: { titulo: 'Ferramentas do ateliê', texto: 'Regadores, tesouras e kits para começar.', cta: 'Ver acessórios', filtro: { cat: 'acessorios' } },
      grupos: [
        { titulo: 'Ferramentas', links: [['Regadores', { cat: 'acessorios' }], ['Kits', { cat: 'acessorios' }]] }
      ]
    }
  ];

  VV.products = [
    { id: 'jiboia', nome: 'Jiboia prateada', cat: 'interior', descricao: 'Porte pequeno, folhas prateadas. Aceita meia-sombra e rega a cada 10 dias.', preco: 89.9, luz: 'meia', porte: 'pequeno', cuidado: 'facil', rega: 'Rega a cada 10 dias', novo: true, vendas: 88, arte: 'folha', tom: 1 },
    { id: 'espada', nome: 'Espada-de-são-jorge', cat: 'interior', descricao: 'Resistente e de fácil manejo. Porte médio, adapta-se a ambientes internos.', preco: 64.9, luz: 'meia', porte: 'medio', cuidado: 'facil', rega: 'Rega semanal', novo: false, vendas: 120, arte: 'folha', tom: 2 },
    { id: 'zamioculca', nome: 'Zamioculca', cat: 'interior', descricao: 'Folhas brilhantes e rígidas. Tolera sombra, porte médio, rega quinzenal.', preco: 119.9, luz: 'sombra', porte: 'medio', cuidado: 'facil', rega: 'Rega quinzenal', novo: true, vendas: 64, arte: 'folha', tom: 3 },
    { id: 'monstera', nome: 'Monstera deliciosa', cat: 'interior', descricao: 'Folhas recortadas e porte grande. Pede luz indireta e rega semanal.', preco: 189.9, luz: 'meia', porte: 'grande', cuidado: 'moderado', rega: 'Rega semanal', novo: false, vendas: 150, arte: 'folha', tom: 1 },
    { id: 'ficus-lyrata', nome: 'Ficus lyrata', cat: 'interior', descricao: 'Folhas grandes em forma de violino. Precisa de sol claro e rega moderada.', preco: 249.9, luz: 'sol', porte: 'grande', cuidado: 'moderado', rega: 'Rega semanal', novo: false, vendas: 95, arte: 'folha', tom: 2 },
    { id: 'samambaia', nome: 'Samambaia americana', cat: 'exterior', descricao: 'Fronds finas e muito volume. Gosta de meia-sombra e umidade constante.', preco: 59.9, luz: 'meia', porte: 'medio', cuidado: 'facil', rega: 'Rega semanal', novo: false, vendas: 77, arte: 'folha', tom: 3 },
    { id: 'lavanda', nome: 'Lavanda francesa', cat: 'exterior', descricao: 'Aromática e florida. Pede sol pleno, terra drenada e rega espaçada.', preco: 74.9, luz: 'sol', porte: 'medio', cuidado: 'moderado', rega: 'Rega quinzenal', novo: true, vendas: 52, arte: 'folha', tom: 2 },
    { id: 'alecrim', nome: 'Alecrim de jardim', cat: 'exterior', descricao: 'Erva culinária de porte pequeno. Sol diário e rega quando a terra secar.', preco: 34.9, luz: 'sol', porte: 'pequeno', cuidado: 'facil', rega: 'Rega semanal', novo: false, vendas: 140, arte: 'folha', tom: 1 },
    { id: 'echeveria', nome: 'Echeveria lilás', cat: 'suculentas', descricao: 'Roseta compacta em tons lilás. Sol pleno e rega a cada 15 dias.', preco: 29.9, luz: 'sol', porte: 'pequeno', cuidado: 'facil', rega: 'Rega a cada 15 dias', novo: false, vendas: 180, arte: 'folha', tom: 3 },
    { id: 'haworthia', nome: 'Haworthia zebra', cat: 'suculentas', descricao: 'Listras brancas nas folhas. Meia-sombra, porte pequeno, rega mensal no inverno.', preco: 39.9, luz: 'meia', porte: 'pequeno', cuidado: 'facil', rega: 'Rega mensal no inverno', novo: true, vendas: 61, arte: 'folha', tom: 2 },
    { id: 'vaso-ceramica', nome: 'Vaso de cerâmica artesanal', cat: 'vasos', descricao: 'Esmalte fosco, 14 cm de diâmetro, com furo de drenagem e prato incluso.', preco: 79.9, luz: null, porte: 'pequeno', cuidado: 'facil', rega: 'Compatível com todas as plantas', novo: true, vendas: 45, arte: 'vaso', tom: 2 },
    { id: 'vaso-terracota', nome: 'Vaso de terracota com prato', cat: 'vasos', descricao: 'Terracota natural, 25 cm de diâmetro. Ótimo para plantas de porte médio.', preco: 94.9, luz: null, porte: 'medio', cuidado: 'facil', rega: 'Compatível com todas as plantas', novo: false, vendas: 38, arte: 'vaso', tom: 3 },
    { id: 'adubo', nome: 'Adubo orgânico 500 g', cat: 'cuidados', descricao: 'Composto de minhocas, sem odor forte. Aplique a cada 60 dias na estação de crescimento.', preco: 32.9, luz: null, porte: 'pequeno', cuidado: 'facil', rega: 'Aplicar a cada 60 dias', novo: false, vendas: 99, arte: 'saco', tom: 1 },
    { id: 'terra', nome: 'Substrato para suculentas 5 L', cat: 'cuidados', descricao: 'Mistura drenante com areia e pó de pedra. Ideal para suculentas e cactos.', preco: 27.9, luz: null, porte: 'medio', cuidado: 'facil', rega: 'Troque a cada 2 anos', novo: false, vendas: 70, arte: 'saco', tom: 2 },
    { id: 'kit-inicial', nome: 'Kit de cuidados básicos', cat: 'acessorios', descricao: 'Regador, tesoura de poda, luva e guia de cuidados impresso. Para começar.', preco: 129.9, luz: null, porte: 'medio', cuidado: 'facil', rega: 'Para o primeiro ano', novo: true, vendas: 83, arte: 'kit', tom: 1 },
    { id: 'regador', nome: 'Regador de metal 1 L', cat: 'acessorios', descricao: 'Bico fino para regar sem molhar as folhas. Acabamento em metal escovado.', preco: 59.9, luz: null, porte: 'pequeno', cuidado: 'facil', rega: 'Bico fino incluso', novo: false, vendas: 56, arte: 'kit', tom: 3 }
  ];

  VV.labels = {
    luz: { sombra: 'Sombra', meia: 'Meia-sombra', sol: 'Sol pleno' },
    porte: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' },
    cuidado: { facil: 'Fácil', moderado: 'Moderado', avancado: 'Avançado' },
    ord: { relevancia: 'Relevância', menor: 'Menor preço', maior: 'Maior preço', nome: 'Nome (A–Z)' },
    preco: { todos: 'Todos os preços', ate60: 'Até R$ 60', de60a120: 'R$ 60 a R$ 120', acima120: 'Acima de R$ 120' }
  };

  VV.catName = function (key) {
    var c = VV.categories.filter(function (x) { return x.key === key; })[0];
    return c ? c.nome : key;
  };

  VV.hash = function (s) {
    var h = 0, str = String(s);
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  };

  /* Ilustração placeholder: vaso com folhas, cores pelas classes .ill-* (tokens). */
  VV.art = function (key, o) {
    o = o || {};
    var W = o.w || 200, H = o.h || 160, h = VV.hash(key);
    var tone = (o.tone || (h % 3) + 1);
    var withLeaves = o.leaves !== false;
    var cx = W / 2, base = H * (o.base || 0.66), potW = W * 0.34, potH = H * 0.2, top = base - potH * 0.25;
    var n = 5 + (h % 3), leaves = '';
    if (withLeaves) {
      for (var i = 0; i < n; i++) {
        var a = -72 + (144 / (n - 1)) * i + ((h >> i) % 5) - 2;
        var len = H * (0.3 + (((h >> (i + 2)) % 5) * 0.035));
        var cls = i % 2 ? 'ill-leaf' : 'ill-leaf-2';
        leaves += '<path class="' + cls + '" transform="translate(' + cx + ' ' + top + ') rotate(' + a + ')" d="M0 0C' +
          (len * 0.24) + ' ' + (-len * 0.45) + ' ' + (len * 0.16) + ' ' + (-len * 0.9) + ' 0 ' + (-len) +
          'C' + (-len * 0.16) + ' ' + (-len * 0.9) + ' ' + (-len * 0.24) + ' ' + (-len * 0.45) + ' 0 0Z"/>';
      }
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect class="ill-bg ill-bg-' + tone + '" width="' + W + '" height="' + H + '"/>' + leaves +
      '<rect class="ill-rim" x="' + (cx - potW / 2 - 6) + '" y="' + (top - 9) + '" width="' + (potW + 12) + '" height="10" rx="4"/>' +
      '<path class="ill-pot" d="M' + (cx - potW / 2) + ' ' + top + 'h' + potW + 'l' + (-potW * 0.08) + ' ' + potH + 'h' + (-potW * 0.84) + 'z"/>' +
      '</svg>';
  };
})();
