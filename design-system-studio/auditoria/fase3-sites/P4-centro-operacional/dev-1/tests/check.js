// Verificação automatizada de layout (Playwright).
// Uso: na raiz do projeto, rode `python3 -m http.server 4441` e depois
//      node tests/check.js [--shots]   (capturas vão para tests/shots/)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE || 'http://localhost:4441/index.html';
const SHOTS = process.argv.includes('--shots');
const outDir = path.join(__dirname, 'shots');
if (SHOTS) fs.mkdirSync(outDir, { recursive: true });

const sizes = [
  [320, 568], [344, 882], [360, 640], [375, 667], [390, 844], [412, 915], [430, 932],
  [480, 800], [600, 960], [667, 375], [740, 360], [768, 1024], [820, 1180], [844, 390],
  [1024, 768], [1180, 820], [1280, 800], [1280, 600], [1366, 768], [1440, 900], [1536, 864],
  [1920, 1080], [2560, 1440]
];

(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  for (const [w, h] of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text())) errors.push(m.text()); });
    await page.goto(BASE);
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const mode = document.getElementById('app').dataset.mode;
      const bodyOverflow = getComputedStyle(document.body).overflowY;
      const hOverflow = de.scrollWidth > window.innerWidth + 0.5;
      const vScroll = de.scrollHeight > window.innerHeight + 0.5;
      // elementos visíveis que ultrapassam a viewport na horizontal
      const offenders = [];
      document.querySelectorAll('body *').forEach((el) => {
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
        const rc = el.getBoundingClientRect();
        if (!rc.width || !rc.height) return;
        // ignora conteúdo dentro de contêineres com rolagem horizontal local
        let p = el.parentElement, inScroller = false;
        while (p && p !== document.body) {
          const ps = getComputedStyle(p);
          if (/(auto|scroll)/.test(ps.overflowX) && p.scrollWidth > p.clientWidth) { inScroller = true; break; }
          p = p.parentElement;
        }
        if (inScroller) return;
        if (rc.right > window.innerWidth + 1 || rc.left < -1) offenders.push((el.id ? '#' + el.id : el.className || el.tagName) + ' ' + Math.round(rc.left) + '→' + Math.round(rc.right));
      });
      // textos cortados (overflow hidden com conteúdo maior)
      const clipped = [];
      document.querySelectorAll('.app *').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none') return;
        if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
        if (cs.clip === 'rect(0px, 0px, 0px, 0px)') return; // padrão visualmente oculto (leitor de tela)
        if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) clipped.push((el.id ? '#' + el.id : el.className) + ' sw=' + el.scrollWidth + ' cw=' + el.clientWidth);
      });
      const tabsVisible = [...document.querySelectorAll('[role=tablist]')].filter((t) => t.offsetParent !== null).map((t) => t.id);
      const panelVisible = document.getElementById('panel').offsetParent !== null && !document.getElementById('panel').hidden;
      return { mode, bodyOverflow, hOverflow, vScroll, offenders: offenders.slice(0, 8), clipped: clipped.slice(0, 8), tabsVisible, panelVisible };
    });
    const oneScreen = r.mode === 'full' || r.mode === 'compact' || (r.mode === 'mobile' && h >= 560);
    const bad = r.hOverflow || r.offenders.length || r.clipped.length || errors.length || (oneScreen && r.vScroll);
    if (bad) problems++;
    console.log(`${bad ? 'FAIL' : 'ok  '} ${w}x${h} mode=${r.mode} oneScreen=${oneScreen} bodyScroll=${r.vScroll} hOverflow=${r.hOverflow} tabs=${r.tabsVisible.join(',') || '-'} panel=${r.panelVisible}` +
      (r.offenders.length ? `\n     offenders: ${r.offenders.join(' | ')}` : '') +
      (r.clipped.length ? `\n     clipped: ${r.clipped.join(' | ')}` : '') +
      (errors.length ? `\n     errors: ${errors.join(' | ')}` : ''));
    if (SHOTS) await page.screenshot({ path: path.join(outDir, `${w}x${h}.png`) });
    await page.close();
  }
  await browser.close();
  console.log(problems ? `\n${problems} tamanho(s) com problema` : '\nTodos os tamanhos ok');
  process.exit(problems ? 1 : 0);
})();
