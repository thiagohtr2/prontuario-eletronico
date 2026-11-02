/* Telas de autenticação (demonstração): entrar, cadastro, recuperação e páginas legais.
   Não há backend: a "conta" válida é a DEMO abaixo; qualquer outra combinação recebe erro genérico. */
(function () {
  'use strict';

  var A = window.Atlas;
  var icon = A.icon;
  var esc = A.esc;

  A.demo = {
    email: 'demo@atlas.app',
    password: 'demo1234',
    name: 'Ana Souza',
    role: 'Administradora',
    // e-mails "já cadastrados" para demonstrar a mensagem neutra no cadastro
    existing: ['ana@atlas.app', 'contato@atlas.app']
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function emailRule(el) {
    var v = el.value.trim();
    if (!v) return 'Informe seu e-mail.';
    if (!EMAIL_RE.test(v)) return 'Informe um e-mail válido, como nome@exemplo.com.';
    return '';
  }

  function brand() {
    return '<div class="brand brand--lg"><span class="brand__mark">' + icon('logo', { size: 22 }) + '</span>' +
      '<span>Atlas Workspace</span></div>';
  }

  function legalFooter() {
    return '<footer class="auth__legal"><a href="#/termos">Termos</a> · <a href="#/privacidade">Privacidade</a></footer>';
  }

  function eyeButton(target) {
    return '<button type="button" class="input-wrap__toggle" data-action="toggle-password" aria-label="Mostrar senha" aria-pressed="false" aria-controls="' + target + '">' +
      icon('eye', { size: 20 }) + '</button>';
  }

  /* ---------- Entrar ---------- */
  function loginHtml() {
    return '<main class="auth">' +
      '<div class="auth__stack">' +
        brand() +
        '<section class="auth__card" aria-labelledby="login-title">' +
          '<div class="auth__head">' +
            '<h1 id="login-title" class="auth__title">Entrar na sua conta</h1>' +
            '<p class="auth__sub">Use seu e-mail e senha para continuar.</p>' +
          '</div>' +
          '<div id="login-summary" class="alert alert--error" role="alert" hidden></div>' +
          '<form id="login-form" class="form-stack" novalidate>' +
            '<div class="field">' +
              '<label for="login-email">E-mail</label>' +
              '<input id="login-email" class="input" type="email" name="email" inputmode="email" autocomplete="username" autocapitalize="off" spellcheck="false" aria-describedby="login-email-error">' +
              '<p id="login-email-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="field">' +
              '<label for="login-password">Senha</label>' +
              '<div class="input-wrap">' +
                '<input id="login-password" class="input" type="password" name="password" autocomplete="current-password" aria-describedby="login-password-error">' +
                eyeButton('login-password') +
              '</div>' +
              '<p id="login-password-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="auth__row">' +
              '<label class="check"><input type="checkbox" id="login-remember" name="remember"><span>Lembrar de mim</span></label>' +
              '<a href="#/recuperar">Esqueci minha senha</a>' +
            '</div>' +
            '<button type="submit" class="btn btn--primary btn--block" id="login-submit">Entrar</button>' +
          '</form>' +
        '</section>' +
        '<p class="auth__switch">Não tem conta? <a href="#/cadastro">Criar conta</a></p>' +
      '</div>' +
      legalFooter() +
    '</main>';
  }

  function loginInit() {
    var form = document.getElementById('login-form');
    A.form.bind(form, {
      summary: 'login-summary',
      rules: {
        'login-email': emailRule,
        'login-password': function (el) { return el.value ? '' : 'Informe sua senha.'; }
      },
      onSubmit: function (v, f, api) {
        var remember = !!document.getElementById('login-remember').checked;
        var summary = document.getElementById('login-summary');
        api.busy(true, 'Entrando…');
        window.setTimeout(function () {
          var ok = v['login-email'].trim().toLowerCase() === A.demo.email &&
                   v['login-password'] === A.demo.password;
          if (!ok) {
            api.busy(false);
            // Mensagem genérica: não revela qual dos dois campos está errado
            A.form.showMessage(summary, 'E-mail ou senha incorretos.');
            return;
          }
          A.session.set({ name: A.demo.name, email: A.demo.email, role: A.demo.role }, remember);
          A.go('/app/inicio');
        }, 700);
      }
    });
  }

  /* ---------- Cadastro (página própria) ---------- */
  function strengthLevel(v) {
    if (!v) return 0;
    var score = 0;
    if (v.length >= 8) score++;
    if (/[A-Za-z]/.test(v) && /\d/.test(v)) score++;
    if (v.length >= 12 || (/[^A-Za-z0-9]/.test(v) && v.length >= 10)) score++;
    // qualquer senha digitada é pelo menos "Fraca"
    return Math.max(1, Math.min(score, 3));
  }

  var STRENGTH_LABEL = ['Não digitada', 'Fraca', 'Média', 'Forte'];

  function updateStrength(value) {
    var box = document.getElementById('signup-strength');
    if (!box) return;
    var level = strengthLevel(value);
    var bars = box.querySelectorAll('.pw-bars i');
    for (var i = 0; i < bars.length; i++) {
      bars[i].className = i < level ? 'on' : '';
    }
    box.querySelector('strong').textContent = STRENGTH_LABEL[level];
  }

  function signupHtml() {
    return '<main class="auth">' +
      '<div class="auth__stack">' +
        brand() +
        '<section class="auth__card" aria-labelledby="signup-title">' +
          '<div class="auth__head">' +
            '<h1 id="signup-title" class="auth__title">Crie sua conta</h1>' +
            '<p class="auth__sub">Leva menos de dois minutos. Depois você pode convidar sua equipe.</p>' +
          '</div>' +
          '<div id="signup-summary" class="alert alert--error" role="alert" hidden></div>' +
          '<div id="signup-notice" class="auth__notice" role="status" hidden></div>' +
          '<form id="signup-form" class="form-stack" novalidate>' +
            '<div class="field">' +
              '<label for="signup-name">Nome completo</label>' +
              '<input id="signup-name" class="input" type="text" name="name" autocomplete="name" aria-describedby="signup-name-error">' +
              '<p id="signup-name-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="field">' +
              '<label for="signup-email">E-mail</label>' +
              '<input id="signup-email" class="input" type="email" name="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" aria-describedby="signup-email-error">' +
              '<p id="signup-email-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="field">' +
              '<label for="signup-password">Senha</label>' +
              '<div class="input-wrap">' +
                '<input id="signup-password" class="input" type="password" name="new-password" autocomplete="new-password" aria-describedby="signup-password-hint signup-password-error">' +
                eyeButton('signup-password') +
              '</div>' +
              '<p id="signup-password-hint" class="field-hint">Mínimo de 8 caracteres, com letras e números.</p>' +
              '<div id="signup-strength" class="pw-meter" aria-live="polite">' +
                '<span class="pw-bars" aria-hidden="true"><i></i><i></i><i></i></span>' +
                '<span>Força da senha: <strong>Não digitada</strong></span>' +
              '</div>' +
              '<p id="signup-password-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="field">' +
              '<label for="signup-confirm">Confirmar senha</label>' +
              '<div class="input-wrap">' +
                '<input id="signup-confirm" class="input" type="password" name="new-password-confirm" autocomplete="new-password" aria-describedby="signup-confirm-error">' +
                eyeButton('signup-confirm') +
              '</div>' +
              '<p id="signup-confirm-error" class="field-error" hidden></p>' +
            '</div>' +
            '<div class="field">' +
              '<label class="check" for="signup-terms">' +
                '<input id="signup-terms" type="checkbox" name="terms" aria-describedby="signup-terms-error">' +
                '<span>Li e aceito os <a href="#/termos">Termos</a> e a <a href="#/privacidade">Privacidade</a>.</span>' +
              '</label>' +
              '<p id="signup-terms-error" class="field-error" hidden></p>' +
            '</div>' +
            '<button type="submit" class="btn btn--primary btn--block" id="signup-submit">Criar conta</button>' +
          '</form>' +
        '</section>' +
        '<p class="auth__switch">Já tem conta? <a href="#/entrar">Entrar</a></p>' +
      '</div>' +
      legalFooter() +
    '</main>';
  }

  function signupInit() {
    var form = document.getElementById('signup-form');
    var pw = document.getElementById('signup-password');

    pw.addEventListener('input', function () { updateStrength(pw.value); });

    A.form.bind(form, {
      summary: 'signup-summary',
      rules: {
        'signup-name': function (el) {
          var v = el.value.trim();
          if (!v) return 'Informe seu nome completo.';
          if (v.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';
          return '';
        },
        'signup-email': emailRule,
        'signup-password': function (el) {
          var v = el.value;
          if (!v) return 'Crie uma senha.';
          if (v.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
          if (!(/[A-Za-z]/.test(v) && /\d/.test(v))) return 'Use letras e números na senha.';
          return '';
        },
        'signup-confirm': function (el) {
          if (!el.value) return 'Confirme sua senha.';
          if (el.value !== document.getElementById('signup-password').value) return 'As senhas não coincidem.';
          return '';
        },
        'signup-terms': function (el) {
          return el.checked ? '' : 'Aceite os Termos e a Privacidade para continuar.';
        }
      },
      onSubmit: function (v, f, api) {
        var notice = document.getElementById('signup-notice');
        notice.hidden = true;
        notice.innerHTML = '';
        api.busy(true, 'Criando conta…');
        window.setTimeout(function () {
          var email = v['signup-email'].trim().toLowerCase();
          if (A.demo.existing.indexOf(email) !== -1) {
            api.busy(false);
            // Mensagem neutra: não confirma nem nega que o e-mail existe
            notice.className = 'auth__notice alert alert--info';
            notice.innerHTML = '<div>' + icon('mail', { size: 18 }) + '</div><div>' +
              '<p>Não foi possível criar a conta com estes dados. Se você já tem uma conta, entre ou recupere sua senha.</p>' +
              '<div class="alert__actions"><a class="btn btn--outline" href="#/entrar">Entrar</a>' +
              '<a class="btn btn--outline" href="#/recuperar">Recuperar senha</a></div></div>';
            notice.hidden = false;
            return;
          }
          A.session.set({ name: v['signup-name'].trim(), email: email, role: 'Membro' }, true);
          A.go('/app/inicio');
        }, 800);
      }
    });
  }

  /* ---------- Recuperação de senha ---------- */
  function recoverHtml() {
    return '<main class="auth">' +
      '<div class="auth__stack">' +
        brand() +
        '<section class="auth__card" aria-labelledby="recover-title">' +
          '<div class="auth__head">' +
            '<h1 id="recover-title" class="auth__title">Recuperar senha</h1>' +
            '<p class="auth__sub">Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.</p>' +
          '</div>' +
          '<div id="recover-status" role="status" hidden></div>' +
          '<form id="recover-form" class="form-stack" novalidate>' +
            '<div class="field">' +
              '<label for="recover-email">E-mail</label>' +
              '<input id="recover-email" class="input" type="email" name="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" aria-describedby="recover-email-error">' +
              '<p id="recover-email-error" class="field-error" hidden></p>' +
            '</div>' +
            '<button type="submit" class="btn btn--primary btn--block">Enviar link</button>' +
          '</form>' +
        '</section>' +
        '<p class="auth__switch"><a href="#/entrar">Voltar para entrar</a></p>' +
      '</div>' +
      legalFooter() +
    '</main>';
  }

  function recoverInit() {
    var form = document.getElementById('recover-form');
    A.form.bind(form, {
      summary: null,
      rules: { 'recover-email': emailRule },
      onSubmit: function (v, f, api) {
        var status = document.getElementById('recover-status');
        api.busy(true, 'Enviando…');
        window.setTimeout(function () {
          api.busy(false);
          // Mensagem neutra, igual para qualquer e-mail
          status.className = 'alert alert--info';
          status.innerHTML = '<div>' + icon('mail', { size: 18 }) + '</div><div><p>Se o e-mail existir, enviaremos um link.</p></div>';
          status.hidden = false;
        }, 700);
      }
    });
  }

  /* ---------- Páginas legais (placeholder de demonstração) ---------- */
  function legalPage(title, text) {
    return function () {
      return '<main class="auth">' +
        '<article class="auth__legal-page">' +
          '<h1 class="auth__title">' + esc(title) + '</h1>' +
          '<p>' + esc(text) + '</p>' +
          '<p>Este é um texto de demonstração. O conteúdo jurídico definitivo deve ser fornecido pelo cliente.</p>' +
          '<p><a class="btn btn--outline" href="#/entrar">Voltar para entrar</a></p>' +
        '</article>' +
      '</main>';
    };
  }

  A.register('/entrar', { kind: 'auth', title: 'Entrar', render: loginHtml, init: loginInit });
  A.register('/cadastro', { kind: 'auth', title: 'Criar conta', render: signupHtml, init: signupInit });
  A.register('/recuperar', { kind: 'auth', title: 'Recuperar senha', render: recoverHtml, init: recoverInit });
  A.register('/termos', { kind: 'auth', title: 'Termos de uso', render: legalPage('Termos de uso', 'Termos de uso do Atlas Workspace.') });
  A.register('/privacidade', { kind: 'auth', title: 'Privacidade', render: legalPage('Política de privacidade', 'Como tratamos os seus dados no Atlas Workspace.') });
})();
