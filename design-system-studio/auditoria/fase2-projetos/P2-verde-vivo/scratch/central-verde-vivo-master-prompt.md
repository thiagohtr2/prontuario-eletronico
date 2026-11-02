# Master Prompt — Verde Vivo

> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 18:38:53.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.

## A. Informações do projeto

- Nome: Verde Vivo
- Tipo de aplicação: Loja ou catálogo
- Objetivo: Loja de plantas online: apresentar a marca e vender plantas pelo catálogo
- Descrição: Loja de plantas "Verde Vivo" com landing page, catálogo de produtos em cards, busca, filtros, header com navegação e navegação mobile. Design com inspiração botânica e identidade visual apropriada para uma loja de plantas.
- Funcionalidades previstas: Landing page; Catálogo de produtos; Header com navegação; Cards de produtos; Busca; Filtros; Navegação mobile
- Tecnologia desejada: HTML + CSS + JavaScript

## B. Arquitetura geral

- Fluxo de entrada: **Landing page sem login** — Só a página de apresentação. Não existe área restrita.
- Landing: Folha Viva · Login: nenhum · Cadastro: nenhum
- Layout desktop: Navegação superior de duas linhas · Layout mobile: Header fixo com busca e menu inferior flutuante

### Landing page: Folha Viva — Plantas

`id: folha-viva` · origem: módulo “landing”

Landing assimétrica de floricultura com título serifado deslocado, imagem alta à direita, cartões escalonados e citação recuada.

**Estrutura**
- Ordem das seções: Header leve → Hero assimétrico (título deslocado + imagem alta + imagem sobreposta) → Cartões escalonados → Citação recuada → Texto + imagem sangrando → Chamada final alinhada à esquerda → Rodapé.
- Header: logotipo “Folha Viva”, navegação com “Plantas”, “Vasos”, “Cuidados”, “Ateliê” e CTA “Escolher minha planta”.
- Uma palavra do título (“transformam”) em itálico na cor de destaque.
- Imagem alta de planta em vaso à direita e imagem menor de folhas sobreposta à base do bloco de texto.
- CTA do hero em formato de link com seta (“Escolher minha planta →”), não botão cheio.
- Grade de 12 colunas usada de forma deliberadamente desalinhada: título nas colunas 1–8 e imagem alta nas colunas 9–12, começando ≈80 px abaixo do topo do título.
- Texto de apoio recuado (colunas 2–6) e uma segunda imagem menor sobreposta à divisa entre os blocos.
- Cartões em 3 colunas escalonados verticalmente (deslocamentos de 0, 48 e 96 px).
- Citação recuada em ≈25% da largura com o autor alinhado à direita.
- Bloco de texto estreito + imagem larga que sangra até a borda direita da página.

**Propriedades**
- arquitetura: assimetrica
- secoes: Header leve → Hero assimétrico (título deslocado + imagem alta + imagem sobreposta) → Cartões escalonados → Citação recuada → Texto + imagem sangrando → Chamada final alinhada à esquerda → Rodapé

**Medidas recomendadas (adaptáveis)**
- grade: 12 colunas, gap ≈24 px
- deslocamentoImagemHero: ≈80 px
- alturaImagemHero: ≈440 px (desktop) / 320 px (celular)
- escalonamentoCartoes: 0 / 48 / 96 px

**Comportamento e estados**
- Os deslocamentos são apenas visuais: a ordem do HTML segue a ordem de leitura de cima para baixo.
- Imagens com leve parallax opcional, desativado com prefers-reduced-motion.

**Responsividade deste item**
- No celular a imagem alta ocupa a largura menos 40 px de recuo à esquerda; a imagem menor fica abaixo, recuada à direita.
- No celular a grade vira uma coluna, mas mantém a assimetria com recuos alternados de 24–40 px à esquerda ou à direita.
- Os deslocamentos verticais dos cartões são removidos abaixo de 768 px para não criar buracos.
- A imagem sobreposta perde a sobreposição e passa a ficar abaixo do texto, com recuo lateral.
- Navegação em hambúrguer abaixo de 768 px.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.

**Observações**
- Demonstração original: fundo #f4f1e8, texto #1f2a1d, primária #2f6b3a, destaque #d9a441; títulos em Fraunces. Por padrão a landing herda a paleta global do projeto.
- Marca, textos e números são fictícios: substitua pelo conteúdo real mantendo a hierarquia e a composição.
- Ilustrações da demonstração são placeholders vetoriais; use imagens reais otimizadas com texto alternativo.

### Layout desktop: Navegação superior de duas linhas — Sem sidebar

`id: topbar-duas-linhas` · origem: módulo “desktop”

