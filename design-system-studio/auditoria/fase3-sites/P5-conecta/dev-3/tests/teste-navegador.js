/* Teste de navegador (Playwright). Uso: node tests/teste-navegador.js
   Abre index.html por file:// e verifica larguras, fluxos e estados. Capturas em _testes/. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const URL_BASE = 'file://' + path.join(RAIZ, 'index.html');
const PASTA_SHOTS = path.join(RAIZ, '_testes');
const LARGURAS = [320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920];

let falhas = 0;
let ok = 0;
function checar(nome, cond, extra) {
  if (cond) {
    ok++;
    console.log('  ok   ' + nome);
  } else {
    falhas++;
    console.log('  FALHA ' + nome + (extra ? ' :: ' + extra : ''));
  }
}

async function entrar(page) {
  await page.fill('#login-email', 'demo@conecta.app');
  await page.fill('#login-senha', 'demo1234');
  await page.click('#btn-entrar');
  await page.waitForSelector('#app:not([hidden])', { timeout: 5000 });
  await page.waitForSelector('.cartao:not(.cartao--esqueleto), .estado, .perfil', { timeout: 5000 });
}

async function semRolagemHorizontal(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
}

(async () => {
  fs.mkdirSync(PASTA_SHOTS, { recursive: true });
  const navegador = await chromium.launch();
  const erros = [];

  function novaPagina(largura, altura) {
    return navegador.newPage({ viewport: { width: largura, height: altura || 800 } }).then((p) => {
      p.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
      p.on('console', (m) => {
        if (m.type() === 'error' && !/fonts\.googleapis|ERR_|Failed to load resource/.test(m.text())) erros.push('console: ' + m.text());
      });
      return p;
    });
  }

  console.log('\n[1] Sem rolagem horizontal, tela de entrada');
  for (const w of LARGURAS) {
    const p = await novaPagina(w, 740);
    await p.goto(URL_BASE);
    await p.waitForSelector('#tela-entrar:not([hidden])');
    const sem = await semRolagemHorizontal(p);
    checar('entrada sem overflow em ' + w + 'px', sem);
    await p.close();
  }

  console.log('\n[2] Sem rolagem horizontal, app logado');
  for (const w of LARGURAS) {
    const p = await novaPagina(w, 740);
    await p.goto(URL_BASE);
    await p.waitForSelector('#tela-entrar:not([hidden])');
    await entrar(p);
    await p.waitForTimeout(150);
    const sem = await semRolagemHorizontal(p);
    checar('app sem overflow em ' + w + 'px', sem);
    await p.close();
  }

  console.log('\n[3] Celular 375: entrada, login com erro e acerto');
  let p = await novaPagina(375, 812);
  await p.goto(URL_BASE);
  await p.waitForSelector('#tela-entrar:not([hidden])');
  checar('abre direto na tela de entrar (sem landing)', await p.isVisible('#titulo-auth'));
  checar('titulo "Entrar"', (await p.textContent('#titulo-auth')).trim() === 'Entrar');
  checar('subtitulo da demonstracao', (await p.textContent('#subtitulo-auth')).includes('Escolha como prefere acessar.'));
  const alturaCampo = await p.$eval('#login-email', (el) => el.getBoundingClientRect().height);
  checar('campo de login com 56 px', alturaCampo >= 55 && alturaCampo <= 57, String(alturaCampo));
  const fonteCampo = await p.$eval('#login-email', (el) => parseFloat(getComputedStyle(el).fontSize));
  checar('fonte do campo >= 16 px no celular', fonteCampo >= 16, String(fonteCampo));
  const tipoEmail = await p.$eval('#login-email', (el) => [el.type, el.inputMode, el.autocomplete].join('|'));
  checar('email com type/inputmode/autocomplete', tipoEmail === 'email|email|username', tipoEmail);
  const botaoFixo = await p.$eval('#acoes-entrar', (el) => getComputedStyle(el).position);
  checar('botao Entrar fixo na base no celular', botaoFixo === 'fixed', botaoFixo);
  await p.click('#btn-entrar');
  checar('erro de campos vazios mostra resumo role=alert', await p.isVisible('#resumo-entrar'));
  checar('campo invalido recebe aria-invalid', (await p.getAttribute('#login-email', 'aria-invalid')) === 'true');
  await p.fill('#login-email', 'demo@conecta.app');
  await p.fill('#login-senha', 'errada123');
  await p.click('#btn-entrar');
  await p.waitForTimeout(900);
  const msgErro = (await p.textContent('#resumo-entrar')).trim();
  checar('credencial errada: mensagem generica', msgErro.includes('E-mail ou senha incorretos.'), msgErro);
  await p.click('.olho[data-olho="login-senha"]');
  checar('mostrar senha: aria-pressed=true', (await p.getAttribute('.olho[data-olho="login-senha"]', 'aria-pressed')) === 'true');
  await p.click('.olho[data-olho="login-senha"]');
  await p.click('#link-esqueci');
  checar('"Esqueci minha senha" leva a recuperacao', (await p.textContent('#titulo-auth')).trim() === 'Recuperar senha');
  checar('URL da recuperacao ?aba=recuperar', p.url().includes('?aba=recuperar'));
  await p.fill('#rec-email', 'alguem@exemplo.com');
  await p.click('#btn-recuperar');
  await p.waitForSelector('#aviso-recuperar:not([hidden])', { timeout: 3000 });
  checar('recuperacao: mensagem neutra', (await p.textContent('#aviso-recuperar')).includes('Se o e-mail existir, enviaremos um link.'));
  await p.click('#link-voltar');
  await p.click('#aba-cadastro');
  checar('aba Criar conta atualiza URL', p.url().includes('?aba=cadastro'));
  await p.click('#aba-entrar');
  await p.click('label[for="metodo-telefone"]');
  checar('alternancia para telefone mostra campo tel', await p.isVisible('#login-telefone'));
  checar('telefone com type=tel e inputmode=tel', (await p.$eval('#login-telefone', (el) => el.type + '|' + el.inputMode)) === 'tel|tel');
  await p.click('label[for="metodo-email"]');
  await p.fill('#login-email', 'demo@conecta.app');
  await p.fill('#login-senha', 'demo1234');
  await p.click('#btn-entrar');
  await p.waitForSelector('#app:not([hidden])', { timeout: 5000 });
  await p.waitForSelector('.cartao:not(.cartao--esqueleto)', { timeout: 5000 });
  checar('login correto abre o feed com 6 cards', (await p.$$('.cartao:not(.cartao--esqueleto)')).length === 6);
  checar('URL do app em #/feed', p.url().includes('#/feed'));
  await p.screenshot({ path: path.join(PASTA_SHOTS, 'm-feed.png'), fullPage: false });
  checar('dock visivel no celular', await p.isVisible('#dock'));
  checar('topbar mobile visivel, barra desktop oculta', (await p.isVisible('.topo-movel')) && !(await p.isVisible('.barra')));
  const stories = await p.$$eval('.story', (els) => els.length);
  checar('stories presentes na faixa', stories === 5, String(stories));
  await p.close();

  console.log('\n[4] Celular 375: drawer lateral');
  p = await novaPagina(375, 812);
  await p.goto(URL_BASE + '#/feed');
  await entrar(p);
  await p.click('#btn-menu');
  await p.waitForTimeout(300);
  checar('drawer abre', await p.$eval('#drawer', (el) => el.classList.contains('is-aberto')));
  checar('foco vai para Fechar', await p.evaluate(() => document.activeElement.id === 'btn-fechar-drawer'));
  checar('drawer traz Grupos, Eventos e Mensagens (celular)', (await p.$('[data-drawer-link][href="#/mensagens"]')) !== null && (await p.$('[data-drawer-link][href="#/grupos"]')) !== null);
  checar('body sem rolagem enquanto aberto', await p.evaluate(() => document.body.style.overflow === 'hidden'));
  checar('conteudo atras esta inert', await p.evaluate(() => document.getElementById('app').inert === true));
  const larguraDrawer = await p.$eval('#drawer', (el) => el.getBoundingClientRect().width);
  checar('drawer ~280 px', larguraDrawer >= 270 && larguraDrawer <= 282, String(larguraDrawer));
  await p.screenshot({ path: path.join(PASTA_SHOTS, 'm-drawer.png') });
  await p.keyboard.press('Tab');
  checar('foco preso dentro do drawer (Tab)', await p.evaluate(() => !!document.getElementById('drawer').contains(document.activeElement)));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  checar('Esc fecha o drawer', !(await p.$eval('#drawer', (el) => el.classList.contains('is-aberto'))));
  checar('foco volta ao hamburguer', await p.evaluate(() => document.activeElement.id === 'btn-menu'));
  await p.click('#btn-menu');
  await p.waitForTimeout(300);
  await p.click('.scrim', { position: { x: 340, y: 400 } });
  await p.waitForTimeout(300);
  checar('toque no scrim fecha o drawer', !(await p.$eval('#drawer', (el) => el.classList.contains('is-aberto'))));
  await p.click('#btn-menu');
  await p.waitForTimeout(300);
  await p.click('#btn-fechar-drawer');
  await p.waitForTimeout(300);
  checar('botao X fecha o drawer', !(await p.$eval('#drawer', (el) => el.classList.contains('is-aberto'))));
  await p.click('#btn-menu');
  await p.waitForTimeout(300);
  await p.click('[data-drawer-link][href="#/ajuda"]');
  await p.waitForTimeout(300);
  checar('link do drawer navega e fecha', p.url().includes('#/ajuda') && !(await p.$eval('#drawer', (el) => el.classList.contains('is-aberto'))));
  await p.close();

  console.log('\n[5] Celular 375: dock, perfil e modal de edicao');
  p = await novaPagina(375, 812);
  await p.goto(URL_BASE + '#/feed');
  await entrar(p);
  await p.click('.dock__item[data-rota="perfil"]');
  await p.waitForSelector('.perfil__nome');
  checar('dock Perfil abre o perfil', (await p.textContent('.perfil__nome')).trim() === 'Ana Souza');
  checar('item ativo do dock marcado', (await p.getAttribute('.dock__item[data-rota="perfil"]', 'aria-current')) === 'page');
  const botaoAcoes = await p.$eval('.perfil__acoes .btn', (el) => el.getBoundingClientRect().height);
  checar('botao do perfil com >= 40 px', botaoAcoes >= 40, String(botaoAcoes));
  await p.screenshot({ path: path.join(PASTA_SHOTS, 'm-perfil.png'), fullPage: true });
  await p.click('[data-acao="editar-perfil"]');
  await p.waitForSelector('#modal:not([hidden])');
  checar('modal de edicao abre com foco no campo', await p.evaluate(() => document.activeElement.id === 'ed-nome'));
  await p.fill('#ed-nome', '');
  await p.click('#form-editar button[type="submit"]');
  checar('nome vazio mostra erro no modal', await p.isVisible('#erro-ed-nome'));
  await p.fill('#ed-nome', 'Ana Souza Lima');
  await p.click('#form-editar button[type="submit"]');
  await p.waitForTimeout(300);
  checar('salvar atualiza o nome do perfil', (await p.textContent('.perfil__nome')).trim() === 'Ana Souza Lima');
  await p.click('[data-acao="editar-perfil"]');
  await p.waitForSelector('#modal:not([hidden])');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(100);
  checar('Esc fecha o modal', await p.isHidden('#modal'));
  await p.click('.dock__item[data-rota="explorar"]');
  await p.waitForSelector('.lista__item');
  checar('Explorar lista pessoas', (await p.$$('.lista__item')).length === 5);
  await p.click('.dock__item[data-rota="salvos"]');
  await p.waitForSelector('.estado');
  checar('Salvos mostra estado vazio', (await p.textContent('.estado h2')).includes('Nenhuma publicação salva'));
  await p.close();

  console.log('\n[6] Estado de erro e nova tentativa no feed');
  p = await novaPagina(390, 800);
  await p.goto(URL_BASE + '?falha=feed');
  await p.waitForSelector('#tela-entrar:not([hidden])');
  await entrar(p);
  await p.waitForSelector('.estado--erro', { timeout: 4000 }).catch(() => {});
  checar('feed com erro mostra alerta', await p.isVisible('.estado--erro'));
  await p.click('[data-acao="tentar"]');
  await p.waitForSelector('.cartao:not(.cartao--esqueleto)', { timeout: 4000 });
  checar('tentar novamente carrega o feed', (await p.$$('.cartao:not(.cartao--esqueleto)')).length === 6);
  await p.close();

  console.log('\n[7] Cadastro na mesma tela');
  p = await novaPagina(390, 800);
  await p.goto(URL_BASE + '?aba=cadastro');
  await p.waitForSelector('#painel-cadastro:not([hidden])');
  checar('?aba=cadastro abre na aba Criar conta', (await p.textContent('#titulo-auth')).trim() === 'Criar conta');
  await p.fill('#cad-email', 'nova@exemplo.com');
  await p.click('#aba-entrar');
  checar('troca de aba mantem o e-mail', (await p.inputValue('#login-email')) === 'nova@exemplo.com');
  await p.click('#aba-cadastro');
  await p.click('#btn-criar');
  checar('cadastro vazio: resumo com alerta', await p.isVisible('#resumo-cadastro'));
  await p.fill('#cad-senha', 'abc');
  checar('requisitos marcam a regra cumprida', (await p.$eval('li[data-regra="letra"]', (el) => el.classList.contains('ok'))));
  await p.click('#btn-criar');
  checar('senha curta: mensagem por campo', (await p.textContent('#erro-cad-senha')).includes('Use pelo menos 8 caracteres'));
  checar('nome e e-mail preservados apos erro', (await p.inputValue('#cad-email')) === 'nova@exemplo.com');
  await p.fill('#cad-nome', 'Marina Costa');
  await p.fill('#cad-senha', 'segura2026');
  await p.click('#btn-criar');
  await p.waitForSelector('#campo-codigo:not([hidden])', { timeout: 3000 });
  checar('etapa do codigo de confirmacao (one-time-code)', (await p.getAttribute('#cad-codigo', 'autocomplete')) === 'one-time-code');
  await p.fill('#cad-codigo', '000000');
  await p.click('#btn-criar');
  await p.waitForTimeout(200);
  checar('codigo errado: erro', (await p.textContent('#erro-cad-codigo')).includes('Código inválido'));
  await p.fill('#cad-codigo', '123456');
  await p.click('#btn-criar');
  await p.waitForSelector('#app:not([hidden])', { timeout: 4000 });
  checar('cadastro concluido entra no app', await p.isVisible('#app'));
  await p.close();

  console.log('\n[8] Desktop 1280: topbar integral e navegacao');
  p = await novaPagina(1280, 800);
  await p.goto(URL_BASE);
  await entrar(p);
  await p.waitForTimeout(200);
  checar('navegacao principal visivel no desktop', await p.isVisible('.nav-principal'));
  checar('dock oculto no desktop', !(await p.isVisible('#dock')));
  const itensNav = await p.$$eval('.nav-link', (els) => els.map((e) => e.textContent.trim()));
  checar('4 itens: Feed, Grupos, Eventos, Mensagens', itensNav.join('|').startsWith('Feed|Grupos|Eventos|Mensagens'), itensNav.join('|'));
  const altHeader = await p.$eval('.barra', (el) => el.getBoundingClientRect().height);
  checar('header de 64 px', altHeader === 64, String(altHeader));
  const posCabecalho = await p.$eval('#cabecalho', (el) => getComputedStyle(el).position);
  checar('header sticky', posCabecalho === 'sticky', posCabecalho);
  await p.click('.nav-link[data-rota="mensagens"]');
  await p.waitForSelector('.lista__item');
  checar('Mensagens marcado com aria-current', (await p.getAttribute('.nav-link[data-rota="mensagens"]', 'aria-current')) === 'page');
  await p.click('#btn-notificacoes');
  checar('popover de notificacoes abre', await p.isVisible('#pop-notificacoes'));
  await p.keyboard.press('Escape');
  checar('Esc fecha o popover', await p.isHidden('#pop-notificacoes'));
  await p.click('#btn-perfil-menu');
  checar('menu do avatar abre', await p.isVisible('#pop-perfil'));
  await p.click('body', { position: { x: 5, y: 790 } });
  checar('clique fora fecha o menu do avatar', await p.isHidden('#pop-perfil'));
  await p.click('#btn-novo');
  await p.waitForSelector('#modal:not([hidden])');
  await p.click('#form-nova button[type="submit"]');
  checar('publicar vazio mostra erro', await p.isVisible('#erro-nova'));
  await p.fill('#nova-texto', 'Teste de publicação');
  await p.click('#form-nova button[type="submit"]');
  await p.waitForTimeout(300);
  checar('nova publicacao aparece no feed', (await p.textContent('.cartao__texto')).length > 0 && (await p.$$('.cartao:not(.cartao--esqueleto)')).length === 7);
  await p.fill('#busca-input', 'Diego');
  await p.press('#busca-input', 'Enter');
  await p.waitForSelector('.lista__item, .estado', { timeout: 4000 });
  checar('busca encontra pessoa', (await p.textContent('main')).includes('Diego Rocha'));
  await p.fill('#busca-input', 'xyzabc');
  await p.press('#busca-input', 'Enter');
  await p.waitForSelector('.estado', { timeout: 4000 });
  checar('busca sem resultado: estado vazio', (await p.textContent('.estado h2')).includes('Nenhum resultado'));
  await p.goto(URL_BASE + '#/feed');
  await p.waitForSelector('.cartao:not(.cartao--esqueleto)', { timeout: 4000 });
  await p.screenshot({ path: path.join(PASTA_SHOTS, 'd-feed.png') });
  await p.close();

  console.log('\n[9] Tablet 820: menu recolhido em painel');
  p = await novaPagina(820, 800);
  await p.goto(URL_BASE);
  await entrar(p);
  checar('nav oculta, botao Menu visivel', (!(await p.isVisible('.nav-principal'))) && (await p.isVisible('#btn-menu-nav')));
  await p.click('#btn-menu-nav');
  checar('painel do menu abre abaixo do header', await p.isVisible('#menu-nav'));
  await p.keyboard.press('Escape');
  checar('Esc fecha o painel do menu', await p.isHidden('#menu-nav'));
  await p.close();

  console.log('\n[10] Desktop 1920 e entrada desktop');
  p = await novaPagina(1440, 900);
  await p.goto(URL_BASE);
  await p.waitForSelector('#tela-entrar:not([hidden])');
  checar('entrada desktop mostra instrucoes ao lado', await p.isVisible('.auth__info'));
  await p.screenshot({ path: path.join(PASTA_SHOTS, 'd-entrada.png') });
  await p.close();

  await navegador.close();

  const relevantes = erros.filter((e) => !/favicon/.test(e));
  console.log('\nErros de console/pagina: ' + relevantes.length);
  relevantes.slice(0, 10).forEach((e) => console.log('  - ' + e));
  console.log('\nResultado: ' + ok + ' ok, ' + falhas + ' falha(s)');
  process.exitCode = falhas || relevantes.length ? 1 : 0;
})().catch((e) => {
  console.error('ERRO NO TESTE:', e);
  process.exitCode = 2;
});
