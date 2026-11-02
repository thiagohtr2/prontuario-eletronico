# Master Prompt — Centro Operacional

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:30:06.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Centro Operacional
- Tipo de aplicação: One Screen
- Objetivo: Sistema operacional One Screen para acompanhar dados operacionais e indicadores em uma única tela principal.
- Descrição: Interface de uma única tela principal com dados operacionais e indicadores, conteúdo organizado em colunas, sem rolagem vertical principal quando couber, adaptação para monitores grandes e comportamento móvel definido explicitamente.
- Funcionalidades previstas: Dados operacionais; Indicadores
- Tecnologia desejada: HTML + CSS + JavaScript

## B. Arquitetura geral

- Fluxo de entrada: **Aplicação diretamente** — O sistema abre direto na tela principal, sem apresentação nem login.
- Landing: nenhuma · Login: nenhum · Cadastro: nenhum
- Layout desktop: Painel operacional · Layout mobile: One Screen com painel em abas
- Experiência One Screen: a interface principal cabe em uma viewport, sem rolagem vertical principal; áreas internas rolam localmente e nada importante é escondido.

### Layout desktop: Painel operacional — One Screen

`id: one-screen-painel-operacional` · origem: módulo “desktop”

Painel operacional One Screen com grade de status, coluna de alertas com rolagem interna e barra de status fixa.

**Estrutura**
- O shell ocupa exatamente a viewport (height: 100dvh com fallback 100vh; overflow: hidden no body); as linhas do grid usam fr e minmax(0, 1fr) para dividir a altura disponível.
- grid-template-columns: minmax(0, 1fr) 304px; grid-template-rows: 52px minmax(0, 1fr) 32px.
- Grade central de blocos de status (filas, SLA, equipes) com cores semânticas acompanhadas de ícone e texto.
- Coluna de alertas de ≈304 px: lista cronológica com severidade; barra de status de ≈32 px com relógio, conexão e última atualização.

**Propriedades**
- gridColumns: 1fr 304px
- gridRows: 52px 1fr 32px
- gridAreas: "header header" "content panel" "footer footer"
- gap: 0px
- padding: 0px
- regioes: header (header), content (content), panel (panel), footer (footer)
- oneScreen: sim

**Medidas recomendadas (adaptáveis)**
- header: ≈52 px
- panel: ≈304 px
- footer: ≈32 px

**Comportamento e estados**
- Não há rolagem principal: cada painel com conteúdo variável rola internamente (overflow: auto; overscroll-behavior: contain), com indicação visual de que há mais conteúdo (sombra interna ou fade na borda).
- Conteúdo longo nunca é cortado nem escondido: listas usam rolagem interna ou paginação; textos quebram linha; números grandes usam clamp() para caber.
- Atualização em tempo real sem “pular” o layout: novos alertas entram no topo com animação discreta e aria-live="polite".

**Responsividade deste item**
- 1280 × 800 ou maior: grade + alertas visíveis.
- 1024–1279 px: alertas viram aba alternável com a grade.
- Altura útil menor que ≈640 px (notebook pequeno, janela reduzida ou zoom de 150–200%): o modo One Screen é desativado — o body volta a rolar e os painéis se empilham, sem esconder informação importante.
- Zoom do navegador até 200% e fonte ampliada do sistema: nenhum conteúdo some; prefira reorganizar (menos colunas) a reduzir a fonte.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Exceções**
- Observação do usuário: Requisito do cliente: adaptação para monitores grandes.

**Observações**
- One Screen ≠ One Page: aqui tudo deve caber na viewport sem rolagem da página; em One Page a página rola. Nunca use overflow: hidden para esconder conteúdo que não coube.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

### Layout mobile: One Screen com painel em abas — One Screen móvel

`id: one-screen-abas` · origem: módulo “mobile”

Tela One Screen com abas fixas no topo que alternam painéis dimensionados para caber na viewport.

**Estrutura**
- Topbar de ≈56 px + abas de ≈44 px. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Sem rolagem principal: a tela ocupa 100dvh (com fallback 100vh) e o conteúdo é dividido em blocos com grid de linhas em fr.
- Conteúdo variável rola dentro do próprio bloco (overflow: auto; overscroll-behavior: contain); nada importante é cortado ou escondido.
- Cada painel: um destaque principal no topo e uma grade de blocos menores ocupando o restante da altura.

