// Infra: mantém um navegador Chromium persistente aberto e executa trechos JS enviados via HTTP local.
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P2-verde-vivo';
const PORT = 9341;

(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(W, 'perfil'), {
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
    downloadsPath: path.join(W, 'perfil-downloads-tmp'),
  });
  let page = ctx.pages()[0] || await ctx.newPage();
  const logs = [];
  const attach = (p) => {
    p.on('console', m => logs.push(`[console.${m.type()}] ${m.text()}`));
    p.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
    p.on('dialog', async d => { logs.push(`[dialog ${d.type()}] ${d.message()}`); });
  };
  attach(page);
  ctx.on('page', p => { attach(p); logs.push('[newpage] ' + p.url()); });
  const state = { ctx, get page() { return page; }, set page(p) { page = p; }, logs, W, path, fs: require('fs') };
  const server = http.createServer(async (req, res) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const fn = new Function('S', 'page', 'ctx', 'W', 'fs', 'path', `return (async () => { ${body} })();`);
        const out = await fn(state, page, ctx, W, state.fs, path);
        const lg = logs.splice(0);
        res.end(JSON.stringify({ ok: true, out, logs: lg }, null, 1));
      } catch (e) {
        const lg = logs.splice(0);
        res.end(JSON.stringify({ ok: false, err: String(e && e.stack || e), logs: lg }, null, 1));
      }
    });
  });
  server.listen(PORT, '127.0.0.1', () => console.log('daemon on', PORT));
})();
