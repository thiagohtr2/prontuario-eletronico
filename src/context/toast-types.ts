export type ToastKind = 'success' | 'error' | 'warning'

export type ToastItem = {
  id: number
  kind: ToastKind
  message: string
}
