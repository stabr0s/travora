export type PlannerPresetItem = {
  title: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  description?: string;
};

export type PlannerDayPreset = {
  id: string;
  label: string;
  description: string;
  items: PlannerPresetItem[];
};

export const plannerDayPresets: PlannerDayPreset[] = [
  {
    id: "arrival-day",
    label: "Arrival day",
    description: "A soft landing with arrival, check-in, a walk, and dinner.",
    items: [
      { title: "Airport / station arrival", type: "transport" },
      { title: "Check-in / drop bags", type: "hotel" },
      { title: "Easy local walk", type: "activity", description: "Keep this light after travel." },
      { title: "Dinner nearby", startTime: "19:30", type: "restaurant" },
    ],
  },
  {
    id: "departure-day",
    label: "Departure day",
    description: "Wrap up the trip without overloading the last day.",
    items: [
      { title: "Check out", type: "hotel" },
      { title: "Final walk / breakfast", startTime: "09:00", type: "activity" },
      { title: "Transfer to airport / station", type: "transport" },
      { title: "Departure", type: "transport" },
    ],
  },
  {
    id: "travel-day",
    label: "Travel day",
    description: "Move between cities with room to settle in.",
    items: [
      { title: "Pack and check out", type: "hotel" },
      { title: "Transfer", type: "transport" },
      { title: "Travel", type: "transport" },
      { title: "Check in / settle in", type: "hotel" },
    ],
  },
  {
    id: "morning-sightseeing",
    label: "Morning sightseeing",
    description: "A simple morning route with breaks built in.",
    items: [
      { title: "Breakfast", startTime: "09:00", type: "restaurant" },
      { title: "Main attraction", startTime: "10:30", type: "attraction" },
      { title: "Coffee break", type: "restaurant" },
      { title: "Walk around nearby area", type: "activity" },
    ],
  },
  {
    id: "beach-chill-day",
    label: "Beach / chill day",
    description: "A relaxed day with space to rest.",
    items: [
      { title: "Slow breakfast", startTime: "09:00", type: "restaurant" },
      { title: "Beach / pool time", type: "activity" },
      { title: "Lunch nearby", startTime: "13:00", type: "restaurant" },
      { title: "Sunset walk", type: "activity" },
    ],
  },
  {
    id: "food-evening",
    label: "Food evening",
    description: "A compact evening plan for food-focused trips.",
    items: [
      { title: "Aperitivo / drinks", startTime: "18:30", type: "restaurant" },
      { title: "Dinner reservation", startTime: "19:30", type: "restaurant" },
      { title: "Evening walk", type: "activity" },
      { title: "Dessert / local snack", type: "restaurant" },
    ],
  },
  {
    id: "free-time-block",
    label: "Free time block",
    description: "A flexible fallback for slower travel days.",
    items: [
      { title: "Free time", type: "free-time" },
      { title: "Optional activity", type: "activity" },
      { title: "Rest / reset", type: "free-time" },
    ],
  },
];

export function getPlannerDayPreset(presetId: string) {
  return plannerDayPresets.find((preset) => preset.id === presetId) || null;
}
