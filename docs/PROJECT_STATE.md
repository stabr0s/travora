# Travora — Project State

## Current Status

Travora is a private travel planning web application.

The project is currently in early MVP development.

## Current Sprint

Sprint 58 — Strong Visual Hierarchy Pass

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

### Sprint 25 — MVP Backend Stabilization
- Persisted MVP services and actions reviewed for consistency
- Safe loading and mutation error states verified
- Participant error wording corrected
- Mock trip behavior preserved
- Backend manual test checklist documented

### Sprint 26 — Map Data Foundation
- Places extended with optional coordinates and map order
- Persisted Places Add/Edit supports map-ready data
- Persisted Map data view prepared from Supabase Places
- Coordinate and map-order constraints documented in migration 003
- No map tiles, geocoding, or routing added

### Sprint 27 — Hide Map + Permissions Hardening
- Map tab hidden without removing its code or data foundation
- Owner/editor/viewer capabilities applied to persisted module controls
- Viewer and unknown roles made read-only
- Participant management kept owner-only
- Existing RLS retained as final backend enforcement

### Sprint 28 — Trip Sharing UX
- Participants presents clearer trip sharing and access information
- Owners can add existing registered Travora users by email
- Owners can manage access for non-owner members
- Editors and viewers see read-only people and access information
- No email invitations, public links, invite tokens, schema changes, or RLS changes added

### Sprint 29 — Trip Settings & Management
- Persisted trip owners can edit basic trip details
- Persisted trip owners can delete trips after strong confirmation
- Editors and viewers see read-only trip settings
- Mock trips remain immutable
- Delete relies on existing database cascade
- No archive, restore, schema changes, or RLS changes added

### Sprint 30 — Trips List & Dashboard Polish
- Trips list presents persisted trips more clearly
- Trip cards show role, status, and date metadata
- Dashboard uses persisted trip summary data
- Empty states are improved for signed-in users with no trips
- Mock and demo trips remain safe and clearly separated
- No analytics engine, charts, schema changes, or RLS changes added

### Sprint 31 — Final MVP QA & Deploy Preparation
- Production readiness was reviewed
- Environment variable example was prepared
- Deployment documentation was added
- MVP QA checklist was added
- README was cleaned up for the Travora MVP
- No major product features, migrations, RLS changes, or dependencies added

### Sprint 33 — Post-Deploy QA Notes
- First Vercel deploy completed successfully
- Production URL documented
- Supabase Auth production configuration documented
- Production QA status documented
- No product features, migrations, RLS changes, or dependencies added

### Sprint 34 — Post-Deploy Bugfixes & Smart Entry Improvements
- Auth confirmation callback hardened for `code` and `token_hash` flows
- Reservation payment can optionally create a Budget expense on reservation create
- Places can prefill country from the trip destination when adding a persisted place
- Future speed-up backlog documented
- No migrations, RLS changes, external APIs, map rendering, or dependencies added

### Sprint 35 — Smart Defaults & Quick Actions
- Budget and Reservations default currency from trip settings
- Planner can prefill a new plan item from saved Places
- Planner quick-add stores the existing `place_id` relation when a place is selected
- Packing has simple static presets for common trip types
- No migrations, RLS changes, external APIs, AI features, or dependencies added

### Sprint 36 — Mobile UX Polish
- Dashboard, Trips, and Trip Detail screens reviewed for mobile usability
- Trip Detail tabs, persisted forms, and dense cards improved on small screens
- Action buttons and destructive actions made more comfortable on mobile
- No backend logic, schema changes, new product features, or dependencies added

### Sprint 37 — Export / Print Trip Summary
- Trip users can open a print-friendly summary from Trip Detail
- Browser print can be used to print or save the summary as PDF
- Summary includes overview, planner, places, reservations, budget, and packing sections
- Participant details are reduced to role and status counts for privacy
- No server-side PDF generation, public share links, schema changes, or RLS changes added

### Sprint 38 — Public Landing & Onboarding Polish
- Public landing page added
- Landing CTAs connect to register, login, and demo trip
- Auth onboarding copy reviewed
- MVP limitations communicated clearly
- No backend or schema changes added

