/* Kit de formulários: validação ao sair do campo e no envio, resumo de erros com links,
   botão com estado de carregamento, mostrar/ocultar senha. Serve ao login/cadastro e ao formulário Swiss. */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { esc, icon } = A;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /** HTML de um campo com label associada, descrição e mensagem de erro. */
  function fieldHTML(o) {
    const id = o.id;
    const describedby = [`${id}-err`, o.hint ? `${id}-hint` : ''].filter(Boolean).join(' ');
    const common = `id="${id}" name="${o.name}" ${o.autocomplete ? `autocomplete="${o.autocomplete}"` : ''} ${o.required ? 'aria-required="true"' : ''} aria-describedby="${describedby}" ${o.value ? `value="${esc(o.value)}"` : ''}`;
    let control;
    if (o.type === 'textarea') {
      control = `<textarea class="textarea" ${common} rows="${o.rows || 5}" ${o.placeholder ? `placeholder="${esc(o.placeholder)}"` : ''}></textarea>`;
    } else if (o.type === 'select') {
      control = `<select class="select" ${common}>${o.options.map((v) => `<option value="${esc(v[0])}">${esc(v[1])}</option>`).join('')}</select><span class="select-caret">${icon('chevron-down')}</span>`;
    } else {
      control = `<input class="input" type="${o.type || 'text'}" ${o.inputmode ? `inputmode="${o.inputmode}"` : ''} ${common} ${o.placeholder ? `placeholder="${esc(o.placeholder)}"` : ''} ${o.autocapitalize ? `autocapitalize="${o.autocapitalize}"` : ''} spellcheck="false">`;
    }
    const toggle = o.toggle
      ? `<button type="button" class="pw-toggle" aria-label="Mostrar senha" aria-pressed="false" aria-controls="${id}" data-toggle-pw>${icon('eye')}</button>`
      : '';
    return `
      <div class="field" data-field="${o.name}">
        <label class="field__label" for="${id}">${esc(o.label)}${o.optional ? ' <span class="field__opt">(opcional)</span>' : ''}</label>
        <div class="field__control ${o.toggle ? 'has-toggle' : ''} ${o.type === 'select' ? 'select-wrap' : ''}">${control}${toggle}</div>
        ${o.hint ? `<p class="field__hint" id="${id}-hint">${esc(o.hint)}</p>` : ''}
        <p class="field__error" id="${id}-err" hidden>${icon('circle-alert')}<span></span></p>
      </div>`;
  }

  /** HTML de checkbox com texto (aceita HTML no label). */
  function checkHTML(o) {
    return `
      <div class="field" data-field="${o.name}">
        <label class="check" for="${o.id}">
          <input type="checkbox" id="${o.id}" name="${o.name}" ${o.cls ? `class="${o.cls}"` : ''} aria-describedby="${o.id}-err" ${o.required ? 'aria-required="true"' : ''}>
          <span class="check__text">${o.html}</span>
        </label>
        <p class="field__error" id="${o.id}-err" hidden>${icon('circle-alert')}<span></span></p>
      </div>`;
  }

  /** Delegação do botão mostrar/ocultar senha (independente em cada campo). */
  function bindPasswordToggles(root) {
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-toggle-pw]');
      if (!btn) return;
      const input = document.getElementById(btn.getAttribute('aria-controls'));
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
      btn.innerHTML = icon(show ? 'eye-off' : 'eye');
      input.focus();
    });
  }

  /**
   * Liga validação a um <form>.
   * opts: { rules:{name:(value,values)=>msg}, deps:{name:[outros]}, summary: Element, onSubmit: async (values, api)=>void,
   *         loadingText, submitBtn }
   */
  function bind(form, opts) {
    const rules = opts.rules;
    const names = Object.keys(rules);
    const summary = opts.summary;
    const btn = opts.submitBtn || form.querySelector('[type="submit"]');
    let submitted = false;
    let busy = false;
    const touched = new Set();

    const wrap = (n) => form.querySelector(`[data-field="${n}"]`);
    const ctl = (n) => form.elements[n];
    const valueOf = (n) => {
      const c = ctl(n);
      if (!c) return '';
      return c.type === 'checkbox' ? c.checked : c.value;
    };
    const values = () => Object.fromEntries(names.map((n) => [n, valueOf(n)]));

    function setError(n, msg) {
      const w = wrap(n);
      const c = ctl(n);
      if (!w || !c) return;
      const err = w.querySelector('.field__error');
      if (msg) {
        c.setAttribute('aria-invalid', 'true');
        err.querySelector('span').textContent = msg;
        err.hidden = false;
      } else {
        c.removeAttribute('aria-invalid');
        err.hidden = true;
        err.querySelector('span').textContent = '';
      }
    }

    function validate(n) {
      const msg = rules[n](valueOf(n), values()) || '';
      setError(n, msg);
      return msg;
    }

    function showSummary(errors) {
      if (!summary) return;
      if (!errors.length) { summary.innerHTML = ''; return; }
      summary.innerHTML = `
        <div class="alert">${icon('circle-alert')}<div>
          <p class="alert__title">${errors.length === 1 ? 'Corrija o campo abaixo para continuar' : `Corrija os ${errors.length} campos abaixo para continuar`}</p>
          <ul>${errors.map((e) => `<li><a href="#campo" data-for="${esc(ctl(e.name).id)}">${esc(e.msg)}</a></li>`).join('')}</ul>
        </div></div>`;
    }

    function showAlert(msg, tone = 'error') {
      if (!summary) return;
      summary.innerHTML = `<div class="alert ${tone === 'error' ? '' : 'alert--' + tone}">${icon(tone === 'success' ? 'check' : 'circle-alert')}<div><p class="alert__title">${esc(msg)}</p></div></div>`;
    }

    function validateAll() {
      const errors = [];
      names.forEach((n) => { const msg = validate(n); if (msg) errors.push({ name: n, msg }); });
      return errors;
    }

    form.addEventListener('focusout', (e) => {
      const w = e.target.closest && e.target.closest('[data-field]');
      if (!w || busy) return;
      const to = e.relatedTarget;
      if (to && w.contains(to)) return; // ex.: foco foi para o botão de mostrar senha
      const n = w.dataset.field;
      if (!rules[n]) return;
      touched.add(n);
      validate(n);
    });

    form.addEventListener('input', (e) => {
      const w = e.target.closest && e.target.closest('[data-field]');
      if (!w) return;
      const n = w.dataset.field;
      if (!rules[n]) return;
      const c = ctl(n);
      if (submitted || touched.has(n) || c.getAttribute('aria-invalid') === 'true') validate(n);
      (opts.deps && opts.deps[n] || []).forEach((d) => { if (submitted || touched.has(d)) validate(d); });
      if (submitted && summary && summary.firstElementChild && !names.some((k) => ctl(k).getAttribute('aria-invalid') === 'true')) showSummary([]);
    });
    form.addEventListener('change', (e) => {
      const w = e.target.closest && e.target.closest('[data-field]');
      if (w && e.target.type === 'checkbox' && rules[w.dataset.field] && (submitted || touched.has(w.dataset.field))) validate(w.dataset.field);
    });

    if (summary) {
      summary.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-for]');
        if (!a) return;
        e.preventDefault();
        const el = document.getElementById(a.dataset.for);
        if (el) { el.scrollIntoView({ block: 'center', behavior: A.reducedMotion() ? 'auto' : 'smooth' }); el.focus({ preventScroll: true }); }
      });
    }

    function setLoading(on) {
      busy = on;
      if (!btn) return;
      if (on) {
        btn.dataset.label = btn.innerHTML;
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('is-loading');
        btn.innerHTML = `<span class="spinner" aria-hidden="true"></span><span>${esc(opts.loadingText || 'Enviando…')}</span>`;
      } else {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.classList.remove('is-loading');
        if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      submitted = true;
      const errors = validateAll();
      showSummary(errors);
      if (errors.length) {
        const first = ctl(errors[0].name);
        first.scrollIntoView({ block: 'center', behavior: 'auto' });
        first.focus({ preventScroll: true });
        return;
      }
      setLoading(true);
      try {
        await opts.onSubmit(values(), { setLoading, showAlert, showSummary, setError, ctl, form });
      } finally {
        if (busy) setLoading(false);
      }
    });

    return { validate, validateAll, setError, showAlert, showSummary, setLoading, values, reset() { submitted = false; touched.clear(); names.forEach((n) => setError(n, '')); showSummary([]); } };
  }

  /** Mantém o campo focado visível com o teclado virtual aberto. */
  let kbBound = false;
  function keyboardAssist() {
    if (kbBound) return;
    kbBound = true;
    const isField = (el) => el && el.matches && el.matches('input, select, textarea');
    const reveal = () => {
      const el = document.activeElement;
      if (isField(el) && A.isMobile()) el.scrollIntoView({ block: 'center', behavior: A.reducedMotion() ? 'auto' : 'smooth' });
    };
    document.addEventListener('focusin', () => setTimeout(reveal, 280));
    if (window.visualViewport) window.visualViewport.addEventListener('resize', reveal);
  }

  A.forms = { fieldHTML, checkHTML, bindPasswordToggles, bind, keyboardAssist, EMAIL_RE };
})();
