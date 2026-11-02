/* Telas de acesso: "Acesso corporativo" (id acesso-corporativo) e recuperação de senha.
   Demonstração: não há backend. Credenciais e SSO são simulados no front-end. */
(function (ns) {
  'use strict';
  var h = ns.h, svg = ns.svg;
  var SESSION_KEY = 'nexo-session';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isLoggedIn() { return ns.safeGet(SESSION_KEY) === '1'; }
  function login() { ns.safeSet(SESSION_KEY, '1'); }
  function logout() {
    try { window.sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignora */ }
  }

  function validateEmail(v) {
    if (!v.trim()) return 'Informe seu e-mail corporativo.';
    if (!EMAIL_RE.test(v.trim())) return 'Digite um e-mail válido, por exemplo nome@empresa.com.';
    return '';
  }

  function validatePassword(v) {
    if (!v) return 'Informe sua senha.';
    return '';
  }

  // Mensagem abaixo do campo com aria-invalid e aria-describedby.
  function setFieldError(input, errEl, msg) {
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errEl.id);
      input.classList.add('is-invalid');
      errEl.textContent = msg;
      errEl.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      input.classList.remove('is-invalid');
      errEl.textContent = '';
      errEl.hidden = true;
    }
  }

  function setAlert(box, msg) {
    box.textContent = msg || '';
    box.hidden = !msg;
  }

  function header() {
    return h('header', { class: 'auth-top' },
      h('div', { class: 'brand' },
        h('span', { class: 'logo-mark', 'aria-hidden': 'true', text: 'N' }),
        h('span', { class: 'brand-name', text: 'Nexo Capital' })),
      h('a', { class: 'auth-support', href: 'mailto:suporte-ti@nexo.example' }, 'Suporte de TI')
    );
  }

  function footer() {
    return h('footer', { class: 'auth-foot' },
      h('p', { class: 'auth-notice' }, svg('lock'), h('span', { text: 'Acesso monitorado. Uso restrito a colaboradores autorizados.' })));
  }

  function shell(main) {
    return h('div', { class: 'auth' }, header(), h('main', { class: 'auth-main', id: 'conteudo', tabindex: '-1' }, main), footer());
  }

  function fieldBlock(opts) {
    var err = h('p', { class: 'field-error', id: opts.id + '-erro', hidden: true, role: 'none' });
    var input = h('input', {
      id: opts.id, name: opts.id, class: 'input', type: opts.type, inputmode: opts.inputmode || null,
      autocomplete: opts.autocomplete, required: true, placeholder: opts.placeholder || null,
      onblur: function () { setFieldError(input, err, opts.validate(input.value)); },
      oninput: function () { if (input.getAttribute('aria-invalid') === 'true' && !opts.validate(input.value)) setFieldError(input, err, ''); }
    });
    return { input: input, err: err };
  }

  function renderLogin(root) {
    document.title = 'Acesso corporativo · Nexo Capital';

    var email = fieldBlock({ id: 'email', type: 'email', inputmode: 'email', autocomplete: 'username', validate: validateEmail, placeholder: 'nome@empresa.com' });
    var pwd = fieldBlock({ id: 'senha', type: 'password', autocomplete: 'current-password', validate: validatePassword });

    var alertBox = h('div', { class: 'form-alert', role: 'alert', hidden: true });
    var submit = h('button', { class: 'btn btn-primary btn-block btn-lg', type: 'submit' }, 'Entrar');
    var sso = h('button', { class: 'btn btn-primary btn-block btn-lg btn-sso', type: 'button' }, svg('key'), h('span', { text: 'Entrar com SSO da empresa' }));

    var toggle = h('button', { class: 'pwd-toggle', type: 'button', 'aria-label': 'Mostrar senha', 'aria-pressed': 'false' }, svg('eye'));
    toggle.addEventListener('click', function () {
      var show = pwd.input.type === 'password';
      pwd.input.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
      toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      toggle.replaceChildren(svg(show ? 'eyeOff' : 'eye'));
      pwd.input.focus();
    });

    function setBusy(btn, busy, label, idle) {
      btn.disabled = busy;
      btn.setAttribute('aria-busy', busy ? 'true' : 'false');
      btn.textContent = busy ? label : idle;
    }

    function finish(ok) {
      if (ok) {
        ns.login();
        window.location.hash = '#/app/painel/visao-geral';
        return;
      }
      setAlert(alertBox, 'E-mail ou senha incorretos');
      [email.input, pwd.input].forEach(function (i) { i.setAttribute('aria-invalid', 'true'); i.setAttribute('aria-describedby', 'form-alerta'); });
      alertBox.id = 'form-alerta';
      pwd.input.value = '';
      pwd.input.focus();
    }

    var form = h('form', { class: 'auth-form', novalidate: true, 'aria-label': 'Entrar com e-mail e senha' },
      alertBox,
      h('div', { class: 'field' },
        h('label', { for: 'email', class: 'label' }, 'E-mail corporativo'),
        email.input, email.err),
      h('div', { class: 'field' },
        h('div', { class: 'label-row' },
          h('label', { for: 'senha', class: 'label' }, 'Senha'),
          h('a', { class: 'link', href: '#/recuperar' }, 'Esqueci minha senha')),
        h('div', { class: 'input-wrap' }, pwd.input, toggle),
        pwd.err),
      submit
    );

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setAlert(alertBox, '');
      alertBox.id = 'form-alerta-resumo';
      var eMsg = validateEmail(email.input.value);
      var pMsg = validatePassword(pwd.input.value);
      setFieldError(email.input, email.err, eMsg);
      setFieldError(pwd.input, pwd.err, pMsg);
      if (eMsg || pMsg) {
        setAlert(alertBox, 'Corrija os campos destacados para continuar.');
        (eMsg ? email.input : pwd.input).focus();
        return;
      }
      setBusy(submit, true, 'Entrando…', 'Entrar');
      sso.disabled = true;
      window.setTimeout(function () {
        var ok = email.input.value.trim().toLowerCase() === ns.DEMO.email && pwd.input.value === ns.DEMO.password;
        setBusy(submit, false, '', 'Entrar');
        sso.disabled = false;
        finish(ok);
      }, 700);
    });

    sso.addEventListener('click', function () {
      setAlert(alertBox, '');
      setBusy(sso, true, 'Redirecionando…', 'Entrar com SSO da empresa');
      submit.disabled = true;
      // Simulação: em produção, o SSO (SAML 2.0 ou OpenID Connect) redireciona ao provedor da organização.
      window.setTimeout(function () {
        sso.disabled = false;
        setBusy(sso, false, '', 'Entrar com SSO da empresa');
        sso.replaceChildren(svg('key'), h('span', { text: 'Entrar com SSO da empresa' }));
        submit.disabled = false;
        login();
        window.location.hash = '#/app/painel/visao-geral';
      }, 800);
    });

    root.replaceChildren(shell(
      h('section', { class: 'auth-card', 'aria-labelledby': 'titulo-acesso' },
        h('h1', { id: 'titulo-acesso', class: 'auth-title' }, 'Acesso corporativo'),
        h('p', { class: 'auth-sub' }, 'Entre com a conta da sua organização.'),
        sso,
        h('div', { class: 'divider', role: 'separator' }, h('span', { text: 'ou' })),
        form
      )
    ));
  }

  function renderRecover(root) {
    document.title = 'Recuperar senha · Nexo Capital';
    var email = fieldBlock({ id: 'email', type: 'email', inputmode: 'email', autocomplete: 'username', validate: validateEmail, placeholder: 'nome@empresa.com' });
    var status = h('div', { class: 'form-status', role: 'status', hidden: true });
    var alertBox = h('div', { class: 'form-alert', role: 'alert', hidden: true });
    var submit = h('button', { class: 'btn btn-primary btn-block btn-lg', type: 'submit' }, 'Enviar link');

    var form = h('form', { class: 'auth-form', novalidate: true },
      alertBox,
      h('div', { class: 'field' },
        h('label', { for: 'email', class: 'label' }, 'E-mail corporativo'),
        email.input, email.err),
      submit
    );

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = validateEmail(email.input.value);
      setFieldError(email.input, email.err, msg);
      setAlert(alertBox, msg ? 'Corrija o campo destacado para continuar.' : '');
      if (msg) { email.input.focus(); return; }
      submit.disabled = true;
      submit.textContent = 'Enviando…';
      window.setTimeout(function () {
        submit.disabled = false;
        submit.textContent = 'Enviar link';
        status.textContent = 'Se o e-mail existir, enviaremos um link.';
        status.hidden = false;
      }, 600);
    });

    root.replaceChildren(shell(
      h('section', { class: 'auth-card', 'aria-labelledby': 'titulo-recuperar' },
        h('h1', { id: 'titulo-recuperar', class: 'auth-title' }, 'Recuperar senha'),
        h('p', { class: 'auth-sub' }, 'Informe o e-mail da sua conta para receber um link de redefinição.'),
        form,
        status,
        h('p', { class: 'auth-back' }, h('a', { class: 'link', href: '#/login' }, svg('arrowLeft'), h('span', { text: 'Voltar para entrar' })))
      )
    ));
  }

  ns.isLoggedIn = isLoggedIn;
  ns.login = login;
  ns.logout = logout;
  ns.renderLogin = renderLogin;
  ns.renderRecover = renderRecover;
})(window.NEXO = window.NEXO || {});
