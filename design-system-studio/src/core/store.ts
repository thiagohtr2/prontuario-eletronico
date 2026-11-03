import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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

interface StudioState {
  project: Project
  history: Snapshot[]

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
  selectLogin: (id: string | null) => void
  selectSignup: (id: string | null) => void

  // Arquitetura
  selectDesktop: (id: string | null) => void
  selectMobile: (id: string | null) => void

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
}

type Recipe = (p: Project) => Project

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => {
      /** Aplica uma alteração imutável e atualiza `updatedAt`. */
      const edit = (recipe: Recipe) =>
        set((s) => ({ project: { ...recipe(s.project), updatedAt: new Date().toISOString() } }))

      const snapshotOf = (label: string, project: Project): Snapshot => ({
        id: uid('snap'),
        label,
        createdAt: new Date().toISOString(),
        project: structuredClone(project),
      })

      const pushSnapshot = (label: string) =>
        set((s) => ({ history: [snapshotOf(label, s.project), ...s.history].slice(0, MAX_SNAPSHOTS) }))

      return {
        project: createProject(),
        history: [],

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
        selectSignup: (id) => edit((p) => ({ ...p, entry: { ...p.entry, signupId: id } })),

        selectDesktop: (id) => edit((p) => ({ ...p, layout: { ...p.layout, desktopId: id } })),
        selectMobile: (id) => edit((p) => ({ ...p, layout: { ...p.layout, mobileId: id } })),

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
            return { project: { ...result.project, updatedAt: new Date().toISOString() }, history }
          })
          return { ok: true, versions: snapshots.length, skipped }
        },
        resetProject: () => {
          pushSnapshot('Antes de limpar o projeto')
          set({ project: createProject() })
        },
      }
    },
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ project: s.project, history: s.history }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Pick<StudioState, 'project' | 'history'>> | undefined
        if (!saved?.project) return current
        const parsed = parseProjectFile(saved.project)
        return {
          ...current,
          project: parsed.ok ? parsed.project : current.project,
          history: Array.isArray(saved.history) ? saved.history : [],
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
