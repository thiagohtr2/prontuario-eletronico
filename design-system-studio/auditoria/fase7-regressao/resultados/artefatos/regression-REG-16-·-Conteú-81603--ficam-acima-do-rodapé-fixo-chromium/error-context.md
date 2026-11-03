# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-16 · Conteúdo não fica encoberto pela barra fixa inferior >> guiado 1440×900: "Prompt da identidade" e "CSS dos tokens" ficam acima do rodapé fixo
- Location: tests/e2e/regression.spec.ts:823:3

# Error details

```
Error: Prompt da identidade em scrollY=600: coberto por gd-footer

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
          - listitem [ref=f2e244]: ›Construtor guiado
          - listitem [ref=f2e245]: ›Identidade visual
      - generic [ref=f2e246]:
        - navigation "Etapas do construtor guiado" [ref=f2e247]:
          - generic [ref=f2e248]:
            - generic [ref=f2e249]: Esqueleto
            - list [ref=f2e253]:
              - listitem [ref=f2e254]:
                - button "1. Objetivo" [ref=f2e255] [cursor=pointer]
              - listitem [ref=f2e258]:
                - button "2. Entrada" [ref=f2e259] [cursor=pointer]
              - listitem [ref=f2e262]:
                - button "3. Desktop" [ref=f2e263] [cursor=pointer]
              - listitem [ref=f2e266]:
                - button "4. Mobile" [ref=f2e267] [cursor=pointer]
              - listitem [ref=f2e270]:
                - button "5. Revisão" [ref=f2e271] [cursor=pointer]
          - generic [ref=f2e274]:
            - generic [ref=f2e275]: Acabamento
            - list [ref=f2e279]:
              - listitem [ref=f2e280]:
                - button "6. Prévia" [ref=f2e281] [cursor=pointer]
              - listitem [ref=f2e284]:
                - button "7. Cores" [ref=f2e285] [cursor=pointer]
              - listitem [ref=f2e288]:
                - button "8. Navegação" [ref=f2e289] [cursor=pointer]
              - listitem [ref=f2e292]:
                - button "9. Componentes" [ref=f2e293] [cursor=pointer]
              - listitem [ref=f2e296]:
                - button "10. Entrega" [ref=f2e297] [cursor=pointer]
        - generic [ref=f2e300]:
          - generic [ref=f2e301]: Etapa 7 de 10 · Acabamento
          - heading "Identidade visual" [level=1] [ref=f2e302]
          - paragraph [ref=f2e303]: "Agora sim, as cores. Escolha uma paleta: todos os componentes herdam esses tokens. Tipografia e cantos vêm em seguida."
        - generic [ref=f2e304]:
          - generic [ref=f2e305]:
            - tablist "Partes da identidade visual" [ref=f2e306]:
              - tab "Paletas" [selected] [ref=f2e307] [cursor=pointer]
              - tab "Ajustar cores" [ref=f2e308] [cursor=pointer]
              - tab "Tipografia" [ref=f2e309] [cursor=pointer]
              - tab "Formas e superfícies" [ref=f2e310] [cursor=pointer]
            - generic [ref=f2e311]:
              - searchbox "Buscar paletas" [ref=f2e315]
              - group "Categorias de paletas" [ref=f2e316]:
                - button "Todas 60" [pressed] [ref=f2e317] [cursor=pointer]:
                  - text: Todas
                  - generic [ref=f2e318]: "60"
                - button "Minimalistas 6" [ref=f2e319] [cursor=pointer]:
                  - text: Minimalistas
                  - generic [ref=f2e320]: "6"
                - button "Frias 6" [ref=f2e321] [cursor=pointer]:
                  - text: Frias
                  - generic [ref=f2e322]: "6"
                - button "Quentes 6" [ref=f2e323] [cursor=pointer]:
                  - text: Quentes
                  - generic [ref=f2e324]: "6"
                - button "Corporativas 6" [ref=f2e325] [cursor=pointer]:
                  - text: Corporativas
                  - generic [ref=f2e326]: "6"
                - button "Tecnológicas 6" [ref=f2e327] [cursor=pointer]:
                  - text: Tecnológicas
                  - generic [ref=f2e328]: "6"
                - button "Profissionais 6" [ref=f2e329] [cursor=pointer]:
                  - text: Profissionais
                  - generic [ref=f2e330]: "6"
                - button "Sociais 6" [ref=f2e331] [cursor=pointer]:
                  - text: Sociais
                  - generic [ref=f2e332]: "6"
                - button "Criativas 6" [ref=f2e333] [cursor=pointer]:
                  - text: Criativas
                  - generic [ref=f2e334]: "6"
                - button "Elegantes 6" [ref=f2e335] [cursor=pointer]:
                  - text: Elegantes
                  - generic [ref=f2e336]: "6"
                - button "Naturais 6" [ref=f2e337] [cursor=pointer]:
                  - text: Naturais
                  - generic [ref=f2e338]: "6"
              - generic [ref=f2e339]:
                - generic [ref=f2e340]:
                  - generic: Selecionado
                  - button "Neutro Essencial Minimalistas · clara Preto, branco e um azul discreto para ações." [pressed] [ref=f2e341] [cursor=pointer]:
                    - generic [ref=f2e365]:
                      - generic [ref=f2e366]: Neutro Essencial
                      - generic [ref=f2e367]: Minimalistas · clara
                      - generic [ref=f2e368]: Preto, branco e um azul discreto para ações.
                  - button "Prompt" [ref=f2e370] [cursor=pointer]
                - generic [ref=f2e374]:
                  - button "Papel Branco Minimalistas · clara Fundo de papel levemente quente com destaque carmim." [ref=f2e375] [cursor=pointer]:
                    - generic [ref=f2e399]:
                      - generic [ref=f2e400]: Papel Branco
                      - generic [ref=f2e401]: Minimalistas · clara
                      - generic [ref=f2e402]: Fundo de papel levemente quente com destaque carmim.
                  - button "Prompt" [ref=f2e404] [cursor=pointer]
                - generic [ref=f2e408]:
                  - button "Grafite Suave Minimalistas · clara Cinzas grafite e um ciano para pontos de atenção." [ref=f2e409] [cursor=pointer]:
                    - generic [ref=f2e433]:
                      - generic [ref=f2e434]: Grafite Suave
                      - generic [ref=f2e435]: Minimalistas · clara
                      - generic [ref=f2e436]: Cinzas grafite e um ciano para pontos de atenção.
                  - button "Prompt" [ref=f2e438] [cursor=pointer]
                - generic [ref=f2e442]:
                  - button "Monocromo Noturno Minimalistas · escura Modo escuro radical em preto puro com verde-limão." [ref=f2e443] [cursor=pointer]:
                    - generic [ref=f2e467]:
                      - generic [ref=f2e468]: Monocromo Noturno
                      - generic [ref=f2e469]: Minimalistas · escura
                      - generic [ref=f2e470]: Modo escuro radical em preto puro com verde-limão.
                  - button "Prompt" [ref=f2e472] [cursor=pointer]
                - generic [ref=f2e476]:
                  - button "Areia Clara Minimalistas · clara Neutros terrosos com um laranja queimado discreto." [ref=f2e477] [cursor=pointer]:
                    - generic [ref=f2e501]:
                      - generic [ref=f2e502]: Areia Clara
                      - generic [ref=f2e503]: Minimalistas · clara
                      - generic [ref=f2e504]: Neutros terrosos com um laranja queimado discreto.
                  - button "Prompt" [ref=f2e506] [cursor=pointer]
                - generic [ref=f2e510]:
                  - button "Névoa Minimalistas · clara Cinzas azulados e um índigo suave." [ref=f2e511] [cursor=pointer]:
                    - generic [ref=f2e535]:
                      - generic [ref=f2e536]: Névoa
                      - generic [ref=f2e537]: Minimalistas · clara
                      - generic [ref=f2e538]: Cinzas azulados e um índigo suave.
                  - button "Prompt" [ref=f2e540] [cursor=pointer]
                - generic [ref=f2e544]:
                  - button "Oceano Profundo Frias · clara Azul petróleo com navegação escura e ciano luminoso." [ref=f2e545] [cursor=pointer]:
                    - generic [ref=f2e569]:
                      - generic [ref=f2e570]: Oceano Profundo
                      - generic [ref=f2e571]: Frias · clara
                      - generic [ref=f2e572]: Azul petróleo com navegação escura e ciano luminoso.
                  - button "Prompt" [ref=f2e574] [cursor=pointer]
                - generic [ref=f2e578]:
                  - button "Glacial Frias · clara Cianos gelados e índigo, muito luminosa." [ref=f2e579] [cursor=pointer]:
                    - generic [ref=f2e603]:
                      - generic [ref=f2e604]: Glacial
                      - generic [ref=f2e605]: Frias · clara
                      - generic [ref=f2e606]: Cianos gelados e índigo, muito luminosa.
                  - button "Prompt" [ref=f2e608] [cursor=pointer]
                - generic [ref=f2e612]:
                  - button "Azul Ardósia Frias · clara Azul acinzentado sóbrio com destaque celeste." [ref=f2e613] [cursor=pointer]:
                    - generic [ref=f2e637]:
                      - generic [ref=f2e638]: Azul Ardósia
                      - generic [ref=f2e639]: Frias · clara
                      - generic [ref=f2e640]: Azul acinzentado sóbrio com destaque celeste.
                  - button "Prompt" [ref=f2e642] [cursor=pointer]
                - generic [ref=f2e646]:
                  - button "Lavanda Fria Frias · clara Lilás azulado com verde-água como contraponto." [ref=f2e647] [cursor=pointer]:
                    - generic [ref=f2e671]:
                      - generic [ref=f2e672]: Lavanda Fria
                      - generic [ref=f2e673]: Frias · clara
                      - generic [ref=f2e674]: Lilás azulado com verde-água como contraponto.
                  - button "Prompt" [ref=f2e676] [cursor=pointer]
                - generic [ref=f2e680]:
                  - button "Noite Polar Frias · escura Modo escuro azul-noite com azuis e turquesa." [ref=f2e681] [cursor=pointer]:
                    - generic [ref=f2e705]:
                      - generic [ref=f2e706]: Noite Polar
                      - generic [ref=f2e707]: Frias · escura
                      - generic [ref=f2e708]: Modo escuro azul-noite com azuis e turquesa.
                  - button "Prompt" [ref=f2e710] [cursor=pointer]
                - generic [ref=f2e714]:
                  - button "Menta Gelada Frias · clara Verde-azulado fresco com azul de apoio." [ref=f2e715] [cursor=pointer]:
                    - generic [ref=f2e739]:
                      - generic [ref=f2e740]: Menta Gelada
                      - generic [ref=f2e741]: Frias · clara
                      - generic [ref=f2e742]: Verde-azulado fresco com azul de apoio.
                  - button "Prompt" [ref=f2e744] [cursor=pointer]
                - generic [ref=f2e748]:
                  - button "Terracota Quentes · clara Barro cozido, laranja queimado e âmbar." [ref=f2e749] [cursor=pointer]:
                    - generic [ref=f2e773]:
                      - generic [ref=f2e774]: Terracota
                      - generic [ref=f2e775]: Quentes · clara
                      - generic [ref=f2e776]: Barro cozido, laranja queimado e âmbar.
                  - button "Prompt" [ref=f2e778] [cursor=pointer]
                - generic [ref=f2e782]:
                  - button "Pôr do Sol Quentes · clara Laranja e magenta com gradiente quente." [ref=f2e783] [cursor=pointer]:
                    - generic [ref=f2e807]:
                      - generic [ref=f2e808]: Pôr do Sol
                      - generic [ref=f2e809]: Quentes · clara
                      - generic [ref=f2e810]: Laranja e magenta com gradiente quente.
                  - button "Prompt" [ref=f2e812] [cursor=pointer]
                - generic [ref=f2e816]:
                  - button "Canela Quentes · clara Marrons acolhedores, ideais para cafés e confeitarias." [ref=f2e817] [cursor=pointer]:
                    - generic [ref=f2e841]:
                      - generic [ref=f2e842]: Canela
                      - generic [ref=f2e843]: Quentes · clara
                      - generic [ref=f2e844]: Marrons acolhedores, ideais para cafés e confeitarias.
                  - button "Prompt" [ref=f2e846] [cursor=pointer]
                - generic [ref=f2e850]:
                  - button "Coral Vivo Quentes · clara Coral intenso e amarelo ensolarado." [ref=f2e851] [cursor=pointer]:
                    - generic [ref=f2e875]:
                      - generic [ref=f2e876]: Coral Vivo
                      - generic [ref=f2e877]: Quentes · clara
                      - generic [ref=f2e878]: Coral intenso e amarelo ensolarado.
                  - button "Prompt" [ref=f2e880] [cursor=pointer]
                - generic [ref=f2e884]:
                  - button "Mostarda Quentes · clara Amarelo mostarda com verde-garrafa." [ref=f2e885] [cursor=pointer]:
                    - generic [ref=f2e909]:
                      - generic [ref=f2e910]: Mostarda
                      - generic [ref=f2e911]: Quentes · clara
                      - generic [ref=f2e912]: Amarelo mostarda com verde-garrafa.
                  - button "Prompt" [ref=f2e914] [cursor=pointer]
                - generic [ref=f2e918]:
                  - button "Brasa Quentes · escura Modo escuro em carvão com laranjas incandescentes." [ref=f2e919] [cursor=pointer]:
                    - generic [ref=f2e943]:
                      - generic [ref=f2e944]: Brasa
                      - generic [ref=f2e945]: Quentes · escura
                      - generic [ref=f2e946]: Modo escuro em carvão com laranjas incandescentes.
                  - button "Prompt" [ref=f2e948] [cursor=pointer]
                - generic [ref=f2e952]:
                  - button "Azul Institucional Corporativas · clara Azul real confiável com navegação marinho." [ref=f2e953] [cursor=pointer]:
                    - generic [ref=f2e977]:
                      - generic [ref=f2e978]: Azul Institucional
                      - generic [ref=f2e979]: Corporativas · clara
                      - generic [ref=f2e980]: Azul real confiável com navegação marinho.
                  - button "Prompt" [ref=f2e982] [cursor=pointer]
                - generic [ref=f2e986]:
                  - button "Executivo Grafite Corporativas · clara Grafite quase preto com azul de ação." [ref=f2e987] [cursor=pointer]:
                    - generic [ref=f2e1011]:
                      - generic [ref=f2e1012]: Executivo Grafite
                      - generic [ref=f2e1013]: Corporativas · clara
                      - generic [ref=f2e1014]: Grafite quase preto com azul de ação.
                  - button "Prompt" [ref=f2e1016] [cursor=pointer]
                - generic [ref=f2e1020]:
                  - button "Verde Banco Corporativas · clara Verde financeiro sólido e azul de apoio." [ref=f2e1021] [cursor=pointer]:
                    - generic [ref=f2e1045]:
                      - generic [ref=f2e1046]: Verde Banco
                      - generic [ref=f2e1047]: Corporativas · clara
                      - generic [ref=f2e1048]: Verde financeiro sólido e azul de apoio.
                  - button "Prompt" [ref=f2e1050] [cursor=pointer]
                - generic [ref=f2e1054]:
                  - button "Marinho Clássico Corporativas · clara Azul marinho com destaque coral." [ref=f2e1055] [cursor=pointer]:
                    - generic [ref=f2e1079]:
                      - generic [ref=f2e1080]: Marinho Clássico
                      - generic [ref=f2e1081]: Corporativas · clara
                      - generic [ref=f2e1082]: Azul marinho com destaque coral.
                  - button "Prompt" [ref=f2e1084] [cursor=pointer]
                - generic [ref=f2e1088]:
                  - button "Vinho Corporativo Corporativas · clara Bordô profundo com âmbar." [ref=f2e1089] [cursor=pointer]:
                    - generic [ref=f2e1113]:
                      - generic [ref=f2e1114]: Vinho Corporativo
                      - generic [ref=f2e1115]: Corporativas · clara
                      - generic [ref=f2e1116]: Bordô profundo com âmbar.
                  - button "Prompt" [ref=f2e1118] [cursor=pointer]
                - generic [ref=f2e1122]:
                  - button "Cinza Azulado Corporativas · clara Ardósia neutra com verde-azulado." [ref=f2e1123] [cursor=pointer]:
                    - generic [ref=f2e1147]:
                      - generic [ref=f2e1148]: Cinza Azulado
                      - generic [ref=f2e1149]: Corporativas · clara
                      - generic [ref=f2e1150]: Ardósia neutra com verde-azulado.
                  - button "Prompt" [ref=f2e1152] [cursor=pointer]
                - generic [ref=f2e1156]:
                  - button "Neon Grid Tecnológicas · escura Escuro profundo com ciano, violeta e gradiente." [ref=f2e1157] [cursor=pointer]:
                    - generic [ref=f2e1181]:
                      - generic [ref=f2e1182]: Neon Grid
                      - generic [ref=f2e1183]: Tecnológicas · escura
                      - generic [ref=f2e1184]: Escuro profundo com ciano, violeta e gradiente.
                  - button "Prompt" [ref=f2e1186] [cursor=pointer]
                - generic [ref=f2e1190]:
                  - button "Violeta Digital Tecnológicas · clara Violeta e índigo com gradiente para ciano." [ref=f2e1191] [cursor=pointer]:
                    - generic [ref=f2e1215]:
                      - generic [ref=f2e1216]: Violeta Digital
                      - generic [ref=f2e1217]: Tecnológicas · clara
                      - generic [ref=f2e1218]: Violeta e índigo com gradiente para ciano.
                  - button "Prompt" [ref=f2e1220] [cursor=pointer]
                - generic [ref=f2e1224]:
                  - button "Terminal Tecnológicas · escura Verde fósforo sobre preto, estética de console." [ref=f2e1225] [cursor=pointer]:
                    - generic [ref=f2e1249]:
                      - generic [ref=f2e1250]: Terminal
                      - generic [ref=f2e1251]: Tecnológicas · escura
                      - generic [ref=f2e1252]: Verde fósforo sobre preto, estética de console.
                  - button "Prompt" [ref=f2e1254] [cursor=pointer]
                - generic [ref=f2e1258]:
                  - button "Elétrico Tecnológicas · clara Azul elétrico, violeta e rosa vibrante." [ref=f2e1259] [cursor=pointer]:
                    - generic [ref=f2e1283]:
                      - generic [ref=f2e1284]: Elétrico
                      - generic [ref=f2e1285]: Tecnológicas · clara
                      - generic [ref=f2e1286]: Azul elétrico, violeta e rosa vibrante.
                  - button "Prompt" [ref=f2e1288] [cursor=pointer]
                - generic [ref=f2e1292]:
                  - button "Cyber Rosa Tecnológicas · escura Rosa e lilás neon sobre roxo profundo." [ref=f2e1293] [cursor=pointer]:
                    - generic [ref=f2e1317]:
                      - generic [ref=f2e1318]: Cyber Rosa
                      - generic [ref=f2e1319]: Tecnológicas · escura
                      - generic [ref=f2e1320]: Rosa e lilás neon sobre roxo profundo.
                  - button "Prompt" [ref=f2e1322] [cursor=pointer]
                - generic [ref=f2e1326]:
                  - button "Silício Tecnológicas · clara Preto-azulado, azul e verde de status." [ref=f2e1327] [cursor=pointer]:
                    - generic [ref=f2e1351]:
                      - generic [ref=f2e1352]: Silício
                      - generic [ref=f2e1353]: Tecnológicas · clara
                      - generic [ref=f2e1354]: Preto-azulado, azul e verde de status.
                  - button "Prompt" [ref=f2e1356] [cursor=pointer]
                - generic [ref=f2e1360]:
                  - button "Clínico Profissionais · clara Azul-petróleo higiênico com verde de confirmação." [ref=f2e1361] [cursor=pointer]:
                    - generic [ref=f2e1385]:
                      - generic [ref=f2e1386]: Clínico
                      - generic [ref=f2e1387]: Profissionais · clara
                      - generic [ref=f2e1388]: Azul-petróleo higiênico com verde de confirmação.
                  - button "Prompt" [ref=f2e1390] [cursor=pointer]
                - generic [ref=f2e1394]:
                  - button "Jurídico Profissionais · clara Azul tinta com dourado envelhecido." [ref=f2e1395] [cursor=pointer]:
                    - generic [ref=f2e1419]:
                      - generic [ref=f2e1420]: Jurídico
                      - generic [ref=f2e1421]: Profissionais · clara
                      - generic [ref=f2e1422]: Azul tinta com dourado envelhecido.
                  - button "Prompt" [ref=f2e1424] [cursor=pointer]
                - generic [ref=f2e1428]:
                  - button "Consultoria Profissionais · clara Azul aço com amarelo de destaque." [ref=f2e1429] [cursor=pointer]:
                    - generic [ref=f2e1453]:
                      - generic [ref=f2e1454]: Consultoria
                      - generic [ref=f2e1455]: Profissionais · clara
                      - generic [ref=f2e1456]: Azul aço com amarelo de destaque.
                  - button "Prompt" [ref=f2e1458] [cursor=pointer]
                - generic [ref=f2e1462]:
                  - button "Engenharia Profissionais · clara Azul técnico e laranja de segurança." [ref=f2e1463] [cursor=pointer]:
                    - generic [ref=f2e1487]:
                      - generic [ref=f2e1488]: Engenharia
                      - generic [ref=f2e1489]: Profissionais · clara
                      - generic [ref=f2e1490]: Azul técnico e laranja de segurança.
                  - button "Prompt" [ref=f2e1492] [cursor=pointer]
                - generic [ref=f2e1496]:
                  - button "Educação Profissionais · clara Índigo estudioso com âmbar e ciano." [ref=f2e1497] [cursor=pointer]:
                    - generic [ref=f2e1521]:
                      - generic [ref=f2e1522]: Educação
                      - generic [ref=f2e1523]: Profissionais · clara
                      - generic [ref=f2e1524]: Índigo estudioso com âmbar e ciano.
                  - button "Prompt" [ref=f2e1526] [cursor=pointer]
                - generic [ref=f2e1530]:
                  - button "Contábil Profissionais · clara Verde sóbrio, grafite e azul." [ref=f2e1531] [cursor=pointer]:
                    - generic [ref=f2e1555]:
                      - generic [ref=f2e1556]: Contábil
                      - generic [ref=f2e1557]: Profissionais · clara
                      - generic [ref=f2e1558]: Verde sóbrio, grafite e azul.
                  - button "Prompt" [ref=f2e1560] [cursor=pointer]
                - generic [ref=f2e1564]:
                  - button "Comunidade Sociais · clara Magenta e violeta com gradiente caloroso." [ref=f2e1565] [cursor=pointer]:
                    - generic [ref=f2e1589]:
                      - generic [ref=f2e1590]: Comunidade
                      - generic [ref=f2e1591]: Sociais · clara
                      - generic [ref=f2e1592]: Magenta e violeta com gradiente caloroso.
                  - button "Prompt" [ref=f2e1594] [cursor=pointer]
                - generic [ref=f2e1598]:
                  - button "Conversa Sociais · clara Verde de mensagem, azul e laranja." [ref=f2e1599] [cursor=pointer]:
                    - generic [ref=f2e1623]:
                      - generic [ref=f2e1624]: Conversa
                      - generic [ref=f2e1625]: Sociais · clara
                      - generic [ref=f2e1626]: Verde de mensagem, azul e laranja.
                  - button "Prompt" [ref=f2e1628] [cursor=pointer]
                - generic [ref=f2e1632]:
                  - button "Pulso Social Sociais · escura Modo escuro com violeta, rosa e verde-água." [ref=f2e1633] [cursor=pointer]:
                    - generic [ref=f2e1657]:
                      - generic [ref=f2e1658]: Pulso Social
                      - generic [ref=f2e1659]: Sociais · escura
                      - generic [ref=f2e1660]: Modo escuro com violeta, rosa e verde-água.
                  - button "Prompt" [ref=f2e1662] [cursor=pointer]
                - generic [ref=f2e1666]:
                  - button "Amizade Sociais · clara Laranja amigável, amarelo e azul." [ref=f2e1667] [cursor=pointer]:
                    - generic [ref=f2e1691]:
                      - generic [ref=f2e1692]: Amizade
                      - generic [ref=f2e1693]: Sociais · clara
                      - generic [ref=f2e1694]: Laranja amigável, amarelo e azul.
                  - button "Prompt" [ref=f2e1696] [cursor=pointer]
                - generic [ref=f2e1700]:
                  - button "Céu Aberto Sociais · clara Azul céu com coral." [ref=f2e1701] [cursor=pointer]:
                    - generic [ref=f2e1725]:
                      - generic [ref=f2e1726]: Céu Aberto
                      - generic [ref=f2e1727]: Sociais · clara
                      - generic [ref=f2e1728]: Azul céu com coral.
                  - button "Prompt" [ref=f2e1730] [cursor=pointer]
                - generic [ref=f2e1734]:
                  - button "Festival Sociais · clara Roxo, vermelho e amarelo festivos." [ref=f2e1735] [cursor=pointer]:
                    - generic [ref=f2e1759]:
                      - generic [ref=f2e1760]: Festival
                      - generic [ref=f2e1761]: Sociais · clara
                      - generic [ref=f2e1762]: Roxo, vermelho e amarelo festivos.
                  - button "Prompt" [ref=f2e1764] [cursor=pointer]
                - generic [ref=f2e1768]:
                  - button "Estúdio Pop Criativas · clara Rosa, azul e amarelo de pôster." [ref=f2e1769] [cursor=pointer]:
                    - generic [ref=f2e1793]:
                      - generic [ref=f2e1794]: Estúdio Pop
                      - generic [ref=f2e1795]: Criativas · clara
                      - generic [ref=f2e1796]: Rosa, azul e amarelo de pôster.
                  - button "Prompt" [ref=f2e1798] [cursor=pointer]
                - generic [ref=f2e1802]:
                  - button "Risografia Criativas · clara Laranja e azul de impressão artesanal." [ref=f2e1803] [cursor=pointer]:
                    - generic [ref=f2e1827]:
                      - generic [ref=f2e1828]: Risografia
                      - generic [ref=f2e1829]: Criativas · clara
                      - generic [ref=f2e1830]: Laranja e azul de impressão artesanal.
                  - button "Prompt" [ref=f2e1832] [cursor=pointer]
                - generic [ref=f2e1836]:
                  - button "Aquarela Criativas · clara Lilás, rosa e verde suaves." [ref=f2e1837] [cursor=pointer]:
                    - generic [ref=f2e1861]:
                      - generic [ref=f2e1862]: Aquarela
                      - generic [ref=f2e1863]: Criativas · clara
                      - generic [ref=f2e1864]: Lilás, rosa e verde suaves.
                  - button "Prompt" [ref=f2e1866] [cursor=pointer]
                - generic [ref=f2e1870]:
                  - button "Neo Brutal Criativas · clara Preto puro, laranja e amarelo chapados." [ref=f2e1871] [cursor=pointer]:
                    - generic [ref=f2e1895]:
                      - generic [ref=f2e1896]: Neo Brutal
                      - generic [ref=f2e1897]: Criativas · clara
                      - generic [ref=f2e1898]: Preto puro, laranja e amarelo chapados.
                  - button "Prompt" [ref=f2e1900] [cursor=pointer]
                - generic [ref=f2e1904]:
                  - button "Galeria Noturna Criativas · escura Escuro de galeria com coral e amarelo." [ref=f2e1905] [cursor=pointer]:
                    - generic [ref=f2e1929]:
                      - generic [ref=f2e1930]: Galeria Noturna
                      - generic [ref=f2e1931]: Criativas · escura
                      - generic [ref=f2e1932]: Escuro de galeria com coral e amarelo.
                  - button "Prompt" [ref=f2e1934] [cursor=pointer]
                - generic [ref=f2e1938]:
                  - button "Tropical Criativas · clara Verde-água, coral e amarelo de verão." [ref=f2e1939] [cursor=pointer]:
                    - generic [ref=f2e1963]:
                      - generic [ref=f2e1964]: Tropical
                      - generic [ref=f2e1965]: Criativas · clara
                      - generic [ref=f2e1966]: Verde-água, coral e amarelo de verão.
                  - button "Prompt" [ref=f2e1968] [cursor=pointer]
                - generic [ref=f2e1972]:
                  - button "Ouro Noturno Elegantes · escura Preto quente com dourado e champanhe." [ref=f2e1973] [cursor=pointer]:
                    - generic [ref=f2e1997]:
                      - generic [ref=f2e1998]: Ouro Noturno
                      - generic [ref=f2e1999]: Elegantes · escura
                      - generic [ref=f2e2000]: Preto quente com dourado e champanhe.
                  - button "Prompt" [ref=f2e2002] [cursor=pointer]
                - generic [ref=f2e2006]:
                  - button "Marfim Elegantes · clara Marfim, carvão e couro." [ref=f2e2007] [cursor=pointer]:
                    - generic [ref=f2e2031]:
                      - generic [ref=f2e2032]: Marfim
                      - generic [ref=f2e2033]: Elegantes · clara
                      - generic [ref=f2e2034]: Marfim, carvão e couro.
                  - button "Prompt" [ref=f2e2036] [cursor=pointer]
                - generic [ref=f2e2040]:
                  - button "Champagne Elegantes · clara Bege champanhe com bronze." [ref=f2e2041] [cursor=pointer]:
                    - generic [ref=f2e2065]:
                      - generic [ref=f2e2066]: Champagne
                      - generic [ref=f2e2067]: Elegantes · clara
                      - generic [ref=f2e2068]: Bege champanhe com bronze.
                  - button "Prompt" [ref=f2e2070] [cursor=pointer]
                - generic [ref=f2e2074]:
                  - button "Esmeralda Real Elegantes · clara Verde esmeralda profundo com ouro." [ref=f2e2075] [cursor=pointer]:
                    - generic [ref=f2e2099]:
                      - generic [ref=f2e2100]: Esmeralda Real
                      - generic [ref=f2e2101]: Elegantes · clara
                      - generic [ref=f2e2102]: Verde esmeralda profundo com ouro.
                  - button "Prompt" [ref=f2e2104] [cursor=pointer]
                - generic [ref=f2e2108]:
                  - button "Ameixa Luxo Elegantes · clara Ameixa, rosé antigo e nude." [ref=f2e2109] [cursor=pointer]:
                    - generic [ref=f2e2133]:
                      - generic [ref=f2e2134]: Ameixa Luxo
                      - generic [ref=f2e2135]: Elegantes · clara
                      - generic [ref=f2e2136]: Ameixa, rosé antigo e nude.
                  - button "Prompt" [ref=f2e2138] [cursor=pointer]
                - generic [ref=f2e2142]:
                  - button "Obsidiana Elegantes · escura Preto vulcânico com prata e lilás." [ref=f2e2143] [cursor=pointer]:
                    - generic [ref=f2e2167]:
                      - generic [ref=f2e2168]: Obsidiana
                      - generic [ref=f2e2169]: Elegantes · escura
                      - generic [ref=f2e2170]: Preto vulcânico com prata e lilás.
                  - button "Prompt" [ref=f2e2172] [cursor=pointer]
                - generic [ref=f2e2176]:
                  - button "Floresta Naturais · clara Verdes de mata com madeira clara." [ref=f2e2177] [cursor=pointer]:
                    - generic [ref=f2e2201]:
                      - generic [ref=f2e2202]: Floresta
                      - generic [ref=f2e2203]: Naturais · clara
                      - generic [ref=f2e2204]: Verdes de mata com madeira clara.
                  - button "Prompt" [ref=f2e2206] [cursor=pointer]
                - generic [ref=f2e2210]:
                  - button "Musgo Naturais · clara Oliva, verde-escuro e caramelo." [ref=f2e2211] [cursor=pointer]:
                    - generic [ref=f2e2235]:
                      - generic [ref=f2e2236]: Musgo
                      - generic [ref=f2e2237]: Naturais · clara
                      - generic [ref=f2e2238]: Oliva, verde-escuro e caramelo.
                  - button "Prompt" [ref=f2e2240] [cursor=pointer]
                - generic [ref=f2e2244]:
                  - button "Argila Naturais · clara Siena, marrom e verde-sálvia." [ref=f2e2245] [cursor=pointer]:
                    - generic [ref=f2e2269]:
                      - generic [ref=f2e2270]: Argila
                      - generic [ref=f2e2271]: Naturais · clara
                      - generic [ref=f2e2272]: Siena, marrom e verde-sálvia.
                  - button "Prompt" [ref=f2e2274] [cursor=pointer]
                - generic [ref=f2e2278]:
                  - button "Sálvia Naturais · clara Sálvia acinzentada com amarelo-mel." [ref=f2e2279] [cursor=pointer]:
                    - generic [ref=f2e2303]:
                      - generic [ref=f2e2304]: Sálvia
                      - generic [ref=f2e2305]: Naturais · clara
                      - generic [ref=f2e2306]: Sálvia acinzentada com amarelo-mel.
                  - button "Prompt" [ref=f2e2308] [cursor=pointer]
                - generic [ref=f2e2312]:
                  - button "Mar e Areia Naturais · clara Verde-mar com pêssego de areia." [ref=f2e2313] [cursor=pointer]:
                    - generic [ref=f2e2337]:
                      - generic [ref=f2e2338]: Mar e Areia
                      - generic [ref=f2e2339]: Naturais · clara
                      - generic [ref=f2e2340]: Verde-mar com pêssego de areia.
                  - button "Prompt" [ref=f2e2342] [cursor=pointer]
                - generic [ref=f2e2346]:
                  - button "Noite na Mata Naturais · escura Modo escuro verde-floresta com laranja." [ref=f2e2347] [cursor=pointer]:
                    - generic [ref=f2e2371]:
                      - generic [ref=f2e2372]: Noite na Mata
                      - generic [ref=f2e2373]: Naturais · escura
                      - generic [ref=f2e2374]: Modo escuro verde-floresta com laranja.
                  - button "Prompt" [ref=f2e2376] [cursor=pointer]
          - complementary "Prévia da identidade" [ref=f2e2380]:
            - generic [ref=f2e2381]:
              - strong [ref=f2e2382]: Prévia da identidade
              - generic [ref=f2e2383]: Clara
            - generic [ref=f2e2384]:
              - complementary [ref=f2e2385]:
                - generic [ref=f2e2386]: Marca
                - generic [ref=f2e2388]: Início
                - generic [ref=f2e2392]: Projetos
                - generic [ref=f2e2398]: Equipe
                - generic [ref=f2e2404]: Ajustes
              - generic [ref=f2e2408]:
                - generic [ref=f2e2410]:
                  - generic [ref=f2e2411]: Visão geral
                  - generic [ref=f2e2412]: Texto secundário com um link
                - generic [ref=f2e2420]:
                  - generic [ref=f2e2421]: Primário
                  - generic [ref=f2e2422]: Hover
                  - generic [ref=f2e2423]: Secundário
                  - generic [ref=f2e2424]: Destaque
                  - generic [ref=f2e2425]: Desabilitado
                - generic [ref=f2e2426]:
                  - generic [ref=f2e2427]:
                    - generic [ref=f2e2428]: Campo
                    - generic [ref=f2e2429]: Placeholder…
                  - generic [ref=f2e2430]:
                    - generic [ref=f2e2431]: Com foco
                    - generic [ref=f2e2432]: maria@email.com
                - generic [ref=f2e2433]:
                  - generic [ref=f2e2434]:
                    - strong [ref=f2e2435]: Pedidos recentes
                    - generic [ref=f2e2436]: 12 novos
                  - generic [ref=f2e2437]:
                    - generic [ref=f2e2438]: Ana Souza
                    - generic [ref=f2e2439]: R$ 120,00
                  - generic [ref=f2e2440]:
                    - generic [ref=f2e2441]: Bruno Lima
                    - generic [ref=f2e2442]: R$ 207,00
                  - generic [ref=f2e2443]:
                    - generic [ref=f2e2444]: Carla Dias
                    - generic [ref=f2e2445]: R$ 294,00
                - generic [ref=f2e2446]:
                  - generic [ref=f2e2447]: Alterações salvas
                  - generic [ref=f2e2451]: Plano perto do limite
                  - generic [ref=f2e2454]: Falha no pagamento
                  - generic [ref=f2e2459]: Nova versão disponível
            - generic [ref=f2e2462]:
              - button "Prompt da identidade" [ref=f2e2463] [cursor=pointer]
              - button "CSS dos tokens" [ref=f2e2467] [cursor=pointer]
        - generic [ref=f2e2471]:
          - button "Voltar" [ref=f2e2473] [cursor=pointer]
          - 'button "Continuar: Navegação" [ref=f2e2477] [cursor=pointer]'
  - status
```

# Test source

```ts
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
> 832 |         expect(h.own, `${name} em scrollY=${y}: coberto por ${h.cover}`).toBe(true)
      |                                                                          ^ Error: Prompt da identidade em scrollY=600: coberto por gd-footer
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
  845 |     expect(phone.y + phone.height, 'base do celular grande × topo do rodapé').toBeLessThanOrEqual(footer.y)
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
```