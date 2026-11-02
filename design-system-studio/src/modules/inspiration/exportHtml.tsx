import { renderToStaticMarkup } from 'react-dom/server'
import { htmlDocument } from '@/core/download'
import { SITE_BASE_CSS } from './sites/base'
import { siteComponent } from './sites/registry'
import type { InspirationSite, SitePalette } from './types'

/**
 * HTML demonstrativo autônomo: o site desenhado no desktop e no celular, alternados por
 * media query. Abre direto no navegador, sem dependências (as fontes têm fallbacks do sistema).
 */
export function buildDemoHtml(site: InspirationSite, palette: SitePalette): string {
  const Site = siteComponent(site.id)
  if (!Site) throw new Error(`Site sem renderizador: ${site.id}`)
  const desktop = renderToStaticMarkup(<Site palette={palette} device="desktop" />)
  const mobile = renderToStaticMarkup(<Site palette={palette} device="mobile" />)
  const css = `
body{background:${palette.bg};color:${palette.text}}
${SITE_BASE_CSS}
.ia-demo-mobile{display:none}
@media (max-width: 760px){.ia-demo-desktop{display:none}.ia-demo-mobile{display:block}}
`
  const body = `<!-- ${site.brand}: conceito fictício gerado pelo Atelier UI (Inspiration Gallery). Paleta: ${palette.name}. Referência de identidade e composição; não use a marca nem os textos como conteúdo real. -->
<div class="ia-demo-desktop">${desktop}</div>
<div class="ia-demo-mobile">${mobile}</div>`
  return htmlDocument(`${site.brand} — ${site.segment} (demonstração)`, body, css)
}
