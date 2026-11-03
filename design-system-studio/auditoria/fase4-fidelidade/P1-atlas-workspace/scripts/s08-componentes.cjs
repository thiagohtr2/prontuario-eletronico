// Medições dos componentes (login, KPI, dashboard, tabela, cards, formulário) a 1440x900.
const L = require('./lib.cjs');
const P = {
  'dev-1': { painel: '#/painel', tabela: '#/painel', form: '#/ajuda', cards: '#/projetos' },
  'dev-2': { painel: '#/painel', tabela: '#/relatorios', form: '#/ajuda', cards: '#/projetos' },
  'dev-3': { painel: '#/app/painel', tabela: '#/app/relatorios', form: '#/app/ajuda', cards: '#/app/projetos' },
};
const HELP = `
  window.__hex = (c) => { const m = c && c.match(/rgba?\\(([^)]+)\\)/); if (!m) return c; const p = m[1].split(',').map(s => parseFloat(s)); if (p.length === 4 && p[3] === 0) return 'transparent'; return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); };
  window.__R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  window.__box = (e) => { const s = getComputedStyle(e); return { radius: s.borderRadius, border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + __hex(s.borderTopColor), borderBottom: s.borderBottomWidth + ' ' + __hex(s.borderBottomColor), shadow: s.boxShadow, bg: __hex(s.backgroundColor) }; };
  window.__findText = (re, root) => { let best = null; (root || document).querySelectorAll('*').forEach(e => { if (e.children.length === 0 && re.test(e.textContent.trim()) && e.getBoundingClientRect().width > 0) { if (!best) best = e; } }); return best; };
  window.__cardOf = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.borderTopWidth !== '0px' && s.borderLeftWidth !== '0px' && x.getBoundingClientRect().height > 60) return x; } return null; };
`;

