const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.getByRole('listitem').nth(0).getByRole('button', { name: 'Personalizar' }).click();
  await page.waitForTimeout(700);
  const d = page.getByRole('dialog');
  const g = d.getByRole('group', { name: 'Densidade' });
  await g.scrollIntoViewIfNeeded();
  console.log(await g.ariaSnapshot());
  await page.screenshot({ path: W + '/capturas/33-bug-densidade-padrao-na-ui-vs-compacta-no-prompt.png' });
  await d.getByRole('button', { name: 'Concluir' }).click();
  await ctx.close();
})();
