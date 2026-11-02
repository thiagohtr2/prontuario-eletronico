/* Componente "Busca de produtos (plantas)" — combobox com listbox de
   sugestões agrupadas (Recentes, Sugestões / Produtos, Categorias),
   debounce de 250 ms, spinner no lugar da lupa e navegação por teclado. */
(function () {
  'use strict';
  var VV = (window.VV = window.VV || {});
  var esc = function (s) { return VV.ui.esc(s); };
  var uid = 0;

  function highlight(text, q) {
    if (!q) return esc(text);
    var n = VV.norm(text), nq = VV.norm(q);
    var i = n.indexOf(nq);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  /* Busca nos dados fictícios: todos os termos precisam aparecer */
  VV.searchProducts = function (q) {
    var terms = VV.norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return VV.PRODUCTS.map(function (p) {
      var catT = VV.CATS[p.tipo] ? VV.CATS[p.tipo].title : '';
      var hay = VV.norm([p.nome, p.sci, catT, VV.CATS[p.cat].title, p.resumo].join(' '));
      var nome = VV.norm(p.nome);
      var ok = terms.every(function (t) { return hay.indexOf(t) > -1; });
      if (!ok) return null;
      var score = 0;
      terms.forEach(function (t) {
        if (nome.indexOf(t) === 0) score += 6;
        else if (nome.indexOf(t) > -1) score += 4;
        else if (VV.norm(p.sci).indexOf(t) > -1) score += 3;
        else if (VV.norm(catT).indexOf(t) > -1) score += 2;
        else score += 1;
      });
      return { p: p, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score || a.p.ordem - b.p.ordem; }).map(function (x) { return x.p; });
  };

  VV.Combobox = function (opts) {
    var input = opts.input, panel = opts.panel, iconSlot = opts.iconSlot;
    var id = 'sg-' + (++uid);
    var items = [], active = -1, timer = null, isOpen = false, loading = false;

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', id + '-list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');

    function setLoading(on) {
      loading = on;
      if (!iconSlot) return;
      iconSlot.innerHTML = VV.icon(on ? 'loader' : 'search', on ? 'icon--spin' : '');
      iconSlot.setAttribute('aria-label', on ? 'Buscando…' : 'Buscar');
    }

    function groupHTML(title, gid, opts2) {
      var html = '<div class="sg__group" role="group" aria-labelledby="' + gid + '"><div class="sg__title" id="' + gid + '" role="presentation">' + esc(title) + '</div>';
      opts2.forEach(function (o) {
        var idx = items.length;
        items.push(o);
        html += '<div class="sg__opt" role="option" id="' + id + '-o' + idx + '" data-idx="' + idx + '" aria-selected="false">' +
          '<span class="icon-circle icon-circle--sm' + (o.muted ? ' icon-circle--muted' : '') + '">' + VV.icon(o.icon) + '</span>' +
          '<span class="sg__opt-txt"><span class="sg__opt-main">' + o.html + '</span>' + (o.sub ? '<span class="sg__opt-sub">' + esc(o.sub) + '</span>' : '') + '</span>' +
          (o.end ? '<span class="sg__opt-end">' + esc(o.end) + '</span>' : '') + '</div>';
      });
      return html + '</div>';
    }

    function render() {
      var q = input.value.trim();
      items = []; active = -1;
      input.removeAttribute('aria-activedescendant');
      var status = '', body = '';
      if (!q) {
        var rec = VV.store.state.recents.map(function (t) { return { type: 'query', value: t, html: esc(t), icon: 'clock', muted: true }; });
        if (rec.length) body += groupHTML('Recentes', id + '-g1', rec);
        body += groupHTML('Sugestões', id + '-g2', VV.SEARCH_SUGGESTIONS.map(function (s) {
          return { type: 'link', href: s.href, value: s.label, html: esc(s.label), sub: s.sub, icon: s.icon };
        }));
      } else {
        var prods = VV.searchProducts(q).slice(0, 5);
        var nq = VV.norm(q);
        var cats = Object.keys(VV.CATS).filter(function (k) {
          return k !== 'todas' && (VV.norm(VV.CATS[k].title).indexOf(nq) > -1 || VV.norm(VV.CATS[k].label).indexOf(nq) > -1);
        }).slice(0, 3);
        if (!prods.length && !cats.length) {
          status = '<p class="sg__status" role="status">Nenhuma planta encontrada para <strong>“' + esc(q) + '”</strong>. Tente “suculenta”, “sombra” ou “vaso”.</p>';
          body += groupHTML('Sugestões', id + '-g2', VV.SEARCH_SUGGESTIONS.map(function (s) {
            return { type: 'link', href: s.href, value: s.label, html: esc(s.label), sub: s.sub, icon: s.icon };
          }));
        } else {
          if (prods.length) body += groupHTML('Produtos', id + '-g3', prods.map(function (p) {
            return { type: 'link', href: '#/produto/' + p.id, value: p.nome, html: highlight(p.nome, q), sub: p.sci || VV.CATS[p.cat].title, end: VV.fmt(p.preco), icon: 'leaf' };
          }));
          if (cats.length) body += groupHTML('Categorias', id + '-g4', cats.map(function (k) {
            return { type: 'link', href: '#/catalogo?cat=' + k, value: VV.CATS[k].title, html: highlight(VV.CATS[k].title, q), sub: 'Categoria', icon: VV.CATS[k].icon };
          }));
          body += groupHTML('Buscar', id + '-g5', [{ type: 'query', value: q, html: 'Ver todos os resultados para “' + esc(q) + '”', icon: 'search' }]);
        }
      }
      panel.innerHTML = status + '<div role="listbox" id="' + id + '-list" aria-label="Sugestões de busca">' + body + '</div>';
    }

    function setActive(i) {
      var opts3 = panel.querySelectorAll('.sg__opt');
      if (!opts3.length) return;
      if (i < 0) i = opts3.length - 1;
      if (i >= opts3.length) i = 0;
      active = i;
      Array.prototype.forEach.call(opts3, function (el, k) {
        el.classList.toggle('is-active', k === i);
        el.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      input.setAttribute('aria-activedescendant', opts3[i].id);
      opts3[i].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      if (isOpen) return;
      render();
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      isOpen = true;
    }
    function close() {
      if (opts.alwaysOpen) return;
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      isOpen = false; active = -1;
    }

    function choose(item) {
      if (!item) return;
      if (item.type === 'query') {
        VV.store.addRecent(item.value);
        go('#/catalogo?q=' + encodeURIComponent(item.value));
      } else {
        VV.store.addRecent(item.value);
        go(item.href);
      }
    }
    function go(href) {
      close();
      if (opts.onNavigate) opts.onNavigate(href);
      if (location.hash === href) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = href;
    }

    input.addEventListener('focus', function () { open(); });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      if (!isOpen) open();
      setLoading(true);
      timer = setTimeout(function () { setLoading(false); render(); }, 250);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!isOpen) open(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (!isOpen) open(); setActive(active - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (loading) { clearTimeout(timer); setLoading(false); render(); }
        if (active >= 0 && items[active]) choose(items[active]);
        else if (input.value.trim()) choose({ type: 'query', value: input.value.trim() });
      } else if (e.key === 'Escape') {
        if (opts.onEscape && opts.onEscape(isOpen)) { e.preventDefault(); return; }
        e.preventDefault();
        if (isOpen && !opts.alwaysOpen) close();
        else if (input.value) { input.value = ''; render(); }
      }
    });
    input.addEventListener('blur', function () {
      setTimeout(function () { if (document.activeElement !== input && !panel.contains(document.activeElement)) close(); }, 120);
    });
    panel.addEventListener('mousedown', function (e) { e.preventDefault(); });
    panel.addEventListener('click', function (e) {
      var opt = e.target.closest('.sg__opt');
      if (opt) choose(items[+opt.getAttribute('data-idx')]);
    });
    if (iconSlot) {
      iconSlot.addEventListener('click', function (e) {
        e.preventDefault();
        if (input.value.trim()) choose({ type: 'query', value: input.value.trim() });
        else input.focus();
      });
    }

    return {
      open: open,
      close: close,
      render: render,
      setValue: function (v) { input.value = v || ''; },
      focus: function () { input.focus(); input.select(); }
    };
  };
})();
