// Interações em 1440x900: sombra do header, mega menu, busca (foco, Ctrl+K, setas, Esc, digitação), drawer de filtros,
// ordenação, carrinho, perfil, faixa de anúncio e anel de foco. Executado no catálogo (onde todos têm o header completo).
const { chromium, open, path } = require('./lib.cjs');
const CFG = require('./cfg.cjs');
const fs = require('fs');
const SHOT = (site, n) => path.join(__dirname, '..', 'capturas', `${site}-desktop-${n}.png`);
const hex = `(${(c => { const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return c; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('') + (p.length > 3 && p[3] < 1 ? '@' + p[3] : ''); }).toString()})`;
async function vis(page, sel) { if (!sel) return false; return page.evaluate((s) => [...document.querySelectorAll(s)].some(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.hidden; }), sel); }
async function firstVisible(page, sel) { const loc = page.locator(sel); const n = await loc.count(); for (let i = 0; i < n; i++) if (await loc.nth(i).isVisible()) return loc.nth(i); return null; }
(async () => {
  const browser = await chromium.launch();
  const res = {};
  for (const site of Object.keys(CFG)) {
    const c = CFG[site]; const R = res[site] = {};
    const { ctx, page } = await open(browser, site, 'desktop', c.catalog);
    await page.waitForTimeout(1500);
    // ---- sombra após 8 px ----
    R.shadow = await page.evaluate(async (c) => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const hdr = document.querySelector(c.header);
      const all = () => [hdr, ...hdr.querySelectorAll(':scope > *')].map(e => getComputedStyle(e).boxShadow).filter(s => s && s !== 'none');
      const before = all();
      window.scrollTo({ top: 30, behavior: 'instant' }); await sleep(500);
      const after = all(); const cls = hdr.className;
      window.scrollTo({ top: 0, behavior: 'instant' }); await sleep(300);
      return { before, after, cls };
    }, c);
    // ---- mega menu ----
    R.mega = {};
    try {
      const trig = await firstVisible(page, c.megaTrigger);
      R.mega.triggerText = trig ? (await trig.innerText()).trim() : null;
      if (trig) {
        await trig.click(); await page.waitForTimeout(400);
        R.mega.open = await vis(page, c.mega);
        R.mega.info = await page.evaluate(([c, hex]) => {
          const h = eval(hex);
          const m = document.querySelector(c.mega); if (!m) return null; const r = m.getBoundingClientRect();
          const hdr = document.querySelector(c.header).getBoundingClientRect();
          const heads = [...m.querySelectorAll('h2,h3,h4,.mega__title,[class*="title"]')].filter(e => e.getBoundingClientRect().width > 0);
          const lists = [...m.querySelectorAll('ul')].filter(e => e.getBoundingClientRect().width > 0 && e.querySelector('a'));
          const xs = [...new Set(lists.map(u => Math.round(u.getBoundingClientRect().x)))];
          const feature = m.querySelector('[class*="feature"], [class*="card"], aside');
          const ae = document.activeElement;
          return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), headerBottom: Math.round(hdr.bottom),
            heads: heads.slice(0, 6).map(e => ({ t: e.textContent.trim().slice(0, 24), tt: getComputedStyle(e).textTransform })), columnsX: xs, nLists: lists.length,
            feature: feature ? feature.innerText.replace(/\n+/g, ' / ').slice(0, 80) : null, focusInMega: m.contains(ae), focusText: ae && ae.textContent.trim().slice(0, 30),
            firstLink: (m.querySelector('a') || {}).textContent };
        }, [c, hex]);
        await page.screenshot({ path: SHOT(site, 'mega-menu') });
        await page.keyboard.press('Escape'); await page.waitForTimeout(300);
        R.mega.escCloses = !(await vis(page, c.mega));
        R.mega.focusBack = await page.evaluate((s) => { const ae = document.activeElement; return [...document.querySelectorAll(s)].includes(ae); }, c.megaTrigger);
        await trig.click(); await page.waitForTimeout(300);
        await page.mouse.click(700, 700); await page.waitForTimeout(300);
        R.mega.outsideCloses = !(await vis(page, c.mega));
        // hover
        await page.mouse.move(5, 500); await page.waitForTimeout(200);
        const bb = await trig.boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(450);
        R.mega.hoverOpens = await vis(page, c.mega);
        await page.mouse.move(5, 880); await page.waitForTimeout(500);
        // teclado
        await page.keyboard.press('Escape');
        await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
        R.mega.enterOpens = await vis(page, c.mega);
        await page.keyboard.press('Escape'); await page.waitForTimeout(200);
      }
    } catch (e) { R.mega.err = e.message; }
    // ---- busca ----
    R.search = {};
    try {
      await page.mouse.click(5, 600); await page.evaluate(() => document.activeElement && document.activeElement.blur());
      await page.keyboard.press('Control+k'); await page.waitForTimeout(300);
      R.search.ctrlK = await page.evaluate((s) => document.activeElement === document.querySelector(s), c.searchInput);
      await page.keyboard.press('Escape'); await page.waitForTimeout(200);
      await page.mouse.click(5, 600);
      const inp = page.locator(c.searchInput).first();
      await inp.click(); await page.waitForTimeout(500);
      R.search.panelOnFocus = await vis(page, c.searchPanel);
      R.search.panel = await page.evaluate(([c]) => {
        const p = document.querySelector(c.searchPanel), i = document.querySelector(c.searchInput); if (!p) return null;
        const pr = p.getBoundingClientRect(); let ir = i.getBoundingClientRect();
        const wrap = i.closest('.search-field, .search__field, .search__form, .search') ; const wr = wrap ? wrap.getBoundingClientRect() : ir;
        const heads = [...p.querySelectorAll('[class*="title"], [role=presentation], h3, h4, [class*="group"] > :first-child')].map(e => e.textContent.trim()).filter(t => t && t.length < 30);
        return { panel: { x: Math.round(pr.x), y: Math.round(pr.y), w: Math.round(pr.width), h: Math.round(pr.height) }, input: { x: Math.round(wr.x), w: Math.round(wr.width), bottom: Math.round(wr.bottom) },
          heads: [...new Set(heads)].slice(0, 8), opts: p.querySelectorAll('[role=option]').length, exp: i.getAttribute('aria-expanded'), listbox: !!p.querySelector('[role=listbox]') || p.getAttribute('role') === 'listbox' };
      }, [c]);
      await page.screenshot({ path: SHOT(site, 'busca-foco') });
      await page.keyboard.press('ArrowDown'); await page.waitForTimeout(150);
      R.search.arrow = await page.evaluate((s) => { const i = document.querySelector(s); const id = i.getAttribute('aria-activedescendant'); const el = id && document.getElementById(id); return { ad: id, sel: el ? el.getAttribute('aria-selected') : null, txt: el ? el.textContent.trim().slice(0, 30) : null }; }, c.searchInput);
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      R.search.escCloses = !(await vis(page, c.searchPanel));
      // digitação
      const name = await page.evaluate((c) => { const t = document.querySelector(c.card + ' ' + c.cardTitle); return t ? t.textContent.trim() : null; }, c);
      const term = (name || 'jiboia').split(/[\s-]/)[0].slice(0, 6);
      R.search.term = term;
      await inp.click(); await inp.fill(''); await inp.type(term, { delay: 60 }); await page.waitForTimeout(900);
      R.search.typed = await page.evaluate((c) => { const p = document.querySelector(c.searchPanel); return p ? { opts: [...p.querySelectorAll('[role=option]')].map(o => o.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)).slice(0, 6), text: p.innerText.slice(0, 200) } : null; }, c);
      await page.screenshot({ path: SHOT(site, 'busca-digitando') });
      const n0 = await page.evaluate((c) => document.querySelectorAll(c.card).length, c);
      await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
      R.search.afterEnter = await page.evaluate((c) => ({ hash: location.hash, cards: [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.querySelector(c.cardTitle) || {}).textContent).slice(0, 6), n: [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).length }), c);
      R.search.n0 = n0;
      // sem resultado
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1200);
      const inp2 = page.locator(c.searchInput).first();
      await inp2.click(); await inp2.fill('xyzqwk'); await page.waitForTimeout(800);
      R.search.emptyPanel = await page.evaluate((c) => { const p = document.querySelector(c.searchPanel); return p ? p.innerText.slice(0, 160) : null; }, c);
      await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
      R.search.emptyState = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.match(/(nenhum|nada|não encontr|sem resultado)[^\n]{0,80}/i)?.[0] || null);
      await page.screenshot({ path: SHOT(site, 'busca-vazia'), fullPage: false });
    } catch (e) { R.search.err = e.message; }
    // ---- drawer de filtros ----
    R.drawer = {};
    try {
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1500);
      const n0 = await page.evaluate((c) => [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).length, c);
      const btn = page.locator(c.filterBtn).first();
      await btn.scrollIntoViewIfNeeded(); await btn.click(); await page.waitForTimeout(600);
      R.drawer.info = await page.evaluate(([c, hex]) => {
        const h = eval(hex);
        const p = [...document.querySelectorAll(c.drawerPanel)].find(e => e.getBoundingClientRect().width > 0); if (!p) return null;
        const r = p.getBoundingClientRect(); const cs = getComputedStyle(p);
        const root = document.querySelector(c.drawer);
        const scrim = [...root.querySelectorAll('[class*="scrim"]'), root.parentElement && root.parentElement.querySelector('.overlay'), document.querySelector('.overlay')].filter(Boolean).find(e => e.getBoundingClientRect().width > 0 && e !== p);
        const title = p.querySelector('h2, h3, [id*="title"]');
        const btns = [...p.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.getAttribute('aria-label') || b.textContent).trim().replace(/\s+/g, ' ').slice(0, 30));
        const apply = [...p.querySelectorAll('button')].find(b => /aplicar/i.test(b.textContent));
        const groups = [...p.querySelectorAll('legend, h3, h4, .fgroup__title, [class*="group"] > p, [class*="fgroup"] > span')].map(e => e.textContent.trim()).filter(t => t && t.length < 40);
        const foot = apply && apply.closest('footer, [class*="foot"]');
        return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), vw: document.documentElement.clientWidth,
          role: p.getAttribute('role'), modal: p.getAttribute('aria-modal'), radius: cs.borderRadius, bg: h(cs.backgroundColor), shadow: cs.boxShadow !== 'none',
          scrim: scrim ? h(getComputedStyle(scrim).backgroundColor) : null, title: title && title.textContent.trim(), buttons: btns,
          apply: apply ? { t: apply.textContent.trim(), bg: h(getComputedStyle(apply).backgroundColor), radius: getComputedStyle(apply).borderRadius, inFoot: !!foot, footPos: foot ? getComputedStyle(foot).position : null } : null,
          groups: [...new Set(groups)].slice(0, 10), activeIn: p.contains(document.activeElement), bodyOverflow: getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.documentElement).overflow };
      }, [c, hex]);
      await page.screenshot({ path: SHOT(site, 'drawer-filtros') });
      // trap de foco
      const trap = [];
      for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); trap.push(await page.evaluate((s) => { const p = [...document.querySelectorAll(s)].find(e => e.getBoundingClientRect().width > 0); return p ? p.contains(document.activeElement) : false; }, c.drawerPanel)); }
      R.drawer.trapOk = trap.every(Boolean);
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      R.drawer.escCloses = !(await vis(page, c.drawerPanel));
      R.drawer.focusBack = await page.evaluate((s) => document.activeElement === document.querySelector(s), c.filterBtn);
      // overlay
      await btn.click(); await page.waitForTimeout(500);
      await page.mouse.click(60, 450); await page.waitForTimeout(500);
      R.drawer.overlayCloses = !(await vis(page, c.drawerPanel));
      // botão fechar
      if (!R.drawer.overlayCloses) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
      await btn.click(); await page.waitForTimeout(500);
      const closeBtn = page.locator(c.drawerPanel + ' button[aria-label*="echar" i], ' + c.drawerPanel + ' [data-close]:is(button)').first();
      if (await closeBtn.count()) { await closeBtn.click(); await page.waitForTimeout(500); R.drawer.closeBtnCloses = !(await vis(page, c.drawerPanel)); } else R.drawer.closeBtnCloses = null;
      // aplicar um filtro
      if (await vis(page, c.drawerPanel)) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
      await btn.click(); await page.waitForTimeout(500);
      const opt = page.locator(c.drawerPanel + ' .chip, ' + c.drawerPanel + ' input[type=checkbox], ' + c.drawerPanel + ' input[type=radio], ' + c.drawerPanel + ' [role=checkbox], ' + c.drawerPanel + ' button[aria-pressed]');
      const nOpt = await opt.count(); R.drawer.nOptions = nOpt;
      let clicked = null;
      for (let i = 0; i < nOpt; i++) { const o = opt.nth(i); if (await o.isVisible()) { const t = (await o.evaluate(e => (e.textContent || e.value || e.getAttribute('aria-label') || '').trim() || (e.labels && e.labels[0] ? e.labels[0].textContent.trim() : ''))); if (/todas|todos/i.test(t)) continue; await o.click(); clicked = t; break; } }
      R.drawer.clicked = clicked;
      await page.waitForTimeout(300);
      const apply = page.locator(c.drawerPanel + ' button:has-text("Aplicar")').first();
      if (await apply.count()) { R.drawer.applyText = (await apply.innerText()).trim(); await apply.click(); }
      await page.waitForTimeout(1500);
      R.drawer.afterApply = await page.evaluate((c) => [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).length, c);
      R.drawer.n0 = n0;
      R.drawer.drawerClosedAfterApply = !(await vis(page, c.drawerPanel));
      // ordenação
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1500);
      const prices = async () => page.evaluate((c) => [...document.querySelectorAll(c.card)].filter(e => e.getBoundingClientRect().width > 0).slice(0, 6).map(e => { const t = (e.querySelector(c.price) || e).textContent.match(/R\$\s*([\d.]+,\d{2})/); return t ? +t[1].replace('.', '').replace(',', '.') : null; }), c);
      const p0 = await prices();
      const sortSel = page.locator(c.sort).first();
      const opts = await sortSel.evaluate(s => [...s.options].map(o => o.value + '|' + o.textContent.trim()));
      const asc = opts.find(o => /menor/i.test(o)); if (asc) { await sortSel.selectOption(asc.split('|')[0]); await page.waitForTimeout(1500); }
      R.sort = { opts, p0, p1: await prices() };
    } catch (e) { R.drawer.err = e.message; }
    // ---- carrinho ----
    R.cart = {};
    try {
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1500);
      R.cart.badge0 = await page.evaluate((s) => { const b = document.querySelector(s); return b ? { t: b.textContent.trim(), hidden: b.hidden || getComputedStyle(b).display === 'none' } : null; }, c.cartBadge);
      // abrir produto e adicionar
      const card = page.locator(c.card).first();
      const addQuick = card.locator('button:has-text("Adicionar"), button[data-add], button[aria-label*="Adicionar"]').first();
      if (await addQuick.count() && await addQuick.isVisible()) { await addQuick.click(); R.cart.via = 'quick'; }
      else {
        await card.locator('a').first().click(); await page.waitForTimeout(1200);
        const add = page.locator('button:has-text("Adicionar à sacola"), button:has-text("Adicionar")').first();
        R.cart.via = 'produto:' + (await page.evaluate(() => location.hash));
        if (await add.count()) await add.click();
      }
      await page.waitForTimeout(1200);
      await page.screenshot({ path: SHOT(site, 'apos-adicionar') });
      R.cart.drawerAfterAdd = await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].filter(d => d.getBoundingClientRect().width > 0 && getComputedStyle(d).visibility !== 'hidden').map(d => (d.getAttribute('aria-label') || (d.querySelector('h2,h3') || {}).textContent || '').trim().slice(0, 30)));
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      R.cart.badge1 = await page.evaluate(([s, hex]) => { const h = eval(hex); const b = document.querySelector(s); return b ? { t: b.textContent.trim(), hidden: b.hidden || getComputedStyle(b).display === 'none', bg: h(getComputedStyle(b).backgroundColor), color: h(getComputedStyle(b).color), radius: getComputedStyle(b).borderRadius } : null; }, [c.cartBadge, hex]);
      await page.keyboard.press('Escape');
      await page.locator(c.cart).first().click(); await page.waitForTimeout(1000);
      R.cart.afterClick = await page.evaluate(() => ({ hash: location.hash, dialogs: [...document.querySelectorAll('[role=dialog]')].filter(d => d.getBoundingClientRect().width > 0 && getComputedStyle(d).visibility !== 'hidden').map(d => (d.getAttribute('aria-label') || (d.querySelector('h2,h3') || {}).textContent || '').trim().slice(0, 30)) }));
      await page.screenshot({ path: SHOT(site, 'sacola') });
      await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    } catch (e) { R.cart.err = e.message; }
    // ---- perfil ----
    R.profile = {};
    try {
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1200);
      await page.locator(c.avatarBtn).first().click(); await page.waitForTimeout(500);
      R.profile.text = await page.evaluate(() => { const p = [...document.querySelectorAll('.popover, [class*="account"], [role=menu], [role=dialog]')].find(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden'); return p ? p.innerText.replace(/\n+/g, ' / ').slice(0, 200) : null; });
      await page.screenshot({ path: SHOT(site, 'perfil') });
      await page.keyboard.press('Escape');
    } catch (e) { R.profile.err = e.message; }
    // ---- faixa de anúncio ----
    R.announce = {};
    try {
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1200);
      await page.locator(c.announceClose).first().click(); await page.waitForTimeout(600);
      R.announce = await page.evaluate((c) => ({ visible: (() => { const a = document.querySelector(c.announce); if (!a) return null; const r = a.getBoundingClientRect(); return r.height > 1 && getComputedStyle(a).display !== 'none' && !a.hidden; })(), headerTop: Math.round(document.querySelector(c.header).getBoundingClientRect().top) }), c);
    } catch (e) { R.announce.err = e.message; }
    // ---- anel de foco ----
    try {
      await page.goto(page.url().split('#')[0] + c.catalog); await page.waitForTimeout(1200);
      await page.mouse.click(5, 5);
      const rings = [];
      for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); rings.push(await page.evaluate(hex => { const h = eval(hex); const e = document.activeElement; const cs = getComputedStyle(e); return { el: e.tagName + '.' + (e.className || '').toString().split(' ')[0], outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + h(cs.outlineColor), shadow: cs.boxShadow.slice(0, 80) }; }, hex)); }
      R.focus = rings;
      await page.screenshot({ path: SHOT(site, 'foco-teclado') });
    } catch (e) { R.focusErr = e.message; }
    console.log(site, 'erros de página:', page._errs.slice(0, 3));
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'resultados', 'm02-desktop-interacoes.json'), JSON.stringify(res, null, 1));
  await browser.close();
})();
