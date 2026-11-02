const L = require('./lib')
;(async () => {
  const b = await L.launch()
  for (const [route, tag] of [['/modulos/mobile', 'mobile'], ['/guiado/mobile', 'g-mobile']]) for (const w of [640, 700, 900, 1024, 1100, 1280]) {
    const { ctx, page } = await L.newPage(b, w, w < 1024 ? 1024 : 900, { mobile: false })
    await L.go(page, route, 800)
    const info = await page.evaluate(() => {
      const root = document.querySelector('.lay-mob'); const list = document.querySelector('.lay-mob-list'); const st = document.querySelector('.lay-mob-stage')
      const r = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.right), Math.round(x.width)] }
      const card = document.querySelector('.lay-mob-list .ui-option')
      return { mode: root.dataset.mode, root: r(root), list: r(list), stage: r(st), card: card ? r(card) : null, overlap: list.getBoundingClientRect().right > st.getBoundingClientRect().left + 1 || (card && card.getBoundingClientRect().right > st.getBoundingClientRect().left + 1) }
    })
    console.log(tag, w, JSON.stringify(info))
    await page.evaluate(() => { const l = document.querySelector('.lay-mob'); window.scrollTo(0, l.getBoundingClientRect().top + window.scrollY + 300) })
    await page.waitForTimeout(300)
    await L.shot(page, `detalhes/${tag}-${w}-rolada`)
    await ctx.close()
  }
  await b.close()
})()
