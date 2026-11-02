/* Dados fictícios da loja Verde Vivo (sem backend). */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});

  /* ---------- Categorias ---------- */
  // label: rótulo curto (<= 10 caracteres, usado nas pílulas do celular)
  VV.CATS = {
    todas: { label: 'Todas', title: 'Todo o catálogo', icon: 'grid', desc: 'Plantas, vasos, itens de cuidado e criações do ateliê.' },
    plantas: { label: 'Plantas', title: 'Plantas', icon: 'sprout', desc: 'Espécies cultivadas no nosso viveiro e enviadas com guia de cuidados.' },
    folhagens: { label: 'Folhagens', title: 'Folhagens', parent: 'plantas', icon: 'leaf', desc: 'Folhas recortadas, listradas e brilhantes para dar volume à casa.' },
    suculentas: { label: 'Suculentas', title: 'Suculentas e cactos', parent: 'plantas', icon: 'cactus', desc: 'Para janelas ensolaradas e para quem esquece o regador.' },
    pendentes: { label: 'Pendentes', title: 'Pendentes', parent: 'plantas', icon: 'hanging', desc: 'Ramas que caem de prateleiras, ganchos e estantes.' },
    floriferas: { label: 'Floríferas', title: 'Floríferas', parent: 'plantas', icon: 'flower', desc: 'Flores que duram semanas com pouca manutenção.' },
    arvores: { label: 'Árvores', title: 'Árvores e palmeiras', parent: 'plantas', icon: 'tree', desc: 'Porte grande para salas amplas e cantos iluminados.' },
    vasos: { label: 'Vasos', title: 'Vasos e cachepôs', icon: 'pot', desc: 'Cerâmica, fibra natural e vasos autoirrigáveis.' },
    cuidados: { label: 'Cuidados', title: 'Cuidados', icon: 'droplet', desc: 'Substratos, adubos e ferramentas para manter tudo verde.' },
    nutricao: { label: 'Adubos', title: 'Adubos e substratos', parent: 'cuidados', icon: 'droplet', desc: 'Nutrição na medida certa para cada tipo de planta.' },
    ferramentas: { label: 'Ferramentas', title: 'Regadores e ferramentas', parent: 'cuidados', icon: 'scissors', desc: 'Regadores, pás e tesouras de poda.' },
    atelie: { label: 'Ateliê', title: 'Ateliê Verde Vivo', icon: 'scissors', desc: 'Terrários, kokedamas e arranjos montados à mão no ateliê.' }
  };

  // Faixa de categorias do celular (mesmos destinos do desktop)
  VV.STRIP = ['todas', 'plantas', 'folhagens', 'suculentas', 'pendentes', 'floriferas', 'arvores', 'vasos', 'cuidados', 'atelie'];
  // Linha 2 do header (5 itens: Departamentos + 4 atalhos)
  VV.NAV = ['plantas', 'vasos', 'cuidados', 'atelie'];

  VV.MEGA = [
    { title: 'Plantas por tipo', links: [
      { label: 'Folhagens', href: '#/catalogo?cat=folhagens' },
      { label: 'Suculentas e cactos', href: '#/catalogo?cat=suculentas' },
      { label: 'Pendentes', href: '#/catalogo?cat=pendentes' },
      { label: 'Floríferas', href: '#/catalogo?cat=floriferas' },
      { label: 'Árvores e palmeiras', href: '#/catalogo?cat=arvores' }
    ] },
    { title: 'Por ambiente', links: [
      { label: 'Pouca luz', href: '#/catalogo?cat=plantas&luz=sombra,meia-sombra' },
      { label: 'Luz indireta', href: '#/catalogo?cat=plantas&luz=indireta' },
      { label: 'Sol pleno', href: '#/catalogo?cat=plantas&luz=sol' },
      { label: 'Seguras para pets', href: '#/catalogo?cat=plantas&extra=pet' },
      { label: 'Fáceis de cuidar', href: '#/catalogo?cat=plantas&extra=facil' }
    ] },
    { title: 'Vasos e cuidados', links: [
      { label: 'Vasos e cachepôs', href: '#/catalogo?cat=vasos' },
      { label: 'Adubos e substratos', href: '#/catalogo?cat=nutricao' },
      { label: 'Regadores e ferramentas', href: '#/catalogo?cat=ferramentas' },
      { label: 'Kits e terrários do ateliê', href: '#/catalogo?cat=atelie' }
    ] }
  ];

  /* ---------- Filtros do painel ---------- */
  VV.FILTERS = [
    { key: 'luz', label: 'Luminosidade', icon: 'sun', options: [
      { v: 'sombra', l: 'Sombra' }, { v: 'meia-sombra', l: 'Meia-sombra' }, { v: 'indireta', l: 'Luz indireta' }, { v: 'sol', l: 'Sol pleno' }
    ], test: function (p, vals) { return !!p.luz && vals.some(function (v) { return p.luz.indexOf(v) > -1; }); } },
    { key: 'rega', label: 'Rega', icon: 'droplet', options: [
      { v: 'pouca', l: 'Pouca' }, { v: 'moderada', l: 'Moderada' }, { v: 'frequente', l: 'Frequente' }
    ], test: function (p, vals) { return vals.indexOf(p.rega) > -1; } },
    { key: 'porte', label: 'Porte', icon: 'ruler', options: [
      { v: 'pequeno', l: 'Pequeno' }, { v: 'medio', l: 'Médio' }, { v: 'grande', l: 'Grande' }
    ], test: function (p, vals) { return vals.indexOf(p.porte) > -1; } },
    { key: 'preco', label: 'Preço', icon: 'bag', options: [
      { v: 'ate-50', l: 'Até R$ 50' }, { v: '50-100', l: 'R$ 50 a R$ 100' }, { v: '100-200', l: 'R$ 100 a R$ 200' }, { v: 'acima-200', l: 'Acima de R$ 200' }
    ], test: function (p, vals) {
      return vals.some(function (v) {
        if (v === 'ate-50') return p.preco <= 50;
        if (v === '50-100') return p.preco > 50 && p.preco <= 100;
        if (v === '100-200') return p.preco > 100 && p.preco <= 200;
        return p.preco > 200;
      });
    } },
    { key: 'extra', label: 'Características', icon: 'sparkle', options: [
      { v: 'pet', l: 'Segura para pets' }, { v: 'facil', l: 'Fácil de cuidar' }, { v: 'estoque', l: 'Disponível para entrega' }
    ], test: function (p, vals) {
      return vals.every(function (v) {
        if (v === 'pet') return p.pet === true;
        if (v === 'facil') return p.facil === true;
        return p.estoque > 0;
      });
    } }
  ];

  VV.SORTS = [
    { v: 'relevancia', l: 'Relevância' },
    { v: 'novidades', l: 'Novidades' },
    { v: 'menor-preco', l: 'Menor preço' },
    { v: 'maior-preco', l: 'Maior preço' },
    { v: 'nome', l: 'Nome (A–Z)' }
  ];

  VV.LABELS = {
    luz: { sombra: 'Sombra', 'meia-sombra': 'Meia-sombra', indireta: 'Luz indireta', sol: 'Sol pleno' },
    rega: { pouca: 'Pouca (a cada 10–15 dias)', moderada: 'Moderada (1× por semana)', frequente: 'Frequente (2× por semana)' },
    porte: { pequeno: 'Pequeno (até 30 cm)', medio: 'Médio (30–80 cm)', grande: 'Grande (acima de 80 cm)' }
  };

  /* ---------- Produtos ---------- */
  function P(o) { return o; }
  VV.PRODUCTS = [
    P({ id: 'costela-de-adao', nome: 'Costela-de-adão', sci: 'Monstera deliciosa', cat: 'plantas', tipo: 'folhagens', preco: 139.9, best: true, luz: ['meia-sombra', 'indireta'], rega: 'moderada', porte: 'grande', pet: false, facil: true, estoque: 12,
      resumo: 'Folhas recortadas e porte grande. Pede luz indireta e rega semanal; cresce rápido em vasos de 30 cm.',
      desc: 'A costela-de-adão chega com cerca de 70 cm, em vaso de cerâmica com drenagem. As folhas novas abrem enroladas e ganham recortes conforme a planta amadurece. Mantenha longe do sol direto da tarde e limpe as folhas com pano úmido a cada quinze dias.',
      art: { kind: 'monstera', pot: 'terracota' } }),
    P({ id: 'jiboia', nome: 'Jiboia', sci: 'Epipremnum aureum', cat: 'plantas', tipo: 'pendentes', preco: 49.9, best: true, luz: ['sombra', 'meia-sombra', 'indireta'], rega: 'moderada', porte: 'medio', pet: false, facil: true, estoque: 30,
      resumo: 'Ramas pendentes que crescem até 1 m. Tolera pouca luz e avisa quando quer água: as folhas murcham levemente.',
      desc: 'Clássica de estantes e prateleiras, a jiboia é a planta mais tolerante do catálogo. Enviamos em vaso suspenso com corda de algodão. Pode ser podada para ficar mais cheia e as mudas enraízam em um copo d’água.',
      art: { kind: 'pothos', pot: 'suspenso' } }),
    P({ id: 'espada-de-sao-jorge', nome: 'Espada-de-são-jorge', sci: 'Dracaena trifasciata', cat: 'plantas', tipo: 'folhagens', preco: 69.9, best: true, luz: ['sombra', 'meia-sombra', 'indireta', 'sol'], rega: 'pouca', porte: 'medio', pet: false, facil: true, estoque: 18,
      resumo: 'Folhas eretas e listradas, vai bem do canto escuro à varanda. Rega a cada duas semanas, no máximo.',
      desc: 'Resistente a esquecimento, ar-condicionado e mudança de lugar. O maior risco é o excesso de água: espere o substrato secar completamente entre as regas. Chega com 50 a 60 cm em vaso cilíndrico grafite.',
      art: { kind: 'snake', pot: 'cilindro' } }),
    P({ id: 'zamioculca', nome: 'Zamioculca', sci: 'Zamioculcas zamiifolia', cat: 'plantas', tipo: 'folhagens', preco: 89.9, luz: ['sombra', 'meia-sombra'], rega: 'pouca', porte: 'medio', pet: false, facil: true, estoque: 9,
      resumo: 'Folhas brilhantes que vivem bem longe da janela. Armazena água nos rizomas e aguenta semanas sem rega.',
      desc: 'Ideal para escritórios e corredores. A zamioculca cresce devagar e mantém o formato por anos. Regue apenas quando o substrato estiver seco até a metade do vaso.',
      art: { kind: 'zz', pot: 'ceramica' } }),
    P({ id: 'calathea-orbifolia', nome: 'Calathea orbifolia', sci: 'Goeppertia orbifolia', cat: 'plantas', tipo: 'folhagens', preco: 119.9, precoDe: 139.9, luz: ['meia-sombra', 'indireta'], rega: 'frequente', porte: 'medio', pet: true, facil: false, estoque: 6,
      resumo: 'Folhas redondas com listras prateadas. Gosta de umidade, luz filtrada e substrato sempre levemente úmido.',
      desc: 'As folhas se fecham à noite e abrem pela manhã. Prefere água filtrada ou de chuva e borrifadas nos dias secos. Atóxica para cães e gatos.',
      art: { kind: 'calathea', pot: 'ceramica' } }),
    P({ id: 'peperomia', nome: 'Peperômia', sci: 'Peperomia obtusifolia', cat: 'plantas', tipo: 'folhagens', preco: 39.9, novo: true, luz: ['meia-sombra', 'indireta'], rega: 'moderada', porte: 'pequeno', pet: true, facil: true, estoque: 22,
      resumo: 'Folhas carnudas e arredondadas em porte compacto. Boa para mesas de trabalho e prateleiras baixas.',
      desc: 'Uma das plantas mais fáceis para começar. Acumula água nas folhas e prefere regas espaçadas. Atóxica para pets.',
      art: { kind: 'peperomia', pot: 'terracota' } }),
    P({ id: 'samambaia', nome: 'Samambaia', sci: 'Nephrolepis exaltata', cat: 'plantas', tipo: 'pendentes', preco: 59.9, luz: ['meia-sombra', 'indireta'], rega: 'frequente', porte: 'medio', pet: true, facil: false, estoque: 14,
      resumo: 'Frondes longas e cheias para varandas cobertas. Pede rega frequente e ambiente com umidade.',
      desc: 'A samambaia gosta de luz abundante, mas sem sol direto. Em dias quentes, regue a cada dois dias e borrife as folhas. Enviada em vaso suspenso.',
      art: { kind: 'fern', pot: 'suspenso' } }),
    P({ id: 'echeveria', nome: 'Echevéria', sci: 'Echeveria elegans', cat: 'plantas', tipo: 'suculentas', preco: 24.9, best: true, luz: ['sol', 'indireta'], rega: 'pouca', porte: 'pequeno', pet: true, facil: true, estoque: 40,
      resumo: 'Roseta compacta em tons de verde-azulado. Precisa de sol pelo menos meio período e rega a cada 10 dias.',
      desc: 'Perfeita para janelas e varandas ensolaradas. Use substrato bem drenado e evite molhar o centro da roseta. Vai em tigela de cerâmica de 12 cm.',
      art: { kind: 'rosette', pot: 'tigela' } }),
    P({ id: 'mandacaru', nome: 'Cacto mandacaru', sci: 'Cereus jamacaru', cat: 'plantas', tipo: 'suculentas', preco: 54.9, luz: ['sol'], rega: 'pouca', porte: 'medio', pet: false, facil: true, estoque: 11,
      resumo: 'Cacto colunar brasileiro, de crescimento lento. Sol pleno e regas raras, apenas quando o vaso secar.',
      desc: 'Nativo da caatinga, o mandacaru é extremamente resistente. Manuseie com luvas: os espinhos são firmes. Chega com cerca de 40 cm.',
      art: { kind: 'cactus', pot: 'terracota' } }),
    P({ id: 'babosa', nome: 'Babosa', sci: 'Aloe vera', cat: 'plantas', tipo: 'suculentas', preco: 34.9, luz: ['sol', 'indireta'], rega: 'pouca', porte: 'pequeno', pet: false, facil: true, estoque: 25,
      resumo: 'Suculenta de folhas grossas e gel interno. Gosta de sol e de substrato arenoso, com regas espaçadas.',
      desc: 'Fácil de multiplicar: as mudinhas nascem ao redor da planta-mãe. Evite deixar água acumulada no pratinho.',
      art: { kind: 'aloe', pot: 'terracota' } }),
    P({ id: 'colar-de-perolas', nome: 'Colar-de-pérolas', sci: 'Curio rowleyanus', cat: 'plantas', tipo: 'pendentes', preco: 44.9, novo: true, luz: ['indireta', 'sol'], rega: 'pouca', porte: 'pequeno', pet: false, facil: false, estoque: 7,
      resumo: 'Suculenta pendente com folhas em forma de pérola. Precisa de muita luz e regas leves e espaçadas.',
      desc: 'Fica linda em prateleiras altas, com as ramas caindo. É sensível a excesso de água: regue pouco e apenas quando as pérolas começarem a enrugar.',
      art: { kind: 'pearls', pot: 'suspenso' } }),
    P({ id: 'orquidea-phalaenopsis', nome: 'Orquídea phalaenopsis', sci: 'Phalaenopsis sp.', cat: 'plantas', tipo: 'floriferas', preco: 99.9, luz: ['indireta'], rega: 'moderada', porte: 'medio', pet: true, facil: false, estoque: 10,
      resumo: 'Hastes com flores brancas que duram até três meses. Luz filtrada e rega por imersão uma vez por semana.',
      desc: 'Enviada com haste florida e botões a abrir. Depois da floração, corte a haste acima do segundo nó para estimular nova florada.',
      art: { kind: 'orchid', pot: 'ceramica' } }),
    P({ id: 'anturio', nome: 'Antúrio', sci: 'Anthurium andraeanum', cat: 'plantas', tipo: 'floriferas', preco: 79.9, luz: ['meia-sombra', 'indireta'], rega: 'moderada', porte: 'medio', pet: false, facil: true, estoque: 15,
      resumo: 'Folhas em formato de coração e flores cerosas que duram semanas. Meia-sombra e rega semanal.',
      desc: 'Florido quase o ano todo quando recebe luz clara e indireta. Adube a cada dois meses com adubo para floríferas.',
      art: { kind: 'anthurium', pot: 'cilindro' } }),
    P({ id: 'lirio-da-paz', nome: 'Lírio-da-paz', sci: 'Spathiphyllum wallisii', cat: 'plantas', tipo: 'floriferas', preco: 64.9, luz: ['sombra', 'meia-sombra'], rega: 'frequente', porte: 'medio', pet: false, facil: true, estoque: 0,
      resumo: 'Flores brancas e folhas escuras que toleram pouca luz. Avisa quando está com sede: as folhas caem.',
      desc: 'Uma das poucas floríferas que vivem bem longe da janela. Volta ao estoque em breve, assim que o próximo lote do viveiro estiver pronto.',
      art: { kind: 'peace', pot: 'terracota' } }),
    P({ id: 'palmeira-areca', nome: 'Palmeira-areca', sci: 'Dypsis lutescens', cat: 'plantas', tipo: 'arvores', preco: 189.9, luz: ['indireta', 'sol'], rega: 'moderada', porte: 'grande', pet: true, facil: true, estoque: 5,
      resumo: 'Palmeira de folhas arqueadas que chega a 1,5 m. Luz abundante e rega quando a superfície secar.',
      desc: 'Traz volume para salas e varandas cobertas. Enviada em cesto de fibra natural com vaso plástico interno. Atóxica para pets.',
      art: { kind: 'palm', pot: 'cesto' } }),
    P({ id: 'figueira-lira', nome: 'Figueira-lira', sci: 'Ficus lyrata', cat: 'plantas', tipo: 'arvores', preco: 229.9, novo: true, luz: ['indireta', 'sol'], rega: 'moderada', porte: 'grande', pet: false, facil: false, estoque: 4,
      resumo: 'Folhas grandes em forma de lira sobre tronco fino. Precisa de muita luz e não gosta de mudar de lugar.',
      desc: 'Escolha um ponto perto de uma janela ampla e mantenha a planta ali. Gire o vaso a cada mês para crescer reta. Chega com 1 m de altura.',
      art: { kind: 'ficus', pot: 'cesto' } }),
    P({ id: 'maranta-tricolor', nome: 'Maranta-tricolor', sci: 'Maranta leuconeura', cat: 'plantas', tipo: 'folhagens', preco: 49.9, luz: ['meia-sombra', 'indireta'], rega: 'frequente', porte: 'pequeno', pet: true, facil: false, estoque: 13,
      resumo: 'Folhas com nervuras rosadas que se dobram à noite. Gosta de umidade e de luz suave.',
      desc: 'Conhecida como planta-que-reza por causa do movimento das folhas. Mantenha o substrato úmido, nunca encharcado. Atóxica para pets.',
      art: { kind: 'maranta', pot: 'ceramica' } }),
    P({ id: 'begonia-maculata', nome: 'Begônia-maculata', sci: 'Begonia maculata', cat: 'plantas', tipo: 'folhagens', preco: 74.9, novo: true, luz: ['indireta'], rega: 'moderada', porte: 'medio', pet: false, facil: false, estoque: 8,
      resumo: 'Folhas em formato de asa com bolinhas prateadas. Luz indireta clara e rega quando o topo secar.',
      desc: 'Cresce em hastes que lembram bambu. Evite molhar as folhas e mantenha longe de correntes de ar frio.',
      art: { kind: 'begonia', pot: 'ceramica' } }),
    P({ id: 'pilea', nome: 'Pilea', sci: 'Pilea peperomioides', cat: 'plantas', tipo: 'folhagens', preco: 42.9, luz: ['indireta'], rega: 'moderada', porte: 'pequeno', pet: true, facil: true, estoque: 19,
      resumo: 'Folhas redondas como moedas, em porte pequeno. Luz indireta e rega semanal; solta mudas com facilidade.',
      desc: 'Também chamada de planta-dinheiro-chinesa. Gire o vaso a cada semana para as folhas crescerem por igual. Atóxica para pets.',
      art: { kind: 'pilea', pot: 'terracota' } }),

    P({ id: 'vaso-terra', nome: 'Vaso de cerâmica Terra · 18 cm', cat: 'vasos', preco: 59.9, best: true, estoque: 35,
      resumo: 'Cerâmica com acabamento fosco, furo de drenagem e prato. Serve para plantas de porte pequeno e médio.',
      desc: 'Produzido por uma olaria parceira em Cunha (SP). Cada peça tem pequenas variações de cor. Diâmetro de 18 cm e altura de 16 cm.',
      art: { kind: 'potonly' } }),
    P({ id: 'cachepo-fibra', nome: 'Cachepô de fibra natural · 24 cm', cat: 'vasos', preco: 79.9, novo: true, estoque: 16,
      resumo: 'Trançado à mão em fibra de bananeira, com alças. Use com um vaso plástico interno.',
      desc: 'Leve e resistente, combina com palmeiras e folhagens grandes. Não é impermeável: mantenha o vaso interno com prato.',
      art: { kind: 'basket' } }),
    P({ id: 'vaso-autoirrigavel', nome: 'Vaso autoirrigável · 20 cm', cat: 'vasos', preco: 69.9, precoDe: 84.9, estoque: 21,
      resumo: 'Reservatório com visor de nível que mantém a umidade por até 10 dias. Ideal para viagens.',
      desc: 'Feito de plástico reciclado com acabamento fosco. O cordão de algodão leva a água do reservatório até as raízes conforme a necessidade.',
      art: { kind: 'selfwater' } }),
    P({ id: 'suporte-madeira', nome: 'Suporte de madeira com vaso', cat: 'vasos', preco: 149.9, estoque: 6,
      resumo: 'Suporte de eucalipto de reflorestamento com vaso de cerâmica de 20 cm. Eleva a planta a 45 cm do chão.',
      desc: 'Montagem simples, sem ferramentas. Acabamento com óleo vegetal, seguro para uso interno.',
      art: { kind: 'stand' } }),

    P({ id: 'substrato-folhagens', nome: 'Substrato para folhagens · 5 kg', cat: 'cuidados', tipo: 'nutricao', preco: 29.9, estoque: 50,
      resumo: 'Mistura de fibra de coco, casca de pinus e húmus. Leve, drenante e pronto para usar.',
      desc: 'Formulado no nosso viveiro para folhagens tropicais. Rende cerca de três vasos de 20 cm.',
      art: { kind: 'bag' } }),
    P({ id: 'adubo-organico', nome: 'Adubo orgânico líquido · 500 ml', cat: 'cuidados', tipo: 'nutricao', preco: 32.9, best: true, estoque: 44,
      resumo: 'Concentrado à base de algas e húmus. Dilua 5 ml por litro de água e aplique a cada 15 dias.',
      desc: 'Fortalece folhas e raízes sem risco de queimar a planta. Pode ser usado em folhagens, floríferas e suculentas.',
      art: { kind: 'bottle' } }),
    P({ id: 'regador-latao', nome: 'Regador de latão · 1 L', cat: 'cuidados', tipo: 'ferramentas', preco: 119.9, estoque: 9,
      resumo: 'Bico longo e fino para regar sem molhar as folhas. Latão escovado que ganha pátina com o tempo.',
      desc: 'Capacidade de 1 litro, leve e equilibrado. Acompanha um crivo removível para regas mais suaves em mudas.',
      art: { kind: 'can' } }),
    P({ id: 'kit-ferramentas', nome: 'Kit de ferramentas de jardinagem', cat: 'cuidados', tipo: 'ferramentas', preco: 89.9, estoque: 0,
      resumo: 'Pá, garfo e tesoura de poda com cabos de madeira. Acompanha bolsa de lona para guardar.',
      desc: 'Aço inox resistente à ferrugem. Volta ao estoque em breve.',
      art: { kind: 'tools' } }),

    P({ id: 'terrario-vidro', nome: 'Terrário de vidro montado no ateliê', cat: 'atelie', preco: 159.9, novo: true, luz: ['indireta'], rega: 'pouca', porte: 'pequeno', pet: true, facil: true, estoque: 5,
      resumo: 'Microjardim com musgo, pedras e mini plantas em cúpula de vidro. Rega com borrifador uma vez por mês.',
      desc: 'Cada terrário é montado à mão, em camadas de drenagem, carvão e substrato. Mantenha em luz indireta, nunca ao sol.',
      art: { kind: 'terrarium' } }),
    P({ id: 'kit-kokedama', nome: 'Kit kokedama faça você mesmo', cat: 'atelie', preco: 89.9, luz: ['meia-sombra', 'indireta'], rega: 'moderada', porte: 'pequeno', pet: false, facil: true, estoque: 12,
      resumo: 'Muda de jiboia, musgo, substrato e barbante para montar sua kokedama, com passo a passo ilustrado.',
      desc: 'Uma atividade de cerca de 40 minutos. Para regar, mergulhe a esfera em água por 10 minutos uma vez por semana.',
      art: { kind: 'kokedama' } }),
    P({ id: 'arranjo-suculentas', nome: 'Arranjo de suculentas em bandeja', cat: 'atelie', preco: 119.9, luz: ['sol', 'indireta'], rega: 'pouca', porte: 'pequeno', pet: true, facil: true, estoque: 7,
      resumo: 'Cinco suculentas combinadas em bandeja de madeira, prontas para presentear. Sol e rega a cada 10 dias.',
      desc: 'Montado no ateliê no dia do envio. A composição varia conforme as espécies disponíveis no viveiro.',
      art: { kind: 'tray' } })
  ];

  // Ordem original serve de "relevância"
  VV.PRODUCTS.forEach(function (p, i) { p.ordem = i; });

  VV.findProduct = function (id) {
    for (var i = 0; i < VV.PRODUCTS.length; i++) if (VV.PRODUCTS[i].id === id) return VV.PRODUCTS[i];
    return null;
  };

  VV.topCat = function (cat) {
    var c = VV.CATS[cat];
    if (!c) return null;
    return c.parent || cat;
  };

  VV.matchCat = function (p, cat) {
    if (!cat || cat === 'todas') return true;
    return p.cat === cat || p.tipo === cat;
  };

  /* Etiqueta do card: sempre presente (estrutura do componente) */
  VV.tagOf = function (p) {
    if (p.estoque === 0) return { label: 'Esgotado', cls: 'tag--off' };
    if (p.novo) return { label: 'Novo', cls: '' };
    if (p.precoDe) return { label: 'Oferta', cls: 'tag--accent' };
    if (p.best) return { label: 'Mais vendida', cls: '' };
    if (p.pet) return { label: 'Segura para pets', cls: '' };
    var t = VV.CATS[p.tipo || p.cat];
    return { label: t ? t.title.split(' e ')[0] : 'Verde Vivo', cls: '' };
  };

  VV.installments = function (preco) {
    var n = Math.min(10, Math.max(1, Math.floor(preco / 20)));
    return { n: n, valor: preco / n };
  };

  var brl = (typeof Intl !== 'undefined') ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }) : null;
  VV.fmt = function (n) {
    return brl ? brl.format(n).replace(/ /g, ' ') : 'R$ ' + n.toFixed(2).replace('.', ',');
  };

  VV.norm = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  VV.FREE_SHIPPING = 199;
  VV.SHIPPING_FEE = 19.9;

  VV.SEARCH_SUGGESTIONS = [
    { label: 'Plantas para pouca luz', sub: 'Sombra e meia-sombra', href: '#/catalogo?cat=plantas&luz=sombra,meia-sombra', icon: 'sun' },
    { label: 'Seguras para pets', sub: 'Atóxicas para cães e gatos', href: '#/catalogo?cat=plantas&extra=pet', icon: 'paw' },
    { label: 'Suculentas e cactos', sub: 'Categoria', href: '#/catalogo?cat=suculentas', icon: 'cactus' },
    { label: 'Costela-de-adão', sub: 'Mais vendida', href: '#/produto/costela-de-adao', icon: 'leaf' }
  ];
})();
