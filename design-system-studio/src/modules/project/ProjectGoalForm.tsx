import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Boxes, LayoutDashboard, Megaphone, MonitorSmartphone, Plus, Sparkles, Store, X, type LucideIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { ENTRY_FLOWS, PROJECT_TYPES, SUGGESTIONS, type ProjectType } from '@/core/project'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { useProject, useStudio } from '@/core/store'
import { Button, Callout, Field, Input, Section, Textarea, keepScroll, toast } from '@/ui'
import './project.css'

const TYPE_ICON: Record<ProjectType, LucideIcon> = {
  saas: Boxes,
  dashboard: BarChart3,
  loja: Store,
  landing: Megaphone,
  portfolio: LayoutDashboard,
  'one-screen': MonitorSmartphone,
  outro: Sparkles,
}

const FEATURE_SUGGESTIONS: Record<ProjectType, string[]> = {
  saas: ['Painel inicial', 'Cadastro de clientes', 'Relatórios', 'Configurações', 'Notificações', 'Planos e pagamentos', 'Equipe e permissões'],
  dashboard: ['Indicadores (KPIs)', 'Gráficos', 'Tabelas com filtros', 'Filtro por período', 'Exportar relatórios', 'Alertas'],
  loja: ['Catálogo', 'Busca e filtros', 'Página de produto', 'Carrinho', 'Checkout', 'Minha conta', 'Favoritos'],
  landing: ['Hero com chamada', 'Benefícios', 'Depoimentos', 'Planos e preços', 'Perguntas frequentes', 'Formulário de contato'],
  portfolio: ['Galeria de projetos', 'Sobre', 'Serviços', 'Contato', 'Blog'],
  'one-screen': ['Indicadores em tempo real', 'Alertas', 'Status de equipamentos', 'Controles rápidos', 'Relógio e data'],
  outro: [],
}

const TECH_SUGGESTIONS = ['React + TypeScript', 'Next.js', 'Vue', 'Svelte', 'HTML + CSS + JavaScript', 'Tailwind CSS', 'React Native']

