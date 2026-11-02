/* Páginas do aplicativo (parte 2): Equipe, Mensagens, Relatórios, Configurações e Ajuda. */
(function () {
  'use strict';

  var A = window.Atlas;
  var icon = A.icon;
  var esc = A.esc;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function emailRule(el) {
    var v = el.value.trim();
    if (!v) return 'Informe seu e-mail.';
    if (!EMAIL_RE.test(v)) return 'Informe um e-mail válido, como nome@exemplo.com.';
    return '';
  }

  function head(eyebrow, title, sub) {
    return '<div class="page-head">' +
      '<p class="sw-eyebrow">' + esc(eyebrow) + '</p>' +
      '<h1 class="page-title">' + esc(title) + '</h1>' +
      (sub ? '<p class="page-sub">' + esc(sub) + '</p>' : '') +
    '</div>';
  }

  /* ==========================================================================
     Equipe (Pessoas)
     ========================================================================== */
  var PEOPLE = [
    { name: 'Ana Souza', role: 'Administradora', status: 'Ativo', you: true },
    { name: 'Lucas Andrade', role: 'Designer', status: 'Ativo' },
    { name: 'Mariana Costa', role: 'Gerente de projetos', status: 'Ativo' },
    { name: 'Rafael Lima', role: 'Desenvolvedor', status: 'Férias' },
    { name: 'Beatriz Nunes', role: 'Redatora', status: 'Convidada' }
  ];

  var PERSON_STATUS = { Ativo: 'success', 'Férias': 'warning', Convidada: 'info' };

  function peopleHtml() {
    return '<section class="panel" aria-label="Lista de pessoas"><ul class="list">' + PEOPLE.map(function (p) {
      return '<li><div class="list-row">' +
        '<span class="avatar" aria-hidden="true">' + esc(A.initials(p.name)) + '</span>' +
        '<span class="list-row__main"><span class="list-row__title">' + esc(p.name) + (p.you ? ' <span class="list-row__meta">(você)</span>' : '') + '</span>' +
        '<span class="list-row__meta">' + esc(p.role) + '</span></span>' +
        '<span class="status-pill status-pill--' + PERSON_STATUS[p.status] + '">' + esc(p.status) + '</span>' +
      '</div></li>';
    }).join('') + '</ul></section>';
  }

  A.register('/app/equipe', {
    kind: 'app',
    title: 'Pessoas',
    render: function () {
      return '<section aria-labelledby="team-title">' +
        '<div class="page-head"><div class="page-head__row"><div>' +
          '<p class="sw-eyebrow">01 — Equipe</p><h1 id="team-title" class="page-title">Pessoas</h1></div>' +
          '<button type="button" class="btn btn--primary" data-action="invite">' + icon('plus', { size: 18 }) + 'Convidar pessoa</button>' +
        '</div><p class="page-sub">Quem tem acesso ao workspace e o que cada pessoa faz.</p></div>' +
        '<div id="people">' + A.skel(5) + '</div>' +
      '</section>';
    },
    init: function (root) {
      A.loadInto(root.querySelector('#people'), peopleHtml(), 350);
    }
  });

  A.actions['invite'] = function () {
    A.toast('Convites não estão disponíveis nesta demonstração.');
  };

  /* ==========================================================================
     Mensagens
     ========================================================================== */
  var CONVERSATIONS = [
    { id: 'c1', name: 'Mariana Costa', last: 'Consegue revisar o orçamento até amanhã?', time: '09:12', unread: true },
    { id: 'c2', name: 'Lucas Andrade', last: 'Enviei as novas versões das artes.', time: 'ontem', unread: true },
    { id: 'c3', name: 'Equipe de produto', last: 'A daily foi movida para 9h30.', time: 'ontem', unread: true },
    { id: 'c4', name: 'Rafael Lima', last: 'Obrigado pelo retorno!', time: '28/10', unread: false }
  ];

  function conversationsHtml() {
    if (!CONVERSATIONS.length) {
      return '<div class="empty"><strong>Nenhuma conversa por aqui.</strong></div>';
    }
    return '<ul class="list">' + CONVERSATIONS.map(function (c) {
      return '<li><button type="button" class="list-row" data-action="open-chat" data-id="' + c.id + '" aria-label="' +
        esc(c.name + (c.unread ? ', não lida' : '') + ': ' + c.last) + '">' +
        '<span class="avatar" aria-hidden="true">' + esc(A.initials(c.name)) + '</span>' +
        '<span class="list-row__main"><span class="list-row__title">' + esc(c.name) + '</span>' +
        '<span class="list-row__meta">' + esc(c.last) + '</span></span>' +
        '<span class="list-row__end">' + esc(c.time) + '</span>' +
        (c.unread ? '<span class="unread-dot" aria-hidden="true"></span>' : '') +
      '</button></li>';
    }).join('') + '</ul>';
  }

  function refreshMessages() {
    var box = A.$('#chats');
    if (box) box.innerHTML = conversationsHtml();
    A.state.unread = CONVERSATIONS.filter(function (c) { return c.unread; }).length;
    if (A.shell && A.shell.refreshBadges) A.shell.refreshBadges();
    var sum = A.$('#chat-summary');
    if (sum) sum.textContent = A.state.unread ? A.state.unread + ' não lidas' : 'Tudo lido';
  }

  A.actions['open-chat'] = function (el) {
    var c = CONVERSATIONS.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
    if (!c) return;
    if (c.unread) {
      c.unread = false;
      refreshMessages();
    }
    A.toast('Conversa com ' + c.name + ' aberta (demonstração).');
  };

  A.actions['mark-all-read'] = function () {
    CONVERSATIONS.forEach(function (c) { c.unread = false; });
    refreshMessages();
    A.toast('Todas as mensagens foram marcadas como lidas.');
  };

  A.register('/app/mensagens', {
    kind: 'app',
    title: 'Mensagens',
    render: function () {
      return '<section aria-labelledby="msg-title">' +
        '<div class="page-head"><div class="page-head__row"><div>' +
          '<p class="sw-eyebrow">01 — Mensagens</p><h1 id="msg-title" class="page-title">Mensagens</h1></div>' +
          '<button type="button" class="btn btn--outline" data-action="mark-all-read">Marcar todas como lidas</button>' +
        '</div><p class="page-sub" id="chat-summary" aria-live="polite">&nbsp;</p></div>' +
        '<div id="chats">' + A.skel(4) + '</div>' +
      '</section>';
    },
    init: function (root) {
      A.loadInto(root.querySelector('#chats'), conversationsHtml(), 350);
      window.setTimeout(function () {
        var sum = root.querySelector('#chat-summary');
        if (sum && sum.isConnected) sum.textContent = A.state.unread ? A.state.unread + ' não lidas' : 'Tudo lido';
      }, 360);
    }
  });

  /* ==========================================================================
     Relatórios: tabela Swiss "Pedidos recentes" (ordenação, filtro, seleção,
     estados de carregamento, vazio e erro)
     ========================================================================== */
  var ORDERS = [
    { id: 'o1', client: 'Mariana Costa', status: 'Pago', cents: 124000, date: '2026-10-28' },
    { id: 'o2', client: 'Grupo Horizonte Ltda', status: 'Pendente', cents: 876050, date: '2026-10-30' },
    { id: 'o3', client: 'Lucas Andrade', status: 'Cancelado', cents: 31000, date: '2026-10-26' },
    { id: 'o4', client: 'Studio Varela', status: 'Em análise', cents: 452090, date: '2026-11-01' }
  ];

  var ORDER_STATUS = { 'Pago': 'success', 'Pendente': 'warning', 'Cancelado': 'error', 'Em análise': 'info' };

  var orderState = { filter: 'all', sortKey: 'date', dir: 'desc', selected: {}, mode: 'loading' };
  var ordersEl = null;
  var forceError = false;

  function brl(cents) {
    var s = (Math.round(cents) / 100).toFixed(2).split('.');
    var int = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'R$ ' + int + ',' + s[1];
  }

  function isoToBr(iso) {
    var p = iso.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function visibleOrders() {
    var list = ORDERS.filter(function (o) {
      return orderState.filter === 'all' || o.status === orderState.filter;
    });
    var key = orderState.sortKey;
    list.sort(function (a, b) {
      var va = a[key];
      var vb = b[key];
      var r = typeof va === 'string' ? va.localeCompare(vb, 'pt-BR') : va - vb;
      return orderState.dir === 'asc' ? r : -r;
    });
    return list;
  }

  function sortHeader(label, key, numeric) {
    var active = orderState.sortKey === key;
    var aria = active ? (orderState.dir === 'asc' ? 'ascending' : 'descending') : 'none';
    return '<th scope="col"' + (numeric ? ' class="num"' : '') + ' aria-sort="' + aria + '">' +
      '<button type="button" class="sw-sort" data-action="orders-sort" data-key="' + key + '"' +
      (active ? ' data-dir="' + orderState.dir + '"' : '') + '>' + esc(label) + '</button></th>';
  }

  function ordersTable(list) {
    var allSelected = list.length > 0 && list.every(function (o) { return orderState.selected[o.id]; });
    var someSelected = list.some(function (o) { return orderState.selected[o.id]; });
    var rows = list.map(function (o) {
      return '<tr>' +
        '<td class="check-cell" data-label="Selecionar"><label class="sw-check"><input type="checkbox" data-row="' + o.id + '"' +
          (orderState.selected[o.id] ? ' checked' : '') + ' aria-label="Selecionar pedido de ' + esc(o.client) + '"></label></td>' +
        '<td data-label="Cliente">' + esc(o.client) + '</td>' +
        '<td data-label="Status"><span class="sw-badge sw-badge--' + ORDER_STATUS[o.status] + '">' + esc(o.status) + '</span></td>' +
        '<td class="num" data-label="Valor">' + esc(brl(o.cents)) + '</td>' +
        '<td data-label="Data">' + esc(isoToBr(o.date)) + '</td>' +
        '<td class="actions" data-label="Ações"><button type="button" class="btn btn--outline sw-btn sw-btn--sm" data-action="order-view" data-id="' + o.id + '">Ver<span class="sr-only"> pedido de ' + esc(o.client) + '</span></button></td>' +
      '</tr>';
    }).join('');
    return '<div class="sw-table-scroll"><table class="sw-table">' +
      '<caption class="sr-only">Pedidos recentes</caption>' +
      '<thead><tr>' +
        '<th scope="col" class="check-cell"><label class="sw-check"><input type="checkbox" id="check-all"' +
          (allSelected ? ' checked' : '') + ' aria-label="Selecionar todos os pedidos"></label></th>' +
        sortHeader('Cliente', 'client') + sortHeader('Status', 'status') + sortHeader('Valor', 'cents', true) + sortHeader('Data', 'date') +
        '<th scope="col" class="actions"><span class="sr-only">Ações</span></th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="sr-only" id="sel-status" aria-live="polite">' + (someSelected ? 'Há pedidos selecionados' : '') + '</p>';
  }

  function ordersToolbar() {
    var opts = ['all', 'Pago', 'Pendente', 'Cancelado', 'Em análise'].map(function (s) {
      return '<option value="' + esc(s) + '"' + (orderState.filter === s ? ' selected' : '') + '>' + (s === 'all' ? 'Todos' : esc(s)) + '</option>';
    }).join('');
    var n = Object.keys(orderState.selected).filter(function (k) { return orderState.selected[k]; }).length;
    return '<div class="sw-table-head">' +
      '<div><p class="sw-eyebrow">02 — Pedidos</p><h2 class="sw-title" style="font-size:18px">Pedidos recentes</h2></div>' +
      '<div class="sw-table-tools">' +
        '<div class="sw-field" style="min-width:160px"><label class="sw-label" for="status-filter">Status</label>' +
        '<select id="status-filter" class="sw-input" style="padding-right:24px">' + opts + '</select></div>' +
        '<span class="sw-label" aria-live="polite">' + n + ' selecionado' + (n === 1 ? '' : 's') + '</span>' +
      '</div></div>';
  }

  function ordersBody() {
    if (orderState.mode === 'loading') {
      return '<div class="sw-state" style="padding:16px">' + A.skel(4) + '</div>';
    }
    if (orderState.mode === 'error') {
      return '<div class="sw-state" role="alert"><strong>Não foi possível carregar os pedidos.</strong>' +
        '<span>Verifique sua conexão e tente novamente.</span>' +
        '<button type="button" class="btn btn--outline sw-btn" data-action="orders-retry">Tentar novamente</button></div>';
    }
    var list = visibleOrders();
    if (!list.length) {
      return '<div class="sw-state"><strong>Nenhum pedido com este status.</strong>' +
        '<span>Escolha outro status para ver os pedidos.</span>' +
        '<button type="button" class="btn btn--outline sw-btn" data-action="orders-clear">Limpar filtro</button></div>';
    }
    return ordersTable(list);
  }

  function paintOrders() {
    if (!ordersEl || !ordersEl.isConnected) return;
    ordersEl.innerHTML = ordersToolbar() + '<div id="orders-body">' + ordersBody() + '</div>';
  }

  function loadOrders(delay) {
    orderState.mode = 'loading';
    paintOrders();
    window.setTimeout(function () {
      if (!ordersEl || !ordersEl.isConnected) return;
      orderState.mode = forceError ? 'error' : 'ready';
      paintOrders();
    }, delay);
  }

  A.actions['orders-sort'] = function (el) {
    var key = el.getAttribute('data-key');
    if (orderState.sortKey === key) {
      orderState.dir = orderState.dir === 'asc' ? 'desc' : 'asc';
    } else {
      orderState.sortKey = key;
      orderState.dir = key === 'date' || key === 'cents' ? 'desc' : 'asc';
    }
    paintOrders();
    var btn = ordersEl && ordersEl.querySelector('[data-action="orders-sort"][data-key="' + key + '"]');
    if (btn) btn.focus();
  };

  A.actions['orders-retry'] = function () {
    forceError = false;
    loadOrders(600);
  };

  A.actions['orders-clear'] = function () {
    orderState.filter = 'all';
    paintOrders();
    var sel = ordersEl && ordersEl.querySelector('#status-filter');
    if (sel) sel.focus();
  };

  A.actions['order-view'] = function (el) {
    var o = ORDERS.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
    if (o) A.toast('Pedido de ' + o.client + ' aberto (demonstração).');
  };

  function bindOrders(root) {
    ordersEl = root.querySelector('#orders-wrap');
    ordersEl.addEventListener('change', function (e) {
      var t = e.target;
      if (t.id === 'status-filter') {
        orderState.filter = t.value;
        paintOrders();
        var again = ordersEl.querySelector('#status-filter');
        if (again) again.focus();
        return;
      }
      if (t.id === 'check-all') {
        visibleOrders().forEach(function (o) { orderState.selected[o.id] = t.checked; });
        paintOrders();
        var all = ordersEl.querySelector('#check-all');
        if (all) all.focus();
        return;
      }
      var rowId = t.getAttribute && t.getAttribute('data-row');
      if (rowId) {
        orderState.selected[rowId] = t.checked;
        var list = visibleOrders();
        var every = list.every(function (o) { return orderState.selected[o.id]; });
        var some = list.some(function (o) { return orderState.selected[o.id]; });
        var master = ordersEl.querySelector('#check-all');
        if (master) {
          master.checked = every;
          master.indeterminate = !every && some;
        }
        var n = Object.keys(orderState.selected).filter(function (k) { return orderState.selected[k]; }).length;
        var counter = ordersEl.querySelector('.sw-table-tools .sw-label[aria-live]');
        if (counter) counter.textContent = n + ' selecionado' + (n === 1 ? '' : 's');
      }
    });
  }

  A.register('/app/relatorios', {
    kind: 'app',
    title: 'Relatórios',
    render: function () {
      return '<section aria-labelledby="rep-title">' +
        '<div class="page-head sw">' +
          '<p class="sw-eyebrow">01 — Relatórios</p>' +
          '<h1 id="rep-title" class="sw-title">Relatórios</h1>' +
          '<p class="page-sub">Pedidos e receitas recentes da sua operação.</p>' +
        '</div>' +
        '<div class="sw-table-wrap sw" id="orders-wrap"></div>' +
      '</section>';
    },
    init: function (root) {
      forceError = /erro=1/.test(window.location.hash);
      bindOrders(root);
      orderState.filter = 'all';
      loadOrders(600);
    }
  });

  /* ==========================================================================
     Configurações
     ========================================================================== */
  function syncProfile(name, role) {
    A.$$('.profile__name').forEach(function (el) { el.textContent = name; });
    A.$$('.profile__role').forEach(function (el) { el.textContent = role; });
    A.$$('.avatar').forEach(function (el) { el.textContent = A.initials(name); });
  }

  A.register('/app/configuracoes', {
    kind: 'app',
    title: 'Configurações',
    render: function () {
      var s = A.session.get() || {};
      return '<section aria-labelledby="set-title">' +
        head('01 — Configurações', 'Configurações', 'Seu perfil, preferências e sessão.') +
        '<section class="panel" aria-labelledby="profile-title">' +
          '<h2 id="profile-title" class="panel__title">Perfil</h2>' +
          '<div id="profile-summary" class="alert alert--error" role="alert" hidden></div>' +
          '<form id="profile-form" class="form-stack" novalidate style="max-width:520px">' +
            '<div class="field"><label for="prof-name">Nome completo</label>' +
              '<input id="prof-name" class="input" name="name" autocomplete="name" value="' + esc(s.name || '') + '" aria-describedby="prof-name-error">' +
              '<p id="prof-name-error" class="field-error" hidden></p></div>' +
            '<div class="field"><label for="prof-email">E-mail</label>' +
              '<input id="prof-email" class="input" type="email" name="email" value="' + esc(s.email || '') + '" readonly aria-describedby="prof-email-hint">' +
              '<p id="prof-email-hint" class="field-hint">O e-mail é usado para entrar e não pode ser alterado aqui.</p></div>' +
            '<div class="field"><label for="prof-role">Cargo</label>' +
              '<input id="prof-role" class="input" name="role" autocomplete="organization-title" value="' + esc(s.role || '') + '" aria-describedby="prof-role-error">' +
              '<p id="prof-role-error" class="field-error" hidden></p></div>' +
            '<div><button type="submit" class="btn btn--primary">Salvar alterações</button></div>' +
          '</form>' +
        '</section>' +
        '<section class="panel" aria-labelledby="pref-title">' +
          '<h2 id="pref-title" class="panel__title">Preferências</h2>' +
          '<div class="form-stack">' +
            '<label class="check"><input type="checkbox" checked><span>Receber resumo semanal por e-mail</span></label>' +
            '<label class="check"><input type="checkbox"><span>Mostrar notificações no navegador</span></label>' +
          '</div>' +
        '</section>' +
        '<section class="panel" aria-labelledby="session-title">' +
          '<h2 id="session-title" class="panel__title">Sessão</h2>' +
          '<p class="field-hint" style="margin-bottom:12px">Você está conectada neste navegador.</p>' +
          '<button type="button" class="btn btn--outline" data-action="logout">' + icon('logout', { size: 18 }) + 'Sair da conta</button>' +
        '</section>' +
      '</section>';
    },
    init: function (root) {
      A.form.bind(root.querySelector('#profile-form'), {
        summary: 'profile-summary',
        rules: {
          'prof-name': function (el) {
            var v = el.value.trim();
            if (!v) return 'Informe seu nome completo.';
            return '';
          },
          'prof-role': function (el) {
            return el.value.trim() ? '' : 'Informe seu cargo.';
          }
        },
        onSubmit: function (v, f, api) {
          api.busy(true, 'Salvando…');
          window.setTimeout(function () {
            api.busy(false);
            var s = A.session.get() || {};
            var name = v['prof-name'].trim();
            var role = v['prof-role'].trim();
            var remember = false;
            try { remember = !!window.localStorage.getItem('atlas.session'); } catch (err) { remember = false; }
            A.session.set({ name: name, email: s.email, role: role }, remember);
            syncProfile(name, role);
            A.toast('Alterações salvas (demonstração).');
          }, 500);
        }
      });
    }
  });

  /* ==========================================================================
     Ajuda: formulário Swiss "Fale com a gente"
     ========================================================================== */
  A.register('/app/ajuda', {
    kind: 'app',
    title: 'Ajuda',
    render: function () {
      return '<section aria-labelledby="contact-title">' +
        '<div class="page-head sw">' +
          '<p class="sw-eyebrow">01 — Ajuda</p>' +
          '<h1 class="sw-title">Ajuda</h1>' +
          '<p class="page-sub">Tire dúvidas sobre o workspace ou fale com nosso time.</p>' +
        '</div>' +
        '<div class="sw-table-wrap sw" style="padding:24px 20px">' +
          '<p class="sw-eyebrow">02 — Contato</p>' +
          '<h2 id="contact-title" class="sw-title" style="font-size:30px;margin-top:6px">Fale com a gente</h2>' +
          '<p class="page-sub" style="margin-top:6px">Respondemos em até 1 dia útil.</p>' +
          '<div id="ct-summary" class="alert alert--error" role="alert" hidden style="margin-top:20px"></div>' +
          '<form id="contact-form" novalidate style="margin-top:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:20px 24px">' +
            '<div class="sw-field"><label for="ct-name">Nome</label>' +
              '<input id="ct-name" class="sw-input" name="name" autocomplete="name" aria-describedby="ct-name-error">' +
              '<p id="ct-name-error" class="sw-field__error" hidden></p></div>' +
            '<div class="sw-field"><label for="ct-email">E-mail</label>' +
              '<input id="ct-email" class="sw-input" type="email" name="email" inputmode="email" autocomplete="email" autocapitalize="off" aria-describedby="ct-email-error">' +
              '<p id="ct-email-error" class="sw-field__error" hidden></p></div>' +
            '<div class="sw-field" style="grid-column:1/-1"><label for="ct-subject">Assunto</label>' +
              '<select id="ct-subject" class="sw-input" name="subject" aria-describedby="ct-subject-error">' +
                '<option value="">Escolha um assunto</option><option>Dúvida geral</option><option>Cobrança</option><option>Suporte técnico</option>' +
              '</select>' +
              '<p id="ct-subject-error" class="sw-field__error" hidden></p></div>' +
            '<div class="sw-field" style="grid-column:1/-1"><label for="ct-message">Mensagem</label>' +
              '<textarea id="ct-message" class="sw-input" name="message" rows="5" style="resize:vertical;min-height:120px;border:1px solid var(--text);padding:10px" aria-describedby="ct-message-error"></textarea>' +
              '<p id="ct-message-error" class="sw-field__error" hidden></p></div>' +
            '<div style="grid-column:1/-1"><label class="sw-check" for="ct-terms">' +
              '<input id="ct-terms" type="checkbox" name="terms" aria-describedby="ct-terms-error">' +
              '<span>Concordo com a <a href="#/privacidade">Política de privacidade</a> para receber a resposta.</span></label>' +
              '<p id="ct-terms-error" class="sw-field__error" hidden></p></div>' +
            '<div style="grid-column:1/-1"><button type="submit" class="btn btn--primary sw-btn sw-submit">Enviar mensagem</button></div>' +
          '</form>' +
          '<div id="ct-status" role="status" hidden style="margin-top:16px"></div>' +
        '</div>' +
      '</section>';
    },
    init: function (root) {
      var status = root.querySelector('#ct-status');
      A.form.bind(root.querySelector('#contact-form'), {
        summary: 'ct-summary',
        rules: {
          'ct-name': function (el) { return el.value.trim() ? '' : 'Informe seu nome.'; },
          'ct-email': emailRule,
          'ct-subject': function (el) { return el.value ? '' : 'Escolha um assunto.'; },
          'ct-message': function (el) {
            var v = el.value.trim();
            if (!v) return 'Escreva sua mensagem.';
            if (v.length < 10) return 'Escreva ao menos 10 caracteres.';
            return '';
          },
          'ct-terms': function (el) { return el.checked ? '' : 'Aceite a política para enviar.'; }
        },
        onSubmit: function (v, f, api) {
          api.busy(true, 'Enviando…');
          window.setTimeout(function () {
            api.busy(false);
            A.form.showMessage(status, 'Mensagem enviada. Respondemos em até 1 dia útil.', 'success');
          }, 800);
        }
      });
    }
  });
})();
