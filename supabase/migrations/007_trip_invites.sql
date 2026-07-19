create table if not exists public.trip_invites (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  email text not null,
  role text not null constraint trip_invites_role_check check (role in ('viewer', 'editor')),
  token text not null,
  status text not null default 'pending' constraint trip_invites_status_check check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references public.profiles(id) on delete cascade,
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'trip_invites_token_unique'
      and conrelid = 'public.trip_invites'::regclass
  ) then
    alter table public.trip_invites add constraint trip_invites_token_unique unique (token);
  end if;
end;
$$;

create index if not exists trip_invites_trip_id_idx on public.trip_invites(trip_id);
create index if not exists trip_invites_lower_email_idx on public.trip_invites(lower(email));
create index if not exists trip_invites_status_idx on public.trip_invites(status);
create unique index if not exists trip_invites_pending_trip_email_key
  on public.trip_invites(trip_id, lower(email)) where status = 'pending';

drop trigger if exists trip_invites_set_updated_at on public.trip_invites;
create trigger trip_invites_set_updated_at
  before update on public.trip_invites
  for each row execute function public.set_updated_at();

alter table public.trip_invites enable row level security;

drop policy if exists "Trip owners can view trip invites" on public.trip_invites;
create policy "Trip owners can view trip invites" on public.trip_invites
  for select to authenticated using (public.is_trip_owner(trip_id));

drop policy if exists "Trip owners can create trip invites" on public.trip_invites;
create policy "Trip owners can create trip invites" on public.trip_invites
  for insert to authenticated
  with check (
    public.is_trip_owner(trip_id)
    and invited_by = auth.uid()
    and role in ('viewer', 'editor')
    and status = 'pending'
  );

drop policy if exists "Trip owners can update trip invites" on public.trip_invites;
create policy "Trip owners can update trip invites" on public.trip_invites
  for update to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

create or replace function public.get_trip_invite_by_token(target_token text)
returns table (
  trip_title text,
  trip_destination text,
  invited_email text,
  invited_role text,
  invite_status text,
  expires_at timestamptz,
  is_acceptable boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.title,
    t.destination,
    i.email,
    i.role,
    i.status,
    i.expires_at,
    (i.status = 'pending' and (i.expires_at is null or i.expires_at > now()))
  from public.trip_invites as i
  join public.trips as t on t.id = i.trip_id
  where i.token = target_token
    and char_length(target_token) between 32 and 160
    and i.status = 'pending'
    and (i.expires_at is null or i.expires_at > now())
  limit 1;
$$;

create or replace function public.accept_trip_invite(target_token text)
returns table (trip_id uuid, result_status text, result_message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.trip_invites%rowtype;
  current_user_id uuid := auth.uid();
  current_email text;
  existing_member public.trip_members%rowtype;
  trip_owner_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = 'P0001', message = 'AUTH_REQUIRED';
  end if;

  select lower(trim(p.email)) into current_email
  from public.profiles as p
  where p.id = current_user_id;

  if current_email is null or current_email = '' then
    raise exception using errcode = 'P0001', message = 'EMAIL_REQUIRED';
  end if;

  select * into invite_record
  from public.trip_invites as i
  where i.token = target_token
    and char_length(target_token) between 32 and 160
  limit 1;

  if invite_record.id is null then
    raise exception using errcode = 'P0001', message = 'INVITE_NOT_FOUND';
  end if;
  if invite_record.status <> 'pending' then
    raise exception using errcode = 'P0001', message = 'INVITE_NOT_PENDING';
  end if;
  if invite_record.expires_at is not null and invite_record.expires_at <= now() then
    update public.trip_invites as i set status = 'expired'
    where i.id = invite_record.id;
    raise exception using errcode = 'P0001', message = 'INVITE_EXPIRED';
  end if;
  if lower(trim(invite_record.email)) <> current_email then
    raise exception using errcode = 'P0001', message = 'EMAIL_MISMATCH';
  end if;

  select t.owner_id into trip_owner_id
  from public.trips as t
  where t.id = invite_record.trip_id;

  if trip_owner_id is null then
    raise exception using errcode = 'P0001', message = 'TRIP_NOT_FOUND';
  end if;

  select * into existing_member
  from public.trip_members as tm
  where tm.trip_id = invite_record.trip_id
    and tm.user_id = current_user_id
  limit 1;

  if trip_owner_id = current_user_id then
    update public.trip_invites as i
    set status = 'accepted', accepted_by = current_user_id, accepted_at = now()
    where i.id = invite_record.id;
    return query select invite_record.trip_id, 'already_joined'::text, 'You already own this trip.'::text;
    return;
  end if;

  if existing_member.id is null then
    insert into public.trip_members (trip_id, user_id, role, status)
    values (invite_record.trip_id, current_user_id, invite_record.role, 'active');
  elsif existing_member.role = 'owner' or existing_member.status = 'active' then
    null;
  else
    update public.trip_members as tm
    set role = invite_record.role, status = 'active'
    where tm.id = existing_member.id;
  end if;

  update public.trip_invites as i
  set status = 'accepted', accepted_by = current_user_id, accepted_at = now()
  where i.id = invite_record.id;

  return query select invite_record.trip_id, 'accepted'::text, 'Invite accepted.'::text;
end;
$$;

revoke execute on function public.get_trip_invite_by_token(text) from public;
revoke execute on function public.accept_trip_invite(text) from public;
grant execute on function public.get_trip_invite_by_token(text) to anon;
grant execute on function public.get_trip_invite_by_token(text) to authenticated;
grant execute on function public.accept_trip_invite(text) to authenticated;
