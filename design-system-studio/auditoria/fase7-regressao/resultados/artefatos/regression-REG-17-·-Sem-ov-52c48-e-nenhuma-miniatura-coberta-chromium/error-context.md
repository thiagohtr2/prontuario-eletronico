# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-17 · Sem overflow nas galerias de layouts >> celular deitado 800×360 >> galeria do celular: coluna de miniaturas com largura útil e nenhuma miniatura coberta
- Location: tests/e2e/regression.spec.ts:915:7

# Error details

```
Error: largura da coluna de miniaturas

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 128
Received:    0
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Pular para o conteúdo" [ref=f1e4] [cursor=pointer]:
    - /url: "#conteudo"
  - banner [ref=f1e5]:
    - button "Abrir menu" [ref=f1e6] [cursor=pointer]
    - link "Atelier UI — início" [ref=f1e8] [cursor=pointer]:
      - /url: "#/"
      - generic [ref=f1e14]:
        - generic [ref=f1e15]: Atelier UI
        - generic [ref=f1e16]: Design System Studio
    - button "Buscar funcionalidades (Ctrl+K)" [ref=f1e17] [cursor=pointer]
    - button "Exportar e importar" [ref=f1e21] [cursor=pointer]
    - button "Abrir Master Prompt" [ref=f1e25] [cursor=pointer]:
      - generic [ref=f1e31]: Master Prompt
  - generic [ref=f1e32]:
    - complementary "Navegação do Studio" [ref=f1e33]:
      - generic [ref=f1e34]:
        - generic [ref=f1e35]: Menu
        - button "Fechar menu" [ref=f1e36] [cursor=pointer]
      - generic [ref=f1e40]:
        - group "Modo de utilização" [ref=f1e42]:
          - button "Guiado" [pressed] [ref=f1e43] [cursor=pointer]
          - button "Livre" [ref=f1e47] [cursor=pointer]
        - list [ref=f1e51]:
          - listitem [ref=f1e52]:
            - link "Início" [ref=f1e53] [cursor=pointer]:
              - /url: "#/"
        - generic [ref=f1e58]:
          - button "Construtor guiado" [expanded] [ref=f1e59] [cursor=pointer]
          - list [ref=f1e62]:
            - listitem [ref=f1e63]:
              - link "Objetivo do projeto" [ref=f1e64] [cursor=pointer]:
                - /url: "#/guiado/objetivo"
                - generic [aria-hidden] [ref=f1e65]: "1"
            - listitem [ref=f1e67]:
              - link "Landing, login e cadastro" [ref=f1e68] [cursor=pointer]:
                - /url: "#/guiado/entrada"
                - generic [aria-hidden] [ref=f1e69]: "2"
            - listitem [ref=f1e71]:
              - link "Arquitetura do computador" [ref=f1e72] [cursor=pointer]:
                - /url: "#/guiado/desktop"
                - generic [aria-hidden] [ref=f1e73]: "3"
            - listitem [ref=f1e75]:
              - link "Arquitetura do celular" [ref=f1e76] [cursor=pointer]:
                - /url: "#/guiado/mobile"
                - generic [aria-hidden] [ref=f1e77]: "4"
            - listitem [ref=f1e79]:
              - link "Revisão do esqueleto" [ref=f1e80] [cursor=pointer]:
                - /url: "#/guiado/revisao"
                - generic [aria-hidden] [ref=f1e81]: "5"
            - listitem [ref=f1e83]:
              - link "Prévia integrada" [ref=f1e84] [cursor=pointer]:
                - /url: "#/guiado/preview"
                - generic [aria-hidden] [ref=f1e85]: "6"
            - listitem [ref=f1e87]:
              - link "Identidade visual" [ref=f1e88] [cursor=pointer]:
                - /url: "#/guiado/identidade"
                - generic [aria-hidden] [ref=f1e89]: "7"
            - listitem [ref=f1e91]:
              - link "Headers e sidebars" [ref=f1e92] [cursor=pointer]:
                - /url: "#/guiado/navegacao"
                - generic [aria-hidden] [ref=f1e93]: "8"
            - listitem [ref=f1e95]:
              - link "Componentes" [ref=f1e96] [cursor=pointer]:
                - /url: "#/guiado/componentes"
                - generic [aria-hidden] [ref=f1e97]: "9"
            - listitem [ref=f1e99]:
              - link "Master Prompt" [ref=f1e100] [cursor=pointer]:
                - /url: "#/guiado/entrega"
                - generic [aria-hidden] [ref=f1e101]: "10"
        - generic [ref=f1e103]:
          - button "Estrutura" [expanded] [ref=f1e104] [cursor=pointer]
          - list [ref=f1e107]:
            - listitem [ref=f1e108]:
              - link "Objetivo do projeto" [ref=f1e109] [cursor=pointer]:
                - /url: "#/modulos/objetivo"
            - listitem [ref=f1e115]:
              - link "Landing pages" [ref=f1e116] [cursor=pointer]:
                - /url: "#/modulos/landing"
            - listitem [ref=f1e122]:
              - link "Login" [ref=f1e123] [cursor=pointer]:
                - /url: "#/modulos/login"
            - listitem [ref=f1e128]:
              - link "Cadastro" [ref=f1e129] [cursor=pointer]:
                - /url: "#/modulos/cadastro"
            - listitem [ref=f1e134]:
              - link "Layout desktop" [ref=f1e135] [cursor=pointer]:
                - /url: "#/modulos/desktop"
            - listitem [ref=f1e139]:
              - link "Layout mobile" [ref=f1e140] [cursor=pointer]:
                - /url: "#/modulos/mobile"
            - listitem [ref=f1e144]:
              - link "Live Site Preview" [ref=f1e145] [cursor=pointer]:
                - /url: "#/modulos/preview"
        - generic [ref=f1e150]:
          - button "Identidade" [expanded] [ref=f1e151] [cursor=pointer]
          - list [ref=f1e154]:
            - listitem [ref=f1e155]:
              - link "Color System" [ref=f1e156] [cursor=pointer]:
                - /url: "#/modulos/cores"
            - listitem [ref=f1e164]:
              - link "Navigation Showcase" [ref=f1e165] [cursor=pointer]:
                - /url: "#/modulos/navegacao"
            - listitem [ref=f1e169]:
              - link "Componentes" [ref=f1e170] [cursor=pointer]:
                - /url: "#/modulos/componentes"
        - generic [ref=f1e175]:
          - button "Inspiração" [expanded] [ref=f1e176] [cursor=pointer]
          - list [ref=f1e179]:
            - listitem [ref=f1e180]:
              - link "Inspiration Gallery" [ref=f1e181] [cursor=pointer]:
                - /url: "#/modulos/inspiracao"
            - listitem [ref=f1e185]:
              - link "Template Studio" [ref=f1e186] [cursor=pointer]:
                - /url: "#/modulos/templates"
        - generic [ref=f1e190]:
          - button "Entrega" [expanded] [ref=f1e191] [cursor=pointer]
          - list [ref=f1e194]:
            - listitem [ref=f1e195]:
              - link "Central de Prompts" [ref=f1e196] [cursor=pointer]:
                - /url: "#/prompt"
            - listitem [ref=f1e203]:
              - link "Exportar e importar" [ref=f1e204] [cursor=pointer]:
                - /url: "#/exportar"
        - generic [ref=f1e209]:
          - button "Ferramentas" [expanded] [ref=f1e210] [cursor=pointer]
          - list [ref=f1e213]:
            - listitem [ref=f1e214]:
              - link "Validação responsiva" [ref=f1e215] [cursor=pointer]:
                - /url: "#/validacao"
            - listitem [ref=f1e224]:
              - link "Projeto e versões" [ref=f1e225] [cursor=pointer]:
                - /url: "#/projeto"
      - generic [ref=f1e238]:
        - generic [ref=f1e239]: Projeto sem nome
        - generic [ref=f1e240]: Salvo automaticamente neste navegador
    - main [ref=f1e243]:
      - navigation "Você está em" [ref=f1e244]:
        - list [ref=f1e245]:
          - listitem [ref=f1e246]:
            - link "Início" [ref=f1e247] [cursor=pointer]:
              - /url: "#/"
          - listitem [ref=f1e248]:
            - text: ›
            - link "Estrutura" [ref=f1e249] [cursor=pointer]:
              - /url: "#/livre"
          - listitem [ref=f1e250]: ›Layout mobile
      - generic [ref=f1e251]:
        - generic [ref=f1e253]:
          - generic [ref=f1e254]: Esqueleto · Celular
          - heading "Arquitetura mobile" [level=1] [ref=f1e255]
          - paragraph [ref=f1e256]: "Escolha como as pessoas navegam pelo celular: menu embaixo, barras flutuantes, menus que deslizam ou de tela cheia. São 44 modelos — teste cada um no celular grande."
        - generic [ref=f1e257]:
          - generic [ref=f1e258]:
            - generic [ref=f1e259] [cursor=pointer]:
              - switch "Mostrar legendas nos desenhos" [checked] [ref=f1e260]
              - generic [ref=f1e262]: Mostrar legendas nos desenhos
            - generic "O que significam as etiquetas" [ref=f1e263]:
              - generic [ref=f1e264]:
                - generic: HEADER
                - button "barra superior" [ref=f1e266]
              - generic [ref=f1e267]:
                - generic: MENU INFERIOR
                - button "menu embaixo" [ref=f1e269]
              - generic [ref=f1e270]:
                - generic: DRAWER
                - button "menu que desliza" [ref=f1e272]
              - generic [ref=f1e273]:
                - generic: CONTEÚDO
                - text: o que a pessoa vê e usa
          - generic [ref=f1e277]:
            - strong [ref=f1e278]: O celular tem arquitetura própria.
            - text: "Escolha aqui como o site funciona no celular. O menu lateral do computador não vira automaticamente um drawer: o que valer no celular é o que você escolher nesta página."
          - generic [ref=f1e279]:
            - group "Grupos de navegação móvel" [ref=f1e280]:
              - button "Todos 44" [pressed] [ref=f1e281] [cursor=pointer]:
                - text: Todos
                - generic [ref=f1e282]: "44"
              - button "Navegação inferior 6" [ref=f1e283] [cursor=pointer]:
                - text: Navegação inferior
                - generic [ref=f1e284]: "6"
              - button "Headers e menus flutuantes 8" [ref=f1e285] [cursor=pointer]:
                - text: Headers e menus flutuantes
                - generic [ref=f1e286]: "8"
              - button "Layouts híbridos 9" [ref=f1e287] [cursor=pointer]:
                - text: Layouts híbridos
                - generic [ref=f1e288]: "9"
              - button "Navegação superior 5" [ref=f1e289] [cursor=pointer]:
                - text: Navegação superior
                - generic [ref=f1e290]: "5"
              - button "Drawers e menus laterais 5" [ref=f1e291] [cursor=pointer]:
                - text: Drawers e menus laterais
                - generic [ref=f1e292]: "5"
              - button "Navegação lateral compacta 3" [ref=f1e293] [cursor=pointer]:
                - text: Navegação lateral compacta
                - generic [ref=f1e294]: "3"
              - button "Menus de tela cheia 4" [ref=f1e295] [cursor=pointer]:
                - text: Menus de tela cheia
                - generic [ref=f1e296]: "4"
              - button "One Screen móvel 4" [ref=f1e297] [cursor=pointer]:
                - text: One Screen móvel
                - generic [ref=f1e298]: "4"
            - paragraph [ref=f1e299]: 44 modelos em 8 grupos. Clique em um modelo para vê-lo no celular grande e testar os menus.
          - generic [ref=f1e300]:
            - generic:
              - region "Navegação inferior":
                - generic:
                  - heading "Navegação inferior 6 modelos" [level=3] [ref=f1e301]:
                    - text: Navegação inferior
                    - generic [ref=f1e302]: 6 modelos
                  - paragraph [ref=f1e303]: Menu fixo embaixo, ao alcance do polegar.
                - generic:
                  - button "Bottom Navigation clássica. Uma barra fixa embaixo com 4 ícones e os nomes dos destinos principais, sempre ao alcance do polegar. É o padrão mais conhecido de aplicativos." [ref=f1e306] [cursor=pointer]:
                    - navigation [ref=f1e388]
                    - generic [ref=f1e405]: Bottom Navigation clássica
                  - button "Bottom Navigation com cinco destinos. A barra inferior com cinco destinos, por exemplo Início, Buscar, Categorias, Carrinho e Conta. Ideal para lojas e apps com várias áreas." [ref=f1e409] [cursor=pointer]:
                    - navigation [ref=f1e491]
                    - generic [ref=f1e513]: Bottom Navigation com cinco destinos
                  - button "Dock flutuante. O menu de baixo vira uma “ilha” arredondada, afastada das bordas, flutuando sobre o conteúdo. Moderno e leve." [ref=f1e517] [cursor=pointer]:
                    - navigation [ref=f1e599]
                    - generic [ref=f1e616]: Dock flutuante
                  - button "Bottom com ação central. Barra inferior com um botão redondo de destaque no meio, para a ação mais importante, como “Novo” ou “Publicar”." [ref=f1e620] [cursor=pointer]:
                    - navigation [ref=f1e702]
                    - generic [ref=f1e722]: Bottom com ação central
                  - button "Bottom minimalista. Uma barra inferior bem discreta, só com ícones e um pontinho no item ativo. Deixa o conteúdo e as imagens em primeiro plano." [ref=f1e726] [cursor=pointer]:
                    - navigation [ref=f1e806]
                    - generic [ref=f1e823]: Bottom minimalista
                  - button "Bottom com título superior. Barra inferior clássica combinada com um título grande no topo de cada tela, que diminui quando a pessoa rola." [ref=f1e827] [cursor=pointer]:
                    - navigation [ref=f1e911]
                    - generic [ref=f1e928]: Bottom com título superior
              - region "Headers e menus flutuantes":
                - generic:
                  - heading "Headers e menus flutuantes 8 modelos" [level=3] [ref=f1e930]:
                    - text: Headers e menus flutuantes
                    - generic [ref=f1e931]: 8 modelos
                  - paragraph [ref=f1e932]: Barras afastadas das bordas, como ilhas.
                - generic:
                  - button "Topbar flutuante compacta. Uma barra superior pequena e arredondada, afastada das bordas, com logo e um botão de menu que abre uma lista curta de links." [ref=f1e935] [cursor=pointer]:
                    - generic [ref=f1e1040]: Topbar flutuante compacta
                  - button "Topbar flutuante com drawer esquerdo. Barra superior flutuante com um botão de menu à esquerda. Ao tocar, um menu lateral desliza pela esquerda." [ref=f1e1044] [cursor=pointer]:
                    - generic [ref=f1e1165]: Topbar flutuante com drawer esquerdo
                  - button "Topbar flutuante com drawer direito. Barra superior flutuante com o botão de menu do lado direito, mais fácil de alcançar com o polegar. O menu desliza pela direita." [ref=f1e1169] [cursor=pointer]:
                    - generic [ref=f1e1288]: Topbar flutuante com drawer direito
                  - 'button "Topbar flutuante com dock inferior. Duas ilhas: uma barra flutuante no topo e um dock flutuante embaixo. O conteúdo passa por trás das duas." [ref=f1e1292] [cursor=pointer]':
                    - navigation [ref=f1e1376]
                    - generic [ref=f1e1393]: Topbar flutuante com dock inferior
                  - button "Topbar como ilha central com dock pill. No topo, uma pequena cápsula central com o título; embaixo, um menu em forma de pílula só com ícones. Visual limpo e marcante." [ref=f1e1397] [cursor=pointer]:
                    - navigation [ref=f1e1478]
                    - generic [ref=f1e1487]: Topbar como ilha central com dock pill
                  - button "Menu inferior pill com ícones. Um menu flutuante em forma de pílula na parte de baixo. O item ativo se expande e mostra o nome; os outros mostram só o ícone." [ref=f1e1491] [cursor=pointer]:
                    - navigation [ref=f1e1573]
                    - generic [ref=f1e1583]: Menu inferior pill com ícones
                  - 'button "Dock inferior transparente. Um dock flutuante translúcido, como vidro fosco: dá para ver o conteúdo passando por trás. Fica bonito com fotos e cores." [ref=f1e1587] [cursor=pointer]':
                    - navigation [ref=f1e1667]
                    - generic [ref=f1e1684]: Dock inferior transparente
                  - button "Menu flutuante inferior compacto. Um único botão redondo flutuando no canto de baixo. Ao tocar, ele abre uma pequena lista de ações rápidas acima dele." [ref=f1e1688] [cursor=pointer]:
                    - generic [ref=f1e1788]: Menu flutuante inferior compacto
              - region "Layouts híbridos":
                - generic:
                  - heading "Layouts híbridos 9 modelos" [level=3] [ref=f1e1790]:
                    - text: Layouts híbridos
                    - generic [ref=f1e1791]: 9 modelos
                  - paragraph [ref=f1e1792]: Combinações de header, stories, dock e drawer.
                - generic:
                  - button "Stories fixos com dock flutuante. No topo, uma faixa de círculos com destaques que desliza para o lado; embaixo, um menu flutuante arredondado." [ref=f1e1795] [cursor=pointer]:
                    - navigation [ref=f1e1908]
                    - generic [ref=f1e1925]: Stories fixos com dock flutuante
                  - button "Stories com dock e drawer lateral. Faixa de destaques no topo, menu flutuante embaixo e, para as opções menos usadas, um menu lateral que abre pelo botão de menu." [ref=f1e1929] [cursor=pointer]:
                    - navigation [ref=f1e2040]
                    - generic [ref=f1e2057]: Stories com dock e drawer lateral
                  - button "Stories com dock translúcido. Faixa de destaques no topo e um dock embaixo com efeito de vidro fosco, deixando ver o conteúdo por trás." [ref=f1e2061] [cursor=pointer]:
                    - navigation [ref=f1e2174]
                    - generic [ref=f1e2191]: Stories com dock translúcido
                  - button "Header fixo com busca e menu inferior flutuante. Barra superior fixa com campo de busca, logo abaixo uma faixa de categorias que desliza para o lado e um menu flutuante arredondado embaixo." [ref=f1e2195] [cursor=pointer]:
                    - navigation [ref=f1e2303]
                    - generic [ref=f1e2320]: Header fixo com busca e menu inferior flutuante
                  - button "Topbar com Bottom Navigation. Barra superior com logo e atalhos (busca, notificações) e barra inferior com os destinos principais. Equilíbrio entre marca e navegação." [ref=f1e2324] [cursor=pointer]:
                    - navigation [ref=f1e2411]
                    - generic [ref=f1e2428]: Topbar com Bottom Navigation
                  - button "Bottom Navigation com drawer de opções. Barra inferior com quatro destinos e um botão “Mais” que abre um painel de baixo para cima com as demais opções." [ref=f1e2432] [cursor=pointer]:
                    - navigation [ref=f1e2513]
                    - generic [ref=f1e2530]: Bottom Navigation com drawer de opções
                  - button "Header com menu de perfil. Barra superior com saudação e a foto da pessoa; tocar na foto abre um menu da conta. Embaixo, a barra com os destinos principais." [ref=f1e2534] [cursor=pointer]:
                    - navigation [ref=f1e2620]
                    - generic [ref=f1e2663]: Header com menu de perfil
                  - button "Rail com menu inferior. Uma coluna fina de ícones na lateral para filtros ou atalhos e a barra inferior para os destinos principais." [ref=f1e2667] [cursor=pointer]:
                    - generic [ref=f1e2673]:
                      - navigation [ref=f1e2687]
                      - navigation [ref=f1e2762]
                    - generic [ref=f1e2779]: Rail com menu inferior
                  - 'button "Menu compacto adaptável. Um menu pequeno flutuando embaixo com três atalhos e um botão “mais”. Ele se adapta: vira trilho lateral quando o celular está deitado." [ref=f1e2783] [cursor=pointer]':
                    - navigation [ref=f1e2864]
                    - generic [ref=f1e2874]: Menu compacto adaptável
              - region "Navegação superior":
                - generic:
                  - heading "Navegação superior 5 modelos" [level=3] [ref=f1e2876]:
                    - text: Navegação superior
                    - generic [ref=f1e2877]: 5 modelos
                  - paragraph [ref=f1e2878]: Menus e abas concentrados no topo.
                - generic:
                  - button "Topbar com menu hambúrguer. Barra superior com o ícone de três linhas. Ao tocar, o menu desce do topo, logo abaixo da barra, com os links do site." [ref=f1e2881] [cursor=pointer]:
                    - generic [ref=f1e2986]: Topbar com menu hambúrguer
                  - 'button "Topbar com abas. Barra superior com abas logo abaixo do título (por exemplo: Todos, Recentes, Favoritos). Trocar de aba muda o conteúdo da tela." [ref=f1e2990] [cursor=pointer]':
                    - generic [ref=f1e3080]: Topbar com abas
                  - button "Navegação horizontal rolável. Uma fileira de seções no topo que desliza para o lado, como em portais de notícias. Cabe muitas categorias sem apertar." [ref=f1e3084] [cursor=pointer]:
                    - generic [ref=f1e3179]: Navegação horizontal rolável
                  - 'button "Topbar com busca. A busca é a estrela: um campo grande logo no topo, sempre à mão. Ideal quando as pessoas chegam sabendo o que procuram." [ref=f1e3183] [cursor=pointer]':
                    - generic [ref=f1e3272]: Topbar com busca
                  - button "Header compacto com perfil. Uma barra superior fina com a foto e o nome da pessoa, sem ocupar muito espaço. O conteúdo ganha quase a tela toda." [ref=f1e3276] [cursor=pointer]:
                    - generic [ref=f1e3359]: Header compacto com perfil
              - region "Drawers e menus laterais":
                - generic:
                  - heading "Drawers e menus laterais 5 modelos" [level=3] [ref=f1e3361]:
                    - text: Drawers e menus laterais
                    - generic [ref=f1e3362]: 5 modelos
                  - paragraph [ref=f1e3363]: Menus escondidos que deslizam para dentro da tela.
                - generic:
                  - 'button "Drawer pela esquerda. O clássico menu escondido: toca nas três linhas e um painel desliza da esquerda por cima do conteúdo." [ref=f1e3366] [cursor=pointer]':
                    - generic [ref=f1e3487]: Drawer pela esquerda
                  - button "Drawer pela direita. O menu escondido abre do lado direito, onde o polegar alcança com facilidade em quem segura o celular com a mão direita." [ref=f1e3491] [cursor=pointer]:
                    - generic [ref=f1e3610]: Drawer pela direita
                  - button "Drawer que empurra o conteúdo. Ao abrir o menu, a tela inteira desliza para o lado e revela o menu por baixo, em vez de cobri-la." [ref=f1e3614] [cursor=pointer]:
                    - generic [ref=f1e3735]: Drawer que empurra o conteúdo
                  - button "Bottom Sheet. Uma alça fica visível na parte de baixo; ao tocar ou puxar, um painel sobe com o menu e as opções." [ref=f1e3739] [cursor=pointer]:
                    - generic [ref=f1e3877]: Bottom Sheet
                  - button "Menu deslizante com grupos. Menu lateral que organiza as opções em grupos com títulos, que podem abrir e fechar. Bom para sistemas com muitas páginas." [ref=f1e3881] [cursor=pointer]:
                    - generic [ref=f1e4009]: Menu deslizante com grupos
              - region "Navegação lateral compacta":
                - generic:
                  - heading "Navegação lateral compacta 3 modelos" [level=3] [ref=f1e4011]:
                    - text: Navegação lateral compacta
                    - generic [ref=f1e4012]: 3 modelos
                  - paragraph [ref=f1e4013]: Trilhos finos sempre visíveis na lateral.
                - generic:
                  - button "Mini Sidebar sempre visível. Uma coluna estreita à esquerda, sempre visível, com ícones e nomes pequenos. Não precisa abrir menu para trocar de área." [ref=f1e4016] [cursor=pointer]:
                    - navigation [ref=f1e4036]
                    - generic [ref=f1e4119]: Mini Sidebar sempre visível
                  - button "Sidebar fina expansível. Um trilho fino de ícones à esquerda que se expande, mostrando os nomes, quando a pessoa toca no botão de abrir." [ref=f1e4123] [cursor=pointer]:
                    - navigation [ref=f1e4142]
                    - generic [ref=f1e4245]: Sidebar fina expansível
                  - button "Navegação lateral direita. Uma coluna estreita de ícones e nomes do lado direito da tela, perto do polegar de quem usa o celular com a mão direita." [ref=f1e4249] [cursor=pointer]:
                    - navigation [ref=f1e4331]
                    - generic [ref=f1e4352]: Navegação lateral direita
              - region "Menus de tela cheia":
                - generic:
                  - heading "Menus de tela cheia 4 modelos" [level=3] [ref=f1e4354]:
                    - text: Menus de tela cheia
                    - generic [ref=f1e4355]: 4 modelos
                  - paragraph [ref=f1e4356]: O menu ocupa a tela inteira quando aberto.
                - generic:
                  - button "Menu fullscreen. Ao tocar no menu, ele cobre a tela inteira com links grandes e fáceis de tocar. Simples e muito claro." [ref=f1e4359] [cursor=pointer]:
                    - generic [ref=f1e4472]: Menu fullscreen
                  - button "Menu editorial fullscreen. Menu de tela cheia com tipografia enorme e numerada, como uma capa de revista. Perfeito para portfólios e marcas criativas." [ref=f1e4476] [cursor=pointer]:
                    - generic [ref=f1e4581]: Menu editorial fullscreen
                  - button "Menu em grade de aplicativos. O menu abre uma tela com ícones grandes em grade, como a tela inicial de um celular. Cada ícone leva a uma área." [ref=f1e4585] [cursor=pointer]:
                    - generic [ref=f1e4722]: Menu em grade de aplicativos
                  - button "Menu de comandos. Em vez de procurar no menu, a pessoa toca na busca e digita o que quer fazer. As opções aparecem enquanto ela escreve." [ref=f1e4726] [cursor=pointer]:
                    - generic [ref=f1e4844]: Menu de comandos
              - region "One Screen móvel":
                - generic:
                  - heading "One Screen móvel 4 modelos" [level=3] [ref=f1e4846]:
                    - text: One Screen móvel
                    - generic [ref=f1e4847]: 4 modelos
                  - paragraph [ref=f1e4848]: Tudo cabe na tela do celular, sem rolagem principal.
                - generic:
                  - button "One Screen com Bottom Navigation. Cada tela cabe inteira no celular, sem rolar, organizada em blocos. Embaixo, a barra com os destinos." [ref=f1e4851] [cursor=pointer]:
                    - navigation [ref=f1e4924]
                    - generic [ref=f1e4941]: One Screen com Bottom Navigation
                  - button "One Screen com Sidebar Rail. Tudo cabe na tela, com uma coluna fina de ícones na lateral para trocar de área. Funciona muito bem com o celular deitado." [ref=f1e4945] [cursor=pointer]:
                    - navigation [ref=f1e4965]
                    - generic [ref=f1e5031]: One Screen com Sidebar Rail
                  - 'button "One Screen Kiosk. Tela de autoatendimento: poucos botões enormes, fáceis de tocar e de ler, tudo visível de uma vez." [ref=f1e5035] [cursor=pointer]':
                    - generic [ref=f1e5073]: One Screen Kiosk
                  - button "One Screen com painel em abas. Uma tela única com abas no topo; cada aba troca o painel, que sempre cabe inteiro na tela, sem rolar." [ref=f1e5077] [cursor=pointer]:
                    - generic [ref=f1e5141]: One Screen com painel em abas
            - generic [ref=f1e5143]:
              - generic "Modelo em destaque" [ref=f1e5144]:
                - generic [ref=f1e5145]: Exemplo · ainda não escolhido
                - heading "Bottom Navigation clássica" [level=2] [ref=f1e5150]
                - generic [ref=f1e5151]: Navegação inferior
                - paragraph [ref=f1e5153]: Uma barra fixa embaixo com 4 ícones e os nomes dos destinos principais, sempre ao alcance do polegar. É o padrão mais conhecido de aplicativos.
                - generic [ref=f1e5154]:
                  - button "Escolher este modelo" [ref=f1e5155] [cursor=pointer]
                  - button "Prompt deste elemento" [ref=f1e5158] [cursor=pointer]
              - generic [ref=f1e5162]:
                - 'group "Prévia do celular: Bottom Navigation clássica" [ref=f1e5163]':
                  - generic [ref=f1e5165]:
                    - generic [ref=f1e5166]:
                      - generic [ref=f1e5167]: 10:24
                      - generic [ref=f1e5178]:
                        - generic [ref=f1e5179]: Início
                        - button "Notificações" [ref=f1e5180] [cursor=pointer]
                      - generic [ref=f1e5187]:
                        - generic [ref=f1e5188]:
                          - generic [ref=f1e5189]:
                            - generic [ref=f1e5190]: Saldo do mês
                            - generic [ref=f1e5191]: +8,2%
                          - generic [ref=f1e5193]: R$ 12.480
                        - generic [ref=f1e5197]:
                          - generic [ref=f1e5198]:
                            - generic [ref=f1e5204]: Pedidos
                            - generic [ref=f1e5205]: "128"
                          - generic [ref=f1e5206]:
                            - generic [ref=f1e5213]: Clientes
                            - generic [ref=f1e5214]: "64"
                        - generic [ref=f1e5215]:
                          - generic [ref=f1e5216]: Atividade recente
                          - generic [ref=f1e5217]: Ver tudo
                        - generic [ref=f1e5218]:
                          - generic [ref=f1e5219]:
                            - generic [ref=f1e5220]: P1
                            - generic [ref=f1e5221]:
                              - generic [ref=f1e5222]: "Pedido #1042"
                              - generic [ref=f1e5223]: Confirmado há 5 min
                            - generic [ref=f1e5224]: R$ 289
                          - generic [ref=f1e5225]:
                            - generic [ref=f1e5226]: MA
                            - generic [ref=f1e5227]:
                              - generic [ref=f1e5228]: Marina Alves
                              - generic [ref=f1e5229]: Nova cliente
                            - generic [ref=f1e5230]: Hoje
                          - generic [ref=f1e5231]:
                            - generic [ref=f1e5232]: RS
                            - generic [ref=f1e5233]:
                              - generic [ref=f1e5234]: Relatório semanal
                              - generic [ref=f1e5235]: Pronto para baixar
                            - generic [ref=f1e5236]: PDF
                          - generic [ref=f1e5237]:
                            - generic [ref=f1e5238]: RE
                            - generic [ref=f1e5239]:
                              - generic [ref=f1e5240]: Reunião de equipe
                              - generic [ref=f1e5241]: Amanhã, 9h
                            - generic [ref=f1e5242]: 9:00
                          - generic [ref=f1e5243]:
                            - generic [ref=f1e5244]: PG
                            - generic [ref=f1e5245]:
                              - generic [ref=f1e5246]: Pagamento recebido
                              - generic [ref=f1e5247]: Cartão final 4821
                            - generic [ref=f1e5248]: R$ 1.200
                          - generic [ref=f1e5249]:
                            - generic [ref=f1e5250]: ES
                            - generic [ref=f1e5251]:
                              - generic [ref=f1e5252]: Estoque atualizado
                              - generic [ref=f1e5253]: 12 itens repostos
                            - generic [ref=f1e5254]: "+12"
                      - navigation [ref=f1e5255]:
                        - button "Início" [ref=f1e5256] [cursor=pointer]
                        - button "Buscar" [ref=f1e5262] [cursor=pointer]
                        - button "Agenda" [ref=f1e5268] [cursor=pointer]
                        - button "Perfil" [ref=f1e5273] [cursor=pointer]
                    - generic [aria-hidden]: HEADER
                    - generic [aria-hidden]: CONTEÚDO
                    - generic [aria-hidden]: MENU INFERIOR
                - paragraph [ref=f1e5279]: "Toque nos botões do celular: menus abrem e fecham como no site de verdade."
  - status
```

