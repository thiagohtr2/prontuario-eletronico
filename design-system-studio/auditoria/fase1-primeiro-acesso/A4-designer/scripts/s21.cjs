const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Ajustar cores' }).click(); await page.waitForTimeout(800);
  const hex = page.getByLabel('Hexadecimal de Cor primária');
  await hex.fill('#0B6E4F'); await hex.press('Enter'); await page.waitForTimeout(800);
  const toks = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('main input:not([type=color])')].filter(i=>i.getAttribute('aria-label')?.startsWith('Hexadecimal')).map(i => [i.getAttribute('aria-label').replace('Hexadecimal de ',''), i.value])));
  console.log(JSON.stringify(toks));
  const note = await page.evaluate(() => [...document.querySelectorAll('main p, main span, main div')].filter(e=>e.children.length===0 && /token|paleta|personaliz|alterad/i.test(e.innerText)).map(e=>e.innerText).slice(0,8).join(' || '));
  console.log('notes:', note);
  await page.evaluate(() => scrollTo(0, 300)); await page.waitForTimeout(300);
  await page.screenshot({ path: C + '26-primaria-alterada.png' });
  const btn = await page.evaluate(() => { const f=(t)=>[...document.querySelectorAll('main button, main span')].find(b=>b.innerText && b.innerText.trim()===t); const e=f('Primário'), h=f('Hover'); return e&&h ? [getComputedStyle(e).backgroundColor, getComputedStyle(h).backgroundColor] : 'notfound'; });
  console.log('preview primary/hover', btn);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
