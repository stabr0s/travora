# Travora — Database Schema Foundation

This document describes the initial Supabase schema prepared in
`supabase/migrations/001_initial_schema.sql`.

Participant profile access is extended by
`supabase/migrations/002_participant_profile_access.sql`.

Map-ready place data is extended by
`supabase/migrations/003_map_data_foundation.sql`.

User-owned packing presets are extended by
`supabase/migrations/004_packing_presets.sql`.

Travora supports two data modes. The four demo trip IDs continue reading local
mock data, while persisted UUID trips use Supabase for Trips, Places, Planner,
Reservations, Budget, Packing, and Participants. Map remains a visual
placeholder, and Dashboard is not yet backed by complete persisted analytics.

## Tables

- `profiles` — application-facing data linked one-to-one with `auth.users`.
- `trips` — core trip records owned by a profile.
- `trip_members` — trip participants, their roles, and invitation status.
- `places` — destinations and ideas assigned to a trip.
- `planner_items` — dated or ordered itinerary entries, optionally linked to a place.
- `reservations` — flights, stays, tickets, and other bookings.
- `budget_expenses` — individual trip expenses.
- `packing_items` — shared or assigned checklist entries.
- `packing_presets` — reusable packing templates owned by one profile.
- `packing_preset_items` — reusable items belonging to a packing preset.

## Relationships

- A profile can own many trips.
- A trip can have many members through `trip_members`.
- A profile can appear only once in a given trip membership list.
- Places, planner items, reservations, expenses, and packing items belong to a trip.
- A planner item can optionally reference a place. Deleting that place keeps the
  planner item and clears its `place_id`.
- Deleting a trip cascades to `trip_members`, `places`, `planner_items`,
  `reservations`, `budget_expenses`, and `packing_items`.
- Deleting a profile cascades to that profile’s custom packing presets, and
  deleting a preset cascades to its preset items.

The owner is represented by `trips.owner_id`. The database does not create an
automatic owner membership row; the current trip creation service inserts the
active owner membership explicitly.

## Map data foundation

The initial `places` schema already includes nullable `latitude` and
`longitude` columns. Migration `003_map_data_foundation.sql` adds nullable
`map_order`, range constraints for both existing coordinate columns, a
non-negative constraint for map order, and an index on `(trip_id, map_order)`.

Persisted places can store coordinates without geocoding. The prepared Map
components can separate map-ready places from places missing coordinates and
apply a stable display order. The Map tab is currently hidden from Trip Detail;
its data foundation remains intact while Leaflet/OpenStreetMap rendering,
geocoding, routing, and distance calculations are postponed.

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

The Participants sharing UX uses these existing `trip_members`, `profiles`,
and RPC foundations. Task 028 adds no schema or RLS changes: owners can add an
existing registered user, while email invitations, invite tokens, and public
share links remain unimplemented.

## Packing presets

Migration `004_packing_presets.sql` adds private, user-owned packing preset
tables. Built-in presets remain code-only starters and are not stored in the
database.

Custom presets are scoped by `owner_id = auth.uid()`. RLS lets users select,
insert, update, and delete only their own presets. Preset items inherit access
through their parent preset using `exists` checks against `packing_presets`.

Preset items do not include quantity in this MVP. Applying a preset creates
normal `packing_items` rows for a trip and still relies on existing
`packing_items` RLS for trip edit permissions.

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

After reviewing it, apply migration `003` to add map ordering and coordinate
constraints. Migration `003` is idempotent and does not alter RLS policies.

After reviewing it, apply migration `004` to add user-owned packing presets.
Migration `004` adds new tables and RLS policies but does not change existing
packing item schema.

## Current limitations

- The migration has not been applied automatically by this repository.
- Demo trip IDs intentionally continue using mock data.
- Persisted UUID trips use Supabase for detail modules. Map-ready Places fields
  remain available, while the Map tab and real tile rendering are postponed.
- Dashboard does not yet provide complete persisted analytics.
- Trip deletion is permanent in the current MVP; there is no soft delete,
  archive, or restore flow yet.
- Application routes are not protected.
- Storage, realtime collaboration, and file uploads are not configured.
- The TypeScript `Database` type is still maintained manually.

After applying the migration, generate Supabase TypeScript definitions with the
Supabase CLI or the dashboard-supported workflow before adding application data
queries.
