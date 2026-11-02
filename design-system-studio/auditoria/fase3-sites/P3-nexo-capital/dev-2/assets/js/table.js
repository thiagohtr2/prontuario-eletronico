/* ==========================================================================
   Tabela de dados "Compact Pro": <table> semântica, seleção com checkbox
   (todos/indeterminado), ordenação com aria-sort, filtro, ações por linha,
   estados de carregando (skeleton), vazio e erro. No celular vira cartões.
   ========================================================================== */
(function (w, d) {
  'use strict';
  var NX = (w.NX = w.NX || {});
  var ui = NX.ui, esc = NX.fmt.esc;

  var COLS = [
    { key: 'cliente', label: 'Cliente', cls: 'col-name' },
    { key: 'status', label: 'Status', cls: '' },
    { key: 'valor', label: 'Valor', cls: 'is-num' },
    { key: 'data', label: 'Data', cls: '' }
  ];

  var SORT_OPTIONS = [
    ['', 'Ordem padrão'],
    ['cliente:asc', 'Cliente (A–Z)'],
    ['cliente:desc', 'Cliente (Z–A)'],
    ['status:asc', 'Status (A–Z)'],
    ['valor:desc', 'Valor (maior primeiro)'],
    ['valor:asc', 'Valor (menor primeiro)'],
    ['data:desc', 'Data (mais recente)'],
    ['data:asc', 'Data (mais antiga)']
  ];

  function cmp(key) {
    return function (a, b) {
      if (key === 'cliente') return a.cliente.localeCompare(b.cliente, 'pt-BR');
      if (key === 'status') return NX.status[a.status].label.localeCompare(NX.status[b.status].label, 'pt-BR');
      if (key === 'valor') return a.valor - b.valor;
      return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
    };
  }

  NX.table = {
    create: function (host) {
      var uid = 'tb' + Math.random().toString(36).slice(2, 6);
      var st = {
        title: '', rows: [], removed: [], query: '', sort: null,
        selected: {}, state: 'loading', periodLabel: '', onRetry: null
      };

      host.innerHTML =
        '<section class="cp-card" aria-labelledby="' + uid + '-t">' +
        '<div class="cp-card__head"><div><h2 class="cp-card__title" id="' + uid + '-t"></h2>' +
        '<p class="cp-card__sub" id="' + uid + '-m"></p></div>' +
        '<div class="cp-card__tools" id="' + uid + '-sel" hidden></div></div>' +
        '<div class="tbl-tools"><div class="tbl-tools__group">' +
        '<div class="search-field">' + NX.icon('search', 16) +
        '<label class="sr-only" for="' + uid + '-q">Filtrar por cliente</label>' +
        '<input class="input" id="' + uid + '-q" type="search" placeholder="Filtrar por cliente" autocomplete="off" enterkeyhint="search"></div>' +
        '<div class="sort-select"><label class="sr-only" for="' + uid + '-s">Ordenar por</label>' +
        '<select class="input" id="' + uid + '-s"></select></div>' +
        '</div></div>' +
        '<div class="tbl-body" id="' + uid + '-b"></div>' +
        '<p class="tbl-foot" id="' + uid + '-f"></p>' +
        '</section>';

      var el = host.firstChild;
      var $t = el.querySelector('#' + uid + '-t');
      var $m = el.querySelector('#' + uid + '-m');
      var $sel = el.querySelector('#' + uid + '-sel');
      var $q = el.querySelector('#' + uid + '-q');
      var $s = el.querySelector('#' + uid + '-s');
      var $b = el.querySelector('#' + uid + '-b');
      var $f = el.querySelector('#' + uid + '-f');
      $s.innerHTML = SORT_OPTIONS.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');

      /* ---------- derivados ---------- */
      function visibleRows() {
        var q = st.query.trim().toLowerCase();
        var rows = st.rows.filter(function (r) { return !q || r.cliente.toLowerCase().indexOf(q) >= 0 || r.id.toLowerCase().indexOf(q) >= 0; });
        if (st.sort) {
          var c = cmp(st.sort.key), dir = st.sort.dir === 'asc' ? 1 : -1;
          rows = rows.slice().sort(function (a, b) { return c(a, b) * dir; });
        }
        return rows;
      }
      function selectedIds() { return Object.keys(st.selected).filter(function (k) { return st.selected[k]; }); }

      /* ---------- cabeçalho / meta ---------- */
      function renderMeta() {
        $t.textContent = st.title;
        var total = st.rows.length, vis = visibleRows().length;
        var unit = total === 1 ? 'registro' : 'registros';
        if (st.state === 'loading') $m.textContent = 'Carregando…';
        else if (st.state === 'error') $m.textContent = 'Falha ao carregar';
        else $m.textContent = (st.query && vis !== total ? vis + ' de ' + total : total) + ' ' + unit + ' · ' + st.periodLabel;
      }

      function renderSel() {
        var ids = selectedIds();
        if (!ids.length || st.state !== 'ready') { $sel.hidden = true; $sel.innerHTML = ''; return; }
        $sel.hidden = false;
        $sel.innerHTML =
          '<span class="sel-count" role="status">' + ids.length + (ids.length === 1 ? ' selecionado' : ' selecionados') + '</span>' +
          '<button type="button" class="btn btn--outline" data-act="bulk-remove">' + NX.icon('trash-2', 16) + '<span>Remover</span></button>' +
          '<button type="button" class="btn btn--ghost" data-act="clear-sel"><span>Limpar seleção</span></button>';
      }

      /* ---------- corpo ---------- */
      function stateBlock(kind, icon, title, text, btn) {
        return '<div class="state tbl-state' + (kind === 'error' ? ' state--error' : '') + '">' + NX.icon(icon, 24) +
          '<p class="state__title">' + esc(title) + '</p><p class="state__text">' + esc(text) + '</p>' +
          (btn ? '<button type="button" class="btn btn--outline" data-act="' + btn[0] + '">' + NX.icon(btn[2] || 'refresh-cw', 16) + '<span>' + esc(btn[1]) + '</span></button>' : '') +
          '</div>';
      }

      function renderBody(restoreKey) {
        var html;
        $b.removeAttribute('aria-busy');
        if (st.state === 'loading') {
          $b.setAttribute('aria-busy', 'true');
          html = '<div class="tbl-wrap" role="status" aria-label="Carregando ' + esc(st.title) + '"><div class="skel-rows">';
          for (var i = 0; i < 4; i++) {
            html += '<div class="skel-row"><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span></div>';
          }
          html += '</div></div>';
        } else if (st.state === 'error') {
          html = stateBlock('error', 'triangle-alert', 'Não foi possível carregar os dados', 'Houve uma falha de comunicação com o servidor de demonstração. Tente novamente.', ['retry', 'Tentar novamente']);
        } else if (!st.rows.length) {
          html = stateBlock('empty', 'inbox', 'Nenhum registro no período', st.removed.length ? 'Todos os registros foram removidos da lista.' : 'Quando houver movimentações, elas aparecerão aqui.', st.removed.length ? ['restore', 'Restaurar registros removidos', 'refresh-cw'] : null);
        } else {
          var rows = visibleRows();
          if (!rows.length) {
            html = stateBlock('empty', 'search', 'Nenhum resultado para “' + st.query.trim() + '”', 'Revise o termo digitado ou limpe o filtro.', ['clear-filter', 'Limpar filtro', 'x']);
          } else {
            html = renderTable(rows);
          }
        }
        $b.innerHTML = html;
        syncSelectUI();
        if (restoreKey) {
          var t = $b.querySelector('[data-sort="' + restoreKey + '"]');
          if (t) t.focus({ preventScroll: true });
        }
      }

      function sortAttr(key) {
        if (!st.sort || st.sort.key !== key) return 'none';
        return st.sort.dir === 'asc' ? 'ascending' : 'descending';
      }
      function sortIcon(key) {
        var a = sortAttr(key);
        return NX.icon(a === 'ascending' ? 'arrow-up' : a === 'descending' ? 'arrow-down' : 'arrow-up-down', 14);
      }

      function renderTable(rows) {
        var h = '<div class="tbl-wrap"><table class="tbl" role="table"><caption class="sr-only">' + esc(st.title) + '</caption>' +
          '<thead role="rowgroup"><tr role="row">' +
          '<th scope="col" role="columnheader" class="col-select"><label class="check-cell"><input type="checkbox" data-act="select-all" aria-label="Selecionar todos os registros"><span class="select-all-text" aria-hidden="true">Selecionar todos</span></label></th>';
        COLS.forEach(function (c) {
          h += '<th scope="col" role="columnheader" class="' + c.cls + '" aria-sort="' + sortAttr(c.key) + '">' +
            '<button type="button" class="th-sort" data-sort="' + c.key + '">' + esc(c.label) + sortIcon(c.key) + '</button></th>';
        });
        h += '<th scope="col" role="columnheader" class="col-actions"><span class="sr-only">Ações</span></th></tr></thead><tbody role="rowgroup">';
        rows.forEach(function (r) {
          var sel = !!st.selected[r.id], s = NX.status[r.status];
          h += '<tr role="row" data-id="' + esc(r.id) + '" class="' + (sel ? 'is-selected' : '') + '">' +
            '<td role="cell" class="col-select"><label class="check-cell"><input type="checkbox" data-act="select" ' + (sel ? 'checked' : '') + ' aria-label="Selecionar ' + esc(r.cliente) + '"></label></td>' +
            '<td role="cell" class="col-name" data-label="Cliente">' + esc(r.cliente) + '</td>' +
            '<td role="cell" data-label="Status"><span class="badge badge--' + s.tone + '">' + s.label + '</span></td>' +
            '<td role="cell" class="is-num" data-label="Valor">' + NX.fmt.brl(r.valor) + '</td>' +
            '<td role="cell" data-label="Data"><time datetime="' + r.data + '">' + NX.fmt.date(r.data) + '</time></td>' +
            '<td role="cell" class="col-actions"><button type="button" class="icon-btn row-menu-btn" data-act="row-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Ações de ' + esc(r.cliente) + '">' + NX.icon('ellipsis', 16) + '</button></td>' +
            '</tr>';
        });
        return h + '</tbody></table></div>';
      }

      function syncSelectUI() {
        var all = $b.querySelector('[data-act="select-all"]');
        var rows = visibleRows();
        var n = rows.filter(function (r) { return st.selected[r.id]; }).length;
        if (all) {
          all.checked = rows.length > 0 && n === rows.length;
          all.indeterminate = n > 0 && n < rows.length;
        }
        $f.textContent = '';
        if (st.removed.length && st.rows.length) {
          $f.innerHTML = st.removed.length + (st.removed.length === 1 ? ' registro removido da lista. ' : ' registros removidos da lista. ') +
            '<button type="button" class="link-btn" data-act="restore">Restaurar</button>';
        }
        var sv = st.sort ? st.sort.key + ':' + st.sort.dir : '';
        if ($s.value !== sv) $s.value = sv;
        renderSel();
      }

      function renderAll() { renderMeta(); renderBody(); }

      /* ---------- ações ---------- */
      function remove(ids) {
        var set = {};
        ids.forEach(function (i) { set[i] = true; });
        var gone = st.rows.filter(function (r) { return set[r.id]; });
        st.rows = st.rows.filter(function (r) { return !set[r.id]; });
        st.removed = st.removed.concat(gone);
        ids.forEach(function (i) { delete st.selected[i]; });
        renderMeta();
        renderBody();
        ui.toast(gone.length + (gone.length === 1 ? ' registro removido da lista.' : ' registros removidos da lista.'), 'trash-2');
      }

      function openDetails(row, opener) {
        var s = NX.status[row.status];
        var dlg = d.createElement('dialog');
        dlg.className = 'modal';
        dlg.setAttribute('aria-labelledby', uid + '-dt');
        dlg.innerHTML =
          '<div class="modal__head"><h2 class="modal__title" id="' + uid + '-dt">Detalhes de ' + esc(row.id) + '</h2>' +
          '<button type="button" class="icon-btn" data-close aria-label="Fechar">' + NX.icon('x', 20) + '</button></div>' +
          '<div class="modal__body"><dl class="dl">' +
          '<dt>Cliente</dt><dd>' + esc(row.cliente) + '</dd>' +
          '<dt>Status</dt><dd><span class="badge badge--' + s.tone + '">' + s.label + '</span></dd>' +
          '<dt>Valor</dt><dd class="tabular">' + NX.fmt.brl(row.valor) + '</dd>' +
          '<dt>Data</dt><dd>' + NX.fmt.date(row.data) + '</dd>' +
          '<dt>Forma de pagamento</dt><dd>' + esc(row.forma) + '</dd>' +
          '<dt>Responsável</dt><dd>' + esc(NX.user.name) + '</dd>' +
          '</dl></div>' +
          '<div class="modal__foot"><button type="button" class="btn btn--outline" data-copy>' + NX.icon('copy', 16) + '<span>Copiar ID</span></button>' +
          '<button type="button" class="btn btn--primary" data-close><span>Fechar</span></button></div>';
        d.getElementById('overlay-root').appendChild(dlg);
        dlg.addEventListener('click', function (e) {
          if (e.target === dlg) dlg.close();
          var c = e.target.closest('[data-close]');
          if (c) dlg.close();
          if (e.target.closest('[data-copy]')) copyId(row.id);
        });
        dlg.addEventListener('close', function () { dlg.remove(); if (opener && opener.isConnected) opener.focus({ preventScroll: true }); });
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      }

      function copyId(id) {
        function ok() { ui.toast('ID ' + id + ' copiado.', 'check'); }
        function fallback() {
          var t = d.createElement('textarea'); t.value = id; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
          d.body.appendChild(t); t.select();
          try { d.execCommand('copy'); ok(); } catch (e) { ui.toast('Não foi possível copiar o ID.', 'circle-alert'); }
          t.remove();
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(id).then(ok, fallback); else fallback();
      }

      function setSort(key, dir) {
        st.sort = key ? { key: key, dir: dir } : null;
        renderBody(key);
      }

      el.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act], [data-sort]');
        if (!t || !el.contains(t)) return;
        if (t.hasAttribute('data-sort')) {
          var key = t.getAttribute('data-sort'), cur = st.sort && st.sort.key === key ? st.sort.dir : null;
          var next = cur === null ? 'asc' : cur === 'asc' ? 'desc' : null;
          setSort(next ? key : null, next);
          var lbl = COLS.filter(function (c) { return c.key === key; })[0].label;
          ui.announce(next ? 'Ordenado por ' + lbl + ', ' + (next === 'asc' ? 'crescente' : 'decrescente') + '.' : 'Ordenação removida.');
          return;
        }
        var act = t.getAttribute('data-act'), tr = t.closest('tr'), id = tr && tr.getAttribute('data-id');
        if (act === 'retry') { if (st.onRetry) st.onRetry(); }
        else if (act === 'restore') { st.rows = st.rows.concat(st.removed); st.removed = []; renderAll(); ui.toast('Registros restaurados.', 'check'); }
        else if (act === 'clear-filter') { st.query = ''; $q.value = ''; renderAll(); $q.focus(); }
        else if (act === 'clear-sel') { st.selected = {}; renderBody(); }
        else if (act === 'bulk-remove') { remove(selectedIds()); }
        else if (act === 'row-menu') {
          if (t.getAttribute('aria-expanded') === 'true') { ui.closePopover(true); return; }
          var row = st.rows.filter(function (r) { return r.id === id; })[0];
          if (!row) return;
          ui.openMenu(t, [
            { label: 'Ver detalhes', icon: 'file-search', onSelect: function () { openDetails(row, t); } },
            { label: 'Copiar ID', icon: 'copy', onSelect: function () { copyId(row.id); } },
            { sep: true },
            { label: 'Remover da lista', icon: 'trash-2', danger: true, onSelect: function () { remove([row.id]); } }
          ], { placement: 'bottom-end', label: 'Ações de ' + row.cliente });
        }
      });

      el.addEventListener('change', function (e) {
        var t = e.target;
        if (t === $s) {
          var p = t.value ? t.value.split(':') : [null, null];
          setSort(p[0], p[1]);
          return;
        }
        var act = t.getAttribute && t.getAttribute('data-act');
        if (act === 'select-all') {
          var rows = visibleRows();
          rows.forEach(function (r) { st.selected[r.id] = t.checked; });
          $b.querySelectorAll('tbody tr').forEach(function (tr) {
            tr.classList.toggle('is-selected', t.checked);
            tr.querySelector('[data-act="select"]').checked = t.checked;
          });
          syncSelectUI();
        } else if (act === 'select') {
          var tr = t.closest('tr'), id = tr.getAttribute('data-id');
          st.selected[id] = t.checked;
          tr.classList.toggle('is-selected', t.checked);
          syncSelectUI();
        }
      });

      $q.addEventListener('input', ui.debounce(function () {
        st.query = $q.value;
        renderMeta();
        renderBody();
      }, 120));

      return {
        el: el,
        /** state: 'loading' | 'ready' | 'error' */
        setState: function (state, opts) {
          st.state = state;
          if (opts && opts.onRetry) st.onRetry = opts.onRetry;
          if (opts && opts.periodLabel) st.periodLabel = opts.periodLabel;
          renderMeta();
          renderBody();
        },
        setData: function (data, periodLabel) {
          st.title = data.title;
          st.rows = data.rows.slice();
          st.removed = [];
          st.selected = {};
          st.periodLabel = periodLabel;
          st.state = 'ready';
          renderAll();
        },
        getRows: function () { return visibleRows(); },
        getTitle: function () { return st.title; }
      };
    }
  };
})(window, document);
