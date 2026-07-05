export type ParticipantRole = "owner" | "editor" | "viewer";

export type ParticipantStatus = "active" | "invited" | "pending";

export type Participant = {
  id: string;
  tripId: string;
  name: string;
  email?: string;
  avatarInitials: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  joinedAt?: string;
  notes?: string;
};
