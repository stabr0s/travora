import Link from "next/link";
import {
  Calendar,
  Luggage,
  Map,
  MapPin,
  Plus,
  Wallet,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { QuickAction } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

const iconMap = {
  plus: Plus,
  "map-pin": MapPin,
  map: Map,
  wallet: Wallet,
  luggage: Luggage,
  calendar: Calendar,
} as const;

type QuickActionsProps = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into the most common planning tasks.</CardDescription>
      </CardHeader>

      <div className="grid gap-2 pt-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];

          return (
            <Link
              key={action.id}
              href={action.href}
              className={cn(
                "group flex items-start gap-2.5 rounded-lg border border-border-subtle bg-surface px-3 py-2.5",
                "transition-colors duration-150 hover:border-border hover:bg-background",
                "active:bg-border-subtle",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle transition-colors group-hover:bg-primary/10">
                <Icon className="size-4 text-primary" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  {action.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
