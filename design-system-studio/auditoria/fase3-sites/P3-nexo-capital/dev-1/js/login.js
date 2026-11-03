/* =========================================================
   Login "Acesso corporativo" (demonstração de interface).
   A autenticação real exige backend seguro (hash Argon2id/bcrypt,
   limitação de tentativas, cookie httpOnly+Secure+SameSite, CSRF, HTTPS).
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const $ = N.$;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const Login = {};
  let inited = false;
  let submitted = { login: false, recover: false };

  function setError(input, msg) {
    const err = document.getElementById(input.id + '-error');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
      err.innerHTML = N.icon('alert', { size: 16 }) + '<span>' + N.esc(msg) + '</span>';
      err.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      err.textContent = '';
      err.hidden = true;
    }
  }
  function validateEmail(input) {
    const v = input.value.trim();
    if (!v) return 'Informe seu e-mail corporativo.';
    if (!EMAIL_RE.test(v)) return 'Digite um e-mail válido, como nome@empresa.com.br.';
    return '';
  }
  function validatePassword(input) {
    return input.value ? '' : 'Informe sua senha.';
  }

  function showSummary(box, errors, generic) {
    if (!errors.length && !generic) { box.hidden = true; box.innerHTML = ''; return; }
    if (generic) {
      box.innerHTML = N.icon('alert') + '<div><p><strong>' + N.esc(generic) + '</strong></p><p>Verifique os dados e tente novamente.</p></div>';
    } else {
      box.innerHTML = N.icon('alert') + '<div><p><strong>' + (errors.length === 1 ? 'Corrija 1 campo para continuar:' : 'Corrija ' + errors.length + ' campos para continuar:') + '</strong></p><ul>' +
        errors.map((e) => '<li><a href="#' + e.input.id + '" data-focus="' + e.input.id + '">' + N.esc(e.msg) + '</a></li>').join('') + '</ul></div>';
    }
    box.hidden = false;
  }

  function bindField(input, validator, formKey) {
    input.addEventListener('input', () => {
      input.dataset.dirty = '1';
      if (input.getAttribute('aria-invalid') === 'true') {
        const msg = validator(input);
        if (!msg) setError(input, '');
      }
    });
    // Validação ao sair do campo (se o campo foi alterado ou após a primeira tentativa de envio)
    input.addEventListener('blur', () => {
      if (!input.dataset.dirty && !submitted[formKey]) return;
      setError(input, validator(input));
      // o resumo do topo só é refeito no envio, para não deslocar o botão sob o clique
    });
  }

  const forms = {};

  Login.init = function () {
    if (inited) return;
    inited = true;
    const email = $('#login-email');
    const pass = $('#login-password');
    const toggle = $('#toggle-password');
    const summary = $('#login-summary');
    const submit = $('#btn-login');
    const sso = $('#btn-sso');
    forms.login = { summary, fields: [{ input: email, validator: validateEmail }, { input: pass, validator: validatePassword }] };
    bindField(email, validateEmail, 'login');
    bindField(pass, validatePassword, 'login');

    toggle.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(show));
      toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      toggle.innerHTML = N.icon(show ? 'eyeOff' : 'eye');
    });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-focus]');
      if (!a) return;
      e.preventDefault();
      const el = document.getElementById(a.dataset.focus);
      if (el) el.focus();
    });

    $('#form-login').addEventListener('submit', (e) => {
      e.preventDefault();
      if (submit.disabled) return;
      submitted.login = true;
      const errors = forms.login.fields.map((x) => {
        const msg = x.validator(x.input);
        setError(x.input, msg);
        return { input: x.input, msg };
      }).filter((x) => x.msg);
      if (errors.length) {
        showSummary(summary, errors);
        summary.focus();
        return;
      }
      showSummary(summary, []);
      submit.disabled = true;
      sso.disabled = true;
      submit.textContent = 'Entrando…';
      setTimeout(() => {
        const ok = email.value.trim().toLowerCase() === N.DEMO_LOGIN.email && pass.value === N.DEMO_LOGIN.password;
        submit.disabled = false;
        sso.disabled = false;
        submit.textContent = 'Entrar';
        if (!ok) {
          // erro genérico: não revela se foi o e-mail ou a senha
          showSummary(summary, [], 'E-mail ou senha incorretos');
          pass.value = '';
          summary.focus();
          return;
        }
        Login.success('senha');
      }, 1100);
    });

    sso.addEventListener('click', () => {
      if (sso.disabled) return;
      sso.disabled = true;
      submit.disabled = true;
      const label = sso.querySelector('span');
      label.textContent = 'Redirecionando para o provedor…';
      setTimeout(() => {
        sso.disabled = false;
        submit.disabled = false;
        label.textContent = 'Entrar com SSO da empresa';
        Login.success('sso');
      }, 1200);
    });

    // Recuperação de senha
    const rEmail = $('#recover-email');
    const rSummary = $('#recover-summary');
    const rSubmit = $('#btn-recover');
    forms.recover = { summary: rSummary, fields: [{ input: rEmail, validator: validateEmail }] };
    bindField(rEmail, validateEmail, 'recover');
    $('#form-recover').addEventListener('submit', (e) => {
      e.preventDefault();
      if (rSubmit.disabled) return;
      submitted.recover = true;
      const msg = validateEmail(rEmail);
      setError(rEmail, msg);
      if (msg) { showSummary(rSummary, [{ input: rEmail, msg }]); rSummary.focus(); return; }
      showSummary(rSummary, []);
      rSubmit.disabled = true;
      rSubmit.textContent = 'Enviando…';
      setTimeout(() => {
        rSubmit.disabled = false;
        rSubmit.textContent = 'Enviar link';
        $('#form-recover').hidden = true;
        const done = $('#recover-done');
        done.hidden = false;
        done.focus();
      }, 1000);
    });

    N.keepFocusedVisible($('#view-login'));
  };

  Login.success = function (method) {
    N.session.set({ user: N.USER.email, method, at: Date.now() });
    $('#login-password').value = '';
    location.hash = '#/painel/visao-geral';
    N.toast(method === 'sso' ? 'Sessão iniciada com o SSO da empresa (demonstração).' : 'Bem-vinda, ' + N.USER.name.split(' ')[0] + '.');
  };

  /** mode: 'login' | 'recover' */
  Login.show = function (mode, fromNav) {
    Login.init();
    const isRecover = mode === 'recover';
    $('#panel-login').hidden = isRecover;
    $('#panel-recover').hidden = !isRecover;
    document.title = (isRecover ? 'Recuperar senha' : 'Entrar') + ' · Nexo Capital';
    if (isRecover) {
      const rEmail = $('#recover-email');
      if (!rEmail.value) rEmail.value = $('#login-email').value;
      $('#form-recover').hidden = false;
      $('#recover-done').hidden = true;
      setError(rEmail, '');
      showSummary($('#recover-summary'), []);
      submitted.recover = false;
    }
    if (fromNav) {
      const h = document.querySelector(isRecover ? '#recover-title' : '#login-title');
      if (h) h.focus({ preventScroll: true });
    }
  };

  N.Login = Login;
})();
