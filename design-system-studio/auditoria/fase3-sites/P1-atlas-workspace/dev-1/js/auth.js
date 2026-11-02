/* Sessão de demonstração + telas de entrar, cadastro e recuperação de senha.
   ATENÇÃO: autenticação simulada no navegador, apenas para demonstração. */
(function () {
  var A = window.Atlas;
  var u = A.u;

  /* ---------- Sessão ---------- */
  A.session = {
    get: function () {
      return u.store.get('session', null, false) || u.store.get('session', null, true);
    },
    start: function (user, remember) {
      u.store.del('session');
      u.store.set('session', user, !remember);
    },
    update: function (patch) {
      var s = this.get(); if (!s) return;
      Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
      var remembered = !!u.store.get('session', null, false);
      u.store.set('session', s, !remembered);
    },
    end: function () { u.store.del('session'); }
  };

  function accounts() { return u.store.get('accounts', [], false); }
  function findAccount(email) {
    var e = u.norm(email);
    var demo = A.data.demoAccount;
    if (u.norm(demo.email) === e) return { name: demo.name, email: demo.email, role: demo.role, hash: u.demoHash(u.store.get('demoPw', demo.password)) };
    return accounts().filter(function (a) { return u.norm(a.email) === e; })[0] || null;
  }

  /* ---------- Componentes compartilhados ---------- */
  function brand() {
    return '<a class="auth__brand" href="#/entrar"><span class="logo-mark" aria-hidden="true">' + A.icon('atlas', 18) + '</span><span class="brand-name">Atlas Workspace</span></a>';
  }
  function footer() {
    return '<footer class="auth__footer"><button type="button" class="link-btn" data-legal="termos">Termos de uso</button>' +
      '<button type="button" class="link-btn" data-legal="privacidade">Privacidade</button></footer>';
  }
  function shell(inner, after) {
    return '<div class="auth">' +
      '<main class="auth__main" id="main" tabindex="-1">' + brand() + inner + (after || '') + '</main>' + footer() + '</div>';
  }
  function emailRule(v) {
    if (!String(v).trim()) return 'Informe seu e-mail.';
    if (!u.validEmail(v)) return 'Digite um e-mail válido, como nome@empresa.com.';
    return '';
  }

  A.legal = function (kind) {
    var termos = kind === 'termos';
    A.modal({
      title: termos ? 'Termos de uso' : 'Política de privacidade',
      body: termos
        ? '<p>Este é um texto de demonstração dos Termos de uso do Atlas Workspace.</p><p>Ao criar uma conta, você concorda em usar o serviço de forma responsável, manter suas credenciais em sigilo e respeitar os direitos de outras pessoas do seu workspace.</p><p>O conteúdo definitivo deve ser fornecido pelo jurídico da empresa.</p>'
        : '<p>Este é um texto de demonstração da Política de privacidade.</p><p>Coletamos apenas os dados necessários para o funcionamento do serviço (nome, e-mail e dados de uso) e não os compartilhamos com terceiros sem consentimento.</p><p>Nesta demonstração, nenhum dado sai do seu navegador.</p>',
      foot: '<button type="button" class="btn btn--primary" data-close data-autofocus>Entendi</button>'
    });
  };
  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-legal]');
    if (l) { e.preventDefault(); A.legal(l.getAttribute('data-legal')); }
  });

  /* ---------- Entrar ---------- */
  function renderLogin(root, ctx) {
    root.innerHTML = shell(
      '<section class="auth-card" aria-labelledby="auth-title">' +
        '<h1 id="auth-title">Entrar na sua conta</h1>' +
        '<p class="auth-card__sub">Use seu e-mail e senha para continuar.</p>' +
        '<div class="form-summary" role="alert" data-summary></div>' +
        '<form class="auth-form" novalidate>' +
          '<div class="field">' +
            '<label class="field__label" for="login-email">E-mail</label>' +
            '<input class="input" id="login-email" name="email" type="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" required aria-describedby="login-email-msg" placeholder="nome@empresa.com">' +
            '<p class="field__msg" id="login-email-msg" data-msg-for="email"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label class="field__label" for="login-password">Senha</label>' +
            '<div class="input-wrap"><input class="input" id="login-password" name="password" type="password" autocomplete="current-password" required aria-describedby="login-password-msg">' + A.forms.pwToggle('login-password') + '</div>' +
            '<p class="field__msg" id="login-password-msg" data-msg-for="password"></p>' +
          '</div>' +
          '<div class="auth-row">' +
            '<label class="check"><input type="checkbox" name="remember"> Lembrar de mim</label>' +
            '<a href="#/recuperar-senha">Esqueci minha senha</a>' +
          '</div>' +
          '<button class="btn btn--primary btn--block btn--lg" type="submit">Entrar</button>' +
        '</form>' +
      '</section>',
      '<p class="auth__alt">Não tem conta? <a href="#/cadastro">Criar conta</a></p>' +
      '<p class="auth__demo">Demonstração: use <code>marina@atlas.app</code> e a senha <code>atlas1234</code>, ou crie uma conta.</p>'
    );

    var form = root.querySelector('form');
    var btn = form.querySelector('[type="submit"]');
    A.forms.bind(form, {
      email: { label: 'E-mail', validate: emailRule },
      password: { label: 'Senha', validate: function (v) { return v ? '' : 'Informe sua senha.'; } }
    }, {
      summary: root.querySelector('[data-summary]'),
      onSubmit: function (f, api) {
        A.forms.busy(f, btn, true, 'Entrando…');
        u.wait(900).then(function () {
          var acc = findAccount(f.elements.email.value);
          var ok = acc && acc.hash === u.demoHash(f.elements.password.value);
          if (!ok) {
            A.forms.busy(f, btn, false);
            api.showError('<p class="msg__title">E-mail ou senha incorretos.</p><p>Confira os dados e tente novamente.</p>');
            return;
          }
          A.session.start({ name: acc.name, email: acc.email, role: acc.role || 'Membro da equipe' }, f.elements.remember.checked);
          var next = ctx.query.next ? decodeURIComponent(ctx.query.next) : '#/inicio';
          location.hash = next.indexOf('#/') === 0 ? next : '#/inicio';
        });
      }
    });
    var h1 = root.querySelector('h1');
    return h1;
  }

  /* ---------- Cadastro ---------- */
  function renderSignup(root) {
    root.innerHTML = shell(
      '<section class="auth-card" aria-labelledby="auth-title">' +
        '<h1 id="auth-title">Crie sua conta</h1>' +
        '<p class="auth-card__sub">Leva menos de um minuto. Sem cartão de crédito.</p>' +
        '<div class="form-summary" role="alert" data-summary></div>' +
        '<form class="auth-form" novalidate>' +
          '<div class="field">' +
            '<label class="field__label" for="su-name">Nome completo</label>' +
            '<input class="input" id="su-name" name="name" type="text" autocomplete="name" required aria-describedby="su-name-msg">' +
            '<p class="field__msg" id="su-name-msg" data-msg-for="name"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label class="field__label" for="su-email">E-mail</label>' +
            '<input class="input" id="su-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required aria-describedby="su-email-msg" placeholder="nome@empresa.com">' +
            '<p class="field__msg" id="su-email-msg" data-msg-for="email"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label class="field__label" for="su-password">Senha</label>' +
            '<div class="input-wrap"><input class="input" id="su-password" name="password" type="password" autocomplete="new-password" required aria-describedby="su-password-msg su-strength">' + A.forms.pwToggle('su-password') + '</div>' +
            '<p class="field__msg" id="su-password-msg" data-msg-for="password"></p>' +
            A.forms.strengthHTML('su-strength') +
          '</div>' +
          '<div class="field">' +
            '<label class="field__label" for="su-confirm">Confirmar senha</label>' +
            '<div class="input-wrap"><input class="input" id="su-confirm" name="confirm" type="password" autocomplete="new-password" required aria-describedby="su-confirm-msg">' + A.forms.pwToggle('su-confirm') + '</div>' +
            '<p class="field__msg" id="su-confirm-msg" data-msg-for="confirm"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label class="check terms"><input type="checkbox" id="su-terms" name="terms" required aria-describedby="su-terms-msg"> <span>Li e aceito os <button type="button" class="link-btn" data-legal="termos">Termos de uso</button> e a <button type="button" class="link-btn" data-legal="privacidade">Política de privacidade</button>.</span></label>' +
            '<p class="field__msg" id="su-terms-msg" data-msg-for="terms"></p>' +
          '</div>' +
          '<button class="btn btn--primary btn--block btn--lg" type="submit">Criar conta</button>' +
        '</form>' +
      '</section>',
      '<p class="auth__alt">Já tem conta? <a href="#/entrar">Entrar</a></p>'
    );

    var form = root.querySelector('form');
    var btn = form.querySelector('[type="submit"]');
    A.forms.bindStrength(form.elements.password, root.querySelector('#su-strength'));
    A.forms.bind(form, {
      name: { label: 'Nome completo', validate: function (v) {
        v = String(v).trim();
        if (!v) return 'Informe seu nome completo.';
        if (v.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
        return '';
      } },
      email: { label: 'E-mail', validate: emailRule },
      password: { label: 'Senha', validate: A.forms.validNewPassword, dependents: ['confirm'] },
      confirm: { label: 'Confirmar senha', validate: function (v, f) {
        if (!v) return 'Repita a senha.';
        if (v !== f.elements.password.value) return 'As senhas não coincidem.';
        return '';
      } },
      terms: { label: 'Termos', validate: function (v) { return v ? '' : 'Aceite os Termos de uso e a Política de privacidade para continuar.'; } }
    }, {
      summary: root.querySelector('[data-summary]'),
      liveAfterSubmit: ['confirm'],
      onSubmit: function (f, api) {
        A.forms.busy(f, btn, true, 'Criando conta…');
        u.wait(1000).then(function () {
          A.forms.busy(f, btn, false);
          var email = f.elements.email.value.trim();
          if (findAccount(email)) {
            // mensagem neutra: não confirma se o e-mail existe
            api.showError('<p class="msg__title">Não foi possível concluir o cadastro com este e-mail.</p>' +
              '<p>Se você já tem uma conta, <a href="#/entrar">entre</a> ou <a href="#/recuperar-senha">recupere sua senha</a>.</p>', 'info');
            return;
          }
          var list = accounts();
          var name = f.elements.name.value.trim().replace(/\s+/g, ' ');
          list.push({ name: name, email: email, role: 'Membro da equipe', hash: u.demoHash(f.elements.password.value) });
          u.store.set('accounts', list);
          A.session.start({ name: name, email: email, role: 'Membro da equipe' }, false);
          location.hash = '#/inicio';
          setTimeout(function () { A.toast('Conta criada. Boas-vindas, ' + name.split(' ')[0] + '!'); }, 300);
        });
      }
    });
    return root.querySelector('h1');
  }

  /* ---------- Recuperar senha ---------- */
  function renderRecover(root) {
    root.innerHTML = shell(
      '<section class="auth-card" aria-labelledby="auth-title">' +
        '<a class="auth__back" href="#/entrar">' + A.icon('chevronLeft', 18) + 'Voltar para entrar</a>' +
        '<h1 id="auth-title">Recuperar senha</h1>' +
        '<p class="auth-card__sub" data-sub>Informe o e-mail da sua conta. Enviaremos um link e um código para criar uma nova senha.</p>' +
        '<div class="form-summary" role="alert" data-summary></div>' +
        '<div class="form-status" role="status" data-status></div>' +
        '<form class="auth-form" novalidate data-step="1">' +
          '<div class="field">' +
            '<label class="field__label" for="rc-email">E-mail</label>' +
            '<input class="input" id="rc-email" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" required aria-describedby="rc-email-msg" placeholder="nome@empresa.com">' +
            '<p class="field__msg" id="rc-email-msg" data-msg-for="email"></p>' +
          '</div>' +
          '<button class="btn btn--primary btn--block btn--lg" type="submit">Enviar link de recuperação</button>' +
        '</form>' +
      '</section>',
      '<p class="auth__alt">Lembrou a senha? <a href="#/entrar">Entrar</a></p>'
    );

    var card = root.querySelector('.auth-card');
    var form = card.querySelector('form');
    var btn = form.querySelector('[type="submit"]');
    var status = card.querySelector('[data-status]');
    var email = '';

    A.forms.bind(form, { email: { label: 'E-mail', validate: emailRule } }, {
      summary: card.querySelector('[data-summary]'),
      onSubmit: function (f) {
        A.forms.busy(f, btn, true, 'Enviando…');
        u.wait(900).then(function () {
          email = f.elements.email.value.trim();
          step2();
        });
      }
    });

    function step2() {
      card.querySelector('[data-sub]').textContent = 'Digite o código recebido e escolha uma nova senha.';
      status.innerHTML = '<div class="msg msg--info" style="margin-top:20px">' + A.icon('info', 20) +
        '<div><p class="msg__title">Se o e-mail existir, enviaremos um link.</p><p>Confira também a caixa de spam. Na demonstração, qualquer código de 6 dígitos funciona.</p></div></div>';
      var f2 = document.createElement('form');
      f2.className = 'auth-form';
      f2.noValidate = true;
      f2.innerHTML =
        '<div class="field">' +
          '<label class="field__label" for="rc-code">Código de verificação</label>' +
          '<input class="input" id="rc-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required aria-describedby="rc-code-hint rc-code-msg">' +
          '<p class="field__hint" id="rc-code-hint">6 dígitos, enviados para o seu e-mail.</p>' +
          '<p class="field__msg" id="rc-code-msg" data-msg-for="code"></p>' +
        '</div>' +
        '<div class="field">' +
          '<label class="field__label" for="rc-password">Nova senha</label>' +
          '<div class="input-wrap"><input class="input" id="rc-password" name="password" type="password" autocomplete="new-password" required aria-describedby="rc-password-msg rc-strength">' + A.forms.pwToggle('rc-password') + '</div>' +
          '<p class="field__msg" id="rc-password-msg" data-msg-for="password"></p>' +
          A.forms.strengthHTML('rc-strength') +
        '</div>' +
        '<div class="field">' +
          '<label class="field__label" for="rc-confirm">Confirmar nova senha</label>' +
          '<div class="input-wrap"><input class="input" id="rc-confirm" name="confirm" type="password" autocomplete="new-password" required aria-describedby="rc-confirm-msg">' + A.forms.pwToggle('rc-confirm') + '</div>' +
          '<p class="field__msg" id="rc-confirm-msg" data-msg-for="confirm"></p>' +
        '</div>' +
        '<button class="btn btn--primary btn--block btn--lg" type="submit">Redefinir senha</button>' +
        '<div class="auth-row"><button type="button" class="link-btn" data-other>Usar outro e-mail</button></div>';
      form.replaceWith(f2);
      var b2 = f2.querySelector('[type="submit"]');
      A.forms.bindStrength(f2.elements.password, f2.querySelector('#rc-strength'));
      A.forms.bind(f2, {
        code: { label: 'Código', validate: function (v) { return /^\d{6}$/.test(String(v).trim()) ? '' : 'Digite os 6 dígitos do código.'; } },
        password: { label: 'Nova senha', validate: A.forms.validNewPassword, dependents: ['confirm'] },
        confirm: { label: 'Confirmar nova senha', validate: function (v, f) { if (!v) return 'Repita a nova senha.'; return v === f.elements.password.value ? '' : 'As senhas não coincidem.'; } }
      }, {
        summary: card.querySelector('[data-summary]'),
        liveAfterSubmit: ['confirm'],
        onSubmit: function (f) {
          A.forms.busy(f, b2, true, 'Redefinindo…');
          u.wait(900).then(function () {
            var newHash = u.demoHash(f.elements.password.value);
            if (u.norm(email) === u.norm(A.data.demoAccount.email)) u.store.set('demoPw', f.elements.password.value);
            var list = accounts().map(function (a) { if (u.norm(a.email) === u.norm(email)) a.hash = newHash; return a; });
            u.store.set('accounts', list);
            status.innerHTML = '';
            card.querySelector('[data-sub]').textContent = 'Tudo certo.';
            var done = document.createElement('div');
            done.className = 'form-done';
            done.innerHTML = '<div class="msg msg--success" tabindex="-1">' + A.icon('circleCheck', 20) + '<div><p class="msg__title">Senha redefinida.</p><p>Use a nova senha para entrar na sua conta.</p></div></div>' +
              '<a class="btn btn--primary btn--block btn--lg" href="#/entrar">Ir para o login</a>';
            f.replaceWith(done);
            done.firstChild.focus();
          });
        }
      });
      f2.querySelector('[data-other]').addEventListener('click', function () { A.router.render(); });
      f2.elements.code.focus();
    }
    return root.querySelector('h1');
  }

  A.authScreens = { entrar: renderLogin, cadastro: renderSignup, 'recuperar-senha': renderRecover };
})();
