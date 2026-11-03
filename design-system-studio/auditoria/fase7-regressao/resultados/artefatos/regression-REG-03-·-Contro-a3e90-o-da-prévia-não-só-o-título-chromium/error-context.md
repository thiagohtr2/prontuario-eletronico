# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-03 · Controles da identidade e dos componentes alteram a prévia >> "Tamanho base do texto" muda o corpo do texto da prévia, não só o título
- Location: tests/e2e/regression.spec.ts:257:3

# Error details

```
Error: texto "linha" da prévia deve crescer com a base de 18 px

expect(received).toBeGreaterThan(expected)

Expected: > 13
Received:   13
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
              - tab "Tokens e cores" [ref=f1e257] [cursor=pointer]
              - tab "Tipografia" [selected] [ref=f1e258] [cursor=pointer]
              - tab "Formas e superfícies" [ref=f1e259] [cursor=pointer]
            - generic [ref=f1e260]:
              - generic [ref=f1e261]:
                - heading "Fonte dos títulos" [level=2] [ref=f1e264]
                - group "Fonte dos títulos" [ref=f1e265]:
                  - button "Ag Inter Sem serifa neutra, ótima para interfaces e dashboards." [pressed] [ref=f1e266] [cursor=pointer]:
                    - generic [ref=f1e267]: Ag
                    - generic [ref=f1e269]: Inter
                    - generic [ref=f1e270]: Sem serifa neutra, ótima para interfaces e dashboards.
                  - button "Ag Fonte do sistema Usa a fonte nativa de cada aparelho. Carrega instantaneamente." [ref=f1e271] [cursor=pointer]:
                    - generic [ref=f1e272]: Ag
                    - generic [ref=f1e274]: Fonte do sistema
                    - generic [ref=f1e275]: Usa a fonte nativa de cada aparelho. Carrega instantaneamente.
                  - button "Ag Space Grotesk Geométrica com personalidade tecnológica." [ref=f1e276] [cursor=pointer]:
                    - generic [ref=f1e277]: Ag
                    - generic [ref=f1e279]: Space Grotesk
                    - generic [ref=f1e280]: Geométrica com personalidade tecnológica.
                  - button "Ag Fraunces Serifada expressiva, ideal para títulos editoriais." [ref=f1e281] [cursor=pointer]:
                    - generic [ref=f1e282]: Ag
                    - generic [ref=f1e284]: Fraunces
                    - generic [ref=f1e285]: Serifada expressiva, ideal para títulos editoriais.
                  - button "Ag Georgia Serifada clássica, leitura confortável em textos longos." [ref=f1e286] [cursor=pointer]:
                    - generic [ref=f1e287]: Ag
                    - generic [ref=f1e289]: Georgia
                    - generic [ref=f1e290]: Serifada clássica, leitura confortável em textos longos.
                  - button "Ag JetBrains Mono Monoespaçada, para dados, código e estética técnica." [ref=f1e291] [cursor=pointer]:
                    - generic [ref=f1e292]: Ag
                    - generic [ref=f1e294]: JetBrains Mono
                    - generic [ref=f1e295]: Monoespaçada, para dados, código e estética técnica.
              - generic [ref=f1e296]:
                - heading "Fonte dos textos" [level=2] [ref=f1e299]
                - group "Fonte dos textos" [ref=f1e300]:
                  - button "Ag Inter Sem serifa neutra, ótima para interfaces e dashboards." [pressed] [ref=f1e301] [cursor=pointer]:
                    - generic [ref=f1e302]: Ag
                    - generic [ref=f1e304]: Inter
                    - generic [ref=f1e305]: Sem serifa neutra, ótima para interfaces e dashboards.
                  - button "Ag Fonte do sistema Usa a fonte nativa de cada aparelho. Carrega instantaneamente." [ref=f1e306] [cursor=pointer]:
                    - generic [ref=f1e307]: Ag
                    - generic [ref=f1e309]: Fonte do sistema
                    - generic [ref=f1e310]: Usa a fonte nativa de cada aparelho. Carrega instantaneamente.
                  - button "Ag Space Grotesk Geométrica com personalidade tecnológica." [ref=f1e311] [cursor=pointer]:
                    - generic [ref=f1e312]: Ag
                    - generic [ref=f1e314]: Space Grotesk
                    - generic [ref=f1e315]: Geométrica com personalidade tecnológica.
                  - button "Ag Fraunces Serifada expressiva, ideal para títulos editoriais." [ref=f1e316] [cursor=pointer]:
                    - generic [ref=f1e317]: Ag
                    - generic [ref=f1e319]: Fraunces
                    - generic [ref=f1e320]: Serifada expressiva, ideal para títulos editoriais.
                  - button "Ag Georgia Serifada clássica, leitura confortável em textos longos." [ref=f1e321] [cursor=pointer]:
                    - generic [ref=f1e322]: Ag
                    - generic [ref=f1e324]: Georgia
                    - generic [ref=f1e325]: Serifada clássica, leitura confortável em textos longos.
                  - button "Ag JetBrains Mono Monoespaçada, para dados, código e estética técnica." [ref=f1e326] [cursor=pointer]:
                    - generic [ref=f1e327]: Ag
                    - generic [ref=f1e329]: JetBrains Mono
                    - generic [ref=f1e330]: Monoespaçada, para dados, código e estética técnica.
              - generic [ref=f1e331]:
                - heading "Tamanho e peso" [level=2] [ref=f1e334]
                - generic [ref=f1e335]:
                  - generic [ref=f1e336]:
                    - generic [ref=f1e337]: Tamanho base do texto
                    - group "Tamanho base" [ref=f1e338]:
                      - button "14 px" [ref=f1e339] [cursor=pointer]
                      - button "15 px" [ref=f1e340] [cursor=pointer]
                      - button "16 px" [ref=f1e341] [cursor=pointer]
                      - button "17 px" [ref=f1e342] [cursor=pointer]
                      - button "18 px" [active] [pressed] [ref=f1e343] [cursor=pointer]
                  - generic [ref=f1e344]:
                    - generic [ref=f1e345]: Peso dos títulos
                    - group "Peso dos títulos" [ref=f1e346]:
                      - button "Médio" [ref=f1e347] [cursor=pointer]
                      - button "Semi-negrito" [ref=f1e348] [cursor=pointer]
                      - button "Forte" [pressed] [ref=f1e349] [cursor=pointer]
                      - button "Negrito" [ref=f1e350] [cursor=pointer]
                      - button "Extra" [ref=f1e351] [cursor=pointer]
                  - generic [ref=f1e352]:
                    - generic [ref=f1e353]: Peso dos textos
                    - group "Peso dos textos" [ref=f1e354]:
                      - button "Regular" [pressed] [ref=f1e355] [cursor=pointer]
                      - button "Leve reforço" [ref=f1e356] [cursor=pointer]
                      - button "Médio" [ref=f1e357] [cursor=pointer]
          - complementary "Prévia da identidade" [ref=f1e358]:
            - generic [ref=f1e359]:
              - strong [ref=f1e360]: Prévia da identidade
              - generic [ref=f1e361]: Clara
            - generic [ref=f1e362]:
              - complementary [ref=f1e363]:
                - generic [ref=f1e364]: Marca
                - generic [ref=f1e366]: Início
                - generic [ref=f1e370]: Projetos
                - generic [ref=f1e376]: Equipe
                - generic [ref=f1e382]: Ajustes
              - generic [ref=f1e386]:
                - generic [ref=f1e388]:
                  - generic [ref=f1e389]: Visão geral
                  - generic [ref=f1e390]: Texto secundário com um link
                - generic [ref=f1e398]:
                  - generic [ref=f1e399]: Primário
                  - generic [ref=f1e400]: Hover
                  - generic [ref=f1e401]: Secundário
                  - generic [ref=f1e402]: Destaque
                  - generic [ref=f1e403]: Desabilitado
                - generic [ref=f1e404]:
                  - generic [ref=f1e405]:
                    - generic [ref=f1e406]: Campo
                    - generic [ref=f1e407]: Placeholder…
                  - generic [ref=f1e408]:
                    - generic [ref=f1e409]: Com foco
                    - generic [ref=f1e410]: maria@email.com
                - generic [ref=f1e411]:
                  - generic [ref=f1e412]:
                    - strong [ref=f1e413]: Pedidos recentes
                    - generic [ref=f1e414]: 12 novos
                  - generic [ref=f1e415]:
                    - generic [ref=f1e416]: Ana Souza
                    - generic [ref=f1e417]: R$ 120,00
                  - generic [ref=f1e418]:
                    - generic [ref=f1e419]: Bruno Lima
                    - generic [ref=f1e420]: R$ 207,00
                  - generic [ref=f1e421]:
                    - generic [ref=f1e422]: Carla Dias
                    - generic [ref=f1e423]: R$ 294,00
                - generic [ref=f1e424]:
                  - generic [ref=f1e425]: Alterações salvas
                  - generic [ref=f1e429]: Plano perto do limite
                  - generic [ref=f1e432]: Falha no pagamento
                  - generic [ref=f1e437]: Nova versão disponível
            - generic [ref=f1e440]:
              - button "Prompt da identidade" [ref=f1e441] [cursor=pointer]
              - button "CSS dos tokens" [ref=f1e445] [cursor=pointer]
  - status
```

