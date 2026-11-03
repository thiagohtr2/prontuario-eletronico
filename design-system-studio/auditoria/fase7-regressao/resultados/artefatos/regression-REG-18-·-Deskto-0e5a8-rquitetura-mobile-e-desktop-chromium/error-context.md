# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-18 · Desktop e celular compatíveis >> Master Prompt define um único ponto de troca entre arquitetura mobile e desktop
- Location: tests/e2e/regression.spec.ts:931:3

# Error details

```
Error: larguras de troca citadas no prompt

expect(received).toHaveLength(expected)

Expected length: 1
Received length: 2
Received array:  [768, 600]
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - link "Pular para o conteúdo" [ref=f2e4] [cursor=pointer]:
    - /url: "#conteudo"
  - banner [ref=f2e5]:
    - link "Atelier UI — início" [ref=f2e6] [cursor=pointer]:
      - /url: "#/"
      - generic [ref=f2e12]:
        - generic [ref=f2e13]: Atelier UI
        - generic [ref=f2e14]: Design System Studio
    - group "Modo de utilização" [ref=f2e16]:
      - button "Guiado" [pressed] [ref=f2e17] [cursor=pointer]
      - button "Livre" [ref=f2e21] [cursor=pointer]
    - button "Buscar funcionalidades (Ctrl+K)" [ref=f2e25] [cursor=pointer]:
      - generic [ref=f2e29]: Buscar funcionalidades
      - generic [ref=f2e30]: Ctrl K
    - generic "Progresso do esqueleto" [ref=f2e31]: Esqueleto 0/5
    - button "Exportar e importar" [ref=f2e33] [cursor=pointer]
    - button "Abrir Master Prompt" [ref=f2e37] [cursor=pointer]:
      - generic [ref=f2e43]: Master Prompt
  - generic [ref=f2e44]:
    - complementary "Navegação do Studio" [ref=f2e45]:
      - generic [ref=f2e46]:
        - list [ref=f2e47]:
          - listitem [ref=f2e48]:
            - link "Início" [ref=f2e49] [cursor=pointer]:
              - /url: "#/"
        - generic [ref=f2e54]:
          - button "Construtor guiado" [expanded] [ref=f2e55] [cursor=pointer]
          - list [ref=f2e58]:
            - listitem [ref=f2e59]:
              - link "Objetivo do projeto" [ref=f2e60] [cursor=pointer]:
                - /url: "#/guiado/objetivo"
                - generic [aria-hidden] [ref=f2e61]: "1"
            - listitem [ref=f2e63]:
              - link "Landing, login e cadastro" [ref=f2e64] [cursor=pointer]:
                - /url: "#/guiado/entrada"
                - generic [aria-hidden] [ref=f2e65]: "2"
            - listitem [ref=f2e67]:
              - link "Arquitetura do computador" [ref=f2e68] [cursor=pointer]:
                - /url: "#/guiado/desktop"
                - generic [aria-hidden] [ref=f2e69]: "3"
            - listitem [ref=f2e71]:
              - link "Arquitetura do celular" [ref=f2e72] [cursor=pointer]:
                - /url: "#/guiado/mobile"
                - generic [aria-hidden] [ref=f2e73]: "4"
            - listitem [ref=f2e75]:
              - link "Revisão do esqueleto" [ref=f2e76] [cursor=pointer]:
                - /url: "#/guiado/revisao"
                - generic [aria-hidden] [ref=f2e77]: "5"
            - listitem [ref=f2e79]:
              - link "Prévia integrada" [ref=f2e80] [cursor=pointer]:
                - /url: "#/guiado/preview"
                - generic [aria-hidden] [ref=f2e81]: "6"
            - listitem [ref=f2e83]:
              - link "Identidade visual" [ref=f2e84] [cursor=pointer]:
                - /url: "#/guiado/identidade"
                - generic [aria-hidden] [ref=f2e85]: "7"
            - listitem [ref=f2e87]:
              - link "Headers e sidebars" [ref=f2e88] [cursor=pointer]:
                - /url: "#/guiado/navegacao"
                - generic [aria-hidden] [ref=f2e89]: "8"
            - listitem [ref=f2e91]:
              - link "Componentes" [ref=f2e92] [cursor=pointer]:
                - /url: "#/guiado/componentes"
                - generic [aria-hidden] [ref=f2e93]: "9"
            - listitem [ref=f2e95]:
              - link "Master Prompt" [ref=f2e96] [cursor=pointer]:
                - /url: "#/guiado/entrega"
                - generic [aria-hidden] [ref=f2e97]: "10"
        - generic [ref=f2e99]:
          - button "Estrutura" [expanded] [ref=f2e100] [cursor=pointer]
          - list [ref=f2e103]:
            - listitem [ref=f2e104]:
              - link "Objetivo do projeto" [ref=f2e105] [cursor=pointer]:
                - /url: "#/modulos/objetivo"
            - listitem [ref=f2e111]:
              - link "Landing pages" [ref=f2e112] [cursor=pointer]:
                - /url: "#/modulos/landing"
            - listitem [ref=f2e118]:
              - link "Login" [ref=f2e119] [cursor=pointer]:
                - /url: "#/modulos/login"
            - listitem [ref=f2e124]:
              - link "Cadastro" [ref=f2e125] [cursor=pointer]:
                - /url: "#/modulos/cadastro"
            - listitem [ref=f2e130]:
              - link "Layout desktop" [ref=f2e131] [cursor=pointer]:
                - /url: "#/modulos/desktop"
            - listitem [ref=f2e135]:
              - link "Layout mobile" [ref=f2e136] [cursor=pointer]:
                - /url: "#/modulos/mobile"
            - listitem [ref=f2e140]:
              - link "Live Site Preview" [ref=f2e141] [cursor=pointer]:
                - /url: "#/modulos/preview"
        - generic [ref=f2e146]:
          - button "Identidade" [expanded] [ref=f2e147] [cursor=pointer]
          - list [ref=f2e150]:
            - listitem [ref=f2e151]:
              - link "Color System" [ref=f2e152] [cursor=pointer]:
                - /url: "#/modulos/cores"
            - listitem [ref=f2e160]:
              - link "Navigation Showcase" [ref=f2e161] [cursor=pointer]:
                - /url: "#/modulos/navegacao"
            - listitem [ref=f2e165]:
              - link "Componentes" [ref=f2e166] [cursor=pointer]:
                - /url: "#/modulos/componentes"
        - generic [ref=f2e171]:
          - button "Inspiração" [expanded] [ref=f2e172] [cursor=pointer]
          - list [ref=f2e175]:
            - listitem [ref=f2e176]:
              - link "Inspiration Gallery" [ref=f2e177] [cursor=pointer]:
                - /url: "#/modulos/inspiracao"
            - listitem [ref=f2e181]:
              - link "Template Studio" [ref=f2e182] [cursor=pointer]:
                - /url: "#/modulos/templates"
        - generic [ref=f2e186]:
          - button "Entrega" [expanded] [ref=f2e187] [cursor=pointer]
          - list [ref=f2e190]:
            - listitem [ref=f2e191]:
              - link "Central de Prompts" [ref=f2e192] [cursor=pointer]:
                - /url: "#/prompt"
            - listitem [ref=f2e199]:
              - link "Exportar e importar" [ref=f2e200] [cursor=pointer]:
                - /url: "#/exportar"
        - generic [ref=f2e205]:
          - button "Ferramentas" [expanded] [ref=f2e206] [cursor=pointer]
          - list [ref=f2e209]:
            - listitem [ref=f2e210]:
              - link "Validação responsiva" [ref=f2e211] [cursor=pointer]:
                - /url: "#/validacao"
            - listitem [ref=f2e220]:
              - link "Projeto e versões" [ref=f2e221] [cursor=pointer]:
                - /url: "#/projeto"
      - generic [ref=f2e234]:
        - generic [ref=f2e235]: Projeto Regressão
        - generic [ref=f2e236]: Salvo automaticamente neste navegador
    - main [ref=f2e239]:
      - navigation "Você está em" [ref=f2e240]:
        - list [ref=f2e241]:
          - listitem [ref=f2e242]:
            - link "Início" [ref=f2e243] [cursor=pointer]:
              - /url: "#/"
          - listitem [ref=f2e244]:
            - text: ›
            - link "Entrega" [ref=f2e245] [cursor=pointer]:
              - /url: "#/livre"
          - listitem [ref=f2e246]: ›Central de Prompts
      - generic [ref=f2e247]:
        - generic [ref=f2e249]:
          - generic [ref=f2e250]: Entrega
          - heading "Central de Prompts" [level=1] [ref=f2e251]
          - paragraph [ref=f2e252]: Tudo o que você aprovou, reunido em uma especificação única. Copie o Master Prompt para a IA, gere prompts individuais por elemento e decida a prioridade quando houver escolhas incompatíveis.
        - generic [ref=f2e253]:
          - generic [ref=f2e254]:
            - generic [ref=f2e255]:
              - strong [ref=f2e256]: "5"
              - generic [ref=f2e257]: itens no Master Prompt
            - generic [ref=f2e258]:
              - strong [ref=f2e259]: "0"
              - generic [ref=f2e260]: retirados (seleção mantida)
            - generic [ref=f2e261]:
              - strong [ref=f2e262]: "0"
              - generic [ref=f2e263]: contradições a decidir
            - generic [ref=f2e264]:
              - strong [ref=f2e265]: "2"
              - generic [ref=f2e266]: decisões pendentes
          - generic [ref=f2e271]:
            - strong [ref=f2e272]: "Pendências:"
            - list [ref=f2e273]:
              - listitem [ref=f2e274]:
                - link "Defina o tipo de projeto." [ref=f2e275] [cursor=pointer]:
                  - /url: "#/guiado/objetivo"
              - listitem [ref=f2e276]:
                - link "Escolha como as pessoas entram no site (landing, login, direto…)." [ref=f2e277] [cursor=pointer]:
                  - /url: "#/guiado/entrada"
          - tablist "Partes da Central de Prompts" [ref=f2e278]:
            - tab "Master Prompt" [selected] [ref=f2e279] [cursor=pointer]
            - tab "Itens (5)" [ref=f2e280] [cursor=pointer]
            - tab "Contradições (0)" [ref=f2e281] [cursor=pointer]
            - tab "Especificação JSON" [ref=f2e282] [cursor=pointer]
          - generic [ref=f2e283]:
            - generic [ref=f2e284]:
              - button "Copiar Master Prompt" [ref=f2e285] [cursor=pointer]
              - button "Baixar .md" [ref=f2e289] [cursor=pointer]
              - generic [ref=f2e293]: 16.295 caracteres · gerado a partir da especificação JSON
            - generic [ref=f2e294]: "# Master Prompt — Projeto Regressão > Especificação gerada pelo Atelier UI (Design System Studio) em 03/11/2026, 00:06:14. > Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração. ## A. Informações do projeto - Nome: Projeto Regressão - Tipo de aplicação: Não definido ## B. Arquitetura geral - Fluxo de entrada: não definido. - Landing: nenhuma · Login: nenhum · Cadastro: nenhum - Layout desktop: Sidebar integral clássica · Layout mobile: Bottom Navigation clássica ### Layout desktop: Sidebar integral clássica — Sidebar integral `id: sidebar-integral-classica` · origem: módulo “desktop” Shell de aplicação com sidebar integral à esquerda (do topo à base) e coluna principal com header fixo e conteúdo rolável. **Estrutura** - Grid de duas colunas: grid-template-columns: 252px minmax(0, 1fr); a coluna principal tem grid-template-rows: 64px minmax(0, 1fr) (header + conteúdo). - Sidebar integral de ≈252 px na borda esquerda: vai do topo à base da janela (height: 100dvh), encostada na borda, sem margem externa, sem cantos arredondados e sem sombra flutuante. - Topo da sidebar com a mesma altura do header (≈64 px), contendo logo e nome do produto, alinhado ao header para formar uma linha horizontal contínua. - Itens de navegação com 40–44 px de altura, ícone de 20 px + rótulo, agrupados por seções com título discreto; o item ativo tem fundo de seleção, cor de texto ativa e indicador lateral. - Rodapé da sidebar com perfil do usuário e atalho de configurações, separado por borda fina. - Header de ≈64 px: título da página ou breadcrumb à esquerda; busca, notificações e avatar à direita; borda inferior fina de 1 px. O header fica somente sobre a coluna principal — não passa por cima da sidebar. - Área de conteúdo com padding de 24–32 px, largura fluida e grids internos com minmax(0, 1fr); nenhum cartão encolhe abaixo de ≈280 px — reduza colunas antes. **Propriedades** - gridColumns: 252px 1fr - gridRows: 64px 1fr - gridAreas: \"sidebar header\" \"sidebar content\" - gap: 0px - padding: 0px - regioes: sidebar (sidebar), header (header), content (content) - oneScreen: não **Medidas recomendadas (adaptáveis)** - sidebar: ≈252 px - header: ≈64 px **Comportamento e estados** - A sidebar é fixa (position: sticky; top: 0; height: 100dvh) e tem rolagem interna própria (overflow-y: auto; overscroll-behavior: contain) quando os itens não cabem; a página rola apenas na coluna de conteúdo. - O header é sticky (position: sticky; top: 0) acima do conteúdo e não rola com ele; z-index superior ao conteúdo e inferior a modais. - Grupos de navegação podem recolher (accordion) e lembram o estado; hover, focus-visible e item ativo são visualmente distintos. **Responsividade deste item** - 1280 px ou mais: sidebar esquerda com ≈252 px e rótulos completos. - 1024–1279 px: a sidebar reduz para ≈220 px; o conteúdo reduz colunas antes de comprimir cartões ou tabelas. - 768–1023 px: a sidebar recolhe para um rail integral de ≈72 px (só ícones, com tooltip e aria-label); um botão expande a sidebar completa em sobreposição, com scrim, Esc e clique fora para fechar. - Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio: não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria. **Observações** - Sidebar integral: nunca flutuante, sem margem externa e sem cantos arredondados. - One Page, não One Screen: a página pode rolar verticalmente; não force o conteúdo a caber em 100dvh nem esconda seções para evitar rolagem. - As medidas são recomendações para 1280 × 800; adapte à tela e ao conteúdo preservando a estrutura escolhida. ### Layout mobile: Bottom Navigation clássica — Navegação inferior `id: bottom-nav-classica` · origem: módulo “mobile” Topbar simples e Bottom Navigation fixa com 4 destinos rotulados de largura igual. **Estrutura** - Topbar de ≈56 px com título da tela e uma ação à direita. A barra superior soma env(safe-area-inset-top) à própria altura, para não colidir com o entalhe da câmera. - Bottom Navigation fixa (position: fixed; bottom: 0) com 4 itens de largura igual: ícone de 24 px + rótulo de 12 px. Altura de ≈64 px + env(safe-area-inset-bottom); o fundo da barra se estende até a borda inferior, atrás da barra de gestos. - O conteúdo rola por baixo das barras fixas e recebe padding (topo e base) igual à altura delas, para que nada fique escondido. **Propriedades** - topo: topbar - inferior: bottom-nav - lateral: none - sobreposicao: none - stories: não - oneScreen: não **Medidas recomendadas (adaptáveis)** - topbar: ≈56 px - bottomNav: ≈64 px + safe area - item: ≥ 48 × 48 px **Comportamento e estados** - Item ativo identificável por cor primária, ícone preenchido e indicador (pílula ou ponto) — nunca apenas pela cor; aria-current=\"page\". - Tocar no destino ativo rola a tela daquele destino para o topo. - Cada destino preserva a própria posição de rolagem e pilha de navegação. - Destinos principais no terço inferior da tela, na zona de alcance do polegar. **Responsividade deste item** - 320–359 px: rótulos curtos (até ≈10 caracteres) e ícones de 22 px; a fonte nunca fica abaixo de 12 px. - Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura. - A partir de 768 px passa a valer a arquitetura desktop escolhida no Studio; não estique este layout para tablet ou computador. - Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho. **Observações** - Alvos de toque de no mínimo 44 × 44 px (48 px recomendado) e pelo menos 8 px entre alvos vizinhos. ### Relação entre desktop e celular - No computador, use “Sidebar integral clássica”. No celular, use “Bottom Navigation clássica”. São decisões independentes: não derive uma da outra. - Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile. - As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões. ## C. Navegação Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra. - Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current=\"page\"`). - Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora. - Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu. ## D. Identidade visual Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas. | Grupo | Token | Nome | Valor | | --- | --- | --- | --- | | Marca | Cor primária | `primary` | #18181b | | Marca | Primária — hover | `primaryHover` | #161618 | | Marca | Primária — active | `primaryActive` | #131316 | | Marca | Texto sobre primária | `onPrimary` | #ffffff | | Marca | Primária suave | `primarySoft` | #e3e3e4 | | Marca | Cor secundária | `secondary` | #52525b | | Marca | Texto sobre secundária | `onSecondary` | #ffffff | | Marca | Cor de destaque | `accent` | #2563eb | | Marca | Texto sobre destaque | `onAccent` | #ffffff | | Fundos e superfícies | Fundo principal | `bg` | #ffffff | | Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 | | Fundos e superfícies | Superfície | `surface` | #ffffff | | Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 | | Texto | Texto principal | `text` | #18181b | | Texto | Texto secundário | `textMuted` | #707072 | | Texto | Texto desabilitado | `textDisabled` | #a7a7a8 | | Texto | Placeholder | `placeholder` | #8c8c8d | | Bordas e foco | Borda | `border` | #e6e6e6 | | Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 | | Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b | | Estados | Hover | `hover` | #f4f4f4 | | Estados | Active | `active` | #ebebeb | | Estados | Pressed | `pressed` | #e0e0e0 | | Estados | Selected — fundo | `selected` | #e3e3e4 | | Estados | Selected — texto | `selectedText` | #18181b | | Estados | Disabled — fundo | `disabled` | #f0f0f0 | | Estados | Disabled — texto | `disabledText` | #979798 | | Semânticos | Success | `success` | #117e39 | | Semânticos | Success — fundo | `successBg` | #e3f4e9 | | Semânticos | Warning | `warning` | #a85c04 | | Semânticos | Warning — fundo | `warningBg` | #faefe1 | | Semânticos | Error | `error` | #dc2626 | | Semânticos | Error — fundo | `errorBg` | #fbe5e5 | | Semânticos | Info | `info` | #2563eb | | Semânticos | Info — fundo | `infoBg` | #e5ecfd | | Links, ícones e navegação | Link | `link` | #18181b | | Links, ícones e navegação | Link — hover | `linkHover` | #141417 | | Links, ícones e navegação | Ícones | `icon` | #525254 | | Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff | | Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d | | Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 | | Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b | | Gradiente | Gradiente — início | `gradientFrom` | #18181b | | Gradiente | Gradiente — fim | `gradientTo` | #3b73ed | ### Tipografia: Inter + Inter `id: identity.typography` · origem: módulo “cores” Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px. **Estrutura** - Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px. - Altura de linha de 1.5 para textos e 1.2–1.3 para títulos. - Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px. **Propriedades** - fonteTitulos: Inter - fonteTexto: Inter - tamanhoBase: 15 - pesoTitulos: 650 - pesoTexto: 400 **Responsividade deste item** - Títulos grandes reduzem proporcionalmente no celular (use clamp()). - Inputs com 16 px no celular para evitar zoom automático. ### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas) `id: identity.geometry` · origem: módulo “cores” Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável. **Estrutura** - Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40. - Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação. - Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces). **Propriedades** - raioPequeno: 6px - raioMedio: 8px - raioGrande: 12px - borda: 1px - sombra: none - superficie: outlined - densidade: comfortable - unidadeDeEspaco: 8px - ícones: outline **Responsividade deste item** - A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque. ### Estados visuais - hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`. - focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado. - selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover. - Mensagens: success/warning/error/info com os fundos semânticos correspondentes. ## E. Componentes Nenhum componente foi personalizado na biblioteca. Crie os componentes necessários usando os tokens e a geometria da seção D. ## F. Responsividade Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias. Breakpoints de referência: - xs: Celulares pequenos (320–359 px) - sm: Celulares (360–599 px) - md: Tablets e celulares na horizontal (600–1023 px) - lg: Notebooks (1024–1439 px) - xl: Monitores grandes (1440 px ou mais) **Regras gerais** - Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias). - Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos). - Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto. - Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes. - Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS). - Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção. - Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível. - Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade. - Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores. - Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura. - Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia. - Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível. - Respeite `prefers-reduced-motion` reduzindo animações. **Regras por componente** - Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis. - Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria). - Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. - Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível). - Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada. - Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet. - Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores. - Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem. - Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente. - Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho. ## G. Regras de implementação - Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário. - Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas. - Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado. - Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra. - Evite overflow e colisões; valide em todas as larguras de referência. - Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected). - Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários. - Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código. - Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela. - Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir. ## Pendências Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra. - Defina o tipo de projeto. - Escolha como as pessoas entram no site (landing, login, direto…)."
  - status
