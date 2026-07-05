import type { TripMapData } from "@/features/map/types/map";

export const mockMaps: Record<string, TripMapData> = {
  "japan-2027": {
    tripId: "japan-2027",
    route: { distanceKm: 612, estimatedMinutes: 740, transportMode: "transit" },
    items: [
      { id: "jp-map-1", tripId: "japan-2027", name: "Sensō-ji Temple", city: "Tokyo", category: "attraction", status: "planned", priority: "must-see", latitude: 35.7148, longitude: 139.7967, plannedDay: 2, estimatedDuration: 120, estimatedCost: 0, currency: "JPY" },
      { id: "jp-map-2", tripId: "japan-2027", name: "Shinjuku Granbell Hotel", city: "Tokyo", category: "hotel", status: "planned", priority: "recommended", latitude: 35.697, longitude: 139.704, plannedDay: 1, estimatedDuration: 30 },
      { id: "jp-map-3", tripId: "japan-2027", name: "Fushimi Inari Taisha", city: "Kyoto", category: "attraction", status: "idea", priority: "must-see", latitude: 34.9671, longitude: 135.7727, estimatedDuration: 180, estimatedCost: 0, currency: "JPY" },
      { id: "jp-map-4", tripId: "japan-2027", name: "Nishiki Market", city: "Kyoto", category: "restaurant", status: "planned", priority: "recommended", latitude: 35.005, longitude: 135.7649, plannedDay: 7, estimatedDuration: 90, estimatedCost: 3500, currency: "JPY" },
    ],
  },
  "sicily-2026": {
    tripId: "sicily-2026",
    route: { distanceKm: 486, estimatedMinutes: 540, transportMode: "driving" },
    items: [
      { id: "si-map-1", tripId: "sicily-2026", name: "Palermo Cathedral", city: "Palermo", category: "attraction", status: "planned", priority: "recommended", latitude: 38.1144, longitude: 13.3561, plannedDay: 2, estimatedDuration: 90, estimatedCost: 7, currency: "EUR" },
      { id: "si-map-2", tripId: "sicily-2026", name: "Osteria Ballarò", city: "Palermo", category: "restaurant", status: "visited", priority: "recommended", latitude: 38.114, longitude: 13.367, plannedDay: 1, estimatedDuration: 120, estimatedCost: 45, currency: "EUR" },
      { id: "si-map-3", tripId: "sicily-2026", name: "Valley of the Temples", city: "Agrigento", category: "attraction", status: "planned", priority: "must-see", latitude: 37.2905, longitude: 13.5851, plannedDay: 5, estimatedDuration: 180, estimatedCost: 17, currency: "EUR" },
      { id: "si-map-4", tripId: "sicily-2026", name: "Taormina Garden Hotel", city: "Taormina", category: "hotel", status: "planned", priority: "optional", latitude: 37.8516, longitude: 15.2853, plannedDay: 7 },
    ],
  },
  "monaco-f1-weekend": {
    tripId: "monaco-f1-weekend",
    route: { distanceKm: 54, estimatedMinutes: 135, transportMode: "mixed" },
    items: [
      { id: "mo-map-1", tripId: "monaco-f1-weekend", name: "Grandstand K", city: "Monaco", category: "viewpoint", status: "visited", priority: "must-see", latitude: 43.734, longitude: 7.424, plannedDay: 3, estimatedDuration: 300, estimatedCost: 650, currency: "EUR" },
      { id: "mo-map-2", tripId: "monaco-f1-weekend", name: "Casino Square", city: "Monte Carlo", category: "attraction", status: "visited", priority: "must-see", latitude: 43.739, longitude: 7.428, plannedDay: 1, estimatedDuration: 60 },
      { id: "mo-map-3", tripId: "monaco-f1-weekend", name: "Hôtel de Paris", city: "Monte Carlo", category: "hotel", status: "planned", priority: "recommended", latitude: 43.7393, longitude: 7.4272, plannedDay: 1 },
      { id: "mo-map-4", tripId: "monaco-f1-weekend", name: "Café de Paris", city: "Monte Carlo", category: "restaurant", status: "planned", priority: "recommended", latitude: 43.7392, longitude: 7.4268, plannedDay: 2, estimatedDuration: 90, estimatedCost: 70, currency: "EUR" },
    ],
  },
  "new-york-2026": {
    tripId: "new-york-2026",
    route: { distanceKm: 42, estimatedMinutes: 390, transportMode: "transit" },
    items: [
      { id: "ny-map-1", tripId: "new-york-2026", name: "The Metropolitan Museum", city: "New York", category: "attraction", status: "planned", priority: "must-see", latitude: 40.7794, longitude: -73.9632, plannedDay: 3, estimatedDuration: 240, estimatedCost: 30, currency: "USD" },
      { id: "ny-map-2", tripId: "new-york-2026", name: "Top of the Rock", city: "New York", category: "viewpoint", status: "idea", priority: "recommended", latitude: 40.7593, longitude: -73.9794, estimatedDuration: 90, estimatedCost: 44, currency: "USD" },
      { id: "ny-map-3", tripId: "new-york-2026", name: "Midtown Hotel", city: "New York", category: "hotel", status: "planned", priority: "recommended", latitude: 40.7549, longitude: -73.984, plannedDay: 1 },
      { id: "ny-map-4", tripId: "new-york-2026", name: "Chelsea Market", city: "New York", category: "restaurant", status: "planned", priority: "optional", latitude: 40.7424, longitude: -74.0061, plannedDay: 5, estimatedDuration: 90, estimatedCost: 35, currency: "USD" },
    ],
  },
};

export function getMockMapByTripId(tripId: string): TripMapData | undefined {
  return mockMaps[tripId];
}
