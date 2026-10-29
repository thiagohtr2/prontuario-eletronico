import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileSignature,
  History,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'
import { buttonVariants } from '../components/ui/Button'
import { cn } from '../lib/cn'
import { HOME_PATH } from '../lib/navigation'

/** Link com aparência de botão Soft Pill. */
function LinkButton({
  to,
  variant,
  children,
  className,
}: {
  to: string
  variant: keyof typeof buttonVariants
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex h-control min-w-touch items-center justify-center gap-2 rounded-pill px-6 text-sm font-medium transition-colors',
        buttonVariants[variant],
        className,
      )}
    >
      {children}
    </Link>
  )
}

/*
 * Coração em pixels: o "coração de vida" dos jogos de arcade, aqui como
 * símbolo de cuidado. 1 = preenchido, 2 = brilho, 0 = tela.
 */
const HEART = [
  '0110001100',
  '1221011110',
  '1211111111',
  '1111111111',
  '1111111111',
  '0111111110',
  '0011111100',
  '0001111000',
  '0000110000',
]

function PixelHeart() {
  return (
    <div
      className="grid w-full gap-1 sm:gap-1.5"
      style={{ gridTemplateColumns: `repeat(${HEART[0].length}, minmax(0, 1fr))` }}
      role="img"
      aria-label="Coração desenhado em pixels"
    >
      {HEART.join('')
        .split('')
        .map((cell, index) => (
          <span
            key={index}
            className={cn(
              'aspect-square rounded-[3px]',
              cell === '0' && 'bg-primary-hover',
              cell === '1' && 'bg-primary-soft',
              cell === '2' && 'bg-primary-fg',
            )}
          />
        ))}
    </div>
  )
}

const features = [
  {
    icon: History,
    title: 'Histórico em linha do tempo',
    text: 'Todas as consultas de cada paciente em ordem cronológica, não importa em qual clínica aconteceram.',
  },
  {
    icon: Building2,
    title: 'Várias clínicas, um só prontuário',
    text: 'Cadastre cada local onde você atende e saiba sempre onde cada consulta foi feita.',
  },
  {
    icon: ClipboardList,
    title: 'A consulta na ordem certa',
    text: 'Queixa, história clínica, exame físico, evolução, diagnóstico, conduta, prescrição e exames.',
  },
  {
    icon: Search,
    title: 'Busca em segundos',
    text: 'Encontre qualquer paciente pelo nome ou CPF no meio do dia corrido.',
  },
  {
    icon: ShieldCheck,
    title: 'Dados protegidos',
    text: 'Cada conta enxerga apenas os próprios pacientes, com isolamento garantido no banco de dados.',
  },
]

const steps = [
  { title: 'Cadastre suas clínicas', text: 'Endereço, telefone e observações de cada local de atendimento.' },
  { title: 'Registre cada consulta', text: 'Escolha o paciente e a clínica e preencha a evolução em blocos.' },
  { title: 'Consulte quando precisar', text: 'O prontuário completo abre em uma tela, do primeiro atendimento ao último.' },
]

/**
 * Página pública (landing), composição imersiva "Pixel Arcade": hero de
 * borda a borda no vinho da marca, título grande e o coração em pixels.
 * Acabamento plano: sem gradientes, sombras ou transparências.
 */
