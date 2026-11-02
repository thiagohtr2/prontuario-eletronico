/* Teste de fumaça: estouro horizontal em 320-1920 px, erros de console e fluxos principais.
   Uso: servir a pasta (python3 -m http.server 4423) e rodar: node tests/smoke.js */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:4423/index.html';
const WIDTHS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1000, 1024, 1280, 1440, 1920];
const problems = [];
const log = (...a) => console.log(...a);

async function newPage(browser, width) {
  const ctx = await browser.newContext({
    viewport: { width, height: width < 768 ? 740 : 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) page.errors.push('console: ' + m.text()); });
  return { ctx, page };
}

async function overflowCheck(page, label) {
  const info = await page.evaluate(() => {
    const vw = window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    const out = [];
    document.querySelectorAll('body *').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (el.closest('[hidden]')) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      if (r.right > vw + 1 || r.left < -1) {
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) {
          if (getComputedStyle(p).overflowX !== 'visible') { clipped = true; break; }
          p = p.parentElement;
        }
        if (!clipped) out.push(el.tagName + '.' + String(el.className.baseVal ?? el.className).split(' ')[0] + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
      }
    });
    return { sw, vw, out: out.slice(0, 6) };
  });
  if (info.sw > info.vw) problems.push(`${label}: overflow scrollWidth ${info.sw} > ${info.vw}`);
  if (info.out.length) problems.push(`${label}: elementos fora da viewport: ${info.out.join(' | ')}`);
}

