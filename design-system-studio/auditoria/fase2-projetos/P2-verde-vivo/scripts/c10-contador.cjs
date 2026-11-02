const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const ban = page.getByRole('banner');
  console.log(await ban.ariaSnapshot());
  const el = page.getByText(/Esqueleto \d\/5/).first();
  console.log('attrs', await el.evaluate(e => { const p = e.closest('[title],[aria-label]'); return JSON.stringify({ t: e.getAttribute('title'), pt: p && (p.getAttribute('title') || p.getAttribute('aria-label')), html: e.parentElement.outerHTML.slice(0, 400) }); }));
  await el.hover(); await page.waitForTimeout(800);
  await page.screenshot({ path: u.path.join(u.W, 'capturas', 'bug-contador-esqueleto-1de5-apos-aprovar-tudo.png') });
}, { url: URL + '#/guiado/entrega' });
