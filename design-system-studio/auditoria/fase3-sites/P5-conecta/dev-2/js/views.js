/* Conecta — páginas do app (feed, explorar, salvos, perfil, grupos, eventos, mensagens...) */
(function (C) {
  'use strict';
  var $ = C.$, $$ = C.$$, esc = C.esc, icon = C.icon, avatar = C.avatar, S = function () { return C.state; };
  var D = C.data;

  function person(id) { return S().people[id]; }
  function cat(id) { return D.categories[id] || D.categories.design; }

  /* ---------------- componentes de estado ---------------- */
  function emptyState(o) {
    return '<div class="state"><span class="icon-circle icon-circle--lg" aria-hidden="true">' + icon(o.icon || 'info') + '</span>' +
      '<h2>' + esc(o.title) + '</h2><p>' + esc(o.text) + '</p>' + (o.action || '') + '</div>';
  }
  function errorState(retryKey) {
    return '<div class="state state--error" role="alert"><span class="icon-circle icon-circle--lg" aria-hidden="true">' + icon('alert') + '</span>' +
      '<h2>Não foi possível carregar</h2><p>Verifique sua conexão e tente novamente.</p>' +
      '<button type="button" class="btn btn--primary" data-action="retry" data-key="' + retryKey + '">' + icon('refresh') + 'Tentar novamente</button></div>';
  }
  function skeletonCards(n) {
    var one = '<div class="card-skeleton"><div class="skeleton" style="aspect-ratio:16/9"></div><div class="card-skeleton__body">' +
      '<div class="skeleton" style="height:22px;width:30%"></div><div class="skeleton" style="height:20px;width:80%"></div>' +
      '<div class="skeleton" style="height:14px"></div><div class="skeleton" style="height:14px;width:90%"></div></div></div>';
    var out = ''; for (var i = 0; i < n; i++) out += one;
    return '<div class="grid" aria-hidden="true">' + out + '</div>';
  }
  function skeletonRows(n) {
    var out = '';
    for (var i = 0; i < n; i++) out += '<div class="list-card"><div class="skeleton" style="width:48px;height:48px;border-radius:50%;flex:none"></div><div style="flex:1;display:grid;gap:8px"><div class="skeleton" style="height:16px;width:50%"></div><div class="skeleton" style="height:14px;width:80%"></div></div></div>';
    return '<div class="stack" aria-hidden="true">' + out + '</div>';
  }

  /** Carrega uma lista com estados de carregamento, erro e conteúdo. */
  var loadToken = 0;
  function loadInto(host, key, skeleton, render, after) {
    var token = ++loadToken;
    function finish() {
      if (token !== loadToken || !document.contains(host)) return;
      host.removeAttribute('aria-busy');
      if (S().settings.simError) { host.innerHTML = errorState(key); return; }
      S().loaded.add(key);
      host.innerHTML = render();
      if (after) after(host);
    }
    if (S().loaded.has(key) && !S().settings.simError) { host.innerHTML = render(); if (after) after(host); return; }
    host.setAttribute('aria-busy', 'true');
    host.innerHTML = skeleton;
    setTimeout(finish, C.reducedMotion() ? 0 : 650);
  }

  /* ---------------- card de conteúdo ---------------- */
  function cardHTML(p) {
    var a = person(p.author), c = cat(p.cat), saved = S().saved.has(p.id);
    return '<article class="card" data-post="' + p.id + '">' +
      '<div class="card__media">' + C.art(p.scene, p.scheme, 'Ilustração da publicação: ' + p.title) +
      '<button type="button" class="icon-btn card__save" data-action="save-post" data-id="' + p.id + '" aria-pressed="' + saved + '" aria-label="Salvar publicação: ' + esc(p.title) + '">' + icon('bookmark', saved ? 'icon--filled' : '') + '</button></div>' +
      '<div class="card__body">' +
      '<div class="card__kicker">' + (p.tag ? '<span class="tag ' + (p.tag === 'Novo' ? 'tag--new' : '') + '">' + esc(p.tag) + '</span>' : '') +
      '<span class="cat"><span class="icon-circle" aria-hidden="true">' + icon(c.icon) + '</span>' + esc(c.label) + '</span></div>' +
      '<h3 class="card__title">' + esc(p.title) + '</h3>' +
      '<p class="card__text">' + esc(p.text) + '</p>' +
      '<div class="card__footer"><div class="meta">' + avatar(a, 32) + '<span class="meta__txt"><span class="meta__name">' + esc(a.name) + '</span><span class="meta__time">' + esc(p.time) + '</span></span></div>' +
      '<a class="btn btn--primary card__action" href="#/post/' + p.id + '">Ver publicação<span class="sr-only">: ' + esc(p.title) + '</span></a></div>' +
      '</div></article>';
  }
  function gridHTML(posts) { return '<div class="grid">' + posts.map(cardHTML).join('') + '</div>'; }
  function feedPosts() { return S().posts.filter(function (p) { return !p.own || p.created; }); }

  function pageHead(title, sub) {
    return '<div class="page-head"><h1 tabindex="-1">' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>';
  }

  /* ---------------- views ---------------- */
  var views = {};

  views.feed = {
    title: 'Início', key: 'feed',
    render: function () { return pageHead('Início', 'Publicações de quem você segue.') + '<div id="list"></div>'; },
    mount: function (root) {
      loadInto($('#list', root), 'feed', skeletonCards(6), function () {
        var posts = feedPosts();
        return posts.length ? gridHTML(posts) : emptyState({ icon: 'image', title: 'Nada por aqui ainda', text: 'Siga pessoas ou crie sua primeira publicação.' });
      });
    }
  };

  views.explorar = {
    title: 'Explorar', key: 'explorar',
    render: function (params) {
      var q = params.get('q') || '';
      return pageHead('Explorar', 'Descubra publicações e pessoas da comunidade.') +
        '<div class="stack" style="gap:16px">' +
        '<div class="field field--filled"><label for="explore-q">Buscar publicações e pessoas</label><div class="field__control"><input id="explore-q" type="search" autocomplete="off" enterkeyhint="search" value="' + esc(q) + '" placeholder="Ex.: café, fotografia, Paraty"></div></div>' +
        '<div class="chips" role="group" aria-label="Filtrar por categoria" id="chips"></div>' +
        '</div><div id="list" style="margin-top:16px" aria-live="polite"></div>' +
        '<section class="section" aria-labelledby="sug-title"><h2 id="sug-title">Pessoas para seguir</h2><div class="stack" id="people"></div></section>';
    },
    mount: function (root, params) {
      var input = $('#explore-q', root), chips = $('#chips', root), list = $('#list', root);
      var state = { q: params.get('q') || '', cat: 'todos' };
      chips.innerHTML = [['todos', 'Todos']].concat(Object.keys(D.categories).map(function (k) { return [k, D.categories[k].label]; })).map(function (c) {
        return '<button type="button" class="chip" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === 'todos') + '">' + c[1] + '</button>';
      }).join('');
      function results() {
        var q = state.q.trim().toLowerCase();
        return feedPosts().filter(function (p) {
          if (state.cat !== 'todos' && p.cat !== state.cat) return false;
          if (!q) return true;
          var hay = (p.title + ' ' + p.text + ' ' + person(p.author).name + ' ' + cat(p.cat).label).toLowerCase();
          return hay.indexOf(q) >= 0;
        });
      }
      function renderResults() {
        var r = results();
        list.innerHTML = r.length
          ? '<p class="sr-only" role="status">' + r.length + ' resultados</p>' + gridHTML(r)
          : emptyState({ icon: 'search', title: 'Nenhum resultado', text: state.q ? 'Não encontramos nada para “' + state.q + '”. Tente outro termo ou limpe os filtros.' : 'Nenhuma publicação nesta categoria.',
            action: '<button type="button" class="btn btn--tonal" data-action="clear-search">Limpar busca</button>' });
        $('.sr-only[role="status"]', list);
      }
      function renderPeople() {
        $('#people', root).innerHTML = Object.keys(S().people).filter(function (id) { return id !== 'me'; }).map(personRow).join('');
      }
      loadInto(list, 'explorar', skeletonCards(3), function () { return ''; }, function () { renderResults(); });
      renderPeople();
      input.addEventListener('input', function () { state.q = input.value; renderResults(); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; state.q = ''; renderResults(); input.blur(); } });
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('[data-cat]'); if (!b) return;
        state.cat = b.dataset.cat;
        $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        renderResults();
      });
      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-action="clear-search"]')) { input.value = ''; state.q = ''; state.cat = 'todos'; $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.cat === 'todos' ? 'true' : 'false'); }); renderResults(); input.focus(); }
      });
      if (params.get('focus')) input.focus();
    }
  };

  function personRow(id) {
    var p = person(id), f = S().following.has(id);
    return '<div class="list-card list-card--stack"><a href="#/perfil/' + id + '" aria-label="Ver perfil de ' + esc(p.name) + '" style="flex:none">' + avatar(p, 48) + '</a>' +
      '<div class="list-card__main"><a class="list-card__title" href="#/perfil/' + id + '" style="text-decoration:none;color:var(--text)">' + esc(p.name) + '</a><span class="list-card__sub">' + esc(p.role) + ' · ' + esc(p.city) + '</span></div>' +
      followBtn(id, f) + '</div>';
  }
  function followBtn(id, following) {
    return '<button type="button" class="btn ' + (following ? 'btn--outline' : 'btn--primary') + '" data-action="follow" data-id="' + id + '" aria-pressed="' + following + '">' + (following ? 'Seguindo' : 'Seguir') +
      '<span class="sr-only"> ' + esc(person(id).name) + '</span></button>';
  }

  views.salvos = {
    title: 'Salvos', key: 'salvos',
    render: function () { return pageHead('Salvos', 'Publicações que você guardou para ver depois.') + '<div id="list"></div>'; },
    mount: function (root) {
      loadInto($('#list', root), 'salvos', skeletonCards(3), function () {
        var posts = S().posts.filter(function (p) { return S().saved.has(p.id); });
        return posts.length ? gridHTML(posts) : emptyState({ icon: 'bookmark', title: 'Nada salvo ainda', text: 'Toque no marcador de uma publicação para guardá-la aqui.',
          action: '<a class="btn btn--primary" href="#/explorar">Explorar publicações</a>' });
      });
    }
  };

  views.post = {
    title: 'Publicação', key: 'feed',
    render: function (params, arg) {
      var p = S().posts.filter(function (x) { return x.id === arg; })[0];
      if (!p) return emptyState({ icon: 'alert', title: 'Publicação não encontrada', text: 'Ela pode ter sido removida.', action: '<a class="btn btn--primary" href="#/feed">Voltar ao início</a>' });
      var a = person(p.author), c = cat(p.cat), saved = S().saved.has(p.id), liked = S().liked.has(p.id);
      var comments = S().comments[p.id] || [{ who: 'diego', text: 'Ficou ótimo, parabéns!' }, { who: 'carla', text: 'Adorei os detalhes. Obrigada por compartilhar.' }];
      return '<a class="back-link" href="#/feed">' + icon('arrow-left') + 'Voltar ao feed</a>' +
        '<article class="post"><div class="post__media">' + C.art(p.scene, p.scheme, 'Ilustração da publicação: ' + p.title) + '</div><div class="post__body">' +
        '<div class="card__kicker">' + (p.tag ? '<span class="tag ' + (p.tag === 'Novo' ? 'tag--new' : '') + '">' + esc(p.tag) + '</span>' : '') + '<span class="cat"><span class="icon-circle" aria-hidden="true">' + icon(c.icon) + '</span>' + esc(c.label) + '</span></div>' +
        '<h1 tabindex="-1">' + esc(p.title) + '</h1>' +
        '<a class="post__author" href="#/perfil/' + (p.author === 'me' ? '' : p.author) + '">' + avatar(a, 40) + '<span class="meta__txt"><span class="meta__name">' + esc(a.name) + '</span><span class="meta__time">' + esc(a.role) + ' · ' + esc(p.time) + '</span></span></a>' +
        '<p class="post__text">' + esc(p.text) + '</p>' +
        '<div class="post__actions">' +
        '<button type="button" class="btn btn--outline" data-action="like-post" data-id="' + p.id + '" aria-pressed="' + liked + '">' + icon('heart', liked ? 'icon--filled' : '') + '<span>' + (p.likes + (liked ? 1 : 0)) + ' curtidas</span></button>' +
        '<button type="button" class="btn btn--outline" data-action="save-post" data-id="' + p.id + '" aria-pressed="' + saved + '">' + icon('bookmark', saved ? 'icon--filled' : '') + '<span>' + (saved ? 'Salvo' : 'Salvar') + '</span></button>' +
        '<button type="button" class="btn btn--tonal" data-action="share">' + icon('share') + 'Compartilhar</button></div>' +
        '<section class="comments" aria-labelledby="com-title"><h2 id="com-title">Comentários</h2><div id="comments" class="comments">' + comments.map(commentHTML).join('') + '</div>' +
        '<form class="comment-form" id="comment-form" data-id="' + p.id + '" novalidate><div class="field field--filled"><label for="comment-text">Escreva um comentário</label><div class="field__control"><input id="comment-text" type="text" autocomplete="off" aria-describedby="comment-err"></div><p class="field__error" id="comment-err"></p></div>' +
        '<button type="submit" class="btn btn--primary">Comentar</button></form></section>' +
        '</div></article>';
    },
    mount: function (root) {
      var form = $('#comment-form', root);
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = $('#comment-text', form), err = $('#comment-err', form), v = input.value.trim();
        if (!v) { input.setAttribute('aria-invalid', 'true'); err.innerHTML = icon('alert') + '<span>Escreva algo antes de comentar</span>'; input.focus(); return; }
        input.removeAttribute('aria-invalid'); err.innerHTML = '';
        var id = form.dataset.id;
        var list = S().comments[id] || [{ who: 'diego', text: 'Ficou ótimo, parabéns!' }, { who: 'carla', text: 'Adorei os detalhes. Obrigada por compartilhar.' }];
        list.push({ who: 'me', text: v });
        S().comments[id] = list;
        $('#comments', root).insertAdjacentHTML('beforeend', commentHTML({ who: 'me', text: v }));
        input.value = '';
        C.ui.toast('Comentário publicado.');
      });
      $('#comment-text', form).addEventListener('input', function (e) { if (e.target.value.trim()) { e.target.removeAttribute('aria-invalid'); $('#comment-err', form).innerHTML = ''; } });
    }
  };
  function commentHTML(c) {
    var p = person(c.who);
    return '<div class="comment">' + avatar(p, 32) + '<div class="comment__body"><strong>' + esc(c.who === 'me' ? 'Você' : p.name) + '</strong><p>' + esc(c.text) + '</p></div></div>';
  }

  /* ---------------- perfil ---------------- */
  views.perfil = {
    title: 'Perfil', key: 'perfil',
    activeKey: function (arg) { return !arg || arg === 'me' ? 'perfil' : ''; },
    render: function (params, arg) {
      var id = (!arg || arg === 'me') ? 'me' : arg;
      var p = S().people[id];
      if (!p) return emptyState({ icon: 'user', title: 'Perfil não encontrado', text: 'Esta pessoa não existe ou saiu da comunidade.', action: '<a class="btn btn--primary" href="#/explorar">Explorar pessoas</a>' });
      var own = id === 'me';
      var following = S().following.has(id);
      var followers = own ? p.followers : p.followers;
      return '<article class="profile" data-person="' + id + '">' +
        '<div class="profile__cover">' + C.art(p.scene, p.scheme, '') + '</div>' +
        '<div class="profile__head"><div class="profile__avatar">' + avatar(p, 88) + '</div>' +
        '<div class="profile__id"><h1 class="profile__name" tabindex="-1">' + esc(p.name) + '</h1><p class="profile__role">' + esc(p.role) + '</p><p class="profile__handle">' + esc(p.handle) + '</p></div>' +
        '<div class="profile__actions">' +
        (own
          ? '<button type="button" class="btn btn--primary" data-action="edit-profile">' + icon('pencil') + 'Editar perfil</button><button type="button" class="btn btn--tonal" data-action="share">' + icon('share') + 'Compartilhar</button>'
          : followBtn(id, following) + '<a class="btn btn--tonal" href="#/mensagens">' + icon('message-circle') + 'Mensagem</a>') +
        '</div></div>' +
        '<dl class="profile__stats"><div><dt>Publicações</dt><dd>' + p.posts + '</dd></div><div><dt>Seguidores</dt><dd>' + esc(followers) + '</dd></div><div><dt>Seguindo</dt><dd>' + p.following + '</dd></div></dl>' +
        '<div class="tabs tabs--pill profile__tabs" role="tablist" aria-label="Seções do perfil">' +
        ['pub:Publicações', 'fotos:Fotos', 'sobre:Sobre'].map(function (t, i) { var k = t.split(':'); return '<button class="tab" role="tab" type="button" id="ptab-' + k[0] + '" aria-controls="ppanel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + k[0] + '">' + k[1] + '</button>'; }).join('') + '</div>' +
        '<div class="profile__panel" id="ppanel" role="tabpanel" aria-labelledby="ptab-pub" tabindex="0"></div></article>';
    },
    mount: function (root, params, arg) {
      var id = (!arg || arg === 'me') ? 'me' : arg;
      var p = S().people[id];
      var panel = $('#ppanel', root);
      if (!p || !panel) return;
      function tabContent(k) {
        if (k === 'pub') {
          var posts = S().posts.filter(function (x) { return x.author === id; });
          return posts.length ? gridHTML(posts) : emptyState({ icon: 'image', title: 'Sem publicações', text: p.name.split(' ')[0] + ' ainda não publicou nada.' });
        }
        if (k === 'fotos') {
          var scenes = ['hills', 'city', 'sea', 'cup', 'notes', 'shapes'];
          return '<div class="photos">' + scenes.map(function (s, i) { return '<div class="art-wrap">' + C.art(s, ((p.scheme + i - 1) % 6) + 1, 'Foto ' + (i + 1) + ' de ' + p.name) + '</div>'; }).join('') + '</div>';
        }
        return '<div class="about"><p>' + esc(p.bio) + '</p><dl><div><dt>Cidade</dt><dd>' + esc(p.city) + '</dd></div><div><dt>Na comunidade desde</dt><dd>' + esc(p.since) + '</dd></div><div><dt>Interesses</dt><dd>' + p.interests.map(esc).join(', ') + '</dd></div></dl></div>';
      }
      function select(k) {
        $$('.tab', root).forEach(function (t) { var on = t.dataset.tab === k; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
        panel.setAttribute('aria-labelledby', 'ptab-' + k);
        panel.innerHTML = tabContent(k);
      }
      select('pub');
      var tablist = $('.profile__tabs', root);
      tablist.addEventListener('click', function (e) { var t = e.target.closest('[data-tab]'); if (t) select(t.dataset.tab); });
      tablist.addEventListener('keydown', function (e) {
        var tabs = $$('.tab', tablist), i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length]; else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0]; else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); n.focus(); select(n.dataset.tab); }
      });
    }
  };

  /* ---------------- grupos / eventos ---------------- */
  views.grupos = {
    title: 'Grupos', key: 'grupos',
    render: function () { return pageHead('Grupos', 'Comunidades para trocar ideias e experiências.') + '<div id="list"></div>'; },
    mount: function (root) {
      loadInto($('#list', root), 'grupos', skeletonRows(4), function () {
        return '<div class="stack">' + S().groups.map(function (g) {
          return '<div class="list-card list-card--stack"><span class="icon-circle icon-circle--lg" aria-hidden="true">' + icon(g.icon) + '</span>' +
            '<div class="list-card__main"><span class="list-card__title">' + esc(g.name) + '</span><span class="list-card__desc">' + esc(g.desc) + '</span><span class="list-card__sub">' + esc(g.members) + ' membros</span></div>' +
            '<button type="button" class="btn ' + (g.joined ? 'btn--outline' : 'btn--primary') + '" data-action="join-group" data-id="' + g.id + '" aria-pressed="' + g.joined + '">' + (g.joined ? 'Participando' : 'Entrar') + '<span class="sr-only"> no grupo ' + esc(g.name) + '</span></button></div>';
        }).join('') + '</div>';
      });
    }
  };

  views.eventos = {
    title: 'Eventos', key: 'eventos',
    render: function () { return pageHead('Eventos', 'Próximos encontros da comunidade.') + '<div id="list"></div>'; },
    mount: function (root) {
      loadInto($('#list', root), 'eventos', skeletonRows(4), function () {
        return '<div class="stack">' + S().events.map(function (ev) {
          return '<div class="list-card list-card--stack"><div class="date-block" aria-hidden="true"><strong>' + ev.day + '</strong><span>' + ev.mon + '</span></div>' +
            '<div class="list-card__main"><span class="list-card__title">' + esc(ev.title) + '</span><span class="list-card__sub">' + esc(ev.when) + '</span><span class="list-card__sub">' + esc(ev.where) + '</span></div>' +
            '<button type="button" class="btn ' + (ev.going ? 'btn--outline' : 'btn--primary') + '" data-action="rsvp" data-id="' + ev.id + '" aria-pressed="' + ev.going + '">' + (ev.going ? 'Confirmado' : 'Participar') + '<span class="sr-only"> em ' + esc(ev.title) + '</span></button></div>';
        }).join('') + '</div>';
      });
    }
  };

  /* ---------------- mensagens ---------------- */
  views.mensagens = {
    title: 'Mensagens', key: 'mensagens',
    render: function (params, arg) {
      if (arg) return threadHTML(arg);
      return pageHead('Mensagens', 'Suas conversas recentes.') + '<div id="list"></div>';
    },
    mount: function (root, params, arg) {
      if (arg) return mountThread(root, arg);
      loadInto($('#list', root), 'mensagens', skeletonRows(4), function () {
        var cs = S().conversations;
        if (!cs.length) return emptyState({ icon: 'message-circle', title: 'Nenhuma conversa', text: 'Quando você enviar uma mensagem, ela aparece aqui.' });
        return '<div class="stack">' + cs.map(function (c) {
          var p = person(c.with), last = c.messages[c.messages.length - 1];
          return '<a class="list-card convo" href="#/mensagens/' + c.id + '">' + avatar(p, 48) +
            '<div class="list-card__main"><span class="list-card__title">' + esc(p.name) + '</span><span class="list-card__desc" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(last.text) + '</span></div>' +
            '<span style="display:grid;justify-items:end;gap:4px;flex:none"><span class="list-card__sub">' + esc(c.time) + '</span>' + (c.unread ? '<span class="badge" aria-label="' + c.unread + ' não lidas">' + c.unread + '</span>' : '') + '</span></a>';
        }).join('') + '</div>';
      });
    }
  };
  function threadHTML(id) {
    var c = S().conversations.filter(function (x) { return x.id === id; })[0];
    if (!c) return emptyState({ icon: 'alert', title: 'Conversa não encontrada', text: 'Ela pode ter sido removida.', action: '<a class="btn btn--primary" href="#/mensagens">Voltar às mensagens</a>' });
    var p = person(c.with);
    c.unread = 0;
    return '<a class="back-link" href="#/mensagens">' + icon('arrow-left') + 'Voltar às mensagens</a>' +
      '<div class="page-head"><h1 tabindex="-1">' + esc(p.name) + '</h1><p>' + esc(p.role) + '</p></div>' +
      '<div class="thread"><div class="thread__msgs" id="msgs" role="log" aria-label="Mensagens com ' + esc(p.name) + '">' + c.messages.map(bubble).join('') + '</div>' +
      '<form class="thread__form" id="msg-form" data-id="' + id + '" novalidate><div class="field field--filled"><label for="msg-text">Mensagem</label><div class="field__control"><input id="msg-text" type="text" autocomplete="off"></div></div>' +
      '<button type="submit" class="btn btn--primary" aria-label="Enviar mensagem">' + icon('send') + '<span>Enviar</span></button></form></div>';
  }
  function bubble(m) { return '<div class="bubble ' + (m.from === 'me' ? 'bubble--me' : '') + '">' + esc(m.text) + '<small>' + esc(m.t) + '</small></div>'; }
  function mountThread(root, id) {
    var form = $('#msg-form', root); if (!form) return;
    var c = S().conversations.filter(function (x) { return x.id === id; })[0];
    var box = $('#msgs', root); box.scrollTop = box.scrollHeight;
    C.shell.updateBadges();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#msg-text', form), v = input.value.trim();
      if (!v) { input.focus(); return; }
      var m = { from: 'me', text: v, t: 'agora' };
      c.messages.push(m); c.time = 'agora';
      box.insertAdjacentHTML('beforeend', bubble(m)); input.value = ''; box.scrollTop = box.scrollHeight;
      setTimeout(function () {
        if (!document.contains(box)) return;
        var r = { from: c.with, text: 'Combinado, te aviso mais tarde.', t: 'agora' };
        c.messages.push(r); box.insertAdjacentHTML('beforeend', bubble(r)); box.scrollTop = box.scrollHeight;
      }, 1400);
    });
  }

  /* ---------------- notificações, configurações, ajuda ---------------- */
  views.notificacoes = {
    title: 'Notificações', key: 'notificacoes',
    render: function () {
      var list = S().notifications;
      return pageHead('Notificações', 'Atividade recente da sua conta.') +
        '<div style="margin-bottom:12px"><button type="button" class="btn btn--tonal" data-action="read-all">Marcar todas como lidas</button></div>' +
        (list.length ? '<div class="stack" id="all-notifs">' + list.map(function (n) { return '<div class="list-card" style="padding:0">' + notifRow(n) + '</div>'; }).join('') + '</div>'
          : emptyState({ icon: 'bell-off', title: 'Tudo em dia', text: 'Você não tem notificações.' }));
    }
  };
  function notifRow(n) {
    return '<a class="notif ' + (n.unread ? '' : 'is-read') + '" href="' + n.href + '" data-notif="' + n.id + '" style="border-radius:var(--radius-container)"><span class="icon-circle" aria-hidden="true">' + icon(n.icon) + '</span><span class="notif__body"><span class="notif__text">' + esc(n.text) + '</span><br><span class="notif__time">' + esc(n.time) + (n.unread ? ' · não lida' : '') + '</span></span><span class="notif__dot" aria-hidden="true"></span></a>';
  }

  views.configuracoes = {
    title: 'Configurações', key: 'configuracoes',
    render: function () {
      var s = S().settings;
      function row(id, title, desc, on) {
        return '<div class="setting"><div class="setting__txt"><strong id="' + id + '-l">' + title + '</strong><span id="' + id + '-d">' + desc + '</span></div>' +
          '<button type="button" class="switch" role="switch" id="' + id + '" aria-checked="' + on + '" aria-labelledby="' + id + '-l" aria-describedby="' + id + '-d" data-action="toggle-setting" data-setting="' + id + '"></button></div>';
      }
      return pageHead('Configurações', 'Preferências da sua conta.') +
        '<div class="stack">' + row('emailNotif', 'Notificações por e-mail', 'Receba um resumo semanal da atividade.', s.emailNotif) +
        row('simError', 'Simular falha de carregamento', 'Demonstração: faz as listas exibirem o estado de erro com “Tentar novamente”.', s.simError) + '</div>' +
        '<section class="section" aria-labelledby="acc-title"><h2 id="acc-title">Conta</h2><div class="list-card list-card--stack"><div class="list-card__main"><span class="list-card__title">' + esc(S().user.name) + '</span><span class="list-card__sub">' + esc(S().user.email) + '</span></div><button type="button" class="btn btn--outline" data-action="logout">Sair da conta</button></div></section>';
    }
  };

  views.ajuda = {
    title: 'Ajuda', key: 'ajuda',
    render: function () {
      return pageHead('Ajuda', 'Respostas rápidas para dúvidas comuns.') +
        '<div class="faq">' + D.faq.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div>';
    }
  };

  C.views = views;
  C.viewHelpers = { cardHTML: cardHTML, followBtn: followBtn, notifRow: notifRow, feedPosts: feedPosts, personRow: personRow };
})(window.Conecta);
