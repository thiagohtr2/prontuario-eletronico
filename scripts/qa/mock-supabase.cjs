/**
 * Supabase simulado para os testes visuais. Intercepta as chamadas de rede do
 * navegador e responde com dados fictícios — nenhum dado real é lido ou
 * gravado. Os textos são propositalmente longos para provocar quebras.
 */

const MOCK_URL = 'https://qa-mock.supabase.co'
const STORAGE_KEY = 'sb-qa-mock-auth-token'
const USER_ID = '00000000-0000-4000-8000-000000000001'

function base64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function fakeSession() {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60 * 24 * 365
  const user = {
    id: USER_ID,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'ana.carolina.vasconcellos@consultorio-exemplo.com.br',
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email' },
    user_metadata: {},
    created_at: new Date().toISOString(),
  }
  const token = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url({ sub: USER_ID, exp, role: 'authenticated' })}.qa`
  return {
    access_token: token,
    refresh_token: 'qa-refresh-token',
    token_type: 'bearer',
    expires_in: exp - now,
    expires_at: exp,
    user,
  }
}

const iso = (daysAgo, hour = 9, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function buildData({ empty = false } = {}) {
  const doctor = {
    id: USER_ID,
    nome: 'Dra. Ana Carolina Vasconcellos de Albuquerque',
    especialidade: 'Ginecologia, Obstetrícia e Medicina Reprodutiva',
    crm: '123456-BA',
    telefone: '71999990000',
    created_at: iso(200),
    updated_at: iso(2),
  }
  if (empty) return { doctor, clinics: [], patients: [], encounters: [] }

  const clinics = [
    { id: 'c1', doctor_id: USER_ID, nome: 'Clínica Itaigara', endereco: 'Rua Altino Seberto de Barros, 120, sala 804 — Itaigara, Salvador/BA', telefone: '7133330000', observacoes: 'Atendimento às terças e quintas, das 8h às 12h. Recepção no 8º andar.', ativa: true, created_at: iso(100), updated_at: iso(100) },
    { id: 'c2', doctor_id: USER_ID, nome: 'Centro Médico Integrado da Mulher e da Família — Unidade Pituba', endereco: 'Avenida Paulo VI, 1500 — Pituba, Salvador/BA', telefone: '7132220000', observacoes: null, ativa: true, created_at: iso(90), updated_at: iso(90) },
    { id: 'c3', doctor_id: USER_ID, nome: 'Hospital Aliança', endereco: null, telefone: null, observacoes: null, ativa: true, created_at: iso(80), updated_at: iso(80) },
  ]

  const patients = [
    { id: 'p1', doctor_id: USER_ID, nome: 'Maria Eduarda Albuquerque de Vasconcellos Cavalcanti', cpf: '12345678901', data_nascimento: '1988-04-12', sexo: 'feminino', telefone: '71988887777', email: 'maria.eduarda.albuquerque.cavalcanti@provedor-de-email-muito-longo.com.br', convenio: 'Bradesco Saúde Top Nacional Plus', alergias: 'Dipirona, penicilina e látex. Reação anafilática registrada em 2019.', observacoes: 'Prefere contato por mensagem. Acompanhamento de gestação de alto risco.', created_at: iso(60), updated_at: iso(3) },
    { id: 'p2', doctor_id: USER_ID, nome: 'Juliana Costa', cpf: '98765432100', data_nascimento: '1995-11-02', sexo: 'feminino', telefone: '71977776666', email: 'juliana@exemplo.com', convenio: null, alergias: null, observacoes: null, created_at: iso(40), updated_at: iso(40) },
    { id: 'p3', doctor_id: USER_ID, nome: 'Beatriz Nogueira Lima', cpf: null, data_nascimento: '1979-01-30', sexo: 'feminino', telefone: null, email: null, convenio: 'SulAmérica', alergias: null, observacoes: null, created_at: iso(20), updated_at: iso(20) },
  ]

  const ref = (patient, clinic) => ({
    patient: { id: patient.id, nome: patient.nome },
    clinic: clinic ? { id: clinic.id, nome: clinic.nome } : null,
  })

  const longText =
    'Paciente relata dor pélvica intermitente há três semanas, de moderada intensidade, com piora no período menstrual e melhora parcial com analgésico comum. Nega febre, sangramento fora do ciclo ou alterações urinárias.'

  const encounters = [
    { id: 'e1', patient_id: 'p1', clinic_id: 'c2', data_hora: iso(0, 14, 30), tipo_atendimento: 'Retorno', queixa_principal: longText, historia_clinica: 'G2P1A0. Última menstruação há 32 dias. Hipertensão arterial em uso de losartana 50 mg/dia.', exame_fisico: 'PA 120/80 mmHg, FC 76 bpm. Abdome flácido, indolor à palpação profunda.', evolucao: 'Melhora parcial do quadro em relação à última consulta. Mantém acompanhamento.', diagnostico: 'Dismenorreia secundária a investigar (N94.5).', conduta: 'Solicitada ultrassonografia transvaginal. Retorno em 30 dias com exames.', prescricao: 'Ibuprofeno 600 mg, 1 comprimido de 8/8h por 5 dias, se dor.', exames_solicitados: 'Ultrassonografia transvaginal; hemograma completo; beta-HCG.', observacoes: null },
    { id: 'e2', patient_id: 'p2', clinic_id: 'c1', data_hora: iso(0, 9, 0), tipo_atendimento: 'Primeira consulta', queixa_principal: 'Consulta de rotina.', historia_clinica: null, exame_fisico: null, evolucao: null, diagnostico: null, conduta: null, prescricao: null, exames_solicitados: null, observacoes: null },
    { id: 'e3', patient_id: 'p1', clinic_id: 'c1', data_hora: iso(30, 10, 15), tipo_atendimento: 'Consulta de rotina', queixa_principal: 'Dor pélvica.', historia_clinica: 'Sem antecedentes relevantes.', exame_fisico: null, evolucao: 'Primeira avaliação.', diagnostico: null, conduta: 'Analgesia e retorno.', prescricao: null, exames_solicitados: null, observacoes: null },
    { id: 'e4', patient_id: 'p3', clinic_id: null, data_hora: iso(45, 16, 45), tipo_atendimento: 'Teleconsulta', queixa_principal: 'Resultado de exames.', historia_clinica: null, exame_fisico: null, evolucao: 'Exames dentro da normalidade.', diagnostico: null, conduta: null, prescricao: null, exames_solicitados: null, observacoes: 'Paciente orientada por vídeo.' },
  ].map((encounter) => ({
    doctor_id: USER_ID,
    created_at: encounter.data_hora,
    updated_at: encounter.data_hora,
    ...encounter,
    ...ref(patients.find((p) => p.id === encounter.patient_id), clinics.find((c) => c.id === encounter.clinic_id)),
  }))

  return { doctor, clinics, patients, encounters }
}

function applyFilters(rows, params) {
  let result = rows
  for (const [key, raw] of params.entries()) {
    if (['select', 'order', 'limit', 'offset'].includes(key)) continue
    const [op, ...rest] = raw.split('.')
    const value = rest.join('.')
    if (op === 'eq') result = result.filter((row) => String(row[key]) === value)
    if (op === 'gte') result = result.filter((row) => String(row[key]) >= value)
    if (op === 'lte') result = result.filter((row) => String(row[key]) <= value)
  }
  const order = params.get('order')
  if (order) {
    const [column, direction] = order.split('.')
    result = [...result].sort((a, b) => (a[column] > b[column] ? 1 : -1) * (direction === 'desc' ? -1 : 1))
  }
  const limit = Number(params.get('limit'))
  if (limit) result = result.slice(0, limit)
  return result
}

/**
 * Instala o mock numa página do Playwright.
 * options.authenticated: grava uma sessão fictícia no localStorage.
 * options.empty: banco sem pacientes, clínicas ou atendimentos.
 * options.latencyMs: atraso artificial das respostas.
 */
async function installSupabaseMock(page, options = {}) {
  const data = buildData(options)
  const tables = { doctors: [data.doctor], clinics: data.clinics, patients: data.patients, encounters: data.encounters }

  if (options.authenticated) {
    const session = fakeSession()
    await page.addInitScript(
      ([key, value]) => window.localStorage.setItem(key, value),
      [STORAGE_KEY, JSON.stringify(session)],
    )
  }

  await page.route(`${MOCK_URL}/**`, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const method = request.method()
    if (options.latencyMs) await new Promise((resolve) => setTimeout(resolve, options.latencyMs))

    const json = (status, body, headers = {}) =>
      route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', ...headers }, body: JSON.stringify(body) })

    if (method === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    }

    if (url.pathname.startsWith('/auth/v1/')) {
      const endpoint = url.pathname.replace('/auth/v1/', '')
      if (endpoint === 'token') return json(400, { error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials', code: 'invalid_credentials' })
      if (endpoint === 'signup') return json(200, { id: 'new-user', email: 'nova@exemplo.com', identities: [{}], user_metadata: {} })
      if (endpoint === 'recover' || endpoint === 'resend') return json(200, {})
      if (endpoint === 'logout') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } })
      if (endpoint === 'user') return json(200, fakeSession().user)
      return json(200, {})
    }

    const table = url.pathname.replace('/rest/v1/', '')
    const rows = tables[table] ?? []

    if (method === 'HEAD') {
      const total = applyFilters(rows, url.searchParams).length
      return route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'access-control-expose-headers': 'content-range', 'content-range': `0-${Math.max(total - 1, 0)}/${total}` } })
    }

    if (method === 'GET') {
      const result = applyFilters(rows, url.searchParams)
      const single = (request.headers()['accept'] ?? '').includes('vnd.pgrst.object')
      if (single) return result[0] ? json(200, result[0]) : json(406, { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116' })
      return json(200, result)
    }

    // Escritas: devolvem o próprio corpo, sem persistir nada.
    const body = request.postDataJSON?.() ?? {}
    const row = Array.isArray(body) ? body[0] : body
    return json(method === 'POST' ? 201 : 200, { id: 'novo', ...row })
  })
}

module.exports = { MOCK_URL, installSupabaseMock }
