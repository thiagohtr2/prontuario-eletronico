// Testes de layout e comportamento do Centro Operacional (Playwright, file://).
// Uso: node tests/check.js   (a partir da pasta do projeto)
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const INDEX = 'file://' + path.join(ROOT, 'index.html');
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = [
  [320, 568], [320, 480], [344, 640], [360, 740], [375, 667], [390, 844], [412, 915],
  [430, 932], [480, 800], [500, 800], [600, 900], [700, 900], [768, 1024], [768, 639], [820, 1180], [900, 700],
  [1024, 768], [1024, 600], [1100, 800], [1200, 700], [1279, 640], [1280, 640], [1280, 800], [1280, 600], [1366, 768], [1440, 900], [1536, 864], [1920, 1080], [667, 375], [844, 390], [375, 559], [375, 560], [360, 600]
];
const SHOT_SIZES = new Set(['390x844', '1280x800', '320x568', '1920x1080', '844x390', '820x1180']);

const problems = [];
const log = (ok, msg) => { if (!ok) problems.push(msg); console.log((ok ? 'OK   ' : 'FALHA ') + msg); };

function oneScreenExpected(w, h) {
  return (w >= 768 && h >= 640) || (w < 768 && h >= 560);
}

async function openPage(browser, w, h, query = '') {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_FAILED')) errors.push(m.text()); });
  await page.route('**/*', (route) => (route.request().url().startsWith('file:') ? route.continue() : route.abort()));
  await page.goto(INDEX + query);
  return { page, errors };
}

async function waitLoaded(page) {
  await page.waitForFunction(() => document.querySelectorAll('.kpi').length === 4 &&
    document.querySelectorAll('tbody tr').length === 4 &&
    document.querySelectorAll('.alert').length > 0, null, { timeout: 8000 });
  await page.waitForTimeout(150);
}

async function layoutCheck(browser, w, h) {
  const tag = `${w}x${h}`;
  const { page, errors } = await openPage(browser, w, h);
  await waitLoaded(page);
  const m = await page.evaluate(() => {
    const de = document.documentElement;
    const visible = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0; };
    const clipped = [];
    document.querySelectorAll('.btn, .tab, .badge, .sev, .kpi-value, .kpi-label, .alert-msg, .th-btn, .brand-title, .summary-value, .state-text').forEach((el) => {
      if (!visible(el)) return;
      if (el.scrollWidth > el.clientWidth + 1) clipped.push('largura:' + (el.textContent || '').trim().slice(0, 40));
    });
    const small = [];
    if (window.innerWidth < 768) {
      document.querySelectorAll('.btn, .tab').forEach((el) => {
        if (!visible(el)) return;
        const r = el.getBoundingClientRect();
        if (r.height < 43.5 || r.width < 43.5) small.push((el.textContent.trim() || el.getAttribute('aria-label')) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
      });
    }
    const outside = [];
    document.querySelectorAll('.kpi, .table-card, .panel, .topbar, .statusbar, .tabs-mobile, .content').forEach((el) => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 1 || r.left < -1) outside.push(el.className);
    });
    const app = document.getElementById('app').getBoundingClientRect();
    return {
      hOverflow: de.scrollWidth - window.innerWidth,
      vOverflow: de.scrollHeight - window.innerHeight,
      appH: Math.round(app.height), innerH: window.innerHeight,
      clipped: clipped.slice(0, 5), small: small.slice(0, 5), outside: outside.slice(0, 5),
      bodyOverflow: getComputedStyle(document.body).overflow,
      mobileTabsVisible: getComputedStyle(document.querySelector('.tabs-mobile')).display !== 'none',
      alertsVisible: visible(document.getElementById('painel-alertas')),
      kpis: document.querySelectorAll('.kpi').length,
      tableH: Math.round(document.querySelector('.table-scroll').getBoundingClientRect().height)
    };
  });
  const expectOne = oneScreenExpected(w, h);
  log(m.hOverflow <= 0, `${tag}: sem overflow horizontal (${m.hOverflow}px)`);
  if (expectOne) {
    log(m.vOverflow <= 1, `${tag}: One Screen sem rolagem da página (vOverflow ${m.vOverflow}px)`);
    log(Math.abs(m.appH - m.innerH) <= 1, `${tag}: shell ocupa a viewport (${m.appH}/${m.innerH})`);
  } else {
    log(m.vOverflow >= -1, `${tag}: modo empilhado (rolagem permitida)`);
  }
  log(m.clipped.length === 0, `${tag}: nenhum texto cortado ${m.clipped.length ? JSON.stringify(m.clipped) : ''}`);
  log(m.small.length === 0, `${tag}: alvos de toque >= 44 px ${m.small.length ? JSON.stringify(m.small) : ''}`);
  log(m.outside.length === 0, `${tag}: blocos dentro da largura ${m.outside.length ? JSON.stringify(m.outside) : ''}`);
  log(m.kpis === 4, `${tag}: 4 indicadores renderizados`);
  if (w >= 768 && expectOne) log(m.tableH >= 80, `${tag}: área da tabela com altura útil (${m.tableH}px)`);
  log(m.mobileTabsVisible === (w < 768), `${tag}: abas do celular visíveis somente abaixo de 768 px`);
  if (w >= 1280 && h >= 640) log(m.alertsVisible, `${tag}: painel de alertas visível ao lado da grade`);
  log(errors.length === 0, `${tag}: sem erros no console ${errors.length ? JSON.stringify(errors.slice(0, 3)) : ''}`);
  if (SHOT_SIZES.has(tag)) await page.screenshot({ path: path.join(SHOTS, tag + '.png') });
  await page.close();
}

