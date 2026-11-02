/**
 * Suíte de regressão da auditoria (fase 7): um `describe` por erro histórico (REG-01 … REG-20).
 *
 * - Teste normal  → o comportamento está correto hoje e o teste protege contra a volta do erro.
 * - `test.fail()` → o erro foi reproduzido. O teste afirma o comportamento CORRETO; enquanto o defeito
 *   existir ele "falha como esperado". Quando for corrigido, o Playwright acusa "passou inesperadamente"
 *   e a marcação deve ser removida.
 *
 * Detalhes, medidas e capturas: auditoria/fase7-regressao/relatorio.md
 */
import { readFileSync } from 'node:fs'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { freshStart, go, horizontalOverflow, ROUTES, savedProject, trackErrors } from './helpers'

const VER = '— ver auditoria/fase7-regressao'
const MOBILE = { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
const IPHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
const STORAGE = 'atelier-ui:studio:v1'

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                  */
/* -------------------------------------------------------------------------- */

type Patch = Record<string, unknown>

/** Grava um projeto inicial (atalho de preparação) e recarrega. Só usado para chegar rápido a um estado. */
async function seed(page: Page, patch: Patch) {
  await freshStart(page)
  await go(page, '/modulos/objetivo')
  await page.getByTestId('project-name').fill('Projeto Regressão')
  await expect.poll(async () => (await savedProject(page))?.meta?.name).toBe('Projeto Regressão')
  await page.evaluate(
    ({ patch, key }) => {
      const raw = JSON.parse(localStorage.getItem(key) ?? '{}')
      const deep = (a: Record<string, unknown>, b: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(b)) {
          if (v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object') deep(a[k] as Record<string, unknown>, v as Record<string, unknown>)
          else a[k] = v
        }
      }
      deep(raw.state.project, patch)
      localStorage.setItem(key, JSON.stringify(raw))
    },
    { patch, key: STORAGE },
  )
  await page.reload()
}

/** Controle de seleção do cartão (nunca um botão de dentro da prévia interativa). */
const hitOf = (card: Locator) => card.locator('xpath=self::*[@aria-pressed] | .//*[@data-role="select"] | .//*[contains(concat(" ", @class, " "), " ui-option__hit ")]').first()
const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY))

/** Rola a página para que o centro do elemento fique na altura `y` da janela. */
async function placeAt(page: Page, target: Locator, y: number) {
  await target.scrollIntoViewIfNeeded()
  await target.evaluate((el, y) => {
    const r = el.getBoundingClientRect()
    window.scrollBy(0, r.top + r.height / 2 - y)
  }, y)
  await page.waitForTimeout(250)
}

/** Centro do elemento e se ele mesmo recebe o toque nesse ponto (nada por cima). */
async function hitInfo(target: Locator) {
  return target.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const hit = document.elementFromPoint(x, y)
    const cover = hit && !el.contains(hit) ? (hit.closest('[class]') as HTMLElement | null)?.className?.toString().slice(0, 40) ?? hit.tagName : null
    return { x, y, own: Boolean(hit && el.contains(hit)), cover }
  })
}

/** Toque "humano": dedo na coordenada visível, sem a rolagem automática do Playwright. */
async function tapWhereVisible(page: Page, target: Locator) {
  const h = await hitInfo(target)
  expect(h.own, `o alvo precisa estar visível e livre no ponto do toque (coberto por ${h.cover})`).toBe(true)
  await page.touchscreen.tap(h.x, h.y)
}

async function masterPrompt(page: Page) {
  await go(page, '/prompt')
  return (await page.getByTestId('master-prompt-text').textContent()) ?? ''
}

async function download(page: Page, trigger: () => Promise<void>, timeout = 10_000) {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout }), trigger()])
  return { name: d.suggestedFilename(), text: readFileSync((await d.path())!, 'utf8') }
}

/** Valida um texto CSS no próprio navegador (CSSOM) e devolve as variáveis de :root. */
async function parseCss(page: Page, css: string) {
  return page.evaluate((css) => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    const vars: Record<string, string> = {}
    for (const rule of Array.from(sheet.cssRules)) {
      if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
        for (const name of Array.from(rule.style)) if (name.startsWith('--')) vars[name] = rule.style.getPropertyValue(name).trim()
      }
    }
    return { rules: sheet.cssRules.length, vars }
  }, css)
}

const GALLERIES = [
  { route: '/modulos/desktop', prefix: 'desktop-option-' },
  { route: '/modulos/mobile', prefix: 'mobile-option-' },
  { route: '/modulos/landing', prefix: 'landing-option-' },
  { route: '/modulos/login', prefix: 'login-option-' },
  { route: '/modulos/cadastro', prefix: 'signup-option-' },
  { route: '/modulos/cores', prefix: 'palette-option-' },
  { route: '/modulos/navegacao', prefix: 'header-option-' },
  { route: '/modulos/navegacao', prefix: 'sidebar-option-', tab: /Sidebars/ },
]

async function openGallery(page: Page, g: (typeof GALLERIES)[number]) {
  await go(page, g.route)
  if (g.tab) await page.getByRole('tab', { name: g.tab }).click()
  await expect(page.locator(`[data-testid^="${g.prefix}"]`).first()).toBeVisible()
}

/** Critério de "estado selecionado visível": aria-pressed, data-selected, selo legível dentro do cartão e borda alterada. */
async function expectVisiblySelected(page: Page, prefix: string, index: number, how: 'click' | 'tap') {
  const card = page.locator(`[data-testid^="${prefix}"]`).nth(index)
  await placeAt(page, card, 420)
  const borderBefore = await card.evaluate((el) => `${getComputedStyle(el).borderColor}|${getComputedStyle(el).boxShadow}`)
  if (how === 'tap') await tapWhereVisible(page, hitOf(card))
  else await hitOf(card).click()
  await expect(hitOf(card)).toHaveAttribute('aria-pressed', 'true')
  await expect(card).toHaveAttribute('data-selected', 'true')
  const badge = card.locator('.ui-option__check, .nvs-card__badge')
  await expect(badge).toBeVisible()
  const b = await badge.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const c = el.closest('[data-testid]')!.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return { w: r.width, h: r.height, fs: parseFloat(cs.fontSize), opacity: Number(cs.opacity), inside: r.left >= c.left - 1 && r.right <= c.right + 1 && r.top >= c.top - 1, text: el.textContent?.trim() }
  })
  expect(b.w, `selo de seleção (${b.text}) com largura legível`).toBeGreaterThanOrEqual(60)
  expect(b.h).toBeGreaterThanOrEqual(20)
  expect(b.fs).toBeGreaterThanOrEqual(12)
  expect(b.opacity).toBeGreaterThan(0.9)
  expect(b.inside, 'o selo fica dentro do cartão').toBe(true)
  const borderAfter = await card.evaluate((el) => `${getComputedStyle(el).borderColor}|${getComputedStyle(el).boxShadow}`)
  expect(borderAfter, 'a borda do cartão muda ao selecionar').not.toBe(borderBefore)
  await expect(page.locator(`[data-testid^="${prefix}"][data-selected="true"]`), 'só um cartão selecionado por galeria').toHaveCount(1)
}

