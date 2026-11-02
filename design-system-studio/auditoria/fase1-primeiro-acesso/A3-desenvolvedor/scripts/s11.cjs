const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Prompt deste elemento' }).click();
  await page.waitForTimeout(600);
  await shot(page, '11-prompt-elemento-desktop');
  const d = page.getByRole('dialog');
  if (await d.count()) { console.log(await d.first().ariaSnapshot()); console.log('INNER:\n' + await d.first().innerText()); }
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Continuar: Mobile/ }).click();
  await page.waitForTimeout(600);
  console.log('URL', page.url());
  await shot(page, '11b-mobile');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  console.log(lines.slice(34).join('\n').slice(0, 6000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
