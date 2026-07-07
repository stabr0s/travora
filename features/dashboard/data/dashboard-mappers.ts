import type { DashboardData, NextTrip } from "@/features/dashboard/types/dashboard";
import { mapPersistedTripToTrip } from "@/features/trips/data/trip-mappers";
import type { PersistedTripCard } from "@/features/trips/types/persisted-trip";
import type { Trip } from "@/features/trips/types/trip";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDateLabel(trip: Trip) {
  if (trip.startDate && trip.endDate) {
    return `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`;
  }
  if (trip.startDate) return `From ${formatDate(trip.startDate)}`;
  if (trip.endDate) return `Until ${formatDate(trip.endDate)}`;
  return "Dates not set";
}

function getDaysUntil(startDate: string | null) {
  if (!startDate) return null;
  const today = new Date();
  const start = new Date(`${startDate}T00:00:00Z`);
  const diff = start.getTime() - Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function mapNextTrip(trip: Trip): NextTrip {
  return {
    id: trip.id,
    title: trip.title,
    country: trip.country,
    startDate: trip.startDate || new Date().toISOString().slice(0, 10),
    endDate: trip.endDate,
    participants: trip.participants,
    costPerPerson: trip.costPerPerson,
    currency: trip.currency,
    progress: trip.progress,
    daysUntil: getDaysUntil(trip.startDate),
    placesCount: trip.placesCount,
    coverGradient: trip.coverGradient,
  };
}

export function mapPersistedTripCardsToDashboard(
  cards: PersistedTripCard[],
): DashboardData {
  const trips = cards.map((card) => mapPersistedTripToTrip(card.trip, card.role));
  const upcomingTrips = trips
    .filter((trip) => trip.startDate && trip.status !== "archived")
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  const recentTrips = [...trips].sort((a, b) =>
    String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")),
  );
  const sharedTrips = trips.filter((trip) => trip.role && trip.role !== "owner").length;

  return {
    user: { name: "traveler" },
    nextTrip: upcomingTrips[0] ? mapNextTrip(upcomingTrips[0]) : null,
    stats: [
      { id: "total", label: "Saved trips", value: String(trips.length), change: "Available from your account" },
      { id: "planning", label: "Planning", value: String(trips.filter((trip) => trip.status === "planning").length) },
      { id: "upcoming", label: "Upcoming", value: String(trips.filter((trip) => trip.status === "upcoming").length) },
      { id: "shared", label: "Shared with you", value: String(sharedTrips), change: "Editor or viewer access" },
    ],
    quickActions: [
      { id: "new-trip", label: "Create trip", description: "Start a new itinerary", href: "/trips/new", icon: "plus" },
      { id: "all-trips", label: "View all trips", description: "Open your trip list", href: "/trips", icon: "calendar" },
      { id: "packing", label: "Packing", description: "Review packing lists", href: "/packing", icon: "luggage" },
      { id: "budget", label: "Budget", description: "Check trip expenses", href: "/budget", icon: "wallet" },
    ],
    recentTrips: recentTrips.slice(0, 5).map((trip) => ({
      id: trip.id,
      title: trip.title,
      country: trip.country,
      status: trip.status,
      role: trip.role,
      dateLabel: formatDateLabel(trip),
    })),
    recentPlaces: [],
    upcomingReservations: [],
    isPersisted: true,
  };
}
