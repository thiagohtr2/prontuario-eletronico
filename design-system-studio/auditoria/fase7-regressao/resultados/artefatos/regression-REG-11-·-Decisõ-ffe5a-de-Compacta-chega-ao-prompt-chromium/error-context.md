# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-11 · Decisões chegam ao Master Prompt >> propriedade escolhida no componente (Densidade = Compacta) chega ao prompt
- Location: tests/e2e/regression.spec.ts:633:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "compacta"
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
            - generic [ref=f1e300]: "# Master Prompt — Projeto sem nome > Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 23:57:58. > Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração. ## A. Informações do projeto - Nome: Projeto sem nome - Tipo de aplicação: Não definido ## B. Arquitetura geral - Fluxo de entrada: não definido. - Landing: nenhuma · Login: nenhum · Cadastro: nenhum - Layout desktop: não definido · Layout mobile: não definido ## C. Navegação Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra. - Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current=\"page\"`). - Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora. - Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu. ## D. Identidade visual Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas. | Grupo | Token | Nome | Valor | | --- | --- | --- | --- | | Marca | Cor primária | `primary` | #18181b | | Marca | Primária — hover | `primaryHover` | #161618 | | Marca | Primária — active | `primaryActive` | #131316 | | Marca | Texto sobre primária | `onPrimary` | #ffffff | | Marca | Primária suave | `primarySoft` | #e3e3e4 | | Marca | Cor secundária | `secondary` | #52525b | | Marca | Texto sobre secundária | `onSecondary` | #ffffff | | Marca | Cor de destaque | `accent` | #2563eb | | Marca | Texto sobre destaque | `onAccent` | #ffffff | | Fundos e superfícies | Fundo principal | `bg` | #ffffff | | Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 | | Fundos e superfícies | Superfície | `surface` | #ffffff | | Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 | | Texto | Texto principal | `text` | #18181b | | Texto | Texto secundário | `textMuted` | #707072 | | Texto | Texto desabilitado | `textDisabled` | #a7a7a8 | | Texto | Placeholder | `placeholder` | #8c8c8d | | Bordas e foco | Borda | `border` | #e6e6e6 | | Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 | | Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b | | Estados | Hover | `hover` | #f4f4f4 | | Estados | Active | `active` | #ebebeb | | Estados | Pressed | `pressed` | #e0e0e0 | | Estados | Selected — fundo | `selected` | #e3e3e4 | | Estados | Selected — texto | `selectedText` | #18181b | | Estados | Disabled — fundo | `disabled` | #f0f0f0 | | Estados | Disabled — texto | `disabledText` | #979798 | | Semânticos | Success | `success` | #117e39 | | Semânticos | Success — fundo | `successBg` | #e3f4e9 | | Semânticos | Warning | `warning` | #a85c04 | | Semânticos | Warning — fundo | `warningBg` | #faefe1 | | Semânticos | Error | `error` | #dc2626 | | Semânticos | Error — fundo | `errorBg` | #fbe5e5 | | Semânticos | Info | `info` | #2563eb | | Semânticos | Info — fundo | `infoBg` | #e5ecfd | | Links, ícones e navegação | Link | `link` | #18181b | | Links, ícones e navegação | Link — hover | `linkHover` | #141417 | | Links, ícones e navegação | Ícones | `icon` | #525254 | | Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff | | Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d | | Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 | | Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b | | Gradiente | Gradiente — início | `gradientFrom` | #18181b | | Gradiente | Gradiente — fim | `gradientTo` | #3b73ed | ### Tipografia: Inter + Inter `id: identity.typography` · origem: módulo “cores” Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px. **Estrutura** - Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px. - Altura de linha de 1.5 para textos e 1.2–1.3 para títulos. - Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px. **Propriedades** - fonteTitulos: Inter - fonteTexto: Inter - tamanhoBase: 15 - pesoTitulos: 650 - pesoTexto: 400 **Responsividade deste item** - Títulos grandes reduzem proporcionalmente no celular (use clamp()). - Inputs com 16 px no celular para evitar zoom automático. ### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas) `id: identity.geometry` · origem: módulo “cores” Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável. **Estrutura** - Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40. - Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação. - Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces). **Propriedades** - raioPequeno: 6px - raioMedio: 8px - raioGrande: 12px - borda: 1px - sombra: none - superficie: outlined - densidade: comfortable - unidadeDeEspaco: 8px - ícones: outline **Responsividade deste item** - A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque. ### Estados visuais - hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`. - focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado. - selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover. - Mensagens: success/warning/error/info com os fundos semânticos correspondentes. ## E. Componentes 1 componente(s) aprovados. Cada instância tem configuração própria; alterar uma não altera as outras. ### Componente: Tabelas — Soft Pill `id: tabelas` · origem: módulo “componentes” Tabelas na família visual Soft Pill. Tabela de dados com cabeçalho, linhas com status em badge, valores alinhados à direita e ações por linha. Estilo: Controles em formato de pílula (raio total), superfícies sem borda com sombra difusa e preenchimentos tonais derivados da cor primária. **Estrutura** - Título + ações da tabela → <table> semântica (<thead>, <th scope=\"col\">) → linhas. - Números alinhados à direita com tabular-nums; status como badge; ações no fim. - Estados de carregando (skeleton), vazio e erro. - Botões, campos, chips e abas com raio total (999 px); contêineres com raio de 22 px. - Campos tonais: fundo na superfície alternativa, sem borda; o foco acende um anel na cor de foco. - Ícones dentro de círculos suaves (primária suave) com traço de 2 px. - Item ativo marcado por pílula preenchida em primária suave. - Composição: Blocos arredondados flutuando sobre fundo levemente tingido; agrupamentos por proximidade, sem linhas divisórias. - Acabamento: Sombras difusas e baixas; preenchimentos tonais; zero bordas. **Propriedades** - Família visual: 1. Soft Pill - Título: Pedidos recentes - Colunas (uma por linha): Cliente | Status | Valor | Data - Linhas de exemplo: 4 - Densidade: confortável - Linhas zebradas: não - Estilo do cabeçalho: Destacado - Seleção com checkbox: sim - Ações por linha: sim - Raio dos controles: pílula (999 px) - Raio dos contêineres: 22 px - Borda: sem borda - Sombra: sombra difusa e baixa - Superfície: superfície = token surface - Ação principal: primária sólida (primary) com texto onPrimary - Fonte de títulos: Inter 650 - Fonte de texto: Inter - Caixa de rótulos e botões: normal (sentence case) - Tamanho base: 14 px - Altura de controles: 42 px (mínimo 44 px de área de toque no celular) - Ícones: lucide, traço 2 px, tratamento circle - Indicador de ativo: pill **Cores** - Ação principal (fundo): #18181b - Ação principal (texto): #ffffff - Superfície: #ffffff - Texto: #18181b - Texto secundário: #707072 - Borda: #e6e6e6 - Destaque: #2563eb - Foco: #18181b **Medidas recomendadas (adaptáveis)** - alturaDeControle: 42 px - raio: pílula - paddingInterno: 15 px **Comportamento e estados** - Hover na linha; seleção com checkbox no cabeçalho (todos/indeterminado); ordenação por clique no cabeçalho com aria-sort. - Hover: fundo Primária — hover (primaryHover) na ação principal e Hover (hover) em itens neutros. - Focus-visible: anel de 3 px em Borda de foco (focus-visible) (focusRing) a 35%. Nunca remova o foco visível. - Active: Primária — active (primaryActive). - Disabled: fundo Disabled — fundo (disabled), texto Disabled — texto (disabledText), sem sombra, cursor not-allowed, aria-disabled. - Hover escurece levemente o preenchimento; active reduz a escala para 0,98. - Transições de 160 ms com easing suave. - Movimento: Suave (160 ms), leve redução de escala ao pressionar. **Responsividade deste item** - No celular: rolagem horizontal local dentro do contêiner (overflow-x: auto) com a primeira coluna fixa, ou representação em cartões (cada linha vira um cartão rótulo: valor). - No celular, pílulas mantêm altura mínima de 44 px e chips quebram em múltiplas linhas em vez de rolar. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. **Observações** - As cores vêm da paleta global aprovada; a família apenas transforma (gradientes, superfícies derivadas, opacidades). - Use os tokens da paleta global por padrão; só as exceções listadas fogem dela. ## F. Responsividade Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias. Breakpoints de referência: - xs: Celulares pequenos (320–359 px) - sm: Celulares (360–599 px) - md: Tablets e celulares na horizontal (600–1023 px) - lg: Notebooks (1024–1439 px) - xl: Monitores grandes (1440 px ou mais) **Regras gerais** - Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias). - Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos). - Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto. - Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes. - Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS). - Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção. - Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível. - Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade. - Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores. - Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura. - Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia. - Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível. - Respeite `prefers-reduced-motion` reduzindo animações. **Regras por componente** - Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis. - Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria). - Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. - Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível). - Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada. - Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet. - Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores. - Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem. - Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente. - Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho. ## G. Regras de implementação - Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário. - Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas. - Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado. - Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra. - Evite overflow e colisões; valide em todas as larguras de referência. - Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected). - Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários. - Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código. - Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela. - Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir. ## Pendências Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra. - Defina o tipo de projeto. - Dê um nome ao projeto. - Escolha como as pessoas entram no site (landing, login, direto…). - Escolha a arquitetura do computador. - Escolha a arquitetura do celular."
  - status:
    - generic [ref=f1e301]: Tabelas · Soft Pill adicionado ao projeto e ao Master Prompt.
