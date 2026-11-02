const { chromium } = require('playwright');
const path = require('path');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P3-nexo-capital';
async function open(opts = {}) {
  const ctx = await chromium.launchPersistentContext(path.join(W, 'perfil'), {
    viewport: { width: 1440, height: 900 }, acceptDownloads: true, ...opts,
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('[console.error]', m.text()); });
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('dialog', async d => { console.log('[dialog]', d.type(), d.message()); await d.accept(); });
  return { ctx, page, W };
}
module.exports = { open, W };
