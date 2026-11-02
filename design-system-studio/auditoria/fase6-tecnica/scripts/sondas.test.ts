import fs from 'node:fs'
import path from 'node:path'
import { createProject } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { buildProjectSpec } from '@/prompt/spec'
import { renderMasterPrompt } from '@/prompt/text'
import { detectConflicts } from '@/prompt/conflicts'
import { useStudio } from '@/core/store'

const OUT = path.resolve(process.cwd(), '../../dados')
describe('sondas', () => {
  it('coleta', () => {
    const r: Record<string, unknown> = {}
    // 1) Observação do usuário no item da paleta some do Master Prompt
    const p = createProject()
    p.prompt.notes['identity.palette'] = 'NOTA-PALETA-123'
    p.prompt.notes['identity.typography'] = 'NOTA-TIPO-456'
    const md = renderMasterPrompt(buildProjectSpec(p))
    r.notaPaletaNoMasterPrompt = md.includes('NOTA-PALETA-123')
    r.notaTipografiaNoMasterPrompt = md.includes('NOTA-TIPO-456')
    // 2) Item excluído continua gerando contradição
    const q = createProject()
    q.layout.desktopId = 'sidebar-integral-classica'
    q.navigation.header = { id: 'ilha-flutuante', variant: 0 }
    q.prompt.excluded = ['navigation.header']
    r.conflitosComHeaderExcluido = detectConflicts(q).map((c) => c.id)
    // 3) JSON da especificação: cada item aparece 2× (seção + items[]) e o estado inteiro vai junto
    const bk = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '../../../fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-backup.json'), 'utf8'))
    const pp = parseProjectFile(bk)
    if (pp.ok) {
      const spec = buildProjectSpec(pp.project)
      const json = JSON.stringify(spec, null, 2)
      const s = spec.architecture.desktop!.summary
      r.jsonOcorrenciasDoResumoDesktop = json.split(JSON.stringify(s)).length - 1
      r.jsonCharsTotal = json.length
      r.jsonCharsSoItems = JSON.stringify(spec.items, null, 2).length
    }
    // 4) IDs inexistentes de catálogo passam na importação (sem aviso) e somem do prompt
    const ghost = createProject()
    const raw = { ...ghost, layout: { desktopId: 'layout-que-nao-existe', mobileId: 'outro-inexistente' }, navigation: { header: { id: 'x', variant: 1 }, sidebar: null } }
    const g = parseProjectFile(raw)
    r.importaIdsInexistentes = g.ok
    if (g.ok) {
      const t = renderMasterPrompt(buildProjectSpec(g.project))
      r.promptComIdsInexistentesMencionaLayout = t.includes('layout-que-nao-existe')
      r.pendenciaDesktopReportada = t.includes('Escolha a arquitetura do computador')
    }
    // 5) Histórico do backup não é restaurado pela importação
    const st = useStudio.getState()
    st.resetProject()
    const before = useStudio.getState().history.length
    const backup = { kind: 'atelier-ui/backup', project: createProject(), history: [{ id: 's1', label: 'v1', createdAt: '', project: createProject() }, { id: 's2', label: 'v2', createdAt: '', project: createProject() }] }
    useStudio.getState().importProject(backup)
    r.historicoAntesImport = before
    r.historicoDepoisImportDeBackupCom2Versoes = useStudio.getState().history.length
    r.historicoDoBackupRestaurado = useStudio.getState().history.some((h) => h.id === 's1')
    // 6) Snapshot inválido no histórico é restaurado sem validação
    useStudio.setState({ history: [{ id: 'bad', label: 'corrompida', createdAt: '', project: { schema: 'atelier-ui/project' } as never }] })
    let crashed: string | null = null
    try {
      useStudio.getState().restoreSnapshot('bad')
      const proj = useStudio.getState().project
      buildProjectSpec(proj)
    } catch (e) {
      crashed = (e as Error).message
    }
    r.restaurarVersaoCorrompida = crashed ?? 'sem erro'
    // 7) Chaves arbitrárias em overrides passam no Zod
    const o = parseProjectFile({ ...createProject(), identity: { ...createProject().identity, overrides: { mode: '#000000', gradientEnabled: '#ffffff', qualquerCoisa: '#123456' } } })
    r.overridesComChavesInvalidasAceitos = o.ok
    fs.writeFileSync(path.join(OUT, 'sondas.json'), JSON.stringify(r, null, 2))
    expect(true).toBe(true)
  })
})
