import type { PackingCategory, PackingPriority } from "@/features/packing/types/packing";

export type PackingPresetId = "weekend" | "city-break" | "road-trip";

export type PackingPresetItem = {
  name: string;
  category: PackingCategory;
  isShared: boolean;
  priority: PackingPriority;
  notes?: string;
};

export type PackingPreset = {
  id: PackingPresetId;
  label: string;
  items: PackingPresetItem[];
};

export const packingPresets: PackingPreset[] = [
  {
    id: "weekend",
    label: "Weekend",
    items: [
      { name: "ID / passport", category: "documents", isShared: false, priority: "essential" },
      { name: "Phone charger", category: "electronics", isShared: false, priority: "essential" },
      { name: "Toiletries", category: "toiletries", isShared: false, priority: "recommended" },
      { name: "Underwear", category: "clothes", isShared: false, priority: "essential" },
      { name: "Comfortable shoes", category: "clothes", isShared: false, priority: "recommended" },
    ],
  },
  {
    id: "city-break",
    label: "City break",
    items: [
      { name: "ID / passport", category: "documents", isShared: false, priority: "essential" },
      { name: "Phone charger", category: "electronics", isShared: false, priority: "essential" },
      { name: "Power bank", category: "electronics", isShared: false, priority: "recommended" },
      { name: "Comfortable shoes", category: "clothes", isShared: false, priority: "recommended" },
      { name: "Sunglasses", category: "travel", isShared: false, priority: "optional" },
      { name: "Small backpack", category: "travel", isShared: false, priority: "recommended" },
    ],
  },
  {
    id: "road-trip",
    label: "Road trip",
    items: [
      { name: "Driving licence", category: "documents", isShared: false, priority: "essential" },
      { name: "Car documents", category: "documents", isShared: true, priority: "essential" },
      { name: "Phone charger", category: "electronics", isShared: false, priority: "essential" },
      { name: "Power bank", category: "electronics", isShared: false, priority: "recommended" },
      { name: "Water bottle", category: "travel", isShared: false, priority: "recommended" },
      { name: "Snacks", category: "travel", isShared: true, priority: "optional" },
      { name: "First aid kit", category: "health", isShared: true, priority: "essential" },
    ],
  },
];

export function getPackingPreset(id: string) {
  return packingPresets.find((preset) => preset.id === id) || null;
}
