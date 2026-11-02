const { open, shot, aria } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Formas e superfícies' }).click();
  const st = async (label) => { const r = []; for (const b of await page.locator('main button[aria-pressed="true"]').all()) r.push((await b.innerText()).replace(/\n/g,' ')); console.log(label, JSON.stringify(r)); };
  await page.getByRole('button', { name: 'Elevada (sombras)' }).click(); await page.waitForTimeout(300);
  await st('after Elevada:');
  await page.getByRole('button', { name: 'Sem sombra' }).click(); await page.waitForTimeout(300);
  await st('after Sem sombra:');
  await page.getByRole('button', { name: 'Plana (sem bordas nem sombras)' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: '2 px' }).click(); await page.waitForTimeout(300);
  await st('after Plana + 2px:');
  await shot(page, '20-formas-conflito');
  // final choice: contornada, sutil, 1px, compacta, 8px
  await page.getByRole('button', { name: 'Contornada (bordas finas)' }).click();
  await page.getByRole('button', { name: 'Sutil' }).click();
  await page.getByRole('button', { name: '1 px' }).click();
  await page.getByRole('button', { name: 'Compacta' }).click();
  await page.waitForTimeout(300);
  await st('final:');
  await shot(page, '20b-formas-final');
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
