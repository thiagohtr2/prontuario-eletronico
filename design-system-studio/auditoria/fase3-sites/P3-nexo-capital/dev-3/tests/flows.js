// Roteiro de interações da demonstração Nexo Capital (Playwright, file://).
// Uso: node tests/flows.js   (a partir da pasta do projeto)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const INDEX = process.env.NEXO_URL || ('file://' + path.join(ROOT, 'index.html'));
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const problems = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok });
  if (!ok) problems.push(name + (detail !== undefined ? ' :: ' + detail : ''));
}

async function newPage(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height: height || 800 } });
  const page = await ctx.newPage();
  page._errors = [];
  page.on('pageerror', (e) => page._errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page._errors.push('console: ' + m.text()); });
  return { ctx, page };
}

async function login(page) {
  await page.goto(INDEX + '#/login');
  await page.fill('#email', 'demo@nexo.example');
  await page.fill('#senha', 'Demo@2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('.kpi-value', { timeout: 5000 });
}

const width = (page, sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().width, sel);
const hash = (page) => page.evaluate(() => location.hash);
const activeClass = (page) => page.evaluate(() => document.activeElement.className + ' ' + (document.activeElement.id || ''));

async function main() {
  const browser = await chromium.launch();

  // A. Drawer no celular: foco, Esc, scrim, X, navegação e seções analíticas.
  {
    const { ctx, page } = await newPage(browser, 390, 740);
    await login(page);
    await page.click('.topbar-menu');
    await page.waitForSelector('.sidebar.is-open');
    check('drawer: foco vai ao botão Fechar', /drawer-close/.test(await activeClass(page)), await activeClass(page));
    check('drawer: body sem rolagem', await page.evaluate(() => document.body.classList.contains('no-scroll')));
    const dw = await width(page, '.sidebar');
    check('drawer: largura <= 280 px e <= 85%', dw <= 280.5 && dw <= 390 * 0.85 + 0.5, 'w=' + dw);
    check('drawer: conteúdo com inert', await page.evaluate(() => document.querySelector('.main').hasAttribute('inert')));
    await page.keyboard.press('Tab');
    check('drawer: foco preso dentro do menu', await page.evaluate(() => !!document.activeElement.closest('.sidebar')), await activeClass(page));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.sidebar').classList.contains('is-open'));
    check('drawer: Esc fecha e devolve foco ao gatilho', /topbar-menu/.test(await activeClass(page)), await activeClass(page));
    check('drawer: body volta a rolar', !(await page.evaluate(() => document.body.classList.contains('no-scroll'))));

    await page.click('.topbar-menu');
    await page.waitForSelector('.sidebar.is-open');
    await page.click('.scrim', { position: { x: 350, y: 300 } });
    await page.waitForFunction(() => !document.querySelector('.sidebar').classList.contains('is-open'));
    check('drawer: toque no scrim fecha', true);

    await page.click('.topbar-menu');
    await page.click('.drawer-close');
    await page.waitForFunction(() => !document.querySelector('.sidebar').classList.contains('is-open'));
    check('drawer: botão X fecha', true);

    await page.click('.topbar-menu');
    await page.click('.sidebar a[href="#/app/contratos"]');
    await page.waitForSelector('.page-title:has-text("Contratos")');
    check('drawer: escolher item navega e fecha', (await hash(page)) === '#/app/contratos' && !(await page.evaluate(() => document.querySelector('.sidebar').classList.contains('is-open'))));
    await page.click('.topbar-menu');
    await page.waitForSelector('.sidebar.is-open');
    check('drawer: item ativo identificável', await page.isVisible('.sidebar .nav-item.is-active'));
    await page.click('.sidebar .sec-link[data-section="receita"]');
    await page.waitForSelector('.kpi-label:has-text("MRR")');
    check('drawer: seções analíticas navegam', (await hash(page)) === '#/app/painel/receita');
    await page.screenshot({ path: path.join(SHOTS, 'painel-receita-390.png') });
    await ctx.close();
  }

  // B. Tablet (820 px): rail de 72 px, overlay com Esc, seções em menu.
  {
    const { ctx, page } = await newPage(browser, 820, 800);
    await login(page);
    const rw = await width(page, '.sidebar');
    check('tablet: rail com ~72 px', Math.abs(rw - 72) < 1, 'w=' + rw);
    check('tablet: rótulos ocultos no rail', (await page.evaluate(() => getComputedStyle(document.querySelector('.nav-label')).position)) === 'absolute');
    check('tablet: seções recolhidas no botão', await page.isVisible('.sections-btn'));
    await page.hover('.sidebar .nav-item[data-nav="contratos"]');
    check('tablet: tooltip do rail aparece no hover', (await page.evaluate(() => getComputedStyle(document.querySelector('.sidebar .nav-item[data-nav="contratos"] .tip')).display)) === 'block');
    await page.click('.rail-toggle');
    await page.waitForSelector('.sidebar.is-open');
    const ow = await width(page, '.sidebar');
    check('tablet: rail expande em sobreposição de 252 px', Math.abs(ow - 252) < 1, 'w=' + ow);
    await page.waitForTimeout(350);
    check('tablet: scrim visível quando expandido', (await page.evaluate(() => getComputedStyle(document.querySelector('.scrim')).opacity)) === '1');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.sidebar').classList.contains('is-open'));
    check('tablet: Esc recolhe e devolve foco ao gatilho', /rail-toggle/.test(await activeClass(page)), await activeClass(page));
    await page.click('.sections-btn');
    await page.click('.menu-item:has-text("Retenção")');
    await page.waitForSelector('.kpi-label:has-text("Churn")');
    check('tablet: menu de seções navega', (await hash(page)) === '#/app/painel/retencao');
    await page.screenshot({ path: path.join(SHOTS, 'painel-retencao-820.png') });
    await ctx.close();
  }

  // C. Desktop (1440 px): sidebar, abas, ordenação, seleção, menu da linha, legenda, tooltip, período e logout.
  {
    const { ctx, page } = await newPage(browser, 1440, 900);
    await login(page);
    check('desktop: sidebar com 252 px', Math.abs((await width(page, '.sidebar')) - 252) < 1);
    check('desktop: abas do painel visíveis', await page.isVisible('.tabs .tab'));
    await page.click('.tab[data-section="aquisicao"]');
    await page.waitForSelector('.kpi-label:has-text("Novos clientes")');
    check('desktop: aba ativa com aria-current', (await page.getAttribute('.tab[data-section="aquisicao"]', 'aria-current')) === 'page');
    await page.click('.tab[data-section="visao-geral"]');
    await page.waitForSelector('.dash-table tbody tr');

    await page.click('.dash-table th button:has-text("Valor")');
    const asc = await page.$$eval('.dash-table tbody td.num', (tds) => tds.map((t) => Number(t.textContent.replace(/\D/g, ''))));
    check('tabela: ordena valor ascendente', JSON.stringify(asc) === JSON.stringify(asc.slice().sort((a, b) => a - b)), JSON.stringify(asc));
    check('tabela: aria-sort ascending', (await page.getAttribute('.dash-table th:has(button:has-text("Valor"))', 'aria-sort')) === 'ascending');
    await page.click('.dash-table th button:has-text("Valor")');
    const desc = await page.$$eval('.dash-table tbody td.num', (tds) => tds.map((t) => Number(t.textContent.replace(/\D/g, ''))));
    check('tabela: segundo clique ordena descendente', JSON.stringify(desc) === JSON.stringify(desc.slice().sort((a, b) => b - a)), JSON.stringify(desc));

    await page.click('.dash-table thead input[type=checkbox]');
    check('tabela: seleção de todos atualiza contador', /selecionado/.test(await page.textContent('.table-count')), await page.textContent('.table-count'));

    await page.click('.dash-table .row-action >> nth=0');
    await page.waitForSelector('.menu[role=menu]');
    check('linha: menu de ações com 3 itens', (await page.locator('.menu .menu-item').count()) === 3);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.menu'));
    check('linha: Esc fecha menu e devolve foco ao botão', /row-action/.test(await activeClass(page)), await activeClass(page));

    const barsBefore = await page.locator('.bar-0').count();
    await page.click('.legend-btn >> nth=0');
    check('legenda: desliga série', (await page.getAttribute('.legend-btn >> nth=0', 'aria-pressed')) === 'false' && (await page.locator('.bar-0').count()) === 0, 'antes=' + barsBefore);
    await page.click('.legend-btn >> nth=0');
    check('legenda: liga série de novo', (await page.locator('.bar-0').count()) === barsBefore);

    await page.hover('.bar-group >> nth=2');
    await page.waitForSelector('.chart-tip:not([hidden])');
    check('gráfico: tooltip mostra valores em R$', /R\$/.test(await page.textContent('.chart-tip')), await page.textContent('.chart-tip'));
    check('gráfico: texto do tooltip sem [object', !/\[object|undefined/.test(await page.textContent('.chart-tip')));

    await page.selectOption('#periodo', '7');
    await page.waitForFunction(() => /2 registros/.test((document.querySelector('.table-count') || {}).textContent || ''), null, { timeout: 4000 }).catch(() => {});
    // Pedidos em 31/10, 30/10 e 27/10 estão dentro de 7 dias (02/11): 3 registros.
    check('período 7 dias: tabela com 3 registros', /3 registros/.test(await page.textContent('.table-count')), await page.textContent('.table-count'));
    check('período: foco permanece no seletor', (await activeClass(page)).indexOf('periodo') !== -1, await activeClass(page));
    await page.screenshot({ path: path.join(SHOTS, 'painel-1440-7dias.png') });

    await page.click('.app-header .avatar-btn');
    await page.click('.menu-item:has-text("Sair")');
    await page.waitForSelector('#email');
    check('sair: volta ao login', (await hash(page)) === '#/login');
    await ctx.close();
  }

  // D. Erro com nova tentativa, estado vazio e rota protegida.
  {
    const { ctx, page } = await newPage(browser, 1024, 800);
    await page.goto(INDEX + '#/app/painel');
    await page.waitForSelector('#email');
    check('rota protegida sem sessão vai ao login', (await hash(page)) === '#/login');
    await login(page);
    await page.reload();
    await page.waitForSelector('.kpi-value', { timeout: 5000 });
    check('recarregar mantém a sessão', (await hash(page)) === '#/app/painel/visao-geral');

    await page.goto(INDEX + '#/app/auditoria');
    await page.waitForSelector('.state-error[role=alert]', { timeout: 4000 });
    check('auditoria: erro com role=alert', true);
    await page.click('.state-error button');
    await page.waitForSelector('.table-card .data-table tbody tr');
    check('auditoria: nova tentativa carrega a tabela', (await page.locator('.table-card .data-table tbody tr').count()) === 4);

    await page.goto(INDEX + '#/app/fornecedores');
    await page.waitForSelector('.state-empty', { timeout: 4000 });
    check('fornecedores: estado vazio', /Nenhum fornecedor/.test(await page.textContent('.state-empty')));
    await ctx.close();
  }

  // E. Todas as rotas em celular e computador: sem texto quebrado, sem overflow, sem erros JS.
  const routes = ['#/app/painel/visao-geral', '#/app/painel/aquisicao', '#/app/painel/retencao', '#/app/painel/receita',
    '#/app/contratos', '#/app/fornecedores', '#/app/compras', '#/app/colaboradores', '#/app/folha', '#/app/auditoria', '#/app/permissoes'];
  for (const w of [390, 1440]) {
    const { ctx, page } = await newPage(browser, w, 800);
    await login(page);
    for (const r of routes) {
      await page.evaluate((x) => { location.hash = x; }, r);
      await page.waitForSelector('.page-title', { timeout: 4000 });
      await page.waitForTimeout(500);
      const txt = await page.evaluate(() => document.body.innerText);
      check('rota ' + r + ' em ' + w + 'px sem undefined/NaN', !/undefined|\[object|NaN/.test(txt));
      const o = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      check('rota ' + r + ' em ' + w + 'px sem overflow', o.sw <= o.cw, JSON.stringify(o));
    }
    check('rotas em ' + w + 'px sem erros JS', page._errors.length === 0, page._errors.join(' | '));
    await ctx.close();
  }

  await browser.close();
  const pass = results.filter((r) => r.ok).length;
  console.log('Interações: ' + pass + '/' + results.length + ' aprovadas');
  if (problems.length) { console.log('Falhas:'); problems.forEach((p) => console.log(' - ' + p)); }
  process.exitCode = problems.length ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exitCode = 2; });
