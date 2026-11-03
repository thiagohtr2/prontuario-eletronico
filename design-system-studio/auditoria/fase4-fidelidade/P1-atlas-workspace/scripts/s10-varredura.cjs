// Varredura de larguras: overflow horizontal, texto cortado, elementos fora da viewport, alvos de toque,
// tabela no celular e colunas de KPI. Rotas do app e telas públicas.
const L = require('./lib.cjs');
const WIDTHS = [320, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];
const ROUTES = {
  'dev-1': ['#/painel', '#/inicio', '#/projetos', '#/pessoas', '#/ajuda'],
  'dev-2': ['#/painel', '#/inicio', '#/projetos', '#/relatorios', '#/ajuda'],
  'dev-3': ['#/app/painel', '#/app/inicio', '#/app/projetos', '#/app/relatorios', '#/app/ajuda'],
};
const TABELA = { 'dev-1': '#/painel', 'dev-2': '#/relatorios', 'dev-3': '#/app/relatorios' };

const CHECK = () => {
  const vw = document.documentElement.clientWidth;
  const inScroller = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX) && x.scrollWidth > x.clientWidth + 1) return true; } return false; };
  const isSr = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath === 'inset(50%)' || (x.className && String(x.className).includes('sr-only'))) return true; } return false; };
  const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
  const all = [...document.querySelectorAll('body *')].filter(e => !(e instanceof SVGElement) && vis(e));
  const outside = all.filter(e => { const b = e.getBoundingClientRect(); return (b.right > vw + 1 || b.left < -1) && !inScroller(e) && !isSr(e) && getComputedStyle(e).position !== 'fixed'; }).map(e => (e.tagName + '.' + String(e.className).split(' ')[0]).slice(0, 40) + '@' + Math.round(e.getBoundingClientRect().right));
  const clipped = all.filter(e => { if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.tagName) || isSr(e)) return false; const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!hasText) return false; const s = getComputedStyle(e); return (s.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) || (['hidden', 'clip'].includes(s.overflowX) && e.scrollWidth > e.clientWidth + 2 && s.whiteSpace === 'nowrap'); }).map(e => e.textContent.trim().slice(0, 30));
  return { overflow: document.documentElement.scrollWidth - vw, outside: outside.slice(0, 6), outsideN: outside.length, clipped: clipped.slice(0, 6), clippedN: clipped.length };
};

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site]; res[site] = { app: {}, auth: {}, extra: {} };
    for (const w of WIDTHS) {
      const mob = w <= 600; const h = mob ? 844 : (w <= 820 ? 1024 : 900);
      // público
      {
        const { ctx, page } = await L.newPage(w, h, mob);
        res[site].auth[w] = {};
        for (const [k, route] of [['login', S.login], ['cadastro', S.cadastro]]) { await page.goto(S.url + route); await page.waitForTimeout(450); res[site].auth[w][k] = await page.evaluate(CHECK); }
        await ctx.close();
      }
      // app
      {
        const { ctx, page } = await L.newPage(w, h, mob);
        await L.login(page, site);
        res[site].app[w] = {};
        for (const route of ROUTES[site]) {
          await page.goto(S.url + route); await page.waitForTimeout(1100);
          res[site].app[w][route] = await page.evaluate(CHECK);
          if (w === 320 && route === ROUTES[site][0]) await page.screenshot({ path: L.shot(`${site}-varredura-320-painel.png`), fullPage: true });
        }
        if ([320, 390, 820, 1440].includes(w)) {
          await page.goto(S.url + ROUTES[site][0]); await page.waitForTimeout(1300);
          res[site].extra[w] = await page.evaluate(() => {
            const ks = [...document.querySelectorAll('main article.kpi, main .sw-kpi, main .kpi')].filter(k => k.getBoundingClientRect().height > 80 && !k.querySelector('article.kpi'));
            const cols = new Set(ks.map(k => Math.round(k.getBoundingClientRect().y))).size ? ks.filter(k => Math.round(k.getBoundingClientRect().y) === Math.round(ks[0].getBoundingClientRect().y)).length : 0;
            const valueClipped = ks.some(k => { const v = k.querySelector('[class*=value]'); return v && v.scrollWidth > v.clientWidth + 1; });
            return { kpiCols: cols, kpiMinW: ks.length ? Math.min(...ks.map(k => Math.round(k.getBoundingClientRect().width))) : null, valueClipped };
          });
          await page.goto(S.url + TABELA[site]); await page.waitForTimeout(1300);
          res[site].extra[w].table = await page.evaluate(() => {
            const t = [...document.querySelectorAll('main table')].find(x => /cliente/i.test(x.innerText));
            if (!t) { const cards = document.querySelectorAll('main [class*=card-row], main [class*=row-card], main [data-label]'); return { table: false, cardsAlt: cards.length }; }
            const vis = getComputedStyle(t).display !== 'none' && t.getBoundingClientRect().width > 0;
            let scroller = null; for (let x = t.parentElement; x && x.tagName !== 'MAIN'; x = x.parentElement) { const s = getComputedStyle(x); if (['auto', 'scroll'].includes(s.overflowX)) { scroller = { cls: String(x.className).slice(0, 30), sw: x.scrollWidth, cw: x.clientWidth }; break; } }
            const tdDisplay = t.querySelector('tbody td') ? getComputedStyle(t.querySelector('tbody td')).display : null;
            const theadVis = t.querySelector('thead') ? getComputedStyle(t.querySelector('thead')).display !== 'none' && t.querySelector('thead').getBoundingClientRect().height > 2 : null;
            const sticky = t.querySelector('tbody td:nth-child(2), tbody th') ? getComputedStyle(t.querySelector('tbody td:nth-child(2), tbody th')).position : null;
            return { table: vis, scroller, tdDisplay, theadVis, stickyCol: sticky, tableW: Math.round(t.getBoundingClientRect().width) };
          });
          if (w === 390) await page.screenshot({ path: L.shot(`${site}-tabela-390.png`) });
        }
        await ctx.close();
      }
    }
    console.log('ok', site);
  }
  L.saveJSON('s10-varredura.json', res);
  await L.close();
})();
