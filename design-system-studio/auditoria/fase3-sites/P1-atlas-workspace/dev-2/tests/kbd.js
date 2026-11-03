const L = require('./lib');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL:', m); } else console.log('ok  :', m); };
(async () => {
  let { browser, page } = await L.launch({ width: 1280, height: 800 });
  await L.login(page);
  // foco visível nos itens da sidebar
  await page.focus('.nav-item[data-route=tarefas]');
  await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab');
  const o = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement); return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.outlineOffset]; });
  ok(o[0] === 'solid' && o[1] === '2px' && o[3] === '2px', 'anel de foco 2px/offset 2px na sidebar: ' + o.join(' '));
  // Enter em item de nav navega
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  ok(page.url().endsWith('#/tarefas'), 'Enter ativa item da sidebar');
  ok(await page.evaluate(() => document.activeElement.tagName) === 'H1', 'foco vai ao h1 após navegar');
  // menu por teclado: Enter abre, setas navegam, Esc fecha e devolve foco
  await page.focus('#avatar-btn'); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
  await page.keyboard.press('ArrowDown');
  ok(await page.evaluate(() => document.activeElement.textContent.trim()) === 'Configurações', 'setas navegam no menu');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => document.activeElement.id) === 'avatar-btn', 'Esc devolve foco ao avatar');
  // tablet overlay: Tab fica preso
  await page.setViewportSize({ width: 900, height: 800 }); await page.waitForTimeout(300);
  await page.focus('#sb-toggle'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  const seq = [];
  for (let i = 0; i < 16; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => !!document.activeElement.closest('#sidebar'))); }
  ok(seq.every(Boolean), 'overlay prende o foco (16 Tabs permanecem na sidebar)');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => document.activeElement.id) === 'sb-toggle', 'overlay devolve foco ao botão');
  await browser.close();
  // mobile: sheet prende foco
  ({ browser, page } = await L.launch({ width: 390, height: 800 }, { mobile: true, touch: true }));
  await L.login(page);
  await page.tap('#bn-more'); await page.waitForSelector('.dialog');
  const seq2 = [];
  for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); seq2.push(await page.evaluate(() => !!document.activeElement.closest('.dialog'))); }
  ok(seq2.every(Boolean), 'sheet Mais prende o foco');
  await page.tap('.dialog [data-close]');
  ok(await page.evaluate(() => document.activeElement.id) === 'bn-more', 'botão ✕ fecha e devolve foco');
  await page.tap('#bn-more'); await page.waitForSelector('.dialog'); await page.mouse.click(195, 30); await page.waitForTimeout(200);
  ok(await page.locator('.dialog').count() === 0, 'toque fora fecha');
  await browser.close();
  console.log(fails ? fails + ' FALHAS' : 'ok');
})();
