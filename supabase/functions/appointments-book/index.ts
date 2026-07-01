// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  dayOfWeekInTZ,
  loadBookingConfig,
  parseSlot,
  TIMEZONE,
  zonedDateToUTC,
} from "../_shared/slots.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL =
  "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }
  try {
    const body = await req.json().catch(() => ({}));
    const { date, slot, name, email, phone, message } = body as Record<
      string,
      string
    >;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "invalid_date" }, 400);
    }
    if (!slot || !/^\d{2}:\d{2}$/.test(slot)) {
      return json({ error: "invalid_slot" }, 400);
    }
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return json({ error: "missing_fields" }, 400);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: "invalid_email" }, 400);
    }

    const parsed = parseSlot(slot);
    if (!parsed) return json({ error: "invalid_slot_time" }, 400);
    const [h, m] = parsed;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const cfg = await loadBookingConfig(supabase);

    // Validate slot is one of allowed times from admin config
    const allowed = cfg.slots.some((s) => {
      const p = parseSlot(s);
      return p && p[0] === h && p[1] === m;
    });
    if (!allowed) return json({ error: "invalid_slot_time" }, 400);

    const start = zonedDateToUTC(date, h, m);
    const end = new Date(start.getTime() + cfg.duration_min * 60 * 1000);

    if (start.getTime() <= Date.now()) {
      return json({ error: "slot_in_past" }, 400);
    }
    if (!cfg.weekdays.includes(dayOfWeekInTZ(start))) {
      return json({ error: "closed_weekday" }, 400);
    }

    // Check admin-defined closures
    const { data: closures } = await supabase
      .from("calendar_closures")
      .select("id")
      .lte("start_date", date)
      .gte("end_date", date);
    if (closures && closures.length > 0) {
      return json({ error: "closed_period" }, 400);
    }



    // Check existing booking
    const { data: existing } = await supabase
      .from("appointments")
      .select("id")
      .eq("slot_start", start.toISOString())
      .neq("status", "cancelled")
      .maybeSingle();
    if (existing) return json({ error: "slot_taken" }, 409);

    // Create Google Calendar event (best effort but recommended)
    let calendarEventId: string | null = null;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (LOVABLE_API_KEY && GOOGLE_CALENDAR_API_KEY) {
      try {
        const evRes = await fetch(
          `${GATEWAY_URL}/calendars/primary/events`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: `Appuntamento showroom — ${name}`,
              description:
                `Prenotazione dal sito Franchini Arredamenti\n\n` +
                `Nome: ${name}\nEmail: ${email}\nTelefono: ${phone}\n\n` +
                `Messaggio:\n${message || "(nessun messaggio)"}`,
              start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
              end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
              attendees: [{ email }],
              reminders: { useDefault: true },
            }),
          },
        );
        if (evRes.ok) {
          const ev = await evRes.json();
          calendarEventId = ev.id ?? null;
        } else {
          console.warn(
            "Google Calendar event create failed:",
            evRes.status,
            await evRes.text(),
          );
        }
      } catch (e) {
        console.warn("Google Calendar error:", e);
      }
    }

    // Insert into DB
    const { data: inserted, error: insertErr } = await supabase
      .from("appointments")
      .insert({
        slot_start: start.toISOString(),
        slot_end: end.toISOString(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message?.trim() || null,
        calendar_event_id: calendarEventId,
        status: "confirmed",
      })
      .select()
      .single();

    if (insertErr) {
      // unique violation -> slot taken
      if ((insertErr as any).code === "23505") {
        return json({ error: "slot_taken" }, 409);
      }
      console.error("Insert error:", insertErr);
      return json({ error: "db_error", detail: insertErr.message }, 500);
    }

    return json({
      ok: true,
      appointment: {
        id: inserted.id,
        slot_start: inserted.slot_start,
        slot_end: inserted.slot_end,
      },
    });
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
