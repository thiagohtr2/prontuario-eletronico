import type { ComponentType } from 'react'
import type { SiteProps } from '../types'
import Formica from './Formica'
import FrostLab from './FrostLab'
import OrbitalZero from './OrbitalZero'
import VerdantAtelier from './VerdantAtelier'
import VoltMotors from './VoltMotors'

/** Liga cada id do catálogo ao componente que desenha o site completo. */
export const SITE_COMPONENTS: Record<string, ComponentType<SiteProps>> = {
  'verdant-atelier': VerdantAtelier,
  'volt-motors': VoltMotors,
  'frost-lab': FrostLab,
  formica: Formica,
  'orbital-zero': OrbitalZero,
}

export function siteComponent(id: string): ComponentType<SiteProps> | undefined {
  return SITE_COMPONENTS[id]
}
