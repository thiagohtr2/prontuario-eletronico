const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const reg = page.getByRole('region', { name: /^No projeto/ });
  const items = reg.getByRole('listitem');
  const n = await items.count();
  for (let i = 0; i < n; i++) console.log('item', i, (await items.nth(i).innerText()).replace(/\s+/g, ' '), '| nome:', await items.nth(i).getByRole('textbox').inputValue());
  // abrir o drawer (3º item)
  const it = items.filter({ hasText: 'Drawers' }).first();
  await it.getByRole('button', { name: 'Personalizar' }).click();
  await page.waitForTimeout(700);
  const dlg = page.getByRole('dialog').first();
  await dlg.getByRole('textbox', { name: 'Título', exact: true }).fill('Menu');
  await dlg.getByRole('textbox', { name: 'Botão principal', exact: true }).fill('Sair da conta');
  await dlg.getByRole('group', { name: 'Lado' }).getByRole('button', { name: 'Esquerda' }).click();
  await page.waitForTimeout(500);
  await shot('09-componente-drawer-editor', { dir: CAP });
  console.log((await dlg.ariaSnapshot()).split('\n').filter(l => /Lado|Direita|Esquerda|Título|Botão principal|Menu|Sair/.test(l)).join('\n'));
  await dlg.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);
  await reg.scrollIntoViewIfNeeded();
  await shot('09-componentes-no-projeto', { dir: CAP, el: reg });
  for (let i = 0; i < n; i++) console.log('item', i, (await items.nth(i).innerText()).replace(/\s+/g, ' '), '| nome:', await items.nth(i).getByRole('textbox').inputValue());
});
