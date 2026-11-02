const { open, BASE } = require('./lib.cjs');
const path = require('path'); const fs = require('fs');
(async () => {
  const s = await open({ url: BASE + '#/prompt' });
  const p = s.page;
  await p.getByRole('tab', { name: /^Itens/ }).click(); await p.waitForTimeout(700);
  const dir = path.join(s.W, 'exportados/prompts-individuais'); fs.mkdirSync(dir, { recursive: true });
  const btns = p.locator('main#conteudo').getByRole('button', { name: 'Prompt deste elemento' });
  const n = await btns.count(); console.log('itens:', n);
  for (let i = 0; i < n; i++) {
    const b = btns.nth(i);
    await b.scrollIntoViewIfNeeded();
    await b.click(); await p.waitForTimeout(500);
    const dlg = p.getByRole('dialog').first();
    const title = (await dlg.getByRole('heading').first().innerText()).trim();
    try {
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }), dlg.getByRole('button', { name: 'Baixar .md' }).click()]);
      let name = dl.suggestedFilename(); let dest = path.join(dir, name);
      if (fs.existsSync(dest)) { dest = path.join(dir, name.replace(/\.md$/, `__item${i + 1}.md`)); }
      await dl.saveAs(dest);
      console.log(`OK | ${i + 1} | ${title} | ${path.basename(dest)} | ${fs.statSync(dest).size} bytes`);
    } catch (e) { console.log(`FALHOU | ${i + 1} | ${title} | ${e.message.split('\n')[0]}`); }
    await dlg.getByRole('button', { name: 'Fechar' }).click(); await p.waitForTimeout(300);
  }
  await s.done();
})();
