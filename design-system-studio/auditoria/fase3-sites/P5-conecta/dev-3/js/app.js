/* Shell do app: roteamento por hash, cabecalho (desktop e mobile), stories, dock,
   drawer lateral, popovers, menu do tablet, modal e acoes globais. */
(function () {
  var C = window.Conecta;
  var tela = C.$('#tela-entrar');
  var app = C.$('#app');
  var drawer = C.$('#drawer');
  var scrim = C.$('#scrim');
  var modal = C.$('#modal');
  var popovers = [];
  var camadaDrawer = null;
  var camadaModal = null;

  C.acoes = C.acoes || {};

  /* ---------- Atualizacao do cabecalho (avatar, contadores, stories) ---------- */
  C.atualizarCabecalho = function () {
    var eu = C.usuario(C.eu);
    C.$$('[data-avatar="ana"]').forEach(function (el) {
      el.textContent = eu.iniciais;
    });

    var msgs = C.conversas.reduce(function (s, c) {
      return s + c.naoLidas;
    }, 0);
    var notifs = C.notificacoes.filter(function (n) {
      return !n.lida;
    }).length;

    var contMsgs = C.$('#contador-mensagens');
    contMsgs.textContent = msgs;
    contMsgs.hidden = msgs === 0;

    var sino = C.$('#contador-sino');
    sino.textContent = notifs;
    sino.hidden = notifs === 0;
    C.$('#btn-notificacoes').setAttribute('aria-label', 'Notificações' + (notifs ? ', ' + notifs + ' não lidas' : ''));

    C.$('#stories').innerHTML = C.stories
      .map(function (id) {
        var u = C.usuario(id);
        return (
          '<a class="story" href="#/perfil/' + u.id + '" aria-label="Ver perfil de ' + C.esc(u.nome) + '">' +
          '<span class="story__anel"><span class="avatar">' + C.esc(u.iniciais) + '</span></span>' +
          '<span class="story__nome">' + C.esc(u.nome.split(' ')[0]) + '</span></a>'
        );
      })
      .join('');
  };

  /* ---------- Conteudo dos popovers ---------- */
  function htmlMenuPerfil() {
    var eu = C.usuario(C.eu);
    return (
      '<div class="popover__cabecalho"><strong>' + C.esc(eu.nome) + '</strong>' +
      '<span class="muted" style="font-size:13px">' + C.esc(eu.email) + '</span></div>' +
      '<a class="popover__link" href="#/perfil">' + C.icone('user') + 'Meu perfil</a>' +
      '<a class="popover__link" href="#/configuracoes">' + C.icone('sliders') + 'Configurações</a>' +
      '<a class="popover__link" href="#/ajuda">' + C.icone('help') + 'Ajuda</a>' +
      '<button type="button" class="popover__link popover__link--perigo" data-acao="sair">' + C.icone('logout') + 'Sair</button>'
    );
  }

  function htmlNotificacoes() {
    var itens = C.notificacoes.slice(0, 4).map(function (n) {
      return (
        '<li class="popover__item"><span class="nao-lida' + (n.lida ? ' nao-lida--off' : '') + '" aria-hidden="true"></span>' +
        '<div>' + C.esc(n.texto) + '<small>' + C.esc(n.tempo) + (n.lida ? '' : ' · não lida') + '</small></div></li>'
      );
    });
    return (
      '<p class="popover__titulo">Notificações</p>' +
      (itens.length
        ? '<ul class="popover__lista">' + itens.join('') + '</ul>'
        : '<p class="popover__vazio">Nenhuma notificação por enquanto.</p>') +
      '<a class="popover__link" href="#/notificacoes">Ver todas</a>'
    );
  }

  /* ---------- Popovers (clique, Enter/Espaco, Esc e clique fora) ---------- */
  function fecharPopovers(exceto) {
    popovers.forEach(function (p) {
      if (p !== exceto) p.fechar(false);
    });
  }

  function ligarPopover(gatilho, painel, htmlFn, opcoes) {
    opcoes = opcoes || {};
    var camada = null;
    var item = { gatilho: gatilho, painel: painel, fechar: null };

    function abrir() {
      fecharPopovers(item);
      if (htmlFn) painel.innerHTML = htmlFn();
      painel.hidden = false;
      gatilho.setAttribute('aria-expanded', 'true');
      camada = C.abrirCamada({
        painel: painel,
        gatilho: gatilho,
        fechar: function () {
          fechar(true);
        },
        travar: !!opcoes.travar
      });
      var primeiro = C.focaveis(painel)[0];
      if (primeiro) primeiro.focus();
    }

    function fechar(devolverFoco) {
      if (painel.hidden) return;
      painel.hidden = true;
      gatilho.setAttribute('aria-expanded', 'false');
      var c = camada;
      camada = null;
      if (c) C.fecharCamada(c, devolverFoco);
    }

    item.fechar = fechar;
    gatilho.addEventListener('click', function () {
      if (painel.hidden) abrir();
      else fechar(true);
    });
    /* Escolher um item do menu fecha o painel. */
    painel.addEventListener('click', function (e) {
      if (e.target.closest('a, [data-acao]')) fechar(false);
    });
    popovers.push(item);
    return item;
  }

  document.addEventListener('pointerdown', function (e) {
    popovers.forEach(function (p) {
      if (!p.painel.hidden && !p.painel.contains(e.target) && !p.gatilho.contains(e.target)) {
        p.fechar(false);
      }
    });
  });

  /* ---------- Drawer lateral (celular) ---------- */
  function renderizarDrawer() {
    var atual = (location.hash.replace(/^#\/?/, '').split(/[?/]/)[0]) || 'feed';
    var itens = [
      ['notificacoes', 'Notificações', 'bell'],
      ['configuracoes', 'Configurações', 'sliders'],
      ['ajuda', 'Ajuda', 'help'],
      ['conta', 'Conta', 'user']
    ];
    C.$('#drawer-lista').innerHTML = itens
      .map(function (it) {
        return (
          '<li><a class="drawer__link" href="#/' + it[0] + '" data-drawer-link' +
          (atual === it[0] ? ' aria-current="page"' : '') + '>' +
          '<span class="icone-circulo">' + C.icone(it[2]) + '</span>' + it[1] + '</a></li>'
        );
      })
      .join('');
  }

  function inertFundo(ligar) {
    tela.inert = ligar;
    app.inert = ligar;
    if (ligar) app.setAttribute('aria-hidden', 'true');
    else app.removeAttribute('aria-hidden');
  }

  function abrirDrawer(gatilho) {
    fecharPopovers(null);
    renderizarDrawer();
    drawer.classList.add('is-aberto');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('is-aberto');
    app.inert = true;
    app.setAttribute('aria-hidden', 'true');
    camadaDrawer = C.abrirCamada({
      painel: drawer,
      gatilho: gatilho,
      fechar: function () {
        fecharDrawer(true);
      },
      prender: true,
      travar: true
    });
    C.$('#btn-fechar-drawer').focus();
  }

  function fecharDrawer(devolverFoco) {
    if (!camadaDrawer) return;
    drawer.classList.remove('is-aberto');
    drawer.setAttribute('inert', '');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('is-aberto');
    app.inert = false;
    app.removeAttribute('aria-hidden');
    var c = camadaDrawer;
    camadaDrawer = null;
    C.fecharCamada(c, devolverFoco);
  }

  /* ---------- Modal generico ---------- */
  C.abrirModal = function (opcao) {
    var painel = C.$('#modal-painel');
    C.$('#modal-titulo').textContent = opcao.titulo;
    C.$('#modal-corpo').innerHTML = opcao.html;
    var gatilho = document.activeElement;
    modal.hidden = false;
    inertFundo(true);
    camadaModal = C.abrirCamada({
      painel: painel,
      gatilho: gatilho,
      fechar: function () {
        C.fecharModal(true);
      },
      prender: true,
      travar: true
    });
    if (opcao.aoAbrir) opcao.aoAbrir(C.$('#modal-corpo'));
    var campo = C.$('#modal-corpo input:not([type="hidden"]), #modal-corpo textarea');
    (campo || C.focaveis(painel)[0]).focus();
  };

  C.fecharModal = function (devolverFoco) {
    if (!camadaModal) return;
    modal.hidden = true;
    inertFundo(false);
    var c = camadaModal;
    camadaModal = null;
    C.fecharCamada(c, devolverFoco);
  };

  C.abrirTexto = function (chave) {
    var nome = C.auth.textoDe(chave);
    C.abrirModal({
      titulo: nome,
      html:
        '<div class="pagina"><p class="muted">Texto de ' + C.esc(nome.toLowerCase()) +
        ' a ser fornecido pelo cliente. Nesta demonstração, este é apenas um espaço reservado.</p>' +
        '<div class="modal__acoes"><button type="button" class="btn btn--primary" data-acao="fechar-modal">Fechar</button></div></div>'
    });
  };

  function abrirNovaPublicacao() {
    C.abrirModal({
      titulo: 'Nova publicação',
      html:
        '<form class="form form--modal" id="form-nova" novalidate>' +
        '<div class="resumo" id="resumo-nova" role="alert" tabindex="-1" hidden></div>' +
        '<div class="campo"><label for="nova-texto">O que você quer compartilhar?</label>' +
        '<textarea class="area-texto" id="nova-texto" name="texto" rows="5" aria-describedby="erro-nova"></textarea>' +
        '<p class="campo__erro" id="erro-nova" hidden></p></div>' +
        '<div class="modal__acoes"><button type="button" class="btn btn--tonal" data-acao="fechar-modal">Cancelar</button>' +
        '<button type="submit" class="btn btn--primary">Publicar</button></div></form>',
      aoAbrir: function (corpo) {
        var form = C.$('#form-nova', corpo);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var campo = C.$('#nova-texto', form);
          var texto = campo.value.trim();
          var erro = C.$('#erro-nova', form);
          if (!texto) {
            campo.setAttribute('aria-invalid', 'true');
            erro.textContent = 'Escreva algo antes de publicar.';
            erro.hidden = false;
            campo.focus();
            return;
          }
          C.publicacoes.unshift({
            id: 'p' + Date.now(),
            autor: C.eu,
            tempo: 'agora',
            variante: 1 + (C.publicacoes.length % 3),
            texto: texto
          });
          C.fecharModal(false);
          C.anunciar('Publicação enviada.');
          if (location.hash === '#/feed' || location.hash === '') C.roteador();
          else location.hash = '#/feed';
        });
      }
    });
  }

  /* ---------- Sessao, telas de entrada e app ---------- */
  C.mostrarApp = function () {
    tela.hidden = true;
    app.hidden = false;
    C.atualizarCabecalho();
    C.roteador();
  };

  C.mostrarEntrada = function () {
    app.hidden = true;
    tela.hidden = false;
  };

  C.entrarNoApp = function () {
    C.auth.limpar();
    history.replaceState(null, '', location.pathname + '#/feed');
    C.mostrarApp();
  };

  C.sair = function () {
    fecharDrawer(false);
    fecharPopovers(null);
    C.fecharModal(false);
    C.sessao.sair();
    C.auth.limpar();
    C.auth.irPara('entrar', { semUrl: true });
    history.replaceState(null, '', location.pathname);
    C.mostrarEntrada();
  };

  /* ---------- Roteamento ---------- */
  C.marcarAtivas = function (ativa) {
    C.$$('[data-rota]').forEach(function (a) {
      if (ativa && a.getAttribute('data-rota') === ativa) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  C.roteador = function () {
    if (!C.sessao.ativa()) {
      C.mostrarEntrada();
      return;
    }
    var partes = location.hash.replace(/^#\/?/, '').split('?');
    var seg = partes[0].split('/').filter(Boolean);
    var q = new URLSearchParams(partes[1] || '');
    var fabrica = C.rotas[seg[0] || 'feed'] || C.rotas.naoEncontrada;
    var cfg = fabrica(seg, q);
    C.marcarAtivas(cfg.ativa);
    fecharPopovers(null);
    C.renderizar(cfg);
  };

  /* ---------- Acoes globais (delegacao de cliques com data-acao) ---------- */
  C.acoes.tentar = function () {
    C.roteador();
  };
  C.acoes.voltar = function () {
    if (history.length > 1) history.back();
    else location.hash = '#/feed';
  };
  C.acoes['fechar-modal'] = function () {
    C.fecharModal(true);
  };
  C.acoes.sair = function () {
    C.sair();
  };

  document.addEventListener('click', function (e) {
    var acao = e.target.closest('[data-acao]');
    if (acao && C.acoes[acao.getAttribute('data-acao')]) {
      e.preventDefault();
      C.acoes[acao.getAttribute('data-acao')](acao);
      return;
    }
    if (e.target.closest('[data-drawer-link]')) fecharDrawer(true);
  });

  /* Busca: formularios do topo e da pagina navegam para #/busca?q= */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var tipo = form.getAttribute('data-form');
    if (tipo !== 'busca-topo' && tipo !== 'busca-pagina') return;
    e.preventDefault();
    var valor = form.querySelector('input[name="q"]').value.trim();
    var destino = '#/busca?q=' + encodeURIComponent(valor);
    if (location.hash === destino) C.roteador();
    else location.hash = destino;
  });

  /* ---------- Inicializacao ---------- */
  function iniciar() {
    C.hidratarIcones();
    C.auth.iniciar();

    var falha = new URLSearchParams(location.search).get('falha');
    C.falhaFeedPendente = falha === 'feed';

    ligarPopover(C.$('#btn-notificacoes'), C.$('#pop-notificacoes'), htmlNotificacoes);
    ligarPopover(C.$('#btn-perfil-menu'), C.$('#pop-perfil'), htmlMenuPerfil);
    ligarPopover(C.$('#btn-perfil-menu-movel'), C.$('#pop-perfil-movel'), htmlMenuPerfil);
    var menuNav = ligarPopover(C.$('#btn-menu-nav'), C.$('#menu-nav'), null, { travar: true });

    C.$('#btn-menu').addEventListener('click', function () {
      abrirDrawer(C.$('#btn-menu'));
    });
    C.$('#btn-fechar-drawer').addEventListener('click', function () {
      fecharDrawer(true);
    });
    scrim.addEventListener('click', function () {
      fecharDrawer(true);
    });
    C.$('#btn-sair-drawer').addEventListener('click', function () {
      C.sair();
    });

    C.$('#btn-fechar-modal').addEventListener('click', function () {
      C.fecharModal(true);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) C.fecharModal(true);
    });

    C.$('#btn-novo').addEventListener('click', abrirNovaPublicacao);

    var buscaInput = C.$('#busca-input');
    buscaInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        buscaInput.value = '';
        buscaInput.blur();
      }
    });

    window.addEventListener(
      'scroll',
      function () {
        C.$('#cabecalho').classList.toggle('is-rolando', window.scrollY > 8);
      },
      { passive: true }
    );

    /* Ao cruzar os breakpoints, fecha o que nao existe mais na nova largura. */
    var mqDesktop = window.matchMedia('(min-width: 768px)');
    var mqLargo = window.matchMedia('(min-width: 1024px)');
    function aoMudarLargura() {
      if (mqDesktop.matches) fecharDrawer(false);
      if (mqLargo.matches) menuNav.fechar(false);
    }
    if (mqDesktop.addEventListener) mqDesktop.addEventListener('change', aoMudarLargura);
    if (mqLargo.addEventListener) mqLargo.addEventListener('change', aoMudarLargura);

    window.addEventListener('hashchange', function () {
      if (C.sessao.ativa()) C.roteador();
    });

    if (C.sessao.ativa()) {
      C.mostrarApp();
    } else {
      C.mostrarEntrada();
    }
  }

  iniciar();
})();
