/* ==========================================================================
   Busca de produtos (plantas) — combobox acessível
   role="combobox" + aria-expanded + listbox; atalho Ctrl/⌘ K; setas/Enter/Esc;
   debounce de 250 ms com spinner no lugar da lupa; tela cheia no celular.
   ========================================================================== */
(function () {
  'use strict';
  var VV = window.VV;
  var $ = VV.$;

  var root = $('#search'), input = $('#search-input'), panel = $('#search-panel'), list = $('#search-list');
  var status = $('#search-status'), iconWrap = $('[data-search-icon]', root), kbd = $('[data-search-kbd]', root);
  var backBtn = $('[data-search-close]', root);
  var items = [], active = -1, isOpen = false, timer = null, skipOpen = false;

  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  kbd.textContent = isMac ? '⌘ K' : 'Ctrl K';

  function haystack(p) {
    var cat = VV.catById(p.cat).label;
    return VV.norm([p.name, p.sci, cat, p.tag, p.luz ? VV.LUZ[p.luz] : '', p.cuid ? 'cuidado ' + VV.CUID[p.cuid] : '', p.pet ? 'pet friendly' : '', p.desc].join(' '));
  }
  var index = VV.products.map(function (p) { return { p: p, h: haystack(p) }; });

  /* Usado também pelo catálogo (parâmetro q) */
  VV.matchQuery = function (p, q) {
    var tokens = VV.norm(q).split(/\s+/).filter(Boolean);
    if (!tokens.length) return true;
    var h = null;
    for (var i = 0; i < index.length; i++) if (index[i].p === p) { h = index[i].h; break; }
    return tokens.every(function (t) { return h.indexOf(t) > -1; });
  };

  function mark(text, q) {
    var n = VV.norm(text), nq = VV.norm(q), i = nq ? n.indexOf(nq) : -1;
    if (i < 0 || n.length !== text.length) return VV.esc(text);
    return VV.esc(text.slice(0, i)) + '<mark>' + VV.esc(text.slice(i, i + nq.length)) + '</mark>' + VV.esc(text.slice(i + nq.length));
  }

  function build(q) {
    var groups = [];
    q = q.trim();
    if (!q) {
      var rec = VV.recents.all();
      if (rec.length) groups.push({ title: 'Recentes', clear: true, items: rec.map(function (t) { return { type: 'term', label: t, icon: 'history', meta: 'Busca recente' }; }) });
      groups.push({ title: 'Sugestões', items: VV.popularTerms.map(function (t) { return { type: 'term', label: t, icon: 'trending-up', meta: 'Em alta' }; }) });
    } else {
      var prods = index.filter(function (x) { return VV.matchQuery(x.p, q); }).slice(0, 5).map(function (x) {
        return { type: 'product', id: x.p.id, label: x.p.name, icon: 'leaf', meta: VV.catById(x.p.cat).label + ' · ' + x.p.sci, end: VV.money(x.p.price) };
      });
      var nq = VV.norm(q);
      var cats = VV.categories.filter(function (c) { return c.id !== 'todas' && (VV.norm(c.label).indexOf(nq) > -1 || VV.norm(c.title).indexOf(nq) > -1); }).slice(0, 3).map(function (c) {
        return { type: 'cat', id: c.id, label: c.title, icon: c.icon, meta: 'Categoria' };
      });
      if (prods.length) groups.push({ title: 'Plantas e vasos', items: prods });
      if (cats.length) groups.push({ title: 'Categorias', items: cats });
      groups.push({ title: prods.length || cats.length ? 'Ver tudo' : 'Sem sugestões', items: [{ type: 'query', label: 'Buscar por “' + q + '”', icon: 'search', meta: prods.length || cats.length ? 'Ver todos os resultados no catálogo' : 'Nenhuma sugestão encontrada. Veja o catálogo.' }] });
    }
    return groups;
  }

  function render() {
    var q = input.value;
    var groups = build(q), n = 0, html = '';
    items = [];
    groups.forEach(function (g, gi) {
      var gid = 'sg-' + gi;
      html += '<div class="sg" role="group" aria-labelledby="' + gid + '"><div class="sg__title" id="' + gid + '"><span>' + VV.esc(g.title) + '</span>' +
        (g.clear ? '<button type="button" class="sg__clear" data-clear-recents>Limpar</button>' : '') + '</div>';
      g.items.forEach(function (it) {
        it.i = n;
        items.push(it);
        html += '<div class="sg__opt" role="option" id="opt-' + n + '" aria-selected="false" data-i="' + n + '">' +
          '<span class="icon-circle">' + VV.icon(it.icon, 'icon--sm') + '</span>' +
          '<span class="sg__txt"><strong>' + (it.type === 'query' ? VV.esc(it.label) : mark(it.label, q)) + '</strong><small>' + VV.esc(it.meta) + '</small></span>' +
          (it.end ? '<span class="sg__end">' + VV.esc(it.end) + '</span>' : '') + '</div>';
        n++;
      });
      html += '</div>';
    });
    list.innerHTML = html;
    active = -1;
    input.removeAttribute('aria-activedescendant');
    status.textContent = items.length + (items.length === 1 ? ' sugestão disponível' : ' sugestões disponíveis');
  }

  function setActive(i) {
    var prev = $('[aria-selected="true"]', list);
    if (prev) prev.setAttribute('aria-selected', 'false');
    active = i;
    if (i < 0) { input.removeAttribute('aria-activedescendant'); return; }
    var el = $('#opt-' + i, list);
    if (!el) return;
    el.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', el.id);
    el.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    if (VV.isMobile()) {
      root.classList.add('is-full');
      document.documentElement.classList.add('search-open');
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Buscar plantas');
    }
    render();
  }
  function close(opts) {
    opts = opts || {};
    if (!isOpen) return;
    isOpen = false;
    clearTimeout(timer);
    setLoading(false);
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    var wasFull = root.classList.contains('is-full');
    root.classList.remove('is-full');
    document.documentElement.classList.remove('search-open');
    root.removeAttribute('role');
    root.removeAttribute('aria-modal');
    root.removeAttribute('aria-label');
    if (wasFull || opts.refocus) {
      if (window.matchMedia('(pointer: coarse)').matches) input.blur();
      else { skipOpen = true; input.focus({ preventScroll: true }); skipOpen = false; }
    }
  }
  function setLoading(on) {
    iconWrap.classList.toggle('is-loading', on);
    iconWrap.innerHTML = on ? VV.icon('loader-circle', 'icon--sm icon--spin') : VV.icon('search', 'icon--sm');
  }

  function go(hash) {
    close();
    if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
    else location.hash = hash;
  }
  function choose(it) {
    if (!it) return;
    if (it.type === 'product') {
      VV.recents.add(it.label);
      close();
      VV.openProduct && VV.openProduct(it.id, input);
    } else if (it.type === 'cat') {
      go('#/catalogo?cat=' + it.id);
    } else if (it.type === 'term') {
      VV.recents.add(it.label);
      input.value = it.label;
      go('#/catalogo?q=' + encodeURIComponent(it.label));
    } else {
      var q = input.value.trim();
      if (q) VV.recents.add(q);
      go('#/catalogo?q=' + encodeURIComponent(q));
    }
  }

  /* ---- eventos ---- */
  input.addEventListener('focus', function () { if (!skipOpen) open(); });
  input.addEventListener('click', function () { open(); });
  input.addEventListener('input', function () {
    open();
    setLoading(true);
    clearTimeout(timer);
    timer = setTimeout(function () { render(); setLoading(false); }, 250);
  });
  input.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) open();
      if (!items.length) return;
      var next = k === 'ArrowDown' ? (active + 1) % items.length : (active <= 0 ? items.length - 1 : active - 1);
      setActive(next);
    } else if (k === 'Enter') {
      e.preventDefault();
      if (active > -1) choose(items[active]);
      else if (input.value.trim()) choose({ type: 'query' });
    } else if (k === 'Escape') {
      if (!isOpen) { if (input.value) { input.value = ''; } return; }
      e.preventDefault();
      if (root.classList.contains('is-full')) close();
      else if (input.value) { input.value = ''; render(); }
      else close();
    } else if (k === 'Home' && isOpen && active > -1) { e.preventDefault(); setActive(0); }
    else if (k === 'End' && isOpen && active > -1) { e.preventDefault(); setActive(items.length - 1); }
    else if (k === 'Tab' && root.classList.contains('is-full')) {
      e.preventDefault();
      (e.shiftKey ? backBtn : backBtn).focus();
    }
  });
  backBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && root.classList.contains('is-full')) { e.preventDefault(); input.focus(); }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
  backBtn.addEventListener('click', function () { close(); });

  list.addEventListener('mousedown', function (e) { e.preventDefault(); }); // mantém o foco no campo
  list.addEventListener('click', function (e) {
    if (e.target.closest('[data-clear-recents]')) { VV.recents.clear(); render(); input.focus(); return; }
    var o = e.target.closest('[role="option"]');
    if (o) choose(items[+o.getAttribute('data-i')]);
  });
  list.addEventListener('mousemove', function (e) {
    var o = e.target.closest('[role="option"]');
    if (o && +o.getAttribute('data-i') !== active) setActive(+o.getAttribute('data-i'));
  });
  document.addEventListener('pointerdown', function (e) {
    if (isOpen && !root.contains(e.target) && !root.classList.contains('is-full')) close();
  });
  root.addEventListener('focusout', function (e) {
    if (isOpen && !root.classList.contains('is-full') && e.relatedTarget && !root.contains(e.relatedTarget)) close();
  });

  /* Atalho global Ctrl/⌘ + K */
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      if (VV.overlay.any()) return;
      e.preventDefault();
      input.focus();
      input.select();
    }
  });

  VV.search = {
    setValue: function (v) { input.value = v || ''; },
    close: function () { close(); }
  };
})();
