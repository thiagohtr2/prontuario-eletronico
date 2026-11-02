// REG-01 (estado selecionado), REG-05 (ações por cartão), REG-06 (sidebar) e REG-07 (fonte dos filtros).
const { open, go, shot, sleep } = require('./lib.cjs')

const GALLERIES = [
  { route: '/modulos/desktop', prefix: 'desktop-option-' },
  { route: '/modulos/mobile', prefix: 'mobile-option-' },
  { route: '/modulos/landing', prefix: 'landing-option-' },
  { route: '/modulos/login', prefix: 'login-option-' },
  { route: '/modulos/cadastro', prefix: 'signup-option-' },
  { route: '/modulos/cores', prefix: 'palette-option-' },
  { route: '/modulos/navegacao', prefix: 'header-option-' },
  { route: '/modulos/navegacao', prefix: 'sidebar-option-' },
]

async function selectedState(page, prefix, idx) {
  const card = page.locator(`[data-testid^="${prefix}"]`).nth(idx)
  await card.scrollIntoViewIfNeeded()
  const hit = card.locator('xpath=self::*[@aria-pressed] | .//*[@aria-pressed]').first()
  const before = await card.evaluate((el) => {
    const cs = getComputedStyle(el)
    return { border: cs.borderColor, shadow: cs.boxShadow, outline: cs.outlineColor }
  })
  await hit.click()
  await sleep(300)
  return card.evaluate((el, before) => {
    const pressed = el.matches('[aria-pressed]') ? el : el.querySelector('[aria-pressed]')
    const cs = getComputedStyle(el)
    const badge = [...el.querySelectorAll('span')].find((s) => /^(Escolhido|Selecionado|No projeto|Aprovado)$/.test(s.textContent.trim()) && getComputedStyle(s).position === 'absolute')
    let badgeVisible = false
    let badgeBox = null
    if (badge) {
      const r = badge.getBoundingClientRect()
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      badgeVisible = r.width > 20 && r.height > 12 && (badge === hit || badge.contains(hit))
      badgeBox = { w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(badge).fontSize }
    }
    return {
      testId: el.dataset.testid,
      ariaPressed: pressed?.getAttribute('aria-pressed'),
      dataSelected: el.dataset.selected,
      borderChanged: cs.borderColor !== before.border || cs.boxShadow !== before.shadow,
      badgeVisible,
      badgeBox,
    }
  }, before)
}

async function cardActions(page, prefix) {
  return page.evaluate((prefix) => {
    const cards = [...document.querySelectorAll(`[data-testid^="${prefix}"]`)].slice(0, 6)
    return cards.map((c) => {
      const btns = [...c.querySelectorAll('button, a[href], [role=button]')].filter((b) => !b.closest('.nvs-card__preview, .ui-option__media, [class*="thumb"], [class*="preview"]'))
      const names = btns.map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50))
      const dup = names.filter((n, i) => n && names.indexOf(n) !== i)
      const selectLike = names.filter((n) => /^(Selecionar|Selecionado|Escolher|Usar|Aplicar)/i.test(n))
      return { id: c.dataset.testid, names, dup, selectLike: selectLike.length }
    })
  }, prefix)
}

async function filterFonts(page) {
  return page.evaluate(() => {
    const out = []
    const sel = '[role=group] .ui-chip, .ui-chips .ui-chip, .ui-chip, [role=tablist] [role=tab], select, .ui-segmented button'
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) continue
      if (el.closest('[data-testid="identity-preview"], .nvs-card__preview, .ui-option__media, [data-testid="phone-preview"], [data-testid="live-preview"], .ent-thumb, [class*="ScaledThumb"]')) continue
      const fs = parseFloat(getComputedStyle(el).fontSize)
      const kids = [...el.querySelectorAll('*')].map((k) => parseFloat(getComputedStyle(k).fontSize)).filter((x) => x)
      const min = Math.min(fs, ...kids)
      out.push({ text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), fs, min, h: Math.round(r.height) })
    }
    return out
  })
}

;(async () => {
  for (const dev of ['desktop', 'android']) {
    const { browser, page, errors } = await open(dev)
    console.log(`\n===== ${dev} =====`)
    // REG-06 sidebar
    await go(page, '/modulos/desktop')
    if (dev === 'desktop') {
      const sb = await page.evaluate(() => {
        const s = document.querySelector('#studio-sidebar')
        const r = s.getBoundingClientRect()
        const links = [...s.querySelectorAll('a')]
        const truncated = links.filter((a) => a.scrollWidth > a.clientWidth + 1 || [...a.querySelectorAll('span')].some((x) => x.scrollWidth > x.clientWidth + 1)).map((a) => a.textContent.trim())
        const fs = links.map((a) => parseFloat(getComputedStyle(a).fontSize))
        return { w: Math.round(r.width), links: links.length, truncated, minFs: Math.min(...fs), mainW: Math.round(document.querySelector('main#conteudo').getBoundingClientRect().width) }
      })
      console.log('REG-06 sidebar desktop:', JSON.stringify(sb))
      await shot(page, `reg06-${dev}-sidebar`, { clip: { x: 0, y: 0, width: 400, height: 900 } })
    } else {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await sleep(400)
      const sb = await page.evaluate(() => {
        const s = document.querySelector('#studio-sidebar')
        const r = s.getBoundingClientRect()
        const links = [...s.querySelectorAll('a')]
        const truncated = links.filter((a) => a.scrollWidth > a.clientWidth + 1).map((a) => a.textContent.trim())
        const fs = links.map((a) => parseFloat(getComputedStyle(a).fontSize))
        const h = links.map((a) => Math.round(a.getBoundingClientRect().height))
        return { w: Math.round(r.width), vw: innerWidth, links: links.length, truncated, minFs: Math.min(...fs), minH: Math.min(...h) }
      })
      console.log('REG-06 sidebar mobile (drawer):', JSON.stringify(sb))
      await shot(page, `reg06-${dev}-drawer`)
      await page.keyboard.press('Escape')
    }

    for (const g of GALLERIES) {
      await go(page, g.route)
      const st = await selectedState(page, g.prefix, 2)
      console.log('REG-01', g.prefix, JSON.stringify(st))
      const acts = await cardActions(page, g.prefix)
      const summary = acts.map((a) => `${a.names.join(' | ')}${a.dup.length ? ' DUP=' + a.dup : ''}`).slice(0, 2)
      console.log('REG-05', g.prefix, 'selectLike max', Math.max(...acts.map((a) => a.selectLike)), JSON.stringify(summary))
    }
    // REG-07 filtros
    for (const r of ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/inspiracao', '/modulos/templates', '/prompt']) {
      await go(page, r)
      const f = await filterFonts(page)
      const min = f.length ? Math.min(...f.map((x) => x.min)) : null
      const small = f.filter((x) => x.min < 12)
      console.log('REG-07', r, 'controles', f.length, 'menor fonte', min, small.length ? 'abaixo de 12: ' + JSON.stringify(small.slice(0, 4)) : '')
    }
    console.log('erros JS:', errors.length, errors.slice(0, 3))
    await browser.close()
  }
})()
