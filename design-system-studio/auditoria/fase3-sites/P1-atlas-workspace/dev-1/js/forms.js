/* Validação de formulários reutilizável (login, cadastro, recuperação e
   formulários Swiss do app): valida ao sair do campo e no envio, mostra a
   mensagem abaixo do campo (aria-invalid + aria-describedby) e um resumo no
   topo com role="alert" e links para os campos. Nunca apaga o que foi digitado. */
(function () {
  var A = window.Atlas;
  var u = A.u;

  A.forms = {};

  /**
   * @param form  elemento <form>
   * @param rules { nomeDoCampo: { label, validate(valor, form) -> mensagem|'' } }
   * @param opts  { summary: elemento do resumo, onSubmit(form) -> Promise, liveAfterSubmit: [campos] }
   */
  A.forms.bind = function (form, rules, opts) {
    opts = opts || {};
    var state = { submitted: false, dirty: {} };
    var summary = opts.summary;

    function el(name) { return form.elements[name]; }
    function value(name) {
      var e = el(name);
      if (!e) return '';
      if (e.type === 'checkbox') return e.checked;
      return e.value;
    }
    function msgEl(name) { return form.querySelector('[data-msg-for="' + name + '"]'); }

    function setError(name, msg) {
      var e = el(name), m = msgEl(name);
      if (!e) return;
      if (msg) {
        e.setAttribute('aria-invalid', 'true');
        if (m) m.innerHTML = A.icon('alert', 16) + '<span>' + u.esc(msg) + '</span>';
      } else {
        e.removeAttribute('aria-invalid');
        if (m) m.innerHTML = '';
      }
    }

    function check(name) {
      var r = rules[name];
      if (!r) return '';
      var msg = r.validate(value(name), form) || '';
      setError(name, msg);
      return msg;
    }

    function clearSummary() { if (summary) summary.innerHTML = ''; }

    A.forms.showSummary = A.forms.showSummary || showSummary;
    function showSummary(errors) {
      if (!summary) return;
      summary.innerHTML = '<div class="msg msg--error" tabindex="-1">' + A.icon('alert', 20) +
        '<div><p class="msg__title">' + (errors.length === 1 ? 'Corrija 1 campo para continuar:' : 'Corrija ' + errors.length + ' campos para continuar:') + '</p><ul>' +
        errors.map(function (er) {
          return '<li><a href="#' + er.id + '" data-focus="' + er.id + '">' + u.esc(er.label) + ': ' + u.esc(er.msg) + '</a></li>';
        }).join('') + '</ul></div></div>';
      var box = summary.firstChild;
      box.focus({ preventScroll: true });
      box.scrollIntoView({ block: 'nearest', behavior: u.reducedMotion() ? 'auto' : 'smooth' });
    }

    Object.keys(rules).forEach(function (name) {
      var e = el(name);
      if (!e) return;
      var evt = e.type === 'checkbox' ? 'change' : 'input';
      e.addEventListener(evt, function () {
        state.dirty[name] = true;
        // reavalia em tempo real apenas campos já com erro, ou campos "ao vivo" após o primeiro envio
        var live = state.submitted && (opts.liveAfterSubmit || []).indexOf(name) >= 0;
        if (e.getAttribute('aria-invalid') === 'true' || live || e.type === 'checkbox') check(name);
        (rules[name].dependents || []).forEach(function (d) {
          if (state.submitted || el(d).getAttribute('aria-invalid') === 'true') check(d);
        });
      });
      e.addEventListener('blur', function () {
        if (state.dirty[name] || state.submitted) check(name);
      });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.getAttribute('aria-busy') === 'true') return;
      state.submitted = true;
      var errors = [];
      Object.keys(rules).forEach(function (name) {
        var msg = check(name);
        if (msg) errors.push({ id: el(name).id, label: rules[name].label, msg: msg });
      });
      if (errors.length) { showSummary(errors); return; }
      clearSummary();
      if (opts.onSubmit) opts.onSubmit(form, { showError: showRaw, clear: clearSummary });
    });

    // Enter avança para o próximo campo em formulários com várias colunas (opcional)
    function showRaw(html, kind) {
      if (!summary) return;
      summary.innerHTML = '<div class="msg msg--' + (kind || 'error') + '" tabindex="-1">' + A.icon(kind === 'info' ? 'info' : kind === 'success' ? 'circleCheck' : 'alert', 20) + '<div>' + html + '</div></div>';
      summary.firstChild.focus({ preventScroll: true });
      summary.firstChild.scrollIntoView({ block: 'nearest' });
    }

    return { check: check, setError: setError, state: state, showRaw: showRaw, clear: clearSummary };
  };

  /** Coloca um botão em estado de envio (texto + spinner, desabilitado). */
  A.forms.busy = function (form, btn, on, busyText) {
    if (on) {
      btn.dataset.label = btn.innerHTML;
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>' + u.esc(busyText) + '</span>';
      form.setAttribute('aria-busy', 'true');
    } else {
      btn.disabled = false;
      btn.removeAttribute('aria-disabled');
      if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
      form.removeAttribute('aria-busy');
    }
  };

  /** Força da senha: 0 vazio, 1 fraca, 2 média, 3 forte. */
  A.forms.strength = function (pw) {
    if (!pw) return 0;
    var score = 0;
    if (pw.length >= 8) score++;
    if (/[a-zA-Z]/.test(pw) && /\d/.test(pw)) score++;
    if ((/[a-z]/.test(pw) && /[A-Z]/.test(pw)) || /[^a-zA-Z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    if (pw.length < 8) return 1;
    return score <= 1 ? 1 : score === 2 ? 2 : 3;
  };
  A.forms.passwordRules = function (pw) {
    return [
      { ok: pw.length >= 8, text: 'Pelo menos 8 caracteres' },
      { ok: /[a-zA-Z]/.test(pw) && /\d/.test(pw), text: 'Letras e números' },
      { ok: (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) || /[^a-zA-Z0-9]/.test(pw), text: 'Maiúsculas e minúsculas ou um símbolo (recomendado)' }
    ];
  };
  A.forms.validNewPassword = function (v) {
    if (!v) return 'Crie uma senha.';
    if (v.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
    if (!(/[a-zA-Z]/.test(v) && /\d/.test(v))) return 'Use letras e números na senha.';
    return '';
  };

  /** Liga o medidor de força a um campo de senha. */
  A.forms.bindStrength = function (input, box) {
    var LEVELS = ['', 'fraca', 'média', 'forte'];
    function update() {
      var v = input.value;
      var lvl = A.forms.strength(v);
      box.dataset.level = lvl;
      box.querySelector('.strength__text').innerHTML = v ? 'Força da senha: <strong>' + LEVELS[lvl] + '</strong>' : 'Força da senha: —';
      var list = box.querySelector('.reqs');
      if (list) {
        list.innerHTML = A.forms.passwordRules(v).map(function (r) {
          return '<li class="' + (r.ok ? 'is-ok' : '') + '">' + A.icon(r.ok ? 'circleCheck' : 'minus', 16) + '<span>' + r.text + '<span class="sr-only">' + (r.ok ? ' — atendido' : ' — pendente') + '</span></span></li>';
        }).join('');
      }
    }
    input.addEventListener('input', update);
    update();
  };

  A.forms.strengthHTML = function (id) {
    return '<div class="strength" id="' + id + '" data-level="0">' +
      '<div class="strength__bars" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<p class="strength__text" aria-live="polite">Força da senha: —</p>' +
      '<ul class="reqs" aria-label="Requisitos da senha"></ul></div>';
  };

  /** Botão mostrar/ocultar senha (delegado globalmente). */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pw-toggle]');
    if (b) {
      var input = document.getElementById(b.getAttribute('aria-controls'));
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-pressed', String(show));
      b.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      b.innerHTML = A.icon(show ? 'eyeOff' : 'eye', 20);
      return;
    }
    // links do resumo de erros: focam o campo sem mexer na rota (hash)
    var f = e.target.closest('[data-focus]');
    if (f) {
      e.preventDefault();
      var target = document.getElementById(f.getAttribute('data-focus'));
      if (target) { target.focus(); target.scrollIntoView({ block: 'center', behavior: u.reducedMotion() ? 'auto' : 'smooth' }); }
    }
  });

  A.forms.pwToggle = function (inputId) {
    return '<button type="button" class="icon-btn pw-toggle" data-pw-toggle aria-controls="' + inputId + '" aria-label="Mostrar senha" aria-pressed="false">' + A.icon('eye', 20) + '</button>';
  };

  /* No celular, mantém o campo focado visível acima do teclado virtual. */
  document.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t.matches || !t.matches('input:not([type="checkbox"]):not([type="radio"]), textarea, select')) return;
    if (window.innerWidth >= 768) return;
    setTimeout(function () {
      if (document.activeElement === t) t.scrollIntoView({ block: 'center', behavior: u.reducedMotion() ? 'auto' : 'smooth' });
    }, 320);
  });
})();
