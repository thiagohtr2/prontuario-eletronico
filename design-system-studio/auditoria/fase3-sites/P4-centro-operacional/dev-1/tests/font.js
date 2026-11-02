// Fonte ampliada (simulada com html{font-size:150%}): nada pode sobrepor ou vazar.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  for (const [w, h] of [[1280, 800], [1366, 768], [1024, 768], [375, 667], [1920, 1080]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(process.env.BASE || 'http://localhost:4441/index.html');
    await p.addStyleTag({ content: 'html{font-size:150% !important}' });
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const secs = [...document.querySelectorAll('#main > section')].filter((s) => s.offsetParent);
      let overlap = false;
      for (let i = 1; i < secs.length; i++) {
        if (secs[i].getBoundingClientRect().top < secs[i - 1].getBoundingClientRect().bottom - 1) overlap = true;
        const kids = secs[i - 1].querySelectorAll('.kpi, .status-card');
        kids.forEach((k) => {
          if (!k.offsetParent) return;
          // a parte visível termina na borda do contêiner com rolagem interna mais próximo
          let bottom = k.getBoundingClientRect().bottom, p = k.parentElement;
          while (p && p !== secs[i - 1].parentElement) {
            if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowY)) bottom = Math.min(bottom, p.getBoundingClientRect().bottom);
            p = p.parentElement;
          }
          if (bottom > secs[i].getBoundingClientRect().top + 1) overlap = true;
        });
      }
      return { overlap, h: document.documentElement.scrollWidth > innerWidth, v: document.documentElement.scrollHeight > innerHeight };
    });
    const fail = r.overlap || r.h;
    if (fail) bad++;
    console.log(`${fail ? 'FAIL' : 'ok  '} fonte 150% ${w}x${h}: sobreposição=${r.overlap} overflow-x=${r.h} rolagem-página=${r.v}`);
    if (process.argv.includes('--shots')) await p.screenshot({ path: path.join(__dirname, 'shots', `font150-${w}x${h}.png`) });
    await p.close();
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
