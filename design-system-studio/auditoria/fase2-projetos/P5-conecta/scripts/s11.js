const { run } = require('./lib');
const nomes = ['Topbar integral fixa', 'Header central flutuante', 'Layout minimalista sem navegação lateral', 'Editorial assimétrica', 'Header e sidebar flutuantes', 'Sidebar flutuante compacta', 'Ilhas de navegação', 'Sidebar integral com header global'];
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/desktop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const out = [];
  for (const n of nomes) {
    const btn = page.getByRole('button', { name: new RegExp('^' + n + '\\.') });
    await btn.click();
    await page.waitForTimeout(400);
    const det = page.getByRole('complementary', { name: 'Detalhes do layout' });
    await shot('s11-' + n.replace(/\s+/g, '_'), { el: det });
    out.push(n + ' => ' + (await det.innerText()).replace(/\n+/g, ' | ').slice(0, 300));
  }
  return out.join('\n');
});
