// Procura elementos que ultrapassam a largura da viewport em várias larguras e rotas.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
const widths = (process.env.WIDTHS || '320,344,360,375,390,412,430,480,600,768,820,1024,1280,1440,1920').split(',').map(Number);
const routes = (process.env.ROUTES || '#/entrar,#/cadastro,#/recuperar-senha,#/inicio,#/painel,#/projetos,#/projetos/site-institucional,#/projetos/site-institucional/pagina-inicial,#/tarefas,#/calendario,#/pessoas,#/mensagens,#/mensagens/c1,#/relatorios,#/relatorios/receita,#/configuracoes,#/ajuda,#/perfil,#/notificacoes,#/mais').split(',');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  let problems = 0;
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: w < 768 ? 740 : 820 });
    for (const r of routes) {
      const auth = /entrar|cadastro|recuperar/.test(r);
      await page.evaluate(([h, auth]) => {
        if (auth) { localStorage.clear(); sessionStorage.clear(); }
        else sessionStorage.setItem('atlas.session', JSON.stringify({ name: 'Marina Costa', email: 'marina@atlas.app', role: 'Gerente de produto' }));
        location.hash = h;
      }, [r, auth]);
      await page.waitForTimeout(r === '#/painel' ? 1100 : 650);
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const out = [];
        if (document.documentElement.scrollWidth > vw + 1) {
          document.querySelectorAll('body *').forEach(el => {
            const rc = el.getBoundingClientRect();
            if (rc.width && rc.right > vw + 1) {
              // ignora o que está dentro de um contêiner com rolagem horizontal própria
              let p = el.parentElement, clipped = false;
              while (p && p !== document.body) { const cs = getComputedStyle(p); if (cs.overflowX !== 'visible' && p.getBoundingClientRect().right <= vw + 1) { clipped = true; break; } p = p.parentElement; }
              if (!clipped) out.push((el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : el.tagName) + ' r=' + Math.round(rc.right));
            }
          });
        }
        return { sw: document.documentElement.scrollWidth, vw, out: out.slice(0, 6) };
      });
      if (res.sw > res.vw + 1) { problems++; console.log(`OVERFLOW w=${w} ${r} sw=${res.sw}`, res.out.join(' | ')); }
    }
  }
  console.log(problems ? problems + ' problema(s)' : 'Sem overflow horizontal.', errors.length ? 'ERROS: ' + errors.join(' ; ') : '');
  await browser.close();
})();
