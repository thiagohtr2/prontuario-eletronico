const { run, TMP } = require('./lib');
const fs = require('fs');
const path = require('path');
const D = path.join(TMP, 'dl2');
fs.mkdirSync(D, { recursive: true });
async function tryDl(page, btn, label, out) {
  try {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 6000 }), btn.click()]);
    const name = dl.suggestedFilename();
    await dl.saveAs(path.join(D, name));
    out.push(`${label} -> download ${name} (${fs.statSync(path.join(D, name)).size} bytes)`);
  } catch (e) {
    out.push(`${label} -> sem download (${e.message.split('\n')[0].slice(0, 80)})`);
    const dlg = page.getByRole('dialog');
    if (await dlg.count()) {
      const s = await dlg.first().ariaSnapshot();
      out.push('   dialog: ' + s.split('\n').filter(l => /button|heading/.test(l)).join(' ').slice(0, 600));
    }
  }
}
run(async ({ page, shot, CAP }) => {
  const out = [];
  await page.goto('http://127.0.0.1:4300/#/prompt', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await shot('12-central-de-prompts', { dir: CAP });
  const s = await page.locator('#conteudo').ariaSnapshot();
  out.push('BOTOES CENTRAL: ' + (s.match(/button "[^"]+"/g) || []).join(', '));
  await tryDl(page, page.getByRole('button', { name: 'Baixar .md' }), 'Central: Baixar .md', out);
  await page.getByRole('tab', { name: /Especificação JSON/ }).click().catch(() => {});
  await page.waitForTimeout(400);
  await tryDl(page, page.getByRole('button', { name: 'Baixar JSON' }), 'Central: Baixar JSON', out);
  // Identidade: CSS dos tokens / Prompt da identidade
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await tryDl(page, page.getByRole('button', { name: 'CSS dos tokens' }), 'Identidade: CSS dos tokens', out);
  await shot('s38-css-tokens');
  const dlg = page.getByRole('dialog');
  if (await dlg.count()) {
    const b = dlg.first().getByRole('button', { name: /Baixar/ });
    if (await b.count()) await tryDl(page, b.first(), 'Identidade: CSS dos tokens > Baixar', out);
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(300);
  await tryDl(page, page.getByRole('button', { name: 'Prompt da identidade' }), 'Identidade: Prompt da identidade', out);
  if (await page.getByRole('dialog').count()) {
    const b = page.getByRole('dialog').first().getByRole('button', { name: /Baixar/ });
    if (await b.count()) await tryDl(page, b.first(), 'Identidade: Prompt da identidade > Baixar', out);
    await page.keyboard.press('Escape');
  }
  // Projeto e versões
  await page.goto('http://127.0.0.1:4300/#/projeto', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const sp = await page.locator('#conteudo').ariaSnapshot();
  out.push('PROJETO: ' + sp.slice(0, 2500));
  return out.join('\n');
});