Header de duas linhas: linha principal (logo, busca, conta, carrinho) + linha de categorias; conteúdo em largura máxima.

**Estrutura**
- grid-template-rows: 64px 44px minmax(0, 1fr); ambas as linhas em largura total com conteúdo limitado a ≈1280 px.
- Linha 1 (≈64 px): logo, campo de busca largo (flex: 1, até ≈640 px), conta, favoritos e carrinho com contador.
- Linha 2 (≈44 px): categorias em linha com espaçamento uniforme; cada categoria pode abrir um mega menu de largura total.
- Separação entre as linhas por borda fina ou leve diferença de superfície.

**Propriedades**
- gridColumns: 1fr
- gridRows: 64px 44px 1fr
- gridAreas: "header" "nav" "content"
- gap: 0px
- padding: 0px
- regioes: header (header), nav (submenu), content (content)
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- header: ≈64 px
- submenu: ≈44 px
- contentMax: ≈1280 px
- linhaDeCategorias: ≈44 px

**Comportamento e estados**
- Ao rolar para baixo, a linha 2 recolhe e a linha 1 permanece sticky; ao rolar para cima, a linha 2 reaparece (com prefers-reduced-motion respeitado).
- Mega menu abre em hover com atraso de ≈150 ms e por clique/teclado; fecha com Esc.

**Responsividade deste item**
- 1280 px ou mais: as duas linhas completas.
- 1024–1279 px: categorias excedentes vão para “Mais categorias”.
- 768–1023 px: a linha de categorias vira faixa horizontal rolável (overflow-x: auto, sem barra visível) com indicação de continuidade.
- Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria.

**Observações**
- One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem.
- As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida.

### Layout mobile: Header fixo com busca e menu inferior flutuante — Layouts híbridos

`id: header-busca-menu-flutuante` · origem: módulo “mobile”

Header fixo com busca, faixa horizontal de categorias e menu inferior flutuante arredondado.

**Estrutura**
- Header fixo de ≈104 px: linha de marca (≈52 px) com logo e ações + campo de busca de ≈44 px em largura total. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera.
- Faixa de categorias de ≈52 px abaixo do header: pílulas com ícone + rótulo, rolagem horizontal com scroll-snap; categoria ativa destacada.
- Menu inferior flutuante de ≈64 px, margens de 16 px, raio de 22 px, com 4 destinos.
- O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido.

**Propriedades**
- topo: topbar-search
- inferior: dock
- lateral: none
- sobreposicao: none
- stories: sim
- oneScreen: não

**Medidas recomendadas (adaptáveis)**
- header: ≈104 px
- categorias: ≈52 px
- menuInferior: ≈64 px

**Comportamento e estados**
- O campo de busca abre a tela de busca com teclado e sugestões; fonte de 16 px para não haver zoom no iOS.
- Tocar em uma categoria filtra o conteúdo sem mover a faixa (sem scrollIntoView brusco).
- Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current="page".

**Responsividade deste item**
- 320–359 px: pílulas com rótulo de até 10 caracteres.
- Horizontal: a faixa de categorias recolhe ao rolar; header + menu ≤ 25% da altura.
- A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- Identidade própria: não reproduza a aparência de nenhum aplicativo existente.
- Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos.

### Relação entre desktop e celular
- No computador, use “Navegação superior de duas linhas”. No celular, use “Header fixo com busca e menu inferior flutuante”. São decisões independentes: não derive uma da outra.
- Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile.
- As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões.

## C. Navegação

### Header: Mega Empório — Busca larga + faixa de departamentos

`id: mega-emporio` · origem: módulo “navegacao”

Header de e-commerce com faixa de anúncio, busca larga central, mega menu de departamentos, endereço de entrega, conta e carrinho.

**Estrutura**
- Barra principal com 64 px de altura, largura total da janela (full width), padding horizontal de 24–32 px.
- Superfície: fundo sólido na cor de navegação (token navBg), sem borda inferior.
- Logo: símbolo quadrado de 28 px na cor primária + nome da marca em peso 700 (marca fictícia “Empório Murici” na prévia — substitua pela marca real).
- Navegação principal com 5 itens (Departamentos ▾ mega menu, Ofertas, Mercado, Casa, Eletrônicos): links de texto simples; o ativo usa a cor de texto principal e peso 600, os demais textMuted; espaço entre itens de 20–24 px.
- Busca larga (flex: 1, até 560 px, 42 px de altura) como elemento central do header, com botão de lupa integrado.
- Ações: seletor de endereço de entrega; avatar circular de 32 px com menu de perfil; sacola/carrinho com contador.
- Faixa de anúncio de 36 px acima do header, fundo primary e texto onPrimary: “Frete grátis acima de R$ 199 · Parcele em até 10x”, com link e botão ✕ para dispensar.
- Disposição conforme a composição escolhida (ver “composicao”): A “Busca larga + faixa de departamentos” = duas faixas: logo, busca e ações na primeira; navegação alinhada à esquerda na segunda; B “Departamentos ao lado do logo” = busca larga no centro como protagonista; navegação recolhida em um botão de menu ao lado do logo.

