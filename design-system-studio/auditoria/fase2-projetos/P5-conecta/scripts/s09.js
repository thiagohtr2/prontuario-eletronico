const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const phone = page.getByRole('group', { name: /^Prévia do celular/ });
  console.log('label:', await phone.getAttribute('aria-label'));
  await phone.scrollIntoViewIfNeeded();
  await shot('04-mobile-escolhido-celular-fechado', { dir: CAP, el: phone });
  await shot('04-mobile-escolhido-tela', { dir: CAP });
  await phone.getByRole('button', { name: 'Abrir menu' }).click();
  await page.waitForTimeout(800);
  await shot('04-mobile-escolhido-celular-drawer-aberto', { dir: CAP, el: phone });
  const s = await phone.ariaSnapshot();
  console.log(s);
  // fechar drawer
  const fechar = phone.getByRole('button', { name: /Fechar/ });
  if (await fechar.count()) { await fechar.first().click(); await page.waitForTimeout(500); }
  // tocar em Perfil no dock
  await phone.getByRole('navigation').getByRole('button', { name: 'Explorar' }).click().catch(e => console.log('perfil click', e.message));
  await page.waitForTimeout(600);
  await shot('04-mobile-escolhido-celular-dock-explorar', { dir: CAP, el: phone });
  return (await phone.ariaSnapshot());
}, { viewport: { width: 1440, height: 1100 } });
