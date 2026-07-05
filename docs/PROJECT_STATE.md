# Travora — Project State

## Current Status

Travora is a private travel planning web application.

The project is currently in early MVP development.

## Current Sprint

Sprint 17 — Persist Trips

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

- Trips persist for signed-in users; other modules still use mock data
- Authentication foundation only; application routes remain public
- Database migration has been applied manually
- Persistence is currently limited to Trips
- Forms outside the persisted Trips flow are preview-only
- Map is placeholder only
- Sharing/invitations are mock-only

## Supabase Foundation

- Supabase packages installed
- Environment variable example added
- Typed browser and server clients prepared
- Authentication implemented in the Auth Foundation sprint
- Database schema applied in the Database Schema Foundation sprint
- Trip persistence added in the Persist Trips sprint
- Mock data is still used outside Trips

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

Task #017 — Persist Trips

Goal:

Persist trip creation and listing while keeping the remaining mock MVP intact.

The task includes:

- Supabase-backed trip listing for signed-in users
- Server-side trip creation
- Owner membership creation with rollback fallback
- Signed-out demo mode
- Basic persisted Trip Detail overview

Important:

Continue using mock data everywhere.

Do not persist other modules or protect application routes yet.
