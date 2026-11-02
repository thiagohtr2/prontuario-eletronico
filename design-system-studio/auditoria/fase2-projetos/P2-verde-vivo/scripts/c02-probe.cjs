const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  console.log(await page.evaluate(() => { const s = document.scrollingElement; const c = document.querySelector('#conteudo'); return JSON.stringify({ docH: s.scrollHeight, winH: innerHeight, cH: c.scrollHeight, cClient: c.clientHeight, cOv: getComputedStyle(c).overflowY }); }));
  await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Celular' }).click();
  await page.waitForTimeout(800);
  const m = await page.locator('#conteudo').ariaSnapshot();
  const i = m.indexOf('group "Dispositivo da prévia"');
  console.log(m.slice(i, i + 1800));
}, { url: URL + '#/guiado/preview' });