### Sprint 39 — Landing Feedback Fixes
- Unwanted landing tagline removed
- Public logo links corrected to return to landing
- Auth and public demo routes keep public logo behavior
- No backend or auth behavior changed

### Sprint 40 — Focused Public Demo Trip
- Public demo trip routes made self-contained
- App shell navigation hidden for demo trip routes
- Demo hero links to landing, register, and login
- Persisted app navigation remains unchanged
- No backend, schema, or auth changes added

### Sprint 41 — Quick UX Fixes After Real Testing
- Places quick status changes added for editable persisted trips
- Trip cards made clickable without nested links
- Custom currency input supported where relevant
- Invalid `/Dasboard` route no longer renders confusing content
- Packing preset configuration and planner improvements postponed

### Sprint 42 — Configurable Packing Presets
- Custom packing presets can be created, edited, deleted, and applied on persisted trips
- Built-in packing presets remain code-only starters
- Applying presets skips duplicate trip items using name and category
- Logged-out `/dashboard` redirects to the public Japan demo trip
- Migration `004_packing_presets.sql` adds preset tables and owner-only RLS
- No service-role/admin client, public preset marketplace, import/export, or new dependencies added

### Sprint 43 — Planner Usability Polish
- Planner item creation is faster through inline quick-add on dated plan groups
- Days can be copied to another target date without overwriting target-day items
- Plan items can move up or down within the same day using existing `order_index`
- Planner empty states explain the first useful step more clearly
- No drag and drop, full planner redesign, new dependencies, or migration added

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

- Trips and detail-module records persist for signed-in users
- Authentication foundation only; application routes remain public
- Database migration has been applied manually
- Persistence includes Trips, Places, Planner, Reservations, Budget, Packing, and Participants
- Forms in modules not yet connected to persistence remain preview-only
- Persisted Map uses Places data but does not render real map tiles yet
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

## Map Data Foundation

- Places support optional `latitude`, `longitude`, and `map_order`
- Persisted Places Add/Edit can save optional coordinates and map order
- Persisted Map data components use the already-loaded Supabase Places data
- Map-ready and missing-coordinate places can be shown separately when the module returns
- No Leaflet or OpenStreetMap tiles are rendered yet
- No geocoding or routing API is implemented
- Map code and schema remain available, but its Trip Detail tab is currently hidden

## Hide Map + Permissions Hardening

- Map Data Foundation remains available in code and database schema
- The Map tab is hidden from mock and persisted Trip Detail for now
- Leaflet and OpenStreetMap rendering is postponed
- Owner, editor, and viewer roles drive persisted UI permissions
- Viewers and users without a confirmed role receive read-only UI
- Editors can manage trip modules but cannot manage participants
- Owners can manage trip modules and participants
- RLS remains the final backend enforcement layer
- No public links, invite tokens, or email invitations were added

## Trip Sharing UX

- Participants presents clearer trip sharing and access information
- Owners can add existing registered Travora users by email
- Owners can manage access for non-owner members
- Editors and viewers see read-only people and access information
- Owner, Editor, and Viewer role descriptions are clearer
- Real email invitations are not implemented yet
- Public share links and invite tokens are not implemented
- No schema or RLS changes were required

## Trip Settings & Management

- Persisted trip owners can edit basic trip details
- Persisted trip owners can delete trips
- Editors and viewers see read-only settings
- Mock trips are immutable and never call persisted settings actions
- Delete is permanent in this MVP
- Related module rows are removed by existing database cascade
- Archive and restore flows are not implemented yet
- No schema or RLS changes were required

## Trips List & Dashboard Polish

- Trips list presents persisted trips more clearly
- Trip cards show role, status, and date metadata
- Dashboard uses persisted trip summary data
- Empty states are improved for signed-in users with no trips
- Mock and demo trips remain safe and clearly separated
- No analytics engine or charts were added
- No schema or RLS changes were required

## Final MVP QA & Deploy Preparation

- Production readiness was reviewed
- Environment variable example was prepared
- Deployment documentation was added
- MVP QA checklist was added
- README was cleaned up for the Travora MVP
- Persisted modules were reviewed for obvious deploy risks
- No major product features were added
- Map rendering remains postponed
- The next likely step is first Vercel deploy or post-QA bugfixes

## Post-Deploy QA Notes

