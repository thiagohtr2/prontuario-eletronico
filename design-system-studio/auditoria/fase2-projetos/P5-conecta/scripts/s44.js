const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('tab', { name: /^Itens/ }).click();
  await page.waitForTimeout(400);
  const it = page.getByRole('listitem').filter({ hasText: 'navigation.header' }).filter({ has: page.getByRole('switch') }).first();
  await it.getByRole('button', { name: 'Prompt deste elemento' }).click();
  await page.waitForTimeout(600);
  await shot('bug-04-prompt-individual-titulo-generico-elemento', { dir: CAP });
  const dlg = page.getByRole('dialog').first();
  console.log((await dlg.ariaSnapshot()).slice(0, 600));
});
