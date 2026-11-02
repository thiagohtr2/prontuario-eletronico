import type { ItemSpec } from '@/core/types'
import type { DesktopFamily, DesktopGrid, DesktopLayout, LayoutRegion, RegionFill, RegionKind } from './types'

/**
 * 42 arquiteturas desktop. Somente dados (sem JSX). As medidas de grid estão em px/fr,
 * medidas na referência de 1280 × 800 px. As funções abaixo apenas montam frases
 * repetidas das specs, para que cada item continue específico e consistente.
 */

type Extra = Omit<LayoutRegion, 'id' | 'kind'>
const reg = (id: string, kind: RegionKind, extra: Extra = {}): LayoutRegion => ({ id, kind, ...extra })
const fill = (f: RegionFill, extra: Extra = {}): Extra => ({ fill: f, ...extra })

const grid = (columns: string, rows: string, areas: string[], gap = 0, padding = 0): DesktopGrid => ({
  columns,
  rows,
  areas,
  gap,
  padding,
})

interface Def {
  id: string
  name: string
  family: DesktopFamily
  description: string
  tags: string[]
  grid: DesktopGrid
  regions: LayoutRegion[]
  measurements: DesktopLayout['measurements']
  oneScreen?: boolean
  spec: ItemSpec
}

const make = (d: Def): DesktopLayout => ({ ...d })

/* -------------------------------------------------------------------------- */
/* Frases reutilizáveis                                                        */
/* -------------------------------------------------------------------------- */

const MOBILE =
  'Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.'

const ONE_PAGE =
  'One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem.'

const integral = (w: number, side: 'esquerda' | 'direita' = 'esquerda') =>
  `Sidebar integral de ≈${w} px na borda ${side}: vai do topo à base da janela (height: 100dvh), encostada na borda, sem margem externa, sem cantos arredondados e sem sombra flutuante.`

const stickySidebar =
  'A sidebar é fixa (position: sticky; top: 0; height: 100dvh) e tem rolagem interna própria (overflow-y: auto; overscroll-behavior: contain) quando os itens não cabem; a página rola apenas na coluna de conteúdo.'

const navItems =
  'Itens de navegação com 40–44 px de altura, ícone de 20 px + rótulo, agrupados por seções com título discreto; o item ativo tem fundo de seleção, cor de texto ativa e indicador lateral.'

const headerRow = (h: number) =>
  `Header de ≈${h} px: título da página ou breadcrumb à esquerda; busca, notificações e avatar à direita; borda inferior fina de 1 px.`

const stickyHeader = 'O header é sticky (position: sticky; top: 0) acima do conteúdo e não rola com ele; z-index superior ao conteúdo e inferior a modais.'

const contentArea = (pad = '24–32 px') =>
  `Área de conteúdo com padding de ${pad}, largura fluida e grids internos com minmax(0, 1fr); nenhum cartão encolhe abaixo de ≈280 px — reduza colunas antes.`

const respIntegral = (w: number, side: 'esquerda' | 'direita' = 'esquerda') => [
  `1280 px ou mais: sidebar ${side} com ≈${w} px e rótulos completos.`,
  `1024–1279 px: a sidebar reduz para ≈${Math.round((w * 0.88) / 4) * 4} px; o conteúdo reduz colunas antes de comprimir cartões ou tabelas.`,
  '768–1023 px: a sidebar recolhe para um rail integral de ≈72 px (só ícones, com tooltip e aria-label); um botão expande a sidebar completa em sobreposição, com scrim, Esc e clique fora para fechar.',
  MOBILE,
]

const respFloating = (w: number, gap: number) => [
  `1280 px ou mais: sidebar flutuante de ≈${w} px com ${gap} px de afastamento das bordas e entre blocos.`,
  `1024–1279 px: afastamento reduz para ≈${Math.max(8, gap - 4)} px e a sidebar para ≈${Math.round((w * 0.9) / 4) * 4} px; os cantos arredondados e a separação são mantidos.`,
  '768–1023 px: a sidebar vira um rail flutuante de ≈64 px (só ícones), ainda afastado das bordas; expandir abre a versão completa em sobreposição, com scrim e Esc.',
  MOBILE,
]

const respRail = (extra: string) => [
  '1024 px ou mais: rail de ≈76 px sempre visível, com ícones de 22–24 px, rótulo em tooltip e item ativo destacado.',
  extra,
  '768–1023 px: o rail é mantido (≈64 px); painéis secundários recolhem e passam a abrir em sobreposição a partir de um botão no header.',
  MOBILE,
]

const respPanel = (w: number, name: string) =>
  `${name} de ≈${w} px: em 1024–1279 px reduz para ≈${Math.round((w * 0.85) / 4) * 4} px; em 768–1023 px vira painel sobreposto à direita (abre por botão no header, com scrim, Esc e foco preso), sem empurrar o conteúdo.`

const respTop = (h: number) => [
  `1280 px ou mais: header de ≈${h} px com todos os links visíveis.`,
  '1024–1279 px: espaçamento entre links diminui; links excedentes vão para um item “Mais” com menu suspenso acessível por teclado.',
  '768–1023 px: os links recolhem em um botão “Menu” que abre um painel abaixo do header (largura total, rolagem interna); logo e ação principal continuam visíveis.',
  MOBILE,
]

const ONE_SCREEN_STRUCTURE =
  'O shell ocupa exatamente a viewport (height: 100dvh com fallback 100vh; overflow: hidden no body); as linhas do grid usam fr e minmax(0, 1fr) para dividir a altura disponível.'

const ONE_SCREEN_BEHAVIOR = [
  'Não há rolagem principal: cada painel com conteúdo variável rola internamente (overflow: auto; overscroll-behavior: contain), com indicação visual de que há mais conteúdo (sombra interna ou fade na borda).',
  'Conteúdo longo nunca é cortado nem escondido: listas usam rolagem interna ou paginação; textos quebram linha; números grandes usam clamp() para caber.',
]

const ONE_SCREEN_RESPONSIVE = [
  'Altura útil menor que ≈640 px (notebook pequeno, janela reduzida ou zoom de 150–200%): o modo One Screen é desativado — o body volta a rolar e os painéis se empilham, sem esconder informação importante.',
  'Zoom do navegador até 200% e fonte ampliada do sistema: nenhum conteúdo some; prefira reorganizar (menos colunas) a reduzir a fonte.',
]

const ONE_SCREEN_NOTE =
  'One Screen ≠ One Page: aqui tudo deve caber na viewport sem rolagem da página; em One Page a página rola. Nunca use overflow: hidden para esconder conteúdo que não coube.'

/* -------------------------------------------------------------------------- */
/* Catálogo                                                                    */
/* -------------------------------------------------------------------------- */

