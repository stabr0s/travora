# Travora

Travora is a private travel planning MVP built with Next.js and Supabase.

The current MVP supports persisted trips, places, planner items, reservations,
budget expenses, packing items, and participants. Demo trips remain available
for safe exploration.

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

## Current limitations

- Map rendering is postponed.
- Public share links are not implemented.
- Email invitations are not implemented.
- Application routes are public; Supabase RLS is the backend enforcement layer.
