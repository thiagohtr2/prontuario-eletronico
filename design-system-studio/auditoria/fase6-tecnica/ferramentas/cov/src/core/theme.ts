import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { paletteById, palettes } from '@/modules/color/catalog'
import type { Project } from './project'
import { useStudio } from './store'
import { applyOverrides, deriveTokens, resolveTheme } from './tokens'
import type { ResolvedTheme, ThemeTokens, TokenKey } from './types'

/** Tokens da paleta global (com as alterações individuais do usuário). */
export function projectTokens(project: Pick<Project, 'identity'>): ThemeTokens {
  const palette = paletteById(project.identity.paletteId) ?? palettes[0]
  return applyOverrides(deriveTokens(palette.base), project.identity.overrides)
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
