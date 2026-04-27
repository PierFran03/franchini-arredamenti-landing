import { ArrowUpRight } from "lucide-react";
import cucine from "@/assets/category-cucine.jpg";
import camere from "@/assets/category-camere.jpg";
import living from "@/assets/category-living.jpg";
import armadi from "@/assets/category-armadi.jpg";

const collections = [
  {
    title: "Cucine su Misura",
    desc: "In collaborazione con Stilcucine, progettiamo cucine pensate per la tua quotidianità.",
    image: cucine,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Camere da Letto",
    desc: "Eleganza e comfort: dal letto Dress a Biplano, fino alle collezioni Le Fablier.",
    image: camere,
    span: "",
  },
  {
    title: "Armadi & Cabine",
    desc: "Soluzioni LINEAR in vetro o classiche Le Gemme, su misura.",
    image: armadi,
    span: "",
  },
  {
    title: "Living & Boiserie",
    desc: "Pareti rivestite, sofà e complementi che danno carattere all'ambiente.",
    image: living,
    span: "lg:col-span-2",
  },
];

export const Collections = () => {
  return (
    <section id="collezioni" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-brass">
            Le nostre collezioni
          </span>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
            Ogni stanza, una storia
            <span className="italic text-brand-brass"> da raccontare</span>.
          </h2>
          <p className="mt-6 text-muted-foreground md:text-lg">
            Selezioniamo i migliori marchi italiani — Le Fablier, Stilcucine, Fimar — e li abbiniamo
            a soluzioni su misura per dare vita ad ambienti unici.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">
          {collections.map((c) => (
            <a
              key={c.title}
              href="#contatti"
              className={`group relative overflow-hidden rounded-sm shadow-soft transition-elegant hover:shadow-elegant ${c.span} min-h-[280px]`}
            >
              <img
                src={c.image}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover transition-elegant group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-walnut-deep/90 via-brand-walnut-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-brand-cream md:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-brand-cream/80">
                      {c.desc}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-brass text-accent-foreground transition-smooth group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
