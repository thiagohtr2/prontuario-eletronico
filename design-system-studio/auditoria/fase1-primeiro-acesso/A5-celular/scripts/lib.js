const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = path.resolve(__dirname, '..');
const UA_ANDROID = 'Mozilla/5.0 (Linux; Android 13; SM-A135M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const UA_IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const DEVICES = {
  android: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: UA_ANDROID },
  iphone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: UA_IPHONE },
  landscape: { viewport: { width: 800, height: 360 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: UA_ANDROID },
};
const LOG = path.join(BASE, 'scripts', 'interacoes.log');
function log(msg) { fs.appendFileSync(LOG, new Date().toISOString() + ' ' + msg + '\n'); console.log('[I] ' + msg); }
async function open(profile, dev, extra = {}) {
  const ctx = await chromium.launchPersistentContext(path.join(BASE, profile), { ...DEVICES[dev], acceptDownloads: true, ...extra });
  const page = ctx.pages()[0] || await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE ERR:', m.text().slice(0, 200)); });
  page.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0, 200)));
  return { ctx, page };
}
async function shot(page, name, full = false) {
  const p = path.join(BASE, 'capturas', name + '.png');
  await page.screenshot({ path: p, fullPage: full });
  console.log('SHOT', p);
}
async function measure(page, label = '') {
  return page.evaluate((label) => {
    const sel = 'a,button,input,select,textarea,summary,label,[role=button],[role=tab],[role=radio],[role=checkbox],[role=option],[role=menuitem],[role=switch],[tabindex]:not([tabindex="-1"]),[onclick]';
    const vw = innerWidth, vh = innerHeight;
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (r.right <= 0 || r.left >= vw) continue;
      const txt = (el.getAttribute('aria-label') || el.innerText || el.value || el.placeholder || el.title || '').trim().replace(/\s+/g, ' ').slice(0, 50);
      out.push({ tag: el.tagName.toLowerCase(), type: el.type || el.getAttribute('role') || '', txt, x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height), fs: cs.fontSize, small: (r.width < 44 || r.height < 44), offscreenX: (r.right > vw + 1 || r.left < -1) });
    }
    return out;
  }, label);
}
async function fonts(page) {
  return page.evaluate(() => {
    const hist = {}; const smallSamples = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (r.right <= 0 || r.left >= innerWidth) continue;
      const f = parseFloat(cs.fontSize);
      hist[f] = (hist[f] || 0) + t.length;
      if (f < 12 && smallSamples.length < 40) smallSamples.push(f + 'px: ' + t.slice(0, 40));
    }
    return { hist, smallSamples };
  });
}
async function overflow(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const sw = document.scrollingElement.scrollWidth;
    const wide = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 2) {
        // ignore if inside a scroll container that clips
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(cs.overflowX)) { clipped = true; break; } p = p.parentElement; }
        if (!clipped) wide.push(el.tagName.toLowerCase() + '.' + (el.className && el.className.baseVal === undefined ? String(el.className).split(' ')[0] : '') + ' right=' + Math.round(r.right));
      }
    }
    return { vw, sw, overflowX: sw > vw, wide: wide.slice(0, 10) };
  });
}
async function fixedBars(page) {
  return page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'sticky') {
        const r = el.getBoundingClientRect();
        if (r.width && r.height) out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), pos: cs.position, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), txt: el.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) });
      }
    }
    return out;
  });
}
async function text(page, max = 3000) { return (await page.evaluate(() => document.body.innerText)).slice(0, max); }
module.exports = { open, shot, measure, fonts, overflow, fixedBars, text, log, BASE, DEVICES };
