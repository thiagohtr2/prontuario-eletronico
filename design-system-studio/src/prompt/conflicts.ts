import { ENTRY_FLOWS, type Project } from '@/core/project'
import { paletteById } from '@/modules/color/catalog'
import { siteById } from '@/modules/inspiration/catalog'
import { desktopById, mobileById } from '@/modules/layouts/catalog'
import { headerById, sidebarById } from '@/modules/navigation/catalog'
import { templateById } from '@/modules/templates/catalog'

export interface ConflictOption {
  id: string
  label: string
  /** Instrução que entra no Master Prompt quando esta opção é escolhida. */
  instruction: string
}

export interface Conflict {
  id: string
  title: string
  description: string
  options: ConflictOption[]
  /** Opção escolhida pelo usuário (ou null se ainda não decidiu). */
  resolution: ConflictOption | null
}

export interface Pending {
  id: string
  message: string
  /** Rota do módulo onde a decisão é tomada. */
  route: string
}

/** Detecta escolhas incompatíveis entre módulos. Nunca resolve sozinho: o usuário decide. */
export function detectConflicts(project: Project): Conflict[] {
  const out: Omit<Conflict, 'resolution'>[] = []
  const desktop = desktopById(project.layout.desktopId)
  const mobile = mobileById(project.layout.mobileId)
  const header = project.navigation.header ? headerById(project.navigation.header.id) : undefined
  const sidebar = project.navigation.sidebar ? sidebarById(project.navigation.sidebar.id) : undefined

  if (desktop && header) {
    const headerRegion = desktop.regions.find((r) => r.kind === 'header')
    if (!headerRegion) {
      out.push({
        id: 'header-sem-regiao',
        title: 'Header escolhido, mas o layout desktop não tem header',
        description: `O layout “${desktop.name}” não reserva uma região de header, mas você escolheu o header “${header.name}”.`,
        options: [
          { id: 'layout', label: 'Manter o layout sem header', instruction: `Siga o layout “${desktop.name}”: não crie header no desktop. Use o estilo do header “${header.name}” apenas onde existir barra superior (ex.: celular).` },
          { id: 'header', label: 'Adicionar o header ao layout', instruction: `Acrescente o header “${header.name}” no topo do layout “${desktop.name}”, preservando as demais regiões.` },
        ],
      })
    } else if (header.floating && !headerRegion.floating && !headerRegion.overlay) {
      out.push({
        id: 'header-flutuante-vs-integral',
        title: 'Header flutuante em um layout com header integral',
        description: `O header “${header.name}” é flutuante (afastado das bordas, sobreposto ao conteúdo), mas o layout “${desktop.name}” exige um header estático de largura integral.`,
        options: [
          { id: 'layout', label: 'Priorizar o layout (header integral)', instruction: `O header é estático e integral, como no layout “${desktop.name}”. Use do modelo “${header.name}” apenas o conteúdo e o estilo interno, sem flutuação.` },
          { id: 'header', label: 'Priorizar o header (flutuante)', instruction: `O header flutua com afastamento das bordas, como no modelo “${header.name}”. Ajuste o layout “${desktop.name}” para reservar o espaço do header flutuante sem sobrepor conteúdo importante.` },
        ],
      })
    }
  }

  if (desktop && sidebar) {
    const sidebarRegion = desktop.regions.find((r) => r.kind === 'sidebar' || r.kind === 'rail')
    if (!sidebarRegion) {
      out.push({
        id: 'sidebar-sem-regiao',
        title: 'Sidebar escolhida, mas o layout desktop não tem navegação lateral',
        description: `O layout “${desktop.name}” não tem sidebar, mas você escolheu a sidebar “${sidebar.name}”.`,
        options: [
          { id: 'layout', label: 'Manter o layout sem sidebar', instruction: `Siga o layout “${desktop.name}”: não crie sidebar no desktop.` },
          { id: 'sidebar', label: 'Adicionar a sidebar ao layout', instruction: `Acrescente a sidebar “${sidebar.name}” à esquerda do layout “${desktop.name}”, preservando as demais regiões.` },
        ],
      })
    } else if (sidebar.floating !== Boolean(sidebarRegion.floating)) {
      const layoutShape = sidebarRegion.floating ? 'flutuante' : 'integral (do topo à base, encostada na borda)'
      const sidebarShape = sidebar.floating ? 'flutuante' : 'integral'
      out.push({
        id: 'sidebar-geometria',
        title: 'Geometria da sidebar diferente da do layout',
        description: `O layout “${desktop.name}” tem sidebar ${layoutShape}, mas o modelo “${sidebar.name}” é ${sidebarShape}.`,
        options: [
          { id: 'layout', label: 'Priorizar o layout', instruction: `A sidebar é ${layoutShape}, como no layout “${desktop.name}”. Use do modelo “${sidebar.name}” apenas o conteúdo e o estilo interno.` },
          { id: 'sidebar', label: 'Priorizar a sidebar', instruction: `A sidebar é ${sidebarShape}, como no modelo “${sidebar.name}”. Ajuste o layout “${desktop.name}” a essa geometria.` },
        ],
      })
    }
  }

  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  if (flow && !flow.needsLogin && project.entry.loginId) {
    out.push({
      id: 'login-sem-fluxo',
      title: 'Login escolhido, mas o fluxo de entrada não tem login',
      description: `O fluxo “${flow.name}” não prevê área restrita, mas há um modelo de login selecionado.`,
      options: [
        { id: 'fluxo', label: 'Manter sem login', instruction: 'Não implemente tela de login; desconsidere o modelo de login selecionado.' },
        { id: 'login', label: 'Incluir o login', instruction: 'Inclua a tela de login escolhida, acessível por um botão “Entrar” no header.' },
      ],
    })
  }
  if (flow && !flow.needsLanding && project.entry.landingId) {
    out.push({
      id: 'landing-sem-fluxo',
      title: 'Landing escolhida, mas o fluxo de entrada não tem landing',
      description: `O fluxo “${flow.name}” não prevê página de apresentação, mas há uma landing selecionada.`,
      options: [
        { id: 'fluxo', label: 'Manter sem landing', instruction: 'Não implemente landing page; desconsidere o modelo selecionado.' },
        { id: 'landing', label: 'Incluir a landing', instruction: 'Inclua a landing escolhida como página inicial pública.' },
      ],
    })
  }

  if (project.meta.projectType === 'one-screen') {
    const notOne = [desktop && !desktop.oneScreen ? `desktop “${desktop.name}”` : null, mobile && !mobile.config.oneScreen ? `mobile “${mobile.name}”` : null].filter(Boolean)
    if (notOne.length) {
      out.push({
        id: 'one-screen-layout',
        title: 'Projeto One Screen com layout que rola',
        description: `O projeto é One Screen, mas o layout ${notOne.join(' e o ')} prevê rolagem vertical.`,
        options: [
          { id: 'one-screen', label: 'Priorizar One Screen', instruction: 'A interface principal cabe em uma única viewport, sem rolagem vertical principal; áreas internas podem rolar localmente. Nunca esconda informação importante para caber na tela.' },
          { id: 'layout', label: 'Permitir rolagem', instruction: 'Siga os layouts escolhidos, permitindo rolagem vertical da página.' },
        ],
      })
    }
  }

  const palette = paletteById(project.identity.paletteId)
  if (project.inspiration) {
    const site = siteById(project.inspiration.siteId)
    if (site && palette) {
      out.push({
        id: 'cores-inspiracao',
        title: 'Duas fontes de cor: paleta global e inspiração aprovada',
        description: `A identidade global usa a paleta “${palette.name}”, e a inspiração “${site.brand}” tem paleta própria. Qual prevalece?`,
        options: [
          { id: 'global', label: 'Paleta global prevalece', instruction: `Use os tokens da paleta global “${palette.name}”. Da inspiração “${site.brand}”, aproveite composição, tipografia e atmosfera, não as cores.` },
          { id: 'inspiracao', label: 'Cores da inspiração prevalecem', instruction: `Use as cores da inspiração “${site.brand}” nas páginas públicas; a paleta global vale para a área logada.` },
        ],
      })
    }
  }
  if (project.template) {
    const tpl = templateById(project.template.id)
    if (tpl && palette && (project.template.overrides.primary || tpl.colors.primary) !== palette.base.primary) {
      out.push({
        id: 'cores-template',
        title: 'Template com cores diferentes da paleta global',
        description: `O template “${tpl.name}” tem cores próprias, diferentes da paleta “${palette.name}”.`,
        options: [
          { id: 'global', label: 'Paleta global prevalece', instruction: `Aplique ao template “${tpl.name}” os tokens da paleta global.` },
          { id: 'template', label: 'Cores do template prevalecem', instruction: `Mantenha as cores definidas no template “${tpl.name}” nas páginas baseadas nele.` },
        ],
      })
    }
  }

  return out.map((c) => {
    const chosen = project.prompt.conflictResolutions[c.id]
    return { ...c, resolution: c.options.find((o) => o.id === chosen) ?? null }
  })
}

