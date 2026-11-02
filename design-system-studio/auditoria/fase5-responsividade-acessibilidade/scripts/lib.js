// Utilitários comuns da fase 5 (responsividade e acessibilidade).
// Só lê o produto servido em http://127.0.0.1:4300/ — não altera nada do repositório.
const path = require('path')
const fs = require('fs')
const { chromium } = require('playwright')

const BASE = 'http://127.0.0.1:4300/'
const OUT = path.resolve(__dirname, '..')
const CAP = path.join(OUT, 'capturas')
const DADOS = path.join(OUT, 'dados')
const STORAGE_KEY = 'atelier-ui:studio:v1'

const FIXTURE = JSON.parse(fs.readFileSync(path.join(DADOS, 'fixture-projeto-preenchido.json'), 'utf8')).project

const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'

function contextOptions(width, height, opts = {}) {
  const mobile = opts.mobile ?? width < 768
  const o = {
    viewport: { width, height },
    deviceScaleFactor: opts.dpr ?? (mobile ? 2 : 1),
    isMobile: mobile,
    hasTouch: mobile || !!opts.touch,
    locale: 'pt-BR',
    reducedMotion: opts.reducedMotion ?? 'no-preference',
  }
  if (mobile) o.userAgent = MOBILE_UA
  return o
}

async function launch() {
  return chromium.launch()
}

/** Cria contexto e injeta o estado do projeto (vazio = sem nada; 'cheio' = fixture). */
async function newPage(browser, width, height, opts = {}) {
  const ctx = await browser.newContext(contextOptions(width, height, opts))
  const state = opts.state ?? 'cheio'
  if (state !== 'vazio') {
    const project = structuredClone(FIXTURE)
    if (opts.patch) opts.patch(project)
    const payload = JSON.stringify({ state: { project, history: [] }, version: 1 })
    await ctx.addInitScript(
      ([k, v]) => {
        try {
          if (!sessionStorage.getItem('__seeded')) {
            localStorage.setItem(k, v)
            sessionStorage.setItem('__seeded', '1')
          }
        } catch {}
      },
      [STORAGE_KEY, payload],
    )
  } else {
    await ctx.addInitScript(() => {
      try {
        if (!sessionStorage.getItem('__seeded')) {
          localStorage.clear()
          sessionStorage.setItem('__seeded', '1')
        }
      } catch {}
    })
  }
  if (opts.textZoom) {
    await ctx.addInitScript((pct) => {
      const apply = () => {
        const s = document.createElement('style')
        s.id = '__textzoom'
        s.textContent = `html{font-size:${pct}% !important}`
        document.documentElement.appendChild(s)
      }
      if (document.documentElement) apply()
      else document.addEventListener('DOMContentLoaded', apply)
    }, opts.textZoom)
  }
  const page = await ctx.newPage()
  page.setDefaultTimeout(45000)
  return { ctx, page }
}

async function settle(page, extra = 400) {
  await page.waitForLoadState('domcontentloaded')
  try {
    await page.waitForFunction(() => !document.body.innerText.includes('Carregando…') && document.querySelector('main'), null, { timeout: 30000 })
  } catch {}
  try {
    await page.evaluate(() => document.fonts && document.fonts.ready)
  } catch {}
  await page.waitForTimeout(extra)
}

async function go(page, route, extra) {
  await page.goto(BASE + '#' + route, { waitUntil: 'domcontentloaded' })
  await settle(page, extra)
}

/**
 * Mede problemas de layout na página atual. Roda dentro do navegador.
 * - overflow do documento e elementos que ultrapassam a viewport sem contêiner de rolagem
 * - textos cortados (scrollWidth > clientWidth com overflow que corta)
 * - fontes pequenas (< 12 px reais, considerando escala de miniaturas)
 * - alvos de toque (< 44 e < 24) e distância entre alvos (< 8 px)
 * - campos com fonte < 16 px
 * - elementos cobertos por outros (elementFromPoint), percorrendo a página
 */
