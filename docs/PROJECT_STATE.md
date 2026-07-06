# Travora — Project State

## Current Status

Travora is a private travel planning web application.

The project is currently in early MVP development.

## Current Sprint

Sprint 25 — MVP Backend Stabilization

Status: IN PROGRESS

## Completed

### Sprint 1 — Foundation
- Next.js project initialized
- Git repository initialized
- GitHub repository connected
- Project documentation created
- Cursor rules added
- App folder architecture created
- Route group `(app)` created
- Basic application layout created
- Sidebar created
- TopBar created
- Mobile navigation created
- PageContainer created
- Logo created
- Empty routes created:
  - Dashboard
  - Trips
  - Map
  - Budget
  - Packing
  - Settings

### Sprint 2 — Design System
- Design tokens created
- UI components created:
  - Button
  - Card
  - Badge
  - SectionHeader
  - EmptyState
- Application shell visually improved
- Apple + Travel design direction applied
- Desktop and mobile responsiveness improved

### Sprint 3 — Dashboard
- Dashboard screen created
- Welcome hero created
- Next trip card created
- Quick actions created
- Stats cards created
- Recent places created
- Upcoming reservations placeholder created
- Mock dashboard data added

### Sprint 4 — Trips Module
- Trips overview screen created
- Trip statistics created
- Status filters created
- Responsive trip cards grid created
- New trip card created
- New trip form UI created
- Mock trip data added

### Sprint 5 — Trip Detail Shell
- Dynamic trip detail route created
- Premium trip hero created
- Trip workspace tabs created
- Overview summary cards created
- Planning progress created
- Timeline preview created
- Placeholder sections created for future modules
- Mock trip detail data added

### Sprint 6 — Places Module
- Places workspace integrated with Trip Detail
- Place statistics created
- Place filters created
- Responsive place cards grid created
- Add place preview UI created
- Mock places added for every trip

### Sprint 7 — Planner Module
- Planner workspace integrated with Trip Detail
- Planner statistics created
- Horizontal day selector created
- Ordered and scheduled day views created
- Day load indicator created
- Plan item timeline created
- Add plan item preview UI created
- Mock planner data added for every trip

### Sprint 8 — Map Shell
- Map workspace integrated with Trip Detail
- Map statistics created
- Local map filters created
- Route summary created
- Premium map canvas placeholder created
- Visual mock pins and route line created
- Synchronized map places list created
- Mock map data added for every trip

### Sprint 9 — Reservations Module
- Reservations workspace integrated with Trip Detail
- Reservation statistics created
- Reservation filters created
- Detailed reservation cards created
- Settlement preview created
- Add reservation preview UI created
- Mock reservation data added for every trip

### Sprint 10 — Budget Module
- Budget workspace integrated with Trip Detail
- Budget statistics created
- Budget progress and per-person summary created
- Category breakdown created
- Expense cards created
- Settlement summary created
- Add expense preview UI created
- Mock budget data added for every trip

### Sprint 11 — Packing Module
- Packing workspace integrated with Trip Detail
- Packing statistics and progress created
- Category filters created
- Shared and private checklist created
- Local checkbox preview created
- Traveler assignment preview created
- Add packing item preview UI created
- Mock packing data added for every trip

### Sprint 12 — Participants Module
- Participants workspace integrated with Trip Detail
- Participant statistics created
- Participant cards created
- Roles overview created
- Sharing preview created
- Invite participant preview UI created
- Mock participants added for every trip

### Sprint 13 — MVP Stabilization
- Major application routes audited
- Trip Detail tabs audited
- Preview-only forms made consistent
- Dashboard date and New Trip action corrected
- Dead placeholder references removed
- Lint, typecheck, and production build validated

### Sprint 14 — Supabase Foundation
- Supabase packages installed
- Environment variable example added
- Lazy environment validation added
- Typed browser client prepared
- Typed server client prepared
- Placeholder database type added

### Sprint 15 — Auth Foundation
- Login and registration added
- Logout server action added
- Supabase auth callback added
- Next.js 16 session refresh proxy added
- Settings authentication status added
- Existing application routes remain public

