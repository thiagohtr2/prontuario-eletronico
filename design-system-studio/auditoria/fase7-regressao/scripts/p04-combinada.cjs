// REG-03b (densidade da tabela), REG-12 (primária manual), REG-14/16 (CSS dos tokens sob o rodapé),
// REG-19 (aba Cadastro sem cadastro), REG-20 (fluxo trocado mantém login no prompt), REG-18 (breakpoints).
const { open, go, saved, setProject, shot, sleep } = require('./lib.cjs')

;(async () => {
  const { browser, page } = await open('desktop')

  if (!process.env.SKIP03) { // REG-03b densidade da tabela
  await go(page, '/modulos/componentes')
  await page.getByTestId('component-category-tabelas').click()
  const fam = await page.locator('[data-testid^="add-component-"]').first().getAttribute('data-testid')
  await page.locator('[data-testid^="add-component-"]').first().click()
  const ed = page.getByTestId('component-editor')
  await ed.waitFor()
  const dens = ed.getByRole('group', { name: 'Densidade' })
  const pressed = await dens.locator('[aria-pressed="true"]').textContent()
  await go(page, '/prompt')
  const txt = await page.getByTestId('master-prompt-text').textContent()
  const m = txt.match(/Densidade[^\n]{0,40}/g)
  console.log('REG-03b família', fam, '| editor mostra:', pressed, '| prompt:', JSON.stringify(m))
  for (const famId of ['compact-pro']) {
    // muda a família da instância para Compact Pro e lê de novo
  }
  const p = await saved(page)
  const inst = p.components[0]
  await setProject(page, { components: [{ ...inst, familyId: 'compact-pro' }] })
  await page.reload()
  await go(page, '/prompt')
  const txt2 = await page.getByTestId('master-prompt-text').textContent()
  console.log('REG-03b com Compact Pro, props', JSON.stringify(inst.props), 'prompt:', JSON.stringify(txt2.match(/Densidade[^\n]{0,40}/g)))
  await setProject(page, { components: [{ ...inst, familyId: inst.familyId, props: { densidade: 'compacta' } }] })
  await page.reload()
  await go(page, '/prompt')
  const txt3 = await page.getByTestId('master-prompt-text').textContent()
  console.log('REG-03b usuário escolheu compacta (família padrão):', JSON.stringify(txt3.match(/Densidade[^\n]{0,40}/g)))

  }
  // ---------- REG-12 primária manual
  await page.evaluate(() => localStorage.clear())
  await go(page, '/modulos/cores')
  await page.getByRole('tab', { name: 'Tokens e cores' }).click()
  const read = (k) => page.getByLabel(`Hexadecimal de ${k}`, { exact: true }).inputValue()
  const before = { hover: await read('Primária — hover'), focus: await read('Borda de foco (focus-visible)'), link: await read('Link'), active: await read('Primária — active') }
  const input = page.getByLabel('Hexadecimal de Cor primária')
  await input.fill('#0b6e4f')
  await input.press('Enter')
  await sleep(300)
  const after = { hover: await read('Primária — hover'), focus: await read('Borda de foco (focus-visible)'), link: await read('Link'), active: await read('Primária — active') }
  console.log('REG-12 primária #0b6e4f: antes', JSON.stringify(before), 'depois', JSON.stringify(after))
  const hoverBtn = await page.getByTestId('identity-preview').getByText('Hover', { exact: true }).evaluate((e) => getComputedStyle(e).backgroundColor)
  const primBtn = await page.getByTestId('identity-preview').getByText('Primário', { exact: true }).evaluate((e) => getComputedStyle(e).backgroundColor)
  console.log('REG-12 prévia: Primário', primBtn, 'Hover', hoverBtn)
  await shot(page, 'reg12-primaria-manual-hover-antigo', { clip: { x: 800, y: 60, width: 640, height: 700 } })

  // ---------- REG-14/16 CSS dos tokens no guiado (1440×900)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await setProject(page, { guided: { skeletonApproved: true, step: 'identidade' } })
  await page.reload()
  await go(page, '/guiado/identidade')
  for (const y of [0, 1500, 4000]) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await sleep(300)
    const r = await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'CSS dos tokens')
      const rc = b.getBoundingClientRect()
      const hit = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2)
      const f = document.querySelector('.gd-footer').getBoundingClientRect()
      return { sy: scrollY, btnY: Math.round(rc.top), btnBottom: Math.round(rc.bottom), inViewport: rc.top >= 0 && rc.bottom <= innerHeight, footerTop: Math.round(f.top), hitIsBtn: b.contains(hit), hit: hit?.closest('.gd-footer') ? 'gd-footer' : hit?.tagName }
    })
    let dl = 'n/a'
    if (r.inViewport) {
      const box = await page.getByRole('button', { name: 'CSS dos tokens' }).boundingBox()
      const ev = page.waitForEvent('download', { timeout: 2500 }).then((d) => d.suggestedFilename()).catch(() => 'SEM DOWNLOAD')
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      dl = await ev
    }
    console.log('REG-14/16 scroll', y, JSON.stringify(r), 'clique real →', dl, 'url', page.url().split('#')[1])
    if (y === 0) await shot(page, 'reg14-css-tokens-sob-rodape-1440')
    if (!page.url().includes('identidade')) await go(page, '/guiado/identidade')
  }

  // ---------- REG-19 prévia integrada: Cadastro sem cadastro
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await setProject(page, { entry: { flow: 'login-only', loginId: 'classico-central', signupId: null }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  await page.reload()
  await go(page, '/modulos/preview')
  const tabs = await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button').allTextContents()
  console.log('REG-19 login-only sem cadastro → abas:', tabs, 'signupId', (await saved(page)).entry.signupId)
  if (tabs.includes('Cadastro')) {
    await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' }).click()
    await sleep(500)
    const t = await page.getByTestId('live-preview').innerText()
    console.log('REG-19 conteúdo da aba Cadastro:', t.slice(0, 120).replace(/\n/g, ' / '))
    await shot(page, 'reg19-cadastro-sem-cadastro')
  }
  // fluxo app-direct com login antigo
  await setProject(page, { entry: { flow: 'app-direct', loginId: 'classico-central', landingId: null, signupId: null } })
  await page.reload()
  await go(page, '/modulos/preview')
  const tabs2 = await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button').allTextContents()
  console.log('REG-19/20 app-direct com loginId antigo → abas:', tabs2)

  // ---------- REG-20 troca de fluxo: login segue no prompt
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await go(page, '/modulos/login')
  await page.locator('[data-testid^="login-option-"]').first().locator('[aria-pressed]').first().click()
  await go(page, '/guiado/entrada')
  await page.getByTestId('entry-flow-app-direct').locator('[aria-pressed]').first().click()
  await sleep(300)
  await go(page, '/prompt')
  const t20 = await page.getByTestId('master-prompt-text').textContent()
  console.log('REG-20 flow', (await saved(page)).entry.flow, 'loginId', (await saved(page)).entry.loginId, '| prompt contém "Não existe login":', t20.includes('Não existe login'), '| contém seção Login:', /### Login/.test(t20), t20.match(/Landing: [^\n]*/)?.[0])

  // ---------- REG-18 breakpoints
  await setProject(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
  await page.reload()
  await go(page, '/prompt')
  const t18 = await page.getByTestId('master-prompt-text').textContent()
  console.log('REG-18 trechos:', JSON.stringify([...t18.matchAll(/[^\n]*(600 e 1023|768 px)[^\n]*/g)].map((x) => x[0].slice(0, 160)).slice(0, 6)))
  await browser.close()
})()
