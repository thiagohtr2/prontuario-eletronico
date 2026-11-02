// Tratamento de erros e robustez do build congelado (auditoria fase 6).
// Cenários: chunk lazy que falha, localStorage corrompido / versão futura / esquema inválido,
// localStorage indisponível, cota estourada, importação de arquivos ruins, versão corrompida, XSS.
// Uso: node robustez.cjs
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { BASE, save } = require('./perf-lib.cjs')

const KEY = 'atelier-ui:studio:v1'
const OUTDIR = path.join(__dirname, '..', 'dados')
const SHOTS = path.join(OUTDIR, 'capturas')
fs.mkdirSync(SHOTS, { recursive: true })

async function fresh(browser, init) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, acceptDownloads: true })
  if (init) await ctx.addInitScript(init)
  const page = await ctx.newPage()
  const log = { pageerrors: [], console: [] }
  page.on('pageerror', (e) => log.pageerrors.push(String(e).slice(0, 300)))
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.console.push(`${m.type()}: ${m.text().slice(0, 300)}`) })
  return { ctx, page, log }
}

const shellAlive = (page) => page.evaluate(() => Boolean(document.querySelector('.shell-topbar')))
const bodyText = (page) => page.evaluate(() => document.body.innerText.slice(0, 400))
const stored = (page) => page.evaluate((k) => { try { return localStorage.getItem(k) } catch (e) { return 'ERRO: ' + e } }, KEY)

