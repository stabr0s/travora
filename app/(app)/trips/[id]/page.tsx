import { TripDetailScreen } from "@/features/trip-detail";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;

  return <TripDetailScreen tripId={id} />;
}
