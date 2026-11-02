import { contrast } from '@/core/color'
import type { ItemDescription } from '@/core/describe'
import type { InspirationChoice } from '@/core/project'
import { fontName, fontStack } from '@/core/tokens'
import { siteById } from './catalog'
import { cleanOverrides, paletteOf, resolvePalette } from './palette'

const OVERRIDE_LABEL: Record<string, string> = { bg: 'fundo', text: 'texto', accent: 'destaque' }

/** Descreve o conceito de inspiração aprovado (pura, sem JSX). */
export function describeInspiration(choice: InspirationChoice): ItemDescription | null {
  const site = siteById(choice.siteId)
  if (!site) return null
  const base = paletteOf(site, choice.paletteId)
  const overrides = cleanOverrides(choice.overrides ?? {})
  const pal = resolvePalette(site, base.id, overrides)
  const changed = Object.entries(overrides).map(([k, v]) => `${OVERRIDE_LABEL[k] ?? k} ${v}`)
  const ratio = contrast(pal.text, pal.bg)

  return {
    name: site.brand,
    variant: changed.length ? `${base.name} (ajustada)` : base.name,
    summary: `${site.spec.summary} Usar como referência de identidade e composição — conceito “${site.brand}” (${site.segment.toLowerCase()}), paleta “${base.name}”.`,
    properties: {
      conceito: site.brand,
      segmento: site.segment,
      composicao: site.composition,
      paleta: base.name,
      ajustesDeCor: changed.length ? changed.join(', ') : 'nenhum',
      fonteTitulos: fontName(site.headingFont),
      fonteTexto: fontName(site.bodyFont),
      secoes: site.sections.length,
      contrasteTextoFundo: `${ratio.toFixed(1)}:1`,
    },
    colors: {
      fundo: pal.bg,
      superficie: pal.surface,
      texto: pal.text,
      textoSecundario: pal.muted,
      destaque: pal.accent,
      textoSobreDestaque: pal.onAccent,
      apoio: pal.secondary,
    },
    structure: [
      `Composição dominante: ${site.composition}.`,
      `Seções, nesta ordem: ${site.sections.map((s, i) => `${i + 1}. ${s}`).join('; ')}.`,
      `Tipografia: títulos em ${fontName(site.headingFont)} (${fontStack(site.headingFont)}); textos em ${fontName(site.bodyFont)} (${fontStack(site.bodyFont)}).`,
      `Cores: fundo ${pal.bg}, superfície ${pal.surface}, texto ${pal.text}, texto secundário ${pal.muted}, destaque ${pal.accent} com texto ${pal.onAccent}, apoio ${pal.secondary}.`,
      ...site.spec.structure,
    ],
    behavior: site.spec.behavior ?? [],
    responsive: site.spec.responsive,
    measurements: site.spec.measurements ?? {},
    exceptions: changed.length ? [`Cores ajustadas pelo usuário sobre a paleta “${base.name}”: ${changed.join(', ')}.`] : [],
    notes: [
      ...(site.spec.notes ?? []),
      'Adapte a identidade (paleta, tipografia, composição e ritmo) ao conteúdo real do projeto; os textos e a marca do conceito são apenas ilustrativos.',
    ],
  }
}
