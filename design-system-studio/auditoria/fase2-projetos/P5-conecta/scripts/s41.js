const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('10-master-prompt-tela-final', { dir: CAP });
  const txt = (await page.locator('#conteudo').innerText());
  console.log(txt.match(/[\d.]+ caracteres/), txt.match(/\d+\s*\n?\s*(itens no Master Prompt|retirados|contradições a decidir|decisões pendentes)/g));
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('12-central-de-prompts', { dir: CAP });
  // Live Site Preview
  await page.goto('http://127.0.0.1:4300/#/modulos/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('13-live-site-preview-modulo', { dir: CAP });
  const s = await page.locator('#conteudo').ariaSnapshot();
  console.log(s.slice(0, 1800));
});
