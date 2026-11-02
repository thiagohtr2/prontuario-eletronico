const { withPage, URL } = require('./lib.cjs');
withPage(async (page, ctx, u) => {
  const C = (n) => u.path.join(u.W, 'capturas', n + '.png');
  await page.screenshot({ path: C('central-de-prompts-master-prompt') });
  await page.getByRole('tab', { name: 'Especificação JSON' }).click(); await page.waitForTimeout(600);
  const m = await page.locator('#conteudo').ariaSnapshot();
  const i = m.indexOf('tab "Especificação JSON"');
  console.log(m.slice(i, i + 1200).split('\n').filter(l => /button|text: [A-Z]|heading/.test(l)).slice(0, 20).join('\n'));
  await page.screenshot({ path: C('central-de-prompts-especificacao-json') });
  const btns = await page.locator('#conteudo').getByRole('button').evaluateAll(bs => bs.map(b => b.textContent.trim()).filter(Boolean));
  console.log('BOTOES', btns.join(' | '));
  await page.getByRole('tab', { name: 'Master Prompt' }).click(); await page.waitForTimeout(400);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.getByRole('button', { name: 'Baixar .md' }).click()]);
  const nm = dl.suggestedFilename();
  const p = u.path.join(u.W, 'scratch', 'central-' + nm);
  await dl.saveAs(p);
  console.log('central md', nm);
}, { url: URL + '#/prompt' });
