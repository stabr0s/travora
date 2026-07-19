# Travora

Travora is a private travel planning beta for organizing a trip in one calm
workspace: places, daily plans, reservations, budget, packing, people, sharing,
and print-ready summaries.

Production: https://travora-theta.vercel.app

## Current beta features

- Persisted trips with owner, editor, and viewer roles.
- Places, planner items, reservations, budget expenses, and packing lists.
- Trip settings, permanent trip deletion, and trip duplication.
- Important Info for private notes such as addresses, check-in details, and emergency contacts.
- URL-only Travel Links at trip level and reservation level.
- Selected reservation `.ics` calendar export.
- Budget equal-split settlement suggestions per currency.
- Personal packing progress per authenticated trip member.
- Packing presets, including custom user-owned presets.
- Participants management, existing-user add flow, and manual email-bound invite links.
- Public read-only share links.
- Focused public demo trips.
- Print-friendly trip summary.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth and database
- Vercel
- pnpm

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Required environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use values from the Supabase project settings or Connect dialog.

Security notes:

- Do not commit `.env.local`.
- Never expose a Supabase `service_role` key in the browser or Vercel public env.
- Do not commit JWT secrets, database passwords, or real credentials.

## Supabase setup

Apply the SQL migrations in `supabase/migrations/` to the target Supabase
project before testing persisted features. The repository keeps SQL migrations
manual/reviewable; it does not automatically apply them.

See:

- Deployment guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- Database notes: [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)
- MVP QA checklist: [`docs/MVP_QA_CHECKLIST.md`](docs/MVP_QA_CHECKLIST.md)

## Beta release notes

This beta includes the persisted core planning workflow:

- Trips and role-based access.
- Places, Planner, Reservations, Budget, Packing, and Participants.
- Trip duplication for reusing previous itineraries.
- Public read-only share links.
- Manual email-bound invite links.
- Personal packing progress.
- Budget equal-split settlement suggestions.
- Private Important Info.
- URL-only Travel Links.
- Selected reservation `.ics` export.
- Print-friendly trip summary.

The beta is ready for manual testing and feedback. Supabase RLS remains the
backend enforcement layer for persisted trip access.

## Current beta limitations

- No automatic email sending; invite links are copied and sent manually.
- Public share pages are read-only.
- Public share does not include private Important Info or Travel Links.
- Travel Links are URL-only; there is no file upload, Supabase Storage, OCR, or booking import.
- Calendar export is selected-reservation `.ics` download only; there is no whole-trip export, calendar API, OAuth, sync, reminders, or recurring events.
- Budget settlements support equal split only; no custom percentages or custom amounts.
- No live currency conversion.
- No online payments.
- Map rendering is postponed, though map-ready place fields exist.
- No realtime collaboration.
- No AI planning.
- No comments or notifications.
- No advanced per-section public share controls.
- Application routes are public; Supabase RLS is the backend enforcement layer.
