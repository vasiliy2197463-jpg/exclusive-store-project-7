grant usage on schema public to anon, authenticated;
grant insert on table public.page_views to anon, authenticated;
grant select on table public.page_views to authenticated;
grant usage, select on sequence public.page_views_id_seq to anon, authenticated;

alter table public.page_views enable row level security;
drop policy if exists "anyone records page views" on public.page_views;
create policy "anyone records page views"
on public.page_views for insert
to anon, authenticated
with check (true);

drop policy if exists "staff reads page views" on public.page_views;
create policy "staff reads page views"
on public.page_views for select
to authenticated
using (public.is_staff());

select 'analytics_permissions_ready' as status;
