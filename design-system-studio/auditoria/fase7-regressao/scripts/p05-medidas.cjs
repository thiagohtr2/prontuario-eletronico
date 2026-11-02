// Medidas para REG-04 (botões grudados/sobrepostos), REG-08 (tamanho das prévias de celular),
// REG-09 (proporção texto × ícone nos menus móveis), REG-10 (diagramas) e REG-17 (overflow em galerias).
const { open, go, setProject, shot, sleep } = require('./lib.cjs')

const EXCLUDE = '.ui-option__media, .nvs-card__preview, [data-testid="phone-preview"], [data-testid="phone-thumb"], [data-testid="identity-preview"], [data-testid="live-preview"], .ui-segmented, [role=tablist], .lay-ds, .cmp-grid .ui-option__media, [data-testid="auth-preview"], [data-testid="landing-preview"]'

async function buttonCollisions(page) {
  return page.evaluate((EXCLUDE) => {
    const els = [...document.querySelectorAll('button, a.ui-btn, [role=button]')].filter((e) => {
      const r = e.getBoundingClientRect()
      const cs = getComputedStyle(e)
      return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && !e.closest(EXCLUDE) && !e.closest('[aria-hidden="true"]')
    })
    const boxes = els.map((e) => ({ e, r: e.getBoundingClientRect(), n: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28) }))
    const issues = []
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j]
        if (a.e.contains(b.e) || b.e.contains(a.e)) continue
        const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
        const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
        if (ix > 1 && iy > 1) { issues.push(`SOBREPOSTOS ${a.n} × ${b.n} (${Math.round(ix)}×${Math.round(iy)})`); continue }
        // adjacentes na mesma linha
        if (iy > Math.min(a.r.height, b.r.height) * 0.5) {
          const gap = Math.max(b.r.left - a.r.right, a.r.left - b.r.right)
          if (gap >= 0 && gap < 4) issues.push(`GRUDADOS-H ${a.n} | ${b.n} gap=${gap.toFixed(1)}`)
        } else if (ix > Math.min(a.r.width, b.r.width) * 0.5) {
          const gap = Math.max(b.r.top - a.r.bottom, a.r.top - b.r.bottom)
          if (gap >= 0 && gap < 4) issues.push(`GRUDADOS-V ${a.n} / ${b.n} gap=${gap.toFixed(1)}`)
        }
      }
    return { n: boxes.length, issues }
  }, EXCLUDE)
}

async function cardOverflow(page) {
  return page.evaluate(() => {
    const out = []
    for (const card of document.querySelectorAll('.ui-option, .nvs-card')) {
      const cr = card.getBoundingClientRect()
      if (!cr.width) continue
      for (const el of card.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) continue
        let p = el.parentElement, clipped = false
        while (p && p !== card) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) { clipped = true; break } p = p.parentElement }
        if (clipped) continue
        if (r.right > cr.right + 1 || r.left < cr.left - 1) { out.push(`${card.dataset.testid}: ${el.tagName}.${String(el.className).slice(0, 20)} excede ${Math.round(Math.max(r.right - cr.right, cr.left - r.left))}px`); break }
      }
      const t = card.querySelector('.ui-option__title, .nvs-card__title')
      if (t && t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).textOverflow !== 'ellipsis') out.push(`${card.dataset.testid}: título cortado`)
    }
    return { overflowX: document.documentElement.scrollWidth - innerWidth, out: out.slice(0, 8), total: out.length }
  })
}

