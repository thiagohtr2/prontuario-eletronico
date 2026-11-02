const { chromium } = require('playwright');
const fs = require('fs');
const css = fs.readFileSync(process.argv[2], 'utf8');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const r = await p.evaluate((css) => {
    const s = new CSSStyleSheet(); s.replaceSync(css);
    const rules = [...s.cssRules].map(r => r.cssText.slice(0, 60));
    const root = [...s.cssRules].find(r => r.selectorText === ':root');
    const vars = []; for (let i = 0; i < root.style.length; i++) vars.push(root.style[i]);
    const tests = {
      'calc(100dvh − 64 px) [prompt]': CSS.supports('height', 'calc(100dvh − 64 px)'),
      'calc(100dvh - 64px)': CSS.supports('height', 'calc(100dvh - 64px)'),
      'min(85vw, 280 px) [prompt]': CSS.supports('width', 'min(85vw, 280 px)'),
      'calc(100vw − 16 px) [prompt]': CSS.supports('max-width', 'calc(100vw − 16 px)'),
      'font-weight: 640': CSS.supports('font-weight', '640'),
    };
    // apply to doc to see checkbox effect
    document.adoptedStyleSheets = [s];
    document.body.innerHTML = '<input type="checkbox" id="c"><input type="radio" id="r"><input type="range" id="g"><input id="t">';
    const m = id => { const e = document.getElementById(id); const cs = getComputedStyle(e); return { h: e.getBoundingClientRect().height, minH: cs.minHeight, border: cs.borderTopWidth + ' ' + cs.borderTopStyle, radius: cs.borderTopLeftRadius }; };
    return { nRules: s.cssRules.length, rules, nVars: vars.length, tests, checkbox: m('c'), radio: m('r'), range: m('g'), text: m('t') };
  }, css);
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
