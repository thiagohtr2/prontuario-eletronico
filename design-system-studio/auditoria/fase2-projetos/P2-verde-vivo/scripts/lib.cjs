// Infra: abre o perfil persistente, executa um passo e fecha.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P2-verde-vivo';
const URL = 'http://127.0.0.1:4300/';

async function withPage(step, opts = {}) {
  const ctx = await chromium.launchPersistentContext(path.join(W, 'perfil'), {
    viewport: opts.viewport || { width: 1440, height: 900 },
    acceptDownloads: true,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(`[console.${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('dialog', async d => { logs.push(`[dialog ${d.type()}] ${d.message()}`); if (opts.dialog === 'dismiss') await d.dismiss(); else await d.accept(); });
  try {
    if (!opts.noGoto) { await page.goto(opts.url || URL, { waitUntil: 'networkidle' }); }
    await step(page, ctx, { W, path, fs, shot: (name, o = {}) => page.screenshot({ path: path.join(W, o.dir || 'scratch', name + '.png'), fullPage: !!o.full }) });
  } catch (e) {
    console.log('ERRO:', e && e.stack || e);
    try { await page.screenshot({ path: path.join(W, 'scratch', 'erro.png') }); } catch (_) {}
  } finally {
    if (logs.length) console.log('LOGS:\n' + logs.join('\n'));
    await ctx.close();
  }
}
module.exports = { withPage, W, URL };
