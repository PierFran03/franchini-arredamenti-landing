import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, CalendarOff } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

type Closure = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
};

export const ClosuresManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Closure[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ start_date: "", end_date: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("calendar_closures")
      .select("*")
      .order("start_date", { ascending: true });
    if (error) {
      toast({ title: "Errore caricamento", description: error.message, variant: "destructive" });
    } else {
      setItems((data as Closure[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!form.start_date || !form.end_date) {
      toast({ title: "Date obbligatorie", description: "Inserisci data inizio e fine.", variant: "destructive" });
      return;
    }
    if (form.end_date < form.start_date) {
      toast({ title: "Intervallo non valido", description: "La data di fine deve essere dopo quella di inizio.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("calendar_closures").insert({
      start_date: form.start_date,
      end_date: form.end_date,
      reason: form.reason.trim(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Chiusura aggiunta" });
    setForm({ start_date: "", end_date: "", reason: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Rimuovere questa chiusura?")) return;
    const { error } = await supabase.from("calendar_closures").delete().eq("id", id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Chiusura rimossa" });
    load();
  };

  const fmt = (d: string) => format(new Date(d + "T12:00:00"), "d MMM yyyy", { locale: it });

  return (
    <section className="rounded-sm border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <CalendarOff className="h-5 w-5 text-brand-brass" />
        <h2 className="font-display text-2xl">Chiusure showroom</h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Aggiungi i periodi in cui lo showroom è chiuso (ferie, festività, chiusure straordinarie).
        In queste date il calendario di prenotazione non sarà selezionabile.
      </p>

      <div className="mb-6 grid gap-3 rounded-sm border border-dashed border-brand-brass/40 p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Dal</span>
          <input type="date" value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-brass" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Al</span>
          <input type="date" value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-brass" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Motivo (opzionale)</span>
          <input type="text" value={form.reason} placeholder="Es. Ferie estive"
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-brass" />
        </label>
        <button onClick={add} disabled={saving}
          className="inline-flex items-end justify-center gap-2 rounded-sm bg-brand-brass px-4 py-2 text-xs uppercase tracking-widest text-accent-foreground shadow-brass hover:bg-brand-brass-light disabled:opacity-60">
          <Plus className="h-3.5 w-3.5" /> Aggiungi
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Caricamento...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nessuna chiusura programmata.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="font-medium">
                  {c.start_date === c.end_date ? fmt(c.start_date) : `${fmt(c.start_date)} → ${fmt(c.end_date)}`}
                </div>
                {c.reason && <div className="text-xs text-muted-foreground">{c.reason}</div>}
              </div>
              <button onClick={() => remove(c.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
