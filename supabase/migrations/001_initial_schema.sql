create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  destination text,
  start_date date,
  end_date date,
  cover_image_url text,
  status text constraint trips_status_check check (status is null or status in ('planning', 'upcoming', 'archived')),
  description text,
  currency text default 'EUR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null constraint trip_members_role_check check (role in ('owner', 'editor', 'viewer')),
  status text not null constraint trip_members_status_check check (status in ('active', 'invited', 'pending')),
  created_at timestamptz default now(),
  constraint trip_members_trip_user_unique unique (trip_id, user_id)
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  category text,
  address text,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  status text constraint places_status_check check (status is null or status in ('idea', 'planned', 'visited', 'rejected')),
  priority text constraint places_priority_check check (priority is null or priority in ('must-see', 'recommended', 'optional')),
  notes text,
  website_url text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.planner_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  title text not null,
  description text,
  date date,
  start_time time,
  end_time time,
  type text,
  status text constraint planner_items_status_check check (status is null or status in ('planned', 'completed', 'cancelled')),
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  type text,
  title text not null,
  provider text,
  reservation_number text,
  start_date timestamptz,
  end_date timestamptz,
  location text,
  total_price numeric(12,2),
  currency text default 'EUR',
  status text constraint reservations_status_check check (status is null or status in ('paid', 'deposit', 'unpaid')),
  payer_name text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.budget_expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  category text,
  title text not null,
  amount numeric(12,2) not null,
  currency text default 'EUR',
  paid_by_name text,
  participants_count integer default 1,
  status text constraint budget_expenses_status_check check (status is null or status in ('paid', 'deposit', 'unpaid')),
  expense_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  category text,
  assigned_to_name text,
  is_shared boolean default true,
  is_packed boolean default false,
  priority text constraint packing_items_priority_check check (priority is null or priority in ('essential', 'recommended', 'optional')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index trips_owner_id_idx on public.trips(owner_id);
create index trip_members_trip_id_idx on public.trip_members(trip_id);
create index trip_members_user_id_idx on public.trip_members(user_id);
create index places_trip_id_idx on public.places(trip_id);
create index planner_items_trip_id_idx on public.planner_items(trip_id);
create index reservations_trip_id_idx on public.reservations(trip_id);
create index budget_expenses_trip_id_idx on public.budget_expenses(trip_id);
create index packing_items_trip_id_idx on public.packing_items(trip_id);

create function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trips_set_updated_at before update on public.trips for each row execute function public.set_updated_at();
create trigger places_set_updated_at before update on public.places for each row execute function public.set_updated_at();
create trigger planner_items_set_updated_at before update on public.planner_items for each row execute function public.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations for each row execute function public.set_updated_at();
create trigger budget_expenses_set_updated_at before update on public.budget_expenses for each row execute function public.set_updated_at();
create trigger packing_items_set_updated_at before update on public.packing_items for each row execute function public.set_updated_at();

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'full_name' from auth.users
on conflict (id) do nothing;

create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

create function public.is_trip_owner(target_trip_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.trips where id = target_trip_id and owner_id = auth.uid());
$$;

create function public.is_active_trip_member(target_trip_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.trip_members where trip_id = target_trip_id and user_id = auth.uid() and status = 'active');
$$;

create function public.can_edit_trip(target_trip_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_trip_owner(target_trip_id) or exists (
    select 1 from public.trip_members
    where trip_id = target_trip_id and user_id = auth.uid() and status = 'active' and role in ('owner', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.places enable row level security;
alter table public.planner_items enable row level security;
alter table public.reservations enable row level security;
alter table public.budget_expenses enable row level security;
alter table public.packing_items enable row level security;

create policy "Users can view own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Trip members can view trips" on public.trips for select to authenticated using (public.is_trip_owner(id) or public.is_active_trip_member(id));
create policy "Trip owners can create trips" on public.trips for insert to authenticated with check (owner_id = auth.uid());
create policy "Trip owners can update trips" on public.trips for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Trip owners can delete trips" on public.trips for delete to authenticated using (owner_id = auth.uid());

create policy "Trip members can view trip members" on public.trip_members for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip owners can insert trip members" on public.trip_members for insert to authenticated with check (public.is_trip_owner(trip_id));
create policy "Trip owners can update trip members" on public.trip_members for update to authenticated using (public.is_trip_owner(trip_id)) with check (public.is_trip_owner(trip_id));
create policy "Trip owners can delete trip members" on public.trip_members for delete to authenticated using (public.is_trip_owner(trip_id));

create policy "Trip members can view places" on public.places for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip editors can manage places" on public.places for all to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy "Trip members can view planner items" on public.planner_items for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip editors can manage planner items" on public.planner_items for all to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy "Trip members can view reservations" on public.reservations for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip editors can manage reservations" on public.reservations for all to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy "Trip members can view budget expenses" on public.budget_expenses for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip editors can manage budget expenses" on public.budget_expenses for all to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
create policy "Trip members can view packing items" on public.packing_items for select to authenticated using (public.is_trip_owner(trip_id) or public.is_active_trip_member(trip_id));
create policy "Trip editors can manage packing items" on public.packing_items for all to authenticated using (public.can_edit_trip(trip_id)) with check (public.can_edit_trip(trip_id));
