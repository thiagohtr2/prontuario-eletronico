import type { ItemDescription } from '@/core/describe'
import type { ComponentInstance, PropValue } from '@/core/project'
import { applyOverrides, fontName, TOKEN_LABEL } from '@/core/tokens'
import type { ResolvedTheme, TokenKey } from '@/core/types'
import { categoryById, familyById, resolveValues, visualFamilies } from './catalog'
import { iconLabel } from './icons'
import { resolveLook } from './look'
import type { FamilyStyle, ParamDef } from './types'

const SHADOW_TEXT: Record<FamilyStyle['shadow'], string> = {
  none: 'sem sombra em superfícies de conteúdo',
  hairline: 'sombra mínima (hairline) de 1 px',
  soft: 'sombra difusa e baixa',
  float: 'sombra colorida suave (na primária)',
  hard: 'sombra dura deslocada 4 px × 4 px na cor do texto, sem desfoque',
  neu: 'sombra dupla neumórfica (clara superior-esquerda, escura inferior-direita)',
  glow: 'brilho colorido (glow)',
  deep: 'sombra profunda e escura',
  tonal: 'elevação tonal (Material)',
  print: 'sombra de impressão deslocada 3 px × 3 px no destaque a 45%',
  press: 'relevo inferior sólido de 4 px',
}

const SURFACE_TEXT: Record<FamilyStyle['surface'], string> = {
  plain: 'superfície = token surface',
  tint: 'superfície tingida pela primária (4–10%)',
  tonal: 'ladrilhos tonais (superfície alternativa e primária suave)',
  glass: 'vidro fosco translúcido (superfície a 58% + backdrop-filter blur 16 px)',
  dark: 'superfície escura derivada do token de texto',
  midnight: 'superfície azul-noite derivada da primária + destaque',
  paper: 'papel quente derivado do fundo global',
  neu: 'superfície única neumórfica derivada do fundo',
  aurora: 'vidro escuro sobre auroras da paleta',
  concrete: 'superfícies neutras com faixas de cabeçalho na cor do texto',
}

const FILL_TEXT: Record<FamilyStyle['fill'], string> = {
  solid: 'primária sólida (primary) com texto onPrimary',
  gradient: 'gradiente 135° de gradientFrom/primary para gradientTo/accent',
  metal: 'gradiente metálico (warning + accent clareado)',
  ivory: 'marfim (cor do texto) com texto escuro',
  accent: 'cor de destaque chapada (accent) com borda e sombra dura',
  press: 'primária com relevo inferior (primária escurecida)',
  aurora: 'gradiente de três cores (primary → accent → secondary)',
}

function formatValue(param: ParamDef, value: PropValue): PropValue {
  switch (param.type) {
    case 'boolean':
      return value ? 'sim' : 'não'
    case 'select':
      return param.options?.find((o) => o.value === String(value))?.label ?? value
    case 'icon':
      return `${iconLabel(String(value))} (lucide: ${value})`
    case 'color':
      return value ? String(value) : 'herda da paleta global'
    case 'textarea':
      return String(value).split('\n').map((s) => s.trim()).filter(Boolean).join(' | ')
    case 'number':
      return param.unit ? `${value} ${param.unit}` : value
    default:
      return value
  }
}