**Propriedades**
- flutuante: não
- fixo: sim
- composicao: Busca larga + faixa de departamentos: Linha 1: logo, busca larga ao centro, endereço de entrega, conta e carrinho. Linha 2: “Departamentos” (abre o mega menu) seguido de atalhos de categorias.

**Medidas recomendadas (adaptáveis)**
- altura (desktop): 64 px
- altura (celular): 56 px
- padding horizontal: 24–32 px (16 px no celular)
- espaço entre itens: 20–24 px
- logo: ≈ 28 px de altura
- área de toque mínima: 44 × 44 px no celular
- faixa de anúncio: 36 px (32 px no celular)
- mega menu: até 760 px de largura, 3 colunas + destaque

**Comportamento e estados**
- Mega menu: painel de até 760 px (nunca mais largo que a viewport − 16 px) ancorado abaixo do header, com 3 colunas de links agrupados sob títulos em caixa alta e um cartão de destaque com chamada; abre ao clicar, fecha com Esc ou clique fora; o foco vai para o primeiro link.
- Item ativo: links de texto simples; o ativo usa a cor de texto principal e peso 600, os demais textMuted. Hover com transição de 120 ms; foco visível com anel de 2 px na cor focusRing.
- Fixo no topo: position: sticky; top: 0; z-index: 40. Após 8 px de rolagem ganha sombra suave.
- Busca larga: ao focar mostra um painel de sugestões e buscas recentes com a mesma largura do campo, logo abaixo dele.
- Perfil: o avatar abre um menu com nome e e-mail, “Meu perfil”, “Configurações”, “Ajuda” e “Sair”, alinhado à borda direita.
- Carrinho: contador em bolinha accent; o clique leva à sacola (ou abre um minicarrinho lateral).

**Responsividade deste item**
- Desktop largo (≥ 1280 px): composição completa, como na prévia.
- De 1024 a 1279 px: itens além do 4º vão para um menu “Mais ▾”.
- De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo, a busca e a ação principal.
- Abaixo de 768 px: barra única de 56 px com logo, carrinho com contador, avatar, botão de menu ☰ (44 × 44 px). Vão para o painel do menu: os 5 itens de navegação.
- Painel do menu: desliza logo abaixo do header em largura total, altura máxima calc(100dvh − 56 px) com rolagem interna; submenus e mega menus viram acordeões; trava a rolagem do corpo e fecha com ✕, Esc, toque fora ou ao escolher um item.
- Popovers (perfil, notificações, menus) são reposicionados para caber na viewport: largura máxima calc(100vw − 16 px), alinhados à borda mais próxima; nenhum overflow horizontal de 320 a 1920 px.
- A faixa de anúncio continua no celular com 32 px e uma única linha (reticências), mantendo o botão ✕ com área de toque de 44 px.
- No celular a busca larga vira uma segunda linha de 48 px logo abaixo da barra, sempre visível (não vira ícone).
- Continua fixo no celular; recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima para ganhar área útil.
- Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis.
- Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet.

**Observações**
- Todas as cores vêm dos tokens da identidade global (navBg, navText, navActive, primary, border…); nada de cores fixas.
- Use <header> com <nav aria-label="Principal"> e lista de links; o item da página atual recebe aria-current="page".

- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current="page"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.

## D. Identidade visual

Paleta global: **Floresta**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.

