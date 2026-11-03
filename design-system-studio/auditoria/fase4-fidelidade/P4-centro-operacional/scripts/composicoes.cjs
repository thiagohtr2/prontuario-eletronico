// Recortes de componentes (KPI, tabela, alertas) e composições lado a lado Studio x sites.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const { SITES } = require('./lib.cjs');
const CAP = path.resolve(__dirname, '../capturas');
const COMP = path.resolve(__dirname, '../composicoes');
const ST = path.resolve(__dirname, '../../../fase2-projetos/P4-centro-operacional/capturas');
const conv = (args) => execFileSync('convert', args);

// junta imagens com a mesma altura, com rótulo embaixo
function compose(items, out, h) {
  const tmp = items.map((it, i) => {
    const t = path.join(COMP, `_tmp${i}.png`);
    conv([it.img, '-resize', `x${h}`, '-background', 'white', '-gravity', 'center', '-splice', '0x0',
      '-bordercolor', '#999999', '-border', '1', '-gravity', 'South', '-background', '#f0f0f0', '-splice', '0x26',
      '-font', 'DejaVu-Sans', '-pointsize', '16', '-fill', '#111111', '-annotate', '+0+4', it.label, t]);
    return t;
  });
  conv([...tmp, '-background', 'white', '-gravity', 'North', '-splice', '0x0', '+append', out]);
  tmp.forEach((t) => require('fs').unlinkSync(t));
}

(async () => {
  const browser = await chromium.launch();
  for (const [dev, cfg] of Object.entries(SITES)) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); await p.goto(cfg.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3500);
    await p.locator(cfg.kpi).first().screenshot({ path: `${CAP}/${dev}-recorte-kpi.png` });
    const tcard = p.locator(cfg.table).locator('xpath=ancestor::section[1]');
    await tcard.screenshot({ path: `${CAP}/${dev}-recorte-tabela.png` });
    await p.locator(cfg.panel).screenshot({ path: `${CAP}/${dev}-recorte-alertas.png` });
    await ctx.close();
  }
  await browser.close();
  const D = ['dev-1', 'dev-2', 'dev-3'];
  compose([{ img: `${ST}/17-previa-integrada-computador-elemento.png`, label: 'Studio: prévia integrada (computador)' }, ...D.map((d) => ({ img: `${CAP}/${d}-1440x900.png`, label: `${d} 1440x900` }))], `${COMP}/desktop-1440x900-studio-previa-vs-sites.png`, 450);
  compose([{ img: `${ST}/57-desktop-painel-operacional-desenho-ampliado-1920.png`, label: 'Studio: desenho do layout' }, ...D.map((d) => ({ img: `${CAP}/${d}-1920x1080.png`, label: `${d} 1920x1080` }))], `${COMP}/desktop-1920x1080-studio-layout-vs-sites.png`, 400);
  compose([{ img: `${ST}/18-previa-integrada-tablet-elemento.png`, label: 'Studio: prévia tablet' }, ...D.map((d) => ({ img: `${CAP}/${d}-768x1024.png`, label: `${d} 768x1024` }))], `${COMP}/tablet-768x1024-studio-vs-sites.png`, 600);
  compose([{ img: `${ST}/12-mobile-previa-grande-painel-abas-hoje.png`, label: 'Studio: celular' }, { img: `${ST}/19-previa-integrada-celular-elemento.png`, label: 'Studio: prévia integrada' }, ...D.map((d) => ({ img: `${CAP}/${d}-390x844.png`, label: `${d} 390x844` }))], `${COMP}/celular-390x844-studio-vs-sites.png`, 640);
  compose([{ img: `${ST}/31-componentes-kpis-compact-pro.png`, label: 'Studio: KPI Compact Pro' }, ...D.map((d) => ({ img: `${CAP}/${d}-recorte-kpi.png`, label: d }))], `${COMP}/componente-kpi-studio-vs-sites.png`, 240);
  compose([{ img: `${ST}/35-componentes-tabelas-personalizar.png`, label: 'Studio: Tabela Compact Pro' }, ...D.map((d) => ({ img: `${CAP}/${d}-recorte-tabela.png`, label: d }))], `${COMP}/componente-tabela-studio-vs-sites.png`, 300);
  compose([{ img: `${ST}/25-identidade-previa-tokens.png`, label: 'Studio: identidade' }, ...D.map((d) => ({ img: `${CAP}/${d}-recorte-alertas.png`, label: `${d} alertas` }))], `${COMP}/paleta-identidade-studio-vs-sites.png`, 700);
  console.log('ok');
})();
