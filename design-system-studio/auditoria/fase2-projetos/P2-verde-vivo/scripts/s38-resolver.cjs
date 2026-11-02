const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  await page.getByRole('tab', { name: /Contradições/ }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /^Paleta global prevalece/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'contradicao-resolvida-paleta-global-prevalece.png') });
  const m = await page.locator('#conteudo').ariaSnapshot();
  const k = m.indexOf('itens no Master Prompt');
  console.log(m.slice(k - 200, k + 600));
  const i = m.indexOf('tablist "Partes da Central');
  console.log(m.slice(i, i + 3000));
}, { url: URL + '#/guiado/entrega' });
