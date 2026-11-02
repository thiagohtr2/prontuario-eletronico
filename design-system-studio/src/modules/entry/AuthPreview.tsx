import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Plus,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { ensureContrast, isDark, mix, readableOn, withAlpha } from '@/core/color'
import { useProject } from '@/core/store'
import { surfaceStyle } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'
import { Motif } from './motifs'
import type { LoginModel, SignupFlow, SignupModel } from './types'
import './entry.css'

/* ========================================================================== */
/* Tokens da demonstração (herdados da identidade global)                      */
/* ========================================================================== */

interface AT {
  dark: boolean
  bg: string
  bgAlt: string
  surface: string
  surfaceAlt: string
  text: string
  muted: string
  border: string
  borderStrong: string
  primary: string
  onPrimary: string
  primarySoft: string
  accent: string
  error: string
  errorBg: string
  success: string
  successBg: string
  focus: string
  placeholder: string
  link: string
  navBg: string
  navText: string
  gradFrom: string
  gradTo: string
  r: number
  rs: number
  rl: number
  bw: number
  shadow: string
  heading: string
  body: string
  hw: number
  card: CSSProperties
}

function authTokens(theme: ResolvedTheme, forceDark: boolean): AT {
  const t = theme.tokens
  const mt = theme.metrics
  const base: AT = {
    dark: t.mode === 'dark',
    bg: t.bg,
    bgAlt: t.bgAlt,
    surface: t.surface,
    surfaceAlt: t.surfaceAlt,
    text: t.text,
    muted: t.textMuted,
    border: t.border,
    borderStrong: t.borderStrong,
    primary: t.primary,
    onPrimary: t.onPrimary,
    primarySoft: t.primarySoft,
    accent: t.accent,
    error: t.error,
    errorBg: t.errorBg,
    success: t.success,
    successBg: t.successBg,
    focus: t.focusRing,
    placeholder: t.placeholder,
    link: t.link,
    navBg: t.navBg,
    navText: t.navText,
    gradFrom: t.gradientFrom,
    gradTo: t.gradientTo,
    r: mt.radiusMd,
    rs: mt.radiusSm,
    rl: Math.min(mt.radiusLg, 28),
    bw: Math.max(1, mt.borderWidth),
    shadow: mt.shadow,
    heading: mt.headingFont,
    body: mt.bodyFont,
    hw: theme.typography.headingWeight,
    card: surfaceStyle(theme),
  }
  if (!forceDark || base.dark) return base
  // Composição "Acesso escuro": deriva uma versão escura da paleta clara.
  const bg = mix(isDark(t.text) ? t.text : '#16161a', '#000000', 0.55)
  const surface = mix(bg, '#ffffff', 0.06)
  const text = '#f4f4f6'
  const primary = ensureContrast(t.primary, bg, 3.2)
  return {
    ...base,
    dark: true,
    bg,
    bgAlt: mix(bg, '#ffffff', 0.04),
    surface,
    surfaceAlt: mix(surface, '#ffffff', 0.05),
    text,
    muted: mix(text, bg, 0.36),
    border: mix(surface, '#ffffff', 0.14),
    borderStrong: mix(surface, '#ffffff', 0.28),
    primary,
    onPrimary: readableOn(primary),
    primarySoft: mix(surface, primary, 0.22),
    error: ensureContrast(t.error, surface, 4.5),
    errorBg: mix(surface, t.error, 0.2),
    success: ensureContrast(t.success, surface, 4.5),
    successBg: mix(surface, t.success, 0.2),
    focus: primary,
    placeholder: mix(text, bg, 0.52),
    link: ensureContrast(primary, surface, 4.5),
    card: { background: withAlpha(surface, 0.72), border: `1px solid ${withAlpha('#ffffff', 0.12)}`, backdropFilter: 'blur(12px)', boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)' },
  }
}

/* ========================================================================== */
/* Campos e validação                                                          */
/* ========================================================================== */

type FieldId = 'email' | 'password' | 'confirm' | 'name' | 'company' | 'job' | 'phone' | 'code' | 'space'

interface FieldDef {
  id: FieldId
  label: string
  type: 'text' | 'email' | 'password' | 'tel'
  autoComplete: string
  inputMode?: 'email' | 'tel' | 'numeric' | 'text'
  placeholder: string
}

const F: Record<string, FieldDef> = {
  email: { id: 'email', label: 'E-mail', type: 'email', autoComplete: 'username', inputMode: 'email', placeholder: 'nome@empresa.com' },
  emailNew: { id: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', inputMode: 'email', placeholder: 'nome@empresa.com' },
  emailWork: { id: 'email', label: 'E-mail corporativo', type: 'email', autoComplete: 'username', inputMode: 'email', placeholder: 'voce@suaempresa.com' },
  password: { id: 'password', label: 'Senha', type: 'password', autoComplete: 'current-password', placeholder: 'Sua senha' },
  pin: { id: 'password', label: 'Senha ou PIN', type: 'password', autoComplete: 'current-password', placeholder: 'Digite sua senha' },
  newPassword: { id: 'password', label: 'Senha', type: 'password', autoComplete: 'new-password', placeholder: 'Mínimo de 8 caracteres' },
  confirm: { id: 'confirm', label: 'Confirmar senha', type: 'password', autoComplete: 'new-password', placeholder: 'Repita a senha' },
  name: { id: 'name', label: 'Nome', type: 'text', autoComplete: 'name', placeholder: 'Como podemos te chamar?' },
  fullName: { id: 'name', label: 'Nome completo', type: 'text', autoComplete: 'name', placeholder: 'Seu nome completo' },
  orgName: { id: 'name', label: 'Nome da empresa', type: 'text', autoComplete: 'organization', placeholder: 'Empresa Exemplo Ltda.' },
  company: { id: 'company', label: 'Empresa', type: 'text', autoComplete: 'organization', placeholder: 'Onde você trabalha' },
  job: { id: 'job', label: 'Cargo', type: 'text', autoComplete: 'organization-title', placeholder: 'Sua função' },
  phone: { id: 'phone', label: 'Telefone', type: 'tel', autoComplete: 'tel', inputMode: 'tel', placeholder: '(11) 90000-0000' },
  code: { id: 'code', label: 'Código de 6 dígitos', type: 'text', autoComplete: 'one-time-code', inputMode: 'numeric', placeholder: '••••••' },
  space: { id: 'space', label: 'Endereço do espaço', type: 'text', autoComplete: 'off', placeholder: 'sua-empresa' },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function fieldError(f: FieldDef, value: string, signup: boolean, values: Record<string, string>, forced: boolean): string | undefined {
  const v = value.trim()
  switch (f.id) {
    case 'email':
      if (forced) return 'Digite um e-mail válido, como nome@empresa.com.'
      if (!v) return 'Informe seu e-mail.'
      if (!EMAIL_RE.test(v)) return 'Digite um e-mail válido, como nome@empresa.com.'
      return
    case 'password':
      if (signup) {
        if (forced || value.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
        return
      }
      if (forced || !value) return 'Informe sua senha.'
      return
    case 'confirm':
      if (forced || value !== (values.password ?? '') || !value) return 'As senhas não coincidem.'
      return
    case 'name':
      if (forced || !v) return f.label === 'Nome da empresa' ? 'Informe o nome da empresa.' : 'Informe seu nome.'
      return
    case 'company':
      if (forced || !v) return 'Informe o nome da empresa.'
      return
    case 'job':
      return
    case 'phone':
      if (forced || v.replace(/\D/g, '').length < 10) return 'Informe um telefone com DDD.'
      return
    case 'code':
      if (forced) return 'Código incorreto. Restam 2 tentativas.'
      if (!/^\d{6}$/.test(v)) return 'Digite os 6 números do código.'
      return
    case 'space':
      if (forced || !v) return 'Informe o endereço do seu espaço.'
      return
  }
}

/* ========================================================================== */
/* QR code ilustrativo (determinístico)                                        */
/* ========================================================================== */

function QrSvg({ fg, bg, size = 168 }: { fg: string; bg: string; size?: number }) {
  const n = 25
  const cells = useMemo(() => {
    const out: [number, number][] = []
    let s = 1337
    const finder = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        s = (s * 9301 + 49297) % 233280
        if (!finder(x, y) && s / 233280 > 0.52) out.push([x, y])
      }
    return out
  }, [])
  const finderAt = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill={fg} />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill={bg} />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill={fg} />
    </g>
  )
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} role="img" aria-label="QR code de demonstração" style={{ display: 'block', background: bg }} shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill={fg} />
      ))}
      {finderAt(0, 0)}
      {finderAt(n - 7, 0)}
      {finderAt(0, n - 7)}
    </svg>
  )
}

/* ========================================================================== */
/* Primitivas (nível de módulo: tipos estáveis, os campos não remontam)        */
/* ========================================================================== */

interface ACtx {
  T: AT
  m: boolean
  live: boolean
  fs: number
  inputH: number
  underline: boolean
  friendly: boolean
  uid: string
  brand: string
  values: Record<string, string>
  set: (id: string, value: string) => void
  errors: Partial<Record<FieldId, string>>
  readOnlyIds: string[]
  showPw: boolean
  toggleShowPw: () => void
  submit: (e?: FormEvent) => void
  isSignup: boolean
  view: 'login' | 'signup'
  setView: (v: 'login' | 'signup') => void
  flow?: SignupFlow
  errorsVisible: boolean
  errorCount: number
  forced: boolean
  hasPassword: boolean
  goRecover: () => void
}

const AuthCtx = createContext<ACtx | null>(null)
const useA = () => useContext(AuthCtx) as ACtx

function Btn({
  children,
  kind = 'primary',
  type = 'button',
  onClick,
  style,
  ariaLabel,
}: {
  children: ReactNode
  kind?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  onClick?: () => void
  style?: CSSProperties
  ariaLabel?: string
}) {
  const { T, live, inputH, friendly, fs } = useA()
  const s: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    minHeight: inputH,
    padding: '0 18px',
    borderRadius: friendly ? 999 : T.r,
    border: `${T.bw}px solid ${kind === 'primary' ? 'transparent' : T.borderStrong}`,
    background: kind === 'primary' ? T.primary : T.surface,
    color: kind === 'primary' ? T.onPrimary : T.text,
    fontFamily: T.body,
    fontSize: fs,
    fontWeight: 620,
    lineHeight: 1.2,
    cursor: live ? 'pointer' : undefined,
    textAlign: 'center',
    ...style,
  }
  return live ? (
    <button type={type} style={s} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ) : (
    <span style={s}>{children}</span>
  )
}

