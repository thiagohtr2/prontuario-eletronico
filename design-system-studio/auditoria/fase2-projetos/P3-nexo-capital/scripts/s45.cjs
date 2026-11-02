const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(6000);
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Sidebars/ }).click(); await page.waitForTimeout(400);
  const s = page.locator('#conteudo article[aria-label="Sóbria Corporativa"]');
  await s.scrollIntoViewIfNeeded();
  await s.getByRole('button', { name: 'Ver em tamanho grande' }).click(); await page.waitForTimeout(500);
  const d = page.getByRole('dialog');
  await d.getByRole('button', { name: 'Ver detalhes técnicos' }).click().catch(e => console.log('no detalhes', e.message.split('\n')[0]));
  await page.waitForTimeout(500);
  const tb = await d.getByRole('textbox').count();
  console.log('textboxes in sidebar dialog:', tb);
  console.log((await d.ariaSnapshot()).split('\n').filter(l => l.length < 250 && !/listitem:$/.test(l)).slice(-40).join('\n'));
  // mobile drawer preview in dialog
  await d.getByRole('button', { name: 'Celular' }).click(); await page.waitForTimeout(600);
  await page.screenshot({ path: W + '/capturas/24-sidebar-sobria-corporativa-previa-celular.png' });
  await ctx.close();
})();
