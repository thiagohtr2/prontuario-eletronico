const { run, TMP } = require('./lib');
const fs = require('fs');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const pre = page.locator('#conteudo pre, #conteudo [class*="prompt"] code, #conteudo textarea').first();
  let txt = '';
  if (await pre.count()) txt = (await pre.evaluate((e) => e.value || e.textContent));
  fs.writeFileSync(TMP + '/master-prompt-tela.md', txt);
  console.log('chars', txt.length);
  // tabs Itens e Contradições
  for (const t of [/^Itens/, /^Contradições/]) {
    await page.getByRole('tab', { name: t }).click();
    await page.waitForTimeout(500);
    const p = page.getByRole('tabpanel').first();
    console.log('=== TAB', t, '\n', (await p.innerText()).slice(0, 4000));
  }
});
