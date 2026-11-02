const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/cores', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Ajustar cores' }).click();
  for (const n of ['Cor primária','Primária — hover','Link']) console.log('after import', n, await page.getByRole('textbox', { name: 'Hexadecimal de ' + n, exact: true }).inputValue());
  await page.keyboard.press('Control+k'); await page.waitForTimeout(300);
  await page.keyboard.type('kanban'); await page.waitForTimeout(500);
  const d2 = page.getByRole('dialog').last();
  console.log('SEARCH kanban:', (await d2.innerText()).replace(/\n+/g,' | ').slice(0, 500));
  await page.keyboard.press('Escape');
  await page.goto('http://127.0.0.1:4300/#/validacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot(page, '40-validacao');
  const a = await aria(page, 'main');
  console.log(a.split('\n').filter(l=>!l.includes('/url')).join('\n').slice(0, 3500));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