```

# Test source

```ts
  544 |           if (!svg || !text) continue
  545 |           const sr = svg.getBoundingClientRect()
  546 |           if (!sr.width || !el.getBoundingClientRect().width) continue
  547 |           const tEl = Array.from(el.querySelectorAll<HTMLElement>('span')).find((s) => s.textContent?.trim() === text) ?? el
  548 |           res.push({ t: text.slice(0, 16), icon: sr.height, fs: parseFloat(getComputedStyle(tEl).fontSize) })
  549 |         }
  550 |         return res
  551 |       })
  552 |       measured += items.length
  553 |       for (const it of items) {
  554 |         const ratio = it.icon / it.fs
  555 |         if (it.fs < 10 || ratio < 0.75 || ratio > 2.5) problems.push(`${id} "${it.t}": texto ${it.fs}px, ícone ${it.icon.toFixed(1)}px (×${ratio.toFixed(2)})`)
  556 |       }
  557 |     }
  558 |     expect(measured, 'itens de menu medidos').toBeGreaterThan(100)
  559 |     expect(problems).toEqual([])
  560 |   })
  561 | })
  562 | 
  563 | test.describe('REG-10 · Diagramas: conteúdo não parece menu flutuante', () => {
  564 |   test('regiões de CONTEÚDO não usam a elevação dos menus flutuantes e sempre têm a etiqueta', async ({ page }) => {
  565 |     await freshStart(page)
  566 |     await go(page, '/modulos/desktop')
  567 |     const regions = await page.locator('[data-testid^="desktop-option-"]').evaluateAll((cards) =>
  568 |       cards.flatMap((card) => {
  569 |         const id = (card as HTMLElement).dataset.testid!.replace('desktop-option-', '')
  570 |         return Array.from(card.querySelectorAll<HTMLElement>('.lay-ds-region[data-kind="content"]')).map((c) => {
  571 |           const s = getComputedStyle(c).boxShadow
  572 |           return { id, elevated: s !== 'none' && !/inset/.test(s), labelled: Array.from(c.querySelectorAll('.lay-chip')).some((x) => /CONTE/.test(x.textContent ?? '')) }
  573 |         })
  574 |       }),
  575 |     )
  576 |     expect(regions.length).toBeGreaterThanOrEqual(42)
  577 |     // "Ilhas" é o único modelo cuja especificação declara o conteúdo como superfície flutuante.
  578 |     expect(regions.filter((r) => r.elevated && r.id !== 'ilhas-navegacao').map((r) => r.id)).toEqual([])
  579 |     expect(regions.filter((r) => !r.labelled).map((r) => r.id)).toEqual([])
  580 |   })
  581 | })
  582 | 
  583 | test.describe('REG-11 · Decisões chegam ao Master Prompt', () => {
  584 |   test('entrada, layouts, navegação, paleta, tipografia, geometria e componente aparecem no prompt', async ({ page }) => {
  585 |     test.setTimeout(120_000)
  586 |     await freshStart(page)
  587 |     await go(page, '/guiado/objetivo')
  588 |     await page.getByTestId('project-type-saas').click()
  589 |     await page.getByTestId('project-name').fill('Clínica Aurora')
  590 |     await go(page, '/guiado/entrada')
  591 |     await hitOf(page.getByTestId('entry-flow-landing-login')).click()
  592 |     const pick = async (route: string, prefix: string, idx: number, tab?: RegExp) => {
  593 |       await go(page, route)
  594 |       if (tab) await page.getByRole('tab', { name: tab }).click()
  595 |       const card = page.locator(`[data-testid^="${prefix}"]`).nth(idx)
  596 |       await hitOf(card).click()
  597 |       return (await card.locator('.ui-option__title, .nvs-card__title').first().textContent())!.trim()
  598 |     }
  599 |     const names = {
  600 |       landing: await pick('/modulos/landing', 'landing-option-', 2),
  601 |       login: await pick('/modulos/login', 'login-option-', 3),
  602 |       signup: await pick('/modulos/cadastro', 'signup-option-', 1),
  603 |       desktop: await pick('/modulos/desktop', 'desktop-option-', 5),
  604 |       mobile: await pick('/modulos/mobile', 'mobile-option-', 6),
  605 |       palette: await pick('/modulos/cores', 'palette-option-', 9),
  606 |       header: await pick('/modulos/navegacao', 'header-option-', 4),
  607 |       sidebar: await pick('/modulos/navegacao', 'sidebar-option-', 2, /Sidebars/),
  608 |     }
  609 |     await go(page, '/modulos/cores')
  610 |     await page.getByRole('tab', { name: 'Tipografia' }).click()
  611 |     await page.getByRole('group', { name: 'Fonte dos títulos' }).getByRole('button', { name: /Space Grotesk/ }).click()
  612 |     await page.getByRole('group', { name: 'Tamanho base' }).getByRole('button', { name: '17 px' }).click()
  613 |     await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
  614 |     await page.getByRole('button', { name: 'Grandes (14 px)', exact: true }).click()
  615 |     await page.getByRole('button', { name: 'Duotone', exact: true }).click()
  616 |     await go(page, '/modulos/componentes')
  617 |     await page.getByTestId('component-category-tabelas').click()
  618 |     await page.getByTestId('add-component-swiss-minimal').click()
  619 |     await page.keyboard.press('Escape')
  620 | 
  621 |     const prompt = await masterPrompt(page)
  622 |     expect(prompt).toContain('Clínica Aurora')
  623 |     expect(prompt).toContain('Landing page com chamada para login')
  624 |     for (const [k, v] of Object.entries(names)) expect(prompt, `decisão "${k}" (${v})`).toContain(v)
  625 |     expect(prompt).toContain('Space Grotesk')
  626 |     expect(prompt).toContain('tamanho base 17 px')
  627 |     expect(prompt).toMatch(/raioMedio: 14px/)
  628 |     expect(prompt).toContain('duotone')
  629 |     expect(prompt).toMatch(/Tabelas/)
  630 |     expect(prompt).toContain('Swiss Minimal')
  631 |   })
  632 | 
  633 |   test('propriedade escolhida no componente (Densidade = Compacta) chega ao prompt', async ({ page }) => {
  634 |     test.fail(true, `REG-11: a densidade escolhida pelo usuário é sobrescrita pela densidade da família no prompt ${VER}`)
  635 |     await freshStart(page)
  636 |     await go(page, '/modulos/componentes')
  637 |     await page.getByTestId('component-category-tabelas').click()
  638 |     await page.getByTestId('add-component-soft-pill').click()
  639 |     const editor = page.getByTestId('component-editor')
  640 |     await editor.getByRole('group', { name: 'Densidade' }).getByRole('button', { name: 'Compacta' }).click()
  641 |     await expect.poll(async () => (await savedProject(page)).components[0].props.densidade).toBe('compacta')
  642 |     await page.keyboard.press('Escape')
  643 |     const prompt = await masterPrompt(page)
> 644 |     expect(prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()).toBe('compacta')
      |                                                                ^ Error: expect(received).toBe(expected) // Object.is equality
  645 |   })
  646 | })
  647 | 
  648 | test.describe('REG-12 · Mudanças na paleta se propagam', () => {
  649 |   test('trocar a paleta atualiza prévia da identidade, celular grande, CSS exportado e prompt', async ({ page }) => {
  650 |     await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  651 |     await go(page, '/modulos/cores')
  652 |     const bg0 = await page.getByTestId('identity-preview').evaluate((e) => getComputedStyle(e).backgroundColor)
  653 |     await hitOf(page.getByTestId('palette-option-noite-na-mata')).click()
  654 |     await expect.poll(() => page.getByTestId('identity-preview').evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(bg0)
  655 |     await page.getByRole('tab', { name: 'Tokens e cores' }).click()
  656 |     const primary = (await page.getByLabel('Hexadecimal de Cor primária', { exact: true }).inputValue()).toLowerCase()
  657 |     const bg = (await page.getByLabel('Hexadecimal de Fundo principal', { exact: true }).inputValue()).toLowerCase()
  658 |     const rgb = (hex: string) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`
  659 |     await go(page, '/modulos/mobile')
  660 |     const phoneColors = await page.getByTestId('phone-preview').first().evaluate((root) => Array.from(root.querySelectorAll('*')).map((e) => getComputedStyle(e).backgroundColor))
  661 |     expect(phoneColors, 'o celular grande usa o fundo da nova paleta').toContain(rgb(bg))
  662 |     await go(page, '/exportar')
  663 |     const css = await download(page, () => page.getByTestId('export-css').click())
  664 |     expect((await parseCss(page, css.text)).vars['--color-primary']?.toLowerCase()).toBe(primary)
  665 |     const prompt = await masterPrompt(page)
  666 |     expect(prompt).toContain('Noite na Mata')
  667 |     expect(prompt.toLowerCase()).toContain(primary)
  668 |   })
  669 | 
  670 |   test('troca manual da cor primária recalcula hover, active, foco e link', async ({ page }) => {
  671 |     test.fail(true, `REG-12: a primária manual não recalcula os tokens derivados (hover/active/foco/link ficam na cor antiga) ${VER}`)
  672 |     await freshStart(page)
  673 |     await go(page, '/modulos/cores')
  674 |     await page.getByRole('tab', { name: 'Tokens e cores' }).click()
  675 |     const keys = ['Primária — hover', 'Primária — active', 'Borda de foco (focus-visible)', 'Link']
  676 |     const read = async () => Promise.all(keys.map((k) => page.getByLabel(`Hexadecimal de ${k}`, { exact: true }).inputValue()))
  677 |     const before = await read()
  678 |     const input = page.getByLabel('Hexadecimal de Cor primária', { exact: true })
  679 |     await input.fill('#0b6e4f')
  680 |     await input.press('Enter')
  681 |     await expect.poll(async () => (await savedProject(page)).identity.overrides.primary).toBe('#0b6e4f')
  682 |     const after = await read()
  683 |     keys.forEach((k, i) => expect(after[i], `${k} deve acompanhar a nova primária`).not.toBe(before[i]))
  684 |   })
  685 | })
  686 | 
  687 | test.describe('REG-13 · Seleções preservadas ao voltar de etapa', () => {
  688 |   test('guiado: voltar até a entrada e avançar de novo mantém fluxo, landing, login, cadastro, desktop e mobile', async ({ page }) => {
  689 |     test.setTimeout(120_000)
  690 |     await freshStart(page)
  691 |     await page.getByTestId('start-guided').click()
  692 |     await page.getByTestId('project-type-saas').click()
  693 |     await page.getByTestId('guided-next').click()
  694 |     await hitOf(page.getByTestId('entry-flow-landing-login')).click()
  695 |     for (const [tab, prefix] of [['Landing page', 'landing-option-'], ['Login', 'login-option-'], ['Cadastro', 'signup-option-']]) {
  696 |       await page.getByRole('tab', { name: new RegExp(`^${tab}`) }).click()
  697 |       await hitOf(page.locator(`[data-testid^="${prefix}"]`).nth(1)).click()
  698 |     }
  699 |     const chosen = await savedProject(page)
  700 |     await page.getByTestId('guided-next').click()
  701 |     await hitOf(page.getByTestId('desktop-option-sidebar-integral-classica')).click()
  702 |     await page.getByTestId('guided-next').click()
  703 |     await hitOf(page.getByTestId('mobile-option-bottom-nav-classica')).click()
  704 |     await page.getByTestId('guided-next').click()
  705 |     await expect(page).toHaveURL(/#\/guiado\/revisao/)
  706 | 
  707 |     // Volta etapa por etapa pelo botão "Voltar".
  708 |     await page.getByRole('button', { name: 'Voltar' }).click()
  709 |     await expect(hitOf(page.getByTestId('mobile-option-bottom-nav-classica'))).toHaveAttribute('aria-pressed', 'true')
  710 |     await page.getByRole('button', { name: 'Voltar' }).click()
  711 |     await expect(hitOf(page.getByTestId('desktop-option-sidebar-integral-classica'))).toHaveAttribute('aria-pressed', 'true')
  712 |     await page.getByRole('button', { name: 'Voltar' }).click()
  713 |     await expect(page).toHaveURL(/#\/guiado\/entrada/)
  714 |     await page.getByRole('tab', { name: /Como as pessoas entram/ }).click() // a sub-aba aberta por último é lembrada
  715 |     await expect(hitOf(page.getByTestId('entry-flow-landing-login'))).toHaveAttribute('aria-pressed', 'true')
  716 |     for (const [tab, prefix, id] of [['Landing page', 'landing-option-', chosen.entry.landingId], ['Login', 'login-option-', chosen.entry.loginId], ['Cadastro', 'signup-option-', chosen.entry.signupId]]) {
  717 |       await page.getByRole('tab', { name: new RegExp(`^${tab}`) }).click()
  718 |       await expect(hitOf(page.getByTestId(`${prefix}${id}`)), tab).toHaveAttribute('aria-pressed', 'true')
  719 |     }
  720 |     // Avança de novo: nada se perdeu, inclusive após recarregar.
  721 |     await page.getByTestId('guided-next').click()
  722 |     await page.getByTestId('guided-next').click()
  723 |     await page.getByTestId('guided-next').click()
  724 |     await page.reload()
  725 |     const p = await savedProject(page)
  726 |     expect(p.entry).toMatchObject({ flow: 'landing-login', landingId: chosen.entry.landingId, loginId: chosen.entry.loginId, signupId: chosen.entry.signupId })
  727 |     expect(p.layout).toEqual({ desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' })
  728 |   })
  729 | })
  730 | 
  731 | test.describe('REG-14 · Arquivos exportados válidos e downloads no primeiro clique', () => {
  732 |   test('Exportar, Central de Prompts e identidade: .md, JSON, CSS (CSSOM), HTML e backup válidos no primeiro clique', async ({ page }) => {
  733 |     await seed(page, { meta: { name: 'Loja Aurora' }, entry: { flow: 'login-only', loginId: 'classico-central' }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  734 |     await go(page, '/exportar')
  735 |     const md = await download(page, () => page.getByTestId('export-master').click())
  736 |     expect(md.name).toBe('loja-aurora-master-prompt.md')
  737 |     expect(md.text).toMatch(/^# Master Prompt — Loja Aurora/m)
  738 |     const spec = JSON.parse((await download(page, () => page.getByTestId('export-spec').click())).text)
  739 |     expect(spec.$schema).toBe('atelier-ui/spec@1')
  740 |     expect(spec.project.name).toBe('Loja Aurora')
  741 |     const css = await download(page, () => page.getByTestId('export-css').click())
  742 |     const parsed = await parseCss(page, css.text)
  743 |     expect(parsed.rules).toBeGreaterThan(0)
  744 |     expect(Object.keys(parsed.vars).length).toBeGreaterThanOrEqual(40)
```