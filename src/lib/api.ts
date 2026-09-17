import { configuredUrl, supabase } from './supabase'
import type { Clinic, Encounter, EncounterWithRefs, Patient, PatientListItem } from './types'

/** Mensagem de erro legível para o médico, sem jargão técnico. */
export function errorMessage(error: unknown, fallback = 'Não foi possível concluir. Tente novamente.'): string {
  if (error instanceof Error && error.message) {
    if (/Failed to fetch|NetworkError/i.test(error.message)) {
      // Não é só falta de internet: um endereço errado do Supabase falha do
      // mesmo jeito. Mostrar o endereço usado deixa isso visível na hora.
      return `Não foi possível falar com o servidor em ${configuredUrl}. Verifique sua conexão e se esse endereço está correto.`
    }
    return error.message
  }
  return fallback
}

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message)
  return data as T
}

// ---------------------------------------------------------------- Clínicas

export async function listClinics(): Promise<Clinic[]> {
  return unwrap(await supabase.from('clinics').select('*').order('nome', { ascending: true })) ?? []
}

export async function createClinic(input: Partial<Clinic>, doctorId: string): Promise<Clinic> {
  return unwrap(
    await supabase
      .from('clinics')
      .insert({ ...input, doctor_id: doctorId })
      .select('*')
      .single(),
  )
}

export async function updateClinic(id: string, input: Partial<Clinic>): Promise<Clinic> {
  return unwrap(await supabase.from('clinics').update(input).eq('id', id).select('*').single())
}

export async function deleteClinic(id: string): Promise<void> {
  const { error } = await supabase.from('clinics').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// --------------------------------------------------------------- Pacientes

export async function listPatients(): Promise<Patient[]> {
  return unwrap(await supabase.from('patients').select('*').order('nome', { ascending: true })) ?? []
}

/**
 * Lista os pacientes já com o resumo do último atendimento.
 * Os atendimentos vêm em uma única consulta e são reduzidos no cliente —
 * suficiente e simples para o volume de um consultório.
 */
export async function listPatientsWithSummary(): Promise<PatientListItem[]> {
  const [patients, encounters] = await Promise.all([
    listPatients(),
    unwrap(
      await supabase
        .from('encounters')
        .select('patient_id, data_hora, clinic:clinics(nome)')
        .order('data_hora', { ascending: false }),
    ) as unknown as Array<{ patient_id: string; data_hora: string; clinic: { nome: string } | null }>,
  ])

  const summary = new Map<string, { data_hora: string; clinica: string | null; total: number }>()
  for (const row of encounters ?? []) {
    const current = summary.get(row.patient_id)
    if (current) {
      current.total += 1
    } else {
      // A consulta já vem ordenada por data desc, então o primeiro é o mais recente.
      summary.set(row.patient_id, { data_hora: row.data_hora, clinica: row.clinic?.nome ?? null, total: 1 })
    }
  }

  return patients.map((patient) => {
    const item = summary.get(patient.id)
    return {
      ...patient,
      ultimo_atendimento: item?.data_hora ?? null,
      ultima_clinica: item?.clinica ?? null,
      total_atendimentos: item?.total ?? 0,
    }
  })
}

export async function getPatient(id: string): Promise<Patient | null> {
  const { data, error } = await supabase.from('patients').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function createPatient(input: Partial<Patient>, doctorId: string): Promise<Patient> {
  return unwrap(
    await supabase
      .from('patients')
      .insert({ ...input, doctor_id: doctorId })
      .select('*')
      .single(),
  )
}

export async function updatePatient(id: string, input: Partial<Patient>): Promise<Patient> {
  return unwrap(await supabase.from('patients').update(input).eq('id', id).select('*').single())
}

export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase.from('patients').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ------------------------------------------------------------ Atendimentos

const ENCOUNTER_SELECT = '*, clinic:clinics(id, nome), patient:patients(id, nome)'

export async function listEncounters(limit?: number): Promise<EncounterWithRefs[]> {
  let query = supabase.from('encounters').select(ENCOUNTER_SELECT).order('data_hora', { ascending: false })
  if (limit) query = query.limit(limit)
  return (unwrap(await query) as unknown as EncounterWithRefs[]) ?? []
}

export async function listEncountersInRange(start: string, end: string): Promise<EncounterWithRefs[]> {
  return (
    (unwrap(
      await supabase
        .from('encounters')
        .select(ENCOUNTER_SELECT)
        .gte('data_hora', start)
        .lte('data_hora', end)
        .order('data_hora', { ascending: true }),
    ) as unknown as EncounterWithRefs[]) ?? []
  )
}

export async function listPatientEncounters(patientId: string): Promise<EncounterWithRefs[]> {
  return (
    (unwrap(
      await supabase
        .from('encounters')
        .select(ENCOUNTER_SELECT)
        .eq('patient_id', patientId)
        .order('data_hora', { ascending: false }),
    ) as unknown as EncounterWithRefs[]) ?? []
  )
}

export async function getEncounter(id: string): Promise<EncounterWithRefs | null> {
  const { data, error } = await supabase.from('encounters').select(ENCOUNTER_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as unknown as EncounterWithRefs | null
}

export async function createEncounter(input: Partial<Encounter>, doctorId: string): Promise<Encounter> {
  return unwrap(
    await supabase
      .from('encounters')
      .insert({ ...input, doctor_id: doctorId })
      .select('*')
      .single(),
  )
}

export async function updateEncounter(id: string, input: Partial<Encounter>): Promise<Encounter> {
  return unwrap(await supabase.from('encounters').update(input).eq('id', id).select('*').single())
}

export async function deleteEncounter(id: string): Promise<void> {
  const { error } = await supabase.from('encounters').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ----------------------------------------------------------------- Contagens

export async function countPatients(): Promise<number> {
  const { count, error } = await supabase.from('patients').select('id', { count: 'exact', head: true })
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function countEncounters(): Promise<number> {
  const { count, error } = await supabase.from('encounters').select('id', { count: 'exact', head: true })
  if (error) throw new Error(error.message)
  return count ?? 0
}
