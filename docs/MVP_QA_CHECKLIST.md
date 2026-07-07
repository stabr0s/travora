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
- [ ] Login
- [ ] Logout
- [ ] Confirm `/settings` shows auth state

## Trips

- [ ] Create trip
- [ ] Edit trip settings
- [ ] Delete test trip
- [ ] Confirm deleted trip disappears from `/trips`
- [ ] Confirm deleted trip disappears from `/dashboard`

## Places

- [ ] Create place
- [ ] Edit place
- [ ] Delete place

## Planner

- [ ] Create planner item
- [ ] Edit planner item
- [ ] Delete planner item

## Reservations

- [ ] Create reservation
- [ ] Edit reservation
- [ ] Delete reservation

## Budget

- [ ] Create budget expense
- [ ] Edit budget expense
- [ ] Delete budget expense

## Packing

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
