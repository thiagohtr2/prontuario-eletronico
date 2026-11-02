const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(10000);
  const log = [];
  async function grab(label, clickFn, dir) {
    try {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), clickFn()]);
      const fn = dl.suggestedFilename();
      const out = (dir || W + '/scripts/dl-cmp') + '/' + fn;
      await dl.saveAs(out);
      log.push(`${label} -> ${fn} (${fs.statSync(out).size} bytes) failure=${await dl.failure()}`);
      return out;
    } catch (e) { log.push(`${label} -> SEM DOWNLOAD/ERRO: ${e.message.split('\n')[0]}`); }
  }
  // Central de prompts
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await grab('Central: Baixar .md', () => page.getByRole('button', { name: 'Baixar .md' }).click());
  await page.getByRole('tab', { name: 'Especificação JSON' }).click();
  await page.waitForTimeout(400);
  await grab('Central: Baixar JSON', () => page.getByRole('button', { name: 'Baixar JSON' }).click());
  // Guided entrega
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: W + '/capturas/19-master-prompt-tela-final.png' });
  await grab('Entrega: Baixar .md', () => page.getByRole('button', { name: 'Baixar .md' }).click());
  // Identity CSS dos tokens
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await grab('Identidade: CSS dos tokens', () => page.getByRole('button', { name: 'CSS dos tokens' }).click());
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) { log.push('CSS dos tokens abriu dialog: ' + (await dlg.first().ariaSnapshot()).split('\n').slice(0, 10).join(' | ')); await page.keyboard.press('Escape'); }
  await page.getByRole('button', { name: 'Prompt da identidade' }).click();
  await page.waitForTimeout(600);
  if (await dlg.count()) { log.push('Prompt da identidade dialog: ' + (await dlg.first().ariaSnapshot()).split('\n').filter(l => l.length < 200).slice(0, 20).join(' | ')); await page.screenshot({ path: W + '/scripts/tmp-42.png' }); }
  console.log(log.join('\n'));
  await ctx.close();
})();
