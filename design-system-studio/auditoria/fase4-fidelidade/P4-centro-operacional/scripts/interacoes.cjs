// Testes de interação (desktop 1440x900 e celular 390x844) para os 3 sites.
// Uso: node interacoes.cjs [dev-1|dev-2|dev-3]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { SITES, pageDefects } = require('./lib.cjs');
const OUT = path.resolve(__dirname, '../medicoes');
const CAP = path.resolve(__dirname, '../capturas');

const hexOf = (c) => {
  const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return c;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  if (p.length === 4 && p[3] === 0) return 'transparent';
  return '#' + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') + (p.length === 4 && p[3] < 1 ? '@' + p[3] : '');
};

async function safe(fn, label, R) { try { return await fn(); } catch (e) { R.errors.push(label + ': ' + e.message.split('\n')[0]); return null; } }

async function desktop(browser, dev, cfg, R) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErr = []; page.on('pageerror', (e) => consoleErr.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text().slice(0, 120)); });
  await page.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  const T = `${cfg.table}`;
  // ---- KPI delta colors (elemento colorido interno)
  R.kpiDeltaColors = await page.evaluate((cfg) => Array.from(document.querySelectorAll(cfg.kpi)).slice(0, 4).map((k) => {
    const el = k.querySelector('.kpi__delta-val, .delta, .var');
    return el ? { t: el.textContent.trim(), color: getComputedStyle(el).color } : null;
  }), cfg);
  R.kpiDeltaColors = (R.kpiDeltaColors || []).map((x) => x && { ...x, color: hexOf(x.color) });
  // ---- INT1 seleção
  R.INT1 = await safe(async () => {
    const rowCb = page.locator(`${T} tbody input[type=checkbox]`).first();
    await rowCb.check({ force: true }); await page.waitForTimeout(200);
    const ind = await page.$eval(`${T} thead input[type=checkbox]`, (e) => ({ ind: e.indeterminate, checked: e.checked, aria: e.getAttribute('aria-checked') }));
    await rowCb.uncheck({ force: true }); await page.waitForTimeout(150);
    await page.locator(`${T} thead input[type=checkbox]`).check({ force: true }); await page.waitForTimeout(200);
    const all = await page.$$eval(`${T} tbody input[type=checkbox]`, (es) => es.map((e) => e.checked));
    await page.locator(`${T} thead input[type=checkbox]`).uncheck({ force: true }); await page.waitForTimeout(150);
    return { indeterminateAfterOne: ind, allAfterHeader: all };
  }, 'INT1', R);
  // ---- INT2 ordenação
  R.INT2 = await safe(async () => {
    const res = {};
    for (const col of ['Valor', 'Cliente', 'Status']) {
      const th = page.locator(`${T} thead th`).filter({ hasText: col }).first();
      const btn = th.locator('button');
      const clickable = (await btn.count()) > 0;
      const getState = async () => page.evaluate(([T, col]) => {
        const ths = Array.from(document.querySelectorAll(T + ' thead th'));
        const idx = ths.findIndex((t) => t.textContent.includes(col));
        const rows = Array.from(document.querySelectorAll(T + ' tbody tr'));
        return { aria: ths[idx].getAttribute('aria-sort'), vals: rows.map((r) => (r.children[idx] ? r.children[idx].innerText.split('\n')[0].trim() : '')) };
      }, [T, col]);
      const before = await getState();
      if (clickable) { await btn.click(); await page.waitForTimeout(250); }
      const a1 = await getState();
      if (clickable) { await btn.click(); await page.waitForTimeout(250); }
      const a2 = await getState();
      res[col] = { clickable, before, a1, a2 };
    }
    return res;
  }, 'INT2', R);
  // ---- INT3 hover na linha
  R.INT3 = await safe(async () => {
    const row = page.locator(`${T} tbody tr`).nth(1);
    const b = await row.evaluate((r) => [getComputedStyle(r).backgroundColor, getComputedStyle(r.children[1]).backgroundColor]);
    await row.hover(); await page.waitForTimeout(250);
    const a = await row.evaluate((r) => [getComputedStyle(r).backgroundColor, getComputedStyle(r.children[1]).backgroundColor]);
    await page.mouse.move(5, 5);
    return { before: b.map(hexOf), after: a.map(hexOf) };
  }, 'INT3', R);
  // ---- INT12 hover em botões (primário e secundário)
  R.INT12 = await safe(async () => {
    const out = {};
    const prim = page.locator('header button.btn--primary, header .btn-primary').first();
    const sec = page.locator('header button.btn--secondary, header button.btn:not(.btn-primary):not(.btn--primary)').first();
    for (const [k, l] of [['primary', prim], ['secondary', sec]]) {
      if (!(await l.count())) continue;
      const b = await l.evaluate((e) => getComputedStyle(e).backgroundColor);
      await l.hover(); await page.waitForTimeout(300);
      const a = await l.evaluate((e) => getComputedStyle(e).backgroundColor);
      await page.mouse.move(5, 300);
      out[k] = { before: hexOf(b), after: hexOf(a) };
    }
    return out;
  }, 'INT12', R);
  // ---- INT6 tooltip no sparkline
  R.INT6 = await safe(async () => {
    const sp = page.locator(`${cfg.kpi} ${cfg.spark}`).first();
    const bb = await sp.boundingBox();
    await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5); await page.waitForTimeout(150);
    await page.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.5); await page.waitForTimeout(400);
    const tip = await page.evaluate((cfg) => {
      const k = document.querySelector(cfg.kpi);
      const cands = Array.from(k.querySelectorAll('[class*="tip"], [role=tooltip]')).concat(Array.from(document.querySelectorAll('[role=tooltip]')));
      const v = cands.find((e) => { const r = e.getBoundingClientRect(); return !e.hidden && r.width > 2 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none' && /\d/.test(e.textContent); });
      return v ? v.textContent.trim().slice(0, 60) : null;
    }, cfg);
    await page.screenshot({ path: `${CAP}/${dev}-int-tooltip.png`, clip: { x: Math.max(0, bb.x - 40), y: Math.max(0, bb.y - 120), width: 360, height: 220 } });
    await page.mouse.move(5, 300);
    return { tip };
  }, 'INT6', R);
  // ---- INT7 relatório do KPI
  R.INT7 = await safe(async () => {
    const card = page.locator(cfg.kpi).first();
    let trigger = card;
    const isBtn = await card.evaluate((e) => e.tagName === 'BUTTON');
    if (!isBtn) {
      // tenta clicar no cartão (fora do botão); se não abrir, usa botão interno
      await card.locator('.kpi-value, [class*="value"]').first().click(); await page.waitForTimeout(400);
      const openedByCard = await page.evaluate(() => !!document.querySelector('dialog[open], [role=dialog]:not([hidden])'));
      if (openedByCard) { R.INT7_openedByCardClick = true; await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
      else R.INT7_openedByCardClick = false;
      trigger = card.locator('button').last();
    } else R.INT7_openedByCardClick = true;
    await trigger.click(); await page.waitForTimeout(600);
    const opened = await page.evaluate(() => { const d = document.querySelector('dialog[open]'); return d ? { title: (d.querySelector('h2') || {}).textContent, txt: d.innerText.slice(0, 200) } : null; });
    await page.screenshot({ path: `${CAP}/${dev}-int-relatorio-kpi.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({ open: !!document.querySelector('dialog[open]'), focus: document.activeElement ? (document.activeElement.className + '|' + document.activeElement.textContent.trim().slice(0, 30)) : null }));
    return { opened, after };
  }, 'INT7', R);
  // ---- INT5 ações por linha
  R.INT5 = await safe(async () => {
    const btn = page.locator(`${T} tbody tr`).first().locator('td:last-child button, th:last-child button').first();
    const label = await btn.evaluate((e) => (e.getAttribute('aria-label') || e.textContent).trim());
    await btn.click(); await page.waitForTimeout(500);
    const opened = await page.evaluate(() => {
      const m = Array.from(document.querySelectorAll('[role=menu]')).find((e) => e.getBoundingClientRect().height > 2);
      const d = document.querySelector('dialog[open]');
      return { menu: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 120) : null, dialog: d ? d.innerText.replace(/\s+/g, ' ').slice(0, 120) : null };
    });
    await page.screenshot({ path: `${CAP}/${dev}-int-acao-linha.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({ menuOpen: !!Array.from(document.querySelectorAll('[role=menu]')).find((e) => e.getBoundingClientRect().height > 2), dialogOpen: !!document.querySelector('dialog[open]'), focusLabel: document.activeElement ? (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent).trim().slice(0, 40) : null }));
    // clique fora
    await btn.click(); await page.waitForTimeout(400);
    let outside = null;
    if (opened.menu) { await page.mouse.click(700, 120); await page.waitForTimeout(300); outside = await page.evaluate(() => !Array.from(document.querySelectorAll('[role=menu]')).find((e) => e.getBoundingClientRect().height > 2)); }
    else { await page.keyboard.press('Escape'); await page.waitForTimeout(200); }
    return { label, opened, after, closesOnOutsideClick: outside };
  }, 'INT5', R);
  // ---- INT9 relógio
  R.INT9 = await safe(async () => {
    const t1 = await page.$eval(cfg.footer, (e) => e.innerText.replace(/\s+/g, ' '));
    await page.waitForTimeout(2200);
    const t2 = await page.$eval(cfg.footer, (e) => e.innerText.replace(/\s+/g, ' '));
    return { t1, t2, changed: t1 !== t2 };
  }, 'INT9', R);
  // ---- DSK8 detalhes da rolagem dos alertas
  R.alertsScroll = await page.evaluate((cfg) => {
    const list = document.querySelector(cfg.alertsList);
    let e = list; const chain = [];
    for (let i = 0; i < 5 && e; i++, e = e.parentElement) { const c = getComputedStyle(e); chain.push({ cls: (e.id || e.className + '').slice(0, 30), oy: c.overflowY, ob: c.overscrollBehaviorY, sh: e.scrollHeight, ch: e.clientHeight, mask: (c.maskImage || c.webkitMaskImage || 'none').slice(0, 50) }); }
    return chain;
  }, cfg);
  // ---- INT8 tempo real
  R.INT8 = await safe(async () => {
    const snap = async () => page.evaluate((cfg) => {
      const l = document.querySelector(cfg.alertsList); const items = Array.from(l.children);
      const shell = document.querySelector(cfg.header).parentElement.getBoundingClientRect();
      const first = items[0];
      return { n: items.length, first: first ? first.innerText.replace(/\s+/g, ' ').slice(0, 60) : null, firstCls: first ? first.className : null, anim: first ? getComputedStyle(first).animationName + ' ' + getComputedStyle(first).animationDuration : null, live: l.getAttribute('aria-live'), shell: [shell.width, shell.height], docV: document.scrollingElement.scrollHeight - innerHeight, panelW: document.querySelector(cfg.panel).getBoundingClientRect().width };
    }, cfg);
    const s0 = await snap();
    let s1 = null; const t0 = Date.now();
    if (dev === 'dev-1') {
      await page.click('#sim-btn'); await page.waitForTimeout(300);
      await page.getByRole('menuitem', { name: /Gerar novo alerta/ }).click();
      await page.waitForTimeout(120); s1 = await snap();
    } else {
      for (let i = 0; i < 70; i++) { await page.waitForTimeout(500); const s = await snap(); if (s.first !== s0.first) { s1 = s; break; } }
    }
    return { before: s0, after: s1, waitedMs: Date.now() - t0 };
  }, 'INT8', R);
  // ---- INT10 foco visível (Tab)
  R.INT10 = await safe(async () => {
    await page.mouse.click(700, 5); // foco na página
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    const out = [];
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(120);
      out.push(await page.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return { el: (e.tagName + ' ' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 20)), outline: c.outlineStyle + ' ' + c.outlineWidth + ' ' + c.outlineColor, offset: c.outlineOffset, shadow: c.boxShadow.slice(0, 80) }; }));
    }
    return out;
  }, 'INT10', R);
  await page.keyboard.press('Escape');
  // ---- DSK10: aba de alertas em 1180x800
  R.DSK10 = await safe(async () => {
    const res = {};
    for (const [w, h] of [[1180, 800], [1024, 768]]) {
      await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(600);
      const tab = page.locator(`${cfg.dtabs} [role=tab]`).nth(1);
      const vis0 = await page.evaluate((cfg) => { const p = document.querySelector(cfg.panel).getBoundingClientRect(); const c = document.querySelector(cfg.content).getBoundingClientRect(); return { panel: p.width > 2 && p.height > 2, content: c.width > 2 && c.height > 2 }; }, cfg);
      await tab.click(); await page.waitForTimeout(400);
      const vis1 = await page.evaluate((cfg) => { const p = document.querySelector(cfg.panel).getBoundingClientRect(); const c = document.querySelector(cfg.content).getBoundingClientRect(); const sel = Array.from(document.querySelectorAll(cfg.dtabs + ' [role=tab]')).map((t) => t.getAttribute('aria-selected')); return { panel: p.width > 2 && p.height > 2, panelW: p.width, content: c.width > 2 && c.height > 2, sel, docV: document.scrollingElement.scrollHeight - innerHeight }; }, cfg);
      await page.screenshot({ path: `${CAP}/${dev}-${w}x${h}-aba-alertas.png` });
      await page.locator(`${cfg.dtabs} [role=tab]`).nth(0).click(); await page.waitForTimeout(300);
      res[w] = { before: vis0, afterAlertTab: vis1 };
    }
    return res;
  }, 'DSK10', R);
  R.consoleErrors = consoleErr.slice(0, 10);
  await ctx.close();

  // ---- INT4 estados (carregando / vazio / erro)
  R.INT4 = await safe(async () => {
    const res = {};
    const c2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await c2.newPage();
    const tableState = async () => p.evaluate((cfg) => {
      const t = document.querySelector(cfg.table); const card = t.closest('section') || t.parentElement.parentElement;
      const sk = card.querySelectorAll('[class*="skel"]').length + document.querySelectorAll(cfg.table + ' [class*="skel"]').length;
      const st = Array.from(card.querySelectorAll('[class*="state"], [role=alert], [role=status]')).filter((e) => !e.hidden && e.getBoundingClientRect().height > 2).map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 80));
      return { skeletons: sk, states: st };
    }, cfg);
    if (dev === 'dev-3') {
      for (const est of ['carregando', 'vazio', 'erro']) {
        await p.goto(cfg.url + '?estado=' + est, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(est === 'carregando' ? 800 : 2500);
        res[est] = await tableState();
        await p.screenshot({ path: `${CAP}/${dev}-estado-${est}.png` });
      }
    } else if (dev === 'dev-1') {
      await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(150);
      res.carregando = await tableState();
      await p.waitForTimeout(3000);
      await p.click('#sim-btn'); await p.waitForTimeout(250); await p.getByRole('menuitem', { name: /Esvaziar/ }).click(); await p.waitForTimeout(600);
      res.vazio = await tableState(); await p.screenshot({ path: `${CAP}/${dev}-estado-vazio.png` });
      await p.click('#sim-btn'); await p.waitForTimeout(250); await p.getByRole('menuitem', { name: /Restaurar|Esvaziar/ }).first().click(); await p.waitForTimeout(600);
      await p.click('#sim-btn'); await p.waitForTimeout(250); await p.getByRole('menuitem', { name: /falha de conex/ }).click(); await p.waitForTimeout(800);
      res.erro = await tableState(); await p.screenshot({ path: `${CAP}/${dev}-estado-erro.png` });
    } else {
      await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(150);
      res.carregandoInicial = await tableState();
      await p.waitForTimeout(3000);
      for (const [k, name] of [['carregando', 'Carregando'], ['vazio', 'Vazio'], ['erro', 'Erro de conexão']]) {
        await p.click('#btn-sim'); await p.waitForTimeout(250);
        await p.getByRole('menuitemradio', { name }).or(p.getByRole('menuitem', { name })).first().click(); await p.waitForTimeout(500);
        res[k] = await tableState(); await p.screenshot({ path: `${CAP}/${dev}-estado-${k}.png` });
      }
    }
    await c2.close();
    return res;
  }, 'INT4', R);

  // ---- INT11 reduced motion
  R.INT11 = await safe(async () => {
    const c3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const p = await c3.newPage(); await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      let hasRule = false;
      for (const s of Array.from(document.styleSheets)) { let rules; try { rules = s.cssRules; } catch (e) { continue; } for (const ru of Array.from(rules)) if (ru.media && /prefers-reduced-motion/.test(ru.media.mediaText)) hasRule = true; }
      const b = document.querySelector('button'); const c = getComputedStyle(b);
      return { hasRule, btnTransition: c.transitionDuration };
    });
    await c3.close(); return r;
  }, 'INT11', R);
}

