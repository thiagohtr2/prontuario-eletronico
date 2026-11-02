/* Dados ficticios da demonstracao (sem backend). Tudo vive na memoria da pagina. */
(function () {
  var C = (window.Conecta = window.Conecta || {});

  C.eu = 'ana';

  C.usuarios = [
    { id: 'ana', nome: 'Ana Souza', cargo: 'Product Designer', iniciais: 'AS', email: 'demo@conecta.app', seguidores: 1280, seguindo: 214, publicacoes: 24, sobre: 'Desenho produtos digitais e gosto de pesquisar com pessoas reais antes de desenhar telas.', seguida: false },
    { id: 'bruno', nome: 'Bruno Lima', cargo: 'Desenvolvedor front-end', iniciais: 'BL', seguidores: 642, seguindo: 180, publicacoes: 12, sobre: 'Escrevo interfaces acessíveis e rápidas. Curto café e bicicleta.', seguida: true },
    { id: 'carla', nome: 'Carla Mendes', cargo: 'Professora de história', iniciais: 'CM', seguidores: 910, seguindo: 96, publicacoes: 31, sobre: 'Histórias do cotidiano e fontes primárias para quem gosta de ler devagar.', seguida: true },
    { id: 'diego', nome: 'Diego Rocha', cargo: 'Fotógrafo', iniciais: 'DR', seguidores: 2301, seguindo: 75, publicacoes: 58, sobre: 'Fotografo ruas e feiras. Sempre levo uma câmera pequena no bolso.', seguida: false },
    { id: 'elisa', nome: 'Elisa Tavares', cargo: 'Engenheira de dados', iniciais: 'ET', seguidores: 388, seguindo: 140, publicacoes: 9, sobre: 'Modelos simples, perguntas claras e gráficos que cabem numa tela de celular.', seguida: false },
    { id: 'felipe', nome: 'Felipe Nunes', cargo: 'Músico', iniciais: 'FN', seguidores: 504, seguindo: 230, publicacoes: 17, sobre: 'Toco violão em praças e publico gravações caseiras às sextas.', seguida: false }
  ];

  C.publicacoes = [
    { id: 'p1', autor: 'bruno', tempo: 'há 2 h', variante: 1 },
    { id: 'p2', autor: 'carla', tempo: 'há 5 h', variante: 2 },
    { id: 'p3', autor: 'diego', tempo: 'ontem', variante: 3 },
    { id: 'p4', autor: 'elisa', tempo: 'há 2 dias', variante: 1 },
    { id: 'p5', autor: 'felipe', tempo: 'há 3 dias', variante: 2 },
    { id: 'p6', autor: 'ana', tempo: 'há 4 dias', variante: 3 }
  ];

  C.stories = ['bruno', 'carla', 'diego', 'elisa', 'felipe'];

  C.notificacoes = [
    { id: 'n1', texto: 'Bruno Lima comentou na sua publicação.', tempo: 'há 10 min', lida: false },
    { id: 'n2', texto: 'Carla Mendes começou a seguir você.', tempo: 'há 1 h', lida: false },
    { id: 'n3', texto: 'Evento “Encontro de design” amanhã às 19h.', tempo: 'há 3 h', lida: false },
    { id: 'n4', texto: 'Diego Rocha curtiu sua foto.', tempo: 'ontem', lida: true }
  ];

  C.conversas = [
    { id: 'c1', nome: 'Bruno Lima', previa: 'Vamos alinhar o layout?', tempo: '10:42', naoLidas: 2 },
    { id: 'c2', nome: 'Grupo Fotografia de rua', previa: 'Diego: novas fotos no álbum', tempo: 'ontem', naoLidas: 1 },
    { id: 'c3', nome: 'Elisa Tavares', previa: 'Obrigada pelo retorno!', tempo: 'seg.', naoLidas: 0 }
  ];

  C.grupos = [
    { id: 'g1', nome: 'Design de produto', membros: 1240, descricao: 'Pesquisa, UX e processos de design.' },
    { id: 'g2', nome: 'Fotografia de rua', membros: 860, descricao: 'Fotos de cidade, feiras e gente.' },
    { id: 'g3', nome: 'Leitura e história', membros: 420, descricao: 'Clubes de leitura e fontes históricas.' }
  ];

  C.eventos = [
    { id: 'e1', nome: 'Encontro de design', quando: 'Amanhã, 19h', local: 'Online' },
    { id: 'e2', nome: 'Feira de artesanato', quando: 'Sábado, 10h', local: 'Praça central' },
    { id: 'e3', nome: 'Roda de conversa', quando: 'Dia 14, 18h30', local: 'Biblioteca municipal' }
  ];

  /* Texto e titulo do card, conforme as propriedades aprovadas no PROMPT.md. */
  C.tituloCartao = 'Publicação da comunidade';
  C.textoCartao = 'Foto ou texto compartilhado por um perfil que você segue.';

  C.usuario = function (id) {
    for (var i = 0; i < C.usuarios.length; i++) {
      if (C.usuarios[i].id === id) return C.usuarios[i];
    }
    return null;
  };

  C.publicacao = function (id) {
    for (var i = 0; i < C.publicacoes.length; i++) {
      if (C.publicacoes[i].id === id) return C.publicacoes[i];
    }
    return null;
  };

  /* Ilustracoes em SVG (sem imagens externas). As cores vem dos tokens via classes CSS. */
  C.ilustracao = function (variante, capa) {
    var v = Number(variante) || 1;
    var base;
    if (capa) {
      base =
        '<defs><linearGradient id="gradCapa" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" class="ilu-g1"/><stop offset="1" class="ilu-g2"/></linearGradient></defs>' +
        '<rect width="1200" height="320" fill="url(#gradCapa)"/>' +
        '<circle cx="980" cy="110" r="70" class="ilu-a"/>' +
        '<path d="M0 260 C240 190 420 300 640 240 S980 200 1200 250 V320 H0 Z" class="ilu-w" opacity=".35"/>' +
        '<rect x="120" y="70" width="180" height="120" rx="16" class="ilu-w" opacity=".5"/>';
      return '<svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + base + '</svg>';
    }
    if (v === 1) {
      base =
        '<rect width="320" height="180" class="ilu-ps"/>' +
        '<circle cx="236" cy="58" r="30" class="ilu-a"/>' +
        '<path d="M0 130 C60 96 120 96 170 124 S280 150 320 116 V180 H0 Z" class="ilu-p"/>' +
        '<rect x="40" y="36" width="72" height="44" rx="8" class="ilu-w"/>' +
        '<circle cx="64" cy="54" r="7" class="ilu-s"/>';
    } else if (v === 2) {
      base =
        '<rect width="320" height="180" class="ilu-b"/>' +
        '<rect x="28" y="28" width="120" height="124" rx="12" class="ilu-s"/>' +
        '<circle cx="208" cy="90" r="46" class="ilu-p"/>' +
        '<rect x="236" y="22" width="56" height="20" rx="10" class="ilu-a"/>';
    } else {
      base =
        '<rect width="320" height="180" class="ilu-t"/>' +
        '<path d="M0 180 L0 110 Q80 40 160 110 T320 110 L320 180 Z" class="ilu-a"/>' +
        '<circle cx="96" cy="64" r="22" class="ilu-p"/>' +
        '<rect x="200" y="46" width="88" height="54" rx="10" class="ilu-s"/>';
    }
    return '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + base + '</svg>';
  };
})();
