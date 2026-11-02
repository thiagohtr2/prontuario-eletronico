const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/identidade' });
  const p = s.page;
  await p.waitForTimeout(800);
  const b = p.getByRole('button', { name: 'CSS dos tokens' });
  const footer = p.getByRole('button', { name: 'Continuar: Navegação' });
  const r0 = await b.boundingBox(); const f0 = await footer.boundingBox();
  console.log('inicio: botao', JSON.stringify(r0), 'footerBtn', JSON.stringify(f0), 'viewportH 900');
  for (const y of [400, 1200, 3000, 20000]) {
    await p.evaluate(y => window.scrollTo(0, y), y);
    await p.waitForTimeout(300);
    const r = await b.boundingBox();
    const hit = await p.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return el ? (el.closest('button')?.innerText || el.tagName + '.' + el.className).trim().slice(0, 60) : null; }, { x: r.x + r.width / 2, y: r.y + r.height / 2 });
    console.log('scrollY', await p.evaluate(() => scrollY), 'botao y=', Math.round(r.y), 'h=', Math.round(r.height), 'elemento no centro do botão:', hit);
  }
  await s.shot('40-identidade-fim-da-pagina-botoes-css', { dir: 'capturas' });
  await s.done();
})();
