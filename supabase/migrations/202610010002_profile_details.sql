alter table public.profiles add column if not exists company_name text not null default '';
alter table public.profiles add column if not exists street_address text not null default '';
alter table public.profiles add column if not exists apartment text not null default '';
alter table public.profiles add column if not exists city text not null default '';

drop policy if exists "staff update profiles" on public.profiles;
create policy "staff update profiles" on public.profiles
for update using (public.is_staff()) with check (public.is_staff());
