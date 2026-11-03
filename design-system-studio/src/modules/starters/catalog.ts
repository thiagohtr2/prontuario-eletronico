import { folhaVaso, lumeClinica, verticeArquitetura, voltaMotors } from './models/lojas-institucionais'
import { gazetaAurora, lancamentoApp, movimentoAcademia, ritmoProjetos, sinalIa } from './models/produtos'
import { pulsarSaude } from './models/pulsar-saude'
import { alamedaCapital, escalaClara, torreControle } from './models/sistemas'
import type { SiteStarter } from './types'

/**
 * Biblioteca de modelos de site completos. Cada arquivo em `models/` é um manifesto independente;
 * novos modelos entram aqui (a validação dos testes impede referências quebradas).
 */
export const starters: SiteStarter[] = [
  pulsarSaude,
  escalaClara,
  alamedaCapital,
  folhaVaso,
  voltaMotors,
  verticeArquitetura,
  lumeClinica,
  sinalIa,
  ritmoProjetos,
  gazetaAurora,
  lancamentoApp,
  torreControle,
  movimentoAcademia,
]

export const starterById = (id: string | null | undefined) => starters.find((s) => s.id === id)