async function measure(page, opts = {}) {
  return page.evaluate(async (opts) => {
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const out = { vw, vh, url: location.hash }
    const de = document.documentElement
    out.docScrollWidth = de.scrollWidth
    out.bodyScrollWidth = document.body.scrollWidth
    out.docOverflowX = Math.max(de.scrollWidth, document.body.scrollWidth) - vw
    out.docHeight = de.scrollHeight

    const isVisible = (el) => {
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0
    }
    const desc = (el) => {
      let s = el.tagName.toLowerCase()
      if (el.id) s += '#' + el.id
      const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3)
      if (cls.length) s += '.' + cls.join('.')
      const lab = el.getAttribute('aria-label') || el.getAttribute('title') || (el.innerText || el.value || '').trim()
      if (lab) s += ` "${lab.replace(/\s+/g, ' ').slice(0, 50)}"`
      return s
    }
    const offscreen = (el) => {
      // dentro de gaveta fixa deslocada por transform, ou totalmente fora do documento
      let n = el
      while (n && n !== document.body) {
        const cs = getComputedStyle(n)
        if (cs.position === 'fixed' && cs.transform !== 'none') {
          const r = n.getBoundingClientRect()
          if (r.right <= 0 || r.left >= vw) return true
        }
        n = n.parentElement
      }
      const r = el.getBoundingClientRect()
      return r.bottom + window.scrollY <= 0 || r.right + window.scrollX <= 0
    }
    const srOnly = (el) => {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      return (cs.clip && cs.clip !== 'auto' && r.width <= 2) || el.classList.contains('sr-only') || (r.width <= 1 && r.height <= 1)
    }
    const scaleOf = (el) => {
      const r = el.getBoundingClientRect()
      const ow = el.offsetWidth
      if (ow && r.width) return r.width / ow
      return 1
    }
    const PREVIEW_RE = /(^|\s)(lay-ph|lay-ds|lay-fit|lay-mob-media|lay-thumb|ent-phone|ent-fit|ent-stage|ent-thumb|tpl-thumb|tpl-frame|tpl-sec|ins-phone|ins-browser|ins-thumb|lp-stage|lp-phone|lp-scroll|cmp-pv|cmp-fam-media|nvs-stage|nvs-app|nvs-phone|nvs-combo|rv-card__media|clr-preview|idp)/
    const inPreview = (el) => {
      let n = el
      while (n && n !== document.body) {
        const c = n.getAttribute && n.getAttribute('class')
        if (c && PREVIEW_RE.test(' ' + c)) return true
        if (n.getAttribute && (n.getAttribute('data-preview') !== null)) return true
        n = n.parentElement
      }
      return false
    }
    const all = Array.from(document.querySelectorAll('body *')).filter((el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName))

    // 1. Elementos que ultrapassam a viewport e não estão dentro de um contêiner que rola/corta
    const clipsX = (el) => {
      let n = el.parentElement
      while (n && n !== document.body && n !== de) {
        const cs = getComputedStyle(n)
        if (['auto', 'scroll', 'hidden', 'clip'].includes(cs.overflowX)) return n
        n = n.parentElement
      }
      return null
    }
    const overflowEls = []
    for (const el of all) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (r.right > vw + 1 || r.left < -1) {
        if (offscreen(el) || srOnly(el)) continue // gavetas fora da tela por transform / sr-only
        const clip = clipsX(el)
        if (clip) {
          const cr = clip.getBoundingClientRect()
          // o contêiner cortante cabe na viewport: elemento só rola dentro dele
          if (cr.right <= vw + 1 && cr.left >= -1) continue
        }
        // só registra o mais externo
        if (overflowEls.some((o) => o.el.contains(el))) continue
        overflowEls.push({ el, r })
      }
    }
    out.overflow = overflowEls.slice(0, 25).map(({ el, r }) => ({ el: desc(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), preview: inPreview(el) }))
    out.overflowCount = overflowEls.length

    // 2. Textos cortados (elementos "de texto" — sem filhos de bloco — cujo conteúdo excede a caixa e é cortado)
    const trunc = []
    for (const el of all) {
      const txt = (el.innerText || '').trim()
      if (txt.length < 2) continue
      if (el.querySelector('div,section,ul,ol,img,canvas,table,button,input,select,textarea,p,h1,h2,h3,h4,li')) continue
      if (!isVisible(el) || srOnly(el) || offscreen(el)) continue
      if (el.closest('svg')) continue
      const cs = getComputedStyle(el)
      const clipX = ['hidden', 'clip'].includes(cs.overflowX) || cs.textOverflow === 'ellipsis'
      const clipY = ['hidden', 'clip'].includes(cs.overflowY)
      const horiz = clipX && el.scrollWidth > el.clientWidth + 1
      const vert = clipY && el.scrollHeight > el.clientHeight + 2
      if (!horiz && !vert) continue
      trunc.push({
        el: desc(el),
        text: txt.replace(/\s+/g, ' ').slice(0, 80),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
        ellipsis: cs.textOverflow === 'ellipsis',
        lineClamp: !!(cs.webkitLineClamp && cs.webkitLineClamp !== 'none'),
        dir: horiz ? 'x' : 'y',
        preview: inPreview(el) || scaleOf(el) < 0.98,
      })
    }
    out.truncated = trunc.filter((t) => !t.preview).slice(0, 40)
    out.truncatedCount = trunc.filter((t) => !t.preview).length
    out.truncatedPreviewCount = trunc.filter((t) => t.preview).length

    // 3. Fontes pequenas (texto real visível)
    const small = []
    const smallPrev = []
    for (const el of all) {
      const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      if (!hasText || !isVisible(el) || srOnly(el) || offscreen(el)) continue
      const fs = parseFloat(getComputedStyle(el).fontSize)
      const sc = scaleOf(el)
      const eff = fs * sc
      const item = { el: desc(el), fontSize: +fs.toFixed(1), effective: +eff.toFixed(1) }
      const prev = inPreview(el) || sc < 0.98
      if (eff < 12) (prev ? smallPrev : small).push(item)
    }
    out.smallText = small.slice(0, 30)
    out.smallTextCount = small.length
    out.smallTextPreviewCount = smallPrev.length
    out.smallTextPreviewMin = smallPrev.length ? Math.min(...smallPrev.map((s) => s.effective)) : null

    // 4. Alvos de toque e espaçamento
    const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], [role=link], [role=checkbox], [role=switch], [role=option], [tabindex]:not([tabindex="-1"]), summary'
    const targets = Array.from(document.querySelectorAll(SEL)).filter((el) => {
      if (!isVisible(el)) return false
      if (srOnly(el)) return false
      if (el.closest('[inert]')) return false
      if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio') && getComputedStyle(el).position === 'absolute') return false
      const cs = getComputedStyle(el)
      if (cs.pointerEvents === 'none') return false
      if (el.closest('[aria-hidden="true"]')) return false
      return true
    })
    out.offscreenFocusable = targets.filter((el) => offscreen(el) && !el.closest('[inert]') && el.tabIndex >= 0).length
    const onscreenTargets = targets.filter((el) => !offscreen(el))
    const tinfo = onscreenTargets.map((el) => {
      const r = el.getBoundingClientRect()
      const prev = inPreview(el) || scaleOf(el) < 0.98
      // links em linha dentro de texto são exceção
      const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.parentElement && el.parentElement.innerText.trim().length > el.innerText.trim().length + 10
      return { el, r, prev, inline }
    })
    out.targetsTotal = tinfo.filter((t) => !t.prev).length
    const lt44 = tinfo.filter((t) => !t.prev && !t.inline && (t.r.width < 44 || t.r.height < 44))
    const lt24 = tinfo.filter((t) => !t.prev && !t.inline && (t.r.width < 24 || t.r.height < 24))
    out.targetsLt44 = lt44.length
    out.targetsLt24 = lt24.length
    out.targetsLt44Prev = tinfo.filter((t) => t.prev && (t.r.width < 44 || t.r.height < 44)).length
    out.targetsPrevTotal = tinfo.filter((t) => t.prev).length
    const bucket = {}
    for (const t of lt44) {
      const k = t.el.tagName.toLowerCase() + '.' + ((t.el.getAttribute('class') || '').split(/\s+/)[0] || '') + ` ${Math.round(t.r.width)}x${Math.round(t.r.height)}`
      bucket[k] = (bucket[k] || 0) + 1
    }
    out.targetsLt44Groups = Object.entries(bucket).sort((a, b) => b[1] - a[1]).slice(0, 20)
    out.targetsLt24Examples = lt24.slice(0, 12).map((t) => ({ el: desc(t.el), w: Math.round(t.r.width), h: Math.round(t.r.height) }))

    // espaçamento: pares próximos (< 8 px) de alvos não aninhados, fora das prévias
    const studioT = tinfo.filter((t) => !t.prev && !t.inline)
    const close = []
    for (let i = 0; i < studioT.length; i++) {
      const a = studioT[i]
      for (let j = i + 1; j < studioT.length; j++) {
        const b = studioT[j]
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue
        if (a.el.tagName === 'LABEL' || b.el.tagName === 'LABEL') continue
        const dx = Math.max(0, Math.max(a.r.left, b.r.left) - Math.min(a.r.right, b.r.right))
        const dy = Math.max(0, Math.max(a.r.top, b.r.top) - Math.min(a.r.bottom, b.r.bottom))
        const overlapX = dx === 0
        const overlapY = dy === 0
        let gap = null
        if (overlapX && overlapY) gap = -1 // sobrepostos
        else if (overlapY) gap = dx
        else if (overlapX) gap = dy
        if (gap !== null && gap < 8) {
          close.push({ a: desc(a.el), b: desc(b.el), gap: Math.round(gap * 10) / 10 })
        }
      }
      if (close.length > 400) break
    }
    out.closeTargetsCount = close.length
    out.overlappingTargets = close.filter((c) => c.gap < 0).slice(0, 10)
    out.closeTargets = close.filter((c) => c.gap >= 0).slice(0, 25)

    // 5. Campos com fonte < 16
    const fields = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]), select, textarea')).filter(isVisible)
    out.fields = fields.length
    out.fieldsSmallFont = fields
      .filter((f) => !inPreview(f) && scaleOf(f) >= 0.98)
      .map((f) => ({ el: desc(f), fontSize: parseFloat(getComputedStyle(f).fontSize), h: Math.round(f.getBoundingClientRect().height) }))
      .filter((f) => f.fontSize < 16)
    out.fieldsPreviewSmallFont = fields.filter((f) => (inPreview(f) || scaleOf(f) < 0.98) && parseFloat(getComputedStyle(f).fontSize) < 16).length

    // 6. Barras fixas/sticky
    const fixed = all
      .filter((el) => {
        const cs = getComputedStyle(el)
        return (cs.position === 'fixed' || cs.position === 'sticky') && isVisible(el)
      })
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { el: desc(el).slice(0, 80), pos: getComputedStyle(el).position, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) }
      })
    out.fixed = fixed.slice(0, 15)

    // 7. Cartões estreitos: .ui-option e outros cards com largura < 140
    const cards = Array.from(document.querySelectorAll('.ui-option, .ui-card, [class*="card"]')).filter((el) => isVisible(el) && !inPreview(el) && scaleOf(el) >= 0.98)
    out.narrowCards = cards
      .map((c) => ({ el: desc(c).slice(0, 70), w: Math.round(c.getBoundingClientRect().width) }))
      .filter((c) => c.w < 150 && c.w > 0)
      .slice(0, 10)
    out.cardWidths = (() => {
      const ws = Array.from(document.querySelectorAll('.ui-option')).filter(isVisible).map((c) => Math.round(c.getBoundingClientRect().width))
      return ws.length ? { n: ws.length, min: Math.min(...ws), max: Math.max(...ws) } : null
    })()

    // 8. Headings e landmarks
    out.h1 = document.querySelectorAll('h1').length
    out.main = document.querySelectorAll('main, [role=main]').length

    return out
  }, opts)
}

