import type { ItemSpec } from '@/core/types'
import type { MobileConfig, MobileGroup, MobileLayout } from './types'

/**
 * 44 arquiteturas mobile. Somente dados (sem JSX). O renderizador do celular monta a
 * tela a partir de `config`; a `spec` alimenta o Master Prompt.
 */

interface Def {
  id: string
  name: string
  group: MobileGroup
  description: string
  tags: string[]
  config: Partial<MobileConfig> & Pick<MobileConfig, 'top' | 'bottom'>
  spec: ItemSpec
}

const make = (d: Def): MobileLayout => ({
  ...d,
  config: { side: 'none', overlay: 'none', ...d.config },
})

/* -------------------------------------------------------------------------- */
/* Frases reutilizáveis                                                        */
/* -------------------------------------------------------------------------- */

const DESKTOP_FROM =
  'A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.'

const SAFE_TOP = 'A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.'

const SAFE_BOTTOM = (h: number) =>
  `Altura de ≈${h} px + env(safe-area-inset-bottom); o fundo da barra se estende até a borda inferior, atrás da barra de gestos.`

const CONTENT_PAD = 'O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido.'

const TARGETS = 'Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos.'

const ACTIVE = 'Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current="page".'

const MENU_A11Y =
  'Ao abrir: foco vai para o botão Fechar ou o primeiro item (sem rolar a página), o foco fica preso dentro do menu e o conteúdo atrás recebe inert/aria-hidden; Esc, toque no scrim e o botão X fecham; ao fechar, o foco volta ao gatilho.'

const NO_BODY_SCROLL = 'Enquanto o menu está aberto, o body não rola (overflow: hidden) e o menu tem rolagem interna própria (overscroll-behavior: contain).'

const MOTION = 'Animação de 200–250 ms (ease-out) ao abrir e 150–200 ms ao fechar; com prefers-reduced-motion, apenas fade.'

const LANDSCAPE_BOTTOM =
  'Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura.'

const SMALL_LABELS = '320–359 px: rótulos curtos (até ≈10 caracteres) e ícones de 22 px; a fonte nunca fica abaixo de 12 px.'

const THUMB = 'Destinos principais no terço inferior da tela, na zona de alcance do polegar.'

const ONE_SCREEN = [
  'Sem rolagem principal: a tela ocupa 100dvh (com fallback 100vh) e o conteúdo é dividido em blocos com grid de linhas em fr.',
  'Conteúdo variável rola dentro do próprio bloco (overflow: auto; overscroll-behavior: contain); nada importante é cortado ou escondido.',
]

const ONE_SCREEN_RESP = [
  'Altura útil menor que ≈560 px (celular pequeno, horizontal ou fonte ampliada): o modo One Screen é desativado e a tela volta a rolar, com os blocos empilhados.',
  'Fonte do sistema ampliada e zoom de até 200%: blocos reorganizam em menos colunas em vez de reduzir o texto.',
]

const ONE_SCREEN_NOTE = 'One Screen ≠ One Page: aqui tudo cabe na tela sem rolar; nunca use overflow: hidden para esconder o que não coube.'

const DRAWER = (side: 'esquerda' | 'direita', w = '≈280 px (máx. 85% da largura)') =>
  `Drawer de ${w} que desliza pela ${side}, ocupando a altura total (inclusive safe areas), com scrim escuro sobre o conteúdo.`

const DRAWER_CONTENT =
  'Conteúdo do drawer: cabeçalho com avatar, nome e botão Fechar; lista de destinos com ícone + rótulo (itens de 48 px); grupo secundário (configurações, ajuda) e “Sair” no rodapé.'

/* -------------------------------------------------------------------------- */
/* Catálogo                                                                    */
/* -------------------------------------------------------------------------- */