**Propriedades**
- topo: topbar-tabs
- inferior: none
- lateral: none
- sobreposicao: none
- stories: não
- oneScreen: sim

**Medidas recomendadas (adaptáveis)**
- abas: ≈44 px

**Comportamento e estados**
- role="tablist" com aria-selected; setas ←/→ trocam de aba.
- A troca de aba não altera a altura da tela nem gera rolagem.

**Responsividade deste item**
- Altura útil menor que ≈560 px (celular pequeno, horizontal ou fonte ampliada): o modo One Screen é desativado e a tela volta a rolar, com os blocos empilhados.
- Fonte do sistema ampliada e zoom de até 200%: blocos reorganizam em menos colunas em vez de reduzir o texto.
- Horizontal: abas viram rail vertical à esquerda para economizar altura.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- One Screen ≠ One Page: aqui tudo cabe na tela sem rolar; nunca use overflow: hidden para esconder o que não coube.

### Relação entre desktop e celular
- No computador, use “Painel operacional”. No celular, use “One Screen com painel em abas”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra.

- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.

## D. Identidade visual

Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #18181b |
| Marca | Primária — hover | `primaryHover` | #161618 |
| Marca | Primária — active | `primaryActive` | #131316 |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #e3e3e4 |
| Marca | Cor secundária | `secondary` | #52525b |
| Marca | Texto sobre secundária | `onSecondary` | #ffffff |
| Marca | Cor de destaque | `accent` | #2563eb |
| Marca | Texto sobre destaque | `onAccent` | #ffffff |
| Fundos e superfícies | Fundo principal | `bg` | #ffffff |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #18181b |
| Texto | Texto secundário | `textMuted` | #707072 |
| Texto | Texto desabilitado | `textDisabled` | #a7a7a8 |
| Texto | Placeholder | `placeholder` | #8c8c8d |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #e3e3e4 |
| Estados | Selected — texto | `selectedText` | #18181b |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #979798 |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #18181b |
| Links, ícones e navegação | Link — hover | `linkHover` | #141417 |
| Links, ícones e navegação | Ícones | `icon` | #525254 |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff |
| Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b |
| Gradiente | Gradiente — início | `gradientFrom` | #18181b |
| Gradiente | Gradiente — fim | `gradientTo` | #3b73ed |

### Tipografia: Inter + Inter

`id: identity.typography` · origem: módulo “cores”

Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px.

**Estrutura**
- Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.

**Propriedades**
- fonteTitulos: Inter
- fonteTexto: Inter
- tamanhoBase: 15
- pesoTitulos: 650
- pesoTexto: 400

**Responsividade deste item**
- Títulos grandes reduzem proporcionalmente no celular (use clamp()).
- Inputs com 16 px no celular para evitar zoom automático.

### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas)

`id: identity.geometry` · origem: módulo “cores”

Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável.

**Estrutura**
- Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação.
- Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces).

**Propriedades**
- raioPequeno: 6px
- raioMedio: 8px
- raioGrande: 12px
- borda: 1px
- sombra: none
- superficie: outlined
- densidade: comfortable
- unidadeDeEspaco: 8px
- ícones: outline

**Responsividade deste item**
- A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque.

