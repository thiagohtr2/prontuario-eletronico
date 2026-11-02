const L = require('./lib');
const sy = p => p.evaluate(() => Math.round(scrollY));
(async () => {
  const { ctx, page } = await L.open('perfil', 'android');
  await page.goto('http://127.0.0.1:4300/#/guiado/entrada', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.getByRole('tab', { name: /Landing page/ }).tap(); await page.waitForTimeout(600);
  const m = await L.measure(page);
  for (const x of m.filter(x => x.y > 400 && x.y < 2600)) console.log(JSON.stringify(x));
  // touch scroll via CDP gesture
  const cdp = await ctx.newCDPSession(page);
  L.log('A16 arrastar o dedo para rolar a lista de modelos (gesto touch 3x)');
  for (let i = 0; i < 3; i++) { await cdp.send('Input.synthesizeScrollGesture', { x: 180, y: 600, yDistance: -600, gestureSourceType: 'touch', speed: 1200 }); }
  await page.waitForTimeout(500);
  console.log('scroll apos gesto', await sy(page));
  await L.shot(page, '13-landing-lista-rolada');
  const sel = await page.evaluate(() => { const e = [...document.querySelectorAll('*')].find(x => x.children.length < 4 && /Landing selecionada/.test(x.innerText || '')); if (!e) return null; const r = e.getBoundingClientRect(); return { y: Math.round(r.y + scrollY), h: Math.round(r.height), txt: e.innerText.slice(0, 80), pos: getComputedStyle(e).position, disp: getComputedStyle(e).display }; });
  console.log('LANDING SELECIONADA box', JSON.stringify(sel));
  await ctx.close();
})();
