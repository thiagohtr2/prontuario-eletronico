import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/ui/States'
import { SetupNotice } from './components/SetupNotice'
import { useAuth } from './context/AuthContext'
import { isSupabaseConfigured } from './lib/supabase'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
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
      <div className="flex min-h-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export function App() {
  if (!isSupabaseConfigured) return <SetupNotice />

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignupPage />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
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
