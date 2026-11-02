// Testes diversos: perda de seleção ao redimensionar, saltos de rolagem ao filtrar/selecionar,
// teclado virtual (altura reduzida com campo focado), prefers-reduced-motion, estado vazio do guiado.
const L = require('./lib')

;(async () => {
  const b = await L.launch()
  const res = {}

  // 1. Seleções e filtros ao mudar de resolução (mesma aba, redimensionando a janela)
  {
    const { ctx, page } = await L.newPage(b, 1280, 900, { mobile: false })
    await L.go(page, '/modulos/cores', 700)
    await page.locator('.ui-chips button.ui-chip').nth(2).click()
    await page.locator('[role=tab]').nth(2).click()
    await page.waitForTimeout(300)
    const before = await page.evaluate(() => ({ chip: document.querySelector('.ui-chips [aria-pressed=true]')?.innerText, tab: document.querySelector('[role=tab][aria-selected=true]')?.innerText }))
    const out = []
    for (const [w, h] of [[375, 800], [768, 1024], [1280, 900]]) {
      await page.setViewportSize({ width: w, height: h })
      await page.waitForTimeout(500)
      out.push({ w, ...(await page.evaluate(() => ({ chip: document.querySelector('.ui-chips [aria-pressed=true]')?.innerText, tab: document.querySelector('[role=tab][aria-selected=true]')?.innerText }))) })
    }
    // galeria mobile: filtro de grupo e modelo mostrado ao trocar de modo (wide → narrow → wide)
    await L.go(page, '/modulos/mobile', 700)
    await page.locator('.lay-chiprow button.ui-chip').nth(3).click()
    await page.waitForTimeout(300)
    const mb = await page.evaluate(() => ({ chip: document.querySelector('.lay-chiprow [aria-pressed=true]')?.innerText, mode: document.querySelector('.lay-mob').dataset.mode }))
    const mout = []
    for (const [w, h] of [[375, 800], [1024, 900], [1440, 900]]) {
      await page.setViewportSize({ width: w, height: h })
      await page.waitForTimeout(500)
      mout.push({ w, ...(await page.evaluate(() => ({ chip: document.querySelector('.lay-chiprow [aria-pressed=true]')?.innerText, mode: document.querySelector('.lay-mob').dataset.mode, selecionado: document.querySelector('.lay-mob-list .ui-option[data-selected=true] .ui-option__title')?.innerText }))) })
    }
    res.resize = { cores: { before, out }, mobile: { before: mb, out: mout } }
    console.log('resize', JSON.stringify(res.resize))
    await ctx.close()
  }

  // 2. Saltos de rolagem ao filtrar e selecionar (celular)
  {
    const { ctx, page } = await L.newPage(b, 375, 800)
    await L.go(page, '/modulos/cores', 700)
    const rows = []
    // rola até o meio da galeria e seleciona uma paleta
    await page.evaluate(() => window.scrollTo(0, 4000))
    await page.waitForTimeout(300)
    const card = page.locator('.ui-option__hit[aria-pressed="false"]:visible').filter({ has: page.locator('.ui-option__title') })
    const target = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll('.ui-option__hit[aria-pressed="false"]')).filter((c) => { const r = c.getBoundingClientRect(); return r.top > 100 && r.bottom < innerHeight - 50 }); return cs.length })
    const y0 = await page.evaluate(() => scrollY)
    const hit = await page.evaluateHandle(() => Array.from(document.querySelectorAll('.ui-option__hit[aria-pressed="false"]')).find((c) => { const r = c.getBoundingClientRect(); return r.top > 100 && r.bottom < innerHeight - 50 }))
    const box = await hit.asElement().boundingBox()
    await page.touchscreen.tap(box.x + box.width / 2, box.y + 40)
    await page.waitForTimeout(600)
    const y1 = await page.evaluate(() => scrollY)
    rows.push({ acao: 'selecionar paleta no meio da lista', antes: y0, depois: y1, visiveis: target })
    // filtro: rola até os chips e toca em outro grupo
    await L.go(page, '/modulos/cores', 500)
    const chips = page.locator('.ui-chips button.ui-chip')
    await chips.nth(1).scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, -100))
    const y2 = await page.evaluate(() => scrollY)
    await chips.nth(1).tap()
    await page.waitForTimeout(600)
    const y3 = await page.evaluate(() => scrollY)
    rows.push({ acao: 'filtrar paletas por grupo', antes: y2, depois: y3 })
    // galeria de layouts desktop: selecionar um modelo longe do topo
    await L.go(page, '/modulos/desktop', 700)
    await page.evaluate(() => window.scrollTo(0, 6000))
    await page.waitForTimeout(300)
    const h2 = await page.evaluateHandle(() => Array.from(document.querySelectorAll('.ui-option__hit[aria-pressed="false"]')).find((c) => { const r = c.getBoundingClientRect(); return r.top > 100 && r.bottom < innerHeight - 50 }))
    const y4 = await page.evaluate(() => scrollY)
    let y5 = null, moved = null
    if (h2.asElement()) {
      const bx = await h2.asElement().boundingBox()
      await page.touchscreen.tap(bx.x + bx.width / 2, bx.y + 30)
      await page.waitForTimeout(700)
      y5 = await page.evaluate(() => scrollY)
      moved = await page.evaluate(() => { const d = document.querySelector('.lay-desk-detail'); if (!d) return null; const r = d.getBoundingClientRect(); return { detailTop: Math.round(r.top), vh: innerHeight } })
    }
    rows.push({ acao: 'selecionar layout desktop no meio da lista', antes: y4, depois: y5, painelDetalhe: moved })
    await L.shot(page, 'detalhes/desktop-375-apos-selecionar')
    res.scrollJumps = rows
    console.log('rolagem', JSON.stringify(rows))
    await ctx.close()
  }

  // 3. Teclado virtual (aproximação): campo focado e altura da viewport reduzida
  {
    const out = []
    for (const route of ['/guiado/objetivo', '/modulos/objetivo', '/validacao']) {
      const { ctx, page } = await L.newPage(b, 375, 800)
      await L.go(page, route, 700)
      const fields = await page.evaluate(() => Array.from(document.querySelectorAll('main input:not([type=checkbox]):not([type=radio]):not([type=file]):not(.sr-only), main textarea')).filter((f) => f.getBoundingClientRect().width > 0).length)
      for (let i = 0; i < fields; i++) {
        await page.setViewportSize({ width: 375, height: 800 })
        const f = page.locator('main input:not([type=checkbox]):not([type=radio]):not([type=file]):not(.sr-only), main textarea').nth(i)
        await f.scrollIntoViewIfNeeded()
        await f.tap()
        await page.setViewportSize({ width: 375, height: 420 }) // ~ teclado virtual ocupando 380 px
        await page.waitForTimeout(250)
        await f.evaluate((e) => e.scrollIntoView({ block: 'nearest' }))
        await page.waitForTimeout(150)
        const info = await f.evaluate((e) => {
          const r = e.getBoundingClientRect()
          const foot = document.querySelector('.gd-footer')
          const top = document.querySelector('.shell-topbar').getBoundingClientRect()
          const fr = foot ? foot.getBoundingClientRect() : null
          const coveredByFooter = fr ? Math.max(0, Math.min(r.bottom, fr.bottom) - Math.max(r.top, fr.top)) : 0
          const coveredByTop = Math.max(0, Math.min(r.bottom, top.bottom) - Math.max(r.top, top.top))
          const label = e.labels && e.labels[0] ? e.labels[0].innerText : e.getAttribute('aria-label')
          return { label: (label || '').slice(0, 40), top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, footerTop: fr ? Math.round(fr.top) : null, footerH: fr ? Math.round(fr.height) : null, coveredByFooter: Math.round(coveredByFooter), coveredByTop: Math.round(coveredByTop), usable: fr ? Math.round(fr.top - top.bottom) : Math.round(innerHeight - top.bottom), fontSize: getComputedStyle(e).fontSize }
        })
        out.push({ route, ...info })
        if (route === '/guiado/objetivo' && i === fields - 1) await L.shot(page, 'detalhes/teclado-virtual-guiado-objetivo-375x420')
      }
      await ctx.close()
    }
    res.virtualKeyboard = out
    console.log('teclado virtual', JSON.stringify(out.filter((o) => o.coveredByFooter || o.coveredByTop)), 'total campos', out.length, 'área útil (px)', [...new Set(out.map((o) => o.usable))])
  }

  // 4. prefers-reduced-motion: animações/transições respeitadas?
  {
    const { ctx, page } = await L.newPage(b, 375, 800, { reducedMotion: 'reduce' })
    await L.go(page, '/modulos/cores', 500)
    const rm = await page.evaluate(() => {
      const sb = getComputedStyle(document.querySelector('#studio-sidebar'))
      const anims = Array.from(document.querySelectorAll('*')).map((e) => getComputedStyle(e)).filter((c) => c.animationName !== 'none' && parseFloat(c.animationDuration) > 0.05).length
      const smooth = getComputedStyle(document.documentElement).scrollBehavior
      return { sidebarTransition: sb.transitionDuration, animacoesLongas: anims, scrollBehavior: smooth, mq: matchMedia('(prefers-reduced-motion: reduce)').matches }
    })
    // miniaturas de inspiração que se movem (ins-travel)?
    await L.go(page, '/modulos/inspiracao', 1500)
    rm.inspiracao = await page.evaluate(() => {
      const moving = Array.from(document.querySelectorAll('*')).filter((e) => { const c = getComputedStyle(e); return (c.animationName !== 'none' && parseFloat(c.animationDuration) > 0.05) || (parseFloat(c.transitionDuration) > 0.05 && c.transitionProperty.includes('transform')) })
      return moving.length
    })
    res.reducedMotion = rm
    console.log('reduced motion', JSON.stringify(rm))
    await ctx.close()
    const { ctx: c2, page: p2 } = await L.newPage(b, 1280, 900, { reducedMotion: 'no-preference' })
    await L.go(p2, '/modulos/inspiracao', 1500)
    res.reducedMotionOff = await p2.evaluate(() => Array.from(document.querySelectorAll('*')).filter((e) => { const c = getComputedStyle(e); return (c.animationName !== 'none' && parseFloat(c.animationDuration) > 0.05) || (parseFloat(c.transitionDuration) > 0.05 && c.transitionProperty.includes('transform')) }).length)
    await c2.close()
  }

  // 5. Guiado sem seleções (estado vazio): dica + botão desabilitado; acabamento bloqueado
  {
    const out = []
    for (const [w, h] of [[320, 700], [375, 800], [1280, 900]]) {
      const { ctx, page } = await L.newPage(b, w, h, { state: 'vazio' })
      for (const step of ['objetivo', 'entrada', 'desktop', 'mobile', 'revisao', 'preview', 'entrega']) {
        await L.go(page, '/guiado/' + step, 600)
        const info = await page.evaluate(() => {
          const f = document.querySelector('.gd-footer')
          const btn = document.querySelector('[data-testid="guided-next"]')
          const hint = document.querySelector('.gd-footer__hint')
          const fr = f.getBoundingClientRect()
          return { hash: location.hash, footerH: Math.round(fr.height), vh: innerHeight, pct: +(fr.height / innerHeight).toFixed(2), disabled: btn.disabled, describedby: btn.getAttribute('aria-describedby'), hint: hint ? hint.innerText : null, hintLive: hint ? hint.getAttribute('aria-live') || hint.getAttribute('role') : null }
        })
        out.push({ w, step, ...info })
        if (step === 'desktop' && w !== 1280) await L.shot(page, `detalhes/guiado-vazio-desktop-${w}`)
      }
      await ctx.close()
    }
    res.guidedEmpty = out
    console.log('guiado vazio', JSON.stringify(out.map((o) => `${o.w} ${o.step}→${o.hash} footer ${o.footerH}px (${o.pct}) disabled=${o.disabled} hint=${o.hint ? 'sim' : 'não'} live=${o.hintLive} describedby=${o.describedby}`)))
  }

  L.save('diversos.json', res)
  await b.close()
})()