### Sprint 16 — Database Schema Foundation
- Initial Supabase migration created and applied manually
- Core Travora tables created
- Row Level Security policies added
- Profile creation and timestamp triggers added
- Database schema documentation added

### Sprint 17 — Persist Trips
- Signed-in users load trips from Supabase
- New Trip creates a trip and active owner membership
- Trip creation handles RLS without insert returning
- Signed-out users retain access to demo trips
- Persisted trip overview added

### Sprint 18 — Persist Places
- Persisted trips load places from Supabase
- Add Place creates places for persisted trips
- Mock trips retain the complete mock Places experience
- No geocoding, image upload, or map picking added

### Sprint 19 — Persist Planner
- Persisted trips load planner items from Supabase
- Add Plan Item creates planner items for persisted trips
- Mock trips retain the complete mock Planner experience
- No drag and drop, realtime collaboration, or place linking added

### Sprint 20 — Persist Reservations
- Persisted trips load reservations from Supabase
- Add Reservation creates reservations for persisted trips
- Mock trips retain the complete mock Reservations experience
- No uploads, payments, or settlement logic added

### Sprint 21 — Persist Budget
- Persisted trips load budget expenses from Supabase
- Add Expense creates budget expenses for persisted trips
- Multi-currency totals remain separated by currency
- Mock trips retain the complete mock Budget experience

### Sprint 22 — Manage Persisted Records
- Persisted Places, Planner Items, Reservations, and Budget Expenses can be edited and deleted
- Mutations respect existing trip RLS policies
- Mock trip modules remain preview-only
- No schema changes, bulk actions, undo, history, or realtime added

### Sprint 23 — Persist Packing
- Persisted trips load packing items from Supabase
- Packing items support create, edit, delete, and persisted checkbox state
- Mock packing retains local preview-only behavior
- No realtime collaboration or private permission logic added

### Sprint 24 — Persist Participants
- Persisted trips load participants through limited profile-access RPCs
- Owners can add existing users and manage non-owner members
- Non-owner participant views remain read-only
- No real email invitations, invite tokens, or public sharing added

## MVP Mock Modules Completed

- Dashboard
- Trips
- Trip Detail
- Places
- Planner
- Map
- Reservations
- Budget
- Packing
- Participants

## Known Limitations

- Trips and all detail modules except Map persist for signed-in users
- Authentication foundation only; application routes remain public
- Database migration has been applied manually
- Persistence includes Trips, Places, Planner, Reservations, Budget, Packing, and Participants
- Forms in modules not yet connected to persistence remain preview-only
- Map is placeholder only
- Real email invitations and public sharing are not implemented

## Supabase Foundation

- Supabase packages installed
- Environment variable example added
- Typed browser and server clients prepared
- Authentication implemented in the Auth Foundation sprint
- Database schema applied in the Database Schema Foundation sprint
- Trip and detail-module persistence added through the Participants sprint
- Mock data remains available for demo trip IDs

## Auth Foundation

- Login, register, and logout added
- Supabase auth callback added
- Next.js 16 proxy session refresh added
- Settings authentication status added
- Application routes are not protected yet
- Mock data is still used everywhere
- Database schema was not part of the Auth Foundation sprint
- Profiles and RLS were deferred to the following sprint

## Database Schema Foundation

- Initial SQL migration added
- Core application tables planned
- Row Level Security policies added
- Auth profile creation trigger added
- Migration applied manually in Supabase
- Application modules still use mock data unless explicitly connected

## Persist Trips

- Trips read from Supabase for signed-in users
- New Trip creates `trips` and owner `trip_members` rows
- Signed-out users still see demo trips with Login and Register links
- Other travel modules continue using mock data
- Persisted Trip Detail currently provides a basic overview only

## Persist Places

- Persisted trips load places from Supabase
- Add Place creates `places` rows for persisted trips
- Mock trips continue using mock places and preview-only creation
- Other detail modules remain mock-based or show placeholders
- No geocoding or map picking implemented
- No image upload or image storage implemented

## Persist Planner

