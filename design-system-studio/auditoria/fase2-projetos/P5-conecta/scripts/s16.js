const { run } = require('./lib');
run(async ({ page }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/navegacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const list = async () => {
    const arts = page.locator('main article');
    const n = await arts.count();
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = arts.nth(i);
      const name = await a.getAttribute('aria-label');
      const sel = a.getByRole('button', { name: /Selecionar$/ });
      const t = (await sel.count()) ? (await sel.first().getAttribute('aria-label')) || (await sel.first().innerText()) : '';
      const pB = await a.locator('p').first().innerText().catch(() => '');
      out.push(`- ${name} :: ${t.replace(/\s+/g, ' ')} || A: ${pB.replace(/\s+/g, ' ')}`);
    }
    return out.join('\n');
  };
  console.log('=== HEADERS\n' + (await list()));
  await page.getByRole('tab', { name: /Sidebars/ }).click();
  await page.waitForTimeout(600);
  console.log('=== SIDEBARS filtros: ' + (await page.getByRole('group', { name: /Filtrar/ }).first().innerText()).replace(/\n/g, ' '));
  console.log(await list());
  await page.getByRole('tab', { name: /Combinação/ }).click();
  await page.waitForTimeout(600);
  console.log('=== COMBINACAO\n' + (await page.locator('main').ariaSnapshot()).split('\n').slice(40, 120).join('\n'));
});
