/* ==========================================================================
   App: roteamento por hash (funciona em file://), sessão simulada e
   orquestração entre login, shell e dashboard.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui, $ = ui.$;

  var AUTH_KEY = 'nx.auth';
  var ESTADOS = ['erro', 'vazio', 'carregando'];
  var state = { period: 'p30', loggedOut: false, started: false, lastKind: null };

  function isAuth() { return ui.store.get('sessionStorage', AUTH_KEY) === '1' || state.memAuth === true; }
  function setAuth(on) {
    state.memAuth = on;
    if (on) ui.store.set('sessionStorage', AUTH_KEY, '1'); else ui.store.remove('sessionStorage', AUTH_KEY);
  }

  function parseHash() {
    var h = w.location.hash.replace(/^#\/?/, '');
    var q = {}, i = h.indexOf('?');
    if (i >= 0) {
      h.slice(i + 1).split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
      });
      h = h.slice(0, i);
    }
    return { path: h.replace(/\/+$/, ''), query: q };
  }

  function redirect(path) { w.location.replace('#/' + path); }

  function showScreen(which) {
    $('#screen-login').hidden = which !== 'login';
    $('#screen-app').hidden = which !== 'app';
    $('#skip-link').textContent = 'Ir para o conteúdo';
  }

  function teardown() {
    if (NX.dashboard.current) NX.dashboard.current.destroy();
    ui.closePopover(false);
  }

  function route() {
    var r = parseHash(), path = r.path, authed = isAuth();

    if (path === '') { redirect(authed ? 'painel/visao-geral' : 'login'); return; }
    if (path === 'painel') { redirect('painel/visao-geral'); return; }

    /* ---- Telas de acesso ---- */
    if (path === 'login' || path === 'recuperar') {
      if (authed) { redirect('painel/visao-geral'); return; }
      if (w.location.hash !== '#/' + path) { redirect(path); return; }
      teardown();
      showScreen('login');
      NX.login.reset();
      NX.login.show(path === 'recuperar' ? 'forgot' : 'signin');
      NX.login.setStatus(path === 'login' && state.loggedOut ? 'Sessão encerrada com segurança.' : '');
      state.loggedOut = false;
      state.lastKind = 'login';
      w.scrollTo(0, 0);
      return;
    }

    /* ---- Área autenticada ---- */
    if (!authed) { redirect('login'); return; }
    var info = NX.resolveRoute(path);
    if (!info) { redirect('painel/visao-geral'); return; }

    teardown();
    showScreen('app');
    NX.shell.beforeRender();
    var view = $('#view');
    var estado = ESTADOS.indexOf(r.query.estado) >= 0 ? r.query.estado : null;
    if (info.kind === 'dashboard') {
      NX.dashboard.render(view, info.viewId, {
        getPeriod: function () { return state.period; },
        estado: estado
      });
    } else {
      NX.dashboard.renderPlaceholder(view, info);
    }
    NX.shell.setRoute(info);
    d.title = 'Nexo Capital · ' + info.title;
    ui.announce('Página: ' + info.title);
    w.scrollTo(0, 0);
    state.lastKind = 'app';
  }

  function logout() {
    setAuth(false);
    state.loggedOut = true;
    w.location.hash = '#/login';
  }

  function init() {
    ui.hydrateIcons(d);
    ui.initTooltips();
    ui.initKeyboardScroll();

    NX.login.init(function () {
      setAuth(true);
      w.location.hash = '#/painel/visao-geral';
    });

    NX.shell.init({
      onLogout: logout,
      getPeriod: function () { return state.period; },
      setPeriod: function (id) {
        state.period = id;
        NX.shell.updatePeriodLabel();
        if (NX.dashboard.current) NX.dashboard.current.refresh(true);
      },
      onUnit: function () {
        if (NX.dashboard.current) NX.dashboard.current.refresh(true);
      }
    });

    /* "Ir para o conteúdo": não pode alterar o hash (usado pelo roteador) */
    $('#skip-link').addEventListener('click', function (e) {
      e.preventDefault();
      var t = !$('#screen-app').hidden ? $('#main') : $('#login-main');
      if (t) t.focus();
    });

    w.addEventListener('hashchange', route);
    state.started = true;
    route();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
