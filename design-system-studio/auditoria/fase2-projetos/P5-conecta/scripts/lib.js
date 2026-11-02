// Helper: abre o perfil persistente, executa uma função e fecha.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.resolve(__dirname, '..');
const PERFIL = path.join(BASE, 'perfil');
const CAP = path.join(BASE, 'capturas');
const EXP = path.join(BASE, 'exportados');
const TMP = path.join(BASE, 'scripts', 'tmp');
fs.mkdirSync(TMP, { recursive: true });

async function run(fn, opts = {}) {
  const ctxOpts = {
    viewport: opts.viewport || { width: 1440, height: 900 },
    acceptDownloads: true,
    locale: 'pt-BR',
  };
  if (opts.mobile) {
    Object.assign(ctxOpts, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  }
  const ctx = await chromium.launchPersistentContext(PERFIL, ctxOpts);
  const page = ctx.pages()[0] || (await ctx.newPage());
  const logs = [];
  page.on('console', (m) => { if (m.type() !== 'debug') logs.push(`[console.${m.type()}] ${m.text()}`); });
  page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
  page.on('dialog', async (d) => { logs.push(`[dialog ${d.type()}] ${d.message()}`); if (opts.dialog === 'dismiss') await d.dismiss(); else await d.accept(opts.prompt || undefined); });
  const shot = async (name, o = {}) => { const p = path.join(o.dir || TMP, name.endsWith('.png') ? name : name + '.png'); await (o.el ? o.el.screenshot({ path: p }) : page.screenshot({ path: p, fullPage: !!o.full })); return p; };
  try {
    if (!opts.noGoto) await page.goto(opts.url || 'http://127.0.0.1:4300/', { waitUntil: 'networkidle' });
    const out = await fn({ page, ctx, shot, CAP, EXP, TMP, logs, fs, path });
    if (out !== undefined) console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1));
  } catch (e) {
    console.log('ERRO:', e.message);
    try { await page.screenshot({ path: path.join(TMP, 'erro.png') }); } catch {}
  } finally {
    if (logs.length) console.log('--- logs ---\n' + logs.join('\n'));
    await ctx.close();
  }
}
module.exports = { run, BASE, CAP, EXP, TMP };
