// Daemon: mantém um navegador Chromium aberto (perfil persistente) e executa
// trechos de JS recebidos via HTTP (POST /eval) com `page`, `ctx`, `W` no escopo.
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const W = path.resolve(__dirname, '..');
(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(W, 'perfil'), {
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
  });
  let page = ctx.pages()[0] || (await ctx.newPage());
  const logs = [];
  const hook = (p) => {
    p.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
    p.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
    p.on('dialog', async (d) => { logs.push(`[dialog ${d.type()}] ${d.message()}`); try { await d.accept(); } catch (e) {} });
  };
  hook(page);
  ctx.on('page', (p) => { hook(p); logs.push('[newpage] ' + p.url()); });
  const state = {};
  http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        if (req.url === '/logs') { res.end(logs.splice(0).join('\n')); return; }
        if (req.url === '/quit') { res.end('bye'); await ctx.close(); process.exit(0); }
        const fn = new Function('page', 'ctx', 'W', 'state', 'logs', 'setPage', `return (async () => { ${body} })();`);
        const out = await fn(page, ctx, W, state, logs, (p) => { page = p; });
        res.end(typeof out === 'string' ? out : JSON.stringify(out, null, 2) ?? 'undefined');
      } catch (e) {
        res.statusCode = 500;
        res.end('ERR: ' + (e && e.stack || e));
      }
    });
  }).listen(4391, '127.0.0.1', () => console.log('daemon ready'));
})();
