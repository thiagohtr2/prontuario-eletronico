// Driver: mantém um navegador Playwright aberto (perfil persistente) e executa snippets enviados via HTTP.
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const BASE = path.resolve(__dirname, '..');
(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(BASE, 'perfil'), {
    viewport: { width: 1440, height: 900 }, acceptDownloads: true, locale: 'pt-BR',
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  page.on('console', m => logs.push(`[console.${m.type()}] ${m.text()}`));
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  page.on('dialog', async d => { logs.push(`[dialog ${d.type()}] ${d.message()}`); await d.dismiss().catch(()=>{}); });
  const t0 = Date.now();
  http.createServer(async (req, res) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      if (req.url === '/quit') { res.end('bye'); await ctx.close(); process.exit(0); }
      try {
        const fn = new Function('page', 'ctx', 'BASE', 'path', 'logs', `return (async () => { ${body} })();`);
        const out = await fn(page, ctx, BASE, path, logs);
        const l = logs.splice(0);
        res.end(JSON.stringify({ ok: true, t: ((Date.now()-t0)/1000).toFixed(1), out, logs: l }, null, 1));
      } catch (e) {
        const l = logs.splice(0);
        res.end(JSON.stringify({ ok: false, t: ((Date.now()-t0)/1000).toFixed(1), err: String(e.stack || e), logs: l }, null, 1));
      }
    });
  }).listen(9377, '127.0.0.1', () => console.log('driver pronto 9377'));
})();
