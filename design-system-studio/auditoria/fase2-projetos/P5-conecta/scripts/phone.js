// Captura a prévia grande do celular escolhido (fechado, drawer aberto, dock) - rota e prefixo como args
const { run } = require('./lib');
const rota = process.argv[2] || '#/guiado/mobile';
const pref = process.argv[3] || '04-mobile-escolhido';
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/' + rota, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const phone = page.getByRole('group', { name: /^Prévia do celular/ }).first();
  // rolar até a prévia "grudar" no topo
  await page.mouse.move(700, 500);
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 150); await page.waitForTimeout(80); }
  await page.waitForTimeout(500);
  let bb = await phone.boundingBox();
  console.log('bbox', bb);
  const clip = { x: bb.x - 10, y: Math.max(0, bb.y - 10), width: bb.width + 20, height: bb.height + 20 };
  await page.screenshot({ path: CAP + '/' + pref + '-celular-fechado.png', clip });
  await page.screenshot({ path: CAP + '/' + pref + '-tela.png' });
  await phone.getByRole('button', { name: 'Abrir menu' }).click();
  await page.waitForTimeout(800);
  bb = await phone.boundingBox();
  await page.screenshot({ path: CAP + '/' + pref + '-celular-drawer-aberto.png', clip: { x: bb.x - 10, y: Math.max(0, bb.y - 10), width: bb.width + 20, height: bb.height + 20 } });
  console.log(await phone.ariaSnapshot());
  await phone.getByRole('button', { name: /Fechar menu/ }).click();
  await page.waitForTimeout(500);
  await phone.getByRole('navigation').getByRole('button', { name: 'Explorar' }).click();
  await page.waitForTimeout(600);
  bb = await phone.boundingBox();
  await page.screenshot({ path: CAP + '/' + pref + '-celular-menu-inferior-explorar.png', clip: { x: bb.x - 10, y: Math.max(0, bb.y - 10), width: bb.width + 20, height: bb.height + 20 } });
  await phone.getByRole('navigation').getByRole('button', { name: 'Início' }).click();
}, { viewport: { width: 1440, height: 1000 } });
