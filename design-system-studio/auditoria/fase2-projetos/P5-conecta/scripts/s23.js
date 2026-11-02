const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  let s = await page.locator('#conteudo').ariaSnapshot();
  let i = s.indexOf('region "No projeto');
  console.log('ANTES:\n' + s.slice(i, i + 1500));
  // abrir o editor do card já adicionado
  const reg = page.getByRole('region', { name: /^No projeto/ });
  const btns = await reg.getByRole('button').all();
  for (const b of btns) console.log('btn:', await b.getAttribute('aria-label'), '|', (await b.innerText()).trim());
});
