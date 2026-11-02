const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(5000);
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const pg = page.getByRole('group', { name: 'Página da prévia' });
  const dv = page.getByRole('group', { name: 'Dispositivo da prévia' });
  await pg.getByRole('button', { name: 'Aplicação' }).click();
  await dv.getByRole('button', { name: 'Computador' }).click();
  await page.waitForTimeout(600);
  const html = await page.evaluate(() => {
    const host = document.querySelector('#conteudo');
    const el = [...host.querySelectorAll('[aria-label]')].filter(e => /Prévia/.test(e.getAttribute('aria-label'))).map(e => e.tagName + ' role=' + e.getAttribute('role') + ' label=' + e.getAttribute('aria-label'));
    return el;
  });
  console.log(html);
  await ctx.close();
})();