| Grupo | Token | Nome | Valor |
| --- | --- | --- | --- |
| Marca | Cor primária | `primary` | #2d6a4f |
| Marca | Primária — hover | `primaryHover` | #295f47 |
| Marca | Primária — active | `primaryActive` | #24553f |
| Marca | Texto sobre primária | `onPrimary` | #ffffff |
| Marca | Primária suave | `primarySoft` | #e6edea |
| Marca | Cor secundária | `secondary` | #40916c |
| Marca | Texto sobre secundária | `onSecondary` | #111114 |
| Marca | Cor de destaque | `accent` | #b07d4f |
| Marca | Texto sobre destaque | `onAccent` | #111114 |
| Fundos e superfícies | Fundo principal | `bg` | #f6faf6 |
| Fundos e superfícies | Fundo secundário | `bgAlt` | #edf1ed |
| Fundos e superfícies | Superfície | `surface` | #ffffff |
| Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 |
| Texto | Texto principal | `text` | #1b2e24 |
| Texto | Texto secundário | `textMuted` | #616d66 |
| Texto | Texto desabilitado | `textDisabled` | #a3aca6 |
| Texto | Placeholder | `placeholder` | #89948d |
| Bordas e foco | Borda | `border` | #e6e6e6 |
| Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 |
| Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #2d6a4f |
| Estados | Hover | `hover` | #f4f4f4 |
| Estados | Active | `active` | #ebebeb |
| Estados | Pressed | `pressed` | #e0e0e0 |
| Estados | Selected — fundo | `selected` | #e6edea |
| Estados | Selected — texto | `selectedText` | #2d6a4f |
| Estados | Disabled — fundo | `disabled` | #f0f0f0 |
| Estados | Disabled — texto | `disabledText` | #98a19c |
| Semânticos | Success | `success` | #117e39 |
| Semânticos | Success — fundo | `successBg` | #e3f4e9 |
| Semânticos | Warning | `warning` | #a85c04 |
| Semânticos | Warning — fundo | `warningBg` | #faefe1 |
| Semânticos | Error | `error` | #dc2626 |
| Semânticos | Error — fundo | `errorBg` | #fbe5e5 |
| Semânticos | Info | `info` | #2563eb |
| Semânticos | Info — fundo | `infoBg` | #e5ecfd |
| Links, ícones e navegação | Link | `link` | #2d6a4f |
| Links, ícones e navegação | Link — hover | `linkHover` | #265a43 |
| Links, ícones e navegação | Ícones | `icon` | #526159 |
| Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff |
| Links, ícones e navegação | Navegação — texto | `navText` | #4d5c54 |
| Links, ícones e navegação | Navegação — item ativo | `navActive` | #e6edea |
| Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #2d6a4f |
| Gradiente | Gradiente — início | `gradientFrom` | #2d6a4f |
| Gradiente | Gradiente — fim | `gradientTo` | #b88a61 |

### Tipografia: Fraunces + Inter

`id: identity.typography` · origem: módulo “cores”

Títulos em Fraunces (peso 650) e textos em Inter (peso 400), tamanho base 15 px.

**Estrutura**
- Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.

**Propriedades**
- fonteTitulos: Fraunces
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

3 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras.

### Componente: Card de produto do catálogo — Soft Pill

`id: cards` · origem: módulo “componentes”

Cards na família visual Soft Pill. Cartão de conteúdo com mídia, etiqueta, título, texto, metadados e ação. Estilo: Controles em formato de pílula (raio total), superfícies sem borda com sombra difusa e preenchimentos tonais derivados da cor primária.

**Estrutura**
- Mídia (aspect-ratio 16/9) → etiqueta → título → texto (até 3 linhas) → rodapé com meta e ação.
- O cartão inteiro pode ser clicável (link estendido) sem aninhar botões.
- Botões, campos, chips e abas com raio total (999 px); contêineres com raio de 22 px.
- Campos tonais: fundo na superfície alternativa, sem borda; o foco acende um anel na cor de foco.
- Ícones dentro de círculos suaves (primária suave) com traço de 2 px.
- Item ativo marcado por pílula preenchida em primária suave.
- Composição: Blocos arredondados flutuando sobre fundo levemente tingido; agrupamentos por proximidade, sem linhas divisórias.
- Acabamento: Sombras difusas e baixas; preenchimentos tonais; zero bordas.

**Propriedades**
- Família visual: 1. Soft Pill
- Título: Nome da planta
- Texto: Descrição curta da planta, porte e cuidados. Preço.
- Etiqueta: Novo
- Botão: Ver produto
- Ícone: Folha (lucide: Leaf)
- Layout: Vertical
- Mostrar imagem/ilustração: sim
- Mostrar rodapé: sim
- Raio dos controles: pílula (999 px)
- Raio dos contêineres: 22 px
- Borda: sem borda
- Sombra: sombra difusa e baixa
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 650
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 42 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: pill

**Cores**
- Ação principal (fundo): #2d6a4f
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #1b2e24
- Texto secundário: #616d66
- Borda: #e6e6e6
- Destaque: #b07d4f
- Foco: #2d6a4f

**Medidas recomendadas (adaptáveis)**
- alturaDeControle: 42 px
- raio: pílula
- paddingInterno: 15 px

**Comportamento e estados**
- Hover conforme a família (elevação, borda ou deslocamento); foco visível no link principal.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover escurece levemente o preenchimento; active reduz a escala para 0,98.
- Transições de 160 ms com easing suave.
- Movimento: Suave (160 ms), leve redução de escala ao pressionar.

