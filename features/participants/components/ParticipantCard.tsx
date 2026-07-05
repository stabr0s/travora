import { CalendarDays, Mail } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import type {
  Participant,
  ParticipantRole,
  ParticipantStatus,
} from "@/features/participants/types/participant";

const roleDetails: Record<
  ParticipantRole,
  { label: string; variant: "default" | "success" | "outline" }
> = {
  owner: { label: "Owner", variant: "default" },
  editor: { label: "Editor", variant: "success" },
  viewer: { label: "Viewer", variant: "outline" },
};

const statusDetails: Record<
  ParticipantStatus,
  { label: string; variant: "success" | "default" | "warning" }
> = {
  active: { label: "Active", variant: "success" },
  invited: { label: "Invited", variant: "default" },
  pending: { label: "Pending", variant: "warning" },
};

type ParticipantCardProps = {
  participant: Participant;
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function ParticipantCard({ participant }: ParticipantCardProps) {
  const role = roleDetails[participant.role];
  const status = statusDetails[participant.status];

  return (
    <Card padding="md" className="h-full hover:shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
          {participant.avatarInitials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">{participant.name}</h3>
              {participant.email ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <Mail className="size-3.5" />{participant.email}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={role.variant}>{role.label}</Badge>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>

          {participant.notes ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">{participant.notes}</p>
          ) : null}

          {participant.joinedAt ? (
            <p className="mt-4 flex items-center gap-1.5 border-t border-border-subtle pt-3 text-xs text-muted">
              <CalendarDays className="size-3.5" />Joined {formatDate(participant.joinedAt)}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
