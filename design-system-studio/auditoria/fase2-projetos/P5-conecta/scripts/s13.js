const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  // percorrer as etapas pelo botão Continuar para ver se o indicador "Esqueleto x/5" muda
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  const prog = async () => (await page.getByText(/Esqueleto \d\/5/).first().innerText());
  console.log('objetivo:', await prog());
  await page.getByRole('button', { name: 'Continuar: Entrada' }).click(); await page.waitForTimeout(400);
  console.log('entrada:', await prog());
  await page.getByRole('button', { name: 'Continuar: Desktop' }).click(); await page.waitForTimeout(400);
  console.log('desktop:', await prog());
  await page.getByRole('button', { name: 'Continuar: Mobile' }).click(); await page.waitForTimeout(400);
  console.log('mobile:', await prog());
  await page.getByRole('button', { name: 'Continuar: Revisão' }).click(); await page.waitForTimeout(400);
  console.log('revisao:', await prog(), page.url());
  await shot('05-revisao-esqueleto-antes-aprovar', { dir: CAP, full: true });
  await shot('05-revisao-indicador-0de5', { dir: CAP });
  await page.getByRole('button', { name: 'Aprovar esqueleto e continuar' }).click();
  await page.waitForTimeout(1000);
  console.log('apos aprovar:', await prog(), page.url());
  await shot('06-apos-aprovar', { dir: CAP });
  return (await page.locator('main').ariaSnapshot());
});
