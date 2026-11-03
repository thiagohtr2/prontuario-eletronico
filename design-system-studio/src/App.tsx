import { lazy } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import { useProject } from '@/core/store'
import { RouteError } from '@/shell/ErrorBoundary'
import { Shell } from '@/shell/Shell'

// Cada módulo é carregado sob demanda: um erro em um módulo não derruba o Studio inteiro.
const Home = lazy(() => import('@/modules/home/Home'))
const FreeHome = lazy(() => import('@/modules/home/FreeHome'))
const GuidedStep = lazy(() => import('@/modules/guided/GuidedStep'))
const ProjectGoalPage = lazy(() => import('@/modules/project/ProjectGoalPage'))
const LandingPage = lazy(() => import('@/modules/entry/LandingPage'))
const LoginPage = lazy(() => import('@/modules/entry/LoginPage'))
const SignupPage = lazy(() => import('@/modules/entry/SignupPage'))
const DesktopPage = lazy(() => import('@/modules/layouts/DesktopPage'))
const MobilePage = lazy(() => import('@/modules/layouts/MobilePage'))
const PreviewPage = lazy(() => import('@/modules/preview/PreviewPage'))
const ColorPage = lazy(() => import('@/modules/color/ColorPage'))
const NavigationPage = lazy(() => import('@/modules/navigation/NavigationPage'))
const ComponentsPage = lazy(() => import('@/modules/components/ComponentsPage'))
const InspirationPage = lazy(() => import('@/modules/inspiration/InspirationPage'))
const TemplatesPage = lazy(() => import('@/modules/templates/TemplatesPage'))
const PromptCenter = lazy(() => import('@/modules/prompts/PromptCenter'))
const ExportPage = lazy(() => import('@/modules/prompts/ExportPage'))
const ValidationPage = lazy(() => import('@/modules/validation/ValidationPage'))
const ProjectPage = lazy(() => import('@/modules/project/ProjectPage'))

function GuidedRedirect() {
  const step = useProject((p) => p.guided.step)
  return <Navigate to={`/guiado/${step}`} replace />
}

const router = createHashRouter([
  {
    path: '/',
    element: <Shell />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'livre', element: <FreeHome /> },
      { path: 'guiado', element: <GuidedRedirect /> },
      { path: 'guiado/:step', element: <GuidedStep /> },
      { path: 'modulos/objetivo', element: <ProjectGoalPage /> },
      { path: 'modulos/landing', element: <LandingPage /> },
      { path: 'modulos/login', element: <LoginPage /> },
      { path: 'modulos/cadastro', element: <SignupPage /> },
      { path: 'modulos/desktop', element: <DesktopPage /> },
      { path: 'modulos/mobile', element: <MobilePage /> },
      { path: 'modulos/preview', element: <PreviewPage /> },
      { path: 'modulos/cores', element: <ColorPage /> },
      { path: 'modulos/navegacao', element: <NavigationPage /> },
      { path: 'modulos/componentes', element: <ComponentsPage /> },
      { path: 'modulos/inspiracao', element: <InspirationPage /> },
      { path: 'modulos/templates', element: <TemplatesPage /> },
      { path: 'prompt', element: <PromptCenter /> },
      { path: 'exportar', element: <ExportPage /> },
      { path: 'validacao', element: <ValidationPage /> },
      { path: 'projeto', element: <ProjectPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
