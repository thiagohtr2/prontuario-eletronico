import { fontName, RADIUS_VALUES } from '@/core/tokens'
import { categoryName } from './catalog'
import { SECTION_LIBRARY, sectionLabel } from './sections'
import { describeOverrides, minimalOverrides, resolveTemplateTheme, type TemplateOverrides, type TplTheme } from './theme'
import type { TemplateModel } from './types'

/** Variáveis CSS do template (cores, fontes, cantos e espaçamentos). */
export function templateCssVariables(theme: TplTheme, selector = ':root'): string {
  return `${selector} {
  --color-primary: ${theme.primary};
  --color-on-primary: ${theme.onPrimary};
  --color-primary-soft: ${theme.primarySoft};
  --color-bg: ${theme.bg};
  --color-surface: ${theme.surface};
  --color-text: ${theme.text};
  --color-muted: ${theme.muted};
  --color-border: ${theme.border};
  --font-heading: ${theme.heading};
  --font-body: ${theme.body};
  --font-mono: ${theme.mono};
  --radius-sm: ${theme.rSm}px;
  --radius-md: ${theme.rMd}px;
  --radius-lg: ${theme.rLg}px;
  --container: 1120px;
  --gutter: 48px;
  --section-space: 88px;
  color-scheme: ${theme.dark ? 'dark' : 'light'};
}`
}

/** CSS de referência: variáveis + regras base + lista das seções na ordem do template. */
export function buildTemplateCss(t: TemplateModel, overrides: TemplateOverrides = {}, sections: string[] = []): string {
  const clean = minimalOverrides(t, overrides)
  const theme = resolveTemplateTheme(t, clean)
  const changes = describeOverrides(t, clean)
  return `/*
 * Template “${t.name}” (${t.brand}) — CSS de referência gerado pelo Atelier UI.
 * Categoria: ${categoryName(t.category)}.
 * Fontes: ${fontName(theme.headingId)} (títulos) e ${fontName(theme.bodyId)} (textos). Cantos: ${RADIUS_VALUES[theme.radius].label}.
${changes.length ? changes.map((c) => ` * ${c}`).join('\n') + '\n' : ''} */
${templateCssVariables(theme)}

@media (max-width: 599px) {
  :root { --gutter: 20px; --section-space: 56px; }
}

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  overflow-wrap: break-word;
}

h1, h2, h3 { margin: 0; font-family: var(--font-heading); line-height: 1.12; letter-spacing: -0.02em; text-wrap: balance; }
h1 { font-size: clamp(2.25rem, 1.4rem + 3.6vw, 3.75rem); }
h2 { font-size: clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem); }
h3 { font-size: 1.2rem; line-height: 1.3; }
p { margin: 0; }
a { color: var(--color-primary); }
img, svg, video { max-width: 100%; height: auto; display: block; }
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

.container { width: 100%; max-width: calc(var(--container) + var(--gutter) * 2); margin: 0 auto; padding: 0 var(--gutter); }
.section { padding: var(--section-space) 0; }
.section--surface { background: var(--color-surface); }
.section--primary { background: var(--color-primary); color: var(--color-on-primary); }
.muted { color: var(--color-muted); }
.eyebrow { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-primary); }

.grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); }
.split { display: grid; gap: 64px; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: center; }
@media (max-width: 899px) { .split { grid-template-columns: minmax(0, 1fr); gap: 32px; } }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 22px;
  border-radius: var(--radius-md); border: 1.5px solid transparent;
  font: inherit; font-weight: 600; text-decoration: none; cursor: pointer;
  transition: background-color .15s ease, border-color .15s ease, color .15s ease;
}
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { filter: brightness(0.94); }
.btn-secondary { background: transparent; color: var(--color-text); border-color: var(--color-border); }
.btn-secondary:hover { border-color: var(--color-text); }
@media (max-width: 599px) { .btn-row { display: grid; } .btn-row .btn { width: 100%; } }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 28px; }
.badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: var(--radius-sm); background: var(--color-primary-soft); color: var(--color-text); font-size: 0.8rem; font-weight: 600; }

input, select, textarea {
  font: inherit; min-height: 48px; padding: 0 16px; width: 100%;
  border: 1.5px solid var(--color-border); border-radius: var(--radius-md);
  background: var(--color-bg); color: var(--color-text);
}
textarea { padding: 12px 16px; min-height: 120px; }
@media (max-width: 599px) { input, select, textarea { font-size: 16px; } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}

/* Seções do template, na ordem (★ = parte marcada pelo usuário):
${t.sections
  .map((s, i) => ` * ${sections.includes(s.id) ? '★' : ' '} ${i + 1}. .section-${s.id} — ${s.name} (${sectionLabel(s)}${s.variant ? ` · ${s.variant}` : ''})`)
  .join('\n')}
 */
`
}

/** Especificação JSON do template: modelo, personalizações, tema final, seções e spec. */
export function buildTemplateSpec(t: TemplateModel, overrides: TemplateOverrides = {}, sections: string[] = []) {
  const clean = minimalOverrides(t, overrides)
  const theme = resolveTemplateTheme(t, clean)
  const selected = t.sections.filter((s) => sections.includes(s.id)).map((s) => s.id)
  return {
    schema: 'atelier-ui/template',
    version: 1,
    generatedAt: new Date().toISOString(),
    template: {
      id: t.id,
      name: t.name,
      brand: t.brand,
      category: { id: t.category, name: categoryName(t.category) },
      description: t.description,
      layout: t.layout ?? 'stack',
    },
    defaults: {
      colors: t.colors,
      headingFont: t.headingFont,
      bodyFont: t.bodyFont,
      radius: t.radius,
    },
    overrides: clean,
    final: {
      colors: {
        primary: theme.primary,
        onPrimary: theme.onPrimary,
        primarySoft: theme.primarySoft,
        bg: theme.bg,
        surface: theme.surface,
        text: theme.text,
        muted: theme.muted,
        border: theme.border,
        mode: theme.dark ? 'dark' : 'light',
      },
      fonts: {
        heading: { id: theme.headingId, name: fontName(theme.headingId), stack: theme.heading },
        body: { id: theme.bodyId, name: fontName(theme.bodyId), stack: theme.body },
      },
      radius: { scale: theme.radius, label: RADIUS_VALUES[theme.radius].label, sm: theme.rSm, md: theme.rMd, lg: theme.rLg },
    },
    selectedSections: selected,
    sections: t.sections.map((s, i) => ({
      order: i + 1,
      id: s.id,
      name: s.name,
      kind: s.kind,
      kindLabel: sectionLabel(s),
      variant: s.variant ?? null,
      description: s.description,
      selected: selected.includes(s.id),
      layout: SECTION_LIBRARY[s.kind].layout(s),
      mobile: SECTION_LIBRARY[s.kind].mobile(s),
    })),
    spec: t.spec,
  }
}

export const templateFileBase = (t: TemplateModel) => `template-${t.id}`
