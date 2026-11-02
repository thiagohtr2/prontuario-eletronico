// REG-03: controles que mudam o estado mas não a prévia (tipografia/formas da identidade e densidade da tabela).
const { open, go, saved, shot, sleep } = require('./lib.cjs')

async function snapshot(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-testid="identity-preview"]')
    const out = []
    for (const el of [root, ...root.querySelectorAll('*')]) {
      const cs = getComputedStyle(el)
      out.push([cs.fontSize, cs.fontWeight, cs.fontFamily, cs.borderRadius, cs.boxShadow, cs.padding, cs.gap, cs.borderWidth, cs.fill, el.getAttribute('fill'), el.getAttribute('stroke-width')].join('|'))
    }
    return out
  })
}
async function bodySizes(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-testid="identity-preview"]')
    const sizes = {}
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n
    while ((n = w.nextNode())) {
      const t = n.textContent.trim()
      if (!t) continue
      const fs = getComputedStyle(n.parentElement).fontSize
      sizes[t] = fs
    }
    return sizes
  })
}

;(async () => {
  const { browser, page } = await open('desktop')
  await go(page, '/modulos/cores')
  await page.getByRole('tab', { name: 'Tipografia' }).click()
  const base0 = await bodySizes(page)
  const controls = [
    ['Tamanho base', '18 px'],
    ['Peso dos títulos', 'Extra'],
    ['Peso dos textos', 'Médio'],
  ]
  for (const [group, opt] of controls) {
    const s0 = await snapshot(page)
    await page.getByRole('group', { name: group }).getByRole('button', { name: opt }).click().catch(async () => {
      await page.getByRole('radiogroup', { name: group }).getByRole('radio', { name: opt }).click()
    })
    await sleep(250)
    const s1 = await snapshot(page)
    const diff = s0.filter((x, i) => x !== s1[i]).length
    console.log(`REG-03 tipografia "${group}" → ${opt}: ${diff} de ${s0.length} elementos da prévia mudaram`)
  }
  const base1 = await bodySizes(page)
  const keys = ['Visão geral', 'Ana Souza', 'Texto secundário com', 'Primário', 'Placeholder…', 'Pedidos recentes', 'Início', 'Alterações salvas']
  console.log('REG-03 tamanho base 15 → 18 px:', keys.map((k) => `${k}: ${base0[k]} → ${base1[k]}`).join(' ; '))
  console.log('saved typography', JSON.stringify((await saved(page)).identity.typography))
  await shot(page, 'reg03-identidade-base-18px', { fullPage: false })

  // fontes
  for (const role of ['Fonte dos títulos', 'Fonte dos textos']) {
    const s0 = await snapshot(page)
    await page.getByRole('group', { name: role }).getByRole('button', { name: /Fraunces/ }).click()
    await sleep(250)
    const s1 = await snapshot(page)
    console.log(`REG-03 ${role} → Fraunces: ${s0.filter((x, i) => x !== s1[i]).length} elementos mudaram`)
  }

  await page.getByRole('tab', { name: 'Formas e superfícies' }).click()
  const shapes = [
    ['Cantos', /Grandes|Pílula|Retos/],
    ['Superfícies', /Elevada/],
    ['Sombras', /Forte|Média/],
    ['Bordas', /2 px/],
    ['Densidade', /Compacta|Espaçosa/],
    ['Estilo dos ícones', /Preenchido/],
    ['Estilo dos ícones', /Duotone/],
  ]
  for (const [section, re] of shapes) {
    const s0 = await snapshot(page)
    const sec = page.locator('section, .ui-section').filter({ has: page.getByRole('heading', { name: section, exact: true }) }).first()
    const btn = sec.getByRole('button', { name: re }).first()
    const label = (await btn.textContent()).trim()
    await btn.click()
    await sleep(250)
    const s1 = await snapshot(page)
    console.log(`REG-03 forma "${section}" → ${label}: ${s0.filter((x, i) => x !== s1[i]).length} elementos mudaram`)
  }
  console.log('saved geometry', JSON.stringify((await saved(page)).identity.geometry))
  await browser.close()
})()
