// Gera capturas de tela das rotas em algumas larguras (pasta tests/.shots, descartável).
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
const out = path.join(__dirname, '.shots');
fs.mkdirSync(out, { recursive: true });
const sizes = (process.env.SIZES || '1280x800,390x844').split(',').map(s => s.split('x').map(Number));
const routes = (process.env.ROUTES || '#/entrar,#/painel').split(',');
const full = process.env.FULL === '1';
(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(url);
    for (const r of routes) {
      const auth = /entrar|cadastro|recuperar/.test(r);
      await page.evaluate(([hh, auth]) => {
        if (auth) { localStorage.clear(); sessionStorage.clear(); }
        else sessionStorage.setItem('atlas.session', JSON.stringify({ name: 'Marina Costa', email: 'marina@atlas.app', role: 'Gerente de produto' }));
        location.hash = hh;
      }, [r, auth]);
      await page.waitForTimeout(1200);
      const name = `${w}-${r.replace(/[#/?=&]+/g, '_')}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: full });
    }
    await page.close();
  }
  await browser.close();
  console.log('ok');
})();
