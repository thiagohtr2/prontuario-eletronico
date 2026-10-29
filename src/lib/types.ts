export type CorReceituario = 'vinho' | 'rose' | 'ameixa' | 'grafite' | 'salvia' | 'petroleo'
export type PapelReceituario = 'A4' | 'A5'

export type Doctor = {
  id: string
  nome: string
  especialidade: string
  crm: string
  telefone: string | null
  // Receituário personalizado (migração 0003)
  titulo_profissional: string | null
  rqe: string | null
  email_contato: string | null
  instagram: string | null
  site: string | null
  endereco_profissional: string | null
  rodape_receituario: string | null
  cor_receituario: CorReceituario
  papel_receituario: PapelReceituario
  logo_url: string | null
  created_at: string
  updated_at: string
}

export type Clinic = {
  id: string
  doctor_id: string
  nome: string
  endereco: string | null
  telefone: string | null
  observacoes: string | null
  cidade: string | null
  cnpj: string | null
  ativa: boolean
  created_at: string
  updated_at: string
}

export type Patient = {
  id: string
  doctor_id: string
  nome: string
  cpf: string | null
  data_nascimento: string | null
  sexo: 'feminino' | 'masculino' | 'outro' | null
  telefone: string | null
  email: string | null
  convenio: string | null
  alergias: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

/** Um medicamento da receita. */
export type PrescriptionItem = {
  id: string
  medicamento: string
  via: string
  quantidade: string
  posologia: string
}

export type Encounter = {
  id: string
  doctor_id: string
  patient_id: string
  clinic_id: string | null
  data_hora: string
  tipo_atendimento: string | null
  queixa_principal: string | null
  historia_clinica: string | null
  exame_fisico: string | null
  evolucao: string | null
  diagnostico: string | null
  conduta: string | null
  /** Orientações da receita (texto livre). Em atendimentos antigos, a prescrição inteira. */
  prescricao: string | null
  prescricao_itens: PrescriptionItem[]
  exames_solicitados: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

/** Atendimento com os dados da clínica e do paciente já resolvidos. */
export type EncounterWithRefs = Encounter & {
  clinic: Pick<Clinic, 'id' | 'nome'> | null
  patient?: Pick<Patient, 'id' | 'nome'> | null
}

/** Paciente com um resumo do último atendimento, usado na listagem. */
export type PatientListItem = Patient & {
  ultimo_atendimento: string | null
  ultima_clinica: string | null
  total_atendimentos: number
}

type Row<T> = { Row: T; Insert: Partial<T>; Update: Partial<T>; Relationships: [] }

export type Database = {
  public: {
    Tables: {
      doctors: Row<Doctor>
      clinics: Row<Clinic>
      patients: Row<Patient>
      encounters: Row<Encounter>
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export const VIAS_ADMINISTRACAO = [
  'Uso oral',
  'Uso sublingual',
  'Uso tópico',
  'Uso vaginal',
  'Uso injetável',
  'Uso inalatório',
  'Uso nasal',
  'Uso oftálmico',
  'Uso otológico',
  'Uso retal',
  'Uso transdérmico',
] as const

export const TIPOS_ATENDIMENTO = [
  'Primeira consulta',
  'Retorno',
  'Consulta de rotina',
  'Urgência',
  'Pré-operatório',
  'Pós-operatório',
  'Teleconsulta',
  'Outro',
] as const