/* ========================================================================== */

test.describe('REG-01 · Layout escolhido mostra estado selecionado', () => {
  test('desktop 1440: todas as galerias marcam o cartão escolhido (aria-pressed, selo e borda)', async ({ page }) => {
    await freshStart(page)
    for (const g of GALLERIES) {
      await openGallery(page, g)
      await expectVisiblySelected(page, g.prefix, 3, 'click')
    }
  })

  test.describe('celular 360×800', () => {
    test.use(MOBILE)
    test('toque marca o cartão escolhido em layouts, paletas e landing', async ({ page }) => {
      await freshStart(page)
      for (const g of GALLERIES.filter((x) => ['desktop-option-', 'mobile-option-', 'palette-option-', 'landing-option-'].includes(x.prefix))) {
        await openGallery(page, g)
        await expectVisiblySelected(page, g.prefix, 2, 'tap')
      }
    })
  })

  test('modo guiado: painel de destaque confirma "Escolhido para o seu projeto"', async ({ page }) => {
    await freshStart(page)
    await go(page, '/guiado/desktop')
    await expect(page.getByText('Exemplo · ainda não escolhido')).toBeVisible()
    await page.getByRole('button', { name: 'Escolher este modelo' }).click()
    await expect(page.getByText('Escolhido para o seu projeto')).toBeVisible()
    await expect(page.getByTestId('guided-next')).toBeEnabled()
  })
})

test.describe('REG-02 · Clicar em miniaturas não rola a página sozinha', () => {
  test.describe('celular 360×800 (toque real, sem rolagem automática da ferramenta)', () => {
    test.use(MOBILE)
    test('etapa 3 do guiado: "Escolher este modelo" e miniaturas mantêm a rolagem', async ({ page }) => {
      await freshStart(page)
      await go(page, '/guiado/objetivo')
      await page.getByTestId('project-type-saas').tap()
      await go(page, '/guiado/desktop')
      const choose = page.getByRole('button', { name: 'Escolher este modelo' })
      // O relato original (−378 px) veio de locator.tap() com o botão sob a barra superior fixa:
      // o Playwright rola o alvo para o centro antes de tocar. Aqui o dedo toca onde o botão está.
      for (const y of [140, 420]) {
        await placeAt(page, choose, y)
        const before = await scrollY(page)
        await tapWhereVisible(page, choose)
        await expect.poll(async () => (await savedProject(page)).layout.desktopId).toBe('sidebar-integral-classica')
        await page.waitForTimeout(400)
        expect(await scrollY(page), `rolagem ao tocar "Escolher este modelo" em y=${y}`).toBe(before)
        await page.evaluate((key) => {
          const raw = JSON.parse(localStorage.getItem(key)!)
          raw.state.project.layout.desktopId = null
          localStorage.setItem(key, JSON.stringify(raw))
        }, STORAGE)
        await page.reload()
        await go(page, '/guiado/desktop')
      }
      const cards = page.locator('[data-testid^="desktop-option-"]')
      for (const i of [4, 19, 36]) {
        const hit = hitOf(cards.nth(i))
        await placeAt(page, hit, 400)
        const before = await scrollY(page)
        await tapWhereVisible(page, hit)
        await page.waitForTimeout(400)
        expect(await scrollY(page), `miniatura ${i}`).toBe(before)
        await expect(hit).toHaveAttribute('aria-pressed', 'true')
      }
    })

    test('celular (etapa 4) e paletas: tocar em miniaturas mantém a rolagem', async ({ page }) => {
      await freshStart(page)
      for (const [route, prefix, idx] of [
        ['/modulos/mobile', 'mobile-option-', [1, 3]],
        ['/modulos/cores', 'palette-option-', [7, 30]],
      ] as const) {
        await go(page, route)
        for (const i of idx) {
          const hit = hitOf(page.locator(`[data-testid^="${prefix}"]`).nth(i))
          await hit.scrollIntoViewIfNeeded()
          await placeAt(page, hit, 400)
          const before = await scrollY(page)
          await tapWhereVisible(page, hit)
          await page.waitForTimeout(400)
          expect(await scrollY(page), `${route} #${i}`).toBe(before)
        }
      }
    })
  })

  test('desktop 1440: "Escolher este modelo" no guiado não desloca a página', async ({ page }) => {
    await freshStart(page)
    await go(page, '/guiado/desktop')
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(300)
    const before = await scrollY(page)
    await page.getByRole('button', { name: 'Escolher este modelo' }).click()
    await page.waitForTimeout(400)
    expect(await scrollY(page)).toBe(before)
  })
})

