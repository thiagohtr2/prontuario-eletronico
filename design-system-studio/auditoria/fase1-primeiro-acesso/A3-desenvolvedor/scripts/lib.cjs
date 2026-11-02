const { chromium } = require('playwright');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase1-primeiro-acesso/A3-desenvolvedor';
async function open(vp = { width: 1920, height: 1080 }) {
  const ctx = await chromium.launchPersistentContext(W + '/perfil', { viewport: vp, acceptDownloads: true });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() !== 'debug') logs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  return { ctx, page, logs };
}
async function shot(page, name, full = false) { await page.screenshot({ path: W + '/capturas/' + name + '.png', fullPage: full }); }
async function aria(page, sel = 'main') { try { return await page.locator(sel).first().ariaSnapshot(); } catch (e) { return 'ARIA-ERR ' + e.message; } }
module.exports = { open, shot, aria, W };
