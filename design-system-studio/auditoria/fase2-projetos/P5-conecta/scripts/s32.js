const { run } = require('./lib');
const OBS = [
  ['navigation.header', 'No celular (abaixo de 768 px) prevalece o layout mobile “Stories com dock e drawer lateral”: o botão de menu (☰) do header abre o drawer lateral esquerdo — não usar o painel de menu em largura total abaixo do header — e a faixa de stories fica logo abaixo do header.'],
  ['layout.mobile', 'Sem botão flutuante (FAB): as recomendações genéricas dos componentes Modern Material sobre “navigation bar inferior com FAB” não se aplicam; o menu inferior é o dock flutuante arredondado deste layout.'],
  ['Drawer lateral aberto pelo header', 'Este é o drawer de navegação do layout mobile: abre pelo botão de menu do header, desliza pela esquerda e tem ≈280 px (máx. 85% da largura), conforme o layout mobile.'],
];
run(async ({ page, shot, CAP }) => {
  await page.goto('http://127.0.0.1:4300/#/guiado/entrega', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.getByRole('tab', { name: /^Itens/ }).click();
  await page.waitForTimeout(500);
  const all = page.getByRole('listitem');
  const n = await all.count();
  for (let i = 0; i < n; i++) {
    const t = (await all.nth(i).innerText()).replace(/\s+/g, ' ');
    if (/origem/.test(t)) console.log('ITEM:', t.slice(0, 160));
  }
  for (const [key, txt] of OBS) {
    const item = page.getByRole('listitem').filter({ hasText: key }).filter({ has: page.getByRole('switch') }).first();
    const btn = item.getByRole('button', { name: 'Adicionar observação ou exceção' });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') await btn.click();
    await page.waitForTimeout(300);
    const tb = item.getByRole('textbox', { name: /Observação para a IA/ });
    await tb.fill(txt);
    await tb.blur();
    await page.waitForTimeout(400);
    console.log('OK obs ->', key, '=', await tb.inputValue());
  }
  await shot('10-entrega-itens-observacoes', { dir: CAP, full: true });
});
