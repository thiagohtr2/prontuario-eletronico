import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/ui/States'
import { SetupNotice } from './components/SetupNotice'
import { useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'
import { HOME_PATH } from './lib/navigation'
import { LandingPage } from './pages/Landing'
import { AuthPage, ResetPasswordPage } from './pages/Auth'
import { DashboardPage } from './pages/Dashboard'
import { PatientsPage } from './pages/Patients'
import { PatientRecordPage } from './pages/PatientRecord'
import { EncountersPage } from './pages/Encounters'
import { EncounterEditorPage } from './pages/EncounterEditor'
import { ClinicsPage } from './pages/Clinics'
import { SettingsPage } from './pages/Settings'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <LoadingState />
      </div>
    )
  }
  if (!session) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export function App() {
  // A landing é pública e funciona mesmo sem o Supabase configurado.
  if (!isSupabaseConfigured) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<SetupNotice />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/entrar" element={<AuthPage mode="entrar" />} />
      <Route path="/cadastro" element={<AuthPage mode="cadastro" />} />
      <Route path="/recuperar-senha" element={<AuthPage mode="recuperar" />} />
      <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
      <Route path="/login" element={<Navigate to="/entrar" replace />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path={HOME_PATH} element={<DashboardPage />} />
        <Route path="/pacientes" element={<PatientsPage />} />
        <Route path="/pacientes/:id" element={<PatientRecordPage />} />
        <Route path="/atendimentos" element={<EncountersPage />} />
        <Route path="/atendimentos/novo" element={<EncounterEditorPage />} />
        <Route path="/atendimentos/:id/editar" element={<EncounterEditorPage />} />
        <Route path="/clinicas" element={<ClinicsPage />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
