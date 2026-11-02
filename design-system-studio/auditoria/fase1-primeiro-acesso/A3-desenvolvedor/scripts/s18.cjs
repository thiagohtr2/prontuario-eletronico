const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Ajustar cores' }).click();
  const set = { 'Primária — hover':'#4338ca','Primária — active':'#3730a3','Primária suave':'#eef2ff','Borda de foco (focus-visible)':'#4f46e5','Selected — fundo':'#eef2ff','Selected — texto':'#4338ca','Link':'#4338ca','Link — hover':'#3730a3','Gradiente — início':'#4f46e5' };
  for (const [n, v] of Object.entries(set)) { const t = page.getByRole('textbox', { name: 'Hexadecimal de ' + n, exact: true }); await t.fill(v); await t.press('Tab'); }
  await page.waitForTimeout(300);
  console.log(await page.locator('main').getByText(/token\(s\) alterado/).innerText());
  await page.getByRole('tab', { name: 'Tipografia' }).click();
  await page.waitForTimeout(600);
  await shot(page, '18-tipografia');
  const a = await aria(page, 'main');
  const lines = a.split('\n').filter(l => !l.includes('/url'));
  const s = lines.findIndex(l => l.includes('tablist'));
  const e = lines.findIndex(l => l.includes('Prévia da identidade'));
  console.log(lines.slice(s, e).join('\n').slice(0, 9000));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