# Test source

```ts
  820  | })
  821  | 
  822  | test.describe('REG-16 · Conteúdo não fica encoberto pela barra fixa inferior', () => {
  823  |   test('guiado 1440×900: "Prompt da identidade" e "CSS dos tokens" ficam acima do rodapé fixo', async ({ page }) => {
  824  |     test.fail(true, `REG-16: o painel fixo da prévia de identidade termina sob o rodapé do guiado (botões cobertos) ${VER}`)
  825  |     await seed(page, { guided: { skeletonApproved: true, step: 'identidade' } })
  826  |     await go(page, '/guiado/identidade')
  827  |     for (const name of ['Prompt da identidade', 'CSS dos tokens']) {
  828  |       for (const y of [600, 2500]) {
  829  |         await page.evaluate((y) => window.scrollTo(0, y), y)
  830  |         await page.waitForTimeout(250)
  831  |         const h = await hitInfo(page.getByRole('button', { name }))
  832  |         expect(h.own, `${name} em scrollY=${y}: coberto por ${h.cover}`).toBe(true)
  833  |       }
  834  |     }
  835  |   })
  836  | 
  837  |   test('guiado 1440×900 (etapa 4): a base do celular grande fixo não fica sob o rodapé', async ({ page }) => {
  838  |     test.fail(true, `REG-16: a altura do celular grande ignora o rodapé do guiado; 23 px da base (barra inferior da prévia) ficam cobertos ${VER}`)
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
> 920  |         expect(listW, 'largura da coluna de miniaturas').toBeGreaterThanOrEqual(128)
       |                                                          ^ Error: largura da coluna de miniaturas
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
```