/** Percorre a página e testa, com elementFromPoint, se alvos interativos estão cobertos por outro elemento. */
async function coveredScan(page, maxSteps = 12) {
  return page.evaluate(async (maxSteps) => {
    const vh = window.innerHeight
    const vw = document.documentElement.clientWidth
    const total = document.documentElement.scrollHeight
    const res = []
    const seen = new Set()
    const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=tab], h1, h2, h3, p, label'
    const steps = Math.min(maxSteps, Math.ceil(total / (vh * 0.8)))
    const desc = (el) => {
      let s = el.tagName.toLowerCase()
      const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      if (cls.length) s += '.' + cls.join('.')
      const lab = el.getAttribute('aria-label') || (el.innerText || '').trim()
      if (lab) s += ` "${lab.replace(/\s+/g, ' ').slice(0, 40)}"`
      return s
    }
    for (let i = 0; i < steps; i++) {
      window.scrollTo(0, i * vh * 0.8)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      for (const el of document.querySelectorAll(SEL)) {
        if (seen.has(el)) continue
        const r = el.getBoundingClientRect()
        if (r.width < 4 || r.height < 4) continue
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        if (cy < 0 || cy > vh - 1 || cx < 0 || cx > vw - 1) continue
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue
        if (el.closest('[aria-hidden="true"],[inert]')) continue
        // ignora conteúdo dentro de miniaturas escaladas
        if (el.offsetWidth && Math.abs(r.width / el.offsetWidth - 1) > 0.02) continue
        seen.add(el)
        const top = document.elementFromPoint(cx, cy)
        if (!top) continue
        if (top === el || el.contains(top) || top.contains(el)) continue
        // label/descendente do mesmo controle
        if (top.closest('label') && top.closest('label').contains(el)) continue
        const coverer = top.closest('header, footer, nav, aside, [class*="footer"], [class*="dock"], [class*="bar"], [class*="toast"], [class*="overlay"], [class*="modal"]') || top
        const ccs = getComputedStyle(coverer)
        res.push({ el: desc(el), by: desc(top).slice(0, 80), coverer: desc(coverer).slice(0, 60), pos: ccs.position, y: Math.round(cy + window.scrollY) })
      }
    }
    window.scrollTo(0, 0)
    return res
  }, maxSteps)
}