/** Decisões que ainda faltam para o esqueleto e a identidade ficarem completos. */
export function detectPending(project: Project): Pending[] {
  const out: Pending[] = []
  const flow = ENTRY_FLOWS.find((f) => f.id === project.entry.flow)
  if (!project.meta.projectType) out.push({ id: 'tipo', message: 'Defina o tipo de projeto.', route: '/guiado/objetivo' })
  if (!project.meta.name.trim()) out.push({ id: 'nome', message: 'Dê um nome ao projeto.', route: '/guiado/objetivo' })
  if (!flow) out.push({ id: 'fluxo', message: 'Escolha como as pessoas entram no site (landing, login, direto…).', route: '/guiado/entrada' })
  if (flow?.needsLanding && !project.entry.landingId) out.push({ id: 'landing', message: 'Escolha um modelo de landing page.', route: '/modulos/landing' })
  if (flow?.needsLogin && !project.entry.loginId) out.push({ id: 'login', message: 'Escolha um modelo de login.', route: '/modulos/login' })
  if (flow?.needsLogin && !project.entry.signupId) out.push({ id: 'cadastro', message: 'Escolha um fluxo de cadastro (ou confirme que não haverá cadastro).', route: '/modulos/cadastro' })
  if (!project.layout.desktopId) out.push({ id: 'desktop', message: 'Escolha a arquitetura do computador.', route: '/modulos/desktop' })
  if (!project.layout.mobileId) out.push({ id: 'mobile', message: 'Escolha a arquitetura do celular.', route: '/modulos/mobile' })
  return out
}
