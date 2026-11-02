const { open, W } = require('./lib.cjs');
const fs = require('fs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  // scroll to the very bottom to see whether the buttons become reachable
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const b = page.getByRole('button', { name: 'CSS dos tokens' });
  const bb = await b.boundingBox(); console.log('box at bottom', bb);
  await page.screenshot({ path: W + '/capturas/20-bug-css-dos-tokens-sob-rodape-fixo.png' });
  const hit = await page.evaluate(({x, y}) => { const e = document.elementFromPoint(x, y); return e && (e.className + ' ' + e.textContent.slice(0, 40)); }, { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 });
  console.log('element at button center:', hit);
  // keyboard activation
  await b.focus();
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.keyboard.press('Enter')]);
  if (dl) { const fn = dl.suggestedFilename(); await dl.saveAs(W + '/scripts/dl-cmp/' + fn); console.log('download via teclado:', fn, fs.statSync(W + '/scripts/dl-cmp/' + fn).size); }
  else console.log('no download via keyboard');
  await ctx.close();
})();
