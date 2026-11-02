const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Contradições/ }).click(); await page.waitForTimeout(500);
  await page.screenshot({ path: W + '/capturas/26a-contradicao-duas-fontes-de-cor.png' });
  await page.getByRole('button', { name: /^Paleta global prevalece/ }).click();
  await page.waitForTimeout(700);
  const s2 = await page.locator('#conteudo').ariaSnapshot();
  const l2 = s2.split('\n'); const i = l2.findIndex(l => l.includes('itens no Master Prompt'));
  console.log(l2.slice(i - 1, i + 8).join('\n'));
  const j = l2.findIndex(l => l.includes('tablist'));
  console.log(l2.slice(j, j + 40).filter(l => l.length < 600).join('\n'));
  await page.screenshot({ path: W + '/capturas/26b-contradicao-resolvida-paleta-global-prevalece.png' });
  await ctx.close();
})();
