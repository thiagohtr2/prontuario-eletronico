# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-03 · Controles da identidade e dos componentes alteram a prévia >> densidade da tabela mostrada no editor ("Padrão") é a mesma do Master Prompt
- Location: tests/e2e/regression.spec.ts:284:3

# Error details

```
Error: densidade no prompt

expect(received).toBe(expected) // Object.is equality

Expected: "padrão"
Received: "confortável"
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Pular para o conteúdo" [ref=f1e4] [cursor=pointer]:
    - /url: "#conteudo"
  - banner [ref=f1e5]:
    - link "Atelier UI — início" [ref=f1e6] [cursor=pointer]:
      - /url: "#/"
      - generic [ref=f1e12]:
        - generic [ref=f1e13]: Atelier UI
        - generic [ref=f1e14]: Design System Studio
    - group "Modo de utilização" [ref=f1e16]:
      - button "Guiado" [pressed] [ref=f1e17] [cursor=pointer]
      - button "Livre" [ref=f1e21] [cursor=pointer]
    - button "Buscar funcionalidades (Ctrl+K)" [ref=f1e25] [cursor=pointer]:
      - generic [ref=f1e29]: Buscar funcionalidades
      - generic [ref=f1e30]: Ctrl K
    - generic "Progresso do esqueleto" [ref=f1e31]: Esqueleto 0/5
    - button "Exportar e importar" [ref=f1e33] [cursor=pointer]
    - button "Abrir Master Prompt" [ref=f1e37] [cursor=pointer]:
      - generic [ref=f1e43]: Master Prompt
  - generic [ref=f1e44]:
    - complementary "Navegação do Studio" [ref=f1e45]:
      - generic [ref=f1e46]:
        - list [ref=f1e47]:
          - listitem [ref=f1e48]:
            - link "Início" [ref=f1e49] [cursor=pointer]:
              - /url: "#/"
        - generic [ref=f1e54]:
          - button "Construtor guiado" [expanded] [ref=f1e55] [cursor=pointer]
          - list [ref=f1e58]:
            - listitem [ref=f1e59]:
              - link "Objetivo do projeto" [ref=f1e60] [cursor=pointer]:
                - /url: "#/guiado/objetivo"
                - generic [aria-hidden] [ref=f1e61]: "1"
            - listitem [ref=f1e63]:
              - link "Landing, login e cadastro" [ref=f1e64] [cursor=pointer]:
                - /url: "#/guiado/entrada"
                - generic [aria-hidden] [ref=f1e65]: "2"
            - listitem [ref=f1e67]:
              - link "Arquitetura do computador" [ref=f1e68] [cursor=pointer]:
                - /url: "#/guiado/desktop"
                - generic [aria-hidden] [ref=f1e69]: "3"
            - listitem [ref=f1e71]:
              - link "Arquitetura do celular" [ref=f1e72] [cursor=pointer]:
                - /url: "#/guiado/mobile"
                - generic [aria-hidden] [ref=f1e73]: "4"
            - listitem [ref=f1e75]:
              - link "Revisão do esqueleto" [ref=f1e76] [cursor=pointer]:
                - /url: "#/guiado/revisao"
                - generic [aria-hidden] [ref=f1e77]: "5"
            - listitem [ref=f1e79]:
              - link "Prévia integrada" [ref=f1e80] [cursor=pointer]:
                - /url: "#/guiado/preview"
                - generic [aria-hidden] [ref=f1e81]: "6"
            - listitem [ref=f1e83]:
              - link "Identidade visual" [ref=f1e84] [cursor=pointer]:
                - /url: "#/guiado/identidade"
                - generic [aria-hidden] [ref=f1e85]: "7"
            - listitem [ref=f1e87]:
              - link "Headers e sidebars" [ref=f1e88] [cursor=pointer]:
                - /url: "#/guiado/navegacao"
                - generic [aria-hidden] [ref=f1e89]: "8"
            - listitem [ref=f1e91]:
              - link "Componentes" [ref=f1e92] [cursor=pointer]:
                - /url: "#/guiado/componentes"
                - generic [aria-hidden] [ref=f1e93]: "9"
            - listitem [ref=f1e95]:
              - link "Master Prompt" [ref=f1e96] [cursor=pointer]:
                - /url: "#/guiado/entrega"
                - generic [aria-hidden] [ref=f1e97]: "10"
        - generic [ref=f1e99]:
          - button "Estrutura" [expanded] [ref=f1e100] [cursor=pointer]
          - list [ref=f1e103]:
            - listitem [ref=f1e104]:
              - link "Objetivo do projeto" [ref=f1e105] [cursor=pointer]:
                - /url: "#/modulos/objetivo"
            - listitem [ref=f1e111]:
              - link "Landing pages" [ref=f1e112] [cursor=pointer]:
                - /url: "#/modulos/landing"
            - listitem [ref=f1e118]:
              - link "Login" [ref=f1e119] [cursor=pointer]:
                - /url: "#/modulos/login"
            - listitem [ref=f1e124]:
              - link "Cadastro" [ref=f1e125] [cursor=pointer]:
                - /url: "#/modulos/cadastro"
            - listitem [ref=f1e130]:
              - link "Layout desktop" [ref=f1e131] [cursor=pointer]:
                - /url: "#/modulos/desktop"
            - listitem [ref=f1e135]:
              - link "Layout mobile" [ref=f1e136] [cursor=pointer]:
                - /url: "#/modulos/mobile"
            - listitem [ref=f1e140]:
              - link "Live Site Preview" [ref=f1e141] [cursor=pointer]:
                - /url: "#/modulos/preview"
        - generic [ref=f1e146]:
          - button "Identidade" [expanded] [ref=f1e147] [cursor=pointer]
          - list [ref=f1e150]:
            - listitem [ref=f1e151]:
              - link "Color System" [ref=f1e152] [cursor=pointer]:
                - /url: "#/modulos/cores"
            - listitem [ref=f1e160]:
              - link "Navigation Showcase" [ref=f1e161] [cursor=pointer]:
                - /url: "#/modulos/navegacao"
            - listitem [ref=f1e165]:
              - link "Componentes" [ref=f1e166] [cursor=pointer]:
                - /url: "#/modulos/componentes"
        - generic [ref=f1e171]:
          - button "Inspiração" [expanded] [ref=f1e172] [cursor=pointer]
          - list [ref=f1e175]:
            - listitem [ref=f1e176]:
              - link "Inspiration Gallery" [ref=f1e177] [cursor=pointer]:
                - /url: "#/modulos/inspiracao"
            - listitem [ref=f1e181]:
              - link "Template Studio" [ref=f1e182] [cursor=pointer]:
                - /url: "#/modulos/templates"
        - generic [ref=f1e186]:
          - button "Entrega" [expanded] [ref=f1e187] [cursor=pointer]
          - list [ref=f1e190]:
            - listitem [ref=f1e191]:
              - link "Central de Prompts" [ref=f1e192] [cursor=pointer]:
                - /url: "#/prompt"
            - listitem [ref=f1e199]:
              - link "Exportar e importar" [ref=f1e200] [cursor=pointer]:
                - /url: "#/exportar"
        - generic [ref=f1e205]:
          - button "Ferramentas" [expanded] [ref=f1e206] [cursor=pointer]
          - list [ref=f1e209]:
            - listitem [ref=f1e210]:
              - link "Validação responsiva" [ref=f1e211] [cursor=pointer]:
                - /url: "#/validacao"
            - listitem [ref=f1e220]:
              - link "Projeto e versões" [ref=f1e221] [cursor=pointer]:
                - /url: "#/projeto"
      - generic [ref=f1e234]:
        - generic [ref=f1e235]: Projeto sem nome
        - generic [ref=f1e236]: Salvo automaticamente neste navegador
    - main [ref=f1e239]:
      - navigation "Você está em" [ref=f1e240]:
        - list [ref=f1e241]:
          - listitem [ref=f1e242]:
            - link "Início" [ref=f1e243] [cursor=pointer]:
              - /url: "#/"
          - listitem [ref=f1e244]:
            - text: ›
            - link "Entrega" [ref=f1e245] [cursor=pointer]:
              - /url: "#/livre"
          - listitem [ref=f1e246]: ›Central de Prompts
      - generic [ref=f1e247]:
        - generic [ref=f1e249]:
          - generic [ref=f1e250]: Entrega
          - heading "Central de Prompts" [level=1] [ref=f1e251]
          - paragraph [ref=f1e252]: Tudo o que você aprovou, reunido em uma especificação única. Copie o Master Prompt para a IA, gere prompts individuais por elemento e decida a prioridade quando houver escolhas incompatíveis.
        - generic [ref=f1e253]:
          - generic [ref=f1e254]:
            - generic [ref=f1e255]:
              - strong [ref=f1e256]: "4"
              - generic [ref=f1e257]: itens no Master Prompt
            - generic [ref=f1e258]:
              - strong [ref=f1e259]: "0"
              - generic [ref=f1e260]: retirados (seleção mantida)
            - generic [ref=f1e261]:
              - strong [ref=f1e262]: "0"
              - generic [ref=f1e263]: contradições a decidir
            - generic [ref=f1e264]:
              - strong [ref=f1e265]: "5"
              - generic [ref=f1e266]: decisões pendentes
          - generic [ref=f1e271]:
            - strong [ref=f1e272]: "Pendências:"
            - list [ref=f1e273]:
              - listitem [ref=f1e274]:
                - link "Defina o tipo de projeto." [ref=f1e275] [cursor=pointer]:
                  - /url: "#/guiado/objetivo"
              - listitem [ref=f1e276]:
                - link "Dê um nome ao projeto." [ref=f1e277] [cursor=pointer]:
                  - /url: "#/guiado/objetivo"
              - listitem [ref=f1e278]:
                - link "Escolha como as pessoas entram no site (landing, login, direto…)." [ref=f1e279] [cursor=pointer]:
                  - /url: "#/guiado/entrada"
              - listitem [ref=f1e280]:
                - link "Escolha a arquitetura do computador." [ref=f1e281] [cursor=pointer]:
                  - /url: "#/modulos/desktop"
              - listitem [ref=f1e282]:
                - link "Escolha a arquitetura do celular." [ref=f1e283] [cursor=pointer]:
                  - /url: "#/modulos/mobile"
          - tablist "Partes da Central de Prompts" [ref=f1e284]:
            - tab "Master Prompt" [selected] [ref=f1e285] [cursor=pointer]
            - tab "Itens (4)" [ref=f1e286] [cursor=pointer]
            - tab "Contradições (0)" [ref=f1e287] [cursor=pointer]
            - tab "Especificação JSON" [ref=f1e288] [cursor=pointer]
          - generic [ref=f1e289]:
            - generic [ref=f1e290]:
              - button "Copiar Master Prompt" [ref=f1e291] [cursor=pointer]
              - button "Baixar .md" [ref=f1e295] [cursor=pointer]
              - generic [ref=f1e299]: 14.236 caracteres · gerado a partir da especificação JSON
            - generic [ref=f1e300]: "# Master Prompt — Projeto sem nome > Especificação gerada pelo Atelier UI (Design System Studio) em 03/11/2026, 00:04:56. > Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração. ## A. Informações do projeto - Nome: Projeto sem nome - Tipo de aplicação: Não definido ## B. Arquitetura geral - Fluxo de entrada: não definido. - Landing: nenhuma · Login: nenhum · Cadastro: nenhum - Layout desktop: não definido · Layout mobile: não definido ## C. Navegação Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra. - Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current=\"page\"`). - Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora. - Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu. ## D. Identidade visual Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas. | Grupo | Token | Nome | Valor | | --- | --- | --- | --- | | Marca | Cor primária | `primary` | #18181b | | Marca | Primária — hover | `primaryHover` | #161618 | | Marca | Primária — active | `primaryActive` | #131316 | | Marca | Texto sobre primária | `onPrimary` | #ffffff | | Marca | Primária suave | `primarySoft` | #e3e3e4 | | Marca | Cor secundária | `secondary` | #52525b | | Marca | Texto sobre secundária | `onSecondary` | #ffffff | | Marca | Cor de destaque | `accent` | #2563eb | | Marca | Texto sobre destaque | `onAccent` | #ffffff | | Fundos e superfícies | Fundo principal | `bg` | #ffffff | | Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 | | Fundos e superfícies | Superfície | `surface` | #ffffff | | Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 | | Texto | Texto principal | `text` | #18181b | | Texto | Texto secundário | `textMuted` | #707072 | | Texto | Texto desabilitado | `textDisabled` | #a7a7a8 | | Texto | Placeholder | `placeholder` | #8c8c8d | | Bordas e foco | Borda | `border` | #e6e6e6 | | Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 | | Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b | | Estados | Hover | `hover` | #f4f4f4 | | Estados | Active | `active` | #ebebeb | | Estados | Pressed | `pressed` | #e0e0e0 | | Estados | Selected — fundo | `selected` | #e3e3e4 | | Estados | Selected — texto | `selectedText` | #18181b | | Estados | Disabled — fundo | `disabled` | #f0f0f0 | | Estados | Disabled — texto | `disabledText` | #979798 | | Semânticos | Success | `success` | #117e39 | | Semânticos | Success — fundo | `successBg` | #e3f4e9 | | Semânticos | Warning | `warning` | #a85c04 | | Semânticos | Warning — fundo | `warningBg` | #faefe1 | | Semânticos | Error | `error` | #dc2626 | | Semânticos | Error — fundo | `errorBg` | #fbe5e5 | | Semânticos | Info | `info` | #2563eb | | Semânticos | Info — fundo | `infoBg` | #e5ecfd | | Links, ícones e navegação | Link | `link` | #18181b | | Links, ícones e navegação | Link — hover | `linkHover` | #141417 | | Links, ícones e navegação | Ícones | `icon` | #525254 | | Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff | | Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d | | Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 | | Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b | | Gradiente | Gradiente — início | `gradientFrom` | #18181b | | Gradiente | Gradiente — fim | `gradientTo` | #3b73ed | ### Tipografia: Inter + Inter `id: identity.typography` · origem: módulo “cores” Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px. **Estrutura** - Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px. - Altura de linha de 1.5 para textos e 1.2–1.3 para títulos. - Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px. **Propriedades** - fonteTitulos: Inter - fonteTexto: Inter - tamanhoBase: 15 - pesoTitulos: 650 - pesoTexto: 400 **Responsividade deste item** - Títulos grandes reduzem proporcionalmente no celular (use clamp()). - Inputs com 16 px no celular para evitar zoom automático. ### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas) `id: identity.geometry` · origem: módulo “cores” Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável. **Estrutura** - Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40. - Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação. - Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces). **Propriedades** - raioPequeno: 6px - raioMedio: 8px - raioGrande: 12px - borda: 1px - sombra: none - superficie: outlined - densidade: comfortable - unidadeDeEspaco: 8px - ícones: outline **Responsividade deste item** - A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque. ### Estados visuais - hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`. - focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado. - selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover. - Mensagens: success/warning/error/info com os fundos semânticos correspondentes. ## E. Componentes 1 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras. ### Componente: Tabelas — Soft Pill `id: tabelas` · origem: módulo “componentes” Tabelas na família visual Soft Pill. Tabela de dados com cabeçalho, linhas com status em badge, valores alinhados à direita e ações por linha. Estilo: Controles em formato de pílula (raio total), superfícies sem borda com sombra difusa e preenchimentos tonais derivados da cor primária. **Estrutura** - Título + ações da tabela → <table> semântica (<thead>, <th scope=\"col\">) → linhas. - Números alinhados à direita com tabular-nums; status como badge; ações no fim. - Estados de carregando (skeleton), vazio e erro. - Botões, campos, chips e abas com raio total (999 px); contêineres com raio de 22 px. - Campos tonais: fundo na superfície alternativa, sem borda; o foco acende um anel na cor de foco. - Ícones dentro de círculos suaves (primária suave) com traço de 2 px. - Item ativo marcado por pílula preenchida em primária suave. - Composição: Blocos arredondados flutuando sobre fundo levemente tingido; agrupamentos por proximidade, sem linhas divisórias. - Acabamento: Sombras difusas e baixas; preenchimentos tonais; zero bordas. **Propriedades** - Família visual: 1. Soft Pill - Título: Pedidos recentes - Colunas (uma por linha): Cliente | Status | Valor | Data - Linhas de exemplo: 4 - Densidade: confortável - Linhas zebradas: não - Estilo do cabeçalho: Destacado - Seleção com checkbox: sim - Ações por linha: sim - Raio dos controles: pílula (999 px) - Raio dos contêineres: 22 px - Borda: sem borda - Sombra: sombra difusa e baixa - Superfície: superfície = token surface - Ação principal: primária sólida (primary) com texto onPrimary - Fonte de títulos: Inter 650 - Fonte de texto: Inter - Caixa de rótulos e botões: normal (sentence case) - Tamanho base: 14 px - Altura de controles: 42 px (mínimo 44 px de área de toque no celular) - Ícones: lucide, traço 2 px, tratamento circle - Indicador de ativo: pill **Cores** - Ação principal (fundo): #18181b - Ação principal (texto): #ffffff - Superfície: #ffffff - Texto: #18181b - Texto secundário: #707072 - Borda: #e6e6e6 - Destaque: #2563eb - Foco: #18181b **Medidas recomendadas (adaptáveis)** - alturaDeControle: 42 px - raio: pílula - paddingInterno: 15 px **Comportamento e estados** - Hover na linha; seleção com checkbox no cabeçalho (todos/indeterminado); ordenação por clique no cabeçalho com aria-sort. - Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros. - Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível. - Active: Primária — active (primaryActive). - Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled. - Hover escurece levemente o preenchimento; active reduz a escala para 0,98. - Transições de 160 ms com easing suave. - Movimento: Suave (160 ms), leve redução de escala ao pressionar. **Responsividade deste item** - No celular: rolagem horizontal local dentro do contêiner (overflow-x: auto) com a primeira coluna fixa, ou representação em cartões (cada linha vira um cartão rótulo: valor). - No celular, pílulas mantêm altura mínima de 44 px e chips quebram em múltiplas linhas em vez de rolar. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. **Observações** - As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades). - Use os tokens da paleta global por padrão; só as exceções listadas fogem dela. ## F. Responsividade Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias. Breakpoints de referência: - xs: Celulares pequenos (320–359 px) - sm: Celulares (360–599 px) - md: Tablets e celulares na horizontal (600–1023 px) - lg: Notebooks (1024–1439 px) - xl: Monitores grandes (1440 px ou mais) **Regras gerais** - Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias). - Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos). - Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto. - Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes. - Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS). - Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção. - Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível. - Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade. - Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores. - Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura. - Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia. - Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível. - Respeite `prefers-reduced-motion` reduzindo animações. **Regras por componente** - Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis. - Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria). - Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. - Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível). - Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada. - Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet. - Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores. - Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem. - Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente. - Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho. ## G. Regras de implementação - Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário. - Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas. - Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado. - Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra. - Evite overflow e colisões; valide em todas as larguras de referência. - Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected). - Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários. - Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código. - Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela. - Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir. ## Pendências Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra. - Defina o tipo de projeto. - Dê um nome ao projeto. - Escolha como as pessoas entram no site (landing, login, direto…). - Escolha a arquitetura do computador. - Escolha a arquitetura do celular."
  - status:
    - generic [ref=f1e301]: Tabelas · Soft Pill adicionado ao projeto e ao Master Prompt.
