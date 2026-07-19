"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { acceptTripInvite } from "@/features/invites/services/invite-token-service";
import {
  createTripInvite,
  revokeTripInvite,
} from "@/features/invites/services/trip-invites-service";
import type {
  TripInviteActionState,
  TripInviteRole,
} from "@/features/invites/types/trip-invite";
import { isUuid } from "@/lib/validation/is-uuid";

const roles: TripInviteRole[] = ["viewer", "editor"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createTripInviteAction(
  _previousState: TripInviteActionState,
  formData: FormData,
): Promise<TripInviteActionState> {
  const tripId = readField(formData, "tripId");
  const email = readField(formData, "email").toLowerCase();
  const role = readField(formData, "role") as TripInviteRole;

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!roles.includes(role)) return { status: "error", message: "Choose Viewer or Editor." };

  const result = await createTripInvite({ tripId, email, role });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Invite link created. Copy it and send it manually." };
}

export async function revokeTripInviteAction(
  tripId: string,
  inviteId: string,
): Promise<TripInviteActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(inviteId)) return { status: "error", message: "This invite is not available." };

  const result = await revokeTripInvite({ tripId, inviteId });
  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Invite revoked." };
}

export async function acceptTripInviteAction(
  _previousState: TripInviteActionState,
  formData: FormData,
): Promise<TripInviteActionState> {
  const token = readField(formData, "token");
  const result = await acceptTripInvite(token);

  if (result.error) return { status: "error", message: result.error.message };

  revalidatePath(`/trips/${result.data.tripId}`);
  redirect(`/trips/${result.data.tripId}`);
}
