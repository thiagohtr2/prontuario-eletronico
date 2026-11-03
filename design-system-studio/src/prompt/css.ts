import type { Project } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { TOKEN_KEYS } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Converte um tema resolvido em variáveis CSS (`--color-*`, `--radius-*`, `--font-*`...). */
export function themeToCssVariables(theme: ResolvedTheme, selector = ':root'): string {
  const { tokens, metrics, typography } = theme
  const lines = [
    ...TOKEN_KEYS.map((k) => `  --color-${kebab(k)}: ${tokens[k]};`),
    `  --gradient-brand: ${tokens.gradientEnabled ? `linear-gradient(135deg, ${tokens.gradientFrom}, ${tokens.gradientTo})` : 'none'};`,
    `  --font-heading: ${metrics.headingFont};`,
    `  --font-body: ${metrics.bodyFont};`,
    `  --font-size-base: ${typography.baseSize}px;`,
    `  --font-weight-heading: ${typography.headingWeight};`,
    `  --font-weight-body: ${typography.bodyWeight};`,
    `  --radius-sm: ${metrics.radiusSm}px;`,
    `  --radius-md: ${metrics.radiusMd}px;`,
    `  --radius-lg: ${metrics.radiusLg}px;`,
    `  --border-width: ${metrics.borderWidth}px;`,
    `  --shadow-surface: ${metrics.shadow};`,
    // Escala de espaço em múltiplos de 4 (a mesma do prompt); a densidade só ajusta o respiro interno.
    ...[4, 8, 12, 16, 20, 24, 32, 40].map((n, i) => `  --space-${i + 1}: ${n}px;`),
    `  --density-unit: ${metrics.spacing}px;`,
    '  --control-h-sm: 32px;',
    '  --control-h-md: 40px;',
    '  --control-h-lg: 48px;',
    // Breakpoints únicos (os mesmos do Master Prompt). Variáveis não funcionam em @media: use os valores.
    '  --bp-tablet: 768px;',
    '  --bp-desktop: 1024px;',
    '  --bp-wide: 1440px;',
    `  color-scheme: ${tokens.mode};`,
  ]
  return `${selector} {\n${lines.join('\n')}\n}`
}

/** CSS de referência do projeto: tokens + regras base de acessibilidade e responsividade. */
export function buildProjectCss(project: Project): string {
  const theme = projectTheme(project)
  return `/*
 * ${project.meta.name || 'Projeto'} — CSS de referência gerado pelo Atelier UI.
 * Tokens da identidade global. Use estas variáveis em todos os componentes.
 */
${themeToCssVariables(theme)}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-body);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

h1, h2, h3, h4 { font-family: var(--font-heading); font-weight: var(--font-weight-heading); line-height: 1.2; }

a { color: var(--color-link); }
a:hover { color: var(--color-link-hover); }

img, video, svg { max-width: 100%; height: auto; }

:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }

.btn-primary {
  min-height: var(--control-h-md);
  padding: 0 var(--space-4);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font: inherit;
  font-weight: 600;
}
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:active { background: var(--color-primary-active); }
.btn-primary:disabled { background: var(--color-disabled); color: var(--color-disabled-text); }

.surface {
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-surface);
}

/* Campos de texto (checkbox, radio, range, color e file ficam com o tamanho nativo). */
input:where(:not([type=checkbox], [type=radio], [type=range], [type=color], [type=file], [type=hidden])), select, textarea {
  font: inherit;
  min-height: var(--control-h-md);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
}
input::placeholder, textarea::placeholder { color: var(--color-placeholder); }

/* Celular (até 767 px): áreas de toque de 44 px e campos com 16 px (sem zoom automático no iOS). */
@media (max-width: 767px) {
  .btn-primary { min-height: 44px; }
  input:where(:not([type=checkbox], [type=radio], [type=range], [type=color], [type=file], [type=hidden])), select, textarea { min-height: 44px; font-size: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`
}
