# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-12 · Mudanças na paleta se propagam >> troca manual da cor primária recalcula hover, active, foco e link
- Location: tests/e2e/regression.spec.ts:670:3

# Error details

```
Error: Primária — hover deve acompanhar a nova primária

expect(received).not.toBe(expected) // Object.is equality

Expected: not "#161618"
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
            - link "Identidade" [ref=f1e245] [cursor=pointer]:
              - /url: "#/livre"
          - listitem [ref=f1e246]: ›Color System
      - generic [ref=f1e247]:
        - generic [ref=f1e249]:
          - generic [ref=f1e250]: Identidade
          - heading "Color System" [level=1] [ref=f1e251]
          - paragraph [ref=f1e252]: A fonte central de cores e estilos do projeto. Escolha uma das 60 paletas, ajuste tokens individualmente e defina tipografia e formas. Tudo o que herda a identidade global é atualizado na hora.
        - generic [ref=f1e253]:
          - generic [ref=f1e254]:
            - tablist "Partes da identidade visual" [ref=f1e255]:
              - tab "Paletas" [ref=f1e256] [cursor=pointer]
              - tab "Tokens e cores" [selected] [ref=f1e257] [cursor=pointer]
              - tab "Tipografia" [ref=f1e258] [cursor=pointer]
              - tab "Formas e superfícies" [ref=f1e259] [cursor=pointer]
            - generic [ref=f1e260]:
              - generic [ref=f1e264]:
                - strong [ref=f1e265]: Herança global.
                - text: Estes 44 tokens valem para todos os componentes (botões, campos, menus, cards, tabelas, modais, login, landing e templates). Exceções para um componente específico são feitas no editor de componentes e ficam registradas como exceção explícita.
              - generic [ref=f1e266]:
                - generic [ref=f1e267]: 1 token(s) alterado(s) manualmente.
                - button "Restaurar todos" [ref=f1e268] [cursor=pointer]
              - generic [ref=f1e272]:
                - generic [ref=f1e274]:
                  - heading "Contraste (WCAG)" [level=2] [ref=f1e275]
                  - paragraph [ref=f1e276]: Pares importantes conferidos automaticamente.
                - list [ref=f1e277]:
                  - listitem [ref=f1e278]:
                    - generic [ref=f1e279]:
                      - generic [ref=f1e280]: Aa
                      - text: Texto sobre fundo
                    - generic [ref=f1e281]: 17.7:1 AA
                  - listitem [ref=f1e282]:
                    - generic [ref=f1e283]:
                      - generic [ref=f1e284]: Aa
                      - text: Texto secundário sobre fundo
                    - generic [ref=f1e285]: 4.9:1 AA
                  - listitem [ref=f1e286]:
                    - generic [ref=f1e287]:
                      - generic [ref=f1e288]: Aa
                      - text: Texto sobre primária
                    - generic [ref=f1e289]: 6.3:1 AA
                  - listitem [ref=f1e290]:
                    - generic [ref=f1e291]:
                      - generic [ref=f1e292]: Aa
                      - text: Link sobre superfície
                    - generic [ref=f1e293]: 17.7:1 AA
                  - listitem [ref=f1e294]:
                    - generic [ref=f1e295]:
                      - generic [ref=f1e296]: Aa
                      - text: Navegação
                    - generic [ref=f1e297]: 8.7:1 AA
                  - listitem [ref=f1e298]:
                    - generic [ref=f1e299]:
                      - generic [ref=f1e300]: Aa
                      - text: Selecionado
                    - generic [ref=f1e301]: 13.8:1 AA
                  - listitem [ref=f1e302]:
                    - generic [ref=f1e303]:
                      - generic [ref=f1e304]: Aa
                      - text: Anel de foco sobre fundo
                    - generic [ref=f1e305]: 17.7:1 AA
              - generic [ref=f1e306]:
                - generic [ref=f1e307]:
                  - heading "Marca" [level=3] [ref=f1e308]
                  - list [ref=f1e309]:
                    - listitem [ref=f1e310]:
                      - 'generic "Escolher cor: Cor primária" [ref=f1e311] [cursor=pointer]':
                        - 'textbox "Escolher cor: Cor primária" [ref=f1e312]': "#0b6e4f"
                      - generic [ref=f1e313]:
                        - generic [ref=f1e314]: Cor primária
                        - code [ref=f1e315]: primary
                      - textbox "Hexadecimal de Cor primária" [active] [ref=f1e316]: "#0b6e4f"
                      - button "Voltar Cor primária para a paleta" [ref=f1e317] [cursor=pointer]
                    - listitem [ref=f1e321]:
                      - 'generic "Escolher cor: Primária — hover" [ref=f1e322] [cursor=pointer]':
                        - 'textbox "Escolher cor: Primária — hover" [ref=f1e323]': "#161618"
                      - generic [ref=f1e324]:
                        - generic [ref=f1e325]: Primária — hover
                        - code [ref=f1e326]: primaryHover
                      - textbox "Hexadecimal de Primária — hover" [ref=f1e327]: "#161618"
                    - listitem [ref=f1e328]:
                      - 'generic "Escolher cor: Primária — active" [ref=f1e329] [cursor=pointer]':
                        - 'textbox "Escolher cor: Primária — active" [ref=f1e330]': "#131316"
                      - generic [ref=f1e331]:
                        - generic [ref=f1e332]: Primária — active
                        - code [ref=f1e333]: primaryActive
                      - textbox "Hexadecimal de Primária — active" [ref=f1e334]: "#131316"
                    - listitem [ref=f1e335]:
                      - 'generic "Escolher cor: Texto sobre primária" [ref=f1e336] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto sobre primária" [ref=f1e337]': "#ffffff"
                      - generic [ref=f1e338]:
                        - generic [ref=f1e339]: Texto sobre primária
                        - code [ref=f1e340]: onPrimary
                      - textbox "Hexadecimal de Texto sobre primária" [ref=f1e341]: "#ffffff"
                    - listitem [ref=f1e342]:
                      - 'generic "Escolher cor: Primária suave" [ref=f1e343] [cursor=pointer]':
                        - 'textbox "Escolher cor: Primária suave" [ref=f1e344]': "#e3e3e4"
                      - generic [ref=f1e345]:
                        - generic [ref=f1e346]: Primária suave
                        - code [ref=f1e347]: primarySoft
                      - textbox "Hexadecimal de Primária suave" [ref=f1e348]: "#e3e3e4"
                    - listitem [ref=f1e349]:
                      - 'generic "Escolher cor: Cor secundária" [ref=f1e350] [cursor=pointer]':
                        - 'textbox "Escolher cor: Cor secundária" [ref=f1e351]': "#52525b"
                      - generic [ref=f1e352]:
                        - generic [ref=f1e353]: Cor secundária
                        - code [ref=f1e354]: secondary
                      - textbox "Hexadecimal de Cor secundária" [ref=f1e355]: "#52525b"
                    - listitem [ref=f1e356]:
                      - 'generic "Escolher cor: Texto sobre secundária" [ref=f1e357] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto sobre secundária" [ref=f1e358]': "#ffffff"
                      - generic [ref=f1e359]:
                        - generic [ref=f1e360]: Texto sobre secundária
                        - code [ref=f1e361]: onSecondary
                      - textbox "Hexadecimal de Texto sobre secundária" [ref=f1e362]: "#ffffff"
                    - listitem [ref=f1e363]:
                      - 'generic "Escolher cor: Cor de destaque" [ref=f1e364] [cursor=pointer]':
                        - 'textbox "Escolher cor: Cor de destaque" [ref=f1e365]': "#2563eb"
                      - generic [ref=f1e366]:
                        - generic [ref=f1e367]: Cor de destaque
                        - code [ref=f1e368]: accent
                      - textbox "Hexadecimal de Cor de destaque" [ref=f1e369]: "#2563eb"
                    - listitem [ref=f1e370]:
                      - 'generic "Escolher cor: Texto sobre destaque" [ref=f1e371] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto sobre destaque" [ref=f1e372]': "#ffffff"
                      - generic [ref=f1e373]:
                        - generic [ref=f1e374]: Texto sobre destaque
                        - code [ref=f1e375]: onAccent
                      - textbox "Hexadecimal de Texto sobre destaque" [ref=f1e376]: "#ffffff"
                - generic [ref=f1e377]:
                  - heading "Fundos e superfícies" [level=3] [ref=f1e378]
                  - list [ref=f1e379]:
                    - listitem [ref=f1e380]:
                      - 'generic "Escolher cor: Fundo principal" [ref=f1e381] [cursor=pointer]':
                        - 'textbox "Escolher cor: Fundo principal" [ref=f1e382]': "#ffffff"
                      - generic [ref=f1e383]:
                        - generic [ref=f1e384]: Fundo principal
                        - code [ref=f1e385]: bg
                      - textbox "Hexadecimal de Fundo principal" [ref=f1e386]: "#ffffff"
                    - listitem [ref=f1e387]:
                      - 'generic "Escolher cor: Fundo secundário" [ref=f1e388] [cursor=pointer]':
                        - 'textbox "Escolher cor: Fundo secundário" [ref=f1e389]': "#f6f6f6"
                      - generic [ref=f1e390]:
                        - generic [ref=f1e391]: Fundo secundário
                        - code [ref=f1e392]: bgAlt
                      - textbox "Hexadecimal de Fundo secundário" [ref=f1e393]: "#f6f6f6"
                    - listitem [ref=f1e394]:
                      - 'generic "Escolher cor: Superfície" [ref=f1e395] [cursor=pointer]':
                        - 'textbox "Escolher cor: Superfície" [ref=f1e396]': "#ffffff"
                      - generic [ref=f1e397]:
                        - generic [ref=f1e398]: Superfície
                        - code [ref=f1e399]: surface
                      - textbox "Hexadecimal de Superfície" [ref=f1e400]: "#ffffff"
                    - listitem [ref=f1e401]:
                      - 'generic "Escolher cor: Superfície alternativa" [ref=f1e402] [cursor=pointer]':
                        - 'textbox "Escolher cor: Superfície alternativa" [ref=f1e403]': "#f5f5f5"
                      - generic [ref=f1e404]:
                        - generic [ref=f1e405]: Superfície alternativa
                        - code [ref=f1e406]: surfaceAlt
                      - textbox "Hexadecimal de Superfície alternativa" [ref=f1e407]: "#f5f5f5"
                - generic [ref=f1e408]:
                  - heading "Texto" [level=3] [ref=f1e409]
                  - list [ref=f1e410]:
                    - listitem [ref=f1e411]:
                      - 'generic "Escolher cor: Texto principal" [ref=f1e412] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto principal" [ref=f1e413]': "#18181b"
                      - generic [ref=f1e414]:
                        - generic [ref=f1e415]: Texto principal
                        - code [ref=f1e416]: text
                      - textbox "Hexadecimal de Texto principal" [ref=f1e417]: "#18181b"
                    - listitem [ref=f1e418]:
                      - 'generic "Escolher cor: Texto secundário" [ref=f1e419] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto secundário" [ref=f1e420]': "#707072"
                      - generic [ref=f1e421]:
                        - generic [ref=f1e422]: Texto secundário
                        - code [ref=f1e423]: textMuted
                      - textbox "Hexadecimal de Texto secundário" [ref=f1e424]: "#707072"
                    - listitem [ref=f1e425]:
                      - 'generic "Escolher cor: Texto desabilitado" [ref=f1e426] [cursor=pointer]':
                        - 'textbox "Escolher cor: Texto desabilitado" [ref=f1e427]': "#a7a7a8"
                      - generic [ref=f1e428]:
                        - generic [ref=f1e429]: Texto desabilitado
                        - code [ref=f1e430]: textDisabled
                      - textbox "Hexadecimal de Texto desabilitado" [ref=f1e431]: "#a7a7a8"
                    - listitem [ref=f1e432]:
                      - 'generic "Escolher cor: Placeholder" [ref=f1e433] [cursor=pointer]':
                        - 'textbox "Escolher cor: Placeholder" [ref=f1e434]': "#8c8c8d"
                      - generic [ref=f1e435]:
                        - generic [ref=f1e436]: Placeholder
                        - code [ref=f1e437]: placeholder
                      - textbox "Hexadecimal de Placeholder" [ref=f1e438]: "#8c8c8d"
                - generic [ref=f1e439]:
                  - heading "Bordas e foco" [level=3] [ref=f1e440]
                  - list [ref=f1e441]:
                    - listitem [ref=f1e442]:
                      - 'generic "Escolher cor: Borda" [ref=f1e443] [cursor=pointer]':
                        - 'textbox "Escolher cor: Borda" [ref=f1e444]': "#e6e6e6"
                      - generic [ref=f1e445]:
                        - generic [ref=f1e446]: Borda
                        - code [ref=f1e447]: border
                      - textbox "Hexadecimal de Borda" [ref=f1e448]: "#e6e6e6"
                    - listitem [ref=f1e449]:
                      - 'generic "Escolher cor: Borda forte" [ref=f1e450] [cursor=pointer]':
                        - 'textbox "Escolher cor: Borda forte" [ref=f1e451]': "#c7c7c7"
                      - generic [ref=f1e452]:
                        - generic [ref=f1e453]: Borda forte
                        - code [ref=f1e454]: borderStrong
                      - textbox "Hexadecimal de Borda forte" [ref=f1e455]: "#c7c7c7"
                    - listitem [ref=f1e456]:
                      - 'generic "Escolher cor: Borda de foco (focus-visible)" [ref=f1e457] [cursor=pointer]':
                        - 'textbox "Escolher cor: Borda de foco (focus-visible)" [ref=f1e458]': "#18181b"
                      - generic [ref=f1e459]:
                        - generic [ref=f1e460]: Borda de foco (focus-visible)
                        - code [ref=f1e461]: focusRing
                      - textbox "Hexadecimal de Borda de foco (focus-visible)" [ref=f1e462]: "#18181b"
                - generic [ref=f1e463]:
                  - heading "Estados" [level=3] [ref=f1e464]
                  - list [ref=f1e465]:
                    - listitem [ref=f1e466]:
                      - 'generic "Escolher cor: Hover" [ref=f1e467] [cursor=pointer]':
                        - 'textbox "Escolher cor: Hover" [ref=f1e468]': "#f4f4f4"
                      - generic [ref=f1e469]:
                        - generic [ref=f1e470]: Hover
                        - code [ref=f1e471]: hover
                      - textbox "Hexadecimal de Hover" [ref=f1e472]: "#f4f4f4"
                    - listitem [ref=f1e473]:
                      - 'generic "Escolher cor: Active" [ref=f1e474] [cursor=pointer]':
                        - 'textbox "Escolher cor: Active" [ref=f1e475]': "#ebebeb"
                      - generic [ref=f1e476]:
                        - generic [ref=f1e477]: Active
                        - code [ref=f1e478]: active
                      - textbox "Hexadecimal de Active" [ref=f1e479]: "#ebebeb"
                    - listitem [ref=f1e480]:
                      - 'generic "Escolher cor: Pressed" [ref=f1e481] [cursor=pointer]':
                        - 'textbox "Escolher cor: Pressed" [ref=f1e482]': "#e0e0e0"
                      - generic [ref=f1e483]:
                        - generic [ref=f1e484]: Pressed
                        - code [ref=f1e485]: pressed
                      - textbox "Hexadecimal de Pressed" [ref=f1e486]: "#e0e0e0"
                    - listitem [ref=f1e487]:
                      - 'generic "Escolher cor: Selected — fundo" [ref=f1e488] [cursor=pointer]':
                        - 'textbox "Escolher cor: Selected — fundo" [ref=f1e489]': "#e3e3e4"
                      - generic [ref=f1e490]:
                        - generic [ref=f1e491]: Selected — fundo
                        - code [ref=f1e492]: selected
                      - textbox "Hexadecimal de Selected — fundo" [ref=f1e493]: "#e3e3e4"
                    - listitem [ref=f1e494]:
                      - 'generic "Escolher cor: Selected — texto" [ref=f1e495] [cursor=pointer]':
                        - 'textbox "Escolher cor: Selected — texto" [ref=f1e496]': "#18181b"
                      - generic [ref=f1e497]:
                        - generic [ref=f1e498]: Selected — texto
                        - code [ref=f1e499]: selectedText
                      - textbox "Hexadecimal de Selected — texto" [ref=f1e500]: "#18181b"
                    - listitem [ref=f1e501]:
                      - 'generic "Escolher cor: Disabled — fundo" [ref=f1e502] [cursor=pointer]':
                        - 'textbox "Escolher cor: Disabled — fundo" [ref=f1e503]': "#f0f0f0"
                      - generic [ref=f1e504]:
                        - generic [ref=f1e505]: Disabled — fundo
                        - code [ref=f1e506]: disabled
                      - textbox "Hexadecimal de Disabled — fundo" [ref=f1e507]: "#f0f0f0"
                    - listitem [ref=f1e508]:
                      - 'generic "Escolher cor: Disabled — texto" [ref=f1e509] [cursor=pointer]':
                        - 'textbox "Escolher cor: Disabled — texto" [ref=f1e510]': "#979798"
                      - generic [ref=f1e511]:
                        - generic [ref=f1e512]: Disabled — texto
                        - code [ref=f1e513]: disabledText
                      - textbox "Hexadecimal de Disabled — texto" [ref=f1e514]: "#979798"
                - generic [ref=f1e515]:
                  - heading "Semânticos" [level=3] [ref=f1e516]
                  - list [ref=f1e517]:
                    - listitem [ref=f1e518]:
                      - 'generic "Escolher cor: Success" [ref=f1e519] [cursor=pointer]':
                        - 'textbox "Escolher cor: Success" [ref=f1e520]': "#117e39"
                      - generic [ref=f1e521]:
                        - generic [ref=f1e522]: Success
                        - code [ref=f1e523]: success
                      - textbox "Hexadecimal de Success" [ref=f1e524]: "#117e39"
                    - listitem [ref=f1e525]:
                      - 'generic "Escolher cor: Success — fundo" [ref=f1e526] [cursor=pointer]':
                        - 'textbox "Escolher cor: Success — fundo" [ref=f1e527]': "#e3f4e9"
                      - generic [ref=f1e528]:
                        - generic [ref=f1e529]: Success — fundo
                        - code [ref=f1e530]: successBg
                      - textbox "Hexadecimal de Success — fundo" [ref=f1e531]: "#e3f4e9"
                    - listitem [ref=f1e532]:
                      - 'generic "Escolher cor: Warning" [ref=f1e533] [cursor=pointer]':
                        - 'textbox "Escolher cor: Warning" [ref=f1e534]': "#a85c04"
                      - generic [ref=f1e535]:
                        - generic [ref=f1e536]: Warning
                        - code [ref=f1e537]: warning
                      - textbox "Hexadecimal de Warning" [ref=f1e538]: "#a85c04"
                    - listitem [ref=f1e539]:
                      - 'generic "Escolher cor: Warning — fundo" [ref=f1e540] [cursor=pointer]':
                        - 'textbox "Escolher cor: Warning — fundo" [ref=f1e541]': "#faefe1"
                      - generic [ref=f1e542]:
                        - generic [ref=f1e543]: Warning — fundo
                        - code [ref=f1e544]: warningBg
                      - textbox "Hexadecimal de Warning — fundo" [ref=f1e545]: "#faefe1"
                    - listitem [ref=f1e546]:
                      - 'generic "Escolher cor: Error" [ref=f1e547] [cursor=pointer]':
                        - 'textbox "Escolher cor: Error" [ref=f1e548]': "#dc2626"
                      - generic [ref=f1e549]:
                        - generic [ref=f1e550]: Error
                        - code [ref=f1e551]: error
                      - textbox "Hexadecimal de Error" [ref=f1e552]: "#dc2626"
                    - listitem [ref=f1e553]:
                      - 'generic "Escolher cor: Error — fundo" [ref=f1e554] [cursor=pointer]':
                        - 'textbox "Escolher cor: Error — fundo" [ref=f1e555]': "#fbe5e5"
                      - generic [ref=f1e556]:
                        - generic [ref=f1e557]: Error — fundo
                        - code [ref=f1e558]: errorBg
                      - textbox "Hexadecimal de Error — fundo" [ref=f1e559]: "#fbe5e5"
                    - listitem [ref=f1e560]:
                      - 'generic "Escolher cor: Info" [ref=f1e561] [cursor=pointer]':
                        - 'textbox "Escolher cor: Info" [ref=f1e562]': "#2563eb"
                      - generic [ref=f1e563]:
                        - generic [ref=f1e564]: Info
                        - code [ref=f1e565]: info
                      - textbox "Hexadecimal de Info" [ref=f1e566]: "#2563eb"
                    - listitem [ref=f1e567]:
                      - 'generic "Escolher cor: Info — fundo" [ref=f1e568] [cursor=pointer]':
                        - 'textbox "Escolher cor: Info — fundo" [ref=f1e569]': "#e5ecfd"
                      - generic [ref=f1e570]:
                        - generic [ref=f1e571]: Info — fundo
                        - code [ref=f1e572]: infoBg
                      - textbox "Hexadecimal de Info — fundo" [ref=f1e573]: "#e5ecfd"
                - generic [ref=f1e574]:
                  - heading "Links, ícones e navegação" [level=3] [ref=f1e575]
                  - list [ref=f1e576]:
                    - listitem [ref=f1e577]:
                      - 'generic "Escolher cor: Link" [ref=f1e578] [cursor=pointer]':
                        - 'textbox "Escolher cor: Link" [ref=f1e579]': "#18181b"
                      - generic [ref=f1e580]:
                        - generic [ref=f1e581]: Link
                        - code [ref=f1e582]: link
                      - textbox "Hexadecimal de Link" [ref=f1e583]: "#18181b"
                    - listitem [ref=f1e584]:
                      - 'generic "Escolher cor: Link — hover" [ref=f1e585] [cursor=pointer]':
                        - 'textbox "Escolher cor: Link — hover" [ref=f1e586]': "#141417"
                      - generic [ref=f1e587]:
                        - generic [ref=f1e588]: Link — hover
                        - code [ref=f1e589]: linkHover
                      - textbox "Hexadecimal de Link — hover" [ref=f1e590]: "#141417"
                    - listitem [ref=f1e591]:
                      - 'generic "Escolher cor: Ícones" [ref=f1e592] [cursor=pointer]':
                        - 'textbox "Escolher cor: Ícones" [ref=f1e593]': "#525254"
                      - generic [ref=f1e594]:
                        - generic [ref=f1e595]: Ícones
                        - code [ref=f1e596]: icon
                      - textbox "Hexadecimal de Ícones" [ref=f1e597]: "#525254"
                    - listitem [ref=f1e598]:
                      - 'generic "Escolher cor: Navegação — fundo" [ref=f1e599] [cursor=pointer]':
                        - 'textbox "Escolher cor: Navegação — fundo" [ref=f1e600]': "#ffffff"
                      - generic [ref=f1e601]:
                        - generic [ref=f1e602]: Navegação — fundo
                        - code [ref=f1e603]: navBg
                      - textbox "Hexadecimal de Navegação — fundo" [ref=f1e604]: "#ffffff"
                    - listitem [ref=f1e605]:
                      - 'generic "Escolher cor: Navegação — texto" [ref=f1e606] [cursor=pointer]':
                        - 'textbox "Escolher cor: Navegação — texto" [ref=f1e607]': "#4b4b4d"
                      - generic [ref=f1e608]:
                        - generic [ref=f1e609]: Navegação — texto
                        - code [ref=f1e610]: navText
                      - textbox "Hexadecimal de Navegação — texto" [ref=f1e611]: "#4b4b4d"
                    - listitem [ref=f1e612]:
                      - 'generic "Escolher cor: Navegação — item ativo" [ref=f1e613] [cursor=pointer]':
                        - 'textbox "Escolher cor: Navegação — item ativo" [ref=f1e614]': "#e3e3e4"
                      - generic [ref=f1e615]:
                        - generic [ref=f1e616]: Navegação — item ativo
                        - code [ref=f1e617]: navActive
                      - textbox "Hexadecimal de Navegação — item ativo" [ref=f1e618]: "#e3e3e4"
                    - listitem [ref=f1e619]:
                      - 'generic "Escolher cor: Navegação — texto ativo" [ref=f1e620] [cursor=pointer]':
                        - 'textbox "Escolher cor: Navegação — texto ativo" [ref=f1e621]': "#18181b"
                      - generic [ref=f1e622]:
                        - generic [ref=f1e623]: Navegação — texto ativo
                        - code [ref=f1e624]: navActiveText
                      - textbox "Hexadecimal de Navegação — texto ativo" [ref=f1e625]: "#18181b"
                - generic [ref=f1e626]:
                  - heading "Gradiente" [level=3] [ref=f1e627]
                  - list [ref=f1e628]:
                    - listitem [ref=f1e629]:
                      - 'generic "Escolher cor: Gradiente — início" [ref=f1e630] [cursor=pointer]':
                        - 'textbox "Escolher cor: Gradiente — início" [ref=f1e631]': "#18181b"
                      - generic [ref=f1e632]:
                        - generic [ref=f1e633]: Gradiente — início
                        - code [ref=f1e634]: gradientFrom
                      - textbox "Hexadecimal de Gradiente — início" [ref=f1e635]: "#18181b"
                    - listitem [ref=f1e636]:
                      - 'generic "Escolher cor: Gradiente — fim" [ref=f1e637] [cursor=pointer]':
                        - 'textbox "Escolher cor: Gradiente — fim" [ref=f1e638]': "#3b73ed"
                      - generic [ref=f1e639]:
                        - generic [ref=f1e640]: Gradiente — fim
                        - code [ref=f1e641]: gradientTo
                      - textbox "Hexadecimal de Gradiente — fim" [ref=f1e642]: "#3b73ed"
          - complementary "Prévia da identidade" [ref=f1e643]:
            - generic [ref=f1e644]:
              - strong [ref=f1e645]: Prévia da identidade
              - generic [ref=f1e646]: Clara
            - generic [ref=f1e647]:
              - complementary [ref=f1e648]:
                - generic [ref=f1e649]: Marca
                - generic [ref=f1e651]: Início
                - generic [ref=f1e655]: Projetos
                - generic [ref=f1e661]: Equipe
                - generic [ref=f1e667]: Ajustes
              - generic [ref=f1e671]:
                - generic [ref=f1e673]:
                  - generic [ref=f1e674]: Visão geral
                  - generic [ref=f1e675]: Texto secundário com um link
                - generic [ref=f1e683]:
                  - generic [ref=f1e684]: Primário
                  - generic [ref=f1e685]: Hover
                  - generic [ref=f1e686]: Secundário
                  - generic [ref=f1e687]: Destaque
                  - generic [ref=f1e688]: Desabilitado
                - generic [ref=f1e689]:
                  - generic [ref=f1e690]:
                    - generic [ref=f1e691]: Campo
                    - generic [ref=f1e692]: Placeholder…
                  - generic [ref=f1e693]:
                    - generic [ref=f1e694]: Com foco
                    - generic [ref=f1e695]: maria@email.com
                - generic [ref=f1e696]:
                  - generic [ref=f1e697]:
                    - strong [ref=f1e698]: Pedidos recentes
                    - generic [ref=f1e699]: 12 novos
                  - generic [ref=f1e700]:
                    - generic [ref=f1e701]: Ana Souza
                    - generic [ref=f1e702]: R$ 120,00
                  - generic [ref=f1e703]:
                    - generic [ref=f1e704]: Bruno Lima
                    - generic [ref=f1e705]: R$ 207,00
                  - generic [ref=f1e706]:
                    - generic [ref=f1e707]: Carla Dias
                    - generic [ref=f1e708]: R$ 294,00
                - generic [ref=f1e709]:
                  - generic [ref=f1e710]: Alterações salvas
                  - generic [ref=f1e714]: Plano perto do limite
                  - generic [ref=f1e717]: Falha no pagamento
                  - generic [ref=f1e722]: Nova versão disponível
            - generic [ref=f1e725]:
              - button "Prompt da identidade" [ref=f1e726] [cursor=pointer]
              - button "CSS dos tokens" [ref=f1e730] [cursor=pointer]
  - status
```

# Test source

```ts
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
  644 |     expect(prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()).toBe('compacta')
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
> 683 |     keys.forEach((k, i) => expect(after[i], `${k} deve acompanhar a nova primária`).not.toBe(before[i]))
      |                                                                                         ^ Error: Primária — hover deve acompanhar a nova primária
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
```