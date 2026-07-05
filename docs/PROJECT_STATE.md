# Travora — Project State

## Current Status

Travora is a private travel planning web application.

The project is currently in early MVP development.

## Current Sprint

Sprint 10 — Budget Module

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

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
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

Task #010 — Budget Module

Goal:

Create the budget workspace inside the Trip Detail screen.

The Budget module should include:

- Budget statistics
- Per-person cost summary
- Budget progress
- Category breakdown
- Expense cards
- Settlement summary
- Add expense preview UI

Important:

Use mock data only.

Do not implement persistence, database, authentication, Supabase, payments, currency APIs, real settlements, or form submission yet.
