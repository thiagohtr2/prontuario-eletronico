// XSS com textos do usuário (importação) + efeito de uma importação grande sobre a seguinte.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const { BASE, save } = require('./perf-lib.cjs')
const TMP = path.join(__dirname, '..', 'dados', 'tmp-import')
;(async () => {
  const browser = await chromium.launch()
  const R = {}
  {
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 860 } })
    const page = await ctx.newPage()
    const errs = []
    page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)))
    page.on('dialog', (d) => { errs.push('DIALOG ' + d.message()); d.dismiss() })
    await page.goto(BASE + '#/exportar', { waitUntil: 'networkidle' })
    await page.setInputFiles('[data-testid="import-input"]', path.join(TMP, 'xss.json'))
    await page.waitForTimeout(800)
    R.nomeImportado = await page.evaluate(() => JSON.parse(localStorage.getItem('atelier-ui:studio:v1')).state.project.meta.name)
    for (const r of ['livre', 'modulos/objetivo', 'guiado/objetivo', 'guiado/revisao', 'prompt', 'projeto', 'modulos/preview', 'modulos/desktop', 'exportar']) {
      await page.evaluate((x) => { location.hash = '#/' + x }, r)
      await page.waitForTimeout(900)
    }
    R.xssExecutou = await page.evaluate(() => window.__xss ?? null)
    R.imgInjetadaNoDom = await page.evaluate(() => document.querySelectorAll('img[src="x"]').length)
    const grab = async (id) => { const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`[data-testid="${id}"]`)]); return fs.readFileSync(await dl.path(), 'utf8') }
    const html = await grab('export-html')
    const css = await grab('export-css')
    const md = await grab('export-master')
    R.fichaHtmlTagsNaoEscapadas = /<img src=x onerror|<script>window.__xss/.test(html)
    R.fichaHtmlTitulo = (html.match(/<title>[^<]*/) || [''])[0]
    R.cssCabecalho = css.split('\n').slice(0, 2).join(' | ')
    R.mdLinhaNome = md.split('\n')[0]
    R.mdNotaDesktop = (md.match(/Observação do usuário:[^\n]*/) || [null])[0]
    R.erros = errs
    // abre a ficha exportada num navegador e verifica se algo executa
    const p2 = await ctx.newPage()
    await p2.setContent(html)
    await p2.waitForTimeout(500)
    R.fichaAbertaExecutou = await p2.evaluate(() => window.__xss ?? null)
    await ctx.close()
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } })
    const page = await ctx.newPage()
    await page.goto(BASE + '#/exportar', { waitUntil: 'networkidle' })
    await page.setInputFiles('[data-testid="import-input"]', path.join(TMP, 'texto-gigante.json'))
    await page.waitForTimeout(1200)
    const t1 = await page.evaluate(() => document.querySelector('#conteudo').innerText.match(/Não foi possível importar:[\s\S]{0,200}/)?.[0] ?? null)
    await page.setInputFiles('[data-testid="import-input"]', path.join(TMP, 'ids-inexistentes.json'))
    await page.waitForTimeout(1200)
    const t2 = await page.evaluate(() => document.querySelector('#conteudo').innerText.match(/Não foi possível importar:[\s\S]{0,300}/)?.[0] ?? null)
    const st = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('atelier-ui:studio:v1')); return { nome: s.state.project.meta.name, versoes: s.state.history.length, chars: JSON.stringify(s).length } })
    R.importacaoGrandeSeguidaDeOutra = { erroNaPrimeira: t1, erroNaSegunda: t2 && t2.replace(/\s+/g, ' '), estadoGravado: st }
    await ctx.close()
  }
  await browser.close()
  save(path.join(__dirname, '..', 'dados', 'xss-import.json'), R)
  console.log(JSON.stringify(R, null, 2))
})()
