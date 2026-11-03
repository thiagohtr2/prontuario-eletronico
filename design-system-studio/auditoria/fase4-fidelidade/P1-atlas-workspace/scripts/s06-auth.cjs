// Interações de login, recuperação e cadastro (desktop 1440x900).
const L = require('./lib.cjs');
const EXISTE = { 'dev-1': 'marina@atlas.app', 'dev-2': 'demo@atlas.com', 'dev-3': 'ana@atlas.app' };

const FIELDSTATE = () => {
  const out = [];
  document.querySelectorAll('form input:not([type=hidden])').forEach(i => {
    if (i.getBoundingClientRect().width === 0 && i.type !== 'checkbox') return;
    const ids = (i.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    const desc = ids.map(id => { const e = document.getElementById(id); return e && e.offsetParent !== null ? e.textContent.trim() : ''; }).filter(Boolean).join(' | ');
    const lab = i.id ? document.querySelector(`label[for="${i.id}"]`) : null;
    out.push({ type: i.type, name: i.name || i.id, invalid: i.getAttribute('aria-invalid'), desc: desc.slice(0, 120), label: lab ? lab.textContent.trim().slice(0, 40) : (i.closest('label') ? 'wrap' : null), ac: i.getAttribute('autocomplete'), im: i.getAttribute('inputmode'), value: i.type === 'checkbox' ? i.checked : i.value });
  });
  const alerts = [...document.querySelectorAll('[role=alert]')].filter(e => e.offsetParent !== null && e.textContent.trim()).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 200));
  const alertLinks = [...document.querySelectorAll('[role=alert] a')].filter(e => e.offsetParent !== null).length;
  return { fields: out, alerts, alertLinks };
};

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site]; const r = {};
    const { ctx, page } = await L.newPage(1440, 900);
    await page.goto(S.url + S.login); await page.waitForTimeout(600);
    // atributos
    r.attrs = await page.evaluate(() => {
      const e = document.querySelector('input[type=email]'); const p = document.querySelector('input[type=password]');
      const le = e.id && document.querySelector(`label[for="${e.id}"]`); const lp = p.id && document.querySelector(`label[for="${p.id}"]`);
      return { emailType: e.type, emailIM: e.getAttribute('inputmode'), emailAC: e.getAttribute('autocomplete'), pwdAC: p.getAttribute('autocomplete'), labelEmail: le && le.textContent.trim(), labelPwd: lp && lp.textContent.trim() };
    });
    // 1. envio vazio
    await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(500);
    r.empty = await page.evaluate(FIELDSTATE);
    await page.screenshot({ path: L.shot(`${site}-login-erros-vazio.png`) });
    // 2. blur
    await page.goto(S.url + S.login); await page.reload(); await page.waitForTimeout(500);
    await page.fill('input[type=email]', 'abc'); await page.keyboard.press('Tab'); await page.waitForTimeout(400);
    r.blur = await page.evaluate(FIELDSTATE);
    // 3. credenciais erradas
    await page.fill('input[type=email]', 'alguem@exemplo.com'); await page.fill('input[type=password]', 'senhaerrada1');
    await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(2500);
    r.wrong = await page.evaluate(() => ({ alerts: [...document.querySelectorAll('[role=alert], .alert, [class*=error], [class*=summary]')].filter(e => e.offsetParent !== null && e.textContent.trim()).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 120)), errColor: (() => { const e = [...document.querySelectorAll('[role=alert]')].find(x => x.offsetParent !== null); if (!e) return null; const s = getComputedStyle(e); return { color: s.color, bg: s.backgroundColor, border: s.borderLeftColor }; })() }));
    await page.screenshot({ path: L.shot(`${site}-login-erro-credenciais.png`) });
    // 4. mostrar senha
    const tog = page.locator('form button[aria-label*="senha" i]').first();
    const pre = await tog.evaluate(b => ({ label: b.getAttribute('aria-label'), pressed: b.getAttribute('aria-pressed') })).catch(() => null);
    await tog.click().catch(() => {}); await page.waitForTimeout(200);
    const post = await tog.evaluate(b => ({ label: b.getAttribute('aria-label'), pressed: b.getAttribute('aria-pressed'), type: (b.closest('div,label,span').querySelector('input') || {}).type, inside: (() => { const i = b.parentElement.querySelector('input') || b.closest('div').querySelector('input'); if (!i) return null; const bi = i.getBoundingClientRect(), bb = b.getBoundingClientRect(); return bb.x >= bi.x && bb.right <= bi.right + 1 && bb.y >= bi.y - 1 && bb.bottom <= bi.bottom + 1; })() })).catch(() => null);
    r.toggle = { pre, post };
    // 5. carregando
    await page.goto(S.url + S.login); await page.reload(); await page.waitForTimeout(500);
    await page.fill('input[type=email]', S.email); await page.fill('input[type=password]', S.senha);
    const btn = page.locator('button[type=submit]').first();
    await btn.click();
    await page.waitForTimeout(60);
    r.loading = await page.evaluate(() => { const b = document.querySelector('button[type=submit]'); return b ? { text: b.innerText.trim(), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', busy: b.getAttribute('aria-busy') } : 'já saiu'; });
    await page.waitForTimeout(2500);
    r.afterLogin = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('h1') || {}).textContent }));
    // logout para limpar
    await ctx.close();
    // 6. recuperação
    {
      const { ctx, page } = await L.newPage(1440, 900);
      await page.goto(S.url + S.login); await page.waitForTimeout(500);
      const link = page.getByText(/esqueci/i).first();
      r.recLinkNearPwd = await link.evaluate(a => { const p = document.querySelector('input[type=password]').getBoundingClientRect(); const b = a.getBoundingClientRect(); return Math.round(Math.abs(b.y - p.y)); });
      await link.click(); await page.waitForTimeout(800);
      r.rec = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('h1,h2') || {}).textContent, hasEmail: !!document.querySelector('input[type=email]') }));
      await page.fill('input[type=email]', 'qualquer@exemplo.com');
      await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(2500);
      r.recMsg = await page.evaluate(() => document.querySelector('main, #root, #app, body').innerText.replace(/\s+/g, ' ').match(/[^.]*se (o|este|esse) e-?mail[^.]*\.?/i)?.[0] || document.body.innerText.replace(/\s+/g, ' ').slice(0, 300));
      await page.screenshot({ path: L.shot(`${site}-recuperacao-enviada.png`) });
      await ctx.close();
    }
    // 7. cadastro
    {
      const { ctx, page } = await L.newPage(1440, 900);
      await page.goto(S.url + S.cadastro); await page.waitForTimeout(600);
      r.cadAttrs = await page.evaluate(FIELDSTATE);
      r.cadOrder = await page.evaluate(() => [...document.querySelectorAll('form label')].filter(l => l.offsetParent !== null).map(l => l.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)));
      // blur no nome vazio
      const name = page.locator('form input:not([type=email]):not([type=password]):not([type=checkbox])').first();
      await name.focus(); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
      await name.fill('A'); await name.fill(''); await page.keyboard.press('Tab'); await page.waitForTimeout(300);
      r.cadBlur = (await page.evaluate(FIELDSTATE)).fields.slice(0, 2);
      // envio vazio
      await page.locator('form button[type=submit]').first().click(); await page.waitForTimeout(500);
      r.cadEmpty = await page.evaluate(FIELDSTATE);
      await page.screenshot({ path: L.shot(`${site}-cadastro-erros-vazio.png`), fullPage: true });
      // força da senha
      const pw = page.locator('form input[type=password]').nth(0); const pw2 = page.locator('form input[type=password]').nth(1);
      const strength = [];
      for (const v of ['abc', 'abcdefg1', 'Abcdefg1', 'Abcdefg1!xyz']) { await pw.fill(v); await page.waitForTimeout(250); strength.push([v, await page.evaluate(() => (document.body.innerText.match(/(fraca|média|media|forte|muito forte)/i) || [''])[0])]); }
      r.strength = strength;
      // não coincidem (tempo real após o primeiro envio)
      await pw.fill('Abcdefg1!xyz'); await pw2.fill('Abcdefg1!xy'); await page.waitForTimeout(400);
      r.mismatch = await page.evaluate(() => /senhas não coincidem/i.test(document.body.innerText));
      // toggles independentes
      const togs = page.locator('form button[aria-label*="senha" i]');
      r.toggleCount = await togs.count();
      if (r.toggleCount >= 2) { await togs.nth(0).click(); await page.waitForTimeout(200); r.toggleIndep = await page.evaluate(() => [...document.querySelectorAll('form input')].filter(i => /password|senha|confirm/i.test(i.name + i.id + i.autocomplete)).map(i => i.type)); }
      // e-mail existente + termos
      await page.goto(S.url + S.cadastro); await page.reload(); await page.waitForTimeout(600);
      await name.fill('Teste Auditoria'); await page.fill('form input[type=email]', EXISTE[site]);
      await page.locator('form input[type=password]').nth(0).fill('Abcdefg1!xyz'); await page.locator('form input[type=password]').nth(1).fill('Abcdefg1!xyz');
      await page.locator('form button[type=submit]').first().click(); await page.waitForTimeout(600);
      r.termsRequired = await page.evaluate(() => { const c = document.querySelector('form input[type=checkbox]'); return { invalid: c && c.getAttribute('aria-invalid'), stillHere: !!document.querySelector('form input[type=password]'), alerts: [...document.querySelectorAll('[role=alert]')].filter(e => e.offsetParent !== null).map(e => e.textContent.trim().slice(0, 120)) }; });
      r.valuesKept = await page.evaluate(() => [...document.querySelectorAll('form input:not([type=checkbox])')].map(i => !!i.value));
      await page.locator('form input[type=checkbox]').first().check({ force: true });
      await page.locator('form button[type=submit]').first().click(); await page.waitForTimeout(2800);
      r.existing = await page.evaluate(() => ({ hash: location.hash, text: document.body.innerText.replace(/\s+/g, ' ').match(/[^.]*(não foi possível|já tiver|já tem uma conta|verifique seu e-mail)[^.]*\.[^.]*\.?/i)?.[0] || null, links: [...document.querySelectorAll('a,button')].filter(e => e.offsetParent !== null && /^(entrar|recuperar senha|recupere sua senha|recuperar a senha)$/i.test(e.textContent.trim())).map(e => e.textContent.trim()) }));
      await page.screenshot({ path: L.shot(`${site}-cadastro-email-existente.png`), fullPage: true });
      // sucesso com e-mail novo
      await page.goto(S.url + S.cadastro); await page.reload(); await page.waitForTimeout(600);
      await name.fill('Nova Pessoa'); await page.fill('form input[type=email]', 'nova.pessoa.' + Date.now() + '@exemplo.com');
      await page.locator('form input[type=password]').nth(0).fill('Abcdefg1!xyz'); await page.locator('form input[type=password]').nth(1).fill('Abcdefg1!xyz');
      await page.locator('form input[type=checkbox]').first().check({ force: true });
      await page.locator('form button[type=submit]').first().click(); await page.waitForTimeout(3000);
      r.success = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('h1') || {}).textContent, msg: document.body.innerText.replace(/\s+/g, ' ').slice(0, 160) }));
      await page.screenshot({ path: L.shot(`${site}-cadastro-sucesso.png`) });
      await ctx.close();
    }
    res[site] = r;
    console.log('ok', site);
  }
  L.saveJSON('s06-auth.json', res);
  await L.close();
})();
