# Travora — MVP Beta QA Checklist

Use a disposable persisted trip for destructive checks.

Production URL: https://travora-theta.vercel.app

## Release smoke test

- [ ] App loads on production URL
- [ ] No secrets are visible in the UI or repository
- [ ] Landing page works on desktop
- [ ] Landing page works on mobile
- [ ] Public demo trip opens from landing
- [ ] Register works
- [ ] Login works
- [ ] Logout works
- [ ] Dashboard works after login
- [ ] Trips list works after login
- [ ] Core persisted trip detail loads
- [ ] App builds successfully
- [ ] No horizontal overflow on key mobile routes

## Landing and public demo

- [ ] `/` explains Travora clearly
- [ ] Get started opens `/register`
- [ ] Sign in opens `/login`
- [ ] View demo trip opens `/trips/japan-2027`
- [ ] Demo trip is self-contained and does not show app sidebar navigation
- [ ] Demo trip has Back to landing, Get started, and Sign in actions
- [ ] Demo trip does not mutate persisted data
- [ ] Other mock trips render safely

## Auth

- [ ] Register account
- [ ] Confirmation email link completes through `/auth/callback`
- [ ] Production confirmation link starts with `https://travora-theta.vercel.app/auth/callback`
- [ ] Supabase signup email template uses `{{ .ConfirmationURL }}`
- [ ] Invalid or expired auth callback shows a friendly path back to login
- [ ] Login
- [ ] Logout
- [ ] `/settings` shows signed-in auth state

## Dashboard and trips list

- [ ] Signed-in `/dashboard` shows persisted trip summary
- [ ] Dashboard shows useful trip information above the fold
- [ ] Dashboard empty state works for user with no trips
- [ ] Dashboard getting started card is visible and useful
- [ ] Signed-in `/trips` shows persisted trips
- [ ] Trips shows more cards above the fold after strong hierarchy pass
- [ ] Trips cards are compact and readable on desktop/mobile
- [ ] Trip cards show role/status/date metadata
- [ ] Clicking a trip card opens the trip
- [ ] Trip card buttons still work
- [ ] Deleted trips disappear after refresh
- [ ] Logged-out `/dashboard` redirects safely to public demo
- [ ] Logged-out `/trips` redirects safely to public demo

## Trip lifecycle

- [ ] Create trip
- [ ] Edit trip settings as owner
- [ ] Viewer sees read-only trip settings
- [ ] Delete disposable test trip as owner
- [ ] Duplicate persisted trip as owner
- [ ] Duplicate persisted trip as editor into own account
- [ ] Viewer cannot duplicate persisted trip
- [ ] Copied trip opens successfully
- [ ] Copied trip is owned by current user
- [ ] Copied places belong to copied trip
- [ ] Copied planner items reference copied places
- [ ] Copied reservations belong to copied trip
- [ ] Copied reservation-level Travel Links remap to copied reservations
- [ ] Copied budget items belong to copied trip
- [ ] Copied packing items belong to copied trip
- [ ] Copied Important Info is present
- [ ] Personal packing states are not copied
- [ ] Public share is disabled on copied trip
- [ ] Invite links and members are not copied
- [ ] Original trip is unchanged after duplication

## Trip detail tabs

- [ ] Overview tab works
- [ ] Places tab works
- [ ] Plan tab works
- [ ] Reservations tab works
- [ ] Budget tab works
- [ ] Packing tab works
- [ ] Participants tab works
- [ ] Settings tab works for persisted trips
- [ ] Map tab remains hidden
- [ ] Tabs are usable on mobile
- [ ] Sidebar and trip tabs remain usable on desktop/mobile
- [ ] No horizontal mobile overflow after density polish

## Overview, Important Info, and Travel Links

