import type { ItemSpec } from '@/core/types'
import type {
  HeaderAction,
  HeaderComposition,
  HeaderLayout,
  HeaderLook,
  HeaderModel,
  SidebarArrangement,
  SidebarComposition,
  SidebarLook,
  SidebarModel,
} from './types'

/*
 * Catálogo do Navigation Showcase: somente dados (sem JSX).
 * Cada modelo traz a receita visual (`look`) usada pelo renderizador e uma `spec`
 * técnica para o Master Prompt. Parte da spec é derivada da própria receita (alturas,
 * itens, ações), o que mantém o texto fiel ao que a prévia mostra.
 */

/* ========================================================================== */
/* Textos de apoio — header                                                    */
/* ========================================================================== */

const H_SURFACE: Record<HeaderLook['surface'], string> = {
  solid: 'fundo sólido na cor de navegação (token navBg), sem borda inferior',
  bordered: 'fundo navBg com borda inferior de 1 px (token border)',
  transparent:
    'transparente sobre a imagem do hero, com texto claro legível sobre ela; ao rolar além do hero assume fundo sólido navBg com sombra suave (transição de 200 ms)',
  glass: 'vidro fosco: fundo surface com ~62 % de opacidade, backdrop-filter: blur(14px) e borda clara de 1 px',
  brand: 'fundo na cor primária (primary) com texto onPrimary',
  inverse: 'faixa escura invertida (derivada da cor de texto principal) com texto claro',
  tinted: 'fundo levemente tingido (primarySoft) com borda inferior de 1 px',
  gradient: 'fundo em gradiente linear 135° de gradientFrom para gradientTo, com texto legível sobre o gradiente',
  blend: 'mesmo fundo da página (bg), sem borda nem sombra — o header se funde ao conteúdo',
}

const H_NAVSTYLE: Record<HeaderLook['navStyle'], string> = {
  plain: 'links de texto simples; o ativo usa a cor de texto principal e peso 600, os demais textMuted',
  underline: 'links com sublinhado de 2 px na cor primária sob o item ativo, encostado na base da barra',
  pill: 'links em pílula; o ativo recebe fundo primarySoft e texto primary, hover com fundo hover',
  segmented:
    'grupo segmentado: os itens ficam num contêiner com fundo surfaceAlt e padding de 3 px; o ativo é um “botão” com fundo de superfície e sombra sutil',
  caps: 'links em caixa alta de 12 px com espaçamento entre letras de 0,14em; o ativo ganha um fio de 1 px abaixo',
  dot: 'links com um ponto de 5 px na cor de destaque (accent) centralizado abaixo do item ativo',
  boxed: 'links em caixas com borda de 1 px; o ativo tem borda e texto na cor primária',
  numbered: 'links numerados (01, 02, 03…) com o número em fonte monoespaçada de 11 px antes do rótulo',
  bold: 'links grandes de 16 px com peso 650; o ativo tem um marcador sublinhado grosso de 3 px',
  tabs: 'abas: o item ativo tem o fundo da página e bordas laterais/superior, “encaixado” na área de conteúdo',
  blocks: 'blocos: cada item é um bloco com ícone em quadro colorido, rótulo e uma linha curta de descrição',
}

const H_LOGO: Record<HeaderLook['logo'], string> = {
  mark: 'símbolo quadrado de 28 px na cor primária + nome da marca em peso 700',
  word: 'logotipo só em texto (wordmark) na fonte de títulos, peso 750, 19–21 px',
  serif: 'logotipo serifado de 22–26 px com espaçamento levemente aberto (fonte de títulos se for serifada; senão uma serifada de display usada só no logo)',
  monogram: 'monograma circular de 32 px com a inicial da marca + nome',
  mono: 'logotipo em fonte monoespaçada com o prefixo “>_” na cor primária',
  badge: 'nome da marca seguido de um selo pequeno (ex.: “Docs”) em primarySoft com texto primary',
  outline: 'símbolo vazado (contorno de 2 px em losango) + nome da marca',
  big: 'logotipo grande (masthead) de 30–40 px, serifado como em capas de jornal (fonte de títulos se for serifada), centralizado',
}

const H_LAYOUT: Record<HeaderLayout, string> = {
  split: 'logo à esquerda, navegação centralizada na barra e ações à direita (grid 1fr auto 1fr)',
  left: 'logo e navegação juntos à esquerda; busca e ações empurradas para a direita',
  right: 'logo à esquerda; navegação, busca e ações agrupadas à direita',
  'center-logo': 'navegação dividida: metade dos links à esquerda, logo exatamente no centro, a outra metade + ações à direita',
  stacked: 'duas faixas: logo centralizado na primeira (com utilitários nas laterais) e navegação centralizada na segunda',
  'two-row': 'duas faixas: logo, busca e ações na primeira; navegação alinhada à esquerda na segunda',
  'search-center': 'busca larga no centro como protagonista; navegação recolhida em um botão de menu ao lado do logo',
  'menu-only': 'apenas logo e um botão “Menu” que abre um painel com toda a navegação',
  'menu-left': 'botão “Menu” à esquerda, logo centralizado e ações à direita',
  islands: 'três ilhas independentes (logo, navegação e ações) distribuídas na largura',
  'islands-right': 'logo solto à esquerda; navegação e ações em ilhas vizinhas à direita',
}

const H_DENSITY_GAP: Record<HeaderLook['density'], string> = { tight: '4–12 px', normal: '20–24 px', airy: '32–40 px' }

function actionText(a: HeaderAction, look: HeaderLook): string {
  const cta = look.cta ?? 'Começar'
  const map: Record<HeaderAction, string> = {
    cta: `botão primário “${cta}”`,
    'cta-outline': `botão contornado “${cta}”`,
    login: 'link “Entrar”',
    notif: 'sino de notificações com contador e popover',
    profile: 'avatar circular de 32 px com menu de perfil',
    'profile-chip': 'chip de perfil (avatar + nome + plano) com menu',
    cart: 'sacola/carrinho com contador',
    lang: 'seletor de idioma “PT ▾”',
    help: 'ícone de ajuda',
    apps: 'grade de aplicativos (alternar entre produtos)',
    theme: 'alternador de tema claro/escuro',
    favorite: 'ícone de favoritos',
    phone: 'telefone de contato visível',
    create: 'botão “+ Novo”',
    location: 'seletor de endereço de entrega',
    period: 'seletor de período “Últimos 30 dias ▾”',
    export: 'botão “Exportar”',
    version: 'seletor de versão “v3.2 ▾”',
    status: 'indicador de status do sistema (bolinha verde + “Operacional”)',
    countdown: 'contagem regressiva para o evento',
    avail: 'selo “Disponível para projetos” com bolinha pulsante',
    segments: 'alternador de público “Para você | Para empresas”',
    sales: 'link “Falar com vendas”',
  }
  return map[a]
}

function hasProfile(look: HeaderLook) {
  return look.actions.includes('profile') || look.actions.includes('profile-chip')
}

interface HeaderDef {
  id: string
  name: string
  description: string
  filters: string[]
  floating: boolean
  sticky: boolean
  look: HeaderLook
  compositions: [HeaderComposition, HeaderComposition]
  summary: string
  structure?: string[]
  behavior?: string[]
  responsive?: string[]
  notes?: string[]
  measurements?: Record<string, string>
  tags?: string[]
}

function headerSpec(d: HeaderDef): ItemSpec {
  const l = d.look
  const menus = l.nav.filter((n) => n.menu)
  const hasMega = l.nav.some((n) => n.menu === 'mega') || d.compositions.some((c) => c.patch?.nav?.some((n) => n.menu === 'mega'))
  const hasDropdown = l.nav.some((n) => n.menu === 'dropdown') || d.compositions.some((c) => c.patch?.nav?.some((n) => n.menu === 'dropdown'))
  const shapeTxt =
    l.shape === 'floating'
      ? `flutuante: afastada 12 px do topo e das laterais${l.maxWidth ? `, largura máxima de ${l.maxWidth} px centralizada` : ''}, cantos radiusLg e sombra do tema (ou sombra média, se o tema não tiver)`
      : l.shape === 'islands'
        ? 'dividida em ilhas flutuantes independentes (cada uma com fundo, borda/sombra e raio próprios), a 12 px do topo, com o conteúdo visível entre elas'
        : l.shape === 'contained'
          ? 'fundo em largura total e conteúdo limitado a 1200 px, centralizado'
          : 'largura total da janela (full width), padding horizontal de 24–32 px'

  const structure: string[] = [
    `Barra principal com ${l.height} px de altura, ${shapeTxt}.`,
    `Superfície: ${H_SURFACE[l.surface]}.`,
    `Logo: ${H_LOGO[l.logo]} (marca fictícia “${l.brand}” na prévia — substitua pela marca real).`,
  ]
  if (l.nav.length) {
    structure.push(
      `Navegação principal com ${l.nav.length} itens (${l.nav.map((n) => n.label + (n.menu === 'mega' ? ' ▾ mega menu' : n.menu ? ' ▾' : '')).join(', ')}): ${H_NAVSTYLE[l.navStyle]}; espaço entre itens de ${H_DENSITY_GAP[l.density]}.`,
    )
  }
  if (l.search === 'field') structure.push('Campo de busca compacto (≈ 220 px × 36 px) com ícone de lupa à esquerda e placeholder “Buscar…”.')
  if (l.search === 'icon') structure.push('Busca recolhida em um ícone de lupa (botão 40 × 40 px) que expande um campo de ≈ 240 px.')
  if (l.search === 'command') structure.push('Botão de busca em formato de campo com o atalho “⌘K” visível à direita, que abre uma paleta de comandos.')
  if (l.search === 'wide') structure.push('Busca larga (flex: 1, até 560 px, 42 px de altura) como elemento central do header, com botão de lupa integrado.')
  if (l.actions.length) structure.push(`Ações: ${l.actions.map((a) => actionText(a, l)).join('; ')}.`)
  if (l.announcement && l.announceStyle !== 'pill')
    structure.push(`Faixa de anúncio de 36 px acima do header, fundo primary e texto onPrimary: “${l.announcement}”, com link e botão ✕ para dispensar.`)
  if (l.announcement && l.announceStyle === 'pill') structure.push(`Anúncio como selo clicável dentro do header: “${l.announcement}”.`)
  if (l.utility?.length) structure.push(`Faixa utilitária de 32 px acima da barra principal com: ${l.utility.join(' · ')} (texto de 12,5 px em textMuted).`)
  if (l.breadcrumbs?.length)
    structure.push(
      `Breadcrumbs “${l.breadcrumbs.join(' / ')}” ${l.breadcrumbStyle === 'row' ? 'em uma faixa própria de 40 px abaixo da barra' : 'dentro da barra, logo após o logo'}; separador “/” em textMuted e o último nível em peso 600 (aria-current="page").`,
    )
  if (l.greeting) structure.push(`Saudação personalizada “${l.greeting}” com a data abaixo, no lugar da navegação.`)
  structure.push(
    `Disposição conforme a composição escolhida (ver “composicao”): A “${d.compositions[0].name}” = ${H_LAYOUT[d.compositions[0].layout]}; B “${d.compositions[1].name}” = ${H_LAYOUT[d.compositions[1].layout]}.`,
  )
  if (d.structure) structure.push(...d.structure)

  const behavior: string[] = []
  if (hasDropdown)
    behavior.push(
      'Menus suspensos abrem ao clicar ou com Enter/Espaço (não apenas no hover), alinhados ao item e a 6–8 px da barra; fecham com Esc, clique fora ou ao escolher uma opção. O gatilho usa aria-haspopup="menu" e aria-expanded; ↑/↓ percorrem as opções e o foco volta ao gatilho ao fechar.',
    )
  if (hasMega)
    behavior.push(
      'Mega menu: painel de até 760 px (nunca mais largo que a viewport − 16 px) ancorado abaixo do header, com 3 colunas de links agrupados sob títulos em caixa alta e um cartão de destaque com chamada; abre ao clicar, fecha com Esc ou clique fora; o foco vai para o primeiro link.',
    )
  behavior.push(`Item ativo: ${H_NAVSTYLE[l.navStyle]}. Hover com transição de 120 ms; foco visível com anel de 2 px na cor focusRing.`)
  if (d.sticky)
    behavior.push(
      `Fixo no topo: position: sticky; top: 0; z-index: 40. Após 8 px de rolagem ganha sombra suave${l.shrink ? ` e encolhe de ${l.height} para ${l.shrink} px (transição de 200 ms em height e padding)` : ''}.`,
    )
  else behavior.push('Não é fixo: rola junto com a página (position: relative).')
  if (d.floating) behavior.push('Flutuante: fica sobre o conteúdo; o conteúdo recebe padding-top igual à altura do header + 24 px para nada ficar escondido.')
  if (l.search === 'field') behavior.push('Campo de busca: ao focar cresce de 220 para 300 px e mostra o anel de foco; Enter envia; Esc limpa e tira o foco.')
  if (l.search === 'icon') behavior.push('Busca recolhida: o ícone abre o campo com foco automático; Esc ou clique fora recolhem de novo.')
  if (l.search === 'command')
    behavior.push('⌘K / Ctrl+K (ou clique) abre a paleta de comandos ancorada abaixo do header: campo com foco, resultados agrupados (Páginas, Ações) navegáveis por ↑/↓ e Enter; Esc fecha.')
  if (l.search === 'wide') behavior.push('Busca larga: ao focar mostra um painel de sugestões e buscas recentes com a mesma largura do campo, logo abaixo dele.')
  if (l.actions.includes('notif')) behavior.push('Notificações: o sino abre um popover de 320 px com as últimas notificações, marcador de não lidas e link “Ver todas”.')
  if (hasProfile(l)) behavior.push('Perfil: o avatar abre um menu com nome e e-mail, “Meu perfil”, “Configurações”, “Ajuda” e “Sair”, alinhado à borda direita.')
  if (l.actions.includes('cart')) behavior.push('Carrinho: contador em bolinha accent; o clique leva à sacola (ou abre um minicarrinho lateral).')
  if (d.behavior) behavior.push(...d.behavior)

  const keep = [
    'logo',
    ...(l.search && l.search !== 'wide' ? ['ícone de busca'] : []),
    ...(l.actions.includes('cart') ? ['carrinho com contador'] : []),
    ...(hasProfile(l) ? ['avatar'] : []),
    'botão de menu ☰ (44 × 44 px)',
  ]
  const toMenu = [
    ...(l.nav.length ? [`os ${l.nav.length} itens de navegação`] : []),
    ...(l.utility?.length ? ['os links utilitários'] : []),
    ...(l.actions.includes('login') ? ['“Entrar”'] : []),
    ...(l.actions.includes('lang') ? ['o seletor de idioma'] : []),
    ...(l.actions.includes('cta') || l.actions.includes('cta-outline') ? [`o CTA “${l.cta ?? 'Começar'}” em largura total no fim do painel`] : []),
  ]
  const responsive: string[] = [
    'Desktop largo (≥ 1280 px): composição completa, como na prévia.',
    `De 1024 a 1279 px: ${l.nav.length > 4 ? 'itens além do 4º vão para um menu “Mais ▾”' : 'o espaço entre itens cai para 16 px'}${l.search === 'field' ? ' e o campo de busca encolhe para 180 px' : ''}.`,
    `De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo${l.search ? ', a busca' : ''} e a ação principal.`,
    `Abaixo de 768 px: barra única de 56 px com ${keep.join(', ')}.${toMenu.length ? ` Vão para o painel do menu: ${toMenu.join(', ')}.` : ''}`,
    `Painel do menu: desliza logo abaixo do header em largura total, altura máxima calc(100dvh − 56 px) com rolagem interna${menus.length ? '; submenus e mega menus viram acordeões' : ''}; trava a rolagem do corpo e fecha com ✕, Esc, toque fora ou ao escolher um item.`,
    'Popovers (perfil, notificações, menus) são reposicionados para caber na viewport: largura máxima calc(100vw − 16 px), alinhados à borda mais próxima; nenhum overflow horizontal de 320 a 1920 px.',
  ]
  if (l.announcement && l.announceStyle !== 'pill')
    responsive.push('A faixa de anúncio continua no celular com 32 px e uma única linha (reticências), mantendo o botão ✕ com área de toque de 44 px.')
  if (l.search === 'wide') responsive.push('No celular a busca larga vira uma segunda linha de 48 px logo abaixo da barra, sempre visível (não vira ícone).')
  if (l.breadcrumbs?.length) responsive.push(`No celular os breadcrumbs viram um único link “‹ ${l.breadcrumbs[l.breadcrumbs.length - 2] ?? 'Voltar'}” para o nível anterior.`)
  if (d.floating) responsive.push('No celular a versão flutuante fica a 8 px das bordas, com 56 px de altura e os mesmos cantos arredondados.')
  if (l.utility?.length) responsive.push('A faixa utilitária some no celular; seus links entram no fim do painel do menu.')
  if (d.sticky) responsive.push('Continua fixo no celular; recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima para ganhar área útil.')
  if (d.responsive) responsive.push(...d.responsive)

  const measurements: Record<string, string> = {
    'altura (desktop)': `${l.height} px${l.shrink ? ` (${l.shrink} px após rolar)` : ''}`,
    'altura (celular)': '56 px',
    'padding horizontal': l.shape === 'floating' || l.shape === 'islands' ? '16–20 px dentro da barra; 12 px de afastamento das bordas' : '24–32 px (16 px no celular)',
    'espaço entre itens': H_DENSITY_GAP[l.density],
    logo: l.logo === 'big' ? '30–40 px de altura de texto' : '≈ 28 px de altura',
    'área de toque mínima': '44 × 44 px no celular',
  }
  if (l.utility?.length) measurements['faixa utilitária'] = '32 px'
  if (l.announcement && l.announceStyle !== 'pill') measurements['faixa de anúncio'] = '36 px (32 px no celular)'
  if (hasMega) measurements['mega menu'] = 'até 760 px de largura, 3 colunas + destaque'
  if (d.measurements) Object.assign(measurements, d.measurements)

  return {
    summary: d.summary,
    structure,
    behavior,
    responsive,
    measurements,
    notes: [
      'Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.',
      'Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".',
      ...(d.notes ?? []),
    ],
  }
}

