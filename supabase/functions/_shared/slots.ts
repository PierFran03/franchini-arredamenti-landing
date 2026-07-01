// Shared time helpers for appointment slots in Europe/Rome.
// Slots and weekdays are configurable via the `booking` row in site_content.

export const TIMEZONE = "Europe/Rome";

export type BookingConfig = {
  weekdays: number[]; // 0=Sun ... 6=Sat
  slots: string[]; // "HH:MM"
  duration_min: number;
};

export const DEFAULT_BOOKING: BookingConfig = {
  weekdays: [1, 2, 3, 4, 5],
  slots: ["17:30", "18:30", "19:30"],
  duration_min: 60,
};

export function parseSlot(label: string): [number, number] | null {
  const m = /^(\d{2}):(\d{2})$/.exec(label);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

// deno-lint-ignore no-explicit-any
export async function loadBookingConfig(supabase: any): Promise<BookingConfig> {
  try {
    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "booking")
      .maybeSingle();
    const v = (data?.value ?? {}) as Partial<BookingConfig>;
    return {
      weekdays: Array.isArray(v.weekdays) && v.weekdays.length
        ? v.weekdays.map(Number)
        : DEFAULT_BOOKING.weekdays,
      slots: Array.isArray(v.slots) && v.slots.length
        ? v.slots.filter((s) => typeof s === "string" && parseSlot(s))
        : DEFAULT_BOOKING.slots,
      duration_min: Number(v.duration_min) > 0
        ? Number(v.duration_min)
        : DEFAULT_BOOKING.duration_min,
    };
  } catch {
    return DEFAULT_BOOKING;
  }
}

export function zonedDateToUTC(
  dateStr: string,
  hour: number,
  minute: number,
  tz = TIMEZONE,
): Date {
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
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

export function buildSlotsForDate(dateStr: string, cfg: BookingConfig) {
  return cfg.slots.map((label) => {
    const parsed = parseSlot(label)!;
    const [h, m] = parsed;
    const start = zonedDateToUTC(dateStr, h, m);
    const end = new Date(start.getTime() + cfg.duration_min * 60 * 1000);
    return {
      label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      start_iso: start.toISOString(),
      end_iso: end.toISOString(),
    };
  });
}
