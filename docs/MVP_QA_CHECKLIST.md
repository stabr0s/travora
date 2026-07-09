# Travora — MVP QA Checklist

Use a disposable test trip for destructive checks.

## Production QA status

Production URL: https://travora-theta.vercel.app

Manually checked after first Vercel MVP deploy:

- [x] App loads on production URL
- [x] Register works
- [x] Login works
- [x] Dashboard works
- [x] Trips list works
- [x] Create trip works
- [x] Persisted trip detail works
- [x] Persisted modules were checked
- [x] Map tab remains hidden
- [x] Basic auth redirect works

This notes the first manual production smoke test, not exhaustive regression
coverage.

## Auth

- [ ] Register account
- [ ] Confirm email link completes through `/auth/callback`
- [ ] Confirm production email link starts with `https://travora-theta.vercel.app/auth/callback`
- [ ] Confirm Supabase signup email template uses `{{ .ConfirmationURL }}`
- [ ] Expired or invalid confirmation link shows friendly login error
- [ ] Login
- [ ] Logout
- [ ] Confirm `/settings` shows auth state

## Public landing and onboarding

- [ ] Landing page loads on desktop
- [ ] Landing page loads on mobile
- [ ] Get started links to `/register`
- [ ] Sign in links to `/login`
- [ ] Demo trip link opens `/trips/japan-2027`
- [ ] Auth page copy is clear for new users
- [ ] Landing has no horizontal overflow on mobile
- [ ] Landing does not introduce new backend behavior

## Focused public demo trip

- [ ] Landing View demo trip opens `/trips/japan-2027`
- [ ] Demo trip does not show Dashboard, Trips, or Settings sidebar links
- [ ] Demo trip has Back to landing, Get started, and Sign in actions
- [ ] All trips button is not visible on demo trip
- [ ] Demo trip has no app mobile navigation
- [ ] Persisted trip navigation still works
- [ ] No backend behavior changed
- [ ] No migrations or dependencies added

## Trips

- [ ] Create trip
- [ ] Edit trip settings
- [ ] Delete test trip
- [ ] Confirm deleted trip disappears from `/trips`
- [ ] Confirm deleted trip disappears from `/dashboard`

## Places

- [ ] Create place
- [ ] Add Place pre-fills country from trip destination when safe
- [ ] Confirm pre-filled country can be changed or cleared
- [ ] Confirm Edit Place does not overwrite country from trip destination
- [ ] Edit place
- [ ] Delete place

## Planner

- [ ] Create planner item from saved Place quick-add
- [ ] Confirm planner quick-add stores `place_id`
- [ ] Confirm planner item can still be created manually without Place
- [ ] Create planner item
- [ ] Edit planner item
- [ ] Delete planner item

## Reservations

- [ ] Create reservation
- [ ] Confirm Add Reservation defaults currency from trip settings
- [ ] Confirm Edit Reservation keeps existing currency unless user changes it
- [ ] Create reservation with "Add this payment to Budget" checked
- [ ] Confirm matching budget expense appears after reservation save
- [ ] Confirm editing/deleting reservation does not auto-sync budget expense
- [ ] Edit reservation
- [ ] Delete reservation

## Budget

- [ ] Create budget expense
- [ ] Confirm Add Budget Expense defaults currency from trip settings
- [ ] Confirm Edit Budget Expense keeps existing currency unless user changes it
- [ ] Edit budget expense
- [ ] Delete budget expense

## Packing

- [ ] Add Weekend packing preset
- [ ] Add City break packing preset
- [ ] Add Road trip packing preset
- [ ] Confirm packing presets skip duplicate item names clearly
- [ ] Create packing item
- [ ] Edit packing item
- [ ] Toggle packed state
- [ ] Delete packing item

## Participants and permissions

- [ ] Add existing Travora user by email
- [ ] Edit non-owner participant role/status
- [ ] Remove non-owner participant
- [ ] Confirm owner can manage trip content and people
- [ ] Confirm editor can edit trip modules but cannot manage people/settings
- [ ] Confirm viewer has read-only module UI

## Dashboard and trips list

- [ ] Dashboard shows persisted trip summary
- [ ] Trips list shows persisted trips
- [ ] Trips cards show role/status/date metadata
- [ ] Empty states are clear

## Mobile UX

- [ ] Dashboard is usable on mobile
- [ ] Trips list cards stack and wrap correctly on mobile
- [ ] Trip Detail tabs scroll horizontally and keep active tab clear
- [ ] Add/Edit forms are usable on mobile
- [ ] No horizontal overflow on key routes
- [ ] Key actions are tappable on mobile
- [ ] Destructive actions remain clearly separated on mobile

## Export / Print Summary

- [ ] Summary route opens for persisted trip
- [ ] Print summary button opens browser print
- [ ] Print layout hides app actions and navigation
- [ ] Viewer can open read-only summary
- [ ] Summary does not expose internal IDs
- [ ] Participant emails are not printed
- [ ] Mock trip summary route remains safe

## Demo and postponed areas

- [ ] Mock/demo trip `/trips/japan-2027` renders safely
- [ ] Other mock/demo trips render safely
- [ ] Map tab is hidden from Trip Detail
- [ ] No public link UI is active
- [ ] No email invitation claim appears

## Build and deployment readiness

- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm build` passes in deployment environment
- [ ] No real secrets are committed
- [ ] `.env.local` remains untracked
