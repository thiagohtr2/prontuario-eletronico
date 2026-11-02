/* Dados fictícios da demonstração (sem backend) */
(function () {
  'use strict';

  var DEMO_ACCOUNT = {
    email: 'ana@conecta.app',
    phone: '11987654321',
    password: 'conecta123'
  };

  var ME = {
    id: 'u1',
    name: 'Ana Souza',
    role: 'Product Designer',
    email: 'ana@conecta.app',
    bio: 'Desenho produtos digitais que aproximam pessoas. Fotografia de rua nas horas vagas e café coado sempre.',
    location: 'São Paulo, SP',
    site: 'anasouza.design',
    tone: 'a',
    stats: { posts: 128, followers: 2431, following: 312 }
  };

  var USERS = [
    { id: 'u2', name: 'Bruno Lima', role: 'Fotógrafo', tone: 'b', location: 'São Paulo, SP', bio: 'Fotografia urbana e retratos. Saio cedo para pegar a melhor luz.', stats: { posts: 342, followers: 8120, following: 410 } },
    { id: 'u3', name: 'Carla Mendes', role: 'Jornalista de viagem', tone: 'c', location: 'Rio de Janeiro, RJ', bio: 'Roteiros curtos, comida local e histórias de estrada.', stats: { posts: 512, followers: 15400, following: 690 } },
    { id: 'u4', name: 'Diego Rocha', role: 'Músico', tone: 'd', location: 'Recife, PE', bio: 'Violão, produção caseira e playlists para todas as horas.', stats: { posts: 98, followers: 3210, following: 225 } },
    { id: 'u5', name: 'Elisa Prado', role: 'Barista', tone: 'e', location: 'Belo Horizonte, MG', bio: 'Café especial, métodos de preparo e cafeterias pequenas.', stats: { posts: 210, followers: 4870, following: 301 } },
    { id: 'u6', name: 'Felipe Nunes', role: 'Ilustrador', tone: 'b', location: 'Curitiba, PR', bio: 'Aquarela, cadernos de desenho e desafios semanais.', stats: { posts: 156, followers: 6020, following: 188 } },
    { id: 'u7', name: 'Gabriela Torres', role: 'Professora', tone: 'a', location: 'Porto Alegre, RS', bio: 'Organizo o clube do livro do Conecta. Leio de tudo um pouco.', stats: { posts: 77, followers: 1980, following: 420 } },
    { id: 'u8', name: 'Henrique Alves', role: 'Desenvolvedor', tone: 'd', location: 'Salvador, BA', bio: 'Código de dia, viagens no fim de semana.', stats: { posts: 64, followers: 1240, following: 350 } },
    { id: 'u9', name: 'Isabela Costa', role: 'Produtora cultural', tone: 'c', location: 'São Paulo, SP', bio: 'Feiras, encontros de bairro e eventos ao ar livre.', stats: { posts: 189, followers: 5230, following: 512 } },
    { id: 'u10', name: 'João Ribeiro', role: 'Editor de vídeo', tone: 'e', location: 'Florianópolis, SC', bio: 'Edição, cor e bastidores de pequenas produções.', stats: { posts: 120, followers: 2760, following: 275 } }
  ];

  var TOPICS = [
    { id: 'viagem', label: 'Viagem', icon: 'plane', tone: 'c' },
    { id: 'fotografia', label: 'Fotografia', icon: 'camera', tone: 'b' },
    { id: 'cafe', label: 'Café', icon: 'coffee', tone: 'e' },
    { id: 'musica', label: 'Música', icon: 'music', tone: 'd' },
    { id: 'leitura', label: 'Leitura', icon: 'book', tone: 'a' },
    { id: 'arte', label: 'Arte', icon: 'palette', tone: 'b' },
    { id: 'eventos', label: 'Eventos', icon: 'map-pin', tone: 'a' }
  ];

  var POSTS = [
    { id: 'p1', author: 'u3', topic: 'viagem', icon: 'plane', tone: 'a', tag: 'Novo', time: 'há 12 min', likes: 24,
      title: 'Publicação da comunidade',
      text: 'Foto ou texto compartilhado por um perfil que você segue.',
      full: 'Foto ou texto compartilhado por um perfil que você segue.\n\nEste é o cartão de exemplo da especificação: mídia em 16:9, etiqueta, título, texto de até três linhas e rodapé com metadados e a ação “Ver publicação”.' },
    { id: 'p2', author: 'u2', topic: 'fotografia', icon: 'camera', tone: 'b', tag: 'Fotografia', time: 'há 1 h', likes: 182,
      title: 'Luz da manhã no Ibirapuera',
      text: 'Saí às seis da manhã para testar a lente nova. A neblina deixou tudo com um tom suave que eu não esperava. Separei as cinco fotos favoritas e conto as configurações nos comentários.',
      full: 'Saí às seis da manhã para testar a lente nova. A neblina deixou tudo com um tom suave que eu não esperava.\n\nSeparei as cinco fotos favoritas e conto as configurações nos comentários. Spoiler: quase tudo em f/2.8, ISO 200.' },
    { id: 'p3', author: 'u5', topic: 'cafe', icon: 'coffee', tone: 'e', tag: 'Café', time: 'há 2 h', likes: 95,
      title: 'Guia rápido de cafés no centro',
      text: 'Mapeei oito cafeterias pequenas no centro de BH, com preço médio, tomadas disponíveis e nível de barulho. Ótimo para quem trabalha remoto e quer variar o cenário durante a semana.',
      full: 'Mapeei oito cafeterias pequenas no centro de BH, com preço médio, tomadas disponíveis e nível de barulho.\n\nÓtimo para quem trabalha remoto e quer variar o cenário durante a semana. Minha favorita abre às 7h e tem coado na hora.' },
    { id: 'p4', author: 'u4', topic: 'musica', icon: 'music', tone: 'd', tag: 'Música', time: 'há 3 h', likes: 61,
      title: 'Playlist para focar',
      text: 'Montei uma seleção instrumental de duas horas para dias de muito trabalho. Tem jazz, lo-fi e um pouco de música brasileira dos anos 70. Aceito sugestões!',
      full: 'Montei uma seleção instrumental de duas horas para dias de muito trabalho. Tem jazz, lo-fi e um pouco de música brasileira dos anos 70.\n\nAceito sugestões nos comentários — a próxima atualização sai na sexta.' },
    { id: 'p5', author: 'u7', topic: 'leitura', icon: 'book', tone: 'a', tag: 'Leitura', time: 'há 5 h', likes: 43,
      title: 'Clube do livro: votação de novembro',
      text: 'Os três finalistas deste mês já estão definidos. Deixe seu voto até sexta-feira e participe do encontro online no dia 20, às 19h.',
      full: 'Os três finalistas deste mês já estão definidos. Deixe seu voto até sexta-feira.\n\nO encontro online acontece no dia 20, às 19h. O link fica disponível na página do evento.' },
    { id: 'p6', author: 'u6', topic: 'arte', icon: 'palette', tone: 'b', tag: 'Arte', time: 'ontem', likes: 130,
      title: 'Aquarela em 15 minutos',
      text: 'Desafio da semana: pintar uma paisagem simples em quinze minutos, sem esboço. Postem os resultados no grupo — o importante é se divertir e soltar a mão.',
      full: 'Desafio da semana: pintar uma paisagem simples em quinze minutos, sem esboço.\n\nPostem os resultados no grupo Aquarela para iniciantes — o importante é se divertir e soltar a mão.' },
    { id: 'p7', author: 'u9', topic: 'eventos', icon: 'map-pin', tone: 'c', tag: 'Eventos', time: 'ontem', likes: 77,
      title: 'Feira de trocas no sábado',
      text: 'Vamos levar livros, plantas e roupas para trocar na praça do bairro. Traga o que não usa mais e leve algo novo para casa. Começa às 10h.',
      full: 'Vamos levar livros, plantas e roupas para trocar na praça do bairro.\n\nTraga o que não usa mais e leve algo novo para casa. Começa às 10h e vai até as 14h.' },
    { id: 'p8', author: 'u8', topic: 'viagem', icon: 'plane', tone: 'd', tag: 'Viagem', time: 'há 2 dias', likes: 58,
      title: 'Roteiro de 3 dias em Salvador',
      text: 'Pelourinho no primeiro dia, praias do subúrbio no segundo e Ilha de Itaparica no terceiro. Deixei dicas de transporte e de onde comer gastando pouco.',
      full: 'Pelourinho no primeiro dia, praias do subúrbio no segundo e Ilha de Itaparica no terceiro.\n\nDeixei dicas de transporte e de onde comer gastando pouco. Leve protetor solar!' },
    { id: 'p9', author: 'u10', topic: 'fotografia', icon: 'image', tone: 'e', tag: 'Fotografia', time: 'há 3 dias', likes: 40,
      title: 'Antes e depois da edição',
      text: 'Mostrei como corrigi a cor de um vídeo gravado no fim da tarde. Pequenos ajustes de temperatura e contraste mudam completamente o clima da cena.',
      full: 'Mostrei como corrigi a cor de um vídeo gravado no fim da tarde.\n\nPequenos ajustes de temperatura e contraste mudam completamente o clima da cena.' },
    { id: 'p10', author: 'u1', topic: 'fotografia', icon: 'camera', tone: 'a', tag: 'Fotografia', time: 'há 4 dias', likes: 88,
      title: 'Caminhada fotográfica na Paulista',
      text: 'Domingo de avenida aberta rendeu boas cenas de rua. Escolhi as que mais contam histórias sobre quem passa por ali.',
      full: 'Domingo de avenida aberta rendeu boas cenas de rua.\n\nEscolhi as que mais contam histórias sobre quem passa por ali.' },
    { id: 'p11', author: 'u1', topic: 'cafe', icon: 'coffee', tone: 'e', tag: 'Café', time: 'há 1 semana', likes: 52,
      title: 'Meu ritual de café coado',
      text: 'Proporção 1:15, água a 92 °C e moagem média. Simples e funciona todas as manhãs.',
      full: 'Proporção 1:15, água a 92 °C e moagem média.\n\nSimples e funciona todas as manhãs.' }
  ];

  var COMMENTS = {
    p1: [{ author: 'u2', text: 'Que cartão bonito! A hierarquia ficou clara.', time: 'há 5 min' }],
    p2: [
      { author: 'u5', text: 'A terceira foto ficou incrível.', time: 'há 40 min' },
      { author: 'u3', text: 'Qual lente você usou?', time: 'há 20 min' }
    ],
    p3: [{ author: 'u8', text: 'Salvei para a próxima viagem a BH!', time: 'há 1 h' }]
  };

  var STORIES = [
    { id: 's1', author: 'u3', icon: 'plane', tone: 'c', time: 'há 20 min', text: 'Chegando em Paraty! Alguém tem dica de onde almoçar?' },
    { id: 's2', author: 'u2', icon: 'camera', tone: 'b', time: 'há 1 h', text: 'Bastidores da sessão de hoje: luz natural e muita paciência.' },
    { id: 's3', author: 'u5', icon: 'coffee', tone: 'e', time: 'há 2 h', text: 'Novo grão na casa: notas de chocolate e laranja.' },
    { id: 's4', author: 'u4', icon: 'music', tone: 'd', time: 'há 3 h', text: 'Ensaio aberto hoje às 20h. Passa lá!' },
    { id: 's5', author: 'u7', icon: 'book', tone: 'a', time: 'há 4 h', text: 'Última chamada para votar no livro de novembro.' },
    { id: 's6', author: 'u6', icon: 'palette', tone: 'b', time: 'há 6 h', text: 'Paleta do desafio desta semana: só três cores.' },
    { id: 's7', author: 'u9', icon: 'map-pin', tone: 'c', time: 'há 8 h', text: 'Montando as barracas da feira de trocas.' },
    { id: 's8', author: 'u8', icon: 'plane', tone: 'd', time: 'há 10 h', text: 'Pôr do sol no Farol da Barra.' },
    { id: 's9', author: 'u10', icon: 'image', tone: 'e', time: 'há 12 h', text: 'Antes e depois da correção de cor.' }
  ];

  var GROUPS = [
    { id: 'g1', name: 'Fotografia de rua', icon: 'camera', tone: 'b', members: 1240, desc: 'Saídas fotográficas, críticas gentis e desafios mensais.' },
    { id: 'g2', name: 'Clube do livro Conecta', icon: 'book', tone: 'a', members: 860, desc: 'Um livro por mês, encontro online no dia 20.' },
    { id: 'g3', name: 'Cafés & coworking', icon: 'coffee', tone: 'e', members: 2105, desc: 'Lugares bons para trabalhar com um café bem feito.' },
    { id: 'g4', name: 'Viajantes de fim de semana', icon: 'plane', tone: 'c', members: 3870, desc: 'Roteiros curtos, baratos e perto de casa.' },
    { id: 'g5', name: 'Música independente', icon: 'music', tone: 'd', members: 990, desc: 'Lançamentos, shows pequenos e playlists colaborativas.' },
    { id: 'g6', name: 'Aquarela para iniciantes', icon: 'palette', tone: 'b', members: 640, desc: 'Desafios semanais e dicas de material.' }
  ];

  var EVENTS = [
    { id: 'e1', title: 'Feira de trocas do bairro', day: '08', month: 'nov', weekday: 'sábado', time: '10h às 14h', place: 'Praça Benedito Calixto, São Paulo', going: 86, icon: 'map-pin' },
    { id: 'e2', title: 'Passeio fotográfico no centro', day: '15', month: 'nov', weekday: 'sábado', time: '7h às 10h', place: 'Theatro Municipal, São Paulo', going: 34, icon: 'camera' },
    { id: 'e3', title: 'Encontro do clube do livro', day: '20', month: 'nov', weekday: 'quinta-feira', time: '19h às 20h30', place: 'Online', going: 52, icon: 'book' },
    { id: 'e4', title: 'Workshop de aquarela', day: '22', month: 'nov', weekday: 'sábado', time: '14h às 17h', place: 'Ateliê Vila Madalena, São Paulo', going: 18, icon: 'palette' },
    { id: 'e5', title: 'Show acústico no parque', day: '29', month: 'nov', weekday: 'sábado', time: '17h às 19h', place: 'Parque da Água Branca, São Paulo', going: 140, icon: 'music' }
  ];

  var CONVERSATIONS = [
    { id: 'c1', with: 'u3', unread: 2, messages: [
      { from: 'u3', text: 'Oi, Ana! Vi seu post da Paulista.', time: '09:12' },
      { from: 'me', text: 'Oi, Carla! Que bom que gostou!', time: '09:15' },
      { from: 'u3', text: 'Topa fazer um passeio fotográfico no sábado?', time: '09:20' },
      { from: 'u3', text: 'O grupo vai sair às 7h do Theatro Municipal.', time: '09:21' }
    ] },
    { id: 'c2', with: 'u2', unread: 1, messages: [
      { from: 'me', text: 'Bruno, qual lente você usou no Ibirapuera?', time: 'ontem' },
      { from: 'u2', text: 'Uma 35 mm f/1.8. Te empresto se quiser testar!', time: 'ontem' }
    ] },
    { id: 'c3', with: 'u7', unread: 0, messages: [
      { from: 'u7', text: 'Não esquece de votar no livro de novembro!', time: 'seg' },
      { from: 'me', text: 'Já votei! Vai dar o de ficção, aposto.', time: 'seg' }
    ] },
    { id: 'c4', with: 'u5', unread: 0, messages: [
      { from: 'u5', text: 'Separei aquele grão que você pediu.', time: 'sex' },
      { from: 'me', text: 'Passo aí amanhã cedo, obrigada!', time: 'sex' }
    ] },
    { id: 'c5', with: 'u4', unread: 0, messages: [
      { from: 'u4', text: 'Valeu por compartilhar a playlist.', time: '28 out' }
    ] }
  ];

  var NOTIFICATIONS = [
    { id: 'n1', user: 'u2', text: 'curtiu sua publicação “Caminhada fotográfica na Paulista”.', time: 'há 5 min', href: '#/post/p10', unread: true },
    { id: 'n2', user: 'u3', text: 'começou a seguir você.', time: 'há 30 min', href: '#/perfil/u3', unread: true },
    { id: 'n3', user: 'u7', text: 'mencionou você em “Clube do livro: votação de novembro”.', time: 'há 2 h', href: '#/post/p5', unread: true },
    { id: 'n4', user: 'u9', text: 'lembrete: “Feira de trocas do bairro” é no sábado.', time: 'ontem', href: '#/eventos', unread: false },
    { id: 'n5', user: 'u5', text: 'comentou: “Adorei a dica do café coado!”', time: 'há 2 dias', href: '#/post/p11', unread: false },
    { id: 'n6', user: 'u6', text: 'convidou você para o grupo “Aquarela para iniciantes”.', time: 'há 3 dias', href: '#/grupos', unread: false }
  ];

  var FAQ = [
    { q: 'Como criar uma publicação?', a: 'Use o botão “+ Novo” no topo da tela. Preencha o título, escolha um tema e publique. A publicação aparece no início do Feed.' },
    { q: 'Como salvar uma publicação para ver depois?', a: 'Abra a publicação em “Ver publicação” e toque em “Salvar”. Tudo o que você salvar fica na seção Salvos.' },
    { q: 'Como funcionam os stories?', a: 'Os stories ficam na faixa logo abaixo do topo, no Feed. Toque em um avatar para abrir; use as setas para passar de um para outro. Stories já vistos ficam com o anel cinza.' },
    { q: 'Como altero meus dados de perfil?', a: 'Vá em Perfil e toque em “Editar perfil”. Você pode mudar nome, cargo, localização e bio.' },
    { q: 'Esta versão salva meus dados de verdade?', a: 'Não. Esta é uma demonstração de interface: os dados são fictícios e ficam apenas no seu navegador.' }
  ];

  window.DATA = {
    DEMO_ACCOUNT: DEMO_ACCOUNT,
    ME: ME,
    USERS: USERS,
    TOPICS: TOPICS,
    POSTS: POSTS,
    COMMENTS: COMMENTS,
    STORIES: STORIES,
    GROUPS: GROUPS,
    EVENTS: EVENTS,
    CONVERSATIONS: CONVERSATIONS,
    NOTIFICATIONS: NOTIFICATIONS,
    FAQ: FAQ
  };
})();
