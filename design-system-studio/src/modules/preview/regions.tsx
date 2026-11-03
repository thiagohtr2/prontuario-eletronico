import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  Filter,
  Home,
  Inbox,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Users,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { surfaceStyle } from '@/core/tokens'
import type { ResolvedTheme } from '@/core/types'

/**
 * Conteúdos padrão de cada região da prévia integrada. Todos herdam a identidade global:
 * cores, fontes, raios, bordas e densidade vêm do tema resolvido.
 */

const NAV = [
  { icon: Home, label: 'Início' },
  { icon: BarChart3, label: 'Relatórios' },
  { icon: Users, label: 'Clientes' },
  { icon: CalendarDays, label: 'Agenda' },
  { icon: Inbox, label: 'Mensagens' },
  { icon: Settings, label: 'Configurações' },
]

/** Itens do menu do projeto com ícones genéricos; sem itens definidos, usa o menu de exemplo. */
function navList(nav?: string[]) {
  if (!nav?.length) return NAV
  return nav.map((label, i) => ({ icon: NAV[i % NAV.length].icon, label }))
}

const fill: CSSProperties = { width: '100%', height: '100%', minWidth: 0, minHeight: 0, overflow: 'hidden' }

export function Brand({ theme, name, size = 15 }: { theme: ResolvedTheme; name: string; size?: number }) {
  const t = theme.tokens
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: size, color: 'inherit', whiteSpace: 'nowrap' }}>
      <span style={{ width: size + 7, height: size + 7, borderRadius: theme.metrics.radiusSm + 2, background: t.gradientEnabled ? `linear-gradient(135deg, ${t.gradientFrom}, ${t.gradientTo})` : t.primary, flex: 'none' }} />
      {name}
    </span>
  )
}

export function DefaultHeader({ theme, name, nav }: { theme: ResolvedTheme; name: string; nav?: string[] }) {
  const t = theme.tokens
  const m = theme.metrics
  return (
    <div style={{ ...fill, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', background: t.surface, color: t.text, borderBottom: `1px solid ${t.border}`, fontFamily: m.bodyFont }}>
      <Brand theme={theme} name={name} />
      <nav style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
        {(nav?.length ? nav.slice(0, 4) : ['Visão geral', 'Projetos', 'Equipe']).map((l, i) => (
          <span key={l} style={{ padding: '6px 10px', borderRadius: m.radiusMd, fontSize: 13.5, fontWeight: i === 0 ? 600 : 500, background: i === 0 ? t.selected : 'transparent', color: i === 0 ? t.selectedText : t.textMuted }}>
            {l}
          </span>
        ))}
      </nav>
      <span style={{ flex: 1 }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', minWidth: 200, borderRadius: m.radiusMd, border: `1px solid ${t.border}`, color: t.placeholder, fontSize: 13 }}>
        <Search size={15} /> Buscar…
      </span>
      <Bell size={18} color={t.icon} />
      <span style={{ width: 32, height: 32, borderRadius: 999, background: t.primarySoft, color: t.selectedText, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>AV</span>
    </div>
  )
}

export function DefaultSidebar({ theme, name, floating, hideBrand, nav }: { theme: ResolvedTheme; name: string; floating?: boolean; hideBrand?: boolean; nav?: string[] }) {
  const t = theme.tokens
  const m = theme.metrics
  return (
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 12px', background: t.navBg, color: t.navText, borderRight: floating ? 'none' : `1px solid ${t.border}`, fontFamily: m.bodyFont }}>
      {!hideBrand && (
        <div style={{ padding: '0 8px 16px', color: t.navActiveText === '#ffffff' ? '#ffffff' : t.text }}>
          <Brand theme={theme} name={name} />
        </div>
      )}
      {navList(nav).map(({ icon: Icon, label }, i) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px', borderRadius: m.radiusMd, background: i === 0 ? t.navActive : 'transparent', color: i === 0 ? t.navActiveText : t.navText, fontSize: 14, fontWeight: i === 0 ? 600 : 500 }}>
          <Icon size={17} />
          {label}
        </span>
      ))}
      <span style={{ flex: 1 }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderTop: `1px solid ${t.border}`, fontSize: 13 }}>
        <span style={{ width: 30, height: 30, borderRadius: 999, background: t.primarySoft, color: t.selectedText, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>AV</span>
        Ana Vieira
      </span>
    </div>
  )
}

export function Rail({ theme, nav }: { theme: ResolvedTheme; nav?: string[] }) {
  const t = theme.tokens
  return (
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 0', background: t.navBg, color: t.navText, borderRight: `1px solid ${t.border}` }}>
      <span style={{ width: 30, height: 30, borderRadius: theme.metrics.radiusMd, background: t.primary, marginBottom: 10 }} />
      {navList(nav).slice(0, 5).map(({ icon: Icon, label }, i) => (
        <span key={label} title={label} style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: theme.metrics.radiusMd, background: i === 0 ? t.navActive : 'transparent', color: i === 0 ? t.navActiveText : t.navText }}>
          <Icon size={19} />
        </span>
      ))}
    </div>
  )
}

export function Submenu({ theme, title = 'Projetos', items, active, onPick }: { theme: ResolvedTheme; title?: string; items?: string[]; active?: string; onPick?: (label: string) => void }) {
  const t = theme.tokens
  if (items?.length) {
    // Índice do site: as seções reais, com a página aberta em destaque.
    return (
      <nav aria-label={title} style={{ ...fill, padding: '18px 12px', background: t.surface, color: t.text, borderRight: `1px solid ${t.border}`, fontFamily: theme.metrics.bodyFont }}>
        <div style={{ fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 14, padding: '0 8px 12px' }}>{title}</div>
        {items.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onPick?.(l)}
            aria-current={l === active ? 'page' : undefined}
            style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, cursor: 'pointer', padding: '8px', borderRadius: theme.metrics.radiusSm, background: l === active ? t.selected : 'transparent', color: l === active ? t.selectedText : t.textMuted, fontSize: 13.5, fontFamily: 'inherit' }}
          >
            {l}
          </button>
        ))}
      </nav>
    )
  }
  return (
    <div style={{ ...fill, padding: '18px 12px', background: t.surface, color: t.text, borderRight: `1px solid ${t.border}`, fontFamily: theme.metrics.bodyFont }}>
      <div style={{ fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 14, padding: '0 8px 12px' }}>{title}</div>
      {['Todos', 'Em andamento', 'Revisão', 'Concluídos', 'Arquivados'].map((l, i) => (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: theme.metrics.radiusSm, background: i === 1 ? t.selected : 'transparent', color: i === 1 ? t.selectedText : t.textMuted, fontSize: 13.5 }}>
          {l}
          <span>{[24, 8, 3, 11, 2][i]}</span>
        </div>
      ))}
    </div>
  )
}

