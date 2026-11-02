const { run, EXP } = require('./lib');
const fs = require('fs');
const path = require('path');
const D = path.join(EXP, 'prompts-individuais');
fs.mkdirSync(D, { recursive: true });
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('tab', { name: /^Itens/ }).click();
  await page.waitForTimeout(500);
  const items = page.getByRole('listitem').filter({ has: page.getByRole('switch', { name: 'No Master Prompt' }) });
  const n = await items.count();
  const out = [];
  for (let i = 0; i < n; i++) {
    const it = items.nth(i);
    const label = (await it.innerText()).split('\n').slice(0, 2).join(' / ');
    await it.getByRole('button', { name: 'Prompt deste elemento' }).click();
    await page.waitForTimeout(500);
    const dlg = page.getByRole('dialog').first();
    const title = (await dlg.getByRole('heading').first().innerText()).trim();
    try {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }), dlg.getByRole('button', { name: /Baixar/ }).first().click()]);
      const name = dl.suggestedFilename();
      const slug = String(i + 1).padStart(2, '0') + '-' + label.split(' / ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + (label.startsWith('COMPONENTE') ? '-' + label.split(' / ')[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 30).replace(/-$/, '') : '');
      fs.mkdirSync(path.join(D, slug), { recursive: true });
      const dest = path.join(D, slug, name);
      const existed = fs.existsSync(dest);
      await dl.saveAs(dest);
      out.push(`${label} | ${title} -> ${slug}/${name} (${fs.statSync(dest).size} B)${existed ? ' [NOME REPETIDO: sobrescreveu]' : ''}`);
    } catch (e) { out.push(`${label} | ${title} -> ERRO ${e.message.split('\n')[0]}`); }
    await dlg.getByRole('button', { name: 'Fechar' }).first().click().catch(() => page.keyboard.press('Escape'));
    await page.waitForTimeout(300);
  }
  return out.join('\n');
});
