import type { CSSProperties } from 'react'
import { Bell, CheckCircle2, Home, Info, LayoutGrid, Search, Settings, TriangleAlert, Users, XCircle } from 'lucide-react'
import { useProject } from '@/core/store'
import { surfaceStyle } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'

/**
 * Amostra viva da identidade: navegação, botões em todos os estados, campo com foco,
 * card, tabela, alertas e links. Usa apenas tokens — nada de cores fixas.
 */
export function IdentityPreview({ theme, compact = false }: { theme: ResolvedTheme; compact?: boolean }) {
  const { tokens: t, metrics: m, typography: ty } = theme
  // Nome e menu do projeto no lugar de “Marca” e de um menu genérico (UX-29).
  const projectName = useProject((p) => p.meta.name.trim())
  const navSource = useProject((p) => (p.meta.navItems.some((s) => s.trim()) ? p.meta.navItems : p.meta.features))
  const menu = navSource.map((s) => s.trim()).filter(Boolean).slice(0, 5)
  // Tamanhos desenhados para a base de 15 px; acompanham o “Tamanho base do texto” escolhido.
  const fs = (px: number) => Math.round(((px * ty.baseSize) / 15) * 10) / 10
  // Estilo dos ícones da identidade: contorno, preenchido ou duotone.
  const iconProps =
    theme.geometry.iconStyle === 'filled'
      ? { fill: 'currentColor', strokeWidth: 1.5 }
      : theme.geometry.iconStyle === 'duotone'
        ? { fill: 'currentColor', fillOpacity: 0.22, strokeWidth: 2 }
        : { strokeWidth: 2 }
  const surface = surfaceStyle(theme)
  const pad = m.spacing
  const btn = (bg: string, fg: string, extra: CSSProperties = {}): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    height: 34,
    padding: `0 ${pad * 1.6}px`,
    borderRadius: m.radiusMd,
    border: 0,
    background: bg,
    color: fg,
    fontFamily: m.bodyFont,
    fontSize: fs(13),
    fontWeight: 600,
    whiteSpace: 'nowrap',
    ...extra,
  })
  const alerts = [
    { icon: CheckCircle2, fg: t.success, bg: t.successBg, text: 'Alterações salvas' },
    { icon: TriangleAlert, fg: t.warning, bg: t.warningBg, text: 'Plano perto do limite' },
    { icon: XCircle, fg: t.error, bg: t.errorBg, text: 'Falha no pagamento' },
    { icon: Info, fg: t.info, bg: t.infoBg, text: 'Nova versão disponível' },
  ]
  return (
    <div
      data-testid="identity-preview"
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr' : '150px minmax(0, 1fr)',
        background: t.bg,
        color: t.text,
        fontFamily: m.bodyFont,
        fontSize: ty.baseSize - 1,
        fontWeight: ty.bodyWeight,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--s-border)',
        minHeight: compact ? undefined : 460,
      }}
    >
      {!compact && (
        <div style={{ background: t.navBg, color: t.navText, padding: `${pad * 2}px ${pad}px`, display: 'grid', alignContent: 'start', gap: 4, borderRight: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 14px', fontFamily: m.headingFont, fontWeight: ty.headingWeight, fontSize: fs(14), color: t.navActiveText === '#ffffff' ? '#fff' : t.text }}>
            <span style={{ width: 20, height: 20, borderRadius: m.radiusSm, background: t.gradientEnabled ? `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` : t.primary }} />
            {projectName || 'Seu projeto'}
          </div>
          {(menu.length ? menu : ['Início', 'Projetos', 'Equipe', 'Ajustes'])
            .map((label, i) => ({ icon: [Home, LayoutGrid, Users, Settings, Bell][i % 5], label, active: i === 0 }))
            .map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 32,
                padding: '0 8px',
                borderRadius: m.radiusMd,
                background: active ? t.navActive : 'transparent',
                color: active ? t.navActiveText : t.navText,
                fontSize: fs(13),
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={15} {...iconProps} />
              {label}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gap: pad * 2, padding: pad * 2, alignContent: 'start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: m.headingFont, fontWeight: ty.headingWeight, fontSize: Math.round(ty.baseSize * 1.45), lineHeight: 1.2 }}>Visão geral</div>
            <div style={{ color: t.textMuted, fontSize: fs(12.5) }}>
              Texto secundário com <a style={{ color: t.link, textDecoration: 'underline' }}>um link</a>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, color: t.icon }}>
            <Search size={17} {...iconProps} />
            <Bell size={17} {...iconProps} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <span style={btn(t.gradientEnabled ? t.primary : t.primary, t.onPrimary, t.gradientEnabled ? { background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` } : {})}>Primário</span>
          <span style={btn(t.primaryHover, t.onPrimary)}>Hover</span>
          <span style={btn(t.surface, t.text, { border: `1px solid ${t.borderStrong}` })}>Secundário</span>
          <span style={btn(t.accent, t.onAccent)}>Destaque</span>
          <span style={btn(t.disabled, t.disabledText)}>Desabilitado</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: fs(12), fontWeight: 600 }}>Campo</span>
            <span style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 10px', borderRadius: m.radiusMd, border: `1px solid ${t.borderStrong}`, background: t.surface, color: t.placeholder, fontSize: fs(13) }}>Placeholder…</span>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: fs(12), fontWeight: 600 }}>Com foco</span>
            <span style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 10px', borderRadius: m.radiusMd, border: `1px solid ${t.focusRing}`, boxShadow: `0 0 0 3px ${t.focusRing}33`, background: t.surface, color: t.text, fontSize: fs(13) }}>maria@email.com</span>
          </div>
        </div>
        <div style={{ ...surface, borderRadius: m.radiusLg, padding: pad * 1.5, display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontFamily: m.headingFont, fontWeight: ty.headingWeight, fontSize: fs(14) }}>Pedidos recentes</strong>
            <span style={{ fontSize: fs(11.5), fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: t.primarySoft, color: t.selectedText }}>12 novos</span>
          </div>
          {['Ana Souza', 'Bruno Lima', 'Carla Dias'].map((n, i) => (
            <div key={n} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '7px 8px', borderRadius: m.radiusSm, background: i === 1 ? t.selected : 'transparent', color: i === 1 ? t.selectedText : t.text, fontSize: fs(13), borderTop: i ? `1px solid ${t.border}` : 'none' }}>
              <span>{n}</span>
              <span style={{ color: i === 1 ? t.selectedText : t.textMuted }}>R$ {(120 + i * 87).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>
        {!compact && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 6 }}>
            {alerts.map(({ icon: Icon, fg, bg, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: m.radiusMd, background: bg, color: fg, fontSize: fs(12.5), fontWeight: 560 }}>
                <Icon size={14} {...iconProps} />
                {text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Mini amostra usada nos cartões de paleta. */
export function PaletteSwatch({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr 36px', height: 128, background: t.bg }}>
      <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr', minHeight: 0 }}>
        <div style={{ background: t.navBg, borderRight: `1px solid ${t.border}`, display: 'grid', alignContent: 'start', gap: 5, padding: '10px 8px' }}>
          <span style={{ height: 8, borderRadius: 3, background: t.primary }} />
          <span style={{ height: 6, borderRadius: 3, background: t.navActive }} />
          <span style={{ height: 6, borderRadius: 3, background: t.border }} />
          <span style={{ height: 6, borderRadius: 3, background: t.border }} />
        </div>
        <div style={{ padding: 10, display: 'grid', alignContent: 'start', gap: 7 }}>
          <span style={{ width: '55%', height: 8, borderRadius: 3, background: t.text }} />
          <span style={{ width: '80%', height: 5, borderRadius: 3, background: t.textMuted, opacity: 0.6 }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            <span style={{ width: 46, height: 18, borderRadius: 5, background: t.gradientEnabled ? `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` : t.primary }} />
            <span style={{ width: 36, height: 18, borderRadius: 5, background: t.surface, border: `1px solid ${t.borderStrong}` }} />
            <span style={{ width: 18, height: 18, borderRadius: 9, background: t.accent }} />
          </div>
          <span style={{ height: 22, borderRadius: 6, background: t.surface, border: `1px solid ${t.border}` }} />
        </div>
      </div>
      <div className="ui-swatches" aria-hidden="true">
        {[t.primary, t.secondary, t.accent, t.bg, t.surface, t.text].map((c, i) => (
          <span key={i} style={{ background: c, borderTop: `1px solid ${t.border}` }} />
        ))}
      </div>
    </div>
  )
}
