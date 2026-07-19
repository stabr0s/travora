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
import { useScrollIntoViewOnOpen } from "@/hooks/useScrollIntoViewOnOpen";
import type {
  ParticipantActionState,
  PersistedParticipant,
} from "@/features/participants/types/persisted-participant";
import type { Participant } from "@/features/participants/types/participant";

type PersistedParticipantsSectionProps = {
  tripId: string;
  participants: PersistedParticipant[];
  canManageParticipants: boolean;
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
  canManageParticipants,
  loadError,
}: PersistedParticipantsSectionProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<PersistedParticipant | null>(null);
  const [message, setMessage] = useState<ParticipantActionState | null>(null);
  const [isPending, startTransition] = useTransition();
  const panelRef = useScrollIntoViewOnOpen<HTMLDivElement>(isPanelOpen);
  const canManage = canManageParticipants;
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
        actionLabel="Share trip"
        description="See who can access this trip and how they can collaborate."
      />
      <Card padding="sm" className="text-sm leading-relaxed text-muted">
        {canManage
          ? "Share this trip with existing Travora users. Email invitations and public links will be added later."
          : "Only the trip owner can manage access. You can still see everyone who has access to this trip."}
      </Card>
      {isPanelOpen && canManage ? (
        <div ref={panelRef}>
          <PersistedInviteParticipantPanel
            key={editingParticipant?.memberId || "new"}
            tripId={tripId}
            participant={editingParticipant}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
      ) : null}
      {loadError ? <Card padding="sm" className="text-sm text-error">{loadError}</Card> : !participants.length ? (
        <EmptyState
          icon={Users}
          title="No access records yet"
          description="People with access to this trip will appear here."
        />
      ) : (
        <>
          {message?.message ? <Card padding="sm" className={message.status === "error" ? "text-sm text-error" : "text-sm text-success"}>{message.message}</Card> : null}
          <ParticipantsStats participants={statsParticipants} />
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">People with access</h2>
            <p className="mt-1 text-sm text-muted">Owners manage access; editors and viewers appear here as trip members.</p>
          </div>
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
