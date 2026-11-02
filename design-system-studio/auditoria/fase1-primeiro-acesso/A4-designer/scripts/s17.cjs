const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open(1440, 900, { ctx: { deviceScaleFactor: 2 }, nosave: true });
  await page.goto(BASE + '#/guiado/preview', { waitUntil: 'networkidle' }); await page.getByText('Escolhas nesta prévia').first().waitFor(); await page.waitForTimeout(1000);
  await page.screenshot({ path: C + '20-previa-zoom-indicadores.png', clip: { x: 300, y: 395, width: 805, height: 240 } });
  const m = await page.evaluate(() => { const el=[...document.querySelectorAll('main *')].find(e=>e.children.length===0 && e.innerText==='Indicadores'); if(!el) return 'none'; let p=el.parentElement; for(let i=0;i<3;i++){ if(p.getBoundingClientRect().height>40) break; p=p.parentElement;} const s=getComputedStyle(p); return {h:p.getBoundingClientRect().height, overflow:s.overflow, cls:p.className, scrollH:p.scrollHeight}; });
  console.log(JSON.stringify(m));
  for (const d of ['Tablet','Celular']) { await page.locator('main').getByRole('button', { name: d, exact: true }).click(); await page.waitForTimeout(900); await page.screenshot({ path: C + `21-previa-${d.toLowerCase()}.png`, clip: { x: 280, y: 330, width: 840, height: 570 } }); }
  await page.locator('main').getByRole('button', { name: 'Computador', exact: true }).click();
  for (const t of ['Landing','Login','Cadastro']) { await page.locator('main').getByRole('button', { name: t, exact: true }).click(); await page.waitForTimeout(900); await page.screenshot({ path: C + `22-previa-${t.toLowerCase()}.png`, clip: { x: 280, y: 330, width: 840, height: 570 } }); }
  await close();
})();
