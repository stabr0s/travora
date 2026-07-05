import { Users } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { ParticipantCard } from "@/features/participants/components/ParticipantCard";
import type { Participant } from "@/features/participants/types/participant";

type ParticipantsListProps = {
  participants: Participant[];
};

export function ParticipantsList({
  participants,
}: ParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No participants yet"
        description="Travelers will appear here once this trip has participant data."
        className="min-h-80"
      />
    );
  }

  return (
    <section className="grid gap-5 md:grid-cols-2">
      {participants.map((participant) => (
        <ParticipantCard key={participant.id} participant={participant} />
      ))}
    </section>
  );
}
