/* =========================================================
   Estado global, sessão de demonstração e roteamento por hash.
   O endereço sem hash abre direto na tela de entrar.
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const $ = N.$;

  const DEMO_STATES = ['normal', 'loading', 'empty', 'error'];
  const qsState = new URLSearchParams(location.search).get('estado');
  const savedPeriod = N.store.get('nexo.prefs.period', '30d');
  const savedUnit = N.store.get('nexo.unit', 'sp');
  N.state = {
    period: N.PERIODS.some((p) => p.id === savedPeriod) ? savedPeriod : '30d',
    unit: N.UNITS.some((u) => u.id === savedUnit) ? savedUnit : 'sp',
    demo: DEMO_STATES.includes(qsState) ? qsState : 'normal'
  };
  N.setState = function (patch) {
    Object.assign(N.state, patch);
    if ('unit' in patch) N.store.set('nexo.unit', patch.unit);
    document.dispatchEvent(new CustomEvent('nexo:state', { detail: patch }));
  };

  N.logout = function () {
    N.session.set(null);
    location.hash = '#/entrar';
    N.toast('Você saiu da sua conta.');
  };

  function parse(hash) {
    const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const p0 = parts[0] || '';
    if (!p0 || p0 === 'entrar') return { name: 'login' };
    if (p0 === 'recuperar-senha') return { name: 'recover' };
    if (p0 === 'painel') {
      const tab = N.TABS.some((t) => t.id === parts[1]) ? parts[1] : 'visao-geral';
      return { name: 'app', page: 'painel', tab };
    }
    if (N.Pages.exists(p0)) return { name: 'app', page: p0 };
    return { name: 'unknown' };
  }

  let firstRender = true;
  let lastView = null;
  function onRoute() {
    const route = parse(location.hash);
    const loginView = $('#view-login');
    const appView = $('#view-app');
    if (route.name === 'unknown') { location.replace(N.session.get() ? '#/painel/visao-geral' : '#/entrar'); return; }
    if (route.name === 'login' || route.name === 'recover') {
      appView.hidden = true;
      loginView.hidden = false;
      document.body.dataset.view = 'login';
      N.closePopover(false);
      N.Login.show(route.name, !firstRender);
      if (lastView === 'app') window.scrollTo(0, 0);
      lastView = 'login';
      firstRender = false;
      return;
    }
    if (!N.session.get()) { location.replace('#/entrar'); return; }
    loginView.hidden = true;
    appView.hidden = false;
    document.body.dataset.view = 'app';
    N.Shell.init();
    const caps = N.Pages.render(route, $('#main'));
    N.Shell.update(route, caps);
    window.scrollTo(0, 0);
    if (!firstRender) N.Pages.focusTitle();
    lastView = 'app';
    firstRender = false;
  }

  function boot() {
    N.hydrateIcons();
    window.addEventListener('hashchange', onRoute);
    onRoute();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
