// Testes de interação (Playwright). Requer o servidor estático em :4441.
// Uso: node tests/interact.js [--shots]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = process.env.BASE || 'http://localhost:4441/index.html';
const SHOTS = process.argv.includes('--shots');
const outDir = path.join(__dirname, 'shots');
if (SHOTS) fs.mkdirSync(outDir, { recursive: true });

let fails = 0;
function check(cond, msg) { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) fails++; }
async function shot(page, name) { if (SHOTS) await page.screenshot({ path: path.join(outDir, name + '.png') }); }

(async () => {
  const browser = await chromium.launch();

  // ---------- Desktop 1280x800 ----------
  let page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE);
  check(await page.locator('#orders-body[aria-busy="true"]').count() === 1, 'estado de carregamento (skeleton) na abertura');
  await page.waitForTimeout(1000);
  check(await page.locator('#orders-tbody tr').count() === 4, 'tabela com 4 linhas de exemplo');
  check((await page.locator('.kpi').first().innerText()).replace(/\u00a0/g, ' ').includes('R$ 48,2 mil'), 'KPI Receita mensal R$ 48,2 mil');
  check((await page.locator('.kpi').first().innerText()).includes('+12,4%'), 'variação +12,4%');

  // sparkline tooltip
  const spark = page.locator('.kpi__spark').first();
  const box = await spark.boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  check(await page.locator('.kpi__tip:not([hidden])').count() === 1, 'tooltip no sparkline ao passar o mouse');
  await shot(page, 'i-desktop-tooltip');
  // keyboard on KPI
  await page.mouse.move(5, 5);
  await page.locator('.kpi').nth(1).focus();
  await page.keyboard.press('ArrowLeft'); // 1º toque: ponto mais recente
  const t1 = await page.locator('.kpi').nth(1).locator('.kpi__tip').innerText();
  await page.keyboard.press('ArrowLeft'); // ponto anterior
  const t2 = await page.locator('.kpi').nth(1).locator('.kpi__tip').innerText();
  check(t1.includes('1.284') && t2.includes('1.188'), 'setas ←/→ percorrem pontos do sparkline (teclado): ' + t1 + ' / ' + t2);

  // report dialog
  await page.locator('.kpi').first().click();
  check(await page.locator('#dialog[open]').count() === 1, 'clique no KPI abre relatório detalhado');
  await shot(page, 'i-desktop-report');
  await page.keyboard.press('Escape');
  check(await page.locator('#dialog[open]').count() === 0, 'Esc fecha o modal');
  check(await page.evaluate(() => document.activeElement.classList.contains('kpi')), 'foco volta ao cartão que abriu o modal');

  // sort
  await page.locator('[data-sort="valor"]').click();
  check(await page.locator('th[data-col="valor"]').getAttribute('aria-sort') === 'descending', 'ordenação por Valor com aria-sort');
  const firstClient = await page.locator('#orders-tbody tr:first-child th').innerText();
  check(firstClient === 'Loja Vértice', 'maior valor primeiro (Loja Vértice)');
  await page.locator('[data-sort="valor"]').click();
  check(await page.locator('th[data-col="valor"]').getAttribute('aria-sort') === 'ascending', 'segundo clique inverte (ascending)');

  // selection
  await page.locator('#orders-tbody [data-select]').first().check();
  check(await page.evaluate(() => document.getElementById('select-all').indeterminate), 'checkbox do cabeçalho indeterminado');
  await page.locator('#select-all').check();
  check(await page.locator('#orders-tbody [data-select]:checked').count() === 4, 'selecionar todos');
  check(await page.locator('#bulk-complete').getAttribute('aria-disabled') === 'false', 'ação em lote habilitada');
  await shot(page, 'i-desktop-selection');
  await page.locator('#bulk-complete').click();
  check(await page.locator('#orders-tbody .badge--success').count() === 4, 'pedidos concluídos em lote');
  check(await page.locator('#bulk-complete').getAttribute('aria-disabled') === 'true', 'ação em lote desabilitada sem seleção');

  // row menu
  const rowBtn = page.locator('#orders-tbody [data-row-menu]').first();
  await rowBtn.focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.menu[role="menu"]').count() === 1, 'menu de ações da linha abre com Enter');
  await shot(page, 'i-desktop-rowmenu');
  await page.keyboard.press('Escape');
  check(await page.locator('.menu').count() === 0, 'Esc fecha o menu');
  check(await page.evaluate(() => document.activeElement.hasAttribute('data-row-menu')), 'foco volta ao botão de ações');
  await rowBtn.click();
  await page.mouse.click(600, 40);
  check(await page.locator('.menu').count() === 0, 'clique fora fecha o menu');
  await page.locator('#orders-tbody [data-row-menu]').first().click();
  await page.locator('.menu__item', { hasText: 'Ver detalhes' }).click();
  check(await page.locator('#dialog[open]').count() === 1, '"Ver detalhes" abre modal do pedido');
  await page.locator('.dialog__close').click();

  // search -> empty
  await page.locator('#order-search').fill('xyz');
  check((await page.locator('#orders-state').innerText()).includes('Nenhum pedido encontrado'), 'busca sem resultado mostra estado vazio');
  await shot(page, 'i-desktop-empty-search');
  await page.locator('[data-action="clear-search"]').click();
  check(await page.locator('#orders-tbody tr').count() === 4, 'limpar busca restaura linhas');

  // new alert
  const before = await page.locator('#alert-list > li').count();
  await page.evaluate(() => CO.debug.pushAlert(CO.data.randomAlert()));
  check(await page.locator('#alert-list > li').count() === before + 1, 'novo alerta entra no topo');
  check(await page.locator('#alert-list').getAttribute('aria-live') === 'polite', 'lista de alertas com aria-live="polite"');
  check(await page.locator('#alert-list > li').first().evaluate((el) => el.classList.contains('alert--enter')), 'animação discreta de entrada');
  // scrolled list: no jump
  await page.locator('#alerts-body').evaluate((el) => { el.scrollTop = 200; });
  const anchorBefore = await page.locator('#alert-list > li').nth(4).boundingBox();
  await page.evaluate(() => CO.debug.pushAlert(CO.data.randomAlert()));
  const anchorAfter = await page.locator('#alert-list > li').nth(5).boundingBox();
  check(Math.abs(anchorBefore.y - anchorAfter.y) < 2, 'lista rolada não "pula" quando chega alerta');
  check(await page.locator('#new-pill:not([hidden])').count() === 1, 'aviso de novos alertas quando a lista está rolada');
  await shot(page, 'i-desktop-newpill');

  // simulate menu + connection failure
  await page.locator('#sim-btn').click();
  check(await page.locator('.menu').count() === 1, 'menu Simular abre');
  await page.locator('.menu__item', { hasText: 'falha de conexão' }).click();
  await page.waitForTimeout(1100);
  check((await page.locator('#sb-conn').innerText()).includes('Sem conexão'), 'barra de status mostra "Sem conexão"');
  check((await page.locator('#orders-state').innerText()).includes('Não foi possível'), 'tabela em estado de erro');
  await shot(page, 'i-desktop-error');
  await page.locator('#sim-btn').click();
  await page.locator('.menu__item', { hasText: 'Restabelecer' }).click();
  await page.waitForTimeout(2200);
  check((await page.locator('#sb-conn').innerText()).includes('Conectado'), 'conexão restabelecida');
  check(await page.locator('#orders-tbody tr').count() === 4, 'dados recarregados após reconectar');

  // empty demo
  await page.locator('#sim-btn').click();
  await page.locator('.menu__item', { hasText: 'Esvaziar' }).click();
  check((await page.locator('#alerts-state').innerText()).includes('Nenhum alerta'), 'estado vazio de alertas');
  check((await page.locator('#orders-state').innerText()).includes('Nenhum pedido recente'), 'estado vazio da tabela');
  await shot(page, 'i-desktop-empty');
  await page.locator('[data-action="restore"]').click();
  check(await page.locator('#alert-list > li').count() === 10, 'dados restaurados');

  // keyboard shortcut R
  await page.locator('body').click({ position: { x: 600, y: 760 } });
  await page.keyboard.press('r');
  check(await page.locator('#orders-body[aria-busy="true"]').count() === 1, 'atalho R atualiza (carregando)');
  await page.waitForTimeout(1100);
  await page.keyboard.press('/');
  check(await page.evaluate(() => document.activeElement.id === 'order-search'), 'atalho / foca a busca');
  check(errors.length === 0, 'sem erros de JavaScript (desktop) ' + errors.join(' | '));
  await page.close();

  // ---------- Desktop compactado 1024x768 ----------
  page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await page.goto(BASE);
  await page.waitForTimeout(1000);
  check(await page.locator('#panel').isHidden(), 'compactado: alertas ocultos na aba Painel');
  await page.locator('#vt-alertas').click();
  check(await page.locator('#panel').isVisible() && await page.locator('#content').isHidden(), 'compactado: aba Alertas alterna com a grade');
  check(await page.locator('#vt-alertas').getAttribute('aria-selected') === 'true', 'aba ativa com aria-selected');
  await shot(page, 'i-compact-alertas');
  await page.keyboard.press('ArrowLeft');
  check(await page.locator('#content').isVisible(), 'seta ← volta para Painel');
  await page.close();

  // ---------- Celular 375x667 ----------
  page = await browser.newPage({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  await page.goto(BASE);
  await page.waitForTimeout(1000);
  const tabs = ['indicadores', 'operacao', 'pedidos', 'alertas'];
  for (let i = 0; i < tabs.length; i++) {
    if (i > 0) { await page.locator('#mt-' + tabs[i - 1]).focus(); await page.keyboard.press('ArrowRight'); }
    check(await page.locator('#mt-' + tabs[i]).getAttribute('aria-selected') === 'true', 'celular: aba ' + tabs[i] + ' via seta →');
    const noScroll = await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight);
    check(noScroll, 'celular: troca de aba sem rolagem da página (' + tabs[i] + ')');
    await shot(page, 'i-mobile-' + tabs[i]);
  }
  // tap targets >= 44
  const small = await page.evaluate(() => [...document.querySelectorAll('button, [role=tab], input[type=search], select, .check')]
    .filter((el) => el.offsetParent !== null && !el.closest('.sr-only'))
    .map((el) => { const r = el.getBoundingClientRect(); return { n: el.id || el.className, w: r.width, h: r.height }; })
    .filter((r) => r.w < 43.5 || r.h < 43.5));
  check(small.length === 0, 'celular: alvos de toque ≥ 44 px ' + JSON.stringify(small));
  const fontInputs = await page.evaluate(() => [...document.querySelectorAll('input[type=search], select')].map((el) => parseFloat(getComputedStyle(el).fontSize)));
  check(fontInputs.every((f) => f >= 16), 'celular: campos com 16 px');
  await page.locator('#mt-pedidos').click();
  await page.locator('#order-cards [data-row-menu]').first().click();
  check(await page.locator('.menu').count() === 1, 'celular: menu de ações no cartão');
  await shot(page, 'i-mobile-menu');
  await page.keyboard.press('Escape');
  await page.locator('#mt-indicadores').click();
  await page.locator('.kpi').first().click();
  await shot(page, 'i-mobile-report');
  check(await page.locator('#dialog[open]').count() === 1, 'celular: relatório abre');
  const dlg = await page.locator('#dialog').boundingBox();
  check(dlg.height <= 667 * 0.9 + 1, 'celular: modal com altura máx. 90dvh');
  await page.close();

  await browser.close();
  console.log(fails ? `\n${fails} falha(s)` : '\nTodas as verificações de interação ok');
  process.exit(fails ? 1 : 0);
})();
