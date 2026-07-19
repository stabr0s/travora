# Travora

Travora is a private travel planning MVP built with Next.js and Supabase.

The current MVP supports persisted trips, places, planner items, reservations,
budget expenses, packing items, personal packing progress, participants,
manual invite links, public read-only share links, and print-friendly trip
summaries. Budget includes basic equal-split group settlement suggestions.
Trips can also be duplicated to reuse a previous itinerary as a simple
template. Demo trips remain available for safe exploration.

Production: https://travora-theta.vercel.app

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth and database
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

Do not commit `.env.local`. Never expose a Supabase `service_role` key, JWT
secret, database password, or any other secret in the browser.

## Deployment and QA

- Deployment guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- MVP QA checklist: [`docs/MVP_QA_CHECKLIST.md`](docs/MVP_QA_CHECKLIST.md)

## Current MVP capabilities

- Create and manage persisted trips.
- Plan places, daily itinerary items, reservations, budget expenses, and packing.
- Track basic equal-split group settlements per currency.
- Track personal packed/unpacked progress per authenticated trip member.
- Manage owner/editor/viewer access.
- Add existing Travora users directly or create manual email-bound invite links.
- Share a public read-only trip page.
- Print a clean trip summary from Trip Detail.
- Duplicate a persisted trip as a starting point for a new one.

## Current beta limitations

- Map rendering is postponed.
- Public share pages are read-only.
- Budget settlements support equal split only.
- Travora does not convert currencies or process payments.
- Manual invite links exist, but Travora does not send emails automatically yet.
- Full template galleries, public templates, and template categories are postponed.
- File attachments and calendar export are postponed.
- Realtime collaboration and AI planning are postponed.
- Application routes are public; Supabase RLS is the backend enforcement layer.
