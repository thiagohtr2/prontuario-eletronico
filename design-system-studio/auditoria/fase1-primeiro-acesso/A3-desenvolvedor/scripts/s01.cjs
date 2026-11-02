const { chromium } = require('playwright');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase1-primeiro-acesso/A3-desenvolvedor';
(async () => {
  const ctx = await chromium.launchPersistentContext(W + '/perfil', { viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => logs.push(m.type() + ': ' + m.text()));
  page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await page.goto('http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
  console.log('TITLE', await page.title(), page.url());
  await page.screenshot({ path: W + '/capturas/01-inicio-1920.png' });
  await page.screenshot({ path: W + '/capturas/01-inicio-1920-full.png', fullPage: true });
  console.log(await page.locator('body').ariaSnapshot());
  console.log('LOGS', logs.join('\n'));
  await ctx.close();
})();
