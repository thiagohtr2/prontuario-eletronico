/* Páginas internas da aplicação (todas com dados fictícios). */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, $$, esc, icon, fmt } = A;
  const D = A.data;
  const U = A.ui;

  const pages = {};
  const TODAY = '2026-11-02';

  // ---------------------------------------------------------------- utilitários de página
  /** Bloco com estados (dados / carregando / vazio / erro) controlado por um seletor de demonstração. */
  function stateful(host, { data, skeleton, emptyTitle, emptyText, after }) {
    const area = $('[data-area]', host);
    let state = 'data';
    function set(s) {
      state = s;
      if (s === 'loading') area.innerHTML = skeleton();
      else if (s === 'empty') area.innerHTML = U.stateBox({ kind: 'empty', title: emptyTitle, text: emptyText });
      else if (s === 'error') area.innerHTML = U.stateBox({ kind: 'error', title: 'Não foi possível carregar', text: 'Verifique sua conexão e tente novamente.', retry: true });
      else area.innerHTML = data();
      area.setAttribute('aria-busy', String(s === 'loading'));
      $$('.state-switch [data-state]', host).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.state === s)));
      if (after) after(s, area);
    }
    area.addEventListener('click', (e) => {
      if (e.target.closest('[data-retry]')) { set('loading'); timer = setTimeout(() => set('data'), 900); }
    });
    let timer;
    U.bindStateSwitch(host, set);
    set('data');
    return { set, cleanup: () => clearTimeout(timer) };
  }

  const stateTableSwitch = (host, table) => {
    U.bindStateSwitch(host, (s) => table.setState(s));
  };

  const firstName = () => String((A.auth.user() || D.demoUser).name).split(' ')[0];

  // ---------------------------------------------------------------- INÍCIO
  pages.inicio = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Início', title: 'Início', lede: `Olá, ${firstName()}. Estes são os pacotes em destaque desta semana.` })}
      <section class="sec" aria-labelledby="in-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Em destaque</p>${U.stateSwitch('data')}</div>
        <h2 class="sec__title" id="in-h">Pacotes em destaque</h2>
        <div data-area></div>
      </section>`;
    const block = stateful(host, {
      data: () => `<div class="card-grid">${D.cards.map((c, i) => U.cardHTML(c, { n: i + 1, id: c.id })).join('')}</div>`,
      skeleton: () => U.skelCards(3),
      emptyTitle: 'Nenhum pacote em destaque',
      emptyText: 'Quando houver novos pacotes, eles aparecem aqui.',
    });
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-card]');
      if (b) U.cardDetail(D.cards.find((c) => c.id === b.dataset.card), b);
    });
    return block.cleanup;
  };

  // ---------------------------------------------------------------- PAINEL (Dashboard "Visão geral")
  pages.painel = (host) => {
    let period = A.store.get('atlas.period', '30d');
    if (!D.dash[period]) period = '30d';
    const timers = [];
    let cleanChart = null;

    host.innerHTML = `
      ${U.pageHead({
        overline: '01 — Painel',
        title: 'Visão geral',
        lede: 'Receita, clientes e atividade do workspace no período selecionado.',
        actions: `
          <div class="period" role="group" aria-label="Período">
            ${D.periods.map((p) => `<button type="button" class="seg-btn" data-period="${p.id}" aria-pressed="${p.id === period}">${esc(p.label)}</button>`).join('')}
          </div>
          <button type="button" class="btn btn--secondary btn--sm" id="dash-refresh">${icon('refresh-cw', { size: 16 })}<span>Atualizar</span></button>`,
      })}
      <section class="sec" aria-labelledby="kpi-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Indicadores</p></div>
        <h2 class="sec__title" id="kpi-h">Indicadores do período</h2>
        <div class="kpi-grid" id="kpis"></div>
      </section>
      <div class="dash-grid">
        <section class="sec chart-sec" aria-labelledby="ch-h">
          <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>03 — Receita</p></div>
          <h2 class="sec__title" id="ch-h">Receita por período</h2>
          <p class="legend"><span class="legend__sq" aria-hidden="true"></span>Receita (R$ mil)</p>
          <div class="chart-host" id="chart-host"></div>
        </section>
        <section class="sec" aria-labelledby="ac-h">
          <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>04 — Atividade</p></div>
          <h2 class="sec__title" id="ac-h">Atividade recente</h2>
          <div id="acts"></div>
        </section>
      </div>`;

    const kpis = $('#kpis', host), chartHost = $('#chart-host', host), acts = $('#acts', host);

    function clearTimers() { timers.forEach(clearTimeout); timers.length = 0; if (cleanChart) { cleanChart(); cleanChart = null; } }

    function load(announce) {
      clearTimers();
      const d = D.dash[period];
      kpis.innerHTML = [0, 1, 2].map((i) => `<div class="kpi-cell" data-i="${i}">${U.skelKpi(i)}</div>`).join('');
      chartHost.innerHTML = '<div class="skel skel--chart" aria-busy="true" aria-label="Carregando gráfico"></div>';
      acts.innerHTML = `<ol class="activity" aria-busy="true" aria-label="Carregando atividades">${Array.from({ length: 5 }, () => '<li class="activity__item"><span class="skel skel--line"></span></li>').join('')}</ol>`;
      d.kpis.forEach((k, i) => {
        timers.push(setTimeout(() => {
          const cell = $(`.kpi-cell[data-i="${i}"]`, kpis);
          if (!cell) return;
          cell.innerHTML = U.kpiHTML(k, d.compare, i);
          U.mountSpark($('.spark', cell), k);
        }, 450 + i * 160));
      });
      timers.push(setTimeout(() => { cleanChart = U.mountBarChart(chartHost, d.chart); }, 900));
      timers.push(setTimeout(() => {
        acts.innerHTML = `
          <ol class="activity">${d.activities.map((a, i) => `
            <li class="activity__item"><span class="activity__n">${String(i + 1).padStart(2, '0')}</span>
              <span class="activity__txt">${a[2] ? '<span class="activity__new" aria-hidden="true"></span><span class="sr-only">Novo: </span>' : ''}${esc(a[0])}<time class="activity__time">${esc(a[1])}</time></span></li>`).join('')}</ol>
          <a class="more-link" href="#/relatorios">Ver relatórios${icon('arrow-up-right', { size: 16 })}</a>`;
        if (announce) A.announce('Painel atualizado: ' + D.periods.find((p) => p.id === period).label);
      }, 1100));
    }

    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-period]');
      if (b && b.dataset.period !== period) {
        period = b.dataset.period;
        A.store.set('atlas.period', period);
        $$('[data-period]', host).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        load(true);
      }
      if (e.target.closest('#dash-refresh')) load(true);
    });
    load(false);
    return clearTimers;
  };

  // ---------------------------------------------------------------- PROJETOS
  const projectCard = (p, i) => U.cardHTML(
    { icon: 'folder', label: p.status, title: p.name, text: p.text, meta: `${p.progress}% · ${p.updated}`, action: 'Abrir projeto' },
    { n: i + 1, href: '#/projetos/' + p.id },
  );

  pages.projetos = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Projetos', title: 'Projetos', lede: `${D.projects.length} projetos ativos no workspace.` })}
      <section class="sec" aria-labelledby="pj-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Lista</p>${U.stateSwitch('data')}</div>
        <h2 class="sec__title" id="pj-h">Todos os projetos</h2>
        <div data-area></div>
      </section>`;
    return stateful(host, {
      data: () => `<div class="card-grid">${D.projects.map(projectCard).join('')}</div>`,
      skeleton: () => U.skelCards(6),
      emptyTitle: 'Nenhum projeto ainda',
      emptyText: 'Crie o primeiro projeto para começar a organizar o trabalho.',
    }).cleanup;
  };

  pages.projeto = (host, route) => {
    const p = D.projectById(route.params.id);
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Projeto', title: p.name, lede: p.text })}
      <section class="sec" aria-labelledby="pd-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Resumo</p></div>
        <h2 class="sec__title" id="pd-h">Informações do projeto</h2>
        <dl class="dl dl--row">
          <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
          <div><dt>Responsável</dt><dd>${esc(p.owner)}</dd></div>
          <div><dt>Atualizado em</dt><dd>${esc(p.updated)}</dd></div>
          <div><dt>Progresso</dt><dd>${p.progress}%<span class="progress" role="img" aria-label="${p.progress}% concluído"><i style="width:${p.progress}%"></i></span></dd></div>
        </dl>
      </section>
      <section class="sec" aria-labelledby="pp-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>03 — Páginas</p></div>
        <h2 class="sec__title" id="pp-h">Páginas do projeto</h2>
        <ul class="rule-list">
          ${p.pages.map((pg, i) => `
            <li><a class="rule-list__row" href="#/projetos/${p.id}/${pg.id}">
              <span class="rule-list__n">${String(i + 1).padStart(2, '0')}</span>
              <span class="rule-list__main"><span class="rule-list__title">${esc(pg.name)}</span><span class="rule-list__meta">${esc(pg.status)} · atualizada em ${esc(pg.updated)}</span></span>
              ${icon('chevron-right')}
            </a></li>`).join('')}
        </ul>
      </section>`;
  };

  pages.projetoPagina = (host, route) => {
    const p = D.projectById(route.params.id);
    const pg = p.pages.find((x) => x.id === route.params.page);
    host.innerHTML = `
      ${U.pageHead({ overline: `01 — ${p.name}`, title: pg.name, lede: `Página do projeto ${p.name}.` })}
      <section class="sec" aria-labelledby="pg-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Detalhes</p></div>
        <h2 class="sec__title" id="pg-h">Informações da página</h2>
        <dl class="dl dl--row">
          <div><dt>Status</dt><dd>${esc(pg.status)}</dd></div>
          <div><dt>Atualizada em</dt><dd>${esc(pg.updated)}</dd></div>
          <div><dt>Projeto</dt><dd><a href="#/projetos/${p.id}">${esc(p.name)}</a></dd></div>
        </dl>
      </section>
      <section class="sec" aria-labelledby="rv-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>03 — Revisões</p></div>
        <h2 class="sec__title" id="rv-h">Revisões pendentes</h2>
        ${U.stateBox({ kind: 'empty', title: 'Nenhuma revisão pendente', text: 'Tudo certo por aqui. Novas revisões aparecem nesta lista.' })}
      </section>`;
  };

  // ---------------------------------------------------------------- TAREFAS e PESSOAS (tabelas)
  pages.tarefas = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Tarefas', title: 'Tarefas', lede: 'O que precisa de atenção esta semana.' })}
      <div class="sec"><div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Lista</p>${U.stateSwitch('data')}</div>
      <div data-table></div></div>`;
    const t = U.createTable($('[data-table]', host), {
      title: 'Tarefas da equipe', onState: (st) => U.syncStateSwitch(host, st), itemName: 'tarefa', itemTitle: 'Tarefa', exportName: 'tarefas',
      emptyTitle: 'Nenhuma tarefa por aqui', emptyText: 'Crie uma tarefa para acompanhar o andamento.',
      columns: [
        { key: 'tarefa', label: 'Tarefa', type: 'text' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'prazo', label: 'Prazo', type: 'date' },
        { key: 'horas', label: 'Horas', type: 'num', format: (v) => v + ' h' },
      ],
      rows: D.tasks,
    });
    stateTableSwitch(host, t);
  };

  pages.pessoas = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Pessoas', title: 'Pessoas', lede: 'Quem faz parte do workspace.' })}
      <div class="sec"><div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Equipe</p>${U.stateSwitch('data')}</div>
      <div data-table></div></div>`;
    const t = U.createTable($('[data-table]', host), {
      title: 'Equipe', onState: (st) => U.syncStateSwitch(host, st), itemName: 'pessoa', itemTitle: 'Pessoa', exportName: 'pessoas',
      emptyTitle: 'Ninguém na equipe ainda', emptyText: 'Convide pessoas para colaborar.',
      columns: [
        { key: 'nome', label: 'Nome', type: 'text' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'funcao', label: 'Função', type: 'text' },
        { key: 'projetos', label: 'Projetos', type: 'num' },
      ],
      rows: D.people,
    });
    stateTableSwitch(host, t);
  };

  // ---------------------------------------------------------------- CALENDÁRIO (agenda em lista)
  pages.calendario = (host) => {
    const dateLabel = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Calendário', title: 'Calendário', lede: 'Próximos compromissos em formato de agenda.' })}
      <section class="sec" aria-labelledby="ag-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Agenda</p></div>
        <h2 class="sec__title" id="ag-h">Novembro de 2026</h2>
        <div class="agenda">
          ${D.events.map((day) => `
            <section class="agenda__day" aria-labelledby="d-${day.date}">
              <h3 class="agenda__date" id="d-${day.date}">${esc(dateLabel(day.date))}${day.date === TODAY ? ' <span class="tag">Hoje</span>' : ''}</h3>
              <ul>${day.items.map((ev) => `
                <li class="agenda__item"><time class="agenda__time">${esc(ev.time)}</time><span class="agenda__main"><span class="agenda__title">${esc(ev.title)}</span><span class="agenda__where">${esc(ev.where)}</span></span></li>`).join('')}</ul>
            </section>`).join('')}
        </div>
      </section>`;
  };

  // ---------------------------------------------------------------- MENSAGENS
  pages.mensagens = (host) => {
    host.innerHTML = `
      ${U.pageHead({
        overline: '01 — Mensagens', title: 'Mensagens', lede: 'Conversas e avisos da equipe.',
        actions: '<button type="button" class="btn btn--secondary btn--sm" id="read-all">Marcar todas como lidas</button>',
      })}
      <section class="sec" aria-labelledby="ms-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Caixa de entrada</p>${U.stateSwitch('data')}</div>
        <h2 class="sec__title" id="ms-h">Caixa de entrada</h2>
        <div data-area></div>
      </section>`;
    const readAll = $('#read-all', host);
    const sync = () => {
      const none = A.live.unreadMessages() === 0;
      readAll.disabled = none;
      readAll.setAttribute('aria-disabled', String(none));
    };
    const block = stateful(host, {
      data: () => `<ul class="msg-list">${A.live.messages.map((m) => `
        <li><button type="button" class="msg ${m.unread ? 'is-unread' : ''}" data-id="${m.id}" aria-pressed="${!m.unread}" data-fid="m-${m.id}">
          <span class="avatar" aria-hidden="true">${esc(A.initials(m.from))}</span>
          <span class="msg__main"><span class="msg__from">${m.unread ? '<span class="sr-only">Não lida: </span>' : ''}${esc(m.from)}</span><span class="msg__subject">${esc(m.subject)}</span></span>
          <span class="msg__time">${esc(m.time)}</span><span class="msg__dot" aria-hidden="true"></span>
        </button></li>`).join('')}</ul>`,
      skeleton: () => `<ul class="msg-list" aria-busy="true">${Array.from({ length: 4 }, () => '<li class="msg msg--skel"><span class="skel skel--avatar"></span><span class="msg__main"><span class="skel skel--line" style="width:30%"></span><span class="skel skel--line"></span></span></li>').join('')}</ul>`,
      emptyTitle: 'Caixa de entrada vazia', emptyText: 'Novas mensagens aparecem aqui.',
      after: sync,
    });
    host.addEventListener('click', (e) => {
      const b = e.target.closest('.msg[data-id]');
      if (b) {
        const m = A.live.messages.find((x) => x.id === b.dataset.id);
        m.unread = !m.unread;
        A.live.emit();
        block.set('data');
        const again = host.querySelector(`[data-fid="m-${m.id}"]`);
        if (again) again.focus();
      }
      if (e.target.closest('#read-all') && !readAll.disabled) {
        A.live.messages.forEach((m) => { m.unread = false; });
        A.live.emit();
        block.set('data');
        U.toast('Todas as mensagens foram marcadas como lidas.');
      }
    });
    return block.cleanup;
  };

  // ---------------------------------------------------------------- RELATÓRIOS
  pages.relatorios = (host, route) => {
    const kid = route.query.kpi;
    const kpi = kid && D.dash['30d'].kpis.find((k) => k.id === kid);
    const detail = kpi ? `
      <section class="sec" aria-labelledby="rd-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Indicador</p></div>
        <h2 class="sec__title" id="rd-h">Relatório: ${esc(kpi.label)}</h2>
        <div class="report-kpi">
          <p class="kpi__value">${esc(kpi.value)}</p>
          <p class="kpi__delta is-${kpi.delta > 0 ? 'up' : kpi.delta < 0 ? 'down' : 'flat'}">${icon(kpi.delta > 0 ? 'arrow-up-right' : kpi.delta < 0 ? 'arrow-down-right' : 'minus', { size: 16 })}<strong>${fmt.pct(kpi.delta)}</strong><span class="kpi__cmp">${esc(D.dash['30d'].compare)}</span></p>
        </div>
        <div class="sw-table__scroll" tabindex="0" role="region" aria-label="Série histórica de ${esc(kpi.label)}">
          <table class="sw-table__table"><caption class="sr-only">Série histórica de ${esc(kpi.label)}</caption>
            <thead><tr><th scope="col">Período</th><th scope="col" class="num">Valor</th></tr></thead>
            <tbody>${kpi.series.map((v, i) => `<tr><td>${['dez', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov'][i]}</td><td class="num">${esc(kpi.unit.replace('{v}', Number.isInteger(v) ? fmt.int(v) : fmt.num(v, 1)))}</td></tr>`).join('')}</tbody></table>
        </div>
      </section>` : '';
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Relatórios', title: 'Relatórios', lede: kpi ? `Detalhe do indicador "${kpi.label}" e pedidos recentes.` : 'Pedidos recentes e indicadores detalhados.' })}
      ${detail}
      <div class="sec"><div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>0${kpi ? 3 : 2} — Pedidos</p>${U.stateSwitch('data')}</div>
      <div data-table></div></div>`;
    const t = U.createTable($('[data-table]', host), {
      title: 'Pedidos recentes', onState: (st) => U.syncStateSwitch(host, st), itemName: 'pedido', itemTitle: 'Pedido', exportName: 'pedidos-recentes',
      emptyTitle: 'Nenhum pedido encontrado', emptyText: 'Os pedidos aparecem aqui assim que forem criados.',
      columns: [
        { key: 'cliente', label: 'Cliente', type: 'text' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'valor', label: 'Valor', type: 'num', format: (v) => fmt.brl(v) },
        { key: 'data', label: 'Data', type: 'date' },
      ],
      rows: D.orders,
    });
    stateTableSwitch(host, t);
  };

  // ---------------------------------------------------------------- CONFIGURAÇÕES
  pages.configuracoes = (host) => {
    const u = A.auth.user() || D.demoUser;
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Configurações', title: 'Configurações', lede: 'Dados da conta e preferências.' })}
      <div class="sec"><div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Perfil</p></div><div data-form></div></div>`;
    U.mountForm($('[data-form]', host), {
      title: 'Seu perfil', desc: 'Estas informações aparecem para a sua equipe.',
      submitLabel: 'Salvar alterações', loadingText: 'Salvando…', successText: 'Alterações salvas.',
      fields: [
        { type: 'text', name: 'nome', label: 'Nome completo', autocomplete: 'name', value: u.name, half: true, rule: (v) => (v.trim() ? '' : 'Informe seu nome') },
        { type: 'email', name: 'email', label: 'E-mail', autocomplete: 'email', inputmode: 'email', value: u.email, half: true, rule: (v) => (!v.trim() ? 'Informe seu e-mail' : A.forms.EMAIL_RE.test(v.trim()) ? '' : 'Informe um e-mail válido') },
        { type: 'text', name: 'cargo', label: 'Cargo', autocomplete: 'organization-title', value: u.role || '', half: true, optional: true },
        { type: 'select', name: 'idioma', label: 'Idioma', half: true, options: [['pt-BR', 'Português (Brasil)'], ['en-US', 'English (US)'], ['es-ES', 'Español']] },
        { type: 'checkbox', name: 'resumo', html: 'Receber o resumo semanal por e-mail' },
      ],
    });
  };

  // ---------------------------------------------------------------- AJUDA (FAQ + formulário "Fale com a gente")
  pages.ajuda = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '01 — Ajuda', title: 'Ajuda', lede: 'Respostas rápidas e contato com o suporte.' })}
      <section class="sec" aria-labelledby="fq-h">
        <div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>02 — Perguntas frequentes</p></div>
        <h2 class="sec__title" id="fq-h">Perguntas frequentes</h2>
        <div class="faq">${D.faq.map(([q, a]) => `<details class="faq__item"><summary><span>${esc(q)}</span>${icon('chevron-down')}</summary><p>${esc(a)}</p></details>`).join('')}</div>
      </section>
      <div class="sec"><div class="sec__head"><p class="overline"><span class="sq" aria-hidden="true"></span>03 — Contato</p></div><div data-form></div></div>`;
    const req = (msg) => (v) => (String(v).trim() ? '' : msg);
    U.mountForm($('[data-form]', host), {
      title: 'Fale com a gente', desc: 'Respondemos em até 1 dia útil.',
      submitLabel: 'Enviar mensagem', loadingText: 'Enviando…', successText: 'Mensagem enviada. Respondemos em até 1 dia útil.', resetOnSuccess: true,
      fields: [
        { type: 'text', name: 'nome', label: 'Nome', autocomplete: 'given-name', half: true, rule: req('Informe seu nome') },
        { type: 'text', name: 'sobrenome', label: 'Sobrenome', autocomplete: 'family-name', half: true, rule: req('Informe seu sobrenome') },
        { type: 'email', name: 'email', label: 'E-mail', autocomplete: 'email', inputmode: 'email', half: true, rule: (v) => (!v.trim() ? 'Informe seu e-mail' : A.forms.EMAIL_RE.test(v.trim()) ? '' : 'Informe um e-mail válido') },
        { type: 'select', name: 'assunto', label: 'Assunto', half: true, options: [['', 'Selecione…'], ['duvida', 'Dúvida sobre o produto'], ['cobranca', 'Cobrança'], ['sugestao', 'Sugestão'], ['problema', 'Relatar um problema']], rule: req('Escolha um assunto') },
        { type: 'textarea', name: 'mensagem', label: 'Mensagem', rows: 5, rule: (v) => (v.trim().length < 10 ? 'Escreva pelo menos 10 caracteres' : '') },
        { type: 'checkbox', name: 'termos', required: true, html: 'Li e aceito a <a href="#/privacidade" target="_blank" rel="noopener">Política de privacidade</a>.', rule: (v) => (v ? '' : 'Aceite a política de privacidade para enviar') },
      ],
    });
  };

  // ---------------------------------------------------------------- NÃO ENCONTRADA
  pages.naoEncontrada = (host) => {
    host.innerHTML = `
      ${U.pageHead({ overline: '404', title: 'Página não encontrada', lede: 'O endereço pode ter mudado ou não existe.' })}
      <p><a class="btn btn--primary" href="#/painel">Ir para o Painel</a></p>`;
  };

  // ---------------------------------------------------------------- resolução de rotas internas
  function resolve(path) {
    const seg = path.split('/').filter(Boolean);
    const [a, b, c] = seg;
    if (!a) return null;
    const mk = (o) => ({ path: '/' + seg.join('/'), ...o });
    if (a === 'projetos' && b) {
      const p = D.projectById(b);
      if (!p) return mk({ id: '404', top: 'projetos', title: 'Página não encontrada', crumbs: [{ label: 'Página não encontrada' }], render: pages.naoEncontrada, params: {} });
      if (!c) return mk({ id: 'projeto', top: 'projetos', title: p.name, params: { id: b }, render: pages.projeto,
        crumbs: [{ label: 'Projetos', href: '#/projetos' }, { label: p.name }] });
      const pg = p.pages.find((x) => x.id === c);
      if (pg && seg.length === 3) return mk({ id: 'projeto-pagina', top: 'projetos', title: pg.name, params: { id: b, page: c }, render: pages.projetoPagina,
        crumbs: [{ label: 'Projetos', href: '#/projetos' }, { label: p.name, href: '#/projetos/' + p.id }, { label: pg.name }] });
    }
    const nav = D.navById(a);
    if (nav && seg.length === 1) return mk({ id: a, top: a, title: nav.label, params: {}, render: pages[a], crumbs: [{ label: nav.label }] });
    return mk({ id: '404', top: '', title: 'Página não encontrada', params: {}, render: pages.naoEncontrada, crumbs: [{ label: 'Página não encontrada' }] });
  }

  A.pages = { resolve, pages };
})();
