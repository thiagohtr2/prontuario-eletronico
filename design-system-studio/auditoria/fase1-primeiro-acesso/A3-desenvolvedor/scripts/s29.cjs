const { open, shot, aria, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page, logs } = await open();
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click();
  const aside = page.getByRole('complementary', { name: 'Categorias de componentes' });
  for (const [cat, fam] of [['Quadros Kanban','Compact Pro'],['Tabelas','Compact Pro'],['Text inputs','Compact Pro'],['Modais','Compact Pro'],['Badges e tags','Compact Pro']]) {
    await aside.getByRole('button', { name: new RegExp(cat + '$') }).click();
    await page.waitForTimeout(500);
    const famBtn = page.getByRole('button', { name: new RegExp('^Escolher a família ' + fam + ' para ') });
    const cnt = await famBtn.count();
    if (!cnt) { console.log('NO family for', cat); continue; }
    // the add button within same card container
    const cardRoot = famBtn.locator('xpath=ancestor::*[.//button[normalize-space()="Adicionar ao projeto"]][1]');
    await cardRoot.getByRole('button', { name: 'Adicionar ao projeto' }).click();
    await page.waitForTimeout(700);
    const d = page.getByRole('dialog').first();
    if (cat === 'Quadros Kanban') {
      const snap = await d.ariaSnapshot();
      fs.writeFileSync(W + '/exportados/editor-kanban-aria.txt', snap);
      await shot(page, '29-kanban-editor');
      const r = snap.indexOf('Configuração da instância'); console.log('KANBAN EDITOR:\n' + snap.slice(r, r + 3500));
    }
    await d.getByRole('button', { name: 'Concluir' }).click();
    await page.waitForTimeout(400);
  }
  const reg = page.getByRole('region', { name: /No projeto/ });
  console.log('REGION:', (await reg.innerText()).replace(/\n+/g,' | '));
  await shot(page, '29b-no-projeto');
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
