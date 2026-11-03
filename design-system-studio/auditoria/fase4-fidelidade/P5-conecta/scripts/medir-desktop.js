// Medições no desktop (1440x900, 1280, 1024) e tablet (768x1024, 820).
// Uso: node medir-desktop.js dev-1
const { chromium, CFG, CAP, DATA, newCtx, openLogin, login, fs } = require('./lib');
const site = process.argv[2];
const c = CFG[site];
const R = { site };
const step = async (name, fn) => { try { R[name] = await fn(); } catch (e) { R[name] = { ERRO: e.message.split('\n')[0] }; } };
const shot = (p, name, o = {}) => p.screenshot({ path: `${CAP}/${site}-${name}.png`, ...o });

const headerInfo = (c) => {
  const m = window.__m; const h = m.q(c.header); const hs = getComputedStyle(h);
  const bar = c.desktopBar ? m.q(c.desktopBar) : h;
  const nav = m.q(c.nav);
  const links = nav ? [...nav.querySelectorAll('a, button')].filter(m.vis) : [];
  const active = links.find((e) => e.getAttribute('aria-current') === 'page');
  let underline = null;
  if (active) {
    const a = getComputedStyle(active), af = getComputedStyle(active, '::after'), bf = getComputedStyle(active, '::before');
    underline = { borderBottom: a.borderBottomWidth + ' ' + a.borderBottomStyle + ' ' + a.borderBottomColor, boxShadow: a.boxShadow, after: af.content !== 'none' ? { h: af.height, bg: af.backgroundColor, bottom: af.bottom, pos: af.position } : null, before: bf.content !== 'none' ? { h: bf.height, bg: bf.backgroundColor, bottom: bf.bottom } : null, color: a.color, activeBottom: Math.round(active.getBoundingClientRect().bottom), headerBottom: Math.round(h.getBoundingClientRect().bottom) };
  }
  const navBox = nav ? nav.getBoundingClientRect() : null;
  const linksBox = links.length ? { left: Math.min(...links.map((l) => l.getBoundingClientRect().left)), right: Math.max(...links.map((l) => l.getBoundingClientRect().right)) } : null;
  const search = m.q(c.search);
  const bell = m.q(c.bell), av = m.q(c.avatar), nb = m.q(c.newBtn);
  const logo = [...h.querySelectorAll('a, div, span')].find((e) => m.vis(e) && /Conecta/.test(m.text(e)) && e.getBoundingClientRect().left < 300 && e.children.length <= 3);
  const mono = logo ? [...logo.querySelectorAll('*')].find((e) => m.vis(e) && /^C$/.test(m.text(e))) : null;
  const sidebars = [...document.querySelectorAll('aside, nav, [class*=sidebar], [class*=rail]')].filter((e) => m.vis(e) && e.getBoundingClientRect().height > innerHeight * 0.6 && e.getBoundingClientRect().width < innerWidth * 0.4).map((e) => e.tagName + '.' + String(e.className).slice(0, 30));
  const main = m.q(c.main);
  const container = [main, ...main.querySelectorAll(':scope > *')].map((e) => m.box(e));
  const st = m.q(c.stories);
  return {
    header: { ...m.box(h), position: hs.position, top: hs.top, z: hs.zIndex, bg: hs.backgroundColor, borderBottom: hs.borderBottomWidth + ' ' + hs.borderBottomStyle + ' ' + hs.borderBottomColor, shadow: hs.boxShadow },
    bar: m.box(bar), barStyle: bar ? { maxW: getComputedStyle(bar).maxWidth, pad: getComputedStyle(bar).paddingLeft, grid: getComputedStyle(bar).gridTemplateColumns } : null,
    navLinks: links.map((l) => ({ t: m.text(l), w: Math.round(l.getBoundingClientRect().width), current: l.getAttribute('aria-current'), icon: !!l.querySelector('svg'), color: getComputedStyle(l).color })),
    navCenter: linksBox ? Math.round((linksBox.left + linksBox.right) / 2) : null, headerCenter: Math.round(innerWidth / 2), navBox: navBox ? { x: Math.round(navBox.x), w: Math.round(navBox.width) } : null,
    underline,
    search: search ? { ...m.box(search), placeholder: search.getAttribute('placeholder'), visible: m.vis(search), radius: getComputedStyle(search).borderRadius, wrapW: search.closest('form') ? Math.round(search.closest('form').getBoundingClientRect().width) : null, lupa: !!(search.closest('form') && search.closest('form').querySelector('svg')) } : null,
    newBtn: nb ? { t: m.text(nb), vis: m.vis(nb), bg: getComputedStyle(nb).backgroundColor, radius: getComputedStyle(nb).borderRadius, ...m.box(nb) } : null,
    bell: bell ? { vis: m.vis(bell), badge: m.text(bell), ...m.box(bell) } : null,
    avatar: av ? { vis: m.vis(av), ...m.box(av), radius: getComputedStyle(av.querySelector('*') || av).borderRadius } : null,
    logo: logo ? { t: m.text(logo), ...m.box(logo) } : null, mono: mono ? { ...m.box(mono), radius: getComputedStyle(mono).borderRadius, bg: getComputedStyle(mono).backgroundColor } : null,
    sidebars, container,
    stories: st ? { vis: m.vis(st), ...m.box(st) } : null,
    dockVisible: m.vis(m.q(c.dock)) && m.q(c.dock).getBoundingClientRect().height > 0,
    menuBtnVisible: m.vis(m.q(c.menuBtn)),
    panelBtnVisible: c.panelBtn ? m.vis(m.q(c.panelBtn)) : null,
    overflow: m.overflowX(),
  };
};

