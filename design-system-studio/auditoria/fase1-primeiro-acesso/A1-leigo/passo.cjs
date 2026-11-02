// Executa um passo da jornada: abre o perfil persistente, volta à última URL e roda o script de passo.
// uso: node passo.js passos/NN-nome.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = __dirname;
const stateFile = path.join(BASE, 'ultima-url.txt');
(async () => {
  const stepFile = path.resolve(process.argv[2]);
  const step = require(stepFile);
  const context = await chromium.launchPersistentContext(path.join(BASE, 'perfil'), { viewport: { width: 1366, height: 768 } });
  const page = context.pages()[0] || await context.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[console.${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('dialog', async d => { logs.push(`[dialog ${d.type()}] ${d.message()}`); await d.dismiss().catch(() => {}); });
  context.on('page', p => logs.push(`[nova aba] ${p.url()}`));
  const shot = async (name, full = false) => { const f = path.join(BASE, 'capturas', name + '.png'); await page.screenshot({ path: f, fullPage: full }); console.log('captura:', f); };
  const aria = async () => (await page.locator('body').ariaSnapshot());
  const start = step.startUrl || (fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8').trim() : 'http://127.0.0.1:4300/');
  if (!step.noGoto) { await page.goto(start, { waitUntil: 'networkidle' }); await page.waitForTimeout(500); }
  try {
    await step.run({ page, context, shot, aria, log: (...a) => console.log(...a) });
  } catch (e) {
    console.log('ERRO NO PASSO:', e.message.split('\n').slice(0, 6).join('\n'));
    await shot('erro-' + path.basename(stepFile, '.js'));
  }
  fs.writeFileSync(stateFile, page.url());
  console.log('URL final:', page.url());
  if (logs.length) console.log('LOGS:\n' + logs.join('\n'));
  await context.close();
})();
