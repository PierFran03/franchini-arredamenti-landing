import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteData } from "@/hooks/useSiteData";

export const Contact = () => {
  const { toast } = useToast();
  const { contact } = useSiteData();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent("Richiesta informazioni dal sito");
    const body = encodeURIComponent(
      `Nome: ${data.get("name")}\nTelefono: ${data.get("phone")}\nEmail: ${data.get("email")}\n\nMessaggio:\n${data.get("message")}`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Apertura email in corso",
        description: "Si aprirà il tuo client di posta con il messaggio precompilato.",
      });
      form.reset();
    }, 600);
  };

  return (
    <section id="contatti" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-brass">
            Parliamone
          </span>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
            Inizia a progettare
            <span className="italic text-brand-brass"> la tua casa</span>.
          </h2>
          <p className="mt-6 text-muted-foreground md:text-lg">
            Raccontaci la tua idea: ti ricontatteremo per un appuntamento gratuito
            in showroom o un sopralluogo a domicilio.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-sm bg-brand-walnut p-8 text-brand-cream shadow-elegant">
              <h3 className="font-display text-2xl">Showroom</h3>
              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 shrink-0 text-brand-brass-light" />
                  <div>
                    <div className="font-medium">{contact.address}</div>
                  </div>
                </div>
                <a href={contact.phone_href} className="flex gap-4 transition-smooth hover:text-brand-brass-light">
                  <Phone className="h-5 w-5 shrink-0 text-brand-brass-light" />
                  <div className="font-medium">{contact.phone}</div>
                </a>
                <a href={`mailto:${contact.email}`} className="flex gap-4 transition-smooth hover:text-brand-brass-light">
                  <Mail className="h-5 w-5 shrink-0 text-brand-brass-light" />
                  <div className="font-medium break-all">{contact.email}</div>
                </a>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 shrink-0 text-brand-brass-light" />
                  <div className="space-y-1 text-sm whitespace-pre-line">{contact.hours}</div>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Via+Roma+61+San+Giorgio+Ionico"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-sm border border-border bg-card px-6 py-5 transition-smooth hover:border-brand-brass"
            >
              <span className="text-sm font-medium uppercase tracking-widest">
                Apri in Google Maps
              </span>
              <ArrowRight className="h-4 w-4 text-brand-brass transition-smooth group-hover:translate-x-1" />
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-sm border border-border bg-card p-8 shadow-soft lg:col-span-3 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Nome e Cognome</label>
                <input
                  required
                  id="name"
                  name="name"
                  type="text"
                  className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Telefono</label>
                <input
                  required
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                required
                id="email"
                name="email"
                type="email"
                className="w-full border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth focus:border-brand-brass"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Cosa vorresti arredare?</label>
              <textarea
                required
                id="message"
                name="message"
                rows={4}
                placeholder="Racconta brevemente il tuo progetto..."
                className="w-full resize-none border-b border-input bg-transparent py-3 text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus:border-brand-brass"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light disabled:opacity-60 sm:w-auto"
            >
              {sending ? "Invio..." : "Invia richiesta"}
              <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
            </button>

            <p className="text-xs text-muted-foreground">
              Inviando il modulo accetti di essere ricontattato. I tuoi dati non saranno condivisi con terzi.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