(async () => {
  const b = await chromium.launch();
  // ---------- 1440x900 ----------
  let ctx = await newCtx(b, 'd1440');
  let p = await openLogin(ctx, site);
  await shot(p, 'd1440-login');
  await step('login1440', () => p.evaluate((c) => {
    const m = window.__m; const form = m.q(c.loginEmail).closest('form'); const card = form.closest('section') || form;
    const aside = [...document.querySelectorAll('aside')].find(m.vis);
    return { card: m.box(card), aside: aside ? { ...m.box(aside), text: m.text(aside).slice(0, 200) } : null, inputH: m.q(c.loginEmail).getBoundingClientRect().height, submit: m.box(m.q(c.loginSubmit)), submitBg: getComputedStyle(m.q(c.loginSubmit)).backgroundColor, submitRadius: getComputedStyle(m.q(c.loginSubmit)).borderRadius, bodyBg: getComputedStyle(document.body).backgroundColor, overflow: m.overflowX() };
  }, c));
  await login(p, site);
  await p.waitForTimeout(3000);
  await p.mouse.move(1, 450);
  await shot(p, 'd1440-feed');
  await shot(p, 'd1440-feed-full', { fullPage: true });
  await step('d1440', () => p.evaluate(headerInfo, c));
  await step('cardDesktop', () => p.evaluate((c) => { const m = window.__m; const main = m.q(c.main); const cards = [...main.querySelectorAll('article')].filter((e) => m.vis(e) && /Ver publica/.test(m.text(e))); const tops = [...new Set(cards.slice(0, 6).map((e) => Math.round(e.getBoundingClientRect().top)))]; const first = cards[0]; return { n: cards.length, colunasPrimeiraLinha: cards.filter((e) => Math.round(e.getBoundingClientRect().top) === tops[0]).length, w: first ? Math.round(first.getBoundingClientRect().width) : null, cardBg: first ? getComputedStyle(first).backgroundColor : null, cardRadius: first ? getComputedStyle(first).borderRadius : null, cardShadow: first ? getComputedStyle(first).boxShadow : null, cardBorder: first ? getComputedStyle(first).borderTopWidth + ' ' + getComputedStyle(first).borderTopColor : null }; }, c));
  // sombra após rolar
  await step('sombraRolagem', async () => {
    const s0 = await p.evaluate((c) => getComputedStyle(document.querySelector(c.header)).boxShadow, c);
    await p.evaluate(() => window.scrollTo(0, 60)); await p.waitForTimeout(500);
    const s1 = await p.evaluate((c) => ({ shadow: getComputedStyle(document.querySelector(c.header)).boxShadow, top: document.querySelector(c.header).getBoundingClientRect().top }), c);
    await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(500);
    const s2 = await p.evaluate((c) => ({ top: document.querySelector(c.header).getBoundingClientRect().top }), c);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    return { antes: s0, depois60: s1, depois1500: s2 };
  });
  // busca: foco cresce; Esc limpa
  await step('busca', async () => {
    const w0 = await p.evaluate((c) => { const s = document.querySelector(c.search); const f = s.closest('form'); return { input: s.getBoundingClientRect().width, form: f.getBoundingClientRect().width, h: s.getBoundingClientRect().height }; }, c);
    await p.click(c.search); await p.waitForTimeout(400);
    const w1 = await p.evaluate((c) => { const s = document.querySelector(c.search); const f = s.closest('form'); return { input: s.getBoundingClientRect().width, form: f.getBoundingClientRect().width, outline: getComputedStyle(s).outline, shadow: getComputedStyle(s).boxShadow, focusWithinShadow: getComputedStyle(f).boxShadow, formOutline: getComputedStyle(f).outline }; }, c);
    await p.keyboard.type('praia');
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    const w2 = await p.evaluate((c) => { const s = document.querySelector(c.search); return { value: s.value, focado: document.activeElement === s }; }, c);
    await p.click(c.search); await p.keyboard.type('praia'); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
    const w3 = { hash: await p.evaluate(() => location.hash) };
    await shot(p, 'd1440-busca-enter');
    await p.evaluate(() => { location.hash = '#/feed'; }); await p.waitForTimeout(1200);
    return { antes: w0, foco: w1, esc: w2, enter: w3 };
  });
  // notificações
  await step('notif', async () => {
    await p.click(c.bell); await p.waitForTimeout(500);
    const r = await p.evaluate((c) => { const m = window.__m; const pop = m.q(c.notifPop); return { aberto: m.vis(pop), ...m.box(pop), verTodas: /Ver todas/.test(m.text(pop)), shadow: getComputedStyle(pop).boxShadow, radius: getComputedStyle(pop).borderRadius, overflow: m.overflowX() }; }, c);
    await shot(p, 'd1440-notif');
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    r.escFechou = !(await p.evaluate((c) => window.__m.vis(document.querySelector(c.notifPop)), c));
    r.focoVoltou = await p.evaluate((c) => document.activeElement === document.querySelector(c.bell), c);
    await p.click(c.bell); await p.waitForTimeout(400);
    await p.mouse.click(700, 600); await p.waitForTimeout(400);
    r.foraFechou = !(await p.evaluate((c) => window.__m.vis(document.querySelector(c.notifPop)), c));
    return r;
  });
  await step('menuPerfil', async () => {
    await p.click(c.avatar); await p.waitForTimeout(500);
    const r = await p.evaluate((c) => { const m = window.__m; const pop = m.q(c.profileMenu); return { aberto: m.vis(pop), ...m.box(pop), texto: m.text(pop), itens: [...pop.querySelectorAll('a,button')].filter(m.vis).map((e) => m.text(e)), alinhadoDireita: Math.round(innerWidth - pop.getBoundingClientRect().right) }; }, c);
    await shot(p, 'd1440-menu-perfil');
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    r.escFechou = !(await p.evaluate((c) => window.__m.vis(document.querySelector(c.profileMenu)), c));
    await p.click(c.avatar); await p.waitForTimeout(400);
    await p.mouse.click(700, 600); await p.waitForTimeout(400);
    r.foraFechou = !(await p.evaluate((c) => window.__m.vis(document.querySelector(c.profileMenu)), c));
    return r;
  });
  // foco visível (Tab até o primeiro link da nav)
  await step('foco', async () => {
    await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
    const res = [];
    for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); res.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.tagName + ' ' + (a.getAttribute('aria-label') || window.__m.text(a)).slice(0, 25), outline: cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor, offset: cs.outlineOffset, shadow: cs.boxShadow.slice(0, 80) }; })); }
    await shot(p, 'd1440-foco');
    // foco no link principal do card
    const cardFocus = await p.evaluate((c) => { const a = [...document.querySelectorAll(c.main + ' a')].find((e) => /Ver publica/.test(window.__m.text(e))); if (!a) return null; a.focus(); return null; }, c);
    await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
    const cf = await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.tagName + ' ' + window.__m.text(a).slice(0, 25), outline: cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor, shadow: cs.boxShadow.slice(0, 100) }; });
    return { tabs: res, card: cf };
  });
  // destinos acessíveis no desktop
  await step('destinosDesktop', () => p.evaluate((c) => { const m = window.__m; const h = m.q(c.header); const links = [...h.querySelectorAll('a[href], [data-href]')].map((a) => (a.getAttribute('href') || a.dataset.href) + '|' + m.text(a).slice(0, 20)); return links; }, c));
  // perfil desktop
  await step('perfilDesktop', async () => { await p.evaluate(() => { location.hash = '#/perfil'; }); await p.waitForTimeout(1500); await shot(p, 'd1440-perfil'); return p.evaluate((c) => { const m = window.__m; const st = m.q(c.stories); return { stories: st ? m.vis(st) : null }; }, c); });
  await p.evaluate(() => { location.hash = '#/feed'; }); await p.waitForTimeout(1200);

  // ---------- 1280 / 1024 / 1920 ----------
  for (const w of [1920, 1280, 1024]) {
    await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(700);
    await shot(p, `d${w}-feed`);
    await step(`d${w}`, () => p.evaluate(headerInfo, c));
  }
  await ctx.close();

  // ---------- Tablet 768x1024 ----------
  ctx = await newCtx(b, 't768');
  p = await openLogin(ctx, site);
  await shot(p, 't768-login');
  await login(p, site);
  await p.waitForTimeout(3000);
  await shot(p, 't768-feed');
  await step('t768', () => p.evaluate(headerInfo, c));
  await step('painelTablet', async () => {
    if (!(await p.locator(c.panelBtn).isVisible())) return { semBotao: true };
    await p.click(c.panelBtn); await p.waitForTimeout(600);
    const r = await p.evaluate((c) => { const m = window.__m; const pn = m.q(c.panel); const h = m.q(c.header); return { aberto: m.vis(pn), ...m.box(pn), headerBottom: Math.round(h.getBoundingClientRect().bottom), itens: [...pn.querySelectorAll('a,button')].filter(m.vis).map((e) => m.text(e).slice(0, 25)), bodyOverflow: getComputedStyle(document.body).overflow }; }, c);
    await shot(p, 't768-painel');
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    r.escFechou = !(await p.evaluate((c) => window.__m.vis(document.querySelector(c.panel)), c));
    return r;
  });
  for (const w of [820, 767]) {
    await p.setViewportSize({ width: w, height: 1024 }); await p.waitForTimeout(700);
    await shot(p, `t${w}-feed`);
    await step(`t${w}`, () => p.evaluate(headerInfo, c));
  }
  await ctx.close();
  await b.close();
  fs.writeFileSync(`${DATA}/${site}-desktop.json`, JSON.stringify(R, null, 1));
  console.log('ok');
})();
