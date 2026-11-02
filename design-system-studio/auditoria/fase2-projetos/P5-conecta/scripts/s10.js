const { run } = require('./lib');
const h = parseInt(process.argv[2] || '1100');
run(async ({ page, shot }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/mobile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const phone = page.getByRole('group', { name: /^Prévia do celular/ });
  const bb = await phone.boundingBox();
  console.log('phone bbox', bb, 'viewport', page.viewportSize());
  await shot('s10-mobile-' + h);
}, { viewport: { width: 1440, height: h } });
