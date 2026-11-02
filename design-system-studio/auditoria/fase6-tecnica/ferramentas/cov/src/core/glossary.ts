/** Explicações curtas para quem não conhece termos de design. */
export const GLOSSARY = {
  header: { term: 'Header', text: 'Barra localizada na parte superior do site, geralmente com logo, menu e ações.' },
  sidebar: { term: 'Sidebar', text: 'Menu ou painel de navegação na lateral da tela.' },
  rail: { term: 'Rail', text: 'Menu lateral bem estreito, só com ícones. Ao passar o mouse ou clicar, pode mostrar os nomes.' },
  drawer: { term: 'Drawer', text: 'Menu que fica escondido e desliza para dentro da tela quando a pessoa toca em um botão.' },
  bottomNav: { term: 'Bottom Navigation', text: 'Menu fixo na parte de baixo do celular, com 3 a 5 ícones dos destinos principais.' },
  dock: { term: 'Dock flutuante', text: 'Menu afastado das bordas, como uma ilha, geralmente com cantos bem arredondados.' },
  bottomSheet: { term: 'Bottom Sheet', text: 'Painel que sobe da parte de baixo da tela com opções extras.' },
  hero: { term: 'Hero', text: 'A primeira seção de destaque de uma página, com o título principal e a chamada para ação.' },
  cta: { term: 'CTA', text: 'Chamada para ação: o botão principal que convida a pessoa a fazer algo, como “Começar agora”.' },
  oneScreen: { term: 'One Screen', text: 'Interface desenhada para caber inteira em uma única tela, sem rolar a página.' },
  onePage: { term: 'One Page', text: 'Site com todo o conteúdo em uma única página, que pode ter rolagem vertical.' },
  breakpoint: { term: 'Breakpoint', text: 'Largura de tela a partir da qual a interface muda sua organização.' },
  grid: { term: 'Grid', text: 'Grade invisível de colunas que organiza e alinha os elementos da página.' },
  token: { term: 'Token', text: 'Nome de uma decisão visual reutilizável, como “cor primária” ou “raio médio”.' },
  inspector: { term: 'Inspector', text: 'Painel lateral que mostra detalhes ou propriedades do item selecionado.' },
  masterDetail: { term: 'Master-detail', text: 'Lista de itens de um lado e detalhes do item escolhido do outro.' },
  kanban: { term: 'Kanban', text: 'Quadro com colunas (ex.: A fazer, Fazendo, Feito) e cartões que se movem entre elas.' },
  safeArea: { term: 'Safe area', text: 'Margens que evitam o entalhe da câmera e a barra de gestos dos celulares.' },
  stories: { term: 'Stories', text: 'Faixa horizontal de círculos ou cartões no topo, para destaques ou categorias.' },
  topbar: { term: 'Topbar', text: 'Barra superior do aplicativo, com título, busca ou ações.' },
  megaMenu: { term: 'Mega menu', text: 'Menu suspenso grande que mostra várias colunas de links de uma vez.' },
  breadcrumb: { term: 'Breadcrumbs', text: 'Trilha que mostra onde você está: Início › Produtos › Detalhe.' },
} as const

export type GlossaryKey = keyof typeof GLOSSARY
