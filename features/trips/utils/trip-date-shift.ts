const millisecondsPerDay = 24 * 60 * 60 * 1000;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

type DateShiftResolution =
  | { days: number; error: null }
  | { days: null; error: string };

function parseDateOnly(value: string) {
  if (!dateOnlyPattern.test(value)) return null;

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(timestamp)) return null;

  return new Date(timestamp).toISOString().slice(0, 10) === value
    ? timestamp
    : null;
}

export function resolveDateShift(
  sourceStartDate: string | null | undefined,
  targetStartDate: string | null | undefined,
  enabled: boolean,
): DateShiftResolution {
  if (!enabled) return { days: 0, error: null };
  if (!sourceStartDate || !targetStartDate) {
    return {
      days: null,
      error: "Add a start date to both trips before shifting copied dates.",
    };
  }

  const sourceTimestamp = parseDateOnly(sourceStartDate);
  const targetTimestamp = parseDateOnly(targetStartDate);
  if (sourceTimestamp === null || targetTimestamp === null) {
    return {
      days: null,
      error: "Enter valid trip start dates before shifting copied dates.",
    };
  }

  const days = (targetTimestamp - sourceTimestamp) / millisecondsPerDay;
  return Number.isInteger(days)
    ? { days, error: null }
    : { days: null, error: "We couldn't calculate a safe date shift." };
}

export function shiftDateOnly(
  value: string | null,
  days: number,
) {
  if (!value || days === 0) return value;

  const timestamp = parseDateOnly(value);
  if (timestamp === null) return value;

  return new Date(timestamp + days * millisecondsPerDay)
    .toISOString()
    .slice(0, 10);
}

export function shiftTimestamp(
  value: string | null,
  days: number,
) {
  if (!value || days === 0) return value;

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return value;

  return new Date(timestamp + days * millisecondsPerDay).toISOString();
}
