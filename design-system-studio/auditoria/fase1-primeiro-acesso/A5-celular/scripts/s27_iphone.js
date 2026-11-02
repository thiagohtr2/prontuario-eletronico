const L = require('./lib');
const path = require('path'); const fs = require('fs');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  // 1) iPhone do marido: navegador limpo
  { const { ctx, page } = await L.open('perfil-iphone-limpo', 'iphone');
    L.log('A58 (iPhone 390x844, navegador limpo) abrir o site');
    await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
    const h1 = await page.evaluate(() => [...document.querySelectorAll('h1')].map(e => e.innerText).join(' | '));
    const proj = await page.evaluate(() => (document.querySelector('.shell-sidebar')?.innerText.match(/(Projeto sem nome|Barbearia da Joana)/) || ['?'])[0]);
    console.log('IPHONE LIMPO URL', page.url(), 'H1', h1, 'projeto:', proj);
    await L.shot(page, '53-iphone-limpo-sem-projeto');
    await ctx.close(); }
  // 2) mesmo navegador em 390x844
  const { ctx, page } = await L.open('perfil', 'iphone');
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4300' });
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await L.shot(page, '54-iphone-passo2-topo');
  await page.getByRole('tab', { name: /Landing page/ }).tap(); await page.waitForTimeout(500);
  const vp = page.getByRole('button', { name: /Ver prévia/ }).nth(1);
  await vp.scrollIntoViewIfNeeded();
  L.log('A59 (iPhone) tocar "Ver prévia" de um modelo de landing');
  await vp.tap(); await page.waitForTimeout(1200);
  await L.shot(page, '55-iphone-previa-modal');
  const dm = await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); const body = d.querySelector('.ui-modal__body'); const fit = d.querySelector('.ent-fit'); const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { y: Math.round(b.y), h: Math.round(b.height) }; }; return { dialog: r(d), body: r(body), phoneArea: r(fit), vh: innerHeight }; });
  console.log('IPHONE MODAL', JSON.stringify(dm));
  await page.getByRole('dialog').getByRole('button', { name: 'Fechar' }).tap(); await page.waitForTimeout(500);
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
  await L.shot(page, '56-iphone-master-topo');
  const cp = page.getByRole('button', { name: /Copiar Master Prompt/ });
  const b = await cp.boundingBox(); const f = await page.locator('.gd-footer').boundingBox();
  console.log('IPHONE copiar box', JSON.stringify(b), 'footer', JSON.stringify(f), 'coberto pelo rodape no 1o acesso?', b.y < f.y + f.height && b.y + b.height > f.y, 'abaixo da dobra?', b.y > 844);
  await page.evaluate(() => navigator.clipboard.writeText('VAZIO'));
  L.log('A60 (iPhone) rolar e tocar "Copiar Master Prompt"');
  await L.swipe(page, 195, 600, 350);
  await cp.tap(); await page.waitForTimeout(600);
  console.log('IPHONE clipboard len', (await page.evaluate(() => navigator.clipboard.readText())).length);
  await L.shot(page, '57-iphone-master-copiado');
  const m = await L.measure(page); console.log('IPHONE small', JSON.stringify(m.filter(x => x.small && x.y > 0)));
  console.log('IPHONE OVERFLOW', JSON.stringify(await L.overflow(page)));
  await ctx.close();
})();