**Responsividade deste item**
- Altura definida pelo conteúdo; grade de cards reduz colunas (3 → 2 → 1); horizontal vira vertical no celular.
- No celular, pílulas mantêm altura mínima de 44 px e chips quebram em múltiplas linhas em vez de rolar.
- Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Card de produto do catálogo”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Busca de produtos (plantas) — Soft Pill

`id: campos-busca` · origem: módulo “componentes”

Campos de busca na família visual Soft Pill. Campo de busca com ícone à esquerda, atalho de teclado e painel de sugestões. Estilo: Controles em formato de pílula (raio total), superfícies sem borda com sombra difusa e preenchimentos tonais derivados da cor primária.

**Estrutura**
- Ícone de lupa à esquerda, campo, atalho/limpar à direita.
- Painel de sugestões abaixo com grupos (Recentes, Sugestões) e item ativo destacado.
- Usar role="combobox" com aria-expanded e listbox de resultados.
- Botões, campos, chips e abas com raio total (999 px); contêineres com raio de 22 px.
- Campos tonais: fundo na superfície alternativa, sem borda; o foco acende um anel na cor de foco.
- Ícones dentro de círculos suaves (primária suave) com traço de 2 px.
- Item ativo marcado por pílula preenchida em primária suave.
- Composição: Blocos arredondados flutuando sobre fundo levemente tingido; agrupamentos por proximidade, sem linhas divisórias.
- Acabamento: Sombras difusas e baixas; preenchimentos tonais; zero bordas.

**Propriedades**
- Família visual: 1. Soft Pill
- Texto de exemplo (placeholder): Buscar plantas…
- Ícone: Buscar (lucide: Search)
- Mostrar atalho de teclado (⌘K): sim
- Mostrar sugestões abertas: sim
- Botão de limpar: não
- Tamanho: Médio
- Buscando (carregando): não
- Raio dos controles: pílula (999 px)
- Raio dos contêineres: 22 px
- Borda: sem borda
- Sombra: sombra difusa e baixa
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 650
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 42 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: pill

**Cores**
- Ação principal (fundo): #2d6a4f
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #1b2e24
- Texto secundário: #616d66
- Borda: #e6e6e6
- Destaque: #b07d4f
- Foco: #2d6a4f

**Medidas recomendadas (adaptáveis)**
- altura: 40–44 px
- larguraMinima: 220 px
- alturaDeControle: 42 px
- raio: pílula
- paddingInterno: 15 px

**Comportamento e estados**
- Atalho ⌘K/Ctrl+K foca o campo; Esc limpa ou fecha; setas navegam nas sugestões e Enter abre.
- Debounce de 200–300 ms ao digitar; estado de carregando com spinner no lugar da lupa.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover escurece levemente o preenchimento; active reduz a escala para 0,98.
- Transições de 160 ms com easing suave.
- Movimento: Suave (160 ms), leve redução de escala ao pressionar.

**Responsividade deste item**
- No celular, a busca pode expandir para tela cheia ao focar; fonte de 16 px; atalho de teclado oculto.
- No celular, pílulas mantêm altura mínima de 44 px e chips quebram em múltiplas linhas em vez de rolar.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Busca de produtos (plantas)”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

### Componente: Painel de filtros do catálogo — Soft Pill

`id: drawers` · origem: módulo “componentes”

Drawers na família visual Soft Pill. Painel deslizante modal com cabeçalho, conteúdo rolável e rodapé de ações fixo. Estilo: Controles em formato de pílula (raio total), superfícies sem borda com sombra difusa e preenchimentos tonais derivados da cor primária.

**Estrutura**
- Overlay + painel ancorado à borda; cabeçalho (título + fechar), corpo rolável, rodapé fixo.
- role="dialog" aria-modal="true".
- Botões, campos, chips e abas com raio total (999 px); contêineres com raio de 22 px.
- Campos tonais: fundo na superfície alternativa, sem borda; o foco acende um anel na cor de foco.
- Ícones dentro de círculos suaves (primária suave) com traço de 2 px.
- Item ativo marcado por pílula preenchida em primária suave.
- Composição: Blocos arredondados flutuando sobre fundo levemente tingido; agrupamentos por proximidade, sem linhas divisórias.
- Acabamento: Sombras difusas e baixas; preenchimentos tonais; zero bordas.