async function mobile(browser, dev, cfg, R) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  const tabs = page.locator(`${cfg.mtabs} [role=tab]`);
  const n = await tabs.count();
  R.MOB = { tabs: [] };
  R.MOB.safeArea = await page.evaluate(() => {
    let found = []; for (const s of Array.from(document.styleSheets)) { let rules; try { rules = s.cssRules; } catch (e) { continue; } const walk = (rs) => Array.from(rs).forEach((ru) => { if (ru.cssRules) walk(ru.cssRules); if (ru.cssText && /safe-area-inset-top/.test(ru.cssText)) found.push(ru.selectorText || (ru.cssText.slice(0, 60))); }); walk(rules); }
    return found.slice(0, 8);
  });
  R.MOB.dvh = await page.evaluate(() => {
    let found = []; for (const s of Array.from(document.styleSheets)) { let rules; try { rules = s.cssRules; } catch (e) { continue; } const walk = (rs) => Array.from(rs).forEach((ru) => { if (ru.cssRules) walk(ru.cssRules); if (ru.cssText && /100dvh/.test(ru.cssText)) found.push((ru.selectorText || '') + ' {' + (ru.style ? ru.style.height + '|' + ru.style.minHeight : '') + '}'); }); walk(rules); }
    return found.slice(0, 6);
  });
  for (let i = 0; i < n; i++) {
    await tabs.nth(i).tap(); await page.waitForTimeout(500);
    const st = await page.evaluate((cfg) => {
      const sel = Array.from(document.querySelectorAll(cfg.mtabs + ' [role=tab]')).map((t) => t.getAttribute('aria-selected'));
      const panels = Array.from(document.querySelectorAll('[role=tabpanel]')).filter((p) => !p.hidden && p.getBoundingClientRect().height > 2).map((p) => p.id);
      const shell = document.querySelector(cfg.header).parentElement.getBoundingClientRect();
      const t = document.querySelector(cfg.table); const tv = t && t.getBoundingClientRect().height > 2 && getComputedStyle(t).display !== 'none';
      let tableInfo = null;
      if (tv) {
        const sc = t.parentElement; const th = t.querySelector('thead th:nth-child(2)'); const td = t.querySelector('tbody tr td:nth-child(2), tbody tr th:nth-child(2)');
        tableInfo = { scrollerOX: getComputedStyle(sc).overflowX, scrollW: sc.scrollWidth, clientW: sc.clientWidth, thPos: th && getComputedStyle(th).position, tdPos: td && getComputedStyle(td).position, tdLeft: td && getComputedStyle(td).left };
      }
      const cards = Array.from(document.querySelectorAll('.order-card, .tbl-card, [class*="order-card"], tbody tr')).filter((e) => e.getBoundingClientRect().height > 2 && getComputedStyle(e).display !== 'table-row').length;
      return { sel, panels, shellH: shell.height, docV: document.scrollingElement.scrollHeight - innerHeight, docH: document.scrollingElement.scrollWidth - innerWidth, tableVisible: !!tv, tableInfo, cardLike: cards, text: document.querySelector(cfg.content).innerText.slice(0, 60) };
    }, cfg);
    st.defects = await page.evaluate(pageDefects, { touch: true });
    st.name = (await tabs.nth(i).innerText()).replace(/\s+/g, ' ');
    await page.screenshot({ path: `${CAP}/${dev}-390x844-aba${i + 1}.png` });
    R.MOB.tabs.push(st);
  }
  // teclado: setas
  await tabs.nth(0).tap(); await page.waitForTimeout(300);
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300);
  R.MOB.arrowRight = await page.evaluate((cfg) => ({ sel: Array.from(document.querySelectorAll(cfg.mtabs + ' [role=tab]')).map((t) => t.getAttribute('aria-selected')), focus: document.activeElement.textContent.trim().slice(0, 20) }), cfg);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(300);
  R.MOB.arrowLeft = await page.evaluate((cfg) => ({ sel: Array.from(document.querySelectorAll(cfg.mtabs + ' [role=tab]')).map((t) => t.getAttribute('aria-selected')), focus: document.activeElement.textContent.trim().slice(0, 20) }), cfg);
  R.MOB.aria = await page.evaluate((cfg) => { const tl = document.querySelector(cfg.mtabs); return { role: tl.getAttribute('role'), tabsRole: Array.from(tl.children).map((c) => c.getAttribute('role')), controls: Array.from(tl.querySelectorAll('[role=tab]')).map((t) => t.getAttribute('aria-controls')) }; }, cfg);
  await ctx.close();
}

(async () => {
  const only = process.argv[2];
  const browser = await chromium.launch();
  for (const [dev, cfg] of Object.entries(SITES)) {
    if (only && only !== dev) continue;
    const R = { errors: [] };
    await desktop(browser, dev, cfg, R);
    await safe(() => mobile(browser, dev, cfg, R), 'mobile', R);
    fs.writeFileSync(path.join(OUT, dev + '-interacoes.json'), JSON.stringify(R, null, 1));
    console.log(dev, 'ok', R.errors);
  }
  await browser.close();
})();
