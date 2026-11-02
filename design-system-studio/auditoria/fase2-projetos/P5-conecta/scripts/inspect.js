// uso: node inspect.js <rota-hash> <nome> [full]
const { run } = require('./lib');
const rota = process.argv[2] || '';
const nome = process.argv[3] || 'inspect';
const full = process.argv[4] === 'full';
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/' + rota, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await shot(nome);
  if (full) await shot(nome + '-full', { full: true });
  return await page.locator('#conteudo').ariaSnapshot();
});
