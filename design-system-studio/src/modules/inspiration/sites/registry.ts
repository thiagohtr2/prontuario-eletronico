import type { ComponentType } from 'react'
import type { SiteProps } from '../types'
import ArcStudio from './ArcStudio'
import AtlasCapital from './AtlasCapital'
import AuroraWear from './AuroraWear'
import CremaClub from './CremaClub'
import FloraSocial from './FloraSocial'
import Formica from './Formica'
import FrostLab from './FrostLab'
import KineticLab from './KineticLab'
import LumenAudio from './LumenAudio'
import MoriObjects from './MoriObjects'
import NomadTrails from './NomadTrails'
import OrbitalZero from './OrbitalZero'
import PixelPlay from './PixelPlay'
import PulseHealth from './PulseHealth'
import RaizMarket from './RaizMarket'
import SignalAi from './SignalAi'
import TerraForm from './TerraForm'
import TideResort from './TideResort'
import VerdantAtelier from './VerdantAtelier'
import VoltMotors from './VoltMotors'

/** Liga cada id do catálogo ao componente que desenha o site completo. */
export const SITE_COMPONENTS: Record<string, ComponentType<SiteProps>> = {
  'verdant-atelier': VerdantAtelier,
  'volt-motors': VoltMotors,
  'frost-lab': FrostLab,
  formica: Formica,
  'orbital-zero': OrbitalZero,
  'terra-form': TerraForm,
  'crema-club': CremaClub,
  'pulse-health': PulseHealth,
  'atlas-capital': AtlasCapital,
  'lumen-audio': LumenAudio,
  'flora-social': FloraSocial,
  'arc-studio': ArcStudio,
  'nomad-trails': NomadTrails,
  'mori-objects': MoriObjects,
  'signal-ai': SignalAi,
  'tide-resort': TideResort,
  'pixel-play': PixelPlay,
  'aurora-wear': AuroraWear,
  'raiz-market': RaizMarket,
  'kinetic-lab': KineticLab,
}

export function siteComponent(id: string): ComponentType<SiteProps> | undefined {
  return SITE_COMPONENTS[id]
}
