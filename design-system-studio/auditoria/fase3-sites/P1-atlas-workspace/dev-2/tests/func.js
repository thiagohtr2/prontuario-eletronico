const L = require('./lib');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL:', m); } else console.log('ok  :', m); };
(async () => {
  // ---------- DESKTOP: auth ----------
  let { browser, page, errors } = await L.launch({ width: 1280, height: 800 });
  await page.goto(L.url);
  ok((await page.title()).startsWith('Entrar'), 'abre direto no login');
  await page.click('#lg-submit');
  ok(await page.locator('#login-summary .alert').count() === 1, 'resumo de erros no envio vazio');
  ok(await page.getAttribute('#lg-email', 'aria-invalid') === 'true', 'email aria-invalid');
  ok((await page.getAttribute('#lg-email', 'aria-describedby')).includes('lg-email-err'), 'aria-describedby');
  ok(await page.getAttribute('#login-summary', 'role') === 'alert', 'resumo role=alert');
  await page.screenshot({ path: L.shot('login-errors') });
  await page.fill('#lg-email', 'foo@bar.com'); await page.fill('#lg-pass', 'errada123');
  await page.click('#lg-submit');
  ok(await page.isDisabled('#lg-submit') && (await page.textContent('#lg-submit')).includes('Entrando'), 'botão carregando e desabilitado');
  await page.waitForSelector('#login-summary .alert__title', { timeout: 3000 });
  ok((await page.textContent('#login-summary')).includes('E-mail ou senha incorretos'), 'erro genérico de credenciais');
  ok(await page.inputValue('#lg-email') === 'foo@bar.com', 'não apaga o que foi digitado');
  // mostrar/ocultar senha
  await page.click('#lg-pass ~ [data-toggle-pw]');
  ok(await page.getAttribute('#lg-pass', 'type') === 'text' && await page.getAttribute('#lg-pass ~ [data-toggle-pw]', 'aria-pressed') === 'true', 'toggle senha mostra');
  ok(await page.getAttribute('#lg-pass ~ [data-toggle-pw]', 'aria-label') === 'Ocultar senha', 'aria-label alterna');
  // recuperar
  await page.click('#lg-forgot');
  await page.fill('#rc-email', 'qualquer@x.com'); await page.click('#rec-form [type=submit]');
  await page.waitForSelector('#rc-result-title:visible', { timeout: 3000 });
  ok((await page.textContent('[data-view=result]')).includes('Se o e-mail existir, enviaremos um link'), 'recuperação mensagem neutra');
  // cadastro
  await page.goto(L.url + '#/cadastro');
  await page.screenshot({ path: L.shot('signup-1280') });
  await page.fill('#su-pass', 'abc');
  ok((await page.textContent('#su-strength-text')).includes('Fraca'), 'força fraca');
  await page.fill('#su-pass', 'Atlas@2026');
  ok((await page.textContent('#su-strength-text')).includes('Média'), 'força média');
  await page.fill('#su-pass', 'Atlas@2026-Forte!');
  ok((await page.textContent('#su-strength-text')).includes('Forte'), 'força forte');
  await page.fill('#su-name', 'Ana Souza'); await page.fill('#su-email', 'ana@x.com'); await page.fill('#su-confirm', 'diferente');
  await page.click('#su-submit');
  ok((await page.textContent('#signup-summary')).includes('As senhas não coincidem'), 'confirmação não coincide no resumo');
  await page.fill('#su-confirm', 'Atlas@2026-Forte');
  ok((await page.textContent('#su-confirm-err')).includes('As senhas não coincidem'), 'erro em tempo real (confirm)');
  await page.fill('#su-confirm', 'Atlas@2026-Forte!');
  ok(await page.isHidden('#su-confirm-err'), 'erro some ao coincidir');
  await page.click('#su-submit'); // termos não aceitos
  ok((await page.textContent('#signup-summary')).includes('Aceite os Termos'), 'termos obrigatórios');
  await page.check('#su-terms'); await page.click('#su-submit');
  await page.waitForSelector('[data-view=result]:not([hidden])', { timeout: 3000 });
  ok(true, 'cadastro neutro com Entrar / Recuperar senha');
  await page.screenshot({ path: L.shot('signup-result') });
  // login com a conta criada
  await page.click('#su-go-login');
  ok(await page.inputValue('#lg-email') === 'ana@x.com', 'e-mail preenchido após cadastro');
  await page.fill('#lg-pass', 'Atlas@2026-Forte!'); await page.click('#lg-submit');
  await page.waitForSelector('#app', { timeout: 4000 });
  ok(true, 'login com conta nova funciona');
  await page.waitForTimeout(1400);

  // ---------- DESKTOP: shell ----------
  ok(await page.locator('.sidebar').evaluate(e => e.getBoundingClientRect().width) === 252, 'sidebar 252 px em 1280');
  ok(await page.locator('.app-header').evaluate(e => e.getBoundingClientRect().height) === 64, 'header 64 px');
  ok(await page.locator('.app-header').evaluate(e => e.getBoundingClientRect().left) === 252, 'header só sobre a coluna principal');
  ok(await page.getAttribute('.nav-item[data-route=painel]', 'aria-current') === 'page', 'item ativo aria-current');
  // recolher
  await page.click('#sb-toggle');
  await page.waitForTimeout(300);
  ok(await page.locator('.sidebar').evaluate(e => e.getBoundingClientRect().width) === 72, 'recolhe para 72 px');
  ok(await page.getAttribute('#sb-toggle', 'aria-label') === 'Expandir menu', 'aria-label Expandir menu');
  await page.hover('.nav-item[data-route=tarefas]');
  await page.waitForTimeout(100);
  ok((await page.locator('.tooltip').textContent()) === 'Tarefas' && await page.locator('.tooltip').isVisible(), 'tooltip no trilho');
  await page.screenshot({ path: L.shot('rail-1280') });
  await page.reload();
  await page.waitForSelector('#app'); await page.waitForTimeout(300);
  ok(await page.locator('.sidebar').evaluate(e => e.getBoundingClientRect().width) === 72, 'estado recolhido lembrado (localStorage)');
  await page.click('#sb-toggle'); await page.waitForTimeout(300);
  // grupos recolhíveis
  await page.click('.nav-group[data-group=Equipe] .nav-group__title');
  ok(await page.locator('.nav-item[data-route=pessoas]').isHidden(), 'grupo recolhe (accordion)');
  await page.click('.nav-group[data-group=Equipe] .nav-group__title');
  // header sticky + sombra
  await page.evaluate(() => { location.hash = '#/ajuda'; }); await page.waitForTimeout(300);
  await page.mouse.move(700, 400); await page.mouse.wheel(0, 400); await page.waitForTimeout(400);
  ok(Math.abs(await page.locator('.app-header').evaluate(e => e.getBoundingClientRect().top)) < 1, 'header fica fixo ao rolar');
  ok(await page.locator('.app-header').evaluate(e => e.classList.contains('is-scrolled')), 'sombra após 8px');
  ok(Math.abs(await page.locator('.sidebar').evaluate(e => e.getBoundingClientRect().top)) < 1, 'sidebar fixa ao rolar');
  await page.evaluate(() => window.scrollTo(0, 0));
  // bell
  await page.click('#bell'); await page.waitForSelector('.notifs');
  ok(await page.locator('.popover').evaluate(e => Math.round(e.getBoundingClientRect().width)) === 320, 'popover de notificações 320 px');
  await page.screenshot({ path: L.shot('bell-1280') });
  await page.click('.notif.is-unread >> nth=0');
  ok((await page.textContent('#bell-count')) === '3', 'marcar lida atualiza contador');
  await page.keyboard.press('Escape');
  ok(await page.locator('.popover').count() === 0, 'Esc fecha popover');
  ok(await page.evaluate(() => document.activeElement.id) === 'bell', 'foco volta ao sino');
  // avatar
  await page.click('#avatar-btn'); await page.waitForSelector('.menu');
  const items = await page.locator('.menu [role=menuitem]').allTextContents();
  ok(items.join('|') === 'Meu perfil|Configurações|Ajuda|Sair', 'menu do perfil: ' + items.join('|'));
  await page.screenshot({ path: L.shot('avatar-1280') });
  await page.keyboard.press('Escape');
  // perfil na sidebar abre para cima
  await page.click('#sb-more'); await page.waitForSelector('.menu');
  const mb = await page.locator('.menu').evaluate(e => e.getBoundingClientRect());
  const bb = await page.locator('#sb-more').evaluate(e => e.getBoundingClientRect());
  ok(mb.bottom <= bb.top, 'menu do perfil abre para cima');
  await page.keyboard.press('Escape');
  // busca
  await page.fill('#hdr-search input', 'calend');
  ok(await page.locator('.search__list [role=option]').count() >= 1, 'busca encontra Calendário (sem acento/caixa)');
  await page.fill('#hdr-search input', 'CONFIGURACOES');
  ok((await page.locator('.search__list [role=option]').first().textContent()).includes('Configurações'), 'busca ignora acento e caixa');
  await page.fill('#hdr-search input', 'zzzz');
  ok((await page.textContent('.search__list')).includes('Nada encontrado'), 'Nada encontrado');
  await page.fill('#hdr-search input', 'projet');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  ok(page.url().includes('#/projetos'), 'Enter navega para resultado');

  // ---------- dashboard ----------
  await page.evaluate(() => { location.hash = '#/painel'; }); await page.waitForTimeout(1500);
  await page.click('[data-period="12m"]');
  ok(await page.locator('.kpi--skel').count() === 3, 'estados de carregando por bloco');
  await page.waitForTimeout(1500);
  ok((await page.textContent('.kpi__value >> nth=0')) === 'R$ 39,1 mil', 'filtro de período atualiza KPIs');
  ok(await page.locator('.chart__bar').count() === 12, 'filtro de período atualiza gráfico (12 barras)');
  await page.hover('.chart__bar >> nth=11');
  ok(await page.locator('.chart__tip').isVisible(), 'tooltip do gráfico');
  await page.hover('.kpi >> nth=0 >> .spark');
  ok(await page.locator('.spark__tip >> nth=0').isVisible(), 'tooltip do sparkline');
  await page.screenshot({ path: L.shot('dash-12m') });
  await page.click('.kpi >> nth=0 >> .spark');
  await page.waitForTimeout(300);
  ok(page.url().includes('#/relatorios?kpi=receita'), 'clique no KPI abre relatório detalhado');

  // ---------- tabela ----------
  await page.waitForTimeout(300);
  await page.click('.th-btn[data-sort=valor]');
  ok(await page.getAttribute('th:has(.th-btn[data-sort=valor])', 'aria-sort') === 'ascending', 'aria-sort ascending');
  const first = await page.locator('[data-table] tbody tr >> nth=0 >> td >> nth=1').textContent();
  ok(first === 'Rafael Moura', 'ordena por valor asc: ' + first);
  await page.check('[data-all]');
  ok(await page.locator('[data-row]:checked').count() === 4, 'selecionar todos');
  await page.uncheck('[data-row] >> nth=0');
  ok(await page.evaluate(() => document.querySelector('[data-all]').indeterminate), 'cabeçalho indeterminado');
  await page.screenshot({ path: L.shot('table-sel') });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-export]')]);
  ok(dl.suggestedFilename() === 'pedidos-recentes.csv', 'exporta CSV');
  await page.click('[data-state=empty]');
  ok(await page.locator('.state-box--empty').isVisible(), 'estado vazio');
  await page.click('[data-state=error]');
  ok(await page.locator('.state-box--error').isVisible(), 'estado erro');
  await page.click('[data-retry]'); await page.waitForTimeout(1300);
  ok(await page.locator('[data-table] tbody tr').count() === 4, 'tentar novamente volta aos dados');
  await page.click('[data-actions] >> nth=0'); await page.waitForTimeout(150); await page.keyboard.press('Enter');
  await page.waitForSelector('.dialog');
  ok(await page.locator('.dialog').isVisible(), 'diálogo de detalhes');
  await page.keyboard.press('Escape');
  ok(await page.locator('.dialog').count() === 0, 'Esc fecha diálogo');

  // ---------- cards + ajuda/form ----------
  await page.evaluate(() => { location.hash = '#/inicio'; }); await page.waitForTimeout(300);
  await page.click('[data-card=lisboa]');
  ok((await page.textContent('.dialog__title')) === 'Viagem a Lisboa', 'card abre detalhes');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => document.activeElement.dataset.card) === 'lisboa', 'foco volta ao card');
  await page.evaluate(() => { location.hash = '#/ajuda'; }); await page.waitForTimeout(300);
  await page.click('.swform [type=submit]');
  ok(await page.locator('.swform__summary a').count() >= 4, 'form: resumo com links');
  await page.fill('.swform input[name=nome]', 'Ana'); await page.fill('.swform input[name=sobrenome]', 'S');
  await page.screenshot({ path: L.shot('form-errors') });
  await page.fill('.swform input[name=email]', 'a@b.co'); await page.selectOption('.swform select[name=assunto]', 'duvida');
  await page.fill('.swform textarea', 'Olá, preciso de ajuda com o painel.'); await page.check('.swform input[name=termos]');
  await page.click('.swform [type=submit]');
  ok((await page.textContent('.swform [type=submit]')).includes('Enviando'), 'form: botão "Enviando…"');
  await page.waitForTimeout(1500);
  ok((await page.textContent('.swform__summary')).includes('Mensagem enviada'), 'form: sucesso');

  // ---------- tablet 900: rail + overlay ----------
  await page.setViewportSize({ width: 900, height: 800 }); await page.waitForTimeout(400);
  ok(await page.locator('.sidebar').evaluate(e => Math.round(e.getBoundingClientRect().width)) === 72, 'tablet: trilho 72 px');
  await page.click('#sb-toggle'); await page.waitForTimeout(200);
  ok(await page.locator('.sidebar').evaluate(e => Math.round(e.getBoundingClientRect().width)) === 252, 'tablet: expande em sobreposição');
  ok(await page.locator('#sb-scrim').isVisible(), 'scrim visível');
  await page.screenshot({ path: L.shot('overlay-900') });
  await page.keyboard.press('Escape');
  ok(await page.locator('.sidebar').evaluate(e => Math.round(e.getBoundingClientRect().width)) === 72, 'Esc fecha overlay');
  await page.click('#sb-toggle'); await page.mouse.click(700, 400); await page.waitForTimeout(200);
  ok(await page.locator('#sb-scrim').isHidden(), 'clique fora fecha overlay');
  // 1100: 220
  await page.setViewportSize({ width: 1100, height: 800 }); await page.waitForTimeout(400);
  ok(await page.locator('.sidebar').evaluate(e => Math.round(e.getBoundingClientRect().width)) === 220, '1024-1279: sidebar 220 px');
  console.log('desktop console:', errors.join(' | ') || 'none');
  await browser.close();

  // ---------- MOBILE 390 ----------
  ({ browser, page, errors } = await L.launch({ width: 390, height: 800 }, { mobile: true, touch: true }));
  await L.login(page);
  ok(await page.locator('.sidebar-slot').isHidden(), 'mobile: sem sidebar');
  const bn = await page.locator('.bottom-nav').evaluate(e => e.getBoundingClientRect());
  ok(Math.round(bn.height) === 65 || Math.round(bn.height) === 64, 'bottom nav ~64 px: ' + bn.height);
  ok(await page.locator('.bottom-nav .bn-item').count() === 4, '4 destinos');
  ok(await page.getAttribute('.bn-item[data-tab=painel]', 'aria-current') === 'page', 'aria-current no destino ativo');
  const hh = await page.locator('.app-header').evaluate(e => e.getBoundingClientRect().height);
  ok(Math.round(hh) === 56, 'topbar 56 px: ' + hh);
  // rolagem preservada
  await page.evaluate(() => window.scrollTo(0, 500)); await page.waitForTimeout(200);
  await page.tap('.bn-item[data-tab=projetos]'); await page.waitForTimeout(500);
  await page.tap('.bn-item[data-tab=painel]'); await page.waitForTimeout(1500);
  ok(Math.abs(await page.evaluate(() => scrollY) - 500) < 10, 'cada destino preserva a rolagem: ' + await page.evaluate(() => scrollY));
  await page.tap('.bn-item[data-tab=painel]'); await page.waitForTimeout(700);
  ok(await page.evaluate(() => scrollY) === 0, 'tocar no destino ativo rola ao topo');
  // pilha por destino
  await page.tap('.bn-item[data-tab=projetos]'); await page.waitForTimeout(400);
  await page.evaluate(() => { location.hash = '#/projetos/site-institucional/pagina-inicial'; }); await page.waitForTimeout(400);
  ok((await page.textContent('.topbar-back span')) === 'Site institucional', 'topbar: ‹ Site institucional');
  await page.screenshot({ path: L.shot('mobile-nested') });
  await page.tap('.bn-item[data-tab=tarefas]'); await page.waitForTimeout(400);
  await page.tap('.bn-item[data-tab=projetos]'); await page.waitForTimeout(400);
  ok(page.url().endsWith('pagina-inicial'), 'destino restaura a própria pilha');
  // Mais
  await page.tap('#bn-more'); await page.waitForSelector('.dialog--more');
  ok(await page.locator('.more__item').count() === 7, 'Mais: 7 destinos restantes');
  await page.screenshot({ path: L.shot('mobile-more') });
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => document.activeElement.id) === 'bn-more', 'Mais: foco volta ao gatilho');
  await page.tap('#bn-more'); await page.waitForSelector('.dialog--more');
  await page.tap('.more__item[data-route=mensagens]'); await page.waitForTimeout(500);
  ok(page.url().endsWith('#/mensagens') && await page.getAttribute('#bn-more', 'aria-current') === 'true', 'Mais abre destino e fica ativo');
  // sino como sheet
  await page.tap('#bell'); await page.waitForSelector('.dialog');
  await page.screenshot({ path: L.shot('mobile-bell') });
  const dr = await page.locator('.dialog').evaluate(e => e.getBoundingClientRect());
  ok(Math.round(dr.bottom) === 800, 'sino vira bottom sheet');
  await page.tap('.dialog [data-close]');
  console.log('mobile console:', errors.join(' | ') || 'none');
  await browser.close();
  console.log(fails ? `\n${fails} FALHAS` : '\nTodos os testes passaram');
})().catch(e => { console.error('ERRO NO TESTE', e); process.exit(1); });
