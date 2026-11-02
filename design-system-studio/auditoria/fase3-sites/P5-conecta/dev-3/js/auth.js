/* Tela de entrada: login (E-mail | Telefone), cadastro na mesma tela (abas),
   recuperacao de senha. Demonstracao: nao ha backend nem verificacao real. */
(function () {
  var C = window.Conecta;

  /* Credenciais fixas da demonstracao (aparecem na tela e no README). */
  var DEMO_EMAIL = 'demo@conecta.app';
  var DEMO_TELEFONE = '11912345678';
  var DEMO_SENHA = 'demo1234';
  var DEMO_CODIGO = '123456';

  var TEXTOS = {
    entrar: { titulo: 'Entrar', sub: 'Escolha como prefere acessar.', doc: 'Entrar · Conecta', url: '' },
    cadastro: { titulo: 'Criar conta', sub: 'Crie sua conta para entrar na comunidade.', doc: 'Criar conta · Conecta', url: '?aba=cadastro' },
    recuperar: { titulo: 'Recuperar senha', sub: 'Informe o e-mail da sua conta.', doc: 'Recuperar senha · Conecta', url: '?aba=recuperar' }
  };

  var estado = { aba: 'entrar', etapaCodigo: false, enviando: false };
  var el = {};

  /* ---------- Sessao (apenas para a demonstracao) ---------- */
  C.sessao = {
    ativa: function () {
      return C.armazenamento.ler('conecta.sessao') === '1';
    },
    iniciar: function () {
      C.armazenamento.gravar('conecta.sessao', '1');
    },
    sair: function () {
      C.armazenamento.apagar('conecta.sessao');
    }
  };

  /* Chamado ao concluir login ou cadastro. Dados do cadastro atualizam o perfil de exemplo. */
  C.entrar = function (dados) {
    var eu = C.usuario(C.eu);
    if (dados && dados.nome) {
      eu.nome = dados.nome;
      eu.iniciais = dados.nome
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(function (p) {
          return p.charAt(0).toUpperCase();
        })
        .join('');
    }
    if (dados && dados.email) eu.email = dados.email;
    C.sessao.iniciar();
    C.entrarNoApp();
  };

  /* ---------- Validacao ---------- */
  function emailValido(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function digitos(v) {
    return String(v).replace(/\D/g, '');
  }

  function regrasSenha(v) {
    return {
      tamanho: v.length >= 8,
      letra: /[A-Za-zÀ-ÿ]/.test(v),
      numero: /\d/.test(v)
    };
  }

  function marcarErro(input, erroEl, mensagem) {
    if (mensagem) {
      input.setAttribute('aria-invalid', 'true');
      erroEl.textContent = mensagem;
      erroEl.hidden = false;
    } else {
      input.removeAttribute('aria-invalid');
      erroEl.textContent = '';
      erroEl.hidden = true;
    }
    return mensagem;
  }

  function validarEmail(input, erroEl) {
    var v = input.value.trim();
    var msg = '';
    if (!v) msg = 'Informe seu e-mail.';
    else if (!emailValido(v)) msg = 'Informe um e-mail válido, como nome@exemplo.com.';
    return marcarErro(input, erroEl, msg);
  }

  function validarTelefone(input, erroEl) {
    var d = digitos(input.value);
    var msg = '';
    if (!input.value.trim()) msg = 'Informe seu telefone.';
    else if (d.length < 10 || d.length > 11) msg = 'Informe o telefone com DDD, como (11) 91234-5678.';
    return marcarErro(input, erroEl, msg);
  }

  function validarNome(input, erroEl) {
    var msg = input.value.trim().length < 2 ? 'Informe seu nome.' : '';
    return marcarErro(input, erroEl, msg);
  }

  function validarSenhaCadastro(input, erroEl) {
    var v = input.value;
    var r = regrasSenha(v);
    var msg = '';
    if (!v) msg = 'Crie uma senha.';
    else if (!r.tamanho) msg = 'Use pelo menos 8 caracteres.';
    else if (!r.letra || !r.numero) msg = 'Inclua pelo menos uma letra e um número.';
    return marcarErro(input, erroEl, msg);
  }

  function atualizarRequisitos() {
    var r = regrasSenha(el.cadSenha.value);
    C.$$('#requisitos-senha li').forEach(function (li) {
      var ok = !!r[li.getAttribute('data-regra')];
      li.classList.toggle('ok', ok);
      var estadoEl = li.querySelector('[data-estado]');
      if (estadoEl) estadoEl.textContent = ok ? 'cumprido:' : 'pendente:';
    });
  }

  function montarRequisitos() {
    C.$$('#requisitos-senha li').forEach(function (li) {
      li.insertAdjacentHTML('afterbegin', C.icone('check'));
    });
  }

  /* Resumo no topo do formulario (role="alert"), com foco para leitores de tela. */
  function mostrarResumo(resumo, mensagens) {
    resumo.textContent = '';
    if (!mensagens.length) {
      resumo.hidden = true;
      return;
    }
    if (mensagens.length === 1) {
      var p = document.createElement('p');
      p.textContent = mensagens[0];
      resumo.appendChild(p);
    } else {
      var titulo = document.createElement('p');
      titulo.textContent = 'Revise os campos destacados:';
      resumo.appendChild(titulo);
      var ul = document.createElement('ul');
      mensagens.forEach(function (m) {
        var li = document.createElement('li');
        li.textContent = m;
        ul.appendChild(li);
      });
      resumo.appendChild(ul);
    }
    resumo.hidden = false;
    resumo.focus();
  }

  function ocupado(botao, on, texto) {
    botao.disabled = on;
    botao.setAttribute('aria-busy', on ? 'true' : 'false');
    botao.textContent = texto;
  }

  function metodoAtual() {
    return el.metodoTelefone.checked ? 'telefone' : 'email';
  }

  function trocarMetodo() {
    var telefone = metodoAtual() === 'telefone';
    el.campoEmail.hidden = telefone;
    el.campoTelefone.hidden = !telefone;
    marcarErro(el.loginEmail, el.erroLoginEmail, '');
    marcarErro(el.loginTelefone, el.erroLoginTelefone, '');
    mostrarResumo(el.resumoEntrar, []);
  }

  /* ---------- Envio: login ---------- */
  async function enviarLogin(ev) {
    ev.preventDefault();
    if (estado.enviando) return;
    var telefone = metodoAtual() === 'telefone';
    var erros = [];

    if (telefone) {
      var mt = validarTelefone(el.loginTelefone, el.erroLoginTelefone);
      if (mt) erros.push(mt);
    } else {
      var me = validarEmail(el.loginEmail, el.erroLoginEmail);
      if (me) erros.push(me);
    }
    var ms = marcarErro(el.loginSenha, el.erroLoginSenha, el.loginSenha.value ? '' : 'Informe sua senha.');
    if (ms) erros.push(ms);

    if (erros.length) {
      mostrarResumo(el.resumoEntrar, erros);
      return;
    }

    var credenciaisOk =
      (telefone ? digitos(el.loginTelefone.value) === DEMO_TELEFONE : el.loginEmail.value.trim().toLowerCase() === DEMO_EMAIL) &&
      el.loginSenha.value === DEMO_SENHA;

    estado.enviando = true;
    ocupado(el.btnEntrar, true, 'Entrando…');
    await C.atraso(700);
    estado.enviando = false;
    ocupado(el.btnEntrar, false, 'Entrar');

    if (!credenciaisOk) {
      /* Mensagem generica: nao revela se o e-mail/telefone ou a senha esta errado. */
      mostrarResumo(el.resumoEntrar, ['E-mail ou senha incorretos.']);
      return;
    }
    mostrarResumo(el.resumoEntrar, []);
    C.entrar({ nome: '' });
  }

  /* ---------- Envio: cadastro (duas etapas: dados, depois codigo) ---------- */
  async function enviarCadastro(ev) {
    ev.preventDefault();
    if (estado.enviando) return;

    if (!estado.etapaCodigo) {
      var erros = [];
      var mn = validarNome(el.cadNome, el.erroCadNome);
      if (mn) erros.push(mn);
      var me = validarEmail(el.cadEmail, el.erroCadEmail);
      if (me) erros.push(me);
      var ms = validarSenhaCadastro(el.cadSenha, el.erroCadSenha);
      if (ms) erros.push(ms);
      if (erros.length) {
        mostrarResumo(el.resumoCadastro, erros);
        return;
      }
      mostrarResumo(el.resumoCadastro, []);
      estado.enviando = true;
      ocupado(el.btnCriar, true, 'Criando conta…');
      await C.atraso(800);
      estado.enviando = false;
      ocupado(el.btnCriar, false, 'Confirmar código');
      estado.etapaCodigo = true;
      el.campoCodigo.hidden = false;
      C.anunciar('Enviamos um código de 6 dígitos para o seu e-mail.');
      el.cadCodigo.focus();
      return;
    }

    var codigo = el.cadCodigo.value.replace(/\s/g, '');
    var erroCodigo = '';
    if (!/^\d{6}$/.test(codigo)) erroCodigo = 'Digite os 6 dígitos do código.';
    else if (codigo !== DEMO_CODIGO) erroCodigo = 'Código inválido ou expirado.';
    marcarErro(el.cadCodigo, el.erroCadCodigo, erroCodigo);
    if (erroCodigo) {
      mostrarResumo(el.resumoCadastro, [erroCodigo]);
      return;
    }

    estado.enviando = true;
    ocupado(el.btnCriar, true, 'Confirmando…');
    await C.atraso(600);
    estado.enviando = false;
    ocupado(el.btnCriar, false, 'Criar conta');
    C.entrar({ nome: el.cadNome.value.trim(), email: el.cadEmail.value.trim() });
  }

  /* Alterar dados depois da etapa do codigo volta para a etapa 1 (evita dados desencontrados). */
  function voltarEtapaDados() {
    if (!estado.etapaCodigo) return;
    estado.etapaCodigo = false;
    el.campoCodigo.hidden = true;
    marcarErro(el.cadCodigo, el.erroCadCodigo, '');
    el.cadCodigo.value = '';
    el.btnCriar.textContent = 'Criar conta';
  }

  /* ---------- Envio: recuperacao ---------- */
  async function enviarRecuperacao(ev) {
    ev.preventDefault();
    if (estado.enviando) return;
    var msg = validarEmail(el.recEmail, el.erroRecEmail);
    if (msg) {
      mostrarResumo(el.resumoRecuperar, [msg]);
      return;
    }
    mostrarResumo(el.resumoRecuperar, []);
    estado.enviando = true;
    ocupado(el.btnRecuperar, true, 'Enviando…');
    await C.atraso(700);
    estado.enviando = false;
    ocupado(el.btnRecuperar, false, 'Enviar link');
    el.avisoRecuperar.textContent = 'Se o e-mail existir, enviaremos um link.';
    el.avisoRecuperar.hidden = false;
  }

  /* ---------- Abas e navegacao entre telas da entrada ---------- */
  function emailDe(aba) {
    if (aba === 'cadastro') return el.cadEmail;
    if (aba === 'recuperar') return el.recEmail;
    return el.loginEmail;
  }

  function irPara(aba, opcoes) {
    if (estado.aba !== aba) {
      var origem = emailDe(estado.aba);
      var destino = emailDe(aba);
      /* Troca de aba mantem o e-mail ja digitado. */
      if (origem.value) destino.value = origem.value;
    }
    estado.aba = aba;

    el.painelEntrar.hidden = aba !== 'entrar';
    el.painelCadastro.hidden = aba !== 'cadastro';
    el.painelRecuperar.hidden = aba !== 'recuperar';
    el.abas.hidden = aba === 'recuperar';

    el.abaEntrar.setAttribute('aria-selected', String(aba === 'entrar'));
    el.abaCadastro.setAttribute('aria-selected', String(aba === 'cadastro'));
    el.abaEntrar.tabIndex = aba === 'entrar' ? 0 : -1;
    el.abaCadastro.tabIndex = aba === 'cadastro' ? 0 : -1;

    el.titulo.textContent = TEXTOS[aba].titulo;
    el.subtitulo.textContent = TEXTOS[aba].sub;
    document.title = TEXTOS[aba].doc;

    if (!(opcoes && opcoes.semUrl)) {
      history.replaceState(null, '', location.pathname + TEXTOS[aba].url);
    }
  }

  /* ---------- Mostrar/ocultar senha ---------- */
  function ligarOlhos() {
    C.$$('[data-olho]').forEach(function (botao) {
      var campo = document.getElementById(botao.getAttribute('data-olho'));
      botao.innerHTML = C.icone('eye');
      botao.addEventListener('click', function () {
        var mostrar = campo.type === 'password';
        campo.type = mostrar ? 'text' : 'password';
        botao.setAttribute('aria-pressed', String(mostrar));
        botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
        botao.innerHTML = C.icone(mostrar ? 'eyeOff' : 'eye');
      });
    });
  }

  /* Teclado virtual: a altura do que sobra da tela fica em --kb (botao fixo do login). */
  function ajustarTeclado() {
    var vv = window.visualViewport;
    if (!vv) return;
    var kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--kb', kb + 'px');
  }

  /* Limpa senhas e codigo ao sair da conta. */
  C.auth = {
    iniciar: function () {
      var ids = [
        'tela-entrar', 'abas-auth', 'aba-entrar', 'aba-cadastro', 'painel-entrar', 'painel-cadastro',
        'painel-recuperar', 'titulo-auth', 'subtitulo-auth', 'form-entrar', 'form-cadastro',
        'form-recuperar', 'metodo-telefone', 'campo-login-email', 'campo-login-telefone', 'login-email',
        'login-telefone', 'login-senha', 'erro-login-email', 'erro-login-telefone', 'erro-login-senha',
        'resumo-entrar', 'btn-entrar', 'cad-nome', 'cad-email', 'cad-senha', 'cad-codigo', 'campo-codigo',
        'erro-cad-nome', 'erro-cad-email', 'erro-cad-senha', 'erro-cad-codigo', 'resumo-cadastro',
        'btn-criar', 'rec-email', 'erro-rec-email', 'resumo-recuperar', 'btn-recuperar', 'aviso-recuperar'
      ];
      ids.forEach(function (id) {
        var n = document.getElementById(id);
        if (!n) throw new Error('Elemento ausente na tela de entrada: #' + id);
        el[id.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = n;
      });
      el.metodoTelefone = document.getElementById('metodo-telefone');
      el.abaEntrar = document.getElementById('aba-entrar');
      el.abaCadastro = document.getElementById('aba-cadastro');
      el.abas = document.getElementById('abas-auth');
      el.titulo = document.getElementById('titulo-auth');
      el.subtitulo = document.getElementById('subtitulo-auth');
      el.painelEntrar = document.getElementById('painel-entrar');
      el.painelCadastro = document.getElementById('painel-cadastro');
      el.painelRecuperar = document.getElementById('painel-recuperar');
      el.campoEmail = document.getElementById('campo-login-email');
      el.campoTelefone = document.getElementById('campo-login-telefone');
      el.loginEmail = document.getElementById('login-email');
      el.loginTelefone = document.getElementById('login-telefone');
      el.loginSenha = document.getElementById('login-senha');
      el.erroLoginEmail = document.getElementById('erro-login-email');
      el.erroLoginTelefone = document.getElementById('erro-login-telefone');
      el.erroLoginSenha = document.getElementById('erro-login-senha');
      el.resumoEntrar = document.getElementById('resumo-entrar');
      el.btnEntrar = document.getElementById('btn-entrar');
      el.cadNome = document.getElementById('cad-nome');
      el.cadEmail = document.getElementById('cad-email');
      el.cadSenha = document.getElementById('cad-senha');
      el.cadCodigo = document.getElementById('cad-codigo');
      el.campoCodigo = document.getElementById('campo-codigo');
      el.erroCadNome = document.getElementById('erro-cad-nome');
      el.erroCadEmail = document.getElementById('erro-cad-email');
      el.erroCadSenha = document.getElementById('erro-cad-senha');
      el.erroCadCodigo = document.getElementById('erro-cad-codigo');
      el.resumoCadastro = document.getElementById('resumo-cadastro');
      el.btnCriar = document.getElementById('btn-criar');
      el.recEmail = document.getElementById('rec-email');
      el.erroRecEmail = document.getElementById('erro-rec-email');
      el.resumoRecuperar = document.getElementById('resumo-recuperar');
      el.btnRecuperar = document.getElementById('btn-recuperar');
      el.avisoRecuperar = document.getElementById('aviso-recuperar');

      montarRequisitos();
      ligarOlhos();

      /* Formularios */
      document.getElementById('form-entrar').addEventListener('submit', enviarLogin);
      document.getElementById('form-cadastro').addEventListener('submit', enviarCadastro);
      document.getElementById('form-recuperar').addEventListener('submit', enviarRecuperacao);

      /* Metodo E-mail | Telefone */
      document.querySelectorAll('input[name="metodo"]').forEach(function (r) {
        r.addEventListener('change', trocarMetodo);
      });

      /* Validacao ao sair do campo */
      el.loginEmail.addEventListener('blur', function () { validarEmail(el.loginEmail, el.erroLoginEmail); });
      el.loginTelefone.addEventListener('blur', function () { validarTelefone(el.loginTelefone, el.erroLoginTelefone); });
      el.loginSenha.addEventListener('blur', function () {
        marcarErro(el.loginSenha, el.erroLoginSenha, el.loginSenha.value ? '' : 'Informe sua senha.');
      });
      el.cadNome.addEventListener('blur', function () { validarNome(el.cadNome, el.erroCadNome); });
      el.cadEmail.addEventListener('blur', function () { validarEmail(el.cadEmail, el.erroCadEmail); });
      el.cadSenha.addEventListener('blur', function () { validarSenhaCadastro(el.cadSenha, el.erroCadSenha); });
      el.recEmail.addEventListener('blur', function () { validarEmail(el.recEmail, el.erroRecEmail); });

      /* Ao digitar: limpa o erro do campo quando ele fica valido e atualiza os requisitos. */
      el.cadSenha.addEventListener('input', function () {
        atualizarRequisitos();
        if (!el.erroCadSenha.hidden) validarSenhaCadastro(el.cadSenha, el.erroCadSenha);
        voltarEtapaDados();
      });
      [el.cadNome, el.cadEmail].forEach(function (campo) {
        campo.addEventListener('input', voltarEtapaDados);
      });

      /* Links */
      document.getElementById('link-esqueci').addEventListener('click', function (e) {
        e.preventDefault();
        irPara('recuperar');
      });
      document.getElementById('link-voltar').addEventListener('click', function (e) {
        e.preventDefault();
        irPara('entrar');
      });
      el.abaEntrar.addEventListener('click', function () { irPara('entrar'); });
      el.abaCadastro.addEventListener('click', function () { irPara('cadastro'); });
      C.ligarAbas(el.abas, function (aba) {
        irPara(aba.id === 'aba-cadastro' ? 'cadastro' : 'entrar');
      });

      /* Campos que sobem com o teclado virtual */
      C.$$('#tela-entrar input').forEach(function (campo) {
        C.focoVisivel(campo);
      });

      /* Termos e politica: abrem um modal de texto reservado */
      C.$$('[data-modal]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          C.abrirTexto(a.getAttribute('data-modal'));
        });
      });

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', ajustarTeclado);
        window.visualViewport.addEventListener('scroll', ajustarTeclado);
      }
      ajustarTeclado();

      var pedida = new URLSearchParams(window.location.search).get('aba');
      irPara(pedida === 'cadastro' || pedida === 'recuperar' ? pedida : 'entrar', { semUrl: true });
    },

    limpar: function () {
      el.loginSenha.value = '';
      el.cadSenha.value = '';
      el.cadCodigo.value = '';
      estado.etapaCodigo = false;
      el.campoCodigo.hidden = true;
      el.btnCriar.textContent = 'Criar conta';
      atualizarRequisitos();
      marcarErro(el.loginSenha, el.erroLoginSenha, '');
      mostrarResumo(el.resumoEntrar, []);
      mostrarResumo(el.resumoCadastro, []);
      mostrarResumo(el.resumoRecuperar, []);
      el.avisoRecuperar.hidden = true;
    },

    irPara: irPara,

    /* Texto de termos e politica (placeholder para o cliente). */
    textoDe: function (chave) {
      var nomes = { termos: 'Termos de uso', privacidade: 'Política de privacidade' };
      return nomes[chave] || 'Documento';
    }
  };

})();
