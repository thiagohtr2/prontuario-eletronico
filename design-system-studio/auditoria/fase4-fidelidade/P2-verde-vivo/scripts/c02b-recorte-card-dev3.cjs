// Refaz o recorte do card do dev-3 com viewport alta (sem rolagem, evita o header sticky sobre o card).
const { chromium, SITES, path } = require('./lib.cjs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 2800 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(SITES['dev-3'] + '#/catalogo'); await p.waitForTimeout(1500);
  const bb = await p.locator('#view-catalogo .grid .card').first().boundingBox();
  await p.screenshot({ path: path.join(__dirname, '..', 'capturas', 'dev-3-recorte-card.png'), clip: { x: bb.x, y: bb.y, width: bb.width, height: bb.height } });
  await b.close();
})();