async function interactionChecks(browser) {
  // Desktop: relatório do indicador, Esc e retorno do foco
  {
    const { page } = await openPage(browser, 1280, 800);
    await waitLoaded(page);
    const btn = page.locator('[data-relatorio]').first();
    await btn.click();
    log(await page.evaluate(() => document.getElementById('detalhe').open), 'desktop: relatório do indicador abre o diálogo');
    await page.keyboard.press('Escape');
    const retorno = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-relatorio'));
    log(!(await page.evaluate(() => document.getElementById('detalhe').open)) && retorno === 'receita', 'desktop: Esc fecha o diálogo e devolve o foco ao gatilho');

    // Ordenação por cabeçalho com aria-sort
    await page.locator('th[data-sort="valor"] .th-btn').click();
    const sort = await page.getAttribute('th[data-sort="valor"]', 'aria-sort');
    const valores = await page.$$eval('tbody tr td.num', (tds) => tds.map((td) => td.textContent));
    log(sort === 'ascending', `desktop: ordenação por valor (aria-sort=${sort})`);
    log(valores.length === 4, 'desktop: 4 linhas após ordenar');

    // Seleção com checkbox e cabeçalho
    await page.locator('.linha-check').first().check();
    const cont = await page.textContent('[data-sel-count]');
    log(cont.includes('1 pedido selecionado'), `desktop: contagem de seleção (${cont})`);
    const indet = await page.evaluate(() => document.getElementById('sel-all').indeterminate);
    log(indet === true, 'desktop: cabeçalho indeterminado com seleção parcial');

    // Filtro sem resultado
    await page.fill('#busca', 'zzzz');
    const vazioFiltro = await page.textContent('[data-table-state]');
    log(vazioFiltro.includes('Nenhum pedido corresponde aos filtros'), 'desktop: estado vazio por filtro');
    await page.click('[data-table-state] .btn');
    log((await page.$$('tbody tr')).length === 4, 'desktop: "Limpar filtros" restaura as linhas');

    // Detalhes do pedido
    await page.locator('[data-detalhe]').first().click();
    const titulo = await page.textContent('#detalhe-titulo');
    log(titulo.startsWith('Pedido #'), `desktop: diálogo de detalhes do pedido (${titulo})`);
    await page.keyboard.press('Escape');

    // Alerta em tempo real (intervalo de 9 s) e pausa
    const antes = await page.$$eval('.alert', (l) => l.length);
    await page.waitForTimeout(9600);
    const depois = await page.$$eval('.alert', (l) => l.length);
    const novo = await page.$$eval('.alert.is-new, .alert:first-child', (l) => l.length > 0);
    log(depois === antes + 1 && novo, `desktop: novo alerta entra no topo (${antes} -> ${depois})`);
    await page.click('[data-action="pause"]');
    log((await page.getAttribute('[data-action="pause"]', 'aria-pressed')) === 'true', 'desktop: botão pausar com aria-pressed');
    await page.waitForTimeout(9600);
    const pausado = await page.$$eval('.alert', (l) => l.length);
    log(pausado === depois, `desktop: pausa interrompe novos alertas (${pausado})`);
    await page.close();
  }

  // Celular: abas com setas e aria-selected
  {
    const { page } = await openPage(browser, 390, 844);
    await waitLoaded(page);
    await page.focus('#tab-m-indicadores');
    await page.keyboard.press('ArrowRight');
    const v1 = await page.getAttribute('#app', 'data-view');
    const sel1 = await page.getAttribute('#tab-m-dados', 'aria-selected');
    log(v1 === 'dados' && sel1 === 'true', 'celular: seta direita troca para Dados');
    const foco = await page.evaluate(() => document.activeElement.id);
    log(foco === 'tab-m-dados', 'celular: foco acompanha a aba');
    const dadosVisiveis = await page.isVisible('#sec-dados');
    const indVisiveis = await page.isVisible('#sec-indicadores');
    log(dadosVisiveis && !indVisiveis, 'celular: apenas a seção Dados aparece');
    await page.keyboard.press('ArrowRight');
    log((await page.isVisible('#painel-alertas')) && !(await page.isVisible('#sec-dados')), 'celular: seta direita leva a Alertas');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    log((await page.getAttribute('#tab-m-indicadores', 'aria-selected')) === 'true', 'celular: seta esquerda volta a Indicadores');
    const alturaAntes = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.click('#tab-m-dados');
    const alturaDepois = await page.evaluate(() => document.documentElement.scrollHeight);
    log(alturaAntes === alturaDepois && alturaDepois <= 845, 'celular: trocar de aba não altera a altura da tela');
    await page.close();
  }

  // Estado de erro com nova tentativa
  {
    const { page } = await openPage(browser, 1280, 800, '?estado=erro');
    await page.waitForTimeout(1000);
    const txt = await page.textContent('[data-kpi-state]');
    log(txt.includes('Não foi possível carregar os indicadores'), 'estado erro: mensagem nos indicadores');
    await page.click('[data-kpi-state] .btn');
    await page.waitForTimeout(900);
    log((await page.$$('.kpi')).length === 4, 'estado erro: "Tentar novamente" carrega os indicadores');
    await page.waitForTimeout(200);
    log((await page.textContent('[data-table-state]')).includes('Não foi possível carregar os pedidos'), 'estado erro: mensagem na tabela');
    await page.close();
  }

  // Estado vazio
  {
    const { page } = await openPage(browser, 1280, 800, '?estado=vazio');
    await page.waitForTimeout(1000);
    log((await page.textContent('[data-kpi-state]')).includes('Nenhum indicador'), 'estado vazio: indicadores');
    log((await page.textContent('[data-table-state]')).includes('Nenhum pedido recente'), 'estado vazio: tabela');
    log((await page.textContent('[data-alert-state]')).includes('Nenhum alerta'), 'estado vazio: alertas');
    await page.close();
  }

  // Estado de carregamento (skeleton)
  {
    const { page } = await openPage(browser, 390, 844, '?estado=carregando');
    await page.waitForTimeout(1000);
    log((await page.$$('.kpi.is-skel')).length === 4, 'estado carregando: skeleton dos indicadores');
    await page.close();
  }

  // Modo empilhado (altura pequena): as seções ficam todas visíveis
  {
    const { page } = await openPage(browser, 1280, 600);
    await waitLoaded(page);
    const vis = await page.evaluate(() => ['#sec-indicadores', '#sec-dados', '#painel-alertas'].map((s) => document.querySelector(s).getClientRects().length > 0));
    log(vis.every(Boolean), 'empilhado 1280x600: todas as seções visíveis');
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const [w, h] of VIEWPORTS) {
      await layoutCheck(browser, w, h);
    }
    await interactionChecks(browser);
  } finally {
    await browser.close();
  }
  console.log('\n' + (problems.length ? problems.length + ' falha(s)' : 'Todos os testes passaram'));
  process.exitCode = problems.length ? 1 : 0;
})().catch((e) => { console.error(e); process.exit(1); });