- Persisted trips load planner items from Supabase
- Add Plan Item creates `planner_items` rows for persisted trips
- Mock trips continue using the complete mock Planner and preview-only form
- Planner items are grouped by date, with undated items shown as Unscheduled
- No drag and drop or realtime collaboration implemented
- Place linking is not implemented yet
- Other detail modules remain mock-based or show placeholders

## Persist Reservations

- Persisted trips load reservations from Supabase
- Add Reservation creates `reservations` rows for persisted trips
- Mock trips continue using mock reservations and preview-only creation
- No file upload or attachment storage implemented
- No payment processing implemented
- No real settlement logic implemented
- Other detail modules remain mock-based or show placeholders

## Persist Budget

- Persisted trips load budget expenses from Supabase
- Add Expense creates `budget_expenses` rows for persisted trips
- Mock trips continue using mock budget data and preview-only creation
- Multi-currency totals and categories are grouped by currency
- No payments or currency conversion implemented
- No real settlement logic implemented
- Budget is not automatically synchronized with reservations
- Remaining detail modules stay mock-based or show placeholders

## Manage Persisted Records

- Persisted Places can be edited and deleted
- Persisted Planner Items can be edited and deleted
- Persisted Reservations can be edited and deleted
- Persisted Budget Expenses can be edited and deleted
- Mock trips remain preview-only and do not expose real edit/delete actions
- No bulk actions, undo, history, audit log, or realtime collaboration added
- No database schema or RLS changes were required

## Persist Packing

- Persisted trips load packing items from Supabase
- Add Packing Item creates `packing_items` rows
- Persisted packing items can be edited and deleted
- Checkbox changes persist the `is_packed` state
- Mock trips continue using mock packing data and local checkbox preview
- No realtime collaboration or per-user private permissions implemented
- Participants remains a placeholder for persisted trips

## Persist Participants

- Persisted trips load participants from `trip_members` and limited profile data
- Trip owners can add existing registered users by email
- Trip owners can edit or remove non-owner members
- Mock trips continue using mock participant data and preview-only invitations
- Migration `002_participant_profile_access.sql` adds limited participant/profile RPC functions
- The `profiles` table remains unavailable for global reads
- No real email invitations, invite tokens, service-role usage, or realtime collaboration added
- Map remains a placeholder

## MVP Backend Stabilization

- Persisted MVP modules reviewed for consistency
- Services and server actions audited
- Safe error handling and development-only diagnostics reviewed
- RLS policies and participant RPC usage reviewed
- Loading errors no longer appear together with misleading empty states
- Mock trip behavior remains unchanged
- No new product features were added
- Map remains a placeholder
- The next likely task is Map persistence or sharing/public links

## Manual Backend Test Checklist

- Login and logout
- Create a persisted trip and verify its owner membership
- Open persisted Trip Detail and every connected tab
- Places: create, edit, and delete
- Planner: create, edit, and delete
- Reservations: create, edit, and delete
- Budget: create, edit, and delete
- Packing: create, edit, delete, and toggle packed state
- Participants: owner adds an existing user, edits them, and removes a non-owner
- Open a mock trip and confirm the full mock experience still works
- Refresh after mutations and confirm data persists
- Verify representative rows directly in Supabase

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase client foundation
- Cursor
- GitHub
- pnpm
- Lucide React
- clsx
- tailwind-merge

## Project Rules

Cursor rules are stored in:

.cursor/rules/project.mdc

The docs folder is the source of truth.

## Repository

GitHub:

https://github.com/stabr0s/travora

## Current Architecture

Main folders:

- app
- components
- components/layout
- components/ui
- features
- hooks
- lib
- lib/config
- providers
- services
- styles
- types
- docs

## Current UI Direction

Style:

Apple + Travel

Principles:

- minimal
- modern
- spacious
- rounded corners
- soft shadows
- responsive
- Inter font
- clean SaaS feel

## Next Task

Task #025 — MVP Backend Stabilization

Goal:

Stabilize the persisted MVP backend and UI integration.

The task includes:

- Audit persisted services and server actions
- Review safe errors, RLS, RPCs, and manual database types
- Correct persisted error and empty states
- Document the backend MVP manual test checklist

Important:

Mock trip behavior remains unchanged.

Do not add new product features; Map remains a placeholder.
