const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/navegacao', { waitUntil: 'networkidle' }); await page.getByText('Headers (36)').first().waitFor(); await page.waitForTimeout(800);
  await page.locator('main button').filter({ hasText: /^SaaS\s*12$/ }).click(); await page.waitForTimeout(800);
  const art = page.locator('main article, main section, main .ui-card, main div').filter({ has: page.getByText('Painel de Trabalho', { exact: true }) }).filter({ has: page.getByRole('button', { name: 'Selecionar' }) }).last();
  await art.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
  await art.screenshot({ path: C + '34-header-painel-trabalho.png' });
  await art.getByRole('button', { name: 'Selecionar' }).click(); await page.waitForTimeout(800);
  await art.screenshot({ path: C + '34b-header-selecionado.png' });
  // measure header in preview
  const hm = await art.evaluate(el => { const hdr=[...el.querySelectorAll('header, [class*=header], [class*=hdr]')][0]; if(!hdr) return 'nohdr'; const r=hdr.getBoundingClientRect(); const s=getComputedStyle(hdr); return {h:r.height,w:r.width,bg:s.backgroundColor,cls:hdr.className}; });
  console.log('header', JSON.stringify(hm));
  const chips = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e=>e.children.length<=2 && /^(Header|Sidebar):/.test((e.innerText||'').trim())).map(e=>e.innerText.trim()).slice(0,4));
  console.log(chips);
  // Sidebars tab
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('tab', { name: /Sidebars/ }).or(page.getByRole('button', { name: /Sidebars \(36\)/ })).first().click(); await page.waitForTimeout(1000);
  const filters = await page.evaluate(() => [...document.querySelectorAll('main button')].filter(b=>/\s\d+$/.test(b.innerText.trim())).map(b=>b.innerText.replace(/\s+/g,' ')).join(' | '));
  console.log('sidebar filters', filters);
  const names = await page.evaluate(() => [...document.querySelectorAll('main h3, main h4, main strong')].map(e=>e.innerText).filter(t=>t.length<40).slice(0,60).join(' | '));
  console.log('names', names);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
