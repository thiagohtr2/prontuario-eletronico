import { Settings2 } from 'lucide-react'

/** Exibido quando as variáveis do Supabase ainda não foram configuradas. */
export function SetupNotice() {
  return (
    <div className="flex min-h-full items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-lg rounded-xl border border-line bg-surface p-7 shadow-card">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Settings2 size={21} />
        </div>
        <h1 className="text-xl font-semibold text-ink">Configuração pendente</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          O sistema precisa das credenciais do Supabase para funcionar. Crie um arquivo{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-ink">.env</code> na raiz do projeto
          (ou defina as variáveis no Netlify) com:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-slate-50 px-4 py-3 text-xs leading-6 text-ink">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica`}
        </pre>
        <p className="mt-4 text-sm text-muted">Depois reinicie o servidor ou refaça o deploy.</p>
      </div>
    </div>
  )
}
