# Travora — Deployment Guide

Travora is prepared for first MVP testing on Vercel.

## Production deployment

- Production URL: https://travora-theta.vercel.app
- Deploy target: Vercel
- Branch: `main`
- Current deployment status: First MVP deploy completed successfully
- Vercel environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Reminder:

- Never add a Supabase `service_role` key to Vercel.
- Never commit `.env.local`.

## Supabase Auth production configuration

- Site URL must include the protocol:
  `https://travora-theta.vercel.app`
- Additional Redirect URLs should include:
  - `https://travora-theta.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`
- Signup confirmation emails should use Supabase's built-in confirmation URL
  variable: `{{ .ConfirmationURL }}`.

Deployment-specific preview URLs may also need to be allowlisted when testing
Vercel preview deployments.

Important malformed-link check:

- A broken confirmation URL like
  `https://atbaylwoqrrrljlnogfu.supabase.co/travora-theta.vercel.app?code=...`
  means Supabase is missing the full production callback target. Recheck that
  the Site URL includes `https://` and that the Additional Redirect URL includes
  the full `/auth/callback` path:
  `https://travora-theta.vercel.app/auth/callback`.

## Troubleshooting

- If register/login returns a generic error and Supabase Auth Logs show `401`
  on `/auth/v1/signup`, verify that the Vercel Supabase publishable key belongs
  to the same Supabase project as `NEXT_PUBLIC_SUPABASE_URL`.
- If auth redirects to the wrong domain, check Supabase Auth URL Configuration.
- If a confirmation email points to the Supabase project domain followed by the
  app domain without protocol, verify the production Site URL, Redirect URLs, and
  that the confirmation email template uses `{{ .ConfirmationURL }}`.

## Recommended target

- Vercel

## Required environment variables

Set these in Vercel project settings and in local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not add or expose:

- Supabase `service_role` key
- JWT secret
- database password
- any private or server-only secret

Never commit `.env.local`.

## Supabase checklist

Before deployment, confirm:

- Migration `001_initial_schema.sql` is applied.
- Migration `002_participant_profile_access.sql` is applied.
- Migration `003_map_data_foundation.sql` is applied.
- Supabase Auth is enabled.
- Site URL is set to the production domain with protocol, for example:
  `https://travora-theta.vercel.app`.
- Auth callback URL matches the deployment domain, for example:
  `https://your-domain.com/auth/callback`.
- Signup confirmation template uses `{{ .ConfirmationURL }}`.

## Build commands

```bash
pnpm install
pnpm build
```

## Post-deploy checks

- Register a new account.
- Login and logout.
- Create a trip.
- Open persisted trip detail.
- Create/edit/delete persisted module records.
- Verify owner/editor/viewer permissions.
- Confirm RLS prevents unauthorized writes.
- Confirm mock/demo trips still open safely.

## Current limitations

- Map rendering is postponed.
- Public share links are not implemented.
- Email invitations are not implemented.
- Application routes are public; RLS remains the data access enforcement layer.
