import { ArrowRight } from "lucide-react";

const stats = [
  { n: "20+", l: "Anni di esperienza" },
  { n: "1000+", l: "Case arredate" },
  { n: "100%", l: "Made in Italy" },
];

export const Story = () => {
  return (
    <section id="storia" className="relative overflow-hidden bg-brand-walnut py-24 text-brand-cream md:py-32">
      <div className="container mx-auto grid gap-16 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-brand-brass-light">
            La nostra storia
          </span>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
            Tradizione, design,
            <span className="italic text-brand-brass-light"> passione pugliese</span>.
          </h2>
          <div className="mt-8 space-y-5 text-brand-cream/85 md:text-lg">
            <p>
              Franchini Arredamenti nasce dalla collaborazione con
              <span className="text-brand-cream font-medium"> Stilcucine</span>, azienda leader che da
              sempre pone al centro la soddisfazione del cliente, progettando e costruendo cucine su misura.
            </p>
            <p>
              Siamo il marchio di supporto per l'arredamento completo della casa: dalla cucina alla camera,
              dal living al guardaroba. Un unico interlocutore, un unico progetto, un risultato armonioso.
            </p>
          </div>

          <a
            href="#contatti"
            className="group mt-10 inline-flex items-center gap-2 border-b border-brand-brass-light pb-2 text-sm uppercase tracking-widest text-brand-brass-light transition-smooth hover:gap-4"
          >
            Vieni a trovarci in showroom
            <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-px bg-brand-cream/20 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.l}
              className="bg-brand-walnut p-8 text-center md:p-10"
            >
              <div className="font-display text-5xl text-brand-brass-light md:text-6xl">
                {s.n}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-brand-cream/70">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
