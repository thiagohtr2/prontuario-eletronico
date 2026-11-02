// Driver: mantém um navegador Chromium persistente aberto e aceita trechos de JS via HTTP (porta 4399)
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname, '..');
const PERFIL = path.join(BASE, 'perfil');
const CAP = path.join(BASE, 'capturas');
const EXP = path.join(BASE, 'exportados');

(async () => {
  const ctx = await chromium.launchPersistentContext(PERFIL, {
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
    locale: 'pt-BR',
  });
  let page = ctx.pages()[0] || (await ctx.newPage());
  const logs = [];
  const hook = (p) => {
    p.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
    p.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
    p.on('dialog', async (d) => { logs.push(`[dialog ${d.type()}] ${d.message()}`); });
  };
  hook(page);
  ctx.on('page', (p) => { hook(p); logs.push('[new page] ' + p.url()); });
  const state = { ctx, get page() { return page; }, set page(p) { page = p; }, logs, CAP, EXP, fs, path };

  const server = http.createServer(async (req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const fn = new Function('S', 'page', 'ctx', 'require', `return (async () => { ${body} })();`);
        const out = await fn(state, page, ctx, require);
        const l = logs.splice(0);
        res.end(JSON.stringify({ ok: true, out, logs: l }, null, 1));
      } catch (e) {
        const l = logs.splice(0);
        res.end(JSON.stringify({ ok: false, err: String(e && e.stack || e), logs: l }, null, 1));
      }
    });
  });
  server.listen(4399, '127.0.0.1', () => console.log('driver pronto na 4399'));
})();
