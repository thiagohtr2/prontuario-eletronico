module.exports = {
  async run({ page, shot, aria, log }) {
    const term = page.getByRole('main').getByRole('button', { name: 'Header', exact: true }).first();
    await term.click();
    await page.waitForTimeout(900);
    await shot('36-clique-termo-header');
    const tips = await page.locator('[role=tooltip], [role=dialog], [popover]').allInnerTexts().catch(() => []);
    log('TOOLTIPS:', JSON.stringify(tips));
    const snap = await aria();
    log(snap.split('\n').filter(l => /tooltip|dialog|barra do topo|Header/.test(l)).slice(0, 15).join('\n'));
    // segue: etapa opcional -> continuar
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Continuar: Componentes/ }).first().click();
    await page.waitForTimeout(1500);
    await shot('37-tela-componentes');
    await page.mouse.move(600, 450);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(800);
    await shot('37b-tela-componentes-rolada');
    const s2 = await aria();
    const i = s2.indexOf('Etapa 9');
    log(s2.slice(i, i + 3500));
  }
};
