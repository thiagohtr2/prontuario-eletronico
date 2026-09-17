-- Correções apontadas pelo linter do Supabase após a criação do banco.

-- 1. Fixa o search_path das funções, para que não dependam do papel que as executa.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
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

-- 2. handle_new_user é uma função de gatilho: ninguém deve poder chamá-la pela API REST.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- 3. Índice na chave estrangeira de clínica, usado ao filtrar atendimentos
--    por clínica e ao excluir uma clínica.
create index if not exists encounters_clinic_idx on public.encounters (clinic_id);
