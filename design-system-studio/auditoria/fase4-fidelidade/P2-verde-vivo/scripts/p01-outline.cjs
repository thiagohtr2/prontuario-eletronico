// Esboço do DOM (tag.classe + retângulo) para escolher seletores. Uso: node p01-outline.cjs dev-1 desktop '' 'header'
const { chromium, open } = require('./lib.cjs');
(async () => {
  const [site, vp, hash, root, depth] = process.argv.slice(2);
  const browser = await chromium.launch();
  const { page } = await open(browser, site, vp, hash || '');
  const out = await page.evaluate(([root, maxD]) => {
    const lines = [];
    const walk = (el, d) => {
      if (d > maxD) return;
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      if (cs.display === 'none') { lines.push('  '.repeat(d) + el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') + ' [display:none]'); return; }
      const id = el.id ? '#' + el.id : '';
      const txt = el.children.length === 0 ? (el.textContent || '').trim().slice(0, 30) : '';
      lines.push('  '.repeat(d) + el.tagName.toLowerCase() + id + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') + ` ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}` + (txt ? ` "${txt}"` : ''));
      if (el.tagName === 'svg') return;
      for (const c of el.children) walk(c, d + 1);
    };
    document.querySelectorAll(root).forEach(e => walk(e, 0));
    return lines.join('\n');
  }, [root, +(depth || 6)]);
  console.log(out);
  await browser.close();
})();
