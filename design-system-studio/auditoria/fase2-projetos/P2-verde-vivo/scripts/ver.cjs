// uso: node ver.cjs <hash> <nome> [maxChars]
const { withPage, URL } = require('./lib.cjs');
const [hash, nome, max] = process.argv.slice(2);
withPage(async (page, ctx, u) => {
  await page.waitForTimeout(600);
  await u.shot(nome);
  await u.shot(nome + '-full', { full: true });
  const snap = await page.locator('#conteudo').ariaSnapshot();
  console.log(snap.slice(0, parseInt(max || '20000')));
}, { url: URL + (hash || '') });
