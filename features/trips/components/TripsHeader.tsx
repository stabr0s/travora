import Link from "next/link";
import { Plus } from "lucide-react";

import { SectionHeader } from "@/components/ui";

export function TripsHeader() {
  return (
    <SectionHeader
      title="Trips"
      description="Plan, organize, and revisit every journey in one place."
      action={
        <Link
          href="/trips/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:bg-primary-active"
        >
          <Plus className="size-4" />
          New trip
        </Link>
      }
    />
  );
}
