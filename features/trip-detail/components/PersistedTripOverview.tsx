import { DatabaseZap } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { PersistedImportantInfoCard } from "@/features/trip-detail/components/PersistedImportantInfoCard";
import type { TripImportantInfo } from "@/features/trip-detail/types/important-info";
import { TravelLinksCard } from "@/features/travel-links";
import type { PersistedTravelLink } from "@/features/travel-links/types/travel-link";

type PersistedTripOverviewProps = {
  tripId: string;
  importantInfo: TripImportantInfo | null;
  importantInfoError?: string;
  travelLinks: PersistedTravelLink[];
  travelLinksError?: string;
  canEditTrip: boolean;
};

export function PersistedTripOverview({
  tripId,
  importantInfo,
  importantInfoError,
  travelLinks,
  travelLinksError,
  canEditTrip,
}: PersistedTripOverviewProps) {
  return (
    <div className="space-y-6">
      <EmptyState
        icon={DatabaseZap}
        title="Your trip is saved"
        description="Use this overview for the core trip context, then jump into Places, Plan, Reservations, Budget, Packing, and People when you need detail."
        className="min-h-64"
      />
      <PersistedImportantInfoCard
        tripId={tripId}
        importantInfo={importantInfo}
        loadError={importantInfoError}
        canEditTrip={canEditTrip}
      />
      <TravelLinksCard
        tripId={tripId}
        links={travelLinks}
        loadError={travelLinksError}
        canEditTrip={canEditTrip}
      />
    </div>
  );
}
