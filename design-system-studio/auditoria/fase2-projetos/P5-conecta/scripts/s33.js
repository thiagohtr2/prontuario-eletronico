const { run, TMP } = require('./lib');
const fs = require('fs');
run(async ({ page }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const pre = page.locator('#conteudo pre').first();
  const txt = await pre.evaluate((e) => e.textContent);
  fs.writeFileSync(TMP + '/master-prompt-tela-v2.md', txt);
  const lines = txt.split('\n').filter(l => /Observa|exce|FAB|☰|280 px/i.test(l));
  console.log('chars', txt.length, '\n' + lines.join('\n'));
  console.log((await page.locator('#conteudo').innerText()).match(/\d+\s*\n?\s*(itens no Master Prompt|retirados|contradições a decidir|decisões pendentes)/g));
});
