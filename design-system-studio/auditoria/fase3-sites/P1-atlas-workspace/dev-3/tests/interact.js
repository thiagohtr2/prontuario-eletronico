/* Testes de interação: sidebar, overlay, popovers, busca, painel, tabela, formulários e badges.
   Uso: node tests/interact.js */
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'file://' + path.join(__dirname, '..', 'index.html');
const SESSION = JSON.stringify({ name: 'Ana Souza', email: 'demo@atlas.app', role: 'Administradora' });
const failures = [];
const log = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) failures.push(msg); };

async function open(browser, width, height, route, withSession = true) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(BASE + '#/entrar');
  if (withSession) await page.evaluate((s) => localStorage.setItem('atlas.session', s), SESSION);
  await page.goto(BASE + '#' + route);
  await page.waitForSelector('h1', { timeout: 4000 });
  await page.waitForTimeout(550);
  return { ctx, page, errors };
}

const width = (page, sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().width, sel);

(async () => {
  const browser = await chromium.launch();

  // --- Sidebar: colapsar, lembrar estado, grupos ---
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/painel');
    log((await width(page, '.sidebar')) > 240, 'desktop 1440: sidebar integral ~252px');
    await page.click('.btn-collapse');
    await page.waitForTimeout(100);
    log((await width(page, '.sidebar')) < 80, 'botão "Recolher menu" leva a sidebar a trilho de 72px');
    log((await page.getAttribute('.btn-collapse', 'aria-label')) === 'Expandir menu', 'aria-label alterna para "Expandir menu"');
    await page.reload();
    await page.waitForTimeout(300);
    log((await width(page, '.sidebar')) < 80, 'estado recolhido é lembrado após recarregar (localStorage)');
    await page.click('.btn-collapse');
    await page.click('.nav-group__btn[aria-controls="grp-equipe-list"]');
    log((await page.isHidden('#grp-equipe-list')) === true, 'grupo "Equipe" recolhe (accordion)');
    log((await page.getAttribute('.nav-group__btn[aria-controls="grp-equipe-list"]', 'aria-expanded')) === 'false', 'aria-expanded=false no grupo');
    await page.reload();
    await page.waitForTimeout(300);
    log((await page.isHidden('#grp-equipe-list')) === true, 'estado do grupo é lembrado após recarregar');
    log((await page.getAttribute('.nav-item[href="#/app/painel"]', 'aria-current')) === 'page', 'item ativo recebe aria-current="page"');
    log(errors.length === 0, 'sem erros de console na sidebar: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Tablet 900px: rail + overlay com Esc e retorno de foco ---
  {
    const { ctx, page, errors } = await open(browser, 900, 800, '/app/painel');
    log((await width(page, '.sidebar')) < 80, 'tablet 900px: sidebar recolhida em trilho de 72px');
    await page.focus('.header__menu');
    await page.click('.header__menu');
    await page.waitForTimeout(150);
    log((await width(page, '.sidebar')) > 240, 'tablet: ☰ abre a sidebar completa em sobreposição');
    log(await page.isVisible('#scrim'), 'overlay mostra scrim');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    log((await width(page, '.sidebar')) < 80, 'Esc fecha a sobreposição');
    const focusedIsMenu = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('header__menu'));
    log(focusedIsMenu, 'foco volta ao botão ☰ ao fechar');
    await page.click('.header__menu');
    await page.waitForTimeout(100);
    await page.click('#scrim', { position: { x: 800, y: 300 } });
    await page.waitForTimeout(100);
    log((await width(page, '.sidebar')) < 80, 'clique no scrim fecha a sobreposição');
    log(errors.length === 0, 'tablet sem erros de console: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Popover do perfil: Esc e clique fora ---
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/inicio');
    await page.click('.avatar-btn');
    await page.waitForSelector('.popover--menu');
    log(await page.isVisible('.popover--menu'), 'avatar abre menu do perfil');
    log(await page.isVisible('.popover--menu >> text=Sair'), 'menu do perfil tem "Sair"');
    await page.keyboard.press('Escape');
    log((await page.$('.popover--menu')) === null, 'Esc fecha o popover');
    log(await page.evaluate(() => document.activeElement.classList.contains('avatar-btn')), 'foco volta ao avatar');
    await page.click('.avatar-btn');
    await page.click('h1', { position: { x: 5, y: 5 } });
    log((await page.$('.popover--menu')) === null, 'clique fora fecha o popover');
    await page.click('.avatar-btn');
    await page.click('.popover--menu >> text=Sair');
    await page.waitForURL(/#\/entrar/, { timeout: 3000 });
    log(await page.isVisible('#login-form'), '"Sair" encerra a sessão e volta para entrar');
    log(errors.length === 0, 'popovers sem erros de console: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Busca do cabeçalho ---
  {
    const { ctx, page } = await open(browser, 1440, 900, '/app/inicio');
    await page.fill('#global-search', 'rel');
    await page.waitForSelector('.search-results');
    log((await page.textContent('.search-results')).includes('Relatórios'), 'busca encontra "Relatórios"');
    await page.fill('#global-search', 'xyzzy');
    log((await page.textContent('.search-results')).includes('Nada encontrado'), 'busca sem resultado mostra "Nada encontrado"');
    await page.fill('#global-search', 'pess');
    await page.press('#global-search', 'Enter');
    await page.waitForURL(/#\/app\/equipe/, { timeout: 3000 });
    log(true, 'Enter na busca abre o primeiro resultado (Pessoas)');
    await ctx.close();
  }

  // --- Painel: filtro de período atualiza blocos ---
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/painel');
    log((await page.locator('.bar').count()) === 4, 'painel 30 dias: 4 barras (semanas)');
    await page.click('[data-period="7"]');
    await page.waitForTimeout(600);
    log((await page.locator('.bar').count()) === 7, 'filtro 7 dias atualiza o gráfico para 7 barras');
    log((await page.getAttribute('[data-period="7"]', 'aria-pressed')) === 'true', 'botão de período marca aria-pressed');
    log((await page.textContent('#kpis')).includes('R$ 12,8 mil'), 'KPI de receita atualiza com o período');
    await page.hover('.bar >> nth=2');
    log(await page.isVisible('.bar-col >> nth=2 >> .bar-tip'), 'tooltip da barra aparece ao passar o mouse');
    log(errors.length === 0, 'painel sem erros: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Relatórios: ordenação, filtro, vazio, seleção e erro com retry ---
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/relatorios');
    await page.waitForSelector('table.sw-table');
    await page.click('[data-action="orders-sort"][data-key="cents"]');
    log((await page.getAttribute('th.num', 'aria-sort')) === 'descending', 'ordenar por Valor (1º clique: decrescente)');
    const firstValue = await page.textContent('tbody tr:first-child td.num');
    log(firstValue.trim() === 'R$ 8.760,50', 'maior valor primeiro: ' + firstValue.trim());
    await page.selectOption('#status-filter', 'Pago');
    await page.waitForTimeout(100);
    log((await page.locator('tbody tr').count()) === 1, 'filtro "Pago" mostra 1 linha');
    await page.selectOption('#status-filter', 'Em análise');
    await page.selectOption('#status-filter', 'Cancelado');
    await page.check('tbody [data-row]');
    log((await page.textContent('.sw-table-tools')).includes('1 selecionado'), 'seleção de linha atualiza contador');
    await page.selectOption('#status-filter', 'all');
    await page.selectOption('#status-filter', 'Pendente');
    await page.selectOption('#status-filter', 'Pendente');
    await page.click('[data-action="orders-clear"]').catch(() => {});
    await ctx.close();
  }
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/relatorios?erro=1#/app/relatorios');
    // Recarrega com erro forçado via hash
    await page.goto(BASE + '#/app/relatorios?erro=1');
    await page.waitForSelector('[data-action="orders-retry"]', { timeout: 3000 });
    log(await page.isVisible('text=Não foi possível carregar os pedidos'), 'estado de erro da tabela aparece');
    await page.click('[data-action="orders-retry"]');
    await page.waitForSelector('table.sw-table', { timeout: 3000 });
    log(true, '"Tentar novamente" recarrega a tabela');
    await ctx.close();
  }

  // --- Projetos: diálogo de detalhes com Esc ---
  {
    const { ctx, page, errors } = await open(browser, 1440, 900, '/app/projetos');
    await page.click('[data-action="project"][data-id="p2"] >> nth=0');
    await page.waitForSelector('dialog[open]', { timeout: 2000 });
    log(await page.isVisible('dialog[open] >> text=Site institucional'), '"Ver detalhes" abre diálogo do projeto');
    await page.keyboard.press('Escape');
    log((await page.$('dialog[open]')) === null, 'Esc fecha o diálogo');
    log(errors.length === 0, 'projetos sem erros: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Mensagens: badge e marcar como lida ---
  {
    const { ctx, page } = await open(browser, 1440, 900, '/app/mensagens');
    log((await page.textContent('[data-badge="/app/mensagens"]')).trim() === '3', 'badge de Mensagens começa em 3');
    await page.click('[data-action="open-chat"][data-id="c1"]');
    await page.waitForTimeout(100);
    log((await page.textContent('[data-badge="/app/mensagens"]')).trim() === '2', 'abrir conversa não lida reduz o badge para 2');
    await page.click('[data-action="mark-all-read"]');
    await page.waitForTimeout(100);
    log(await page.isHidden('[data-badge="/app/mensagens"]'), '"Marcar todas como lidas" esconde o badge');
    await ctx.close();
  }

  // --- Tarefas: concluir atualiza resumo ---
  {
    const { ctx, page } = await open(browser, 1440, 900, '/app/tarefas');
    await page.waitForSelector('#task-list input[type=checkbox]');
    const before = await page.textContent('#task-summary');
    await page.click('#task-list input[type=checkbox] >> nth=0');
    const after = await page.textContent('#task-summary');
    log(before !== after, 'marcar tarefa atualiza o resumo: "' + after.trim() + '"');
    await ctx.close();
  }

  // --- Login e cadastro ---
  {
    const { ctx, page, errors } = await open(browser, 390, 844, '/cadastro', false);
    await page.click('#signup-submit');
    log(await page.isVisible('#signup-summary'), 'cadastro: envio vazio mostra resumo de erros');
    await page.fill('#signup-password', 'abc');
    const strengthA = await page.textContent('#signup-strength');
    log(/Fraca/.test(strengthA), 'força da senha: "Fraca" em texto');
    await page.fill('#signup-password', 'Abcdef12345!');
    log(/Forte/.test(await page.textContent('#signup-strength')), 'força da senha: "Forte" em texto');
    await page.fill('#signup-confirm', 'diferente1');
    log(/não coincidem/.test(await page.textContent('#signup-confirm-error')), 'confirmação mostra "As senhas não coincidem"');
    await page.fill('#signup-confirm', 'Abcdef12345!');
    log(!(await page.isVisible('#signup-confirm-error')), 'erro de confirmação some em tempo real ao coincidir');
    await page.fill('#signup-name', 'Ana Souza');
    await page.fill('#signup-email', 'ana@atlas.app');
    await page.check('#signup-terms');
    await page.click('#signup-submit');
    await page.waitForSelector('#signup-notice:not([hidden])', { timeout: 3000 });
    const notice = await page.textContent('#signup-notice');
    log(/Se você já tem uma conta/.test(notice) && /Recuperar senha/.test(notice), 'e-mail existente: mensagem neutra com Entrar / Recuperar senha');
    log(await page.isVisible('#signup-password') && (await page.inputValue('#signup-password')) === 'Abcdef12345!', 'cadastro mantém o que foi digitado');
    await page.fill('#signup-email', 'nova@exemplo.com');
    await page.click('#signup-submit');
    await page.waitForURL(/#\/app\/inicio/, { timeout: 4000 });
    log(true, 'cadastro válido cria sessão e abre o app');
    log(errors.length === 0, 'cadastro sem erros de console: ' + errors.join(' | '));
    await ctx.close();
  }
  {
    const { ctx, page } = await open(browser, 390, 844, '/entrar', false);
    await page.click('text=Esqueci minha senha');
    await page.waitForURL(/#\/recuperar/);
    await page.fill('#recover-email', 'qualquer@exemplo.com');
    await page.click('#recover-form button[type=submit]');
    await page.waitForSelector('#recover-status:not([hidden])', { timeout: 3000 });
    log((await page.textContent('#recover-status')).includes('Se o e-mail existir, enviaremos um link.'), 'recuperação: mensagem neutra');
    await ctx.close();
  }

  // --- Ajuda: formulário Swiss ---
  {
    const { ctx, page, errors } = await open(browser, 390, 844, '/app/ajuda');
    await page.click('#contact-form button[type=submit]');
    log(await page.isVisible('#ct-summary'), 'formulário Ajuda: envio vazio mostra resumo');
    await page.fill('#ct-name', 'Carlos');
    await page.fill('#ct-email', 'carlos@exemplo.com');
    await page.selectOption('#ct-subject', 'Suporte técnico');
    await page.fill('#ct-message', 'Preciso de ajuda com o painel.');
    await page.check('#ct-terms');
    await page.click('#contact-form button[type=submit]');
    await page.waitForSelector('#ct-status:not([hidden])', { timeout: 3000 });
    log((await page.textContent('#ct-status')).includes('Respondemos em até 1 dia útil'), 'formulário Ajuda envia com sucesso');
    log(errors.length === 0, 'ajuda sem erros: ' + errors.join(' | '));
    await ctx.close();
  }

  // --- Mobile: bottom nav e toque no destino ativo ---
  {
    const { ctx, page } = await open(browser, 390, 844, '/app/equipe');
    await page.click('.bottom-nav a[href="#/app/projetos"]');
    await page.waitForURL(/#\/app\/projetos/, { timeout: 3000 });
    log(true, 'toque no item da bottom navigation troca de destino');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(100);
    await page.click('.bottom-nav a[aria-current="page"]');
    await page.waitForTimeout(700);
    log((await page.evaluate(() => window.scrollY)) === 0, 'tocar no destino ativo rola ao topo');
    const tapH = await page.evaluate(() => document.querySelector('.bnav-item').getBoundingClientRect().height);
    log(tapH >= 48, 'alvos da bottom navigation com pelo menos 48 px de altura');
    await ctx.close();
  }

  // --- Teclado: foco visível no login ---
  {
    const { ctx, page } = await open(browser, 1440, 900, '/entrar', false);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    log(ring !== 'none', 'Tab mostra anel de foco visível nos campos');
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? '\n' + failures.length + ' falha(s)' : '\nInteração: todos os testes passaram.');
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
