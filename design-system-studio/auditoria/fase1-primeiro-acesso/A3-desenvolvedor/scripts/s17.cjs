const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Ajustar cores' }).click();
  const hex = page.getByRole('textbox', { name: 'Hexadecimal de Cor primária' });
  // invalid first
  await hex.fill('#zzz'); await hex.press('Enter'); await page.waitForTimeout(300);
  console.log('after invalid:', await hex.inputValue(), '| aria-invalid:', await hex.getAttribute('aria-invalid'));
  const err = await page.locator('main').getByText(/inválid|hexadecimal/i).allInnerTexts().catch(()=>[]);
  console.log('err texts:', err.slice(0,5));
  await shot(page, '17a-hex-invalido');
  await hex.fill('#4f46e5'); await hex.press('Tab'); await page.waitForTimeout(500);
  const names = ['Cor primária','Primária — hover','Primária — active','Primária suave','Borda de foco (focus-visible)','Selected — fundo','Selected — texto','Link','Link — hover','Gradiente — início','Navegação — item ativo'];
  for (const n of names) console.log(n, '=>', await page.getByRole('textbox', { name: 'Hexadecimal de ' + n, exact: true }).inputValue());
  const contrast = await page.locator('main').getByRole('list').first().innerText();
  console.log('CONTRAST:\n' + contrast);
  await shot(page, '17b-primaria-alterada');
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
