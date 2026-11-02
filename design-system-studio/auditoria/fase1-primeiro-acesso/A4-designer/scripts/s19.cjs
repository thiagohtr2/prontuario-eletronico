const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  await page.getByPlaceholder('Buscar por nome, clima ou cor…').fill('Oceano');
  await page.waitForTimeout(500);
  const card = page.locator('main button[aria-pressed]').filter({ hasText: 'Oceano Profundo' });
  await card.click(); await page.waitForTimeout(800);
  await page.screenshot({ path: C + '24-cores-oceano.png' });
  // swatch colors in the card
  const sw = await page.evaluate(() => { const b=[...document.querySelectorAll('main button[aria-pressed]')].find(x=>x.innerText.includes('Oceano Profundo')); return [...b.querySelectorAll('*')].filter(e=>e.children.length===0 && e.getBoundingClientRect().height>=20 && e.getBoundingClientRect().width>=30).map(e=>getComputedStyle(e).backgroundColor).join(', '); });
  console.log('swatches', sw);
  // preview measurements
  const pv = await page.evaluate(() => { const out={}; const find=(t)=>[...document.querySelectorAll('main *')].find(e=>e.children.length<=1 && e.innerText && e.innerText.trim()===t); for (const t of ['Primário','Hover','Secundário','Destaque','Desabilitado','Visão geral','Marca','Início']) { const e=find(t); if(!e) continue; const el = e.closest('button')||e; const s=getComputedStyle(el); const r=el.getBoundingClientRect(); out[t]={bg:s.backgroundColor,color:s.color,radius:s.borderRadius,font:s.fontFamily.slice(0,40),fs:s.fontSize,fw:s.fontWeight,h:Math.round(r.height),border:s.borderColor}; } const inp=[...document.querySelectorAll('main input')].find(i=>i.placeholder==='Placeholder…'); if(inp){const s=getComputedStyle(inp); out.input={radius:s.borderRadius,border:s.borderColor,h:inp.getBoundingClientRect().height,bg:s.backgroundColor};} return out; });
  console.log(JSON.stringify(pv, null, 1));
  // Clear search
  await page.getByPlaceholder('Buscar por nome, clima ou cor…').fill('');
  await page.getByRole('tab', { name: 'Ajustar cores' }).click(); await page.waitForTimeout(800);
  await page.screenshot({ path: C + '25-ajustar-cores.png', fullPage: true });
  await dump(page, 4000);
  await controls(page);
  console.log('LOGS', logs.join('\n'));
  await close();
})();
