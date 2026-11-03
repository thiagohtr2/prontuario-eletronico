import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import {
  createProject,
  uid,
  type ComponentInstance,
  type EntryFlow,
  type InspirationChoice,
  type NavChoice,
  type Project,
  type ProjectMeta,
  type PropValue,
  type StepId,
  type TemplateChoice,
  type ValidationConfig,
  type ValidationReport,
} from './project'
import { parseBackupHistory, parseProjectFile } from './schema'
import type { Geometry, TokenKey, Typography } from './types'

export interface Snapshot {
  id: string
  label: string
  createdAt: string
  project: Project
}

export const STORAGE_KEY = 'atelier-ui:studio:v1'
const MAX_SNAPSHOTS = 30

/* -------------------------------------------------------------------------- */
/* Gravação local segura (TE-06/TE-07)                                         */
/* -------------------------------------------------------------------------- */

interface SaveStatus {
  /** A última gravação falhou (armazenamento cheio, bloqueado ou indisponível). */
  failed: boolean
  /** Versões antigas foram removidas para liberar espaço. */
  pruned: boolean
  /** Chave da cópia de recuperação de dados salvos que não puderam ser abertos. */
  recoveryKey: string | null
  dismissRecovery: () => void
}

/** Estado da gravação, fora do projeto (não é salvo). */
export const useSaveStatus = create<SaveStatus>((set) => ({
  failed: false,
  pruned: false,
  recoveryKey: null,
  dismissRecovery: () => set({ recoveryKey: null }),
}))

/** Guarda o conteúdo bruto antes de descartá-lo e avisa a pessoa. */
function keepRecoveryCopy(raw: string) {
  const key = `${STORAGE_KEY}:recuperacao-${new Date().toISOString().slice(0, 19)}`
  try {
    localStorage.setItem(key, raw)
    useSaveStatus.setState({ recoveryKey: key })
  } catch {
    useSaveStatus.setState({ failed: true })
  }
}

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      const raw = localStorage.getItem(name)
      if (raw === null) return null
      JSON.parse(raw)
      return raw
    } catch {
      // JSON ilegível: guarda uma cópia antes que a próxima gravação o sobrescreva.
      try {
        const raw = localStorage.getItem(name)
        if (raw) keepRecoveryCopy(raw)
      } catch {
        /* armazenamento indisponível */
      }
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
      if (useSaveStatus.getState().failed) useSaveStatus.setState({ failed: false })
      return
    } catch {
      // Cota estourada: tenta de novo com menos versões (o projeto atual tem prioridade).
      try {
        const data = JSON.parse(value) as { state?: { history?: unknown[]; library?: { history?: unknown[] }[] } }
        for (const keep of [10, 0]) {
          if (!data.state?.history) continue
          if (data.state.history.length <= keep && !(keep === 0 && data.state.library?.some((e) => e.history?.length))) continue
          data.state.history = data.state.history.slice(0, keep)
          // Último recurso: as versões dos outros projetos também saem (os projetos continuam).
          if (keep === 0) data.state.library = data.state.library?.map((e) => ({ ...e, history: [] }))
          try {
            localStorage.setItem(name, JSON.stringify(data))
            const history = data.state.history as Snapshot[]
            useSaveStatus.setState({ failed: false, pruned: true })
            const library = data.state.library as LibraryEntry[] | undefined
            queueMicrotask(() => useStudio.setState(library ? { history, library } : { history }))
            return
          } catch {
            /* ainda não coube */
          }
        }
      } catch {
        /* valor inesperado */
      }
      useSaveStatus.setState({ failed: true })
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      /* armazenamento indisponível */
    }
  },
}

/** Projeto guardado na biblioteca (projetos nomeados): o projeto e as versões dele. */
export interface LibraryEntry {
  id: string
  name: string
  savedAt: string
  project: Project
  history: Snapshot[]
}

interface StudioState {
  project: Project
  history: Snapshot[]
  /** Outros projetos deste navegador (o atual não fica aqui enquanto está aberto). */
  library: LibraryEntry[]

