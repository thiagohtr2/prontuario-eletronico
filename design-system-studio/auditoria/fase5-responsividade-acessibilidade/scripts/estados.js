// Estados com modal/drawer/menu abertos: geometria, foco (armadilha, Esc, devolução), axe e captura.
// Uso: node estados.js <larguras ex. 375,1280> [cenarios separados por |]
const L = require('./lib')
const widths = (process.argv[2] || '375,1280').split(',')
const only = process.argv[3] ? process.argv[3].split('|') : null

const DIALOG = '[role=dialog][aria-modal="true"]'

const SCENARIOS = [
  { id: 'busca-ctrlk', route: '/livre', open: async (p) => { await p.keyboard.press('Control+k'); return null }, container: DIALOG },
  { id: 'busca-botao', route: '/livre', trigger: 'button.shell-search-btn', container: DIALOG },
  { id: 'menu-studio', route: '/modulos/cores', trigger: 'button[aria-controls="studio-sidebar"]', container: '#studio-sidebar', mobileOnly: true, drawer: true },
  { id: 'previa-landing', route: '/modulos/landing', trigger: '.ent-card-btn >> nth=0', container: DIALOG },
  { id: 'previa-login', route: '/modulos/login', trigger: '.ent-card-btn >> nth=0', container: DIALOG },
  { id: 'previa-cadastro', route: '/modulos/cadastro', trigger: '.ent-card-btn >> nth=0', container: DIALOG },
  { id: 'prompt-individual', route: '/modulos/desktop', trigger: 'button:has-text("Prompt deste elemento") >> nth=0', container: DIALOG },
  { id: 'editor-componente', route: '/modulos/componentes', trigger: 'button:has-text("Personalizar") >> nth=0', container: DIALOG },
  { id: 'editor-template', route: '/modulos/templates', trigger: '[aria-label^="Abrir o template"] >> nth=0', container: DIALOG },
  { id: 'visualizador-inspiracao', route: '/modulos/inspiracao', trigger: '[aria-label^="Abrir o site"] >> nth=0', container: DIALOG },
  { id: 'detalhe-navegacao', route: '/modulos/navegacao', trigger: 'button:has-text("Ver em tamanho grande") >> nth=0', container: DIALOG },
  { id: 'confirmar-limpar', route: '/projeto', trigger: '[data-testid="reset-project"]', container: DIALOG },
  { id: 'drawer-celular-previa', route: '/modulos/mobile', trigger: '[role=group][aria-label^="Prévia do celular"] button[aria-expanded] >> nth=0', container: '[role=group][aria-label^="Prévia do celular"]', drawer: true, inPreview: true },
  { id: 'menu-header-previa', route: '/modulos/navegacao', trigger: '.nvs-menu-btn >> visible=true >> nth=0', container: '[role=dialog]:visible', drawer: true, inPreview: true },
]

function dims(s) {
  if (s.includes('x')) { const [w, h] = s.split('x').map(Number); return { w, h, mobile: true } }
  const w = Number(s)
  return { w, h: w < 600 ? 800 : w < 1024 ? 1024 : 900, mobile: w < 768 }
}