```

# Test source

```ts
  196 |         const before = await scrollY(page)
  197 |         await tapWhereVisible(page, choose)
  198 |         await expect.poll(async () => (await savedProject(page)).layout.desktopId).toBe('sidebar-integral-classica')
  199 |         await page.waitForTimeout(400)
  200 |         expect(await scrollY(page), `rolagem ao tocar "Escolher este modelo" em y=${y}`).toBe(before)
  201 |         await page.evaluate((key) => {
  202 |           const raw = JSON.parse(localStorage.getItem(key)!)
  203 |           raw.state.project.layout.desktopId = null
  204 |           localStorage.setItem(key, JSON.stringify(raw))
  205 |         }, STORAGE)
  206 |         await page.reload()
  207 |         await go(page, '/guiado/desktop')
  208 |       }
  209 |       const cards = page.locator('[data-testid^="desktop-option-"]')
  210 |       for (const i of [4, 19, 36]) {
  211 |         const hit = hitOf(cards.nth(i))
  212 |         await placeAt(page, hit, 400)
  213 |         const before = await scrollY(page)
  214 |         await tapWhereVisible(page, hit)
  215 |         await page.waitForTimeout(400)
  216 |         expect(await scrollY(page), `miniatura ${i}`).toBe(before)
  217 |         await expect(hit).toHaveAttribute('aria-pressed', 'true')
  218 |       }
  219 |     })
  220 | 
  221 |     test('celular (etapa 4) e paletas: tocar em miniaturas mantém a rolagem', async ({ page }) => {
  222 |       await freshStart(page)
  223 |       for (const [route, prefix, idx] of [
  224 |         ['/modulos/mobile', 'mobile-option-', [1, 3]],
  225 |         ['/modulos/cores', 'palette-option-', [7, 30]],
  226 |       ] as const) {
  227 |         await go(page, route)
  228 |         for (const i of idx) {
  229 |           const hit = hitOf(page.locator(`[data-testid^="${prefix}"]`).nth(i))
  230 |           await hit.scrollIntoViewIfNeeded()
  231 |           await placeAt(page, hit, 400)
  232 |           const before = await scrollY(page)
  233 |           await tapWhereVisible(page, hit)
  234 |           await page.waitForTimeout(400)
  235 |           expect(await scrollY(page), `${route} #${i}`).toBe(before)
  236 |         }
  237 |       }
  238 |     })
  239 |   })
  240 | 
  241 |   test('desktop 1440: "Escolher este modelo" no guiado não desloca a página', async ({ page }) => {
  242 |     await freshStart(page)
  243 |     await go(page, '/guiado/desktop')
  244 |     await page.mouse.wheel(0, 600)
  245 |     await page.waitForTimeout(300)
  246 |     const before = await scrollY(page)
  247 |     await page.getByRole('button', { name: 'Escolher este modelo' }).click()
  248 |     await page.waitForTimeout(400)
  249 |     expect(await scrollY(page)).toBe(before)
  250 |   })
  251 | })
  252 | 
  253 | test.describe('REG-03 · Controles da identidade e dos componentes alteram a prévia', () => {
  254 |   const previewText = (page: Page, text: string) => page.getByTestId('identity-preview').getByText(text, { exact: true }).first()
  255 |   const fontSize = (l: Locator) => l.evaluate((e) => parseFloat(getComputedStyle(e).fontSize))
  256 | 
  257 |   test('"Tamanho base do texto" muda o corpo do texto da prévia, não só o título', async ({ page }) => {
  258 |     test.fail(true, `REG-03: "Tamanho base do texto" só altera o título da prévia (corpo fica em 13 px) ${VER}`)
  259 |     await freshStart(page)
  260 |     await go(page, '/modulos/cores')
  261 |     await page.getByRole('tab', { name: 'Tipografia' }).click()
  262 |     const body = { linha: previewText(page, 'Ana Souza'), botao: previewText(page, 'Primário'), campo: previewText(page, 'Placeholder…'), menu: previewText(page, 'Início') }
  263 |     const before = { linha: await fontSize(body.linha), botao: await fontSize(body.botao), campo: await fontSize(body.campo), menu: await fontSize(body.menu) }
  264 |     const title0 = await fontSize(previewText(page, 'Visão geral'))
  265 |     await page.getByRole('group', { name: 'Tamanho base' }).getByRole('button', { name: '18 px' }).click()
  266 |     await expect.poll(() => fontSize(previewText(page, 'Visão geral'))).toBeGreaterThan(title0) // o título responde
  267 |     for (const [k, l] of Object.entries(body)) {
  268 |       expect(await fontSize(l), `texto "${k}" da prévia deve crescer com a base de 18 px`).toBeGreaterThan(before[k as keyof typeof before])
  269 |     }
  270 |   })
  271 | 
  272 |   test('"Estilo dos ícones" (Preenchido/Duotone) muda os ícones da prévia da identidade', async ({ page }) => {
  273 |     test.fail(true, `REG-03: o estilo dos ícones é salvo e vai ao prompt, mas a prévia da identidade não muda ${VER}`)
  274 |     await freshStart(page)
  275 |     await go(page, '/modulos/cores')
  276 |     await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
  277 |     const icons = () => page.getByTestId('identity-preview').locator('svg').evaluateAll((els) => els.map((e) => `${e.getAttribute('fill')}|${getComputedStyle(e).fill}|${e.getAttribute('stroke-width')}`).join(';'))
  278 |     const before = await icons()
  279 |     await page.getByRole('button', { name: 'Preenchido' }).click()
  280 |     await expect.poll(async () => (await savedProject(page)).identity.geometry.iconStyle).toBe('filled')
  281 |     expect(await icons(), 'ícones da prévia devem refletir o estilo "Preenchido"').not.toBe(before)
  282 |   })
  283 | 
  284 |   test('densidade da tabela mostrada no editor ("Padrão") é a mesma do Master Prompt', async ({ page }) => {
  285 |     test.fail(true, `REG-03: o editor mostra "Densidade: Padrão", mas o prompt escreve a densidade da família ("confortável"/"compacta") ${VER}`)
  286 |     await freshStart(page)
  287 |     await go(page, '/modulos/componentes')
  288 |     await page.getByTestId('component-category-tabelas').click()
  289 |     await page.getByTestId('add-component-soft-pill').click()
  290 |     const editor = page.getByTestId('component-editor')
  291 |     const shown = (await editor.getByRole('group', { name: 'Densidade' }).locator('[aria-pressed="true"]').textContent())?.trim()
  292 |     expect(shown).toBe('Padrão')
  293 |     await page.keyboard.press('Escape')
  294 |     const prompt = await masterPrompt(page)
  295 |     const said = prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()
> 296 |     expect(said?.toLowerCase(), 'densidade no prompt').toBe('padrão')
      |                                                        ^ Error: densidade no prompt
  297 |   })
  298 | 
  299 |   test('cantos, densidade global e fontes alteram a prévia (proteção)', async ({ page }) => {
  300 |     await freshStart(page)
  301 |     await go(page, '/modulos/cores')
  302 |     const snap = () =>
  303 |       page.getByTestId('identity-preview').evaluate((root) =>
  304 |         [root, ...Array.from(root.querySelectorAll('*'))].map((e) => { const cs = getComputedStyle(e); return `${cs.fontFamily}|${cs.borderRadius}|${cs.padding}|${cs.gap}` }).join(';'),
  305 |       )
  306 |     await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
  307 |     for (const name of ['Grandes (14 px)', 'Compacta']) {
  308 |       const s0 = await snap()
  309 |       await page.getByRole('button', { name, exact: true }).click()
  310 |       await expect.poll(snap, `prévia muda com "${name}"`).not.toBe(s0)
  311 |     }
  312 |     await page.getByRole('tab', { name: 'Tipografia' }).click()
  313 |     for (const group of ['Fonte dos títulos', 'Fonte dos textos']) {
  314 |       const s0 = await snap()
  315 |       await page.getByRole('group', { name: group }).getByRole('button', { name: /Fraunces/ }).click()
  316 |       await expect.poll(snap, `prévia muda com "${group}"`).not.toBe(s0)
  317 |     }
  318 |   })
  319 | })
  320 | 
  321 | const NOT_BUTTONS =
  322 |   '.ui-option__hit, .nvs-card__select, .ui-option__media, .nvs-card__preview, [data-testid="phone-preview"], [data-testid="phone-thumb"], [data-testid="identity-preview"], [data-testid="live-preview"], .ui-segmented, [role=tablist], .lay-ds, .gd-footer, .shell-topbar, #studio-sidebar, .cmp-nav, [aria-hidden="true"]'
  323 | 
  324 | /** Pares de botões sobrepostos ou com menos de 4 px entre si (ignora prévias, barras fixas, listas de navegação e áreas de cartão inteiro). */
  325 | async function buttonCollisions(page: Page) {
  326 |   return page.evaluate((NOT) => {
  327 |     const els = Array.from(document.querySelectorAll<HTMLElement>('button, a.ui-btn, [role=button]')).filter((e) => {
  328 |       const r = e.getBoundingClientRect()
  329 |       return r.width > 4 && r.height > 4 && getComputedStyle(e).visibility !== 'hidden' && !e.closest(NOT)
  330 |     })
  331 |     const boxes = els.map((e) => ({ e, r: e.getBoundingClientRect(), n: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) }))
  332 |     const issues: string[] = []
  333 |     for (let i = 0; i < boxes.length; i++)
  334 |       for (let j = i + 1; j < boxes.length; j++) {
  335 |         const a = boxes[i], b = boxes[j]
  336 |         if (a.e.contains(b.e) || b.e.contains(a.e)) continue
  337 |         const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
  338 |         const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
  339 |         if (ix > 1 && iy > 1) issues.push(`sobrepostos: "${a.n}" × "${b.n}"`)
  340 |         else if (iy > Math.min(a.r.height, b.r.height) / 2) {
  341 |           const gap = Math.max(b.r.left - a.r.right, a.r.left - b.r.right)
  342 |           if (gap >= 0 && gap < 4) issues.push(`grudados: "${a.n}" | "${b.n}" (${gap.toFixed(1)} px)`)
  343 |         } else if (ix > Math.min(a.r.width, b.r.width) / 2) {
  344 |           const gap = Math.max(b.r.top - a.r.bottom, a.r.top - b.r.bottom)
  345 |           if (gap >= 0 && gap < 4) issues.push(`grudados: "${a.n}" / "${b.n}" (${gap.toFixed(1)} px)`)
  346 |         }
  347 |       }
  348 |     return issues
  349 |   }, NOT_BUTTONS)
  350 | }
  351 | 
  352 | const BUTTON_ROUTES = ['/', '/guiado/objetivo', '/guiado/entrada', '/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/templates', '/prompt', '/exportar']
  353 | 
  354 | test.describe('REG-04 · Botões grudados ou sobrepostos', () => {
  355 |   test('desktop 1440: nenhum par de botões sobreposto ou a menos de 4 px', async ({ page }) => {
  356 |     test.setTimeout(150_000)
  357 |     await freshStart(page)
  358 |     for (const r of BUTTON_ROUTES) {
  359 |       await go(page, r)
  360 |       expect(await buttonCollisions(page), r).toEqual([])
  361 |     }
  362 |   })
  363 | 
  364 |   test.describe('celular 360×800', () => {
  365 |     test.use(MOBILE)
  366 |     test('nenhum par de botões sobreposto ou a menos de 4 px', async ({ page }) => {
  367 |       test.setTimeout(150_000)
  368 |       await freshStart(page)
  369 |       for (const r of BUTTON_ROUTES) {
  370 |         await go(page, r)
  371 |         expect(await buttonCollisions(page), r).toEqual([])
  372 |       }
  373 |     })
  374 |   })
  375 | 
  376 |   test.describe('tablet 768×1024', () => {
  377 |     test.use({ viewport: { width: 768, height: 1024 } })
  378 |     test('"Escolher este modelo" do celular grande não fica por cima das miniaturas', async ({ page }) => {
  379 |       test.fail(true, `REG-04: entre 620 e 939 px de largura útil o painel do celular grande (com o botão) cobre as miniaturas ${VER}`)
  380 |       await freshStart(page)
  381 |       await go(page, '/modulos/mobile')
  382 |       const btn = page.getByRole('button', { name: 'Escolher este modelo' })
  383 |       const b = (await btn.boundingBox())!
  384 |       const overlapping = await page.locator('[data-testid^="mobile-option-"]').evaluateAll(
  385 |         (cards, b) => cards.filter((c) => { const r = c.getBoundingClientRect(); return Math.min(r.right, b.x + b.width) - Math.max(r.left, b.x) > 1 && Math.min(r.bottom, b.y + b.height) - Math.max(r.top, b.y) > 1 }).map((c) => (c as HTMLElement).dataset.testid),
  386 |         b,
  387 |       )
  388 |       expect(overlapping).toEqual([])
  389 |     })
  390 |   })
  391 | })
  392 | 
  393 | test.describe('REG-05 · Cartões sem ações duplicadas', () => {
  394 |   const ALL = [...GALLERIES, { route: '/modulos/componentes', prefix: 'family-option-' }, { route: '/modulos/templates', prefix: 'template-option-' }, { route: '/modulos/inspiracao', prefix: 'inspiration-option-' }]
  395 |   async function actions(page: Page, prefix: string) {
  396 |     return page.locator(`[data-testid^="${prefix}"]`).evaluateAll((cards) =>
```