// Testes de interação: validação, login, sidebar, popovers, tabela, filtros, celular.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
let fails = 0;
function check(cond, msg) { console.log((cond ? 'OK   ' : 'FALHA') + ' ' + msg); if (!cond) fails++; }
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();

  // --- login: validação ---
  await page.click('button[type=submit]');
  await page.waitForTimeout(100);
  check(await page.getAttribute('#login-email', 'aria-invalid') === 'true', 'e-mail vazio marcado aria-invalid');
  check((await page.textContent('[data-summary]')).includes('Corrija 2 campos'), 'resumo no topo com 2 erros');
  check(await page.evaluate(() => document.querySelector('[data-summary]').getAttribute('role')) === 'alert', 'resumo com role=alert');
  await page.fill('#login-email', 'abc');
  await page.locator('#login-email').blur();
  check((await page.textContent('#login-email-msg')).includes('e-mail válido'), 'erro de formato ao sair do campo');
  // mostrar/ocultar senha
  await page.click('[data-pw-toggle]');
  check(await page.getAttribute('#login-password', 'type') === 'text', 'mostrar senha');
  check(await page.getAttribute('[data-pw-toggle]', 'aria-label') === 'Ocultar senha' && await page.getAttribute('[data-pw-toggle]', 'aria-pressed') === 'true', 'aria-label/aria-pressed alternam');
  // credenciais erradas
  await page.fill('#login-email', 'marina@atlas.app');
  await page.fill('#login-password', 'errada123');
  await page.click('button[type=submit]');
  await page.waitForTimeout(150);
  check((await page.textContent('button[type=submit]')).includes('Entrando'), 'botão em estado "Entrando…"');
  check(await page.isDisabled('button[type=submit]'), 'botão desabilitado durante envio');
  await page.waitForTimeout(1000);
  check((await page.textContent('[data-summary]')).includes('E-mail ou senha incorretos'), 'erro genérico de credenciais');
  check(await page.inputValue('#login-email') === 'marina@atlas.app', 'não apaga o que foi digitado');
  // recuperação
  await page.click('text=Esqueci minha senha');
  await page.fill('#rc-email', 'qualquer@empresa.com');
  await page.click('button[type=submit]');
  await page.waitForTimeout(1100);
  check((await page.textContent('.auth-card')).includes('Se o e-mail existir, enviaremos um link'), 'mensagem neutra de recuperação');
  check(await page.getAttribute('#rc-code', 'autocomplete') === 'one-time-code', 'campo de código one-time-code');
  // cadastro
  await page.evaluate(() => location.hash = '#/cadastro');
  await page.waitForTimeout(200);
  await page.fill('#su-password', 'abc');
  check((await page.textContent('#su-strength')).includes('fraca'), 'força: fraca');
  await page.fill('#su-password', 'abcdef12');
  check((await page.textContent('#su-strength')).includes('média'), 'força: média');
  await page.fill('#su-password', 'Abcdef12!xyz');
  check((await page.textContent('#su-strength')).includes('forte'), 'força: forte');
  await page.fill('#su-name', 'Ana Souza');
  await page.fill('#su-email', 'marina@atlas.app');
  await page.fill('#su-confirm', 'outra');
  await page.click('button[type=submit]');
  await page.waitForTimeout(100);
  check((await page.textContent('#su-confirm-msg')).includes('As senhas não coincidem'), 'confirmação: senhas não coincidem');
  check((await page.textContent('#su-terms-msg')).length > 0, 'termos obrigatórios [' + await page.textContent('#su-terms-msg') + '|' + await page.textContent('[data-summary]') + ']');
  await page.fill('#su-confirm', 'Abcdef12!xyz');
  check((await page.textContent('#su-confirm-msg')) === '', 'erro some em tempo real após corrigir');
  await page.check('#su-terms');
  await page.click('button[type=submit]');
  await page.waitForTimeout(1200);
  check((await page.textContent('[data-summary]')).includes('recupere sua senha'), 'e-mail existente: mensagem neutra com Entrar/Recuperar');
  await page.fill('#su-email', 'ana@empresa.com');
  await page.click('button[type=submit]');
  await page.waitForTimeout(1400);
  check(await page.evaluate(() => location.hash) === '#/inicio', 'cadastro cria conta e entra');
  check((await page.textContent('#main h1')).includes('Ana'), 'saudação com o nome cadastrado');

  // --- shell desktop ---
  await page.click('.sidebar__toggle');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.querySelector('.sidebar-slot').getBoundingClientRect().width) === 72, 'sidebar recolhe para 72 px');
  check(await page.evaluate(() => localStorage.getItem('atlas.sidebarCollapsed')) === 'true', 'estado recolhido salvo no localStorage');
  await page.hover('.nav-item[data-nav="tarefas"]');
  await page.waitForTimeout(100);
  check(await page.evaluate(() => { const t = document.getElementById('atlas-tooltip'); return t && !t.hidden && t.textContent; }) === 'Tarefas', 'tooltip à direita no trilho');
  await page.click('.sidebar__rail-toggle button');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.querySelector('.sidebar-slot').getBoundingClientRect().width) === 252, 'sidebar expande para 252 px');
  // grupo accordion
  await page.click('#ng-equipe');
  check(await page.evaluate(() => document.querySelector('[data-group="equipe"]').classList.contains('is-closed')), 'grupo recolhe (accordion)');
  check(await page.evaluate(() => JSON.parse(localStorage.getItem('atlas.navGroups')).equipe) === false, 'estado do grupo lembrado');
  await page.click('#ng-equipe');
  // notificações
  await page.click('[data-notif]');
  await page.waitForTimeout(100);
  const pw = await page.evaluate(() => document.querySelector('#portal .popover') && document.querySelector('#portal .popover').getBoundingClientRect().width);
  check(pw === 320, 'popover de notificações com 320 px (' + pw + ')');
  check(await page.getAttribute('[data-notif]', 'aria-expanded') === 'true', 'sino aria-expanded=true');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => !document.querySelector('#portal .popover')) && await page.evaluate(() => document.activeElement.matches('[data-notif]')), 'Esc fecha e devolve foco ao sino');
  // menu de perfil
  await page.click('[data-user-menu]');
  const items = await page.$$eval('.popover [role=menuitem]', els => els.map(e => e.textContent.trim()));
  check(items.join('|') === 'Meu perfil|Configurações|Ajuda|Sair', 'menu do perfil: ' + items.join(', '));
  const rightEdge = await page.evaluate(() => document.querySelector('#portal .popover').getBoundingClientRect().right);
  check(rightEdge <= 1280 - 8 + 1, 'menu alinhado à direita dentro da viewport');
  await page.mouse.click(600, 400);
  check(await page.evaluate(() => !document.querySelector('#portal .popover')), 'clique fora fecha o menu');
  // busca
  await page.fill('#global-search', 'lisboa');
  await page.waitForTimeout(100);
  check((await page.textContent('#search-results')).includes('Viagem a Lisboa'), 'busca encontra projeto');
  await page.fill('#global-search', 'calendario');
  check((await page.textContent('#search-results')).includes('Calendário'), 'busca sem acento');
  await page.fill('#global-search', 'zzzz');
  check((await page.textContent('#search-results')).includes('Nada encontrado'), 'busca vazia: "Nada encontrado"');
  await page.keyboard.press('Escape');
  await page.fill('#global-search', '');

  // --- painel ---
  await page.evaluate(() => location.hash = '#/painel');
  await page.waitForTimeout(1000);
  check(await page.$$eval('.sw-kpi', e => e.length) === 3, '3 KPIs');
  check(await page.$$eval('.chart__bar', e => e.length) === 30, 'gráfico com 30 barras (30 dias)');
  await page.click('[data-period="12m"]');
  await page.waitForTimeout(100);
  check(await page.evaluate(() => document.querySelector('[data-block="kpis"]').getAttribute('aria-busy')) === 'true', 'carregando por bloco ao trocar período');
  await page.waitForTimeout(1000);
  check(await page.$$eval('.chart__bar', e => e.length) === 12, 'período 12 meses: 12 barras');
  check((await page.textContent('[data-kpi="receita"]')).includes('Receita anual'), 'KPI acompanha período');
  // tooltip barra
  const bar = await page.$('.chart__bar[data-i="3"]');
  await bar.scrollIntoViewIfNeeded();
  const bb = await bar.boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height - 5);
  check(await page.evaluate(() => !!document.querySelector('.chart__tip')), 'tooltip no gráfico');
  // tabela
  const firstClient = () => page.$eval('[data-block="orders"] tbody tr td:nth-child(2)', e => e.textContent);
  await page.click('[data-sort="client"]');
  check(await firstClient() === 'Clínica Bem Viver', 'ordenação por cliente A–Z');
  check(await page.getAttribute('th[data-col="client"]', 'aria-sort') === 'ascending', 'aria-sort ascending');
  await page.click('[data-sort="client"]');
  check(await page.getAttribute('th[data-col="client"]', 'aria-sort') === 'descending', 'aria-sort descending');
  await page.click('[data-block="orders"] tbody tr:nth-child(1) .sw-checkbox');
  check(await page.evaluate(() => document.querySelector('thead [data-select-all]').indeterminate), 'checkbox do cabeçalho indeterminado');
  check((await page.textContent('[data-bulk]')).includes('1 selecionado'), 'barra de ações em massa');
  await page.click('thead [data-select-all]');
  check((await page.textContent('[data-bulk]')).includes('4 selecionados'), 'selecionar todos');
  await page.selectOption('[data-block="orders"] select[id$="-state"]', 'error');
  check((await page.textContent('[data-block="orders"] tbody')).includes('Não foi possível'), 'estado de erro');
  await page.selectOption('[data-block="orders"] select[id$="-state"]', 'empty');
  check((await page.textContent('[data-block="orders"] tbody')).includes('Nenhum pedido'), 'estado vazio');
  await page.selectOption('[data-block="orders"] select[id$="-state"]', 'ready');
  await page.fill('[data-block="orders"] .sw-search input', 'xyz');
  check((await page.textContent('[data-block="orders"] tbody')).includes('Nenhum pedido encontrado'), 'busca sem resultado na tabela');
  // KPI abre relatório
  await page.click('[data-kpi="receita"] .sw-kpi__label');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => location.hash) === '#/relatorios/receita', 'clique no KPI abre relatório detalhado');

  // --- ajuda: formulário Swiss ---
  await page.evaluate(() => location.hash = '#/ajuda');
  await page.waitForTimeout(300);
  await page.click('.contact-form [type=submit]');
  check((await page.textContent('.contact-form [data-summary]')).includes('campos'), 'resumo de erros no formulário de contato');
  const link = await page.$('.contact-form [data-summary] a');
  await link.click();
  check(await page.evaluate(() => document.activeElement.id) === 'ct-subject', 'link do resumo foca o campo');

  // --- tablet: trilho + sobreposição ---
  await page.setViewportSize({ width: 900, height: 800 });
  await page.evaluate(() => location.hash = '#/inicio');
  await page.waitForTimeout(500);
  check(await page.evaluate(() => document.querySelector('.sidebar-slot').getBoundingClientRect().width) === 72, 'tablet: trilho de 72 px');
  await page.click('.sidebar__rail-toggle button');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.querySelector('.sidebar').classList.contains('is-overlay') && !document.querySelector('[data-sidebar-scrim]').hidden), 'tablet: sidebar em sobreposição com scrim');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  check(await page.evaluate(() => !document.querySelector('.sidebar').classList.contains('is-overlay')), 'tablet: Esc fecha a sobreposição');
  check(await page.evaluate(() => document.activeElement.closest('.sidebar__rail-toggle') !== null), 'tablet: foco volta ao gatilho');

  // --- celular ---
  await page.setViewportSize({ width: 375, height: 740 });
  await page.evaluate(() => location.hash = '#/painel');
  await page.waitForTimeout(1000);
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.bottom-nav')).display) === 'block', 'celular: bottom nav visível');
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.sidebar-slot')).display) === 'none', 'celular: sidebar fora do fluxo');
  check(await page.evaluate(() => document.querySelector('.bn-item[data-tab="painel"]').getAttribute('aria-current')) === 'page', 'celular: destino ativo aria-current');
  const bnH = await page.evaluate(() => document.querySelector('.bottom-nav ul').getBoundingClientRect().height);
  check(bnH === 64, 'celular: bottom nav com 64 px (' + bnH + ')');
  // rolagem preservada por destino
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(100);
  await page.click('.bn-item[data-tab="projetos"]');
  await page.waitForTimeout(700);
  await page.click('.bn-item[data-tab="painel"]');
  await page.waitForTimeout(1200);
  const y = await page.evaluate(() => window.scrollY);
  check(y > 400, 'celular: posição de rolagem do destino preservada (' + y + ')');
  await page.click('.bn-item[data-tab="painel"]');
  await page.waitForTimeout(800);
  check(await page.evaluate(() => window.scrollY) === 0, 'celular: tocar no destino ativo rola ao topo');
  // pilha do destino "Mais"
  await page.click('.bn-item[data-tab="mais"]');
  await page.waitForTimeout(500);
  console.log('     (Mais restaurou a pilha em ' + await page.evaluate(() => location.hash) + ')');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('.bn-item[data-tab="mais"]');
  await page.waitForTimeout(500);
  check(await page.evaluate(() => location.hash) === '#/mais', 'celular: tocar no destino ativo no topo volta à raiz');
  await page.click('.more-item[href="#/pessoas"]');
  await page.waitForTimeout(900);
  await page.click('.bn-item[data-tab="inicio"]');
  await page.waitForTimeout(500);
  await page.click('.bn-item[data-tab="mais"]');
  await page.waitForTimeout(500);
  check(await page.evaluate(() => location.hash) === '#/pessoas', 'celular: destino "Mais" preserva a pilha (volta a Pessoas)');
  // tabela vira cartões
  check(await page.evaluate(() => getComputedStyle(document.querySelector('.sw-table thead')).display) === 'none', 'celular: tabela em cartões');
  // perfil vira bottom sheet
  await page.click('[data-user-menu]');
  await page.waitForTimeout(100);
  check(await page.evaluate(() => !!document.querySelector('.sheet')), 'celular: menu do perfil vira bottom sheet');
  await page.click('.sheet [data-close]');
  check(await page.evaluate(() => !document.querySelector('.sheet') && document.activeElement.matches('[data-user-menu]')), 'celular: botão ✕ fecha e devolve o foco');
  // trilha vira link único
  await page.evaluate(() => location.hash = '#/projetos/site-institucional/pagina-inicial');
  await page.waitForTimeout(500);
  check((await page.textContent('.crumb-back a')).trim() === 'Site institucional', 'celular: trilha vira "‹ Site institucional"');
  // alvos de toque
  const small = await page.evaluate(() => [...document.querySelectorAll('.topbar a, .topbar button, .bottom-nav a, .crumb-back a')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect()).filter(r => r.width < 44 || r.height < 44).length);
  check(small === 0, 'celular: alvos de toque ≥ 44 px no topo/base');
  // inputs ≥ 16px
  await page.evaluate(() => location.hash = '#/ajuda');
  await page.waitForTimeout(300);
  const fs = await page.$$eval('.contact-form input:not([type=checkbox]), .contact-form textarea, .contact-form select', els => els.map(e => parseFloat(getComputedStyle(e).fontSize)));
  check(fs.every(x => x >= 16), 'celular: campos com fonte ≥ 16 px');
  // sair
  await page.evaluate(() => location.hash = '#/mais');
  await page.waitForTimeout(300);
  await page.click('[data-logout]');
  await page.waitForTimeout(300);
  check(await page.evaluate(() => location.hash) === '#/entrar', 'sair volta para o login');

  // paisagem: barras ≤ 25% da altura
  await page.setViewportSize({ width: 740, height: 360 });
  await page.evaluate(() => { sessionStorage.setItem('atlas.session', JSON.stringify({ name: 'Marina Costa', email: 'marina@atlas.app', role: 'x' })); location.hash = '#/inicio'; });
  await page.waitForTimeout(500);
  const bars = await page.evaluate(() => document.querySelector('.topbar').getBoundingClientRect().height + document.querySelector('.bottom-nav').getBoundingClientRect().height);
  check(bars / 360 <= 0.25, 'paisagem: barras fixas somam ' + Math.round(bars / 360 * 100) + '% da altura');

  console.log(errors.length ? 'ERROS JS: ' + errors.join(' ; ') : 'Sem erros de JS.');
  console.log(fails ? fails + ' falha(s)' : 'Todos os testes passaram.');
  await browser.close();
})();
