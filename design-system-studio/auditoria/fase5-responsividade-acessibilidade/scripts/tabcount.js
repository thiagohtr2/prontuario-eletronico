// Quantas paradas de Tab cada tela tem, e quantas estão dentro de prévias interativas.
const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const { ctx, page } = await L.newPage(b, 1280, 900)
  const out = []
  for (const [id, route] of L.ROUTES) {
    await L.go(page, route, 700)
    const r = await page.evaluate(() => {
      const sel = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'
      const els = Array.from(document.querySelectorAll(sel)).filter((e) => {
        if (e.tabIndex < 0) return false
        if (e.closest('[inert]')) return false
        const cs = getComputedStyle(e)
        if (cs.visibility === 'hidden' || cs.display === 'none') return false
        const r = e.getBoundingClientRect()
        if (r.width === 0 && r.height === 0 && !e.classList.contains('sr-only')) return false
        // dentro de <details> fechado
        const d = e.closest('details:not([open])'); if (d && !e.matches('summary')) return false
        return true
      })
      const PREV = '.lay-phone,.nvs-stage,.nvs-h,.nvs-s,.nvs-hbar,.nvs-sbar,.lp-stage,.lp-frame,.ent-stage,.ent-fit,.ins-browser,.ins-phone,.cmp-pv,.tpl-frame,[role=img]'
      const prev = els.filter((e) => e.closest(PREV))
      const ariaHiddenFocusable = els.filter((e) => e.closest('[aria-hidden="true"]')).length
      const roleImgFocusable = els.filter((e) => e.closest('[role=img]')).length
      return { total: els.length, emPrevias: prev.length, ariaHiddenFocusable, roleImgFocusable }
    })
    out.push({ id, ...r })
    console.log(id, JSON.stringify(r))
  }
  L.save('paradas-tab.json', out)
  await ctx.close(); await b.close()
})()
