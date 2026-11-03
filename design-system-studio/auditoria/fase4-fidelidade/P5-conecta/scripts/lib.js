// Utilitários comuns da auditoria de fidelidade P5.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const CFG = require('./config');

const OUT = path.resolve(__dirname, '..');
const CAP = path.join(OUT, 'capturas');
const DATA = path.join(__dirname, 'out');
fs.mkdirSync(CAP, { recursive: true });
fs.mkdirSync(DATA, { recursive: true });

const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

// Funções injetadas na página (window.__m)
const INPAGE = () => {
  const r2 = (n) => Math.round(n * 10) / 10;
  const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height), right: r2(r.right), bottom: r2(r.bottom) }; };
  const vis = (el) => { if (!el) return false; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05 && r.width > 0 && r.height > 0; };
  const style = (el, props) => { if (!el) return null; const cs = getComputedStyle(el); const o = {}; for (const p of props) o[p] = cs.getPropertyValue(p); return o; };
  const q = (s) => document.querySelector(s);
  const visibleBox = (el) => {
    // primeiro elemento (o próprio ou descendente) que tem fundo/sombra visível e largura > 150
    if (!el) return null;
    const cands = [el, ...el.querySelectorAll('*')].filter((e) => {
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      return r.width > 150 && r.height > 30 && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.boxShadow !== 'none' || (cs.backdropFilter && cs.backdropFilter !== 'none'));
    });
    return cands[0] || el;
  };
  const text = (el) => (el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : '');
  const interactive = () => [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex="-1"])')].filter(vis);
  const inViewport = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const overflowX = () => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, bodySw: document.body.scrollWidth, over: document.documentElement.scrollWidth > innerWidth + 1 });
  const cutTexts = () => {
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      if (!vis(e) || !e.childNodes.length) continue;
      const hasText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const cs = getComputedStyle(e);
      const clipsX = (cs.overflowX !== 'visible' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1;
      const clipsY = cs.overflowY === 'hidden' && e.scrollHeight > e.clientHeight + 2 && !cs.webkitLineClamp?.match(/^\d/);
      const clamped = cs.webkitLineClamp && cs.webkitLineClamp !== 'none';
      if ((clipsX || clipsY) && inViewport(e)) out.push({ tag: e.tagName, cls: String(e.className).slice(0, 50), t: text(e).slice(0, 50), clamped: !!clamped, sw: e.scrollWidth, cw: e.clientWidth, sh: e.scrollHeight, ch: e.clientHeight });
    }
    return out.slice(0, 30);
  };
  const smallTargets = (rootSel) => {
    const root = rootSel ? document.querySelector(rootSel) : document;
    if (!root) return [];
    return [...root.querySelectorAll('a[href], button, input:not([type=hidden]), [role=tab], [role=button], label.segmento__opcao, [role=radio]')].filter((e) => vis(e) && inViewport(e)).map((e) => {
      const r = e.getBoundingClientRect();
      const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.closest('p');
      return { tag: e.tagName, label: (e.getAttribute('aria-label') || text(e)).slice(0, 40), w: r2(r.width), h: r2(r.height), inline: !!inline };
    }).filter((t) => (t.w < 44 || t.h < 44));
  };
  const rootVars = () => {
    const out = {};
    for (const sh of document.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      for (const r of rules) {
        if (r.selectorText && /(^|,)\s*:root\s*($|,)/.test(r.selectorText)) {
          for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; if (p.startsWith('--')) out[p] = r.style.getPropertyValue(p).trim(); }
        }
      }
    }
    return out;
  };
  const cssText = () => {
    let t = '';
    const walk = (rules, media) => {
      for (const r of rules) {
        if (r.cssRules && !r.selectorText) walk(r.cssRules, (r.conditionText || r.media?.mediaText || ''));
        else t += (media ? '@media(' + media + ') ' : '') + r.cssText + '\n';
      }
    };
    for (const sh of document.styleSheets) { try { walk(sh.cssRules, ''); } catch (e) {} }
    return t;
  };
  window.__m = { box, vis, style, q, visibleBox, text, interactive, overflowX, cutTexts, smallTargets, rootVars, cssText, inViewport };
};

async function newCtx(browser, kind, extra = {}) {
  const presets = {
    m390: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: MOBILE_UA },
    m360: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: MOBILE_UA },
    m320: { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: MOBILE_UA },
    land: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: MOBILE_UA },
    t768: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 1 },
    d1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  };
  const ctx = await browser.newContext({ locale: 'pt-BR', ...(presets[kind] || kind), ...extra });
  await ctx.addInitScript(INPAGE);
  // Google Fonts bloqueado para evitar espera de rede; a Inter está instalada localmente na máquina.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  return ctx;
}

async function openLogin(ctx, site, query = '') {
  const c = CFG[site];
  const page = await ctx.newPage();
  page.__errors = [];
  page.on('pageerror', (e) => page.__errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.__errors.push('console: ' + m.text()); });
  await page.goto(`http://127.0.0.1:${c.port}/index.html${query}`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  return page;
}

async function login(page, site) {
  const c = CFG[site];
  await page.fill(c.loginEmail, c.email);
  await page.fill(c.loginPass, c.pass);
  await page.click(c.loginSubmit);
  await page.waitForFunction(() => { const a = document.getElementById('app'); return a && !a.hidden && getComputedStyle(a).display !== 'none'; }, null, { timeout: 8000 });
  await page.waitForTimeout(1500);
}

module.exports = { chromium, CFG, OUT, CAP, DATA, newCtx, openLogin, login, fs, path };