- [ ] Owner/editor can add Important Info
- [ ] Owner/editor can edit Important Info
- [ ] Viewer can read Important Info but cannot edit it
- [ ] Important Info preserves line breaks
- [ ] Public share does not expose Important Info
- [ ] Invite page does not expose Important Info
- [ ] Owner/editor can add trip-level Travel Link
- [ ] Owner/editor can edit trip-level Travel Link
- [ ] Owner/editor can delete trip-level Travel Link
- [ ] Viewer can open Travel Links but cannot manage them
- [ ] Invalid URL protocols such as `javascript:` or `mailto:` are rejected
- [ ] Public share does not expose Travel Links
- [ ] Invite page does not expose Travel Links

## Places

- [ ] Create place
- [ ] Edit place
- [ ] Delete place
- [ ] Places shows more content above the fold
- [ ] Places shows more place cards above the fold after strong hierarchy pass
- [ ] Places cards remain scannable on desktop/mobile
- [ ] Add Place keeps typed values after validation/save error
- [ ] Add Place can be corrected and resubmitted after an error
- [ ] Add Place pre-fills country from trip destination when safe
- [ ] Edit Place does not overwrite country from trip destination
- [ ] Optional latitude/longitude/map order can be saved
- [ ] Owner/editor can quickly change place status from card
- [ ] Viewer cannot change place status
- [ ] Owner/editor can add a persisted Place to a selected plan day
- [ ] Viewer cannot add a Place to the plan
- [ ] Places features still work after density polish

## Planner

- [ ] Create planner item
- [ ] Edit planner item
- [ ] Delete planner item
- [ ] Planner Add Item failed submit keeps typed title/date/time/place/notes
- [ ] Owner/editor can quick-add planner item
- [ ] Viewer cannot quick-add planner item
- [ ] Quick-add can use a saved Place
- [ ] Saved Place controls indicate places already used in the plan
- [ ] Saved Place planned indicator is compact
- [ ] Planned saved Places can still be intentionally added again
- [ ] Planner item with `place_id` marks linked Place as planned
- [ ] Visited/rejected Place status is not overwritten by Planner linking
- [ ] Place added from the Places tab appears in the selected plan day
- [ ] Original full Add/Edit planner flow still works
- [ ] Owner/editor can copy day
- [ ] Viewer cannot copy day
- [ ] Copy day does not overwrite target-day items
- [ ] Copying empty day shows friendly error
- [ ] Copying day to itself shows friendly error
- [ ] Owner/editor can move items up/down
- [ ] Viewer cannot reorder
- [ ] No drag and drop dependency exists

## Reservations and calendar export

- [ ] Reservations are sorted clearly: dated first, earliest date first, undated last
- [ ] Create reservation
- [ ] Edit reservation
- [ ] Delete reservation
- [ ] Reservation card shows title, type, date, status, provider, reference, location, and price clearly
- [ ] Long reservation notes do not dominate the card
- [ ] Custom currency can be used in reservation forms
- [ ] Reservation can optionally create matching Budget expense
- [ ] Editing/deleting reservation does not auto-sync created Budget expense
- [ ] Travel Links are easy to find from reservation cards
- [ ] Add reservation-level Travel Link
- [ ] Edit reservation-level Travel Link
- [ ] Delete reservation-level Travel Link
- [ ] Viewer can open reservation links but cannot manage them
- [ ] Reservation with start date exports `.ics`
- [ ] Reservation without start date shows disabled/helper calendar export state
- [ ] Exported `.ics` has sensible title/date/location/description
- [ ] Owner can export reservation calendar file
- [ ] Editor can export reservation calendar file
- [ ] Viewer can export reservation calendar file
- [ ] Viewer still cannot edit/delete reservation
- [ ] Public share does not expose calendar export
- [ ] Public share reservations remain safe and read-only
- [ ] Public share section controls still work for Reservations
- [ ] Public share does not expose reservation Travel Links
- [ ] Print summary still excludes Reservations
- [ ] No whole-trip calendar export was added
- [ ] No planner/place calendar export was added
- [ ] No migration or dependency was added for Reservations polish

## Budget and settlements

