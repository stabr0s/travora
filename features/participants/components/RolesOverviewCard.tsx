import { Crown, Eye, Pencil, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui";

const roles = [
  {
    label: "Owner",
    description: "Full access. Can manage trip content and people.",
    icon: Crown,
  },
  {
    label: "Editor",
    description: "Can add and edit trip content, but cannot manage people.",
    icon: Pencil,
  },
  {
    label: "Viewer",
    description: "Can view the trip, but cannot make changes.",
    icon: Eye,
  },
];

export function RolesOverviewCard() {
  return (
    <Card padding="md" className="h-full hover:shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle">
          <ShieldCheck className="size-5 text-primary" />
        </span>
        <div>
          <h2 className="font-semibold tracking-tight text-foreground">Trip access roles</h2>
          <p className="mt-1 text-sm text-muted">Each person has one clear level of access.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <div key={role.label} className="flex gap-3 rounded-xl bg-surface p-3.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated shadow-xs">
                <Icon className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{role.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{role.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
