import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createProject } from '@/core/project'
import { projectTheme } from '@/core/theme'
import { itemForTarget } from '@/prompt/items'
import { AuthPreview } from '@/modules/entry/AuthPreview'
import { landingById, landings, loginById, logins, signupById, signups } from '@/modules/entry/catalog'
import { LandingPreview } from '@/modules/entry/LandingPreview'
import { LANDING_ARCHITECTURES, type SignupFlow } from '@/modules/entry/types'

const LANDING_NAMES = [
  'Aurora Flow', 'Folha Viva', 'VOLTA Motors', 'Casa Brisa', 'Nexa Finance', 'Formiga Lab', 'North Studio', 'Frost One',
  'Orbit Space', 'Sapore Café', 'Lume Health', 'Pixel Arcade', 'Trilha Livre', 'Monograma', 'Bendita Mesa', 'Atlas Learn',
  'Aurum Audio', 'Refúgio', 'Metric Studio', 'Éter Fashion', 'Campo Claro', 'Studio Frame', 'Pulse Fit', 'Círculo Social',
]

const LOGIN_NAMES = [
  'Clássico central', 'Divisão ilustrada', 'Divisão invertida', 'Editorial claro', 'Acesso escuro', 'Produto em destaque',
  'Cartão elevado', 'Tela cheia clean', 'Marca lateral', 'Acesso corporativo', 'Bem-vindo de volta', 'Foto editorial',
  'Gradiente discreto', 'Acesso com benefícios', 'Janela compacta', 'Formulário horizontal', 'Perfil de equipe',
  'Acesso com etapas', 'Link mágico', 'Organização e equipe', 'Tela dividida sólida', 'Acesso acolhedor', 'Login com QR',
  'Acesso responsivo',
]

const SIGNUP_FLOWS: SignupFlow[] = ['mesma-tela', 'pagina-propria', 'etapas', 'convite', 'sem-senha', 'social-sso', 'perfil', 'simplificado']

const theme = projectTheme(createProject())

