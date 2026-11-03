# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-19 · Login e cadastro correspondem à seleção >> com "Apenas login" e sem cadastro escolhido, a prévia integrada não oferece a página "Cadastro"
- Location: tests/e2e/regression.spec.ts:983:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' })
Expected: 0
Received: 1
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' }) with timeout 10000ms
  - waiting for getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' })
    23 × locator resolved to 1 element
       - unexpected value "1"

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
          - listitem [ref=f2e244]:
            - text: ›
            - link "Estrutura" [ref=f2e245] [cursor=pointer]:
              - /url: "#/livre"
          - listitem [ref=f2e246]: ›Live Site Preview
      - generic [ref=f2e247]:
        - generic [ref=f2e249]:
          - generic [ref=f2e250]: Estrutura
          - heading "Live Site Preview" [level=1] [ref=f2e251]
          - paragraph [ref=f2e252]: "Todas as suas escolhas juntas: layout, header, sidebar, paleta, tipografia, landing, login e cadastro. Alterne entre computador, tablet e celular e olhe com calma: é assim que o site deve ficar?"
        - generic [ref=f2e253]:
          - generic [ref=f2e254]:
            - generic [ref=f2e255]:
              - group "Página da prévia" [ref=f2e256]:
                - button "Aplicação" [pressed] [ref=f2e257] [cursor=pointer]
                - button "Login" [ref=f2e258] [cursor=pointer]
                - button "Cadastro" [ref=f2e259] [cursor=pointer]
              - group "Dispositivo da prévia" [ref=f2e260]:
                - button "Computador" [pressed] [ref=f2e261] [cursor=pointer]
                - button "Tablet" [ref=f2e264] [cursor=pointer]
                - button "Celular" [ref=f2e267] [cursor=pointer]
            - img "Prévia do computador" [ref=f2e271]:
              - generic [ref=f2e273]:
                - generic [ref=f2e276]:
                  - generic [ref=f2e277]: Projeto Regressão
                  - generic [ref=f2e280]: Início
                  - generic [ref=f2e284]: Relatórios
                  - generic [ref=f2e287]: Clientes
                  - generic [ref=f2e293]: Agenda
                  - generic [ref=f2e296]: Mensagens
                  - generic [ref=f2e300]: Configurações
                  - generic [ref=f2e305]:
                    - generic [ref=f2e306]: AV
                    - text: Ana Vieira
                - generic [ref=f2e309]:
                  - generic [ref=f2e310]: Projeto Regressão
                  - navigation [ref=f2e312]:
                    - generic [ref=f2e313]: Visão geral
                    - generic [ref=f2e314]: Projetos
                    - generic [ref=f2e315]: Equipe
                  - generic [ref=f2e316]: Buscar…
                  - generic [ref=f2e323]: AV
                - generic [ref=f2e326]:
                  - generic [ref=f2e327]:
                    - generic [ref=f2e328]:
                      - generic [ref=f2e329]: Visão geral
                      - generic [ref=f2e330]: Atualizado há 5 minutos
                    - generic [ref=f2e331]:
                      - generic [ref=f2e332]: Filtros
                      - generic [ref=f2e335]: Novo
                  - generic [ref=f2e337]:
                    - generic [ref=f2e338]:
                      - generic [ref=f2e339]: Receita
                      - generic [ref=f2e340]: R$ 48,2 mil
                      - generic [ref=f2e341]: 12,4%
                    - generic [ref=f2e345]:
                      - generic [ref=f2e346]: Clientes ativos
                      - generic [ref=f2e347]: "1.284"
                      - generic [ref=f2e348]: 3,1%
                    - generic [ref=f2e352]:
                      - generic [ref=f2e353]: Ticket médio
                      - generic [ref=f2e354]: R$ 186
                      - generic [ref=f2e355]: 5,8%
                    - generic [ref=f2e359]:
                      - generic [ref=f2e360]: Satisfação
                      - generic [ref=f2e361]: 94%
                      - generic [ref=f2e362]: 1,2%
                  - generic [ref=f2e367]:
                    - strong [ref=f2e368]: Receita mensal
                    - generic [ref=f2e369]: Últimos 12 meses
                  - generic [ref=f2e383]:
                    - generic [ref=f2e384]:
                      - strong [ref=f2e385]: Clientes recentes
                      - generic [ref=f2e386]: Ver todos
                    - generic [ref=f2e389]:
                      - generic [ref=f2e390]: Marina Costa
                      - generic [ref=f2e391]: Plano Pro
                      - generic [ref=f2e392]: Ativo
                      - generic [ref=f2e393]: R$ 249,00
                    - generic [ref=f2e394]:
                      - generic [ref=f2e395]: João Pereira
                      - generic [ref=f2e396]: Plano Básico
                      - generic [ref=f2e397]: Pendente
                      - generic [ref=f2e398]: R$ 89,00
                    - generic [ref=f2e399]:
                      - generic [ref=f2e400]: Luiza Rocha
                      - generic [ref=f2e401]: Plano Pro
                      - generic [ref=f2e402]: Ativo
                      - generic [ref=f2e403]: R$ 249,00
                    - generic [ref=f2e404]:
                      - generic [ref=f2e405]: Pedro Alves
                      - generic [ref=f2e406]: Empresa
                      - generic [ref=f2e407]: Atrasado
                      - generic [ref=f2e408]: R$ 990,00
          - complementary "Escolhas nesta prévia" [ref=f2e409]:
            - strong [ref=f2e410]: Escolhas nesta prévia
            - generic [ref=f2e411]:
              - generic [ref=f2e412]:
                - term [ref=f2e413]: Fluxo de entrada
                - definition [ref=f2e414]:
                  - generic [ref=f2e415]: Apenas login
                  - link "Alterar Fluxo de entrada" [ref=f2e416] [cursor=pointer]:
                    - /url: "#/guiado/entrada"
              - generic [ref=f2e420]:
                - term [ref=f2e421]: Layout desktop
                - definition [ref=f2e422]:
                  - generic [ref=f2e423]: Sidebar integral clássica
                  - link "Alterar Layout desktop" [ref=f2e424] [cursor=pointer]:
                    - /url: "#/modulos/desktop"
              - generic [ref=f2e428]:
                - term [ref=f2e429]: Layout mobile
                - definition [ref=f2e430]:
                  - generic [ref=f2e431]: Bottom Navigation clássica
                  - link "Alterar Layout mobile" [ref=f2e432] [cursor=pointer]:
                    - /url: "#/modulos/mobile"
              - generic [ref=f2e436]:
                - term [ref=f2e437]: Header
                - definition [ref=f2e438]:
                  - generic [ref=f2e439]: Padrão da identidade
                  - link "Alterar Header" [ref=f2e440] [cursor=pointer]:
                    - /url: "#/modulos/navegacao"
              - generic [ref=f2e444]:
                - term [ref=f2e445]: Sidebar
                - definition [ref=f2e446]:
                  - generic [ref=f2e447]: Padrão da identidade
                  - link "Alterar Sidebar" [ref=f2e448] [cursor=pointer]:
                    - /url: "#/modulos/navegacao"
              - generic [ref=f2e452]:
                - term [ref=f2e453]: Paleta
                - definition [ref=f2e454]:
                  - generic [ref=f2e455]: Neutro Essencial
                  - link "Alterar Paleta" [ref=f2e456] [cursor=pointer]:
                    - /url: "#/modulos/cores"
              - generic [ref=f2e460]:
                - term [ref=f2e461]: Tipografia
                - definition [ref=f2e462]:
                  - generic [ref=f2e463]: Inter + Inter
                  - link "Alterar Tipografia" [ref=f2e464] [cursor=pointer]:
                    - /url: "#/modulos/cores"
              - generic [ref=f2e468]:
                - term [ref=f2e469]: Login
                - definition [ref=f2e470]:
                  - generic [ref=f2e471]: Clássico central
                  - link "Alterar Login" [ref=f2e472] [cursor=pointer]:
                    - /url: "#/modulos/login"
              - generic [ref=f2e476]:
                - term [ref=f2e477]: Cadastro
                - definition [ref=f2e478]:
                  - generic [ref=f2e479]: Não escolhido
                  - link "Alterar Cadastro" [ref=f2e480] [cursor=pointer]:
                    - /url: "#/modulos/cadastro"
            - paragraph [ref=f2e484]: Qualquer alteração em outro módulo aparece aqui imediatamente.
  - status
```

# Test source

```ts
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
> 989  |     await expect(pages.getByRole('button', { name: 'Cadastro' })).toHaveCount(0)
       |                                                                   ^ Error: expect(locator).toHaveCount(expected) failed
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