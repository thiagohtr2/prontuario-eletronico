/* Tabela Swiss Minimal: <table> semântica, seleção com checkbox (todos/indeterminado), ordenação com aria-sort,
   ações por linha, exportação CSV e estados de carregando / vazio / erro. */
(function () {
  'use strict';
  const A = (window.Atlas = window.Atlas || {});
  const { $, $$, esc, icon, fmt } = A;
  const U = (A.ui = A.ui || {});

  /**
   * cfg: { title, overline, caption, columns:[{key,label,type:'text'|'status'|'num'|'date', format}], rows,
   *        itemName, emptyTitle, emptyText, exportName, state }
   */
  U.createTable = (host, cfg) => {
    const id = A.uid('tbl');
    let state = cfg.state || 'data';
    let sort = { key: null, dir: 'none' };
    let selected = new Set();
    let rows = cfg.rows.map((r) => ({ ...r }));
    const cols = cfg.columns;
    const itemName = cfg.itemName || 'registro';

    const cmp = (a, b, col) => {
      const x = a[col.key], y = b[col.key];
      if (col.type === 'status') return x.label.localeCompare(y.label, 'pt-BR');
      if (col.type === 'num' || col.type === 'date') return x < y ? -1 : x > y ? 1 : 0;
      return String(x).localeCompare(String(y), 'pt-BR');
    };
    const sorted = () => {
      if (sort.dir === 'none') return rows;
      const col = cols.find((c) => c.key === sort.key);
      return rows.slice().sort((a, b) => cmp(a, b, col) * (sort.dir === 'asc' ? 1 : -1));
    };

    const cell = (r, c) => {
      const v = r[c.key];
      if (c.type === 'status') return `<td><span class="badge badge--${v.tone}"><span class="badge__sq" aria-hidden="true"></span>${esc(v.label)}</span></td>`;
      if (c.type === 'num') return `<td class="num">${esc(c.format ? c.format(v) : fmt.int(v))}</td>`;
      if (c.type === 'date') return `<td class="nowrap">${esc(fmt.date(v))}</td>`;
      return `<td class="${c === cols[0] ? 'strong' : ''}">${esc(v)}</td>`;
    };

    function theadHTML(allCount) {
      const allSel = allCount > 0 && selected.size === allCount;
      return `
        <thead><tr>
          <th scope="col" class="col-check"><label class="check check--cell"><input type="checkbox" class="sw-check" data-all data-fid="all" aria-label="Selecionar todos os ${esc(itemName)}s" ${allSel ? 'checked' : ''} ${state !== 'data' ? 'disabled' : ''}></label></th>
          ${cols.map((c) => {
            const dir = sort.key === c.key ? sort.dir : 'none';
            const aria = dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
            const ico = dir === 'asc' ? 'chevron-up' : dir === 'desc' ? 'chevron-down' : 'chevrons-up-down';
            return `<th scope="col" class="${c.type === 'num' ? 'num' : ''}" aria-sort="${aria}"><button type="button" class="th-btn" data-sort="${c.key}" data-fid="sort-${c.key}">${esc(c.label)}${icon(ico, { size: 14 })}</button></th>`;
          }).join('')}
          <th scope="col" class="col-act"><span class="sr-only">Ações</span></th>
        </tr></thead>`;
    }

    function skeletonRows() {
      return Array.from({ length: 4 }, () => `
        <tr class="is-skel" aria-hidden="true"><td class="col-check"><span class="skel skel--check"></span></td>
          ${cols.map(() => '<td><span class="skel skel--line"></span></td>').join('')}<td class="col-act"></td></tr>`).join('');
    }

    function render() {
      const focusId = document.activeElement && host.contains(document.activeElement) ? document.activeElement.dataset.fid : null;
      const list = sorted();
      // remove seleções de linhas que não existem mais
      selected = new Set([...selected].filter((sid) => rows.some((r) => r.id === sid)));
      const count = rows.length;
      let inner;
      if (state === 'empty' || (state === 'data' && !count)) {
        inner = U.stateBox({ kind: 'empty', title: cfg.emptyTitle || 'Nenhum registro encontrado', text: cfg.emptyText || 'Quando houver dados, eles aparecem aqui.' });
      } else if (state === 'error') {
        inner = U.stateBox({ kind: 'error', title: 'Não foi possível carregar os dados', text: 'Verifique sua conexão e tente novamente.', retry: true });
      } else {
        const body = state === 'loading'
          ? skeletonRows()
          : list.map((r) => `
            <tr class="${selected.has(r.id) ? 'is-selected' : ''}" data-id="${esc(r.id)}">
              <td class="col-check"><label class="check check--cell"><input type="checkbox" class="sw-check" data-row data-fid="row-${esc(r.id)}" aria-label="Selecionar ${esc(r[cols[0].key])}" ${selected.has(r.id) ? 'checked' : ''}></label></td>
              ${cols.map((c) => cell(r, c)).join('')}
              <td class="col-act"><button type="button" class="icon-btn" data-actions aria-haspopup="menu" aria-expanded="false" aria-label="Ações para ${esc(r[cols[0].key])}" data-fid="act-${esc(r.id)}">${icon('ellipsis')}</button></td>
            </tr>`).join('');
        inner = `
          <div class="sw-table__scroll" tabindex="0" role="region" aria-labelledby="${id}-t" ${state === 'loading' ? 'aria-busy="true"' : ''}>
            <table class="sw-table__table">
              <caption class="sr-only">${esc(cfg.caption || cfg.title)}${sort.dir !== 'none' ? `, ordenada por ${esc(cols.find((c) => c.key === sort.key).label)}` : ''}</caption>
              ${theadHTML(count)}
              <tbody>${body}</tbody>
            </table>
          </div>`;
      }
      const selN = selected.size;
      host.innerHTML = `
        <section class="sw-table" aria-labelledby="${id}-t">
          <div class="sw-table__bar">
            <div>
              ${cfg.overline ? `<p class="overline"><span class="sq" aria-hidden="true"></span>${esc(cfg.overline)}</p>` : ''}
              <h2 class="sec__title" id="${id}-t">${esc(cfg.title)}</h2>
            </div>
            <div class="sw-table__actions">
              ${selN ? `<span class="sw-table__sel" role="status">${selN} selecionado${selN > 1 ? 's' : ''}</span><button type="button" class="btn btn--secondary btn--sm" data-bulk-delete>${icon('trash', { size: 16 })}<span>Excluir</span></button>` : ''}
              <button type="button" class="btn btn--secondary btn--sm" data-export ${state !== 'data' || !count ? 'disabled aria-disabled="true"' : ''}>${icon('download', { size: 16 })}<span>Exportar CSV</span></button>
            </div>
          </div>
          ${inner}
          ${state === 'data' && count ? `<p class="sw-table__foot">${count} ${esc(itemName)}${count > 1 ? 's' : ''}</p>` : ''}
        </section>`;
      // checkbox "todos" indeterminado
      const all = $('[data-all]', host);
      if (all) all.indeterminate = selN > 0 && selN < count;
      if (focusId) { const el = host.querySelector(`[data-fid="${CSS.escape(focusId)}"]`); if (el) el.focus(); }
    }

    function exportCsv() {
      const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
      const line = (r) => cols.map((c) => {
        const v = r[c.key];
        if (c.type === 'status') return q(v.label);
        if (c.type === 'date') return q(fmt.date(v));
        if (c.type === 'num') return String(v).replace('.', ',');
        return q(v);
      }).join(';');
      const csv = '﻿' + cols.map((c) => q(c.label)).join(';') + '\n' + sorted().map(line).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      a.download = (cfg.exportName || 'tabela') + '.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      U.toast('Arquivo CSV gerado.');
    }

    function detail(r, trigger) {
      const body = `<dl class="dl">${cols.map((c) => `<div><dt>${esc(c.label)}</dt><dd>${c.type === 'status' ? esc(r[c.key].label) : c.type === 'date' ? esc(fmt.date(r[c.key])) : c.type === 'num' ? esc(c.format ? c.format(r[c.key]) : fmt.int(r[c.key])) : esc(r[c.key])}</dd></div>`).join('')}</dl>`;
      const foot = document.createElement('div');
      foot.className = 'dialog__actions';
      foot.innerHTML = '<button type="button" class="btn btn--secondary" data-close>Fechar</button>';
      U.openDialog({ title: `${cfg.itemTitle || 'Detalhes'}: ${r[cols[0].key]}`, body, footer: foot, returnFocus: trigger });
    }

    host.addEventListener('click', (e) => {
      const t = e.target;
      const s = t.closest('[data-sort]');
      if (s) {
        const k = s.dataset.sort;
        sort = sort.key !== k ? { key: k, dir: 'asc' } : { key: k, dir: sort.dir === 'asc' ? 'desc' : sort.dir === 'desc' ? 'none' : 'asc' };
        render();
        return;
      }
      if (t.closest('[data-export]')) { if (!t.closest('[data-export]').disabled) exportCsv(); return; }
      if (t.closest('[data-retry]')) { setState('loading'); setTimeout(() => setState('data'), 900); return; }
      if (t.closest('[data-bulk-delete]')) {
        const n = selected.size;
        rows = rows.filter((r) => !selected.has(r.id));
        selected.clear();
        render();
        U.toast(`${n} ${itemName}${n > 1 ? 's excluídos' : ' excluído'}.`);
        return;
      }
      const act = t.closest('[data-actions]');
      if (act) {
        const tr = act.closest('tr');
        const r = rows.find((x) => x.id === tr.dataset.id);
        U.openMenu(act, [
          { label: 'Ver detalhes', icon: 'eye', onClick: () => detail(r, act) },
          { label: 'Excluir', icon: 'trash', danger: true, onClick: () => { rows = rows.filter((x) => x.id !== r.id); render(); U.toast(`${r[cols[0].key]} excluído.`); } },
        ], { align: 'end', label: 'Ações da linha' });
      }
    });
    host.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('[data-all]')) {
        selected = t.checked ? new Set(rows.map((r) => r.id)) : new Set();
        render();
      } else if (t.matches('[data-row]')) {
        const id_ = t.closest('tr').dataset.id;
        if (t.checked) selected.add(id_); else selected.delete(id_);
        render();
      }
    });

    function setState(s) { state = s; render(); if (cfg.onState) cfg.onState(s); }
    function setRows(r) { rows = r.map((x) => ({ ...x })); selected.clear(); render(); }
    render();
    return { setState, setRows, render };
  };
})();
