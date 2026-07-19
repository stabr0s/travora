import type { Database } from "@/types/database";

export type TripInviteRole = "viewer" | "editor";
export type TripInviteStatus = "pending" | "accepted" | "revoked" | "expired";

export type PersistedTripInvite =
  Database["public"]["Tables"]["trip_invites"]["Row"];

export type TripInvitePreview = {
  tripTitle: string;
  tripDestination: string | null;
  invitedEmail: string;
  invitedRole: TripInviteRole;
  status: TripInviteStatus;
  expiresAt: string | null;
  isAcceptable: boolean;
};

export type TripInviteAuthState = {
  isSignedIn: boolean;
  email: string | null;
};

export type TripInviteServiceErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_INVITE"
  | "INVALID_TRIP"
  | "INVALID_INPUT"
  | "LOAD_FAILED"
  | "CREATE_FAILED"
  | "UPDATE_FAILED"
  | "OWNER_REQUIRED"
  | "EMAIL_MISMATCH"
  | "ALREADY_USED";

export type TripInviteServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: { code: TripInviteServiceErrorCode; message: string } };

export type TripInviteActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};
