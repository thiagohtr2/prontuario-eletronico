# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-04 · Botões grudados ou sobrepostos >> tablet 768×1024 >> "Escolher este modelo" do celular grande não fica por cima das miniaturas
- Location: tests/e2e/regression.spec.ts:378:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "mobile-option-bottom-nav-classica",
+ ]
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
  288 |     await page.getByTestId('component-category-tabelas').click()
  289 |     await page.getByTestId('add-component-soft-pill').click()
  290 |     const editor = page.getByTestId('component-editor')
  291 |     const shown = (await editor.getByRole('group', { name: 'Densidade' }).locator('[aria-pressed="true"]').textContent())?.trim()
  292 |     expect(shown).toBe('Padrão')
  293 |     await page.keyboard.press('Escape')
  294 |     const prompt = await masterPrompt(page)
  295 |     const said = prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()
  296 |     expect(said?.toLowerCase(), 'densidade no prompt').toBe('padrão')
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
> 388 |       expect(overlapping).toEqual([])
      |                           ^ Error: expect(received).toEqual(expected) // deep equality
  389 |     })
  390 |   })
  391 | })
  392 | 
  393 | test.describe('REG-05 · Cartões sem ações duplicadas', () => {
  394 |   const ALL = [...GALLERIES, { route: '/modulos/componentes', prefix: 'family-option-' }, { route: '/modulos/templates', prefix: 'template-option-' }, { route: '/modulos/inspiracao', prefix: 'inspiration-option-' }]
  395 |   async function actions(page: Page, prefix: string) {
  396 |     return page.locator(`[data-testid^="${prefix}"]`).evaluateAll((cards) =>
  397 |       cards.slice(0, 8).map((c) => {
  398 |         const btns = Array.from(c.querySelectorAll<HTMLElement>('button, a[href], [role=button]')).filter((b) => !b.closest('.nvs-card__preview, .ui-option__media'))
  399 |         const names = btns.map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase())
  400 |         return {
  401 |           id: (c as HTMLElement).dataset.testid,
  402 |           duplicated: names.filter((n, i) => n && names.indexOf(n) !== i),
  403 |           selectControls: btns.filter((b, i) => (b.hasAttribute('aria-pressed') && !b.closest('.ui-segmented')) || /^(selecionar|escolher|usar este|aplicar)/.test(names[i])).length,
  404 |         }
  405 |       }),
  406 |     )
  407 |   }
  408 |   for (const [label, use] of [['desktop 1440', {}], ['celular 360', MOBILE]] as const) {
  409 |     test.describe(label, () => {
  410 |       test.use(use)
  411 |       test('cada cartão tem uma única ação de seleção e nenhum rótulo repetido', async ({ page }) => {
  412 |         test.setTimeout(120_000)
  413 |         await freshStart(page)
  414 |         for (const g of ALL) {
  415 |           await openGallery(page, g as (typeof GALLERIES)[number])
  416 |           for (const a of await actions(page, g.prefix)) {
  417 |             expect(a.duplicated, `${a.id}: ações repetidas`).toEqual([])
  418 |             expect(a.selectControls, `${a.id}: controles de seleção`).toBeLessThanOrEqual(1)
  419 |           }
  420 |         }
  421 |       })
  422 |     })
  423 |   }
  424 | })
  425 | 
  426 | test.describe('REG-06 · Sidebar do Studio com largura adequada', () => {
  427 |   test('desktop 1440: sidebar ≥ 240 px e nenhum rótulo cortado', async ({ page }) => {
  428 |     await freshStart(page)
  429 |     await go(page, '/modulos/desktop')
  430 |     const sb = await page.locator('#studio-sidebar').evaluate((s) => {
  431 |       const links = Array.from(s.querySelectorAll<HTMLElement>('a'))
  432 |       return {
  433 |         w: s.getBoundingClientRect().width,
  434 |         cut: links.filter((a) => a.scrollWidth > a.clientWidth + 1 || Array.from(a.querySelectorAll<HTMLElement>('span')).some((x) => x.scrollWidth > x.clientWidth + 1)).map((a) => a.textContent),
  435 |         minFont: Math.min(...links.map((a) => parseFloat(getComputedStyle(a).fontSize))),
  436 |       }
  437 |     })
  438 |     expect(sb.w).toBeGreaterThanOrEqual(240)
  439 |     expect(sb.cut).toEqual([])
  440 |     expect(sb.minFont).toBeGreaterThanOrEqual(13)
  441 |   })
  442 | 
  443 |   test.describe('celular 360×800', () => {
  444 |     test.use(MOBILE)
  445 |     test('drawer ≥ 280 px, ≤ 90% da tela e itens com 44 px de altura', async ({ page }) => {
  446 |       await freshStart(page)
  447 |       await page.getByRole('button', { name: 'Abrir menu' }).tap()
  448 |       const sidebar = page.locator('#studio-sidebar')
  449 |       await expect(sidebar).toHaveAttribute('data-open', 'true')
  450 |       const d = await sidebar.evaluate((s) => ({
  451 |         w: s.getBoundingClientRect().width,
  452 |         minH: Math.min(...Array.from(s.querySelectorAll('a')).map((a) => a.getBoundingClientRect().height)),
  453 |         cut: Array.from(s.querySelectorAll<HTMLElement>('a')).filter((a) => a.scrollWidth > a.clientWidth + 1).length,
  454 |       }))
  455 |       expect(d.w).toBeGreaterThanOrEqual(280)
  456 |       expect(d.w).toBeLessThanOrEqual(360 * 0.9)
  457 |       expect(d.minH).toBeGreaterThanOrEqual(44)
  458 |       expect(d.cut).toBe(0)
  459 |     })
  460 |   })
  461 | })
  462 | 
  463 | test.describe('REG-07 · Filtros com letras legíveis', () => {
  464 |   const ROUTES_WITH_FILTERS = ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/inspiracao', '/modulos/templates', '/prompt']
  465 |   async function smallestFilterFont(page: Page) {
  466 |     return page.evaluate(() => {
  467 |       const out: { t: string; fs: number }[] = []
  468 |       for (const el of Array.from(document.querySelectorAll<HTMLElement>('.ui-chip, [role=tablist] [role=tab], select, .ui-segmented button, .cmp-nav__item'))) {
  469 |         const r = el.getBoundingClientRect()
  470 |         if (!r.width || el.closest('[data-testid="identity-preview"], .nvs-card__preview, .ui-option__media, [data-testid="phone-preview"], [data-testid="live-preview"]')) continue
  471 |         const sizes = [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))].filter((x) => x.textContent?.trim()).map((x) => parseFloat(getComputedStyle(x).fontSize))
  472 |         out.push({ t: el.textContent!.trim().slice(0, 24), fs: Math.min(...sizes) })
  473 |       }
  474 |       return out.sort((a, b) => a.fs - b.fs)[0]
  475 |     })
  476 |   }
  477 |   for (const [label, use] of [['desktop 1440', {}], ['celular 360', MOBILE]] as const) {
  478 |     test.describe(label, () => {
  479 |       test.use(use)
  480 |       test('nenhum texto de filtro, aba ou contador abaixo de 12 px', async ({ page }) => {
  481 |         test.setTimeout(120_000)
  482 |         await freshStart(page)
  483 |         for (const r of ROUTES_WITH_FILTERS) {
  484 |           await go(page, r)
  485 |           const s = await smallestFilterFont(page)
  486 |           if (s) expect(s.fs, `${r}: "${s.t}"`).toBeGreaterThanOrEqual(12)
  487 |         }
  488 |       })
```