describe('catálogos de entrada', () => {
  it('tem 24 landings, 24 logins e 8 cadastros, na ordem pedida', () => {
    expect(landings).toHaveLength(24)
    expect(logins).toHaveLength(24)
    expect(signups).toHaveLength(8)
    expect(landings.map((l) => l.name)).toEqual(LANDING_NAMES)
    expect(logins.map((l) => l.name)).toEqual(LOGIN_NAMES)
    expect(signups.map((s) => s.id)).toEqual(SIGNUP_FLOWS)
    expect(signups.map((s) => s.flow)).toEqual(SIGNUP_FLOWS)
  })

  it('usa ids únicos em kebab-case', () => {
    for (const list of [landings, logins, signups]) {
      const ids = list.map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
      for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('usa cada uma das 12 arquiteturas exatamente duas vezes', () => {
    expect(LANDING_ARCHITECTURES).toHaveLength(12)
    for (const a of LANDING_ARCHITECTURES) {
      expect(landings.filter((l) => l.architecture === a.id), a.id).toHaveLength(2)
    }
    // As duas marcas de cada arquitetura são variações diferentes da composição.
    for (const a of LANDING_ARCHITECTURES) {
      const pair = landings.filter((l) => l.architecture === a.id)
      expect(pair.map((l) => l.content.variant).sort()).toEqual([0, 1])
      expect(pair[0].content.motif).not.toBe(pair[1].content.motif)
    }
  })

  it('toda spec tem summary, structure e responsive preenchidos', () => {
    for (const item of [...landings, ...logins, ...signups]) {
      expect(item.spec.summary.trim(), item.id).not.toBe('')
      expect(item.spec.structure.length, item.id).toBeGreaterThan(0)
      expect(item.spec.responsive.length, item.id).toBeGreaterThan(0)
      for (const line of [...item.spec.structure, ...item.spec.responsive]) expect(line.trim(), item.id).not.toBe('')
    }
  })

  it('landings têm seções, cores de demonstração e fonte válidas', () => {
    for (const l of landings) {
      expect(l.sections.length, l.id).toBeGreaterThanOrEqual(5)
      expect(l.sections[0]).toMatch(/Header|Masthead/)
      for (const c of Object.values(l.demo)) expect(c).toMatch(/^#[0-9a-f]{6}$/i)
      expect(['inter', 'system', 'space-grotesk', 'fraunces', 'georgia', 'jetbrains-mono']).toContain(l.headingFont)
      expect(l.spec.measurements && Object.keys(l.spec.measurements).length).toBeGreaterThan(0)
    }
  })

  it('logins lembram que a autenticação real exige backend seguro', () => {
    for (const l of logins) expect(l.spec.notes?.join(' '), l.id).toMatch(/backend seguro/)
  })

  it('cadastros cobrem validação, senha, recuperação, acessibilidade e teclado virtual', () => {
    for (const s of signups) {
      const text = [...s.spec.structure, ...(s.spec.behavior ?? []), ...s.spec.responsive, ...(s.spec.notes ?? [])].join(' ').toLowerCase()
      expect(text, s.id).toMatch(/erro/)
      expect(text, s.id).toMatch(/autocomplete/)
      expect(text, s.id).toMatch(/teclado/)
      expect(text, s.id).toMatch(/320 px|375/)
      expect(text, s.id).toMatch(/backend seguro/)
      if (s.flow !== 'sem-senha') {
        expect(text, s.id).toMatch(/mostrar\/ocultar/)
        expect(text, s.id).toMatch(/esqueci minha senha|recupera/)
      }
    }
  })

  it('funções ById encontram os itens e devolvem undefined para ids inexistentes', () => {
    expect(landingById('volta-motors')?.architecture).toBe('cinematografica')
    expect(landingById('metric-studio')?.architecture).toBe('dashboard')
    expect(landingById('monograma')?.architecture).toBe('editorial')
    expect(loginById('login-qr')?.name).toBe('Login com QR')
    expect(signupById('etapas')?.steps).toHaveLength(3)
    expect(landingById(null)).toBeUndefined()
    expect(loginById('nao-existe')).toBeUndefined()
  })

  it('o motor de prompts gera itens a partir dos catálogos', () => {
    const project = createProject()
    const landing = itemForTarget({ kind: 'landing', id: 'aurora-flow' }, project)
    expect(landing?.structure.join(' ')).toMatch(/Ordem das seções/)
    const login = itemForTarget({ kind: 'login', id: 'acesso-etapas' }, project)
    expect(login?.notes.join(' ')).toMatch(/backend seguro/)
    const signup = itemForTarget({ kind: 'signup', id: 'convite' }, project)
    expect(signup?.properties.campos).toContain('Nome')
  })
})

describe('LandingPreview', () => {
  it('renderiza a landing com header, hero e rodapé no computador', () => {
    const model = landingById('aurora-flow')!
    render(<LandingPreview model={model} device="desktop" />)
    const root = screen.getByTestId('landing-preview')
    expect(root).toHaveAttribute('data-architecture', 'hero-centralizado')
    expect(within(root).getByRole('heading', { level: 1 })).toHaveTextContent(model.content.title)
    expect(within(root).getByText('Entrar')).toBeInTheDocument()
    expect(within(root).getByRole('contentinfo')).toBeInTheDocument()
  })

  it('no celular usa menu hambúrguer que abre a navegação', () => {
    const model = landingById('nexa-finance')!
    render(<LandingPreview model={model} device="mobile" theme={theme} />)
    const toggle = screen.getByRole('button', { name: 'Abrir menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByText(model.content.nav[0]).length).toBeGreaterThan(0)
  })

  it('renderiza todas as 24 landings nos dois dispositivos sem erro', () => {
    for (const l of landings) {
      for (const device of ['desktop', 'mobile'] as const) {
        const { unmount } = render(<LandingPreview model={l} device={device} theme={device === 'mobile' ? theme : null} />)
        expect(screen.getByTestId('landing-preview')).toHaveAttribute('data-device', device)
        unmount()
      }
    }
  })

  it('miniatura estática não contém botões nem campos', () => {
    const { container } = render(<LandingPreview model={landingById('pixel-arcade')!} device="desktop" interactive={false} compact />)
    expect(container.querySelectorAll('button, input, a').length).toBe(0)
  })
})

describe('AuthPreview', () => {
  it('mostra campos com labels, autocomplete e mostrar/ocultar senha', () => {
    render(<AuthPreview login={logins[0]} view="login" device="desktop" theme={theme} />)
    const email = screen.getByLabelText('E-mail')
    expect(email).toHaveAttribute('autocomplete', 'username')
    const password = screen.getByLabelText('Senha')
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toHaveAttribute('autocomplete', 'current-password')
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('valida ao enviar vazio e mostra os estados de erro forçados', () => {
    const { rerender } = render(<AuthPreview login={logins[0]} view="login" device="desktop" theme={theme} />)
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Revise')
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
    rerender(<AuthPreview login={logins[0]} view="login" device="desktop" theme={theme} showErrors />)
    expect(screen.getByRole('alert')).toHaveTextContent('E-mail ou senha incorretos')
  })

  it('leva para a recuperação de senha e troca entre Entrar e Criar conta', () => {
    render(<AuthPreview login={logins[0]} signup={signupById('pagina-propria')} view="login" device="mobile" theme={theme} />)
    fireEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }))
    expect(screen.getByRole('heading', { name: 'Recuperar senha' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Voltar para entrar/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByTestId('auth-preview')).toHaveAttribute('data-view', 'signup')
    expect(screen.getByLabelText('Confirmar senha')).toHaveAttribute('autocomplete', 'new-password')
  })

  it('cadastro em etapas mostra o indicador e avança', () => {
    render(<AuthPreview login={logins[0]} signup={signupById('etapas')} view="signup" device="desktop" theme={theme} />)
    expect(screen.getByRole('list', { name: 'Etapas do cadastro' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@exemplo.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'Senha1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByLabelText('Empresa')).toHaveAttribute('autocomplete', 'organization')
  })

  it('renderiza as 24 composições e os 8 fluxos sem erro', () => {
    for (const l of logins) {
      for (const device of ['desktop', 'mobile'] as const) {
        const { unmount } = render(<AuthPreview login={l} view="login" device={device} theme={theme} />)
        expect(screen.getByTestId('auth-preview')).toHaveAttribute('data-layout', l.layout)
        unmount()
      }
    }
    for (const s of signups) {
      const { unmount } = render(<AuthPreview login={logins[1]} signup={s} view="signup" device="mobile" theme={theme} />)
      expect(screen.getByTestId('auth-preview')).toHaveAttribute('data-view', 'signup')
      unmount()
    }
  })

  it('miniatura estática não contém campos reais', () => {
    const { container } = render(<AuthPreview login={loginById('login-qr')!} view="login" device="desktop" theme={theme} interactive={false} />)
    expect(container.querySelectorAll('input, button').length).toBe(0)
  })
})
