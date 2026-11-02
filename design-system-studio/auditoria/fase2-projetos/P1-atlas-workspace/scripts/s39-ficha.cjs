const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const W = path.resolve(__dirname, '..');
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  pg.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) errs.push('REQ externa: ' + r.url()); });
  await pg.goto('file://' + path.join(W, 'exportados/atlas-workspace-ficha.html'));
  await pg.waitForTimeout(800);
  await pg.screenshot({ path: path.join(W, 'capturas/41-ficha-html-exportada-topo.png') });
  console.log('title:', await pg.title());
  const hs = await pg.locator('h1,h2').allInnerTexts(); console.log(hs.join(' | '));
  console.log('erros/reqs:', errs);
  await b.close();
})();
