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

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, execute o conteúdo de `supabase/migrations/0001_prontuario_init.sql`.
   Esse script cria as tabelas `doctors`, `clinics`, `patients` e `encounters`, os índices,
   os gatilhos de `updated_at`, a criação automática do perfil do médico no cadastro e as
   políticas de Row Level Security.
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

No painel do Netlify, em **Site settings → Environment variables**, defina
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` antes do primeiro deploy.

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

- Cores: azul petróleo `#1E3A5F`, azul médio `#2563EB`, fundo `#F8FAFC`, cards `#FFFFFF`,
  texto `#1E293B` / `#64748B`, bordas `#E2E8F0`.
- Tipografia Inter, espaçamento em múltiplos de 4 px, cantos de 8 a 12 px e sombras discretas.
- Datas no padrão brasileiro (DD/MM/AAAA) e horários em 24 h.
