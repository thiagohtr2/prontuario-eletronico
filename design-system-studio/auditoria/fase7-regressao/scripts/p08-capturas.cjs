// Capturas complementares de evidência (REG-03 densidade, REG-14/16, REG-18).
const { open, go, setProject, shot, sleep } = require('./lib.cjs')
;(async () => {
  {
    const { browser, page } = await open('desktop')
    await setProject(page, { guided: { skeletonApproved: true, step: 'identidade' } })
    await page.reload()
    await go(page, '/guiado/identidade')
    await page.evaluate(() => window.scrollTo(0, 1500))
    await sleep(300)
    await shot(page, 'reg14-reg16-css-tokens-sob-rodape-1440-rolado', { clip: { x: 700, y: 560, width: 740, height: 340 } })
    await go(page, '/modulos/componentes')
    await page.getByTestId('component-category-tabelas').click()
    await page.getByTestId('add-component-soft-pill').click()
    await page.getByTestId('component-editor').getByRole('group', { name: 'Densidade' }).scrollIntoViewIfNeeded()
    await sleep(300)
    await shot(page, 'reg03-editor-tabela-densidade-padrao')
    await browser.close()
  }
  {
    const { browser, page } = await open('android')
    await setProject(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await page.reload()
    await go(page, '/modulos/preview')
    await page.getByTestId('live-preview').scrollIntoViewIfNeeded()
    await sleep(400)
    await shot(page, 'reg18-previa-integrada-360-abre-em-computador')
    await browser.close()
  }
})()
