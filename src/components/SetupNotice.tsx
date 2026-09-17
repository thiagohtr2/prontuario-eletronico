import { Settings2 } from 'lucide-react'
import { missingEnvVars } from '../lib/supabase'

/**
 * Exibido quando as credenciais do Supabase não chegaram ao site.
 *
 * As variáveis VITE_* são embutidas no JavaScript durante o build, não lidas
 * quando a página abre. Por isso, cadastrá-las no Netlify só tem efeito no
 * próximo deploy — é a causa mais comum desta tela continuar aparecendo.
 */
export function SetupNotice() {
  return (
    <div className="flex min-h-full items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-xl rounded-xl border border-line bg-surface p-7 shadow-card">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Settings2 size={21} />
        </div>
        <h1 className="text-xl font-semibold text-ink">Configuração pendente</h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          {missingEnvVars.length === 2
            ? 'O site não recebeu as credenciais do Supabase.'
            : 'O site recebeu apenas parte das credenciais do Supabase.'}{' '}
          Faltou:
        </p>
        <ul className="mt-3 space-y-1.5">
          {missingEnvVars.map((name) => (
            <li key={name}>
              <code className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-ink">{name}</code>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-md font-semibold text-ink">Se o site está no Netlify</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Cadastrar as variáveis não basta: elas entram no site durante o build. Depois de
            salvá-las em <span className="font-medium text-ink">Site configuration → Environment
            variables</span>, publique de novo em{' '}
            <span className="font-medium text-ink">Deploys → Trigger deploy → Clear cache and deploy site</span>.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Se a tela continuar, abra o último deploy e verifique se o build terminou com sucesso.
          </p>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <h2 className="text-md font-semibold text-ink">Se está rodando no seu computador</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Crie um arquivo <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-ink">.env</code>{' '}
            na raiz do projeto e reinicie o servidor:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-slate-50 px-4 py-3 text-xs leading-6 text-ink">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica`}
          </pre>
        </div>
      </div>
    </div>
  )
}