# Test source

```ts
  168 |         await expectVisiblySelected(page, g.prefix, 2, 'tap')
  169 |       }
  170 |     })
  171 |   })
  172 | 
  173 |   test('modo guiado: painel de destaque confirma "Escolhido para o seu projeto"', async ({ page }) => {
  174 |     await freshStart(page)
  175 |     await go(page, '/guiado/desktop')
  176 |     await expect(page.getByText('Exemplo · ainda não escolhido')).toBeVisible()
  177 |     await page.getByRole('button', { name: 'Escolher este modelo' }).click()
  178 |     await expect(page.getByText('Escolhido para o seu projeto')).toBeVisible()
  179 |     await expect(page.getByTestId('guided-next')).toBeEnabled()
  180 |   })
  181 | })
  182 | 
  183 | test.describe('REG-02 · Clicar em miniaturas não rola a página sozinha', () => {
  184 |   test.describe('celular 360×800 (toque real, sem rolagem automática da ferramenta)', () => {
  185 |     test.use(MOBILE)
  186 |     test('etapa 3 do guiado: "Escolher este modelo" e miniaturas mantêm a rolagem', async ({ page }) => {
  187 |       await freshStart(page)
  188 |       await go(page, '/guiado/objetivo')
  189 |       await page.getByTestId('project-type-saas').tap()
  190 |       await go(page, '/guiado/desktop')
  191 |       const choose = page.getByRole('button', { name: 'Escolher este modelo' })
  192 |       // O relato original (−378 px) veio de locator.tap() com o botão sob a barra superior fixa:
  193 |       // o Playwright rola o alvo para o centro antes de tocar. Aqui o dedo toca onde o botão está.
  194 |       for (const y of [140, 420]) {
  195 |         await placeAt(page, choose, y)
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
> 268 |       expect(await fontSize(l), `texto "${k}" da prévia deve crescer com a base de 18 px`).toBeGreaterThan(before[k as keyof typeof before])
      |                                                                                            ^ Error: texto "linha" da prévia deve crescer com a base de 18 px
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
```