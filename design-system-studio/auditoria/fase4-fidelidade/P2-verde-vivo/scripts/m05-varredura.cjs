// Varredura de larguras (320–1920): overflow horizontal, texto cortado, arquitetura visível (dock/linha 2/hambúrguer),
// menu "Mais" (1024/1280), largura do conteúdo (1920) e alvos de toque refinados (exclui link estendido do card).
const { chromium, SITES, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
const W = [320, 360, 375, 390, 412, 430, 480, 600, 767, 768, 820, 1024, 1280, 1440, 1920];
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site]; res[site] = {};
    for (const [nome, hash] of [['landing', c.landing], ['catalogo', c.catalog]]) {
      for (const w of W) {
        const mobile = w < 768;
        const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: site === 'dev-3' ? 'reduce' : 'no-preference' });
        const p = await ctx.newPage(); await p.goto(SITES[site] + hash); await p.waitForTimeout(1100);
        await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); } window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 300)); });
        const o = await p.evaluate((c) => {
          const de = document.documentElement; const vw = de.clientWidth;
          const vis = s => s ? [...document.querySelectorAll(s)].some(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.closest('[hidden]'); }) : false;
          // elementos que ultrapassam a viewport (causadores de overflow)
          const over = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); if (r.width === 0) return false; let a = e; while (a && a !== document.body) { const ox = getComputedStyle(a).overflowX; if (a !== e && /hidden|auto|scroll|clip/.test(ox)) return false; a = a.parentElement; } return r.right > vw + 1 || r.left < -1; }).slice(0, 4).map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' ' + Math.round(e.getBoundingClientRect().left) + '..' + Math.round(e.getBoundingClientRect().right));
          // texto cortado: elementos folha com overflow hidden e scrollWidth > clientWidth sem reticências
          const cut = [...document.querySelectorAll('body *')].filter(e => { if (!e.textContent.trim() || e.children.length > 2) return false; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || e.closest('[hidden], .sr-only, .visually-hidden')) return false; const clip = /hidden|clip/.test(cs.overflowX) || /hidden|clip/.test(cs.overflow); return clip && e.scrollWidth > e.clientWidth + 2 && cs.textOverflow !== 'ellipsis' && e.clientWidth > 0 && !/scroll|auto/.test(cs.overflowX); }).slice(0, 5).map(e => e.tagName + '.' + (e.className || '').toString().split(' ')[0] + ' "' + e.textContent.trim().slice(0, 30) + '" ' + e.scrollWidth + '>' + e.clientWidth);
          const nav = [...document.querySelectorAll(c.navItems)].filter(li => li.getBoundingClientRect().width > 0 && getComputedStyle(li).display !== 'none').map(li => li.innerText.trim().slice(0, 14));
          const more = [...document.querySelectorAll('button')].filter(bt => /^mais/i.test(bt.textContent.trim()) && bt.getBoundingClientRect().width > 0).map(bt => bt.textContent.trim().slice(0, 20));
          const row2 = document.querySelector(c.row2); const r2 = row2 && row2.getBoundingClientRect();
          const navScroll = row2 ? [...row2.querySelectorAll('*')].filter(e => /auto|scroll/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 2).length : 0;
          const grid = document.querySelector(c.grid); const cards = [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0);
          let cols = null; if (cards.length) { const y0 = Math.round(cards[0].getBoundingClientRect().y); cols = cards.filter(e => Math.abs(Math.round(e.getBoundingClientRect().y) - y0) < 4).length; }
          const mainBox = document.querySelector(c.heroSection) || grid; const cont = mainBox ? Math.round(mainBox.getBoundingClientRect().width) : null;
          const firstRow1 = document.querySelector(c.row1); const r1 = firstRow1 && firstRow1.getBoundingClientRect();
          return { vw, sw: de.scrollWidth, overflow: de.scrollWidth > vw + 1, over, cut, dock: vis(c.dock), row2: !!(r2 && r2.height > 0 && getComputedStyle(row2).display !== 'none'), row1: !!(r1 && r1.height > 0), strip: vis(c.strip), hamburger: vis(c.hamburger), nav, more, navScroll, cols, cont, gridW: grid ? Math.round(grid.getBoundingClientRect().width) : null };
        }, c);
        if (w === 390) {
          o.targets = await p.evaluate(() => {
            const ext = e => { for (const pe of ['::after', '::before']) { const cs = getComputedStyle(e, pe); if (cs.content !== 'none' && cs.position === 'absolute' && (cs.inset === '0px' || (cs.top === '0px' && cs.left === '0px'))) return true; } return false; };
            const els = [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [role=button], [role=tab]')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden], [aria-hidden="true"], .sr-only, .visually-hidden') && !e.classList.contains('skip-link'); });
            const small = els.filter(e => { const r = e.getBoundingClientRect(); return (r.width < 43.5 || r.height < 43.5) && !ext(e); });
            const inline = small.filter(e => { const pe = e.parentElement; return pe && /^(P|SPAN|LI)$/.test(pe.tagName) && pe.textContent.trim().length > e.textContent.trim().length + 10; });
            return { total: els.length, small: small.length, inlineInText: inline.length, list: small.slice(0, 30).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()} "${(e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 22)}" ${Math.round(r.width)}x${Math.round(r.height)}`; }) };
          });
        }
        if ([320, 768, 820, 1024, 1920].includes(w)) await p.screenshot({ path: path.join(__dirname, '..', 'capturas', `${site}-w${w}-${nome}.png`) });
        res[site][`${nome}@${w}`] = o;
        await ctx.close();
      }
    }
    console.log(site, 'ok');
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm05-varredura.json'), JSON.stringify(res, null, 1));
  await b.close();
})();
