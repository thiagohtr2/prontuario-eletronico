# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-16 · Conteúdo não fica encoberto pela barra fixa inferior >> guiado 1440×900 (etapa 4): a base do celular grande fixo não fica sob o rodapé
- Location: tests/e2e/regression.spec.ts:837:3

# Error details

```
Error: base do celular grande × topo do rodapé

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 835
Received:    858
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
          - listitem [ref=f1e244]: ›Construtor guiado
          - listitem [ref=f1e245]: ›Arquitetura do celular
      - generic [ref=f1e246]:
        - navigation "Etapas do construtor guiado" [ref=f1e247]:
          - generic [ref=f1e248]:
            - generic [ref=f1e249]: Esqueleto
            - list [ref=f1e253]:
              - listitem [ref=f1e254]:
                - button "1. Objetivo" [ref=f1e255] [cursor=pointer]
              - listitem [ref=f1e258]:
                - button "2. Entrada" [ref=f1e259] [cursor=pointer]
              - listitem [ref=f1e262]:
                - button "3. Desktop" [ref=f1e263] [cursor=pointer]
              - listitem [ref=f1e266]:
                - button "4. Mobile" [ref=f1e267] [cursor=pointer]
              - listitem [ref=f1e270]:
                - button "5. Revisão" [ref=f1e271] [cursor=pointer]
          - generic [ref=f1e274]:
            - generic [ref=f1e275]:
              - text: Acabamento
              - generic [ref=f1e279]: · libera após aprovar o esqueleto
            - list [ref=f1e280]:
              - listitem [ref=f1e281]:
                - button "6. Prévia" [disabled] [ref=f1e282]
              - listitem [ref=f1e285]:
                - button "7. Cores" [disabled] [ref=f1e286]
              - listitem [ref=f1e289]:
                - button "8. Navegação" [disabled] [ref=f1e290]
              - listitem [ref=f1e293]:
                - button "9. Componentes" [disabled] [ref=f1e294]
              - listitem [ref=f1e297]:
                - button "10. Entrega" [disabled] [ref=f1e298]
        - generic [ref=f1e301]:
          - generic [ref=f1e302]: Etapa 4 de 10 · Esqueleto
          - heading "Arquitetura do celular" [level=1] [ref=f1e303]
          - paragraph [ref=f1e304]: "Escolha como o site se organiza no celular. É uma decisão separada do computador: um menu lateral não precisa virar gaveta no celular."
        - generic [ref=f1e305]:
          - generic [ref=f1e306]:
            - generic [ref=f1e307] [cursor=pointer]:
              - switch "Mostrar legendas nos desenhos" [checked] [ref=f1e308]
              - generic [ref=f1e310]: Mostrar legendas nos desenhos
            - generic "O que significam as etiquetas" [ref=f1e311]:
              - generic [ref=f1e312]:
                - generic: HEADER
                - button "barra superior" [ref=f1e314]
              - generic [ref=f1e315]:
                - generic: MENU INFERIOR
                - button "menu embaixo" [ref=f1e317]
              - generic [ref=f1e318]:
                - generic: DRAWER
                - button "menu que desliza" [ref=f1e320]
              - generic [ref=f1e321]:
                - generic: CONTEÚDO
                - text: o que a pessoa vê e usa
          - generic [ref=f1e325]:
            - strong [ref=f1e326]: O celular tem arquitetura própria.
            - text: "Escolha aqui como o site funciona no celular. O menu lateral do computador não vira automaticamente um drawer: o que valer no celular é o que você escolher nesta página."
          - generic [ref=f1e327]:
            - group "Grupos de navegação móvel" [ref=f1e328]:
              - button "Todos 44" [pressed] [ref=f1e329] [cursor=pointer]:
                - text: Todos
                - generic [ref=f1e330]: "44"
              - button "Navegação inferior 6" [ref=f1e331] [cursor=pointer]:
                - text: Navegação inferior
                - generic [ref=f1e332]: "6"
              - button "Headers e menus flutuantes 8" [ref=f1e333] [cursor=pointer]:
                - text: Headers e menus flutuantes
                - generic [ref=f1e334]: "8"
              - button "Layouts híbridos 9" [ref=f1e335] [cursor=pointer]:
                - text: Layouts híbridos
                - generic [ref=f1e336]: "9"
              - button "Navegação superior 5" [ref=f1e337] [cursor=pointer]:
                - text: Navegação superior
                - generic [ref=f1e338]: "5"
              - button "Drawers e menus laterais 5" [ref=f1e339] [cursor=pointer]:
                - text: Drawers e menus laterais
                - generic [ref=f1e340]: "5"
              - button "Navegação lateral compacta 3" [ref=f1e341] [cursor=pointer]:
                - text: Navegação lateral compacta
                - generic [ref=f1e342]: "3"
              - button "Menus de tela cheia 4" [ref=f1e343] [cursor=pointer]:
                - text: Menus de tela cheia
                - generic [ref=f1e344]: "4"
              - button "One Screen móvel 4" [ref=f1e345] [cursor=pointer]:
                - text: One Screen móvel
                - generic [ref=f1e346]: "4"
            - paragraph [ref=f1e347]: 44 modelos em 8 grupos. Toque em um modelo para ver no celular grande.
          - generic [ref=f1e348]:
            - generic [ref=f1e349]:
              - region "Navegação inferior" [ref=f1e350]:
                - generic [ref=f1e351]:
                  - heading "Navegação inferior 6 modelos" [level=3] [ref=f1e352]:
                    - text: Navegação inferior
                    - generic [ref=f1e353]: 6 modelos
                  - paragraph [ref=f1e354]: O menu fica embaixo, onde o polegar alcança. É o jeito mais confortável para apps usados todo dia.
                - generic [ref=f1e355]:
                  - button "Bottom Navigation clássica. Uma barra fixa embaixo com 4 ícones e os nomes dos destinos principais, sempre ao alcance do polegar. É o padrão mais conhecido de aplicativos." [ref=f1e358] [cursor=pointer]:
                    - navigation [ref=f1e440]
                    - generic [ref=f1e457]: Bottom Navigation clássica
                  - button "Bottom Navigation com cinco destinos. A barra inferior com cinco destinos, por exemplo Início, Buscar, Categorias, Carrinho e Conta. Ideal para lojas e apps com várias áreas." [ref=f1e461] [cursor=pointer]:
                    - navigation [ref=f1e543]
                    - generic [ref=f1e565]: Bottom Navigation com cinco destinos
                  - button "Dock flutuante. O menu de baixo vira uma “ilha” arredondada, afastada das bordas, flutuando sobre o conteúdo. Moderno e leve." [ref=f1e569] [cursor=pointer]:
                    - navigation [ref=f1e651]
                    - generic [ref=f1e668]: Dock flutuante
                  - button "Bottom com ação central. Barra inferior com um botão redondo de destaque no meio, para a ação mais importante, como “Novo” ou “Publicar”." [ref=f1e672] [cursor=pointer]:
                    - navigation [ref=f1e754]
                    - generic [ref=f1e774]: Bottom com ação central
                  - button "Bottom minimalista. Uma barra inferior bem discreta, só com ícones e um pontinho no item ativo. Deixa o conteúdo e as imagens em primeiro plano." [ref=f1e778] [cursor=pointer]:
                    - navigation [ref=f1e858]
                    - generic [ref=f1e875]: Bottom minimalista
                  - button "Bottom com título superior. Barra inferior clássica combinada com um título grande no topo de cada tela, que diminui quando a pessoa rola." [ref=f1e879] [cursor=pointer]:
                    - navigation [ref=f1e963]
                    - generic [ref=f1e980]: Bottom com título superior
              - region "Headers e menus flutuantes" [ref=f1e982]:
                - generic [ref=f1e983]:
                  - heading "Headers e menus flutuantes 8 modelos" [level=3] [ref=f1e984]:
                    - text: Headers e menus flutuantes
                    - generic [ref=f1e985]: 8 modelos
                  - paragraph [ref=f1e986]: Barras soltas das bordas, como ilhas arredondadas. Visual moderno; o conteúdo aparece por trás.
                - generic [ref=f1e987]:
                  - button "Topbar flutuante compacta. Uma barra superior pequena e arredondada, afastada das bordas, com logo e um botão de menu que abre uma lista curta de links." [ref=f1e990] [cursor=pointer]:
                    - generic [ref=f1e1095]: Topbar flutuante compacta
                  - button "Topbar flutuante com drawer esquerdo. Barra superior flutuante com um botão de menu à esquerda. Ao tocar, um menu lateral desliza pela esquerda." [ref=f1e1099] [cursor=pointer]:
                    - generic [ref=f1e1220]: Topbar flutuante com drawer esquerdo
                  - button "Topbar flutuante com drawer direito. Barra superior flutuante com o botão de menu do lado direito, mais fácil de alcançar com o polegar. O menu desliza pela direita." [ref=f1e1224] [cursor=pointer]:
                    - generic [ref=f1e1343]: Topbar flutuante com drawer direito
                  - 'button "Topbar flutuante com dock inferior. Duas ilhas: uma barra flutuante no topo e um dock flutuante embaixo. O conteúdo passa por trás das duas." [ref=f1e1347] [cursor=pointer]':
                    - navigation [ref=f1e1431]
                    - generic [ref=f1e1448]: Topbar flutuante com dock inferior
                  - button "Topbar como ilha central com dock pill. No topo, uma pequena cápsula central com o título; embaixo, um menu em forma de pílula só com ícones. Visual limpo e marcante." [ref=f1e1452] [cursor=pointer]:
                    - navigation [ref=f1e1533]
                    - generic [ref=f1e1542]: Topbar como ilha central com dock pill
                  - button "Menu inferior pill com ícones. Um menu flutuante em forma de pílula na parte de baixo. O item ativo se expande e mostra o nome; os outros mostram só o ícone." [ref=f1e1546] [cursor=pointer]:
                    - navigation [ref=f1e1628]
                    - generic [ref=f1e1638]: Menu inferior pill com ícones
                  - 'button "Dock inferior transparente. Um dock flutuante translúcido, como vidro fosco: dá para ver o conteúdo passando por trás. Fica bonito com fotos e cores." [ref=f1e1642] [cursor=pointer]':
                    - navigation [ref=f1e1722]
                    - generic [ref=f1e1739]: Dock inferior transparente
                  - button "Menu flutuante inferior compacto. Um único botão redondo flutuando no canto de baixo. Ao tocar, ele abre uma pequena lista de ações rápidas acima dele." [ref=f1e1743] [cursor=pointer]:
                    - generic [ref=f1e1843]: Menu flutuante inferior compacto
              - region "Layouts híbridos" [ref=f1e1845]:
                - generic [ref=f1e1846]:
                  - heading "Layouts híbridos 9 modelos" [level=3] [ref=f1e1847]:
                    - text: Layouts híbridos
                    - generic [ref=f1e1848]: 9 modelos
                  - paragraph [ref=f1e1849]: "Combinações: barra no topo, faixa de destaques, menu flutuante embaixo e menus extras."
                - generic [ref=f1e1850]:
                  - button "Stories fixos com dock flutuante. No topo, uma faixa de círculos com destaques que desliza para o lado; embaixo, um menu flutuante arredondado." [ref=f1e1853] [cursor=pointer]:
                    - navigation [ref=f1e1966]
                    - generic [ref=f1e1983]: Stories fixos com dock flutuante
                  - button "Stories com dock e drawer lateral. Faixa de destaques no topo, menu flutuante embaixo e, para as opções menos usadas, um menu lateral que abre pelo botão de menu." [ref=f1e1987] [cursor=pointer]:
                    - navigation [ref=f1e2098]
                    - generic [ref=f1e2115]: Stories com dock e drawer lateral
                  - button "Stories com dock translúcido. Faixa de destaques no topo e um dock embaixo com efeito de vidro fosco, deixando ver o conteúdo por trás." [ref=f1e2119] [cursor=pointer]:
                    - navigation [ref=f1e2232]
                    - generic [ref=f1e2249]: Stories com dock translúcido
                  - button "Header fixo com busca e menu inferior flutuante. Barra superior fixa com campo de busca, logo abaixo uma faixa de categorias que desliza para o lado e um menu flutuante arredondado embaixo." [ref=f1e2253] [cursor=pointer]:
                    - navigation [ref=f1e2361]
                    - generic [ref=f1e2378]: Header fixo com busca e menu inferior flutuante
                  - button "Topbar com Bottom Navigation. Barra superior com logo e atalhos (busca, notificações) e barra inferior com os destinos principais. Equilíbrio entre marca e navegação." [ref=f1e2382] [cursor=pointer]:
                    - navigation [ref=f1e2469]
                    - generic [ref=f1e2486]: Topbar com Bottom Navigation
                  - button "Bottom Navigation com drawer de opções. Barra inferior com quatro destinos e um botão “Mais” que abre um painel de baixo para cima com as demais opções." [ref=f1e2490] [cursor=pointer]:
                    - navigation [ref=f1e2571]
                    - generic [ref=f1e2588]: Bottom Navigation com drawer de opções
                  - button "Header com menu de perfil. Barra superior com saudação e a foto da pessoa; tocar na foto abre um menu da conta. Embaixo, a barra com os destinos principais." [ref=f1e2592] [cursor=pointer]:
                    - navigation [ref=f1e2678]
                    - generic [ref=f1e2721]: Header com menu de perfil
                  - button "Rail com menu inferior. Uma coluna fina de ícones na lateral para filtros ou atalhos e a barra inferior para os destinos principais." [ref=f1e2725] [cursor=pointer]:
                    - generic [ref=f1e2731]:
                      - navigation [ref=f1e2745]
                      - navigation [ref=f1e2820]
                    - generic [ref=f1e2837]: Rail com menu inferior
                  - 'button "Menu compacto adaptável. Um menu pequeno flutuando embaixo com três atalhos e um botão “mais”. Ele se adapta: vira trilho lateral quando o celular está deitado." [ref=f1e2841] [cursor=pointer]':
                    - navigation [ref=f1e2922]
                    - generic [ref=f1e2932]: Menu compacto adaptável
              - region "Navegação superior" [ref=f1e2934]:
                - generic [ref=f1e2935]:
                  - heading "Navegação superior 5 modelos" [level=3] [ref=f1e2936]:
                    - text: Navegação superior
                    - generic [ref=f1e2937]: 5 modelos
                  - paragraph [ref=f1e2938]: "Tudo no topo: abas, busca ou o botão de menu. Bom para sites e conteúdos para ler."
                - generic [ref=f1e2939]:
                  - button "Topbar com menu hambúrguer. Barra superior com o ícone de três linhas. Ao tocar, o menu desce do topo, logo abaixo da barra, com os links do site." [ref=f1e2942] [cursor=pointer]:
                    - generic [ref=f1e3047]: Topbar com menu hambúrguer
                  - 'button "Topbar com abas. Barra superior com abas logo abaixo do título (por exemplo: Todos, Recentes, Favoritos). Trocar de aba muda o conteúdo da tela." [ref=f1e3051] [cursor=pointer]':
                    - generic [ref=f1e3141]: Topbar com abas
                  - button "Navegação horizontal rolável. Uma fileira de seções no topo que desliza para o lado, como em portais de notícias. Cabe muitas categorias sem apertar." [ref=f1e3145] [cursor=pointer]:
                    - generic [ref=f1e3240]: Navegação horizontal rolável
                  - 'button "Topbar com busca. A busca é a estrela: um campo grande logo no topo, sempre à mão. Ideal quando as pessoas chegam sabendo o que procuram." [ref=f1e3244] [cursor=pointer]':
                    - generic [ref=f1e3333]: Topbar com busca
                  - button "Header compacto com perfil. Uma barra superior fina com a foto e o nome da pessoa, sem ocupar muito espaço. O conteúdo ganha quase a tela toda." [ref=f1e3337] [cursor=pointer]:
                    - generic [ref=f1e3420]: Header compacto com perfil
              - region "Drawers e menus laterais" [ref=f1e3422]:
                - generic [ref=f1e3423]:
                  - heading "Drawers e menus laterais 5 modelos" [level=3] [ref=f1e3424]:
                    - text: Drawers e menus laterais
                    - generic [ref=f1e3425]: 5 modelos
                  - paragraph [ref=f1e3426]: Menus escondidos que deslizam para dentro da tela quando a pessoa toca no botão.
                - generic [ref=f1e3427]:
                  - 'button "Drawer pela esquerda. O clássico menu escondido: toca nas três linhas e um painel desliza da esquerda por cima do conteúdo." [ref=f1e3430] [cursor=pointer]':
                    - generic [ref=f1e3551]: Drawer pela esquerda
                  - button "Drawer pela direita. O menu escondido abre do lado direito, onde o polegar alcança com facilidade em quem segura o celular com a mão direita." [ref=f1e3555] [cursor=pointer]:
                    - generic [ref=f1e3674]: Drawer pela direita
                  - button "Drawer que empurra o conteúdo. Ao abrir o menu, a tela inteira desliza para o lado e revela o menu por baixo, em vez de cobri-la." [ref=f1e3678] [cursor=pointer]:
                    - generic [ref=f1e3799]: Drawer que empurra o conteúdo
                  - button "Bottom Sheet. Uma alça fica visível na parte de baixo; ao tocar ou puxar, um painel sobe com o menu e as opções." [ref=f1e3803] [cursor=pointer]:
                    - generic [ref=f1e3941]: Bottom Sheet
                  - button "Menu deslizante com grupos. Menu lateral que organiza as opções em grupos com títulos, que podem abrir e fechar. Bom para sistemas com muitas páginas." [ref=f1e3945] [cursor=pointer]:
                    - generic [ref=f1e4073]: Menu deslizante com grupos
              - region "Navegação lateral compacta" [ref=f1e4075]:
                - generic [ref=f1e4076]:
                  - heading "Navegação lateral compacta 3 modelos" [level=3] [ref=f1e4077]:
                    - text: Navegação lateral compacta
                    - generic [ref=f1e4078]: 3 modelos
                  - paragraph [ref=f1e4079]: Uma coluna fina de ícones sempre visível na lateral, sem precisar abrir menus.
                - generic [ref=f1e4080]:
                  - button "Mini Sidebar sempre visível. Uma coluna estreita à esquerda, sempre visível, com ícones e nomes pequenos. Não precisa abrir menu para trocar de área." [ref=f1e4083] [cursor=pointer]:
                    - navigation [ref=f1e4103]
                    - generic [ref=f1e4186]: Mini Sidebar sempre visível
                  - button "Sidebar fina expansível. Um trilho fino de ícones à esquerda que se expande, mostrando os nomes, quando a pessoa toca no botão de abrir." [ref=f1e4190] [cursor=pointer]:
                    - navigation [ref=f1e4209]
                    - generic [ref=f1e4312]: Sidebar fina expansível
                  - button "Navegação lateral direita. Uma coluna estreita de ícones e nomes do lado direito da tela, perto do polegar de quem usa o celular com a mão direita." [ref=f1e4316] [cursor=pointer]:
                    - navigation [ref=f1e4398]
                    - generic [ref=f1e4419]: Navegação lateral direita
              - region "Menus de tela cheia" [ref=f1e4421]:
                - generic [ref=f1e4422]:
                  - heading "Menus de tela cheia 4 modelos" [level=3] [ref=f1e4423]:
                    - text: Menus de tela cheia
                    - generic [ref=f1e4424]: 4 modelos
                  - paragraph [ref=f1e4425]: Ao abrir, o menu ocupa a tela inteira, com opções grandes e fáceis de tocar.
                - generic [ref=f1e4426]:
                  - button "Menu fullscreen. Ao tocar no menu, ele cobre a tela inteira com links grandes e fáceis de tocar. Simples e muito claro." [ref=f1e4429] [cursor=pointer]:
                    - generic [ref=f1e4542]: Menu fullscreen
                  - button "Menu editorial fullscreen. Menu de tela cheia com tipografia enorme e numerada, como uma capa de revista. Perfeito para portfólios e marcas criativas." [ref=f1e4546] [cursor=pointer]:
                    - generic [ref=f1e4651]: Menu editorial fullscreen
                  - button "Menu em grade de aplicativos. O menu abre uma tela com ícones grandes em grade, como a tela inicial de um celular. Cada ícone leva a uma área." [ref=f1e4655] [cursor=pointer]:
                    - generic [ref=f1e4792]: Menu em grade de aplicativos
                  - button "Menu de comandos. Em vez de procurar no menu, a pessoa toca na busca e digita o que quer fazer. As opções aparecem enquanto ela escreve." [ref=f1e4796] [cursor=pointer]:
                    - generic [ref=f1e4914]: Menu de comandos
              - region "One Screen móvel" [ref=f1e4916]:
                - generic [ref=f1e4917]:
                  - heading "One Screen móvel 4 modelos" [level=3] [ref=f1e4918]:
                    - text: One Screen móvel
                    - generic [ref=f1e4919]: 4 modelos
                  - paragraph [ref=f1e4920]: Cada tela cabe inteira no celular, sem rolar. Para consultas rápidas, controles e quiosques.
                - generic [ref=f1e4921]:
                  - button "One Screen com Bottom Navigation. Cada tela cabe inteira no celular, sem rolar, organizada em blocos. Embaixo, a barra com os destinos." [ref=f1e4924] [cursor=pointer]:
                    - navigation [ref=f1e4997]
                    - generic [ref=f1e5014]: One Screen com Bottom Navigation
                  - button "One Screen com Sidebar Rail. Tudo cabe na tela, com uma coluna fina de ícones na lateral para trocar de área. Funciona muito bem com o celular deitado." [ref=f1e5018] [cursor=pointer]:
                    - navigation [ref=f1e5038]
                    - generic [ref=f1e5104]: One Screen com Sidebar Rail
                  - 'button "One Screen Kiosk. Tela de autoatendimento: poucos botões enormes, fáceis de tocar e de ler, tudo visível de uma vez." [ref=f1e5108] [cursor=pointer]':
                    - generic [ref=f1e5146]: One Screen Kiosk
                  - button "One Screen com painel em abas. Uma tela única com abas no topo; cada aba troca o painel, que sempre cabe inteiro na tela, sem rolar." [ref=f1e5150] [cursor=pointer]:
                    - generic [ref=f1e5214]: One Screen com painel em abas
            - generic [ref=f1e5216]:
              - generic "Modelo em destaque" [ref=f1e5217]:
                - generic [ref=f1e5218]: Exemplo · ainda não escolhido
                - heading "Bottom Navigation clássica" [level=2] [ref=f1e5223]
                - generic [ref=f1e5224]: Navegação inferior
                - paragraph [ref=f1e5226]: Uma barra fixa embaixo com 4 ícones e os nomes dos destinos principais, sempre ao alcance do polegar. É o padrão mais conhecido de aplicativos.
                - paragraph [ref=f1e5227]:
                  - strong [ref=f1e5228]: "Combina com:"
                  - text: Aplicativos e SaaS · Uso diário · Até 4 destinos
                - generic [ref=f1e5229]:
                  - button "Escolher este modelo" [ref=f1e5230] [cursor=pointer]
                  - button "Prompt deste elemento" [ref=f1e5233] [cursor=pointer]
              - generic [ref=f1e5237]:
                - 'group "Prévia do celular: Bottom Navigation clássica" [ref=f1e5238]':
                  - generic [ref=f1e5240]:
                    - generic [ref=f1e5241]:
                      - generic [ref=f1e5242]: 10:24
                      - generic [ref=f1e5253]:
                        - generic [ref=f1e5254]: Início
                        - button "Notificações" [ref=f1e5255] [cursor=pointer]
                      - generic [ref=f1e5262]:
                        - generic [ref=f1e5263]:
                          - generic [ref=f1e5264]:
                            - generic [ref=f1e5265]: Saldo do mês
                            - generic [ref=f1e5266]: +8,2%
                          - generic [ref=f1e5268]: R$ 12.480
                        - generic [ref=f1e5272]:
                          - generic [ref=f1e5273]:
                            - generic [ref=f1e5279]: Pedidos
                            - generic [ref=f1e5280]: "128"
                          - generic [ref=f1e5281]:
                            - generic [ref=f1e5288]: Clientes
                            - generic [ref=f1e5289]: "64"
                        - generic [ref=f1e5290]:
                          - generic [ref=f1e5291]: Atividade recente
                          - generic [ref=f1e5292]: Ver tudo
                        - generic [ref=f1e5293]:
                          - generic [ref=f1e5294]:
                            - generic [ref=f1e5295]: P1
                            - generic [ref=f1e5296]:
                              - generic [ref=f1e5297]: "Pedido #1042"
                              - generic [ref=f1e5298]: Confirmado há 5 min
                            - generic [ref=f1e5299]: R$ 289
                          - generic [ref=f1e5300]:
                            - generic [ref=f1e5301]: MA
                            - generic [ref=f1e5302]:
                              - generic [ref=f1e5303]: Marina Alves
                              - generic [ref=f1e5304]: Nova cliente
                            - generic [ref=f1e5305]: Hoje
                          - generic [ref=f1e5306]:
                            - generic [ref=f1e5307]: RS
                            - generic [ref=f1e5308]:
                              - generic [ref=f1e5309]: Relatório semanal
                              - generic [ref=f1e5310]: Pronto para baixar
                            - generic [ref=f1e5311]: PDF
                          - generic [ref=f1e5312]:
                            - generic [ref=f1e5313]: RE
                            - generic [ref=f1e5314]:
                              - generic [ref=f1e5315]: Reunião de equipe
                              - generic [ref=f1e5316]: Amanhã, 9h
                            - generic [ref=f1e5317]: 9:00
                          - generic [ref=f1e5318]:
                            - generic [ref=f1e5319]: PG
                            - generic [ref=f1e5320]:
                              - generic [ref=f1e5321]: Pagamento recebido
                              - generic [ref=f1e5322]: Cartão final 4821
                            - generic [ref=f1e5323]: R$ 1.200
                          - generic [ref=f1e5324]:
                            - generic [ref=f1e5325]: ES
                            - generic [ref=f1e5326]:
                              - generic [ref=f1e5327]: Estoque atualizado
                              - generic [ref=f1e5328]: 12 itens repostos
                            - generic [ref=f1e5329]: "+12"
                      - navigation [ref=f1e5330]:
                        - button "Início" [ref=f1e5331] [cursor=pointer]
                        - button "Buscar" [ref=f1e5337] [cursor=pointer]
                        - button "Agenda" [ref=f1e5343] [cursor=pointer]
                        - button "Perfil" [ref=f1e5348] [cursor=pointer]
                    - generic [aria-hidden]: HEADER
                    - generic [aria-hidden]: CONTEÚDO
                    - generic [aria-hidden]: MENU INFERIOR
                - paragraph [ref=f1e5354]: "Toque nos botões do celular: menus abrem e fecham como no site de verdade."
        - generic [ref=f1e5360]:
          - button "Voltar" [ref=f1e5362] [cursor=pointer]
          - generic [ref=f1e5365]:
            - generic [ref=f1e5366]: Escolha uma arquitetura para o celular.
            - 'button "Continuar: Revisão" [disabled] [ref=f1e5367]'
  - status
```

