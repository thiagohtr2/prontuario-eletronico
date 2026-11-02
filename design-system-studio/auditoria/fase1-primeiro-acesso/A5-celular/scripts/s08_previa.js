const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.getByRole('tab', { name: /Landing page/ }).tap(); await page.waitForTimeout(600);
  L.log('A16 arrastar o dedo 4x pela lista de modelos');
  for (let i = 0; i < 4; i++) await L.swipe(page, 180, 650, 150);
  console.log('scroll', await sy(page));
  await L.shot(page, '13-landing-lista-rolada-touch');
  // open preview of the cinematic card
  const card = page.getByRole('button', { name: /^VOLTA/ }).first();
  const vp = card.locator('xpath=following::button[contains(., "Ver prévia")][1]');
  await vp.scrollIntoViewIfNeeded();
  const before = await sy(page);
  L.log('A17 tocar "Ver prévia" do modelo VOLTA (página cinematográfica)');
  await vp.tap(); await page.waitForTimeout(1500);
  await L.shot(page, '14-previa-aberta');
  const dlg = await page.evaluate(() => { const d = document.querySelector('[role=dialog], dialog[open]'); if (!d) return null; const r = d.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, txt: d.innerText.slice(0, 600) }; });
  console.log('DIALOG', JSON.stringify(dlg));
  const m = await L.measure(page);
  const dm = await page.evaluate(() => { const d = document.querySelector('[role=dialog], dialog[open]'); if (!d) return []; return [...d.querySelectorAll('button,a,[role=tab],[role=radio],input,select')].map(el => { const r = el.getBoundingClientRect(); return { t: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(el).fontSize, pressed: el.getAttribute('aria-pressed') || el.getAttribute('aria-selected') || el.getAttribute('aria-checked') }; }).filter(o => o.w > 0); });
  for (const x of dm) console.log('DLG BTN', JSON.stringify(x));
  console.log('iframes', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('iframe')].map(f => { const r = f.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y), tr: getComputedStyle(f).transform }; }))));
  console.log('body overflow', await page.evaluate(() => getComputedStyle(document.body).overflow), 'scroll behind', await sy(page), 'before', before);
  await ctx.close();
})();