**Propriedades**
- Família visual: 1. Soft Pill
- Título: Filtros
- Botão principal: Aplicar filtros
- Lado: Direita
- Rodapé com ações: sim
- Escurecer o fundo: sim
- Raio dos controles: pílula (999 px)
- Raio dos contêineres: 22 px
- Borda: sem borda
- Sombra: sombra difusa e baixa
- Superfície: superfície = token surface
- Ação principal: primária sólida (primary) com texto onPrimary
- Fonte de títulos: Inter 650
- Fonte de texto: Inter
- Caixa de rótulos e botões: normal (sentence case)
- Tamanho base: 14 px
- Altura de controles: 42 px (mínimo 44 px de área de toque no celular)
- Densidade: confortável
- Ícones: lucide, traço 2 px, tratamento circle
- Indicador de ativo: pill

**Cores**
- Ação principal (fundo): #2d6a4f
- Ação principal (texto): #ffffff
- Superfície: #ffffff
- Texto: #1b2e24
- Texto secundário: #616d66
- Borda: #e6e6e6
- Destaque: #b07d4f
- Foco: #2d6a4f

**Medidas recomendadas (adaptáveis)**
- largura: 360–420 px
- alturaDeControle: 42 px
- raio: pílula
- paddingInterno: 15 px

**Comportamento e estados**
- Abre com animação de 200–250 ms; Esc, clique no overlay e botão fechar fecham; foco preso e devolvido ao gatilho.
- Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros.
- Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível.
- Active: Primária — active (primaryActive).
- Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled.
- Hover escurece levemente o preenchimento; active reduz a escala para 0,98.
- Transições de 160 ms com easing suave.
- Movimento: Suave (160 ms), leve redução de escala ao pressionar.

**Responsividade deste item**
- No celular, largura de até 88vw (lateral) ou bottom sheet com altura máxima de 90dvh e alça de arraste.
- No celular, pílulas mantêm altura mínima de 44 px e chips quebram em múltiplas linhas em vez de rolar.
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.

**Observações**
- As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades).
- Nome dado pelo usuário: “Painel de filtros do catálogo”.
- Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.

## Referências visuais aprovadas

### Inspiração visual: Verdant Atelier — Original

`id: verdant-atelier` · origem: módulo “inspiracao”

Site de loja-ateliê de plantas com composição editorial botânica: serifa expressiva em corpo grande, molduras em arco, ilustrações vetoriais de espécies e muito espaço em branco. Usar como referência de identidade e composição — conceito “Verdant Atelier” (plantas e botânica), paleta “Original”.

**Estrutura**
- Composição dominante: Editorial botânico assimétrico, com molduras em arco e muito respiro.
- Seções, nesta ordem: 1. Faixa de aviso; 2. Header com logo central e navegação dividida; 3. Hero editorial assimétrico com moldura em arco; 4. Coleção da estação (vitrine de 4 espécies); 5. Ensaio do diário com citação e capitular; 6. Guia de cuidados em quatro gestos; 7. Chamada para oficinas; 8. Footer invertido com newsletter.
- Tipografia: títulos em Fraunces ('Fraunces Variable', Fraunces, Georgia, serif); textos em Inter ('Inter Variable', Inter, system-ui, sans-serif).
- Cores: fundo #f3eee3, superfície #faf7f0, texto #1d2a1e, texto secundário #5e6a5a, destaque #2e5e3e com texto #ffffff, apoio #c9a27e.
- Faixa de aviso fina no topo (cor de destaque, texto centralizado de 12–13 px).
- Header em três colunas: navegação à esquerda (Plantas, Vasos, Oficinas), logotipo central em serifa itálica com “ATELIER” em versalete espaçado, e à direita Diário, busca e sacola com contador; linha fina inferior.
- Hero em grade 7/5: à esquerda sobretítulo com traço, título serifado de ~96 px com a palavra final em itálico na cor de destaque, parágrafo de até 470 px, CTA em pílula + link sublinhado, e três indicadores separados por linhas verticais finas; à direita moldura em arco (raio superior = metade da largura) com ilustração grande da planta, selo circular com texto em curva sobreposto à borda e legenda “Fig. 01” em itálico.
- Coleção da estação: título serifado + link “Ver todas” alinhados pela base; grade de 4 cartões com topo em arco, ilustração da espécie, etiqueta de cuidado em pílula, nome científico em itálico, preço e nome popular.
- Ensaio do diário: duas colunas separadas por fio vertical — citação grande em serifa itálica com autoria; texto com capitular colorida e link de leitura.
- Guia de cuidados em fundo de superfície: título + 4 colunas numeradas (01–04) com fio superior, ícone de linha, título serifado e descrição curta.
- Chamada para oficinas em bloco de cor de destaque: título grande, texto, botão em pílula com cores invertidas e ilustração de terrário à direita.
- Footer com fundo na cor do texto (invertido): marca, newsletter com campo sublinhado, três colunas de links e linha legal.

