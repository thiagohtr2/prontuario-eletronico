// Medições complementares: títulos de grupo, marca no topo da sidebar, rolagem interna da sidebar em janela baixa,
// estados de carregando/vazio/erro, tokens centralizados (contagem estática de cores fixas).
const fs = require('fs');
const path = require('path');
const { OUT, SITES, newPage, login, launch } = require('./lib.cjs');
const SITEDIR = path.resolve(OUT, '../../fase3-sites/P3-nexo-capital');

const TOKENS = { primary: '#1d4ed8', primaryHover: '#1a46c2', primaryActive: '#173ead', onPrimary: '#ffffff', primarySoft: '#e4eafa', secondary: '#1e3a8a', accent: '#0ea5e9', onAccent: '#111114', bg: '#f8fafc', bgAlt: '#eff1f3', surface: '#ffffff', surfaceAlt: '#f5f5f5', text: '#0f172a', textMuted: '#686d7a', textDisabled: '#9fa4ac', placeholder: '#848993', border: '#e6e6e6', borderStrong: '#c7c7c7', focusRing: '#1d4ed8', hover: '#f4f4f4', active: '#ebebeb', pressed: '#e0e0e0', selected: '#e4eafa', selectedText: '#1d4ed8', disabled: '#f0f0f0', disabledText: '#93979f', success: '#117e39', successBg: '#e3f4e9', warning: '#a85c04', warningBg: '#faefe1', error: '#dc2626', errorBg: '#fbe5e5', info: '#2563eb', infoBg: '#e5ecfd', link: '#1d4ed8', linkHover: '#1942b8', icon: '#49505f', navBg: '#0f1f4d', navText: '#caced8', navActive: '#313e66', navActiveText: '#ffffff', gradientFrom: '#1d4ed8', gradientTo: '#26aeeb' };

function staticTokens(site) {
  const dir = path.join(SITEDIR, site);
  const files = [];
  const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (f === 'tests' || f === 'fonts') continue; const s = fs.statSync(p); if (s.isDirectory()) walk(p); else if (/\.(css|js|html)$/.test(f)) files.push(p); } };
  walk(dir);
  const tokenVals = new Set(Object.values(TOKENS));
  let rootDefs = 0; const tokensDefined = new Set(); const loose = []; let tokenFile = null;
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    // blocos :root
    const rootBlocks = [...src.matchAll(/:root\s*\{([^}]*)\}/g)].map((m) => m[1]).join('\n');
    if (rootBlocks) { tokenFile = tokenFile || path.relative(dir, f); }
    for (const m of rootBlocks.matchAll(/--[\w-]+\s*:\s*(#[0-9a-fA-F]{3,8})/g)) { rootDefs++; if (tokenVals.has(m[1].toLowerCase())) tokensDefined.add(m[1].toLowerCase()); }
    const outside = src.replace(/:root\s*\{[^}]*\}/g, '');
    const hexes = [...outside.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g)].map((m) => m[0]).filter((h) => !/^#(fff|000)$/i.test(h));
    // ignora âncoras de URL/hash (#/...) já excluídas pelo padrão
    for (const h of hexes) loose.push(path.relative(dir, f) + ':' + h);
  }
  return { files: files.length, rootHexDefs: rootDefs, tokenValuesCovered: tokensDefined.size, tokenValuesTotal: tokenVals.size, looseHex: loose.length, looseSample: loose.slice(0, 12) };
}

