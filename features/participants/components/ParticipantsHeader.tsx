import { UserPlus } from "lucide-react";

import { Button, SectionHeader } from "@/components/ui";

type ParticipantsHeaderProps = {
  onInvite: () => void;
};

export function ParticipantsHeader({ onInvite }: ParticipantsHeaderProps) {
  return (
    <SectionHeader
      title="Participants"
      description="Preview the travelers, roles, and future sharing setup for this trip."
      className="mb-0"
      action={
        <Button size="md" onClick={onInvite}>
          <UserPlus className="size-4" />
          Invite participant
        </Button>
      }
    />
  );
}
