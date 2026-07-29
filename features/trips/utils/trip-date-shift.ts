const millisecondsPerDay = 24 * 60 * 60 * 1000;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

type DateShiftResolution =
  | { days: number; error: null }
  | { days: null; error: string };

function parseDateOnlyUtc(value: string) {
  if (!dateOnlyPattern.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day
    ? timestamp
    : null;
}

function formatDateOnlyUtc(timestamp: number) {
  const date = new Date(timestamp);
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

  const sourceTimestamp = parseDateOnlyUtc(sourceStartDate);
  const targetTimestamp = parseDateOnlyUtc(targetStartDate);
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

  const timestamp = parseDateOnlyUtc(value);
  if (timestamp === null) return value;

  return formatDateOnlyUtc(timestamp + days * millisecondsPerDay);
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
