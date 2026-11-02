const { run } = require('./lib');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.getByRole('tab', { name: /Combinação/ }).click();
  await page.waitForTimeout(600);
  await shot('s17-combinacao', { full: true });
  const panel = page.getByRole('tabpanel').first();
  const s = await page.locator('#conteudo').ariaSnapshot();
  const i = s.indexOf('tablist "Tipo de navegação"');
  console.log(s.slice(i, i + 5000));
  // header Praça da Comunidade: ver composições A e B
  await page.getByRole('tab', { name: /Headers/ }).click();
  await page.waitForTimeout(500);
  const art = page.locator('article[aria-label="Praça da Comunidade"]');
  await art.scrollIntoViewIfNeeded();
  await shot('s17-praca-A', { el: art });
  console.log('A:', (await art.innerText()).replace(/\s+/g, ' ').slice(0, 600));
  await art.getByRole('button', { name: 'Composição B' }).click();
  await page.waitForTimeout(400);
  await shot('s17-praca-B', { el: art });
  console.log('B:', (await art.innerText()).replace(/\s+/g, ' ').slice(0, 600));
});
