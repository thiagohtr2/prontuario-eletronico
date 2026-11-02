const { run, EXP } = require('./lib');
const fs = require('fs');
const path = require('path');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/exportar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('11-exportar-e-importar', { dir: CAP });
  const arts = page.locator('#conteudo article');
  const n = await arts.count();
  const res = [];
  for (let i = 0; i < n; i++) {
    const a = arts.nth(i);
    const title = (await a.getByRole('heading').first().innerText()).trim();
    const btn = a.getByRole('button', { name: 'Baixar', exact: true });
    if (!(await btn.count())) continue;
    try {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), btn.click()]);
      const name = dl.suggestedFilename();
      const dest = path.join(EXP, name);
      if (fs.existsSync(dest)) res.push(`AVISO: ${name} já existia (sobrescrito)`);
      await dl.saveAs(dest);
      const fail = await dl.failure();
      res.push(`${title} -> ${name} (${fs.statSync(dest).size} bytes)${fail ? ' FALHA: ' + fail : ''}`);
    } catch (e) {
      res.push(`${title} -> ERRO: ${e.message.split('\n')[0]}`);
      await shot('erro-download-' + i, { dir: CAP });
    }
    await page.waitForTimeout(600);
  }
  return res.join('\n');
});
