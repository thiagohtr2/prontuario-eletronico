const { open, dump, controls, C, BASE } = require('./lib.cjs');
const E = __dirname + '/../exportados/';
const fs = require('fs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/entrega', { waitUntil: 'networkidle' }); await page.getByText('itens no Master Prompt').first().waitFor(); await page.waitForTimeout(1000);
  // full text of master prompt as displayed
  const shown = await page.evaluate(() => { const pre=document.querySelector('main pre, main textarea, main code'); return pre ? (pre.value||pre.innerText) : ''; });
  fs.writeFileSync(E + 'master-prompt-exibido-na-tela.md', shown); console.log('shown len', shown.length);
  const dlP = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
  await page.getByRole('button', { name: 'Baixar .md' }).first().click();
  const dl = await dlP; if (dl) { await dl.saveAs(E + dl.suggestedFilename()); console.log('saved', dl.suggestedFilename()); } else console.log('no md download');
  await page.getByRole('tab', { name: 'Especificação JSON' }).click(); await page.waitForTimeout(1000);
  await page.screenshot({ path: C + '41-entrega-json.png' });
  const jtxt = await page.evaluate(() => { const pre=document.querySelector('main pre, main textarea, main code'); return pre ? (pre.value||pre.innerText) : ''; });
  fs.writeFileSync(E + 'especificacao-exibida-na-tela.json', jtxt); console.log('json len', jtxt.length);
  const btns = await page.evaluate(() => [...document.querySelectorAll('main button')].map(b=>b.innerText.trim()).filter(x=>x && x.length<40).slice(10).join(' | '));
  console.log(btns);
  const dl2P = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
  const jb = page.locator('main').getByRole('button', { name: /Baixar.*JSON|\.json/i }).first();
  if (await jb.count()) { await jb.click(); const dl2 = await dl2P; if (dl2) { await dl2.saveAs(E + dl2.suggestedFilename()); console.log('saved', dl2.suggestedFilename()); } else console.log('no json dl'); }
  await page.getByRole('tab', { name: /Contradições/ }).click(); await page.waitForTimeout(800);
  await page.screenshot({ path: C + '42-entrega-contradicoes.png' });
  console.log('CONTRA', await page.evaluate(() => { const t=document.querySelector('main').innerText; const i=t.indexOf('Contradições (0)'); return t.slice(i, i+700); }));
  await page.getByRole('tab', { name: /Itens/ }).click(); await page.waitForTimeout(800);
  await page.screenshot({ path: C + '43-entrega-itens.png', fullPage: true });
  console.log('ITENS', await page.evaluate(() => { const t=document.querySelector('main').innerText; const i=t.indexOf('Itens (12)'); return t.slice(i, i+2500); }));
  console.log('LOGS', logs.join('\n'));
  await close();
})();
