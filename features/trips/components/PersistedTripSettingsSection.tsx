import { Card, SectionHeader } from "@/components/ui";
import { DeleteTripDangerZone } from "@/features/trips/components/DeleteTripDangerZone";
import { DuplicateTripCard } from "@/features/trips/components/DuplicateTripCard";
import { PublicShareSettingsCard } from "@/features/trips/components/PublicShareSettingsCard";
import { TripSettingsForm } from "@/features/trips/components/TripSettingsForm";
import type { PersistedTrip } from "@/features/trips/types/persisted-trip";

type PersistedTripSettingsSectionProps = {
  trip: PersistedTrip;
  canManageSettings: boolean;
  canDuplicateTrip: boolean;
};

export function PersistedTripSettingsSection({
  trip,
  canManageSettings,
  canDuplicateTrip,
}: PersistedTripSettingsSectionProps) {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Trip settings"
        description="Manage the core details for this saved trip."
        action={canManageSettings ? undefined : (
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted">
            Read-only
          </span>
        )}
      />

      {!canManageSettings ? (
        <Card padding="sm" className="text-sm text-muted">
          Only the trip owner can manage trip settings.
        </Card>
      ) : null}

      <TripSettingsForm trip={trip} canManageSettings={canManageSettings} />
      {canDuplicateTrip ? <DuplicateTripCard trip={trip} /> : null}
      <PublicShareSettingsCard trip={trip} canManageSettings={canManageSettings} />
      {canManageSettings ? <DeleteTripDangerZone trip={trip} /> : null}
    </section>
  );
}