- First Vercel deploy completed successfully
- Production URL is https://travora-theta.vercel.app
- Vercel environment variables are configured
- Supabase Auth redirect URLs were corrected
- Production register/login works
- Main production app functions were manually checked
- No product features were added
- The next likely step is user testing, feedback sprint, or post-deploy bugfixes

## Post-Deploy Bugfixes & Smart Entry Improvements

- Auth confirmation callback hardened for `code` and `token_hash` flows
- Reservation payment can optionally create a Budget expense on reservation create
- Places can prefill country from the trip destination when adding a persisted place
- Future speed-up backlog:
  - Default budget currency from trip
  - Planner quick-add from Places
  - Packing presets
  - Duplicate/copy day plan
  - Recent categories
  - Import from Google Maps link/manual paste
- No public links, email invitations, invite tokens, realtime, map rendering, schema changes, or RLS changes added

## Smart Defaults & Quick Actions

- Budget and Reservations can default currency from trip settings
- Planner can prefill a new plan item from saved Places
- Planner quick-add stores the existing `place_id` relation when a place is selected
- Packing has simple static presets for Weekend, City break, and Road trip
- Packing presets skip existing item names case-insensitively
- No AI, external APIs, geocoding, schema changes, or RLS changes added

## Mobile UX Polish

- Dashboard, Trips, and Trip Detail screens reviewed for mobile usability
- Trip Detail tabs improved for small-screen horizontal scrolling and tap targets
- Persisted add/edit forms stack action buttons more comfortably on mobile
- Trip, reservation, budget, packing, and participant cards handle long text and wrapped actions better
- No backend logic, schema changes, or new product features added
- Map remains hidden from Trip Detail

## Export / Print Trip Summary

- Trip users can open a print-friendly summary from Trip Detail
- Browser print can be used to print or save the summary as PDF
- Summary includes overview, planner, places, reservations, budget, and packing sections when data exists
- Participant details are reduced to role and status counts for privacy
- No server-side PDF generation added
- No public share links added
- No schema or RLS changes added

## Public Landing & Onboarding Polish

- Public landing page was improved and now explains Travora before entering the app
- Travora value proposition is clearer for new users
- Main MVP modules are presented: Places, Plan, Reservations, Budget, Packing, People, and Print Summary
- Auth page onboarding copy was reviewed and made friendlier
- MVP limitations are communicated clearly without presenting them as errors
- Landing feedback fixes: removed unwanted tagline and corrected public logo link behavior
- No backend or schema changes were added
- No new product systems were added

## Focused Public Demo Trip

- Public demo trip is now self-contained
- App sidebar and app navigation are hidden for demo trip routes
- Demo users can return to landing, register, or sign in
- "All trips" is removed from demo mode
- Persisted app navigation is unchanged
- No backend, schema, or auth changes were added

## Quick UX Fixes After Real Testing

- Places status can be changed quickly from place cards
- Trip cards are clickable
- Custom currency input is supported where relevant
- Invalid `/Dasboard` route no longer renders confusing content
- Packing preset configuration is postponed
- Planner improvements are postponed
- No backend or schema changes were added

## Configurable Packing Presets

- Custom packing presets can be created, edited, deleted, and applied on persisted trips
- Built-in packing presets remain code-only starters
- Custom presets are owned by the current user and are not shared globally
- Applying presets skips duplicate trip items using name and category
- Owner/editor users can manage and apply presets; viewers remain read-only
- Logged-out `/dashboard` now redirects to the public Japan demo trip
- Migration `004_packing_presets.sql` adds preset tables and owner-only RLS
- No service-role/admin client, public preset marketplace, import/export, or new dependencies added

## Planner Usability Polish

- Planner item creation is faster through inline quick-add on dated plan groups
- Days can be copied to another target date without overwriting target-day items
- Plan items can move up or down within the same day using existing `order_index`
- Planner empty states now explain the first useful step more clearly
- No drag and drop was added
- No full planner redesign was added
- No new dependencies were added
- No migration was needed; existing `planner_items` fields are used

## Production QA Fixes

