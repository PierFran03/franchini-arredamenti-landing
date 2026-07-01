import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";
import { AppointmentBooking } from "./AppointmentBooking";
import showroomFacade from "@/assets/showroom-facade.jpg";

export const Contact = () => {
  const { contact } = useSiteData();



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

          <div className="lg:col-span-3">
            <AppointmentBooking />
          </div>

        </div>
      </div>
    </section>
  );
};