;(async () => {
  // REG-04 / REG-17
  if (!process.env.ONLY_PREVIEWS) for (const vp of [{ width: 360, height: 800 }, { width: 1440, height: 900 }]) {
    const { browser, page } = await open(vp.width < 500 ? 'android' : 'desktop')
    for (const r of ['/', '/guiado/objetivo', '/guiado/entrada', '/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/templates', '/modulos/inspiracao', '/prompt', '/exportar']) {
      await go(page, r)
      const c = await buttonCollisions(page)
      const o = await cardOverflow(page)
      console.log(`REG-04 ${vp.width} ${r}: ${c.n} botões, ${c.issues.length} problemas ${JSON.stringify(c.issues.slice(0, 5))} | REG-17 overflowX=${o.overflowX} cartões com overflow=${o.total} ${JSON.stringify(o.out.slice(0, 3))}`)
    }
    await browser.close()
  }
  if (!process.env.ONLY_PREVIEWS) for (const w of [320, 768, 1024]) {
    const { browser, page } = await open('desktop', { viewport: { width: w, height: 900 } })
    for (const r of ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/navegacao', '/modulos/cores']) {
      await go(page, r)
      const o = await cardOverflow(page)
      if (o.total || o.overflowX > 0) console.log(`REG-17 ${w} ${r}: overflowX=${o.overflowX} ${o.total} ${JSON.stringify(o.out.slice(0, 3))}`)
    }
    console.log('REG-17', w, 'ok/medido')
    await browser.close()
  }
  // landscape 800x360: ver p06-paisagem.cjs
  if (false) {
    const { browser, page } = await open('android', { viewport: { width: 800, height: 360 } })
    await go(page, '/modulos/mobile')
    await page.locator('[data-testid^="mobile-option-"]').first().locator('.ui-option__hit').click()
    await sleep(300)
    const ov = await page.evaluate(() => {
      const st = document.querySelector('.lay-detail__status')
      const els = [...document.querySelectorAll('.lay-mob-stage *, .lay-section__title, .lay-section__head *')].filter((e) => e !== st && !st.contains(e) && !e.contains(st) && e.children.length === 0 && e.textContent.trim())
      const r = st.getBoundingClientRect()
      return els.filter((e) => { const q = e.getBoundingClientRect(); return q.width && Math.min(q.right, r.right) - Math.max(q.left, r.left) > 2 && Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top) > 2 }).map((e) => e.textContent.trim().slice(0, 40))
    })
    console.log('REG-04/17 paisagem 800×360: textos sobrepostos ao selo "Escolhido":', JSON.stringify(ov))
    await shot(page, 'reg17-paisagem-800x360-mobile')
    await browser.close()
  }

  // REG-08 tamanhos das prévias de celular
  {
    const { browser, page } = await open('desktop')
    await go(page, '/modulos/mobile')
    const big = await page.getByTestId('phone-preview').first().boundingBox()
    console.log('REG-08 1440 celular grande:', JSON.stringify(big))
    await setProject(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await page.reload()
    await go(page, '/modulos/preview')
    await page.getByRole('button', { name: /Celular/ }).first().click()
    await sleep(400)
    const lp = await page.getByTestId('live-preview').locator('[data-testid="phone-preview"]').first().boundingBox()
    console.log('REG-08 1440 prévia integrada celular:', JSON.stringify(lp))
    await browser.close()
  }
  for (const dev of ['android', 'iphone']) {
    const { browser, page } = await open(dev)
    await go(page, '/modulos/mobile')
    const big = await page.getByTestId('phone-preview').first().boundingBox()
    console.log(`REG-08 ${dev} celular grande:`, JSON.stringify(big))
    await go(page, '/modulos/landing')
    await page.locator('[data-testid^="landing-option-"]').first().getByRole('button', { name: 'Ver prévia' }).click()
    await sleep(800)
    const modal = page.getByTestId('landing-preview-modal')
    const info = await page.evaluate(() => {
      const m = document.querySelector('[data-testid="landing-preview-modal"]')
      const cands = [...m.querySelectorAll('*')].filter((e) => /phone|device|frame|screen/i.test(String(e.className))).map((e) => ({ c: String(e.className).slice(0, 40), r: e.getBoundingClientRect() })).filter((x) => x.r.width > 100)
      return { vh: innerHeight, cands: cands.slice(0, 6).map((x) => ({ c: x.c, top: Math.round(x.r.top), h: Math.round(x.r.height), w: Math.round(x.r.width), visibleH: Math.round(Math.min(x.r.bottom, innerHeight) - Math.max(x.r.top, 0)) })) }
    })
    console.log(`REG-08 ${dev} modal da landing:`, JSON.stringify(info))
    await shot(page, `reg08-${dev}-modal-landing`)
    await browser.close()
  }

  // REG-09 menus no celular grande
  {
    const { browser, page } = await open('desktop')
    await go(page, '/modulos/mobile')
    const ids = await page.locator('[data-testid^="mobile-option-"]').evaluateAll((els) => els.map((e) => e.dataset.testid))
    const rows = []
    for (const id of ids) {
      await page.getByTestId(id).locator('.ui-option__hit').click()
      await sleep(120)
      const phone = page.getByTestId('phone-preview').first()
      const trig = phone.getByTestId('phone-menu-trigger').first()
      if (await trig.count()) { await trig.click().catch(() => {}); await sleep(250) }
      const m = await phone.evaluate((root) => {
        const res = []
        for (const el of root.querySelectorAll('a, button, [role=menuitem], li')) {
          const svg = el.querySelector(':scope > svg, :scope > span > svg')
          const text = [...el.childNodes].map((n) => n.textContent).join('').trim()
          if (!svg || !text) continue
          const sr = svg.getBoundingClientRect()
          const r = el.getBoundingClientRect()
          if (!sr.width || !r.width) continue
          const fs = parseFloat(getComputedStyle(el).fontSize)
          const tEl = [...el.querySelectorAll('span')].find((s) => s.textContent.trim() === text) || el
          const tfs = parseFloat(getComputedStyle(tEl).fontSize)
          res.push({ t: text.slice(0, 14), icon: Math.round(sr.height * 10) / 10, fs: tfs })
        }
        return res
      })
      const ratios = m.map((x) => x.icon / x.fs)
      rows.push({ id: id.replace('mobile-option-', ''), n: m.length, minFs: m.length ? Math.min(...m.map((x) => x.fs)) : null, maxRatio: ratios.length ? Math.max(...ratios).toFixed(2) : null, minRatio: ratios.length ? Math.min(...ratios).toFixed(2) : null })
    }
    const bad = rows.filter((r) => r.n && (r.maxRatio > 2.2 || r.minRatio < 0.75 || r.minFs < 9))
    console.log('REG-09 layouts medidos', rows.length, 'com itens', rows.filter((r) => r.n).length, 'fora da faixa:', JSON.stringify(bad))
    console.log('REG-09 amostra', JSON.stringify(rows.slice(0, 6)))
    await browser.close()
  }

  // REG-10 diagramas
  {
    const { browser, page } = await open('desktop')
    await go(page, '/modulos/desktop')
    const r = await page.evaluate(() => {
      const out = []
      for (const card of document.querySelectorAll('[data-testid^="desktop-option-"]')) {
        const regs = [...card.querySelectorAll('.lay-ds-region')]
        const style = (e) => { const cs = getComputedStyle(e); return { shadow: cs.boxShadow, radius: cs.borderRadius, bg: cs.backgroundColor, border: cs.borderTopWidth } }
        const nav = regs.filter((e) => ['sidebar', 'rail', 'submenu', 'header', 'toolbar'].includes(e.dataset.kind)).map(style)
        for (const c of regs.filter((e) => e.dataset.kind === 'content')) {
          const s = style(c)
          const elevated = s.shadow !== 'none' && !/inset/.test(s.shadow)
          const sameAsNav = nav.some((n) => n.shadow === s.shadow && n.radius === s.radius && n.bg === s.bg && elevated)
          const chip = [...c.querySelectorAll('.lay-chip')].some((x) => /CONTE/.test(x.textContent))
          out.push({ id: card.dataset.testid.replace('desktop-option-', ''), elevated, sameAsNav, chip })
        }
      }
      return out
    })
    console.log('REG-10 regiões de conteúdo', r.length, 'elevadas', r.filter((x) => x.elevated).map((x) => x.id), 'iguais a navegação flutuante', r.filter((x) => x.sameAsNav).map((x) => x.id), 'sem etiqueta CONTEÚDO', r.filter((x) => !x.chip).map((x) => x.id))
    await browser.close()
  }
})()
