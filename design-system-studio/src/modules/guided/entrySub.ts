/** Partes da etapa de entrada do guiado e o evento que abre uma delas (sem carregar a etapa). */
export type EntrySub = 'fluxo' | 'landing' | 'login' | 'cadastro'
export const SUB_EVENT = 'atelier-ui:entry-sub'

/** Abre uma parte da etapa de entrada (usado pelo botão “Continuar” para levar ao que falta). */
export function openEntrySub(sub: EntrySub) {
  window.dispatchEvent(new CustomEvent(SUB_EVENT, { detail: sub }))
}
