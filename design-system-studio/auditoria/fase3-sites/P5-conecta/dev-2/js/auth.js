/* Conecta — tela de entrada: login (e-mail | telefone), cadastro e recuperação na mesma tela.
   Demonstração de interface: nenhuma senha é persistida; contas criadas existem só em memória. */
(function (C) {
  'use strict';
  var $ = C.$, $$ = C.$$, esc = C.esc, icon = C.icon;

  var DEMO = { email: 'ana@conecta.demo', phone: '11912345678', pass: 'Conecta123', name: 'Ana Souza' };
  var accounts = new Map(); // e-mail -> { name, pass } (somente memória)

  /* ---------------- regras de validação ---------------- */
  var RULES = [
    { id: 'len', label: 'Pelo menos 8 caracteres', test: function (v) { return v.length >= 8; }, msg: 'Use pelo menos 8 caracteres' },
    { id: 'upper', label: 'Uma letra maiúscula', test: function (v) { return /[A-ZÀ-Þ]/.test(v); }, msg: 'Inclua uma letra maiúscula' },
    { id: 'lower', label: 'Uma letra minúscula', test: function (v) { return /[a-zß-ÿ]/.test(v); }, msg: 'Inclua uma letra minúscula' },
    { id: 'num', label: 'Um número', test: function (v) { return /\d/.test(v); }, msg: 'Inclua um número' }
  ];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var V = {
    email: function (v) { v = v.trim(); return !v ? 'Informe seu e-mail' : (!EMAIL_RE.test(v) ? 'Digite um e-mail válido, como nome@exemplo.com' : ''); },
    phone: function (v) { var d = v.replace(/\D/g, ''); return !d ? 'Informe seu telefone com DDD' : ((d.length < 10 || d.length > 11) ? 'Digite um telefone com DDD, como (11) 91234-5678' : ''); },
    passLogin: function (v) { return v ? '' : 'Informe sua senha'; },
    name: function (v) { v = v.trim(); return !v ? 'Informe seu nome' : (v.length < 2 ? 'Digite seu nome completo' : ''); },
    passNew: function (v) {
      if (!v) return 'Crie uma senha';
      var bad = RULES.filter(function (r) { return !r.test(v); })[0];
      return bad ? bad.msg : '';
    }
  };

  /* ---------------- campos ---------------- */
  var fields = {};
  function field(key, inputId, errId, validate) {
    var input = document.getElementById(inputId);
    var f = { key: key, input: input, err: document.getElementById(errId), validate: validate, touched: false };
    fields[key] = f;
    input.addEventListener('blur', function () { f.touched = true; check(f); });
    input.addEventListener('input', function () { if (f.touched || input.getAttribute('aria-invalid') === 'true') check(f); });
    return f;
  }
  function check(f) {
    var msg = f.validate(f.input.value);
    setError(f, msg);
    return msg;
  }
  function setError(f, msg) {
    if (msg) {
      f.input.setAttribute('aria-invalid', 'true');
      f.err.innerHTML = icon('alert') + '<span>' + esc(msg) + '</span>';
    } else {
      f.input.removeAttribute('aria-invalid');
      f.err.innerHTML = '';
    }
  }
  function clearField(f) { f.touched = false; setError(f, ''); }

  function summary(el, title, errs) {
    var list = errs && errs.length
      ? '<ul>' + errs.map(function (e) { return '<li><a href="#' + e.f.input.id + '" data-focus="' + e.f.input.id + '">' + esc(e.msg) + '</a></li>'; }).join('') + '</ul>'
      : '';
    el.innerHTML = icon('alert') + '<div><strong>' + esc(title) + '</strong>' + list + '</div>';
  }
  function clearSummary(el) { el.innerHTML = ''; }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-focus]');
    if (!a) return;
    e.preventDefault();
    var el = document.getElementById(a.getAttribute('data-focus'));
    if (el) el.focus();
  });

  function busy(btn, on, label) {
    var lbl = btn.querySelector('.btn__label');
    if (on) { btn.dataset.label = lbl.textContent; lbl.textContent = label; btn.disabled = true; btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
    else { lbl.textContent = btn.dataset.label || lbl.textContent; btn.disabled = false; btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
  }

  /* ---------------- abas Entrar | Criar conta | Recuperar ---------------- */
  var tabs = { entrar: $('#tab-entrar'), cadastro: $('#tab-cadastro') };
  var panels = { entrar: $('#panel-entrar'), cadastro: $('#panel-cadastro'), recuperar: $('#panel-recuperar') };
  var current = 'entrar';

  function updateUrl(name) {
    try {
      var url = new URL(location.href);
      url.hash = '';
      if (name === 'entrar') url.searchParams.delete('aba'); else url.searchParams.set('aba', name);
      history.replaceState(null, '', url.pathname + url.search);
    } catch (err) { /* file:// em alguns navegadores bloqueia replaceState; a tela continua funcionando */ }
  }

  function show(name, opts) {
    opts = opts || {};
    current = name;
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== name; });
    var isTab = name === 'entrar' || name === 'cadastro';
    $('#auth-tabs').hidden = !isTab;
    Object.keys(tabs).forEach(function (k) {
      var on = k === name;
      tabs[k].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[k].tabIndex = on ? 0 : -1;
    });
    document.title = (name === 'cadastro' ? 'Criar conta' : name === 'recuperar' ? 'Recuperar senha' : 'Entrar') + ' · Conecta';
    $('#auth-status').innerHTML = '';
    if (!opts.silentUrl) updateUrl(name);
    if (opts.focus === 'heading') { var h = $('h1', panels[name]); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
  }

  function syncEmail(from) {
    ['login-email', 'signup-email', 'recover-email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el !== from) el.value = from.value;
    });
  }

  function initTabs() {
    Object.keys(tabs).forEach(function (k) {
      tabs[k].addEventListener('click', function () { show(k); });
    });
    $('#auth-tabs').addEventListener('keydown', function (e) {
      var order = ['entrar', 'cadastro'], i = order.indexOf(current);
      var next = null;
      if (e.key === 'ArrowRight') next = order[(i + 1) % 2];
      else if (e.key === 'ArrowLeft') next = order[(i + 1) % 2];
      else if (e.key === 'Home') next = 'entrar';
      else if (e.key === 'End') next = 'cadastro';
      if (next) { e.preventDefault(); show(next); tabs[next].focus(); }
    });
    $('#link-forgot').addEventListener('click', function (e) { e.preventDefault(); show('recuperar', { focus: 'heading' }); });
    $('#link-back-login').addEventListener('click', function (e) { e.preventDefault(); show('entrar'); $('#login-email').focus(); });
    ['login-email', 'signup-email', 'recover-email'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function (e) { syncEmail(e.target); });
    });
  }

  /* ---------------- mostrar/ocultar senha ---------------- */
  function initPassToggles() {
    $$('[data-toggle-pass]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-toggle-pass'));
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-pressed', show ? 'true' : 'false');
        btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
        btn.innerHTML = icon(show ? 'eye-off' : 'eye');
      });
    });
  }

  /* ---------------- máscara de telefone ---------------- */
  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* ---------------- login ---------------- */
  function initLogin() {
    var emailF = field('login-email', 'login-email', 'login-email-err', V.email);
    var phoneF = field('login-phone', 'login-phone', 'login-phone-err', V.phone);
    var passF = field('login-pass', 'login-pass', 'login-pass-err', V.passLogin);
    var sum = $('#login-summary'), form = $('#form-login'), btn = $('#btn-login');
    var sending = false;

    phoneF.input.addEventListener('input', function () { phoneF.input.value = maskPhone(phoneF.input.value); });

    function mode() { return $('input[name="login-mode"]:checked').value; }
    $$('input[name="login-mode"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var m = mode();
        $('#group-login-email').hidden = m !== 'email';
        $('#group-login-phone').hidden = m !== 'phone';
        clearSummary(sum);
        clearField(emailF); clearField(phoneF);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var idF = mode() === 'email' ? emailF : phoneF;
      var errs = [idF, passF].map(function (f) { f.touched = true; return { f: f, msg: check(f) }; }).filter(function (x) { return x.msg; });
      if (errs.length) {
        summary(sum, errs.length === 1 ? 'Corrija 1 campo para continuar' : 'Corrija ' + errs.length + ' campos para continuar', errs);
        errs[0].f.input.focus();
        return;
      }
      clearSummary(sum);
      sending = true; busy(btn, true, 'Entrando…');
      var idValue = idF.input.value.trim();
      var pass = passF.input.value;
      C.delay(900).then(function () {
        sending = false; busy(btn, false);
        var user = null;
        if (mode() === 'email') {
          var em = idValue.toLowerCase();
          if (em === DEMO.email && pass === DEMO.pass) user = { name: DEMO.name, email: DEMO.email, demo: true };
          else if (accounts.has(em) && accounts.get(em).pass === pass) user = { name: accounts.get(em).name, email: em };
        } else if (idValue.replace(/\D/g, '') === DEMO.phone && pass === DEMO.pass) {
          user = { name: DEMO.name, email: DEMO.email, demo: true };
        }
        if (!user) {
          // mensagem genérica: não revela qual dos dois está errado
          summary(sum, 'E-mail ou senha incorretos', null);
          sum.querySelector('strong').insertAdjacentHTML('afterend', '<span>Confira os dados e tente novamente.</span>');
          passF.input.focus();
          return;
        }
        passF.input.value = '';
        C.app.login(user);
      });
    });

    $('#btn-fill-demo').addEventListener('click', function () {
      if (mode() === 'email') { emailF.input.value = DEMO.email; syncEmail(emailF.input); }
      else { phoneF.input.value = '(11) 91234-5678'; }
      passF.input.value = DEMO.pass;
      [emailF, phoneF, passF].forEach(clearField);
      clearSummary(sum);
      C.ui.toast('Campos preenchidos com a conta de demonstração.');
      btn.focus();
    });
  }

  /* ---------------- cadastro ---------------- */
  function initSignup() {
    var nameF = field('signup-name', 'signup-name', 'signup-name-err', V.name);
    var emailF = field('signup-email', 'signup-email', 'signup-email-err', V.email);
    var passF = field('signup-pass', 'signup-pass', 'signup-pass-err', V.passNew);
    var sum = $('#signup-summary'), form = $('#form-signup'), btn = $('#btn-signup'), reqs = $('#signup-pass-reqs');
    var sending = false;

    reqs.innerHTML = RULES.map(function (r) {
      return '<li data-rule="' + r.id + '" data-met="false"><span class="pw-reqs__mark" aria-hidden="true">' + icon('check') + '</span><span>' + r.label + '<span class="sr-only"> (pendente)</span></span></li>';
    }).join('');
    function updateReqs() {
      var v = passF.input.value;
      RULES.forEach(function (r) {
        var li = reqs.querySelector('[data-rule="' + r.id + '"]');
        var met = r.test(v);
        li.setAttribute('data-met', met ? 'true' : 'false');
        li.querySelector('.sr-only').textContent = met ? ' (cumprido)' : ' (pendente)';
      });
    }
    passF.input.addEventListener('input', updateReqs);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var errs = [nameF, emailF, passF].map(function (f) { f.touched = true; return { f: f, msg: check(f) }; }).filter(function (x) { return x.msg; });
      if (errs.length) {
        summary(sum, errs.length === 1 ? 'Corrija 1 campo para continuar' : 'Corrija ' + errs.length + ' campos para continuar', errs);
        errs[0].f.input.focus();
        return;
      }
      clearSummary(sum);
      sending = true; busy(btn, true, 'Criando conta…');
      var name = nameF.input.value.trim(), email = emailF.input.value.trim().toLowerCase(), pass = passF.input.value;
      C.delay(1000).then(function () {
        sending = false; busy(btn, false);
        // não revela se o e-mail já existe: o fluxo é sempre o mesmo
        if (!accounts.has(email) && email !== DEMO.email) accounts.set(email, { name: name, pass: pass });
        [nameF, passF].forEach(function (f) { f.input.value = ''; });
        updateReqs();
        C.app.login({ name: name, email: email, fresh: true });
      });
    });
  }

  /* ---------------- recuperação de senha ---------------- */
  function initRecover() {
    var emailF = field('recover-email', 'recover-email', 'recover-email-err', V.email);
    var sum = $('#recover-summary'), form = $('#form-recover'), btn = $('#btn-recover'), done = $('#recover-done');
    var sending = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      done.hidden = true;
      emailF.touched = true;
      var msg = check(emailF);
      if (msg) {
        summary(sum, 'Corrija 1 campo para continuar', [{ f: emailF, msg: msg }]);
        emailF.input.focus();
        return;
      }
      clearSummary(sum);
      sending = true; busy(btn, true, 'Enviando…');
      C.delay(900).then(function () {
        sending = false; busy(btn, false);
        // mensagem neutra: nunca confirma se o e-mail existe
        done.hidden = false;
      });
    });
  }

  /* ---------------- termos ---------------- */
  function initTerms() {
    $$('[data-terms]').forEach(function (b) {
      b.addEventListener('click', function () {
        var isTerms = b.getAttribute('data-terms') === 'termos';
        C.ui.modal({
          title: isTerms ? 'Termos de uso' : 'Política de privacidade',
          trigger: b,
          body: '<p>Texto de demonstração. Este é um protótipo de interface do Conecta, sem backend e sem coleta real de dados.</p>' +
            '<p>' + (isTerms ? 'Em um produto real, aqui ficariam as regras de convivência, responsabilidades e condições de uso da plataforma.' : 'Em um produto real, aqui ficaria a descrição de quais dados são coletados, como são usados e como você pode controlá-los.') + '</p>',
          footer: '<button type="button" class="btn btn--primary" data-dismiss>Entendi</button>'
        });
      });
    });
  }

  /* ---------------- teclado virtual (visualViewport) ---------------- */
  function initKeyboard() {
    var root = document.documentElement, vv = window.visualViewport;
    function update() {
      if (!vv) return;
      var kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.style.setProperty('--kb', kb + 'px');
      root.classList.toggle('kb-open', kb > 80);
    }
    if (vv) { vv.addEventListener('resize', update); vv.addEventListener('scroll', update); update(); }
    // mantém o campo focado visível acima do teclado
    document.addEventListener('focusin', function (e) {
      var t = e.target;
      if (!t.matches || !t.matches('input, textarea, select')) return;
      if (!C.mqMobile.matches) return;
      setTimeout(function () {
        if (document.activeElement === t) t.scrollIntoView({ block: 'center', behavior: C.reducedMotion() ? 'auto' : 'smooth' });
      }, 320);
    });
  }

  /* ---------------- API ---------------- */
  C.auth = {
    init: function () {
      initTabs(); initPassToggles(); initLogin(); initSignup(); initRecover(); initTerms(); initKeyboard();
      var aba = new URLSearchParams(location.search).get('aba');
      show(aba === 'cadastro' ? 'cadastro' : aba === 'recuperar' ? 'recuperar' : 'entrar', { silentUrl: true });
    },
    /** Reexibe a tela de entrada (após sair da conta). */
    reset: function (message) {
      Object.keys(fields).forEach(function (k) { fields[k].input.value = ''; clearField(fields[k]); });
      ['login-summary', 'signup-summary', 'recover-summary'].forEach(function (id) { clearSummary(document.getElementById(id)); });
      $('#recover-done').hidden = true;
      show('entrar');
      if (message) $('#auth-status').innerHTML = '<div class="form-message form-message--info">' + icon('info') + '<span>' + esc(message) + '</span></div>';
    },
    show: show
  };
})(window.Conecta);