function LinkBtn({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  const { T, live, m, underline } = useA()
  const s: CSSProperties = {
    background: 'none',
    border: 0,
    padding: 0,
    color: T.link,
    fontSize: m ? 15 : 14,
    fontWeight: 600,
    textDecoration: underline ? 'underline' : 'none',
    textUnderlineOffset: 3,
    cursor: live ? 'pointer' : undefined,
    fontFamily: T.body,
    ...style,
  }
  return live ? (
    <button type="button" onClick={onClick} style={s}>
      {children}
    </button>
  ) : (
    <span style={s}>{children}</span>
  )
}

function Field({ f, trailing, labelAside, hint }: { f: FieldDef; trailing?: ReactNode; labelAside?: ReactNode; hint?: ReactNode }) {
  const { T, m, live, fs, inputH, underline, friendly, uid, values, set, errors, readOnlyIds, showPw, toggleShowPw } = useA()
  const id = `${uid}-${f.id}`
  const error = errors[f.id]
  const readOnly = readOnlyIds.includes(f.id)
  const isPw = f.type === 'password'
  const type = isPw && showPw ? 'text' : f.type
  const value = values[f.id] ?? ''
  const labelStyle: CSSProperties = { fontSize: m ? 15 : 14, fontWeight: 600, color: T.text }
  const box: CSSProperties = {
    width: '100%',
    height: inputH,
    padding: underline ? '0 2px' : '0 14px',
    paddingRight: 46,
    borderRadius: underline ? 0 : friendly ? Math.max(T.r, 14) : T.r,
    border: underline ? 'none' : `${T.bw}px solid ${error ? T.error : T.borderStrong}`,
    borderBottom: `${underline ? 2 : T.bw}px solid ${error ? T.error : T.borderStrong}`,
    background: underline ? 'transparent' : readOnly ? T.surfaceAlt : T.surface,
    color: readOnly ? T.muted : T.text,
    fontSize: fs,
    fontFamily: T.body,
    boxShadow: error && !underline ? `0 0 0 3px ${withAlpha(T.error, 0.14)}` : 'none',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }
  const codeStyle: CSSProperties = f.id === 'code' ? { letterSpacing: '0.6em', justifyContent: 'center', textAlign: 'center', fontSize: 22, fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace", paddingRight: 14 } : {}
  const iconAt: CSSProperties = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: T.muted, display: 'grid' }
  const side = isPw ? (
    live ? (
      <button
        type="button"
        onClick={toggleShowPw}
        aria-label={showPw ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={showPw}
        aria-controls={id}
        style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, display: 'grid', placeItems: 'center', border: 0, background: 'transparent', color: T.muted, borderRadius: T.rs, cursor: 'pointer' }}
      >
        {showPw ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    ) : (
      <span style={iconAt}>
        <Eye size={19} />
      </span>
    )
  ) : readOnly ? (
    <span style={iconAt}>
      <Lock size={16} />
    </span>
  ) : (
    trailing
  )
  return (
    <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        {live ? (
          <label htmlFor={id} style={labelStyle}>
            {f.label}
          </label>
        ) : (
          <span style={labelStyle}>{f.label}</span>
        )}
        {labelAside}
      </div>
      <div style={{ position: 'relative' }}>
        {live ? (
          <input
            id={id}
            name={f.id}
            type={type}
            autoComplete={f.autoComplete}
            inputMode={f.inputMode}
            placeholder={f.placeholder}
            value={value}
            readOnly={readOnly}
            onChange={(e) => set(f.id, f.id === 'code' ? e.target.value.replace(/\D/g, '').slice(0, 6) : e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
            maxLength={f.id === 'code' ? 6 : undefined}
            style={{ ...box, ...codeStyle }}
          />
        ) : (
          <span style={{ ...box, ...codeStyle, color: value ? T.text : T.placeholder }}>{value || (f.id === 'code' ? '••••••' : f.placeholder)}</span>
        )}
        {side}
      </div>
      {error ? (
        <span id={`${id}-err`} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, color: T.error, fontSize: m ? 14 : 13.5, lineHeight: 1.35 }}>
          <AlertCircle size={15} style={{ flex: 'none', marginTop: 1 }} aria-hidden="true" />
          {friendly ? `Ops! ${error}` : error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} style={{ color: T.muted, fontSize: 13.5 }}>
          {hint}
        </span>
      ) : null}
    </div>
  )
}

function Checkbox({ id, label, error }: { id: string; label: ReactNode; error?: string }) {
  const { T, live, values, set } = useA()
  const checked = values[id] === 'yes'
  const box = (
    <span style={{ width: 20, height: 20, flex: 'none', borderRadius: Math.min(T.rs, 6), border: `${T.bw}px solid ${error ? T.error : T.borderStrong}`, background: checked ? T.primary : T.surface, color: T.onPrimary, display: 'grid', placeItems: 'center' }}>
      {checked && <Check size={14} />}
    </span>
  )
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      {live ? (
        <label style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.text, cursor: 'pointer', minHeight: 32 }}>
          <input type="checkbox" checked={checked} onChange={(e) => set(id, e.target.checked ? 'yes' : '')} aria-invalid={error ? true : undefined} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
          {box}
          <span>{label}</span>
        </label>
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          {box}
          {label}
        </span>
      )}
      {error && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.error, fontSize: 13.5 }}>
          <AlertCircle size={15} aria-hidden="true" /> {error}
        </span>
      )}
    </div>
  )
}

function Divider({ label = 'ou' }: { label?: string }) {
  const { T } = useA()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: T.muted, fontSize: 13, textAlign: 'center' }}>
      <span style={{ flex: 1, height: 1, background: T.border }} />
      {label}
      <span style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  )
}

function LogoMark({ size = 34, inverse = false }: { size?: number; inverse?: boolean }) {
  const { T } = useA()
  return (
    <span style={{ width: size, height: size, borderRadius: Math.min(T.r, size / 3), background: inverse ? T.onPrimary : T.primary, display: 'grid', placeItems: 'center', flex: 'none' }}>
      <span style={{ width: size * 0.4, height: size * 0.4, borderRadius: 99, background: inverse ? T.primary : T.onPrimary }} />
    </span>
  )
}

function Brand({ color, size = 34, center = false, inverse = false }: { color?: string; size?: number; center?: boolean; inverse?: boolean }) {
  const { T, brand } = useA()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: center ? 'center' : 'flex-start', color: color ?? T.text, fontFamily: T.heading, fontWeight: 700, fontSize: size * 0.56, letterSpacing: '-0.01em' }}>
      <LogoMark size={size} inverse={inverse} />
      {brand}
    </span>
  )
}

function Title({ text, sub, center, size }: { text: string; sub?: string; center?: boolean; size?: number }) {
  const { T, m } = useA()
  return (
    <div style={{ display: 'grid', gap: 6, textAlign: center ? 'center' : 'left' }}>
      <h2 style={{ margin: 0, fontFamily: T.heading, fontWeight: T.hw, fontSize: size ?? (m ? 26 : 28), lineHeight: 1.15, letterSpacing: '-0.015em', color: T.text }}>{text}</h2>
      {sub && <p style={{ margin: 0, color: T.muted, fontSize: m ? 15.5 : 15 }}>{sub}</p>}
    </div>
  )
}

function Banner({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  const { T } = useA()
  const color = tone === 'error' ? T.error : tone === 'success' ? T.success : T.primary
  const bg = tone === 'error' ? T.errorBg : tone === 'success' ? T.successBg : T.primarySoft
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? CheckCircle2 : Sparkles
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: T.r === 999 ? 16 : T.r, background: bg, color: tone === 'info' ? T.text : color, border: `1px solid ${withAlpha(color, 0.28)}`, fontSize: 14, lineHeight: 1.4 }}>
      <Icon size={18} style={{ flex: 'none', color, marginTop: 1 }} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function ErrorSummary() {
  const { errorsVisible, errorCount, isSignup, forced, hasPassword } = useA()
  if (!errorsVisible || errorCount === 0) return null
  return (
    <Banner tone="error">
      {!isSignup && forced && hasPassword ? (
        <>
          <strong>E-mail ou senha incorretos.</strong> Confira os dados ou recupere sua senha.
        </>
      ) : (
        <>
          <strong>Revise {errorCount === 1 ? 'o campo destacado' : `os ${errorCount} campos destacados`}</strong> para continuar.
        </>
      )}
    </Banner>
  )
}

function PasswordAside() {
  const { isSignup, goRecover } = useA()
  return isSignup ? null : <LinkBtn onClick={goRecover}>Esqueci minha senha</LinkBtn>
}

function Requirements() {
  const { T, values } = useA()
  const pw = values.password ?? ''
  const rules = [
    ['Pelo menos 8 caracteres', pw.length >= 8],
    ['Uma letra maiúscula', /[A-Z]/.test(pw)],
    ['Um número', /\d/.test(pw)],
  ] as const
  return (
    <span role="list" aria-label="Requisitos da senha" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 13 }}>
      {rules.map(([label, ok]) => (
        <span role="listitem" key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: ok ? T.success : T.muted }}>
          {ok ? <CheckCircle2 size={14} aria-hidden="true" /> : <span style={{ width: 12, height: 12, borderRadius: 9, border: `1.5px solid ${T.borderStrong}` }} aria-hidden="true" />}
          {label}
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{ok ? ' (cumprido)' : ' (pendente)'}</span>
        </span>
      ))}
    </span>
  )
}

function SwitchLine() {
  const { T, m, flow, isSignup, setView } = useA()
  if (flow === 'mesma-tela') return null
  return (
    <p style={{ margin: 0, textAlign: 'center', fontSize: m ? 15 : 14, color: T.muted }}>
      {isSignup ? 'Já tem conta? ' : 'Não tem conta? '}
      <LinkBtn onClick={() => setView(isSignup ? 'login' : 'signup')}>{isSignup ? 'Entrar' : 'Criar conta'}</LinkBtn>
    </p>
  )
}

