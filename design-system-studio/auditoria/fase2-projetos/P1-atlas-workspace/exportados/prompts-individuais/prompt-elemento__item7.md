# Prompt — Sidebar: Clássica Integral

> Gerado pelo Atelier UI para o projeto “Atlas Workspace” (Aplicativo ou SaaS). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Sidebar: Clássica Integral — Logo, grupos e perfil

`id: classica-integral` · origem: módulo “navegacao”

Sidebar integral de 248 px com grupos titulados, ícones de linha, item ativo em pílula, colapso para trilho e perfil no rodapé.

**Estrutura**
- Formato integral: ocupa toda a altura, encostada na borda esquerda, com 248 px de largura.
- Superfície: fundo navBg com borda direita de 1 px (token border).
- Itens: “Geral”: Início, Painel, Projetos (12), Tarefas, Calendário | “Equipe”: Pessoas, Mensagens (3), Relatórios | “Conta”: Configurações, Ajuda.
- Ícones: ícones de linha de 18 px (estilo de ícone do tema) antes do rótulo; itens de 36 px de altura com padding horizontal de 12 px.
- Títulos de grupo: caixa alta de 11 px, peso 650, espaçamento 0,08em, em textMuted.
- Composição A: logo (símbolo + nome) no topo; bloco de perfil no rodapé (avatar, nome, cargo e menu ⋯ que abre para cima). Composição B: logo no topo e campo de busca logo abaixo; links secundários no rodapé (Configurações, Ajuda, Sair).

**Propriedades**
- formato: integral
- flutuante: não
- largura: ≈248 px
- composicao: Logo, grupos e perfil: Logo no topo com botão de recolher, grupos com títulos em caixa alta e o bloco de perfil fixo no rodapé.

**Medidas recomendadas (adaptáveis)**
- largura: 248 px
- altura dos itens: 36 px (44 px no celular)
- padding interno: 12 px
- ícones: 18–20 px
- raio dos itens: radiusMd do tema
- drawer no celular: min(85vw, 280 px)
- largura recolhida: 72 px

**Comportamento e estados**
- Item ativo: item ativo com fundo navActive e texto navActiveText em cantos radiusMd. Clique marca o item como ativo (aria-current="page"); hover com fundo hover; foco visível com anel focusRing de 2 px.
- Botão de recolher (aria-label “Recolher menu”/“Expandir menu”) alterna entre 248 e 72 px com transição de 180 ms em width; recolhida, os rótulos somem e aparecem como tooltip à direita no hover/foco. O estado é lembrado (localStorage).
- A busca filtra os itens enquanto a pessoa digita (sem diferenciar maiúsculas e acentos) e mostra “Nada encontrado” quando não há resultados.
- Menu do perfil abre para cima, dentro da altura da janela: Meu perfil, Preferências, Sair.
- Fixa: position: sticky; top: 0; height: 100dvh; a lista rola internamente (overflow-y: auto) quando não couber, mantendo topo e rodapé visíveis.

**Responsividade deste item**
- Desktop (≥ 1024 px): integral: ocupa toda a altura, encostada na borda esquerda, com 248 px de largura.
- De 768 a 1023 px: inicia recolhida em trilho de 72 px só com ícones; expande por cima do conteúdo (overlay com sombra) ao tocar no botão de menu.
- Abaixo de 768 px: sai do fluxo e vira um drawer à esquerda com largura min(85vw, 280 px), aberto por um botão ☰ (44 × 44 px) no header; scrim escuro atrás; fecha com ✕, Esc, toque no scrim ou ao escolher um item; trava a rolagem do corpo.
- No drawer os rótulos aparecem sempre (mesmo em modelos de trilho); itens com no mínimo 44 px de altura.
- Menus e tooltips da sidebar ficam dentro da viewport: reposicionados para cima quando faltaria espaço abaixo; nenhum overflow horizontal.
- O rodapé (perfil, medidor ou cartão) fica fixo na base do drawer; a lista rola acima dele.
- Se o app for usado principalmente no celular, ofereça também uma bottom navigation com os 4–5 destinos principais.
- Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Cores dos tokens da identidade global (navBg, navText, navActive, navActiveText, primary, border); nada de cores fixas.
- Use <nav aria-label="Menu lateral"> com listas; grupos com título usam aria-labelledby; o item atual recebe aria-current="page".

## Identidade herdada
- Paleta “Neutro Essencial” (clara): primária #18181b (texto #ffffff), secundária #52525b, destaque #2563eb.
- Fundo #ffffff, superfície #ffffff, texto #18181b, texto secundário #707072, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #e3e3e4/#18181b, disabled #f0f0f0/#979798, foco #18181b.
- Semânticos: success #117e39, warning #a85c04, error #dc2626, info #2563eb.
- Tipografia: títulos Inter 650, textos Inter 400, base 15 px.
- Geometria: cantos “medium”, borda 1 px, sombra “none”, superfícies “outlined”, densidade “comfortable”.

## Responsividade obrigatória
Valide em 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
- Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias).
- Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos).
- Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto.
- Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes.
- Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS).
- Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção.
- Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível.
- Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade.
- Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores.
- Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura.
- Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia.
- Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível.
- Respeite `prefers-reduced-motion` reduzindo animações.

## Regras de implementação
- Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.
- Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.
- Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.
- Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.
- Evite overflow e colisões; valide em todas as larguras de referência.
- Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).
- Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.
- Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.
- Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.
- Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.
