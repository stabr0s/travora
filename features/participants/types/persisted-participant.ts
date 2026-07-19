import type {
  ParticipantRole,
  ParticipantStatus,
} from "@/features/participants/types/participant";

export type PersistedParticipant = {
  memberId: string;
  tripId: string;
  userId: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  createdAt: string | null;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

export type AddParticipantInput = {
  tripId: string;
  email: string;
  role: Exclude<ParticipantRole, "owner">;
  status: ParticipantStatus;
};

export type UpdateParticipantInput = {
  tripId: string;
  memberId: string;
  role: Exclude<ParticipantRole, "owner">;
  status: ParticipantStatus;
};

export type RemoveParticipantInput = { tripId: string; memberId: string };

export type CurrentUserTripAccess = {
  userId: string | null;
  role: ParticipantRole | null;
};

export type ParticipantsServiceResult<T> =
  | { data: T; error: null }
  | {
      data: null;
      error: {
        code:
          | "AUTH_REQUIRED"
          | "INVALID_TRIP"
          | "INVALID_RECORD"
          | "LOAD_FAILED"
          | "CREATE_FAILED"
          | "UPDATE_FAILED"
          | "DELETE_FAILED"
          | "OWNER_REQUIRED";
        message: string;
      };
    };

export type ParticipantActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};
