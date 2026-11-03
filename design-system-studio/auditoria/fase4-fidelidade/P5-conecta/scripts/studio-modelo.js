// Mede no DOM do Studio (navegador limpo, contexto descartável) a prévia do layout mobile
// "Stories com dock e drawer lateral" para servir de modelo de referência.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 }, locale: 'pt-BR' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const card = page.getByText('Stories com dock e drawer lateral', { exact: true }).first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await page.waitForTimeout(800);
  const phone = page.getByRole('group', { name: /^Prévia do celular/ }).first();
  await phone.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const m = await phone.evaluate((root) => {
    const r0 = root.getBoundingClientRect();
    const out = { phone: [r0.width, r0.height] };
    const all = [...root.querySelectorAll('*')];
    const nav = root.querySelector('nav');
    const pick = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return { tag: el.tagName, cls: el.className && el.className.baseVal === undefined ? String(el.className).slice(0, 80) : '', x: Math.round(r.x - r0.x), y: Math.round(r.y - r0.y), w: Math.round(r.width), h: Math.round(r.height), radius: cs.borderRadius, bg: cs.backgroundColor, shadow: cs.boxShadow.slice(0, 80), pos: cs.position }; };
    out.navs = [...root.querySelectorAll('nav')].map(pick);
    // screen = largest descendant with overflow hidden and rounded
    out.cands = all.filter(e => { const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 600; }).slice(0, 6).map(pick);
    const btnMenu = [...root.querySelectorAll('button')].find(b => /Abrir menu/.test(b.getAttribute('aria-label') || b.textContent));
    out.menuBtn = pick(btnMenu);
    out.header = pick(btnMenu && btnMenu.closest('header, [class*=top]'));
    const story = all.find(e => /Novidades/.test(e.textContent) && e.children.length > 3 && e.getBoundingClientRect().height < 140);
    out.stories = pick(story);
    return out;
  });
  console.log(JSON.stringify(m, null, 1));
  await phone.getByRole('button', { name: 'Abrir menu' }).click();
  await page.waitForTimeout(800);
  const d = await phone.evaluate((root) => {
    const r0 = root.getBoundingClientRect();
    const dlg = root.querySelector('[role=dialog], aside, [class*=drawer]');
    if (!dlg) return null; const r = dlg.getBoundingClientRect(); const cs = getComputedStyle(dlg);
    return { tag: dlg.tagName, x: Math.round(r.x - r0.x), y: Math.round(r.y - r0.y), w: Math.round(r.width), h: Math.round(r.height), radius: cs.borderRadius, bg: cs.backgroundColor };
  });
  console.log('drawer', JSON.stringify(d));
  await b.close();
})();
