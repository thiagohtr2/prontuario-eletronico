// Alvos de toque (>=44px) e espaçamento no celular, fontes >= 12px, inputs >= 16px
const L = require('./lib');
const routes = ['painel','inicio','projetos','tarefas','relatorios','ajuda','configuracoes','mensagens','calendario','pessoas','projetos/site-institucional'];
(async () => {
  for (const w of [320, 390]) {
    const { browser, page } = await L.launch({ width: w, height: 800 }, { mobile: true, touch: true });
    await L.login(page);
    const seen = new Set();
    for (const r of routes) {
      await page.evaluate((r) => { location.hash = '#/' + r; }, r);
      await page.waitForTimeout(r === 'painel' ? 1500 : 300);
      const res = await page.evaluate(() => {
        const out = [];
        const sel = 'a[href], button, input, select, textarea, summary, [role=option], [tabindex="0"]';
        document.querySelectorAll(sel).forEach(el => {
          if (el.closest('[hidden]') || el.closest('.sidebar-slot')) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none') return;
          let r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          // checkbox: usa o label como alvo
          if (el.type === 'checkbox') { const l = el.closest('label'); if (l) r = l.getBoundingClientRect(); }
          if (el.classList.contains('sr-only') || el.closest('.sr-only')) return;
          const tag = el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] + (el.dataset.route ? '[' + el.dataset.route + ']' : '') + (el.type ? ':' + el.type : '');
          const isInline = el.tagName === 'A' && cs.display === 'inline' && !el.classList.contains('btn');
          if ((r.height < 43.5 || r.width < 43.5) && !isInline) out.push(`${tag} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}"`);
          if (['INPUT','SELECT','TEXTAREA'].includes(el.tagName) && el.type !== 'checkbox' && parseFloat(cs.fontSize) < 16) out.push(`FONT<16 ${tag} ${cs.fontSize}`);
        });
        document.querySelectorAll('body *').forEach(el => {
          if (el.closest('.sr-only') || !el.childNodes.length) return;
          const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          if (hasText && parseFloat(getComputedStyle(el).fontSize) < 12 && getComputedStyle(el).display !== 'none') out.push('FONT<12 ' + el.tagName + ' ' + el.textContent.trim().slice(0, 20));
        });
        return out;
      });
      res.forEach(x => { const k = `${r}: ${x}`; if (!seen.has(x)) { seen.add(x); console.log(`w=${w} ${k}`); } });
    }
    await browser.close();
  }
  console.log('fim');
})();
