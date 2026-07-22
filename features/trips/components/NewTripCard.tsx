import Link from "next/link";
import { Plus } from "lucide-react";

export function NewTripCard() {
  return (
    <Link
      href="/trips/new"
      className="group flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-elevated px-5 text-center transition-colors duration-150 hover:border-primary/30 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary-subtle transition-transform duration-150 group-hover:scale-105">
        <Plus className="size-5 text-primary" />
      </span>
      <h2 className="mt-4 text-base font-semibold tracking-tight text-foreground">New trip</h2>
      <p className="mt-1.5 max-w-56 text-sm leading-relaxed text-muted">
        Start a new journey and keep every detail organized from day one.
      </p>
    </Link>
  );
}
