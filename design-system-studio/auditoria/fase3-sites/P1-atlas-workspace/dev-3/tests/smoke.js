/* Teste de fumaça: fluxo de entrada, rotas do app, overflow horizontal e erros de console.
   Uso: node tests/smoke.js [url]   (padrão: file:// do index.html desta pasta) */
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'file://' + path.join(__dirname, '..', 'index.html');
const SHOTS = process.env.SHOTS ? path.join(__dirname, '..', 'qa-shots') : null;
const WIDTHS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];
const ROUTES = ['/app/inicio', '/app/painel', '/app/projetos', '/app/tarefas', '/app/calendario',
  '/app/equipe', '/app/mensagens', '/app/relatorios', '/app/configuracoes', '/app/ajuda'];

const failures = [];
const log = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) failures.push(msg); };

async function newPage(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height: height || 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  return { ctx, page, errors };
}

async function overflowOf(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > de.clientWidth + 1 && !el.closest('.sw-table-scroll') && !el.closest('.sr-only') && getComputedStyle(el).position !== 'fixed' && !el.closest('.sr-table')) {
        wide.push(el.className || el.tagName);
      }
    });
    return { scroll: de.scrollWidth, client: de.clientWidth, wide: wide.slice(0, 5) };
  });
}

(async () => {
  const browser = await chromium.launch();

  // 1) Abre direto na tela de entrar, sem landing
  {
    const { ctx, page, errors } = await newPage(browser, 1440, 900);
    await page.goto(BASE);
    await page.waitForSelector('#login-form');
    log(page.url().endsWith('#/entrar') || page.url().includes('#/entrar'), 'abre na tela de entrar');
    log(await page.isVisible('h1:has-text("Entrar na sua conta")'), 'título "Entrar na sua conta" visível');
    const emailType = await page.getAttribute('#login-email', 'type');
    const emailMode = await page.getAttribute('#login-email', 'inputmode');
    const ac = await page.getAttribute('#login-email', 'autocomplete');
    log(emailType === 'email' && emailMode === 'email' && ac === 'username', 'e-mail com type/inputmode/autocomplete corretos');
    log((await page.getAttribute('#login-password', 'autocomplete')) === 'current-password', 'senha com autocomplete current-password');

    // Validação no envio
    await page.click('#login-submit');
    const summaryText = await page.textContent('#login-summary');
    log(/Revise os campos/.test(summaryText), 'resumo de erros aparece no topo ao enviar vazio');
    log((await page.getAttribute('#login-email', 'aria-invalid')) === 'true', 'e-mail marcado com aria-invalid');
    log(/Informe seu e-mail/.test(await page.textContent('#login-email-error')), 'mensagem de e-mail vazio');
    log((await page.getAttribute('#login-email', 'aria-describedby') || '').includes('login-email-error'), 'aria-describedby liga o erro ao campo');

    // Erro genérico de credenciais
    await page.fill('#login-email', 'alguem@exemplo.com');
    await page.fill('#login-password', 'errada123');
    await page.click('#login-submit');
    await page.waitForFunction(() => /incorretos/.test(document.querySelector('#login-summary').textContent), null, { timeout: 3000 });
    log(true, 'credenciais erradas: mensagem genérica "E-mail ou senha incorretos."');
    log((await page.inputValue('#login-email')) === 'alguem@exemplo.com', 'valores digitados são mantidos após erro');

    // Mostrar/ocultar senha
    await page.click('[data-action="toggle-password"]');
    log((await page.getAttribute('#login-password', 'type')) === 'text', 'botão mostra a senha (type=text)');
    log((await page.getAttribute('[data-action="toggle-password"]', 'aria-pressed')) === 'true', 'aria-pressed muda para true');

    // Credencial correta -> app
    await page.fill('#login-email', 'demo@atlas.app');
    await page.fill('#login-password', 'demo1234');
    await page.click('#login-submit');
    await page.waitForURL(/#\/app\/inicio/, { timeout: 4000 });
    log(true, 'credenciais corretas entram no app (#/app/inicio)');
    await page.waitForSelector('#shell');
    log(await page.isVisible('.sidebar') || (await page.evaluate(() => getComputedStyle(document.querySelector('.sidebar')).display)) === 'none', 'sidebar coerente com a largura');
    await page.close();
    await ctx.close();
    errors.forEach((e) => log(false, 'erro de console (entrar): ' + e));
    if (!errors.length) log(true, 'sem erros de console no fluxo de entrada');
  }

  // 2) Rotas do app em desktop e celular: sem erros, sem overflow
  for (const width of WIDTHS) {
    const height = width < 768 ? 740 : 860;
    const { ctx, page, errors } = await newPage(browser, width, height);
    await page.goto(BASE + '#/entrar');
    await page.waitForSelector('#login-form');
    await page.evaluate(() => { localStorage.setItem('atlas.session', JSON.stringify({ name: 'Ana Souza', email: 'demo@atlas.app', role: 'Administradora' })); });
    for (const route of ROUTES) {
      await page.goto(BASE + '#' + route);
      await page.waitForSelector('#page h1', { timeout: 4000 });
      await page.waitForTimeout(520);
      const ov = await overflowOf(page);
      if (ov.scroll > ov.client) log(false, `overflow horizontal em ${width}px na rota ${route}: ${JSON.stringify(ov)}`);
    }
    // Entrar sem sessão deve voltar para a tela de entrar
    const hasNav = await page.evaluate(() => !!document.querySelector('.bottom-nav') && getComputedStyle(document.querySelector('.bottom-nav')).display !== 'none');
    const sideVisible = await page.evaluate(() => getComputedStyle(document.querySelector('.sidebar')).display !== 'none');
    if (width < 768) log(hasNav && !sideVisible, `${width}px: bottom navigation visível e sidebar oculta`);
    else log(sideVisible && !hasNav, `${width}px: sidebar visível e bottom navigation oculta`);
    errors.forEach((e) => log(false, `erro de console em ${width}px: ${e}`));
    await page.close();
    await ctx.close();
  }

  // 3) Login sem sessão, em múltiplas larguras, sem overflow
  for (const width of WIDTHS) {
    const { ctx, page } = await newPage(browser, width, 700);
    await page.goto(BASE + '#/entrar');
    await page.waitForSelector('#login-form');
    const ov = await overflowOf(page);
    if (ov.scroll > ov.client) log(false, `overflow no login em ${width}px: ${JSON.stringify(ov)}`);
    await page.close();
    await ctx.close();
  }
  log(true, 'login sem overflow horizontal de 320 a 1920 px (checado)');

  // 4) Rota inexistente e proteção de rota
  {
    const { ctx, page } = await newPage(browser, 1024, 768);
    await page.goto(BASE + '#/app/painel');
    await page.waitForURL(/#\/entrar/, { timeout: 3000 });
    log(true, 'rota do app sem sessão redireciona para entrar');
    await page.goto(BASE + '#/nao-existe');
    await page.waitForSelector('text=Página não encontrada');
    log(true, 'rota inexistente mostra página de não encontrado');
    await page.close();
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `\n${failures.length} falha(s)` : '\nTodos os testes passaram.');
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
