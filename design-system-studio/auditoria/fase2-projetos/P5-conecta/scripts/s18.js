const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const art = page.locator('article[aria-label="Praça da Comunidade"]');
  await art.scrollIntoViewIfNeeded();
  await art.getByRole('button', { name: 'Composição A' }).click();
  await art.getByRole('button', { name: /Selecionar$/ }).click();
  await page.waitForTimeout(600);
  console.log('status:', (await page.locator('#conteudo').innerText()).match(/Header: [^\n]*/g), (await page.locator('#conteudo').innerText()).match(/Sidebar: [^\n]*/g));
  await shot('08-header-praca-da-comunidade-card', { el: art, dir: CAP });
  console.log('art text:', (await art.innerText()).replace(/\s+/g, ' ').slice(300, 700));
  await art.getByRole('button', { name: 'Ver em tamanho grande' }).click();
  await page.waitForTimeout(800);
  const dlg = page.getByRole('dialog').first();
  if (await dlg.count()) {
    await shot('08-header-praca-da-comunidade-grande', { dir: CAP });
    console.log((await dlg.ariaSnapshot()).slice(0, 2500));
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#conteudo').evaluate((e) => e.scrollTo && e.scrollTo(0, 0));
  await shot('08-navegacao-topo-status', { dir: CAP });
});
