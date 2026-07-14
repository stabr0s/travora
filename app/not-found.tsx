import Link from "next/link";
import { Compass } from "lucide-react";

import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-surface-elevated p-8 text-center shadow-sm">
        <Logo href="/" className="justify-center" />
        <span className="mx-auto mt-8 flex size-12 items-center justify-center rounded-2xl bg-primary-subtle">
          <Compass className="size-6 text-primary" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This address does not match a Travora page. Check the URL or return to a safe starting point.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-surface"
          >
            Back to landing
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
