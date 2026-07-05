import type { Place } from "@/features/places/types/place";

export const mockPlaces: Place[] = [
  {
    id: "sensoji", tripId: "japan-2027", name: "Sensō-ji Temple", city: "Tokyo", country: "Japan",
    category: "attraction", priority: "must-see", status: "planned", estimatedDuration: 120,
    estimatedCost: 0, currency: "JPY", notes: "Visit early for quieter temple grounds and Nakamise Street.",
    coverGradient: "from-rose-500 via-red-400 to-orange-300", plannedDay: 2, tags: ["Temple", "History"],
  },
  {
    id: "fushimi-inari", tripId: "japan-2027", name: "Fushimi Inari Taisha", city: "Kyoto", country: "Japan",
    category: "attraction", priority: "must-see", status: "idea", estimatedDuration: 180,
    estimatedCost: 0, currency: "JPY", notes: "Allow enough time to walk beyond the busiest lower gates.",
    coverGradient: "from-orange-600 via-red-500 to-amber-300", tags: ["Shrine", "Hike"],
  },
  {
    id: "teamlab-borderless", tripId: "japan-2027", name: "teamLab Borderless", city: "Tokyo", country: "Japan",
    category: "attraction", priority: "recommended", status: "planned", estimatedDuration: 150,
    estimatedCost: 4800, currency: "JPY", notes: "Book a morning entry and keep the rest of the day flexible.",
    coverGradient: "from-violet-700 via-fuchsia-500 to-cyan-400", plannedDay: 3, tags: ["Art", "Indoor"],
  },
  {
    id: "valley-temples", tripId: "sicily-2026", name: "Valley of the Temples", city: "Agrigento", country: "Italy",
    category: "attraction", priority: "must-see", status: "planned", estimatedDuration: 180,
    estimatedCost: 17, currency: "EUR", notes: "Go late afternoon for softer light and cooler temperatures.",
    coverGradient: "from-amber-500 via-orange-300 to-sky-300", plannedDay: 5, tags: ["Ruins", "History"],
  },
  {
    id: "scala-turchi", tripId: "sicily-2026", name: "Scala dei Turchi", city: "Realmonte", country: "Italy",
    category: "viewpoint", priority: "recommended", status: "idea", estimatedDuration: 90,
    estimatedCost: 0, currency: "EUR", notes: "Check current access rules before driving to the coast.",
    coverGradient: "from-cyan-500 via-sky-300 to-stone-100", tags: ["Coast", "Sunset"],
  },
  {
    id: "osteria-ballarò", tripId: "sicily-2026", name: "Osteria Ballarò", city: "Palermo", country: "Italy",
    category: "restaurant", priority: "recommended", status: "visited", estimatedDuration: 120,
    estimatedCost: 45, currency: "EUR", notes: "Modern Sicilian menu in the historic center; reserve for dinner.",
    coverGradient: "from-orange-700 via-amber-500 to-yellow-200", plannedDay: 1, tags: ["Dinner", "Sicilian"],
  },
  {
    id: "casino-square", tripId: "monaco-f1-weekend", name: "Casino Square", city: "Monte Carlo", country: "Monaco",
    category: "attraction", priority: "must-see", status: "visited", estimatedDuration: 60,
    estimatedCost: 0, currency: "EUR", notes: "Best explored on foot before the evening crowds arrive.",
    coverGradient: "from-emerald-700 via-teal-500 to-sky-300", plannedDay: 1, tags: ["Architecture", "F1"],
  },
  {
    id: "grand-prix-stand", tripId: "monaco-f1-weekend", name: "Grand Prix Grandstand K", city: "Monaco", country: "Monaco",
    category: "viewpoint", priority: "must-see", status: "visited", estimatedDuration: 300,
    estimatedCost: 650, currency: "EUR", notes: "Bring sun protection and arrive well before the support races.",
    coverGradient: "from-blue-900 via-blue-600 to-red-500", plannedDay: 3, tags: ["Race", "Ticket"],
  },
  {
    id: "monaco-ville", tripId: "monaco-f1-weekend", name: "Monaco-Ville Old Town", city: "Monaco", country: "Monaco",
    category: "viewpoint", priority: "optional", status: "visited", estimatedDuration: 90,
    estimatedCost: 0, currency: "EUR", notes: "Walk up for harbor views and quiet lanes around the palace.",
    coverGradient: "from-sky-700 via-cyan-500 to-amber-200", plannedDay: 2, tags: ["Walk", "Harbor"],
  },
  {
    id: "met-museum", tripId: "new-york-2026", name: "The Metropolitan Museum of Art", city: "New York", country: "United States",
    category: "attraction", priority: "must-see", status: "planned", estimatedDuration: 240,
    estimatedCost: 30, currency: "USD", notes: "Choose two or three collections rather than trying to see everything.",
    coverGradient: "from-stone-700 via-amber-700 to-orange-300", plannedDay: 3, tags: ["Museum", "Art"],
  },
  {
    id: "top-of-the-rock", tripId: "new-york-2026", name: "Top of the Rock", city: "New York", country: "United States",
    category: "viewpoint", priority: "recommended", status: "idea", estimatedDuration: 90,
    estimatedCost: 44, currency: "USD", notes: "Aim for a sunset slot to see the skyline transition into night.",
    coverGradient: "from-slate-800 via-indigo-600 to-orange-400", tags: ["Skyline", "Sunset"],
  },
  {
    id: "chelsea-market", tripId: "new-york-2026", name: "Chelsea Market", city: "New York", country: "United States",
    category: "restaurant", priority: "optional", status: "planned", estimatedDuration: 90,
    estimatedCost: 35, currency: "USD", notes: "Combine lunch with a walk on the High Line.",
    coverGradient: "from-red-800 via-orange-600 to-amber-300", plannedDay: 5, tags: ["Food", "Market"],
  },
];

export function getMockPlacesByTripId(tripId: string): Place[] {
  return mockPlaces.filter((place) => place.tripId === tripId);
}
