const { open, dump, controls, C, BASE } = require('./lib.cjs');
(async () => {
  const { ctx, page, logs, close } = await open();
  await page.goto(BASE + '#/guiado/componentes', { waitUntil: 'networkidle' }); await page.getByText('Escolha pelos olhos.').first().waitFor(); await page.waitForTimeout(1000);
  const info = await page.evaluate(() => { const titles=[...document.querySelectorAll('main *')].filter(e=>/^\d+\. /.test((e.innerText||'').trim()) && e.children.length===0); return titles.map(t=>{ let card=t; for(let i=0;i<6;i++){ card=card.parentElement; if(card.querySelector('button') && card.innerText.includes('Adicionar ao projeto')) break; } const btns=[...card.querySelectorAll('button, a, span, div')].filter(b=>/^começar agora$/i.test((b.innerText||'').trim()) && b.children.length<=2); const b=btns[btns.length-1]; if(!b) return t.innerText+' : ?'; const s=getComputedStyle(b); return `${t.innerText} : radius=${s.borderRadius} h=${Math.round(b.getBoundingClientRect().height)} bg=${s.backgroundColor} ff=${s.fontFamily.split(',')[0]} fs=${s.fontSize} shadow=${s.boxShadow==='none'?'none':'yes'}`; }); });
  console.log(info.join('\n'));
  // crop 4 similar families
  const names = ['1. Soft Pill','7. Soft Neumorphic','9. Bento Soft','16. Modern Material','8. Apple Precision','13. Compact Pro'];
  for (const n of names) { const t = page.locator('main').getByText(n, { exact: true }); const card = t.locator('xpath=ancestor::*[.//button[contains(., "Adicionar ao projeto")]][1]'); await card.scrollIntoViewIfNeeded(); await card.screenshot({ path: C + `38-botao-${n.replace(/\W+/g,'')}.png` }); }
  console.log('LOGS', logs.join('\n'));
  await close();
})();
