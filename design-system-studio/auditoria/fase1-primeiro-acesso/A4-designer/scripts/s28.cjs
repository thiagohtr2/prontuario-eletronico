const { open, dump, controls, C, BASE } = require('./lib.cjs');
const E = __dirname + '/../exportados/';
(async () => {
  const { ctx, page, logs, close } = await open(1440,900,{nosave:true});
  await page.addInitScript(() => { window.__log=[]; const o=URL.createObjectURL; URL.createObjectURL=function(b){ window.__log.push('blob '+(b&&b.type)+' '+(b&&b.size)); if(b&&b.text) b.text().then(t=>window.__blob=t); return o.apply(this, arguments); }; const oc=HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click=function(){ window.__log.push('aclick '+this.download+' '+this.href.slice(0,40)); return oc.apply(this, arguments); }; if (navigator.clipboard) { const w=navigator.clipboard.writeText.bind(navigator.clipboard); navigator.clipboard.writeText=(t)=>{ window.__log.push('clip '+t.length); return w(t).catch(()=>{}); }; } });
  await page.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await page.getByText('Prévia da identidade').first().waitFor(); await page.waitForTimeout(800);
  const dlP = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await page.getByRole('button', { name: 'CSS dos tokens' }).click();
  const dl = await dlP;
  await page.waitForTimeout(500); console.log('log', await page.evaluate(() => window.__log), 'dl', !!dl); require('fs').writeFileSync(E+'lumen-tokens-capturado-do-blob.css', await page.evaluate(() => window.__blob||''));
  if (dl) { await dl.saveAs(E + dl.suggestedFilename()); console.log('saved', dl.suggestedFilename()); }
  await close();
})();
