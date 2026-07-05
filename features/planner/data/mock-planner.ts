import type { TripPlanner } from "@/features/planner/types/planner";

export const mockPlanners: Record<string, TripPlanner> = {
  "japan-2027": {
    tripId: "japan-2027",
    days: [
      {
        id: "jp-day-1", dayNumber: 1, date: "2027-03-25", city: "Tokyo", mode: "scheduled",
        baseLocation: "Shinjuku", loadPercentage: 82,
        items: [
          { id: "jp-1-1", type: "flight", title: "Arrival at Haneda", location: "Haneda Airport", startTime: "08:15", endTime: "08:15", isFixed: true, category: "travel", notes: "Collect luggage and activate transit cards." },
          { id: "jp-1-2", type: "transport", title: "Airport train to Shinjuku", location: "Haneda → Shinjuku", startTime: "09:30", durationMinutes: 50, isFixed: false, category: "transfer", cost: 1300, currency: "JPY" },
          { id: "jp-1-3", type: "hotel", title: "Hotel check-in", location: "Shinjuku", startTime: "15:00", durationMinutes: 30, isFixed: true, category: "stay" },
          { id: "jp-1-4", type: "restaurant", title: "First ramen dinner", location: "Omoide Yokocho", startTime: "19:00", durationMinutes: 90, isFixed: false, category: "food" },
        ],
      },
      {
        id: "jp-day-2", dayNumber: 2, date: "2027-03-26", city: "Tokyo", mode: "ordered",
        baseLocation: "Shinjuku", loadPercentage: 66,
        items: [
          { id: "jp-2-1", type: "attraction", title: "Sensō-ji Temple", location: "Asakusa", durationMinutes: 120, isFixed: false, category: "sightseeing", notes: "Start early before Nakamise Street gets busy." },
          { id: "jp-2-2", type: "restaurant", title: "Lunch near Kappabashi", location: "Taito", durationMinutes: 75, isFixed: false, category: "food" },
          { id: "jp-2-3", type: "activity", title: "Ueno and Yanaka walk", location: "Ueno", durationMinutes: 180, isFixed: false, category: "leisure" },
        ],
      },
      { id: "jp-day-3", dayNumber: 3, date: "2027-03-27", city: "Tokyo", mode: "ordered", baseLocation: "Shinjuku", loadPercentage: 0, items: [] },
    ],
  },
  "sicily-2026": {
    tripId: "sicily-2026",
    days: [
      {
        id: "si-day-1", dayNumber: 1, date: "2026-09-12", city: "Palermo", mode: "scheduled",
        baseLocation: "Kalsa", loadPercentage: 70,
        items: [
          { id: "si-1-1", type: "flight", title: "Flight to Palermo", location: "Palermo Airport", startTime: "11:40", endTime: "11:40", isFixed: true, category: "travel" },
          { id: "si-1-2", type: "hotel", title: "Check in at Kalsa", location: "Palermo", startTime: "15:00", durationMinutes: 30, isFixed: true, category: "stay" },
          { id: "si-1-3", type: "restaurant", title: "Dinner at Osteria Ballarò", location: "Palermo", startTime: "20:00", durationMinutes: 120, isFixed: true, category: "food", cost: 45, currency: "EUR" },
        ],
      },
      {
        id: "si-day-2", dayNumber: 2, date: "2026-09-13", city: "Palermo", mode: "ordered",
        baseLocation: "Kalsa", loadPercentage: 58,
        items: [
          { id: "si-2-1", type: "attraction", title: "Palermo Cathedral", location: "Centro Storico", durationMinutes: 90, isFixed: false, category: "sightseeing" },
          { id: "si-2-2", type: "restaurant", title: "Ballarò market lunch", location: "Ballarò", durationMinutes: 90, isFixed: false, category: "food" },
          { id: "si-2-3", type: "free-time", title: "Evening passeggiata", location: "Quattro Canti", durationMinutes: 120, isFixed: false, category: "leisure" },
        ],
      },
      { id: "si-day-3", dayNumber: 3, date: "2026-09-14", city: "Cefalù", mode: "ordered", loadPercentage: 35, items: [{ id: "si-3-1", type: "transport", title: "Drive to Cefalù", location: "Palermo → Cefalù", durationMinutes: 75, isFixed: false, category: "transfer" }] },
    ],
  },
  "monaco-f1-weekend": {
    tripId: "monaco-f1-weekend",
    days: [
      {
        id: "mo-day-1", dayNumber: 1, date: "2026-05-22", city: "Nice", mode: "scheduled",
        baseLocation: "Nice Old Town", loadPercentage: 64,
        items: [
          { id: "mo-1-1", type: "flight", title: "Arrival in Nice", location: "Nice Airport", startTime: "10:10", isFixed: true, category: "travel" },
          { id: "mo-1-2", type: "transport", title: "Transfer to hotel", location: "Nice Airport", startTime: "11:15", durationMinutes: 35, isFixed: true, category: "transfer" },
          { id: "mo-1-3", type: "activity", title: "Old Town evening", location: "Vieux Nice", startTime: "18:00", durationMinutes: 180, isFixed: false, category: "leisure" },
        ],
      },
      {
        id: "mo-day-2", dayNumber: 2, date: "2026-05-23", city: "Monaco", mode: "ordered",
        loadPercentage: 76,
        items: [
          { id: "mo-2-1", type: "transport", title: "Train to Monaco", location: "Nice-Ville", durationMinutes: 25, isFixed: true, category: "transfer" },
          { id: "mo-2-2", type: "attraction", title: "Qualifying session", location: "Circuit de Monaco", durationMinutes: 180, isFixed: true, category: "sightseeing" },
          { id: "mo-2-3", type: "restaurant", title: "Harbor dinner", location: "Port Hercule", durationMinutes: 120, isFixed: false, category: "food" },
        ],
      },
      { id: "mo-day-3", dayNumber: 3, date: "2026-05-24", city: "Monaco", mode: "scheduled", loadPercentage: 94, items: [{ id: "mo-3-1", type: "activity", title: "Monaco Grand Prix", location: "Grandstand K", startTime: "15:00", endTime: "17:00", durationMinutes: 120, isFixed: true, category: "sightseeing", cost: 650, currency: "EUR" }] },
    ],
  },
  "new-york-2026": {
    tripId: "new-york-2026",
    days: [
      {
        id: "ny-day-1", dayNumber: 1, date: "2026-12-04", city: "New York", mode: "scheduled",
        baseLocation: "Midtown", loadPercentage: 68,
        items: [
          { id: "ny-1-1", type: "flight", title: "Arrival at JFK", location: "JFK Airport", startTime: "14:20", isFixed: true, category: "travel" },
          { id: "ny-1-2", type: "transport", title: "AirTrain and subway", location: "JFK → Midtown", startTime: "15:30", durationMinutes: 75, isFixed: false, category: "transfer" },
          { id: "ny-1-3", type: "hotel", title: "Hotel check-in", location: "Midtown", startTime: "17:30", durationMinutes: 30, isFixed: true, category: "stay" },
        ],
      },
      {
        id: "ny-day-2", dayNumber: 2, date: "2026-12-05", city: "New York", mode: "ordered",
        baseLocation: "Midtown", loadPercentage: 72,
        items: [
          { id: "ny-2-1", type: "attraction", title: "Central Park winter walk", location: "Central Park", durationMinutes: 120, isFixed: false, category: "leisure" },
          { id: "ny-2-2", type: "attraction", title: "The Metropolitan Museum", location: "Upper East Side", durationMinutes: 240, isFixed: false, category: "sightseeing", cost: 30, currency: "USD" },
          { id: "ny-2-3", type: "restaurant", title: "Dinner in Hell's Kitchen", location: "Manhattan", durationMinutes: 90, isFixed: false, category: "food" },
        ],
      },
      { id: "ny-day-3", dayNumber: 3, date: "2026-12-06", city: "New York", mode: "ordered", baseLocation: "Midtown", loadPercentage: 0, items: [] },
    ],
  },
};

export function getMockPlannerByTripId(tripId: string): TripPlanner | undefined {
  return mockPlanners[tripId];
}