/** Descreve uma instância de componente para o motor de prompts (função pura, sem JSX). */
export function describeComponent(instance: ComponentInstance, theme: ResolvedTheme): ItemDescription {
  const category = categoryById(instance.categoryId)
  const family = familyById(instance.familyId) ?? visualFamilies[0]
  const s = family.style
  const values = resolveValues(category, instance.props)
  const overrides = Object.entries(instance.tokenOverrides).filter(([, v]) => Boolean(v)) as [TokenKey, string][]
  const effective: ResolvedTheme = overrides.length ? { ...theme, tokens: applyOverrides(theme.tokens, instance.tokenOverrides) } : theme
  const L = resolveLook(effective, family)

  const properties: Record<string, PropValue> = { 'Família visual': `${family.number}. ${family.name}` }
  for (const p of category?.params ?? []) {
    const changed = Object.prototype.hasOwnProperty.call(instance.props, p.key)
    properties[p.label] = changed ? formatValue(p, values[p.key]) : formatValue(p, p.default)
  }
  Object.assign(properties, {
    'Raio dos controles': s.radius >= 999 ? 'pílula (999 px)' : `${s.radius} px`,
    'Raio dos contêineres': `${s.radiusCard} px`,
    Borda: s.borderWidth > 0 && s.borderStyle !== 'none' ? `${s.borderWidth} px ${s.borderStyle === 'dashed' ? 'tracejada' : 'sólida'} (${s.borderTone === 'ink' ? 'cor do texto' : s.borderTone === 'accent' ? 'destaque translúcido' : s.borderTone === 'light' ? 'branca translúcida' : s.borderTone === 'strong' ? 'borderStrong' : 'border'})` : 'sem borda',
    Sombra: SHADOW_TEXT[s.shadow],
    Superfície: SURFACE_TEXT[s.surface],
    'Ação principal': FILL_TEXT[s.fill],
    'Fonte de títulos': `${fontName(s.headingFont)} ${s.headingWeight}`,
    'Fonte de texto': fontName(s.font),
    'Caixa de rótulos e botões': s.textCase === 'uppercase' ? `caixa alta, espaçamento ${s.tracking} em` : 'normal (sentence case)',
    'Tamanho base': `${s.fontSize} px`,
    'Altura de controles': `${s.controlHeight} px (mínimo 44 px de área de toque no celular)`,
    Densidade: s.density < 0.9 ? 'compacta' : s.density > 1.1 ? 'espaçosa' : 'confortável',
    Ícones: `lucide, traço ${s.iconStroke} px, tratamento ${s.iconTreatment}`,
    'Indicador de ativo': s.indicator,
  })

  const colors: Record<string, string> = {}
  const add = (label: string, value: string) => {
    if (/^#|^rgba?\(/.test(value)) colors[label] = value
  }
  add('Ação principal (fundo)', L.fill)
  add('Ação principal (texto)', L.onFill)
  add('Superfície', L.surfaceSolid)
  add('Texto', L.text)
  add('Texto secundário', L.muted)
  add('Borda', L.border)
  add('Destaque', L.accent)
  add('Foco', L.focusColor)
  if (!/^#|^rgba?\(/.test(L.fill)) colors['Ação principal (gradiente)'] = L.fill

  const tok = (k: TokenKey) => `${TOKEN_LABEL[k]} (${k}${instance.tokenOverrides[k] ? ', exceção individual' : ''})`
  const behavior = [
    ...(category?.spec.behavior ?? []),
    `Hover: fundo ${tok('primaryHover')} na ação principal e ${tok('hover')} em itens neutros${s.shadow === 'hard' ? '; desloca −2 px e aumenta a sombra dura' : s.shadow === 'press' ? '; sobe 1 px' : ''}.`,
    `Focus-visible: ${s.focus === 'outline' ? `contorno de 2 px em ${tok('text')} com afastamento de 2 px` : s.focus === 'dashed' ? 'contorno tracejado de 2 px no destaque' : s.focus === 'glow' ? `anel + brilho externo em ${tok('focusRing')}` : s.focus === 'offset' ? 'sombra dura ampliada (6 px) e deslocamento' : `anel de 3 px em ${tok('focusRing')} a 35%`}. Nunca remova o foco visível.`,
    `Active: ${tok('primaryActive')}${s.shadow === 'hard' ? ', elemento encosta na sombra (translate 4 px)' : s.shadow === 'press' ? ', relevo vai a 0 (translateY 4 px)' : s.surface === 'neu' ? ', relevo invertido (sombra interna)' : ''}.`,
    `Disabled: fundo ${tok('disabled')}, texto ${tok('disabledText')}, sem sombra, cursor not-allowed, aria-disabled.`,
    ...(family.spec.behavior ?? []),
  ]

  const exceptions = overrides.map(([k, v]) => `Exceção individual: ${TOKEN_LABEL[k]} (${k}) = ${v} neste componente — não herda a paleta global; os demais tokens continuam herdados.`)

  return {
    name: instance.label || category?.name || instance.categoryId,
    variant: family.name,
    summary: `${category?.name ?? instance.categoryId} na família visual ${family.name}. ${category?.spec.summary ?? ''} Estilo: ${family.spec.summary}`.trim(),
    properties,
    colors,
    structure: [...(category?.spec.structure ?? []), ...family.spec.structure],
    behavior,
    responsive: [...(category?.spec.responsive ?? ['Adapte o componente a telas a partir de 320 px sem overflow horizontal.']), ...family.spec.responsive],
    measurements: {
      ...(category?.spec.measurements ?? {}),
      alturaDeControle: `${s.controlHeight} px`,
      raio: s.radius >= 999 ? 'pílula' : `${s.radius} px / ${s.radiusCard} px`,
      paddingInterno: `${Math.round(14 * s.density)} px`,
    },
    exceptions,
    notes: [
      ...(category?.spec.notes ?? []),
      ...(family.spec.notes ?? []),
      instance.label ? `Nome dado pelo usuário: “${instance.label}”.` : '',
      'Use os tokens da paleta global por padrão; só as exceções listadas fogem dela.',
    ].filter(Boolean),
  }
}
