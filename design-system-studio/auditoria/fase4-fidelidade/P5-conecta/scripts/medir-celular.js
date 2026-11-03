// Medições no celular (390x844 e 360x800 com isMobile/hasTouch, 320x640, paisagem 844x390).
// Uso: node medir-celular.js dev-1
const { chromium, CFG, CAP, DATA, newCtx, openLogin, login, fs } = require('./lib');
const site = process.argv[2];
const c = CFG[site];
const R = { site };
const step = async (name, fn) => { try { R[name] = await fn(); } catch (e) { R[name] = { ERRO: e.message.split('\n')[0] }; } };
const shot = (p, name, o = {}) => p.screenshot({ path: `${CAP}/${site}-${name}.png`, ...o });

async function drawerOpen(p) {
  await p.click(c.menuBtn);
  await p.waitForTimeout(600);
}
async function drawerIsOpen(p) {
  return p.evaluate((c) => {
    const panel = document.querySelector(c.drawerPanel);
    if (!panel) return false;
    const r = panel.getBoundingClientRect();
    const root = document.querySelector(c.drawerRoot);
    const hidden = root && (root.hidden || root.getAttribute('aria-hidden') === 'true' || getComputedStyle(root).display === 'none' || getComputedStyle(root).visibility === 'hidden');
    return !hidden && r.right > 20 && r.width > 0 && getComputedStyle(panel).visibility !== 'hidden';
  }, c);
}

