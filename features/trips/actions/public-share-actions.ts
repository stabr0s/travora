"use server";

import { revalidatePath } from "next/cache";

import {
  updatePublicShare,
  updatePublicShareSections,
} from "@/features/trips/services/public-share-service";
import type { PublicShareSections } from "@/features/public-share/types/public-share";
import type { TripSettingsActionState } from "@/features/trips/types/persisted-trip";

export async function enablePublicShareAction(
  tripId: string,
): Promise<TripSettingsActionState> {
  const result = await updatePublicShare(tripId, "enable");
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Public share link enabled." };
}

export async function disablePublicShareAction(
  tripId: string,
): Promise<TripSettingsActionState> {
  const result = await updatePublicShare(tripId, "disable");
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Public share link disabled." };
}

export async function regeneratePublicShareAction(
  tripId: string,
): Promise<TripSettingsActionState> {
  const result = await updatePublicShare(tripId, "regenerate");
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Public share link regenerated." };
}

export async function updatePublicShareSectionsAction(
  tripId: string,
  sections: Partial<PublicShareSections>,
): Promise<TripSettingsActionState> {
  const result = await updatePublicShareSections(tripId, sections);
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Public share sections updated." };
}
