#!/usr/bin/env node
/**
 * Gera docs/qa/responsividade.md a partir de qa-output/results.json
 * (produzido por scripts/qa/responsive.cjs) e, se existir, do resultado do
 * teste de teclado (qa-output/keyboard.txt).
 */
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '../..')
const OUT = process.env.QA_OUT ?? path.join(ROOT, 'qa-output')
const { results, consoleErrors } = JSON.parse(fs.readFileSync(path.join(OUT, 'results.json'), 'utf8'))
const keyboard = fs.existsSync(path.join(OUT, 'keyboard.txt')) ? fs.readFileSync(path.join(OUT, 'keyboard.txt'), 'utf8').trim() : null

const TYPES = [
  ['overflow-documento', 'Overflow horizontal'],
  ['fora-do-viewport', 'Fora do viewport'],
  ['alvo-pequeno', 'Alvo < 44 px'],
  ['gap-menor-que-8', 'Gap < 8 px'],
  ['sobreposicao', 'Sobreposição'],
  ['coberto-pelo-dock', 'Coberto pelo dock'],
  ['rotulo-transborda', 'Rótulo transborda'],
  ['acao-falhou', 'Estado não reproduzido'],
]

const viewports = [...new Map(results.map((r) => [r.viewport, r])).values()]
const pages = [...new Map(results.map((r) => [r.page, r])).values()]
const count = (rows, type) => rows.reduce((total, r) => total + r.issues.filter((i) => i.type === type).length, 0)

const lines = []
lines.push('# Relatório de responsividade')
lines.push('')
lines.push(`Gerado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' })} por \`scripts/qa/responsive.cjs\`,`)
lines.push('no Chromium (Playwright), com o Supabase simulado e dados fictícios propositalmente longos')
lines.push('(nomes, e-mails, endereços e textos clínicos extensos).')
lines.push('')
const failing = results.filter((r) => r.issues.length > 0)
lines.push(`**${results.length} combinações de tela × tamanho medidas — ${failing.length} com problemas.**`)
lines.push('')
lines.push('## Resultado por tamanho de tela')
lines.push('')
lines.push(`| Viewport | Telas | ${TYPES.map(([, label]) => label).join(' | ')} | Texto truncado* | Resultado |`)
lines.push(`| --- | --- | ${TYPES.map(() => '---').join(' | ')} | --- | --- |`)
for (const viewport of viewports) {
  const rows = results.filter((r) => r.viewport === viewport.viewport)
  const truncated = rows.reduce((total, r) => total + r.truncated.length, 0)
  const ok = rows.every((r) => r.issues.length === 0)
  lines.push(`| ${viewport.viewport} | ${rows.length} | ${TYPES.map(([type]) => count(rows, type)).join(' | ')} | ${truncated} | ${ok ? '✅ aprovado' : '❌ falhou'} |`)
}
lines.push('')
lines.push('\\* Texto truncado é listado para revisão, não reprova: só é aceito em conteúdo secundário cujo')
lines.push('valor completo aparece em outro lugar (ver abaixo).')
lines.push('')
lines.push('## Resultado por tela e estado')
lines.push('')
lines.push('| Tela / estado | Rota | Tamanhos | Problemas |')
lines.push('| --- | --- | --- | --- |')
for (const spec of pages) {
  const rows = results.filter((r) => r.page === spec.page)
  const issues = rows.reduce((total, r) => total + r.issues.length, 0)
  lines.push(`| ${spec.page} | \`${spec.path}\` | ${rows.length} | ${issues === 0 ? '0 ✅' : `${issues} ❌`} |`)
}
lines.push('')

if (failing.length) {
  lines.push('## Problemas encontrados')
  lines.push('')
  for (const r of failing) {
    lines.push(`- **${r.page} @ ${r.viewport}**`)
    for (const issue of r.issues) lines.push(`  - ${issue.type}: ${issue.detail}`)
  }
  lines.push('')
}

const truncatedSet = new Map()
for (const r of results) for (const t of r.truncated) truncatedSet.set(t, (truncatedSet.get(t) ?? []).concat(r.viewport))
lines.push('## Texto truncado')
lines.push('')
if (truncatedSet.size === 0) {
  lines.push('Nenhum.')
} else {
  for (const [text, where] of truncatedSet) lines.push(`- ${text} — em ${[...new Set(where)].join(', ')}`)
}
lines.push('')

lines.push('## O que é medido')
lines.push('')
lines.push('- **Overflow horizontal:** `document.documentElement.scrollWidth > clientWidth` (tolerância de 1 px).')
lines.push('- **Fora do viewport:** qualquer elemento visível que ultrapasse as bordas e não esteja dentro de um')
lines.push('  container com rolagem própria.')
lines.push('- **Alvo < 44 px:** links, botões, campos, abas e itens de menu visíveis com largura ou altura')
lines.push('  menor que 44 px. Links dentro de frases são listados à parte (exceção do WCAG 2.5.8).')
lines.push('- **Gap < 8 px / sobreposição:** distância real entre caixas (`getBoundingClientRect`) de controles')
lines.push('  distintos na mesma camada, recortadas pelos containers roláveis. Partes de um mesmo controle')
lines.push('  (opções do segmented control, botão de mostrar senha dentro do campo) não contam.')
lines.push('- **Rótulo transborda:** rótulos que não podem quebrar (navegação) e não cabem no próprio controle.')
lines.push('- **Coberto pelo dock:** no fim da rolagem, o último conteúdo da página precisa terminar acima do dock.')
lines.push('- Com um diálogo aberto, só o conteúdo do diálogo é medido (o resto fica sob o overlay).')
lines.push('')

lines.push('## Teclado')
lines.push('')
lines.push(keyboard ? '```\n' + keyboard + '\n```' : 'Não executado nesta rodada.')
lines.push('')

const unexpectedErrors = [...new Set(consoleErrors.filter((e) => !e.includes('entrar-erro-servidor')))]
lines.push('## Erros de console')
lines.push('')
lines.push(
  unexpectedErrors.length === 0
    ? 'Nenhum erro inesperado. (O estado "entrar-erro-servidor" registra o 400 que o teste provoca de propósito com a senha errada.)'
    : unexpectedErrors.map((e) => `- ${e}`).join('\n'),
)
lines.push('')

lines.push('## Não testado nesta rodada')
lines.push('')
lines.push('- Aparelhos reais (iPhone/Safari e Android/Chrome) e os motores WebKit e Gecko: só o Chromium foi usado.')
lines.push('- Teclado virtual real: o dock some quando a área visível encolhe (`visualViewport`), mas isso não foi')
lines.push('  exercitado em aparelho.')
lines.push('- Leitores de tela (VoiceOver, TalkBack, NVDA): a semântica (landmarks, rótulos, `aria-*`) foi revisada no')
lines.push('  código, não com o leitor ligado.')
lines.push('- Zoom do navegador em si: o zoom de 200% foi emulado como viewport de 640 px (1280 ÷ 2) e o de 400%')
lines.push('  pela largura de 320 px; aumento só de texto (sem zoom da página) não foi testado.')
lines.push('- Fluxos reais do Supabase: envio de e-mails de confirmação e redefinição, limites de tentativas e')
lines.push('  sessões reais. As respostas foram simuladas.')
lines.push('')

fs.mkdirSync(path.join(ROOT, 'docs/qa'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'docs/qa/responsividade.md'), lines.join('\n'))
console.log('docs/qa/responsividade.md gerado.')
