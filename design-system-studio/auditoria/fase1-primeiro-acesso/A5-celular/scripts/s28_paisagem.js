const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
async function info(page, label) {
  const fx = (await L.fixedBars(page)).filter(f => f.x > -50 && f.w > 0 && f.x < 800);
  const ov = await L.overflow(page);
  const usable = await page.evaluate(() => { const hdr = document.querySelector('.shell-topbar')?.getBoundingClientRect(); const ft = document.querySelector('.gd-footer')?.getBoundingClientRect(); const top = hdr ? hdr.bottom : 0; const bottom = ft && ft.top < innerHeight ? ft.top : innerHeight; return { header: hdr ? Math.round(hdr.height) : 0, footer: ft ? Math.round(ft.height) : 0, footerTop: ft ? Math.round(ft.top) : null, livre: Math.round(bottom - top), vh: innerHeight }; });
  const sb = await page.evaluate(() => { const a = document.querySelector('.shell-sidebar'); const r = a.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), pos: getComputedStyle(a).position }; });
  console.log(label, 'USAVEL', JSON.stringify(usable), 'SIDEBAR', JSON.stringify(sb), 'OVERFLOW', JSON.stringify(ov));
  console.log(label, 'FIXED', JSON.stringify(fx.map(f => f.cls + ' ' + f.pos + ' y' + f.y + ' h' + f.h + ' w' + f.w)));
}
(async () => {
  { const { ctx, page } = await L.open('perfil-iphone-limpo', 'iphone');
    await page.goto('http://127.0.0.1:4300/#/guiado/revisao', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
    console.log('iPhone limpo: Aprovar desabilitado?', await page.locator('.gd-footer').getByRole('button', { name: /Aprovar/ }).isDisabled());
    await ctx.close(); }
  const { ctx, page } = await L.open('perfil', 'landscape');
  L.log('A61 (paisagem 800x360) abrir etapa 2 Entrada');
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  await L.shot(page, '58-paisagem-passo2');
  await info(page, 'P2');
  L.log('A62 (paisagem) abrir etapa 4 Arquitetura do celular e rolar até o celular grande');
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  await L.shot(page, '59-paisagem-passo4-topo');
  await info(page, 'P4');
  await L.swipe(page, 400, 300, 60); await L.swipe(page, 400, 300, 60);
  await L.shot(page, '60-paisagem-passo4-rolado');
  const phone = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => (x.getAttribute('aria-label') || x.innerText).trim() === 'Criar novo'); if (!b) return null; let p = b; for (let i = 0; i < 12 && p; i++) { p = p.parentElement; if (p && p.getBoundingClientRect().height > 400) break; } const r = p.getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width) }; });
  console.log('P4 celular grande', JSON.stringify(phone), 'vh 360');
  L.log('A63 (paisagem) etapa 2 aba Landing -> tocar "Ver prévia"');
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  await page.getByRole('tab', { name: /Landing page/ }).tap(); await page.waitForTimeout(400);
  const vp = page.getByRole('button', { name: /Ver prévia/ }).nth(1); await vp.scrollIntoViewIfNeeded(); await vp.tap(); await page.waitForTimeout(1200);
  await L.shot(page, '61-paisagem-previa-modal');
  const dm = await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); const r = e => { if (!e) return null; const b = e.getBoundingClientRect(); return { y: Math.round(b.y), h: Math.round(b.height), w: Math.round(b.width) }; }; return { dialog: r(d), body: r(d.querySelector('.ui-modal__body')), phoneArea: r(d.querySelector('.ent-fit')), footerBtns: r(d.querySelector('button:last-of-type')) }; });
  console.log('P-MODAL', JSON.stringify(dm));
  const sel = await page.getByRole('dialog').getByRole('button', { name: /Selecionar este modelo/ }).boundingBox();
  console.log('P-MODAL botao selecionar', JSON.stringify(sel));
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).tap(); await page.waitForTimeout(400);
  L.log('A64 (paisagem) abrir etapa 10 Master Prompt');
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' }); await page.waitForTimeout(900);
  await L.shot(page, '62-paisagem-master');
  await info(page, 'P10');
  const cp = await page.getByRole('button', { name: /Copiar Master Prompt/ }).boundingBox(); console.log('P10 copiar', JSON.stringify(cp));
  await ctx.close();
})();
