# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-03 · Controles da identidade e dos componentes alteram a prévia >> "Estilo dos ícones" (Preenchido/Duotone) muda os ícones da prévia da identidade
- Location: tests/e2e/regression.spec.ts:272:3

# Error details

```
Error: ícones da prévia devem refletir o estilo "Preenchido"

expect(received).not.toBe(expected) // Object.is equality

Expected: not "none|none|2;none|none|2;none|none|2;none|none|2;none|none|2;none|none|2;none|none|2;none|none|2;none|none|2;none|none|2"
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
              - tab "Tipografia" [ref=f1e258] [cursor=pointer]
              - tab "Formas e superfícies" [selected] [ref=f1e259] [cursor=pointer]
            - generic [ref=f1e260]:
              - generic [ref=f1e261]: "Nada aqui é obrigatório: cantos quadrados, superfícies planas e nenhuma sombra são escolhas tão válidas quanto vidro fosco e cantos arredondados."
              - generic [ref=f1e265]:
                - heading "Cantos" [level=2] [ref=f1e268]
                - generic [ref=f1e269]:
                  - button "Quadrados (0 px)" [ref=f1e270] [cursor=pointer]
                  - button "Discretos (4 px)" [ref=f1e274] [cursor=pointer]
                  - button "Médios (8 px)" [pressed] [ref=f1e278] [cursor=pointer]
                  - button "Grandes (14 px)" [ref=f1e282] [cursor=pointer]
                  - button "Pílula (totalmente arredondados)" [ref=f1e286] [cursor=pointer]
              - generic [ref=f1e290]:
                - heading "Superfícies" [level=2] [ref=f1e293]
                - generic [ref=f1e294]:
                  - button "Plana (sem bordas nem sombras)" [ref=f1e295] [cursor=pointer]
                  - button "Contornada (bordas finas)" [pressed] [ref=f1e299] [cursor=pointer]
                  - button "Elevada (sombras)" [ref=f1e303] [cursor=pointer]
                  - button "Vidro fosco (translúcida)" [ref=f1e307] [cursor=pointer]
              - generic [ref=f1e311]:
                - heading "Sombras" [level=2] [ref=f1e314]
                - generic [ref=f1e315]:
                  - button "Sem sombra" [pressed] [ref=f1e316] [cursor=pointer]
                  - button "Sutil" [ref=f1e320] [cursor=pointer]
                  - button "Média" [ref=f1e324] [cursor=pointer]
                  - button "Forte" [ref=f1e328] [cursor=pointer]
              - generic [ref=f1e332]:
                - heading "Bordas" [level=2] [ref=f1e335]
                - generic [ref=f1e336]:
                  - button "Sem borda" [ref=f1e337] [cursor=pointer]
                  - button "1 px" [pressed] [ref=f1e341] [cursor=pointer]
                  - button "2 px" [ref=f1e345] [cursor=pointer]
              - generic [ref=f1e349]:
                - heading "Densidade" [level=2] [ref=f1e352]
                - generic [ref=f1e353]:
                  - button "Compacta" [ref=f1e354] [cursor=pointer]
                  - button "Confortável" [pressed] [ref=f1e361] [cursor=pointer]
                  - button "Espaçosa" [ref=f1e368] [cursor=pointer]
              - generic [ref=f1e375]:
                - heading "Estilo dos ícones" [level=2] [ref=f1e378]
                - generic [ref=f1e379]:
                  - button "Contorno" [ref=f1e380] [cursor=pointer]
                  - button "Preenchido" [active] [pressed] [ref=f1e385] [cursor=pointer]
                  - button "Duotone" [ref=f1e390] [cursor=pointer]
          - complementary "Prévia da identidade" [ref=f1e395]:
            - generic [ref=f1e396]:
              - strong [ref=f1e397]: Prévia da identidade
              - generic [ref=f1e398]: Clara
            - generic [ref=f1e399]:
              - complementary [ref=f1e400]:
                - generic [ref=f1e401]: Marca
                - generic [ref=f1e403]: Início
                - generic [ref=f1e407]: Projetos
                - generic [ref=f1e413]: Equipe
                - generic [ref=f1e419]: Ajustes
              - generic [ref=f1e423]:
                - generic [ref=f1e425]:
                  - generic [ref=f1e426]: Visão geral
                  - generic [ref=f1e427]: Texto secundário com um link
                - generic [ref=f1e435]:
                  - generic [ref=f1e436]: Primário
                  - generic [ref=f1e437]: Hover
                  - generic [ref=f1e438]: Secundário
                  - generic [ref=f1e439]: Destaque
                  - generic [ref=f1e440]: Desabilitado
                - generic [ref=f1e441]:
                  - generic [ref=f1e442]:
                    - generic [ref=f1e443]: Campo
                    - generic [ref=f1e444]: Placeholder…
                  - generic [ref=f1e445]:
                    - generic [ref=f1e446]: Com foco
                    - generic [ref=f1e447]: maria@email.com
                - generic [ref=f1e448]:
                  - generic [ref=f1e449]:
                    - strong [ref=f1e450]: Pedidos recentes
                    - generic [ref=f1e451]: 12 novos
                  - generic [ref=f1e452]:
                    - generic [ref=f1e453]: Ana Souza
                    - generic [ref=f1e454]: R$ 120,00
                  - generic [ref=f1e455]:
                    - generic [ref=f1e456]: Bruno Lima
                    - generic [ref=f1e457]: R$ 207,00
                  - generic [ref=f1e458]:
                    - generic [ref=f1e459]: Carla Dias
                    - generic [ref=f1e460]: R$ 294,00
                - generic [ref=f1e461]:
                  - generic [ref=f1e462]: Alterações salvas
                  - generic [ref=f1e466]: Plano perto do limite
                  - generic [ref=f1e469]: Falha no pagamento
                  - generic [ref=f1e474]: Nova versão disponível
            - generic [ref=f1e477]:
              - button "Prompt da identidade" [ref=f1e478] [cursor=pointer]
              - button "CSS dos tokens" [ref=f1e482] [cursor=pointer]
  - status
```

# Test source

```ts
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
> 281 |     expect(await icons(), 'ícones da prévia devem refletir o estilo "Preenchido"').not.toBe(before)
      |                                                                                        ^ Error: ícones da prévia devem refletir o estilo "Preenchido"
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
```