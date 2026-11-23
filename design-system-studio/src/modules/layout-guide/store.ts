import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { defaultConfig, defaultSelections, emptyContext, type GuideConfig } from './content'
import { buildLayoutPrompt, sanitizeConfig } from './prompt'

/*
 * Estado da ferramenta “Boas práticas de layout”, guardado só neste navegador (chave própria; o
 * “Recomeçar do zero” do Studio também apaga). Não faz parte do projeto exportado: é uma ferramenta.
 *
 * Sincronia do texto: depois de criado, o prompt acompanha as opções enquanto a pessoa não editar o
 * texto. Depois de editado, nada sobrescreve o texto sem confirmação (a tela pede antes).
 */

export const GUIDE_STORAGE_KEY = 'atelier-ui:boas-praticas:v1'

interface GuideState {
  config: GuideConfig
  /** Texto no editor (o prompt, editável). */
  text: string
  /** Configuração (JSON) que gerou o texto atual; null antes da primeira geração. */
  generatedFrom: string | null
  generatedAt: string | null
  /** A pessoa mudou o texto depois de gerado. */
  edited: boolean
  update: (recipe: (c: GuideConfig) => GuideConfig) => void
  /** Gera o texto a partir das opções atuais (substitui o editor). */
  generate: () => void
  setText: (text: string) => void
  /** Tarefa, telas, ambientes, módulos e opções voltam ao padrão; o contexto fica. */
  restoreDefaults: () => void
  /** Esvazia os campos de contexto; as seleções ficam. */
  clearFields: () => void
  /** Tudo do zero (usado pelo “Recomeçar do zero”). */
  resetAll: () => void
}

const guarded: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      /* armazenamento cheio ou bloqueado: a ferramenta segue funcionando sem salvar */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      /* idem */
    }
  },
}

const initial = () => ({ config: defaultConfig(), text: '', generatedFrom: null, generatedAt: null, edited: false })

export const useGuide = create<GuideState>()(
  persist(
    (set, get) => {
      /** Aplica a nova configuração; se o texto acompanha as opções, ele é refeito na hora. */
      const commit = (config: GuideConfig) => {
        const { generatedFrom, edited } = get()
        if (generatedFrom !== null && !edited) set({ config, text: buildLayoutPrompt(config), generatedFrom: JSON.stringify(config), generatedAt: new Date().toISOString() })
        else set({ config })
      }
      return {
        ...initial(),
        update: (recipe) => commit(recipe(get().config)),
        generate: () => {
          const { config } = get()
          set({ text: buildLayoutPrompt(config), generatedFrom: JSON.stringify(config), generatedAt: new Date().toISOString(), edited: false })
        },
        setText: (text) => set({ text, edited: true }),
        restoreDefaults: () => commit({ ...defaultSelections(), context: get().config.context }),
        clearFields: () => commit({ ...get().config, context: emptyContext() }),
        resetAll: () => set(initial()),
      }
    },
    {
      name: GUIDE_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => guarded),
      partialize: (s) => ({ config: s.config, text: s.text, generatedFrom: s.generatedFrom, generatedAt: s.generatedAt, edited: s.edited }),
      // O que vier do navegador é validado: valores desconhecidos voltam ao padrão (nunca quebra a tela).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GuideState>
        return {
          ...current,
          config: sanitizeConfig(p.config),
          text: typeof p.text === 'string' ? p.text.slice(0, 200_000) : '',
          generatedFrom: typeof p.generatedFrom === 'string' ? p.generatedFrom : null,
          generatedAt: typeof p.generatedAt === 'string' ? p.generatedAt : null,
          edited: typeof p.edited === 'boolean' ? p.edited : false,
        }
      },
    },
  ),
)

/** O texto foi gerado com opções diferentes das atuais (só acontece depois de uma edição manual). */
export const isStale = (s: Pick<GuideState, 'config' | 'generatedFrom'>) => s.generatedFrom !== null && s.generatedFrom !== JSON.stringify(s.config)

// “Recomeçar do zero” (core/store) avisa por evento: a ferramenta volta ao estado inicial em memória também.
if (typeof window !== 'undefined') window.addEventListener('atelier:reset-all', () => useGuide.getState().resetAll())
