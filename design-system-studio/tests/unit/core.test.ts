import { beforeEach, describe, expect, it } from 'vitest'
import { contrast, ensureContrast, isHex, mix, normalizeHex } from '@/core/color'
import { createProject } from '@/core/project'
import { parseProjectFile } from '@/core/schema'
import { useStudio } from '@/core/store'
import { projectTokens } from '@/core/theme'
import { deriveTokens, TOKEN_KEYS } from '@/core/tokens'
import { PALETTE_CATEGORIES, palettes } from '@/modules/color/catalog'

const reset = () => {
  localStorage.clear()
  useStudio.setState({ project: createProject(), history: [] })
}

describe('cores', () => {
  it('normaliza e valida hexadecimais', () => {
    expect(isHex('#abc')).toBe(true)
    expect(isHex('zzz')).toBe(false)
    expect(normalizeHex('#ABC')).toBe('#aabbcc')
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
  })
  it('calcula contraste WCAG', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5)
  })
  it('ensureContrast atinge o mínimo pedido', () => {
    const fg = ensureContrast('#bbbbbb', '#ffffff', 4.5)
    expect(contrast(fg, '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })
})

describe('paletas e tokens', () => {
  it('tem 60 paletas em 10 categorias com 6 cada', () => {
    expect(palettes).toHaveLength(60)
    expect(PALETTE_CATEGORIES).toHaveLength(10)
    for (const c of PALETTE_CATEGORIES) expect(palettes.filter((p) => p.category === c.id)).toHaveLength(6)
    expect(new Set(palettes.map((p) => p.id)).size).toBe(60)
  })
  it('deriva pelo menos 32 tokens semânticos válidos para cada paleta', () => {
    expect(TOKEN_KEYS.length).toBeGreaterThanOrEqual(32)
    for (const p of palettes) {
      const t = deriveTokens(p.base)
      for (const k of TOKEN_KEYS) expect(isHex(String(t[k])), `${p.id}.${k} = ${t[k]}`).toBe(true)
    }
  })
  it('garante contraste AA para texto principal, secundário e texto sobre primária', () => {
    for (const p of palettes) {
      const t = deriveTokens(p.base)
      expect(contrast(t.text, t.bg), `${p.id} texto`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t.textMuted, t.bg), `${p.id} secundário`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t.onPrimary, t.primary), `${p.id} sobre primária`).toBeGreaterThanOrEqual(3)
      expect(contrast(t.navText, t.navBg), `${p.id} navegação`).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('store do projeto', () => {
  beforeEach(reset)

  it('preserva escolhas ao alternar entre modos (mesma fonte de dados)', () => {
    const s = useStudio.getState()
    s.selectDesktop('sidebar-integral-classica')
    s.selectMobile('bottom-nav-classica')
    s.setMode('free')
    s.setMode('guided')
    const p = useStudio.getState().project
    expect(p.layout.desktopId).toBe('sidebar-integral-classica')
    expect(p.layout.mobileId).toBe('bottom-nav-classica')
  })

  it('não altera outros módulos ao selecionar em um módulo', () => {
    const s = useStudio.getState()
    s.selectPalette('floresta')
    s.selectDesktop('x')
    const before = useStudio.getState().project
    s.selectLogin('y')
    const after = useStudio.getState().project
    expect(after.identity).toBe(before.identity)
    expect(after.layout).toBe(before.layout)
    expect(after.entry.loginId).toBe('y')
  })

  it('aplica e remove exceções de token', () => {
    const s = useStudio.getState()
    s.setTokenOverride('primary', '#ff0000')
    expect(projectTokens(useStudio.getState().project).primary).toBe('#ff0000')
    s.setTokenOverride('primary', null)
    expect(useStudio.getState().project.identity.overrides).toEqual({})
  })

  it('edita uma instância de componente sem afetar outra', () => {
    const s = useStudio.getState()
    const a = s.addComponent('botoes', 'soft-pill')
    const b = s.addComponent('botoes', 'soft-pill')
    s.setComponentProp(a, 'label', 'Comprar')
    s.setComponentTokenOverride(a, 'primary', '#123456')
    const [ca, cb] = useStudio.getState().project.components
    expect(ca.id).toBe(a)
    expect(ca.props.label).toBe('Comprar')
    expect(cb.id).toBe(b)
    expect(cb.props.label).toBeUndefined()
    expect(cb.tokenOverrides).toEqual({})
  })

  it('duplica e remove componentes, limpando a exclusão do prompt', () => {
    const s = useStudio.getState()
    const a = s.addComponent('cards', 'swiss-minimal', 'Card de produto')
    const copy = s.duplicateComponent(a)!
    expect(useStudio.getState().project.components.find((c) => c.id === copy)?.label).toBe('Card de produto (cópia)')
    s.setExcluded(`component:${a}`, true)
    s.removeComponent(a)
    expect(useStudio.getState().project.prompt.excluded).not.toContain(`component:${a}`)
  })

  it('salva versão antes de limpar e permite restaurar', () => {
    const s = useStudio.getState()
    s.updateMeta({ name: 'Agenda Viva' })
    s.resetProject()
    expect(useStudio.getState().project.meta.name).toBe('')
    const snap = useStudio.getState().history[0]
    expect(snap.label).toMatch(/Antes de limpar/)
    useStudio.getState().restoreSnapshot(snap.id)
    expect(useStudio.getState().project.meta.name).toBe('Agenda Viva')
  })

  it('persiste no localStorage a cada alteração', () => {
    useStudio.getState().updateMeta({ name: 'Persistido' })
    const raw = localStorage.getItem('atelier-ui:studio:v1')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!).state.project.meta.name).toBe('Persistido')
  })
})

describe('importação', () => {
  beforeEach(reset)

  it('aceita projeto, backup e especificação', () => {
    const p = createProject()
    p.meta.name = 'Importado'
    expect(parseProjectFile(p).ok).toBe(true)
    expect(parseProjectFile({ kind: 'atelier-ui/backup', project: p, history: [] }).ok).toBe(true)
    expect(parseProjectFile({ $schema: 'atelier-ui/spec@1', source: p }).ok).toBe(true)
  })

  it('completa arquivos parciais com valores padrão', () => {
    const result = parseProjectFile({ schema: 'atelier-ui/project', version: 1, id: 'x', createdAt: '', updatedAt: '', meta: { name: 'Parcial' } })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.project.meta.name).toBe('Parcial')
      expect(result.project.identity.paletteId).toBeTruthy()
    }
  })

  it('rejeita arquivos inválidos com mensagens claras', () => {
    expect(parseProjectFile({ foo: 1 }).ok).toBe(false)
    const p = createProject() as unknown as Record<string, unknown>
    ;(p.identity as Record<string, unknown>).overrides = { primary: 'vermelho' }
    const r = parseProjectFile(p)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/hexadecimal/)
  })

  it('importProject salva versão anterior', () => {
    const s = useStudio.getState()
    s.updateMeta({ name: 'Antes' })
    const p = createProject()
    p.meta.name = 'Depois'
    expect(s.importProject(p).ok).toBe(true)
    expect(useStudio.getState().project.meta.name).toBe('Depois')
    expect(useStudio.getState().history[0].project.meta.name).toBe('Antes')
  })
})