  // Projeto e modos
  updateMeta: (patch: Partial<ProjectMeta>) => void
  setMode: (mode: Project['mode']) => void
  setDepth: (depth: Project['depth']) => void
  setPrefs: (patch: Partial<Project['prefs']>) => void

  // Construtor guiado
  goToStep: (step: StepId) => void
  completeStep: (step: StepId) => void
  setSkeletonApproved: (approved: boolean) => void

  // Páginas de entrada
  setEntryFlow: (flow: EntryFlow) => void
  selectLanding: (id: string | null) => void
  setLandingUsesOriginalColors: (value: boolean) => void
  setNoSignup: (value: boolean) => void
  selectLogin: (id: string | null) => void
  selectSignup: (id: string | null) => void

  // Arquitetura
  selectDesktop: (id: string | null) => void
  selectMobile: (id: string | null) => void
  /** Escopo da arquitetura: monitores grandes e telas com stories. */
  setLayoutScope: (patch: Partial<Pick<Project['layout'], 'wide' | 'storiesScope'>>) => void

  // Identidade visual
  selectPalette: (id: string) => void
  setTokenOverride: (key: TokenKey, value: string | null) => void
  resetTokenOverrides: () => void
  setTypography: (patch: Partial<Typography>) => void
  setGeometry: (patch: Partial<Geometry>) => void

  // Navegação
  selectHeader: (choice: NavChoice | null) => void
  selectSidebar: (choice: NavChoice | null) => void

  // Componentes
  addComponent: (categoryId: string, familyId: string, label?: string, props?: Record<string, PropValue>) => string
  updateComponent: (id: string, patch: Partial<Omit<ComponentInstance, 'id' | 'createdAt'>>) => void
  setComponentProp: (id: string, key: string, value: PropValue | null) => void
  setComponentTokenOverride: (id: string, key: TokenKey, value: string | null) => void
  duplicateComponent: (id: string) => string | null
  removeComponent: (id: string) => void

  // Inspiração e templates
  setInspiration: (choice: InspirationChoice | null) => void
  setTemplate: (choice: TemplateChoice | null) => void

  // Central de prompts
  setExcluded: (key: string, excluded: boolean) => void
  setNote: (key: string, note: string) => void
  resolveConflict: (conflictId: string, optionId: string | null) => void

  // Validação
  setValidationConfig: (patch: Partial<ValidationConfig>) => void
  setValidationReport: (report: ValidationReport | null) => void

  // Histórico, importação e reset
  saveSnapshot: (label: string) => void
  restoreSnapshot: (id: string) => void
  deleteSnapshot: (id: string) => void
  /** Importa projeto, especificação ou backup; versões de um backup completo são restauradas junto. */
  importProject: (raw: unknown) => { ok: true; versions: number; skipped: number } | { ok: false; errors: string[] }
  resetProject: () => void

  // Projetos nomeados
  /** Guarda o projeto atual na biblioteca e abre um projeto novo e vazio. */
  newProject: () => void
  /** Guarda o projeto atual na biblioteca e abre outro (com as versões dele). */
  openProject: (id: string) => void
  deleteLibraryProject: (id: string) => void
  /**
   * Recomeça do zero: apaga o projeto atual, todas as versões, os outros projetos, as cópias de
   * recuperação e as preferências de interface guardadas neste navegador. Não pode ser desfeito.
   */
  resetEverything: () => void
  /** Duplica o projeto atual na biblioteca (ponto de partida para uma variação). */
  duplicateProject: () => void
}

