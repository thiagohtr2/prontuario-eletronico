const L = require('./lib');
const eff = (sel) => (root) => {};
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  const measureEff = () => page.evaluate(() => {
    const res = {};
    const cards = [...document.querySelectorAll('main button[aria-pressed], main [role=radio], main .lay-mob-grid button')].filter(b => b.getBoundingClientRect().height > 150).slice(0, 4);
    const hist = {};
    for (const c of cards) { const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; const r = el.getBoundingClientRect(); if (!r.width) continue; const f = parseFloat(getComputedStyle(el).fontSize); const lh = r.height; let s = 1, p = el; while (p && p !== c.parentElement) { const tr = getComputedStyle(p).transform; if (tr && tr !== 'none') { const m = tr.match(/matrix\(([^,]+)/); if (m) s *= parseFloat(m[1]); } const z = parseFloat(getComputedStyle(p).zoom || 1); if (z && z !== 1) s *= z; p = p.parentElement; } const e = Math.round(f * s * 10) / 10; hist[e] = (hist[e] || 0) + t.length; } }
    return hist;
  });
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  L.log('A65 (medição) abrir aba Landing para medir texto das miniaturas');
  await page.getByRole('tab', { name: /Landing page/ }).tap(); await page.waitForTimeout(800);
  console.log('LANDING miniaturas fonte efetiva (px: caracteres)', JSON.stringify(await measureEff()));
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  console.log('MOBILE carrossel (px: caracteres)', JSON.stringify(await measureEff()));
  const thumbs = await page.evaluate(() => { const b = document.querySelector('.lay-mob-grid button'); const r = b.getBoundingClientRect(); const img = b.querySelector('svg, img, div'); return { card: Math.round(r.width) + 'x' + Math.round(r.height) }; });
  console.log('MOBILE card', JSON.stringify(thumbs));
  await ctx.close();
})();
