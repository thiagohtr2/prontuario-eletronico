# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: regression.spec.ts >> REG-18 · Desktop e celular compatíveis >> celular 360×800 >> a prévia integrada abre no modo Celular quando a tela é de celular
- Location: tests/e2e/regression.spec.ts:973:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('live-preview').getByTestId('phone-preview').first()
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByTestId('live-preview').getByTestId('phone-preview').first() with timeout 3000ms
  - waiting for getByTestId('live-preview').getByTestId('phone-preview').first()

```

```yaml
- link "Pular para o conteúdo":
  - /url: "#conteudo"
- banner:
  - button "Abrir menu":
    - img
  - link "Atelier UI — início":
    - /url: "#/"
    - text: Atelier UI
  - button "Buscar funcionalidades (Ctrl+K)"
  - button "Abrir Master Prompt":
    - img
- complementary "Navegação do Studio":
  - text: Menu
  - button "Fechar menu":
    - img
  - group "Modo de utilização":
    - button "Guiado" [pressed]:
      - img
      - text: Guiado
    - button "Livre":
      - img
      - text: Livre
  - list:
    - listitem:
      - link "Início":
        - /url: "#/"
  - button "Construtor guiado" [expanded]
  - list:
    - listitem:
      - link "Objetivo do projeto":
        - /url: "#/guiado/objetivo"
    - listitem:
      - link "Landing, login e cadastro":
        - /url: "#/guiado/entrada"
    - listitem:
      - link "Arquitetura do computador":
        - /url: "#/guiado/desktop"
    - listitem:
      - link "Arquitetura do celular":
        - /url: "#/guiado/mobile"
    - listitem:
      - link "Revisão do esqueleto":
        - /url: "#/guiado/revisao"
    - listitem:
      - link "Prévia integrada":
        - /url: "#/guiado/preview"
    - listitem:
      - link "Identidade visual":
        - /url: "#/guiado/identidade"
    - listitem:
      - link "Headers e sidebars":
        - /url: "#/guiado/navegacao"
    - listitem:
      - link "Componentes":
        - /url: "#/guiado/componentes"
    - listitem:
      - link "Master Prompt":
        - /url: "#/guiado/entrega"
  - button "Estrutura" [expanded]
  - list:
    - listitem:
      - link "Objetivo do projeto":
        - /url: "#/modulos/objetivo"
    - listitem:
      - link "Landing pages":
        - /url: "#/modulos/landing"
    - listitem:
      - link "Login":
        - /url: "#/modulos/login"
    - listitem:
      - link "Cadastro":
        - /url: "#/modulos/cadastro"
    - listitem:
      - link "Layout desktop":
        - /url: "#/modulos/desktop"
    - listitem:
      - link "Layout mobile":
        - /url: "#/modulos/mobile"
    - listitem:
      - link "Live Site Preview":
        - /url: "#/modulos/preview"
  - button "Identidade" [expanded]
  - list:
    - listitem:
      - link "Color System":
        - /url: "#/modulos/cores"
    - listitem:
      - link "Navigation Showcase":
        - /url: "#/modulos/navegacao"
    - listitem:
      - link "Componentes":
        - /url: "#/modulos/componentes"
  - button "Inspiração" [expanded]
  - list:
    - listitem:
      - link "Inspiration Gallery":
        - /url: "#/modulos/inspiracao"
    - listitem:
      - link "Template Studio":
        - /url: "#/modulos/templates"
  - button "Entrega" [expanded]
  - list:
    - listitem:
      - link "Central de Prompts":
        - /url: "#/prompt"
    - listitem:
      - link "Exportar e importar":
        - /url: "#/exportar"
  - button "Ferramentas" [expanded]
  - list:
    - listitem:
      - link "Validação responsiva":
        - /url: "#/validacao"
    - listitem:
      - link "Projeto e versões":
        - /url: "#/projeto"
  - text: Projeto Regressão Salvo automaticamente neste navegador
- main:
  - text: Estrutura
  - heading "Live Site Preview" [level=1]
  - paragraph: "Todas as suas escolhas juntas: layout, header, sidebar, paleta, tipografia, landing, login e cadastro. Alterne entre computador, tablet e celular e olhe com calma: é assim que o site deve ficar?"
  - group "Página da prévia":
    - button "Aplicação" [pressed]
  - group "Dispositivo da prévia":
    - button "Computador" [pressed]:
      - img
      - text: Computador
    - button "Tablet":
      - img
      - text: Tablet
    - button "Celular":
      - img
      - text: Celular
  - img "Prévia do computador":
    - text: Projeto Regressão
    - img
    - text: Início
    - img
    - text: Relatórios
    - img
    - text: Clientes
    - img
    - text: Agenda
    - img
    - text: Mensagens
    - img
    - text: Configurações AV Ana Vieira Projeto Regressão
    - navigation: Visão geral Projetos Equipe
    - img
    - text: Buscar…
    - img
    - text: AV Visão geral Atualizado há 5 minutos
    - img
    - text: Filtros
    - img
    - text: Novo Receita R$ 48,2 mil
    - img
    - text: 12,4% Clientes ativos 1.284
    - img
    - text: 3,1% Ticket médio R$ 186
    - img
    - text: 5,8% Satisfação 94%
    - img
    - text: 1,2%
    - strong: Receita mensal
    - text: Últimos 12 meses
    - strong: Clientes recentes
    - text: Ver todos
    - img
    - text: Marina Costa Plano Pro Ativo R$ 249,00 João Pereira Plano Básico Pendente R$ 89,00 Luiza Rocha Plano Pro Ativo R$ 249,00 Pedro Alves Empresa Atrasado R$ 990,00
  - complementary "Escolhas nesta prévia":
    - strong: Escolhas nesta prévia
    - term: Fluxo de entrada
    - definition:
      - text: Não escolhido
      - link "Alterar Fluxo de entrada":
        - /url: "#/guiado/entrada"
    - term: Layout desktop
    - definition:
      - text: Sidebar integral clássica
      - link "Alterar Layout desktop":
        - /url: "#/modulos/desktop"
    - term: Layout mobile
    - definition:
      - text: Bottom Navigation clássica
      - link "Alterar Layout mobile":
        - /url: "#/modulos/mobile"
    - term: Header
    - definition:
      - text: Padrão da identidade
      - link "Alterar Header":
        - /url: "#/modulos/navegacao"
    - term: Sidebar
    - definition:
      - text: Padrão da identidade
      - link "Alterar Sidebar":
        - /url: "#/modulos/navegacao"
    - term: Paleta
    - definition:
      - text: Neutro Essencial
      - link "Alterar Paleta":
        - /url: "#/modulos/cores"
    - term: Tipografia
    - definition:
      - text: Inter + Inter
      - link "Alterar Tipografia":
        - /url: "#/modulos/cores"
    - paragraph: Qualquer alteração em outro módulo aparece aqui imediatamente.
- status
```

# Test source

```ts
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
> 977  |       await expect(page.getByTestId('live-preview').getByTestId('phone-preview').first()).toBeVisible({ timeout: 3000 })
       |                                                                                           ^ Error: expect(locator).toBeVisible() failed
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