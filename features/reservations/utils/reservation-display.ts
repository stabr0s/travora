import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";

type BadgeVariant = "success" | "warning" | "error" | "outline";

export function getReservationTypeLabel(type: string | null) {
  const normalized = (type || "other").toLowerCase();
  const labels: Record<string, string> = {
    flight: "Flight",
    hotel: "Hotel / stay",
    accommodation: "Hotel / stay",
    transport: "Train / bus",
    train: "Train / bus",
    bus: "Train / bus",
    car: "Car rental",
    ticket: "Ticket / activity",
    activity: "Ticket / activity",
    insurance: "Insurance",
    other: "Other",
  };

  return labels[normalized] || normalized.replace(/[-_]/g, " ");
}

export function getReservationStatusDetails(status: PersistedReservation["status"]): {
  label: string;
  variant: BadgeVariant;
} {
  if (status === "paid") return { label: "Paid", variant: "success" };
  if (status === "deposit") return { label: "Deposit", variant: "warning" };
  if (status === "unpaid") return { label: "To pay", variant: "outline" };
  return { label: "Status not set", variant: "outline" };
}

export function sortPersistedReservations(reservations: PersistedReservation[]) {
  return [...reservations].sort((first, second) => {
    const firstStart = first.start_date ? Date.parse(first.start_date) : null;
    const secondStart = second.start_date ? Date.parse(second.start_date) : null;

    if (firstStart !== null && secondStart !== null && firstStart !== secondStart) {
      return firstStart - secondStart;
    }
    if (firstStart !== null && secondStart === null) return -1;
    if (firstStart === null && secondStart !== null) return 1;

    const firstCreated = first.created_at ? Date.parse(first.created_at) : 0;
    const secondCreated = second.created_at ? Date.parse(second.created_at) : 0;
    return secondCreated - firstCreated;
  });
}

export function formatReservationDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatReservationDateRange(reservation: PersistedReservation) {
  const start = formatReservationDate(reservation.start_date);
  const end = formatReservationDate(reservation.end_date);
  if (start && end) return `${start} – ${end}`;
  return start || "Date not set";
}

export function formatReservationCurrency(amount: number, currency: string | null) {
  const normalizedCurrency = (currency || "").toUpperCase();
  if (!normalizedCurrency) return amount.toFixed(2);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${normalizedCurrency}`;
  }
}
