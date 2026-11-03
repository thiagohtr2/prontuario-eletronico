/* ==========================================================================
   Login "Acesso corporativo": SSO simulado, e-mail/senha, validação,
   recuperação de senha com mensagem neutra. Demonstração: sem backend.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui, $ = ui.$;
  var login = (NX.login = {});

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var onSuccess = function () {};
  var busy = false;
  var submitted = false;
  var forgotSubmitted = false;

  function validateEmail(v) {
    v = v.trim();
    if (!v) return 'Informe seu e-mail corporativo.';
    if (!EMAIL_RE.test(v)) return 'Informe um e-mail válido, como nome@empresa.com.br.';
    return '';
  }
  function validatePass(v) { return v ? '' : 'Informe sua senha.'; }

  function setError(input, errEl, msg) {
    if (msg) {
      errEl.hidden = false;
      errEl.innerHTML = NX.icon('circle-alert', 16) + '<span></span>';
      errEl.lastChild.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
    } else {
      errEl.hidden = true;
      errEl.textContent = '';
      input.removeAttribute('aria-invalid');
    }
  }

  function summaryHTML(list) {
    var html = '<p class="summary__title">' + NX.icon('circle-alert', 16) +
      '<span>Corrija os campos abaixo para continuar:</span></p><ul>';
    list.forEach(function (e) {
      html += '<li><a href="#/login" data-focus="' + e.id + '">' + NX.fmt.esc(e.label) + ': ' + NX.fmt.esc(e.msg) + '</a></li>';
    });
    return html + '</ul>';
  }

  function bindSummaryLinks(summary) {
    summary.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-focus]');
      if (!a) return;
      ev.preventDefault();
      var el = d.getElementById(a.getAttribute('data-focus'));
      if (el) el.focus();
    });
  }

  /* ---------- estado de carregamento do botão ---------- */
  function setLoading(btn, on, label) {
    var span = btn.querySelector('.btn__label');
    if (on) {
      btn.dataset.label = span.textContent;
      span.textContent = label;
      btn.insertAdjacentHTML('afterbegin', '<span class="spinner" aria-hidden="true"></span>');
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    } else {
      span.textContent = btn.dataset.label || span.textContent;
      var sp = btn.querySelector('.spinner'); if (sp) sp.remove();
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  }

  function setBusy(on, activeBtn, label) {
    busy = on;
    ['#btn-sso', '#btn-login'].forEach(function (s) {
      var b = $(s);
      if (b === activeBtn) setLoading(b, on, label);
      else b.disabled = on;
    });
  }

  login.init = function (cb) {
    onSuccess = cb;
    var form = $('#login-form'), email = $('#login-email'), pass = $('#login-pass');
    var eErr = $('#login-email-err'), pErr = $('#login-pass-err'), summary = $('#login-summary');
    bindSummaryLinks(summary);

    function currentErrors() {
      var list = [];
      var em = validateEmail(email.value), pm = validatePass(pass.value);
      if (em) list.push({ id: 'login-email', label: 'E-mail', msg: em });
      if (pm) list.push({ id: 'login-pass', label: 'Senha', msg: pm });
      return list;
    }
    /* Ao sair do campo valida e mostra a mensagem abaixo dele. O resumo só é refeito no envio:
       alterá-lo no blur deslocaria o botão entre o mousedown e o mouseup e engoliria o clique. */
    function toAction(ev) {
      return ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('#btn-login, #btn-sso, #btn-toggle-pass, .link');
    }
    email.addEventListener('blur', function (ev) {
      if (busy || toAction(ev)) return;
      setError(email, eErr, validateEmail(email.value));
    });
    pass.addEventListener('blur', function (ev) {
      if (busy || toAction(ev)) return;
      if (!submitted && !pass.value) { setError(pass, pErr, ''); return; }
      setError(pass, pErr, validatePass(pass.value));
    });
    email.addEventListener('input', function () {
      if (email.getAttribute('aria-invalid') === 'true') setError(email, eErr, validateEmail(email.value));
    });
    pass.addEventListener('input', function () {
      if (pass.getAttribute('aria-invalid') === 'true') setError(pass, pErr, validatePass(pass.value));
    });

    /* Mostrar / ocultar senha */
    var tg = $('#btn-toggle-pass');
    tg.addEventListener('click', function () {
      var show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      tg.setAttribute('aria-pressed', show ? 'true' : 'false');
      tg.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      tg.innerHTML = NX.icon(show ? 'eye-off' : 'eye', 20);
    });

    /* Envio (e-mail + senha) */
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (busy) return;
      submitted = true;
      $('#login-status').textContent = '';
      var em = validateEmail(email.value), pm = validatePass(pass.value);
      setError(email, eErr, em);
      setError(pass, pErr, pm);
      if (em || pm) {
        summary.innerHTML = summaryHTML(currentErrors());
        (em ? email : pass).focus();
        return;
      }
      summary.innerHTML = '';
      setBusy(true, $('#btn-login'), 'Entrando…');
      setTimeout(function () {
        var ok = email.value.trim().toLowerCase() === NX.user.email && pass.value === NX.user.password;
        setBusy(false, $('#btn-login'));
        if (ok) {
          login.reset();
          onSuccess();
        } else {
          /* Mensagem genérica: não revela qual dos dois campos está errado */
          summary.innerHTML = '<p class="summary__title">' + NX.icon('circle-alert', 16) + '<span>E-mail ou senha incorretos</span></p>';
          pass.value = '';
          pass.focus();
        }
      }, 1100);
    });

    /* SSO (simulado) */
    $('#btn-sso').addEventListener('click', function () {
      if (busy) return;
      summary.innerHTML = '';
      $('#login-status').textContent = '';
      setBusy(true, $('#btn-sso'), 'Redirecionando…');
      setTimeout(function () {
        setBusy(false, $('#btn-sso'));
        login.reset();
        onSuccess();
      }, 1200);
    });

    /* Recuperação de senha */
    var fForm = $('#forgot-form'), fEmail = $('#forgot-email'), fErr = $('#forgot-email-err');
    var fSummary = $('#forgot-summary'), fResult = $('#forgot-result'), fBtn = $('#btn-forgot');
    bindSummaryLinks(fSummary);
    fEmail.addEventListener('blur', function (ev) {
      if (busy || (ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('#btn-forgot, .link--block'))) return;
      if (!forgotSubmitted && !fEmail.value) return;
      setError(fEmail, fErr, validateEmail(fEmail.value));
    });
    fEmail.addEventListener('input', function () {
      if (fEmail.getAttribute('aria-invalid') === 'true') setError(fEmail, fErr, validateEmail(fEmail.value));
    });
    fForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (busy) return;
      forgotSubmitted = true;
      fResult.innerHTML = '';
      var m = validateEmail(fEmail.value);
      setError(fEmail, fErr, m);
      if (m) {
        fSummary.innerHTML = summaryHTML([{ id: 'forgot-email', label: 'E-mail', msg: m }]);
        fEmail.focus();
        return;
      }
      fSummary.innerHTML = '';
      busy = true;
      setLoading(fBtn, true, 'Enviando…');
      setTimeout(function () {
        busy = false;
        setLoading(fBtn, false);
        /* Mensagem neutra: não confirma se o e-mail existe */
        fResult.innerHTML = NX.icon('info', 16) + '<span>Se o e-mail existir, enviaremos um link.</span>';
      }, 900);
    });
  };

  /** Limpa estado visual (ao entrar/sair ou trocar de subtela). */
  login.reset = function () {
    submitted = false;
    forgotSubmitted = false;
    busy = false;
    $('#login-summary').innerHTML = '';
    $('#forgot-summary').innerHTML = '';
    $('#forgot-result').innerHTML = '';
    setError($('#login-email'), $('#login-email-err'), '');
    setError($('#login-pass'), $('#login-pass-err'), '');
    setError($('#forgot-email'), $('#forgot-email-err'), '');
    $('#login-pass').value = '';
    var sso = $('#btn-sso'), lg = $('#btn-login'), fg = $('#btn-forgot');
    [sso, lg, fg].forEach(function (b) {
      var sp = b.querySelector('.spinner'); if (sp) sp.remove();
      if (b.dataset.label) b.querySelector('.btn__label').textContent = b.dataset.label;
      b.disabled = false;
      b.removeAttribute('aria-busy');
    });
    if ($('#login-pass').type === 'text') $('#btn-toggle-pass').click();
  };

  login.setStatus = function (msg) {
    var el = $('#login-status');
    el.innerHTML = msg ? NX.icon('circle-check', 16) + '<span></span>' : '';
    if (msg) el.lastChild.textContent = msg;
  };

  /** Alterna entre "signin" e "forgot". */
  login.show = function (view) {
    var forgot = view === 'forgot';
    $('#login-view-signin').hidden = forgot;
    $('#login-view-forgot').hidden = !forgot;
    $('.login__card').setAttribute('aria-labelledby', forgot ? 'forgot-title' : 'login-title');
    d.title = 'Nexo Capital · ' + (forgot ? 'Recuperar senha' : 'Acesso corporativo');
  };
})(window, document);
