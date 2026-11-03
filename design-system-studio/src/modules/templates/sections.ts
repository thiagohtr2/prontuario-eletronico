import type { ItemSpec } from '@/core/types'
import type { SectionKind, TemplateSection } from './types'

/**
 * Biblioteca de seções reutilizáveis: nome legível e descrição técnica de cada tipo,
 * com a composição no desktop e o comportamento concreto no celular. É daqui que sai a
 * estrutura e a responsividade de cada template (dados puros, sem JSX).
 */
export interface SectionKindInfo {
  label: string
  layout: (s: TemplateSection) => string
  mobile: (s: TemplateSection) => string
  behavior?: (s: TemplateSection) => string | null
}

const n = (s: TemplateSection) => s.items?.length ?? 0
const cols = (s: TemplateSection) => (n(s) === 4 || n(s) === 8 ? 4 : n(s) === 2 ? 2 : 3)
const v = (s: TemplateSection, fallback: string) => s.variant ?? fallback

export const SECTION_LIBRARY: Record<SectionKind, SectionKindInfo> = {
  nav: {
    label: 'Cabeçalho',
    layout: (s) => {
      switch (v(s, 'split')) {
        case 'centered':
          return `Header com logo centralizado, ${s.links?.length ?? 4} links divididos à esquerda e à direita e ação “${s.cta ?? 'Reservar'}” no canto.`
        case 'minimal':
          return `Header mínimo: logo à esquerda e uma única ação${s.cta ? ` (“${s.cta}”)` : ''} à direita.`
        case 'store':
          return 'Faixa de aviso no topo + header de loja com logo, categorias, campo de busca e ícones de conta, favoritos e sacola com contador.'
        case 'masthead':
          return 'Cabeçalho de revista: linha de data/assinatura, logotipo grande centralizado e barra de editorias com bordas finas acima e abaixo.'
        case 'docs':
          return 'Header de documentação: logo, seletor de versão, busca com atalho ⌘K centralizada e links para API, changelog e repositório.'
        default:
          return `Header com logo à esquerda, ${s.links?.length ?? 4} links no centro e ação principal “${s.cta ?? 'Começar'}”${s.cta2 ? ` + ação secundária “${s.cta2}”` : ''} à direita.`
      }
    },
    mobile: (s) =>
      v(s, 'split') === 'store'
        ? 'No celular: logo à esquerda; busca, sacola e menu (hambúrguer) à direita; categorias vão para o drawer. A faixa de aviso fica em uma linha com texto truncado.'
        : v(s, 'split') === 'masthead'
          ? 'No celular: logotipo centralizado reduzido (≈28 px), menu hambúrguer à esquerda e editorias em linha com rolagem horizontal (sem quebrar).'
          : v(s, 'split') === 'docs'
            ? 'No celular: logo + ícone de busca + botão de menu que abre a navegação da documentação em drawer.'
            : `No celular: altura ≈60 px, logo à esquerda e botão de menu (hambúrguer, área de toque 44 px) à direita; os links abrem em painel de tela cheia${s.cta ? ` com “${s.cta}” como botão de largura total no fim` : ''}.`,
    behavior: () => 'Header fixo (sticky) no topo; ganha borda inferior ou fundo sólido após 8 px de rolagem. Link da página atual com indicador visível.',
  },
  'hero-split': {
    label: 'Hero dividido',
    layout: (s) =>
      `Hero em duas colunas (≈55/45): ${s.variant === 'reverse' ? 'ilustração à esquerda e texto à direita' : 'texto à esquerda (selo, título grande, parágrafo, dois botões e prova social) e ilustração à direita'}, alinhados ao centro vertical.`,
    mobile: () =>
      'No celular: uma coluna — texto primeiro, ilustração abaixo em largura total; título ≈34–36 px; botões empilhados em largura total (primário em cima).',
  },
  'hero-centered': {
    label: 'Hero centralizado',
    layout: () =>
      'Hero centralizado: selo em pílula, título de até 2 linhas (≈60 px), subtítulo com largura máxima de ≈640 px, dois botões lado a lado e, abaixo, a captura da interface do produto em largura ampla.',
    mobile: () =>
      'No celular: título ≈34 px, botões empilhados em largura total; a captura da interface é cortada lateralmente mantendo a proporção (sem encolher até ficar ilegível).',
  },
  'hero-image': {
    label: 'Hero com imagem',
    layout: (s) =>
      `Hero de largura total com imagem de fundo e gradiente escuro para legibilidade; texto ${s.variant === 'center' ? 'centralizado' : 'alinhado à esquerda, na parte inferior'}${s.variant === 'booking' ? ' e barra de reserva (check-in, check-out, hóspedes, botão) sobreposta à base' : ''}. Altura ≈620 px.`,
    mobile: (s) =>
      `No celular: altura ≈520 px (use svh), título ≈34 px, botões em largura total${s.variant === 'booking' ? '; a barra de reserva vira um cartão abaixo da imagem com os campos empilhados' : ''}.`,
  },
  'hero-editorial': {
    label: 'Hero tipográfico',
    layout: (s) =>
      s.variant === 'name'
        ? 'Hero tipográfico: nome/assinatura em tamanho monumental (≈120 px) ocupando a largura, linha de função e disponibilidade abaixo, com ilustração pequena deslocada.'
        : s.variant === 'classic'
          ? 'Hero clássico: título serifado à esquerda com fios finos de separação, parágrafo e botão; retrato institucional à direita em moldura reta.'
          : 'Hero de manifesto: título enorme (≈84 px) com uma palavra destacada na cor principal, forma abstrata desfocada ao fundo e botões abaixo.',
    mobile: (s) =>
      s.variant === 'name'
        ? 'No celular: nome em ≈56 px quebrando em até 3 linhas (clamp()), ilustração abaixo, sem rolagem horizontal.'
        : 'No celular: título ≈40 px com quebra natural, forma decorativa reduzida atrás do texto e botões empilhados em largura total.',
  },
  'hero-event': {
    label: 'Hero de evento',
    layout: (s) =>
      s.variant === 'poster'
        ? 'Hero estilo cartaz: data e local em destaque, título gigante, formas geométricas coloridas e lista das principais atrações em linha.'
        : 'Hero de evento: chips de data e local, título grande, contagem regressiva (dias/horas/minutos) em blocos e botões “Garantir ingresso” e “Ver agenda”.',
    mobile: () =>
      'No celular: chips quebram em linhas, título ≈38 px, contagem regressiva em 4 blocos menores numa só linha, botões em largura total.',
  },
  'hero-search': {
    label: 'Hero com busca',
    layout: (s) =>
      s.variant === 'split'
        ? 'Hero dividido: à esquerda, título e cartão de busca com abas (Comprar/Alugar) e campos de local, tipo e faixa de preço; à direita, imagem alta com cantos do tema.'
        : 'Hero de largura total com imagem: título centralizado e barra de busca em pílula com 3 campos (destino, datas, pessoas) e botão.',
    mobile: () =>
      'No celular: os campos de busca empilham em um cartão (um por linha, 48 px de altura, 16 px de fonte) com o botão “Buscar” em largura total; a imagem vira faixa superior de ≈220 px.',
  },
  'hero-product': {
    label: 'Hero do produto',
    layout: () =>
      'Hero de produto único: produto centralizado em pedestal com sombra, especificações curtas à esquerda e à direita, preço e botão de compra abaixo.',
    mobile: () =>
      'No celular: produto no topo (≈280 px), especificações em 2 colunas abaixo, preço e botão “Comprar” em largura total.',
  },
  'hero-app': {
    label: 'Hero do aplicativo',
    layout: () =>
      'Hero de app: texto à esquerda com selos das lojas (App Store / Google Play) e nota média; à direita, dois celulares sobrepostos mostrando telas do app.',
    mobile: () =>
      'No celular: texto centralizado, selos das lojas lado a lado (cada um ≥ 44 px de altura), apenas um celular abaixo, centralizado.',
  },
  'hero-countdown': {
    label: 'Hero “em breve”',
    layout: () =>
      'Hero de lista de espera centralizado: selo “Em breve”, título, texto curto, contagem regressiva em 4 blocos, campo de e-mail + botão na mesma linha e prova social com avatares.',
    mobile: () =>
      'No celular: campo de e-mail e botão empilhados em largura total (campo com 16 px), blocos da contagem em uma linha de 4 colunas estreitas.',
  },
  logos: {
    label: 'Logos',
    layout: (s) => `Faixa de ${n(s)} logotipos (marcas fictícias) em uma linha, em tom neutro com opacidade reduzida, com legenda curta acima.`,
    mobile: () => 'No celular: logos em grade de 3 colunas (2 linhas), centralizados e com altura uniforme ≈24 px.',
  },
  'features-grid': {
    label: 'Grade de recursos',
    layout: (s) => {
      const c = cols(s)
      switch (v(s, 'cards')) {
        case 'numbered':
          return `${n(s)} itens numerados (01, 02…) em ${c} colunas, separados por fios finos, com número grande na cor principal.`
        case 'bordered':
          return `${n(s)} itens em grade de ${c} colunas com bordas internas compartilhadas (sem espaço entre células).`
        case 'inline':
          return `Faixa compacta com ${n(s)} benefícios lado a lado (ícone + título + texto curto).`
        case 'icons':
          return `${n(s)} recursos em ${c} colunas: ícone em círculo suave, título e texto, sem cartão.`
        default:
          return `${n(s)} cartões em ${c} colunas: ícone, título e descrição de 2–3 linhas sobre superfície com borda fina.`
      }
    },
    mobile: (s) =>
      v(s, 'cards') === 'inline'
        ? 'No celular: benefícios em 2 colunas (ícone acima do texto), sem rolagem horizontal.'
        : 'No celular: uma coluna, cartões em largura total com espaçamento de 12–16 px; ícones mantêm 40 px.',
  },
  'feature-split': {
    label: 'Recursos alternados',
    layout: (s) => `${n(s)} linhas alternadas de imagem e texto (zigue-zague), cada uma com título, parágrafo e lista curta de pontos.`,
    mobile: () => 'No celular: cada linha vira imagem em cima e texto embaixo, sempre na mesma ordem (sem alternância).',
  },
  steps: {
    label: 'Passo a passo',
    layout: (s) => `${n(s)} passos numerados em linha horizontal, ligados por uma linha fina, cada um com título e texto curto.`,
    mobile: () => 'No celular: linha do tempo vertical com o número à esquerda e o texto à direita.',
  },
  stats: {
    label: 'Números',
    layout: (s) => `${n(s)} números grandes em linha${s.tone === 'primary' ? ' sobre faixa na cor principal' : ''}, cada um com legenda curta, separados por divisores verticais.`,
    mobile: () => 'No celular: grade 2 × 2, números ≈32 px, divisores horizontais.',
  },
  testimonials: {
    label: 'Depoimentos',
    layout: (s) =>
      s.variant === 'single'
        ? 'Um depoimento em destaque centralizado: citação grande (≈30 px), avatar, nome e cargo.'
        : s.variant === 'ratings'
          ? `${n(s)} avaliações em cartões com estrelas, título curto, texto e autor.`
          : `${n(s)} depoimentos em cartões lado a lado com aspas, texto, avatar, nome e cargo.`,
    mobile: (s) =>
      s.variant === 'single'
        ? 'No celular: citação ≈22 px, alinhada à esquerda.'
        : 'No celular: carrossel horizontal com scroll-snap (cartão ≈84% da largura, mostrando o início do próximo), sem barra de rolagem visível.',
  },
  pricing: {
    label: 'Preços',
    layout: (s) =>
      s.variant === 'single'
        ? 'Um cartão de oferta centralizado: preço grande, condições, lista de benefícios com ícones de check, botão e selo de garantia.'
        : s.variant === 'list'
          ? `${n(s)} pacotes em lista: nome e descrição à esquerda, itens incluídos ao centro, preço e botão à direita.`
          : `${n(s)} planos em colunas iguais; o recomendado tem borda na cor principal e selo “Mais escolhido”. Cada plano: nome, preço, descrição, benefícios e botão.`,
    mobile: (s) =>
      s.variant === 'list'
        ? 'No celular: cada pacote vira um cartão com nome, preço e botão em largura total.'
        : 'No celular: planos empilhados em uma coluna, o recomendado primeiro; botões em largura total.',
  },
  faq: {
    label: 'Perguntas frequentes',
    layout: (s) =>
      `${n(s)} perguntas em acordeão${s.variant === 'split' ? ', com título e texto de apoio na coluna esquerda e a lista na direita' : ' centralizado (largura máxima ≈760 px)'}; a primeira vem aberta.`,
    mobile: () => 'No celular: uma coluna; cada pergunta com área de toque ≥ 48 px e ícone +/− à direita.',
    behavior: () => 'Acordeão acessível (button com aria-expanded/aria-controls); abre/fecha com Enter/Espaço; transição de altura de 150–200 ms.',
  },
  gallery: {
    label: 'Galeria',
    layout: (s) => {
      switch (v(s, 'grid')) {
        case 'masonry':
          return `Galeria em mosaico (masonry) de 3 colunas com ${n(s)} imagens de alturas variadas.`
        case 'projects':
          return `${n(s)} projetos em 2 colunas largas, imagem grande com legenda (nome, categoria e ano) abaixo.`
        case 'phones':
          return `${n(s)} telas do app em celulares lado a lado, com legenda curta abaixo de cada.`
        case 'categories':
          return `${n(s)} blocos de categoria com imagem e nome sobreposto, em ${cols(s)} colunas.`
        default:
          return `${n(s)} imagens em grade uniforme de ${cols(s)} colunas com legenda discreta.`
      }
    },
    mobile: (s) =>
      v(s, 'grid') === 'projects'
        ? 'No celular: uma coluna, imagens em proporção 4:3.'
        : v(s, 'grid') === 'phones'
          ? 'No celular: carrossel horizontal com scroll-snap, um celular por vez.'
          : 'No celular: 2 colunas; o mosaico mantém alturas variadas.',
    behavior: (s) => (v(s, 'grid') === 'phones' ? null : 'Clique em uma imagem abre visualização ampliada (lightbox) com navegação por setas e Esc para fechar.'),
  },
  team: {
    label: 'Equipe',
    layout: (s) =>
      s.variant === 'single'
        ? 'Apresentação de uma pessoa: retrato grande à esquerda, nome, credenciais, biografia e números à direita.'
        : s.variant === 'speakers'
          ? `${n(s)} palestrantes em ${cols(s)} colunas com foto circular, nome, cargo/empresa e título da palestra.`
          : `${n(s)} pessoas em ${cols(s)} colunas: retrato, nome, função e uma linha de especialidade.`,
    mobile: (s) => (s.variant === 'single' ? 'No celular: retrato em cima, texto embaixo.' : 'No celular: 2 colunas com fotos menores; textos centralizados.'),
  },
  'blog-list': {
    label: 'Lista de conteúdo',
    layout: (s) => {
      switch (v(s, 'cards')) {
        case 'lead':
          return 'Matéria principal grande (imagem + título ≈44 px + linha fina) à esquerda e 3 manchetes secundárias empilhadas à direita.'
        case 'list':
          return `Lista numerada das ${n(s)} mais lidas, com número grande, editoria e título.`
        case 'episodes':
          return `${n(s)} episódios em linhas: capa, número, título, descrição curta, duração e botão de play.`
        case 'threads':
          return `${n(s)} discussões recentes: avatar, título, categoria, número de respostas e tempo desde a última atividade.`
        default:
          return `${n(s)} cartões de artigo em ${cols(s)} colunas: imagem, editoria, título, resumo e data/tempo de leitura.`
      }
    },
    mobile: (s) =>
      v(s, 'cards') === 'lead'
        ? 'No celular: matéria principal em cima, manchetes abaixo separadas por fios.'
        : v(s, 'cards') === 'episodes'
          ? 'No celular: capa menor (56 px), descrição oculta, botão de play com 44 px.'
          : 'No celular: uma coluna; metadados quebram em linha própria.',
  },
  'product-grid': {
    label: 'Vitrine de produtos',
    layout: (s) => `Vitrine com ${n(s)} produtos em ${cols(s)} colunas: foto 4:5, selo, nome, preço (com parcelamento) e amostras de cor; filtros/ordenar no topo.`,
    mobile: () => 'No celular: 2 colunas compactas; filtros viram botão “Filtrar” que abre um painel inferior (bottom sheet).',
    behavior: () => 'Hover no produto mostra segunda foto e botão “Adicionar”; no toque, o botão fica sempre visível.',
  },
  listings: {
    label: 'Lista de ofertas',
    layout: (s) =>
      s.variant === 'rooms'
        ? `${n(s)} acomodações em cartões: foto, nome, capacidade, comodidades, preço por noite e botão “Reservar”.`
        : s.variant === 'trips'
          ? `${n(s)} pacotes em cartões: foto, destino, duração, nota e preço “a partir de”.`
          : `${n(s)} imóveis em ${cols(s)} colunas: foto com selo, preço, título, bairro e ícones de quartos/banheiros/área.`,
    mobile: () => 'No celular: uma coluna de cartões em largura total; fotos em 16:10.',
  },
  menu: {
    label: 'Cardápio',
    layout: (s) =>
      s.variant === 'cards'
        ? `${n(s)} itens do cardápio em cartões com ilustração, nome, descrição curta e preço.`
        : `Cardápio em 2 colunas com ${n(s)} pratos: nome, linha pontilhada até o preço e descrição abaixo; pratos do chef com selo.`,
    mobile: () => 'No celular: uma coluna; nome e preço na mesma linha, descrição abaixo; categorias como abas roláveis no topo.',
  },
  schedule: {
    label: 'Agenda',
    layout: (s) => {
      switch (v(s, 'agenda')) {
        case 'weekly':
          return 'Grade semanal de aulas: tabela com dias nas colunas e horários nas linhas; cada aula com nome e professor.'
        case 'modules':
          return `Conteúdo do curso em ${n(s)} módulos (acordeão), cada um com número de aulas e duração; o primeiro aberto.`
        case 'events':
          return `${n(s)} próximos encontros em linhas: bloco de data, título, formato (online/presencial) e botão “Participar”.`
        case 'lineup':
          return `Programação em ${n(s)} horários: hora, atração e palco, em linhas com destaque para a atração principal.`
        default:
          return `Agenda com abas por dia e ${n(s)} sessões em linhas: horário, título, palestrante e sala/trilha.`
      }
    },
    mobile: (s) =>
      v(s, 'agenda') === 'weekly'
        ? 'No celular: abas com os dias da semana (rolagem horizontal) e lista das aulas do dia selecionado — nunca a tabela inteira.'
        : 'No celular: cada linha vira um cartão com horário em cima e título abaixo.',
  },
  contact: {
    label: 'Contato',
    layout: (s) =>
      s.variant === 'location'
        ? 'Bloco de localização: mapa ilustrado à esquerda; endereço, horários de funcionamento, telefone e botão à direita.'
        : s.variant === 'simple'
          ? 'Contato centralizado: chamada grande, e-mail clicável em destaque e redes sociais.'
          : 'Contato em duas colunas: informações (telefone, e-mail, endereço) à esquerda e formulário (nome, e-mail, mensagem, botão) à direita.',
    mobile: () => 'No celular: uma coluna; campos com 16 px de fonte e 48 px de altura, botão de envio em largura total; telefone com link tel:.',
    behavior: (s) => (s.variant === 'form' || !s.variant ? 'Formulário com validação por campo, estado de envio (botão com carregando) e mensagem de sucesso.' : null),
  },
  newsletter: {
    label: 'Newsletter',
    layout: () => 'Faixa de inscrição: título e texto curto à esquerda; campo de e-mail e botão na mesma linha à direita; aviso de privacidade abaixo.',
    mobile: () => 'No celular: texto em cima; campo e botão empilhados em largura total.',
  },
  'cta-band': {
    label: 'Chamada final',
    layout: (s) =>
      `Faixa de chamada final ${s.tone === 'primary' ? 'na cor principal' : 'em cartão destacado'}: título forte, frase de apoio e ${s.cta2 ? 'dois botões' : 'um botão'}.`,
    mobile: () => 'No celular: texto centralizado e botões empilhados em largura total.',
  },
  donate: {
    label: 'Doação',
    layout: () =>
      'Bloco de doação: à esquerda, texto de impacto (o que cada valor faz); à direita, cartão com alternância Única/Mensal, valores sugeridos em chips, campo “Outro valor” e botão “Doar agora”.',
    mobile: () => 'No celular: cartão de doação primeiro, valores em grade 2 × 2 com 48 px de altura.',
  },
  footer: {
    label: 'Rodapé',
    layout: (s) =>
      s.variant === 'simple'
        ? 'Rodapé em uma linha: logo, links principais e direitos autorais.'
        : s.variant === 'big'
          ? 'Rodapé com marca em tamanho gigante, colunas de links e contato.'
          : 'Rodapé com marca e descrição curta à esquerda e 3–4 colunas de links; barra inferior com direitos e links legais.',
    mobile: (s) =>
      s.variant === 'simple' ? 'No celular: itens empilhados e centralizados.' : 'No celular: colunas de links em grade de 2 colunas; barra inferior empilhada.',
  },
  'dash-sidebar': {
    label: 'Menu lateral',
    layout: () => 'Sidebar fixa de ≈240 px com logo, grupos de navegação com ícones, item ativo destacado e cartão de usuário no rodapé.',
    mobile: () => 'No celular: a sidebar some; os 4 destinos principais vão para uma barra inferior fixa (bottom navigation) e o restante para o menu do topo.',
  },
  'dash-topbar': {
    label: 'Barra superior',
    layout: () => 'Barra superior do conteúdo: título da página e período à esquerda; busca, notificações e botão principal à direita.',
    mobile: () => 'No celular: título + ícones (busca, notificações); o botão principal vira botão flutuante (FAB) ou ícone.',
  },
  'dash-kpis': {
    label: 'Indicadores',
    layout: (s) => `${n(s)} cartões de indicador (KPI) em linha: rótulo, valor grande, variação percentual colorida e minigráfico.`,
    mobile: () => 'No celular: KPIs em grade 2 × 2 com valores ≈22 px.',
  },
  'dash-chart': {
    label: 'Gráfico',
    layout: () => 'Gráfico de área/linhas em cartão grande (≈2/3 da largura), com legenda, seletor de período e eixo com rótulos.',
    mobile: () => 'No celular: gráfico em largura total com altura ≈200 px; legenda abaixo; seletor de período como Segmented.',
  },
  'dash-activity': {
    label: 'Atividade recente',
    layout: () => 'Lista de atividade recente em cartão lateral (≈1/3): avatar, ação, horário.',
    mobile: () => 'No celular: abaixo do gráfico, mostrando 4 itens e link “Ver tudo”.',
  },
  'dash-table': {
    label: 'Tabela',
    layout: () => 'Tabela de registros com cabeçalho fixo, status em selos coloridos, valores alinhados à direita, ações por linha e paginação.',
    mobile: () => 'No celular: cada linha vira um cartão (título, status e valor em destaque, demais campos em pares rótulo/valor); sem rolagem horizontal da página.',
  },
  'docs-sidebar': {
    label: 'Navegação da documentação',
    layout: () => 'Coluna esquerda de ≈240 px com grupos de páginas, item atual destacado e rolagem independente.',
    mobile: () => 'No celular: vira botão “Menu da documentação” que abre um drawer com a mesma árvore.',
  },
  'docs-article': {
    label: 'Artigo',
    layout: () => 'Conteúdo central (largura de leitura ≈720 px): breadcrumb, título, introdução, aviso (callout), bloco de código com abas de linguagem e botão copiar.',
    mobile: () => 'No celular: largura total; blocos de código com rolagem horizontal interna (nunca da página) e fonte 13 px.',
  },
  'docs-toc': {
    label: 'Índice da página',
    layout: () => 'Coluna direita de ≈200 px “Nesta página” com âncoras dos subtítulos e destaque da seção visível (scrollspy).',
    mobile: () => 'No celular: vira um bloco recolhível “Nesta página” no topo do artigo.',
  },
  'docs-pager': {
    label: 'Navegação anterior/próximo',
    layout: () => 'Dois cartões “Anterior” e “Próximo” ao fim do artigo, além de “Esta página ajudou?” e link para editar.',
    mobile: () => 'No celular: cartões empilhados em largura total.',
  },
}

