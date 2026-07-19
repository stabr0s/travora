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

## Beta readiness sweep

- [ ] Landing → demo → register/login flow is clear
- [ ] Register/login → dashboard flow is clear
- [ ] Create trip flow has clear copy and safe empty states
- [ ] Dashboard getting started card is visible and helpful
- [ ] Places empty state explains what to add next
- [ ] Planner empty state explains quick-add and saved Places
- [ ] Reservations empty state explains what belongs there
- [ ] Budget empty state explains how to start tracking costs
- [ ] Packing empty state explains shared checklist and personal progress
- [ ] Participants and invite empty states explain access next steps
- [ ] Public share invalid/disabled state is safe
- [ ] Invite invalid/revoked/wrong-email states are clear
- [ ] Known beta limitations are documented without sounding like app errors

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
- [ ] Owner can duplicate persisted trip
- [ ] Editor can duplicate persisted trip into their own account
- [ ] Viewer cannot duplicate persisted trip
- [ ] Copied trip opens successfully
- [ ] Copied trip is owned by the current user
- [ ] Copied places belong to copied trip
- [ ] Copied planner items reference copied places, not original places
- [ ] Copied reservations belong to copied trip
- [ ] Copied budget items belong to copied trip
- [ ] Copied packing items belong to copied trip
- [ ] Personal packing states are not copied
- [ ] Public share is disabled on copied trip
- [ ] Invite links are not copied
- [ ] Members are not copied except current user owner membership
- [ ] Original trip is unchanged after duplication
- [ ] Mock/demo trips cannot be duplicated
- [ ] Public share visitors cannot duplicate trips
- [ ] No service-role/admin client is used for duplication
- [ ] Edit trip settings
- [ ] Delete test trip
- [ ] Confirm deleted trip disappears from `/trips`
- [ ] Confirm deleted trip disappears from `/dashboard`

## Places

- [ ] Create place
- [ ] Add Place pre-fills country from trip destination when safe
- [ ] Confirm pre-filled country can be changed or cleared
- [ ] Confirm Edit Place does not overwrite country from trip destination
- [ ] Owner/editor can quickly change place status from the place card
- [ ] Viewer cannot quickly change place status
- [ ] Edit place
- [ ] Delete place

## Planner

- [ ] Owner/editor can quick-add planner item
- [ ] Viewer cannot quick-add planner item
- [ ] Create planner item from saved Place quick-add
- [ ] Confirm planner quick-add stores `place_id`
- [ ] Adding planner item with `place_id` marks linked Place as planned
- [ ] Editing planner item to add/change Place marks the new Place as planned
- [ ] Visited/rejected Place status is not overwritten by Planner linking
- [ ] Confirm planner item can still be created manually without Place
- [ ] Owner/editor can copy day
- [ ] Viewer cannot copy day
- [ ] Copied day preserves title, description, type, times, place link, and status
- [ ] Copy day does not overwrite existing target-day items
- [ ] Copying an empty day shows a friendly error
- [ ] Copying a day to itself shows a friendly error
- [ ] Owner/editor can move planner items up/down within one day
- [ ] Viewer cannot reorder planner items
- [ ] No drag and drop dependency was added
- [ ] No planner redesign was added
- [ ] No planner migration was added
- [ ] Create planner item
- [ ] Edit planner item
- [ ] Delete planner item

## Reservations

- [ ] Create reservation
- [ ] Custom currency can be used in reservation forms
- [ ] Confirm Add Reservation defaults currency from trip settings
- [ ] Confirm Edit Reservation keeps existing currency unless user changes it
- [ ] Create reservation with "Add this payment to Budget" checked
- [ ] Confirm matching budget expense appears after reservation save
- [ ] Confirm editing/deleting reservation does not auto-sync budget expense
- [ ] Edit reservation
- [ ] Delete reservation

## Budget

- [ ] Create budget expense
- [ ] Custom currency can be used in budget forms
- [ ] Confirm Add Budget Expense defaults currency from trip settings
- [ ] Confirm Edit Budget Expense keeps existing currency unless user changes it
- [ ] Edit budget expense
- [ ] Delete budget expense

## Packing

