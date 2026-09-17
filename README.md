# Prontuário

Sistema web para médicos acompanharem seus pacientes em um único lugar, mesmo quando os
atendimentos acontecem em clínicas diferentes. Cada paciente tem um histórico único, em ordem
cronológica, reunindo todos os atendimentos do médico independentemente da clínica.

## O que o sistema faz

- Cadastro e login do médico (Supabase Auth).
- Cadastro de pacientes, com busca rápida por nome ou CPF.
- Cadastro das clínicas onde o médico atende.
- Registro de atendimentos com data, horário, clínica, tipo de atendimento, queixa principal,
  história clínica, exame físico, evolução, diagnóstico, conduta, prescrição, solicitação de
  exames e observações.
- Prontuário do paciente em uma única tela, com o histórico em formato de timeline.
- Edição e exclusão de pacientes, clínicas e atendimentos.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- Supabase (Postgres, Auth e Row Level Security)
- Lucide Icons

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Supabase
npm run dev
```

O app sobe em `http://localhost:5173`.

## Configuração do Supabase

O banco do piloto já está criado no projeto **aurelia**
(`fybdlgbyxzfuzmhhrexp`), com as duas migrações aplicadas.

Para recriar o banco do zero em outro projeto:

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, execute na ordem os arquivos de `supabase/migrations/`:
   - `0001_prontuario_init.sql` — tabelas `doctors`, `clinics`, `patients` e `encounters`,
     índices, gatilhos de `updated_at`, criação automática do perfil do médico no cadastro
     e políticas de Row Level Security.
   - `0002_endurece_funcoes_e_indices.sql` — fixa o `search_path` das funções, remove o
     acesso público às funções de gatilho e indexa a chave estrangeira de clínica.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon/publishable key**.
4. Preencha o `.env`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

### Confirmação de e-mail

Por padrão o Supabase exige confirmação de e-mail no cadastro. Para o piloto, é possível
desativar em **Authentication → Providers → Email → Confirm email**. Assim o médico entra
direto após criar a conta.

### Segurança dos dados

Todas as tabelas usam Row Level Security: cada médico só enxerga e altera os próprios
pacientes, clínicas e atendimentos (`doctor_id = auth.uid()`). Nenhum dado é compartilhado
entre contas.

## Deploy no Netlify

O `netlify.toml` já está configurado:

- Build: `npm run build`
- Publicação: `dist`
- Redirect SPA: `/*` → `/index.html`

No painel do Netlify, em **Site configuration → Environment variables**, defina
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

> **Importante:** variáveis `VITE_*` são embutidas no JavaScript durante o build, não lidas
> quando a página abre. Cadastrá-las não afeta um site já publicado — é preciso publicar de
> novo em **Deploys → Trigger deploy → Clear cache and deploy site**.

O `netlify.toml` também define `SECRETS_SCAN_OMIT_KEYS` para as duas variáveis. Sem isso, o
detector de segredos do Netlify encontra a chave publicável dentro do JavaScript gerado e
falha o deploy. A chave é pública por natureza — como manda a documentação do Supabase, ela
vai no frontend, e a proteção dos dados vem do Row Level Security.

## Estrutura

```
src/
  components/       Layout, header, busca, timeline, diálogos
    ui/             Componentes reutilizáveis (Button, Input, Card, Modal, Badge, estados)
  context/          Autenticação e notificações (toast)
  forms/            Formulários de paciente e clínica (modais)
  lib/              Cliente Supabase, tipos, acesso a dados e formatação
  pages/            Telas do sistema
supabase/
  migrations/       Script SQL de criação do banco
```

## Padrão visual

Paleta em ameixa e rosé: acolhedora, mas sóbria o bastante para um prontuário.

- Menu lateral: ameixa `#4A2B4A`.
- Ações principais e links: rosé `#A8326B`.
- Fundo `#FBF7F9`, cards `#FFFFFF`, texto `#2B2430` / `#7A6B77`, bordas `#EDE3E9`.
- Cinzas levemente amalvados no lugar do cinza padrão do Tailwind, para não destoarem.
- Vermelho, âmbar e verde aparecem só como sinal (erro, alerta e sucesso), nunca como
  enfeite.

Todos os pares de texto e fundo foram conferidos e passam no WCAG AA (contraste mínimo
de 4,5:1 para texto e 3:1 para ícones).

- Tipografia Inter, espaçamento em múltiplos de 4 px, cantos de 8 a 12 px e sombras discretas.
- Datas no padrão brasileiro (DD/MM/AAAA) e horários em 24 h.