**Propriedades**
- conceito: Verdant Atelier
- segmento: Plantas e botânica
- composicao: Editorial botânico assimétrico, com molduras em arco e muito respiro
- paleta: Original
- ajustesDeCor: nenhum
- fonteTitulos: Fraunces
- fonteTexto: Inter
- secoes: 8
- contrasteTextoFundo: 12.9:1

**Cores**
- fundo: #f3eee3
- superficie: #faf7f0
- texto: #1d2a1e
- textoSecundario: #5e6a5a
- destaque: #2e5e3e
- textoSobreDestaque: #ffffff
- apoio: #c9a27e

**Medidas recomendadas (adaptáveis)**
- conteúdo máximo: 1200 px
- header: 88 px (desktop) / 64 px (celular)
- título do hero: ≈96 px / 46 px
- moldura do hero: ≈460 × 580 px
- respiro entre seções: 96–112 px / 48–56 px

**Comportamento e estados**
- Hover discreto: links ganham sublinhado; cartões da coleção elevam a ilustração 4 px e mostram “Adicionar à sacola”. Sem animações chamativas.
- Selo circular pode girar lentamente (20 s por volta) — respeitar prefers-reduced-motion.
- CTA principal único por seção; CTA secundário sempre como link sublinhado.
- Imagens/ilustrações entram com fade de 300 ms ao rolar, sem deslocamentos grandes.

**Responsividade deste item**
- Header no celular: hambúrguer à esquerda, logotipo central menor (24 px), sacola à direita; a navegação vai para um drawer.
- Hero no celular: a moldura em arco vem primeiro (≈380 px de altura), depois título de ~46 px, texto e CTAs empilhados em largura total.
- Indicadores do hero continuam em 3 colunas, com números menores.
- Coleção passa a 2 colunas (cartões com arco menor); em telas < 340 px, 1 coluna.
- Ensaio: citação e texto empilhados, sem o fio vertical.
- Guia de cuidados em grade 2×2.
- Oficinas: texto acima, ilustração do terrário abaixo, centralizada e menor.
- Footer: colunas empilhadas; newsletter em largura total.

**Observações**
- Ilustrações botânicas vetoriais simples (folhas, vasos), nunca fotos de banco genéricas.
- Referência de identidade e composição: não copiar marcas, logotipos, textos ou imagens de terceiros — criar conteúdo original para o projeto.
- Adapte a identidade (paleta, tipografia, composição e ritmo) ao conteúdo real do projeto; os textos e a marca do conceito são apenas ilustrativos.

### Template: E-commerce de moda — Linho & Cia — Lojas e imóveis

`id: ecommerce-moda` · origem: módulo “templates”

Home de loja de moda: header de e-commerce com faixa de aviso, campanha em imagem, benefícios de compra, categorias, vitrine de mais vendidos, história da marca e newsletter. Com personalizações do usuário em cores, fontes ou cantos (veja exceções). Partes priorizadas pelo usuário: Cabeçalho, Categorias, Vitrine.

**Estrutura**
- Ordem das seções (8): 1. Cabeçalho · 2. Campanha · 3. Benefícios de compra · 4. Categorias · 5. Vitrine · 6. Nossa origem · 7. Newsletter · 8. Rodapé.
- Seções empilhadas em largura total; conteúdo centralizado com largura máxima ≈1120 px e respiro lateral de 48 px.
- 1. Cabeçalho — Faixa de aviso no topo + header de loja com logo, categorias, campo de busca e ícones de conta, favoritos e sacola com contador.
- 2. Campanha — Hero de largura total com imagem de fundo e gradiente escuro para legibilidade; texto alinhado à esquerda, na parte inferior. Altura ≈620 px.
- 3. Benefícios de compra — Faixa compacta com 4 benefícios lado a lado (ícone + título + texto curto).
- 4. Categorias — 4 blocos de categoria com imagem e nome sobreposto, em 4 colunas.
- 5. Vitrine — Vitrine com 8 produtos em 4 colunas: foto 4:5, selo, nome, preço (com parcelamento) e amostras de cor; filtros/ordenar no topo.
- 6. Nossa origem — 1 linhas alternadas de imagem e texto (zigue-zague), cada uma com título, parágrafo e lista curta de pontos.
- 7. Newsletter — Faixa de inscrição: título e texto curto à esquerda; campo de e-mail e botão na mesma linha à direita; aviso de privacidade abaixo.
- 8. Rodapé — Rodapé com marca e descrição curta à esquerda e 3–4 colunas de links; barra inferior com direitos e links legais.
- Partes selecionadas pelo usuário para edição/geração (priorize-as e detalhe-as primeiro): 3 de 8.
- ★ Cabeçalho (Cabeçalho · store): Faixa de aviso no topo + header de loja com logo, categorias, campo de busca e ícones de conta, favoritos e sacola com contador.
- ★ Categorias (Galeria · categories): 4 blocos de categoria com imagem e nome sobreposto, em 4 colunas.
- ★ Vitrine (Vitrine de produtos): Vitrine com 8 produtos em 4 colunas: foto 4:5, selo, nome, preço (com parcelamento) e amostras de cor; filtros/ordenar no topo.

