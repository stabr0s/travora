import { CalendarDays, Mail } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import type { PersistedParticipant } from "@/features/participants/types/persisted-participant";

type PersistedParticipantCardProps = {
  participant: PersistedParticipant;
  canManage: boolean;
  isPending: boolean;
  onEdit: (participant: PersistedParticipant) => void;
  onRemove: (participant: PersistedParticipant) => void;
};

const roleDetails = {
  owner: { label: "Owner", variant: "default" as const },
  editor: { label: "Editor", variant: "success" as const },
  viewer: { label: "Viewer", variant: "outline" as const },
};
const statusDetails = {
  active: { label: "Active", variant: "success" as const },
  invited: { label: "Invited", variant: "default" as const },
  pending: { label: "Pending", variant: "warning" as const },
};

function initials(participant: PersistedParticipant) {
  const source = participant.fullName || participant.email || "Trip member";
  return source.split(/[\s@]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function PersistedParticipantCard({
  participant,
  canManage,
  isPending,
  onEdit,
  onRemove,
}: PersistedParticipantCardProps) {
  const role = roleDetails[participant.role];
  const status = statusDetails[participant.status];
  const name = participant.fullName || participant.email || "Trip member";
  const showActions = canManage && participant.role !== "owner";

  return (
    <Card padding="md" className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          {initials(participant)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="break-words font-semibold tracking-tight text-foreground">{name}</h3>
              {participant.email ? <p className="mt-1 flex items-start gap-1.5 text-xs text-muted"><Mail className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{participant.email}</span></p> : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={role.variant}>{role.label}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
          {participant.createdAt ? (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="size-3.5" />Added {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(participant.createdAt))}
            </p>
          ) : null}
          {showActions ? (
            <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row">
              <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(participant)} disabled={isPending}>Edit</Button>
              <Button size="sm" variant="ghost" className="w-full text-error sm:w-auto" onClick={() => onRemove(participant)} disabled={isPending}>Remove</Button>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
