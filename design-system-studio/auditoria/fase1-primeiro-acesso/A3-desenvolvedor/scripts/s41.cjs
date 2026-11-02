const { open, shot, aria, W } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/modulos/componentes', { waitUntil: 'networkidle' });
  const tog = page.getByRole('button', { name: /Ver todas as 66 categorias/ }); if (await tog.count()) await tog.click();
  const aside = page.getByRole('complementary', { name: 'Categorias de componentes' });
  await aside.getByRole('button', { name: /Sidebars$/ }).click();
  await page.waitForTimeout(500);
  const famBtn = page.getByRole('button', { name: /^Escolher a família Compact Pro para / });
  const cardRoot = famBtn.locator('xpath=ancestor::*[.//button[normalize-space()="Adicionar ao projeto"]][1]');
  await cardRoot.getByRole('button', { name: 'Adicionar ao projeto' }).click();
  await page.waitForTimeout(700);
  const d = page.getByRole('dialog').first();
  const snap = await d.ariaSnapshot();
  const r = snap.indexOf('Configuração da instância'); console.log('SIDEBAR COMPONENT EDITOR:\n' + snap.slice(r, r + 2500));
  await shot(page, '41-sidebar-componente-editor');
  await d.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(300);
  // remove it again
  const reg = page.getByRole('region', { name: /No projeto/ });
  await reg.getByRole('listitem').filter({ hasText: 'Sidebars' }).getByRole('button', { name: 'Remover' }).click();
  await page.waitForTimeout(400);
  const cd = page.getByRole('alertdialog'); if (await cd.count()) { console.log('CONFIRM:', await cd.innerText()); }
  console.log('REGION:', (await reg.innerText()).replace(/\n+/g,' | ').slice(0, 400));
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
