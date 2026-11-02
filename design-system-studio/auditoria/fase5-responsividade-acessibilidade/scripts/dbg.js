const L = require('./lib')
;(async () => {
  const b = await L.launch()
  const { ctx, page } = await L.newPage(b, 375, 800)
  await L.go(page, '/modulos/mobile', 800)
  console.log(await page.evaluate(() => { const e=document.querySelector('.lay-detail__tags'); if(!e) return 'none'; const cs=getComputedStyle(e); return {sw:e.scrollWidth,cw:e.clientWidth,sh:e.scrollHeight,ch:e.clientHeight,ox:cs.overflowX,oy:cs.overflowY,to:cs.textOverflow,ws:cs.whiteSpace,lc:cs.webkitLineClamp,disp:cs.display}}))
  await b.close()
})()
