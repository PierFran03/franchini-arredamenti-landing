import { Sparkles, ArrowRight } from "lucide-react";

export const Promo = () => {
  return (
    <section className="bg-gradient-warm py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-sm border border-brand-brass/30 bg-card p-8 shadow-elegant md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-brass/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-brass/10 px-4 py-1.5 text-xs uppercase tracking-widest text-brand-brass">
              <Sparkles className="h-3.5 w-3.5" />
              Promozione attiva
            </div>
            <h2 className="mt-6 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
              Le Fablier
              <span className="italic text-brand-brass"> Al Primo Sguardo</span>.
            </h2>
            <p className="mt-6 max-w-2xl text-muted-foreground md:text-lg">
              Scopri le collezioni Le Fablier in promozione esclusiva nel nostro showroom di
              San Giorgio Ionico. Camere da letto, armadi e living dell'iconico marchio italiano,
              a condizioni dedicate.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="tel:+390992233295"
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-brand-walnut px-8 py-4 text-sm font-medium uppercase tracking-widest text-brand-cream transition-smooth hover:bg-brand-walnut-deep"
              >
                Prenota una visita
                <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
              </a>
              <a
                href="#contatti"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-brand-walnut/30 px-8 py-4 text-sm font-medium uppercase tracking-widest text-brand-walnut transition-smooth hover:bg-brand-walnut hover:text-brand-cream"
              >
                Scrivici ora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
