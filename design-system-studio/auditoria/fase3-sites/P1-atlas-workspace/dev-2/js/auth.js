/* Telas de entrada: login (clássico central), cadastro, recuperação e páginas legais.
   Autenticação SIMULADA no navegador — demonstração visual. Uma implementação real exige backend seguro
   (hash Argon2id/bcrypt, rate limit, cookie httpOnly+Secure+SameSite, CSRF, HTTPS). */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { esc, icon, forms } = A;
  const D = A.data;

  // ---------------- sessão e contas (somente demonstração) ----------------
  const USERS_KEY = 'atlas.users';
  const SESSION_KEY = 'atlas.session';

  A.auth = {
    user() { return A.session.get(SESSION_KEY, null); },
    isAuthed() { return !!A.auth.user(); },
    signIn(u) { A.session.set(SESSION_KEY, u); },
    signOut() { A.session.remove(SESSION_KEY); },
    async check(email, password) {
      email = email.trim().toLowerCase();
      if (email === D.demoUser.email && password === D.demoUser.password) {
        return { name: D.demoUser.name, email, role: D.demoUser.role };
      }
      const users = A.store.get(USERS_KEY, {});
      const u = users[email];
      if (u && u.hash === (await A.hash(password))) return { name: u.name, email, role: 'Membro da equipe' };
      return null;
    },
    emailExists(email) {
      email = email.trim().toLowerCase();
      return email === D.demoUser.email || !!A.store.get(USERS_KEY, {})[email];
    },
    async register(name, email, password) {
      email = email.trim().toLowerCase();
      if (A.auth.emailExists(email)) return false;
      const users = A.store.get(USERS_KEY, {});
      users[email] = { name: name.trim(), hash: await A.hash(password) };
      A.store.set(USERS_KEY, users);
      return true;
    },
  };

  // ---------------- composição visual comum ----------------
  function brandHTML() {
    return `<a class="brand" href="#/login" aria-label="${esc(D.brand.name)} — ir para a tela de entrar">
      <span class="brand__mark" aria-hidden="true">${D.brand.mark}</span><span class="brand__name">${esc(D.brand.name)}</span></a>`;
  }

  function shell({ cardHTML, belowHTML = '' }) {
    return `
      <div class="auth">
        <div class="auth__main">
          ${brandHTML()}
          <main class="auth-card" id="main" tabindex="-1">${cardHTML}</main>
          ${belowHTML}
        </div>
        <footer class="auth-foot" aria-label="Links legais">
          <a href="#/termos">Termos de uso</a><a href="#/privacidade">Política de privacidade</a>
        </footer>
      </div>`;
  }

  // ---------------- requisitos e força da senha ----------------
  const REQS = [
    { id: 'len', label: 'Mínimo de 8 caracteres', test: (p) => p.length >= 8 },
    { id: 'case', label: 'Letras maiúsculas e minúsculas', test: (p) => /[a-zà-ÿ]/.test(p) && /[A-ZÀ-Ý]/.test(p) },
    { id: 'num', label: 'Pelo menos um número', test: (p) => /\d/.test(p) },
    { id: 'sym', label: 'Um símbolo, como ! ou @ (recomendado)', test: (p) => /[^A-Za-z0-9À-ÿ]/.test(p), optional: true },
  ];
  function strength(p) {
    if (!p) return 0;
    const score = (p.length >= 8) + (p.length >= 12) + REQS[1].test(p) + REQS[2].test(p) + REQS[3].test(p);
    return score <= 2 ? 1 : score <= 4 ? 2 : 3;
  }
  const STRENGTH_TXT = ['', 'Fraca', 'Média', 'Forte'];
  function passwordOk(p) { return REQS.filter((r) => !r.optional).every((r) => r.test(p)); }

  // ---------------- LOGIN ----------------
  function renderLogin(root) {
    const remembered = A.store.get('atlas.remember', '');
    const prefill = A.session.get('atlas.prefill', '') || remembered;
    A.session.remove('atlas.prefill');

    root.innerHTML = shell({
      cardHTML: `
        <div class="auth-card__head">
          <h1 class="auth-card__title">Entrar na sua conta</h1>
          <p class="auth-card__sub">Use seu e-mail e senha para continuar.</p>
        </div>
        <form class="auth-form" id="login-form" novalidate>
          <div id="login-summary" role="alert"></div>
          ${forms.fieldHTML({ id: 'lg-email', name: 'email', label: 'E-mail', type: 'email', inputmode: 'email', autocomplete: 'username', required: true, value: prefill, placeholder: 'voce@empresa.com' })}
          ${forms.fieldHTML({ id: 'lg-pass', name: 'password', label: 'Senha', type: 'password', autocomplete: 'current-password', required: true, toggle: true })}
          <div class="auth-row">
            <label class="check" for="lg-remember"><input type="checkbox" id="lg-remember" name="remember" ${remembered ? 'checked' : ''}><span class="check__text">Lembrar de mim</span></label>
            <a class="auth-link" href="#/recuperar" id="lg-forgot">Esqueci minha senha</a>
          </div>
          <button type="submit" class="btn btn--primary btn--block" id="lg-submit">Entrar</button>
        </form>`,
      belowHTML: `
        <p class="auth-alt">Não tem conta? <a href="#/cadastro">Criar conta</a></p>
        <p class="auth-demo">Demonstração: <code>${esc(D.demoUser.email)}</code> · senha <code>${esc(D.demoUser.password)}</code></p>`,
    });

    const form = A.$('#login-form', root);
    forms.bindPasswordToggles(form);
    const api = forms.bind(form, {
      summary: A.$('#login-summary', root),
      loadingText: 'Entrando…',
      rules: {
        email: (v) => (!v.trim() ? 'Informe seu e-mail' : !forms.EMAIL_RE.test(v.trim()) ? 'Informe um e-mail válido, como nome@empresa.com' : ''),
        password: (v) => (!v ? 'Informe sua senha' : ''),
      },
      onSubmit: async (v, ctx) => {
        await A.sleep(900);
        const user = await A.auth.check(v.email, v.password);
        if (!user) {
          ctx.setLoading(false);
          // mensagem genérica: não revela qual dos dois está errado
          ctx.showAlert('E-mail ou senha incorretos');
          const pw = ctx.ctl('password');
          pw.focus();
          pw.select();
          return;
        }
        if (ctx.ctl('remember').checked) A.store.set('atlas.remember', user.email); else A.store.remove('atlas.remember');
        A.auth.signIn(user);
        const next = A.session.get('atlas.next', '') || '/painel';
        A.session.remove('atlas.next');
        location.hash = '#' + next;
      },
    });
    return () => api.reset();
  }

  // ---------------- CADASTRO ----------------
  function renderSignup(root) {
    root.innerHTML = shell({
      cardHTML: `
        <div data-view="form">
          <div class="auth-card__head">
            <h1 class="auth-card__title">Crie sua conta</h1>
            <p class="auth-card__sub">Leva menos de um minuto para começar.</p>
          </div>
          <form class="auth-form" id="signup-form" novalidate>
            <div id="signup-summary" role="alert"></div>
            ${forms.fieldHTML({ id: 'su-name', name: 'name', label: 'Nome completo', autocomplete: 'name', required: true })}
            ${forms.fieldHTML({ id: 'su-email', name: 'email', label: 'E-mail', type: 'email', inputmode: 'email', autocomplete: 'email', required: true, placeholder: 'voce@empresa.com' })}
            <div class="field" data-field-group>
              ${forms.fieldHTML({ id: 'su-pass', name: 'password', label: 'Senha', type: 'password', autocomplete: 'new-password', required: true, toggle: true, hint: 'Use uma senha única, que você não usa em outros sites.' })}
              <div class="strength" id="su-strength" data-level="0" style="margin-top:12px">
                <div class="strength__bar" aria-hidden="true"><i></i><i></i><i></i></div>
                <p class="strength__text" id="su-strength-text" aria-live="polite">Força da senha: —</p>
                <ul class="reqs" aria-label="Requisitos da senha">
                  ${REQS.map((r) => `<li data-req="${r.id}">${icon('circle')}<span>${esc(r.label)}</span></li>`).join('')}
                </ul>
              </div>
            </div>
            ${forms.fieldHTML({ id: 'su-confirm', name: 'confirm', label: 'Confirmar senha', type: 'password', autocomplete: 'new-password', required: true, toggle: true })}
            ${forms.checkHTML({ id: 'su-terms', name: 'terms', required: true, html: 'Li e aceito os <a href="#/termos" target="_blank" rel="noopener">Termos de uso</a> e a <a href="#/privacidade" target="_blank" rel="noopener">Política de privacidade</a>.' })}
            <button type="submit" class="btn btn--primary btn--block" id="su-submit">Criar conta</button>
          </form>
        </div>
        <div data-view="result" hidden>
          <div class="auth-result" role="status">
            <span class="auth-result__icon">${icon('mail')}</span>
            <div class="auth-card__head" style="margin:0">
              <h1 class="auth-card__title" id="su-result-title" tabindex="-1">Verifique seu e-mail</h1>
              <p class="auth-card__sub">Enviamos as instruções para o endereço informado. Se esse e-mail já tiver uma conta, você pode entrar ou recuperar a senha.</p>
            </div>
            <div class="auth-result__actions">
              <a class="btn btn--primary btn--block" href="#/login" id="su-go-login">Entrar</a>
              <a class="btn btn--secondary btn--block" href="#/recuperar" id="su-go-recover">Recuperar senha</a>
              <button type="button" class="btn btn--ghost btn--block" id="su-back">Voltar e revisar os dados</button>
            </div>
          </div>
        </div>`,
      belowHTML: `<p class="auth-alt">Já tem conta? <a href="#/login">Entrar</a></p>`,
    });

    const form = A.$('#signup-form', root);
    forms.bindPasswordToggles(form);
    const pass = A.$('#su-pass', root);
    const box = A.$('#su-strength', root);
    const txt = A.$('#su-strength-text', root);

    function updateStrength() {
      const p = pass.value;
      const lv = strength(p);
      box.dataset.level = String(lv);
      txt.textContent = 'Força da senha: ' + (lv ? STRENGTH_TXT[lv] : '—');
      REQS.forEach((r) => {
        const li = A.$(`[data-req="${r.id}"]`, box);
        const ok = r.test(p);
        li.classList.toggle('is-ok', ok);
        li.querySelector('svg').outerHTML = icon(ok ? 'check' : 'circle');
        li.querySelector('span').setAttribute('data-state', ok ? 'ok' : 'pending');
      });
    }
    pass.addEventListener('input', updateStrength);

    const api = forms.bind(form, {
      summary: A.$('#signup-summary', root),
      loadingText: 'Criando conta…',
      deps: { password: ['confirm'] },
      rules: {
        name: (v) => (!v.trim() ? 'Informe seu nome completo' : v.trim().split(/\s+/).length < 2 ? 'Informe nome e sobrenome' : ''),
        email: (v) => (!v.trim() ? 'Informe seu e-mail' : !forms.EMAIL_RE.test(v.trim()) ? 'Informe um e-mail válido, como nome@empresa.com' : ''),
        password: (v) => (!v ? 'Crie uma senha' : !passwordOk(v) ? 'A senha ainda não atende aos requisitos' : ''),
        confirm: (v, all) => (!v ? 'Confirme sua senha' : v !== all.password ? 'As senhas não coincidem' : ''),
        terms: (v) => (v ? '' : 'Aceite os Termos e a Política de Privacidade para continuar'),
      },
      onSubmit: async (v) => {
        await A.sleep(1000);
        // Resposta idêntica exista o e-mail ou não: não revela contas existentes.
        await A.auth.register(v.name, v.email, v.password);
        A.session.set('atlas.prefill', v.email.trim());
        A.$('[data-view="form"]', root).hidden = true;
        A.$('[data-view="result"]', root).hidden = false;
        A.$('#su-result-title', root).focus();
      },
    });
    A.$('#su-back', root).addEventListener('click', () => {
      A.$('[data-view="result"]', root).hidden = true;
      A.$('[data-view="form"]', root).hidden = false;
      A.$('#su-email', root).focus();
    });
    A.$('#su-go-recover', root).addEventListener('click', () => A.session.set('atlas.prefill', A.$('#su-email', root).value.trim()));
    return () => api.reset();
  }

  // ---------------- RECUPERAÇÃO ----------------
  function renderRecover(root) {
    const prefill = A.session.get('atlas.prefill', '');
    A.session.remove('atlas.prefill');
    root.innerHTML = shell({
      cardHTML: `
        <div data-view="form">
          <div class="auth-card__head">
            <h1 class="auth-card__title">Recuperar senha</h1>
            <p class="auth-card__sub">Informe seu e-mail para receber um link de redefinição.</p>
          </div>
          <form class="auth-form" id="rec-form" novalidate>
            <div id="rec-summary" role="alert"></div>
            ${forms.fieldHTML({ id: 'rc-email', name: 'email', label: 'E-mail', type: 'email', inputmode: 'email', autocomplete: 'email', required: true, value: prefill, placeholder: 'voce@empresa.com' })}
            <button type="submit" class="btn btn--primary btn--block">Enviar link</button>
          </form>
        </div>
        <div data-view="result" hidden>
          <div class="auth-result" role="status">
            <span class="auth-result__icon">${icon('mail')}</span>
            <div class="auth-card__head" style="margin:0">
              <h1 class="auth-card__title" id="rc-result-title" tabindex="-1">Verifique seu e-mail</h1>
              <p class="auth-card__sub">Se o e-mail existir, enviaremos um link para redefinir a senha.</p>
            </div>
            <div class="auth-result__actions">
              <a class="btn btn--primary btn--block" href="#/login">Voltar para entrar</a>
            </div>
          </div>
        </div>`,
      belowHTML: `<p class="auth-alt"><a href="#/login">‹ Voltar para entrar</a></p>`,
    });
    const form = A.$('#rec-form', root);
    const api = forms.bind(form, {
      summary: A.$('#rec-summary', root),
      loadingText: 'Enviando…',
      rules: { email: (v) => (!v.trim() ? 'Informe seu e-mail' : !forms.EMAIL_RE.test(v.trim()) ? 'Informe um e-mail válido, como nome@empresa.com' : '') },
      onSubmit: async () => {
        await A.sleep(900);
        A.$('[data-view="form"]', root).hidden = true;
        A.$('[data-view="result"]', root).hidden = false;
        A.$('#rc-result-title', root).focus();
      },
    });
    return () => api.reset();
  }

  // ---------------- PÁGINAS LEGAIS ----------------
  function renderLegal(root, kind) {
    const isTerms = kind === 'termos';
    root.innerHTML = shell({
      cardHTML: `
        <div class="auth-card__head">
          <h1 class="auth-card__title">${isTerms ? 'Termos de uso' : 'Política de privacidade'}</h1>
          <p class="auth-card__sub">Texto de demonstração, sem valor legal.</p>
        </div>
        <div class="legal">
          <h2>1. ${isTerms ? 'Sobre o serviço' : 'Quais dados coletamos'}</h2>
          <p>${isTerms ? 'O Atlas Workspace é um aplicativo de gestão de projetos, tarefas e equipe. Esta página existe apenas para demonstrar o fluxo de cadastro.' : 'Nome, e-mail e dados de uso necessários para operar a conta. Em uma versão real, esta seção descreveria cada categoria de dado.'}</p>
          <h2>2. ${isTerms ? 'Responsabilidades' : 'Como usamos os dados'}</h2>
          <p>${isTerms ? 'Mantenha suas credenciais em sigilo e use o serviço de acordo com a lei.' : 'Para autenticar você, enviar avisos do serviço e melhorar o produto.'}</p>
          <h2>3. Contato</h2>
          <p>Fale com a gente pela Central de Ajuda dentro do aplicativo.</p>
        </div>`,
      belowHTML: `<p class="auth-alt"><a href="#/login" id="legal-back">‹ Voltar</a></p>`,
    });
    A.$('#legal-back', root).addEventListener('click', (e) => {
      e.preventDefault();
      if (history.length > 1) history.back(); else location.hash = '#/login';
    });
  }

  A.authViews = { login: renderLogin, cadastro: renderSignup, recuperar: renderRecover, legal: renderLegal };
})();