;(async () => {
  const browser = await L.launch()
  const results = []
  for (const s of widths) {
    const { w, h, mobile } = dims(s)
    const { ctx, page } = await L.newPage(browser, w, h, { mobile })
    for (const sc of SCENARIOS) {
      if (only && !only.includes(sc.id)) continue
      if (sc.mobileOnly && w >= 1024) continue
      const rec = { id: sc.id, w, h, mobile, size: s }
      try {
        await L.go(page, sc.route, 700)
        let trig = null
        if (sc.trigger) {
          trig = page.locator(sc.trigger).first()
          await trig.scrollIntoViewIfNeeded()
          await trig.evaluate((el) => el.setAttribute('data-audit-trigger', '1'))
          rec.scrollBefore = await page.evaluate(() => window.scrollY)
          if (mobile) await trig.tap()
          else await trig.click()
        } else {
          await sc.open(page)
        }
        await page.waitForTimeout(700)
        const cont = page.locator(sc.container).first()
        rec.opened = (await cont.count()) > 0 && (await cont.isVisible())
        if (!rec.opened) throw new Error('container não abriu')
        rec.geom = await cont.evaluate((d) => {
          const vw = document.documentElement.clientWidth
          const vh = window.innerHeight
          const r = d.getBoundingClientRect()
          const body = d.querySelector('.ui-modal__body')
          const foot = d.querySelector('.ui-modal__foot')
          const head = d.querySelector('.ui-modal__head')
          const btns = Array.from(d.querySelectorAll('button, a[href], input, select, textarea')).filter((b) => {
            const br = b.getBoundingClientRect()
            return br.width > 0 && br.height > 0 && getComputedStyle(b).visibility !== 'hidden'
          })
          const outside = btns.filter((b) => {
            const br = b.getBoundingClientRect()
            // fora da viewport e fora da área rolável do corpo do modal
            const inScroll = body && body.contains(b)
            return !inScroll && (br.bottom > vh + 1 || br.right > vw + 1 || br.top < -1 || br.left < -1)
          })
          // conteúdo que vaza horizontalmente da caixa do modal
          let hOverflow = 0
          for (const el of d.querySelectorAll('*')) {
            const er = el.getBoundingClientRect()
            if (er.width && er.right > r.right + 2) {
              let n = el.parentElement, clipped = false
              while (n && n !== d) { const cs = getComputedStyle(n); if (cs.overflowX !== 'visible') { const nr = n.getBoundingClientRect(); if (nr.right <= r.right + 2) { clipped = true; break } } n = n.parentElement }
              if (!clipped) hOverflow++
            }
          }
          const smallBtns = btns.filter((b) => { const br = b.getBoundingClientRect(); return br.height < 44 || br.width < 44 }).map((b) => `${b.tagName.toLowerCase()} "${(b.getAttribute('aria-label') || b.innerText || '').trim().slice(0, 30)}" ${Math.round(b.getBoundingClientRect().width)}x${Math.round(b.getBoundingClientRect().height)}`)
          return {
            vw, vh,
            top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), height: Math.round(r.height), width: Math.round(r.width),
            fitsViewport: r.top >= -1 && r.bottom <= vh + 1 && r.left >= -1 && r.right <= vw + 1,
            headH: head ? Math.round(head.getBoundingClientRect().height) : null,
            footH: foot ? Math.round(foot.getBoundingClientRect().height) : null,
            bodyH: body ? Math.round(body.clientHeight) : null,
            bodyScrollH: body ? body.scrollHeight : null,
            bodyScrollable: body ? body.scrollHeight > body.clientHeight + 1 && ['auto', 'scroll'].includes(getComputedStyle(body).overflowY) : null,
            bodyShare: body ? +(body.clientHeight / vh).toFixed(2) : null,
            controlsOutside: outside.map((b) => `${b.tagName.toLowerCase()} "${(b.getAttribute('aria-label') || b.innerText || '').trim().slice(0, 30)}"`).slice(0, 10),
            hOverflow,
            smallTargets: smallBtns.slice(0, 15),
            smallTargetsN: smallBtns.length,
            pageScrollLocked: getComputedStyle(document.body).overflow,
          }
        })
        rec.scrollAfterOpen = await page.evaluate(() => window.scrollY)
        rec.shot = await L.shot(page, `estados/${sc.id}--${s}`)
        // Foco inicial
        rec.focusInitial = await page.evaluate((sel) => {
          const a = document.activeElement
          const c = document.querySelector(sel)
          return { inside: !!(c && a && c.contains(a)), el: a ? a.tagName.toLowerCase() + (a.className ? '.' + String(a.className).split(' ')[0] : '') + ' ' + (a.getAttribute('aria-label') || '').slice(0, 30) : null }
        }, sc.container.replace(':visible', ''))
        // Armadilha de foco: 40 Tabs e 6 Shift+Tab
        const escapes = []
        const noRing = []
        for (let i = 0; i < 40; i++) {
          await page.keyboard.press('Tab')
          const info = await page.evaluate((sel) => {
            const a = document.activeElement
            const c = Array.from(document.querySelectorAll(sel)).find((x) => x.getBoundingClientRect().width > 0)
            const cs = a ? getComputedStyle(a) : null
            const ring = cs && ((cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none'))
            return { inside: !!(c && a && c.contains(a)), el: a ? (a.tagName.toLowerCase() + ' ' + (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 30)) : 'null', ring, body: a === document.body }
          }, sc.container.replace(':visible', ''))
          if (!info.inside) escapes.push(info.el)
          if (info.inside && !info.ring) noRing.push(info.el)
        }
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press('Shift+Tab')
          const inside = await page.evaluate((sel) => { const a = document.activeElement; const c = Array.from(document.querySelectorAll(sel)).find((x) => x.getBoundingClientRect().width > 0); return !!(c && a && c.contains(a)) }, sc.container.replace(':visible', ''))
          if (!inside) escapes.push('(shift) ' + (await page.evaluate(() => document.activeElement?.tagName)))
        }
        rec.focusEscapes = escapes.length
        rec.focusEscapeExamples = [...new Set(escapes)].slice(0, 6)
        rec.focusNoRing = [...new Set(noRing)].slice(0, 8)
        // axe dentro do contêiner
        try {
          const ax = await L.runAxe(page, { context: { include: [[sc.container.replace(':visible', '')]] } })
          rec.axe = ax.violations.map((v) => ({ id: v.id, impact: v.impact, count: v.count, ex: v.nodes.slice(0, 3).map((n) => n.target + ' :: ' + n.html.slice(0, 120)) }))
        } catch (e) {
          rec.axeError = String(e).slice(0, 200)
        }
        // ARIA snapshot do contêiner (resumo)
        try {
          const snap = await cont.ariaSnapshot()
          rec.aria = snap.split('\n').slice(0, 40).join('\n')
        } catch {}
        // Esc fecha? foco volta?
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        rec.closedByEsc = !((await page.locator(sc.container).first().count()) > 0 && (await page.locator(sc.container).first().isVisible().catch(() => false)))
        if (sc.drawer && !sc.inPreview && !rec.closedByEsc) rec.closedByEsc = (await page.locator(sc.container).first().getAttribute('data-open')) !== 'true'
        if (sc.id === 'menu-studio') rec.closedByEsc = (await page.locator('#studio-sidebar').getAttribute('data-open')) !== 'true'
        if (sc.id === 'drawer-celular-previa') rec.closedByEsc = (await page.locator(sc.container).first().getAttribute('data-open')) !== 'true'
        rec.focusAfterClose = await page.evaluate(() => {
          const a = document.activeElement
          return { returned: !!(a && a.getAttribute('data-audit-trigger')), el: a ? a.tagName.toLowerCase() + ' ' + (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 30) : null }
        })
        rec.scrollAfterClose = await page.evaluate(() => window.scrollY)
      } catch (e) {
        rec.error = String(e).slice(0, 300)
      }
      results.push(rec)
      console.log(w, sc.id, rec.error ? 'ERRO ' + rec.error.slice(0, 120) : `fit=${rec.geom?.fitsViewport} h=${rec.geom?.height}/${h} body=${rec.geom?.bodyH} foot=${rec.geom?.footH} out=${rec.geom?.controlsOutside?.length} hOv=${rec.geom?.hOverflow} focus0=${rec.focusInitial?.inside} esc=${rec.focusEscapes} esc→close=${rec.closedByEsc} back=${rec.focusAfterClose?.returned} axe=${(rec.axe || []).map((a) => a.id + ':' + a.count).join(',')}`)
    }
    await ctx.close()
  }
  L.save(`estados-${widths.join('_')}${only ? '-parcial' : ''}.json`, results)
  await browser.close()
})()
