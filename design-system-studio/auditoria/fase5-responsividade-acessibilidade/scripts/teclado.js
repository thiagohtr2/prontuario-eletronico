// Testes de teclado: pular para o conteúdo, ordem de Tab, foco visível, foco escondido por barras fixas,
// foco em menu lateral fechado (celular), Enter/Espaço em cartões e chips, abas com setas, busca (listbox),
// foco após troca de rota, título da página.
const L = require('./lib')

async function tabWalk(page, n, opts = {}) {
  const seq = []
  for (let i = 0; i < n; i++) {
    await page.keyboard.press(opts.shift ? 'Shift+Tab' : 'Tab')
    await page.waitForTimeout(30)
    const info = await page.evaluate(() => {
      const a = document.activeElement
      if (!a || a === document.body) return { el: 'body' }
      const r = a.getBoundingClientRect()
      const cs = getComputedStyle(a)
      const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? `${cs.outlineWidth} ${cs.outlineColor}` : null
      const shadow = cs.boxShadow !== 'none' ? cs.boxShadow : null
      const vh = innerHeight, vw = document.documentElement.clientWidth
      // barras fixas/sticky que cobrem o elemento focado
      const bars = Array.from(document.querySelectorAll('.shell-topbar, .gd-footer, .lay-mob-stage, .ui-toasts')).map((b) => b.getBoundingClientRect())
      let coveredPct = 0
      const area = Math.max(1, r.width * r.height)
      for (const b of bars) {
        const ix = Math.max(0, Math.min(r.right, b.right) - Math.max(r.left, b.left))
        const iy = Math.max(0, Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top))
        coveredPct = Math.max(coveredPct, (ix * iy) / area)
      }
      // ponto central: quem está por cima?
      const cx = Math.min(vw - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(vh - 1, Math.max(0, r.top + r.height / 2))
      const top = document.elementFromPoint(cx, cy)
      const hiddenByOther = top && !(top === a || a.contains(top) || top.contains(a))
      const coverer = hiddenByOther && top ? (top.closest('.shell-topbar,.gd-footer,.lay-mob-stage,.ui-toasts,.ui-overlay') || top) : null
      return {
        el: a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(' ')[0] : '') + ' "' + (a.getAttribute('aria-label') || a.innerText || a.value || '').trim().replace(/\s+/g, ' ').slice(0, 40) + '"',
        x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
        offscreen: r.right <= 0 || r.left >= vw || r.bottom <= 0 || r.top >= vh,
        ring: outline || shadow ? (outline ? 'outline ' + outline : 'shadow ' + shadow.slice(0, 60)) : null,
        coveredPct: +coveredPct.toFixed(2),
        coverer: coverer ? (coverer.className || coverer.tagName).toString().split(' ')[0] : null,
        inPreview: !!a.closest('.lay-phone,.nvs-stage,.nvs-h,.nvs-s,.lp-stage,.ent-stage,.ins-browser,.ins-phone,.cmp-pv,.tpl-frame'),
      }
    })
    seq.push(info)
  }
  return seq
}

