create table if not exists public.packing_item_states (
  id uuid primary key default gen_random_uuid(),
  packing_item_id uuid not null references public.packing_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_packed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint packing_item_states_item_user_unique unique (packing_item_id, user_id)
);

create index if not exists packing_item_states_user_id_idx
  on public.packing_item_states(user_id);

create index if not exists packing_item_states_packing_item_id_idx
  on public.packing_item_states(packing_item_id);

drop trigger if exists packing_item_states_set_updated_at on public.packing_item_states;
create trigger packing_item_states_set_updated_at
  before update on public.packing_item_states
  for each row execute function public.set_updated_at();

alter table public.packing_item_states enable row level security;

drop policy if exists "Users can view own packing item states" on public.packing_item_states;
create policy "Users can view own packing item states"
  on public.packing_item_states
  for select
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.packing_items pi
      where pi.id = packing_item_id
        and (public.is_trip_owner(pi.trip_id) or public.is_active_trip_member(pi.trip_id))
    )
  );

drop policy if exists "Users can create own packing item states" on public.packing_item_states;
create policy "Users can create own packing item states"
  on public.packing_item_states
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.packing_items pi
      where pi.id = packing_item_id
        and (public.is_trip_owner(pi.trip_id) or public.is_active_trip_member(pi.trip_id))
    )
  );

drop policy if exists "Users can update own packing item states" on public.packing_item_states;
create policy "Users can update own packing item states"
  on public.packing_item_states
  for update
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.packing_items pi
      where pi.id = packing_item_id
        and (public.is_trip_owner(pi.trip_id) or public.is_active_trip_member(pi.trip_id))
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.packing_items pi
      where pi.id = packing_item_id
        and (public.is_trip_owner(pi.trip_id) or public.is_active_trip_member(pi.trip_id))
    )
  );

drop policy if exists "Users can delete own packing item states" on public.packing_item_states;
create policy "Users can delete own packing item states"
  on public.packing_item_states
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.packing_items pi
      where pi.id = packing_item_id
        and (public.is_trip_owner(pi.trip_id) or public.is_active_trip_member(pi.trip_id))
    )
  );
