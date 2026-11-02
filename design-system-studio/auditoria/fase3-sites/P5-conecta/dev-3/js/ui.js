/* Utilidades de interface: seletores, escape, anuncios, armazenamento de sessao,
   pilha de sobreposicoes (drawer, modal, popovers) com foco preso e Esc. */
(function () {
  var C = (window.Conecta = window.Conecta || {});

  C.$ = function (sel, raiz) {
    return (raiz || document).querySelector(sel);
  };

  C.$$ = function (sel, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(sel));
  };

  C.esc = function (texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  C.atraso = function (ms) {
    return new Promise(function (ok) {
      setTimeout(ok, ms);
    });
  };

  /* Mensagens para leitores de tela (regiao aria-live). */
  C.anunciar = function (texto) {
    var el = C.$('#avisos');
    if (!el) return;
    el.textContent = '';
    setTimeout(function () {
      el.textContent = texto;
    }, 60);
  };

  /* Estado de sessao da demonstracao. Falhas de storage (modo privado) sao ignoradas. */
  C.armazenamento = {
    ler: function (chave) {
      try {
        return window.sessionStorage.getItem(chave);
      } catch (e) {
        return null;
      }
    },
    gravar: function (chave, valor) {
      try {
        window.sessionStorage.setItem(chave, valor);
      } catch (e) {
        /* sem armazenamento: a demo segue funcionando em memoria */
      }
    },
    apagar: function (chave) {
      try {
        window.sessionStorage.removeItem(chave);
      } catch (e) {
        /* ignora */
      }
    }
  };

  C.focaveis = function (raiz) {
    var seletor =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return C.$$(seletor, raiz).filter(function (el) {
      return el.getClientRects().length > 0 && !el.closest('[hidden]') && !el.closest('[inert]');
    });
  };

  /* Pilha de camadas sobrepostas. A do topo recebe Esc e, se "prender", o Tab fica dentro dela. */
  var camadas = [];

  C.travarRolagem = function (ligar) {
    document.body.style.overflow = ligar ? 'hidden' : '';
  };

  C.abrirCamada = function (opcoes) {
    var camada = {
      painel: opcoes.painel,
      gatilho: opcoes.gatilho || null,
      fechar: opcoes.fechar,
      prender: !!opcoes.prender,
      travar: !!opcoes.travar
    };
    camadas.push(camada);
    if (camada.travar) C.travarRolagem(true);
    return camada;
  };

  C.fecharCamada = function (camada, devolverFoco) {
    var i = camadas.indexOf(camada);
    if (i !== -1) camadas.splice(i, 1);
    var aindaTrava = camadas.some(function (c) {
      return c.travar;
    });
    if (camada.travar && !aindaTrava) C.travarRolagem(false);
    if (devolverFoco && camada.gatilho && document.body.contains(camada.gatilho)) {
      camada.gatilho.focus({ preventScroll: true });
    }
  };

  C.camadaTopo = function () {
    return camadas[camadas.length - 1] || null;
  };

  document.addEventListener('keydown', function (e) {
    var topo = C.camadaTopo();
    if (!topo) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      topo.fechar();
      return;
    }
    if (e.key !== 'Tab' || !topo.prender) return;
    var itens = C.focaveis(topo.painel);
    if (!itens.length) {
      e.preventDefault();
      return;
    }
    var primeiro = itens[0];
    var ultimo = itens[itens.length - 1];
    var ativo = document.activeElement;
    var dentro = topo.painel.contains(ativo);
    if (e.shiftKey && (ativo === primeiro || !dentro)) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (ativo === ultimo || !dentro)) {
      e.preventDefault();
      primeiro.focus();
    }
  });

  /* Setas, Home e End entre abas (padrao WAI-ARIA). aoMudar recebe a aba escolhida. */
  C.ligarAbas = function (lista, aoMudar) {
    lista.addEventListener('keydown', function (e) {
      var abas = C.$$('[role="tab"]', lista);
      var i = abas.indexOf(document.activeElement);
      if (i === -1) return;
      var j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % abas.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + abas.length) % abas.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = abas.length - 1;
      if (j === null) return;
      e.preventDefault();
      abas[j].focus();
      aoMudar(abas[j]);
    });
  };

  /* Foco no campo ao receber, depois que o teclado virtual termina de abrir. */
  C.focoVisivel = function (el) {
    el.addEventListener('focus', function () {
      setTimeout(function () {
        el.scrollIntoView({ block: 'center', behavior: 'auto' });
      }, 300);
    });
  };
})();