**Propriedades**
- template: ecommerce-moda
- marcaDeExemplo: Linho & Cia
- modoDeCor: claro
- fonteTitulos: Fraunces
- fonteTexto: Inter
- cantos: Médios (8 px)
- raioSelos: 6px
- raioBotoesECampos: 8px
- raioCartoesEImagens: 12px
- composicao: seções empilhadas
- ordemDasSecoes: Cabeçalho → Campanha → Benefícios de compra → Categorias → Vitrine → Nossa origem → Newsletter → Rodapé
- partesSelecionadas: Cabeçalho, Categorias, Vitrine

**Cores**
- primaria: #2d6a4f
- textoSobrePrimaria: #ffffff
- primariaSuave: #e2ece5
- fundo: #f6faf6
- superficie: #ecf1ed
- texto: #1b2e24
- textoSecundario: #5d6963
- borda: #dee4df

**Medidas recomendadas (adaptáveis)**
- larguraDoConteudo: ≈1120 px
- respiroVerticalDasSecoes: ≈88 px no desktop / 56 px no celular
- margemLateral: ≈48 px no desktop / 20 px no celular
- raios: selos 6 px · botões/campos 8 px · cartões 12 px

**Comportamento e estados**
- Ícone da sacola mostra contador e abre um minicarrinho lateral (drawer) ao adicionar produto.
- Busca com sugestões enquanto digita (produtos e categorias).
- Cabeçalho: Header fixo (sticky) no topo; ganha borda inferior ou fundo sólido após 8 px de rolagem. Link da página atual com indicador visível.
- Categorias: Clique em uma imagem abre visualização ampliada (lightbox) com navegação por setas e Esc para fechar.
- Vitrine: Hover no produto mostra segunda foto e botão “Adicionar”; no toque, o botão fica sempre visível.

**Responsividade deste item**
- Breakpoints sugeridos: ≤ 599 px (celular, uma coluna), 600–1023 px (tablet, 2 colunas onde houver grade) e ≥ 1024 px (desktop).
- Cabeçalho: logo à esquerda; busca, sacola e menu (hambúrguer) à direita; categorias vão para o drawer. A faixa de aviso fica em uma linha com texto truncado.
- Campanha: altura ≈520 px (use svh), título ≈34 px, botões em largura total.
- Benefícios de compra: benefícios em 2 colunas (ícone acima do texto), sem rolagem horizontal.
- Categorias: 2 colunas; o mosaico mantém alturas variadas.
- Vitrine: 2 colunas compactas; filtros viram botão “Filtrar” que abre um painel inferior (bottom sheet).
- Nossa origem: cada linha vira imagem em cima e texto embaixo, sempre na mesma ordem (sem alternância).
- Newsletter: texto em cima; campo e botão empilhados em largura total.
- Rodapé: colunas de links em grade de 2 colunas; barra inferior empilhada.
- Nenhuma seção pode causar rolagem horizontal da página entre 320 e 1920 px; áreas de toque com no mínimo 44 × 44 px.

**Exceções**
- Cor principal alterada pelo usuário: #2d6a4f (padrão do template: #9f1239).
- Fundo alterada pelo usuário: #f6faf6 (padrão do template: #ffffff).
- Texto alterada pelo usuário: #1b2e24 (padrão do template: #141414).
- Cantos alterados: Médios (8 px) (padrão: Quadrados (0 px)).

**Observações**
- Fotos de produto em proporção 4:5, fundo neutro e consistente em toda a vitrine.
- Use as cores finais acima como tokens (--color-primary, --color-bg, --color-text, --color-surface, --color-muted, --color-border) e as fontes Fraunces (títulos) e Inter (textos).
- Conteúdo e marca (“Linho & Cia”) são fictícios: substitua pelos textos e imagens reais do projeto mantendo a estrutura.
- As ilustrações da prévia representam fotos/imagens: use imagens reais otimizadas (WebP/AVIF, lazy-loading, texto alternativo).

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

## Decisões de prioridade

- Duas fontes de cor: paleta global e inspiração aprovada: Use os tokens da paleta global “Floresta”. Da inspiração “Verdant Atelier”, aproveite composição, tipografia e atmosfera, não as cores.
