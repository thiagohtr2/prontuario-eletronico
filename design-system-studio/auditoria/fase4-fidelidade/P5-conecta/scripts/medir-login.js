// Login e cadastro: estrutura, validação, abas, URL, checklist (390x844 móvel). Uso: node medir-login.js dev-1
const { chromium, CFG, CAP, DATA, newCtx, openLogin, fs } = require('./lib');
const site = process.argv[2];
const c = CFG[site];
const R = { site };
const step = async (name, fn) => { try { R[name] = await fn(); } catch (e) { R[name] = { ERRO: e.message.split('\n')[0] }; } };
const shot = (p, name, o = {}) => p.screenshot({ path: `${CAP}/${site}-${name}.png`, ...o });

(async () => {
  const b = await chromium.launch();
  const ctx = await newCtx(b, 'm390');
  const p = await openLogin(ctx, site);
  await step('primeiraTela', () => p.evaluate((c) => {
    const m = window.__m;
    const h1 = [...document.querySelectorAll('h1, h2')].filter(m.vis).map((e) => m.text(e));
    const sub = [...document.querySelectorAll('p')].filter(m.vis).map((e) => m.text(e)).find((t) => /Escolha como prefere acessar/.test(t));
    const tablist = [...document.querySelectorAll('[role=tablist]')].filter(m.vis).map((t) => ({ label: t.getAttribute('aria-label'), tabs: [...t.querySelectorAll('[role=tab]')].map((x) => ({ t: m.text(x), sel: x.getAttribute('aria-selected'), w: Math.round(x.getBoundingClientRect().width), h: Math.round(x.getBoundingClientRect().height), borderB: getComputedStyle(x).borderBottomWidth + ' ' + getComputedStyle(x).borderBottomColor, after: getComputedStyle(x, '::after').backgroundColor + ' ' + getComputedStyle(x, '::after').height, shadow: getComputedStyle(x).boxShadow, color: getComputedStyle(x).color })) }));
    const seg = [m.q(c.segEmail), m.q(c.segPhone)].map((e) => e ? { type: e.type, role: e.getAttribute('role'), label: (e.labels && e.labels[0] ? m.text(e.labels[0]) : m.text(e)), checked: e.checked || e.getAttribute('aria-checked') || e.getAttribute('aria-pressed') || e.getAttribute('aria-selected') } : null);
    const email = m.q(c.loginEmail), pass = m.q(c.loginPass), sub2 = m.q(c.loginSubmit);
    const lbl = (e) => (e && e.labels && e.labels[0] ? m.text(e.labels[0]) : null);
    const forgot = [...document.querySelectorAll('a,button')].find((e) => m.vis(e) && /Esqueci minha senha/.test(m.text(e)));
    const sb = sub2.getBoundingClientRect();
    return {
      url: location.href, h1, sub: sub || null, tablist, seg,
      email: { label: lbl(email), type: email.type, inputmode: email.inputMode, ac: email.autocomplete, h: email.getBoundingClientRect().height, fs: getComputedStyle(email).fontSize, radius: getComputedStyle(email).borderRadius, border: getComputedStyle(email).borderTopWidth + ' ' + getComputedStyle(email).borderTopColor },
      pass: { label: lbl(pass), type: pass.type, ac: pass.autocomplete, h: pass.getBoundingClientRect().height, fs: getComputedStyle(pass).fontSize },
      forgot: forgot ? { t: m.text(forgot), dyToPass: Math.round(forgot.getBoundingClientRect().top - pass.getBoundingClientRect().bottom), dyAbove: Math.round(pass.getBoundingClientRect().top - forgot.getBoundingClientRect().bottom) } : null,
      submit: { t: m.text(sub2), top: sb.top, bottom: sb.bottom, h: sb.height, gapBottom: Math.round(innerHeight - sb.bottom), pos: getComputedStyle(sub2).position, parentPos: getComputedStyle(sub2.parentElement).position, bg: getComputedStyle(sub2).backgroundColor, radius: getComputedStyle(sub2).borderRadius },
      landing: !!document.querySelector('.landing, #landing, .hero'),
      safeAreaCss: [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /safe-area-inset-bottom/.test(r.cssText) && /submit|acoes|actions|sticky|form/i.test(r.cssText)); } catch (e) { return false; } }),
    };
  }, c));
  await shot(p, 'm390-login-tela');
  // validação: enviar vazio
  await step('enviarVazio', async () => {
    await p.click(c.loginSubmit); await p.waitForTimeout(500);
    const r = await p.evaluate((c) => { const m = window.__m; const e = m.q(c.loginEmail); const s = m.q(c.loginSummary); const desc = e.getAttribute('aria-describedby'); const descText = desc ? desc.split(/\s+/).map((id) => document.getElementById(id)).filter(Boolean).map((x) => m.text(x)).join(' | ') : null; return { ariaInvalid: e.getAttribute('aria-invalid'), describedby: desc, descText, resumoVisivel: s ? m.vis(s) : null, resumoRole: s ? s.getAttribute('role') : null, resumoTexto: s ? m.text(s).slice(0, 120) : null, focado: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null }; }, c);
    await shot(p, 'm390-login-erro-vazio');
    return r;
  });
  // blur: digitar e-mail inválido e sair
  await step('blurInvalido', async () => {
    await p.fill(c.loginEmail, 'abc'); await p.focus(c.loginPass); await p.waitForTimeout(400);
    return p.evaluate((c) => { const e = document.querySelector(c.loginEmail); const desc = e.getAttribute('aria-describedby'); return { ariaInvalid: e.getAttribute('aria-invalid'), descText: desc ? desc.split(/\s+/).map((id) => document.getElementById(id)).filter(Boolean).map((x) => window.__m.text(x)).join(' | ') : null }; }, c);
  });
  // toggle senha
  await step('toggleSenha', async () => {
    await p.fill(c.loginPass, 'x');
    const t = p.locator(c.pwToggle).first();
    const before = { type: await p.getAttribute(c.loginPass, 'type'), pressed: await t.getAttribute('aria-pressed'), label: await t.getAttribute('aria-label') };
    await t.click(); await p.waitForTimeout(200);
    const after = { type: await p.getAttribute(c.loginPass, 'type'), pressed: await t.getAttribute('aria-pressed'), label: await t.getAttribute('aria-label') };
    await t.click();
    return { before, after };
  });
  // credenciais erradas
  await step('credErradas', async () => {
    await p.fill(c.loginEmail, c.email); await p.fill(c.loginPass, 'senhaerrada99');
    await p.click(c.loginSubmit);
    const during = await p.evaluate((c) => { const s = document.querySelector(c.loginSubmit); return { t: window.__m.text(s), disabled: s.disabled || s.getAttribute('aria-disabled') === 'true', busy: s.getAttribute('aria-busy') }; }, c);
    await p.waitForTimeout(2500);
    const r = await p.evaluate((c) => { const m = window.__m; const s = m.q(c.loginSummary); const all = m.text(document.body); return { resumo: s ? m.text(s) : null, generico: /E-mail ou senha incorretos/.test(all), senhaMantida: m.q(c.loginPass).value.length > 0, emailMantido: m.q(c.loginEmail).value }; }, c);
    r.duranteEnvio = during;
    await shot(p, 'm390-login-erro-cred');
    return r;
  });
  // esqueci minha senha
  await step('esqueci', async () => {
    const f = p.locator('a, button', { hasText: 'Esqueci minha senha' }).first();
    await f.click(); await p.waitForTimeout(700);
    const r = { url: p.url() };
    const recEmail = await p.$('#recover-email, #rec-email');
    if (recEmail) { await recEmail.fill('alguem@exemplo.com'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500); }
    r.neutra = await p.evaluate(() => /Se o e-mail existir, enviaremos um link/.test(document.body.innerText));
    await shot(p, 'm390-login-recuperar');
    return r;
  });
  // cadastro: e-mail preservado, URL, ordem, checklist, termos
  await step('cadastro', async () => {
    await p.goto(`http://127.0.0.1:${c.port}/index.html`); await p.waitForTimeout(600);
    await p.fill(c.loginEmail, 'teste@exemplo.com');
    await p.click(c.tabCadastro); await p.waitForTimeout(600);
    const r = await p.evaluate((c) => {
      const m = window.__m; const panel = m.q(c.signupPanel);
      const inputs = [...panel.querySelectorAll('input')].filter(m.vis);
      const termsP = [...panel.querySelectorAll('p, small, div')].find((e) => /termos|Termos/.test(m.text(e)) && e.children.length < 6);
      return { url: location.search, emailNoCadastro: m.q(c.signup[1]).value, ordem: inputs.map((i) => (i.labels && i.labels[0] ? m.text(i.labels[0]) : i.name || i.id)), ac: inputs.map((i) => i.autocomplete), alturas: inputs.map((i) => Math.round(i.getBoundingClientRect().height)), termos: termsP ? { t: m.text(termsP).slice(0, 120), links: termsP.querySelectorAll('a,button').length } : null, botao: (() => { const bt = [...panel.querySelectorAll('button[type=submit], button')].find((x) => /Criar conta/.test(m.text(x))); return bt ? { t: m.text(bt), pos: getComputedStyle(bt).position, below: Math.round(bt.getBoundingClientRect().top - inputs[inputs.length - 1].getBoundingClientRect().bottom) } : null; })() };
    }, c);
    await p.fill(c.signup[2], 'abc');
    await p.waitForTimeout(300);
    r.checklistParcial = await p.evaluate((c) => { const m = window.__m; const panel = m.q(c.signupPanel); const li = [...panel.querySelectorAll('li')].filter(m.vis); return li.map((l) => m.text(l) + '=' + (l.className + ' ' + (l.getAttribute('aria-checked') || l.dataset.ok || l.dataset.ok || '')).slice(0, 40)); }, c);
    await p.fill(c.signup[2], 'abcdefgH1');
    await p.waitForTimeout(300);
    r.checklistCompleto = await p.evaluate((c) => { const m = window.__m; const panel = m.q(c.signupPanel); const li = [...panel.querySelectorAll('li')].filter(m.vis); return li.map((l) => m.text(l) + '=' + (l.className + ' ' + (l.getAttribute('aria-checked') || l.dataset.ok || '')).slice(0, 40)); }, c);
    await shot(p, 'm390-cadastro');
    // envio vazio do cadastro
    await p.fill(c.signup[0], ''); await p.fill(c.signup[2], '');
    await p.locator(`${c.signupPanel} button`, { hasText: 'Criar conta' }).first().click(); await p.waitForTimeout(500);
    r.erroVazio = await p.evaluate((c) => { const m = window.__m; const panel = m.q(c.signupPanel); const al = [...panel.querySelectorAll('[role=alert]')].filter(m.vis).map((e) => m.text(e).slice(0, 80)); return { alert: al, invalid: [...panel.querySelectorAll('[aria-invalid=true]')].length }; }, c);
    await shot(p, 'm390-cadastro-erro');
    // voltar para Entrar: e-mail preservado?
    await p.click(c.tabEntrar); await p.waitForTimeout(400);
    r.voltaEntrar = await p.evaluate((c) => ({ url: location.search, email: document.querySelector(c.loginEmail).value }), c);
    return r;
  });
  // link direto ?aba=cadastro
  await step('linkDireto', async () => {
    await p.goto(`http://127.0.0.1:${c.port}/index.html?aba=cadastro`); await p.waitForTimeout(700);
    return p.evaluate((c) => ({ cadastroVisivel: window.__m.vis(document.querySelector(c.signupPanel)) }), c);
  });
  // estado "Entrando…"
  await step('entrando', async () => {
    await p.goto(`http://127.0.0.1:${c.port}/index.html`); await p.waitForTimeout(600);
    await p.fill(c.loginEmail, c.email); await p.fill(c.loginPass, c.pass);
    await p.click(c.loginSubmit);
    const r = await p.evaluate((c) => { const s = document.querySelector(c.loginSubmit); return { t: window.__m.text(s), disabled: s.disabled || s.getAttribute('aria-disabled') === 'true' }; }, c);
    await p.waitForTimeout(2500);
    r.entrou = await p.evaluate(() => { const a = document.getElementById('app'); return a && !a.hidden; });
    return r;
  });
  // sair volta ao login
  await step('sair', async () => {
    await p.waitForTimeout(1500);
    await p.click(c.menuBtn); await p.waitForTimeout(600);
    await p.locator(`${c.drawerPanel} button, ${c.drawerPanel} a`, { hasText: 'Sair' }).last().click(); await p.waitForTimeout(1500);
    return p.evaluate((c) => ({ loginVisivel: window.__m.vis(document.querySelector(c.loginEmail)), url: location.href }), c);
  });
  await ctx.close();

  // Telefone (segmento)
  const ctx2 = await newCtx(b, 'm390');
  const p2 = await openLogin(ctx2, site);
  await step('telefone', async () => {
    const lab = await p2.evaluate((c) => { const e = document.querySelector(c.segPhone); return e && e.labels && e.labels[0] ? true : false; }, c);
    if (lab) await p2.locator(`label[for="${c.segPhone.slice(1)}"]`).first().click().catch(async () => p2.click(c.segPhone, { force: true }));
    else await p2.click(c.segPhone, { force: true });
    await p2.waitForTimeout(400);
    return p2.evaluate(() => { const t = [...document.querySelectorAll('input[type=tel]')].find(window.__m.vis); return t ? { type: t.type, inputmode: t.inputMode, ac: t.autocomplete, h: t.getBoundingClientRect().height } : null; });
  });
  await shot(p2, 'm390-login-telefone');
  await ctx2.close();
  await b.close();
  fs.writeFileSync(`${DATA}/${site}-login.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
})();
