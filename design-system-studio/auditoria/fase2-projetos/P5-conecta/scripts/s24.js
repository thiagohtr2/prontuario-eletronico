const { run } = require('./lib');
const FAM = 'Modern Material';
async function abrirCategoria(page, cat) {
  await page.getByRole('button', { name: /Ver todas as 66 categorias/ }).click().catch(() => {});
  await page.waitForTimeout(200);
  await page.getByRole('complementary', { name: 'Categorias de componentes' }).getByRole('button', { name: cat, exact: true }).click();
  await page.waitForTimeout(500);
}
async function adicionar(page, cat) {
  await abrirCategoria(page, cat);
  const catName = cat.replace(/^\d+ /, '');
  const famBtn = page.getByRole('button', { name: `Escolher a família ${FAM} para ${catName}` });
  const card = famBtn.locator('xpath=ancestor::*[.//button[contains(.,"Adicionar ao projeto")]][1]');
  await card.getByRole('button', { name: /Adicionar ao projeto/ }).click();
  await page.waitForTimeout(800);
  return page.getByRole('dialog').first();
}
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/componentes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // 1) personalizar o card já adicionado
  const reg = page.getByRole('region', { name: /^No projeto/ });
  await reg.getByRole('button', { name: 'Personalizar' }).first().click();
  await page.waitForTimeout(700);
  let dlg = page.getByRole('dialog').first();
  await dlg.getByRole('textbox', { name: 'Nome no projeto' }).fill('Card de conteúdo do feed');
  await dlg.getByRole('textbox', { name: 'Título', exact: true }).fill('Publicação da comunidade');
  await dlg.getByRole('textbox', { name: 'Texto', exact: true }).fill('Foto ou texto compartilhado por um perfil que você segue.');
  await dlg.getByRole('textbox', { name: 'Botão', exact: true }).fill('Ver publicação');
  await page.waitForTimeout(400);
  await shot('09-componente-card-conteudo-editor', { dir: CAP });
  await dlg.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);

  // 2) Perfil de usuário
  dlg = await adicionar(page, '62 Perfil de usuário');
  console.log('=== PERFIL\n' + (await dlg.ariaSnapshot()).slice(0, 5000));
  await dlg.getByRole('textbox', { name: 'Nome no projeto' }).fill('Perfil do usuário');
  await page.waitForTimeout(300);
  await shot('09-componente-perfil-editor', { dir: CAP });
  await dlg.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);

  // 3) Drawers
  dlg = await adicionar(page, '34 Drawers');
  console.log('=== DRAWER\n' + (await dlg.ariaSnapshot()).slice(0, 5000));
  await dlg.getByRole('textbox', { name: 'Nome no projeto' }).fill('Drawer lateral aberto pelo header');
  await page.waitForTimeout(300);
  await shot('09-componente-drawer-editor', { dir: CAP });
  await dlg.getByRole('button', { name: 'Concluir' }).click();
  await page.waitForTimeout(500);
});