export function sectionLabel(s: TemplateSection): string {
  return SECTION_LIBRARY[s.kind].label
}

/** Linha de estrutura de uma seção: posição, nome e composição no desktop. */
export function sectionLayoutLine(s: TemplateSection, index: number): string {
  return `${index + 1}. ${s.name} — ${SECTION_LIBRARY[s.kind].layout(s)}`
}

export function sectionMobileLine(s: TemplateSection): string {
  return `${s.name}: ${SECTION_LIBRARY[s.kind].mobile(s).replace(/^No celular: /, '')}`
}

interface SpecInput {
  summary: string
  behavior?: string[]
  responsive?: string[]
  notes?: string[]
  measurements?: Record<string, string>
}

/**
 * Monta a especificação técnica de um template a partir das seções (ordem, composição e
 * comportamento no celular de cada uma) e dos textos específicos do template.
 */
export function buildSpec(sections: TemplateSection[], input: SpecInput, layout: 'stack' | 'dashboard' | 'docs' = 'stack'): ItemSpec {
  const kindBehaviors = new Map<string, string>()
  for (const s of sections) {
    const b = SECTION_LIBRARY[s.kind].behavior?.(s)
    if (b && !kindBehaviors.has(b)) kindBehaviors.set(b, `${s.name}: ${b}`)
  }
  const base =
    layout === 'dashboard'
      ? ['Layout de aplicação: sidebar fixa à esquerda e área de conteúdo com rolagem própria; nada de rolagem horizontal da página.']
      : layout === 'docs'
        ? ['Layout de documentação em 3 colunas (navegação · artigo · índice), cada lateral com rolagem independente e posição sticky.']
        : ['Seções empilhadas em largura total; conteúdo centralizado com largura máxima ≈1120 px e respiro lateral de 48 px.']
  return {
    summary: input.summary,
    structure: [...base, ...sections.map(sectionLayoutLine)],
    behavior: [...(input.behavior ?? []), ...kindBehaviors.values()],
    responsive: [
      'Breakpoints sugeridos: ≤ 767 px (celular, uma coluna), 768–1023 px (tablet, 2 colunas onde houver grade) e ≥ 1024 px (desktop).',
      ...sections.map(sectionMobileLine),
      ...(input.responsive ?? []),
      'Nenhuma seção pode causar rolagem horizontal da página entre 320 e 1920 px; áreas de toque com no mínimo 44 × 44 px.',
    ],
    measurements: {
      larguraDoConteudo: layout === 'stack' ? '≈1120 px' : 'fluida',
      respiroVerticalDasSecoes: '≈88 px no desktop / 56 px no celular',
      margemLateral: '≈48 px no desktop / 20 px no celular',
      ...(input.measurements ?? {}),
    },
    notes: input.notes ?? [],
  }
}
