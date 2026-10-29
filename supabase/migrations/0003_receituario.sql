-- Receituário personalizado.
-- Só acrescenta colunas opcionais: nenhum dado existente é alterado.

-- =====================================================================
-- Dados da médica que aparecem na receita
-- =====================================================================
alter table public.doctors
  add column if not exists titulo_profissional text,
  add column if not exists rqe text,
  add column if not exists email_contato text,
  add column if not exists instagram text,
  add column if not exists site text,
  add column if not exists endereco_profissional text,
  add column if not exists rodape_receituario text,
  add column if not exists cor_receituario text not null default 'vinho',
  add column if not exists papel_receituario text not null default 'A4',
  -- Logomarca já redimensionada no navegador (PNG em data URL, até ~500 KB).
  add column if not exists logo_url text;

alter table public.doctors drop constraint if exists doctors_cor_receituario_check;
alter table public.doctors add constraint doctors_cor_receituario_check
  check (cor_receituario in ('vinho', 'rose', 'ameixa', 'grafite', 'salvia', 'petroleo'));

alter table public.doctors drop constraint if exists doctors_papel_receituario_check;
alter table public.doctors add constraint doctors_papel_receituario_check
  check (papel_receituario in ('A4', 'A5'));

alter table public.doctors drop constraint if exists doctors_logo_url_check;
alter table public.doctors add constraint doctors_logo_url_check
  check (logo_url is null or (logo_url like 'data:image/png;base64,%' and length(logo_url) <= 700000));

-- =====================================================================
-- Clínica: cidade (linha de data da receita) e CNPJ
-- =====================================================================
alter table public.clinics
  add column if not exists cidade text,
  add column if not exists cnpj text;

-- =====================================================================
-- Atendimento: medicamentos da receita, em lista estruturada
-- Cada item: { id, medicamento, via, quantidade, posologia }.
-- A coluna prescricao (texto) continua guardando as orientações.
-- =====================================================================
alter table public.encounters
  add column if not exists prescricao_itens jsonb not null default '[]'::jsonb;

alter table public.encounters drop constraint if exists encounters_prescricao_itens_check;
alter table public.encounters add constraint encounters_prescricao_itens_check
  check (jsonb_typeof(prescricao_itens) = 'array');
