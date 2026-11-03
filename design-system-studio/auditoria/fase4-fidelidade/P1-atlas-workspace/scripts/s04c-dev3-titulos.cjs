// Recheca o estilo do título de grupo da sidebar do dev-3 (a 1ª medição pegou o <h2> pai).
const L = require('./lib.cjs');
(async () => {
  const { ctx, page } = await L.newPage(1440, 900);
  await L.login(page, 'dev-3');
  const r = await page.evaluate(() => { const b = document.querySelector('aside#sidebar .nav-group__btn'); const s = getComputedStyle(b); return { text: b.innerText, fs: s.fontSize, fw: s.fontWeight, ls: s.letterSpacing, tt: s.textTransform, color: s.color }; });
  console.log(JSON.stringify(r)); L.saveJSON('s04c-dev3-titulos.json', r);
  await ctx.close(); await L.close();
})();
