import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Luggage,
  MapPin,
  Printer,
  Share2,
  WalletCards,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

const steps = [
  { label: "Create a trip", icon: CalendarDays },
  { label: "Add places", icon: MapPin },
  { label: "Build the plan", icon: CheckCircle2 },
  { label: "Track reservations and budget", icon: WalletCards },
  { label: "Use packing", icon: Luggage },
  { label: "Invite friends or share a read-only link", icon: Share2 },
  { label: "Print summary", icon: Printer },
];

export function GettingStartedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting started</CardTitle>
        <CardDescription>
          A calm path from a blank trip to a ready-to-share plan.
        </CardDescription>
      </CardHeader>

      <ol className="mt-3 grid gap-1.5">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <li key={step.label} className="flex min-w-0 items-center gap-2.5 rounded-lg bg-surface px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
                <Icon className="size-3.5 text-primary" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 break-words text-sm text-foreground">
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <Link
        href="/trips/new"
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
      >
        Start a trip
      </Link>
    </Card>
  );
}
