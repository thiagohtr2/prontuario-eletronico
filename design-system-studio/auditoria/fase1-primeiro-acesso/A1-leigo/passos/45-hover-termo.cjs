module.exports = {
  async run({ page, shot, aria, log }) {
    await page.getByRole('complementary', { name: 'Navegação do Studio' }).getByRole('link', { name: 'Headers e sidebars' }).click();
    await page.waitForTimeout(1200);
    const term = page.getByRole('main').getByRole('button', { name: 'Sidebar', exact: true }).first();
    await term.hover();
    await page.waitForTimeout(1500);
    await shot('45-hover-termo-sidebar');
    log('title:', await term.getAttribute('title'), '| aria-describedby:', await term.getAttribute('aria-describedby'), '| aria-expanded:', await term.getAttribute('aria-expanded'));
    await term.click();
    await page.waitForTimeout(1200);
    await shot('45b-clique-termo-sidebar');
    const vis = await page.locator('[role=tooltip]:visible, [role=dialog]:visible, .tooltip:visible').count();
    log('popups visíveis:', vis);
    log('URL:', page.url());
  }
};