- [ ] Create budget expense
- [ ] Edit budget expense
- [ ] Delete budget expense
- [ ] Custom currency can be used in budget forms
- [ ] Owner/editor can set payer and split participants
- [ ] Viewer cannot edit expenses or settlement fields
- [ ] Legacy/unassigned expenses still render
- [ ] Unassigned expenses are clearly marked as needing payer/split
- [ ] Unassigned expenses are excluded from settlement suggestions
- [ ] Owner/editor can edit expenses to assign payer and split
- [ ] Viewer can view unassigned explanation but cannot edit
- [ ] Expense cards show paid by, split between, per-person share, status, and date clearly
- [ ] Settlement summary calculates paid/owed/balance per currency
- [ ] Settlement summary is easy to understand
- [ ] Per-currency settlements are separated
- [ ] Multi-currency copy says currencies are not converted
- [ ] Suggested settlements are reasonable for equal split
- [ ] Multi-currency expenses are not converted
- [ ] Public share remains read-only without settlement details
- [ ] Public share Budget remains safe/read-only
- [ ] No settlement details are exposed publicly
- [ ] No migration or dependency was added for Budget polish

## Packing and presets

- [ ] Create packing item
- [ ] Edit packing item
- [ ] Delete packing item
- [ ] Owner/editor can manage shared packing list
- [ ] Viewer cannot add/edit/delete packing items
- [ ] Owner can toggle own packing state
- [ ] Editor can toggle own packing state
- [ ] Viewer can toggle own packing state
- [ ] One member's packed state does not affect another member
- [ ] Built-in presets can be applied by owner/editor
- [ ] Viewer cannot apply or manage presets
- [ ] Create custom packing preset
- [ ] Add preset items
- [ ] Edit custom packing preset
- [ ] Delete custom packing preset
- [ ] Re-applying same preset skips duplicate item name/category pairs clearly
- [ ] User cannot access another user's presets

## Participants, invites, and sharing

- [ ] Owner can add existing Travora user by email
- [ ] Owner can edit non-owner participant role/status
- [ ] Owner can remove non-owner participant
- [ ] Owner cannot remove/downgrade owner
- [ ] Editor/viewer see read-only access information
- [ ] Owner can create invite link for a new email
- [ ] Owner can copy invite link
- [ ] Owner can revoke pending invite
- [ ] Editor/viewer cannot create invite
- [ ] Invite link opens without login
- [ ] Invitee must sign in/register
- [ ] Invite acceptance requires matching email
- [ ] Accepted invite creates active trip member
- [ ] Accepted invite cannot create duplicate membership
- [ ] Revoked invite does not work
- [ ] Invalid token shows safe page
- [ ] No automatic email sending happens
- [ ] No service-role/admin client is used for invites

## Public read-only share

- [ ] Owner can enable public share link
- [ ] Owner can copy public link
- [ ] Owner can disable public link
- [ ] Owner can regenerate public link
- [ ] Old regenerated link no longer works
- [ ] Editor/viewer cannot manage public share link
- [ ] Owner can toggle visible public share sections
- [ ] Editor/viewer cannot manage public share section controls
- [ ] Overview remains visible and cannot be disabled
- [ ] Existing public shares default to showing Places, Planner, Reservations, Budget, and Packing
- [ ] Public share shows enabled sections
- [ ] Public share hides disabled sections
- [ ] Disabled sections are not returned in the public payload
- [ ] Public link opens without login
- [ ] Public page is read-only
- [ ] Public page has no app sidebar/navigation
- [ ] Public page has no edit/delete/toggle/settings controls
- [ ] Public share packing is read-only
- [ ] Public page does not expose participant emails
- [ ] Public page does not expose user IDs, member IDs, owner IDs, or share token fields
- [ ] Public page does not expose reservation reference/confirmation number
- [ ] Public page does not expose Important Info
- [ ] Public page does not expose Travel Links
- [ ] Public page does not expose invite data
- [ ] Public page does not expose calendar export
- [ ] Invalid/disabled token shows safe not-found behavior

## Print summary

