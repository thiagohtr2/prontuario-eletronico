// Teste rápido: abre via file://, entra com a conta demo e percorre as rotas, coletando erros.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(url);
  await page.waitForTimeout(300);
  console.log('hash inicial:', await page.evaluate(() => location.hash), '| h1:', await page.textContent('h1'));
  await page.fill('#login-email', 'marina@atlas.app');
  await page.fill('#login-password', 'atlas1234');
  await page.click('button[type=submit]');
  await page.waitForTimeout(1300);
  console.log('após login:', await page.evaluate(() => location.hash));
  const routes = ['#/inicio','#/painel','#/projetos','#/projetos/site-institucional','#/projetos/site-institucional/pagina-inicial','#/tarefas','#/calendario','#/pessoas','#/mensagens','#/mensagens/c1','#/relatorios','#/relatorios/receita','#/configuracoes','#/ajuda','#/perfil','#/notificacoes','#/mais','#/xyz'];
  for (const r of routes) {
    await page.evaluate(h => location.hash = h, r);
    await page.waitForTimeout(1000);
    const info = await page.evaluate(() => ({ h1: (document.querySelector('#main h1')||{}).textContent, crumbs: [...document.querySelectorAll('.crumbs li')].map(l=>l.textContent).join(' / '), sw: document.documentElement.scrollWidth, w: innerWidth }));
    console.log(r.padEnd(48), '|', info.h1, '|', info.crumbs, info.sw > info.w ? '| OVERFLOW ' + info.sw : '');
  }
  console.log('ERROS:', errors.length ? errors.join('\n') : 'nenhum');
  await browser.close();
})();