(async () => {
  const res = {};
  for (const site of Object.keys(L.SITES)) {
    const S = L.SITES[site]; const r = {};
    // ---- LOGIN desktop
    {
      const { ctx, page } = await L.newPage(1440, 900); await ctx.addInitScript({ content: HELP });
      await page.goto(S.url + S.login); await page.waitForTimeout(700);
      r.login = await page.evaluate(() => {
        const form = document.querySelector('form'); const card = __cardOf(form) || form;
        const btn = document.querySelector('button[type=submit]'); const inp = document.querySelector('input[type=email]');
        const brand = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /atlas workspace/i.test(e.textContent) && e.getBoundingClientRect().y < card.getBoundingClientRect().y);
        const h = document.querySelector('h1'); const sub = h && h.nextElementSibling;
        // fundo de tela cheia: maior ancestral do cartão com fundo próprio
        let bgEl = null; for (let x = card.parentElement; x; x = x.parentElement) { const c = __hex(getComputedStyle(x).backgroundColor); if (c !== 'transparent') { bgEl = { tag: x.tagName, cls: x.className, bg: c, h: x.getBoundingClientRect().height }; break; } }
        const cs = getComputedStyle(card);
        const remember = /lembrar de mim/i.test(form.innerText); const forgot = [...document.querySelectorAll('a,button')].find(a => /esqueci/i.test(a.textContent));
        const create = [...document.querySelectorAll('a,button')].find(a => /criar conta/i.test(a.textContent));
        const foot = [...document.querySelectorAll('a')].filter(a => /termos|privacidade/i.test(a.textContent)).map(a => a.textContent.trim());
        return { card: { ...__R(card), ...__box(card), padding: cs.padding }, bgFull: bgEl, brand: brand && { text: brand.textContent.trim(), y: Math.round(brand.getBoundingClientRect().y) }, title: h && h.textContent.trim(), titleAlign: h && getComputedStyle(h).textAlign, titleFw: h && getComputedStyle(h).fontWeight, subtitle: sub && sub.textContent.trim(), subColor: sub && __hex(getComputedStyle(sub).color),
          btn: { text: btn.innerText.trim(), bg: __hex(getComputedStyle(btn).backgroundColor), color: __hex(getComputedStyle(btn).color), w: Math.round(btn.getBoundingClientRect().width), formW: Math.round(form.getBoundingClientRect().width), radius: getComputedStyle(btn).borderRadius, h: Math.round(btn.getBoundingClientRect().height), tt: getComputedStyle(btn).textTransform },
          input: { h: Math.round(inp.getBoundingClientRect().height), radius: getComputedStyle(inp).borderRadius, border: getComputedStyle(inp).borderTopWidth + ' ' + __hex(getComputedStyle(inp).borderTopColor), fs: getComputedStyle(inp).fontSize },
          remember, forgot: forgot && forgot.textContent.trim(), create: create && create.textContent.trim(), foot };
      });
      // erro sob o campo (cor)
      await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(400);
      r.loginErrColor = await page.evaluate(() => { const i = document.querySelector('input[type=email]'); const id = (i.getAttribute('aria-describedby') || '').split(' ').find(x => { const e = document.getElementById(x); return e && e.offsetParent && e.textContent.trim(); }); const e = id && document.getElementById(id); return e ? __hex(getComputedStyle(e).color) : null; });
      // foco visível
      await page.goto(S.url + S.login); await page.reload(); await page.waitForTimeout(500);
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
      r.focus = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { el: e.tagName + ' ' + (e.getAttribute('aria-label') || e.type || e.textContent.trim().slice(0, 20)), outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + __hex(s.outlineColor), offset: s.outlineOffset, shadow: s.boxShadow }; });
      await page.locator('input[type=email]').focus(); await page.keyboard.press('Tab'); await page.waitForTimeout(150);
      r.focusInput = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { el: e.tagName + ' ' + e.type, outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + __hex(s.outlineColor), offset: s.outlineOffset, shadow: s.boxShadow, border: __hex(s.borderTopColor) }; });
      await ctx.close();
    }
    const { ctx, page } = await L.newPage(1440, 900); await ctx.addInitScript({ content: HELP });
    await L.login(page, site);
    // ---- PAINEL / KPI / DASHBOARD
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1800);
    await page.mouse.move(1, 1);
    r.kpi = await page.evaluate(() => {
      const lab = __findText(/^receita mensal$/i, document.querySelector('main'));
      if (!lab) return null;
      const card = __cardOf(lab);
      const siblings = card ? [...card.parentElement.children].filter(c => c.getBoundingClientRect().height > 50) : [];
      const val = [...card.querySelectorAll('*')].filter(e => e.children.length === 0 && /R\$\s?48,2/.test(e.textContent))[0];
      const varEl = [...card.querySelectorAll('*')].filter(e => e.children.length === 0 && /12,4\s?%/.test(e.textContent))[0];
      const ls = getComputedStyle(lab);
      return { count: siblings.length, card: { ...__R(card), ...__box(card) }, label: { text: lab.textContent, tt: ls.textTransform, ls: ls.letterSpacing, fs: ls.fontSize, color: __hex(ls.color) },
        value: val && { fs: getComputedStyle(val).fontSize, fw: getComputedStyle(val).fontWeight, fvn: getComputedStyle(val).fontVariantNumeric, ls: getComputedStyle(val).letterSpacing },
        variation: varEl && { text: varEl.textContent.trim(), color: __hex(getComputedStyle(varEl).color), arrow: !!(varEl.parentElement.querySelector('svg') || /[↑↗▲]/.test(varEl.parentElement.textContent)) },
        compar: /vs\.? mês anterior/i.test(card.innerText), icon: card.querySelectorAll('svg').length, sparkline: !!card.querySelector('svg polyline, svg path[d*="L"], svg path[d*="l"], canvas'), text: card.innerText.replace(/\s+/g, ' ').slice(0, 120) };
    });
    r.dashboard = await page.evaluate(() => {
      const main = document.querySelector('main');
      const h1 = main.querySelector('h1');
      const period = [...main.querySelectorAll('button, [role=tab], [role=radio], select, a')].filter(b => /(\d+\s?dias|12 meses|mês|semana)/i.test(b.textContent)).map(b => b.textContent.trim());
      const act = [...main.querySelectorAll('h2,h3')].find(h => /atividade/i.test(h.textContent));
      const chartH = [...main.querySelectorAll('h2,h3')].find(h => /receita/i.test(h.textContent) && !/mensal/i.test(h.textContent));
      const col = (h) => { let x = h; while (x && x.parentElement && x.parentElement !== main) { const p = x.parentElement; const ps = getComputedStyle(p); if ((ps.display.includes('grid') || ps.display.includes('flex')) && [...p.children].filter(c => c.getBoundingClientRect().width > 100).length >= 2 && p.getBoundingClientRect().width > 700) return x; x = p; } return x; };
      const a = act && col(act), c = chartH && col(chartH);
      const bars = main.querySelectorAll('svg rect, [class*=bar]').length;
      return { title: h1 && h1.textContent.trim(), period, actTitle: act && act.textContent.trim(), chartTitle: chartH && chartH.textContent.trim(), chartW: c ? Math.round(c.getBoundingClientRect().width) : null, actW: a ? Math.round(a.getBoundingClientRect().width) : null, sameRow: a && c ? Math.abs(a.getBoundingClientRect().y - c.getBoundingClientRect().y) < 40 : null, bars, actions: [...main.querySelectorAll('header button, header a')].map(b => b.textContent.trim()).filter(Boolean).slice(0, 6), sectionTitles: [...main.querySelectorAll('h2')].slice(0, 3).map(h => ({ t: h.textContent.trim(), fw: getComputedStyle(h).fontWeight, ls: getComputedStyle(h).letterSpacing, fs: getComputedStyle(h).fontSize })) };
    });
    // filtro de período
    const before = await page.evaluate(() => document.querySelector('main').innerText.match(/R\$\s?[\d.,]+\s?mil/g));
    const tabs = page.locator('main button, main [role=tab], main [role=radio]').filter({ hasText: /90 dias/i });
    if (await tabs.count()) { await tabs.first().click(); await page.waitForTimeout(150); r.periodLoading = await page.evaluate(() => document.querySelectorAll('main [aria-busy=true], main [class*=skeleton], main [class*=loading]').length); await page.waitForTimeout(2000); }
    const after = await page.evaluate(() => document.querySelector('main').innerText.match(/R\$\s?[\d.,]+\s?mil/g));
    r.period = { before: before && before.slice(0, 3), after: after && after.slice(0, 3), changed: JSON.stringify(before) !== JSON.stringify(after) };
    // KPI clique → relatório
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1500);
    const kpiLink = page.locator('main a, main button').filter({ hasText: /receita mensal/i }).first();
    if (await kpiLink.count()) { await kpiLink.click(); await page.waitForTimeout(1200); r.kpiClick = await page.evaluate(() => ({ hash: location.hash, h1: (document.querySelector('main h1') || {}).textContent })); } else r.kpiClick = null;
    // tooltip do sparkline
    await page.goto(S.url + P[site].painel); await page.waitForTimeout(1500);
    // ---- TABELA
    await page.goto(S.url + P[site].tabela); await page.waitForTimeout(1500);
    r.table = await page.evaluate(() => {
      const t = [...document.querySelectorAll('main table')].find(x => /cliente/i.test(x.innerText)) || document.querySelector('main table');
      if (!t) return null;
      const ths = [...t.querySelectorAll('thead th')];
      const rows = [...t.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0);
      const valIdx = ths.findIndex(th => /valor/i.test(th.textContent));
      const valCell = rows[0] && rows[0].children[valIdx];
      const stIdx = ths.findIndex(th => /status/i.test(th.textContent));
      const stCell = rows[0] && rows[0].children[stIdx];
      const badge = stCell && [...stCell.querySelectorAll('*')].find(e => { const s = getComputedStyle(e); return s.borderTopWidth !== '0px' || __hex(s.backgroundColor) !== 'transparent'; });
      const thS = ths[1] ? getComputedStyle(ths[1]) : null; const theadS = getComputedStyle(t.querySelector('thead'));
      const wrap = __cardOf(t) || t;
      return { caption: (t.querySelector('caption') || {}).textContent, cols: ths.map(th => th.textContent.trim()), scope: ths.map(th => th.getAttribute('scope')), rows: rows.length, headCheckbox: !!t.querySelector('thead input[type=checkbox]'), rowCheckbox: !!(rows[0] && rows[0].querySelector('input[type=checkbox]')), rowAction: !!(rows[0] && rows[0].lastElementChild.querySelector('button, a')), rowActionText: rows[0] && rows[0].lastElementChild.innerText.trim(),
        valAlign: valCell && getComputedStyle(valCell).textAlign, valFvn: valCell && getComputedStyle(valCell).fontVariantNumeric, badge: badge && { text: badge.textContent.trim(), ...__box(badge), tt: getComputedStyle(badge).textTransform },
        th: thS && { tt: thS.textTransform, ls: thS.letterSpacing, fw: thS.fontWeight, bg: __hex(thS.backgroundColor), theadBg: __hex(theadS.backgroundColor), borderBottom: thS.borderBottomWidth + ' ' + __hex(thS.borderBottomColor) },
        zebra: rows.length > 1 ? [__hex(getComputedStyle(rows[0]).backgroundColor), __hex(getComputedStyle(rows[1]).backgroundColor)] : null,
        rowBorder: rows[0] ? (() => { const td = rows[0].children[1]; const s = getComputedStyle(td); return s.borderBottomWidth + ' ' + __hex(s.borderBottomColor); })() : null,
        sortable: ths.filter(th => th.getAttribute('aria-sort') || th.querySelector('button')).length, ariaSort: ths.map(th => th.getAttribute('aria-sort')).filter(Boolean),
        wrap: { ...__box(wrap), r: __R(wrap) }, tableBox: __box(t), cellFs: rows[0] ? getComputedStyle(rows[0].children[1]).fontSize : null,
        states: [...document.querySelectorAll('main button, main [role=tab], main option, main [role=radio]')].map(b => b.textContent.trim()).filter(t => /carregando|vazio|erro/i.test(t)) };
    });
    // interação da tabela
    const tbl = page.locator('main table').filter({ hasText: /cliente/i }).first();
    const it = {};
    try {
      const hc = tbl.locator('thead input[type=checkbox]').first();
      if (await hc.count()) { await hc.check({ force: true }); await page.waitForTimeout(200); it.allChecked = await tbl.evaluate(t => [...t.querySelectorAll('tbody input[type=checkbox]')].every(c => c.checked)); await tbl.locator('tbody input[type=checkbox]').first().uncheck({ force: true }); await page.waitForTimeout(200); it.indeterminate = await tbl.evaluate(t => t.querySelector('thead input[type=checkbox]').indeterminate); }
      const sortBtn = tbl.locator('thead th button').filter({ hasText: /cliente/i }).first();
      if (await sortBtn.count()) { await sortBtn.click(); await page.waitForTimeout(400); it.ariaSortAfter = await tbl.evaluate(t => [...t.querySelectorAll('thead th')].map(th => th.getAttribute('aria-sort')).filter(Boolean)); }
      else { const th = tbl.locator('thead th').filter({ hasText: /cliente/i }).first(); await th.click(); await page.waitForTimeout(400); it.ariaSortAfter = await tbl.evaluate(t => [...t.querySelectorAll('thead th')].map(th => th.getAttribute('aria-sort')).filter(Boolean)); }
      const act = tbl.locator('tbody tr').first().locator('td').last().locator('button, a').first();
      if (await act.count()) { await act.click(); await page.waitForTimeout(500); it.actionOpened = await page.evaluate(() => { const m = [...document.querySelectorAll('[role=menu], [role=dialog], dialog[open], .menu, .popover')].find(e => e.offsetParent !== null || e.open); return m ? m.innerText.replace(/\s+/g, ' ').slice(0, 80) : null; }); await page.keyboard.press('Escape'); }
    } catch (e) { it.err = String(e).slice(0, 120); }
    r.tableInteract = it;
    // estados (seletor de demonstração)
    // ---- CARDS
    await page.goto(S.url + P[site].cards); await page.waitForTimeout(1500);
    await page.mouse.move(1, 1);
    r.card = await page.evaluate(() => {
      const main = document.querySelector('main');
      const title = [...main.querySelectorAll('h2,h3')].find(h => /viagem a lisboa|site institucional/i.test(h.textContent));
      const card = title && (__cardOf(title));
      if (!card) return null;
      const media = [...card.querySelectorAll('*')].find(e => { const b = e.getBoundingClientRect(); return b.width > card.getBoundingClientRect().width * 0.8 && b.height > 80 && e.querySelector('svg'); });
      const mb = media && media.getBoundingClientRect();
      const btn = [...card.querySelectorAll('a,button,span')].find(e => /ver detalhes|abrir projeto|ver projeto/i.test(e.textContent) && e.children.length <= 1);
      const ts = getComputedStyle(title);
      return { title: title.textContent.trim(), ...__box(card), r: __R(card), mediaRatio: mb ? +(mb.width / mb.height).toFixed(2) : null, overline: /0\d\s?—/.test(card.innerText), tag: card.innerText.split('\n').slice(0, 4).join(' | '), btn: btn && { text: btn.textContent.trim(), tt: getComputedStyle(btn).textTransform, ls: getComputedStyle(btn).letterSpacing, bg: __hex(getComputedStyle(btn).backgroundColor), radius: getComputedStyle(btn).borderRadius }, titleFw: ts.fontWeight, titleLs: ts.letterSpacing, footer: /prazo|tarefa|membro|%|\d{2}\/\d{2}/i.test(card.innerText), text: card.innerText.replace(/\s+/g, ' ').slice(0, 160) };
    });
    // ---- FORMULÁRIO
    await page.goto(S.url + P[site].form); await page.waitForTimeout(1500);
    r.form = await page.evaluate(() => {
      const f = [...document.querySelectorAll('main form')].find(x => /fale com a gente|enviar mensagem/i.test(x.closest('section, main').innerText)) || [...document.querySelectorAll('main form')].pop();
      if (!f) return null;
      const ins = [...f.querySelectorAll('input:not([type=checkbox]):not([type=hidden]), select, textarea')].filter(i => i.getBoundingClientRect().width > 0);
      const i0 = ins[0]; const s0 = getComputedStyle(i0);
      const lab = i0.id && document.querySelector(`label[for="${i0.id}"]`);
      const ys = {}; ins.forEach(i => { const y = Math.round(i.getBoundingClientRect().y); ys[y] = (ys[y] || 0) + 1; });
      const btn = f.querySelector('button[type=submit]');
      const wrap = __cardOf(f);
      return { fields: ins.map(i => (document.querySelector(`label[for="${i.id}"]`) || {}).textContent || i.name), underline: { top: s0.borderTopWidth, bottom: s0.borderBottomWidth + ' ' + __hex(s0.borderBottomColor), left: s0.borderLeftWidth, radius: s0.borderRadius }, textarea: (() => { const t = f.querySelector('textarea'); if (!t) return null; const s = getComputedStyle(t); return { top: s.borderTopWidth, bottom: s.borderBottomWidth, left: s.borderLeftWidth }; })(), label: lab && { tt: getComputedStyle(lab).textTransform, ls: getComputedStyle(lab).letterSpacing, fs: getComputedStyle(lab).fontSize }, twoCols: Object.values(ys).some(n => n >= 2), terms: !!f.querySelector('input[type=checkbox]'), btn: btn && { text: btn.innerText.trim(), tt: getComputedStyle(btn).textTransform, bg: __hex(getComputedStyle(btn).backgroundColor), radius: getComputedStyle(btn).borderRadius }, wrap: wrap && __box(wrap) };
    });
    // validação do formulário
    const fsub = page.locator('main form button[type=submit]').last();
    const fi = {};
    try {
      await fsub.click(); await page.waitForTimeout(500);
      fi.empty = await page.evaluate(() => ({ alerts: [...document.querySelectorAll('main [role=alert]')].filter(e => e.offsetParent && e.textContent.trim()).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 100)), links: [...document.querySelectorAll('main [role=alert] a')].filter(e => e.offsetParent).length, invalid: document.querySelectorAll('main form [aria-invalid=true]').length }));
      // preencher tudo
      const form = page.locator('main form').last();
      const inputs = form.locator('input:not([type=checkbox]):not([type=hidden]), textarea');
      const n = await inputs.count();
      for (let i = 0; i < n; i++) { const el = inputs.nth(i); const type = await el.getAttribute('type'); if (!(await el.isVisible())) continue; await el.fill(type === 'email' ? 'auditor@exemplo.com' : 'Texto de teste da auditoria com conteúdo suficiente'); }
      const sel = form.locator('select'); const ns = await sel.count(); for (let i = 0; i < ns; i++) { const opts = await sel.nth(i).locator('option').evaluateAll(o => o.map(x => x.value).filter(Boolean)); if (opts.length) await sel.nth(i).selectOption(opts[0]); }
      const cbs = form.locator('input[type=checkbox]'); const nc = await cbs.count(); for (let i = 0; i < nc; i++) await cbs.nth(i).check({ force: true });
      await fsub.click(); await page.waitForTimeout(80);
      fi.sending = await page.evaluate(() => { const b = [...document.querySelectorAll('main form button[type=submit]')].pop(); return { text: b.innerText.trim(), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' }; });
      await page.waitForTimeout(2500);
      fi.after = await page.evaluate(() => document.querySelector('main').innerText.match(/(mensagem enviada|recebemos|obrigad|enviada com sucesso)[^.\n]*/i)?.[0] || null);
    } catch (e) { fi.err = String(e).slice(0, 150); }
    r.formInteract = fi;
    await ctx.close();
    res[site] = r;
    console.log('ok', site);
  }
  L.saveJSON('s08-componentes.json', res);
  await L.close();
})();
