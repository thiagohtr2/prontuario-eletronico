const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /Sidebars/ }).click();
  const art = page.locator('main article[aria-label="Seletor de Espaços"]');
  await art.scrollIntoViewIfNeeded();
  console.log('desc A:', (await art.locator('p').last().innerText()).slice(0, 400));
  // interact with preview: try open the switcher
  const prev = art.locator('[role=group]').first();
  const btns = prev.getByRole('button');
  const bn = await btns.count(); const names=[]; for (let i=0;i<Math.min(bn,12);i++) names.push(await btns.nth(i).getAttribute('aria-label') || (await btns.nth(i).innerText()).slice(0,30));
  console.log('preview buttons:', names.join(' | '));
  await art.getByRole('button', { name: /Selecionar$/ }).click();
  await page.waitForTimeout(400);
  await art.screenshot({ path: W + '/capturas/24-sidebar-seletor-espacos.png' });
  await page.getByRole('tab', { name: 'Combinação' }).click();
  await page.waitForTimeout(700);
  await shot(page, '24b-combinacao');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  const s = lines.findIndex(l => l.includes('tablist "Tipo de navegação"'));
  console.log(lines.slice(s).join('\n').slice(0, 5000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
