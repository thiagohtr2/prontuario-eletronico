/* Busca global (header e folha "Mais"): filtra enquanto digita, sem diferenciar maiúsculas/acentos,
   com listbox acessível (setas, Enter, Esc) e estado "Nada encontrado". */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { esc, icon, norm } = A;
  const D = A.data;

  function index() {
    const list = [];
    D.navFlat().forEach((i) => list.push({ label: i.label, hint: 'Página · ' + i.group, href: '#/' + i.id, icon: i.icon }));
    D.projects.forEach((p) => list.push({ label: p.name, hint: 'Projeto', href: '#/projetos/' + p.id, icon: 'folder' }));
    D.people.forEach((p) => list.push({ label: p.nome, hint: 'Pessoa · ' + p.funcao, href: '#/pessoas', icon: 'user' }));
    D.tasks.forEach((t) => list.push({ label: t.tarefa, hint: 'Tarefa', href: '#/tarefas', icon: 'circle-check' }));
    return list;
  }

  /** opts: { placeholder, inline, hideTarget, onPick } */
  function create(container, opts = {}) {
    const id = A.uid('search');
    container.innerHTML = `
      <div class="search ${opts.inline ? 'search--inline' : ''}" role="search">
        <label class="sr-only" for="${id}">Buscar no Atlas</label>
        ${icon('search', { cls: 'search__icon' })}
        <input class="search__input" id="${id}" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false"
          role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list" placeholder="${esc(opts.placeholder || 'Buscar…')}">
        <ul class="search__list" id="${id}-list" role="listbox" aria-label="Resultados da busca" hidden></ul>
        <p class="sr-only" role="status" id="${id}-status"></p>
      </div>`;
    const input = container.querySelector('input');
    const list = container.querySelector('.search__list');
    const status = container.querySelector('[role="status"]');
    const all = index();
    let results = [];
    let active = -1;

    function setOpen(open) {
      list.hidden = !open;
      input.setAttribute('aria-expanded', String(open));
      if (opts.hideTarget) opts.hideTarget.hidden = open;
      if (!open) { active = -1; input.removeAttribute('aria-activedescendant'); }
    }
    function render() {
      const q = norm(input.value);
      if (!q) { setOpen(false); status.textContent = ''; return; }
      results = all.filter((r) => norm(r.label + ' ' + r.hint).includes(q)).slice(0, 8);
      if (!results.length) {
        list.innerHTML = '<li class="search__empty" role="presentation">Nada encontrado</li>';
        status.textContent = 'Nada encontrado';
      } else {
        list.innerHTML = results
          .map((r, i) => `<li role="option" id="${id}-o${i}" data-i="${i}" aria-selected="false">${icon(r.icon)}<span class="search__txt"><span class="search__label">${esc(r.label)}</span><span class="search__hint">${esc(r.hint)}</span></span></li>`)
          .join('');
        status.textContent = `${results.length} resultado${results.length > 1 ? 's' : ''}`;
      }
      active = -1;
      setOpen(true);
    }
    function setActive(i) {
      const opts_ = list.querySelectorAll('[role="option"]');
      if (!opts_.length) return;
      active = (i + opts_.length) % opts_.length;
      opts_.forEach((o, k) => o.setAttribute('aria-selected', String(k === active)));
      input.setAttribute('aria-activedescendant', opts_[active].id);
      opts_[active].scrollIntoView({ block: 'nearest' });
    }
    function pick(i) {
      const r = results[i];
      if (!r) return;
      input.value = '';
      setOpen(false);
      input.blur();
      if (opts.onPick) opts.onPick(r);
      location.hash = r.href;
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', () => { if (input.value) render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { if (active >= 0) { e.preventDefault(); pick(active); } else if (results.length === 1 && !list.hidden) { e.preventDefault(); pick(0); } }
      else if (e.key === 'Escape') {
        if (!list.hidden || input.value) { e.stopPropagation(); input.value = ''; setOpen(false); }
      }
    });
    list.addEventListener('pointerdown', (e) => e.preventDefault()); // mantém o foco no campo
    list.addEventListener('click', (e) => {
      const li = e.target.closest('[data-i]');
      if (li) pick(+li.dataset.i);
    });
    input.addEventListener('blur', () => { if (!opts.inline) setTimeout(() => { if (document.activeElement !== input) setOpen(false); }, 120); });
    return { input };
  }

  A.search = { create };
})();