export const desktopLayouts: DesktopLayout[] = [
  /* ---------------------------- Sidebar integral ---------------------------- */
  make({
    id: 'sidebar-integral-classica',
    name: 'Sidebar integral clássica',
    family: 'sidebar-integral',
    description:
      'Menu fixo do lado esquerdo, de cima a baixo, com o logo no topo. Ao lado ficam uma barra superior e o conteúdo. É o formato mais comum em sistemas.',
    tags: ['Sistemas e SaaS', 'Painéis administrativos', 'Áreas logadas'],
    grid: grid('252px 1fr', '64px 1fr', ['sidebar header', 'sidebar content']),
    regions: [reg('sidebar', 'sidebar', { scroll: true }), reg('header', 'header'), reg('content', 'content', fill('dashboard', { scroll: true }))],
    measurements: { sidebar: 252, header: 64 },
    spec: {
      summary: 'Shell de aplicação com sidebar integral à esquerda (do topo à base) e coluna principal com header fixo e conteúdo rolável.',
      structure: [
        'Grid de duas colunas: grid-template-columns: 252px minmax(0, 1fr); a coluna principal tem grid-template-rows: 64px minmax(0, 1fr) (header + conteúdo).',
        integral(252),
        'Topo da sidebar com a mesma altura do header (≈64 px), contendo logo e nome do produto, alinhado ao header para formar uma linha horizontal contínua.',
        navItems,
        'Rodapé da sidebar com perfil do usuário e atalho de configurações, separado por borda fina.',
        `${headerRow(64)} O header fica somente sobre a coluna principal — não passa por cima da sidebar.`,
        contentArea(),
      ],
      behavior: [stickySidebar, stickyHeader, 'Grupos de navegação podem recolher (accordion) e lembram o estado; hover, focus-visible e item ativo são visualmente distintos.'],
      responsive: respIntegral(252),
      notes: ['Sidebar integral: nunca flutuante, sem margem externa e sem cantos arredondados.', ONE_PAGE],
    },
  }),
  make({
    id: 'sidebar-integral-rodape',
    name: 'Sidebar integral com rodapé',
    family: 'sidebar-integral',
    description:
      'Igual ao menu lateral clássico, mas com uma faixa de rodapé embaixo do conteúdo para versão, links legais ou status do sistema.',
    tags: ['Sistemas corporativos', 'Ferramentas internas', 'Produtos com termos e status'],
    grid: grid('252px 1fr', '64px 1fr 48px', ['sidebar header', 'sidebar content', 'sidebar footer']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('table', { scroll: true })),
      reg('footer', 'footer'),
    ],
    measurements: { sidebar: 252, header: 64, footer: 48 },
    spec: {
      summary: 'Sidebar integral à esquerda e coluna principal com header, conteúdo rolável e rodapé fixo na base da coluna.',
      structure: [
        'grid-template-columns: 252px minmax(0, 1fr); coluna principal com grid-template-rows: 64px minmax(0, 1fr) 48px.',
        integral(252),
        navItems,
        headerRow(64),
        'Rodapé de ≈48 px somente na coluna principal: versão do sistema, links de termos/privacidade e indicador de status (online, sincronizado), em texto de 12–13 px.',
        contentArea(),
      ],
      behavior: [
        stickySidebar,
        'Header e rodapé ficam fixos nas extremidades da coluna principal; apenas o conteúdo entre eles rola (overflow-y: auto).',
        'O rodapé nunca cobre conteúdo: a área rolável termina acima dele.',
      ],
      responsive: [...respIntegral(252).slice(0, 3), 'Em alturas menores que 600 px o rodapé deixa de ser fixo e passa para o final do conteúdo rolável.', MOBILE],
      notes: ['A sidebar também pode ter um rodapé próprio (perfil e sair), independente do rodapé da coluna principal.'],
    },
  }),
  make({
    id: 'sidebar-integral-header-global',
    name: 'Sidebar integral com header global',
    family: 'sidebar-integral',
    description:
      'Uma barra superior atravessa a tela inteira com o logo. Embaixo dela, o menu lateral desce até o fim da tela e o conteúdo fica ao lado.',
    tags: ['SaaS com várias áreas', 'Busca global', 'Ferramentas de equipe'],
    grid: grid('252px 1fr', '64px 1fr', ['header header', 'sidebar content']),
    regions: [reg('header', 'header'), reg('sidebar', 'sidebar', { scroll: true }), reg('content', 'content', fill('dashboard', { scroll: true }))],
    measurements: { sidebar: 252, header: 64 },
    spec: {
      summary: 'Header global de largura total no topo e sidebar integral abaixo dele, da base do header até a base da janela.',
      structure: [
        'grid-template-columns: 252px minmax(0, 1fr); grid-template-rows: 64px minmax(0, 1fr); o header ocupa as duas colunas (grid-column: 1 / -1).',
        'Header global de ≈64 px: logo à esquerda (alinhado à largura da sidebar), busca global ao centro (até ≈560 px), ações e avatar à direita.',
        'Sidebar integral de ≈252 px abaixo do header: encostada na borda esquerda, ocupa toda a altura restante (calc(100dvh − 64 px)), sem margem nem cantos arredondados.',
        navItems,
        contentArea(),
      ],
      behavior: [
        'Header fixo no topo da janela (sticky; top: 0); a sidebar é sticky em top: 64 px com altura calc(100dvh − 64 px) e rolagem interna.',
        'A busca global abre resultados em painel suspenso acessível por teclado (setas, Enter, Esc).',
      ],
      responsive: [
        ...respIntegral(252).slice(0, 2),
        '768–1023 px: a sidebar recolhe para rail de ≈72 px abaixo do header; a busca global vira ícone que expande o campo sobre o header.',
        MOBILE,
      ],
      notes: ['O logo pertence ao header (não à sidebar) neste modelo.', ONE_PAGE],
    },
  }),
  make({
    id: 'sidebar-integral-sem-topbar',
    name: 'Sidebar integral sem topbar',
    family: 'sidebar-integral',
    description:
      'Só o menu lateral e o conteúdo, sem barra no topo. O título e os botões de cada página ficam dentro do próprio conteúdo. Visual limpo e com mais espaço vertical.',
    tags: ['Aplicativos focados', 'Ferramentas de escrita', 'Painéis enxutos'],
    grid: grid('252px 1fr', '1fr', ['sidebar content']),
    regions: [reg('sidebar', 'sidebar', { scroll: true }), reg('content', 'content', fill('cards', { scroll: true }))],
    measurements: { sidebar: 252 },
    spec: {
      summary: 'Sidebar integral à esquerda e conteúdo em largura total à direita, sem header global; o cabeçalho da página faz parte do conteúdo.',
      structure: [
        'grid-template-columns: 252px minmax(0, 1fr); uma única linha de altura total.',
        integral(252),
        'Topo da sidebar com logo, busca compacta (ou atalho Ctrl/⌘ + K) e, no rodapé, perfil e notificações — funções que normalmente ficariam no header.',
        navItems,
        'Cabeçalho da página dentro do conteúdo: título (H1), descrição curta e ações primárias alinhadas à direita, com 24–32 px de padding.',
        contentArea(),
      ],
      behavior: [stickySidebar, 'O cabeçalho da página pode ficar sticky ao rolar (fundo sólido e borda inferior surgem só quando há rolagem).'],
      responsive: respIntegral(252),
      notes: ['Sem header global: não adicione uma topbar por conta própria.', ONE_PAGE],
    },
  }),
  make({
    id: 'sidebar-integral-direita',
    name: 'Sidebar integral à direita',
    family: 'sidebar-integral',
    description:
      'O menu lateral fica do lado direito, de cima a baixo. O conteúdo ganha destaque à esquerda, onde o olhar começa a leitura.',
    tags: ['Conteúdo em destaque', 'Ferramentas de edição', 'Interfaces RTL adaptáveis'],
    grid: grid('1fr 252px', '64px 1fr', ['header sidebar', 'content sidebar']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('cards', { scroll: true })), reg('sidebar', 'sidebar', { scroll: true })],
    measurements: { sidebar: 252, header: 64 },
    spec: {
      summary: 'Sidebar integral encostada na borda direita, do topo à base, com header e conteúdo à esquerda.',
      structure: [
        'grid-template-columns: minmax(0, 1fr) 252px; coluna principal com grid-template-rows: 64px minmax(0, 1fr).',
        integral(252, 'direita'),
        'Topo da sidebar com a mesma altura do header, contendo avatar/conta; logo do produto fica no início do header (à esquerda).',
        navItems,
        headerRow(64),
        contentArea(),
      ],
      behavior: [stickySidebar, stickyHeader, 'A ordem de foco por teclado segue a leitura: header → conteúdo → sidebar; ofereça link “Pular para a navegação”.'],
      responsive: respIntegral(252, 'direita'),
      notes: ['Sidebar integral à direita: borda esquerda fina separando do conteúdo; nunca flutuante.'],
    },
  }),

  /* --------------------------- Sidebars flutuantes -------------------------- */
  make({
    id: 'sidebar-flutuante-compacta',
    name: 'Sidebar flutuante compacta',
    family: 'sidebar-flutuante',
    description:
      'Um menu lateral estreito que “flutua” com espaço em volta e cantos arredondados, como um cartão. O título da página fica ao lado, sem barra pesada.',
    tags: ['SaaS modernos', 'Produtos com visual leve', 'Painéis de criação'],
    grid: grid('224px 1fr', '56px 1fr', ['sidebar header', 'sidebar content'], 16, 16),
    regions: [
      reg('sidebar', 'sidebar', { floating: true, scroll: true }),
      reg('header', 'header', fill('transparent')),
      reg('content', 'content', fill('dashboard', { scroll: true })),
    ],
    measurements: { sidebar: 224, header: 56, gap: 16 },
    spec: {
      summary: 'Sidebar compacta flutuante (afastada das bordas, cantos arredondados) com faixa de título e conteúdo diretamente sobre o fundo.',
      structure: [
        'Canvas com padding de 16 px; grid-template-columns: 224px minmax(0, 1fr); grid-template-rows: 56px minmax(0, 1fr); gap: 16 px.',
        'Sidebar flutuante de ≈224 px: altura calc(100dvh − 32 px), afastada 16 px do topo, da base e da borda esquerda, raio de 12–16 px, superfície própria com borda fina.',
        'Itens compactos de 36–40 px com ícone + rótulo curto; logo no topo da sidebar.',
        'Faixa de título de ≈56 px sem fundo próprio (sobre o canvas): título da página, breadcrumb e ações — não é uma barra.',
        'Conteúdo diretamente sobre o fundo da página, com cartões próprios; o conteúdo não é uma caixa flutuante.',
      ],
      behavior: [
        'A sidebar é sticky (top: 16 px) e rola internamente; o conteúdo rola com a página.',
        'Ao rolar, a faixa de título pode ficar sticky com fundo sólido do canvas.',
      ],
      responsive: respFloating(224, 16),
      notes: ['Sidebar flutuante: sempre com afastamento das bordas e cantos próprios; não encoste na borda nem converta em integral.'],
    },
  }),
  make({
    id: 'sidebar-flutuante-larga',
    name: 'Sidebar flutuante larga',
    family: 'sidebar-flutuante',
    description:
      'Um menu lateral largo, afastado das bordas, com espaço para busca, seções e atalhos. Bom quando há muitas páginas ou pastas para navegar.',
    tags: ['Muitas seções', 'Bibliotecas e arquivos', 'Workspaces'],
    grid: grid('288px 1fr', '1fr', ['sidebar content'], 16, 16),
    regions: [reg('sidebar', 'sidebar', { floating: true, scroll: true }), reg('content', 'content', fill('cards', { scroll: true }))],
    measurements: { sidebar: 288, gap: 16 },
    spec: {
      summary: 'Sidebar larga e flutuante, com hierarquia rica (busca, seções, favoritos), e conteúdo em largura total ao lado.',
      structure: [
        'Canvas com padding de 16 px; grid-template-columns: 288px minmax(0, 1fr); gap: 16 px.',
        'Sidebar flutuante de ≈288 px e altura calc(100dvh − 32 px), raio de 14–16 px, borda fina e superfície própria.',
        'Conteúdo interno da sidebar: logo e seletor de workspace, campo de busca, seções com títulos, lista de favoritos e cartão de ajuda/upgrade no rodapé.',
        'Conteúdo principal com cabeçalho de página próprio (sem header global) e cartões diretamente sobre o fundo.',
      ],
      behavior: [
        'Sidebar sticky com rolagem interna; seções recolhíveis lembram o estado.',
        'A busca da sidebar filtra os itens do menu em tempo real.',
      ],
      responsive: respFloating(288, 16),
      notes: ['Largura generosa é parte da escolha: não reduza abaixo de ≈248 px no desktop.'],
    },
  }),
  make({
    id: 'header-sidebar-flutuantes',
    name: 'Header e sidebar flutuantes',
    family: 'sidebar-flutuante',
    description:
      'A barra superior e o menu lateral são dois blocos separados, com espaço entre eles e em volta. O visual fica arejado e moderno.',
    tags: ['Produtos modernos', 'Dashboards leves', 'Ferramentas criativas'],
    grid: grid('232px 1fr', '60px 1fr', ['header header', 'sidebar content'], 12, 12),
    regions: [
      reg('header', 'header', { floating: true }),
      reg('sidebar', 'sidebar', { floating: true, scroll: true }),
      reg('content', 'content', fill('dashboard', { scroll: true })),
    ],
    measurements: { sidebar: 232, header: 60, gap: 12 },
    spec: {
      summary: 'Header e sidebar como blocos flutuantes independentes (ilhas), separados por 12 px, com conteúdo sobre o fundo.',
      structure: [
        'Canvas com padding de 12 px; grid-template-columns: 232px minmax(0, 1fr); grid-template-rows: 60px minmax(0, 1fr); gap: 12 px.',
        'Header flutuante de ≈60 px ocupando as duas colunas: raio de 12–14 px, borda fina, logo à esquerda, busca e ações à direita.',
        'Sidebar flutuante de ≈232 px abaixo do header, com o mesmo raio e superfície, altura até 12 px da base.',
        'Conteúdo sobre o canvas, com cartões próprios.',
      ],
      behavior: [
        'Header sticky em top: 12 px; sidebar sticky em top: 84 px com rolagem interna.',
        'O conteúdo rola por baixo do header com fundo do canvas visível no espaço entre eles.',
      ],
      responsive: [
        '1280 px ou mais: header ≈60 px e sidebar ≈232 px, afastamento de 12 px.',
        '1024–1279 px: afastamento de 8 px; sidebar ≈208 px.',
        '768–1023 px: a sidebar vira rail flutuante de ≈64 px; o header mantém logo, busca em ícone e ações.',
        MOBILE,
      ],
      notes: ['Os dois blocos têm a mesma linguagem (raio, borda, superfície) para parecerem um sistema.'],
    },
  }),
  make({
    id: 'ilhas-navegacao',
    name: 'Ilhas de navegação',
    family: 'sidebar-flutuante',
    description:
      'Todas as partes da tela viram “ilhas” separadas por espaço: menu, barra superior, conteúdo e painel lateral, cada um com cantos arredondados.',
    tags: ['Workspaces criativos', 'Ferramentas com painel lateral', 'Visual premium'],
    grid: grid('216px 1fr 272px', '60px 1fr', ['sidebar header panel', 'sidebar content panel'], 16, 16),
    regions: [
      reg('sidebar', 'sidebar', { floating: true, scroll: true }),
      reg('header', 'header', { floating: true }),
      reg('content', 'content', fill('cards', { floating: true, scroll: true })),
      reg('panel', 'panel', fill('stats', { floating: true, scroll: true })),
    ],
    measurements: { sidebar: 216, header: 60, panel: 272, gap: 16 },
    spec: {
      summary: 'Composição em ilhas: sidebar, header, conteúdo e painel direito são superfícies arredondadas independentes, separadas por 16 px.',
      structure: [
        'Canvas com padding de 16 px e cor de fundo distinta das superfícies; grid-template-columns: 216px minmax(0, 1fr) 272px; grid-template-rows: 60px minmax(0, 1fr); gap: 16 px.',
        'Sidebar (≈216 px) e painel direito (≈272 px) ocupam a altura total; o header (≈60 px) fica apenas sobre a coluna central.',
        'Todas as regiões, inclusive o conteúdo, têm superfície própria, raio de 14–20 px e borda fina; o fundo do canvas aparece nos espaços.',
        'Painel direito com resumo, atividade ou propriedades do item atual.',
      ],
      behavior: [
        'O shell ocupa 100dvh; cada ilha rola internamente (overflow: auto), sem rolagem da página.',
        'Foco por teclado percorre as ilhas na ordem: sidebar → header → conteúdo → painel.',
      ],
      responsive: [
        '1280 px ou mais: quatro ilhas visíveis com 16 px de espaço.',
        '1024–1279 px: o painel direito recolhe e abre como ilha sobreposta por botão no header; espaço de 12 px.',
        '768–1023 px: a sidebar vira rail flutuante de ≈64 px; o painel continua sob demanda.',
        MOBILE,
      ],
      notes: ['Use pouco contraste entre canvas e ilhas: separação por espaço e borda, sem sombras pesadas.'],
    },
  }),

  /* ------------------------- Rail e navegação dupla ------------------------- */
  make({
    id: 'icon-rail-esquerda',
    name: 'Icon Rail à esquerda',
    family: 'rail-dupla',
    description:
      'Um trilho bem estreito à esquerda, só com ícones. Sobra muito espaço para o conteúdo; o nome de cada item aparece ao passar o mouse.',
    tags: ['Dashboards com gráficos', 'Ferramentas com poucas seções', 'Telas largas de dados'],
    grid: grid('76px 1fr', '64px 1fr', ['rail header', 'rail content']),
    regions: [reg('rail', 'rail'), reg('header', 'header'), reg('content', 'content', fill('analytics', { scroll: true }))],
    measurements: { rail: 76, header: 64 },
    spec: {
      summary: 'Rail integral de ícones à esquerda (do topo à base) com header e conteúdo amplo ao lado.',
      structure: [
        'grid-template-columns: 76px minmax(0, 1fr); coluna principal com grid-template-rows: 64px minmax(0, 1fr).',
        'Rail de ≈76 px do topo à base, encostado na borda: logo/marca no topo (64 px), 5–7 ícones de destino de 44–48 px, configurações e avatar na base.',
        'Cada ícone tem aria-label e tooltip com o nome; o item ativo usa fundo de seleção em forma de pílula ou quadrado arredondado.',
        headerRow(64),
        contentArea(),
      ],
      behavior: [
        'Rail fixo (sticky; top: 0; height: 100dvh); tooltips aparecem em hover e focus-visible com atraso de ≈300 ms.',
        'Opcional: clique longo ou botão de expandir mostra rótulos em sobreposição (≈220 px), sem empurrar o conteúdo.',
      ],
      responsive: respRail('1024–1279 px: rail de ≈72 px; o conteúdo aproveita a largura extra para gráficos e tabelas.'),
      notes: ['Use apenas para até ≈7 destinos principais; mais que isso, prefira sidebar com rótulos.'],
    },
  }),
  make({
    id: 'rail-sidebar-contextual',
    name: 'Rail com sidebar contextual',
    family: 'rail-dupla',
    description:
      'Trilho de ícones para as áreas principais e, ao lado, um segundo menu que muda conforme a área escolhida. Organiza sistemas grandes em dois níveis.',
    tags: ['SaaS grandes', 'ERPs e CRMs', 'Plataformas com módulos'],
    grid: grid('76px 232px 1fr', '64px 1fr', ['rail submenu header', 'rail submenu content']),
    regions: [
      reg('rail', 'rail'),
      reg('submenu', 'submenu', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('table', { scroll: true })),
    ],
    measurements: { rail: 76, submenu: 232, header: 64 },
    spec: {
      summary: 'Navegação em dois níveis: rail de ícones (módulos) + sidebar contextual (páginas do módulo ativo), ambos integrais.',
      structure: [
        'grid-template-columns: 76px 232px minmax(0, 1fr); header e conteúdo na terceira coluna (grid-template-rows: 64px minmax(0, 1fr)).',
        'Rail integral de ≈76 px com os módulos principais (ícones + tooltip), do topo à base.',
        'Sidebar contextual integral de ≈232 px, também do topo à base: título do módulo ativo no topo (64 px), itens e subgrupos do módulo, filtros salvos.',
        'Separação entre rail e sidebar por borda fina; a sidebar usa superfície levemente diferente do rail.',
        headerRow(64),
        contentArea(),
      ],
      behavior: [
        'Trocar o módulo no rail atualiza o conteúdo da sidebar contextual sem recarregar a página.',
        'A sidebar contextual pode ser recolhida (botão no topo), deixando apenas o rail; o estado é lembrado.',
        'Ambos são sticky com altura 100dvh; a sidebar contextual rola internamente.',
      ],
      responsive: respRail('1024–1279 px: a sidebar contextual reduz para ≈208 px ou inicia recolhida.'),
      notes: ['Os dois níveis devem ser coerentes: o item ativo do rail sempre corresponde ao título da sidebar contextual.'],
    },
  }),
  make({
    id: 'sidebar-dupla-hierarquia',
    name: 'Sidebar dupla em hierarquia',
    family: 'rail-dupla',
    description:
      'Dois menus com nomes lado a lado: o primeiro com as seções, o segundo com as páginas da seção escolhida. Bom para sistemas com muitas telas.',
    tags: ['Sistemas extensos', 'Documentação', 'Configurações complexas'],
    grid: grid('216px 216px 1fr', '64px 1fr', ['sidebar submenu header', 'sidebar submenu content']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('submenu', 'submenu', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('record', { scroll: true })),
    ],
    measurements: { sidebar: 216, submenu: 216, header: 64 },
    spec: {
      summary: 'Duas sidebars integrais com rótulos (seções → páginas), seguidas de header e conteúdo.',
      structure: [
        'grid-template-columns: 216px 216px minmax(0, 1fr); terceira coluna com grid-template-rows: 64px minmax(0, 1fr).',
        'Sidebar primária de ≈216 px com seções (ícone + rótulo) e logo no topo; sidebar secundária de ≈216 px com as páginas da seção ativa.',
        'Ambas integrais (do topo à base), separadas por borda fina; a secundária tem título da seção no topo, alinhado ao header.',
        headerRow(64),
        contentArea(),
      ],
      behavior: [
        'Selecionar uma seção na primária atualiza a secundária; a página ativa é destacada na secundária.',
        'A sidebar primária pode compactar para rail (≈72 px) por botão, preservando a secundária.',
      ],
      responsive: [
        '1280 px ou mais: as duas sidebars com rótulos (≈432 px no total).',
        '1024–1279 px: a sidebar primária compacta para rail de ≈72 px; a secundária mantém ≈216 px.',
        '768–1023 px: primária como rail e secundária em sobreposição (abre por botão com o nome da seção).',
        MOBILE,
      ],
      notes: ['Garanta que o conteúdo mantenha pelo menos ≈640 px de largura em 1280 px.'],
    },
  }),
  make({
    id: 'rail-painel-detalhes',
    name: 'Rail com painel de detalhes',
    family: 'rail-dupla',
    description:
      'Trilho de ícones à esquerda, conteúdo no meio e um painel à direita que mostra os detalhes do item clicado, sem sair da página.',
    tags: ['Listas com detalhes', 'Gestão de pedidos', 'Suporte e atendimento'],
    grid: grid('76px 1fr 320px', '64px 1fr', ['rail header header', 'rail content detail']),
    regions: [
      reg('rail', 'rail'),
      reg('header', 'header'),
      reg('content', 'content', fill('table', { scroll: true })),
      reg('detail', 'detail', fill('props', { scroll: true })),
    ],
    measurements: { rail: 76, header: 64, detail: 320 },
    spec: {
      summary: 'Rail integral de ícones, header comum e painel de detalhes fixo à direita do conteúdo.',
      structure: [
        'grid-template-columns: 76px minmax(0, 1fr) 320px; grid-template-rows: 64px minmax(0, 1fr); o header ocupa conteúdo + painel.',
        'Rail integral de ≈76 px (ícones com tooltip).',
        'Conteúdo central com lista ou tabela; a linha selecionada fica destacada.',
        'Painel de detalhes de ≈320 px abaixo do header, integral até a base: título do item, metadados em pares rótulo/valor, ações e histórico.',
      ],
      behavior: [
        'Clicar em um item do conteúdo atualiza o painel sem navegação de página; o painel tem estado vazio (“Selecione um item”).',
        'Conteúdo e painel rolam de forma independente (overflow-y: auto em cada um).',
        'O painel pode ser fechado (X) e reaberto, devolvendo o espaço ao conteúdo.',
      ],
      responsive: respRail(respPanel(320, 'Painel de detalhes')),
      notes: ['O painel de detalhes não é modal: a lista continua utilizável enquanto ele está aberto.'],
    },
  }),

  /* --------------------------- Navegação à direita -------------------------- */
  make({
    id: 'sidebar-direita-compacta',
    name: 'Sidebar direita compacta',
    family: 'direita',
    description:
      'Barra superior de ponta a ponta e um menu estreito do lado direito, abaixo dela. O conteúdo ocupa quase toda a largura à esquerda.',
    tags: ['Portais de conteúdo', 'Áreas do cliente', 'Documentação'],
    grid: grid('1fr 208px', '64px 1fr', ['header header', 'content sidebar']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('article', { scroll: true })), reg('sidebar', 'sidebar', { scroll: true })],
    measurements: { header: 64, sidebar: 208 },
    spec: {
      summary: 'Header global e sidebar compacta à direita, abaixo do header, com conteúdo dominante à esquerda.',
      structure: [
        'grid-template-columns: minmax(0, 1fr) 208px; grid-template-rows: 64px minmax(0, 1fr); header em largura total.',
        'Header global de ≈64 px com logo, links principais e ações.',
        'Sidebar compacta de ≈208 px encostada na borda direita, do header até a base: lista de páginas da seção ou “Nesta página” (âncoras).',
        'Conteúdo com largura de leitura confortável (máx. ≈880 px) alinhado à esquerda da coluna.',
      ],
      behavior: [
        'Sidebar sticky em top: 64 px com rolagem interna; destaca a seção visível do conteúdo (scrollspy) quando usada como índice.',
        'Links da sidebar com foco visível e área mínima de 36 px de altura.',
      ],
      responsive: [
        '1280 px ou mais: sidebar direita de ≈208 px.',
        '1024–1279 px: sidebar de ≈184 px; texto dos itens quebra em duas linhas quando necessário.',
        '768–1023 px: a sidebar vira um seletor recolhível no topo do conteúdo (“Nesta seção”), aberto por clique.',
        MOBILE,
      ],
    },
  }),
  make({
    id: 'inspector-painel-direito',
    name: 'Inspector ou painel direito',
    family: 'direita',
    description:
      'Uma área de trabalho grande no centro e um painel à direita com as propriedades do que está selecionado, como em editores e ferramentas de criação.',
    tags: ['Editores visuais', 'Construtores de formulários', 'Configuração de itens'],
    grid: grid('1fr 304px', '56px 1fr', ['header header', 'content panel']),
    regions: [
      reg('header', 'header'),
      reg('content', 'content', fill('preview')),
      reg('panel', 'panel', fill('props', { label: 'INSPECTOR', scroll: true })),
    ],
    measurements: { header: 56, panel: 304 },
    spec: {
      summary: 'Área de trabalho central (canvas) com inspector de propriedades fixo à direita e header de ferramentas.',
      structure: [
        'grid-template-columns: minmax(0, 1fr) 304px; grid-template-rows: 56px minmax(0, 1fr).',
        'Header de ≈56 px com nome do documento, ferramentas principais e ações (compartilhar, publicar).',
        'Canvas central com fundo neutro e o objeto em edição centralizado; zoom e rolagem próprios.',
        'Inspector integral de ≈304 px: grupos de propriedades (recolhíveis), campos rótulo/valor em duas colunas, cores, tamanhos e ações do item selecionado.',
      ],
      behavior: [
        'O inspector reflete a seleção atual; sem seleção, mostra propriedades do documento.',
        'O inspector rola internamente; o canvas tem pan/zoom e não rola a página.',
        'Alterações no inspector são aplicadas imediatamente no canvas, com desfazer (Ctrl/⌘ + Z).',
      ],
      responsive: [
        '1280 px ou mais: inspector sempre visível.',
        respPanel(304, 'Inspector'),
        'O canvas ocupa toda a largura liberada quando o inspector está fechado.',
        MOBILE,
      ],
      notes: ['Shell de altura fixa (100dvh): a página não rola; cada área rola por conta própria.'],
    },
  }),
  make({
    id: 'workspace-chat-lateral',
    name: 'Workspace com chat lateral',
    family: 'direita',
    description:
      'Menu à esquerda, área de trabalho no meio e uma conversa (chat ou assistente) sempre aberta do lado direito.',
    tags: ['Assistentes de IA', 'Suporte e atendimento', 'Colaboração em equipe'],
    grid: grid('240px 1fr 360px', '56px 1fr', ['sidebar header chat', 'sidebar content chat']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('document', { scroll: true })),
      reg('chat', 'chat', fill('chat', { scroll: true })),
    ],
    measurements: { sidebar: 240, header: 56, panel: 360 },
    spec: {
      summary: 'Sidebar integral, área de trabalho central e painel de chat integral à direita (do topo à base).',
      structure: [
        'grid-template-columns: 240px minmax(0, 1fr) 360px; o header (≈56 px) fica só sobre a coluna central.',
        integral(240),
        'Painel de chat integral de ≈360 px na borda direita: cabeçalho com título e ações, lista de mensagens rolável e campo de envio fixo na base.',
        'Área de trabalho central com documento, tabela ou editor, com padding de 24 px.',
      ],
      behavior: [
        'A lista de mensagens rola internamente e mantém a última mensagem visível; o campo de envio cresce até 6 linhas.',
        'O chat pode ser recolhido para um botão na borda direita; o estado é lembrado.',
        'Enter envia, Shift + Enter quebra linha; mensagens novas são anunciadas a leitores de tela (aria-live).',
      ],
      responsive: [
        '1280 px ou mais: as três colunas visíveis.',
        '1024–1279 px: a sidebar vira rail de ≈72 px; o chat mantém ≈340 px.',
        '768–1023 px: o chat vira painel sobreposto à direita (abre por botão no header), com foco preso e Esc.',
        MOBILE,
      ],
      measurements: { chat: '≈360 px (320–400 px)' },
    },
  }),

  /* ------------------------------ Sem sidebar ------------------------------- */
  make({
    id: 'topbar-integral-fixa',
    name: 'Topbar integral fixa',
    family: 'sem-sidebar',
    description:
      'Uma barra no topo, de ponta a ponta, que fica sempre visível ao rolar. Todo o menu fica nela e o conteúdo ocupa a largura toda.',
    tags: ['Lojas e catálogos', 'Sites institucionais', 'Produtos simples'],
    grid: grid('1fr', '64px 1fr', ['header', 'content']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('products'))],
    measurements: { header: 64, contentMax: 1200 },
    spec: {
      summary: 'Header integral fixo no topo (largura total) e conteúdo centralizado com largura máxima, sem navegação lateral.',
      structure: [
        'grid-template-rows: 64px minmax(0, 1fr); o header ocupa 100% da largura, encostado no topo e nas bordas.',
        'Conteúdo interno do header limitado à largura máxima do site (≈1200 px, centralizado): logo à esquerda, links principais, busca e ações/carrinho à direita.',
        'Conteúdo em container centralizado de até ≈1200 px com padding lateral de 24–32 px.',
      ],
      behavior: [
        'Header position: sticky; top: 0 com fundo sólido e borda inferior fina; não esconde ao rolar.',
        'Links com menu suspenso (dropdown ou mega menu) abrem em hover e clique, fecham com Esc e clique fora.',
      ],
      responsive: respTop(64),
      notes: [ONE_PAGE],
    },
  }),
  make({
    id: 'topbar-interna',
    name: 'Topbar interna',
    family: 'sem-sidebar',
    description:
      'A barra de menu fica dentro da largura do conteúdo, com um pequeno recuo do topo, em vez de ir de ponta a ponta. Visual mais delicado e organizado.',
    tags: ['Sites de produto', 'Blogs e portais', 'Páginas institucionais'],
    grid: grid('1fr 1040px 1fr', '16px 60px 1fr', ['. . .', '. header .', '. content .']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('cards'))],
    measurements: { header: 60, contentMax: 1040 },
    spec: {
      summary: 'Topbar contida na coluna do conteúdo (mesma largura máxima), com recuo do topo e sem tocar as bordas laterais da janela.',
      structure: [
        'Container central de ≈1040 px; grid-template-rows: 16px 60px minmax(0, 1fr).',
        'Topbar de ≈60 px dentro do container: borda fina em volta (ou fundo de superfície), cantos levemente arredondados (4–8 px); logo, links e ação principal.',
        'O conteúdo usa exatamente a mesma largura e alinhamento da topbar, reforçando a coluna.',
      ],
      behavior: [
        'A topbar rola com a página ou fica sticky com top: 12 px — sem sobrepor conteúdo importante (o conteúdo começa abaixo dela).',
        'Itens com estado ativo e foco visível; menu suspenso alinhado à borda da topbar.',
      ],
      responsive: [
        '1280 px ou mais: container de ≈1040 px centralizado.',
        '1024–1279 px: container ocupa a largura com 24 px de margem lateral.',
        '768–1023 px: links recolhem em botão “Menu” dentro da topbar; o painel abre alinhado ao container.',
        MOBILE,
      ],
      notes: ['Não é um header flutuante sobreposto: ele reserva o próprio espaço no fluxo da página.', ONE_PAGE],
    },
  }),
  make({
    id: 'topbar-duas-linhas',
    name: 'Navegação superior de duas linhas',
    family: 'sem-sidebar',
    description:
      'Duas faixas no topo: a primeira com logo, busca e conta; a segunda com as categorias. Muito usada em lojas e portais com muitas seções.',
    tags: ['Lojas virtuais', 'Portais de notícias', 'Marketplaces'],
    grid: grid('1fr', '64px 44px 1fr', ['header', 'nav', 'content']),
    regions: [reg('header', 'header'), reg('nav', 'submenu', { label: 'CATEGORIAS' }), reg('content', 'content', fill('products'))],
    measurements: { header: 64, submenu: 44, contentMax: 1280 },
    spec: {
      summary: 'Header de duas linhas: linha principal (logo, busca, conta, carrinho) + linha de categorias; conteúdo em largura máxima.',
      structure: [
        'grid-template-rows: 64px 44px minmax(0, 1fr); ambas as linhas em largura total com conteúdo limitado a ≈1280 px.',
        'Linha 1 (≈64 px): logo, campo de busca largo (flex: 1, até ≈640 px), conta, favoritos e carrinho com contador.',
        'Linha 2 (≈44 px): categorias em linha com espaçamento uniforme; cada categoria pode abrir um mega menu de largura total.',
        'Separação entre as linhas por borda fina ou leve diferença de superfície.',
      ],
      behavior: [
        'Ao rolar para baixo, a linha 2 recolhe e a linha 1 permanece sticky; ao rolar para cima, a linha 2 reaparece (com prefers-reduced-motion respeitado).',
        'Mega menu abre em hover com atraso de ≈150 ms e por clique/teclado; fecha com Esc.',
      ],
      responsive: [
        '1280 px ou mais: as duas linhas completas.',
        '1024–1279 px: categorias excedentes vão para “Mais categorias”.',
        '768–1023 px: a linha de categorias vira faixa horizontal rolável (overflow-x: auto, sem barra visível) com indicação de continuidade.',
        MOBILE,
      ],
      measurements: { linhaDeCategorias: '≈44 px' },
      notes: [ONE_PAGE],
    },
  }),
  make({
    id: 'header-central-flutuante',
    name: 'Header central flutuante',
    family: 'sem-sidebar',
    description:
      'Uma barra arredondada flutua no centro do topo, por cima do conteúdo, com espaço em volta. O conteúdo começa logo atrás dela, ocupando a tela toda.',
    tags: ['Landing pages', 'Lojas com visual moderno', 'Lançamentos de produto'],
    grid: grid('1fr', '1fr', ['content']),
    regions: [
      reg('content', 'content', fill('hero')),
      reg('header', 'header', {
        floating: true,
        overlay: { top: '16px', left: 'calc(50% - 380px)', width: '760px', height: '56px' },
      }),
    ],
    measurements: { header: 56, gap: 16, contentMax: 1200 },
    spec: {
      summary: 'Header em formato de cápsula, centralizado e sobreposto ao conteúdo (position: fixed), com afastamento do topo.',
      structure: [
        'O conteúdo ocupa a largura total desde o topo (a primeira seção/hero começa atrás do header).',
        'Header flutuante de ≈56 px de altura e até ≈760 px de largura, centralizado (left: 50%; transform: translateX(−50%)), a 16 px do topo, raio de 999 px ou 16 px.',
        'Dentro do header: logo à esquerda, 3–5 links ao centro e um botão de ação (CTA) à direita.',
        'Superfície do header sólida ou translúcida (com backdrop-filter e fallback sólido), borda fina.',
      ],
      behavior: [
        'position: fixed com z-index acima do conteúdo; o primeiro conteúdo tem padding-top suficiente (≈88 px) para não ficar escondido.',
        'Ao rolar, o header pode ganhar fundo mais opaco para manter o contraste sobre qualquer seção.',
      ],
      responsive: [
        '1280 px ou mais: cápsula de até ≈760 px centralizada.',
        '1024–1279 px: cápsula ocupa até 90% da largura.',
        '768–1023 px: links recolhem em botão “Menu” dentro da cápsula; o painel abre abaixo dela, também flutuante.',
        MOBILE,
      ],
      notes: ['Overlay: o header não reserva espaço no grid; garanta contraste do texto sobre o hero e que nenhum título fique escondido sob ele.', ONE_PAGE],
    },
  }),
  make({
    id: 'minimalista-sem-lateral',
    name: 'Layout minimalista sem navegação lateral',
    family: 'sem-sidebar',
    description:
      'Uma barra fina no topo com poucos links e o conteúdo em uma coluna central estreita, confortável para ler. Nada de menus laterais.',
    tags: ['Blogs e artigos', 'Landing pages simples', 'Portfólios textuais'],
    grid: grid('1fr', '56px 1fr', ['header', 'content']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('article'))],
    measurements: { header: 56, contentMax: 720 },
    spec: {
      summary: 'Header fino e discreto com conteúdo em coluna única centralizada de largura de leitura.',
      structure: [
        'grid-template-rows: 56px minmax(0, 1fr).',
        'Header de ≈56 px sem fundo marcante: logo/nome à esquerda e 2–4 links de texto à direita.',
        'Coluna de conteúdo centralizada com max-width ≈720 px (65–75 caracteres por linha) e padding lateral de 24 px.',
        'Hierarquia por tipografia e espaço (sem cartões ou caixas).',
      ],
      behavior: ['O header pode rolar com a página (não sticky) para máxima limpeza.', 'Links com sublinhado no hover e foco visível.'],
      responsive: [
        '1024 px ou mais: coluna de ≈720 px centralizada.',
        '768–1023 px: a coluna mantém ≈720 px com margens laterais de 32 px.',
        MOBILE,
      ],
      notes: [ONE_PAGE],
    },
  }),

  /* ------------------------------- Editoriais ------------------------------- */
  make({
    id: 'landing-editorial-ampla',
    name: 'Landing editorial ampla',
    family: 'editorial',
    description:
      'Página de apresentação com títulos grandes, imagens largas e seções bem espaçadas, como uma revista. A barra superior é alta e elegante.',
    tags: ['Landing pages', 'Marcas e produtos', 'Lançamentos'],
    grid: grid('1fr', '76px 1fr', ['header', 'content']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('editorial'))],
    measurements: { header: 76, contentMax: 1200 },
    spec: {
      summary: 'Landing de composição editorial: header de ≈76 px e seções amplas com tipografia grande e imagens de largura generosa.',
      structure: [
        'grid-template-rows: 76px minmax(0, 1fr); container de até ≈1200 px.',
        'Header de ≈76 px: logo, 3–5 links e CTA; muito espaço horizontal entre os grupos.',
        'Hero com título de 56–72 px (clamp), subtítulo e CTA, seguido de imagem larga (aspect-ratio 16/9 ou 21/9).',
        'Seções alternadas texto/imagem com 96–128 px de espaço vertical entre elas; grid de 12 colunas.',
      ],
      behavior: ['Header sticky com fundo sólido ao rolar; links de âncora rolam suavemente (respeitando prefers-reduced-motion).'],
      responsive: [
        '1280 px ou mais: título até 72 px e imagens largas.',
        '1024–1279 px: título ≈56 px; espaços verticais de ≈96 px.',
        '768–1023 px: seções texto/imagem empilham; links do header recolhem em “Menu”.',
        MOBILE,
      ],
      notes: [ONE_PAGE],
    },
  }),
  make({
    id: 'editorial-assimetrica',
    name: 'Editorial assimétrica',
    family: 'editorial',
    description:
      'O conteúdo principal ocupa uma coluna larga e, ao lado, uma coluna mais estreita traz destaques, notas ou chamadas. Lembra a página de um jornal.',
    tags: ['Revistas e blogs', 'Estudos de caso', 'Portfólios'],
    grid: grid('8fr 4fr', '76px 1fr', ['header header', 'content aside']),
    regions: [
      reg('header', 'header'),
      reg('content', 'content', fill('editorial')),
      reg('aside', 'panel', fill('list', { label: 'DESTAQUES' })),
    ],
    measurements: { header: 76 },
    spec: {
      summary: 'Composição editorial em duas colunas desiguais (≈2:1): coluna principal larga e coluna lateral de destaques.',
      structure: [
        'grid-template-columns: 8fr 4fr (grid de 12 colunas, 8 + 4) com 32–48 px entre as colunas; header de ≈76 px em largura total.',
        'Coluna principal: título grande, imagem principal e texto em blocos.',
        'Coluna lateral: destaques com miniatura + título, citações e chamadas; separada por borda fina ou apenas espaço.',
      ],
      behavior: ['A coluna lateral pode ficar sticky (top: 96 px) enquanto o texto principal rola.'],
      responsive: [
        '1280 px ou mais: proporção 8/4.',
        '1024–1279 px: proporção 7/5 para manter a coluna lateral legível.',
        '768–1023 px: colunas empilham; destaques vão para depois do conteúdo principal.',
        MOBILE,
      ],
      measurements: { colunas: '≈2:1 (8/12 + 4/12)' },
      notes: [ONE_PAGE],
    },
  }),
  make({
    id: 'magazine-indice-lateral',
    name: 'Magazine com índice lateral',
    family: 'editorial',
    description:
      'Um índice fica fixo do lado esquerdo enquanto o texto rola ao lado. A pessoa sempre sabe em que parte está e pode pular para outra.',
    tags: ['Artigos longos', 'Documentação', 'Relatórios'],
    grid: grid('248px 1fr', '76px 1fr', ['header header', 'index content']),
    regions: [
      reg('header', 'header'),
      reg('index', 'submenu', fill('index', { label: 'ÍNDICE' })),
      reg('content', 'content', fill('article')),
    ],
    measurements: { header: 76, submenu: 248, contentMax: 720 },
    spec: {
      summary: 'Página de leitura com índice lateral fixo (sumário com scrollspy) e coluna de texto de largura de leitura.',
      structure: [
        'grid-template-columns: 248px minmax(0, 1fr); header de ≈76 px em largura total.',
        'Índice de ≈248 px: título “Nesta página”, lista de seções e subseções com recuo, indicador da seção atual.',
        'Texto em coluna de até ≈720 px, alinhada ao início da área de conteúdo, com títulos âncora.',
      ],
      behavior: [
        'Índice sticky (top: 92 px) com rolagem interna se for longo; destaca a seção visível (IntersectionObserver).',
        'Clicar em um item rola até a seção (scroll suave, respeitando prefers-reduced-motion) e atualiza a URL (#ancora).',
      ],
      responsive: [
        '1280 px ou mais: índice sempre visível.',
        '1024–1279 px: índice de ≈208 px.',
        '768–1023 px: o índice vira um seletor recolhível “Nesta página” no topo do texto.',
        MOBILE,
      ],
      notes: [ONE_PAGE],
    },
  }),
  make({
    id: 'portfolio-full-bleed',
    name: 'Portfólio full-bleed',
    family: 'editorial',
    description:
      'Imagens ocupam a tela de ponta a ponta, sem margens. A barra superior é transparente e fica por cima das fotos, discreta.',
    tags: ['Portfólios', 'Fotografia e arquitetura', 'Marcas visuais'],
    grid: grid('1fr', '1fr', ['content']),
    regions: [
      reg('content', 'content', fill('gallery')),
      reg('header', 'header', fill('transparent', { overlay: { top: '0px', left: '0px', right: '0px', height: '72px' } })),
    ],
    measurements: { header: 72 },
    spec: {
      summary: 'Galeria de imagens full-bleed (sem margens laterais) com header transparente sobreposto.',
      structure: [
        'Conteúdo em largura total (100vw, sem padding lateral) desde o topo: imagens grandes em grade assimétrica ou sequência vertical.',
        'Header de ≈72 px transparente, sobreposto às imagens (position: fixed), com logo e 2–4 links em cor de alto contraste.',
        'Legendas curtas sobre ou abaixo das imagens; espaçamento mínimo entre imagens (0–8 px).',
      ],
      behavior: [
        'Header com gradiente sutil ou fundo que surge ao rolar para garantir contraste mínimo de 4,5:1.',
        'Imagens com aspect-ratio definido e carregamento preguiçoso (loading="lazy"); clique abre o projeto.',
      ],
      responsive: [
        '1280 px ou mais: grade de 2–3 colunas full-bleed.',
        '1024–1279 px: 2 colunas.',
        '768–1023 px: 1–2 colunas; links do header recolhem em “Menu”.',
        MOBILE,
      ],
      notes: ['Overlay: o header não reserva espaço; nenhuma legenda importante deve ficar sob ele.', ONE_PAGE],
    },
  }),

  /* ------------------------ Múltiplas colunas e apps ------------------------ */
  make({
    id: 'dashboard-tres-colunas',
    name: 'Dashboard de três colunas',
    family: 'multicoluna',
    description:
      'Menu à esquerda, indicadores e gráficos no centro e um painel à direita com resumos ou atividades. Mostra muita informação de uma vez.',
    tags: ['Dashboards', 'Painéis de gestão', 'Monitoramento'],
    grid: grid('240px 1fr 304px', '64px 1fr', ['sidebar header header', 'sidebar content panel']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('dashboard', { scroll: true })),
      reg('panel', 'panel', fill('stats', { scroll: true })),
    ],
    measurements: { sidebar: 240, header: 64, panel: 304 },
    spec: {
      summary: 'Dashboard com sidebar integral, área central de indicadores e painel direito de resumo, sob um header comum.',
      structure: [
        'grid-template-columns: 240px minmax(0, 1fr) 304px; grid-template-rows: 64px minmax(0, 1fr); o header cobre centro + painel.',
        integral(240),
        'Centro: linha de 3–4 KPIs, gráfico principal e tabela; grid interno de 12 colunas.',
        'Painel direito de ≈304 px, integral até a base: resumo, metas, atividade recente.',
      ],
      behavior: ['Sidebar, conteúdo e painel rolam de forma independente; o header permanece fixo.', 'O painel pode ser recolhido por botão no header.'],
      responsive: [
        '1280 px ou mais: três colunas.',
        respPanel(304, 'Painel direito'),
        '1024–1279 px: a sidebar reduz para ≈216 px; 768–1023 px: sidebar como rail de ≈72 px.',
        MOBILE,
      ],
    },
  }),
  make({
    id: 'split-view-50-50',
    name: 'Split View 50/50',
    family: 'multicoluna',
    description:
      'A tela é dividida em duas metades iguais, por exemplo para comparar, editar de um lado e ver o resultado do outro.',
    tags: ['Editores com prévia', 'Comparação', 'Tradução e revisão'],
    grid: grid('1fr 1fr', '56px 1fr', ['header header', 'left right']),
    regions: [
      reg('header', 'header'),
      reg('left', 'content', fill('editor', { label: 'CONTEÚDO A', scroll: true })),
      reg('right', 'content', fill('preview', { label: 'CONTEÚDO B', scroll: true })),
    ],
    measurements: { header: 56 },
    spec: {
      summary: 'Duas áreas de conteúdo de mesma largura lado a lado, com header comum e divisor entre elas.',
      structure: [
        'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: 56px minmax(0, 1fr).',
        'Header de ≈56 px com título, alternador de modo e ações.',
        'Painéis A e B com cabeçalho próprio de 40 px (nome do painel + ações) e rolagem independente; divisor de 1 px.',
      ],
      behavior: [
        'Divisor opcionalmente arrastável (role="separator", aria-valuenow, setas do teclado), com limites de 30–70%.',
        'Rolagem sincronizada opcional entre os painéis.',
      ],
      responsive: [
        '1024 px ou mais: 50/50.',
        '768–1023 px: alternância por abas “A | B” no topo, um painel por vez, preservando o estado de cada um.',
        MOBILE,
      ],
    },
  }),
  make({
    id: 'master-detail-35-65',
    name: 'Master-detail 35/65',
    family: 'multicoluna',
    description:
      'Uma lista à esquerda (cerca de um terço da tela) e os detalhes do item escolhido à direita. Como em caixas de e-mail.',
    tags: ['E-mail e mensagens', 'Cadastros', 'Chamados e pedidos'],
    grid: grid('7fr 13fr', '56px 1fr', ['header header', 'list detail']),
    regions: [
      reg('header', 'header'),
      reg('list', 'panel', fill('list', { label: 'LISTA', scroll: true })),
      reg('detail', 'detail', fill('record', { scroll: true })),
    ],
    measurements: { header: 56 },
    spec: {
      summary: 'Padrão master-detail: lista (≈35%) e detalhe do item selecionado (≈65%), com rolagens independentes.',
      structure: [
        'grid-template-columns: 7fr 13fr (≈35/65) com mínimo de 320 px para a lista; header de ≈56 px.',
        'Lista: busca/filtros no topo, itens de 64–72 px com avatar, título, trecho e data; item selecionado destacado.',
        'Detalhe: cabeçalho do item com ações, conteúdo completo e histórico.',
      ],
      behavior: [
        'Selecionar um item atualiza o detalhe e a URL (/itens/:id) sem recarregar; setas ↑/↓ navegam na lista.',
        'Lista e detalhe rolam de forma independente; estado vazio no detalhe quando nada está selecionado.',
      ],
      responsive: [
        '1280 px ou mais: 35/65.',
        '1024–1279 px: lista com 320 px fixos e detalhe fluido.',
        '768–1023 px: lista e detalhe alternam (detalhe abre sobre a lista com botão “Voltar”).',
        MOBILE,
      ],
      measurements: { lista: '≈35% (mín. 320 px)', detalhe: '≈65%' },
    },
  }),
  make({
    id: 'crm-paineis-duplos',
    name: 'CRM com painéis duplos',
    family: 'multicoluna',
    description:
      'Menu à esquerda, a ficha do cliente no centro e, à direita, dois painéis empilhados: atividades e contatos.',
    tags: ['CRM e vendas', 'Atendimento', 'Gestão de clientes'],
    grid: grid('232px 1fr 320px', '64px 1fr 1fr', ['sidebar header header', 'sidebar content activity', 'sidebar content contacts']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('record', { scroll: true })),
      reg('activity', 'panel', fill('activity', { label: 'ATIVIDADES', scroll: true })),
      reg('contacts', 'panel', fill('list', { label: 'CONTATOS', scroll: true })),
    ],
    measurements: { sidebar: 232, header: 64, panel: 320 },
    spec: {
      summary: 'Ficha central de registro com coluna direita dividida em dois painéis empilhados (atividades e contatos).',
      structure: [
        'grid-template-columns: 232px minmax(0, 1fr) 320px; grid-template-rows: 64px minmax(0, 1fr) minmax(0, 1fr).',
        integral(232),
        'Centro: cabeçalho do registro (nome, status, responsável, ações), abas e campos em grid de 2 colunas.',
        'Coluna direita de ≈320 px com dois painéis de mesma altura, cada um com cabeçalho de 40 px e rolagem própria.',
      ],
      behavior: ['Cada painel direito pode ser recolhido, dando a altura ao outro.', 'Registrar uma atividade atualiza o painel sem recarregar a ficha.'],
      responsive: [
        '1280 px ou mais: três colunas.',
        '1024–1279 px: painéis direitos viram abas (Atividades | Contatos) em uma única coluna de ≈300 px.',
        '768–1023 px: sidebar como rail; a coluna direita abre sob demanda em sobreposição.',
        MOBILE,
      ],
    },
  }),
  make({
    id: 'analytics-lateral-direita',
    name: 'Analytics com lateral direita',
    family: 'multicoluna',
    description:
      'Barra superior, uma faixa de filtros (período, região…) e gráficos grandes, com um painel de resumo do lado direito.',
    tags: ['Analytics', 'Relatórios', 'Business intelligence'],
    grid: grid('1fr 300px', '64px 52px 1fr', ['header header', 'toolbar toolbar', 'content panel']),
    regions: [
      reg('header', 'header'),
      reg('toolbar', 'toolbar', fill('filters', { label: 'FILTROS' })),
      reg('content', 'content', fill('analytics', { scroll: true })),
      reg('panel', 'panel', fill('stats', { label: 'RESUMO', scroll: true })),
    ],
    measurements: { header: 64, panel: 300 },
    spec: {
      summary: 'Analytics sem sidebar: header, barra de filtros em largura total, área de gráficos e painel lateral direito de resumo.',
      structure: [
        'grid-template-columns: minmax(0, 1fr) 300px; grid-template-rows: 64px 52px minmax(0, 1fr).',
        'Header de ≈64 px com logo, abas de relatórios e ações (exportar, compartilhar).',
        'Barra de filtros de ≈52 px: período, comparação, segmentos em chips e botão “Limpar”.',
        'Área de gráficos com grid de 12 colunas (gráfico principal em 8, secundários em 4); painel direito de ≈300 px com resumo, insights e metas.',
      ],
      behavior: [
        'Header e barra de filtros sticky juntos; alterar filtros atualiza todos os gráficos e o resumo.',
        'Gráficos com tooltip acessível e tabela alternativa (ver dados).',
      ],
      responsive: [
        '1280 px ou mais: painel direito visível.',
        respPanel(300, 'Painel de resumo'),
        '768–1023 px: filtros recolhem em botão “Filtros” que abre painel; gráficos em coluna única.',
        MOBILE,
      ],
      measurements: { barraDeFiltros: '≈52 px' },
    },
  }),
  make({
    id: 'workspace-produtividade',
    name: 'Workspace de produtividade',
    family: 'multicoluna',
    description:
      'Árvore de páginas à esquerda, documento no centro com barra de ferramentas e comentários à direita. Como em editores de notas e documentos.',
    tags: ['Notas e documentos', 'Wikis', 'Gestão de projetos'],
    grid: grid('256px 1fr 280px', '48px 1fr', ['sidebar toolbar toolbar', 'sidebar content panel']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('toolbar', 'toolbar', fill('tabs')),
      reg('content', 'content', fill('document', { scroll: true })),
      reg('panel', 'panel', fill('activity', { label: 'COMENTÁRIOS', scroll: true })),
    ],
    measurements: { sidebar: 256, panel: 280 },
    spec: {
      summary: 'Workspace com árvore de navegação, documento central com barra de ferramentas e painel de comentários.',
      structure: [
        'grid-template-columns: 256px minmax(0, 1fr) 280px; grid-template-rows: 48px minmax(0, 1fr).',
        `${integral(256)} Contém seletor de workspace, busca e árvore de páginas com níveis recolhíveis.`,
        'Barra de ferramentas de ≈48 px sobre documento + comentários: caminho da página, formatação, compartilhar.',
        'Documento central com largura de leitura (≈720 px) centralizado na coluna; painel de comentários de ≈280 px.',
      ],
      behavior: [
        'Árvore com expandir/recolher por teclado (setas ←/→), arrastar para reordenar.',
        'Comentários ancorados ao trecho do documento; o painel pode ser fechado.',
      ],
      responsive: [
        '1280 px ou mais: três colunas.',
        respPanel(280, 'Painel de comentários'),
        '768–1023 px: a árvore vira painel sobreposto aberto por botão na barra de ferramentas.',
        MOBILE,
      ],
      measurements: { barraDeFerramentas: '≈48 px' },
    },
  }),
  make({
    id: 'command-first',
    name: 'Command-first',
    family: 'multicoluna',
    description:
      'A interface gira em torno de uma barra de comandos: você digita o que quer fazer e o sistema leva até lá. O resto da tela é bem limpo.',
    tags: ['Ferramentas para usuários avançados', 'Produtividade', 'Desenvolvedores'],
    grid: grid('56px 1fr', '1fr', ['rail content']),
    regions: [
      reg('rail', 'rail'),
      reg('content', 'content', fill('list', { scroll: true })),
      reg('command', 'toolbar', {
        label: 'COMANDOS',
        floating: true,
        overlay: { top: '88px', left: 'calc(50% - 292px)', width: '640px', height: '56px' },
      }),
    ],
    measurements: { rail: 56 },
    spec: {
      summary: 'Interface centrada em uma barra de comandos (paleta) sobreposta, com rail mínimo e conteúdo limpo.',
      structure: [
        'grid-template-columns: 56px minmax(0, 1fr); rail mínimo de ≈56 px com 3–4 ícones essenciais.',
        'Barra de comandos de ≈640 × 56 px, centralizada e sobreposta ao conteúdo (overlay), com raio de 12–14 px e campo de texto grande.',
        'Ao digitar, a barra expande uma lista de resultados agrupados (navegar, criar, ações recentes) com atalhos de teclado à direita.',
        'Conteúdo limpo em lista ou documento, com pouco cromo de interface.',
      ],
      behavior: [
        'Ctrl/⌘ + K abre/foca a barra em qualquer tela; Esc fecha; ↑/↓ e Enter executam; role="combobox" com listbox.',
        'Resultados recentes e sugestões aparecem antes de digitar; a busca é tolerante a erros de digitação.',
      ],
      responsive: [
        '1024 px ou mais: barra de ≈640 px centralizada.',
        '768–1023 px: barra ocupa 90% da largura; resultados em altura máxima de 60dvh com rolagem interna.',
        MOBILE,
      ],
      measurements: { barraDeComandos: '≈640 × 56 px' },
      notes: ['Overlay: a barra de comandos fica acima do conteúdo e não reserva espaço no grid.'],
    },
  }),
  make({
    id: 'sistema-hospitalar-denso',
    name: 'Sistema hospitalar denso',
    family: 'multicoluna',
    description:
      'Feito para quem precisa ver muita informação ao mesmo tempo: faixa com os dados do paciente, menu, tabela densa, alertas à direita e barra de status embaixo.',
    tags: ['Saúde e prontuários', 'Operações críticas', 'Sistemas densos'],
    grid: grid('220px 1fr 280px', '52px 48px 1fr 28px', [
      'header header header',
      'sidebar patient panel',
      'sidebar content panel',
      'footer footer footer',
    ]),
    regions: [
      reg('header', 'header'),
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('patient', 'toolbar', fill('kpis', { label: 'PACIENTE' })),
      reg('content', 'content', fill('table', { scroll: true })),
      reg('panel', 'panel', fill('activity', { label: 'ALERTAS', scroll: true })),
      reg('footer', 'footer', { label: 'STATUS' }),
    ],
    measurements: { sidebar: 220, header: 52, panel: 280, footer: 28 },
    spec: {
      summary: 'Shell denso de sistema clínico: header compacto, faixa de contexto do paciente, sidebar, tabela densa, painel de alertas e barra de status.',
      structure: [
        'grid-template-columns: 220px minmax(0, 1fr) 280px; grid-template-rows: 52px 48px minmax(0, 1fr) 28px.',
        'Header compacto de ≈52 px em largura total: unidade/setor, busca de paciente, usuário e plantão.',
        'Faixa do paciente de ≈48 px sobre o conteúdo: nome, idade, registro, alergias e alertas críticos com cor semântica e ícone (nunca só cor).',
        'Sidebar de ≈220 px com módulos clínicos; tabela densa (linhas de 32–36 px, texto de 13–14 px) no centro; painel de alertas de ≈280 px.',
        'Barra de status de ≈28 px na base: conexão, última sincronização, versão.',
      ],
      behavior: [
        'A faixa do paciente nunca rola para fora da tela; trocar de paciente exige confirmação visível.',
        'Tabela com cabeçalho fixo, ordenação, filtros e navegação por teclado; alertas novos anunciados via aria-live.',
        'Atalhos de teclado documentados para ações frequentes.',
      ],
      responsive: [
        '1440 px ou mais: tudo visível com folga; 1280 px é a referência.',
        '1024–1279 px: o painel de alertas recolhe para um botão com contador no header.',
        '768–1023 px: a sidebar vira rail; a tabela ganha rolagem horizontal local com primeira coluna fixa.',
        MOBILE,
      ],
      measurements: { faixaDoPaciente: '≈48 px', linhaDeTabela: '32–36 px' },
      notes: ['Densidade alta não significa fonte pequena: mínimo de 13 px e contraste AA em todos os textos.'],
    },
  }),
  make({
    id: 'painel-financeiro-rail',
    name: 'Painel financeiro com rail',
    family: 'multicoluna',
    description:
      'Trilho de ícones à esquerda e, no topo do conteúdo, uma faixa com os principais números (saldo, receitas, despesas). Abaixo, gráficos e lançamentos.',
    tags: ['Finanças', 'Bancos e carteiras', 'Controle de gastos'],
    grid: grid('76px 1fr', '64px 112px 1fr', ['rail header', 'rail kpis', 'rail content']),
    regions: [
      reg('rail', 'rail'),
      reg('header', 'header'),
      reg('kpis', 'panel', fill('kpis', { label: 'INDICADORES' })),
      reg('content', 'content', fill('analytics', { scroll: true })),
    ],
    measurements: { rail: 76, header: 64 },
    spec: {
      summary: 'Rail integral com header, faixa fixa de indicadores financeiros e área de gráficos/lançamentos.',
      structure: [
        'grid-template-columns: 76px minmax(0, 1fr); grid-template-rows: 64px 112px minmax(0, 1fr).',
        'Rail integral de ≈76 px (ícones com tooltip).',
        'Faixa de indicadores de ≈112 px: 3–4 cartões de KPI (saldo, receitas, despesas, investimentos) com variação percentual e ícone de tendência.',
        'Conteúdo: gráfico de fluxo de caixa e tabela de lançamentos com valores alinhados à direita e fonte tabular (font-variant-numeric: tabular-nums).',
      ],
      behavior: ['A faixa de indicadores permanece visível (sticky) enquanto os lançamentos rolam.', 'Valores sensíveis podem ser ocultados por botão (olho), com aria-pressed.'],
      responsive: respRail('1024–1279 px: indicadores em 3 cartões; o quarto vai para a área de conteúdo.'),
      measurements: { faixaDeIndicadores: '≈112 px' },
    },
  }),
  make({
    id: 'kanban-filtro-lateral',
    name: 'Kanban com filtro lateral',
    family: 'multicoluna',
    description:
      'Quadro com colunas de tarefas (a fazer, fazendo, feito) e um painel de filtros ao lado para encontrar o que importa.',
    tags: ['Gestão de tarefas', 'Funil de vendas', 'Produção e pedidos'],
    grid: grid('76px 240px 1fr', '64px 1fr', ['rail header header', 'rail filters content']),
    regions: [
      reg('rail', 'rail'),
      reg('header', 'header'),
      reg('filters', 'submenu', fill('filters', { label: 'FILTROS', scroll: true })),
      reg('content', 'content', fill('kanban')),
    ],
    measurements: { rail: 76, header: 64, submenu: 240 },
    spec: {
      summary: 'Quadro kanban com rail de navegação e painel de filtros à esquerda do quadro.',
      structure: [
        'grid-template-columns: 76px 240px minmax(0, 1fr); grid-template-rows: 64px minmax(0, 1fr).',
        'Painel de filtros de ≈240 px: busca, responsáveis, etiquetas, prazos (checkboxes e chips), botão “Limpar filtros”.',
        'Quadro com colunas de ≈280 px, rolagem horizontal do quadro e vertical por coluna; cartões com título, etiquetas, responsável e prazo.',
      ],
      behavior: [
        'Arrastar cartões entre colunas (com alternativa por teclado e menu “Mover para…”).',
        'Filtros aplicam imediatamente e mostram contagem por coluna; o painel pode ser recolhido.',
      ],
      responsive: respRail('1024–1279 px: o painel de filtros inicia recolhido (botão “Filtros” com contador).'),
      measurements: { colunaDoQuadro: '≈280 px' },
    },
  }),
  make({
    id: 'admin-sem-sidebar',
    name: 'Admin sem sidebar',
    family: 'multicoluna',
    description:
      'Painel administrativo sem menu lateral: barra superior com as áreas, uma faixa com título e botões da página e uma tabela larga.',
    tags: ['Back-office simples', 'Gestão de cadastros', 'Painéis de lojas'],
    grid: grid('1fr', '64px 72px 1fr', ['header', 'pagebar', 'content']),
    regions: [reg('header', 'header'), reg('pagebar', 'toolbar', { label: 'TÍTULO E AÇÕES' }), reg('content', 'content', fill('table'))],
    measurements: { header: 64, contentMax: 1280 },
    spec: {
      summary: 'Admin com navegação apenas no header, cabeçalho de página com título e ações e conteúdo tabular em largura máxima.',
      structure: [
        'grid-template-rows: 64px 72px minmax(0, 1fr); container de até ≈1280 px.',
        'Header de ≈64 px com logo, 4–6 áreas em links/abas e ações do usuário.',
        'Cabeçalho da página de ≈72 px: breadcrumb, título e botões (primário à direita).',
        'Conteúdo: filtros em linha + tabela com paginação.',
      ],
      behavior: ['Header sticky; o cabeçalho da página rola com o conteúdo.', 'Ações em massa aparecem quando há linhas selecionadas.'],
      responsive: respTop(64),
      measurements: { cabecalhoDaPagina: '≈72 px' },
    },
  }),

  /* ------------------------------- One Screen ------------------------------- */
  make({
    id: 'one-screen-dashboard',
    name: 'Dashboard sem scroll principal',
    family: 'one-screen',
    description:
      'Todos os indicadores cabem em uma única tela, organizados em blocos. Ninguém precisa rolar a página para ver o essencial.',
    tags: ['Painéis de acompanhamento', 'Telas de reunião', 'Monitoramento'],
    oneScreen: true,
    grid: grid('76px 1fr', '56px 1fr', ['rail header', 'rail content']),
    regions: [reg('rail', 'rail'), reg('header', 'header'), reg('content', 'content', fill('tiles'))],
    measurements: { rail: 76, header: 56 },
    spec: {
      summary: 'Dashboard One Screen: rail, header compacto e grade de blocos que divide exatamente a altura restante, sem rolagem da página.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-columns: 76px minmax(0, 1fr); grid-template-rows: 56px minmax(0, 1fr).',
        'Conteúdo em grade de 3 × 2 blocos (grid-template-rows: repeat(2, minmax(0, 1fr))) com gap de 16 px; cada bloco com título, número principal e gráfico que se ajusta à altura do bloco.',
      ],
      behavior: [...ONE_SCREEN_BEHAVIOR, 'Gráficos recalculam dimensões ao redimensionar (ResizeObserver).'],
      responsive: [
        '1280 × 800 ou maior: grade 3 × 2.',
        '1024–1279 px: grade 2 × 3 mantendo a altura total.',
        ...ONE_SCREEN_RESPONSIVE,
        MOBILE,
      ],
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-painel-operacional',
    name: 'Painel operacional',
    family: 'one-screen',
    description:
      'Uma central de operações em uma tela só: blocos de status no centro, alertas à direita e uma barra de status embaixo.',
    tags: ['Centrais de operação', 'Logística', 'Atendimento em tempo real'],
    oneScreen: true,
    grid: grid('1fr 304px', '52px 1fr 32px', ['header header', 'content panel', 'footer footer']),
    regions: [
      reg('header', 'header'),
      reg('content', 'content', fill('tiles')),
      reg('panel', 'panel', fill('activity', { label: 'ALERTAS', scroll: true })),
      reg('footer', 'footer', { label: 'STATUS' }),
    ],
    measurements: { header: 52, panel: 304, footer: 32 },
    spec: {
      summary: 'Painel operacional One Screen com grade de status, coluna de alertas com rolagem interna e barra de status fixa.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-columns: minmax(0, 1fr) 304px; grid-template-rows: 52px minmax(0, 1fr) 32px.',
        'Grade central de blocos de status (filas, SLA, equipes) com cores semânticas acompanhadas de ícone e texto.',
        'Coluna de alertas de ≈304 px: lista cronológica com severidade; barra de status de ≈32 px com relógio, conexão e última atualização.',
      ],
      behavior: [...ONE_SCREEN_BEHAVIOR, 'Atualização em tempo real sem “pular” o layout: novos alertas entram no topo com animação discreta e aria-live="polite".'],
      responsive: ['1280 × 800 ou maior: grade + alertas visíveis.', '1024–1279 px: alertas viram aba alternável com a grade.', ...ONE_SCREEN_RESPONSIVE, MOBILE],
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-kiosk',
    name: 'Kiosk ou TV',
    family: 'one-screen',
    description:
      'Tela para totens, TVs ou painéis de parede: poucos blocos enormes, letras grandes e nada de rolagem. Dá para ler de longe.',
    tags: ['Totens de autoatendimento', 'TVs e painéis de parede', 'Filas e senhas'],
    oneScreen: true,
    grid: grid('1fr', '96px 1fr 64px', ['header', 'content', 'footer']),
    regions: [reg('header', 'header'), reg('content', 'content', fill('kiosk')), reg('footer', 'footer')],
    measurements: { header: 96, footer: 64 },
    spec: {
      summary: 'Interface de quiosque/TV One Screen: header alto, 2–4 blocos gigantes e rodapé informativo, legível à distância.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-rows: 96px minmax(0, 1fr) 64px.',
        'Header de ≈96 px com marca, título do painel e relógio; blocos de conteúdo com tipografia de 32–96 px (clamp) e alvos de toque de no mínimo 64 px.',
        'Rodapé de ≈64 px com instruções, avisos ou letreiro.',
      ],
      behavior: [
        ...ONE_SCREEN_BEHAVIOR,
        'Sem hover: tudo funciona por toque ou é apenas exibido; tempo de inatividade devolve à tela inicial com aviso prévio.',
      ],
      responsive: [
        'Projete para 1920 × 1080 e 1280 × 800 (paisagem) e também para totens em retrato (1080 × 1920), reorganizando os blocos em coluna.',
        ...ONE_SCREEN_RESPONSIVE,
        MOBILE,
      ],
      notes: [ONE_SCREEN_NOTE, 'Contraste mínimo 7:1 para leitura à distância.'],
    },
  }),
  make({
    id: 'one-screen-split-workspace',
    name: 'Split Workspace',
    family: 'one-screen',
    description:
      'Uma área de trabalho dividida em partes que cabem na tela: dois painéis lado a lado e um painel embaixo, como em ferramentas de programação.',
    tags: ['Editores e IDEs', 'Ferramentas técnicas', 'Produção de conteúdo'],
    oneScreen: true,
    grid: grid('56px 1fr 1fr', '48px 1fr 168px', ['rail header header', 'rail left right', 'rail console console']),
    regions: [
      reg('rail', 'rail'),
      reg('header', 'header'),
      reg('left', 'content', fill('editor', { label: 'CONTEÚDO A', scroll: true })),
      reg('right', 'content', fill('preview', { label: 'CONTEÚDO B', scroll: true })),
      reg('console', 'panel', fill('console', { label: 'CONSOLE', scroll: true })),
    ],
    measurements: { rail: 56, header: 48, panel: 168 },
    spec: {
      summary: 'Workspace One Screen com rail, dois painéis lado a lado e painel inferior redimensionável, cada um com rolagem própria.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: 48px minmax(0, 1fr) 168px.',
        'Painéis A e B com cabeçalho de 36 px (abas de arquivos); painel inferior de ≈168 px (console, resultados ou logs) em largura total ao lado do rail.',
      ],
      behavior: [
        ...ONE_SCREEN_BEHAVIOR,
        'Divisores arrastáveis entre os painéis (role="separator", teclado com setas), com tamanhos lembrados; o painel inferior pode recolher para 36 px.',
      ],
      responsive: ['1280 × 800 ou maior: três painéis.', '1024–1279 px: painéis A/B alternam por abas; o inferior permanece.', ...ONE_SCREEN_RESPONSIVE, MOBILE],
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-minimalista',
    name: 'Interface minimalista',
    family: 'one-screen',
    description:
      'Uma tela única e calma, com um elemento principal no centro (um número, um botão, um formulário curto) e quase nada em volta.',
    tags: ['Ferramentas de uma função', 'Timers e status', 'Telas de foco'],
    oneScreen: true,
    grid: grid('1fr', '56px 1fr 48px', ['header', 'content', 'footer']),
    regions: [reg('header', 'header', fill('transparent')), reg('content', 'content', fill('focus')), reg('footer', 'footer')],
    measurements: { header: 56, footer: 48, contentMax: 560 },
    spec: {
      summary: 'Tela única minimalista com header discreto, elemento central em foco e rodapé leve, tudo centralizado na viewport.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-rows: 56px minmax(0, 1fr) 48px; conteúdo central com max-width ≈560 px, centralizado vertical e horizontalmente (place-items: center).',
        'Header discreto sem fundo (logo + 1 ação); rodapé com informação secundária em texto pequeno.',
      ],
      behavior: [...ONE_SCREEN_BEHAVIOR, 'Uma ação principal clara; ações secundárias em menu discreto.'],
      responsive: ['Qualquer largura desktop: o bloco central mantém ≈560 px.', ...ONE_SCREEN_RESPONSIVE, MOBILE],
      notes: [ONE_SCREEN_NOTE],
    },
  }),
  make({
    id: 'one-screen-controle-dispositivos',
    name: 'Controle de dispositivos',
    family: 'one-screen',
    description:
      'Painel para controlar aparelhos ou ambientes: lista de cômodos à esquerda, botões e controles no centro e os detalhes do aparelho escolhido à direita.',
    tags: ['Casa inteligente', 'IoT e máquinas', 'Salas e equipamentos'],
    oneScreen: true,
    grid: grid('232px 1fr 300px', '60px 1fr', ['sidebar header header', 'sidebar content detail']),
    regions: [
      reg('sidebar', 'sidebar', { scroll: true }),
      reg('header', 'header'),
      reg('content', 'content', fill('controls')),
      reg('detail', 'detail', fill('props', { scroll: true })),
    ],
    measurements: { sidebar: 232, header: 60, detail: 300 },
    spec: {
      summary: 'Painel One Screen de controle: sidebar de ambientes, grade de controles e painel de detalhes do dispositivo selecionado.',
      structure: [
        ONE_SCREEN_STRUCTURE,
        'grid-template-columns: 232px minmax(0, 1fr) 300px; grid-template-rows: 60px minmax(0, 1fr).',
        'Sidebar integral de ≈232 px com ambientes/grupos e contagem de dispositivos ativos.',
        'Grade de controles (cartões com ícone, nome, estado e interruptor) que se ajusta à altura; painel de detalhes de ≈300 px com controles finos (sliders, modos, agenda).',
      ],
      behavior: [
        ...ONE_SCREEN_BEHAVIOR,
        'Interruptores com role="switch" e estado anunciado; mudanças otimistas com reversão e aviso em caso de falha.',
      ],
      responsive: ['1280 × 800 ou maior: três colunas.', '1024–1279 px: detalhes abrem em sobreposição ao selecionar um dispositivo.', ...ONE_SCREEN_RESPONSIVE, MOBILE],
      notes: [ONE_SCREEN_NOTE],
    },
  }),
]
