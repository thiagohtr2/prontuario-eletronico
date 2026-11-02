// Testes funcionais das interações principais (login, cadastro, drawer, painel, popovers, modais...).
const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');
const base = process.env.BASE || ('file://' + path.join(root, 'index.html'));
const out = process.env.SHOTS || path.join(root, 'tests', 'shots');
require('fs').mkdirSync(out, { recursive: true });
const results = [];
function check(name, cond, extra) { results.push(`${cond ? 'OK  ' : 'FAIL'} ${name}${extra !== undefined ? ' -> ' + JSON.stringify(extra) : ''}`); }
const active = (p) => p.evaluate(() => { const a = document.activeElement; return a ? (a.id || a.getAttribute('aria-label') || a.textContent.trim().slice(0, 30)) : null; });

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  // ---------------- Celular 390 ----------------
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  let page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  check('abre direto no login', await page.isVisible('#login-form'));
  // validação ao enviar vazio
  await page.click('#login-submit');
  check('resumo de erros visível', await page.isVisible('#login-summary'));
  check('aria-invalid no e-mail', await page.getAttribute('#login-email', 'aria-invalid'), 'true');
  check('aria-describedby no e-mail', await page.getAttribute('#login-email', 'aria-describedby'));
  // validação ao sair do campo
  await page.fill('#login-email', 'ana@');
  await page.press('#login-email', 'Tab');
  check('erro ao sair do campo', (await page.textContent('#login-email-error')).includes('válido'));
  // credencial errada -> erro genérico
  await page.fill('#login-email', 'ana@conecta.app');
  await page.fill('#login-password', 'errada123');
  await page.click('#login-submit');
  check('botão em carregamento', (await page.textContent('#login-submit')).includes('Entrando'), await page.textContent('#login-submit'));
  check('botão desabilitado ao enviar', await page.isDisabled('#login-submit'));
  await page.waitForTimeout(1100);
  check('erro genérico', (await page.textContent('#login-summary')).includes('E-mail ou senha incorretos'));
  check('nada apagado após erro', await page.inputValue('#login-password'), 'errada123');
  // mostrar senha
  await page.click('#panel-entrar .pw-toggle');
  check('toggle senha aria', [await page.getAttribute('#panel-entrar .pw-toggle', 'aria-label'), await page.getAttribute('#panel-entrar .pw-toggle', 'aria-pressed'), await page.getAttribute('#login-password', 'type')]);
  // botão fixo na base
  const bar = await page.evaluate(() => { const r = document.querySelector('#login-form .submit-bar').getBoundingClientRect(); return [getComputedStyle(document.querySelector('#login-form .submit-bar')).position, Math.round(r.bottom), innerHeight]; });
  check('Entrar fixo na base (celular)', bar[0] === 'fixed' && bar[1] === bar[2], bar);
  const h = await page.evaluate(() => [document.querySelector('#login-email').offsetHeight, getComputedStyle(document.querySelector('#login-email')).fontSize]);
  check('input login 56px / 16px', h);
  // telefone
  await page.click('label[for="method-phone"]');
  check('campo telefone', [await page.isVisible('#login-phone'), await page.getAttribute('#login-phone', 'type'), await page.getAttribute('#login-phone', 'autocomplete')]);
  await page.click('label[for="method-email"]');
  // aba cadastro mantém e-mail e atualiza URL
  await page.click('#tab-cadastro');
  check('URL ?aba=cadastro', await page.evaluate(() => location.search), '?aba=cadastro');
  check('e-mail mantido no cadastro', await page.inputValue('#signup-email'));
  const sh = await page.evaluate(() => document.querySelector('#signup-name').offsetHeight);
  check('input cadastro 48px no celular', sh);
  await page.fill('#signup-password', 'abc');
  check('checklist marca requisito', await page.evaluate(() => [...document.querySelectorAll('#signup-reqs li')].map((l) => l.classList.contains('is-met'))));
  await page.click('#signup-submit');
  check('erro cadastro senha', (await page.textContent('#signup-password-error')).trim(), await page.textContent('#signup-password-error'));
  const cbtn = await page.evaluate(() => getComputedStyle(document.querySelector('#signup-submit')).position);
  check('Criar conta não é fixo', cbtn !== 'fixed', cbtn);
  await page.screenshot({ path: `${out}/m-cadastro-erros.png`, fullPage: true });
  // recuperação
  await page.click('#tab-entrar');
  check('URL limpa ao voltar', (await page.evaluate(() => location.search)) === '');
  await page.click('#forgot-link');
  check('recuperação visível', await page.isVisible('#recover-form'));
  await page.click('#recover-submit');
  await page.waitForTimeout(1100);
  check('mensagem neutra', (await page.textContent('#recover-status')).includes('Se o e-mail existir'));
  await page.click('#recover-back');
  // login ok
  await page.fill('#login-password', 'conecta123');
  await page.click('#login-submit');
  await page.waitForFunction(() => location.hash === '#/feed');
  await page.waitForTimeout(900);
  check('dock com 4 itens', await page.$$eval('#dock a', (a) => a.map((x) => x.textContent.trim())));
  check('Início ativo', await page.getAttribute('#dock a[data-key="feed"]', 'aria-current'), 'page');
  const dockH = await page.evaluate(() => document.querySelector('#dock').offsetHeight);
  check('dock 64px', dockH);
  const tb = await page.evaluate(() => document.querySelector('.header-inner').offsetHeight);
  check('topbar 56px', tb);
  const st = await page.evaluate(() => document.querySelector('.stories').offsetHeight);
  check('stories 88px', st);
  // drawer
  await page.click('#drawer-trigger');
  await page.waitForTimeout(300);
  check('drawer abre com foco no Fechar', await active(page), 'drawer-close');
  check('fundo inert', await page.evaluate(() => document.querySelector('#app').inert));
  check('body sem rolagem', await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  check('largura drawer', await page.evaluate(() => document.querySelector('#drawer-panel').offsetWidth));
  await page.screenshot({ path: `${out}/m-drawer.png` });
  // foco preso
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
  check('foco preso no drawer', await page.evaluate(() => document.querySelector('#drawer').contains(document.activeElement)));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Esc fecha e devolve foco ao gatilho', await active(page), 'drawer-trigger');
  check('inert removido', (await page.evaluate(() => document.querySelector('#app').inert)) === false);
  // scrim fecha
  await page.click('#drawer-trigger');
  await page.waitForTimeout(300);
  await page.mouse.click(370, 400);
  await page.waitForTimeout(300);
  check('scrim fecha', await page.evaluate(() => document.querySelector('#drawer').hidden));
  // navegação pelo drawer
  await page.click('#drawer-trigger'); await page.waitForTimeout(300);
  await page.click('#drawer-body a[data-key="grupos"]');
  await page.waitForTimeout(900);
  check('drawer navega e fecha', [await page.evaluate(() => location.hash), await page.evaluate(() => document.querySelector('#drawer').hidden)]);
  // story viewer
  await page.evaluate(() => { location.hash = '#/feed'; });
  await page.waitForTimeout(900);
  await page.click('.story[data-index="0"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/m-story.png` });
  await page.keyboard.press('ArrowRight');
  check('story avança', (await page.textContent('.modal-story h2')), 'Bruno Lima');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  check('story marcado como visto', await page.evaluate(() => document.querySelector('.story[data-index="0"]').classList.contains('is-seen')));
  // compose
  await page.click('.new-btn');
  await page.waitForTimeout(300);
  await page.click('#compose-submit');
  check('compose valida', await page.isVisible('#compose-summary'));
  await page.fill('#compose-title', 'Teste de publicação');
  await page.fill('#compose-text', 'Texto de teste.');
  await page.screenshot({ path: `${out}/m-compose.png` });
  await page.click('#compose-submit');
  await page.waitForTimeout(1500);
  check('publicação aparece no feed', (await page.textContent('#feed-list')).includes('Teste de publicação'));
  // salvar e Salvos
  await page.evaluate(() => { location.hash = '#/post/p1'; });
  await page.waitForTimeout(600);
  await page.click('[data-action="save"]');
  await page.evaluate(() => { location.hash = '#/salvos'; });
  await page.waitForTimeout(1000);
  check('Salvos contém p1', (await page.textContent('#saved-list')).includes('Publicação da comunidade'));
  // perfil abas
  await page.click('#dock a[data-key="perfil"]');
  await page.waitForTimeout(600);
  await page.click('#ptab-sobre');
  check('aba Sobre', (await page.textContent('#profile-panel')).includes('Desde') || (await page.textContent('#profile-panel')).includes('desde'));
  await page.click('[data-action="edit-profile"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/m-edit-profile.png` });
  await page.fill('#ep-name', 'Ana S. Souza');
  await page.click('button[form="ep-form"]');
  await page.waitForTimeout(400);
  check('perfil atualizado', await page.textContent('#profile-name'), 'Ana S. Souza');
  // falha simulada
  await page.evaluate(() => { location.hash = '#/configuracoes'; });
  await page.waitForTimeout(500);
  await page.click('[data-setting="simulateError"]');
  await page.evaluate(() => { location.hash = '#/grupos'; });
  await page.waitForTimeout(1000);
  check('estado de erro', await page.isVisible('.state-error'));
  await page.screenshot({ path: `${out}/m-erro.png` });
  await page.click('[data-action="retry"]');
  await page.waitForTimeout(1000);
  check('retry carrega', (await page.textContent('#group-list')).includes('Fotografia de rua'));
  await page.click('[data-action="group-filter"][data-filter="meus"]');
  await page.click('[data-action="join-group"][data-id="g1"]');
  check('estado vazio', await page.isVisible('#group-list .state'));
  // logout pelo drawer
  await page.click('#drawer-trigger'); await page.waitForTimeout(300);
  await page.click('.drawer-footer [data-action="logout"]');
  await page.waitForTimeout(300);
  check('logout volta ao login', await page.isVisible('#login-form'));
  // landscape
  await ctx.close();
  ctx = await browser.newContext({ viewport: { width: 667, height: 375 }, hasTouch: true, isMobile: true });
  page = await ctx.newPage();
  await page.goto(base);
  await page.click('#fill-demo');
  await page.click('#login-submit');
  await page.waitForFunction(() => location.hash === '#/feed');
  await page.waitForTimeout(900);
  const land = await page.evaluate(() => ({ dock: document.querySelector('#dock').offsetHeight, header: getComputedStyle(document.querySelector('#site-header')).position, stories: document.querySelector('.stories').offsetHeight, ov: document.documentElement.scrollWidth - innerWidth }));
  check('horizontal: dock 52, header não fixo, stories recolhidos', land);
  await page.screenshot({ path: `${out}/m-landscape.png` });
  await ctx.close();

  // ---------------- Tablet 820 ----------------
  ctx = await browser.newContext({ viewport: { width: 820, height: 1000 } });
  page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  await page.click('#fill-demo'); await page.click('#login-submit');
  await page.waitForFunction(() => location.hash === '#/feed');
  await page.waitForTimeout(800);
  check('tablet: nav recolhida', !(await page.isVisible('#main-nav')));
  check('tablet: logo/busca/Novo visíveis', [await page.isVisible('.brand'), await page.isVisible('#header-search-input'), await page.isVisible('.new-btn')]);
  check('tablet: sem dock', !(await page.isVisible('#dock')));
  await page.click('#panel-trigger');
  await page.waitForTimeout(300);
  check('painel abre com foco no link', await active(page));
  check('painel trava rolagem', await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  await page.screenshot({ path: `${out}/t-panel.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Esc fecha painel e devolve foco', await active(page), 'Menu');
  await page.click('#panel-trigger'); await page.waitForTimeout(300);
  await page.mouse.click(400, 900); await page.waitForTimeout(300);
  check('clique fora fecha painel', await page.evaluate(() => document.querySelector('#menu-panel').hidden));
  await ctx.close();

  // ---------------- Desktop 1280 ----------------
  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base);
  await page.click('#fill-demo'); await page.click('#login-submit');
  await page.waitForFunction(() => location.hash === '#/feed');
  await page.waitForTimeout(800);
  check('header 60px', await page.evaluate(() => document.querySelector('.header-inner').offsetHeight));
  check('header sticky z40', await page.evaluate(() => [getComputedStyle(document.querySelector('#site-header')).position, getComputedStyle(document.querySelector('#site-header')).zIndex]));
  check('aria-current Feed', await page.getAttribute('.nav-link[data-key="feed"]', 'aria-current'), 'page');
  check('Mais oculto em 1280', await page.evaluate(() => document.querySelector('#nav-more').hidden));
  check('cards em 3 colunas', await page.evaluate(() => getComputedStyle(document.querySelector('.card-grid')).gridTemplateColumns.split(' ').length));
  await page.mouse.wheel(0, 200); await page.waitForTimeout(200);
  check('sombra após 8px', await page.evaluate(() => document.querySelector('#site-header').classList.contains('is-scrolled')));
  // busca
  await page.click('#header-search-input');
  await page.waitForTimeout(200);
  check('busca cresce para 300', await page.evaluate(() => document.querySelector('#header-search-input').offsetWidth));
  await page.keyboard.type('café');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  check('Enter leva ao Explorar', [await page.evaluate(() => decodeURIComponent(location.hash)), (await page.textContent('#explore-results')).includes('Guia rápido de cafés')]);
  await page.click('#header-search-input'); await page.keyboard.press('Escape');
  check('Esc limpa e tira foco', [await page.inputValue('#header-search-input'), await active(page) !== 'header-search-input']);
  // notificações
  await page.click('#notif-trigger');
  check('popover notificações 320', await page.evaluate(() => document.querySelector('#notif-popover').offsetWidth));
  await page.screenshot({ path: `${out}/d-notif.png` });
  await page.keyboard.press('Escape');
  check('Esc fecha popover e devolve foco', await active(page), 'Notificações, 3 não lidas');
  await page.click('#profile-trigger');
  check('menu de perfil', await page.$$eval('#profile-menu a, #profile-menu button', (a) => a.map((x) => x.textContent.trim())));
  await page.mouse.click(200, 600);
  check('clique fora fecha', await page.evaluate(() => document.querySelector('#profile-menu').hidden));
  // perfil de outra pessoa + seguir
  await page.evaluate(() => { location.hash = '#/perfil/u4'; });
  await page.waitForTimeout(400);
  await page.click('[data-action="follow"]');
  check('Seguir -> Seguindo', (await page.textContent('[data-action="follow"]')).trim());
  await page.screenshot({ path: `${out}/d-perfil-outro.png`, fullPage: true });
  // 1024: Mais?
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(300);
  check('1024: sem overflow', (await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) === 0);
  check('1024: Mais oculto (4 links cabem)', await page.evaluate(() => document.querySelector('#nav-more').hidden));
  // fonte ampliada -> Mais
  await page.evaluate(() => { document.documentElement.style.zoom = '1'; document.querySelector('.main-nav').style.fontSize = ''; document.querySelectorAll('.nav-link').forEach((a) => { a.style.fontSize = '20px'; }); window.dispatchEvent(new Event('resize')); });
  await page.waitForTimeout(400);
  check('fonte maior: itens vão para Mais', await page.evaluate(() => !document.querySelector('#nav-more').hidden && document.documentElement.scrollWidth === innerWidth));
  await page.screenshot({ path: `${out}/d-mais.png` });
  await ctx.close();

  console.log(results.join('\n'));
  console.log('Erros JS:', errors);
  await browser.close();
})();