export const mobileLayouts: MobileLayout[] = [
  /* --------------------------- Navegação inferior --------------------------- */
  make({
    id: 'bottom-nav-classica',
    name: 'Bottom Navigation clássica',
    group: 'inferior',
    description:
      'Uma barra fixa embaixo com 4 ícones e os nomes dos destinos principais, sempre ao alcance do polegar. É o padrão mais conhecido de aplicativos.',
    tags: ['Aplicativos e SaaS', 'Uso diário', 'Até 4 destinos'],
    config: { top: 'topbar', bottom: 'bottom-nav' },
    spec: {
      summary: 'Topbar simples e Bottom Navigation fixa com 4 destinos rotulados de largura igual.',
      structure: [
        `Topbar de ≈56 px com título da tela e uma ação à direita. ${SAFE_TOP}`,
        `Bottom Navigation fixa (position: fixed; bottom: 0) com 4 itens de largura igual: ícone de 24 px + rótulo de 12 px. ${SAFE_BOTTOM(64)}`,
        CONTENT_PAD,
      ],
      behavior: [ACTIVE, 'Tocar no destino ativo rola a tela daquele destino para o topo.', 'Cada destino preserva a própria posição de rolagem e pilha de navegação.', THUMB],
      responsive: [SMALL_LABELS, LANDSCAPE_BOTTOM, DESKTOP_FROM],
      measurements: { topbar: '≈56 px', bottomNav: '≈64 px + safe area', item: '≥ 48 × 48 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'bottom-nav-cinco',
    name: 'Bottom Navigation com cinco destinos',
    group: 'inferior',
    description:
      'A barra inferior com cinco destinos, por exemplo Início, Buscar, Categorias, Carrinho e Conta. Ideal para lojas e apps com várias áreas.',
    tags: ['Lojas virtuais', 'Marketplaces', '5 destinos'],
    config: { top: 'topbar', bottom: 'bottom-nav-5' },
    spec: {
      summary: 'Bottom Navigation fixa com exatamente 5 destinos (limite máximo recomendado) e topbar simples.',
      structure: [
        `Topbar de ≈56 px com título e ações (busca, carrinho). ${SAFE_TOP}`,
        `Bottom Navigation com 5 itens de largura igual (20% cada), ícone de 24 px e rótulo de 12 px. ${SAFE_BOTTOM(64)}`,
        'Indicadores numéricos (badge) em itens como Carrinho, com aria-label que inclui a contagem.',
        CONTENT_PAD,
      ],
      behavior: [ACTIVE, 'Badges atualizam sem deslocar ícones; o rótulo nunca é truncado com reticências em destinos principais.', THUMB],
      responsive: [
        '320–359 px: cada item fica com ≈64 px de largura; use rótulos de até 8 caracteres ou mostre o rótulo apenas no item ativo.',
        LANDSCAPE_BOTTOM,
        DESKTOP_FROM,
      ],
      measurements: { bottomNav: '≈64 px + safe area', item: '20% da largura (≥ 64 px)' },
      notes: ['Mais de 5 destinos: mova os excedentes para uma aba “Mais” — não adicione um sexto item.', TARGETS],
    },
  }),
  make({
    id: 'bottom-dock-flutuante',
    name: 'Dock flutuante',
    group: 'inferior',
    description:
      'O menu de baixo vira uma “ilha” arredondada, afastada das bordas, flutuando sobre o conteúdo. Moderno e leve.',
    tags: ['Apps modernos', 'Visual leve', 'Conteúdo visual'],
    config: { top: 'topbar', bottom: 'dock' },
    spec: {
      summary: 'Menu inferior em forma de dock flutuante (afastado das bordas, cantos arredondados) sobreposto ao conteúdo.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Dock de ≈64 px de altura, a 16 px das laterais e 12 px + env(safe-area-inset-bottom) da base, raio de 20–24 px, superfície com borda fina e sombra suave.',
        '4 itens (ícone + rótulo curto) distribuídos dentro do dock.',
        'O conteúdo passa por baixo do dock e recebe padding-bottom ≈ altura do dock + margens + safe area.',
      ],
      behavior: [ACTIVE, 'O dock pode recolher ao rolar para baixo e reaparecer ao rolar para cima (opcional, respeitando prefers-reduced-motion).', THUMB],
      responsive: [
        '320–359 px: margens laterais de 12 px e rótulos curtos.',
        'Horizontal: dock centralizado com largura máxima de ≈420 px e altura de ≈52 px.',
        DESKTOP_FROM,
      ],
      measurements: { dock: '≈64 px de altura', margem: '16 px laterais + safe area inferior', raio: '20–24 px' },
      notes: ['Dock flutuante: nunca encostar nas bordas nem virar barra integral.', TARGETS],
    },
  }),
  make({
    id: 'bottom-acao-central',
    name: 'Bottom com ação central',
    group: 'inferior',
    description:
      'Barra inferior com um botão redondo de destaque no meio, para a ação mais importante, como “Novo” ou “Publicar”.',
    tags: ['Criar conteúdo', 'Registros rápidos', 'Apps sociais'],
    config: { top: 'topbar', bottom: 'bottom-fab' },
    spec: {
      summary: 'Bottom Navigation com 4 destinos e botão de ação central elevado (FAB integrado) entre eles.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        `Barra inferior com 2 destinos de cada lado e, no centro, botão circular de ≈56 px em cor primária, elevado ≈16 px acima da barra. ${SAFE_BOTTOM(64)}`,
        'O botão central tem rótulo acessível (aria-label, ex.: “Criar novo”) e ícone de 28 px.',
        CONTENT_PAD,
      ],
      behavior: [
        ACTIVE,
        'O botão central não é um destino: abre a ação (tela de criação ou bottom sheet de opções) e não recebe estado ativo.',
        THUMB,
      ],
      responsive: [SMALL_LABELS, 'Horizontal: o botão central reduz para 48 px e fica alinhado à barra (sem elevação).', DESKTOP_FROM],
      measurements: { bottomNav: '≈64 px + safe area', botaoCentral: '≈56 px de diâmetro' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'bottom-minimalista',
    name: 'Bottom minimalista',
    group: 'inferior',
    description:
      'Uma barra inferior bem discreta, só com ícones e um pontinho no item ativo. Deixa o conteúdo e as imagens em primeiro plano.',
    tags: ['Portfólios', 'Leitura', 'Apps contemplativos'],
    config: { top: 'none', bottom: 'bottom-minimal', largeTitle: true },
    spec: {
      summary: 'Sem topbar; título grande no conteúdo e barra inferior mínima apenas com ícones e indicador de ponto.',
      structure: [
        'Sem barra superior: o conteúdo começa abaixo da safe area superior com título grande (28–32 px).',
        `Barra inferior de ≈56 px com 3–4 ícones de 24 px, sem rótulos visíveis, borda superior fina. ${SAFE_BOTTOM(56)}`,
        'Indicador do item ativo: ponto de 4–6 px abaixo do ícone e ícone preenchido.',
      ],
      behavior: [
        'Cada ícone tem aria-label com o nome do destino; rótulo aparece em toque longo (tooltip).',
        'O título grande rola com o conteúdo; ao rolar, um título compacto pode surgir no topo.',
        THUMB,
      ],
      responsive: ['320–359 px: ícones com 44 px de área mínima, distribuição uniforme.', LANDSCAPE_BOTTOM, DESKTOP_FROM],
      measurements: { bottomNav: '≈56 px + safe area', tituloGrande: '28–32 px' },
      notes: ['Use apenas com ícones inequívocos; destinos ambíguos pedem rótulo.', TARGETS],
    },
  }),
  make({
    id: 'bottom-titulo-superior',
    name: 'Bottom com título superior',
    group: 'inferior',
    description:
      'Barra inferior clássica combinada com um título grande no topo de cada tela, que diminui quando a pessoa rola.',
    tags: ['Apps de organização', 'Configurações', 'Listas'],
    config: { top: 'topbar-large-title', bottom: 'bottom-nav', largeTitle: true },
    spec: {
      summary: 'Topbar com título grande recolhível no topo e Bottom Navigation fixa com 4 destinos.',
      structure: [
        `Topbar compacta de ≈44 px (ações) + título grande de ≈52 px abaixo dela. ${SAFE_TOP}`,
        `Bottom Navigation com 4 destinos rotulados. ${SAFE_BOTTOM(64)}`,
        CONTENT_PAD,
      ],
      behavior: [
        'Ao rolar, o título grande encolhe e passa para a topbar compacta (transição de opacidade/escala, sem pular o conteúdo).',
        ACTIVE,
        THUMB,
      ],
      responsive: [SMALL_LABELS, 'Horizontal: o título grande fica sempre compacto para economizar altura.', DESKTOP_FROM],
      measurements: { topbar: '≈44 px + título ≈52 px', bottomNav: '≈64 px + safe area' },
      notes: [TARGETS],
    },
  }),

  /* ---------------------- Headers e menus flutuantes ------------------------ */
  make({
    id: 'topbar-flutuante-compacta',
    name: 'Topbar flutuante compacta',
    group: 'flutuantes',
    description:
      'Uma barra superior pequena e arredondada, afastada das bordas, com logo e um botão de menu que abre uma lista curta de links.',
    tags: ['Landing pages', 'Sites institucionais', 'Páginas de produto'],
    config: { top: 'floating', bottom: 'none', overlay: 'dropdown' },
    spec: {
      summary: 'Topbar flutuante compacta (ilha) sobreposta ao conteúdo, com menu suspenso compacto ancorado nela.',
      structure: [
        'Topbar de ≈52 px, a 12 px das laterais e 8 px abaixo da safe area superior, raio de 16 px ou pílula, superfície com borda fina.',
        'Conteúdo da barra: logo à esquerda; à direita, ação principal curta e botão de menu (44 × 44 px).',
        'Menu suspenso: cartão de ≈240 px ancorado abaixo da barra, alinhado à direita, com 4–6 links e um botão de ação.',
        'O conteúdo começa atrás da barra (hero em tela cheia) com padding-top ≈ 72 px + safe area.',
      ],
      behavior: [
        'O botão de menu tem aria-expanded e aria-controls; o ícone troca para X quando aberto.',
        MENU_A11Y,
        'Ao rolar, a barra mantém fundo sólido ou translúcido com contraste suficiente sobre qualquer seção.',
      ],
      responsive: [
        '320–359 px: margens laterais de 8 px; a ação principal vira ícone.',
        'Horizontal: barra com ≈44 px de altura; o menu suspenso tem altura máxima de 70dvh com rolagem interna.',
        DESKTOP_FROM,
      ],
      measurements: { topbar: '≈52 px', margem: '12 px laterais', menu: '≈240 px de largura' },
      notes: ['Topbar flutuante: sempre afastada das bordas, sem virar barra integral.'],
    },
  }),
  make({
    id: 'topbar-flutuante-drawer-esquerdo',
    name: 'Topbar flutuante com drawer esquerdo',
    group: 'flutuantes',
    description:
      'Barra superior flutuante com um botão de menu à esquerda. Ao tocar, um menu lateral desliza pela esquerda.',
    tags: ['Apps com muitas seções', 'Portais', 'Áreas do cliente'],
    config: { top: 'floating', bottom: 'none', side: 'drawer-left' },
    spec: {
      summary: 'Topbar flutuante (ilha) com botão hambúrguer à esquerda que abre drawer lateral esquerdo sobreposto.',
      structure: [
        'Topbar flutuante de ≈52 px, 12 px de margem lateral, raio de 16 px: botão de menu à esquerda, título ou logo ao centro, ação à direita.',
        DRAWER('esquerda'),
        DRAWER_CONTENT,
      ],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, MOTION, 'Gesto de arrastar da borda esquerda abre o drawer (opcional), sem conflitar com o gesto “voltar” do sistema.'],
      responsive: ['320–359 px: drawer com 85% da largura.', 'Horizontal: drawer com ≈320 px e rolagem interna.', DESKTOP_FROM],
      measurements: { topbar: '≈52 px', drawer: '≈280 px (máx. 85%)' },
    },
  }),
  make({
    id: 'topbar-flutuante-drawer-direito',
    name: 'Topbar flutuante com drawer direito',
    group: 'flutuantes',
    description:
      'Barra superior flutuante com o botão de menu do lado direito, mais fácil de alcançar com o polegar. O menu desliza pela direita.',
    tags: ['Uso com uma mão', 'Lojas', 'Sites de serviço'],
    config: { top: 'floating', bottom: 'none', side: 'drawer-right' },
    spec: {
      summary: 'Topbar flutuante com botão de menu à direita que abre drawer lateral direito sobreposto.',
      structure: [
        'Topbar flutuante de ≈52 px: logo à esquerda; ações e botão de menu à direita.',
        DRAWER('direita'),
        DRAWER_CONTENT,
      ],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, MOTION],
      responsive: ['320–359 px: drawer com 85% da largura.', 'Horizontal: drawer com ≈320 px e rolagem interna.', DESKTOP_FROM],
      measurements: { topbar: '≈52 px', drawer: '≈280 px (máx. 85%)' },
    },
  }),
  make({
    id: 'topbar-flutuante-dock',
    name: 'Topbar flutuante com dock inferior',
    group: 'flutuantes',
    description:
      'Duas ilhas: uma barra flutuante no topo e um dock flutuante embaixo. O conteúdo passa por trás das duas.',
    tags: ['Apps modernos', 'Conteúdo visual', 'Redes e comunidades'],
    config: { top: 'floating', bottom: 'dock' },
    spec: {
      summary: 'Topbar flutuante e dock inferior flutuante, ambos sobrepostos ao conteúdo, com a mesma linguagem visual.',
      structure: [
        'Topbar flutuante de ≈52 px (margens de 12 px, raio de 16 px) com logo e ações.',
        'Dock inferior flutuante de ≈64 px (margens de 16 px, raio de 22 px) com 4 destinos.',
        'Conteúdo rola por trás das duas ilhas, com padding superior e inferior compensando as alturas e safe areas.',
      ],
      behavior: [ACTIVE, 'As ilhas mantêm contraste sobre qualquer conteúdo (fundo sólido ou translúcido com fallback).', THUMB],
      responsive: ['320–359 px: margens de 8–12 px.', 'Horizontal: topbar some ao rolar e o dock fica com ≈52 px; somadas, as barras ocupam no máximo 25% da altura.', DESKTOP_FROM],
      measurements: { topbar: '≈52 px', dock: '≈64 px', margens: '12–16 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'ilha-central-dock-pill',
    name: 'Topbar como ilha central com dock pill',
    group: 'flutuantes',
    description:
      'No topo, uma pequena cápsula central com o título; embaixo, um menu em forma de pílula só com ícones. Visual limpo e marcante.',
    tags: ['Apps de estilo de vida', 'Mídia e música', 'Visual minimalista'],
    config: { top: 'island', bottom: 'dock-pill' },
    spec: {
      summary: 'Topbar reduzida a uma ilha central (cápsula) e dock inferior em pílula apenas com ícones.',
      structure: [
        'Ilha superior centralizada de ≈40 px de altura e largura ajustada ao conteúdo (título + 1–2 ícones), 8 px abaixo da safe area.',
        'Dock em pílula centralizado, ≈56 px de altura, 4 ícones de 24 px com área de 48 px, raio total (999 px), a 16 px + safe area da base.',
        'Conteúdo em tela cheia por trás das duas ilhas.',
      ],
      behavior: ['Item ativo com bolha de fundo dentro da pílula e aria-current; ícones com aria-label.', 'A ilha superior pode expandir para mostrar status (ex.: reprodução) sem cobrir conteúdo importante.'],
      responsive: ['320–359 px: pílula com até 4 ícones; a ilha superior mostra só o título.', 'Horizontal: pílula com ≈48 px de altura.', DESKTOP_FROM],
      measurements: { ilha: '≈40 px de altura', pilula: '≈56 px de altura', raio: '999 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'menu-inferior-pill',
    name: 'Menu inferior pill com ícones',
    group: 'flutuantes',
    description:
      'Um menu flutuante em forma de pílula na parte de baixo. O item ativo se expande e mostra o nome; os outros mostram só o ícone.',
    tags: ['Apps modernos', 'Finanças pessoais', 'Saúde e bem-estar'],
    config: { top: 'topbar', bottom: 'pill-label' },
    spec: {
      summary: 'Menu inferior flutuante em pílula onde o item ativo expande com ícone + rótulo e os demais exibem apenas ícones.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Pílula flutuante de ≈60 px de altura, margens laterais de 20 px, raio total, superfície com borda fina.',
        'Item ativo: bolha em cor primária suave com ícone + rótulo; inativos: ícone de 24 px com aria-label.',
      ],
      behavior: ['A troca de item anima a bolha entre posições (200 ms; sem animação com prefers-reduced-motion).', ACTIVE, THUMB],
      responsive: ['320–359 px: rótulo do item ativo com até 8 caracteres.', 'Horizontal: pílula centralizada com largura máxima de ≈420 px.', DESKTOP_FROM],
      measurements: { pilula: '≈60 px de altura', margens: '20 px laterais + safe area' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'dock-transparente',
    name: 'Dock inferior transparente',
    group: 'flutuantes',
    description:
      'Um dock flutuante translúcido, como vidro fosco: dá para ver o conteúdo passando por trás. Fica bonito com fotos e cores.',
    tags: ['Galerias e fotos', 'Mídia', 'Apps visuais'],
    config: { top: 'none', bottom: 'dock-transparent', largeTitle: true },
    spec: {
      summary: 'Sem topbar; título grande e dock inferior flutuante translúcido (vidro fosco) sobre o conteúdo.',
      structure: [
        'Conteúdo começa abaixo da safe area superior com título grande.',
        'Dock de ≈64 px, margens de 16 px, raio de 22 px, fundo translúcido (rgba da superfície ≈60–70%) com backdrop-filter: blur(16px) e borda clara fina.',
        'Fallback sem backdrop-filter: fundo sólido da superfície com 94% de opacidade.',
      ],
      behavior: ['Contraste mínimo de 4,5:1 dos ícones/rótulos garantido sobre qualquer conteúdo (escureça/clareie o vidro se necessário).', ACTIVE, THUMB],
      responsive: ['320–359 px: margens de 12 px.', 'Horizontal: dock com ≈52 px e largura máxima de ≈420 px.', DESKTOP_FROM],
      measurements: { dock: '≈64 px', blur: '≈16 px', opacidade: '60–70%' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'menu-flutuante-compacto',
    name: 'Menu flutuante inferior compacto',
    group: 'flutuantes',
    description:
      'Um único botão redondo flutuando no canto de baixo. Ao tocar, ele abre uma pequena lista de ações rápidas acima dele.',
    tags: ['Ações rápidas', 'Apps de uma tela', 'Ferramentas simples'],
    config: { top: 'topbar', bottom: 'fab', overlay: 'speed-dial' },
    spec: {
      summary: 'Botão de ação flutuante (FAB) no canto inferior direito que expande uma lista vertical de ações rápidas (speed dial).',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'FAB de ≈56 px de diâmetro a 20 px da borda direita e 20 px + safe area da base, em cor primária.',
        'Ao abrir: 3–4 mini botões de ≈44 px empilhados acima do FAB, cada um com rótulo à esquerda; scrim leve sobre o conteúdo.',
      ],
      behavior: ['O ícone do FAB gira de + para X quando aberto (aria-expanded).', MENU_A11Y, 'O FAB nunca cobre o último item da lista: o conteúdo tem padding-bottom suficiente.'],
      responsive: ['320–359 px: FAB a 16 px das bordas.', 'Horizontal: as ações abrem em leque para a esquerda se não couberem na altura.', DESKTOP_FROM],
      measurements: { fab: '≈56 px', acoes: '≈44 px cada' },
    },
  }),

  /* ---------------------------- Layouts híbridos ---------------------------- */
  make({
    id: 'stories-dock-flutuante',
    name: 'Stories fixos com dock flutuante',
    group: 'hibridos',
    description:
      'No topo, uma faixa de círculos com destaques que desliza para o lado; embaixo, um menu flutuante arredondado.',
    tags: ['Comunidades', 'Conteúdo em destaque', 'Novidades diárias'],
    config: { top: 'topbar-brand', bottom: 'dock', stories: true, storiesStyle: 'circles' },
    spec: {
      summary: 'Topbar com marca, faixa horizontal de stories fixa abaixo dela e dock inferior flutuante.',
      structure: [
        `Topbar de ≈56 px com logo e ações. ${SAFE_TOP}`,
        'Faixa de stories de ≈88 px fixa abaixo da topbar: círculos de 56 px com anel de destaque e rótulo de 12 px, rolagem horizontal (overflow-x: auto; scroll-snap).',
        'Dock flutuante de ≈64 px com 4 destinos, margens de 16 px.',
        'O último story fica parcialmente visível para indicar que a faixa continua.',
      ],
      behavior: ['A faixa rola horizontalmente com toque e teclado; cada story é um botão com rótulo.', ACTIVE, 'A faixa pode recolher ao rolar o conteúdo para baixo, voltando ao rolar para cima.'],
      responsive: ['320–359 px: círculos de 52 px.', 'Horizontal: a faixa de stories recolhe automaticamente para liberar altura.', DESKTOP_FROM],
      measurements: { stories: '≈88 px', circulo: '56 px', dock: '≈64 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'stories-dock-drawer',
    name: 'Stories com dock e drawer lateral',
    group: 'hibridos',
    description:
      'Faixa de destaques no topo, menu flutuante embaixo e, para as opções menos usadas, um menu lateral que abre pelo botão de menu.',
    tags: ['Apps completos', 'Comunidades', 'Muitas opções'],
    config: { top: 'topbar-hamburger', bottom: 'dock', side: 'drawer-left', stories: true, storiesStyle: 'circles' },
    spec: {
      summary: 'Topbar com hambúrguer, faixa de stories, dock flutuante para destinos principais e drawer esquerdo para opções secundárias.',
      structure: [
        `Topbar de ≈56 px com botão de menu à esquerda. ${SAFE_TOP}`,
        'Faixa de stories de ≈88 px abaixo da topbar, com rolagem horizontal.',
        'Dock flutuante de ≈64 px com 4 destinos principais.',
        DRAWER('esquerda'),
      ],
      behavior: ['Divisão clara: destinos frequentes no dock; configurações, ajuda e conta no drawer.', MENU_A11Y, NO_BODY_SCROLL],
      responsive: ['320–359 px: drawer com 85% da largura.', 'Horizontal: stories recolhem; dock com ≈52 px.', DESKTOP_FROM],
      measurements: { stories: '≈88 px', dock: '≈64 px', drawer: '≈280 px' },
    },
  }),
  make({
    id: 'stories-dock-translucido',
    name: 'Stories com dock translúcido',
    group: 'hibridos',
    description:
      'Faixa de destaques no topo e um dock embaixo com efeito de vidro fosco, deixando ver o conteúdo por trás.',
    tags: ['Mídia e fotos', 'Apps visuais', 'Entretenimento'],
    config: { top: 'topbar-brand', bottom: 'dock-transparent', stories: true, storiesStyle: 'circles' },
    spec: {
      summary: 'Topbar, faixa de stories e dock inferior flutuante translúcido (backdrop-filter) sobre conteúdo visual.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Faixa de stories de ≈88 px com rolagem horizontal.',
        'Dock translúcido de ≈64 px (fundo ≈65% + blur de 16 px, borda clara), com fallback sólido.',
      ],
      behavior: ['Contraste dos ícones garantido sobre qualquer imagem.', ACTIVE, THUMB],
      responsive: ['320–359 px: círculos de 52 px; margens do dock de 12 px.', 'Horizontal: stories recolhem; dock com ≈52 px.', DESKTOP_FROM],
      measurements: { stories: '≈88 px', dock: '≈64 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'header-busca-menu-flutuante',
    name: 'Header fixo com busca e menu inferior flutuante',
    group: 'hibridos',
    description:
      'Barra superior fixa com campo de busca, logo abaixo uma faixa de categorias que desliza para o lado e um menu flutuante arredondado embaixo.',
    tags: ['Lojas e delivery', 'Catálogos', 'Busca em primeiro lugar'],
    config: { top: 'topbar-search', bottom: 'dock', stories: true, storiesStyle: 'categories' },
    spec: {
      summary: 'Header fixo com busca, faixa horizontal de categorias e menu inferior flutuante arredondado.',
      structure: [
        `Header fixo de ≈104 px: linha de marca (≈52 px) com logo e ações + campo de busca de ≈44 px em largura total. ${SAFE_TOP}`,
        'Faixa de categorias de ≈52 px abaixo do header: pílulas com ícone + rótulo, rolagem horizontal com scroll-snap; categoria ativa destacada.',
        'Menu inferior flutuante de ≈64 px, margens de 16 px, raio de 22 px, com 4 destinos.',
        CONTENT_PAD,
      ],
      behavior: [
        'O campo de busca abre a tela de busca com teclado e sugestões; fonte de 16 px para não haver zoom no iOS.',
        'Tocar em uma categoria filtra o conteúdo sem mover a faixa (sem scrollIntoView brusco).',
        ACTIVE,
      ],
      responsive: [
        '320–359 px: pílulas com rótulo de até 10 caracteres.',
        'Horizontal: a faixa de categorias recolhe ao rolar; header + menu ≤ 25% da altura.',
        DESKTOP_FROM,
      ],
      measurements: { header: '≈104 px', categorias: '≈52 px', menuInferior: '≈64 px' },
      notes: ['Identidade própria: não reproduza a aparência de nenhum aplicativo existente.', TARGETS],
    },
  }),
  make({
    id: 'topbar-bottom-nav',
    name: 'Topbar com Bottom Navigation',
    group: 'hibridos',
    description:
      'Barra superior com logo e atalhos (busca, notificações) e barra inferior com os destinos principais. Equilíbrio entre marca e navegação.',
    tags: ['SaaS', 'Apps corporativos', 'Uso diário'],
    config: { top: 'topbar-brand', bottom: 'bottom-nav' },
    spec: {
      summary: 'Topbar com marca e ações globais combinada com Bottom Navigation de 4 destinos.',
      structure: [
        `Topbar de ≈56 px: logo à esquerda; busca, notificações (com badge) e avatar à direita. ${SAFE_TOP}`,
        `Bottom Navigation com 4 destinos rotulados. ${SAFE_BOTTOM(64)}`,
        CONTENT_PAD,
      ],
      behavior: ['Ações da topbar são globais (iguais em todos os destinos); a navegação principal fica só embaixo.', ACTIVE, THUMB],
      responsive: [SMALL_LABELS, LANDSCAPE_BOTTOM, DESKTOP_FROM],
      measurements: { topbar: '≈56 px', bottomNav: '≈64 px + safe area' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'bottom-nav-drawer-opcoes',
    name: 'Bottom Navigation com drawer de opções',
    group: 'hibridos',
    description:
      'Barra inferior com quatro destinos e um botão “Mais” que abre um painel de baixo para cima com as demais opções.',
    tags: ['Apps com muitas áreas', 'Bancos e serviços', 'Configurações'],
    config: { top: 'topbar', bottom: 'bottom-nav', overlay: 'bottom-sheet' },
    spec: {
      summary: 'Bottom Navigation com item “Mais” que abre bottom sheet com destinos secundários.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        `Bottom Navigation com 3 destinos + item “Mais” (ícone de grade/três pontos). ${SAFE_BOTTOM(64)}`,
        'Bottom sheet com alça, título, grade de 8 atalhos (ícone + rótulo) e lista de opções; altura de até 70dvh com rolagem interna.',
      ],
      behavior: ['O item “Mais” tem aria-expanded e não muda o destino ativo.', MENU_A11Y, NO_BODY_SCROLL, 'Arrastar a alça para baixo fecha o sheet.'],
      responsive: [SMALL_LABELS, 'Horizontal: o sheet ocupa no máximo 90dvh com rolagem e largura máxima de ≈560 px, centralizado.', DESKTOP_FROM],
      measurements: { bottomNav: '≈64 px + safe area', sheet: 'até 70dvh' },
    },
  }),
  make({
    id: 'header-menu-perfil',
    name: 'Header com menu de perfil',
    group: 'hibridos',
    description:
      'Barra superior com saudação e a foto da pessoa; tocar na foto abre um menu da conta. Embaixo, a barra com os destinos principais.',
    tags: ['Áreas logadas', 'Apps pessoais', 'Contas e assinaturas'],
    config: { top: 'topbar-profile', bottom: 'bottom-nav', overlay: 'profile-menu' },
    spec: {
      summary: 'Header com saudação e avatar que abre menu de perfil (popover), combinado com Bottom Navigation.',
      structure: [
        `Header de ≈64 px: saudação em duas linhas à esquerda e avatar de 40 px (área de 44 px) à direita. ${SAFE_TOP}`,
        'Menu de perfil: cartão ancorado abaixo do avatar (≈240 px) com nome, e-mail, 4 itens de conta e “Sair”.',
        `Bottom Navigation com 4 destinos. ${SAFE_BOTTOM(64)}`,
      ],
      behavior: ['O avatar é um botão com aria-haspopup="menu" e aria-expanded.', MENU_A11Y, 'Itens do menu navegáveis por setas ↑/↓.'],
      responsive: [SMALL_LABELS, 'Horizontal: o menu de perfil tem altura máxima de 80dvh com rolagem interna.', DESKTOP_FROM],
      measurements: { header: '≈64 px', avatar: '40 px (área de 44 px)', menu: '≈240 px' },
    },
  }),
  make({
    id: 'rail-menu-inferior',
    name: 'Rail com menu inferior',
    group: 'hibridos',
    description:
      'Uma coluna fina de ícones na lateral para filtros ou atalhos e a barra inferior para os destinos principais.',
    tags: ['Ferramentas de trabalho', 'Apps com filtros', 'Painéis móveis'],
    config: { top: 'topbar', bottom: 'bottom-nav', side: 'rail' },
    spec: {
      summary: 'Rail lateral fino de ícones (atalhos/filtros da tela) combinado com Bottom Navigation para destinos principais.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Rail de ≈56 px à esquerda, entre a topbar e a bottom navigation, com 4–5 ícones de 24 px (áreas de 44 px).',
        `Bottom Navigation com 4 destinos. ${SAFE_BOTTOM(64)}`,
        'Conteúdo ocupa a largura restante (largura total − 56 px).',
      ],
      behavior: ['O rail atua dentro do destino atual (filtros, visualizações); não duplica a bottom navigation.', 'Ícones do rail com aria-label e estado selecionado (aria-pressed).'],
      responsive: ['320–359 px: rail de 48 px; avalie esconder o rail atrás de um botão “Filtros” se o conteúdo ficar estreito.', 'Horizontal: a bottom navigation vira parte do rail (destinos no topo do rail).', DESKTOP_FROM],
      measurements: { rail: '≈56 px', bottomNav: '≈64 px + safe area' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'menu-compacto-adaptavel',
    name: 'Menu compacto adaptável',
    group: 'hibridos',
    description:
      'Um menu pequeno flutuando embaixo com três atalhos e um botão “mais”. Ele se adapta: vira trilho lateral quando o celular está deitado.',
    tags: ['Apps enxutos', 'Leitura e mídia', 'Uso com uma mão'],
    config: { top: 'topbar', bottom: 'dock-compact', overlay: 'bottom-sheet' },
    spec: {
      summary: 'Cápsula compacta flutuante com 3 destinos + “Mais” (abre bottom sheet), que se reorganiza em rail na horizontal.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Cápsula centralizada de ≈52 px de altura com 3 ícones + botão “Mais”, raio total, a 16 px + safe area da base.',
        'Bottom sheet de opções com alça, grade de atalhos e lista.',
      ],
      behavior: ['A cápsula pode recolher para um único botão ao rolar para baixo e expandir ao rolar para cima.', MENU_A11Y, NO_BODY_SCROLL],
      responsive: ['320–359 px: cápsula com 4 alvos de 44 px.', 'Horizontal: a cápsula vira rail vertical flutuante na borda direita.', DESKTOP_FROM],
      measurements: { capsula: '≈52 px de altura', sheet: 'até 70dvh' },
      notes: [TARGETS],
    },
  }),

  /* --------------------------- Navegação superior --------------------------- */
  make({
    id: 'topbar-hamburguer',
    name: 'Topbar com menu hambúrguer',
    group: 'superior',
    description:
      'Barra superior com o ícone de três linhas. Ao tocar, o menu desce do topo, logo abaixo da barra, com os links do site.',
    tags: ['Sites e landing pages', 'Institucionais', 'Blogs'],
    config: { top: 'topbar-hamburger', bottom: 'none', overlay: 'top-sheet' },
    spec: {
      summary: 'Topbar com botão hambúrguer que abre painel de menu descendo do topo (top sheet), em largura total.',
      structure: [
        `Topbar de ≈56 px: botão de menu (44 × 44 px) à esquerda, logo ao centro, ação à direita. ${SAFE_TOP}`,
        'Painel do menu abaixo da topbar, largura total, altura até 80dvh com rolagem interna: links principais (48 px), submenus em accordion e CTA no final.',
        'Scrim sobre o restante do conteúdo.',
      ],
      behavior: ['O ícone vira X quando aberto (aria-expanded, aria-controls).', MENU_A11Y, NO_BODY_SCROLL, MOTION],
      responsive: ['320–359 px: logo reduzido; links em fonte de 16 px.', 'Horizontal: painel com altura máxima de 85dvh e duas colunas de links quando couber.', DESKTOP_FROM],
      measurements: { topbar: '≈56 px', painel: 'até 80dvh', itens: '48 px' },
    },
  }),
  make({
    id: 'topbar-abas',
    name: 'Topbar com abas',
    group: 'superior',
    description:
      'Barra superior com abas logo abaixo do título (por exemplo: Todos, Recentes, Favoritos). Trocar de aba muda o conteúdo da tela.',
    tags: ['Listas e feeds', 'Dashboards móveis', 'Categorias de conteúdo'],
    config: { top: 'topbar-tabs', bottom: 'none' },
    spec: {
      summary: 'Topbar com linha de abas fixas (2–4) que alternam visões do conteúdo da tela.',
      structure: [
        `Topbar de ≈56 px com título e ações. ${SAFE_TOP}`,
        'Linha de abas de ≈44 px com 2–4 abas de largura igual e indicador inferior de 2–3 px na aba ativa.',
        'Conteúdo da aba ativa abaixo, com rolagem própria por aba.',
      ],
      behavior: ['role="tablist"/"tab"/"tabpanel", aria-selected e setas ←/→ entre abas.', 'Deslizar lateralmente troca de aba (opcional), preservando a rolagem de cada aba.'],
      responsive: ['320–359 px: no máximo 3 abas com rótulos curtos; com mais, use abas roláveis.', 'Horizontal: a topbar recolhe ao rolar e as abas permanecem fixas.', DESKTOP_FROM],
      measurements: { topbar: '≈56 px', abas: '≈44 px', indicador: '2–3 px' },
    },
  }),
  make({
    id: 'navegacao-horizontal-rolavel',
    name: 'Navegação horizontal rolável',
    group: 'superior',
    description:
      'Uma fileira de seções no topo que desliza para o lado, como em portais de notícias. Cabe muitas categorias sem apertar.',
    tags: ['Notícias e revistas', 'Catálogos', 'Muitas categorias'],
    config: { top: 'scroll-tabs', bottom: 'none' },
    spec: {
      summary: 'Topbar com faixa de seções roláveis horizontalmente (chips ou abas) para muitas categorias.',
      structure: [
        `Topbar de ≈52 px com logo e ações. ${SAFE_TOP}`,
        'Faixa de seções de ≈44 px com rolagem horizontal (overflow-x: auto; scroll-snap-type: x proximity; scrollbar oculta), primeira seção alinhada à margem do conteúdo.',
        'Fade nas bordas da faixa indica que há mais seções.',
      ],
      behavior: ['A seção ativa é destacada e mantida visível ao trocar de página (sem rolar a página inteira).', 'Navegável por teclado (Tab/setas) com foco visível.'],
      responsive: ['320–359 px: chips com padding de 12 px.', 'Horizontal: a faixa permanece; a topbar pode recolher ao rolar.', DESKTOP_FROM],
      measurements: { topbar: '≈52 px', faixa: '≈44 px' },
    },
  }),
  make({
    id: 'topbar-busca',
    name: 'Topbar com busca',
    group: 'superior',
    description:
      'A busca é a estrela: um campo grande logo no topo, sempre à mão. Ideal quando as pessoas chegam sabendo o que procuram.',
    tags: ['Lojas e catálogos', 'Bases de conhecimento', 'Diretórios'],
    config: { top: 'topbar-search', bottom: 'none' },
    spec: {
      summary: 'Topbar de duas linhas com marca/ações e campo de busca em largura total sempre visível.',
      structure: [
        `Linha de marca de ≈52 px + campo de busca de ≈44 px (raio médio, ícone de lupa, placeholder descritivo). ${SAFE_TOP}`,
        'Conteúdo abaixo com resultados, categorias ou sugestões.',
      ],
      behavior: [
        'Ao focar, abre a experiência de busca (recentes, sugestões) com botão “Cancelar”; fonte de 16 px no campo.',
        'Ao rolar, a linha de marca recolhe e o campo de busca permanece fixo.',
      ],
      responsive: ['320–359 px: placeholder curto (“Buscar”).', 'Horizontal: apenas o campo de busca fica fixo (≈48 px).', DESKTOP_FROM],
      measurements: { linhaDeMarca: '≈52 px', busca: '≈44 px' },
    },
  }),
  make({
    id: 'header-compacto-perfil',
    name: 'Header compacto com perfil',
    group: 'superior',
    description:
      'Uma barra superior fina com a foto e o nome da pessoa, sem ocupar muito espaço. O conteúdo ganha quase a tela toda.',
    tags: ['Apps pessoais', 'Painéis simples', 'Telas de conteúdo'],
    config: { top: 'topbar-compact', bottom: 'none' },
    spec: {
      summary: 'Header compacto de ≈48 px com avatar, nome/contexto e uma ação, maximizando a área de conteúdo.',
      structure: [
        `Header de ≈48 px: avatar de 32 px (área de 44 px), nome ou contexto em uma linha e uma ação à direita. ${SAFE_TOP}`,
        'Sem navegação inferior: destinos ficam no conteúdo (cartões/atalhos) ou no perfil.',
      ],
      behavior: ['Tocar no avatar leva à tela de perfil.', 'O header pode esconder ao rolar para baixo e voltar ao rolar para cima.'],
      responsive: ['320–359 px: nome truncado com reticências e title completo.', 'Horizontal: header de ≈44 px.', DESKTOP_FROM],
      measurements: { header: '≈48 px', avatar: '32 px' },
    },
  }),

  /* ------------------------ Drawers e menus laterais ------------------------ */
  make({
    id: 'drawer-esquerda',
    name: 'Drawer pela esquerda',
    group: 'drawers',
    description:
      'O clássico menu escondido: toca nas três linhas e um painel desliza da esquerda por cima do conteúdo.',
    tags: ['Apps com muitas seções', 'Sistemas', 'Dashboards'],
    config: { top: 'topbar-hamburger', bottom: 'none', side: 'drawer-left' },
    spec: {
      summary: 'Topbar com hambúrguer à esquerda que abre drawer lateral esquerdo sobreposto ao conteúdo, com scrim.',
      structure: [`Topbar de ≈56 px com botão de menu à esquerda e título. ${SAFE_TOP}`, DRAWER('esquerda'), DRAWER_CONTENT],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, MOTION, 'Tocar em um destino navega e fecha o drawer.'],
      responsive: ['320–359 px: drawer com 85% da largura.', 'Horizontal: drawer com ≈320 px e rolagem interna.', DESKTOP_FROM],
      measurements: { topbar: '≈56 px', drawer: '≈280 px (máx. 85%)', itens: '48 px' },
      notes: ['O drawer é sobreposto: o conteúdo não se move.'],
    },
  }),
  make({
    id: 'drawer-direita',
    name: 'Drawer pela direita',
    group: 'drawers',
    description:
      'O menu escondido abre do lado direito, onde o polegar alcança com facilidade em quem segura o celular com a mão direita.',
    tags: ['Uso com uma mão', 'Lojas', 'Sites'],
    config: { top: 'topbar-hamburger', bottom: 'none', side: 'drawer-right' },
    spec: {
      summary: 'Topbar com botão de menu à direita que abre drawer lateral direito sobreposto, com scrim.',
      structure: [`Topbar de ≈56 px: título à esquerda, botão de menu à direita. ${SAFE_TOP}`, DRAWER('direita'), DRAWER_CONTENT],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, MOTION],
      responsive: ['320–359 px: drawer com 85% da largura.', 'Horizontal: drawer com ≈320 px e rolagem interna.', DESKTOP_FROM],
      measurements: { topbar: '≈56 px', drawer: '≈280 px (máx. 85%)' },
    },
  }),
  make({
    id: 'drawer-empurra-conteudo',
    name: 'Drawer que empurra o conteúdo',
    group: 'drawers',
    description:
      'Ao abrir o menu, a tela inteira desliza para o lado e revela o menu por baixo, em vez de cobri-la.',
    tags: ['Apps de marca', 'Experiências fluidas', 'Menus curtos'],
    config: { top: 'topbar-hamburger', bottom: 'none', side: 'drawer-push' },
    spec: {
      summary: 'Drawer esquerdo que empurra (translateX) o conteúdo para a direita, revelando o menu por baixo.',
      structure: [
        `Topbar de ≈56 px com botão de menu à esquerda. ${SAFE_TOP}`,
        'Menu de ≈260 px posicionado atrás do conteúdo, na borda esquerda.',
        'Ao abrir, o conteúdo inteiro (topbar incluída) desloca ≈260 px para a direita; a parte visível do conteúdo funciona como área de fechar.',
      ],
      behavior: ['Transição de transform (não de left/width) para fluidez; respeita prefers-reduced-motion.', MENU_A11Y, NO_BODY_SCROLL],
      responsive: ['320–359 px: deslocamento de ≈75% da largura.', 'Horizontal: deslocamento de ≈300 px com rolagem interna no menu.', DESKTOP_FROM],
      measurements: { menu: '≈260 px', deslocamento: '≈260 px' },
    },
  }),
  make({
    id: 'bottom-sheet-menu',
    name: 'Bottom Sheet',
    group: 'drawers',
    description:
      'Uma alça fica visível na parte de baixo; ao tocar ou puxar, um painel sobe com o menu e as opções.',
    tags: ['Mapas e serviços', 'Uso com uma mão', 'Ações contextuais'],
    config: { top: 'topbar', bottom: 'sheet-peek', overlay: 'bottom-sheet' },
    spec: {
      summary: 'Menu em bottom sheet com estado recolhido (alça visível na base) e estado aberto até ≈70% da altura.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        `Estado recolhido: faixa de ≈64 px na base com alça (36 × 4 px), rótulo “Menu” e 3 atalhos. ${SAFE_BOTTOM(64)}`,
        'Estado aberto: sheet com cantos superiores de 20 px, título, grade de atalhos e lista de opções, até 70dvh com rolagem interna.',
      ],
      behavior: ['Tocar ou arrastar a alça abre; arrastar para baixo, tocar no scrim, Esc ou X fecham.', MENU_A11Y, NO_BODY_SCROLL, MOTION],
      responsive: ['320–359 px: atalhos em 3 colunas.', 'Horizontal: sheet com largura máxima de ≈560 px, centralizado, até 90dvh.', DESKTOP_FROM],
      measurements: { recolhido: '≈64 px + safe area', aberto: 'até 70dvh', alca: '36 × 4 px' },
    },
  }),
  make({
    id: 'menu-deslizante-grupos',
    name: 'Menu deslizante com grupos',
    group: 'drawers',
    description:
      'Menu lateral que organiza as opções em grupos com títulos, que podem abrir e fechar. Bom para sistemas com muitas páginas.',
    tags: ['Sistemas completos', 'ERPs e gestão', 'Muitas páginas'],
    config: { top: 'topbar-hamburger', bottom: 'none', overlay: 'grouped-sheet' },
    spec: {
      summary: 'Menu deslizante pela esquerda, largo (≈88%), com destinos organizados em grupos recolhíveis.',
      structure: [
        `Topbar de ≈56 px com botão de menu à esquerda. ${SAFE_TOP}`,
        'Painel de ≈88% da largura (máx. 340 px) com busca no topo e grupos com título (Principal, Gestão, Conta); cada grupo recolhe/expande (accordion).',
        'Itens de 48 px com ícone + rótulo; contadores à direita quando houver.',
      ],
      behavior: ['Cabeçalhos de grupo são botões com aria-expanded; o grupo da página atual abre por padrão.', MENU_A11Y, NO_BODY_SCROLL, MOTION],
      responsive: ['320–359 px: painel com 92% da largura.', 'Horizontal: painel com ≈360 px e rolagem interna.', DESKTOP_FROM],
      measurements: { painel: '≈88% (máx. 340 px)', itens: '48 px' },
    },
  }),

  /* ----------------------- Navegação lateral compacta ----------------------- */
  make({
    id: 'mini-sidebar-visivel',
    name: 'Mini Sidebar sempre visível',
    group: 'lateral-compacta',
    description:
      'Uma coluna estreita à esquerda, sempre visível, com ícones e nomes pequenos. Não precisa abrir menu para trocar de área.',
    tags: ['Ferramentas de trabalho', 'Tablets pequenos', 'Painéis'],
    config: { top: 'topbar', bottom: 'none', side: 'mini-sidebar' },
    spec: {
      summary: 'Mini sidebar fixa de ≈72 px à esquerda com ícones e rótulos curtos, sempre visível.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Mini sidebar de ≈72 px abaixo da topbar até a base (com safe area inferior), itens de ≈56 px com ícone de 24 px e rótulo de 12 px abaixo.',
        'Conteúdo na largura restante, com grids de uma coluna.',
      ],
      behavior: [ACTIVE, 'A mini sidebar rola internamente se houver mais itens que altura.'],
      responsive: ['320–359 px: mini sidebar de 64 px; conteúdo deve continuar legível (mín. ≈250 px).', 'Horizontal: excelente encaixe — mantém 72 px e o conteúdo ganha largura.', DESKTOP_FROM],
      measurements: { miniSidebar: '≈72 px', item: '≈56 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'sidebar-fina-expansivel',
    name: 'Sidebar fina expansível',
    group: 'lateral-compacta',
    description:
      'Um trilho fino de ícones à esquerda que se expande, mostrando os nomes, quando a pessoa toca no botão de abrir.',
    tags: ['Apps de produtividade', 'Painéis', 'Ferramentas'],
    config: { top: 'topbar', bottom: 'none', side: 'rail-expand' },
    spec: {
      summary: 'Rail fino de ≈56 px com botão de expandir que abre a versão com rótulos (≈240 px) sobreposta ao conteúdo.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Rail de ≈56 px à esquerda com botão de expandir no topo e ícones de 24 px (áreas de 44 px).',
        'Estado expandido: painel de ≈240 px sobre o conteúdo, com ícone + rótulo e scrim leve.',
      ],
      behavior: ['O botão de expandir tem aria-expanded e aria-label (“Expandir menu”).', MENU_A11Y, MOTION],
      responsive: ['320–359 px: rail de 52 px.', 'Horizontal: o rail pode iniciar expandido se a largura permitir (≥ 640 px).', DESKTOP_FROM],
      measurements: { rail: '≈56 px', expandido: '≈240 px' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'navegacao-lateral-direita',
    name: 'Navegação lateral direita',
    group: 'lateral-compacta',
    description:
      'Uma coluna estreita de ícones e nomes do lado direito da tela, perto do polegar de quem usa o celular com a mão direita.',
    tags: ['Uso com uma mão', 'Leitura', 'Mídia'],
    config: { top: 'topbar', bottom: 'none', side: 'rail-right' },
    spec: {
      summary: 'Rail fixo de ≈64 px na borda direita com ícones e rótulos curtos.',
      structure: [
        `Topbar de ≈56 px. ${SAFE_TOP}`,
        'Rail de ≈64 px à direita, abaixo da topbar até a base (com safe area), itens de ≈56 px (ícone + rótulo de 12 px).',
        'Conteúdo à esquerda na largura restante.',
      ],
      behavior: [ACTIVE, 'Ordem de foco: topbar → conteúdo → rail, com link de atalho “Ir para navegação”.'],
      responsive: ['320–359 px: rail de 56 px sem rótulos (com aria-label).', 'Horizontal: mantém o rail; considere ocultar a topbar ao rolar.', DESKTOP_FROM],
      measurements: { rail: '≈64 px', item: '≈56 px' },
      notes: [TARGETS],
    },
  }),

  /* --------------------------- Menus de tela cheia -------------------------- */
  make({
    id: 'menu-fullscreen',
    name: 'Menu fullscreen',
    group: 'tela-cheia',
    description:
      'Ao tocar no menu, ele cobre a tela inteira com links grandes e fáceis de tocar. Simples e muito claro.',
    tags: ['Landing pages', 'Sites institucionais', 'Poucos links'],
    config: { top: 'topbar-hamburger', bottom: 'none', overlay: 'fullscreen' },
    spec: {
      summary: 'Menu que ocupa a tela inteira (100dvh) com links grandes, aberto por botão hambúrguer na topbar.',
      structure: [
        `Topbar de ≈56 px com logo e botão de menu. ${SAFE_TOP}`,
        'Menu em tela cheia com fundo sólido: botão Fechar no mesmo lugar do botão de menu, links de 22–28 px com 56 px de altura, CTA e links secundários no rodapé.',
      ],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, MOTION, 'O menu tem rolagem interna se os links não couberem (fonte ampliada).'],
      responsive: ['320–359 px: links de 22 px.', 'Horizontal: links em duas colunas; rolagem interna quando necessário.', DESKTOP_FROM],
      measurements: { link: '22–28 px, 56 px de altura' },
    },
  }),
  make({
    id: 'menu-editorial-fullscreen',
    name: 'Menu editorial fullscreen',
    group: 'tela-cheia',
    description:
      'Menu de tela cheia com tipografia enorme e numerada, como uma capa de revista. Perfeito para portfólios e marcas criativas.',
    tags: ['Portfólios', 'Estúdios e agências', 'Marcas autorais'],
    config: { top: 'topbar-hamburger', bottom: 'none', overlay: 'fullscreen-editorial' },
    spec: {
      summary: 'Menu fullscreen editorial: links numerados em tipografia display grande, contraste alto e rodapé com contato.',
      structure: [
        `Topbar de ≈56 px com marca e botão “Menu” à direita. ${SAFE_TOP}`,
        'Menu em tela cheia com fundo escuro (ou cor de destaque), links numerados (01, 02…) em fonte de títulos de 34–44 px, alinhados à esquerda.',
        'Rodapé do menu com e-mail, redes e localização em texto pequeno.',
      ],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, 'Entrada escalonada dos links (stagger de 40 ms), desativada com prefers-reduced-motion.'],
      responsive: ['320–359 px: links de 30 px.', 'Horizontal: links em duas colunas com rolagem interna.', DESKTOP_FROM],
      measurements: { link: '34–44 px' },
    },
  }),
  make({
    id: 'menu-grade-aplicativos',
    name: 'Menu em grade de aplicativos',
    group: 'tela-cheia',
    description:
      'O menu abre uma tela com ícones grandes em grade, como a tela inicial de um celular. Cada ícone leva a uma área.',
    tags: ['Super apps', 'Portais de serviços', 'Intranets'],
    config: { top: 'topbar-hamburger', bottom: 'none', overlay: 'app-grid' },
    spec: {
      summary: 'Menu em tela cheia com grade de atalhos (ícone grande + rótulo), aberto por botão de grade na topbar.',
      structure: [
        `Topbar de ≈56 px com botão de grade à direita. ${SAFE_TOP}`,
        'Tela de menu com título, busca opcional e grade de 3 colunas: ícones de 56 px com fundo arredondado e rótulo de 12–13 px abaixo (2 linhas no máximo).',
      ],
      behavior: [MENU_A11Y, NO_BODY_SCROLL, 'Setas do teclado navegam na grade (role="grid" opcional).'],
      responsive: ['320–359 px: 3 colunas com ícones de 52 px.', 'Horizontal: 5–6 colunas.', DESKTOP_FROM],
      measurements: { icone: '56 px', colunas: '3 (retrato)' },
      notes: [TARGETS],
    },
  }),
  make({
    id: 'menu-comandos',
    name: 'Menu de comandos',
    group: 'tela-cheia',
    description:
      'Em vez de procurar no menu, a pessoa toca na busca e digita o que quer fazer. As opções aparecem enquanto ela escreve.',
    tags: ['Usuários avançados', 'Ferramentas', 'Muitas funções'],
    config: { top: 'topbar-search', bottom: 'none', overlay: 'command' },
    spec: {
      summary: 'Campo de busca na topbar que abre paleta de comandos (busca + ações) sobreposta ao conteúdo.',
      structure: [
        `Topbar com linha de marca (≈52 px) e campo “Buscar ou executar…” (≈44 px). ${SAFE_TOP}`,
        'Paleta de comandos: cartão no topo da tela com campo de texto e resultados agrupados (Sugestões, Navegar, Ações), cada item de 48 px com ícone.',
      ],
      behavior: [
        'role="combobox" + listbox; ↑/↓ e Enter executam; Esc ou X fecham e devolvem o foco ao campo.',
        'Resultados filtram enquanto digita, com tolerância a erros; recentes aparecem antes de digitar.',
        NO_BODY_SCROLL,
      ],
      responsive: ['320–359 px: paleta ocupa a tela inteira.', 'Horizontal: resultados com altura máxima de 70dvh e rolagem interna; teclado virtual nunca cobre o campo.', DESKTOP_FROM],
      measurements: { campo: '≈44 px', item: '48 px' },
    },
  }),

  /* ---------------------------- One Screen móvel ---------------------------- */
  make({
    id: 'one-screen-bottom-nav',
    name: 'One Screen com Bottom Navigation',
    group: 'one-screen',
    description:
      'Cada tela cabe inteira no celular, sem rolar, organizada em blocos. Embaixo, a barra com os destinos.',
    tags: ['Painéis móveis', 'Controles e status', 'Apps de consulta rápida'],
    config: { top: 'topbar', bottom: 'bottom-nav', oneScreen: true },
    spec: {
      summary: 'Tela One Screen com topbar, grade de blocos que divide a altura disponível e Bottom Navigation fixa.',
      structure: [`Topbar de ≈56 px. ${SAFE_TOP}`, ...ONE_SCREEN, `Bottom Navigation com 4 destinos. ${SAFE_BOTTOM(64)}`, 'Grade de 2 colunas × 3 linhas de blocos com números e mini gráficos.'],
      behavior: [ACTIVE, 'Números grandes usam clamp() para caber nos blocos sem cortar.'],
      responsive: [...ONE_SCREEN_RESP, LANDSCAPE_BOTTOM, DESKTOP_FROM],
      measurements: { topbar: '≈56 px', bottomNav: '≈64 px + safe area' },
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-rail',
    name: 'One Screen com Sidebar Rail',
    group: 'one-screen',
    description:
      'Tudo cabe na tela, com uma coluna fina de ícones na lateral para trocar de área. Funciona muito bem com o celular deitado.',
    tags: ['Controles', 'Painéis de status', 'Uso na horizontal'],
    config: { top: 'topbar', bottom: 'none', side: 'rail', oneScreen: true },
    spec: {
      summary: 'Tela One Screen com rail lateral de ícones e blocos que dividem a altura, sem rolagem principal.',
      structure: [`Topbar de ≈56 px. ${SAFE_TOP}`, 'Rail de ≈56 px à esquerda até a base (com safe area), ícones de 24 px com aria-label.', ...ONE_SCREEN],
      behavior: ['Item ativo do rail com fundo de seleção e aria-current.', 'Blocos com rolagem interna quando o conteúdo exceder.'],
      responsive: [...ONE_SCREEN_RESP, 'Horizontal: layout preferido — rail fixo e blocos em 3 colunas.', DESKTOP_FROM],
      measurements: { rail: '≈56 px' },
      notes: [ONE_SCREEN_NOTE, TARGETS],
    },
  }),
  make({
    id: 'one-screen-kiosk',
    name: 'One Screen Kiosk',
    group: 'one-screen',
    description:
      'Tela de autoatendimento: poucos botões enormes, fáceis de tocar e de ler, tudo visível de uma vez.',
    tags: ['Autoatendimento', 'Pedidos e senhas', 'Tablets de balcão'],
    config: { top: 'topbar', bottom: 'none', oneScreen: true, content: 'kiosk' },
    spec: {
      summary: 'Interface de quiosque móvel One Screen: título claro e 4 botões gigantes em grade 2 × 2, sem rolagem.',
      structure: [`Topbar de ≈56 px com marca e ajuda. ${SAFE_TOP}`, ...ONE_SCREEN, 'Saudação/instrução em 22–28 px e grade 2 × 2 de botões grandes (ícone de 36 px + rótulo de 16–18 px) que dividem a altura restante.'],
      behavior: ['Alvos de toque de no mínimo 64 px; feedback visual imediato ao tocar.', 'Inatividade devolve à tela inicial com aviso.'],
      responsive: [...ONE_SCREEN_RESP, 'Horizontal: grade 4 × 1.', DESKTOP_FROM],
      measurements: { botao: '≥ 64 px (recomendado ≥ 120 px de altura)' },
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-abas',
    name: 'One Screen com painel em abas',
    group: 'one-screen',
    description:
      'Uma tela única com abas no topo; cada aba troca o painel, que sempre cabe inteiro na tela, sem rolar.',
    tags: ['Painéis compactos', 'Consultas rápidas', 'Apps de status'],
    config: { top: 'topbar-tabs', bottom: 'none', oneScreen: true, content: 'tabs' },
    spec: {
      summary: 'Tela One Screen com abas fixas no topo que alternam painéis dimensionados para caber na viewport.',
      structure: [`Topbar de ≈56 px + abas de ≈44 px. ${SAFE_TOP}`, ...ONE_SCREEN, 'Cada painel: um destaque principal no topo e uma grade de blocos menores ocupando o restante da altura.'],
      behavior: ['role="tablist" com aria-selected; setas ←/→ trocam de aba.', 'A troca de aba não altera a altura da tela nem gera rolagem.'],
      responsive: [...ONE_SCREEN_RESP, 'Horizontal: abas viram rail vertical à esquerda para economizar altura.', DESKTOP_FROM],
      measurements: { abas: '≈44 px' },
      notes: [ONE_SCREEN_NOTE],
    },
  }),
]