function AuthTabs() {
  const { T, m, live, view, setView } = useA()
  return (
    <div role={live ? 'tablist' : undefined} aria-label="Entrar ou criar conta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${T.border}` }}>
      {(['login', 'signup'] as const).map((v) => {
        const active = view === v
        const s: CSSProperties = { minHeight: 44, border: 0, background: 'transparent', borderBottom: `2px solid ${active ? T.primary : 'transparent'}`, marginBottom: -1, color: active ? T.text : T.muted, fontWeight: active ? 680 : 560, fontSize: m ? 16 : 15, cursor: live ? 'pointer' : undefined, fontFamily: T.body }
        return live ? (
          <button key={v} type="button" role="tab" aria-selected={active} onClick={() => !active && setView(v)} style={s}>
            {v === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        ) : (
          <span key={v} style={{ ...s, display: 'grid', placeItems: 'center' }}>
            {v === 'login' ? 'Entrar' : 'Criar conta'}
          </span>
        )
      })}
    </div>
  )
}

const PROVIDERS: [LucideIcon, string][] = [
  [Users, 'Continuar com conta social'],
  [Building2, 'Continuar com SSO da empresa'],
  [KeyRound, 'Continuar com outro provedor'],
]

function ProviderButtons() {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {PROVIDERS.map(([Icon, label]) => (
        <Btn key={label} kind="secondary">
          <Icon size={18} aria-hidden="true" /> {label}
        </Btn>
      ))}
    </div>
  )
}

function Wrapper({ children, gap = 18 }: { children: ReactNode; gap?: number }) {
  const { live, submit, isSignup } = useA()
  return live ? (
    <form noValidate onSubmit={submit} aria-label={isSignup ? 'Criar conta' : 'Entrar'} style={{ display: 'grid', gap, minWidth: 0 }}>
      {children}
    </form>
  ) : (
    <div style={{ display: 'grid', gap, minWidth: 0 }}>{children}</div>
  )
}

function Card({ children, width = 420, style }: { children: ReactNode; width?: number; style?: CSSProperties }) {
  const { T, m } = useA()
  return <div style={{ width: '100%', maxWidth: width, borderRadius: T.rl, padding: m ? 20 : 32, ...T.card, ...style }}>{children}</div>
}

function Center({ children, style, gap = 24 }: { children: ReactNode; style?: CSSProperties; gap?: number }) {
  const { m } = useA()
  return <div style={{ minHeight: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap, padding: m ? '32px 20px' : '48px 32px', ...style }}>{children}</div>
}

function Legal({ color }: { color?: string }) {
  const { T } = useA()
  return (
    <div style={{ display: 'flex', gap: 18, justifyContent: 'center', fontSize: 13, color: color ?? T.muted, flexWrap: 'wrap' }}>
      <span>Termos</span>
      <span>Privacidade</span>
      <span>Ajuda</span>
    </div>
  )
}

/* ========================================================================== */
/* Componente público                                                          */
/* ========================================================================== */

export interface AuthPreviewProps {
  login: LoginModel
  signup?: SignupModel | null
  view: 'login' | 'signup'
  device: 'desktop' | 'mobile'
  theme: ResolvedTheme
  onViewChange?: (view: 'login' | 'signup') => void
  /** Força a exibição dos estados de erro (mensagens por campo e resumo). */
  showErrors?: boolean
  /** false = miniatura estática (sem campos nem botões reais). */
  interactive?: boolean
  /** Renderiza apenas o formulário (sem a composição da tela). */
  formOnly?: boolean
}

/**
 * Demonstração interativa de login e cadastro. Não autentica nada: mostra campos,
 * validação, mensagens, mostrar/ocultar senha, recuperação e a hierarquia da tela.
 */
export function AuthPreview(props: AuthPreviewProps) {
  const { view, onViewChange, login, signup } = props
  const [localView, setLocalView] = useState(view)
  useEffect(() => setLocalView(view), [view])
  const current = onViewChange ? view : localView
  const setView = (v: 'login' | 'signup') => (onViewChange ? onViewChange(v) : setLocalView(v))
  return <AuthScreen key={`${login.id}:${signup?.id ?? ''}:${current}`} {...props} view={current} setView={setView} />
}

type Mode = 'form' | 'loading' | 'success' | 'recover' | 'recover-sent' | 'link-sent'

