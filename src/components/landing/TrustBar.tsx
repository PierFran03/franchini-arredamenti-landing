import { Truck, Wrench, Headphones, Compass } from "lucide-react";

const items = [
  { icon: Compass, label: "Progettazione", desc: "Studio personalizzato dei tuoi spazi" },
  { icon: Truck, label: "Trasporto", desc: "Consegna puntuale in tutta la Puglia" },
  { icon: Wrench, label: "Montaggio", desc: "Installazione professionale e curata" },
  { icon: Headphones, label: "Assistenza", desc: "Supporto post-vendita garantito" },
];

export const TrustBar = () => {
  return (
    <section
      id="servizi"
      className="border-y border-border bg-secondary/50 py-14"
      aria-label="I nostri servizi"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-walnut text-brand-cream">
                <Icon className="h-6 w-6" strokeWidth={1.4} />
              </div>
              <div className="font-display text-2xl text-foreground">{label}</div>
              <p className="mt-1 max-w-[200px] text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
