// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  buildSlotsForDate,
  dayOfWeekInTZ,
  TIMEZONE,
} from "../_shared/slots.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const GATEWAY_URL =
  "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date"); // YYYY-MM-DD (Europe/Rome)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "invalid_date" }, 400);
    }

    // Test if Sunday (closed)
    const sample = new Date(`${date}T12:00:00Z`);
    const dow = dayOfWeekInTZ(sample);
    if (dow === 0) {
      return json({ date, closed: true, reason: "sunday", slots: [] });
    }

    const slots = buildSlotsForDate(date);
    const now = Date.now();

    // 1) Check our DB for already-booked slots
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const startBound = slots[0].start_iso;
    const endBound = slots[slots.length - 1].end_iso;
    const { data: booked } = await supabase
      .from("appointments")
      .select("slot_start")
      .gte("slot_start", startBound)
      .lte("slot_start", endBound)
      .neq("status", "cancelled");
    const bookedSet = new Set((booked || []).map((b: any) => b.slot_start));

    // 2) Check Google Calendar freeBusy
    let busy: Array<{ start: string; end: string }> = [];
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (LOVABLE_API_KEY && GOOGLE_CALENDAR_API_KEY) {
      try {
        const fbRes = await fetch(`${GATEWAY_URL}/freeBusy`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timeMin: startBound,
            timeMax: endBound,
            timeZone: TIMEZONE,
            items: [{ id: "primary" }],
          }),
        });
        if (fbRes.ok) {
          const data = await fbRes.json();
          busy = data?.calendars?.primary?.busy || [];
        } else {
          console.warn("freeBusy non-OK:", fbRes.status, await fbRes.text());
        }
      } catch (e) {
        console.warn("freeBusy error:", e);
      }
    }

    const slotsOut = slots.map((s) => {
      const startMs = new Date(s.start_iso).getTime();
      const endMs = new Date(s.end_iso).getTime();
      const inPast = startMs <= now;
      const dbBooked = Array.from(bookedSet).some(
        (iso) => new Date(iso as string).getTime() === startMs,
      );
      const calBusy = busy.some((b) => {
        const bs = new Date(b.start).getTime();
        const be = new Date(b.end).getTime();
        return bs < endMs && be > startMs;
      });
      return {
        label: s.label,
        start_iso: s.start_iso,
        end_iso: s.end_iso,
        available: !inPast && !dbBooked && !calBusy,
      };
    });

    return json({ date, closed: false, slots: slotsOut });
  } catch (e) {
    console.error(e);
    return json({ error: "internal_error", detail: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
