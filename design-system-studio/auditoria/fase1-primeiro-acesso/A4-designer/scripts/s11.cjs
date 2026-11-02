const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrada', { waitUntil: 'networkidle' }); await page.getByText('Como as pessoas entram').first().waitFor();
  for (const tab of ['Login','Cadastro']) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: C + `12-${tab.toLowerCase()}-galeria-full.png`, fullPage: true });
    const names = await page.evaluate(() => [...document.querySelectorAll('main button[aria-pressed]')].map(b => { const p=b.parentElement; return p.innerText.replace(/\s+/g,' ').slice(-160); }));
    console.log('== ' + tab + ' (' + names.length + ')'); console.log(names.join('\n'));
    const filters = await page.evaluate(() => [...document.querySelectorAll('main button')].filter(b=>/\d+$/.test(b.innerText.trim()) && !b.hasAttribute('aria-pressed')).map(b=>b.innerText.replace(/\s+/g,' ')).join(' | '));
    console.log('filters', filters);
  }
  console.log('LOGS', logs.join('\n'));
  await close();
})();