async function shot(page, name, opts = {}) {
  const file = path.join(CAP, name.endsWith('.png') ? name : name + '.png')
  await page.screenshot({ path: file, fullPage: !!opts.fullPage, animations: 'disabled', ...(opts.clip ? { clip: opts.clip } : {}) })
  return path.relative(OUT, file)
}

function save(name, data) {
  fs.writeFileSync(path.join(DADOS, name), JSON.stringify(data, null, 2))
}

const ROUTES = [
  ['home', '/'],
  ['livre', '/livre'],
  ['g-objetivo', '/guiado/objetivo'],
  ['g-entrada', '/guiado/entrada'],
  ['g-desktop', '/guiado/desktop'],
  ['g-mobile', '/guiado/mobile'],
  ['g-revisao', '/guiado/revisao'],
  ['g-preview', '/guiado/preview'],
  ['g-identidade', '/guiado/identidade'],
  ['g-navegacao', '/guiado/navegacao'],
  ['g-componentes', '/guiado/componentes'],
  ['g-entrega', '/guiado/entrega'],
  ['m-objetivo', '/modulos/objetivo'],
  ['m-landing', '/modulos/landing'],
  ['m-login', '/modulos/login'],
  ['m-cadastro', '/modulos/cadastro'],
  ['m-desktop', '/modulos/desktop'],
  ['m-mobile', '/modulos/mobile'],
  ['m-preview', '/modulos/preview'],
  ['m-cores', '/modulos/cores'],
  ['m-navegacao', '/modulos/navegacao'],
  ['m-componentes', '/modulos/componentes'],
  ['m-inspiracao', '/modulos/inspiracao'],
  ['m-templates', '/modulos/templates'],
  ['prompt', '/prompt'],
  ['exportar', '/exportar'],
  ['validacao', '/validacao'],
  ['projeto', '/projeto'],
]

module.exports = { BASE, OUT, CAP, DADOS, STORAGE_KEY, FIXTURE, launch, newPage, go, settle, measure, coveredScan, shot, save, ROUTES, contextOptions }
