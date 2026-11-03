// Teste de fumaça e fluxos da demonstração Nexo Capital (Playwright, file://).
// Uso: node tests/qa.js   (a partir da pasta do projeto)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const INDEX = process.env.NEXO_URL || ('file://' + path.join(ROOT, 'index.html'));
const SHOTS = path.join(__dirname, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const WIDTHS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];
const results = [];
const problems = [];

function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || '' });
  if (!ok) problems.push(name + (detail ? ' :: ' + detail : ''));
}

async function overflowOf(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const wide = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > de.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') {
        if (wide.length < 3) wide.push((el.className && el.className.baseVal === undefined ? el.className : el.tagName) + ' ' + Math.round(r.right));
      }
    });
    return { sw: de.scrollWidth, cw: de.clientWidth, wide };
  });
}

async function newPage(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height: height || 800 }, deviceScaleFactor: 1, hasTouch: width < 768, isMobile: false });
  const page = await ctx.newPage();
  page._errors = [];
  page.on('pageerror', (e) => page._errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page._errors.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (!/fonts\.g/.test(r.url())) page._errors.push('requestfailed: ' + r.url()); });
  return { ctx, page };
}

async function loginDemo(page) {
  await page.goto(INDEX + '#/login');
  await page.fill('#email', 'demo@nexo.example');
  await page.fill('#senha', 'Demo@2026');
  await page.click('button[type=submit]');
  await page.waitForSelector('.kpi-value', { timeout: 5000 });
}

async function main() {
  const browser = await chromium.launch();

  // 1. Largura: tela de acesso sem overflow horizontal.
  for (const w of WIDTHS) {
    const { ctx, page } = await newPage(browser, w, w < 768 ? 740 : 800);
    await page.goto(INDEX + '#/login');
    await page.waitForSelector('#email');
    const o = await overflowOf(page);
    check('login sem overflow em ' + w + 'px', o.sw <= o.cw, JSON.stringify(o));
    if (w === 320 || w === 390 || w === 1440) await page.screenshot({ path: path.join(SHOTS, 'login-' + w + '.png'), fullPage: true });
    check('login sem erros JS em ' + w + 'px', page._errors.length === 0, page._errors.join(' | '));
    await ctx.close();
  }

  // 2. Fluxo de login: validação, erro genérico e sucesso.
  {
    const { ctx, page } = await newPage(browser, 390, 740);
    await page.goto(INDEX + '#/login');
    await page.waitForSelector('#email');
    await page.click('button[type=submit]');
    const summary = await page.textContent('.form-alert');
    check('envio vazio mostra resumo role=alert', /Corrija/.test(summary || ''), summary);
    check('campo e-mail com aria-invalid', (await page.getAttribute('#email', 'aria-invalid')) === 'true');
    check('mensagem do e-mail associada (aria-describedby)', (await page.getAttribute('#email', 'aria-describedby')) === 'email-erro');
    await page.fill('#email', 'nao-e-email');
    await page.click('#senha');
    await page.keyboard.press('Tab');
    const emailErr = await page.textContent('#email-erro');
    check('e-mail inválido mostra mensagem ao sair do campo', /válido/.test(emailErr || ''), emailErr);
    await page.fill('#email', 'demo@nexo.example');
    await page.fill('#senha', 'errada');
    await page.click('button[type=submit]');
    await page.waitForFunction(() => /incorretos/.test((document.querySelector('.form-alert') || {}).textContent || ''), null, { timeout: 3000 });
    const generic = await page.textContent('.form-alert');
    check('erro de credenciais genérico', generic === 'E-mail ou senha incorretos', generic);
    check('senha limpa após erro', (await page.inputValue('#senha')) === '');
    await page.fill('#senha', 'Demo@2026');
    await page.click('button[type=submit]');
    await page.waitForSelector('.kpi-value', { timeout: 5000 });
    check('login demo leva ao painel', (await page.evaluate(() => location.hash)) === '#/app/painel/visao-geral');
    await page.waitForSelector('.dash-table .table-card', { timeout: 3000 });
    check('painel carrega tabela após skeleton', (await page.locator('.dash-table .data-table tbody tr').count()) === 4, '4 linhas esperadas em 30 dias');
    await ctx.close();
  }

  // 3. Recuperação de senha com mensagem neutra.
  {
    const { ctx, page } = await newPage(browser, 1024, 800);
    await page.goto(INDEX + '#/login');
    await page.click('text=Esqueci minha senha');
    await page.waitForSelector('text=Recuperar senha');
    await page.fill('#email', 'alguem@empresa.com');
    await page.click('button[type=submit]');
    await page.waitForSelector('.form-status', { state: 'visible', timeout: 3000 });
    check('recuperação: mensagem neutra', /Se o e-mail existir, enviaremos um link\./.test(await page.textContent('.form-status')));
    await ctx.close();
  }

  // 4. Painel em todas as larguras, sem overflow e sem erros.
  for (const w of WIDTHS) {
    const { ctx, page } = await newPage(browser, w, w < 768 ? 740 : 800);
    await loginDemo(page);
    await page.waitForSelector('.dash-table .data-table', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(150);
    const o = await overflowOf(page);
    check('painel sem overflow em ' + w + 'px', o.sw <= o.cw, JSON.stringify(o));
    check('painel sem erros JS em ' + w + 'px', page._errors.length === 0, page._errors.join(' | '));
    if ([390, 820, 1440].indexOf(w) !== -1) await page.screenshot({ path: path.join(SHOTS, 'painel-' + w + '.png'), fullPage: false });
    await ctx.close();
  }

  await browser.close();
  finish();
}

function finish() {
  const pass = results.filter((r) => r.ok).length;
  console.log('Testes: ' + pass + '/' + results.length + ' aprovados');
  if (problems.length) { console.log('Falhas:'); problems.forEach((p) => console.log(' - ' + p)); }
  process.exitCode = problems.length ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exitCode = 2; });
