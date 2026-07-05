import type { Participant } from "@/features/participants/types/participant";

export const mockParticipants: Participant[] = [
  {
    id: "jp-part-1", tripId: "japan-2027", name: "Kamil Nowak", email: "kamil@example.com",
    avatarInitials: "KN", role: "owner", status: "active", joinedAt: "2026-08-12",
    notes: "Trip owner and main itinerary coordinator.",
  },
  {
    id: "jp-part-2", tripId: "japan-2027", name: "Anna Kowalska", email: "anna@example.com",
    avatarInitials: "AK", role: "editor", status: "active", joinedAt: "2026-08-14",
    notes: "Coordinates accommodation and food ideas.",
  },
  {
    id: "jp-part-3", tripId: "japan-2027", name: "Marek Zieliński", email: "marek@example.com",
    avatarInitials: "MZ", role: "editor", status: "pending", notes: "Invitation preview awaiting confirmation.",
  },
  {
    id: "jp-part-4", tripId: "japan-2027", name: "Ola Wiśniewska", email: "ola@example.com",
    avatarInitials: "OW", role: "viewer", status: "invited", notes: "Can review the trip plan once invitations are enabled.",
  },
  {
    id: "si-part-1", tripId: "sicily-2026", name: "Kamil Nowak", email: "kamil@example.com",
    avatarInitials: "KN", role: "owner", status: "active", joinedAt: "2026-02-18",
    notes: "Trip owner and road trip planner.",
  },
  {
    id: "si-part-2", tripId: "sicily-2026", name: "Anna Kowalska", email: "anna@example.com",
    avatarInitials: "AK", role: "editor", status: "active", joinedAt: "2026-02-19",
  },
  {
    id: "mo-part-1", tripId: "monaco-f1-weekend", name: "Kamil Nowak", email: "kamil@example.com",
    avatarInitials: "KN", role: "owner", status: "active", joinedAt: "2025-11-02",
  },
  {
    id: "mo-part-2", tripId: "monaco-f1-weekend", name: "Marek Zieliński", email: "marek@example.com",
    avatarInitials: "MZ", role: "editor", status: "active", joinedAt: "2025-11-04",
    notes: "Manages race tickets and transport plans.",
  },
  {
    id: "mo-part-3", tripId: "monaco-f1-weekend", name: "Ola Wiśniewska", email: "ola@example.com",
    avatarInitials: "OW", role: "viewer", status: "invited", notes: "Invitation preview only.",
  },
  {
    id: "ny-part-1", tripId: "new-york-2026", name: "Kamil Nowak", email: "kamil@example.com",
    avatarInitials: "KN", role: "owner", status: "active", joinedAt: "2026-04-09",
    notes: "Trip owner and reservation coordinator.",
  },
  {
    id: "ny-part-2", tripId: "new-york-2026", name: "Anna Kowalska", email: "anna@example.com",
    avatarInitials: "AK", role: "editor", status: "pending", notes: "Access will activate after invitation support is added.",
  },
];

export function getMockParticipantsByTripId(tripId: string): Participant[] {
  return mockParticipants.filter((participant) => participant.tripId === tripId);
}
