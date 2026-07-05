import type { Reservation } from "@/features/reservations/types/reservation";

export const mockReservations: Reservation[] = [
  {
    id: "jp-res-1", tripId: "japan-2027", type: "flight", title: "Warsaw to Tokyo", provider: "LOT Polish Airlines", reservationNumber: "LOT7J2K", startDate: "2027-03-24T22:50:00", endDate: "2027-03-25T18:30:00", location: "WAW → HND", totalPrice: 2940, currency: "EUR", status: "paid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 735, settled: true }, { name: "Anna", amount: 735, settled: true }, { name: "Marek", amount: 735, settled: false }, { name: "Ola", amount: 735, settled: false }], notes: "Checked baggage included for all travelers.",
  },
  {
    id: "jp-res-2", tripId: "japan-2027", type: "hotel", title: "Shinjuku stay", provider: "Shinjuku Granbell Hotel", reservationNumber: "SGH-48291", startDate: "2027-03-25T15:00:00", endDate: "2027-03-30T11:00:00", location: "Tokyo, Shinjuku", totalPrice: 1680, currency: "EUR", status: "deposit", payer: "Anna",
    participants: [{ name: "Kamil", amount: 420, settled: false }, { name: "Anna", amount: 420, settled: true }, { name: "Marek", amount: 420, settled: false }, { name: "Ola", amount: 420, settled: false }], notes: "Two twin rooms with breakfast.",
  },
  {
    id: "jp-res-3", tripId: "japan-2027", type: "transport", title: "Japan Rail Pass", provider: "JR Group", startDate: "2027-03-30T08:00:00", endDate: "2027-04-06T23:59:00", location: "Nationwide", totalPrice: 1120, currency: "EUR", status: "unpaid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 280, settled: true }, { name: "Anna", amount: 280, settled: false }, { name: "Marek", amount: 280, settled: false }, { name: "Ola", amount: 280, settled: false }],
  },
  {
    id: "si-res-1", tripId: "sicily-2026", type: "flight", title: "Flight to Palermo", provider: "Ryanair", reservationNumber: "RY4P9X", startDate: "2026-09-12T08:05:00", endDate: "2026-09-12T10:40:00", location: "KRK → PMO", totalPrice: 410, currency: "EUR", status: "paid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 205, settled: true }, { name: "Anna", amount: 205, settled: true }],
  },
  {
    id: "si-res-2", tripId: "sicily-2026", type: "car", title: "Sicily road trip car", provider: "Sicily by Car", reservationNumber: "SBC-8827", startDate: "2026-09-12T11:30:00", endDate: "2026-09-21T09:00:00", location: "Palermo Airport", totalPrice: 620, currency: "EUR", status: "unpaid", payer: "Anna",
    participants: [{ name: "Kamil", amount: 310, settled: false }, { name: "Anna", amount: 310, settled: true }], notes: "Compact automatic with full insurance.",
  },
  {
    id: "si-res-3", tripId: "sicily-2026", type: "hotel", title: "Palermo boutique stay", provider: "Palazzo Natoli", reservationNumber: "PN-39012", startDate: "2026-09-12T15:00:00", endDate: "2026-09-15T11:00:00", location: "Palermo", totalPrice: 540, currency: "EUR", status: "deposit", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 270, settled: true }, { name: "Anna", amount: 270, settled: false }],
  },
  {
    id: "mo-res-1", tripId: "monaco-f1-weekend", type: "ticket", title: "Monaco Grand Prix — Grandstand K", provider: "Formula 1", reservationNumber: "F1M-K-442", startDate: "2026-05-24T13:00:00", endDate: "2026-05-24T18:00:00", location: "Circuit de Monaco", totalPrice: 1950, currency: "EUR", status: "paid", payer: "Marek",
    participants: [{ name: "Kamil", amount: 650, settled: true }, { name: "Marek", amount: 650, settled: true }, { name: "Ola", amount: 650, settled: false }],
  },
  {
    id: "mo-res-2", tripId: "monaco-f1-weekend", type: "hotel", title: "Nice Old Town hotel", provider: "Hôtel Rossetti", reservationNumber: "HR-22185", startDate: "2026-05-22T15:00:00", endDate: "2026-05-25T10:00:00", location: "Nice", totalPrice: 960, currency: "EUR", status: "unpaid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 320, settled: true }, { name: "Marek", amount: 320, settled: false }, { name: "Ola", amount: 320, settled: false }],
  },
  {
    id: "mo-res-3", tripId: "monaco-f1-weekend", type: "transport", title: "Nice–Monaco train passes", provider: "TER Sud", startDate: "2026-05-23T08:00:00", endDate: "2026-05-24T23:00:00", location: "French Riviera", totalPrice: 90, currency: "EUR", status: "paid", payer: "Ola",
    participants: [{ name: "Kamil", amount: 30, settled: false }, { name: "Marek", amount: 30, settled: true }, { name: "Ola", amount: 30, settled: true }],
  },
  {
    id: "ny-res-1", tripId: "new-york-2026", type: "flight", title: "Warsaw to New York", provider: "LOT Polish Airlines", reservationNumber: "LOT9NYC", startDate: "2026-12-04T11:10:00", endDate: "2026-12-04T14:20:00", location: "WAW → JFK", totalPrice: 1480, currency: "USD", status: "paid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 740, settled: true }, { name: "Anna", amount: 740, settled: false }],
  },
  {
    id: "ny-res-2", tripId: "new-york-2026", type: "hotel", title: "Midtown Manhattan stay", provider: "Arlo Midtown", reservationNumber: "ARLO-6138", startDate: "2026-12-04T16:00:00", endDate: "2026-12-11T11:00:00", location: "Manhattan", totalPrice: 2240, currency: "USD", status: "deposit", payer: "Anna",
    participants: [{ name: "Kamil", amount: 1120, settled: false }, { name: "Anna", amount: 1120, settled: true }], notes: "City view room; resort fee payable locally.",
  },
  {
    id: "ny-res-3", tripId: "new-york-2026", type: "ticket", title: "Broadway evening", provider: "TodayTix", reservationNumber: "TT-84925", startDate: "2026-12-08T19:30:00", location: "Theatre District", totalPrice: 290, currency: "USD", status: "unpaid", payer: "Kamil",
    participants: [{ name: "Kamil", amount: 145, settled: true }, { name: "Anna", amount: 145, settled: false }],
  },
];

export function getMockReservationsByTripId(tripId: string): Reservation[] {
  return mockReservations.filter((reservation) => reservation.tripId === tripId);
}
