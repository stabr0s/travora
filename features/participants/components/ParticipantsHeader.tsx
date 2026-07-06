import { UserPlus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type ParticipantsHeaderProps = {
  onInvite?: () => void;
  actionLabel?: string;
  description?: string;
};

export function ParticipantsHeader({
  onInvite,
  actionLabel = "Invite participant",
  description = "Preview the travelers, roles, and future sharing setup for this trip.",
}: ParticipantsHeaderProps) {
  return (
    <SectionHeader
      title="Participants"
      description={description}
      className="mb-0"
      action={onInvite ? (
        <Button size="md" onClick={onInvite}>
          <UserPlus className="size-4" />
          {actionLabel}
        </Button>
      ) : undefined}
    />
  );
}
