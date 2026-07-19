import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TripSummaryPrintButton } from "@/features/trip-summary/components/TripSummaryPrintButton";
import { TripSummarySection } from "@/features/trip-summary/components/TripSummarySection";
import type { TripSummaryData } from "@/features/trip-summary/types/trip-summary";

type TripSummaryScreenProps = {
  tripId: string;
  summary: TripSummaryData;
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return "Dates not set";
}

function emptyCopy(label: string) {
  return <p className="text-sm text-slate-500">No {label} added yet.</p>;
}

export function TripSummaryScreen({ tripId, summary }: TripSummaryScreenProps) {
  const { overview } = summary;

  return (
    <main className="mx-auto max-w-4xl space-y-6 bg-white text-slate-900 print:max-w-none print:space-y-4">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
          <ArrowLeft className="size-4" />
          Back to trip
        </Link>
        <TripSummaryPrintButton />
      </div>

      <header className="rounded-3xl bg-slate-950 p-6 text-white print:rounded-none print:bg-white print:p-0 print:text-slate-950">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300 print:text-slate-500">
          Travora trip summary
        </p>
        <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-5xl print:text-3xl">
          {overview.title}
        </h1>
        <div className="mt-5 grid gap-3 text-sm text-slate-200 sm:grid-cols-2 print:text-slate-700">
          <p><span className="font-medium">Destination:</span> {overview.destination}</p>
          <p><span className="font-medium">Dates:</span> {formatDateRange(overview.startDate, overview.endDate)}</p>
          <p><span className="font-medium">Status:</span> {overview.status}</p>
          <p><span className="font-medium">Currency:</span> {overview.currency || "Not set"}</p>
        </div>
        {overview.description ? (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-200 print:text-slate-700">
            {overview.description}
          </p>
        ) : null}
      </header>

      {overview.importantInfo ? (
        <TripSummarySection title="Important Info">
          <p className="whitespace-pre-line break-words text-sm leading-relaxed text-slate-700">
            {overview.importantInfo}
          </p>
        </TripSummarySection>
      ) : null}

      <TripSummarySection title="Planner">
        {summary.planner.length ? (
          <div className="space-y-5">
            {summary.planner.map((group) => (
              <div key={group.label} className="break-inside-avoid">
                <h3 className="font-medium text-slate-950">{group.label}</h3>
                <div className="mt-2 space-y-2">
                  {group.items.map((item, index) => (
                    <div key={`${group.label}-${item.title}-${index}`} className="rounded-xl bg-slate-50 p-3 text-sm print:border print:border-slate-200 print:bg-white">
                      <p className="font-medium text-slate-950">{item.time ? `${item.time} · ` : ""}{item.title}</p>
                      <p className="mt-1 text-slate-600">{[item.type, item.location].filter(Boolean).join(" · ")}</p>
                      {item.notes ? <p className="mt-1 text-slate-600">{item.notes}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : emptyCopy("planner items")}
      </TripSummarySection>

      <TripSummarySection title="Places">
        {summary.places.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.places.map((place) => (
              <div key={`${place.title}-${place.location}`} className="break-inside-avoid rounded-xl bg-slate-50 p-3 text-sm print:border print:border-slate-200 print:bg-white">
                <p className="font-medium text-slate-950">{place.title}</p>
                <p className="mt-1 text-slate-600">{[place.category, place.location].filter(Boolean).join(" · ")}</p>
                {place.website ? <p className="mt-1 break-words text-slate-600">{place.website}</p> : null}
                {place.notes ? <p className="mt-1 text-slate-600">{place.notes}</p> : null}
              </div>
            ))}
          </div>
        ) : emptyCopy("places")}
      </TripSummarySection>

      <TripSummarySection title="Reservations">
        {summary.reservations.length ? (
          <div className="space-y-3">
            {summary.reservations.map((reservation) => (
              <div key={`${reservation.title}-${reservation.dates}`} className="break-inside-avoid rounded-xl bg-slate-50 p-3 text-sm print:border print:border-slate-200 print:bg-white">
                <p className="font-medium text-slate-950">{reservation.title}</p>
                <p className="mt-1 text-slate-600">{[reservation.type, reservation.dates, reservation.status].filter(Boolean).join(" · ")}</p>
                <p className="mt-1 text-slate-600">{[reservation.provider, reservation.reference, reservation.price].filter(Boolean).join(" · ")}</p>
                {reservation.notes ? <p className="mt-1 text-slate-600">{reservation.notes}</p> : null}
              </div>
            ))}
          </div>
        ) : emptyCopy("reservations")}
      </TripSummarySection>

      <TripSummarySection title="Travel Links">
        {summary.travelLinks.trip.length || summary.travelLinks.reservations.length ? (
          <div className="space-y-3">
            {[...summary.travelLinks.trip, ...summary.travelLinks.reservations].map((link) => (
              <div key={`${link.title}-${link.url}`} className="break-inside-avoid rounded-xl bg-slate-50 p-3 text-sm print:border print:border-slate-200 print:bg-white">
                <p className="font-medium text-slate-950">{link.title}</p>
                <p className="mt-1 text-slate-600">
                  {[link.type, link.reservationTitle ? `Reservation: ${link.reservationTitle}` : null].filter(Boolean).join(" · ")}
                </p>
                <a className="mt-1 block break-all text-slate-600 underline underline-offset-2" href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
                {link.note ? <p className="mt-1 text-slate-600">{link.note}</p> : null}
              </div>
            ))}
          </div>
        ) : emptyCopy("travel links")}
      </TripSummarySection>

      <TripSummarySection title="Budget">
        <div className="space-y-4">
          {summary.budget.totals.length ? (
            <div className="flex flex-wrap gap-2">
              {summary.budget.totals.map((total) => (
                <span key={total.currency} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">
                  {total.amount.toFixed(2)} {total.currency}
                </span>
              ))}
            </div>
          ) : emptyCopy("budget totals")}
          {summary.budget.expenses.length ? (
            <ul className="space-y-2 text-sm">
              {summary.budget.expenses.map((expense) => (
                <li key={`${expense.title}-${expense.amount}`} className="flex flex-col gap-1 rounded-xl bg-slate-50 p-3 sm:flex-row sm:justify-between print:border print:border-slate-200 print:bg-white">
                  <span>{expense.title} {expense.category ? `· ${expense.category}` : ""} {expense.status ? `· ${expense.status}` : ""}</span>
                  <span className="font-medium">{expense.amount}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </TripSummarySection>

      <TripSummarySection title="Packing">
        <p className="text-sm text-slate-600">
          {summary.packing.total} total · {summary.packing.packed} packed · {summary.packing.unpacked} unpacked
        </p>
        {summary.packing.groups.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {summary.packing.groups.map((group) => (
              <div key={group.category} className="break-inside-avoid rounded-xl bg-slate-50 p-3 text-sm print:border print:border-slate-200 print:bg-white">
                <h3 className="font-medium capitalize text-slate-950">{group.category}</h3>
                <ul className="mt-2 space-y-1 text-slate-600">
                  {group.items.map((item) => <li key={item.name}>{item.isPacked ? "✓" : "○"} {item.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </TripSummarySection>

      <TripSummarySection title="Participants">
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>Total participants: {summary.participants.total}</p>
          <p>Roles: {summary.participants.owners} owner · {summary.participants.editors} editor · {summary.participants.viewers} viewer</p>
          <p>Status: {summary.participants.active} active · {summary.participants.pending} pending · {summary.participants.invited} invited</p>
          <p className="text-slate-500">Participant emails are intentionally omitted from print summary.</p>
        </div>
      </TripSummarySection>
    </main>
  );
}
