import {
  getMockTripDetail,
  PersistedTripOverview,
  TripDetailScreen,
} from "@/features/trip-detail";
import { getTripById } from "@/features/trips/services/trips-service";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;

  if (getMockTripDetail(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  const persistedTrip = await getTripById(id);

  if (persistedTrip.data) {
    return <PersistedTripOverview trip={persistedTrip.data} />;
  }

  return <TripDetailScreen tripId={id} />;
}
