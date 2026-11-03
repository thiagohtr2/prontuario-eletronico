/* =========================================================
   Tabela de dados — família Compact Pro
   <table> semântica, ordenação com aria-sort, seleção com checkbox
   (todos/indeterminado), status em badge, números à direita,
   ações por linha, filtros compactos, paginação e estados
   carregando (skeleton) / vazio / erro. No celular vira cartões.
   ========================================================= */
(function () {
  'use strict';
  const N = window.Nexo;
  const esc = N.esc;
  const fmt = N.fmt;

  class DataTable {
    constructor(mount, opts) {
      this.o = Object.assign({ pageSize: 10, rowActions: [], bulk: [], selectable: true, searchKeys: [], noun: 'registros' }, opts);
      this.id = opts.id;
      this.rows = [];
      this.state = 'loading';
      const firstDate = this.o.columns.find((c) => c.type === 'date' || c.type === 'datetime');
      this.sort = this.o.defaultSort || (firstDate ? { key: firstDate.key, dir: 'desc' } : { key: this.o.columns[0].key, dir: 'asc' });
      this.selected = new Set();
      this.page = 0;
      this.query = '';
      this.status = 'all';
      this.build(mount);
      this.render();
    }

    build(mount) {
      const o = this.o;
      const id = this.id;
      const statusCol = o.columns.find((c) => c.type === 'status');
      const tabs = statusCol && o.statusMap
        ? '<div class="tbl-tabs" role="group" aria-label="Filtrar por status"><button type="button" class="tbl-tab" data-status="all" aria-pressed="true">Todos</button>' +
          Object.entries(o.statusMap).map(([k, v]) => '<button type="button" class="tbl-tab" data-status="' + k + '" aria-pressed="false">' + esc(v.label) + '</button>').join('') + '</div>'
        : '';
      mount.innerHTML =
        '<section class="card tbl-card" aria-labelledby="' + id + '-title">' +
          '<div class="tbl-head">' +
            '<div class="tbl-titles"><h2 class="card-title" id="' + id + '-title">' + esc(o.title) + '</h2><p class="card-sub" data-count></p></div>' +
            '<div class="tbl-actions">' +
              '<div class="tbl-search">' + N.icon('search', { size: 16 }) +
                '<label class="sr-only" for="' + id + '-q">' + esc(o.searchLabel || 'Filtrar') + '</label>' +
                '<input id="' + id + '-q" class="input input--cp" type="search" placeholder="' + esc(o.searchLabel || 'Filtrar') + '" autocomplete="off" data-q></div>' +
              (o.primary ? '<button type="button" class="btn btn--primary" data-primary>' + N.icon('plus', { size: 16 }) + '<span>' + esc(o.primary.label) + '</span></button>' : '') +
            '</div>' +
          '</div>' +
          tabs +
          '<div class="tbl-bulk" data-bulk hidden><span class="tbl-bulk-count" data-bulk-count aria-live="polite"></span>' +
            o.bulk.map((b, i) => '<button type="button" class="btn btn--outline" data-bulk-act="' + i + '">' + esc(b.label) + '</button>').join('') +
            '<button type="button" class="btn btn--ghost" data-bulk-clear>Limpar seleção</button></div>' +
          '<div class="tbl-wrap" aria-busy="true">' +
            '<table class="tbl">' +
              '<caption class="sr-only">' + esc(o.title) + (o.caption ? '. ' + esc(o.caption) : '') + '</caption>' +
              '<thead><tr>' +
                (o.selectable ? '<th scope="col" class="tbl-check"><label class="check"><input type="checkbox" data-check-all><span class="check-text">Selecionar todos</span></label></th>' : '') +
                o.columns.map((c) => '<th scope="col" class="' + (c.type === 'money' || c.type === 'number' ? 'is-num' : '') + '" data-col="' + c.key + '">' +
                  '<button type="button" class="tbl-sort" data-sort="' + c.key + '">' + esc(c.label) + '<span data-sort-ic>' + N.icon('arrowUpDown', { size: 14 }) + '</span></button></th>').join('') +
                (o.rowActions.length ? '<th scope="col" class="tbl-actions-col"><span class="sr-only">Ações</span></th>' : '') +
              '</tr></thead><tbody></tbody>' +
            '</table>' +
          '</div>' +
          '<div class="tbl-foot" data-foot><p data-range aria-live="polite"></p><div class="tbl-pager">' +
            '<button type="button" class="icon-btn icon-btn--cp" data-page="-1" aria-label="Página anterior">' + N.icon('chevronLeft') + '</button>' +
            '<button type="button" class="icon-btn icon-btn--cp" data-page="1" aria-label="Próxima página">' + N.icon('chevronRight') + '</button>' +
          '</div></div>' +
        '</section>';
      const root = mount.firstElementChild;
      this.root = root;
      this.tbody = root.querySelector('tbody');
      this.wrap = root.querySelector('.tbl-wrap');
      this.checkAll = root.querySelector('[data-check-all]');
      this.bind();
    }

    bind() {
      const root = this.root;
      let t = null;
      root.querySelector('[data-q]').addEventListener('input', (e) => {
        clearTimeout(t);
        t = setTimeout(() => { this.query = e.target.value.trim().toLowerCase(); this.page = 0; this.render(); }, 150);
      });
      root.addEventListener('click', (e) => {
        const s = e.target.closest('[data-sort]');
        if (s) {
          const key = s.dataset.sort;
          const col = this.o.columns.find((c) => c.key === key);
          if (this.sort.key === key) this.sort.dir = this.sort.dir === 'asc' ? 'desc' : 'asc';
          else this.sort = { key, dir: col.type === 'text' || col.type === 'status' ? 'asc' : 'desc' };
          this.page = 0;
          this.render();
          return;
        }
        const st = e.target.closest('[data-status]');
        if (st) {
          this.status = st.dataset.status;
          root.querySelectorAll('[data-status]').forEach((b) => b.setAttribute('aria-pressed', String(b === st)));
          this.page = 0;
          this.render();
          return;
        }
        const pg = e.target.closest('[data-page]');
        if (pg && !pg.disabled) { this.page += +pg.dataset.page; this.render(); return; }
        const menuBtn = e.target.closest('[data-row-menu]');
        if (menuBtn) { this.openRowMenu(menuBtn); return; }
        if (e.target.closest('[data-primary]')) { this.o.primary.onClick(); return; }
        if (e.target.closest('[data-retry]')) { if (this.o.onRetry) this.o.onRetry(); return; }
        if (e.target.closest('[data-clear-filters]')) { this.clearFilters(); return; }
        const ba = e.target.closest('[data-bulk-act]');
        if (ba) { const b = this.o.bulk[+ba.dataset.bulkAct]; b.run(this.rows.filter((r) => this.selected.has(r.id))); return; }
        if (e.target.closest('[data-bulk-clear]')) { this.selected.clear(); this.syncSelection(); }
      });
      root.addEventListener('change', (e) => {
        if (e.target.matches('[data-check-all]')) {
          const ids = this.pageRows().map((r) => r.id);
          if (e.target.checked) ids.forEach((id) => this.selected.add(id)); else ids.forEach((id) => this.selected.delete(id));
          this.syncSelection();
        } else if (e.target.matches('[data-check]')) {
          if (e.target.checked) this.selected.add(e.target.dataset.check); else this.selected.delete(e.target.dataset.check);
          this.syncSelection();
        }
      });
    }

    clearFilters() {
      this.query = '';
      this.status = 'all';
      this.root.querySelector('[data-q]').value = '';
      this.root.querySelectorAll('[data-status]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === 'all')));
      this.page = 0;
      this.render();
    }

    setQuery(q) {
      this.root.querySelector('[data-q]').value = q;
      this.query = q.trim().toLowerCase();
      this.page = 0;
      this.render();
    }

    setState(state) { this.state = state; this.render(); }
    setRows(rows) {
      this.rows = rows;
      const ids = new Set(rows.map((r) => r.id));
      this.selected.forEach((id) => { if (!ids.has(id)) this.selected.delete(id); });
      this.state = 'ready';
      this.render();
    }

    view() {
      const o = this.o;
      let list = this.rows;
      if (this.status !== 'all') list = list.filter((r) => r.status === this.status);
      if (this.query) {
        const keys = o.searchKeys.length ? o.searchKeys : [o.columns[0].key];
        list = list.filter((r) => keys.some((k) => String(r[k] || '').toLowerCase().includes(this.query)));
      }
      const col = o.columns.find((c) => c.key === this.sort.key);
      const dir = this.sort.dir === 'asc' ? 1 : -1;
      const val = (r) => {
        const v = r[col.key];
        if (col.type === 'status') return (o.statusMap[v] || { label: v }).label;
        if (v instanceof Date) return v.getTime();
        return v;
      };
      return list.slice().sort((a, b) => {
        const x = val(a);
        const y = val(b);
        if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
        return String(x).localeCompare(String(y), 'pt-BR') * dir;
      });
    }

    pageRows() {
      const v = this.view();
      const pages = Math.max(1, Math.ceil(v.length / this.o.pageSize));
      this.page = Math.max(0, Math.min(this.page, pages - 1));
      return v.slice(this.page * this.o.pageSize, (this.page + 1) * this.o.pageSize);
    }

    cell(c, r) {
      const v = r[c.key];
      if (c.type === 'status') {
        const s = this.o.statusMap[v] || { label: v, tone: 'neutral' };
        return '<span class="badge badge--' + s.tone + '">' + esc(s.label) + '</span>';
      }
      if (c.type === 'money') return esc(fmt.money(v));
      if (c.type === 'number') return esc(fmt.num(v));
      if (c.type === 'date') return '<time datetime="' + v.toISOString().slice(0, 10) + '">' + esc(fmt.date(v)) + '</time>';
      if (c.type === 'datetime') return '<time datetime="' + v.toISOString() + '">' + esc(fmt.datetime(v)) + '</time>';
      if (c.sub) return '<span class="cell-main">' + esc(v) + '</span><span class="cell-sub">' + esc(r[c.sub]) + '</span>';
      return esc(v);
    }

    render() {
      const ae = document.activeElement;
      const focusRow = ae && this.tbody.contains(ae) ? (ae.closest('tr') || {}).dataset : null;
      this.renderInner();
      if (focusRow && !this.root.contains(document.activeElement)) {
        const again = focusRow.id && this.tbody.querySelector('[data-row-menu="' + focusRow.id + '"]');
        const fallback = again || this.tbody.querySelector('[data-row-menu], [data-check], button') || this.root.querySelector('[data-q]');
        if (fallback) fallback.focus({ preventScroll: true });
      }
    }

    renderInner() {
      const o = this.o;
      const cols = o.columns.length + (o.selectable ? 1 : 0) + (o.rowActions.length ? 1 : 0);
      const count = this.root.querySelector('[data-count]');
      const foot = this.root.querySelector('[data-foot]');
      this.wrap.setAttribute('aria-busy', String(this.state === 'loading'));
      // cabeçalho: aria-sort só na coluna ordenada
      this.root.querySelectorAll('thead th[data-col]').forEach((th) => {
        const on = th.dataset.col === this.sort.key;
        if (on) th.setAttribute('aria-sort', this.sort.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort');
        th.querySelector('[data-sort-ic]').innerHTML = N.icon(on ? (this.sort.dir === 'asc' ? 'arrowUp' : 'arrowDown') : 'arrowUpDown', { size: 14 });
      });
      const disabledCtl = this.state !== 'ready';
      this.root.querySelectorAll('[data-sort], [data-status], [data-q]').forEach((el) => { el.disabled = disabledCtl; });
      if (this.checkAll) this.checkAll.disabled = disabledCtl;

      if (this.state === 'loading') {
        count.textContent = 'Carregando…';
        this.tbody.innerHTML = Array.from({ length: Math.min(o.pageSize, 4) }, () =>
          '<tr class="is-skel" aria-hidden="true">' + Array.from({ length: cols }, (_, i) => '<td><span class="skel ' + (i % 2 ? 'skel--w60' : 'skel--w80') + '"></span></td>').join('') + '</tr>').join('') +
          '<tr class="sr-only"><td colspan="' + cols + '">Carregando ' + esc(o.noun) + '…</td></tr>';
        foot.hidden = true;
        this.root.querySelector('[data-bulk]').hidden = true;
        return;
      }
      if (this.state === 'error') {
        count.textContent = '';
        this.tbody.innerHTML = '<tr class="tbl-state-row"><td colspan="' + cols + '"><div class="state state--error" role="alert">' + N.icon('alert') +
          '<p class="state-title">Não foi possível carregar ' + esc(o.noun) + '.</p><p class="state-text">Verifique sua conexão e tente novamente.</p>' +
          '<button type="button" class="btn btn--outline" data-retry>' + N.icon('refresh', { size: 16 }) + 'Tentar novamente</button></div></td></tr>';
        foot.hidden = true;
        this.root.querySelector('[data-bulk]').hidden = true;
        return;
      }
      const v = this.view();
      const filtered = this.query || this.status !== 'all';
      count.textContent = this.rows.length ? (filtered ? v.length + ' de ' + this.rows.length + ' ' + o.noun : this.rows.length + ' ' + o.noun + (o.countSuffix ? ' ' + o.countSuffix : '')) : '';
      if (!v.length) {
        this.tbody.innerHTML = '<tr class="tbl-state-row"><td colspan="' + cols + '"><div class="state">' + N.icon('inbox') +
          (filtered
            ? '<p class="state-title">Nenhum resultado para os filtros aplicados</p><p class="state-text">Altere a busca ou o status para ver outros ' + esc(o.noun) + '.</p><button type="button" class="btn btn--outline" data-clear-filters>Limpar filtros</button>'
            : '<p class="state-title">' + esc(o.emptyTitle || 'Nenhum registro encontrado') + '</p><p class="state-text">' + esc(o.emptyText || 'Não há dados para o período selecionado.') + '</p>') +
          '</div></td></tr>';
        foot.hidden = true;
        this.syncSelection();
        return;
      }
      const rows = this.pageRows();
      const first = o.columns[0];
      this.tbody.innerHTML = rows.map((r) => {
        const sel = this.selected.has(r.id);
        const name = r[first.key];
        return '<tr data-id="' + esc(r.id) + '" class="' + (sel ? 'is-selected ' : '') + (o.selectable ? 'has-check' : 'no-check') + '">' +
          (o.selectable ? '<td class="tbl-check"><label class="check"><input type="checkbox" data-check="' + esc(r.id) + '"' + (sel ? ' checked' : '') + ' aria-label="Selecionar ' + esc(name) + '"></label></td>' : '') +
          o.columns.map((c, i) => i === 0
            ? '<th scope="row">' + this.cell(c, r) + '</th>'
            : '<td data-label="' + esc(c.label) + '" class="' + (c.type === 'money' || c.type === 'number' ? 'is-num' : '') + (c.type === 'date' || c.type === 'datetime' ? ' is-date' : '') + '">' + this.cell(c, r) + '</td>').join('') +
          (o.rowActions.length ? '<td class="tbl-row-actions"><button type="button" class="icon-btn icon-btn--cp" data-row-menu="' + esc(r.id) + '" aria-haspopup="menu" aria-expanded="false" aria-label="Ações para ' + esc(name) + '">' + N.icon('ellipsis') + '</button></td>' : '') +
          '</tr>';
      }).join('');
      const total = v.length;
      const start = this.page * o.pageSize;
      foot.hidden = false;
      foot.querySelector('[data-range]').textContent = (start + 1) + '–' + (start + rows.length) + ' de ' + total;
      foot.querySelector('[data-page="-1"]').disabled = this.page === 0;
      foot.querySelector('[data-page="1"]').disabled = start + rows.length >= total;
      this.syncSelection();
    }

    syncSelection() {
      const ids = this.state === 'ready' ? this.pageRows().map((r) => r.id) : [];
      this.tbody.querySelectorAll('tr[data-id]').forEach((tr) => {
        const on = this.selected.has(tr.dataset.id);
        tr.classList.toggle('is-selected', on);
        const cb = tr.querySelector('[data-check]');
        if (cb) cb.checked = on;
      });
      if (this.checkAll) {
        const n = ids.filter((id) => this.selected.has(id)).length;
        this.checkAll.checked = ids.length > 0 && n === ids.length;
        this.checkAll.indeterminate = n > 0 && n < ids.length;
      }
      const bulk = this.root.querySelector('[data-bulk]');
      bulk.hidden = this.selected.size === 0 || this.state !== 'ready';
      this.root.querySelector('[data-bulk-count]').textContent = this.selected.size === 1 ? '1 selecionado' : this.selected.size + ' selecionados';
    }

    openRowMenu(btn) {
      const row = this.rows.find((r) => r.id === btn.dataset.rowMenu);
      if (!row) return;
      const items = this.o.rowActions.map((a) => a.sep ? { sep: true } : {
        label: a.label, icon: a.icon, danger: a.danger,
        disabled: a.disabled ? a.disabled(row) : false,
        onSelect: () => a.run(row, this)
      });
      N.menu(btn, { label: 'Ações para ' + row[this.o.columns[0].key], items, align: 'end' });
    }

    removeRow(id) {
      const idx = this.rows.findIndex((r) => r.id === id);
      if (idx < 0) return null;
      const [row] = this.rows.splice(idx, 1);
      this.selected.delete(id);
      this.render();
      return { row, idx };
    }
  }

  N.DataTable = DataTable;
})();