```

# Test source

```ts
  839  |     await freshStart(page)
  840  |     await go(page, '/guiado/mobile')
  841  |     await page.evaluate(() => window.scrollTo(0, 2000))
  842  |     await page.waitForTimeout(300)
  843  |     const phone = (await page.getByTestId('phone-preview').first().boundingBox())!
  844  |     const footer = (await page.locator('.gd-footer').boundingBox())!
  845  |     expect(phone.y + phone.height, 'base do celular grande × topo do rodapé').toBeLessThanOrEqual(footer.y)
  846  |   })
  847  | 
  848  |   for (const [label, use] of [['desktop 1440×900', {}], ['celular 360×800', MOBILE]] as const) {
  849  |     test.describe(label, () => {
  850  |       test.use(use)
  851  |       test('guiado: ações principais de cada etapa podem ser trazidas acima do rodapé', async ({ page }) => {
  852  |         test.setTimeout(120_000)
  853  |         await seed(page, {
  854  |           meta: { projectType: 'saas' },
  855  |           entry: { flow: 'login-only', loginId: 'classico-central', signupId: 'mesma-tela' },
  856  |           layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' },
  857  |           guided: { skeletonApproved: true },
  858  |         })
  859  |         const checks: [string, Locator][] = [
  860  |           ['/guiado/entrega', page.getByRole('button', { name: /Copiar Master Prompt/ }).first()],
  861  |           ['/guiado/entrega', page.getByRole('button', { name: /Baixar \.md/ }).first()],
  862  |           ['/guiado/desktop', page.locator('[data-testid^="desktop-option-"]').last()],
  863  |           ['/guiado/mobile', page.locator('[data-testid^="mobile-option-"]').last()],
  864  |           ['/guiado/revisao', page.getByRole('link', { name: /Alterar/ }).last()],
  865  |         ]
  866  |         for (const [route, target] of checks) {
  867  |           await go(page, route)
  868  |           await target.scrollIntoViewIfNeeded()
  869  |           await target.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
  870  |           await page.waitForTimeout(250)
  871  |           const h = await hitInfo(target)
  872  |           expect(h.own, `${route}: alvo coberto por ${h.cover}`).toBe(true)
  873  |         }
  874  |       })
  875  |     })
  876  |   }
  877  | })
  878  | 
  879  | /** Elementos de cartões que ultrapassam a borda do cartão (sem contêiner que os recorte). */
  880  | async function cardOverflow(page: Page) {
  881  |   return page.evaluate(() => {
  882  |     const out: string[] = []
  883  |     for (const card of Array.from(document.querySelectorAll<HTMLElement>('.ui-option, .nvs-card'))) {
  884  |       const cr = card.getBoundingClientRect()
  885  |       if (!cr.width) continue
  886  |       for (const el of Array.from(card.querySelectorAll('*'))) {
  887  |         const r = el.getBoundingClientRect()
  888  |         if (!r.width || !r.height) continue
  889  |         let p = el.parentElement, clipped = false
  890  |         while (p && p !== card) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) { clipped = true; break } p = p.parentElement }
  891  |         if (!clipped && (r.right > cr.right + 1 || r.left < cr.left - 1)) { out.push(`${card.dataset.testid ?? card.className}: ${el.tagName.toLowerCase()} excede o cartão`); break }
  892  |       }
  893  |     }
  894  |     return out
  895  |   })
  896  | }
  897  | 
  898  | test.describe('REG-17 · Sem overflow nas galerias de layouts', () => {
  899  |   for (const w of [320, 360, 1024, 1440]) {
  900  |     test(`${w} px: página sem rolagem lateral e conteúdo dos cartões dentro do cartão`, async ({ page }) => {
  901  |       test.setTimeout(120_000)
  902  |       await page.setViewportSize({ width: w, height: 900 })
  903  |       await freshStart(page)
  904  |       for (const r of ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/navegacao', '/modulos/cores']) {
  905  |         await go(page, r)
  906  |         expect(await horizontalOverflow(page), r).toBeLessThanOrEqual(0)
  907  |         expect(await cardOverflow(page), r).toEqual([])
  908  |       }
  909  |     })
  910  |   }
  911  | 
  912  |   for (const [label, vp] of [['tablet 768×1024', { width: 768, height: 1024 }], ['celular deitado 800×360', { width: 800, height: 360 }]] as const) {
  913  |     test.describe(label, () => {
  914  |       test.use({ viewport: vp, hasTouch: true })
  915  |       test('galeria do celular: coluna de miniaturas com largura útil e nenhuma miniatura coberta', async ({ page }) => {
  916  |         test.fail(true, `REG-17: no modo "medium" (620–939 px úteis) a coluna de miniaturas colapsa para 0 px e as 44 miniaturas transbordam sob o celular grande ${VER}`)
  917  |         await freshStart(page)
  918  |         await go(page, '/modulos/mobile')
  919  |         const listW = await page.locator('.lay-mob-list').evaluate((e) => e.getBoundingClientRect().width)
  920  |         expect(listW, 'largura da coluna de miniaturas').toBeGreaterThanOrEqual(128)
  921  |         const covered = await page.locator('[data-testid^="mobile-option-"] .ui-option__hit').evaluateAll((hits) =>
  922  |           hits.filter((h) => { h.scrollIntoView({ block: 'center' }); const r = h.getBoundingClientRect(); const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !x || !h.contains(x) }).length,
  923  |         )
  924  |         expect(covered, 'miniaturas cobertas por outro elemento').toBe(0)
  925  |       })
  926  |     })
  927  |   }
  928  | })
  929  | 
  930  | test.describe('REG-18 · Desktop e celular compatíveis', () => {
  931  |   test('Master Prompt define um único ponto de troca entre arquitetura mobile e desktop', async ({ page }) => {
  932  |     test.fail(true, `REG-18: o prompt manda trocar para desktop a partir de 768 px e, em outra seção, usar desktop compactado a partir de 600 px ${VER}`)
  933  |     await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  934  |     const prompt = await masterPrompt(page)
  935  |     const cuts = new Set<number>()
  936  |     for (const m of prompt.matchAll(/A partir de (\d+) px passa a valer a arquitetura desktop/g)) cuts.add(Number(m[1]))
  937  |     for (const m of prompt.matchAll(/Abaixo de (\d+) px vale a arquitetura mobile/g)) cuts.add(Number(m[1]))
  938  |     for (const m of prompt.matchAll(/Entre (\d+) e \d+ px \(tablet\), use a estrutura desktop/g)) cuts.add(Number(m[1]))
> 939  |     expect([...cuts], 'larguras de troca citadas no prompt').toHaveLength(1)
       |                                                              ^ Error: larguras de troca citadas no prompt
  940  |   })
  941  | 
  942  |   test('as mesmas escolhas feitas no desktop e no celular geram o mesmo projeto e o mesmo prompt', async ({ browser, baseURL }) => {
  943  |     test.setTimeout(150_000)
  944  |     const build = async (opts: Parameters<typeof browser.newContext>[0]) => {
  945  |       const ctx = await browser.newContext({ baseURL, ...opts })
  946  |       const page = await ctx.newPage()
  947  |       await freshStart(page)
  948  |       await go(page, '/guiado/objetivo')
  949  |       await page.getByTestId('project-type-dashboard').click()
  950  |       await page.getByTestId('project-name').fill('Painel Solar')
  951  |       await go(page, '/guiado/entrada')
  952  |       await hitOf(page.getByTestId('entry-flow-login-only')).click()
  953  |       for (const [route, id] of [['/modulos/login', 'login-option-classico-central'], ['/modulos/desktop', 'desktop-option-sidebar-integral-classica'], ['/modulos/mobile', 'mobile-option-bottom-nav-classica'], ['/modulos/cores', 'palette-option-floresta']]) {
  954  |         await go(page, route)
  955  |         await page.getByTestId(id).scrollIntoViewIfNeeded()
  956  |         await hitOf(page.getByTestId(id)).click()
  957  |       }
  958  |       const p = await savedProject(page)
  959  |       const text = (await masterPrompt(page)).split('\n').filter((l) => !/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/.test(l)).join('\n')
  960  |       await ctx.close()
  961  |       return { entry: p.entry, layout: p.layout, identity: p.identity, meta: p.meta, text }
  962  |     }
  963  |     const desk = await build({ viewport: { width: 1440, height: 900 } })
  964  |     const mob = await build(MOBILE)
  965  |     expect(mob.entry).toEqual(desk.entry)
  966  |     expect(mob.layout).toEqual(desk.layout)
  967  |     expect(mob.identity).toEqual(desk.identity)
  968  |     expect(mob.text).toBe(desk.text)
  969  |   })
  970  | 
  971  |   test.describe('celular 360×800', () => {
  972  |     test.use(MOBILE)
  973  |     test('a prévia integrada abre no modo Celular quando a tela é de celular', async ({ page }) => {
  974  |       test.fail(true, `REG-18: no celular a prévia integrada abre em "Computador" (escala ~0,26, texto de 3–5 px) ${VER}`)
  975  |       await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  976  |       await go(page, '/modulos/preview')
  977  |       await expect(page.getByTestId('live-preview').getByTestId('phone-preview').first()).toBeVisible({ timeout: 3000 })
  978  |     })
  979  |   })
  980  | })
  981  | 
  982  | test.describe('REG-19 · Login e cadastro correspondem à seleção', () => {
  983  |   test('com "Apenas login" e sem cadastro escolhido, a prévia integrada não oferece a página "Cadastro"', async ({ page }) => {
  984  |     test.fail(true, `REG-19: a aba "Cadastro" aparece sempre que há login e mostra um "Crie sua conta" genérico sem cadastro escolhido ${VER}`)
  985  |     await seed(page, { entry: { flow: 'login-only', loginId: 'classico-central', signupId: null }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  986  |     await go(page, '/modulos/preview')
  987  |     const pages = page.getByRole('group', { name: 'Página da prévia' })
  988  |     await expect(pages.getByRole('button', { name: 'Login' })).toBeVisible()
  989  |     await expect(pages.getByRole('button', { name: 'Cadastro' })).toHaveCount(0)
  990  |   })
  991  | 
  992  |   test('com cadastro escolhido, a página "Cadastro" mostra o cadastro selecionado (proteção)', async ({ page }) => {
  993  |     await seed(page, { entry: { flow: 'login-only', loginId: 'classico-central', signupId: 'etapas' }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  994  |     await go(page, '/modulos/preview')
  995  |     await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' }).click()
  996  |     await expect(page.getByTestId('live-preview')).toContainText('Conta')
  997  |     await expect(page.getByTestId('live-preview')).toContainText('Perfil')
  998  |   })
  999  | })
  1000 | 
  1001 | test.describe('REG-20 · Alterar um módulo não quebra outro', () => {
  1002 |   test('trocar o fluxo para "Aplicação diretamente" tira o login antigo do prompt e da prévia', async ({ page }) => {
  1003 |     test.fail(true, `REG-20: o login escolhido antes continua no Master Prompt e na prévia depois de mudar o fluxo para "sem login" ${VER}`)
  1004 |     await freshStart(page)
  1005 |     await go(page, '/modulos/login')
  1006 |     await hitOf(page.locator('[data-testid^="login-option-"]').first()).click()
  1007 |     await go(page, '/guiado/entrada')
  1008 |     await hitOf(page.getByTestId('entry-flow-app-direct')).click()
  1009 |     await expect.poll(async () => (await savedProject(page)).entry.flow).toBe('app-direct')
  1010 |     const prompt = await masterPrompt(page)
  1011 |     expect(prompt).toContain('Aplicação diretamente')
  1012 |     expect(prompt).toMatch(/Login: nenhum/)
  1013 |     await go(page, '/modulos/preview')
  1014 |     await expect(page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Login' })).toHaveCount(0)
  1015 |   })
  1016 | 
  1017 |   test('mudanças em sequência em vários módulos mantêm as escolhas anteriores e todas as telas abrindo (proteção)', async ({ page }) => {
  1018 |     test.setTimeout(120_000)
  1019 |     const errors = trackErrors(page)
  1020 |     await freshStart(page)
  1021 |     await go(page, '/modulos/desktop')
  1022 |     await hitOf(page.getByTestId('desktop-option-sidebar-integral-classica')).click()
  1023 |     await go(page, '/modulos/mobile')
  1024 |     await hitOf(page.getByTestId('mobile-option-bottom-nav-classica')).click()
  1025 |     await go(page, '/modulos/cores')
  1026 |     await hitOf(page.getByTestId('palette-option-floresta')).click()
  1027 |     await go(page, '/modulos/navegacao')
  1028 |     await hitOf(page.locator('[data-testid^="header-option-"]').nth(1)).click()
  1029 |     await go(page, '/modulos/componentes')
  1030 |     await page.getByTestId('add-component-soft-pill').click()
  1031 |     await page.keyboard.press('Escape')
  1032 |     await go(page, '/modulos/templates')
  1033 |     await go(page, '/modulos/inspiracao')
  1034 |     const p = await savedProject(page)
  1035 |     expect(p.layout).toEqual({ desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' })
  1036 |     expect(p.identity.paletteId).toBe('floresta')
  1037 |     expect(p.navigation.header).not.toBeNull()
  1038 |     expect(p.components).toHaveLength(1)
  1039 |     for (const r of ['/modulos/preview', '/guiado/revisao', '/prompt', '/exportar', '/modulos/desktop', '/modulos/mobile']) {
```