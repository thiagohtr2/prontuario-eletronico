// Verifica overflow horizontal em todas as telas e larguras de referência (320–1920 px).
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
const widths = [320, 333, 344, 360, 375, 390, 412, 430, 480, 600, 700, 767, 768, 820, 1000, 1024, 1100, 1279, 1280, 1366, 1440, 1920];
const routes = ['feed', 'explorar', 'salvos', 'perfil', 'perfil/bruno', 'grupos', 'eventos', 'mensagens', 'mensagens/c1', 'notificacoes', 'configuracoes', 'ajuda', 'post/p1'];
(async () => {
  const browser = await chromium.launch();
  let bad = 0;
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 700 : 900 }, hasTouch: w < 768, isMobile: w < 768 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    async function measure(label) {
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const over = [];
        const vw = de.clientWidth;
        document.querySelectorAll('body *').forEach(el => {
          if (el.closest('[hidden]') || el.closest('svg') || el.closest('.sr-only')) return;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.position === 'fixed' && el.closest('.drawer')) return;
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) return;
          if (el.closest('.stories, .tabs--pill, .thread__msgs')) return; // rolagem horizontal local
          if (b.right > vw + 1 || b.left < -1) over.push(el.tagName.toLowerCase() + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + ' [' + Math.round(b.left) + ',' + Math.round(b.right) + ']');
        });
        return { sw: de.scrollWidth, cw: vw, over: over.slice(0, 5) };
      });
      if (r.sw > r.cw || r.over.length) { bad++; console.log(`FALHA w=${w} ${label}: scrollWidth=${r.sw} clientWidth=${r.cw} ${r.over.join(' | ')}`); }
    }
    await page.goto(url);
    await measure('login-entrar');
    await page.check('#mode-phone', { force: true }).catch(() => page.click('label[for="mode-phone"]'));
    await measure('login-telefone');
    await page.click('#tab-cadastro'); await measure('cadastro');
    await page.click('#btn-signup'); await measure('cadastro-erros');
    await page.click('#tab-entrar'); await page.click('#link-forgot'); await measure('recuperar');
    await page.click('#link-back-login');
    await page.click('#btn-login'); await measure('login-erros');
    await page.click('label[for="mode-email"]');
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'Conecta123'); await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])');
    for (const r of routes) {
      await page.evaluate(h => { location.hash = '#/' + h; }, r);
      await page.waitForTimeout(w > 1000 ? 900 : 800);
      await measure(r);
    }
    if (errs.length) { bad++; console.log('pageerror', w, errs); }
    await ctx.close();
  }
  console.log(bad ? `TOTAL DE FALHAS: ${bad}` : 'OK: sem overflow horizontal em nenhuma tela/largura');
  await browser.close();
})();
