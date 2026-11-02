const { open, BASE } = require('./lib.cjs');
(async () => {
  const s = await open({ url: BASE + '#/guiado/preview' });
  const p = s.page;
  await p.waitForTimeout(600);
  const info = await p.evaluate(() => {
    const t = document.querySelector('.lp-toolbar');
    const par = t.parentElement;
    return [...par.children].map(c => c.tagName + '.' + c.className + ' ' + JSON.stringify(c.getBoundingClientRect().toJSON()));
  });
  console.log(info.join('\n'));
  await s.done();
})();