- Logged-out `/trips` redirects to the public Japan demo trip
- Opened add/edit/manage panels scroll into view after user action
- Viewers cannot toggle persisted packing packed state
- Mobile form controls avoid iOS auto-zoom with 16px input/select/textarea text
- Planner-linked places can auto-change to `planned`
- Visited and rejected places are not overwritten by planner sync
- No large redesign was added
- No dependencies were added
- No migration was added

## Public Read-Only Share Link

- Owner can enable, disable, and regenerate a public read-only share link
- Public share links use `/share/{token}` and do not require login
- Public share page has no app sidebar, topbar, or mobile app navigation
- Public share payload hides participant emails, internal user/member IDs, owner IDs, share tokens, and reservation references
- Public access is scoped through `get_public_trip_share(target_token)` RPC only
- No public select policies were added to core tables
- Public share tokens are generated server-side and do not include trip or user IDs
- Regenerating a link invalidates the old token immediately
- Disabling a link makes the existing token stop resolving
- Packing viewer toggle bug fixed with UI and server-side permission guards
- Migration `005_public_trip_share.sql` added

## Personal Packing Progress

- Packing items remain shared trip checklist entries
- Packed/unpacked state is personal per authenticated user
- Owner, editor, and viewer can each toggle their own packing progress
- One member's packed state does not affect another member's packed state
- Viewer still cannot create, edit, delete, apply presets, or manage presets
- Owner/editor still manage the shared packing list and presets as before
- Public share packing remains read-only with no anonymous/localStorage state
- Legacy `packing_items.is_packed` remains for backwards compatibility
- Persisted authenticated UI uses `packing_item_states.is_packed`
- Migration `006_personal_packing_state.sql` added

## Email Invite Links

- Owner can create copyable invite links for email addresses
- Invite links assign viewer or editor role
- Invitee can accept after login or registration
- Invite acceptance is tied to the invited email address
- Owner can revoke pending invite links
- Existing add-existing-user flow remains available
- Invite links are manual copy/share only; no automatic email sending added
- Migration `007_trip_invites.sql` added
- RPC security model added with `get_trip_invite_by_token` and `accept_trip_invite`

## Product Cleanup & Beta Readiness

- Production flows reviewed across landing, demo, auth, dashboard, trips, modules, sharing, invites, packing progress, and print summary
- Empty states and helper copy polished where the next step was unclear
- Mobile polish reviewed for wrapping, button stacking, and dense helper copy
- Beta known limitations documented clearly as planned future work
- Getting started dashboard card added
- No migrations, dependencies, RLS changes, RPC changes, or auth architecture changes
- No large product feature added

### Beta known limitations and backlog

- Map rendering is postponed; map-ready place fields remain available
- Public share pages are read-only, including packing
- Manual email-bound invite links exist, but automatic email sending is postponed
- File attachments and whole-trip calendar export/API sync are postponed
- Realtime collaboration, AI planning, analytics, comments, payments, and advanced per-section privacy controls are postponed

## Trip Duplicate / Templates MVP

- Owner and editor users can duplicate persisted trips into their own account
- Duplicated trips copy supported modules: Places, Planner, Reservations, Budget, and Packing
- Planner items remap copied `place_id` values to copied Places
- Members, invite links, public share settings/tokens, and personal packing states are not copied
- Mock/demo trips and public share pages cannot be duplicated
- Full template gallery/system remains future work
- No migrations, dependencies, RLS changes, RPC changes, or auth architecture changes

## Budget Settlements MVP

- Persisted budget expenses can track a real payer through `paid_by_user_id`
- Persisted budget expenses can track equal split participants through `split_between_user_ids`
- Budget shows settlement summaries per currency
- Budget suggests who should pay whom using equal split calculations
- Currencies are not converted; EUR, PLN, USD, and other currencies are summarized separately
- Existing legacy expenses remain compatible and render normally
- Expenses without assigned payer/split participants are excluded from settlement suggestions
- Trip duplication resets settlement participant references on copied budget expenses
- Public share budget remains read-only and does not expose participant IDs or emails
- No live FX, payments, receipt scanning, invoices, external APIs, RLS changes, or RPC changes added

## Trip Important Info / Notes MVP

