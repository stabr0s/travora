import {
  getMockTripDetail,
  PersistedTripDetailScreen,
  TripDetailScreen,
} from "@/features/trip-detail";
import { mapPersistedPlaceToPlace } from "@/features/places/data/place-mappers";
import { getPlacesForTrip } from "@/features/places/services/places-service";
import { getTripById } from "@/features/trips/services/trips-service";
import { isUuid } from "@/lib/validation/is-uuid";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;

  if (getMockTripDetail(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  if (!isUuid(id)) {
    return <TripDetailScreen tripId={id} />;
  }

  const persistedTrip = await getTripById(id);

  if (persistedTrip.data) {
    const persistedPlaces = await getPlacesForTrip(id);

    return (
      <PersistedTripDetailScreen
        trip={persistedTrip.data}
        places={(persistedPlaces.data || []).map(mapPersistedPlaceToPlace)}
        placesError={persistedPlaces.error?.message}
      />
    );
  }

  return <TripDetailScreen tripId={id} />;
}
