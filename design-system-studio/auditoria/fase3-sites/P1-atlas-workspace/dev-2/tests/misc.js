const L = require('./lib');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL:', m); } else console.log('ok  :', m); };
(async () => {
  const { browser, page, errors } = await L.launch({ width: 1280, height: 800 });
  // deep link sem sessão -> login -> volta ao destino
  await page.goto(L.url + '#/tarefas');
  ok((await page.title()).startsWith('Entrar'), 'rota interna sem sessão cai no login');
  await page.fill('#lg-email', 'demo@atlas.com'); await page.fill('#lg-pass', 'Atlas@2026'); await page.check('#lg-remember'); await page.click('#lg-submit');
  await page.waitForSelector('#app');
  ok(page.url().endsWith('#/tarefas'), 'após login volta ao destino pedido');
  // rota inexistente
  await page.evaluate(() => { location.hash = '#/xyz'; }); await page.waitForTimeout(300);
  ok((await page.textContent('h1')) === 'Página não encontrada', '404 interna');
  await page.evaluate(() => { location.hash = '#/projetos/nao-existe'; }); await page.waitForTimeout(300);
  ok((await page.textContent('h1')) === 'Página não encontrada', '404 projeto');
  // breadcrumbs
  await page.evaluate(() => { location.hash = '#/projetos/site-institucional/pagina-inicial'; }); await page.waitForTimeout(300);
  ok((await page.locator('.crumbs').innerText()).replace(/\s+/g, ' ').trim() === 'Projetos / Site institucional / Página inicial', 'breadcrumb: Projetos / Site institucional / Página inicial');
  ok(await page.getAttribute('.crumbs li:last-child span', 'aria-current') === 'page', 'último nível aria-current');
  await page.click('.crumbs a >> nth=1'); await page.waitForTimeout(300);
  ok(page.url().endsWith('#/projetos/site-institucional'), 'cada nível é clicável');
  // sair
  await page.click('#avatar-btn'); await page.click('.menu [role=menuitem]:has-text("Sair")'); await page.waitForTimeout(400);
  ok((await page.title()).startsWith('Entrar') && await page.locator('#app').count() === 0, 'Sair volta ao login');
  ok(await page.inputValue('#lg-email') === 'demo@atlas.com' && await page.isChecked('#lg-remember'), 'Lembrar de mim preenche o e-mail');
  await page.goto(L.url + '#/painel');
  ok((await page.title()).startsWith('Entrar'), 'sem sessão não acessa o painel');
  // links legais
  await page.click('.auth-foot a >> nth=0'); await page.waitForTimeout(200);
  ok((await page.textContent('h1')) === 'Termos de uso', 'página de termos');
  console.log('console:', errors.join(' | ') || 'none');
  await browser.close();
  console.log(fails ? fails + ' FALHAS' : 'ok');
})();