function H(d: HeaderDef): HeaderModel {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    tags: d.tags,
    filters: d.filters,
    floating: d.floating,
    sticky: d.sticky,
    look: d.look,
    compositions: d.compositions,
    spec: headerSpec(d),
  }
}

/* ========================================================================== */
/* 36 headers                                                                  */
/* ========================================================================== */

export const headers: HeaderModel[] = [
  H({
    id: 'linha-essencial',
    name: 'Linha Essencial',
    description: 'O header mais simples possível: logo, quatro links e um botão. Nada disputa atenção com o conteúdo.',
    filters: ['minimalistas', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['minimal', 'fixo', 'CTA'],
    look: {
      brand: 'Ipê',
      logo: 'mark',
      height: 64,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Produto' }, { label: 'Recursos' }, { label: 'Preços' }, { label: 'Sobre' }],
      density: 'normal',
      actions: ['login', 'cta'],
      cta: 'Começar grátis',
      context: 'site',
    },
    compositions: [
      { name: 'Logo · menu central · ações', layout: 'split', description: 'Logo à esquerda, os quatro links centralizados na barra e “Entrar” + “Começar grátis” à direita. Equilíbrio simétrico clássico.' },
      {
        name: 'Tudo em uma linha à esquerda',
        layout: 'left',
        patch: { actions: ['cta-outline'] },
        description: 'Logo seguido dos links logo ao lado (gap de 28 px); à direita, apenas um botão contornado “Começar grátis”. Leitura contínua da esquerda para a direita.',
      },
    ],
    summary: 'Header minimalista de 64 px, fundo da superfície com borda inferior fina, logo com símbolo, quatro links de texto e um CTA.',
  }),
  H({
    id: 'vitrine-central',
    name: 'Vitrine Central',
    description: 'O logo fica no centro, como numa vitrine, e os links se dividem dos dois lados. Elegante para marcas e lojas.',
    filters: ['minimalistas', 'criativos'],
    floating: false,
    sticky: true,
    tags: ['centralizado', 'loja'],
    look: {
      brand: 'Cajá',
      logo: 'word',
      height: 72,
      surface: 'solid',
      shape: 'contained',
      navStyle: 'underline',
      nav: [{ label: 'Coleção' }, { label: 'Novidades' }, { label: 'Ateliê' }, { label: 'Diário' }],
      density: 'normal',
      search: 'icon',
      actions: ['favorite', 'cart'],
      context: 'store',
    },
    compositions: [
      { name: 'Logo no centro, menu dividido', layout: 'center-logo', description: 'Dois links à esquerda, logo exatamente no meio da barra e os outros dois links + busca, favoritos e sacola à direita. Simetria de vitrine.' },
      {
        name: 'Logo em cima, menu embaixo',
        layout: 'stacked',
        description: 'Primeira faixa (72 px) com busca à esquerda, logo central e favoritos/sacola à direita; segunda faixa (44 px) com os links centralizados e sublinhado no ativo.',
      },
    ],
    summary: 'Header centralizado de 72 px com wordmark no centro, navegação simétrica sublinhada, busca em ícone e sacola.',
    measurements: { 'segunda faixa (composição B)': '44 px' },
  }),
  H({
    id: 'ilha-flutuante',
    name: 'Ilha Flutuante',
    description: 'Uma barra arredondada que “flutua” afastada das bordas, por cima do conteúdo. Moderna e leve.',
    filters: ['flutuantes', 'saas'],
    floating: true,
    sticky: true,
    tags: ['flutuante', 'CTA', 'dropdown'],
    look: {
      brand: 'Buriti',
      logo: 'mark',
      height: 56,
      surface: 'solid',
      shape: 'floating',
      navStyle: 'pill',
      nav: [
        { label: 'Produto', menu: 'dropdown', items: ['Planejador', 'Automação', 'Integrações', 'Novidades'] },
        { label: 'Clientes' },
        { label: 'Preços' },
        { label: 'Docs' },
      ],
      density: 'tight',
      actions: ['login', 'cta'],
      cta: 'Testar agora',
      context: 'site',
    },
    compositions: [
      { name: 'Pílula em toda a largura', layout: 'split', description: 'Barra flutuante afastada 12 px do topo e das laterais: logo à esquerda, links em pílula no centro, “Entrar” e “Testar agora” à direita.' },
      {
        name: 'Pílula estreita central',
        layout: 'right',
        patch: { maxWidth: 760, actions: ['cta'] },
        description: 'Pílula de até 760 px centralizada na tela: logo à esquerda e, à direita, os links + um único botão “Testar agora”. Mais respiro nas laterais.',
      },
    ],
    summary: 'Header flutuante de 56 px em formato de pílula, afastado 12 px das bordas, com links em pílula, menu suspenso em “Produto” e CTA.',
  }),
  H({
    id: 'arquipelago',
    name: 'Arquipélago',
    description: 'Em vez de uma barra, pequenas “ilhas” separadas: uma para o logo, outra para o menu e outra para as ações.',
    filters: ['flutuantes', 'criativos'],
    floating: true,
    sticky: true,
    tags: ['ilhas de navegação', 'flutuante'],
    look: {
      brand: 'Sabiá',
      logo: 'monogram',
      height: 52,
      surface: 'solid',
      shape: 'islands',
      navStyle: 'segmented',
      nav: [{ label: 'Início' }, { label: 'Projetos' }, { label: 'Estúdio' }, { label: 'Contato' }],
      density: 'tight',
      actions: ['theme', 'cta'],
      cta: 'Vamos conversar',
      context: 'hero',
    },
    compositions: [
      { name: 'Três ilhas distribuídas', layout: 'islands', description: 'Ilha do logo à esquerda, ilha da navegação (grupo segmentado) no centro e ilha de ações à direita, cada uma com fundo e sombra próprios e o conteúdo visível entre elas.' },
      { name: 'Ilhas agrupadas à direita', layout: 'islands-right', description: 'Logo solto, sem ilha, à esquerda; à direita, a ilha da navegação e a ilha de ações lado a lado, com 8 px entre elas.' },
    ],
    summary: 'Header em ilhas flutuantes independentes (logo, navegação segmentada e ações), 52 px de altura, afastadas 12 px do topo.',
    behavior: ['Cada ilha tem foco e hover próprios; o grupo segmentado usa role="list" e o item ativo aria-current="page".'],
  }),
  H({
    id: 'painel-trabalho',
    name: 'Painel de Trabalho',
    description: 'Header de sistema (SaaS) com abas, busca, notificações e o avatar da pessoa logada.',
    filters: ['saas', 'com-busca', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['SaaS', 'busca', 'perfil', 'notificações'],
    look: {
      brand: 'Jacarandá',
      logo: 'mark',
      height: 60,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'underline',
      nav: [{ label: 'Visão geral' }, { label: 'Projetos' }, { label: 'Tarefas' }, { label: 'Relatórios' }],
      density: 'normal',
      search: 'field',
      actions: ['help', 'notif', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Abas à esquerda, busca à direita', layout: 'left', description: 'Logo + abas sublinhadas à esquerda; à direita, campo de busca compacto (≈ 220 px), ajuda, sino com contador e avatar.' },
      {
        name: 'Busca no centro',
        layout: 'search-center',
        patch: { search: 'wide' },
        description: 'Logo e botão “Navegar ▾” (com as abas) à esquerda, busca larga centralizada (até 560 px) como protagonista, e ajuda, notificações e avatar à direita.',
      },
    ],
    summary: 'Header de aplicação de 60 px com abas sublinhadas, campo de busca, notificações com popover e menu de perfil.',
  }),
  H({
    id: 'console-dev',
    name: 'Console do Desenvolvedor',
    description: 'Visual técnico com logo em fonte de código e uma busca de comandos (⌘K). Para produtos de tecnologia.',
    filters: ['tecnologicos', 'com-busca'],
    floating: false,
    sticky: true,
    tags: ['tecnológico', 'paleta de comandos'],
    look: {
      brand: 'carnauba',
      logo: 'mono',
      height: 56,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'plain',
      nav: [
        { label: 'Plataforma', menu: 'dropdown', items: ['Funções', 'Banco de dados', 'Armazenamento', 'Filas'] },
        { label: 'Desenvolvedores' },
        { label: 'Preços' },
        { label: 'Empresas' },
      ],
      density: 'normal',
      search: 'command',
      actions: ['status', 'login', 'cta'],
      cta: 'Começar a construir',
      context: 'docs',
    },
    compositions: [
      { name: 'Comandos à direita', layout: 'left', description: 'Logo monoespaçado + links à esquerda; à direita, botão “Buscar ⌘K”, indicador de status, “Entrar” e o CTA.' },
      {
        name: 'Comando no centro',
        layout: 'search-center',
        patch: { actions: ['login', 'cta'] },
        description: 'Logo à esquerda e links agrupados em “Navegar ▾”; barra de comando ⌘K larga no centro, com o atalho visível; “Entrar” e CTA à direita.',
      },
    ],
    summary: 'Header técnico de 56 px com logotipo monoespaçado, paleta de comandos ⌘K, indicador de status e CTA.',
    notes: ['O atalho exibido deve se adaptar ao sistema: ⌘K no macOS, Ctrl K nos demais.'],
  }),
  H({
    id: 'institucional-duas-linhas',
    name: 'Institucional em Duas Linhas',
    description: 'Para empresas tradicionais: uma faixa fina com contatos e, abaixo, o menu principal com submenus.',
    filters: ['corporativos', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['corporativo', 'duas linhas', 'dropdown'],
    look: {
      brand: 'Araucária Seguros',
      logo: 'mark',
      height: 72,
      surface: 'solid',
      shape: 'contained',
      navStyle: 'plain',
      nav: [
        { label: 'Para você', menu: 'dropdown', items: ['Seguro auto', 'Residencial', 'Vida', 'Viagem'] },
        { label: 'Para empresas', menu: 'dropdown', items: ['Frota', 'Patrimonial', 'Saúde coletiva', 'Responsabilidade civil'] },
        { label: 'Sinistros' },
        { label: 'Sobre nós' },
      ],
      density: 'normal',
      utility: ['Ouvidoria', 'Trabalhe conosco', '0800 123 4567'],
      actions: ['lang', 'login', 'cta'],
      cta: 'Fazer cotação',
      context: 'site',
    },
    compositions: [
      { name: 'Utilitários em cima', layout: 'split', description: 'Faixa fina de 32 px no topo com ouvidoria, carreiras e telefone; abaixo, barra de 72 px com logo, menus suspensos centralizados e idioma, “Entrar” e “Fazer cotação”.' },
      {
        name: 'Menus na segunda linha',
        layout: 'two-row',
        patch: { utility: [], search: 'field' },
        description: 'Primeira linha com logo, campo de busca e ações (idioma, Entrar, cotação); segunda linha com os menus suspensos alinhados à esquerda. A faixa utilitária sai e seus links vão para o rodapé.',
      },
    ],
    summary: 'Header corporativo em duas faixas: utilitária de 32 px e principal de 72 px com menus suspensos e CTA.',
  }),
  H({
    id: 'mega-emporio',
    name: 'Mega Empório',
    description: 'Header de loja grande: busca em destaque, carrinho e um mega menu com todos os departamentos.',
    filters: ['mega-menu', 'com-busca'],
    floating: false,
    sticky: true,
    tags: ['loja', 'mega menu', 'anúncio', 'busca'],
    look: {
      brand: 'Empório Murici',
      logo: 'mark',
      height: 64,
      surface: 'solid',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Departamentos', menu: 'mega' }, { label: 'Ofertas', badge: '-40%' }, { label: 'Mercado' }, { label: 'Casa' }, { label: 'Eletrônicos' }],
      density: 'normal',
      search: 'wide',
      actions: ['location', 'profile', 'cart'],
      announcement: 'Frete grátis acima de R$ 199 · Parcele em até 10x',
      context: 'store',
    },
    compositions: [
      { name: 'Busca larga + faixa de departamentos', layout: 'two-row', description: 'Linha 1: logo, busca larga ao centro, endereço de entrega, conta e carrinho. Linha 2: “Departamentos” (abre o mega menu) seguido de atalhos de categorias.' },
      {
        name: 'Departamentos ao lado do logo',
        layout: 'search-center',
        description: 'Linha única: logo, botão “☰ Departamentos” que abre o mega menu, busca larga e carrinho. Os atalhos de categoria saem para dar espaço à busca.',
      },
    ],
    summary: 'Header de e-commerce com faixa de anúncio, busca larga central, mega menu de departamentos, endereço de entrega, conta e carrinho.',
  }),
  H({
    id: 'faixa-lancamento',
    name: 'Faixa de Lançamento',
    description: 'Um aviso no topo (“Novidade!”) chama a atenção para um lançamento, acima do menu principal.',
    filters: ['saas', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['anúncio superior', 'CTA'],
    look: {
      brand: 'Pitanga',
      logo: 'mark',
      height: 64,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Produto' }, { label: 'Integrações' }, { label: 'Preços' }, { label: 'Blog' }],
      density: 'normal',
      actions: ['login', 'cta'],
      cta: 'Criar conta',
      announcement: 'Novidade: relatórios automáticos com IA — conheça',
      context: 'site',
    },
    compositions: [
      { name: 'Anúncio em faixa', layout: 'split', description: 'Faixa de anúncio de 36 px na cor primária acima do header, com link e botão ✕; abaixo, logo, links centrais e ações.' },
      {
        name: 'Anúncio como selo',
        layout: 'right',
        patch: { announceStyle: 'pill', announcement: 'Novo · Relatórios com IA' },
        description: 'Sem faixa extra: o anúncio vira um selo clicável “Novo · Relatórios com IA →” ao lado do logo; links e ações agrupados à direita. Economiza 36 px de altura.',
      },
    ],
    summary: 'Header de 64 px com faixa de anúncio superior dispensável (ou selo de novidade), links e CTA.',
    behavior: ['O ✕ da faixa guarda a dispensa (localStorage) para não reaparecer na mesma campanha.'],
  }),
  H({
    id: 'gazeta-aurora',
    name: 'Gazeta Aurora',
    description: 'Cabeçalho de jornal ou revista: nome grande e serifado no centro e as editorias logo abaixo.',
    filters: ['editoriais'],
    floating: false,
    sticky: false,
    tags: ['editorial', 'duas linhas', 'centralizado'],
    look: {
      brand: 'Gazeta Aurora',
      logo: 'big',
      height: 88,
      surface: 'blend',
      shape: 'contained',
      navStyle: 'caps',
      nav: [{ label: 'Política' }, { label: 'Economia' }, { label: 'Cultura' }, { label: 'Ciência' }, { label: 'Esportes' }, { label: 'Opinião' }],
      density: 'normal',
      search: 'icon',
      actions: ['cta'],
      cta: 'Assine',
      utility: ['Terça-feira, 3 de novembro'],
      context: 'editorial',
    },
    compositions: [
      { name: 'Masthead clássico', layout: 'stacked', description: 'Faixa superior com data e busca à esquerda, nome do jornal grande e serifado no centro e “Assine” à direita; abaixo, as editorias em caixa alta entre fios horizontais.' },
      {
        name: 'Linha editorial compacta',
        layout: 'left',
        patch: { logo: 'serif', height: 60, utility: [] },
        description: 'Uma linha de 60 px: logotipo serifado menor à esquerda, editorias em caixa alta ao lado, busca e “Assine” à direita. Ideal dentro das matérias (pode ser fixa).',
      },
    ],
    summary: 'Masthead editorial com nome serifado grande centralizado, data, busca, botão de assinatura e editorias em caixa alta.',
    measurements: { 'faixa de editorias': '44 px entre fios de 1 px' },
  }),
  H({
    id: 'trilha-contexto',
    name: 'Trilha de Contexto',
    description: 'Mostra “onde você está” (Projetos / Site / Página) direto no header. Ótimo para sistemas com muitos níveis.',
    filters: ['saas', 'minimalistas'],
    floating: false,
    sticky: true,
    tags: ['breadcrumbs', 'SaaS'],
    look: {
      brand: 'Tucano',
      logo: 'mark',
      height: 56,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Projetos' }, { label: 'Equipe' }, { label: 'Ajustes' }],
      density: 'normal',
      actions: ['notif', 'profile'],
      breadcrumbs: ['Projetos', 'Site institucional', 'Página inicial'],
      breadcrumbStyle: 'inline',
      context: 'app',
    },
    compositions: [
      {
        name: 'Trilha na barra principal',
        layout: 'left',
        patch: { nav: [] },
        description: 'Logo seguido da trilha “Projetos / Site institucional / Página inicial”; cada nível é clicável e o último fica em negrito. Notificações e avatar à direita.',
      },
      {
        name: 'Menu + trilha embaixo',
        layout: 'left',
        patch: { breadcrumbStyle: 'row' },
        description: 'Linha superior com logo, links (Projetos, Equipe, Ajustes), notificações e perfil; linha inferior de 40 px com a trilha e uma ação contextual “Compartilhar”.',
      },
    ],
    summary: 'Header de aplicação de 56 px com breadcrumbs (na barra ou numa faixa própria), notificações e perfil.',
  }),
  H({
    id: 'horizonte-transparente',
    name: 'Horizonte Transparente',
    description: 'Fica transparente por cima da imagem de destaque e ganha fundo quando a pessoa rola a página.',
    filters: ['criativos'],
    floating: false,
    sticky: true,
    tags: ['transparente sobre hero'],
    look: {
      brand: 'Mandacaru',
      logo: 'word',
      height: 76,
      surface: 'transparent',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Destinos' }, { label: 'Experiências' }, { label: 'Hospedagem' }, { label: 'Sobre' }],
      density: 'airy',
      actions: ['lang', 'cta-outline'],
      cta: 'Reservar',
      context: 'hero',
    },
    compositions: [
      { name: 'Sobre o hero, menu central', layout: 'split', description: 'Header transparente sobre a imagem do hero: logo à esquerda, links claros ao centro, idioma e botão contornado “Reservar” à direita.' },
      {
        name: 'Só logo e menu',
        layout: 'menu-only',
        description: 'Apenas o logo e o botão “Menu” sobre o hero; ao abrir, um painel cobre a área com links grandes. Deixa a imagem respirar.',
      },
    ],
    summary: 'Header transparente de 76 px sobreposto ao hero, com texto claro, que se torna sólido após a rolagem.',
    notes: ['Garanta contraste do texto sobre o hero com um véu escuro (gradiente de 40–60 % de opacidade) no topo da imagem.'],
  }),
  H({
    id: 'maison-lumiere',
    name: 'Maison Lumière',
    description: 'Premium e luxuoso: letras espaçadas, muito respiro e o nome da marca no centro.',
    filters: ['editoriais', 'criativos', 'minimalistas'],
    floating: false,
    sticky: false,
    tags: ['premium', 'luxo', 'centralizado'],
    look: {
      brand: 'Maison Lumière',
      logo: 'serif',
      height: 84,
      surface: 'blend',
      shape: 'contained',
      navStyle: 'caps',
      nav: [{ label: 'Coleções' }, { label: 'Joalheria' }, { label: 'A Maison' }, { label: 'Boutiques' }],
      density: 'airy',
      search: 'icon',
      actions: ['favorite', 'cart'],
      context: 'luxury',
    },
    compositions: [
      { name: 'Nome central, menu dividido', layout: 'center-logo', description: 'Duas categorias à esquerda, o nome da maison em serifa no centro, as outras duas + busca, favoritos e sacola à direita; tudo em caixa alta espaçada.' },
      {
        name: 'Nome acima, menu fino',
        layout: 'stacked',
        patch: { logo: 'big' },
        description: 'Primeira faixa com o nome grande centralizado e ícones discretos nas laterais; segunda faixa com as categorias em caixa alta de 11–12 px, separadas por 40 px.',
      },
    ],
    summary: 'Header de luxo com tipografia serifada central, navegação em caixa alta espaçada e grande respiro (84 px).',
    notes: ['Evite sombras e cores fortes: o luxo vem do espaço, da tipografia e de detalhes finos (fios de 1 px).'],
  }),
  H({
    id: 'barra-compacta',
    name: 'Barra Compacta',
    description: 'Header baixinho (44 px) para ferramentas onde cada pixel de tela conta.',
    filters: ['compactos', 'tecnologicos', 'saas'],
    floating: false,
    sticky: true,
    tags: ['compacto', 'ferramenta'],
    look: {
      brand: 'Babaçu',
      logo: 'mark',
      height: 44,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'pill',
      nav: [{ label: 'Painel' }, { label: 'Fluxos' }, { label: 'Dados' }, { label: 'Logs' }],
      density: 'tight',
      search: 'icon',
      actions: ['help', 'notif', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Tudo em 44 px', layout: 'left', description: 'Logo pequeno + links em pílulas de 28 px à esquerda; busca, ajuda, notificações e avatar (28 px) à direita.' },
      {
        name: 'Seletor de projeto',
        layout: 'left',
        patch: {
          navStyle: 'boxed',
          nav: [
            { label: 'Projeto Atlas', menu: 'dropdown', items: ['Projeto Atlas', 'Loja Pitanga', 'App Ipê', '+ Novo projeto'] },
            { label: 'Painel', icon: 'gauge' },
            { label: 'Fluxos', icon: 'workflow' },
            { label: 'Dados', icon: 'database' },
          ],
        },
        description: 'Logo + seletor “Projeto Atlas ▾” (menu suspenso com os projetos) e links com ícone em caixas finas; ícones de ação à direita.',
      },
    ],
    summary: 'Header compacto de 44 px com navegação em pílulas pequenas, busca em ícone e ações densas.',
    measurements: { 'altura dos itens': '28 px', avatar: '28 px' },
  }),
  H({
    id: 'portal-amplo',
    name: 'Portal Amplo',
    description: 'Ocupa toda a largura da tela, com busca e mega menus para sites com muito conteúdo.',
    filters: ['corporativos', 'mega-menu', 'com-busca'],
    floating: false,
    sticky: true,
    tags: ['full width', 'mega menu', 'busca'],
    look: {
      brand: 'Grupo Jatobá',
      logo: 'mark',
      height: 68,
      surface: 'solid',
      shape: 'full',
      navStyle: 'underline',
      nav: [
        { label: 'Soluções', menu: 'mega' },
        { label: 'Setores', menu: 'mega' },
        { label: 'Recursos', menu: 'dropdown', items: ['Blog', 'Webinars', 'Estudos de caso', 'Central de ajuda'] },
        { label: 'Sobre' },
      ],
      density: 'normal',
      search: 'field',
      actions: ['login', 'cta'],
      cta: 'Fale conosco',
      context: 'site',
    },
    compositions: [
      { name: 'Largura total, uma linha', layout: 'left', description: 'Logo e menus (com mega menus) à esquerda, de borda a borda; campo de busca, “Entrar” e “Fale conosco” à direita.' },
      {
        name: 'Busca em cima, menus embaixo',
        layout: 'two-row',
        patch: { search: 'wide' },
        description: 'Linha 1 com logo, busca larga e ações; linha 2 com os menus e mega menus alinhados à esquerda, em toda a largura.',
      },
    ],
    summary: 'Header full width de 68 px com mega menus em “Soluções” e “Setores”, menu suspenso, busca e CTA.',
  }),
  H({
    id: 'conversao-direta',
    name: 'Conversão Direta',
    description: 'Tudo leva ao botão principal. Para páginas de venda onde o objetivo é a pessoa começar um teste.',
    filters: ['saas', 'minimalistas'],
    floating: false,
    sticky: true,
    tags: ['CTA', 'landing'],
    look: {
      brand: 'Graviola',
      logo: 'outline',
      height: 68,
      surface: 'blend',
      shape: 'contained',
      navStyle: 'dot',
      nav: [{ label: 'Como funciona' }, { label: 'Planos' }, { label: 'Depoimentos' }, { label: 'Dúvidas' }],
      density: 'normal',
      actions: ['sales', 'cta'],
      cta: 'Teste grátis por 14 dias',
      context: 'site',
    },
    compositions: [
      { name: 'CTA na ponta direita', layout: 'split', description: 'Logo à esquerda, links centrais com ponto no ativo, “Falar com vendas” (link discreto) e o CTA à direita.' },
      {
        name: 'Tudo à direita, CTA maior',
        layout: 'right',
        patch: { navStyle: 'plain' },
        description: 'Logo isolado à esquerda; links, “Falar com vendas” e o CTA agrupados à direita, com o CTA em 44 px de altura para dominar a barra.',
      },
    ],
    summary: 'Header de landing focado em conversão: links de seção com indicador em ponto, link de vendas e CTA dominante.',
    behavior: ['Links de seção rolam suavemente até a âncora (scroll-margin-top = altura do header) e o ativo acompanha a seção visível.'],
  }),
  H({
    id: 'conta-pessoal',
    name: 'Conta Pessoal',
    description: 'Destaca a pessoa logada: foto, nome e plano ficam à vista. Para apps de uso pessoal.',
    filters: ['saas', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['perfil de usuário', 'app'],
    look: {
      brand: 'Cupuaçu',
      logo: 'monogram',
      height: 64,
      surface: 'solid',
      shape: 'full',
      navStyle: 'pill',
      nav: [{ label: 'Início' }, { label: 'Carteira' }, { label: 'Metas' }, { label: 'Relatórios' }],
      density: 'normal',
      actions: ['notif', 'profile-chip'],
      context: 'app',
    },
    compositions: [
      { name: 'Menu + chip de perfil', layout: 'left', description: 'Logo + links em pílula à esquerda; à direita, sino e chip de perfil (avatar, “Marina Alves” e plano “Pro”) que abre o menu da conta.' },
      {
        name: 'Saudação personalizada',
        layout: 'left',
        patch: { nav: [], greeting: 'Olá, Marina', actions: ['create', 'notif', 'profile'] },
        description: 'Logo seguido da saudação “Olá, Marina” e da data; à direita, “+ Novo”, notificações e avatar. A navegação fica na sidebar do app.',
      },
    ],
    summary: 'Header de app pessoal com chip de perfil (avatar, nome e plano), notificações e navegação em pílulas.',
  }),
  H({
    id: 'vidro-fosco',
    name: 'Vidro Fosco',
    description: 'Barra translúcida, como vidro, que deixa o fundo colorido aparecer por trás. Visual tecnológico e leve.',
    filters: ['flutuantes', 'criativos', 'tecnologicos'],
    floating: true,
    sticky: true,
    tags: ['flutuante', 'vidro', 'glassmorphism'],
    look: {
      brand: 'Ondina',
      logo: 'mark',
      height: 56,
      surface: 'glass',
      shape: 'floating',
      navStyle: 'pill',
      nav: [{ label: 'Produto' }, { label: 'Recursos', menu: 'dropdown', items: ['Sincronização', 'Colaboração', 'Segurança', 'API'] }, { label: 'Preços' }, { label: 'Comunidade' }],
      density: 'tight',
      actions: ['login', 'cta'],
      cta: 'Baixar app',
      context: 'hero',
    },
    compositions: [
      { name: 'Vidro em toda a largura', layout: 'split', description: 'Barra de vidro flutuante a 12 px das bordas, em toda a largura: logo, links em pílula no centro, “Entrar” e “Baixar app”.' },
      {
        name: 'Cápsula de vidro central',
        layout: 'split',
        patch: { maxWidth: 680, actions: ['cta'] },
        description: 'Cápsula de vidro estreita (até 680 px) centralizada: logo, links e um único CTA compactos.',
      },
    ],
    summary: 'Header flutuante de vidro fosco (translúcido com desfoque) de 56 px sobre fundo colorido, com links em pílula e CTA.',
    notes: ['Ofereça fallback sem backdrop-filter: fundo surface com 92 % de opacidade.'],
  }),
  H({
    id: 'faixa-da-marca',
    name: 'Faixa da Marca',
    description: 'O header inteiro na cor principal da marca. Forte e institucional.',
    filters: ['corporativos', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['corporativo', 'cor da marca'],
    look: {
      brand: 'Aroeira Engenharia',
      logo: 'mark',
      height: 64,
      surface: 'brand',
      shape: 'full',
      navStyle: 'underline',
      nav: [{ label: 'Empresa' }, { label: 'Serviços', menu: 'dropdown', items: ['Projetos', 'Construção', 'Manutenção', 'Consultoria'] }, { label: 'Obras' }, { label: 'Contato' }],
      density: 'normal',
      actions: ['phone', 'cta'],
      cta: 'Solicitar orçamento',
      context: 'site',
    },
    compositions: [
      { name: 'Barra única na cor da marca', layout: 'split', description: 'Fundo primário em toda a barra: logo à esquerda, links claros sublinhados no centro, telefone e botão invertido (fundo claro) à direita.' },
      {
        name: 'Marca em cima, menu claro embaixo',
        layout: 'two-row',
        description: 'Primeira faixa na cor da marca com logo, telefone e CTA; segunda faixa clara (surface) com os links sublinhados em primary.',
      },
    ],
    summary: 'Header institucional de 64 px com fundo na cor primária, links sublinhados, telefone e CTA invertido.',
  }),
  H({
    id: 'documentacao-viva',
    name: 'Documentação Viva',
    description: 'Header de documentação técnica: abas de seções, versão, busca rápida e tema claro/escuro.',
    filters: ['tecnologicos', 'com-busca'],
    floating: false,
    sticky: true,
    tags: ['docs', 'busca', 'versão'],
    look: {
      brand: 'Jabuti',
      logo: 'badge',
      logoBadge: 'Docs',
      height: 60,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'underline',
      nav: [{ label: 'Guias' }, { label: 'Referência' }, { label: 'Exemplos' }, { label: 'Changelog' }],
      density: 'normal',
      search: 'command',
      actions: ['version', 'theme'],
      context: 'docs',
    },
    compositions: [
      { name: 'Abas à esquerda', layout: 'left', description: 'Logo com selo “Docs” + abas sublinhadas à esquerda; busca ⌘K, seletor de versão e tema à direita.' },
      {
        name: 'Busca no centro',
        layout: 'search-center',
        description: 'Logo e “Navegar ▾” à esquerda, barra de busca ⌘K larga no centro; versão e tema à direita. As abas também aparecem na sidebar da documentação.',
      },
    ],
    summary: 'Header de documentação com selo “Docs”, abas sublinhadas, busca ⌘K, seletor de versão e alternador de tema.',
  }),
  H({
    id: 'noturno-neon',
    name: 'Noturno Neon',
    description: 'Header escuro com detalhes luminosos. Transmite tecnologia e inovação.',
    filters: ['tecnologicos', 'criativos'],
    floating: false,
    sticky: true,
    tags: ['tecnológico', 'escuro'],
    look: {
      brand: 'Vagalume',
      logo: 'outline',
      height: 64,
      surface: 'inverse',
      shape: 'full',
      navStyle: 'dot',
      nav: [{ label: 'Plataforma', menu: 'dropdown', items: ['Modelos', 'Agentes', 'Observabilidade', 'Segurança'] }, { label: 'Casos' }, { label: 'Preços' }, { label: 'Docs' }],
      density: 'normal',
      actions: ['login', 'cta'],
      cta: 'Solicitar acesso',
      context: 'site',
    },
    compositions: [
      { name: 'Escuro simétrico', layout: 'split', description: 'Faixa escura: logo vazado à esquerda, links com ponto luminoso no ativo ao centro, “Entrar” e CTA à direita.' },
      {
        name: 'Numerado à esquerda',
        layout: 'left',
        patch: { navStyle: 'numbered', actions: ['cta-outline'] },
        description: 'Logo + links numerados (01, 02, 03…) à esquerda; apenas um botão contornado “Solicitar acesso” à direita.',
      },
    ],
    summary: 'Header escuro invertido de 64 px com indicador luminoso no item ativo, menu suspenso e CTA.',
  }),
  H({
    id: 'abas-segmentadas',
    name: 'Abas Segmentadas',
    description: 'O menu parece um controle de abas agrupadas, bem claro sobre qual área está aberta.',
    filters: ['saas', 'minimalistas'],
    floating: false,
    sticky: true,
    tags: ['segmentado', 'SaaS'],
    look: {
      brand: 'Sapucaia',
      logo: 'mark',
      height: 60,
      surface: 'blend',
      shape: 'full',
      navStyle: 'segmented',
      nav: [{ label: 'Painel' }, { label: 'Clientes' }, { label: 'Vendas' }, { label: 'Estoque' }],
      density: 'tight',
      search: 'icon',
      actions: ['notif', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Abas no centro', layout: 'split', description: 'Logo à esquerda, grupo segmentado exatamente no centro, busca, notificações e avatar à direita.' },
      {
        name: 'Abas junto ao logo',
        layout: 'left',
        patch: { search: 'field' },
        description: 'Logo seguido do grupo segmentado à esquerda; campo de busca, notificações e avatar à direita.',
      },
    ],
    summary: 'Header de app com navegação em controle segmentado (itens agrupados num contêiner), busca e perfil.',
  }),
  H({
    id: 'mega-academico',
    name: 'Mega Menu Acadêmico',
    description: 'Para instituições com muitos cursos: menus grandes mostram tudo organizado em colunas.',
    filters: ['mega-menu', 'corporativos'],
    floating: false,
    sticky: true,
    tags: ['mega menu', 'educação'],
    look: {
      brand: 'Instituto Cambuí',
      logo: 'mark',
      height: 68,
      surface: 'solid',
      shape: 'contained',
      navStyle: 'plain',
      nav: [{ label: 'Cursos', menu: 'mega' }, { label: 'Graduação', menu: 'mega' }, { label: 'Pesquisa', menu: 'dropdown', items: ['Laboratórios', 'Publicações', 'Bolsas'] }, { label: 'Biblioteca' }],
      density: 'normal',
      actions: ['login', 'cta'],
      cta: 'Inscreva-se',
      context: 'site',
    },
    compositions: [
      { name: 'Menus à esquerda', layout: 'left', description: 'Logo + menus (dois mega menus e um suspenso) à esquerda; “Portal do aluno” e “Inscreva-se” à direita.' },
      { name: 'Logo central', layout: 'center-logo', description: 'Cursos e Graduação à esquerda, logo no centro, Pesquisa, Biblioteca e ações à direita; os mega menus abrem centralizados na tela.' },
    ],
    summary: 'Header institucional com dois mega menus em colunas (áreas, formatos, serviços) e cartão de destaque, mais menu suspenso e CTA.',
  }),
  H({
    id: 'so-o-essencial',
    name: 'Só o Essencial',
    description: 'Apenas o logo e um botão “Menu”. Tudo o mais aparece só quando a pessoa pede.',
    filters: ['minimalistas', 'compactos', 'criativos'],
    floating: false,
    sticky: false,
    tags: ['minimal', 'menu escondido'],
    look: {
      brand: 'Talha',
      logo: 'word',
      height: 64,
      surface: 'blend',
      shape: 'full',
      navStyle: 'bold',
      nav: [{ label: 'Trabalhos' }, { label: 'Sobre' }, { label: 'Diário' }, { label: 'Contato' }],
      density: 'airy',
      actions: [],
      context: 'editorial',
    },
    compositions: [
      { name: 'Logo e Menu', layout: 'menu-only', description: 'Logo à esquerda e o botão “Menu ☰” à direita; o menu abre um painel com os links em tipografia grande.' },
      {
        name: 'Menu à esquerda, logo central',
        layout: 'menu-left',
        patch: { actions: ['cta-outline'], cta: 'Contato' },
        description: 'Botão “☰ Menu” à esquerda, logo no centro e um botão contornado “Contato” à direita.',
      },
    ],
    summary: 'Header mínimo de 64 px com logo e botão “Menu” que abre um painel com navegação em tipografia grande.',
  }),
  H({
    id: 'estudio-vertice',
    name: 'Estúdio Vértice',
    description: 'Ousado, para agências e portfólios: logo grande, links numerados e um selo de disponibilidade.',
    filters: ['criativos', 'editoriais'],
    floating: false,
    sticky: false,
    tags: ['criativo', 'agência', 'portfólio'],
    look: {
      brand: 'Vértice',
      logo: 'big',
      height: 80,
      surface: 'blend',
      shape: 'full',
      navStyle: 'numbered',
      nav: [{ label: 'Trabalhos' }, { label: 'Estúdio' }, { label: 'Serviços' }, { label: 'Contato' }],
      density: 'normal',
      actions: ['avail'],
      context: 'editorial',
    },
    compositions: [
      { name: 'Wordmark gigante', layout: 'right', description: 'Nome do estúdio enorme à esquerda; à direita, links numerados e o selo “Disponível para projetos”.' },
      {
        name: 'Links, logo e selo',
        layout: 'center-logo',
        patch: { logo: 'word' },
        description: 'Links numerados divididos dos dois lados do logo central; o selo de disponibilidade fecha a ponta direita.',
      },
    ],
    summary: 'Header criativo de 80 px com wordmark de grande escala, navegação numerada e selo de disponibilidade animado.',
  }),
  H({
    id: 'busca-primeiro',
    name: 'Busca em Primeiro Lugar',
    description: 'Para centrais de ajuda e bases de conhecimento: a busca é a maior coisa do header.',
    filters: ['com-busca', 'saas'],
    floating: false,
    sticky: true,
    tags: ['busca', 'central de ajuda'],
    look: {
      brand: 'Guará',
      logo: 'badge',
      logoBadge: 'Ajuda',
      height: 64,
      surface: 'tinted',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Primeiros passos' }, { label: 'Faturamento' }, { label: 'Integrações' }, { label: 'Comunidade' }],
      density: 'normal',
      search: 'wide',
      actions: ['login', 'cta'],
      cta: 'Abrir chamado',
      context: 'docs',
    },
    compositions: [
      { name: 'Busca central', layout: 'search-center', description: 'Logo com selo “Ajuda” e “Navegar ▾” à esquerda, busca larga no centro com sugestões, “Entrar” e “Abrir chamado” à direita.' },
      { name: 'Busca + categorias', layout: 'two-row', description: 'Linha 1 com logo, busca larga e ações; linha 2 com as categorias de ajuda como links.' },
    ],
    summary: 'Header de central de ajuda com fundo tingido e busca larga com sugestões como elemento principal.',
  }),
  H({
    id: 'ancora-fixa',
    name: 'Âncora Fixa',
    description: 'Começa alto e encolhe quando a pessoa rola a página, sempre visível no topo.',
    filters: ['fixos', 'corporativos'],
    floating: false,
    sticky: true,
    tags: ['fixo', 'encolhe ao rolar'],
    look: {
      brand: 'Copaíba Serviços',
      logo: 'monogram',
      height: 80,
      shrink: 60,
      surface: 'solid',
      shape: 'contained',
      navStyle: 'underline',
      nav: [{ label: 'Serviços', menu: 'dropdown', items: ['Manutenção', 'Instalação', 'Vistoria', 'Plano anual'] }, { label: 'Unidades' }, { label: 'Planos' }, { label: 'Sobre' }],
      density: 'normal',
      actions: ['phone', 'cta'],
      cta: 'Agendar visita',
      context: 'site',
    },
    compositions: [
      { name: 'Alto que encolhe', layout: 'split', description: 'No topo da página tem 80 px; após rolar, encolhe para 60 px e ganha sombra. Logo à esquerda, links no centro, telefone e CTA à direita.' },
      { name: 'Contato sempre à mão', layout: 'right', description: 'Logo à esquerda; links, telefone e “Agendar visita” agrupados à direita, com o mesmo encolhimento ao rolar.' },
    ],
    summary: 'Header fixo que encolhe de 80 para 60 px ao rolar, com menu suspenso, telefone e CTA.',
  }),
  H({
    id: 'painel-analitico',
    name: 'Painel Analítico',
    description: 'Para dashboards: abas de relatórios, escolha de período e botão de exportar.',
    filters: ['saas', 'tecnologicos'],
    floating: false,
    sticky: true,
    tags: ['dashboard', 'período'],
    look: {
      brand: 'Seriema',
      logo: 'mark',
      height: 56,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'tabs',
      nav: [{ label: 'Visão geral' }, { label: 'Aquisição' }, { label: 'Retenção' }, { label: 'Receita' }],
      density: 'normal',
      actions: ['period', 'export', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Abas e filtros em uma linha', layout: 'left', description: 'Logo + abas encaixadas à esquerda; seletor de período, “Exportar” e avatar à direita.' },
      { name: 'Filtros em cima, abas embaixo', layout: 'two-row', description: 'Linha 1 com logo, período, exportar e avatar; linha 2 com as abas de relatório encaixadas no conteúdo.' },
    ],
    summary: 'Header de dashboard com abas encaixadas, seletor de período (menu suspenso), exportação e perfil.',
  }),
  H({
    id: 'banco-alameda',
    name: 'Banco Alameda',
    description: 'Header de banco ou serviço com públicos diferentes: alterna entre “Para você” e “Para empresas”.',
    filters: ['corporativos', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['corporativo', 'públicos'],
    look: {
      brand: 'Banco Alameda',
      logo: 'mark',
      height: 68,
      surface: 'solid',
      shape: 'contained',
      navStyle: 'plain',
      nav: [{ label: 'Conta' }, { label: 'Cartões' }, { label: 'Investimentos', menu: 'dropdown', items: ['Renda fixa', 'Fundos', 'Previdência', 'Simulador'] }, { label: 'Empréstimos' }],
      density: 'normal',
      actions: ['segments', 'login', 'cta'],
      cta: 'Abrir conta',
      context: 'site',
    },
    compositions: [
      { name: 'Público e ações em cima', layout: 'two-row', description: 'Linha 1 com logo, alternador “Para você | Para empresas”, “Acessar” e “Abrir conta”; linha 2 com os produtos.' },
      {
        name: 'Público na faixa utilitária',
        layout: 'left',
        patch: { actions: ['login', 'cta'], utility: ['Para você', 'Para empresas', 'Acessibilidade', 'Ajuda'] },
        description: 'Faixa fina com os públicos e links de apoio; barra principal com logo e produtos à esquerda, “Acessar” e “Abrir conta” à direita.',
      },
    ],
    summary: 'Header bancário com alternador de público, menu de produtos com submenu e ações de acesso/abertura de conta.',
  }),
  H({
    id: 'contagem-regressiva',
    name: 'Contagem Regressiva',
    description: 'Para eventos e lançamentos: mostra quanto tempo falta e um botão para garantir o ingresso.',
    filters: ['criativos', 'flutuantes'],
    floating: true,
    sticky: true,
    tags: ['evento', 'flutuante', 'CTA'],
    look: {
      brand: 'Festival Jaçanã',
      logo: 'word',
      height: 60,
      surface: 'gradient',
      shape: 'floating',
      navStyle: 'pill',
      nav: [{ label: 'Line-up' }, { label: 'Ingressos' }, { label: 'Mapa' }, { label: 'Dúvidas' }],
      density: 'tight',
      actions: ['countdown', 'cta'],
      cta: 'Garantir ingresso',
      context: 'event',
    },
    compositions: [
      { name: 'Pílula em gradiente', layout: 'split', description: 'Barra flutuante em gradiente: nome do festival, links em pílula ao centro, contagem regressiva e CTA à direita.' },
      {
        name: 'Contagem sempre visível',
        layout: 'menu-only',
        patch: { shape: 'full' },
        description: 'Barra integral: nome do festival à esquerda; contagem regressiva, CTA e botão “Menu” à direita. Os links ficam no painel do menu.',
      },
    ],
    summary: 'Header de evento em gradiente com contagem regressiva ao vivo e CTA de ingresso.',
    behavior: ['A contagem atualiza a cada minuto (não a cada segundo, para não distrair) e usa aria-live="off".'],
  }),
  H({
    id: 'feira-express',
    name: 'Feira Express',
    description: 'Para delivery e marketplaces: endereço de entrega, categorias com ícones, busca e carrinho.',
    filters: ['com-busca', 'fixos'],
    floating: false,
    sticky: true,
    tags: ['delivery', 'loja', 'busca'],
    look: {
      brand: 'Feira Juçara',
      logo: 'mark',
      height: 64,
      surface: 'solid',
      shape: 'full',
      navStyle: 'pill',
      nav: [
        { label: 'Mercado', icon: 'store' },
        { label: 'Restaurantes', icon: 'heart' },
        { label: 'Farmácia', icon: 'shield' },
        { label: 'Bebidas', icon: 'box' },
      ],
      density: 'tight',
      search: 'wide',
      actions: ['location', 'cart'],
      context: 'store',
    },
    compositions: [
      { name: 'Endereço + busca central', layout: 'search-center', description: 'Logo e “Navegar ▾” à esquerda, busca larga no centro; endereço de entrega e carrinho à direita.' },
      {
        name: 'Categorias com ícones',
        layout: 'left',
        patch: { search: 'icon' },
        description: 'Logo + categorias em pílulas com ícone à esquerda; busca em ícone, endereço e carrinho à direita.',
      },
    ],
    summary: 'Header de delivery com seletor de endereço, categorias com ícone, busca e carrinho com contador.',
  }),
  H({
    id: 'blocos-bento',
    name: 'Blocos Bento',
    description: 'Cada item do menu é um bloquinho com ícone e uma frase curta. Explica o produto já no header.',
    filters: ['criativos', 'tecnologicos'],
    floating: false,
    sticky: true,
    tags: ['blocos', 'criativo'],
    look: {
      brand: 'Mosaico',
      logo: 'mark',
      height: 76,
      surface: 'solid',
      shape: 'full',
      navStyle: 'blocks',
      nav: [
        { label: 'Criar', icon: 'pen' },
        { label: 'Publicar', icon: 'send' },
        { label: 'Medir', icon: 'chart' },
        { label: 'Automatizar', icon: 'zap' },
      ],
      density: 'tight',
      actions: ['login', 'cta'],
      cta: 'Experimentar',
      context: 'site',
    },
    compositions: [
      { name: 'Blocos no centro', layout: 'split', description: 'Logo à esquerda, quatro blocos (ícone + rótulo + descrição) no centro, “Entrar” e “Experimentar” à direita.' },
      { name: 'Barra fina + blocos embaixo', layout: 'two-row', patch: { height: 56 }, description: 'Barra de 56 px com logo e ações; segunda faixa com os quatro blocos lado a lado ocupando a largura.' },
    ],
    summary: 'Header criativo com navegação em blocos (ícone em quadro colorido, rótulo e descrição curta) e CTA.',
  }),
  H({
    id: 'praca-comunidade',
    name: 'Praça da Comunidade',
    description: 'Para redes e comunidades: ícones de feed, grupos e mensagens, busca e botão de publicar.',
    filters: ['saas', 'com-busca'],
    floating: false,
    sticky: true,
    tags: ['comunidade', 'perfil', 'ícones'],
    look: {
      brand: 'Quero-quero',
      logo: 'monogram',
      height: 60,
      surface: 'bordered',
      shape: 'full',
      navStyle: 'underline',
      nav: [
        { label: 'Feed', icon: 'home' },
        { label: 'Grupos', icon: 'users' },
        { label: 'Eventos', icon: 'calendar' },
        { label: 'Mensagens', icon: 'message', badge: '3' },
      ],
      density: 'normal',
      search: 'field',
      actions: ['create', 'notif', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Ícones no centro', layout: 'split', description: 'Logo à esquerda, abas com ícone + rótulo no centro (contador em Mensagens), busca, “+ Novo”, notificações e avatar à direita.' },
      { name: 'Tudo à direita', layout: 'right', patch: { search: 'icon' }, description: 'Logo isolado à esquerda; abas com ícone, busca em ícone, “+ Novo”, notificações e avatar agrupados à direita.' },
    ],
    summary: 'Header de comunidade com abas de ícone e rótulo, contador de mensagens, busca, botão de criar e perfil.',
  }),
  H({
    id: 'hub-produtos',
    name: 'Hub de Produtos',
    description: 'Para empresas com vários aplicativos: uma grade permite pular de um produto para outro.',
    filters: ['saas', 'corporativos'],
    floating: false,
    sticky: true,
    tags: ['multi-produto', 'perfil'],
    look: {
      brand: 'Rede Cerrado',
      logo: 'mark',
      height: 60,
      surface: 'solid',
      shape: 'full',
      navStyle: 'plain',
      nav: [{ label: 'Início' }, { label: 'Recentes' }, { label: 'Compartilhados' }, { label: 'Lixeira' }],
      density: 'normal',
      search: 'field',
      actions: ['apps', 'help', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Grade de apps à direita', layout: 'left', description: 'Logo + links à esquerda; busca, grade de aplicativos (abre um painel com 6 produtos), ajuda e avatar à direita.' },
      { name: 'Menu à esquerda, logo central', layout: 'menu-left', description: 'Botão “☰ Menu” à esquerda (abre a navegação), logo centralizado; busca, grade de apps, ajuda e avatar à direita.' },
    ],
    summary: 'Header multi-produto com alternador em grade de aplicativos, busca, ajuda e perfil.',
  }),
  H({
    id: 'duplo-compacto',
    name: 'Duplo Compacto',
    description: 'Duas faixas baixinhas para sistemas de gestão com muitos módulos (ERP).',
    filters: ['compactos', 'corporativos'],
    floating: false,
    sticky: true,
    tags: ['ERP', 'compacto', 'full width'],
    look: {
      brand: 'Mangaba ERP',
      logo: 'mark',
      height: 44,
      surface: 'inverse',
      shape: 'full',
      navStyle: 'tabs',
      nav: [
        { label: 'Vendas', menu: 'dropdown', items: ['Pedidos', 'Orçamentos', 'Clientes', 'Comissões'] },
        { label: 'Compras', menu: 'dropdown', items: ['Solicitações', 'Cotações', 'Fornecedores'] },
        { label: 'Estoque' },
        { label: 'Financeiro', menu: 'dropdown', items: ['Contas a pagar', 'Contas a receber', 'Conciliação'] },
        { label: 'Fiscal' },
      ],
      density: 'tight',
      search: 'field',
      actions: ['notif', 'help', 'profile'],
      context: 'app',
    },
    compositions: [
      { name: 'Faixa escura + módulos', layout: 'two-row', description: 'Faixa escura de 44 px com logo, busca e ícones; faixa de 36 px com os módulos em abas (vários com submenu).' },
      {
        name: 'Uma faixa só',
        layout: 'left',
        patch: { search: 'icon', navStyle: 'plain' },
        description: 'Faixa escura única de 44 px: logo, módulos com submenu à esquerda; busca em ícone e ações à direita.',
      },
    ],
    summary: 'Header de ERP em faixa escura compacta com módulos em abas e submenus, busca e ações densas.',
    measurements: { 'faixa de módulos': '36 px' },
  }),
  H({
    id: 'caderno-minimal',
    name: 'Caderno Minimal',
    description: 'Para blogs e newsletters: logo serifado, categorias e um convite para assinar.',
    filters: ['editoriais', 'minimalistas', 'com-busca'],
    floating: false,
    sticky: false,
    tags: ['editorial', 'blog', 'newsletter'],
    look: {
      brand: 'Caderno Sépia',
      logo: 'serif',
      height: 64,
      surface: 'blend',
      shape: 'contained',
      navStyle: 'underline',
      nav: [{ label: 'Ensaios' }, { label: 'Entrevistas' }, { label: 'Guias' }, { label: 'Arquivo' }],
      density: 'normal',
      search: 'icon',
      actions: ['cta-outline'],
      cta: 'Assinar newsletter',
      context: 'editorial',
    },
    compositions: [
      { name: 'Categorias ao lado do logo', layout: 'left', description: 'Logo serifado + categorias sublinhadas à esquerda; busca em ícone e “Assinar newsletter” (contornado) à direita.' },
      { name: 'Logo entre categorias', layout: 'center-logo', description: 'Duas categorias de cada lado do logo serifado central; busca e assinatura na ponta direita.' },
    ],
    summary: 'Header editorial minimalista com logotipo serifado, categorias sublinhadas, busca e CTA de newsletter.',
  }),
]

/* ========================================================================== */
/* Textos de apoio — sidebar                                                   */
/* ========================================================================== */

const S_SURFACE: Record<SidebarLook['surface'], string> = {
  nav: 'fundo navBg com borda direita de 1 px (token border)',
  plain: 'mesmo fundo da página (bg), separada do conteúdo só por uma borda de 1 px',
  alt: 'fundo levemente diferente da página (bgAlt), sem sombra',
  inverse: 'faixa escura invertida (derivada da cor de texto principal) com texto claro',
  brand: 'fundo na cor primária (primary) com texto onPrimary',
  glass: 'vidro fosco: surface com ~62 % de opacidade, backdrop-filter: blur(14px), borda clara',
  gradient: 'gradiente vertical de gradientFrom para gradientTo com texto legível sobre ele',
  tinted: 'fundo levemente tingido com a cor primária (primarySoft)',
}

const S_ITEM: Record<SidebarLook['itemStyle'], string> = {
  pill: 'item ativo com fundo navActive e texto navActiveText em cantos radiusMd',
  bar: 'item ativo com barra vertical de 3 px na cor primária encostada à esquerda e texto em primary',
  block: 'item ativo com fundo selected de borda a borda (sem cantos), texto selectedText',
  filled: 'item ativo preenchido com a cor primária e texto onPrimary',
  dot: 'item ativo em peso 600 com um ponto de 6 px na cor de destaque à esquerda',
  outline: 'item ativo com contorno de 1 px na cor primária e fundo transparente',
  tile: 'item ativo com o ícone dentro de um quadrado arredondado preenchido com primarySoft/primary',
  underline: 'item ativo sublinhado (2 px, offset 5 px) em peso 600, sem fundo',
  edge: 'item ativo com fio de 2 px na cor de destaque à esquerda e leve fundo hover',
}

const S_DENSITY: Record<SidebarLook['density'], number> = { compact: 30, normal: 36, airy: 42 }

const S_ICONS: Record<SidebarLook['icons'], string> = {
  line: 'ícones de linha de 18 px (estilo de ícone do tema) antes do rótulo',
  tile: 'ícones de 16 px dentro de quadros arredondados de 28 px com fundo suave',
  none: 'sem ícones — apenas texto',
  dot: 'bolinhas de status/cor no lugar de ícones',
}

const S_TOP: Record<SidebarArrangement['top'], string> = {
  logo: 'logo (símbolo + nome) no topo',
  'logo-search': 'logo no topo e campo de busca logo abaixo',
  workspace: 'seletor de espaço de trabalho (avatar quadrado + nome + ▾) no topo',
  search: 'campo de busca no topo que filtra os itens',
  profile: 'cartão de perfil no topo (avatar, nome e plano)',
  'logo-cta': 'logo e um botão de ação principal no topo',
  project: 'contexto atual no topo (“‹ voltar” + avatar e nome do projeto/curso, com progresso)',
  tabs: 'abas segmentadas no topo que trocam a lista inteira',
  mark: 'apenas o símbolo da marca no topo',
}

const S_FOOTER: Record<SidebarArrangement['footer'], string> = {
  profile: 'bloco de perfil no rodapé (avatar, nome, cargo e menu ⋯ que abre para cima)',
  'profile-card': 'cartão de perfil destacado no rodapé com status e menu',
  upgrade: 'cartão de upgrade no rodapé (uso do plano com barra de progresso e botão)',
  meter: 'medidor de uso/armazenamento no rodapé',
  links: 'links secundários no rodapé (Configurações, Ajuda, Sair)',
  none: 'sem rodapé',
  collapse: 'botão “Recolher menu” no rodapé',
  theme: 'alternador de tema claro/escuro no rodapé',
  'help-card': 'cartão de ajuda no rodapé (“Precisa de ajuda?” + link)',
  workspace: 'seletor de espaço de trabalho no rodapé (menu abre para cima)',
}

interface SidebarDef {
  id: string
  name: string
  description: string
  filters: string[]
  floating: boolean
  shape: SidebarModel['shape']
  width: number
  look: SidebarLook
  compositions: [SidebarComposition, SidebarComposition]
  summary: string
  structure?: string[]
  behavior?: string[]
  responsive?: string[]
  notes?: string[]
  measurements?: Record<string, string>
  fixed?: boolean
  tags?: string[]
}

function sidebarSpec(d: SidebarDef): ItemSpec {
  const l = d.look
  const all = [...l.groups, ...(l.panel ?? []), ...(l.sections ?? []).flatMap((s) => s.groups)].flatMap((g) => g.items)
  const withChildren = all.filter((i) => i.children?.length)
  const flyoutIn = d.compositions.map((c, i) => (c.arrangement.submenu === 'flyout' ? i : -1)).filter((i) => i >= 0)
  const rail = l.railWidth ?? (d.shape === 'rail' ? d.width : 72)
  const itemH = S_DENSITY[l.density]
  const shapeTxt: Record<SidebarModel['shape'], string> = {
    integral: `integral: ocupa toda a altura, encostada na borda esquerda, com ${d.width} px de largura`,
    flutuante: `flutuante: afastada 12 px do topo, da base e da esquerda, ${d.width} px de largura, cantos radiusLg e sombra`,
    rail: `trilho compacto de ${d.width} px, só ícones${d.compositions.some((c) => c.arrangement.labels === 'below') ? ' (com rótulo curto abaixo do ícone)' : ''}`,
    dupla: `dupla: trilho de ícones de 64 px + painel de segundo nível de ${d.width - 64} px (total ${d.width} px)`,
    expansivel: `expansível: ${d.width} px aberta e ${rail} px recolhida`,
    contextual: `contextual: ${d.width} px, cuja lista muda conforme a área escolhida no topo`,
  }
  const groupsTxt = l.groups
    .map((g) => `${g.title ? `“${g.title}”: ` : ''}${g.items.map((i) => i.label + (i.badge ? ` (${i.badge})` : '') + (i.children?.length ? ' ▸' : '')).join(', ')}`)
    .join(' | ')

  const structure: string[] = [
    `Formato ${shapeTxt[d.shape]}.`,
    `Superfície: ${S_SURFACE[l.surface]}.`,
    `Itens: ${groupsTxt}.`,
    `Ícones: ${S_ICONS[l.icons]}; itens de ${itemH} px de altura com padding horizontal de 12 px.`,
    `Títulos de grupo: ${l.groupTitles === 'caps' ? 'caixa alta de 11 px, peso 650, espaçamento 0,08em, em textMuted' : l.groupTitles === 'plain' ? 'texto de 12,5 px em textMuted, sem caixa alta' : l.groupTitles === 'divider' ? 'sem títulos; grupos separados por fios de 1 px' : 'sem títulos'}.`,
  ]
  if (l.panel) structure.push(`Painel de segundo nível com: ${l.panel.map((g) => `${g.title ? g.title + ': ' : ''}${g.items.map((i) => i.label).join(', ')}`).join(' | ')}.`)
  if (l.sections) structure.push(`Áreas que trocam a lista: ${l.sections.map((s) => s.label).join(', ')}.`)
  structure.push(
    `Composição A: ${S_TOP[d.compositions[0].arrangement.top]}; ${S_FOOTER[d.compositions[0].arrangement.footer]}. Composição B: ${S_TOP[d.compositions[1].arrangement.top]}; ${S_FOOTER[d.compositions[1].arrangement.footer]}.`,
  )
  if (d.structure) structure.push(...d.structure)

  const behavior: string[] = [
    `Item ativo: ${S_ITEM[l.itemStyle]}. Clique marca o item como ativo (aria-current="page"); hover com fundo hover; foco visível com anel focusRing de 2 px.`,
  ]
  if (withChildren.length)
    behavior.push(
      `Submenus (${withChildren.map((i) => i.label).join(', ')}): ${
        flyoutIn.length === 2
          ? 'abrem como flyout — painel de 220 px à direita da sidebar, alinhado ao item, com o título da seção, reposicionado para caber na altura da janela.'
          : flyoutIn.length === 1
            ? `na composição ${flyoutIn[0] === 0 ? 'A' : 'B'} abrem como flyout (painel de 220 px à direita da sidebar, alinhado ao item e reposicionado para caber na altura da janela); na composição ${flyoutIn[0] === 0 ? 'B' : 'A'}, como acordeão dentro da lista (aria-expanded), com subitens recuados e linha-guia vertical.`
            : 'abrem como acordeão dentro da lista (aria-expanded), com subitens recuados 28 px e uma linha-guia vertical de 1 px; o item pai fica destacado quando um subitem está ativo.'
      } Esc fecha o submenu aberto.`,
    )
  if (l.collapsible || d.shape === 'expansivel')
    behavior.push(
      `Botão de recolher (aria-label “Recolher menu”/“Expandir menu”) alterna entre ${d.width} e ${rail} px com transição de 180 ms em width; recolhida, os rótulos somem e aparecem como tooltip à direita no hover/foco. O estado é lembrado (localStorage).`,
    )
  if (d.compositions.some((c) => c.arrangement.expand === 'hover'))
    behavior.push(`Expansão por hover: o trilho de ${rail} px se abre para ${d.width} px por cima do conteúdo (overlay com sombra, sem empurrar o layout) ao passar o mouse ou focar com Tab; recolhe ao sair.`)
  if (d.shape === 'rail' || d.compositions.some((c) => c.arrangement.labels === 'hidden'))
    behavior.push('Trilho só com ícones: cada botão tem aria-label e mostra tooltip com o rótulo à direita (atraso de 300 ms no hover, imediato no foco).')
  if (d.shape === 'dupla') behavior.push('O trilho troca o conteúdo do painel de segundo nível; o título do painel mostra a área ativa.')
  if (d.shape === 'contextual') behavior.push('O seletor/abas do topo troca a lista inteira de itens conforme a área, mantendo a posição da sidebar.')
  if (d.compositions.some((c) => c.arrangement.top === 'search' || c.arrangement.top === 'logo-search'))
    behavior.push('A busca filtra os itens enquanto a pessoa digita (sem diferenciar maiúsculas e acentos) e mostra “Nada encontrado” quando não há resultados.')
  if (d.compositions.some((c) => c.arrangement.top === 'workspace' || c.arrangement.footer === 'workspace'))
    behavior.push('Seletor de espaço de trabalho: abre um menu com os espaços (o atual marcado com ✓) e “Criar espaço”; Esc ou clique fora fecham.')
  if (d.compositions.some((c) => ['profile', 'profile-card'].includes(c.arrangement.footer)))
    behavior.push('Menu do perfil abre para cima, dentro da altura da janela: Meu perfil, Preferências, Sair.')
  behavior.push(
    d.fixed === false
      ? 'Rola junto com a página.'
      : 'Fixa: position: sticky; top: 0; height: 100dvh; a lista rola internamente (overflow-y: auto) quando não couber, mantendo topo e rodapé visíveis.',
  )
  if (d.floating) behavior.push('Flutuante: o conteúdo começa após a largura da sidebar + 24 px; a sidebar nunca cobre conteúdo no desktop.')
  if (d.behavior) behavior.push(...d.behavior)

  const responsive: string[] = [
    `Desktop (≥ 1024 px): ${shapeTxt[d.shape]}.`,
    d.shape === 'rail'
      ? `De 768 a 1023 px: mantém o trilho de ${d.width} px.`
      : `De 768 a 1023 px: inicia recolhida em trilho de ${rail} px só com ícones; expande por cima do conteúdo (overlay com sombra) ao tocar no botão de menu.`,
    `Abaixo de 768 px: sai do fluxo e vira um drawer à esquerda com largura min(85vw, ${Math.min(Math.max(d.width, 280), 320)} px), aberto por um botão ☰ (44 × 44 px) no header; scrim escuro atrás; fecha com ✕, Esc, toque no scrim ou ao escolher um item; trava a rolagem do corpo.`,
    `No drawer os rótulos aparecem sempre (mesmo em modelos de trilho)${withChildren.length ? ' e os submenus abrem como acordeão (flyouts não são usados no celular)' : ''}; itens com no mínimo 44 px de altura.`,
    'Menus e tooltips da sidebar ficam dentro da viewport: reposicionados para cima quando faltaria espaço abaixo; nenhum overflow horizontal.',
  ]
  if (d.floating) responsive.push('No celular a versão flutuante vira drawer encostado na borda (sem afastamento), com o mesmo raio apenas nos cantos da direita.')
  if (d.compositions.some((c) => ['profile', 'profile-card', 'upgrade', 'meter', 'workspace'].includes(c.arrangement.footer)))
    responsive.push('O rodapé (perfil, medidor ou cartão) fica fixo na base do drawer; a lista rola acima dele.')
  responsive.push('Se o app for usado principalmente no celular, ofereça também uma bottom navigation com os 4–5 destinos principais.')
  if (d.responsive) responsive.push(...d.responsive)

  const measurements: Record<string, string> = {
    largura: `${d.width} px`,
    'altura dos itens': `${itemH} px (44 px no celular)`,
    'padding interno': '12 px',
    ícones: l.icons === 'tile' ? '16 px em quadros de 28 px' : l.icons === 'none' ? '—' : '18–20 px',
    'raio dos itens': 'radiusMd do tema',
    'drawer no celular': `min(85vw, ${Math.min(Math.max(d.width, 280), 320)} px)`,
  }
  if (l.collapsible || d.shape === 'expansivel' || d.shape === 'rail') measurements['largura recolhida'] = `${rail} px`
  if (d.floating) measurements['afastamento'] = '12 px das bordas'
  if (d.measurements) Object.assign(measurements, d.measurements)

  return {
    summary: d.summary,
    structure,
    behavior,
    responsive,
    measurements,
    notes: [
      'Cores dos tokens da identidade global (navBg, navText, navActive, navActiveText, primary, border); nada de cores fixas.',
      'Use <nav aria-label="Menu lateral"> com listas; grupos com título usam aria-labelledby; o item atual recebe aria-current="page".',
      ...(d.notes ?? []),
    ],
  }
}

function S(d: SidebarDef): SidebarModel {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    tags: d.tags,
    filters: d.filters,
    floating: d.floating,
    shape: d.shape,
    width: d.width,
    look: d.look,
    compositions: d.compositions,
    spec: sidebarSpec(d),
  }
}

/* Conjuntos de itens reutilizados */
const APP_GROUPS = [
  {
    title: 'Geral',
    items: [
      { label: 'Início', icon: 'home' },
      { label: 'Painel', icon: 'gauge' },
      { label: 'Projetos', icon: 'folder', badge: '12' },
      { label: 'Tarefas', icon: 'check' },
      { label: 'Calendário', icon: 'calendar' },
    ],
  },
  {
    title: 'Equipe',
    items: [
      { label: 'Pessoas', icon: 'users' },
      { label: 'Mensagens', icon: 'message', badge: '3' },
      { label: 'Relatórios', icon: 'chart' },
    ],
  },
] satisfies SidebarLook['groups']

/* ========================================================================== */
/* 36 sidebars                                                                 */
/* ========================================================================== */

export const sidebars: SidebarModel[] = [
  S({
    id: 'classica-integral',
    name: 'Clássica Integral',
    description: 'O menu lateral mais comum em sistemas: do topo ao rodapé, com grupos, ícones e o perfil embaixo.',
    filters: ['fixos', 'com-grupos', 'com-icones', 'com-perfil', 'saas'],
    floating: false,
    shape: 'integral',
    width: 248,
    tags: ['integral', 'grupos', 'perfil no rodapé'],
    look: {
      brand: 'Ipê',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      collapsible: true,
      groups: [...APP_GROUPS, { title: 'Conta', items: [{ label: 'Configurações', icon: 'settings' }, { label: 'Ajuda', icon: 'help' }] }],
    },
    compositions: [
      { name: 'Logo, grupos e perfil', arrangement: { top: 'logo', body: 'groups', footer: 'profile' }, description: 'Logo no topo com botão de recolher, grupos com títulos em caixa alta e o bloco de perfil fixo no rodapé.' },
      {
        name: 'Busca no topo, links no rodapé',
        arrangement: { top: 'logo-search', body: 'groups', footer: 'links', patch: { groupTitles: 'divider' } },
        description: 'Logo + campo de busca que filtra o menu; grupos separados por fios (sem títulos) e links de Configurações/Ajuda/Sair no rodapé.',
      },
    ],
    summary: 'Sidebar integral de 248 px com grupos titulados, ícones de linha, item ativo em pílula, colapso para trilho e perfil no rodapé.',
  }),
  S({
    id: 'ilha-lateral',
    name: 'Ilha Lateral',
    description: 'Um painel arredondado que flutua afastado das bordas da tela, como um cartão.',
    filters: ['flutuantes', 'saas', 'com-icones'],
    floating: true,
    shape: 'flutuante',
    width: 240,
    tags: ['flutuante'],
    look: {
      brand: 'Buriti',
      surface: 'nav',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'plain',
      groups: [
        { items: [{ label: 'Início', icon: 'home' }, { label: 'Caixa de entrada', icon: 'inbox', badge: '5' }, { label: 'Projetos', icon: 'folder' }, { label: 'Agenda', icon: 'calendar' }] },
        { title: 'Favoritos', items: [{ label: 'Lançamento Q4', icon: 'rocket' }, { label: 'Site novo', icon: 'globe' }, { label: 'Pesquisa UX', icon: 'compass' }] },
      ],
    },
    compositions: [
      { name: 'Botão de criar no topo', arrangement: { top: 'logo-cta', cta: 'Novo projeto', footer: 'profile' }, description: 'Logo e botão “Novo projeto” no topo, itens com o ativo preenchido em primary, perfil no rodapé.' },
      { name: 'Busca e upgrade', arrangement: { top: 'search', footer: 'upgrade' }, description: 'Busca no topo da ilha (sem logo), lista contínua e cartão de upgrade no rodapé.' },
    ],
    summary: 'Sidebar flutuante de 240 px afastada 12 px das bordas, com item ativo preenchido, favoritos e rodapé configurável.',
  }),
  S({
    id: 'trilho-icones',
    name: 'Trilho de Ícones',
    description: 'Uma faixa estreita só com ícones. Ocupa pouco espaço; o nome aparece ao passar o mouse.',
    filters: ['compactos', 'com-icones', 'tecnologicos'],
    floating: false,
    shape: 'rail',
    width: 72,
    tags: ['rail compacto', 'ícones'],
    look: {
      brand: 'Sabiá',
      surface: 'inverse',
      itemStyle: 'tile',
      density: 'normal',
      icons: 'line',
      groupTitles: 'divider',
      groups: [
        { items: [{ label: 'Início', icon: 'home' }, { label: 'Busca', icon: 'search' }, { label: 'Projetos', icon: 'folder' }, { label: 'Mensagens', icon: 'message', badge: '2' }] },
        { items: [{ label: 'Relatórios', icon: 'chart' }, { label: 'Configurações', icon: 'settings' }] },
      ],
    },
    compositions: [
      { name: 'Ícones no topo', arrangement: { top: 'mark', labels: 'hidden', footer: 'profile' }, description: 'Símbolo da marca no topo, ícones alinhados em cima com tooltips e avatar no rodapé.' },
      { name: 'Ícones centralizados', arrangement: { top: 'mark', labels: 'hidden', align: 'center', footer: 'theme', cta: '+' }, description: 'Botão redondo “+” sob o símbolo, ícones centralizados na altura e alternador de tema no rodapé.' },
    ],
    summary: 'Trilho escuro de 72 px só com ícones em quadros arredondados, tooltips com o rótulo e avatar no rodapé.',
  }),
  S({
    id: 'recolhe-expande',
    name: 'Recolhe e Expande',
    description: 'Aberta mostra nomes e ícones; recolhida vira uma faixa só de ícones. A pessoa escolhe.',
    filters: ['com-icones', 'saas', 'fixos'],
    floating: false,
    shape: 'expansivel',
    width: 256,
    tags: ['expansível'],
    look: {
      brand: 'Jacarandá',
      surface: 'nav',
      itemStyle: 'bar',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      collapsible: true,
      railWidth: 72,
      groups: APP_GROUPS,
    },
    compositions: [
      { name: 'Recolher pelo rodapé', arrangement: { top: 'logo', footer: 'collapse', expand: 'toggle' }, description: 'Logo no topo e botão “Recolher menu” no rodapé; recolhida, mostra só ícones com tooltip.' },
      { name: 'Recolher pelo topo', arrangement: { top: 'workspace', footer: 'profile', expand: 'toggle' }, description: 'Seletor de espaço com o botão de recolher ao lado, no topo; perfil no rodapé.' },
    ],
    summary: 'Sidebar expansível de 256 ↔ 72 px com barra lateral no item ativo e tooltips quando recolhida.',
  }),
  S({
    id: 'dupla-camada',
    name: 'Dupla Camada',
    description: 'Duas colunas: uma faixa de ícones para as áreas e, ao lado, a lista de páginas da área escolhida.',
    filters: ['com-icones', 'com-grupos', 'saas'],
    floating: false,
    shape: 'dupla',
    width: 288,
    tags: ['dupla', 'dois níveis'],
    look: {
      brand: 'Tucano',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      collapsible: true,
      groups: [{ items: [{ label: 'Início', icon: 'home' }, { label: 'Projetos', icon: 'folder' }, { label: 'Clientes', icon: 'users' }, { label: 'Relatórios', icon: 'chart' }, { label: 'Ajustes', icon: 'settings' }] }],
      panel: [
        { title: 'Favoritos', items: [{ label: 'Visão geral', icon: 'gauge' }, { label: 'Em andamento', icon: 'activity', badge: '8' }] },
        { title: 'Todos', items: [{ label: 'Ativos', icon: 'check' }, { label: 'Arquivados', icon: 'archive' }, { label: 'Modelos', icon: 'layers' }, { label: 'Lixeira', icon: 'trash' }] },
      ],
    },
    compositions: [
      { name: 'Logo no trilho', arrangement: { top: 'logo', footer: 'profile' }, description: 'Trilho com símbolo e avatar; painel com o título da área, grupos e botão para recolher o painel.' },
      { name: 'Busca e medidor', arrangement: { top: 'search', footer: 'meter' }, description: 'Painel começa com busca; medidor de uso no rodapé do painel.' },
    ],
    summary: 'Sidebar dupla (trilho de 64 px + painel de 224 px) em que o trilho escolhe a área e o painel lista as páginas.',
  }),
  S({
    id: 'painel-contextual',
    name: 'Painel Contextual',
    description: 'A lista muda conforme a área: em “Vendas” mostra páginas de vendas, em “Marketing” as de marketing.',
    filters: ['com-grupos', 'saas'],
    floating: false,
    shape: 'contextual',
    width: 252,
    tags: ['contextual'],
    look: {
      brand: 'Cumaru',
      surface: 'nav',
      itemStyle: 'block',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [{ title: 'Vendas', items: [{ label: 'Pedidos', icon: 'receipt' }, { label: 'Clientes', icon: 'users' }] }],
      sections: [
        {
          label: 'Vendas',
          icon: 'cart',
          groups: [
            { title: 'Operação', items: [{ label: 'Pedidos', icon: 'receipt', badge: '8' }, { label: 'Clientes', icon: 'users' }, { label: 'Propostas', icon: 'file' }] },
            { title: 'Análise', items: [{ label: 'Metas', icon: 'target' }, { label: 'Funil', icon: 'chart' }] },
          ],
        },
        {
          label: 'Marketing',
          icon: 'megaphone',
          groups: [
            { title: 'Campanhas', items: [{ label: 'Ativas', icon: 'zap' }, { label: 'Agendadas', icon: 'calendar' }, { label: 'E-mails', icon: 'mail' }] },
            { title: 'Público', items: [{ label: 'Segmentos', icon: 'pie' }, { label: 'Formulários', icon: 'list' }] },
          ],
        },
        {
          label: 'Ajustes',
          icon: 'settings',
          groups: [{ title: 'Conta', items: [{ label: 'Empresa', icon: 'building' }, { label: 'Usuários', icon: 'users' }, { label: 'Integrações', icon: 'plug' }, { label: 'Segurança', icon: 'lock' }] }],
        },
      ],
    },
    compositions: [
      { name: 'Abas de área no topo', arrangement: { top: 'tabs', footer: 'profile' }, description: 'Abas segmentadas “Vendas | Marketing | Ajustes” no topo trocam toda a lista; perfil no rodapé.' },
      { name: 'Seletor de área', arrangement: { top: 'project', footer: 'links' }, description: 'Cabeçalho com a área atual e menu “Trocar área ▾”; links de apoio no rodapé.' },
    ],
    summary: 'Sidebar contextual de 252 px cuja lista inteira muda conforme a área escolhida no topo (abas ou seletor).',
  }),
  S({
    id: 'texto-puro',
    name: 'Texto Puro',
    description: 'Minimalista: só palavras, sem ícones, com bastante espaço. Calma e elegante.',
    filters: ['minimalistas', 'fixos'],
    floating: false,
    shape: 'integral',
    width: 220,
    tags: ['minimalista'],
    look: {
      brand: 'Talha',
      surface: 'plain',
      itemStyle: 'underline',
      density: 'airy',
      icons: 'none',
      groupTitles: 'plain',
      groups: [
        { items: [{ label: 'Visão geral', icon: 'home' }, { label: 'Projetos', icon: 'folder' }, { label: 'Clientes', icon: 'users' }, { label: 'Faturas', icon: 'receipt' }] },
        { title: 'Conta', items: [{ label: 'Perfil', icon: 'user' }, { label: 'Preferências', icon: 'sliders' }] },
      ],
    },
    compositions: [
      { name: 'Logo e lista', arrangement: { top: 'logo', footer: 'none' }, description: 'Nome da marca no topo e a lista em texto, com o ativo sublinhado. Nada mais.' },
      { name: 'Pessoa no topo', arrangement: { top: 'profile', footer: 'links' }, description: 'Nome e e-mail da pessoa no topo, lista em texto e links “Ajuda · Sair” no rodapé.' },
    ],
    summary: 'Sidebar minimalista de 220 px só com texto, muito espaço entre itens e ativo sublinhado.',
  }),
  S({
    id: 'arvore-corporativa',
    name: 'Árvore Corporativa',
    description: 'Para sistemas de gestão com muitas telas: menus que se abrem em submenus, como uma árvore.',
    filters: ['corporativos', 'com-submenu', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 264,
    tags: ['submenu', 'ERP'],
    look: {
      brand: 'Aroeira',
      surface: 'alt',
      itemStyle: 'block',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        {
          title: 'Módulos',
          items: [
            { label: 'Cadastros', icon: 'database', children: ['Clientes', 'Fornecedores', 'Produtos'] },
            { label: 'Comercial', icon: 'briefcase', children: ['Pedidos', 'Orçamentos', 'Contratos'] },
            { label: 'Financeiro', icon: 'wallet', children: ['Contas a pagar', 'Contas a receber', 'Fluxo de caixa'] },
            { label: 'Relatórios', icon: 'chart' },
          ],
        },
        { title: 'Sistema', items: [{ label: 'Auditoria', icon: 'shield' }, { label: 'Configurações', icon: 'settings' }] },
      ],
    },
    compositions: [
      { name: 'Árvore com busca', arrangement: { top: 'logo-search', submenu: 'inline', footer: 'profile' }, description: 'Logo e busca no topo; submenus abrem em acordeão com linha-guia; perfil no rodapé.' },
      { name: 'Filial e submenu lateral', arrangement: { top: 'workspace', submenu: 'flyout', footer: 'links', patch: { groupTitles: 'divider' } }, description: 'Seletor de filial no topo; submenus abrem ao lado (flyout); links de apoio no rodapé.' },
    ],
    summary: 'Sidebar corporativa de 264 px com módulos em árvore (submenus em acordeão ou flyout) e fundo bgAlt.',
  }),
  S({
    id: 'console-escuro',
    name: 'Console Escuro',
    description: 'Visual técnico de painel de servidores: fundo escuro, letras de código e indicadores de status.',
    filters: ['tecnologicos', 'com-icones'],
    floating: false,
    shape: 'integral',
    width: 236,
    tags: ['tecnológica', 'escura'],
    look: {
      brand: 'carnauba',
      surface: 'inverse',
      itemStyle: 'edge',
      density: 'compact',
      icons: 'line',
      groupTitles: 'caps',
      mono: true,
      groups: [
        { title: 'Serviços', items: [{ label: 'instancias', icon: 'server' }, { label: 'bancos', icon: 'database' }, { label: 'funcoes', icon: 'zap' }, { label: 'filas', icon: 'workflow' }] },
        { title: 'Observar', items: [{ label: 'logs', icon: 'terminal' }, { label: 'metricas', icon: 'activity' }, { label: 'alertas', icon: 'bell', badge: '2' }] },
      ],
    },
    compositions: [
      { name: 'Projeto e cota', arrangement: { top: 'project', footer: 'meter' }, description: 'Seletor de ambiente “prod-sa-east ▾” com bolinha de status no topo; medidor de uso de CPU no rodapé.' },
      { name: 'Ir para… e perfil', arrangement: { top: 'logo-search', footer: 'profile' }, description: 'Logo e busca “Ir para… ⌘K” no topo; perfil no rodapé.' },
    ],
    summary: 'Sidebar técnica escura de 236 px com rótulos monoespaçados, fio de destaque no ativo e indicadores de status.',
  }),
  S({
    id: 'cartao-perfil',
    name: 'Cartão de Perfil',
    description: 'O perfil da pessoa ganha destaque num cartão, com foto, nome e plano. Bom para apps pessoais.',
    filters: ['com-perfil', 'saas'],
    floating: false,
    shape: 'integral',
    width: 256,
    tags: ['perfil'],
    look: {
      brand: 'Cupuaçu',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'tile',
      groupTitles: 'none',
      groups: [{ items: [{ label: 'Início', icon: 'home' }, { label: 'Carteira', icon: 'wallet' }, { label: 'Metas', icon: 'target' }, { label: 'Investimentos', icon: 'trending' }, { label: 'Ajustes', icon: 'settings' }] }],
    },
    compositions: [
      { name: 'Perfil no topo', arrangement: { top: 'profile', body: 'flat', footer: 'help-card' }, description: 'Cartão de perfil (avatar, nome, plano e progresso) no topo; ícones em quadros; cartão de ajuda no rodapé.' },
      { name: 'Perfil no rodapé', arrangement: { top: 'logo', body: 'flat', footer: 'profile-card' }, description: 'Logo no topo e o cartão de perfil destacado no rodapé, com status e menu.' },
    ],
    summary: 'Sidebar com cartão de perfil destacado (topo ou rodapé), ícones em quadros coloridos e item ativo em pílula.',
  }),
  S({
    id: 'seletor-espacos',
    name: 'Seletor de Espaços',
    description: 'Para quem participa de várias equipes: um seletor troca o espaço de trabalho.',
    filters: ['saas', 'com-grupos', 'com-perfil'],
    floating: false,
    shape: 'integral',
    width: 260,
    tags: ['workspace'],
    look: {
      brand: 'Quero-quero',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'plain',
      groups: [
        { items: [{ label: 'Caixa de entrada', icon: 'inbox', badge: '4' }, { label: 'Minhas tarefas', icon: 'check' }, { label: 'Calendário', icon: 'calendar' }] },
        { title: 'Espaços', items: [{ label: 'Marketing', icon: 'megaphone', dot: 'primary' }, { label: 'Produto', icon: 'box', dot: 'success' }, { label: 'Design', icon: 'palette', dot: 'warning' }] },
      ],
    },
    compositions: [
      { name: 'Espaço no topo', arrangement: { top: 'workspace', footer: 'profile' }, description: 'Seletor de espaço no topo (menu com os espaços e “Criar espaço”); perfil no rodapé.' },
      { name: 'Espaço no rodapé', arrangement: { top: 'search', footer: 'workspace' }, description: 'Busca no topo; o seletor de espaço desce para o rodapé e abre para cima.' },
    ],
    summary: 'Sidebar de 260 px com seletor de espaço de trabalho, grupos de espaços com bolinhas de cor e perfil.',
  }),
  S({
    id: 'acordeao-secoes',
    name: 'Acordeão de Seções',
    description: 'Cada seção abre e fecha como uma sanfona, mostrando só o que interessa no momento.',
    filters: ['com-submenu', 'corporativos'],
    floating: false,
    shape: 'integral',
    width: 256,
    tags: ['submenu', 'acordeão'],
    look: {
      brand: 'Copaíba',
      surface: 'nav',
      itemStyle: 'bar',
      density: 'normal',
      icons: 'line',
      groupTitles: 'none',
      groups: [
        {
          items: [
            { label: 'Atendimento', icon: 'headphones', children: ['Fila', 'Conversas', 'Avaliações'] },
            { label: 'Clientes', icon: 'users', children: ['Todos', 'Empresas', 'Segmentos'] },
            { label: 'Catálogo', icon: 'box' },
            { label: 'Relatórios', icon: 'chart', children: ['Diário', 'Mensal', 'Personalizado'] },
            { label: 'Configurações', icon: 'settings' },
          ],
        },
      ],
    },
    compositions: [
      { name: 'Acordeão simples', arrangement: { top: 'logo', submenu: 'inline', footer: 'links' }, description: 'Logo no topo; seções em acordeão (uma aberta por vez); links de apoio no rodapé.' },
      { name: 'Busca e perfil', arrangement: { top: 'logo-search', submenu: 'inline', footer: 'profile', patch: { groupTitles: 'caps', itemStyle: 'pill' } }, description: 'Logo e busca no topo, seções com pílula no ativo e perfil no rodapé.' },
    ],
    summary: 'Sidebar com seções em acordeão (submenus que abrem e fecham), barra no item ativo e links de apoio.',
  }),
  S({
    id: 'trilho-rotulado',
    name: 'Trilho com Rótulos',
    description: 'Faixa estreita com ícone e o nome pequeno embaixo. Compacta, mas sem adivinhação.',
    filters: ['compactos', 'com-icones'],
    floating: false,
    shape: 'rail',
    width: 88,
    tags: ['rail', 'rótulos'],
    look: {
      brand: 'Mangaba',
      surface: 'nav',
      itemStyle: 'tile',
      density: 'normal',
      icons: 'line',
      groupTitles: 'none',
      groups: [{ items: [{ label: 'Início', icon: 'home' }, { label: 'Explorar', icon: 'compass' }, { label: 'Biblioteca', icon: 'book' }, { label: 'Agenda', icon: 'calendar' }, { label: 'Mensagens', icon: 'message', badge: '1' }] }],
    },
    compositions: [
      { name: 'Rótulo sob o ícone', arrangement: { top: 'mark', labels: 'below', footer: 'profile' }, description: 'Símbolo no topo; cada item com ícone em quadro e rótulo de 11 px abaixo; avatar no rodapé.' },
      { name: 'Criar + rótulos', arrangement: { top: 'mark', labels: 'below', cta: '+', footer: 'theme', patch: { itemStyle: 'pill' } }, description: 'Botão “+” de criar no topo, itens com rótulo em pílulas verticais e alternador de tema no rodapé.' },
    ],
    summary: 'Trilho de 88 px com ícone e rótulo curto abaixo de cada item (estilo Material) e avatar no rodapé.',
  }),
  S({
    id: 'capsula-flutuante',
    name: 'Cápsula Flutuante',
    description: 'Uma cápsula vertical estreita que flutua ao lado do conteúdo, como um dock.',
    filters: ['flutuantes', 'compactos', 'com-icones'],
    floating: true,
    shape: 'flutuante',
    width: 64,
    tags: ['flutuante', 'dock'],
    look: {
      brand: 'Ondina',
      surface: 'inverse',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'none',
      groups: [{ items: [{ label: 'Início', icon: 'home' }, { label: 'Busca', icon: 'search' }, { label: 'Favoritos', icon: 'heart' }, { label: 'Mensagens', icon: 'message' }, { label: 'Ajustes', icon: 'settings' }] }],
    },
    compositions: [
      { name: 'Cápsula centralizada', arrangement: { top: 'mark', labels: 'hidden', align: 'center', footer: 'none' }, description: 'Cápsula curta centralizada na altura da tela, só com os ícones principais.' },
      { name: 'Cápsula de altura total', arrangement: { top: 'mark', labels: 'hidden', footer: 'profile' }, description: 'Cápsula do topo à base, com símbolo em cima e avatar embaixo.' },
    ],
    summary: 'Sidebar flutuante em cápsula vertical de 64 px, escura, com ícones circulares e tooltips.',
  }),
  S({
    id: 'cartao-upgrade',
    name: 'Com Cartão de Upgrade',
    description: 'Mostra quanto do plano já foi usado e convida para fazer upgrade, sem atrapalhar o menu.',
    filters: ['saas', 'com-icones'],
    floating: false,
    shape: 'integral',
    width: 252,
    tags: ['upgrade', 'SaaS'],
    look: {
      brand: 'Pitanga',
      surface: 'nav',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Marketing', items: [{ label: 'Campanhas', icon: 'megaphone' }, { label: 'Contatos', icon: 'users' }, { label: 'Automação', icon: 'workflow' }] },
        { title: 'Análise', items: [{ label: 'Relatórios', icon: 'chart' }, { label: 'Metas', icon: 'target' }] },
      ],
    },
    compositions: [
      { name: 'Cartão de upgrade', arrangement: { top: 'logo', footer: 'upgrade' }, description: 'Logo no topo; no rodapé, cartão “Você usou 80% do plano” com barra e botão “Fazer upgrade”.' },
      { name: 'Ação e medidor', arrangement: { top: 'logo-cta', cta: 'Nova campanha', footer: 'meter' }, description: 'Botão “Nova campanha” no topo e medidor compacto de contatos usados no rodapé.' },
    ],
    summary: 'Sidebar SaaS com item ativo preenchido e cartão de uso do plano/upgrade no rodapé.',
  }),
  S({
    id: 'lateral-da-marca',
    name: 'Lateral da Marca',
    description: 'O menu lateral inteiro na cor principal da marca. Forte e institucional.',
    filters: ['corporativos', 'com-icones', 'fixos'],
    floating: false,
    shape: 'integral',
    width: 248,
    tags: ['cor da marca'],
    look: {
      brand: 'Banco Alameda',
      surface: 'brand',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Conta', items: [{ label: 'Resumo', icon: 'home' }, { label: 'Extrato', icon: 'receipt' }, { label: 'Pix e transferências', icon: 'send' }, { label: 'Cartões', icon: 'card' }] },
        { title: 'Investir', items: [{ label: 'Investimentos', icon: 'trending' }, { label: 'Metas', icon: 'target' }] },
      ],
    },
    compositions: [
      { name: 'Logo e perfil', arrangement: { top: 'logo', footer: 'profile' }, description: 'Logo no topo, itens claros sobre a cor da marca com o ativo em destaque e perfil no rodapé.' },
      { name: 'Cliente no topo', arrangement: { top: 'profile', footer: 'links', patch: { itemStyle: 'bar' } }, description: 'Dados do cliente no topo, ativo com barra lateral e links de ajuda/sair no rodapé.' },
    ],
    summary: 'Sidebar integral na cor primária com texto onPrimary, grupos titulados e perfil.',
  }),
  S({
    id: 'blocos-grade',
    name: 'Blocos em Grade',
    description: 'As opções aparecem como blocos com ícone, em duas colunas. Visual e fácil de tocar.',
    filters: ['com-icones', 'saas'],
    floating: false,
    shape: 'integral',
    width: 256,
    tags: ['grade', 'ícones'],
    look: {
      brand: 'Mosaico',
      surface: 'nav',
      itemStyle: 'tile',
      density: 'normal',
      icons: 'tile',
      groupTitles: 'caps',
      groups: [
        { title: 'Criar', items: [{ label: 'Páginas', icon: 'file' }, { label: 'Imagens', icon: 'image' }, { label: 'Vídeos', icon: 'film' }, { label: 'Formulários', icon: 'list' }] },
        { title: 'Gerir', items: [{ label: 'Publicar', icon: 'send' }, { label: 'Medir', icon: 'chart' }] },
      ],
    },
    compositions: [
      { name: 'Grade de blocos', arrangement: { top: 'logo', body: 'tiles', footer: 'profile' }, description: 'Itens em grade de 2 colunas (ícone em quadro + rótulo); perfil no rodapé.' },
      { name: 'Lista com ícones em quadros', arrangement: { top: 'search', body: 'groups', footer: 'help-card' }, description: 'Busca no topo, lista com ícones em quadros coloridos e cartão de ajuda no rodapé.' },
    ],
    summary: 'Sidebar com itens em grade de blocos (ícone em quadro colorido + rótulo) ou lista com ícones em quadros.',
  }),
  S({
    id: 'busca-integrada',
    name: 'Busca Integrada',
    description: 'Um campo de busca no topo filtra o menu enquanto você digita. Ótimo para menus longos.',
    filters: ['com-grupos', 'saas'],
    floating: false,
    shape: 'integral',
    width: 256,
    tags: ['busca', 'grupos'],
    look: {
      brand: 'Guará',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'compact',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Operação', items: [{ label: 'Pedidos', icon: 'receipt' }, { label: 'Entregas', icon: 'truck' }, { label: 'Estoque', icon: 'box' }, { label: 'Devoluções', icon: 'archive' }] },
        { title: 'Pessoas', items: [{ label: 'Clientes', icon: 'users' }, { label: 'Equipe', icon: 'user' }, { label: 'Permissões', icon: 'key' }] },
        { title: 'Dinheiro', items: [{ label: 'Faturas', icon: 'card' }, { label: 'Repasses', icon: 'wallet' }] },
      ],
    },
    compositions: [
      { name: 'Busca no lugar do logo', arrangement: { top: 'search', footer: 'profile' }, description: 'O topo é só a busca (filtra enquanto digita); grupos titulados e perfil no rodapé.' },
      { name: 'Logo + busca', arrangement: { top: 'logo-search', footer: 'links' }, description: 'Logo no topo com a busca logo abaixo; links de apoio no rodapé.' },
    ],
    summary: 'Sidebar com busca que filtra os itens em tempo real, grupos titulados e densidade compacta.',
  }),
  S({
    id: 'caixa-entrada',
    name: 'Caixa de Entrada',
    description: 'No estilo de e-mail: contadores de mensagens, botão de escrever e marcadores coloridos.',
    filters: ['com-icones', 'saas', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 248,
    tags: ['e-mail', 'contadores'],
    look: {
      brand: 'Sanhaço Mail',
      surface: 'alt',
      itemStyle: 'filled',
      density: 'compact',
      icons: 'line',
      groupTitles: 'plain',
      groups: [
        {
          items: [
            { label: 'Entrada', icon: 'inbox', badge: '24' },
            { label: 'Com estrela', icon: 'star' },
            { label: 'Enviados', icon: 'send' },
            { label: 'Rascunhos', icon: 'file', badge: '2' },
            { label: 'Arquivo', icon: 'archive' },
            { label: 'Lixeira', icon: 'trash' },
          ],
        },
        { title: 'Marcadores', items: [{ label: 'Clientes', icon: 'tag', dot: 'primary' }, { label: 'Financeiro', icon: 'tag', dot: 'success' }, { label: 'Pessoal', icon: 'tag', dot: 'warning' }] },
      ],
    },
    compositions: [
      { name: 'Escrever no topo', arrangement: { top: 'logo-cta', cta: 'Escrever', footer: 'meter' }, description: 'Logo e botão “Escrever” no topo; armazenamento usado no rodapé.' },
      { name: 'Conta no topo', arrangement: { top: 'workspace', cta: 'Escrever', footer: 'links' }, description: 'Seletor de conta de e-mail no topo seguido de “Escrever”; links no rodapé.' },
    ],
    summary: 'Sidebar estilo e-mail com contadores, marcadores coloridos, botão de escrever e medidor de armazenamento.',
  }),
  S({
    id: 'dupla-arvore',
    name: 'Dupla com Árvore',
    description: 'Como um editor de código: faixa de ícones e, ao lado, uma árvore de pastas e arquivos.',
    filters: ['tecnologicos', 'com-submenu'],
    floating: false,
    shape: 'dupla',
    width: 300,
    tags: ['dupla', 'árvore', 'IDE'],
    look: {
      brand: 'Jabuti',
      surface: 'inverse',
      itemStyle: 'edge',
      density: 'compact',
      icons: 'line',
      groupTitles: 'caps',
      mono: true,
      groups: [{ items: [{ label: 'Arquivos', icon: 'file' }, { label: 'Buscar', icon: 'search' }, { label: 'Versões', icon: 'git' }, { label: 'Executar', icon: 'terminal' }, { label: 'Extensões', icon: 'puzzle' }] }],
      panel: [
        {
          title: 'Projeto',
          items: [
            { label: 'src', icon: 'folder', children: ['App.tsx', 'main.tsx', 'rotas.ts'] },
            { label: 'componentes', icon: 'folder', children: ['Botao.tsx', 'Cartao.tsx'] },
            { label: 'package.json', icon: 'file' },
            { label: 'LEIAME.md', icon: 'book' },
          ],
        },
      ],
    },
    compositions: [
      { name: 'Trilho + árvore', arrangement: { top: 'mark', submenu: 'inline', footer: 'profile' }, description: 'Trilho escuro com ícones; painel com a árvore do projeto (pastas abrem e fecham); avatar no trilho.' },
      { name: 'Árvore com busca', arrangement: { top: 'search', submenu: 'inline', footer: 'none' }, description: 'Painel começa com “Buscar arquivos”; árvore abaixo, sem rodapé.' },
    ],
    summary: 'Sidebar dupla técnica: trilho escuro de ícones + painel com árvore de pastas em fonte monoespaçada.',
  }),
  S({
    id: 'pontos-discretos',
    name: 'Pontos Discretos',
    description: 'Bem pequena e silenciosa: texto miúdo e um pontinho marca onde você está.',
    filters: ['minimalistas', 'compactos'],
    floating: false,
    shape: 'integral',
    width: 212,
    tags: ['minimalista', 'compacta'],
    look: {
      brand: 'Seda',
      surface: 'plain',
      itemStyle: 'dot',
      density: 'compact',
      icons: 'none',
      groupTitles: 'plain',
      groups: [
        { items: [{ label: 'Hoje', icon: 'home' }, { label: 'Próximos', icon: 'calendar' }, { label: 'Notas', icon: 'pen' }, { label: 'Arquivo', icon: 'archive' }] },
        { title: 'Listas', items: [{ label: 'Leituras', icon: 'book' }, { label: 'Viagem', icon: 'map' }, { label: 'Casa', icon: 'home' }] },
      ],
    },
    compositions: [
      { name: 'Logo e links', arrangement: { top: 'logo', footer: 'links' }, description: 'Nome no topo, lista com pontinho no ativo e links discretos no rodapé.' },
      { name: 'Busca e tema', arrangement: { top: 'search', footer: 'theme' }, description: 'Busca no topo e alternador de tema claro/escuro no rodapé.' },
    ],
    summary: 'Sidebar minimalista compacta de 212 px, só texto, com ponto de destaque no item ativo.',
  }),
  S({
    id: 'sobria-corporativa',
    name: 'Sóbria Corporativa',
    description: 'Séria e organizada, com grupos bem definidos e o cargo da pessoa no rodapé.',
    filters: ['corporativos', 'com-grupos', 'com-perfil'],
    floating: false,
    shape: 'integral',
    width: 264,
    tags: ['corporativa'],
    look: {
      brand: 'Grupo Jatobá',
      surface: 'alt',
      itemStyle: 'bar',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Gestão', items: [{ label: 'Painel', icon: 'gauge' }, { label: 'Contratos', icon: 'file' }, { label: 'Fornecedores', icon: 'building' }, { label: 'Compras', icon: 'cart' }] },
        { title: 'Pessoas', items: [{ label: 'Colaboradores', icon: 'users' }, { label: 'Folha', icon: 'receipt' }] },
        { title: 'Administração', items: [{ label: 'Auditoria', icon: 'shield' }, { label: 'Permissões', icon: 'lock' }] },
      ],
    },
    compositions: [
      { name: 'Unidade no topo', arrangement: { top: 'workspace', footer: 'profile' }, description: 'Seletor de unidade da empresa no topo; perfil com nome e cargo no rodapé.' },
      { name: 'Logo e cartão de perfil', arrangement: { top: 'logo', footer: 'profile-card', patch: { groupTitles: 'divider' } }, description: 'Logo no topo, grupos separados por fios e cartão de perfil no rodapé.' },
    ],
    summary: 'Sidebar corporativa sóbria em bgAlt, grupos em caixa alta, barra no ativo e perfil com cargo.',
  }),
  S({
    id: 'vidro-lateral',
    name: 'Vidro Lateral',
    description: 'Painel translúcido, como vidro, flutuando sobre um fundo colorido. Moderno e tecnológico.',
    filters: ['flutuantes', 'tecnologicos'],
    floating: true,
    shape: 'flutuante',
    width: 248,
    tags: ['vidro', 'flutuante'],
    look: {
      brand: 'Vagalume',
      surface: 'glass',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Estúdio', items: [{ label: 'Agentes', icon: 'bot' }, { label: 'Fluxos', icon: 'workflow' }, { label: 'Dados', icon: 'database' }] },
        { title: 'Conta', items: [{ label: 'Uso', icon: 'activity' }, { label: 'Chaves', icon: 'key' }] },
      ],
    },
    compositions: [
      { name: 'Painel de vidro', arrangement: { top: 'logo', footer: 'profile' }, description: 'Painel de vidro flutuante com logo, grupos e perfil.' },
      { name: 'Trilho de vidro', arrangement: { top: 'mark', labels: 'hidden', footer: 'profile' }, description: 'O mesmo vidro em trilho estreito de 76 px, só com ícones e tooltips.' },
    ],
    summary: 'Sidebar flutuante de vidro fosco sobre fundo em gradiente, com itens em pílula translúcida.',
    measurements: { 'largura (composição B)': '76 px' },
  }),
  S({
    id: 'contexto-projeto',
    name: 'Contexto do Projeto',
    description: 'Ao entrar num projeto, o menu mostra só as páginas daquele projeto, com um “voltar” no topo.',
    filters: ['saas', 'com-icones'],
    floating: false,
    shape: 'contextual',
    width: 256,
    tags: ['contextual', 'projeto'],
    look: {
      brand: 'Tucano',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [{ items: [{ label: 'Visão geral', icon: 'gauge' }] }],
      sections: [
        {
          label: 'Projeto',
          icon: 'folder',
          groups: [
            { title: 'Projeto Aurora', items: [{ label: 'Visão geral', icon: 'gauge' }, { label: 'Quadro', icon: 'kanban' }, { label: 'Arquivos', icon: 'folder' }, { label: 'Membros', icon: 'users' }] },
            { title: 'Configurar', items: [{ label: 'Ajustes do projeto', icon: 'settings' }] },
          ],
        },
        {
          label: 'Espaço',
          icon: 'grid',
          groups: [{ title: 'Espaço', items: [{ label: 'Todos os projetos', icon: 'layers' }, { label: 'Equipe', icon: 'users' }, { label: 'Faturamento', icon: 'card' }] }],
        },
      ],
    },
    compositions: [
      { name: 'Voltar + projeto', arrangement: { top: 'project', footer: 'profile' }, description: 'Link “‹ Todos os projetos”, avatar e nome do projeto no topo; páginas do projeto; perfil no rodapé.' },
      { name: 'Abas Projeto | Espaço', arrangement: { top: 'tabs', footer: 'links' }, description: 'Abas no topo alternam entre as páginas do projeto e as do espaço inteiro; links no rodapé.' },
    ],
    summary: 'Sidebar contextual que mostra as páginas do projeto aberto, com retorno à lista geral.',
  }),
  S({
    id: 'trilho-expande',
    name: 'Trilho que Expande',
    description: 'Fica estreita, só com ícones, e se abre por cima do conteúdo quando o mouse passa.',
    filters: ['compactos', 'com-icones', 'tecnologicos'],
    floating: false,
    shape: 'expansivel',
    width: 240,
    tags: ['expansível', 'hover'],
    look: {
      brand: 'Seriema',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      railWidth: 68,
      collapsible: true,
      groups: [
        { title: 'Dados', items: [{ label: 'Painéis', icon: 'gauge' }, { label: 'Consultas', icon: 'database' }, { label: 'Alertas', icon: 'bell', badge: '1' }] },
        { title: 'Equipe', items: [{ label: 'Pessoas', icon: 'users' }, { label: 'Ajustes', icon: 'settings' }] },
      ],
    },
    compositions: [
      { name: 'Abre ao passar o mouse', arrangement: { top: 'mark', footer: 'profile', expand: 'hover' }, description: 'Trilho de 68 px que se abre para 240 px por cima do conteúdo ao passar o mouse (ou focar).' },
      { name: 'Abre pelo botão', arrangement: { top: 'logo', footer: 'collapse', expand: 'toggle' }, description: 'Começa aberta; o botão no rodapé recolhe para o trilho e expande de novo.' },
    ],
    summary: 'Sidebar expansível que vive como trilho de 68 px e se abre sobre o conteúdo (hover) ou por botão.',
  }),
  S({
    id: 'trilha-curso',
    name: 'Trilha de Curso',
    description: 'Para cursos e passo a passo: módulos com aulas, marcas de concluído e progresso.',
    filters: ['com-submenu', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 280,
    tags: ['curso', 'progresso'],
    look: {
      brand: 'Instituto Cambuí',
      surface: 'nav',
      itemStyle: 'block',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        {
          title: 'Conteúdo',
          items: [
            { label: 'Boas-vindas', icon: 'flag', children: ['Apresentação', 'Como estudar'] },
            { label: 'Fundamentos', icon: 'book', children: ['Conceitos', 'Exercício 1', 'Quiz'] },
            { label: 'Prática guiada', icon: 'pen', children: ['Projeto', 'Revisão'] },
            { label: 'Certificado', icon: 'award' },
          ],
        },
      ],
    },
    compositions: [
      { name: 'Etapas com progresso', arrangement: { top: 'project', body: 'stepper', footer: 'none' }, description: 'Título do curso e barra de progresso no topo; módulos como etapas numeradas com ✓ nos concluídos.' },
      { name: 'Módulos em acordeão', arrangement: { top: 'logo', body: 'groups', submenu: 'inline', footer: 'help-card' }, description: 'Logo no topo; módulos abrem as aulas em acordeão; cartão de ajuda do tutor no rodapé.' },
    ],
    summary: 'Sidebar de curso com módulos e aulas (etapas ou acordeão), estados de concluído e barra de progresso.',
  }),
  S({
    id: 'admin-loja',
    name: 'Admin da Loja',
    description: 'Painel de quem vende online: pedidos com contador, produtos com submenu e canais de venda.',
    filters: ['saas', 'com-grupos', 'com-icones'],
    floating: false,
    shape: 'integral',
    width: 248,
    tags: ['loja', 'admin'],
    look: {
      brand: 'Empório Murici',
      surface: 'nav',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        {
          items: [
            { label: 'Início', icon: 'home' },
            { label: 'Pedidos', icon: 'receipt', badge: '8' },
            { label: 'Produtos', icon: 'tag', children: ['Todos', 'Coleções', 'Estoque'] },
            { label: 'Clientes', icon: 'users' },
            { label: 'Relatórios', icon: 'chart' },
          ],
        },
        { title: 'Canais de venda', items: [{ label: 'Loja virtual', icon: 'store' }, { label: 'Marketplace', icon: 'globe' }, { label: 'Ponto de venda', icon: 'card' }] },
      ],
    },
    compositions: [
      { name: 'Loja no topo', arrangement: { top: 'workspace', submenu: 'inline', footer: 'links' }, description: 'Seletor de loja no topo; Produtos abre submenu; links de configurações no rodapé.' },
      { name: 'Busca e perfil', arrangement: { top: 'logo-search', submenu: 'inline', footer: 'profile' }, description: 'Logo e busca no topo; perfil do lojista no rodapé.' },
    ],
    summary: 'Sidebar de admin de loja com contador de pedidos, submenu de produtos e grupo de canais de venda.',
  }),
  S({
    id: 'lista-ajustes',
    name: 'Lista de Ajustes',
    description: 'Para telas de configurações: uma lista simples e organizada em grupos, sem ícones.',
    filters: ['minimalistas', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 232,
    tags: ['configurações'],
    look: {
      brand: 'Ajustes',
      surface: 'plain',
      itemStyle: 'block',
      density: 'normal',
      icons: 'none',
      groupTitles: 'plain',
      groups: [
        { title: 'Conta', items: [{ label: 'Perfil', icon: 'user' }, { label: 'Segurança', icon: 'lock' }, { label: 'Notificações', icon: 'bell' }] },
        { title: 'Espaço', items: [{ label: 'Geral', icon: 'settings' }, { label: 'Membros', icon: 'users' }, { label: 'Faturamento', icon: 'card' }, { label: 'Integrações', icon: 'plug' }] },
        { title: 'Desenvolvedor', items: [{ label: 'Chaves de API', icon: 'key' }, { label: 'Webhooks', icon: 'zap' }] },
      ],
    },
    compositions: [
      { name: 'Busca de ajustes', arrangement: { top: 'search', footer: 'none' }, description: 'Campo “Buscar ajuste” no topo e a lista agrupada; sem rodapé.' },
      { name: 'Voltar ao app', arrangement: { top: 'project', footer: 'links' }, description: 'Link “‹ Voltar ao app” e título “Configurações” no topo; links de ajuda no rodapé.' },
    ],
    summary: 'Sidebar de configurações em texto, agrupada, com ativo em bloco de borda a borda.',
  }),
  S({
    id: 'dupla-escura',
    name: 'Dupla Escura',
    description: 'Faixa escura de ícones à esquerda e um painel claro com as páginas ao lado.',
    filters: ['corporativos', 'com-icones', 'com-grupos'],
    floating: false,
    shape: 'dupla',
    width: 296,
    tags: ['dupla', 'escura'],
    look: {
      brand: 'Araucária',
      surface: 'inverse',
      itemStyle: 'block',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      collapsible: true,
      groups: [{ items: [{ label: 'Painel', icon: 'gauge' }, { label: 'Clientes', icon: 'users' }, { label: 'Financeiro', icon: 'wallet' }, { label: 'Relatórios', icon: 'chart' }, { label: 'Ajustes', icon: 'settings' }] }],
      panel: [
        { title: 'Lançamentos', items: [{ label: 'A pagar', icon: 'receipt', badge: '5' }, { label: 'A receber', icon: 'wallet' }, { label: 'Conciliação', icon: 'check' }] },
        { title: 'Planejamento', items: [{ label: 'Orçamento', icon: 'pie' }, { label: 'Centros de custo', icon: 'layers' }] },
      ],
    },
    compositions: [
      { name: 'Trilho escuro com símbolo', arrangement: { top: 'mark', footer: 'profile' }, description: 'Trilho escuro com símbolo e avatar; painel claro com título da área e grupos.' },
      { name: 'Ação no painel', arrangement: { top: 'logo-cta', cta: 'Novo lançamento', footer: 'links' }, description: 'Painel com botão “Novo lançamento” no topo e links de apoio no rodapé.' },
    ],
    summary: 'Sidebar dupla com trilho escuro de 64 px e painel claro de 232 px com grupos e contadores.',
  }),
  S({
    id: 'fixados-recentes',
    name: 'Fixados e Recentes',
    description: 'Guarda à mão as páginas que a pessoa fixou e as que abriu por último.',
    filters: ['saas', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 252,
    tags: ['fixados', 'recentes'],
    look: {
      brand: 'Ipê Notas',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'compact',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { items: [{ label: 'Início', icon: 'home' }, { label: 'Buscar', icon: 'search' }, { label: 'Caixa', icon: 'inbox', badge: '2' }] },
        { title: 'Fixados', items: [{ label: 'Roteiro 2027', icon: 'pin' }, { label: 'Metas do trimestre', icon: 'pin' }] },
        { title: 'Recentes', items: [{ label: 'Reunião de equipe', icon: 'history' }, { label: 'Briefing da campanha', icon: 'history' }, { label: 'Notas soltas', icon: 'history' }] },
      ],
    },
    compositions: [
      { name: 'Espaço e perfil', arrangement: { top: 'workspace', footer: 'profile' }, description: 'Seletor de espaço no topo, grupos Fixados e Recentes, perfil no rodapé.' },
      { name: 'Busca e divisórias', arrangement: { top: 'logo-search', footer: 'links', patch: { groupTitles: 'divider' } }, description: 'Logo e busca no topo; grupos separados por fios; links no rodapé.' },
    ],
    summary: 'Sidebar com seções de itens fixados e recentes, densidade compacta e seletor de espaço.',
  }),
  S({
    id: 'densa-compacta',
    name: 'Densa Compacta',
    description: 'Muitos itens em pouco espaço, com letras menores. Para quem usa o sistema o dia inteiro.',
    filters: ['compactos', 'corporativos', 'com-grupos'],
    floating: false,
    shape: 'integral',
    width: 220,
    tags: ['densa', 'ERP'],
    look: {
      brand: 'Mangaba ERP',
      surface: 'alt',
      itemStyle: 'block',
      density: 'compact',
      icons: 'line',
      groupTitles: 'caps',
      collapsible: true,
      groups: [
        { title: 'Vendas', items: [{ label: 'Pedidos', icon: 'receipt' }, { label: 'Orçamentos', icon: 'file' }, { label: 'Clientes', icon: 'users' }, { label: 'Comissões', icon: 'wallet' }] },
        { title: 'Estoque', items: [{ label: 'Produtos', icon: 'box' }, { label: 'Movimentações', icon: 'truck' }, { label: 'Inventário', icon: 'list' }] },
        { title: 'Financeiro', items: [{ label: 'Contas', icon: 'card' }, { label: 'Fluxo de caixa', icon: 'trending' }, { label: 'Conciliação', icon: 'check' }] },
      ],
    },
    compositions: [
      { name: 'Busca e perfil', arrangement: { top: 'logo-search', footer: 'profile' }, description: 'Logo e busca no topo; itens de 30 px; perfil no rodapé.' },
      { name: 'Empresa e recolher', arrangement: { top: 'workspace', footer: 'collapse' }, description: 'Seletor de empresa no topo e botão de recolher no rodapé.' },
    ],
    summary: 'Sidebar densa de 220 px com itens de 30 px, muitos grupos e fundo bgAlt.',
  }),
  S({
    id: 'mapa-etapas',
    name: 'Mapa de Etapas',
    description: 'Mostra um processo em etapas (como um cadastro em partes): o que já foi feito e o que falta.',
    filters: ['minimalistas'],
    floating: false,
    shape: 'integral',
    width: 248,
    tags: ['etapas', 'stepper'],
    look: {
      brand: 'Araçá Seguros',
      surface: 'nav',
      itemStyle: 'block',
      density: 'airy',
      icons: 'none',
      groupTitles: 'none',
      groups: [{ items: [{ label: 'Dados pessoais', icon: 'user' }, { label: 'Endereço', icon: 'map' }, { label: 'Documentos', icon: 'file' }, { label: 'Revisão', icon: 'check' }, { label: 'Assinatura', icon: 'pen' }] }],
    },
    compositions: [
      { name: 'Etapas com ajuda', arrangement: { top: 'logo', body: 'stepper', footer: 'help-card' }, description: 'Logo no topo; etapas numeradas com descrição curta e ✓ nas concluídas; cartão de ajuda no rodapé.' },
      { name: 'Progresso no topo', arrangement: { top: 'project', body: 'stepper', footer: 'links' }, description: '“Etapa 3 de 5” com barra de progresso no topo; etapas compactas; links no rodapé.' },
    ],
    summary: 'Sidebar em formato de etapas (stepper vertical) com estados concluído, atual e pendente.',
  }),
  S({
    id: 'cartoes-flutuantes',
    name: 'Cartões Flutuantes',
    description: 'O menu é dividido em cartões separados que flutuam: navegação, projetos e perfil.',
    filters: ['flutuantes', 'com-grupos', 'com-perfil'],
    floating: true,
    shape: 'flutuante',
    width: 256,
    tags: ['flutuante', 'cartões'],
    look: {
      brand: 'Sapucaia',
      surface: 'nav',
      itemStyle: 'pill',
      density: 'compact',
      icons: 'line',
      groupTitles: 'plain',
      groups: [
        { items: [{ label: 'Início', icon: 'home' }, { label: 'Tarefas', icon: 'check', badge: '6' }, { label: 'Agenda', icon: 'calendar' }] },
        { title: 'Projetos', items: [{ label: 'Site novo', icon: 'globe', dot: 'success' }, { label: 'App móvel', icon: 'box', dot: 'warning' }, { label: 'Marca', icon: 'palette', dot: 'primary' }] },
      ],
    },
    compositions: [
      { name: 'Três cartões', arrangement: { top: 'logo', footer: 'profile-card', cards: true }, description: 'Cartão do logo + navegação, cartão de projetos e cartão do perfil, empilhados com 10 px entre eles.' },
      { name: 'Um painel só', arrangement: { top: 'workspace', footer: 'upgrade' }, description: 'Um único painel flutuante com seletor de espaço no topo e cartão de upgrade no rodapé.' },
    ],
    summary: 'Sidebar flutuante dividida em cartões independentes (navegação, projetos, perfil).',
  }),
  S({
    id: 'gradiente-tech',
    name: 'Gradiente Tech',
    description: 'Menu lateral com fundo em degradê de cores. Chama a atenção e transmite inovação.',
    filters: ['tecnologicos', 'com-icones'],
    floating: false,
    shape: 'integral',
    width: 244,
    tags: ['gradiente'],
    look: {
      brand: 'Lumiar Labs',
      surface: 'gradient',
      itemStyle: 'filled',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        { title: 'Construir', items: [{ label: 'Agentes', icon: 'bot' }, { label: 'Conhecimento', icon: 'book' }, { label: 'Ferramentas', icon: 'puzzle' }] },
        { title: 'Operar', items: [{ label: 'Execuções', icon: 'activity' }, { label: 'Custos', icon: 'wallet' }] },
      ],
    },
    compositions: [
      { name: 'Logo e perfil', arrangement: { top: 'logo', footer: 'profile' }, description: 'Logo no topo do degradê, itens claros e perfil no rodapé.' },
      { name: 'Criar e créditos', arrangement: { top: 'logo-cta', cta: 'Novo agente', footer: 'meter' }, description: 'Botão “Novo agente” no topo e medidor de créditos no rodapé.' },
    ],
    summary: 'Sidebar integral com fundo em gradiente (gradientFrom → gradientTo), texto claro e item ativo translúcido.',
  }),
  S({
    id: 'submenu-lateral',
    name: 'Submenu Lateral',
    description: 'Os submenus abrem ao lado do menu, num painel próprio, sem empurrar a lista para baixo.',
    filters: ['com-submenu', 'com-icones', 'corporativos'],
    floating: false,
    shape: 'integral',
    width: 240,
    tags: ['submenu', 'flyout'],
    look: {
      brand: 'Grupo Ingá',
      surface: 'nav',
      itemStyle: 'bar',
      density: 'normal',
      icons: 'line',
      groupTitles: 'caps',
      groups: [
        {
          title: 'Operação',
          items: [
            { label: 'Painel', icon: 'gauge' },
            { label: 'Pedidos', icon: 'receipt', children: ['Novos', 'Em separação', 'Enviados', 'Devolvidos'] },
            { label: 'Catálogo', icon: 'tag', children: ['Produtos', 'Categorias', 'Preços'] },
            { label: 'Logística', icon: 'truck', children: ['Transportadoras', 'Fretes', 'Rastreamento'] },
          ],
        },
        { title: 'Gestão', items: [{ label: 'Relatórios', icon: 'chart' }, { label: 'Ajustes', icon: 'settings' }] },
      ],
    },
    compositions: [
      { name: 'Flyout ao lado', arrangement: { top: 'logo', submenu: 'flyout', footer: 'profile' }, description: 'Itens com ▸ abrem um painel de submenu à direita da sidebar, alinhado ao item.' },
      { name: 'Trilho + flyout', arrangement: { top: 'mark', labels: 'hidden', submenu: 'flyout', footer: 'none' }, description: 'Trilho de 72 px só com ícones; o flyout traz o título da seção e os subitens.' },
    ],
    summary: 'Sidebar com submenus em flyout (painel lateral) em vez de acordeão; também funciona como trilho.',
    measurements: { flyout: '220 px de largura' },
  }),
  S({
    id: 'rodape-pessoal',
    name: 'Rodapé Pessoal',
    description: 'Simples, com a pessoa logada no rodapé: foto, status (disponível, ausente) e menu da conta.',
    filters: ['com-perfil', 'minimalistas', 'fixos'],
    floating: false,
    shape: 'integral',
    width: 240,
    tags: ['perfil no rodapé', 'minimalista'],
    look: {
      brand: 'Ateliê Jambo',
      surface: 'tinted',
      itemStyle: 'outline',
      density: 'normal',
      icons: 'line',
      groupTitles: 'none',
      groups: [{ items: [{ label: 'Início', icon: 'home' }, { label: 'Pedidos', icon: 'receipt' }, { label: 'Agenda', icon: 'calendar' }, { label: 'Clientes', icon: 'users' }, { label: 'Ajuda', icon: 'life' }] }],
    },
    compositions: [
      { name: 'Perfil com status', arrangement: { top: 'logo', footer: 'profile' }, description: 'Logo no topo, itens com contorno no ativo e perfil com status no rodapé (menu abre para cima).' },
      { name: 'Símbolo e cartão', arrangement: { top: 'mark', footer: 'profile-card' }, description: 'Só o símbolo no topo e um cartão de perfil maior no rodapé com seletor de status.' },
    ],
    summary: 'Sidebar minimalista em fundo tingido, ativo contornado e perfil com status no rodapé.',
  }),
]

export const headerById = (id: string | null | undefined) => headers.find((h) => h.id === id)
export const sidebarById = (id: string | null | undefined) => sidebars.find((s) => s.id === id)

/** Receita visual efetiva de uma composição (visual base + ajustes da composição). */
export function headerLookFor(model: HeaderModel, variant: 0 | 1): HeaderLook {
  return { ...model.look, ...(model.compositions[variant].patch ?? {}) }
}

export function sidebarLookFor(model: SidebarModel, variant: 0 | 1): SidebarLook {
  return { ...model.look, ...(model.compositions[variant].arrangement.patch ?? {}) }
}