### Estados visuais
- hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`.
- focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado.
- selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover.
- Mensagens: success/warning/error/info com os fundos semânticos correspondentes.

## E. Componentes

2 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.

### Componente: Indicadores — Compact Pro

`id: kpis-stat-cards` · origem: módulo “componentes”

KPIs e stat cards na família visual Compact Pro. Cartão de indicador com rótulo, valor em destaque, variação colorida e mini gráfico de tendência. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Rótulo + ícone → valor grande (tabular-nums) → variação (seta + %) e comparativo → sparkline.
- Variação positiva em sucesso, negativa em erro, neutra em texto secundário.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Rótulo: Receita mensal
- Valor: R$ 48,2 mil
- Variação: +12,4%
- Comparativo: vs. mês anterior
- Ícone: Carteira (lucide: Wallet)
- Tendência: Alta (positiva)
- Mini gráfico: sim
- Raio dos controles: 4 px
- Raio dos contêineres: 6 px
- Borda: 1 px sólida (border)
- Sombra: sem sombra em superfícies de conteúdo
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 640
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 13 px
- Altura de controles: 30 px (mínimo 44 px de área de toque no celular)
- Densidade: compacta
- Ícones: lucide, traço 1.75 px, tratamento plain
- Indicador de ativo: underline

**Cores**
- Ação principal (fundo): #18181b
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #18181b
- Texto secundário: #707072
- Borda: #e6e6e6
- Destaque: #2563eb
- Foco: #18181b

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Tooltip no sparkline com valores; clique abre o relatório detalhado.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- Grade de KPIs: 4 → 2 → 1 colunas (ou 2 colunas compactas no celular); valor reduz com clamp() sem cortar.
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Indicadores”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Dados operacionais — Compact Pro

`id: tabelas` · origem: módulo “componentes”

Tabelas na família visual Compact Pro. Tabela de dados com cabeçalho, linhas com status em badge, valores alinhados à direita e ações por linha. Estilo: Alta densidade: controles de 30 px, texto base de 13 px, raio de 4 px, bordas de 1 px sutis, sem sombras e números tabulares.

**Estrutura**
- Título + ações da tabela → <table> semântica (<thead>, <th scope="col">) → linhas.
- Números alinhados à direita com tabular-nums; status como badge; ações no fim.
- Estados de carregando (skeleton), vazio e erro.
- Altura de controles 30 px (44 px de área de toque no celular); padding reduzido em 25%.
- Texto base 13 px, rótulos 12 px; números com font-variant-numeric: tabular-nums.
- Raio de 4 px em controles e 6 px em contêineres; bordas de 1 px sutis.
- Item ativo marcado por sublinhado de 2 px; ícones de 14–16 px sem fundo.
- Composição: Informação densa em linhas e colunas alinhadas; barras de ferramentas compactas.
- Acabamento: Neutro e funcional; cor apenas para estado e ação.

**Propriedades**
- Família visual: 13. Compact Pro
- Título: Pedidos recentes
- Colunas (uma por linha): Cliente | Status | Valor | Data
- Linhas de exemplo: 4
- Densidade: compacta
- Linhas zebradas: não
- Estilo do cabeçalho: Destacado
- Seleção com checkbox: sim
- Ações por linha: sim
- Raio dos controles: 4 px
- Raio dos contêineres: 6 px
- Borda: 1 px sólida (border)
- Sombra: sem sombra em superfícies de conteúdo
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 640
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 13 px
- Altura de controles: 30 px (mínimo 44 px de área de toque no celular)
- Ícones: lucide, traço 1.75 px, tratamento plain
- Indicador de ativo: underline

**Cores**
- Ação principal (fundo): #18181b
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #18181b
- Texto secundário: #707072
- Borda: #e6e6e6
- Destaque: #2563eb
- Foco: #18181b

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 30 px
- raio: 4 px / 6 px
- paddingInterno: 11 px

**Comportamento e estados**
- Hover na linha; seleção com checkbox no cabeçalho (todos/indeterminado); ordenação por clique no cabeçalho com aria-sort.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover com fundo de hover; atalhos de teclado visíveis.
- Foco com anel de 2 px.
- Movimento: Rápido (100 ms).

**Responsividade deste item**
- No celular: rolagem horizontal local dentro do contêiner (overflow-x: auto) com a primeira coluna fixa, ou representação em cartões (cada linha vira um cartão rótulo: valor).
- No celular, aumente as áreas de toque para 44 px sem aumentar a fonte além de 16 px nos campos; tabelas viram cartões.
- Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Dados operacionais”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

## F. Responsividade

Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias.

Breakpoints de referência:
- xs: Celulares pequenos (320–359 px)
- sm: Celulares (360–599 px)
- md: Tablets e celulares na horizontal (600–1023 px)
- lg: Notebooks (1024–1439 px)
- xl: Monitores grandes (1440 px ou mais)

**Regras gerais**
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

**Regras por componente**
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.
- Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada.
- Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet.
- Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

## G. Regras de implementação

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