(async () => {
  const browser = await chromium.launch();

  // 1) Estouro horizontal e erros em todas as larguras
  for (const w of WIDTHS) {
    const { ctx, page } = await newPage(browser, w);
    for (const hash of ['#/', '#/catalogo', '#/catalogo?erro=1']) {
      await page.goto(BASE + hash, { waitUntil: 'load' });
      await page.waitForTimeout(700);
      await overflowCheck(page, `${w}px ${hash}`);
    }
    // Abre o diálogo de produto e o drawer de filtros para checar overflow também
    await page.goto(BASE + '#/catalogo', { waitUntil: 'load' });
    await page.waitForTimeout(600);
    await page.evaluate(() => document.querySelector('#grid .card-link').click());
    await page.waitForTimeout(200);
    await overflowCheck(page, `${w}px produto`);
    await page.keyboard.press('Escape');
    if (page.errors.length) problems.push(`${w}px erros: ${page.errors.join(' / ')}`);
    await ctx.close();
  }
  log('1) Largura/overflow: concluído');

  // 2) Desktop (1440): mega menu, busca, filtros, produto, sacola, ampliação, newsletter
  {
    const { ctx, page } = await newPage(browser, 1440);
    await page.goto(BASE + '#/', { waitUntil: 'load' });
    await page.waitForTimeout(300);
    const landingVisible = await page.isVisible('#view-landing');
    if (!landingVisible) problems.push('desktop: landing não visível em #/');

    await page.goto(BASE + '#/catalogo', { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const cards = await page.locator('#grid .card').count();
    if (cards !== 16) problems.push(`desktop: esperado 16 cards, obtidos ${cards}`);

    // Mega menu por hover e por clique + Esc com retorno do foco
    await page.hover('.cat-trigger[data-cat="interior"]');
    await page.waitForTimeout(350);
    if (await page.locator('#mega-panel').isHidden()) problems.push('desktop: mega menu não abriu por hover');
    await page.keyboard.press('Escape');
    if (await page.locator('#mega-panel').isVisible()) problems.push('desktop: Esc não fechou o mega menu');
    await page.click('.cat-trigger[data-cat="vasos"]');
    await page.waitForTimeout(100);
    const focusInMega = await page.evaluate(() => document.querySelector('#mega-panel').contains(document.activeElement));
    if (!focusInMega) problems.push('desktop: foco não foi para o primeiro link do mega menu');
    await page.click('#mega-panel [data-filtro] >> nth=0');
    await page.waitForTimeout(500);
    const vasosCount = await page.locator('#grid .card').count();
    if (vasosCount !== 1) problems.push(`desktop: filtro Vasos > Pequenos retornou ${vasosCount}, esperado 1`);

    // Busca com ⌘K/Ctrl+K e sugestões com teclado
    await page.keyboard.press('Control+k');
    await page.keyboard.type('monstera', { delay: 10 });
    await page.waitForTimeout(450);
    const focusedIsSearch = await page.evaluate(() => document.activeElement && document.activeElement.id === 'q-d');
    if (!focusedIsSearch) problems.push('desktop: Ctrl+K não focou a busca');
    const opts = await page.locator('#s-d [role="option"]').count();
    if (opts < 2) problems.push(`desktop: sugestões insuficientes (${opts})`);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const ariaExp = await page.getAttribute('#q-d', 'aria-expanded');
    if (ariaExp !== 'false') problems.push('desktop: combobox continuou aberto após Enter');
    const afterSearch = await page.locator('#grid .card').count();
    if (afterSearch < 1) problems.push('desktop: busca não retornou resultados');
    await page.fill('#q-d', 'zzzz-nada');
    await page.waitForTimeout(400);
    const emptyShown = await page.isVisible('#grid-state h3');
    if (!emptyShown) problems.push('desktop: estado vazio não apareceu');
    await page.click('#grid-state [data-reset]');
    await page.waitForTimeout(600);
    const back = await page.locator('#grid .card').count();
    if (back !== 16) problems.push(`desktop: após limpar, ${back} cards (esperado 16)`);

    // Filtros: drawer lateral, aplicar e fechar com Esc
    await page.click('#open-filters');
    await page.waitForTimeout(300);
    if (!(await page.locator('#filter-drawer').evaluate((el) => el.classList.contains('is-open')))) problems.push('desktop: drawer de filtros não abriu');
    await page.click('#filter-form label:has-text("Sol pleno")');
    await page.click('#f-apply');
    await page.waitForTimeout(600);
    const solCount = await page.locator('#grid .card').count();
    if (!(solCount >= 1 && solCount < 16)) problems.push(`desktop: filtro Sol pleno retornou ${solCount}`);
    await page.click('#open-filters');
    await page.waitForTimeout(250);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const focusBack = await page.evaluate(() => document.activeElement && document.activeElement.id === 'open-filters');
    if (!focusBack) problems.push('desktop: foco não voltou ao botão Filtros');

    // Ampliação de categoria
    await page.click('.cat-tile >> nth=0');
    await page.waitForTimeout(300);
    const lbOpen = await page.locator('#lightbox').evaluate((el) => el.classList.contains('is-open'));
    if (!lbOpen) problems.push('desktop: ampliação não abriu');
    await page.click('#lb-next');
    const lbText = await page.textContent('#lb-count');
    if (!lbText.startsWith('2 de')) problems.push(`desktop: navegação da ampliação falhou (${lbText})`);
    await page.keyboard.press('Escape');

    // Produto -> adicionar -> sacola
    await page.click('#grid .card-link >> nth=0');
    await page.waitForTimeout(250);
    await page.click('#pd-add');
    await page.waitForTimeout(350);
    const cartOpen = await page.locator('#cart-drawer').evaluate((el) => el.classList.contains('is-open'));
    if (!cartOpen) problems.push('desktop: sacola não abriu após adicionar');
    const badge = await page.locator('.topbar [data-cart-count]').first().textContent();
    if (badge.trim() !== '1') problems.push(`desktop: contador da sacola = ${badge}`);
    await page.keyboard.press('Escape');

    // Newsletter inválida
    await page.fill('#news-email', 'abc');
    await page.click('#news-form button[type=submit]');
    await page.waitForTimeout(100);
    if (!(await page.isVisible('#news-erro'))) problems.push('desktop: erro de newsletter não apareceu');

    if (ctx) await ctx.close();
  }
  log('2) Desktop: fluxos concluídos');

  // 3) Celular (390): header fixo, faixa, dock, filtro em bottom sheet, menu da landing
  {
    const { ctx, page } = await newPage(browser, 390);
    await page.goto(BASE + '#/catalogo', { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const mtopH = await page.evaluate(() => document.querySelector('#m-top').getBoundingClientRect().height);
    if (mtopH < 150 || mtopH > 170) problems.push(`celular: altura do header+faixa = ${mtopH}px (esperado ~156)`);
    const dockVisible = await page.isVisible('#dock');
    if (!dockVisible) problems.push('celular: dock não visível');

    await page.click('#m-cats [data-cat="vasos"]');
    await page.waitForTimeout(600);
    const pillCur = await page.getAttribute('#m-cats [data-cat="vasos"]', 'aria-current');
    if (pillCur !== 'page') problems.push('celular: pílula ativa sem aria-current="page"');
    const n = await page.locator('#grid .card').count();
    if (n !== 2) problems.push(`celular: categoria Vasos retornou ${n}`);

    await page.click('#m-cats [data-cat="todas"]');
    await page.waitForTimeout(600);

    await page.click('#open-filters');
    await page.waitForTimeout(350);
    const sheet = await page.locator('#filter-drawer').boundingBox();
    const vh = 740;
    if (!sheet || Math.abs(sheet.y + sheet.height - vh) > 2) problems.push(`celular: filtro não é bottom sheet (${JSON.stringify(sheet)})`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await page.click('#dock [data-cart-open]');
    await page.waitForTimeout(350);
    const cartMob = await page.locator('#cart-drawer').evaluate((el) => el.classList.contains('is-open'));
    if (!cartMob) problems.push('celular: sacola pelo dock não abriu');
    await page.keyboard.press('Escape');

    // Busca do celular: sugestões e Enter
    await page.click('#q-m');
    await page.waitForTimeout(300);
    if (!(await page.locator('#s-m').isVisible())) problems.push('celular: sugestões não abriram');
    await page.keyboard.type('alecrim');
    await page.waitForTimeout(400);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const alecrim = await page.locator('#grid .card').count();
    if (alecrim < 1) problems.push('celular: busca por alecrim sem resultado');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(400);
    const strip = await page.evaluate(() => document.documentElement.classList.contains('strip-collapsed'));
    if (!strip) problems.push('celular: faixa de categorias não recolheu ao rolar');
    await ctx.close();
  }
  log('3) Celular catálogo: fluxos concluídos');

  // 4) Celular: landing com menu de diálogo e foco devolvido
  {
    const { ctx, page } = await newPage(browser, 360);
    await page.goto(BASE + '#/', { waitUntil: 'load' });
    await page.waitForTimeout(300);
    await page.click('#landing-menu-btn');
    await page.waitForTimeout(250);
    const open = await page.locator('#landing-menu').evaluate((el) => el.classList.contains('is-open'));
    if (!open) problems.push('landing mobile: menu não abriu');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const back = await page.evaluate(() => document.activeElement && document.activeElement.id === 'landing-menu-btn');
    if (!back) problems.push('landing mobile: foco não voltou ao botão do menu');
    const cta = await page.locator('.hero-cta').boundingBox();
    if (!cta || cta.height < 20) problems.push('landing mobile: CTA do hero ausente');
    await page.click('.hero-cta');
    await page.waitForTimeout(400);
    const onCat = await page.isVisible('#view-catalogo');
    if (!onCat) problems.push('landing: CTA não levou ao catálogo');
    await ctx.close();
  }
  log('4) Landing celular: concluído');

  await browser.close();
  if (problems.length) {
    log('\nPROBLEMAS (' + problems.length + '):');
    problems.forEach((p) => log(' - ' + p));
    process.exitCode = 1;
  } else {
    log('\nNenhum problema encontrado.');
  }
})().catch((e) => { console.error('FALHA NO TESTE:', e); process.exit(2); });
