/* Páginas: Calendário, Pessoas, Mensagens, Relatórios, Configurações,
   Ajuda, Meu perfil, Notificações e "Mais" (celular). */
(function () {
  var A = window.Atlas;
  var u = A.u;
  var D = A.data;
  var ui = A.ui;
  var P = A.pages;

  function me() { return A.session.get() || { name: 'Convidado', email: '', role: '' }; }

  /** Enter avança para o próximo campo; no último, envia. */
  function enterAdvances(form) {
    form.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      var t = e.target;
      if (!t.matches('input:not([type="checkbox"]):not([type="radio"]), select')) return;
      var fields = u.qsa('input:not([type="hidden"]), select, textarea, button[type="submit"]', form).filter(function (x) { return !x.disabled; });
      var next = fields[fields.indexOf(t) + 1];
      if (next && next.type !== 'submit') { e.preventDefault(); next.focus(); }
    });
  }

  /* =========================================================
     Calendário (grade mensal + modo agenda)
     ========================================================= */
  var DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  P.calendario = function () {
    var cur = new Date(D.TODAY.getFullYear(), D.TODAY.getMonth(), 1);
    var view = null;
    return {
      title: 'Calendário', nav: 'calendario', crumbs: [{ label: 'Calendário' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Geral', title: 'Calendário', desc: 'Reuniões, entregas e prazos dos projetos.' }) +
        '<section class="section" aria-labelledby="cal-title">' +
          '<div class="cal-tools">' +
            '<div class="cal-nav"><button type="button" class="sw-btn sw-btn--secondary sw-btn--icon" data-cal="-1" aria-label="Mês anterior">' + A.icon('chevronLeft', 20) + '</button>' +
            '<h2 class="cal-title" id="cal-title" aria-live="polite"></h2>' +
            '<button type="button" class="sw-btn sw-btn--secondary sw-btn--icon" data-cal="1" aria-label="Próximo mês">' + A.icon('chevronRight', 20) + '</button>' +
            '<button type="button" class="sw-btn sw-btn--ghost" data-cal-today>Hoje</button></div>' +
            '<div data-view-box></div>' +
          '</div>' +
          '<div data-cal-body></div>' +
        '</section>' +
      '</div>',
      mount: function (root) {
        var body = root.querySelector('[data-cal-body]');
        var viewBox = root.querySelector('[data-view-box]');
        view = root.querySelector('.section').clientWidth < 640 ? 'agenda' : 'mes';
        function drawView() { viewBox.innerHTML = ui.filter('Modo de exibição', [{ value: 'mes', label: 'Mês' }, { value: 'agenda', label: 'Agenda' }], view, 'data-view'); }
        function monthEvents() {
          var prefix = cur.getFullYear() + '-' + String(cur.getMonth() + 1).padStart(2, '0');
          return D.events.filter(function (e) { return e.date.indexOf(prefix) === 0; }).sort(function (a, b) { return (a.date + a.start).localeCompare(b.date + b.start); });
        }
        function draw() {
          root.querySelector('#cal-title').textContent = u.MESES_LONGOS[cur.getMonth()].replace(/^./, function (c) { return c.toUpperCase(); }) + ' de ' + cur.getFullYear();
          var evs = monthEvents();
          var todayIso = u.isoDate(D.TODAY);
          if (view === 'agenda') {
            if (!evs.length) { body.innerHTML = ui.state('empty', { title: 'Nenhum evento neste mês.', text: 'Use as setas para navegar entre os meses.', box: true }); return; }
            var byDay = {};
            evs.forEach(function (e) { (byDay[e.date] = byDay[e.date] || []).push(e); });
            body.innerHTML = '<ol class="agenda" role="list">' + Object.keys(byDay).map(function (iso) {
              var d = u.parseDate(iso);
              return '<li class="agenda__day' + (iso === todayIso ? ' is-today' : '') + '"><h3 class="agenda__date"><strong>' + d.getDate() + '</strong><span>' + u.DIAS[d.getDay()] + (iso === todayIso ? ' · Hoje' : '') + '</span></h3>' +
                '<ul role="list">' + byDay[iso].map(function (e) {
                  return '<li><button type="button" class="agenda__event" data-event="' + e.id + '" aria-haspopup="dialog" aria-expanded="false"><span class="agenda__time tabular">' + e.start + '–' + e.end + '</span><span class="agenda__name">' + u.esc(e.title) + '<small>' + u.esc((D.project(e.project) || {}).name || '') + ' · ' + u.esc(e.where) + '</small></span></button></li>';
                }).join('') + '</ul></li>';
            }).join('') + '</ol>';
            return;
          }
          // grade mensal
          var first = new Date(cur);
          var start = new Date(first); start.setDate(1 - first.getDay());
          var rows = '';
          for (var w = 0; w < 6; w++) {
            var cells = '';
            for (var d = 0; d < 7; d++) {
              var day = new Date(start); day.setDate(start.getDate() + w * 7 + d);
              var iso = u.isoDate(day);
              var inMonth = day.getMonth() === cur.getMonth();
              var list = D.events.filter(function (e) { return e.date === iso; });
              cells += '<td class="' + (inMonth ? '' : 'is-out ') + (iso === todayIso ? 'is-today' : '') + '">' +
                '<span class="cal-day"' + (iso === todayIso ? ' aria-current="date"' : '') + '><span class="sr-only">' + u.dateLong(day) + '</span><span aria-hidden="true">' + day.getDate() + '</span></span>' +
                (list.length ? '<ul class="cal-events" role="list">' + list.map(function (e) {
                  return '<li><button type="button" class="cal-chip" data-event="' + e.id + '" aria-haspopup="dialog" aria-expanded="false"><span class="sq sq--ink" aria-hidden="true"></span><span class="cal-chip__time tabular">' + e.start + '</span> <span class="cal-chip__name">' + u.esc(e.title) + '</span></button></li>';
                }).join('') + '</ul>' + '<span class="cal-dots" aria-hidden="true">' + list.map(function () { return '<span class="sq sq--ink"></span>'; }).join('') + '</span>' : '') +
                '</td>';
            }
            rows += '<tr>' + cells + '</tr>';
            if (w >= 4) { var nextWeekStart = new Date(start); nextWeekStart.setDate(start.getDate() + (w + 1) * 7); if (nextWeekStart.getMonth() !== cur.getMonth()) break; }
          }
          body.innerHTML = '<div class="cal-wrap"><table class="cal"><caption class="sr-only">Eventos de ' + u.MESES_LONGOS[cur.getMonth()] + ' de ' + cur.getFullYear() + '</caption><thead><tr>' +
            DOW.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
            '<p class="sw-hint cal-hint">Na grade compacta, os eventos aparecem como marcadores; use o modo Agenda para ver os detalhes.</p>';
        }
        drawView(); draw();
        root.addEventListener('click', function (e) {
          var t;
          if ((t = e.target.closest('[data-cal]'))) { cur.setMonth(cur.getMonth() + Number(t.dataset.cal)); draw(); return; }
          if (e.target.closest('[data-cal-today]')) { cur = new Date(D.TODAY.getFullYear(), D.TODAY.getMonth(), 1); draw(); return; }
          if ((t = e.target.closest('[data-event]'))) {
            var ev = D.events.filter(function (x) { return x.id === t.dataset.event; })[0];
            var p = D.project(ev.project);
            A.pop.open(t, {
              title: ev.title, role: 'dialog', placement: 'bottom-start', width: 300,
              html: '<div class="event-pop"><p class="overline">' + u.dateLong(u.parseDate(ev.date)) + '</p><h3>' + u.esc(ev.title) + '</h3>' +
                '<dl class="sw-dl sw-dl--compact"><div><dt>Horário</dt><dd>' + ev.start + '–' + ev.end + '</dd></div><div><dt>Local</dt><dd>' + u.esc(ev.where) + '</dd></div>' +
                (p ? '<div><dt>Projeto</dt><dd><a href="#/projetos/' + p.id + '">' + u.esc(p.name) + '</a></dd></div>' : '') + '</dl>' +
                '<button type="button" class="sw-btn sw-btn--secondary sw-btn--block" data-close data-autofocus>Fechar</button></div>'
            });
          }
        });
        ui.bindFilter(viewBox, 'data-view', function (v) { view = v; draw(); });
      }
    };
  };

  /* =========================================================
     Pessoas
     ========================================================= */
  P.pessoas = function (ctx) {
    var forced = { carregando: 'loading', vazio: 'empty', erro: 'error' }[ui.demoState(ctx)];
    return {
      title: 'Pessoas', nav: 'pessoas', crumbs: [{ label: 'Pessoas' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Equipe', title: 'Pessoas', desc: '<span data-people-total>' + D.people.length + '</span> pessoas no workspace.',
          actions: '<button type="button" class="sw-btn sw-btn--primary" data-invite>' + A.icon('userPlus', 18) + 'Convidar pessoa</button>' }) +
        '<section class="section" aria-labelledby="h-people">' + ui.sectionHead('01', 'Diretório', '', 'h-people') + '<div data-people></div></section>' +
      '</div>',
      mount: function (root) {
        var table = ui.dataTable(root.querySelector('[data-people]'), {
          caption: 'Pessoas do workspace',
          itemName: ['pessoa', 'pessoas'],
          rows: function () { return D.people; },
          rowLabel: function (r) { return r.name; },
          forceState: forced,
          initialQuery: ctx.query.q ? ctx.query.q : '',
          search: { placeholder: 'Buscar por nome, cargo ou equipe', keys: ['name', 'role', 'team', 'email'] },
          sort: { key: 'name', dir: 'ascending' },
          columns: [
            { key: 'name', label: 'Nome', sortable: true, wide: true, render: function (r) { return '<span class="cell-person">' + ui.sqAvatar(r.name) + '<span><strong>' + u.esc(r.name) + '</strong><small>' + u.esc(r.email) + '</small></span></span>'; } },
            { key: 'role', label: 'Cargo', sortable: true },
            { key: 'team', label: 'Equipe', sortable: true },
            { key: 'status', label: 'Status', sortable: true, render: function (r) { return ui.statusBadge(r.status); } }
          ],
          actions: function () {
            return [
              { label: 'Enviar mensagem', icon: 'message', run: function (r) { var c = D.conversations.filter(function (x) { return x.with === r.id; })[0]; location.hash = c ? '#/mensagens/' + c.id : '#/mensagens'; } },
              { label: 'Copiar e-mail', icon: 'mail', run: function (r) {
                var done = function () { A.toast('E-mail copiado: ' + r.email); };
                try { navigator.clipboard.writeText(r.email).then(done, function () { A.toast(r.email); }); } catch (e) { A.toast(r.email); }
              } },
              { label: 'Remover do workspace', icon: 'trash', danger: true, run: function (r, api) {
                if (r.id === 'p1') { A.toast('Você não pode remover a si mesma nesta demonstração.'); return; }
                var i = D.people.indexOf(r); D.people.splice(i, 1); api.render();
                root.querySelector('[data-people-total]').textContent = D.people.length;
                A.toast(r.name + ' foi removida(o).', { label: 'Desfazer', run: function () { D.people.splice(i, 0, r); api.render(); root.querySelector('[data-people-total]').textContent = D.people.length; } });
              } }
            ];
          }
        });
        root.querySelector('[data-invite]').addEventListener('click', function () {
          A.modal({
            title: 'Convidar pessoa',
            body: '<form class="sw-form" novalidate id="inv-form"><div data-summary role="alert"></div>' +
              '<div class="sw-field"><label class="sw-label" for="inv-name">Nome completo</label><input class="sw-input" id="inv-name" name="name" autocomplete="off" required aria-describedby="inv-name-msg" data-autofocus><p class="field__msg" id="inv-name-msg" data-msg-for="name"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="inv-email">E-mail</label><input class="sw-input" id="inv-email" name="email" type="email" inputmode="email" autocomplete="off" required aria-describedby="inv-email-msg"><p class="field__msg" id="inv-email-msg" data-msg-for="email"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="inv-team">Equipe</label>' + ui.select({ id: 'inv-team', name: 'team', options: ['Produto', 'Engenharia', 'Design', 'Dados', 'Comercial', 'Marketing', 'Atendimento', 'Operações'], value: 'Produto' }) + '</div></form>',
            foot: '<button type="button" class="sw-btn sw-btn--secondary" data-close>Cancelar</button><button type="submit" form="inv-form" class="sw-btn sw-btn--primary">Enviar convite</button>',
            onMount: function (dlg, close) {
              var form = dlg.querySelector('form'), btn = dlg.querySelector('[type="submit"]');
              A.forms.bind(form, {
                name: { label: 'Nome completo', validate: function (v) { return v.trim() ? '' : 'Informe o nome da pessoa.'; } },
                email: { label: 'E-mail', validate: function (v) { if (!v.trim()) return 'Informe o e-mail.'; if (!u.validEmail(v)) return 'Digite um e-mail válido, como nome@empresa.com.'; return ''; } }
              }, {
                summary: form.querySelector('[data-summary]'),
                onSubmit: function (f) {
                  A.forms.busy(f, btn, true, 'Enviando…');
                  u.wait(700).then(function () {
                    D.people.push({ id: 'p' + Date.now(), name: f.elements.name.value.trim(), role: 'Convite pendente', team: f.elements.team.value, email: f.elements.email.value.trim(), status: 'Convidado' });
                    close();
                    table.render();
                    root.querySelector('[data-people-total]').textContent = D.people.length;
                    A.toast('Convite enviado para ' + f.elements.email.value.trim() + '.');
                  });
                }
              });
            }
          });
        });
      }
    };
  };

  /* =========================================================
     Mensagens (lista + conversa)
     ========================================================= */
  P.mensagens = function (ctx) {
    var id = ctx.parts[1];
    var conv = id ? D.conversations.filter(function (c) { return c.id === id; })[0] : null;
    if (id && !conv) return P.notFound('Conversa não encontrada', 'Esta conversa não existe mais.', '#/mensagens', 'Voltar para mensagens', 'mensagens');
    var other = conv ? D.person(conv.with) : null;
    var crumbs = conv ? [{ label: 'Mensagens', href: '#/mensagens' }, { label: other.name }] : [{ label: 'Mensagens' }];
    if (conv) conv.unread = false;

    function listHTML() {
      return '<ul class="conv-list" role="list">' + D.conversations.map(function (c) {
        var p = D.person(c.with), last = c.messages[c.messages.length - 1];
        return '<li><a class="conv' + (c.unread ? ' is-unread' : '') + '" href="#/mensagens/' + c.id + '"' + (conv && conv.id === c.id ? ' aria-current="page"' : '') + '>' +
          ui.sqAvatar(p.name) + '<span class="conv__main"><span class="conv__top"><strong>' + u.esc(p.name) + '</strong><span class="conv__time">' + u.esc(last.time) + '</span></span>' +
          '<span class="conv__preview">' + (last.from === 'me' ? 'Você: ' : '') + u.esc(last.text) + '</span></span>' +
          (c.unread ? '<span class="conv__dot"><span class="sr-only">Não lida</span></span>' : '') + '</a></li>';
      }).join('') + '</ul>';
    }
    function threadHTML() {
      if (!conv) return '<div class="thread thread--empty">' + ui.state('empty', { title: 'Selecione uma conversa.', text: 'As mensagens da equipe aparecem aqui.' }) + '</div>';
      return '<div class="thread">' +
        '<div class="thread__head">' + ui.sqAvatar(other.name) + '<div><h2 class="thread__name">' + u.esc(other.name) + '</h2><p class="muted">' + u.esc(other.role) + ' · ' + u.esc(other.status) + '</p></div></div>' +
        '<ol class="thread__msgs" role="log" aria-label="Mensagens com ' + u.esc(other.name) + '" data-msgs></ol>' +
        '<form class="composer" novalidate><label class="sr-only" for="msg-text">Mensagem para ' + u.esc(other.name) + '</label>' +
          '<textarea class="sw-textarea" id="msg-text" name="text" rows="1" placeholder="Escreva uma mensagem" aria-describedby="msg-hint"></textarea>' +
          '<button type="submit" class="sw-btn sw-btn--primary" disabled aria-disabled="true">' + A.icon('send', 18) + '<span>Enviar</span></button>' +
          '<p class="sw-hint" id="msg-hint">Enter envia · Shift + Enter quebra a linha</p></form>' +
      '</div>';
    }
    return {
      title: conv ? other.name : 'Mensagens', nav: 'mensagens', crumbs: crumbs,
      html: '<div class="page">' + A.shell.backLink(crumbs) +
        (conv ? '<h1 class="sr-only page-title" tabindex="-1">Conversa com ' + u.esc(other.name) + '</h1>' : ui.pageHead({ overline: 'Equipe', title: 'Mensagens', desc: 'Conversas diretas com a equipe.' })) +
        '<div class="messages' + (conv ? ' has-thread' : '') + '">' +
          '<section class="messages__list" aria-label="Conversas">' + listHTML() + '</section>' +
          '<section class="messages__thread" aria-label="Conversa">' + threadHTML() + '</section>' +
        '</div>' +
      '</div>',
      mount: function (root) {
        A.shell.refreshBadges();
        if (!conv) return;
        var box = root.querySelector('[data-msgs]');
        function draw() {
          box.innerHTML = conv.messages.map(function (m) {
            var mine = m.from === 'me';
            return '<li class="bubble' + (mine ? ' bubble--me' : '') + '"><span class="sr-only">' + (mine ? 'Você' : u.esc(other.name)) + ': </span><p>' + u.esc(m.text) + '</p><span class="bubble__time">' + u.esc(m.time) + '</span></li>';
          }).join('');
          box.scrollTop = box.scrollHeight;
        }
        draw();
        var form = root.querySelector('.composer');
        var ta = form.elements.text, btn = form.querySelector('[type="submit"]');
        function sync() { var empty = !ta.value.trim(); btn.disabled = empty; btn.setAttribute('aria-disabled', String(empty)); }
        ta.addEventListener('input', function () { sync(); ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; });
        ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (ta.value.trim()) form.requestSubmit(); } });
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var text = ta.value.trim();
          if (!text) return;
          var now = new Date();
          conv.messages.push({ from: 'me', text: text, time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') });
          ta.value = ''; ta.style.height = ''; sync(); draw();
          root.querySelector('.messages__list').innerHTML = listHTML();
          setTimeout(function () {
            if (!document.contains(box)) return;
            var n = new Date();
            conv.messages.push({ from: conv.with, text: 'Combinado, obrigado pelo retorno!', time: String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0') });
            draw();
            root.querySelector('.messages__list').innerHTML = listHTML();
          }, 1400);
        });
      }
    };
  };

  /* =========================================================
     Relatórios
     ========================================================= */
  function reportValue(r, v) { return r.unit === 'money' ? u.money(v) : u.num(v); }
  P.relatorios = function (ctx) {
    var id = ctx.parts[1];
    if (id) return reportDetail(id);
    return {
      title: 'Relatórios', nav: 'relatorios', crumbs: [{ label: 'Relatórios' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Equipe', title: 'Relatórios', desc: 'Indicadores consolidados dos últimos 12 meses. Clique em um relatório para ver o detalhamento.' }) +
        '<section class="section" aria-labelledby="h-rep">' + ui.sectionHead('01', 'Relatórios disponíveis', '', 'h-rep') +
          '<div class="sw-kpis sw-kpis--4">' + D.reports.map(function (r) {
            var last = r.values[r.values.length - 1], prev = r.values[r.values.length - 2];
            var delta = prev ? (last - prev) / prev * 100 : 0;
            return ui.kpi({ id: r.id, label: r.title, value: r.unit === 'money' ? u.milBRL(last) : u.num(last), delta: Math.round(delta * 10) / 10, compare: 'vs. mês anterior', icon: r.icon }, '#/relatorios/' + r.id);
          }).join('') + '</div></section>' +
      '</div>',
      mount: function (root) {
        u.qsa('[data-kpi]', root).forEach(function (card, i) {
          var r = D.reports[i];
          ui.sparkline(card.querySelector('[data-spark]'), r.values, r.labels.map(function (l) { return l.long; }), r.unit, '#/relatorios/' + r.id);
        });
      }
    };
  };
  function reportDetail(id) {
    var r = D.reports.filter(function (x) { return x.id === id; })[0];
    if (!r) return P.notFound('Relatório não encontrado', 'Este relatório não existe.', '#/relatorios', 'Voltar para relatórios', 'relatorios');
    var crumbs = [{ label: 'Relatórios', href: '#/relatorios' }, { label: r.title }];
    var total = r.values.reduce(function (a, b) { return a + b; }, 0);
    var best = 0; r.values.forEach(function (v, i) { if (v > r.values[best]) best = i; });
    var bars = r.values.map(function (v, i) { return { label: r.labels[i].short, long: r.labels[i].long, value: v }; });
    var isStock = r.id === 'projetos';
    return {
      title: r.title, nav: 'relatorios', crumbs: crumbs,
      html: '<div class="page">' + A.shell.backLink(crumbs) +
        ui.pageHead({ overline: 'Relatório · 12 meses', title: r.title, desc: u.esc(r.desc), actions: '<button type="button" class="sw-btn sw-btn--secondary" data-print>' + A.icon('download', 18) + 'Imprimir / PDF</button>' }) +
        '<section class="section" aria-labelledby="h-sum">' + ui.sectionHead('01', 'Resumo', '', 'h-sum') +
          '<dl class="meta-grid meta-grid--big">' +
            '<div><dt>' + (isStock ? 'Situação atual' : 'Total em 12 meses') + '</dt><dd class="tabular">' + reportValue(r, isStock ? r.values[11] : total) + '</dd></div>' +
            '<div><dt>Média mensal</dt><dd class="tabular">' + reportValue(r, Math.round(total / 12)) + '</dd></div>' +
            '<div><dt>Melhor mês</dt><dd>' + r.labels[best].long.replace(/^./, function (c) { return c.toUpperCase(); }) + '</dd></div>' +
          '</dl></section>' +
        '<section class="section" aria-labelledby="h-evo">' + ui.sectionHead('02', 'Evolução mensal', '', 'h-evo') + '<div class="sw-panel"><div class="sw-panel__body" data-chart></div></div></section>' +
        '<section class="section" aria-labelledby="h-data">' + ui.sectionHead('03', 'Dados', '', 'h-data') + ui.dataTableSimple(r.title + ' por mês', bars, r.unit, 'Mês') + '</section>' +
      '</div>',
      mount: function (root) {
        ui.barChart(root.querySelector('[data-chart]'), { bars: bars, fmt: r.unit, series: r.title, label: 'Gráfico de barras: ' + r.title + ' nos últimos 12 meses. Melhor mês: ' + r.labels[best].long + ', ' + reportValue(r, r.values[best]) + '.' });
        root.querySelector('[data-print]').addEventListener('click', function () { window.print(); });
      }
    };
  }

  /* =========================================================
     Configurações (formulário Swiss)
     ========================================================= */
  P.configuracoes = function (ctx) {
    var s = me();
    var parts = String(s.name).split(' ');
    var prefs = u.store.get('prefs', { lang: 'pt-BR', tz: 'America/Sao_Paulo', emailNotif: true, weekly: false, mentions: true });
    return {
      title: 'Configurações', nav: 'configuracoes', crumbs: [{ label: 'Configurações' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Conta', title: 'Configurações', desc: 'Atualize seus dados e preferências. As alterações valem para este navegador (demonstração).' }) +
        '<form class="sw-form settings-form" novalidate>' +
          '<div data-summary role="alert"></div><div data-status role="status"></div>' +
          '<section class="section" aria-labelledby="h-perfil">' + ui.sectionHead('01', 'Perfil', '', 'h-perfil') +
            '<div class="sw-form-grid">' +
              '<div class="sw-field"><label class="sw-label" for="st-first">Nome</label><input class="sw-input" id="st-first" name="first" autocomplete="given-name" value="' + u.esc(parts[0] || '') + '" required aria-describedby="st-first-msg"><p class="field__msg" id="st-first-msg" data-msg-for="first"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="st-last">Sobrenome</label><input class="sw-input" id="st-last" name="last" autocomplete="family-name" value="' + u.esc(parts.slice(1).join(' ')) + '" required aria-describedby="st-last-msg"><p class="field__msg" id="st-last-msg" data-msg-for="last"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="st-email">E-mail</label><input class="sw-input" id="st-email" name="email" type="email" inputmode="email" autocomplete="email" value="' + u.esc(s.email) + '" required aria-describedby="st-email-msg"><p class="field__msg" id="st-email-msg" data-msg-for="email"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="st-role">Cargo</label><input class="sw-input" id="st-role" name="role" autocomplete="organization-title" value="' + u.esc(s.role) + '"></div>' +
              '<div class="sw-field span-2"><label class="sw-label" for="st-bio">Sobre você <span class="opt">(opcional)</span></label><textarea class="sw-textarea" id="st-bio" name="bio" rows="3" maxlength="240" aria-describedby="st-bio-hint">' + u.esc(s.bio || '') + '</textarea><p class="sw-hint" id="st-bio-hint">Até 240 caracteres. Aparece no seu perfil.</p></div>' +
            '</div></section>' +
          '<section class="section" aria-labelledby="h-pref" id="preferencias">' + ui.sectionHead('02', 'Preferências', '', 'h-pref') +
            '<div class="sw-form-grid">' +
              '<div class="sw-field"><label class="sw-label" for="st-lang">Idioma</label>' + ui.select({ id: 'st-lang', name: 'lang', options: [{ value: 'pt-BR', label: 'Português (Brasil)' }, { value: 'en', label: 'English' }, { value: 'es', label: 'Español' }], value: prefs.lang }) + '</div>' +
              '<div class="sw-field"><label class="sw-label" for="st-tz">Fuso horário</label>' + ui.select({ id: 'st-tz', name: 'tz', options: [{ value: 'America/Sao_Paulo', label: 'Brasília (GMT−3)' }, { value: 'America/Manaus', label: 'Manaus (GMT−4)' }, { value: 'America/Noronha', label: 'Fernando de Noronha (GMT−2)' }, { value: 'Europe/Lisbon', label: 'Lisboa (GMT+0)' }], value: prefs.tz }) + '</div>' +
              '<fieldset class="sw-fieldset span-2"><legend class="sw-label">Notificações por e-mail</legend>' +
                '<label class="sw-check"><input type="checkbox" class="sw-checkbox" name="emailNotif"' + (prefs.emailNotif ? ' checked' : '') + '> <span>Atividades nos meus projetos</span></label>' +
                '<label class="sw-check"><input type="checkbox" class="sw-checkbox" name="mentions"' + (prefs.mentions ? ' checked' : '') + '> <span>Quando alguém me mencionar</span></label>' +
                '<label class="sw-check"><input type="checkbox" class="sw-checkbox" name="weekly"' + (prefs.weekly ? ' checked' : '') + '> <span>Resumo semanal às segundas-feiras</span></label>' +
              '</fieldset>' +
              '<fieldset class="sw-fieldset span-2"><legend class="sw-label">Interface</legend>' +
                '<label class="sw-check"><input type="checkbox" class="sw-checkbox" name="collapsed"' + (A.shell.isCollapsed() ? ' checked' : '') + '> <span>Manter o menu lateral recolhido no computador</span></label>' +
              '</fieldset>' +
            '</div></section>' +
          '<div class="sw-form-foot"><p class="sw-hint">Os campos sem “opcional” são obrigatórios.</p><button type="submit" class="sw-btn sw-btn--primary">Salvar alterações</button></div>' +
        '</form>' +
      '</div>',
      mount: function (root) {
        var form = root.querySelector('form');
        var btn = form.querySelector('[type="submit"]');
        var status = form.querySelector('[data-status]');
        enterAdvances(form);
        A.forms.bind(form, {
          first: { label: 'Nome', validate: function (v) { return v.trim() ? '' : 'Informe seu nome.'; } },
          last: { label: 'Sobrenome', validate: function (v) { return v.trim() ? '' : 'Informe seu sobrenome.'; } },
          email: { label: 'E-mail', validate: function (v) { if (!v.trim()) return 'Informe seu e-mail.'; if (!u.validEmail(v)) return 'Digite um e-mail válido, como nome@empresa.com.'; return ''; } }
        }, {
          summary: form.querySelector('[data-summary]'),
          onSubmit: function (f) {
            status.innerHTML = '';
            A.forms.busy(f, btn, true, 'Salvando…');
            u.wait(800).then(function () {
              A.forms.busy(f, btn, false);
              var name = (f.elements.first.value.trim() + ' ' + f.elements.last.value.trim()).replace(/\s+/g, ' ');
              A.session.update({ name: name, email: f.elements.email.value.trim(), role: f.elements.role.value.trim(), bio: f.elements.bio.value.trim() });
              if (D.people[0] && D.people[0].id === 'p1') D.people[0].name = name;
              u.store.set('prefs', { lang: f.elements.lang.value, tz: f.elements.tz.value, emailNotif: f.elements.emailNotif.checked, weekly: f.elements.weekly.checked, mentions: f.elements.mentions.checked });
              A.shell.setCollapsed(f.elements.collapsed.checked);
              A.shell.refreshUser();
              status.innerHTML = '<div class="msg msg--success" tabindex="-1">' + A.icon('circleCheck', 20) + '<div><p class="msg__title">Alterações salvas.</p><p>Seu perfil e suas preferências foram atualizados.</p></div></div>';
              status.firstChild.focus({ preventScroll: true });
              status.firstChild.scrollIntoView({ block: 'nearest' });
            });
          }
        });
        if (ctx.query.secao === 'preferencias') {
          setTimeout(function () {
            var h = root.querySelector('#h-pref');
            h.setAttribute('tabindex', '-1');
            h.scrollIntoView({ block: 'start' });
            h.focus({ preventScroll: true });
          }, 30);
        }
      },
      focusSelf: ctx.query.secao === 'preferencias'
    };
  };

  /* =========================================================
     Ajuda — perguntas frequentes + "Fale com a gente"
     ========================================================= */
  var FAQ = [
    ['Como convido pessoas para o workspace?', 'Acesse Equipe › Pessoas e clique em “Convidar pessoa”. A pessoa recebe um e-mail com o link de acesso.'],
    ['Posso recolher o menu lateral?', 'Sim. No computador, use o botão ao lado do logotipo. O Atlas lembra a sua escolha neste navegador.'],
    ['Como exporto os dados do painel?', 'No Painel, escolha o período e clique em “Exportar CSV”. O arquivo abre em qualquer planilha.'],
    ['Esqueci minha senha. E agora?', 'Na tela de login, use “Esqueci minha senha”. Enviaremos um link e um código para criar uma nova.']
  ];
  P.ajuda = function () {
    var s = me();
    var parts = String(s.name).split(' ');
    return {
      title: 'Ajuda', nav: 'ajuda', crumbs: [{ label: 'Ajuda' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Conta', title: 'Ajuda', desc: 'Respostas rápidas e contato com o time de suporte.' }) +
        '<section class="section" aria-labelledby="h-faq">' + ui.sectionHead('01', 'Perguntas frequentes', '', 'h-faq') +
          '<div class="faq">' + FAQ.map(function (f) { return '<details><summary>' + u.esc(f[0]) + A.icon('plus', 20) + '</summary><p>' + u.esc(f[1]) + '</p></details>'; }).join('') + '</div></section>' +
        '<section class="section contact" aria-labelledby="h-contact">' + ui.sectionHead('02', 'Fale com a gente', '', 'h-contact') +
          '<p class="page-desc contact__desc">Respondemos em até 1 dia útil.</p>' +
          '<form class="sw-form contact-form" novalidate>' +
            '<div data-summary role="alert"></div><div data-status role="status"></div>' +
            '<div class="sw-form-grid">' +
              '<div class="sw-field"><label class="sw-label" for="ct-first">Nome</label><input class="sw-input" id="ct-first" name="first" autocomplete="given-name" value="' + u.esc(parts[0] || '') + '" required aria-describedby="ct-first-msg"><p class="field__msg" id="ct-first-msg" data-msg-for="first"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="ct-last">Sobrenome</label><input class="sw-input" id="ct-last" name="last" autocomplete="family-name" value="' + u.esc(parts.slice(1).join(' ')) + '" required aria-describedby="ct-last-msg"><p class="field__msg" id="ct-last-msg" data-msg-for="last"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="ct-email">E-mail</label><input class="sw-input" id="ct-email" name="email" type="email" inputmode="email" autocomplete="email" value="' + u.esc(s.email) + '" required aria-describedby="ct-email-msg"><p class="field__msg" id="ct-email-msg" data-msg-for="email"></p></div>' +
              '<div class="sw-field"><label class="sw-label" for="ct-subject">Assunto</label>' + ui.select({ id: 'ct-subject', name: 'subject', options: [{ value: '', label: 'Selecione…' }, 'Dúvida sobre o produto', 'Problema técnico', 'Cobrança', 'Sugestão'], value: '', attrs: ' required aria-describedby="ct-subject-msg"' }) + '<p class="field__msg" id="ct-subject-msg" data-msg-for="subject"></p></div>' +
              '<div class="sw-field span-2"><label class="sw-label" for="ct-msg">Mensagem</label><textarea class="sw-textarea" id="ct-msg" name="message" rows="5" required aria-describedby="ct-msg-msg"></textarea><p class="field__msg" id="ct-msg-msg" data-msg-for="message"></p></div>' +
              '<div class="sw-field span-2"><label class="sw-check"><input type="checkbox" class="sw-checkbox" id="ct-terms" name="terms" required aria-describedby="ct-terms-msg"> <span>Concordo com os <button type="button" class="link-btn" data-legal="termos">Termos de uso</button> e a <button type="button" class="link-btn" data-legal="privacidade">Política de privacidade</button>.</span></label><p class="field__msg" id="ct-terms-msg" data-msg-for="terms"></p></div>' +
            '</div>' +
            '<div class="sw-form-foot"><button type="submit" class="sw-btn sw-btn--primary">Enviar mensagem</button></div>' +
          '</form></section>' +
      '</div>',
      mount: function (root) {
        var form = root.querySelector('.contact-form');
        var btn = form.querySelector('[type="submit"]');
        var status = form.querySelector('[data-status]');
        enterAdvances(form);
        A.forms.bind(form, {
          first: { label: 'Nome', validate: function (v) { return v.trim() ? '' : 'Informe seu nome.'; } },
          last: { label: 'Sobrenome', validate: function (v) { return v.trim() ? '' : 'Informe seu sobrenome.'; } },
          email: { label: 'E-mail', validate: function (v) { if (!v.trim()) return 'Informe seu e-mail.'; if (!u.validEmail(v)) return 'Digite um e-mail válido, como nome@empresa.com.'; return ''; } },
          subject: { label: 'Assunto', validate: function (v) { return v ? '' : 'Escolha um assunto.'; } },
          message: { label: 'Mensagem', validate: function (v) { v = v.trim(); if (!v) return 'Escreva sua mensagem.'; if (v.length < 10) return 'Conte um pouco mais (mínimo de 10 caracteres).'; return ''; } },
          terms: { label: 'Termos', validate: function (v) { return v ? '' : 'Aceite os termos para enviar.'; } }
        }, {
          summary: form.querySelector('[data-summary]'),
          onSubmit: function (f) {
            status.innerHTML = '';
            A.forms.busy(f, btn, true, 'Enviando…');
            u.wait(1100).then(function () {
              A.forms.busy(f, btn, false);
              status.innerHTML = '<div class="msg msg--success" tabindex="-1">' + A.icon('circleCheck', 20) + '<div><p class="msg__title">Mensagem enviada.</p><p>Obrigado, ' + u.esc(f.elements.first.value.trim()) + '! Responderemos em ' + u.esc(f.elements.email.value.trim()) + ' em até 1 dia útil.</p></div></div>';
              status.firstChild.focus({ preventScroll: true });
              status.firstChild.scrollIntoView({ block: 'nearest' });
            });
          }
        });
      }
    };
  };

  /* =========================================================
     Meu perfil
     ========================================================= */
  P.perfil = function () {
    var s = me();
    var myProjects = D.projects.filter(function (p) { return p.team.indexOf('p1') >= 0; });
    var open = D.tasks.filter(function (t) { return t.who === 'p1' && !t.done; }).length;
    var done = D.tasks.filter(function (t) { return t.who === 'p1' && t.done; }).length;
    return {
      title: 'Meu perfil', nav: '', crumbs: [{ label: 'Meu perfil' }],
      html: '<div class="page">' +
        '<header class="page-head profile-head"><div class="profile-head__id">' + ui.sqAvatar(s.name, 'sw-avatar--lg') +
          '<div class="page-head__text"><p class="overline">Meu perfil</p><h1 class="page-title" tabindex="-1">' + u.esc(s.name) + '</h1><p class="page-desc">' + u.esc(s.role || 'Membro da equipe') + ' · <span class="anywhere">' + u.esc(s.email) + '</span></p></div></div>' +
          '<div class="page-actions"><a class="sw-btn sw-btn--secondary" href="#/configuracoes">' + A.icon('pencil', 18) + 'Editar perfil</a></div></header>' +
        (s.bio ? '<p class="profile-bio">' + u.esc(s.bio) + '</p>' : '') +
        '<section class="section" aria-labelledby="h-num">' + ui.sectionHead('01', 'Em números', '', 'h-num') +
          '<dl class="meta-grid meta-grid--big"><div><dt>Projetos</dt><dd class="tabular">' + myProjects.length + '</dd></div><div><dt>Tarefas abertas</dt><dd class="tabular">' + open + '</dd></div><div><dt>Tarefas concluídas</dt><dd class="tabular">' + done + '</dd></div></dl></section>' +
        '<section class="section" aria-labelledby="h-myp">' + ui.sectionHead('02', 'Meus projetos', '', 'h-myp') +
          '<div class="sw-cards">' + myProjects.map(function (p) { return ui.projectCard(p, D.projects.indexOf(p)); }).join('') + '</div></section>' +
      '</div>'
    };
  };

  /* =========================================================
     Notificações
     ========================================================= */
  P.notificacoes = function (ctx) {
    var filter = 'todas';
    return {
      title: 'Notificações', nav: '', crumbs: [{ label: 'Notificações' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Conta', title: 'Notificações', desc: 'Atualizações dos seus projetos e da equipe.',
          actions: '<button type="button" class="sw-btn sw-btn--secondary" data-mark-all>' + A.icon('check', 18) + 'Marcar todas como lidas</button>' }) +
        '<section class="section" aria-labelledby="h-notifs"><h2 class="sr-only" id="h-notifs">Lista de notificações</h2>' +
          '<div data-filter-box></div><div class="sw-panel notif-page"><div data-list></div></div></section>' +
      '</div>',
      mount: function (root) {
        var box = root.querySelector('[data-list]');
        var forced = ui.demoState(ctx);
        function draw() {
          var unread = D.unreadNotifications();
          root.querySelector('[data-filter-box]').innerHTML = ui.filter('Filtrar notificações', [{ value: 'todas', label: 'Todas', count: D.notifications.length }, { value: 'nao-lidas', label: 'Não lidas', count: unread }], filter);
          var list = forced === 'vazio' ? [] : D.notifications.filter(function (n) { return filter === 'todas' || n.unread; });
          box.innerHTML = forced === 'erro' ? ui.state('error', { title: 'Não foi possível carregar as notificações.', action: 'Tentar novamente' })
            : list.length ? A.shell.notifListHTML(list)
            : ui.state('empty', { title: filter === 'todas' ? 'Nenhuma notificação.' : 'Você está em dia!', text: filter === 'todas' ? 'Quando houver novidades, elas aparecem aqui.' : 'Não há notificações não lidas.' });
          A.shell.refreshBadges();
        }
        box.innerHTML = ui.skeletonLines(5);
        if (forced !== 'carregando') setTimeout(draw, 350);
        root.addEventListener('click', function (e) {
          var t;
          if ((t = e.target.closest('[data-filter]'))) { filter = t.getAttribute('data-filter'); draw(); root.querySelector('[data-filter="' + filter + '"]').focus(); return; }
          if (e.target.closest('[data-mark-all]')) { D.notifications.forEach(function (n) { n.unread = false; }); draw(); A.toast('Todas as notificações foram marcadas como lidas.'); return; }
          if (e.target.closest('[data-state-action]')) { forced = null; box.innerHTML = ui.skeletonLines(5); setTimeout(draw, 500); return; }
          if ((t = e.target.closest('[data-notif-id]'))) A.shell.markNotif(t.dataset.notifId);
        });
      }
    };
  };

  /* =========================================================
     Mais (destino da bottom navigation no celular)
     ========================================================= */
  P.mais = function () {
    var groups = [
      { title: 'Geral', items: ['tarefas', 'calendario'] },
      { title: 'Equipe', items: ['pessoas', 'mensagens', 'relatorios'] },
      { title: 'Conta', items: ['configuracoes', 'ajuda'] }
    ];
    function navItem(id) {
      var it = null;
      A.shell.NAV.forEach(function (g) { g.items.forEach(function (x) { if (x.id === id) it = x; }); });
      return it;
    }
    function itemHTML(it, extra) {
      var unread = it.unread ? it.unread() : 0;
      return '<li><a class="more-item" href="' + it.href + '">' + A.icon(it.icon, 22) + '<span class="more-item__label">' + u.esc(it.label) + '</span>' +
        (unread ? '<span class="nav-item__badge" aria-hidden="true">' + unread + '</span><span class="sr-only">(' + unread + ' não lidas)</span>' : '') + (extra || '') + A.icon('chevronRight', 18) + '</a></li>';
    }
    var s = me();
    var nUnread = D.unreadNotifications();
    return {
      title: 'Mais', nav: '', crumbs: [{ label: 'Mais' }],
      html: '<div class="page">' +
        ui.pageHead({ overline: 'Atlas Workspace', title: 'Mais', desc: 'Todos os outros destinos do workspace.' }) +
        '<div class="sw-search more-search">' + A.icon('search', 18) + '<label class="sr-only" for="more-q">Buscar páginas, projetos, pessoas e tarefas</label><input class="sw-input" id="more-q" type="search" placeholder="Buscar no workspace" autocomplete="off" aria-controls="more-results"></div>' +
        '<div id="more-results" class="more-results" role="region" aria-live="polite" aria-label="Resultados da busca" hidden></div>' +
        '<div data-more-groups>' +
          groups.map(function (g, i) {
            return '<section class="section more-group" aria-labelledby="mg-' + i + '">' + ui.sectionHead(String(i + 1).padStart(2, '0'), g.title, '', 'mg-' + i) +
              '<ul class="more-list" role="list">' + g.items.map(function (id) { return itemHTML(navItem(id)); }).join('') +
              (g.title === 'Conta' ? itemHTML({ href: '#/notificacoes', icon: 'bell', label: 'Notificações', unread: function () { return nUnread; } }) + itemHTML({ href: '#/perfil', icon: 'user', label: 'Meu perfil' }) : '') +
              '</ul></section>';
          }).join('') +
          '<section class="section more-group" aria-labelledby="mg-s">' + ui.sectionHead('04', 'Sessão', '', 'mg-s') +
            '<div class="more-session"><p><strong>' + u.esc(s.name) + '</strong><span class="anywhere">' + u.esc(s.email) + '</span></p><button type="button" class="sw-btn sw-btn--secondary" data-logout>' + A.icon('logOut', 18) + 'Sair</button></div></section>' +
        '</div>' +
      '</div>',
      mount: function (root) {
        var input = root.querySelector('#more-q'), out = root.querySelector('#more-results'), groupsEl = root.querySelector('[data-more-groups]');
        input.addEventListener('input', function () {
          var q = input.value;
          if (!u.norm(q)) { out.hidden = true; groupsEl.hidden = false; return; }
          out.hidden = false; groupsEl.hidden = true;
          out.innerHTML = '<div class="more-results__box">' + A.searchResultsHTML(q, A.search(q), 'more-opt-').replace(/role="option"/g, '').replace(/ aria-selected="false" tabindex="-1"/g, '') + '</div>';
        });
        root.querySelector('[data-logout]').addEventListener('click', function () { A.shell.logout(); });
      }
    };
  };
})();