export function LandingPage() {
  const { session } = useAuth()
  const year = new Date().getFullYear()

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <a
        href="#conteudo"
        className="sr-only z-toast rounded-pill bg-surface text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-5 focus:py-3"
      >
        Pular para o conteúdo
      </a>

      {/* Hero imersivo */}
      <div className="on-dark bg-primary text-primary-fg">
        <header
          className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
        >
          <Link to="/" className="flex min-h-touch items-center rounded-pill" aria-label="Singulare, página inicial">
            <Logo inverse />
          </Link>
          <nav aria-label="Acesso" className="flex shrink-0 items-center gap-2 sm:gap-3">
            {session ? (
              <LinkButton to={HOME_PATH} variant="inverse" className="h-control-sm px-5">
                Ir para o painel
              </LinkButton>
            ) : (
              <>
                <Link
                  to="/entrar"
                  className="inline-flex min-h-touch items-center rounded-pill px-4 text-sm font-medium text-primary-fg transition-colors hover:bg-primary-hover"
                >
                  Entrar
                </Link>
                <LinkButton to="/cadastro" variant="inverse" className="hidden h-control-sm px-5 sm:inline-flex">
                  Criar conta
                </LinkButton>
              </>
            )}
          </nav>
        </header>

        <section
          id="conteudo"
          aria-labelledby="hero-title"
          className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:min-h-[calc(100dvh-76px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-8 lg:pb-20"
        >
          <div className="min-w-0">
            <p className="inline-flex max-w-full rounded-pill bg-primary-hover px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-soft">
              Prontuário eletrônico para médicas
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-display font-semibold leading-[0.98] tracking-tight"
              style={{ fontSize: 'clamp(44px, 8.4vw, 92px)' }}
            >
              O cuidado é singular. <span className="italic text-primary-soft">O prontuário também.</span>
            </h1>
            <p className="mt-6 max-w-xl text-md leading-7 text-primary-soft sm:text-lg sm:leading-8">
              Atenda em quantas clínicas quiser e mantenha o histórico de cada paciente em um só lugar, da queixa
              principal à prescrição.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {session ? (
                <LinkButton to={HOME_PATH} variant="inverse">
                  Ir para o painel
                  <ArrowRight size={18} aria-hidden />
                </LinkButton>
              ) : (
                <>
                  <LinkButton to="/cadastro" variant="inverse">
                    Criar minha conta
                    <ArrowRight size={18} aria-hidden />
                  </LinkButton>
                  <Link
                    to="/entrar"
                    className="inline-flex h-control items-center justify-center rounded-pill px-6 text-sm font-medium text-primary-fg ring-1 ring-inset ring-primary-soft transition-colors hover:bg-primary-hover"
                  >
                    Já tenho conta
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]">
            <PixelHeart />
            <dl className="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
              {[
                ['Clínicas', 'quantas precisar'],
                ['Histórico', 'completo'],
                ['Acesso', 'só seu'],
              ].map(([term, detail]) => (
                <div key={term} className="min-w-0 rounded-[6px] bg-primary-hover px-2 py-3">
                  <dt className="font-display text-xl font-semibold leading-tight">{term}</dt>
                  <dd className="mt-1 text-xs leading-4 text-primary-soft">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <main>
        {/* Recursos */}
        <section aria-labelledby="recursos" className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Recursos</p>
            <h2 id="recursos" className="display-title mt-3 text-[36px] leading-[1.08] sm:text-[48px]">
              Tudo o que a consulta pede, nada que atrapalhe.
            </h2>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="min-w-0 rounded-card border border-line bg-surface p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-primary-soft text-primary">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </li>
            ))}
            <li className="min-w-0 rounded-card border border-line bg-surface p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-primary-soft text-primary">
                <FileSignature size={22} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">Receituário com a sua identidade</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                A receita sai em PDF na sua folha, com logomarca, seus dados e os dados da clínica.
              </p>
            </li>
          </ul>
        </section>

        {/* Como funciona */}
        <section aria-labelledby="como-funciona" className="border-y border-line bg-surface">
          <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Como funciona</p>
            <h2 id="como-funciona" className="display-title mt-3 max-w-2xl text-[36px] leading-[1.08] sm:text-[48px]">
              Três passos para o consultório inteiro caber em uma tela.
            </h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="min-w-0 rounded-[6px] border border-line p-6">
                  <span className="font-display text-[44px] font-semibold leading-none text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Receituário (prévia) */}
        <section aria-labelledby="receituario" className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Receituário</p>
              <h2 id="receituario" className="display-title mt-3 text-[36px] leading-[1.08] sm:text-[48px]">
                A receita sai do jeito que você assina.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                Ao fim da consulta, a prescrição vira um PDF com a sua logomarca, seu nome, CRM e os dados da clínica
                onde o atendimento aconteceu. Você escolhe a cor e o papel, A4 ou A5. Organizada, legível e pronta
                para imprimir.
              </p>
            </div>

            <figure className="mx-auto w-full max-w-[460px]">
              {/* Miniatura do PDF real: mesma estrutura, cores e tipografia. */}
              <div className="relative overflow-hidden rounded-[6px] border border-line bg-surface px-6 pb-5 pt-7 sm:px-8" aria-hidden>
                <span className="absolute inset-x-0 top-0 h-1 bg-primary" />
                <div className="flex items-start gap-3 border-b border-primary pb-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-primary font-display text-lg font-semibold text-primary">
                    AS
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[22px] font-semibold leading-tight text-ink">Dra. Ana Souza</p>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Ginecologia e Obstetrícia
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">CRM 12345-BA · RQE 6789</p>
                  </div>
                  <div className="hidden shrink-0 text-right min-[400px]:block">
                    <p className="font-display text-base font-semibold italic text-primary">Receituário</p>
                    <p className="text-[10px] text-muted">Salvador, 12 de maio</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[6px] bg-primary-soft px-4 py-2.5">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-muted">Paciente</p>
                  <p className="font-display text-base font-semibold text-ink">Paciente de exemplo</p>
                </div>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">Uso oral</p>
                <ol className="mt-2 flex flex-col gap-3 text-[12px] text-ink">
                  {[
                    ['Medicamento A, 500 mg', '1 caixa', '1 comprimido a cada 8 horas, por 7 dias.'],
                    ['Medicamento B, 20 mg', '30 comprimidos', '1 comprimido pela manhã, em jejum.'],
                  ].map(([nome, quantidade, uso], index) => (
                    <li key={nome} className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-primary-soft text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-end gap-1.5">
                          <span className="font-semibold">{nome}</span>
                          <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-focus" />
                          <span className="shrink-0">{quantidade}</span>
                        </span>
                        <span className="block text-muted">{uso}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="ml-auto mt-8 flex w-40 max-w-full flex-col items-center">
                  <span className="h-px w-full bg-ink" />
                  <span className="mt-1.5 text-[10px] font-semibold text-ink">Dra. Ana Souza</span>
                </div>
                <div className="mt-5 border-t border-primary pt-2 text-[9px] leading-4 text-muted">
                  <p className="font-semibold text-ink">Clínica Exemplo</p>
                  <p>Rua das Flores, 120 · Salvador · (71) 3333-0000</p>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-xs text-muted">
                Miniatura do PDF, com dados fictícios.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Chamada final */}
        <section aria-labelledby="chamada" className="on-dark bg-ink text-primary-fg">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <h2 id="chamada" className="max-w-2xl font-display text-[36px] font-semibold leading-[1.08] sm:text-[48px]">
              Comece pela sua próxima consulta.
            </h2>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              {session ? (
                <LinkButton to={HOME_PATH} variant="inverse">
                  Ir para o painel
                </LinkButton>
              ) : (
                <>
                  <LinkButton to="/cadastro" variant="inverse">
                    Criar minha conta
                  </LinkButton>
                  <Link
                    to="/entrar"
                    className="inline-flex h-control items-center justify-center rounded-pill px-6 text-sm font-medium text-primary-fg ring-1 ring-inset ring-primary-soft transition-colors hover:bg-primary-pressed"
                  >
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-canvas">
        <div
          className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
          style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}
        >
          <Logo tagline="Prontuário eletrônico" />
          <p className="text-sm text-muted">© {year} Singulare</p>
        </div>
      </footer>
    </div>
  )
}
