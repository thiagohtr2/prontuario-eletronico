import { renderToStaticMarkup } from 'react-dom/server'
import { htmlDocument } from '@/core/download'
import { TemplateRender } from './TemplateRender'
import { templateCssVariables } from './exports'
import { minimalOverrides, resolveTemplateTheme, type TemplateOverrides } from './theme'
import type { TemplateModel } from './types'

/**
 * HTML demonstrativo autônomo: as versões desktop e celular são renderizadas em uma única
 * árvore (ids de SVG únicos) e alternadas por media query, então o arquivo abre sozinho e
 * se adapta à largura da janela.
 */
export function buildTemplateHtml(t: TemplateModel, overrides: TemplateOverrides = {}): string {
  const theme = resolveTemplateTheme(t, minimalOverrides(t, overrides))
  const body = renderToStaticMarkup(
    <main>
      <div className="tpl-desktop">
        <TemplateRender template={t} theme={theme} device="desktop" />
      </div>
      <div className="tpl-mobile">
        <TemplateRender template={t} theme={theme} device="mobile" />
      </div>
    </main>,
  )
  const css = `${templateCssVariables(theme)}
body{background:${theme.bg};color:${theme.text};font-family:${theme.body};-webkit-font-smoothing:antialiased}
h1,h2,h3,p,figure,blockquote,ol,ul,pre{margin:0}
.tpl-mobile{display:none}
@media (max-width: 860px){.tpl-desktop{display:none}.tpl-mobile{display:block}}`
  return htmlDocument(`${t.name} — ${t.brand} (demonstração)`, `<!-- Template “${t.name}” · HTML demonstrativo gerado pelo Atelier UI. Conteúdo fictício. -->\n${body}`, css)
}
