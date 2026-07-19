create table if not exists public.trip_important_info (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint trip_important_info_trip_id_unique unique (trip_id)
);

create index if not exists trip_important_info_trip_id_idx
  on public.trip_important_info(trip_id);

drop trigger if exists trip_important_info_set_updated_at on public.trip_important_info;

create trigger trip_important_info_set_updated_at
  before update on public.trip_important_info
  for each row execute function public.set_updated_at();

alter table public.trip_important_info enable row level security;

drop policy if exists "Trip members can view important info" on public.trip_important_info;
drop policy if exists "Trip editors can create important info" on public.trip_important_info;
drop policy if exists "Trip editors can update important info" on public.trip_important_info;

create policy "Trip members can view important info"
  on public.trip_important_info
  for select
  to authenticated
  using (
    public.is_trip_owner(trip_id)
    or public.is_active_trip_member(trip_id)
  );

create policy "Trip editors can create important info"
  on public.trip_important_info
  for insert
  to authenticated
  with check (public.can_edit_trip(trip_id));

create policy "Trip editors can update important info"
  on public.trip_important_info
  for update
  to authenticated
  using (public.can_edit_trip(trip_id))
  with check (public.can_edit_trip(trip_id));
