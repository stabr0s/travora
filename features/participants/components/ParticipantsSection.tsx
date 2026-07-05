"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { InviteParticipantPanel } from "@/features/participants/components/InviteParticipantPanel";
import { ParticipantsHeader } from "@/features/participants/components/ParticipantsHeader";
import { ParticipantsList } from "@/features/participants/components/ParticipantsList";
import { ParticipantsStats } from "@/features/participants/components/ParticipantsStats";
import { RolesOverviewCard } from "@/features/participants/components/RolesOverviewCard";
import { SharingPreviewCard } from "@/features/participants/components/SharingPreviewCard";
import { getMockParticipantsByTripId } from "@/features/participants/data/mock-participants";

type ParticipantsSectionProps = {
  tripId: string;
};

export function ParticipantsSection({ tripId }: ParticipantsSectionProps) {
  const [isInvitePanelOpen, setIsInvitePanelOpen] = useState(false);
  const participants = getMockParticipantsByTripId(tripId);

  if (participants.length === 0) {
    return (
      <section className="space-y-6">
        <ParticipantsHeader onInvite={() => setIsInvitePanelOpen(true)} />
        {isInvitePanelOpen ? (
          <InviteParticipantPanel onClose={() => setIsInvitePanelOpen(false)} />
        ) : null}
        <EmptyState
          icon={Users}
          title="No participants yet"
          description="Travelers and role previews will appear here once this trip has participant data."
          className="min-h-96"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <ParticipantsHeader onInvite={() => setIsInvitePanelOpen(true)} />

      {isInvitePanelOpen ? (
        <InviteParticipantPanel onClose={() => setIsInvitePanelOpen(false)} />
      ) : null}

      <ParticipantsStats participants={participants} />
      <ParticipantsList participants={participants} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RolesOverviewCard />
        <SharingPreviewCard tripId={tripId} />
      </div>
    </section>
  );
}
