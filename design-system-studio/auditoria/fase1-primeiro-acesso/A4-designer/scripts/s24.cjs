const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByRole('tab', { name: 'Tipografia' }).click(); await page.waitForTimeout(800);
  const meas = () => page.evaluate(() => { const f=(t)=>[...document.querySelectorAll('main *')].find(e=>e.children.length===0 && e.innerText && e.innerText.trim()===t); return ['Ana Souza','Visão geral','Primário','Placeholder…'].map(t=>{ const e=f(t) || [...document.querySelectorAll('main input')].find(i=>i.placeholder===t); return t+':'+(e?getComputedStyle(e).fontSize:'?'); }).join(' '); });
  console.log('15px ->', await meas());
  await page.locator('main button[aria-pressed]').filter({ hasText: /^18 px$/ }).click(); await page.waitForTimeout(600);
  console.log('18px ->', await meas());
  await page.locator('main button[aria-pressed]').filter({ hasText: /^16 px$/ }).click(); await page.waitForTimeout(600);
  console.log('16px ->', await meas());
  // Formas e superfícies
  await page.getByRole('tab', { name: 'Formas e superfícies' }).click(); await page.waitForTimeout(1000);
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({ path: C + '29-formas-viewport.png' });
  await page.screenshot({ path: C + '29-formas-full.png', fullPage: true });
  const t = await page.evaluate(() => document.querySelector('main').innerText);
  const i = t.indexOf('Formas e superfícies'); console.log(t.slice(i, i+2500));
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
