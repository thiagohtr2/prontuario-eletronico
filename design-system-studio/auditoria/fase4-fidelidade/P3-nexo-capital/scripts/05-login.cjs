// Interações do login (I1–I6, C1–C3, A1–A2) a 1440x900.
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, gotoLogin, launch } = require('./lib.cjs');

const st = async (page) => page.evaluate(() => {
  const vis = (el) => el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
  const em = [...document.querySelectorAll('input[type=email]')].find(vis); const pw = [...document.querySelectorAll('input[type=password], input[name=password], input[autocomplete=current-password]')].find(vis);
  const desc = (i) => { if (!i) return null; const ids = (i.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); return { invalid: i.getAttribute('aria-invalid'), describedby: ids.map((id) => { const e = document.getElementById(id); return e ? (vis(e) ? e.textContent.trim().slice(0, 80) : '(oculto)') : '(inexistente)'; }) }; };
  const alerts = [...document.querySelectorAll('[role=alert]')].filter(vis).map((a) => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 160));
  const errs = [...document.querySelectorAll('.field-error, .field__error')].filter(vis).map((e) => e.textContent.trim());
  return { email: desc(em), pass: desc(pw), alerts, fieldErrors: errs };
});

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const R = res[site] = {};
    const s = SITES[site];
    let { ctx, page } = await newPage(browser, 1440, 900);
    // A1: primeira tela
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    R.firstScreen = await page.evaluate(() => ({ hash: location.hash, title: document.title, h1: [...document.querySelectorAll('h1')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => h.textContent.trim()), hasPassword: !!document.querySelector('input[type=password]') }));
    // A2 e C1: inventário de texto
    R.inventory = await page.evaluate(() => {
      const txt = document.body.innerText;
      const hd = [...document.querySelectorAll('header')].find((h) => h.getBoundingClientRect().height > 0);
      const hr = hd ? hd.getBoundingClientRect() : null;
      const logo = hd ? hd.querySelector('a, .brand') : null; const sup = hd ? [...hd.querySelectorAll('a')].find((a) => /Suporte de TI/.test(a.textContent)) : null;
      const form = document.querySelector('form'); const fr = form ? form.getBoundingClientRect() : null;
      const ins = [...document.querySelectorAll('input')].filter((i) => i.getBoundingClientRect().height > 0);
      const sso = [...document.querySelectorAll('button')].find((b) => /SSO/.test(b.textContent));
      const submit = form ? form.querySelector('button[type=submit]') : null;
      const card = document.querySelector('.login-card, .login__card, .auth-card');
      const cs = (e) => getComputedStyle(e);
      return {
        headerH: hr ? Math.round(hr.height) : null, headerBg: hd ? cs(hd).backgroundColor : null, logoLeft: logo ? Math.round(logo.getBoundingClientRect().x) : null, supportRight: sup ? Math.round(innerWidth - sup.getBoundingClientRect().right) : null,
        has: { suporte: /Suporte de TI/.test(txt), sso: /Entrar com SSO da empresa/.test(txt), ou: /\bou\b/.test(txt), emailCorp: /E-mail corporativo/.test(txt), senha: /Senha/.test(txt), aviso: /Acesso monitorado\. Uso restrito a colaboradores autorizados\./.test(txt), titulo: /Acesso corporativo/.test(txt), subtitulo: /Entre com a conta da sua organização\./.test(txt), cadastro: /criar conta|cadastre|cadastro|registr/i.test(txt), esqueci: /Esqueci minha senha/.test(txt) },
        formW: fr ? Math.round(fr.width) : null, cardW: card ? Math.round(card.getBoundingClientRect().width) : null, cardRadius: card ? cs(card).borderTopLeftRadius : null, cardShadow: card ? cs(card).boxShadow : null, cardBorder: card ? cs(card).borderTopWidth + ' ' + cs(card).borderTopColor : null,
        inputs: ins.map((i) => ({ id: i.id, type: i.type, inputmode: i.getAttribute('inputmode'), ac: i.getAttribute('autocomplete'), label: i.id && document.querySelector('label[for="' + i.id + '"]') ? document.querySelector('label[for="' + i.id + '"]').textContent.trim() : null, h: Math.round(i.getBoundingClientRect().height), radius: cs(i).borderTopLeftRadius, border: cs(i).borderTopWidth + ' ' + cs(i).borderTopColor, fs: cs(i).fontSize })),
        sso: sso ? { bg: cs(sso).backgroundColor, color: cs(sso).color, h: Math.round(sso.getBoundingClientRect().height), radius: cs(sso).borderTopLeftRadius, fw: cs(sso).fontWeight } : null,
        submit: submit ? { text: submit.textContent.trim(), bg: cs(submit).backgroundColor, color: cs(submit).color, border: cs(submit).borderTopWidth + ' ' + cs(submit).borderTopColor, h: Math.round(submit.getBoundingClientRect().height), radius: cs(submit).borderTopLeftRadius } : null,
        pageBg: cs(document.body).backgroundColor, mainBg: (() => { const m = document.querySelector('main'); return m ? cs(m).backgroundColor : null; })(),
        title: (() => { const h = [...document.querySelectorAll('h1')].find((x) => x.getBoundingClientRect().height > 0); return h ? { fs: cs(h).fontSize, fw: cs(h).fontWeight, color: cs(h).color } : null; })(),
        muted: (() => { const p = [...document.querySelectorAll('h1 + p')].find((x) => x.getBoundingClientRect().height > 0); return p ? cs(p).color : null; })(),
      };
    });
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'login-1440-inicial.png') });
    // I1: envio vazio
    await page.click('form button[type=submit]:visible');
    await page.waitForTimeout(500);
    R.submitEmpty = await st(page);
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'login-1440-erros-vazio.png') });
    // I1: blur com valor inválido (recarrega)
    await ctx.close(); ({ ctx, page } = await newPage(browser, 1440, 900));
    await gotoLogin(page, site);
    await page.click('input[type=email]:visible'); await page.keyboard.type('abc'); await page.keyboard.press('Tab');
    await page.waitForTimeout(400);
    R.blurInvalid = await st(page);
    // blur de campo vazio só atravessado
    await ctx.close(); ({ ctx, page } = await newPage(browser, 1440, 900));
    await gotoLogin(page, site);
    await page.click('input[type=email]:visible'); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
    R.blurEmptyUntouched = await st(page);
    // I2: credenciais erradas
    await page.fill('input[type=email]:visible', 'fulano@empresa.com.br');
    await page.fill('input[type=password]:visible', 'Errada123');
    await page.click('form button[type=submit]:visible');
    await page.waitForTimeout(150);
    R.loadingState = await page.evaluate(() => { const b = document.querySelector('form button[type=submit]'); return { text: b.textContent.trim(), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', busy: b.getAttribute('aria-busy') }; });
    await page.waitForTimeout(2500);
    R.wrongCreds = await st(page);
    R.wrongCredsText = await page.evaluate(() => /E-mail ou senha incorretos/.test(document.body.innerText));
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'login-1440-credenciais-erradas.png') });
    // I3: mostrar/ocultar senha
    const tg = page.locator('button[aria-label="Mostrar senha"]:visible').first();
    R.toggleExists = await tg.count();
    if (R.toggleExists) {
      await page.fill('input[autocomplete=current-password]:visible', 'abc');
      const before = await page.evaluate(() => { const b = document.querySelector('button[aria-label="Mostrar senha"]'); return { pressed: b.getAttribute('aria-pressed') }; });
      await tg.click(); await page.waitForTimeout(200);
      R.toggle = await page.evaluate(() => { const i = document.querySelector('input[autocomplete=current-password]'); const b = document.querySelector('button[aria-controls="' + i.id + '"]') || i.parentElement.querySelector('button'); return { type: i.type, aria: b.getAttribute('aria-label'), pressed: b.getAttribute('aria-pressed'), w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height) }; });
      R.toggle.before = before;
    }
    // I6: SSO
    await ctx.close(); ({ ctx, page } = await newPage(browser, 1440, 900));
    await gotoLogin(page, site);
    await page.click('button:has-text("Entrar com SSO da empresa")');
    await page.waitForTimeout(150);
    R.sso = await page.evaluate(() => ({ text: [...document.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().height > 0).map((b) => b.textContent.trim()).filter((t) => /SSO|Redirecion|Entrando/.test(t)), status: [...document.querySelectorAll('[role=status],[aria-live]')].map((e) => e.textContent.trim()).filter(Boolean) }));
    await page.waitForTimeout(2500);
    R.ssoAfter = await page.evaluate(() => ({ hash: location.hash, pw: !!(document.querySelector('input[type=password]') && document.querySelector('input[type=password]').offsetParent) }));
    // I4: recuperação
    await ctx.close(); ({ ctx, page } = await newPage(browser, 1440, 900));
    await gotoLogin(page, site);
    await page.click('a:has-text("Esqueci minha senha")');
    await page.waitForTimeout(500);
    const em = page.locator('input[type=email]:visible').first();
    await em.fill('alguem@empresa.com.br');
    await page.locator('form button[type=submit]:visible').first().click();
    await page.waitForTimeout(2500);
    R.recover = await page.evaluate(() => ({ hash: location.hash, neutral: (document.body.innerText.match(/Se o e-mail existir[^.]*\./) || [null])[0] }));
    await page.screenshot({ path: path.join(OUT, 'capturas', site, 'login-1440-recuperacao.png') });
    // desktop login: medidas a 1440 já no inventário
    R.errors = page._errors;
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-05-login.json'), JSON.stringify(res, null, 1));
  await browser.close();
  console.log(JSON.stringify(res, null, 1));
})();
