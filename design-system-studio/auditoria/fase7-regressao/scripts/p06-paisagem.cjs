// Paisagem 800×360 e larguras intermediárias: o estágio do celular grande cobre as miniaturas?
const { open, go, shot, sleep } = require('./lib.cjs')
;(async () => {
  for (const vp of [{ width: 800, height: 360, m: true }, { width: 844, height: 390, m: true }, { width: 1024, height: 600 }, { width: 768, height: 1024 }, { width: 1280, height: 720 }]) {
    const { browser, page } = await open(vp.m ? 'android' : 'desktop', { viewport: { width: vp.width, height: vp.height } })
    await go(page, '/modulos/mobile')
    const r = await page.evaluate(() => {
      const root = document.querySelector('.lay-mob')
      const list = document.querySelector('.lay-mob-list').getBoundingClientRect()
      const stage = document.querySelector('.lay-mob-stage').getBoundingClientRect()
      const cards = [...document.querySelectorAll('[data-testid^="mobile-option-"] .ui-option__hit')]
      let covered = 0
      const ids = []
      for (const c of cards) {
        c.scrollIntoView({ block: 'center', inline: 'center' })
        const b = c.getBoundingClientRect()
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
        if (hit && !c.contains(hit)) { covered++; if (ids.length < 3) ids.push(c.closest('[data-testid]').dataset.testid + ' coberto por ' + String(hit.className || hit.tagName).slice(0, 30)) }
      }
      return { mode: root.dataset.mode, list: [Math.round(list.left), Math.round(list.top), Math.round(list.width), Math.round(list.height)], stage: [Math.round(stage.left), Math.round(stage.top), Math.round(stage.width), Math.round(stage.height)], cards: cards.length, covered, ids }
    })
    console.log(`${vp.width}×${vp.height}:`, JSON.stringify(r))
    if (r.covered) await shot(page, `reg04-${vp.width}x${vp.height}-estagio-cobre-miniaturas`)
    await browser.close()
  }
})()
