const { run } = require('./lib');
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/objetivo', { waitUntil: 'networkidle' });
  await page.getByRole('radio', { name: /^Outro tipo/ }).click();
  await page.getByRole('textbox', { name: 'Descreva o tipo de projeto' }).fill('Plataforma social mobile-first');
  await page.getByRole('textbox', { name: 'Nome do projeto' }).fill('Conecta');
  await page.getByRole('textbox', { name: 'Objetivo' }).fill('Plataforma social mobile-first para conectar pessoas por meio de stories, conteúdos e perfis');
  await page.getByRole('textbox', { name: 'Descrição resumida' }).fill('Plataforma social mobile-first com header superior com stories, menu inferior flutuante arredondado, drawer lateral acessado pelo header, cards de conteúdo e perfil do usuário. A navegação mobile é prioritária e a versão desktop deve ser coerente com ela.');
  const feats = ['Header superior com stories', 'Menu inferior flutuante arredondado', 'Drawer lateral acessado pelo header', 'Cards de conteúdo (feed)', 'Perfil do usuário'];
  for (const f of feats) {
    await page.getByRole('textbox', { name: 'Nova funcionalidade' }).fill(f);
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await page.waitForTimeout(150);
  }
  await page.getByRole('button', { name: 'HTML + CSS + JavaScript' }).click();
  await page.waitForTimeout(500);
  console.log('tecnologia =', await page.getByRole('textbox', { name: 'Tecnologia' }).inputValue());
  await shot('g01-objetivo-preenchido', { full: true });
  await shot('01-objetivo-preenchido', { full: true, dir: CAP });
  const snap = await page.locator('main').ariaSnapshot();
  return snap.split('\n').slice(40).join('\n');
});
