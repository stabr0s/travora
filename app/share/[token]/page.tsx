import { notFound } from "next/navigation";

import { PublicShareScreen } from "@/features/public-share/components/PublicShareScreen";
import { getPublicTripShare } from "@/features/public-share/services/public-share-service";

type PublicSharePageProps = {
  params: Promise<{ token: string }>;
};

export default async function PublicSharePage({ params }: PublicSharePageProps) {
  const { token } = await params;
  const result = await getPublicTripShare(token);

  if (!result.data) notFound();

  return <PublicShareScreen share={result.data} />;
}