# Test source

```ts
  745 |     for (const v of Object.values(parsed.vars)) expect(v).not.toBe('')
  746 |     const html = await download(page, () => page.getByTestId('export-html').click())
  747 |     const doc = await page.evaluate((h) => { const d = new DOMParser().parseFromString(h, 'text/html'); return { title: d.title, body: d.body.textContent?.length ?? 0 } }, html.text)
  748 |     expect(html.text.startsWith('<!doctype html>')).toBe(true)
  749 |     expect(doc.body).toBeGreaterThan(100)
  750 |     const backup = JSON.parse((await download(page, () => page.getByTestId('export-backup').click())).text)
  751 |     expect(backup.kind).toBe('atelier-ui/backup')
  752 | 
  753 |     await go(page, '/modulos/cores')
  754 |     const tokens = await download(page, () => page.getByRole('button', { name: 'CSS dos tokens' }).click())
  755 |     expect(tokens.name).toBe('loja-aurora-tokens.css')
  756 |     expect(tokens.text).toBe(css.text)
  757 |   })
  758 | 
  759 |   test('guiado 1440×900: o primeiro clique real em "CSS dos tokens" baixa o arquivo', async ({ page }) => {
  760 |     test.fail(true, `REG-14: no guiado (etapa 7) o botão "CSS dos tokens" fica sob o rodapé fixo; o clique cai em "Continuar" e não baixa nada ${VER}`)
  761 |     await seed(page, { guided: { skeletonApproved: true, step: 'identidade' } })
  762 |     await go(page, '/guiado/identidade')
  763 |     await page.mouse.wheel(0, 1500)
  764 |     await page.waitForTimeout(400)
  765 |     const btn = page.getByRole('button', { name: 'CSS dos tokens' })
  766 |     const h = await hitInfo(btn)
  767 |     const box = (await btn.boundingBox())!
  768 |     expect(box.y + box.height, 'o botão está dentro da janela').toBeLessThanOrEqual(900)
  769 |     const got = page.waitForEvent('download', { timeout: 3000 }).then(() => true, () => false)
  770 |     await page.mouse.click(h.x, h.y) // clique onde a pessoa vê o botão
  771 |     expect(await got, `download no primeiro clique (ponto coberto por: ${h.cover ?? 'nada'})`).toBe(true)
  772 |     await expect(page).toHaveURL(/#\/guiado\/identidade/)
  773 |   })
  774 | })
  775 | 
  776 | test.describe('REG-15 · O aplicativo sempre carrega', () => {
  777 |   test('todas as rotas abrem sem erro de JavaScript e sem recurso 4xx/5xx (desktop)', async ({ page }) => {
  778 |     test.setTimeout(120_000)
  779 |     const errors = trackErrors(page)
  780 |     const bad: string[] = []
  781 |     page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`) })
  782 |     await freshStart(page)
  783 |     for (const r of ROUTES) {
  784 |       await go(page, r)
  785 |       await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
  786 |     }
  787 |     expect(errors).toEqual([])
  788 |     expect(bad).toEqual([])
  789 |   })
  790 | 
  791 |   test.describe('celular 360×800', () => {
  792 |     test.use(MOBILE)
  793 |     test('todas as rotas abrem sem erro de JavaScript', async ({ page }) => {
  794 |       test.setTimeout(120_000)
  795 |       const errors = trackErrors(page)
  796 |       await freshStart(page)
  797 |       for (const r of ROUTES) {
  798 |         await go(page, r)
  799 |         await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
  800 |       }
  801 |       expect(errors).toEqual([])
  802 |     })
  803 |   })
  804 | 
  805 |   test('armazenamento corrompido ou de outra versão não impede a abertura', async ({ page }) => {
  806 |     for (const raw of ['{isto não é json', JSON.stringify({ state: { project: { schema: 'outra-coisa', version: 99 } }, version: 1 }), JSON.stringify({ state: { project: null, history: 'x' } })]) {
  807 |       const errors: string[] = []
  808 |       const onErr = (e: Error) => errors.push(e.message)
  809 |       page.on('pageerror', onErr)
  810 |       await page.goto('/')
  811 |       await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: STORAGE, raw })
  812 |       await page.reload()
  813 |       await expect(page.getByRole('heading', { level: 1 })).toContainText('Do site que você imagina')
  814 |       await go(page, '/prompt')
  815 |       await expect(page.getByTestId('master-prompt-text')).toContainText('Master Prompt')
  816 |       expect(errors, raw.slice(0, 20)).toEqual([])
  817 |       page.off('pageerror', onErr)
  818 |     }
  819 |   })
  820 | })
  821 | 
  822 | test.describe('REG-16 · Conteúdo não fica encoberto pela barra fixa inferior', () => {
  823 |   test('guiado 1440×900: "Prompt da identidade" e "CSS dos tokens" ficam acima do rodapé fixo', async ({ page }) => {
  824 |     test.fail(true, `REG-16: o painel fixo da prévia de identidade termina sob o rodapé do guiado (botões cobertos) ${VER}`)
  825 |     await seed(page, { guided: { skeletonApproved: true, step: 'identidade' } })
  826 |     await go(page, '/guiado/identidade')
  827 |     for (const name of ['Prompt da identidade', 'CSS dos tokens']) {
  828 |       for (const y of [600, 2500]) {
  829 |         await page.evaluate((y) => window.scrollTo(0, y), y)
  830 |         await page.waitForTimeout(250)
  831 |         const h = await hitInfo(page.getByRole('button', { name }))
  832 |         expect(h.own, `${name} em scrollY=${y}: coberto por ${h.cover}`).toBe(true)
  833 |       }
  834 |     }
  835 |   })
  836 | 
  837 |   test('guiado 1440×900 (etapa 4): a base do celular grande fixo não fica sob o rodapé', async ({ page }) => {
  838 |     test.fail(true, `REG-16: a altura do celular grande ignora o rodapé do guiado; 23 px da base (barra inferior da prévia) ficam cobertos ${VER}`)
  839 |     await freshStart(page)
  840 |     await go(page, '/guiado/mobile')
  841 |     await page.evaluate(() => window.scrollTo(0, 2000))
  842 |     await page.waitForTimeout(300)
  843 |     const phone = (await page.getByTestId('phone-preview').first().boundingBox())!
  844 |     const footer = (await page.locator('.gd-footer').boundingBox())!
> 845 |     expect(phone.y + phone.height, 'base do celular grande × topo do rodapé').toBeLessThanOrEqual(footer.y)
      |                                                                               ^ Error: base do celular grande × topo do rodapé
  846 |   })
  847 | 
  848 |   for (const [label, use] of [['desktop 1440×900', {}], ['celular 360×800', MOBILE]] as const) {
  849 |     test.describe(label, () => {
  850 |       test.use(use)
  851 |       test('guiado: ações principais de cada etapa podem ser trazidas acima do rodapé', async ({ page }) => {
  852 |         test.setTimeout(120_000)
  853 |         await seed(page, {
  854 |           meta: { projectType: 'saas' },
  855 |           entry: { flow: 'login-only', loginId: 'classico-central', signupId: 'mesma-tela' },
  856 |           layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' },
  857 |           guided: { skeletonApproved: true },
  858 |         })
  859 |         const checks: [string, Locator][] = [
  860 |           ['/guiado/entrega', page.getByRole('button', { name: /Copiar Master Prompt/ }).first()],
  861 |           ['/guiado/entrega', page.getByRole('button', { name: /Baixar \.md/ }).first()],
  862 |           ['/guiado/desktop', page.locator('[data-testid^="desktop-option-"]').last()],
  863 |           ['/guiado/mobile', page.locator('[data-testid^="mobile-option-"]').last()],
  864 |           ['/guiado/revisao', page.getByRole('link', { name: /Alterar/ }).last()],
  865 |         ]
  866 |         for (const [route, target] of checks) {
  867 |           await go(page, route)
  868 |           await target.scrollIntoViewIfNeeded()
  869 |           await target.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
  870 |           await page.waitForTimeout(250)
  871 |           const h = await hitInfo(target)
  872 |           expect(h.own, `${route}: alvo coberto por ${h.cover}`).toBe(true)
  873 |         }
  874 |       })
  875 |     })
  876 |   }
  877 | })
  878 | 
  879 | /** Elementos de cartões que ultrapassam a borda do cartão (sem contêiner que os recorte). */
  880 | async function cardOverflow(page: Page) {
  881 |   return page.evaluate(() => {
  882 |     const out: string[] = []
  883 |     for (const card of Array.from(document.querySelectorAll<HTMLElement>('.ui-option, .nvs-card'))) {
  884 |       const cr = card.getBoundingClientRect()
  885 |       if (!cr.width) continue
  886 |       for (const el of Array.from(card.querySelectorAll('*'))) {
  887 |         const r = el.getBoundingClientRect()
  888 |         if (!r.width || !r.height) continue
  889 |         let p = el.parentElement, clipped = false
  890 |         while (p && p !== card) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) { clipped = true; break } p = p.parentElement }
  891 |         if (!clipped && (r.right > cr.right + 1 || r.left < cr.left - 1)) { out.push(`${card.dataset.testid ?? card.className}: ${el.tagName.toLowerCase()} excede o cartão`); break }
  892 |       }
  893 |     }
  894 |     return out
  895 |   })
  896 | }
  897 | 
  898 | test.describe('REG-17 · Sem overflow nas galerias de layouts', () => {
  899 |   for (const w of [320, 360, 1024, 1440]) {
  900 |     test(`${w} px: página sem rolagem lateral e conteúdo dos cartões dentro do cartão`, async ({ page }) => {
  901 |       test.setTimeout(120_000)
  902 |       await page.setViewportSize({ width: w, height: 900 })
  903 |       await freshStart(page)
  904 |       for (const r of ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/navegacao', '/modulos/cores']) {
  905 |         await go(page, r)
  906 |         expect(await horizontalOverflow(page), r).toBeLessThanOrEqual(0)
  907 |         expect(await cardOverflow(page), r).toEqual([])
  908 |       }
  909 |     })
  910 |   }
  911 | 
  912 |   for (const [label, vp] of [['tablet 768×1024', { width: 768, height: 1024 }], ['celular deitado 800×360', { width: 800, height: 360 }]] as const) {
  913 |     test.describe(label, () => {
  914 |       test.use({ viewport: vp, hasTouch: true })
  915 |       test('galeria do celular: coluna de miniaturas com largura útil e nenhuma miniatura coberta', async ({ page }) => {
  916 |         test.fail(true, `REG-17: no modo "medium" (620–939 px úteis) a coluna de miniaturas colapsa para 0 px e as 44 miniaturas transbordam sob o celular grande ${VER}`)
  917 |         await freshStart(page)
  918 |         await go(page, '/modulos/mobile')
  919 |         const listW = await page.locator('.lay-mob-list').evaluate((e) => e.getBoundingClientRect().width)
  920 |         expect(listW, 'largura da coluna de miniaturas').toBeGreaterThanOrEqual(128)
  921 |         const covered = await page.locator('[data-testid^="mobile-option-"] .ui-option__hit').evaluateAll((hits) =>
  922 |           hits.filter((h) => { h.scrollIntoView({ block: 'center' }); const r = h.getBoundingClientRect(); const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !x || !h.contains(x) }).length,
  923 |         )
  924 |         expect(covered, 'miniaturas cobertas por outro elemento').toBe(0)
  925 |       })
  926 |     })
  927 |   }
  928 | })
  929 | 
  930 | test.describe('REG-18 · Desktop e celular compatíveis', () => {
  931 |   test('Master Prompt define um único ponto de troca entre arquitetura mobile e desktop', async ({ page }) => {
  932 |     test.fail(true, `REG-18: o prompt manda trocar para desktop a partir de 768 px e, em outra seção, usar desktop compactado a partir de 600 px ${VER}`)
  933 |     await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  934 |     const prompt = await masterPrompt(page)
  935 |     const cuts = new Set<number>()
  936 |     for (const m of prompt.matchAll(/A partir de (\d+) px passa a valer a arquitetura desktop/g)) cuts.add(Number(m[1]))
  937 |     for (const m of prompt.matchAll(/Abaixo de (\d+) px vale a arquitetura mobile/g)) cuts.add(Number(m[1]))
  938 |     for (const m of prompt.matchAll(/Entre (\d+) e \d+ px \(tablet\), use a estrutura desktop/g)) cuts.add(Number(m[1]))
  939 |     expect([...cuts], 'larguras de troca citadas no prompt').toHaveLength(1)
  940 |   })
  941 | 
  942 |   test('as mesmas escolhas feitas no desktop e no celular geram o mesmo projeto e o mesmo prompt', async ({ browser }) => {
  943 |     test.setTimeout(150_000)
  944 |     const build = async (opts: Parameters<typeof browser.newContext>[0]) => {
  945 |       const ctx = await browser.newContext({ baseURL: 'http://127.0.0.1:4300', ...opts })
```