- [ ] Add Weekend packing preset
- [ ] Add City break packing preset
- [ ] Add Road trip packing preset
- [ ] Confirm packing presets skip duplicate item name/category pairs clearly
- [ ] Create custom packing preset
- [ ] Add preset items
- [ ] Edit preset items
- [ ] Edit custom packing preset
- [ ] Delete custom packing preset
- [ ] Apply custom packing preset to a trip
- [ ] Re-apply same preset and confirm duplicates are skipped
- [ ] Confirm built-in presets still work
- [ ] Confirm viewer cannot apply or manage presets
- [ ] Confirm user cannot access another user’s presets
- [ ] Create packing item
- [ ] Edit packing item
- [ ] Owner can toggle own packing state
- [ ] Editor can toggle own packing state
- [ ] Viewer can toggle own packing state
- [ ] Owner toggle does not affect viewer state
- [ ] Viewer toggle does not affect owner state
- [ ] User cannot update packing state for a trip they are not a member of
- [ ] Viewer cannot add/edit/delete packing items
- [ ] Viewer cannot manage presets
- [ ] Delete packing item

## Participants and permissions

- [ ] Add existing Travora user by email
- [ ] Owner can create invite for a new email
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
- [ ] Existing add-user flow still works
- [ ] No automatic email sending happens
- [ ] No service-role/admin client is used for invites
- [ ] Edit non-owner participant role/status
- [ ] Remove non-owner participant
- [ ] Confirm owner can manage trip content and people
- [ ] Confirm editor can edit trip modules but cannot manage people/settings
- [ ] Confirm viewer has read-only module UI

## Dashboard and trips list

- [ ] Dashboard shows persisted trip summary
- [ ] Logged-out `/dashboard` redirects to `/trips/japan-2027`
- [ ] Logged-out `/trips` redirects to `/trips/japan-2027`
- [ ] Signed-in `/dashboard` still works
- [ ] Signed-in `/trips` still works
- [ ] Trips list shows persisted trips
- [ ] Trips cards show role/status/date metadata
- [ ] Clicking a trip card opens the trip
- [ ] Trip card buttons still work
- [ ] Empty states are clear

## Route safety and quick UX fixes

- [ ] Custom currency can be used in trip settings and new trip form
- [ ] `/Dasboard` does not render a trip or confusing page
- [ ] Valid `/dashboard` still works
- [ ] Demo trip still works
- [ ] Focused demo trip still works after logged-out dashboard redirect
- [ ] Planner was not redesigned

## Mobile UX

- [ ] Dashboard is usable on mobile
- [ ] Trips list cards stack and wrap correctly on mobile
- [ ] Trip Detail tabs scroll horizontally and keep active tab clear
- [ ] Add/Edit forms are usable on mobile
- [ ] Add/Edit panels scroll into view after user action
- [ ] Mobile inputs do not auto-zoom on focus
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

## Public read-only share links

- [ ] Owner can enable public share link
- [ ] Owner can copy public link
- [ ] Public link opens without login
- [ ] Public link is read-only
- [ ] Public page has no app sidebar navigation
- [ ] Public page has no edit/delete/toggle/settings controls
- [ ] Public share packing remains read-only
- [ ] Public page does not expose participant emails
- [ ] Public page does not expose user IDs, member IDs, owner IDs, or share token fields
- [ ] Public page does not expose reservation reference/confirmation number
- [ ] Owner can disable public link
- [ ] Disabled link shows safe not-found behavior
- [ ] Owner can regenerate public link
- [ ] Old regenerated link no longer works
- [ ] Editor/viewer cannot manage public link
- [ ] Invalid token shows safe not-found behavior
- [ ] No service-role/admin client is used

## Demo and postponed areas

- [ ] Mock/demo trip `/trips/japan-2027` renders safely
- [ ] Other mock/demo trips render safely
- [ ] Map tab is hidden from Trip Detail
- [ ] No automatic email-sending claim appears
- [ ] Public share is clearly read-only
- [ ] Public share packing is clearly read-only
- [ ] Attachments, calendar export, realtime, and AI are documented as postponed
- [ ] Known limitations are listed in README/project docs

## Build and deployment readiness

- [ ] `pnpm lint` passes
- [ ] `pnpm exec tsc --noEmit` passes
- [ ] `pnpm build` passes in deployment environment
- [ ] No real secrets are committed
- [ ] `.env.local` remains untracked
