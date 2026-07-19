import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";

const oneHourInMs = 60 * 60 * 1000;

function toIcsTimestamp(value: Date) {
  const pad = (part: number) => String(part).padStart(2, "0");
  return [
    value.getUTCFullYear(),
    pad(value.getUTCMonth() + 1),
    pad(value.getUTCDate()),
    "T",
    pad(value.getUTCHours()),
    pad(value.getUTCMinutes()),
    pad(value.getUTCSeconds()),
    "Z",
  ].join("");
}

function toValidDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function canExportReservationCalendar(reservation: PersistedReservation) {
  return Boolean(toValidDate(reservation.start_date));
}

export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function formatPrice(reservation: PersistedReservation) {
  if (reservation.total_price === null) return null;
  const currency = reservation.currency ? ` ${reservation.currency.toUpperCase()}` : "";
  return `${reservation.total_price.toFixed(2)}${currency}`;
}

function buildDescription(reservation: PersistedReservation) {
  return [
    reservation.provider ? `Provider: ${reservation.provider}` : null,
    reservation.reservation_number ? `Reference: ${reservation.reservation_number}` : null,
    reservation.status ? `Status: ${reservation.status}` : null,
    formatPrice(reservation) ? `Price: ${formatPrice(reservation)}` : null,
    reservation.payer_name ? `Paid by: ${reservation.payer_name}` : null,
    reservation.notes ? `Notes: ${reservation.notes}` : null,
  ].filter(Boolean).join("\n");
}

function safeFilePart(value: string) {
  const slug = value.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "reservation";
}

export function getReservationCalendarFilename(reservation: PersistedReservation) {
  const startDate = toValidDate(reservation.start_date);
  const datePart = startDate ? toIcsTimestamp(startDate).slice(0, 8) : "undated";
  return `${safeFilePart(reservation.title)}-${datePart}.ics`;
}

export function buildReservationIcs(reservation: PersistedReservation) {
  const start = toValidDate(reservation.start_date);
  if (!start) return null;
  const maybeEnd = toValidDate(reservation.end_date);
  const end = maybeEnd && maybeEnd.getTime() > start.getTime()
    ? maybeEnd
    : new Date(start.getTime() + oneHourInMs);
  const description = buildDescription(reservation);
  const location = reservation.location || reservation.provider || "";
  const summary = reservation.title;
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//Travora//Selected Reservation Calendar Export//EN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(`${reservation.id}@travora`)}`,
    `DTSTAMP:${toIcsTimestamp(now)}`,
    `DTSTART:${toIcsTimestamp(start)}`,
    `DTEND:${toIcsTimestamp(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    description ? `DESCRIPTION:${escapeIcsText(description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `${lines.join("\r\n")}\r\n`;
}