(async () => {
  const b = await chromium.launch();

  // ---------- 390x844 ----------
  let ctx = await newCtx(b, 'm390');
  let p = await openLogin(ctx, site);
  await login(p, site);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(3500); // deixa toasts sumirem
  await shot(p, 'm390-feed');
  await shot(p, 'm390-feed-full', { fullPage: true });

  await step('estrutura390', () => p.evaluate((c) => {
    const m = window.__m;
    const header = m.q(c.header), top = m.q(c.topbar), menu = m.q(c.menuBtn), st = m.q(c.stories), stl = m.q(c.storiesList), dock = m.q(c.dock);
    const dockVis = m.visibleBox(dock);
    const hcs = getComputedStyle(header);
    // controles da topbar (visíveis), da esquerda para a direita
    const topCtrls = [...top.querySelectorAll('a[href],button,input')].filter(m.vis).map((e) => ({ label: (e.getAttribute('aria-label') || m.text(e)).slice(0, 30), ...m.box(e) })).sort((a, b) => a.x - b.x);
    const brand = [...top.querySelectorAll('*')].find((e) => m.vis(e) && /Conecta/.test(m.text(e)) && e.children.length <= 2);
    const dockItems = [...dock.querySelectorAll('a,button')].filter(m.vis).map((e) => ({ label: m.text(e), current: e.getAttribute('aria-current'), ...m.box(e) }));
    const active = [...dock.querySelectorAll('a,button')].find((e) => e.getAttribute('aria-current') === 'page' || e.classList.contains('is-active') || e.classList.contains('ativo') || e.classList.contains('active'));
    const inactive = [...dock.querySelectorAll('a,button')].find((e) => e !== active && m.vis(e));
    const pillOf = (a) => { if (!a) return null; const els = [a, ...a.querySelectorAll('*')]; const pill = els.find((e) => getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'); const lab = els.reverse().find((e) => e.children.length === 0 && m.text(e)); return { pill: pill ? { tag: pill.tagName, cls: String(pill.className), bg: getComputedStyle(pill).backgroundColor, radius: getComputedStyle(pill).borderRadius, ...m.box(pill) } : null, labelColor: lab ? getComputedStyle(lab).color : null, labelWeight: lab ? getComputedStyle(lab).fontWeight : null, iconColor: (a.querySelector('svg') ? getComputedStyle(a.querySelector('svg')).color : null) }; };
    // FAB: botões fixos fora do header/dock
    const fixed = [...document.querySelectorAll('body *')].filter((e) => m.vis(e) && getComputedStyle(e).position === 'fixed' && !header.contains(e) && !dock.contains(e) && e !== dock && !(m.q(c.drawerRoot) && m.q(c.drawerRoot).contains(e))).map((e) => ({ tag: e.tagName, id: e.id, cls: String(e.className).slice(0, 40), ...m.box(e) }));
    return {
      header: { ...m.box(header), position: hcs.position, top: hcs.top, z: hcs.zIndex, bg: hcs.backgroundColor, borderBottom: hcs.borderBottomWidth + ' ' + hcs.borderBottomColor },
      topbar: { ...m.box(top) },
      menuBtn: m.box(menu),
      topCtrls, brand: brand ? m.text(brand) : null,
      stories: st ? { ...m.box(st), list: m.box(stl), overflowX: getComputedStyle(stl).overflowX, sw: stl.scrollWidth, cw: stl.clientWidth, n: stl.querySelectorAll('li, a, button').length, position: getComputedStyle(st).position, gapToHeader: Math.round(st.getBoundingClientRect().top - top.getBoundingClientRect().bottom) } : null,
      dock: { nav: m.box(dock), navPos: getComputedStyle(dock).position, vis: m.box(dockVis), visTag: dockVis.tagName + '.' + String(dockVis.className), radius: getComputedStyle(dockVis).borderRadius, bg: getComputedStyle(dockVis).backgroundColor, shadow: getComputedStyle(dockVis).boxShadow, border: getComputedStyle(dockVis).borderTopWidth + ' ' + getComputedStyle(dockVis).borderTopColor, backdrop: getComputedStyle(dockVis).backdropFilter,
        gapL: Math.round(dockVis.getBoundingClientRect().left), gapR: Math.round(innerWidth - dockVis.getBoundingClientRect().right), gapB: Math.round(innerHeight - dockVis.getBoundingClientRect().bottom), items: dockItems,
        active: pillOf(active), activeLabel: active ? m.text(active) : null, activeAria: active ? active.getAttribute('aria-current') : null, inactive: pillOf(inactive) },
      fixedOthers: fixed,
      vw: innerWidth, vh: innerHeight,
    };
  }, c));

  await step('cardFeed', () => p.evaluate((c) => {
    const m = window.__m; const main = m.q(c.main);
    const card = [...main.querySelectorAll('article, .card, li')].find((e) => m.vis(e) && e.getBoundingClientRect().height > 200 && /Ver publica/.test(m.text(e)));
    if (!card) return { semCard: true };
    const cs = getComputedStyle(card);
    const kids = [...card.querySelectorAll('*')].filter(m.vis);
    const media = kids.find((e) => { const r = e.getBoundingClientRect(); return r.width > card.getBoundingClientRect().width * 0.8 && r.height > 100 && (e.tagName === 'svg' || e.tagName === 'IMG' || e.tagName === 'FIGURE' || /media|midia|ilustra|thumb|capa/i.test(String(e.className))); });
    const title = card.querySelector('h2,h3,h4');
    const p = [...card.querySelectorAll('p')].filter(m.vis)[0];
    const btn = [...card.querySelectorAll('a,button')].find((e) => /Ver publica/.test(m.text(e)));
    const tag = kids.find((e) => /^Novo$/.test(m.text(e)) && e.children.length === 0);
    const nested = card.querySelectorAll('a button, button a, a a, button button').length;
    const bcs = btn ? getComputedStyle(btn) : null;
    const after = btn ? getComputedStyle(btn, '::after') : null;
    const order = [media, tag, title, p, btn].map((e) => (e ? Math.round(e.getBoundingClientRect().top - card.getBoundingClientRect().top) : null));
    return {
      card: { ...m.box(card), tag: card.tagName, radius: cs.borderRadius, bg: cs.backgroundColor, shadow: cs.boxShadow, border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor },
      media: media ? { ...m.box(media), ratio: Math.round((media.getBoundingClientRect().width / media.getBoundingClientRect().height) * 100) / 100, tag: media.tagName } : null,
      tag: tag ? { text: m.text(tag), bg: getComputedStyle(tag).backgroundColor, color: getComputedStyle(tag).color } : null,
      title: title ? { text: m.text(title), font: getComputedStyle(title).fontFamily, weight: getComputedStyle(title).fontWeight, size: getComputedStyle(title).fontSize } : null,
      text: p ? { t: m.text(p).slice(0, 60), clamp: getComputedStyle(p).webkitLineClamp, lines: Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight || 20)), size: getComputedStyle(p).fontSize } : null,
      btn: btn ? { text: m.text(btn), tag: btn.tagName, bg: bcs.backgroundColor, color: bcs.color, radius: bcs.borderRadius, h: btn.getBoundingClientRect().height, w: btn.getBoundingClientRect().width, afterPos: after.position, afterContent: after.content, afterInset: after.inset } : null,
      nestedInteractive: nested, order,
      buttonsInCard: [...card.querySelectorAll('button')].map((e) => e.getAttribute('aria-label') || m.text(e)),
    };
  }, c));

  // Topbar ao rolar (fixa ou esconde/reaparece)
  await step('rolagem', async () => {
    const r = {};
    await p.mouse.wheel(0, 0);
    await p.evaluate(() => window.scrollTo(0, 1200)); await p.waitForTimeout(500);
    r.depois1200 = await p.evaluate((c) => { const h = document.querySelector(c.topbar); const b = h.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, scrollY, visible: b.bottom > 5 }; }, c);
    await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(500);
    r.aoSubir = await p.evaluate((c) => { const h = document.querySelector(c.topbar); const b = h.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, scrollY, visible: b.bottom > 5 }; }, c);
    // rolar até o fim: conteúdo coberto pelo dock?
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(600);
    r.fim = await p.evaluate((c) => {
      const m = window.__m; const main = m.q(c.main); const dock = m.visibleBox(m.q(c.dock));
      let maxB = 0, last = null;
      for (const e of main.querySelectorAll('*')) { if (!m.vis(e)) continue; const leaf = e.children.length === 0 || e.tagName === 'svg' || e.tagName === 'IMG' || e.tagName === 'BUTTON' || e.tagName === 'A'; if (!leaf || e.closest('svg') && e.tagName !== 'svg') continue; const b = e.getBoundingClientRect(); if (b.height > 0 && b.bottom > maxB) { maxB = b.bottom; last = e; } }
      return { contentBottom: Math.round(maxB), lastEl: last ? last.tagName + '.' + String(last.className).slice(0, 30) + ' "' + m.text(last).slice(0, 30) + '"' : null, dockTop: Math.round(dock.getBoundingClientRect().top), vh: innerHeight, scrollY, mainPadB: getComputedStyle(main).paddingBottom, bodyPadB: getComputedStyle(document.body).paddingBottom };
    }, c);
    await shot(p, 'm390-feed-fim');
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
    return r;
  });

  // ---------- Drawer ----------
  await step('drawer', async () => {
    const r = {};
    await p.evaluate(() => window.scrollTo(0, 300)); await p.waitForTimeout(400);
    const y0 = await p.evaluate(() => scrollY);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    await drawerOpen(p);
    r.aberto = await drawerIsOpen(p);
    await shot(p, 'm390-drawer');
    Object.assign(r, await p.evaluate((c) => {
      const m = window.__m; const panel = m.q(c.drawerPanel); const root = m.q(c.drawerRoot); const scrim = m.q(c.scrim);
      const dockB = m.q(c.dock).getBoundingClientRect(); const topB = m.q(c.topbar).getBoundingClientRect();
      const ae = document.activeElement;
      const at = (x, y) => { const e = document.elementFromPoint(x, y); return e ? { inDrawer: panel.contains(e) || (root && root.contains(e)) || (scrim && (scrim === e || scrim.contains(e))), el: e.tagName + '.' + String(e.className).slice(0, 30) } : null; };
      const main = m.q(c.main);
      const inertInfo = ['#app', '#shell', c.main, c.header, c.dock, '.shell__content', '#conteudo'].map((s) => { const e = document.querySelector(s); return e ? { s, inert: e.inert || e.hasAttribute('inert'), ariaHidden: e.getAttribute('aria-hidden'), inertAncestor: !!e.closest('[inert]') } : null; }).filter(Boolean);
      const pcs = getComputedStyle(panel);
      const body = panel.querySelector('[class*=body], [class*=corpo]') || panel;
      const footer = panel.querySelector('[class*=footer], [class*=rodape]');
      const sair = [...panel.querySelectorAll('button,a')].find((e) => /Sair/.test(m.text(e)));
      const title = panel.querySelector('h2, h3, [id*=title], [id*=titulo]');
      return {
        panel: { ...m.box(panel), bg: pcs.backgroundColor, radius: pcs.borderRadius, shadow: pcs.boxShadow, z: pcs.zIndex, role: panel.getAttribute('role'), ariaModal: panel.getAttribute('aria-modal') },
        scrim: scrim ? { ...m.box(scrim), bg: getComputedStyle(scrim).backgroundColor, opacity: getComputedStyle(scrim).opacity } : null,
        sobreTopbar: at(innerWidth - 20, topB.top + topB.height / 2), sobreDock: at(innerWidth - 20, dockB.top + dockB.height / 2), sobreDockEsq: at(40, dockB.top + dockB.height / 2),
        focoAoAbrir: ae ? { tag: ae.tagName, label: ae.getAttribute('aria-label') || m.text(ae).slice(0, 30), inPanel: panel.contains(ae) || ae === panel } : null,
        bodyOverflow: getComputedStyle(document.body).overflow, htmlOverflow: getComputedStyle(document.documentElement).overflow, overscroll: getComputedStyle(body).overscrollBehaviorY + ' (' + (body === panel ? 'painel' : String(body.className)) + ')', overscrollPanel: pcs.overscrollBehaviorY,
        inertInfo,
        titulo: title ? m.text(title) : null,
        itens: [...panel.querySelectorAll('a, button')].filter(m.vis).map((e) => (e.getAttribute('aria-label') || m.text(e)).slice(0, 40)),
        secoes: [...panel.querySelectorAll('h2,h3,h4,[class*=section-title],[class*=secao]')].filter(m.vis).map((e) => m.text(e).slice(0, 30)),
        footer: footer ? { ...m.box(footer), position: getComputedStyle(footer).position } : null,
        sair: sair ? { text: m.text(sair), bg: getComputedStyle(sair).backgroundColor, radius: getComputedStyle(sair).borderRadius, h: sair.getBoundingClientRect().height } : null,
        bodyScrollable: body !== panel ? { overflowY: getComputedStyle(body).overflowY } : null,
        transition: pcs.transition.slice(0, 80),
      };
    }, c));
    r.scrollY0 = y0;
    r.scrollYDepoisAbrir = await p.evaluate(() => scrollY);
    // foco preso: Tab 15x, Shift+Tab 6x
    const escapes = [];
    for (let i = 0; i < 15; i++) { await p.keyboard.press('Tab'); escapes.push(await p.evaluate((c) => { const panel = document.querySelector(c.drawerPanel); const a = document.activeElement; return panel.contains(a) || a === panel; }, c)); }
    for (let i = 0; i < 6; i++) { await p.keyboard.press('Shift+Tab'); escapes.push(await p.evaluate((c) => { const panel = document.querySelector(c.drawerPanel); const a = document.activeElement; return panel.contains(a) || a === panel; }, c)); }
    r.focoPreso = escapes.every(Boolean); r.focoPresoSeq = escapes.map((x) => (x ? 1 : 0)).join('');
    // Esc
    await p.keyboard.press('Escape'); await p.waitForTimeout(600);
    r.esc = { fechou: !(await drawerIsOpen(p)), focoVoltou: await p.evaluate((c) => document.activeElement === document.querySelector(c.menuBtn), c) };
    // scrim
    await drawerOpen(p);
    const pw = r.panel ? r.panel.right : 300;
    await p.mouse.click(Math.min(385, pw + 40), 420); await p.waitForTimeout(600);
    r.scrimClick = { fechou: !(await drawerIsOpen(p)), focoVoltou: await p.evaluate((c) => document.activeElement === document.querySelector(c.menuBtn), c) };
    if (!r.scrimClick.fechou) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
    // tap no scrim (touch)
    await drawerOpen(p);
    await p.touchscreen.tap(Math.min(385, pw + 40), 500); await p.waitForTimeout(600);
    r.scrimTap = { fechou: !(await drawerIsOpen(p)) };
    if (!r.scrimTap.fechou) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
    // botão X
    await drawerOpen(p);
    await p.click(c.drawerClose); await p.waitForTimeout(600);
    r.botaoX = { fechou: !(await drawerIsOpen(p)), focoVoltou: await p.evaluate((c) => document.activeElement === document.querySelector(c.menuBtn), c) };
    r.bodyOverflowFechado = await p.evaluate(() => getComputedStyle(document.body).overflow);
    return r;
  });

  // ---------- Alvos de toque e textos cortados (feed, topo) ----------
  await step('alvos390', () => p.evaluate((c) => ({ pequenos: window.__m.smallTargets(), total: window.__m.interactive().filter(window.__m.inViewport).length, cortados: window.__m.cutTexts() }), c));
  await step('alvosDrawer390', async () => { await drawerOpen(p); const r = await p.evaluate((c) => window.__m.smallTargets(c.drawerPanel), c); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return r; });

  // ---------- Dock: navegação ----------
  await step('dockNav', async () => {
    const out = [];
    const labels = await p.evaluate((c) => [...document.querySelectorAll(c.dock + ' a, ' + c.dock + ' button')].filter(window.__m.vis).map((e) => window.__m.text(e)), c);
    for (let i = 0; i < labels.length; i++) {
      const items = p.locator(`${c.dock} a, ${c.dock} button`);
      await items.nth(i).click(); await p.waitForTimeout(1300);
      out.push(await p.evaluate(({ c, i }) => {
        const m = window.__m; const it = [...document.querySelectorAll(c.dock + ' a, ' + c.dock + ' button')].filter(m.vis);
        const h1 = document.querySelector(c.main + ' h1') || document.querySelector('h1:not([hidden])');
        return { label: m.text(it[i]), hash: location.hash, current: it.map((e) => e.getAttribute('aria-current')).join(','), h1: h1 ? m.text(h1) : null };
      }, { c, i }));
      await shot(p, `m390-dock-${i + 1}`);
    }
    return out;
  });

  // ---------- Perfil ----------
  await step('perfil', async () => {
    await p.evaluate(() => { location.hash = '#/perfil'; }); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    await shot(p, 'm390-perfil');
    await shot(p, 'm390-perfil-full', { fullPage: true });
    const r = await p.evaluate((c) => {
      const m = window.__m; const main = m.q(c.main);
      const all = [...main.querySelectorAll('*')].filter(m.vis);
      const cover = all.find((e) => { const r = e.getBoundingClientRect(); return r.width > 250 && r.height >= 60 && r.height < 260 && /cover|capa|banner/i.test(String(e.className)); });
      const avatar = all.find((e) => /avatar/i.test(String(e.className)) && e.getBoundingClientRect().width >= 64);
      const name = [...main.querySelectorAll('h1,h2')].find((e) => m.vis(e) && /\w/.test(m.text(e)));
      const tabs = [...main.querySelectorAll('[role=tab]')].filter(m.vis);
      const stats = all.filter((e) => /stat|estat|numero/i.test(String(e.className)) && e.children.length >= 1 && e.getBoundingClientRect().height < 90 && e.getBoundingClientRect().width < 200);
      const actions = [...main.querySelectorAll('button, a')].filter((e) => m.vis(e) && /Editar perfil|Seguir|Compartilhar|Mensagem/.test(m.text(e)) && e.getBoundingClientRect().top < 700);
      const ab = avatar ? avatar.getBoundingClientRect() : null; const cb = cover ? cover.getBoundingClientRect() : null;
      return {
        cover: cover ? { ...m.box(cover), bg: getComputedStyle(cover).backgroundImage.slice(0, 80) + ' ' + getComputedStyle(cover).backgroundColor } : null,
        avatar: avatar ? { ...m.box(avatar), overlapFrac: cb ? Math.round(((cb.bottom - ab.top) / ab.height) * 100) / 100 : null, centerOffset: Math.round(ab.x + ab.width / 2 - innerWidth / 2) } : null,
        name: name ? { t: m.text(name), centerOffset: Math.round(name.getBoundingClientRect().x + name.getBoundingClientRect().width / 2 - innerWidth / 2), align: getComputedStyle(name).textAlign } : null,
        cargo: (() => { const e = all.find((e) => /Product Designer|Membro/.test(m.text(e)) && e.children.length === 0); return e ? m.text(e) : null; })(),
        actions: actions.map((e) => ({ t: m.text(e), w: Math.round(e.getBoundingClientRect().width), bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderRadius })),
        stats: stats.slice(0, 6).map((e) => ({ t: m.text(e).slice(0, 30), ...m.box(e) })),
        tabs: tabs.map((e) => ({ t: m.text(e), sel: e.getAttribute('aria-selected'), bg: getComputedStyle(e).backgroundColor, radius: getComputedStyle(e).borderRadius })),
        container: (() => { const s = all.find((e) => /profile|perfil/i.test(String(e.className)) && e.getBoundingClientRect().height > 250); return s ? { cls: String(s.className).slice(0, 40), bg: getComputedStyle(s).backgroundColor, radius: getComputedStyle(s).borderRadius, shadow: getComputedStyle(s).boxShadow, border: getComputedStyle(s).borderTopWidth } : null; })(),
      };
    }, c);
    // abas
    const tabs = p.locator(`${c.main} [role=tab]`);
    const n = await tabs.count();
    if (n > 1) {
      const before = await p.evaluate((c) => window.__m.text(document.querySelector(c.main)).length + '|' + location.href, c);
      const urlBefore = p.url();
      await tabs.nth(1).click(); await p.waitForTimeout(800);
      r.abaTroca = { url: p.url() === urlBefore ? 'mesma' : p.url(), sel: await tabs.nth(1).getAttribute('aria-selected'), conteudoMudou: (await p.evaluate((c) => window.__m.text(document.querySelector(c.main)).length + '|' + location.href, c)) !== before };
      await shot(p, 'm390-perfil-aba2');
    }
    return r;
  });

  // ---------- Stories: rolagem e foco ----------
  await step('storiesInt', async () => {
    await p.evaluate(() => { location.hash = '#/feed'; }); await p.waitForTimeout(1500);
    await p.evaluate(() => window.scrollTo(0, 0));
    return p.evaluate((c) => { const l = document.querySelector(c.storiesList); if (!l) return null; const before = l.scrollLeft; l.scrollLeft = 200; const after = l.scrollLeft; l.scrollLeft = 0; const items = [...l.querySelectorAll('a,button')]; return { scrollFunciona: after > before, focaveis: items.length, primeiro: items[0] ? (items[0].getAttribute('aria-label') || window.__m.text(items[0])) : null, alvo: items[0] ? window.__m.box(items[0]) : null }; }, c);
  });
  await step('storyClick', async () => {
    const first = p.locator(`${c.storiesList} a, ${c.storiesList} button`).nth(1);
    if (!(await first.count())) return null;
    await first.click(); await p.waitForTimeout(900);
    await shot(p, 'm390-story-aberto');
    const r = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find((e) => window.__m.vis(e)); return { dialogo: d ? (d.getAttribute('aria-label') || d.getAttribute('aria-labelledby') || d.className) : null, hash: location.hash }; });
    await p.keyboard.press('Escape'); await p.waitForTimeout(600);
    return r;
  });

  // ---------- Paleta/tipografia no celular ----------
  await step('tipo390', () => p.evaluate(() => { const b = getComputedStyle(document.body); const h1 = document.querySelector('h1:not([hidden])'); return { bodyFont: b.fontFamily, bodySize: b.fontSize, bodyColor: b.color, bodyBg: b.backgroundColor, htmlBg: getComputedStyle(document.documentElement).backgroundColor, h1: h1 ? { font: getComputedStyle(h1).fontFamily, weight: getComputedStyle(h1).fontWeight, size: getComputedStyle(h1).fontSize } : null, interOk: document.fonts.check('16px Inter') }; }));

  await ctx.close();

  // ---------- 360x800 ----------
  ctx = await newCtx(b, 'm360');
  p = await openLogin(ctx, site);
  await shot(p, 'm360-login');
  await login(p, site);
  await p.waitForTimeout(3500);
  await shot(p, 'm360-feed');
  await step('m360', () => p.evaluate((c) => { const m = window.__m; const d = m.visibleBox(m.q(c.dock)); const db = d.getBoundingClientRect(); return { dock: { w: db.width, h: db.height, gapL: Math.round(db.left), gapR: Math.round(innerWidth - db.right), gapB: Math.round(innerHeight - db.bottom), radius: getComputedStyle(d).borderRadius }, topbarH: m.q(c.topbar).getBoundingClientRect().height, storiesH: m.q(c.stories) ? m.q(c.stories).getBoundingClientRect().height : null, overflow: m.overflowX(), cortados: m.cutTexts() }; }, c));
  await drawerOpen(p);
  await shot(p, 'm360-drawer');
  await step('drawer360', () => p.evaluate((c) => window.__m.box(document.querySelector(c.drawerPanel)), c));
  await ctx.close();

  // ---------- 320x640 ----------
  ctx = await newCtx(b, 'm320');
  p = await openLogin(ctx, site);
  await shot(p, 'm320-login');
  await step('login320', () => p.evaluate(() => ({ overflow: window.__m.overflowX(), cortados: window.__m.cutTexts() })));
  await login(p, site);
  await p.waitForTimeout(3500);
  await shot(p, 'm320-feed');
  await step('m320', () => p.evaluate((c) => { const m = window.__m; const d = m.visibleBox(m.q(c.dock)); const db = d.getBoundingClientRect(); return { dock: { w: db.width, h: db.height, gapL: Math.round(db.left), gapR: Math.round(innerWidth - db.right), gapB: Math.round(innerHeight - db.bottom) }, overflow: m.overflowX(), cortados: m.cutTexts(), pequenos: m.smallTargets() }; }, c));
  await drawerOpen(p);
  await shot(p, 'm320-drawer');
  await step('drawer320', () => p.evaluate((c) => window.__m.box(document.querySelector(c.drawerPanel)), c));
  await ctx.close();

  // ---------- Paisagem 844x390 ----------
  ctx = await newCtx(b, 'land');
  p = await openLogin(ctx, site);
  await shot(p, 'land-login');
  await login(p, site);
  await p.waitForTimeout(3500);
  await shot(p, 'land-feed');
  await step('paisagem', async () => {
    const r0 = await p.evaluate((c) => { const m = window.__m; const top = m.q(c.topbar); const st = m.q(c.stories); const d = m.visibleBox(m.q(c.dock)); return { topbar: { ...m.box(top), pos: getComputedStyle(m.q(c.header)).position, vis: m.vis(top) }, stories: st ? { ...m.box(st), vis: m.vis(st), list: m.box(m.q(c.storiesList)) } : null, dock: { ...m.box(d), vis: m.vis(d) }, vh: innerHeight, vw: innerWidth, overflow: m.overflowX() }; }, c);
    await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(600);
    r0.aposRolar = await p.evaluate((c) => { const m = window.__m; const top = m.q(c.topbar); const d = m.visibleBox(m.q(c.dock)); const tb = top.getBoundingClientRect(); return { topbarVisivel: tb.bottom > 0 && m.vis(top), topbarBottom: tb.bottom, dockH: d.getBoundingClientRect().height }; }, c);
    await shot(p, 'land-feed-rolado');
    return r0;
  });
  await ctx.close();

  // ---------- Paisagem pequena 667x375 (abaixo do corte de 768 px) ----------
  ctx = await newCtx(b, { viewport: { width: 667, height: 375 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: require('./lib').MOBILE_UA });
  p = await openLogin(ctx, site);
  await login(p, site);
  await p.waitForTimeout(3500);
  await shot(p, 'land667-feed');
  await step('paisagem667', async () => {
    const r0 = await p.evaluate((c) => { const m = window.__m; const top = m.q(c.topbar); const st = m.q(c.stories); const d = m.visibleBox(m.q(c.dock)); return { topbar: { ...m.box(top), pos: getComputedStyle(m.q(c.header)).position, vis: m.vis(top) }, stories: st ? { ...m.box(st), vis: m.vis(st), list: m.box(m.q(c.storiesList)) } : null, dock: { ...m.box(d), vis: m.vis(d), radius: getComputedStyle(d).borderRadius }, vh: innerHeight, vw: innerWidth, overflow: m.overflowX() }; }, c);
    await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(600);
    r0.aposRolar = await p.evaluate((c) => { const m = window.__m; const top = m.q(c.topbar); const d = m.visibleBox(m.q(c.dock)); const tb = top.getBoundingClientRect(); return { topbarVisivel: tb.bottom > 0 && m.vis(top), topbarBottom: tb.bottom, dockH: d.getBoundingClientRect().height, dockTop: d.getBoundingClientRect().top }; }, c);
    await shot(p, 'land667-feed-rolado');
    return r0;
  });
  await ctx.close();

  await b.close();
  fs.writeFileSync(`${DATA}/${site}-celular.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 200000));
})();
