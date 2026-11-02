const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: /^Itens/ }).click();
  await page.waitForTimeout(500);
  const items = page.locator('#conteudo li').filter({ has: page.getByRole('button', { name: 'Prompt deste elemento' }) });
  const n = await items.count();
  console.log('items', n);
  for (let i = 0; i < n; i++) {
    const it = items.nth(i);
    const txt = (await it.innerText()).split('\n')[0];
    await it.getByRole('button', { name: 'Prompt deste elemento' }).click();
    await page.waitForTimeout(500);
    const d = page.getByRole('dialog');
    const title = await d.locator('h2').first().innerText().catch(() => '?');
    let res = 'sem botão Baixar';
    const bt = d.getByRole('button', { name: 'Baixar .md' });
    if (await bt.count()) {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), bt.click()]);
      if (dl) { const fn = dl.suggestedFilename(); const slug = String(i + 1).padStart(2, '0') + '-' + (txt + ' ' + ((await it.innerText()).split('\n')[1] || '')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); const out = W + '/exportados/prompts-individuais/' + slug + '__' + fn; const existed = fs.existsSync(out); await dl.saveAs(out); res = fn + ' ' + fs.statSync(out).size + 'b' + (existed ? ' (NOME REPETIDO!)' : ''); }
      else res = 'download falhou';
    }
    console.log(`${i + 1}. [${txt}] dialog="${title}" -> ${res}`);
    if (i === 0) await page.screenshot({ path: W + '/capturas/21-prompt-individual-dialogo-titulo-generico.png' });
    await d.getByRole('button', { name: 'Fechar' }).first().click();
    await page.waitForTimeout(300);
  }
  await ctx.close();
})();
