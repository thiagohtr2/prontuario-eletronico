// Medições estáticas em 1440x900 (landing + catálogo): header, hero, cartões, citação, imagem sangrando, cores e fontes.
const { chromium, open, scrollThrough, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
const HELP = () => {
  window.__h = {
    hex(c) { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); const h = p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); return '#' + h + (p.length > 3 && p[3] < 1 ? '@' + p[3] : ''); },
    q(s) { if (!s) return null; for (const e of document.querySelectorAll(s)) { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); if (cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0) return e; } return null; },
    r(e) { if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), vy: Math.round(r.y) }; },
    st(e, props) { if (!e) return null; const cs = getComputedStyle(e); const o = {}; for (const p of props) { let v = cs.getPropertyValue(p); if (/color/.test(p)) v = window.__h.hex(v); o[p] = v; } return o; },
  };
};
(async () => {
  const browser = await chromium.launch();
  const res = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site]; const R = res[site] = {};
    // ---------- LANDING ----------
    let { ctx, page } = await open(browser, site, 'desktop', c.landing);
    await page.evaluate(HELP);
    await scrollThrough(page);
    R.landing = await page.evaluate((c) => {
      const { q, r, st } = window.__h; const o = {};
      o.vw = document.documentElement.clientWidth;
      o.body = st(document.body, ['background-color', 'color', 'font-family', 'font-size', 'font-weight']);
      o.htmlBg = st(document.documentElement, ['background-color']);
      const main = q('main'); o.mainBg = st(main, ['background-color']);
      o.announce = { r: r(q(c.announce)), st: st(q(c.announce), ['background-color', 'color']), link: !!(q(c.announce) && q(c.announce).querySelector('a')), close: r(q(c.announceClose)) };
      const hdr = q(c.landingHeader || c.header);
      o.headerUsed = c.landingHeader && q(c.landingHeader) ? 'landingHeader' : 'header';
      o.header = { r: r(hdr), st: st(hdr, ['position', 'top', 'z-index', 'background-color', 'box-shadow', 'border-bottom-width']) };
      o.row1 = r(q(c.row1)); o.row2 = r(q(c.row2));
      o.logoMark = { r: r(q(c.logoMark)), st: st(q(c.logoMark), ['background-color', 'border-radius']) };
      o.logoName = { text: q(c.logoName) && q(c.logoName).textContent.trim(), st: st(q(c.logoName), ['font-family', 'font-weight', 'font-size']) };
      const brandTexts = [...document.querySelectorAll('header, footer, .l-header')].map(e => e.innerText).join(' ');
      o.brandFolhaViva = (document.body.innerText.match(/Folha Viva/g) || []).length;
      o.brandVerdeVivo = (document.body.innerText.match(/Verde Vivo/g) || []).length;
      o.search = { r: r(q(c.searchInput)), st: st(q(c.searchInput), ['background-color', 'border-top-width', 'border-top-color', 'border-radius', 'font-size']), placeholder: q(c.searchInput) && q(c.searchInput).placeholder, icon: r(q(c.searchIcon)), kbd: q(c.kbd) && q(c.kbd).textContent.trim() };
      o.addr = !!q(c.addr); o.avatar = !!q(c.avatarBtn); o.fav = !!q(c.fav); o.cart = !!q(c.cart);
      o.nav = [...document.querySelectorAll(c.navItems)].filter(li => getComputedStyle(li).display !== 'none' && li.getBoundingClientRect().width > 0).map(li => {
        const a = li.querySelector('a,button'); const s = a ? getComputedStyle(a) : null;
        return { t: li.innerText.trim().slice(0, 24), x: Math.round(li.getBoundingClientRect().x), cur: a && (a.getAttribute('aria-current') || a.getAttribute('aria-expanded')), color: s && window.__h.hex(s.color), fw: s && s.fontWeight };
      });
      // hero
      const ht = q(c.heroTitle), em = q(c.heroEm), tall = q(c.heroTall), small = q(c.heroSmall), cta = q(c.heroCta), sec = q(c.heroSection);
      o.hero = { sec: r(sec), title: r(ht), titleSt: st(ht, ['font-family', 'font-weight', 'font-size', 'line-height']), em: st(em, ['color', 'font-style', 'font-family']),
        tall: r(tall), tallSt: st(tall, ['border-radius', 'border-top-left-radius']), small: r(small), cta: r(cta), ctaSt: st(cta, ['background-color', 'color', 'border-top-width', 'text-decoration-line']), ctaText: cta && cta.innerText.trim(), ctaHasSvg: !!(cta && cta.querySelector('svg')) };
      o.stagger = [...document.querySelectorAll(c.stagger)].map(e => r(e));
      o.staggerSt = st(document.querySelector(c.stagger), ['border-radius', 'border-top-width', 'border-top-color', 'box-shadow', 'background-color']);
      const qt = q(c.quoteText), qa = q(c.quoteAuthor);
      o.quote = { text: r(qt), author: r(qa), authorSt: st(qa, ['text-align']), textSt: st(qt, ['font-family', 'font-style']) };
      o.bleed = r(q(c.bleedMedia));
      const fin = q(c.final); o.final = { r: r(fin), st: st(fin, ['text-align']), h: st(fin && fin.querySelector('h2'), ['text-align', 'font-family']) };
      o.h2 = st(document.querySelector('main h2'), ['font-family', 'font-weight', 'font-size']);
      o.h3 = st(document.querySelector('main h3'), ['font-family', 'font-weight', 'font-size']);
      o.p = st(document.querySelector('main p'), ['font-family', 'font-size', 'color']);
      // sections order (top-level children of main or of view)
      const root = document.querySelector('#view-home') || document.querySelector('.landing') || document.querySelector('#landing-main') || main;
      o.sections = [...root.children].filter(e => getComputedStyle(e).display !== 'none').map(e => (e.tagName + '.' + (e.className || '').toString().split(' ')[0]) + ' y=' + Math.round(e.getBoundingClientRect().y + scrollY) + ' h=' + Math.round(e.getBoundingClientRect().height));
      // footer
      const ft = q('footer'); o.footer = { r: r(ft), st: st(ft, ['background-color', 'color']), text: ft && ft.innerText.slice(0, 160) };
      // password / login
      o.password = document.querySelectorAll('input[type=password]').length;
      // fictitious words
      const txt = document.body.innerText;
      o.ficticios = ['Empório Murici', 'Linho & Cia', 'Orla', 'Eletrônicos', 'Mercado', 'Feminino', 'Masculino', 'Folha Viva'].map(w => [w, (txt.match(new RegExp(w, 'g')) || []).length]);
      return o;
    }, c);
    // sticky + sombra + linha 2 recolhe
    R.landing.scroll = await page.evaluate(async (c) => {
      const { q, r, st } = window.__h; const sleep = ms => new Promise(r => setTimeout(r, ms));
      const hdr = q(c.landingHeader || c.header); const row2 = q(c.row2);
      const before = st(hdr, ['box-shadow']);
      window.scrollTo({ top: 20, behavior: 'instant' }); await sleep(400);
      const at20 = st(hdr, ['box-shadow']);
      window.scrollTo({ top: 600, behavior: 'instant' }); await sleep(250);
      window.scrollTo({ top: 900, behavior: 'instant' }); await sleep(500);
      const hr = hdr.getBoundingClientRect();
      const r2 = row2 ? row2.getBoundingClientRect() : null;
      const down = { hdrTop: Math.round(hr.top), hdrH: Math.round(hr.height), row2H: r2 && Math.round(r2.height), row2Bottom: r2 && Math.round(r2.bottom), row2Vis: row2 && getComputedStyle(row2).visibility, row2Op: row2 && getComputedStyle(row2).opacity, row2Tr: row2 && getComputedStyle(row2).transform };
      window.scrollTo({ top: 700, behavior: 'instant' }); await sleep(250);
      window.scrollTo({ top: 500, behavior: 'instant' }); await sleep(600);
      const r3 = row2 ? row2.getBoundingClientRect() : null; const hr2 = hdr.getBoundingClientRect();
      const up = { hdrTop: Math.round(hr2.top), hdrH: Math.round(hr2.height), row2H: r3 && Math.round(r3.height), row2Bottom: r3 && Math.round(r3.bottom), row2Vis: row2 && getComputedStyle(row2).visibility, row2Op: row2 && getComputedStyle(row2).opacity, row2Tr: row2 && getComputedStyle(row2).transform };
      window.scrollTo({ top: 0, behavior: 'instant' }); await sleep(300);
      return { shadowTop: before['box-shadow'], shadowAt20: at20['box-shadow'], down, up };
    }, c);
    await page.screenshot({ path: path.join(__dirname, '..', 'capturas', `${site}-desktop-landing-rolada.png`) }).catch(() => {});
    await ctx.close();
    // ---------- CATÁLOGO ----------
    ({ ctx, page } = await open(browser, site, 'desktop', c.catalog));
    await page.evaluate(HELP); await page.waitForTimeout(1500);
    await scrollThrough(page);
    R.catalog = await page.evaluate((c) => {
      const { q, r, st } = window.__h; const o = {};
      o.header = { r: r(q(c.header)), row1: r(q(c.row1)), row2: r(q(c.row2)) };
      o.search = { r: r(q(c.searchInput)), st: st(q(c.searchInput), ['background-color', 'border-top-width', 'border-radius', 'font-size', 'height']), wrapSt: st(q(c.searchInput) && q(c.searchInput).parentElement, ['background-color', 'border-top-width', 'border-radius']), placeholder: q(c.searchInput) && q(c.searchInput).placeholder, icon: r(q(c.searchIcon)), kbd: q(c.kbd) && q(c.kbd).textContent.trim(), role: q(c.searchInput) && q(c.searchInput).getAttribute('role'), exp: q(c.searchInput) && q(c.searchInput).getAttribute('aria-expanded') };
      const cards = [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0);
      o.nCards = cards.length;
      const firstRowY = cards.length ? Math.round(cards[0].getBoundingClientRect().y) : 0;
      o.cols = cards.filter(e => Math.abs(Math.round(e.getBoundingClientRect().y) - firstRowY) < 4).length;
      const card = cards[0];
      if (card) {
        const m = card.querySelector(c.cardMedia); const mr = m && m.getBoundingClientRect();
        o.card = { r: r(card), st: st(card, ['border-radius', 'border-top-width', 'border-top-style', 'border-top-color', 'box-shadow', 'background-color', 'transition-duration', 'transition-property']),
          media: mr && { w: Math.round(mr.width), h: Math.round(mr.height), ratio: +(mr.width / mr.height).toFixed(3) },
          order: [...card.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim()).slice(0, 8).map(e => e.textContent.trim().slice(0, 30)),
          tag: (card.querySelector(c.cardTag) || {}).textContent, title: st(card.querySelector(c.cardTitle), ['font-family', 'font-weight', 'font-size']),
          text: card.querySelector(c.cardText) && card.querySelector(c.cardText).textContent.trim().slice(0, 80), textLines: (() => { const t = card.querySelector(c.cardText); if (!t) return null; const cs = getComputedStyle(t); return { h: t.getBoundingClientRect().height, lh: cs.lineHeight, clamp: cs.webkitLineClamp }; })(),
          price: card.querySelector(c.price) && card.querySelector(c.price).textContent.trim(), html: card.innerText.replace(/\n+/g, ' | ').slice(0, 200),
          btn: (() => { const b = card.querySelector(c.cardBtn); return b && { text: b.textContent.trim(), r: r(b), st: st(b, ['background-color', 'color', 'border-radius', 'height', 'font-size']) }; })(),
          nested: card.querySelectorAll('a a, a button, button a, button button').length,
          interactives: [...card.querySelectorAll('a,button')].map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 30)),
          svgs: card.querySelectorAll('svg').length, leafIcon: !!card.querySelector('use[href*="leaf" i], [class*="leaf" i]'),
        };
      }
      // categorias do template (blocos com imagem e nome sobreposto)
      o.catTiles = [...document.querySelectorAll('.cat-tile, [class*="cat-tile"]')].filter(e => e.getBoundingClientRect().width > 0).length;
      o.sectionsCatalog = [...(document.querySelector('#view-catalogo main, #main, main') || document.body).querySelectorAll(':scope > section, :scope > div > section')].map(s => (s.className || '').toString().split(' ')[0] + ':' + ((s.querySelector('h1,h2') || {}).textContent || '').trim().slice(0, 30));
      o.filterBtn = { r: r(q(c.filterBtn)), text: q(c.filterBtn) && q(c.filterBtn).innerText.trim() };
      o.sort = !!q(c.sort);
      o.toolbarY = q(c.filterBtn) ? Math.round(q(c.filterBtn).getBoundingClientRect().y + scrollY) : null;
      o.gridY = cards.length ? Math.round(cards[0].getBoundingClientRect().y + scrollY) : null;
      o.badges = [...document.querySelectorAll(c.card)].slice(0, 30).map(e => (e.querySelector(c.cardTag) || {}).textContent || '').filter(Boolean);
      o.parcel = cards.filter(e => /\dx/.test(e.innerText)).length;
      // botões primários fora do card
      const prim = [...document.querySelectorAll('button, a')].filter(e => /primary/.test(e.className) && e.getBoundingClientRect().width > 0).slice(0, 5).map(e => ({ t: e.textContent.trim().slice(0, 20), st: st(e, ['background-color', 'color', 'border-radius']) }));
      o.primaryButtons = prim;
      o.containerW = (() => { const g = document.querySelector(c.grid); return g ? Math.round(g.getBoundingClientRect().width) : null; })();
      return o;
    }, c);
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm01-desktop-estatico.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1).slice(0, 200));
  await browser.close();
})();