(async () => {
  const browser = await launch();
  const res = {};
  for (const site of Object.keys(SITES)) {
    const R = res[site] = {};
    R.static = staticTokens(site);
    const { ctx, page } = await newPage(browser, 1440, 900);
    await login(page, site);
    R.groupTitleDeep = await page.evaluate(() => {
      const sb = document.querySelector('#sidebar');
      const leaf = [...sb.querySelectorAll('*')].find((e) => e.children.length === 0 && /^Gest[ãa]o$/i.test(e.textContent.trim()));
      if (!leaf) return null; const s = getComputedStyle(leaf);
      return { tag: leaf.tagName, fs: s.fontSize, tt: s.textTransform, fw: s.fontWeight, ls: s.letterSpacing, color: s.color };
    });
    R.brandTop = await page.evaluate(() => {
      const sb = document.querySelector('#sidebar');
      const leaf = [...sb.querySelectorAll('*')].filter((e) => e.children.length === 0 && /Nexo Capital/.test(e.textContent) && e.getBoundingClientRect().height > 0)[0];
      if (!leaf) return null; const s = getComputedStyle(leaf); let p = leaf; let bg = 'rgba(0, 0, 0, 0)'; while (p) { const b = getComputedStyle(p).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') { bg = b; break; } p = p.parentElement; }
      return { text: leaf.textContent.trim(), color: s.color, bg, fs: s.fontSize, fw: s.fontWeight };
    });
    // logo no header (desktop)?
    R.headerLogo = await page.evaluate(() => { const hd = [...document.querySelectorAll('header')].find((h) => h.getBoundingClientRect().height > 0 && h.getBoundingClientRect().x > 100); return hd ? !![...hd.querySelectorAll('svg, img, .brand')].find((e) => e.getBoundingClientRect().width >= 24 && e.getBoundingClientRect().width <= 32 && /brand|logo|mark/i.test(String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className) + (e.closest('a') ? e.closest('a').className : ''))) : null; });
    await ctx.close();
    // sidebar em janela baixa
    {
      const { ctx: c2, page: p2 } = await newPage(browser, 1280, 560);
      await login(p2, site);
      R.shortSidebar = await p2.evaluate(() => {
        const sb = document.querySelector('#sidebar');
        const links = [...sb.querySelectorAll('nav a')].filter((a) => a.getBoundingClientRect().height > 0);
        const last = links[links.length - 1]; const lr = last.getBoundingClientRect();
        const scrollers = [...sb.querySelectorAll('*'), sb].filter((e) => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1).map((e) => e.tagName + '.' + e.className + ' ' + e.scrollHeight + '/' + e.clientHeight);
        const foot = sb.lastElementChild.getBoundingClientRect();
        return { sbH: Math.round(sb.getBoundingClientRect().height), lastLabel: last.textContent.trim(), lastBottom: Math.round(lr.bottom), footTop: Math.round(foot.top), footBottom: Math.round(foot.bottom), scrollers };
      });
      await p2.screenshot({ path: path.join(OUT, 'capturas', site, 'sidebar-janela-baixa-1280x560.png') });
      await c2.close();
    }
    // estados
    const states = site === 'dev-1' ? { carregando: '?estado=loading#/painel/visao-geral', vazio: '?estado=empty#/painel/visao-geral', erro: '?estado=error#/painel/visao-geral' }
      : site === 'dev-2' ? { carregando: '#/painel/visao-geral?estado=carregando', vazio: '#/painel/visao-geral?estado=vazio', erro: '#/painel/visao-geral?estado=erro' }
        : { vazio: '#/app/fornecedores', erro: '#/app/auditoria', carregando: '#/app/painel/visao-geral' };
    R.states = {};
    for (const [k, frag] of Object.entries(states)) {
      const { ctx: c3, page: p3 } = await newPage(browser, 1440, 900);
      await login(p3, site);
      const base = SITES[site].url;
      if (site === 'dev-1') { await p3.goto(base + frag); } else { await p3.evaluate((f) => { location.hash = f; }, frag); }
      await p3.waitForTimeout(k === 'carregando' && site === 'dev-3' ? 60 : 2500);
      if (site === 'dev-3' && k === 'carregando') { await p3.evaluate(() => { location.hash = '#/app/contratos'; }); await p3.waitForTimeout(300); await p3.evaluate(() => { location.hash = '#/app/painel/visao-geral'; }); await p3.waitForTimeout(80); }
      R.states[k] = await p3.evaluate(() => ({ hash: location.hash, skel: [...document.querySelectorAll('[class*=skel]')].filter((e) => e.getBoundingClientRect().height > 0).length, busy: document.querySelectorAll('[aria-busy=true]').length, alerts: [...document.querySelectorAll('[role=alert], .state--error, .state-error')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.innerText.trim().replace(/\s+/g, ' ').slice(0, 80)), empties: [...document.querySelectorAll('[class*=empty], .state')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.innerText.trim().replace(/\s+/g, ' ').slice(0, 80)).slice(0, 4), retry: [...document.querySelectorAll('button')].filter((b) => /Tentar novamente/.test(b.textContent) && b.getBoundingClientRect().height > 0).length }));
      await p3.screenshot({ path: path.join(OUT, 'capturas', site, `estado-${k}.png`) });
      await c3.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'scripts', 'out-08-extra.json'), JSON.stringify(res, null, 1));
  await browser.close();
  console.log(JSON.stringify(res, null, 1));
})();
