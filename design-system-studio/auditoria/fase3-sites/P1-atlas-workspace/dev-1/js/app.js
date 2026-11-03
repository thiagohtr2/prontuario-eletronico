/* Roteador por hash (funciona aberto direto do disco via file://).
   O endereço sem rota abre direto na tela de entrar (fluxo "Apenas login"). */
(function () {
  var A = window.Atlas;
  var u = A.u;
  var P = A.pages;

  var AUTH = ['entrar', 'cadastro', 'recuperar-senha'];
  var APP = {
    inicio: P.inicio,
    painel: P.painel,
    projetos: function (ctx) { return ctx.parts.length >= 3 ? P.item(ctx) : ctx.parts.length === 2 ? P.projeto(ctx) : P.projetos(ctx); },
    tarefas: P.tarefas,
    calendario: P.calendario,
    pessoas: P.pessoas,
    mensagens: P.mensagens,
    relatorios: P.relatorios,
    configuracoes: P.configuracoes,
    ajuda: P.ajuda,
    perfil: P.perfil,
    notificacoes: P.notificacoes,
    mais: P.mais
  };

  var root, lastHash = null, first = true;

  function parse() {
    var h = location.hash || '';
    if (h.indexOf('#/') !== 0) h = '#/';
    var s = h.slice(2);
    var qi = s.indexOf('?');
    var path = qi >= 0 ? s.slice(0, qi) : s;
    var qs = qi >= 0 ? s.slice(qi + 1) : '';
    var query = {};
    qs.split('&').filter(Boolean).forEach(function (kv) {
      var i = kv.indexOf('=');
      var k = i >= 0 ? kv.slice(0, i) : kv;
      var v = i >= 0 ? kv.slice(i + 1) : '1';
      try { query[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { query[k] = v; }
    });
    return { hash: h, parts: path.split('/').filter(Boolean), query: query };
  }

  function focusHeading(container) {
    var h = container.querySelector('h1');
    if (!h) return;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }

  function render() {
    var r = parse();
    var session = A.session.get();
    var page = r.parts[0] || '';

    if (!page) { location.replace(session ? '#/inicio' : '#/entrar'); return; }

    A.pop.close(false);
    A.tip.hide();

    if (AUTH.indexOf(page) >= 0) {
      if (session && page === 'entrar') { location.replace('#/inicio'); return; }
      if (A.shell.mounted()) A.shell.unmount();
      A.authScreens[page](root, r);
      document.title = ({ entrar: 'Entrar', cadastro: 'Criar conta', 'recuperar-senha': 'Recuperar senha' })[page] + ' · Atlas Workspace';
      window.scrollTo(0, 0);
      if (!first) focusHeading(root);
      lastHash = r.hash;
      first = false;
      return;
    }

    if (!session) {
      location.replace('#/entrar' + (APP[page] ? '?next=' + encodeURIComponent(r.hash) : ''));
      return;
    }

    if (!A.shell.mounted()) A.shell.mount(root);
    A.shell.saveScroll(lastHash);

    var def = APP[page] ? APP[page](r) : P.notFound('Página não encontrada', 'O endereço acessado não existe no Atlas Workspace.', '#/inicio', 'Ir para o início', '');
    A.shell.update({ page: page, nav: def.nav, title: def.title, crumbs: def.crumbs });

    // um contêiner novo por página: os ouvintes da página anterior vão embora com ele
    var content = A.shell.content();
    var host = document.createElement('div');
    host.className = 'page-host';
    host.innerHTML = def.html;
    content.innerHTML = '';
    content.appendChild(host);
    if (def.mount) def.mount(host);

    document.title = def.title + ' · Atlas Workspace';
    A.shell.afterRender(r.hash);
    if (!first && !def.focusSelf) focusHeading(host);
    lastHash = r.hash;
    first = false;
  }

  A.router = { render: render, parse: parse };

  function start() {
    root = document.getElementById('root');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('hashchange', render);
    // pular para o conteúdo sem alterar a rota
    var skip = document.querySelector('.skip-link');
    if (skip) skip.addEventListener('click', function (e) {
      e.preventDefault();
      var m = document.getElementById('main');
      if (m) { var h = m.querySelector('h1') || m; if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus(); }
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
