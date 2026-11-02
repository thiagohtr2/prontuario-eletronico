const L = require('./lib')
;(async () => {
  const b = await L.launch()
  for (const [w,h] of [[375,812],[1280,800]]) {
    const { ctx, page } = await L.newPage(b, w, h)
    await L.go(page, '/')
    const t0 = Date.now()
    const m = await L.measure(page)
    console.log(w, 'measure ms', Date.now()-t0)
    console.log(JSON.stringify({ov:m.docOverflowX, overflow:m.overflow, trunc:m.truncated.slice(0,5), small:m.smallText.slice(0,5), smallN:m.smallTextCount, lt44:m.targetsLt44, lt44g:m.targetsLt44Groups, close:m.closeTargets.slice(0,5), fields:m.fieldsSmallFont, fixed:m.fixed, h1:m.h1, main:m.main}, null, 1))
    await L.shot(page, `smoke-home-${w}`, {fullPage:true})
    await ctx.close()
  }
  await b.close()
})()
