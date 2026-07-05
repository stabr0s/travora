export type ReservationType =
  | "flight"
  | "hotel"
  | "car"
  | "ticket"
  | "insurance"
  | "transport"
  | "other";

export type ReservationStatus = "paid" | "deposit" | "unpaid";

export type ReservationFilter =
  | "all"
  | "flights"
  | "hotels"
  | "transport"
  | "tickets"
  | "unpaid";

export type ParticipantSettlement = {
  name: string;
  amount: number;
  settled: boolean;
};

export type Reservation = {
  id: string;
  tripId: string;
  type: ReservationType;
  title: string;
  provider?: string;
  reservationNumber?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  totalPrice: number;
  currency: string;
  status: ReservationStatus;
  payer: string;
  participants: ParticipantSettlement[];
  notes?: string;
};
