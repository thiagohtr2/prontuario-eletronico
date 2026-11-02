/* Telas do app: feed, explorar, salvos, perfil, listas, busca, publicacao e paginas simples.
   Cada tela tem estados de carregamento, vazio e erro. */
(function () {
  var C = window.Conecta;
  var numero = function (n) {
    return Number(n).toLocaleString('pt-BR');
  };
  var token = 0;

  /* ---------- Blocos de HTML reutilizados ---------- */
  function cabecalho(titulo, sub) {
    return (
      '<header class="visao__cabecalho"><h1 class="visao__titulo">' + C.esc(titulo) + '</h1>' +
      (sub ? '<p class="visao__sub">' + C.esc(sub) + '</p>' : '') + '</header>'
    );
  }

  function estadoVazio(opcao) {
    return (
      '<div class="estado">' +
      '<span class="icone-circulo">' + C.icone(opcao.icone || 'inbox') + '</span>' +
      '<h2>' + C.esc(opcao.titulo) + '</h2>' +
      '<p>' + C.esc(opcao.texto) + '</p>' +
      (opcao.acao ? '<a class="btn btn--primary" href="' + opcao.acao.href + '">' + C.esc(opcao.acao.rotulo) + '</a>' : '') +
      '</div>'
    );
  }

  function erroCarregar(mensagem) {
    return (
      '<div class="estado estado--erro" role="alert">' +
      '<span class="icone-circulo">' + C.icone('alert') + '</span>' +
      '<h2>Não foi possível carregar</h2>' +
      '<p>' + C.esc(mensagem) + '</p>' +
      '<button type="button" class="btn btn--primary" data-acao="tentar">Tentar novamente</button>' +
      '</div>'
    );
  }

  function esqueletoCartoes(quantidade) {
    var itens = '';
    for (var i = 0; i < quantidade; i++) {
      itens += '<li><div class="cartao cartao--esqueleto" aria-hidden="true"></div></li>';
    }
    return '<ul class="grade-cartoes" aria-hidden="true">' + itens + '</ul>';
  }

  function esqueletoLista(quantidade) {
    var itens = '';
    for (var i = 0; i < quantidade; i++) {
      itens += '<li class="esqueleto" style="height:64px" aria-hidden="true"></li>';
    }
    return '<ul class="lista" aria-hidden="true">' + itens + '</ul>';
  }

  function iniciaisDe(nome) {
    return nome
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (p) {
        return p.charAt(0).toUpperCase();
      })
      .join('');
  }

  function itemPessoa(u) {
    return (
      '<li class="lista__item">' +
      '<span class="avatar" aria-hidden="true">' + C.esc(u.iniciais || iniciaisDe(u.nome)) + '</span>' +
      '<div class="lista__texto"><span class="lista__titulo">' + C.esc(u.nome) + '</span>' +
      '<span class="lista__sub">' + C.esc(u.cargo) + '</span></div>' +
      '<a class="btn btn--tonal lista__acao" href="#/perfil/' + u.id + '">Ver perfil<span class="sr-only">de ' + C.esc(u.nome) + '</span></a>' +
      '</li>'
    );
  }

  /* Card de conteudo do feed (Modern Material). */
  C.cartaoHtml = function (p) {
    var autor = C.usuario(p.autor);
    var texto = p.texto || C.textoCartao;
    return (
      '<li><article class="cartao" aria-labelledby="titulo-' + p.id + '">' +
      '<div class="cartao__midia">' + C.ilustracao(p.variante) + '</div>' +
      '<div class="cartao__corpo">' +
      '<span class="etiqueta">Novo</span>' +
      '<h2 class="cartao__titulo" id="titulo-' + p.id + '"><a class="cartao__link" href="#/publicacao/' + p.id + '">' + C.esc(C.tituloCartao) + '</a></h2>' +
      '<p class="cartao__texto">' + C.esc(texto) + '</p>' +
      '<div class="cartao__rodape">' +
      '<div class="cartao__meta"><span class="icone-circulo">' + C.icone('plane') + '</span>' +
      '<span><a href="#/perfil/' + autor.id + '">' + C.esc(autor.nome) + '</a> · ' + C.esc(p.tempo) + '</span></div>' +
      '<a class="btn btn--primary" href="#/publicacao/' + p.id + '">Ver publicação</a>' +
      '</div></div></article></li>'
    );
  };

  /* ---------- Renderizacao com estados ---------- */
  C.renderizar = function (cfg) {
    var main = C.$('#conteudo');
    var minha = ++token;
    document.title = cfg.titulo + ' · Conecta';
    main.innerHTML =
      '<div class="visao">' + (cfg.cabecalho || '') +
      '<div class="corpo" aria-busy="true">' + (cfg.esqueleto || esqueletoCartoes(3)) +
      '<p class="sr-only" role="status">Carregando…</p></div></div>';
    var corpo = C.$('.corpo', main);

    Promise.resolve()
      .then(cfg.carregar)
      .then(function (html) {
        if (minha !== token) return;
        corpo.setAttribute('aria-busy', 'false');
        corpo.innerHTML = html;
        if (cfg.depois) cfg.depois(corpo);
      })
      .catch(function () {
        if (minha !== token) return;
        corpo.setAttribute('aria-busy', 'false');
        corpo.innerHTML = erroCarregar(cfg.erro || 'Verifique sua conexão e tente de novo.');
      });
  };

  /* ---------- Telas ---------- */
  C.rotas = {};

  C.rotas.feed = function () {
    return {
      titulo: 'Início',
      ativa: 'feed',
      cabecalho: cabecalho('Início', 'Publicações das pessoas que você segue.'),
      erro: 'Não foi possível carregar as publicações.',
      carregar: function () {
        return C.atraso(550).then(function () {
          if (C.falhaFeedPendente) {
            C.falhaFeedPendente = false;
            throw new Error('falha simulada');
          }
          if (!C.publicacoes.length) {
            return estadoVazio({
              titulo: 'Ainda não há publicações',
              texto: 'Quando as pessoas que você segue publicarem, elas aparecem aqui.',
              icone: 'inbox'
            });
          }
          return '<ul class="grade-cartoes">' + C.publicacoes.map(C.cartaoHtml).join('') + '</ul>';
        });
      }
    };
  };

  C.rotas.explorar = function () {
    return {
      titulo: 'Explorar',
      ativa: 'explorar',
      cabecalho: cabecalho('Explorar', 'Pessoas para seguir na comunidade.'),
      esqueleto: esqueletoLista(4),
      carregar: function () {
        return C.atraso(400).then(function () {
          var lista = C.usuarios.filter(function (u) {
            return u.id !== C.eu;
          });
          if (!lista.length) return estadoVazio({ titulo: 'Ninguém para mostrar agora', texto: 'Volte mais tarde para ver novas sugestões.', icone: 'users' });
          return '<ul class="lista">' + lista.map(itemPessoa).join('') + '</ul>';
        });
      }
    };
  };

  C.rotas.salvos = function () {
    return {
      titulo: 'Salvos',
      ativa: 'salvos',
      cabecalho: cabecalho('Salvos', 'Publicações que você guardou para ler depois.'),
      esqueleto: esqueletoLista(2),
      carregar: function () {
        return C.atraso(300).then(function () {
          return estadoVazio({
            titulo: 'Nenhuma publicação salva',
            texto: 'Quando você salvar uma publicação, ela aparece aqui.',
            icone: 'bookmark',
            acao: { href: '#/feed', rotulo: 'Ir para o início' }
          });
        });
      }
    };
  };

  C.rotas.grupos = function () {
    return {
      titulo: 'Grupos',
      ativa: 'grupos',
      cabecalho: cabecalho('Grupos', 'Conversas por tema.'),
      esqueleto: esqueletoLista(3),
      carregar: function () {
        return C.atraso(350).then(function () {
          return (
            '<ul class="lista">' +
            C.grupos.map(function (g) {
              return (
                '<li class="lista__item"><span class="icone-circulo">' + C.icone('users') + '</span>' +
                '<div class="lista__texto"><span class="lista__titulo">' + C.esc(g.nome) + '</span>' +
                '<span class="lista__sub">' + C.esc(g.descricao) + ' · ' + numero(g.membros) + ' membros</span></div></li>'
              );
            }).join('') +
            '</ul>'
          );
        });
      }
    };
  };

  C.rotas.eventos = function () {
    return {
      titulo: 'Eventos',
      ativa: 'eventos',
      cabecalho: cabecalho('Eventos', 'Encontros da comunidade.'),
      esqueleto: esqueletoLista(3),
      carregar: function () {
        return C.atraso(350).then(function () {
          return (
            '<ul class="lista">' +
            C.eventos.map(function (e) {
              return (
                '<li class="lista__item"><span class="icone-circulo">' + C.icone('calendar') + '</span>' +
                '<div class="lista__texto"><span class="lista__titulo">' + C.esc(e.nome) + '</span>' +
                '<span class="lista__sub">' + C.esc(e.quando) + ' · ' + C.esc(e.local) + '</span></div></li>'
              );
            }).join('') +
            '</ul>'
          );
        });
      }
    };
  };

  C.rotas.mensagens = function () {
    return {
      titulo: 'Mensagens',
      ativa: 'mensagens',
      cabecalho: cabecalho('Mensagens', 'Suas conversas.'),
      esqueleto: esqueletoLista(3),
      carregar: function () {
        return C.atraso(350).then(function () {
          if (!C.conversas.length) {
            return estadoVazio({ titulo: 'Nenhuma conversa', texto: 'Quando alguém enviar uma mensagem, ela aparece aqui.', icone: 'message' });
          }
          return (
            '<ul class="lista">' +
            C.conversas.map(function (c) {
              return (
                '<li class="lista__item' + (c.naoLidas ? ' lista__item--nao-lida' : '') + '">' +
                '<div class="lista__texto"><span class="lista__titulo">' + C.esc(c.nome) + '</span>' +
                '<span class="lista__sub">' + C.esc(c.previa) + '</span></div>' +
                '<span class="lista__tempo">' + C.esc(c.tempo) + '</span>' +
                (c.naoLidas ? '<span class="contador" aria-label="' + c.naoLidas + ' não lidas">' + c.naoLidas + '</span>' : '') +
                '</li>'
              );
            }).join('') +
            '</ul>'
          );
        });
      }
    };
  };

  C.rotas.notificacoes = function () {
    return {
      titulo: 'Notificações',
      ativa: null,
      cabecalho: cabecalho('Notificações', 'Atividades recentes da sua conta.'),
      esqueleto: esqueletoLista(3),
      carregar: function () {
        return C.atraso(300).then(function () {
          if (!C.notificacoes.length) {
            return estadoVazio({ titulo: 'Nenhuma notificação', texto: 'Novidades sobre suas publicações e seguidores aparecem aqui.', icone: 'bell' });
          }
          return (
            '<ul class="lista">' +
            C.notificacoes.map(function (n) {
              return (
                '<li class="lista__item"><span class="nao-lida' + (n.lida ? ' nao-lida--off' : '') + '" aria-hidden="true"></span>' +
                '<div class="lista__texto"><span class="lista__titulo">' + C.esc(n.texto) + '</span>' +
                '<span class="lista__sub">' + C.esc(n.tempo) + (n.lida ? '' : ' · não lida') + '</span></div></li>'
              );
            }).join('') +
            '</ul>'
          );
        });
      }
    };
  };

  C.rotas.busca = function (seg, q) {
    var termo = (q.get('q') || '').trim();
    return {
      titulo: 'Buscar',
      ativa: null,
      cabecalho:
        cabecalho('Buscar', 'Encontre pessoas e publicações.') +
        '<form class="busca-pagina" role="search" data-form="busca-pagina">' +
        '<div class="campo"><label for="busca-pagina-campo" class="sr-only">Buscar na Conecta</label>' +
        '<div class="busca-pagina__linha">' +
        '<input class="entrada" id="busca-pagina-campo" type="search" name="q" value="' + C.esc(termo) + '" placeholder="Nome, cargo ou assunto" autocomplete="off">' +
        '<button type="submit" class="btn btn--primary">Buscar</button></div></div></form>',
      esqueleto: esqueletoLista(3),
      carregar: function () {
        return C.atraso(400).then(function () {
          if (!termo) {
            return estadoVazio({ titulo: 'Digite algo para buscar', texto: 'Procure por nome, cargo ou assunto das publicações.', icone: 'search' });
          }
          var t = termo.toLowerCase();
          var pessoas = C.usuarios.filter(function (u) {
            return (u.nome + ' ' + u.cargo).toLowerCase().indexOf(t) !== -1;
          });
          var posts = C.publicacoes.filter(function (p) {
            var autor = C.usuario(p.autor);
            return ((p.texto || C.textoCartao) + ' ' + autor.nome).toLowerCase().indexOf(t) !== -1;
          });
          if (!pessoas.length && !posts.length) {
            return estadoVazio({ titulo: 'Nenhum resultado para “' + termo + '”', texto: 'Tente outro nome, cargo ou assunto.', icone: 'search' });
          }
          var html = '';
          if (pessoas.length) html += '<h2 class="lista-titulo">Pessoas</h2><ul class="lista">' + pessoas.map(itemPessoa).join('') + '</ul>';
          if (posts.length) html += '<h2 class="lista-titulo">Publicações</h2><ul class="grade-cartoes">' + posts.map(C.cartaoHtml).join('') + '</ul>';
          return html;
        });
      }
    };
  };

  C.rotas.publicacao = function (seg) {
    var p = C.publicacao(seg[1]);
    if (!p) {
      return {
        titulo: 'Publicação',
        ativa: null,
        cabecalho: '',
        carregar: function () {
          return Promise.resolve(estadoVazio({ titulo: 'Publicação não encontrada', texto: 'Ela pode ter sido removida.', icone: 'alert', acao: { href: '#/feed', rotulo: 'Voltar ao início' } }));
        }
      };
    }
    var autor = C.usuario(p.autor);
    return {
      titulo: 'Publicação',
      ativa: null,
      cabecalho:
        '<div><button type="button" class="btn btn--tonal" data-acao="voltar">' + C.icone('arrowLeft') + 'Voltar</button></div>',
      esqueleto: esqueletoCartoes(1),
      carregar: function () {
        return C.atraso(250).then(function () {
          return (
            '<article class="cartao pagina-cartao" aria-labelledby="titulo-pub">' +
            '<div class="cartao__midia">' + C.ilustracao(p.variante) + '</div>' +
            '<div class="cartao__corpo">' +
            '<span class="etiqueta">Novo</span>' +
            '<h1 class="cartao__titulo" id="titulo-pub">' + C.esc(C.tituloCartao) + '</h1>' +
            '<p class="cartao__texto cartao__texto--livre">' + C.esc(p.texto || C.textoCartao) + '</p>' +
            '<div class="cartao__rodape"><div class="cartao__meta"><span class="icone-circulo">' + C.icone('plane') + '</span>' +
            '<span><a href="#/perfil/' + autor.id + '">' + C.esc(autor.nome) + '</a> · ' + C.esc(p.tempo) + '</span></div></div>' +
            '</div></article>'
          );
        });
      }
    };
  };

  /* ---------- Perfil do usuario ---------- */
  function painelPerfil(u, aba) {
    if (aba === 'sobre') {
      return (
        '<dl class="sobre"><div><dt>Cargo</dt><dd>' + C.esc(u.cargo) + '</dd></div>' +
        '<div><dt>Sobre</dt><dd>' + C.esc(u.sobre || 'Sem descrição.') + '</dd></div>' +
        (u.id === C.eu ? '<div><dt>E-mail</dt><dd>' + C.esc(u.email) + '</dd></div>' : '') + '</dl>'
      );
    }
    var posts = C.publicacoes.filter(function (p) {
      return p.autor === u.id;
    });
    if (!posts.length) {
      return estadoVazio({ titulo: 'Nenhuma publicação ainda', texto: 'As publicações de ' + u.nome.split(' ')[0] + ' aparecem aqui.', icone: 'inbox' });
    }
    return '<ul class="grade-cartoes">' + posts.map(C.cartaoHtml).join('') + '</ul>';
  }

  function botaoSeguir(u) {
    if (u.id === C.eu) {
      return '<button type="button" class="btn btn--primary" data-acao="editar-perfil">Editar perfil</button>';
    }
    return (
      '<button type="button" class="btn ' + (u.seguida ? 'btn--tonal' : 'btn--primary') + '" data-acao="seguir" data-id="' + u.id + '" aria-pressed="' + u.seguida + '">' +
      (u.seguida ? 'Seguindo' : 'Seguir') + '</button>'
    );
  }

  C.rotas.perfil = function (seg) {
    var u = C.usuario(seg[1] || C.eu);
    if (!u) {
      return C.rotas.publicacao([]);
    }
    return {
      titulo: u.nome,
      ativa: u.id === C.eu ? 'perfil' : null,
      esqueleto: '<div class="perfil" aria-hidden="true"><div class="perfil__capa esqueleto"></div></div>',
      carregar: function () {
        return C.atraso(250).then(function () {
          return (
            '<section class="perfil" aria-labelledby="perfil-nome">' +
            '<div class="perfil__capa">' + C.ilustracao(1, true) + '</div>' +
            '<div class="perfil__topo">' +
            '<span class="avatar avatar--lg" aria-hidden="true">' + C.esc(u.iniciais) + '</span>' +
            '<div class="perfil__identidade"><h1 class="perfil__nome" id="perfil-nome">' + C.esc(u.nome) + '</h1>' +
            '<p class="perfil__cargo">' + C.esc(u.cargo) + '</p></div>' +
            '<div class="perfil__acoes">' + botaoSeguir(u) + '</div>' +
            '</div>' +
            '<dl class="estatisticas">' +
            '<div><dt>Publicações</dt><dd>' + numero(u.publicacoes) + '</dd></div>' +
            '<div><dt>Seguidores</dt><dd id="contagem-seguidores">' + numero(u.seguidores) + '</dd></div>' +
            '<div><dt>Seguindo</dt><dd>' + numero(u.seguindo) + '</dd></div>' +
            '</dl>' +
            '<div class="abas" role="tablist" aria-label="Conteúdo do perfil">' +
            '<button type="button" role="tab" class="aba" id="aba-pub" aria-selected="true" aria-controls="painel-perfil">Publicações</button>' +
            '<button type="button" role="tab" class="aba" id="aba-sobre" aria-selected="false" aria-controls="painel-perfil" tabindex="-1">Sobre</button>' +
            '</div>' +
            '<div class="perfil__painel" id="painel-perfil" role="tabpanel" aria-labelledby="aba-pub">' + painelPerfil(u, 'pub') + '</div>' +
            '</section>'
          );
        });
      },
      depois: function (corpo) {
        var abas = C.$('[role="tablist"]', corpo);
        var painel = C.$('#painel-perfil', corpo);
        function trocar(botao) {
          var sobre = botao.id === 'aba-sobre';
          C.$('#aba-pub', corpo).setAttribute('aria-selected', String(!sobre));
          C.$('#aba-sobre', corpo).setAttribute('aria-selected', String(sobre));
          C.$('#aba-pub', corpo).tabIndex = sobre ? -1 : 0;
          C.$('#aba-sobre', corpo).tabIndex = sobre ? 0 : -1;
          painel.setAttribute('aria-labelledby', botao.id);
          painel.innerHTML = painelPerfil(u, sobre ? 'sobre' : 'pub');
        }
        C.$$('[role="tab"]', abas).forEach(function (botao) {
          botao.addEventListener('click', function () {
            botao.focus();
            trocar(botao);
          });
        });
        C.ligarAbas(abas, trocar);
      }
    };
  };

  /* Acoes do perfil (seguir e editar), chamadas pela delegacao de cliques. */
  C.acoes = C.acoes || {};

  C.acoes.seguir = function (botao) {
    var u = C.usuario(botao.getAttribute('data-id'));
    if (!u) return;
    u.seguida = !u.seguida;
    u.seguidores += u.seguida ? 1 : -1;
    botao.textContent = u.seguida ? 'Seguindo' : 'Seguir';
    botao.className = 'btn ' + (u.seguida ? 'btn--tonal' : 'btn--primary');
    botao.setAttribute('aria-pressed', String(u.seguida));
    var contagem = C.$('#contagem-seguidores');
    if (contagem) contagem.textContent = numero(u.seguidores);
    C.anunciar(u.seguida ? 'Você começou a seguir ' + u.nome + '.' : 'Você deixou de seguir ' + u.nome + '.');
  };

  C.acoes['editar-perfil'] = function () {
    var u = C.usuario(C.eu);
    C.abrirModal({
      titulo: 'Editar perfil',
      html:
        '<form class="form form--modal" id="form-editar" novalidate>' +
        '<div class="resumo" id="resumo-editar" role="alert" tabindex="-1" hidden></div>' +
        '<div class="campo campo--preenchido"><label for="ed-nome">Nome</label>' +
        '<input class="entrada" id="ed-nome" name="nome" type="text" autocomplete="name" value="' + C.esc(u.nome) + '" aria-describedby="erro-ed-nome">' +
        '<p class="campo__erro" id="erro-ed-nome" hidden></p></div>' +
        '<div class="campo campo--preenchido"><label for="ed-cargo">Cargo</label>' +
        '<input class="entrada" id="ed-cargo" name="cargo" type="text" autocomplete="organization-title" value="' + C.esc(u.cargo) + '"></div>' +
        '<div class="campo campo--preenchido"><label for="ed-sobre">Sobre</label>' +
        '<textarea class="area-texto" id="ed-sobre" name="sobre" rows="4">' + C.esc(u.sobre || '') + '</textarea></div>' +
        '<div class="modal__acoes"><button type="button" class="btn btn--tonal" data-acao="fechar-modal">Cancelar</button>' +
        '<button type="submit" class="btn btn--primary">Salvar</button></div>' +
        '</form>',
      aoAbrir: function (corpo) {
        var form = C.$('#form-editar', corpo);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var nome = C.$('#ed-nome', form);
          var erro = C.$('#erro-ed-nome', form);
          var resumo = C.$('#resumo-editar', form);
          if (nome.value.trim().length < 2) {
            nome.setAttribute('aria-invalid', 'true');
            erro.textContent = 'Informe seu nome.';
            erro.hidden = false;
            resumo.textContent = 'Revise o campo destacado: nome.';
            resumo.hidden = false;
            resumo.focus();
            return;
          }
          u.nome = nome.value.trim();
          u.iniciais = iniciaisDe(u.nome);
          u.cargo = C.$('#ed-cargo', form).value.trim() || u.cargo;
          u.sobre = C.$('#ed-sobre', form).value.trim();
          C.fecharModal(false);
          C.atualizarCabecalho();
          C.roteador();
          C.anunciar('Perfil atualizado.');
        });
      }
    });
  };

  /* ---------- Paginas simples ---------- */
  function paginaSimples(titulo, sub, corpoHtml) {
    return {
      titulo: titulo,
      ativa: null,
      cabecalho: cabecalho(titulo, sub),
      carregar: function () {
        return Promise.resolve(corpoHtml);
      }
    };
  }

  C.rotas.configuracoes = function () {
    return paginaSimples(
      'Configurações',
      'Preferências da sua conta.',
      '<ul class="lista">' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">Notificações</span></div><span class="lista__tempo">Ativadas</span></li>' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">Privacidade do perfil</span></div><span class="lista__tempo">Pública</span></li>' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">Idioma</span></div><span class="lista__tempo">Português (Brasil)</span></li>' +
      '</ul>'
    );
  };

  C.rotas.ajuda = function () {
    return paginaSimples(
      'Ajuda',
      'Respostas rápidas.',
      '<div class="pagina">' +
      '<details class="ajuda-item"><summary>Como recupero minha senha?</summary><p>Use “Esqueci minha senha” na tela de entrada e informe seu e-mail. Se ele existir, enviaremos um link.</p></details>' +
      '<details class="ajuda-item"><summary>Posso entrar com telefone?</summary><p>Sim. Escolha “Telefone” na tela de entrada e informe o número com DDD.</p></details>' +
      '<details class="ajuda-item"><summary>Como deixo de seguir alguém?</summary><p>Abra o perfil da pessoa e toque em “Seguindo”.</p></details>' +
      '</div>'
    );
  };

  C.rotas.conta = function () {
    var u = C.usuario(C.eu);
    return paginaSimples(
      'Conta',
      'Dados de acesso.',
      '<ul class="lista">' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">Nome</span><span class="lista__sub">' + C.esc(u.nome) + '</span></div></li>' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">E-mail</span><span class="lista__sub">' + C.esc(u.email) + '</span></div></li>' +
      '<li class="lista__item"><div class="lista__texto"><span class="lista__titulo">Telefone</span><span class="lista__sub">(11) 91234-5678</span></div></li>' +
      '</ul>' +
      '<div><button type="button" class="btn btn--contorno" disabled aria-disabled="true">Alterar senha</button>' +
      '<p class="ajuda" style="margin-top:8px">Disponível na versão final.</p></div>'
    );
  };

  C.rotas.naoEncontrada = function () {
    return {
      titulo: 'Página não encontrada',
      ativa: null,
      cabecalho: '',
      carregar: function () {
        return Promise.resolve(estadoVazio({ titulo: 'Página não encontrada', texto: 'O endereço pode estar errado ou a página foi movida.', icone: 'alert', acao: { href: '#/feed', rotulo: 'Ir para o início' } }));
      }
    };
  };
})();
