// Verifica overflow horizontal em todas as larguras de referência e rotas; salva capturas selecionadas.
const { chromium } = require('playwright');
const path = require('path');
const root = path.resolve(__dirname, '..');
const url = 'file://' + path.join(root, 'index.html');
const out = process.env.SHOTS || path.join(root, 'tests', 'shots');
require('fs').mkdirSync(out, { recursive: true });
const widths = [320, 344, 360, 375, 390, 412, 430, 480, 600, 700, 768, 820, 900, 1024, 1100, 1280, 1440, 1920];
const routes = ['#/feed', '#/explorar', '#/salvos', '#/perfil', '#/perfil/u3', '#/grupos', '#/eventos', '#/mensagens', '#/mensagens/c1', '#/notificacoes', '#/configuracoes', '#/ajuda', '#/post/p2'];
const shotAt = { 320: 1, 390: 1, 820: 1, 1024: 1, 1440: 1 };
(async () => {
  const browser = await chromium.launch();
  const problems = [];
  for (const w of widths) {
    const mobile = w < 768;
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 760 : 900 }, hasTouch: mobile, isMobile: mobile });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push(`${w} pageerror ${e.message}`));
    await page.goto(url);
    // login screen overflow
    for (const tab of ['', '?aba=cadastro', '?aba=recuperar']) {
      await page.goto(url + tab);
      await page.waitForTimeout(100);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) problems.push(`${w} login${tab} overflow ${ov}px`);
      if (shotAt[w]) await page.screenshot({ path: `${out}/w${w}-login${tab.replace(/\W/g, '_')}.png`, fullPage: true });
    }
    await page.goto(url);
    await page.fill('#login-email', 'ana@conecta.app');
    await page.fill('#login-password', 'conecta123');
    await page.click('#login-submit');
    await page.waitForFunction(() => location.hash === '#/feed');
    for (const r of routes) {
      await page.evaluate((h) => { location.hash = h; }, r);
      await page.waitForTimeout(800);
      const res = await page.evaluate(() => {
        const de = document.documentElement;
        const bad = [];
        document.querySelectorAll('#app *').forEach((el) => {
          const rc = el.getBoundingClientRect();
          if (rc.width && (rc.right > de.clientWidth + 1) && !el.closest('.stories, .profile-tabs, .chat-log, .popover, .menu-panel')) bad.push((el.className && el.className.baseVal === undefined ? el.className : el.tagName) + ' r=' + Math.round(rc.right));
        });
        return { ov: de.scrollWidth - de.clientWidth, bad: bad.slice(0, 4) };
      });
      if (res.ov > 0 || res.bad.length) problems.push(`${w} ${r} overflow ${res.ov}px ${res.bad.join(' | ')}`);
      if (shotAt[w] && ['#/feed', '#/perfil', '#/mensagens/c1', '#/post/p2', '#/explorar'].includes(r)) {
        await page.screenshot({ path: `${out}/w${w}-${r.replace(/\W/g, '_')}.png`, fullPage: true });
      }
    }
    await ctx.close();
  }
  console.log(problems.length ? problems.join('\n') : 'Sem overflow horizontal em nenhuma largura/rota.');
  await browser.close();
})();
