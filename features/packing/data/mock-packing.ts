import type { TripPackingList } from "@/features/packing/types/packing";

const allCategories = [
  "documents", "electronics", "clothes", "toiletries", "health", "travel", "other",
] as const;

export const mockPackingLists: Record<string, TripPackingList> = {
  "japan-2027": {
    tripId: "japan-2027",
    travelers: [
      { id: "jp-kamil", name: "Kamil", role: "Owner" }, { id: "jp-anna", name: "Anna" },
      { id: "jp-marek", name: "Marek" }, { id: "jp-ola", name: "Ola" },
    ],
    categories: [...allCategories],
    items: [
      { id: "jp-pack-1", tripId: "japan-2027", name: "Passports", category: "documents", isShared: true, isPacked: true, priority: "essential", notes: "Check validity before departure." },
      { id: "jp-pack-2", tripId: "japan-2027", name: "Travel insurance copies", category: "documents", assignedTo: "jp-anna", isShared: true, isPacked: false, priority: "essential" },
      { id: "jp-pack-3", tripId: "japan-2027", name: "Universal power adapter", category: "electronics", assignedTo: "jp-kamil", isShared: true, isPacked: true, priority: "essential" },
      { id: "jp-pack-4", tripId: "japan-2027", name: "Pocket Wi-Fi charger", category: "electronics", assignedTo: "jp-marek", isShared: true, isPacked: false, priority: "recommended" },
      { id: "jp-pack-5", tripId: "japan-2027", name: "Light rain jacket", category: "clothes", assignedTo: "jp-ola", isShared: false, isPacked: false, priority: "recommended" },
      { id: "jp-pack-6", tripId: "japan-2027", name: "Comfortable walking shoes", category: "clothes", assignedTo: "jp-anna", isShared: false, isPacked: true, priority: "essential" },
      { id: "jp-pack-7", tripId: "japan-2027", name: "Basic medicine kit", category: "health", assignedTo: "jp-kamil", isShared: true, isPacked: false, priority: "essential" },
      { id: "jp-pack-8", tripId: "japan-2027", name: "Foldable day bag", category: "travel", assignedTo: "jp-marek", isShared: false, isPacked: false, priority: "optional" },
    ],
  },
  "sicily-2026": {
    tripId: "sicily-2026",
    travelers: [{ id: "si-kamil", name: "Kamil", role: "Owner" }, { id: "si-anna", name: "Anna" }],
    categories: [...allCategories],
    items: [
      { id: "si-pack-1", tripId: "sicily-2026", name: "ID cards and driving licences", category: "documents", isShared: true, isPacked: true, priority: "essential" },
      { id: "si-pack-2", tripId: "sicily-2026", name: "Car rental confirmation", category: "documents", assignedTo: "si-anna", isShared: true, isPacked: false, priority: "essential" },
      { id: "si-pack-3", tripId: "sicily-2026", name: "Sunscreen SPF 50", category: "toiletries", assignedTo: "si-kamil", isShared: true, isPacked: false, priority: "essential" },
      { id: "si-pack-4", tripId: "sicily-2026", name: "Swimwear", category: "clothes", assignedTo: "si-anna", isShared: false, isPacked: true, priority: "recommended" },
      { id: "si-pack-5", tripId: "sicily-2026", name: "Reusable water bottles", category: "travel", isShared: true, isPacked: false, priority: "recommended" },
      { id: "si-pack-6", tripId: "sicily-2026", name: "Portable charger", category: "electronics", assignedTo: "si-kamil", isShared: false, isPacked: true, priority: "recommended" },
    ],
  },
  "monaco-f1-weekend": {
    tripId: "monaco-f1-weekend",
    travelers: [
      { id: "mo-kamil", name: "Kamil", role: "Owner" }, { id: "mo-marek", name: "Marek" },
      { id: "mo-ola", name: "Ola" },
    ],
    categories: [...allCategories],
    items: [
      { id: "mo-pack-1", tripId: "monaco-f1-weekend", name: "Race tickets", category: "documents", assignedTo: "mo-marek", isShared: true, isPacked: true, priority: "essential" },
      { id: "mo-pack-2", tripId: "monaco-f1-weekend", name: "Ear protection", category: "health", isShared: true, isPacked: false, priority: "essential", notes: "One set for every traveler." },
      { id: "mo-pack-3", tripId: "monaco-f1-weekend", name: "Compact binoculars", category: "travel", assignedTo: "mo-kamil", isShared: true, isPacked: false, priority: "recommended" },
      { id: "mo-pack-4", tripId: "monaco-f1-weekend", name: "Smart casual outfit", category: "clothes", assignedTo: "mo-ola", isShared: false, isPacked: true, priority: "recommended" },
      { id: "mo-pack-5", tripId: "monaco-f1-weekend", name: "Power bank", category: "electronics", assignedTo: "mo-marek", isShared: false, isPacked: true, priority: "essential" },
      { id: "mo-pack-6", tripId: "monaco-f1-weekend", name: "Lightweight rain ponchos", category: "clothes", isShared: true, isPacked: false, priority: "optional" },
    ],
  },
  "new-york-2026": {
    tripId: "new-york-2026",
    travelers: [{ id: "ny-kamil", name: "Kamil", role: "Owner" }, { id: "ny-anna", name: "Anna" }],
    categories: [...allCategories],
    items: [
      { id: "ny-pack-1", tripId: "new-york-2026", name: "Passports and ESTA copies", category: "documents", assignedTo: "ny-kamil", isShared: true, isPacked: true, priority: "essential" },
      { id: "ny-pack-2", tripId: "new-york-2026", name: "Warm winter coats", category: "clothes", isShared: false, isPacked: false, priority: "essential" },
      { id: "ny-pack-3", tripId: "new-york-2026", name: "US power adapters", category: "electronics", assignedTo: "ny-anna", isShared: true, isPacked: true, priority: "essential" },
      { id: "ny-pack-4", tripId: "new-york-2026", name: "Comfortable waterproof boots", category: "clothes", assignedTo: "ny-kamil", isShared: false, isPacked: false, priority: "recommended" },
      { id: "ny-pack-5", tripId: "new-york-2026", name: "Prescription medicine", category: "health", assignedTo: "ny-anna", isShared: false, isPacked: false, priority: "essential" },
      { id: "ny-pack-6", tripId: "new-york-2026", name: "Foldable shopping bag", category: "travel", isShared: true, isPacked: true, priority: "optional" },
    ],
  },
};

export function getMockPackingByTripId(tripId: string): TripPackingList | undefined {
  return mockPackingLists[tripId];
}
