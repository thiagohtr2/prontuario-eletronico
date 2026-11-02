const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Celular' }).click();
  await page.waitForTimeout(800);
  const labels = await page.locator('#conteudo [aria-label]').evaluateAll(els => els.map(e => e.getAttribute('aria-label') + ' <' + e.tagName + ' role=' + e.getAttribute('role') + '>').filter(s => /Prévia|celular|Celular/.test(s)));
  console.log(labels);
  const phone = page.locator('#conteudo [aria-label*="celular" i][role=group], #conteudo [aria-label*="celular" i][role=img]').first();
  console.log('bbox', await phone.boundingBox());
  // rolar para a prévia do celular e capturar inteira com viewport alta
  await page.setViewportSize({ width: 1440, height: 1300 });
  await page.waitForTimeout(400);
  await phone.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  let bb = await phone.boundingBox();
  console.log('bbox2', bb);
  await shot('06-previa-integrada-aplicacao-celular-recorte', { dir: CAP, el: phone });
  console.log((await phone.ariaSnapshot()).slice(0, 2500));
  const menu = phone.getByRole('button', { name: 'Abrir menu' });
  if (await menu.count()) {
    await menu.click(); await page.waitForTimeout(700);
    await shot('06-previa-integrada-aplicacao-celular-drawer-aberto', { dir: CAP, el: phone });
    console.log('DRAWER:', (await phone.ariaSnapshot()).slice(0, 1500));
  }
});
