const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('10-master-prompt-guiado', { dir: CAP });
  for (const [t, n] of [[/^Itens/, 'itens'], [/^Contradições/, 'contradicoes'], [/^Especificação JSON/, 'json']]) {
    await page.getByRole('tab', { name: t }).click();
    await page.waitForTimeout(600);
    await shot('10-entrega-aba-' + n, { dir: CAP });
    const s = await page.locator('#conteudo').ariaSnapshot();
    const i = s.indexOf('tablist "Partes da Central de Prompts"');
    console.log('=== ' + n + '\n' + s.slice(i, i + 3500));
  }
});