;(async () => {
  const browser = await chromium.launch()
  const R = {}

  // 1. Chunk lazy que falha ao carregar (rede instável / deploy novo com hash diferente)
  {
    const { ctx, page, log } = await fresh(browser)
    await page.route(/TemplatesPage-.*\.js$/, (r) => r.abort('failed'))
    await page.goto(BASE + '#/', { waitUntil: 'networkidle' })
    await page.evaluate(() => { location.hash = '#/modulos/templates' })
    await page.waitForTimeout(2500)
    await page.screenshot({ path: path.join(SHOTS, 'r1-chunk-falhou.png') })
    const alive = await shellAlive(page)
    // tenta navegar para outro módulo depois da falha
    await page.evaluate(() => { location.hash = '#/modulos/cores' })
    await page.waitForTimeout(1500)
    R.chunkLazyFalha = { shellVisivelAposFalha: alive, textoNaTela: (await bodyText(page)).slice(0, 250), shellVisivelAoNavegarDepois: await shellAlive(page), erros: log.pageerrors.slice(0, 3), console: log.console.slice(0, 3) }
    await ctx.close()
  }

  // 2. Estado salvo com JSON corrompido
  {
    const { ctx, page, log } = await fresh(browser, `if (!sessionStorage.getItem('seeded')) { localStorage.setItem('${KEY}', '{"state":{"project":{"schema":"atelier-ui/project", "meta":{"name":"Projeto Importante"'); sessionStorage.setItem('seeded','1') }`)
    await page.goto(BASE + '#/livre', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const before = await stored(page)
    await page.evaluate(() => { location.hash = '#/modulos/cores' })
    await page.waitForTimeout(1200)
    await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(3).click()
    await page.waitForTimeout(400)
    const after = await stored(page)
    R.localStorageJsonCorrompido = { appAbre: await shellAlive(page), avisoAoUsuario: /recuper|corromp|não foi possível carregar|backup/i.test(await bodyText(page)), conteudoOriginalPreservadoAposEdicao: after === before, erros: log.pageerrors, console: log.console.slice(0, 3) }
    await ctx.close()
  }

  // 3. Projeto salvo que não passa no Zod (ex.: valor removido numa versão futura do catálogo) + histórico
  {
    const proj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json'), 'utf8')).project
    const bad = { ...proj, identity: { ...proj.identity, geometry: { ...proj.identity.geometry, radius: 'xl' } } }
    const state = JSON.stringify({ state: { project: bad, history: [{ id: 'snap_ok', label: 'Versão boa', createdAt: proj.updatedAt, project: proj }] }, version: 1 })
    const { ctx, page, log } = await fresh(browser, `if (!sessionStorage.getItem('seeded')) { localStorage.setItem('${KEY}', ${JSON.stringify(state)}); sessionStorage.setItem('seeded','1') }`)
    await page.goto(BASE + '#/livre', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const txt = await bodyText(page)
    await page.evaluate(() => { location.hash = '#/modulos/cores' })
    await page.waitForTimeout(1200)
    await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(5).click()
    await page.waitForTimeout(400)
    const after = JSON.parse(await stored(page))
    R.projetoSalvoInvalido = { nomeMostrado: /Atlas Workspace/.test(txt), avisoAoUsuario: /recuper|inválid|não foi possível carregar/i.test(txt), nomeAposPrimeiraEdicao: after.state.project.meta.name, historicoMantido: after.state.history.length, erros: log.pageerrors, console: log.console.slice(0, 3) }
    await ctx.close()
  }

  // 4. Estado salvo com versão futura (sem função migrate)
  {
    const proj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json'), 'utf8')).project
    const state = JSON.stringify({ state: { project: proj, history: [] }, version: 2 })
    const { ctx, page, log } = await fresh(browser, `if (!sessionStorage.getItem('seeded')) { localStorage.setItem('${KEY}', ${JSON.stringify(state)}); sessionStorage.setItem('seeded','1') }`)
    await page.goto(BASE + '#/livre', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const txt = await bodyText(page)
    R.versaoDiferenteSemMigrate = { nomeMostrado: /Atlas Workspace/.test(txt), console: log.console.slice(0, 3), erros: log.pageerrors }
    await ctx.close()
  }

  // 5. localStorage indisponível (modo restrito / política do navegador)
  {
    const { ctx, page, log } = await fresh(browser, `Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('bloqueado', 'SecurityError') } })`)
    await page.goto(BASE + '#/modulos/cores', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    let clicked = true
    try { await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(2).click({ timeout: 5000 }) } catch { clicked = false }
    await page.waitForTimeout(300)
    R.localStorageIndisponivel = { appAbre: await shellAlive(page), selecaoFunciona: clicked && (await page.locator('[data-testid^="palette-option-"][data-selected="true"]').count()) > 0, avisoAoUsuario: /não será salv|não está salv|armazenamento/i.test(await bodyText(page)), console: [...new Set(log.console)].slice(0, 3), erros: log.pageerrors.slice(0, 3) }
    await ctx.close()
  }

  // 6. Cota do localStorage: capacidade medida e comportamento ao estourar
  {
    const { ctx, page, log } = await fresh(browser)
    await page.goto(BASE + '#/modulos/cores', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    const cap = await page.evaluate(() => {
      // mede quantos caracteres cabem (busca binária numa chave de teste)
      let lo = 0, hi = 12 * 1024 * 1024
      while (hi - lo > 1024) {
        const mid = Math.floor((lo + hi) / 2)
        try { localStorage.setItem('__cap', 'x'.repeat(mid)); lo = mid } catch { hi = mid }
      }
      localStorage.removeItem('__cap')
      const used = Object.keys(localStorage).reduce((a, k) => a + k.length + (localStorage.getItem(k) || '').length, 0)
      return { capacidadeLivreChars: lo, usadoChars: used }
    })
    // ocupa quase tudo, deixando ~1 KB
    await page.evaluate((n) => localStorage.setItem('__fill', 'x'.repeat(n)), Math.max(0, cap.capacidadeLivreChars - (cap.usadoChars + 1024)))
    const before = (await stored(page)) || ''
    const errsBefore = log.pageerrors.length
    await page.locator('[data-testid^="palette-option-"] .ui-option__hit').nth(7).click()
    await page.waitForTimeout(300)
    const selected = await page.locator('[data-testid^="palette-option-"][data-selected="true"]').getAttribute('data-testid')
    const after = (await stored(page)) || ''
    // salvar versão (histórico) sob cota cheia
    await page.evaluate(() => { location.hash = '#/projeto' })
    await page.waitForTimeout(1000)
    const txt = await bodyText(page)
    await page.screenshot({ path: path.join(SHOTS, 'r6-cota-estourada.png') })
    R.cotaLocalStorage = { ...cap, selecaoNaTela: selected, persistiuSelecao: after !== before, errosNovos: log.pageerrors.slice(errsBefore, errsBefore + 3), avisoAoUsuario: /espaço|cota|armazenamento cheio|não foi possível salvar/i.test(txt) }
    await ctx.close()
  }

  // 7. Importação: JSON inválido, tipos errados, ids inexistentes, XSS em textos
  {
    const { ctx, page, log } = await fresh(browser)
    await page.goto(BASE + '#/exportar', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const tmp = path.join(OUTDIR, 'tmp-import')
    fs.mkdirSync(tmp, { recursive: true })
    const base = JSON.parse(fs.readFileSync(path.join(__dirname, '../../fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json'), 'utf8')).project
    const files = {
      'corrompido.json': '{"schema": "atelier-ui/project", "meta": {',
      'tipos-errados.json': JSON.stringify({ ...base, identity: { ...base.identity, typography: { ...base.identity.typography, baseSize: 'grande' } } }),
      'ids-inexistentes.json': JSON.stringify({ ...base, meta: { ...base.meta, name: 'Ids Fantasma' }, layout: { desktopId: 'nao-existe', mobileId: 'tambem-nao' }, navigation: { header: { id: 'fantasma', variant: 0 }, sidebar: null } }),
      'xss.json': JSON.stringify({ ...base, meta: { ...base.meta, name: '<img src=x onerror="window.__xss=1">XSS', objective: '<script>window.__xss=2</script>' }, prompt: { ...base.prompt, notes: { 'layout.desktop': '<img src=x onerror="window.__xss=3">' } } }),
      'texto-gigante.json': JSON.stringify({ ...base, meta: { ...base.meta, description: 'a'.repeat(3_000_000) } }),
    }
    const out = {}
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(tmp, name), content)
      await page.setInputFiles('[data-testid="import-input"]', path.join(tmp, name))
      await page.waitForTimeout(900)
      const txt = await page.evaluate(() => document.querySelector('#conteudo').innerText)
      const errBox = txt.match(/Não foi possível importar:[\s\S]{0,200}/)
      const st = await stored(page)
      out[name] = { erroMostrado: errBox ? errBox[0].replace(/\s+/g, ' ').slice(0, 200) : null, nomeSalvo: st && st.startsWith('{') ? JSON.parse(st).state.project.meta.name.slice(0, 60) : st && st.slice(0, 80), tamanhoSalvoChars: st ? st.length : 0 }
    }
    // percorre páginas com o projeto "xss" para ver se algo executa
    await page.setInputFiles('[data-testid="import-input"]', path.join(tmp, 'xss.json'))
    await page.waitForTimeout(800)
    for (const r of ['livre', 'prompt', 'projeto', 'modulos/preview', 'exportar']) {
      await page.evaluate((x) => { location.hash = '#/' + x }, r)
      await page.waitForTimeout(900)
    }
    out.xssExecutou = await page.evaluate(() => window.__xss ?? null)
    // ficha HTML exportada com o projeto XSS
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-testid="export-html"]')])
    const html = fs.readFileSync(await dl.path(), 'utf8')
    out.fichaHtmlComTagNaoEscapada = /<img src=x onerror|<script>window.__xss/.test(html)
    const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('[data-testid="export-css"]')])
    const css = fs.readFileSync(await dl2.path(), 'utf8')
    out.cssCabecalho = css.split('\n').slice(0, 3).join(' | ').slice(0, 200)
    out.erros = log.pageerrors.slice(0, 3)
    R.importacao = out
    await ctx.close()
  }

  // 8. Versão corrompida no histórico, restaurada pela interface
  {
    const proj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json'), 'utf8')).project
    const state = JSON.stringify({ state: { project: proj, history: [{ id: 'snap_bad', label: 'Versão de formato antigo', createdAt: proj.updatedAt, project: { schema: 'atelier-ui/project', version: 1, meta: { name: 'Antiga' } } }] }, version: 1 })
    const { ctx, page, log } = await fresh(browser, `if (!sessionStorage.getItem('seeded')) { localStorage.setItem('${KEY}', ${JSON.stringify(state)}); sessionStorage.setItem('seeded','1') }`)
    await page.goto(BASE + '#/projeto', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    let restored = false
    try {
      await page.getByRole('button', { name: /Restaurar/ }).first().click({ timeout: 4000 })
      await page.waitForTimeout(300)
      const dialogBtn = page.locator('.ui-modal button, [role="dialog"] button').filter({ hasText: /Restaurar/ })
      if (await dialogBtn.count()) await dialogBtn.last().click()
      restored = true
    } catch {}
    await page.waitForTimeout(1200)
    await page.screenshot({ path: path.join(SHOTS, 'r8-restaurar-versao-corrompida.png') })
    const alive = await shellAlive(page)
    const txt = await bodyText(page)
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    const afterReload = await bodyText(page)
    R.restaurarVersaoCorrompida = { cliqueRestaurar: restored, shellVivo: alive, textoNaTela: txt.slice(0, 200), aposRecarregar: afterReload.slice(0, 160), projetoAposRecarregar: (JSON.parse((await stored(page)) || '{}').state || {}).project?.meta?.name, erros: log.pageerrors.slice(0, 3) }
    await ctx.close()
  }

  await browser.close()
  save(path.join(OUTDIR, 'robustez.json'), R)
  console.log(JSON.stringify(R, null, 2))
})()
