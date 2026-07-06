# Travora — Database Schema Foundation

This document describes the initial Supabase schema prepared in
`supabase/migrations/001_initial_schema.sql`.

Participant profile access is extended by
`supabase/migrations/002_participant_profile_access.sql`.

The migration is a foundation only. Travora still reads all trip-planning data
from local mock files.

## Tables

- `profiles` — application-facing data linked one-to-one with `auth.users`.
- `trips` — core trip records owned by a profile.
- `trip_members` — trip participants, their roles, and invitation status.
- `places` — destinations and ideas assigned to a trip.
- `planner_items` — dated or ordered itinerary entries, optionally linked to a place.
- `reservations` — flights, stays, tickets, and other bookings.
- `budget_expenses` — individual trip expenses.
- `packing_items` — shared or assigned checklist entries.

## Relationships

- A profile can own many trips.
- A trip can have many members through `trip_members`.
- A profile can appear only once in a given trip membership list.
- Places, planner items, reservations, expenses, and packing items belong to a trip.
- A planner item can optionally reference a place. Deleting that place keeps the
  planner item and clears its `place_id`.
- Deleting a trip cascades to its module data and memberships.

The owner is represented by `trips.owner_id`. The migration intentionally does
not create an automatic owner membership row. A future trip creation workflow
may add that row explicitly when persistence is implemented.

## Automatic timestamps

`public.set_updated_at()` refreshes `updated_at` before updates on every table
that contains this column.

## Profile creation

The `on_auth_user_created` trigger runs after an insert into `auth.users`.
`public.handle_new_user()` creates the matching profile using:

- the authentication user ID,
- the authentication email,
- optional `full_name` from `raw_user_meta_data`.

The migration also creates missing profiles for authentication users that
already exist when the SQL is applied.

## Row Level Security

RLS is enabled on every public table. Policies are limited to authenticated
users and follow these rules:

- users can view and update their own profile;
- trip owners can create, update, and delete their trips;
- owners and active trip members can view trip data;
- only trip owners can manage membership rows;
- owners and active editors can manage places, planner items, reservations,
  expenses, and packing items.

Invited and pending members do not receive trip data access until their status
becomes `active`.

## RLS helper functions

Three small `stable security definer` functions prevent recursive RLS checks:

- `is_trip_owner(trip_id)` checks `trips.owner_id`;
- `is_active_trip_member(trip_id)` checks active membership;
- `can_edit_trip(trip_id)` accepts the owner or an active owner/editor member.

Each helper uses a fixed `search_path = public` and returns only a boolean.

## Participant profile access

Migration `002_participant_profile_access.sql` adds two narrowly scoped
`security definer` functions:

- `get_trip_participants(target_trip_id)` returns member rows with limited
  profile fields only when the caller owns the trip or is an active member;
- `add_trip_member_by_email(...)` lets only the trip owner add an existing
  registered profile as an editor or viewer.

Execute permission is revoked from `public` and granted only to
`authenticated`. The `profiles` table is still not globally readable. These
functions do not use a service-role key, create profiles, send emails, or
create invitation tokens.

## Applying the migration manually

1. Open the target Supabase project.
2. Open **SQL Editor** and create a new query.
3. Copy the complete contents of
   `supabase/migrations/001_initial_schema.sql` into the editor.
4. Review that the query targets the intended project, then run it once.
5. Verify the tables in **Table Editor** and their policies in the RLS policy view.
6. Register a test user and confirm that a matching `profiles` row is created.

Apply migration `001` to a new or otherwise prepared project. After reviewing
it, apply migration `002` to enable limited participant/profile access. The
initial migration is not designed to be rerun over an existing schema.

## Current limitations

- The migration has not been applied automatically by this repository.
- The application still uses mock data for every travel module.
- No UI persistence or feature-module database queries exist yet.
- Application routes are not protected.
- Storage, realtime collaboration, and file uploads are not configured.
- The TypeScript `Database` type remains a placeholder.

After applying the migration, generate Supabase TypeScript definitions with the
Supabase CLI or the dashboard-supported workflow before adding application data
queries.
