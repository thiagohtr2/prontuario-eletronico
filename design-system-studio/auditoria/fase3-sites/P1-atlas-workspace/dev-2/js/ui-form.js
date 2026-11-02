/* Formulário Swiss Minimal genérico: título + descrição, grade de 1 ou 2 colunas, termos, ação primária,
   validação ao sair do campo e no envio, resumo de erros com links, botão "Enviando…" com spinner. */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, esc, icon, forms } = A;
  const U = (A.ui = A.ui || {});

  /**
   * cfg: { overline, title, desc, submitLabel, loadingText, successText, resetOnSuccess,
   *        fields:[{ type, name, label, half, options, autocomplete, rule, value, optional, html, disabled }],
   *        onSubmit(values) }
   */
  U.mountForm = (host, cfg) => {
    const fid = A.uid('f');
    const rules = {};
    const body = cfg.fields.map((f, i) => {
      const id = `${fid}-${f.name}`;
      rules[f.name] = f.rule || (() => '');
      const span = f.half ? '' : ' is-full';
      if (f.type === 'checkbox') {
        return `<div class="swform__cell is-full">${forms.checkHTML({ id, name: f.name, html: f.html, required: !!f.required, cls: 'sw-check' })}</div>`;
      }
      return `<div class="swform__cell${span}">${forms.fieldHTML({ ...f, id, required: !f.optional })}</div>`;
    }).join('');

    host.innerHTML = `
      <section class="swform" aria-labelledby="${fid}-t">
        <div class="swform__head">
          ${cfg.overline ? `<p class="overline"><span class="sq" aria-hidden="true"></span>${esc(cfg.overline)}</p>` : ''}
          <h2 class="sec__title" id="${fid}-t">${esc(cfg.title)}</h2>
          ${cfg.desc ? `<p class="swform__desc">${esc(cfg.desc)}</p>` : ''}
        </div>
        <form class="swform__form" novalidate>
          <div class="swform__summary" role="alert"></div>
          <div class="swform__grid">${body}</div>
          <div class="swform__actions"><button type="submit" class="btn btn--primary">${esc(cfg.submitLabel)}</button></div>
        </form>
      </section>`;
    const form = $('form', host);
    cfg.fields.forEach((f) => {
      if (f.value != null && f.type !== 'checkbox') form.elements[f.name].value = f.value;
      if (f.disabled) form.elements[f.name].disabled = true;
    });
    forms.bindPasswordToggles(form);
    const api = forms.bind(form, {
      summary: $('.swform__summary', host),
      loadingText: cfg.loadingText || 'Enviando…',
      rules,
      onSubmit: async (values, ctx) => {
        await A.sleep(1100);
        if (navigator.onLine === false) {
          ctx.setLoading(false);
          ctx.showAlert('Não foi possível enviar. Verifique sua conexão e tente novamente. Nada do que você digitou foi apagado.');
          return;
        }
        if (cfg.onSubmit) cfg.onSubmit(values);
        ctx.setLoading(false);
        ctx.showAlert(cfg.successText || 'Enviado com sucesso.', 'success');
        if (cfg.resetOnSuccess) {
          form.reset();
          api.validateAll && Object.keys(rules).forEach((n) => ctx.setError(n, ''));
        }
        U.toast(cfg.successText || 'Enviado com sucesso.');
      },
    });
    return api;
  };
})();
