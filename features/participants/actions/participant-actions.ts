"use server";

import { revalidatePath } from "next/cache";

import {
  addParticipant,
  removeParticipant,
  updateParticipant,
} from "@/features/participants/services/participants-service";
import type { ParticipantActionState } from "@/features/participants/types/persisted-participant";
import type {
  ParticipantRole,
  ParticipantStatus,
} from "@/features/participants/types/participant";
import { isUuid } from "@/lib/validation/is-uuid";

const roles: Array<Exclude<ParticipantRole, "owner">> = ["editor", "viewer"];
const statuses: ParticipantStatus[] = ["active", "invited", "pending"];

function readField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function addParticipantAction(
  _previousState: ParticipantActionState,
  formData: FormData,
): Promise<ParticipantActionState> {
  const tripId = readField(formData, "tripId");
  const email = readField(formData, "email").toLowerCase();
  const role = readField(formData, "role") as Exclude<ParticipantRole, "owner">;
  const status = readField(formData, "status") as ParticipantStatus;

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { status: "error", message: "Enter a valid email address." };
  if (!roles.includes(role)) return { status: "error", message: "Choose Editor or Viewer." };
  if (!statuses.includes(status)) return { status: "error", message: "Choose a valid participant status." };

  const result = await addParticipant({ tripId, email, role, status });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Participant added to this trip." };
}

export async function updateParticipantAction(
  _previousState: ParticipantActionState,
  formData: FormData,
): Promise<ParticipantActionState> {
  const tripId = readField(formData, "tripId");
  const memberId = readField(formData, "memberId");
  const role = readField(formData, "role") as Exclude<ParticipantRole, "owner">;
  const status = readField(formData, "status") as ParticipantStatus;

  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(memberId)) return { status: "error", message: "This participant is not available." };
  if (!roles.includes(role)) return { status: "error", message: "Choose Editor or Viewer." };
  if (!statuses.includes(status)) return { status: "error", message: "Choose a valid participant status." };

  const result = await updateParticipant({ tripId, memberId, role, status });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Participant updated." };
}

export async function removeParticipantAction(
  tripId: string,
  memberId: string,
): Promise<ParticipantActionState> {
  if (!isUuid(tripId)) return { status: "error", message: "This saved trip is not available." };
  if (!isUuid(memberId)) return { status: "error", message: "This participant is not available." };

  const result = await removeParticipant({ tripId, memberId });
  if (result.error) return { status: "error", message: result.error.message };
  revalidatePath(`/trips/${tripId}`);
  return { status: "success", message: "Participant removed." };
}