export function ProjectGoalForm({ guided = false }: { guided?: boolean }) {
  const meta = useStudio(useShallow((s) => s.project.meta))
  const updateMeta = useStudio((s) => s.updateMeta)
  const setEntryFlow = useStudio((s) => s.setEntryFlow)
  const entryFlow = useProject((p) => p.entry.flow)
  const showHints = useProject((p) => p.prefs.showHints)
  const [feature, setFeature] = useState('')
  const navigate = useNavigate()

  const addFeature = (value: string) => {
    const v = value.trim()
    if (!v || meta.features.includes(v)) return
    updateMeta({ features: [...meta.features, v] })
  }
  const suggestion = meta.projectType ? SUGGESTIONS[meta.projectType] : null
  const suggestedFlow = suggestion ? ENTRY_FLOWS.find((f) => f.id === suggestion.entryFlow) : null
  const recDesktop = suggestion ? desktopById(suggestion.desktop[0]) : undefined
  const recMobile = suggestion ? mobileById(suggestion.mobile[0]) : undefined

  /** Caminho rápido: aplica a combinação recomendada e vai direto para a revisão do esqueleto. */
  const useRecommended = async () => {
    if (!suggestion || !suggestedFlow || !recDesktop || !recMobile) return
    // Catálogos de entrada carregados só quando o atalho é usado (não pesam na etapa 1).
    const { landings, logins } = await import('@/modules/entry/catalog')
    const st = useStudio.getState()
    st.setEntryFlow(suggestedFlow.id)
    if (suggestedFlow.needsLanding && !st.project.entry.landingId) st.selectLanding(landings[0].id)
    if (suggestedFlow.needsLogin && !st.project.entry.loginId) st.selectLogin(logins[0].id)
    if (suggestedFlow.needsLogin && !st.project.entry.signupId) st.setNoSignup(true)
    if (!st.project.layout.desktopId) st.selectDesktop(recDesktop.id)
    if (!st.project.layout.mobileId) st.selectMobile(recMobile.id)
    for (const step of ['objetivo', 'entrada', 'desktop', 'mobile'] as const) st.completeStep(step)
    navigate('/guiado/revisao')
  }

  return (
    <div className="u-stack-lg">
      <Section
        id="tipo"
        title="O que você pretende construir?"
        description={guided && showHints ? 'Escolha o tipo mais próximo. Isso só serve para o Studio sugerir caminhos — você continua livre para escolher qualquer estrutura.' : undefined}
      >
        <div className="goal-types" role="radiogroup" aria-label="Tipo de projeto">
          {PROJECT_TYPES.map((t) => {
            const Icon = TYPE_ICON[t.id]
            const selected = meta.projectType === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className="goal-type"
                data-testid={`project-type-${t.id}`}
                onClick={() => keepScroll(() => updateMeta({ projectType: t.id }))}
              >
                <span className="goal-type__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="goal-type__name">{t.name}</span>
                <span className="goal-type__desc">{t.description}</span>
              </button>
            )
          })}
        </div>
        {meta.projectType === 'outro' && (
          <Field label="Descreva o tipo de projeto" htmlFor="type-other">
            <Input id="type-other" value={meta.projectTypeOther} placeholder="Ex.: plataforma de agendamento para estúdios de tatuagem" onChange={(e) => updateMeta({ projectTypeOther: e.target.value })} />
          </Field>
        )}
        {suggestion && suggestedFlow && (
          <Callout title="Sugestão (opcional):">
            {suggestion.note} Para este tipo de projeto, costuma funcionar o fluxo <strong>“{suggestedFlow.name}”</strong>.{' '}
            {entryFlow !== suggestedFlow.id ? (
              <Button
                size="sm"
                variant="soft"
                onClick={() =>
                  keepScroll(() => {
                    setEntryFlow(suggestedFlow.id)
                    toast.success(`Aplicado: fluxo “${suggestedFlow.name}”. Você pode mudar na etapa 2.`)
                  })
                }
                style={{ marginLeft: 4 }}
              >
                Usar esta sugestão
              </Button>
            ) : (
              <span>(já aplicada)</span>
            )}
          </Callout>
        )}
        {guided && suggestion && suggestedFlow && recDesktop && recMobile && (
          <div className="goal-recommended" data-testid="recommended-block">
            <strong>Recomendados para “{PROJECT_TYPES.find((t) => t.id === meta.projectType)?.name}”</strong>
            <ul>
              <li>Entrada: {suggestedFlow.name}</li>
              <li>Computador: {recDesktop.name}</li>
              <li>Celular: {recMobile.name}</li>
            </ul>
            <p className="u-subtle u-small">Escolhas que você já fez são mantidas. Tudo pode ser trocado na revisão.</p>
            <Button variant="primary" size="sm" onClick={useRecommended} data-testid="use-recommended">
              Usar recomendados e continuar
            </Button>
          </div>
        )}
      </Section>

      <Section id="detalhes" title="Sobre o projeto" description={guided && showHints ? 'Quanto mais claro, melhor a IA entende o que construir. Só o nome é realmente necessário.' : undefined}>
        <div className="ui-form-grid">
          <Field label="Nome do projeto" htmlFor="p-name">
            <Input id="p-name" value={meta.name} placeholder="Ex.: Agenda Viva" autoComplete="off" onChange={(e) => updateMeta({ name: e.target.value })} data-testid="project-name" />
          </Field>
          <Field label="Objetivo" htmlFor="p-objective" help="Em uma frase: o que o site resolve?">
            <Input id="p-objective" value={meta.objective} placeholder="Ex.: organizar agendamentos de clientes" onChange={(e) => updateMeta({ objective: e.target.value })} />
          </Field>
          <Field label="Descrição resumida" htmlFor="p-desc" full>
            <Textarea id="p-desc" value={meta.description} rows={3} placeholder="Conte em poucas linhas como o site funciona." onChange={(e) => updateMeta({ description: e.target.value })} />
          </Field>
          <Field label="Público-alvo" htmlFor="p-audience" help="Quem vai usar?">
            <Input id="p-audience" value={meta.audience} placeholder="Ex.: donos de pequenos estúdios" onChange={(e) => updateMeta({ audience: e.target.value })} />
          </Field>
          <Field label="Finalidade principal" htmlFor="p-purpose" help="A ação mais importante que a pessoa faz no site.">
            <Input id="p-purpose" value={meta.purpose} placeholder="Ex.: marcar um horário em menos de 1 minuto" onChange={(e) => updateMeta({ purpose: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section id="funcionalidades" title="Módulos e funcionalidades previstas" description="Liste as partes principais do sistema. Elas entram no Master Prompt.">
        <form
          className="u-row"
          onSubmit={(e) => {
            e.preventDefault()
            addFeature(feature)
            setFeature('')
          }}
        >
          <div className="u-grow" style={{ flexBasis: 260 }}>
            <Input aria-label="Nova funcionalidade" value={feature} placeholder="Ex.: Agenda semanal" onChange={(e) => setFeature(e.target.value)} />
          </div>
          <Button type="submit" icon={<Plus />}>
            Adicionar
          </Button>
        </form>
        {meta.features.length > 0 && (
          <ul className="goal-tags" aria-label="Funcionalidades adicionadas">
            {meta.features.map((f) => (
              <li key={f} className="goal-tag">
                {f}
                <button type="button" aria-label={`Remover ${f}`} onClick={() => updateMeta({ features: meta.features.filter((x) => x !== f) })}>
                  <X aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {meta.projectType && FEATURE_SUGGESTIONS[meta.projectType].some((f) => !meta.features.includes(f)) && (
          <div className="u-stack-sm">
            <span className="u-subtle u-small">Sugestões para “{PROJECT_TYPES.find((t) => t.id === meta.projectType)?.name}”:</span>
            <div className="ui-chips">
              {FEATURE_SUGGESTIONS[meta.projectType]
                .filter((f) => !meta.features.includes(f))
                .map((f) => (
                  <button key={f} type="button" className="ui-chip" onClick={() => keepScroll(() => addFeature(f))}>
                    <Plus width={14} height={14} aria-hidden="true" /> {f}
                  </button>
                ))}
            </div>
          </div>
        )}
      </Section>

      <Section
        id="menu"
        title="Itens do menu principal"
        description="Os destinos da navegação, na ordem em que devem aparecer. Header, sidebar, menu do celular, prévia e Master Prompt usam exatamente estes itens — os menus dos modelos são só exemplo."
      >
        <Field label="Itens do menu (um por linha)" htmlFor="p-nav" help={meta.navItems.some((s) => s.trim()) ? `${meta.navItems.filter((s) => s.trim()).length} item(ns). No celular com navegação inferior, os 4–5 primeiros viram atalhos e o restante vai para “Mais”.` : 'Ex.: Início, Projetos, Tarefas, Relatórios, Configurações.'}>
          <Textarea id="p-nav" rows={5} value={meta.navItems.join('\n')} placeholder={'Início\nProjetos\nTarefas\nRelatórios\nConfigurações'} onChange={(e) => updateMeta({ navItems: e.target.value.split('\n') })} />
        </Field>
        {meta.features.length > 0 && !meta.navItems.some((s) => s.trim()) && (
          <div>
            <Button variant="ghost" icon={<Plus />} onClick={() => updateMeta({ navItems: [...meta.features] })}>
              Usar as funcionalidades como itens do menu
            </Button>
          </div>
        )}
      </Section>

      <Section id="tecnologia" title="Tecnologia desejada (opcional)" description="Se você já sabe com o que a IA deve construir, informe aqui.">
        <Field label="Tecnologia" htmlFor="p-tech">
          <Input id="p-tech" value={meta.tech} placeholder="Ex.: React + TypeScript + Tailwind" onChange={(e) => updateMeta({ tech: e.target.value })} />
        </Field>
        <div className="ui-chips">
          {TECH_SUGGESTIONS.map((t) => (
            <button key={t} type="button" className="ui-chip" aria-pressed={meta.tech === t} onClick={() => keepScroll(() => updateMeta({ tech: meta.tech === t ? '' : t }))}>
              {t}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
