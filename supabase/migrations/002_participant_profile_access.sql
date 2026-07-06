-- Limited profile access for the persisted Participants module.
-- This migration does not make public.profiles globally readable.

create index if not exists profiles_lower_email_idx
  on public.profiles (lower(email));

create or replace function public.get_trip_participants(target_trip_id uuid)
returns table (
  member_id uuid,
  trip_id uuid,
  user_id uuid,
  role text,
  status text,
  created_at timestamptz,
  email text,
  full_name text,
  avatar_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    tm.id as member_id,
    tm.trip_id,
    tm.user_id,
    tm.role,
    tm.status,
    tm.created_at,
    p.email,
    p.full_name,
    p.avatar_url
  from public.trip_members as tm
  join public.profiles as p on p.id = tm.user_id
  where tm.trip_id = target_trip_id
    and (
      public.is_trip_owner(target_trip_id)
      or public.is_active_trip_member(target_trip_id)
    )
  order by
    case tm.role when 'owner' then 0 when 'editor' then 1 else 2 end,
    tm.created_at asc;
$$;

create or replace function public.add_trip_member_by_email(
  target_trip_id uuid,
  target_email text,
  target_role text,
  target_status text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(target_email));
  target_user_id uuid;
  trip_owner_id uuid;
  created_member_id uuid;
begin
  if not public.is_trip_owner(target_trip_id) then
    raise exception using errcode = 'P0001', message = 'OWNER_REQUIRED';
  end if;

  if normalized_email is null or normalized_email = '' then
    raise exception using errcode = 'P0001', message = 'EMAIL_REQUIRED';
  end if;

  if target_role is null or target_role not in ('editor', 'viewer') then
    raise exception using errcode = 'P0001', message = 'INVALID_ROLE';
  end if;

  if target_status is null or target_status not in ('active', 'invited', 'pending') then
    raise exception using errcode = 'P0001', message = 'INVALID_STATUS';
  end if;

  select p.id
  into target_user_id
  from public.profiles as p
  where lower(p.email) = normalized_email
  limit 1;

  if target_user_id is null then
    raise exception using errcode = 'P0001', message = 'PROFILE_NOT_FOUND';
  end if;

  select t.owner_id
  into trip_owner_id
  from public.trips as t
  where t.id = target_trip_id;

  if target_user_id = trip_owner_id then
    raise exception using errcode = 'P0001', message = 'ALREADY_MEMBER';
  end if;

  insert into public.trip_members (trip_id, user_id, role, status)
  values (target_trip_id, target_user_id, target_role, target_status)
  on conflict (trip_id, user_id) do nothing
  returning id into created_member_id;

  if created_member_id is null then
    raise exception using errcode = 'P0001', message = 'ALREADY_MEMBER';
  end if;

  return created_member_id;
end;
$$;

revoke execute on function public.get_trip_participants(uuid) from public;
revoke execute on function public.add_trip_member_by_email(uuid, text, text, text) from public;

grant execute on function public.get_trip_participants(uuid) to authenticated;
grant execute on function public.add_trip_member_by_email(uuid, text, text, text) to authenticated;