test.describe('REG-03 · Controles da identidade e dos componentes alteram a prévia', () => {
  const previewText = (page: Page, text: string) => page.getByTestId('identity-preview').getByText(text, { exact: true }).first()
  const fontSize = (l: Locator) => l.evaluate((e) => parseFloat(getComputedStyle(e).fontSize))

  test('"Tamanho base do texto" muda o corpo do texto da prévia, não só o título', async ({ page }) => {
    test.fail(true, `REG-03: "Tamanho base do texto" só altera o título da prévia (corpo fica em 13 px) ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.getByRole('tab', { name: 'Tipografia' }).click()
    const body = { linha: previewText(page, 'Ana Souza'), botao: previewText(page, 'Primário'), campo: previewText(page, 'Placeholder…'), menu: previewText(page, 'Início') }
    const before = { linha: await fontSize(body.linha), botao: await fontSize(body.botao), campo: await fontSize(body.campo), menu: await fontSize(body.menu) }
    const title0 = await fontSize(previewText(page, 'Visão geral'))
    await page.getByRole('group', { name: 'Tamanho base' }).getByRole('button', { name: '18 px' }).click()
    await expect.poll(() => fontSize(previewText(page, 'Visão geral'))).toBeGreaterThan(title0) // o título responde
    for (const [k, l] of Object.entries(body)) {
      expect(await fontSize(l), `texto "${k}" da prévia deve crescer com a base de 18 px`).toBeGreaterThan(before[k as keyof typeof before])
    }
  })

  test('"Estilo dos ícones" (Preenchido/Duotone) muda os ícones da prévia da identidade', async ({ page }) => {
    test.fail(true, `REG-03: o estilo dos ícones é salvo e vai ao prompt, mas a prévia da identidade não muda ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
    const icons = () => page.getByTestId('identity-preview').locator('svg').evaluateAll((els) => els.map((e) => `${e.getAttribute('fill')}|${getComputedStyle(e).fill}|${e.getAttribute('stroke-width')}`).join(';'))
    const before = await icons()
    await page.getByRole('button', { name: 'Preenchido' }).click()
    await expect.poll(async () => (await savedProject(page)).identity.geometry.iconStyle).toBe('filled')
    expect(await icons(), 'ícones da prévia devem refletir o estilo "Preenchido"').not.toBe(before)
  })

  test('densidade da tabela mostrada no editor ("Padrão") é a mesma do Master Prompt', async ({ page }) => {
    test.fail(true, `REG-03: o editor mostra "Densidade: Padrão", mas o prompt escreve a densidade da família ("confortável"/"compacta") ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/componentes')
    await page.getByTestId('component-category-tabelas').click()
    await page.getByTestId('add-component-soft-pill').click()
    const editor = page.getByTestId('component-editor')
    const shown = (await editor.getByRole('group', { name: 'Densidade' }).locator('[aria-pressed="true"]').textContent())?.trim()
    expect(shown).toBe('Padrão')
    await page.keyboard.press('Escape')
    const prompt = await masterPrompt(page)
    const said = prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()
    expect(said?.toLowerCase(), 'densidade no prompt').toBe('padrão')
  })

  test('cantos, densidade global e fontes alteram a prévia (proteção)', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/cores')
    const snap = () =>
      page.getByTestId('identity-preview').evaluate((root) =>
        [root, ...Array.from(root.querySelectorAll('*'))].map((e) => { const cs = getComputedStyle(e); return `${cs.fontFamily}|${cs.borderRadius}|${cs.padding}|${cs.gap}` }).join(';'),
      )
    await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
    for (const name of ['Grandes (14 px)', 'Compacta']) {
      const s0 = await snap()
      await page.getByRole('button', { name, exact: true }).click()
      await expect.poll(snap, `prévia muda com "${name}"`).not.toBe(s0)
    }
    await page.getByRole('tab', { name: 'Tipografia' }).click()
    for (const group of ['Fonte dos títulos', 'Fonte dos textos']) {
      const s0 = await snap()
      await page.getByRole('group', { name: group }).getByRole('button', { name: /Fraunces/ }).click()
      await expect.poll(snap, `prévia muda com "${group}"`).not.toBe(s0)
    }
  })
})

const NOT_BUTTONS =
  '.ui-option__hit, .nvs-card__select, .ui-option__media, .nvs-card__preview, [data-testid="phone-preview"], [data-testid="phone-thumb"], [data-testid="identity-preview"], [data-testid="live-preview"], .ui-segmented, [role=tablist], .lay-ds, .gd-footer, .shell-topbar, #studio-sidebar, .cmp-nav, [aria-hidden="true"]'

/** Pares de botões sobrepostos ou com menos de 4 px entre si (ignora prévias, barras fixas, listas de navegação e áreas de cartão inteiro). */
async function buttonCollisions(page: Page) {
  return page.evaluate((NOT) => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('button, a.ui-btn, [role=button]')).filter((e) => {
      const r = e.getBoundingClientRect()
      return r.width > 4 && r.height > 4 && getComputedStyle(e).visibility !== 'hidden' && !e.closest(NOT)
    })
    const boxes = els.map((e) => ({ e, r: e.getBoundingClientRect(), n: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) }))
    const issues: string[] = []
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j]
        if (a.e.contains(b.e) || b.e.contains(a.e)) continue
        const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left)
        const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top)
        if (ix > 1 && iy > 1) issues.push(`sobrepostos: "${a.n}" × "${b.n}"`)
        else if (iy > Math.min(a.r.height, b.r.height) / 2) {
          const gap = Math.max(b.r.left - a.r.right, a.r.left - b.r.right)
          if (gap >= 0 && gap < 4) issues.push(`grudados: "${a.n}" | "${b.n}" (${gap.toFixed(1)} px)`)
        } else if (ix > Math.min(a.r.width, b.r.width) / 2) {
          const gap = Math.max(b.r.top - a.r.bottom, a.r.top - b.r.bottom)
          if (gap >= 0 && gap < 4) issues.push(`grudados: "${a.n}" / "${b.n}" (${gap.toFixed(1)} px)`)
        }
      }
    return issues
  }, NOT_BUTTONS)
}

const BUTTON_ROUTES = ['/', '/guiado/objetivo', '/guiado/entrada', '/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/templates', '/prompt', '/exportar']

test.describe('REG-04 · Botões grudados ou sobrepostos', () => {
  test('desktop 1440: nenhum par de botões sobreposto ou a menos de 4 px', async ({ page }) => {
    test.setTimeout(150_000)
    await freshStart(page)
    for (const r of BUTTON_ROUTES) {
      await go(page, r)
      expect(await buttonCollisions(page), r).toEqual([])
    }
  })

  test.describe('celular 360×800', () => {
    test.use(MOBILE)
    test('nenhum par de botões sobreposto ou a menos de 4 px', async ({ page }) => {
      test.setTimeout(150_000)
      await freshStart(page)
      for (const r of BUTTON_ROUTES) {
        await go(page, r)
        expect(await buttonCollisions(page), r).toEqual([])
      }
    })
  })

  test.describe('tablet 768×1024', () => {
    test.use({ viewport: { width: 768, height: 1024 } })
    test('"Escolher este modelo" do celular grande não fica por cima das miniaturas', async ({ page }) => {
      test.fail(true, `REG-04: entre 620 e 939 px de largura útil o painel do celular grande (com o botão) cobre as miniaturas ${VER}`)
      await freshStart(page)
      await go(page, '/modulos/mobile')
      const btn = page.getByRole('button', { name: 'Escolher este modelo' })
      const b = (await btn.boundingBox())!
      const overlapping = await page.locator('[data-testid^="mobile-option-"]').evaluateAll(
        (cards, b) => cards.filter((c) => { const r = c.getBoundingClientRect(); return Math.min(r.right, b.x + b.width) - Math.max(r.left, b.x) > 1 && Math.min(r.bottom, b.y + b.height) - Math.max(r.top, b.y) > 1 }).map((c) => (c as HTMLElement).dataset.testid),
        b,
      )
      expect(overlapping).toEqual([])
    })
  })
})

test.describe('REG-05 · Cartões sem ações duplicadas', () => {
  const ALL = [...GALLERIES, { route: '/modulos/componentes', prefix: 'family-option-' }, { route: '/modulos/templates', prefix: 'template-option-' }, { route: '/modulos/inspiracao', prefix: 'inspiration-option-' }]
  async function actions(page: Page, prefix: string) {
    return page.locator(`[data-testid^="${prefix}"]`).evaluateAll((cards) =>
      cards.slice(0, 8).map((c) => {
        const btns = Array.from(c.querySelectorAll<HTMLElement>('button, a[href], [role=button]')).filter((b) => !b.closest('.nvs-card__preview, .ui-option__media'))
        const names = btns.map((b) => (b.getAttribute('aria-label') || b.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase())
        return {
          id: (c as HTMLElement).dataset.testid,
          duplicated: names.filter((n, i) => n && names.indexOf(n) !== i),
          selectControls: btns.filter((b, i) => (b.hasAttribute('aria-pressed') && !b.closest('.ui-segmented')) || /^(selecionar|escolher|usar este|aplicar)/.test(names[i])).length,
        }
      }),
    )
  }
  for (const [label, use] of [['desktop 1440', {}], ['celular 360', MOBILE]] as const) {
    test.describe(label, () => {
      test.use(use)
      test('cada cartão tem uma única ação de seleção e nenhum rótulo repetido', async ({ page }) => {
        test.setTimeout(120_000)
        await freshStart(page)
        for (const g of ALL) {
          await openGallery(page, g as (typeof GALLERIES)[number])
          for (const a of await actions(page, g.prefix)) {
            expect(a.duplicated, `${a.id}: ações repetidas`).toEqual([])
            expect(a.selectControls, `${a.id}: controles de seleção`).toBeLessThanOrEqual(1)
          }
        }
      })
    })
  }
})

test.describe('REG-06 · Sidebar do Studio com largura adequada', () => {
  test('desktop 1440: sidebar ≥ 240 px e nenhum rótulo cortado', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/desktop')
    const sb = await page.locator('#studio-sidebar').evaluate((s) => {
      const links = Array.from(s.querySelectorAll<HTMLElement>('a'))
      return {
        w: s.getBoundingClientRect().width,
        cut: links.filter((a) => a.scrollWidth > a.clientWidth + 1 || Array.from(a.querySelectorAll<HTMLElement>('span')).some((x) => x.scrollWidth > x.clientWidth + 1)).map((a) => a.textContent),
        minFont: Math.min(...links.map((a) => parseFloat(getComputedStyle(a).fontSize))),
      }
    })
    expect(sb.w).toBeGreaterThanOrEqual(240)
    expect(sb.cut).toEqual([])
    expect(sb.minFont).toBeGreaterThanOrEqual(13)
  })

  test.describe('celular 360×800', () => {
    test.use(MOBILE)
    test('drawer ≥ 280 px, ≤ 90% da tela e itens com 44 px de altura', async ({ page }) => {
      await freshStart(page)
      await page.getByRole('button', { name: 'Abrir menu' }).tap()
      const sidebar = page.locator('#studio-sidebar')
      await expect(sidebar).toHaveAttribute('data-open', 'true')
      const d = await sidebar.evaluate((s) => ({
        w: s.getBoundingClientRect().width,
        minH: Math.min(...Array.from(s.querySelectorAll('a')).map((a) => a.getBoundingClientRect().height)),
        cut: Array.from(s.querySelectorAll<HTMLElement>('a')).filter((a) => a.scrollWidth > a.clientWidth + 1).length,
      }))
      expect(d.w).toBeGreaterThanOrEqual(280)
      expect(d.w).toBeLessThanOrEqual(360 * 0.9)
      expect(d.minH).toBeGreaterThanOrEqual(44)
      expect(d.cut).toBe(0)
    })
  })
})

test.describe('REG-07 · Filtros com letras legíveis', () => {
  const ROUTES_WITH_FILTERS = ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cores', '/modulos/navegacao', '/modulos/componentes', '/modulos/inspiracao', '/modulos/templates', '/prompt']
  async function smallestFilterFont(page: Page) {
    return page.evaluate(() => {
      const out: { t: string; fs: number }[] = []
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('.ui-chip, [role=tablist] [role=tab], select, .ui-segmented button, .cmp-nav__item'))) {
        const r = el.getBoundingClientRect()
        if (!r.width || el.closest('[data-testid="identity-preview"], .nvs-card__preview, .ui-option__media, [data-testid="phone-preview"], [data-testid="live-preview"]')) continue
        const sizes = [el, ...Array.from(el.querySelectorAll<HTMLElement>('*'))].filter((x) => x.textContent?.trim()).map((x) => parseFloat(getComputedStyle(x).fontSize))
        out.push({ t: el.textContent!.trim().slice(0, 24), fs: Math.min(...sizes) })
      }
      return out.sort((a, b) => a.fs - b.fs)[0]
    })
  }
  for (const [label, use] of [['desktop 1440', {}], ['celular 360', MOBILE]] as const) {
    test.describe(label, () => {
      test.use(use)
      test('nenhum texto de filtro, aba ou contador abaixo de 12 px', async ({ page }) => {
        test.setTimeout(120_000)
        await freshStart(page)
        for (const r of ROUTES_WITH_FILTERS) {
          await go(page, r)
          const s = await smallestFilterFont(page)
          if (s) expect(s.fs, `${r}: "${s.t}"`).toBeGreaterThanOrEqual(12)
        }
      })
    })
  }
})

test.describe('REG-08 · Prévias de celular com tamanho útil', () => {
  test('desktop 1440: celular grande ≥ 340 px e prévia integrada no modo Celular ≥ 340 px', async ({ page }) => {
    await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await go(page, '/modulos/mobile')
    expect((await page.getByTestId('phone-preview').first().boundingBox())!.width).toBeGreaterThanOrEqual(340)
    await go(page, '/modulos/preview')
    await page.getByRole('button', { name: /Celular/ }).first().click()
    const phone = page.getByTestId('live-preview').getByTestId('phone-preview').first()
    await expect(phone).toBeVisible()
    expect((await phone.boundingBox())!.width).toBeGreaterThanOrEqual(340)
  })

  for (const [label, use, w] of [['celular 360×800', MOBILE, 360], ['iPhone 390×844', IPHONE, 390]] as const) {
    test.describe(label, () => {
      test.use(use)
      test('celular grande ocupa ≥ 85% da largura e a prévia da landing mostra o aparelho com ≥ 280 px', async ({ page }) => {
        await freshStart(page)
        await go(page, '/modulos/mobile')
        expect((await page.getByTestId('phone-preview').first().boundingBox())!.width).toBeGreaterThanOrEqual(w * 0.85)
        await go(page, '/modulos/landing')
        await page.locator('[data-testid^="landing-option-"]').first().getByRole('button', { name: 'Ver prévia' }).tap()
        const phone = page.getByTestId('landing-preview-modal').locator('.ent-phone').first()
        await expect(phone).toBeVisible()
        const box = (await phone.boundingBox())!
        expect(box.width).toBeGreaterThanOrEqual(280)
        expect(box.height).toBeGreaterThanOrEqual(500)
      })
    })
  }
})

test.describe('REG-09 · Menus móveis com texto e ícones proporcionais', () => {
  test('nos 44 layouts móveis (com menus abertos): texto ≥ 10 px e ícone entre 0,75× e 2,5× o texto', async ({ page }) => {
    test.setTimeout(240_000)
    await freshStart(page)
    await go(page, '/modulos/mobile')
    const ids = await page.locator('[data-testid^="mobile-option-"]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.testid!))
    expect(ids.length).toBe(44)
    const problems: string[] = []
    let measured = 0
    for (const id of ids) {
      await hitOf(page.getByTestId(id)).click()
      const phone = page.getByTestId('phone-preview').first()
      const trigger = phone.getByTestId('phone-menu-trigger').first()
      if (await trigger.count()) await trigger.click({ timeout: 3000 }).catch(() => undefined)
      await page.waitForTimeout(150)
      const items = await phone.evaluate((root) => {
        const res: { t: string; icon: number; fs: number }[] = []
        for (const el of Array.from(root.querySelectorAll<HTMLElement>('a, button, [role=menuitem], li'))) {
          const svg = el.querySelector(':scope > svg, :scope > span > svg')
          const text = Array.from(el.childNodes).map((n) => n.textContent).join('').trim()
          if (!svg || !text) continue
          const sr = svg.getBoundingClientRect()
          if (!sr.width || !el.getBoundingClientRect().width) continue
          const tEl = Array.from(el.querySelectorAll<HTMLElement>('span')).find((s) => s.textContent?.trim() === text) ?? el
          res.push({ t: text.slice(0, 16), icon: sr.height, fs: parseFloat(getComputedStyle(tEl).fontSize) })
        }
        return res
      })
      measured += items.length
      for (const it of items) {
        const ratio = it.icon / it.fs
        if (it.fs < 10 || ratio < 0.75 || ratio > 2.5) problems.push(`${id} "${it.t}": texto ${it.fs}px, ícone ${it.icon.toFixed(1)}px (×${ratio.toFixed(2)})`)
      }
    }
    expect(measured, 'itens de menu medidos').toBeGreaterThan(100)
    expect(problems).toEqual([])
  })
})

test.describe('REG-10 · Diagramas: conteúdo não parece menu flutuante', () => {
  test('regiões de CONTEÚDO não usam a elevação dos menus flutuantes e sempre têm a etiqueta', async ({ page }) => {
    await freshStart(page)
    await go(page, '/modulos/desktop')
    const regions = await page.locator('[data-testid^="desktop-option-"]').evaluateAll((cards) =>
      cards.flatMap((card) => {
        const id = (card as HTMLElement).dataset.testid!.replace('desktop-option-', '')
        return Array.from(card.querySelectorAll<HTMLElement>('.lay-ds-region[data-kind="content"]')).map((c) => {
          const s = getComputedStyle(c).boxShadow
          return { id, elevated: s !== 'none' && !/inset/.test(s), labelled: Array.from(c.querySelectorAll('.lay-chip')).some((x) => /CONTE/.test(x.textContent ?? '')) }
        })
      }),
    )
    expect(regions.length).toBeGreaterThanOrEqual(42)
    // "Ilhas" é o único modelo cuja especificação declara o conteúdo como superfície flutuante.
    expect(regions.filter((r) => r.elevated && r.id !== 'ilhas-navegacao').map((r) => r.id)).toEqual([])
    expect(regions.filter((r) => !r.labelled).map((r) => r.id)).toEqual([])
  })
})

test.describe('REG-11 · Decisões chegam ao Master Prompt', () => {
  test('entrada, layouts, navegação, paleta, tipografia, geometria e componente aparecem no prompt', async ({ page }) => {
    test.setTimeout(120_000)
    await freshStart(page)
    await go(page, '/guiado/objetivo')
    await page.getByTestId('project-type-saas').click()
    await page.getByTestId('project-name').fill('Clínica Aurora')
    await go(page, '/guiado/entrada')
    await hitOf(page.getByTestId('entry-flow-landing-login')).click()
    const pick = async (route: string, prefix: string, idx: number, tab?: RegExp) => {
      await go(page, route)
      if (tab) await page.getByRole('tab', { name: tab }).click()
      const card = page.locator(`[data-testid^="${prefix}"]`).nth(idx)
      await hitOf(card).click()
      return (await card.locator('.ui-option__title, .nvs-card__title').first().textContent())!.trim()
    }
    const names = {
      landing: await pick('/modulos/landing', 'landing-option-', 2),
      login: await pick('/modulos/login', 'login-option-', 3),
      signup: await pick('/modulos/cadastro', 'signup-option-', 1),
      desktop: await pick('/modulos/desktop', 'desktop-option-', 5),
      mobile: await pick('/modulos/mobile', 'mobile-option-', 6),
      palette: await pick('/modulos/cores', 'palette-option-', 9),
      header: await pick('/modulos/navegacao', 'header-option-', 4),
      sidebar: await pick('/modulos/navegacao', 'sidebar-option-', 2, /Sidebars/),
    }
    await go(page, '/modulos/cores')
    await page.getByRole('tab', { name: 'Tipografia' }).click()
    await page.getByRole('group', { name: 'Fonte dos títulos' }).getByRole('button', { name: /Space Grotesk/ }).click()
    await page.getByRole('group', { name: 'Tamanho base' }).getByRole('button', { name: '17 px' }).click()
    await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
    await page.getByRole('button', { name: 'Grandes (14 px)', exact: true }).click()
    await page.getByRole('button', { name: 'Duotone', exact: true }).click()
    await go(page, '/modulos/componentes')
    await page.getByTestId('component-category-tabelas').click()
    await page.getByTestId('add-component-swiss-minimal').click()
    await page.keyboard.press('Escape')

    const prompt = await masterPrompt(page)
    expect(prompt).toContain('Clínica Aurora')
    expect(prompt).toContain('Landing page com chamada para login')
    for (const [k, v] of Object.entries(names)) expect(prompt, `decisão "${k}" (${v})`).toContain(v)
    expect(prompt).toContain('Space Grotesk')
    expect(prompt).toContain('tamanho base 17 px')
    expect(prompt).toMatch(/raioMedio: 14px/)
    expect(prompt).toContain('duotone')
    expect(prompt).toMatch(/Tabelas/)
    expect(prompt).toContain('Swiss Minimal')
  })

  test('propriedade escolhida no componente (Densidade = Compacta) chega ao prompt', async ({ page }) => {
    test.fail(true, `REG-11: a densidade escolhida pelo usuário é sobrescrita pela densidade da família no prompt ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/componentes')
    await page.getByTestId('component-category-tabelas').click()
    await page.getByTestId('add-component-soft-pill').click()
    const editor = page.getByTestId('component-editor')
    await editor.getByRole('group', { name: 'Densidade' }).getByRole('button', { name: 'Compacta' }).click()
    await expect.poll(async () => (await savedProject(page)).components[0].props.densidade).toBe('compacta')
    await page.keyboard.press('Escape')
    const prompt = await masterPrompt(page)
    expect(prompt.match(/Densidade: ([^\n·;]+)/)?.[1]?.trim()).toBe('compacta')
  })
})

test.describe('REG-12 · Mudanças na paleta se propagam', () => {
  test('trocar a paleta atualiza prévia da identidade, celular grande, CSS exportado e prompt', async ({ page }) => {
    await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await go(page, '/modulos/cores')
    const bg0 = await page.getByTestId('identity-preview').evaluate((e) => getComputedStyle(e).backgroundColor)
    await hitOf(page.getByTestId('palette-option-noite-na-mata')).click()
    await expect.poll(() => page.getByTestId('identity-preview').evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(bg0)
    await page.getByRole('tab', { name: 'Tokens e cores' }).click()
    const primary = (await page.getByLabel('Hexadecimal de Cor primária', { exact: true }).inputValue()).toLowerCase()
    const bg = (await page.getByLabel('Hexadecimal de Fundo principal', { exact: true }).inputValue()).toLowerCase()
    const rgb = (hex: string) => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`
    await go(page, '/modulos/mobile')
    const phoneColors = await page.getByTestId('phone-preview').first().evaluate((root) => Array.from(root.querySelectorAll('*')).map((e) => getComputedStyle(e).backgroundColor))
    expect(phoneColors, 'o celular grande usa o fundo da nova paleta').toContain(rgb(bg))
    await go(page, '/exportar')
    const css = await download(page, () => page.getByTestId('export-css').click())
    expect((await parseCss(page, css.text)).vars['--color-primary']?.toLowerCase()).toBe(primary)
    const prompt = await masterPrompt(page)
    expect(prompt).toContain('Noite na Mata')
    expect(prompt.toLowerCase()).toContain(primary)
  })

  test('troca manual da cor primária recalcula hover, active, foco e link', async ({ page }) => {
    test.fail(true, `REG-12: a primária manual não recalcula os tokens derivados (hover/active/foco/link ficam na cor antiga) ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/cores')
    await page.getByRole('tab', { name: 'Tokens e cores' }).click()
    const keys = ['Primária — hover', 'Primária — active', 'Borda de foco (focus-visible)', 'Link']
    const read = async () => Promise.all(keys.map((k) => page.getByLabel(`Hexadecimal de ${k}`, { exact: true }).inputValue()))
    const before = await read()
    const input = page.getByLabel('Hexadecimal de Cor primária', { exact: true })
    await input.fill('#0b6e4f')
    await input.press('Enter')
    await expect.poll(async () => (await savedProject(page)).identity.overrides.primary).toBe('#0b6e4f')
    const after = await read()
    keys.forEach((k, i) => expect(after[i], `${k} deve acompanhar a nova primária`).not.toBe(before[i]))
  })
})

test.describe('REG-13 · Seleções preservadas ao voltar de etapa', () => {
  test('guiado: voltar até a entrada e avançar de novo mantém fluxo, landing, login, cadastro, desktop e mobile', async ({ page }) => {
    test.setTimeout(120_000)
    await freshStart(page)
    await page.getByTestId('start-guided').click()
    await page.getByTestId('project-type-saas').click()
    await page.getByTestId('guided-next').click()
    await hitOf(page.getByTestId('entry-flow-landing-login')).click()
    for (const [tab, prefix] of [['Landing page', 'landing-option-'], ['Login', 'login-option-'], ['Cadastro', 'signup-option-']]) {
      await page.getByRole('tab', { name: new RegExp(`^${tab}`) }).click()
      await hitOf(page.locator(`[data-testid^="${prefix}"]`).nth(1)).click()
    }
    const chosen = await savedProject(page)
    await page.getByTestId('guided-next').click()
    await hitOf(page.getByTestId('desktop-option-sidebar-integral-classica')).click()
    await page.getByTestId('guided-next').click()
    await hitOf(page.getByTestId('mobile-option-bottom-nav-classica')).click()
    await page.getByTestId('guided-next').click()
    await expect(page).toHaveURL(/#\/guiado\/revisao/)

    // Volta etapa por etapa pelo botão "Voltar".
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(hitOf(page.getByTestId('mobile-option-bottom-nav-classica'))).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(hitOf(page.getByTestId('desktop-option-sidebar-integral-classica'))).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL(/#\/guiado\/entrada/)
    await page.getByRole('tab', { name: /Como as pessoas entram/ }).click() // a sub-aba aberta por último é lembrada
    await expect(hitOf(page.getByTestId('entry-flow-landing-login'))).toHaveAttribute('aria-pressed', 'true')
    for (const [tab, prefix, id] of [['Landing page', 'landing-option-', chosen.entry.landingId], ['Login', 'login-option-', chosen.entry.loginId], ['Cadastro', 'signup-option-', chosen.entry.signupId]]) {
      await page.getByRole('tab', { name: new RegExp(`^${tab}`) }).click()
      await expect(hitOf(page.getByTestId(`${prefix}${id}`)), tab).toHaveAttribute('aria-pressed', 'true')
    }
    // Avança de novo: nada se perdeu, inclusive após recarregar.
    await page.getByTestId('guided-next').click()
    await page.getByTestId('guided-next').click()
    await page.getByTestId('guided-next').click()
    await page.reload()
    const p = await savedProject(page)
    expect(p.entry).toMatchObject({ flow: 'landing-login', landingId: chosen.entry.landingId, loginId: chosen.entry.loginId, signupId: chosen.entry.signupId })
    expect(p.layout).toEqual({ desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' })
  })
})

test.describe('REG-14 · Arquivos exportados válidos e downloads no primeiro clique', () => {
  test('Exportar, Central de Prompts e identidade: .md, JSON, CSS (CSSOM), HTML e backup válidos no primeiro clique', async ({ page }) => {
    await seed(page, { meta: { name: 'Loja Aurora' }, entry: { flow: 'login-only', loginId: 'classico-central' }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await go(page, '/exportar')
    const md = await download(page, () => page.getByTestId('export-master').click())
    expect(md.name).toBe('loja-aurora-master-prompt.md')
    expect(md.text).toMatch(/^# Master Prompt — Loja Aurora/m)
    const spec = JSON.parse((await download(page, () => page.getByTestId('export-spec').click())).text)
    expect(spec.$schema).toBe('atelier-ui/spec@1')
    expect(spec.project.name).toBe('Loja Aurora')
    const css = await download(page, () => page.getByTestId('export-css').click())
    const parsed = await parseCss(page, css.text)
    expect(parsed.rules).toBeGreaterThan(0)
    expect(Object.keys(parsed.vars).length).toBeGreaterThanOrEqual(40)
    for (const v of Object.values(parsed.vars)) expect(v).not.toBe('')
    const html = await download(page, () => page.getByTestId('export-html').click())
    const doc = await page.evaluate((h) => { const d = new DOMParser().parseFromString(h, 'text/html'); return { title: d.title, body: d.body.textContent?.length ?? 0 } }, html.text)
    expect(html.text.startsWith('<!doctype html>')).toBe(true)
    expect(doc.body).toBeGreaterThan(100)
    const backup = JSON.parse((await download(page, () => page.getByTestId('export-backup').click())).text)
    expect(backup.kind).toBe('atelier-ui/backup')

    await go(page, '/modulos/cores')
    const tokens = await download(page, () => page.getByRole('button', { name: 'CSS dos tokens' }).click())
    expect(tokens.name).toBe('loja-aurora-tokens.css')
    expect(tokens.text).toBe(css.text)
  })

  test('guiado 1440×900: o primeiro clique real em "CSS dos tokens" baixa o arquivo', async ({ page }) => {
    test.fail(true, `REG-14: no guiado (etapa 7) o botão "CSS dos tokens" fica sob o rodapé fixo; o clique cai em "Continuar" e não baixa nada ${VER}`)
    await seed(page, { guided: { skeletonApproved: true, step: 'identidade' } })
    await go(page, '/guiado/identidade')
    await page.mouse.wheel(0, 1500)
    await page.waitForTimeout(400)
    const btn = page.getByRole('button', { name: 'CSS dos tokens' })
    const h = await hitInfo(btn)
    const box = (await btn.boundingBox())!
    expect(box.y + box.height, 'o botão está dentro da janela').toBeLessThanOrEqual(900)
    const got = page.waitForEvent('download', { timeout: 3000 }).then(() => true, () => false)
    await page.mouse.click(h.x, h.y) // clique onde a pessoa vê o botão
    expect(await got, `download no primeiro clique (ponto coberto por: ${h.cover ?? 'nada'})`).toBe(true)
    await expect(page).toHaveURL(/#\/guiado\/identidade/)
  })
})

test.describe('REG-15 · O aplicativo sempre carrega', () => {
  test('todas as rotas abrem sem erro de JavaScript e sem recurso 4xx/5xx (desktop)', async ({ page }) => {
    test.setTimeout(120_000)
    const errors = trackErrors(page)
    const bad: string[] = []
    page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`) })
    await freshStart(page)
    for (const r of ROUTES) {
      await go(page, r)
      await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
    }
    expect(errors).toEqual([])
    expect(bad).toEqual([])
  })

  test.describe('celular 360×800', () => {
    test.use(MOBILE)
    test('todas as rotas abrem sem erro de JavaScript', async ({ page }) => {
      test.setTimeout(120_000)
      const errors = trackErrors(page)
      await freshStart(page)
      for (const r of ROUTES) {
        await go(page, r)
        await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
      }
      expect(errors).toEqual([])
    })
  })

  test('armazenamento corrompido ou de outra versão não impede a abertura', async ({ page }) => {
    for (const raw of ['{isto não é json', JSON.stringify({ state: { project: { schema: 'outra-coisa', version: 99 } }, version: 1 }), JSON.stringify({ state: { project: null, history: 'x' } })]) {
      const errors: string[] = []
      const onErr = (e: Error) => errors.push(e.message)
      page.on('pageerror', onErr)
      await page.goto('/')
      await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: STORAGE, raw })
      await page.reload()
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Do site que você imagina')
      await go(page, '/prompt')
      await expect(page.getByTestId('master-prompt-text')).toContainText('Master Prompt')
      expect(errors, raw.slice(0, 20)).toEqual([])
      page.off('pageerror', onErr)
    }
  })
})

test.describe('REG-16 · Conteúdo não fica encoberto pela barra fixa inferior', () => {
  test('guiado 1440×900: "Prompt da identidade" e "CSS dos tokens" ficam acima do rodapé fixo', async ({ page }) => {
    test.fail(true, `REG-16: o painel fixo da prévia de identidade termina sob o rodapé do guiado (botões cobertos) ${VER}`)
    await seed(page, { guided: { skeletonApproved: true, step: 'identidade' } })
    await go(page, '/guiado/identidade')
    for (const name of ['Prompt da identidade', 'CSS dos tokens']) {
      for (const y of [600, 2500]) {
        await page.evaluate((y) => window.scrollTo(0, y), y)
        await page.waitForTimeout(250)
        const h = await hitInfo(page.getByRole('button', { name }))
        expect(h.own, `${name} em scrollY=${y}: coberto por ${h.cover}`).toBe(true)
      }
    }
  })

  for (const [label, use] of [['desktop 1440×900', {}], ['celular 360×800', MOBILE]] as const) {
    test.describe(label, () => {
      test.use(use)
      test('guiado: ações principais de cada etapa podem ser trazidas acima do rodapé', async ({ page }) => {
        test.setTimeout(120_000)
        await seed(page, {
          meta: { projectType: 'saas' },
          entry: { flow: 'login-only', loginId: 'classico-central', signupId: 'mesma-tela' },
          layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' },
          guided: { skeletonApproved: true },
        })
        const checks: [string, Locator][] = [
          ['/guiado/entrega', page.getByRole('button', { name: /Copiar Master Prompt/ }).first()],
          ['/guiado/entrega', page.getByRole('button', { name: /Baixar \.md/ }).first()],
          ['/guiado/desktop', page.locator('[data-testid^="desktop-option-"]').last()],
          ['/guiado/mobile', page.locator('[data-testid^="mobile-option-"]').last()],
          ['/guiado/revisao', page.getByRole('link', { name: /Alterar/ }).last()],
        ]
        for (const [route, target] of checks) {
          await go(page, route)
          await target.scrollIntoViewIfNeeded()
          await target.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
          await page.waitForTimeout(250)
          const h = await hitInfo(target)
          expect(h.own, `${route}: alvo coberto por ${h.cover}`).toBe(true)
        }
      })
    })
  }
})

/** Elementos de cartões que ultrapassam a borda do cartão (sem contêiner que os recorte). */
async function cardOverflow(page: Page) {
  return page.evaluate(() => {
    const out: string[] = []
    for (const card of Array.from(document.querySelectorAll<HTMLElement>('.ui-option, .nvs-card'))) {
      const cr = card.getBoundingClientRect()
      if (!cr.width) continue
      for (const el of Array.from(card.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) continue
        let p = el.parentElement, clipped = false
        while (p && p !== card) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) { clipped = true; break } p = p.parentElement }
        if (!clipped && (r.right > cr.right + 1 || r.left < cr.left - 1)) { out.push(`${card.dataset.testid ?? card.className}: ${el.tagName.toLowerCase()} excede o cartão`); break }
      }
    }
    return out
  })
}

test.describe('REG-17 · Sem overflow nas galerias de layouts', () => {
  for (const w of [320, 360, 1024, 1440]) {
    test(`${w} px: página sem rolagem lateral e conteúdo dos cartões dentro do cartão`, async ({ page }) => {
      test.setTimeout(120_000)
      await page.setViewportSize({ width: w, height: 900 })
      await freshStart(page)
      for (const r of ['/modulos/desktop', '/modulos/mobile', '/modulos/landing', '/modulos/login', '/modulos/cadastro', '/modulos/navegacao', '/modulos/cores']) {
        await go(page, r)
        expect(await horizontalOverflow(page), r).toBeLessThanOrEqual(0)
        expect(await cardOverflow(page), r).toEqual([])
      }
    })
  }

  for (const [label, vp] of [['tablet 768×1024', { width: 768, height: 1024 }], ['celular deitado 800×360', { width: 800, height: 360 }]] as const) {
    test.describe(label, () => {
      test.use({ viewport: vp, hasTouch: true })
      test('galeria do celular: coluna de miniaturas com largura útil e nenhuma miniatura coberta', async ({ page }) => {
        test.fail(true, `REG-17: no modo "medium" (620–939 px úteis) a coluna de miniaturas colapsa para 0 px e as 44 miniaturas transbordam sob o celular grande ${VER}`)
        await freshStart(page)
        await go(page, '/modulos/mobile')
        const listW = await page.locator('.lay-mob-list').evaluate((e) => e.getBoundingClientRect().width)
        expect(listW, 'largura da coluna de miniaturas').toBeGreaterThanOrEqual(128)
        const covered = await page.locator('[data-testid^="mobile-option-"] .ui-option__hit').evaluateAll((hits) =>
          hits.filter((h) => { h.scrollIntoView({ block: 'center' }); const r = h.getBoundingClientRect(); const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !x || !h.contains(x) }).length,
        )
        expect(covered, 'miniaturas cobertas por outro elemento').toBe(0)
      })
    })
  }
})

test.describe('REG-18 · Desktop e celular compatíveis', () => {
  test('Master Prompt define um único ponto de troca entre arquitetura mobile e desktop', async ({ page }) => {
    test.fail(true, `REG-18: o prompt manda trocar para desktop a partir de 768 px e, em outra seção, usar desktop compactado a partir de 600 px ${VER}`)
    await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    const prompt = await masterPrompt(page)
    const cuts = new Set<number>()
    for (const m of prompt.matchAll(/A partir de (\d+) px passa a valer a arquitetura desktop/g)) cuts.add(Number(m[1]))
    for (const m of prompt.matchAll(/Abaixo de (\d+) px vale a arquitetura mobile/g)) cuts.add(Number(m[1]))
    for (const m of prompt.matchAll(/Entre (\d+) e \d+ px \(tablet\), use a estrutura desktop/g)) cuts.add(Number(m[1]))
    expect([...cuts], 'larguras de troca citadas no prompt').toHaveLength(1)
  })

  test('as mesmas escolhas feitas no desktop e no celular geram o mesmo projeto e o mesmo prompt', async ({ browser }) => {
    test.setTimeout(150_000)
    const build = async (opts: Parameters<typeof browser.newContext>[0]) => {
      const ctx = await browser.newContext({ baseURL: 'http://127.0.0.1:4300', ...opts })
      const page = await ctx.newPage()
      await freshStart(page)
      await go(page, '/guiado/objetivo')
      await page.getByTestId('project-type-dashboard').click()
      await page.getByTestId('project-name').fill('Painel Solar')
      await go(page, '/guiado/entrada')
      await hitOf(page.getByTestId('entry-flow-login-only')).click()
      for (const [route, id] of [['/modulos/login', 'login-option-classico-central'], ['/modulos/desktop', 'desktop-option-sidebar-integral-classica'], ['/modulos/mobile', 'mobile-option-bottom-nav-classica'], ['/modulos/cores', 'palette-option-floresta']]) {
        await go(page, route)
        await page.getByTestId(id).scrollIntoViewIfNeeded()
        await hitOf(page.getByTestId(id)).click()
      }
      const p = await savedProject(page)
      const text = (await masterPrompt(page)).split('\n').filter((l) => !/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/.test(l)).join('\n')
      await ctx.close()
      return { entry: p.entry, layout: p.layout, identity: p.identity, meta: p.meta, text }
    }
    const desk = await build({ viewport: { width: 1440, height: 900 } })
    const mob = await build(MOBILE)
    expect(mob.entry).toEqual(desk.entry)
    expect(mob.layout).toEqual(desk.layout)
    expect(mob.identity).toEqual(desk.identity)
    expect(mob.text).toBe(desk.text)
  })

  test.describe('celular 360×800', () => {
    test.use(MOBILE)
    test('a prévia integrada abre no modo Celular quando a tela é de celular', async ({ page }) => {
      test.fail(true, `REG-18: no celular a prévia integrada abre em "Computador" (escala ~0,26, texto de 3–5 px) ${VER}`)
      await seed(page, { layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
      await go(page, '/modulos/preview')
      await expect(page.getByTestId('live-preview').getByTestId('phone-preview').first()).toBeVisible({ timeout: 3000 })
    })
  })
})

test.describe('REG-19 · Login e cadastro correspondem à seleção', () => {
  test('com "Apenas login" e sem cadastro escolhido, a prévia integrada não oferece a página "Cadastro"', async ({ page }) => {
    test.fail(true, `REG-19: a aba "Cadastro" aparece sempre que há login e mostra um "Crie sua conta" genérico sem cadastro escolhido ${VER}`)
    await seed(page, { entry: { flow: 'login-only', loginId: 'classico-central', signupId: null }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await go(page, '/modulos/preview')
    const pages = page.getByRole('group', { name: 'Página da prévia' })
    await expect(pages.getByRole('button', { name: 'Login' })).toBeVisible()
    await expect(pages.getByRole('button', { name: 'Cadastro' })).toHaveCount(0)
  })

  test('com cadastro escolhido, a página "Cadastro" mostra o cadastro selecionado (proteção)', async ({ page }) => {
    await seed(page, { entry: { flow: 'login-only', loginId: 'classico-central', signupId: 'etapas' }, layout: { desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' } })
    await go(page, '/modulos/preview')
    await page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Cadastro' }).click()
    await expect(page.getByTestId('live-preview')).toContainText('Conta')
    await expect(page.getByTestId('live-preview')).toContainText('Perfil')
  })
})

test.describe('REG-20 · Alterar um módulo não quebra outro', () => {
  test('trocar o fluxo para "Aplicação diretamente" tira o login antigo do prompt e da prévia', async ({ page }) => {
    test.fail(true, `REG-20: o login escolhido antes continua no Master Prompt e na prévia depois de mudar o fluxo para "sem login" ${VER}`)
    await freshStart(page)
    await go(page, '/modulos/login')
    await hitOf(page.locator('[data-testid^="login-option-"]').first()).click()
    await go(page, '/guiado/entrada')
    await hitOf(page.getByTestId('entry-flow-app-direct')).click()
    await expect.poll(async () => (await savedProject(page)).entry.flow).toBe('app-direct')
    const prompt = await masterPrompt(page)
    expect(prompt).toContain('Aplicação diretamente')
    expect(prompt).toMatch(/Login: nenhum/)
    await go(page, '/modulos/preview')
    await expect(page.getByRole('group', { name: 'Página da prévia' }).getByRole('button', { name: 'Login' })).toHaveCount(0)
  })

  test('mudanças em sequência em vários módulos mantêm as escolhas anteriores e todas as telas abrindo (proteção)', async ({ page }) => {
    test.setTimeout(120_000)
    const errors = trackErrors(page)
    await freshStart(page)
    await go(page, '/modulos/desktop')
    await hitOf(page.getByTestId('desktop-option-sidebar-integral-classica')).click()
    await go(page, '/modulos/mobile')
    await hitOf(page.getByTestId('mobile-option-bottom-nav-classica')).click()
    await go(page, '/modulos/cores')
    await hitOf(page.getByTestId('palette-option-floresta')).click()
    await go(page, '/modulos/navegacao')
    await hitOf(page.locator('[data-testid^="header-option-"]').nth(1)).click()
    await go(page, '/modulos/componentes')
    await page.getByTestId('add-component-soft-pill').click()
    await page.keyboard.press('Escape')
    await go(page, '/modulos/templates')
    await go(page, '/modulos/inspiracao')
    const p = await savedProject(page)
    expect(p.layout).toEqual({ desktopId: 'sidebar-integral-classica', mobileId: 'bottom-nav-classica' })
    expect(p.identity.paletteId).toBe('floresta')
    expect(p.navigation.header).not.toBeNull()
    expect(p.components).toHaveLength(1)
    for (const r of ['/modulos/preview', '/guiado/revisao', '/prompt', '/exportar', '/modulos/desktop', '/modulos/mobile']) {
      await go(page, r)
      await expect(page.locator('main#conteudo h1').first(), r).toBeVisible()
    }
    await go(page, '/modulos/desktop')
    await expect(hitOf(page.getByTestId('desktop-option-sidebar-integral-classica'))).toHaveAttribute('aria-pressed', 'true')
    expect(errors).toEqual([])
  })
})
