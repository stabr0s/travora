create table if not exists public.travel_links (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  reservation_id uuid null references public.reservations(id) on delete cascade,
  title text not null,
  url text not null,
  link_type text not null default 'other',
  note text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'travel_links_title_not_empty_check'
      and conrelid = 'public.travel_links'::regclass
  ) then
    alter table public.travel_links
      add constraint travel_links_title_not_empty_check
      check (char_length(btrim(title)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'travel_links_url_not_empty_check'
      and conrelid = 'public.travel_links'::regclass
  ) then
    alter table public.travel_links
      add constraint travel_links_url_not_empty_check
      check (char_length(btrim(url)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'travel_links_url_protocol_check'
      and conrelid = 'public.travel_links'::regclass
  ) then
    alter table public.travel_links
      add constraint travel_links_url_protocol_check
      check (btrim(url) ~* '^https?://.+');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'travel_links_type_check'
      and conrelid = 'public.travel_links'::regclass
  ) then
    alter table public.travel_links
      add constraint travel_links_type_check
      check (link_type in (
        'booking',
        'transport',
        'accommodation',
        'ticket',
        'check_in',
        'insurance',
        'visa',
        'document',
        'map',
        'other'
      ));
  end if;
end;
$$;

create or replace function public.ensure_travel_link_reservation_matches_trip()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.reservation_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.reservations r
    where r.id = new.reservation_id
      and r.trip_id = new.trip_id
  ) then
    raise exception 'TRAVEL_LINK_RESERVATION_TRIP_MISMATCH';
  end if;

  return new;
end;
$$;

drop trigger if exists travel_links_reservation_trip_check on public.travel_links;

create trigger travel_links_reservation_trip_check
  before insert or update on public.travel_links
  for each row execute function public.ensure_travel_link_reservation_matches_trip();

drop trigger if exists travel_links_set_updated_at on public.travel_links;

create trigger travel_links_set_updated_at
  before update on public.travel_links
  for each row execute function public.set_updated_at();

create index if not exists travel_links_trip_id_idx
  on public.travel_links(trip_id);

create index if not exists travel_links_reservation_id_idx
  on public.travel_links(reservation_id);

create index if not exists travel_links_created_by_idx
  on public.travel_links(created_by);

create index if not exists travel_links_link_type_idx
  on public.travel_links(link_type);

alter table public.travel_links enable row level security;

drop policy if exists "Trip members can view travel links" on public.travel_links;
drop policy if exists "Trip editors can create travel links" on public.travel_links;
drop policy if exists "Trip editors can update travel links" on public.travel_links;
drop policy if exists "Trip editors can delete travel links" on public.travel_links;

create policy "Trip members can view travel links"
  on public.travel_links
  for select
  to authenticated
  using (
    public.is_trip_owner(trip_id)
    or public.is_active_trip_member(trip_id)
  );

create policy "Trip editors can create travel links"
  on public.travel_links
  for insert
  to authenticated
  with check (
    public.can_edit_trip(trip_id)
    and created_by = auth.uid()
  );

create policy "Trip editors can update travel links"
  on public.travel_links
  for update
  to authenticated
  using (public.can_edit_trip(trip_id))
  with check (public.can_edit_trip(trip_id));

create policy "Trip editors can delete travel links"
  on public.travel_links
  for delete
  to authenticated
  using (public.can_edit_trip(trip_id));
