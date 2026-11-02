const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/modulos/inspiracao', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Abrir o site ATLAS CAPITAL/ }).click();
  await page.waitForTimeout(1000);
  console.log('URL', page.url());
  const d = page.getByRole('dialog');
  const root = (await d.count()) ? d.first() : page.locator('#conteudo');
  const lines = (await root.ariaSnapshot()).split('\n').filter(l => l.length < 300 && !/^\s*- img$/.test(l));
  // print only control-ish lines
  console.log(lines.filter(l => /button|heading|radio|group|region|paragraph|switch|textbox|tab /.test(l)).slice(0, 120).join('\n'));
  await page.screenshot({ path: W + '/scripts/tmp-47.png' });
  await ctx.close();
})();
