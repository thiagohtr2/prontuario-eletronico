const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const reg = page.getByRole('region', { name: /^No projeto/ });
  const it = reg.getByRole('listitem').filter({ hasText: 'Layouts mobile' }).first();
  await it.getByRole('button', { name: 'Personalizar' }).click();
  await page.waitForTimeout(900);
  await shot('09-componente-menu-inferior-dock-editor', { dir: CAP });
  const dlg = page.getByRole('dialog').first();
  const info = await dlg.evaluate((d) => {
    const r = d.getBoundingClientRect();
    const kids = [...d.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && getComputedStyle(e).overflowY !== 'visible').map(e => ({ cls: e.className, ch: e.clientHeight, sh: e.scrollHeight, top: e.getBoundingClientRect().top }));
    return { r: { top: r.top, h: r.height }, scrollers: kids.slice(0, 5) };
  });
  console.log(JSON.stringify(info));
  // rolar até o switch FAB (como no fluxo anterior)
  await dlg.getByText('Botão flutuante (FAB)').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot('bug-modal-personalizar-area-vazia', { dir: CAP });
  const info2 = await dlg.evaluate((d) => {
    const r = d.getBoundingClientRect();
    const f = [...d.querySelectorAll('button')].find(b => b.textContent.includes('Concluir'));
    return { dlg: { top: r.top, bottom: r.bottom }, concluirTop: f && f.getBoundingClientRect().top, docScrollY: window.scrollY };
  });
  console.log(JSON.stringify(info2));
  await page.keyboard.press('Escape');
});
