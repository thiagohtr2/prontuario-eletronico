// Capturas a 1280x800 (proporção do palco da prévia integrada do Studio, 804x503) e composições lado a lado.
const L = require('./lib.cjs');
const { execFileSync } = require('child_process');
const path = require('path');
const ST = path.resolve(L.OUT, '../../fase2-projetos/P1-atlas-workspace/capturas');
const C = (n) => path.join(L.OUT, 'capturas', n);
const K = (n) => path.join(L.OUT, 'composicoes', n);
const INICIAL = { 'dev-1': '#/inicio', 'dev-2': '#/painel', 'dev-3': '#/app/inicio' };
const PAINEL = { 'dev-1': '#/painel', 'dev-2': '#/painel', 'dev-3': '#/app/painel' };

function compose(out, items, h) {
  // items: [[arquivo, rótulo]]; todos redimensionados para a mesma altura h, com rótulo acima
  const args = [];
  for (const [f, lab] of items) {
    args.push('(', f, '-resize', `x${h}`, '-background', 'white', '-gravity', 'north', '-splice', '0x34', '-font', 'DejaVu-Sans', '-pointsize', '20', '-fill', '#111', '-annotate', '+0+6', lab, '-bordercolor', '#bbbbbb', '-border', '1', ')');
  }
  execFileSync('convert', [...args, '-background', 'white', '-splice', '0x0', '+append', out]);
}

(async () => {
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site];
    const { ctx, page } = await L.newPage(1280, 800);
    await page.goto(S.url + S.login); await page.waitForTimeout(600); await page.screenshot({ path: C(`${site}-login-1280x800.png`) });
    await page.goto(S.url + S.cadastro); await page.waitForTimeout(600); await page.screenshot({ path: C(`${site}-cadastro-1280x800.png`) });
    await L.login(page, site);
    await page.goto(S.url + PAINEL[site]); await page.waitForTimeout(1500); await page.mouse.move(1, 1); await page.screenshot({ path: C(`${site}-painel-1280x800.png`) });
    await ctx.close();
  }
  await L.close();
  const D = ['dev-1', 'dev-2', 'dev-3'];
  compose(K('01-desktop-app-studio-vs-sites.png'), [[path.join(ST, '34-previa-integrada-aplicacao-computador-palco.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-painel-1280x800.png`), d + ' (Painel)'])], 503);
  compose(K('02-desktop-app-pagina-inicial-studio-vs-sites.png'), [[path.join(ST, '34-previa-integrada-aplicacao-computador-palco.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-app-inicial-1440x900.png`), d + ' (1a tela apos login)'])], 503);
  compose(K('03-login-desktop-studio-vs-sites.png'), [[path.join(ST, '34-previa-integrada-login-computador-palco.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-login-1280x800.png`), d])], 503);
  compose(K('04-cadastro-desktop-studio-vs-sites.png'), [[path.join(ST, '34-previa-integrada-cadastro-computador-palco.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-cadastro-1280x800.png`), d])], 503);
  compose(K('05-celular-app-studio-vs-sites.png'), [[path.join(ST, '11-mobile-bottom-nav-classica-previa.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-app-inicial-390x844.png`), d + ' (1a tela)'])], 783);
  compose(K('06-celular-painel-studio-vs-sites.png'), [[path.join(ST, '11-mobile-previa-toque-agenda.png'), 'Studio (destinos)'], ...D.map(d => [C(`${d}-painel-390x844.png`), d + ' (Painel)'])], 783);
  compose(K('07-login-celular-studio-vs-sites.png'), [[path.join(ST, '08-login-classico-central-previa-celular.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-login-390x844.png`), d])], 700);
  compose(K('08-cadastro-celular-studio-vs-sites.png'), [[path.join(ST, '07-cadastro-previa-celular.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-cadastro-390x844.png`), d])], 700);
  compose(K('09-tablet-studio-vs-sites.png'), [[path.join(ST, '34-previa-integrada-aplicacao-tablet-palco.png'), 'Studio (aprovado)'], ...D.map(d => [C(`${d}-painel-768x1024.png`), d])], 800);
  compose(K('10-tabela-studio-vs-sites.png'), [[path.join(ST, '25-personalizar-tabelas.png'), 'Studio (Tabelas Swiss)'], ...D.map(d => [C(`${d}-tabela-1440x900.png`), d])], 560);
  compose(K('11-formulario-studio-vs-sites.png'), [[path.join(ST, '25-personalizar-formularios.png'), 'Studio (Formularios Swiss)'], ...D.map(d => [C(`${d}-form-1440x900.png`), d])], 560);
  compose(K('12-cards-studio-vs-sites.png'), [[path.join(ST, '25-personalizar-cards.png'), 'Studio (Cards Swiss)'], ...D.map(d => [C(`${d}-cards-1440x900.png`), d])], 560);
  compose(K('13-kpi-dashboard-studio-vs-sites.png'), [[path.join(ST, '25-personalizar-dashboard.png'), 'Studio (Dashboard Swiss)'], [path.join(ST, '25-personalizar-kpis-e-stat-cards.png'), 'Studio (KPI Swiss)'], ...D.map(d => [C(`${d}-painel-1440x900.png`), d])], 560);
  compose(K('14-sidebar-recolhida-studio-vs-sites.png'), [[path.join(ST, '36-live-preview-desktop-sidebar-recolhida.png'), 'Studio (live preview)'], ...D.map(d => [C(`${d}-sidebar-recolhida-1440.png`), d])], 560);
  compose(K('15-menu-perfil-sidebar-studio-vs-sites.png'), [[path.join(ST, '36-live-preview-desktop-menu-perfil-sidebar.png'), 'Studio (live preview)'], ...D.map(d => [C(`${d}-menu-sidebar-1440.png`), d])], 560);
  console.log('composições geradas');
})();
