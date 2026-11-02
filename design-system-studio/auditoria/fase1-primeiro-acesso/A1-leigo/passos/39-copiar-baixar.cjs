const fs = require('fs'); const path = require('path');
module.exports = {
  async run({ page, context, shot, aria, log }) {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4300' });
    // texto visível do prompt na tela
    const txt = await page.getByRole('main').innerText();
    fs.writeFileSync(path.join(__dirname, '..', 'downloads', 'texto-visivel-tela-entrega.txt'), txt);
    await page.getByRole('button', { name: 'Copiar Master Prompt' }).click();
    await page.waitForTimeout(600);
    await shot('39-depois-copiar');
    const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(e => 'ERRO: ' + e.message);
    log('CLIPBOARD chars:', clip.length, 'inicio:', clip.slice(0, 80).replace(/\n/g, ' | '));
    fs.writeFileSync(path.join(__dirname, '..', 'downloads', 'master-prompt-copiado.md'), clip);
    const btnTxt = await page.getByRole('main').getByRole('button', { name: /Copia/ }).first().innerText().catch(() => '');
    log('Botão depois de copiar:', btnTxt);
    const [dl] = await Promise.all([
      page.waitForEvent('download', { timeout: 8000 }).catch(() => null),
      page.getByRole('button', { name: 'Baixar .md' }).click(),
    ]);
    await page.waitForTimeout(600);
    await shot('40-depois-baixar-md');
    if (dl) { const f = path.join(__dirname, '..', 'downloads', dl.suggestedFilename()); await dl.saveAs(f); log('DOWNLOAD:', dl.suggestedFilename(), fs.statSync(f).size, 'bytes'); }
    else log('Nenhum download disparado');
  }
};
