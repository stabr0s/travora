"use client";

import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui";
import type { PersistedReservation } from "@/features/reservations/types/persisted-reservation";
import {
  buildReservationIcs,
  canExportReservationCalendar,
  getReservationCalendarFilename,
} from "@/features/reservations/utils/ics";

type ReservationCalendarButtonProps = {
  reservation: PersistedReservation;
};

export function ReservationCalendarButton({ reservation }: ReservationCalendarButtonProps) {
  const canExport = canExportReservationCalendar(reservation);

  function handleDownload() {
    const calendar = buildReservationIcs(reservation);
    if (!calendar) return;

    const blob = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getReservationCalendarFilename(reservation);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={handleDownload}
      disabled={!canExport}
      title={canExport ? "Download an .ics file for this reservation." : "Add a date to export."}
    >
      <CalendarPlus className="size-4" />
      {canExport ? "Add to calendar" : "Needs date"}
    </Button>
  );
}
