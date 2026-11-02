# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-20 · Alterar um módulo não quebra outro >> trocar o fluxo para "Aplicação diretamente" tira o login antigo do prompt e da prévia
- Location: tests/e2e/regression.spec.ts:1002:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /Login: nenhum/
Received string:  "# Master Prompt — Projeto sem nome·
> Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 23:59:04.
> Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração.·
## A. Informações do projeto·
- Nome: Projeto sem nome
- Tipo de aplicação: Não definido·
## B. Arquitetura geral·
- Fluxo de entrada: **Aplicação diretamente** — O sistema abre direto na tela principal, sem apresentação nem login.
- Landing: nenhuma · Login: Clássico central · Cadastro: nenhum
- Layout desktop: não definido · Layout mobile: não definido·
### Login: Clássico central — Cartão central com a marca acima·
`id: classico-central` · origem: módulo “login”·
Login centralizado: logotipo acima de um cartão de ≈400 px com e-mail, senha, “Lembrar de mim”, recuperação e botão em largura total.·
**Estrutura**
- Fundo em bgAlt de tela cheia; logotipo e nome da marca centralizados acima do cartão.
- Cartão central com título, subtítulo, e-mail, senha, linha “Lembrar de mim” + “Esqueci minha senha” e botão “Entrar” em largura total.
- Abaixo do cartão: “Não tem conta? Criar conta”.
- Rodapé discreto com links de Termos e Privacidade.
- Textos da demonstração: título “Entrar na sua conta”, subtítulo “Use seu e-mail e senha para continuar.”.·
**Medidas recomendadas (adaptáveis)**
- larguraFormulario: ≈360–400 px
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- larguraCartao: ≈400 px
- paddingCartao: ≈32 px (desktop) / 20 px (celular)·
**Comportamento e estados**
- Labels visíveis associados aos campos (label for/id). E-mail com type=\"email\", inputMode=\"email\" e autoComplete=\"username\" (ou \"email\"); senha com autoComplete=\"current-password\".
- Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed.
- Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role=\"alert\".
- Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado.
- Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”).
- Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique.·
**Responsividade deste item**
- No celular o cartão perde borda e sombra e ocupa a largura total com 20 px de margem; a marca fica no topo.
- Inputs com font-size ≥ 16 px e altura ≥ 48 px no celular (evita o zoom automático do iOS e facilita o toque).
- Com o teclado virtual aberto, o campo focado e o botão “Entrar” continuam visíveis (use 100dvh, sem height: 100vh fixo, e scroll-padding).
- Funciona a partir de 320 px de largura sem rolagem horizontal.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).
- Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem.·
**Observações**
- Esta tela é uma demonstração de interface. A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório.
- Cores, fontes, cantos e superfícies vêm da identidade global do projeto (tokens).
- A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF).·
## C. Navegação·
Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra.·
- Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current=\"page\"`).
- Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora.
- Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu.·
## D. Identidade visual·
Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas.·
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
| Gradiente | Gradiente — fim | `gradientTo` | #3b73ed |·
### Tipografia: Inter + Inter·
`id: identity.typography` · origem: módulo “cores”·
Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px.·
**Estrutura**
- Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px.
- Altura de linha de 1.5 para textos e 1.2–1.3 para títulos.
- Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px.·
**Propriedades**
- fonteTitulos: Inter
- fonteTexto: Inter
- tamanhoBase: 15
- pesoTitulos: 650
- pesoTexto: 400·
**Responsividade deste item**
- Títulos grandes reduzem proporcionalmente no celular (use clamp()).
- Inputs com 16 px no celular para evitar zoom automático.·
### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas)·
`id: identity.geometry` · origem: módulo “cores”·
Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável.·
**Estrutura**
- Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação.
- Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces).·
**Propriedades**
- raioPequeno: 6px
- raioMedio: 8px
- raioGrande: 12px
- borda: 1px
- sombra: none
- superficie: outlined
- densidade: comfortable
- unidadeDeEspaco: 8px
- ícones: outline·
**Responsividade deste item**
- A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque.·
### Estados visuais
- hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`.
- focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado.
- selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover.
- Mensagens: success/warning/error/info com os fundos semânticos correspondentes.·
## E. Componentes·
Nenhum componente foi personalizado na biblioteca. Crie os componentes necessários usando os tokens e a geometria da seção D.·
## F. Responsividade·
Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias.·
Breakpoints de referência:
- xs: Celulares pequenos (320–359 px)
- sm: Celulares (360–599 px)
- md: Tablets e celulares na horizontal (600–1023 px)
- lg: Notebooks (1024–1439 px)
- xl: Monitores grandes (1440 px ou mais)·
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
- Respeite `prefers-reduced-motion` reduzindo animações.·
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
- Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho.·
## G. Regras de implementação·
- Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.
- Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.
- Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.
- Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.
- Evite overflow e colisões; valide em todas as larguras de referência.
- Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).
- Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.
- Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.
- Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.
- Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.·
## Decisões de prioridade·
Contradições ainda não decididas pelo usuário (pergunte antes de implementar):
- Login escolhido, mas o fluxo de entrada não tem login — O fluxo “Aplicação diretamente” não prevê área restrita, mas há um modelo de login selecionado.·
## Pendências·
Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra.
- Defina o tipo de projeto.
- Dê um nome ao projeto.
- Escolha a arquitetura do computador.
- Escolha a arquitetura do celular.
"
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
              - strong [ref=f1e256]: "5"
              - generic [ref=f1e257]: itens no Master Prompt
            - generic [ref=f1e258]:
              - strong [ref=f1e259]: "0"
              - generic [ref=f1e260]: retirados (seleção mantida)
            - generic [ref=f1e261]:
              - strong [ref=f1e262]: "1"
              - generic [ref=f1e263]: contradições a decidir
            - generic [ref=f1e264]:
              - strong [ref=f1e265]: "4"
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
                - link "Escolha a arquitetura do computador." [ref=f1e279] [cursor=pointer]:
                  - /url: "#/modulos/desktop"
              - listitem [ref=f1e280]:
                - link "Escolha a arquitetura do celular." [ref=f1e281] [cursor=pointer]:
                  - /url: "#/modulos/mobile"
          - tablist "Partes da Central de Prompts" [ref=f1e282]:
            - tab "Master Prompt" [selected] [ref=f1e283] [cursor=pointer]
            - tab "Itens (5)" [ref=f1e284] [cursor=pointer]
            - tab "Contradições (1)" [ref=f1e285] [cursor=pointer]
            - tab "Especificação JSON" [ref=f1e286] [cursor=pointer]
          - generic [ref=f1e287]:
            - generic [ref=f1e288]:
              - button "Copiar Master Prompt" [ref=f1e289] [cursor=pointer]
              - button "Baixar .md" [ref=f1e293] [cursor=pointer]
              - generic [ref=f1e297]: 13.964 caracteres · gerado a partir da especificação JSON
            - generic [ref=f1e298]: "# Master Prompt — Projeto sem nome > Especificação gerada pelo Atelier UI (Design System Studio) em 02/11/2026, 23:59:04. > Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário. Implemente exatamente o que está descrito; quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração. ## A. Informações do projeto - Nome: Projeto sem nome - Tipo de aplicação: Não definido ## B. Arquitetura geral - Fluxo de entrada: **Aplicação diretamente** — O sistema abre direto na tela principal, sem apresentação nem login. - Landing: nenhuma · Login: Clássico central · Cadastro: nenhum - Layout desktop: não definido · Layout mobile: não definido ### Login: Clássico central — Cartão central com a marca acima `id: classico-central` · origem: módulo “login” Login centralizado: logotipo acima de um cartão de ≈400 px com e-mail, senha, “Lembrar de mim”, recuperação e botão em largura total. **Estrutura** - Fundo em bgAlt de tela cheia; logotipo e nome da marca centralizados acima do cartão. - Cartão central com título, subtítulo, e-mail, senha, linha “Lembrar de mim” + “Esqueci minha senha” e botão “Entrar” em largura total. - Abaixo do cartão: “Não tem conta? Criar conta”. - Rodapé discreto com links de Termos e Privacidade. - Textos da demonstração: título “Entrar na sua conta”, subtítulo “Use seu e-mail e senha para continuar.”. **Medidas recomendadas (adaptáveis)** - larguraFormulario: ≈360–400 px - alturaInputs: ≈44 px (desktop) / 48 px (celular) - larguraCartao: ≈400 px - paddingCartao: ≈32 px (desktop) / 20 px (celular) **Comportamento e estados** - Labels visíveis associados aos campos (label for/id). E-mail com type=\"email\", inputMode=\"email\" e autoComplete=\"username\" (ou \"email\"); senha com autoComplete=\"current-password\". - Botão de mostrar/ocultar senha dentro do campo, com aria-label alternando “Mostrar senha”/“Ocultar senha” e aria-pressed. - Validação ao enviar e ao sair do campo: mensagem abaixo do campo (aria-invalid + aria-describedby) e resumo no topo do formulário com role=\"alert\". - Erro de credenciais genérico (“E-mail ou senha incorretos”), sem revelar qual dos dois está errado. - Link “Esqueci minha senha” perto do campo de senha, levando ao fluxo de recuperação por e-mail com mensagem neutra (“Se o e-mail existir, enviaremos um link”). - Botão principal com estado de carregamento (“Entrando…”) e desabilitado durante o envio para evitar duplo clique. **Responsividade deste item** - No celular o cartão perde borda e sombra e ocupa a largura total com 20 px de margem; a marca fica no topo. - Inputs com font-size ≥ 16 px e altura ≥ 48 px no celular (evita o zoom automático do iOS e facilita o toque). - Com o teclado virtual aberto, o campo focado e o botão “Entrar” continuam visíveis (use 100dvh, sem height: 100vh fixo, e scroll-padding). - Funciona a partir de 320 px de largura sem rolagem horizontal. - Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível). - Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem. **Observações** - Esta tela é uma demonstração de interface. A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório. - Cores, fontes, cantos e superfícies vêm da identidade global do projeto (tokens). - A tela é uma demonstração de interface. Implemente a autenticação real com backend seguro (hash de senha, rate limit, tokens httpOnly, proteção CSRF). ## C. Navegação Nenhum modelo específico de header ou sidebar foi escolhido no Navigation Showcase. Use a estrutura do layout desktop/mobile com aparência derivada da identidade visual, sem decoração extra. - Item ativo sempre destacado (cor de navegação ativa) e anunciado a leitores de tela (`aria-current=\"page\"`). - Dropdowns e submenus abrem por clique/toque e por teclado (Enter/Espaço), fecham com Esc e clique fora. - Drawers, bottom sheets e menus de tela cheia prendem o foco enquanto abertos e devolvem o foco ao botão que os abriu. ## D. Identidade visual Paleta global: **Neutro Essencial**. Todos os componentes (botões, inputs, headers, sidebars, cards, tabelas, modais, menus, login, landing e templates) herdam estes tokens por padrão. Exceções só onde estiverem explicitamente listadas. | Grupo | Token | Nome | Valor | | --- | --- | --- | --- | | Marca | Cor primária | `primary` | #18181b | | Marca | Primária — hover | `primaryHover` | #161618 | | Marca | Primária — active | `primaryActive` | #131316 | | Marca | Texto sobre primária | `onPrimary` | #ffffff | | Marca | Primária suave | `primarySoft` | #e3e3e4 | | Marca | Cor secundária | `secondary` | #52525b | | Marca | Texto sobre secundária | `onSecondary` | #ffffff | | Marca | Cor de destaque | `accent` | #2563eb | | Marca | Texto sobre destaque | `onAccent` | #ffffff | | Fundos e superfícies | Fundo principal | `bg` | #ffffff | | Fundos e superfícies | Fundo secundário | `bgAlt` | #f6f6f6 | | Fundos e superfícies | Superfície | `surface` | #ffffff | | Fundos e superfícies | Superfície alternativa | `surfaceAlt` | #f5f5f5 | | Texto | Texto principal | `text` | #18181b | | Texto | Texto secundário | `textMuted` | #707072 | | Texto | Texto desabilitado | `textDisabled` | #a7a7a8 | | Texto | Placeholder | `placeholder` | #8c8c8d | | Bordas e foco | Borda | `border` | #e6e6e6 | | Bordas e foco | Borda forte | `borderStrong` | #c7c7c7 | | Bordas e foco | Borda de foco (focus-visible) | `focusRing` | #18181b | | Estados | Hover | `hover` | #f4f4f4 | | Estados | Active | `active` | #ebebeb | | Estados | Pressed | `pressed` | #e0e0e0 | | Estados | Selected — fundo | `selected` | #e3e3e4 | | Estados | Selected — texto | `selectedText` | #18181b | | Estados | Disabled — fundo | `disabled` | #f0f0f0 | | Estados | Disabled — texto | `disabledText` | #979798 | | Semânticos | Success | `success` | #117e39 | | Semânticos | Success — fundo | `successBg` | #e3f4e9 | | Semânticos | Warning | `warning` | #a85c04 | | Semânticos | Warning — fundo | `warningBg` | #faefe1 | | Semânticos | Error | `error` | #dc2626 | | Semânticos | Error — fundo | `errorBg` | #fbe5e5 | | Semânticos | Info | `info` | #2563eb | | Semânticos | Info — fundo | `infoBg` | #e5ecfd | | Links, ícones e navegação | Link | `link` | #18181b | | Links, ícones e navegação | Link — hover | `linkHover` | #141417 | | Links, ícones e navegação | Ícones | `icon` | #525254 | | Links, ícones e navegação | Navegação — fundo | `navBg` | #ffffff | | Links, ícones e navegação | Navegação — texto | `navText` | #4b4b4d | | Links, ícones e navegação | Navegação — item ativo | `navActive` | #e3e3e4 | | Links, ícones e navegação | Navegação — texto ativo | `navActiveText` | #18181b | | Gradiente | Gradiente — início | `gradientFrom` | #18181b | | Gradiente | Gradiente — fim | `gradientTo` | #3b73ed | ### Tipografia: Inter + Inter `id: identity.typography` · origem: módulo “cores” Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px. **Estrutura** - Escala sugerida: 13 / 15 / 18 / 23 / 30 / 39 px. - Altura de linha de 1.5 para textos e 1.2–1.3 para títulos. - Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px. **Propriedades** - fonteTitulos: Inter - fonteTexto: Inter - tamanhoBase: 15 - pesoTitulos: 650 - pesoTexto: 400 **Responsividade deste item** - Títulos grandes reduzem proporcionalmente no celular (use clamp()). - Inputs com 16 px no celular para evitar zoom automático. ### Geometria e superfícies: Médios (8 px) · Contornada (bordas finas) `id: identity.geometry` · origem: módulo “cores” Cantos médios (8 px), bordas de 1 px, sombra sem sombra, superfícies contornada (bordas finas), densidade confortável. **Estrutura** - Escala de espaçamento em múltiplos de 4 px: 4, 8, 12, 16, 20, 24, 32, 40. - Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação. - Ícones no estilo contorno (outline), tamanho consistente (16–20 px em interfaces). **Propriedades** - raioPequeno: 6px - raioMedio: 8px - raioGrande: 12px - borda: 1px - sombra: none - superficie: outlined - densidade: comfortable - unidadeDeEspaco: 8px - ícones: outline **Responsividade deste item** - A geometria se mantém em todas as larguras; no celular aumente apenas as áreas de toque. ### Estados visuais - hover: fundo `hover` ou primária `primaryHover`; active/pressed: `active`/`pressed`/`primaryActive`. - focus-visible: anel de 2–3 px na cor `focusRing`, sempre visível ao navegar por teclado. - selected: fundo `selected` com texto `selectedText`; disabled: fundo `disabled`, texto `disabledText`, sem hover. - Mensagens: success/warning/error/info com os fundos semânticos correspondentes. ## E. Componentes Nenhum componente foi personalizado na biblioteca. Crie os componentes necessários usando os tokens e a geometria da seção D. ## F. Responsividade Valide pelo menos nas larguras: 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px, além de larguras intermediárias. Breakpoints de referência: - xs: Celulares pequenos (320–359 px) - sm: Celulares (360–599 px) - md: Tablets e celulares na horizontal (600–1023 px) - lg: Notebooks (1024–1439 px) - xl: Monitores grandes (1440 px ou mais) **Regras gerais** - Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias). - Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos). - Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto. - Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes. - Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS). - Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção. - Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível. - Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade. - Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores. - Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura. - Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia. - Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível. - Respeite `prefers-reduced-motion` reduzindo animações. **Regras por componente** - Headers: compacte a altura no celular e use a navegação móvel escolhida no layout mobile; o logo e a ação principal continuam visíveis. - Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria). - Dropdowns e popovers: reposicione automaticamente para não sair da viewport; no celular podem virar bottom sheet. - Tabelas: rolagem horizontal local dentro do próprio contêiner ou representação alternativa em cartões no celular; cabeçalho legível. - Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível). - Calendários: no celular, ofereça modo de lista/agenda quando a grade mensal ficar apertada. - Modais: altura máxima de 90dvh com rolagem interna; botões de ação sempre acessíveis; no celular podem ocupar a tela ou virar bottom sheet. - Gráficos: adapte eixos, quantidade de rótulos, legendas (abaixo do gráfico no celular) e dimensões; nunca corte valores. - Botões: altura mínima de 44 px no celular; textos longos quebram de linha ou o botão ocupa a largura toda; ícones não encolhem. - Cards: altura definida pelo conteúdo (sem alturas fixas que cortem texto); grade reduz colunas progressivamente. - Navegação móvel: o item ativo é sempre identificável; menus que abrem (drawer, sheet, fullscreen) fecham com Esc, toque fora e botão visível, e devolvem o foco ao gatilho. ## G. Regras de implementação - Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário. - Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas. - Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado. - Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra. - Evite overflow e colisões; valide em todas as larguras de referência. - Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected). - Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários. - Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código. - Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela. - Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir. ## Decisões de prioridade Contradições ainda não decididas pelo usuário (pergunte antes de implementar): - Login escolhido, mas o fluxo de entrada não tem login — O fluxo “Aplicação diretamente” não prevê área restrita, mas há um modelo de login selecionado. ## Pendências Decisões que o usuário ainda não tomou. Não invente: pergunte ou use a opção mais neutra. - Defina o tipo de projeto. - Dê um nome ao projeto. - Escolha a arquitetura do computador. - Escolha a arquitetura do celular."
  - status:
    - generic [ref=f1e299]: Login “Clássico central” selecionado e incluído no Master Prompt.
```

# Test source

```ts
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
  939  |     expect([...cuts], 'larguras de troca citadas no prompt').toHaveLength(1)
  940  |   })
  941  | 
  942  |   test('as mesmas escolhas feitas no desktop e no celular geram o mesmo projeto e o mesmo prompt', async ({ browser }) => {
  943  |     test.setTimeout(150_000)
  944  |     const build = async (opts: Parameters<typeof browser.newContext>[0]) => {
  945  |       const ctx = await browser.newContext({ baseURL: 'http://127.0.0.1:4300', ...opts })
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
> 1012 |     expect(prompt).toMatch(/Login: nenhum/)
       |                    ^ Error: expect(received).toMatch(expected)
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
  1040 |       await go(page, r)
  1041 |       await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
  1042 |     }
  1043 |     await go(page, '/modulos/desktop')
  1044 |     await expect(hitOf(page.getByTestId('desktop-option-sidebar-integral-classica'))).toHaveAttribute('aria-pressed', 'true')
  1045 |     expect(errors).toEqual([])
  1046 |   })
  1047 | })
  1048 | 
```