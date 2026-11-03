const { chromium, newCtx, openLogin } = require('./lib');
(async () => {
  const b = await chromium.launch();
  const ctx = await newCtx(b, 'm390');
  const p = await openLogin(ctx, 'dev-3');
  const t = p.locator('[data-olho="login-senha"]');
  console.log('toggle box', await t.boundingBox(), await t.evaluate(e => e.outerHTML.slice(0,300)));
  await p.fill('#login-senha', 'abc');
  await t.click(); await p.waitForTimeout(300);
  console.log('after click', await p.getAttribute('#login-senha','type'), await t.getAttribute('aria-pressed'), await t.getAttribute('aria-label'));
  await t.tap().catch(e=>console.log('tap err', e.message)); await p.waitForTimeout(300);
  console.log('after tap', await p.getAttribute('#login-senha','type'), await t.getAttribute('aria-pressed'));
  // cadastro
  await p.click('#aba-cadastro'); await p.waitForTimeout(400);
  await p.click('#btn-criar'); await p.waitForTimeout(600);
  console.log(await p.evaluate(() => { const r = document.getElementById('resumo-cadastro'); return { hidden: r.hidden, txt: r.innerText, role: r.getAttribute('role'), vis: window.__m.vis(r) }; }));
  await p.screenshot({ path: '/tmp/claude-0/-home-user-prontuario-eletronico/04aab11d-3446-5241-850f-d641810c4069/scratchpad/f4p5/dbg3.png' });
  await b.close();
})();
