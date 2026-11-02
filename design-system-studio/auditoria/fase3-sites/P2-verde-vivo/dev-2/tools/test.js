// Testes de fumaça com Playwright (abre index.html via file://). Uso: node tools/test.js
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const widths = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920, 900, 1150];
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALHOU:', m); } else console.log('ok:', m); };

(async () => {
  const b = await chromium.launch();

  // 1) Sem overflow horizontal e sem erros de console
  for (const hash of ['#/', '#/catalogo', '#/cuidados']) {
    for (const w of widths) {
      const ctx = await b.newContext({ viewport: { width: w, height: 800 } });
      const p = await ctx.newPage();
      const errs = [];
      p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      p.on('pageerror', e => errs.push(e.message));
      await p.goto(URL + hash);
      await p.waitForTimeout(900);
      await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
      const ov = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bw: document.body.scrollWidth }));
      ok(ov.sw <= ov.cw && ov.bw <= ov.cw, `sem overflow ${hash} @${w} (${ov.sw}/${ov.cw})`);
      ok(errs.length === 0, `sem erros ${hash} @${w} ${errs.join('|')}`);
      await ctx.close();
    }
  }
  await b.close();
  console.log(fails ? `\n${fails} falhas` : '\ntudo ok');
  process.exit(fails ? 1 : 0);
})();
