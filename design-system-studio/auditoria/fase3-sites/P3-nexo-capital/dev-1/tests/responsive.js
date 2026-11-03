// Verifica overflow horizontal em todas as larguras de referência e páginas principais.
const { chromium } = require('playwright');
const path = require('path');
const WIDTHS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 700, 768, 820, 900, 1024, 1100, 1280, 1366, 1440, 1600, 1920];
const ROUTES = ['#/entrar', '#/recuperar-senha', '#/painel/visao-geral', '#/painel/aquisicao', '#/painel/retencao', '#/painel/receita', '#/contratos', '#/fornecedores', '#/compras', '#/colaboradores', '#/folha', '#/auditoria', '#/permissoes', '#/perfil', '#/configuracoes', '#/ajuda'];
(async () => {
  const browser = await chromium.launch();
  const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
  const problems = [];
  const errors = [];
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 740 : 800 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(w + ' pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(w + ' console: ' + m.text()); });
    await page.goto(base);
    await page.evaluate(() => sessionStorage.setItem('nexo.session', JSON.stringify({ user: 'x', method: 'senha', at: Date.now() })));
    for (const r of ROUTES) {
      await page.evaluate(h => { location.hash = h; }, r);
      await page.waitForTimeout(r.startsWith('#/painel') || r.length > 12 ? 1100 : 300);
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        // elementos que ultrapassam a viewport
        const off = [];
        document.querySelectorAll('body *').forEach(el => {
          if (!el.getClientRects().length) return;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' || el.closest('.drawer, .tooltip, .toast-region, .sr-only, .tbl-wrap, .hdr-tabs, .tbl-tabs')) return;
          const b = el.getBoundingClientRect();
          if (b.right > vw + 1 && b.width > 0) off.push(el.tagName.toLowerCase() + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + ' r=' + Math.round(b.right));
        });
        const tw = document.querySelector('.hdr-tabs');
        const tabsScroll = tw && tw.getClientRects().length ? tw.scrollWidth - tw.clientWidth : 0;
        return { vw, sw, off: off.slice(0, 5), tabsScroll };
      });
      if (res.sw > res.vw || res.off.length) problems.push(`${w} ${r}: scrollWidth ${res.sw} > ${res.vw} ${res.off.join(' | ')}`);
      if (res.tabsScroll > 0) problems.push(`${w} ${r}: abas do header rolando (${res.tabsScroll}px)`);
    }
    await ctx.close();
  }
  console.log(problems.length ? problems.join('\n') : 'Sem overflow horizontal em ' + WIDTHS.length + ' larguras x ' + ROUTES.length + ' rotas.');
  console.log(errors.length ? errors.join('\n') : 'Sem erros de console.');
  await browser.close();
})();
