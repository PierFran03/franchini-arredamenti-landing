// Shared time helpers for appointment slots in Europe/Rome
// Slots: 17:30, 18:30, 19:30 (1h each). Days: Mon-Sat.

export const TIMEZONE = "Europe/Rome";
export const SLOT_HOURS_MINUTES: Array<[number, number]> = [
  [17, 30],
  [18, 30],
  [19, 30],
];
export const SLOT_DURATION_MIN = 60;

export function zonedDateToUTC(
  dateStr: string,
  hour: number,
  minute: number,
  tz = TIMEZONE,
): Date {
  // Build a "wall clock" UTC guess for the given Y-M-D h:m
  const guess = new Date(
    `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`,
  );
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(guess);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  let h = get("hour");
  if (h === 24) h = 0;
  const displayedMin = h * 60 + get("minute");
  const targetMin = hour * 60 + minute;
  let diff = targetMin - displayedMin;
  if (diff > 12 * 60) diff -= 24 * 60;
  if (diff < -12 * 60) diff += 24 * 60;
  return new Date(guess.getTime() + diff * 60 * 1000);
}

export function dayOfWeekInTZ(d: Date, tz = TIMEZONE): number {
  // 0 = Sunday, 1 = Monday, ...
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

export function buildSlotsForDate(dateStr: string) {
  return SLOT_HOURS_MINUTES.map(([h, m]) => {
    const start = zonedDateToUTC(dateStr, h, m);
    const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60 * 1000);
    return {
      label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      start_iso: start.toISOString(),
      end_iso: end.toISOString(),
    };
  });
}