- [ ] Summary route opens for persisted trip
- [ ] Print summary button opens browser print
- [ ] Print layout hides app actions and navigation
- [ ] Viewer can open read-only summary
- [ ] Summary does not expose internal IDs
- [ ] Participant emails are not printed
- [ ] Important Info appears in authenticated print summary when present
- [ ] Planner/itinerary appears in authenticated print summary
- [ ] Packing appears in authenticated print summary
- [ ] Trip-level Travel Links appear in authenticated print summary when present
- [ ] Places are not printed in authenticated summary
- [ ] Reservations are not printed in authenticated summary
- [ ] Reservation-level Travel Links are not printed in authenticated summary
- [ ] Budget is not printed in authenticated summary
- [ ] Participants are not printed in authenticated summary
- [ ] Mock trip summary route remains safe

## Privacy and role QA

### Owner

- [ ] Owner can manage trip settings
- [ ] Owner can manage participants
- [ ] Owner can create/revoke public share link
- [ ] Owner can create/revoke invite links
- [ ] Owner can create/edit/delete Places, Planner, Reservations, Budget, and Packing content
- [ ] Owner can use personal packing progress
- [ ] Owner can export reservation calendar files

### Editor

- [ ] Editor can edit trip content modules
- [ ] Editor can duplicate trip into own account
- [ ] Editor can use personal packing progress
- [ ] Editor can export reservation calendar files
- [ ] Editor cannot manage owner-only settings
- [ ] Editor cannot manage participants
- [ ] Editor cannot manage public share links
- [ ] Editor cannot create/revoke invite links

### Viewer

- [ ] Viewer can view trip content
- [ ] Viewer can use personal packing progress
- [ ] Viewer can export reservation calendar files
- [ ] Viewer cannot edit content modules
- [ ] Viewer cannot manage budget items or settlement fields
- [ ] Viewer cannot manage settings
- [ ] Viewer cannot manage participants
- [ ] Viewer cannot manage public share or invite links

### Public share

- [ ] Public visitor has read-only access only
- [ ] Public visitor cannot mutate packing progress
- [ ] Public visitor cannot see private Important Info
- [ ] Public visitor cannot see Travel Links
- [ ] Public visitor cannot see invite data
- [ ] Public visitor cannot see participant emails/internal IDs
- [ ] Public visitor cannot export reservation calendar files
- [ ] Public visitor sees only sections enabled by the owner

### Invite page

- [ ] Invite page shows only safe trip preview
- [ ] Invite page does not expose private trip content
- [ ] Invite page does not expose Important Info or Travel Links
- [ ] Invite acceptance requires login/register
- [ ] Invite acceptance requires matching email

## Mobile QA

- [ ] Landing page has no horizontal overflow
- [ ] Dashboard is usable on mobile
- [ ] Trips list cards stack and wrap correctly
- [ ] Trip Detail tabs scroll horizontally and active tab is clear
- [ ] Add/Edit forms are usable on mobile
- [ ] Add/Edit panels scroll into view after user action
- [ ] Mobile inputs do not auto-zoom on focus
- [ ] Key actions are tappable
- [ ] Destructive actions remain clearly separated

## Known beta limitations

- [ ] No automatic email sending; invite links are copied manually
- [ ] Public share is read-only
- [ ] Public share does not include Important Info or Travel Links
- [ ] Travel Links are URL-only; no uploads/storage
- [ ] Reservation calendar export is per-reservation `.ics`; no calendar API/sync/global export
- [ ] Budget settlements are equal split only
- [ ] No live currency conversion
- [ ] No online payments
- [ ] No map rendering yet
- [ ] No realtime collaboration
- [ ] No AI planning
- [ ] No comments or notifications
- [ ] Advanced public share controls beyond MVP section toggles are postponed

## Build and deployment readiness

- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm build` passes in deployment environment
- [ ] Supabase migrations are applied in target project
- [ ] Vercel env vars are configured
- [ ] No real secrets are committed
- [ ] `.env.local` remains untracked
