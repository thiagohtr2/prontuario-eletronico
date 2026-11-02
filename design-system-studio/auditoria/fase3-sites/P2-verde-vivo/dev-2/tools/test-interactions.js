// Testes de interação (teclado, overlays, busca, carrinho). Uso: node tools/test-interactions.js
const { chromium } = require('playwright');
require('fs').mkdirSync(require('path').resolve(__dirname, '..', '_shots'), { recursive: true });
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOTS = path.resolve(__dirname, '..', '_shots') + '/';
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALHOU:', m); } else console.log('ok:', m); };

(async () => {
  const b = await chromium.launch();

  /* ---------- Desktop ---------- */
  let ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  let p = await ctx.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '#/catalogo');
  await p.waitForTimeout(1000);

  // Mega menu: hover com atraso, Esc fecha
  const early = await p.evaluate(() => new Promise(res => {
    document.getElementById('btn-mega').dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    setTimeout(() => res(document.getElementById('mega').hidden), 50);
  }));
  ok(early, 'mega não abre antes de 150 ms');
  await p.evaluate(() => document.getElementById('btn-mega').dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' })));
  await p.waitForTimeout(300);
  await p.hover('#btn-mega');
  await p.waitForTimeout(250);
  ok(!(await p.$eval('#mega', e => e.hidden)), 'mega abre em hover após atraso');
  await p.mouse.move(600, 600);
  await p.waitForTimeout(400);
  ok(await p.$eval('#mega', e => e.hidden), 'mega fecha ao sair');
  await p.focus('#btn-mega');
  await p.keyboard.press('Enter');
  ok(await p.evaluate(() => document.activeElement.closest('#mega') !== null), 'Enter abre mega e foca primeiro link');
  await p.keyboard.press('Escape');
  ok(await p.$eval('#mega', e => e.hidden) && await p.evaluate(() => document.activeElement.id === 'btn-mega'), 'Esc fecha mega e devolve foco');

  // Busca: combobox
  await p.keyboard.press('Control+k');
  ok(await p.evaluate(() => document.activeElement.id === 'search-input'), 'Ctrl+K foca a busca');
  ok(await p.$eval('#search-input', e => e.getAttribute('aria-expanded') === 'true'), 'aria-expanded true ao focar');
  await p.keyboard.type('mons');
  ok(await p.$eval('#search-list', e => e.querySelector('.icon-circle') && !!e.querySelector('[aria-selected]')), 'sugestões renderizadas');
  await p.waitForTimeout(450);
  const opts = await p.$$eval('#search-list [role=option]', els => els.map(e => e.textContent.trim().slice(0, 30)));
  ok(opts.some(o => /Costela/.test(o)), 'busca "mons" sugere Costela-de-adão: ' + opts.join(' | '));
  await p.keyboard.press('ArrowDown');
  ok(await p.$eval('#search-input', e => !!e.getAttribute('aria-activedescendant')), 'seta para baixo define activedescendant');
  await p.screenshot({ path: SHOTS + 'd-search.png', clip: { x: 0, y: 0, width: 1280, height: 520 } });
  await p.keyboard.press('Escape');
  ok(await p.$eval('#search-input', e => e.value === ''), 'Esc limpa o texto');
  await p.keyboard.press('Escape');
  ok(await p.$eval('#search-input', e => e.getAttribute('aria-expanded') === 'false'), 'Esc fecha');
  await p.fill('#search-input', 'orquidea');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(900);
  ok(await p.evaluate(() => location.hash.includes('q=orquidea')), 'Enter navega para o catálogo com q');
  ok((await p.$$eval('.pcard', e => e.length)) === 1, 'busca sem acento acha 1 orquídea');
  await p.click('[data-remove-chip]');
  await p.waitForTimeout(900);
  ok((await p.$$eval('.pcard', e => e.length)) === 22, 'remover chip volta a 22 produtos');

  // Filtros: drawer
  await p.click('#open-filters');
  await p.waitForTimeout(400);
  ok(await p.$eval('#ov-filters', e => e.classList.contains('is-open')), 'drawer abre');
  ok(await p.evaluate(() => document.querySelector('main').hasAttribute('inert')), 'fundo inerte com drawer aberto');
  await p.screenshot({ path: SHOTS + 'd-filters.png' });
  await p.click('#flt-body .chip[data-g=luz][data-v=sombra]');
  await p.click('#flt-body .chip[data-g=flag][data-v=pet]');
  await p.click('#flt-apply');
  await p.waitForTimeout(900);
  ok(await p.evaluate(() => document.activeElement.id === 'open-filters'), 'foco volta ao gatilho após aplicar');
  ok(await p.evaluate(() => location.hash.includes('luz=sombra') && location.hash.includes('pet=1')), 'filtros na URL');
  console.log('  produtos com sombra+pet:', await p.$$eval('.pcard', e => e.length), '(esperado 0 -> estado vazio)');
  ok(!!(await p.$('.state')), 'estado vazio exibido');
  await p.screenshot({ path: SHOTS + 'd-empty.png' });
  await p.click('[data-clear-all]');
  await p.waitForTimeout(900);
  await p.click('#open-filters');
  await p.waitForTimeout(300);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  ok(await p.$eval('#ov-filters', e => e.hidden), 'Esc fecha o drawer');
  await p.click('#open-filters');
  await p.waitForTimeout(300);
  await p.mouse.click(100, 400);
  await p.waitForTimeout(400);
  ok(await p.$eval('#ov-filters', e => e.hidden), 'clique no overlay fecha');

  // Produto + carrinho
  await p.hover('.pcard >> nth=0');
  await p.waitForTimeout(300);
  await p.screenshot({ path: SHOTS + 'd-hover.png', clip: { x: 0, y: 300, width: 1280, height: 560 } });
  await p.click('.pcard >> nth=0 >> .pcard__cta');
  await p.waitForTimeout(500);
  ok(await p.$eval('#ov-product', e => e.classList.contains('is-open')), 'Ver produto abre o detalhe');
  await p.screenshot({ path: SHOTS + 'd-product.png' });
  await p.click('[data-pm-inc]');
  await p.click('[data-pm-add]');
  await p.waitForTimeout(700);
  ok(await p.$eval('#ov-cart', e => e.classList.contains('is-open')), 'adicionar abre o minicarrinho');
  ok((await p.$eval('#cart-count', e => e.textContent)) === '2', 'contador do carrinho = 2');
  await p.screenshot({ path: SHOTS + 'd-cart.png' });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);

  // Favorito
  await p.click('.pcard >> nth=1 >> [data-fav]');
  ok((await p.$eval('#fav-count', e => e.textContent)) === '1', 'favorito conta');

  // Estados
  await p.goto(URL + '#/catalogo?estado=erro'); await p.waitForTimeout(500);
  ok(!!(await p.$('.state--error')), 'estado de erro');
  await p.screenshot({ path: SHOTS + 'd-error.png', clip: { x: 0, y: 0, width: 1280, height: 640 } });
  await p.click('[data-retry]'); await p.waitForTimeout(900);
  ok((await p.$$eval('.pcard', e => e.length)) > 0, 'tentar novamente recarrega');
  await p.goto(URL + '#/catalogo?estado=carregando'); await p.waitForTimeout(400);
  ok((await p.$$eval('.sk-card', e => e.length)) > 0, 'estado de carregamento (skeleton)');

  // Rolagem: linha 2 recolhe/reaparece
  await p.goto(URL + '#/catalogo'); await p.waitForTimeout(1000);
  await p.evaluate(() => window.scrollTo(0, 600)); await p.waitForTimeout(400);
  ok(await p.$eval('#site-header', e => e.classList.contains('is-collapsed')), 'linha 2 recolhe ao rolar para baixo');
  await p.evaluate(() => window.scrollTo(0, 400)); await p.waitForTimeout(400);
  ok(await p.$eval('#site-header', e => !e.classList.contains('is-collapsed')), 'linha 2 volta ao rolar para cima');
  await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(400);
  await p.screenshot({ path: SHOTS + 'd-collapsed.png', clip: { x: 0, y: 0, width: 1280, height: 300 } });
  ok(errs.length === 0, 'sem erros de console (desktop) ' + errs.join('|'));
  await ctx.close();

  /* ---------- Mobile ---------- */
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  p = await ctx.newPage();
  const errs2 = [];
  p.on('console', m => m.type() === 'error' && errs2.push(m.text()));
  p.on('pageerror', e => errs2.push(e.message));
  await p.goto(URL + '#/catalogo'); await p.waitForTimeout(1000);
  await p.tap('#search-input');
  await p.waitForTimeout(300);
  ok(await p.$eval('#search', e => e.classList.contains('is-full')), 'busca abre em tela cheia no celular');
  await p.screenshot({ path: SHOTS + 'm-search.png' });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  ok(await p.$eval('#search', e => !e.classList.contains('is-full')), 'Esc fecha busca em tela cheia');
  await p.tap('#open-filters'); await p.waitForTimeout(500);
  await p.screenshot({ path: SHOTS + 'm-filters.png' });
  const sheet = await p.$eval('#ov-filters [data-panel]', e => { const r = e.getBoundingClientRect(); return { h: r.height, vh: innerHeight, bottom: r.bottom }; });
  ok(sheet.h <= sheet.vh * 0.9 + 1, 'bottom sheet <= 90dvh (' + Math.round(sheet.h) + '/' + sheet.vh + ')');
  await p.tap('#ov-filters [data-close].icon-btn'); await p.waitForTimeout(400);
  await p.tap('.pill[data-pill=suculentas]'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => location.hash.includes('cat=suculentas')), 'pílula filtra');
  ok(await p.$eval('.pill[data-pill=suculentas]', e => e.getAttribute('aria-current') === 'true'), 'pílula ativa com aria-current');
  await p.screenshot({ path: SHOTS + 'm-cat-succ.png' });
  await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(400);
  ok(await p.$eval('#site-header', e => e.classList.contains('is-collapsed')), 'faixa de categorias recolhe ao rolar');
  await p.screenshot({ path: SHOTS + 'm-collapsed.png' });
  // Alvos de toque >= 44 px
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const small = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('a[href], button, input, select').forEach(el => {
      if (el.closest('[hidden], [inert]')) return;
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || r.bottom < 0 || r.top > innerHeight) return;
      if (el.matches('.skip-link, .visually-hidden, .announce__link')) return;
      if (r.width < 43.5 || r.height < 43.5) out.push((el.id || el.className || el.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    return out;
  });
  ok(small.length === 0, 'alvos de toque >= 44 px visíveis: ' + small.join(', '));
  await p.tap('.dock__item[data-dock=atelie]'); await p.waitForTimeout(1200);
  ok(await p.$eval('.dock__item[data-dock=atelie]', e => e.getAttribute('aria-current') === 'page'), 'dock: Ateliê com aria-current');
  await p.screenshot({ path: SHOTS + 'm-atelie.png' });
  ok(errs2.length === 0, 'sem erros de console (mobile) ' + errs2.join('|'));
  await ctx.close();

  await b.close();
  console.log(fails ? `\n${fails} falhas` : '\ntudo ok');
})();
