alter table public.trips
  add column if not exists public_share_enabled boolean not null default false,
  add column if not exists public_share_token text,
  add column if not exists public_share_created_at timestamptz,
  add column if not exists public_share_updated_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'trips_public_share_token_length_check'
      and conrelid = 'public.trips'::regclass
  ) then
    alter table public.trips
      add constraint trips_public_share_token_length_check
      check (public_share_token is null or char_length(public_share_token) >= 32);
  end if;
end;
$$;

create unique index if not exists trips_public_share_token_key
  on public.trips(public_share_token)
  where public_share_token is not null;

create index if not exists trips_public_share_lookup_idx
  on public.trips(public_share_token)
  where public_share_enabled = true;

create or replace function public.get_public_trip_share(target_token text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with shared_trip as (
    select
      id,
      title,
      destination,
      start_date,
      end_date,
      status,
      currency,
      description
    from public.trips
    where public_share_enabled = true
      and public_share_token is not null
      and public_share_token = target_token
      and char_length(target_token) >= 32
    limit 1
  ),
  place_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', p.title,
          'category', p.category,
          'status', p.status,
          'city', p.city,
          'country', p.country,
          'address', p.address,
          'website', p.website_url,
          'notes', p.notes
        )
        order by p.map_order asc nulls last, p.title asc, p.created_at asc
      ),
      '[]'::jsonb
    ) as items
    from public.places p
    join shared_trip t on t.id = p.trip_id
  ),
  planner_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'date', i.date,
          'startTime', i.start_time,
          'endTime', i.end_time,
          'title', i.title,
          'type', i.type,
          'description', i.description,
          'status', i.status,
          'place', case
            when p.id is null then null
            else jsonb_build_object(
              'title', p.title,
              'city', p.city,
              'country', p.country
            )
          end
        )
        order by i.date asc nulls last, i.order_index asc nulls last, i.start_time asc nulls last, i.created_at asc
      ),
      '[]'::jsonb
    ) as items
    from public.planner_items i
    join shared_trip t on t.id = i.trip_id
    left join public.places p on p.id = i.place_id and p.trip_id = i.trip_id
  ),
  reservation_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', r.title,
          'type', r.type,
          'provider', r.provider,
          'startDate', r.start_date,
          'endDate', r.end_date,
          'status', r.status,
          'price', r.total_price,
          'currency', r.currency,
          'notes', r.notes
        )
        order by r.start_date asc nulls last, r.created_at asc
      ),
      '[]'::jsonb
    ) as items
    from public.reservations r
    join shared_trip t on t.id = r.trip_id
  ),
  budget_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', e.title,
          'category', e.category,
          'amount', e.amount,
          'currency', e.currency,
          'date', e.expense_date,
          'status', e.status,
          'notes', e.notes
        )
        order by e.expense_date asc nulls last, e.created_at asc
      ),
      '[]'::jsonb
    ) as items
    from public.budget_expenses e
    join shared_trip t on t.id = e.trip_id
  ),
  packing_rows as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'name', pi.name,
          'category', pi.category,
          'priority', pi.priority,
          'notes', pi.notes,
          'isPacked', pi.is_packed
        )
        order by pi.category asc nulls last, pi.created_at asc
      ),
      '[]'::jsonb
    ) as items
    from public.packing_items pi
    join shared_trip t on t.id = pi.trip_id
  )
  select case
    when not exists (select 1 from shared_trip) then null
    else jsonb_build_object(
      'trip', (
        select jsonb_build_object(
          'title', title,
          'destination', destination,
          'startDate', start_date,
          'endDate', end_date,
          'status', status,
          'currency', currency,
          'description', description
        )
        from shared_trip
      ),
      'places', (select items from place_rows),
      'planner', (select items from planner_rows),
      'reservations', (select items from reservation_rows),
      'budget', (select items from budget_rows),
      'packing', (select items from packing_rows)
    )
  end;
$$;

revoke execute on function public.get_public_trip_share(text) from public;
grant execute on function public.get_public_trip_share(text) to anon;
grant execute on function public.get_public_trip_share(text) to authenticated;