function AuthScreen({
  login,
  signup,
  view,
  device,
  theme,
  showErrors = false,
  interactive = true,
  formOnly = false,
  setView,
}: AuthPreviewProps & { setView: (v: 'login' | 'signup') => void }) {
  const layout = login.layout
  const T = useMemo(() => authTokens(theme, layout === 'acesso-escuro'), [theme, layout])
  const m = device === 'mobile'
  const live = interactive
  const uid = useId()
  const projectName = useProject((p) => p.meta.name)
  const brand = projectName.trim() || 'Seu sistema'
  const isSignup = view === 'signup'
  const flow = signup?.flow

  const [values, setValues] = useState<Record<string, string>>((): Record<string, string> => (flow === 'convite' && isSignup ? { email: 'voce@empresa.com' } : {}))
  const [showPw, setShowPw] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [mode, setMode] = useState<Mode>('form')
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState<number | null>(layout === 'perfil-equipe' ? 0 : null)
  const [role, setRole] = useState<number | null>(null)
  const [method, setMethod] = useState<'email' | 'tel'>('email')
  const [usePassword, setUsePassword] = useState(false)
  const [interests, setInterests] = useState<number[]>([1])
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const set = (id: string, value: string) => setValues((s) => ({ ...s, [id]: value }))
  const fs = m ? 16 : 15
  const inputH = layout === 'acesso-responsivo' ? 56 : m ? 48 : 44
  const underline = layout === 'editorial-claro'
  const friendly = layout === 'acesso-acolhedor'

  /* ---------------------------- campos ativos ----------------------------- */

  const fields: FieldDef[] = (() => {
    if (mode === 'recover') return [F.emailNew]
    if (!isSignup) {
      switch (layout) {
        case 'bem-vindo-de-volta':
          return [F.password]
        case 'acesso-etapas':
          return step === 0 ? [F.email] : [F.password]
        case 'link-magico':
          return usePassword ? [F.email, F.password] : [F.email]
        case 'perfil-equipe':
          return choice === null ? [] : [F.pin]
        case 'organizacao-equipe':
          return step === 0 ? [F.space] : [F.email, F.password]
        case 'acesso-corporativo':
          return [F.emailWork, F.password]
        case 'acesso-responsivo':
          return [method === 'email' ? F.email : F.phone, F.password]
        default:
          return [F.email, F.password]
      }
    }
    switch (flow) {
      case 'mesma-tela':
        return [F.name, F.emailNew, F.newPassword]
      case 'etapas':
        return step === 0 ? [F.emailNew, F.newPassword] : step === 1 ? [F.fullName, F.company, F.job] : []
      case 'convite':
        return [{ ...F.emailNew, autoComplete: 'username' }, F.name, F.newPassword]
      case 'sem-senha':
        return step === 0 ? [F.emailNew] : [F.code]
      case 'social-sso':
        return [F.name, F.emailNew, F.newPassword]
      case 'perfil':
        return [role === 2 ? F.orgName : F.name, F.emailNew, F.newPassword]
      case 'simplificado':
        return [F.emailNew, F.newPassword]
      default:
        return [F.fullName, F.emailNew, F.newPassword, F.confirm]
    }
  })()

  const forced = showErrors && mode === 'form'
  const errorsVisible = forced || submitted
  const readOnlyIds = flow === 'convite' && isSignup ? ['email'] : []
  const errors: Partial<Record<FieldId, string>> = {}
  if (errorsVisible) {
    for (const f of fields) {
      if (readOnlyIds.includes(f.id)) continue
      const e = fieldError(f, values[f.id] ?? '', isSignup, values, forced)
      if (e) errors[f.id] = e
    }
  }
  const extraErrors: string[] = []
  const needsTerms = isSignup && (!flow || flow === 'pagina-propria')
  const termsError = errorsVisible && needsTerms && (forced || values.terms !== 'yes') ? 'Aceite os termos para continuar.' : undefined
  if (termsError) extraErrors.push(termsError)
  const roleError = errorsVisible && isSignup && flow === 'perfil' && (forced || role === null) ? 'Escolha um tipo de perfil.' : undefined
  if (roleError) extraErrors.push(roleError)
  const errorCount = Object.keys(errors).length + extraErrors.length

  /* ------------------------------ ações ----------------------------------- */

  const finish = (next: Mode = 'success') => {
    setMode('loading')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMode(next), 650)
  }

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!live) return
    const errs = fields.filter((f) => !readOnlyIds.includes(f.id) && fieldError(f, values[f.id] ?? '', isSignup, values, false))
    const extra = (needsTerms && values.terms !== 'yes') || (isSignup && flow === 'perfil' && role === null)
    if (mode === 'recover') {
      if (errs.length) return setSubmitted(true)
      setSubmitted(false)
      return finish('recover-sent')
    }
    if (errs.length || extra) return setSubmitted(true)
    setSubmitted(false)
    // Fluxos com etapas avançam em vez de concluir.
    if (!isSignup && layout === 'acesso-etapas' && step === 0) return setStep(1)
    if (!isSignup && layout === 'organizacao-equipe' && step === 0) return setStep(1)
    if (!isSignup && layout === 'link-magico' && !usePassword) return finish('link-sent')
    if (isSignup && flow === 'etapas' && step < 2) return setStep(step + 1)
    if (isSignup && flow === 'sem-senha' && step === 0) return setStep(1)
    finish('success')
  }

  /* ------------------------------ contexto -------------------------------- */

  const ctx: ACtx = {
    T,
    m,
    live,
    fs,
    inputH,
    underline,
    friendly,
    uid,
    brand,
    values,
    set,
    errors,
    readOnlyIds,
    showPw,
    toggleShowPw: () => setShowPw((s) => !s),
    submit,
    isSignup,
    view,
    setView,
    flow,
    errorsVisible,
    errorCount,
    forced,
    hasPassword: fields.some((f) => f.id === 'password'),
    goRecover: () => {
      setSubmitted(false)
      setMode('recover')
    },
  }
  const labelStyle: CSSProperties = { fontSize: m ? 15 : 14, fontWeight: 600, color: T.text }


  /* --------------------------- estados finais ------------------------------ */

  const stateView = (() => {
    if (mode === 'loading')
      return (
        <div role="status" style={{ display: 'grid', justifyItems: 'center', gap: 14, padding: '40px 0', color: T.muted }}>
          <span className="ent-spin" style={{ width: 32, height: 32, borderRadius: 99, border: `3px solid ${T.border}`, borderTopColor: T.primary }} />
          {isSignup ? 'Criando sua conta…' : mode === 'loading' ? 'Entrando…' : ''}
        </div>
      )
    if (mode === 'success')
      return (
        <div style={{ display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center' }}>
          <CheckCircle2 size={44} style={{ color: T.success }} aria-hidden="true" />
          <Title text={isSignup ? 'Conta criada!' : 'Tudo certo!'} sub="Demonstração: em um sistema real, a pessoa seguiria para o aplicativo. Nenhum dado foi enviado." center />
          <Btn kind="secondary" onClick={() => setMode('form')}>
            Voltar ao formulário
          </Btn>
        </div>
      )
    if (mode === 'recover-sent' || mode === 'link-sent')
      return (
        <div style={{ display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 120, height: 96 }}>
            <Motif kind="envelope" a={T.primary} b={T.accent} c={T.surface} d={T.text} style={{ width: '100%', height: '100%' }} />
          </div>
          <Title text="Verifique seu e-mail" sub={mode === 'link-sent' ? 'Enviamos um link de acesso. Ele vale por 15 minutos e só pode ser usado uma vez.' : 'Se existir uma conta com esse e-mail, você receberá um link para criar uma nova senha.'} center />
          {m && <Btn>Abrir aplicativo de e-mail</Btn>}
          <LinkBtn onClick={() => setMode('form')}>
            <ArrowLeft size={14} style={{ verticalAlign: '-2px' }} /> Voltar para entrar
          </LinkBtn>
        </div>
      )
    if (mode === 'recover')
      return (
        <Wrapper>
          <Title text="Recuperar senha" sub="Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha." />
          <ErrorSummary />
          <Field f={F.emailNew} />
          <Btn type="submit">Enviar link de recuperação</Btn>
          <LinkBtn onClick={() => { setSubmitted(false); setMode('form') }} style={{ justifySelf: 'center' }}>
            <ArrowLeft size={14} style={{ verticalAlign: '-2px' }} /> Voltar para entrar
          </LinkBtn>
        </Wrapper>
      )
    return null
  })()

  /* ------------------------------ formulários ------------------------------ */

  const loginForm = (): ReactNode => {
    const headline = login.headline
    const sub = login.subline
    switch (layout) {
      case 'bem-vindo-de-volta':
        return (
          <Wrapper>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
              <span style={{ width: m ? 64 : 84, height: m ? 64 : 84, borderRadius: 999, background: T.primarySoft, color: T.primary, display: 'grid', placeItems: 'center', fontSize: m ? 24 : 30, fontWeight: 700, fontFamily: T.heading, boxShadow: `0 0 0 4px ${T.surface}, 0 0 0 6px ${withAlpha(T.primary, 0.35)}` }}>MA</span>
              <Title text={headline} sub={sub} center size={m ? 23 : 26} />
            </div>
            {live && <input type="email" name="username" autoComplete="username" value="marina@empresa.com" readOnly hidden />}
            <ErrorSummary />
            <Field f={F.password} labelAside={<PasswordAside />} />
            <Btn type="submit">Entrar</Btn>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 14, color: T.muted }}>
              Não é você? <LinkBtn>Entrar com outra conta</LinkBtn>
            </p>
          </Wrapper>
        )
      case 'acesso-etapas':
        return (
          <Wrapper>
            <div style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 650, color: T.muted }}>Etapa {step + 1} de 2</span>
              <span style={{ height: 4, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: step === 0 ? '50%' : '100%', background: T.primary, transition: 'width .2s' }} />
              </span>
            </div>
            <Title text={headline} sub={step === 0 ? sub : 'Agora, digite sua senha.'} />
            {step === 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 14px', borderRadius: T.r === 999 ? 999 : T.r, background: T.surfaceAlt, fontSize: 14.5 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <User size={16} aria-hidden="true" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{values.email || 'nome@empresa.com'}</span>
                </span>
                <LinkBtn onClick={() => setStep(0)}>Alterar</LinkBtn>
              </div>
            )}
            <ErrorSummary />
            {step === 0 ? <Field f={F.email} hint="Se sua empresa usa SSO, vamos redirecionar você." /> : <Field f={F.password} labelAside={<PasswordAside />} />}
            <Btn type="submit">{step === 0 ? 'Continuar' : 'Entrar'}</Btn>
            <SwitchLine />
          </Wrapper>
        )
      case 'link-magico':
        return (
          <Wrapper>
            <div style={{ width: m ? 96 : 120, height: m ? 76 : 96, justifySelf: 'center' }}>
              <Motif kind="envelope" a={T.primary} b={T.accent} c={T.surface} d={T.text} style={{ width: '100%', height: '100%' }} />
            </div>
            <Title text={headline} sub={sub} center />
            <ErrorSummary />
            <Field f={F.email} />
            {usePassword && <Field f={F.password} labelAside={<PasswordAside />} />}
            <Btn type="submit">
              {usePassword ? (
                'Entrar'
              ) : (
                <>
                  <Mail size={18} aria-hidden="true" /> Enviar link de acesso
                </>
              )}
            </Btn>
            <LinkBtn onClick={() => { setSubmitted(false); setUsePassword((u) => !u) }} style={{ justifySelf: 'center' }}>
              {usePassword ? 'Entrar sem senha' : 'Entrar com senha'}
            </LinkBtn>
            <SwitchLine />
          </Wrapper>
        )
      case 'perfil-equipe': {
        const people = ['Ana', 'Bruno', 'Carla', 'Davi', 'Elis']
        const colors = [T.primary, T.accent, mix(T.primary, T.accent, 0.5), mix(T.text, T.bg, 0.4), mix(T.accent, T.bg, 0.3)]
        return (
          <Wrapper>
            <Title text={headline} sub={sub} center />
            <div role={live ? 'group' : undefined} aria-label="Perfis da equipe" style={{ display: 'grid', gridTemplateColumns: `repeat(3, minmax(0, 1fr))`, gap: m ? 12 : 16, justifyItems: 'center' }}>
              {[...people, '+'].map((p, i) => {
                const selected = choice === i
                const add = p === '+'
                const avatar = (
                  <>
                    <span style={{ width: m ? 64 : 72, height: m ? 64 : 72, borderRadius: T.r === 999 ? 999 : Math.max(T.r, 16), background: add ? 'transparent' : colors[i % colors.length], border: add ? `2px dashed ${T.borderStrong}` : 'none', color: add ? T.muted : readableOn(colors[i % colors.length]), display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 22, boxShadow: selected ? `0 0 0 3px ${T.surface}, 0 0 0 5px ${T.primary}` : 'none' }}>
                      {add ? <Plus size={24} /> : p[0]}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: selected ? 680 : 520, color: selected ? T.text : T.muted }}>{add ? 'Adicionar' : p}</span>
                  </>
                )
                const s: CSSProperties = { display: 'grid', justifyItems: 'center', gap: 8, background: 'none', border: 0, padding: 4, cursor: live ? 'pointer' : undefined, color: T.text, fontFamily: T.body }
                return live ? (
                  <button key={p} type="button" aria-pressed={add ? undefined : selected} onClick={() => !add && setChoice(i)} style={s}>
                    {avatar}
                  </button>
                ) : (
                  <span key={p} style={s}>
                    {avatar}
                  </span>
                )
              })}
            </div>
            <ErrorSummary />
            {choice !== null && <Field f={{ ...F.pin, label: `Senha de ${people[choice]}` }} labelAside={<PasswordAside />} />}
            <Btn type="submit">Entrar</Btn>
          </Wrapper>
        )
      }
      case 'organizacao-equipe': {
        const orgs = [
          ['Estúdio Norte', '12 membros'],
          ['Clínica Vida', '48 membros'],
          ['Projeto Aurora', '7 membros'],
        ]
        return (
          <Wrapper>
            {step === 0 ? (
              <>
                <Title text={headline} sub={sub} />
                <ErrorSummary />
                <Field f={F.space} trailing={<span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, fontSize: 14, display: m ? 'none' : undefined }}>.seusistema.app</span>} hint={m ? 'Seu endereço termina em .seusistema.app' : undefined} />
                <Btn type="submit">Continuar</Btn>
                <Divider label="ou escolha um espaço recente" />
                <div style={{ display: 'grid', gap: 8 }}>
                  {orgs.map(([name, members], i) => {
                    const s: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: `1px solid ${T.border}`, borderRadius: T.r === 999 ? 16 : T.r, background: T.surface, textAlign: 'left', cursor: live ? 'pointer' : undefined, color: T.text, fontFamily: T.body, width: '100%' }
                    const inner = (
                      <>
                        <span style={{ width: 34, height: 34, borderRadius: Math.min(T.r, 10), background: [T.primary, T.accent, mix(T.primary, T.accent, 0.5)][i], color: readableOn([T.primary, T.accent, mix(T.primary, T.accent, 0.5)][i]), display: 'grid', placeItems: 'center', fontWeight: 700, flex: 'none' }}>{name[0]}</span>
                        <span style={{ display: 'grid', flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: 14.5 }}>{name}</strong>
                          <span style={{ fontSize: 13, color: T.muted }}>{members}</span>
                        </span>
                      </>
                    )
                    return live ? (
                      <button key={name} type="button" style={s} onClick={() => { set('space', name.toLowerCase().replace(/\s+/g, '-')); setSubmitted(false); setStep(1) }}>
                        {inner}
                      </button>
                    ) : (
                      <span key={name} style={s}>
                        {inner}
                      </span>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 34, height: 34, borderRadius: Math.min(T.r, 10), background: T.primary, color: T.onPrimary, display: 'grid', placeItems: 'center', fontWeight: 700 }}>{(values.space || 'e')[0].toUpperCase()}</span>
                  <span style={{ display: 'grid' }}>
                    <strong>{values.space || 'estudio-norte'}</strong>
                    <LinkBtn onClick={() => setStep(0)} style={{ fontSize: 13, justifySelf: 'start' }}>
                      Trocar de espaço
                    </LinkBtn>
                  </span>
                </div>
                <Title text="Entrar" sub="Use sua conta deste espaço de trabalho." />
                <ErrorSummary />
                <Field f={F.email} />
                <Field f={F.password} labelAside={<PasswordAside />} />
                <Btn type="submit">Entrar</Btn>
              </>
            )}
          </Wrapper>
        )
      }
      case 'acesso-corporativo':
        return (
          <Wrapper>
            <Title text={headline} sub={sub} />
            <ErrorSummary />
            <Btn>
              <Building2 size={18} aria-hidden="true" /> Entrar com SSO da empresa
            </Btn>
            <Divider label="ou use e-mail e senha" />
            <Field f={F.emailWork} />
            <Field f={F.password} labelAside={<PasswordAside />} />
            <Btn type="submit" kind="secondary">
              Entrar
            </Btn>
          </Wrapper>
        )
      case 'acesso-responsivo':
        return (
          <Wrapper>
            <Title text={headline} sub={sub} />
            <div role={live ? 'group' : undefined} aria-label="Forma de acesso" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 4, borderRadius: T.r === 999 ? 999 : T.r + 2, background: T.surfaceAlt, border: `1px solid ${T.border}` }}>
              {(['email', 'tel'] as const).map((k) => {
                const active = method === k
                const s: CSSProperties = { minHeight: 44, border: 0, borderRadius: T.r === 999 ? 999 : T.r, background: active ? T.surface : 'transparent', color: active ? T.text : T.muted, fontWeight: active ? 650 : 520, boxShadow: active ? '0 1px 3px rgba(0,0,0,.12)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: live ? 'pointer' : undefined, fontSize: fs, fontFamily: T.body }
                const label = (
                  <>
                    {k === 'email' ? <Mail size={17} aria-hidden="true" /> : <Smartphone size={17} aria-hidden="true" />}
                    {k === 'email' ? 'E-mail' : 'Telefone'}
                  </>
                )
                return live ? (
                  <button key={k} type="button" aria-pressed={active} onClick={() => { setSubmitted(false); setMethod(k) }} style={s}>
                    {label}
                  </button>
                ) : (
                  <span key={k} style={s}>
                    {label}
                  </span>
                )
              })}
            </div>
            <ErrorSummary />
            <Field f={method === 'email' ? F.email : F.phone} />
            <Field f={F.password} labelAside={<PasswordAside />} />
            {m ? (
              <div style={{ position: 'sticky', bottom: 0, paddingTop: 12, paddingBottom: 4, background: T.bg, display: 'grid', gap: 10 }}>
                <Btn type="submit">Entrar</Btn>
                <SwitchLine />
              </div>
            ) : (
              <>
                <Btn type="submit">Entrar</Btn>
                <SwitchLine />
              </>
            )}
          </Wrapper>
        )
      case 'formulario-horizontal':
        if (!m)
          return (
            <Wrapper gap={14}>
              <ErrorSummary />
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', gap: 14, alignItems: 'start' }}>
                <Field f={F.email} />
                <Field f={F.password} />
                <div style={{ display: 'grid', gap: 6 }}>
                  <span style={{ ...labelStyle, visibility: 'hidden' }} aria-hidden="true">
                    Entrar
                  </span>
                  <Btn type="submit" style={{ width: 'auto', padding: '0 28px' }}>
                    Entrar
                  </Btn>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <LinkBtn onClick={() => setMode('recover')}>Esqueci minha senha</LinkBtn>
                <LinkBtn onClick={() => setView('signup')}>Criar conta</LinkBtn>
              </div>
            </Wrapper>
          )
        break
    }
    // Formulário padrão
    const corporateHint = layout === 'login-qr' && m
    return (
      <Wrapper>
        {flow === 'mesma-tela' && <AuthTabs />}
        <Title text={headline} sub={sub} center={['classico-central', 'cartao-elevado', 'gradiente-discreto', 'acesso-acolhedor', 'janela-compacta', 'acesso-escuro'].includes(layout)} size={layout === 'editorial-claro' && !m ? 24 : undefined} />
        {flow === 'social-sso' && (
          <>
            <ProviderButtons />
            <Divider />
          </>
        )}
        <ErrorSummary />
        <Field f={F.email} />
        <Field f={F.password} labelAside={<PasswordAside />} />
        {layout === 'classico-central' && <Checkbox id="remember" label="Lembrar de mim neste dispositivo" />}
        <Btn type="submit">Entrar</Btn>
        {corporateHint && (
          <Btn kind="secondary">
            <Smartphone size={18} aria-hidden="true" /> Entrar com o aplicativo
          </Btn>
        )}
        <SwitchLine />
      </Wrapper>
    )
  }

  const signupForm = (): ReactNode => {
    const title = signup?.headline ?? 'Crie sua conta'
    const cta = signup?.cta ?? 'Criar conta'
    switch (flow) {
      case 'etapas': {
        const steps = signup?.steps ?? ['Conta', 'Perfil', 'Preferências']
        const topics = ['Design', 'Vendas', 'Finanças', 'Tecnologia', 'Marketing', 'Operações']
        return (
          <Wrapper>
            <ol aria-label="Etapas do cadastro" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              {steps.map((s, i) => {
                const done = i < step
                const cur = i === step
                return (
                  <li key={s} aria-current={cur ? 'step' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < steps.length - 1 ? 1 : 'none', minWidth: 0 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 99, flex: 'none', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, background: done || cur ? T.primary : T.surface, color: done || cur ? T.onPrimary : T.muted, border: `${T.bw}px solid ${done || cur ? T.primary : T.borderStrong}` }}>{done ? <Check size={15} /> : i + 1}</span>
                    {(!m || cur) && <span style={{ fontSize: 13.5, fontWeight: cur ? 680 : 520, color: cur ? T.text : T.muted, whiteSpace: 'nowrap' }}>{m ? `${i + 1} de ${steps.length} · ${s}` : s}</span>}
                    {i < steps.length - 1 && <span style={{ flex: 1, height: 2, minWidth: 12, background: done ? T.primary : T.border }} />}
                  </li>
                )
              })}
            </ol>
            <Title text={step === 0 ? title : step === 1 ? 'Conte um pouco sobre você' : 'O que te interessa?'} sub={step === 2 ? 'Escolha quantos quiser. Dá para mudar depois.' : `Etapa ${step + 1} de ${steps.length}.`} />
            <ErrorSummary />
            {step === 0 && (
              <>
                <Field f={F.emailNew} />
                <Field f={F.newPassword} hint={<Requirements />} />
              </>
            )}
            {step === 1 && (
              <>
                <Field f={F.fullName} />
                <Field f={F.company} />
                <Field f={{ ...F.job, label: 'Cargo (opcional)' }} />
              </>
            )}
            {step === 2 && (
              <div role={live ? 'group' : undefined} aria-label="Interesses" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topics.map((tp, i) => {
                  const on = interests.includes(i)
                  const s: CSSProperties = { minHeight: 40, padding: '0 14px', borderRadius: 999, border: `1px solid ${on ? T.primary : T.borderStrong}`, background: on ? T.primarySoft : T.surface, color: on ? T.text : T.muted, fontWeight: on ? 650 : 520, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: live ? 'pointer' : undefined, fontSize: 14.5, fontFamily: T.body }
                  return live ? (
                    <button key={tp} type="button" aria-pressed={on} style={s} onClick={() => setInterests((xs) => (on ? xs.filter((x) => x !== i) : [...xs, i]))}>
                      {on && <Check size={14} aria-hidden="true" />}
                      {tp}
                    </button>
                  ) : (
                    <span key={tp} style={s}>
                      {tp}
                    </span>
                  )
                })}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: step > 0 ? '1fr 1.6fr' : '1fr', gap: 10 }}>
              {step > 0 && (
                <Btn kind="secondary" onClick={() => { setSubmitted(false); setStep(step - 1) }}>
                  Voltar
                </Btn>
              )}
              <Btn type="submit">{step === 2 ? 'Concluir cadastro' : cta}</Btn>
            </div>
            {step > 0 && (
              <LinkBtn onClick={() => finish('success')} style={{ justifySelf: 'center' }}>
                Pular por agora
              </LinkBtn>
            )}
            {step === 0 && <SwitchLine />}
          </Wrapper>
        )
      }
      case 'convite':
        return (
          <Wrapper>
            <div style={{ display: 'flex', flexDirection: m ? 'column' : 'row', alignItems: m ? 'flex-start' : 'center', gap: 12, padding: 14, borderRadius: T.r === 999 ? 18 : T.r, background: T.primarySoft, border: `1px solid ${withAlpha(T.primary, 0.25)}` }}>
              <span style={{ display: 'flex' }}>
                <span style={{ width: 38, height: 38, borderRadius: 99, background: T.accent, color: readableOn(T.accent), display: 'grid', placeItems: 'center', fontWeight: 700, border: `2px solid ${T.surface}` }}>AR</span>
                <span style={{ width: 38, height: 38, borderRadius: Math.min(T.r, 10), background: T.primary, color: T.onPrimary, display: 'grid', placeItems: 'center', fontWeight: 700, marginLeft: -8, border: `2px solid ${T.surface}` }}>PA</span>
              </span>
              <span style={{ fontSize: 14.5, color: T.text, lineHeight: 1.4 }}>
                <strong>Ana Ribeiro</strong> convidou você para a equipe <strong>Projeto Aurora</strong>.
              </span>
            </div>
            <Title text={title} sub="Crie sua senha para aceitar o convite." />
            <ErrorSummary />
            <Field f={{ ...F.emailNew, autoComplete: 'username' }} hint="E-mail definido pelo convite." />
            <Field f={F.name} />
            <Field f={F.newPassword} hint={<Requirements />} />
            <Btn type="submit">{cta}</Btn>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 14, color: T.muted }}>
              Não é você? <LinkBtn>Recusar convite</LinkBtn>
            </p>
          </Wrapper>
        )
      case 'sem-senha':
        return (
          <Wrapper>
            <Title text={step === 0 ? title : 'Digite o código'} sub={step === 0 ? 'Sem senha para lembrar: enviaremos um código de 6 números para o seu e-mail.' : `Enviamos um código para ${values.email || 'nome@empresa.com'}.`} />
            <ErrorSummary />
            {step === 0 ? (
              <Field f={F.emailNew} />
            ) : (
              <>
                <Field f={F.code} hint="Você também pode tocar no link que enviamos no mesmo e-mail." />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: T.muted, flexWrap: 'wrap', gap: 8 }}>
                  <span>Reenviar em 30 s</span>
                  <LinkBtn onClick={() => { setSubmitted(false); setStep(0) }}>Alterar e-mail</LinkBtn>
                </div>
              </>
            )}
            <Btn type="submit">{step === 0 ? cta : 'Confirmar'}</Btn>
            <SwitchLine />
          </Wrapper>
        )
      case 'social-sso':
        return (
          <Wrapper>
            <Title text={title} sub="Use uma conta que você já tem ou cadastre um e-mail." />
            <ProviderButtons />
            <Divider />
            <ErrorSummary />
            <Field f={F.name} />
            <Field f={F.emailNew} />
            <Field f={F.newPassword} />
            <Btn type="submit">{cta}</Btn>
            <SwitchLine />
          </Wrapper>
        )
      case 'perfil': {
        const roles: [LucideIcon, string, string][] = [
          [User, 'Sou cliente', 'Quero contratar e acompanhar serviços.'],
          [Sparkles, 'Sou profissional', 'Quero oferecer meus serviços.'],
          [Store, 'Sou empresa', 'Quero gerenciar uma equipe.'],
        ]
        return (
          <Wrapper>
            <Title text={title} sub="Escolha um perfil para personalizarmos sua experiência." />
            <ErrorSummary />
            <div role={live ? 'radiogroup' : undefined} aria-label="Tipo de perfil" style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {roles.map(([Icon, name, desc], i) => {
                const on = role === i
                const s: CSSProperties = { display: 'flex', flexDirection: m ? 'row' : 'column', alignItems: m ? 'center' : 'flex-start', gap: m ? 12 : 8, padding: m ? '10px 14px' : 14, minHeight: m ? 56 : undefined, borderRadius: T.r === 999 ? 18 : Math.max(T.r, 8), border: `${on ? 2 : T.bw}px solid ${on ? T.primary : roleError ? T.error : T.border}`, background: on ? T.primarySoft : T.surface, color: T.text, textAlign: 'left', cursor: live ? 'pointer' : undefined, fontFamily: T.body }
                const inner = (
                  <>
                    <span style={{ width: 32, height: 32, borderRadius: 99, background: on ? T.primary : T.surfaceAlt, color: on ? T.onPrimary : T.muted, display: 'grid', placeItems: 'center', flex: 'none' }}>
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span style={{ display: 'grid', gap: 2 }}>
                      <strong style={{ fontSize: 14.5 }}>{name}</strong>
                      <span style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.35 }}>{desc}</span>
                    </span>
                  </>
                )
                return live ? (
                  <button key={name} type="button" role="radio" aria-checked={on} onClick={() => setRole(i)} style={s}>
                    {inner}
                  </button>
                ) : (
                  <span key={name} style={s}>
                    {inner}
                  </span>
                )
              })}
            </div>
            {roleError && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.error, fontSize: 13.5, marginTop: -8 }}>
                <AlertCircle size={15} aria-hidden="true" /> {roleError}
              </span>
            )}
            <Field f={role === 2 ? F.orgName : F.name} />
            <Field f={F.emailNew} />
            <Field f={F.newPassword} />
            <Btn type="submit">{cta}</Btn>
            <SwitchLine />
          </Wrapper>
        )
      }
      case 'simplificado':
        return (
          <Wrapper>
            <Title text={title} sub="Só o essencial. O resto você completa depois." />
            <ErrorSummary />
            <Field f={F.emailNew} />
            <Field f={F.newPassword} hint="Mínimo de 8 caracteres." />
            <Btn type="submit">{cta}</Btn>
            <p style={{ margin: 0, fontSize: 12.5, color: T.muted, textAlign: 'center' }}>Ao continuar, você aceita os Termos de Uso e a Política de Privacidade.</p>
            <SwitchLine />
          </Wrapper>
        )
      case 'mesma-tela':
        return (
          <Wrapper>
            <AuthTabs />
            <Title text={title} sub="Leva menos de um minuto." />
            <ErrorSummary />
            <Field f={F.name} />
            <Field f={F.emailNew} />
            <Field f={F.newPassword} hint={<Requirements />} />
            <Btn type="submit">{cta}</Btn>
            <p style={{ margin: 0, fontSize: 12.5, color: T.muted, textAlign: 'center' }}>Ao criar a conta, você aceita os Termos e a Política de Privacidade.</p>
          </Wrapper>
        )
      default:
        return (
          <Wrapper>
            <Title text={title} sub="Preencha seus dados para começar." />
            <ErrorSummary />
            <Field f={F.fullName} />
            <Field f={F.emailNew} />
            <Field f={F.newPassword} hint={<Requirements />} />
            <Field f={F.confirm} />
            <Checkbox id="terms" label={<span>Li e aceito os <span style={{ color: T.link, fontWeight: 600 }}>Termos</span> e a <span style={{ color: T.link, fontWeight: 600 }}>Privacidade</span></span>} error={termsError} />
            <Btn type="submit">{cta}</Btn>
            <SwitchLine />
          </Wrapper>
        )
    }
  }

  const form = stateView ?? (isSignup ? signupForm() : loginForm())

  /* ------------------------------ composições ------------------------------ */

  const rootStyle: CSSProperties = {
    minHeight: formOnly ? undefined : m ? 780 : 800,
    background: T.bg,
    color: T.text,
    fontFamily: T.body,
    fontSize: m ? 16 : 15,
    lineHeight: 1.5,
    ['--ent-ph' as string]: T.placeholder,
    ['--ent-focus' as string]: T.focus,
  }

  const art = (kind: Parameters<typeof Motif>[0]['kind'], style: CSSProperties, on?: { a: string; b: string; c: string; d: string }) => (
    <Motif kind={kind} a={on?.a ?? T.primary} b={on?.b ?? T.accent} c={on?.c ?? T.surface} d={on?.d ?? T.text} style={style} />
  )
  const formCol = (children: ReactNode, width = 380) => <div style={{ width: '100%', maxWidth: m ? undefined : width }}>{children}</div>

  if (formOnly) {
    return (
      <AuthCtx.Provider value={ctx}>
        <div className="ent-auth" data-testid="auth-preview" data-view={view} style={{ ...rootStyle, padding: 28, background: T.surface }}>
          {form}
        </div>
      </AuthCtx.Provider>
    )
  }

  const screen = (() => {
    switch (layout) {
      case 'classico-central':
        return (
          <div style={{ minHeight: 'inherit', background: m ? T.surface : T.bgAlt }}>
            <Center>
              <Brand center />
              {m ? <div style={{ width: '100%' }}>{form}</div> : <Card width={410}>{form}</Card>}
              <Legal />
            </Center>
          </div>
        )
      case 'divisao-ilustrada':
      case 'dividida-solida': {
        const solid = layout === 'dividida-solida'
        const panelBg = solid ? T.primary : `linear-gradient(150deg, ${T.primary}, ${mix(T.primary, T.accent, 0.55)})`
        const panel = (
          <div style={{ position: 'relative', background: panelBg, color: T.onPrimary, padding: m ? 20 : 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, minHeight: m ? (solid ? 140 : 168) : '100%', overflow: 'hidden' }}>
            {solid ? (
              <>
                <Brand color={T.onPrimary} inverse size={m ? 30 : 40} />
                {!m && (
                  <span style={{ fontFamily: T.heading, fontWeight: T.hw, fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.04em', overflowWrap: 'anywhere' }}>{brand}</span>
                )}
                <span style={{ fontSize: m ? 14 : 17, opacity: 0.85 }}>Tudo o que sua equipe precisa, em um só lugar.</span>
              </>
            ) : (
              <>
                <Brand color={T.onPrimary} inverse size={m ? 28 : 34} />
                {art('people', { position: m ? 'absolute' : 'relative', right: m ? -10 : undefined, bottom: m ? -6 : undefined, width: m ? 160 : '86%', height: m ? 130 : 340, alignSelf: 'center' }, { a: mix(T.onPrimary, T.primary, 0.1), b: T.accent, c: T.primary, d: T.onPrimary })}
                {!m && (
                  <blockquote style={{ margin: 0, display: 'grid', gap: 8 }}>
                    <span style={{ fontFamily: T.heading, fontSize: 22, fontWeight: T.hw, lineHeight: 1.3 }}>“Organizamos a equipe inteira em uma semana.”</span>
                    <span style={{ fontSize: 14, opacity: 0.8 }}>Renata Alves, coordenadora</span>
                  </blockquote>
                )}
              </>
            )}
          </div>
        )
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gridTemplateRows: m ? 'auto 1fr' : undefined }}>
            {panel}
            <div style={{ background: T.surface, display: 'grid', placeItems: m ? 'start stretch' : 'center', padding: m ? '28px 20px' : 48 }}>{formCol(form)}</div>
          </div>
        )
      }
      case 'divisao-invertida':
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateColumns: m ? '1fr' : '44% 56%', background: T.surface }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, padding: m ? '28px 20px' : '48px 64px' }}>
              <Brand />
              {formCol(form, 400)}
              {m && (
                <div style={{ display: 'flex', justifyContent: 'space-around', color: T.muted, fontSize: 12.5, textAlign: 'center' }}>
                  {[ShieldCheck, Sparkles, Users].map((I, i) => (
                    <span key={i} style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
                      <I size={20} style={{ color: T.primary }} aria-hidden="true" />
                      {['Seguro', 'Rápido', 'Em equipe'][i]}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {!m && (
              <div style={{ margin: 16, borderRadius: T.rl, background: T.primarySoft, position: 'relative', overflow: 'hidden', display: 'grid', alignContent: 'center', gap: 16, padding: 56 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ position: 'absolute', width: 260 + i * 140, height: 260 + i * 140, borderRadius: 999, border: `1.5px solid ${withAlpha(T.primary, 0.18)}`, right: -120 - i * 70, top: -80 - i * 70 }} />
                ))}
                <h3 style={{ margin: 0, fontFamily: T.heading, fontWeight: T.hw, fontSize: 34, lineHeight: 1.15, maxWidth: '14ch', position: 'relative' }}>Tudo pronto para você continuar.</h3>
                {[
                  [ShieldCheck, 'Acesso seguro', 'Seus dados protegidos de ponta a ponta.'],
                  [Sparkles, 'Novidades da semana', 'Relatórios mais rápidos e novos filtros.'],
                  [Users, 'Equipe conectada', '12 pessoas ativas agora.'],
                ].map(([I, t, d]) => {
                  const Icon = I as LucideIcon
                  return (
                    <div key={t as string} style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'center', padding: 16, borderRadius: T.r === 999 ? 18 : T.r, maxWidth: 420, ...T.card }}>
                      <span style={{ width: 40, height: 40, borderRadius: 99, background: T.primary, color: T.onPrimary, display: 'grid', placeItems: 'center', flex: 'none' }}>
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <span style={{ display: 'grid' }}>
                        <strong style={{ fontSize: 15 }}>{t as string}</strong>
                        <span style={{ fontSize: 13.5, color: T.muted }}>{d as string}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      case 'editorial-claro':
        return (
          <div style={{ minHeight: 'inherit', background: T.bg, display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1.1fr) 1px minmax(0, 1fr)', gap: m ? 24 : 64, alignItems: 'center', padding: m ? '32px 20px' : '56px 80px' }}>
            <div style={{ display: 'grid', gap: m ? 14 : 28 }}>
              <span style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: T.muted }}>{brand}</span>
              <h1 style={{ margin: 0, fontFamily: T.heading, fontWeight: T.hw, fontSize: m ? 28 : 52, lineHeight: 1.08, letterSpacing: '-0.025em', maxWidth: '14ch' }}>{login.headline}</h1>
              {!m && (
                <svg viewBox="0 0 320 140" style={{ width: 320, height: 140 }} aria-hidden="true">
                  <path d="M10 120 Q60 20 120 80 T230 60 T310 30" fill="none" stroke={T.text} strokeWidth="1.5" />
                  <circle cx="120" cy="80" r="22" fill="none" stroke={T.primary} strokeWidth="1.5" />
                  <path d="M200 120 H300 M220 108 H300 M240 96 H300" stroke={T.text} strokeWidth="1.5" opacity=".5" />
                </svg>
              )}
            </div>
            {!m && <span style={{ alignSelf: 'stretch', background: T.border }} />}
            <div style={{ maxWidth: 380 }}>{form}</div>
          </div>
        )
      case 'acesso-escuro':
        return (
          <div style={{ minHeight: 'inherit', position: 'relative', overflow: 'hidden', background: T.bg }}>
            <span style={{ position: 'absolute', width: m ? 360 : 640, height: m ? 360 : 640, borderRadius: 999, left: '50%', top: m ? -80 : '50%', transform: m ? 'translateX(-50%)' : 'translate(-50%, -50%)', background: `radial-gradient(circle, ${withAlpha(T.primary, 0.35)}, transparent 65%)` }} />
            <Center style={{ position: 'relative' }}>
              <Brand center />
              <Card width={400}>{form}</Card>
              <Legal />
            </Center>
          </div>
        )
      case 'produto-destaque':
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateColumns: m ? '1fr' : '58% 42%', gridTemplateRows: m ? 'auto 1fr' : undefined }}>
            <div style={{ background: T.primarySoft, padding: m ? '22px 20px' : '56px 0 0 56px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden', minHeight: m ? 120 : undefined }}>
              <Brand size={m ? 28 : 34} />
              <h3 style={{ margin: 0, fontFamily: T.heading, fontWeight: T.hw, fontSize: m ? 20 : 36, lineHeight: 1.15, maxWidth: '16ch' }}>Seus números do dia, prontos ao entrar.</h3>
              {!m && (
                <div style={{ marginTop: 'auto', marginRight: -2, borderRadius: `${T.rl}px 0 0 0`, border: `1px solid ${T.border}`, borderRight: 0, borderBottom: 0, background: T.surface, padding: 20, display: 'grid', gap: 14, boxShadow: '0 -20px 50px -30px rgba(0,0,0,.25)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
                    {['Vendas', 'Pedidos', 'Clientes'].map((k, i) => (
                      <div key={k} style={{ border: `1px solid ${T.border}`, borderRadius: T.r === 999 ? 14 : T.r, padding: 12, display: 'grid', gap: 2 }}>
                        <span style={{ fontSize: 12, color: T.muted }}>{k}</span>
                        <strong style={{ fontSize: 20 }}>{['R$ 12,4 mil', '318', '1.204'][i]}</strong>
                      </div>
                    ))}
                  </div>
                  <svg viewBox="0 0 400 120" style={{ width: '100%', height: 150 }} preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 100 L40 86 L80 92 L120 70 L160 76 L200 50 L240 58 L280 34 L320 42 L360 20 L400 26 L400 120 L0 120 Z" fill={withAlpha(T.primary, 0.14)} />
                    <path d="M0 100 L40 86 L80 92 L120 70 L160 76 L200 50 L240 58 L280 34 L320 42 L360 20 L400 26" fill="none" stroke={T.primary} strokeWidth="2.5" />
                  </svg>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ width: 26, height: 26, borderRadius: 99, background: withAlpha(T.primary, 0.16) }} />
                      <span style={{ height: 8, borderRadius: 4, background: T.border, flex: 1, maxWidth: `${70 - i * 15}%` }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: T.surface, display: 'grid', placeItems: m ? 'start stretch' : 'center', padding: m ? '28px 20px' : 48 }}>{formCol(form, 360)}</div>
          </div>
        )
      case 'cartao-elevado':
        return (
          <div style={{ minHeight: 'inherit', position: 'relative', background: T.bgAlt }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: m ? 200 : '42%', background: T.primary }} />
            <Center style={{ position: 'relative', justifyContent: 'flex-start', paddingTop: m ? 28 : 64 }}>
              <Brand color={T.onPrimary} inverse />
              <Card width={420} style={{ background: T.surface, border: 'none', boxShadow: '0 30px 60px -20px rgba(15,15,30,.35), 0 8px 20px -10px rgba(15,15,30,.2)' }}>
                {form}
              </Card>
              <Legal />
            </Center>
          </div>
        )
      case 'tela-cheia-clean':
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: T.surface, padding: m ? 20 : '28px 40px' }}>
            <Brand size={30} />
            <div style={{ display: 'grid', placeItems: m ? 'start stretch' : 'center', paddingTop: m ? 56 : 0 }}>{formCol(form, 360)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 13, color: T.muted, paddingTop: 24 }}>
              <span>© 2026 {brand}</span>
              <span style={{ display: 'flex', gap: 18 }}>
                <span>Ajuda</span>
                <span>Português (Brasil)</span>
              </span>
            </div>
          </div>
        )
      case 'marca-lateral':
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateColumns: m ? '1fr' : '280px 1fr', gridTemplateRows: m ? '64px 1fr' : undefined, background: T.surface }}>
            <aside style={{ background: T.navBg, color: T.navText, padding: m ? '0 20px' : '36px 28px', display: 'flex', flexDirection: m ? 'row' : 'column', alignItems: m ? 'center' : 'stretch', justifyContent: 'space-between', borderRight: m ? 'none' : `1px solid ${T.border}`, borderBottom: m ? `1px solid ${T.border}` : 'none' }}>
              <Brand color={isDark(T.navBg) ? '#ffffff' : T.text} size={m ? 28 : 34} />
              {!m && (
                <>
                  <p style={{ margin: 0, fontFamily: T.heading, fontSize: 24, lineHeight: 1.25, fontWeight: T.hw, color: isDark(T.navBg) ? '#ffffff' : T.text }}>O painel da sua operação.</p>
                  <span style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 9, background: T.success }} /> Todos os sistemas operando · v4.2
                  </span>
                </>
              )}
            </aside>
            <div style={{ display: 'grid', placeItems: m ? 'start stretch' : 'center', padding: m ? '28px 20px' : 48 }}>{formCol(form)}</div>
          </div>
        )
      case 'acesso-corporativo':
        return (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: T.bgAlt }}>
            <div style={{ height: m ? 56 : 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: m ? '0 16px' : '0 32px', background: T.surface, borderBottom: `1px solid ${T.border}` }}>
              <Brand size={m ? 26 : 30} />
              <span style={{ fontSize: 14, color: T.link, fontWeight: 600 }}>Suporte de TI</span>
            </div>
            <Center>
              {m ? <div style={{ width: '100%' }}>{form}</div> : <Card width={430}>{form}</Card>}
            </Center>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: m ? '14px 20px 20px' : '18px 32px', fontSize: 13, color: T.muted, textAlign: 'center', borderTop: `1px solid ${T.border}` }}>
              <ShieldCheck size={16} aria-hidden="true" style={{ flex: 'none' }} /> Acesso monitorado. Uso restrito a colaboradores autorizados.
            </div>
          </div>
        )
      case 'bem-vindo-de-volta':
        return (
          <div style={{ minHeight: 'inherit', background: m ? T.surface : T.bgAlt }}>
            <Center>
              <Brand center size={28} />
              {m ? <div style={{ width: '100%' }}>{form}</div> : <Card width={400}>{form}</Card>}
            </Center>
          </div>
        )
      case 'foto-editorial': {
        const photo = (
          <div style={{ position: m ? 'relative' : 'absolute', inset: m ? undefined : 0, height: m ? 200 : undefined, background: `linear-gradient(180deg, ${mix(T.accent, '#1b1b22', 0.45)} 0%, ${mix(T.primary, '#0d0d12', 0.55)} 100%)`, overflow: 'hidden' }}>
            {art('mountain', { position: 'absolute', left: m ? '-10%' : '-5%', bottom: m ? -50 : -120, width: m ? '120%' : '80%', height: m ? 230 : 640 }, { a: mix(T.primary, '#000000', 0.45), b: mix(T.accent, '#ffffff', 0.3), c: '#ffffff', d: '#000000' })}
            <span style={{ position: 'absolute', left: m ? 16 : 32, bottom: m ? 12 : 28, fontSize: 12.5, color: 'rgba(255,255,255,.8)' }}>Foto: Serra ao amanhecer · ilustração</span>
            <span style={{ position: 'absolute', left: m ? 16 : 32, top: m ? 14 : 28 }}>
              <Brand color="#ffffff" size={m ? 26 : 32} />
            </span>
          </div>
        )
        return m ? (
          <div style={{ minHeight: 'inherit', display: 'grid', gridTemplateRows: 'auto 1fr', background: T.surface }}>
            {photo}
            <div style={{ padding: '24px 20px' }}>{form}</div>
          </div>
        ) : (
          <div style={{ minHeight: 'inherit', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '48px 80px' }}>
            {photo}
            <Card width={410} style={{ position: 'relative', background: T.surface, boxShadow: '0 30px 60px -30px rgba(0,0,0,.5)' }}>
              {form}
            </Card>
          </div>
        )
      }
      case 'gradiente-discreto':
        return (
          <div style={{ minHeight: 'inherit', position: 'relative', overflow: 'hidden', background: `linear-gradient(160deg, ${T.primarySoft} 0%, ${T.bg} 55%, ${mix(T.bg, T.accent, 0.1)} 100%)` }}>
            {!m && (
              <>
                <span style={{ position: 'absolute', width: 420, height: 420, borderRadius: 999, background: withAlpha(T.primary, 0.22), filter: 'blur(70px)', left: '12%', top: '8%' }} />
                <span style={{ position: 'absolute', width: 360, height: 360, borderRadius: 999, background: withAlpha(T.accent, 0.2), filter: 'blur(70px)', right: '10%', bottom: '6%' }} />
              </>
            )}
            <Center style={{ position: 'relative' }}>
              <Card width={410} style={{ background: withAlpha(T.surface, 0.72), backdropFilter: 'blur(16px)', border: `1px solid ${withAlpha('#ffffff', 0.6)}` }}>
                <div style={{ display: 'grid', gap: 22 }}>
                  <Brand center size={30} />
                  {form}
                </div>
              </Card>
            </Center>
          </div>
        )
      case 'acesso-beneficios': {
        const benefits = ['Projetos e tarefas em um só lugar', 'Relatórios atualizados em tempo real', 'Aplicativo para celular incluído', 'Suporte humano em português']
        const list = (
          <div style={{ display: 'grid', gap: m ? 10 : 16 }}>
            {benefits.map((b) => (
              <span key={b} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: m ? 15 : 16.5 }}>
                <span style={{ width: 26, height: 26, borderRadius: 99, background: T.primarySoft, color: T.primary, display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Check size={15} aria-hidden="true" />
                </span>
                {b}
              </span>
            ))}
          </div>
        )
        return (
          <div style={{ minHeight: 'inherit', background: T.bgAlt, display: 'grid', gridTemplateColumns: m ? '1fr' : 'minmax(0, 1fr) minmax(0, 1fr)', alignItems: 'center', gap: m ? 28 : 64, padding: m ? '28px 20px' : '48px 96px' }}>
            <div style={{ display: 'grid', gap: 28, order: m ? 2 : 1 }}>
              {!m && <Brand />}
              <h1 style={{ margin: 0, fontFamily: T.heading, fontWeight: T.hw, fontSize: m ? 22 : 40, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: '15ch' }}>Bom te ver de novo. Veja o que te espera.</h1>
              {list}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.muted }}>
                <span style={{ display: 'flex' }}>
                  {[T.primary, T.accent, mix(T.primary, T.accent, 0.5)].map((col, i) => (
                    <span key={i} style={{ width: 26, height: 26, borderRadius: 99, background: col, border: `2px solid ${T.bgAlt}`, marginLeft: i ? -8 : 0 }} />
                  ))}
                </span>
                Mais de 12 mil equipes
              </span>
            </div>
            <div style={{ order: m ? 1 : 2, display: 'grid', gap: 18, justifyItems: m ? 'stretch' : 'start' }}>
              {m && <Brand />}
              <Card width={420} style={m ? { padding: 20 } : undefined}>
                {form}
              </Card>
            </div>
          </div>
        )
      }
      case 'janela-compacta': {
        const appBg = (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: m ? '1fr' : '220px 1fr', filter: 'blur(3px)', opacity: 0.7 }}>
            {!m && (
              <div style={{ background: T.navBg, padding: 20, display: 'grid', alignContent: 'start', gap: 12 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{ height: 12, borderRadius: 6, background: withAlpha(isDark(T.navBg) ? '#ffffff' : T.text, 0.15), width: `${80 - (i % 3) * 15}%` }} />
                ))}
              </div>
            )}
            <div style={{ background: T.bg, padding: m ? 16 : 28, display: 'grid', alignContent: 'start', gap: 16 }}>
              <span style={{ height: 22, width: '40%', borderRadius: 6, background: T.border }} />
              <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ height: 80, borderRadius: T.r === 999 ? 16 : T.r, background: T.surface, border: `1px solid ${T.border}` }} />
                ))}
              </div>
              <span style={{ height: 260, borderRadius: T.r === 999 ? 16 : T.r, background: T.surface, border: `1px solid ${T.border}` }} />
            </div>
          </div>
        )
        return (
          <div style={{ minHeight: 'inherit', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: m ? 'flex-end' : 'center', justifyContent: 'center' }}>
            {appBg}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,12,18,.45)' }} />
            <div role="dialog" aria-label="Sessão expirada" style={{ position: 'relative', width: m ? '100%' : 340, padding: m ? '10px 20px 28px' : 26, borderRadius: m ? `${Math.max(T.rl, 18)}px ${Math.max(T.rl, 18)}px 0 0` : T.rl, background: T.surface, boxShadow: '0 30px 70px -20px rgba(0,0,0,.5)' }}>
              {m && <span style={{ display: 'block', width: 40, height: 5, borderRadius: 9, background: T.borderStrong, margin: '0 auto 16px' }} />}
              <div style={{ display: 'grid', gap: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.muted }}>
                  <Lock size={15} aria-hidden="true" /> {brand}
                </span>
                {form}
              </div>
            </div>
          </div>
        )
      }
      case 'formulario-horizontal':
        return (
          <div style={{ minHeight: 'inherit', background: T.bgAlt, display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 28, padding: m ? '32px 20px' : 48 }}>
            <div style={{ width: '100%', maxWidth: 900, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <Brand />
              {!m && <span style={{ fontSize: 14, color: T.muted }}>Precisa de ajuda? Fale com o suporte</span>}
            </div>
            <div style={{ width: '100%', maxWidth: 900, borderRadius: T.rl, padding: m ? 20 : '32px 36px', ...T.card, display: 'grid', gridTemplateColumns: m ? '1fr' : '220px minmax(0, 1fr)', gap: m ? 18 : 36, alignItems: 'start' }}>
              <Title text={login.headline} sub={login.subline} size={m ? 24 : 24} />
              {form}
            </div>
            <Legal />
          </div>
        )
      case 'perfil-equipe':
      case 'acesso-etapas':
      case 'link-magico':
      case 'organizacao-equipe':
        return (
          <div style={{ minHeight: 'inherit', background: m ? T.surface : T.bgAlt }}>
            <Center>
              <Brand center size={30} />
              {m ? <div style={{ width: '100%' }}>{form}</div> : <Card width={layout === 'perfil-equipe' ? 460 : 420}>{form}</Card>}
              <Legal />
            </Center>
          </div>
        )
      case 'acesso-acolhedor':
        return (
          <div style={{ minHeight: 'inherit', background: `linear-gradient(180deg, ${mix(T.bg, T.accent, 0.12)}, ${T.bg} 45%)` }}>
            <Center gap={0}>
              <div style={{ width: m ? 170 : 240, height: m ? 100 : 140, marginBottom: m ? -18 : -26, position: 'relative', zIndex: 0 }}>
                <svg viewBox="0 0 240 140" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                  <circle cx="120" cy="80" r="46" fill={T.accent} opacity=".85" />
                  <path d="M104 80 Q120 96 136 80" stroke={readableOn(T.accent)} strokeWidth="4" fill="none" strokeLinecap="round" />
                  <circle cx="106" cy="68" r="4" fill={readableOn(T.accent)} />
                  <circle cx="134" cy="68" r="4" fill={readableOn(T.accent)} />
                  <ellipse cx="44" cy="58" rx="34" ry="16" fill={T.surface} />
                  <ellipse cx="200" cy="40" rx="30" ry="14" fill={T.surface} />
                  <ellipse cx="190" cy="110" rx="24" ry="11" fill={T.primarySoft} />
                </svg>
              </div>
              <Card width={420} style={{ position: 'relative', borderRadius: Math.max(T.rl, 24), ...(m ? { padding: 22 } : {}) }}>
                <div style={{ display: 'grid', gap: 18 }}>
                  <Brand center size={26} />
                  {form}
                </div>
              </Card>
            </Center>
          </div>
        )
      case 'login-qr':
        return (
          <div style={{ minHeight: 'inherit', background: T.bgAlt }}>
            <Center>
              <Brand center />
              {m ? (
                <div style={{ width: '100%' }}>{form}</div>
              ) : (
                <div style={{ width: '100%', maxWidth: 820, borderRadius: T.rl, ...T.card, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 0.9fr)', gap: 36, padding: 40, alignItems: 'center' }}>
                  {form}
                  <div style={{ alignSelf: 'stretch', display: 'grid', gridTemplateRows: '1fr auto 1fr', justifyItems: 'center', color: T.muted, fontSize: 13 }}>
                    <span style={{ width: 1, background: T.border }} />
                    <span style={{ padding: '8px 0' }}>ou</span>
                    <span style={{ width: 1, background: T.border }} />
                  </div>
                  <div style={{ display: 'grid', gap: 16, justifyItems: 'center', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 650 }}>
                      <QrCode size={18} aria-hidden="true" /> Entrar com o aplicativo
                    </span>
                    <div style={{ padding: 12, borderRadius: Math.min(T.r, 12), border: `1px solid ${T.border}`, background: '#ffffff' }}>
                      <QrSvg fg="#111114" bg="#ffffff" />
                    </div>
                    <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4, fontSize: 13.5, color: T.muted, textAlign: 'left' }}>
                      <li>Abra o aplicativo no celular</li>
                      <li>Toque em “Escanear código”</li>
                      <li>Aponte para esta tela</li>
                    </ol>
                    <span style={{ fontSize: 12.5, color: T.muted }}>O código é renovado em 0:48</span>
                  </div>
                </div>
              )}
            </Center>
          </div>
        )
      case 'acesso-responsivo':
        return m ? (
          <div style={{ minHeight: 'inherit', background: T.bg, display: 'grid', gridTemplateRows: 'auto 1fr', padding: '20px 20px 16px', gap: 28 }}>
            <Brand size={30} />
            {form}
          </div>
        ) : (
          <div style={{ minHeight: 'inherit', background: T.bgAlt, display: 'grid', placeItems: 'center', padding: 48 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 0, width: '100%', maxWidth: 860, borderRadius: T.rl, overflow: 'hidden', ...T.card }}>
              <div style={{ background: T.primarySoft, padding: 40, display: 'grid', alignContent: 'space-between', gap: 24 }}>
                <Brand />
                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    [Smartphone, 'Funciona igual no celular'],
                    [KeyRound, 'Entre com e-mail ou telefone'],
                    [ShieldCheck, 'Conexão protegida'],
                  ].map(([I, t]) => {
                    const Icon = I as LucideIcon
                    return (
                      <span key={t as string} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15 }}>
                        <Icon size={20} style={{ color: T.primary }} aria-hidden="true" />
                        {t as string}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div style={{ padding: 36, background: T.surface }}>{form}</div>
            </div>
          </div>
        )
      default:
        return <Center>{form}</Center>
    }
  })()

  return (
    <AuthCtx.Provider value={ctx}>
      <div className="ent-auth" data-testid="auth-preview" data-layout={layout} data-view={view} data-device={device} style={rootStyle}>
        {screen}
      </div>
    </AuthCtx.Provider>
  )
}