function Kpi({ theme, label, value, delta }: { theme: ResolvedTheme; label: string; value: string; delta: string }) {
  const t = theme.tokens
  return (
    <div style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg, padding: 16, display: 'grid', gap: 6, minWidth: 0 }}>
      <span style={{ color: t.textMuted, fontSize: 12.5 }}>{label}</span>
      <span style={{ fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 24, lineHeight: 1.1 }}>{value}</span>
      <span style={{ color: t.success, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <ArrowUpRight size={14} />
        {delta}
      </span>
    </div>
  )
}

function Chart({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  const bars = [40, 62, 48, 75, 58, 88, 70, 94, 66, 80, 72, 98]
  return (
    <div style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg, padding: 16, display: 'grid', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 14.5 }}>Receita mensal</strong>
        <span style={{ fontSize: 12, color: t.textMuted }}>Últimos 12 meses</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
        {bars.map((h, i) => (
          <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: `${theme.metrics.radiusSm}px ${theme.metrics.radiusSm}px 0 0`, background: i === bars.length - 1 ? t.primary : t.primarySoft }} />
        ))}
      </div>
    </div>
  )
}

function Table({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  const rows = [
    ['Marina Costa', 'Plano Pro', 'Ativo', 'R$ 249,00'],
    ['João Pereira', 'Plano Básico', 'Pendente', 'R$ 89,00'],
    ['Luiza Rocha', 'Plano Pro', 'Ativo', 'R$ 249,00'],
    ['Pedro Alves', 'Empresa', 'Atrasado', 'R$ 990,00'],
  ]
  const tone = (s: string) => (s === 'Ativo' ? [t.success, t.successBg] : s === 'Pendente' ? [t.warning, t.warningBg] : [t.error, t.errorBg])
  return (
    <div style={{ ...surfaceStyle(theme), borderRadius: theme.metrics.radiusLg, overflow: 'hidden', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${t.border}` }}>
        <strong style={{ fontFamily: theme.metrics.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 14.5 }}>Clientes recentes</strong>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: t.link }}>
          Ver todos <ChevronRight size={14} />
        </span>
      </div>
      {rows.map((r, i) => {
        const [fg, bg] = tone(r[2])
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.8fr 0.8fr', gap: 8, alignItems: 'center', padding: '10px 16px', borderTop: i ? `1px solid ${t.border}` : 'none', fontSize: 13 }}>
            <span style={{ fontWeight: 560 }}>{r[0]}</span>
            <span style={{ color: t.textMuted }}>{r[1]}</span>
            <span style={{ justifySelf: 'start', padding: '2px 8px', borderRadius: 999, background: bg, color: fg, fontSize: 11.5, fontWeight: 600 }}>{r[2]}</span>
            <span style={{ textAlign: 'right' }}>{r[3]}</span>
          </div>
        )
      })}
    </div>
  )
}

export function DashboardContent({ theme, title = 'Visão geral', dense = false }: { theme: ResolvedTheme; title?: string; dense?: boolean }) {
  const t = theme.tokens
  const m = theme.metrics
  return (
    <div style={{ ...fill, overflow: 'hidden', background: t.bg, color: t.text, fontFamily: m.bodyFont, padding: dense ? 16 : 24, display: 'flex', flexDirection: 'column', gap: dense ? 12 : 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: m.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 22 }}>{title}</div>
          <div style={{ color: t.textMuted, fontSize: 13 }}>Atualizado há 5 minutos</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px', borderRadius: m.radiusMd, border: `1px solid ${t.borderStrong}`, background: t.surface, fontSize: 13 }}>
            <Filter size={14} /> Filtros
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: m.radiusMd, background: t.primary, color: t.onPrimary, fontSize: 13, fontWeight: 600 }}>
            <Plus size={15} /> Novo
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        <Kpi theme={theme} label="Receita" value="R$ 48,2 mil" delta="12,4%" />
        <Kpi theme={theme} label="Clientes ativos" value="1.284" delta="3,1%" />
        <Kpi theme={theme} label="Ticket médio" value="R$ 186" delta="5,8%" />
        <Kpi theme={theme} label="Satisfação" value="94%" delta="1,2%" />
      </div>
      <Chart theme={theme} />
      <Table theme={theme} />
    </div>
  )
}

export function DetailPanel({ theme, title = 'Detalhes' }: { theme: ResolvedTheme; title?: string }) {
  const t = theme.tokens
  const m = theme.metrics
  return (
    <div style={{ ...fill, background: t.surface, color: t.text, borderLeft: `1px solid ${t.border}`, padding: 18, display: 'grid', alignContent: 'start', gap: 14, fontFamily: m.bodyFont }}>
      <div style={{ fontFamily: m.headingFont, fontWeight: theme.typography.headingWeight, fontSize: 15 }}>{title}</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ width: 40, height: 40, borderRadius: 999, background: t.primarySoft, color: t.selectedText, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>MC</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Marina Costa</div>
          <div style={{ color: t.textMuted, fontSize: 12.5 }}>marina@empresa.com</div>
        </div>
      </div>
      {[
        ['Plano', 'Pro anual'],
        ['Cliente desde', 'mar/2024'],
        ['Último pedido', 'há 2 dias'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: `1px solid ${t.border}` }}>
          <span style={{ color: t.textMuted }}>{k}</span>
          <span>{v}</span>
        </div>
      ))}
      <span style={{ height: 36, display: 'grid', placeItems: 'center', borderRadius: m.radiusMd, background: t.primary, color: t.onPrimary, fontSize: 13, fontWeight: 600 }}>Abrir ficha</span>
    </div>
  )
}

export function ChatPanel({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  const m = theme.metrics
  const bubble = (mine: boolean): CSSProperties => ({
    justifySelf: mine ? 'end' : 'start',
    maxWidth: '85%',
    padding: '8px 12px',
    borderRadius: m.radiusLg,
    background: mine ? t.primary : t.surfaceAlt,
    color: mine ? t.onPrimary : t.text,
    fontSize: 13,
  })
  return (
    <div style={{ ...fill, display: 'flex', flexDirection: 'column', background: t.surface, color: t.text, borderLeft: `1px solid ${t.border}`, fontFamily: m.bodyFont }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${t.border}`, fontWeight: 600, fontSize: 14 }}>
        <MessageSquare size={16} /> Assistente
      </div>
      <div style={{ flex: 1, display: 'grid', alignContent: 'start', gap: 8, padding: 14 }}>
        <span style={bubble(false)}>Olá! Posso resumir os pedidos da semana?</span>
        <span style={bubble(true)}>Sim, por favor.</span>
        <span style={bubble(false)}>Foram 128 pedidos, 12% a mais que a semana passada.</span>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: `1px solid ${t.border}` }}>
        <span style={{ flex: 1, height: 36, display: 'flex', alignItems: 'center', padding: '0 10px', borderRadius: m.radiusMd, border: `1px solid ${t.borderStrong}`, color: t.placeholder, fontSize: 13 }}>Escreva uma mensagem…</span>
        <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: m.radiusMd, background: t.primary, color: t.onPrimary }}>
          <Send size={15} />
        </span>
      </div>
    </div>
  )
}

export function FooterBar({ theme, name }: { theme: ResolvedTheme; name: string }) {
  const t = theme.tokens
  return (
    <div style={{ ...fill, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '0 20px', background: t.surface, color: t.textMuted, borderTop: `1px solid ${t.border}`, fontSize: 12.5, fontFamily: theme.metrics.bodyFont }}>
      <span>© 2026 {name}</span>
      <span style={{ display: 'flex', gap: 14 }}>
        <span>Privacidade</span>
        <span>Termos</span>
        <span>Ajuda</span>
      </span>
    </div>
  )
}

export function Toolbar({ theme }: { theme: ResolvedTheme }) {
  const t = theme.tokens
  return (
    <div style={{ ...fill, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: t.surface, color: t.text, borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
      {[LayoutGrid, FileText, Filter, CalendarDays].map((Icon, i) => (
        <span key={i} style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: theme.metrics.radiusSm, background: i === 0 ? t.selected : 'transparent', color: i === 0 ? t.selectedText : t.icon }}>
          <Icon size={16} />
        </span>
      ))}
      <span style={{ flex: 1 }} />
      <span style={{ color: t.textMuted }}>Visualização: quadro</span>
    </div>
  )
}
