-- Prontuário eletrônico — estrutura inicial
-- Cada médico é dono exclusivo dos seus pacientes, clínicas e atendimentos (RLS por auth.uid()).

create extension if not exists "pgcrypto";

-- =====================================================================
-- Perfil do médico
-- =====================================================================
create table if not exists public.doctors (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  especialidade text not null default '',
  crm text not null default '',
  telefone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- Clínicas onde o médico atende
-- =====================================================================
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors (id) on delete cascade,
  nome text not null,
  endereco text,
  telefone text,
  observacoes text,
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clinics_doctor_id_idx on public.clinics (doctor_id);

-- =====================================================================
-- Pacientes
-- =====================================================================
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors (id) on delete cascade,
  nome text not null,
  cpf text,
  data_nascimento date,
  sexo text check (sexo in ('feminino', 'masculino', 'outro') or sexo is null),
  telefone text,
  email text,
  convenio text,
  alergias text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patients_doctor_id_idx on public.patients (doctor_id);
create index if not exists patients_nome_idx on public.patients (doctor_id, lower(nome));

-- =====================================================================
-- Atendimentos (evoluções)
-- =====================================================================
create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  clinic_id uuid references public.clinics (id) on delete set null,
  data_hora timestamptz not null default now(),
  tipo_atendimento text,
  queixa_principal text,
  historia_clinica text,
  exame_fisico text,
  evolucao text,
  diagnostico text,
  conduta text,
  prescricao text,
  exames_solicitados text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists encounters_patient_idx on public.encounters (patient_id, data_hora desc);
create index if not exists encounters_doctor_idx on public.encounters (doctor_id, data_hora desc);

-- =====================================================================
-- updated_at automático
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists doctors_set_updated_at on public.doctors;
create trigger doctors_set_updated_at before update on public.doctors
  for each row execute function public.set_updated_at();

drop trigger if exists clinics_set_updated_at on public.clinics;
create trigger clinics_set_updated_at before update on public.clinics
  for each row execute function public.set_updated_at();

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at before update on public.patients
  for each row execute function public.set_updated_at();

drop trigger if exists encounters_set_updated_at on public.encounters;
create trigger encounters_set_updated_at before update on public.encounters
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Criação automática do perfil do médico no cadastro
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.doctors (id, nome, especialidade, crm)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', ''),
    coalesce(new.raw_user_meta_data ->> 'especialidade', ''),
    coalesce(new.raw_user_meta_data ->> 'crm', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.doctors enable row level security;
alter table public.clinics enable row level security;
alter table public.patients enable row level security;
alter table public.encounters enable row level security;

drop policy if exists "doctors_select_own" on public.doctors;
create policy "doctors_select_own" on public.doctors
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "doctors_insert_own" on public.doctors;
create policy "doctors_insert_own" on public.doctors
  for insert to authenticated with check (id = (select auth.uid()));

drop policy if exists "doctors_update_own" on public.doctors;
create policy "doctors_update_own" on public.doctors
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "clinics_all_own" on public.clinics;
create policy "clinics_all_own" on public.clinics
  for all to authenticated
  using (doctor_id = (select auth.uid()))
  with check (doctor_id = (select auth.uid()));

drop policy if exists "patients_all_own" on public.patients;
create policy "patients_all_own" on public.patients
  for all to authenticated
  using (doctor_id = (select auth.uid()))
  with check (doctor_id = (select auth.uid()));

drop policy if exists "encounters_all_own" on public.encounters;
create policy "encounters_all_own" on public.encounters
  for all to authenticated
  using (doctor_id = (select auth.uid()))
  with check (doctor_id = (select auth.uid()));