type Recipe = (p: Project) => Project

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => {
      /** Aplica uma alteração imutável e atualiza `updatedAt`. */
      const edit = (recipe: Recipe) =>
        set((s) => ({ project: { ...recipe(s.project), updatedAt: new Date().toISOString() } }))

      // O relatório de validação (que pode ser grande) fica só no projeto atual, fora das versões (TE-08).
      const snapshotOf = (label: string, project: Project): Snapshot => ({
        id: uid('snap'),
        label,
        createdAt: new Date().toISOString(),
        project: structuredClone({ ...project, validation: { ...project.validation, report: null } }),
      })

      const pushSnapshot = (label: string) =>
        set((s) => ({ history: [snapshotOf(label, s.project), ...s.history].slice(0, MAX_SNAPSHOTS) }))

      /** Entrada da biblioteca para o projeto atual (sem relatório de validação, que é grande). */
      const libraryEntryOf = (project: Project, history: Snapshot[]): LibraryEntry => ({
        id: project.id,
        name: project.meta.name.trim() || 'Projeto sem nome',
        savedAt: new Date().toISOString(),
        project: structuredClone({ ...project, validation: { ...project.validation, report: null } }),
        history,
      })
      /** Projeto atual vale a pena guardar? (um projeto vazio e nunca tocado não ocupa a biblioteca) */
      const worthKeeping = (p: Project) => Boolean(p.meta.name.trim() || p.meta.projectType || p.layout.desktopId || p.layout.mobileId || p.components.length)
      const stash = (s: StudioState): LibraryEntry[] =>
        worthKeeping(s.project) ? [libraryEntryOf(s.project, s.history), ...s.library.filter((e) => e.id !== s.project.id)] : s.library

      return {
        project: createProject(),
        history: [],
        library: [],

        updateMeta: (patch) => edit((p) => ({ ...p, meta: { ...p.meta, ...patch } })),
        setMode: (mode) => edit((p) => ({ ...p, mode })),
        setDepth: (depth) => edit((p) => ({ ...p, depth })),
        setPrefs: (patch) => edit((p) => ({ ...p, prefs: { ...p.prefs, ...patch } })),

        goToStep: (step) => edit((p) => ({ ...p, guided: { ...p.guided, step } })),
        completeStep: (step) =>
          edit((p) =>
            p.guided.completed.includes(step)
              ? p
              : { ...p, guided: { ...p.guided, completed: [...p.guided.completed, step] } },
          ),
        setSkeletonApproved: (approved) =>
          edit((p) => ({ ...p, guided: { ...p.guided, skeletonApproved: approved } })),

        setEntryFlow: (flow) => edit((p) => ({ ...p, entry: { ...p.entry, flow } })),
        selectLanding: (id) => edit((p) => ({ ...p, entry: { ...p.entry, landingId: id } })),
        setLandingUsesOriginalColors: (value) =>
          edit((p) => ({ ...p, entry: { ...p.entry, landingUsesOriginalColors: value } })),
        selectLogin: (id) => edit((p) => ({ ...p, entry: { ...p.entry, loginId: id } })),
        // Escolher um cadastro desfaz a decisão “sem cadastro”.
        selectSignup: (id) => edit((p) => ({ ...p, entry: { ...p.entry, signupId: id, noSignup: id ? false : p.entry.noSignup } })),
        setNoSignup: (value) => edit((p) => ({ ...p, entry: { ...p.entry, noSignup: value } })),

        selectDesktop: (id) => edit((p) => ({ ...p, layout: { ...p.layout, desktopId: id } })),
        selectMobile: (id) => edit((p) => ({ ...p, layout: { ...p.layout, mobileId: id } })),
        setLayoutScope: (patch) => edit((p) => ({ ...p, layout: { ...p.layout, ...patch } })),

        selectPalette: (id) => edit((p) => ({ ...p, identity: { ...p.identity, paletteId: id } })),
        setTokenOverride: (key, value) =>
          edit((p) => {
            const overrides = { ...p.identity.overrides }
            if (value) overrides[key] = value
            else delete overrides[key]
            return { ...p, identity: { ...p.identity, overrides } }
          }),
        resetTokenOverrides: () => edit((p) => ({ ...p, identity: { ...p.identity, overrides: {} } })),
        setTypography: (patch) =>
          edit((p) => ({ ...p, identity: { ...p.identity, typography: { ...p.identity.typography, ...patch } } })),
        setGeometry: (patch) =>
          edit((p) => ({ ...p, identity: { ...p.identity, geometry: { ...p.identity.geometry, ...patch } } })),

        selectHeader: (choice) => edit((p) => ({ ...p, navigation: { ...p.navigation, header: choice } })),
        selectSidebar: (choice) => edit((p) => ({ ...p, navigation: { ...p.navigation, sidebar: choice } })),

        addComponent: (categoryId, familyId, label = '', props = {}) => {
          const id = uid('cmp')
          edit((p) => ({
            ...p,
            components: [
              ...p.components,
              { id, categoryId, familyId, label, props, tokenOverrides: {}, createdAt: new Date().toISOString() },
            ],
          }))
          return id
        },
        updateComponent: (id, patch) =>
          edit((p) => ({ ...p, components: p.components.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
        setComponentProp: (id, key, value) =>
          edit((p) => ({
            ...p,
            components: p.components.map((c) => {
              if (c.id !== id) return c
              const props = { ...c.props }
              if (value === null) delete props[key]
              else props[key] = value
              return { ...c, props }
            }),
          })),
        setComponentTokenOverride: (id, key, value) =>
          edit((p) => ({
            ...p,
            components: p.components.map((c) => {
              if (c.id !== id) return c
              const tokenOverrides = { ...c.tokenOverrides }
              if (value) tokenOverrides[key] = value
              else delete tokenOverrides[key]
              return { ...c, tokenOverrides }
            }),
          })),
        duplicateComponent: (id) => {
          const source = get().project.components.find((c) => c.id === id)
          if (!source) return null
          const copyId = uid('cmp')
          edit((p) => ({
            ...p,
            components: [
              ...p.components,
              {
                ...structuredClone(source),
                id: copyId,
                label: source.label ? `${source.label} (cópia)` : '',
                createdAt: new Date().toISOString(),
              },
            ],
          }))
          return copyId
        },
        removeComponent: (id) =>
          edit((p) => ({
            ...p,
            components: p.components.filter((c) => c.id !== id),
            prompt: { ...p.prompt, excluded: p.prompt.excluded.filter((k) => k !== `component:${id}`) },
          })),

        setInspiration: (choice) => edit((p) => ({ ...p, inspiration: choice })),
        setTemplate: (choice) => edit((p) => ({ ...p, template: choice })),

        setExcluded: (key, excluded) =>
          edit((p) => {
            const set = new Set(p.prompt.excluded)
            if (excluded) set.add(key)
            else set.delete(key)
            return { ...p, prompt: { ...p.prompt, excluded: [...set] } }
          }),
        setNote: (key, note) =>
          edit((p) => {
            const notes = { ...p.prompt.notes }
            if (note.trim()) notes[key] = note
            else delete notes[key]
            return { ...p, prompt: { ...p.prompt, notes } }
          }),
        resolveConflict: (conflictId, optionId) =>
          edit((p) => {
            const conflictResolutions = { ...p.prompt.conflictResolutions }
            if (optionId) conflictResolutions[conflictId] = optionId
            else delete conflictResolutions[conflictId]
            return { ...p, prompt: { ...p.prompt, conflictResolutions } }
          }),

        setValidationConfig: (patch) =>
          edit((p) => ({ ...p, validation: { ...p.validation, config: { ...p.validation.config, ...patch } } })),
        setValidationReport: (report) => edit((p) => ({ ...p, validation: { ...p.validation, report } })),

        saveSnapshot: (label) => pushSnapshot(label.trim() || 'Versão sem nome'),
        restoreSnapshot: (id) => {
          const snap = get().history.find((h) => h.id === id)
          if (!snap) return
          // Versões antigas ou incompletas passam pela mesma validação de um arquivo importado.
          const parsed = parseProjectFile(snap.project)
          if (!parsed.ok) return
          pushSnapshot('Antes de restaurar uma versão')
          set({ project: { ...parsed.project, updatedAt: new Date().toISOString() } })
        },
        deleteSnapshot: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
        importProject: (raw) => {
          const result = parseProjectFile(raw)
          if (!result.ok) return result
          const { snapshots, skipped } = parseBackupHistory(raw)
          pushSnapshot('Antes de importar um arquivo')
          set((s) => {
            // Mescla as versões do backup com as atuais (nada é apagado); mais recentes primeiro.
            const known = new Set(s.history.map((h) => h.id))
            const history = [...s.history, ...snapshots.filter((h) => !known.has(h.id))]
              .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
              .slice(0, MAX_SNAPSHOTS)
            // Outros projetos do backup entram na biblioteca (os já existentes são mantidos).
            const raw0 = raw as { library?: unknown }
            const incoming = Array.isArray(raw0?.library)
              ? (raw0.library as LibraryEntry[]).flatMap((e) => {
                  const p = e && typeof e === 'object' ? parseProjectFile(e.project) : null
                  return p?.ok && !s.library.some((x) => x.id === e.id) && e.id !== result.project.id
                    ? [{ id: String(e.id), name: String(e.name || p.project.meta.name || 'Projeto sem nome'), savedAt: String(e.savedAt || new Date().toISOString()), project: p.project, history: [] }]
                    : []
                })
              : []
            return { project: { ...result.project, updatedAt: new Date().toISOString() }, history, library: [...s.library, ...incoming] }
          })
          return { ok: true, versions: snapshots.length, skipped }
        },
        resetProject: () => {
          pushSnapshot('Antes de limpar o projeto')
          set({ project: createProject() })
        },
        newProject: () => set((s) => ({ library: stash(s), project: createProject(), history: [] })),
        openProject: (id) =>
          set((s) => {
            const entry = s.library.find((e) => e.id === id)
            const parsed = entry ? parseProjectFile(entry.project) : null
            if (!entry || !parsed?.ok) return {}
            return { library: stash(s).filter((e) => e.id !== id), project: parsed.project, history: entry.history }
          }),
        deleteLibraryProject: (id) => set((s) => ({ library: s.library.filter((e) => e.id !== id) })),
        resetEverything: () => {
          // Tudo do Studio neste navegador (inclusive cópias de recuperação e preferências de interface).
          for (const storage of [localStorage, sessionStorage]) {
            try {
              for (const key of Object.keys(storage)) if (key.startsWith('atelier-ui:') && key !== STORAGE_KEY) storage.removeItem(key)
            } catch {
              /* armazenamento indisponível */
            }
          }
          useSaveStatus.setState({ failed: false, pruned: false, recoveryKey: null })
          set({ project: createProject(), history: [], library: [] })
        },
        duplicateProject: () =>
          set((s) => {
            const copy = { ...structuredClone(s.project), id: uid('prj'), createdAt: new Date().toISOString() }
            copy.meta = { ...copy.meta, name: `${s.project.meta.name.trim() || 'Projeto sem nome'} (cópia)` }
            return { library: [libraryEntryOf(copy, []), ...s.library] }
          }),
      }
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      // Estados de outra versão passam pela mesma validação/mesclagem em vez de serem descartados.
      migrate: (persisted) => persisted as StudioState,
      partialize: (s) => ({ project: s.project, history: s.history, library: s.library }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<StudioState, 'project' | 'history' | 'library'>> | undefined
        if (!saved?.project) return current
        const parsed = parseProjectFile(saved.project)
        // Projeto salvo inválido: nada é descartado sem antes guardar uma cópia de recuperação.
        if (!parsed.ok) keepRecoveryCopy(JSON.stringify({ state: saved }))
        // Versões também são validadas; só as inválidas ficam de fora.
        const history = Array.isArray(saved.history)
          ? saved.history.flatMap((h) => {
              const p = h && typeof h === 'object' ? parseProjectFile((h as Snapshot).project) : null
              return p?.ok ? [{ ...(h as Snapshot), project: p.project }] : []
            })
          : []
        // Biblioteca: só entradas com projeto válido (as demais são ignoradas, não quebram a abertura).
        const library = Array.isArray(saved.library)
          ? saved.library.flatMap((e) => (e && typeof e === 'object' && parseProjectFile((e as LibraryEntry).project).ok ? [{ ...(e as LibraryEntry), history: Array.isArray((e as LibraryEntry).history) ? (e as LibraryEntry).history : [] }] : []))
          : []
        return {
          ...current,
          project: parsed.ok ? parsed.project : current.project,
          history,
          library,
        }
      },
    },
  ),
)

/** Atalho para ler o projeto com seletor (evita re-renderizações desnecessárias). */
export function useProject<T>(selector: (p: Project) => T): T {
  return useStudio((s) => selector(s.project))
}

/** Acesso às ações sem assinar mudanças de estado. */
export const studio = () => useStudio.getState()
