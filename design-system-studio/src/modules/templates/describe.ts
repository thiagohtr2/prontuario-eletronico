import type { ItemDescription } from '@/core/describe'
import type { TemplateChoice } from '@/core/project'
import { fontName, RADIUS_VALUES } from '@/core/tokens'
import { categoryName, templateById } from './catalog'
import { describeOverrides, minimalOverrides, resolveTemplateTheme } from './theme'

/**
 * Descreve o template escolhido com as personalizações (cores, fontes, cantos) e as
 * partes marcadas pelo usuário, no formato do motor de prompts. Função pura.
 */
export function describeTemplate(choice: TemplateChoice): ItemDescription | null {
  const t = templateById(choice.id)
  if (!t) return null
  const overrides = minimalOverrides(t, choice.overrides ?? {})
  const theme = resolveTemplateTheme(t, overrides)
  const selected = t.sections.filter((s) => (choice.sections ?? []).includes(s.id))
  const radius = RADIUS_VALUES[theme.radius]
  const changes = describeOverrides(t, overrides)

  return {
    name: `${t.name} — ${t.brand}`,
    variant: categoryName(t.category),
    summary: `${t.spec.summary}${changes.length ? ' Com personalizações do usuário em cores, fontes ou cantos (veja exceções).' : ''}${
      selected.length ? ` Partes priorizadas pelo usuário: ${selected.map((s) => s.name).join(', ')}.` : ''
    }`,
    colors: {
      primaria: theme.primary,
      textoSobrePrimaria: theme.onPrimary,
      primariaSuave: theme.primarySoft,
      fundo: theme.bg,
      superficie: theme.surface,
      texto: theme.text,
      textoSecundario: theme.muted,
      borda: theme.border,
    },
    properties: {
      template: t.id,
      marcaDeExemplo: t.brand,
      modoDeCor: theme.dark ? 'escuro' : 'claro',
      fonteTitulos: fontName(theme.headingId),
      fonteTexto: fontName(theme.bodyId),
      cantos: radius.label,
      raioSelos: `${theme.rSm}px`,
      raioBotoesECampos: `${theme.rMd}px`,
      raioCartoesEImagens: `${theme.rLg}px`,
      composicao: t.layout === 'dashboard' ? 'aplicação com sidebar' : t.layout === 'docs' ? 'documentação em 3 colunas' : 'seções empilhadas',
      ordemDasSecoes: t.sections.map((s) => s.name).join(' → '),
      partesSelecionadas: selected.length ? selected.map((s) => s.name).join(', ') : 'nenhuma (template inteiro)',
    },
    structure: [
      `Ordem das seções (${t.sections.length}): ${t.sections.map((s, i) => `${i + 1}. ${s.name}`).join(' · ')}.`,
      ...t.spec.structure,
      ...(selected.length
        ? [
            // As seções já estão descritas acima; aqui só a prioridade (sem repetir o texto).
            `Partes selecionadas pelo usuário para edição/geração (priorize-as e detalhe-as primeiro): ${selected.map((s) => s.name).join(', ')} (${selected.length} de ${t.sections.length}).`,
          ]
        : []),
    ],
    behavior: t.spec.behavior ?? [],
    responsive: t.spec.responsive,
    measurements: {
      ...(t.spec.measurements ?? {}),
      raios: `selos ${theme.rSm} px · botões/campos ${theme.rMd} px · cartões ${theme.rLg} px`,
    },
    exceptions: changes,
    notes: [
      ...(t.spec.notes ?? []),
      `Use as cores finais acima como tokens (--color-primary, --color-bg, --color-text, --color-surface, --color-muted, --color-border) e as fontes ${fontName(theme.headingId)} (títulos) e ${fontName(theme.bodyId)} (textos).`,
      `Conteúdo e marca (“${t.brand}”) são fictícios: substitua pelos textos e imagens reais do projeto mantendo a estrutura.`,
      'As ilustrações da prévia representam fotos/imagens: use imagens reais otimizadas (WebP/AVIF, lazy-loading, texto alternativo).',
    ],
  }
}
