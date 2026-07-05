import type {
  PlanningChecklistItem,
  TripDetail,
} from "@/features/trip-detail/types/trip-detail";

function createChecklist(completed: number): PlanningChecklistItem[] {
  const labels = [
    "Travel dates confirmed",
    "Accommodation selected",
    "Key places saved",
    "Reservations organized",
    "Daily plan prepared",
  ];

  return labels.map((label, index) => ({
    id: `check-${index + 1}`,
    label,
    completed: index < completed,
  }));
}

export const mockTripDetails: Record<string, TripDetail> = {
  "japan-2027": {
    id: "japan-2027",
    title: "Japan 2027",
    country: "Japan",
    startDate: "2027-03-25",
    endDate: "2027-04-10",
    status: "planning",
    participantsCount: 4,
    placesCount: 28,
    reservationsCount: 2,
    costPerPerson: 4200,
    currency: "EUR",
    planningProgress: 38,
    coverGradient: "from-rose-400 via-orange-300 to-amber-200",
    description: "A spring journey through modern cities, quiet temples, and Japan's cherry blossom season.",
    mainCities: ["Tokyo", "Kyoto", "Osaka", "Hakone"],
    planningChecklist: createChecklist(2),
    timelinePreview: [
      { id: "jp-1", date: "Mar 25", title: "Arrival in Tokyo", location: "Haneda Airport", type: "arrival" },
      { id: "jp-2", date: "Mar 30", title: "Shinkansen to Kyoto", location: "Tokyo Station", type: "activity" },
      { id: "jp-3", date: "Apr 6", title: "Osaka food tour", location: "Dotonbori", type: "activity" },
    ],
  },
  "sicily-2026": {
    id: "sicily-2026",
    title: "Sicily 2026",
    country: "Italy",
    startDate: "2026-09-12",
    endDate: "2026-09-21",
    status: "upcoming",
    participantsCount: 2,
    placesCount: 17,
    reservationsCount: 5,
    costPerPerson: 1850,
    currency: "EUR",
    planningProgress: 72,
    coverGradient: "from-sky-500 via-cyan-400 to-amber-200",
    description: "A relaxed island road trip filled with coastal towns, ancient ruins, and unforgettable food.",
    mainCities: ["Palermo", "Cefalù", "Taormina", "Catania"],
    planningChecklist: createChecklist(4),
    timelinePreview: [
      { id: "si-1", date: "Sep 12", title: "Land in Palermo", location: "Palermo Airport", type: "arrival" },
      { id: "si-2", date: "Sep 15", title: "Drive to Cefalù", location: "Northern coast", type: "activity" },
      { id: "si-3", date: "Sep 19", title: "Explore Mount Etna", location: "Catania", type: "activity" },
    ],
  },
  "monaco-f1-weekend": {
    id: "monaco-f1-weekend",
    title: "Monaco F1 Weekend",
    country: "Monaco",
    startDate: "2026-05-22",
    endDate: "2026-05-25",
    status: "archived",
    participantsCount: 3,
    placesCount: 9,
    reservationsCount: 6,
    costPerPerson: 2750,
    currency: "EUR",
    planningProgress: 100,
    coverGradient: "from-blue-800 via-blue-600 to-cyan-400",
    description: "A fast-paced weekend around Monte Carlo for racing, waterfront evenings, and Riviera views.",
    mainCities: ["Monte Carlo", "Nice"],
    planningChecklist: createChecklist(5),
    timelinePreview: [
      { id: "mo-1", date: "May 22", title: "Arrival on the Riviera", location: "Nice Airport", type: "arrival" },
      { id: "mo-2", date: "May 24", title: "Monaco Grand Prix", location: "Circuit de Monaco", type: "activity" },
      { id: "mo-3", date: "May 25", title: "Return flight", location: "Nice Airport", type: "departure" },
    ],
  },
  "new-york-2026": {
    id: "new-york-2026",
    title: "New York 2026",
    country: "United States",
    startDate: "2026-12-04",
    endDate: "2026-12-11",
    status: "upcoming",
    participantsCount: 2,
    placesCount: 21,
    reservationsCount: 4,
    costPerPerson: 3200,
    currency: "USD",
    planningProgress: 54,
    coverGradient: "from-slate-800 via-indigo-700 to-orange-400",
    description: "A winter week of iconic neighborhoods, skyline views, museums, and festive New York evenings.",
    mainCities: ["Manhattan", "Brooklyn", "Queens"],
    planningChecklist: createChecklist(3),
    timelinePreview: [
      { id: "ny-1", date: "Dec 4", title: "Arrive in New York", location: "JFK Airport", type: "arrival" },
      { id: "ny-2", date: "Dec 6", title: "Museum day", location: "Upper East Side", type: "activity" },
      { id: "ny-3", date: "Dec 9", title: "Brooklyn evening", location: "DUMBO", type: "activity" },
    ],
  },
};

export function getMockTripDetail(id: string): TripDetail | undefined {
  return mockTripDetails[id];
}
