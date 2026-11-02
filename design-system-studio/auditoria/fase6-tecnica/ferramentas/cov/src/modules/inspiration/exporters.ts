import { contrast, isDark, withAlpha } from '@/core/color'
import type { InspirationChoice } from '@/core/project'
import { fontName, fontStack } from '@/core/tokens'
import { cleanOverrides, paletteOf, resolvePalette } from './palette'
import type { InspirationSite } from './types'

const GENERATOR = 'Atelier UI — Inspiration Gallery'

/** CSS de referência: variáveis da paleta escolhida (com ajustes) + fontes + regras base. */
export function buildReferenceCss(site: InspirationSite, choice: Pick<InspirationChoice, 'paletteId' | 'overrides'>): string {
  const base = paletteOf(site, choice.paletteId)
  const overrides = cleanOverrides(choice.overrides ?? {})
  const p = resolvePalette(site, base.id, overrides)
  const adjusted = Object.keys(overrides).length ? ` (ajustada: ${Object.entries(overrides).map(([k, v]) => `${k} ${v}`).join(', ')})` : ''
  return `/*
 * ${site.brand} — CSS de referência
 * Gerado por ${GENERATOR}. Paleta: ${base.name}${adjusted}.
 * Composição: ${site.composition}.
 * Referência de identidade e composição — não copie marcas, textos ou imagens de terceiros.
 */
:root {
  --color-bg: ${p.bg};
  --color-surface: ${p.surface};
  --color-text: ${p.text};
  --color-text-muted: ${p.muted};
  --color-accent: ${p.accent};
  --color-on-accent: ${p.onAccent};
  --color-secondary: ${p.secondary};
  --color-border: ${withAlpha(p.text, 0.14)};
  --color-border-strong: ${withAlpha(p.text, 0.28)};
  --color-inverse-bg: ${p.text};
  --color-inverse-text: ${p.bg};
  --font-heading: ${fontStack(site.headingFont)};
  --font-body: ${fontStack(site.bodyFont)};
  --content-max: 1200px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-space: clamp(48px, 8vw, 112px);
  color-scheme: ${isDark(p.bg) ? 'dark' : 'light'};
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.55;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.1; margin: 0; }
h1 { font-size: clamp(2.5rem, 7vw, 6rem); letter-spacing: -0.03em; }
h2 { font-size: clamp(1.9rem, 4.2vw, 3.25rem); letter-spacing: -0.02em; }
p { margin: 0; }
a { color: var(--color-accent); }
img, svg, video { max-width: 100%; height: auto; }

.container { width: 100%; max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); }
.section { padding: var(--section-space) 0; }
.muted { color: var(--color-text-muted); }

.button-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 24px; border: 0; border-radius: 999px;
  background: var(--color-accent); color: var(--color-on-accent);
  font: 600 15px/1 var(--font-body); cursor: pointer;
}
.button-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 24px; border-radius: 999px;
  border: 1px solid var(--color-border-strong); background: transparent; color: var(--color-text);
  font: 600 15px/1 var(--font-body); cursor: pointer;
}
.button-primary:focus-visible, .button-secondary:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; padding: 24px; }
.band-inverse { background: var(--color-inverse-bg); color: var(--color-inverse-text); }
.band-accent { background: var(--color-accent); color: var(--color-on-accent); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
/* Contraste texto/fundo: ${contrast(p.text, p.bg).toFixed(2)}:1 · destaque/texto sobre destaque: ${contrast(p.accent, p.onAccent).toFixed(2)}:1 */
`
}

/** Especificação JSON: conceito + paleta escolhida + ajustes. */
export function buildSiteJson(site: InspirationSite, choice: Pick<InspirationChoice, 'paletteId' | 'overrides'>) {
  const base = paletteOf(site, choice.paletteId)
  const overrides = cleanOverrides(choice.overrides ?? {})
  const final = resolvePalette(site, base.id, overrides)
  return {
    gerador: GENERATOR,
    tipo: 'inspiracao',
    versao: 1,
    geradoEm: new Date().toISOString(),
    conceito: {
      id: site.id,
      marca: site.brand,
      segmento: site.segment,
      descricao: site.description,
      composicao: site.composition,
      secoes: site.sections,
      tipografia: {
        titulos: { id: site.headingFont, nome: fontName(site.headingFont), stack: fontStack(site.headingFont) },
        textos: { id: site.bodyFont, nome: fontName(site.bodyFont), stack: fontStack(site.bodyFont) },
      },
      spec: site.spec,
    },
    paleta: {
      id: base.id,
      nome: base.name,
      proposta: { ...base },
      final: { ...final },
    },
    ajustes: overrides,
    observacao: 'Referência de identidade e composição. A marca, os textos e as ilustrações são fictícios e não devem ser copiados literalmente.',
  }
}
