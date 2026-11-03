import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { paletteById, palettes } from '@/modules/color/catalog'
import type { Project } from './project'
import { useStudio } from './store'
import { applyOverrides, deriveTokens, resolveTheme, type PaletteBase } from './tokens'
import type { ResolvedTheme, ThemeTokens, TokenKey } from './types'

/**
 * Tokens que são cores de base da paleta. Quando o usuário altera um deles, os tokens derivados
 * (hover, active, foco, link, seleção, navegação ativa…) precisam ser recalculados a partir do novo
 * valor — e não continuar com a cor antiga da paleta.
 */
const BASE_TOKEN_TO_PALETTE: Partial<Record<TokenKey, keyof PaletteBase>> = {
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  bg: 'bg',
  surface: 'surface',
  text: 'text',
  navBg: 'nav',
}

/** Tokens da paleta global com as alterações do usuário (cores de base recalculam os derivados). */
export function projectTokens(project: Pick<Project, 'identity'>): ThemeTokens {
  const palette = paletteById(project.identity.paletteId) ?? palettes[0]
  const base: PaletteBase = { ...palette.base }
  const derivedOverrides: Partial<Record<TokenKey, string>> = {}
  for (const [key, value] of Object.entries(project.identity.overrides) as [TokenKey, string][]) {
    const baseKey = BASE_TOKEN_TO_PALETTE[key]
    if (baseKey) (base as unknown as Record<string, string>)[baseKey] = value
    else derivedOverrides[key] = value
  }
  if (project.identity.overrides.gradientFrom || project.identity.overrides.gradientTo) {
    base.gradient = [project.identity.overrides.gradientFrom ?? base.gradient?.[0] ?? base.primary, project.identity.overrides.gradientTo ?? base.gradient?.[1] ?? base.accent]
  }
  // Tokens derivados editados explicitamente pelo usuário continuam valendo por cima do recálculo.
  return applyOverrides(deriveTokens(base), derivedOverrides)
}

/** Identidade visual global resolvida: tokens + tipografia + geometria. */
export function projectTheme(project: Pick<Project, 'identity'>): ResolvedTheme {
  return resolveTheme(projectTokens(project), project.identity.typography, project.identity.geometry)
}

/**
 * Hook usado por todas as prévias que herdam a identidade global. Recalcula apenas
 * quando a identidade muda. Para exceções individuais, passe `overrides`.
 */
export function useResolvedTheme(overrides?: Partial<Record<TokenKey, string>>): ResolvedTheme {
  const identity = useStudio(useShallow((s) => s.project.identity))
  const key = overrides ? JSON.stringify(overrides) : ''
  return useMemo(() => {
    const base = projectTheme({ identity })
    if (!overrides || Object.keys(overrides).length === 0) return base
    return { ...base, tokens: applyOverrides(base.tokens, overrides) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, key])
}
