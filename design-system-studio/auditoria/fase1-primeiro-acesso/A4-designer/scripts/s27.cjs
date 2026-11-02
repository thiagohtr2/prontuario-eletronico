const { open, dump, controls, C, BASE } = require('./lib.cjs');
const E = __dirname + '/../exportados/';
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  const btn = page.getByRole('button', { name: 'CSS dos tokens' });
  console.log(await btn.evaluate(b => b.outerHTML.slice(0,300)));
  const dlP = page.waitForEvent('download', { timeout: 6000 }).catch(() => null);
  const popP = ctx.waitForEvent('page', { timeout: 6000 }).catch(() => null);
  await btn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: C + '32-css-tokens-clique.png' });
  const [dl, pop] = await Promise.all([dlP, popP]);
  console.log('dl', !!dl, 'pop', !!pop);
  if (dl) { await dl.saveAs(E + dl.suggestedFilename()); console.log(dl.suggestedFilename()); }
  const dlg = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0,500) || 'nodialog');
  console.log(dlg);
  const toast = await page.evaluate(() => [...document.querySelectorAll('[role=status],[role=alert],[aria-live]')].map(e=>e.innerText).join(' | '));
  console.log('toast', toast);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
