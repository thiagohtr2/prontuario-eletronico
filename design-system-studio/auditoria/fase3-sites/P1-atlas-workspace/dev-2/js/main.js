/* Roteador por hash (funciona em file://) e inicialização.
   Rotas públicas: #/login (padrão), #/cadastro, #/recuperar, #/termos, #/privacidade.
   Rotas internas (exigem sessão simulada): #/painel, #/inicio, #/projetos[/:id[/:pagina]], #/tarefas, ... */
(function () {
  'use strict';
  const A = window.Atlas;
  const root = document.getElementById('root');

  const PUBLIC = { '': 'login', login: 'login', cadastro: 'cadastro', recuperar: 'recuperar', termos: 'termos', privacidade: 'privacidade' };
  const PUBLIC_TITLES = { login: 'Entrar', cadastro: 'Criar conta', recuperar: 'Recuperar senha', termos: 'Termos de uso', privacidade: 'Política de privacidade' };

  let cleanup = null;
  let currentKey = null;
  let firstRender = true;
  const scrollPos = {};

  function parse() {
    const raw = location.hash.replace(/^#/, '');
    const [p, q] = raw.split('?');
    const path = '/' + p.replace(/^\/+/, '').replace(/\/+$/, '');
    return { path: path === '/' ? '/' : path, query: Object.fromEntries(new URLSearchParams(q || '')), qs: q ? '?' + q : '' };
  }

  function render() {
    const { path, query, qs } = parse();
    const first = path.split('/').filter(Boolean)[0] || '';

    if (currentKey != null) scrollPos[currentKey] = window.scrollY;
    if (cleanup) { try { cleanup(); } catch (e) { /* ignora */ } cleanup = null; }
    A.ui.closePopover();
    A.ui.hideTip();

    // ---------- rotas públicas ----------
    if (Object.prototype.hasOwnProperty.call(PUBLIC, first) && path.split('/').filter(Boolean).length <= 1) {
      const kind = PUBLIC[first];
      if (A.shell.mounted) A.shell.unmount();
      root.innerHTML = '';
      root.inert = false;
      if (kind === 'login') cleanup = A.authViews.login(root);
      else if (kind === 'cadastro') cleanup = A.authViews.cadastro(root);
      else if (kind === 'recuperar') cleanup = A.authViews.recuperar(root);
      else A.authViews.legal(root, kind);
      document.title = `${PUBLIC_TITLES[kind]} — ${A.data.brand.name}`;
      currentKey = path;
      window.scrollTo(0, 0);
      const flash = A.session.get('atlas.flash', '');
      if (flash) { A.session.remove('atlas.flash'); A.ui.toast(flash); }
      if (!firstRender) { const h = root.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
      firstRender = false;
      return;
    }

    // ---------- rotas internas ----------
    if (!A.auth.isAuthed()) {
      A.session.set('atlas.next', path + qs);
      location.replace('#/login');
      return;
    }
    const route = A.pages.resolve(path);
    if (!route) { location.replace('#/painel'); return; }
    route.query = query;

    if (!A.shell.mounted) { root.innerHTML = ''; A.shell.mount(root); }
    A.shell.update(route);

    const hostWrap = A.shell.host();
    hostWrap.innerHTML = '';
    const page = document.createElement('div'); // elemento novo a cada rota: descarta listeners antigos
    page.className = 'page-inner';
    hostWrap.appendChild(page);
    cleanup = route.render(page, route) || null;
    document.title = `${route.title} — ${A.data.brand.name}`;

    currentKey = path;
    const saved = scrollPos[path];
    if (A.isMobile() && saved != null) window.scrollTo(0, saved); else window.scrollTo(0, 0);

    if (!firstRender) {
      const h = page.querySelector('h1');
      if (h) h.focus({ preventScroll: true });
    }
    firstRender = false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    A.forms.keyboardAssist();
    // "Ir para o conteúdo" sem alterar o hash do roteador
    document.addEventListener('click', (e) => {
      const skip = e.target.closest('.skip-link');
      if (!skip) return;
      e.preventDefault();
      const m = document.getElementById('main');
      if (m) { m.focus({ preventScroll: false }); m.scrollIntoView(); }
    });
    window.addEventListener('hashchange', render);
    render();
  });
})();