- Persisted trip Overview includes an Important Info card
- Owner and editor users can add, edit, save, and clear Important Info
- Viewer users can read Important Info but cannot edit it
- Important Info is stored separately from public trip descriptions
- Public share pages and invite pages do not expose Important Info
- Authenticated print summary includes Important Info
- Trip duplication copies Important Info content to the copied trip
- Line breaks are preserved in read-only and print views
- Migration `009_trip_important_info.sql` added
- No attachments, rich text editor, markdown engine, comments, notifications, realtime, public share exposure, RLS changes to `trips`, or new dependencies added

## Reservation Documents / Travel Links MVP

- Persisted trips support URL-only Travel Links for trip-level resources
- Persisted reservations support compact reservation-level Travel Links
- Owner and editor users can add, edit, and delete Travel Links
- Viewer users can open Travel Links but cannot manage them
- Travel Links are included in authenticated print summaries
- Trip duplication copies trip-level links and remaps reservation-level links when possible
- Public share and invite pages do not expose Travel Links
- Migration `010_travel_links.sql` added
- No file uploads, Supabase Storage, OCR, email scanning, external APIs, RLS changes outside the new table, or new dependencies added

## Selected Reservation Calendar Export MVP

- Persisted reservation cards can export a single reservation as an `.ics` file
- Export is local client-side download from data already visible in the authenticated app
- Owner, editor, and viewer users can export reservations
- Reservations without a start date show a disabled helper instead of generating a file
- No whole-trip calendar export added
- No planner/place/bulk export added
- No Google Calendar API, Apple Calendar API, OAuth, sync, reminders, or recurring events added
- Public share pages do not expose calendar export
- No migrations or new dependencies added

## Final Beta QA / Release Notes

- Final beta QA documentation was updated for current persisted MVP capabilities
- Release notes were added to README
- Known beta limitations were clarified
- Privacy and owner/editor/viewer/public role QA checks were documented
- No migrations or dependencies were added
- No new product modules were added
- App is ready for beta testing after manual QA

## Feedback Fixes: Print, Places & Planner

- Authenticated print summary was simplified to Overview, Important Info, Planner, Packing, and trip-level Travel Links
- Add Place error states preserve typed form values so users can correct and resubmit
- Planner saved-place controls now indicate places already linked to plan items
- Persisted Places can be added directly to a selected plan day by owner/editor users
- Viewer/public share behavior remains read-only
- No migrations or dependencies were added

## Quick Planner Feedback Fixes

- Planner Add Item preserves submitted form values after validation or save errors
- Saved place indicators were shortened to `Planned` or `Planned · MM/DD/YYYY`
- Planned saved places can still be intentionally added again
- No migrations or dependencies were added

## Visual Hierarchy & Density Polish

- Dashboard hierarchy was tightened so useful trip information appears earlier
- Trips cards were made more compact and easier to scan
- Places page density was improved with lighter stats, filters, cards, and add-place CTA
- Shadows, gradients, and decorative color use were reduced in the focused surfaces
- Sidebar was narrowed and trip tabs were made more compact
- No migrations, dependencies, backend, RLS/RPC, or auth changes were added
- No maps, table view, compact mode toggle, or new product modules were added

## Strong Visual Hierarchy Pass

- Previous visual pass was too subtle, so this pass made stronger UI hierarchy changes
- Dashboard greeting/hero dominance was removed in favor of immediate trip workspace content
- Trips cards were made significantly more compact and less cover/gradient-driven
- Places stats and cards were made significantly denser for faster scanning
- Border-first cleanup was strengthened across the focused Dashboard, Trips, and Places surfaces
- Sidebar and trip tabs were tightened further
- No migrations, dependencies, backend, RLS/RPC, or auth changes were added

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
- Trip Settings: owner edits details and deletes only a disposable test trip
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

Task #058 — Strong Visual Hierarchy Pass

Goal:

Make the visual hierarchy and density improvements clearly noticeable across Dashboard, Trips, and Places.

The task includes:

- Dashboard hero reduced/replaced with trip-first workspace content
- Trips cards made significantly more compact
- Places stats/cards made significantly denser
- Stronger border-first cleanup
- No migrations, dependencies, or backend architecture changes

Important:

No migrations, dependencies, RLS/RPC changes, auth/backend architecture changes, map rendering, table view, compact mode toggle, drag and drop, AI, or public share changes are added.
