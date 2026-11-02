// Popovers, formulários (CEP, newsletter), rotas e deep links.
const { chromium } = require('playwright');
require('fs').mkdirSync(require('path').resolve(__dirname, '..', '_shots'), { recursive: true });
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALHOU:', m); } else console.log('ok:', m); };
(async () => {
  const b = await chromium.launch();
  let ctx = await b.newContext({ viewport: { width: 1150, height: 800 } });
  let p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(URL + '#/'); await p.waitForTimeout(600);
  await p.click('#btn-more'); await p.waitForTimeout(100);
  ok(await p.$eval('#more-menu', e => !e.hidden) && (await p.$$eval('#more-menu a', a => a.length)) === 5, '"Mais categorias" abre com 5 itens (1024–1279 px)');
  await p.keyboard.press('Escape');
  ok(await p.$eval('#more-menu', e => e.hidden), 'Esc fecha "Mais categorias"');
  await p.click('#btn-account'); await p.waitForTimeout(100);
  const r = await p.$eval('#pop-account', e => { const b = e.getBoundingClientRect(); return [b.left, b.right, innerWidth]; });
  ok(r[0] >= 8 && r[1] <= r[2] - 8, 'popover de conta dentro da viewport');
  await p.click('#pop-account [data-demo="Ajuda"]');
  ok(!!(await p.$('.toast')), 'item do menu de conta mostra aviso de demonstração');
  await p.click('#btn-addr'); await p.fill('#addr-cep', '123'); await p.click('#addr-submit');
  ok(await p.$eval('#addr-msg', e => !e.hidden && e.classList.contains('msg--error')), 'CEP inválido mostra erro');
  await p.fill('#addr-cep', '30140071'); await p.click('#addr-submit'); await p.waitForTimeout(1000);
  ok(await p.$eval('#addr-msg', e => e.classList.contains('msg--success')), 'CEP válido mostra sucesso');
  await p.keyboard.press('Escape');
  ok((await p.$eval('#addr-label', e => e.textContent)) === '30140-071', 'rótulo de entrega atualizado');
  // newsletter
  await p.evaluate(() => document.getElementById('news-form').scrollIntoView());
  await p.fill('#news-email', 'xx'); await p.click('#news-submit');
  ok(await p.$eval('#news-msg', e => e.classList.contains('msg--error')), 'newsletter: e-mail inválido');
  await p.fill('#news-email', 'ana@exemplo.com'); await p.click('#news-submit'); await p.waitForTimeout(1100);
  ok(await p.$eval('#news-msg', e => e.classList.contains('msg--success')), 'newsletter: sucesso');
  // rotas
  await p.goto(URL + '#/atelie'); await p.waitForTimeout(900);
  ok(await p.$eval('[data-nav=atelie]', e => e.getAttribute('aria-current') === 'page'), '#/atelie destaca Ateliê no menu');
  ok(await p.evaluate(() => { const r = document.getElementById('atelie').getBoundingClientRect(); return r.top < 200 && r.top > -50; }), '#/atelie rola até a seção');
  await p.goto(URL + '#/produto/p21'); await p.waitForTimeout(1200);
  ok(await p.$eval('#ov-product', e => e.classList.contains('is-open')), '#/produto/p21 abre o detalhe');
  await p.screenshot({ path: path.resolve(__dirname, '..', '_shots', 'd-product-deeplink.png') });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  ok(await p.evaluate(() => location.hash === '#/catalogo'), 'fechar o detalhe volta para #/catalogo');
  await p.goto(URL + '#/catalogo?cat=vasos'); await p.waitForTimeout(1000);
  ok((await p.$$eval('.pcard', e => e.length)) === 3, 'categoria vasos: 3 produtos');
  ok(await p.$eval('[data-nav=vasos]', e => e.getAttribute('aria-current') === 'page'), 'Vasos com aria-current');
  // esgotado: botão desabilitado
  await p.goto(URL + '#/catalogo?q=fícus'.replace('í', 'i')); await p.waitForTimeout(1000);
  ok(await p.$eval('.pcard__quick', e => e.getAttribute('aria-disabled') === 'true'), 'produto esgotado com ação desabilitada (aria-disabled)');
  ok(errs.length === 0, 'sem erros ' + errs.join('|'));
  await b.close();
  console.log(fails ? fails + ' falhas' : 'tudo ok');
})();
