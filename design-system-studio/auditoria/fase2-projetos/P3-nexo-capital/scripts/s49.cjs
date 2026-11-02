const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const s = await page.locator('#conteudo').ariaSnapshot();
  const ls = s.split('\n'); const i = ls.findIndex(l => l.includes('itens no Master Prompt'));
  console.log(ls.slice(i - 1, i + 16).join('\n'));
  await page.getByRole('tab', { name: /^Contradições/ }).click(); await page.waitForTimeout(400);
  const s2 = await page.locator('#conteudo').ariaSnapshot();
  const l2 = s2.split('\n'); const j = l2.findIndex(l => l.includes('tablist'));
  console.log(l2.slice(j + 5).filter(l => l.length < 600).join('\n').slice(0, 4000));
  await page.screenshot({ path: W + '/scripts/tmp-48.png' });
  // identity palette still?
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  const t = await page.getByRole('complementary', { name: 'Escolhas nesta prévia' }).innerText();
  console.log('ESCOLHAS:', t.replace(/\n+/g, ' | '));
  await ctx.close();
})();
