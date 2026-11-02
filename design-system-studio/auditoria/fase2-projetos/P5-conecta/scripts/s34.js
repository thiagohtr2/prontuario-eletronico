const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/preview', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  for (const pg of ['Aplicação', 'Login']) {
    await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: pg }).click();
    for (const dev of ['Computador', 'Tablet', 'Celular']) {
      await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: dev }).click();
      await page.waitForTimeout(700);
      const tag = `06-previa-integrada-${pg === 'Aplicação' ? 'aplicacao' : 'login'}-${dev.toLowerCase()}`;
      await shot(tag, { dir: CAP });
      const img = page.getByRole('img', { name: /^Prévia do/ }).first();
      if (pg === 'Aplicação') {
        console.log('=== ' + tag + ' :: ' + (await img.getAttribute('aria-label')));
        console.log((await img.innerText()).replace(/\s+/g, ' ').slice(0, 700));
        await shot(tag + '-recorte', { dir: CAP, el: img });
      }
    }
  }
  await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Aplicação' }).click();
  await page.getByRole('group', { name: 'Dispositivo da prévia' }).getByRole('button', { name: 'Computador' }).click();
});
