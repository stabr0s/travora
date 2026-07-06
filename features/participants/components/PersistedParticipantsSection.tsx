"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";

import { Card, EmptyState } from "@/components/ui";
import { removeParticipantAction } from "@/features/participants/actions/participant-actions";
import { ParticipantsHeader } from "@/features/participants/components/ParticipantsHeader";
import { ParticipantsStats } from "@/features/participants/components/ParticipantsStats";
import { PersistedInviteParticipantPanel } from "@/features/participants/components/PersistedInviteParticipantPanel";
import { PersistedParticipantCard } from "@/features/participants/components/PersistedParticipantCard";
import { RolesOverviewCard } from "@/features/participants/components/RolesOverviewCard";
import type {
  ParticipantActionState,
  PersistedParticipant,
} from "@/features/participants/types/persisted-participant";
import type {
  Participant,
  ParticipantRole,
} from "@/features/participants/types/participant";

type PersistedParticipantsSectionProps = {
  tripId: string;
  participants: PersistedParticipant[];
  currentUserRole: ParticipantRole | null;
  loadError?: string;
};

function initials(participant: PersistedParticipant) {
  const source = participant.fullName || participant.email || "Trip member";
  return source.split(/[\s@]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function toParticipant(participant: PersistedParticipant): Participant {
  return {
    id: participant.memberId,
    tripId: participant.tripId,
    name: participant.fullName || participant.email || "Trip member",
    email: participant.email || undefined,
    avatarInitials: initials(participant),
    role: participant.role,
    status: participant.status,
    joinedAt: participant.createdAt || undefined,
  };
}

export function PersistedParticipantsSection({
  tripId,
  participants,
  currentUserRole,
  loadError,
}: PersistedParticipantsSectionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<PersistedParticipant | null>(null);
  const [message, setMessage] = useState<ParticipantActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const canManage = currentUserRole === "owner";
  const statsParticipants = participants.map(toParticipant);

  function openAddPanel() {
    setEditingParticipant(null);
    setIsPanelOpen(true);
  }

  function handleRemove(participant: PersistedParticipant) {
    const name = participant.fullName || participant.email || "this participant";
    if (!window.confirm(`Remove ${name} from this trip? This cannot be undone.`)) return;
    startTransition(async () => {
      setMessage(await removeParticipantAction(tripId, participant.memberId));
    });
  }

  return (
    <section className="space-y-6">
      <ParticipantsHeader
        onInvite={canManage ? openAddPanel : undefined}
        actionLabel="Add participant"
        description="Manage registered travelers and their access to this trip."
      />
      {isPanelOpen && canManage ? (
        <PersistedInviteParticipantPanel
          key={editingParticipant?.memberId || "new"}
          tripId={tripId}
          participant={editingParticipant}
          onClose={() => setIsPanelOpen(false)}
        />
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !participants.length ? (
        <EmptyState
          icon={Users}
          title="No participants available"
          description="The trip owner will normally appear here after the trip is created."
        />
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          {!canManage ? (
            <Card padding="sm" className="text-sm text-muted">Participant management is available only to the trip owner. Your access is read-only.</Card>
          ) : null}
          <ParticipantsStats participants={statsParticipants} />
          <div className="grid gap-5 lg:grid-cols-2">
            {participants.map((participant) => (
              <PersistedParticipantCard
                key={participant.memberId}
                participant={participant}
                canManage={canManage}
                isPending={isPending}
                onEdit={(selected) => { setEditingParticipant(selected); setIsPanelOpen(true); }}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </>
      )}
      {!loadError ? <RolesOverviewCard /> : null}
    </section>
  );
}
