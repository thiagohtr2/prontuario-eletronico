const { open, BASE } = require('./lib.cjs');
const path = require('path'); const fs = require('fs');
(async () => {
  const s = await open({ url: BASE + '#/exportar' });
  const p = s.page; const OUT = path.join(s.W, 'exportados');
  const log = [];
  async function grab(label, clickFn, sub = '') {
    const dir = path.join(OUT, sub); fs.mkdirSync(dir, { recursive: true });
    try {
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), clickFn()]);
      const name = dl.suggestedFilename();
      const dest = path.join(dir, name);
      await dl.saveAs(dest);
      const fail = await dl.failure();
      const size = fs.statSync(dest).size;
      log.push(`OK | ${label} | ${path.join(sub, name)} | ${size} bytes${fail ? ' | falha: ' + fail : ''}`);
    } catch (e) { log.push(`FALHOU | ${label} | ${e.message.split('\n')[0]}`); }
  }
  await p.waitForTimeout(500);
  await s.shot('39-exportar-pagina', { dir: 'capturas' });
  const arts = p.locator('main#conteudo article');
  const n = await arts.count();
  for (let i = 0; i < n; i++) {
    const a = arts.nth(i);
    const h = (await a.getByRole('heading').first().innerText()).trim();
    await grab('Exportar e importar › ' + h, () => a.getByRole('button', { name: 'Baixar' }).click());
  }
  // Central de Prompts / Entrega
  await p.goto(BASE + '#/guiado/entrega', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await grab('Master Prompt (etapa 10) › Baixar .md', () => p.getByRole('button', { name: 'Baixar .md' }).first().click(), 'outros-botoes/etapa10-entrega');
  await p.getByRole('tab', { name: 'Especificação JSON' }).click(); await p.waitForTimeout(500);
  await grab('Master Prompt (etapa 10) › Especificação JSON › Baixar JSON', () => p.getByRole('button', { name: 'Baixar JSON' }).click(), 'outros-botoes/etapa10-entrega');
  await p.goto(BASE + '#/prompt', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await grab('Central de Prompts › Baixar .md', () => p.getByRole('button', { name: 'Baixar .md' }).first().click(), 'outros-botoes/central-de-prompts');
  await p.getByRole('tab', { name: 'Especificação JSON' }).click(); await p.waitForTimeout(500);
  await grab('Central de Prompts › Especificação JSON › Baixar JSON', () => p.getByRole('button', { name: 'Baixar JSON' }).click(), 'outros-botoes/central-de-prompts');
  // Identidade: CSS dos tokens
  await p.goto(BASE + '#/guiado/identidade', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await grab('Identidade visual › CSS dos tokens', () => p.getByRole('button', { name: 'CSS dos tokens' }).click(), 'outros-botoes/identidade');
  // Prompt da identidade (pode abrir diálogo com Baixar .md)
  await p.getByRole('button', { name: 'Prompt da identidade' }).click(); await p.waitForTimeout(600);
  if (await p.getByRole('dialog').count()) {
    await grab('Identidade visual › Prompt da identidade › Baixar .md', () => p.getByRole('dialog').first().getByRole('button', { name: 'Baixar .md' }).click(), 'outros-botoes/identidade');
    await p.keyboard.press('Escape');
  } else log.push('INFO | Prompt da identidade não abriu diálogo');
  // Validação responsiva: runner.py (não executado)
  await p.goto(BASE + '#/validacao', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await grab('Validação responsiva › Baixar executor (runner.py)', () => p.getByRole('button', { name: 'Baixar executor (runner.py)' }).click(), 'outros-botoes/validacao-responsiva');
  const cfgDisabled = await p.getByRole('button', { name: 'Baixar configuração' }).isDisabled();
  log.push(`INFO | Validação responsiva › Baixar configuração: ${cfgDisabled ? 'desabilitado (exige URL de site já construído)' : 'habilitado'}`);
  console.log(log.join('\n'));
  await s.done();
})();
