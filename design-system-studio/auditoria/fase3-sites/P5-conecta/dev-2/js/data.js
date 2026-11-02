/* Conecta — dados fictícios da demonstração (sem backend) */
(function (C) {
  'use strict';

  var people = {
    me: { id: 'me', name: 'Ana Souza', role: 'Product Designer', handle: '@anasouza', tone: 1, email: 'ana@conecta.demo',
      bio: 'Designer de produto em São Paulo. Gosto de interfaces simples, café coado e viagens curtas.',
      city: 'São Paulo, SP', since: 'março de 2023', posts: 12, followers: '2,4 mil', following: 312, interests: ['Design de produto', 'Café coado', 'Viagens curtas'], scene: 'hills', scheme: 1 },
    bruno: { id: 'bruno', name: 'Bruno Alves', role: 'Fotógrafo', handle: '@brunoalves', tone: 2, bio: 'Fotografia urbana e luz natural. Sempre com a câmera na mochila.', city: 'São Paulo, SP', since: 'junho de 2022', posts: 86, followers: '5,1 mil', following: 204, interests: ['Fotografia urbana', 'Cinema', 'Ciclismo'], scene: 'city', scheme: 4 },
    carla: { id: 'carla', name: 'Carla Mendes', role: 'Chef de cozinha', handle: '@carlamendes', tone: 3, bio: 'Receitas de família e cafés especiais. Testando um bolo de fubá por semana.', city: 'Belo Horizonte, MG', since: 'janeiro de 2023', posts: 64, followers: '3,8 mil', following: 190, interests: ['Culinária', 'Cafés especiais', 'Feiras'], scene: 'cup', scheme: 3 },
    diego: { id: 'diego', name: 'Diego Rocha', role: 'Músico', handle: '@diegorocha', tone: 4, bio: 'Violão, teclado e playlists para qualquer humor.', city: 'Porto Alegre, RS', since: 'agosto de 2022', posts: 41, followers: '1,9 mil', following: 256, interests: ['Música brasileira', 'Violão', 'Shows ao vivo'], scene: 'notes', scheme: 2 },
    elisa: { id: 'elisa', name: 'Elisa Prado', role: 'Viajante e escritora', handle: '@elisaprado', tone: 5, bio: 'Roteiros de fim de semana e histórias pelo caminho.', city: 'Rio de Janeiro, RJ', since: 'novembro de 2021', posts: 112, followers: '8,7 mil', following: 321, interests: ['Viagens', 'Escrita', 'Trilhas'], scene: 'sea', scheme: 5 },
    fabio: { id: 'fabio', name: 'Fábio Nunes', role: 'Engenheiro de software', handle: '@fabionunes', tone: 6, bio: 'Código limpo, atalhos de teclado e produtividade sem pressa.', city: 'Recife, PE', since: 'abril de 2023', posts: 29, followers: '980', following: 142, interests: ['Software', 'Produtividade', 'Jogos de tabuleiro'], scene: 'shapes', scheme: 6 },
    gabi: { id: 'gabi', name: 'Gabi Ferraz', role: 'Ilustradora', handle: '@gabiferraz', tone: 1, bio: 'Formas simples, cores fortes e muito papel rabiscado.', city: 'Curitiba, PR', since: 'fevereiro de 2023', posts: 73, followers: '4,2 mil', following: 167, interests: ['Ilustração', 'Design', 'Cadernos'], scene: 'shapes', scheme: 2 },
    hugo: { id: 'hugo', name: 'Hugo Lima', role: 'Ciclista urbano', handle: '@hugolima', tone: 3, bio: 'Pedalo todos os dias e mapeio ciclovias da cidade.', city: 'Curitiba, PR', since: 'setembro de 2022', posts: 37, followers: '1,2 mil', following: 98, interests: ['Ciclismo', 'Mobilidade', 'Cafés'], scene: 'hills', scheme: 5 }
  };

  var categories = {
    viagens: { label: 'Viagens', icon: 'plane' },
    fotografia: { label: 'Fotografia', icon: 'camera' },
    cafe: { label: 'Café', icon: 'coffee' },
    musica: { label: 'Música', icon: 'music' },
    design: { label: 'Design', icon: 'palette' }
  };

  var posts = [
    { id: 'p1', author: 'elisa', cat: 'viagens', tag: 'Novo', time: 'há 12 min', scene: 'sea', scheme: 4, likes: 48,
      title: 'Três dias em Paraty sem pressa',
      text: 'Cheguei de ônibus na sexta e fiquei até domingo. Roteiro simples: centro histórico de manhã, cachoeira à tarde e pôr do sol na praia do Pontal. Deixo as dicas de onde comer e onde ficar nos comentários, incluindo uma pousada pequena que valeu cada centavo.' },
    { id: 'p2', author: 'bruno', cat: 'fotografia', tag: 'Novo', time: 'há 40 min', scene: 'city', scheme: 3, likes: 73,
      title: 'Luz da manhã na Paulista',
      text: 'Saí às 6h para fotografar o amanhecer entre os prédios. A luz rasante muda tudo em poucos minutos, então vale chegar cedo e escolher o ângulo antes. Compartilho os ajustes de exposição que usei e o horário exato em que o sol aparece.' },
    { id: 'p3', author: 'carla', cat: 'cafe', tag: 'Novo', time: 'há 1 h', scene: 'cup', scheme: 1, likes: 35,
      title: 'Coador de pano ou de papel?',
      text: 'Fiz um teste cego com três cafés e dois coadores. O de pano deixou o sabor mais encorpado, mas dá mais trabalho para limpar. O de papel é prático e deixa o café mais limpo. Conto como foi a degustação e qual eu uso no dia a dia.' },
    { id: 'p4', author: 'diego', cat: 'musica', tag: 'Popular', time: 'há 3 h', scene: 'notes', scheme: 2, likes: 129,
      title: 'Playlist para trabalhar em silêncio',
      text: 'Montei uma lista com 40 músicas instrumentais que me ajudam a manter o foco sem distrair. Tem violão, piano e um pouco de jazz brasileiro. Pode sugerir faixas para a próxima versão, vou atualizar toda sexta.' },
    { id: 'p5', author: 'gabi', cat: 'design', tag: 'Destaque', time: 'há 5 h', scene: 'shapes', scheme: 2, likes: 91,
      title: 'Ilustrando com formas simples',
      text: 'Círculos, retângulos e triângulos bastam para contar uma história. Mostro o passo a passo de uma ilustração de paisagem usando só quatro cores e nenhuma linha de contorno.' },
    { id: 'p6', author: 'hugo', cat: 'viagens', tag: 'Dica', time: 'há 6 h', scene: 'hills', scheme: 5, likes: 56,
      title: 'Ciclovias de Curitiba para iniciantes',
      text: 'Três trajetos tranquilos, sem subidas fortes e com bastante sombra. O melhor deles passa por dois parques e termina em uma padaria excelente. Levo sempre uma garrafa de água e um casaco leve.' },
    { id: 'p7', author: 'fabio', cat: 'design', tag: 'Dica', time: 'ontem', scene: 'shapes', scheme: 6, likes: 44,
      title: 'Atalhos que me poupam uma hora por semana',
      text: 'Lista curta de atalhos de teclado que uso todos os dias no editor, no navegador e no terminal. Nada exótico: são combinações fáceis de decorar e que você começa a usar em cinco minutos.' },
    { id: 'p8', author: 'elisa', cat: 'fotografia', tag: '', time: 'ontem', scene: 'hills', scheme: 3, likes: 62,
      title: 'Feira de domingo em Santa Teresa',
      text: 'Frutas, flores e um violonista tocando bossa nova na esquina. Fotografei com lente fixa de 35 mm e quase nada de edição. A luz do fim da manhã ajudou muito.' },
    { id: 'p9', author: 'carla', cat: 'cafe', tag: '', time: 'ontem', scene: 'cup', scheme: 3, likes: 38,
      title: 'Bolo de fubá com café coado',
      text: 'Receita da minha avó, com um toque de erva-doce. Fica úmido por dentro e crocante por fora. Anotei as medidas em xícaras para facilitar para quem não tem balança em casa.' },
    { id: 'p10', author: 'diego', cat: 'musica', tag: '', time: 'há 2 dias', scene: 'notes', scheme: 4, likes: 77,
      title: 'Tocando violão pela primeira vez em público',
      text: 'Foi num sarau pequeno, com umas vinte pessoas. Errei um acorde, ri, recomecei e ninguém se importou. Se você está adiando, esse é o sinal para tentar.' },
    { id: 'p11', author: 'bruno', cat: 'viagens', tag: '', time: 'há 2 dias', scene: 'sea', scheme: 6, likes: 51,
      title: 'Fim de semana em Ilhabela',
      text: 'Fui de balsa, aluguei uma bicicleta e rodei a ilha em dois dias. A praia do Curral é a mais tranquila de manhã. Levei só uma mochila e voltei com o cartão de memória cheio.' },
    { id: 'p12', author: 'gabi', cat: 'design', tag: '', time: 'há 3 dias', scene: 'shapes', scheme: 1, likes: 66,
      title: 'Como escolho uma paleta em dez minutos',
      text: 'Começo por uma cor forte, adiciono uma versão suave e um neutro. Depois testo o contraste do texto. Se passar, está pronto. Compartilho o método com exemplos de três projetos.' },
    { id: 'p13', author: 'me', cat: 'design', tag: '', time: 'há 4 dias', scene: 'hills', scheme: 1, likes: 102, own: true,
      title: 'Três princípios para interfaces mobile',
      text: 'Alvos de toque generosos, uma ação principal por tela e feedback imediato. Pequenas decisões que evitam a maior parte dos erros de uso. Detalhes no texto completo.' },
    { id: 'p14', author: 'me', cat: 'cafe', tag: '', time: 'há 1 semana', scene: 'cup', scheme: 1, likes: 58, own: true,
      title: 'Meu cantinho de café para trabalhar',
      text: 'Uma mesa, uma planta e o coador de pano. Organizei tudo para trabalhar com menos distração e mais calma durante a manhã.' }
  ];

  var stories = [
    { person: 'me', slides: [{ scene: 'hills', scheme: 1, caption: 'Bom dia, comunidade! Que tal compartilhar um momento de hoje?' }] },
    { person: 'bruno', slides: [{ scene: 'city', scheme: 4, caption: 'Amanhecer na avenida, 6h12.' }, { scene: 'city', scheme: 3, caption: 'Teste de exposição com lente de 50 mm.' }] },
    { person: 'carla', slides: [{ scene: 'cup', scheme: 3, caption: 'Primeiro café da manhã com bolo de fubá.' }, { scene: 'cup', scheme: 1, caption: 'Ficou melhor do que eu esperava.' }, { scene: 'shapes', scheme: 3, caption: 'Receita completa amanhã.' }] },
    { person: 'diego', slides: [{ scene: 'notes', scheme: 2, caption: 'Ensaio de hoje à noite.' }] },
    { person: 'elisa', slides: [{ scene: 'sea', scheme: 5, caption: 'Pôr do sol na praia do Pontal.' }, { scene: 'hills', scheme: 5, caption: 'Trilha de volta para o centro.' }] },
    { person: 'fabio', slides: [{ scene: 'shapes', scheme: 6, caption: 'Setup novo, mesa organizada.' }] },
    { person: 'gabi', slides: [{ scene: 'shapes', scheme: 2, caption: 'Rascunho de hoje em quatro cores.' }, { scene: 'shapes', scheme: 1, caption: 'Versão final.' }] },
    { person: 'hugo', slides: [{ scene: 'hills', scheme: 5, caption: 'Ciclovia nova inaugurada hoje.' }] }
  ];

  var groups = [
    { id: 'g1', name: 'Fotografia urbana SP', members: '1,2 mil', desc: 'Encontros, trocas de dicas e saídas fotográficas pela cidade.', icon: 'camera', joined: true },
    { id: 'g2', name: 'Ciclistas de Curitiba', members: '860', desc: 'Roteiros, ciclovias e pedaladas de domingo.', icon: 'map-pin', joined: false },
    { id: 'g3', name: 'Café e coador', members: '2,3 mil', desc: 'Métodos de preparo, grãos e cafeterias para conhecer.', icon: 'coffee', joined: true },
    { id: 'g4', name: 'Design de produto BR', members: '4,8 mil', desc: 'Conversas sobre pesquisa, interface e carreira em produto.', icon: 'palette', joined: false },
    { id: 'g5', name: 'Viajantes de fim de semana', members: '3,1 mil', desc: 'Escapadas curtas, roteiros econômicos e boas histórias.', icon: 'plane', joined: false }
  ];

  var events = [
    { id: 'e1', day: '14', mon: 'nov', title: 'Encontro de fotografia na Paulista', when: 'sáb, 14 nov · 08:00', where: 'Av. Paulista, São Paulo', going: false },
    { id: 'e2', day: '20', mon: 'nov', title: 'Cicloturismo noturno', when: 'sex, 20 nov · 19:30', where: 'Parque Barigui, Curitiba', going: false },
    { id: 'e3', day: '22', mon: 'nov', title: 'Workshop de ilustração com formas simples', when: 'dom, 22 nov · 14:00', where: 'Online', going: true },
    { id: 'e4', day: '28', mon: 'nov', title: 'Feira de troca de livros', when: 'sáb, 28 nov · 10:00', where: 'Praça da Liberdade, Belo Horizonte', going: false }
  ];

  var conversations = [
    { id: 'c1', with: 'bruno', unread: 2, time: '09:13', messages: [
      { from: 'bruno', text: 'Oi, Ana! Vai ao encontro de fotografia no sábado?', t: '09:12' },
      { from: 'bruno', text: 'Posso te passar a localização exata.', t: '09:13' }] },
    { id: 'c2', with: 'carla', unread: 1, time: 'ontem', messages: [
      { from: 'carla', text: 'Testei a receita do bolo de fubá, ficou ótima!', t: 'ontem' }] },
    { id: 'c3', with: 'elisa', unread: 0, time: 'ontem', messages: [
      { from: 'elisa', text: 'Mandei as dicas de Paraty no seu e-mail.', t: 'ontem' },
      { from: 'me', text: 'Recebi, obrigada! Vou montar o roteiro hoje.', t: 'ontem' }] },
    { id: 'c4', with: 'diego', unread: 0, time: 'seg', messages: [
      { from: 'diego', text: 'A playlist nova já está no ar.', t: 'seg' }] }
  ];

  var notifications = [
    { id: 'n1', icon: 'heart', text: 'Bruno Alves curtiu sua publicação “Três princípios para interfaces mobile”.', time: 'há 5 min', unread: true, href: '#/post/p13' },
    { id: 'n2', icon: 'user', text: 'Carla Mendes começou a seguir você.', time: 'há 20 min', unread: true, href: '#/perfil/carla' },
    { id: 'n3', icon: 'calendar', text: 'Novo evento no grupo Fotografia urbana SP: Encontro na Paulista.', time: 'há 1 h', unread: true, href: '#/eventos' },
    { id: 'n4', icon: 'message-square', text: 'Diego Rocha comentou: “Ficou ótimo!”', time: 'há 3 h', unread: false, href: '#/post/p13' },
    { id: 'n5', icon: 'user', text: 'Elisa Prado mencionou você em uma publicação.', time: 'ontem', unread: false, href: '#/post/p1' },
    { id: 'n6', icon: 'users', text: 'Você foi aceita no grupo Café e coador.', time: 'há 2 dias', unread: false, href: '#/grupos' }
  ];

  var faq = [
    { q: 'Como crio uma publicação?', a: 'Toque em “Novo” no topo da tela, escreva um título e um texto e escolha uma categoria. A publicação aparece no início do feed.' },
    { q: 'Como salvo uma publicação para ver depois?', a: 'Toque no ícone de marcador no canto da imagem do cartão. As publicações salvas ficam na aba Salvos.' },
    { q: 'Como funcionam os stories?', a: 'Os stories ficam logo abaixo do topo da tela. Toque em um deles para assistir; toque nas laterais para avançar ou voltar.' },
    { q: 'Esqueci minha senha. E agora?', a: 'Na tela de entrada, use “Esqueci minha senha” e informe seu e-mail. Se ele existir, enviaremos um link de recuperação.' }
  ];

  C.data = { people: people, categories: categories, posts: posts, stories: stories, groups: groups, events: events, conversations: conversations, notifications: notifications, faq: faq };

  /** Estado em memória (sem persistência: recarregar volta à tela de entrada). */
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  C.freshState = function () {
    return {
      user: null,
      posts: clone(posts),
      saved: new Set(['p2']),
      liked: new Set(),
      following: new Set(['bruno', 'carla', 'diego', 'elisa']),
      seenStories: new Set(),
      groups: clone(groups),
      events: clone(events),
      conversations: clone(conversations),
      notifications: clone(notifications),
      comments: {},
      loaded: new Set(),
      settings: { emailNotif: true, simError: false },
      people: clone(people)
    };
  };
  C.state = C.freshState();
})(window.Conecta);
