import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteData } from "@/hooks/useSiteData";

type Slot = {
  label: string;
  start_iso: string;
  end_iso: string;
  available: boolean;
};

function toDateParam(d: Date) {
  // YYYY-MM-DD in local time
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const AppointmentBooking = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const { booking } = useSiteData();
  const allowedWeekdays = new Set(booking.weekdays);
  const fallbackSlots = booking.slots.map((label) => ({ label, start_iso: "", end_iso: "", available: false }));
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<null | {
    date: string;
    slot: string;
  }>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [closures, setClosures] = useState<Array<{ start_date: string; end_date: string }>>([]);

  useEffect(() => {
    supabase
      .from("calendar_closures")
      .select("start_date, end_date")
      .then(({ data }) => setClosures((data as any) || []));
  }, []);

  const isClosed = (d: Date) => {
    const ds = toDateParam(d);
    return closures.some((c) => ds >= c.start_date && ds <= c.end_date);
  };

  const dateParam = useMemo(() => (date ? toDateParam(date) : ""), [date]);

  useEffect(() => {
    if (!dateParam) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot("");
    const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
    const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    fetch(`${base}/appointments-availability?date=${dateParam}`, {
      headers: { "Content-Type": "application/json", apikey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.closed) {
          setSlots([]);
          toast({
            title: "Showroom chiuso",
            description: data?.reason === "closure"
              ? "In questo periodo lo showroom è chiuso. Scegli un altro giorno."
              : "Lo showroom non è disponibile in questo giorno. Scegline un altro.",
          });
          return;
        }
        setSlots(data?.slots || []);
      })
      .catch((e) => {
        console.error(e);
        toast({
          title: "Errore",
          description: "Impossibile caricare gli orari disponibili.",
          variant: "destructive",
        });
      })
      .finally(() => setLoadingSlots(false));
  }, [dateParam, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateParam || !selectedSlot) {
      toast({
        title: "Seleziona data e orario",
        description: "Scegli un giorno e uno slot disponibile.",
        variant: "destructive",
      });
      return;
    }
    if (!privacyAccepted) {
      toast({
        title: "Informativa privacy",
        description: "Devi accettare l'informativa privacy per prenotare un appuntamento.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("appointments-book", {
        body: {
          date: dateParam,
          slot: selectedSlot,
          ...form,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) {
        const code = (data as any).error;
        const msg =
          code === "slot_taken"
            ? "Questo orario è stato appena prenotato. Scegline un altro."
            : code === "invalid_email"
              ? "Email non valida."
              : "Impossibile completare la prenotazione.";
        toast({ title: "Prenotazione non riuscita", description: msg, variant: "destructive" });
        // Refresh slots
        const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
        const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        fetch(`${base}/appointments-availability?date=${dateParam}`, {
          headers: { apikey },
        })
          .then((r) => r.json())
          .then((d) => setSlots(d?.slots || []));
        return;
      }
      setConfirmed({ date: dateParam, slot: selectedSlot });
      setForm({ name: "", email: "", phone: "", message: "" });
      setPrivacyAccepted(false);
      setSelectedSlot("");
      toast({
        title: "Appuntamento confermato",
        description: "Ti abbiamo aggiunto in calendario. A presto in showroom!",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Errore",
        description: err?.message || "Riprova tra qualche istante.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  if (confirmed) {
    return (
      <div className="rounded-sm border border-brand-brass/40 bg-card p-10 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-brass" />
        <h3 className="mt-6 font-display text-3xl">Appuntamento confermato</h3>
        <p className="mt-3 text-muted-foreground">
          Ti aspettiamo il{" "}
          <strong className="text-foreground">
            {format(new Date(confirmed.date), "EEEE d MMMM yyyy", { locale: it })}
          </strong>{" "}
          alle <strong className="text-foreground">{confirmed.slot}</strong> nel nostro
          showroom di San Giorgio Ionico.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Riceverai un invito via email per il tuo calendario.
        </p>
        <button
          onClick={() => setConfirmed(null)}
          className="mt-6 text-sm font-medium uppercase tracking-widest text-brand-brass hover:text-brand-brass-light"
        >
          Prenota un altro appuntamento
        </button>
      </div>
    );
  }

  return (
    <form
      id="prenota"
      onSubmit={handleSubmit}
      className={cn("scroll-mt-24 space-y-6 rounded-sm border border-border bg-card p-8 shadow-soft md:p-10", className)}
    >

      <div>
        <h3 className="font-display text-2xl">{booking.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
          {booking.description}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Giorno
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start gap-2 rounded-sm border-input bg-transparent font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-4 w-4 text-brand-brass" />
                {date
                  ? format(date, "EEEE d MMMM yyyy", { locale: it })
                  : "Seleziona una data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={it}
                weekStartsOn={1}
                disabled={(d) => {
                  if (d < todayMidnight) return true;
                  if (!allowedWeekdays.has(d.getDay())) return true;
                  if (isClosed(d)) return true;
                  return false;
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Orario
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(loadingSlots
              ? fallbackSlots.map((s) => ({ ...s, label: "..." }))
              : slots.length
                ? slots
                : fallbackSlots
            ).map((s, i) => {
              const isSelected = selectedSlot === s.label;
              const disabled = !date || loadingSlots || !s.available;
              return (
                <button
                  key={s.label + i}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedSlot(s.label)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-sm border px-2 py-3 text-sm font-medium transition-smooth",
                    isSelected
                      ? "border-brand-brass bg-brand-brass text-accent-foreground shadow-brass"
                      : "border-input bg-transparent text-foreground hover:border-brand-brass",
                    disabled && "cursor-not-allowed opacity-40 hover:border-input",
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
          {date && !loadingSlots && slots.length > 0 && slots.every((s) => !s.available) && (
            <p className="mt-2 text-xs text-muted-foreground">
              Nessuno slot disponibile in questa data. Prova un altro giorno.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Nome e Cognome
          </label>
          <input
            required
            id="bk-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
          />
        </div>
        <div>
          <label htmlFor="bk-phone" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
            Telefono
          </label>
          <input
            required
            id="bk-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
          />
        </div>
      </div>
      <div>
        <label htmlFor="bk-email" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
          Email
        </label>
        <input
          required
          id="bk-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
        />
      </div>
      <div>
        <label htmlFor="bk-msg" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
          Cosa vorresti vedere? (opzionale)
        </label>
        <textarea
          id="bk-msg"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Es. cucine moderne, camere Le Fablier..."
          className="w-full resize-none border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus:border-brand-brass"
        />
      </div>

      <label htmlFor="bk-privacy" className="flex items-start gap-3 text-xs text-muted-foreground">
        <input
          required
          id="bk-privacy"
          type="checkbox"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border-input accent-brand-brass"
        />
        <span>
          Ho letto e accetto l'{" "}
          <Link to="/privacy-policy" target="_blank" className="underline hover:text-foreground">
            Informativa Privacy
          </Link>
          . I dati inseriti (nome, email, telefono e messaggio) sono usati per gestire la
          prenotazione e vengono condivisi con i fornitori che ci permettono di erogare questo
          servizio (calendario appuntamenti Google e infrastruttura del sito).
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !date || !selectedSlot || !privacyAccepted}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Conferma in corso..." : "Conferma appuntamento"}
        <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
      </button>
    </form>
  );
};
