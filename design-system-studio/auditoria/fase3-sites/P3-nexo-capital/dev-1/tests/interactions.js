// Testes funcionais: login, drawer, trilho, menus, tabela, gráfico.
const { chromium } = require('playwright');
const path = require('path');
require('fs').mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
const shot = (p, n, full) => p.screenshot({ path: path.join(__dirname, 'shots', n + '.png'), fullPage: !!full });
const log = (...a) => console.log('•', ...a);
(async () => {
  const browser = await chromium.launch();
  const base = 'file://' + path.resolve(__dirname, '..', 'index.html');
  const errors = [];
  const watch = (p) => { p.on('pageerror', e => errors.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };

  /* ---------- Celular 375 ---------- */
  let ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, hasTouch: true, isMobile: true });
  let p = await ctx.newPage(); watch(p);
  await p.goto(base);
  await p.waitForTimeout(300);
  await p.click('#btn-login');
  await p.waitForTimeout(200);
  log('login vazio -> resumo visível:', await p.isVisible('#login-summary'), '| email aria-invalid:', await p.getAttribute('#login-email', 'aria-invalid'), '| describedby:', await p.getAttribute('#login-email', 'aria-describedby'));
  log('foco no resumo:', await p.evaluate(() => document.activeElement.id));
  await shot(p, 'm375-login-erros');
  await p.fill('#login-email', 'errado@empresa.com');
  await p.fill('#login-password', 'xpto');
  await p.click('#btn-login');
  log('botão durante envio:', await p.textContent('#btn-login'), 'disabled=', await p.isDisabled('#btn-login'));
  await p.waitForTimeout(1400);
  log('erro genérico:', (await p.textContent('#login-summary')).trim());
  log('altura input celular:', await p.evaluate(() => getComputedStyle(document.querySelector('#login-email')).height + ' ' + getComputedStyle(document.querySelector('#login-email')).fontSize));
  await p.click('#toggle-password');
  log('toggle senha:', await p.getAttribute('#toggle-password', 'aria-label'), await p.getAttribute('#toggle-password', 'aria-pressed'), await p.getAttribute('#login-password', 'type'));
  await p.click('text=Esqueci minha senha');
  await p.waitForTimeout(200);
  await p.fill('#recover-email', 'qualquer@empresa.com');
  await p.click('#btn-recover');
  await p.waitForTimeout(1300);
  log('recuperação:', (await p.textContent('#recover-done')).trim());
  await shot(p, 'm375-recuperar');
  await p.click('text=Voltar para o login');
  await p.fill('#login-email', 'ana.ribeiro@nexocapital.com.br');
  await p.fill('#login-password', 'Nexo@2026');
  await p.click('#btn-login');
  await p.waitForTimeout(2600);
  log('hash após login:', await p.evaluate(() => location.hash));
  await shot(p, 'm375-dash', true);
  // drawer
  await p.click('#btn-drawer');
  await p.waitForTimeout(400);
  log('drawer aberto; foco:', await p.evaluate(() => document.activeElement.id), '| body overflow:', await p.evaluate(() => getComputedStyle(document.body).overflow), '| main inert:', await p.evaluate(() => document.querySelector('.app-main').inert));
  log('largura drawer:', await p.evaluate(() => document.querySelector('#drawer').getBoundingClientRect().width));
  await shot(p, 'm375-drawer');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  log('Esc fecha; foco volta para:', await p.evaluate(() => document.activeElement.id), '| aria-expanded:', await p.getAttribute('#btn-drawer', 'aria-expanded'));
  await p.click('#btn-drawer');
  await p.waitForTimeout(300);
  await p.mouse.click(360, 400);
  await p.waitForTimeout(300);
  log('toque no scrim fecha:', !(await p.evaluate(() => document.querySelector('#drawer').classList.contains('is-open'))));
  await p.click('#btn-drawer');
  await p.waitForTimeout(300);
  await p.click('#drawer a[data-nav="contratos"]');
  await p.waitForTimeout(1200);
  log('destino navega e fecha:', await p.evaluate(() => location.hash), !(await p.evaluate(() => document.querySelector('#drawer').classList.contains('is-open'))));
  await shot(p, 'm375-contratos', true);
  // tabela em cartões
  log('linha como cartão (display tr):', await p.evaluate(() => getComputedStyle(document.querySelector('.tbl tbody tr')).display));
  await ctx.close();

  /* ---------- 320 ---------- */
  ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true });
  p = await ctx.newPage(); watch(p);
  await p.goto(base);
  await shot(p, 'm320-login', true);
  await p.evaluate(() => { sessionStorage.setItem('nexo.session', JSON.stringify({ user: 1, method: 'sso', at: Date.now() })); location.hash = '#/painel/visao-geral'; });
  await p.waitForTimeout(1300);
  await shot(p, 'm320-dash', true);
  await p.click('#btn-drawer');
  await p.waitForTimeout(400);
  log('drawer 320 largura:', await p.evaluate(() => document.querySelector('#drawer').getBoundingClientRect().width));
  await shot(p, 'm320-drawer');
  await ctx.close();

  /* ---------- Tablet 820 ---------- */
  ctx = await browser.newContext({ viewport: { width: 820, height: 1000 } });
  p = await ctx.newPage(); watch(p);
  await p.goto(base);
  await p.evaluate(() => { sessionStorage.setItem('nexo.session', JSON.stringify({ user: 1, method: 'senha', at: Date.now() })); location.hash = '#/painel/receita'; });
  await p.waitForTimeout(1300);
  log('trilho largura:', await p.evaluate(() => document.querySelector('#sidebar').getBoundingClientRect().width));
  await p.hover('#sidebar a[data-nav="compras"]');
  await p.waitForTimeout(200);
  log('tooltip trilho:', await p.evaluate(() => !document.querySelector('#tooltip').hidden && document.querySelector('#tooltip').textContent));
  await shot(p, 't820-rail');
  await p.click('#btn-rail');
  await p.waitForTimeout(300);
  log('sidebar expandida:', await p.evaluate(() => document.querySelector('#sidebar').getBoundingClientRect().width), 'foco:', await p.evaluate(() => document.activeElement.id));
  await shot(p, 't820-expandida');
  await p.mouse.click(700, 500);
  await p.waitForTimeout(300);
  log('clique fora fecha:', !(await p.evaluate(() => document.querySelector('#sidebar').classList.contains('is-expanded'))), 'foco:', await p.evaluate(() => document.activeElement.id));
  await ctx.close();

  /* ---------- Desktop 1440 ---------- */
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  p = await ctx.newPage(); watch(p);
  await p.goto(base);
  await p.click('#btn-sso');
  log('SSO:', await p.textContent('#btn-sso'));
  await p.waitForTimeout(2600);
  await shot(p, 'd1440-dash');
  // menu de período
  await p.click('.hdr-period');
  await p.waitForTimeout(150);
  log('menu período itens:', await p.$$eval('.menu [role=menuitemradio]', els => els.map(e => e.textContent + (e.getAttribute('aria-checked') === 'true' ? '✓' : ''))).then(a => a.join(' | ')), 'foco:', await p.evaluate(() => document.activeElement.textContent));
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  log('KPI em carregamento após período:', await p.evaluate(() => document.querySelector('.kpis').getAttribute('aria-busy')));
  await p.waitForTimeout(1200);
  log('período agora:', await p.textContent('.hdr-period [data-period-label]'), '| sub:', await p.textContent('[data-page-sub]'));
  // perfil
  await p.click('#btn-profile');
  await p.waitForTimeout(100);
  const box = await p.evaluate(() => { const r = document.querySelector('.menu').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), innerWidth]; });
  log('menu perfil itens:', await p.$$eval('.menu [role=menuitem]', els => els.map(e => e.textContent).join(' | ')), 'pos:', box);
  await p.keyboard.press('Escape');
  log('Esc volta foco ao avatar:', await p.evaluate(() => document.activeElement.id));
  // unidade
  await p.click('#unit-btn');
  await p.waitForTimeout(100);
  await shot(p, 'd1440-unidade');
  await p.click('.menu [role=menuitemradio]:nth-of-type(2)');
  await p.waitForTimeout(100);
  log('unidade:', await p.textContent('#unit-btn [data-unit-name]'));
  // perfil da sidebar abre para cima
  await p.click('#sb-profile');
  await p.waitForTimeout(100);
  log('menu sidebar acima do botão:', await p.evaluate(() => document.querySelector('.menu').getBoundingClientRect().bottom <= document.querySelector('#sb-profile').getBoundingClientRect().top), await p.$$eval('.menu [role=menuitem]', els => els.map(e => e.textContent).join(' | ')));
  await p.keyboard.press('Escape');
  // acordeão
  await p.click('#sb-gt-pessoas');
  log('grupo recolhido:', await p.getAttribute('#sb-gt-pessoas', 'aria-expanded'), 'salvo:', await p.evaluate(() => localStorage.getItem('nexo.sidebar.groups')));
  await p.click('#sb-gt-pessoas');
  await p.waitForTimeout(1300);
  // tabela: ordenar, selecionar
  await p.click('[data-sort="valor"]');
  log('aria-sort valor:', await p.getAttribute('th[data-col="valor"]', 'aria-sort'));
  await p.click('[data-sort="valor"]');
  log('aria-sort valor (2º clique):', await p.getAttribute('th[data-col="valor"]', 'aria-sort'));
  await p.click('tbody tr:first-child [data-check]');
  log('checkbox geral indeterminado:', await p.evaluate(() => document.querySelector('[data-check-all]').indeterminate), '| barra lote:', await p.textContent('[data-bulk-count]'));
  await p.click('[data-check-all]');
  log('todos selecionados:', await p.evaluate(() => document.querySelector('[data-check-all]').checked), await p.textContent('[data-bulk-count]'));
  await p.click('[data-bulk-clear]');
  await p.click('tbody tr:first-child [data-row-menu]');
  await p.waitForTimeout(100);
  log('menu da linha:', await p.$$eval('.menu [role=menuitem]', els => els.map(e => e.textContent).join(' | ')));
  await p.keyboard.press('Escape');
  await p.click('.tbl-tab[data-status="atrasado"]');
  log('filtro status:', await p.textContent('[data-count]'));
  await p.fill('[data-q]', 'zzzz');
  await p.waitForTimeout(300);
  log('vazio por filtro:', await p.isVisible('[data-clear-filters]'));
  await p.click('[data-clear-filters]');
  // novo pedido
  await p.click('[data-primary]');
  await p.waitForTimeout(100);
  await p.click('dialog button[type=submit]');
  log('validação novo pedido:', await p.evaluate(() => document.querySelector('#np-summary').innerText.replace(/\n/g, ' ')));
  await shot(p, 'd1440-novo-pedido');
  await p.fill('#np-cliente', 'Cliente Teste');
  await p.fill('#np-valor', '1.250,50');
  await p.click('dialog button[type=submit]');
  await p.waitForTimeout(200);
  log('pedido criado; primeira linha:', await p.textContent('tbody tr:first-child th'));
  // gráfico: tooltip com teclado e legenda
  await p.focus('.chart');
  await p.keyboard.press('ArrowLeft');
  await p.waitForTimeout(100);
  log('tooltip teclado:', await p.evaluate(() => document.querySelector('.chart-tip:not([hidden])') && document.querySelector('.chart-tip').innerText.replace(/\n/g, ' ')));
  await p.click('.legend-item[data-series="1"]');
  log('legenda desliga série 2:', await p.getAttribute('.legend-item[data-series="1"]', 'aria-pressed'), 'barras s1:', await p.$$eval('.chart .bar.s1', e => e.length));
  await p.hover('.chart', { position: { x: 300, y: 120 } });
  await p.waitForTimeout(100);
  await shot(p, 'd1440-tooltip');
  // busca
  await p.keyboard.press('Escape');
  await p.click('body', { position: { x: 700, y: 140 } });
  await p.keyboard.press('/');
  await p.waitForTimeout(100);
  await p.keyboard.type('contr');
  await p.waitForTimeout(100);
  log('busca resultados:', await p.$$eval('#search-results [role=option]', e => e.map(x => x.innerText.replace(/\n/g, ' ')).join(' | ')));
  await p.keyboard.press('Enter');
  await p.waitForTimeout(1200);
  log('busca navegou:', await p.evaluate(() => location.hash), '| breadcrumb:', await p.textContent('.hdr-crumbs'));
  await shot(p, 'd1440-contratos');
  // notificações
  await p.click('#btn-notif');
  await p.waitForTimeout(100);
  await shot(p, 'd1440-notif');
  await p.click('[data-mark-read]');
  log('badge após marcar lidas:', await p.getAttribute('#btn-notif', 'aria-label'));
  await p.keyboard.press('Escape');
  // estado de erro e vazio via Configurações
  await p.evaluate(() => { location.hash = '#/configuracoes'; });
  await p.waitForTimeout(300);
  await p.check('input[name=demo-state][value=error]');
  await p.evaluate(() => { location.hash = '#/painel/visao-geral'; });
  await p.waitForTimeout(1300);
  await shot(p, 'd1440-erro', true);
  log('erros exibidos:', await p.$$eval('.state--error', e => e.length));
  await p.click('[data-retry-kpi]');
  await p.waitForTimeout(1200);
  log('retry KPI carregou:', await p.$$eval('.kpi-value', e => e.length));
  await p.evaluate(() => Nexo.setState({ demo: 'empty' }));
  await p.waitForTimeout(1200);
  await shot(p, 'd1440-vazio', true);
  await p.evaluate(() => Nexo.setState({ demo: 'loading' }));
  await p.waitForTimeout(500);
  await shot(p, 'd1440-carregando', true);
  await p.evaluate(() => Nexo.setState({ demo: 'normal' }));
  // sair
  await p.click('#btn-profile');
  await p.click('.menu-item--danger');
  await p.waitForTimeout(200);
  log('sair -> ', await p.evaluate(() => location.hash), await p.isVisible('#view-login'));
  await ctx.close();

  console.log(errors.length ? 'ERROS:\n' + errors.join('\n') : 'Sem erros de console.');
  await browser.close();
})();
