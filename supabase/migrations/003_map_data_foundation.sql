-- Travora Map Data Foundation
-- Latitude and longitude already exist on public.places from migration 001.

alter table public.places
  add column if not exists map_order integer null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'places_latitude_range_check'
      and conrelid = 'public.places'::regclass
  ) then
    alter table public.places
      add constraint places_latitude_range_check
      check (latitude is null or latitude between -90 and 90);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'places_longitude_range_check'
      and conrelid = 'public.places'::regclass
  ) then
    alter table public.places
      add constraint places_longitude_range_check
      check (longitude is null or longitude between -180 and 180);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'places_map_order_check'
      and conrelid = 'public.places'::regclass
  ) then
    alter table public.places
      add constraint places_map_order_check
      check (map_order is null or map_order >= 0);
  end if;
end;
$$;

create index if not exists places_trip_id_map_order_idx
  on public.places (trip_id, map_order);
