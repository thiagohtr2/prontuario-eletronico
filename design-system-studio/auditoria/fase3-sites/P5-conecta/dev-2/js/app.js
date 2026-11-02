/* Conecta — roteador, sessão e ações globais */
(function (C) {
  'use strict';
  var $ = C.$, $$ = C.$$, esc = C.esc, icon = C.icon;
  var firstRender = true;
  var pendingHash = '';

  /* ---------------- rotas ---------------- */
  function parseHash() {
    var raw = (location.hash || '').replace(/^#/, '') || '/feed';
    var parts = raw.split('?');
    var segs = parts[0].split('/').filter(Boolean);
    return { name: segs[0] || 'feed', arg: segs[1] || '', params: new URLSearchParams(parts[1] || '') };
  }

  function render(opts) {
    opts = opts || {};
    var r = parseHash();
    var view = C.views[r.name];
    if (!view) { location.replace('#/feed'); return; }
    var main = $('#main');
    var scrollY = window.scrollY;
    main.innerHTML = view.render(r.params, r.arg);
    if (view.mount) view.mount(main, r.params, r.arg);
    var key = view.activeKey ? view.activeKey(r.arg) : view.key;
    C.shell.setActive(key);
    var h1 = $('h1', main);
    document.title = (h1 ? h1.textContent : view.title) + ' · Conecta';
    C.shell.closeAll();
    if (opts.keep) { window.scrollTo(0, scrollY); }
    else {
      window.scrollTo(0, 0);
      C.shell.resetScroll();
      if (!firstRender && h1) h1.focus({ preventScroll: true });
    }
    firstRender = false;
  }

  /** Re-renderiza preservando rolagem e foco. */
  function rerender() {
    var ae = document.activeElement, sel = null;
    if (ae && ae.dataset && ae.dataset.action) {
      sel = '[data-action="' + ae.dataset.action + '"]' + (ae.dataset.id ? '[data-id="' + ae.dataset.id + '"]' : '') + (ae.dataset.setting ? '[data-setting="' + ae.dataset.setting + '"]' : '');
    }
    render({ keep: true });
    if (sel) { var el = $(sel, $('#main')); if (el) el.focus({ preventScroll: true }); }
  }

  /* ---------------- sessão ---------------- */
  function login(user) {
    var fresh = !!user.fresh;
    C.state = C.freshState();
    var me = C.state.people.me;
    C.state.user = { name: user.name, email: user.email };
    if (!user.demo) {
      me.name = user.name; me.role = 'Membro da comunidade'; me.handle = '@' + user.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
      me.email = user.email; me.bio = 'Novo por aqui. Ainda escrevendo a minha apresentação.'; me.city = 'Brasil'; me.since = 'hoje';
      me.posts = 0; me.followers = '0'; me.following = 0; me.interests = ['Conhecer pessoas'];
      C.state.posts = C.state.posts.filter(function (p) { return p.author !== 'me'; });
    }
    $('#auth').hidden = true;
    $('#app').hidden = false;
    document.body.classList.add('is-app');
    C.shell.init();
    C.shell.refreshUser();
    C.shell.renderStories(); C.shell.renderNotifs();
    firstRender = true;
    var target = pendingHash && /^#\//.test(pendingHash) ? pendingHash : '#/feed';
    pendingHash = '';
    try { history.replaceState(null, '', location.pathname + target); } catch (e) { location.hash = target; }
    render();
    C.ui.toast(fresh ? 'Conta criada! Bem-vindo(a), ' + user.name.split(' ')[0] + '.' : 'Bem-vinda de volta, ' + user.name.split(' ')[0] + '.');
    var m = $('#main'); if (m) m.focus({ preventScroll: true });
  }

  function logout() {
    C.ui.closePopovers();
    C.state = C.freshState();
    $('#app').hidden = true;
    $('#auth').hidden = false;
    document.body.classList.remove('is-app');
    try { history.replaceState(null, '', location.pathname); } catch (e) { location.hash = ''; }
    C.auth.reset('Você saiu da conta. Até logo!');
    window.scrollTo(0, 0);
    var h = $('#panel-entrar h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  }

  /* ---------------- compor publicação ---------------- */
  function openCompose(trigger) {
    var cats = Object.keys(C.data.categories);
    var body =
      '<form id="compose-form" novalidate><div class="form-summary" id="compose-summary" role="alert" tabindex="-1"></div>' +
      '<div class="field field--filled"><label for="cp-title">Título</label><div class="field__control"><input id="cp-title" type="text" maxlength="80" autocomplete="off" aria-describedby="cp-title-err"></div><p class="field__error" id="cp-title-err"></p></div>' +
      '<div class="field field--filled" style="margin-top:16px"><label for="cp-text">Texto</label><div class="field__control"><textarea id="cp-text" rows="4" maxlength="500" aria-describedby="cp-text-err"></textarea></div><p class="field__error" id="cp-text-err"></p></div>' +
      '<div class="field field--filled" style="margin-top:16px"><label for="cp-cat">Categoria</label><div class="field__control"><select id="cp-cat">' +
      cats.map(function (k) { return '<option value="' + k + '">' + esc(C.data.categories[k].label) + '</option>'; }).join('') +
      '</select><span class="field__select-icon" aria-hidden="true">' + icon('chevron-down') + '</span></div></div></form>';
    var m = C.ui.modal({
      title: 'Nova publicação', body: body, trigger: trigger,
      footer: '<button type="button" class="btn btn--tonal" data-dismiss>Cancelar</button><button type="submit" form="compose-form" class="btn btn--primary" id="cp-submit">Publicar</button>',
      initialFocus: '#cp-title'
    });
    var form = $('#compose-form', m.root), sum = $('#compose-summary', m.root);
    var fT = $('#cp-title', m.root), fX = $('#cp-text', m.root);
    function err(input, id, msg) {
      var el = $('#' + id, m.root);
      if (msg) { input.setAttribute('aria-invalid', 'true'); el.innerHTML = icon('alert') + '<span>' + esc(msg) + '</span>'; } else { input.removeAttribute('aria-invalid'); el.innerHTML = ''; }
      return msg;
    }
    function vT() { var v = fT.value.trim(); return err(fT, 'cp-title-err', !v ? 'Dê um título à publicação' : v.length < 3 ? 'Use pelo menos 3 caracteres' : ''); }
    function vX() { var v = fX.value.trim(); return err(fX, 'cp-text-err', !v ? 'Escreva o texto da publicação' : ''); }
    fT.addEventListener('blur', vT); fX.addEventListener('blur', vX);
    fT.addEventListener('input', function () { if (fT.getAttribute('aria-invalid')) vT(); });
    fX.addEventListener('input', function () { if (fX.getAttribute('aria-invalid')) vX(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = [];
      var a = vT(), b = vX();
      if (a) errs.push({ f: { input: fT }, msg: a });
      if (b) errs.push({ f: { input: fX }, msg: b });
      if (errs.length) {
        sum.innerHTML = icon('alert') + '<div><strong>Corrija ' + (errs.length === 1 ? '1 campo' : errs.length + ' campos') + ' para continuar</strong><ul>' + errs.map(function (x) { return '<li><a href="#' + x.f.input.id + '" data-focus="' + x.f.input.id + '">' + esc(x.msg) + '</a></li>'; }).join('') + '</ul></div>';
        errs[0].f.input.focus();
        return;
      }
      sum.innerHTML = '';
      var btn = $('#cp-submit', m.root); btn.disabled = true; btn.textContent = 'Publicando…';
      var catKey = $('#cp-cat', m.root).value;
      var schemes = { viagens: [ 'sea', 4 ], fotografia: ['city', 3], cafe: ['cup', 1], musica: ['notes', 2], design: ['shapes', 5] };
      C.delay(600).then(function () {
        var id = 'u' + Date.now();
        C.state.posts.unshift({ id: id, author: 'me', cat: catKey, tag: 'Novo', time: 'agora', scene: schemes[catKey][0], scheme: schemes[catKey][1], likes: 0, own: true, created: true, title: fT.value.trim(), text: fX.value.trim() });
        C.state.people.me.posts += 1;
        C.state.loaded.add('feed');
        m.close();
        C.ui.toast('Publicação criada.');
        if (location.hash === '#/feed' || location.hash === '') render({ keep: false }); else location.hash = '#/feed';
      });
    });
  }

  /* ---------------- editar perfil ---------------- */
  function openEditProfile(trigger) {
    var me = C.state.people.me;
    var body =
      '<form id="edit-form" novalidate><div class="form-summary" id="edit-summary" role="alert" tabindex="-1"></div>' +
      '<div class="field field--filled"><label for="ep-name">Nome</label><div class="field__control"><input id="ep-name" type="text" autocomplete="name" value="' + esc(me.name) + '" aria-describedby="ep-name-err"></div><p class="field__error" id="ep-name-err"></p></div>' +
      '<div class="field field--filled" style="margin-top:16px"><label for="ep-role">Cargo</label><div class="field__control"><input id="ep-role" type="text" autocomplete="organization-title" value="' + esc(me.role) + '"></div></div>' +
      '<div class="field field--filled" style="margin-top:16px"><label for="ep-bio">Sobre</label><div class="field__control"><textarea id="ep-bio" rows="4" maxlength="240">' + esc(me.bio) + '</textarea></div></div></form>';
    var m = C.ui.modal({
      title: 'Editar perfil', body: body, trigger: trigger, initialFocus: '#ep-name',
      footer: '<button type="button" class="btn btn--tonal" data-dismiss>Cancelar</button><button type="submit" form="edit-form" class="btn btn--primary">Salvar</button>'
    });
    var name = $('#ep-name', m.root);
    function vN() {
      var v = name.value.trim(), el = $('#ep-name-err', m.root);
      var msg = !v ? 'Informe seu nome' : v.length < 2 ? 'Digite seu nome completo' : '';
      if (msg) { name.setAttribute('aria-invalid', 'true'); el.innerHTML = icon('alert') + '<span>' + esc(msg) + '</span>'; } else { name.removeAttribute('aria-invalid'); el.innerHTML = ''; }
      return msg;
    }
    name.addEventListener('blur', vN);
    name.addEventListener('input', function () { if (name.getAttribute('aria-invalid')) vN(); });
    $('#edit-form', m.root).addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = vN();
      if (msg) {
        $('#edit-summary', m.root).innerHTML = icon('alert') + '<div><strong>Corrija 1 campo para continuar</strong><ul><li><a href="#ep-name" data-focus="ep-name">' + esc(msg) + '</a></li></ul></div>';
        name.focus(); return;
      }
      me.name = name.value.trim(); me.role = $('#ep-role', m.root).value.trim(); me.bio = $('#ep-bio', m.root).value.trim();
      C.state.user.name = me.name;
      m.close();
      C.shell.refreshUser();
      rerender();
      C.ui.toast('Perfil atualizado.');
    });
  }

  /* ---------------- ações delegadas ---------------- */
  function onAction(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var a = el.dataset.action, id = el.dataset.id, S = C.state;
    switch (a) {
      case 'save-post':
        if (S.saved.has(id)) { S.saved.delete(id); C.ui.toast('Removido dos salvos.'); } else { S.saved.add(id); C.ui.toast('Publicação salva.'); }
        rerender(); break;
      case 'like-post':
        if (S.liked.has(id)) S.liked.delete(id); else S.liked.add(id);
        rerender(); break;
      case 'follow':
        if (S.following.has(id)) { S.following.delete(id); C.ui.toast('Você deixou de seguir ' + S.people[id].name + '.'); } else { S.following.add(id); C.ui.toast('Você começou a seguir ' + S.people[id].name + '.'); }
        rerender(); break;
      case 'join-group':
        var g = S.groups.filter(function (x) { return x.id === id; })[0]; g.joined = !g.joined;
        C.ui.toast(g.joined ? 'Você entrou no grupo ' + g.name + '.' : 'Você saiu do grupo ' + g.name + '.'); rerender(); break;
      case 'rsvp':
        var ev = S.events.filter(function (x) { return x.id === id; })[0]; ev.going = !ev.going;
        C.ui.toast(ev.going ? 'Presença confirmada.' : 'Presença cancelada.'); rerender(); break;
      case 'share':
        C.ui.toast('Link copiado (demonstração).'); break;
      case 'edit-profile': openEditProfile(el); break;
      case 'retry': S.loaded.delete(el.dataset.key); rerender(); break;
      case 'read-all': S.notifications.forEach(function (n) { n.unread = false; }); C.shell.updateBadges(); rerender(); C.ui.toast('Todas as notificações foram marcadas como lidas.'); break;
      case 'toggle-setting':
        var k = el.dataset.setting; S.settings[k] = !S.settings[k];
        if (k === 'simError') S.loaded.clear();
        rerender(); break;
      case 'logout': logout(); break;
    }
  }

  function init() {
    C.auth.init();
    document.addEventListener('click', onAction);
    $('#btn-new').addEventListener('click', function (e) { openCompose(e.currentTarget); });
    $('#main').addEventListener('click', function (e) {
      var n = e.target.closest('[data-notif]');
      if (n) { var o = C.state.notifications.filter(function (x) { return x.id === n.dataset.notif; })[0]; if (o) { o.unread = false; C.shell.updateBadges(); } }
    });
    window.addEventListener('hashchange', function () {
      if (!C.state.user) { pendingHash = location.hash; return; }
      render();
    });
    // link direto para uma rota do app: guarda e abre depois do login
    if (/^#\//.test(location.hash)) { pendingHash = location.hash; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignorar */ } }
  }

  C.app = { init: init, login: login, logout: logout, render: render, rerender: rerender };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.Conecta);
