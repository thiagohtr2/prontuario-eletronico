// Testes funcionais e de acessibilidade básica (login, drawer, popovers, painel, landscape).
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const browser = await chromium.launch();

  /* ---------- LOGIN (celular) ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await page.goto(url);
    ok((await page.title()).startsWith('Entrar'), 'abre direto na tela de entrar');
    // envio vazio
    await page.click('#btn-login');
    ok(await page.locator('#login-summary').innerText().then(t => /Corrija 2 campos/.test(t)), 'resumo de erros no envio vazio');
    ok(await page.getAttribute('#login-summary', 'role') === 'alert', 'resumo com role=alert');
    ok(await page.getAttribute('#login-email', 'aria-invalid') === 'true', 'aria-invalid no e-mail');
    ok((await page.getAttribute('#login-email', 'aria-describedby')) === 'login-email-err', 'aria-describedby no e-mail');
    ok(await page.locator('#login-email-err').innerText().then(t => /Informe seu e-mail/.test(t)), 'mensagem abaixo do campo');
    ok(await page.evaluate(() => document.activeElement.id) === 'login-email', 'foco no primeiro campo inválido');
    // atributos
    ok(await page.getAttribute('#login-email', 'type') === 'email' && await page.getAttribute('#login-email', 'autocomplete') === 'username' && await page.getAttribute('#login-email', 'inputmode') === 'email', 'atributos do e-mail');
    ok(await page.getAttribute('#login-pass', 'autocomplete') === 'current-password', 'autocomplete senha');
    // mostrar/ocultar senha
    await page.fill('#login-pass', 'abc');
    await page.click('[data-toggle-pass="login-pass"]');
    ok(await page.getAttribute('#login-pass', 'type') === 'text' && await page.getAttribute('[data-toggle-pass="login-pass"]', 'aria-label') === 'Ocultar senha' && await page.getAttribute('[data-toggle-pass="login-pass"]', 'aria-pressed') === 'true', 'mostrar senha alterna aria-label/aria-pressed');
    await page.click('[data-toggle-pass="login-pass"]');
    // credenciais erradas
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'errada123');
    await page.click('#btn-login');
    ok(await page.locator('#btn-login').isDisabled() && /Entrando…/.test(await page.locator('#btn-login').innerText()), 'estado de carregamento "Entrando…" e botão desabilitado');
    await page.waitForTimeout(1200);
    ok(/E-mail ou senha incorretos/.test(await page.locator('#login-summary').innerText()), 'erro genérico de credenciais');
    ok(!(await page.locator('#login-email').getAttribute('aria-invalid')), 'não aponta qual campo está errado');
    ok(await page.inputValue('#login-email') === 'ana@conecta.demo', 'não apaga o que foi digitado');
    // altura dos campos / tamanho de fonte
    const h = await page.evaluate(() => { const i = document.getElementById('login-email'); const cs = getComputedStyle(i); return [i.getBoundingClientRect().height, parseFloat(cs.fontSize)]; });
    ok(h[0] >= 56 && h[1] >= 16, `campo do login: ${h[0]}px, fonte ${h[1]}px`);
    // botão ancorado na base
    const bb = await page.evaluate(() => { const b = document.getElementById('btn-login').getBoundingClientRect(); return [b.bottom, innerHeight, b.height]; });
    ok(bb[0] <= bb[1] && bb[1] - bb[0] < 40 && bb[2] >= 44, `botão Entrar na base (bottom=${bb[0]}, vh=${bb[1]})`);
    // simula teclado: --kb
    await page.evaluate(() => document.documentElement.style.setProperty('--kb', '300px'));
    const bb2 = await page.evaluate(() => document.getElementById('btn-login').getBoundingClientRect().bottom);
    ok(bb2 < bb[0] - 250, 'botão sobe acima do teclado (--kb)');
    await page.evaluate(() => document.documentElement.style.setProperty('--kb', '0px'));
    // telefone
    await page.click('label[for="mode-phone"]');
    ok(await page.getAttribute('#login-phone', 'type') === 'tel' && await page.getAttribute('#login-phone', 'autocomplete') === 'tel' && await page.getAttribute('#login-phone', 'inputmode') === 'tel', 'campo telefone: type/autocomplete/inputmode');
    await page.fill('#login-phone', '11912345678');
    ok(await page.inputValue('#login-phone') === '(11) 91234-5678', 'máscara de telefone');
    // recuperar
    await page.click('#link-forgot');
    ok(page.url().includes('aba=recuperar'), 'URL da recuperação');
    await page.fill('#recover-email', 'qualquer@exemplo.com');
    await page.click('#btn-recover'); await page.waitForTimeout(1100);
    ok(/Se o e-mail existir, enviaremos um link/.test(await page.locator('#recover-done').innerText()), 'mensagem neutra de recuperação');
    await page.click('#link-back-login');
    // cadastro
    await page.click('label[for="mode-email"]');
    await page.fill('#login-email', 'novo@exemplo.com');
    await page.click('#tab-cadastro');
    ok(await page.inputValue('#signup-email') === 'novo@exemplo.com', 'e-mail mantido ao trocar de aba');
    ok(page.url().includes('aba=cadastro'), 'URL ?aba=cadastro');
    ok(await page.getAttribute('#signup-pass', 'autocomplete') === 'new-password' && await page.getAttribute('#signup-name', 'autocomplete') === 'name' && await page.getAttribute('#signup-email', 'autocomplete') === 'email', 'autocomplete do cadastro');
    await page.fill('#signup-name', 'Maria Teste');
    await page.fill('#signup-pass', 'abc');
    await page.locator('#signup-pass').blur();
    ok(/pelo menos 8 caracteres/.test(await page.locator('#signup-pass-err').innerText()), 'erro "Use pelo menos 8 caracteres"');
    await page.fill('#signup-pass', 'Abcdefg1');
    const met = await page.locator('.pw-reqs li[data-met="true"]').count();
    ok(met === 4, 'checklist marca as 4 regras cumpridas');
    ok(await page.evaluate(() => getComputedStyle(document.querySelector('.pw-reqs')).gridTemplateColumns.split(' ').length) === 1, 'requisitos em lista vertical no celular');
    const tabsW = await page.evaluate(() => [...document.querySelectorAll('#auth-tabs .tab')].map(t => t.getBoundingClientRect()).map(r => [Math.round(r.width), Math.round(r.height)]));
    ok(tabsW[0][0] === tabsW[1][0] && tabsW[0][1] >= 44, `abas 50% / altura >= 44 (${JSON.stringify(tabsW)})`);
    await page.click('#btn-signup'); await page.waitForTimeout(1300);
    ok(await page.isVisible('#app'), 'cadastro conclui e entra no app');
    ok(await page.locator('#btn-avatar').count() === 1 && /Maria Teste/.test(await page.locator('#pop-profile').innerText().catch(() => '') + await page.locator('#drawer-body').innerText().catch(() => '')) , 'usa o nome informado no cadastro');
    // deep link ?aba=cadastro
    const p2 = await ctx.newPage(); await p2.goto(url + '?aba=cadastro');
    ok(await p2.getAttribute('#tab-cadastro', 'aria-selected') === 'true', '?aba=cadastro abre a aba Criar conta');
    ok(errs.length === 0, 'sem erros de console: ' + JSON.stringify(errs));
    await ctx.close();
  }

  /* ---------- APP MOBILE: drawer, dock ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'Conecta123'); await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])'); await page.waitForTimeout(1200);
    // medidas
    const m = await page.evaluate(() => {
      const r = s => document.querySelector(s).getBoundingClientRect();
      return { header: r('#site-header').height, stories: r('#stories').height, dock: r('.dock__bar').height, dockStyle: getComputedStyle(document.querySelector('.dock__bar')).borderRadius, dockPos: getComputedStyle(document.querySelector('.dock')).position };
    });
    ok(Math.round(m.header) === 56, `topbar 56px (${m.header})`);
    ok(m.stories === 88, `stories 88px (${m.stories})`);
    ok(m.dock === 64, `dock 64px (${m.dock})`);
    ok(m.dockPos === 'fixed', 'dock flutuante (fixed)');
    // alvos de toque
    const small = await page.evaluate(() => [...document.querySelectorAll('#site-header button, #site-header a, .dock a, .card__save, .card__action, .story')].filter(e => e.getClientRects().length).map(e => { const b = e.getBoundingClientRect(); return [e.className || e.tagName, Math.round(b.width), Math.round(b.height)]; }).filter(x => x[2] < 44 || x[1] < 44));
    ok(small.length === 0, 'alvos de toque >= 44px ' + JSON.stringify(small));
    ok(await page.getAttribute('.dock a[data-key="feed"]', 'aria-current') === 'page', 'item ativo do dock com aria-current');
    // dock navega
    await page.click('.dock a[data-key="explorar"]'); await page.waitForTimeout(300);
    ok(await page.getAttribute('.dock a[data-key="explorar"]', 'aria-current') === 'page' && page.url().endsWith('#/explorar'), 'dock navega e marca ativo');
    await page.click('.dock a[data-key="feed"]'); await page.waitForTimeout(300);
    // drawer
    await page.click('#btn-drawer'); await page.waitForTimeout(500);
    const d = await page.evaluate(() => ({
      focus: document.activeElement.id, inert: document.getElementById('shell').inert, lock: document.documentElement.classList.contains('is-locked'),
      w: document.querySelector('.drawer__panel').getBoundingClientRect().width, h: document.querySelector('.drawer__panel').getBoundingClientRect().height, vh: innerHeight,
      expanded: document.getElementById('btn-drawer').getAttribute('aria-expanded'), role: document.querySelector('.drawer__panel').getAttribute('role'), modal: document.querySelector('.drawer__panel').getAttribute('aria-modal'),
      overscroll: getComputedStyle(document.getElementById('drawer-body')).overscrollBehaviorY
    }));
    ok(d.focus === 'drawer-close', 'foco vai para o botão Fechar');
    ok(d.inert, 'conteúdo atrás recebe inert'); ok(d.lock, 'body sem rolagem (is-locked)');
    ok(d.w === 280 && d.h === d.vh, `drawer 280px de largura e altura total (${d.w}x${d.h})`);
    ok(d.role === 'dialog' && d.modal === 'true' && d.expanded === 'true', 'role=dialog aria-modal');
    ok(d.overscroll === 'contain', 'overscroll-behavior: contain');
    // foco preso
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
    ok(await page.evaluate(() => !!document.activeElement.closest('#drawer')), 'foco preso dentro do drawer');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    ok(await page.evaluate(() => document.activeElement.id) === 'btn-drawer', 'Esc fecha e devolve o foco ao gatilho');
    ok(await page.evaluate(() => !document.getElementById('shell').inert && !document.documentElement.classList.contains('is-locked')), 'inert e trava removidos ao fechar');
    // scrim
    await page.click('#btn-drawer'); await page.waitForTimeout(400);
    await page.mouse.click(370, 400); await page.waitForTimeout(400);
    ok(await page.evaluate(() => document.getElementById('drawer').hidden), 'toque no scrim fecha');
    // drawer item navega
    await page.click('#btn-drawer'); await page.waitForTimeout(400);
    await page.click('.drawer__item[data-key="grupos"]'); await page.waitForTimeout(500);
    ok(page.url().endsWith('#/grupos') && await page.evaluate(() => document.getElementById('drawer').hidden), 'item do drawer navega e fecha');
    // 320: drawer 85%
    await page.setViewportSize({ width: 320, height: 640 });
    await page.click('#btn-drawer'); await page.waitForTimeout(400);
    const w320 = await page.evaluate(() => document.querySelector('.drawer__panel').getBoundingClientRect().width);
    ok(Math.abs(w320 - 272) <= 1, `drawer 85% em 320px (${w320})`);
    await page.keyboard.press('Escape');
    // esconder header ao rolar
    await page.setViewportSize({ width: 390, height: 780 });
    await page.evaluate(() => { location.hash = '#/feed'; }); await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(400);
    ok(await page.evaluate(() => document.getElementById('site-header').classList.contains('is-hidden')), 'header esconde ao rolar para baixo');
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(400);
    ok(await page.evaluate(() => !document.getElementById('site-header').classList.contains('is-hidden')), 'header reaparece ao rolar para cima');
    // stories: visualizador
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.click('.story[data-story="bruno"]'); await page.waitForTimeout(500);
    ok(await page.locator('.dialog--story').isVisible(), 'abre o visualizador de stories');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    ok(await page.getAttribute('.story[data-story="bruno"]', 'class').then(c => /is-seen/.test(c)), 'story marcado como visto');
    await ctx.close();
  }

  /* ---------- DESKTOP ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'Conecta123'); await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])'); await page.waitForTimeout(1200);
    const hh = await page.evaluate(() => { const h = document.getElementById('site-header'); return [Math.round(h.getBoundingClientRect().height), getComputedStyle(h).position, getComputedStyle(document.querySelector('.shell')).gridTemplateRows, document.querySelector('.dock') && getComputedStyle(document.querySelector('.dock')).display]; });
    ok(hh[0] === 64 && hh[1] === 'sticky', `header 64px sticky (${hh})`);
    ok(hh[3] === 'none', 'dock oculto no desktop');
    ok(await page.evaluate(() => getComputedStyle(document.getElementById('main-nav')).display !== 'none' && document.querySelectorAll('#main-nav-list > li[data-key]:not([hidden])').length === 4), '1280: 4 links visíveis');
    ok(await page.getAttribute('#main-nav a[href="#/feed"]', 'aria-current') === 'page', 'link ativo com aria-current');
    ok(await page.evaluate(() => document.querySelector('header nav').getAttribute('aria-label')) === 'Principal', 'nav aria-label=Principal');
    // sombra após 8px
    await page.evaluate(() => window.scrollTo(0, 200)); await page.waitForTimeout(200);
    ok(await page.evaluate(() => document.getElementById('site-header').classList.contains('is-scrolled')), 'sombra após rolagem');
    ok(await page.evaluate(() => document.getElementById('site-header').getBoundingClientRect().top === 0), 'header continua no topo');
    await page.evaluate(() => window.scrollTo(0, 0));
    // busca
    const w0 = await page.evaluate(() => document.getElementById('header-search').getBoundingClientRect().width);
    await page.focus('#q'); await page.waitForTimeout(400);
    const w1 = await page.evaluate(() => document.getElementById('header-search').getBoundingClientRect().width);
    ok(Math.round(w0) === 220 && Math.round(w1) === 300, `busca 220 -> 300 (${w0} -> ${w1})`);
    await page.fill('#q', 'café'); await page.keyboard.press('Escape');
    ok(await page.inputValue('#q') === '' && await page.evaluate(() => document.activeElement.id !== 'q'), 'Esc limpa e tira o foco');
    await page.fill('#q', 'café'); await page.keyboard.press('Enter'); await page.waitForTimeout(900);
    ok(page.url().includes('#/explorar?q='), 'Enter envia a busca');
    ok(await page.locator('#main .card').count() > 0 && await page.locator('#main .card').count() < 10, 'resultados filtrados');
    await page.fill('#explore-q', 'zzzzz'); await page.waitForTimeout(200);
    ok(await page.locator('.state').first().isVisible(), 'estado vazio da busca');
    // notificações
    await page.click('#btn-bell'); await page.waitForTimeout(200);
    const pw = await page.evaluate(() => Math.round(document.getElementById('pop-notif').getBoundingClientRect().width));
    ok(pw === 320, 'popover de notificações 320px (' + pw + ')');
    ok(await page.locator('#notif-list .notif').count() >= 3, 'lista de notificações');
    await page.keyboard.press('Escape');
    ok(await page.evaluate(() => document.getElementById('pop-notif').hidden && document.activeElement.id === 'btn-bell'), 'Esc fecha popover e devolve foco');
    await page.click('#btn-bell'); await page.mouse.click(600, 500); await page.waitForTimeout(100);
    ok(await page.evaluate(() => document.getElementById('pop-notif').hidden), 'clique fora fecha');
    // avatar
    await page.click('#btn-avatar'); await page.waitForTimeout(150);
    const items = await page.locator('#pop-profile [role="menuitem"]').allInnerTexts();
    ok(JSON.stringify(items.map(s => s.trim())) === JSON.stringify(['Meu perfil', 'Configurações', 'Ajuda', 'Sair']), 'menu de perfil: ' + items.join(','));
    ok(await page.evaluate(() => document.activeElement.textContent.trim()) !== 'x', 'foco');
    await page.keyboard.press('Escape');
    // Mais por hover
    await page.hover('#btn-more'); await page.waitForTimeout(250);
    ok(await page.evaluate(() => !document.getElementById('pop-more').hidden), 'menu Mais abre em hover');
    await page.mouse.move(600, 500); await page.waitForTimeout(400);
    ok(await page.evaluate(() => document.getElementById('pop-more').hidden), 'Mais fecha ao sair do hover');
    await page.focus('#btn-more'); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
    ok(await page.evaluate(() => !document.getElementById('pop-more').hidden && document.activeElement.getAttribute('role') === 'menuitem'), 'Mais abre por teclado (Enter) com foco no item');
    await page.keyboard.press('Escape');
    // salvar / seguir / compor
    await page.evaluate(() => { location.hash = '#/feed'; }); await page.waitForTimeout(1000);
    const before = await page.locator('#main .card').count();
    await page.click('#btn-new'); await page.waitForTimeout(400);
    await page.click('#cp-submit'); await page.waitForTimeout(100);
    ok(await page.locator('#compose-summary').innerText().then(t => /Corrija 2 campos/.test(t)), 'validação do compor');
    await page.fill('#cp-title', 'Minha primeira publicação'); await page.fill('#cp-text', 'Texto de teste.');
    await page.click('#cp-submit'); await page.waitForTimeout(1200);
    ok(await page.locator('#main .card').count() === before + 1 && /Minha primeira/.test(await page.locator('#main .card').first().innerText()), 'nova publicação aparece no topo');
    ok(await page.evaluate(() => document.activeElement.id) !== 'cp-title', 'foco devolvido após fechar');
    await page.click('.card:nth-child(2) .card__save'); await page.waitForTimeout(100);
    await page.evaluate(() => { location.hash = '#/salvos'; }); await page.waitForTimeout(900);
    ok(await page.locator('#main .card').count() === 2, 'salvos lista 2 publicações');
    await page.evaluate(() => { location.hash = '#/perfil/gabi'; }); await page.waitForTimeout(500);
    await page.click('[data-action="follow"]');
    ok(await page.getAttribute('[data-action="follow"]', 'aria-pressed') === 'true', 'seguir alterna');
    await page.evaluate(() => { location.hash = '#/perfil'; }); await page.waitForTimeout(500);
    await page.click('[data-tab="sobre"]');
    ok(await page.getAttribute('#ppanel', 'aria-labelledby') === 'ptab-sobre', 'abas do perfil trocam o conteúdo');
    await page.click('[data-action="edit-profile"]'); await page.waitForTimeout(400);
    await page.fill('#ep-name', ''); await page.click('button[form="edit-form"]');
    ok(await page.locator('#ep-name-err').innerText().then(t => /Informe seu nome/.test(t)), 'validação de editar perfil');
    await page.fill('#ep-name', 'Ana Souza Lima'); await page.click('button[form="edit-form"]'); await page.waitForTimeout(400);
    ok(/Ana Souza Lima/.test(await page.locator('.profile__name').innerText()), 'editar perfil atualiza o nome');
    // simular erro
    await page.evaluate(() => { location.hash = '#/configuracoes'; }); await page.waitForTimeout(400);
    await page.click('#simError'); await page.evaluate(() => { location.hash = '#/grupos'; }); await page.waitForTimeout(1000);
    ok(await page.locator('.state--error').isVisible(), 'estado de erro de carregamento');
    await page.evaluate(() => { location.hash = '#/configuracoes'; }); await page.waitForTimeout(400);
    await page.click('#simError'); await page.evaluate(() => { location.hash = '#/grupos'; }); await page.waitForTimeout(1000);
    ok(await page.locator('.list-card').count() >= 3, 'lista carrega depois de desligar o erro');
    // logout
    await page.click('#btn-avatar'); await page.click('#menu-logout'); await page.waitForTimeout(300);
    ok(await page.isVisible('#auth') && await page.isHidden('#app') && /saiu da conta/.test(await page.locator('#auth-status').innerText()), 'sair volta à tela de entrada');
    ok(errs.length === 0, 'sem pageerror: ' + errs.join(';'));
    await ctx.close();
  }

  /* ---------- DESKTOP 1024 e TABLET ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1024, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'Conecta123'); await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])'); await page.waitForTimeout(1200);
    const sw = await page.evaluate(() => Math.round(document.getElementById('header-search').getBoundingClientRect().width));
    ok(sw === 180, '1024: busca 180px (' + sw + ')');
    const vis = await page.locator('#main-nav-list > li[data-key]:not([hidden])').count();
    const mv = await page.locator('#pop-more [data-overflow]').count();
    ok(vis + mv === 4, `1024: links excedentes migram para Mais (${vis} visíveis + ${mv} em Mais)`);
    await page.setViewportSize({ width: 820, height: 900 }); await page.waitForTimeout(400);
    ok(await page.isVisible('#btn-panel') && await page.isHidden('#main-nav') && await page.isVisible('#btn-new') && await page.isVisible('#q') && await page.isHidden('#btn-drawer') && await page.evaluate(() => getComputedStyle(document.querySelector('.dock')).display === 'none'), '820: botão Menu, logo/busca/ação visíveis; sem dock/drawer');
    await page.click('#btn-panel'); await page.waitForTimeout(200);
    ok(await page.isVisible('#menu-panel') && await page.evaluate(() => document.documentElement.classList.contains('is-locked')), 'painel Menu abre e trava rolagem');
    const pm = await page.evaluate(() => { const p = document.getElementById('menu-panel').getBoundingClientRect(); return [p.width, innerWidth - 15, p.top]; });
    ok(pm[2] === 64 && pm[0] >= pm[1] - 1, 'painel em largura total abaixo do header ' + pm);
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    ok(await page.isHidden('#menu-panel') && await page.evaluate(() => document.activeElement.id === 'btn-panel'), 'Esc fecha o painel e devolve foco');
    await page.click('#btn-panel'); await page.click('#menu-panel-list a[data-key="grupos"]'); await page.waitForTimeout(500);
    ok(await page.isHidden('#menu-panel') && page.url().endsWith('#/grupos'), 'escolher item fecha o painel');
    await page.click('#btn-panel'); await page.mouse.click(400, 600); await page.waitForTimeout(200);
    ok(await page.isHidden('#menu-panel'), 'clique fora fecha o painel');
    // 700: mobile
    await page.setViewportSize({ width: 700, height: 800 }); await page.waitForTimeout(300);
    ok(await page.isVisible('#btn-drawer') && await page.isVisible('.dock'), '700: layout mobile (drawer + dock)');
    await ctx.close();
  }

  /* ---------- LANDSCAPE ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 640, height: 360 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.demo'); await page.fill('#login-pass', 'Conecta123'); await page.click('#btn-login');
    await page.waitForSelector('#app:not([hidden])'); await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { const d = document.querySelector('.dock__bar').getBoundingClientRect(); const dk = document.querySelector('.dock').getBoundingClientRect(); const h = document.getElementById('site-header'); return { dock: d.height, fixedBottom: innerHeight - d.top, stories: getComputedStyle(document.querySelector('.stories-wrap')).display, headerPos: getComputedStyle(h).position, vh: innerHeight }; });
    ok(r.dock === 52, 'horizontal: dock 52px (' + r.dock + ')');
    ok(r.stories === 'none', 'horizontal: stories recolhem');
    ok(r.fixedBottom / r.vh <= 0.25, 'horizontal: barras fixas <= 25% da altura (' + Math.round(r.fixedBottom / r.vh * 100) + '%)');
    await ctx.close();
  }

  await browser.close();
  console.log(fails ? `\n${fails} FALHA(S)` : '\nTODOS OS TESTES PASSARAM');
})().catch(e => { console.error(e); process.exit(1); });
