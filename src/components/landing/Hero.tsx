import { ArrowRight, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-showroom.jpg";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Franchini Arredamenti — Showroom in Puglia"
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Showroom Franchini Arredamenti — camera da letto di design Made in Italy"
          className="h-full w-full object-cover animate-slow-zoom"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-32 text-center">
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-brand-cream/30 bg-brand-walnut-deep/30 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-brass" />
          <span className="text-xs uppercase tracking-[0.3em] text-brand-cream/90">
            Dal cuore della Puglia · Made in Italy
          </span>
        </div>

        <h1 className="animate-fade-up font-display text-5xl leading-[1.05] text-brand-cream text-balance sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-5xl">
          La tua casa,
          <br />
          <span className="italic text-brand-brass-light">su misura</span> da oltre vent'anni.
        </h1>

        <p
          className="animate-fade-up mt-8 max-w-2xl text-lg text-brand-cream/90 text-balance md:text-xl"
          style={{ animationDelay: "0.15s" }}
        >
          Cucine, camere, living e armadi disegnati per la tua vita.
          Tradizione artigiana, design contemporaneo, assistenza completa
          dal progetto al montaggio.
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#contatti"
            className="group inline-flex items-center justify-center gap-2 rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light"
          >
            Richiedi un preventivo
            <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
          </a>
          <a
            href="#collezioni"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-brand-cream/50 bg-brand-walnut-deep/20 px-8 py-4 text-sm font-medium uppercase tracking-widest text-brand-cream backdrop-blur-sm transition-smooth hover:bg-brand-cream hover:text-brand-walnut"
          >
            Scopri le collezioni
          </a>
        </div>

        <a
          href="#contatti"
          className="animate-fade-up mt-12 inline-flex items-center gap-2 text-sm text-brand-cream/80 transition-smooth hover:text-brand-brass-light"
          style={{ animationDelay: "0.45s" }}
        >
          <MapPin className="h-4 w-4" />
          Via Roma 61/63 · San Giorgio Ionico (TA)
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="h-12 w-px animate-pulse bg-brand-cream/50" />
      </div>
    </section>
  );
};
