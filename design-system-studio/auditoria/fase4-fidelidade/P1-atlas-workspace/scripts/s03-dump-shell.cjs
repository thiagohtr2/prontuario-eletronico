// Despeja o HTML (resumido) da sidebar e do header de cada site para identificar seletores.
const L = require('./lib.cjs');
const fs = require('fs');
(async () => {
  for (const site of Object.keys(L.SITES)) {
    const { ctx, page } = await L.newPage(1440, 900);
    await L.login(page, site);
    const html = await page.evaluate(() => {
      const strip = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').replace(/\s+/g, ' ');
      const sb = document.querySelector('aside#sidebar');
      const hd = [...document.querySelectorAll('header')].find(h => getComputedStyle(h).position === 'sticky' || getComputedStyle(h).position === 'fixed');
      return '=== SIDEBAR ===\n' + strip(sb ? sb.outerHTML : 'none') + '\n=== HEADER ===\n' + strip(hd ? hd.outerHTML : 'none');
    });
    fs.writeFileSync(L.OUT + `/medicoes/${site}-shell-dump.html`, html);
    await ctx.close();
  }
  await L.close();
})();
