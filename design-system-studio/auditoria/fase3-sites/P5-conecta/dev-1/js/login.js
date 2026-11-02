/* Login "Acesso responsivo" + Cadastro "na mesma tela" + recuperação de senha.
   Demonstração de interface: nenhuma credencial sai do navegador. */
(function () {
  'use strict';

  var $ = UI.$, $all = UI.$all;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var screen, onSuccess;
  var dirty = {};
  var pendingSubmit = false;

  function digits(s) { return String(s || '').replace(/\D/g, ''); }

  function formatPhone(value) {
    var d = digits(value).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  function accounts() { return UI.Store.get('conecta-accounts') || []; }

  /* ---------- URL (?aba=cadastro / ?aba=recuperar) ---------- */
  function setUrlTab(tab) {
    var url = location.pathname + (tab ? '?aba=' + tab : '');
    try { history.replaceState(null, '', url); } catch (e) { /* file:// em alguns navegadores */ }
  }
  function urlTab() {
    try { return new URLSearchParams(location.search).get('aba'); } catch (e) { return null; }
  }

  /* ---------- Abas Entrar | Criar conta ---------- */
  function selectTab(name, opts) {
    opts = opts || {};
    var isSignup = name === 'cadastro';
    var tabEntrar = $('#tab-entrar'), tabCad = $('#tab-cadastro');
    tabEntrar.setAttribute('aria-selected', String(!isSignup));
    tabCad.setAttribute('aria-selected', String(isSignup));
    tabEntrar.tabIndex = isSignup ? -1 : 0;
    tabCad.tabIndex = isSignup ? 0 : -1;
    $('#panel-entrar').hidden = isSignup;
    $('#panel-cadastro').hidden = !isSignup;

    // mantém o e-mail já digitado entre as abas
    var loginEmail = $('#login-email'), signupEmail = $('#signup-email');
    if (isSignup && loginEmail.value && !signupEmail.value) signupEmail.value = loginEmail.value;
    if (!isSignup && signupEmail.value && !loginEmail.value) loginEmail.value = signupEmail.value;

    if (!isSignup) showRecover(name === 'recuperar', { silentUrl: true });
    screen.setAttribute('data-view', isSignup ? 'cadastro' : (name === 'recuperar' ? 'recuperar' : 'entrar'));
    if (!opts.silentUrl) setUrlTab(isSignup ? 'cadastro' : (name === 'recuperar' ? 'recuperar' : ''));
    if (opts.focusTab) (isSignup ? tabCad : tabEntrar).focus();
    document.title = (isSignup ? 'Criar conta' : (name === 'recuperar' ? 'Recuperar senha' : 'Entrar')) + ' · Conecta';
  }

  function showRecover(show, opts) {
    opts = opts || {};
    $('#login-form').hidden = show;
    $('#recover-view').hidden = !show;
    screen.setAttribute('data-view', show ? 'recuperar' : 'entrar');
    if (show) {
      var re = $('#recover-email');
      if (!re.value) re.value = $('#login-email').value || $('#signup-email').value;
      $('#recover-status').innerHTML = '';
    }
    if (!opts.silentUrl) setUrlTab(show ? 'recuperar' : '');
    if (opts.focus) {
      var h = show ? $('#recover-title') : $('#login-title');
      h.focus({ preventScroll: false });
    }
  }

  /* ---------- Mostrar / ocultar senha ---------- */
  function bindPasswordToggles() {
    $all('.pw-toggle', screen).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('aria-controls'));
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-pressed', String(show));
        btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
        btn.innerHTML = window.icon(show ? 'eye-off' : 'eye');
      });
    });
  }

  /* ---------- Validação ---------- */
  function loginMethod() { return $('#method-phone').checked ? 'phone' : 'email'; }

  var validators = {
    'login-email': function (v) {
      if (!v.trim()) return 'Informe seu e-mail.';
      if (!EMAIL_RE.test(v.trim())) return 'Informe um e-mail válido, como nome@exemplo.com.';
      return '';
    },
    'login-phone': function (v) {
      var d = digits(v);
      if (!d) return 'Informe seu telefone.';
      if (d.length < 10) return 'Informe o telefone com DDD, como (11) 98765-4321.';
      return '';
    },
    'login-password': function (v) { return v ? '' : 'Informe sua senha.'; },
    'recover-email': function (v) {
      if (!v.trim()) return 'Informe seu e-mail.';
      if (!EMAIL_RE.test(v.trim())) return 'Informe um e-mail válido, como nome@exemplo.com.';
      return '';
    },
    'signup-name': function (v) {
      if (!v.trim()) return 'Informe seu nome.';
      if (v.trim().length < 2) return 'Use pelo menos 2 letras no nome.';
      return '';
    },
    'signup-email': function (v) {
      if (!v.trim()) return 'Informe seu e-mail.';
      if (!EMAIL_RE.test(v.trim())) return 'Informe um e-mail válido, como nome@exemplo.com.';
      return '';
    },
    'signup-password': function (v) {
      if (!v) return 'Crie uma senha.';
      if (v.length < 8) return 'Use pelo menos 8 caracteres.';
      if (!/[A-Za-zÀ-ÿ]/.test(v) || !/\d/.test(v)) return 'Inclua pelo menos uma letra e um número.';
      return '';
    }
  };

  function validateField(input) {
    var fn = validators[input.id];
    if (!fn) return '';
    var msg = fn(input.value);
    UI.setFieldError(input, msg);
    return msg;
  }

  function bindBlurValidation() {
    Object.keys(validators).forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener('input', function () {
        dirty[id] = true;
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
      input.addEventListener('blur', function (e) {
        // valida ao sair do campo quando a pessoa já interagiu com ele;
        // se o foco vai para o botão de envio, o envio valida tudo (evita o botão "fugir" do clique)
        if (pendingSubmit || (e.relatedTarget && e.relatedTarget.type === 'submit')) return;
        if (dirty[id] || input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });
  }

  function validateForm(ids, summaryBox) {
    var errors = [];
    ids.forEach(function (id) {
      var input = document.getElementById(id);
      var msg = validateField(input);
      if (msg) errors.push({ id: id, message: msg });
    });
    UI.renderSummary(summaryBox, errors, errors.length === 1 ? 'Revise o campo abaixo:' : 'Revise os ' + errors.length + ' campos abaixo:');
    if (errors.length) {
      summaryBox.focus({ preventScroll: true });
      summaryBox.scrollIntoView({ block: 'nearest' });
    }
    return errors.length === 0;
  }

  function setLoading(btn, loading, text) {
    if (loading) {
      btn.dataset.label = btn.textContent;
      btn.textContent = text;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    } else {
      btn.textContent = btn.dataset.label || btn.textContent;
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  }

  /* ---------- Envio: Entrar ---------- */
  function onLoginSubmit(e) {
    e.preventDefault();
    var method = loginMethod();
    var idField = method === 'phone' ? 'login-phone' : 'login-email';
    var summary = $('#login-summary');
    if (!validateForm([idField, 'login-password'], summary)) return;

    var btn = $('#login-submit');
    if (btn.disabled) return;
    setLoading(btn, true, 'Entrando…');

    var idValue = document.getElementById(idField).value.trim();
    var password = $('#login-password').value;

    setTimeout(function () {
      var demo = DATA.DEMO_ACCOUNT;
      var ok = false, account = null;
      if (method === 'email') {
        var email = idValue.toLowerCase();
        if (email === demo.email && password === demo.password) ok = true;
        accounts().forEach(function (a) { if (a.email === email && a.password === password) { ok = true; account = a; } });
      } else if (digits(idValue) === demo.phone && password === demo.password) {
        ok = true;
      }
      setLoading(btn, false);
      if (!ok) {
        // erro genérico: não revela qual dos dois está errado
        UI.renderSummary(summary, [{ message: '' }], method === 'phone' ? 'Telefone ou senha incorretos.' : 'E-mail ou senha incorretos.');
        summary.focus({ preventScroll: true });
        summary.scrollIntoView({ block: 'nearest' });
        return;
      }
      UI.renderSummary(summary, []);
      onSuccess(account ? { name: account.name, email: account.email } : null);
    }, 900);
  }

  /* ---------- Envio: Criar conta ---------- */
  function onSignupSubmit(e) {
    e.preventDefault();
    var summary = $('#signup-summary');
    if (!validateForm(['signup-name', 'signup-email', 'signup-password'], summary)) return;
    var btn = $('#signup-submit');
    if (btn.disabled) return;
    setLoading(btn, true, 'Criando conta…');
    var account = {
      name: $('#signup-name').value.trim(),
      email: $('#signup-email').value.trim().toLowerCase(),
      password: $('#signup-password').value
    };
    setTimeout(function () {
      setLoading(btn, false);
      // demonstração: guarda a conta só neste navegador (nunca faça isso em produção)
      var list = accounts().filter(function (a) { return a.email !== account.email; });
      list.push(account);
      UI.Store.set('conecta-accounts', list);
      UI.renderSummary(summary, []);
      onSuccess({ name: account.name, email: account.email, isNew: true });
    }, 1000);
  }

  /* ---------- Envio: recuperação ---------- */
  function onRecoverSubmit(e) {
    e.preventDefault();
    var summary = $('#recover-summary');
    if (!validateForm(['recover-email'], summary)) return;
    var btn = $('#recover-submit');
    if (btn.disabled) return;
    setLoading(btn, true, 'Enviando…');
    setTimeout(function () {
      setLoading(btn, false);
      // mensagem neutra: não confirma se o e-mail existe
      $('#recover-status').innerHTML = '<p class="notice notice-info">' + window.icon('info') +
        '<span>Se o e-mail existir, enviaremos um link.</span></p>';
    }, 900);
  }

  /* ---------- Checklist de requisitos de senha ---------- */
  function updateReqs() {
    var v = $('#signup-password').value;
    var rules = { len: v.length >= 8, letter: /[A-Za-zÀ-ÿ]/.test(v), number: /\d/.test(v) };
    $all('#signup-reqs li').forEach(function (li) {
      var met = rules[li.getAttribute('data-req')];
      li.classList.toggle('is-met', met);
      li.querySelector('.req-ic').innerHTML = window.icon(met ? 'check-circle' : 'circle', 16);
      li.querySelector('.req-state').textContent = met ? ': cumprido' : ': pendente';
    });
  }

  /* ---------- Teclado virtual: botão "Entrar" acima dele ---------- */
  function bindViewport() {
    var vv = window.visualViewport;
    function update() {
      if (!vv) return;
      var offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--kb-offset', Math.round(offset) + 'px');
    }
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    screen.addEventListener('focusin', function (e) {
      if (!e.target.matches('input')) return;
      if (!window.matchMedia('(max-width: 767.98px)').matches) return;
      setTimeout(function () {
        update();
        e.target.scrollIntoView({ block: 'center', behavior: UI.reducedMotion() ? 'auto' : 'smooth' });
      }, 300);
    });
  }

  function termsModal(kind, trigger) {
    var isTerms = kind === 'termos';
    UI.openModal({
      title: isTerms ? 'Termos de uso' : 'Política de privacidade',
      trigger: trigger,
      body: isTerms
        ? '<p>Este é um texto de demonstração. Os termos reais devem ser escritos pela equipe jurídica do Conecta.</p><p>Ao usar a plataforma, você se compromete a respeitar outras pessoas, não publicar conteúdo ilegal e manter seus dados de acesso em segurança.</p>'
        : '<p>Este é um texto de demonstração. A política real deve descrever quais dados são coletados, por quanto tempo são guardados e como pedir a exclusão.</p><p>Nesta demonstração nenhum dado sai do seu navegador.</p>',
      footer: '<button type="button" class="btn btn-primary" data-modal-close>Entendi</button>'
    });
  }

  function init(successCb) {
    screen = $('#login-screen');
    onSuccess = successCb;

    // abas: clique e setas
    $all('.auth-tab', screen).forEach(function (tab) {
      tab.addEventListener('click', function () { selectTab(tab.id === 'tab-cadastro' ? 'cadastro' : 'entrar'); });
      tab.addEventListener('keydown', function (e) {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) === -1) return;
        e.preventDefault();
        var toSignup;
        if (e.key === 'Home') toSignup = false;
        else if (e.key === 'End') toSignup = true;
        else toSignup = tab.id !== 'tab-cadastro';
        selectTab(toSignup ? 'cadastro' : 'entrar', { focusTab: true });
      });
    });

    // E-mail | Telefone
    $all('input[name="login-method"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var phone = loginMethod() === 'phone';
        $('#field-login-email').hidden = phone;
        $('#field-login-phone').hidden = !phone;
        UI.renderSummary($('#login-summary'), []);
      });
    });

    // sincroniza o e-mail entre as abas (nunca apaga o que foi digitado)
    $('#login-email').addEventListener('input', function () { $('#signup-email').value = this.value; });
    $('#signup-email').addEventListener('input', function () { $('#login-email').value = this.value; });
    $('#login-phone').addEventListener('input', function () {
      var pos = this.value.length;
      this.value = formatPhone(this.value);
      if (pos >= this.value.length) this.setSelectionRange(this.value.length, this.value.length);
    });

    bindPasswordToggles();
    bindBlurValidation();
    screen.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('button[type="submit"]')) return;
      pendingSubmit = true;
      setTimeout(function () { pendingSubmit = false; }, 600);
    });
    $('#signup-password').addEventListener('input', updateReqs);
    updateReqs();

    $('#login-form').addEventListener('submit', onLoginSubmit);
    $('#signup-form').addEventListener('submit', onSignupSubmit);
    $('#recover-form').addEventListener('submit', onRecoverSubmit);

    $('#forgot-link').addEventListener('click', function (e) {
      e.preventDefault();
      showRecover(true, { focus: true });
    });
    $('#recover-back').addEventListener('click', function () { showRecover(false, { focus: true }); });

    $('#fill-demo').addEventListener('click', function () {
      selectTab('entrar');
      $('#method-email').checked = true;
      $('#method-email').dispatchEvent(new Event('change'));
      $('#login-email').value = DATA.DEMO_ACCOUNT.email;
      $('#signup-email').value = DATA.DEMO_ACCOUNT.email;
      $('#login-phone').value = formatPhone(DATA.DEMO_ACCOUNT.phone);
      $('#login-password').value = DATA.DEMO_ACCOUNT.password;
      UI.setFieldError($('#login-email'), '');
      UI.setFieldError($('#login-password'), '');
      UI.renderSummary($('#login-summary'), []);
      $('#login-submit').focus();
      UI.toast('Dados de demonstração preenchidos.', 'check');
    });

    screen.addEventListener('click', function (e) {
      var t = e.target.closest('[data-terms]');
      if (t) { e.preventDefault(); termsModal(t.getAttribute('data-terms'), t); }
    });

    bindViewport();
  }

  function show() {
    screen.hidden = false;
    document.documentElement.classList.add('login-active');
    var tab = urlTab();
    selectTab(tab === 'cadastro' ? 'cadastro' : (tab === 'recuperar' ? 'recuperar' : 'entrar'), { silentUrl: true });
    document.title = (tab === 'cadastro' ? 'Criar conta' : 'Entrar') + ' · Conecta';
  }

  function hide() {
    screen.hidden = true;
    document.documentElement.classList.remove('login-active');
  }

  function reset() {
    ['login-password', 'signup-password'].forEach(function (id) { document.getElementById(id).value = ''; });
    $all('.field-error', screen).forEach(function (el) { el.hidden = true; });
    $all('[aria-invalid]', screen).forEach(function (el) { el.removeAttribute('aria-invalid'); });
    $all('.error-summary', screen).forEach(function (el) { el.hidden = true; });
    dirty = {};
    updateReqs();
  }

  window.Login = { init: init, show: show, hide: hide, reset: reset };
})();