;(async () => {
  const browser = await L.launch()
  const res = {}

  // 1. Link "pular para o conteúdo" e primeiras paradas de Tab (computador)
  {
    const { ctx, page } = await L.newPage(browser, 1280, 900)
    await L.go(page, '/modulos/cores', 700)
    await page.keyboard.press('Tab')
    const skip = await page.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { el: a.className, text: a.innerText, top: r.top, visible: r.top >= 0 && r.bottom <= innerHeight } })
    await L.shot(page, 'teclado/skip-link-1280')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)
    const after = await page.evaluate(() => ({ active: document.activeElement.id || document.activeElement.tagName, hash: location.hash }))
    // Tab seguinte depois do skip
    await page.keyboard.press('Tab')
    const next = await page.evaluate(() => document.activeElement.tagName + ' ' + (document.activeElement.innerText || document.activeElement.getAttribute('aria-label') || '').slice(0, 40))
    res.skip = { skip, after, next }
    console.log('skip', JSON.stringify(res.skip))
    // ordem de Tab inicial
    await L.go(page, '/modulos/cores', 500)
    res.tab1280cores = await tabWalk(page, 45)
    // foco visível: capturas de alguns tipos de controle
    await L.go(page, '/modulos/cores', 500)
    for (const [sel, name] of [['button.ui-chip >> nth=1', 'chip'], ['.ui-option__hit >> nth=1', 'cartao'], ['button.ui-tab >> nth=1', 'aba'], ['button.ui-btn--primary >> nth=0', 'botao-primario']]) {
      try {
        const loc = page.locator(sel).first()
        await loc.scrollIntoViewIfNeeded()
        await loc.focus()
        await page.evaluate(() => { const a = document.activeElement; a.blur(); })
        // foco por teclado para acionar :focus-visible
        await loc.focus()
        await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab')
        const box = await loc.boundingBox()
        await page.screenshot({ path: `${L.CAP}/teclado/foco-${name}-1280.png`, clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: Math.min(box.width + 32, 600), height: Math.min(box.height + 32, 420) } })
      } catch (e) { console.log('foco shot', name, String(e).slice(0, 100)) }
    }
    await ctx.close()
  }

  // 2. Celular com teclado externo: Tab entra no menu lateral fechado?
  {
    const { ctx, page } = await L.newPage(browser, 375, 800)
    await L.go(page, '/modulos/cores', 700)
    const seq = await tabWalk(page, 45)
    res.tab375cores = seq
    res.tab375offscreen = seq.filter((s) => s.offscreen).length
    const firstVisibleContent = seq.findIndex((s) => !s.offscreen && s.y > 60)
    res.tab375firstContentIndex = firstVisibleContent
    console.log('375 Tabs fora da tela (de 45):', res.tab375offscreen, 'primeiro conteúdo visível no Tab nº', firstVisibleContent + 1)
    // árvore de acessibilidade com menu fechado: o menu aparece?
    const snap = await page.locator('#studio-sidebar').ariaSnapshot().catch(() => '')
    res.sidebarClosedAria = snap.split('\n').slice(0, 12).join('\n')
    await ctx.close()
  }

  // 3. Construtor guiado: foco escondido atrás da barra fixa (computador e celular)
  for (const [w, h] of [[1280, 900], [375, 800], [844, 390]]) {
    const { ctx, page } = await L.newPage(browser, w, h, { mobile: w < 1024 })
    for (const route of ['/guiado/desktop', '/guiado/identidade', '/guiado/componentes']) {
      await L.go(page, route, 700)
      const seq = await tabWalk(page, 80)
      const hidden = seq.filter((s) => s.coveredPct >= 0.5 && !s.offscreen)
      const full = seq.filter((s) => s.coveredPct >= 0.99 && !s.offscreen)
      const key = `guiado-${route.split('/').pop()}-${w}x${h}`
      res[key] = { total: seq.length, coberto50: hidden.length, coberto100: full.length, exemplos: hidden.slice(0, 6), offscreen: seq.filter((s) => s.offscreen).length }
      console.log(key, 'cobertos≥50%:', hidden.length, 'cobertos 100%:', full.length, 'fora da tela:', res[key].offscreen)
      if (hidden.length) {
        // reproduz o primeiro caso para capturar
        await L.go(page, route, 500)
        const idx = seq.indexOf(hidden[0])
        for (let i = 0; i <= idx; i++) await page.keyboard.press('Tab')
        await page.waitForTimeout(150)
        await L.shot(page, `teclado/foco-coberto-${route.split('/').pop()}-${w}x${h}`)
      }
    }
    await ctx.close()
  }

  // 4. Enter/Espaço em cartões e chips; rolagem não muda
  {
    const { ctx, page } = await L.newPage(browser, 1280, 900)
    await L.go(page, '/modulos/cores', 700)
    const chip = page.locator('.ui-chips button.ui-chip').nth(2)
    await chip.scrollIntoViewIfNeeded()
    await chip.focus()
    const y0 = await page.evaluate(() => scrollY)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    const chipEnter = await chip.getAttribute('aria-pressed')
    const y1 = await page.evaluate(() => scrollY)
    await page.locator('.ui-chips button.ui-chip').nth(0).focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)
    const chipSpace = await page.locator('.ui-chips button.ui-chip').nth(0).getAttribute('aria-pressed')
    const card = page.locator('.ui-option__hit[aria-pressed="false"]').nth(3)
    await card.scrollIntoViewIfNeeded()
    const label = await card.evaluate((e) => (e.getAttribute('aria-label') || e.innerText).slice(0, 40))
    await card.focus()
    const y2 = await page.evaluate(() => scrollY)
    await page.keyboard.press('Space')
    await page.waitForTimeout(400)
    const cardSel = await page.locator('.ui-option__hit[aria-pressed="true"]').first().evaluate((e) => (e.getAttribute('aria-label') || e.innerText).slice(0, 40))
    const y3 = await page.evaluate(() => scrollY)
    const focusStill = await page.evaluate(() => document.activeElement.className)
    res.enterSpace = { chipEnter, scrollChip: [y0, y1], chipSpace, card: label, cardSelectedAfterSpace: cardSel, scrollCard: [y2, y3], focusAfter: focusStill }
    console.log('enter/espaço', JSON.stringify(res.enterSpace))
    // 5. Abas: setas funcionam? aria-controls?
    await L.go(page, '/modulos/cores', 500)
    const tabs = await page.evaluate(() => Array.from(document.querySelectorAll('[role=tab]')).slice(0, 6).map((t) => ({ text: t.innerText, sel: t.getAttribute('aria-selected'), controls: t.getAttribute('aria-controls'), tabindex: t.getAttribute('tabindex') })))
    await page.locator('[role=tab]').first().focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
    const afterArrow = await page.evaluate(() => ({ focused: document.activeElement.innerText, selected: Array.from(document.querySelectorAll('[role=tab][aria-selected=true]')).map((t) => t.innerText) }))
    const panels = await page.evaluate(() => document.querySelectorAll('[role=tabpanel]').length)
    res.tabs = { tabs, afterArrow, panels }
    console.log('abas', JSON.stringify(res.tabs))
    // 6. Busca Ctrl+K: listbox / aria-activedescendant
    await page.keyboard.press('Control+k')
    await page.waitForTimeout(400)
    const s0 = await page.evaluate(() => { const i = document.activeElement; return { tag: i.tagName, role: i.getAttribute('role'), ad: i.getAttribute('aria-activedescendant'), controls: i.getAttribute('aria-controls'), expanded: i.getAttribute('aria-expanded') } })
    await page.keyboard.type('paleta')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(150)
    const s1 = await page.evaluate(() => ({ active: document.activeElement.tagName, selected: Array.from(document.querySelectorAll('[role=option][aria-selected=true]')).map((o) => o.innerText.split('\n')[0]), count: document.querySelectorAll('[role=option]').length, live: !!document.querySelector('[role=dialog] [aria-live]') }))
    await page.keyboard.type('zzzz')
    await page.waitForTimeout(150)
    const s2 = await page.evaluate(() => ({ empty: document.querySelector('[role=dialog]').innerText.includes('Nada encontrado'), live: !!document.querySelector('[role=dialog] [aria-live], [role=dialog] [role=status]') }))
    res.search = { s0, s1, s2 }
    console.log('busca', JSON.stringify(res.search))
    await page.keyboard.press('Escape')
    // 7. Troca de rota: foco e título
    await L.go(page, '/livre', 500)
    const t0 = await page.title()
    const link = page.locator('#studio-sidebar a[href="#/modulos/cores"]')
    await link.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(800)
    const r = await page.evaluate(() => ({ title: document.title, active: document.activeElement.tagName + ' ' + (document.activeElement.innerText || '').slice(0, 30), hash: location.hash, liveAnnounce: Array.from(document.querySelectorAll('[aria-live]')).map((x) => x.innerText).join('|') }))
    res.routeChange = { titleBefore: t0, ...r }
    console.log('rota', JSON.stringify(res.routeChange))
    await ctx.close()
  }

  // 8. Celular: abrir menu lateral do Studio – foco vai para dentro? Fecha com Esc? Volta ao botão?
  {
    const { ctx, page } = await L.newPage(browser, 375, 800)
    await L.go(page, '/modulos/cores', 700)
    const btn = page.locator('button[aria-controls="studio-sidebar"]')
    await btn.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(400)
    const opened = await page.evaluate(() => ({ open: document.querySelector('#studio-sidebar').dataset.open, active: document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || document.activeElement.innerText || '').slice(0, 30), expanded: document.querySelector('button[aria-controls="studio-sidebar"]').getAttribute('aria-expanded'), role: document.querySelector('#studio-sidebar').getAttribute('role'), modal: document.querySelector('#studio-sidebar').getAttribute('aria-modal'), mainInert: document.querySelector('main').inert || document.querySelector('main').getAttribute('aria-hidden') }))
    // Tab a partir do botão: entra no menu?
    const seq = await tabWalk(page, 6)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    const closed = await page.evaluate(() => ({ open: document.querySelector('#studio-sidebar').dataset.open, active: document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || '').slice(0, 30) }))
    res.mobileMenuKeyboard = { opened, seqAfterOpen: seq.map((s) => `${s.el} x=${s.x} ${s.offscreen ? 'FORA' : ''}`), closed }
    console.log('menu celular', JSON.stringify(res.mobileMenuKeyboard))
    await ctx.close()
  }

  L.save('teclado.json', res)
  await browser.close()
})()
